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
  parseFrontmatter,
  parsePack,
  prefetchIndex,
  readTextFromIndex,
  unique
} from "../../../scripts/catalog/index.mjs";
import {
  isConventionAllowed,
  packageLaneFromEnv,
  releaseLaneAllowed,
  skillReleaseLaneFromIndex
} from "./release-lane.mjs";

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
const printMode = process.argv.includes("--print");
const packageLane = packageLaneFromEnv();

const allowedArgs = new Set(["--check", "--print"]);
for (const arg of process.argv.slice(2)) {
  if (!allowedArgs.has(arg)) {
    console.error(`Unknown argument '${arg}'. Usage: node packages/skillpacks/scripts/build-skillpacks-manifest.mjs [--check|--print]`);
    process.exit(1);
  }
}
if (checkMode && printMode) {
  console.error("Use only one of --check or --print.");
  process.exit(1);
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
    full_tags: ["deck:business-afps", "stage:discovery", "lane:full"],
    phases: [
      {
        key: "discover",
        name: "Discover",
        cards: [
          "competitive-analysis",
          "customer-discovery",
          "customer-feedback",
          "enterprise-icp",
          "lean-canvas",
          "positioning",
          "value-prop-canvas"
        ]
      },
      {
        key: "lifecycle",
        name: "Lifecycle",
        cards: [
          "conversion-map",
          "expansion-map",
          "journey-map",
          "lifecycle-metrics",
          "onboarding-map",
          "retention-map",
          "transaction-map"
        ]
      },
      {
        key: "grow",
        name: "Grow",
        cards: [
          "experiment",
          "growth-model",
          "gtm",
          "hook-model",
          "landing-copy",
          "metrics",
          "monetization",
          "pmf-assessment"
        ]
      },
      {
        key: "operate",
        name: "Operate",
        cards: [
          "assumption-tracker",
          "burn-rate",
          "cohort-review",
          "investor-update",
          "mvp-gap",
          "platform-strategy",
          "product-line",
          "reconcile-research",
          "repo-glossary",
          "retro",
          "risk-register",
          "runway-model",
          "scale-audit"
        ]
      }
    ]
  },
  {
    name: "devtool-afps",
    title: "Devtool AFPS",
    domain: "devtool",
    tempo: "deliberate",
    default_packs: ["devtool"],
    full_packs: ["devtool"],
    tags: ["deck:devtool-afps"],
    full_tags: ["deck:devtool-afps"],
    phases: [
      { key: "position", name: "Position", cards: ["devtool-positioning"] },
      { key: "adopt", name: "Adopt", cards: ["devtool-adoption", "devtool-user-map"] },
      {
        key: "journey",
        name: "Journey",
        cards: ["devtool-dx-journey", "devtool-workflow", "devtool-integration-map"]
      },
      { key: "docs", name: "Docs", cards: ["devtool-docs-audit"] },
      { key: "monetize", name: "Monetize", cards: ["devtool-monetization"] }
    ]
  },
  {
    name: "game-afps",
    title: "Game AFPS",
    domain: "game",
    tempo: "deliberate",
    default_packs: ["game"],
    full_packs: ["game"],
    tags: ["deck:game-afps"],
    full_tags: ["deck:game-afps"],
    phases: [
      {
        key: "align",
        name: "Align",
        cards: ["game-audience", "game-fantasy", "game-genre-map", "game-comparables"]
      },
      {
        key: "validate",
        name: "Validate",
        cards: [
          "game-core-loop",
          "game-prototype-test",
          "game-playtest-metrics",
          "game-store-page-test"
        ]
      },
      {
        key: "launch",
        name: "Launch",
        cards: ["game-launch", "game-roadmap", "game-workflow"]
      }
    ]
  },
  {
    name: "ord",
    title: "ORD",
    domain: "devtool",
    tempo: "rapid",
    default_packs: ["ord"],
    full_packs: ["ord"],
    tags: ["deck:ord"],
    full_tags: ["deck:ord"],
    phases: [
      { key: "scan", name: "Scan", cards: ["ord-scan"] },
      { key: "align", name: "Align", cards: ["ord-align"] },
      { key: "ship", name: "Ship", cards: ["ord-ship"] },
      { key: "traction", name: "Traction", cards: ["ord-traction"] }
    ]
  },
  {
    name: "vard",
    title: "VARD",
    domain: "business",
    tempo: "rapid",
    default_packs: ["vard"],
    full_packs: ["vard"],
    tags: ["deck:vard"],
    full_tags: ["deck:vard"],
    phases: [
      { key: "scan", name: "Scan", cards: ["vard-scan"] },
      { key: "align", name: "Align", cards: ["vard-align"] },
      { key: "ship", name: "Ship", cards: ["vard-ship"] },
      { key: "traction", name: "Traction", cards: ["vard-traction"] }
    ]
  }
];

function readPackageJson() {
  return JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
}

function skillContentHash(skillPath) {
  return contentHash(repoRoot, skillPath, MANIFEST_SOURCE);
}

// Read deprecation metadata straight from the staged SKILL.md frontmatter so it
// rides on the manifest without leaking into the shared parseSkill() output
// (which the skills-showcase generator spreads verbatim).
function skillDeprecation(skillPath) {
  const fields = parseFrontmatter(readTextFromIndex(repoRoot, skillPath));
  return {
    deprecated: fields.deprecated === "true" || fields.deprecated === true,
    replaced_by: fields.replaced_by || null
  };
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
      const phases = (deck.phases ?? []).map((phase) => ({
        key: phase.key,
        name: phase.name,
        cards: [...phase.cards]
      }));

      return {
        name: deck.name,
        title: deck.title,
        domain: deck.domain,
        tempo: deck.tempo,
        default_packs: defaultPacks,
        full_packs: fullPacks,
        tags,
        full_tags: fullTags,
        phases,
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
    return /^packs\/base\/(?:claude|codex)\/[^/]+\/SKILL\.md$/.test(skill.path)
      || /^base\/(?:claude|codex)\/[^/]+\/SKILL\.md$/.test(skill.path);
  }
  if (skill.scope !== "pack") {
    return false;
  }
  return /^packs\/[^/]+\/(?:claude|codex)\/[^/]+\/SKILL\.md$/.test(skill.path);
}

function buildSkills(skills, files) {
  return skills
    .map((skill) => {
      const releaseLane = skillReleaseLaneFromIndex(repoRoot, skill.path);
      return {
        id: skill.id,
        name: skill.name,
        scope: skill.scope,
        pack: skill.pack,
        platform: skill.platform,
        version: skill.version,
        release_lane: releaseLane,
        ...skillDeprecation(skill.path),
        required_conventions: skill.requiredConventions,
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
  const laneSkillPaths = activeSkillPaths(files).filter((skillPath) => {
    return releaseLaneAllowed(skillReleaseLaneFromIndex(repoRoot, skillPath), packageLane);
  });
  const laneSkillPathSet = new Set(laneSkillPaths);
  const archivePaths = files.filter((file) => {
    if (!/\/archive\/[^/]+\/SKILL\.md$/.test(file)) return false;
    const activePath = file.replace(/\/archive\/[^/]+\/SKILL\.md$/, "/SKILL.md");
    return laneSkillPathSet.has(activePath);
  });
  const manifestSources = unique([
    ...laneSkillPaths,
    ...packManifestPaths(files),
    "docs/decks.md",
    "packages/skillpacks/package.json",
    "packages/skillpacks/scripts/build-skillpacks-manifest.mjs",
    "packages/skillpacks/scripts/release-lane.mjs",
    "scripts/catalog/index.mjs",
    "scripts/skill-convention-registry.mjs"
  ]);

  // Warm the index cache once so per-skill content reads below cost a single
  // `git cat-file` spawn rather than one per file.
  prefetchIndex(repoRoot, unique([...manifestSources, ...archivePaths]));

  const laneFiles = files.filter((file) => !activeSkillPaths(files).includes(file) || laneSkillPathSet.has(file));
  const skills = listSkills(repoRoot, laneFiles, MANIFEST_SOURCE);
  const packageJson = readPackageJson();

  const manifest = {
    schema_version: 1,
    package: {
      name: packageJson.name,
      version: packageJson.version,
      release_lane: packageLane
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

  // pack -> Set of installable skill names, the same resolution package_list
  // relies on, reused to assert every phase card is a real deck skill.
  const skillNamesByPack = new Map();
  for (const skill of manifest.skills) {
    if (!skill.pack || !skill.installable) continue;
    if (!skillNamesByPack.has(skill.pack)) skillNamesByPack.set(skill.pack, new Set());
    skillNamesByPack.get(skill.pack).add(skill.name);
  }

  for (const skill of manifest.skills) {
    if (!existsSync(path.join(repoRoot, skill.path))) {
      errors.push(`skill path is missing: ${skill.path}`);
    }
    if (!skill.version) {
      errors.push(`active skill lacks version: ${skill.path}`);
    }
    for (const conventionId of skill.required_conventions) {
      if (!isConventionAllowed(conventionId, manifest.package.release_lane)) {
        errors.push(`stable manifest includes ${skill.path}, which requires canary-only convention '${conventionId}'`);
      }
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

    if (!Array.isArray(deck.phases) || deck.phases.length === 0) {
      errors.push(`deck '${deck.name}' is missing phases`);
      continue;
    }
    // Every phase card must resolve to a skill that exists in one of the deck's
    // full_packs — the phase array is machine truth for the builder's columns.
    const deckSkillNames = new Set();
    for (const packName of deck.full_packs) {
      for (const skillName of skillNamesByPack.get(packName) ?? []) {
        deckSkillNames.add(skillName);
      }
    }
    for (const phase of deck.phases) {
      for (const card of phase.cards) {
        if (!deckSkillNames.has(card)) {
          errors.push(`deck ${deck.name} phase ${phase.key}: unknown card ${card}`);
        }
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

  if (printMode) {
    process.stdout.write(generated);
    return;
  }

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
