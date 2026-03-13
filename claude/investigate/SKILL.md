---
name: investigate
description: Autonomously trace a bug from error message to root cause and proposed fix
argument-hint: <error message, bug description, or issue URL>
---

# Investigate

Given a bug report, error message, or unexpected behavior, autonomously trace it to its root cause and propose a fix.

## Process

1. **Parse the input** from `$ARGUMENTS`:
   - Error message or stack trace → extract file paths, line numbers, error types
   - Bug description → identify the expected vs. actual behavior
   - Issue URL → fetch the issue details via `gh`
   - If no arguments provided, ask the user what to investigate.

2. **Gather context:**
   - Read `CLAUDE.md` for project conventions.
   - If a stack trace is available, start from the crash site and read those files.
   - If behavioral, identify the relevant feature area and read entry points.
   - Check `git log --oneline -20` for recent changes that may have introduced the issue.

3. **Trace the issue:**
   - Follow the execution path from the symptom to the source.
   - Read only the files in the chain — do not explore the full codebase.
   - Check for common causes: null/undefined, wrong types, missing env vars, stale imports, race conditions, schema mismatches.
   - If the issue was introduced by a recent commit, identify which one with `git log` or `git bisect` logic.

4. **Verify the hypothesis:**
   - Look for test coverage of the affected code path.
   - Check if the bug is reproducible from the code alone (no need to run the app unless necessary).
   - If there are related tests, run them to confirm the current state.

5. **Propose the fix:**
   - Write the minimal code change that fixes the root cause.
   - If tests exist, update them. If not, write a test that would have caught this.
   - Run the relevant tests to confirm the fix works and no regressions.

## Output Format

### Root Cause
- **Location**: `file:line`
- **What's wrong**: One-sentence explanation
- **Introduced by**: commit hash or "pre-existing" if not recent

### Fix Applied
- Files modified and what changed
- Test results

### Prevention
- What test or check would have caught this earlier

## Constraints
- Do not refactor unrelated code while fixing the bug.
- Do not guess — if you can't trace the root cause, say so and list what you've ruled out.
- Always run tests after applying the fix.
- If the fix requires changes outside the current project (infra, env vars, external service), document what's needed instead of attempting it.
