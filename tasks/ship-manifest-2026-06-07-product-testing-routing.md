# Ship Manifest — Product Testing Customer-Discovery Routing

## User Goal

Execute the next `$exec` step: Phase 4.9 product-testing pack routing, replacing retired `icp` executable handoffs with `customer-discovery` while preserving ICP evidence artifacts.

## Changed Files

- `prompts/exec/skill-prompt-20260607-115226-exec.md`
- `packs/product-testing/codex/dogfood/SKILL.md`
- `packs/product-testing/claude/dogfood/SKILL.md`
- `packs/product-testing/codex/uat/SKILL.md`
- `packs/product-testing/claude/uat/SKILL.md`
- `packs/product-testing/codex/dogfood/archive/v0.2/SKILL.md`
- `packs/product-testing/claude/dogfood/archive/v0.2/SKILL.md`
- `packs/product-testing/codex/uat/archive/v0.8/SKILL.md`
- `packs/product-testing/claude/uat/archive/v0.8/SKILL.md`
- `packs/product-testing/codex/dogfood/CHANGELOG.md`
- `packs/product-testing/claude/dogfood/CHANGELOG.md`
- `packs/product-testing/codex/uat/CHANGELOG.md`
- `packs/product-testing/claude/uat/CHANGELOG.md`
- `tests/layer1/product-testing-customer-discovery-routing.test.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-07-product-testing-routing.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260607-115226-exec.md`: capture the visible `$exec` invocation per repo prompt-history policy.
- Product-testing active `SKILL.md` files: change missing-discovery and follow-up route examples from retired `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery`.
- Product-testing `archive/*/SKILL.md` files: preserve the prior active contracts before version bumps.
- Product-testing `CHANGELOG.md` files: record the route behavior change for each affected mirror.
- `tests/layer1/product-testing-customer-discovery-routing.test.ts`: prevent active product-testing contracts from reintroducing retired discovery executable routes.
- Skills Showcase generated assets: refresh public/catalog metadata after active `SKILL.md` versions changed and after history gained the new proof entry.
- `tasks/todo.md`: mark Phase 4.9 complete, record review notes, and add the Phase 4.10 execution plan.
- `tasks/history.md`: record the shipped execution step and validation evidence.
- This manifest: document the quality gate and exact shipping boundary.

## User-Goal Mapping

- The active `dogfood` and `uat` mirrors now route missing-discovery cases to `customer-discovery` using the correct runner syntax.
- The archive, version, and changelog updates satisfy the repository skill-versioning contract.
- The regression test and active-file scans make the route migration enforceable.
- Task/history/manifest updates satisfy the `$exec` shipping workflow and prepare the next step.

## Tests Run

- `rg --pcre2 -n '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|icp-needed|Proceed to ICP' -g 'SKILL.md' -g '!**/archive/**' packs/product-testing` — returned no matches; exit 1 is expected for an empty `rg` result.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-testing-customer-discovery-routing.test.ts` — passed, 1 file and 2 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-testing-customer-discovery-routing.test.ts layer1/afps-alignment-preview-gates.test.ts layer1/alignment-gates.test.ts` — product-testing test passed, command failed on two pre-existing unrelated assertions: absent `packs/business-discovery/claude/icp/SKILL.md` at `HEAD`, and missing global `afps-status` alignment wording at `HEAD`.
- `scripts/skill-versions.sh --missing` — passed, all 405 skills have a version field.
- `scripts/skill-archive-audit.sh --strict` — passed, 357 skills checked, 0 violations.
- `scripts/skill-deps.sh --broken` — passed, no broken references found.
- `scripts/skill-pack-routing-audit.sh` — passed, no cross-pack recommendation gaps found.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — passed, 0 updates.
- `node scripts/generate-skills-showcase-data.mjs` — completed.
- `node scripts/generate-skills-showcase-github-data.mjs` — completed.
- `scripts/validate-skills-showcase-data.sh` — passed after regeneration; generated data fresh.
- `pnpm --dir apps/skills-showcase build` — passed.
- `git diff --check` — passed after final generated-data refresh.

## Skipped Tests

- Full `pnpm --dir tests test` was not rerun because the current step changes only product-testing route contracts and generated showcase metadata, while recent task history records broad suite failures from stale customer-discovery rename drift outside this ownership path. The focused route test, SKILL-only active scan, and skill integrity checks cover the changed behavior.
- Production deploy was not run because this changed skill contracts, tests, task docs, prompt history, and generated static showcase data only; `tasks/deploy.md` requires explicit production deploy confirmation.

## Adversarial Review

Changed-file self-review plus targeted active-route scans checked for accidental scope growth, stale route examples, archive/version omissions, and ICP artifact renames.

Findings:
- The diff changes route handoffs only; `research/icp.md` remains an evidence artifact.
- Changelog files intentionally mention retired `$icp`/`/icp`; the behavioral scan is scoped to active `SKILL.md` files.
- The attempted broader alignment command exposed already-known repo drift outside this boundary. `git show HEAD:packs/business-discovery/claude/icp/SKILL.md` fails because that old path is absent at `HEAD`, and `git grep` found the expected global `afps-status` wording absent at `HEAD`.
- `pnpm --dir apps/skills-showcase build` rewrote `apps/skills-showcase/next-env.d.ts` from dev routes to build routes; that build-mode churn was restored and excluded from the shipping boundary.

No unresolved review findings remain in this boundary.

## Residual Risk

The test covers active product-testing `dogfood` and `uat` contracts, which are the route-bearing files selected by the phase. It does not scan archived contracts because archives intentionally preserve historical retired command text. If a future product-testing skill gains a discovery prerequisite route, it should be added to `product-testing-customer-discovery-routing.test.ts`.

## Rollback Note

Revert the shipping commit to restore the prior product-testing route contracts, remove the regression test, remove the new archives/changelog entries, and roll back the generated showcase and task/history updates.

## Next Command

`$exec`
