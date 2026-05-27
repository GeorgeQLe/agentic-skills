---
name: journey-map
description: Map the full user and customer lifecycle from trigger and discovery through onboarding, aha, conversion, retention, expansion, and advocacy
type: analysis
version: v0.4
argument-hint: "[optional: app, use case, persona, or lifecycle stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Journey Map — Lifecycle Overview

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Create or update the canonical lifecycle overview. This is the top-level map for user task journeys and the customer relationship lifecycle; deeper stage docs belong in `/onboarding-map`, `/conversion-map`, `/transaction-map`, `/retention-map`, `/expansion-map`, and `/lifecycle-metrics`.

## Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist — run `/icp` first.
- Specs, competitive analysis, enterprise ICP, customer feedback, and codebase evidence are supporting context when present.

## Workflow

0. **App scope resolution**: If `$ARGUMENTS` names a subdirectory of `research/`, use `research/{app}/` and `specs/{app}/`. If `research/` has multiple app subdirectories and no app is specified, ask the user to choose. If one app subdirectory exists, use it automatically. Otherwise use flat `research/` and `specs/`.
1. **Load context**: Read ICP, competitive analysis, enterprise ICP, customer feedback, existing lifecycle docs, specs, README/AGENTS/CLAUDE, and relevant source files when they clarify real product surfaces.
2. **Map user journeys**: For each key persona, identify 3-5 core use cases, entry points, task steps, decision points, happy path, failure modes, outputs, and delta from current state.
3. **Map customer lifecycle**: Cover trigger, discovery, evaluation, onboarding, aha moment, conversion, transaction, retention, expansion, advocacy, churn, and recovery.
4. **Identify critical moments**: Name the 3-5 moments where the product wins or loses the user/customer, with evidence and success criteria.
5. **Present before writing**: Summarize the lifecycle, evidence, open assumptions, and stage docs that should be split out. Ask what needs correction or product-specific context. Continue until validated.
6. **Write only after validation**, archiving existing canonical files first when replacing them.

## Deliverables

- `research/journey-map.md` (or `research/{app}/journey-map.md`) — canonical lifecycle overview with links or references to deeper stage docs when they exist.
- `research/journey-map-interview.md` (or `research/{app}/journey-map-interview.md`) — raw interview log and decisions.

The output file must end with `## Next Steps` using "Pick one:" framing. Follow the Next-Step Routing contract below to decide the recommendation.

## Next-Step Routing

Priority-ordered decision tree — recommend the **first** match:

1. **Positioning missing** (`research/positioning.md` does not exist) → check `.agents/project.json.enabled_packs` for `business-discovery` — if `business-discovery` is not enabled, recommend `/pack install business-discovery` first; if `business-discovery` is enabled, recommend `/positioning` — Positioning needs ICP, competitive analysis, and journey evidence, so it is the natural next step.
2. **Positioning done, UX variations missing** → check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `/pack install product-design` first; if `product-design` is enabled, recommend `/ux-variations` — Explore experience directions before production specification.
3. **Specific stage risk** — the overview exposed a lifecycle-stage risk that must be resolved before positioning or UX work can proceed → recommend the relevant lifecycle map (`/onboarding-map`, `/conversion-map`, `/transaction-map`, `/retention-map`, `/expansion-map`, or `/lifecycle-metrics`). Cite the risk and explain why it blocks the next AFPS step.
4. **Never** recommend `/spec-interview` from this skill — it is many steps downstream in the AFPS chain.

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

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/journey-map-{topic}.html`.

**Journey research translation.** Render the lifecycle overview as approval-ready research, not a chat-only summary. The alignment page must include the proposed `research/journey-map.md` content, proposed `research/journey-map-interview.md` decision log, evidence coverage by journey stage, assumptions/confidence register, critical-moment evidence matrix, proposed file changes, and approval gates before canonical research files are created or updated.

Before approval, the next action is review of `alignment/journey-map-{topic}.html` and compiled YAML answers from that page. Do not treat a plain-text lifecycle summary as a substitute for the HTML alignment preview.

## Constraints

- Keep this file as the overview; put step-level stage detail in the focused lifecycle skills.
- Ground every important step in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe UI or architecture.
- Present findings before writing.
- Follow the archive-first replacement policy for canonical research/spec documents.
