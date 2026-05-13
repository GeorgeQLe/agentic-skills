---
name: onboarding-map
description: Plan signup, setup, activation, first success, onboarding drop-offs, and time-to-value for each lifecycle persona
type: analysis
version: 1.0.0
argument-hint: "[optional: app, persona, or onboarding segment]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill.

# Onboarding Map



Create the stage-level onboarding plan that expands `research/journey-map.md`.

## Workflow

1. Resolve app scope using the same `research/{app}/` convention as `/journey-map`.
2. Require `research/journey-map.md` or `research/{app}/journey-map.md`; if missing, recommend `/journey-map`.
3. Load ICP, journey map, specs, customer feedback, metrics, and current product routes/components when present.
4. Interview and recommend around: signup entry points, account creation, required setup, imports/integrations, team invites, empty states, first-session guidance, first 5 minutes/hour/day, aha threshold, drop-offs, recovery, and support touchpoints.
5. Present the proposed onboarding model before writing.
6. Write `research/onboarding-map.md` and `research/onboarding-map-interview.md` after validation.

## Output Shape

```markdown
# Onboarding Map

> Based on: research/journey-map.md
> Date: YYYY-MM-DD

## Summary
## Personas And Entry Points
## Signup And Setup Flow
## Activation Path
## First Success
## Drop-Offs And Recovery
## Instrumentation Needs
## Product Gaps
## Next Steps
```

## Constraints

- Stay stage-specific; do not rewrite the whole journey map.
- Make onboarding steps concrete enough to drive specs, UX variations, and instrumentation.
- End with `## Next Steps`, preferring `/conversion-map`, `/lifecycle-metrics`, `/ux-variation`, or `/spec-interview` as context dictates.
