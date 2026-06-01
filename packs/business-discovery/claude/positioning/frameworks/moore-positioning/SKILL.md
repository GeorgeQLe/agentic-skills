---
name: moore-positioning
description: Geoffrey Moore positioning hypothesis — generate positioning statement using the Crossing the Chasm template
type: research
version: v0.0
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Moore Positioning — Crossing the Chasm Template

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: Any existing positioning framework outputs (`research/positioning-*.md`) — read these if present to build on prior analysis rather than starting from scratch.

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

- Read `research/icp.md` — ICP segments, pain points, value props, trigger events
- Read `research/competitive-analysis.md` — competitor landscape, primary alternatives, differentiation
- Read any existing `research/positioning-*.md` files — prior framework outputs to build upon
- Read CLAUDE.md, README, and key source files for product context

### 2. Generate Positioning Hypothesis

Using the Geoffrey Moore positioning template from "Crossing the Chasm":

```
For [target customers]
who [statement of need/opportunity]
[product name] is a [market category]
that [key benefit]
Unlike [primary competitive alternative]
our product [primary differentiation]
```

Fill each element by drawing from evidence:
- **Target customers**: From ICP — the specific segment, not "everyone"
- **Statement of need/opportunity**: The pain point or trigger event that creates urgency
- **Market category**: The frame of reference buyers use to find and evaluate solutions
- **Key benefit**: The primary value — what customers get that matters most
- **Primary competitive alternative**: The strongest alternative the buyer would otherwise use
- **Primary differentiation**: What is genuinely different — not table stakes

### 3. Map Evidence Status

For each element of the positioning template, classify its evidence basis:

| Element | Content | Status | Evidence Source |
|---------|---------|--------|----------------|
| Target customers | [filled in] | Evidenced / Hypothesized / Unvalidated | [source] |
| Statement of need | [filled in] | Evidenced / Hypothesized / Unvalidated | [source] |
| Market category | [filled in] | Evidenced / Hypothesized / Unvalidated | [source] |
| Key benefit | [filled in] | Evidenced / Hypothesized / Unvalidated | [source] |
| Competitive alternative | [filled in] | Evidenced / Hypothesized / Unvalidated | [source] |
| Primary differentiation | [filled in] | Evidenced / Hypothesized / Unvalidated | [source] |

Status definitions:
- **Evidenced**: Directly supported by research artifacts (ICP interviews, competitive data, customer feedback)
- **Hypothesized**: Reasonable inference from available evidence, but not directly confirmed
- **Unvalidated**: Assertion without supporting evidence — needs testing

### 4. Identify Weakest Link

Determine which element of the positioning chain has the least evidence support:
- Which element is most likely to be wrong?
- What would change if this element were different?
- What evidence would strengthen or invalidate it?
- What is the cost of being wrong about this element?

### 5. Consider Alternative Hypotheses

Generate 1-2 alternative positioning hypotheses that use different elements:
- Alternative target customer
- Alternative market category
- Alternative competitive frame
- Alternative key benefit

For each alternative, note why it was considered and why the primary hypothesis was preferred.

### 6. Validate with User

Use AskUserQuestion to present the hypothesis and validate:
- "Does this positioning hypothesis ring true? Which elements need correction or stronger grounding?"
- Present the filled template, evidence map, weakest link, and alternatives
- Ask whether the primary hypothesis or an alternative feels more accurate

## Output

### `research/positioning-moore.md` (or `research/{slug}/positioning-moore.md`)

```markdown
# Moore Positioning Hypothesis

> Based on: research/icp.md, research/competitive-analysis.md[, research/positioning-*.md]
> Date: [current date]
> Methodology: Geoffrey Moore — Crossing the Chasm

## Positioning Hypothesis

For **[target customers]**
who **[statement of need/opportunity]**
**[product name]** is a **[market category]**
that **[key benefit]**
Unlike **[primary competitive alternative]**
our product **[primary differentiation]**

## Evidence Mapping

| Element | Content | Status | Evidence Source | Confidence |
|---------|---------|--------|----------------|------------|
| Target customers | [content] | Evidenced/Hypothesized/Unvalidated | [source] | High/Med/Low |
| Statement of need | [content] | Evidenced/Hypothesized/Unvalidated | [source] | High/Med/Low |
| Market category | [content] | Evidenced/Hypothesized/Unvalidated | [source] | High/Med/Low |
| Key benefit | [content] | Evidenced/Hypothesized/Unvalidated | [source] | High/Med/Low |
| Competitive alternative | [content] | Evidenced/Hypothesized/Unvalidated | [source] | High/Med/Low |
| Primary differentiation | [content] | Evidenced/Hypothesized/Unvalidated | [source] | High/Med/Low |

## Weakest Link Analysis

**Weakest element**: [element name]
**Why it's weak**: [explanation]
**What would change if wrong**: [impact on positioning]
**Evidence needed**: [what would strengthen or invalidate]
**Cost of being wrong**: [consequences]

## Validation Needs

| Element | Validation Method | Priority |
|---------|-------------------|----------|
| [element] | [how to validate — customer interviews, A/B test, market research] | High/Med/Low |

## Alternative Hypotheses Considered

### Alternative 1: [brief label]

For **[target customers]**
who **[statement of need]**
**[product name]** is a **[market category]**
that **[key benefit]**
Unlike **[primary competitive alternative]**
our product **[primary differentiation]**

**Why considered**: [rationale]
**Why not preferred**: [rationale]

### Alternative 2: [brief label]

[Same format]

**Why considered**: [rationale]
**Why not preferred**: [rationale]
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

- **This is explicitly a hypothesis, not a declaration.** The output is a testable positioning hypothesis, not final positioning. Label it as such.
- **Clearly label hypothesized vs evidenced elements.** Transparency about evidence quality is the core value of this framework.
- **Do not conflate "key benefit" with feature list.** The key benefit is the outcome, not the mechanism.
- **Primary competitive alternative must be what customers actually use.** Not what the company wishes they competed against.
- **Present before writing.** Never write output files until the hypothesis has been presented and validated.
- **Do not overwrite existing `research/positioning-moore.md`** without asking the user first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
