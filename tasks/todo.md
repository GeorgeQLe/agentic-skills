# Phase 8: Kanban DX

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

## Steps

- [x] **`--board` flag for search** — add `--board <id>` flag to kanban search command, scoping results to specified board(s); repeatable flag, error on invalid ID (spec: `specs/board-flag-kanban-search.md`)
- [ ] **Dry-run mode** — add `--dry-run` flag to kanban skills that shows intended card operations without executing DB writes
- [ ] **Env path unification** — extract shared env file search paths from bootstrap-session.mjs and kanban.mjs into a single module

## Acceptance Criteria
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [ ] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [ ] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests for --board flag (79 total: 77 existing + 2 new)

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
