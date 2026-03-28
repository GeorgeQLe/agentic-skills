# Phase 6: Testing Hardening I

**Goal:** Expand kanban.mjs test coverage with edge case and command-level tests to catch regressions like the Phase 5 LIKE injection and null dereference bugs.

## Steps

- [x] **Kanban edge case tests** — unicode names, LIKE metacharacters (%, _, backslash as todo), archiving already-archived card, moving card to same list, empty/long names, done idempotency, invalid list ID
- [ ] **Test create-list command** — dedicated test coverage for create-list plus untested flags (~20 new tests for --progress, --description, --due, search special chars, create-card edge cases, error paths)

## Acceptance Criteria
- [x] Edge case tests added: unicode card names, LIKE metacharacter queries (%, _, backslash as todo), moving card to same list, archiving already-archived card
- [ ] create-list command has dedicated test coverage
- [ ] update-card --progress, --description, --due flags each have at least one test
- [x] search with special characters has regression tests
- [ ] All new + existing tests pass (target: 40+ total, up from 24)

## Plan: Test create-list command + untested flags

**What:** Add ~20 new tests to `claude/poketo-kanban/scripts/kanban.test.mjs` (currently 35 test entries, ~540 lines) covering: `create-list` command, `update-card` untested flags (`--progress`, `--description`, `--due`), and additional error paths.

**Files to modify:**
- `claude/poketo-kanban/scripts/kanban.test.mjs` — add new `describe` blocks before "Edge cases" block

**Pre-work:** Read `kanban.mjs` to understand:
- `cmdCreateList` args and behavior (line ~380+)
- `update-card` handling of `--progress`, `--description`, `--due` flags
- Error paths for these commands

**Tests to add (~20 new tests):**

**`describe("create-list")`** (~5 tests):
1. `create-list with name` — create a new list on the test board, verify JSON response
2. `create-list with type done` — `--type done`, verify `type: "done"`
3. `create-list with type punt` — `--type punt`, verify `type: "punt"`
4. `create-list without required args` — missing `--board` or `--name`, expect error
5. `create-list with duplicate name` — create a list with same name as existing, verify behavior

**`describe("update-card flags")`** (~6 tests):
6. `update-card --progress sets progress` — set progress to 50, verify `progress: 50`
7. `update-card --progress 0 resets progress` — set to 0, verify
8. `update-card --description sets description` — verify round-trip
9. `update-card --description empty string clears description` — `--description ""`, verify
10. `update-card --due sets due date` — `--due 2026-12-31`, verify `dueDate`
11. `update-card --due clear removes due date` — verify clearing mechanism (if supported)

**`describe("Additional error paths")`** (~5 tests):
12. `create-card with invalid board ID` — expect error
13. `create-list with invalid board ID` — expect error
14. `archive-card with invalid card ID` — expect error
15. `board with invalid ID` — expect error (already partly tested, but explicit)
16. `move-card with invalid card ID` — expect error

**`describe("Card ordering")`** (~3 tests):
17. `cards ordered by creation order` — create 3 cards, verify orders 0, 1, 2
18. `moved card gets appended` — move card to list with existing cards, verify order is max+1
19. `board shows cards sorted by order` — verify `board <id>` returns cards in order

**Run tests:** `cd claude/poketo-kanban/scripts && npx vitest run kanban.test.mjs --testTimeout=30000`

**Acceptance criteria:**
- All ~20 new tests pass
- All 34 existing tests still pass
- Total test count: 50+
- Phase 6 acceptance criteria met: create-list has dedicated coverage, --progress/--description/--due each have tests

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
