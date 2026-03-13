---
name: run
description: Identify the next incomplete step from the phased plan and execute it.
---

# Run

Identify the next incomplete unit of work from the phased plan, build an execution plan, and implement it. By default, executes only the next single incomplete step.

## Workflow

1. Read `tasks/todo.md` — this is the single source of truth containing the full phased plan.
2. Read `CLAUDE.md` for project conventions.
3. Find the next incomplete item:
   - Look for the next phase with an unchecked milestone.
   - Find the next unchecked `- [ ]` step within that phase.
4. Research what is needed — read only the files relevant to the step.
5. Present the execution plan to the user:
   - What the step requires
   - Which files will be created or modified
   - The approach and any trade-offs
6. Wait for user approval before writing any code.
7. After approval, execute the plan:
   - If it is a tests-first step: write the failing tests, run them to confirm they fail.
   - If it is an implementation step: implement it, run existing tests for regressions.
   - If it is a verification step: run all tests, fix any failures.
8. Mark the step as done in `tasks/todo.md`.

## Output

- Step completed
- Files modified
- Test results (if tests were run)
- What is next (just its name)

## Constraints

- One step at a time. Then stop and let the user decide what is next.
- Always present the plan and get approval before executing.
- Keep context footprint minimal — only read files relevant to the current step.
- If a blocker prevents completion, document it in `tasks/todo.md` and stop.
- Do not skip TDD steps.
