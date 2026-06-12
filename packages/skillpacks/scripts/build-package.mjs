#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  activeSkillPaths,
  fileFingerprint,
  gitFiles,
  listPacks,
  listSkills,
  packManifestPaths
} from "../../../scripts/catalog/index.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../..");
const buildRoot = path.join(packageRoot, "build");
const checkMode = process.argv.includes("--check");

const packageOwnedEntries = [
  { fromRoot: packageRoot, from: "bin", to: "bin" },
  { fromRoot: packageRoot, from: "src", to: "src" },
  { fromRoot: packageRoot, from: "scripts/prepublish-auth-check.mjs", to: "scripts/prepublish-auth-check.mjs" },
  { fromRoot: packageRoot, from: "dist/skillpacks-manifest.json", to: "dist/skillpacks-manifest.json" }
];

const repoOwnedEntries = [
  { fromRoot: repoRoot, from: "scripts/pack.sh", to: "scripts/pack.sh" },
  { fromRoot: repoRoot, from: "scripts/skill-links.sh", to: "scripts/skill-links.sh" },
  { fromRoot: repoRoot, from: "docs/decks.md", to: "docs/decks.md" },
  { fromRoot: repoRoot, from: "docs/packs.md", to: "docs/packs.md" },
  { fromRoot: repoRoot, from: "docs/QUICKSTART.md", to: "docs/QUICKSTART.md" },
  { fromRoot: repoRoot, from: "docs/skillpacks-npm-distribution.md", to: "docs/skillpacks-npm-distribution.md" },
  { fromRoot: repoRoot, from: "README.md", to: "README.md" },
  { fromRoot: repoRoot, from: "LICENSE", to: "LICENSE" },
  { fromRoot: repoRoot, from: "AGENTS.md", to: "AGENTS.md" },
  { fromRoot: repoRoot, from: "CLAUDE.md", to: "CLAUDE.md" },
  { fromRoot: repoRoot, from: "init.sh", to: "init.sh" }
];

const requiredBuildFiles = [
  "package.json",
  "bin/skillpacks.mjs",
  "dist/skillpacks-manifest.json",
  "src/cli/run-pack-script.mjs",
  "scripts/prepublish-auth-check.mjs",
  "scripts/pack.sh",
  "scripts/skill-links.sh",
  "init.sh",
  "LICENSE",
  "global/codex/pack/SKILL.md",
  "packs/code-quality/PACK.md"
];

const deniedBuildPaths = [
  "apps",
  "tasks",
  "prompts",
  "alignment",
  "tests",
  "docs/history"
];

const websiteOwnedGeneratedPaths = [
  "apps/skills-showcase/public/assets/skills-data.js",
  "apps/skills-showcase/public/assets/github-proof-data.js",
  "docs/skills-showcase/assets/skills-data.js",
  "docs/skills-showcase/assets/github-proof-data.js",
  "docs/benchmark-results-matrix.md"
];

function copyEntry({ fromRoot, from, to }) {
  const source = path.join(fromRoot, from);
  const target = path.join(buildRoot, to);
  if (!existsSync(source)) {
    throw new Error(`Missing package source: ${path.relative(repoRoot, source)}`);
  }

  mkdirSync(path.dirname(target), { recursive: true });
  const stats = statSync(source);
  if (stats.isDirectory()) {
    cpSync(source, target, {
      recursive: true,
      preserveTimestamps: true,
      dereference: false
    });
    return;
  }

  cpSync(source, target, {
    preserveTimestamps: true,
    dereference: false
  });
}

function copyTrackedPrefixes(files, prefixes) {
  const trackedFiles = files.filter((relativePath) => {
    return prefixes.some((prefix) => relativePath === prefix || relativePath.startsWith(`${prefix}/`));
  });

  for (const relativePath of trackedFiles) {
    copyEntry({ fromRoot: repoRoot, from: relativePath, to: relativePath });
  }
}

function stagedPackageJson() {
  const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  const allowedKeys = [
    "name",
    "version",
    "description",
    "type",
    "bin",
    "repository",
    "bugs",
    "homepage",
    "files",
    "keywords",
    "license",
    "engines"
  ];
  const staged = Object.fromEntries(
    allowedKeys
      .filter((key) => Object.prototype.hasOwnProperty.call(packageJson, key))
      .map((key) => [key, packageJson[key]])
  );

  if (packageJson.scripts?.prepublishOnly) {
    staged.scripts = {
      prepublishOnly: packageJson.scripts.prepublishOnly
    };
  }

  return staged;
}

function assertBuildBoundary() {
  for (const relativePath of requiredBuildFiles) {
    if (!existsSync(path.join(buildRoot, relativePath))) {
      throw new Error(`Package build is missing required file: ${relativePath}`);
    }
  }

  for (const relativePath of deniedBuildPaths) {
    if (existsSync(path.join(buildRoot, relativePath))) {
      throw new Error(`Package build includes denied path: ${relativePath}`);
    }
  }
}

function assertWebsiteBoundary(beforeFingerprint) {
  const afterFingerprint = fileFingerprint(repoRoot, websiteOwnedGeneratedPaths);
  if (beforeFingerprint !== afterFingerprint) {
    throw new Error(
      "Package build changed website-owned generated assets. Run website generation separately."
    );
  }
}

function buildPackage() {
  const websiteFingerprint = fileFingerprint(repoRoot, websiteOwnedGeneratedPaths);
  const files = gitFiles(repoRoot);
  const skills = listSkills(repoRoot, files);
  const packs = listPacks(repoRoot, files, skills);
  const sourceFingerprint = fileFingerprint(repoRoot, [
    ...activeSkillPaths(files),
    ...packManifestPaths(files),
    "scripts/pack.sh",
    "scripts/skill-links.sh",
    "init.sh"
  ]);

  rmSync(buildRoot, { recursive: true, force: true });
  mkdirSync(buildRoot, { recursive: true });

  for (const entry of packageOwnedEntries) {
    copyEntry(entry);
  }
  copyTrackedPrefixes(files, ["global", "packs"]);
  for (const entry of repoOwnedEntries) {
    copyEntry(entry);
  }

  writeFileSync(
    path.join(buildRoot, "package.json"),
    `${JSON.stringify(stagedPackageJson(), null, 2)}\n`
  );

  assertBuildBoundary();
  assertWebsiteBoundary(websiteFingerprint);

  console.log(
    `Staged skillpacks package at ${path.relative(repoRoot, buildRoot)} with ${skills.length} skills, ${packs.length} packs, and source fingerprint ${sourceFingerprint}.`
  );

  if (checkMode) {
    console.log("Package staging boundary check passed.");
  }
}

try {
  buildPackage();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
