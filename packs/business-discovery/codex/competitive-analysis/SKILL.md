---
name: competitive-analysis
description: Orchestrator — select competitive-analysis frameworks, queue framework research, and synthesize market landscape findings
type: research
version: v0.17
argument-hint: "[optional: \"--synthesize\" | \"core\" | concept/category/competitors]"
invocation: orchestrator
interview_depth: light
visual_tier: visual
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` inside Codex, or `npx skillpacks install <pack>` from the project shell, instead of the target skill. After install, tell Codex users to start a fresh Codex CLI session if the `$` skill list remains stale. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Competitive Analysis — Orchestrator

Invoke as `$competitive-analysis`.

This is a **Pattern A framework-decomposition orchestrator**. It resolves product/research scope, recommends competitive-analysis frameworks, writes framework execution steps to `tasks/todo.md`, and later synthesizes approved framework outputs into the canonical competitive landscape report. Individual frameworks live as child skills under `frameworks/`.

Available frameworks:

| Framework | Slug | Lens | Default |
|-----------|------|------|---------|
| Porter's Five Forces | `porter-five-forces` | Industry structure, power dynamics, substitutes, entrants, rivalry | Yes |
| SWOT | `swot` | Strengths, weaknesses, opportunities, threats against market evidence | Yes |
| Strategic Group Map | `strategic-group-map` | Competitive clusters, positioning axes, whitespace by segment | Optional |
| Feature/Pricing Matrix | `feature-pricing-matrix` | Capability, package, and price comparisons across alternatives | Yes |

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Scope discovery and approval.** Inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions. Build the `review` HTML alignment page before synthesized research. The page must render the proposed scope, available source categories, known context, assumptions/confidence, proposed working-packet and canonical output paths, and research-scope approval gates. Stop for final compiled YAML approval of the research scope. Do not perform synthesized research, rank candidates, make recommendations, or write working packets, canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, perform the synthesized research, run required source/code checks, and write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet. Update the `review` HTML alignment page with the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and artifact approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML for artifact approval only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

**Detect mode before proceeding:**

- **Concept-validation mode** activates when: no `research/icp.md` AND (no meaningful codebase OR `$ARGUMENTS` contains "concept"/"validate"). Use this mode to validate market gaps after a concept has been shaped by `$idea-scope-brief` or an equivalent brief; if no concept is clear, recommend `$idea-scope-brief` first. Announce mode to user, then ask for concept description (problem, audience, approach).
- **Standard mode** (default): Read the codebase, README, CLAUDE.md, and existing research/specs (`research/icp.md` or `research/{slug}/icp.md`, `research/enterprise-icp.md` or `research/{slug}/enterprise-icp.md`, `research/mvp-gap.md` or `research/{slug}/mvp-gap.md`) to understand the product.
- Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. In standard mode, scope the full competitive analysis to the first entry in `active_paths` by default. Treat `product_paths[]` entries with `status: deferred` or `status: revisit_candidate` as parked product paths, not as extra full research tracks.

**Provisional product-path evidence.** When a referenced product path is not present in `research/.progress.yaml` (either absent entirely or not in `active_paths` or `product_paths[]`), do not treat it as a canonical active path. Before using it as source context, require an explicit provisional-path evidence reference: a `review-only-approved` alignment page (e.g., `alignment/idea-scope-brief-{topic}.html` with `approval_status: review-only-approved`) that fully renders the proposed path's concept, brief, and manifest entry. If no such evidence exists, ask the user whether to proceed with the path as unverified context or to run `$idea-scope-brief` first.

## Operational Modes

### Mode A: Framework Selection (default)

Activated by `$competitive-analysis`, `$competitive-analysis [concept/category]`, or `$competitive-analysis core`.

Resolve scope, load context, choose mode, recommend frameworks, build an alignment page with selected defaults, and after approval write framework steps plus a synthesis step to `tasks/todo.md`. Stop after queueing the work; `$exec` drives each framework and the final synthesis step.

### Mode B: Synthesis

Activated by `$competitive-analysis --synthesize`.

Read approved framework intermediates, synthesize the canonical competitive analysis and search log, present the report-first alignment page, then write canonical artifacts only after final approval YAML.

---

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

### 1. Establish Product Context

**Standard mode:** Read CLAUDE.md, README, package config, key source files. Read `research/icp.md` (or `research/{slug}/icp.md`) if it exists — the ICP defines the competitive frame. Read `research/enterprise-icp.md` (or `research/{slug}/enterprise-icp.md`) and `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) if they exist. Summarise what the product does, who it's for, and what problem it solves.

**Concept-validation mode:** Use `research/idea-brief.md` when present, otherwise use the concept description from Prerequisites. Summarise what the concept proposes (problem, audience, approach). Confirm with the user before queueing frameworks.

Write the context summary, resolved mode, candidate competitor categories, known competitors from arguments, and source gaps to `research/_working/preliminary-competitive-analysis-research.md` (or `research/{slug}/_working/preliminary-competitive-analysis-research.md`) so framework subskills inherit the same scope.

### 2. Mode A — Recommend Frameworks

Recommend framework defaults based on context:

- **Always default**: `porter-five-forces`, `swot`, and `feature-pricing-matrix`.
- **Default `strategic-group-map`** when the category has more than five likely competitors, multiple segments, multiple buyer types, or the user asks for landscape/positioning whitespace.
- **Concept-validation mode**: keep `porter-five-forces` and `swot` defaulted; use `feature-pricing-matrix` only when named competitors or visible pricing alternatives exist; use `strategic-group-map` when the concept competes across multiple categories.
- **`core` shortcut**: default only `porter-five-forces`, `swot`, and `feature-pricing-matrix`; still allow the user to add `strategic-group-map`.

Build an alignment page that includes: mode, product-path scope, context summary, selected/default frameworks, optional frameworks, execution plan, output paths, source coverage gaps, and approval gates.

After approval, overwrite or update the current execution section of `tasks/todo.md` with the selected framework steps and synthesis step:

```markdown
## Competitive Analysis Framework Execution

- [ ] Run `$competitive-analysis/frameworks/porter-five-forces` — Porter's Five Forces industry structure
- [ ] Run `$competitive-analysis/frameworks/swot` — SWOT from competitive evidence
- [ ] Run `$competitive-analysis/frameworks/strategic-group-map` — Strategic group mapping
- [ ] Run `$competitive-analysis/frameworks/feature-pricing-matrix` — Feature and pricing comparison
- [ ] Synthesize: `$competitive-analysis --synthesize` — Combine framework outputs into research/competitive-analysis.md
```

Only include frameworks the user selected. Always append synthesis last. Do not emit downstream next-step routing in Mode A.

### 3. Framework Execution

Framework subskills read the orchestrator working packet and any existing relevant research, then produce approved intermediate artifacts:

- `research/competitive-analysis-porter-five-forces.md`
- `research/competitive-analysis-swot.md`
- `research/competitive-analysis-strategic-group-map.md`
- `research/competitive-analysis-feature-pricing-matrix.md`

In product-path mode, write under `research/{slug}/`. Subskills follow the staged research workflow, present before writing, and do not emit next-step routing.

### 4. Mode B — Synthesis (`$competitive-analysis --synthesize`)

Read all existing `research/competitive-analysis-*.md` framework outputs for the active scope. At least one approved framework output must exist; if none exist, stop and ask the user to run `$competitive-analysis` to queue framework research.

Synthesize across framework outputs into the canonical deliverables below:

- competitor landscape and categories
- company/product profiles
- observable GTM and pricing patterns
- market gaps and white-space opportunities
- implications for deferred product paths when evidence materially changes them
- concept-validation `## Gap Assessment` when the orchestrator context selected concept-validation mode
- `## Next Steps` using the unchanged routing contract below

Build the report-first alignment page before writing. Only after final compiled YAML approval, write canonical artifacts, archive the working packet, update `research/.progress.yaml` only when active-path evidence changed, and emit downstream next-step routing.

## Deliverables

- `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) — Full competitive landscape: summary, competitor profiles, observable GTM patterns, market gaps, competitive positioning (gaps identified, lessons), signals for downstream research, next steps. In concept-validation mode, includes `## Gap Assessment` section (Market State, Incumbent Quality, Gap Quality, Verdict).
- `research/competitive-analysis-search-log.md` (or `research/{slug}/competitive-analysis-search-log.md`) — Raw research log: every query, findings, source attribution, reasoning
- `research/.progress.yaml` — update only when active-path evidence changes a deferred product path's status, reason, evidence refs, revisit trigger, or next skill. Use `product_paths` terminology instead of branch terminology. When writing manifest entries, include `pipeline_stage: competitive-analysis` on the active path entry.

**Standard mode next steps:** `## Next Steps` section with a **Recommended** item and **Other options** (2–4 alternatives). Choose the recommended item by the first matching condition:

1. IF no `research/journey-map.md`: check `.agents/project.json.enabled_packs` for `customer-lifecycle` — if `customer-lifecycle` is not enabled, recommend `$pack install customer-lifecycle` inside Codex, or `npx skillpacks install customer-lifecycle` from the project shell, first; if `customer-lifecycle` is enabled, recommend `$journey-map` — map the customer and user journey before solution-value decisions, using competitive gaps as inspiration
2. IF no `research/positioning.md`: `$positioning` — frame the market category and alternatives after journey evidence shows where value is delivered
3. IF no `specs/user-flow-*.md`: check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `$pack install product-design` inside Codex, or `npx skillpacks install product-design` from the project shell, first; if `product-design` is enabled, recommend `$user-flow-map [top journey-backed market gap or positioning opportunity]` — map flow structure before UI requirements, layout variants, and production specification
4. IF no `research/value-prop.md` AND solution-customer fit is weak, disputed, or needs explicit fit scoring: `$value-prop-canvas` — validate contested solution-fit evidence as an optional detour
5. IF no `research/gtm.md`: check `.agents/project.json.enabled_packs` for `business-growth` — if `business-growth` is not enabled, recommend `$pack install business-growth` inside Codex, or `npx skillpacks install business-growth` from the project shell, first; if `business-growth` is enabled, recommend `$gtm` — build go-to-market plan leveraging competitive gaps
6. IF codebase exists and no `research/mvp-gap.md`: check `.agents/project.json.enabled_packs` for `business-ops` — if `business-ops` is not enabled, recommend `$pack install business-ops` inside Codex, or `npx skillpacks install business-ops` from the project shell, first; if `business-ops` is enabled, recommend `$mvp-gap` — check if the codebase exploits the gaps found

Use this format in the output:

## Next Steps

**Recommended:** `[first matching command above]` — [reason grounded in this analysis]

Other options:
- `$pack install customer-lifecycle` inside Codex, or `npx skillpacks install customer-lifecycle` from the project shell, or `$journey-map` — map the customer journey to find where competitors fall short (if no `research/journey-map.md` and not recommended; check `.agents/project.json.enabled_packs` for `customer-lifecycle` — if not enabled, recommend `$pack install customer-lifecycle` inside Codex, or `npx skillpacks install customer-lifecycle` from the project shell; if enabled, recommend `$journey-map`)
- `$positioning` — frame the market category and competitive alternatives after journey evidence exists (if no `research/positioning.md` and not recommended)
- check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `$pack install product-design` inside Codex, or `npx skillpacks install product-design` from the project shell, first; if `product-design` is enabled, recommend `$user-flow-map [top journey-backed market gap or positioning opportunity]` — map flow structure before UI requirements, layout variants, and production specification (if positioning exists and not recommended)
- `$value-prop-canvas` — optional detour only when solution-customer fit is weak, disputed, or needs explicit fit scoring before positioning/spec work
- check `.agents/project.json.enabled_packs` for `business-growth` — if `business-growth` is not enabled, recommend `$pack install business-growth` inside Codex, or `npx skillpacks install business-growth` from the project shell, first; if `business-growth` is enabled, recommend `$gtm` — build go-to-market plan leveraging competitive gaps (if no `research/gtm.md` and not recommended)
- check `.agents/project.json.enabled_packs` for `business-ops` — if `business-ops` is not enabled, recommend `$pack install business-ops` inside Codex, or `npx skillpacks install business-ops` from the project shell, first; if `business-ops` is enabled, recommend `$mvp-gap` — check if the codebase exploits the gaps found (if codebase exists, no `research/mvp-gap.md` exists, and not recommended)
- check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `$pack install product-design` inside Codex, or `npx skillpacks install product-design` from the project shell, first; if `product-design` is enabled, recommend `$brainstorm` — generate alternative solution ideas (only if the analysis found multiple plausible market gaps and product direction is still unclear)

Only include items whose conditions are met. Do not recommend brainstorm just because competitive whitespace exists.

**Concept-validation mode next steps:** Use the same Recommended + Other options format, but choose the recommendation from the validated `## Gap Assessment` verdict:

## Next Steps

**Recommended:** [verdict-based next step] — [reason grounded in the gap assessment]

Other options:
- IF verdict is **Proceed to Customer Discovery**: recommend `$customer-discovery` — the competitive gap is validated; define who to build for
- IF verdict is **Pivot concept**: recommend `$brainstorm` — the market has a gap, but this concept needs a different angle before ICP work is useful
- IF verdict is **Abandon**: recommend `No follow-up skill recommended` — the analysis did not find a meaningful gap worth pursuing; include `$brainstorm` only if the user wants to explore a new concept
- `$competitive-analysis` — re-run in standard mode after ICP is defined (only after a proceed verdict and after `$customer-discovery` creates `research/icp.md`)

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Framework execution must use web search extensively — every competitor in a framework output or synthesis must come from a search result.
- Cite sources for competitor facts.
- Be honest about uncertainty.
- Stay in analysis mode — no product changes, architecture, or positioning recommendations. Positioning belongs in `$positioning`.
- Focus on actionable insights over raw lists.
- Do not overwrite existing `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) without asking.
- Prefer recent sources (last 12 months).
- Search breadth over depth initially.
- Present before writing — never write until findings are validated.
- Default Mode A queues framework work only; it must not emit downstream next-step routing.
- Framework subskills must not emit `Recommended next skill` or `Recommended next command`; routing belongs to synthesis after canonical artifacts are approved.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other options.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/competitive-analysis-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
