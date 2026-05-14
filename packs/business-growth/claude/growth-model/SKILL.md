---
name: growth-model
type: research
version: 1.0.0
description: Reforge-style growth loop design — acquisition, retention, and monetization loops
argument-hint: "[optional: specific loop type e.g. \"viral\", \"content\", \"paid\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Growth Model — Reforge-Style Growth Loop Design

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Designs compounding growth loops using Reforge methodology. Identifies and designs acquisition loops (viral, content, paid, sales), retention loops, and monetization loops that compound over time. Growth loops replace the traditional funnel model — each loop's output becomes its input, creating sustainable growth.

## Prerequisites

- **Hard**: `research/metrics.md` (or `research/{app}/metrics.md`) must exist. If not, tell the user to run `/metrics` first and stop.
- **Hard**: `research/gtm.md` (or `research/{app}/gtm.md`) must exist. If not, tell the user to run `/gtm` first and stop.
- **Soft**: Read these if they exist:
  - `research/journey-map.md` — retention stages, aha moment, habit loop
  - `research/monetization.md` — pricing model, revenue mechanics
  - `research/hook-model.md` — engagement patterns, trigger-action-reward-investment cycle

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context

- Read `research/metrics.md` (or `research/{app}/metrics.md`) — success targets, KPIs, activation/engagement/retention/growth metrics
- Read `research/gtm.md` (or `research/{app}/gtm.md`) — channels, acquisition strategy, pricing model, early traction tactics
- Read `research/journey-map.md` (or `research/{app}/journey-map.md`) if it exists — customer journey stages, aha moment, habit loop, churn triggers
- Read `research/monetization.md` (or `research/{app}/monetization.md`) if it exists — pricing tiers, upgrade triggers, revenue model
- Read `research/hook-model.md` (or `research/{app}/hook-model.md`) if it exists — engagement loops, trigger-action-reward-investment cycle
- Read CLAUDE.md, README, and key source files for product context

### 2. Research Growth Loops

Use WebSearch with **4-6 targeted queries**:

1. **Reforge methodology** — "Reforge growth loops [category]"
2. **Domain-specific models** — "growth model [domain] examples"
3. **Competitor growth strategies** — "[competitor] growth strategy"
4. **Viral mechanisms** — "viral loop [product type]"
5. **Content loops** — "content loop B2B SaaS"
6. **Compounding mechanisms** — "compounding growth mechanisms [category]"

### 3. Identify Loop Candidates

Categorize potential loops from research and product context:

**Acquisition loops** — how new users are acquired:
- **Viral** — user invites user (referral, sharing, word-of-mouth)
- **Content** — content attracts user (SEO, UGC, community content)
- **Paid** — revenue funds acquisition (paid ads, sponsorships)
- **Sales** — revenue funds sales team (outbound, enterprise sales)

**Retention loops** — how users stay and deepen engagement:
- **Engagement** — usage deepens value (more data, personalization, history)
- **Network** — more users = more value (marketplace, social, collaboration)
- **Switching cost** — investment creates lock-in (integrations, customization, data)

**Monetization loops** — how revenue compounds:
- **Expansion** — usage drives upgrades (seat growth, tier upgrades, usage-based expansion)
- **Cross-sell** — one product leads to another (platform play, add-ons)

Use AskUserQuestion to present and validate:
- "Here are the growth loop candidates I see for this product. Which feel realistic given your current stage, resources, and product type? Any I should add or remove?"

### 4. Design Primary Loop

For the highest-potential loop, design it in detail:

- **Each step in the loop** — what happens at each stage, who does what
- **Conversion hypothesis between steps** — what must be true for users to move from one step to the next (each is a hypothesis until validated)
- **Compounding mechanism** — what makes the output feed back as input, creating exponential rather than linear growth
- **Key metric at each step** — the measurable signal that this step is working
- **Time-to-complete-cycle estimate** — how long one full loop iteration takes

Use AskUserQuestion:
- "Is this primary loop realistic? What's the weakest step?"

### 5. Design Supporting Loops (1-2)

Design secondary loops that reinforce the primary:
- Show how they interact — which loop's output feeds another's input
- Identify where loops share steps or handoff points
- Keep these lighter than the primary — they support, not compete

### 6. Map Dependencies & Metrics

- Align each loop step with metrics from `research/metrics.md`
- Identify gaps where metrics don't cover loop steps
- Show loop-to-loop dependencies — where one loop's output feeds another's input
- Flag metrics that need to be added to track loop health

Use AskUserQuestion:
- "Does this growth model align with your metrics framework? Any metric gaps or misalignments?"

### 7. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3-5 applicable items with "Pick one:" framing:

- RECOMMEND: `/spec-interview [top growth mechanism]` — Spec the highest-impact growth mechanism for implementation
- IF `specs/` exist and `tasks/roadmap.md` exists: `/roadmap` — Update roadmap with growth loop implementation work
- IF product is live or launching: `/experiment [growth hypothesis]` — Test the primary loop's weakest conversion hypothesis
- IF no `research/hook-model.md`: `/hook-model` — Design engagement hooks that power the retention loop
- IF no `research/monetization.md`: `/monetization` — Define monetization mechanics that feed the expansion loop

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"

### 8. Write Output

Only after the user confirms, write the output files.

### 9. Downstream Impact Check

After writing, check for downstream research documents that may be affected. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/metrics.md`
- `research/gtm.md`

For each existing downstream document:
1. Read it — focus on sections that reference growth strategy, acquisition channels, retention mechanisms, or expansion metrics
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - A growth metric that doesn't align with the loop steps defined here
   - Channel strategy assumptions that don't match the acquisition loops designed
   - Retention targets that don't account for the retention loop mechanics
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1-2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., primary acquisition loop contradicts GTM channel strategy, retention model fundamentally differs from metrics targets): Display conflicts and strongly recommend `/reconcile-research`.

## Output

### `research/growth-model.md` (or `research/{app}/growth-model.md`)

```markdown
# Growth Model

> Based on: research/metrics.md, research/gtm.md[, research/journey-map.md, research/monetization.md, research/hook-model.md]
> Date: [current date]
> Methodology: Reforge Growth Loops

## Summary
[2-3 sentences: the growth thesis — what loops drive this product's growth, why they compound, and what stage they're appropriate for]

## Loop Inventory

| Loop | Type | Potential | Stage-Readiness |
|------|------|-----------|-----------------|
| [loop name] | Acquisition / Retention / Monetization | High / Medium / Low | [why it fits or doesn't fit current stage] |

## Primary Growth Loop: [Loop Name]

**Type**: [Acquisition / Retention / Monetization]
**Compounding mechanism**: [what makes the output feed back as input]
**Cycle time estimate**: [how long one full loop iteration takes]

### Loop Steps

1. **[Step name]**
   - What happens: [description]
   - Key metric: [measurable signal]
   - Conversion hypothesis: [what must be true to reach step 2]

2. **[Step name]**
   - What happens: [description]
   - Key metric: [measurable signal]
   - Conversion hypothesis: [what must be true to reach step 3]

3. **[Step name]**
   - What happens: [description]
   - Key metric: [measurable signal]
   - Conversion hypothesis: [what must be true to feed back into step 1]

### Why This Loop Compounds
[Explain the specific mechanism — why does more output create more input? What's the flywheel effect?]

### Weakest Step
[Which conversion hypothesis is most uncertain, and what would validate it]

## Supporting Loop 1: [Loop Name]

**Type**: [Acquisition / Retention / Monetization]
**Compounding mechanism**: [what makes the output feed back as input]
**Cycle time estimate**: [how long one full loop iteration takes]

### Loop Steps
[Same structure as primary, lighter detail]

### Interaction with Primary Loop
[How this loop's output feeds the primary loop's input, or vice versa]

## Supporting Loop 2: [Loop Name]

**Type**: [Acquisition / Retention / Monetization]
**Compounding mechanism**: [what makes the output feed back as input]
**Cycle time estimate**: [how long one full loop iteration takes]

### Loop Steps
[Same structure as primary, lighter detail]

### Interaction with Primary Loop
[How this loop's output feeds the primary loop's input, or vice versa]

## Loop Interaction Map

[How loops feed each other — which loop's output becomes another's input]

- **[Loop A]** step [N] output --> feeds **[Loop B]** step [M] input
- **[Loop B]** step [N] output --> feeds **[Loop A]** step [M] input

## Metrics Alignment

| Loop Step | Metric | Current Target | Gap? |
|-----------|--------|---------------|------|
| [Primary loop - step 1] | [metric from metrics.md] | [target] | [Yes — no metric covers this / No] |
| [Primary loop - step 2] | [metric from metrics.md] | [target] | [Yes / No] |
| [Supporting loop - step 1] | [metric from metrics.md] | [target] | [Yes / No] |

### Metric Gaps
[List loop steps that have no corresponding metric in research/metrics.md — these need to be added]

## Growth Hypotheses to Test

| Hypothesis | Loop | Priority | Validation Method |
|-----------|------|----------|-------------------|
| [conversion hypothesis between loop steps] | [which loop] | High / Medium / Low | [how to test — experiment, survey, instrumentation] |

## Strategic Implications

### What This Model Means for Product
[Feature priorities that support loop mechanics — what to build to strengthen the weakest steps]

### What This Model Means for GTM
[How growth loops should shape channel investment, messaging, and launch sequencing]

### What This Model Means for Metrics
[Which metrics need to be added or reframed to track loop health]

### Stage-Appropriate Sequencing
[Which loops to activate now vs. later — match loop complexity to current stage]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 7 — only include items whose conditions are met]
```

### `research/growth-model-search-log.md` (or `research/{app}/growth-model-search-log.md`)
Raw research log — queries, findings, evidence for each growth loop decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stays in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires metrics + GTM.** Growth loops without success targets and channel strategy are theoretical.
- **Stage-appropriate.** Don't design viral loops for pre-launch products with no users. Match loop complexity to current stage.
- **Compounding is key.** If the loop's output doesn't feed back as input, it's not a loop — it's a funnel step.
- **Hypothesis-driven.** Every conversion between loop steps is a hypothesis until validated.
- **Present before writing.** Never write output files until the growth model has been presented and validated.
- **Do not overwrite existing `research/growth-model.md`** (or `research/{app}/growth-model.md`) without asking the user first.

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
