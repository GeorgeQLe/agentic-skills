---
name: feature-pricing-matrix
description: Feature and pricing matrix competitive analysis - compare capabilities, packages, proof points, and pricing models
type: research
version: v0.0
invocation: sub-skill
parent: competitive-analysis
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Feature/Pricing Matrix - Competitive Offer Analysis

Invoke from the parent queue as `/competitive-analysis/frameworks/feature-pricing-matrix`.

This is a framework subskill for `/competitive-analysis`. It compares competitor packaging, capabilities, pricing, proof points, and visible GTM constraints for parent synthesis. It must not emit downstream next-step routing.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page before creating or updating research files. Do not write synthesized deliverables until the user explicitly approves.

## Staged Research Workflow

1. **Stage 1 - Research and clarify.** Write only `research/_working/preliminary-feature-pricing-matrix-research.md` or `research/{slug}/_working/preliminary-feature-pricing-matrix-research.md`.
2. **Stage 2 - Review alignment.** Build the `review` HTML alignment page with comparison tables, evidence, source gaps, and approval gates.
3. **Stage 3 - Finalize approved artifacts.** Apply approved edits, archive the working packet, write the approved intermediate artifact, and confirm the alignment page.

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
