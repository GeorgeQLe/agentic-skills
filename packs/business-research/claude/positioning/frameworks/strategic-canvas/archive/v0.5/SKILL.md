---
name: strategic-canvas
description: Blue Ocean strategic canvas — extract competing factors, build value curves, identify eliminate/reduce/raise/create moves
type: research
version: v0.5
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Strategic Canvas — Blue Ocean Value Curve Analysis

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Scope discovery and approval.** Inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions. Build the `review` HTML alignment page before synthesized research. The page must render the proposed scope, available source categories, known context, assumptions/confidence, proposed working-packet and canonical output paths, and research-scope approval gates. Stop for final compiled YAML approval of the research scope. Do not perform synthesized research, rank candidates, make recommendations, or write working packets, canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, perform the synthesized research, run required source/code checks, and write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet. Update the `review` HTML alignment page with the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and artifact approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML for artifact approval only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: `research/icp.md` (or `research/{slug}/icp.md`) — recommended for understanding which factors matter most to the target customer. If this context is missing and customer value factors cannot be assessed, recommend `/customer-discovery` first.

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/strategic-canvas-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
