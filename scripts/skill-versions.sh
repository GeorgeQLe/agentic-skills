#!/usr/bin/env bash
set -euo pipefail

# Skill version audit — lists versions from base skills and pack skills.
# Usage: skill-versions.sh [--json|--missing]

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-default}"

declare -A VERSIONS
TOTAL=0
VERSIONED=0
MISSING=0
MISSING_NAMES=()

mapfile -t SKILL_FILES < <(
  find "$REPO_ROOT/packs" \
    -mindepth 2 -maxdepth 5 -type f -name SKILL.md 2>/dev/null \
    | sort
)

for skill_file in "${SKILL_FILES[@]}"; do
  rel="${skill_file#$REPO_ROOT/}"
  key="${rel%/SKILL.md}"
  TOTAL=$((TOTAL + 1))

  version=$(awk '
    /^---$/ {
      frontmatter += 1
      if (frontmatter == 2) {
        exit
      }
      next
    }
    frontmatter == 1 && /^version:[[:space:]]*/ {
      sub(/^version:[[:space:]]*/, "")
      print
      exit
    }
  ' "$skill_file")

  if [[ -n "$version" ]]; then
    VERSIONS["$key"]="$version"
    VERSIONED=$((VERSIONED + 1))
  else
    VERSIONS["$key"]=""
    MISSING=$((MISSING + 1))
    MISSING_NAMES+=("$key")
  fi
done

case "$MODE" in
  --json)
    echo "{"
    echo "  \"skills\": {"
    first=true
    for skill in $(printf '%s\n' "${!VERSIONS[@]}" | sort); do
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
      printf '%s\n' "${MISSING_NAMES[@]}" | sort
    fi
    ;;

  default|"")
    for skill in $(printf '%s\n' "${!VERSIONS[@]}" | sort); do
      ver="${VERSIONS[$skill]}"
      if [[ -n "$ver" ]]; then
        printf "%-60s v%s\n" "$skill" "$ver"
      else
        printf "%-60s (missing)\n" "$skill"
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
