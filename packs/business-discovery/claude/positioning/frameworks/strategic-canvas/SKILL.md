---
name: strategic-canvas
description: Blue Ocean strategic canvas — extract competing factors, build value curves, identify eliminate/reduce/raise/create moves
type: research
version: v0.0
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Strategic Canvas — Blue Ocean Value Curve Analysis

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Prerequisites

- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: `research/icp.md` (or `research/{slug}/icp.md`) — recommended for understanding which factors matter most to the target customer.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

### 1. Load Context

- Read `research/competitive-analysis.md` — competitor landscape, strengths/weaknesses, feature comparisons, market gaps
- Read `research/icp.md` if it exists — which factors matter most to the target customer
- Read CLAUDE.md, README, and key source files for product context

### 2. Extract Competing Factors

Identify the dimensions on which the industry competes. These are the factors that competitors invest in, market on, and that buyers evaluate:

- Price / cost
- Feature breadth / depth
- Speed / performance
- Ease of use / simplicity
- Support / service quality
- Integrations / ecosystem
- Customization / flexibility
- Brand / trust / reputation
- Security / compliance
- Community / network effects

Extract 6-12 factors that are most relevant to this specific market. Factors must come from actual competitive evidence in `research/competitive-analysis.md`, not invented dimensions.

### 3. Score Competitors

For each competing factor, score each competitor (including the user's product) on a scale:
- **High** — industry-leading investment/performance on this factor
- **Medium** — at or near industry standard
- **Low** — below industry standard or deliberately de-emphasized

Build the value curve table showing where each player sits on each factor.

### 4. Build Value Curve

Construct the value curve visualization as a table showing the relative positioning of each competitor across all factors. Identify:
- Where the user's product diverges from the industry norm
- Where all competitors cluster (red ocean — competing on the same dimensions)
- Where gaps exist (potential blue ocean)

### 5. Apply Four Actions Framework

For the user's product, determine strategic moves:

- **Eliminate**: Which factors taken for granted by the industry can be eliminated entirely? These are factors the industry competes on out of habit, not because customers truly need them.
- **Reduce**: Which factors can be reduced well below the industry standard? These are over-served dimensions where the industry over-invests relative to customer value.
- **Raise**: Which factors can be raised well above the industry standard? These are under-served dimensions where customers want more than anyone provides.
- **Create**: Which factors can be created that the industry has never offered? These are entirely new dimensions of value that redefine competition.

For each move, provide:
- The specific factor
- The rationale (why this move creates value)
- The evidence (from competitive analysis or ICP)
- The risk (what could go wrong)

### 6. Validate with User

Use AskUserQuestion to present the canvas and four actions:
- "Are these competing factors accurate? Am I missing any dimensions that matter in your market?"
- "Are these moves accurate? Which feel wrong or need stronger evidence?"

## Output

### `research/positioning-strategic-canvas.md` (or `research/{slug}/positioning-strategic-canvas.md`)

```markdown
# Strategic Canvas — Blue Ocean Analysis

> Based on: research/competitive-analysis.md[, research/icp.md]
> Date: [current date]
> Methodology: Blue Ocean Strategy (Kim & Mauborgne)

## Competing Factors

| Factor | Description | Why It Matters |
|--------|-------------|----------------|
| [factor] | [what it means in this market] | [why buyers care] |

## Value Curve Table

| Factor | [Competitor 1] | [Competitor 2] | [Competitor N] | [Product] |
|--------|----------------|----------------|----------------|-----------|
| [factor] | High/Med/Low | High/Med/Low | High/Med/Low | High/Med/Low |

### Value Curve Observations
- **Cluster zones**: [where all competitors are similar — red ocean]
- **Divergence points**: [where the product breaks from the pack]
- **Gaps**: [factors where no one invests — potential blue ocean]

## Four Actions Framework

### Eliminate
| Factor | Rationale | Evidence | Risk |
|--------|-----------|----------|------|
| [factor] | [why eliminate] | [source] | [what could go wrong] |

### Reduce
| Factor | Current Industry Level | Proposed Level | Rationale | Evidence |
|--------|----------------------|----------------|-----------|----------|
| [factor] | High | Low/Med | [why reduce] | [source] |

### Raise
| Factor | Current Industry Level | Proposed Level | Rationale | Evidence |
|--------|----------------------|----------------|-----------|----------|
| [factor] | Low/Med | High | [why raise] | [source] |

### Create
| Factor | Description | Customer Value | Evidence | Risk |
|--------|-------------|----------------|----------|------|
| [new factor] | [what it is] | [why customers want it] | [source] | [what could go wrong] |

## Strategic Implications

### New Value Curve
[Description of the target value curve after applying the four actions]

### Category Impact
[Does this canvas suggest the product should be in an existing category, subcategory, or new category?]

### Positioning Direction
[What positioning angle does this canvas support?]

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim about a factor or move] | [source file/section] | Observed/Inferred/Hypothesized | High/Medium/Low |
```

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Factors must come from actual competitive evidence.** Do not invent dimensions — extract them from the competitive analysis.
- **Score honestly.** If the user's product is Low on a factor, say so. The canvas is diagnostic, not aspirational.
- **Eliminate means eliminate, not reduce.** Only put factors in Eliminate if they can truly be dropped entirely without losing the target customer.
- **Create requires novelty.** A factor in Create must be something genuinely new to the industry, not just something the user does better.
- **Present before writing.** Never write output files until the canvas has been presented and validated.
- **Do not overwrite existing `research/positioning-strategic-canvas.md`** without asking the user first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
