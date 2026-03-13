---
description: Execute the next incomplete phase (or single step with --step flag) from the plan
argument-hint: [--step]
---

# Plan Executor

Execute the next incomplete unit of work from the phased plan. By default, executes the **entire next phase**. If `$ARGUMENTS` contains `--step`, execute **only the next single incomplete step** then stop.

## Execution Protocol

1. **Read `tasks/todo.md`** — this is the single source of truth. It contains the full phased plan with all steps.
2. **Read CLAUDE.md** for project conventions.
3. **Find the next incomplete item:**
   - Look for the next phase with an unchecked milestone.
   - If `--step` mode: find only the next unchecked `- [ ]` step within that phase.

### Full Phase Mode (default)

4. **Execute the entire phase**, step by step:
   - Start with the "Tests First" steps — write the failing tests.
   - Run the tests to confirm they fail (red).
   - Implement each step in order.
   - Run tests after implementation to confirm they pass (green).
   - Refactor if needed while keeping tests green.
5. **Verify the milestone**:
   - Check each acceptance criterion.
   - Run the full test suite to confirm no regressions.
   - Check off completed criteria in `tasks/todo.md`.

### Single Step Mode (`--step`)

4. **Execute that single step only.**
   - If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
   - If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
   - If it's a "Green" step: run all tests, fix any failures. Stop.
5. **Mark the step as done** in `tasks/todo.md` (check it off).

## After Execution (both modes)

6. **Report concisely:**
   - Phase/step completed
   - Files modified
   - Test results (if tests were run)
   - What's next (just its name — /ship will handle planning)

## What NOT to do

- Do NOT execute more than one phase (or more than one step in `--step` mode).
- Do NOT read unnecessary files — only what's needed for the current work.
- Do NOT plan ahead or analyze future phases/steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.

## Workflow

```
/run                  → executes the next full phase
/run --step           → executes one step only
/ship                 → commits, pushes, plans next, enters plan mode
                      → select "clear context and implement"
                      → fresh context reads tasks/todo.md and implements
```

## Constraints
- **One phase (or one step). That's it.** Then stop and let the user decide what's next.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this work.
- If the work can't be completed due to a blocker, document the blocker in `tasks/todo.md` and stop.
- Do not skip the TDD steps.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.
