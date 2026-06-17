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
      echo "  2. Skills have archive entries for prior versions named in CHANGELOG.md"
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

version_major() {
  local v="$1"
  echo "$v" | sed 's/^v//' | cut -d. -f1
}

version_minor() {
  local v="$1"
  echo "$v" | sed 's/^v//' | cut -d. -f2
}

version_lt() {
  local a="$1"
  local b="$2"
  local a_major a_minor b_major b_minor
  a_major="$(version_major "$a")"
  a_minor="$(version_minor "$a")"
  b_major="$(version_major "$b")"
  b_minor="$(version_minor "$b")"

  if [[ "$a_major" -lt "$b_major" ]] 2>/dev/null; then
    return 0
  fi
  if [[ "$a_major" -eq "$b_major" && "$a_minor" -lt "$b_minor" ]] 2>/dev/null; then
    return 0
  fi
  return 1
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

  if [[ -f "$changelog" ]]; then
    while IFS= read -r heading_version; do
      [[ -n "$heading_version" ]] || continue
      [[ "$heading_version" == "$current_version" ]] && continue
      if version_lt "$heading_version" "$current_version" && [[ ! -f "$archive_dir/$heading_version/SKILL.md" ]]; then
        violations+=("$rel_path: missing archive/$heading_version/SKILL.md (current is $current_version)")
      fi
    done < <(grep -E '^## v[0-9]+\.[0-9]+' "$changelog" 2>/dev/null | sed -E 's/^## (v[0-9]+\.[0-9]+).*/\1/')
  else
    local major minor
    major="$(version_major "$current_version")"
    minor="$(version_minor "$current_version")"

    if [[ "$minor" -ge 1 ]] 2>/dev/null; then
      local i=0
      while [[ "$i" -lt "$minor" ]]; do
        local expected="v$major.$i"
        if [[ ! -f "$archive_dir/$expected/SKILL.md" ]]; then
          violations+=("$rel_path: missing archive/$expected/SKILL.md (current is $current_version)")
        fi
        i=$((i + 1))
      done
    fi
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
