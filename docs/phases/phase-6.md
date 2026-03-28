# Phase 6: Testing Hardening I

**Goal:** Expand kanban.mjs test coverage with edge case and command-level tests to catch regressions like the Phase 5 LIKE injection and null dereference bugs.

## Steps

- [x] **Kanban edge case tests** — unicode names, LIKE metacharacters (%, _, backslash as todo), archiving already-archived card, moving card to same list, empty/long names, done idempotency, invalid list ID
- [x] **Test create-list command** — dedicated test coverage for create-list plus untested flags (19 new tests for --progress, --description, --due, error paths, card ordering)

## Acceptance Criteria
- [x] Edge case tests added: unicode card names, LIKE metacharacter queries (%, _, backslash as todo), moving card to same list, archiving already-archived card
- [x] create-list command has dedicated test coverage
- [x] update-card --progress, --description, --due flags each have at least one test
- [x] search with special characters has regression tests
- [x] All new + existing tests pass (53 passed, 1 todo — target was 40+)

## On Completion
- Deviations from plan: `--description ""` can't clear description (falsy guard in kanban.mjs line 243); `--type` flag doesn't exist on create-list; move-card/board responses don't include card `order` field — tests adapted accordingly
- Tech debt / follow-ups: backslash search escaping (todo test), empty description clearing, expose card `order` in board/move-card responses
- Ready for next phase: yes
