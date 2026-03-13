---
name: review
description: Conduct a thorough project-wide code review as an expert panel
argument-hint: [optional: specific directory or file path to scope the review]
---

# Expert Code Review

Conduct a thorough code review of this project serving as a panel of expert programmers and code architects emphasizing industry best practice.

## Process

1. **Scope**: If `$ARGUMENTS` is provided, focus the review on that path. Otherwise, review the entire project.
2. **Explore the codebase**: Read the project structure, key files, configuration, and source code. Understand the architecture before critiquing it.
3. **Review against these dimensions**:
   - **Correctness**: Bugs, logic errors, race conditions, off-by-one errors, null/undefined handling
   - **Security**: OWASP top 10, injection vulnerabilities, auth/authz issues, secrets exposure, input validation
   - **Performance**: N+1 queries, unnecessary re-renders, missing indexes, memory leaks, expensive operations in hot paths
   - **Architecture**: Separation of concerns, coupling, cohesion, dependency direction, appropriate abstractions (not over-engineered)
   - **Error handling**: Missing error cases, swallowed errors, unclear error messages, missing fallbacks
   - **Code quality**: Dead code, duplication, naming clarity, overly complex functions, missing types
   - **Testing**: Missing test coverage for critical paths, brittle tests, untested edge cases
   - **Dependencies**: Outdated packages, unused dependencies, security vulnerabilities in deps

## Output Format

Report findings as a prioritized list grouped by severity:

### Critical (must fix — bugs, security issues, data loss risks)
- **[File:line]** Description of issue and recommended fix

### High (should fix — performance, architecture, error handling)
- **[File:line]** Description of issue and recommended fix

### Medium (improve — code quality, testing gaps, maintainability)
- **[File:line]** Description of issue and recommended fix

### Low (consider — style, minor improvements, nice-to-haves)
- **[File:line]** Description of issue and recommended fix

### Positive observations
- Note things done well — good patterns worth preserving

## Constraints
- Be specific — always include file paths and line numbers.
- Every issue must have a concrete recommended fix, not just "improve this."
- Do not flag style preferences or nitpicks unless they impact readability significantly.
- Do not suggest adding comments, docstrings, or type annotations unless something is genuinely confusing.
- Focus on substance over quantity — 5 critical findings are more valuable than 50 nitpicks.
