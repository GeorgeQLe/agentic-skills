# Phase 7: Testing Hardening II

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling. Fix the known backslash search escape bug.

## Steps

- [x] **Bootstrap session tests** — refactor bootstrap-session.mjs to export testable functions, then add unit tests for loadEnv() and config generation logic with mocked DB
- [x] **install.sh tests** — vitest test suite for install.sh (symlink creation, idempotency, warnings, updates, --uninstall)
- [ ] **Database error path tests** — at least 5 tests for DB error handling (insert failure, FK violation, connection error, returning() unchecked)
- [ ] **Fix backslash LIKE escape** — fix search escape bug in kanban.mjs and add regression test (currently `it.todo`)

## Acceptance Criteria
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [x] install.sh has vitest test suite covering happy path + error cases (8 tests)
- [ ] At least 5 database error path tests (insert failure, FK violation, connection error)
- [ ] Backslash LIKE escape bug fixed with regression test
- [ ] All tests pass across all suites

## Plan: Database error path tests (Step 3)

### Context
`kanban.mjs` uses knex to talk to Neon Postgres. Error paths (insert failures, FK violations, connection errors) have no test coverage. The existing test suite (`kanban.test.mjs`) tests happy paths against the real DB.

### What to build

Add ~5 tests to `claude/poketo-kanban/scripts/kanban.test.mjs` in a new `describe("database error paths", ...)` block. These test real DB error behavior — no mocking needed since the existing suite already connects to Neon.

### Tests

1. **FK violation on create-card with invalid list ID** — `create-card --list <nonexistent-uuid> --name test` should error with FK violation message
2. **FK violation on move-card with invalid list ID** — `move-card --id <valid-card> --list <nonexistent-uuid>` should error
3. **Invalid UUID format rejected** — `create-card --list not-a-uuid --name test` should error (Postgres rejects malformed UUIDs)
4. **Duplicate board name handling** — create two boards with the same name, verify both succeed (no unique constraint) or document the behavior
5. **Archive card with invalid card ID** — `archive-card --id <nonexistent-uuid>` should error with "not found" message

### Key technical decisions
- Use the existing real DB connection (no mocks) — tests verify actual Postgres error messages
- Each test should use `expect(() => ...).toThrow()` or try/catch to verify error output
- Tests run the CLI via the existing `run()` helper in `kanban.test.mjs`
- Clean up any test data created

### Files to modify
- `claude/poketo-kanban/scripts/kanban.test.mjs` — add ~5 tests in new describe block

### Verification
```bash
cd claude/poketo-kanban/scripts && npx vitest run --testTimeout=30000
```
- All new DB error tests pass
- All 71 existing tests still pass
- No test data left behind

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
