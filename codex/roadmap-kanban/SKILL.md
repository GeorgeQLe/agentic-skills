---
name: roadmap-kanban
description: Build or update the project roadmap, then sync phases and steps to kanban board
---

# Roadmap Builder (Kanban)

Build or update `tasks/roadmap.md` by synthesizing all project documentation, interviewing the user on priorities and sequencing, and producing a phased roadmap. After writing the roadmap, sync phases and steps to the kanban board.

## Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask user. If no boards, offer to create one with `create-board --name "$(basename $(pwd))" --lists "Backlog,Todo,In Progress,Done:done,Punt:punt"`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

## Modes

- **New Project**: `tasks/roadmap.md` does not exist. Read specs and interview to create the roadmap from scratch.
- **Existing Project** (`--existing`, or when `tasks/roadmap.md` has content): Review codebase, history, and current roadmap. Update with new work, completed phases, or changed priorities.

## Workflow

1. **Gather context**: Read `specs/`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, `tasks/ideas.md`, `specs/icp.md`, `specs/mvp-gap.md`, `specs/enterprise-icp.md`, `specs/scale-audit.md`, CLAUDE.md, README. For existing projects, also review source files and git log.
2. **Synthesise**: Present a structured summary — features identified, dependencies, conflicts, and (for existing projects) what's built vs. remaining.
3. **Interview on strategy** (1–3 questions per turn):
   - Priority — What's MVP vs. later?
   - Grouping — Combine or split specs?
   - Sequencing — Dependencies, risk reduction, user value order
   - Scope — Defer, drop, or stretch?
   - Phase sizing — Many small vs. fewer large?
   - Market fit (when ICP/gap specs exist) — Which phases address deal-blockers? Prioritise by market impact.
4. **Write roadmap**: Write `tasks/roadmap.md` with agreed phase structure (phases, goals, scope, acceptance criteria — NOT implementation steps).
5. **Populate Phase 1**: Invoke `/plan-phases` for Phase 1 detail and `tasks/todo.md`.
6. **Update history** (existing projects): Append entry to `tasks/history.md`.

## Kanban Sync

After writing the roadmap and Phase 1 detail:

1. **Current phase steps → Todo**: For each `- [ ]` step in `tasks/todo.md`:
   - Search board for card with that name
   - If in Backlog → move to Todo
   - If in Todo or later → skip
   - If not found → create in Todo with phase context in description

2. **Future phases → Backlog**: For each future phase in the roadmap:
   - Search for card with phase title
   - If not found → create summary card in Backlog with phase goal
   - If found → skip

3. Report: cards created, moved, and skipped.

## Deliverables

- `tasks/roadmap.md` — Phased plan with goals, scope, and acceptance criteria per phase
- `tasks/todo.md` — Current phase working document (via `/plan-phases`)

## Constraints

- Always interview — do not produce a roadmap without user input.
- Do not modify files in `specs/`.
- Phase headers must use `## Phase N: [Title]` format for `/run-kanban` compatibility.
- Do not include TDD steps or file-level detail — that's `/plan-phases`' job.
- `tasks/roadmap.md` is the source of truth. Do not put roadmap content in CLAUDE.md.
- Kanban operations are additive — if any kanban command fails, warn and continue. Roadmap output must always succeed.
- Only move cards FROM Backlog → Todo. Never move backward.
