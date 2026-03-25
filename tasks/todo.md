# Phase 2: Cross-Device Agent Awareness

**Goal:** Agents on different devices see each other's in-progress work and avoid conflicts.

## Steps

- [ ] **Session activity cards**
- [ ] **Conflict detection**
- [ ] **Device tagging on cards**

## Milestone
- [ ] Two agents on different machines can see each other's active work on the kanban board

---

## Next Step Plan: Session activity cards

### What
When an agent starts a session, create/update an "In Progress" card on the kanban board with device name, branch, and task summary. On `/ship-end`, move the card to Done with commit references.

### Files to modify
- **`claude/ship-end/SKILL.md`** — Add step to move the session card to Done with commit refs after shipping
- **`codex/ship-end/SKILL.md`** — Same for Codex
- **`claude/run/SKILL.md`** — Add step at session start to create/update an "In Progress" card
- **`codex/run/SKILL.md`** — Same for Codex
- **`claude/run-step/SKILL.md`** and **`codex/run-step/SKILL.md`** — Same
- **`claude/run-phases/SKILL.md`** and **`codex/run-phases/SKILL.md`** — Same

### Approach
1. At the start of `/run` variants, after the optional kanban sync step:
   - Get the device hostname via `hostname` command
   - Get the current branch via `git branch --show-current`
   - Read `tasks/todo.md` to get the current step/task description
   - Check the kanban board for an existing "In Progress" card from this device
   - If one exists, update it with current branch and task. If not, create one in the "In Progress" list
   - Card name format: `[hostname] current-step-name`
   - Card description: branch name, task summary, start time
2. At the end of `/ship-end`:
   - Find the session's "In Progress" card on the board (match by hostname in card name)
   - Move it to the "Done" list
   - Update description with commit references from this session

### Key context
- poketo-kanban scripts at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- Available commands: `boards`, `board <id>`, `create-card`, `update-card`, `move-card`, `done`, `search`
- Board auto-detection already handles finding the right board via `tasks/.kanban-board`
- Device hostname is available via `hostname` shell command
- Cards support `--name`, `--description`, `--done`, `--due`, `--starred` fields

### Acceptance criteria
- Running `/run` on a project with a kanban board creates an "In Progress" card with device name and task info
- Running `/ship-end` moves that card to Done with commit references
- If a session card already exists from this device, it gets updated (not duplicated)
- Both Claude and Codex skills are updated
