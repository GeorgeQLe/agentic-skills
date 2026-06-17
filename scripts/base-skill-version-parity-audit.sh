#!/usr/bin/env bash
set -euo pipefail

# Audits targeted base Claude/Codex skill version parity for pairs that should
# remain mirrored without expanding the pack mirror audit to base inventory.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

node - "$REPO_ROOT" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const pairs = [
  "init-agentic-skills",
  "idea-scope-brief",
];

function readVersion(file) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return "";
  const version = match[1].match(/^version:\s*(.+)$/m);
  return version ? version[1].trim().replace(/^["']|["']$/g, "") : "";
}

const failures = [];

for (const skill of pairs) {
  const claudeFile = path.join(root, "base", "claude", skill, "SKILL.md");
  const codexFile = path.join(root, "base", "codex", skill, "SKILL.md");

  if (!fs.existsSync(claudeFile)) failures.push(`${skill}: missing Claude SKILL.md`);
  if (!fs.existsSync(codexFile)) failures.push(`${skill}: missing Codex SKILL.md`);
  if (!fs.existsSync(claudeFile) || !fs.existsSync(codexFile)) continue;

  const claudeVersion = readVersion(claudeFile);
  const codexVersion = readVersion(codexFile);
  if (!claudeVersion) failures.push(`${skill}: missing Claude version`);
  if (!codexVersion) failures.push(`${skill}: missing Codex version`);
  if (claudeVersion && codexVersion && claudeVersion !== codexVersion) {
    failures.push(`${skill}: version mismatch Claude=${claudeVersion} Codex=${codexVersion}`);
  }
}

console.log("Base Skill Version Parity Audit");
console.log("===============================");
console.log(`Pairs checked: ${pairs.length}`);
console.log(`Failures: ${failures.length}`);

if (failures.length > 0) {
  console.log("");
  console.log("Failures:");
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}

console.log("");
console.log("All targeted base skill version checks passed.");
NODE
