---
name: dead-code
description: Scan for unused exports, unreachable code, orphaned files, and stale dependencies
type: analysis
version: v0.2
release_lane: canary
required_conventions: [alignment-page, briefing-slides]
---

# Dead Code

Invoke as `$dead-code`.

Use this skill when the user wants to identify unused code, orphaned files, or stale dependencies for cleanup.

## Process

1. Determine scope (specific package or entire project).
2. Scan for unused exports by cross-referencing imports.
3. Scan for orphaned files not imported anywhere.
4. Scan for stale package.json dependencies.
5. Scan for dead code patterns (unreachable code, commented-out blocks).
6. Cross-reference with git history for staleness.
7. Verify findings (false-positive filter):
   - Re-read actual source code for every flagged item. Confirm: exports are genuinely unused (check barrel files, dynamic imports), orphaned files aren't consumed by tools/frameworks, stale dependencies aren't used implicitly (plugins, peer deps, CLI tools in scripts).
   - Drop any finding you cannot re-confirm on second read. If uncertain, move to "Needs Investigation" instead of "Safe to Remove."

## Output

- **Unused Exports**: file, export name, last modified
- **Orphaned Files**: files not imported anywhere
- **Stale Dependencies**: unused packages
- **Dead Code Patterns**: unreachable code, commented blocks
- **Safe to Remove**: prioritized cleanup list

## Follow-Through

After presenting findings, write "Safe to Remove" items to `tasks/todo.md` under a `## Dead Code Cleanup` heading (append or replace existing section). One checkbox per item. Do not add "Needs Investigation" items. If a finding is only a non-blocking future validation or condition-gated cleanup record, write it to `tasks/record-todo.md` instead with source, condition, non-blocking reason, evidence, and promotion rule. Suggest `$exec` to execute concrete cleanup.

## Constraints

- Never automatically delete anything — only report and write todo items.
- Be conservative with false positives.
- Exclude entry points, config files, and tool-consumed files.



## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/dead-code-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `$dead-code`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/dead-code-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
