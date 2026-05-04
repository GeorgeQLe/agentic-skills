#!/usr/bin/env bash
set -euo pipefail

# Ship manifest quality-gate validator.
# Usage: ship-quality-gate.sh <manifest.md>

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <manifest.md>" >&2
  exit 2
fi

MANIFEST="$1"

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: manifest not found: $MANIFEST" >&2
  exit 2
fi

REQUIRED_FIELDS=(
  "User goal"
  "Changed files"
  "Per-file purpose"
  "User-goal mapping"
  "Tests run"
  "Skipped tests"
  "Adversarial review"
  "Residual risk"
  "Rollback note"
  "Next command"
)

field_pattern() {
  local field="$1"
  printf '^[[:space:]]{0,3}#{1,6}[[:space:]]*%s:?[[:space:]]*$|^[[:space:]]*[-*][[:space:]]+\\*\\*%s:\\*\\*' \
    "$field" "$field"
}

missing=0

for field in "${REQUIRED_FIELDS[@]}"; do
  if ! grep -Eiq "$(field_pattern "$field")" "$MANIFEST"; then
    echo "missing required field: $field"
    missing=1
  fi
done

if [[ $missing -ne 0 ]]; then
  exit 1
fi

echo "ship quality gate passed: $MANIFEST"
