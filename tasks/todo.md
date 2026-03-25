# Phase 1: Kanban-Roadmap Sync

**Goal:** Keep kanban boards, roadmap docs, and codebase state in agreement automatically.

## Steps

- [x] **Create `/sync-roadmap-kanban` skill (Claude + Codex)**
- [x] **Board-project auto-detection**
- [ ] **Add sync-roadmap-kanban trigger to workflow skills**

## Milestone
- [ ] Agent runs `/sync-roadmap-kanban` → kanban and roadmap reflect the same state, grounded in what the code actually shows

---

## Next Step Plan: Board-project auto-detection

### What
Add automatic board-to-project matching so `/sync-roadmap-kanban` doesn't need to ask the user which board to use every time. Store the mapping in `tasks/.kanban-board`.

### Requirements (from roadmap)
- Match board to project by board name vs repo/directory name
- If no match, prompt user to select or create a board
- Store board-project mapping in project's `tasks/` directory

### Files to modify
- **`claude/sync-roadmap-kanban/SKILL.md`** — Update Step 2 to use auto-detection logic before falling back to user prompt. Currently it checks `tasks/.kanban-board` but doesn't create it.
- **`codex/sync-roadmap-kanban/SKILL.md`** — Same update for Codex version.

### Approach
1. In Step 2 of both SKILL.md files, add board auto-detection logic **before** the user prompt fallback:
   - Run `boards` to list all boards
   - Check `tasks/.kanban-board` — if it exists and contains a valid board ID, use it
   - If no mapping file: compare board names against the repo directory name (`basename $(pwd)`) and parent directory name
   - If exactly one board matches (case-insensitive, substring), use it and save the ID to `tasks/.kanban-board`
   - If zero or multiple matches, list boards and ask the user to pick. Save their choice to `tasks/.kanban-board`
2. Add `tasks/.kanban-board` to the `.gitignore` pattern note (it should be committed so all devices share the mapping)

### Key context from this session
- The poketo-kanban scripts are at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- The `boards` command returns JSON with board objects containing `id` and `name` fields
- The SKILL.md files are prompt-only (no scripts) — the auto-detection logic is described as instructions for the agent to follow, not code to execute

### Acceptance criteria
- Running `/sync-roadmap-kanban` in a project with a matching board name auto-selects the board without asking
- The board ID is persisted in `tasks/.kanban-board` for future runs
- If no board matches, the user is prompted to select one
- Both Claude and Codex SKILL.md files are updated
