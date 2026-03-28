# Phase 7: Testing Hardening II

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling. Fix the known backslash search escape bug.

## Steps

- [x] **Bootstrap session tests** — refactor bootstrap-session.mjs to export testable functions, then add unit tests for loadEnv() and config generation logic with mocked DB
- [x] **install.sh tests** — vitest test suite for install.sh (symlink creation, idempotency, warnings, updates, --uninstall)
- [x] **Database error path tests** — at least 5 tests for DB error handling (insert failure, FK violation, connection error, returning() unchecked)
- [x] **Fix backslash LIKE escape** — fix search escape bug in kanban.mjs and add regression test (currently `it.todo`)

## Acceptance Criteria
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [x] install.sh has vitest test suite covering happy path + error cases (8 tests)
- [x] At least 5 database error path tests (insert failure, FK violation, connection error)
- [x] Backslash LIKE escape bug fixed with regression test
- [x] All tests pass across all suites (77 tests)

## On Completion
- Deviations from plan: install.sh tests used vitest instead of bats-core (no new deps needed)
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes
