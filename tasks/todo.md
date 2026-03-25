# Phase 2: Proactive Board Intelligence

**Goal:** Agents use board state to make smarter decisions about what to work on.

## Steps

- [x] **Session start board check** — kanban skills read the board at session start, surface overdue cards, blocked items, and high-priority backlog
- [x] **Auto-suggest next work** — after `/ship-end-kanban`, suggest the highest-priority unstarted card based on due dates, starred status, and dependency order
- [ ] **Progress tracking** — update card `progress` field as agents complete sub-tasks; `/run-kanban` updates percentage based on step completion

## Milestone
- [ ] Agent recommends next task based on board state and project priorities

---

## Next Step Plan: Progress tracking

### What
Add progress tracking to `run-kanban`: update the card's description with step completion percentage as sub-tasks are completed within a phase.

### Files to modify
- `claude/run-kanban/SKILL.md` — update Post-Execution Card Update section to include progress percentage
- `codex/run-kanban/SKILL.md` — same (condensed)

### Approach
1. In the "Post-Execution Card Update" section of run-kanban, enhance the card update to include progress:
   - After marking a step done in todo.md, count total steps and completed steps in the current phase
   - Calculate percentage: `completed / total * 100`
   - Update card description with: `Progress: X/Y (Z%) | Completed: datetime`
2. This is a lightweight addition — just enriching the existing post-execution card update

### Key context
- run-kanban already has a Post-Execution Card Update section that adds completion time
- Steps in todo.md are `- [x]` (done) and `- [ ]` (pending) — easy to count
- The `update-card` command is already used — just enhance the description content
- No new kanban commands needed

### Acceptance criteria
- After completing a step, the card description includes progress percentage (e.g., "Progress: 3/7 (43%)")
- Progress is based on `- [x]` vs `- [ ]` counts in `tasks/todo.md`
- Both Claude and Codex versions updated
