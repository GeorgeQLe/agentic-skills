---
name: transaction-map
description: Plan purchase, checkout, payment, fulfillment, receipt, refund, dispute, and trust-state flows
type: analysis
version: v0.1
argument-hint: "[optional: app, transaction type, or payment scenario]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill.

# Transaction Map



Map the operational transaction flow after a customer decides to buy or upgrade.

## Workflow

1. Resolve app scope using `research/{app}/` when applicable.
2. Require `research/journey-map.md`; recommend `/conversion-map` first when conversion decision logic is missing.
3. Load journey map, conversion map, monetization docs, specs, codebase payment routes/providers, support/refund policy docs, and customer feedback when present.
4. Interview and recommend around: checkout entry, plan/quantity selection, payment states, tax/invoice needs, account provisioning, fulfillment, receipts, failed payment recovery, refunds, cancellations, disputes, trust/safety messages, and support handoff.
5. Present transaction states and failure modes before writing.
6. Write `research/transaction-map.md` and `research/transaction-map-interview.md` after validation.

## Output Shape

```markdown
# Transaction Map

> Based on: research/journey-map.md[, research/conversion-map.md]
> Date: YYYY-MM-DD

## Summary
## Transaction Types
## Checkout And Payment Flow
## Provisioning And Fulfillment
## Receipts, Invoices, And Records
## Failure, Refund, And Dispute States
## Trust And Support Touchpoints
## Product Gaps
## Next Steps
```

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/transaction-map-{topic}.html`.

## Constraints

- Keep the map provider-agnostic unless the codebase or specs already choose a payment provider.
- Identify compliance, tax, or legal questions as gaps; do not invent policy.
- End with `## Next Steps`, preferring `/retention-map`, `/guide`, or `/lifecycle-metrics` as context dictates.
