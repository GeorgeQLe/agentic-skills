#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
CODEX_SKILLS_DIR="$HOME/.codex/skills"

usage() {
  echo "Usage: $0 [--uninstall]"
  echo ""
  echo "Install:    Symlinks global core skills into assistant global skill directories."
  echo "Uninstall:  Removes repo-managed global symlinks pointing back to this repo."
  echo ""
  echo "Project-local domain packs are managed with: scripts/pack.sh install <pack>"
  exit 0
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
fi

UNINSTALL=false
if [[ "${1:-}" == "--uninstall" ]]; then
  UNINSTALL=true
fi

remove_repo_link() {
  local link="$1"
  local target
  [[ -L "$link" ]] || return 0
  target="$(readlink "$link")"
  case "$target" in
    "$SCRIPT_DIR/global/claude/"*|"$SCRIPT_DIR/global/codex/"*|"$SCRIPT_DIR/stubs/claude/"*|"$SCRIPT_DIR/stubs/codex/"*|"$SCRIPT_DIR/claude/"*|"$SCRIPT_DIR/codex/"*)
      rm "$link"
      echo "Removed $(basename "$link")"
      return 0
      ;;
  esac
  return 1
}

remove_legacy_link() {
  local link="$1"
  local target
  [[ -L "$link" ]] || return 1
  target="$(readlink "$link")"
  case "$target" in
    "$SCRIPT_DIR/stubs/claude/"*|"$SCRIPT_DIR/stubs/codex/"*|"$SCRIPT_DIR/claude/"*|"$SCRIPT_DIR/codex/"*)
      rm "$link"
      echo "Removed legacy global skill: $(basename "$link")"
      return 0
      ;;
    "$SCRIPT_DIR/global/claude/"*|"$SCRIPT_DIR/global/codex/"*)
      if [[ ! -e "$target" ]]; then
        rm "$link"
        echo "Removed stale global skill: $(basename "$link")"
        return 0
      fi
      ;;
  esac
  return 1
}

cleanup_legacy_links() {
  local root="$1"
  local -n out_count="$2"
  local removed=0

  [[ -d "$root" ]] || {
    out_count=0
    return 0
  }

  for link in "$root"/*; do
    [[ -e "$link" || -L "$link" ]] || continue
    if remove_legacy_link "$link"; then
      removed=$((removed + 1))
    fi
  done

  out_count="$removed"
}

install_tree() {
  local source_root="$1"
  local target_root="$2"
  local label="$3"
  local -n out_count="$4"
  local -n out_skipped="$5"
  local count=0
  local skipped=0
  local skill_dir name target existing

  [[ -d "$source_root" ]] || {
    out_count=0
    out_skipped=0
    return 0
  }

  mkdir -p "$target_root"

  for skill_dir in "$source_root"/*/; do
    [[ -d "$skill_dir" ]] || continue
    skill_dir="${skill_dir%/}"
    name="$(basename "$skill_dir")"
    target="$target_root/$name"

    if [[ -L "$target" ]]; then
      existing="$(readlink "$target")"
      if [[ "$existing" == "$skill_dir" ]]; then
        continue
      fi
      rm "$target"
    elif [[ -e "$target" ]]; then
      echo "WARNING: $target exists and is not a symlink, skipping"
      skipped=$((skipped + 1))
      continue
    fi

    ln -sfn "$skill_dir" "$target"
    echo "Installed $label: $name"
    count=$((count + 1))
  done

  out_count="$count"
  out_skipped="$skipped"
}

if $UNINSTALL; then
  removed=0
  for root in "$CLAUDE_SKILLS_DIR" "$CODEX_SKILLS_DIR"; do
    [[ -d "$root" ]] || continue
    for link in "$root"/*; do
      [[ -e "$link" || -L "$link" ]] || continue
      if remove_repo_link "$link"; then
        removed=$((removed + 1))
      fi
    done
  done
  echo "Done. Removed $removed symlinks."
  exit 0
fi

mkdir -p "$CLAUDE_SKILLS_DIR" "$CODEX_SKILLS_DIR"

cleanup_legacy_links "$CLAUDE_SKILLS_DIR" removed_claude_legacy
cleanup_legacy_links "$CODEX_SKILLS_DIR" removed_codex_legacy

install_tree "$SCRIPT_DIR/global/claude" "$CLAUDE_SKILLS_DIR" "Claude core" count_claude_core skipped_claude_core
install_tree "$SCRIPT_DIR/global/codex" "$CODEX_SKILLS_DIR" "Codex core" count_codex_core skipped_codex_core

skipped=$((skipped_claude_core + skipped_codex_core))
removed_legacy=$((removed_claude_legacy + removed_codex_legacy))

echo ""
echo "Installed $count_claude_core Claude core skills -> $CLAUDE_SKILLS_DIR"
echo "Installed $count_codex_core Codex core skills -> $CODEX_SKILLS_DIR"
if [[ "$removed_legacy" -gt 0 ]]; then echo "Removed $removed_legacy legacy global skill links."; fi
echo "Domain packs were not installed globally. Use scripts/pack.sh install <pack> from a project."
echo "Former business/product skills are available with: scripts/pack.sh install business-app"
if [[ "$skipped" -gt 0 ]]; then echo "Skipped $skipped (see warnings above)"; fi
echo "Done."
