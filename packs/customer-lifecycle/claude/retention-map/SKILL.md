---
name: retention-map
description: Plan repeat-use loops, lifecycle triggers, churn risks, recovery paths, and retention signals
type: analysis
version: 1.0.0
argument-hint: "[optional: app, persona, or retention stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill.

# Retention Map



Map why customers return, what predicts churn, and how the product recovers at-risk users.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Require `research/journey-map.md`; if missing, recommend `/journey-map`.
3. Load journey, onboarding, conversion, transaction, metrics, customer feedback, specs, and product evidence when present.
4. Interview and recommend around: repeat-use job, natural frequency, core habit/workflow loop, lifecycle messages, saved state, collaboration, renewal moments, churn triggers, downgrade/cancel paths, winback, support recovery, and leading indicators.
5. Present the retention model and risk assumptions before writing.
6. Write `research/retention-map.md` and `research/retention-map-interview.md` after validation.

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

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/retention-map-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/retention-map-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not force habit-loop language onto naturally infrequent or transactional products; document the natural return trigger instead.
- End with `## Next Steps`, preferring `/expansion-map`, `/lifecycle-metrics`, `/hook-model`, `/customer-feedback`, or `/cohort-review` as context dictates.
