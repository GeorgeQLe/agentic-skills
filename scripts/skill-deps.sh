#!/usr/bin/env bash
set -euo pipefail

# Skill dependency graph — discovers cross-references between skills
# Usage: skill-deps.sh [--broken|--dot|--json]

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

MODE="${1:-default}"

# 1. Discover valid skill names from base skills and pack skills.
declare -A VALID_SKILLS
mapfile -t SKILL_DIRS < <(
  find "$REPO_ROOT/packs" \
    -mindepth 2 -type f -name SKILL.md 2>/dev/null \
    -not -path '*/archive/*' \
    | sed 's#/SKILL.md$##' \
    | sort
)

for dir in "${SKILL_DIRS[@]}"; do
  name="$(basename "$dir")"
  if [[ -f "$dir/SKILL.md" ]]; then
    VALID_SKILLS["$name"]=1
  fi
done

# 2. For each SKILL.md, extract /skill-name and $skill-name refs using PCRE regex
declare -A DEPS       # skill -> "dep1 dep2 dep3"
declare -A BROKEN     # skill -> "bad1 bad2"
declare -A IGNORED_REFS=(
  # Runner/session commands, not skill directories.
  [reload-skills]=1
  [clear]=1

  # Placeholders, path fragments, or route examples that look slash-prefixed.
  [path]=1
  [glob]=1
  [tmp]=1
  [skill-name]=1
  [reports]=1
  [research]=1
  [benchmarks]=1
  [plan]=1
  [freeform]=1

  # Explicitly negative, hibernated, or future route names documented in skills.
  [analyze-session]=1
  [exec-kanban]=1
  [ship-kanban]=1
  [ship-end-kanban]=1
  [mono-migrate]=1

  # Pack name used in prose; there is no direct /code-review skill command.
  [code-review]=1
)
TOTAL_SKILLS=0
SKILLS_WITH_DEPS=0
BROKEN_COUNT=0

for dir in "${SKILL_DIRS[@]}"; do
  name="$(basename "$dir")"
  skill_file="$dir/SKILL.md"
  [[ -f "$skill_file" ]] || continue
  TOTAL_SKILLS=$((TOTAL_SKILLS + 1))

  # Extract refs with PCRE lookarounds.
  # Match Claude `/skill-name` and Codex `$skill-name` references only when they
  # appear in command-like contexts, not inside file paths, HTML tags, or units.
  refs=$(grep -oPh '(?:(?<=^)|(?<=[[:space:]`"'\''(|>:,]))(?:/[a-z][a-z0-9-]+|\$[a-z][a-z0-9-]+)(?![a-zA-Z0-9_/.:\-*]|\])' "$skill_file" 2>/dev/null || true)

  # Deduplicate and process
  seen_deps=""
  seen_broken=""
  while IFS= read -r ref; do
    [[ -z "$ref" ]] && continue
    dep="${ref#/}"  # strip leading / if present
    dep="${dep#\$}" # strip leading $ if present

    # Skip self-references
    [[ "$dep" == "$name" ]] && continue
    [[ "$dep" == "skill" ]] && continue
    [[ -n "${IGNORED_REFS[$dep]+x}" ]] && continue

    # Deduplicate
    if [[ " $seen_deps $seen_broken " == *" $dep "* ]]; then
      continue
    fi

    if [[ -n "${VALID_SKILLS[$dep]+x}" ]]; then
      seen_deps="$seen_deps $dep"
    else
      seen_broken="$seen_broken $dep"
      BROKEN_COUNT=$((BROKEN_COUNT + 1))
    fi
  done <<< "$refs"

  seen_deps="${seen_deps# }"
  seen_broken="${seen_broken# }"

  if [[ -n "$seen_deps" ]]; then
    DEPS["$name"]="$seen_deps"
    SKILLS_WITH_DEPS=$((SKILLS_WITH_DEPS + 1))
  fi
  if [[ -n "$seen_broken" ]]; then
    BROKEN["$name"]="$seen_broken"
    # Count deps too if there were also valid ones but we didn't count yet
    if [[ -z "${DEPS[$name]+x}" ]]; then
      SKILLS_WITH_DEPS=$((SKILLS_WITH_DEPS + 1))
      DEPS["$name"]=""
    fi
  fi
done

# 3. Output based on mode
case "$MODE" in
  --broken)
    if [[ $BROKEN_COUNT -eq 0 ]]; then
      echo "No broken references found."
    else
      for skill in $(echo "${!BROKEN[@]}" | tr ' ' '\n' | sort); do
        for dep in ${BROKEN[$skill]}; do
          echo "$skill -> $dep (not found)"
        done
      done
    fi
    ;;

  --dot)
    echo "digraph skills {"
    echo "  rankdir=LR;"
    echo "  node [shape=box, style=rounded];"
    for skill in $(echo "${!DEPS[@]}" | tr ' ' '\n' | sort); do
      for dep in ${DEPS[$skill]}; do
        echo "  \"$skill\" -> \"$dep\";"
      done
    done
    # Show broken refs with dashed red edges
    for skill in $(echo "${!BROKEN[@]}" | tr ' ' '\n' | sort); do
      for dep in ${BROKEN[$skill]}; do
        echo "  \"$skill\" -> \"$dep\" [style=dashed, color=red];"
      done
    done
    echo "}"
    ;;

  --json)
    echo "{"
    echo "  \"skills\": {"
    first_skill=true
    for skill in $(echo "${!DEPS[@]}" ${!BROKEN[@]+"${!BROKEN[@]}"} | tr ' ' '\n' | sort -u); do
      if [[ "$first_skill" == true ]]; then
        first_skill=false
      else
        echo ","
      fi
      deps_json="[]"
      if [[ -n "${DEPS[$skill]+x}" && -n "${DEPS[$skill]}" ]]; then
        deps_json="[$(echo "${DEPS[$skill]}" | tr ' ' '\n' | sort | sed 's/.*/"&"/' | paste -sd,)]"
      fi
      broken_json="[]"
      if [[ -n "${BROKEN[$skill]+x}" && -n "${BROKEN[$skill]}" ]]; then
        broken_json="[$(echo "${BROKEN[$skill]}" | tr ' ' '\n' | sort | sed 's/.*/"&"/' | paste -sd,)]"
      fi
      printf '    "%s": {"deps": %s, "broken": %s}' "$skill" "$deps_json" "$broken_json"
    done
    echo ""
    echo "  },"
    echo "  \"summary\": {"
    echo "    \"total_skills\": $TOTAL_SKILLS,"
    echo "    \"skills_with_deps\": $SKILLS_WITH_DEPS,"
    echo "    \"broken_refs\": $BROKEN_COUNT"
    echo "  }"
    echo "}"
    ;;

  default|"")
    # Dependency graph
    for skill in $(echo "${!DEPS[@]}" | tr ' ' '\n' | sort); do
      deps_str="${DEPS[$skill]}"
      if [[ -n "$deps_str" ]]; then
        echo "$skill -> $(echo "$deps_str" | tr ' ' ', ')"
      fi
    done

    # Broken refs
    if [[ $BROKEN_COUNT -gt 0 ]]; then
      echo ""
      echo "BROKEN REFERENCES:"
      for skill in $(echo "${!BROKEN[@]}" | tr ' ' '\n' | sort); do
        for dep in ${BROKEN[$skill]}; do
          echo "  $skill -> $dep (not found)"
        done
      done
    fi

    # Summary
    echo ""
    echo "Summary: $TOTAL_SKILLS skills, $SKILLS_WITH_DEPS with dependencies, $BROKEN_COUNT broken refs"
    ;;

  *)
    echo "Usage: $0 [--broken|--dot|--json]" >&2
    exit 2
    ;;
esac

# Exit code: 1 if broken refs found
if [[ $BROKEN_COUNT -gt 0 ]]; then
  exit 1
fi
