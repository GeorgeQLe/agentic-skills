#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
REPO_ROOT="$(cd "$SKILL_DIR/../../.." && pwd -P)"

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
  bash "$REPO_ROOT/init.sh"
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
    exec bash "$REPO_ROOT/init.sh" "$@"
    ;;
esac
