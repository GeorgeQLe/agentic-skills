---
name: lean-canvas
description: One-page Lean Canvas business model synthesis (Ash Maurya)
type: research
version: v0.2
argument-hint: "[optional: focus area e.g. \"revenue model\", \"channels\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Lean Canvas — One-Page Business Model Synthesis

Invoke as `$lean-canvas`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Synthesizes upstream research into a one-page Lean Canvas (Ash Maurya methodology). This is an optional AFPS detour for business-model synthesis when revenue, channels, cost, defensibility, or unfair-advantage assumptions are material risks. It pulls from ICP, competitive analysis, journey, positioning, and value proposition research to create a cohesive business model hypothesis. Revenue Streams and Cost Structure are marked as hypotheses to be validated by `$monetization`.

Default stance: assume the user has no insider knowledge of the market. The canvas must stand on research, customer evidence, and codebase reality before asking for user input. Ask for corrections, proprietary differentiators, and hard constraints, not intuition.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Soft**: Read these if they exist:
  - `research/competitive-analysis.md` — competitor landscape, channel insights, business model patterns
  - `research/journey-map.md` — lifecycle moments where value, conversion, and retention occur
  - `research/positioning.md` — unique value proposition, market category, competitive alternatives
  - `research/value-prop.md` — value propositions mapped to customer segments
  - `research/concept-brief.md` — product concept, solution approach, feature set

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context

- Read `research/icp.md` — ICP segments, pain points, jobs to be done, trigger events
- Read `research/competitive-analysis.md` if it exists — competitor landscape, channel strategies, business model patterns
- Read `research/positioning.md` if it exists — unique attributes, value mapping, market category, competitive alternatives
- Read `research/value-prop.md` if it exists — value propositions per segment
- Read `research/concept-brief.md` if it exists — product concept, solution approach, features
- Read CLAUDE.md, README, and key source files for product context

### 2. Research Lean Canvas Methodology

Use WebSearch with **4-6 targeted queries**:

1. **Domain-specific canvases** — "lean canvas [domain]", "lean canvas examples [category]"
2. **Methodology** — "Ash Maurya lean canvas best practices", "lean canvas vs business model canvas differences"
3. **Business models** — "one page business model [industry]", "[category] business model patterns"
4. **Revenue patterns** — "[category] revenue models", "[domain] pricing strategies"
5. **Channel strategies** — "[category] customer acquisition channels", "[domain] distribution strategies"

### 3. Synthesize Canvas Sections

Map each Lean Canvas section from upstream research:

- **Problem** — Top 3 problems from ICP pain points. Source: `research/icp.md`
- **Customer Segments** — Primary and secondary segments from ICP. Source: `research/icp.md`
- **Unique Value Proposition** — From positioning UVP statement, or `research/value-prop.md` if positioning doesn't exist. This is the single clear compelling message that states why you are different and worth buying.
- **Solution** — Top 3 features or capabilities that address the top 3 problems. Source: `research/concept-brief.md` or product codebase.
- **Channels** — Path to customers. Source: `research/competitive-analysis.md` channel insights, ICP "where they hang out."
- **Revenue Streams** — **HYPOTHESIS** — mark "to be validated by `$monetization`". Infer from competitive analysis pricing patterns and positioning (premium vs. value).
- **Cost Structure** — **HYPOTHESIS** — mark "to be validated by `$monetization`". Infer from solution complexity, channel costs, and competitive analysis.
- **Key Metrics** — From `research/metrics.md` if it exists, otherwise hypothesize key pirate metrics (AARRR) relevant to the business model.
- **Unfair Advantage** — From positioning unique attributes or competitive moat. Something that cannot be easily copied or bought.

If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "Here's the Lean Canvas synthesized from research. Which sections need correction, stronger grounding, or are missing critical context?"

### 4. Validate Hypotheses

For sections marked as hypotheses (Revenue Streams, Cost Structure, and any others with low evidence), note:
- **Confidence level**: High / Medium / Low
- **What would validate** each hypothesis
- **What would invalidate** each hypothesis
- **Riskiest assumption** within each section

If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "These are the unvalidated hypotheses. Which are highest risk and should be tested first?"

### 5. Populate Next Steps

Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2-4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** `$ux-variations [business-model-informed product direction]` — return to the default AFPS prototype path after resolving material business-model assumptions

Other options:
- IF Revenue/Cost hypotheses need validation: `$monetization` — Validate revenue model and cost structure hypotheses
- IF riskiest hypothesis identified: `$experiment [riskiest hypothesis]` — Test the riskiest assumption with a structured experiment
- IF no `research/positioning.md`: `$positioning` — Establish strategic positioning to strengthen UVP and Unfair Advantage sections
- IF no `research/journey-map.md`: `$journey-map` — Map the customer journey before continuing UX, growth, or spec work

### 6. Write Output

Only after the user confirms, write the output files.

### 7. Downstream Impact Check

After writing, check for downstream research documents that may be affected.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/journey-map.md`
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on sections that reference business model, revenue, channels, or customer segments
2. Identify conflicts where the downstream document's assumptions don't align with the canvas
3. Note each conflict: file, section, stale claim, what it should now say

**Classify the impact**:
- **None**: No downstream docs exist, or no conflicts. Skip display.
- **Minor** (1-2 small conflicts): Display inline.
- **Major** (3+ conflicts OR customer segments changed, revenue model shifted, channel strategy changed): Display and recommend `$reconcile-research`.

## Output

### `research/lean-canvas.md` (or `research/{app}/lean-canvas.md`)

```markdown
# Lean Canvas

> Based on: research/icp.md[, research/competitive-analysis.md, research/positioning.md, research/value-prop.md, research/concept-brief.md]
> Date: [current date]
> Methodology: Lean Canvas (Ash Maurya)

## Summary

[2-3 sentence business model thesis — who the customer is, what problem you solve, how you make money, and what makes this defensible]

## Lean Canvas

### Problem

Top 3 problems:
1. [problem 1] — _Source: [reference]_
2. [problem 2] — _Source: [reference]_
3. [problem 3] — _Source: [reference]_

**Existing alternatives**: [how customers solve these problems today]

### Customer Segments

**Primary segment**: [segment description]
**Early adopters**: [most acute subset — who you target first]

_Source: research/icp.md_
_Confidence: [High/Medium/Low]_

### Unique Value Proposition

**Single clear compelling message**:
> [UVP statement]

**High-level concept**: [X for Y analogy, if applicable]

_Source: [research/positioning.md or research/value-prop.md]_
_Confidence: [High/Medium/Low]_

### Solution

Top 3 features addressing top 3 problems:
1. [feature 1] → solves [problem 1]
2. [feature 2] → solves [problem 2]
3. [feature 3] → solves [problem 3]

_Source: [research/concept-brief.md or product codebase]_
_Confidence: [High/Medium/Low]_

### Channels

**Path to customers**:
- [channel 1] — [rationale]
- [channel 2] — [rationale]
- [channel 3] — [rationale]

_Source: [research/competitive-analysis.md, research/icp.md]_
_Confidence: [High/Medium/Low]_

### Revenue Streams

> **HYPOTHESIS** — to be validated by `$monetization`

- [revenue stream 1] — [pricing model]
- [revenue stream 2] — [pricing model]

**Price anchoring**: [what customers pay for alternatives today]

_Source: [inferred from competitive analysis and positioning]_
_Confidence: [High/Medium/Low]_

### Cost Structure

> **HYPOTHESIS** — to be validated by `$monetization`

**Fixed costs**:
- [cost 1]
- [cost 2]

**Variable costs**:
- [cost 1]
- [cost 2]

_Source: [inferred from solution complexity and channel costs]_
_Confidence: [High/Medium/Low]_

### Key Metrics

- [metric 1] — [what it measures and why it matters]
- [metric 2] — [what it measures and why it matters]
- [metric 3] — [what it measures and why it matters]

_Source: [research/metrics.md or hypothesized]_
_Confidence: [High/Medium/Low]_

### Unfair Advantage

[Something that cannot be easily copied or bought]

- [advantage 1] — [why it's defensible]
- [advantage 2] — [why it's defensible]

_Source: [research/positioning.md unique attributes or competitive moat]_
_Confidence: [High/Medium/Low]_

## Hypothesis Register

| Hypothesis | Section | Confidence | Validation Method | Status |
|-----------|---------|------------|-------------------|--------|
| [hypothesis 1] | Revenue Streams | [H/M/L] | [how to test] | Unvalidated |
| [hypothesis 2] | Cost Structure | [H/M/L] | [how to test] | Unvalidated |
| [hypothesis 3] | [section] | [H/M/L] | [how to test] | Unvalidated |

**Riskiest hypothesis**: [which hypothesis, if wrong, would most undermine the business model]

## Strategic Implications

### Business Model Type
[What type of business model this canvas describes — marketplace, SaaS, transactional, etc.]

### Key Dependencies
[What must be true for this business model to work]

### Biggest Risks
[Top 2-3 risks to the business model thesis]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote]"
   - **Now**: [what the canvas says instead]

[For Major only:]
> **Recommended action**: Run `$reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

**Recommended:** `$journey-map` — always the natural next step after synthesizing the business model

Other options:
- [conditional items from step 5]
```

### `research/lean-canvas-search-log.md` (or `research/{app}/lean-canvas-search-log.md`)

Raw research log — queries, findings, evidence for each canvas section decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires ICP.** A business model without customer understanding is fiction.
- **Synthesis-first.** Every canvas section should trace to upstream research, not invented from scratch. If a section cannot be grounded in existing research, mark it as a hypothesis with Low confidence.
- **Mark hypotheses honestly.** Revenue Streams and Cost Structure are hypotheses until `$monetization` validates them. Any other section without strong evidence should also be flagged.
- **Present before writing.** Never write output files until the canvas has been presented and validated by the user.
- **Do not overwrite existing `research/lean-canvas.md`** without asking the user first.
- **Lean Canvas ≠ full business plan.** This is a one-page hypothesis document. Do not expand it into a detailed business plan — that's a different deliverable.
- **One canvas per product.** Don't try to capture multiple business models in a single canvas. If the product has multiple revenue models, pick the primary one and note alternatives.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/lean-canvas-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
