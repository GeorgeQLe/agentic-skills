#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SKIP_LIST="$REPO_ROOT/scripts/alignment-skip-list.txt"
if [[ ! -f "$SKIP_LIST" ]]; then
  echo "Error: $SKIP_LIST not found"
  exit 1
fi

declare -A skip_skills=()
while IFS= read -r line; do
  line="${line%%#*}"
  line="${line// /}"
  [[ -z "$line" ]] && continue
  skip_skills["$line"]=1
done < "$SKIP_LIST"

stripped=0
already_clean=0

while IFS= read -r file; do
  skill_name="$(basename "$(dirname "$file")")"

  [[ -z "${skip_skills[$skill_name]+x}" ]] && continue

  if grep -q "^## Alignment Page$" "$file"; then
    heading_level="##"
  elif grep -q "^### Alignment Page$" "$file"; then
    heading_level="###"
  else
    already_clean=$((already_clean + 1))
    continue
  fi

  num_hashes=${#heading_level}
  heading_line_num=$(grep -n "^${heading_level} Alignment Page$" "$file" | head -1 | cut -d: -f1)
  total_lines=$(wc -l < "$file")

  tail_start=$((heading_line_num + 1))
  next_section_line=""
  if [[ $tail_start -le $total_lines ]]; then
    next_section_line=$(awk -v start="$tail_start" -v max_hashes="$num_hashes" '
      NR >= start {
        if (/^#+/) {
          match($0, /^#+/)
          n = RLENGTH
          if (n <= max_hashes) {
            print NR
            exit
          }
        }
      }
    ' "$file")
  fi

  if $DRY_RUN; then
    echo "[dry-run] Would strip alignment section from $file (line $heading_line_num)"
    stripped=$((stripped + 1))
    continue
  fi

  {
    if [[ $heading_line_num -gt 1 ]]; then
      head -n $((heading_line_num - 1)) "$file"
    fi
    if [[ -n "$next_section_line" ]]; then
      tail -n +$((next_section_line)) "$file"
    fi
  } > "${file}.tmp"

  mv "${file}.tmp" "$file"
  stripped=$((stripped + 1))

done < <(find . -name "SKILL.md" \( -path "*/claude/*" -o -path "*/codex/*" \) | sort)

echo ""
echo "Stripped: $stripped"
echo "Already clean: $already_clean"
