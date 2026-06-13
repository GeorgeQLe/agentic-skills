#!/usr/bin/env bash
# SessionStart drift hook for agentic-skills.
#
# Read-only by default: prints a one-line warning when tracked skill installs
# have fallen behind their canonical sources (track-latest). When auto-refresh
# is enabled (global preferences.json skills.auto_refresh, or a project's
# .agents/project.json skill_updates.mode == "auto"), it refreshes instead of
# warning. Gated entirely by the skills.session_start_hook preference, so a
# disabled preference makes this a silent no-op. Never blocks the session;
# always exits 0.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=/dev/null
source "$REPO_ROOT/scripts/skill-links.sh" 2>/dev/null || exit 0

PREFERENCES_FILE="$HOME/.agentic-skills/preferences.json"

pref_bool() {
  local path="$1"
  [[ -f "$PREFERENCES_FILE" ]] || { echo false; return; }
  if command -v jq >/dev/null 2>&1; then
    jq -r "${path} // false" "$PREFERENCES_FILE" 2>/dev/null || echo false
  else
    echo false
  fi
}

# Gate: only run when explicitly enabled via the init/clone prompt.
[[ "$(pref_bool '.skills.session_start_hook')" == "true" ]] || exit 0

auto_global="$(pref_bool '.skills.auto_refresh')"

# Resolve the project directory from the hook stdin JSON cwd, then env, then PWD.
stdin_json="$(cat 2>/dev/null || true)"
proj_dir=""
if [[ -n "$stdin_json" ]] && command -v jq >/dev/null 2>&1; then
  proj_dir="$(printf '%s' "$stdin_json" | jq -r '.cwd // empty' 2>/dev/null || true)"
fi
[[ -n "$proj_dir" ]] || proj_dir="${CLAUDE_PROJECT_DIR:-$PWD}"

project_auto=false
if [[ -f "$proj_dir/.agents/project.json" ]] && command -v jq >/dev/null 2>&1; then
  mode="$(jq -r '.skill_updates.mode // empty' "$proj_dir/.agents/project.json" 2>/dev/null || true)"
  [[ "$mode" == "auto" ]] && project_auto=true
fi

stale_project=()

scan_root() {
  local root="$1"
  [[ -d "$root" ]] || return 0
  local target line status
  while IFS= read -r target; do
    [[ -n "$target" ]] || continue
    line="$(skill_install_status "$target")"
    status="${line%%$'\t'*}"
    [[ "$status" == "stale" ]] || continue
    stale_project+=("${target#"$proj_dir"/}")
  done < <(find "$root" -mindepth 1 -maxdepth 1 \( -type l -o -type d \) -print 2>/dev/null | sort)
}

scan_root "$proj_dir/.claude/skills"
scan_root "$proj_dir/.codex/skills"

total_stale=${#stale_project[@]}
[[ "$total_stale" -eq 0 ]] && exit 0

if [[ "$auto_global" == "true" || "$project_auto" == "true" ]]; then
  if [[ ${#stale_project[@]} -gt 0 && -f "$proj_dir/.agents/project.json" ]]; then
    ( cd "$proj_dir" && bash "$REPO_ROOT/scripts/pack.sh" refresh ) >/dev/null 2>&1 || true
  fi
  echo "agentic-skills: auto-refreshed $total_stale stale skill install(s) to canonical latest."
  exit 0
fi

# Warn-only (default).
echo "agentic-skills: $total_stale skill install(s) behind canonical (track-latest)."
[[ ${#stale_project[@]} -gt 0 ]] && echo "  project: ${stale_project[*]}  (fix: scripts/pack.sh refresh)"
exit 0
