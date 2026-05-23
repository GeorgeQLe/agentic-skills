---
name: conversion-map
description: Plan evaluation, trial, pricing decision, objections, buyer roles, and conversion triggers
type: analysis
version: v0.0
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/conversion-map-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/conversion-map-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Keep conversion separate from payment mechanics; use `/transaction-map` for checkout, payments, fulfillment, refunds, and receipts.
- End with `## Next Steps`, preferring `/transaction-map`, `/monetization`, `/gtm`, `/experiment`, or `/spec-interview` as context dictates.
