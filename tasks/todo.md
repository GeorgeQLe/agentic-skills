# Phase 8: Kanban DX

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

## Steps

- [x] **`--board` flag for search** — add `--board <id>` flag to kanban search command, scoping results to specified board(s); repeatable flag, error on invalid ID (spec: `specs/board-flag-kanban-search.md`)
- [x] **Dry-run mode** — add `--dry-run` flag to kanban skills that shows intended card operations without executing DB writes
- [ ] **Env path unification** — extract shared env file search paths from bootstrap-session.mjs and kanban.mjs into a single module

## Acceptance Criteria
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [x] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [ ] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests added (82 total: 79 existing + 3 dry-run)

## Next Step Plan: Env path unification

### Context

`kanban.mjs` and `bootstrap-session.mjs` both hardcode env file search paths independently, with different path lists:
- `kanban.mjs` `getDbUrl()` checks 4 paths (apps/poke/monorepo + poke/dev/poke-productivity-suite variants)
- `bootstrap-session.mjs` `loadEnv()` checks 2 paths (poke/dev/poke-productivity-suite only)

This means adding a new machine or path requires editing both files. Extract a shared path list into a single module.

### Changes

#### 1. Create `claude/poketo-kanban/scripts/env-paths.mjs`

```javascript
import { join } from "node:path";
import { homedir } from "node:os";

export const ENV_SEARCH_PATHS = [
  join(homedir(), "projects", "apps", "poke", "monorepo", ".env.local"),
  join(homedir(), "projects", "apps", "poke", "monorepo", ".env"),
  join(homedir(), "projects", "poke", "dev", "poke-productivity-suite", ".env.local"),
  join(homedir(), "projects", "poke", "dev", "poke-productivity-suite", ".env"),
];
```

Use the superset of both current path lists (kanban.mjs's 4 paths). Order: `.env.local` before `.env` per convention, monorepo paths first (matching kanban.mjs's current priority).

#### 2. Update `kanban.mjs` `getDbUrl()` (~line 33)

Replace the inline `pokePaths` array with `import { ENV_SEARCH_PATHS } from "./env-paths.mjs"` and use `ENV_SEARCH_PATHS` in the loop. Keep the `process.env.POKETOWORK_DATABASE_URL` check-first behavior.

#### 3. Update `bootstrap-session.mjs` `loadEnv()` (~line 20)

Change the default `searchPaths` fallback from its inline 2-path array to `ENV_SEARCH_PATHS`. Keep the `searchPaths` parameter override for tests.

#### 4. Add test in `bootstrap-session.test.mjs`

Add one test verifying `ENV_SEARCH_PATHS` is an array with at least 4 entries and all paths are absolute.

### Files

- `claude/poketo-kanban/scripts/env-paths.mjs` — **new**, shared path list
- `claude/poketo-kanban/scripts/kanban.mjs` — import and use `ENV_SEARCH_PATHS`
- `claude/poketo-kanban/scripts/bootstrap-session.mjs` — import and use `ENV_SEARCH_PATHS`
- `claude/poketo-kanban/scripts/bootstrap-session.test.mjs` — add 1 new test

### Verification

```bash
cd claude/poketo-kanban/scripts && npx vitest run --testTimeout=30000
```
- All 82 existing tests still pass
- New env-paths test passes
- `bootstrap-session.mjs` still works as CLI: `node bootstrap-session.mjs` (manual check)

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
