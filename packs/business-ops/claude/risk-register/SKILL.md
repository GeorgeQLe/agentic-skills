---
name: risk-register
description: Broad risk assessment — key-person, technical, regulatory, competitive, financial, and execution risks beyond product/market
type: analysis
version: v0.0
argument-hint: "[optional: focus area e.g. \"technical\", \"regulatory\", \"financial\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Risk Register — Systematic Risk Assessment

Identifies and tracks risks beyond product/market: key-person, technical, regulatory, competitive, financial, and execution risks. Complements `/assumption-tracker` (which focuses on product/market assumptions) with broader organizational and environmental risks.

## Soft Prerequisites

- Read all that exist: `research/icp.md`, `research/competitive-analysis.md`, `research/gtm.md`, `research/monetization.md`, `research/runway-model.md`, `research/assumption-tracker.md`, CLAUDE.md, README
- The more context exists, the more thorough the risk identification.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before loading, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read research from `research/{app}/` instead of `research/`

### 1. Load Context

Read all available research docs and codebase files. Extract signals relevant to risk:
- **Financial**: runway, burn rate, revenue concentration
- **Technical**: tech debt, single points of failure, scaling concerns
- **Market**: competitive threats, market shifts, regulatory changes
- **Team**: key-person dependencies, skill gaps, hiring needs
- **Execution**: timeline risks, scope creep, dependency chains

### 2. Identify Risks

Use WebSearch with **3-5 targeted queries** for domain-specific risks:
1. "[industry/category] startup risks"
2. "[category] regulatory requirements"
3. "[technology stack] scaling risks"
4. "[category] common failure modes"

Systematically identify risks in each category:

#### A. Key-Person Risk
- Single points of failure in the team
- Critical knowledge held by one person
- Founder dependency

#### B. Technical Risk
- Architecture limitations, scaling bottlenecks
- Security vulnerabilities, data privacy
- Dependency on third-party services
- Technical debt accumulation

#### C. Regulatory & Legal Risk
- Compliance requirements (GDPR, SOC2, industry-specific)
- IP risks, patent exposure
- Terms of service dependencies on platforms

#### D. Competitive Risk
- Well-funded competitor entering the space
- Platform risk (building on someone else's platform)
- Open-source alternatives emerging

#### E. Financial Risk
- Revenue concentration (one big customer)
- Runway constraints
- Pricing pressure from competitors
- Cost structure changes (API pricing, infrastructure)

#### F. Execution Risk
- Scope creep, feature bloat
- Hiring challenges
- Timeline slippage
- Integration complexity

### 3. Score Each Risk

| Dimension | Scale |
|-----------|-------|
| **Likelihood** | 1 (unlikely) → 5 (near certain) |
| **Impact** | 1 (minor setback) → 5 (existential threat) |
| **Priority** | Likelihood × Impact (max 25) |

### 4. Define Mitigations

For each high-priority risk (score ≥ 12):
- **Accept**: Acknowledge and monitor
- **Mitigate**: Actions to reduce likelihood or impact
- **Transfer**: Insurance, contracts, or partnerships
- **Avoid**: Change plans to eliminate the risk

### 5. Present & Validate

Use AskUserQuestion to present the top risks:
- "Here are the highest-priority risks I've identified. Any I'm missing or scoring wrong?"
- "Are there any risks you're already mitigating that I should note?"

Incorporate feedback before proceeding.

### 6. Write Output

Only after confirmation, write the output file.

## Output

### `research/risk-register.md` (or `research/{app}/risk-register.md`)

```markdown
# Risk Register

> Last updated: [current date]
> Sources: [research docs reviewed]
> Total risks: [count] | High priority: [count]

## Summary
[2-3 sentences: the top risks and overall risk posture]

## Top Risks

| # | Risk | Category | Likelihood | Impact | Priority | Mitigation |
|---|------|----------|-----------|--------|----------|------------|
| 1 | [risk] | [category] | [1-5] | [1-5] | [L×I] | [strategy] |
| ... | | | | | | |

## Key-Person Risks
| Risk | Likelihood | Impact | Priority | Mitigation |
|------|-----------|--------|----------|------------|
| [risk] | [1-5] | [1-5] | [L×I] | [action] |

## Technical Risks
[Same table format]

## Regulatory & Legal Risks
[Same table format]

## Competitive Risks
[Same table format]

## Financial Risks
[Same table format]

## Execution Risks
[Same table format]

## Mitigation Plan

### Immediate Actions (This Month)
1. [Action] — mitigates [risk #]
2. ...

### Ongoing Monitoring
| Risk | Trigger Signal | Check Frequency |
|------|---------------|-----------------|
| [risk] | [what to watch for] | [weekly/monthly/quarterly] |

## Next Steps

**Recommended:** [recommended skill] — [one-line reason grounded in the highest-priority risk]

Other options:
- `/assumption-tracker` — Cross-reference product/market assumptions with these broader risks
- `/experiment [top risk assumption]` — Test the riskiest uncertainty when it can be validated cheaply
- `/reconcile-research` — Update downstream research if risk findings contradict existing assumptions
- `/research-roadmap` — Check overall project status
```

Create the `research/` directory if it doesn't exist.

### 7. Populate Next Steps

Before writing, choose one recommended next step using the first applicable rule:

1. IF a high-priority risk is a product/market assumption: recommend `/assumption-tracker`.
2. IF the top risk can be cheaply validated: recommend `/experiment [top risk assumption]`.
3. IF the findings contradict existing research: recommend `/reconcile-research`.
4. Otherwise recommend `/research-roadmap`.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Complement, don't duplicate.** Product/market assumptions belong in `/assumption-tracker`. This skill covers organizational, technical, regulatory, competitive, financial, and execution risks.
- **Be specific.** "Competition" is not a risk. "Well-funded competitor X launching a free tier in Q3" is.
- **Present before writing.** Never write until the user validates the assessment.
- **Score honestly.** Don't inflate risks to seem thorough. Low-probability risks should be scored low.
- **Update, don't duplicate.** If `research/risk-register.md` exists, ask whether to update or overwrite.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/risk-register-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Risk-validation gates.** Render assumption/risk evidence coverage, confidence, candidate verdicts or mitigations, artifact destination, proposed file changes, coverage checkpoint, and post-approval route as gates. Durable tracker outputs remain canonical markdown artifacts and must also be fully rendered in the alignment page.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/risk-register-{topic}.html`.

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
