#!/usr/bin/env bash
# detect-secrets.sh — Hook that blocks messages/tool outputs containing secrets.
# Works with both UserPromptSubmit (checks .prompt) and PostToolUse (checks .tool_response).

set -euo pipefail

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not found in PATH" >&2; exit 1; }

# Select a PCRE matching engine. GNU grep -P is preferred; fall back to ripgrep
# or perl so the gate runs on macOS/darwin where BSD grep lacks -P.
if echo "x" | grep -P 'x' >/dev/null 2>&1; then
  pcre_match() { printf '%s' "$2" | grep -qP "$1"; }
elif command -v rg >/dev/null 2>&1; then
  pcre_match() { printf '%s' "$2" | rg -q "$1"; }
elif command -v perl >/dev/null 2>&1; then
  pcre_match() { PCRE_PATTERN="$1" perl -e 'my $p=$ENV{PCRE_PATTERN}; while (my $l=<STDIN>) { exit 0 if $l=~/$p/ } exit 1' <<<"$2"; }
else
  echo "Error: a PCRE matcher (grep -P, ripgrep, or perl) is required but none is available" >&2
  exit 1
fi

INPUT=$(cat)

# Extract text to scan based on which hook event fired
HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty')

if [[ "$HOOK_EVENT" == "PostToolUse" ]]; then
  # Only scan tools that return file/command content
  TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
  case "$TOOL_NAME" in
    Read|Bash|WebFetch) ;;
    *) exit 0 ;;
  esac
  TEXT=$(echo "$INPUT" | jq -r '.tool_response | tostring')
else
  # UserPromptSubmit — scan the prompt
  TEXT=$(echo "$INPUT" | jq -r '.prompt // empty')
fi

if [[ -z "$TEXT" ]]; then
  exit 0
fi

block() {
  local type="$1"
  echo "{\"decision\": \"block\", \"reason\": \"Secret detected ($type). Use an env var reference instead.\"}"
  exit 0
}

# Anthropic API keys
pcre_match 'sk-ant-[a-zA-Z0-9_-]{20,}' "$TEXT" && block "Anthropic API key"

# OpenAI API keys
pcre_match 'sk-[a-zA-Z0-9]{20,}' "$TEXT" && block "OpenAI API key"

# AWS access keys
pcre_match 'AKIA[0-9A-Z]{16}' "$TEXT" && block "AWS access key"

# GitHub tokens
pcre_match '(ghp_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,})' "$TEXT" && block "GitHub token"

# Slack tokens
pcre_match 'xox[bpoa]-[a-zA-Z0-9-]+' "$TEXT" && block "Slack token"

# Stripe keys
pcre_match '[sr]k_(live|test)_[a-zA-Z0-9]{20,}' "$TEXT" && block "Stripe key"

# Database connection strings with credentials (user:pass@host pattern)
pcre_match '(postgres|mysql|mongodb|redis)://[^:]+:[^@]+@' "$TEXT" && block "database connection string"

# Private keys
pcre_match '\-{5}BEGIN[[:space:]]+(RSA |EC |DSA |OPENSSH )?PRIVATE KEY\-{5}' "$TEXT" && block "private key"

# JWT tokens (three base64 segments separated by dots)
pcre_match 'eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+' "$TEXT" && block "JWT token"

exit 0
