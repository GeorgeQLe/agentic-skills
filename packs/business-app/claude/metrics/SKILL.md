---
name: metrics
description: Define success metrics framework — activation, engagement, retention, growth, and business metrics tied to journey stages
type: analysis
version: 1.2.0
argument-hint: "[optional: focus area e.g. \"activation\", \"retention\"]"
---

# Metrics — Success Metrics Framework

Interview-driven skill that defines measurable success metrics tied to journey stages. Each metric gets a definition, measurement method, target with rationale, and instrumentation requirements.

## Prerequisites

- **Hard**: `research/journey-map.md` (or `research/{app}/journey-map.md` in monorepo mode) must exist. If not, tell the user to run `/journey-map` first and stop.
- **Soft**: Read `research/icp.md` (or `research/{app}/icp.md`) and `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if they exist — these improve target-setting and relevance.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

- Read `research/journey-map.md` (or `research/{app}/journey-map.md`) — customer journey stages, aha moment, habit loop, churn triggers, critical moments
- Read `research/icp.md` (or `research/{app}/icp.md`) if it exists — ICP segments, pain points, value props
- Read `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if it exists — real user behavior patterns, validated/invalidated assumptions
- Read CLAUDE.md and README if they exist — product context and tech stack (affects instrumentation)
- Read key source files if a codebase exists — understand what can actually be measured today

### 2. Interview

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn.

**Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge they haven't shared (internal constraints, personal preferences, strategic bets).

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
2. Each metric with definition, target (citing rationale: benchmarks, journey data, or ICP signals that informed the target), and measurement method
3. Instrumentation gaps — what can't be measured today
4. The "North Star" metric — the single metric that best captures overall health, with evidence for why this metric was chosen over alternatives

Use AskUserQuestion to ask:
- "Does this metrics framework capture what success looks like? Any metrics missing or targets off?"

Continue until the user confirms. Only then proceed to writing.

### 4. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2-4 alternatives). Choose the recommendation by the first matching condition:

Use this format in the output:

```markdown
## Next Steps

**Recommended:** [recommended skill] — [one-line reason grounded in this metrics framework]

Other options:
- [2-4 applicable alternatives]
```

- IF instrumentation gaps and no specs for them: `/spec-interview [topic]` — Spec instrumentation for the top metric gap
- IF no `tasks/roadmap.md`: `/roadmap` — Plan the build with instrumentation phases
- IF no `research/gtm.md`: `/gtm` — Build a GTM plan — metrics define what launch success looks like
- IF `tasks/roadmap.md` exists: `/run` — Start building and instrumenting
- IF product is live and no `research/customer-feedback.md`: `/customer-feedback` — Collect data to validate metric targets
- IF product is live and real data exists: `/cohort-review` — Analyze actual performance against these targets
- IF a baseline measurement depends on future production data or aggregate access and is not a launch gate: add it to `tasks/record-todo.md`, not `tasks/todo.md` or `tasks/manual-todo.md`

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

### 5. Write Output

Only after the user has validated the findings, write the output files.

### 6. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Metric targets or definitions referenced in monetization that no longer match
   - Revenue model assumptions anchored to metrics that changed
   - Conversion or retention targets that have shifted
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., North Star metric changed, activation definition redefined, retention targets shifted significantly): Display conflicts and strongly recommend `/reconcile-research`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/metrics.md` (or `research/{app}/metrics.md`)

```markdown
# Success Metrics Framework

> Based on: research/journey-map.md (or research/{app}/journey-map.md)[, research/icp.md, research/customer-feedback.md]
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

_Start with:_ `/spec-interview [instrumentation topic]` for high-priority gaps.

## Metric Dependencies
[How metrics relate to each other — e.g., activation drives retention, retention drives LTV. Identify which metrics are leading vs. lagging indicators.]

<!-- Only include this section when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

**Recommended:** [recommended next step] — [one-line reason grounded in this artifact]

Other options:
- [conditional items from step 4 — only include items whose conditions are met]
```

### `research/metrics-interview.md` (or `research/{app}/metrics-interview.md`)
Raw interview log — questions, options presented, user responses, and a closing summary of key decisions.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires journey map.** Metrics must be tied to actual journey stages, not abstract business goals.
- **Be precise.** "User engagement" is not a metric. "Weekly active users who complete at least 3 [core action] per week" is.
- **Include instrumentation.** Every metric must specify how to measure it and whether that measurement exists today.
- **Present before writing.** Never write output files until the framework has been presented and validated.
- **Tie to journey stages.** Every non-business metric must reference a specific stage or moment from the journey map.
- **Do not overwrite existing `research/metrics.md`** (or `research/{app}/metrics.md`) without asking the user first.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
