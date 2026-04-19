---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with /plan-interview
type: planning
version: 1.1.0
argument-hint: "[optional: focus area]"
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/plan-interview` for deeper exploration and specification.

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

   **Market Fit** (only when `research/icp.md` (or `research/{app}/icp.md`), `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) exist)
   - **ICP alignment**: Features that directly address ICP pain points but are missing or incomplete
   - **Journey gaps**: Steps in the user or customer journey where the product loses them
   - **Unaddressed MVP gaps**: Gaps from `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`) not yet tracked in roadmap or todo
   - **Competitive white space**: Features or capabilities that no competitor offers well — opportunities from `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) market gaps
   - **Competitor leapfrog**: Specific competitor weaknesses you could exploit, or table-stakes features competitors have that you lack
   - **Positioning plays**: Ideas that would sharpen differentiation against the competitive landscape
4. **Scope**: If `$ARGUMENTS` is provided, focus the analysis on that area. Otherwise, cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user. When app scope is active, prefix each suggestion with the app name.

Present suggestions grouped by effort level, with each suggestion framed as a topic ready to hand to `/plan-interview`:

### Quick wins (hours)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview <topic>`

### Medium efforts (days)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview <topic>`

### Larger initiatives (weeks)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview <topic>`

## Constraints
- Each suggestion must be specific and actionable — not vague aspirations like "improve testing."
- Include the concrete signal from the codebase that motivates each suggestion (file, pattern, or metric).
- Provide the `/plan-interview <topic>` prompt the user can copy-paste to kick off planning.
- Limit to 3–5 suggestions per effort level to avoid overwhelming the user.
- Do not suggest changes that conflict with patterns established in CLAUDE.md.
- Do not repeat work already tracked in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{app}/`).

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
