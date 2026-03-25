# Phase 2: Proactive Board Intelligence

**Goal:** Agents use board state to make smarter decisions about what to work on.

## Steps

- [x] **Session start board check** — kanban skills read the board at session start, surface overdue cards, blocked items, and high-priority backlog
- [ ] **Auto-suggest next work** — after `/ship-end-kanban`, suggest the highest-priority unstarted card based on due dates, starred status, and dependency order
- [ ] **Progress tracking** — update card `progress` field as agents complete sub-tasks; `/run-kanban` updates percentage based on step completion

## Milestone
- [ ] Agent recommends next task based on board state and project priorities

---

## Next Step Plan: Auto-suggest next work

### What
Add a "Next Work Suggestion" section to `ship-end-kanban` and `ship-kanban`. After wrapping up, read the board and suggest the highest-priority unstarted card from the Todo list.

### Files to modify
- `claude/ship-end-kanban/SKILL.md` — add suggestion after moving card to Done
- `codex/ship-end-kanban/SKILL.md` — same (condensed)
- `claude/ship-kanban/SKILL.md` — add suggestion after planning next step (or after Done if `--no-plan`)
- `codex/ship-kanban/SKILL.md` — same (condensed)

### Approach
1. Add a "Next Work Suggestion" section after the kanban Done/Punt operations:
   - Read all cards in the Todo list
   - Rank by priority: (1) overdue due date, (2) starred, (3) list position (lower = higher priority)
   - Display the top suggestion: card name, description summary, due date if set
   - If no Todo cards exist, check Backlog for high-priority items
   - This is a suggestion only — the user decides what to do next

### Key context
- ship-kanban already has `--no-plan` flag — suggestion should show regardless (even without planning)
- ship-end-kanban has no planning step — suggestion is the natural "what's next?" prompt
- The `board <id>` command returns cards with `starred`, `dueDate`, `order` fields
- Cards in Todo are already prioritized by list order (lower order = higher priority in poketo-kanban)

### Acceptance criteria
- After `/ship-end-kanban` wraps up, a "Suggested next work" line appears with the top Todo card
- After `/ship-kanban` ships, same suggestion appears
- Priority order: overdue > starred > list position
- If no Todo cards, suggests top Backlog card or reports "board is clear"
- Both Claude and Codex versions updated
