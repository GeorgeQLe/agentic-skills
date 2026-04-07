---
name: sync-roadmap-kanban
description: Reconcile kanban board state with roadmap docs and codebase reality — sync cards, steps, and git history so they agree.
type: ops
version: 1.1.0
allowed-tools: Bash(poketo *), Bash(git *)
---

# Sync Roadmap ↔ Kanban

Reconcile the kanban board, roadmap docs, and codebase state so all three reflect the same reality.

## Workflow

1. **Pull latest** — run the sync skill first. Stop on merge conflicts.

2. **Read kanban state** — run `poketo kanban boards` to list all boards. Auto-detect the project board:
   - If `tasks/.kanban-board` exists and contains a valid board ID, use it after verifying via `poketo kanban board <id>`.
   - Otherwise, match board names against `basename $(pwd)` (case-insensitive substring). If exactly one match, use it and save the ID to `tasks/.kanban-board`.
   - If zero or multiple matches, list boards, ask the user to pick, and save their choice to `tasks/.kanban-board`. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`.
   - Run `poketo kanban board <id>` to get the full board state.

3. **Read roadmap docs** — read `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/manual-todo.md` (if it exists). List all items with checked/unchecked status.

4. **Read codebase reality** — `git log --oneline -30`. For items claimed done, verify deliverables exist (file checks, grep for key identifiers). Flag ambiguous cases.

5. **Reconcile** using these rules:
   - **Done on kanban + code confirms** → check off in roadmap
   - **Done in roadmap + code confirms** → move kanban card to Done
   - **New roadmap items, no card** → create kanban cards (backlog or in-progress)
   - **Orphaned cards** → flag (do NOT delete)
   - **Claimed done, code doesn't support** → flag as discrepancy (do NOT uncheck)

6. **Apply changes** — create/move cards via `poketo kanban`, edit roadmap docs. Re-fetch board to confirm.

7. **Report** — synced items, discrepancies needing human judgment, updated board state, roadmap progress, manual task status (from `tasks/manual-todo.md` if it exists).

## Constraints

- Do not auto-resolve discrepancies — report and let the user decide.
- Do not delete kanban cards.
- Do not modify code — sync metadata only.
- Do not proceed on a dirty tree with merge conflicts.
- Match cards to roadmap items by name similarity; ask when ambiguous.
- If the poketo CLI is unavailable or the gateway fails, report the error and stop.
