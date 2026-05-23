---
name: retention-map
description: Plan repeat-use loops, lifecycle triggers, churn risks, recovery paths, and retention signals
type: analysis
version: v0.0
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/retention-map-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/retention-map-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not force habit-loop language onto naturally infrequent or transactional products; document the natural return trigger instead.
- End with `## Next Steps`, preferring `/expansion-map`, `/lifecycle-metrics`, `/hook-model`, `/customer-feedback`, or `/cohort-review` as context dictates.
