---
name: porter-five-forces
description: Porter's Five Forces competitive analysis - industry structure, rivalry, substitutes, entrants, buyer power, and supplier power
type: research
version: v0.0
invocation: sub-skill
parent: competitive-analysis
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Porter's Five Forces - Competitive Structure Analysis

Invoke from the parent queue as `/competitive-analysis/frameworks/porter-five-forces`.

This is a framework subskill for `/competitive-analysis`. It analyzes industry structure and competitive pressure. It produces an intermediate artifact for parent synthesis and must not emit downstream next-step routing.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary before creating or updating canonical research files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language.

## Staged Research Workflow

1. **Stage 1 - Research and clarify.** Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-porter-five-forces-research.md`; product-path mode uses `research/{slug}/_working/preliminary-porter-five-forces-research.md`.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page with the full packet, evidence matrix, assumptions/confidence register, source gaps, proposed canonical file changes, and approval gates.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved negative feedback. Apply approved edits first, archive the working packet, write the approved intermediate artifact, and convert the alignment page to `confirmed`.

## Prerequisites

- **Hard**: Parent context from `research/_working/preliminary-competitive-analysis-research.md` or `research/{slug}/_working/preliminary-competitive-analysis-research.md`. If absent, read `research/icp.md` or `research/{slug}/icp.md` plus repo context; if neither exists, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: Existing `research/competitive-analysis-*.md`, `research/customer-feedback.md`, `research/journey-map.md`, specs, and codebase context.

## Product-Path Scope Resolution

Use the parent `competitive-analysis` product-path scope when present. Otherwise resolve scope by reading `research/.progress.yaml`, selecting active non-archived product paths, and writing under `research/{slug}/` only when that path is active or explicitly named.

## Process

1. Load parent context and identify the relevant category, buyer/customer frame, seeded competitors, and source gaps.
2. Use web search to validate the market boundary and identify evidence for each force.
3. Assess:
   - competitive rivalry
   - threat of new entrants
   - threat of substitutes and DIY alternatives
   - buyer/customer power
   - supplier/platform/channel power
4. Score each force as low, moderate, or high pressure with evidence and confidence.
5. Identify the structural constraints, exploitable gaps, and risks that the parent synthesis should carry forward.
6. Present findings before writing and incorporate factual corrections.

## Output

### `research/competitive-analysis-porter-five-forces.md` (or `research/{slug}/competitive-analysis-porter-five-forces.md`)

```markdown
# Porter's Five Forces Analysis

> Based on: [parent context, sources]
> Date: [current date]
> Methodology: Porter's Five Forces

## Market Boundary
[Category, buyer frame, and competitors included/excluded]

## Force Assessment
| Force | Pressure | Evidence | Confidence | Implication |
|-------|----------|----------|------------|-------------|
| Rivalry | Low/Moderate/High | [sources] | High/Medium/Low | [what synthesis should consider] |
| New Entrants | Low/Moderate/High | [sources] | High/Medium/Low | [implication] |
| Substitutes | Low/Moderate/High | [sources] | High/Medium/Low | [implication] |
| Buyer Power | Low/Moderate/High | [sources] | High/Medium/Low | [implication] |
| Supplier Power | Low/Moderate/High | [sources] | High/Medium/Low | [implication] |

## Structural Opportunities
[White-space openings created by force dynamics]

## Structural Risks
[Forces that could undermine the product or category thesis]

## Evidence Matrix
| Claim | Source | Evidence Type | Confidence |
|-------|--------|---------------|------------|
```

## Constraints

- Every competitor or market fact must be source-backed.
- Prefer recent sources from the last 12 months and flag older evidence.
- Do not recommend product features, positioning, architecture, or downstream skills.
- This is a sub-skill; do not emit `Recommended next skill` or `Recommended next command`.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/porter-five-forces-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
