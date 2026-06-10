---
skill: ship
agent: claude
captured_at: 2026-06-10T10:21:28Z
source: plan-handoff-contract
prompt_scope: visible-user-invocation
---

/ship was invoked per the ship-one-step handoff contract embedded in the visible user invocation below (a clear-context plan-implementation message, not a typed /ship command).

Implement the following plan:

# Next step: Alignment Bundle Path-Consistency Validation (Drift Plan Phase 2 Step 3)

## Ship summary (just completed)

- Shipped the Layer1 Contract Test Reconciliation to `master` and pushed: `17e57ba1` (11 reconciled `tests/layer1/*.test.ts` files) and `c3932e92` (task docs + ship manifest). All 18 failures were stale tests — zero regressed skill contracts, so no skill edits, archives, bumps, or showcase refreshes were needed.
- Tests: full layer1 suite now passes — 54 files / 2166 tests / 0 failed (was 18 failed). No failing tests remain, expected or otherwise.
- Deploy skipped: no Skills Showcase changes in the boundary (`tasks/deploy.md` covers only the showcase).
- Untracked files from a concurrent `/analyze-sessions` session (`alignment/`, `prompts/`, `research/_working/`) were left outside the boundary for that session to ship.
- Manual tasks: `tasks/manual-todo.md` items are deferred non-blocking (Skills Showcase newsletter env). Advisory: record/recurring items pending, not selectable as next work.

## Next step (full plan in `tasks/todo.md`, top section "Alignment Bundle Path-Consistency Validation")

Add path-consistency validation to `scripts/upgrade-alignment-page.mjs` so every active `ALIGNMENT-PAGE.md` bundle references only its owning skill's `alignment/{skill-name}-{topic}.html` output path:

- Failing diagnostic (exit 1) in both dry-run and write mode when a bundle's `alignment/<name>-{topic}.html` occurrences don't match the owning skill directory name; summary status line mirroring the Step 2 `Bespoke allowlist` pattern.
- Layer1 coverage: repo-state assertion plus `--root` fixture tests (mismatched bundle → exit 1, clean tree → exit 0), extending the Step 2 conventions in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`.
- Document the validation in `docs/alignment-page-convention.md` outside the generated-marker block; check off Phase 2 Step 3 in the drift plan.
- Files: `scripts/upgrade-alignment-page.mjs`, `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (or sibling), `docs/alignment-page-convention.md`, `tasks/todo.md`.
- Execution profile: serial.

**Ship-one-step handoff contract:** implement only this step, validate it, then run `/ship` when done.
