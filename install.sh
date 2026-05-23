#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
CODEX_SKILLS_DIR="$HOME/.codex/skills"
source "$SCRIPT_DIR/scripts/skill-links.sh"

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
PINS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --uninstall) UNINSTALL=true; shift ;;
    --pin)
      shift
      [[ $# -gt 0 ]] || { echo "ERROR: --pin requires skill=version argument" >&2; exit 1; }
      PINS+=("$1")
      shift
      ;;
    *) shift ;;
  esac
done

SKILL_PINS_FILE="$HOME/.claude/skill-pins.json"

read_skill_pin() {
  local skill="$1"
  if [[ -f "$SKILL_PINS_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -r --arg s "$skill" '.[$s] // empty' "$SKILL_PINS_FILE" 2>/dev/null || true
  fi
}

write_skill_pin() {
  local skill="$1"
  local version="$2"
  mkdir -p "$(dirname "$SKILL_PINS_FILE")"
  if [[ -f "$SKILL_PINS_FILE" ]] && command -v jq >/dev/null 2>&1; then
    local tmp
    tmp="$(jq --arg s "$skill" --arg v "$version" '.[$s] = $v' "$SKILL_PINS_FILE")"
    echo "$tmp" > "$SKILL_PINS_FILE"
  else
    printf '{ "%s": "%s" }\n' "$skill" "$version" > "$SKILL_PINS_FILE"
  fi
}

remove_repo_link() {
  local link="$1"
  local target
  [[ -L "$link" ]] || return 0
  target="$(readlink "$link")"
  case "$target" in
    "$SCRIPT_DIR/global/claude/"*|"$SCRIPT_DIR/global/codex/"*)
      rm "$link"
      echo "Removed $(basename "$link")"
      return 0
      ;;
  esac
  return 1
}

remove_stale_repo_links() {
  local root="$1"
  local link target
  [[ -d "$root" ]] || return 0

  for link in "$root"/*; do
    [[ -L "$link" ]] || continue
    target="$(readlink "$link")"
    case "$target" in
      "$SCRIPT_DIR/global/claude/"*|"$SCRIPT_DIR/global/codex/"*)
        if [[ ! -e "$target" ]]; then
          rm "$link"
          echo "Removed stale $(basename "$link")"
        fi
        ;;
    esac
  done
}

set_output_var() {
  local var_name="$1"
  local value="$2"

  if [[ ! "$var_name" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
    echo "ERROR: invalid output variable name: $var_name" >&2
    return 1
  fi

  printf -v "$var_name" "%s" "$value"
}

install_tree() {
  local source_root="$1"
  local target_root="$2"
  local label="$3"
  local out_count_var="$4"
  local out_skipped_var="$5"
  local count=0
  local skipped=0
  local skill_dir name target

  [[ -d "$source_root" ]] || {
    set_output_var "$out_count_var" 0
    set_output_var "$out_skipped_var" 0
    return 0
  }

  mkdir -p "$target_root"

  for skill_dir in "$source_root"/*/; do
    [[ -d "$skill_dir" ]] || continue
    skill_dir="${skill_dir%/}"
    name="$(basename "$skill_dir")"
    target="$target_root/$name"
    local effective_source="$skill_dir"

    local pinned
    pinned="$(read_skill_pin "$name")"
    if [[ -n "$pinned" ]]; then
      local archive_path="$skill_dir/archive/$pinned"
      if [[ -d "$archive_path" && -f "$archive_path/SKILL.md" ]]; then
        effective_source="$archive_path"
      else
        echo "WARNING: pin $name=$pinned but $archive_path/SKILL.md not found, using current" >&2
      fi
    fi

    if sync_skill_link "$effective_source" "$target"; then
      if [[ -n "$pinned" && "$effective_source" != "$skill_dir" ]]; then
        echo "Installed $label: $name (pinned $pinned)"
      else
        echo "Installed $label: $name"
      fi
      count=$((count + 1))
    else
      local status=$?
      if [[ "$status" -eq 1 ]]; then
        continue
      fi
      skipped=$((skipped + 1))
      continue
    fi
  done

  set_output_var "$out_count_var" "$count"
  set_output_var "$out_skipped_var" "$skipped"
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
remove_stale_repo_links "$CLAUDE_SKILLS_DIR"
remove_stale_repo_links "$CODEX_SKILLS_DIR"

for pin_entry in "${PINS[@]+"${PINS[@]}"}"; do
  if [[ "$pin_entry" =~ ^([^=]+)=(.+)$ ]]; then
    pin_skill="${BASH_REMATCH[1]}"
    pin_version="${BASH_REMATCH[2]}"
    write_skill_pin "$pin_skill" "$pin_version"
    echo "Pinned global skill $pin_skill to $pin_version"
  else
    echo "WARNING: invalid --pin format '$pin_entry', expected skill=version" >&2
  fi
done

install_tree "$SCRIPT_DIR/global/claude" "$CLAUDE_SKILLS_DIR" "Claude core" count_claude_core skipped_claude_core
install_tree "$SCRIPT_DIR/global/codex" "$CODEX_SKILLS_DIR" "Codex core" count_codex_core skipped_codex_core

skipped=$((skipped_claude_core + skipped_codex_core))

echo ""
echo "Installed $count_claude_core Claude core skills -> $CLAUDE_SKILLS_DIR"
echo "Installed $count_codex_core Codex core skills -> $CODEX_SKILLS_DIR"
echo "Domain packs were not installed globally. Use scripts/pack.sh install <pack> from a project."
if [[ "$skipped" -gt 0 ]]; then echo "Skipped $skipped (see warnings above)"; fi
echo "Done."
