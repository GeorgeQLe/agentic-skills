---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with $feature-interview
type: planning
version: 1.1.0
argument-hint: "[optional focus area]"
---

# Brainstorm

Invoke as `$brainstorm`.

Evaluate the current codebase and generate actionable suggestions that the user can take into `$feature-interview` for human/agent alignment, planning-destination triage, and follow-up specification or roadmap work.

## Workflow

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

1. Read CLAUDE.md, README, package config, and key source files to understand the project.
2. Check `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and specs from `specs/` (or `spec.md`) if they exist — avoid suggesting things already planned or deferred as advisory records. Read `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) if it exists — competitor gaps, market white space, and positioning weaknesses are high-signal inputs for ideation. Read `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if it exists — "Wrong" and "New" findings are highest-signal ideation input. Read `research/metrics.md` (or `research/{app}/metrics.md`) if it exists — instrumentation gaps can generate ideas.
3. Analyse the codebase across these dimensions:

   **Strategic / Product**
   - New features that would make the project significantly more useful or valuable
   - New workflows or end-to-end automation the project could enable
   - Product line expansion — adjacent use cases, new audiences, or complementary products the core could serve
   - Integration opportunities with external tools, platforms, or APIs that multiply value

   **Improvement**
   - Missing capabilities the architecture is set up for
   - Pain points, rough edges, or manual steps that could be automated
   - Performance bottlenecks or low-hanging optimisations
   - Developer experience friction

   **Hygiene**
   - Technical debt where code has outgrown its design
   - Testing gaps in critical paths
   - Security hardening opportunities

   **Market Fit** (only when `research/icp.md` (or `research/{app}/icp.md`), `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) exist)
   - ICP alignment — features addressing ICP pain points that are missing or incomplete
   - Journey gaps — steps where the product loses the user or customer
   - Unaddressed MVP gaps from `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`) not yet in roadmap
   - Competitive white space — features or capabilities no competitor offers well, from `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) market gaps
   - Competitor leapfrog — specific competitor weaknesses to exploit, or table-stakes features competitors have that you lack
   - Positioning plays — ideas that sharpen differentiation against the competitive landscape
4. If the user provides a focus area, scope the analysis there. Otherwise cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user. When app scope is active, prefix each suggestion with the app name.

Group suggestions by effort level (hours / days / weeks). Each suggestion should include:
- A specific, actionable title
- A one-line description with the concrete codebase signal that motivates it
- A `$feature-interview <topic>` prompt the user can copy-paste

## Constraints

- Be specific and actionable — no vague aspirations.
- Limit to 3–5 suggestions per effort level.
- Do not suggest changes that conflict with CLAUDE.md conventions.
- Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{app}/`).

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/brainstorm-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/brainstorm-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/brainstorm-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
