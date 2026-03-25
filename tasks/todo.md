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

## Next Step Plan: run-kanban

### What
Create `run-kanban` skill (Claude + Codex). Full copy of `/run` with kanban ops: move current step card to In Progress, cross-device conflict detection, stale session cleanup. Most complex -kanban skill.

### Files to create
- `claude/run-kanban/SKILL.md` — full copy of `claude/run/SKILL.md` + kanban ops + shared protocols
- `codex/run-kanban/SKILL.md` — condensed Codex version
- `codex/run-kanban/agents/openai.yaml` — agent manifest

### Approach
1. Copy the full content of the base run SKILL.md
2. Add `allowed-tools: Bash(node *)` to frontmatter, keep `argument-hint: [--phase]`
3. Add the shared Kanban Setup section (Board Resolution + Validation + Graceful Degradation)
4. Add kanban ops AFTER Kanban Setup, BEFORE the migration check (step 1):

   **Session card (move to In Progress):**
   - Read current step name from `tasks/todo.md`
   - Search board for card matching step name
   - If in Todo → move to In Progress via `move-card`
   - If already in In Progress → skip move, update description
   - If not found → create in In Progress directly
   - Add session info to description: `[hostname -s | lowercase] | Branch: <branch> | Started: <datetime>`

   **Cross-device conflict check:**
   - Scan all In Progress cards on the board
   - Cards with `[other-hostname]` in description → check if same branch or step → warn
   - Cards with `[this-hostname]` for a DIFFERENT step → stale session → warn, offer cleanup (move to Done/Punt)
   - Plain cards (no hostname) → report as "untracked work in progress"
   - This is advisory only — never block

5. After step completion (mark done in todo.md): update card with completion notes

### Key context
- Hostname format: `hostname -s | tr '[:upper:]' '[:lower:]'` — consistent across all -kanban skills
- Session info goes in card description, not card name (unlike the reverted approach which used `[hostname] step-name`)
- The base run skill has Single Step Mode and Full Phase Mode (`--phase`) — both need the kanban ops
- Commands: `search`, `move-card`, `create-card`, `update-card`, `board <id>`

### Acceptance criteria
- run-kanban moves current step card from Todo → In Progress at session start
- Cross-device conflict detection warns about other hostname In Progress cards
- Stale session cards from this hostname (different step) trigger cleanup prompt
- Session info (hostname, branch, time) added to card description
- After step completion, card updated with notes
- Both Claude and Codex versions + openai.yaml
- `bash install.sh` installs the new skill
