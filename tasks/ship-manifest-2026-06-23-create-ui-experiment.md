# Ship Manifest - Create UI Experiment Skill

## User Goal

Execute the next `$exec` step: Step 1.7, add a dedicated `create-ui-experiment` skill and routing metadata for clickable UI experiment ownership.

## Changed Files

- `packs/product-design/codex/create-ui-experiment/SKILL.md`
- `packs/product-design/claude/create-ui-experiment/SKILL.md`
- `packs/product-design/codex/create-ui-experiment/CHANGELOG.md`
- `packs/product-design/claude/create-ui-experiment/CHANGELOG.md`
- `packs/product-design/codex/create-ui-experiment/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/create-ui-experiment/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/create-ui-experiment/ALIGNMENT-PAGE.md`
- `packs/product-design/claude/create-ui-experiment/ALIGNMENT-PAGE.md`
- `packs/product-design/PACK.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `prompts/exec/skill-prompt-20260623-183904-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-create-ui-experiment.md`

## Per-File Purpose

- `SKILL.md` files: define mirrored `create-ui-experiment` contracts at `version: v0.0`, with Codex `$...` and Claude `/...` command syntax.
- `CHANGELOG.md` files: record the initial v0.0 behavior.
- `DESIGN-TREE-LOOP.md` files: generated design-tree convention bundles for the new skill roots.
- `ALIGNMENT-PAGE.md` files: generated alignment-page convention bundles for the new skill roots.
- `PACK.md`: registers `create-ui-experiment` in the product-design pack.
- `skillpacks-manifest.json`: package manifest refreshed from the staged skill/pack boundary.
- Skills Showcase assets and benchmark matrix: generated metadata refreshed for the new skill and pack membership; benchmark matrix changed as an expected generator side effect from local ignored benchmark-run evidence.
- Prompt history: captures the visible `$exec` invocation and pasted skill context.
- Task/history/manifest files: record completion, validation, residual risk, and next-step plan.

## User-Goal Mapping

- Dedicated owner: `create-ui-experiment` now exists in both product-design mirrors.
- Clickable route boundary: the contracts own clickable UI experiment routes or project-native lightweight prototypes for one approved UI branch.
- Prototype-first data boundary: the contracts require fake, fixture, local, or in-memory data and reject production infrastructure in this phase.
- Progressive review: the contracts require first-value journey and primary task path before dense secondary controls.
- Handoff discipline: downstream routing to prototype, UAT variant evaluation, or prototype-build-plan synthesis is gated on explicit review evidence.

## Tests Run

Executable verification:

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` before edits: expected red, 13 passed / 1 failed.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` after edits: passed, 14/14.
- `node scripts/upgrade-design-tree-loop.mjs --check`: passed.
- `node scripts/upgrade-alignment-page.mjs --check`: passed.
- `scripts/skill-archive-audit.sh --strict`: passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`: passed.
- `npm run skillpacks:verify`: passed.
- `git diff --check`: passed.

Documentation/task checks:

- `node scripts/audit-task-docs.mjs`: passed with informational advisory counts only.
- `scripts/skill-mirror-parity-audit.sh --verbose`: non-zero only for the known unrelated `session-analytics/session-triage` shared-section drift; no new product-design drift.

## Skipped Tests

- `node scripts/upgrade-interrogation-page.mjs --check` was not run because this step did not add `create-ui-experiment` to `INTERROGATION_SKILLS`; no interrogation bundle is expected.
- Full repository layer1 was not run because the touched surface is covered by the focused product-design flow-tree test, generator checks, archive audit, package verification, and showcase validation.

## Adversarial Review

Diff-aware review checked that the new skill remains narrow: it does not create durable infrastructure, does not route to production planning, uses mirror-specific command syntax, includes the test-covered exact ownership strings, and keeps `create-ui-experiment` as a branch experiment owner rather than replacing the established prototype route. Existing route docs were not broadened in this step because the current route-preservation test still asserts the build-plan-to-prototype route as the canonical AFPS path.

## Residual Risk

- `scripts/skill-mirror-parity-audit.sh --verbose` still reports the known unrelated `session-analytics/session-triage` `Pack Availability Guard` drift and exits non-zero.
- Step 1.8 remains as a regeneration freshness pass; the required generators already ran for shipping, but the roadmap keeps that step open to close the planned generated-asset phase explicitly.

## Rollback Note

Revert the shipping commit to remove the new skill roots, pack entry, regenerated metadata, prompt log, and task/history updates. No manual production deploy was run. The Vercel ignored-build helper classifies the commit as deploy-relevant because generated Skills Showcase public assets changed, so the normal push-triggered Vercel path may build the site.

## Next Command

`$exec`
