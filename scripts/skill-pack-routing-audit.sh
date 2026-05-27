#!/usr/bin/env bash
set -euo pipefail

# Audits recommendation-like cross-pack skill references for pack availability guards.
# Usage: skill-pack-routing-audit.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

node - "$REPO_ROOT" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive") continue;
      walk(full, predicate, out);
    }
    else if (predicate(full)) out.push(full);
  }
  return out;
}

const packSkillFiles = walk(path.join(root, "packs"), (file) => file.endsWith("/SKILL.md"));
const globalSkillFiles = walk(path.join(root, "global"), (file) => file.endsWith("/SKILL.md"));

const skillPacks = new Map();
for (const file of packSkillFiles) {
  const rel = path.relative(root, file).split(path.sep);
  const pack = rel[1];
  const skill = rel[3];
  if (!skillPacks.has(skill)) skillPacks.set(skill, new Set());
  skillPacks.get(skill).add(pack);
}

const globalSkills = new Set();
for (const file of globalSkillFiles) {
  const rel = path.relative(root, file).split(path.sep);
  globalSkills.add(rel[2]);
}

const refRe = /(?:^|[\s`"'(|>:,])([/$])([a-z][a-z0-9-]+)(?![a-zA-Z0-9_/.:\-*]|\])/g;
const recommendationRe = /(recommend(?:ed|s|ing)?|run|route to|handoff to|next command|next skill|default recommendation|tell the user)/i;
const ignoreRe = /(default flow|full sequence|canonical chains|sequence below)/i;
const guardRe = /## Pack Availability Guard[\s\S]*?enabled_packs[\s\S]*?(?:\$pack install <pack>|\/pack install <pack>)/;
const explicitDependencyPacks = new Set([
  "agent-bridge",
  "agent-work-admin",
  "business-growth",
  "code-debug",
  "code-review",
  "docs-health",
  "exec-loop",
  "exec-profile",
  "gitops",
  "guided-walkthrough",
  "monorepo",
  "product-design",
  "product-testing",
  "repo-maintenance",
  "research-admin",
  "session-analytics",
  "skill-dev",
]);

const failures = [];
const seenFailures = new Set();

function addFailure(relPath, lineNumber, skill, targetPacks) {
  const packList = [...targetPacks].sort().join(", ");
  const key = `${relPath}:${lineNumber}:${skill}:${packList}`;
  if (seenFailures.has(key)) return;
  seenFailures.add(key);
  failures.push(`${relPath}:${lineNumber}: ${skill} requires pack ${packList}`);
}

for (const file of [...globalSkillFiles, ...packSkillFiles]) {
  const relPath = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");
  const hasWholeFileGuard = guardRe.test(text);
  const parts = relPath.split(path.sep);
  const sourcePack = parts[0] === "packs" ? parts[1] : null;
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!recommendationRe.test(line) || ignoreRe.test(line)) continue;

    for (const match of line.matchAll(refRe)) {
      const skill = match[2];
      if (globalSkills.has(skill) || !skillPacks.has(skill)) continue;
      const targetPacks = skillPacks.get(skill);
      if (sourcePack && targetPacks.has(sourcePack)) continue;
      if (hasWholeFileGuard) continue;
      if ([...targetPacks].every((pack) => explicitDependencyPacks.has(pack))) continue;

      const start = Math.max(0, index - 10);
      const end = Math.min(lines.length, index + 11);
      const context = lines.slice(start, end).join("\n");
      const hasLocalFallback = [...targetPacks].some((pack) => {
        const afterInstall = new RegExp(`(install|enable|enabled|pack install|scripts/pack\\\\.sh install|\\\\$pack install|/pack install).*${pack}`, "i");
        const beforeInstall = new RegExp(`${pack}.*(install|enable|enabled)`, "i");
        return afterInstall.test(context) || beforeInstall.test(context);
      });

      if (!hasLocalFallback) addFailure(relPath, index + 1, skill, targetPacks);
    }
  }
}

if (failures.length > 0) {
  console.log("Cross-pack recommendation gaps found:");
  for (const failure of failures) console.log(`  ${failure}`);
  process.exit(1);
}

console.log("No cross-pack recommendation gaps found.");
NODE
