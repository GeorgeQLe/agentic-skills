# Kanban Offline Queue & Soft-Delete

> **Status:** Legacy (kanban.mjs fallback path).
> Active kanban skills now run on `poketo kanban` (headless HTTP). `kanban.mjs` is fallback/admin-only.
> See `specs/poketo-headless-auth-migration.md` for the active path.

**Status:** Draft
**Date:** 2026-03-27
**Scope:** Offline write queue with sync, soft-delete with TTL, and their test plans
**Related:** [kanban-production-test-plan.md](kanban-production-test-plan.md) (concurrency, load, safety gate tests)

---

## Goals

Make the poketo-kanban skill resilient to Neon outages and destructive operations:

1. **Offline write queue** — queue mutations locally when Neon is unreachable, sync when connectivity returns
2. **Soft-delete with TTL** — make destructive operations recoverable for 30 days
3. **Test plans** for both features

## Non-Goals

- Offline reads / cached board state (reads fail immediately when Neon is unreachable)
- Automatic background sync (sync is triggered manually or by skill invocation)
- Neon infrastructure changes (failover, connection pooling)
- Queue replication or backup beyond the local SQLite file

---

## 1. Offline Write Queue

### 1.1 Architecture

When a write operation (create, update, move, archive, delete) fails due to Neon being unreachable (connection refused, timeout, 5xx), kanban.mjs queues the operation locally and returns a success response with a `queued: true` flag.

Read operations (boards, board, search) **fail immediately** with a clear error when Neon is unreachable. No stale data is served.

```
┌─────────────┐     ┌───────────┐     ┌──────────┐
│ kanban.mjs  │────▶│  Neon DB  │     │ SQLite   │
│ (command)   │     │ (primary) │     │ (queue)  │
└──────┬──────┘     └───────────┘     └────▲─────┘
       │                                    │
       │  on connection failure             │
       └────────────────────────────────────┘
              queue write locally
```

### 1.2 Queue Storage

**Engine:** better-sqlite3 (WAL mode)
**Location:** `~/.poketo/offline-queue.db`

**Schema:**

```sql
CREATE TABLE queue (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  command    TEXT NOT NULL,          -- e.g. "create-card", "move-card"
  args_json  TEXT NOT NULL,          -- full argument array as JSON
  queued_at  TEXT NOT NULL,          -- ISO 8601 timestamp
  status     TEXT NOT NULL DEFAULT 'pending',  -- pending | synced | failed | expired
  error      TEXT,                   -- error message if sync failed
  entity_id  TEXT,                   -- target card/board/list ID (for conflict detection)
  entity_updated_at TEXT            -- entity's updatedAt at queue time (for conflict detection)
);
```

**Indexes:**
- `CREATE INDEX idx_queue_status ON queue(status);`
- `CREATE INDEX idx_queue_entity ON queue(entity_id);`

### 1.3 Queue Limits

- **Hard limit:** 100 pending operations
- When the queue is full, new writes fail with: `{ "error": "Offline queue full (100 ops). Run 'kanban.mjs sync' or wait for connectivity." }`
- No time-based expiry — operations stay pending until explicitly synced or the queue is manually cleared

### 1.4 Queueing Behavior

When a write command fails with a connection error:

1. Detect connection failure (match error patterns: `ECONNREFUSED`, `ETIMEDOUT`, `fetch failed`, HTTP 502/503/504)
2. If queue has < 100 pending ops, insert the operation
3. Return: `{ "queued": true, "queuePosition": N, "command": "create-card", "message": "Neon unreachable. Operation queued locally. Run 'kanban.mjs sync' to flush." }`
4. If queue is full, return error (see above)

Non-connection errors (400, 409, FK violations) are **not queued** — they fail immediately as they would fail on retry too.

### 1.5 New Command: `sync`

```bash
kanban.mjs sync [--dry-run]
```

Flushes the offline queue to Neon:

1. Connect to Neon. If still unreachable, fail with error.
2. Read all `pending` operations in FIFO order (by `id`).
3. For each operation:
   a. **Conflict check:** If `entity_id` is set, query Neon for the entity's current `updatedAt`. If it differs from `entity_updated_at` stored in the queue, this is a **conflict**.
   b. **No conflict:** Execute the operation. Mark as `synced`.
   c. **Conflict detected:** Mark as `failed` with error describing the conflict. Output the conflict details (local op vs remote state) as JSON.
   d. **Entity not found:** (e.g. card was deleted remotely) Mark as `failed` with "entity not found" error.
4. Return summary: `{ "synced": N, "conflicts": N, "failed": N, "remaining": N }`

**Conflict output format:**

```json
{
  "conflicts": [
    {
      "queueId": 7,
      "command": "update-card",
      "entityId": "abc-123",
      "localOp": { "args": ["--id", "abc-123", "--progress", "50"] },
      "remoteState": { "updatedAt": "2026-03-27T14:00:00Z", "progress": 75 },
      "queuedAt": "2026-03-27T12:00:00Z",
      "reason": "Entity modified remotely since queue time"
    }
  ]
}
```

The calling skill or user decides what to do with conflicts. kanban.mjs does not resolve them automatically.

**Dry-run mode:** `sync --dry-run` checks for conflicts and reports what would happen without executing any operations.

### 1.6 Corruption Recovery

On SQLite open, if the database reports corruption:

1. Log the error to stderr
2. Rename the corrupt file to `offline-queue.db.corrupt.bak` (with timestamp suffix if .bak already exists)
3. Create a fresh queue database
4. Return: `{ "warning": "Queue database was corrupted and has been reset. Pending operations were lost. Backup saved to offline-queue.db.corrupt.bak" }`

WAL mode minimizes corruption risk. The detect-and-reset approach prioritizes system recovery over data preservation, since queued operations can typically be re-issued.

---

## 2. Soft-Delete with TTL

### 2.1 Schema Changes

Add a `deleted_at` column to the `card` and `board` tables:

```sql
ALTER TABLE card ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE board ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
```

**Index:** `CREATE INDEX idx_card_deleted ON card(deleted_at) WHERE deleted_at IS NOT NULL;`

### 2.2 Behavior Changes

**Delete operations:**
- `delete-board --id B --confirm` sets `deleted_at = NOW()` instead of `DELETE FROM`
- `archive-card --id C` is NOT a soft-delete (archiving moves to Archive list; it's still visible)
- A new `delete-card --id C --confirm` command soft-deletes individual cards

**Read operations:**
- All queries add `WHERE deleted_at IS NULL` to exclude soft-deleted items
- `boards` lists only non-deleted boards
- `board <id>` shows only non-deleted cards
- `search` excludes soft-deleted cards

**Restore:**
- New command: `kanban.mjs restore --id <entity-id>`
- Sets `deleted_at = NULL` on the entity
- Works for both cards and boards
- If the entity's parent (board for a card, list for a card) is also soft-deleted, restore fails with a message to restore the parent first

### 2.3 TTL and Purge

**TTL:** 30 days from `deleted_at`

**Purge command:**
```bash
kanban.mjs purge-deleted [--dry-run] [--confirm]
```

1. Find all entities where `deleted_at < NOW() - 30 days`
2. `--dry-run`: List what would be purged, exit
3. `--confirm` required for actual purge (safety gate)
4. Permanently DELETE matching entities (cascading for boards)
5. Return: `{ "purged": { "boards": N, "cards": N } }`

No automatic purging. The user or a skill invokes `purge-deleted` periodically.

### 2.4 New Commands Summary

| Command | Description | Safety Gate |
|---------|-------------|-------------|
| `sync [--dry-run]` | Flush offline queue to Neon | None (dry-run available) |
| `delete-card --id C --confirm` | Soft-delete a single card | --confirm required |
| `restore --id <id>` | Restore a soft-deleted entity | None |
| `purge-deleted [--dry-run] --confirm` | Permanently delete expired entities | --confirm required |

### 2.5 Modified Commands

| Command | Change |
|---------|--------|
| `delete-board` | Now sets `deleted_at` instead of `DELETE FROM` |
| All read commands | Add `WHERE deleted_at IS NULL` filter |

---

## 3. Test Plan: Offline Queue

### 3.1 Queue Behavior Tests

| # | Test | Description | Expected |
|---|------|-------------|----------|
| Q1 | Queue on connection failure | Mock Neon failure, run create-card | Returns `{ queued: true }`, op in SQLite |
| Q2 | Queue preserves args | Queue a complex command, read back from SQLite | args_json matches original arguments |
| Q3 | Queue limit enforced | Fill queue to 100, attempt 101st | 101st fails with "queue full" error |
| Q4 | Queue limit boundary | Fill to 99, add one more | 100th succeeds. 101st fails. |
| Q5 | Read ops not queued | Mock Neon failure, run `board <id>` | Immediate error, nothing in queue |
| Q6 | Non-connection errors not queued | Cause FK violation | Immediate error, nothing in queue |
| Q7 | Queue position reported | Queue 3 ops, check positions | Positions 1, 2, 3 reported correctly |
| Q8 | Queue with entity tracking | Queue update-card for card X | entity_id and entity_updated_at populated |

### 3.2 Sync Tests

| # | Test | Description | Expected |
|---|------|-------------|----------|
| SY1 | Sync success | Queue 3 ops, restore Neon, sync | All 3 synced, status = synced |
| SY2 | Sync FIFO order | Queue create-card then move-card (same card) | Create applied before move. Card exists in correct list. |
| SY3 | Sync conflict detection | Queue update-card, modify same card directly, sync | Conflict reported with both local and remote state |
| SY4 | Sync entity not found | Queue update-card, delete card directly, sync | Failed with "entity not found" |
| SY5 | Sync partial success | Queue 5 ops, 2 conflict, 3 clean | 3 synced, 2 failed, summary accurate |
| SY6 | Sync dry-run | Queue ops, sync --dry-run | Report generated, queue unchanged, no DB writes |
| SY7 | Sync when Neon still down | Queue ops, sync without restoring connectivity | Fails with "Neon unreachable" |
| SY8 | Sync empty queue | Run sync with nothing queued | Returns `{ synced: 0, conflicts: 0 }` |

### 3.3 Corruption Recovery Tests

| # | Test | Description | Expected |
|---|------|-------------|----------|
| CR1 | Corrupt DB detected | Replace queue file with garbage bytes, run any write | Warning about corruption, fresh DB created, .bak saved |
| CR2 | Backup naming | Corrupt twice | First: .corrupt.bak, second: .corrupt.1.bak |
| CR3 | Recovery functional | After corruption recovery, queue a new op | New op queued successfully in fresh DB |

---

## 4. Test Plan: Soft-Delete

### 4.1 Soft-Delete Behavior

| # | Test | Description | Expected |
|---|------|-------------|----------|
| SD1 | Board soft-delete | `delete-board --id B --confirm` | deleted_at set, board hidden from `boards` listing |
| SD2 | Card soft-delete | `delete-card --id C --confirm` | deleted_at set, card hidden from board view |
| SD3 | Soft-deleted card excluded from search | Soft-delete a card, search for its name | Not found |
| SD4 | Soft-deleted board excluded from board view | Soft-delete a board, request `board <id>` | Error: board not found |
| SD5 | --confirm required | `delete-card --id C` (no --confirm) | Error requiring --confirm |
| SD6 | Dry-run for delete-card | `delete-card --id C --dry-run` | Preview shown, card still exists |

### 4.2 Restore

| # | Test | Description | Expected |
|---|------|-------------|----------|
| R1 | Restore card | Soft-delete card, restore it | Card reappears in board view and search |
| R2 | Restore board | Soft-delete board, restore it | Board reappears in `boards` listing with all cards |
| R3 | Restore non-deleted entity | `restore --id <active-card>` | Error: entity is not deleted |
| R4 | Restore card with deleted parent | Soft-delete board, try restoring a card in it | Error: restore parent board first |
| R5 | Restore non-existent entity | `restore --id <invalid>` | Error: entity not found |

### 4.3 Purge

| # | Test | Description | Expected |
|---|------|-------------|----------|
| P1 | Purge expired | Soft-delete card, set deleted_at to 31 days ago, purge | Card permanently deleted |
| P2 | Purge skips recent | Soft-delete card (deleted_at = now), purge | Card NOT purged (within 30-day TTL) |
| P3 | Purge --confirm required | `purge-deleted` (no --confirm) | Error requiring --confirm |
| P4 | Purge dry-run | `purge-deleted --dry-run` | Lists candidates, nothing deleted |
| P5 | Purge cascading | Soft-delete board 31 days ago, purge | Board AND all its lists/cards permanently deleted |
| P6 | Purge empty | No soft-deleted entities, purge | Returns `{ purged: { boards: 0, cards: 0 } }` |
| P7 | Purge boundary | Card deleted exactly 30 days ago | NOT purged (30 days = still within TTL, 31+ = expired) |

---

## Implementation Notes

### Dependencies

- **New production dependency:** `better-sqlite3` (already used in archived kanban-lite)
- **Schema migration:** Two `ALTER TABLE` statements for `deleted_at` columns + indexes

### File Changes

| File | Change |
|------|--------|
| `kanban.mjs` | Add offline queue logic, sync command, soft-delete logic, restore command, delete-card command, purge-deleted command. Modify delete-board to soft-delete. Add `WHERE deleted_at IS NULL` to all read queries. |
| `kanban.test.mjs` | Add test suites for queue, sync, corruption, soft-delete, restore, purge |
| `package.json` | Add `better-sqlite3` to dependencies |
| `SKILL.md` | Document new commands: sync, delete-card, restore, purge-deleted |

### Estimated Scope

- Queue + sync: ~150 lines in kanban.mjs
- Soft-delete + restore + purge: ~80 lines in kanban.mjs
- Read query modifications: ~20 lines (add WHERE clauses)
- New tests: ~40 test cases across queue, sync, soft-delete, restore, purge
- Total: ~250 lines production code, ~500 lines test code
