# Multi-User Kanban Implementation (kanban.mjs)

TDD tests are written (28 tests, 22 red). Now implement the features to turn them green.

## Phase 1: updatedAt in responses (3 failing tests)

**Files:** `claude/poketo-kanban/scripts/kanban.mjs`

Three commands return hand-picked fields instead of the full card row. Fix each to return the full `updated` object from `.returning()`:

- [x] `cmdDone` (line ~302): change `card: { id: updated.id, name: updated.name, done: true }` → `card: updated`
- [x] `cmdMoveCard` (line ~342): change `card: { id: updated.id, name: updated.name, listId: updated.listId }` → `card: updated`
- [x] `cmdArchiveCard` (line ~617): currently does `.update().set()` without `.returning()`. Add `.returning()`, capture result, use it in output: `card: { ...archived, archivedTo: archiveListId }`

**Verification:** Run `npx vitest run kanban.test.mjs -t "updatedAt"` — all 5 tests pass. Existing 64 tests still pass.

## Phase 2: Audit logging (10 failing tests)

- [x] Add `board_actions` Drizzle schema inline in kanban.mjs (reuse enum + table from tests)
- [x] Add `logAction(db, session, params)` helper — best-effort INSERT (try/catch, warn on failure)
- [x] Generate `agentSessionId` as `<hostname>-<ISO timestamp>` at process start
- [x] Wire `logAction()` into: `create-card` (CREATE), `update-card --name` (RENAME w/ before/after), `update-card --description` (UPDATE_DESCRIPTION w/ before/after), `move-card` (MOVE w/ fromList/toList), `done` (MARK_DONE), `archive-card` (ARCHIVE), `create-board` (CREATE), `delete-board` (DELETE)
- [x] Skip audit log when `--dry-run` is set
- [x] Read card state before update to capture `from` values in changes JSONB

## Phase 3: Optimistic locking (6 failing tests)

- [x] Parse `--expect-updated-at` flag in arg handling
- [x] Add `AND updated_at = $timestamp` WHERE clause when flag is present
- [x] Return conflict error shape: `{ error: "conflict", message, cardId, expectedUpdatedAt, hint }`
- [x] Apply to: `update-card`, `move-card`, `done`, `archive-card`

## Phase 4: Activity command (4 failing tests)

- [x] Add `activity` command handler in kanban.mjs
- [x] Support `--card <id>` and `--board <id>` flags
- [x] Support `--limit <n>` (default 10)
- [x] Return `{ command: "activity", entityId, actions: [...] }` with expected shape
- [x] Error when neither `--card` nor `--board` provided

## Verification

- [x] `npx vitest run kanban.test.mjs` — all 92 tests green
