# Ship Manifest — 2026-06-10 — Benchmark Harness Code Review Fixes (Reconcile + Coverage)

## User goal

Execute the accepted plan "Benchmark Harness Code Review Fixes (Expert-Review High Items)": resolve the 3 open High items from the 2026-05-29 `/expert-review` (destructive `gh repo delete` guard, temp-dir leak, resume-session ordering), add focused tests with no live GitHub calls, and check off the High items in `tasks/todo.md`.

## Finding that changed the boundary

All three High items were already fixed on 2026-05-30 by commit `f7eb21cf` ("fix(bench-tests): guard destructive repo delete, stop temp-dir leaks, sort resume by time"), with unit coverage for items #4 and #6 in `tests/layer1/code-review-test-infra-fixes.test.ts`. The plan's claim that the issues were "re-verified present on 2026-06-10" was wrong — only the todo checkboxes were stale. This ship therefore contains: (a) verification of each fix against the plan's acceptance criteria, (b) new tests closing the one real coverage gap (item #5, temp-dir reclaim), and (c) task-doc reconciliation.

## Changed files

1. `tests/layer1/code-review-test-infra-fixes.test.ts`
2. `tasks/todo.md`
3. `tasks/history.md`
4. `tasks/ship-manifest-2026-06-10-bench-review-fixes-reconcile.md` (this file)
5. `prompts/ship/skill-prompt-20260610-120837-bench-review-fixes.md`

## Per-file purpose

1. Test file — new `cleanupRepo temp-dir reclaim (#5 leak fix)` describe block (3 tests): unsafe-slug refusal and denied-confirm paths both remove the work dir before any `gh` invocation; missing/already-removed dir tolerated. Imports `cleanupRepo` and exercises only the gh-free early-return paths.
2. `tasks/todo.md` — checked off the 4 plan steps with already-shipped notes; checked off the 3 `## Code Review Fixes` High items with `f7eb21cf` attribution; added `### Review Notes — Benchmark Harness Code Review Fixes`; reconciled a stale Phase 5 `pnpm --dir tests test` checkbox (its listed failures were fixed long ago; layer1 is green); added execution profile, acceptance criteria, and ship-one-step contract to the existing next-step plan (Drawer Close Visible Top-Left Collapse).
3. `tasks/history.md` — session record.
4. Manifest — quality-gate record for this boundary.
5. Prompt log — visible user invocation per the repo Prompt History convention.

## User-goal mapping

- Goal items 1–3 (the three fixes): satisfied by verifying `f7eb21cf` in source against each acceptance criterion (slug regex + `unknown` refusal + `execFileSync` in `tests/layer4/helpers/disposable-repo.ts:30-36,142-147,165`; `removeLocalDir` at `:135` + work-dir threading at `:93` + upstream-clone `rmSync` in `tests/layer4/setups/git-fixture-sync.setup.ts:107`; `pickResumeableManifest` timestamp sort in `tests/harness/bench-persistence.ts:81-95`).
- Goal item 4 (focused tests, no live GitHub): the new describe block; both exercised paths return before `execFileSync("gh", ...)`.
- Goal item 5 (check off High items, record notes): the `tasks/todo.md` edits.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/code-review-test-infra-fixes.test.ts` — 11/11 passed.
- `pnpm --dir tests exec vitest run --project layer1` (= `pnpm --dir tests test`) — 56 files / 2205 tests / 0 failed (up from 2202 with the 3 new tests).
- `git diff --check` — clean.

## Skipped tests

- Live layer4 benchmark run (`bench:quick` / gated live project): intentionally skipped — the plan and `tasks/todo.md` explicitly direct that layer4 hits real GitHub via `gh` and is not routine validation; the changed behavior (gh-free early-return paths) is fully covered by the layer1 tests.
- Lint/typecheck: no lint or typecheck scripts exist in `tests/package.json` or repo root; vitest's TS transform compiled the changed file as part of the passing run.

## Adversarial review

Reviewer subagent lane over the exact diff. Verdict: SHIP. Confirmed: no new test can reach the `gh` invocation (control-flow traced to the two early returns); assertions non-vacuous (marker-file dirs + `existsSync` would catch a broken `removeLocalDir`); no flakiness (OS-random mkdtemp suffixes, awaited calls, no shared state); correct layer1 placement (local fs only); `f7eb21cf` attribution and 2202→2205 arithmetic accurate. One nitpick accepted (see residual risk).

## Residual risk

- If `cleanupRepo` ever throws before its first statement (`removeLocalDir`), the new tests would orphan one OS temp dir per failing run — there is no vitest teardown. A maintainer running the suite repeatedly against a broken `cleanupRepo` would notice stray `bench-leak-test-*` dirs in `$TMPDIR`. Accepted: `removeLocalDir` is the first call and is itself wrapped in try/catch, so this requires a module-level regression that the failing assertions would surface anyway.
- The live `gh repo delete` path (`execFileSync` success/failure handling) remains exercised only under the gated layer4 live project, unchanged in this boundary.

## Unrelated pre-existing changes

None — the working tree contained only this boundary's files; `tasks/todo.md` reconciliation edits (stale Phase 5 checkbox, next-step plan additions) are task-doc bookkeeping included deliberately in this boundary.

## Rollback note

`git revert` the two commits in this boundary (test extension; task docs). Reverting the test commit only removes coverage — the underlying fixes live in `f7eb21cf` and are untouched.

## Next command

`/exec`
