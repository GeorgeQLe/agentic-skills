---
name: run-step
description: Plan the next single incomplete step from tasks/todo.md, present it for approval, then execute and report what changed.
---

# Run Step

Use this skill when the user wants one bounded implementation step planned and executed, not an entire phase or feature.

## Inputs

- `tasks/todo.md` — the active working document containing the current phase's steps.
- `tasks/roadmap.md` — the full phased plan (reference only if cross-phase context is needed).

## Workflow

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. Read `tasks/todo.md` — find the next incomplete step (unchecked `- [ ]` item).
3. Read `CLAUDE.md` if it exists for project conventions.
4. Research what's needed — read only the files relevant to the step.
5. Enter plan mode and present the execution plan:
   - What the step requires
   - Which files will be created or modified
   - The approach and any trade-offs
6. Wait for user approval. Do not write code until approved.
7. After approval, exit plan mode and execute exactly one step:
   - Tests-first: write failing tests, confirm expected failure
   - Implementation: implement the step, run tests for regression coverage
   - Green/verification: run the test suite, fix failures in scope
8. Mark the step done in the relevant tracking file.
9. Report:
   - Step completed
   - Files modified
   - Test results — explicitly state whether any failures are expected (red phase: tests before implementation) or unexpected (regressions/bugs)
   - Next step name only

## Constraints

- Always enter plan mode before executing.
- Do exactly one step and stop.
- Avoid reading unrelated parts of the codebase.
- Do not refactor unrelated code.
- Do not update `CLAUDE.md` unless the step explicitly requires it.
