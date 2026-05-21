---
name: conversion-map
description: Plan evaluation, trial, pricing decision, objections, buyer roles, and conversion triggers
type: analysis
version: 1.0.0
argument-hint: "[optional: app, segment, or conversion motion]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill.

# Conversion Map



Map how evaluators become customers, including the decision path from first value to commitment.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Require `research/journey-map.md`; if missing, recommend `/journey-map`.
3. Load ICP, journey map, onboarding map, competitive analysis, monetization/GTM docs, specs, and feedback when present.
4. Interview and recommend around: evaluation mode, trial/freemium/demo motion, buyer and user roles, proof required, conversion trigger, objections, pricing/packaging concerns, sales assist, procurement, timeline, and lost-deal reasons.
5. Present the conversion model and unresolved assumptions before writing.
6. Write `research/conversion-map.md` and `research/conversion-map-interview.md` after validation.

## Output Shape

```markdown
# Conversion Map

> Based on: research/journey-map.md
> Date: YYYY-MM-DD

## Summary
## Evaluation Path
## Buyer And Decision Roles
## Conversion Trigger
## Objections And Proof
## Pricing And Packaging Implications
## Drop-Offs And Recovery
## Product Gaps
## Next Steps
```

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/conversion-map-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/conversion-map-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Keep conversion separate from payment mechanics; use `/transaction-map` for checkout, payments, fulfillment, refunds, and receipts.
- End with `## Next Steps`, preferring `/transaction-map`, `/monetization`, `/gtm`, `/experiment`, or `/spec-interview` as context dictates.
