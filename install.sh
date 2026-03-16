#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
CODEX_SKILLS_DIR="$HOME/.codex/skills"

usage() {
  echo "Usage: $0 [--uninstall]"
  echo ""
  echo "Install:    Symlinks claude/ and codex/ skills into their global directories."
  echo "Uninstall:  Removes only symlinks pointing back to this repo."
  exit 0
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
fi

UNINSTALL=false
if [[ "${1:-}" == "--uninstall" ]]; then
  UNINSTALL=true
fi

if $UNINSTALL; then
  removed=0
  for link in "$CLAUDE_SKILLS_DIR"/*/; do
    link="${link%/}"
    [ -L "$link" ] || continue
    target="$(readlink "$link")"
    if [[ "$target" == "$SCRIPT_DIR/claude/"* ]]; then
      rm "$link"
      echo "Removed Claude Code: $(basename "$link")"
      removed=$((removed + 1))
    fi
  done
  for link in "$CODEX_SKILLS_DIR"/*/; do
    link="${link%/}"
    [ -L "$link" ] || continue
    target="$(readlink "$link")"
    if [[ "$target" == "$SCRIPT_DIR/codex/"* ]]; then
      rm "$link"
      echo "Removed Codex: $(basename "$link")"
      removed=$((removed + 1))
    fi
  done
  echo "Done. Removed $removed symlinks."
  exit 0
fi

mkdir -p "$CLAUDE_SKILLS_DIR" "$CODEX_SKILLS_DIR"

count_claude=0
count_codex=0
skipped=0

# Install Claude Code skills
for skill_dir in "$SCRIPT_DIR"/claude/*/; do
  skill_dir="${skill_dir%/}"
  name="$(basename "$skill_dir")"
  target="$CLAUDE_SKILLS_DIR/$name"

  if [ -L "$target" ]; then
    existing="$(readlink "$target")"
    if [ "$existing" = "$skill_dir" ]; then
      continue
    fi
    # Symlink exists but points elsewhere — update it
    rm "$target"
  elif [ -e "$target" ]; then
    echo "WARNING: $target exists and is not a symlink, skipping"
    skipped=$((skipped + 1))
    continue
  fi

  ln -sfn "$skill_dir" "$target"
  count_claude=$((count_claude + 1))
done

# Install Codex skills
for skill_dir in "$SCRIPT_DIR"/codex/*/; do
  skill_dir="${skill_dir%/}"
  name="$(basename "$skill_dir")"
  target="$CODEX_SKILLS_DIR/$name"

  if [ -L "$target" ]; then
    existing="$(readlink "$target")"
    if [ "$existing" = "$skill_dir" ]; then
      continue
    fi
    rm "$target"
  elif [ -e "$target" ]; then
    echo "WARNING: $target exists and is not a symlink, skipping"
    skipped=$((skipped + 1))
    continue
  fi

  ln -sfn "$skill_dir" "$target"
  count_codex=$((count_codex + 1))
done

echo ""
echo "Installed $count_claude Claude Code skills -> $CLAUDE_SKILLS_DIR"
echo "Installed $count_codex Codex skills -> $CODEX_SKILLS_DIR"
if [ "$skipped" -gt 0 ]; then echo "Skipped $skipped (see warnings above)"; fi
echo "Done."
