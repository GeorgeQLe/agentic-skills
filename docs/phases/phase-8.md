# Phase 8: Kanban DX

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

## Steps

- [x] **`--board` flag for search** — add `--board <id>` flag to kanban search command, scoping results to specified board(s); repeatable flag, error on invalid ID (spec: `specs/board-flag-kanban-search.md`)
- [x] **Dry-run mode** — add `--dry-run` flag to kanban skills that shows intended card operations without executing DB writes
- [x] **Env path unification** — extract shared env file search paths from bootstrap-session.mjs and kanban.mjs into a single module

## Acceptance Criteria
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [x] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [x] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests added (83 total: 79 existing + 3 dry-run + 1 env-paths)

## On Completion
- Deviations from plan: none
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses (carried from Phase 7)
- Ready for next phase: yes
