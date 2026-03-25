# Phase 1: Kanban Skill Suite

**Goal:** Create parallel `-kanban` workflow skills with board operations. Board: Backlog → Todo → In Progress → Done → Punt.

## Steps

- [x] **Step 0: Fix kanban.mjs `--lists` flag** — support `name:type` annotations so Done/Punt get correct listType
- [x] **Step 1: `brainstorm-kanban`** — full copy of brainstorm + create one Backlog card per idea (idempotent: skip existing)
- [x] **Step 2: `plan-interview-kanban`** — full copy of plan-interview + update matching Backlog card with spec (search all lists, fuzzy match, ask if ambiguous)
- [x] **Step 3: `roadmap-kanban`** — full copy of roadmap + move specced Backlog cards → Todo, create step cards for current phase
- [x] **Step 4: `run-kanban`** — full copy of run + move Todo → In Progress + cross-device conflict warnings + stale session cleanup
- [x] **Step 5: `ship-kanban`** — full copy of ship + move In Progress → Done/Punt based on todo.md state
- [x] **Step 6: `ship-end-kanban`** — full copy of ship-end + move In Progress → Done with commit refs

## Milestone
- [x] Full kanban lifecycle works: brainstorm → plan-interview → roadmap → run → ship/ship-end across board lists

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

## Next Step Plan: ship-end-kanban

### What
Create `ship-end-kanban` skill (Claude + Codex). Full copy of `/ship-end` with kanban ops: after wrapping up the session, move the In Progress card to Done with commit refs. Last of 6 -kanban skills.

### Files to create
- `claude/ship-end-kanban/SKILL.md` — full copy of `claude/ship-end/SKILL.md` + kanban ops + shared protocols
- `codex/ship-end-kanban/SKILL.md` — condensed Codex version
- `codex/ship-end-kanban/agents/openai.yaml` — agent manifest

### Approach
1. Copy the full content of the base ship-end SKILL.md
2. Add `allowed-tools: Bash(node *)` to frontmatter
3. Add the shared Kanban Setup section (Board Resolution + Validation + Graceful Degradation)
4. Add kanban ops after committing/pushing (after step 5 in base):

   **Move session card to Done:**
   - Get hostname: `hostname -s | tr '[:upper:]' '[:lower:]'`
   - Search In Progress cards for one with `[this-hostname]` in description, or matching the current step name
   - Move to Done + `done --id <card-id>`
   - Update description with commit SHAs from this session
   - If no matching card found, skip silently (card may not exist if run-kanban wasn't used)

### Key context
- ship-end is simpler than ship — no planning, no phase transitions, just wrap up
- Always moves to Done (never Punt) — ship-end is a clean session wrap-up
- Base ship-end has 6 steps: check status, update docs, deploy, commit/push, output summary
- The kanban step goes after commit/push (step 5) and before the summary (step 6)
- Commands: `board <id>`, `move-card`, `done`, `update-card`

### Acceptance criteria
- ship-end-kanban moves the session's In Progress card to Done with commit refs
- Uses hostname to find the session card (matches run-kanban's hostname format)
- Graceful: if no matching card found, skip silently
- Both Claude and Codex versions + openai.yaml
- `bash install.sh` installs the new skill
- After this step: all 6 -kanban skills complete, Phase 1 milestone ready for verification
