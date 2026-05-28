---
name: onboarding-map
description: Plan signup, setup, activation, first success, onboarding drop-offs, and time-to-value for each lifecycle persona
type: analysis
version: v0.2
argument-hint: "[optional: app, persona, or onboarding segment]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill.

# Onboarding Map



Create the stage-level onboarding plan that expands `research/journey-map.md`.

## Workflow

1. Resolve app scope using the same `research/{app}/` convention as `/journey-map`.
2. Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading. Scope the onboarding map to the active product path by default.
3. Require `research/journey-map.md` or `research/{app}/journey-map.md`; if missing, recommend `/journey-map`.
4. Load ICP, journey map, specs, customer feedback, metrics, and current product routes/components when present.
5. Interview and recommend around: signup entry points, account creation, required setup, imports/integrations, team invites, empty states, first-session guidance, first 5 minutes/hour/day, aha threshold, drop-offs, recovery, and support touchpoints.
6. Present the proposed onboarding model before writing.
7. Write `research/onboarding-map.md` and `research/onboarding-map-interview.md` after validation.

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

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/onboarding-map-{topic}.html`.

## Constraints

- Stay stage-specific; do not rewrite the whole journey map.
- Make onboarding steps concrete enough to drive specs, UX variations, and instrumentation.
- End with `## Next Steps`, preferring `/conversion-map`, `/lifecycle-metrics`, `/ux-variations` as context dictates.
