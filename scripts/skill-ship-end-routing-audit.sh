#!/usr/bin/env bash
set -euo pipefail

# Focused audit for ship-end next-step routing precedence.
# Ensures research/design/alignment review work stays directly routable instead
# of falling through to the execution-loop default.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CODEX_FILE="$REPO_ROOT/packs/exec-loop/codex/ship-end/SKILL.md"
CLAUDE_FILE="$REPO_ROOT/packs/exec-loop/claude/ship-end/SKILL.md"

failures=()

require_line() {
  local file="$1"
  local pattern="$2"
  local label="$3"

  if ! grep -Fq "$pattern" "$file"; then
    failures+=("$(realpath --relative-to "$REPO_ROOT" "$file"): missing $label")
  fi
}

require_line "$CODEX_FILE" "version: v0.5" "v0.5 version bump"
require_line "$CLAUDE_FILE" "version: v0.5" "v0.5 version bump"

for file in "$CODEX_FILE" "$CLAUDE_FILE"; do
  require_line "$file" "Prefer an owning workflow/domain route over execution-loop defaults." "owning-route precedence"
  require_line "$file" "research, alignment, design, UI, UX, prototype-test, or copy-audit" "research/design review artifact list"
  require_line "$file" "narrower installed skill, artifact contract, or review route owns the next action" "narrower-owner fallback limit"
  require_line "$file" "after applying owning-route precedence above" "inference-default ordering"
done

require_line "$CODEX_FILE" 'Use `$exec` only when no narrower installed skill, artifact contract, or review route owns the next action.' "Codex exec fallback limit"
require_line "$CLAUDE_FILE" 'Use `/exec` only when no narrower installed skill, artifact contract, or review route owns the next action.' "Claude exec fallback limit"

if [[ "${#failures[@]}" -gt 0 ]]; then
  printf 'ship-end routing audit failed:\n' >&2
  printf '  - %s\n' "${failures[@]}" >&2
  exit 1
fi

echo "ship-end routing audit passed: owning-route precedence is present in both mirrors."
