---
name: run-phases
description: Plan the next incomplete phase, enter plan mode for approval, then execute
---

# Single-Phase Executor

Plan **only the next incomplete phase** from a phased implementation plan, get user approval, then execute. One phase per context window.

## Execution Protocol

1. **Read `tasks/todo.md`** — this contains the current phase's steps. Also read `tasks/roadmap.md` to understand overall progress and find the next incomplete phase by checking milestone checkboxes.
2. **Read CLAUDE.md** for project conventions.
3. **Research what's needed** — read only the files relevant to the phase to understand existing code, patterns, and dependencies.
4. **Enter plan mode** using the EnterPlanMode tool.
5. **Present the execution plan** to the user:
   - What the phase requires
   - Which files will be created or modified
   - The approach for each step (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
6. **Wait for user approval.** Do NOT write any code until the user approves.
7. **After approval, exit plan mode** and execute that single phase, step by step:
   - Start with the "Tests First" steps — write the failing tests.
   - Run the tests to confirm they fail (red).
   - Implement each step in order.
   - Run tests after implementation to confirm they pass (green).
   - Refactor if needed while keeping tests green.
8. **Verify the milestone**:
   - Check each acceptance criterion.
   - Run the full test suite to confirm no regressions.
   - Check off completed criteria in `tasks/todo.md`.
9. **Report** what was done:
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
