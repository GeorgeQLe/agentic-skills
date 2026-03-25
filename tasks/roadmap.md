# Claude Skills — Roadmap

## Phase 1: Kanban Skill Suite ✓

**Goal:** Create a parallel set of `-kanban` workflow skills that manage kanban board state alongside their normal operations. Board lists: Backlog → Todo → In Progress → Done → Punt.

### Prerequisites (done)
- `/poketo-kanban` skill — low-level board CRUD
- `/sync-roadmap-kanban` skill — standalone reconciliation with board auto-detection via `tasks/.kanban-board`

### Steps

1. **`brainstorm-kanban`** (Claude + Codex)
   - Full copy of `/brainstorm` with kanban ops added
   - After generating ideas, create one card per idea in the Backlog list
   - Card name: idea title. Card description: idea details, effort estimate, category

2. **`plan-interview-kanban`** (Claude + Codex)
   - Full copy of `/plan-interview` with kanban ops added
   - After validating/speccing an idea, find the matching Backlog card and update it with spec details
   - If no matching card exists, create one in Backlog with the spec summary

3. **`roadmap-kanban`** (Claude + Codex)
   - Full copy of `/roadmap` with kanban ops added
   - After building the phased plan, move specced Backlog cards to the Todo list
   - Create Todo cards for any roadmap phases/steps that don't have cards yet

4. **`run-kanban`** (Claude + Codex)
   - Full copy of `/run` with kanban ops added
   - At session start, move the current step's card from Todo to In Progress
   - Cross-device conflict detection: scan In Progress for cards from other hostnames, warn on overlap
   - After step completion, update the card (mark progress, add notes)

5. **`ship-kanban`** (Claude + Codex)
   - Full copy of `/ship` with kanban ops added
   - After shipping, move the step's card to Done
   - If work is deferred/blocked, move to Punt with a reason in the description
   - When planning next step, ensure the next card is in Todo

6. **`ship-end-kanban`** (Claude + Codex)
   - Full copy of `/ship-end` with kanban ops added
   - After wrapping up, move the session's In Progress card to Done with commit refs

### Milestone
- [x] Full kanban lifecycle works: brainstorm creates Backlog cards → plan-interview specs them → roadmap moves to Todo → run moves to In Progress (with conflict warnings) → ship/ship-end moves to Done or Punt

---

## Phase 2: Proactive Board Intelligence ← NEXT

**Goal:** Agents use board state to make smarter decisions about what to work on.

### Steps

1. **Session start board check**
   - Kanban skills read the board at session start to understand project priorities
   - Surface overdue cards, blocked items, and high-priority backlog

2. **Auto-suggest next work**
   - After `/ship-end-kanban`, read the board and suggest the highest-priority unstarted card
   - Factor in due dates, starred status, and dependency order

3. **Progress tracking**
   - Update card `progress` field as agents complete sub-tasks within a step
   - `/run-kanban` updates progress percentage based on step completion within the phase

### Milestone
- Agent recommends next task based on board state and project priorities

---

## Backlog

- **Board templates** — pre-built board layouts for common project types (Backlog/Todo/In Progress/Done/Punt)
- **Kanban analytics** — cycle time, throughput, WIP limits surfaced via a `/kanban-stats` skill
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push to sync agent board changes to the web app
- **Archive/cleanup automation** — auto-archive done cards older than N days
