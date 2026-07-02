---
name: regression-check
description: Run a comprehensive health check across the monorepo after completing a phase or major change
type: review
version: v0.1
required_conventions: [alignment-page]
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


## Alignment Page

Follow `ALIGNMENT-PAGE.md` in this skill's directory for alignment-page requirements and output path.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
