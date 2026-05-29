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
  echo "Refresh complete. Start a fresh Claude Code or Codex session if updated skills are not visible."
}

case "${1:-}" in
  status)
    status
    ;;
  update|latest)
    mode="$1"
    shift
    update_latest "${1:-}"
    ;;
  *)
    exec bash "$REPO_ROOT/$DELEGATE_SCRIPT" "$@"
    ;;
esac
