---
name: metrics
description: Define success metrics framework — activation, engagement, retention, growth, and business metrics tied to journey stages
version: 1.0.0
argument-hint: [optional: focus area e.g. "activation", "retention"]
---

# Metrics — Success Metrics Framework

Interview-driven skill that defines measurable success metrics tied to journey stages. Each metric gets a definition, measurement method, target with rationale, and instrumentation requirements.

## Prerequisites

- **Hard**: `research/journey-map.md` must exist. If not, tell the user to run `/journey-map` first and stop.
- **Soft**: Read `research/icp.md` and `research/customer-feedback.md` if they exist — these improve target-setting and relevance.

## Process

### 1. Load Context

- Read `research/journey-map.md` — customer journey stages, aha moment, habit loop, churn triggers, critical moments
- Read `research/icp.md` if it exists — ICP segments, pain points, value props
- Read `research/customer-feedback.md` if it exists — real user behavior patterns, validated/invalidated assumptions
- Read CLAUDE.md and README if they exist — product context and tech stack (affects instrumentation)
- Read key source files if a codebase exists — understand what can actually be measured today

### 2. Interview

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn. Present options with pros/cons when genuine alternatives exist.

Cover these metric categories (skip or abbreviate areas the user has already addressed in `$ARGUMENTS`):

#### A. Activation Metrics
Tied to the **aha moment** from the journey map.
- What specific action signals that a user "gets it"? (the aha moment)
- How quickly should this happen after signup? (time-to-value target)
- What's the activation rate target? (% of signups who reach aha)
- Can this be measured today, or does instrumentation need to be built?

#### B. Engagement Metrics
Tied to the **habit loop** from the journey map.
- What does a "healthy" usage pattern look like? (daily/weekly/monthly, duration, depth)
- What's the core action that engaged users do repeatedly?
- What frequency indicates strong engagement vs. at-risk?
- Are there different engagement patterns by user profile?

#### C. Retention Metrics
Tied to **churn triggers** from the journey map.
- What defines retention? (still active after 7/30/90 days? Still paying?)
- What are the leading indicators of churn? (from journey map churn triggers)
- What's the target retention rate? By what timeframe?
- What's the current retention baseline (if any data exists)?

#### D. Growth Metrics
Tied to **expansion and advocacy** from the journey map.
- How do new users discover the product? (from journey map discovery channels)
- Is there a viral loop? What's the viral coefficient target?
- What expansion metrics matter? (seats added, usage increased, tier upgraded)
- What's the target growth rate? (week-over-week, month-over-month)

#### E. Business Metrics
Revenue, unit economics, sustainability.
- What's the revenue model? (from GTM if it exists, otherwise ask)
- What's the CAC target? (customer acquisition cost)
- What's the LTV target? (lifetime value)
- What's the LTV:CAC ratio target?
- What's the payback period target?

### 3. Present Findings & Validate

**Present the complete metrics framework to the user before writing.** Summarise:
1. Overview — the 5-8 key metrics and how they connect to journey stages
2. Each metric with definition, target, and measurement method
3. Instrumentation gaps — what can't be measured today
4. The "North Star" metric — the single metric that best captures overall health

Use AskUserQuestion to ask:
- "Does this metrics framework capture what success looks like? Any metrics missing or targets off?"

Continue until the user confirms. Only then proceed to writing.

### 4. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- IF instrumentation gaps and no specs for them: `/plan-interview [topic]` — Spec instrumentation for the top metric gap
- IF no `tasks/roadmap.md`: `/roadmap` — Plan the build with instrumentation phases
- IF no `research/gtm.md`: `/gtm` — Build a GTM plan — metrics define what launch success looks like
- IF `tasks/roadmap.md` exists: `/run` — Start building and instrumenting
- IF product is live and no `research/customer-feedback.md`: `/customer-feedback` — Collect data to validate metric targets

### 5. Write Output

Only after the user has validated the findings, write the output files.

## Output

### `research/metrics.md`

```markdown
# Success Metrics Framework

> Based on: research/journey-map.md[, research/icp.md, research/customer-feedback.md]
> Date: [current date]

## Summary
[2-3 sentences: the North Star metric, key health indicators, and biggest instrumentation gap]

## North Star Metric
**Metric**: [name]
**Definition**: [precise definition]
**Why this metric**: [how it captures overall product health]
**Target**: [specific number with timeframe]
**Current**: [baseline if known, or "not yet measured"]

## Activation

### [Metric Name]
**Definition**: [precise, unambiguous definition]
**Journey tie-in**: [which journey stage/moment this measures — reference journey-map.md]
**Measurement**: [how to measure — event, query, or manual process]
**Target**: [specific number] — [rationale for this target]
**Instrumentation**: [what needs to exist to measure this]
**Status**: [measurable today / needs instrumentation / needs design]

[Repeat for each activation metric]

## Engagement

### [Metric Name]
**Definition**: [precise definition]
**Journey tie-in**: [which habit loop or core action this tracks]
**Measurement**: [how to measure]
**Target**: [specific number] — [rationale]
**Instrumentation**: [what's needed]
**Status**: [measurable / needs work]

[Repeat for each engagement metric]

## Retention

### [Metric Name]
**Definition**: [precise definition]
**Journey tie-in**: [which churn trigger this monitors]
**Measurement**: [how to measure]
**Target**: [specific number] — [rationale]
**Instrumentation**: [what's needed]
**Status**: [measurable / needs work]

[Repeat for each retention metric]

## Growth

### [Metric Name]
**Definition**: [precise definition]
**Journey tie-in**: [which expansion/advocacy path this tracks]
**Measurement**: [how to measure]
**Target**: [specific number] — [rationale]
**Instrumentation**: [what's needed]
**Status**: [measurable / needs work]

## Business

### [Metric Name]
**Definition**: [precise definition]
**Measurement**: [how to measure]
**Target**: [specific number] — [rationale]
**Status**: [measurable / needs work]

[Repeat for each business metric]

## Instrumentation Gaps

| Metric | What's Missing | Effort | Priority |
|--------|---------------|--------|----------|
| [metric] | [what needs to be built] | S/M/L | [High/Med/Low] |

_Start with:_ `/plan-interview [instrumentation topic]` for high-priority gaps.

## Metric Dependencies
[How metrics relate to each other — e.g., activation drives retention, retention drives LTV. Identify which metrics are leading vs. lagging indicators.]

## Next Steps

Pick one:
- [conditional items from step 4 — only include items whose conditions are met]
```

### `research/metrics-interview.md`
Raw interview log — questions, options presented, user responses, and a closing summary of key decisions.

Create the `research/` directory if it doesn't exist.

## Constraints

- **Requires journey map.** Metrics must be tied to actual journey stages, not abstract business goals.
- **Be precise.** "User engagement" is not a metric. "Weekly active users who complete at least 3 [core action] per week" is.
- **Include instrumentation.** Every metric must specify how to measure it and whether that measurement exists today.
- **Present before writing.** Never write output files until the framework has been presented and validated.
- **Tie to journey stages.** Every non-business metric must reference a specific stage or moment from the journey map.
- **Do not overwrite existing `research/metrics.md`** without asking the user first.
