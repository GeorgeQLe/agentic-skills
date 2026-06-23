# Ship Manifest - 2026-06-23 - Plan Design-Tree Branch Prioritization

## User Goal

Run `plan-phase` against the current todo state to decompose `Design-Tree Branch Prioritization And UI Experiment Split`.

## Changed Files

- `prompts/plan-phase/skill-prompt-20260623-123918-design-tree-decomposition.md`
- `scripts/audit-task-docs.mjs`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-plan-design-tree-branch-prioritization.md`

## Per-File Purpose

- `prompts/plan-phase/...`: required visible invocation capture for the requested plan-phase run.
- `scripts/audit-task-docs.mjs`: accepts a single `## Phase N:` section in `tasks/todo.md` as an active execution surface so plan-phase output passes task routing hygiene.
- `tasks/roadmap.md`: promotes and decomposes the deferred design-tree roadmap item into Phase 1 with TDD steps, execution profile, validation, and milestone.
- `tasks/todo.md`: replaces stale completed context with the standalone active Phase 1 execution contract.
- `tasks/history.md`: records the planning run, local fallback, and audit compatibility change.
- This manifest: records the shipping boundary, verification, and next command.

## User-Goal Mapping

- The target roadmap item now has a concrete tests-first implementation sequence and file-level scope.
- The current todo now points directly at Step 1.1 so `$exec` can start without invoking `plan-phase` again.
- The task-doc audit now permits the `plan-phase`-required `## Phase N:` heading shape while preserving stale unchecked-item protection.

## Tests Run

- `node scripts/audit-task-docs.mjs`: passed with 0 failures and 0 warnings; it reported the active task as `Phase 1: Design-Tree Branch Prioritization And UI Experiment Split`.
- `git diff --check`: passed.

## Skipped Tests

- Product-design layer1 tests were not run because this shipment only writes the plan that tells the next `$exec` run to create those failing tests first. Running the existing product-design tests now would not validate the planned behavior.
- Package, showcase, and bundle validation were not run because no skill source, package manifest, generated bundle, or showcase asset changed in this planning-only shipment.

## Adversarial Review

- Verified the target roadmap item had acceptance criteria but lacked execution detail before this run.
- Verified the local `plan-phase` skill exists in `packs/agent-work-admin/codex/plan-phase/SKILL.md` but is not installed in the active Codex registry.
- Checked relevant schema, sample, design-tree convention, product-design skill contracts, and focused layer1 test surfaces before naming file-level steps.
- Verified `node scripts/audit-task-docs.mjs` accepts the new active `## Phase 1:` todo format and still reports deferred manual/recurring advisory counts.

## Residual Risk

The next phase intentionally starts red: Step 1.1 must add failing layer1 tests before any implementation. The new `create-ui-experiment` skill shape is planned but not implemented in this shipment.

## Rollback Note

Revert this commit to restore the previous blocker state in task docs and the previous task-doc audit behavior. No runtime or package behavior is changed.

## Next Command

`$exec`
