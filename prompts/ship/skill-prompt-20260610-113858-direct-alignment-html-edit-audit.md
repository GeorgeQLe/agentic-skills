---
skill: ship
agent: claude
captured_at: 2026-06-10T11:38:58
source: user-invocation
prompt_scope: visible-user-invocation
---

`/ship` invoked per the ship-one-step handoff contract after implementing the planned step. The visible user invocation message for this session was the plan handoff:

Implement the following plan:

# Next step: Direct Alignment HTML Edit Audit (Drift Plan Phase 2 Step 6)

## Ship summary (just completed)

- Shipped Drift Plan Phase 2 Step 5: all 7 allowlisted bespoke skills (`consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations`, `uat`, `research-roadmap`) converted to the generator-owned stub + bundled `ALIGNMENT-PAGE.md` in both mirrors, with version bumps, archives, and changelog entries. `prototype` keeps its custom prototype-first timing rule as hybrid bespoke prose beside the stub, pinned by layer1 in both mirrors. The bespoke allowlist is now empty; generator gates: `Bespoke allowlist: 0 skills, exact`, `Output paths: 284 bundles, exact`, `Generated bundles: 284 ownable, exact`. Pushed as `65a0585e` (conversion) + `a9bcc207` (task docs).
- Tests: full layer1 suite passes — 55 files / 2188 tests / 0 failed (re-run after Skills Showcase regeneration). No failing tests, expected or otherwise.
- Deploy: showcase data changed, so the `tasks/deploy.md` contract applies — local required-source-state checks all ran (generators, fingerprint validator, `pnpm --dir apps/skills-showcase build` succeeded); Vercel auto-deploys from the pushed master. `/deploy` (release-ops pack) is not installed; install with `/pack install release-ops` if a managed deploy run is wanted.
- Manual tasks: 4 pending in `tasks/manual-todo.md` (non-blocking). Advisory: 2 recurring items pending, not selectable as next work.

## Next step (full plan in `tasks/todo.md`, top section "Direct Alignment HTML Edit Audit")

Add a scriptable audit for active `alignment/*.html` pages so direct edits made without invoking a skill can be checked against the alignment-page convention (Step 7 — wiring it into root instructions — stays queued separately):

- New read-only `scripts/audit-alignment-pages.mjs` following the Step 2–5 diagnostic pattern (named per-page diagnostics, `exact|DRIFT` summary lines, shared exit 1, `--root` fixture support).
- Candidate checks (finalize against current pages; audit must exit 0 on the repo or violations fixed in-boundary): TTS include (`scripts/alignment-tts-kokoro.js` src tag, not inline/module), `data-alignment-category` + `data-visual-tier` on `<html>`, viewport meta, index integrity (every active page linked once with a dated `<span class="meta">`), embed prohibition.
- New `tests/layer1/audit-alignment-pages.test.ts`: repo-state run (exit 0) + fixture tests per diagnostic class.
- Document the audit in `docs/alignment-page-convention.md` outside the generated-marker block.
- Files: `scripts/audit-alignment-pages.mjs` (new), `tests/layer1/audit-alignment-pages.test.ts` (new), `docs/alignment-page-convention.md`, `tasks/todo.md`, possibly fixes to active `alignment/*.html` pages.
- Execution profile: serial.

**Ship-one-step handoff contract:** implement only this step, validate it, then run `/ship` when done.

**Next work:** Direct Alignment HTML Edit Audit (Drift Plan Phase 2 Step 6)
**Recommended next command:** /exec
