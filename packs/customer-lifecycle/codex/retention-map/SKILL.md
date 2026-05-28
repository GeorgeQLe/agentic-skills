---
name: retention-map
description: Plan repeat-use loops, lifecycle triggers, churn risks, recovery paths, and retention signals
type: analysis
version: v0.2
argument-hint: "[optional: app, persona, or retention stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill.

# Retention Map

Invoke as `$retention-map`.

Map why customers return, what predicts churn, and how the product recovers at-risk users.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading. Scope the retention map to the active product path by default.
3. Require `research/journey-map.md`; if missing, recommend `$journey-map`.
4. Load journey, onboarding, conversion, transaction, metrics, customer feedback, specs, and product evidence when present.
5. Interview and recommend around: repeat-use job, natural frequency, core habit/workflow loop, lifecycle messages, saved state, collaboration, renewal moments, churn triggers, downgrade/cancel paths, winback, support recovery, and leading indicators.
6. Present the retention model and risk assumptions before writing.
7. Write `research/retention-map.md` and `research/retention-map-interview.md` after validation.

## Output Shape

```markdown
# Retention Map

> Based on: research/journey-map.md
> Date: YYYY-MM-DD

## Summary
## Repeat-Use Loop
## Lifecycle Triggers
## Healthy Usage Signals
## Churn Triggers
## Recovery And Winback
## Product Gaps
## Next Steps
```

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/retention-map-{topic}.html`.

## Constraints

- Do not force habit-loop language onto naturally infrequent or transactional products; document the natural return trigger instead.
- End with `## Next Steps`, preferring `$expansion-map`, `$lifecycle-metrics`, `$hook-model`, `$customer-feedback`, or `$cohort-review` as context dictates.
