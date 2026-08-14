#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const defaultFixturePath = "tests/fixtures/afps-2.0-canary/youtube-launch-play/fixture.json";

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
  }

  const forbidden = /approval_status|gate_answers|authorized|permission_granted/i;
  if (forbidden.test(JSON.stringify(packet))) errors.push("checkpoint packet contains approval or authorization semantics");
  return errors;
}

export function runLaunchCanary({ root = repoRoot, fixturePath = defaultFixturePath } = {}) {
  const fixture = readJson(fixturePath, root);
  const failures = [];
  const legacyStops = fixture.legacy.skills.reduce((total, skill) => total + skill.routine_stops, 0);

  if (legacyStops !== fixture.legacy.routine_stops) {
    failures.push(`legacy stop total ${legacyStops} does not match fixture total ${fixture.legacy.routine_stops}`);
  }

  for (const skill of fixture.legacy.skills) {
    const claude = readText(skill.claude, root);
    const codex = readText(skill.codex, root);
    for (const marker of skill.markers) {
      if (!claude.includes(marker)) failures.push(`${skill.claude} is missing legacy marker: ${marker}`);
      if (!codex.includes(marker)) failures.push(`${skill.codex} is missing legacy marker: ${marker}`);
    }
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

  const checkpointOwners = active.filter(({ claude, codex }) =>
    claude.includes(fixture.afps2.checkpoint_id) || codex.includes(fixture.afps2.checkpoint_id)
  );
  if (checkpointOwners.length !== 1 || checkpointOwners[0]?.name !== fixture.afps2.checkpoint_owner) {
    failures.push(`expected one checkpoint owner (${fixture.afps2.checkpoint_owner}), found ${checkpointOwners.map(({ name }) => name).join(", ") || "none"}`);
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
      review_only_pages: fixture.legacy.review_only_pages
    },
    afps2: {
      routine_stops: fixture.afps2.routine_stops,
      maximum_material_checkpoints: fixture.afps2.maximum_material_checkpoints,
      review_only_pages: fixture.afps2.review_only_pages,
      checkpoint_owner: fixture.afps2.checkpoint_owner
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
