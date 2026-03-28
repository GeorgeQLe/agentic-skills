# Phase 7: Testing Hardening II

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling. Fix the known backslash search escape bug.

## Steps

- [ ] **Bootstrap session tests** — unit tests for bootstrap-session.mjs (env parsing, SQLite reads, session extraction) using fixture DB or mocks
- [ ] **install.sh bats tests** — bats-core test suite for install.sh (symlink creation, permission errors, partial installs, --uninstall)
- [ ] **Database error path tests** — at least 5 tests for DB error handling (insert failure, FK violation, connection error, returning() unchecked)
- [ ] **Fix backslash LIKE escape** — fix search escape bug in kanban.mjs and add regression test (currently `it.todo`)

## Acceptance Criteria
- [ ] bootstrap-session.mjs has unit tests with fixture SQLite DB or mocks
- [ ] install.sh has bats-core test suite covering happy path + error cases
- [ ] At least 5 database error path tests (insert failure, FK violation, connection error)
- [ ] Backslash LIKE escape bug fixed with regression test
- [ ] All tests pass across all suites

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
