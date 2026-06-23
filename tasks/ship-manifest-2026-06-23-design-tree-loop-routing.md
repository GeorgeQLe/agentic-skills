# Ship Manifest - Design Tree Loop Routing

## User Goal

Execute the next `$exec` task: Step 1.3, "Update the canonical design-tree loop convention and generated bundle inputs."

## Changed Files

- `docs/design-tree-loop-convention.md`
- `packs/product-design/claude/consolidate-prototypes/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/design-inspirations/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/prototype/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/spec-interview/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/state-model/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/ui-interview/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/user-flow-map/DESIGN-TREE-LOOP.md`
- `packs/product-design/claude/ux-variations/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/consolidate-prototypes/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/design-inspirations/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/prototype/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/spec-interview/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/state-model/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/ui-interview/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/user-flow-map/DESIGN-TREE-LOOP.md`
- `packs/product-design/codex/ux-variations/DESIGN-TREE-LOOP.md`
- `packs/product-testing/claude/uat/DESIGN-TREE-LOOP.md`
- `packs/product-testing/codex/uat/DESIGN-TREE-LOOP.md`
- `prompts/exec/skill-prompt-20260623-143423-exec.md`
- `scripts/upgrade-design-tree-loop.mjs`
- `tasks/history.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-23-design-tree-loop-routing.md`

## Per-File Purpose

- `docs/design-tree-loop-convention.md`: adds deterministic branch-selection order, progressive-review requirements, `create-ui-experiment` ownership, and the explicit non-route-position handoff boundary.
- `scripts/upgrade-design-tree-loop.mjs`: includes `create-ui-experiment` in the design-tree bundle allowlist for the future skill root.
- `packs/**/DESIGN-TREE-LOOP.md`: regenerated from the canonical convention so installed skill bundles remain in sync.
- `prompts/exec/skill-prompt-20260623-143423-exec.md`: records the visible `$exec` invocation per repo prompt-history policy.
- `tasks/todo.md`: marks Step 1.3 complete, records validation, and writes a self-contained Step 1.4 plan.
- `tasks/history.md`: records the shipped Step 1.3 work.
- This manifest: records the shipping boundary and quality proof.

## User-Goal Mapping

- The convention update satisfies Step 1.3's required branch-selection algorithm and progressive-review rules.
- The generator allowlist satisfies Step 1.3's instruction to add `create-ui-experiment` to design-tree bundle generation when it carries `DESIGN-TREE-LOOP.md`.
- The regenerated bundles keep the canonical doc and packaged per-skill convention copies aligned.
- The task/history/prompt files satisfy `$exec` bookkeeping and next-step planning requirements.

## Tests Run

- `node scripts/upgrade-design-tree-loop.mjs`
  - Passed; regenerated 18 existing design-tree bundles.
- `node scripts/upgrade-design-tree-loop.mjs --check`
  - Passed; 18 skills checked, 0 stale bundle writes.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts`
  - Expected red TDD result: 10 passed, 4 failed.
  - Remaining failures map to future steps: mirrored `user-flow-map` contract, mirrored `ux-variations` contract, mirrored `ui-interview` contract, and missing mirrored `create-ui-experiment` contracts.
- `node scripts/audit-task-docs.mjs`
  - Passed; 0 failures, 0 warnings. It reported 4 unchecked manual advisory items and 2 unchecked recurring advisory items as non-executable unless promoted.
- `git diff --cached --check`
  - Passed; no whitespace errors.
- `npm run skillpacks:verify`
  - Passed; convention bundle audit, manifest check, package staging boundary check, and npm pack dry run succeeded.

## Skipped Tests

- Full repository test suite was not run because Step 1.3 changes the design-tree convention/generator surface only. The focused layer1 contract test covers the active TDD surface, and `npm run skillpacks:verify` covers bundle drift, package manifest consistency, and package staging.
- Skills Showcase generators were not run because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed in this step.
- Deploy was not run from this manifest; the changed files are repository workflow/docs/package-source files and do not modify a deployed runtime surface.

## Adversarial Review

Method: changed-file self-review plus targeted generator/package validation, which is the project-specific equivalent for this shared convention/generator change.

Finding fixed: the first pass named `create-ui-experiment` in the convention deliverable table and generator allowlist but did not add it to the pipeline role table or clarify that it is not a top-level route replacement. Fixed by adding `create-ui-experiment` to the pipeline role list and adding a routing rule that sends approved clickable route experiment needs to it before prototype buildout while preserving the canonical six-skill route.

No residual review findings remain in this step's scope. The focused test's remaining failures are expected red work for Steps 1.4-1.7, not regressions introduced by Step 1.3.

## Residual Risk

- The convention now references `create-ui-experiment` before the mirrored skill exists. This is intentional for Step 1.3 and is closed by planned Step 1.7; the generator allowlist has no effect until the skill root exists.
- The focused layer1 test remains red by design until the mirrored skill contracts and new skill are implemented in Steps 1.4-1.7.

## Rollback Note

Revert this commit, or revert `docs/design-tree-loop-convention.md` and `scripts/upgrade-design-tree-loop.mjs` then rerun `node scripts/upgrade-design-tree-loop.mjs` to restore generated bundles to the prior convention.

## Next Command

`$exec`
