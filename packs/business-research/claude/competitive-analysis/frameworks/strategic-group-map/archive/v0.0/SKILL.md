---
name: strategic-group-map
description: Strategic group map competitive analysis - cluster competitors by market axes and identify segment whitespace
type: research
version: v0.0
invocation: sub-skill
parent: competitive-analysis
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Strategic Group Map - Competitive Cluster Analysis

Invoke from the parent queue as `/competitive-analysis/frameworks/strategic-group-map`.

This is a framework subskill for `/competitive-analysis`. It maps competitors into strategic groups using evidence-backed axes so the parent synthesis can reason about clusters, crowded zones, and whitespace. It must not emit downstream next-step routing.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page before creating or updating research files. Do not write synthesized deliverables until the user explicitly approves.

## Staged Research Workflow

1. **Stage 1 - Research and clarify.** Write only `research/_working/preliminary-strategic-group-map-research.md` or `research/{slug}/_working/preliminary-strategic-group-map-research.md`.
2. **Stage 2 - Review alignment.** Build the `review` HTML alignment page with map axes, competitor placements, evidence, assumptions, and approval gates.
3. **Stage 3 - Finalize approved artifacts.** Apply approved edits, archive the working packet, write the approved intermediate artifact, and confirm the alignment page.

## Prerequisites

- **Hard**: Parent context from `research/_working/preliminary-competitive-analysis-research.md` or product-path equivalent. If absent, read `research/icp.md` or product-path equivalent plus repo context; if neither exists, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: Existing competitive framework outputs, positioning research, journey research, customer feedback, and specs.

## Product-Path Scope Resolution

Use the parent `competitive-analysis` product-path scope when present. Otherwise resolve scope from `research/.progress.yaml` and active non-archived paths before writing under `research/{slug}/`.

## Process

1. Load seeded competitors and use web search to broaden the competitor list enough for meaningful clustering.
2. Select 2-3 evidence-backed axes, such as:
   - enterprise vs SMB
   - high-service vs self-serve
   - broad platform vs focused workflow
   - premium vs low-cost
   - incumbent suite vs specialist tool
3. Place competitors on the map only when evidence supports their position.
4. Identify clusters, crowded zones, underserved segments, and competitors that blur categories.
5. Record axis uncertainty and alternative maps when the market does not fit one clean 2x2.
6. Present findings before writing and incorporate factual corrections.

## Output

### `research/competitive-analysis-strategic-group-map.md` (or `research/{slug}/competitive-analysis-strategic-group-map.md`)

```markdown
# Strategic Group Map

> Based on: [parent context, sources]
> Date: [current date]
> Methodology: Strategic Group Mapping

## Axis Selection
| Axis | Why It Matters | Evidence | Confidence |
|------|----------------|----------|------------|

## Competitor Placement
| Competitor | Axis 1 Position | Axis 2 Position | Group | Evidence | Confidence |
|------------|-----------------|-----------------|-------|----------|------------|

## Strategic Groups
[Named clusters, shared traits, and how they compete]

## Whitespace And Crowded Zones
[Underserved spaces and over-served clusters]

## Evidence Matrix
| Claim | Source | Evidence Type | Confidence |
|-------|--------|---------------|------------|
```

## Constraints

- Do not force a 2x2 when the market needs a table or multiple maps; explain the limitation.
- Competitor placement must cite evidence.
- This is a sub-skill; do not emit `Recommended next skill` or `Recommended next command`.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/strategic-group-map-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
