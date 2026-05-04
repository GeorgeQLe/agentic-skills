#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: monorepo-validate.sh [--skip-fixtures] [--fixtures-dir DIR]

Validate the monorepo pack contracts, mirrored skill structure, Codex
manifests, and fixture-backed scripts.

Options:
  --skip-fixtures     Run contract, parity, and manifest checks only.
  --fixtures-dir DIR  Fixture root. Defaults to tests/fixtures/monorepo.
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$PACK_DIR/../.." && pwd)"

FIXTURES_DIR="$REPO_ROOT/tests/fixtures/monorepo"
SKIP_FIXTURES=false
FAILURES=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --skip-fixtures)
      SKIP_FIXTURES=true
      shift
      ;;
    --fixtures-dir)
      if [[ $# -lt 2 ]]; then
        echo "ERROR: --fixtures-dir requires a value" >&2
        exit 2
      fi
      FIXTURES_DIR="$2"
      shift 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

pass() {
  echo "PASS: $*"
}

skip() {
  echo "SKIP: $*"
}

fail() {
  echo "FAIL: $*" >&2
  FAILURES=$((FAILURES + 1))
}

require_file() {
  local file="$1"
  local label="$2"
  if [[ -f "$file" ]]; then
    pass "$label exists"
    return 0
  fi
  fail "$label missing: $file"
  return 1
}

contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  if grep -Eiq "$pattern" "$file"; then
    pass "$label"
  else
    fail "$label missing in ${file#$REPO_ROOT/}"
  fi
}

read_frontmatter_value() {
  local file="$1"
  local key="$2"
  awk -v key="$key" '
    NR == 1 && $0 == "---" { in_fm = 1; next }
    in_fm && $0 == "---" { exit }
    in_fm && $0 ~ "^" key ":" {
      sub("^[^:]+:[[:space:]]*", "")
      print
      exit
    }
  ' "$file"
}

heading_fingerprint() {
  grep -E '^## ' "$1" | sed 's#\$#/#g'
}

check_contracts() {
  local skill
  local skills=()

  while IFS= read -r skill; do
    skills+=("$skill")
  done < <(find "$PACK_DIR/claude" "$PACK_DIR/codex" -path '*/SKILL.md' -type f | sort)

  if [[ "${#skills[@]}" -eq 0 ]]; then
    fail "no monorepo pack skill contracts found"
    return
  fi

  for skill in "${skills[@]}"; do
    contains "$skill" '^## Augmentation Injection Pattern$' "augmentation injection section in ${skill#$REPO_ROOT/}"
    contains "$skill" 'augmentation injection pattern' "augmentation injection language in ${skill#$REPO_ROOT/}"
    contains "$skill" '^## Next-Step Routing$|Default next-step routing|Recommended next command' "next-step routing in ${skill#$REPO_ROOT/}"
  done
}

check_parity() {
  local claude_skill codex_skill skill_name key claude_value codex_value claude_headings codex_headings

  for claude_skill in "$PACK_DIR"/claude/*/SKILL.md; do
    skill_name="$(basename "$(dirname "$claude_skill")")"
    codex_skill="$PACK_DIR/codex/$skill_name/SKILL.md"
    if ! require_file "$codex_skill" "Codex mirror for $skill_name"; then
      continue
    fi

    for key in name type version; do
      claude_value="$(read_frontmatter_value "$claude_skill" "$key")"
      codex_value="$(read_frontmatter_value "$codex_skill" "$key")"
      if [[ "$claude_value" == "$codex_value" && -n "$claude_value" ]]; then
        pass "$skill_name frontmatter $key matches"
      else
        fail "$skill_name frontmatter $key mismatch: Claude='$claude_value' Codex='$codex_value'"
      fi
    done

    claude_headings="$(heading_fingerprint "$claude_skill")"
    codex_headings="$(heading_fingerprint "$codex_skill")"
    if [[ "$claude_headings" == "$codex_headings" ]]; then
      pass "$skill_name section headings match"
    else
      fail "$skill_name section headings differ between Claude and Codex"
    fi
  done
}

check_manifests() {
  local codex_skill skill_name manifest

  for codex_skill in "$PACK_DIR"/codex/*/SKILL.md; do
    skill_name="$(basename "$(dirname "$codex_skill")")"
    manifest="$PACK_DIR/codex/$skill_name/agents/openai.yaml"
    if ! require_file "$manifest" "OpenAI manifest for $skill_name"; then
      continue
    fi
    contains "$manifest" '^interface:' "interface block in $skill_name manifest"
    contains "$manifest" 'display_name:' "display_name in $skill_name manifest"
    contains "$manifest" 'short_description:' "short_description in $skill_name manifest"
    contains "$manifest" 'default_prompt:' "default_prompt in $skill_name manifest"
    contains "$manifest" 'allow_implicit_invocation:' "allow_implicit_invocation in $skill_name manifest"
  done
}

check_lane_fixtures() {
  local valid="$FIXTURES_DIR/lane-specs-valid.json"
  local invalid="$FIXTURES_DIR/lane-specs-invalid.json"

  require_file "$valid" "valid lane-spec fixture" || return
  require_file "$invalid" "invalid lane-spec fixture" || return

  if "$SCRIPT_DIR/lane-spec-validate.sh" "$valid" >/dev/null; then
    pass "valid lane-spec fixture passes"
  else
    fail "valid lane-spec fixture failed validation"
  fi

  if "$SCRIPT_DIR/lane-spec-validate.sh" "$invalid" >/dev/null 2>&1; then
    fail "invalid lane-spec fixture unexpectedly passed"
  else
    pass "invalid lane-spec fixture fails as expected"
  fi
}

json_field_equals() {
  local file="$1"
  local expression="$2"
  local expected="$3"
  local label="$4"

  if node -e '
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const expression = process.argv[2];
    const expected = process.argv[3];
    const value = Function("data", `return ${expression}`)(data);
    const normalized = value === null ? "null" : String(value);
    process.exit(normalized === expected ? 0 : 1);
  ' "$file" "$expression" "$expected"; then
    pass "$label"
  else
    fail "$label"
  fi
}

check_detection_fixture() {
  local fixture_name="$1"
  local expected_orchestrator="$2"
  local expected_count="$3"
  local source="$FIXTURES_DIR/$fixture_name"
  local work_dir="$TMP_DIR/$fixture_name"
  local output="$work_dir/.agents/monorepo.json"

  require_file "$source/pnpm-workspace.yaml" "$fixture_name workspace file" || return
  cp -R "$source" "$work_dir"

  if "$SCRIPT_DIR/mono-detect.sh" "$work_dir" >/dev/null; then
    pass "$fixture_name detection runs"
  else
    fail "$fixture_name detection failed"
    return
  fi

  require_file "$output" "$fixture_name monorepo artifact" || return
  json_field_equals "$output" 'data.workspace_manager' "pnpm" "$fixture_name workspace manager is pnpm"
  json_field_equals "$output" 'data.build_orchestrator' "$expected_orchestrator" "$fixture_name build orchestrator is $expected_orchestrator"
  json_field_equals "$output" 'data.packages.length' "$expected_count" "$fixture_name package count is $expected_count"
}

check_detection_fixtures() {
  local not_monorepo="$FIXTURES_DIR/not-monorepo"

  check_detection_fixture "pnpm-turbo" "turborepo" "3"
  check_detection_fixture "pnpm-only" "null" "1"

  require_file "$not_monorepo/package.json" "not-monorepo fixture package" || return
  if "$SCRIPT_DIR/mono-detect.sh" "$not_monorepo" >/dev/null 2>&1; then
    fail "not-monorepo fixture unexpectedly detected"
  else
    pass "not-monorepo fixture fails detection as expected"
  fi
}

check_fixtures() {
  if "$SKIP_FIXTURES"; then
    skip "fixture checks skipped by --skip-fixtures"
    return
  fi

  if [[ ! -d "$FIXTURES_DIR" ]]; then
    fail "fixtures directory missing: $FIXTURES_DIR"
    return
  fi

  TMP_DIR="$(mktemp -d)"
  trap 'rm -rf "$TMP_DIR"' EXIT

  check_lane_fixtures
  check_detection_fixtures
}

check_contracts
check_parity
check_manifests
check_fixtures

if [[ "$FAILURES" -gt 0 ]]; then
  echo "monorepo pack validation failed with $FAILURES failure(s)" >&2
  exit 1
fi

echo "monorepo pack validation passed"
