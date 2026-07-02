#!/usr/bin/env bash
set -euo pipefail

# Audits Pattern A research-loop terminal handoff contracts.
# Usage: skill-research-loop-handoff-audit.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

node - "$REPO_ROOT" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];

const orchestrators = [
  { pack: "business-research", name: "customer-discovery", canonical: "icp.md" },
  { pack: "business-research", name: "competitive-analysis", canonical: "competitive-analysis.md" },
  { pack: "business-research", name: "positioning", canonical: "positioning.md" },
  { pack: "customer-lifecycle", name: "journey-map", canonical: "journey-map.md" },
];

const frameworkNames = new Set();
const failures = [];

function rel(file) {
  return path.relative(root, file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function fail(file, message) {
  failures.push(`${rel(file)}: ${message}`);
}

function command(agent, name) {
  return `${agent === "codex" ? "$" : "/"}${name}`;
}

function requireText(file, text, snippet, label) {
  if (!text.includes(snippet)) fail(file, `missing ${label}`);
}

function rejectText(file, text, snippet, label) {
  if (text.includes(snippet)) fail(file, `contains ${label}`);
}

for (const { pack, name, canonical } of orchestrators) {
  for (const agent of ["codex", "claude"]) {
    const file = path.join(root, "packs", pack, agent, name, "SKILL.md");
    const text = read(file);
    const cmd = command(agent, name);

    requireText(file, text, "### Terminal Handoff Contract", "terminal handoff contract");
    requireText(file, text, "## Next Work", "Next Work section name");
    requireText(file, text, "## Recommended Next Command", "post-write command section name");
    requireText(file, text, `${cmd} --synthesize`, "explicit synthesis command");
    requireText(file, text, canonical, "canonical synthesis artifact reference");
    requireText(file, text, "Do not put any other section after the applicable final section.", "final-section guard");
    requireText(file, text, "### Self-Routing Continuation Payload", "self-routing continuation payload section");
    requireText(file, text, "agent_routing:", "agent_routing YAML metadata");
    requireText(file, text, "workflow: pattern-a-research-loop", "Pattern A workflow routing marker");
    requireText(file, text, `parent_skill: ${name}`, "parent skill routing metadata");
    requireText(file, text, `command: "${cmd} research/{slug}"`, "parent command routing metadata");
    requireText(file, text, "product_path: research/{slug}", "product path routing metadata");
    requireText(file, text, "gate_owner: parent-orchestrator", "parent gate-owner routing metadata");
    requireText(file, text, "gate_type: framework-findings", "gate type routing metadata");
    requireText(file, text, `run_manifest: research/{slug}/_working/${name}-run.yaml`, "run manifest routing metadata");
    requireText(file, text, "next_resolution: parent-resolves-from-yaml-and-filesystem", "parent-owned next-resolution routing metadata");
    requireText(file, text, "The `command` field must carry the parent command the user would otherwise have copied separately.", "command parity guard");
    requireText(file, text, "clear context", "clear-context YAML paste instruction");
    rejectText(file, text, "## Invoke With YAML", "review-pending command section name");

    if (/Recommended next command after compiling YAML:/i.test(text)) {
      fail(file, "uses old inline recommended-next-command label");
    }
    rejectText(file, text, "## Continue In A Fresh Session", "old review-pending fresh-session heading");
    rejectText(file, text, "## Recommended Next Command After Compiling YAML", "old review-pending command heading");
  }
}

for (const { pack, name } of orchestrators) {
  for (const agent of ["codex", "claude"]) {
    const dir = path.join(root, "packs", pack, agent, name, "frameworks");
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = path.join(dir, entry.name, "SKILL.md");
      frameworkNames.add(entry.name);
      const text = read(file);
      const cmd = command(agent, name);

      requireText(file, text, "## Terminal Handoff Contract", "terminal handoff contract");
      requireText(file, text, "## Next Work", "Next Work section name");
      requireText(file, text, cmd, "parent orchestrator command");
      requireText(file, text, "Do not decide from inside the framework whether the next parent run executes another framework or synthesis", "parent recalculation guard");
      requireText(file, text, "agent_routing:", "agent_routing YAML metadata");
      requireText(file, text, "workflow: pattern-a-research-loop", "Pattern A workflow routing marker");
      requireText(file, text, `parent_skill: ${name}`, "parent skill routing metadata");
      requireText(file, text, `command: "${cmd} research/{slug}"`, "parent command routing metadata");
      requireText(file, text, "product_path: research/{slug}", "product path routing metadata");
      requireText(file, text, "gate_owner: parent-orchestrator", "parent gate-owner routing metadata");
      requireText(file, text, "gate_type: framework-findings", "framework gate type routing metadata");
      requireText(file, text, `framework_slug: ${entry.name}`, "framework slug routing metadata");
      requireText(file, text, "framework_mode: inline-subskill", "inline framework routing metadata");
      requireText(file, text, `run_manifest: research/{slug}/_working/${name}-run.yaml`, "run manifest routing metadata");
      requireText(file, text, "next_resolution: parent-resolves-from-yaml-and-filesystem", "parent-owned next-resolution routing metadata");
      requireText(file, text, "never replace it with a child framework path command", "child-command routing guard");
      requireText(file, text, "clear context", "clear-context YAML paste instruction");
      rejectText(file, text, "## Invoke With YAML", "review-pending command section name");
      rejectText(file, text, "## Continue In A Fresh Session", "old review-pending fresh-session heading");
      rejectText(file, text, "## Recommended Next Command After Compiling YAML", "old review-pending command heading");
    }
  }
}

const childCommandRe = new RegExp(String.raw`(^|[\\s\`\"'])[$/](${[...frameworkNames].join("|")})(?=[\\s\`\"'])`, "g");
for (const { pack, name } of orchestrators) {
  for (const agent of ["codex", "claude"]) {
    const dir = path.join(root, "packs", pack, agent, name, "frameworks");
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = path.join(dir, entry.name, "SKILL.md");
      const text = read(file);
      const matches = [...text.matchAll(childCommandRe)].filter((match) => match[2] !== name);
      if (matches.length > 0) {
        fail(file, `contains child framework command reference ${matches.map((m) => m[0].trim()).join(", ")}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.log("Pattern A terminal handoff audit failures:");
  for (const failure of failures) console.log(`  ${failure}`);
  process.exit(1);
}

console.log("Pattern A terminal handoff contracts are present.");
NODE
