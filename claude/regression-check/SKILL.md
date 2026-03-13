---
name: regression-check
description: Run a comprehensive health check across the monorepo after completing a phase or major change
argument-hint: [optional: specific package or directory to focus on]
---

# Regression Check

Run a comprehensive health check across the project or monorepo to catch regressions, broken imports, type errors, and lint failures after completing a phase or major change.

## Process

1. **Determine scope:**
   - If `$ARGUMENTS` specifies a package or directory, focus there but still check dependents.
   - Otherwise, check the entire project.
   - Read `CLAUDE.md` for project conventions and available commands.

2. **Type checking:**
   - Run `tsc --noEmit` (or the project's type-check command from `package.json`).
   - Collect and categorize errors by package/directory.

3. **Lint check:**
   - Run the project's lint command (from `package.json` scripts).
   - Collect errors (ignore warnings unless they indicate real issues).

4. **Test suite:**
   - Run the full test suite (or scoped if `$ARGUMENTS` provided).
   - Collect failures with file paths and error messages.
   - Note any tests that were skipped or marked as TODO.

5. **Build check:**
   - Run the build command to verify the project compiles.
   - Catch issues that type-checking alone misses (e.g., missing assets, broken dynamic imports).

6. **Import health:**
   - Check for circular dependencies if a tool is available (`madge`, `dpdm`, or manual detection).
   - Verify that all import paths resolve (no broken imports from moved/deleted files).

7. **Environment check:**
   - Verify `.env.example` (or equivalent) matches the env vars actually used in code.
   - Flag any new env vars added without documentation.

8. **Compare with baseline:**
   - If there's a CI status or previous test run to compare against, note new failures vs. pre-existing ones.

## Output Format

### Health Check Results

| Check | Status | Details |
|-------|--------|---------|
| Type check | pass/fail | X errors in Y files |
| Lint | pass/fail | X errors |
| Tests | pass/fail | X passed, Y failed, Z skipped |
| Build | pass/fail | error details if failed |
| Imports | pass/fail | circular deps or broken imports |
| Env vars | pass/fail | missing documentation |

### Failures (if any)

#### Type Errors
- `file.ts:42` — error description

#### Test Failures
- `test-file.test.ts` — test name — error

#### Build Errors
- error details

### Regressions vs. Pre-existing
- **New failures**: list (introduced by recent changes)
- **Pre-existing**: list (existed before this phase)

### Verdict
- **All clear**: safe to ship
- **Issues found**: list what needs fixing before shipping

## Constraints
- Run checks in parallel where possible (type-check and lint can run simultaneously).
- Clearly distinguish between new regressions and pre-existing issues.
- Do not fix issues automatically — only report them. The user decides what to fix.
- If a check command doesn't exist in the project, skip it and note that it's unavailable.
- Keep the output actionable — every failure should have a file path and enough context to fix it.
