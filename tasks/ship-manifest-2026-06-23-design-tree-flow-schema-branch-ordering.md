# Ship Manifest — Design-Tree Flow Schema Branch Ordering

## User goal

Execute `$exec` for the next incomplete task: Step 1.2, "Extend the flow-tree schema and sample with branch-order metadata."

## Changed files

- `design/flow-tree.schema.json`
- `design/flow-tree-sample.yaml`
- `tasks/todo.md`
- `tasks/history.md`
- `prompts/exec/skill-prompt-20260623-142634-exec.md`
- `tasks/ship-manifest-2026-06-23-design-tree-flow-schema-branch-ordering.md`

## Per-file purpose

- `design/flow-tree.schema.json`: Bumped the manifest contract to `v0.3`; added required deterministic ordering metadata for user-flow and UX-variation branches; added shared progressive review guidance; added optional branch-order override metadata with UX-variation parent enforcement.
- `design/flow-tree-sample.yaml`: Exercised the new `v0.3` metadata, first-value review guidance, and user override rationale while preserving `ui_experiments[]`.
- `tasks/todo.md`: Marked Step 1.2 complete, recorded focused verification results, and prepared a self-contained Step 1.3 plan.
- `tasks/history.md`: Added durable completion history for Step 1.2.
- `prompts/exec/skill-prompt-20260623-142634-exec.md`: Captured the visible `$exec` invocation context required by repo prompt-history policy.
- `tasks/ship-manifest-2026-06-23-design-tree-flow-schema-branch-ordering.md`: Records the exact shipping boundary and proof.

## User-goal mapping

- Step 1.2 asked for branch-order metadata in the schema and sample; the schema now requires `journey_stage`, `journey_sequence`, `priority_rationale`, and `progressive_review` on user-flow branches, and `evaluation_priority`, `activation_fit`, `first_value_fit`, `priority_rationale`, and `progressive_review` on UX variation branches.
- The sample now demonstrates those fields and an explicit `branch_order_override` rationale, satisfying the TDD schema/sample assertions.
- Task and history updates keep `$exec` state current for the next step.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` — expected red TDD result: 10 passed / 4 failed. The schema and sample assertions now pass; remaining failures are downstream mirrored skill-contract and missing `create-ui-experiment` assertions scheduled for Steps 1.3-1.7.
- `node scripts/audit-task-docs.mjs` — passed with 0 failures and 0 warnings. Informational output reported 4 unchecked manual advisory items and 2 unchecked recurring advisory items.
- `node -e 'JSON.parse(require("node:fs").readFileSync("design/flow-tree.schema.json", "utf8")); console.log("flow-tree schema JSON parse ok")'` — passed.
- `git diff --check` — passed.

## Skipped tests

- Full `npm run skillpacks:verify` was not run because this step changed only the schema/sample and task artifacts, not skill contracts, pack metadata, generated bundles, or package manifests. The later skill/versioning steps include that broader validation.
- Skills Showcase generators were not run because no tracked `SKILL.md` or `PACK.md` changed in this step.
- YAML schema validation was not run because the repository does not currently provide a committed sample-validator command for `design/flow-tree-sample.yaml`; the focused layer1 contract checks the sample literals required by this step.

## Adversarial review

- Review method: changed-file self-review plus targeted scans and focused TDD output inspection.
- Finding fixed before ship: `branch_order_override.parent_branch_id` was described as required for UX-variation overrides but was not enforced. Added a schema `if`/`then` rule requiring `parent_branch_id` when `scope` is `ux-variation`.
- Verified the diff did not touch mirrored skill contracts or create `create-ui-experiment`, preserving the Step 1.2 boundary.
- Verified no `ui_reviews[]` was introduced in the schema or sample.

## Residual risk

- The sample is not validated by a dedicated YAML schema validator in this repo, so indentation/schema-shape issues beyond the asserted literals could slip until a future validator is added. Current risk is limited because the existing focused layer1 test reads and asserts the fields this step was meant to introduce.
- The full phase remains intentionally red until Steps 1.3-1.7 update generated convention inputs, mirrored skill contracts, and the new `create-ui-experiment` skill.

## Rollback note

Revert this commit to restore the `v0.2` flow-tree schema/sample and Step 1.2 task state. If only the schema addition causes trouble, revert `design/flow-tree.schema.json` and `design/flow-tree-sample.yaml`, then restore Step 1.2 to unchecked in `tasks/todo.md`.

## Next command

`$exec`
