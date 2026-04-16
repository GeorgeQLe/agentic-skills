#!/usr/bin/env bash

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
