---
name: expert-review
description: Conduct a thorough project-wide code review as an expert panel, cross-referencing specs, changelogs, and design documents
type: review
version: v0.1
required_conventions: [alignment-page]
argument-hint: "[optional: specific directory or file path to scope the review]"
---

# Expert Code Review

Conduct a thorough code review of this project serving as a panel of expert programmers and code architects emphasizing industry best practice. Findings are cross-referenced against project documentation to avoid contradicting intentional design decisions.

## Process

1. **Gather project context**:
   - Read `CLAUDE.md`, `README.md`, and any project config files to understand conventions and architecture.
   - Search for and read project documentation: specs (`specs/`, `spec.md`, `docs/`), changelogs (`CHANGELOG.md`, `CHANGES.md`, `tasks/history.md`), ADRs (`adr/`, `docs/adr/`, `docs/decisions/`), interview logs (`*-__interview.md__`), and design docs.
   - Read `tasks/roadmap.md` if it exists to understand the full plan. Read `tasks/todo.md` for current phase and in-progress work. Read `tasks/manual-todo.md` (if it exists) for pending manual tasks. Read `tasks/record-todo.md` and `tasks/recurring-todo.md` (if they exist) for advisory context only.
   - Build a mental model of **intentional decisions** — patterns, trade-offs, and constraints the team has deliberately chosen.

2. **Scope**: If `$ARGUMENTS` is provided, focus the review on that path. Otherwise, review the entire project.

3. **Explore the codebase**: Read the project structure, key files, configuration, and source code. Understand the architecture before critiquing it.

4. **Review against these dimensions**:
   - **Correctness**: Bugs, logic errors, race conditions, off-by-one errors, null/undefined handling
   - **Security**: OWASP top 10, injection vulnerabilities, auth/authz issues, secrets exposure, input validation
   - **Performance**: N+1 queries, unnecessary re-renders, missing indexes, memory leaks, expensive operations in hot paths
   - **Architecture**: Separation of concerns, coupling, cohesion, dependency direction, appropriate abstractions (not over-engineered)
   - **Error handling**: Missing error cases, swallowed errors, unclear error messages, missing fallbacks
   - **Code quality**: Dead code, duplication, naming clarity, overly complex functions, missing types
   - **Testing**: Missing test coverage for critical paths, brittle tests, untested edge cases
   - **Dependencies**: Outdated packages, unused dependencies, security vulnerabilities in deps
   - **Spec conformance**: Code that diverges from documented specs, missing features that specs require, or behaviour that contradicts documented design decisions

5. **Cross-reference each finding against documentation**:
   - Before reporting a finding, check if the pattern was an intentional decision documented in specs, ADRs, changelogs, or interview logs.
   - If a finding contradicts a documented decision, **do not report it as an issue**. Instead, note it under "Documented decisions" in the output.
   - If a finding reveals a gap between the spec and the implementation where the spec appears to be the intended source of truth, flag it as a spec conformance issue.

6. **Verify findings (false-positive filter)**:
   - Before finalizing, re-read the actual source code for every finding. For each one, confirm:
     - The code actually behaves the way you claimed — re-read the lines and surrounding context, don't rely on memory.
     - The issue isn't handled elsewhere (e.g., a guard clause upstream, a middleware, a wrapper, or a caller that validates input before passing it in).
     - The dependency/import you flagged actually exists (or doesn't) — check `package.json`, lock files, or import maps rather than assuming.
     - The "missing" test coverage isn't already covered by a test under a different name or in a different test file.
   - **Drop any finding you cannot re-confirm with a second read.** If uncertain, downgrade rather than drop — move it to Low with a note that it needs manual verification.

## Output

Report findings as a prioritized list grouped by severity:

### Critical (must fix — bugs, security issues, data loss risks)
- **[File:line]** Description of issue and recommended fix

### High (should fix — performance, architecture, error handling)
- **[File:line]** Description of issue and recommended fix

### Medium (improve — code quality, testing gaps, maintainability)
- **[File:line]** Description of issue and recommended fix

### Low (consider — style, minor improvements, nice-to-haves)
- **[File:line]** Description of issue and recommended fix

### Spec conformance
- **[File:line]** Where code diverges from documented specs or design docs, with reference to the relevant document

### Documented decisions (no action needed)
- Patterns that might look like issues but are intentional, with reference to the document that explains why

### Positive observations
- Note things done well — good patterns worth preserving

## Follow-Through

After presenting findings, write Critical and High implementation fixes to `tasks/todo.md`. If a Critical/High observation is a non-blocking future validation or condition-gated measurement rather than a fix, write it to `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule:

1. Read `tasks/todo.md` if it exists — append to the end under a `## Code Review Fixes` heading (create the file if it doesn't exist).
2. Add one checkbox item per Critical or High finding:
   ```markdown
   ## Code Review Fixes
   > Generated by `/expert-review` on [date]
   ### Critical
   - [ ] [File:line] — Description + recommended fix
   ### High
   - [ ] [File:line] — Description + recommended fix
   ```
3. Do **not** add Medium, Low, or Positive observations — only Critical and High are actionable todos.
4. If `tasks/todo.md` already has a `## Code Review Fixes` section, replace it with the fresh review results.
5. Tell the user how many items were added and suggest `/exec` or `/investigate` to start fixing.

## Constraints
- Be specific — always include file paths and line numbers.
- Every issue must have a concrete recommended fix, not just "improve this."
- Do not flag style preferences or nitpicks unless they impact readability significantly.
- Do not suggest adding comments, docstrings, or type annotations unless something is genuinely confusing.
- Focus on substance over quantity — 5 critical findings are more valuable than 50 nitpicks.
- **Never flag an intentional design decision as an issue.** If documentation explains why something is done a certain way, respect it. If you disagree with the decision, note it under "Documented decisions" with your reasoning, but do not classify it as a finding.
- If no project documentation exists, proceed with the review but note the absence and recommend establishing specs or ADRs.


## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/expert-review-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
