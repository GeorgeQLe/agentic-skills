# Kanban Skill Test Results

**Date:** 2026-03-26
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

## Layer 2: Manual Skill Walkthrough

| # | Skill | Status | Notes |
|---|-------|--------|-------|
| 1 | `/poketo-kanban` (Board Resolution) | PASS | boards listed, create-board --template standard works, .kanban-board saved |
| 2 | `/brainstorm-kanban` | TODO | |
| 3 | `/plan-interview-kanban` | TODO | |
| 4 | `/roadmap-kanban` | TODO | |
| 5 | `/run-kanban` | TODO | |
| 6 | `/ship-kanban` | TODO | |
| 7 | `/ship-end-kanban` | TODO | |
| 8 | `/sync-roadmap-kanban` | TODO | |
| 9 | `/kanban-archive` | TODO | |

## How to continue testing

Each remaining skill is a prompt-based skill that must be invoked as a slash command in a Claude Code session. Run them in order:

```
# Ensure DB URL is set
export POKETOWORK_DATABASE_URL="postgresql://neondb_owner:npg_Xhe1jozvOmq9@ep-withered-darkness-adjgyvq0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Then invoke each skill:
/brainstorm-kanban testing
/plan-interview-kanban <pick an idea from brainstorm output>
# ... etc

# After each skill, verify board state:
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs board 5ab6bbdb-d06c-4e47-8a27-5e1de29b2df7
```

Update this file with results as each skill is tested.
