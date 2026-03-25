---
name: run-phases
description: Plan the next incomplete phase, enter plan mode for approval, then execute
argument-hint: [--sync-kanban]
---

# Single-Phase Executor

Plan **only the next incomplete phase** from a phased implementation plan, get user approval, then execute. One phase per context window.

## Execution Protocol

**Kanban sync (optional):** If `$ARGUMENTS` contains `--sync-kanban`, run `/sync-roadmap-kanban` first. If it reports discrepancies, show them but continue with the main process.

**Session card:** If `tasks/.kanban-board` exists, create or update a session activity card:
1. Get the device hostname via `hostname` and the branch via `git branch --show-current`
2. Read `tasks/todo.md` to get the current step name
3. Read the board ID from `tasks/.kanban-board` and search the board for a card whose name starts with `[hostname]`
4. If found, update it with the current branch and step. If not, create a new card in the "In Progress" list
5. Card name: `[hostname] step-name` — Card description: `Branch: branch-name\nStarted: YYYY-MM-DD HH:MM`

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. **Read `tasks/todo.md`** — this contains the current phase's steps. Also read `tasks/roadmap.md` to understand overall progress and find the next incomplete phase by checking milestone checkboxes.
3. **Read CLAUDE.md** for project conventions.
4. **Research what's needed** — read only the files relevant to the phase to understand existing code, patterns, and dependencies.
5. **Enter plan mode** using the EnterPlanMode tool.
6. **Present the execution plan** to the user:
   - What the phase requires
   - Which files will be created or modified
   - The approach for each step (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
7. **Wait for user approval.** Do NOT write any code until the user approves.
8. **After approval, exit plan mode** and execute that single phase, step by step:
   - Start with the "Tests First" steps — write the failing tests.
   - Run the tests to confirm they fail (red).
   - Implement each step in order.
   - Run tests after implementation to confirm they pass (green).
   - Refactor if needed while keeping tests green.
9. **Verify the milestone**:
   - Check each acceptance criterion.
   - Run the full test suite to confirm no regressions.
   - Check off completed criteria in `tasks/todo.md`.
10. **Report** what was done:
   - Phase completed
   - Steps executed
   - Files modified
   - Test results
   - What the next phase is

## Workflow

```
/run-phases           → plans the next phase, enters plan mode, executes after approval
/ship-then-plan       → commits, pushes, writes next phase into tasks/todo.md
                      → enters plan mode → select "clear context and implement"
                      → fresh context reads tasks/todo.md and implements
```

## Constraints
- **Execute only ONE phase.** Do not continue to the next phase.
- **Always enter plan mode before executing.** The user must approve the approach first.
- Each phase must be self-contained — read the plan fresh, don't rely on prior context.
- If a phase's tests can't pass due to a blocking issue, document the blocker in `tasks/todo.md` and stop.
- Do not skip the TDD steps.
