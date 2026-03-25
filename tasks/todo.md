# Phase 2: Proactive Board Intelligence

**Goal:** Agents use board state to make smarter decisions about what to work on.

## Steps

- [x] **Session start board check** — kanban skills read the board at session start, surface overdue cards, blocked items, and high-priority backlog
- [ ] **Auto-suggest next work** — after `/ship-end-kanban`, suggest the highest-priority unstarted card based on due dates, starred status, and dependency order
- [ ] **Progress tracking** — update card `progress` field as agents complete sub-tasks; `/run-kanban` updates percentage based on step completion

## Milestone
- [ ] Agent recommends next task based on board state and project priorities
