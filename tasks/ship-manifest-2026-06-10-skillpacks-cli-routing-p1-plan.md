# Ship Manifest - Skillpacks CLI Routing P1 Plan

## User Goal

Finish `$ship` by preparing the next concrete project step after packaging prompt-history reconciliation work.

## Changed Files

- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-cli-routing-p1-plan.md`

## Per-File Purpose

- `tasks/todo.md`: adds the next executable implementation plan for P1 Skillpacks CLI routing remediation.
- `tasks/roadmap.md`: records the full plan and acceptance criteria for the same next step.
- `tasks/history.md`: records that the next remediation task was prepared.
- `tasks/ship-manifest-2026-06-10-skillpacks-cli-routing-p1-plan.md`: documents the task-planning shipping boundary.

## User-Goal Mapping

- `$ship` requires preparing the next actionable project step after shipping current work.
- The just-shipped audit in `research/skillpack-cli-routing-audit.md` identified the concrete next step: update P1 global skill install-route wording for the published npm CLI.

## Tests Run

- `git diff --check` - passed.
- Staged boundary review: `git diff --cached --name-only` and `git diff --cached --stat` matched the intended four files.
- `git diff --cached --check` - passed.

## Skipped Tests

- Source, skill integrity, generated-data, app build, and package tests are intentionally deferred to the next `$exec` implementation step because this boundary only writes the plan.
- Production deploy is skipped because this task-plan boundary has no app/runtime/deploy surface and production deploys require explicit confirmation.

## Adversarial Review

- Based the next step on `research/skillpack-cli-routing-audit.md` rather than inventing new scope.
- Kept implementation out of this `$ship` planning commit.
- Included version/archive/changelog and Skills Showcase refresh requirements so the future source mutation cannot skip repository skill contracts.

## Residual Risk

The P1 plan may need adjustment if a future `$exec` finds individual global skills have source-checkout-only wording that should stay exempt. The plan explicitly tells the executor to preserve local `scripts/pack.sh` wording where it is intentionally about repo maintenance.

## Rollback Note

Revert this commit to remove only the task-plan handoff. It does not change source or runtime behavior.

## Next Command

`$exec`
