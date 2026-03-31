# Kanban Multi-User Support (CLI Side)

**Status:** Draft
**Date:** 2026-03-31
**Companion spec:** `poke/monorepo/docs/specifications/work-realtime-collaboration-spec.md`

---

## Goals

Make kanban.mjs a well-behaved participant in a multi-user Poketo Work environment where multiple Claude Code agents and web app users operate on the same board simultaneously.

## Non-Goals

- Real-time WebSocket infrastructure (web app spec)
- Web app UI changes (web app spec)
- Offline queue / soft-delete (separate spec: `kanban-offline-queue-soft-delete.md`)

---

## 1. Audit Logging

### Problem

kanban.mjs writes directly to Postgres but never inserts into the `board_actions` table. CLI mutations are invisible to the web app's activity feed and to other CLI sessions.

### Solution

After every successful mutation, insert a `board_actions` row using best-effort semantics (mutation succeeds even if audit insert fails).

### Schema Contract

```sql
INSERT INTO board_actions (
  id,                  -- UUID
  action,              -- board_action enum (see mapping below)
  entity,              -- 'card' | 'list' | 'board'
  entity_id,           -- ID of affected entity
  entity_name,         -- Display name of affected entity
  board_id,            -- Parent board ID
  user_id,             -- From session config (~/.poketo/config.json)
  actor_type,          -- 'agent' (always for CLI)
  agent_session_id,    -- <hostname>-<ISO timestamp> (unique per CLI invocation)
  agent_template_id,   -- 'claude-code-kanban'
  changes,             -- JSONB with before/after values (see BoardActionChanges type)
  created_at           -- NOW()
)
```

### Command-to-Action Mapping

| kanban.mjs command | board_action enum | entity | changes JSONB |
|---|---|---|---|
| `create-card` | `CREATE` | `card` | `null` |
| `update-card --name` | `RENAME` | `card` | `{ field: "name", from: "<old>", to: "<new>" }` |
| `update-card --description` | `UPDATE_DESCRIPTION` | `card` | `{ field: "description", from: "<old>", to: "<new>" }` |
| `update-card --done` | `MARK_DONE` | `card` | `null` |
| `update-card --undone` | `MARK_UNDONE` | `card` | `null` |
| `update-card --starred` | `STAR` | `card` | `null` |
| `update-card --unstarred` | `UNSTAR` | `card` | `null` |
| `update-card --due` | `SET_DUE_DATE` | `card` | `{ field: "dueDate", from: "<old>", to: "<new>" }` |
| `update-card --progress` | `SET_PROGRESS` | `card` | `{ field: "progress", from: <old>, to: <new> }` |
| `done` | `MARK_DONE` | `card` | `null` |
| `move-card` | `MOVE` | `card` | `{ fromListId, fromListName, toListId, toListName }` |
| `archive-card` | `ARCHIVE` | `card` | `{ fromListId, fromListName, toListId: "<archive-list-id>", toListName: "Archive" }` |
| `create-board` | `CREATE` | `board` | `null` |
| `create-list` | `CREATE` | `list` | `null` |
| `delete-board` | `DELETE` | `board` | `null` |

### Implementation

1. Add the `board_actions` Drizzle schema to kanban.mjs (inline, matching the web app's `BoardActionSchema`)
2. Create a `logAction(db, session, params)` helper that inserts the row
3. Call `logAction()` after each successful mutation, wrapped in try/catch (best-effort — log warning on failure, don't throw)
4. For `update-card`, read the card's current state before the update to capture `from` values in the changes JSONB
5. Generate `agentSessionId` as `<hostname>-<ISO timestamp>` at process start (single value per invocation)

### Agent Identity

- `userId`: From `session.userId` in `~/.poketo/config.json`
- `actorType`: Always `'agent'` for CLI sessions
- `agentTemplateId`: `'claude-code-kanban'` (fixed string identifying this tool)
- `agentSessionId`: `<hostname>-<ISO timestamp>` (e.g., `macbook-pro-2026-03-31T10:00:00.000Z`)

---

## 2. Optimistic Locking

### Problem

Concurrent writes to the same card silently overwrite each other (last-write-wins). With multiple agents and web users, this causes lost updates.

### Solution

Optional `--expect-updated-at <ISO timestamp>` flag on mutation commands. When provided, the UPDATE includes a WHERE clause on `updated_at`, making it a single atomic check-and-write.

### Affected Commands

- `update-card`
- `move-card`
- `done`
- `archive-card`

### Mechanism

```sql
-- Without flag (backwards-compatible, last-write-wins):
UPDATE card SET ... WHERE id = $1 RETURNING *

-- With flag (optimistic lock):
UPDATE card SET ... WHERE id = $1 AND updated_at = $2 RETURNING *
```

If 0 rows returned with the flag present: return a conflict error:

```json
{
  "error": "conflict",
  "message": "Card was modified since last read",
  "cardId": "...",
  "expectedUpdatedAt": "2026-03-31T10:00:00Z",
  "hint": "Re-read the card and retry"
}
```

### Smart Retry in Skills

Skills that use `--expect-updated-at` should handle conflicts:

- **Simple ops** (move-card, done, star): Auto-retry once. Re-read the card, check if the intended change still makes sense, re-apply with new `updatedAt`.
- **Content ops** (description, name): Surface to the user. "Card X was modified by [actor] at [time]. Your change: [description]. Current value: [description]. Overwrite?"

### Backwards Compatibility

- Flag is optional. Omitting it preserves current last-write-wins behavior.
- Existing skills keep working without changes.
- Skills are upgraded incrementally to pass the flag.

---

## 3. Activity Reads

### Problem

CLI users have no visibility into what other actors (web users, other agents) have done to a card recently.

### Solution

New `activity` command that reads recent `board_actions` for a card or board.

```bash
node kanban.mjs activity --card <card-id> [--limit 5]
node kanban.mjs activity --board <board-id> [--limit 10]
```

### Output

```json
{
  "command": "activity",
  "entityId": "...",
  "actions": [
    {
      "action": "MOVE",
      "actorType": "user",
      "userId": "...",
      "changes": { "fromListName": "Todo", "toListName": "In Progress" },
      "createdAt": "2026-03-31T09:55:00Z"
    }
  ]
}
```

### Skill Integration

Skills should call `activity --card <id> --limit 5` before mutations on cards that may be shared. Display a brief summary:

```
Last activity on "Card X":
  - [user] Alice moved to In Progress (5 min ago)
  - [agent] claude-code-kanban marked done (2 hours ago)
```

This is advisory — never block based on activity.

---

## 4. Description Cleanup

### Problem

Skills currently write session metadata (hostname, branch, timestamps, commit SHAs) into card descriptions. With audit logging, this metadata belongs in `board_actions`.

### Changes

Update these skills to stop writing metadata to descriptions:

| Skill | Current description writes | Replacement |
|---|---|---|
| `run-kanban` | `[hostname] \| Branch: <branch> \| Started: <time>` | `board_actions` audit log captures agent session ID and timestamp |
| `run-kanban` | `Progress: X/Y (Z%) \| Completed: <time>` | Use `update-card --progress <pct>` (already tracked in audit log) |
| `ship-kanban` | Commit SHAs appended to description | Commit SHAs in `board_actions` changes JSONB: `{ field: "commits", to: "<sha1>, <sha2>" }` |
| `ship-end-kanban` | Commit SHAs + session wrap-up note | Same as ship-kanban |

Card descriptions should contain only user-authored content (what the card is about), not system metadata.

---

## 5. Skill Updates Summary

### KANBAN-SETUP.md

Add to the shared setup protocol:
- After board validation, generate `agentSessionId` (`<hostname>-<ISO timestamp>`)
- Store it for use in all subsequent `logAction()` calls

### All kanban skills

- Pass `--expect-updated-at <timestamp>` on mutation commands (read from the card's state fetched during board overview or search)
- Handle conflict errors with smart retry (simple ops auto-retry, content ops surface to user)
- Call `activity --card <id>` before mutations on shared cards (display brief summary)
- Stop writing metadata to card descriptions

---

## Test Plan

### Unit Tests (add to kanban.test.mjs)

1. **Audit logging**: After create-card, verify a board_actions row exists with correct action, entity, userId, actorType
2. **Audit logging failure**: Simulate audit insert failure, verify the mutation still succeeds
3. **Optimistic lock success**: update-card with correct --expect-updated-at succeeds
4. **Optimistic lock conflict**: update-card with stale --expect-updated-at returns conflict error
5. **Optimistic lock omitted**: update-card without flag uses last-write-wins (backwards compat)
6. **Activity command**: Create card, mutate it, verify activity returns correct actions
7. **Description clearing**: update-card --description "" clears description (already implemented)

### Concurrency Tests (from existing test plan)

Scenarios C1-C10 from `specs/kanban-production-test-plan.md` become actionable once optimistic locking is in place. Implement them after this spec ships.

---

## Dependencies

- **Poketo Work real-time spec**: CLI writes trigger Y.Doc sync via DB NOTIFY. See companion spec.
- **board_actions schema**: Already exists in production DB. No migration needed.
- **Session config**: Must contain `userId` (already present from bootstrap-session.mjs).
