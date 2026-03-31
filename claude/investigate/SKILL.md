---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
version: 1.1.0
argument-hint: <error, bug description, user observations, or issue URL> [--plan]
---

# Investigate

Given a bug report, error message, unexpected behavior, or user observations about what they think is wrong, validate claims against the codebase and git history, trace to root cause, and propose a fix.

## Process

1. **Parse the input** from `$ARGUMENTS`:
   - Error message or stack trace → extract file paths, line numbers, error types
   - Bug description → identify the expected vs. actual behavior
   - User claims/observations → extract each specific claim to validate (e.g., "I think the auth middleware is stripping the header," "this worked before the last deploy," "the database query is returning stale data")
   - Issue URL → fetch the issue details via `gh`
   - Check for `--plan` flag → if present, force plan output mode (write fix steps to `tasks/todo.md` instead of applying inline)
   - If no arguments provided, ask the user what to investigate.

2. **Gather context:**
   - Read `CLAUDE.md` for project conventions.
   - If a stack trace is available, start from the crash site and read those files.
   - If behavioral, identify the relevant feature area and read entry points.
   - Check `git log --oneline -20` for recent changes that may have introduced the issue.
   - If the user references specific files, commits, or timeframes, read those directly.

3. **Validate user claims** (when the user provides observations or hypotheses):
   - Extract each distinct claim the user has made.
   - For each claim, verify it against the codebase and git history:
     - Read the files the user references — does the code behave as they describe?
     - Check `git log`, `git diff`, and `git blame` on relevant files — does the history support their timeline?
     - If the user says "this used to work" or "this changed recently," use `git log --all -- <file>` and `git diff <commit range>` to verify.
   - Classify each claim as: **confirmed**, **partially correct** (right intuition, wrong detail), or **not supported by evidence**.
   - Report findings before proceeding to trace — the user's mental model may be off, and correcting it early saves time.

4. **Trace the issue:**
   - Follow the execution path from the symptom to the source.
   - Read only the files in the chain — do not explore the full codebase.
   - Check for common causes: null/undefined, wrong types, missing env vars, stale imports, race conditions, schema mismatches, config drift.
   - If the issue was introduced by a recent commit, identify which one with `git log` or `git bisect` logic.
   - If user claims were partially correct or unsupported, trace from the actual evidence rather than the user's hypothesis.

5. **Verify the hypothesis:**
   - Look for test coverage of the affected code path.
   - Check if the bug is reproducible from the code alone (no need to run the app unless necessary).
   - If there are related tests, run them to confirm the current state.

6. **Apply or plan the fix:**
   - **Determine fix mode:**
     - If `--plan` flag is set → **plan mode** (always write to `tasks/todo.md`)
     - If fix requires 3+ discrete steps across multiple files → **plan mode**
     - Otherwise → **inline mode** (apply fix directly)
   - **Inline mode** (default for single contained fixes):
     - Write the minimal code change that fixes the root cause.
     - If tests exist, update them. If not, write a test that would have caught this.
     - Run the relevant tests to confirm the fix works and no regressions.
   - **Plan mode** (multi-step fixes or `--plan` flag):
     - Do NOT apply code changes. Proceed to step 7.

7. **Write fix steps to `tasks/todo.md`** (plan mode only):
   - Read existing `tasks/todo.md` if present — do NOT overwrite existing content.
   - Append a new section:
     ```
     ## Investigation Fix: [concise title of the issue]

     - [ ] Step description — `file/path.ext` — why this change is needed
     - [ ] Step description — `file/path.ext` — why this change is needed
     ...
     - [ ] Verify: run [specific test command or acceptance criterion]
     ```
   - Each item must specify: what to change, which file, and why.
   - Final item must be an acceptance criterion (run tests, verify behavior).
   - Order steps by dependency — changes that other steps depend on come first.

## Output Format

### User Claims Validated
For each claim the user made:
- **Claim**: What the user said
- **Verdict**: Confirmed / Partially correct / Not supported
- **Evidence**: What the code or git history actually shows

_(Skip this section if the input was a plain error message or stack trace with no user hypotheses.)_

### Root Cause
- **Location**: `file:line`
- **What's wrong**: One-sentence explanation
- **Introduced by**: commit hash or "pre-existing" if not recent
- **Relationship to user's theory**: How this connects to (or diverges from) what the user suspected

### Fix Applied
_(Shown in inline mode)_
- Files modified and what changed
- Test results

### Fix Steps Written
_(Shown in plan mode — replaces "Fix Applied")_
- Written to `tasks/todo.md` under `## Investigation Fix: [title]`
- Number of steps and summary
- Run `/run` to execute the fix steps sequentially

### Prevention
- What test or check would have caught this earlier

## Constraints
- Do not refactor unrelated code while fixing the bug.
- Do not guess — if you can't trace the root cause, say so and list what you've ruled out.
- Always validate user claims before assuming they're correct — the user's observations are a starting point, not ground truth.
- Always run tests after applying the fix (inline mode).
- If the fix requires changes outside the current project (infra, env vars, external service), document what's needed instead of attempting it.
- Do not write to `docs/debug-changelog.md` — that is `/debug`'s domain.
- Do not write to `tasks/todo.md` for single-step fixes unless `--plan` is explicitly set.
