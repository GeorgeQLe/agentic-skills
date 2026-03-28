# Phase 7: Testing Hardening II

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling. Fix the known backslash search escape bug.

## Steps

- [x] **Bootstrap session tests** — refactor bootstrap-session.mjs to export testable functions, then add unit tests for loadEnv() and config generation logic with mocked DB
- [ ] **install.sh bats tests** — bats-core test suite for install.sh (symlink creation, permission errors, partial installs, --uninstall)
- [ ] **Database error path tests** — at least 5 tests for DB error handling (insert failure, FK violation, connection error, returning() unchecked)
- [ ] **Fix backslash LIKE escape** — fix search escape bug in kanban.mjs and add regression test (currently `it.todo`)

## Acceptance Criteria
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [ ] install.sh has bats-core test suite covering happy path + error cases
- [ ] At least 5 database error path tests (insert failure, FK violation, connection error)
- [ ] Backslash LIKE escape bug fixed with regression test
- [ ] All tests pass across all suites

## Plan: install.sh bats tests (Step 2)

### Context
`install.sh` (107 lines) symlinks `claude/` and `codex/` skill directories into `~/.claude/skills/` and `~/.codex/skills/`. It supports `--uninstall` to remove symlinks. Currently has zero test coverage.

### What to build

**1. Install bats-core** as a dev dependency (or use npx):
```bash
npm install --save-dev bats
```
Alternatively, use the system bats if available, or run via npx.

**2. Create `install.test.bats`** (~8 tests) in the project root (next to `install.sh`):

Uses temp directories for `CLAUDE_SKILLS_DIR`, `CODEX_SKILLS_DIR`, and `SCRIPT_DIR` to avoid touching real skill directories.

**Setup**: In `setup()`, create temp dirs and override the env vars. The script uses hardcoded `$HOME/.claude/skills` and `$HOME/.codex/skills`, so tests need to either:
- Set `HOME` to a temp dir so the paths resolve there, OR
- Create a wrapper that sources install.sh with overridden vars

**Recommended approach**: Set `HOME` to a temp dir in each test, create minimal `claude/` and `codex/` subdirectories to simulate the repo structure.

**Tests**:

**`@test "install creates symlinks for claude skills"`**
- Create `$SCRIPT_DIR/claude/skill-a/SKILL.md`
- Run install.sh
- Verify `$HOME/.claude/skills/skill-a` is a symlink pointing to `$SCRIPT_DIR/claude/skill-a`

**`@test "install creates symlinks for codex skills"`**
- Create `$SCRIPT_DIR/codex/skill-b/agents/openai.yaml`
- Run install.sh
- Verify `$HOME/.codex/skills/skill-b` is a symlink

**`@test "install skips existing correct symlinks (idempotent)"`**
- Run install.sh twice
- Second run should report 0 new installs (already linked)

**`@test "install warns and skips non-symlink targets"`**
- Create a real directory at `$HOME/.claude/skills/skill-a`
- Run install.sh
- Verify output contains "WARNING" and the directory is not replaced

**`@test "install updates symlinks pointing elsewhere"`**
- Create a symlink pointing to `/tmp/old-location`
- Run install.sh
- Verify symlink now points to the correct skill dir

**`@test "uninstall removes only repo symlinks"`**
- Install, then create an unrelated symlink in skills dir
- Run `install.sh --uninstall`
- Verify repo symlinks removed but unrelated symlink preserved

**`@test "uninstall reports count"`**
- Install 2 skills, uninstall
- Verify output contains "Removed 2 symlinks"

**`@test "install creates target directories if missing"`**
- Ensure `$HOME/.claude/skills/` doesn't exist
- Run install.sh
- Verify directory was created and symlinks installed

### Key technical decisions
- Override `HOME` in tests to isolate from real skill directories
- The script uses `SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"` — tests must run the script from a temp copy or symlink so `SCRIPT_DIR` resolves to the temp structure
- Need to copy `install.sh` into the temp dir and create `claude/*/` and `codex/*/` subdirectories there
- Clean up temp dirs in `teardown()`

### Files to create/modify
- `install.test.bats` — new file, ~8 tests (project root, next to install.sh)
- May need to install bats: `npm install --save-dev bats` or check if available

### Verification
```bash
npx bats install.test.bats
```
- All 8 bats tests pass
- `./install.sh` still works normally from the repo root
- Existing vitest tests unaffected

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
