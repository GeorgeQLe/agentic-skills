#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Installing poketo-kanban skill dependencies..."
npm install --production
echo "Done. Verify the default workflow with 'poketo kanban boards'."
echo "Use 'node kanban.mjs --help' only for legacy fallback/admin usage."
