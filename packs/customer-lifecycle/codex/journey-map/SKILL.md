---
name: journey-map
description: Map the full user and customer lifecycle from trigger and discovery through onboarding, aha, conversion, retention, expansion, and advocacy
type: analysis
version: v0.7
argument-hint: "[optional: app, use case, persona, or lifecycle stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Journey Map — Lifecycle Overview

Invoke as `$journey-map`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Create or update the canonical lifecycle overview. This is the top-level map for user task journeys and the customer relationship lifecycle; deeper stage docs belong in `$onboarding-map`, `$conversion-map`, `$transaction-map`, `$retention-map`, `$expansion-map`, and `$lifecycle-metrics`.

## Prerequisites

- `research/icp.md` (or `research/{slug}/icp.md` in product-path mode) must exist — run `$icp` first.
- Specs, competitive analysis, enterprise ICP, customer feedback, and codebase evidence are supporting context when present.

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

0b. **Product-path manifest**: Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. Scope the journey map to the active product path by default. When journey mapping reveals lifecycle stages or user flows that only apply to a deferred product path, add a `## Product Path Implications` section noting the finding and recommending `$product-line fork` if it implies a new product surface.
1. **Load context**: Read ICP, competitive analysis, enterprise ICP, customer feedback, existing lifecycle docs, specs, README/AGENTS/CLAUDE, and relevant source files when they clarify real product surfaces.
2. **Map user journeys**: For each key persona, identify 3-5 core use cases, entry points, task steps, decision points, happy path, failure modes, outputs, and delta from current state.
3. **Map customer lifecycle**: Cover trigger, discovery, evaluation, onboarding, aha moment, conversion, transaction, retention, expansion, advocacy, churn, and recovery.
4. **Identify critical moments**: Name the 3-5 moments where the product wins or loses the user/customer, with evidence and success criteria.
5. **Present before writing**: Summarize the lifecycle, evidence, open assumptions, and stage docs that should be split out. Ask what needs correction or product-specific context. Continue until validated.
6. **Write only after validation**, archiving existing canonical files first when replacing them.

## Deliverables

- `research/journey-map.md` (or `research/{slug}/journey-map.md`) — canonical lifecycle overview with links or references to deeper stage docs when they exist.
- `research/journey-map-interview.md` (or `research/{slug}/journey-map-interview.md`) — raw interview log and decisions.

The output file must end with `## Next Steps` using "Pick one:" framing. Follow the Next-Step Routing contract below to decide the recommendation.

## Next-Step Routing

Priority-ordered decision tree — recommend the **first** match:

1. **Blocking optional research trigger** — the overview exposed a stage, fit, measurement, or product-loop risk that must be resolved before positioning or UX choices harden -> use the Optional Research Trigger Map below. Cite the exact journey evidence, why it blocks the next AFPS step, and which existing framework skill owns it.
2. **Positioning missing** (`research/positioning.md` does not exist) -> check `.agents/project.json.enabled_packs` for `business-discovery` — if `business-discovery` is not enabled, recommend `$pack install business-discovery` first; if `business-discovery` is enabled, recommend `$positioning` — Positioning needs ICP, competitive analysis, and journey evidence, so it is the natural next step.
3. **Positioning done, UX variations missing** -> check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `$pack install product-design` first; if `product-design` is enabled, recommend `$ux-variations` — Explore experience directions before production specification.
4. **Never** recommend `$spec-interview` from this skill — it is many steps downstream in the AFPS chain.

## Optional Research Trigger Map

These detours are conditional framework owners, not required AFPS chain links. Use them only when the journey evidence shows that the answer will change positioning, product-loop direction, or UX/prototype choices. When the trigger is absent, continue to `$positioning` or `$ux-variations` using the decision tree above.

| Journey signal | Existing owner | Trigger threshold |
| --- | --- | --- |
| Signup, setup, activation, first-success, or time-to-value path is unclear | `$onboarding-map` | The journey cannot identify the first success path, onboarding drop-offs, or activation criteria well enough to shape UX. |
| Evaluation, trial, pricing decision, objections, or buyer roles are unresolved | `$conversion-map` | Conversion decision logic affects the primary screen flow, offer, or proof sequence. |
| Purchase, checkout, payment, fulfillment, refund, dispute, or trust state is material | `$transaction-map` | Transaction mechanics create product risk before UX/prototype choices. |
| Repeat-use job, return trigger, churn risk, recovery path, or retention signal is unclear | `$retention-map` | The product needs a natural return model before designing engagement, lifecycle messages, or saved state. |
| Stage instrumentation, leading indicators, or lifecycle handoff metrics are unclear | `$lifecycle-metrics` | The journey has stage risks but needs measurement before growth or implementation planning. Prefer this over `$hook-model` for enterprise, infrastructure, transactional, or naturally infrequent products. |
| Product value depends on repeat use, habit formation, engagement loops, retention triggers, saved state, social rewards, or investment compounding | Check `.agents/project.json.enabled_packs` for `business-growth` — if missing, recommend `$pack install business-growth`; if enabled, recommend `$hook-model` | Use only for consumer, prosumer, PLG, marketplace, community, or B2B-with-consumer-component products where habit-loop design should shape UX before `$ux-variations`. Do not force this on B2B/enterprise, infrastructure, transactional, or naturally infrequent products; route those to `$lifecycle-metrics` or, when `business-growth` is enabled and a broader success framework is needed, `$metrics`. |
| Expansion, upgrade, seat growth, referral, advocacy, or land-and-expand path is material | `$expansion-map` | Expansion mechanics change lifecycle sequencing, account roles, or product surface priorities. |
| Jobs, pains, gains, aha moment, or solution fit are weak, disputed, or need explicit scoring | Check `.agents/project.json.enabled_packs` for `business-discovery` — if missing, recommend `$pack install business-discovery`; if enabled, recommend `$value-prop-canvas` | Use the existing Strategyzer-style framework only when fit risk would make positioning or UX premature. |
| Revenue, channel, cost, defensibility, or unfair-advantage assumptions are material risks | Check `.agents/project.json.enabled_packs` for `business-discovery` — if missing, recommend `$pack install business-discovery`; if enabled, recommend `$lean-canvas` | Use the existing Ash Maurya Lean Canvas framework when the journey exposes business-model risk before UX/prototype decisions. |
| Pricing gates, packaging, free-to-paid timing, or willingness-to-pay moments are central to the journey | Check `.agents/project.json.enabled_packs` for `business-growth` — if missing, recommend `$pack install business-growth`; if enabled, recommend `$monetization` | Use when pricing architecture must be grounded before conversion, transaction, or prototype choices. |
| Acquisition source, launch channel, messaging route, or early traction mechanism is a journey blocker | Check `.agents/project.json.enabled_packs` for `business-growth` — if missing, recommend `$pack install business-growth`; if enabled, recommend `$gtm` | Use after enough ICP/competitive/journey evidence exists and the channel path changes product or UX priorities. |

`$growth-model` is an existing Reforge-style framework owner for compounding acquisition, retention, and monetization loops, but do not route to it directly from `journey-map` unless metrics/GTM prerequisites are already satisfied. In most AFPS cases, `$hook-model`, `$metrics`, `$monetization`, or `$gtm` is the earlier business-growth detour.

## Output Shape

```markdown
# Journey Map

> Based on: research/icp.md[, other evidence]
> Date: YYYY-MM-DD

## Summary
## User Journeys
## Customer Lifecycle
## Critical Moments
## Stage Detail Index
## Journey Gaps
## Next Steps
```

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/journey-map-{topic}.html`.

**Journey research translation.** Render the lifecycle overview as approval-ready research, not a chat-only summary. The alignment page must include the proposed `research/journey-map.md` content, proposed `research/journey-map-interview.md` decision log, evidence coverage by journey stage, assumptions/confidence register, critical-moment evidence matrix, proposed file changes, and approval gates before canonical research files are created or updated.

Before approval, the next action is review of `alignment/journey-map-{topic}.html` and compiled YAML answers from that page. Do not treat a plain-text lifecycle summary as a substitute for the HTML alignment preview.

## Constraints

- Keep this file as the overview; put step-level stage detail in the focused lifecycle skills.
- Ground every important step in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe UI or architecture.
- Present findings before writing.
- Follow the archive-first replacement policy for canonical research/spec documents.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

