#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: lane-spec-validate.sh [lane-specs.json]

Validate a monorepo lane-spec artifact.

Arguments:
  lane-specs.json  Lane-spec file to validate. Defaults to .agents/lane-specs.json.

Checks:
  - Required top-level fields and lane fields are present.
  - Lifecycle is one of draft, approved, dispatched, integrated, failed.
  - Lane owns paths are disjoint.
  - Every lane must_not_edit includes lockfile and root config paths.
  - Lane depends_on references resolve to known step IDs.
  - Every lane has a unique non-primary branch name for PR review.
EOF
}

SPEC_FILE=".agents/lane-specs.json"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ "$SPEC_FILE" != ".agents/lane-specs.json" ]]; then
        echo "ERROR: unexpected argument: $1" >&2
        usage >&2
        exit 2
      fi
      SPEC_FILE="$1"
      shift
      ;;
  esac
done

node - "$SPEC_FILE" <<'NODE'
const fs = require("fs");
const path = require("path");

const specFile = process.argv[2];
const validLifecycles = new Set(["draft", "approved", "dispatched", "integrated", "failed"]);
const requiredRootMustNotEdit = ["pnpm-lock.yaml", "package.json", "pnpm-workspace.yaml", "turbo.json"];
const topLevelFields = ["phase", "source_roadmap_hash", "lifecycle", "cross_cutting_steps", "lanes"];
const laneFields = ["id", "step", "packages", "owns", "must_not_edit", "depends_on", "mode", "branch"];

function fail(message, code = 1) {
  console.error(`ERROR: ${message}`);
  process.exit(code);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`failed to parse JSON at ${file}: ${error.message}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function describeLane(lane, index) {
  return isPlainObject(lane) && typeof lane.id === "string" && lane.id.trim()
    ? `lane ${lane.id}`
    : `lane at index ${index}`;
}

function normalizePath(value) {
  if (typeof value !== "string") return null;
  let normalized = value.trim().replace(/\\/g, "/").replace(/^\.\//, "");
  normalized = path.posix.normalize(normalized);
  if (normalized === ".") normalized = "";
  normalized = normalized.replace(/^\/+/, "");
  return normalized;
}

function normalizeBoundary(value) {
  const normalized = normalizePath(value);
  if (normalized === null || normalized === "") return normalized;
  return value.endsWith("/") && !normalized.endsWith("/") ? `${normalized}/` : normalized;
}

function pathContains(parent, child) {
  const parentDir = parent.endsWith("/") ? parent : `${parent}/`;
  return child === parent || child.startsWith(parentDir);
}

function hasBoundary(list, required) {
  const normalizedRequired = normalizePath(required);
  return list.some((entry) => {
    const normalizedEntry = normalizePath(entry);
    return normalizedEntry === normalizedRequired;
  });
}

function assertString(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    fail(`${field} must be a non-empty string`);
  }
}

function assertStringArray(value, field, { allowEmpty = true } = {}) {
  if (!Array.isArray(value)) {
    fail(`${field} must be an array`);
  }
  if (!allowEmpty && value.length === 0) {
    fail(`${field} must not be empty`);
  }
  for (const [index, item] of value.entries()) {
    if (typeof item !== "string" || !item.trim()) {
      fail(`${field}[${index}] must be a non-empty string`);
    }
  }
}

if (!fs.existsSync(specFile)) {
  fail(`lane-spec file not found: ${specFile}`);
}

const spec = readJson(specFile);
if (!isPlainObject(spec)) {
  fail("lane-spec root must be a JSON object");
}

for (const field of topLevelFields) {
  if (!(field in spec)) {
    fail(`missing required top-level field: ${field}`);
  }
}

assertString(spec.phase, "phase");
assertString(spec.source_roadmap_hash, "source_roadmap_hash");
assertString(spec.lifecycle, "lifecycle");

if (!validLifecycles.has(spec.lifecycle)) {
  fail(`invalid lifecycle: ${spec.lifecycle}`);
}

if (!Array.isArray(spec.cross_cutting_steps)) {
  fail("cross_cutting_steps must be an array");
}

if (!Array.isArray(spec.lanes) || spec.lanes.length === 0) {
  fail("lanes must be a non-empty array");
}

const knownSteps = new Set();
for (const [index, step] of spec.cross_cutting_steps.entries()) {
  if (!isPlainObject(step)) {
    fail(`cross_cutting_steps[${index}] must be an object`);
  }
  assertString(step.step, `cross_cutting_steps[${index}].step`);
  if (knownSteps.has(step.step)) {
    fail(`duplicate step id: ${step.step}`);
  }
  knownSteps.add(step.step);
}

const laneIds = new Set();
const branchNames = new Set();
const owns = [];

for (const [index, lane] of spec.lanes.entries()) {
  const label = describeLane(lane, index);
  if (!isPlainObject(lane)) {
    fail(`${label} must be an object`);
  }

  for (const field of laneFields) {
    if (!(field in lane)) {
      fail(`${label} missing required field: ${field}`);
    }
  }

  assertString(lane.id, `${label}.id`);
  assertString(lane.step, `${label}.step`);
  assertString(lane.mode, `${label}.mode`);
  assertString(lane.branch, `${label}.branch`);
  assertStringArray(lane.packages, `${label}.packages`, { allowEmpty: false });
  assertStringArray(lane.owns, `${label}.owns`, { allowEmpty: false });
  assertStringArray(lane.must_not_edit, `${label}.must_not_edit`, { allowEmpty: false });
  assertStringArray(lane.depends_on, `${label}.depends_on`);

  if (laneIds.has(lane.id)) {
    fail(`duplicate lane id: ${lane.id}`);
  }
  laneIds.add(lane.id);

  const branch = lane.branch.trim();
  if (branch === "main" || branch === "master") {
    fail(`${label}.branch must not be the primary branch: ${branch}`);
  }
  if (!/^[A-Za-z0-9._/-]+$/.test(branch)) {
    fail(`${label}.branch contains unsupported characters: ${branch}`);
  }
  if (branchNames.has(branch)) {
    fail(`duplicate branch name: ${branch}`);
  }
  branchNames.add(branch);

  if (knownSteps.has(lane.step)) {
    fail(`duplicate step id: ${lane.step}`);
  }
  knownSteps.add(lane.step);

  for (const required of requiredRootMustNotEdit) {
    if (!hasBoundary(lane.must_not_edit, required)) {
      fail(`${label}.must_not_edit missing required root boundary: ${required}`);
    }
  }

  for (const ownerPath of lane.owns) {
    const normalized = normalizeBoundary(ownerPath);
    if (!normalized) {
      fail(`${label}.owns contains an empty path`);
    }
    owns.push({ lane: lane.id, path: normalized });
  }
}

for (const [index, lane] of spec.lanes.entries()) {
  const label = describeLane(lane, index);
  for (const dependency of lane.depends_on) {
    if (!knownSteps.has(dependency)) {
      fail(`${label}.depends_on references unknown step: ${dependency}`);
    }
    if (dependency === lane.step) {
      fail(`${label}.depends_on references its own step: ${dependency}`);
    }
  }
}

for (let leftIndex = 0; leftIndex < owns.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < owns.length; rightIndex += 1) {
    const left = owns[leftIndex];
    const right = owns[rightIndex];
    if (left.lane === right.lane) continue;
    if (pathContains(left.path, right.path) || pathContains(right.path, left.path)) {
      fail(`owns paths overlap between lanes ${left.lane} and ${right.lane}: ${left.path} <-> ${right.path}`);
    }
  }
}

console.log(`valid: ${specFile}`);
NODE
