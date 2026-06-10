---
skill: ship
agent: claude
captured_at: 2026-06-10T14:49:00Z
source: plan-handoff-contract
prompt_scope: visible-user-invocation
---

/ship was invoked per the ship-one-step handoff contract embedded in the visible user invocation below (a clear-context plan-implementation message, not a typed /ship command).

Implement the following plan:

# Next step: Generated-Bundle Drift Validation (Drift Plan Phase 2 Step 4)

## Ship summary (just completed)

- Shipped Drift Plan Phase 2 Step 3 to `master` and pushed: `62115d13` (path-consistency validation in `scripts/upgrade-alignment-page.mjs` + layer1 tests + convention doc) and `e57e742c` (task docs, ship manifest, prompt history, next-step plan). Every active `ALIGNMENT-PAGE.md` now must reference only its owning skill's `alignment/{skill-name}-{topic}.html` path — exit 1 with `Foreign output path` diagnostics in dry-run and write mode, plus an `Output paths: N bundles, exact|DRIFT` summary line. Current repo: 270 bundles, exact.
- Tests: full layer1 suite passes — 54 files / 2170 tests / 0 failed (4 new tests). No failing tests, expected or otherwise.
- Deploy skipped: no Skills Showcase changes in the boundary (`tasks/deploy.md` covers only the showcase).
- Manual tasks: 4 pending in `tasks/manual-todo.md` (deferred non-blocking, Skills Showcase newsletter env). Advisory: 2 recurring items pending, not selectable as next work.

## Next step (full plan in `tasks/todo.md`, top section "Generated-Bundle Drift Validation")

Add a `--check` mode to `scripts/upgrade-alignment-page.mjs` so a generator-owned skill's on-disk `ALIGNMENT-PAGE.md` that differs from expected renderer output fails loudly (today stale/hand-edited generated bundles only show as pending-update counts and exit 0):

- `--check`: no writes, exit 1 with named per-skill diagnostics when an ownable bundle differs from `bundledContentFor(...)` or its SKILL.md stub needs replacing; plain `--dry-run` preview behavior stays exit-0 (preserves the edit-convention → preview → write workflow).
- Summary line mirroring the Step 2/3 `exact|DRIFT` pattern; bespoke/skip-listed bundles exempt (no expected render).
- Layer1: repo-state `--check` run (exit 0) plus `--root` fixture tests (hand-edited bundle → exit 1, missing bundle → exit 1, clean tree → exit 0, stale fixture under plain `--dry-run` still exit 0), reusing the module-scope fixture helpers in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`.
- Document `--check` in `docs/alignment-page-convention.md` outside the generated-marker block; check off Phase 2 Step 4 in the drift plan.
- Files: `scripts/upgrade-alignment-page.mjs`, `tests/layer1/upgrade-alignment-page-bespoke.test.ts`, `docs/alignment-page-convention.md`, `tasks/todo.md`.
- Execution profile: serial.

**Ship-one-step handoff contract:** implement only this step, validate it, then run `/ship` when done.

**Next work:** Generated-Bundle Drift Validation (Drift Plan Phase 2 Step 4)
**Recommended next command:** /exec
