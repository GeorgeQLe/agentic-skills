---
name: regression-check
description: Run a comprehensive health check across the monorepo after completing a phase or major change
type: review
version: 1.0.0
---

# Regression Check

Invoke as `$regression-check`.

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

If the verdict is "Issues found", write **new** actionable failures (not pre-existing) to `tasks/todo.md` under a `## Regression Fixes` heading (append or replace existing section). One checkbox per failure with file path and error. If a finding is a non-blocking future validation or depends on unavailable data/access, write it to `tasks/record-todo.md` instead. If verdict is "All clear", do not write to todo. Suggest `$investigate` or `$run` to start fixing concrete failures.

## Constraints

- Do not fix issues automatically — only report and write todo items.
- Skip unavailable check commands and note them.
- Clearly distinguish new regressions from pre-existing issues.


## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/regression-check-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/regression-check-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/regression-check-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
