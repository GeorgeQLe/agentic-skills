# Ship Manifest - Final-Handoff Self-Check And Guard

## Scope

Add a shared confirmed-artifact terminal handoff rule to the alignment-page convention and a fixture-backed audit mode that checks final completion responses for explicit next-step routing.

## Changes

- Added `Confirmed-artifact terminal handoff` to `docs/alignment-page-convention.md`.
- Regenerated 306 generated `ALIGNMENT-PAGE.md` bundles.
- Added `--final-handoff-fixtures <dir>` to `scripts/skill-alignment-routing-audit.mjs`.
- Added Markdown fixtures under `tests/fixtures/final-handoff-routing/` for valid and invalid terminal handoff shapes.
- Extended `tests/layer1/skill-alignment-routing-audit.test.ts` to cover the new fixture mode.
- Verified `packages/skillpacks/dist/skillpacks-manifest.json` from a clean temp source containing only this task's convention and bundle changes; no manifest delta was needed.
- Updated `tasks/roadmap.md` and `tasks/todo.md` with plan, results, and verification status.

## Verification

- `node scripts/skill-alignment-routing-audit.mjs --final-handoff-fixtures tests/fixtures/final-handoff-routing` - pass.
- `node scripts/skill-alignment-routing-audit.mjs --fixtures tests/fixtures/skill-alignment-routing` - expected fixture failure mode; reported the existing two invalid SKILL.md fixture findings.
- `node scripts/skill-alignment-routing-audit.mjs --report` - pass, 398 active SKILL.md files scanned and 0 findings.
- `node scripts/upgrade-alignment-page.mjs --check` - pass, 306 ownable bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-alignment-routing-audit.test.ts` - pass, 3 tests.
- `node scripts/skill-convention-bundle-audit.mjs` - pass for the current dirty tree, 388 active skills and 374 tracked bundles.
- `npm --workspace packages/skillpacks run test:node` - pass, 130 tests.
- `npm --workspace packages/skillpacks run build` - pass in the current dirty tree.
- `npm --workspace packages/skillpacks run build:check` - pass in the current dirty tree.
- Clean temp source with this task's changes only: `npm --workspace packages/skillpacks run build` - pass, 390 skills.
- Clean temp source with this task's changes only: `npm --workspace packages/skillpacks run build:check` - pass.
- `node scripts/audit-task-docs.mjs` - pass.
- `git diff --check` - pass.

## Notes

- `pnpm --dir tests test:layer1 -- skill-alignment-routing-audit alignment-gates` ran the broad layer1 suite and failed on unrelated staged skill-inventory and benchmark contract changes already present in the worktree. The focused routing audit test passed.
- The package manifest was checked in a clean temp copy to avoid mixing unrelated staged source changes into this task's generated package artifact; the clean result matched `HEAD`.
