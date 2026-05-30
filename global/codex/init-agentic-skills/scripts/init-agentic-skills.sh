#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
DELEGATE_SCRIPT="init.sh"

resolve_repo_root() {
  local source_tree_root
  if source_tree_root="$(cd "$SKILL_DIR/../../.." 2>/dev/null && pwd -P)"; then
    if [ -f "$source_tree_root/$DELEGATE_SCRIPT" ]; then
      printf '%s\n' "$source_tree_root"
      return 0
    fi
  else
    source_tree_root="<unresolved>"
  fi

  local managed_file="$SKILL_DIR/.agentic-skills-managed"
  local managed_source=""
  if [ -f "$managed_file" ]; then
    while IFS= read -r line; do
      case "$line" in
        source=*)
          managed_source="${line#source=}"
          break
          ;;
      esac
    done < "$managed_file"
  fi

  local provenance_root="<unresolved>"
  if [ -n "$managed_source" ] && [ -d "$managed_source" ]; then
    if provenance_root="$(cd "$managed_source/../../.." 2>/dev/null && pwd -P)"; then
      if [ -f "$provenance_root/$DELEGATE_SCRIPT" ]; then
        printf '%s\n' "$provenance_root"
        return 0
      fi
    else
      provenance_root="<unresolved>"
    fi
  fi

  {
    echo "ERROR: Unable to resolve agentic-skills repository root for init-agentic-skills launcher."
    echo "Tried source-tree candidate: $source_tree_root"
    echo "Tried managed-install provenance: $managed_file source=${managed_source:-<missing>} -> $provenance_root"
    echo "Expected delegated script: $DELEGATE_SCRIPT"
  } >&2
  return 1
}

REPO_ROOT="$(resolve_repo_root)"

PREFERENCES_FILE="$HOME/.agentic-skills/preferences.json"
SETTINGS_FILE="$HOME/.claude/settings.json"
DRIFT_HOOK_CMD="bash $REPO_ROOT/scripts/skill-drift-hook.sh"

status() {
  echo "agentic-skills checkout: $REPO_ROOT"
  git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null | sed 's/^/local commit: /' || true
  git -C "$REPO_ROOT" remote get-url origin 2>/dev/null | sed 's/^/remote URL: /' || echo "remote URL: unavailable"

  if [ -f "$PREFERENCES_FILE" ]; then
    python3 -c 'import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
try:
    value = json.loads(path.read_text()).get("sync", {}).get("github_freshness_check")
except Exception:
    value = None
print("github freshness preference: " + (value if value in {"ask", "always", "never"} else "unset"))' "$PREFERENCES_FILE"
  else
    echo "github freshness preference: unset"
  fi
}

doctor() {
  # shellcheck source=/dev/null
  source "$REPO_ROOT/scripts/skill-links.sh" || { echo "ERROR: unable to load skill-links.sh" >&2; return 1; }
  echo "Global skill install drift (~/.claude/skills, ~/.codex/skills):"
  local found=false any_stale=false target line status rec cur
  while IFS= read -r target; do
    [ -n "$target" ] || continue
    line="$(skill_install_status "$target")"
    IFS=$'\t' read -r status rec cur <<< "$line"
    [ "$status" = "not-managed" ] && continue
    found=true
    case "$status" in
      ok)             printf '  ok       %s\n' "$target" ;;
      pinned)         printf '  pinned   %s (frozen %s)\n' "$target" "${rec:-?}" ;;
      unknown)        printf '  unknown  %s — rerun init to enable drift tracking\n' "$target" ;;
      missing-source) printf '  missing  %s — canonical source no longer exists\n' "$target" ;;
      stale)          printf '  STALE    %s (%s -> %s)\n' "$target" "${rec:-?}" "${cur:-?}"; any_stale=true ;;
    esac
  done < <(find "$HOME/.claude/skills" "$HOME/.codex/skills" -mindepth 1 -maxdepth 1 \( -type l -o -type d \) -print 2>/dev/null | sort)
  $found || echo "  (no managed global skill installs found)"
  if $any_stale; then
    echo ""
    echo "Fix: /init-agentic-skills update  (re-copies global skills from this checkout)"
    return 1
  fi
  return 0
}

set_pref() {
  local key="$1" val="$2" jqval
  case "$key" in
    session_start_hook|auto_refresh) ;;
    *) echo "ERROR: unknown preference '$key' (use session_start_hook or auto_refresh)" >&2; return 1 ;;
  esac
  case "$val" in
    true) jqval=true ;;
    false) jqval=false ;;
    *) echo "ERROR: value must be true or false" >&2; return 1 ;;
  esac
  command -v jq >/dev/null 2>&1 || { echo "ERROR: jq is required to set preferences" >&2; return 1; }
  mkdir -p "$(dirname "$PREFERENCES_FILE")"
  [ -f "$PREFERENCES_FILE" ] || echo '{}' > "$PREFERENCES_FILE"
  local tmp
  tmp="$(jq --arg k "$key" --argjson v "$jqval" '.skills = ((.skills // {}) + {($k): $v})' "$PREFERENCES_FILE")" || { echo "ERROR: jq failed updating $PREFERENCES_FILE" >&2; return 1; }
  [ -n "$tmp" ] || { echo "ERROR: jq produced empty output for $PREFERENCES_FILE" >&2; return 1; }
  echo "$tmp" > "$PREFERENCES_FILE"
  echo "Set skills.$key = $val in $PREFERENCES_FILE"
}

hook_enable() {
  command -v jq >/dev/null 2>&1 || { echo "ERROR: jq is required to register the hook" >&2; return 1; }
  mkdir -p "$(dirname "$SETTINGS_FILE")"
  [ -f "$SETTINGS_FILE" ] || echo '{}' > "$SETTINGS_FILE"
  local tmp
  tmp="$(jq --arg cmd "$DRIFT_HOOK_CMD" '
    .hooks = (.hooks // {})
    | .hooks.SessionStart = (.hooks.SessionStart // [])
    | if ([.hooks.SessionStart[]?.hooks[]? | select(.command == $cmd)] | length) > 0
      then .
      else .hooks.SessionStart += [ { "hooks": [ { "type": "command", "command": $cmd } ] } ]
      end
  ' "$SETTINGS_FILE")" || { echo "ERROR: jq failed updating $SETTINGS_FILE" >&2; return 1; }
  [ -n "$tmp" ] || { echo "ERROR: jq produced empty output for $SETTINGS_FILE" >&2; return 1; }
  echo "$tmp" > "$SETTINGS_FILE"
  set_pref session_start_hook true
  echo "Registered SessionStart drift hook in $SETTINGS_FILE"
}

hook_disable() {
  set_pref session_start_hook false
  command -v jq >/dev/null 2>&1 || { echo "ERROR: jq is required to remove the hook" >&2; return 1; }
  [ -f "$SETTINGS_FILE" ] || { echo "No $SETTINGS_FILE; nothing to remove."; return 0; }
  local tmp
  tmp="$(jq --arg cmd "$DRIFT_HOOK_CMD" '
    if .hooks.SessionStart then
      .hooks.SessionStart = ([ .hooks.SessionStart[]
        | .hooks = ([ .hooks[]? | select(.command != $cmd) ])
        | select((.hooks | length) > 0) ])
      | if (.hooks.SessionStart | length) == 0 then del(.hooks.SessionStart) else . end
      | if (.hooks | length) == 0 then del(.hooks) else . end
    else . end
  ' "$SETTINGS_FILE")" || { echo "ERROR: jq failed updating $SETTINGS_FILE" >&2; return 1; }
  [ -n "$tmp" ] || { echo "ERROR: jq produced empty output for $SETTINGS_FILE" >&2; return 1; }
  echo "$tmp" > "$SETTINGS_FILE"
  echo "Removed SessionStart drift hook from $SETTINGS_FILE"
}

show_prefs() {
  if [ -f "$PREFERENCES_FILE" ] && command -v jq >/dev/null 2>&1; then
    echo "session_start_hook: $(jq -r '.skills.session_start_hook // false' "$PREFERENCES_FILE")"
    echo "auto_refresh:       $(jq -r '.skills.auto_refresh // false' "$PREFERENCES_FILE")"
  else
    echo "session_start_hook: false"
    echo "auto_refresh:       false"
  fi
}

confirm_update() {
  if [ "${1:-}" = "--yes" ] || [ "${1:-}" = "-y" ]; then
    return 0
  fi
  printf "Check GitHub, fast-forward this checkout if possible, and rerun init.sh? [y/N] "
  read -r reply
  case "$reply" in
    y|Y|yes|YES) return 0 ;;
    *) echo "Update cancelled."; return 1 ;;
  esac
}

update_latest() {
  confirm_update "${1:-}"
  git -C "$REPO_ROOT" fetch origin
  git -C "$REPO_ROOT" rev-parse --short HEAD | sed 's/^/local before: /'
  git -C "$REPO_ROOT" rev-parse --short origin/HEAD | sed 's/^/origin HEAD: /'
  git -C "$REPO_ROOT" merge --ff-only origin/HEAD
  bash "$REPO_ROOT/$DELEGATE_SCRIPT"
  echo "Refresh complete."
  echo "Claude Code: run /reload-skills first; /clear starts a new empty-context conversation and can pick up the refreshed registry. Restart Claude Code if the top-level .claude/skills directory did not exist at session start or the skill is still invisible."
  echo 'Codex: start a fresh Codex CLI session if the $ skill list remains stale.'
}

case "${1:-}" in
  status)
    status
    ;;
  doctor)
    doctor
    ;;
  update|latest)
    mode="$1"
    shift
    update_latest "${1:-}"
    ;;
  set-pref)
    shift
    set_pref "${1:-}" "${2:-}"
    ;;
  show-prefs)
    show_prefs
    ;;
  hook)
    shift
    case "${1:-}" in
      enable) hook_enable ;;
      disable) hook_disable ;;
      *) echo "Usage: init-agentic-skills.sh hook <enable|disable>" >&2; exit 2 ;;
    esac
    ;;
  *)
    exec bash "$REPO_ROOT/$DELEGATE_SCRIPT" "$@"
    ;;
esac
