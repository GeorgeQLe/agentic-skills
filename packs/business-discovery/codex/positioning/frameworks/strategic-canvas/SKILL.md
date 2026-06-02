---
name: strategic-canvas
description: Blue Ocean strategic canvas — extract competing factors, build value curves, apply Four Actions Framework (eliminate/reduce/raise/create)
type: research
version: v0.1
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Strategic Canvas — Blue Ocean Value Curve Analysis

Invoke as `$strategic-canvas`.

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

Applies the Blue Ocean Strategy framework (Kim & Mauborgne) to identify positioning opportunities by mapping industry competing factors, plotting value curves for current competitors, and applying the Four Actions Framework to find uncontested market space. Produces an intermediate artifact for the parent `$positioning` synthesis.

## Prerequisites

- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Soft**: Read if they exist:
  - `research/journey-map.md` — where overserved/underserved moments appear
  - `research/customer-feedback.md` — what customers value and what they ignore
  - `research/positioning.md` — existing positioning context

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

- Read `research/competitive-analysis.md` — competitor landscape, features, strengths, weaknesses
- Read `research/icp.md` — what customers actually value vs. what industry assumes they value
- Read soft prerequisites if available

### 2. Extract Competing Factors

Identify 8-12 factors the industry competes on. These are the dimensions buyers evaluate:

- Use WebSearch with 3-5 queries: "[category] comparison criteria", "[category] buyer evaluation", "[competitor] vs [competitor] comparison"
- Sources: review sites, comparison pages, buyer guides, analyst reports
- Include both explicit (features, price) and implicit (brand trust, ease of switching) factors

Present factors to user. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "These are the competing factors I found for this industry. Which are missing, irrelevant, or mis-weighted?"

### 3. Build Value Curves

For each major competitor (3-5) plus the user's product, score each competing factor on a relative scale (Low / Medium / High):

| Factor | Competitor A | Competitor B | Competitor C | This Product |
|--------|-------------|-------------|-------------|--------------|
| [factor] | [L/M/H] | [L/M/H] | [L/M/H] | [L/M/H] |

Identify patterns:
- **Convergence zones** — where all competitors score similarly (commoditized factors)
- **Divergence zones** — where one player stands out
- **Overserved factors** — high investment, low customer value
- **Underserved factors** — low investment, high customer need

### 4. Apply Four Actions Framework

For each competing factor, determine the strategic action:

**Eliminate** — Which factors that the industry takes for granted should be eliminated?
- Factors that add cost but not customer value
- Features customers never use or don't care about
- "Me too" capabilities that don't differentiate

**Reduce** — Which factors should be reduced well below the industry standard?
- Overengineered features customers don't need at that level
- Factors where "good enough" beats "best in class"

**Raise** — Which factors should be raised well above the industry standard?
- Factors where current solutions frustrate customers
- Dimensions where improvement creates outsized value

**Create** — Which factors should be created that the industry has never offered?
- New value dimensions competitors haven't considered
- Needs revealed by journey-map or customer feedback
- Adjacent problems no one in the category addresses

Validate with user. If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Here are the Four Actions. Which eliminate/reduce actions feel too aggressive? Which raise/create actions lack evidence?"

### 5. Define Target Value Curve

Plot the desired value curve for the product — the strategic profile that creates uncontested space:

- Show clear differentiation from competitor curves
- Validate that eliminate/reduce actions genuinely reduce cost or complexity
- Validate that raise/create actions genuinely increase customer value
- Identify the "divergent" shape that signals a blue ocean move

### 6. Write Output

Only after user approval.

## Output

### `research/positioning-strategic-canvas.md` (or `research/{slug}/positioning-strategic-canvas.md`)

```markdown
# Strategic Canvas — Blue Ocean Analysis

> Based on: research/competitive-analysis.md, research/icp.md
> Date: [current date]
> Methodology: Blue Ocean Strategy (Kim & Mauborgne)

## Industry Competing Factors

| # | Factor | Industry Importance | Customer Importance | Gap |
|---|--------|-------------------|--------------------|----|
| 1 | [factor] | [H/M/L] | [H/M/L] | [over/under/aligned] |

## Value Curves

| Factor | [Comp A] | [Comp B] | [Comp C] | This Product (Current) | This Product (Target) |
|--------|----------|----------|----------|----------------------|---------------------|
| [factor] | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |

### Convergence Zones (Commoditized)
- [factors where all competitors cluster]

### Divergence Opportunities
- [factors where the product can break away]

## Four Actions Framework

### Eliminate
| Factor | Why Eliminate | Cost Saved | Risk |
|--------|-------------|-----------|------|
| [factor] | [rationale] | [impact] | [what could go wrong] |

### Reduce
| Factor | Current Level | Target Level | Rationale |
|--------|--------------|-------------|-----------|
| [factor] | [current] | [target] | [why good enough works] |

### Raise
| Factor | Current Level | Target Level | Evidence of Demand |
|--------|--------------|-------------|-------------------|
| [factor] | [current] | [target] | [source] |

### Create
| Factor | Description | Customer Need | Evidence |
|--------|-------------|---------------|----------|
| [factor] | [what it is] | [what need it serves] | [source] |

## Target Strategic Profile

**Blue ocean thesis**: [one sentence — what uncontested space this creates]
**Key trade-off**: [what you give up to get there]
**Evidence strength**: [Strong / Moderate / Weak — with justification]

## Implications for Positioning Synthesis

[How this canvas analysis should influence the final positioning — what it suggests for market category, differentiation strategy, and messaging emphasis]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable work goes in `tasks/todo.md`.
- Human-only external actions go in `tasks/manual-todo.md` with blocking/dependency annotations.
- Condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.

## Constraints

- **Intermediate artifact only.** This produces `research/positioning-strategic-canvas.md`, not the canonical `research/positioning.md`.
- **Evidence-grounded scoring.** Value curve scores must cite competitive analysis or research — no guessing.
- **Honest about gaps.** If the product has no clear blue ocean move, say so. Not every product needs category creation.
- **Present before writing.** Never write output files until findings are validated.
- **Four Actions must be actionable.** Each action should connect to a concrete product or positioning decision.

## Alignment Page

When this skill produces durable deliverables, build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md` in the parent skill's directory. Output: `alignment/strategic-canvas-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
