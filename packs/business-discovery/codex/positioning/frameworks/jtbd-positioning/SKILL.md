---
name: jtbd-positioning
description: Jobs-to-be-Done positioning analysis — identify primary job, map functional/social/emotional dimensions, position around job outcome
type: research
version: v0.0
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# JTBD Positioning — Jobs-to-be-Done Analysis

Invoke as `$jtbd-positioning`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research files.

Do not write or overwrite synthesized deliverables until the user explicitly approves. Raw evidence capture may be persisted before analysis when reproducibility requires it.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML has been provided and the approved artifacts have been written or updated.

## Purpose

Applies Clayton Christensen's Jobs-to-be-Done framework to positioning. Instead of positioning around features or competitive differences, positions the product around the *job outcome* the customer is trying to achieve. Produces an intermediate artifact that feeds into the parent `$positioning` synthesis.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Hard**: `research/journey-map.md` (or `research/{slug}/journey-map.md`) must exist. If not, tell the user to run `$journey-map` first and stop.
- **Soft**: Read if they exist:
  - `research/customer-feedback.md` — real language about what customers hire the product to do
  - `research/positioning.md` — existing positioning to build upon

## Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path.
2. If `$ARGUMENTS` names only an archived path, stop and warn.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths`.
4. If active product paths exist in the manifest, use those paths. Ask when multiple active paths exist.
5. If no active manifest target exists, list non-archived product directories under `research/`. Auto-select only when exactly one exists.
6. If no product directories exist, use flat `research/` single-product mode.

## Process

### 1. Load Context

- Read `research/icp.md` — segments, pain points, trigger events
- Read `research/competitive-analysis.md` — how alternatives frame themselves
- Read `research/journey-map.md` — where value is delivered, switching triggers
- Read `research/customer-feedback.md` if it exists — actual hiring/firing language

### 2. Identify the Primary Job

Research and determine the core job the customer is trying to get done:

- Use WebSearch with 3-5 queries targeting job language in the domain
- Distinguish the **core functional job** from related consumption-chain jobs
- Frame as: "When [situation], I want to [motivation], so I can [expected outcome]"
- Identify the job at the right level of abstraction — not too broad (meaningless), not too narrow (feature-level)

Validate with user. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Here is the primary job the evidence supports. Is the abstraction level right? Are there competing job framings I should consider?"

### 3. Map Job Dimensions

For the primary job, map three dimensions:

**Functional dimension** — What the customer is practically trying to accomplish:
- Core steps in getting the job done
- Speed, accuracy, reliability requirements
- Where current solutions break down

**Social dimension** — How the customer wants to be perceived:
- Professional identity alignment
- Team/peer perception
- Status and credibility implications

**Emotional dimension** — How the customer wants to feel:
- Confidence and control
- Reduced anxiety or frustration
- Sense of progress

### 4. Identify Job Outcome Metrics

Define success metrics from the customer's perspective (not product metrics):
- **Speed**: How quickly can the job be completed?
- **Accuracy**: How reliably does the job get done right?
- **Effort**: How much work does the customer have to put in?
- **Satisfaction**: How good does the outcome feel?

Map where alternatives fail on these metrics.

### 5. Position Around Job Outcome

Synthesize positioning that frames the product as the best way to achieve the desired job outcome:

- What is the job the product is hired for?
- What makes this product uniquely suited to the job?
- What outcome does the customer achieve that alternatives cannot deliver?
- Which dimension (functional/social/emotional) is the strongest positioning angle?

Validate with user. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "This JTBD positioning emphasizes [dimension]. Does that match where you see the strongest pull from customers?"

### 6. Write Output

Only after user approval.

## Output

### `research/positioning-jtbd.md` (or `research/{slug}/positioning-jtbd.md`)

```markdown
# JTBD Positioning Analysis

> Based on: research/icp.md, research/competitive-analysis.md, research/journey-map.md
> Date: [current date]
> Methodology: Jobs-to-be-Done (Clayton Christensen / Tony Ulwick)

## Primary Job Statement

When [situation], I want to [motivation], so I can [expected outcome].

## Job Dimensions

### Functional
| Step | Current Solution | Pain Point | Our Advantage |
|------|-----------------|------------|---------------|
| [step] | [how done today] | [what breaks] | [how we're better] |

### Social
- [social dimension 1]
- [social dimension 2]

### Emotional
- [emotional dimension 1]
- [emotional dimension 2]

## Outcome Metrics

| Metric | Customer Need | Alternative Performance | Our Performance |
|--------|--------------|------------------------|-----------------|
| Speed | [need] | [how alternatives do] | [how we do] |
| Accuracy | [need] | [performance] | [performance] |
| Effort | [need] | [performance] | [performance] |

## Positioning Angle

**Lead dimension**: [Functional / Social / Emotional]
**Job outcome framing**: [one sentence: how to position around the job outcome]
**Evidence strength**: [Strong / Moderate / Weak — with justification]

## Competitive Alternatives by Job

| Alternative | Which Job It Serves | Where It Fails |
|-------------|--------------------|--------------------|
| [alternative] | [job framing] | [gap] |

## Implications for Positioning Synthesis

[How this JTBD analysis should influence the final positioning statement — what it suggests for market category, target segment, and key differentiator]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable work goes in `tasks/todo.md`.
- Human-only external actions go in `tasks/manual-todo.md` with blocking/dependency annotations.
- Condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.

## Constraints

- **Intermediate artifact only.** This produces `research/positioning-jtbd.md`, not the canonical `research/positioning.md`.
- **Requires journey evidence.** JTBD positioning without understanding the customer journey is speculative.
- **Job abstraction level matters.** Challenge yourself: is the job too broad or too narrow?
- **Present before writing.** Never write output files until findings are validated.
- **Customer language preferred.** Use actual customer words from feedback/interviews when available.

## Alignment Page

When this skill produces durable deliverables, build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md` in the parent skill's directory. Output: `alignment/jtbd-positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
