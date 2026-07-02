#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const args = process.argv.slice(2);

function usage(exitCode = 1) {
  const out = [
    "Usage: node scripts/skill-alignment-routing-audit.mjs [--active|--report]",
    "       node scripts/skill-alignment-routing-audit.mjs --fixtures <dir>",
    "       node scripts/skill-alignment-routing-audit.mjs --final-handoff-fixtures <dir>",
    "",
  ].join("\n");
  (exitCode === 0 ? process.stdout : process.stderr).write(out);
  process.exit(exitCode);
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive") continue;
      if (full.includes(`${path.sep}.codex${path.sep}skills${path.sep}`)) continue;
      if (full.includes(`${path.sep}.claude${path.sep}skills${path.sep}`)) continue;
      walk(full, out);
    }
    else if (entry.name === "SKILL.md") {
      out.push(full);
    }
  }
  return out;
}

function walkMarkdown(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive") continue;
      walkMarkdown(full, out);
    }
    else if (entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function rel(file, root = repoRoot) {
  return path.relative(root, file).split(path.sep).join("/");
}

function readFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    fields[field[1]] = field[2].replace(/^["']|["']$/g, "");
  }
  return fields;
}

function stripFrontmatter(text) {
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!match) return text;
  const lines = (match[0].match(/\n/g) || []).length;
  return "\n".repeat(lines) + text.slice(match[0].length);
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function isExecAllowed(relPath, fm) {
  return relPath.startsWith("packs/exec-loop/")
    || /^base\/(?:claude|codex)\/exec\//.test(relPath)
    || fm.type === "execution";
}

const execHandoffPatterns = [
  /\b[Rr]ecommended next command:\s*`?(?:\$exec|\/exec)\b/g,
  /\b[Rr]ecommend(?:ed|s|ing)?\s+`?(?:\$exec|\/exec)\b/g,
  /\b[Rr]oute(?:s|d|ing)?\s+(?:to|through)\s+`?(?:\$exec|\/exec)\b/g,
  /\b[Hh]and\s*off\s+to\s+`?(?:\$exec|\/exec)\b/g,
  /\b[Hh]andoff\s+to\s+`?(?:\$exec|\/exec)\b/g,
  /\b[Tt]he user runs\s+`?(?:\$exec|\/exec)\b/g,
  /\b[Rr]un\s+`?(?:\$exec|\/exec)\b/g,
  /\b`?(?:\$exec|\/exec)`?\s+(?:drives|handles|executes|to begin|to start)\b/g,
];

function sentenceAround(text, index) {
  const before = text.slice(0, index);
  const after = text.slice(index);
  const start = Math.max(
    before.lastIndexOf("\n"),
    before.lastIndexOf("."),
    before.lastIndexOf("!"),
    before.lastIndexOf("?"),
  ) + 1;
  const endCandidates = [
    after.indexOf("\n"),
    after.indexOf("."),
    after.indexOf("!"),
    after.indexOf("?"),
  ].filter((candidate) => candidate >= 0);
  const end = endCandidates.length > 0
    ? index + Math.min(...endCandidates)
    : text.length;
  return text.slice(start, end).trim();
}

function isProhibitiveExecMention(text, index) {
  const sentence = sentenceAround(text, index);
  return /\b(?:do not|don't|never|must not|should not|cannot|can't|no)\b/i.test(sentence)
    && /(?:route|hand\s*off|handoff|recommend|run)[\s\S]*?(?:\$exec|\/exec)/i.test(sentence);
}

function hasAlignmentArtifactContract(text) {
  const hasFinalCompiledYaml = /final compiled(?: response)? YAML/i.test(text);
  const hasReview = /\breview\b/i.test(text);
  const hasApprovalStop = /approval request itself is the next action/i.test(text)
    || /\bstop (?:again )?for (?:either )?(?:feedback-only YAML or )?final compiled(?: response)? YAML/i.test(text)
    || /while an alignment page is in `?review`?[\s\S]{0,240}next action is review[\s\S]{0,120}not downstream routing/i.test(text);
  const approvedArtifactsWritten = /approved artifact(?:s)?\s+(?:(?:has|have|are)\s+)?(?:been\s+)?written or updated/i;
  const onlyEmitAfterApprovedWrite = /only emit[\s\S]{0,160}(?:routing|\$[a-z0-9-]+|consumer)[\s\S]{0,160}after[\s\S]{0,160}(?:approved[\s\S]{0,120}(?:written|updated)|(?:artifact|brief|icp\.md)[\s\S]{0,120}approved and written)/i;
  const continuationAfterApprovedWrite = /(?:routing|continuation)[\s\S]{0,120}(?:allowed )?only after[\s\S]{0,120}approved[\s\S]{0,120}(?:written|updated)/i;
  const blocksDownstreamUntilApproved = onlyEmitAfterApprovedWrite.test(text)
    || continuationAfterApprovedWrite.test(text)
    || /downstream routing after approved artifact(?:s)?\s+(?:(?:has|have|are)\s+)?(?:been\s+)?written or updated/i.test(text)
    || (/do not include[\s\S]{0,180}downstream routing language until after/i.test(text) && approvedArtifactsWritten.test(text));

  return hasFinalCompiledYaml
    && hasReview
    && hasApprovalStop
    && blocksDownstreamUntilApproved;
}

const GAME_ALIGNMENT_SKILLS = new Set([
  "game-audience",
  "game-fantasy",
  "game-genre-map",
  "game-comparables",
  "game-core-loop",
  "game-prototype-test",
  "game-store-page-test",
  "game-playtest-metrics",
  "game-launch",
  "game-roadmap",
]);

function needsAlignmentArtifactContract(relPath, fm, text) {
  if (!/(?:research|analysis|planning|interview|prototype)/.test(fm.type || "")) return false;
  if (/^packs\/game\/(?:claude|codex)\//.test(relPath) && GAME_ALIGNMENT_SKILLS.has(fm.name)) {
    return true;
  }
  return /Staged Research Workflow|Report-First Approval Gate/.test(text);
}

function scanSkill(file, root = repoRoot) {
  const text = fs.readFileSync(file, "utf8");
  const fm = readFrontmatter(text);
  const relPath = rel(file, root);
  const scanText = stripFrontmatter(text);
  const findings = [];

  if (!isExecAllowed(relPath, fm)) {
    for (const pattern of execHandoffPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(scanText)) !== null) {
        if (isProhibitiveExecMention(scanText, match.index)) continue;
        findings.push({
          relPath,
          line: lineNumber(scanText, match.index),
          code: "non-exec-direct-exec-handoff",
          message: "active non-exec skills must route via approved YAML/task artifacts, not direct $exec or /exec handoffs",
        });
      }
    }
  }

  if (needsAlignmentArtifactContract(relPath, fm, scanText) && !hasAlignmentArtifactContract(scanText)) {
    findings.push({
      relPath,
      line: 1,
      code: "missing-alignment-yaml-stop-contract",
      message: "alignment-producing skills must stop for section-feedback YAML or final compiled YAML before downstream routing",
    });
  }

  return findings;
}

function collectTerminalRouteCandidates(text) {
  const lines = text.split(/\r?\n/);
  const nonEmptyLines = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim().length > 0);
  const fallbackStart = nonEmptyLines.length > 0
    ? nonEmptyLines[Math.max(0, nonEmptyLines.length - 12)].index
    : 0;
  const nextWorkEntries = [];
  const routeEntries = [];
  let currentHeading = "";
  let terminalSection = false;
  let artifactProseSection = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      currentHeading = heading[1].replace(/\*\*/g, "").trim();
      artifactProseSection = /\b(?:canonical artifact|artifact summary|artifact record|approved artifact|page content|alignment page|confirmed page)\b/i.test(currentHeading);
      terminalSection = !artifactProseSection
        && /\b(?:next|handoff|completion|done|final response|final handoff|next work)\b/i.test(currentHeading);
    }

    if (artifactProseSection) continue;
    if (!terminalSection && index < fallbackStart) continue;

    const nextWork = markdownLabelValue(line, "Next work");
    if (nextWork !== null) {
      nextWorkEntries.push({
        line: index + 1,
        text: cleanRouteText(nextWork),
        heading: currentHeading,
      });
    }

    const nextSkill = markdownLabelValue(line, "Recommended next skill");
    if (nextSkill !== null) {
      routeEntries.push({
        line: index + 1,
        label: "skill",
        route: cleanRouteText(nextSkill),
        heading: currentHeading,
      });
      continue;
    }

    const nextCommand = markdownLabelValue(line, "Recommended next command");
    if (nextCommand !== null) {
      routeEntries.push({
        line: index + 1,
        label: "command",
        route: cleanRouteText(nextCommand),
        heading: currentHeading,
      });
    }
  }

  const route = routeEntries.at(-1);
  if (!route) return null;

  const nextWork = nextWorkEntries
    .filter((entry) => entry.line <= route.line || route.label === "command")
    .at(-1);

  return {
    ...route,
    hasNextWork: Boolean(nextWork),
    nextWorkText: nextWork?.text || "",
  };
}

function markdownLabelValue(line, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = line.match(new RegExp(`^\\s*(?:[-*+]\\s*)?(?:\\*\\*)?${escaped}\\s*:\\s*(?:\\*\\*)?\\s*(.+?)\\s*$`, "i"));
  return match ? match[1] : null;
}

function cleanRouteText(raw) {
  return raw
    .replace(/<\/?code>/gi, "")
    .trim()
    .replace(/^`+|`+$/g, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\s*[.;]\s*$/g, "")
    .trim();
}

function scanFinalHandoffFixture(file, root = repoRoot) {
  const text = fs.readFileSync(file, "utf8");
  const fm = readFrontmatter(text);
  const relPath = rel(file, root);
  const scanText = stripFrontmatter(text);
  const routeKind = (fm.route_kind || "").toLowerCase();
  const agent = (fm.agent || "").toLowerCase();
  const expectedRoute = cleanRouteText(fm.expected_route || "");
  const findings = [];

  for (const [field, allowed] of [
    ["agent", ["codex", "claude"]],
    ["route_kind", ["skill", "shell", "none"]],
    ["expect", ["pass", "fail"]],
  ]) {
    const value = (fm[field] || "").toLowerCase();
    if (!allowed.includes(value)) {
      findings.push({
        relPath,
        line: 1,
        code: "invalid-final-handoff-fixture-frontmatter",
        message: `fixture frontmatter must include ${field}: ${allowed.join("|")}`,
      });
      return findings;
    }
  }

  const route = collectTerminalRouteCandidates(scanText);
  if (!route) {
    findings.push({
      relPath,
      line: 1,
      code: "missing-final-handoff-route",
      message: "final completion responses must end with Recommended next skill or Next work plus Recommended next command",
    });
    return findings;
  }

  if (route.label === "command" && !route.hasNextWork) {
    findings.push({
      relPath,
      line: route.line,
      code: "missing-next-work-pair",
      message: "Recommended next command must be paired with a terminal Next work line",
    });
    return findings;
  }

  if (/^none$/i.test(route.route) && expectedRoute && !/^none$/i.test(expectedRoute)) {
    findings.push({
      relPath,
      line: route.line,
      code: "final-handoff-none-despite-expected-route",
      message: `handoff says none but fixture expected ${expectedRoute}`,
    });
    return findings;
  }

  if (routeKind === "none") {
    if (!/^none$/i.test(route.route)) {
      findings.push({
        relPath,
        line: route.line,
        code: "final-handoff-route-kind-mismatch",
        message: "route_kind none requires Recommended next command: none",
      });
      return findings;
    }
    if (!route.hasNextWork || !/\b(?:manual|decision|review|approve|approval|choose|user|external|no automated|none remaining)\b/i.test(route.nextWorkText)) {
      findings.push({
        relPath,
        line: route.line,
        code: "final-handoff-none-missing-manual-state",
        message: "Recommended next command: none must name the manual or decision state in Next work",
      });
    }
    return findings;
  }

  if (/^none$/i.test(route.route)) {
    findings.push({
      relPath,
      line: route.line,
      code: "final-handoff-route-kind-mismatch",
      message: `${routeKind} fixtures require an executable route, not none`,
    });
    return findings;
  }

  if (routeKind === "skill") {
    const firstToken = route.route.split(/\s+/)[0] || "";
    const expectedPrefix = agent === "claude" ? "/" : "$";
    const wrongPrefix = agent === "claude" ? "$" : "/";
    if (!firstToken.startsWith(expectedPrefix) || firstToken.startsWith(wrongPrefix)) {
      findings.push({
        relPath,
        line: route.line,
        code: "wrong-skill-cli-syntax",
        message: `${agent} skill handoffs must use ${expectedPrefix}skill syntax`,
      });
      return findings;
    }
  }

  if (routeKind === "shell" && (route.label === "skill" || /^[/$][A-Za-z0-9_-]+/.test(route.route))) {
    findings.push({
      relPath,
      line: route.line,
      code: "final-handoff-route-kind-mismatch",
      message: "route_kind shell requires a shell/project command, not a skill route",
    });
    return findings;
  }

  if (expectedRoute && !/^none$/i.test(expectedRoute) && route.route !== expectedRoute) {
    findings.push({
      relPath,
      line: route.line,
      code: "final-handoff-route-mismatch",
      message: `expected ${expectedRoute} but found ${route.route}`,
    });
  }

  return findings;
}

function collectFinalHandoffFixtures(dir) {
  return walkMarkdown(path.resolve(repoRoot, dir)).sort();
}

function runFinalHandoffFixtures(files, rootForRel) {
  const expectedFailureDiagnostics = [];
  const unexpectedFindings = [];
  let expectedPasses = 0;
  let expectedFailures = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const fm = readFrontmatter(text);
    const expected = (fm.expect || "").toLowerCase();
    const findings = scanFinalHandoffFixture(file, rootForRel);

    if (expected === "fail") {
      expectedFailures += 1;
      if (findings.length === 0) {
        unexpectedFindings.push({
          relPath: rel(file, rootForRel),
          line: 1,
          code: "final-handoff-fixture-unexpected-pass",
          message: "fixture expected fail but no final-handoff diagnostics were found",
        });
      }
      else {
        expectedFailureDiagnostics.push(...findings);
      }
    }
    else {
      expectedPasses += 1;
      unexpectedFindings.push(...findings);
    }
  }

  console.log(`Final handoff Markdown fixtures scanned: ${files.length}`);
  console.log(`Expected-pass fixtures: ${expectedPasses}`);
  console.log(`Expected-fail fixtures: ${expectedFailures}`);
  console.log(`Expected failure diagnostics: ${expectedFailureDiagnostics.length}`);
  for (const finding of expectedFailureDiagnostics) {
    console.log(`${finding.relPath}:${finding.line}: expected-fail: ${finding.code}: ${finding.message}`);
  }
  console.log(`Unexpected fixture results: ${unexpectedFindings.length}`);
  printFindings(unexpectedFindings);

  return unexpectedFindings;
}

function collectActive() {
  return [
    ...walk(path.join(repoRoot, "packs")),
  ].sort();
}

function collectFixtures(dir) {
  return walk(path.resolve(repoRoot, dir)).sort();
}

function printFindings(findings) {
  for (const finding of findings) {
    console.log(`${finding.relPath}:${finding.line}: ${finding.code}: ${finding.message}`);
  }
}

if (args.length === 0) args.push("--active");
if (args.includes("--help")) usage(0);

let files;
let mode;
let rootForRel = repoRoot;

if (args[0] === "--active" || args[0] === "--report") {
  mode = args[0];
  files = collectActive();
}
else if (args[0] === "--fixtures") {
  if (!args[1]) usage();
  mode = "--fixtures";
  rootForRel = path.resolve(repoRoot, args[1]);
  files = collectFixtures(args[1]);
}
else if (args[0] === "--final-handoff-fixtures") {
  if (!args[1]) usage();
  mode = "--final-handoff-fixtures";
  rootForRel = path.resolve(repoRoot, args[1]);
  files = collectFinalHandoffFixtures(args[1]);
}
else {
  usage();
}

if (mode === "--final-handoff-fixtures") {
  const unexpectedFindings = runFinalHandoffFixtures(files, rootForRel);
  if (unexpectedFindings.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}

const findings = files.flatMap((file) => scanSkill(file, rootForRel));

if (mode === "--report") {
  console.log(`Active SKILL.md files scanned: ${files.length}`);
  console.log(`Alignment-routing findings: ${findings.length}`);
}
else if (mode === "--fixtures") {
  console.log(`Fixture SKILL.md files scanned: ${files.length}`);
  console.log(`Fixture findings: ${findings.length}`);
}

printFindings(findings);

if (findings.length > 0) {
  process.exit(1);
}

if (mode === "--active") {
  console.log(`All ${files.length} active SKILL.md files satisfy alignment/YAML routing rules.`);
}
