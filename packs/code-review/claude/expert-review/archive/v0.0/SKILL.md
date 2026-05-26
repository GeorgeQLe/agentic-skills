---
name: expert-review
description: Conduct a thorough project-wide code review as an expert panel, cross-referencing specs, changelogs, and design documents
type: review
version: v0.0
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
5. Tell the user how many items were added and suggest `/run` or `/investigate` to start fixing.

## Constraints
- Be specific — always include file paths and line numbers.
- Every issue must have a concrete recommended fix, not just "improve this."
- Do not flag style preferences or nitpicks unless they impact readability significantly.
- Do not suggest adding comments, docstrings, or type annotations unless something is genuinely confusing.
- Focus on substance over quantity — 5 critical findings are more valuable than 50 nitpicks.
- **Never flag an intentional design decision as an issue.** If documentation explains why something is done a certain way, respect it. If you disagree with the decision, note it under "Documented decisions" with your reasoning, but do not classify it as a finding.
- If no project documentation exists, proceed with the review but note the absence and recommend establishing specs or ADRs.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/expert-review-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/expert-review-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
