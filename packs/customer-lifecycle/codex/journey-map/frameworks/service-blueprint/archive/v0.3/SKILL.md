---
name: service-blueprint
description: Shostack service blueprint — map front-stage/backstage/support/evidence lines and identify operational gaps
type: research
version: v0.3
invocation: sub-skill
parent: journey-map
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` inside Codex, or `npx skillpacks install <pack>` from the project shell, instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Service Blueprint — Shostack Analysis

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

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. Push back clearly and cite the evidence when the user appears to misunderstand.
- For taste, prioritization, or subjective judgment calls: weigh user feedback heavily and adapt unless it conflicts with verified evidence.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$customer-discovery` first and stop.
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
- Read `research/customer-feedback.md` if it exists
- Read codebase structure, API routes, database schema when a production codebase exists
- Read CLAUDE.md, README for product context

### 2. Identify Service Stages

For each key user journey from ICP evidence, identify the major service stages: awareness, consideration, onboarding, core usage, support, renewal/expansion, offboarding.

### 3. Map Front-Stage Actions

For each stage, document the customer-visible interactions:
- Customer actions (what the user does)
- Physical/digital evidence (what the user sees, receives, or interacts with)
- Touchpoints (channels, interfaces, communication points)

### 4. Map Backstage Actions

For each front-stage action, document what happens behind the scenes:
- Employee/system actions that directly support the front-stage experience
- Internal processes the customer never sees but depends on
- Data flows between systems

### 5. Map Support Processes

For each backstage action, identify the support infrastructure:
- Technology systems, databases, APIs
- Third-party services and integrations
- Internal tools and operational processes
- Policy and compliance requirements

### 6. Draw the Lines of Interaction

Identify the four key boundaries:
- **Line of interaction**: between customer and front-stage
- **Line of visibility**: between front-stage and backstage (what the customer can vs cannot see)
- **Line of internal interaction**: between backstage and support processes
- **Line of implementation**: between support processes and infrastructure

### 7. Identify Operational Gaps

Analyze the blueprint for:
- **Fail points**: where the service is most likely to break down
- **Wait points**: where the customer experiences delays
- **Bottlenecks**: where capacity constraints create queuing
- **Handoff gaps**: where information is lost between stages or systems
- **Evidence gaps**: where the customer lacks visibility into service status
- **Redundancy**: where duplicate processes exist

### 8. Validate with User

Present the blueprint and gap analysis. Ask for corrections, missing stages, and product-specific context.

## Output

### `research/journey-map-service-blueprint.md` (or `research/{slug}/journey-map-service-blueprint.md`)

```markdown
# Service Blueprint

> Based on: research/icp.md[, other evidence]
> Date: [current date]
> Methodology: Shostack Service Blueprint

## Service Stages

| Stage | Customer Action | Evidence/Touchpoint | Backstage Action | Support Process |
|-------|----------------|---------------------|------------------|-----------------|
| [stage] | [action] | [evidence] | [backstage] | [support] |

## Lines of Interaction

### Line of Visibility
[What the customer can vs cannot see at each stage]

### Line of Internal Interaction
[Backstage to support process boundaries]

## Operational Gap Analysis

| Gap Type | Stage | Description | Severity | Evidence |
|----------|-------|-------------|----------|----------|
| Fail point | [stage] | [description] | High/Medium/Low | [source] |
| Wait point | [stage] | [description] | High/Medium/Low | [source] |
| Bottleneck | [stage] | [description] | High/Medium/Low | [source] |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim] | [source] | Observed/Inferred/Hypothesized | High/Medium/Low |
```

## Constraints

- Ground every blueprint element in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe UI or architecture — describe the service, not the solution.
- Present findings before writing.
- Do not overwrite existing output without asking the user first.
- This is a sub-skill — do not emit next-step routing.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/service-blueprint-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
