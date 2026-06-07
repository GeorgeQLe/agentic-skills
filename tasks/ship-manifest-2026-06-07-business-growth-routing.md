# Ship Manifest — Business Growth Customer-Discovery Routing

## User goal

Execute the next `$exec` step: update business-growth pack skills so retired executable `icp` handoffs route to `customer-discovery`, then validate, document, commit, and push.

## Changed files

- `packs/business-growth/{codex,claude}/experiment/SKILL.md`
- `packs/business-growth/{codex,claude}/gtm/SKILL.md`
- `packs/business-growth/{codex,claude}/monetization/SKILL.md`
- `packs/business-growth/{codex,claude}/pmf-assessment/SKILL.md`
- `packs/business-growth/{codex,claude}/{experiment,gtm,monetization,pmf-assessment}/CHANGELOG.md`
- `packs/business-growth/{codex,claude}/{experiment,gtm,monetization,pmf-assessment}/archive/*/SKILL.md`
- `tests/layer1/business-growth-customer-discovery-routing.test.ts`
- `docs/skills-showcase/assets/{skills-data.js,github-proof-data.js}`
- `apps/skills-showcase/public/assets/{skills-data.js,github-proof-data.js}`
- `prompts/exec/skill-prompt-20260607-000514-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-07-business-growth-routing.md`

## Per-file purpose

- Active business-growth `SKILL.md` files: replace retired `$icp`/`/icp` executable handoffs with `$customer-discovery`/`/customer-discovery` and bump versions.
- Business-growth changelogs: document the routing behavior updates.
- Archive snapshots: preserve pre-change skill contracts before version bumps.
- Routing regression test: prevent active business-growth contracts from reintroducing retired discovery command handoffs.
- Showcase assets: refresh generated skill metadata after active `SKILL.md` metadata changed.
- Prompt history: record the visible `$exec` invocation.
- Task/history/manifest docs: record completion, validation, residual risk, and next-step plan.

## User-goal mapping

- The route-bearing business-growth skills now point users at the current customer-discovery executable.
- Evidence artifact names remain stable, so downstream research docs do not churn.
- Regression coverage protects the exact retired-command failure mode named by this phase.
- Task docs now hand the next session a self-contained Phase 4.7 business-ops plan.

## Tests run

Executable verification:

- `rg -n --pcre2 --glob SKILL.md --glob '!**/archive/**' '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|icp-needed|Proceed to ICP' packs/business-growth/codex packs/business-growth/claude` — no matches, expected exit 1.
- `pnpm --dir tests exec vitest run --project layer1 layer1/business-growth-customer-discovery-routing.test.ts layer1/journey-map-routing.test.ts layer1/codex-interview-cadence.test.ts` — 3 files, 19 tests passed.
- `scripts/skill-versions.sh --missing` — all 405 skills have a version field.
- `scripts/skill-archive-audit.sh --strict` — 357 skills checked, 0 violations.
- `scripts/skill-deps.sh --broken` — no broken references.
- `scripts/skill-pack-routing-audit.sh` — no cross-pack recommendation gaps.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — 0 updates, 0 bundled files written.
- `node scripts/generate-skills-showcase-data.mjs`
- `node scripts/generate-skills-showcase-github-data.mjs`
- `scripts/validate-skills-showcase-data.sh` — generated data fresh.
- `pnpm --dir apps/skills-showcase build` — passed after sandbox escalation; the sandboxed attempt failed because Turbopack could not bind a worker port.
- `git diff --check` — passed.

Documentation/task checks:

- Reviewed `tasks/manual-todo.md`; no current-phase manual blocker applies.
- Counted advisory queues: no `tasks/record-todo.md`; `tasks/recurring-todo.md` has 2 unchecked advisory items.

## Skipped tests

- Full `pnpm --dir tests test` was not run because the current task is a focused skill-route cleanup and the repository already documents broad unrelated layer1 failures after the customer-discovery rename.
- `layer1/product-path-manifest.test.ts` was attempted in an initial broader targeted run and failed on pre-existing drift: it still references absent `packs/business-discovery/{codex,claude}/icp/SKILL.md` paths and expects product-path wording in business-discovery `five-rings`. Those paths are absent at `HEAD`, and this diff does not touch that test or business-discovery contracts.

## Adversarial review

Changed-file self-review checked that active contract edits are limited to command handoffs and version metadata. The targeted active-route scan verifies no business-growth active `SKILL.md` still recommends `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP`. The diff preserves ICP artifact references and does not rename `research/icp.md`.

## Residual risk

Business-growth conceptual ICP references remain by design. The known `product-path-manifest` drift is outside this shipping boundary and should be handled by a dedicated test/contract reconciliation step rather than mixed into Phase 4.6.

## Rollback note

Revert the shipping commit to restore the previous business-growth routing contracts, changelogs, generated showcase data, task docs, prompt log, and regression test in one step. Archive snapshots also preserve the pre-change active contracts under each affected skill directory.

## Next command

`$exec`
