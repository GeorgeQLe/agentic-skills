---
name: investigate
description: Autonomously trace a bug from an error message, stack trace, or bug report to its root cause, then propose and apply a minimal fix with tests.
---

# Investigate

Use this skill when the user reports a bug, error, or unexpected behavior and wants autonomous root-cause analysis.

## Workflow

1. Parse the error message, stack trace, or bug description.
2. Trace the execution path from the symptom to the source, reading only files in the chain.
3. Check recent git history for changes that may have introduced the issue.
4. Identify the root cause with file and line reference.
5. Apply a minimal fix and write or update tests.
6. Run tests to verify the fix and check for regressions.

## Output Format

- **Root Cause**: file:line, what's wrong, when it was introduced
- **Fix Applied**: files modified, test results
- **Prevention**: what check would have caught this earlier

## Constraints

- Do not refactor unrelated code.
- If the root cause can't be determined, report what was ruled out.
- Always run tests after applying the fix.
