#!/usr/bin/env bash
set -euo pipefail

# Validates that committed Skills Showcase generated assets are fresh.
# Usage: scripts/validate-skills-showcase-data.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

GENERATORS=(
  "scripts/generate-skills-showcase-data.mjs"
  "scripts/generate-skills-showcase-github-data.mjs"
)

GENERATED_ASSETS=(
  "docs/skills-showcase/assets/skills-data.js"
  "docs/skills-showcase/assets/github-proof-data.js"
)

cd "$REPO_ROOT"

fingerprint_assets() {
  for asset in "${GENERATED_ASSETS[@]}"; do
    if [[ -f "$asset" ]]; then
      printf '%s  %s\n' "$(git hash-object "$asset")" "$asset"
    else
      echo "MISSING  $asset"
    fi
  done
}

BEFORE="$(fingerprint_assets)"

for generator in "${GENERATORS[@]}"; do
  node "$generator"
done

AFTER="$(fingerprint_assets)"

if [[ "$BEFORE" != "$AFTER" ]]; then
  echo "Skills Showcase generated data is stale."
  echo
  echo "Regenerated asset status:"
  git status --short -- "${GENERATED_ASSETS[@]}"
  echo
  echo "Run these commands and commit the updated generated assets:"
  for generator in "${GENERATORS[@]}"; do
    echo "  node $generator"
  done
  exit 1
fi

echo "Skills Showcase generated data is fresh."
