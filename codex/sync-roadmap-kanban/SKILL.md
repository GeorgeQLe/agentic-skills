---
name: sync-roadmap-kanban
description: Reconcile kanban board state with roadmap docs and codebase reality.
---

# Sync Roadmap ↔ Kanban

Reconcile the kanban board, roadmap docs, and codebase state so all three reflect the same reality.

## Workflow

1. **Pull latest** — run the sync skill first. Stop on merge conflicts.

2. **Read kanban state** — run `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards`, then `board <id>` for the project board. If multiple boards exist, check `tasks/.kanban-board` for a stored board ID, or ask the user.

3. **Read roadmap docs** — read `tasks/roadmap.md` and `tasks/todo.md`. List all items with checked/unchecked status.

4. **Read codebase reality** — `git log --oneline -30`. For items claimed done, verify deliverables exist (file checks, grep for key identifiers). Flag ambiguous cases.

5. **Reconcile** using these rules:
   - **Done on kanban + code confirms** → check off in roadmap
   - **Done in roadmap + code confirms** → move kanban card to Done
   - **New roadmap items, no card** → create kanban cards (backlog or in-progress)
   - **Orphaned cards** → flag (do NOT delete)
   - **Claimed done, code doesn't support** → flag as discrepancy (do NOT uncheck)

6. **Apply changes** — create/move cards via kanban.mjs, edit roadmap docs. Re-fetch board to confirm.

7. **Report** — synced items, discrepancies needing human judgment, updated board state, roadmap progress.

## Constraints

- Do not auto-resolve discrepancies — report and let the user decide.
- Do not delete kanban cards.
- Do not modify code — sync metadata only.
- Do not proceed on a dirty tree with merge conflicts.
- Match cards to roadmap items by name similarity; ask when ambiguous.
