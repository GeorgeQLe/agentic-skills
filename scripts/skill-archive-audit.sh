#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

MODE="table"
STRICT=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json) MODE="json"; shift ;;
    --strict) STRICT=true; shift ;;
    --help|-h)
      echo "Usage: skill-archive-audit.sh [--json] [--strict]"
      echo ""
      echo "Audits skill archive integrity across base/ and packs/."
      echo ""
      echo "Checks:"
      echo "  1. Every archive/<version>/SKILL.md has a version: matching its directory"
      echo "  2. Skills at v0.1+ have archive entries for prior versions"
      echo "  3. If archive/ has entries, CHANGELOG.md must exist"
      echo "  4. Each archived version has a heading in CHANGELOG.md"
      echo ""
      echo "Modes:"
      echo "  (default)  Table output"
      echo "  --json     JSON output"
      echo "  --strict   Exit 1 on any violation"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

violations=()
checked=0

extract_version() {
  local file="$1"
  local in_fm=false
  while IFS= read -r line; do
    if [[ "$line" == "---" ]]; then
      if $in_fm; then break; fi
      in_fm=true
      continue
    fi
    if $in_fm && [[ "$line" =~ ^version:[[:space:]]*(.+)$ ]]; then
      local v="${BASH_REMATCH[1]}"
      v="${v%\"}"
      v="${v#\"}"
      echo "$v" | xargs
      return
    fi
  done < "$file"
}

version_decimal() {
  local v="$1"
  echo "$v" | sed 's/^v//' | cut -d. -f2
}

check_skill() {
  local skill_dir="$1"
  local rel_path="${skill_dir#$REPO_ROOT/}"
  local skill_file="$skill_dir/SKILL.md"
  local archive_dir="$skill_dir/archive"
  local changelog="$skill_dir/CHANGELOG.md"

  [[ -f "$skill_file" ]] || return 0
  checked=$((checked + 1))

  local current_version
  current_version="$(extract_version "$skill_file")"
  [[ -n "$current_version" ]] || return 0

  local decimal
  decimal="$(version_decimal "$current_version")"

  if [[ "$decimal" -ge 1 ]] 2>/dev/null; then
    local i=0
    while [[ "$i" -lt "$decimal" ]]; do
      local expected="v0.$i"
      if [[ ! -f "$archive_dir/$expected/SKILL.md" ]]; then
        violations+=("$rel_path: missing archive/$expected/SKILL.md (current is $current_version)")
      fi
      i=$((i + 1))
    done
  fi

  if [[ -d "$archive_dir" ]]; then
    local has_entries=false
    for ver_dir in "$archive_dir"/*/; do
      [[ -d "$ver_dir" ]] || continue
      has_entries=true
      ver_dir="${ver_dir%/}"
      local dir_version
      dir_version="$(basename "$ver_dir")"
      local archived_skill="$ver_dir/SKILL.md"

      if [[ -f "$archived_skill" ]]; then
        local archived_version
        archived_version="$(extract_version "$archived_skill")"
        if [[ -n "$archived_version" && "$archived_version" != "$dir_version" ]]; then
          violations+=("$rel_path: archive/$dir_version/SKILL.md has version: $archived_version (expected $dir_version)")
        fi
      fi

      if [[ -f "$changelog" ]]; then
        if ! grep -q "^## $dir_version" "$changelog" 2>/dev/null; then
          violations+=("$rel_path: CHANGELOG.md missing heading for $dir_version")
        fi
      fi
    done

    if $has_entries && [[ ! -f "$changelog" ]]; then
      violations+=("$rel_path: archive/ has entries but no CHANGELOG.md")
    fi
  fi
}

while IFS= read -r skill_dir; do
  check_skill "$skill_dir"
done < <(find "$REPO_ROOT/base" "$REPO_ROOT/packs" -name SKILL.md -not -path '*/archive/*' -exec dirname {} \; 2>/dev/null | sort -u)

if [[ "$MODE" == "json" ]]; then
  echo "{"
  echo "  \"checked\": $checked,"
  echo "  \"violations\": $((${#violations[@]})),"
  echo "  \"details\": ["
  for i in "${!violations[@]}"; do
    local_comma=""
    if [[ "$i" -lt $((${#violations[@]} - 1)) ]]; then
      local_comma=","
    fi
    printf '    "%s"%s\n' "${violations[$i]}" "$local_comma"
  done
  echo "  ]"
  echo "}"
else
  echo "Skill Archive Audit"
  echo "==================="
  echo "Checked: $checked skills"
  echo "Violations: ${#violations[@]}"
  if [[ "${#violations[@]}" -gt 0 ]]; then
    echo ""
    for v in "${violations[@]}"; do
      echo "  - $v"
    done
  else
    echo ""
    echo "All checks passed."
  fi
fi

if $STRICT && [[ "${#violations[@]}" -gt 0 ]]; then
  exit 1
fi

exit 0
