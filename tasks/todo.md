# Phase 7: Testing Hardening II

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling. Fix the known backslash search escape bug.

## Steps

- [x] **Bootstrap session tests** — refactor bootstrap-session.mjs to export testable functions, then add unit tests for loadEnv() and config generation logic with mocked DB
- [x] **install.sh tests** — vitest test suite for install.sh (symlink creation, idempotency, warnings, updates, --uninstall)
- [x] **Database error path tests** — at least 5 tests for DB error handling (insert failure, FK violation, connection error, returning() unchecked)
- [ ] **Fix backslash LIKE escape** — fix search escape bug in kanban.mjs and add regression test (currently `it.todo`)

## Acceptance Criteria
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [x] install.sh has vitest test suite covering happy path + error cases (8 tests)
- [x] At least 5 database error path tests (insert failure, FK violation, connection error)
- [ ] Backslash LIKE escape bug fixed with regression test
- [ ] All tests pass across all suites

## Plan: Fix backslash LIKE escape (Step 4)

### Context
The search command in `kanban.mjs` (line 462) escapes `%` and `_` for ILIKE queries but does NOT escape backslashes. In Postgres, backslash is the LIKE escape character — an unescaped `\` in user input can cause unexpected matching or errors. There's an existing `it.todo` at `kanban.test.mjs` line 745-747 documenting this known bug.

### What to fix

**`claude/poketo-kanban/scripts/kanban.mjs` line 462:**
```javascript
// Current (broken):
const escaped = query.replace(/%/g, '\\%').replace(/_/g, '\\_');

// Fixed — escape backslash FIRST, then % and _:
const escaped = query.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
```
Backslash must be escaped first to avoid double-escaping the backslashes added by the `%` and `_` replacements.

### Test

**`claude/poketo-kanban/scripts/kanban.test.mjs` ~line 745:**
Convert the `it.todo` to a real test:
1. Create a card with a backslash in the name (e.g., `"path\\to\\file"`)
2. Search for `"path\\to"`
3. Verify the card is found in results
4. Remove the `it.todo` line

### Files to modify
- `claude/poketo-kanban/scripts/kanban.mjs` — fix escape order on line 462
- `claude/poketo-kanban/scripts/kanban.test.mjs` — convert `it.todo` to real test

### Verification
```bash
cd claude/poketo-kanban/scripts && npx vitest run --testTimeout=30000
```
- Backslash search test passes
- All 76 existing tests still pass
- No regressions in `%` and `_` escape tests

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
