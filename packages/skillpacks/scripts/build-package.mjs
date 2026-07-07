#!/usr/bin/env node

import { spawnSync } from "node:child_process";
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
  SKILL_CONVENTIONS,
  managedConventionDocEntries
} from "../../../scripts/skill-convention-registry.mjs";
import {
  allowedConventionEntries,
  packageLaneFromEnv,
  releaseLaneAllowed,
  skillReleaseLaneFromText
} from "./release-lane.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../..");
const buildRoot = path.join(packageRoot, "build");
const checkMode = process.argv.includes("--check");
const packageLane = packageLaneFromEnv();

const packageOwnedEntries = [
  { fromRoot: packageRoot, from: "bin", to: "bin" },
  { fromRoot: packageRoot, from: "src", to: "src" },
  { fromRoot: packageRoot, from: "scripts/prepublish-auth-check.mjs", to: "scripts/prepublish-auth-check.mjs" }
];

const repoOwnedEntries = [
  { fromRoot: repoRoot, from: "scripts/pack.sh", to: "scripts/pack.sh" },
  { fromRoot: repoRoot, from: "scripts/skill-links.sh", to: "scripts/skill-links.sh" },
  { fromRoot: repoRoot, from: "scripts/skill-convention-bundle-audit.mjs", to: "scripts/skill-convention-bundle-audit.mjs" },
  { fromRoot: repoRoot, from: "scripts/skill-convention-registry.mjs", to: "scripts/skill-convention-registry.mjs" },
  { fromRoot: repoRoot, from: "scripts/lib", to: "scripts/lib" },
  { fromRoot: repoRoot, from: "scripts/upgrade-alignment-page.mjs", to: "scripts/upgrade-alignment-page.mjs" },
  { fromRoot: repoRoot, from: "scripts/upgrade-interrogation-page.mjs", to: "scripts/upgrade-interrogation-page.mjs" },
  { fromRoot: repoRoot, from: "scripts/upgrade-design-tree-loop.mjs", to: "scripts/upgrade-design-tree-loop.mjs" },
  { fromRoot: repoRoot, from: "scripts/audit-alignment-pages.mjs", to: "scripts/audit-alignment-pages.mjs" },
  { fromRoot: repoRoot, from: "scripts/audit-briefing-slides.mjs", to: "scripts/audit-briefing-slides.mjs" },
  { fromRoot: repoRoot, from: "scripts/open-html-page.mjs", to: "scripts/open-html-page.mjs" },
  { fromRoot: repoRoot, from: "scripts/serve-alignment.mjs", to: "scripts/serve-alignment.mjs" },
  { fromRoot: repoRoot, from: "scripts/inject-tts.mjs", to: "scripts/inject-tts.mjs" },
  { fromRoot: repoRoot, from: "scripts/alignment-tts-kokoro.js", to: "scripts/alignment-tts-kokoro.js" },
  { fromRoot: repoRoot, from: "scripts/alignment-chart-snippets.js", to: "scripts/alignment-chart-snippets.js" },
  { fromRoot: repoRoot, from: "scripts/alignment-skip-list.txt", to: "scripts/alignment-skip-list.txt" },
  { fromRoot: repoRoot, from: "scripts/alignment-bespoke-list.txt", to: "scripts/alignment-bespoke-list.txt" },
  { fromRoot: repoRoot, from: "docs/alignment-page-convention.md", to: "assets/alignment-page-convention.md" },
  { fromRoot: repoRoot, from: "docs/interrogation-page-convention.md", to: "assets/interrogation-page-convention.md" },
  { fromRoot: repoRoot, from: "docs/briefing-slides-convention.md", to: "assets/briefing-slides-convention.md" },
  { fromRoot: repoRoot, from: "docs/design-tree-loop-convention.md", to: "assets/design-tree-loop-convention.md" },
  { fromRoot: repoRoot, from: "docs/social-post-convention.md", to: "assets/social-post-convention.md" },
  { fromRoot: repoRoot, from: "docs/social-video-content-convention.md", to: "assets/social-video-content-convention.md" },
  { fromRoot: repoRoot, from: "docs/social-ledger-convention.md", to: "assets/social-ledger-convention.md" },
  { fromRoot: repoRoot, from: "docs/social", to: "assets/social" },
  { fromRoot: packageRoot, from: "assets/templates", to: "assets/templates" },
  { fromRoot: repoRoot, from: "README.md", to: "README.md" },
  { fromRoot: repoRoot, from: "CHANGELOG.md", to: "CHANGELOG.md" },
  { fromRoot: repoRoot, from: "LICENSE", to: "LICENSE" }
];

const managedConventionDocEntriesForBuild = managedConventionDocEntries(repoRoot).map((entry) => ({
  canonicalDoc: entry.canonicalDoc,
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
  "scripts/lib/collapsing-fill-audit.mjs",
  "scripts/upgrade-alignment-page.mjs",
  "scripts/upgrade-interrogation-page.mjs",
  "scripts/upgrade-design-tree-loop.mjs",
  "scripts/audit-alignment-pages.mjs",
  "scripts/audit-briefing-slides.mjs",
  "scripts/open-html-page.mjs",
  "scripts/serve-alignment.mjs",
  "scripts/inject-tts.mjs",
  "scripts/alignment-tts-kokoro.js",
  "scripts/alignment-chart-snippets.js",
  "scripts/alignment-skip-list.txt",
  "scripts/alignment-bespoke-list.txt",
  "assets/alignment-page-convention.md",
  "assets/interrogation-page-convention.md",
  "assets/briefing-slides-convention.md",
  "assets/design-tree-loop-convention.md",
  "assets/templates/alignment-page.html",
  "assets/templates/briefing-slides.html",
  "assets/templates/interrogation-page.html",
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

const canaryOnlyPackagePaths = new Set([
  "scripts/audit-briefing-slides.mjs",
  "assets/templates/briefing-slides.html"
]);

function pathAllowedForLane(relativePath) {
  if (canaryOnlyPackagePaths.has(relativePath) && !releaseLaneAllowed("canary", packageLane)) {
    return false;
  }
  return true;
}

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

function deniedSkillRootsForLane(files) {
  const deniedSkillRoots = new Set();
  for (const file of activeSkillPaths(files)) {
    const source = path.join(repoRoot, file);
    if (!existsSync(source)) continue;
    if (!releaseLaneAllowed(skillReleaseLaneFromText(readFileSync(source, "utf8")), packageLane)) {
      deniedSkillRoots.add(path.posix.dirname(file));
    }
  }

  return deniedSkillRoots;
}

function allowedPackageEntries(entries) {
  return entries.filter((entry) => {
    if (!pathAllowedForLane(entry.to)) {
      return false;
    }
    const registryEntry = Object.values(SKILL_CONVENTIONS).find(
      (convention) => convention.packageAsset === entry.to
    );
    return releaseLaneAllowed(registryEntry?.release_lane, packageLane);
  });
}

function laneFilteredFiles(files) {
  const deniedSkillRoots = deniedSkillRootsForLane(files);

  return files.filter((file) => {
    for (const deniedRoot of deniedSkillRoots) {
      if (file === deniedRoot || file.startsWith(`${deniedRoot}/`)) return false;
    }
    return true;
  });
}

function laneFilteredPackageFiles(files) {
  const deniedAssets = new Set(
    Object.values(SKILL_CONVENTIONS)
      .filter((convention) => !releaseLaneAllowed(convention.release_lane, packageLane))
      .map((convention) => convention.packageAsset)
      .filter(Boolean)
  );

  return files.filter((file) => !deniedAssets.has(file) && pathAllowedForLane(file));
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
  if (Array.isArray(staged.files)) {
    staged.files = laneFilteredPackageFiles(staged.files);
  }

  return staged;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function writeLaneFilteredConventionRegistry() {
  const target = path.join(buildRoot, "scripts/skill-convention-registry.mjs");
  let registrySource = readFileSync(target, "utf8");

  for (const conventionId of conventionIdsDeniedForLane()) {
    const conventionBlock = new RegExp(
      `\\n  "${escapeRegExp(conventionId)}": \\{[\\s\\S]*?\\n  \\},`,
      "g"
    );
    registrySource = registrySource.replace(conventionBlock, "");
  }

  writeFileSync(target, registrySource);
}

function writeStagedManifest() {
  const result = spawnSync(
    process.execPath,
    [path.join(packageRoot, "scripts/build-skillpacks-manifest.mjs"), "--print"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: process.env,
      maxBuffer: 64 * 1024 * 1024
    }
  );
  if (result.status !== 0) {
    throw new Error(
      [
        "Failed to generate package manifest for staging.",
        result.stdout,
        result.stderr
      ].filter(Boolean).join("\n")
    );
  }

  const manifest = JSON.parse(result.stdout);
  if ((manifest.package?.release_lane || "stable") !== packageLane) {
    throw new Error(
      `Generated package manifest lane ${manifest.package?.release_lane || "stable"} !== ${packageLane}`
    );
  }

  const target = path.join(buildRoot, "dist/skillpacks-manifest.json");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`);
}

function conventionIdsDeniedForLane() {
  return Object.entries(SKILL_CONVENTIONS)
    .filter(([, convention]) => !releaseLaneAllowed(convention.release_lane, packageLane))
    .map(([conventionId]) => conventionId);
}

function scrubDeniedSkillRowsFromPackMetadata(files) {
  const deniedSkillNames = [...deniedSkillRootsForLane(files)].map((skillRoot) => path.posix.basename(skillRoot));
  if (deniedSkillNames.length === 0) return;

  const copiedPackManifests = files.filter((file) => /^packs\/[^/]+\/PACK\.md$/.test(file));
  for (const packManifestPath of copiedPackManifests) {
    const target = path.join(buildRoot, packManifestPath);
    if (!existsSync(target)) continue;
    let packText = readFileSync(target, "utf8");
    for (const skillName of deniedSkillNames) {
      const skillRow = new RegExp(`^- \`${escapeRegExp(skillName)}\`:.*\\n?`, "gm");
      packText = packText.replace(skillRow, "");
    }
    writeFileSync(target, packText);
  }
}

function assertBuildBoundary() {
  const requiredForLane = requiredBuildFiles.filter((relativePath) => {
    if (!pathAllowedForLane(relativePath)) {
      return false;
    }
    const registryEntry = Object.values(SKILL_CONVENTIONS).find(
      (convention) => convention.packageAsset === relativePath
    );
    return releaseLaneAllowed(registryEntry?.release_lane, packageLane);
  });

  for (const relativePath of requiredForLane) {
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
  const laneFiles = laneFilteredFiles(files);
  const skills = listSkills(repoRoot, laneFiles);
  const packs = listPacks(repoRoot, laneFiles, skills);
  // Source fingerprint reads the git index (like the manifest generator) so it
  // is a pure function of staged content and unaffected by a concurrent
  // session's unstaged edits on the shared working tree. The export-boundary
  // fingerprints below stay on the working tree on purpose: they exist to
  // detect in-build mutation of committed public export artifacts, which is a
  // working-tree concern.
  const sourceFingerprint = fileFingerprint(repoRoot, [
    ...activeSkillPaths(laneFiles),
    ...packManifestPaths(laneFiles),
    "scripts/pack.sh",
    "scripts/skill-links.sh",
    "scripts/audit-briefing-slides.mjs",
    "packages/skillpacks/scripts/release-lane.mjs"
  ], { source: "index" });

  rmSync(buildRoot, { recursive: true, force: true });
  mkdirSync(buildRoot, { recursive: true });

  for (const entry of packageOwnedEntries) {
    copyEntry(entry);
  }
  copyTrackedPrefixes(laneFiles, ["packs"]);
  for (const entry of allowedPackageEntries(repoOwnedEntries)) {
    copyEntry(entry);
  }
  for (const entry of allowedConventionEntries(managedConventionDocEntriesForBuild, packageLane)) {
    copyEntry(entry);
  }
  for (const relativePath of canaryOnlyPackagePaths) {
    if (!pathAllowedForLane(relativePath)) {
      rmSync(path.join(buildRoot, relativePath), { recursive: true, force: true });
    }
  }
  writeStagedManifest();
  scrubDeniedSkillRowsFromPackMetadata(files);
  writeLaneFilteredConventionRegistry();

  writeFileSync(
    path.join(buildRoot, "package.json"),
    `${JSON.stringify(stagedPackageJson(), null, 2)}\n`
  );

  assertBuildBoundary();
  assertExportBoundary(exportFingerprint);

  console.log(
    `Staged skillpacks package at ${path.relative(repoRoot, buildRoot)} for ${packageLane} lane with ${skills.length} skills, ${packs.length} packs, and source fingerprint ${sourceFingerprint}.`
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
