#!/usr/bin/env bash

SKILL_LINK_MARKER=".agentic-skills-managed"

skill_source_owned_by_repo() {
  local source="$1"
  local repo_root="${REPO_ROOT:-${SCRIPT_DIR:-}}"
  local global_root="${SCRIPT_DIR:-$repo_root}"
  [[ -n "$repo_root" ]] || return 1
  case "$source" in
    "$global_root/global/claude/"*|"$global_root/global/codex/"*|"$repo_root/packs/"*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

is_managed_skill_dir() {
  local target="$1"
  [[ -d "$target" && ! -L "$target" && -f "$target/$SKILL_LINK_MARKER" ]]
}

managed_skill_source() {
  local target="$1"
  [[ -f "$target/$SKILL_LINK_MARKER" ]] || return 1
  sed -n 's/^source=//p' "$target/$SKILL_LINK_MARKER" | head -1
}

remove_repo_skill_install() {
  local target="$1"
  local source

  if [[ -L "$target" ]]; then
    source="$(readlink "$target")"
    if skill_source_owned_by_repo "$source"; then
      rm "$target"
      return 0
    fi
    return 1
  fi

  if is_managed_skill_dir "$target"; then
    source="$(managed_skill_source "$target")"
    if skill_source_owned_by_repo "$source"; then
      rm -rf "$target"
      return 0
    fi
  fi

  return 1
}

sync_skill_link() {
  local source="$1"
  local target="$2"
  local existing

  if [[ -L "$target" ]]; then
    existing="$(readlink "$target")"
    if [[ "$existing" == "$source" ]]; then
      return 1
    fi
    rm "$target"
  elif [[ -e "$target" ]]; then
    echo "WARNING: $target exists and is not a symlink, skipping"
    return 2
  fi

  ln -sfn "$source" "$target"
  return 0
}

sync_skill_install() {
  local source="$1"
  local target="$2"

  if [[ "$(basename "$(dirname "$source")")" == "archive" ]]; then
    sync_skill_link "$source" "$target"
    return $?
  fi

  if [[ -L "$target" ]]; then
    rm "$target"
  elif [[ -e "$target" ]]; then
    if is_managed_skill_dir "$target"; then
      rm -rf "$target"
    else
      echo "WARNING: $target exists and is not repo-managed, skipping"
      return 2
    fi
  fi

  mkdir -p "$target"
  {
    printf 'source=%s\n' "$source"
    printf 'managed_by=agentic-skills\n'
  } > "$target/$SKILL_LINK_MARKER"

  local entry name
  for entry in "$source"/* "$source"/.[!.]* "$source"/..?*; do
    [[ -e "$entry" || -L "$entry" ]] || continue
    name="$(basename "$entry")"
    [[ "$name" == "archive" ]] && continue
    cp -R "$entry" "$target/$name"
  done

  return 0
}
