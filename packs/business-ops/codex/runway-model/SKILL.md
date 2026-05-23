---
name: runway-model
description: Financial runway & unit economics tracker — burn rate, revenue trajectory, runway in months, scenario modeling
type: analysis
version: v0.0
argument-hint: "[file path to financials, pasted data, or empty to be prompted]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Runway Model — Financial Runway & Unit Economics

Invoke as `$runway-model`.

Simple financial model: burn rate, revenue trajectory, runway in months, and scenario modeling. Takes real numbers, projects forward with optimistic/realistic/pessimistic scenarios. Append-only updates for tracking over time.

## Soft Prerequisites

- Read `research/monetization.md` if it exists — theoretical unit economics and pricing to compare against actuals
- Read `research/metrics.md` if it exists — growth rate targets for projections
- Read `research/cohort-review-*.md` if any exist — real performance data for revenue trajectory
- Read `research/gtm.md` if it exists — channel costs for CAC calculations

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context & Data

**Load research context:** Read all soft prerequisite files.

**Ingest financial data:**
Check `$ARGUMENTS`:
- **File path provided**: Read the file
- **Text provided**: Parse the data directly
- **Empty**: Gather the numbers from the user. If the session is already in Plan mode and there are 2-3 concrete input-source choices, prefer `request_user_input`; otherwise ask in plain text.

**Required inputs** (ask for each that's missing):
- Monthly burn rate (total expenses)
- Current cash/bank balance
- Monthly revenue (if any)
- Revenue growth rate (if applicable)
- Team size and key cost categories

**Nice-to-have inputs:**
- Detailed cost breakdown (salaries, infrastructure, tools, marketing)
- Customer count and ARPU
- CAC by channel
- Churn rate
- Expected cost changes (new hires, infrastructure scaling)

### 2. Calculate Core Metrics

**Runway calculation:**
- **Gross burn**: Total monthly expenses
- **Net burn**: Expenses minus revenue
- **Runway (months)**: Cash balance ÷ net burn
- **Zero-cash date**: Projected date when cash runs out

**Unit economics (if revenue exists):**
- **MRR / ARR**: Monthly/annual recurring revenue
- **ARPU**: Average revenue per user
- **CAC**: Customer acquisition cost (if channel spend data available)
- **LTV**: Lifetime value (ARPU × average lifespan, or ARPU ÷ monthly churn rate)
- **LTV:CAC ratio**: Is acquisition sustainable?
- **Payback period**: Months to recover CAC
- **Gross margin**: Revenue minus cost of delivery

Compare actuals against theoretical estimates from `research/monetization.md` if it exists.

### 3. Scenario Modeling

Build three scenarios projecting 12 months forward:

**Pessimistic** (what if things go wrong):
- Revenue grows at 50% of current rate (or flat)
- Costs increase 10-20% (unexpected expenses, needed hires)
- Churn increases
- Runway: [months]

**Realistic** (current trajectory continues):
- Revenue grows at current rate
- Costs grow as planned
- Churn stays flat
- Runway: [months]

**Optimistic** (what if things go well):
- Revenue grows at 150-200% of current rate
- Costs stay controlled
- Churn decreases
- Runway: [months]

For each scenario, show monthly projections for cash balance, revenue, and expenses.

### 4. Identify Critical Decisions

Based on the model:
- **Break-even point**: When does revenue cover expenses? (per scenario)
- **Hiring runway**: Can you afford to hire? When?
- **Marketing budget**: How much can you spend on acquisition?
- **Runway triggers**: At what cash balance should you raise, cut costs, or change strategy?
- **Revenue milestones needed**: What MRR is needed to extend runway to [target]?

### 5. Present & Validate

Present to the user. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- Core metrics summary
- Three scenarios with runway projections
- Critical decisions and trigger points

Ask:
- "Do these numbers match your records? Any costs or revenue I'm missing?"
- "Are the scenario assumptions realistic? Too conservative or too aggressive?"

Incorporate feedback before proceeding.

### 6. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- IF runway < 6 months: Prioritize revenue — `$experiment` to validate fastest path to revenue, or cut costs
- IF unit economics unhealthy (LTV:CAC < 3): `$monetization` — Revisit pricing or acquisition strategy
- IF no `research/cohort-review-*.md`: `$cohort-review` — Get real performance data to improve projections
- IF actuals diverge from monetization estimates: `$monetization` — Update strategy with real data
- ALWAYS: `$roadmap` — Ensure build plan accounts for runway constraints

### 7. Write Output

Present final model to user. Ask:
- "Ready to write this? Anything to adjust?"

Only after confirmation, write the output file.

## Output

### `research/runway-model.md` (or `research/{app}/runway-model.md`)

Append-only — each update adds a new section at the top (below the header). Previous snapshots remain for historical tracking.

```markdown
# Runway Model

> Last updated: [current date]
> Snapshots: [total count]

## Latest Snapshot: [Month Year]

> Data source: [where the numbers came from]
> As of: [date of financial data]

### Core Metrics

| Metric | Value | vs. Last Snapshot |
|--------|-------|-------------------|
| Cash balance | $[amount] | [+/- change] |
| Monthly revenue (MRR) | $[amount] | [+/- change] |
| Gross burn | $[amount/mo] | [+/- change] |
| Net burn | $[amount/mo] | [+/- change] |
| Runway | [months] | [+/- change] |
| Zero-cash date | [date] | [+/- change] |

### Unit Economics

| Metric | Actual | Target (from monetization) | Status |
|--------|--------|---------------------------|--------|
| ARPU | $[amount] | $[target] | [On/Below/Above] |
| CAC | $[amount] | $[target] | [On/Below/Above] |
| LTV | $[amount] | $[target] | [On/Below/Above] |
| LTV:CAC | [ratio] | [target] | [Healthy/Unhealthy] |
| Payback period | [months] | [target] | [On/Below/Above] |
| Gross margin | [%] | [target] | [On/Below/Above] |

### Cost Breakdown

| Category | Monthly Cost | % of Total | Trend |
|----------|-------------|------------|-------|
| Salaries/contractors | $[amount] | [%] | [↑↓→] |
| Infrastructure | $[amount] | [%] | [↑↓→] |
| Tools & services | $[amount] | [%] | [↑↓→] |
| Marketing/ads | $[amount] | [%] | [↑↓→] |
| Other | $[amount] | [%] | [↑↓→] |

### Revenue Breakdown

| Source | MRR | Customers | ARPU | Growth |
|--------|-----|-----------|------|--------|
| [tier/product] | $[amount] | [count] | $[amount] | [%/mo] |

### 12-Month Projections

#### Pessimistic
| Month | Revenue | Expenses | Net Burn | Cash Balance |
|-------|---------|----------|----------|-------------|
| [M1] | $[amt] | $[amt] | $[amt] | $[amt] |
| ... | | | | |
**Runway**: [months] | **Break-even**: [month or "not in window"]

#### Realistic
| Month | Revenue | Expenses | Net Burn | Cash Balance |
|-------|---------|----------|----------|-------------|
| [M1] | $[amt] | $[amt] | $[amt] | $[amt] |
| ... | | | | |
**Runway**: [months] | **Break-even**: [month or "not in window"]

#### Optimistic
| Month | Revenue | Expenses | Net Burn | Cash Balance |
|-------|---------|----------|----------|-------------|
| [M1] | $[amt] | $[amt] | $[amt] | $[amt] |
| ... | | | | |
**Runway**: [months] | **Break-even**: [month or "not in window"]

### Assumptions
[List every assumption behind the projections — growth rates, churn rates, cost changes, hiring plans]

### Critical Decisions

| Trigger | Condition | Action |
|---------|-----------|--------|
| Low runway | Cash < $[amount] or < [months] runway | [action: raise, cut, pivot] |
| Break-even path | Need $[MRR] by [date] | [what must happen to get there] |
| Hiring decision | Can afford hire when runway > [months] | [role and timing] |
| Marketing budget | Can spend $[amount/mo] on acquisition | [when and how] |

### Next Steps

Pick one:
- [conditional items from step 6]

---

[Previous snapshots remain below, newest first]
```

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Real numbers only.** Do not fabricate financial data. If numbers aren't provided, ask for them.
- **Append-only.** Previous snapshots are never deleted or modified. Only add new snapshots at the top.
- **State assumptions.** Every projection must list its assumptions explicitly. Never present projections as predictions.
- **Present before writing.** Never write output files until the model has been presented and validated.
- **Conservative by default.** When estimating, err on the conservative side. Optimistic projections should be labeled clearly.
- **No investment advice.** This is a planning tool, not financial advice. Note this in the output.
- **Privacy-aware.** Financial data is sensitive. Do not log raw financial data to search logs or interview logs.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/runway-model-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/runway-model-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
