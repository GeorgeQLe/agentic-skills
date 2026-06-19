#!/usr/bin/env node
// Generator for the per-skill PROTOTYPE-SESSION-LOOP.md bundle.
//
// The prototype session-loop convention is authored in
// docs/prototype-session-loop-convention.md. Top-level docs are not part of
// runtime skill installs or the npm package boundary, so participating skills
// carry a sibling bundle that travels with the skill root.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
let rootOverride = null;
const flags = new Set();
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === "--root") {
    rootOverride = argv[i + 1];
    i += 1;
    if (!rootOverride) {
      console.error("--root requires a path argument");
      process.exit(1);
    }
  } else {
    flags.add(argv[i]);
  }
}

const scriptRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = rootOverride ? resolve(rootOverride) : scriptRoot;
const dryRun = flags.has("--dry-run");
const checkMode = flags.has("--check");
if (dryRun && checkMode) {
  console.error("upgrade-prototype-session-loop accepts either --dry-run or --check, not both");
  process.exit(1);
}

const noWrites = dryRun || checkMode;
const previewPrefix = checkMode ? "[check] " : dryRun ? "[dry-run] " : "";

const PROTOTYPE_SESSION_SKILLS = new Set([
  "consolidate-variations",
  "design-inspirations",
  "prototype",
  "state-model",
  "uat",
  "ui-interview",
  "user-flow-map",
  "ux-variations",
]);

function skillNameFor(file) {
  const parts = file.split("/");
  return parts[parts.length - 2];
}

const authoringConventionPath = `${repoRoot}/docs/prototype-session-loop-convention.md`;
const packagedConventionPath = `${scriptRoot}/assets/prototype-session-loop-convention.md`;
const conventionPath = existsSync(authoringConventionPath)
  ? authoringConventionPath
  : packagedConventionPath;

if (!existsSync(conventionPath)) {
  console.error(`Could not find prototype session-loop convention at ${relative(repoRoot, conventionPath)}`);
  process.exit(1);
}

const conventionFile = readFileSync(conventionPath, "utf8").trim();

function bundledContentFor(skillName) {
  return `# Prototype Session Loop - ${skillName}

Generated from \`docs/prototype-session-loop-convention.md\`. Edit the canonical docs file and run \`scripts/upgrade-prototype-session-loop.mjs\`; do not hand-edit this bundle.

${conventionFile}
`;
}

function rewriteSkillReferences(content) {
  return content.replaceAll("docs/prototype-session-loop-convention.md", "PROTOTYPE-SESSION-LOOP.md");
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
    const abs = join(dir, entry);
    const stats = statSync(abs);
    if (stats.isDirectory()) walk(abs, out);
    if (stats.isFile() && entry === "SKILL.md") out.push(relative(repoRoot, abs));
  }
  return out;
}

const files = [...walk(`${repoRoot}/base`), ...walk(`${repoRoot}/packs`)]
  .filter((file) => /(^|\/)(codex|claude)\//.test(file))
  .filter((file) => PROTOTYPE_SESSION_SKILLS.has(skillNameFor(file)))
  .sort();

let skillUpdates = 0;
let bundlesWritten = 0;
const problems = [];

for (const file of files) {
  const abs = `${repoRoot}/${file}`;
  const skillName = skillNameFor(file);
  const content = readFileSync(abs, "utf8");
  const rewritten = rewriteSkillReferences(content);
  const bundlePath = join(dirname(abs), "PROTOTYPE-SESSION-LOOP.md");
  const expectedBundle = bundledContentFor(skillName);
  const currentBundle = existsSync(bundlePath) ? readFileSync(bundlePath, "utf8") : null;

  if (rewritten !== content) {
    skillUpdates += 1;
    const rel = relative(repoRoot, abs);
    if (checkMode) problems.push(`${rel} references docs/prototype-session-loop-convention.md`);
    console.log(`${previewPrefix}update ${rel}`);
    if (!noWrites) writeFileSync(abs, rewritten);
  }

  if (currentBundle !== expectedBundle) {
    bundlesWritten += 1;
    const rel = relative(repoRoot, bundlePath);
    if (checkMode) problems.push(`${rel} is missing or stale`);
    console.log(`${previewPrefix}write ${rel}`);
    if (!noWrites) writeFileSync(bundlePath, expectedBundle);
  }
}

if (checkMode && problems.length > 0) {
  console.error(`${problems.length} prototype session-loop bundle issue(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(
  `${previewPrefix}prototype session-loop bundles checked: ${files.length} skills, ${skillUpdates} skill reference update(s), ${bundlesWritten} bundle write(s).`,
);
