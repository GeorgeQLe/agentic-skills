#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
PACKAGE_DIR=$(cd -- "$SCRIPT_DIR/.." && pwd)
PACKAGE_JSON="$PACKAGE_DIR/package.json"

PACKAGE_NAME=${SKILLPACKS_PACKAGE_NAME:-$(node -e "console.log(require(process.argv[1]).name)" "$PACKAGE_JSON")}
EXPECTED_VERSION=${SKILLPACKS_EXPECTED_VERSION:-$(node -e "console.log(require(process.argv[1]).version)" "$PACKAGE_JSON")}
EXPECTED_LICENSE=${SKILLPACKS_EXPECTED_LICENSE:-MIT}
EXPECTED_DIST_TAG=${SKILLPACKS_EXPECTED_DIST_TAG:-latest}
NPM_SPEC=${SKILLPACKS_NPM_SPEC:-$PACKAGE_NAME@latest}
NPM_CACHE=${SKILLPACKS_NPM_CACHE:-/tmp/skillpacks-npm-cache}
TMP_ROOT=${SKILLPACKS_TMP_ROOT:-/tmp}
KEEP_TMP=${SKILLPACKS_KEEP_TMP:-1}
VERIFY_PUBLISHED_ATTEMPTS=${SKILLPACKS_VERIFY_PUBLISHED_ATTEMPTS:-12}
VERIFY_PUBLISHED_DELAY_SECONDS=${SKILLPACKS_VERIFY_PUBLISHED_DELAY_SECONDS:-5}

TMP_DIRS=()

log() {
  printf '\n==> %s\n' "$*"
}

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

validate_retry_config() {
  if [[ ! "$VERIFY_PUBLISHED_ATTEMPTS" =~ ^[0-9]+$ ]] || (( VERIFY_PUBLISHED_ATTEMPTS < 1 )); then
    fail "SKILLPACKS_VERIFY_PUBLISHED_ATTEMPTS must be a positive integer."
  fi

  if [[ ! "$VERIFY_PUBLISHED_DELAY_SECONDS" =~ ^[0-9]+$ ]]; then
    fail "SKILLPACKS_VERIFY_PUBLISHED_DELAY_SECONDS must be a non-negative integer."
  fi
}

make_tmp() {
  local label=$1
  local dir
  dir=$(mktemp -d "$TMP_ROOT/skillpacks-${label}-XXXXXX")
  TMP_DIRS+=("$dir")
  printf '%s\n' "$dir"
}

cleanup() {
  if [[ "$KEEP_TMP" == "0" ]]; then
    local dir
    if (( ${#TMP_DIRS[@]} == 0 )); then
      return 0
    fi
    for dir in "${TMP_DIRS[@]}"; do
      if [[ "$dir" == /tmp/skillpacks-* && -d "$dir" ]]; then
        rm -rf "$dir"
      fi
    done
  fi
}

trap cleanup EXIT
validate_retry_config

is_npm_propagation_error() {
  local output=$1

  [[ "$output" == *"ETARGET"* ]] && return 0
  [[ "$output" == *"npm ERR! notarget"* ]] && return 0
  [[ "$output" == *"npm error notarget"* ]] && return 0
  [[ "$output" == *"No matching version found for $NPM_SPEC"* ]] && return 0
  return 1
}

run_cli_with_retries() {
  local cwd=$1
  shift
  local attempt
  local output
  local summary

  for ((attempt = 1; attempt <= VERIFY_PUBLISHED_ATTEMPTS; attempt++)); do
    if output=$(cd "$cwd" && npx -y --prefer-online --package "$NPM_SPEC" --cache "$NPM_CACHE" -- skillpacks "$@" 2>&1); then
      [[ -n "$output" ]] && printf '%s\n' "$output"
      return 0
    fi

    if is_npm_propagation_error "$output" && (( attempt < VERIFY_PUBLISHED_ATTEMPTS )); then
      summary=${output//$'\n'/; }
      printf 'published package smoke command hit npm propagation error for %s (attempt %s/%s): %s; retrying in %ss\n' \
        "$NPM_SPEC" \
        "$attempt" \
        "$VERIFY_PUBLISHED_ATTEMPTS" \
        "$summary" \
        "$VERIFY_PUBLISHED_DELAY_SECONDS" >&2
      sleep "$VERIFY_PUBLISHED_DELAY_SECONDS"
      continue
    fi

    [[ -n "$output" ]] && printf '%s\n' "$output" >&2
    return 1
  done

  return 1
}

run_cli_in() {
  local cwd=$1
  shift
  printf '+ (cd %s &&' "$cwd"
  printf ' %q' npx -y --prefer-online --package "$NPM_SPEC" --cache "$NPM_CACHE" -- skillpacks "$@"
  printf ')\n'
  run_cli_with_retries "$cwd" "$@"
}

capture_cli_in() {
  local cwd=$1
  shift
  run_cli_with_retries "$cwd" "$@"
}

assert_metadata() {
  local metadata_json=$1
  local dist_tag_json=$2
  local versions_json=$3
  METADATA_JSON=$metadata_json DIST_TAG_JSON=$dist_tag_json VERSIONS_JSON=$versions_json node - "$PACKAGE_NAME" "$EXPECTED_VERSION" "$EXPECTED_LICENSE" "$EXPECTED_DIST_TAG" <<'NODE'
const metadata = JSON.parse(process.env.METADATA_JSON);
const distTagVersion = JSON.parse(process.env.DIST_TAG_JSON);
const versions = JSON.parse(process.env.VERSIONS_JSON);
const [packageName, expectedVersion, expectedLicense, expectedDistTag] = process.argv.slice(2);
const failures = [];

if (metadata.version !== expectedVersion) {
  failures.push(`${packageName}@${expectedDistTag} version expected ${expectedVersion}, got ${metadata.version}`);
}
if (distTagVersion !== expectedVersion) {
  failures.push(`${packageName} ${expectedDistTag} dist-tag expected ${expectedVersion}, got ${distTagVersion}`);
}
if (metadata.license !== expectedLicense) {
  failures.push(`${packageName} license expected ${expectedLicense}, got ${metadata.license}`);
}
if (!Array.isArray(versions) || !versions.includes(expectedVersion)) {
  failures.push(`${packageName} versions does not include ${expectedVersion}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

if (versions.length === 1) {
  console.log(`ok metadata: ${packageName}@${expectedDistTag}=${expectedVersion}, license=${expectedLicense}; package-version upgrade test skipped because npm has one published version`);
} else {
  console.log(`ok metadata: ${packageName}@${expectedDistTag}=${expectedVersion}, license=${expectedLicense}; published versions=${versions.join(",")}`);
}
NODE
}

verify_metadata_with_retries() {
  local attempt
  local metadata_output
  local last_metadata_output=""
  local metadata_ok=0
  local mismatch
  local metadata_json=""
  local dist_tag_json=""
  local versions_json=""
  local tag_spec="$PACKAGE_NAME@$EXPECTED_DIST_TAG"

  for ((attempt = 1; attempt <= VERIFY_PUBLISHED_ATTEMPTS; attempt++)); do
    metadata_json=""
    dist_tag_json=""
    versions_json=""

    if ! metadata_json=$(npm view "$tag_spec" version license --json --prefer-online --cache "$NPM_CACHE" --workspaces=false 2>&1); then
      last_metadata_output="npm view metadata check failed for $tag_spec: ${metadata_json}"
    elif ! dist_tag_json=$(npm view "$PACKAGE_NAME" "dist-tags.$EXPECTED_DIST_TAG" --json --prefer-online --cache "$NPM_CACHE" --workspaces=false 2>&1); then
      last_metadata_output="npm view dist-tag check failed for $PACKAGE_NAME@$EXPECTED_DIST_TAG: ${dist_tag_json}"
    elif ! versions_json=$(npm view "$PACKAGE_NAME" versions --json --prefer-online --cache "$NPM_CACHE" --workspaces=false 2>&1); then
      last_metadata_output="npm view versions check failed for $PACKAGE_NAME: ${versions_json}"
    elif metadata_output=$(assert_metadata "$metadata_json" "$dist_tag_json" "$versions_json" 2>&1); then
      printf '%s\n' "$metadata_output"
      metadata_ok=1
      break
    else
      last_metadata_output=$metadata_output
    fi

    if (( attempt < VERIFY_PUBLISHED_ATTEMPTS )); then
      mismatch=${last_metadata_output//$'\n'/; }
      printf 'metadata mismatch for %s expected %s (attempt %s/%s): %s; retrying in %ss\n' \
        "$PACKAGE_NAME" \
        "$EXPECTED_VERSION" \
        "$attempt" \
        "$VERIFY_PUBLISHED_ATTEMPTS" \
        "$mismatch" \
        "$VERIFY_PUBLISHED_DELAY_SECONDS" >&2
      sleep "$VERIFY_PUBLISHED_DELAY_SECONDS"
    fi
  done

  if [[ "$metadata_ok" != "1" ]]; then
    printf '%s\n' "$last_metadata_output" >&2
    fail "npm metadata for $PACKAGE_NAME did not match expected version $EXPECTED_VERSION after $VERIFY_PUBLISHED_ATTEMPTS attempt(s)."
  fi
}

assert_project() {
  local project_dir=$1
  local mode=$2
  node - "$project_dir" "$mode" <<'NODE'
const fs = require("fs");
const path = require("path");
const [projectDir, mode] = process.argv.slice(2);
const configPath = path.join(projectDir, ".agents", "project.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

if (mode === "pack-install") {
  expect(JSON.stringify(config.enabled_packs) === JSON.stringify(["code-quality"]), `enabled_packs mismatch: ${JSON.stringify(config.enabled_packs)}`);
} else if (mode === "skill-install") {
  expect(config.enabled_skills && config.enabled_skills["quality-sweep"] === "code-quality", `enabled_skills mismatch: ${JSON.stringify(config.enabled_skills)}`);
} else if (mode === "deck-install") {
  expect(JSON.stringify(config.enabled_packs) === JSON.stringify(["game"]), `enabled_packs mismatch: ${JSON.stringify(config.enabled_packs)}`);
} else if (mode === "pack-removed" || mode === "deck-removed") {
  expect(Array.isArray(config.enabled_packs) && config.enabled_packs.length === 0, `enabled_packs not cleared: ${JSON.stringify(config.enabled_packs)}`);
} else if (mode === "skill-removed") {
  expect(!config.enabled_skills || Object.keys(config.enabled_skills).length === 0, `enabled_skills not cleared: ${JSON.stringify(config.enabled_skills)}`);
} else if (mode === "pinned") {
  expect(config.enabled_skills && config.enabled_skills["quality-sweep"] === "code-quality", `enabled_skills mismatch: ${JSON.stringify(config.enabled_skills)}`);
  expect(config.pinned_versions && config.pinned_versions["quality-sweep"] === "v0.0", `pinned_versions mismatch: ${JSON.stringify(config.pinned_versions)}`);
} else if (mode === "unpinned") {
  expect(config.enabled_skills && config.enabled_skills["quality-sweep"] === "code-quality", `enabled_skills mismatch: ${JSON.stringify(config.enabled_skills)}`);
  expect(!config.pinned_versions || Object.keys(config.pinned_versions).length === 0, `pinned_versions not cleared: ${JSON.stringify(config.pinned_versions)}`);
} else {
  failures.push(`unknown assert_project mode: ${mode}`);
}

if (failures.length) {
  console.error(`Project assertion failed for ${projectDir} (${mode})`);
  console.error(JSON.stringify(config, null, 2));
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`ok project ${mode}: ${projectDir}`);
NODE
}

assert_skill_counts() {
  local project_dir=$1
  local expected_claude=$2
  local expected_codex=$3
  node - "$project_dir" "$expected_claude" "$expected_codex" <<'NODE'
const fs = require("fs");
const path = require("path");
const [projectDir, expectedClaudeRaw, expectedCodexRaw] = process.argv.slice(2);
const expectedClaude = Number(expectedClaudeRaw);
const expectedCodex = Number(expectedCodexRaw);

function countSkills(root) {
  const skillsDir = path.join(projectDir, root, "skills");
  if (!fs.existsSync(skillsDir)) return 0;
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(skillsDir, entry.name, "SKILL.md")))
    .length;
}

const actualClaude = countSkills(".claude");
const actualCodex = countSkills(".codex");
if (actualClaude !== expectedClaude || actualCodex !== expectedCodex) {
  console.error(`Skill count mismatch for ${projectDir}: claude ${actualClaude}/${expectedClaude}, codex ${actualCodex}/${expectedCodex}`);
  process.exit(1);
}
console.log(`ok skill counts: claude=${actualClaude}, codex=${actualCodex}`);
NODE
}

assert_skill_version() {
  local project_dir=$1
  local skill_name=$2
  local expected_version=$3
  node - "$project_dir" "$skill_name" "$expected_version" <<'NODE'
const fs = require("fs");
const path = require("path");
const [projectDir, skillName, expectedVersion] = process.argv.slice(2);
const skillPath = path.join(projectDir, ".codex", "skills", skillName, "SKILL.md");
const source = fs.readFileSync(skillPath, "utf8");
const match = source.match(/^version:\s*(\S+)/m);
if (!match || match[1] !== expectedVersion) {
  console.error(`Expected ${skillName} version ${expectedVersion}, got ${match ? match[1] : "missing"}`);
  process.exit(1);
}
console.log(`ok ${skillName} version ${expectedVersion}`);
NODE
}

read_skill_version() {
  local project_dir=$1
  local skill_name=$2
  node - "$project_dir" "$skill_name" <<'NODE'
const fs = require("fs");
const path = require("path");
const [projectDir, skillName] = process.argv.slice(2);
const skillPath = path.join(projectDir, ".codex", "skills", skillName, "SKILL.md");
const source = fs.readFileSync(skillPath, "utf8");
const match = source.match(/^version:\s*(\S+)/m);
if (!match) process.exit(1);
console.log(match[1]);
NODE
}

assert_doctor_ok() {
  local project_dir=$1
  local expected=$2
  local output
  output=$(capture_cli_in "$project_dir" doctor)
  printf '%s\n' "$output"
  if [[ "$expected" == "none" ]]; then
    [[ "$output" == *"(no managed skill installs found)"* ]] || fail "doctor did not report no managed installs for $project_dir"
  elif [[ "$expected" == "pinned" ]]; then
    [[ "$output" == *"pinned"* && "$output" == *"frozen v0.0"* ]] || fail "doctor did not report pinned v0.0 for $project_dir"
  else
    [[ "$output" == *"ok"* ]] || fail "doctor did not report ok installs for $project_dir"
  fi
}

assert_command_fails() {
  local project_dir=$1
  local expected_fragment=$2
  shift 2
  local output
  if output=$(capture_cli_in "$project_dir" "$@" 2>&1); then
    printf '%s\n' "$output"
    fail "expected command to fail: skillpacks $*"
  fi
  printf '%s\n' "$output"
  [[ "$output" == *"$expected_fragment"* ]] || fail "expected failure output to include '$expected_fragment'"
}

log "Checking npm metadata for $PACKAGE_NAME"
verify_metadata_with_retries

log "Creating isolated temp projects"
pack_dir=$(make_tmp pack-install)
skill_dir=$(make_tmp skill-install)
deck_dir=$(make_tmp deck-install)
remove_pack_dir=$(make_tmp remove-pack)
remove_skill_dir=$(make_tmp remove-skill)
remove_deck_dir=$(make_tmp remove-deck)
pin_dir=$(make_tmp pin-update)
syntax_dir=$(make_tmp version-syntax)

log "Temp projects"
printf 'pack install:     %s\n' "$pack_dir"
printf 'skill install:    %s\n' "$skill_dir"
printf 'deck install:     %s\n' "$deck_dir"
printf 'remove pack:      %s\n' "$remove_pack_dir"
printf 'remove skill:     %s\n' "$remove_skill_dir"
printf 'remove deck:      %s\n' "$remove_deck_dir"
printf 'pin/update:       %s\n' "$pin_dir"
printf 'version syntax:   %s\n' "$syntax_dir"

log "Checking published list command"
list_output=$(capture_cli_in /tmp list)
printf '%s\n' "$list_output"
[[ "$list_output" == *"code-quality"* ]] || fail "list output missing code-quality"
[[ "$list_output" == *"game"* ]] || fail "list output missing game"

log "Checking pack install and doctor"
run_cli_in "$pack_dir" install code-quality
assert_project "$pack_dir" pack-install
assert_skill_counts "$pack_dir" 2 2
assert_doctor_ok "$pack_dir" ok

log "Checking individual skill install"
run_cli_in "$skill_dir" install quality-sweep
assert_project "$skill_dir" skill-install
assert_skill_counts "$skill_dir" 1 1

log "Checking deck install"
run_cli_in "$deck_dir" install-deck game-afps
assert_project "$deck_dir" deck-install
assert_skill_counts "$deck_dir" 11 11

log "Checking pack removal"
run_cli_in "$remove_pack_dir" install code-quality
run_cli_in "$remove_pack_dir" remove code-quality
assert_project "$remove_pack_dir" pack-removed
assert_skill_counts "$remove_pack_dir" 0 0
assert_doctor_ok "$remove_pack_dir" none

log "Checking individual skill removal"
run_cli_in "$remove_skill_dir" install quality-sweep
run_cli_in "$remove_skill_dir" remove quality-sweep
assert_project "$remove_skill_dir" skill-removed
assert_skill_counts "$remove_skill_dir" 0 0
assert_doctor_ok "$remove_skill_dir" none

log "Checking deck-backed pack removal"
run_cli_in "$remove_deck_dir" install-deck game-afps
run_cli_in "$remove_deck_dir" remove game
assert_project "$remove_deck_dir" deck-removed
assert_skill_counts "$remove_deck_dir" 0 0
assert_doctor_ok "$remove_deck_dir" none

log "Checking older skill pin and update back to latest"
run_cli_in "$pin_dir" install quality-sweep
latest_skill_version=$(read_skill_version "$pin_dir" quality-sweep)
run_cli_in "$pin_dir" pin quality-sweep v0.0
assert_project "$pin_dir" pinned
assert_skill_version "$pin_dir" quality-sweep v0.0
assert_doctor_ok "$pin_dir" pinned
run_cli_in "$pin_dir" unpin quality-sweep
assert_project "$pin_dir" unpinned
assert_skill_version "$pin_dir" quality-sweep "$latest_skill_version"
assert_doctor_ok "$pin_dir" ok

log "Checking unsupported direct skill version install syntax"
assert_command_fails "$syntax_dir" "Unknown pack or skill 'quality-sweep@v0.0'" install quality-sweep@v0.0
assert_command_fails "$syntax_dir" "No .agents/project.json found" pin quality-sweep v0.0

log "Published package smoke verification passed"
if [[ "$KEEP_TMP" == "0" ]]; then
  printf 'Temp projects cleaned up because SKILLPACKS_KEEP_TMP=0.\n'
else
  printf 'Temp projects kept for inspection. Set SKILLPACKS_KEEP_TMP=0 to clean them up automatically.\n'
fi
