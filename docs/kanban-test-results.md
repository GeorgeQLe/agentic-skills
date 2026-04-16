# Kanban Skill Test Results

> Scope note: the end-to-end invocation results below are Claude Code results. They include Claude-specific behaviors such as AskUserQuestion checkpoints and entering plan mode. They should not be read as proof that the Codex variants currently support the same workflow semantics.

**Date:** 2026-03-27 (re-verified from 2026-03-26)
**Board:** claude-skills (`5ab6bbdb-d06c-4e47-8a27-5e1de29b2df7`)
**DB:** Neon (production)

## Layer 1: Scripted Integration Tests

| Test Suite | Tests | Status |
|---|---|---|
| Board lifecycle | 5 | PASS |
| Card CRUD | 7 | PASS |
| Card movement | 4 | PASS |
| Search | 2 | PASS |
| Error handling | 4 | PASS |
| Cleanup | 1 | PASS |
| **Total** | **24** | **ALL PASS** |

## Layer 2: Manual Command Verification

| # | Skill | Status | Notes |
|---|-------|--------|-------|
| 1 | `/poketo-kanban` (Board Resolution) | PASS | `boards` lists 21 boards, claude-skills board has 5 lists (correct types), `tasks/.kanban-board` contains correct ID |
| 2 | `/brainstorm --kanban` | PASS | 5 testing ideas generated, 5 Backlog cards created, no duplicates, idempotency search worked |
| 3 | `/plan-interview --kanban` | PASS | update-card updated Backlog card description with spec details |
| 4 | `/roadmap --kanban` | PASS | move-card moved specced card from Backlog → Todo |
| 5 | `/run --kanban` | PASS | move-card Todo → In Progress works, hostname/branch metadata in description. `--progress` flag now works (was missing from arg parser — fixed) |
| 6 | `/ship --kanban` | PASS | move-card In Progress → Done, `--done` flag works, commit ref in description |
| 7 | `/ship-end --kanban` | PASS | In Progress → Done with session wrap-up note, `done: true` set |
| 8 | `/sync-roadmap-kanban` | PASS | board state consistent: 3 Backlog, 0 Todo, 0 In Progress, 2 Done, 0 Punt |
| 9 | `/poketo-kanban --archive` | PASS | 2 Done cards archived to auto-created Archive list, `--confirm` flag required |

## Findings

### Fixed: `--progress` flag was silently ignored
- **Severity:** Low
- **Root cause:** `cmdUpdateCard` in `kanban.mjs` never parsed the `--progress` argument despite the `progress` column existing in the schema
- **Fix:** Added `getArg(args, "--progress")` parsing in `cmdUpdateCard` (1 line)
- **Verified:** `update-card --id <id> --progress 50` now returns `progress: 50`, all 24 tests pass

### All operations verified
- Full lifecycle: Backlog → Todo → In Progress → Done → Archive works correctly
- Card CRUD (create, update description, mark done, move, archive) all functional
- Search deduplication works (brainstorm --kanban idempotency)
- `--confirm` flag required for archive (safety gate works)
- Board auto-creates Archive list on first archive operation

## Layer 3: End-to-End Skill Invocation

| # | Skill | Status | Notes |
|---|-------|--------|-------|
| 1 | `/brainstorm --kanban` | PASS | Board resolved from `tasks/.kanban-board`, 7 new ideas generated, 7 Backlog cards created (14 total), idempotency search worked, `tasks/ideas.md` appended correctly |
| 2 | `/plan-interview --kanban` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), overview displayed (Backlog: 14), 3-turn interview via AskUserQuestion, `specs/board-flag-kanban-search.md` + interview log written, card `b0b9800e` updated with spec summary + path, card stayed in Backlog |
| 3 | `/roadmap --kanban` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), overview displayed (Backlog: 14, Todo: 0), existing mode detected (Phases 1-5 complete), 2-turn interview via AskUserQuestion, `tasks/roadmap.md` updated (Phases 6-9 added), `tasks/history.md` updated, 2 cards moved Backlog→Todo (edge cases + create-list), 3 future phase cards created in Backlog, todo.md preserved (user chose to keep validation work) |
| 4 | `/run --kanban` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), overview displayed (Backlog: 15, Todo: 2, In Progress: 0), todo.md read → next step "Manual walkthrough of kanban skills", card `31e37110` created in In Progress with `[hb-a]` hostname + `Branch: master` + timestamp, conflict check passed (0 conflicts), plan mode entered, card progress set to 0% (step in progress) |
| 5 | `/ship --kanban` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), overview displayed (Backlog: 15, Todo: 2, In Progress: 1, Done: 0), 3 modified files shipped in 2 logical commits (roadmap + test results), pushed to origin/master, card `31e37110` stays In Progress (step not complete — no Done/Punt movement), card description updated with commit SHAs, no deploy (skills repo), plan mode entered with next step suggestion |
| 6 | `/ship-end --kanban` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), overview displayed (Backlog: 15, Todo: 2, In Progress: 1, Done: 0), 1 uncommitted file shipped (test results row #5), commit `f20eead` pushed to origin/master, card `31e37110` moved In Progress → Done, card marked `done: true`, description updated with commit SHAs (`808391d, f7d0f47, f20eead`), history.md updated with session wrap-up, no deploy (skills repo) |
| 7 | `/sync-roadmap-kanban` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), board state read (Backlog: 15, Todo: 2, In Progress: 0, Done: 1, Punt: 0), roadmap read and all 9 phases compared with board, codebase verified for Phases 1-5 deliverables (all confirmed), 5 reconciliation rules applied: Rule 1 no-op (done card matches session close not task completion), Rule 2 no-op (completed phases have no active cards), Rule 3 no-op (all roadmap items have cards), Rule 4 flagged 1 orphan ("Input validation layer" — from ideas.md, no roadmap phase), Rule 5 flagged 1 discrepancy (card `31e37110` in Done but todo.md unchecked — expected `/ship-end --kanban` session behavior), sync report generated |
| 8 | `/poketo-kanban --archive` | PASS | Board resolved from `tasks/.kanban-board` (no prompt), board validated (5 required lists present), Done list scanned (1 card: `31e37110`, age <1 day), Punt list scanned (0 cards), default 30-day threshold applied, no cards older than 30 days — correctly reported "nothing to archive" and stopped, `--confirm` safety gate not triggered (no candidates) |

## How to continue testing

Each remaining skill is a prompt-based skill that must be invoked as a slash command in a Claude Code session. Run them in order:

```
# Ensure headless auth is available
poketo auth login
# Or export a durable key for non-interactive use:
export POKETO_API_KEY="pk_..."

# Then invoke each skill:
/brainstorm --kanban testing
/plan-interview --kanban <pick an idea from brainstorm output>
# ... etc

# After each skill, verify board state:
poketo kanban board 5ab6bbdb-d06c-4e47-8a27-5e1de29b2df7
```
