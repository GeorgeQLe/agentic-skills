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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/burn-rate-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

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
