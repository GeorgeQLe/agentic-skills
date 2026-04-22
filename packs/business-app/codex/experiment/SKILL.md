---
name: experiment
description: Design lean validation experiments — hypothesis, method, success criteria, sample size, timeline, and decision rules
type: planning
version: 1.0.0
argument-hint: <hypothesis or assumption to test>
---

# Experiment — Lean Validation Design

Takes a hypothesis (from `$assumption-tracker` or user) and designs a cheap, fast validation experiment. Covers landing page tests, fake-door tests, concierge MVPs, surveys, A/B tests, pricing tests, and smoke tests. Outputs a structured plan with hypothesis, method, success criteria, sample size, timeline, and decision rules.

## Soft Prerequisites

- Read `research/assumption-tracker.md` if it exists — pulls the highest-priority unvalidated assumption
- Read `research/icp.md` if it exists — grounds experiment design in who the target is
- Read `research/metrics.md` if it exists — aligns success criteria with existing metric definitions
- Read `research/gtm.md` if it exists — leverages channel strategy for reaching test subjects

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Parse Input & Load Context

**Read `$ARGUMENTS`:**
- If it's a specific hypothesis or assumption: use it directly
- If it's a reference to an assumption number (e.g., "#3"): look it up in `research/assumption-tracker.md`
- If empty: check `research/assumption-tracker.md` for the highest-priority unvalidated assumption. If no tracker exists, ask the user what they want to test. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`.

**Load context:** Read available research docs to understand the ICP, channels, metrics, and existing knowledge.

### 2. Structure the Hypothesis

Convert the input into a structured hypothesis:

**Format**: "We believe that [target segment] will [expected behavior] because [rationale]. We'll know this is true when [measurable outcome]."

Present and refine with the user. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "Here's how I've structured the hypothesis. Does this capture what you want to test?"
- If the hypothesis is too broad, help narrow it to something testable in 1-2 weeks

### 3. Research Experiment Methods

Use WebSearch with **3-5 targeted queries** to find best practices for this type of validation:

1. **Method-specific** — "[experiment type] validation method", "how to test [hypothesis type]"
2. **Sample size** — "[experiment type] sample size calculator", "minimum viable test size"
3. **Benchmarks** — "[category] conversion rate benchmark", "[experiment type] typical results"
4. **Tools** — "[experiment type] tools", "cheapest way to test [hypothesis]"

### 4. Design the Experiment — Present & Validate

Select the most appropriate experiment type and design the full plan:

#### Experiment Types

| Type | Best For | Timeline | Cost |
|------|----------|----------|------|
| **Landing page test** | Demand validation, messaging | 1-2 weeks | $50-200 (ads) |
| **Fake-door test** | Feature demand, willingness to explore | 1 week | $0 (in-product) |
| **Concierge MVP** | Value delivery, willingness to pay | 2-4 weeks | Time only |
| **Survey** | Broad sentiment, preference ranking | 3-5 days | $0-100 |
| **A/B test** | Optimization, messaging variants | 1-2 weeks | $0 (in-product) |
| **Pricing test** | Willingness to pay, price sensitivity | 1-2 weeks | $50-200 |
| **Smoke test** | Demand for non-existent feature | 3-5 days | $0-50 |
| **Pre-sale / LOI** | B2B willingness to pay | 1-2 weeks | Time only |
| **Wizard of Oz** | Complex feature viability | 2-4 weeks | Time only |

**Present the experiment design to the user.** If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text. Show:
- Recommended experiment type with rationale (why this method over alternatives)
- Detailed plan with timeline and cost estimate
- Success criteria with specific numbers (citing benchmarks from research)
- Decision rules for both outcomes

Ask:
- "Does this experiment design feel feasible? Too ambitious or too simple?"
- "Any resource constraints I should know about? (budget, time, access to users)"

Incorporate feedback before proceeding.

### 5. Define Decision Rules

For each possible outcome, define what happens next:

- **If hypothesis is validated** (success criteria met): What's the next step? (e.g., build the feature, commit to the pricing, double down on the channel)
- **If hypothesis is invalidated** (criteria not met): What's the pivot? (e.g., test alternative, revisit ICP, change approach)
- **If results are inconclusive** (between thresholds): What additional data is needed? Run a follow-up experiment or extend the current one?

### 6. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing. Separate the current design-stage next step from outcome-specific next steps:

- ALWAYS: Run the experiment (manual step — the plan tells you how)
- For a newly designed experiment, do not list validation/invalidation commands as current top-level next steps; put those under `## Decision Rules` because they are only valid after results exist.
- In `### If Validated`: include the next valid command, usually `$customer-feedback [results]` to log evidence, `$assumption-tracker` to mark the assumption validated, or `$roadmap` / `$spec-interview [validated opportunity]` if the result commits the team to build.
- In `### If Invalidated`: include `$assumption-tracker` to mark the assumption invalidated, plus `$brainstorm`, `$icp`, `$gtm`, or `$monetization` only when the failed assumption belongs to that domain.
- In `### If Inconclusive`: include `$experiment [follow-up]` if the test needs another run, or `$customer-feedback` if qualitative evidence is the missing signal.
- IF more assumptions remain untested after this design: `$experiment [next assumption]` — Design the next experiment
- IF enough assumptions are validated after completed results: `$research-roadmap` — Check if research docs need updating based on learnings

### 7. Write Output

Present final plan to user. Ask:
- "Ready to write this experiment plan? Anything to adjust?"

Only after confirmation, write the output file.

## Output

### `research/experiments/[experiment-name].md` (or `research/{app}/experiments/[experiment-name].md`)

```markdown
# Experiment: [Descriptive Name]

> Date designed: [current date]
> Status: Designed | Running | Completed
> Assumption: [from assumption-tracker, if applicable — include # reference]
> Priority: [from assumption-tracker score, if applicable]

## Hypothesis

**We believe that** [target segment]
**will** [expected behavior]
**because** [rationale from research]

**We'll know this is true when** [measurable outcome with specific threshold]

## Method

**Type**: [Landing page test / Fake-door / Concierge MVP / Survey / A/B test / Pricing test / Smoke test / Pre-sale / Wizard of Oz]
**Why this method**: [rationale — why this is the cheapest/fastest way to test this hypothesis]

### Setup
[Step-by-step instructions for setting up the experiment]

1. [Step 1]
2. [Step 2]
3. ...

### Tools Needed
- [Tool 1] — [purpose]
- [Tool 2] — [purpose]

### Audience
**Who**: [specific segment from ICP]
**How to reach them**: [channel — from GTM if available]
**Sample size**: [number needed for statistical significance]
**Recruitment method**: [how to get participants]

## Success Criteria

| Metric | Failure | Inconclusive | Success |
|--------|---------|--------------|---------|
| [Primary metric] | < [threshold] | [range] | ≥ [threshold] |
| [Secondary metric] | < [threshold] | [range] | ≥ [threshold] |

**Benchmarks**: [what industry/competitor data says is typical]

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | [days] | [what to prepare] |
| Run | [days] | [data collection period] |
| Analyze | [days] | [how to analyze results] |
| **Total** | **[days]** | |

## Budget

| Item | Cost |
|------|------|
| [item] | [amount] |
| **Total** | **[amount]** |

## Decision Rules

### If Validated (success criteria met)
[Specific next actions — what to build, commit to, or double down on]

### If Invalidated (failure criteria met)
[Specific pivot — what to change, test next, or abandon]

### If Inconclusive
[What additional data is needed, whether to extend or redesign]

## Results

> Fill this section after the experiment completes.

**Status**: [Validated / Invalidated / Inconclusive]
**Date completed**: [date]

### Raw Data
[Key numbers and observations]

### Analysis
[What the data shows — connect back to hypothesis]

### Decision
[What was decided based on the results]

### Learnings
[What was learned beyond the hypothesis — surprises, side findings]

## Next Steps

Pick one:
- [conditional items from step 6 — only include items whose conditions are met]
```

Create the `research/experiments/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **One hypothesis per experiment.** If the user has multiple things to test, design separate experiments. Don't bundle.
- **Cheap and fast.** Every experiment should be completable in 1-4 weeks with minimal budget. If the design is expensive or slow, simplify.
- **Specific success criteria.** "Users like it" is not a success criterion. "≥40% of landing page visitors click 'Get Early Access'" is.
- **Present before writing.** Never write output files until the experiment design has been presented and validated.
- **Include decision rules.** Every experiment must specify what happens for each possible outcome. No experiment should end with "we'll figure it out."
- **Reference benchmarks.** Success thresholds should be grounded in industry benchmarks or competitor data, not arbitrary numbers.
- **Don't overdesign.** A simple survey can validate an assumption just as well as an elaborate A/B test. Recommend the simplest method that produces a clear signal.

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
