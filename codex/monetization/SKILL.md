---
name: monetization
description: Research-driven monetization strategy — revenue models, pricing architecture, unit economics, and packaging grounded in ICP and competitive data
type: research
version: 1.1.0
argument-hint: [optional: focus area e.g. "pricing tiers", "usage-based", "freemium"]
---

# Monetization — Revenue & Pricing Strategy

Deep-research skill that analyzes how to monetize the product. Combines web research on revenue models in the category with codebase analysis, ICP data, and competitive pricing to produce a monetization strategy validated through user interview checkpoints.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Soft**: Read these if they exist — each adds specificity:
  - `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) — competitor pricing, tiers, freemium models
  - `research/journey-map.md` (or `research/{app}/journey-map.md`) — where value is delivered, conversion triggers
  - `research/metrics.md` (or `research/{app}/metrics.md`) — activation, engagement, retention signals
  - `research/gtm.md` (or `research/{app}/gtm.md`) — existing pricing strategy and channel economics
  - `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) — willingness-to-pay signals, pricing complaints
  - `specs/*.md` (or `specs/{app}/*.md`) — what's being built, feature scope

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

Read all prerequisite files. From each, extract monetization-relevant signals:

- **ICP**: buyer budget, purchasing process, current spend on alternatives, company size segments, price sensitivity
- **Competitive analysis**: competitor pricing models, tier structures, free vs paid boundaries, published pricing pages
- **Journey map**: where the "aha moment" happens, what triggers conversion, what drives expansion
- **Metrics**: activation rate, engagement depth, retention curves — these constrain what models are viable
- **GTM**: if pricing strategy already exists in gtm.md, treat it as a starting point to deepen, not duplicate
- **Customer feedback**: direct willingness-to-pay signals, complaints about competitor pricing, feature requests tied to upgrade triggers

Read CLAUDE.md, README, and key source files for product context.

### 2. Market Research — Revenue Models in Category

Use WebSearch with **6–10 targeted queries**. Log every query and finding to the research log.

Query strategies (adapt to domain):
1. **Category pricing** — "[category] pricing models", "[category] SaaS pricing"
2. **Competitor pricing pages** — "[competitor] pricing", "[competitor] plans" (use WebFetch on pricing pages for detail)
3. **Revenue model analysis** — "[category] revenue model", "[category] business model"
4. **Pricing benchmarks** — "[category] average deal size", "[category] ARPU", "[category] pricing benchmark"
5. **Freemium analysis** — "[category] freemium conversion rate", "freemium vs free trial [category]"
6. **Usage-based research** — "usage-based pricing [category]", "consumption pricing [category]"
7. **Pricing psychology** — "[category] pricing page best practices", "SaaS pricing strategy [market segment]"
8. **Unit economics** — "[category] CAC", "[category] LTV", "[category] payback period"
9. **Expansion revenue** — "[category] expansion revenue", "[category] upsell triggers"
10. **Pricing failures** — "[competitor] pricing backlash", "[category] pricing mistakes"

### 3. Identify Revenue Model Options — Present & Validate

From research evidence and product context, identify **2–4 viable revenue model options**. For each:

- **Model type**: subscription (flat/tiered), usage-based, hybrid, marketplace, freemium, open-core, one-time, etc.
- **Evidence**: which competitors or adjacent products use this model, and how it performs
- **Fit with ICP**: does the buying process support this? (e.g., seat-based works poorly if the buyer doesn't know team size upfront)
- **Fit with product**: does the value delivery pattern match? (e.g., usage-based works when value scales with consumption)
- **Risks**: what could go wrong? (e.g., usage-based creates unpredictable costs that enterprise procurement hates)

**Checkpoint 1 — Present models with a recommendation.** If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text. Show all options with evidence and fit analysis. State which model you recommend and why (grounded in ICP fit, product fit, and market evidence). Then ask:
- "I recommend [model] based on [key evidence]. Does this feel right, or should we explore a different model?"
- "Any hard constraints I should know? (e.g., must have a free tier, can't do per-seat)"

Incorporate feedback before proceeding.

### 4. Deep-Dive: Pricing Architecture

For the selected model (or top 2 if the user is undecided), research and design:

#### A. Value Metric
- What unit does the customer pay for? (seats, usage, features, outcomes)
- Does the value metric align with how the customer perceives value?
- Does it grow naturally as the customer gets more value? (expansion-friendly)

#### B. Tier Design
- How many tiers? (typically 2–4 for B2B SaaS)
- What's the free tier / trial structure? What's the upgrade trigger?
- What features gate each tier? (map against journey stages — free tier should reach "aha moment")
- What's the "good-better-best" progression?

#### C. Price Points
- Anchor against competitor pricing and ICP budget signals
- Entry price: low enough to reduce friction, high enough to signal value
- Price-to-value ratio vs. alternatives
- Annual vs. monthly discount structure

#### D. Packaging
- What's bundled vs. add-on?
- Are there usage limits, and where do they kick in?
- Enterprise tier: what justifies the custom pricing? (SSO, SLA, dedicated support, compliance)

**Checkpoint 2 — Present pricing architecture to the user.** If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text. Show tier design, price points, and packaging — cite competitor pricing benchmarks that anchor each price point, ICP willingness-to-pay signals that validate the range, and journey-stage alignment that justifies feature gates. Then ask:
- "Does this pricing feel right for your market? Too high, too low?"
- "Any features that absolutely must be free? Any that must be gated?"

Incorporate feedback before proceeding.

### 5. Unit Economics & Viability

Estimate (with stated assumptions and confidence levels):

- **CAC** — cost to acquire a customer, based on GTM channels
- **LTV** — lifetime value, based on pricing × estimated retention
- **LTV:CAC ratio** — is it viable? (target: 3:1+ for SaaS)
- **Payback period** — months to recoup acquisition cost
- **Expansion revenue potential** — how much can revenue grow per account over time?
- **Gross margin** — revenue minus cost of delivery (infrastructure, support)

If data is insufficient for estimates, state what data is needed and recommend how to gather it (e.g., "run a pricing survey", "track activation-to-conversion for 30 days").

**Checkpoint 3 — Present unit economics to the user.** If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text. Show the estimates with assumptions, then ask:
- "Do these assumptions feel reasonable? Any I should adjust?"
- "What's your target margin or payback period?"

### 6. Monetization Timing & Sequencing

Based on product stage and ICP:

- **When to introduce paid**: before launch (validate willingness-to-pay), at launch, or post-traction?
- **What stays free permanently** vs. what's a trial/teaser
- **Pricing evolution**: how should pricing change as the product matures? (e.g., start low and raise, start high and introduce a free tier)
- **Revenue diversification**: are there secondary revenue streams? (marketplace, data, services, partnerships)

### 7. Populate Next Steps

Check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- IF no `research/gtm.md`: `$gtm` — Build go-to-market plan with pricing from this strategy
- IF `research/gtm.md` exists but predates this analysis: `$gtm` — Update GTM with refined pricing strategy
- IF no `research/metrics.md`: `$metrics` — Define metrics to track monetization health (conversion, expansion, churn)
- IF no `research/journey-map.md`: `$journey-map` — Map the journey to validate where pricing gates belong
- IF `specs/` exist and no `tasks/roadmap.md`: `$roadmap` — Plan the build with monetization milestones
- IF codebase exists: `$mvp-gap` — Check if the product delivers enough value to charge
- IF product is live and revenue exists: `$runway-model` — Track actual financial performance against these estimates

### 8. Final Review & Write

Present the **complete monetization strategy** to the user — revenue model, pricing architecture, unit economics, timing. Ask:
- "Ready to write this to `research/monetization.md`? Anything to adjust first?"

Only after the user confirms, write the output files.

## Output

### `research/monetization.md` (or `research/{app}/monetization.md`)

```markdown
# Monetization Strategy

> Based on: research/icp.md (or research/{app}/icp.md)[, research/competitive-analysis.md, research/journey-map.md, research/metrics.md, research/gtm.md, research/customer-feedback.md]
> Date: [current date]

## Summary
[2-3 sentences: the core monetization thesis — revenue model, target price range, and why this approach fits the ICP]

## Revenue Model
**Selected model**: [model type]
**Rationale**: [why this model fits the ICP, product, and market]
**Evidence**: [competitor precedent, market research]

### Models Considered & Rejected
| Model | Why Considered | Why Rejected |
|-------|---------------|-------------|
| ... | ... | ... |

## Value Metric
**Customers pay for**: [the unit — seats, usage, features, outcomes]
**Why this metric**: [alignment with perceived value, expansion-friendliness]

## Pricing Tiers

| Tier | Price | Target Segment | Key Features | Upgrade Trigger |
|------|-------|----------------|-------------|----------------|
| Free / Trial | ... | ... | ... | ... |
| Starter | ... | ... | ... | ... |
| Pro | ... | ... | ... | ... |
| Enterprise | Custom | ... | ... | ... |

### Free Tier / Trial Design
[What's included, what's limited, what triggers the upgrade — must reach "aha moment"]

### Feature Gating
[Which features are in which tier, and why — grounded in journey stages]

### Enterprise Justification
[What justifies custom pricing — SSO, SLA, compliance, dedicated support, volume]

## Price Points

### Anchoring & Rationale
[How prices were set — competitor anchoring, ICP budget signals, value-based reasoning]

### Annual vs. Monthly
[Discount structure, rationale]

### Packaging & Add-ons
[What's bundled, what's separate, usage limits and overages]

## Unit Economics (Estimated)

| Metric | Estimate | Assumption | Confidence |
|--------|----------|------------|------------|
| CAC | ... | ... | Low/Medium/High |
| LTV | ... | ... | ... |
| LTV:CAC | ... | ... | ... |
| Payback Period | ... | ... | ... |
| Gross Margin | ... | ... | ... |
| Expansion Revenue | ... | ... | ... |

### Data Gaps
[What data is needed to improve these estimates — and how to gather it]

## Monetization Timing

### When to Charge
[Before launch / at launch / post-traction — with rationale]

### What Stays Free
[Features or usage levels that remain free permanently, and why]

### Pricing Evolution
[How pricing should change as product matures — roadmap of pricing milestones]

### Revenue Diversification
[Secondary revenue streams if applicable — marketplace, services, data, partnerships]

## Open Questions
[Pricing experiments to run, decisions that need real-world data, A/B tests to consider]

## Next Steps

Pick one:
- [conditional items from step 7 — only include items whose conditions are met]
```

### `research/monetization-interview.md` (or `research/{app}/monetization-interview.md`)
Raw interview log — questions, options presented, user responses, checkpoint validations, and a closing summary of key decisions and deviations.

Create the `research/` (or `research/{app}/`) directory if it doesn't exist.

## Constraints

- **Requires ICP.** Cannot build a monetization strategy without knowing who pays and why.
- **Evidence-based.** Every pricing decision must trace back to research evidence (competitor data, market benchmarks, ICP signals). Do not invent price points from intuition.
- **Present before writing.** Never write output files until findings have been presented and validated through all three checkpoints.
- **Don't duplicate GTM.** If `research/gtm.md` already has a pricing section, deepen it rather than contradict it. Note any conflicts and ask the user to resolve. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`.
- **Don't prescribe product changes.** If the product doesn't deliver enough value to support the pricing, note it as a gap — that's `/mvp-gap`'s job.
- **Do not overwrite existing `research/monetization.md`** (or `research/{app}/monetization.md`) without asking the user first.
- **Minimum research depth**: at least 6 WebSearch queries before presenting revenue model options, then targeted queries per model option.
- **State assumptions.** Every unit economics estimate must include the assumption behind it and a confidence level. Never present estimates as facts.
