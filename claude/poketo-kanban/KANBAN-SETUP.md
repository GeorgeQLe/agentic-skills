# Kanban Setup Protocol

Shared setup steps for all kanban-variant skills. Read and follow these steps before proceeding with the skill's main process.

## Board Resolution

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

1. If `tasks/.kanban-board` exists, read the board ID. Verify it via `board <id>`. If stale (error), delete the file and continue to step 2.
2. If no valid mapping: match board names against `basename $(pwd)` (case-insensitive). Prefer exact match over substring.
3. If one match → use it, save ID to `tasks/.kanban-board`.
4. If zero or multiple matches → list boards, ask the user to pick. Save their choice.
5. If no boards exist → ask the user if they want to create one. If yes: `create-board --name "$(basename $(pwd))" --template standard`. Save the ID.

## Board Validation

After resolving the board, verify all 5 required lists exist (case-insensitive name match): **Backlog, Todo, In Progress, Done, Punt**. If any are missing, create them via `create-list --board <id> --name "<name>"`. Store list IDs for use in subsequent operations.

## Graceful Degradation

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), warn the user and continue with the base (non-kanban) behavior. Kanban operations are additive — never block the core workflow.

## Board Overview

After board validation, display a brief board status to provide context:

1. Fetch the full board state: `board <id>`
2. Scan all cards and report:
   - **Overdue**: Cards with a due date in the past (highlight count and names)
   - **High priority**: Starred cards not yet in Done/Punt
   - **Blocked**: Cards whose description contains "blocked" or "blocker"
   - **In Progress**: Count of cards currently being worked on
   - **Backlog/Todo**: Counts for planning context
3. Display as a brief summary before proceeding. Do not take action — this is informational only.
