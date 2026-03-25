# Claude Skills — Roadmap

## Phase 1: Kanban-Roadmap Sync ← NEXT

**Goal:** Keep kanban boards, roadmap docs, and codebase state in agreement automatically.

### Steps

1. **Create `/sync-roadmap-kanban` skill (Claude + Codex)**
   - Run `/sync` first — pull latest, run `sync.md` actions, halt on conflicts
   - Read kanban state via poketo-kanban (`boards` → `board <id>`)
   - Read roadmap docs (`tasks/roadmap.md`, `tasks/todo.md`)
   - Read codebase reality (`git log` since last sync, file existence checks)
   - Reconcile:
     - Cards done on kanban + confirmed in code → mark roadmap items complete
     - Roadmap steps done in code but not on kanban → move cards to Done
     - New roadmap items with no card → create kanban cards
     - Kanban cards with no roadmap entry → flag as orphaned
     - Items claimed done but code doesn't support → flag as discrepancy
   - Apply changes to both kanban and roadmap docs
   - Report: what changed, discrepancies needing human judgment

2. **Board-project auto-detection**
   - Match board to project by board name vs repo/directory name
   - If no match, prompt user to select or create a board
   - Store board-project mapping in project's `tasks/` directory

3. **Add sync-roadmap-kanban trigger to workflow skills**
   - `/run` and `/ship` variants optionally call sync at session start
   - Keep it opt-in (flag or config) to avoid slowing down quick tasks

### Milestone
- Agent runs `/sync-roadmap-kanban` → kanban and roadmap reflect the same state, grounded in what the code actually shows

---

## Phase 2: Cross-Device Agent Awareness

**Goal:** Agents on different devices see each other's in-progress work and avoid conflicts.

### Steps

1. **Session activity cards**
   - When an agent starts a session, create/update an "In Progress" card with device name, branch, and task summary
   - On `/ship-end`, move the card to Done with commit references

2. **Conflict detection**
   - Before starting work, check kanban for in-progress cards on the same files/features from other devices
   - Warn the user if another session is working on overlapping scope

3. **Device tagging on cards**
   - Add device/machine identifier to card metadata (description field)
   - `/poketo-kanban board <id>` output shows which device last touched each card

### Milestone
- Two agents on different machines can see each other's active work on the kanban board

---

## Phase 3: Proactive Board Intelligence

**Goal:** Agents use board state to make smarter decisions about what to work on.

### Steps

1. **Session start board check**
   - Agents read the board at session start to understand project priorities
   - Surface overdue cards, blocked items, and high-priority backlog

2. **Auto-suggest next work**
   - After `/ship-end`, read the board and suggest the highest-priority unstarted card
   - Factor in due dates, starred status, and dependency order

3. **Progress tracking**
   - Update card `progress` field as agents complete sub-tasks within a step
   - `/run` updates progress percentage based on step completion within the phase

### Milestone
- Agent recommends next task based on board state and project priorities

---

## Backlog

- **Board templates** — pre-built board layouts for common project types (monorepo, library, SaaS app)
- **Kanban analytics** — cycle time, throughput, WIP limits surfaced via a `/kanban-stats` skill
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push to sync agent board changes to the web app
- **Archive/cleanup automation** — auto-archive done cards older than N days
