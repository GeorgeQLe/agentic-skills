---
name: run-phases
description: Plan the next incomplete phase from tasks/todo.md, present it for approval, then execute with tests-first discipline and end-of-phase verification.
---

# Run Phases

Use this skill when the user wants the next incomplete implementation phase planned and executed, with only one phase completed per session.

## Inputs

- `tasks/todo.md` — the active working document containing the current phase's steps.
- `tasks/roadmap.md` — the full phased plan. Read this to understand overall progress and locate the next phase.

## Workflow

1. Read `tasks/todo.md` and locate the next incomplete phase by milestone or checklist state.
2. Read `CLAUDE.md` if it exists for project conventions.
3. Research what's needed — read only the files relevant to the phase.
4. Enter plan mode and present the execution plan:
   - What the phase requires
   - Which files will be created or modified
   - The approach for each step (tests, implementation, verification)
   - Any decisions or trade-offs the user should weigh in on
5. Wait for user approval. Do not write code until approved.
6. After approval, exit plan mode and execute exactly one phase:
   - Start with the tests-first step
   - Run the tests to confirm they fail where expected
   - Implement the phase steps in order
   - Run tests again to confirm green
   - Refactor only if tests remain green
7. Verify the phase milestone:
   - Check each acceptance criterion
   - Run the full relevant test suite to catch regressions
   - Update progress tracking files
8. Report:
   - Phase completed
   - Steps executed
   - Files modified
   - Test results
   - Next phase name

## Constraints

- Always enter plan mode before executing.
- Execute only one phase.
- Do not silently continue into the next phase.
- Do not skip the tests-first step.
- If a blocker prevents completion, document it clearly in the repo's task-tracking files when appropriate and stop.
