---
name: investor-update
description: Generate structured monthly stakeholder update from current research state, metrics, roadmap, and feedback
type: analysis
version: 1.0.0
argument-hint: "[optional: month e.g. \"March 2026\"]"
---

# Investor Update — Stakeholder Communication

Generates a structured monthly update from current research state, metrics, roadmap progress, and customer feedback. Uses standard YC/First Round format suitable for investors, accelerator mentors, or advisory boards.

## Soft Prerequisites

- Read all that exist: `research/metrics.md`, `research/cohort-review-*.md`, `research/runway-model.md`, `research/customer-feedback.md`, `research/gtm.md`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/history.md`
- The more data exists, the richer the update. Works with as little as a roadmap + basic metrics.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before loading, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read research from `research/{app}/` instead of `research/`

### 1. Load Context

Read all available data sources:
- **Metrics**: `research/metrics.md` for targets, `research/cohort-review-*.md` (most recent) for actuals
- **Financial**: `research/runway-model.md` for runway, burn, revenue
- **Customer**: `research/customer-feedback.md` for qualitative signal
- **Progress**: `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md` (if it exists), `tasks/history.md` for what was built
- **GTM**: `research/gtm.md` for go-to-market context

Also check git log for the month to see what was shipped.

### 2. Compile Update Sections

For each section, pull from the appropriate data source. If a data source doesn't exist, either skip the section or ask the user for the data.

Use AskUserQuestion to fill gaps:
- "What were the top 3 accomplishments this month?"
- "What's the #1 thing you need help with?"
- "Any key hires, partnerships, or milestones?"
- "What are you most worried about right now?"

### 3. Present & Validate

Show the complete update to the user before writing:
- "Here's the draft update. Does it accurately represent the month? Anything to add or change?"

Incorporate feedback before proceeding.

### 4. Write Output

Only after confirmation, write the output file.

## Output

### `research/investor-update-[YYYY-MM].md` (or `research/{app}/investor-update-[YYYY-MM].md`)

```markdown
# Investor Update: [Month Year]

> Date: [current date]
> From: [product/company name]

## TL;DR
[2-3 sentences: the month in a nutshell — wins, challenges, and trajectory]

## Key Metrics

| Metric | Last Month | This Month | Target | Trend |
|--------|-----------|------------|--------|-------|
| [North Star] | [value] | [value] | [target] | [↑↓→] |
| MRR | [value] | [value] | [target] | [↑↓→] |
| Users | [value] | [value] | [target] | [↑↓→] |
| [Key metric] | [value] | [value] | [target] | [↑↓→] |

## Wins
1. [Accomplishment with impact — e.g., "Shipped X, resulting in Y"]
2. [Accomplishment]
3. [Accomplishment]

## Challenges
1. [Challenge and what you're doing about it]
2. [Challenge]

## Product
[What was built, shipped, or launched this month — concrete deliverables]

## Customers / Users
[New customers, notable feedback, retention signals, churn events]

## Financial
- **Cash**: $[amount]
- **Burn**: $[amount/mo]
- **Revenue**: $[MRR]
- **Runway**: [months]

## Plan for Next Month
1. [Top priority]
2. [Second priority]
3. [Third priority]

## Asks
[What you need help with — intros, advice, hiring, resources. Be specific.]

## Team
[Any changes — hires, departures, role changes]
```

Create the `research/` directory if it doesn't exist.

## Constraints

- **Honest and concise.** Investor updates should be transparent, not spin. Bad news delivered with a plan is better than hidden problems.
- **Present before writing.** Never write until the user validates the update.
- **Separate dated files.** Each update is a new file. Don't modify previous updates.
- **No fabrication.** Only include metrics that have real data behind them. If a metric isn't tracked yet, omit it rather than estimate.
- **Standard format.** Stick to the YC/First Round format — investors expect this structure.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
