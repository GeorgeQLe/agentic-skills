---
name: run-step
description: Plan the next single incomplete step, enter plan mode for approval, then execute
argument-hint: [--sync-kanban]
---

# Single-Step Executor

Plan **only the next single incomplete step** from the current phase, get user approval, then execute. Designed for aggressive context management — minimal context usage per session.

## Execution Protocol

**Kanban sync (optional):** If `$ARGUMENTS` contains `--sync-kanban`, run `/sync-roadmap-kanban` first. If it reports discrepancies, show them but continue with the main process.

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. **Read `tasks/todo.md`** — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. **Read CLAUDE.md** for project conventions.
4. **Find the next incomplete step** (unchecked `- [ ]` item under the current phase).
5. **Research what's needed** — read only the files relevant to the step to understand existing code, patterns, and dependencies.
6. **Enter plan mode** using the EnterPlanMode tool.
7. **Present the execution plan** to the user:
   - What the step requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
8. **Wait for user approval.** Do NOT write any code until the user approves.
9. **After approval, exit plan mode** and execute:
   - If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
   - If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
   - If it's a "Green" step: run all tests, fix any failures. Stop.
10. **Mark the step as done** in `tasks/todo.md` (check it off).
11. **Report concisely:**
    - Step completed
    - Files modified
    - Test results (if tests were run) — **explicitly state whether any failures are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
    - What the next step is (just its name, don't plan it — /ship-then-plan will do that)

## What NOT to do

- Do NOT write code before entering plan mode and getting user approval.
- Do NOT execute more than one step.
- Do NOT read unnecessary files — only what's needed for this one step.
- Do NOT plan ahead or analyze future steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.

## Workflow

```
/run-step             → plans one step, enters plan mode, executes after approval
/ship-then-plan       → commits, pushes, writes next step plan into tasks/todo.md
                      → enters plan mode → select "clear context and implement"
                      → fresh context reads tasks/todo.md and implements
```

## Constraints
- **ONE step. That's it.** Then stop and let the user decide what's next.
- **Always enter plan mode before executing.** The user must approve the approach first.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this step.
- If the step can't be completed due to a blocker, document the blocker in `tasks/todo.md` and stop.
