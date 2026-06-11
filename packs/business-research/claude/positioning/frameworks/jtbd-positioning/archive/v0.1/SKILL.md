---
name: jtbd-positioning
description: Jobs-to-be-Done positioning analysis — identify primary job, map functional/social/emotional dimensions, position around job outcome
type: research
version: v0.1
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# JTBD Positioning — Jobs-to-be-Done Analysis

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: `research/journey-map.md` (or `research/{slug}/journey-map.md`) — recommended for richer job context but not blocking.

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
- Read `research/competitive-analysis.md` — competitor landscape, what alternatives offer
- Read `research/journey-map.md` if it exists — where value is delivered, the aha moment, switching triggers
- Read CLAUDE.md, README, and key source files for product context

### 2. Identify the Primary Job

Determine the primary "job" the target customer is hiring this product to do. A job is not a feature or a task — it is a higher-level progress the customer is trying to make in their life or work.

Format as a job statement: "When [situation], I want to [motivation], so I can [expected outcome]."

Ground the job in ICP evidence:
- What pain points from the ICP map to unfinished or poorly-served jobs?
- What trigger events cause the customer to "fire" their current solution and "hire" a new one?
- What does the journey map reveal about what the customer is truly trying to accomplish?

### 3. Map Functional Dimensions

What the job accomplishes practically:
- What tasks does the job complete?
- What outputs does the customer expect?
- What quality standards define "done well"?
- How does the customer measure functional success?

### 4. Map Social Dimensions

How doing the job affects how others perceive the customer:
- How does the customer want to be seen by peers, managers, or customers?
- What professional identity does completing this job reinforce?
- What status or credibility does the customer gain?
- What social risks exist if the job is done poorly?

### 5. Map Emotional Dimensions

How doing the job makes the customer feel:
- What frustrations does the customer experience with current solutions?
- What confidence or relief does successful completion bring?
- What anxiety or uncertainty exists during the process?
- What delight or satisfaction signals "done well"?

### 6. Identify Desired Outcome State

Define what "done well" looks like from the customer's perspective:
- Functional success criteria
- Social success criteria
- Emotional success criteria
- What does the customer's world look like after the job is completed successfully?

### 7. Position Around Job Outcome

Determine how the product delivers the desired outcome better than alternatives:
- Which dimensions (functional/social/emotional) does the product win on?
- Where do alternatives fall short on delivering the full outcome?
- What is the product's unique advantage in delivering "done well"?
- How should the product be framed to make the job-outcome connection obvious?

### 8. Validate with User

Use AskUserQuestion to present findings and validate:
- "Is this the right job? Are there jobs I've missed or overweighted?"
- Present the job statement, dimensional map, and outcome positioning
- Ask whether the functional/social/emotional weighting feels accurate

## Output

### `research/positioning-jtbd.md` (or `research/{slug}/positioning-jtbd.md`)

```markdown
# JTBD Positioning Analysis

> Based on: research/icp.md, research/competitive-analysis.md[, research/journey-map.md]
> Date: [current date]
> Methodology: Jobs-to-be-Done

## Job Statement

When [situation], I want to [motivation], so I can [expected outcome].

## Functional Dimensions

| Dimension | Description | Current Solution Performance | Evidence |
|-----------|-------------|------------------------------|----------|
| [dimension] | [what it accomplishes] | [how current solutions perform] | [source] |

## Social Dimensions

| Dimension | Description | Importance | Evidence |
|-----------|-------------|------------|----------|
| [dimension] | [how it affects perception] | High/Medium/Low | [source] |

## Emotional Dimensions

| Dimension | Description | Current Pain Level | Evidence |
|-----------|-------------|-------------------|----------|
| [dimension] | [how it makes them feel] | High/Medium/Low | [source] |

## Desired Outcome

[Description of what "done well" looks like across all dimensions]

### Functional Success
- [criterion]

### Social Success
- [criterion]

### Emotional Success
- [criterion]

## Position

[How the product delivers the desired outcome better than alternatives]

### Winning Dimensions
| Dimension Type | Specific Dimension | Product Advantage | vs. Alternatives |
|---------------|-------------------|-------------------|------------------|
| [Functional/Social/Emotional] | [dimension] | [advantage] | [how alternatives fall short] |

### Positioning Implication
[How this job-outcome framing should shape product positioning]

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim about the job] | [source file/section] | Observed/Inferred/Hypothesized | High/Medium/Low |
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

- **Must ground in ICP evidence.** Jobs must come from observed customer behavior and pain points, not aspirational product vision.
- **If the job is unclear, surface that as a finding.** Do not force a clean job statement when evidence is ambiguous — document the ambiguity.
- **One primary job.** There may be related jobs, but identify the single primary job the product is hired for. Secondary jobs can be noted but should not dilute the primary.
- **Present before writing.** Never write output files until findings have been presented and validated.
- **Do not overwrite existing `research/positioning-jtbd.md`** without asking the user first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
