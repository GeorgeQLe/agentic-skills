# Ship Manifest — Skills Showcase Pack Counts

## User goal

Run `$exec` for the next task: update the Skills Showcase pack list so every pack is represented and pack skill counts match generated source data.

## Changed files

- `prompts/exec/skill-prompt-20260607-215005-exec-next-step.md`
- `scripts/generate-skills-showcase-data.mjs`
- `apps/skills-showcase/src/showcase/catalog.tsx`
- `apps/skills-showcase/app/globals.css`
- `apps/skills-showcase/src/showcase/catalog.test.tsx`
- `tests/layer1/skills-showcase-pack-coverage.test.ts`
- `tests/layer1/skills-showcase-benchmark-demo.test.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-08-skills-showcase-pack-counts.md`

Unrelated untracked file left out of the shipping boundary: `alignment/index.html`.

## Per-file purpose

- Prompt history: records the visible `$exec` invocation.
- Generator: includes active nested pack skills outside archives and builds pack rows from all active `PACK.md` metadata plus active compatibility aliases.
- Catalog UI/CSS/test: renders generated pack counts on pack nodes and detail panels, and labels compatibility packs correctly.
- Layer1 tests: prove all active `PACK.md` rows are represented, nested framework skills are counted, and benchmark demo coverage targets a row that actually has retained demo excerpts.
- Generated assets/matrix: refreshed after generator and test/proof source changes.
- Task/history/manifest docs: record completion, validation, residual risk, and next work.

## User-goal mapping

- All active `packs/*/PACK.md` files now appear in generated pack data.
- Nested framework `SKILL.md` files now appear in generated skills and pack counts.
- The public pack map now displays each pack's generated count instead of relying on invisible data or static copy.
- Compatibility packs with no direct skills (`business-app`, `creator-media`) remain represented and are labeled as aliases.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/skills-showcase-pack-coverage.test.ts` — passed, 2/2 tests.
- `pnpm --dir apps/skills-showcase test src/showcase/catalog.test.tsx` — passed, 20/20 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/skills-showcase-pack-coverage.test.ts layer1/skills-showcase-benchmark-demo.test.ts` — initially exposed a stale benchmark-demo fixture, then passed after the test targeted a demo-backed `pack` benchmark row; 8/8 tests.
- `node scripts/generate-skills-showcase-data.mjs` — passed; generated 355 skills and 39 packs.
- `node scripts/generate-skills-showcase-github-data.mjs` — passed; generated 4 proof artifacts and 6 validation scripts.
- `scripts/validate-skills-showcase-data.sh` — passed; generated data is fresh.
- `pnpm --dir apps/skills-showcase build` — passed; Next.js compiled and generated 15 static pages plus the dynamic tRPC route.
- `curl -sS -D /tmp/skills-showcase-packs.headers http://127.0.0.1:3000/packs -o /tmp/skills-showcase-packs.html` — local `/packs` route returned `200 OK` while the dev server was running.
- `git diff --check` — passed.
- Adversarial invariant scan: generated data includes 338/338 active pack skill source paths, includes no archive skill paths, and includes all 37 active `PACK.md` metadata rows.

## Skipped tests

- Full `pnpm --dir tests test` was not run because the active task notes already document broad unrelated layer1 failures from stale customer-discovery rename drift and other existing harness issues. The targeted generator, catalog, build, freshness, local route, and invariant checks cover this shipping boundary.
- Browser-plugin visual screenshot verification was not run because the Browser tool was not exposed in this session. Local route serving, jsdom catalog rendering tests, and the production build cover the changed behavior; remaining visual risk is noted below.

## Adversarial review

Method: changed-file self-review plus targeted invariant scans. Findings:

- Risk: generator might include archive skills. Check passed with `archives: 0`.
- Risk: generator might miss nested framework skills. Check passed with `activePackSkills: 338`, `generatedPackSkills: 338`, `missing: 0`.
- Risk: `PACK.md` compatibility packs could remain invisible. Check passed with all 37 active pack metadata rows represented and only `business-app`/`creator-media` at zero direct skills.
- Risk: benchmark-demo regression test was stale. Fixed by targeting the demo-backed `pack` benchmark evidence row and reran passing layer1 checks.

## Residual risk

The count label is covered by DOM tests and build checks but not by an automated browser screenshot because Browser tooling was unavailable. If visual spacing regresses on a real viewport, it should show up on `/packs`; first follow-up check is to open `http://127.0.0.1:3000/packs` with Browser tooling when available.

## Rollback note

Revert the shipping commit to restore the prior top-level-only generator behavior and remove the visible pack-count labels. Then regenerate showcase assets with the existing generator.

## Next command

`$exec`
