#!/usr/bin/env bash
set -euo pipefail

# Skill next-step routing audit.
# Usage: skill-next-step-routing.sh [--missing|--list]

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:---missing}"

mapfile -t SKILL_FILES < <(
  find "$REPO_ROOT/global" "$REPO_ROOT/packs" \
    -mindepth 2 -maxdepth 5 -type f -name SKILL.md 2>/dev/null \
    | sort
)

is_mutation_capable() {
  local file="$1"

  grep -Eq \
    'Default Shipping Contract|If this skill creates or modifies tracked repository files|Write or update `|write or update `|Only after confirmation, write|Only after the user validates, write|Apply the fix|Apply fixes|create/update|create or update|mutations?:|mutation or broad refactor|Behavior-preserving refactor|finish by committing and pushing|moves? .*card|create .*card|update .*card|archive .*card' \
    "$file"
}

has_next_step_routing() {
  local file="$1"

  grep -Eq \
    'Recommended next skill:|Recommended next command:|Recommended next step|\*\*Recommended next command:\*\*|\*\*Next work:\*\*|## Next Steps|## Next-Step Routing|## Next-Skill Routing' \
    "$file"
}

MUTATION_COUNT=0
MISSING=()

for skill_file in "${SKILL_FILES[@]}"; do
  rel="${skill_file#$REPO_ROOT/}"

  if ! is_mutation_capable "$skill_file"; then
    continue
  fi

  MUTATION_COUNT=$((MUTATION_COUNT + 1))

  if ! has_next_step_routing "$skill_file"; then
    MISSING+=("$rel")
  fi
done

case "$MODE" in
  --missing)
    if [[ ${#MISSING[@]} -eq 0 ]]; then
      echo "All $MUTATION_COUNT mutation-capable skills have next-step routing."
    else
      printf '%s\n' "${MISSING[@]}"
    fi
    ;;

  --list)
    for skill_file in "${SKILL_FILES[@]}"; do
      if is_mutation_capable "$skill_file"; then
        rel="${skill_file#$REPO_ROOT/}"
        printf '%s\n' "$rel"
      fi
    done
    ;;

  *)
    echo "Usage: $0 [--missing|--list]" >&2
    exit 2
    ;;
esac

if [[ ${#MISSING[@]} -gt 0 ]]; then
  exit 1
fi
