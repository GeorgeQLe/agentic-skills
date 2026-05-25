---
name: pmf-assessment
type: research
version: v0.0
description: Sean Ellis PMF survey design + qualitative signal analysis for post-launch fit measurement
argument-hint: "[optional: specific signal or segment to focus on]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# PMF Assessment — Product-Market Fit Measurement

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Designs a Sean Ellis PMF survey and qualitative signal analysis framework for measuring product-market fit post-launch. Combines the quantitative "very disappointed" threshold (40%) with qualitative signal analysis from customer feedback, usage patterns, and market indicators. This is a post-launch measurement skill — it should run after the product has real users.

## Prerequisites

- **Hard**: `research/metrics.md` (or `research/{app}/metrics.md`) must exist. If not, tell the user to run `/metrics` first and stop.
- **Soft**: Read these if they exist:
  - `research/icp.md` — target customer segments, pain points, jobs-to-be-done
  - `research/journey-map.md` — critical moments, aha moment, drop-off points
  - `research/customer-feedback.md` — real user language, complaints, praise, churn signals

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context

- Read `research/metrics.md` — success targets, north star metric, current performance data
- Read `research/icp.md` if it exists — target segments, pain points, jobs-to-be-done
- Read `research/journey-map.md` if it exists — critical moments, aha moment, engagement patterns
- Read `research/customer-feedback.md` if it exists — real user language, sentiment, churn signals
- Read CLAUDE.md, README, and key source files for product context

### 2. Launch Check

Detect whether the product has live users. Look for evidence:
- `research/customer-feedback.md` exists with real user quotes
- Analytics references in metrics or other research docs
- Deployed URLs in README or CLAUDE.md
- User counts, revenue figures, or usage data in any research file

**If no evidence of live product:**

Use AskUserQuestion:
- "I don't see evidence of a live product with real users. PMF assessment requires actual user data. Would you like to design the survey framework now for future use, or should we focus on `/spec-interview` or `/roadmap` to get to launch first?"

If the user wants to proceed anyway, continue but mark all outputs as "pre-launch framework — requires live data to score."

### 3. Research Sean Ellis Methodology

Use WebSearch with **4-6 targeted queries**:

1. **Core methodology** — "Sean Ellis PMF survey methodology", "very disappointed question PMF"
2. **Domain-specific signals** — "product market fit signals [category]", "PMF measurement [domain]"
3. **Advanced frameworks** — "superhuman PMF engine", "Rahul Vohra PMF framework"
4. **Qualitative indicators** — "qualitative PMF indicators", "product market fit signs [industry]"
5. **Threshold context** — "40% very disappointed threshold context", "PMF score benchmarks [category]"

### 4. Design PMF Survey

**Core question**: "How would you feel if you could no longer use [product]?"
- Very disappointed
- Somewhat disappointed
- Not disappointed
- N/A — I no longer use [product]

**Follow-up questions by response:**

For "Very disappointed" respondents:
- What is the main benefit you get from [product]?
- What would you likely use as an alternative?
- How would you describe [product] to a friend?

For "Somewhat disappointed" respondents:
- What would you likely use instead?
- What could we improve to make [product] indispensable?

For "Not disappointed" respondents:
- Why not? What's missing for you?
- What were you hoping [product] would do that it doesn't?

**Product-specific follow-ups** (3-5 additional questions based on product context):
- Tailored to ICP jobs-to-be-done and journey critical moments
- Focused on understanding *why* users feel the way they do, not just *that* they do

Use AskUserQuestion:
- "Here's the PMF survey design. Are the follow-up questions tailored enough to your product? Any segments you want surveyed separately?"

### 5. Qualitative Signal Analysis

**If `research/customer-feedback.md` exists**, analyze for PMF signals:

| Signal Category | What to Look For | PMF Indicator |
|----------------|-------------------|---------------|
| Organic word-of-mouth | Unprompted referrals, social mentions, "told my friend about" | Strong positive |
| Usage frequency | Daily/weekly active patterns, session depth | Engagement strength |
| Emotional language | "love", "can't live without", "game-changer" vs. "it's fine", "okay" | Sentiment intensity |
| Feature requests vs. complaints | Ratio of "add X" to "fix Y" — wanting more vs. wanting less broken | Product maturity |
| Churn reasons | Why people leave — alternatives, missing features, price, no need | Fit gaps |
| Expansion signals | Upgrades, team invites, increased usage, API adoption | Growth readiness |

**If no feedback file exists**, design the signal checklist for future analysis and note which signals to start tracking immediately.

### 6. Scoring Framework

**Quantitative threshold** (Sean Ellis):
- **Strong PMF**: >40% "very disappointed" responses
- **Moderate PMF**: 25-40% "very disappointed" responses
- **Weak PMF**: <25% "very disappointed" responses

**Qualitative signals checklist**:
1. Organic word-of-mouth happening without prompting
2. Usage frequency increasing or stable (not declining)
3. Emotional language in feedback (strong positive sentiment)
4. Feature requests outnumber complaints
5. Low voluntary churn / high retention
6. Expansion behavior (upgrades, invites, deeper usage)

**Combined scoring**:
- **Strong PMF**: >40% "very disappointed" AND 3+ qualitative signals present
- **Moderate PMF**: 25-40% "very disappointed" OR 2 qualitative signals present
- **Weak PMF**: <25% "very disappointed" AND fewer than 2 qualitative signals

Use AskUserQuestion:
- "Does this scoring framework match your context? Any signals more/less important for your market?"

### 7. Populate Next Steps

Include 3-5 applicable items with "Pick one:" framing, conditional on PMF strength:

**Weak PMF:**
- `/spec-interview [top user complaint]` — Deep-dive on the weakest area to understand what's broken
- `/icp` — Re-examine customer fit; you may be selling to the wrong segment
- `/journey-map` — Map where users drop off to find the biggest gap

**Moderate PMF:**
- `/growth-model` — Model growth levers to strengthen engagement before scaling
- `/hook-model` — Design habit loops around what's already working
- `/spec-interview [most-requested feature]` — Double down on what "somewhat disappointed" users want more of

**Strong PMF:**
- `/growth-model` — Model growth channels to scale what's working
- `/roadmap` — Plan the scaling phase with confidence
- `/gtm` — Build go-to-market plan grounded in proven fit

### 8. Write Output

Only after the user confirms, write the output files.

### 9. Downstream Impact Check

After writing, check for downstream research documents that may be affected.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/metrics.md`
- `research/growth-model.md`

For each existing downstream document:
1. Read it — focus on PMF-related sections, success thresholds, growth assumptions
2. Identify conflicts where assumptions don't align with the PMF assessment findings
3. Note each conflict: file, section, stale claim, what it should now say

**Classify the impact**:
- **None**: No downstream docs exist, or no conflicts. Skip display.
- **Minor** (1-2 small conflicts): Display inline.
- **Major** (3+ conflicts OR PMF level changes growth assumptions, success targets need revision, segment focus shifted): Display and recommend `/reconcile-research`.

## Output

### `research/pmf-assessment.md` (or `research/{app}/pmf-assessment.md`)

```markdown
# PMF Assessment

> Based on: research/metrics.md[, research/icp.md, research/journey-map.md, research/customer-feedback.md]
> Date: [current date]
> Methodology: Sean Ellis PMF Survey + Qualitative Signal Analysis
> Launch Status: Live with users | Pre-launch framework

## Summary
[2-3 sentences: the PMF thesis — current fit level, key evidence, primary recommendation]

## Launch Status Assessment

**Status**: [Live with N users / Pre-launch / Early access]
**Evidence**: [what signals indicate launch status]
**Data availability**: [what data exists vs. what's needed for full scoring]

## PMF Survey Design

### Core Question

"How would you feel if you could no longer use [product]?"

| Response | Purpose |
|----------|---------|
| Very disappointed | PMF signal — these are your core users |
| Somewhat disappointed | Potential — understand what's missing |
| Not disappointed | Fit gap — understand why not |
| N/A — no longer use | Churn signal — understand what happened |

### Follow-Up Questions

#### For "Very Disappointed" Respondents
1. [Question] — *Rationale: [why this question matters for this product]*
2. [Question] — *Rationale: [why]*
3. [Question] — *Rationale: [why]*

#### For "Somewhat Disappointed" Respondents
1. [Question] — *Rationale: [why]*
2. [Question] — *Rationale: [why]*

#### For "Not Disappointed" Respondents
1. [Question] — *Rationale: [why]*
2. [Question] — *Rationale: [why]*

#### Product-Specific Follow-Ups (All Respondents)
1. [Question] — *Rationale: [why]*
2. [Question] — *Rationale: [why]*

### Recommended Sample Size
- **Minimum viable**: 40 responses (for directional signal)
- **Statistically meaningful**: 100+ responses
- **Ideal**: 200+ responses with segment breakdown

### Segment Breakdown

Survey these segments separately for segment-level PMF signals:

| Segment | Why Separate | Expected Difference |
|---------|-------------|-------------------|
| [segment] | [reason] | [hypothesis] |

## Qualitative Signal Analysis

| Signal | Current Evidence | Status |
|--------|-----------------|--------|
| Organic word-of-mouth | [evidence or "awaiting data"] | Present / Absent / Awaiting data |
| Usage frequency patterns | [evidence or "awaiting data"] | Present / Absent / Awaiting data |
| Emotional language | [evidence or "awaiting data"] | Present / Absent / Awaiting data |
| Feature requests vs. complaints | [evidence or "awaiting data"] | Present / Absent / Awaiting data |
| Churn reasons | [evidence or "awaiting data"] | Present / Absent / Awaiting data |
| Expansion signals | [evidence or "awaiting data"] | Present / Absent / Awaiting data |

**Qualitative signals present**: [count] / 6

## PMF Scoring Framework

### Quantitative Threshold (Sean Ellis)

| Level | "Very Disappointed" % | Interpretation |
|-------|----------------------|----------------|
| Strong | >40% | Clear product-market fit — scale with confidence |
| Moderate | 25-40% | Promising but not locked in — improve before scaling |
| Weak | <25% | Fit not established — iterate on product or segment |

### Signal Weights

[Note any domain-specific factors that shift the threshold. The 40% number is a guideline, not gospel — context matters.]

### Combined Assessment

| PMF Level | Quantitative | Qualitative (3+ of 6) | Action Mode |
|-----------|-------------|----------------------|-------------|
| Strong PMF | >40% | AND 3+ signals | Scale |
| Moderate PMF | 25-40% | OR 2 signals | Strengthen |
| Weak PMF | <25% | AND <2 signals | Iterate |

## Current PMF Estimate

[If data available:]
**Quantitative score**: [X]% "very disappointed" — [Strong/Moderate/Weak]
**Qualitative signals**: [N]/6 present
**Combined assessment**: [Strong/Moderate/Weak] PMF
**Confidence**: [High/Medium/Low] — based on [sample size, data quality, recency]

[If pre-launch:]
> **Pre-launch framework** — no PMF score can be calculated without live user data. Use this framework once you have 40+ active users to survey. Focus areas before measuring: [specific recommendations].

## Recommended Actions by PMF Level

| PMF Level | Primary Action | Secondary Action | Avoid |
|-----------|---------------|-----------------|-------|
| Weak | Iterate on core value prop or re-examine segment fit | Interview churned users, test with adjacent segment | Scaling spend, feature bloat |
| Moderate | Double down on what "very disappointed" users love | Improve for "somewhat disappointed" segment | Premature scaling, pivoting away from what works |
| Strong | Scale acquisition channels | Expand to adjacent segments | Over-iterating on core (it works), ignoring ops scaling |

## Strategic Implications

### What This Means for Product
[How PMF level should influence product decisions]

### What This Means for Growth
[How PMF level should influence growth investment]

### What This Means for Fundraising
[How PMF level affects investor conversations and timing]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote]"
   - **Now**: [what PMF assessment says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 7, based on PMF level]
```

### `research/pmf-assessment-search-log.md` (or `research/{app}/pmf-assessment-search-log.md`)
Raw research log — queries, findings, evidence for each PMF assessment decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires metrics.** PMF measurement without success targets is directionless. If `research/metrics.md` doesn't exist, stop and run `/metrics` first.
- **Honest about data availability.** If no live users, say so clearly — do not fabricate PMF scores.
- **The 40% threshold is a guideline, not gospel.** Context matters — note when domain-specific factors change the threshold (e.g., enterprise B2B with few customers, two-sided marketplaces, regulated industries).
- **Present before writing.** Never write output files until the assessment has been presented and validated.
- **Do not overwrite existing `research/pmf-assessment.md`** without asking the user first.
- **PMF is a spectrum, not binary.** Frame results as a continuum with actionable next steps at each level. Avoid "you have PMF" / "you don't have PMF" absolutes.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/pmf-assessment-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/pmf-assessment-{topic}.html`.

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
