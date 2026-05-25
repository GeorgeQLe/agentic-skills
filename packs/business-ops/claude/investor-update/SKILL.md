---
name: investor-update
description: Generate structured monthly stakeholder update from current research state, metrics, roadmap, and feedback
type: analysis
version: v0.1
argument-hint: "[optional: month e.g. \"March 2026\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Investor Update — Stakeholder Communication

Generates a structured monthly update from current research state, metrics, roadmap progress, and customer feedback. Uses standard YC/First Round format suitable for investors, accelerator mentors, or advisory boards.

## Soft Prerequisites

- Read all that exist: `research/metrics.md`, `research/cohort-review-*.md`, `research/runway-model.md`, `research/customer-feedback.md`, `research/gtm.md`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`
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
- **Progress**: `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md` (if it exists), `tasks/history.md` for what was built; `tasks/record-todo.md` and `tasks/recurring-todo.md` for advisory measurements or cadence work that may affect asks/risks
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

### Next Steps Guidance

The final response and output file must include a `## Next Steps` section with one explicit recommendation and 2-4 other options.

**Recommendation priority** (first applicable becomes the recommendation):

1. IF runway, burn, or revenue data is missing or stale: recommend `/runway-model` — investor updates need current financial context.
2. IF metrics are missing or stale: recommend `/metrics` — investor updates need a defensible KPI frame.
3. IF actual usage or retention data exists but has not been reviewed: recommend `/cohort-review` — convert operational data into investor-ready signal.
4. IF the update surfaced strategic misses, stale assumptions, or missed commitments: recommend `/retro` — turn the update into a corrective learning loop.
5. Otherwise recommend `/research-roadmap` — choose the next lifecycle task after the stakeholder update is current.

Use this format:

```markdown
## Next Steps

**Recommended:** [recommended skill] — [one-line reason grounded in the update]

Other options:
- [2-4 applicable alternatives]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Honest and concise.** Investor updates should be transparent, not spin. Bad news delivered with a plan is better than hidden problems.
- **Present before writing.** Never write until the user validates the update.
- **Separate dated files.** Each update is a new file. Don't modify previous updates.
- **No fabrication.** Only include metrics that have real data behind them. If a metric isn't tracked yet, omit it rather than estimate.
- **Standard format.** Stick to the YC/First Round format — investors expect this structure.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/investor-update-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

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

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/investor-update-{topic}.html`.

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
