---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with $feature-interview
type: planning
version: v0.3
required_conventions: [alignment-page]
argument-hint: "[optional focus area]"
context_intake: scoped
visual_tier: prototype
---

# Brainstorm

Invoke as `$brainstorm`.

Evaluate the current codebase and generate actionable suggestions that the user can take into `$feature-interview` for human/agent alignment, planning-destination triage, and follow-up specification or roadmap work.

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

1. Read CLAUDE.md, README, package config, and key source files to understand the project.
2. Check `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and specs from `specs/` (or `spec.md`) if they exist — avoid suggesting things already planned or deferred as advisory records. Read `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) if it exists — competitor gaps, market white space, and positioning weaknesses are high-signal inputs for ideation. Read `research/customer-feedback.md` (or `research/{slug}/customer-feedback.md`) if it exists — "Wrong" and "New" findings are highest-signal ideation input. Read `research/metrics.md` (or `research/{slug}/metrics.md`) if it exists — instrumentation gaps can generate ideas.
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

   **Market Fit** (only when `research/icp.md` (or `research/{slug}/icp.md`), `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) exist)
   - ICP alignment — features addressing ICP pain points that are missing or incomplete
   - Journey gaps — steps where the product loses the user or customer
   - Unaddressed MVP gaps from `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) not yet in roadmap
   - Competitive white space — features or capabilities no competitor offers well, from `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) market gaps
   - Competitor leapfrog — specific competitor weaknesses to exploit, or table-stakes features competitors have that you lack
   - Positioning plays — ideas that sharpen differentiation against the competitive landscape
4. If the user provides a focus area, scope the analysis there. Otherwise cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user. When product-path scope is active, prefix each suggestion with the app name.

Group suggestions by effort level (hours / days / weeks). Each suggestion should include:
- A specific, actionable title
- A one-line description with the concrete codebase signal that motivates it
- A `$feature-interview <topic>` prompt the user can copy-paste

## Constraints

- Be specific and actionable — no vague aspirations.
- Limit to 3–5 suggestions per effort level.
- Do not suggest changes that conflict with CLAUDE.md conventions.
- Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{slug}/`).

## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/brainstorm-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
