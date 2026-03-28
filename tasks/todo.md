# Phase 7: Testing Hardening II

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling. Fix the known backslash search escape bug.

## Steps

- [ ] **Bootstrap session tests** — refactor bootstrap-session.mjs to export testable functions, then add unit tests for loadEnv() and config generation logic with mocked DB
- [ ] **install.sh bats tests** — bats-core test suite for install.sh (symlink creation, permission errors, partial installs, --uninstall)
- [ ] **Database error path tests** — at least 5 tests for DB error handling (insert failure, FK violation, connection error, returning() unchecked)
- [ ] **Fix backslash LIKE escape** — fix search escape bug in kanban.mjs and add regression test (currently `it.todo`)

## Acceptance Criteria
- [ ] bootstrap-session.mjs has unit tests with fixture SQLite DB or mocks
- [ ] install.sh has bats-core test suite covering happy path + error cases
- [ ] At least 5 database error path tests (insert failure, FK violation, connection error)
- [ ] Backslash LIKE escape bug fixed with regression test
- [ ] All tests pass across all suites

## Plan: Bootstrap session tests (Step 1)

### Context
`claude/poketo-kanban/scripts/bootstrap-session.mjs` (110 lines, 2 functions) is a CLI script that:
- `loadEnv()`: reads `.env.local` or `.env` from the poke-productivity-suite directory, parses `KEY=value` lines via regex
- `main()`: queries Neon Postgres (auth DB for users, apps DB for org membership), builds config, writes `~/.poketo/config.json`

Currently has zero exports — everything runs at module load via `main().catch(...)`. Uses `@neondatabase/serverless` for DB access.

### What to build

**1. Refactor bootstrap-session.mjs for testability** (minimal changes):
- Export `loadEnv()` as a named export
- Extract config-building logic into `buildConfig(user, orgId)` and export it
- Guard the auto-run with `if (import.meta.url === ...)` so importing doesn't trigger execution
- Keep `main()` unchanged otherwise

**2. Create `bootstrap-session.test.mjs`** (~10 tests):

**`describe("loadEnv")`** (~5 tests):
1. Parses standard `KEY=value` pairs from a temp .env file
2. Handles quoted values (`KEY="value"` and `KEY='value'`)
3. Skips comment lines and blank lines
4. Returns empty object when no .env file exists
5. Handles `KEY=value with spaces` (only first word captured per current regex — document behavior)

**`describe("buildConfig")`** (~4 tests):
6. Builds config with user and orgId fields
7. Includes expected keys (userId, orgId, etc.)
8. Handles missing org (null/undefined orgId)
9. Config is valid JSON-serializable

**`describe("main integration")`** (~1 test):
10. Script runs without error when env vars are set (optional — may skip if DB not available)

### Files to modify
- `claude/poketo-kanban/scripts/bootstrap-session.mjs` — add exports, guard auto-run
- `claude/poketo-kanban/scripts/bootstrap-session.test.mjs` — new file, ~10 tests

### How to test loadEnv without touching real env
- Create temp directory with test `.env` files using `fs.mkdtempSync`
- Override the env search path or pass path as parameter to `loadEnv(dir?)`
- Clean up temp dirs in `afterEach`

### Verification
```bash
cd claude/poketo-kanban/scripts && npx vitest run --testTimeout=30000
```
- All new bootstrap tests pass
- All 53 existing kanban tests still pass

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
