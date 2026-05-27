#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
REPO_ROOT="$(cd "$SKILL_DIR/../../.." && pwd -P)"

exec bash "$REPO_ROOT/init.sh" "$@"
