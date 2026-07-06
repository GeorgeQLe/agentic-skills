---
name: regression-check
description: Run a comprehensive health check across the monorepo after completing a phase or major change
type: review
version: v0.2
required_conventions: [alignment-page, briefing-slides]
---

# Regression Check

Invoke as `$regression-check`.

Use this skill after completing a phase or major change to verify nothing is broken.

## Process

1. Determine scope (specific package or entire project).
2. Run type checking, lint, tests, and build in parallel where possible.
3. Check for broken imports and circular dependencies.
4. Verify environment variable documentation.
5. Compare results against baseline to distinguish new vs. pre-existing issues.

## Output

- **Health Check Table**: status for each check category
- **Failures**: detailed list with file paths
- **Regressions vs. Pre-existing**: what's new vs. what was already broken
- **Verdict**: all clear or issues to fix

## Follow-Through

If the verdict is "Issues found", write **new** actionable failures (not pre-existing) to `tasks/todo.md` under a `## Regression Fixes` heading (append or replace existing section). One checkbox per failure with file path and error. If a finding is a non-blocking future validation or depends on unavailable data/access, write it to `tasks/record-todo.md` instead. If verdict is "All clear", do not write to todo. Suggest `$investigate` or `$exec` to start fixing concrete failures.

## Constraints

- Do not fix issues automatically — only report and write todo items.
- Skip unavailable check commands and note them.
- Clearly distinguish new regressions from pre-existing issues.



## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/regression-check-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `$regression-check`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/regression-check-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
