# Current Task State

## Current Implementation - Platform Fit Workshop

**Status:** In progress - adding platform-fit ranking and probe routing to the product-design tree.

Project: `agentic-skills`.

### Goal

Add a first-class Platform Fit Workshop to the product-design design tree so `user-flow-map` ranks candidate platforms, records the decision in `flow-tree` manifests, creates thin platform probes when needed, and carries prototype evidence into final `spec-interview` platform lock.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial mutations for schema, generated docs, mirrored skill contracts, tests, and task docs.
- Reason: this touches the product-design flow-tree contract, generated bundled convention files, mirrored skill behavior, and regression coverage.
- Safety boundary: keep the fixed route tuple unchanged, avoid standalone platform skills, preserve unrelated paused YouTube task notes, and do not create GitHub Actions.

### Plan

- [x] Inspect current schema, sample manifest, design-tree convention, mirrored skills, tests, and active task docs.
- [x] Update the task docs with the active implementation contract and review section.
- [x] Update `design/flow-tree.schema.json` to `v0.5` with additive `platform_fit` and `prototype_build_item.platform_probe` support.
- [x] Update `design/flow-tree-sample.yaml` with a realistic platform-fit matrix and one thin platform probe.
- [x] Update canonical design-tree docs and regenerate bundled `DESIGN-TREE-LOOP.md` files.
- [x] Archive, bump, and update changed mirrored skills and changelogs.
- [x] Extend focused layer1 tests for schema, sample, route stability, platform-probe validation, and mirror contracts.
- [x] Run focused verification, generator check, archive audit, and relevant layer1 tests.
- [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- [x] `flow-tree.schema.json` uses `schema_version: v0.5`, keeps the six-step route unchanged, and makes `platform_fit` optional/additive.
- [x] `platform_fit.candidates[]` covers the broad platform set, fit/status values, evidence basis, platform-specific risk fields, required probe, and recommendation buckets.
- [x] `prototype_build_item.platform_probe` allows explicitly non-visual platform probes without requiring `ui_experiment_id`, while ordinary UI build items still link to a UI experiment.
- [x] Design-tree docs frame Platform Fit as a `user-flow-map` trunk concern and platform probes as thin risk tests, not full parallel products.
- [x] Mirrored skills mention Platform Fit Workshop, broad candidate set, platform probes, and `spec-interview` final production platform lock where applicable.
- [x] Changed `SKILL.md` files are archived and versioned with changelog entries.

### Test Plan

- `npm test -- tests/layer1/product-design-flow-tree.test.ts`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `bash scripts/skill-archive-audit.sh --strict`
- Relevant focused layer1 suite if the targeted tests pass.
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `npm test -- tests/layer1/product-design-flow-tree.test.ts` failed because the repository has no root `test` script.
- `npx vitest run tests/layer1/product-design-flow-tree.test.ts` passed with 18 tests.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed with 22 skills checked and 0 bundle writes.
- `bash scripts/skill-archive-audit.sh --strict` passed with 413 skills checked and 0 violations.
- `git diff --check` passed.
- `npx vitest run tests/layer1` was attempted after the focused test passed; it failed on pre-existing/out-of-scope `packs/youtube-ops/{claude,codex}/youtube-meta-research/SKILL.md` staged-research marker assertions, not on Platform Fit files.

## Paused Implementation - Create YouTube Meta Research Skill

This section is preserved from the pre-existing task state and is intentionally not part of the Platform Fit Workshop implementation.
