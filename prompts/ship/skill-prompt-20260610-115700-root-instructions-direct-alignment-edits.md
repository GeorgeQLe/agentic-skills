---
skill: ship
agent: claude
captured_at: 2026-06-10T11:57:00
source: user-invocation
prompt_scope: visible-user-invocation
---

`/ship` invoked per the ship-one-step handoff contract after implementing the planned step. The visible user invocation message for this session was the plan handoff:

Implement the following plan:

# Next step: Root Instructions for Direct Alignment Edits (Drift Plan Phase 2 Step 7)

## Ship summary (just completed)

- Shipped Drift Plan Phase 2 Step 6: new read-only `scripts/audit-alignment-pages.mjs` — the convention gate for direct edits to active `alignment/*.html` pages (TTS include, category/tier data attributes on `<html>`, viewport meta, embed prohibition, index integrity), with named per-page diagnostics, `exact|DRIFT` summaries, `--root` fixture support, and 13 layer1 tests (`tests/layer1/audit-alignment-pages.test.ts`). The audit surfaced and this boundary fixed: 1 missing TTS include, 36 pages missing both data attributes (+2 missing only the tier), and 2 pages absent from `alignment/index.html`. Pushed as `eb5f7727` (page fixes) + `edddc807` (audit + tests + docs) + `a407e0b9` (task docs).
- Tests: full layer1 suite 56 files / 2201 tests / 0 failed. No failing tests, expected or otherwise.
- Deploy: skipped — the `tasks/deploy.md` contract scopes the Skills Showcase app, which this boundary does not touch (no showcase data, no `apps/` files). `/deploy` (release-ops pack) remains uninstalled.
- Manual tasks: 4 pending in `tasks/manual-todo.md` (non-blocking). Advisory: 2 recurring items pending, not selectable as next work.
- Note: the ship skill's settings step (`defaultMode: acceptEdits` in `.claude/settings.local.json`) was denied by the permission classifier; `showClearContextOnPlanAccept: true` is already set, so the clear-context handoff works.

## Next step (full plan in `tasks/todo.md`, top section "Root Instructions for Direct Alignment Edits")

Wire the Step 6 audit into the root instruction surfaces so direct `alignment/*.html` edits made without invoking a skill must pass it — the final Phase 2 drift-plan item:

- Add the requirement (pass `node scripts/audit-alignment-pages.mjs` before commit; TTS diagnostics route to `node scripts/inject-tts.mjs`) to `CLAUDE.md` `### Alignment Page Template` and `AGENTS.md` `### Alignment Page Convention`, outside any provisioned block, matching each file's style.
- Add or extend a layer1 contract test pinning the requirement language in both root files (check for an existing root-instruction contract test first).
- Check off Phase 2 Step 7 and note Phase 2 completion in the drift-plan checklist.
- Files: `CLAUDE.md`, `AGENTS.md`, a layer1 test file (new or extended), `tasks/todo.md`.
- No SKILL.md/PACK.md changes → no showcase regeneration, no version bumps.
- Execution profile: serial.

**Ship-one-step handoff contract:** implement only this step, validate it, then run `/ship` when done.

**Next work:** Root Instructions for Direct Alignment Edits (Drift Plan Phase 2 Step 7)
**Recommended next command:** /exec
