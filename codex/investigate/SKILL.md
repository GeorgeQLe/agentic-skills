---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
---

# Investigate

Use this skill when the user reports a bug, error, unexpected behavior, or provides observations/hypotheses about what they think is wrong. Validates claims against the codebase and git history before tracing to root cause.

## Workflow

1. Parse the error message, stack trace, bug description, or user observations/claims.
2. If the user provides claims or hypotheses, validate each one against the codebase and git history (`git log`, `git diff`, `git blame`). Classify each as confirmed, partially correct, or not supported by evidence. Report findings before proceeding.
3. Trace the execution path from the symptom (or actual evidence, if user claims were incorrect) to the source, reading only files in the chain.
4. Check recent git history for changes that may have introduced the issue.
5. Identify the root cause with file and line reference.
6. Apply a minimal fix and write or update tests.
7. Run tests to verify the fix and check for regressions.

## Output Format

- **User Claims Validated**: For each claim — verdict (confirmed/partially correct/not supported) and evidence. Skip if input was a plain error message.
- **Root Cause**: file:line, what's wrong, when introduced, relationship to user's theory
- **Fix Applied**: files modified, test results
- **Prevention**: what check would have caught this earlier

## Constraints

- Do not refactor unrelated code.
- Validate user claims before assuming they're correct — observations are a starting point, not ground truth.
- If the root cause can't be determined, report what was ruled out.
- Always run tests after applying the fix.
