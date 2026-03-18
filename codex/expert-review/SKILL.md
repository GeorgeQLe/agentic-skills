---
name: expert-review
description: Conduct a project-wide code review cross-referenced against specs, changelogs, and design documents to avoid contradicting intentional decisions.
---

# Expert Review

Use this skill when the user wants a code review of the whole project or a specific path, with findings validated against project documentation.

## Workflow

1. Gather project context:
   - Read CLAUDE.md, README, and project config to understand conventions.
   - Search for and read specs (`spec.md`, `docs/`), changelogs (`CHANGELOG.md`, `tasks/history.md`), ADRs, interview logs (`*-__interview.md__`), and design docs.
   - Read `tasks/roadmap.md` if it exists to understand the full plan. Read `tasks/todo.md` for current phase and in-progress work.
   - Build a mental model of intentional decisions and documented trade-offs.
2. If the user provides a file or directory, scope the review there. Otherwise review the repository broadly.
3. Read enough of the codebase to understand the architecture before critiquing it.
4. Review against these dimensions:
   - Correctness
   - Security
   - Performance
   - Architecture
   - Error handling
   - Code quality
   - Testing
   - Dependency risks
   - Spec conformance — code that diverges from documented specs or design decisions
5. Cross-reference each finding against documentation before reporting:
   - If a pattern is an intentional documented decision, do not report it as an issue — list it under "Documented decisions" instead.
   - If code diverges from a spec, flag it as a spec conformance issue.

## Output Format

Report findings grouped by severity:

- Critical: bugs, security issues, data-loss risks
- High: major performance, architecture, or error-handling problems
- Medium: maintainability or testing gaps with real impact
- Low: worthwhile improvements with limited risk
- Spec conformance: where code diverges from documented specs, with document reference
- Documented decisions (no action needed): patterns that look like issues but are intentional
- Positive observations: strong patterns worth preserving

## Constraints

- Include concrete file and line references for each finding when possible.
- Every finding should include a specific recommended fix.
- Do not fill the review with style nitpicks.
- Never flag an intentional design decision as an issue. Respect documented trade-offs.
- If no project documentation exists, note the absence and recommend establishing specs or ADRs.
