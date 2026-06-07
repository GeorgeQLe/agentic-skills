# Ship Manifest: Remaining Pack Customer-Discovery Routing

## User Goal

Execute the next `$exec` step: Phase 4.10 remaining-pack routing cleanup for research-admin, repo-maintenance, docs-health, teardown, and monorepo packs.

## Changed Files

- `apps/skills-showcase/next-env.d.ts`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `packs/monorepo/claude/scaffold/CHANGELOG.md`
- `packs/monorepo/claude/scaffold/SKILL.md`
- `packs/monorepo/claude/scaffold/archive/v0.0/SKILL.md`
- `packs/monorepo/codex/scaffold/CHANGELOG.md`
- `packs/monorepo/codex/scaffold/SKILL.md`
- `packs/monorepo/codex/scaffold/archive/v0.0/SKILL.md`
- `packs/repo-maintenance/claude/bootstrap-repo/CHANGELOG.md`
- `packs/repo-maintenance/claude/bootstrap-repo/SKILL.md`
- `packs/repo-maintenance/claude/bootstrap-repo/archive/v0.1/SKILL.md`
- `packs/repo-maintenance/codex/bootstrap-repo/CHANGELOG.md`
- `packs/repo-maintenance/codex/bootstrap-repo/SKILL.md`
- `packs/repo-maintenance/codex/bootstrap-repo/archive/v0.1/SKILL.md`
- `packs/research-admin/claude/research-roadmap/CHANGELOG.md`
- `packs/research-admin/claude/research-roadmap/SKILL.md`
- `packs/research-admin/claude/research-roadmap/archive/v0.13/SKILL.md`
- `packs/research-admin/codex/research-roadmap/CHANGELOG.md`
- `packs/research-admin/codex/research-roadmap/SKILL.md`
- `packs/research-admin/codex/research-roadmap/archive/v0.13/SKILL.md`
- `packs/teardown/claude/desk-flip/CHANGELOG.md`
- `packs/teardown/claude/desk-flip/SKILL.md`
- `packs/teardown/claude/desk-flip/archive/v0.2/SKILL.md`
- `packs/teardown/codex/desk-flip/CHANGELOG.md`
- `packs/teardown/codex/desk-flip/SKILL.md`
- `packs/teardown/codex/desk-flip/archive/v0.2/SKILL.md`
- `prompts/exec/skill-prompt-20260607-120433-exec.md`
- `tasks/history.md`
- `tasks/todo.md`
- `tests/layer1/remaining-packs-customer-discovery-routing.test.ts`
- `tests/layer1/research-roadmap-routing.test.ts`

## Per-File Purpose

- `packs/research-admin/{claude,codex}/research-roadmap/SKILL.md`: route direct queued discovery commands from retired `icp` to `customer-discovery`.
- `packs/repo-maintenance/{claude,codex}/bootstrap-repo/SKILL.md`: route product bootstrap recommendations to `customer-discovery`.
- `packs/teardown/{claude,codex}/desk-flip/SKILL.md`: route post-bootstrap restart guidance to `customer-discovery`.
- `packs/monorepo/{claude,codex}/scaffold/SKILL.md`: route early-shell follow-up guidance to `customer-discovery`.
- `CHANGELOG.md` files in touched skill dirs: record version bumps and behavior changes.
- `archive/*/SKILL.md` files: preserve previous active contracts before version bumps.
- `tests/layer1/remaining-packs-customer-discovery-routing.test.ts`: prevent retired executable route regressions across active remaining-pack contracts.
- `tests/layer1/research-roadmap-routing.test.ts`: align direct-route examples with `customer-discovery`.
- Showcase asset files: refresh generated metadata and fingerprints after tracked skill versions changed.
- `apps/skills-showcase/next-env.d.ts`: build-generated Next.js route type import updated by the successful production build.
- `prompts/exec/...`: required prompt history capture for this skill invocation.
- `tasks/todo.md`: mark Phase 4.10 complete, record review notes, and prepare the next Future Work plan.
- `tasks/history.md`: record the shipped session outcome.

## User-Goal Mapping

The route-bearing remaining packs now recommend `customer-discovery` instead of retired `$icp`/`/icp` command routes. The docs-health files were inspected and left as artifact-only references. Version archives, changelogs, generated showcase metadata, prompt history, tests, task docs, and history are required by repository workflow policy for skill-contract mutations.

## Tests Run

- `rg -n --pcre2 --glob '!**/archive/**' --glob '**/SKILL.md' '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|icp-needed|Proceed to ICP' packs/research-admin packs/repo-maintenance packs/docs-health packs/teardown packs/monorepo` — passed by returning no matches.
- `pnpm --dir tests exec vitest run --project layer1 layer1/remaining-packs-customer-discovery-routing.test.ts layer1/research-roadmap-routing.test.ts` — passed, 2 files / 4 tests.
- `scripts/skill-versions.sh --missing` — passed, all 405 skills have version fields.
- `scripts/skill-archive-audit.sh --strict` — passed, 357 skills checked, 0 violations.
- `scripts/skill-deps.sh --broken` — passed, no broken references.
- `scripts/skill-pack-routing-audit.sh` — passed, no cross-pack recommendation gaps.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — passed, no bundled alignment drift.
- `node scripts/generate-skills-showcase-data.mjs` — passed.
- `node scripts/generate-skills-showcase-github-data.mjs` — passed.
- `scripts/validate-skills-showcase-data.sh` — passed, generated data fresh.
- `pnpm --dir apps/skills-showcase build` — passed, Next.js production build completed.
- `git diff --check` — passed.

## Skipped Tests

- Full `pnpm --dir tests test` was not run because current task notes already document unrelated broad-suite failures around stale customer-discovery rename/alignment drift. The changed behavior is covered by targeted route tests, active-file scans, skill integrity checks, showcase validation, and app build.
- Production deploy and live route smoke tests were not run because `tasks/deploy.md` targets Vercel production and deployment requires explicit user confirmation.

## Adversarial Review

Changed-file self-review plus targeted active-route scans checked whether the diff accidentally renamed `research/icp.md`, missed active route-bearing files, included archives in assertions, or changed non-route skill behavior. No current-diff issue found. The generated `next-env.d.ts` change was reviewed and kept because the successful build produced it.

## Residual Risk

Residual risk is limited to future operators expecting the retired `icp` executable spelling inside long-form docs or archived contracts. Active `SKILL.md` files across the five remaining packs are covered by a dynamic regression test and boundary-aware scan.

## Rollback Note

Revert the shipping commit to restore previous route contracts, changelogs, archives, generated showcase metadata, tests, prompt history, and task docs. If only the route change causes trouble, restore the archived `SKILL.md` versions and regenerate showcase data.

## Next Command

`$exec`
