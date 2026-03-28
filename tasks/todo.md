# Phase 8: Kanban DX

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

## Steps

- [ ] **`--board` flag for search** — add `--board <id>` flag to kanban search command, scoping results to specified board(s); repeatable flag, error on invalid ID (spec: `specs/board-flag-kanban-search.md`)
- [ ] **Dry-run mode** — add `--dry-run` flag to kanban skills that shows intended card operations without executing DB writes
- [ ] **Env path unification** — extract shared env file search paths from bootstrap-session.mjs and kanban.mjs into a single module

## Acceptance Criteria
- [ ] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [ ] Invalid `--board` ID exits with error (not silent empty results)
- [ ] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [ ] bootstrap-session.mjs and kanban.mjs share a single env path list
- [ ] Existing tests still pass; new tests for --board flag

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
