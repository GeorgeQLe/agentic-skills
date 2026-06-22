# Ship Manifest - Consolidate Prototypes Graduation

## User Goal

Rename the primary consolidation skill from `consolidate-variations` to `consolidate-prototypes`, keep a deprecated alias, and add AFPS graduation as the approved-MVP handoff artifact before post-prototype cleanup and production spec work.

## Changed Files

- Primary skill contracts: `packs/product-design/{claude,codex}/consolidate-prototypes/**`
- Deprecated aliases: `packs/product-design/{claude,codex}/consolidate-variations/**`
- Handoff gates: `packs/research-admin/{claude,codex}/research-roadmap/**`, `packs/product-design/{claude,codex}/spec-interview/**`
- Route references: product-design, product-testing, roadmap, bootstrap, teardown, base status/catalog skills and docs.
- Conventions/generated bundles: `docs/design-tree-loop-convention.md`, `DESIGN-TREE-LOOP.md`, `ALIGNMENT-PAGE.md`, `INTERROGATION-PAGE.md`
- Generated assets: Skills Showcase data, benchmark matrix, skillpacks manifest.
- Tests/task records: focused Layer 1 tests, prompt history, `tasks/todo.md`, `tasks/history.md`.

## Per-File Purpose

- `consolidate-prototypes`: owns evaluated source prototype convergence, consolidated MVP output, AFPS graduation, and post-prototype handoff.
- `consolidate-variations`: compatibility route only; no duplicated process.
- `research-roadmap`: reads graduation and queues only contradicted, stale, or pre-spec-blocking research in `--post-prototype`.
- `spec-interview`: accepts graduation as readiness evidence while preserving consolidated prototype and cleanup blocker gates.
- Route docs/tests/generated assets: keep maps, showcase, package metadata, and validation fixtures aligned with the new primary command.

## User-Goal Mapping

- Rename: active route/schema/docs now use `consolidate-prototypes`; alias keeps old command working.
- Graduation: required `design/afps-graduation-{topic}.md` / `design/{slug}/afps-graduation-{topic}.md` content is specified.
- Research cleanup: post-prototype mode is graduation-aware and narrower.
- Spec gate: requires prototype, graduation/equivalent readiness, and no blocking post-prototype items.

## Tests Run

- `rg -n "$consolidate-variations|/consolidate-variations|consolidate-variations" ... --glob '!**/archive/**' --glob '!tests/benchmarks/runs/**'`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-interrogation-pages.mjs`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/base-skill-version-parity-audit.sh`
- `pnpm --dir tests exec vitest run layer1/product-design-flow-tree.test.ts layer1/research-roadmap-routing.test.ts layer1/routing-graph.test.ts layer1/frontmatter.test.ts layer1/afps-alignment-preview-gates.test.ts`
- `npm run skillpacks:verify`
- `git diff --check`

## Skipped Tests

- Full website build and full Playwright were skipped because this change is skill metadata, docs, tests, and generated catalog/package data, not app runtime UI behavior. Residual risk is limited to generated showcase display copy, covered by the showcase data validator and skillpacks package verification.

## Adversarial Review

- Checked that active old-command hits are limited to deprecated alias, changelog/formerly notes, benchmark evidence paths, and generated alias catalog entries.
- Checked Claude/Codex mirror parity and base version parity.
- Checked archive/changelog integrity after all SKILL.md version bumps.
- Checked generated package boundary through `npm run skillpacks:verify`.

## Residual Risk

- Historical benchmark run paths and prompts still contain `consolidate-variations`; these are intentionally preserved as historical evidence.
- The compatibility alias adds two active skills, so catalog counts increase from 385 to 387 after this session's earlier state.

## Rollback Note

Revert the commit to restore `consolidate-variations` as the primary skill and remove the graduation-aware gates. If only the alias causes catalog noise, remove `packs/product-design/{claude,codex}/consolidate-variations/` in a follow-up after confirming no users rely on it.

## Next Command

`$brainstorm`
