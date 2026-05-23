#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: skill-archive.sh <skill-dir>"
  echo ""
  echo "Archives the current SKILL.md into archive/<version>/SKILL.md"
  echo "before a version bump."
  echo ""
  echo "Example: bash scripts/skill-archive.sh global/claude/ship"
  exit 0
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" || -z "${1:-}" ]]; then
  usage
fi

SKILL_DIR="${1%/}"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! "$SKILL_DIR" = /* ]]; then
  SKILL_DIR="$REPO_ROOT/$SKILL_DIR"
fi

SKILL_FILE="$SKILL_DIR/SKILL.md"
[[ -f "$SKILL_FILE" ]] || die "No SKILL.md found at $SKILL_DIR"

version=""
in_frontmatter=false
while IFS= read -r line; do
  if [[ "$line" == "---" ]]; then
    if $in_frontmatter; then
      break
    fi
    in_frontmatter=true
    continue
  fi
  if $in_frontmatter; then
    if [[ "$line" =~ ^version:[[:space:]]*(.+)$ ]]; then
      version="${BASH_REMATCH[1]}"
      version="${version%\"}"
      version="${version#\"}"
      version="$(echo "$version" | xargs)"
      break
    fi
  fi
done < "$SKILL_FILE"

[[ -n "$version" ]] || die "No version: field found in $SKILL_FILE frontmatter"

ARCHIVE_DIR="$SKILL_DIR/archive/$version"

if [[ -f "$ARCHIVE_DIR/SKILL.md" ]]; then
  die "Archive already exists at $ARCHIVE_DIR/SKILL.md"
fi

mkdir -p "$ARCHIVE_DIR"
cp "$SKILL_FILE" "$ARCHIVE_DIR/SKILL.md"

echo "Archived $version -> $(echo "$ARCHIVE_DIR" | sed "s|$REPO_ROOT/||")/SKILL.md"
echo "Now bump the version in $SKILL_FILE and update CHANGELOG.md"
