# Current Task State

## Status

Active implementation queue: Phase 1 - Design-Tree Branch Prioritization And UI Experiment Split.

Project: `agentic-skills`.
Current phase: 1 of 1 currently promoted roadmap phases.
Source roadmap section: `tasks/roadmap.md` -> `## Phase 1: Design-Tree Branch Prioritization And UI Experiment Split`.

This file is the current execution contract, not a historical work log. Completed implementation records live in `tasks/history.md`, `tasks/reconciliation-report.md`, commit history, and ship manifests.

## Phase 1: Design-Tree Branch Prioritization And UI Experiment Split
> Test strategy: tdd

### Goal

Make the product-design tree choose downstream branches in a journey-aware order, separate clickable UI experiment/prototype work from `ui-interview`, and ensure review surfaces introduce UI progressively instead of dropping reviewers into an overloaded all-at-once screen.

### Scope

- Extend the design-tree manifest contract so user-flow and UX-variation branches carry deterministic ordering and progressive-review metadata instead of depending on array order alone.
- Update the product-design tree conventions and mirrored skill contracts so branch resolution honors journey order, explicit user overrides, first-value/activation fit, and evaluation priority.
- Keep `$ui-interview` focused on UI requirements, branch packet authoring, static or bounded HTML mockup review, and branch decisions.
- Add a dedicated `create-ui-experiment` owner for clickable UI experiment routes or project-native lightweight prototypes, with handoff into `$prototype` and UAT only after UI branch approval.
- Refresh generated convention bundles, package/showcase metadata, and focused layer1 coverage for the behavior.

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance, UX

**Subagent lanes:** none

### Tests First

- [x] Step 1.1: Write failing layer1 coverage for deterministic branch routing and UI experiment ownership
  - Files: modify `tests/layer1/product-design-flow-tree.test.ts`
  - Add assertions that `design/flow-tree.schema.json` exposes a new schema version with branch ordering metadata on user-flow branches and UX variation branches, including journey stage, sequence/priority, rationale, and progressive-review guidance.
  - Add assertions that `design/flow-tree-sample.yaml` exercises the new ordering fields and a user override or rationale example.
  - Add assertions that mirrored `user-flow-map` contracts order `branches[]` by journey progression by default and record user overrides in the flow map, interview log, and manifest.
  - Add assertions that mirrored `ux-variations` contracts select the next child branch by journey sequence, activation/first-value fit, and evaluation priority rather than raw first-pending array order.
  - Add assertions that mirrored `ui-interview` contracts use `ui_experiments[]`, do not write or route default clickable prototype buildout, and hand clickable route experiments to the dedicated owner.
  - Add assertions that mirrored `create-ui-experiment` contracts exist and own clickable UI experiment routes or project-native lightweight prototypes.
  - Run `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` and confirm the new assertions fail before implementation.

### Implementation

- [x] Step 1.2: Extend the flow-tree schema and sample with branch-order metadata
  - Files: modify `design/flow-tree.schema.json`, `design/flow-tree-sample.yaml`
  - Bump the flow-tree schema version only if the new metadata is required or semantically breaking; otherwise document the additive compatibility choice in the schema descriptions and tests.
  - Add deterministic branch-order fields to `user_flow_branch`, such as `journey_stage`, `journey_sequence`, `priority_rationale`, and a progressive-review field/object that names first-value step, primary task path, staged-disclosure notes, and evidence required before moving deeper.
  - Add equivalent or narrower selection metadata to `ux_variation_branch`, such as `evaluation_priority`, `activation_fit`, `first_value_fit`, `priority_rationale`, and progressive-review notes.
  - Keep `ui_experiments[]` as the canonical child branch name and do not reintroduce `ui_reviews[]`.

- [x] Step 1.3: Update the canonical design-tree loop convention and generated bundle inputs
  - Files: modify `docs/design-tree-loop-convention.md`, `scripts/upgrade-design-tree-loop.mjs`
  - Define the branch-selection algorithm: explicit user override first, then ascending journey sequence/evaluation priority, then first-value/activation fit, then current status, with raw array order only as a final stable tiebreaker.
  - Add progressive-review requirements for complex UI surfaces: review first value, primary path, and staged disclosure before dense secondary controls.
  - Add `create-ui-experiment` to the design-tree skill set if the new skill carries `DESIGN-TREE-LOOP.md`.

- [x] Step 1.4: Update and version the mirrored `user-flow-map` contracts
  - Files: archive and modify `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`; update both `CHANGELOG.md` files.
  - Run `scripts/skill-archive.sh packs/product-design/codex/user-flow-map` and `scripts/skill-archive.sh packs/product-design/claude/user-flow-map` before bumping versions.
  - Require `branches[]` output to be ordered by journey progression by default.
  - Require any user override to be recorded in `design/user-flow-[topic].md`, the interview log, and the flow-tree manifest metadata.
  - Require each branch to explain the first value moment, primary task path, and progressive review sequence.

- [x] Step 1.5: Update and version the mirrored `ux-variations` contracts
  - Files: archive and modify `packs/product-design/{codex,claude}/ux-variations/SKILL.md`; update both `CHANGELOG.md` files.
  - Run `scripts/skill-archive.sh packs/product-design/codex/ux-variations` and `scripts/skill-archive.sh packs/product-design/claude/ux-variations` before bumping versions.
  - Replace "first modelled branch with no `ux_variations`" as the sole default with deterministic branch selection using journey order, user overrides, first-value/activation fit, and evaluation priority.
  - Keep default progression-mode output as design planning and future experiment targets; do not emit prototype buildout or route implementation instructions before UI experiment approval.

- [x] Step 1.6: Update and version the mirrored `ui-interview` contracts
  - Files: archive and modify `packs/product-design/{codex,claude}/ui-interview/SKILL.md`; update both `CHANGELOG.md` files.
  - Run `scripts/skill-archive.sh packs/product-design/codex/ui-interview` and `scripts/skill-archive.sh packs/product-design/claude/ui-interview` before bumping versions.
  - Replace remaining active `ui_reviews[]` language with `ui_experiments[]`.
  - Make default full UI mode explicitly non-buildout: UI requirements, packet, HTML visual mockup, branch decision, and handoff only.
  - Route approved clickable route experiment needs to `$create-ui-experiment` or project-local equivalent, not directly to `$prototype` or production planning.

- [x] Step 1.7: Add the dedicated `create-ui-experiment` skill and routing metadata
  - Files: create `packs/product-design/{codex,claude}/create-ui-experiment/SKILL.md`, `CHANGELOG.md`, and generated convention bundles as needed; modify `packs/product-design/PACK.md`, route/alias metadata, docs or routing maps that enumerate product-design skills.
  - Start both new skill contracts at `version: v0.0`.
  - Define the skill as the owner of clickable UI experiment routes or project-native lightweight prototypes that test one UI branch's first-value journey with fake, fixture, local, or in-memory data.
  - Require progressive reveal/review behavior: the experiment introduces first value and primary task path before dense secondary controls.
  - Require handoff into `$prototype`, `$uat --variant-evaluation`, or `$user-flow-map --prototype-build-plan` only after the experiment has explicit review evidence.

- [ ] Step 1.8: Regenerate bundles and public/package metadata for changed skill surfaces
  - Files: generated `DESIGN-TREE-LOOP.md`, `ALIGNMENT-PAGE.md`, `INTERROGATION-PAGE.md` if applicable, `packages/skillpacks/dist/skillpacks-manifest.json`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, and related generated proof data if the generators update it.
  - Run `node scripts/upgrade-design-tree-loop.mjs`.
  - Run `node scripts/upgrade-alignment-page.mjs` and `node scripts/upgrade-interrogation-page.mjs` if new or changed skills require those bundles.
  - Stage source skill edits before regenerating package/showcase metadata so index-generated assets reflect the intended boundary.
  - Run `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, and `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` when tracked skill metadata or pack membership changes.

### Green

- [ ] Step 1.9: Run focused and repository contract validation
  - Files: no source changes expected unless validation exposes concrete drift.
  - Run `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts`.
  - Run `node scripts/upgrade-design-tree-loop.mjs --check`.
  - Run `node scripts/upgrade-alignment-page.mjs --check` and `node scripts/upgrade-interrogation-page.mjs --check` if those generators were used.
  - Run `scripts/skill-archive-audit.sh --strict`.
  - Run `scripts/skill-mirror-parity-audit.sh --verbose`; if it still reports only known unrelated `session-triage` drift, record that residual explicitly.
  - Run `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` if showcase data changed.
  - Run `npm run skillpacks:verify`.
  - Run `node scripts/audit-task-docs.mjs`.
  - Run `git diff --check`.

- [ ] Step 1.10: Document review results, ship manifest, commit, and push
  - Files: modify `tasks/todo.md`, `tasks/history.md`, and a new `tasks/ship-manifest-2026-06-23-design-tree-branch-prioritization.md`.
  - Record exactly which skill versions were bumped, which generated assets changed, validation commands and warnings, accepted residual risks, and rollback note.
  - Commit and push the completed change set on `master`.

### Milestone: Design-Tree Branch Prioritization And UI Experiment Split
**Acceptance Criteria:**
- [ ] Branch routing is deterministic and explicitly tied to journey sequence or a recorded user override.
- [ ] `ux-variations` and `ui-interview` no longer rely only on implicit "first pending" order when recommending child branches.
- [ ] Clickable UI experiment buildout has a dedicated owner separate from default `ui-interview` behavior.
- [ ] Review artifacts present complex interfaces progressively, with clear first-step and primary-path focus before dense secondary controls.
- [ ] The flow-tree schema and skill language use matching branch names for UI experiment/review nodes.
- [ ] Verification commands pass, or any residual failures are documented as unrelated pre-existing issues.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: [fill when complete]
- Tech debt / follow-ups: [fill when complete]
- Ready for next phase: [yes/no]

### Review

- Step 1.1 complete as an expected red TDD step.
- Baseline before edits: `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` passed (1 file, 9 tests).
- Red proof after edits: the same focused command fails as expected (1 file, 14 tests, 7 failed / 7 passed). Failures are the new contract assertions for schema `v0.3`, branch-order metadata, sample ordering metadata, mirrored user-flow branch ordering/override persistence, mirrored UX variation priority selection, non-buildout `ui-interview` delegation, and missing `create-ui-experiment` contracts.
- No Step 1.1 manual blocker was present in `tasks/manual-todo.md`.
- Step 1.2 complete. Updated `design/flow-tree.schema.json` to `v0.3` with required user-flow journey ordering fields, UX-variation evaluation/fit fields, a shared `progressive_review_guidance` object, and optional `branch_order_override` metadata.
- Updated `design/flow-tree-sample.yaml` to exercise the new metadata and override rationale while preserving `ui_experiments[]` as the canonical UI child branch name.
- Verification: `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` now has 10 passed / 4 failed. The schema/sample assertions pass; the remaining expected red failures are the mirrored `user-flow-map`, `ux-variations`, `ui-interview`, and missing `create-ui-experiment` contract assertions scheduled for Steps 1.3-1.7.
- Step 1.3 complete. Updated the canonical design-tree loop convention with the deterministic branch-selection algorithm, progressive-review requirements for dense UI surfaces, and default `ui-interview`/`create-ui-experiment` ownership boundary.
- Updated `scripts/upgrade-design-tree-loop.mjs` so future `create-ui-experiment` skill roots receive generated `DESIGN-TREE-LOOP.md` bundles, then regenerated the existing 18 design-tree bundles so the canonical convention and generated copies stay in sync.
- Verification: `node scripts/upgrade-design-tree-loop.mjs --check` passed. `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` still has 10 passed / 4 failed; the remaining expected red failures are the mirrored `user-flow-map`, `ux-variations`, `ui-interview`, and missing `create-ui-experiment` contract assertions scheduled for Steps 1.4-1.7.
- Step 1.4 complete. Archived mirrored `user-flow-map` v1.4 contracts to `packs/product-design/{codex,claude}/user-flow-map/archive/v1.4/SKILL.md`, bumped both active contracts to v1.5, and updated both changelogs.
- Added `user-flow-map` contract requirements for journey-ordered `branches[]`, branch progressive-review metadata, and explicit branch-order override persistence in `design/user-flow-[topic].md`, `design/user-flow-[topic]-interview.md`, and `design/**/flow-tree-*.yaml`.
- Verification: `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` now has 11 passed / 3 failed. The `user-flow-map` assertion passes; the remaining expected red failures are the mirrored `ux-variations`, `ui-interview`, and missing `create-ui-experiment` contract assertions scheduled for Steps 1.5-1.7.
- Step 1.5 complete. Archived mirrored `ux-variations` v0.27 contracts to `packs/product-design/{codex,claude}/ux-variations/archive/v0.27/SKILL.md`, bumped both active contracts to v0.28, and updated both changelogs.
- Replaced first-pending branch selection with deterministic UX variation routing: explicit user override, `journey_sequence`, `activation_fit`, `first_value_fit`, `evaluation_priority`, `status`, then stable array order. Added override/rationale persistence in the flow-tree manifest and kept default progression-mode output as planning/future experiment targets, not prototype buildout.
- Refreshed `packages/skillpacks/dist/skillpacks-manifest.json`, `docs/skills-showcase/assets/skills-data.js`, and `apps/skills-showcase/public/assets/skills-data.js` for the skill version/content change. Excluded unrelated local benchmark-matrix churn caused by an untracked ignored benchmark run.
- Verification: `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` now has 12 passed / 2 failed. The `ux-variations` assertion passes; the remaining expected red failures are the mirrored `ui-interview` and missing `create-ui-experiment` contract assertions scheduled for Steps 1.6-1.7. `scripts/skill-archive-audit.sh --strict` passed. `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` passed. `npm run skillpacks:verify` passed after regenerating the package manifest. `scripts/skill-mirror-parity-audit.sh --verbose` still reports only the known unrelated `session-analytics/session-triage` shared-section drift.
- Step 1.6 complete. Archived mirrored `ui-interview` v0.25 contracts to `packs/product-design/{codex,claude}/ui-interview/archive/v0.25/SKILL.md`, bumped both active contracts to v0.26, and updated both changelogs.
- Replaced active flow-tree child-state language from `ui_reviews[]` to `ui_experiments[]`; verified `rg 'ui_reviews\\[\\]' packs/product-design/{codex,claude}/ui-interview/SKILL.md` returns no matches.
- Added the non-buildout boundary: default full UI mode stops at UI requirements, branch packet, static or bounded HTML mockup, and branch decision; approved clickable route experiment needs route to `$create-ui-experiment [approved-ui-experiment]` or `/create-ui-experiment [approved-ui-experiment]` instead of direct prototype buildout.
- Refreshed `packages/skillpacks/dist/skillpacks-manifest.json`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, `docs/skills-showcase/assets/github-proof-data.js`, `apps/skills-showcase/public/assets/github-proof-data.js`, and `docs/benchmark-results-matrix.md` from the staged boundary. The benchmark matrix changed only because the showcase validator owns that generated file and reads local ignored benchmark-run evidence.
- Verification: `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` now has 13 passed / 1 failed. The `ui-interview` assertion passes; the remaining expected red failure is the missing `create-ui-experiment` contract scheduled for Step 1.7. `scripts/skill-archive-audit.sh --strict` passed. `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` passed after staging the full generated asset set. `npm run skillpacks:verify` passed. `scripts/skill-mirror-parity-audit.sh --verbose` still reports only the known unrelated `session-analytics/session-triage` shared-section drift.
- Ship-end closeout on 2026-06-23 found no new source/runtime implementation diff beyond prompt-history artifacts. Active implementation remains Step 1.7: add the dedicated `create-ui-experiment` skill and routing metadata.
- Step 1.7 complete. Added mirrored `create-ui-experiment` skill roots at `packs/product-design/{codex,claude}/create-ui-experiment/` with `SKILL.md`, `CHANGELOG.md`, generated `DESIGN-TREE-LOOP.md`, and generated `ALIGNMENT-PAGE.md`.
- Registered `create-ui-experiment` in `packs/product-design/PACK.md` with the test-covered ownership summary. The skill starts at `version: v0.0` in both mirrors and owns clickable UI experiment routes or project-native lightweight prototypes for one approved UI branch.
- The new contract keeps the scope pre-production: fake, fixture, local, or in-memory data only; first-value journey and primary task path before dense secondary controls; explicit review evidence before handoff to `$prototype`, `$uat --variant-evaluation`, or `$user-flow-map --prototype-build-plan` (Claude mirrors use slash-command equivalents).
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json`, Skills Showcase data/proof assets, and `docs/benchmark-results-matrix.md` from the staged source boundary. The benchmark matrix changed as an expected showcase-generator side effect from local ignored benchmark-run evidence.
- Verification: pre-edit focused test reproduced the expected red state (13 passed / 1 failed, missing `create-ui-experiment`). Post-edit `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` passed (14/14). `node scripts/upgrade-design-tree-loop.mjs --check` passed. `node scripts/upgrade-alignment-page.mjs --check` passed. `scripts/skill-archive-audit.sh --strict` passed. `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` passed. `npm run skillpacks:verify` passed. `node scripts/audit-task-docs.mjs` passed with informational advisory counts only. `git diff --check` passed.
- Accepted residual: `scripts/skill-mirror-parity-audit.sh --verbose` still exits non-zero only for the known unrelated `session-analytics/session-triage` `Pack Availability Guard` shared-section drift documented by prior phase review notes; no product-design mirror drift was introduced.

### Next Step Plan - Step 1.8

- Treat Step 1.8 as a regeneration freshness pass over the already-created `create-ui-experiment` surfaces. Source edits from Step 1.7 were staged before package/showcase regeneration, so the expected result is no additional source contract changes unless a generator exposes drift.
- Run `node scripts/upgrade-design-tree-loop.mjs` and confirm no changes beyond already generated `packs/product-design/{codex,claude}/create-ui-experiment/DESIGN-TREE-LOOP.md`.
- Run `node scripts/upgrade-alignment-page.mjs` and confirm no changes beyond already generated `packs/product-design/{codex,claude}/create-ui-experiment/ALIGNMENT-PAGE.md`.
- Do not run `node scripts/upgrade-interrogation-page.mjs` unless `create-ui-experiment` is explicitly added to `INTERROGATION_SKILLS`; Step 1.7 did not add it, so no `INTERROGATION-PAGE.md` is expected.
- Re-run `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`, stage `packages/skillpacks/dist/skillpacks-manifest.json` if it changes, then re-run and stage the required showcase generators: `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, and `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`.
- Verification target: `node scripts/upgrade-design-tree-loop.mjs --check`, `node scripts/upgrade-alignment-page.mjs --check`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, `npm run skillpacks:verify`, and `git diff --check`. If no files change, record Step 1.8 as a no-op freshness closeout and move to Step 1.9.
