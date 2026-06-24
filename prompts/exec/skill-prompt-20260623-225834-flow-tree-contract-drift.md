---
skill: exec
agent: codex
captured_at: 2026-06-23T22:58:34-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Product-Design Flow-Tree Contract Drift

## Summary
Fix the five verified findings by making the schema, sample, skill text, and tests agree. The primary behavior change is to explicitly support clickable UI experiment evidence in `ui_experiments[]`, then tighten tests so future schema/sample/skill drift fails.

## Key Changes
- Add optional `ui_experiment` fields for clickable experiment output:
  - `experiment_path`: repo-relative route or experiment directory path.
  - `review_evidence`: concise evidence note or repo-relative review artifact reference.
  - Keep existing `artifacts[]` for canonical design/review files.
- Update `create-ui-experiment` Codex and Claude skills to use those exact fields instead of vague “experiment path and evidence note” wording.
- Update `ui-interview` Codex and Claude skills to resolve the next UX variation using deterministic ordering: explicit override, `evaluation_priority`, first-value/activation fit, status, then stable array order.
- Replace stale `UI review` wording in `user-flow-map` Codex and Claude with `UI experiment`, including prototype-build-plan language and build item source IDs.
- Fix branch-order wording:
  - Replace “activation or setup” with schema-valid stage language.
  - Replace “who/what changed and why” with schema-backed `ordered_branch_ids`, `override_rationale`, `recorded_at`, and optional `parent_branch_id`.
- Fix `design/flow-tree-sample.yaml` so every sample `ui_experiments[]` entry uses only schema-valid keys, or includes only newly added schema fields.

## Versioning And Generated Artifacts
- Treat skill edits as substantive behavior changes:
  - Archive and bump `create-ui-experiment`, `ui-interview`, and `user-flow-map` in both Codex and Claude mirrors.
  - Update each affected `CHANGELOG.md`.
- Update `design/flow-tree.schema.json` as the canonical schema.
- Regenerate/check design-tree loop bundles only if canonical convention text changes.
- Avoid unrelated current dirty-tree files under `base/afps-status`, prompt history, and unrelated package manifest changes unless implementation explicitly requires regeneration.

## Test Plan
- Add focused layer1 assertions that:
  - `ui_experiment` allows `experiment_path` and `review_evidence`, and still has `additionalProperties: false`.
  - Sample `ui_experiments[]` keys are schema-valid.
  - `create-ui-experiment` references the exact schema fields.
  - `ui-interview` no longer contains the stale “first UX variation with no `ui_experiments`” selector.
  - `user-flow-map` no longer uses stale `UI review` wording for manifest/build-plan fields.
  - `journey_stage` wording does not mention schema-invalid `setup`.
  - override metadata wording matches actual `branch_order_override` properties.
- Run:
  - `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts`
  - `node scripts/upgrade-design-tree-loop.mjs --check`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`

## Assumptions
- Use the selected schema approach: add explicit optional fields for clickable experiment path and review evidence.
- Keep changes scoped to product-design flow-tree contracts and tests.
- Do not remediate unrelated dirty worktree changes discovered during planning.
