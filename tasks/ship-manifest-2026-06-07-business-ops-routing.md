# Ship Manifest: Business-Ops Customer-Discovery Routing

## User Goal

Execute the next `$exec` step: Phase 4.7, update business-ops pack skills so retired executable `icp` handoffs route to `customer-discovery`.

## Changed Files

- `apps/skills-showcase/public/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `packs/business-ops/claude/mvp-gap/SKILL.md`
- `packs/business-ops/claude/mvp-gap/CHANGELOG.md`
- `packs/business-ops/claude/mvp-gap/archive/v0.5/SKILL.md`
- `packs/business-ops/claude/platform-strategy/SKILL.md`
- `packs/business-ops/claude/platform-strategy/CHANGELOG.md`
- `packs/business-ops/claude/platform-strategy/archive/v0.6/SKILL.md`
- `packs/business-ops/claude/product-line/SKILL.md`
- `packs/business-ops/claude/product-line/CHANGELOG.md`
- `packs/business-ops/claude/product-line/archive/v0.2/SKILL.md`
- `packs/business-ops/claude/retro/SKILL.md`
- `packs/business-ops/claude/retro/CHANGELOG.md`
- `packs/business-ops/claude/retro/archive/v0.2/SKILL.md`
- `packs/business-ops/codex/mvp-gap/SKILL.md`
- `packs/business-ops/codex/mvp-gap/CHANGELOG.md`
- `packs/business-ops/codex/mvp-gap/archive/v0.5/SKILL.md`
- `packs/business-ops/codex/platform-strategy/SKILL.md`
- `packs/business-ops/codex/platform-strategy/CHANGELOG.md`
- `packs/business-ops/codex/platform-strategy/archive/v0.6/SKILL.md`
- `packs/business-ops/codex/product-line/SKILL.md`
- `packs/business-ops/codex/product-line/CHANGELOG.md`
- `packs/business-ops/codex/product-line/archive/v0.2/SKILL.md`
- `packs/business-ops/codex/retro/SKILL.md`
- `packs/business-ops/codex/retro/CHANGELOG.md`
- `packs/business-ops/codex/retro/archive/v0.2/SKILL.md`
- `prompts/exec/skill-prompt-20260607-113410-exec.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-07-business-ops-routing.md`
- `tasks/todo.md`
- `tests/layer1/business-ops-customer-discovery-routing.test.ts`

## Per-File Purpose

- Business-ops `SKILL.md` files: replace retired executable `$icp` or `/icp` handoffs with `$customer-discovery` or `/customer-discovery` while preserving ICP artifact/concept references.
- Business-ops `CHANGELOG.md` files: document the behavioral route updates for each bumped skill version.
- Business-ops `archive/*/SKILL.md` files: preserve the prior active contracts before version bumps.
- Skills Showcase generated assets: reflect updated skill versions and refreshed proof metadata after tracked `SKILL.md` metadata changed.
- Prompt history: record the visible `$exec` invocation as required by the project skill-invocation contract.
- `tests/layer1/business-ops-customer-discovery-routing.test.ts`: prevent business-ops contracts from regressing to retired executable `icp` handoffs.
- `tasks/todo.md`, `tasks/history.md`, and this manifest: record the completed step, review evidence, next-step plan, and shipping boundary.

## User-Goal Mapping

- The route-bearing business-ops skills named in Phase 4.7 now point users to the active `customer-discovery` skill instead of the retired `icp` executable.
- The new layer1 test covers all ten business-ops skills named in the phase, including inspected no-change skills.
- Generated showcase data stays consistent with the changed `SKILL.md` metadata.
- Task docs now mark Phase 4.7 complete and prepare Phase 4.8 for the next `$exec`.

## Tests Run

- `rg -n --pcre2 '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|icp-needed|Proceed to ICP' packs/business-ops/codex packs/business-ops/claude -g 'SKILL.md' -g '!**/archive/**'` — no matches.
- `pnpm --dir tests exec vitest run --project layer1 layer1/business-ops-customer-discovery-routing.test.ts` — 1 file, 2 tests passed.
- `node scripts/generate-skills-showcase-data.mjs` — wrote fresh showcase data.
- `node scripts/generate-skills-showcase-github-data.mjs` — wrote fresh proof data.
- `scripts/validate-skills-showcase-data.sh` — passed; generated data is fresh.
- `scripts/skill-versions.sh --missing` — passed; all 405 skills have version fields.
- `scripts/skill-archive-audit.sh --strict` — passed; 357 skills checked, 0 violations.
- `scripts/skill-deps.sh --broken` — passed; no broken references.
- `scripts/skill-pack-routing-audit.sh` — passed; no cross-pack recommendation gaps.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — passed; updated 0, bundled files written 0.
- `pnpm --dir apps/skills-showcase build` — passed.
- `git diff --check` — passed.

## Skipped Tests

- `tests/layer1/product-path-manifest.test.ts` was not rerun. It references business-ops `platform-strategy` and `product-line`, but current task notes already document a broader pre-existing failure on stale customer-discovery rename drift outside this step, including absent `packs/business-discovery/{codex,claude}/icp/SKILL.md` paths. This diff does not touch that ownership path or product-path manifest semantics.
- Full `pnpm --dir tests test` was not rerun because the current task notes document known unrelated layer1 failures. The changed behavior is covered by the targeted active-route scan, new route regression test, skill integrity checks, generated-data validation, and app build.

## Adversarial Review

Changed-file self-review plus targeted active-route scans checked for accidental artifact renames, manifest-schema expansion, stale executable `$icp`/`/icp` handoffs, and generated-data drift. No issues found. `apps/skills-showcase/next-env.d.ts` was temporarily changed by `next build` and restored because it was validation churn, not part of the route-cleanup boundary.

## Residual Risk

The remaining risk is that a non-`SKILL.md` business-ops document still mentions the retired executable route. This phase targeted active skill contracts only; the active-file scan and regression test cover the executable user-facing skill surfaces named in the task.

## Rollback Note

Revert the shipping commit to restore previous business-ops routing contracts, changelogs, generated showcase assets, task docs, and regression coverage. If only the skill behavior needs rollback, restore the archived `SKILL.md` files for the affected versions and regenerate showcase data.

## Next Command

`$exec`
