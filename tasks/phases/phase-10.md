# Phase 10: Headless API Migration — Complete

Archived completed todo snapshot after finishing the roadmap's final phase.

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Final completed step:** 6. Deprecate the standalone DB-write path

## Completed Steps

- [x] 1. Establish agent-friendly headless auth
- [x] 2. Finish wiring the Poketo Work headless tool layer
- [x] 3. Expose the shared API/gateway path for agent use
- [x] 4. Migrate Claude kanban skills
- [x] 5. Migrate Codex kanban skills
- [x] 6. Deprecate the standalone DB-write path

## Acceptance Criteria

- [x] Claude and Codex kanban skills use the same app-layer write path for normal board operations
- [x] No kanban skill requires `POKETOWORK_DATABASE_URL` for standard usage
- [x] Codex kanban skills no longer reference `~/.claude/...` paths
- [x] Shared headless operations cover the current kanban workflow needs: board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore
- [x] Board permissions and `board_actions` logging come from the canonical Poketo app layer rather than the standalone script
- [x] `kanban.mjs` is documented as fallback/admin-only or removed from the default workflow

## On Completion

- Remaining active helper references to `kanban.mjs` now describe it as legacy fallback/admin tooling only.
- Standard Claude and Codex kanban workflows use `poketo kanban` with `poketo auth login` or `POKETO_API_KEY`.
- No further phases remain in `tasks/roadmap.md`; future work should start from a new spec or roadmap cycle.
