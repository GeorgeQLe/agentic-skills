#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Installing poketo-kanban skill dependencies..."
npm install --production
echo "Done. Run 'node kanban.mjs --help' to verify."
