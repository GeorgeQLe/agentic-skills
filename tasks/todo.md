# Phase 6: Testing Hardening I

**Goal:** Expand kanban.mjs test coverage with edge case and command-level tests to catch regressions like the Phase 5 LIKE injection and null dereference bugs.

## Steps

- [ ] **Kanban edge case tests** — concurrent moves, unicode names, LIKE metacharacters (%, _, backslash in search), archiving already-archived card, moving card to same list
- [ ] **Test create-list command** — dedicated test coverage for create-list plus untested flags (~20 new tests for --progress, --description, --due, search special chars, create-card edge cases, error paths)

## Acceptance Criteria
- [ ] Edge case tests added: unicode card names, LIKE metacharacter queries (%, _, backslash), moving card to same list, archiving already-archived card
- [ ] create-list command has dedicated test coverage
- [ ] update-card --progress, --description, --due flags each have at least one test
- [ ] search with special characters has regression tests
- [ ] All new + existing tests pass (target: 40+ total, up from 24)

## Plan: Kanban edge case tests

**What:** Add edge case tests to `claude/poketo-kanban/scripts/kanban.test.mjs` (currently 24 tests, 351 lines). These tests run against real Neon DB via `vitest`.

**Files to modify:**
- `claude/poketo-kanban/scripts/kanban.test.mjs` — add new `describe` blocks after existing tests, before cleanup

**Tests to add (~10-12 new tests):**

1. **Unicode card names** — create a card with emoji/CJK/accented chars in name, verify it round-trips through create → board → search
2. **LIKE metacharacter search: `%`** — create a card named "100% complete", search for "100%", verify it matches (not wildcard)
3. **LIKE metacharacter search: `_`** — create a card named "step_1", search for "step_1", verify exact match (not single-char wildcard)
4. **LIKE metacharacter search: backslash** — create a card named "path\\to", search for "path\\", verify match (known bug — this test should FAIL, documenting the backslash escape gap from Phase 7)
5. **Move card to same list** — move a card to the list it's already in, verify no error and card stays put
6. **Archive already-archived card** — archive a card, then archive it again, verify graceful handling (error or no-op)
7. **Create card with empty name** — verify error response
8. **Create card with very long name** — 500+ char name, verify it succeeds or errors gracefully
9. **Move card with invalid list ID** — verify error response
10. **Search with empty query** — verify behavior (empty results or all cards)
11. **done on already-done card** — mark a card done that's already done, verify idempotent

**Pattern:** Follow existing test structure — use the shared `boardId` and `listIds` from the `beforeAll` setup. Add new cards in each test and clean up isn't needed (board gets deleted in `afterAll`).

**Run tests:** `cd claude/poketo-kanban/scripts && npx vitest run kanban.test.mjs`

**Acceptance criteria:**
- All new tests pass (except backslash test which documents a known bug — mark it `it.skip` or `it.todo` with a comment)
- All 24 existing tests still pass
- Total test count: 34+

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
