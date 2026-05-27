---
name: conversion-map
description: Plan evaluation, trial, pricing decision, objections, buyer roles, and conversion triggers
type: analysis
version: v0.2
argument-hint: "[optional: app, segment, or conversion motion]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill.

# Conversion Map

Invoke as `$conversion-map`.

Map how evaluators become customers, including the decision path from first value to commitment.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading. Scope the conversion map to the active product path by default.
3. Require `research/journey-map.md`; if missing, recommend `$journey-map`.
4. Load ICP, journey map, onboarding map, competitive analysis, monetization/GTM docs, specs, and feedback when present.
5. Interview and recommend around: evaluation mode, trial/freemium/demo motion, buyer and user roles, proof required, conversion trigger, objections, pricing/packaging concerns, sales assist, procurement, timeline, and lost-deal reasons.
6. Present the conversion model and unresolved assumptions before writing.
7. Write `research/conversion-map.md` and `research/conversion-map-interview.md` after validation.

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

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/conversion-map-{topic}.html`.

## Constraints

- Keep conversion separate from payment mechanics; use `$transaction-map` for checkout, payments, fulfillment, refunds, and receipts.
- End with `## Next Steps`, preferring `$transaction-map`, `$monetization`, `$gtm`, `$experiment` as context dictates.
