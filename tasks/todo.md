# Phase 1: Kanban Skill Suite

**Goal:** Create parallel `-kanban` workflow skills with board operations. Board: Backlog → Todo → In Progress → Done → Punt.

## Steps

- [x] **Step 0: Fix kanban.mjs `--lists` flag** — support `name:type` annotations so Done/Punt get correct listType
- [x] **Step 1: `brainstorm-kanban`** — full copy of brainstorm + create one Backlog card per idea (idempotent: skip existing)
- [x] **Step 2: `plan-interview-kanban`** — full copy of plan-interview + update matching Backlog card with spec (search all lists, fuzzy match, ask if ambiguous)
- [x] **Step 3: `roadmap-kanban`** — full copy of roadmap + move specced Backlog cards → Todo, create step cards for current phase
- [ ] **Step 4: `run-kanban`** — full copy of run + move Todo → In Progress + cross-device conflict warnings + stale session cleanup
- [ ] **Step 5: `ship-kanban`** — full copy of ship + move In Progress → Done/Punt based on todo.md state
- [ ] **Step 6: `ship-end-kanban`** — full copy of ship-end + move In Progress → Done with commit refs

## Milestone
- [ ] Full kanban lifecycle works: brainstorm → plan-interview → roadmap → run → ship/ship-end across board lists

## Shared protocols (copied into each -kanban skill)

**Board Resolution:** Check `tasks/.kanban-board` → validate → auto-detect by repo name → ask user → optionally create board with 5 lists

**Board Validation:** After resolving board, verify all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones.

**Graceful Degradation:** If poketo-kanban scripts missing or DB unreachable, warn and run base skill behavior. Never block core workflow.

**Hostname:** `hostname -s | tr '[:upper:]' '[:lower:]'` — short name, lowercase, consistent across sessions.

**Script path:** `~/.claude/skills/poketo-kanban/scripts/kanban.mjs` (hardcoded, not `${CLAUDE_SKILL_DIR}`)

## Edge cases handled

- **Idempotency:** Search before create, skip duplicates (brainstorm, roadmap)
- **Fuzzy card matching:** 2-3 keywords, ask user if ambiguous (plan-interview)
- **Card already moved:** Search all lists, update in place, never move backward from Done/Punt
- **No card exists:** Create directly in target list
- **Stale sessions:** `[this-hostname]` card for different step → warn, offer cleanup
- **Cross-device conflicts:** Scan In Progress for other hostnames, warn on overlap
- **Plain In Progress cards:** Report as "untracked work, origin unknown"
- **Done vs Punt:** Checkbox checked = Done, blocker = Punt, unclear = ask user
- **Missing lists:** Auto-create via `create-list`
- **No board:** Ask user to create with 5-list template

---

## Next Step Plan: roadmap-kanban

### What
Create `roadmap-kanban` skill (Claude + Codex). Full copy of `/roadmap` with kanban ops: after building the phased plan, move specced Backlog cards to Todo and create step cards for the current phase.

### Files to create
- `claude/roadmap-kanban/SKILL.md` — full copy of `claude/roadmap/SKILL.md` + kanban ops + shared protocols
- `codex/roadmap-kanban/SKILL.md` — condensed Codex version
- `codex/roadmap-kanban/agents/openai.yaml` — agent manifest

### Approach
1. Copy the full content of the base roadmap SKILL.md
2. Add `allowed-tools: Bash(node *)` to frontmatter
3. Add the shared Kanban Setup section (identical to brainstorm-kanban/plan-interview-kanban)
4. Add a **Kanban Sync** section after the roadmap is written (after step 5):
   - For the current phase (written to `tasks/todo.md`): create one card per `- [ ]` step in the Todo list
   - For future phases: create one summary card per phase in Backlog
   - Before creating any card, search for existing card by name — skip if found (idempotent)
   - Move any matching Backlog cards to Todo if they correspond to current phase steps
   - Only move cards FROM Backlog — never move backward from Todo/In Progress/Done/Punt
5. Keep `argument-hint: [--existing] [path-to-spec]` from base skill

### Key context (established pattern)
- Kanban Setup → main process → Kanban Sync (same structure as previous -kanban skills)
- Script path: `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- Commands: `search --query`, `create-card`, `move-card --id <id> --list <todo-list-id>`
- Card granularity: one card per `- [ ]` step (not per phase) for current phase; one summary card per future phase

### Acceptance criteria
- roadmap-kanban contains full roadmap process + kanban card creation/movement
- Current phase steps → Todo cards, future phases → Backlog summary cards
- Idempotent: search before create, skip duplicates
- Only moves cards FROM Backlog → Todo, never backward
- Both Claude and Codex versions + openai.yaml
- `bash install.sh` installs the new skill
