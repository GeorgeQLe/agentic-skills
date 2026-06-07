---
name: customer-journey-canvas
description: Stickdorn customer journey canvas — stage×touchpoints×actions×emotion×backstage×pain×opportunities grid
type: research
version: v0.0
invocation: sub-skill
parent: journey-map
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Customer Journey Canvas — Stickdorn Analysis

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Research and clarify.** Perform the research, run required source/code checks, and ask any needed clarification questions. Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-customer-journey-canvas-research.md`; product-path mode uses `research/{slug}/_working/preliminary-customer-journey-canvas-research.md`. Do not create or update canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved negative feedback. Apply approved edits first, archive the working packet, write the approved canonical artifacts, and convert the alignment page to `confirmed`.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. Push back clearly and cite the evidence when the user appears to misunderstand.
- For taste, prioritization, or subjective judgment calls: weigh user feedback heavily and adapt unless it conflicts with verified evidence.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
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
- Read `research/customer-feedback.md` if it exists — touchpoint experiences, satisfaction data
- Read codebase structure when available — current product surfaces
- Read CLAUDE.md, README for product context

### 2. Define Journey Stages

Identify the major stages of the customer journey. Use ICP evidence to determine the right granularity. Typical stages: awareness, consideration, acquisition, service/usage, retention, advocacy.

### 3. Map Touchpoints per Stage

For each stage, identify all customer touchpoints:
- Digital touchpoints (website, app, email, social media, ads)
- Human touchpoints (sales, support, community, word-of-mouth)
- Physical touchpoints (packaging, events, printed materials)
- Third-party touchpoints (review sites, marketplaces, partner integrations)

### 4. Map Customer Actions per Stage

For each stage, document what the customer does:
- Primary actions (the main thing they're trying to accomplish)
- Secondary actions (supporting or exploratory behavior)
- Decision points (moments where they choose a path)

### 5. Map Emotional State per Stage

For each stage, assess the customer's emotional state:
- Dominant emotion (using a simple scale: very negative → negative → neutral → positive → very positive)
- Emotional drivers (what causes this emotional state)
- Emotional trajectory (improving, declining, or stable)

### 6. Map Backstage Processes per Stage

For each stage, document the internal processes that support the customer experience:
- Systems and tools involved
- Team/role responsibilities
- Data flows and handoffs
- Automation vs manual processes

### 7. Identify Pain Points per Stage

For each stage, catalog specific pain points:
- Customer-facing pains (friction, confusion, frustration, delays)
- Backstage pains (manual work, data silos, coordination failures)
- Root cause for each pain (process, technology, people, policy)

### 8. Identify Opportunities per Stage

For each stage, identify improvement opportunities:
- Quick wins (low effort, high impact)
- Strategic improvements (high effort, high impact)
- Innovations (new touchpoints, channels, or approaches)
- Priority based on pain severity and business impact

### 9. Validate with User

Present the canvas and ask for corrections, missing stages, touchpoints, or opportunities.

## Output

### `research/journey-map-customer-journey-canvas.md` (or `research/{slug}/journey-map-customer-journey-canvas.md`)

```markdown
# Customer Journey Canvas

> Based on: research/icp.md[, other evidence]
> Date: [current date]
> Methodology: Stickdorn Customer Journey Canvas

## Journey Canvas

| Stage | Touchpoints | Customer Actions | Emotion | Backstage | Pain Points | Opportunities |
|-------|------------|-----------------|---------|-----------|-------------|---------------|
| [stage] | [touchpoints] | [actions] | [emotion] | [processes] | [pains] | [opportunities] |

## Stage Detail

### [Stage Name]

**Touchpoints:**
- [touchpoint]: [description and channel]

**Customer Actions:**
- [action]: [description]

**Emotional State:** [emotion] ([driver])

**Backstage Processes:**
- [process]: [team/system responsible]

**Pain Points:**
| Pain | Severity | Root Cause | Evidence |
|------|----------|-----------|----------|
| [pain] | High/Medium/Low | Process/Technology/People/Policy | [source] |

**Opportunities:**
| Opportunity | Type | Effort | Impact | Evidence |
|------------|------|--------|--------|----------|
| [opportunity] | Quick win/Strategic/Innovation | Low/Medium/High | Low/Medium/High | [source] |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim] | [source] | Observed/Inferred/Hypothesized | High/Medium/Low |
```

## Constraints

- Ground every canvas element in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe UI or architecture — describe the journey, not the solution.
- Present findings before writing.
- Do not overwrite existing output without asking the user first.
- This is a sub-skill — do not emit next-step routing.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/customer-journey-canvas-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
