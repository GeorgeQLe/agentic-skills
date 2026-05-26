---
name: journey-map
description: Map the full user and customer lifecycle from trigger and discovery through onboarding, aha, conversion, retention, expansion, and advocacy
type: analysis
version: v0.2
argument-hint: "[optional: app, use case, persona, or lifecycle stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Journey Map — Lifecycle Overview

Invoke as `$journey-map`.

Create or update the canonical lifecycle overview. This is the top-level map for user task journeys and the customer relationship lifecycle; deeper stage docs belong in `$onboarding-map`, `$conversion-map`, `$transaction-map`, `$retention-map`, `$expansion-map`, and `$lifecycle-metrics`.

## Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist — run `$icp` first.
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

The output file must end with `## Next Steps` using "Pick one:" framing. Default AFPS routing after the overview is `$positioning` when `research/positioning.md` is missing, because positioning should use ICP, competitive analysis, and journey evidence. Then route to `$ux-variations`, `$ui-interview`, prototype work, `$uat --variant-evaluation`, `$consolidate-variations`, `$research-roadmap --post-prototype`, `$spec-interview`, and `$roadmap` as evidence becomes available. Recommend deeper lifecycle maps (`$onboarding-map`, `$conversion-map`, `$transaction-map`, `$retention-map`, `$expansion-map`, `$lifecycle-metrics`) only when the overview exposes a specific stage risk that needs detail before positioning or UX work.

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

## Constraints

- Keep this file as the overview; put step-level stage detail in the focused lifecycle skills.
- Ground every important step in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe UI or architecture.
- Present findings before writing.
- Follow the archive-first replacement policy for canonical research/spec documents.
