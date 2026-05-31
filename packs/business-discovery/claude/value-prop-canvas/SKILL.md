---
name: value-prop-canvas
description: Strategyzer-style jobs/pains/gains to features/relievers/creators fit validation
type: research
version: v0.3
argument-hint: "[optional: specific job or segment to focus on]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Value Proposition Canvas — Solution-Customer Fit Validation

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Develops a Strategyzer-style Value Proposition Canvas that maps Customer Profile (jobs, pains, gains) against Value Map (products/services, pain relievers, gain creators) to validate solution-customer fit. This is an optional AFPS detour when solution-customer fit is weak, disputed, or needs explicit scoring before positioning, UX, or spec work; it is not part of the default business-product route.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Soft**: Read these if they exist:
  - `research/competitive-analysis.md` — competitor landscape and alternative solutions
  - `research/journey-map.md` — where jobs, pains, gains, and aha moments occur in the user/customer lifecycle
  - `research/positioning.md` — market framing to avoid contradicting accepted positioning
  - `research/idea-brief.md` — product concept and hypothesis

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

- Read `research/icp.md` — ICP segments, jobs, pains, gains, trigger events
- Read `research/competitive-analysis.md` if it exists — competitor landscape, alternative solutions
- Read `research/idea-brief.md` if it exists — product concept and hypothesis
- Read CLAUDE.md, README, and key source files for product context

### 2. Research VPC Methodology

Use WebSearch with **4-6 targeted queries**:

1. **Domain VPC** — "value proposition canvas [domain]"
2. **JTBD mapping** — "jobs to be done [category]"
3. **Strategyzer methodology** — "Strategyzer value proposition design [industry]"
4. **Customer profile patterns** — "customer jobs pains gains [category]"
5. **Value map examples** — "value map pain relievers gain creators examples"

### 3. Build Customer Profile

For the primary ICP segment, construct the Customer Profile:

**Jobs** (functional, social, emotional):
- Functional jobs — tasks they're trying to complete
- Social jobs — how they want to be perceived
- Emotional jobs — feelings they seek or avoid

Rank each job by importance (critical / important / nice-to-have).

**Pains**:
- Undesired outcomes, obstacles, risks
- Rank by severity: extreme / high / moderate

**Gains**:
- Outcomes and benefits they want
- Rank by relevance: required / expected / desired / unexpected

Use AskUserQuestion to present and validate:
- "Here's the Customer Profile I've built from ICP research. Which jobs, pains, or gains are missing, overstated, or mis-ranked?"

### 4. Build Value Map

Map the product's features and services to pain relievers and gain creators:

**Products & Services** — what the product offers (features, capabilities, services)

**Pain Relievers** — for each: which specific pain does it relieve? How completely?

**Gain Creators** — for each: which specific gain does it create? How significantly?

Use AskUserQuestion:
- "Does this Value Map accurately reflect what the product does? Any features missing or claims overstated?"

### 5. Score Fit

For each customer job, evaluate how well the Value Map addresses it:

| Job | Fit Score | Evidence | Risk |
|-----|-----------|----------|------|
| [job] | Strong Fit / Partial Fit / No Fit / Gap | [what supports this score] | [if No Fit or Gap, what's at stake] |

Flag all jobs with **No Fit** or **Gap** as risks requiring attention.

Use AskUserQuestion:
- "Do these fit scores reflect reality? Are there fits I'm overrating or gaps I'm missing?"

### 6. Identify Gaps & Risks

Summarize findings across four dimensions:

1. **Unaddressed jobs** — customer jobs with no corresponding product capability
2. **Partially addressed pains** — pain relievers that don't fully resolve the pain
3. **Missing gain creators** — desired gains with no corresponding product feature
4. **Over-investment areas** — features that don't map to important jobs (wasted effort)

Prioritize by ICP segment importance — gaps in critical jobs matter more than gaps in nice-to-have jobs.

### 7. Populate Next Steps

Include 3-5 applicable items with "Pick one:" framing:

- ALWAYS: `/positioning` — Return to the default AFPS route by framing validated fit in the market
- IF gaps identified: `/positioning` — Define product positioning from gap evidence (if `research/positioning.md` missing), or `/ux-variations [top gap]` — Explore UX solutions for the highest-priority gap
- IF no `research/competitive-analysis.md`: `/competitive-analysis` — Understand how alternatives address the same jobs
- IF `research/positioning.md` exists: `/ux-variations [validated fit direction]` — Return to the prototype path
- IF business model, revenue, channel, cost, or defensibility risk remains material: `/lean-canvas` — Optional synthesis now that fit is validated

### 8. Write Output

Only after the user confirms, write the output files.

### 9. Downstream Impact Check

After writing, check for downstream research documents that may be affected.

**Downstream documents to check** (use `{slug}/` prefix when product-path scope is active):
- `research/positioning.md`
- `research/lean-canvas.md`

For each existing downstream document:
1. Read it — focus on sections referencing customer jobs, pains, gains, or solution fit
2. Identify conflicts where claims don't align with the new VPC findings
3. Note each conflict: file, section, stale claim, what it should now say

**Classify the impact**:
- **None**: No downstream docs exist, or no conflicts. Skip display.
- **Minor** (1-2 small conflicts): Display inline.
- **Major** (3+ conflicts OR fit scores changed significantly, new gaps identified, customer profile substantially revised): Display and recommend `/reconcile-research`.

## Output

### `research/value-prop.md` (or `research/{slug}/value-prop.md`)

```markdown
# Value Proposition Canvas

> Based on: research/icp.md[, research/competitive-analysis.md, research/idea-brief.md]
> Date: [current date]
> Methodology: Strategyzer Value Proposition Canvas

## Summary
[2-3 sentences: the fit thesis — how well the product addresses the customer's most important jobs, where fit is strongest, and where the critical gaps are]

## Customer Profile

### Jobs

| # | Job | Type | Importance | Description |
|---|-----|------|------------|-------------|
| J1 | [job name] | Functional / Social / Emotional | Critical / Important / Nice-to-have | [what they're trying to accomplish] |

### Pains

| # | Pain | Severity | Related Jobs | Description |
|---|------|----------|--------------|-------------|
| P1 | [pain name] | Extreme / High / Moderate | J1, J2 | [undesired outcome, obstacle, or risk] |

### Gains

| # | Gain | Relevance | Related Jobs | Description |
|---|------|-----------|--------------|-------------|
| G1 | [gain name] | Required / Expected / Desired / Unexpected | J1, J3 | [outcome or benefit they want] |

## Value Map

### Products & Services
- [Feature/capability 1] — [what it does]
- [Feature/capability 2] — [what it does]

### Pain Relievers

| Pain Reliever | Addresses Pain | Completeness | How It Relieves |
|---------------|---------------|--------------|-----------------|
| [feature/capability] | P1 | Full / Partial / Minimal | [mechanism of relief] |

### Gain Creators

| Gain Creator | Addresses Gain | Significance | How It Creates |
|--------------|---------------|--------------|----------------|
| [feature/capability] | G1 | High / Medium / Low | [mechanism of creation] |

## Fit Scorecard

| Job | Fit Score | Evidence | Risk |
|-----|-----------|----------|------|
| J1: [job name] | Strong Fit / Partial Fit / No Fit / Gap | [what supports this assessment] | [risk if unaddressed] |

**Overall Fit**: [Strong / Moderate / Weak] — [one-sentence justification]

## Gap Analysis

### Unaddressed Jobs
- [Job] — [why it's unaddressed, impact on customer segment]

### Partially Addressed Pains
- [Pain] — [what's addressed, what's missing]

### Missing Gain Creators
- [Gain] — [no product capability maps to this gain]

### Over-Investment Areas
- [Feature] — [maps to no important job; potential wasted effort]

## Strategic Implications
[What this fit analysis means for product strategy — what to double down on, what to build, what to deprioritize]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote]"
   - **Now**: [what VPC findings say instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 7]
```

### `research/value-prop-search-log.md` (or `research/{slug}/value-prop-search-log.md`)
Raw research log — queries, findings, evidence for each VPC decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires ICP.** VPC without knowing the customer is guesswork.
- **Customer-grounded.** Every job, pain, and gain must trace to ICP research or customer evidence, not assumptions.
- **Be honest about fit.** If fit is weak, say so — that's a critical finding, not a failure.
- **Present before writing.** Never write output files until the canvas has been presented and validated.
- **VPC ≠ positioning.** This skill validates solution-customer fit; positioning determines market framing. They are distinct steps.
- **Do not overwrite existing `research/value-prop.md`** without asking the user first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/value-prop-canvas-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
