---
name: expansion-map
description: Plan account expansion, upgrades, seat growth, referrals, advocacy, and land-and-expand paths
type: analysis
version: v0.0
argument-hint: "[optional: app, segment, or expansion motion]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill.

# Expansion Map



Map how retained customers grow into larger accounts, higher usage, referrals, or advocacy.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Require `research/journey-map.md`; if missing, recommend `/journey-map`.
3. Load journey, retention, monetization, GTM, enterprise ICP, metrics, customer feedback, and specs when present.
4. Interview and recommend around: expansion trigger, added seats/users, usage expansion, tier upgrades, team rollout, integrations, procurement renewal, referrals, reviews, advocacy, and account-health thresholds.
5. Present the expansion model before writing.
6. Write `research/expansion-map.md` and `research/expansion-map-interview.md` after validation.

## Output Shape

```markdown
# Expansion Map

> Based on: research/journey-map.md[, research/retention-map.md]
> Date: YYYY-MM-DD

## Summary
## Expansion Triggers
## Upgrade And Seat Growth Paths
## Team Or Account Rollout
## Referral And Advocacy Paths
## Risks And Constraints
## Product Gaps
## Next Steps
```

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/expansion-map-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/expansion-map-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/expansion-map-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Separate genuine expansion from ordinary retention.
- For enterprise products, identify champion, buyer, admin, security, and procurement roles when relevant.
- End with `## Next Steps`, preferring `/lifecycle-metrics`, `/monetization`, `/growth-model`, `/gtm`, or `/spec-interview` as context dictates.
