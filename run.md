---
description: Plan the next incomplete step (or full phase with --phase flag) from the plan, then enter plan mode for user approval before executing
argument-hint: [--phase]
---

# Plan Executor

Identify the next incomplete unit of work from the phased plan, build an execution plan, and enter plan mode for user approval before implementing. By default, plans **only the next single incomplete step**. If `$ARGUMENTS` contains `--phase`, plans the **entire next phase**.

## Protocol

1. **Read `tasks/todo.md`** — this is the single source of truth. It contains the full phased plan with all steps.
2. **Read CLAUDE.md** for project conventions.
3. **Find the next incomplete item:**
   - Look for the next phase with an unchecked milestone.
   - If `--phase` mode: scope the entire phase.
   - Otherwise (default): find only the next unchecked `- [ ]` step within that phase.
4. **Research what's needed** — read only the files relevant to the step/phase to understand existing code, patterns, and dependencies.
5. **Enter plan mode** using the EnterPlanMode tool.
6. **Present the execution plan** to the user:
   - What the step/phase requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
7. **Wait for user approval.** Do NOT write any code until the user approves.
8. **After approval, exit plan mode** and execute the approved plan.

### Single Step Mode (default)

- If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
- If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
- If it's a "Green" step: run all tests, fix any failures. Stop.
- **Mark the step as done** in `tasks/todo.md` (check it off).

### Full Phase Mode (`--phase`)

- Execute the entire phase, step by step:
  - Start with the "Tests First" steps — write the failing tests.
  - Run the tests to confirm they fail (red).
  - Implement each step in order.
  - Run tests after implementation to confirm they pass (green).
  - Refactor if needed while keeping tests green.
- **Verify the milestone**:
  - Check each acceptance criterion.
  - Run the full test suite to confirm no regressions.
  - Check off completed criteria in `tasks/todo.md`.

## After Execution (both modes)

**Report concisely:**
- Phase/step completed
- Files modified
- Test results (if tests were run)
- What's next (just its name — /ship will handle planning)

## What NOT to do

- Do NOT write code before entering plan mode and getting user approval.
- Do NOT execute more than one step (or more than one phase in `--phase` mode).
- Do NOT read unnecessary files — only what's needed for the current work.
- Do NOT plan ahead or analyze future phases/steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.

## Workflow

```
/run                  → plans one step, enters plan mode, executes after approval
/run --phase          → plans the next full phase, enters plan mode, executes after approval
/ship                 → commits, pushes, plans next, enters plan mode
                      → select "clear context and implement"
                      → fresh context reads tasks/todo.md and implements
```

## Constraints
- **One step (or one phase). That's it.** Then stop and let the user decide what's next.
- **Always enter plan mode before executing.** The user must approve the approach first.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this work.
- If the work can't be completed due to a blocker, document the blocker in `tasks/todo.md` and stop.
- Do not skip the TDD steps.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.
