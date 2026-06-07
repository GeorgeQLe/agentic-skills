# Ship Manifest — Product Design Customer-Discovery Routing

## User Goal

Execute the next `$exec` step: Phase 4.8 product-design pack routing, preserving ICP evidence artifacts while removing or preventing retired `icp` executable routes.

## Changed Files

- `prompts/exec/skill-prompt-20260607-114450-exec.md`
- `tests/layer1/product-design-customer-discovery-routing.test.ts`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-07-product-design-routing.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260607-114450-exec.md`: capture the visible `$exec` invocation per repo prompt-history policy.
- `tests/layer1/product-design-customer-discovery-routing.test.ts`: prevent active product-design contracts from reintroducing `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP`.
- `apps/skills-showcase/public/assets/github-proof-data.js`: refresh generated proof fingerprint after showcase validation detected stale generated data.
- `docs/skills-showcase/assets/github-proof-data.js`: refresh generated proof fingerprint for the static docs copy.
- `tasks/todo.md`: mark Phase 4.8 complete, record review notes, and add a self-contained Phase 4.9 product-testing plan.
- `tasks/history.md`: record the completed execution step and validation evidence.
- `tasks/ship-manifest-2026-06-07-product-design-routing.md`: document the quality gate and shipping boundary.

## User-Goal Mapping

- The audit verified the named product-design skills do not currently route to the retired `icp` executable.
- The new regression test keeps the completed step enforceable without unnecessary skill version churn.
- The task and history updates preserve the execution trail and prepare the next `$exec` handoff.
- The generated proof data change satisfies the validator that runs as part of the shipping boundary.

## Tests Run

- `rg --pcre2 -n '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|icp-needed|Proceed to ICP' -g '!**/archive/**' packs/product-design` — returned no matches; exit 1 is expected for an empty `rg` result.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-customer-discovery-routing.test.ts` — passed, 1 file and 1 test.
- `scripts/skill-versions.sh --missing` — passed, all 405 skills have a version field.
- `scripts/skill-archive-audit.sh --strict` — passed, 357 skills checked, 0 violations.
- `scripts/skill-deps.sh --broken` — passed, no broken references found.
- `scripts/skill-pack-routing-audit.sh` — passed, no cross-pack recommendation gaps found.
- `node scripts/generate-skills-showcase-data.mjs` — completed.
- `node scripts/generate-skills-showcase-github-data.mjs` — completed.
- `scripts/validate-skills-showcase-data.sh` — passed after regeneration; generated data fresh.
- `pnpm --dir apps/skills-showcase build` — passed.
- `git diff --check` — passed.

## Skipped Tests

- Full `pnpm --dir tests test` was not rerun because the current step adds a focused layer1 routing guard and recent task history records unrelated broad layer1 failures from stale customer-discovery rename drift. The focused route test plus active-file scan cover the changed behavior.
- `node scripts/upgrade-alignment-page.mjs --dry-run` was not run because no active `SKILL.md`, `PACK.md`, alignment convention, or alignment bundle changed.

## Adversarial Review

Changed-file self-review plus targeted active-route scans looked for accidental scope growth, stale route text, and ICP artifact renames. Findings:

- No active product-design skill contract needed a behavior edit; changing versions would have added metadata churn without routing benefit.
- The new test covers all active product-design `SKILL.md` mirrors, not only the three named target files.
- Generated asset drift is limited to deterministic `sourceFingerprint` changes in the docs and app copies.
- `pnpm --dir apps/skills-showcase build` rewrote `apps/skills-showcase/next-env.d.ts` from dev routes to build routes; that build-mode churn was restored and excluded from the shipping boundary.

No unresolved review findings remain in this boundary.

## Residual Risk

The test rejects retired executable command syntax in active product-design skill files, but it does not assert future positive routing to `customer-discovery` because no active product-design handoff currently requires that route. If future product-design skills add missing-discovery prerequisite routes, they should add a positive route assertion alongside the negative guard.

## Rollback Note

Revert the shipping commit to remove the regression test, prompt log, task/history updates, manifest, and generated proof fingerprint refresh. No active skill contracts or runtime app code were changed.

## Next Command

`$exec`
