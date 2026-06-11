---
name: swot
description: SWOT competitive analysis - strengths, weaknesses, opportunities, and threats grounded in market evidence
type: research
version: v0.0
invocation: sub-skill
parent: competitive-analysis
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# SWOT - Competitive Evidence Analysis

Invoke from the parent queue as `$competitive-analysis/frameworks/swot`.

This is a framework subskill for `$competitive-analysis`. It translates product, customer, and competitor evidence into a SWOT matrix for parent synthesis. It must not emit downstream next-step routing.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page before creating or updating research files. Do not write synthesized deliverables until the user explicitly approves.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include downstream routing language.

## Staged Research Workflow

1. **Stage 1 - Research and clarify.** Write only `research/_working/preliminary-swot-research.md` or `research/{slug}/_working/preliminary-swot-research.md`.
2. **Stage 2 - Review alignment.** Build the `review` HTML alignment page with evidence, assumptions, source gaps, and approval gates.
3. **Stage 3 - Finalize approved artifacts.** Apply approved edits, archive the working packet, write the approved intermediate artifact, and confirm the alignment page.

## Prerequisites

- **Hard**: Parent context from `research/_working/preliminary-competitive-analysis-research.md` or product-path equivalent. If absent, read `research/icp.md` or product-path equivalent plus repo context; if neither exists, tell the user to run `$competitive-analysis` first and stop.
- **Soft**: Existing competitive framework outputs, `research/customer-feedback.md`, `research/journey-map.md`, specs, and source files that reveal product capability.

## Product-Path Scope Resolution

Use the parent `competitive-analysis` product-path scope when present. Otherwise resolve scope from `research/.progress.yaml` and active non-archived paths before writing under `research/{slug}/`.

## Process

1. Load product/customer context and seeded competitors.
2. Use web search and repo evidence to identify competitor strengths, weaknesses, unmet opportunities, and threats.
3. Separate internal-ish product evidence from external market evidence:
   - strengths and weaknesses must be grounded in actual product/repo/research capability, not aspiration
   - opportunities and threats must be grounded in competitor, market, customer, or trend evidence
4. Score each SWOT item by evidence strength and strategic relevance.
5. Identify contradictions or uncertain assumptions for parent synthesis.
6. Present findings before writing and incorporate factual corrections.

## Output

### `research/competitive-analysis-swot.md` (or `research/{slug}/competitive-analysis-swot.md`)

```markdown
# SWOT Competitive Analysis

> Based on: [parent context, sources]
> Date: [current date]
> Methodology: SWOT

## SWOT Matrix
| Quadrant | Item | Evidence | Confidence | Synthesis Implication |
|----------|------|----------|------------|-----------------------|
| Strength | [item] | [source/repo evidence] | High/Medium/Low | [implication] |
| Weakness | [item] | [source/repo evidence] | High/Medium/Low | [implication] |
| Opportunity | [item] | [source] | High/Medium/Low | [implication] |
| Threat | [item] | [source] | High/Medium/Low | [implication] |

## Strategic Tensions
[Where strengths meet threats, weaknesses block opportunities, or evidence conflicts]

## Evidence Matrix
| Claim | Source | Evidence Type | Confidence |
|-------|--------|---------------|------------|
```

## Constraints

- Do not invent strengths from product aspirations; cite repo/research evidence.
- Do not turn SWOT into positioning or feature recommendations.
- This is a sub-skill; do not emit `Recommended next skill` or `Recommended next command`.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/swot-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
