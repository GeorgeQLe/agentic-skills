---
name: assumption-tracker
description: Extract and risk-rank assumptions from research docs — living register of what to validate first
type: analysis
version: v0.1
argument-hint: "[optional: focus area e.g. \"pricing\", \"ICP\", \"channel\"]"
---

# Assumption Tracker — Riskiest Assumptions Register

Scans all `research/*.md` files, extracts implicit and explicit assumptions, ranks by risk (catastrophic if wrong) × uncertainty (how little evidence), and produces a living register prioritizing what to validate first.

## Prerequisites

- **Hard**: At least 3 files must exist in `research/` (or `research/{app}/`). If fewer exist, tell the user to run more research skills first and stop.
- **Soft**: The more research docs exist, the more comprehensive the register. Reads all of: `research/icp.md`, `research/competitive-analysis.md`, `research/journey-map.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/customer-feedback.md`, `research/positioning.md`.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before scanning, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load All Research

Read every `research/*.md` file (or `research/{app}/*.md`). For each document, extract:

- **Explicit claims** — statements presented as facts ("our ICP has budget authority", "the market is $2B")
- **Implicit assumptions** — unstated beliefs the analysis depends on ("users will switch from Excel", "word-of-mouth will be a growth channel", "the aha moment happens within 5 minutes")
- **Dependency assumptions** — where one research doc builds on conclusions from another ("GTM pricing assumes ICP willingness-to-pay from monetization research")

Track which document and section each assumption comes from.

### 2. Categorize Assumptions

Group assumptions into categories:

| Category | Examples |
|----------|----------|
| **ICP & Market** | Target segment exists, pain is severe enough to pay, market size estimates |
| **Value Proposition** | Our solution solves the pain, users prefer us over alternatives |
| **Pricing & Revenue** | Willingness to pay, price sensitivity, unit economics viability |
| **Channel & Distribution** | Can reach ICP through chosen channels, conversion rates, CAC assumptions |
| **Product & UX** | Users can achieve aha moment, activation flow works, retention drivers |
| **Competitive** | Competitor won't copy, switching costs exist, differentiation is durable |
| **Timing** | Market is ready now, no regulatory changes coming, technology is mature |

### 3. Score Each Assumption

For each assumption, score two dimensions:

**Risk (if wrong)** — 1 to 5:
- 1: Minor inconvenience, easy pivot
- 3: Significant rework needed, delays
- 5: Existential — business model collapses, wasted months of work

**Uncertainty (how little evidence)** — 1 to 5:
- 1: Strong evidence — multiple data points, validated by customer feedback
- 3: Moderate — some research supports it, but not validated with real users
- 5: Pure assumption — no evidence, taken on faith or "common sense"

**Combined priority** = Risk × Uncertainty (max 25). Higher = validate first.

### 4. Check Validation Status

Cross-reference assumptions against:
- `research/customer-feedback.md` — findings classified as "Confirmed" or "Wrong" may validate or invalidate assumptions
- `research/experiments/` directory — completed experiment results
- `research/cohort-review-*.md` — real performance data

Mark each assumption's validation status:
- **Unvalidated** — no evidence for or against
- **Partially validated** — some supporting evidence, not conclusive
- **Validated** — strong evidence confirms this assumption
- **Invalidated** — evidence contradicts this assumption
- **Stale** — was validated, but newer data raises questions

### 5. Present & Validate

Use AskUserQuestion to present the top 10 highest-priority assumptions to the user:

- Show the assumption, source document, risk score, uncertainty score, combined priority, and validation status
- Ask: "Do these priorities feel right? Any assumptions I'm missing or scoring wrong?"
- Ask: "Are there any assumptions here you already know the answer to?"

Incorporate feedback before proceeding.

### 6. Generate Validation Recommendations

For each unvalidated high-priority assumption (combined score ≥ 12), recommend a validation method:

| Validation Method | Best For |
|-------------------|----------|
| `/experiment` — landing page test | Demand validation, messaging tests |
| `/experiment` — fake-door test | Feature demand, willingness to explore |
| `/experiment` — pricing test | Willingness to pay, price sensitivity |
| `/experiment` — survey | Broad sentiment, preference ranking |
| `/customer-feedback` — user interview | Deep understanding, "why" questions |
| `/cohort-review` — analyze real data | Post-launch metrics, funnel performance |
| Direct observation | UX assumptions, activation flow |
| Competitor analysis | Market timing, differentiation durability |

### 7. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- IF unvalidated assumptions with score ≥ 15: `/experiment [top assumption]` — Design a cheap test for the riskiest assumption
- IF customer feedback exists but assumptions remain unvalidated: `/customer-feedback` — Gather targeted feedback on top assumptions
- IF product is live: `/cohort-review` — Check if real data validates or invalidates key assumptions
- IF assumptions cross multiple docs: `/reconcile-research` — Ensure research docs are internally consistent
- ALWAYS: `/research-roadmap` — Check overall project status

### 8. Write Output

Present final register to user. Ask:
- "Ready to write this to `research/assumption-tracker.md`? Anything to adjust first?"

Only after confirmation, write the output file.

## Output

### `research/assumption-tracker.md` (or `research/{app}/assumption-tracker.md`)

```markdown
# Assumption Tracker

> Last updated: [current date]
> Sources: [list of research docs scanned]
> Total assumptions: [count] | Unvalidated high-risk: [count]

## Summary

[2-3 sentences: the riskiest unvalidated assumptions and what to do about them]

## Top 10 Riskiest Assumptions

| # | Assumption | Source | Category | Risk | Uncertainty | Priority | Status |
|---|-----------|--------|----------|------|-------------|----------|--------|
| 1 | [assumption] | [doc:section] | [category] | [1-5] | [1-5] | [R×U] | [status] |
| ... | | | | | | | |

## Full Register

### ICP & Market
| Assumption | Source | Risk | Uncertainty | Priority | Status | Validation Method |
|-----------|--------|------|-------------|----------|--------|-------------------|
| [assumption] | [doc:section] | [1-5] | [1-5] | [R×U] | [status] | [method] |

### Value Proposition
[Same table format]

### Pricing & Revenue
[Same table format]

### Channel & Distribution
[Same table format]

### Product & UX
[Same table format]

### Competitive
[Same table format]

### Timing
[Same table format]

## Validation Plan

### Immediate (This Week)
[Top 1-3 assumptions to validate, with specific method and success criteria]

### Short-term (This Month)
[Next 3-5 assumptions, with recommended approach]

### Can Wait
[Lower-priority assumptions that don't block current decisions]

## Recently Validated / Invalidated

| Assumption | Previous Status | New Status | Evidence | Date |
|-----------|----------------|------------|----------|------|
| [assumption] | Unvalidated | Validated/Invalidated | [evidence source] | [date] |

## Next Steps

Pick one:
- [conditional items from step 7 — only include items whose conditions are met]
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

- **Read-only on research docs.** Extract assumptions from existing research — do not modify source documents.
- **Be specific.** "Market exists" is not an assumption. "Solo creative professionals earning $50K-150K will pay $20/mo for portfolio analytics" is.
- **Trace to source.** Every assumption must reference the specific document and section it was extracted from.
- **Score honestly.** Don't inflate uncertainty to make things seem more urgent. If there's real evidence, score it low.
- **Update, don't duplicate.** If `research/assumption-tracker.md` already exists, ask the user whether to update (re-scan and merge) or overwrite. When updating, preserve validation status and "Recently Validated" history.
- **Present before writing.** Never write output files until findings have been presented and validated.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/assumption-tracker-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Risk-validation gates.** Render assumption/risk evidence coverage, confidence, candidate verdicts or mitigations, artifact destination, proposed file changes, coverage checkpoint, and post-approval route as gates. Durable tracker outputs remain canonical markdown artifacts and must also be fully rendered in the alignment page.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/assumption-tracker-{topic}.html`.

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
