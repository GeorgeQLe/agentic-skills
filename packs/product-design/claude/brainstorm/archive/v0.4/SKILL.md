---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with /feature-interview
type: planning
version: v0.4
required_conventions: [alignment-page]
argument-hint: "[optional: focus area]"
context_intake: scoped
visual_tier: prototype
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/feature-interview` for human/agent alignment, planning-destination triage, and follow-up specification or roadmap work.

## Follow-up Skill Availability Gate

Before listing any `/feature-interview` prompts, verify that `feature-interview` is available through at least one of these signals:

- `.agents/project.json` has `enabled_skills.feature-interview`.
- `.agents/project.json` has an enabled pack that provides `feature-interview`; use `scripts/pack.sh which feature-interview` when available to identify the provider.
- A local or global skill file exists, such as `.claude/skills/feature-interview/SKILL.md`, `.codex/skills/feature-interview/SKILL.md`, `~/.claude/skills/feature-interview/SKILL.md`, or `~/.codex/skills/feature-interview/SKILL.md`.

If `feature-interview` is unavailable, the first line of the displayed output and the first line appended for this run in `tasks/ideas.md` must be:

```bash
npx skillpacks install feature-interview
```

Then tell Claude users to run `/reload-skills`, then `/clear` or restart if `/feature-interview` remains invisible after install. Put this prerequisite before any brainstorm suggestion or `/feature-interview <topic>` prompt.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

1. **Understand the project**: Read CLAUDE.md, README, package config, and key source files to understand what the project does, its architecture, tech stack, and current state.
2. **Check existing plans and research**: Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and specs from `specs/` (or `spec.md`) if they exist to understand work already planned, in progress, or deferred as advisory records — avoid suggesting things already covered. Read `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) if it exists — competitor gaps, market white space, and positioning weaknesses are high-signal inputs for ideation. Read `research/customer-feedback.md` (or `research/{slug}/customer-feedback.md`) if it exists — "Wrong" and "New" findings are highest-signal ideation input (real user feedback that contradicts assumptions or reveals unmet needs). Read `research/metrics.md` (or `research/{slug}/metrics.md`) if it exists — instrumentation gaps can generate ideas for tooling or observability improvements.
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

   **Market Fit** (only when `research/icp.md` (or `research/{slug}/icp.md`), `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) exist)
   - **ICP alignment**: Features that directly address ICP pain points but are missing or incomplete
   - **Journey gaps**: Steps in the user or customer journey where the product loses them
   - **Unaddressed MVP gaps**: Gaps from `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) not yet tracked in roadmap or todo
   - **Competitive white space**: Features or capabilities that no competitor offers well — opportunities from `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) market gaps
   - **Competitor leapfrog**: Specific competitor weaknesses you could exploit, or table-stakes features competitors have that you lack
   - **Positioning plays**: Ideas that would sharpen differentiation against the competitive landscape
4. **Scope**: If `$ARGUMENTS` is provided, focus the analysis on that area. Otherwise, cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user. When product-path scope is active, prefix each suggestion with the app name.

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
- Do not repeat work already tracked in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{slug}/`).

## Context Gathering

**Step 1 — Scope questions.** Before researching, ask the user 1–3 questions via `AskUserQuestion` to understand: their product/service, target audience, and what they hope to learn or decide from this research.

**Step 2 — Research.** Conduct research scoped by the user's answers.

**Step 3 — Findings validation.** Before building the alignment page, present the 3–5 most important findings and ask the user to validate or correct any critical assumptions.

## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/brainstorm-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
