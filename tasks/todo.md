# Phase 1: Kanban Skill Suite

**Goal:** Create parallel `-kanban` workflow skills with board operations. Board: Backlog → Todo → In Progress → Done → Punt.

## Steps

- [x] **Step 0: Fix kanban.mjs `--lists` flag** — support `name:type` annotations so Done/Punt get correct listType
- [x] **Step 1: `brainstorm-kanban`** — full copy of brainstorm + create one Backlog card per idea (idempotent: skip existing)
- [ ] **Step 2: `plan-interview-kanban`** — full copy of plan-interview + update matching Backlog card with spec (search all lists, fuzzy match, ask if ambiguous)
- [ ] **Step 3: `roadmap-kanban`** — full copy of roadmap + move specced Backlog cards → Todo, create step cards for current phase
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

## Next Step Plan: brainstorm-kanban

### What
Create `brainstorm-kanban` skill (Claude + Codex). Full copy of `/brainstorm` with kanban board operations: after generating ideas, create one card per idea in the Backlog list.

### Files to create
- `claude/brainstorm-kanban/SKILL.md` — full copy of `claude/brainstorm/SKILL.md` + kanban ops + shared protocols
- `codex/brainstorm-kanban/SKILL.md` — full copy of `codex/brainstorm/SKILL.md` + kanban ops (condensed)
- `codex/brainstorm-kanban/agents/openai.yaml` — agent manifest

### Approach
1. Copy the full content of the base brainstorm SKILL.md
2. Add `allowed-tools: Bash(node *)` to frontmatter
3. Add the shared Board Resolution + Board Validation protocols as a new section before the main process
4. Add a new step after the Output section: **Kanban Sync**
   - For each idea in the output (each `- **Title** — description` bullet):
     - Search the board for a card with the same name (exact match on title text)
     - If found → skip (log "already exists")
     - If not found → `create-card` in Backlog list
     - Card name: idea title (text between `**...**`)
     - Card description: idea description + effort category (e.g., "Quick win (hours)")
5. Add Graceful Degradation to the constraints section
6. Codex version: condense the kanban ops into the Codex style (shorter, same logic)

### Key context
- Brainstorm output format: `- **Title** — description. _Start with:_ /plan-interview <topic>` grouped under effort headings
- Script path: `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- Commands needed: `boards`, `board <id>`, `search --query "title"`, `create-card --board <id> --list <list-id> --name "title" --description "details"`
- Board auto-detection reads `tasks/.kanban-board` for stored board ID

### Acceptance criteria
- `brainstorm-kanban` SKILL.md contains full brainstorm process + kanban card creation
- Board resolution and validation protocols are included
- Idempotent: running twice doesn't create duplicate cards
- Graceful degradation: works without kanban if scripts missing
- Both Claude and Codex versions created with openai.yaml
- `bash install.sh` installs the new skill
