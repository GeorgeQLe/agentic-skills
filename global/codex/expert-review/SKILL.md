---
name: expert-review
description: Conduct a thorough project-wide code review as an expert panel, cross-referencing specs, changelogs, and design documents
type: review
version: 1.0.0
---

# Expert Review

Use this skill when the user wants a code review of the whole project or a specific path, with findings validated against project documentation.

## Workflow

1. Gather project context:
   - Read CLAUDE.md, README, and project config to understand conventions.
   - Search for and read specs (`specs/`, `spec.md`, `docs/`), changelogs (`CHANGELOG.md`, `tasks/history.md`), ADRs, interview logs (`*-__interview.md__`), and design docs.
   - Read `tasks/roadmap.md` if it exists to understand the full plan. Read `tasks/todo.md` for current phase and in-progress work. Read `tasks/manual-todo.md` (if it exists) for pending manual tasks.
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
6. Verify findings (false-positive filter):
   - Re-read the actual source code for every finding. Confirm: the code behaves as claimed, the issue isn't handled elsewhere (guard clause, middleware, caller), flagged dependencies actually exist/are missing, and "missing" test coverage isn't in a different test file.
   - Drop any finding you cannot re-confirm on second read. If uncertain, downgrade to Low with a note that it needs manual verification.

## Output Format

Report findings grouped by severity:

- Critical: bugs, security issues, data-loss risks
- High: major performance, architecture, or error-handling problems
- Medium: maintainability or testing gaps with real impact
- Low: worthwhile improvements with limited risk
- Spec conformance: where code diverges from documented specs, with document reference
- Documented decisions (no action needed): patterns that look like issues but are intentional
- Positive observations: strong patterns worth preserving

## Follow-Through

After presenting findings, write Critical and High items to `tasks/todo.md` under a `## Code Review Fixes` heading (append or replace existing section). One checkbox per finding with file:line and recommended fix. Do not add Medium/Low items. Suggest `$run` or `$investigate` to start fixing.

## Constraints

- Include concrete file and line references for each finding when possible.
- Every finding should include a specific recommended fix.
- Do not fill the review with style nitpicks.
- Never flag an intentional design decision as an issue. Respect documented trade-offs.
- If no project documentation exists, note the absence and recommend establishing specs or ADRs.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
