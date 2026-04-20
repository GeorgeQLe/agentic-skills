# Phase 3: Board Templates

**Goal:** One-command board creation with the standard 5-list layout.

## Steps

- [x] **Add `--template standard` flag to kanban.mjs** — create board with Backlog/Todo/In Progress/Done:done/Punt:punt in one command
- [x] **Update -kanban skills' Board Resolution protocol** — use `--template standard` when creating new boards (12 SKILL.md files)

### Plan: Update Board Resolution protocol

**What:** In all 12 `-kanban` SKILL.md files, replace the verbose `--lists "Backlog,Todo,In Progress,Done:done,Punt:punt"` with `--template standard` in the Board Resolution section (step 5, board creation fallback).

**Find-and-replace** in each file:
```
OLD: create-board --name "$(basename $(pwd))" --lists "Backlog,Todo,In Progress,Done:done,Punt:punt"
NEW: create-board --name "$(basename $(pwd))" --template standard
```

**Files (12):**
- `claude/brainstorm-kanban/SKILL.md`
- `claude/spec-interview-kanban/SKILL.md` (originally `plan-interview-kanban`)
- `claude/roadmap-kanban/SKILL.md`
- `claude/run-kanban/SKILL.md`
- `claude/ship-kanban/SKILL.md`
- `claude/ship-end-kanban/SKILL.md`
- `codex/brainstorm-kanban/SKILL.md`
- `codex/spec-interview-kanban/SKILL.md` (originally `plan-interview-kanban`)
- `codex/roadmap-kanban/SKILL.md`
- `codex/run-kanban/SKILL.md`
- `codex/ship-kanban/SKILL.md`
- `codex/ship-end-kanban/SKILL.md`

**Also update** `tasks/roadmap.md` Phase 3 step 2 description if it references the old `--lists` syntax.

**Acceptance criteria:**
- `grep --lists` across all SKILL.md files returns zero matches for the old 5-list string
- All 12 files use `--template standard` in their Board Resolution section
- Milestone can be checked off: `create-board --template standard` creates a board with all 5 required lists

## Milestone
- [x] `create-board --template standard` creates a board with all 5 required lists in correct types
