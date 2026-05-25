---
name: retro
description: Strategic decision retrospective — review research decisions against actual outcomes, update confidence levels
type: analysis
version: v0.1
argument-hint: "[optional: focus area e.g. \"ICP\", \"pricing\", \"channels\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Retro — Strategic Decision Retrospective

Reviews decisions made in research docs against actual outcomes. Was the primary ICP right? Did pricing work? Did the launch channel deliver? Captures lessons and updates confidence levels across all research documents.

## Prerequisites

- **Hard**: At least 2 research docs must exist, AND at least one source of outcome data must exist (`research/customer-feedback.md`, `research/cohort-review-*.md`, or `research/runway-model.md`). If no outcome data exists, tell the user there's nothing to retrospect against yet and stop.
- **Soft**: The more research + outcome data exists, the richer the retro. Reads all of: `research/icp.md`, `research/competitive-analysis.md`, `research/journey-map.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/positioning.md`, `research/assumption-tracker.md`, `research/customer-feedback.md`, `research/cohort-review-*.md`, `research/runway-model.md`, `research/experiments/*.md`.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Everything

Read ALL research documents and outcome data. Build a map of:
- **Decisions made**: Key choices documented in each research file (primary ICP, pricing model, launch channel, positioning, etc.)
- **Predictions/targets**: Expected outcomes (metric targets, revenue projections, conversion estimates)
- **Actual outcomes**: Real data from customer feedback, cohort reviews, runway model, experiment results

### 2. Decision-by-Decision Review

For each major decision found in research docs:

#### A. ICP Decisions (from `research/icp.md`)
- Was the primary ICP selection correct?
- Did the pain points rank correctly?
- Were the trigger events accurate?
- Did the market sizing hold up?

#### B. Competitive Decisions (from `research/competitive-analysis.md`)
- Did the competitive landscape change?
- Were the identified gaps real?
- Did differentiation hold?

#### C. Journey Decisions (from `research/journey-map.md`)
- Did users follow the mapped journey?
- Was the aha moment correctly identified?
- Were the churn triggers right?

#### D. Metrics Decisions (from `research/metrics.md`)
- Were targets realistic?
- Was the North Star metric the right choice?
- Which metrics turned out to be leading vs. lagging indicators?

#### E. GTM Decisions (from `research/gtm.md`)
- Did the primary channel work?
- Was the messaging effective?
- Did the launch plan execute as designed?

#### F. Monetization Decisions (from `research/monetization.md`)
- Was the pricing model correct?
- Were price points right?
- Did unit economics match estimates?

#### G. Positioning Decisions (from `research/positioning.md`)
- Was the market category right?
- Did the competitive framing resonate?
- Was the target segment correct?

For each decision, classify:
- **Correct** — the decision was right, outcomes match
- **Partially correct** — directionally right but details were off
- **Wrong** — the decision was incorrect and outcomes show it
- **Unknown** — insufficient outcome data to judge

### 3. Pattern Analysis

Look across all decisions for patterns:
- **Systematic biases** — are we consistently too optimistic? Too conservative? Biased toward certain segments?
- **Research gaps** — which decisions had the least evidence and turned out wrong?
- **Compounding errors** — where did one wrong decision cascade into others?
- **Surprising successes** — what worked that we didn't expect?
- **Timing issues** — were decisions right but timing wrong?

### 4. Present & Validate

Use AskUserQuestion to present findings:
- Summary of decisions reviewed and their correctness
- Key patterns identified
- Recommendations for which research docs to re-run

Ask:
- "Does this assessment feel accurate? Any decisions I'm judging too harshly or too generously?"
- "Any context I'm missing about why certain decisions were made?"
- "What surprised you most in practice vs. what the research predicted?"

Incorporate feedback before proceeding.

### 5. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- IF ICP decisions were wrong: `/icp` — Re-run ICP discovery with what you now know
- IF pricing was wrong: `/monetization` — Revisit pricing with real revenue data
- IF channels underperformed: `/gtm` — Update GTM with actual channel performance
- IF assumptions tracker exists: `/assumption-tracker` — Bulk-update validation status from retro findings
- IF metrics targets were off: `/metrics` — Recalibrate targets based on baseline reality
- IF multiple docs need updating: `/reconcile-research` — Audit all research for consistency after retro findings
- ALWAYS: `/research-roadmap` — Check overall project status

### 6. Write Output

Present final retro to user. Ask:
- "Ready to write this? Anything to adjust?"

Only after confirmation, write the output file.

## Output

### `research/retro-[YYYY-MM-DD].md` (or `research/{app}/retro-[YYYY-MM-DD].md`)

```markdown
# Strategic Retro: [Date]

> Date: [current date]
> Period reviewed: [timeframe — e.g., "launch through Q1 2026"]
> Research docs reviewed: [count]
> Outcome data sources: [list]

## Summary

[3-5 sentences: the headline findings — what was right, what was wrong, and the biggest lesson]

## Decision Scorecard

| Area | Decision | Status | Evidence | Impact |
|------|----------|--------|----------|--------|
| ICP | [decision] | Correct/Partial/Wrong/Unknown | [data source] | [what it affected] |
| Competitive | [decision] | ... | ... | ... |
| Journey | [decision] | ... | ... | ... |
| Metrics | [decision] | ... | ... | ... |
| GTM | [decision] | ... | ... | ... |
| Monetization | [decision] | ... | ... | ... |
| Positioning | [decision] | ... | ... | ... |

**Score**: [X/Y correct] — [percentage]

## Detailed Analysis

### What We Got Right
[Decisions that were correct and why — what made the research good here]

1. **[Decision]** — [evidence it was right] — [lesson: what to keep doing]
2. ...

### What We Got Wrong
[Decisions that were wrong and why — what the research missed]

1. **[Decision]** — [evidence it was wrong] — [lesson: what to change]
2. ...

### What We Got Partially Right
[Decisions that were directionally correct but details were off]

1. **[Decision]** — [what was right, what was off] — [lesson]
2. ...

## Patterns

### Systematic Biases
[Recurring patterns in how decisions were made — e.g., consistently overestimating market size, underestimating competition]

### Research Gaps
[Where lack of evidence led to wrong decisions — what should have been researched more]

### Compounding Errors
[Where one wrong decision led to others — the chain of consequences]

## Confidence Updates

Research docs that should be re-run based on retro findings:

| Document | Current Confidence | Recommended Action | Why |
|----------|-------------------|-------------------|-----|
| research/icp.md | [High/Med/Low] | [Re-run / Update section / Keep] | [reason] |
| research/gtm.md | [High/Med/Low] | [Re-run / Update section / Keep] | [reason] |
| ... | | | |

## Lessons Learned

1. **[Lesson title]** — [description — specific, actionable, grounded in evidence from this retro]
2. ...

## Next Steps

Pick one:
- [conditional items from step 5]
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

- **Evidence-based judgments.** Every "correct" or "wrong" assessment must cite specific outcome data. Don't judge decisions without evidence.
- **No hindsight bias.** Judge decisions based on what was knowable at the time, not what we know now. A decision can be "right process, wrong outcome" — note when this is the case.
- **Present before writing.** Never write output files until findings have been presented and validated.
- **Separate dated files.** Each retro is a new file. Don't modify previous retros.
- **Be constructive.** The goal is learning, not blame. Frame "wrong" decisions as lessons, not failures.
- **Recommend actions.** Every finding should connect to a concrete next step for improving the research.
- **Quarterly or milestone-based.** This skill is designed for periodic use, not continuous. Note the recommended next retro date.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/retro-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

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

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/retro-{topic}.html`.

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
