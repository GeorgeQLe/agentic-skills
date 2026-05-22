---
name: onboarding-map
description: Plan signup, setup, activation, first success, onboarding drop-offs, and time-to-value for each lifecycle persona
type: analysis
version: 1.0.0
argument-hint: "[optional: app, persona, or onboarding segment]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill.

# Onboarding Map

Invoke as `$onboarding-map`.

Create the stage-level onboarding plan that expands `research/journey-map.md`.

## Workflow

1. Resolve app scope using the same `research/{app}/` convention as `$journey-map`.
2. Require `research/journey-map.md` or `research/{app}/journey-map.md`; if missing, recommend `$journey-map`.
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

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/onboarding-map-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/onboarding-map-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/onboarding-map-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Stay stage-specific; do not rewrite the whole journey map.
- Make onboarding steps concrete enough to drive specs, UX variations, and instrumentation.
- End with `## Next Steps`, preferring `$conversion-map`, `$lifecycle-metrics`, `$ux-variations`, or `$spec-interview` as context dictates.
