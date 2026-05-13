---
name: expansion-map
description: Plan account expansion, upgrades, seat growth, referrals, advocacy, and land-and-expand paths
type: analysis
version: 1.0.0
argument-hint: "[optional: app, segment, or expansion motion]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill.

# Expansion Map

Invoke as `$expansion-map`.

Map how retained customers grow into larger accounts, higher usage, referrals, or advocacy.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Require `research/journey-map.md`; if missing, recommend `$journey-map`.
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

## Constraints

- Separate genuine expansion from ordinary retention.
- For enterprise products, identify champion, buyer, admin, security, and procurement roles when relevant.
- End with `## Next Steps`, preferring `$lifecycle-metrics`, `$monetization`, `$growth-model`, `$gtm`, or `$spec-interview` as context dictates.
