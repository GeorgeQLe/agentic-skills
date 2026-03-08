---
description: Execute only the next single incomplete step from the current phase
argument-hint: [path-to-plan, defaults to plan.md]
---

# Single-Step Executor

Execute **only the next single incomplete step** from the current phase, then stop. Designed for aggressive context management — minimal context usage per session.

## Execution Protocol

1. **Read CLAUDE.md** for the self-contained "Up Next" plan written by /ship-then-plan. If it contains a specific step to implement, use that as your primary instruction.
2. **Read the plan** at `$ARGUMENTS` (default: `plan.md`) only if CLAUDE.md doesn't have enough detail. Identify the current phase and find the next uncompleted step.
3. **Execute that single step only.**
   - If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
   - If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
   - If it's a "Green" step: run all tests, fix any failures. Stop.
4. **Mark the step as done** in `plan.md` (check it off or annotate it).
5. **Report concisely:**
   - Step completed
   - Files modified
   - Test results (if tests were run)
   - What the next step is (just its name, don't plan it — /ship-then-plan will do that)

## What NOT to do

- Do NOT execute more than one step.
- Do NOT read unnecessary files — only what's needed for this one step.
- Do NOT plan ahead or analyze future steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md — /ship-then-plan handles that.

## Workflow

```
/run-step         → executes one step
/ship-then-plan   → commits, writes next step plan into CLAUDE.md
/clear
/run-step         → executes the next step from fresh context
/ship-then-plan
/clear
...
```

## Constraints
- **ONE step. That's it.** Then stop and let the user decide what's next.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this step.
- If the step can't be completed due to a blocker, document the blocker and stop.
