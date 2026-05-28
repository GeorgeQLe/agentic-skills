#!/usr/bin/env bash
# detect-secrets.sh — Hook that blocks messages/tool outputs containing secrets.
# Works with both UserPromptSubmit (checks .prompt) and PostToolUse (checks .tool_response).

set -euo pipefail

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not found in PATH" >&2; exit 1; }
echo "x" | grep -P 'x' >/dev/null 2>&1 || { echo "Error: grep with -P (PCRE) support is required but not available" >&2; exit 1; }

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
echo "$TEXT" | grep -qP 'sk-ant-[a-zA-Z0-9_-]{20,}' && block "Anthropic API key"

# OpenAI API keys
echo "$TEXT" | grep -qP 'sk-[a-zA-Z0-9]{20,}' && block "OpenAI API key"

# AWS access keys
echo "$TEXT" | grep -qP 'AKIA[0-9A-Z]{16}' && block "AWS access key"

# GitHub tokens
echo "$TEXT" | grep -qP '(ghp_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,})' && block "GitHub token"

# Slack tokens
echo "$TEXT" | grep -qP 'xox[bpoa]-[a-zA-Z0-9-]+' && block "Slack token"

# Stripe keys
echo "$TEXT" | grep -qP '[sr]k_(live|test)_[a-zA-Z0-9]{20,}' && block "Stripe key"

# Database connection strings with credentials (user:pass@host pattern)
echo "$TEXT" | grep -qP '(postgres|mysql|mongodb|redis)://[^:]+:[^@]+@' && block "database connection string"

# Private keys
echo "$TEXT" | grep -qP '\-{5}BEGIN[[:space:]]+(RSA |EC |DSA |OPENSSH )?PRIVATE KEY\-{5}' && block "private key"

# JWT tokens (three base64 segments separated by dots)
echo "$TEXT" | grep -qP 'eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+' && block "JWT token"

exit 0
