#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
DELEGATE_SCRIPT="scripts/pack.sh"

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
    echo "ERROR: Unable to resolve agentic-skills repository root for pack launcher."
    echo "Tried source-tree candidate: $source_tree_root"
    echo "Tried managed-install provenance: $managed_file source=${managed_source:-<missing>} -> $provenance_root"
    echo "Expected delegated script: $DELEGATE_SCRIPT"
  } >&2
  return 1
}

REPO_ROOT="$(resolve_repo_root)"

exec bash "$REPO_ROOT/$DELEGATE_SCRIPT" "$@"
