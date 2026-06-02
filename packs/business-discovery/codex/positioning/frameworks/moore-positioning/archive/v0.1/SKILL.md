---
name: moore-positioning
description: Geoffrey Moore positioning hypothesis — generate Moore template, map evidence per element, identify weakest link
type: research
version: v0.1
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Moore Positioning — Geoffrey Moore Hypothesis

Invoke as `$moore-positioning`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research files.

Do not write or overwrite synthesized deliverables until the user explicitly approves. Raw evidence capture may be persisted before analysis when reproducibility requires it.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML has been provided and the approved artifacts have been written or updated.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Purpose

Applies Geoffrey Moore's positioning template from "Crossing the Chasm" to generate a structured positioning hypothesis, rigorously map evidence status for each element, and identify the weakest link that needs strengthening. This is a disciplined fill-in-the-blanks exercise that exposes gaps in positioning logic. Produces an intermediate artifact for the parent `$positioning` synthesis.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Soft**: Read if they exist:
  - `research/journey-map.md` — context for trigger events and value delivery
  - `research/customer-feedback.md` — customer language for framing
  - `research/positioning-jtbd.md` — job framing to inform target customer
  - `research/positioning-strategic-canvas.md` — differentiation evidence
  - `research/positioning.md` — existing positioning to compare against

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

- Read `research/icp.md` — target customers, pain points, trigger events
- Read `research/competitive-analysis.md` — competitive landscape, alternatives
- Read any prior framework outputs (JTBD, strategic canvas) for evidence accumulation
- Read CLAUDE.md, README, key source files for product understanding

### 2. Generate Moore Template Hypothesis

Fill in the Geoffrey Moore positioning template:

> **For** [target customer]
> **who** [statement of need or opportunity]
> **the** [product name] **is a** [product category]
> **that** [key benefit — compelling reason to buy]
> **Unlike** [primary competitive alternative]
> **our product** [statement of primary differentiation]

Generate 2-3 candidate hypotheses with different framings:
- Vary the target customer specificity
- Vary the product category (existing, subcategory, new)
- Vary the competitive alternative anchor
- Vary the differentiation angle

### 3. Map Evidence Status Per Element

For each element of the template, assess evidence strength:

| Element | Content | Evidence Source | Confidence | Gap |
|---------|---------|----------------|------------|-----|
| Target customer | [from template] | [which research file] | Strong/Moderate/Weak | [what's missing] |
| Need/opportunity | [from template] | [source] | [confidence] | [gap] |
| Product category | [from template] | [source] | [confidence] | [gap] |
| Key benefit | [from template] | [source] | [confidence] | [gap] |
| Competitive alt. | [from template] | [source] | [confidence] | [gap] |
| Differentiation | [from template] | [source] | [confidence] | [gap] |

Use WebSearch (2-4 queries) to validate category framing and competitive alternative accuracy:
- "[product category] definition", "[primary alternative] positioning"
- "[category] market leader", "who competes with [alternative]"

### 4. Identify Weakest Link

Determine which template element has the weakest evidence or most problematic framing:

- **Target too broad?** — Positioning that works for everyone works for no one.
- **Need too generic?** — "Saves time" is not a positioning-grade need.
- **Category unclear?** — If buyers don't recognize the category, they can't evaluate.
- **Benefit not unique?** — If alternatives also claim this benefit, it's not positioning.
- **Wrong competitive anchor?** — If buyers don't actually consider this alternative, the "unlike" fails.
- **Differentiation unproven?** — Claims without evidence are aspirational, not positioning.

Present findings. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "The weakest link in this positioning hypothesis is [element] because [reason]. Which framing resonates best, and what evidence or insight can strengthen the weak link?"

### 5. Recommend Strongest Hypothesis

Select the strongest candidate and explain:
- Why it outperforms alternatives
- What evidence supports each element
- What remains unproven and how to resolve it
- How it compares to existing positioning (if any)

### 6. Write Output

Only after user approval.

## Output

### `research/positioning-moore.md` (or `research/{slug}/positioning-moore.md`)

```markdown
# Moore Positioning Hypothesis

> Based on: research/icp.md, research/competitive-analysis.md[, prior framework outputs]
> Date: [current date]
> Methodology: Geoffrey Moore "Crossing the Chasm" positioning template

## Recommended Hypothesis

> **For** [target customer]
> **who** [statement of need or opportunity]
> **the** [product name] **is a** [product category]
> **that** [key benefit — compelling reason to buy]
> **Unlike** [primary competitive alternative]
> **our product** [statement of primary differentiation]

## Evidence Map

| Element | Content | Source | Confidence | Gap |
|---------|---------|--------|------------|-----|
| Target customer | [content] | [source] | [S/M/W] | [gap or "none"] |
| Need/opportunity | [content] | [source] | [S/M/W] | [gap] |
| Product category | [content] | [source] | [S/M/W] | [gap] |
| Key benefit | [content] | [source] | [S/M/W] | [gap] |
| Competitive alt. | [content] | [source] | [S/M/W] | [gap] |
| Differentiation | [content] | [source] | [S/M/W] | [gap] |

## Weakest Link Analysis

**Weakest element**: [element name]
**Why it's weak**: [explanation]
**How to strengthen**: [specific action — more research, customer interviews, product changes]
**Risk if unresolved**: [what happens if this stays weak]

## Alternative Hypotheses Considered

### Hypothesis B
> [full Moore template]

**Why not recommended**: [reason]

### Hypothesis C
> [full Moore template]

**Why not recommended**: [reason]

## Implications for Positioning Synthesis

[How this Moore analysis should influence the final positioning — which elements are strongest, where the template reveals gaps, and what it suggests for the canonical positioning statement]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable work goes in `tasks/todo.md`.
- Human-only external actions go in `tasks/manual-todo.md` with blocking/dependency annotations.
- Condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.

## Constraints

- **Intermediate artifact only.** This produces `research/positioning-moore.md`, not the canonical `research/positioning.md`.
- **Evidence mapping is non-negotiable.** Every template element must have a cited source and confidence level.
- **Multiple hypotheses required.** Never present a single option — the comparison reveals trade-offs.
- **Weakest link must be actionable.** Don't just identify the weakness — recommend how to fix it.
- **Present before writing.** Never write output files until findings are validated.
- **Accumulate prior framework evidence.** If JTBD or strategic canvas outputs exist, use them as evidence sources.

## Alignment Page

When this skill produces durable deliverables, build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md` in the parent skill's directory. Output: `alignment/moore-positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
