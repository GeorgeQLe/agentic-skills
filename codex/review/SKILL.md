---
name: review
description: Conduct a project-wide or scoped code review focused on bugs, regressions, security, performance, architecture, error handling, and testing gaps, with findings prioritized by severity.
---

# Review

Use this skill when the user wants a code review of the whole project or a specific path.

## Workflow

1. If the user provides a file or directory, scope the review there. Otherwise review the repository broadly.
2. Read enough of the codebase to understand the architecture before critiquing it.
3. Prioritize findings over summary.
4. Review against these dimensions:
   - Correctness
   - Security
   - Performance
   - Architecture
   - Error handling
   - Code quality
   - Testing
   - Dependency risks

## Output Format

Report findings grouped by severity:

- Critical: bugs, security issues, data-loss risks
- High: major performance, architecture, or error-handling problems
- Medium: maintainability or testing gaps with real impact
- Low: worthwhile improvements with limited risk
- Positive observations: strong patterns worth preserving

## Constraints

- Include concrete file and line references for each finding when possible.
- Every finding should include a specific recommended fix.
- Do not fill the review with style nitpicks.
- If no findings are present, state that explicitly and mention residual risks or test gaps.
