---
name: expert-review
description: Conduct a thorough project-wide code review as an expert panel, cross-referencing specs, changelogs, and design documents
type: review
version: v0.0
---

# Expert Review

Invoke as `$expert-review`.

Use this skill when the user wants a code review of the whole project or a specific path, with findings validated against project documentation.

## Workflow

1. Gather project context:
   - Read CLAUDE.md, README, and project config to understand conventions.
   - Search for and read specs (`specs/`, `spec.md`, `docs/`), changelogs (`CHANGELOG.md`, `tasks/history.md`), ADRs, interview logs (`*-__interview.md__`), and design docs.
   - Read `tasks/roadmap.md` if it exists to understand the full plan. Read `tasks/todo.md` for current phase and in-progress work. Read `tasks/manual-todo.md` (if it exists) for pending manual tasks. Read `tasks/record-todo.md` and `tasks/recurring-todo.md` (if they exist) for advisory context only.
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

After presenting findings, write Critical and High implementation fixes to `tasks/todo.md` under a `## Code Review Fixes` heading (append or replace existing section). One checkbox per finding with file:line and recommended fix. Do not add Medium/Low items. If a Critical/High observation is a non-blocking future validation or condition-gated measurement rather than a fix, write it to `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule. Suggest `$run` or `$investigate` to start fixing concrete work.

## Constraints

- Include concrete file and line references for each finding when possible.
- Every finding should include a specific recommended fix.
- Do not fill the review with style nitpicks.
- Never flag an intentional design decision as an issue. Respect documented trade-offs.
- If no project documentation exists, note the absence and recommend establishing specs or ADRs.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/expert-review-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/expert-review-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
