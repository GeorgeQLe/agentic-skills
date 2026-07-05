#!/usr/bin/env bash

SKILL_LINK_MARKER=".agentic-skills-managed"

skill_source_owned_by_repo() {
  local source="$1"
  local repo_root="${REPO_ROOT:-${SCRIPT_DIR:-}}"
  local base_root="${SCRIPT_DIR:-$repo_root}"
  [[ -n "$repo_root" ]] || return 1
  case "$source" in
    "$base_root/packs/base/claude/"*|"$base_root/packs/base/codex/"*|"$repo_root/packs/base/claude/"*|"$repo_root/packs/base/codex/"*|\
    "$base_root/base/claude/"*|"$base_root/base/codex/"*|"$repo_root/packs/"*)
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

managed_marker_field() {
  local target="$1"
  local field="$2"
  [[ -f "$target/$SKILL_LINK_MARKER" ]] || return 1
  sed -n "s/^${field}=//p" "$target/$SKILL_LINK_MARKER" | head -1
}

managed_skill_source() {
  managed_marker_field "$1" source
}

# Portable SHA-256 of stdin. Prefers sha256sum, falls back to shasum -a 256.
_sha256() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum
  else
    shasum -a 256
  fi
}

# Deterministic content hash of a canonical skill source directory.
# Mirrors the install copy loop: excludes archive/ and the managed marker.
# Hashes each file's content keyed by its relative path, sorted, so the
# result is stable across runs and captures adds/removes/renames/edits.
skill_content_sha() {
  local dir="$1"
  [[ -d "$dir" ]] || return 1
  local f rel h
  {
    while IFS= read -r f; do
      rel="${f#"$dir"/}"
      h="$(_sha256 < "$f" | awk '{print $1}')"
      printf '%s  %s\n' "$h" "$rel"
    done < <(find "$dir" -type f -not -path '*/archive/*' -not -name "$SKILL_LINK_MARKER" | LC_ALL=C sort)
  } | _sha256 | awk '{print $1}'
}

# Extract the frontmatter version: field from a skill source directory.
skill_source_version() {
  local dir="$1"
  [[ -f "$dir/SKILL.md" ]] || return 1
  sed -n 's/^version:[[:space:]]*//p' "$dir/SKILL.md" | head -1 | tr -d '"' | xargs
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
    # An existing repo-managed copy (track-latest install) is replaced with the
    # pinned symlink; anything else is left untouched.
    if is_managed_skill_dir "$target"; then
      rm -rf "$target"
    else
      echo "WARNING: $target exists and is not repo-managed, skipping"
      return 2
    fi
  fi

  ln -sfn "$source" "$target"
  return 0
}

copy_skill_install_entries() {
  local source="$1"
  local target="$2"
  local entry name

  mkdir -p "$target"
  for entry in "$source"/* "$source"/.[!.]* "$source"/..?*; do
    [[ -e "$entry" || -L "$entry" ]] || continue
    name="$(basename "$entry")"
    [[ "$name" == "archive" || "$name" == "$SKILL_LINK_MARKER" ]] && continue

    if [[ -d "$entry" && ! -L "$entry" ]]; then
      copy_skill_install_entries "$entry" "$target/$name"
    else
      cp -R "$entry" "$target/$name"
    fi
  done
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
  local source_version source_sha
  source_version="$(skill_source_version "$source" 2>/dev/null || true)"
  source_sha="$(skill_content_sha "$source" 2>/dev/null || true)"
  {
    printf 'source=%s\n' "$source"
    printf 'managed_by=agentic-skills\n'
    printf 'source_version=%s\n' "$source_version"
    printf 'source_sha=%s\n' "$source_sha"
  } > "$target/$SKILL_LINK_MARKER"

  copy_skill_install_entries "$source" "$target"

  return 0
}

# Drift engine. Reports whether an installed skill still matches canonical.
# Prints a tab-separated line: "<status>\t<recorded_version>\t<current_version>"
# where status is one of:
#   ok             installed copy matches the canonical source content
#   stale          canonical source content changed since install (track-latest)
#   unknown        pre-upgrade marker has no source_sha; run refresh to enable tracking
#   missing-source canonical source path recorded in the marker no longer exists
#   pinned         symlinked install (frozen to archive/<version>); never stale
#   not-managed    target is not a repo-managed skill install
#
# Scope note: this detects "canonical moved", not local edits to the install
# itself (the target diverging from its own copy-time source). The latter is
# intentionally out of scope.
skill_install_status() {
  local target="$1"

  if [[ -L "$target" ]]; then
    local link_src ver=""
    link_src="$(readlink "$target")"
    ver="$(skill_source_version "$link_src" 2>/dev/null || true)"
    printf '%s\t%s\t%s\n' "pinned" "$ver" "$ver"
    return 0
  fi

  if ! is_managed_skill_dir "$target"; then
    printf '%s\t\t\n' "not-managed"
    return 0
  fi

  local source recorded_sha recorded_ver current_sha current_ver
  source="$(managed_marker_field "$target" source)"
  recorded_sha="$(managed_marker_field "$target" source_sha)"
  recorded_ver="$(managed_marker_field "$target" source_version)"

  if [[ -z "$source" || ! -d "$source" ]]; then
    printf '%s\t%s\t\n' "missing-source" "$recorded_ver"
    return 0
  fi

  current_ver="$(skill_source_version "$source" 2>/dev/null || true)"

  if [[ -z "$recorded_sha" ]]; then
    printf '%s\t%s\t%s\n' "unknown" "$recorded_ver" "$current_ver"
    return 0
  fi

  current_sha="$(skill_content_sha "$source" 2>/dev/null || true)"
  if [[ "$recorded_sha" == "$current_sha" ]]; then
    printf '%s\t%s\t%s\n' "ok" "$recorded_ver" "$current_ver"
  else
    printf '%s\t%s\t%s\n' "stale" "$recorded_ver" "$current_ver"
  fi
  return 0
}
