---
name: lifecycle-metrics
description: Define stage metrics, instrumentation needs, and evidence gaps across onboarding, conversion, transaction, retention, and expansion
type: analysis
version: v0.0
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/lifecycle-metrics-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/lifecycle-metrics-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not duplicate the full `$metrics` framework; link unresolved targets to `$metrics`.
- Put future, non-blocking measurements in `tasks/record-todo.md` when the skill is executed.
- End with `## Next Steps`, preferring `$metrics`, `$spec-interview`, `$roadmap`, `$run`, or `$cohort-review` as context dictates.
