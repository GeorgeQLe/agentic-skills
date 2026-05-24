---
name: gtm
description: Go-to-market planning — channel strategy, messaging, pricing, launch plan, and early traction tactics
type: research
version: v0.0
argument-hint: "[optional: focus area e.g. \"pricing\", \"launch plan\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# GTM — Go-to-Market Planning

Invoke as `$gtm`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Research-first skill that builds a go-to-market plan grounded in ICP research and competitive landscape. Covers channel strategy, messaging framework, pricing, launch plan, and early traction tactics.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist. If not, tell the user to run `$icp` first and stop.
- **Soft**: Read `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`), `research/journey-map.md` (or `research/{app}/journey-map.md`), `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if they exist — these improve specificity but aren't required.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

- Read `research/icp.md` (or `research/{app}/icp.md`) — ICP segments, pain points, value props, trigger events, current-state journey
- Read `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) if it exists — competitor positioning, pricing, channels, market gaps
- Read `research/journey-map.md` (or `research/{app}/journey-map.md`) if it exists — customer journey stages, discovery channels, conversion triggers
- Read `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if it exists — real customer language, validated/invalidated assumptions
- Read `research/positioning.md` (or `research/{app}/positioning.md`) if it exists — positioning framework that messaging should flow from
- Read CLAUDE.md and README if they exist — product context

### 2. Interview

Codex interview cadence is one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same GTM decision, not to batch unrelated questions. If the session is already in Plan mode, `request_user_input` may present 2-3 concrete choices for the current decision; otherwise ask one concise plain-text question.

**Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Assume the user has no insider knowledge unless they explicitly provide it. Present findings with data, define any relevant terms, state a recommendation with reasoning, and ask the user to approve, adjust, or override based on hard constraints, proprietary facts, or corrections. Only ask the user to choose without a recommendation when the decision genuinely depends on internal constraints, personal preferences, or strategic bets that cannot be inferred from evidence.

Cover these areas (skip or abbreviate areas the user has already addressed in `$ARGUMENTS`):

#### A. Channel Strategy
- Where does the ICP hang out? (communities, platforms, events, publications)
- Which channels do competitors use? Where are the gaps?
- What's the primary acquisition channel? (content, community, outbound, product-led, partnerships)
- What's the secondary/backup channel?
- What's the budget and resource constraint? (bootstrapped, funded, team size)

#### B. Messaging Framework
- IF `research/positioning.md` exists: use positioning statement, market category, unique attributes, and value mapping as the foundation for messaging — do not contradict positioning decisions
- What's the one-liner? (the sentence that makes the ICP lean in — should flow from positioning statement)
- What's the primary value prop framing? (save time, save money, reduce risk, unlock capability — should align with positioning value mapping)
- What pain point does the headline address? (from ICP pain map)
- What proof points exist? (metrics, testimonials, case studies, demos)
- How does positioning differ from competitors? (from positioning.md if it exists, otherwise from competitive analysis)

#### C. Pricing Strategy
- What's the pricing model? (freemium, free trial, paid-only, usage-based, seat-based)
- What's the entry price point? What does the ICP currently pay for alternatives?
- What triggers the upgrade? (usage limits, team features, advanced capabilities)
- Are there pricing tiers? What differentiates them?
- How does pricing compare to competitors?

#### D. Launch Plan
- What's the launch timeline? (soft launch, beta, public launch)
- What's the launch channel? (Product Hunt, Hacker News, Twitter, email list, direct outreach)
- What's the launch goal? (signups, revenue, feedback, press)
- What launch assets are needed? (landing page, demo, video, blog post)
- Who are the first 10 customers? (specific names or types)

#### E. Early Traction Tactics
- What's the 30-day post-launch plan?
- What manual/unscalable things will you do? (concierge onboarding, personal outreach, hand-holding)
- What's the feedback loop? (how will you learn from early users?)
- What's the one metric that matters for the first 90 days?
- When do you pivot from manual to scalable?

### 3. Present Findings & Validate

**Present the complete GTM plan to the user before writing.** Summarise with evidence:
1. Channel strategy — primary and secondary channels, with ICP behavior data supporting each choice
2. Messaging framework — one-liner, value prop framing, proof points, citing specific ICP pain points addressed
3. Pricing strategy — model, entry point, tiers, with competitor pricing benchmarks as anchors
4. Launch plan — timeline, channels, goals, assets needed, citing trigger events that inform timing
5. Early traction tactics — 30/60/90 day plan, the one metric that matters, with journey data supporting the traction approach

If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Does this capture the go-to-market plan? What constraints, missing facts, or weak assumptions should I adjust?"

Continue until the user confirms. Only then proceed to writing.

### 4. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2–4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** [recommended skill] — [one-line reason why this is the highest-impact next action given current state]

Other options:
- `$skill` — [description]
- ...

**Recommendation priority:**
1. IF downstream impact is **Major**: recommend `$reconcile-research` — [N] conflicts found in downstream docs need resolution before other work
2. Otherwise, recommend the first applicable from this list:
   - IF no `research/growth-model.md`: `$growth-model` — design compounding growth loops to make the GTM strategy sustainable
   - IF `specs/` exist and no `tasks/roadmap.md`: `$roadmap` — plan the build with launch milestones from above
   - IF no `research/metrics.md`: `$metrics` — define success metrics for the launch goals
   - IF open questions need research: `$spec-interview [top question]` — validate the most critical open question
   - IF `tasks/roadmap.md` exists: `$run` — start executing — the GTM plan is set

**Other options** (include all applicable items not chosen as recommended):
- IF `specs/` exist and no `tasks/roadmap.md`: `$roadmap` — Plan the build with launch milestones from above
- IF no `research/metrics.md`: `$metrics` — Define success metrics for the launch goals
- IF open questions need research: `$spec-interview [top question]` — Validate the most critical open question
- IF `tasks/roadmap.md` exists: `$run` — Start executing — the GTM plan is set
- IF no `research/journey-map.md`: `$journey-map` — Map the customer journey to validate funnel assumptions
- IF no `research/growth-model.md`: `$growth-model` — Design compounding growth loops to sustain GTM momentum
- IF no `research/positioning.md`: `$positioning` — Define strategic positioning — messaging should flow from positioning

**Impact-aware adjustments:**
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

### 5. Write Output

Only after the user has validated the findings, write the output files.

### 6. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - A pricing model reference that contradicts the pricing strategy just defined
   - Channel strategy assumptions that have shifted
   - Launch timeline or traction targets that no longer align
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., pricing model changed, primary channel shifted, launch timeline moved significantly): Display conflicts and strongly recommend `$reconcile-research`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/gtm.md` (or `research/{app}/gtm.md`)

```markdown
# Go-to-Market Plan

> Based on: research/icp.md (or research/{app}/icp.md)[, research/competitive-analysis.md, research/journey-map.md, research/customer-feedback.md]
> Date: [current date]

## Summary
[2-3 sentences: the core GTM thesis — who you're targeting, how you'll reach them, and what makes this approach viable]

## Channel Strategy

### Primary Channel: [channel name]
**Why**: [rationale grounded in ICP behavior and competitive gaps]
**How**: [specific tactics]
**Cost**: [budget/resource requirement]
**Timeline**: [when this ramps up]

### Secondary Channel: [channel name]
**Why**: [rationale]
**How**: [specific tactics]

### Channels Explicitly Deprioritized
[Channels considered and rejected, with reasoning — prevents revisiting]

## Messaging Framework

### One-Liner
[The sentence that makes the ICP lean in]

### Value Prop Framing
**Primary frame**: [save time / save money / reduce risk / unlock capability]
**Pain point addressed**: [from ICP pain map]
**Proof points**: [metrics, testimonials, demos]

### Positioning vs. Competitors
[How messaging differentiates from top 2-3 competitors]

## Pricing Strategy

### Model
[Freemium / free trial / paid-only / usage-based / seat-based]

### Entry Point
**Price**: [amount]
**Comparable**: [what the ICP currently pays for alternatives]
**Includes**: [what's in the base tier]

### Tiers (if applicable)
| Tier | Price | Target Segment | Key Differentiator |
|------|-------|----------------|-------------------|
| ... | ... | ... | ... |

### Upgrade Triggers
[What causes users to move up tiers]

## Launch Plan

### Timeline
[Soft launch → beta → public launch dates and goals]

### Launch Channel(s)
[Where and how — specific platforms and tactics]

### Launch Assets Needed
- [ ] [Asset 1]
- [ ] [Asset 2]

### First 10 Customers
[Who they are, how to reach them, why they'd say yes]

## Early Traction — 30/60/90 Days

### First 30 Days
[Manual, unscalable tactics — concierge onboarding, personal outreach]

### Days 30-60
[Start systematizing what works — templates, automation, repeatable processes]

### Days 60-90
[Scale what's working, drop what isn't — the metric that decides]

### The One Metric That Matters
[The single metric for the first 90 days, with target]

## Open Questions
[Decisions deferred, experiments to run, things that need real-world data]

<!-- Only include this section when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `$reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

**Recommended:** `$skill` — [one-line reason]

Other options:
- [conditional items from step 4 — only include items whose conditions are met]
```

### `research/gtm-interview.md` (or `research/{app}/gtm-interview.md`)
Raw interview log — questions, options presented, user responses, and a closing summary of key decisions.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires ICP.** Cannot build a GTM plan without knowing who you're selling to.
- **Ground in research.** Every channel, message, and pricing decision should trace back to ICP insights, competitive gaps, or customer feedback.
- **Be specific.** "Use social media" is not a channel strategy. "Post weekly technical deep-dives on Twitter targeting DevOps engineers who follow [competitor]" is.
- **Present before writing.** Never write output files until findings have been presented and validated.
- **Don't prescribe product changes.** GTM is about reaching and converting the market with what exists. Product gaps belong in `$mvp-gap` or `$brainstorm`.
- **Do not overwrite existing `research/gtm.md`** (or `research/{app}/gtm.md`) without asking the user first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/gtm-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/gtm-{topic}.html`.

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
