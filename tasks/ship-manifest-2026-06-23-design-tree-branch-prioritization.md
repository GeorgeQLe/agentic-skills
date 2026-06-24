# Ship Manifest - Design-Tree Branch Prioritization Phase Closeout

## User goal

Execute `$exec` Step 1.10: document the final review results for Phase 1, create the phase-level ship manifest, archive the completed phase, commit, and push on `master`.

## Changed files

Current shipping boundary:

- `prompts/exec/skill-prompt-20260623-210847-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/phases/phase-1.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-design-tree-branch-prioritization.md`

Phase source/behavior boundary is already recorded in the prior step manifests:

- `tasks/ship-manifest-2026-06-23-design-tree-branch-routing-red.md`
- `tasks/ship-manifest-2026-06-23-design-tree-flow-schema-branch-ordering.md`
- `tasks/ship-manifest-2026-06-23-design-tree-loop-routing.md`
- `tasks/ship-manifest-2026-06-23-user-flow-map-branch-ordering.md`
- `tasks/ship-manifest-2026-06-23-ux-variations-branch-selection.md`
- `tasks/ship-manifest-2026-06-23-ui-interview-non-buildout.md`
- `tasks/ship-manifest-2026-06-23-create-ui-experiment.md`
- `tasks/ship-manifest-2026-06-23-regeneration-freshness-pass.md`
- `tasks/ship-manifest-2026-06-23-design-tree-validation.md`

## Per-file purpose

- `prompts/exec/...`: captures the visible `$exec` invocation and pasted skill payload for repository prompt-history policy.
- `tasks/todo.md`: resets the active execution surface to a no-active-phase handoff after Phase 1 completion.
- `tasks/roadmap.md`: marks Phase 1 complete, checks all milestone acceptance criteria, and records completion notes.
- `tasks/phases/phase-1.md`: archives the fully checked Phase 1 execution snapshot before the active todo reset.
- `tasks/history.md`: records the phase closeout in the durable project history.
- This manifest: records the current shipping boundary plus the full phase-level evidence summary.

## User-goal mapping

- Step 1.10 required final review documentation, a phase-level ship manifest, and direct-to-primary shipping. The task, roadmap, phase archive, history, prompt log, and this manifest satisfy that closeout.
- The completed phase satisfies the original design-tree goal: branch routing is now deterministic and journey-aware; UI experiment ownership is separated from default `ui-interview`; and progressive UI review guidance is present across schema, convention, and mirrored skill contracts.
- The no-active-phase todo prevents future `$exec` runs from re-selecting completed Phase 1 work.

## Phase changes summarized

Behavior and contract changes shipped across Steps 1.1-1.9:

- Added layer1 TDD coverage for deterministic product-design branch routing and clickable UI experiment ownership.
- Bumped `design/flow-tree.schema.json` to `schema_version: v0.3` and updated `design/flow-tree-sample.yaml` with journey ordering, fit/evaluation metadata, progressive review guidance, and branch-order override rationale.
- Updated `docs/design-tree-loop-convention.md` and `scripts/upgrade-design-tree-loop.mjs` with deterministic branch selection, progressive review, and `create-ui-experiment` bundle ownership.
- Bumped mirrored `user-flow-map` contracts from `v1.4` to `v1.5` and archived `v1.4`.
- Bumped mirrored `ux-variations` contracts from `v0.27` to `v0.28` and archived `v0.27`.
- Bumped mirrored `ui-interview` contracts from `v0.25` to `v0.26` and archived `v0.25`.
- Added mirrored `create-ui-experiment` contracts at `version: v0.0`.
- Registered `create-ui-experiment` in `packs/product-design/PACK.md`.

Generated assets changed across the phase:

- `packs/**/DESIGN-TREE-LOOP.md` generated bundles for the design-tree convention refresh, including the new `create-ui-experiment` bundles.
- `packs/product-design/{codex,claude}/create-ui-experiment/ALIGNMENT-PAGE.md`.
- `packages/skillpacks/dist/skillpacks-manifest.json`.
- `docs/skills-showcase/assets/skills-data.js`.
- `apps/skills-showcase/public/assets/skills-data.js`.
- `docs/skills-showcase/assets/github-proof-data.js`.
- `apps/skills-showcase/public/assets/github-proof-data.js`.
- `docs/benchmark-results-matrix.md` as an expected Skills Showcase generator side effect from local ignored benchmark-run evidence.

## Tests run

Executable verification already completed in Step 1.9 for the phase:

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` - passed, 14/14.
- `node scripts/upgrade-design-tree-loop.mjs --check` - passed, 20 skills checked, 0 reference updates, 0 bundle writes.
- `node scripts/upgrade-alignment-page.mjs --check` - passed, 0 updates and 0 bundled file writes.
- `scripts/skill-archive-audit.sh --strict` - passed, 400 skills checked, 0 violations.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - initially reported stale GitHub proof fingerprints, then passed after regeneration.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - passed.
- `npm run skillpacks:verify` - passed.

Current Step 1.10 documentation/task verification:

- `node scripts/audit-task-docs.mjs` - passed with informational advisory counts only.
- `git diff --check` - passed.

Known warning/residual:

- `scripts/skill-mirror-parity-audit.sh --verbose` exits non-zero only for the known unrelated `session-analytics/session-triage` `Pack Availability Guard` shared-section drift. No product-design mirror drift was introduced.

## Skipped tests

- `node scripts/upgrade-interrogation-page.mjs --check` was skipped because `create-ui-experiment` was not registered in `INTERROGATION_SKILLS`; no interrogation bundle is expected for this phase.
- A full Skills Showcase app build was not rerun for Step 1.10 because this shipping boundary changes only prompt/task/history/archive/manifest files. Earlier phase steps ran the owning showcase validators and, where relevant, package verification and app build.
- No production smoke test was run because the current commit does not touch deploy-relevant paths under the `tasks/deploy.md` path policy.

## Adversarial review

Review method: changed-file self-review plus task-doc audit and diff hygiene for the current closeout boundary; prior source/contract changes were reviewed in their per-step manifests.

Findings checked:

- Confirmed the current commit's intended boundary is only prompt history and task documentation/archive/manifest files.
- Confirmed Phase 1 acceptance criteria are backed by Step 1.9 executable validation, not only documentation edits.
- Confirmed `tasks/todo.md` has no active unchecked implementation item after reset, so future routing will not repeat the completed phase.
- Confirmed the accepted mirror-parity residual is unrelated to product-design and already documented in Step 1.9.

No current-boundary findings required source changes.

## Residual risk

- The known unrelated `session-analytics/session-triage` mirror parity drift remains and should be handled by a separate task if it becomes blocking.
- The current commit is task/prompt documentation only. The main risk is routing clarity: if future work should begin immediately, a new phase must be discovered or explicitly promoted from roadmap state.

## Deploy

Deploy skipped by contract. `tasks/deploy.md` says prompt-history and task-doc commits are non-deploying evidence, and this Step 1.10 boundary does not touch `apps/skills-showcase/**`, generated public showcase assets, dependency manifests, lockfiles, or deploy config.

## Rollback note

Revert this closeout commit to restore Phase 1 as the active todo item and remove the phase archive, final history entry, prompt log, and phase-level manifest. Reverting prior source/contract behavior requires reverting the earlier Step 1.1-1.9 commits listed in their individual manifests.

## Next command

`$brainstorm`
