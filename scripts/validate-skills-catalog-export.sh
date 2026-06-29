#!/usr/bin/env bash
set -euo pipefail

# Validates that committed public skills-catalog export artifacts are fresh.
# Usage: scripts/validate-skills-catalog-export.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

GENERATED_EXPORTS=(
  "exports/skills-catalog/v1/catalog.json"
  "exports/skills-catalog/v1/proof.json"
  "exports/skills-catalog/v1/manifest.json"
)

cd "$REPO_ROOT"

fingerprint_exports() {
  for artifact in "${GENERATED_EXPORTS[@]}"; do
    if [[ -f "$artifact" ]]; then
      printf '%s  %s\n' "$(git hash-object "$artifact")" "$artifact"
    else
      echo "MISSING  $artifact"
    fi
  done
}

BEFORE="$(fingerprint_exports)"

node scripts/generate-skills-catalog-export.mjs

AFTER="$(fingerprint_exports)"

if [[ "$BEFORE" != "$AFTER" ]]; then
  echo "Skills catalog export artifacts are stale."
  echo
  echo "Regenerated export status:"
  git status --short -- "${GENERATED_EXPORTS[@]}"
  echo
  echo "Run and commit:"
  echo "  node scripts/generate-skills-catalog-export.mjs"
  exit 1
fi

echo "Skills catalog export artifacts are fresh."
