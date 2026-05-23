---
name: transaction-map
description: Plan purchase, checkout, payment, fulfillment, receipt, refund, dispute, and trust-state flows
type: analysis
version: v0.0
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/transaction-map-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/transaction-map-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Keep the map provider-agnostic unless the codebase or specs already choose a payment provider.
- Identify compliance, tax, or legal questions as gaps; do not invent policy.
- End with `## Next Steps`, preferring `/retention-map`, `/spec-interview`, `/guide`, or `/lifecycle-metrics` as context dictates.
