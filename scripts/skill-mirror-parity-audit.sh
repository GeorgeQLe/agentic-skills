#!/usr/bin/env bash
set -euo pipefail

# Audits mirrored Claude/Codex base and pack skill parity.
# Usage: skill-mirror-parity-audit.sh [--verbose]

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERBOSE=false

case "${1:-}" in
  "")
    ;;
  --verbose)
    VERBOSE=true
    ;;
  --help|-h)
    echo "Usage: $0 [--verbose]"
    exit 0
    ;;
  *)
    echo "Unknown option: $1" >&2
    echo "Usage: $0 [--verbose]" >&2
    exit 2
    ;;
esac

node - "$REPO_ROOT" "$VERBOSE" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const verbose = process.argv[3] === "true";
const baseRoot = path.join(root, "packs", "base");
const packsRoot = path.join(root, "packs");

const frontmatterKeys = ["name", "type", "context_intake", "visual_tier", "version", "argument-hint"];
const optionalFrontmatterKeys = new Set(["context_intake", "visual_tier", "argument-hint"]);
const sharedSections = [
  "Pack Availability Guard",
  "Report-First Approval Gate",
  "Staged Research Workflow",
  "Alignment Page",
];

const approvedOneSided = new Map([
  ["agent-bridge/delegate", "Claude-only bridge skill."],
  ["exec-profile/patch-exec-profile", "Claude-only execution-profile patch helper."],
  ["project-fleet/project-fleet", "Codex-only project fleet command surface."],
  ["project-fleet/spin-off", "Codex-only project fleet command surface."],
  ["project-fleet/spinoff-idea", "Codex-only project fleet command surface."],
]);

const approvedFrontmatterDrift = new Map([
  ["agent-work-admin/plan-phase::argument-hint", "Pre-existing platform argument-hint drift."],
  ["agent-work-admin/spec-drift::argument-hint", "Pre-existing platform argument-hint drift."],
  ["alignment-loop/vertical-slice-splitter::argument-hint", "Pre-existing platform argument-hint drift."],
  ["business-ops/burn-rate::argument-hint", "Pre-existing platform argument-hint drift."],
  ["business-ops/mvp-gap::argument-hint", "Pre-existing platform argument-hint drift."],
  ["business-ops/scale-audit::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-debug/debug::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-debug/investigate::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-debug/trace::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-maintenance/migrate::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-review/dead-code::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-review/expert-review::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-review/regression-check::argument-hint", "Pre-existing platform argument-hint drift."],
  ["code-review/slim-audit::argument-hint", "Pre-existing platform argument-hint drift."],
  ["context-transfer/handoff::argument-hint", "Pre-existing platform argument-hint drift."],
  ["exec-loop/exec::argument-hint", "Codex supports --execute-approved approval packets."],
  ["exec-loop/exec::version", "Intentional split: Claude can open plan mode, while Codex cannot and keeps a separate execution contract."],
  ["exec-loop/ship::version", "Codex gates the $brainstorm route (v0.9); Claude ship has no brainstorm route and stays v0.8."],
  ["guided-walkthrough/guide::argument-hint", "Pre-existing platform argument-hint drift."],
  ["monorepo/affected::argument-hint", "Pre-existing platform argument-hint drift."],
  ["monorepo/mono-plan::argument-hint", "Pre-existing platform argument-hint drift."],
  ["monorepo/scaffold::argument-hint", "Pre-existing platform argument-hint drift."],
  ["poketowork-kanban/poketo-kanban::argument-hint", "Pre-existing platform argument-hint drift."],
  ["product-design/brainstorm::argument-hint", "Pre-existing platform argument-hint drift."],
  ["product-design/eval-ideas::argument-hint", "Pre-existing punctuation-only argument-hint drift."],
  ["product-design/spec-interview::argument-hint", "Pre-existing platform argument-hint drift."],
  ["release-ops/deploy::argument-hint", "Pre-existing platform argument-hint drift."],
  ["release-ops/release::argument-hint", "Pre-existing platform argument-hint drift."],
  ["skill-dev/create-agentic-skill::argument-hint", "Pre-existing platform argument-hint drift."],
  ["skill-dev/create-local-skill::argument-hint", "Pre-existing platform argument-hint drift."],
  ["teardown/decommission::argument-hint", "Pre-existing platform argument-hint drift."],
  ["youtube-ops/youtube-peer-benchmark::argument-hint", "Pre-existing platform argument-hint drift."],
]);

const approvedHeadingDrift = new Map([
  ["base/init-agentic-skills", "Intentional platform-specific guided setup confirmation structure."],
  ["base/provision-agentic-config", "Intentional platform-specific provision block structure."],
  ["agent-work-admin/roadmap", "Pre-existing heading shape drift outside this remediation."],
  ["agent-work-admin/spec-drift", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/competitive-analysis", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/customer-feedback", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/enterprise-icp", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/icp", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/lean-canvas", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/positioning", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/value-prop-canvas", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/growth-model", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/gtm", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/hook-model", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/landing-copy", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/monetization", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/pmf-assessment", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/experiment", "Pre-existing heading shape drift outside this remediation."],
  ["business-growth/metrics", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/burn-rate", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/mvp-gap", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/platform-strategy", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/product-line", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/reconcile-research", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/scale-audit", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/retro", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/risk-register", "Pre-existing heading shape drift outside this remediation."],
  ["business-ops/runway-model", "Pre-existing heading shape drift outside this remediation."],
  ["business-research/customer-discovery", "Pre-existing heading shape drift outside this remediation."],
  ["code-debug/debug", "Pre-existing heading shape drift outside this remediation."],
  ["code-debug/investigate", "Pre-existing heading shape drift outside this remediation."],
  ["code-debug/trace", "Pre-existing heading shape drift outside this remediation."],
  ["code-maintenance/migrate", "Pre-existing heading shape drift outside this remediation."],
  ["code-review/dead-code", "Pre-existing heading shape drift outside this remediation."],
  ["code-review/expert-review", "Pre-existing heading shape drift outside this remediation."],
  ["code-review/regression-check", "Pre-existing heading shape drift outside this remediation."],
  ["code-review/slim-audit", "Pre-existing heading shape drift outside this remediation."],
  ["context-transfer/handoff", "Pre-existing heading shape drift outside this remediation."],
  ["creator-foundation/content-programming", "Pre-existing heading shape drift outside this remediation."],
  ["creator-foundation/creator-positioning", "Pre-existing heading shape drift outside this remediation."],
  ["creator-foundation/product-led-media-map", "Pre-existing heading shape drift outside this remediation."],
  ["creator-foundation/research-directory-conventions", "Pre-existing heading shape drift outside this remediation."],
  ["creator-foundation/series-spec", "Pre-existing heading shape drift outside this remediation."],
  ["customer-lifecycle/conversion-map", "Pre-existing heading shape drift outside this remediation."],
  ["customer-lifecycle/expansion-map", "Pre-existing heading shape drift outside this remediation."],
  ["customer-lifecycle/lifecycle-metrics", "Pre-existing heading shape drift outside this remediation."],
  ["customer-lifecycle/onboarding-map", "Pre-existing heading shape drift outside this remediation."],
  ["customer-lifecycle/retention-map", "Pre-existing heading shape drift outside this remediation."],
  ["customer-lifecycle/transaction-map", "Pre-existing heading shape drift outside this remediation."],
  ["devtool/devtool-adoption", "Pre-existing heading shape drift outside this remediation."],
  ["devtool/devtool-monetization", "Pre-existing heading shape drift outside this remediation."],
  ["devtool/devtool-positioning", "Pre-existing heading shape drift outside this remediation."],
  ["devtool/devtool-user-map", "Pre-existing heading shape drift outside this remediation."],
  ["docs-health/hygiene", "Pre-existing heading shape drift outside this remediation."],
  ["exec-loop/exec", "Pre-existing heading shape drift outside this remediation."],
  ["exec-loop/ship", "Pre-existing heading shape drift outside this remediation."],
  ["exec-loop/ship-end", "Pre-existing heading shape drift outside this remediation."],
  ["gitops/commit-and-push-by-feature", "Pre-existing heading shape drift outside this remediation."],
  ["guided-walkthrough/guide", "Pre-existing heading shape drift outside this remediation."],
  ["guided-walkthrough/uat-guide", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-audience", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-comparables", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-fantasy", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-genre-map", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-launch", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-prototype-test", "Pre-existing heading shape drift outside this remediation."],
  ["game/game-store-page-test", "Pre-existing heading shape drift outside this remediation."],
  ["monorepo/affected", "Pre-existing heading shape drift outside this remediation."],
  ["monorepo/mono-plan", "Pre-existing heading shape drift outside this remediation."],
  ["monorepo/scaffold", "Pre-existing heading shape drift outside this remediation."],
  ["poketowork-kanban/poketo-kanban", "Pre-existing heading shape drift outside this remediation."],
  ["poketowork-kanban/sync-roadmap-kanban", "Pre-existing heading shape drift outside this remediation."],
  ["product-design/brainstorm", "Pre-existing heading shape drift outside this remediation."],
  ["product-design/spec-interview", "Pre-existing heading shape drift outside this remediation."],
  ["product-testing/uat", "Pre-existing heading shape drift outside this remediation."],
  ["project-fleet/clone-spec-store", "Pre-existing heading shape drift outside this remediation."],
  ["release-ops/deploy", "Pre-existing heading shape drift outside this remediation."],
  ["release-ops/release", "Pre-existing heading shape drift outside this remediation."],
  ["research-admin/research-roadmap", "Pre-existing heading shape drift outside this remediation."],
  ["teardown/decommission", "Pre-existing heading shape drift outside this remediation."],
  ["youtube-ops/youtube-audit", "Pre-existing heading shape drift outside this remediation."],
  ["youtube-ops/youtube-concept-research", "Pre-existing heading shape drift outside this remediation."],
  ["youtube-ops/youtube-peer-benchmark", "Pre-existing heading shape drift outside this remediation."],
]);

const failures = [];
const approved = [];
let mirroredPairs = 0;

function addFailure(message) {
  failures.push(message);
}

function addApproved(message) {
  approved.push(message);
}

function listSkillNames(platformDir) {
  if (!fs.existsSync(platformDir)) return new Set();
  return new Set(
    fs.readdirSync(platformDir)
      .filter((entry) => fs.existsSync(path.join(platformDir, entry, "SKILL.md")))
      .sort(),
  );
}

function readFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const values = new Map();
  if (lines[0] !== "---") return values;

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === "---") break;
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) values.set(match[1], match[2]);
  }
  return values;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSharedSection(text, heading) {
  const headingPattern = new RegExp(`^## ${escapeRegExp(heading)}\\s*$`, "m");
  const match = text.match(headingPattern);
  if (!match) return null;

  const blockStart = match.index;
  const rest = text.slice(blockStart);
  const afterHeading = rest.slice(match[0].length);
  const nextHeading = afterHeading.search(/\n#{1,6} /);
  let block = nextHeading < 0 ? rest : rest.slice(0, match[0].length + nextHeading);

  if (heading === "Staged Research Workflow") {
    const marker = "Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill";
    const markerIndex = block.indexOf(marker);
    if (markerIndex >= 0) {
      const endOfLine = block.indexOf("\n", markerIndex);
      block = endOfLine >= 0 ? block.slice(0, endOfLine) : block;
    }
  }

  return block.trim();
}

function normalizePlatformSyntax(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/After install, tell Claude users[^.]*\./g, "After install, tell users to refresh the active skill registry.")
    .replace(/After install, tell Codex users[^.]*\./g, "After install, tell users to refresh the active skill registry.")
    .replace(/[Tt]ell Claude users to [^.]*\./g, "tell users to refresh the active skill registry after install.")
    .replace(/[Tt]ell Codex users to [^.]*\./g, "tell users to refresh the active skill registry after install.")
    .replace(/\$pack install/g, "/pack install")
    .replace(/\$([a-z][a-z0-9-]+)/g, "/$1")
    .replace(/\bCodex\b/g, "Agent")
    .replace(/\bClaude\b/g, "Agent")
    .replace(/\.(?:claude|codex)\/skills/g, ".agent/skills")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function headingFingerprint(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => /^#{1,6} /.test(line))
    .map((line) => normalizePlatformSyntax(line));
}

const mirrorRoots = [
  {
    pairPrefix: "base",
    claudeDir: path.join(baseRoot, "claude"),
    codexDir: path.join(baseRoot, "codex"),
  },
  ...fs.readdirSync(packsRoot)
    .filter((entry) => fs.statSync(path.join(packsRoot, entry)).isDirectory())
    .filter((entry) => entry !== "base")
    .sort()
    .map((pack) => ({
      pairPrefix: pack,
      claudeDir: path.join(packsRoot, pack, "claude"),
      codexDir: path.join(packsRoot, pack, "codex"),
    })),
];

for (const mirrorRoot of mirrorRoots) {
  const claudeDir = mirrorRoot.claudeDir;
  const codexDir = mirrorRoot.codexDir;
  const claudeSkills = listSkillNames(claudeDir);
  const codexSkills = listSkillNames(codexDir);
  const allSkills = [...new Set([...claudeSkills, ...codexSkills])].sort();

  for (const skill of allSkills) {
    const pair = `${mirrorRoot.pairPrefix}/${skill}`;
    const hasClaude = claudeSkills.has(skill);
    const hasCodex = codexSkills.has(skill);

    if (!hasClaude || !hasCodex) {
      const expectedOneSided = approvedOneSided.get(pair);
      if (expectedOneSided) {
        addApproved(`${pair}: intentional ${hasClaude ? "Claude-only" : "Codex-only"} skill (${expectedOneSided})`);
      } else {
        addFailure(`${pair}: missing ${hasClaude ? "Codex" : "Claude"} mirror`);
      }
      continue;
    }

    mirroredPairs += 1;

    const claudeSkill = path.join(claudeDir, skill, "SKILL.md");
    const codexSkill = path.join(codexDir, skill, "SKILL.md");
    const claudeText = fs.readFileSync(claudeSkill, "utf8");
    const codexText = fs.readFileSync(codexSkill, "utf8");
    const claudeFrontmatter = readFrontmatter(claudeSkill);
    const codexFrontmatter = readFrontmatter(codexSkill);

    for (const key of frontmatterKeys) {
      const claudeValue = claudeFrontmatter.get(key) || "";
      const codexValue = codexFrontmatter.get(key) || "";
      if (claudeValue === codexValue) {
        if (optionalFrontmatterKeys.has(key) || claudeValue !== "") continue;
      }

      const approvedKey = `${pair}::${key}`;
      const approvedReason = approvedFrontmatterDrift.get(approvedKey);
      const message = `${pair}: frontmatter ${key} mismatch: Claude='${claudeValue}' Codex='${codexValue}'`;
      if (approvedReason) {
        addApproved(`${message} (${approvedReason})`);
      } else {
        addFailure(message);
      }
    }

    for (const section of sharedSections) {
      const claudeSection = extractSharedSection(claudeText, section);
      const codexSection = extractSharedSection(codexText, section);
      if (claudeSection === null && codexSection === null) continue;

      if (claudeSection === null || codexSection === null) {
        addFailure(`${pair}: shared section '${section}' missing in ${claudeSection === null ? "Claude" : "Codex"} mirror`);
        continue;
      }

      if (normalizePlatformSyntax(claudeSection) !== normalizePlatformSyntax(codexSection)) {
        addFailure(`${pair}: shared section '${section}' differs after platform syntax normalization`);
      }
    }

    const claudeHeadings = headingFingerprint(claudeText);
    const codexHeadings = headingFingerprint(codexText);
    if (JSON.stringify(claudeHeadings) !== JSON.stringify(codexHeadings)) {
      const approvedReason = approvedHeadingDrift.get(pair);
      const message = `${pair}: heading drift after platform syntax normalization`;
      if (approvedReason) {
        addApproved(`${message} (${approvedReason})`);
      } else {
        addFailure(message);
      }
    }
  }
}

console.log("Skill Mirror Parity Audit");
console.log("=========================");
console.log(`Mirrored pairs checked: ${mirroredPairs}`);
console.log(`Approved drift entries: ${approved.length}`);
console.log(`Failures: ${failures.length}`);

if (approved.length > 0 && verbose) {
  console.log("");
  console.log("Approved drift:");
  for (const item of approved.sort()) {
    console.log(`  - ${item}`);
  }
} else if (approved.length > 0) {
  console.log("Approved drift details: suppressed (run with --verbose to list).");
}

if (failures.length > 0) {
  console.log("");
  console.log("Failures:");
  for (const failure of failures.sort()) {
    console.log(`  - ${failure}`);
  }
  process.exit(1);
}

console.log("");
console.log("All unapproved mirror parity checks passed.");
NODE
