---
name: run
description: Plan the next incomplete step (or full phase with --phase flag) from the plan, then enter plan mode for user approval before executing
---

# Run

Identify the next incomplete unit of work from the phased plan, build an execution plan, and implement it. By default, executes only the next single incomplete step.

## Workflow

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. Read `tasks/todo.md` — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. Read `CLAUDE.md` for project conventions.
4. Find the next incomplete item:
   - Look for the next phase with an unchecked milestone.
   - Find the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` section): invoke `/plan-phases` for this phase to generate TDD steps and file-level detail before proceeding.
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

## Output

- Step completed
- Files modified
- Test results (if tests were run) — explicitly state whether any failures are expected (red phase: tests before implementation) or unexpected (regressions/bugs)
- Manual tasks — pending count from `tasks/manual-todo.md` (if it exists)
- What is next (just its name)

## Constraints

- One step at a time. Then stop and let the user decide what is next.
- Always present the plan and get approval before executing.
- Keep context footprint minimal — only read files relevant to the current step.
- If a blocker prevents completion, document it in `tasks/todo.md` and stop.
- Do not skip TDD steps.
- Do NOT execute items from `tasks/manual-todo.md` — those require human action.
