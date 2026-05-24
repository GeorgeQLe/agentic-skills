#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SKIP_LIST="$REPO_ROOT/scripts/alignment-skip-list.txt"
declare -A skip_skills=()
if [[ -f "$SKIP_LIST" ]]; then
  while IFS= read -r line; do
    line="${line%%#*}"
    line="${line// /}"
    [[ -z "$line" ]] && continue
    skip_skills["$line"]=1
  done < "$SKIP_LIST"
fi

replaced=0
skipped=0
skip_filtered=0
warnings=()

generate_new_section() {
  local heading_level="$1"
  local skill_name="$2"

  cat <<BLOCK
${heading_level} Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at \`alignment/${skill_name}-{topic}.html\`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to \`docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/${skill_name}-{topic}.html\`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.
BLOCK
}

while IFS= read -r file; do
  skill_name="$(basename "$(dirname "$file")")"

  if [[ -n "${skip_skills[$skill_name]+x}" ]]; then
    skip_filtered=$((skip_filtered + 1))
    continue
  fi

  # Detect heading level
  if grep -q "^## Alignment Page$" "$file"; then
    heading_level="##"
  elif grep -q "^### Alignment Page$" "$file"; then
    heading_level="###"
  else
    warnings+=("$file: no alignment page heading found")
    skipped=$((skipped + 1))
    continue
  fi

  heading_line_num=$(grep -n "^${heading_level} Alignment Page$" "$file" | head -1 | cut -d: -f1)

  # Determine heading depth for boundary detection
  heading_depth=$(echo "$heading_level" | wc -c)  # "## " = 3 chars for ##
  heading_hashes="${heading_level}"

  # Find the next heading at same or higher level (fewer or equal #'s)
  # Build a regex that matches headings with 1 to N hashes (where N = length of current heading)
  num_hashes=${#heading_hashes}
  if [[ $num_hashes -eq 2 ]]; then
    next_heading_pattern="^##\\? [^ ]"  # matches # or ##
    # Actually, we need to match ^# or ^## but not ^### or more
    next_heading_pattern="^#\\{1,${num_hashes}\\} [^#]"
  else
    next_heading_pattern="^#\\{1,${num_hashes}\\} [^#]"
  fi

  # Find next section boundary: a heading at same or higher level after the alignment heading
  total_lines=$(wc -l < "$file")
  next_section_line=""

  # Search from the line after the heading to EOF
  tail_start=$((heading_line_num + 1))
  if [[ $tail_start -le $total_lines ]]; then
    # Use awk to find first heading at same-or-higher level
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

  # Determine the range to replace
  if [[ -n "$next_section_line" ]]; then
    # Replace from heading_line_num to the line before next_section_line
    # But preserve trailing blank lines before the next section
    # Find the last non-blank line before next_section_line
    end_line=$((next_section_line - 1))
    # Strip trailing blank lines from the section
    while [[ $end_line -gt $heading_line_num ]]; do
      line_content=$(sed -n "${end_line}p" "$file")
      if [[ -n "$line_content" ]]; then
        break
      fi
      ((end_line--))
    done
  else
    # Section goes to EOF — find last non-blank line
    end_line=$total_lines
    while [[ $end_line -gt $heading_line_num ]]; do
      line_content=$(sed -n "${end_line}p" "$file")
      if [[ -n "$line_content" ]]; then
        break
      fi
      ((end_line--))
    done
  fi

  new_section="$(generate_new_section "$heading_level" "$skill_name")"

  if $DRY_RUN; then
    echo "[dry-run] Would replace $file (lines ${heading_line_num}-${end_line})"
    replaced=$((replaced + 1))
    continue
  fi

  # Build the new file content
  {
    # Lines before the alignment section
    if [[ $heading_line_num -gt 1 ]]; then
      head -n $((heading_line_num - 1)) "$file"
    fi
    # New section content
    echo "$new_section"
    # Lines after the section (including the blank separator)
    if [[ -n "$next_section_line" ]]; then
      # Ensure there's a blank line before the next section
      echo ""
      tail -n +$((next_section_line)) "$file"
    else
      # EOF — add trailing newline
      echo ""
    fi
  } > "${file}.tmp"

  mv "${file}.tmp" "$file"
  replaced=$((replaced + 1))

done < <(find . -name "SKILL.md" \( -path "*/claude/*" -o -path "*/codex/*" \) | sort)

echo ""
echo "Replaced: $replaced"
echo "Skipped (no heading): $skipped"
echo "Skipped (skip-list): $skip_filtered"
if [[ ${#warnings[@]} -gt 0 ]]; then
  echo "Warnings:"
  for w in "${warnings[@]}"; do
    echo "  $w"
  done
fi
