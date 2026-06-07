---
name: user-story-map
description: Jeff Patton user story map — activity→task→story hierarchy with release slicing and walking skeleton identification
type: research
version: v0.0
invocation: sub-skill
parent: journey-map
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# User Story Map — Jeff Patton Analysis

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Research and clarify.** Perform the research, run required source/code checks, and ask any needed clarification questions. Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-user-story-map-research.md`; product-path mode uses `research/{slug}/_working/preliminary-user-story-map-research.md`. Do not create or update canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved negative feedback. Apply approved edits first, archive the working packet, write the approved canonical artifacts, and convert the alignment page to `confirmed`.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. Push back clearly and cite the evidence when the user appears to misunderstand.
- For taste, prioritization, or subjective judgment calls: weigh user feedback heavily and adapt unless it conflicts with verified evidence.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Soft**: `research/competitive-analysis.md`, `research/customer-feedback.md`, specs, and codebase context when available.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`.

### 1. Load Context

- Read `research/icp.md` — ICP segments, pain points, trigger events
- Read `research/competitive-analysis.md` if it exists
- Read `research/customer-feedback.md` if it exists — feature requests, usage patterns
- Read specs if they exist — existing feature inventory
- Read codebase structure when available — current implementation state
- Read CLAUDE.md, README for product context

### 2. Identify Activities (Backbone)

Map the high-level user activities — the big things users do with the product. These form the horizontal backbone of the story map.

- Each activity represents a goal-level behavior (not a feature)
- Order activities left-to-right by typical usage flow or importance
- Ground each activity in ICP evidence (which persona, which pain point)

### 3. Break Activities into Tasks

For each activity, identify the user tasks — the steps users take to accomplish the activity.

- Tasks sit below their parent activity
- Order tasks left-to-right by typical sequence
- Each task should be small enough to describe with a user story but large enough to be meaningful

### 4. Identify Stories Under Tasks

For each task, list the specific user stories — the detailed behaviors and variations.

- Stories sit below their parent task, ordered top-to-bottom by priority
- Use standard format: "As a [persona], I want to [action], so that [outcome]"
- Include alternative paths, edge cases, and error handling stories

### 5. Slice Releases

Draw horizontal lines across the story map to define release boundaries:

- **Walking skeleton** (Release 1): the minimum viable path through all activities — one thin story per activity that proves the end-to-end flow works
- **Release 2**: stories that make the walking skeleton genuinely useful — fills in the most painful gaps
- **Release 3+**: stories that deepen, optimize, or expand

For each release slice:
- What user outcome does this release enable?
- What is the minimum set of stories needed?
- What is explicitly deferred and why?

### 6. Identify the Walking Skeleton

The walking skeleton is the thinnest possible end-to-end implementation:
- One path through every activity
- Proves the architecture works
- Is deployable and testable (even if not shippable)
- May use stubs, manual steps, or reduced scope

### 7. Validate with User

Present the story map hierarchy and release slicing. Ask for corrections, missing activities, and prioritization adjustments.

## Output

### `research/journey-map-user-story-map.md` (or `research/{slug}/journey-map-user-story-map.md`)

```markdown
# User Story Map

> Based on: research/icp.md[, other evidence]
> Date: [current date]
> Methodology: Jeff Patton User Story Mapping

## Activity Backbone

| Activity | Persona | Goal | Evidence |
|----------|---------|------|----------|
| [activity] | [persona] | [goal-level behavior] | [source] |

## Story Map

### Activity: [activity name]

#### Task: [task name]
| Priority | Story | Persona | Release |
|----------|-------|---------|---------|
| P1 | As a [persona], I want to [action], so that [outcome] | [persona] | R1 |
| P2 | As a [persona], I want to [action], so that [outcome] | [persona] | R2 |

## Release Slicing

### Release 1 — Walking Skeleton
**Outcome**: [what this enables]
**Stories**: [count]

| Activity | Task | Story | Rationale |
|----------|------|-------|-----------|
| [activity] | [task] | [story summary] | [why this is in R1] |

### Release 2 — [theme]
**Outcome**: [what this enables]

### Release 3+ — [theme]
**Outcome**: [what this enables]

## Walking Skeleton

[Description of the thinnest end-to-end path]

| Activity | Skeleton Story | Implementation Notes |
|----------|---------------|---------------------|
| [activity] | [minimal story] | [stubs, manual steps, reduced scope] |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim] | [source] | Observed/Inferred/Hypothesized | High/Medium/Low |
```

## Constraints

- Ground every activity and story in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe implementation architecture — describe user behavior, not system design.
- Present findings before writing.
- Do not overwrite existing output without asking the user first.
- This is a sub-skill — do not emit next-step routing.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/user-story-map-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
