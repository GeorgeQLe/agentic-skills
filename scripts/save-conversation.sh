#!/usr/bin/env bash
# Save Claude Code conversations to conversations/ as readable markdown.
# Used by /ship and /ship-end --save-conversation / --save-all-conversations.
#
# Usage:
#   scripts/save-conversation.sh [--topic SLUG] [--session-id UUID]
#   scripts/save-conversation.sh --all [--force]
#
# --all     Export every past conversation (skip already-exported ones)
# --force   Re-export even if already saved (works with --all or single-session)
#
# Outputs the path of saved file(s) on success.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
CONV_DIR="$REPO_ROOT/conversations"
TOPIC=""
SESSION_ID=""
ALL=false
FORCE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --topic)      TOPIC="$2"; shift 2 ;;
    --session-id) SESSION_ID="$2"; shift 2 ;;
    --all)        ALL=true; shift ;;
    --force)      FORCE=true; shift ;;
    *)            echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# Derive Claude Code project directory from repo path
REPO_PATH="$(cd "$REPO_ROOT" && pwd)"
PROJECT_ID="${REPO_PATH//\//-}"
CLAUDE_PROJECT_DIR="$HOME/.claude/projects/$PROJECT_ID"

if [[ ! -d "$CLAUDE_PROJECT_DIR" ]]; then
  echo "ERROR: Claude Code project directory not found: $CLAUDE_PROJECT_DIR" >&2
  echo "This script requires Claude Code conversation history on the local machine." >&2
  exit 1
fi

mkdir -p "$CONV_DIR"

# Convert a single JSONL conversation file to markdown.
# Usage: convert_one <jsonl-path>
# Prints the output filepath on success.
convert_one() {
  local conv_file="$1"
  local uuid
  uuid="$(basename "$conv_file" .jsonl)"

  python3 - "$conv_file" "$CONV_DIR" "$TOPIC" "$uuid" << 'PYEOF'
import json, sys, os, re
from datetime import datetime, timezone

conv_file = sys.argv[1]
conv_dir = sys.argv[2]
topic_override = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else ""
uuid = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else ""

messages = []
metadata = {}

with open(conv_file) as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        messages.append(d)

        msg_type = d.get("type")

        if msg_type == "ai-title":
            metadata["title"] = d.get("aiTitle", "")

        if msg_type == "user" and "first_timestamp" not in metadata:
            metadata["first_timestamp"] = d.get("timestamp", "")
            metadata["entrypoint"] = d.get("entrypoint", "unknown")
            metadata["version"] = d.get("version", "unknown")
            metadata["gitBranch"] = d.get("gitBranch", "unknown")
            metadata["sessionId"] = d.get("sessionId", "unknown")

        if msg_type in ("user", "assistant") and "timestamp" in d:
            metadata["last_timestamp"] = d["timestamp"]

        if msg_type == "assistant":
            raw = d.get("message", {})
            if isinstance(raw, dict) and "model" in raw and "model" not in metadata:
                metadata["model"] = raw["model"]


def parse_ts(ts_str):
    if not ts_str:
        return None
    try:
        return datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
    except ValueError:
        return None


def summarize_tool(block):
    name = block.get("name", "unknown")
    inp = block.get("input", {})
    if name == "Read":
        return f"Read `{inp.get('file_path', '?')}`"
    if name == "Write":
        return f"Write `{inp.get('file_path', '?')}`"
    if name == "Edit":
        return f"Edit `{inp.get('file_path', '?')}`"
    if name == "Bash":
        cmd = inp.get("command", "")
        desc = inp.get("description", "")
        if desc:
            return f"Bash: {desc}"
        if len(cmd) > 100:
            cmd = cmd[:97] + "..."
        return f"Bash: `{cmd}`"
    if name == "Agent":
        return f"Agent: {inp.get('description', '?')}"
    if name == "Skill":
        return f"Skill: /{inp.get('skill', '?')}"
    if name == "WebSearch":
        return f"WebSearch: {inp.get('query', '?')}"
    if name == "WebFetch":
        return f"WebFetch: {inp.get('url', '?')}"
    return name


# Determine title and filename
title = topic_override or metadata.get("title", "session")
title_slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:60]

entrypoint = metadata.get("entrypoint", "unknown")
agent = "claude" if entrypoint in ("cli", "vscode", "jetbrains", "web") else entrypoint

first_dt = parse_ts(metadata.get("first_timestamp", ""))
if first_dt:
    file_ts = first_dt.strftime("%Y%m%d-%H%M%S")
    display_date = first_dt.strftime("%Y-%m-%d %H:%M:%S UTC")
else:
    file_ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    display_date = "unknown"

uuid_suffix = f"-{uuid}" if uuid else ""
filename = f"{file_ts}-{agent}-{title_slug}{uuid_suffix}.md"
filepath = os.path.join(conv_dir, filename)

# Build markdown
out = []
out.append(f"# {title}\n")
out.append("| Field | Value |")
out.append("|-------|-------|")
out.append(f"| **Date** | {display_date} |")
out.append(f"| **Agent** | {agent} |")
out.append(f"| **Model** | {metadata.get('model', 'unknown')} |")
out.append(f"| **Branch** | {metadata.get('gitBranch', 'unknown')} |")
out.append(f"| **Session** | `{metadata.get('sessionId', 'unknown')}` |")
out.append(f"| **Entrypoint** | {entrypoint} |")
out.append(f"| **Version** | {metadata.get('version', 'unknown')} |")
out.append("\n---\n")

for msg in messages:
    msg_type = msg.get("type")

    if msg_type == "user":
        dt = parse_ts(msg.get("timestamp", ""))
        ts_label = f" _{dt.strftime('%H:%M:%S')}_" if dt else ""

        content = ""
        raw = msg.get("message", {})
        if isinstance(raw, dict):
            c = raw.get("content", "")
            if isinstance(c, str):
                content = c
            elif isinstance(c, list):
                parts = []
                for block in c:
                    if isinstance(block, dict) and block.get("type") == "text":
                        parts.append(block.get("text", ""))
                    elif isinstance(block, str):
                        parts.append(block)
                content = "\n".join(parts)
        elif isinstance(raw, str):
            content = raw

        if content.strip():
            out.append(f"## User{ts_label}\n")
            out.append(content.strip())
            out.append("")

    elif msg_type == "assistant":
        dt = parse_ts(msg.get("timestamp", ""))
        ts_label = f" _{dt.strftime('%H:%M:%S')}_" if dt else ""

        raw = msg.get("message", {})
        blocks = raw.get("content", []) if isinstance(raw, dict) else []

        text_parts = []
        tool_uses = []

        for block in blocks:
            if not isinstance(block, dict):
                continue
            btype = block.get("type")
            if btype == "text":
                t = block.get("text", "").strip()
                if t:
                    text_parts.append(t)
            elif btype == "tool_use":
                tool_uses.append(summarize_tool(block))
            # skip thinking, tool_result, etc.

        if text_parts or tool_uses:
            out.append(f"## Assistant{ts_label}\n")
            if text_parts:
                out.append("\n\n".join(text_parts))
                out.append("")
            if tool_uses:
                out.append("<details><summary>Tool calls</summary>\n")
                for tu in tool_uses:
                    out.append(f"- {tu}")
                out.append("\n</details>\n")

with open(filepath, "w") as f:
    f.write("\n".join(out))

# Print the path for the caller
print(filepath)
PYEOF
}

if [[ "$ALL" == "true" ]]; then
  # Export every conversation in the project directory
  total=0
  exported=0
  skipped=0
  failed=0

  for jsonl in "$CLAUDE_PROJECT_DIR"/*.jsonl; do
    [[ -f "$jsonl" ]] || continue
    total=$((total + 1))
    uuid="$(basename "$jsonl" .jsonl)"

    if [[ "$FORCE" != "true" ]] && ls "$CONV_DIR"/*-"$uuid".md >/dev/null 2>&1; then
      skipped=$((skipped + 1))
      continue
    fi

    if convert_one "$jsonl"; then
      exported=$((exported + 1))
    else
      failed=$((failed + 1))
      echo "WARN: Failed to convert $jsonl" >&2
    fi
  done

  echo "Exported $exported/$total (skipped $skipped, $failed failed)"
else
  # Single-session mode
  if [[ -n "$SESSION_ID" ]]; then
    CONV_FILE="$CLAUDE_PROJECT_DIR/${SESSION_ID}.jsonl"
    if [[ ! -f "$CONV_FILE" ]]; then
      echo "ERROR: Conversation file not found: $CONV_FILE" >&2
      exit 1
    fi
  else
    CONV_FILE="$(ls -t "$CLAUDE_PROJECT_DIR"/*.jsonl 2>/dev/null | head -1)"
    if [[ -z "$CONV_FILE" ]]; then
      echo "ERROR: No conversation files found in $CLAUDE_PROJECT_DIR" >&2
      exit 1
    fi
  fi

  uuid="$(basename "$CONV_FILE" .jsonl)"
  if [[ "$FORCE" != "true" ]]; then
    existing="$(ls "$CONV_DIR"/*-"$uuid".md 2>/dev/null | head -1 || true)"
    if [[ -n "$existing" ]]; then
      echo "$existing"
      exit 0
    fi
  fi

  convert_one "$CONV_FILE"
fi
