---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with /feature-interview
type: planning
version: v0.0
argument-hint: "[optional: focus area]"
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/feature-interview` for human/agent alignment, planning-destination triage, and follow-up specification or roadmap work.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

1. **Understand the project**: Read CLAUDE.md, README, package config, and key source files to understand what the project does, its architecture, tech stack, and current state.
2. **Check existing plans and research**: Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and specs from `specs/` (or `spec.md`) if they exist to understand work already planned, in progress, or deferred as advisory records — avoid suggesting things already covered. Read `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) if it exists — competitor gaps, market white space, and positioning weaknesses are high-signal inputs for ideation. Read `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if it exists — "Wrong" and "New" findings are highest-signal ideation input (real user feedback that contradicts assumptions or reveals unmet needs). Read `research/metrics.md` (or `research/{app}/metrics.md`) if it exists — instrumentation gaps can generate ideas for tooling or observability improvements.
3. **Analyse the codebase** across these dimensions:

   **Strategic / Product**
   - **New features**: Capabilities that would make the project significantly more useful or valuable to its users — think beyond what exists today
   - **New workflows**: End-to-end flows or automation that the project could enable but doesn't yet
   - **Product line expansion**: If the project's core could serve adjacent use cases, new audiences, or spin off complementary products — suggest them
   - **Integration opportunities**: External tools, services, platforms, or APIs that would multiply the project's value

   **Improvement**
   - **Missing capabilities**: Features the project's architecture is set up for but doesn't yet offer
   - **Pain points**: Rough edges, inconsistencies, or manual steps that could be automated
   - **Performance opportunities**: Obvious bottlenecks or low-hanging optimisations
   - **Developer experience**: Build times, debugging ergonomics, onboarding friction

   **Hygiene**
   - **Technical debt**: Areas where the code has outgrown its original design
   - **Testing gaps**: Untested critical paths or missing test infrastructure
   - **Security hardening**: Areas where security posture could be improved

   **Market Fit** (only when `research/icp.md` (or `research/{app}/icp.md`), `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) exist)
   - **ICP alignment**: Features that directly address ICP pain points but are missing or incomplete
   - **Journey gaps**: Steps in the user or customer journey where the product loses them
   - **Unaddressed MVP gaps**: Gaps from `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`) not yet tracked in roadmap or todo
   - **Competitive white space**: Features or capabilities that no competitor offers well — opportunities from `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) market gaps
   - **Competitor leapfrog**: Specific competitor weaknesses you could exploit, or table-stakes features competitors have that you lack
   - **Positioning plays**: Ideas that would sharpen differentiation against the competitive landscape
4. **Scope**: If `$ARGUMENTS` is provided, focus the analysis on that area. Otherwise, cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user. When app scope is active, prefix each suggestion with the app name.

Present suggestions grouped by effort level, with each suggestion framed as a topic ready to hand to `/feature-interview`:

### Quick wins (hours)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/feature-interview <topic>`

### Medium efforts (days)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/feature-interview <topic>`

### Larger initiatives (weeks)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/feature-interview <topic>`

## Constraints
- Each suggestion must be specific and actionable — not vague aspirations like "improve testing."
- Include the concrete signal from the codebase that motivates each suggestion (file, pattern, or metric).
- Provide the `/feature-interview <topic>` prompt the user can copy-paste to kick off planning.
- Limit to 3–5 suggestions per effort level to avoid overwhelming the user.
- Do not suggest changes that conflict with patterns established in CLAUDE.md.
- Do not repeat work already tracked in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{app}/`).

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/brainstorm-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/brainstorm-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
