---
name: journey-map
description: Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) through the product
version: 1.0.0
argument-hint: [optional: specific use case or journey stage to focus on]
---

# Journey Map — User & Customer Journey Mapping

Interview the user to map how people will flow through the product (user journey) and through the business relationship (customer journey). Requires both an ICP (`research/icp.md`) and at least one solution spec (`specs/*.md`) — this skill bridges research and execution by mapping the WITH-product experience.

## Prerequisites

- `research/icp.md` must exist. If not, tell the user to run `/icp` first and stop.
- At least one spec file must exist in `specs/`. If not, tell the user to run `/plan-interview` first and stop.

## Process

### 1. Load Context

- Read `research/icp.md` — customer profile, user profiles, trigger events, current-state journey, pain map, value prop
- Read `research/competitive-analysis.md` if it exists — competitor UX patterns and gaps
- Read all spec files in `specs/` — the solution design that the journeys will map through
- Read CLAUDE.md, README, and key source files if a codebase exists — ground journeys in what's actually built
- Read `research/enterprise-icp.md` if it exists — enterprise stakeholder journeys may differ significantly

### 2. Interview — User Journeys

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn.

**Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge they haven't shared (internal constraints, personal preferences, strategic bets).

For each **user profile** identified in the ICP, map their primary use cases and task flows through the product:

#### A. Identify Use Cases
- What are the 3–5 core things this user type does with the product?
- Which use case is the entry point (first thing they do)?
- Which use case delivers the most value (the reason they keep coming back)?
- Are there different frequency patterns (daily vs. weekly vs. occasional)?

#### B. Map Task Flows Per Use Case
For each use case:
- **Entry point** — How does the user start this task? (notification, scheduled, ad-hoc, triggered by external event)
- **Steps** — What does the user do, step by step? (actions, decisions, inputs, outputs)
- **Decision points** — Where does the user make choices? What information do they need?
- **Happy path** — What does success look like?
- **Failure modes** — Where can this go wrong? What does recovery look like?
- **Output/outcome** — What does the user have at the end that they didn't before?

#### C. Cross-Reference with Current State
For each mapped task flow, compare against the ICP's "Current State Journey":
- Which current-state steps does this replace or improve?
- Where is the delta greatest (biggest improvement over status quo)?
- Where is the delta smallest (barely better than what they do today)?

### 3. Interview — Customer Journey

Map the full business lifecycle from trigger to retention:

#### A. Trigger → Discovery
- What trigger events (from `research/icp.md`) cause someone to start looking?
- How do they discover the product? (search, referral, content, community, ads, word-of-mouth)
- What's their first impression? What do they see before signing up?
- What's the "hook" that makes them try it vs. the next search result?

#### B. Evaluation → Trial
- What does the evaluation look like? (free trial, freemium, demo, POC)
- What do they need to see to decide it's worth their time?
- How long is the evaluation period?
- What are the deal-killers at this stage? (pricing, missing feature, complexity, trust)

#### C. Onboarding → Aha Moment
- What are the first 5 minutes like? First hour? First day?
- What is the "aha moment" — the specific action or outcome where they realize the product's value?
- How many steps between sign-up and aha moment? (fewer = better)
- What are the drop-off points during onboarding?
- Does onboarding differ by user profile? (power user vs. casual)

#### D. Conversion
- What triggers the decision to pay? (trial expiring, hitting limits, team adoption)
- Who makes the buying decision? (user, manager, team lead)
- What pricing/packaging objections exist?
- What's the conversion timeline from aha moment to payment?

#### E. Retention & Expansion
- What keeps them coming back daily/weekly? (the core habit loop)
- What would cause them to churn? (broken workflow, competitor, outgrown the product)
- How does usage expand? (more users, more use cases, deeper integration)
- What are the leading indicators of churn vs. expansion?

#### F. Advocacy
- What would make someone recommend this product?
- Where do they share? (team, social, community, review sites)
- Is there a built-in viral loop? (collaboration, sharing, invites)

### 4. Present Findings & Validate

**Present the complete journey maps to the user before writing.** Summarise:
1. User journey overview — use cases per profile, key task flows, biggest deltas from current state
2. Customer journey overview — full funnel from trigger to advocacy
3. Critical moments — the aha moment, top drop-off points, churn triggers
4. Journey gaps — stages where the product or business model has no clear answer

Use the AskUserQuestion tool to ask:
- "Does this capture the experience you want to build? Any missing use cases or stages?"
- If any journey stages are vague, ask targeted follow-ups to nail them down

Continue until the user confirms the journeys are complete. Only then proceed to writing.

### 5. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- ALWAYS: `/metrics` — Define success metrics tied to the journey stages and critical moments
- IF `specs/` exist and no `tasks/roadmap.md`: `/roadmap` — Plan the build with journey coverage in mind
- IF no `research/gtm.md`: `/gtm` — Build a GTM plan grounded in the customer journey
- IF journey gaps identified above: `/plan-interview [top gap]` — Spec the most critical journey gap
- IF `tasks/roadmap.md` exists: `/run` — Continue building with journey context

### 6. Write Output

Only after the user has validated the findings, write the output files.

## Output

### `research/journey-map.md`

```markdown
# Journey Map

> Based on: research/icp.md, specs/[topic].md
> Date: [current date]

## Summary
[2-3 sentences: primary user's core journey, the aha moment, and the biggest opportunity/risk in the funnel]

## User Journeys

### [User Profile 1 Name]

#### Use Case Overview
| Use Case | Frequency | Entry Point | Value Delivered |
|----------|-----------|-------------|-----------------|
| ...      | Daily     | ...         | ...             |

#### [Use Case 1]: [Name]
**Entry point**: [How they start]
**Steps**:
1. [Step] — [what happens, what the user sees/does]
2. [Step] — ...

**Happy path outcome**: [What success looks like]
**Failure modes**: [What can go wrong and recovery path]
**Delta from current state**: [How much better this is vs. what they do today]

#### [Use Case 2]: [Name]
...

### [User Profile 2 Name]
...

## Customer Journey

### Trigger → Discovery
[Trigger events that start the search, discovery channels, first impression, the hook]

### Evaluation → Trial
[What evaluation looks like, what they need to see, deal-killers, timeline]

### Onboarding → Aha Moment
[First 5 min / first hour / first day experience.
 The aha moment: [specific action/outcome].
 Steps from sign-up to aha: [count].
 Drop-off points: [where and why]]

### Conversion
[What triggers payment, who decides, objections, timeline from aha to pay]

### Retention & Expansion
[Core habit loop, churn triggers, expansion paths, leading indicators]

### Advocacy
[What drives recommendations, sharing channels, viral loops]

## Critical Moments
[The 3-5 make-or-break moments in the combined journey — the points where you win or lose the customer. Each with: what it is, why it matters, and what success looks like.]

## Journey Gaps
[Stages where the product, specs, or business model have no clear answer yet. Each gap should include a _Start with:_ `/plan-interview [topic]` prompt.]

## Next Steps

Pick one:
- [conditional items from step 5 — only include items whose conditions are met]
```

### `research/journey-map-interview.md`
Raw interview log — questions, options, responses, and a closing summary of key insights.

Create the `research/` directory if it doesn't exist.

## Constraints

- **Requires both ICP and specs.** This skill maps the WITH-product experience — it cannot work without knowing both who the user is and what the product does.
- **Stay concrete.** Every journey step should describe a specific action, screen, or decision — not abstract concepts like "user engages with product."
- **Ground in the ICP.** The user profiles, trigger events, and pain map from the ICP should directly inform journey mapping. If a journey step doesn't connect to a real user need, flag it.
- **Cross-reference specs.** If a journey step requires functionality not in any spec, flag it as a journey gap with a `/plan-interview` prompt.
- **Do not prescribe UI or architecture.** Describe what the user experiences, not how to implement it. That's `/plan-interview`'s job.
- **Present before writing.** Never write output files until findings have been presented to the user and validated. The user must see and approve the journeys before anything is written to disk.
- **Do not overwrite existing `research/journey-map.md`** without asking the user first.
