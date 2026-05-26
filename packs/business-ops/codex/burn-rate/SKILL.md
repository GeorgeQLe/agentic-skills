---
name: burn-rate
description: "Estimate monthly burn rate from infrastructure signals and calculate payback period against revenue projections"
type: analysis
version: v0.1
---

# Burn Rate — Infrastructure-Grounded Cost & Runway Analysis

Invoke as `$burn-rate`.

Analyzes infrastructure, third-party services, and team costs to estimate monthly burn rate, then calculates payback period and break-even against revenue projections. Bridges `$monetization` (unit economics) and `$scale-audit` (infrastructure readiness) with dollar-denominated cost projections.

Default stance: assume the user does not know infrastructure pricing or SaaS cost structure in detail. Cost estimates must stand on detected services, cited pricing research, and explicit assumptions before asking the user for missing internal numbers.

## Prerequisites

- **Hard**: None — can run on any codebase.
- **Soft**: Read if they exist — `research/monetization.md`, `research/metrics.md`, `research/gtm.md`, `research/icp.md`, `CLAUDE.md`, `README`.

## Workflow

### 0. App Scope Resolution (Monorepo Support)

Before starting, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Also read `research/monetization.md` (cross-app overview) for broader context

### 1. Load Context & Detect Costs

1. Read infrastructure files — containers, IaC, k8s, CI/CD, serverless, PaaS, cloud configs.
2. Read dependency files for third-party service SDKs (payments, auth, monitoring, AI/ML, email, search, etc.).
3. Read environment templates (`.env.example`, etc.) for API keys implying paid services.
4. Read existing research docs for revenue projections, unit economics, customer counts.
5. Build a cost inventory across: **Compute**, **Database**, **Storage**, **Third-party services**, **CI/CD**, **DNS/Domain**.
6. For each detected service: search current pricing (min 4 queries), estimate monthly cost, note assumptions, assign confidence (High/Medium/Low).

### 2. Interview — Fill Gaps

Ask 2-3 focused questions:
- Present detected infrastructure with estimated costs and cited pricing assumptions. Ask the user to correct factual inaccuracies or add missing internal costs, not to estimate from intuition.
- Ask about team size, fully-loaded cost per person, and non-infra costs (marketing, tools, legal).
- If revenue data not found in research docs, ask for current or projected MRR and cash on hand.

### 3. Calculate & Present

Compute with all assumptions visible:
- **Monthly Burn Rate** — infrastructure + team + other, broken down by category with percentages.
- **Runway** — cash on hand / monthly burn (only if cash position provided).
- **Payback Period** — total investment / monthly net revenue (or "N/A — pre-revenue").
- **Break-even Point** — three scenarios (conservative 50%, base, optimistic 150% growth). Skip if pre-revenue with no projections.
- **Cost per Customer** — infrastructure and total cost per customer (only if count known).
- **Cost Optimization Opportunities** — over-provisioned resources, cheaper alternatives, free tier headroom, reserved discounts.

Present analysis and ask for factual corrections, missing internal figures, or hard constraints before writing.

### 4. Downstream Impact & Next Steps

1. Check if `research/monetization.md` exists and conflicts with burn rate findings (stale margins, divergent unit economics). Classify as None/Minor/Major.
2. Populate `## Next Steps` (3-5 items, "Pick one:" framing) — conditionally suggest `$monetization`, `$gtm`, `$metrics`, `$scale-audit`, `$brainstorm`, `$reconcile-research` based on what exists and what conflicts were found.

## Deliverables

- `research/burn-rate.md` (or `research/{app}/burn-rate.md`) — Full analysis: infrastructure cost breakdown, team/operational costs, total burn rate, revenue projections, payback/break-even scenarios, runway, cost per customer, optimization opportunities, assumptions, downstream impact, and next steps.
- `research/burn-rate-interview.md` (or `research/{app}/burn-rate-interview.md`) — Raw interview log with detected infrastructure, questions, responses, and key figures.

Create the `research/` (or `research/{app}/`) directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Every cost estimate must trace to a detected service or user-provided figure.
- State all assumptions (tier, instance size, usage level) with confidence levels.
- Present full analysis to user before writing output files.
- Do not overwrite existing `research/burn-rate.md` without asking.
- Minimum 4 web search queries for pricing data before presenting estimates.
- Do not prescribe architecture changes — note optimization opportunities only.
- Do not contradict existing `research/monetization.md` — reconcile differences.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/burn-rate-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
