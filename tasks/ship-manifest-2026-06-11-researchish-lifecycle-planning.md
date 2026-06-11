# Ship Manifest - Research-ish Lifecycle Planning

## User Goal

Run `$exec` for the next incomplete task: add task plan artifacts for the Research-ish Skill Lifecycle Audit without overwriting unrelated local task or prompt changes.

## Changed Files

- `prompts/exec/skill-prompt-20260610-204536-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-researchish-lifecycle-planning.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260610-204536-exec.md`: captures the visible `$exec` invocation and pasted skill context.
- `tasks/todo.md`: marks the planning artifact step complete and expands the next implementation step with concrete script behavior, read-only mode requirements, inventory scope, lifecycle signals, category definitions, JSON output expectations, and a guard against ad hoc remediation.
- `tasks/history.md`: records the planning-only boundary and the existing local untracked audit script.
- `tasks/ship-manifest-2026-06-11-researchish-lifecycle-planning.md`: documents this exact shipping boundary.

## User-Goal Mapping

- The selected `$exec` step is complete: task plan artifacts now tell the next executor how to implement the audit script safely.
- The plan explicitly preserves local work by telling the next executor to inspect and reuse the existing untracked `scripts/researchish-skill-lifecycle-audit.mjs` rather than overwriting it.
- No executable source, active skill contract, generated bundle, package metadata, or runtime surface is changed in this boundary.

## Tests Run

- `git diff --check` - passed with no whitespace errors.
- Diff and status review - confirmed the staged boundary is prompt/task/history/manifest docs only; the existing untracked audit script remains unstaged.

## Skipped Tests

- Layer1, package, and app builds were skipped because this boundary changes only task and prompt documentation.
- The existing untracked `scripts/researchish-skill-lifecycle-audit.mjs` was not executed as validation for this boundary because the selected step is planning-only and does not ship the script.
- Skills Showcase generation was skipped because no active `SKILL.md` or `PACK.md` file changed.
- Deploy was skipped because this boundary has no deployable runtime surface and production deploys require explicit confirmation.

## Adversarial Review

- Confirmed `tasks/roadmap.md` and the active `tasks/todo.md` already contain the Research-ish Skill Lifecycle Audit scope and acceptance criteria.
- Detected the existing untracked audit script before editing task docs and avoided overwriting or staging it.
- Checked the next implementation step now includes enough detail to proceed from `tasks/todo.md` alone: command modes, inventory roots, lifecycle signals, classification categories, expected JSON detail, and no-remediation guard.
- Scoped this boundary to planning artifacts only, keeping implementation, report generation, tests, and remediation as later explicit steps.

## Residual Risk

`scripts/researchish-skill-lifecycle-audit.mjs` remains untracked local work. The next `$exec` should inspect it first and decide whether to reuse, complete, or replace it within the implementation step.

## Rollback Note

Revert this commit to remove the planning-step completion notes, prompt capture, history entry, and ship manifest. The untracked local audit script is outside this commit and would need separate handling if rollback intent includes local workspace cleanup.

## Next Command

`$exec`
