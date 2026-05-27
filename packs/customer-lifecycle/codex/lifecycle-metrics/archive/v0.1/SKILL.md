---
name: lifecycle-metrics
description: Define stage metrics, instrumentation needs, and evidence gaps across onboarding, conversion, transaction, retention, and expansion
type: analysis
version: v0.1
argument-hint: "[optional: app or lifecycle stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill.

# Lifecycle Metrics

Invoke as `$lifecycle-metrics`.

Define measurable signals for each lifecycle stage. This complements `$metrics`: use this skill for stage instrumentation and handoff clarity, then use `$metrics` for the broader success framework, targets, and business metrics.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Require `research/journey-map.md`; load any focused lifecycle maps that exist.
3. Load ICP, customer feedback, existing metrics, specs, README, and current analytics/instrumentation code when present.
4. Interview and recommend around: stage entry/exit events, activation, conversion, payment success/failure, retention health, churn risk, expansion readiness, evidence quality, measurement owner, and instrumentation gaps.
5. Present the lifecycle measurement model before writing.
6. Write `research/lifecycle-metrics.md` and `research/lifecycle-metrics-interview.md` after validation.

## Output Shape

```markdown
# Lifecycle Metrics

> Based on: research/journey-map.md[, lifecycle stage maps]
> Date: YYYY-MM-DD

## Summary
## Stage Metrics
## Event And Property Inventory
## Instrumentation Gaps
## Baselines And Targets To Define In Metrics
## Record-Todo Candidates
## Next Steps
```

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/lifecycle-metrics-{topic}.html`.

## Constraints

- Do not duplicate the full `$metrics` framework; link unresolved targets to `$metrics`.
- Put future, non-blocking measurements in `tasks/record-todo.md` when the skill is executed.
- End with `## Next Steps`, preferring `$metrics`, `$roadmap`, `$exec`, or `$cohort-review` as context dictates.
