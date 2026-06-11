# Ship Manifest - Skillpacks CLI Routing Remediation Plan

## User Goal

Implement the supplied roadmap plan by scheduling the full Skillpacks CLI routing remediation and making the next executable task the canonical wording plus validation slice, not the whole 220-skill migration.

## Changed Files

- `prompts/pack/skill-prompt-20260610-200538-skillpacks-routing-remediation.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-cli-routing-remediation-plan.md`

## Per-File Purpose

- `prompts/pack/skill-prompt-20260610-200538-skillpacks-routing-remediation.md`: captures the visible pack-skill invocation and pasted plan context.
- `tasks/roadmap.md`: replaces the P1-only handoff with the full audit-scoped remediation program.
- `tasks/todo.md`: scopes the immediate next work to canonical wording and validation design/implementation.
- `tasks/history.md`: records this planning correction.
- `tasks/ship-manifest-2026-06-10-skillpacks-cli-routing-remediation-plan.md`: documents the shipping boundary.

## User-Goal Mapping

- The roadmap references `research/skillpack-cli-routing-audit.md` and schedules all 220 flagged active skills.
- The remediation phases separate canonical wording/validation, P1 globals, P2 repeated guard boilerplate, P3 bespoke follow-up sections, and final validation/shipping.
- The todo preserves `/pack`, `$pack`, and `scripts/pack.sh` routes while requiring npm CLI alternatives and deck-install distinction.

## Tests Run

- `git diff --check` - passed.
- Targeted `tasks/roadmap.md` scan confirmed the remediation phase, audit reference, 220-skill scope, P1/P2/P3 sequencing, source-checkout route, and deck-install route.
- Targeted `tasks/todo.md` scan confirmed the canonical wording and validation slice, including `/pack`, `$pack`, `scripts/pack.sh`, `npx skillpacks install`, and `npx skillpacks install-deck` guidance.

## Skipped Tests

- Source, skill integrity, generated-data, app build, and package tests are intentionally skipped because this boundary only changes planning, prompt-history, and shipping metadata.
- Skills Showcase refresh is not required because no `SKILL.md` metadata or content changed.
- Production deploy is skipped because this change has no app/runtime/deploy surface.

## Adversarial Review

- Corrected the prior P1-only plan instead of starting broad `SKILL.md` edits.
- Kept implementation out of this planning commit.
- Required version archives, version bumps, and changelogs for future `SKILL.md` remediation batches.

## Residual Risk

The future validation slice still needs to decide whether the npm-route check belongs in a new focused script, a layer1 test, or a carefully scoped extension of `scripts/skill-pack-routing-audit.sh`.

## Rollback Note

Revert this commit to restore the previous P1-only planning handoff. It does not change source or runtime behavior.

## Next Command

`$exec`
