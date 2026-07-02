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
import {
  MANAGED_CONVENTION_DOC_PACKAGE_ROOT,
  managedConventionDocEntries
} from "../../../scripts/skill-convention-registry.mjs";

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
  { fromRoot: repoRoot, from: "scripts/skill-convention-bundle-audit.mjs", to: "scripts/skill-convention-bundle-audit.mjs" },
  { fromRoot: repoRoot, from: "scripts/skill-convention-registry.mjs", to: "scripts/skill-convention-registry.mjs" },
  { fromRoot: repoRoot, from: "scripts/upgrade-alignment-page.mjs", to: "scripts/upgrade-alignment-page.mjs" },
  { fromRoot: repoRoot, from: "scripts/upgrade-interrogation-page.mjs", to: "scripts/upgrade-interrogation-page.mjs" },
  { fromRoot: repoRoot, from: "scripts/upgrade-design-tree-loop.mjs", to: "scripts/upgrade-design-tree-loop.mjs" },
  { fromRoot: repoRoot, from: "scripts/audit-alignment-pages.mjs", to: "scripts/audit-alignment-pages.mjs" },
  { fromRoot: repoRoot, from: "scripts/open-html-page.mjs", to: "scripts/open-html-page.mjs" },
  { fromRoot: repoRoot, from: "scripts/serve-alignment.mjs", to: "scripts/serve-alignment.mjs" },
  { fromRoot: repoRoot, from: "scripts/inject-tts.mjs", to: "scripts/inject-tts.mjs" },
  { fromRoot: repoRoot, from: "scripts/alignment-tts-kokoro.js", to: "scripts/alignment-tts-kokoro.js" },
  { fromRoot: repoRoot, from: "scripts/alignment-chart-snippets.js", to: "scripts/alignment-chart-snippets.js" },
  { fromRoot: repoRoot, from: "scripts/alignment-skip-list.txt", to: "scripts/alignment-skip-list.txt" },
  { fromRoot: repoRoot, from: "scripts/alignment-bespoke-list.txt", to: "scripts/alignment-bespoke-list.txt" },
  { fromRoot: repoRoot, from: "docs/alignment-page-convention.md", to: "assets/alignment-page-convention.md" },
  { fromRoot: repoRoot, from: "docs/interrogation-page-convention.md", to: "assets/interrogation-page-convention.md" },
  { fromRoot: repoRoot, from: "docs/design-tree-loop-convention.md", to: "assets/design-tree-loop-convention.md" },
  { fromRoot: repoRoot, from: "docs/social-post-convention.md", to: "assets/social-post-convention.md" },
  { fromRoot: repoRoot, from: "docs/social-video-content-convention.md", to: "assets/social-video-content-convention.md" },
  { fromRoot: repoRoot, from: "docs/social-ledger-convention.md", to: "assets/social-ledger-convention.md" },
  { fromRoot: repoRoot, from: "docs/social", to: "assets/social" },
  { fromRoot: repoRoot, from: "README.md", to: "README.md" },
  { fromRoot: repoRoot, from: "CHANGELOG.md", to: "CHANGELOG.md" },
  { fromRoot: repoRoot, from: "LICENSE", to: "LICENSE" }
];

const managedConventionDocEntriesForBuild = managedConventionDocEntries(repoRoot).map((entry) => ({
  fromRoot: repoRoot,
  from: entry.canonicalDoc,
  to: entry.packageAsset
}));

const requiredBuildFiles = [
  "package.json",
  "bin/skillpacks.mjs",
  "dist/skillpacks-manifest.json",
  "src/cli/run-pack-script.mjs",
  "scripts/prepublish-auth-check.mjs",
  "scripts/pack.sh",
  "scripts/skill-links.sh",
  "scripts/skill-convention-bundle-audit.mjs",
  "scripts/skill-convention-registry.mjs",
  "scripts/upgrade-alignment-page.mjs",
  "scripts/upgrade-interrogation-page.mjs",
  "scripts/upgrade-design-tree-loop.mjs",
  "scripts/audit-alignment-pages.mjs",
  "scripts/open-html-page.mjs",
  "scripts/serve-alignment.mjs",
  "scripts/inject-tts.mjs",
  "scripts/alignment-tts-kokoro.js",
  "scripts/alignment-chart-snippets.js",
  "scripts/alignment-skip-list.txt",
  "scripts/alignment-bespoke-list.txt",
  "assets/alignment-page-convention.md",
  "assets/interrogation-page-convention.md",
  "assets/design-tree-loop-convention.md",
  "assets/social-post-convention.md",
  "assets/social-video-content-convention.md",
  "assets/social-ledger-convention.md",
  `${MANAGED_CONVENTION_DOC_PACKAGE_ROOT}/alignment-page-convention.md`,
  `${MANAGED_CONVENTION_DOC_PACKAGE_ROOT}/alignment-yaml-routing-contract.md`,
  `${MANAGED_CONVENTION_DOC_PACKAGE_ROOT}/quality-gate-contract.md`,
  `${MANAGED_CONVENTION_DOC_PACKAGE_ROOT}/skillpacks-install-routing-contract.md`,
  `${MANAGED_CONVENTION_DOC_PACKAGE_ROOT}/social/linkedin-post-convention.md`,
  "assets/social/bluesky-convention.md",
  "assets/social/founder-devtool-video-prompts-convention.md",
  "assets/social/hacker-news-convention.md",
  "assets/social/instagram-reels-convention.md",
  "assets/social/linkedin-post-convention.md",
  "assets/social/linkedin-video-convention.md",
  "assets/social/mastodon-convention.md",
  "assets/social/reddit-convention.md",
  "assets/social/threads-convention.md",
  "assets/social/tiktok-convention.md",
  "assets/social/x-post-convention.md",
  "assets/social/youtube-community-convention.md",
  "assets/social/youtube-long-form-convention.md",
  "assets/social/youtube-shorts-convention.md",
  "CHANGELOG.md",
  "LICENSE",
  "packs/code-quality/PACK.md"
];

const deniedBuildPaths = [
  "apps",
  "tasks",
  "prompts",
  "alignment",
  "tests",
  "docs",
  "AGENTS.md",
  "CLAUDE.md"
];

const publicExportPaths = [
  "exports/skills-catalog/v1/catalog.json",
  "exports/skills-catalog/v1/proof.json",
  "exports/skills-catalog/v1/manifest.json"
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

function assertExportBoundary(beforeFingerprint) {
  const afterFingerprint = fileFingerprint(repoRoot, publicExportPaths);
  if (beforeFingerprint !== afterFingerprint) {
    throw new Error(
      "Package build changed public skills-catalog export artifacts. Run export generation separately."
    );
  }
}

function buildPackage() {
  const exportFingerprint = fileFingerprint(repoRoot, publicExportPaths);
  const files = gitFiles(repoRoot);
  const skills = listSkills(repoRoot, files);
  const packs = listPacks(repoRoot, files, skills);
  // Source fingerprint reads the git index (like the manifest generator) so it
  // is a pure function of staged content and unaffected by a concurrent
  // session's unstaged edits on the shared working tree. The export-boundary
  // fingerprints below stay on the working tree on purpose: they exist to
  // detect in-build mutation of committed public export artifacts, which is a
  // working-tree concern.
  const sourceFingerprint = fileFingerprint(repoRoot, [
    ...activeSkillPaths(files),
    ...packManifestPaths(files),
    "scripts/pack.sh",
    "scripts/skill-links.sh"
  ], { source: "index" });

  rmSync(buildRoot, { recursive: true, force: true });
  mkdirSync(buildRoot, { recursive: true });

  for (const entry of packageOwnedEntries) {
    copyEntry(entry);
  }
  copyTrackedPrefixes(files, ["packs"]);
  for (const entry of repoOwnedEntries) {
    copyEntry(entry);
  }
  for (const entry of managedConventionDocEntriesForBuild) {
    copyEntry(entry);
  }

  writeFileSync(
    path.join(buildRoot, "package.json"),
    `${JSON.stringify(stagedPackageJson(), null, 2)}\n`
  );

  assertBuildBoundary();
  assertExportBoundary(exportFingerprint);

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
