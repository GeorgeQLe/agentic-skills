#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

pass=0
fail=0
errors=()

while IFS= read -r file; do
  skill_name="$(basename "$(dirname "$file")")"

  # Check for new contract markers
  for marker in "Full content requirement" "Interactive Q&A" "Compile Answers" "Diff highlighting"; do
    if ! grep -q "$marker" "$file"; then
      errors+=("$file: missing marker '$marker'")
      fail=$((fail + 1))
      continue 2
    fi
  done

  # Check correct skill name in alignment path
  if ! grep -q "alignment/${skill_name}-{topic}.html" "$file"; then
    errors+=("$file: wrong skill name in alignment path (expected '$skill_name')")
    fail=$((fail + 1))
    continue
  fi

  # Check absence of old contract text
  for old_text in "treat the HTML page as a review preview" "Do not use a shared template or CSS framework"; do
    if grep -q "$old_text" "$file"; then
      errors+=("$file: still contains old contract text '$old_text'")
      fail=$((fail + 1))
      continue 2
    fi
  done

  pass=$((pass + 1))
done < <(grep -rl "Alignment Page" --include="SKILL.md" . | sort)

echo "Pass: $pass"
echo "Fail: $fail"
if [[ ${#errors[@]} -gt 0 ]]; then
  echo ""
  echo "Errors:"
  for e in "${errors[@]}"; do
    echo "  $e"
  done
  exit 1
fi
echo "All checks passed."
