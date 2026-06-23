# Ship Manifest - Regeneration Freshness Pass

## User Goal

Execute the next `$exec` step: Step 1.8, regenerate bundles and public/package metadata for changed product-design skill surfaces.

## Changed Files

- `prompts/exec/skill-prompt-20260623-192954-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-regeneration-freshness-pass.md`

## Per-File Purpose

- Prompt history: captures the visible `$exec` invocation for this skill run.
- `tasks/todo.md`: marks Step 1.8 complete, records the no-drift generator result, and writes the self-contained Step 1.9 validation plan.
- `tasks/history.md`: records the regeneration freshness pass outcome.
- Ship manifest: records the exact shipping boundary, verification, residual risk, rollback note, and next command.

## User-Goal Mapping

- Step 1.8 required regeneration after changed skill surfaces. The required generators were run and found no tracked drift beyond what Step 1.7 had already shipped.
- The package/showcase metadata boundary is confirmed fresh from the current index.
- The phase can move to Step 1.9 full validation without carrying generated-asset uncertainty.

## Tests Run

Executable verification:

- `node scripts/upgrade-design-tree-loop.mjs`: passed, 20 skills checked, 0 reference updates, 0 bundle writes.
- `node scripts/upgrade-alignment-page.mjs`: passed, 0 updates, 0 bundled file writes.
- `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`: passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`: passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`: passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`: passed, generated data fresh.
- `node scripts/upgrade-design-tree-loop.mjs --check`: passed.
- `node scripts/upgrade-alignment-page.mjs --check`: passed.
- `npm run skillpacks:verify`: passed.
- `git diff --check`: passed.

Documentation/task checks:

- Diff inspection confirmed no tracked generated-file changes after the generator pass.
- `node scripts/audit-task-docs.mjs`: passed with informational advisory counts only.

## Skipped Tests

- `node scripts/upgrade-interrogation-page.mjs` and `node scripts/upgrade-interrogation-page.mjs --check` were skipped because Step 1.7 did not add `create-ui-experiment` to `INTERROGATION_SKILLS`; no interrogation bundle is expected.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts`, `scripts/skill-archive-audit.sh --strict`, and `scripts/skill-mirror-parity-audit.sh --verbose` are reserved for Step 1.9, the explicit full validation step.

## Adversarial Review

Checked the working tree before accepting the generator pass. The generation commands completed successfully and left no tracked generated drift, so there was no hidden metadata update to include or reject. The remaining diff is documentation/prompt history only.

## Residual Risk

- Step 1.9 still needs to run the full focused/repository validation list and record the known mirror-parity residual if it persists.
- Because Step 1.8 produced no source or generated asset changes, the practical rollback risk is limited to task documentation and prompt-history bookkeeping.

## Rollback Note

Revert this shipping commit to reopen Step 1.8 and remove the prompt/history/manifest documentation. No source code, skill contract, package metadata, generated public asset, or production deploy state changes are part of this boundary.

## Next Command

`$exec`
