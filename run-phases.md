---
description: Execute the next incomplete phase from a phased plan
argument-hint: [path-to-plan, defaults to plan.md]
---

# Single-Phase Executor

Execute **only the next incomplete phase** from a phased implementation plan, then stop. This is designed to be run in a fresh context window — one phase per session to avoid context degradation.

## Execution Protocol

1. **Read the plan** at `$ARGUMENTS` (default: `plan.md`).
2. **Identify the next incomplete phase** by checking:
   - Milestone acceptance criteria checkboxes — find the first phase with unchecked items.
   - If CLAUDE.md has a "Current Phase" or "Up Next" marker, use that.
3. **Read the project's CLAUDE.md** for any relevant context, conventions, or notes from prior phases.
4. **Execute that single phase**, step by step:
   - Start with the "Tests First" steps — write the failing tests.
   - Run the tests to confirm they fail (red).
   - Implement each step in order.
   - Run tests after implementation to confirm they pass (green).
   - Refactor if needed while keeping tests green.
5. **Verify the milestone**:
   - Check each acceptance criterion.
   - Run the full test suite to confirm no regressions.
   - Check off completed criteria in `plan.md`.
6. **Update docs**:
   - Update CLAUDE.md with what was completed and any notes for the next phase.
   - Mark the phase as complete in `plan.md`.
7. **Report** what was done:
   - Phase completed
   - Steps executed
   - Files modified
   - Test results
   - What the next phase is

## Workflow

This skill is meant to be used in a loop across fresh contexts:

```
/run-phases plan.md   → executes phase N
/ship-end             → commits and pushes
/clear                → fresh context
/run-phases plan.md   → executes phase N+1
...
```

## Constraints
- **Execute only ONE phase.** Do not continue to the next phase.
- Each phase must be self-contained — read the plan fresh, don't rely on prior context.
- If a phase's tests can't pass due to a blocking issue, document the blocker in CLAUDE.md and stop.
- Do not skip the TDD steps. Tests must be written and verified failing before implementation begins.
