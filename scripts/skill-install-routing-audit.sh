#!/usr/bin/env bash
set -euo pipefail

# Audits active skill install-route wording for published skillpacks npm CLI paths.
# Usage:
#   scripts/skill-install-routing-audit.sh --active
#   scripts/skill-install-routing-audit.sh --report
#   scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

node - "$REPO_ROOT" "$@" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const args = process.argv.slice(3);

const P1_REQUIRED_FILES = [
  "base/claude/afps-status/SKILL.md",
  "base/claude/codebase-status/SKILL.md",
  "base/claude/idea-scope-brief/SKILL.md",
  "base/claude/init-agentic-skills/SKILL.md",
  "base/claude/pack/SKILL.md",
  "base/claude/provision-agentic-config/SKILL.md",
  "base/claude/skills/SKILL.md",
  "base/codex/afps-status/SKILL.md",
  "base/codex/codebase-status/SKILL.md",
  "base/codex/idea-scope-brief/SKILL.md",
  "base/codex/init-agentic-skills/SKILL.md",
  "base/codex/pack/SKILL.md",
  "base/codex/provision-agentic-config/SKILL.md",
  "base/codex/skills/SKILL.md",
];

const VALID_ALLOWLIST_SCOPES = new Set([
  "source-checkout-only",
  "internal-maintenance",
  "legacy-agent-route",
  "fixture",
]);

function usage(exitCode = 1) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(
    [
      "Usage: scripts/skill-install-routing-audit.sh --active",
      "       scripts/skill-install-routing-audit.sh --report",
      "       scripts/skill-install-routing-audit.sh --fixtures <dir>",
      "",
    ].join("\n"),
  );
  process.exit(exitCode);
}

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive") continue;
      if (full.includes(`${path.sep}packages${path.sep}skillpacks${path.sep}build${path.sep}`)) continue;
      walk(full, predicate, out);
    }
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function normalizeRel(fileRoot, file) {
  return path.relative(fileRoot, file).split(path.sep).join("/");
}

function collectActiveSkillFiles(repoRoot) {
  return [
    ...walk(path.join(repoRoot, "base"), (file) => file.endsWith("/SKILL.md")),
    ...walk(path.join(repoRoot, "packs"), (file) => file.endsWith("/SKILL.md")),
  ].sort();
}

function collectFixtureSkillFiles(fixturesRoot) {
  return walk(fixturesRoot, (file) => file.endsWith("/SKILL.md")).sort();
}

function readAllowlist(scanRoot) {
  const allowlistPath = path.join(scanRoot, "allowlist.json");
  if (!fs.existsSync(allowlistPath)) return [];

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));
  }
  catch (error) {
    return [{
      __invalid: true,
      path: "allowlist.json",
      reason: `invalid JSON: ${error.message}`,
    }];
  }

  if (!Array.isArray(parsed)) {
    return [{
      __invalid: true,
      path: "allowlist.json",
      reason: "allowlist must be an array",
    }];
  }

  return parsed;
}

function validateAllowlistEntries(entries, filesByRel) {
  const failures = [];
  const usableEntries = [];

  for (const entry of entries) {
    if (entry.__invalid) {
      failures.push(`allowlist:${entry.path}: ${entry.reason}`);
      continue;
    }

    const missingFields = ["path", "reason", "scope", "evidence"].filter((field) => {
      return typeof entry[field] !== "string" || entry[field].trim() === "";
    });
    if (missingFields.length > 0) {
      failures.push(`allowlist:${entry.path || "<missing path>"}: missing ${missingFields.join(", ")}`);
      continue;
    }
    if (!VALID_ALLOWLIST_SCOPES.has(entry.scope)) {
      failures.push(`allowlist:${entry.path}: invalid scope ${entry.scope}`);
      continue;
    }
    if (entry.expires_after !== undefined && typeof entry.expires_after !== "string") {
      failures.push(`allowlist:${entry.path}: expires_after must be a string when present`);
      continue;
    }

    const text = filesByRel.get(entry.path);
    if (text === undefined) {
      failures.push(`allowlist:${entry.path}: stale entry, file is not in scan inventory`);
      continue;
    }
    if (!text.includes(entry.evidence)) {
      failures.push(`allowlist:${entry.path}: stale entry, evidence text not found`);
      continue;
    }

    usableEntries.push(entry);
  }

  return { failures, usableEntries };
}

function lineNumberFor(text, pattern) {
  const match = text.match(pattern);
  if (!match || match.index === undefined) return 1;
  return text.slice(0, match.index).split(/\r?\n/).length;
}

function stripFrontmatterForScan(text) {
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!match) return text;

  const lineBreaks = (match[0].match(/\n/g) || []).length;
  return "\n".repeat(lineBreaks) + text.slice(match[0].length);
}

function hasAllowlistedSourceCheckoutOnly(relPath, text, allowlistEntries) {
  return allowlistEntries.some((entry) => {
    return entry.path === relPath
      && ["source-checkout-only", "internal-maintenance", "fixture"].includes(entry.scope)
      && text.includes(entry.evidence);
  });
}

function hasAllowlistedLegacyAgentRoute(relPath, text, allowlistEntries) {
  return allowlistEntries.some((entry) => {
    return entry.path === relPath
      && ["legacy-agent-route", "internal-maintenance", "fixture"].includes(entry.scope)
      && text.includes(entry.evidence);
  });
}

function scanFile(relPath, text, allowlistEntries) {
  const findings = [];
  const scanText = stripFrontmatterForScan(text);

  const hasSlashPackInstall = /\/pack install(?:\s|`|<|$)/.test(scanText);
  const hasDollarPackInstall = /\$pack install(?:\s|`|<|$)/.test(scanText);
  const hasGenericPackInstall = /(^|[^/$.a-zA-Z0-9_-])pack install(?:\s+[`<a-z0-9_$/-]|`|<|$)/.test(scanText);
  const hasSourceCheckoutInstall = /scripts\/pack\.sh install(?:\s|`|<|$)/.test(scanText);
  const hasPackAvailabilityGuard = /Pack Availability Guard/.test(scanText);
  const hasMissingSkillFallback = /Missing Skill Fallback/.test(scanText);
  const hasNpmInstall = /npx\s+skillpacks\s+install(?:\s|`|<|$)/.test(scanText);
  const hasNpmDeckInstall = /npx\s+skillpacks\s+install-deck(?:\s|`|<|$)/.test(scanText);
  const hasInstallDeckText = /install-deck/.test(scanText);
  const hasDeckInstallHeading = /deck install/i.test(scanText);
  const hasWrongDeckRoute = /(?:npx\s+skillpacks\s+install|\/pack install|\$pack install)\s+<deck>/i.test(scanText);

  const hasAgentOrGenericInstall = hasSlashPackInstall || hasDollarPackInstall || hasGenericPackInstall;
  const hasPackInstallGuidance =
    hasAgentOrGenericInstall
    || hasSourceCheckoutInstall
    || hasPackAvailabilityGuard
    || hasMissingSkillFallback;
  const sourceCheckoutOnly =
    hasSourceCheckoutInstall
    && !hasAgentOrGenericInstall
    && !hasPackAvailabilityGuard
    && !hasMissingSkillFallback
    && !hasDeckInstallHeading
    && !hasInstallDeckText
    && !hasWrongDeckRoute;

  if (hasAgentOrGenericInstall && !hasAllowlistedLegacyAgentRoute(relPath, text, allowlistEntries)) {
    findings.push({
      relPath,
      line: lineNumberFor(scanText, /\/pack install|\$pack install|(^|[^/$.a-zA-Z0-9_-])pack install(?:\s+[`<a-z0-9_$/-]|`|<|$)/),
      code: "legacy-agent-install-route",
      message: "active install guidance must use npx skillpacks install unless a legacy agent route is explicitly allowlisted",
    });
  }

  if (hasPackInstallGuidance && !hasNpmInstall) {
    const allowed = sourceCheckoutOnly && hasAllowlistedSourceCheckoutOnly(relPath, text, allowlistEntries);
    if (!allowed) {
      findings.push({
        relPath,
        line: lineNumberFor(scanText, /\/pack install|\$pack install|(^|[^/$.a-zA-Z0-9_-])pack install(?:\s+[`<a-z0-9_$/-]|`|<|$)|scripts\/pack\.sh install|Pack Availability Guard|Missing Skill Fallback/),
        code: sourceCheckoutOnly ? "source-checkout-install-needs-allowlist" : "missing-npm-install-route",
        message: sourceCheckoutOnly
          ? "source-checkout-only install wording needs an explicit allowlist entry"
          : "pack or skill install guidance must include npx skillpacks install",
      });
    }
  }

  if ((hasInstallDeckText || hasDeckInstallHeading || hasWrongDeckRoute) && !hasNpmDeckInstall) {
    findings.push({
      relPath,
      line: lineNumberFor(scanText, /install-deck|deck install|npx\s+skillpacks\s+install\s+<deck>|\/pack install\s+<deck>|\$pack install\s+<deck>/i),
      code: hasWrongDeckRoute ? "wrong-deck-install-route" : "missing-npm-install-deck-route",
      message: "deck install guidance must use npx skillpacks install-deck",
    });
  }

  if (hasWrongDeckRoute) {
    findings.push({
      relPath,
      line: lineNumberFor(scanText, /npx\s+skillpacks\s+install\s+<deck>|\/pack install\s+<deck>|\$pack install\s+<deck>/i),
      code: "deck-route-must-not-use-pack-install",
      message: "deck installs must not be described as pack or individual skill installs",
    });
  }

  return findings;
}

function printFindings(findings) {
  for (const finding of findings) {
    console.log(`${finding.relPath}:${finding.line}: ${finding.code}: ${finding.message}`);
  }
}

function scanFiles(scanRoot, files, allowlistEntries) {
  const filesByRel = new Map();
  for (const file of files) {
    filesByRel.set(normalizeRel(scanRoot, file), fs.readFileSync(file, "utf8"));
  }

  const { failures: allowlistFailures, usableEntries } = validateAllowlistEntries(allowlistEntries, filesByRel);
  const findings = [];
  for (const [relPath, text] of filesByRel.entries()) {
    findings.push(...scanFile(relPath, text, usableEntries));
  }

  return { findings, allowlistFailures, filesByRel };
}

function runActive(mode) {
  const files = collectActiveSkillFiles(root);
  const { findings, allowlistFailures, filesByRel } = scanFiles(root, files, readAllowlist(root));
  const missingP1 = P1_REQUIRED_FILES.filter((file) => !filesByRel.has(file));

  console.log(`Active SKILL.md files scanned: ${files.length}`);
  console.log(`P1 required coverage files: ${P1_REQUIRED_FILES.length - missingP1.length}/${P1_REQUIRED_FILES.length}`);
  console.log(`Install-routing findings: ${findings.length}`);

  if (missingP1.length > 0) {
    console.log("Missing P1 required coverage files:");
    for (const file of missingP1) console.log(`  ${file}`);
  }
  if (allowlistFailures.length > 0) {
    console.log("Allowlist failures:");
    for (const failure of allowlistFailures) console.log(`  ${failure}`);
  }
  if (findings.length > 0) {
    console.log("Findings:");
    printFindings(findings);
  }

  if (missingP1.length > 0 || allowlistFailures.length > 0) process.exit(1);
  if (mode === "active" && findings.length > 0) process.exit(1);
}

function runFixtures(fixturesDir) {
  const scanRoot = path.resolve(root, fixturesDir);
  if (!fs.existsSync(scanRoot)) {
    console.error(`Fixture directory not found: ${fixturesDir}`);
    process.exit(1);
  }

  const files = collectFixtureSkillFiles(scanRoot);
  const { findings, allowlistFailures, filesByRel } = scanFiles(scanRoot, files, readAllowlist(scanRoot));
  const findingsByPath = new Map();
  for (const finding of findings) {
    const list = findingsByPath.get(finding.relPath) || [];
    list.push(finding);
    findingsByPath.set(finding.relPath, list);
  }

  const expectationFailures = [];
  for (const relPath of filesByRel.keys()) {
    const expectedValid = relPath.startsWith("valid/");
    const expectedInvalid = relPath.startsWith("invalid/");
    if (!expectedValid && !expectedInvalid) {
      expectationFailures.push(`${relPath}: fixture paths must start with valid/ or invalid/`);
      continue;
    }

    const fileFindings = findingsByPath.get(relPath) || [];
    if (expectedValid && fileFindings.length > 0) {
      expectationFailures.push(`${relPath}: expected valid, got ${fileFindings.length} finding(s)`);
    }
    if (expectedInvalid && fileFindings.length === 0) {
      expectationFailures.push(`${relPath}: expected invalid, got no findings`);
    }
  }

  console.log(`Fixture SKILL.md files scanned: ${files.length}`);
  console.log(`Fixture findings: ${findings.length}`);

  if (allowlistFailures.length > 0) {
    console.log("Allowlist failures:");
    for (const failure of allowlistFailures) console.log(`  ${failure}`);
  }
  if (expectationFailures.length > 0) {
    console.log("Fixture expectation failures:");
    for (const failure of expectationFailures) console.log(`  ${failure}`);
  }
  if (findings.length > 0) {
    console.log("Fixture scanner findings:");
    printFindings(findings);
  }

  if (allowlistFailures.length > 0 || expectationFailures.length > 0) process.exit(1);
}

if (args.length === 1 && args[0] === "--active") {
  runActive("active");
}
else if (args.length === 1 && args[0] === "--report") {
  runActive("report");
}
else if (args.length === 2 && args[0] === "--fixtures") {
  runFixtures(args[1]);
}
else if (args.length === 1 && ["-h", "--help"].includes(args[0])) {
  usage(0);
}
else {
  usage(1);
}
NODE
