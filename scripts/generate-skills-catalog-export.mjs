#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  activeSkillPaths,
  fingerprintFiles,
  gitFiles,
  listPacks,
  parseSkill,
  readJson as readCatalogJson,
  readTextFromIndex
} from "./catalog/index.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exportRoot = path.join(repoRoot, "exports", "skills-catalog", "v1");
const schemaVersion = "skills-catalog.v1";
const manifestRelativePath = "packages/skillpacks/dist/skillpacks-manifest.json";
const packageJsonRelativePath = "packages/skillpacks/package.json";

function git(args, fallback = null) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return fallback;
  }
}

function readJsonFromIndex(relativePath) {
  const text = readTextFromIndex(repoRoot, relativePath);
  return text ? JSON.parse(text) : null;
}

function readExistingExport(fileName) {
  const absolutePath = path.join(exportRoot, fileName);
  if (!existsSync(absolutePath)) return null;
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch {
    return null;
  }
}

function withExportMetadata(fileName, sourceFingerprint, sourcePaths, payload) {
  const existing = readExistingExport(fileName);
  const unchanged = existing?.source_fingerprint === sourceFingerprint;
  return {
    schema_version: schemaVersion,
    source_commit: unchanged
      ? existing.source_commit
      : git(["rev-parse", "HEAD"], "unknown"),
    generated_at: unchanged
      ? existing.generated_at
      : new Date().toISOString(),
    source_fingerprint: sourceFingerprint,
    source_count: sourcePaths.length,
    ...payload
  };
}

function writeJson(fileName, value) {
  mkdirSync(exportRoot, { recursive: true });
  writeFileSync(path.join(exportRoot, fileName), `${JSON.stringify(value, null, 2)}\n`);
  console.log(`Wrote ${path.relative(repoRoot, path.join(exportRoot, fileName))}`);
}

function normalizeRepoUrl(remoteUrl) {
  if (!remoteUrl) return null;
  if (remoteUrl.startsWith("git@github.com:")) {
    return `https://github.com/${remoteUrl.slice("git@github.com:".length).replace(/\.git$/, "")}`;
  }
  return remoteUrl.replace(/\.git$/, "");
}

function trackedStatus(relativePath, files) {
  return {
    path: relativePath,
    tracked: files.includes(relativePath),
    exists: existsSync(path.join(repoRoot, relativePath))
  };
}

function recentHistoryEntries() {
  if (!existsSync(path.join(repoRoot, "tasks", "history.md"))) return [];
  const text = readTextFromIndex(repoRoot, "tasks/history.md") || "";
  return text
    .split("\n")
    .filter((line) => /^##\s+\d{4}-\d{2}-\d{2}/.test(line))
    .slice(0, 8)
    .map((line) => line.replace(/^##\s+/, "").trim());
}

function buildDecksAndSets(manifest, skills) {
  const manifestDecks = manifest?.decks ?? [];

  const resolveCardId = (deck, card) => {
    const match = skills.find(
      (skill) =>
        deck.full_packs.includes(skill.pack) &&
        (skill.mirrorKey || skill.name) === card,
    );
    return match ? match.id : null;
  };

  const decks = manifestDecks.map((deck) => ({
    slug: deck.name,
    name: deck.title,
    domain: deck.domain,
    tempo: deck.tempo,
    phases: (deck.phases ?? []).map((phase) => ({
      key: phase.key,
      name: phase.name,
      suggested_card_ids: (phase.cards ?? [])
        .map((card) => resolveCardId(deck, card))
        .filter(Boolean),
    })),
  }));

  const setsByDomain = new Map();
  for (const deck of manifestDecks) {
    const entry = setsByDomain.get(deck.domain) ?? {
      domain: deck.domain,
      decks: [],
      packs: [],
    };
    entry.decks.push(deck.name);
    entry.packs.push(...(deck.full_packs ?? []));
    setsByDomain.set(deck.domain, entry);
  }

  const sets = Array.from(setsByDomain.values()).map((set) => ({
    domain: set.domain,
    decks: set.decks,
    packs: Array.from(new Set(set.packs)).sort(),
  }));

  return { decks, sets };
}

function packageManifestSummary(manifest, packageJson) {
  return {
    package: {
      name: packageJson?.name || manifest?.package?.name || null,
      version: packageJson?.version || manifest?.package?.version || null,
      license: packageJson?.license || null,
      repository: packageJson?.repository || null,
      homepage: packageJson?.homepage || null
    },
    manifest: {
      schema_version: manifest?.schema_version || null,
      package: manifest?.package || null,
      source_fingerprint: manifest?.source_fingerprint || null,
      skill_count: Array.isArray(manifest?.skills) ? manifest.skills.length : 0,
      pack_count: Array.isArray(manifest?.packs) ? manifest.packs.length : 0,
      deck_count: Array.isArray(manifest?.decks) ? manifest.decks.length : 0,
      deck_names: Array.isArray(manifest?.decks)
        ? manifest.decks.map((deck) => deck.name).filter(Boolean).sort()
        : []
    }
  };
}

function buildProof(files, sourceFingerprint, sourcePaths) {
  const remoteUrl = git(["remote", "get-url", "origin"], null);
  const repositoryUrl = normalizeRepoUrl(remoteUrl);
  const proofArtifacts = [
    { id: "catalog-export", title: "Skills catalog export", path: "exports/skills-catalog/v1/catalog.json", kind: "export" },
    { id: "package-manifest", title: "Skillpacks package manifest", path: manifestRelativePath, kind: "package" },
    { id: "skills-reference", title: "Skills reference", path: "docs/skills-reference.md", kind: "reference" },
    { id: "quality-gate", title: "Quality gate contract", path: "docs/quality-gate-contract.md", kind: "quality" },
    { id: "dogfood-history", title: "Dogfood changelog", path: "tasks/history.md", kind: "history" }
  ];

  const validationScripts = [
    {
      id: "skills-catalog-export",
      title: "Skills catalog export freshness",
      command: "scripts/validate-skills-catalog-export.sh",
      path: "scripts/validate-skills-catalog-export.sh"
    },
    {
      id: "package-build-check",
      title: "Skillpacks package build boundary",
      command: "npm --workspace skillpacks run build:check",
      path: "packages/skillpacks/scripts/build-package.mjs"
    },
    {
      id: "skill-versions",
      title: "Skill version metadata",
      command: "./scripts/skill-versions.sh --missing",
      path: "scripts/skill-versions.sh"
    },
    {
      id: "skill-mirror-parity",
      title: "Claude/Codex mirror parity",
      command: "./scripts/skill-mirror-parity-audit.sh",
      path: "scripts/skill-mirror-parity-audit.sh"
    }
  ];

  return withExportMetadata("proof.json", sourceFingerprint, sourcePaths, {
    repository: {
      remote_url: remoteUrl,
      url: repositoryUrl,
      branch: git(["branch", "--show-current"], null),
      ref_policy: "Consumers should pin SKILLS_REPO_REF to a tag or commit SHA for releases and deployments."
    },
    proof_artifacts: proofArtifacts.map((artifact) => ({
      ...artifact,
      ...trackedStatus(artifact.path, files)
    })),
    validation_scripts: validationScripts.map((script) => ({
      ...script,
      ...trackedStatus(script.path, files)
    })),
    recent_history_entries: recentHistoryEntries(),
    boundaries: [
      "agentic-skills owns canonical skills/package source and versioned export artifacts.",
      "Skills Showcase website assets are generated and deployed from the agentic-skills-showcase repository.",
      "Benchmark runs, reports, matrices, and summary exports are generated from the agentic-skills-benchmarks repository.",
      "GitHub Actions are not part of the default validation or deploy contract."
    ]
  });
}

function main() {
  const files = gitFiles(repoRoot);
  const skillPaths = activeSkillPaths(files);
  const packPaths = files.filter((file) => /^packs\/[^/]+\/PACK\.md$/.test(file));
  const sourcePaths = [
    ...skillPaths,
    ...packPaths,
    manifestRelativePath,
    packageJsonRelativePath
  ].sort();

  const skills = skillPaths
    .map((skillPath) => parseSkill(repoRoot, skillPath, { source: "index" }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const packs = listPacks(repoRoot, files, skills, { source: "index" });
  const manifest = readJsonFromIndex(manifestRelativePath) || readCatalogJson(repoRoot, manifestRelativePath);
  const packageJson = readJsonFromIndex(packageJsonRelativePath) || readCatalogJson(repoRoot, packageJsonRelativePath);
  const { decks, sets } = buildDecksAndSets(manifest, skills);
  const sourceFingerprint = fingerprintFiles(repoRoot, sourcePaths, { source: "index" });
  const packageSummary = packageManifestSummary(manifest, packageJson);

  const catalog = withExportMetadata("catalog.json", sourceFingerprint, sourcePaths, {
    skill_count: skills.length,
    pack_count: packs.length,
    deck_count: decks.length,
    set_count: sets.length,
    skills,
    packs,
    decks,
    sets
  });

  const manifestExport = withExportMetadata("manifest.json", sourceFingerprint, sourcePaths, {
    exports: {
      catalog: "exports/skills-catalog/v1/catalog.json",
      proof: "exports/skills-catalog/v1/proof.json",
      manifest: "exports/skills-catalog/v1/manifest.json"
    },
    ...packageSummary
  });

  const proof = buildProof(files, sourceFingerprint, sourcePaths);

  writeJson("catalog.json", catalog);
  writeJson("proof.json", proof);
  writeJson("manifest.json", manifestExport);
}

main();
