# Phase 1: Kanban Skill Suite

**Goal:** Create parallel `-kanban` workflow skills with board operations. Board: Backlog → Todo → In Progress → Done → Punt.

## Steps

- [x] **Step 0: Fix kanban.mjs `--lists` flag** — support `name:type` annotations so Done/Punt get correct listType
- [x] **Step 1: `brainstorm-kanban`** — full copy of brainstorm + create one Backlog card per idea (idempotent: skip existing)
- [x] **Step 2: `plan-interview-kanban`** — full copy of plan-interview + update matching Backlog card with spec (search all lists, fuzzy match, ask if ambiguous)
- [x] **Step 3: `roadmap-kanban`** — full copy of roadmap + move specced Backlog cards → Todo, create step cards for current phase
- [x] **Step 4: `run-kanban`** — full copy of run + move Todo → In Progress + cross-device conflict warnings + stale session cleanup
- [x] **Step 5: `ship-kanban`** — full copy of ship + move In Progress → Done/Punt based on todo.md state
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

## Next Step Plan: ship-kanban

### What
Create `ship-kanban` skill (Claude + Codex). Full copy of `/ship` with kanban ops: after shipping, move the step's card to Done or Punt based on todo.md state. When planning next step, ensure its card exists in Todo.

### Files to create
- `claude/ship-kanban/SKILL.md` — full copy of `claude/ship/SKILL.md` + kanban ops + shared protocols
- `codex/ship-kanban/SKILL.md` — condensed Codex version
- `codex/ship-kanban/agents/openai.yaml` — agent manifest

### Approach
1. Copy the full content of the base ship SKILL.md
2. Add `allowed-tools: Bash(node *)` to frontmatter, keep `argument-hint: [--no-plan] [--no-deploy]`
3. Add the shared Kanban Setup section (Board Resolution + Validation + Graceful Degradation)
4. Add kanban ops at two points:

   **After shipping (step 2) — move completed card:**
   - Find the current step's card on the board (search by step name)
   - Check todo.md: if step checkbox was checked off → move card to Done, set `done: true`
   - If step has a blocker or was deferred → move to Punt, add reason to description
   - If unclear (step not checked, no blocker) → ask user: Done or Punt?

   **After planning next step (step 4) — ensure next card in Todo:**
   - Search for the next step's card on the board
   - If in Backlog → move to Todo
   - If not found → create in Todo
   - If already in Todo or later → skip

5. Reference `/run-kanban` and `/ship-end-kanban` in the Workflow section

### Key context
- Ship has `--no-plan` flag — if present, skip the "ensure next card" step
- Ship has `--no-deploy` flag — kanban ops happen regardless of deploy
- The `done` command: `done --id <card-id>` sets card's done flag to true
- Base ship already handles phase transitions (archive, roadmap update) — kanban ops layer on top
- Commands: `search`, `move-card`, `done`, `create-card`, `update-card`

### Acceptance criteria
- ship-kanban moves completed step card to Done (with `done: true`) or Punt
- Done vs Punt decision based on todo.md state (checked = Done, blocker = Punt, unclear = ask)
- When planning next step, ensures the next card exists in Todo
- Both Claude and Codex versions + openai.yaml
- `bash install.sh` installs the new skill
