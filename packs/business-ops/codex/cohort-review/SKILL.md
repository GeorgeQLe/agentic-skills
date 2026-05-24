---
name: cohort-review
description: Post-launch metrics & funnel analysis — cohort retention, channel performance, and progress against targets from $metrics
type: analysis
version: v0.0
argument-hint: "[file path to data, pasted data, or empty to be prompted]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Cohort Review — Post-Launch Metrics & Funnel Analysis

Invoke as `$cohort-review`.

Takes real usage/revenue data and analyzes against targets from `$metrics`. Performs cohort analysis, funnel analysis, and channel performance review. Identifies where the funnel leaks, which cohorts retain, and whether activation targets are being hit. Append-style output for tracking performance over time.

## Prerequisites

- **Hard**: `research/metrics.md` (or `research/{app}/metrics.md`) must exist. If not, tell the user to run `$metrics` first and stop.
- **Soft**: Read these if they exist for richer analysis:
  - `research/icp.md` — segment analysis against ICP profiles
  - `research/gtm.md` — channel strategy to compare against actual channel performance
  - `research/monetization.md` — revenue targets and unit economics to validate
  - `research/assumption-tracker.md` — assumptions to validate or invalidate with real data

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context & Data

**Load research context:**
- Read `research/metrics.md` — extract all metric definitions, targets, and North Star metric
- Read other research docs as listed in prerequisites

**Ingest performance data:**
Check `$ARGUMENTS`:
- **File path provided**: Read the file (CSV, JSON, markdown table, or any structured format)
- **Text provided**: Parse the data directly
- **Empty**: Ask the user to provide data — accept any format: analytics exports, dashboard screenshots described in text, spreadsheet pastes, database query results. If the session is already in Plan mode and there are 2-3 concrete input-source choices, prefer `request_user_input`.

Clarify with the user. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- What date range does this data cover?
- What's the data source? (analytics tool, database, manual tracking)
- Any known data quality issues?

### 2. Funnel Analysis

Map the data against the funnel stages defined in `research/metrics.md`:

1. **Top of funnel** — visitors, signups, leads (from Growth metrics)
2. **Activation** — users who reach aha moment (from Activation metrics)
3. **Engagement** — active usage patterns (from Engagement metrics)
4. **Retention** — users still active at D7/D30/D90 (from Retention metrics)
5. **Revenue** — paying users, ARPU, expansion (from Business metrics)

For each stage:
- **Actual vs. Target**: Compare real numbers against targets from metrics.md
- **Conversion rate**: What % moves to the next stage?
- **Drop-off analysis**: Where exactly do users fall off? What's the biggest leak?
- **Trend**: Is it improving, declining, or flat compared to previous cohort reviews?

### 3. Cohort Analysis

If the data supports cohort segmentation:

- **Time-based cohorts**: Group users by signup week/month. Compare retention curves across cohorts — are newer cohorts retaining better or worse?
- **Source-based cohorts**: If channel data is available, compare retention by acquisition channel
- **Segment-based cohorts**: If ICP segment data is available, compare performance across ICP segments
- **Behavioral cohorts**: Group by activation behavior — users who did X vs. didn't

Identify:
- Which cohorts are strongest/weakest?
- Is there a trend in cohort quality over time?
- Are certain channels or segments significantly better?

### 4. Channel Performance Review

If channel/attribution data is available:

| Channel | Volume | CAC | Activation Rate | D30 Retention | LTV (est.) | ROI |
|---------|--------|-----|-----------------|---------------|------------|-----|
| [channel] | [count] | [$] | [%] | [%] | [$] | [ratio] |

Compare against:
- GTM channel strategy recommendations (from `research/gtm.md`)
- Budget allocation — is spend aligned with performance?
- Channel-specific benchmarks from research

Flag:
- Channels performing above/below expectations
- Channels with high volume but poor retention (leaky bucket)
- Channels with low volume but high quality (scale opportunity)

### 5. Key Findings & Present

Synthesize findings into:

1. **Health summary** — overall: on track, at risk, or off track against metrics targets
2. **Top 3 wins** — what's working better than expected
3. **Top 3 concerns** — what's underperforming, where the funnel leaks
4. **Biggest lever** — the single change that would most improve metrics
5. **Assumption updates** — which assumptions from `$assumption-tracker` are validated or invalidated by this data

**Present to the user.** If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Here's what the data shows. Which conclusions need adjustment based on data quality limits, missing fields, or known operational context?"
- "Any data quality issues that would change these conclusions?"

Incorporate feedback before proceeding.

### 6. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- IF activation below target: `$experiment` — Design an experiment to improve the activation funnel
- IF channel performing poorly: `$gtm` — Revisit channel strategy with real performance data
- IF pricing/revenue below target: `$monetization` — Update monetization strategy with real unit economics
- IF assumptions invalidated: `$assumption-tracker` — Update register with real-data validations
- IF metrics targets need adjustment: `$metrics` — Revisit targets based on baseline reality
- IF overall on track: `$research-roadmap` — Check what's next in the project lifecycle

### 7. Write Output

Present final analysis to user. Ask:
- "Ready to write this analysis? Anything to adjust?"

Only after confirmation, write the output file.

## Output

### `research/cohort-review-[YYYY-MM-DD].md` (or `research/{app}/cohort-review-[YYYY-MM-DD].md`)

```markdown
# Cohort Review: [Date Range]

> Date: [current date]
> Data source: [analytics tool / database / manual]
> Period: [start date] — [end date]
> Based on: research/metrics.md

## Health Summary

**Overall**: [On Track / At Risk / Off Track]
[2-3 sentences: the headline — are we hitting our numbers? What's the biggest story?]

### North Star Metric
**Target**: [from metrics.md]
**Actual**: [real number]
**Status**: [On Track / Below / Above] — [trend: improving / declining / flat]

## Funnel Analysis

| Stage | Metric | Target | Actual | Delta | Trend |
|-------|--------|--------|--------|-------|-------|
| Acquisition | [metric] | [target] | [actual] | [+/-] | [↑↓→] |
| Activation | [metric] | [target] | [actual] | [+/-] | [↑↓→] |
| Engagement | [metric] | [target] | [actual] | [+/-] | [↑↓→] |
| Retention | [metric] | [target] | [actual] | [+/-] | [↑↓→] |
| Revenue | [metric] | [target] | [actual] | [+/-] | [↑↓→] |

### Biggest Leak
**Stage**: [where the biggest drop-off occurs]
**Conversion**: [actual %] vs. target [target %]
**Analysis**: [why this is happening — evidence from data]
**Recommendation**: [what to do about it]

## Cohort Analysis

### Retention Curves
| Cohort | D1 | D7 | D14 | D30 | D60 | D90 |
|--------|----|----|-----|-----|-----|-----|
| [cohort] | [%] | [%] | [%] | [%] | [%] | [%] |

### Cohort Quality Trend
[Are newer cohorts better or worse? What's driving the trend?]

### Segment Performance
| Segment | Activation | D30 Retention | Revenue/User | Notes |
|---------|------------|---------------|-------------|-------|
| [segment] | [%] | [%] | [$] | [observation] |

## Channel Performance

| Channel | Volume | CAC | Activation | D30 Retention | Est. LTV | ROI |
|---------|--------|-----|-----------|---------------|----------|-----|
| [channel] | [n] | [$] | [%] | [%] | [$] | [x] |

### Channel Insights
- **Best performer**: [channel] — [why]
- **Worst performer**: [channel] — [why]
- **Scale opportunity**: [channel] — [evidence]
- **Cut/reduce**: [channel] — [evidence]

## Key Findings

### Wins
1. [What's working — with data]
2. [What's working — with data]
3. [What's working — with data]

### Concerns
1. [What's underperforming — with data and impact]
2. [What's underperforming — with data and impact]
3. [What's underperforming — with data and impact]

### Biggest Lever
[The single change that would most improve overall metrics — with reasoning]

## Assumption Validations

| Assumption | Previous Status | New Status | Evidence |
|-----------|----------------|------------|----------|
| [assumption from tracker] | [old status] | Validated/Invalidated | [data point] |

## Next Steps

Pick one:
- [conditional items from step 6 — only include items whose conditions are met]
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

- **Data-driven.** Every claim must reference specific numbers from the provided data. Do not fabricate data or fill in placeholders.
- **Compare to targets.** Always reference metric targets from `research/metrics.md`. The value of this skill is target vs. actual, not just reporting numbers.
- **Handle incomplete data gracefully.** If data doesn't cover all funnel stages or cohort dimensions, analyze what's available and note gaps. Don't skip the analysis.
- **Append-style.** Each cohort review is a separate dated file. Previous reviews are not modified.
- **Present before writing.** Never write output files until the analysis has been presented and validated.
- **Be honest about data quality.** If the data is too sparse for statistical significance, say so. Don't over-interpret small samples.
- **Recommend actions.** Every finding should connect to a concrete next step.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/cohort-review-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Risk-validation gates.** Render assumption/risk evidence coverage, confidence, candidate verdicts or mitigations, artifact destination, proposed file changes, coverage checkpoint, and post-approval route as gates. Durable tracker outputs remain canonical markdown artifacts and must also be fully rendered in the alignment page.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/cohort-review-{topic}.html`.

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
