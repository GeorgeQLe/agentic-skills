---
name: jtbd-positioning
description: Jobs-to-be-Done positioning analysis — identify primary job, map functional/social/emotional dimensions, position around job outcome
type: research
version: v0.9
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# JTBD Positioning — Jobs-to-be-Done Analysis

## Parent Orchestrator Routing

Run only through the parent orchestrator `/positioning` as part of its Research Session Loop. If the user needs to continue pending framework work, tell them to clear context and re-invoke `/positioning` with the same product/research path argument when present, for example `/positioning research/afps-tracker`.

Do not ask users to invoke this framework directly or with a path-shaped child framework command. Do not emit downstream routing labels or command recommendations from this framework subskill; parent synthesis owns downstream routing after canonical artifacts are approved.

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include downstream routing language. The approval request itself is the next action. Parent synthesis owns downstream routing after approved artifacts are written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Scope discovery and approval.** Inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions. Build the `review` HTML alignment page before synthesized research. The page must render the proposed scope, available source categories, known context, assumptions/confidence, proposed working-packet and canonical output paths, and research-scope approval gates. Stop for final compiled YAML approval of the research scope. Do not perform synthesized research, rank candidates, make recommendations, or write working packets, canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, perform the synthesized research, run required source/code checks, and write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet. Update the `review` HTML alignment page so it renders the complete working-packet substance as structured HTML review UI: purpose-built sections, tables, matrices, gates, cards, and tier-appropriate charts or diagrams that preserve every packet section, finding, caveat, and decision detail without summary loss. Raw Markdown packet text may appear only as a supplemental source view after the rendered review UI; do not make a `Full Preliminary Packet` or `Full Working Packet` raw Markdown dump, giant `<pre><code>` block, link-only view, or source-only view the primary review surface. Include the evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and artifact approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML for artifact approval only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/customer-discovery` first and stop.
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/jtbd-positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
