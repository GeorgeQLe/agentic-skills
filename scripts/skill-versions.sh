#!/usr/bin/env bash
set -euo pipefail

# Skill version audit — lists versions from claude/*/SKILL.md frontmatter
# Usage: skill-versions.sh [--json|--missing]

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_DIR="$REPO_ROOT/claude"

MODE="${1:-default}"

declare -A VERSIONS
TOTAL=0
VERSIONED=0
MISSING=0
MISSING_NAMES=()

for dir in "$CLAUDE_DIR"/*/; do
  name="$(basename "$dir")"
  skill_file="$dir/SKILL.md"
  [[ -f "$skill_file" ]] || continue
  TOTAL=$((TOTAL + 1))

  # Extract version from frontmatter (between first --- pair)
  version=$(sed -n '/^---$/,/^---$/{ /^version:/{ s/^version:[[:space:]]*//; p; q; } }' "$skill_file")

  if [[ -n "$version" ]]; then
    VERSIONS["$name"]="$version"
    VERSIONED=$((VERSIONED + 1))
  else
    VERSIONS["$name"]=""
    MISSING=$((MISSING + 1))
    MISSING_NAMES+=("$name")
  fi
done

case "$MODE" in
  --json)
    echo "{"
    echo "  \"skills\": {"
    first=true
    for skill in $(echo "${!VERSIONS[@]}" | tr ' ' '\n' | sort); do
      if [[ "$first" == true ]]; then
        first=false
      else
        echo ","
      fi
      ver="${VERSIONS[$skill]}"
      if [[ -n "$ver" ]]; then
        printf '    "%s": "%s"' "$skill" "$ver"
      else
        printf '    "%s": null' "$skill"
      fi
    done
    echo ""
    echo "  },"
    echo "  \"summary\": {"
    echo "    \"total\": $TOTAL,"
    echo "    \"versioned\": $VERSIONED,"
    echo "    \"missing\": $MISSING"
    echo "  }"
    echo "}"
    ;;

  --missing)
    if [[ $MISSING -eq 0 ]]; then
      echo "All $TOTAL skills have a version field."
    else
      for name in $(printf '%s\n' "${MISSING_NAMES[@]}" | sort); do
        echo "$name"
      done
    fi
    ;;

  default|"")
    for skill in $(echo "${!VERSIONS[@]}" | tr ' ' '\n' | sort); do
      ver="${VERSIONS[$skill]}"
      if [[ -n "$ver" ]]; then
        printf "%-30s v%s\n" "$skill" "$ver"
      else
        printf "%-30s (missing)\n" "$skill"
      fi
    done
    echo ""
    echo "Summary: $TOTAL skills, $VERSIONED versioned, $MISSING missing"
    ;;

  *)
    echo "Usage: $0 [--json|--missing]" >&2
    exit 2
    ;;
esac

if [[ $MISSING -gt 0 ]]; then
  exit 1
fi
