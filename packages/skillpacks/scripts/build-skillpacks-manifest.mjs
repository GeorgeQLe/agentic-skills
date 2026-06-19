#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  activeSkillPaths,
  contentHash,
  discoverArchiveVersions,
  fileFingerprint,
  gitFiles,
  listSkills,
  packManifestPaths,
  parsePack,
  prefetchIndex,
  unique
} from "../../../scripts/catalog/index.mjs";

// The committed manifest must be a pure function of the git index (what the
// committing session is staging), so a concurrent session's unstaged edits on
// the shared working tree never leak into it. All content reads below go
// through the index; discovery (gitFiles) already reads the index.
const MANIFEST_SOURCE = { source: "index" };

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../..");
const manifestRelativePath = "packages/skillpacks/dist/skillpacks-manifest.json";
const manifestPath = path.join(repoRoot, manifestRelativePath);
const checkMode = process.argv.includes("--check");

const allowedArgs = new Set(["--check"]);
for (const arg of process.argv.slice(2)) {
  if (!allowedArgs.has(arg)) {
    console.error(`Unknown argument '${arg}'. Usage: node packages/skillpacks/scripts/build-skillpacks-manifest.mjs [--check]`);
    process.exit(1);
  }
}

const deckDefinitions = [
  {
    name: "business-afps",
    title: "Business AFPS",
    domain: "business",
    tempo: "deliberate",
    default_packs: ["business-research"],
    full_packs: ["business-research", "customer-lifecycle", "business-growth", "business-ops"],
    tags: ["deck:business-afps", "stage:discovery"],
    full_tags: ["deck:business-afps", "stage:discovery", "lane:full"]
  },
  {
    name: "devtool-afps",
    title: "Devtool AFPS",
    domain: "devtool",
    tempo: "deliberate",
    default_packs: ["devtool"],
    full_packs: ["devtool"],
    tags: ["deck:devtool-afps"],
    full_tags: ["deck:devtool-afps"]
  },
  {
    name: "game-afps",
    title: "Game AFPS",
    domain: "game",
    tempo: "deliberate",
    default_packs: ["game"],
    full_packs: ["game"],
    tags: ["deck:game-afps"],
    full_tags: ["deck:game-afps"]
  },
  {
    name: "ord",
    title: "ORD",
    domain: "devtool",
    tempo: "rapid",
    default_packs: ["ord"],
    full_packs: ["ord"],
    tags: ["deck:ord"],
    full_tags: ["deck:ord"]
  },
  {
    name: "vard",
    title: "VARD",
    domain: "business",
    tempo: "rapid",
    default_packs: ["vard"],
    full_packs: ["vard"],
    tags: ["deck:vard"],
    full_tags: ["deck:vard"]
  }
];

function readPackageJson() {
  return JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
}

function skillContentHash(skillPath) {
  return contentHash(repoRoot, skillPath, MANIFEST_SOURCE);
}

function packMetadataByName(files) {
  return new Map(
    packManifestPaths(files).map((packPath) => {
      const pack = parsePack(repoRoot, packPath, MANIFEST_SOURCE);
      return [pack.name, pack];
    })
  );
}

function deckMembershipsForPack(packName) {
  if (!packName) return [];
  return deckDefinitions
    .filter((deck) => {
      return deck.default_packs.includes(packName) || deck.full_packs.includes(packName);
    })
    .map((deck) => deck.name)
    .sort();
}

function buildDecks() {
  return deckDefinitions
    .map((deck) => {
      const defaultPacks = [...deck.default_packs];
      const fullPacks = [...deck.full_packs];
      const tags = [...deck.tags];
      const fullTags = [...deck.full_tags];

      return {
        name: deck.name,
        title: deck.title,
        domain: deck.domain,
        tempo: deck.tempo,
        default_packs: defaultPacks,
        full_packs: fullPacks,
        tags,
        full_tags: fullTags,
        package_list: {
          default: defaultPacks,
          full: fullPacks
        },
        registry_tags: {
          default: tags,
          full: fullTags
        }
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function buildPacks(files, skills) {
  const metadata = packMetadataByName(files);
  const packNames = unique([
    ...metadata.keys(),
    ...skills.map((skill) => skill.pack).filter(Boolean)
  ]);

  return packNames.map((name) => {
    const packSkills = skills.filter((skill) => skill.pack === name && isInstallableSkill(skill));
    const packSkillNames = unique(packSkills.map((skill) => skill.name));
    const pack = metadata.get(name);

    return {
      name,
      title: pack ? pack.title : null,
      description: pack ? pack.description : null,
      path: `packs/${name}`,
      metadata_path: pack ? pack.path : null,
      status: "active",
      tools: unique(packSkills.map((skill) => skill.platform)),
      skills: packSkillNames,
      skill_count: packSkillNames.length
    };
  });
}

function isInstallableSkill(skill) {
  if (skill.scope === "base") {
    return true;
  }
  if (skill.scope !== "pack") {
    return false;
  }
  return /^packs\/[^/]+\/(?:claude|codex)\/[^/]+\/SKILL\.md$/.test(skill.path);
}

function buildSkills(skills, files) {
  return skills
    .map((skill) => {
      return {
        id: skill.id,
        name: skill.name,
        scope: skill.scope,
        pack: skill.pack,
        platform: skill.platform,
        version: skill.version,
        path: skill.path,
        installable: isInstallableSkill(skill),
        content_sha256: skillContentHash(skill.path),
        archive_versions: discoverArchiveVersions(repoRoot, skill.path, { ...MANIFEST_SOURCE, files }),
        command: skill.command,
        deck_memberships: deckMembershipsForPack(skill.pack)
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

function buildManifest() {
  const files = gitFiles(repoRoot);
  const archivePaths = files.filter((file) => /\/archive\/[^/]+\/SKILL\.md$/.test(file));
  const manifestSources = unique([
    ...activeSkillPaths(files),
    ...packManifestPaths(files),
    "docs/decks.md",
    "packages/skillpacks/package.json",
    "packages/skillpacks/scripts/build-skillpacks-manifest.mjs",
    "scripts/catalog/index.mjs"
  ]);

  // Warm the index cache once so per-skill content reads below cost a single
  // `git cat-file` spawn rather than one per file.
  prefetchIndex(repoRoot, unique([...manifestSources, ...archivePaths]));

  const skills = listSkills(repoRoot, files, MANIFEST_SOURCE);
  const packageJson = readPackageJson();

  const manifest = {
    schema_version: 1,
    package: {
      name: packageJson.name,
      version: packageJson.version
    },
    source_fingerprint: fileFingerprint(repoRoot, manifestSources, MANIFEST_SOURCE),
    packs: buildPacks(files, skills),
    skills: buildSkills(skills, files),
    decks: buildDecks()
  };

  validateManifest(manifest);
  return manifest;
}

function validateArrayField(errors, deck, group, field) {
  const value = deck[group]?.[field];
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`deck '${deck.name}' is missing ${group}.${field}`);
  }
}

function validateManifest(manifest) {
  const errors = [];
  const activePackNames = new Set(manifest.packs.map((pack) => pack.name));

  for (const skill of manifest.skills) {
    if (!existsSync(path.join(repoRoot, skill.path))) {
      errors.push(`skill path is missing: ${skill.path}`);
    }
    if (!skill.version) {
      errors.push(`active skill lacks version: ${skill.path}`);
    }
  }

  for (const deck of manifest.decks) {
    validateArrayField(errors, deck, "package_list", "default");
    validateArrayField(errors, deck, "package_list", "full");
    validateArrayField(errors, deck, "registry_tags", "default");
    validateArrayField(errors, deck, "registry_tags", "full");

    for (const packName of unique([...deck.default_packs, ...deck.full_packs])) {
      if (!activePackNames.has(packName)) {
        errors.push(`deck '${deck.name}' references missing active pack directory: ${packName}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Manifest validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeOrCheckManifest() {
  const generated = stableJson(buildManifest());

  if (checkMode) {
    if (!existsSync(manifestPath)) {
      throw new Error(`Manifest is missing: ${manifestRelativePath}`);
    }
    const existing = readFileSync(manifestPath, "utf8");
    if (existing !== generated) {
      throw new Error(
        `Manifest is out of date: ${manifestRelativePath}. Run node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
      );
    }
    console.log(`Manifest check passed: ${manifestRelativePath}`);
    return;
  }

  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, generated);
  console.log(`Wrote ${manifestRelativePath}`);
}

try {
  writeOrCheckManifest();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
