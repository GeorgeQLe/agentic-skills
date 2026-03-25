# Phase 1: Kanban Skill Suite

**Goal:** Create parallel `-kanban` workflow skills with board operations. Board: Backlog → Todo → In Progress → Done → Punt.

## Steps

- [x] **Step 0: Fix kanban.mjs `--lists` flag** — support `name:type` annotations so Done/Punt get correct listType
- [x] **Step 1: `brainstorm-kanban`** — full copy of brainstorm + create one Backlog card per idea (idempotent: skip existing)
- [x] **Step 2: `plan-interview-kanban`** — full copy of plan-interview + update matching Backlog card with spec (search all lists, fuzzy match, ask if ambiguous)
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

## Next Step Plan: plan-interview-kanban

### What
Create `plan-interview-kanban` skill (Claude + Codex). Full copy of `/plan-interview` with kanban ops: after writing the spec, find the matching Backlog card and update it with spec details.

### Files to create
- `claude/plan-interview-kanban/SKILL.md` — full copy of `claude/plan-interview/SKILL.md` + kanban ops + shared protocols
- `codex/plan-interview-kanban/SKILL.md` — condensed Codex version
- `codex/plan-interview-kanban/agents/openai.yaml` — agent manifest

### Approach
1. Copy the full content of the base plan-interview SKILL.md
2. Add `allowed-tools: Bash(node *)` to frontmatter
3. Add the shared Kanban Setup section (Board Resolution + Validation + Graceful Degradation) — same pattern as brainstorm-kanban
4. Add a **Kanban Sync** section after the main interview process:
   - Extract 2-3 keywords from the topic argument
   - Search the board for matching cards: `search --query "keyword1 keyword2"`
   - Search ALL lists, not just Backlog (card may have been moved by roadmap-kanban)
   - If one match → update card description with spec summary and `specs/[topic].md` path
   - If multiple matches → list cards with IDs, ask user to pick
   - If zero matches → create new card in Backlog with spec details
   - Never move cards backward from Done/Punt
5. Update the spec output path reference from `/plan-interview` to `/plan-interview-kanban`

### Key context from brainstorm-kanban (established pattern)
- Kanban Setup section goes before the main process
- Kanban Sync section goes after the main process
- Board Resolution, Validation, Graceful Degradation blocks are identical across all -kanban skills
- Script path: `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- Commands: `search --query`, `update-card --id <id> --description "new desc"`, `create-card`
- Claude version has full code blocks; Codex version is condensed prose

### Acceptance criteria
- plan-interview-kanban SKILL.md contains full plan-interview process + kanban card update
- Fuzzy matching: searches by keywords, asks user when ambiguous
- Searches all lists (not just Backlog) — updates card in place
- Never moves cards backward from Done/Punt
- Creates new Backlog card if no match found
- Both Claude and Codex versions + openai.yaml
- `bash install.sh` installs the new skill
