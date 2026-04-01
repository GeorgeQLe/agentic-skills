---
name: run-kanban
description: Plan and execute the next step from the phased plan, moving the kanban card to In Progress with cross-device conflict detection
---

# Run (Kanban)

Identify the next incomplete unit of work from the phased plan, build an execution plan, and implement it. Moves the current step's kanban card to In Progress and warns about cross-device conflicts. By default, executes only the next single incomplete step.

## Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask user. If no boards, offer to create one with `create-board --name "$(basename $(pwd))" --template standard`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.
4. **Board Overview:** Fetch board state and display a brief summary — overdue cards, starred/high-priority items, blocked cards, In Progress/Backlog/Todo counts. Informational only, no actions taken.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

## Session Card

1. Get hostname (`hostname -s | lowercase`) and branch (`git branch --show-current`).
2. Read `tasks/todo.md` for the current step name.
3. Search board for card matching step name.
4. If in Todo → move to In Progress. If already in In Progress → skip move. If not found → create in In Progress.
5. Update card description with: `[hostname] | Branch: branch | Started: datetime`

## Conflict Check

Scan all In Progress cards (advisory only, never block):
- `[other-hostname]` with same branch/step → warn about overlap
- `[this-hostname]` with different step → stale session, offer to move to Done/Punt
- No hostname → report as "untracked"

## Workflow

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase. Commit with `chore: migrate to roadmap.md + todo.md split`.
2. Read `tasks/todo.md` — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. Read `CLAUDE.md` for project conventions.
4. Find the next incomplete item:
   - Look for the next phase with an unchecked milestone.
   - Find the next unchecked `- [ ]` step within that phase.
5. **Check `tasks/manual-todo.md`** (if it exists) for unchecked items with `_(blocks: Step N.X)_` matching the current step. If found, warn the user — do NOT skip the step, let the user decide.
6. Research what is needed — read only the files relevant to the step.
7. Present the execution plan to the user:
   - What the step requires
   - Which files will be created or modified
   - The approach and any trade-offs
8. Wait for user approval before writing any code.
9. After approval, execute the plan:
   - If it is a tests-first step: write the failing tests, run them to confirm they fail.
   - If it is an implementation step: implement it, run existing tests for regressions.
   - If it is a verification step: run all tests, fix any failures.
10. Mark the step as done in `tasks/todo.md`.

## Post-Execution

- Count `- [x]` vs `- [ ]` in `tasks/todo.md` to calculate phase progress. Update the kanban card description with `Progress: X/Y (Z%) | Completed: datetime`. Do NOT move to Done — that's ship-kanban's job.
- Report: step completed, files modified, test results (expected vs unexpected failures), pending manual task count (from `tasks/manual-todo.md` if it exists), kanban status, next step name.

## Constraints

- One step at a time. Then stop and let the user decide what is next.
- Always present the plan and get approval before executing.
- Keep context footprint minimal — only read files relevant to the current step.
- If a blocker prevents completion, document it in `tasks/todo.md` and stop.
- Do not skip TDD steps.
- Do NOT execute items from `tasks/manual-todo.md` — those require human action.
- Kanban operations are additive — if any fail, warn and continue. Core workflow must succeed.
- Conflict warnings are advisory only — never block.
