#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"

for launcher in \
  "$REPO_ROOT/global/codex/init-agentic-skills/scripts/init-agentic-skills.sh" \
  "$REPO_ROOT/global/claude/init-agentic-skills/scripts/init-agentic-skills.sh"
do
  if [ -f "$launcher" ]; then
    exec bash "$launcher" "$@"
  fi
done

echo "ERROR: unable to find bundled init-agentic-skills launcher under global/{codex,claude}." >&2
exit 1
