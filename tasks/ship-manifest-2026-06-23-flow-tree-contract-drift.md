# Ship Manifest - Product-Design Flow-Tree Contract Drift

## User Goal

Fix product-design flow-tree contract drift so the schema, sample manifest, skill wording, and layer1 tests agree on UI experiment evidence, deterministic UI branch selection, UI experiment terminology, journey-stage wording, and branch-order override metadata.

## Changed Files

- `design/flow-tree.schema.json`
- `design/flow-tree-sample.yaml`
- `docs/design-tree-loop-convention.md`
- `packs/product-design/{codex,claude}/create-ui-experiment/{SKILL.md,CHANGELOG.md,DESIGN-TREE-LOOP.md,archive/v0.0/SKILL.md}`
- `packs/product-design/{codex,claude}/ui-interview/{SKILL.md,CHANGELOG.md,DESIGN-TREE-LOOP.md,archive/v0.26/SKILL.md}`
- `packs/product-design/{codex,claude}/user-flow-map/{SKILL.md,CHANGELOG.md,DESIGN-TREE-LOOP.md,archive/v1.5/SKILL.md}`
- Other regenerated design-tree loop bundles under `packs/product-design/{codex,claude}/*/DESIGN-TREE-LOOP.md` and `packs/product-testing/{codex,claude}/uat/DESIGN-TREE-LOOP.md`
- `tests/layer1/product-design-flow-tree.test.ts`
- `apps/skills-showcase/public/assets/{skills-data.js,github-proof-data.js}`
- `docs/skills-showcase/assets/{skills-data.js,github-proof-data.js}`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `prompts/exec/skill-prompt-20260623-225834-flow-tree-contract-drift.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-23-flow-tree-contract-drift.md`

## Per-File Purpose

- Schema/sample: make `ui_experiments[]` explicitly support clickable experiment evidence with schema-valid sample keys.
- Skill contracts/changelogs/archives: bump and preserve the old versions while aligning Codex and Claude mirrors with the schema contract.
- Design-tree convention/bundles: remove stale generated branch-selection wording so future bundle refreshes do not reintroduce drift.
- Layer1 test: lock the schema/sample/skill wording contract against future regressions.
- Showcase/package generated data: refresh version rows, fingerprints, and package manifest from the staged skill boundary.
- Prompt/task docs: record the invocation, plan, results, and shipping evidence.

## User-Goal Mapping

- `experiment_path` and `review_evidence` are optional schema fields on `ui_experiment`, with `additionalProperties: false` preserved.
- The sample `ui_experiments[]` entries now use only schema-valid keys.
- `create-ui-experiment` references exact schema fields and keeps `artifacts[]` for canonical design/review files.
- `ui-interview` resolves the next UX variation by explicit override, `evaluation_priority`, first-value/activation fit, status, then stable array order.
- `user-flow-map` uses UI experiment wording for prototype-build-plan source IDs and names schema-backed override metadata fields.
- Journey-stage wording no longer uses schema-invalid setup language.

## Tests Run

- Red proof before implementation: `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` failed on 6 new assertions.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` passed: 14 tests.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 20 skills, 0 bundle writes.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` passed.
- `pnpm --dir apps/skills-showcase build` passed.
- `scripts/skill-archive-audit.sh --strict` passed: 400 skills, 0 violations.
- `npm run skillpacks:verify` passed, including manifest check and package staging boundary check.
- `node scripts/audit-task-docs.mjs` passed after task-doc heading cleanup.
- `git diff --check` passed.

## Skipped Tests

- No browser smoke was run because this change only touches schema contracts, skill text, generated metadata, and generated documentation bundles; executable coverage is the focused layer1 contract test plus generator/package checks and the Skills Showcase production build for deploy-relevant public asset changes.

## Adversarial Review

- Ran `scripts/skill-mirror-parity-audit.sh --verbose`; it still fails only on known unrelated `session-analytics/session-triage` shared-section drift. Product-design mirror changes were not the failing pair.
- Scanned active product-design contract text for the stale selector, schema-invalid setup wording, vague override wording, and UI-review source labels; remaining matches are archive snapshots or negative test assertions.

## Residual Risk

- The generated design-tree loop bundle changed across all participating design-tree skills because the canonical convention changed. This is intentional, but it expands the diff beyond the three edited skill bodies.
- Existing unrelated mirror-parity drift in `session-analytics/session-triage` remains outside this task.

## Rollback Note

Revert this commit to restore the prior flow-tree schema/sample, skill versions, generated design-tree bundles, Skills Showcase data, and skillpacks manifest. If rolling back only the schema change, also roll back the tests and skill wording together to avoid reintroducing contract drift.

## Next Command

`$brainstorm`
