#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(pwd)"
PROJECT_FILE="$PROJECT_ROOT/.agents/project.json"

die() {
  echo "ERROR: $*" >&2
  exit 1
}

validate_agent_mode() {
  case "$1" in
    claude-only|codex-only|hybrid) return 0 ;;
    *) return 1 ;;
  esac
}

env_mode="${SKILLS_AGENT_MODE:-}"
if [[ -n "$env_mode" ]]; then
  validate_agent_mode "$env_mode" || die "Invalid SKILLS_AGENT_MODE '$env_mode'. Must be claude-only, codex-only, or hybrid."
  echo "$env_mode"
  exit 0
fi

file_mode=""
if [[ -f "$PROJECT_FILE" ]]; then
  file_mode="$(sed -n 's/.*"agent_mode"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$PROJECT_FILE" | head -1)"
fi

if [[ -n "$file_mode" ]]; then
  validate_agent_mode "$file_mode" || die "Invalid agent_mode '$file_mode' in $PROJECT_FILE. Must be claude-only, codex-only, or hybrid."
  echo "$file_mode"
  exit 0
fi

# Unset: print empty string, exit 0.
echo ""
