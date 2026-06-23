# Ship Manifest - 2026-06-23 - Design-Tree Branch Routing Red Coverage

## User Goal

Run `$exec Step 1.1: Write failing layer1 coverage for deterministic branch routing and UI experiment ownership.`

## Changed Files

- `prompts/exec/skill-prompt-20260623-141557-layer1-coverage-routing-ui-ownership.md`
- `tests/layer1/product-design-flow-tree.test.ts`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-design-tree-branch-routing-red.md`

## Per-File Purpose

- `prompts/exec/...`: required prompt-history capture for the visible `$exec` invocation and pasted skill context.
- `tests/layer1/product-design-flow-tree.test.ts`: adds expected-failing layer1 contract coverage for deterministic branch routing and clickable UI experiment ownership.
- `tasks/todo.md`: marks Step 1.1 complete as a red TDD step, records focused test evidence, and prepares Step 1.2.
- `tasks/history.md`: records the completed red coverage step and points to this manifest.
- This manifest: records the shipping boundary, red proof, skipped checks, adversarial review, residual risk, rollback, and next command.

## User-Goal Mapping

- The schema/sample assertions define the required `v0.3` flow-tree contract, user-flow branch ordering metadata, UX-variation priority metadata, and progressive-review guidance.
- The mirrored skill assertions define the desired deterministic route selection and explicit user-override recording behavior.
- The `ui-interview` and `create-ui-experiment` assertions establish separate ownership for clickable UI experiment routes before later implementation work changes the skill contracts.
- The task/history updates keep the execution queue current-only and make Step 1.2 executable from `tasks/todo.md` alone.

## Tests Run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` before test edits: passed, 1 file / 9 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` after test edits: failed as expected for the red phase, 1 file / 14 tests / 7 failed / 7 passed.
- `node scripts/audit-task-docs.mjs`: passed with 0 failures and 0 warnings; it reported the active task as `Phase 1: Design-Tree Branch Prioritization And UI Experiment Split`.
- `git diff --check`: passed.

## Skipped Tests

- Broader layer1/package/showcase suites were not run because this is a tests-first red step. The intentionally failing focused layer1 contract is the expected output; broader suites would either repeat the same red failure or test implementation that Step 1.1 intentionally did not write.
- Skill archive, mirror parity, package manifest, and showcase data checks were skipped because no `SKILL.md`, `PACK.md`, generated bundle, package manifest, or showcase asset changed in this step.
- Deploy was not run because this change is repository test/task coverage only and has no runtime deployment surface.

## Adversarial Review

- Compared the focused layer1 baseline before edits against the post-edit red run to prove the failures were introduced by the new assertions, not a pre-existing broken test file.
- Reviewed the diff for accidental implementation changes: the only source change is the targeted layer1 test file; no schema, sample, skill, pack, or generated assets were modified.
- Checked that the next-step plan limits Step 1.2 to schema/sample work so downstream mirrored skill assertions remain intentionally red until their scheduled steps.
- Ran task-doc and whitespace hygiene after documentation updates; both passed.

## Residual Risk

The new string assertions intentionally constrain the future wording in mirrored skill contracts. That is useful for layer1 contract precision, but later implementation may need to adjust exact phrasing if the same behavior is expressed more clearly. Step 1.2 should make only schema/sample failures green and leave the skill-contract failures for Steps 1.3-1.7.

## Rollback Note

Revert this commit to remove the red layer1 assertions and restore Step 1.1 to unchecked. No runtime code, generated package assets, skill contracts, or deployment surfaces are changed.

## Next Command

`$exec`
