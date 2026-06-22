# Ship Manifest - 2026-06-22 - Chunked Skill Progress

## User Goal

Implement the prepared plan to clarify chunked product-design skill progress, patch canonical product-design pack sources, fix Codex `state-model` path literals, archive/bump skill versions, and add regression coverage.

## Changed Files

- `docs/design-tree-loop-convention.md`: adds the required Progress Handoff Block contract for intra-skill chunked stops.
- `packs/product-design/**/DESIGN-TREE-LOOP.md` and `packs/product-testing/**/DESIGN-TREE-LOOP.md`: generated bundles refreshed from the canonical design-tree convention.
- `packs/product-design/{codex,claude}/state-model/SKILL.md`: bumped to `v0.4`; requires progress handoffs; Codex active paths fixed.
- `packs/product-design/{codex,claude}/state-model/archive/v0.3/SKILL.md`: archived prior contracts before version bump.
- `packs/product-design/{codex,claude}/state-model/CHANGELOG.md`: documents `v0.4`.
- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`: bumped to `v0.24`; requires progress handoffs.
- `packs/product-design/{codex,claude}/ux-variations/archive/v0.23/SKILL.md`: archived prior contracts before version bump.
- `packs/product-design/{codex,claude}/ux-variations/CHANGELOG.md`: documents `v0.24`.
- `tests/layer1/product-design-flow-tree.test.ts`: adds active path and progress-handoff regression assertions.
- `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, `docs/skills-showcase/assets/github-proof-data.js`, `apps/skills-showcase/public/assets/github-proof-data.js`, `docs/benchmark-results-matrix.md`: regenerated showcase-owned data after skill source/version changes.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, this manifest: task tracking and ship record.

## Per-File Purpose

- Convention and bundles make the Progress Handoff Block canonical and distributable with each skill.
- Skill files bind the convention to the concrete `state-model` and `ux-variations` setup/framework/spec/assemble stops.
- Archives preserve pre-bump contracts.
- Changelogs and generated metadata keep versioning and public catalog state accurate.
- Tests prevent regression of malformed active paths and missing chunked progress copy.

## User-Goal Mapping

- Progress Handoff Block requirement: implemented in the canonical convention and the four active skill contracts.
- Regeneration: completed via `node scripts/upgrade-design-tree-loop.mjs`.
- Versioning: archived `state-model` v0.3 and `ux-variations` v0.23, then bumped active mirrors.
- Codex path fix: active Codex `state-model` now uses slash-delimited brief/intermediate/alignment paths.
- Regression coverage: Layer 1 test added.

## Tests Run

- `rg -n --glob '!**/archive/**' 'design/\{slug\}\$state-model|alignment\$state-model|_working\$state-model|design\$state-model' packs/product-design .codex/skills .claude/skills docs scripts tests`
- `rg -n 'Progress Handoff|repeated command is intentional|Completed .* / .*|fresh session|Durable cursor' packs/product-design/codex/state-model/SKILL.md packs/product-design/claude/state-model/SKILL.md packs/product-design/codex/ux-variations/SKILL.md packs/product-design/claude/ux-variations/SKILL.md docs/design-tree-loop-convention.md`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `pnpm --dir tests exec vitest run layer1/product-design-flow-tree.test.ts layer1/skill-alignment-routing-audit.test.ts layer1/frontmatter.test.ts`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `git diff --check`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/base-skill-version-parity-audit.sh`

## Skipped Tests

- Did not run the full repository test matrix. The change is scoped to skill contracts, generated convention bundles, generated catalog data, and a Layer 1 contract test; focused Layer 1, bundle, archive, mirror, package, and generated-data checks cover the affected surfaces.
- Did not refresh or commit untracked `.codex/skills` / `.claude/skills` local install mirrors. The requested source of truth is the canonical pack source; local install roots are not tracked as the shipping boundary.

## Adversarial Review

- Checked whether the fix should live only in `state-model` and `ux-variations`; rejected that as incomplete because the user asked to extend the newer design-tree contract. The convention-level block plus skill-local examples is the lower-drift approach.
- Checked whether to edit archived malformed paths; rejected that because archives must preserve historical versions and the plan explicitly allowed historical archive paths to remain.
- Checked whether to add a separate run manifest/status ledger; rejected that because the design-tree contract says filesystem existence of intermediates is the cursor and the brief must remain pure context.
- Broad `rg` without archive exclusion still finds historical Codex `state-model` archive hits, including the newly archived v0.3 snapshot. Active-source guard with `--glob '!**/archive/**'` is clean.

## Residual Risk

- The Progress Handoff Block is a contract change; actual runtime compliance still depends on future agents following the skill text. The added Layer 1 checks prevent removal of the contract but do not execute a live skill session.
- Generated `docs/benchmark-results-matrix.md` picked up current local benchmark-run metadata as part of the mandated showcase data refresh. It is generated output and was validated fresh.

## Rollback Note

Revert the commit to restore the prior design-tree convention, active skill contracts, generated bundles/data, and tests. The archived prior `SKILL.md` snapshots remain under `archive/` for manual comparison.

## Next Command

`$brainstorm`
