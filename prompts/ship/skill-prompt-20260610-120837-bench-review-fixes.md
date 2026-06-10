---
skill: ship
agent: claude
captured_at: 2026-06-10T12:08:37-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Next step: Benchmark Harness Code Review Fixes (Expert-Review High Items)

## Ship summary (just completed)

- Shipped Drift Plan Phase 2 Step 7 — **Phase 2 complete**: CLAUDE.md `### Alignment Page Template` and AGENTS.md `### Alignment Page Convention` now require direct edits to active `alignment/*.html` pages made without invoking a skill to pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit (TTS diagnostics → `node scripts/inject-tts.mjs`; archived pages exempt), both outside provisioned content, with a new root-instruction contract test in `tests/layer1/audit-alignment-pages.test.ts` pinning the language in both files. Pushed as `2fa1a017` (root instructions + test) + `f1f3d711` (task docs, manifest, prompt log).
- Tests: full layer1 56 files / 2202 tests / 0 failed. No failing tests, expected or otherwise.
- Deploy: skipped — `tasks/deploy.md` scopes the Skills Showcase app; this boundary touches no `apps/` files. `/deploy` (release-ops pack) remains uninstalled.
- Manual tasks: 4 pending in `tasks/manual-todo.md` (deferred Phase 38 newsletter provisioning, non-blocking). Advisory: 2 recurring items pending, not selectable as next work.
- Note: `defaultMode: acceptEdits` in `.claude/settings.local.json` remains unset (write was denied by the permission classifier in a prior session; not retried). `showClearContextOnPlanAccept: true` is set, so the clear-context handoff works.

## Next step (full plan in `tasks/todo.md`, top section "Benchmark Harness Code Review Fixes")

Resolve the 3 open High items from the 2026-05-29 `/expert-review` — the oldest unchecked substantive work now that the drift plan is done; all three re-verified present today:

- Harden `cleanupRepo` in `tests/layer4/helpers/disposable-repo.ts`: validate `repoSlug` against `^[\w.-]+/agentic-skills-bench-[\w.-]+$`, refuse the `"unknown"` user fallback, switch `gh repo delete` to `execFileSync` (no shell); align `tests/layer4/setups/git-fixture-sync.setup.ts`.
- Fix the temp-dir leak: `cleanup()` must also remove the `mkdtempSync` work dirs and the `sync-upstream-` clone dir.
- Fix `findResumeableSession` in `tests/harness/bench-persistence.ts` to sort sessions by manifest `createdAt`/`updatedAt` instead of random-id directory order.
- Add/extend focused tests (no live GitHub calls — layer4 is not routine validation); check off the three High items in `## Code Review Fixes`.
- Files: `tests/layer4/helpers/disposable-repo.ts`, `tests/layer4/setups/git-fixture-sync.setup.ts`, `tests/harness/bench-persistence.ts`, a test file (new or extended), `tasks/todo.md`.
- No SKILL.md/PACK.md changes → no showcase regeneration, no version bumps.
- Execution profile: serial.

**Ship-one-step handoff contract:** implement only this step, validate it, then run `/ship` when done.

**Next work:** Benchmark Harness Code Review Fixes (Expert-Review High Items)
**Recommended next command:** /exec
