---
name: run-step
description: Execute only the next single incomplete step from the active plan or tasks/todo.md, then stop and report what changed, what was verified, and what the next step is.
---

# Run Step

Use this skill when the user wants one bounded implementation step executed, not an entire phase or feature.

## Inputs

- `tasks/todo.md` — the single source of truth for the full phased plan and active work.

## Workflow

1. Read `tasks/todo.md` — find the next incomplete step (unchecked `- [ ]` item).
2. Execute exactly one incomplete step.
4. If the step is tests-first:
   - Write the failing tests
   - Run them and confirm the expected failure
5. If the step is implementation:
   - Implement the step
   - Run relevant existing tests for regression coverage
6. If the step is a green/verification step:
   - Run the required test suite
   - Fix failures that are within the intended scope of that step
7. Mark the step done in the relevant tracking file when the user asked for actual execution.
8. Report:
   - Step completed
   - Files modified
   - Test results
   - Next step name only

## Constraints

- Do exactly one step and stop.
- Avoid reading unrelated parts of the codebase.
- Do not refactor unrelated code.
- Do not update `AGENTS.md` unless the step explicitly requires it.
