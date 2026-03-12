---
description: Execute the next incomplete phase from a phased plan
---

# Single-Phase Executor

Execute **only the next incomplete phase** from a phased implementation plan, then stop. One phase per context window.

## Execution Protocol

1. **Read `tasks/todo.md`** — this is the single source of truth. It contains the full phased plan. Find the next incomplete phase by checking milestone checkboxes.
2. **Read CLAUDE.md** for project conventions.
4. **Execute that single phase**, step by step:
   - Start with the "Tests First" steps — write the failing tests.
   - Run the tests to confirm they fail (red).
   - Implement each step in order.
   - Run tests after implementation to confirm they pass (green).
   - Refactor if needed while keeping tests green.
5. **Verify the milestone**:
   - Check each acceptance criterion.
   - Run the full test suite to confirm no regressions.
   - Check off completed criteria in `tasks/todo.md`.
7. **Report** what was done:
   - Phase completed
   - Steps executed
   - Files modified
   - Test results
   - What the next phase is

## Workflow

```
/run-phases           → executes phase N
/ship-then-plan       → commits, pushes, writes next phase into tasks/todo.md
                      → enters plan mode → select "clear context and implement"
                      → fresh context reads tasks/todo.md and implements
```

## Constraints
- **Execute only ONE phase.** Do not continue to the next phase.
- Each phase must be self-contained — read the plan fresh, don't rely on prior context.
- If a phase's tests can't pass due to a blocking issue, document the blocker in `tasks/todo.md` and stop.
- Do not skip the TDD steps.
