#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const defaultFixturePath = "tests/fixtures/afps-2.0-canary/youtube-launch-play/fixture.json";
const permissionBoundActionPatterns = [
  /\b(?:publish|publication|schedule|scheduling|post|release)\b/i,
  /\bupload\b(?!-ready\b)/i,
  /\b(?:make|set|change|switch)\b.{0,100}\bpublic\b/i,
  /\bapply\b.{0,100}\b(?:channel|account|YouTube Studio)\b/i,
  /\b(?:YouTube Studio|public visibility|account-authenticated|authenticated account|log in|sign in)\b/i
];
const reversibleLocalActionPattern = /\b(?:local|reversible|canonical|artifact|report|draft|description|research|file|manifest|record|compare|validate|generate|render|write|prepare|revise)\b/i;
const routineStopPatterns = [
  /Report-First Approval Gate/i,
  /Staged Research Workflow/i,
  /compiled YAML/i,
  /\b(?:scope|artifact|report|draft|plan) approval\b/i,
  /\bapproval (?:gate|page|step|status|sidecar)\b/i,
  /\b(?:stop|pause|wait)\b.{0,100}\b(?:approval|confirmation|sign-?off)\b/i,
  /required_conventions:\s*\[[^\]]*(?:alignment-page|interrogation-page)/i
];

function readJson(relativePath, root = repoRoot) {
  return JSON.parse(readFileSync(path.resolve(root, relativePath), "utf8"));
}

function readText(relativePath, root = repoRoot) {
  return readFileSync(path.resolve(root, relativePath), "utf8");
}

function activeSkillPath(agent, name) {
  return `packs/youtube-ops/${agent}/${name}/SKILL.md`;
}

function normalizedMirror(text) {
  return text
    .replaceAll("Invoke as `/", "Invoke as `$")
    .replaceAll(/(^|[\s`(])\/([a-z][a-z0-9-]*)(?=[\s`.,;:)\]])/gm, "$1$$$2")
    .replace(/^version:\s*v\d+\.\d+$/m, "version: VERSION");
}

function exactKeys(value, required, optional = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const allowed = [...required, ...optional];
  return required.every((key) => actual.includes(key)) && actual.every((key) => allowed.includes(key));
}

export function validateCheckpointPacket(packet) {
  const errors = [];
  if (!exactKeys(packet, ["command", "checkpoint", "decisions", "resume_context"], ["notes"])) {
    errors.push("checkpoint packet has missing or unsupported top-level keys");
  }
  if (typeof packet?.command !== "string" || packet.command.length === 0) errors.push("command must be a non-empty string");
  if (typeof packet?.checkpoint !== "string" || packet.checkpoint.length === 0) errors.push("checkpoint must be a non-empty string");
  if (!Array.isArray(packet?.decisions)) {
    errors.push("decisions must be an array");
  } else {
    if (packet.decisions.length > 3) errors.push("decisions must contain at most three entries");
    for (const [index, decision] of packet.decisions.entries()) {
      if (!exactKeys(decision, ["id", "question", "recommendation", "confidence", "choice"])) {
        errors.push(`decision ${index + 1} has missing or unsupported keys`);
      }
      if (!new Set(["high", "medium", "low"]).has(decision?.confidence)) {
        errors.push(`decision ${index + 1} has invalid confidence`);
      }
    }
  }
  if (!exactKeys(packet?.resume_context, ["artifacts", "evidence", "next_safe_move"])) {
    errors.push("resume_context has missing or unsupported keys");
  }
  if (!Array.isArray(packet?.resume_context?.artifacts)) errors.push("resume_context.artifacts must be an array");
  if (!Array.isArray(packet?.resume_context?.evidence)) errors.push("resume_context.evidence must be an array");
  if (typeof packet?.resume_context?.next_safe_move !== "string" || packet.resume_context.next_safe_move.length === 0) {
    errors.push("resume_context.next_safe_move must be a non-empty string");
  } else if (
    permissionBoundActionPatterns.some((pattern) => pattern.test(packet.resume_context.next_safe_move)) ||
    !reversibleLocalActionPattern.test(packet.resume_context.next_safe_move)
  ) {
    errors.push("resume_context.next_safe_move must remain reversible and cannot perform a permission-bound external action");
  }

  const forbidden = /approval_status|gate_answers|authorized|permission_granted/i;
  if (forbidden.test(JSON.stringify(packet))) errors.push("checkpoint packet contains approval or authorization semantics");
  return errors;
}

function isNegativeContractLine(line) {
  return /\b(?:do not create|do not add|does not add|not reasons? to ask|without asking for)\b/i.test(line);
}

function checkpointIdsFromLine(line) {
  if (!/checkpoint/i.test(line)) return [];
  const ids = new Set();
  for (const match of line.matchAll(/(?:use|add|introduce|additional|material|decision)[^.\n]{0,100}\bcheckpoint\s*,?\s*`([a-z][a-z0-9]*(?:-[a-z0-9]+)+)`/gi)) {
    ids.add(match[1]);
  }
  for (const match of line.matchAll(/checkpoint\s*(?::|—|-)\s*([a-z][a-z0-9]*(?:-[a-z0-9]+)+)/gi)) {
    ids.add(match[1]);
  }
  return [...ids];
}

function analyzeActiveContracts(active, root) {
  const checkpointIds = new Set();
  const checkpointOwners = new Map();
  const routineStops = new Set();
  const reviewPageProducers = new Set();

  for (const skill of active) {
    for (const bundle of ["ALIGNMENT-PAGE.md", "INTERROGATION-PAGE.md"]) {
      const kind = bundle.startsWith("ALIGNMENT") ? "alignment" : "interrogation";
      for (const skillPath of [skill.claudePath, skill.codexPath]) {
        const bundlePath = path.posix.join(path.posix.dirname(skillPath), bundle);
        if (existsSync(path.resolve(root, bundlePath))) reviewPageProducers.add(`${skill.name}:${kind}:bundle`);
      }
    }

    for (const text of [skill.claude, skill.codex]) {
      for (const rawLine of text.split("\n")) {
        const line = rawLine.replaceAll("/youtube-", "$youtube-").trim();
        for (const checkpointId of checkpointIdsFromLine(line)) {
          checkpointIds.add(checkpointId);
          if (!checkpointOwners.has(checkpointId)) checkpointOwners.set(checkpointId, new Set());
          checkpointOwners.get(checkpointId).add(skill.name);
        }

        if (isNegativeContractLine(line)) continue;
        if (routineStopPatterns.some((pattern) => pattern.test(line))) routineStops.add(`${skill.name}:${line}`);
        if (/(?:create|write|generate|open|build|update)\b.{0,100}\balignment(?:\/| page)/i.test(line)) {
          reviewPageProducers.add(`${skill.name}:alignment:source`);
        }
        if (/(?:create|write|generate|open|build|update)\b.{0,100}\binterrogation(?:\/| page)/i.test(line)) {
          reviewPageProducers.add(`${skill.name}:interrogation:source`);
        }
      }
    }
  }

  const logicalReviewProducers = new Set([...reviewPageProducers].map((entry) => entry.split(":").slice(0, 2).join(":")));
  return {
    checkpointIds: [...checkpointIds].sort(),
    checkpointOwners,
    routineStops: [...routineStops].sort(),
    reviewPageProducers: [...logicalReviewProducers].sort()
  };
}

export function runLaunchCanary({ root = repoRoot, fixturePath = defaultFixturePath } = {}) {
  const fixture = readJson(fixturePath, root);
  const failures = [];
  const legacyStopEvidence = [];

  for (const skill of fixture.legacy.skills) {
    const claude = readText(skill.claude, root);
    const codex = readText(skill.codex, root);
    for (const marker of skill.stop_markers) {
      if (!claude.includes(marker)) failures.push(`${skill.claude} is missing legacy marker: ${marker}`);
      if (!codex.includes(marker)) failures.push(`${skill.codex} is missing legacy marker: ${marker}`);
      if (claude.includes(marker) && codex.includes(marker)) legacyStopEvidence.push(`${skill.name}:${marker}`);
    }
  }
  const legacyStops = legacyStopEvidence.length;
  const legacyReviewPages = legacyStopEvidence.length;
  if (legacyStops !== fixture.legacy.expected.routine_stops) {
    failures.push(`measured legacy stop total ${legacyStops} does not match expected ${fixture.legacy.expected.routine_stops}`);
  }
  if (legacyReviewPages !== fixture.legacy.expected.review_only_pages) {
    failures.push(`measured legacy review-page total ${legacyReviewPages} does not match expected ${fixture.legacy.expected.review_only_pages}`);
  }

  const active = [];
  for (const name of fixture.afps2.skills) {
    const claudePath = activeSkillPath("claude", name);
    const codexPath = activeSkillPath("codex", name);
    const claude = readText(claudePath, root);
    const codex = readText(codexPath, root);
    active.push({ name, claudePath, codexPath, claude, codex });

    if (!claude.includes("required_conventions: [afps-2.0]")) failures.push(`${claudePath} does not require AFPS 2.0`);
    if (!codex.includes("required_conventions: [afps-2.0]")) failures.push(`${codexPath} does not require AFPS 2.0`);
    for (const forbidden of fixture.afps2.forbidden_ordinary_semantics) {
      if (claude.includes(forbidden)) failures.push(`${claudePath} contains forbidden ordinary semantics: ${forbidden}`);
      if (codex.includes(forbidden)) failures.push(`${codexPath} contains forbidden ordinary semantics: ${forbidden}`);
    }
    if (normalizedMirror(claude) !== normalizedMirror(codex)) failures.push(`${name} Claude/Codex semantic mirrors diverge`);
  }

  const combined = active.flatMap(({ claude, codex }) => [claude, codex]).join("\n");
  for (const field of fixture.afps2.required_slice_fields) {
    if (!combined.includes(`\`${field}\``)) failures.push(`active launch trio does not expose slice field: ${field}`);
  }
  for (const phrase of fixture.afps2.required_permission_phrases) {
    if (!combined.includes(phrase)) failures.push(`active launch trio does not preserve permission phrase: ${phrase}`);
  }

  const measured = analyzeActiveContracts(active, root);
  const expectedCheckpointOwners = [...(measured.checkpointOwners.get(fixture.afps2.checkpoint_id) ?? [])];
  if (expectedCheckpointOwners.length !== 1 || expectedCheckpointOwners[0] !== fixture.afps2.checkpoint_owner) {
    failures.push(`expected one checkpoint owner (${fixture.afps2.checkpoint_owner}), found ${expectedCheckpointOwners.join(", ") || "none"}`);
  }
  if (measured.checkpointIds.length !== fixture.afps2.expected.maximum_material_checkpoints) {
    failures.push(`measured ${measured.checkpointIds.length} material checkpoints (${measured.checkpointIds.join(", ") || "none"}); expected at most ${fixture.afps2.expected.maximum_material_checkpoints}`);
  }
  if (measured.routineStops.length !== fixture.afps2.expected.routine_stops) {
    failures.push(`measured ${measured.routineStops.length} routine stops; expected ${fixture.afps2.expected.routine_stops}`);
  }
  if (measured.reviewPageProducers.length !== fixture.afps2.expected.review_only_pages) {
    failures.push(`measured ${measured.reviewPageProducers.length} review-page producers (${measured.reviewPageProducers.join(", ") || "none"}); expected ${fixture.afps2.expected.review_only_pages}`);
  }

  const fixtureDir = path.posix.dirname(fixturePath);
  const goodPacket = readJson(`${fixtureDir}/checkpoint-good.json`, root);
  const badPacket = readJson(`${fixtureDir}/checkpoint-bad.json`, root);
  const goodErrors = validateCheckpointPacket(goodPacket);
  const badErrors = validateCheckpointPacket(badPacket);
  if (goodErrors.length > 0) failures.push(`known-good checkpoint failed: ${goodErrors.join("; ")}`);
  if (badErrors.length === 0) failures.push("known-bad checkpoint unexpectedly passed");
  if (goodPacket.checkpoint !== fixture.afps2.checkpoint_id) failures.push("known-good checkpoint ID differs from the fixture contract");

  return {
    fixture: fixture.id,
    legacy: {
      routine_stops: legacyStops,
      review_only_pages: legacyReviewPages
    },
    afps2: {
      routine_stops: measured.routineStops.length,
      maximum_material_checkpoints: measured.checkpointIds.length,
      review_only_pages: measured.reviewPageProducers.length,
      checkpoint_owner: expectedCheckpointOwners.length === 1 ? expectedCheckpointOwners[0] : null,
      checkpoint_ids: measured.checkpointIds
    },
    packet_discrimination: {
      known_good_errors: goodErrors,
      known_bad_errors: badErrors
    },
    failures
  };
}

function main() {
  const fixtureArg = process.argv.find((arg) => arg.startsWith("--fixture="));
  const result = runLaunchCanary({ fixturePath: fixtureArg ? fixtureArg.slice("--fixture=".length) : defaultFixturePath });
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("AFPS 2.0 YouTube Launch Canary");
    console.log("===============================");
    console.log(`Legacy routine stops: ${result.legacy.routine_stops}`);
    console.log(`AFPS 2.0 routine stops: ${result.afps2.routine_stops}`);
    console.log(`AFPS 2.0 maximum material checkpoints: ${result.afps2.maximum_material_checkpoints}`);
    console.log(`Legacy review-only pages: ${result.legacy.review_only_pages}`);
    console.log(`AFPS 2.0 review-only pages: ${result.afps2.review_only_pages}`);
    console.log(`Failures: ${result.failures.length}`);
    for (const failure of result.failures) console.log(`  - ${failure}`);
  }
  if (result.failures.length > 0) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
