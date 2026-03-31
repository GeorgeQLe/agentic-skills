# Multi-User Kanban Implementation (kanban.mjs)

TDD tests are written (28 tests, 22 red). Now implement the features to turn them green.

## Phase 1: updatedAt in responses (3 failing tests)

- [ ] `move-card` — return full card row (includes `updatedAt`) instead of hand-picked fields
- [ ] `done` — same fix
- [ ] `archive-card` — same fix

## Phase 2: Audit logging (10 failing tests)

- [ ] Add `board_actions` Drizzle schema inline in kanban.mjs (reuse enum + table from tests)
- [ ] Add `logAction(db, session, params)` helper — best-effort INSERT (try/catch, warn on failure)
- [ ] Generate `agentSessionId` as `<hostname>-<ISO timestamp>` at process start
- [ ] Wire `logAction()` into: `create-card` (CREATE), `update-card --name` (RENAME w/ before/after), `update-card --description` (UPDATE_DESCRIPTION w/ before/after), `move-card` (MOVE w/ fromList/toList), `done` (MARK_DONE), `archive-card` (ARCHIVE), `create-board` (CREATE), `delete-board` (DELETE)
- [ ] Skip audit log when `--dry-run` is set
- [ ] Read card state before update to capture `from` values in changes JSONB

## Phase 3: Optimistic locking (6 failing tests)

- [ ] Parse `--expect-updated-at` flag in arg handling
- [ ] Add `AND updated_at = $timestamp` WHERE clause when flag is present
- [ ] Return conflict error shape: `{ error: "conflict", message, cardId, expectedUpdatedAt, hint }`
- [ ] Apply to: `update-card`, `move-card`, `done`, `archive-card`

## Phase 4: Activity command (4 failing tests)

- [ ] Add `activity` command handler in kanban.mjs
- [ ] Support `--card <id>` and `--board <id>` flags
- [ ] Support `--limit <n>` (default 10)
- [ ] Return `{ command: "activity", entityId, actions: [...] }` with expected shape
- [ ] Error when neither `--card` nor `--board` provided

## Verification

- [ ] `npx vitest run kanban.test.mjs` — all 92 tests green
