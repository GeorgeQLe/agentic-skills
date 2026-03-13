---
name: run-phases
description: Execute only the next incomplete phase from a phased implementation plan, following the repo's tasks/todo.md workflow with tests-first discipline and end-of-phase verification.
---

# Run Phases

Use this skill when the user wants the next incomplete implementation phase executed, and only one phase should be completed in the current session.

## Inputs

- `tasks/todo.md` — the single source of truth for the full phased plan and active work.

## Workflow

1. Read `tasks/todo.md` and locate the next incomplete phase by milestone or checklist state.
2. Read `CLAUDE.md` if it exists for project conventions.
3. Execute exactly one phase:
   - Start with the tests-first step
   - Run the tests to confirm they fail where expected
   - Implement the phase steps in order
   - Run tests again to confirm green
   - Refactor only if tests remain green
4. Verify the phase milestone:
   - Check each acceptance criterion
   - Run the full relevant test suite to catch regressions
   - Update progress tracking files if the user asked for execution rather than dry analysis
5. Report:
   - Phase completed
   - Steps executed
   - Files modified
   - Test results
   - Next phase name

## Constraints

- Execute only one phase.
- Do not silently continue into the next phase.
- Do not skip the tests-first step.
- If a blocker prevents completion, document it clearly in the repo's task-tracking files when appropriate and stop.
