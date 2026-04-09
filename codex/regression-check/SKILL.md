---
name: regression-check
description: Run a comprehensive health check across the monorepo after completing a phase or major change
---

# Regression Check

Use this skill after completing a phase or major change to verify nothing is broken.

## Workflow

1. Determine scope (specific package or entire project).
2. Run type checking, lint, tests, and build in parallel where possible.
3. Check for broken imports and circular dependencies.
4. Verify environment variable documentation.
5. Compare results against baseline to distinguish new vs. pre-existing issues.

## Output Format

- **Health Check Table**: status for each check category
- **Failures**: detailed list with file paths
- **Regressions vs. Pre-existing**: what's new vs. what was already broken
- **Verdict**: all clear or issues to fix

## Follow-Through

If the verdict is "Issues found", write **new** failures (not pre-existing) to `tasks/todo.md` under a `## Regression Fixes` heading (append or replace existing section). One checkbox per failure with file path and error. If verdict is "All clear", do not write to todo. Suggest `$investigate` or `$run` to start fixing.

## Constraints

- Do not fix issues automatically — only report and write todo items.
- Skip unavailable check commands and note them.
- Clearly distinguish new regressions from pre-existing issues.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
