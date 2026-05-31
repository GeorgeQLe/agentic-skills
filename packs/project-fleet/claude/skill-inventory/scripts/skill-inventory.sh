#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATUS_ORDER=(ok stale unknown missing-source pinned not-managed)
DEFAULT_MANIFESTS=(
  "tasks/downstream-repos.md"
  "tasks/fleet-queue.md"
  "tasks/repo-seeding.md"
)

usage() {
  cat <<'USAGE'
Usage: skill-inventory.sh [--manifest <path>] [--repo <path>] [--out <path>|-] [--format markdown|json]

Report-only scanner for downstream .claude/skills and .codex/skills installs.
USAGE
}

find_root_with_skill_links() {
  local dir="$1"
  while [[ -n "$dir" && "$dir" != "/" ]]; do
    if [[ -f "$dir/scripts/skill-links.sh" ]]; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

CONTROL_ROOT="${SKILL_INVENTORY_CONTROL_ROOT:-}"
if [[ -z "$CONTROL_ROOT" ]]; then
  CONTROL_ROOT="$(find_root_with_skill_links "$PWD" || true)"
fi
if [[ -z "$CONTROL_ROOT" ]]; then
  CONTROL_ROOT="$(find_root_with_skill_links "$SCRIPT_DIR" || true)"
fi
if [[ -z "$CONTROL_ROOT" || ! -f "$CONTROL_ROOT/scripts/skill-links.sh" ]]; then
  echo "ERROR: could not find canonical scripts/skill-links.sh from cwd or script path." >&2
  exit 1
fi

# shellcheck source=/dev/null
source "$CONTROL_ROOT/scripts/skill-links.sh"

manifest_arg=""
out_arg=""
format="markdown"
declare -a repo_args=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --manifest)
      [[ $# -ge 2 ]] || { echo "ERROR: --manifest requires a path." >&2; exit 1; }
      manifest_arg="$2"
      shift 2
      ;;
    --repo)
      [[ $# -ge 2 ]] || { echo "ERROR: --repo requires a path." >&2; exit 1; }
      repo_args+=("$2")
      shift 2
      ;;
    --out)
      [[ $# -ge 2 ]] || { echo "ERROR: --out requires a path or -." >&2; exit 1; }
      out_arg="$2"
      shift 2
      ;;
    --format)
      [[ $# -ge 2 ]] || { echo "ERROR: --format requires markdown or json." >&2; exit 1; }
      format="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$format" in
  markdown|json) ;;
  *) echo "ERROR: --format must be markdown or json." >&2; exit 1 ;;
esac

trim() {
  local s="$1"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
}

expand_path() {
  local raw="$1"
  case "$raw" in
    "~") printf '%s\n' "$HOME" ;;
    "~/"*) printf '%s/%s\n' "$HOME" "${raw#~/}" ;;
    /*) printf '%s\n' "$raw" ;;
    *) printf '%s/%s\n' "$PWD" "$raw" ;;
  esac
}

resolve_path_from_base() {
  local raw="$1"
  local base="$2"
  case "$raw" in
    "~") printf '%s\n' "$HOME" ;;
    "~/"*) printf '%s/%s\n' "$HOME" "${raw#~/}" ;;
    /*) printf '%s\n' "$raw" ;;
    *) printf '%s/%s\n' "$base" "$raw" ;;
  esac
}

canonical_dir_or_path() {
  local path="$1"
  if [[ -d "$path" ]]; then
    (cd "$path" && pwd -P)
    return 0
  fi
  local parent
  parent="$(dirname "$path")"
  if [[ -d "$parent" ]]; then
    printf '%s/%s\n' "$(cd "$parent" && pwd -P)" "$(basename "$path")"
  else
    printf '%s\n' "$path"
  fi
}

default_out_path() {
  printf '%s/tasks/skill-inventory.md\n' "$CONTROL_ROOT"
}

manifest_path=""
manifest_label=""
if [[ -n "$manifest_arg" ]]; then
  manifest_path="$(canonical_dir_or_path "$(expand_path "$manifest_arg")")"
  manifest_label="$manifest_path"
  if [[ ! -f "$manifest_path" ]]; then
    echo "ERROR: manifest not found: $manifest_path" >&2
    exit 1
  fi
else
  for candidate in "${DEFAULT_MANIFESTS[@]}"; do
    if [[ -f "$CONTROL_ROOT/$candidate" ]]; then
      manifest_path="$CONTROL_ROOT/$candidate"
      manifest_label="$candidate"
      break
    fi
  done
fi

out_path="${out_arg:-$(default_out_path)}"
if [[ "$out_path" != "-" && -n "$out_arg" ]]; then
  out_path="$(canonical_dir_or_path "$(expand_path "$out_path")")"
fi

extract_manifest_paths() {
  local manifest="$1"
  awk '
    function trim_cell(s) {
      gsub(/\r/, "", s)
      gsub(/^[ \t]+|[ \t]+$/, "", s)
      return s
    }
    function clean_cell(s) {
      s = trim_cell(s)
      if (s ~ /^\[[^]]+\]\([^)]+\)$/) {
        sub(/^\[[^]]+\]\(/, "", s)
        sub(/\)$/, "", s)
      }
      gsub(/^`+|`+$/, "", s)
      gsub(/^<|>$/, "", s)
      gsub(/\*\*/, "", s)
      return trim_cell(s)
    }
    function split_cells(line, cells, raw, n, i) {
      line = trim_cell(line)
      sub(/^\|/, "", line)
      sub(/\|$/, "", line)
      n = split(line, raw, /\|/)
      for (i = 1; i <= n; i++) cells[i] = clean_cell(raw[i])
      return n
    }
    function is_separator(cells, n, i, c) {
      if (n < 1) return 0
      for (i = 1; i <= n; i++) {
        c = cells[i]
        gsub(/[ \t]/, "", c)
        if (c !~ /^:?-{2,}:?$/) return 0
      }
      return 1
    }
    function localish(v, lower) {
      v = clean_cell(v)
      lower = tolower(v)
      if (v == "" || lower == "-" || lower == "n/a" || lower == "na" || lower == "none" || lower == "tbd") return 0
      if (v ~ /^[A-Za-z][A-Za-z0-9+.-]*:\/\//) return 0
      if (v ~ /^git@/) return 0
      if (v ~ /^(\/|~\/|\.\.\/|\.\/)/) return 1
      if (v ~ /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/) return 0
      return 1
    }
    /^[ \t]*\|/ {
      n = split_cells($0, cells)
      if (is_separator(cells, n)) {
        path_idx = 0
        for (i = 1; i <= prev_n; i++) {
          h = tolower(prev[i])
          gsub(/[^a-z]/, "", h)
          if (h == "localpath") path_idx = i
          else if (h == "path" && path_idx == 0) path_idx = i
        }
        in_table = path_idx > 0
        next
      }
      if (in_table && path_idx > 0 && localish(cells[path_idx])) print clean_cell(cells[path_idx])
      delete prev
      for (i = 1; i <= n; i++) prev[i] = cells[i]
      prev_n = n
      next
    }
    {
      in_table = 0
      path_idx = 0
      prev_n = 0
      delete prev
    }
  ' "$manifest"
}

manifest_template() {
  cat <<'TEMPLATE'
No local downstream repository paths were found.

Add a Markdown table with a `Local Path` or `Path` column, then rerun the inventory:

| ID | Repository | Local Path | State |
| --- | --- | --- | --- |
| app-001 | owner/example-app | ../example-app | seeded |

Remote-only values such as `owner/repo` are not scannable until the repository has a local checkout path.
No downstream repositories were modified.
TEMPLATE
}

declare -a REPO_PATHS=()
declare -a REPO_LABELS=()
declare -A SEEN_REPOS=()

add_repo_path() {
  local raw="$1"
  local base="$2"
  local resolved
  resolved="$(canonical_dir_or_path "$(resolve_path_from_base "$raw" "$base")")"
  if [[ -z "${SEEN_REPOS[$resolved]:-}" ]]; then
    SEEN_REPOS["$resolved"]=1
    REPO_PATHS+=("$resolved")
    REPO_LABELS+=("$(basename "$resolved")")
  fi
}

for repo in "${repo_args[@]}"; do
  add_repo_path "$repo" "$PWD"
done

if [[ -n "$manifest_path" ]]; then
  manifest_base="$(dirname "$manifest_path")"
  while IFS= read -r local_path; do
    [[ -n "$local_path" ]] || continue
    add_repo_path "$local_path" "$manifest_base"
  done < <(extract_manifest_paths "$manifest_path")
fi

if [[ ${#REPO_PATHS[@]} -eq 0 ]]; then
  manifest_template >&2
  exit 2
fi

generated_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
manifest_display="${manifest_label:-explicit --repo only}"

declare -a INSTALL_ROWS=()
declare -a REPO_ROWS=()
declare -A STATUS_TOTALS=()
for status in "${STATUS_ORDER[@]}"; do
  STATUS_TOTALS["$status"]=0
done
TOTAL_REPOS=0
TOTAL_INSTALLS=0
TOTAL_AGENT_ROOTS=0

status_hint() {
  case "$1" in
    ok) printf 'No action.' ;;
    stale) printf 'Review, then run `scripts/pack.sh refresh` in the downstream repo if current canonical skills should be copied.' ;;
    unknown) printf 'Run `scripts/pack.sh refresh` later to rewrite managed markers with source_sha tracking.' ;;
    missing-source) printf 'Reinstall or refresh the owning pack from canonical agentic-skills; the recorded source path is missing.' ;;
    pinned) printf 'Pinned symlink; leave as-is unless intentionally unpinning to track latest.' ;;
    not-managed) printf 'Not managed by agentic-skills; do not delete during inventory.' ;;
    *) printf '' ;;
  esac
}

target_source() {
  local target="$1"
  if [[ -L "$target" ]]; then
    readlink "$target"
    return 0
  fi
  managed_skill_source "$target" 2>/dev/null || true
}

scan_repo() {
  local label="$1"
  local repo_path="$2"
  local exists="yes"
  local claude_count=0
  local codex_count=0
  local -A repo_status=()
  local status
  for status in "${STATUS_ORDER[@]}"; do
    repo_status["$status"]=0
  done

  TOTAL_REPOS=$((TOTAL_REPOS + 1))

  if [[ ! -d "$repo_path" ]]; then
    exists="missing"
    REPO_ROWS+=("${label}"$'\t'"${repo_path}"$'\t'"${exists}"$'\t'"0"$'\t'"0"$'\t'"0"$'\t'"0"$'\t'"0"$'\t'"0"$'\t'"0"$'\t'"0")
    return 0
  fi

  local agent root target skill recorded current source hint count
  for agent in claude codex; do
    root="$repo_path/.$agent/skills"
    count=0
    if [[ -d "$root" ]]; then
      TOTAL_AGENT_ROOTS=$((TOTAL_AGENT_ROOTS + 1))
      while IFS= read -r target; do
        [[ -e "$target" || -L "$target" ]] || continue
        skill="$(basename "$target")"
        IFS=$'\t' read -r status recorded current < <(skill_install_status "$target")
        source="$(target_source "$target")"
        hint="$(status_hint "$status")"
        INSTALL_ROWS+=("${label}"$'\t'"${repo_path}"$'\t'"${agent}"$'\t'"${skill}"$'\t'"${status}"$'\t'"${recorded}"$'\t'"${current}"$'\t'"${source}"$'\t'"${hint}")
        count=$((count + 1))
        TOTAL_INSTALLS=$((TOTAL_INSTALLS + 1))
        repo_status["$status"]=$((repo_status["$status"] + 1))
        STATUS_TOTALS["$status"]=$((STATUS_TOTALS["$status"] + 1))
      done < <(find "$root" -mindepth 1 -maxdepth 1 \( -type d -o -type l \) -print | LC_ALL=C sort)
    fi
    if [[ "$agent" == "claude" ]]; then
      claude_count="$count"
    else
      codex_count="$count"
    fi
  done

  REPO_ROWS+=("${label}"$'\t'"${repo_path}"$'\t'"${exists}"$'\t'"${claude_count}"$'\t'"${codex_count}"$'\t'"${repo_status[ok]}"$'\t'"${repo_status[stale]}"$'\t'"${repo_status[unknown]}"$'\t'"${repo_status[missing-source]}"$'\t'"${repo_status[pinned]}"$'\t'"${repo_status[not-managed]}")
}

for i in "${!REPO_PATHS[@]}"; do
  scan_repo "${REPO_LABELS[$i]}" "${REPO_PATHS[$i]}"
done

md_cell() {
  local value="$1"
  value="${value//$'\n'/ }"
  value="${value//|/\\|}"
  [[ -n "$value" ]] || value="-"
  printf '%s' "$value"
}

json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

render_markdown() {
  cat <<EOF
# Skill Inventory Report

Generated: ${generated_at}

Control repo: \`${CONTROL_ROOT}\`
Manifest: \`${manifest_display}\`

Report-only notice: this scan did not run refresh, delete, cleanup, install, or other mutation commands. No downstream repositories were modified.

## Summary

| Metric | Count |
| --- | ---: |
| Repositories scanned | ${TOTAL_REPOS} |
| Agent skill roots found | ${TOTAL_AGENT_ROOTS} |
| Skill installs inspected | ${TOTAL_INSTALLS} |
| ok | ${STATUS_TOTALS[ok]} |
| stale | ${STATUS_TOTALS[stale]} |
| unknown | ${STATUS_TOTALS[unknown]} |
| missing-source | ${STATUS_TOTALS[missing-source]} |
| pinned | ${STATUS_TOTALS[pinned]} |
| not-managed | ${STATUS_TOTALS[not-managed]} |

## Repositories

| Repo | Path | Exists | Claude installs | Codex installs | ok | stale | unknown | missing-source | pinned | not-managed |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
EOF

  local row label path exists claude_count codex_count ok stale unknown missing pinned unmanaged
  for row in "${REPO_ROWS[@]}"; do
    IFS=$'\t' read -r label path exists claude_count codex_count ok stale unknown missing pinned unmanaged <<<"$row"
    printf '| %s | `%s` | %s | %s | %s | %s | %s | %s | %s | %s | %s |\n' \
      "$(md_cell "$label")" "$(md_cell "$path")" "$(md_cell "$exists")" "$claude_count" "$codex_count" "$ok" "$stale" "$unknown" "$missing" "$pinned" "$unmanaged"
  done

  cat <<'EOF'

## Skill Installs

| Repo | Agent | Skill | Status | Installed Version | Canonical Version | Source | Hint |
| --- | --- | --- | --- | --- | --- | --- | --- |
EOF

  if [[ ${#INSTALL_ROWS[@]} -eq 0 ]]; then
    echo "| - | - | - | - | - | - | - | No skill installs found under .claude/skills or .codex/skills. |"
  else
    local repo_path agent skill status recorded current source hint
    for row in "${INSTALL_ROWS[@]}"; do
      IFS=$'\t' read -r label repo_path agent skill status recorded current source hint <<<"$row"
      printf '| %s | %s | `%s` | %s | %s | %s | `%s` | %s |\n' \
        "$(md_cell "$label")" "$(md_cell "$agent")" "$(md_cell "$skill")" "$(md_cell "$status")" \
        "$(md_cell "$recorded")" "$(md_cell "$current")" "$(md_cell "$source")" "$(md_cell "$hint")"
    done
  fi

  cat <<'EOF'

## Action Hints

- `ok`: no action.
- `stale`: review the row, then run `scripts/pack.sh refresh` in the downstream repo if it should track the current canonical skill.
- `unknown`: run `scripts/pack.sh refresh` later to rewrite managed markers with `source_sha` tracking.
- `missing-source`: reinstall or refresh the owning pack from canonical `agentic-skills`; the recorded source path is missing.
- `pinned`: symlinked install, usually to `archive/<version>`; leave it pinned unless intentionally moving back to latest.
- `not-managed`: not an agentic-skills managed copy; do not delete during inventory.

V1 has no cleanup, apply, refresh, or delete route. Treat this report as evidence for the next explicit fleet decision.
EOF
}

render_json() {
  printf '{\n'
  printf '  "generated_at": "%s",\n' "$(json_escape "$generated_at")"
  printf '  "control_repo": "%s",\n' "$(json_escape "$CONTROL_ROOT")"
  printf '  "manifest": "%s",\n' "$(json_escape "$manifest_display")"
  printf '  "report_only": true,\n'
  printf '  "summary": {\n'
  printf '    "repositories": %s,\n' "$TOTAL_REPOS"
  printf '    "agent_roots": %s,\n' "$TOTAL_AGENT_ROOTS"
  printf '    "installs": %s,\n' "$TOTAL_INSTALLS"
  local idx status comma
  idx=0
  for status in "${STATUS_ORDER[@]}"; do
    idx=$((idx + 1))
    comma=","
    [[ $idx -eq ${#STATUS_ORDER[@]} ]] && comma=""
    printf '    "%s": %s%s\n' "$status" "${STATUS_TOTALS[$status]}" "$comma"
  done
  printf '  },\n'
  printf '  "repositories": [\n'
  local row label path exists claude_count codex_count ok stale unknown missing pinned unmanaged
  for idx in "${!REPO_ROWS[@]}"; do
    row="${REPO_ROWS[$idx]}"
    IFS=$'\t' read -r label path exists claude_count codex_count ok stale unknown missing pinned unmanaged <<<"$row"
    comma=","
    [[ $idx -eq $((${#REPO_ROWS[@]} - 1)) ]] && comma=""
    printf '    {"repo": "%s", "path": "%s", "exists": "%s", "claude_installs": %s, "codex_installs": %s, "ok": %s, "stale": %s, "unknown": %s, "missing_source": %s, "pinned": %s, "not_managed": %s}%s\n' \
      "$(json_escape "$label")" "$(json_escape "$path")" "$(json_escape "$exists")" "$claude_count" "$codex_count" "$ok" "$stale" "$unknown" "$missing" "$pinned" "$unmanaged" "$comma"
  done
  printf '  ],\n'
  printf '  "installs": [\n'
  local repo_path agent skill recorded current source hint
  for idx in "${!INSTALL_ROWS[@]}"; do
    row="${INSTALL_ROWS[$idx]}"
    IFS=$'\t' read -r label repo_path agent skill status recorded current source hint <<<"$row"
    comma=","
    [[ $idx -eq $((${#INSTALL_ROWS[@]} - 1)) ]] && comma=""
    printf '    {"repo": "%s", "repo_path": "%s", "agent": "%s", "skill": "%s", "status": "%s", "installed_version": "%s", "canonical_version": "%s", "source": "%s", "hint": "%s"}%s\n' \
      "$(json_escape "$label")" "$(json_escape "$repo_path")" "$(json_escape "$agent")" "$(json_escape "$skill")" "$(json_escape "$status")" "$(json_escape "$recorded")" "$(json_escape "$current")" "$(json_escape "$source")" "$(json_escape "$hint")" "$comma"
  done
  printf '  ]\n'
  printf '}\n'
}

if [[ "$out_path" != "-" ]]; then
  mkdir -p "$(dirname "$out_path")"
fi

case "$format" in
  markdown)
    if [[ "$out_path" == "-" ]]; then
      render_markdown
    else
      render_markdown > "$out_path"
      echo "Wrote $out_path"
    fi
    ;;
  json)
    if [[ "$out_path" == "-" ]]; then
      render_json
    else
      render_json > "$out_path"
      echo "Wrote $out_path"
    fi
    ;;
esac
