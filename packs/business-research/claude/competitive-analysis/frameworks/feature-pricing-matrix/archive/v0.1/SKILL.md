---
name: feature-pricing-matrix
description: Feature and pricing matrix competitive analysis - compare capabilities, packages, proof points, and pricing models
type: research
version: v0.1
invocation: sub-skill
parent: competitive-analysis
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Feature/Pricing Matrix - Competitive Offer Analysis

Invoke from the parent queue as `/competitive-analysis/frameworks/feature-pricing-matrix`.

This is a framework subskill for `/competitive-analysis`. It compares competitor packaging, capabilities, pricing, proof points, and visible GTM constraints for parent synthesis. It must not emit downstream next-step routing.

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

## Prerequisites

- **Hard**: Parent context from `research/_working/preliminary-competitive-analysis-research.md` or product-path equivalent. If absent, read `research/icp.md` or product-path equivalent plus repo context; if neither exists, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: Existing competitive framework outputs, landing pages, pricing pages, review sites, product docs, customer feedback, and source files.

## Product-Path Scope Resolution

Use the parent `competitive-analysis` product-path scope when present. Otherwise resolve scope from `research/.progress.yaml` and active non-archived paths before writing under `research/{slug}/`.

## Process

1. Load seeded competitors and use web search to find direct, indirect, incumbent, emerging, and DIY alternatives.
2. Collect visible pricing, packaging, feature, integration, platform, target segment, and proof-point evidence.
3. Build a comparison matrix that separates observed facts from inferred gaps.
4. Identify pricing gaps, packaging trade-offs, missing capabilities, over-served features, and proof-point patterns.
5. Flag unavailable pricing or gated sales pages as evidence gaps rather than guessing.
6. Present findings before writing and incorporate factual corrections.

## Output

### `research/competitive-analysis-feature-pricing-matrix.md` (or `research/{slug}/competitive-analysis-feature-pricing-matrix.md`)

```markdown
# Feature And Pricing Matrix

> Based on: [parent context, sources]
> Date: [current date]
> Methodology: Feature/Pricing Matrix

## Competitor Matrix
| Competitor | Segment | Core Features | Integrations | Pricing Model | Public Price | Proof Points | Evidence |
|------------|---------|---------------|--------------|---------------|--------------|--------------|----------|

## Gaps And Patterns
| Pattern | Evidence | Opportunity/Risk | Confidence |
|---------|----------|------------------|------------|

## Source Gaps
| Competitor | Missing Evidence | Why It Matters | Follow-up Query |
|------------|------------------|----------------|-----------------|

## Evidence Matrix
| Claim | Source | Evidence Type | Confidence |
|-------|--------|---------------|------------|
```

## Constraints

- Never invent pricing. Use `not public`, `sales-gated`, or `not found` when needed.
- Keep GTM observations factual; strategy belongs to `/gtm`.
- This is a sub-skill; do not emit `Recommended next skill` or `Recommended next command`.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/feature-pricing-matrix-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
