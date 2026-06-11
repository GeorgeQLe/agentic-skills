---
name: obviously-awesome
description: April Dunford Obviously Awesome methodology — 5-step positioning from real customer evidence
type: research
version: v0.1
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Obviously Awesome — April Dunford Positioning Methodology

Invoke as `$obviously-awesome`.

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

Applies the full 5-step Obviously Awesome methodology (April Dunford) as a standalone deep-dive framework. While the parent `$positioning` skill uses Obviously Awesome as its primary methodology, this child skill goes deeper with rigorous customer-evidence grounding, multiple candidate evaluations per step, and explicit evidence quality assessment. Requires real customer evidence. Produces an intermediate artifact for the parent `$positioning` synthesis.

## Prerequisites

- **HARD**: `research/customer-feedback.md` (or `research/{slug}/customer-feedback.md`) must exist with real customer evidence (interviews, survey data, support tickets, reviews, or usage data). If not, stop and tell the user: "Obviously Awesome requires real customer evidence. Run `$customer-feedback` first to gather and synthesize customer data, then re-run `$obviously-awesome`."
- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Soft**: Read if they exist:
  - `research/journey-map.md` — value delivery moments
  - `research/positioning-jtbd.md` — job framing for context
  - `research/positioning-strategic-canvas.md` — differentiation evidence
  - `research/positioning-moore.md` — hypothesis to validate against
  - `research/positioning.md` — existing positioning to improve upon

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

- Read `research/customer-feedback.md` — this is the PRIMARY input. Extract:
  - What customers say they switched from (competitive alternatives)
  - What customers say is different about this product (unique attributes)
  - What value customers report getting (in their own words)
  - Who the happiest/most engaged customers are (target segment signals)
  - How customers describe the product to others (market category clues)
- Read `research/icp.md` — segments, pain points
- Read `research/competitive-analysis.md` — landscape context
- Read prior framework outputs if available

### 2. Step 1 — Competitive Alternatives (Customer-Evidenced)

Unlike the parent skill's broad approach, ground competitive alternatives exclusively in customer evidence:

- What did current customers use BEFORE this product?
- What would they switch to if this product disappeared?
- What do prospects compare this product to during evaluation?

Sources (from customer-feedback.md):
- Switch stories: "I used to use [X] but..."
- Comparison mentions: "Compared to [X], this..."
- Evaluation context: "I was looking at [X] and [Y] when..."

Present findings. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "These are the competitive alternatives customers actually mention. Any that are missing from our customer data that you know prospects consider?"

### 3. Step 2 — Unique Attributes (Customer-Validated)

For each competitive alternative, identify attributes customers explicitly value that alternatives lack:

- Only include attributes customers have MENTIONED or demonstrated through behavior
- Exclude attributes the team believes are unique but customers haven't validated
- Distinguish between "mentioned unprompted" (strong) and "agreed when asked" (moderate)

| Attribute | Customer Evidence | Strength | Alternative Lacking |
|-----------|------------------|----------|-------------------|
| [attribute] | [exact quote or behavior] | Unprompted/Prompted | [which alternatives] |

If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "These are attributes customers validate as unique. Any proprietary capabilities that customers haven't articulated but demonstrably use?"

### 4. Step 3 — Value Mapping (Customer Words)

Map each unique attribute to the value customers report, using their language:

| Unique Attribute | Customer-Stated Value | Customer Quote | Value Type |
|-----------------|----------------------|----------------|------------|
| [attribute] | [value in their words] | "[exact quote]" | Time/Money/Risk/Capability/Quality |

Identify the **primary value cluster** — the value theme that appears most frequently across customer segments.

### 5. Step 4 — Target Segment (Best-Fit Customers)

From customer evidence, identify who gets the most value:

- Which customers are most engaged/retained?
- Which customers would be most disappointed without the product?
- Which customers refer others most frequently?
- What do these best-fit customers have in common?

Define the segment with observable, actionable characteristics (not demographics alone):
- Company stage, size, or type
- Specific pain or trigger event
- Technology stack or workflow context
- Buying behavior or evaluation pattern

If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "This is the segment the customer data supports as best-fit. Does it match your retention and expansion data?"

### 6. Step 5 — Market Category (Customer Framing)

How do customers describe what this product IS?

- How do they explain it to colleagues?
- What category do they put it in mentally?
- What search terms did they use to find it?
- What budget does it come from?

Evaluate market category options:
| Category Option | Customer Evidence | Competitive Context | Trade-off |
|----------------|------------------|--------------------|-----------|
| [option] | [how customers frame it] | [who you'd compete against] | [what you gain/lose] |

Use WebSearch (2-3 queries) to validate category framing externally.

### 7. Synthesize and Assess Evidence Quality

Combine all five steps and explicitly rate evidence quality:

| Step | Conclusion | Evidence Quality | Confidence | Gap |
|------|-----------|-----------------|------------|-----|
| Competitive alternatives | [summary] | [Strong/Moderate/Weak] | [H/M/L] | [what's missing] |
| Unique attributes | [summary] | [S/M/W] | [H/M/L] | [gap] |
| Value | [summary] | [S/M/W] | [H/M/L] | [gap] |
| Target segment | [summary] | [S/M/W] | [H/M/L] | [gap] |
| Market category | [summary] | [S/M/W] | [H/M/L] | [gap] |

Present full synthesis. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Here is the complete Obviously Awesome analysis grounded in customer evidence. Which steps have weak evidence that needs strengthening before this feeds into final positioning?"

### 8. Write Output

Only after user approval.

## Output

### `research/positioning-obviously-awesome.md` (or `research/{slug}/positioning-obviously-awesome.md`)

```markdown
# Obviously Awesome Positioning Analysis

> Based on: research/customer-feedback.md, research/icp.md, research/competitive-analysis.md
> Date: [current date]
> Methodology: Obviously Awesome (April Dunford) — customer-evidence-grounded
> HARD PREREQ: real customer evidence in customer-feedback.md

## Evidence Quality Summary

| Step | Evidence Quality | Sample Size | Confidence |
|------|-----------------|-------------|------------|
| Competitive alternatives | [S/M/W] | [n customers] | [H/M/L] |
| Unique attributes | [S/M/W] | [n mentions] | [H/M/L] |
| Value | [S/M/W] | [n data points] | [H/M/L] |
| Target segment | [S/M/W] | [n customers in segment] | [H/M/L] |
| Market category | [S/M/W] | [n category signals] | [H/M/L] |

## Step 1: Competitive Alternatives (Customer-Evidenced)

| Alternative | How Customers Mention It | Frequency | Context |
|-------------|-------------------------|-----------|---------|
| [alt] | "[customer quote]" | [n mentions] | [switch/compare/evaluate] |

**Primary alternative**: [most frequently mentioned]

## Step 2: Unique Attributes (Customer-Validated)

| Attribute | Customer Evidence | Signal Strength | Alternatives Lacking |
|-----------|------------------|-----------------|---------------------|
| [attribute] | "[quote]" | Unprompted/Prompted | [which] |

**Excluded (unvalidated by customers)**:
- [attribute team believes is unique but customers haven't confirmed]

## Step 3: Value Mapping (Customer Words)

| Unique Attribute | Customer-Stated Value | Quote | Value Type |
|-----------------|----------------------|-------|------------|
| [attr] | [value] | "[exact words]" | [type] |

**Primary value cluster**: [theme]

## Step 4: Best-Fit Target Segment

**Segment definition**: [observable characteristics]
**Evidence**: [engagement, retention, referral data]
**Common traits**:
- [trait 1]
- [trait 2]
- [trait 3]

**Alignment with ICP**: [how this narrows or confirms the ICP]

## Step 5: Market Category

**Recommended category**: [name]
**Customer framing evidence**: [how they describe it]
**Strategy**: [existing/subcategory/new]

### Categories Considered

| Category | Customer Evidence | Competitive Implication | Verdict |
|----------|------------------|------------------------|---------|
| [category] | [evidence] | [who you'd face] | [chosen/rejected + why] |

## Positioning Hypothesis (Obviously Awesome Format)

**For** [target segment from step 4]
**who** [primary need evidenced in customer feedback]
**[product] is a** [market category from step 5]
**that** [primary value cluster from step 3]
**Unlike** [primary alternative from step 1]
**[product]** [key differentiation from step 2]

## Evidence Gaps and Recommendations

| Gap | Impact | How to Fill |
|-----|--------|-------------|
| [what's missing] | [how it weakens positioning] | [specific action] |

## Implications for Positioning Synthesis

[How this customer-grounded analysis should influence the final positioning — where it confirms or challenges other framework outputs, and what it means for the canonical positioning statement]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable work goes in `tasks/todo.md`.
- Human-only external actions go in `tasks/manual-todo.md` with blocking/dependency annotations.
- Condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.

## Constraints

- **HARD PREREQUISITE: real customer evidence.** This skill CANNOT run without `research/customer-feedback.md` containing actual customer data. Do not proceed with hypothetical or team-assumed customer perspectives.
- **Intermediate artifact only.** This produces `research/positioning-obviously-awesome.md`, not the canonical `research/positioning.md`.
- **Customer words over team assumptions.** Every finding must trace to customer evidence. Flag anything that relies on team belief alone.
- **Evidence quality is explicit.** Rate and display confidence for every step. Weak evidence is a finding, not a failure.
- **Present before writing.** Never write output files until findings are validated.
- **Distinguish signal strength.** Unprompted customer mentions are stronger than prompted agreement.
- **Do not conflate with parent skill.** The parent `$positioning` uses Obviously Awesome lightly; this child skill does it rigorously with full customer grounding.

## Alignment Page

When this skill produces durable deliverables, build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md` in the parent skill's directory. Output: `alignment/obviously-awesome-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
