---
name: kanban-archive
description: Archive old Done/Punt cards from kanban board
argument-hint: [optional: --days <N> to override 30-day default]
allowed-tools: Bash(node *)
---

# Kanban Archive

Archive old Done and Punt cards from the kanban board. By default, archives cards that haven't been updated in 30 days. Use `--days <N>` to override the threshold.

## Kanban Setup

Run these steps before the main process. If any step fails, report the error and stop — this skill cannot operate without a board.

### Board Resolution

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

1. If `tasks/.kanban-board` exists, read the board ID. Verify it via `board <id>`. If stale (error), delete the file and continue to step 2.
2. If no valid mapping: match board names against `basename $(pwd)` (case-insensitive). Prefer exact match over substring.
3. If one match → use it, save ID to `tasks/.kanban-board`.
4. If zero or multiple matches → list boards, ask the user to pick. Save their choice.
5. If no boards exist → ask the user if they want to create one. If yes: `create-board --name "$(basename $(pwd))" --template standard`. Save the ID.

### Board Validation

After resolving the board, verify all 5 required lists exist (case-insensitive name match): **Backlog, Todo, In Progress, Done, Punt**. If any are missing, create them via `create-list --board <id> --name "<name>"`. Store list IDs for use in subsequent operations.

### Graceful Degradation

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), report the error and stop. This skill requires a working kanban connection.

## Process

1. **Parse arguments**: Extract `--days <N>` from `$ARGUMENTS`. Default to 30 if not provided.

2. **Fetch board state**: Run `board <id>` to get all lists and cards.

3. **Find archivable cards**:
   - Identify lists with `type: "done"` or `type: "punt"`
   - For each card in those lists, calculate age from `updatedAt` (or `createdAt` if `updatedAt` is not available)
   - A card is archivable if its age exceeds the threshold (default 30 days)
   - If no cards qualify, report "No cards older than N days in Done/Punt." and stop

4. **Display candidates**:
   Show each candidate card:
   ```
   - [card name] — [list name] — last updated [date] ([age] days ago)
   ```
   Then show: "**Total: N cards to archive**"

5. **Confirm with user**: Ask "Archive these N cards? (y/n)". If the user declines, stop.

6. **Archive cards**: For each confirmed card, run:
   ```bash
   node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs archive-card --id <card-id>
   ```
   If any individual archive fails, report the error and continue with remaining cards.

7. **Report summary**: "Archived N cards (X from Done, Y from Punt)." If any failed, also report: "Failed to archive M cards."

## Constraints
- **Never archive without explicit user confirmation.**
- Process cards from Done first, then Punt — order within each list by oldest first.
- If the board has no Done or Punt lists (or they are empty), report that and stop.
- Do not archive cards from any other list types (Backlog, Todo, In Progress).
- The `archive-card` command in kanban.mjs handles auto-creating the Archive list if needed — do not create it manually.
