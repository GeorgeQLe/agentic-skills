---
name: run-step
description: Plan the next single incomplete step from tasks/todo.md, present it for approval, then execute and report what changed.
---

# Run Step

Use this skill when the user wants one bounded implementation step planned and executed, not an entire phase or feature.

## Inputs

- `tasks/todo.md` — the single source of truth for the full phased plan and active work.

## Workflow

1. Read `tasks/todo.md` — find the next incomplete step (unchecked `- [ ]` item).
2. Read `CLAUDE.md` if it exists for project conventions.
3. Research what's needed — read only the files relevant to the step.
4. Enter plan mode and present the execution plan:
   - What the step requires
   - Which files will be created or modified
   - The approach and any trade-offs
5. Wait for user approval. Do not write code until approved.
6. After approval, exit plan mode and execute exactly one step:
   - Tests-first: write failing tests, confirm expected failure
   - Implementation: implement the step, run tests for regression coverage
   - Green/verification: run the test suite, fix failures in scope
7. Mark the step done in the relevant tracking file.
8. Report:
   - Step completed
   - Files modified
   - Test results
   - Next step name only

## Constraints

- Always enter plan mode before executing.
- Do exactly one step and stop.
- Avoid reading unrelated parts of the codebase.
- Do not refactor unrelated code.
- Do not update `CLAUDE.md` unless the step explicitly requires it.
