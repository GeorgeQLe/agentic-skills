---
name: burn-rate
description: "Estimate monthly burn rate from infrastructure signals and calculate payback period against revenue projections"
type: analysis
version: v0.0
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/burn-rate-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/burn-rate-{topic}.html`.

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
