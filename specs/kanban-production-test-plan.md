# Kanban Production Test Plan

**Status:** Draft
**Date:** 2026-03-27
**Scope:** Test plans for multi-user concurrency, progressive load/stress testing, and rollback/undo safety gates
**Related:** [kanban-offline-queue-soft-delete.md](kanban-offline-queue-soft-delete.md) (new features spec)

---

## Goals

Validate that the poketo-kanban skill is production-ready for live multi-user usage by testing three areas not covered by the existing 61 integration tests:

1. **Multi-user concurrency** — two actors racing on the same board
2. **Progressive load testing** — performance profiling from 50 to 500 cards
3. **Rollback/undo safety** — existing destructive operation safeguards work correctly

## Non-Goals

- Offline queue and sync (covered in separate spec)
- Soft-delete / undo feature (covered in separate spec)
- Unit tests for individual functions (existing subprocess integration pattern is sufficient)
- Neon infrastructure testing (uptime, failover — that's Neon's responsibility)

---

## 1. Multi-User Concurrency Tests

### 1.1 Test Harness

All concurrency tests use **parallel subprocess spawns** via `Promise.all([run(...), run(...)])` to simulate two actors racing. This matches the real-world scenario of two Claude Code sessions (two separate `node kanban.mjs` processes) hitting the same Neon DB concurrently.

For **Claude + Web App** races, one actor writes directly via Drizzle (simulating the Poketo web app's ORM layer) while the other runs `kanban.mjs` as a subprocess. Web app write patterns will be reverse-engineered from the Poketo server code / network inspection since no API docs are available.

### 1.2 Test Scenarios: Claude-to-Claude Races

| # | Scenario | Actor A | Actor B | Expected Outcome |
|---|----------|---------|---------|-----------------|
| C1 | Move-move same card | `move-card --id X --list-id L1` | `move-card --id X --list-id L2` | One wins, card ends up in exactly one list. No duplicate cards. Both return success (last-write-wins at DB level). |
| C2 | Move + update same card | `move-card --id X --list-id L1` | `update-card --id X --description "new"` | Both succeed. Card is in L1 with updated description. Neither operation should silently fail. |
| C3 | Move + mark done | `move-card --id X --list-id L1` | `update-card --id X --done` | Both succeed. Card is in L1 with done=true. |
| C4 | Move + archive | `move-card --id X --list-id L1` | `archive-card --id X` | One succeeds. If archive wins, card is in Archive list. If move wins, card is in L1. No error for the loser — verify final state is consistent. |
| C5 | Update + archive | `update-card --id X --progress 50` | `archive-card --id X` | If archive wins, progress update may be lost (acceptable). Card is in Archive. No crash. |
| C6 | Create during board delete | `create-card --list-id L1 --name "new"` | `delete-board --id B --confirm` | Board delete cascades. Create may succeed then get deleted, or fail with FK error. Either outcome is acceptable — no crash, no orphaned card. |
| C7 | Dual create same name | `create-card --list-id L1 --name "X"` | `create-card --list-id L1 --name "X"` | Both succeed. Two cards with same name (no uniqueness constraint). Verify both exist with different IDs. |
| C8 | Search during bulk mutations | `search --query "test"` | Rapid-fire 10 create-cards | Search returns a consistent snapshot (may or may not include in-flight cards). No crash, no partial JSON output. |
| C9 | Move + move different cards to same list | `move-card --id X --list-id L1` | `move-card --id Y --list-id L1` | Both succeed. Both cards end up in L1. Order values may collide — verify no crash, both cards visible. |
| C10 | Update same field simultaneously | `update-card --id X --progress 25` | `update-card --id X --progress 75` | Last-write-wins. Final progress is either 25 or 75, not corrupted. |

### 1.3 Test Scenarios: Claude + Web App Races

| # | Scenario | kanban.mjs | Web App (Drizzle direct) | Expected Outcome |
|---|----------|-----------|--------------------------|-----------------|
| W1 | Web moves card, CLI updates it | `update-card --id X --description "cli"` | Direct SQL: `UPDATE card SET list_id = L2 WHERE id = X` | Both succeed. Card in L2 with description "cli". |
| W2 | Web deletes card, CLI moves it | `move-card --id X --list-id L1` | Direct SQL: `DELETE FROM card WHERE id = X` | CLI move fails (card not found) or succeeds then card is gone. Either way, clean error or consistent state. |
| W3 | Web creates list, CLI creates card in it | `create-card --list-id <new-list-id> --name "Y"` (timed after web) | Direct SQL: `INSERT INTO list ...` | CLI succeeds if timed after list exists. If race is tight, FK error is acceptable. |
| W4 | Web bulk-inserts cards, CLI searches | `search --query "bulk"` | Direct SQL: INSERT 50 cards rapidly | Search returns consistent results. May see partial batch (acceptable). No crash. |

### 1.4 Assertions

For all concurrency tests, assert:
- No process crashes (exit code 0 or 1 with valid JSON error)
- No orphaned or duplicate entities in DB after both operations complete
- Final DB state is consistent (query the board after both ops finish)
- No partial/corrupted JSON output from either process

---

## 2. Progressive Load Testing

### 2.1 Approach

Create a dedicated test board. Insert cards in progressive tiers: **50, 100, 250, 500**. At each tier, run a fixed set of operations and record wall-clock latency. Output a performance profile with p50/p95/p99 per operation per tier.

### 2.2 Operations to Profile

At each tier, run each operation **20 times** to get statistically meaningful percentiles:

| Operation | Command | Notes |
|-----------|---------|-------|
| Board view | `board <id>` | Returns all lists + cards. Latency should scale with card count. |
| Search (broad) | `search --query "test"` | Matches many cards. Bounded by LIMIT 50. |
| Search (narrow) | `search --query "<unique-string>"` | Matches 1 card. Should be fast regardless of tier. |
| Search (scoped) | `search --query "test" --board <id>` | Board-scoped search. |
| Create card | `create-card --list-id L --name "perf-N"` | Insert latency. |
| Update card | `update-card --id <random> --progress N` | Single-row update. |
| Move card | `move-card --id <random> --list-id <random>` | Update list_id + order. |
| Archive card | `archive-card --id <random>` | Move to archive list. |

### 2.3 Latency Thresholds

**Hard ceilings** (absolute fail if exceeded):
| Operation | Hard ceiling |
|-----------|-------------|
| Single-card read/update/move | p95 < 10s |
| Board view | p95 < 15s |
| Search | p95 < 10s |
| Create card | p95 < 10s |

**Baseline regression** (fail if exceeded after first run establishes baseline):
- No operation's p95 may regress more than **20%** from the established baseline at the same tier.
- Baselines are stored in a JSON file (`perf-baseline.json`) and updated explicitly via a `--update-baseline` flag.

### 2.4 Output Format

```json
{
  "tier": 500,
  "timestamp": "2026-03-27T12:00:00Z",
  "results": {
    "board-view": { "p50": 1200, "p95": 2400, "p99": 3100, "samples": 20 },
    "search-broad": { "p50": 800, "p95": 1500, "p99": 1900, "samples": 20 }
  }
}
```

### 2.5 Cleanup

After each full run, delete the test board (`delete-board --id <test-board> --confirm`). The test creates its own board to avoid polluting existing boards.

---

## 3. Rollback/Undo Safety Gates

### 3.1 Test Scenarios

These tests verify that existing destructive operations have adequate safety mechanisms.

| # | Scenario | Test | Expected |
|---|----------|------|----------|
| S1 | delete-board without --confirm | `delete-board --id B` | Fails with error message requiring --confirm. Board still exists. |
| S2 | delete-board with --confirm | `delete-board --id B --confirm` | Board and all lists/cards deleted. Verify cascading delete. |
| S3 | delete-board dry-run | `delete-board --id B --dry-run` | Returns preview of what would be deleted. Board still exists after. |
| S4 | archive-card without --confirm | `archive-card --id C` | Verify behavior (currently no --confirm required for archive — should it be?). |
| S5 | Dry-run accuracy | `create-card --dry-run ...` then verify no card created | Dry-run must not persist. Check DB state before and after. |
| S6 | Dry-run for all mutation commands | Run `--dry-run` for create-card, update-card, move-card, delete-board, archive-card, create-list, create-board | All return preview JSON. None persist changes. |
| S7 | Error message clarity | Trigger each error path (missing args, invalid ID, FK violation) | Each error returns actionable message with the failing entity ID and what went wrong. |
| S8 | --confirm on wrong board | `delete-board --id <valid-but-wrong-board> --confirm` | Succeeds (--confirm is a safety gate, not an identity check). Verify the correct board was deleted, not another. |

### 3.2 Assertions

- Dry-run operations must leave DB state identical to before invocation
- --confirm gates must block without the flag and succeed with it
- Error messages must include: the operation attempted, the entity ID, and what went wrong
- Cascading deletes must not leave orphaned records

---

## Test Infrastructure

### File Location

All new tests go in the existing test file:
`claude/poketo-kanban/scripts/kanban.test.mjs`

New describe blocks:
- `describe("Concurrency: Claude-to-Claude races")`
- `describe("Concurrency: Claude + Web App races")`
- `describe("Progressive load testing")`
- `describe("Safety gates")`

### Test Execution

- Concurrency and safety gate tests run as part of `npm test` (vitest)
- Load tests run separately via a dedicated script (`scripts/kanban.perf.mjs`) due to long execution time (~2-5 min per full run)
- Load test results written to `scripts/perf-results/` directory

### Database

All tests run against **production Neon** with cleanup. Each test suite creates a temporary board and deletes it in `afterAll()`. If cleanup fails, the board name includes a `[TEST]` prefix for manual identification.

---

## Out of Scope

- Offline queue / sync mechanism (see [kanban-offline-queue-soft-delete.md](kanban-offline-queue-soft-delete.md))
- Soft-delete / undo feature (see [kanban-offline-queue-soft-delete.md](kanban-offline-queue-soft-delete.md))
- Neon connection pooling or infrastructure changes
- Web app API documentation (reverse-engineer as needed)
- UI/frontend testing
