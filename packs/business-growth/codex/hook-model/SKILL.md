---
name: hook-model
type: research
version: 1.0.0
description: Nir Eyal engagement loop design — trigger, action, variable reward, investment
argument-hint: "[optional: specific engagement loop or user behavior to focus on]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Hook Model — Engagement Loop Design

Invoke as `$hook-model`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Designs habit-forming engagement loops using Nir Eyal's Hook Model framework. Maps External Triggers → Internal Triggers → Action → Variable Reward → Investment for each core product behavior. This skill is most relevant for consumer and PLG products — B2B/enterprise products should typically skip to `$metrics`.

Default stance: assume the user has no insider knowledge of user psychology or engagement patterns. The hook design must stand on research, customer evidence, and codebase reality before asking for user input. Ask for corrections, proprietary insights, and hard constraints, not intuition.

## Prerequisites

- **Hard**: `research/journey-map.md` (or `research/{app}/journey-map.md`) must exist. If not, tell the user to run `$journey-map` first and stop.
- **Soft**: Read these if they exist:
  - `research/icp.md` — emotional pains, motivations, user psychology
  - `research/competitive-analysis.md` — competitor engagement mechanics, retention strategies

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context

- Read `research/journey-map.md` — retention stages, habit opportunities, critical moments, aha moments, drop-off points
- Read `research/icp.md` if it exists — emotional pains, motivations, trigger events, daily routines
- Read `research/competitive-analysis.md` if it exists — competitor engagement mechanics, retention strategies, habit loops
- Read CLAUDE.md, README, and key source files for product context

### 2. Applicability Check

Detect product type from context. Evaluate whether habit-loop design is appropriate:

- **Usage frequency**: Is the product used daily/weekly, or monthly/quarterly?
- **User type**: Consumer, prosumer, SMB, or enterprise?
- **Sales cycle**: Self-serve or long sales cycle with procurement?
- **Consumer-facing component**: Does the product have end-user engagement, or is it infrastructure/back-office?

IF the product is B2B/enterprise with long sales cycles, infrequent usage, or no consumer-facing component:

If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "This appears to be a B2B/enterprise product where habit loops may not apply. Usage is [infrequent/transactional/procurement-driven]. Would you like to skip to `$metrics` instead, or continue with hook model design for specific engagement patterns?"

If user chooses skip, recommend `$metrics` and stop.

### 3. Research Hook Patterns

Use WebSearch with **4-6 targeted queries**:

1. **Hook model domain examples** — "hook model [domain] examples"
2. **Nir Eyal category applications** — "Nir Eyal hooked [category]"
3. **Habit-forming product design** — "habit forming [product type] design"
4. **Variable reward types** — "variable reward types [category]"
5. **Engagement loop patterns** — "engagement loops [domain]"
6. **Competitor engagement mechanics** — "[competitor] engagement mechanics"

### 4. Design Hook Loops

For each distinct user behavior that should become habitual, design the full hook:

**External Triggers** (from journey discovery/acquisition stages):
- Notifications, emails, social prompts, content, integrations
- Map to specific journey touchpoints where the trigger fires

**Internal Triggers** (from ICP emotional pains):
- Boredom, anxiety, FOMO, uncertainty, loneliness, incompleteness
- The emotional state that precedes the habitual action
- Must connect to real ICP pain data, not assumptions

**Action** (the simplest behavior in anticipation of reward):
- Must be easier than the thought — lower friction than NOT doing it
- Follows Fogg Behavior Model: Motivation + Ability + Trigger = Behavior
- Identify friction points and how to minimize them

**Variable Reward** (classify each):
- **Tribe** — social validation, acceptance, belonging, status among peers
- **Hunt** — material resources, information, deals, search for relevant content
- **Self** — mastery, completion, competence, consistency, self-improvement

**Investment** (user puts something in that loads the next trigger):
- Data, content, followers, reputation, skill, preferences, history
- Each investment should make the next cycle more valuable AND more likely

If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "Here are the hook loops I've designed. Which triggers feel forced, which actions are too complex, and which rewards don't match your users' real motivations?"

### 5. Map Multiple Hooks

If the product has distinct engagement loops (e.g., creation loop vs. consumption loop, social loop vs. productivity loop):

1. Design each loop separately with the full 4-component structure
2. Identify reinforcement points — where one loop feeds into another
3. Map the hook interaction pattern — which loops are primary vs. supporting
4. Identify the "gateway hook" — the first loop new users enter

If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "Do these loops capture the core behaviors you want to be habitual? Any missing loops or interactions between them?"

### 6. Populate Next Steps

Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2-4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** `$metrics` — define engagement and retention metrics grounded in these hook loops

Other options:
- `$spec-interview [engagement mechanism]` — Spec out the highest-priority engagement mechanism
- IF no `research/monetization.md`: `$monetization` — Hook loops inform monetization timing — when to convert habitual users

### 7. Write Output

Only after the user confirms, write the output files.

Create the `research/` directory if it doesn't exist.

### 8. Downstream Impact Check

After writing, check for downstream research documents that may be affected.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/metrics.md`
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on engagement metrics, retention definitions, conversion triggers
2. Identify conflicts where metrics or monetization assumptions don't align with the designed hook loops
3. Note each conflict: file, section, stale claim, what it should now say

**Classify the impact**:
- **None**: No downstream docs exist, or no conflicts. Skip display.
- **Minor** (1-2 small conflicts): Display inline.
- **Major** (3+ conflicts OR primary hook loop changed, reward type shifted, trigger mechanism redesigned): Display and recommend `$reconcile-research`.

## Output

### `research/hook-model.md` (or `research/{app}/hook-model.md`)

```markdown
# Hook Model — Engagement Loop Design

> Based on: research/journey-map.md[, research/icp.md, research/competitive-analysis.md]
> Date: [current date]
> Methodology: Hook Model (Nir Eyal, "Hooked")
> Applicability: [Consumer / PLG / B2B with consumer component / Limited — see assessment]

## Summary
[2-3 sentences: the engagement thesis — what behaviors should become habitual, why they matter for retention, and how the hooks reinforce each other]

## Applicability Assessment

**Product type**: [Consumer / PLG / B2B / Marketplace / etc.]
**Expected usage frequency**: [Daily / Weekly / Event-driven / etc.]
**Habit potential rating**: [High / Medium / Low]
**Rationale**: [Why this product is or isn't a strong candidate for habit-loop design]

## Hook Loop 1: [Behavior Name]

> Target behavior: [the specific action that should become habitual]
> Frequency target: [how often this should occur]

### Trigger

**External Triggers** (acquisition/re-engagement):
| Trigger Type | Channel | Journey Stage | Evidence |
|-------------|---------|---------------|----------|
| [type] | [email/push/social/etc.] | [discovery/onboarding/retention] | [source] |

**Internal Trigger** (emotional state):
- **Emotion**: [the feeling that precedes the action]
- **Context**: [when/where this emotion arises]
- **Evidence**: [from ICP data — not assumed]

### Action

**The behavior**: [simplest action in anticipation of reward]
**Motivation**: [why the user is motivated in this moment]
**Ability**: [why this is easy enough — fewer steps than the thought]
**Current friction**: [what makes this harder than it should be]
**Friction reduction**: [how to make the action effortless]

### Variable Reward

**Type**: [Tribe / Hunt / Self]
**The reward**: [what the user gets]
**Why it's variable**: [what changes each time — unpredictability]
**Evidence**: [why this reward matches real user motivations]

### Investment

**What the user stores**: [data / content / followers / reputation / skill / preferences]
**How it loads the next trigger**: [why this investment makes the next cycle more likely]
**Compounding effect**: [how the investment makes the product more valuable over time]

## Hook Loop 2: [Behavior Name]
[Same structure as Hook Loop 1]

## Hook Interaction Map

[How the loops reinforce each other — which loop feeds into which, what the gateway hook is for new users]

| Loop | Feeds Into | Mechanism |
|------|-----------|-----------|
| [loop name] | [loop name] | [how one loop's investment/reward triggers the other] |

**Gateway hook**: [the first loop new users enter]
**Reinforcement pattern**: [how loops compound — e.g., creation feeds consumption which feeds social which feeds creation]

## Engagement Risk Assessment

### Ethical Considerations
- [Risk 1: potential for manipulation or dark pattern]
- [Risk 2: potential for addictive behavior without genuine value]

### Dark Pattern Avoidance
- [Guideline 1: how to keep engagement genuine]
- [Guideline 2: how to ensure user control and transparency]

### Value Alignment
- [How each hook loop delivers genuine user value, not just engagement metrics]

## Strategic Implications

### For Product
[What to build to strengthen the hooks — feature priorities, friction reduction, reward design]

### For Metrics
[What to measure — trigger response rates, action completion, reward satisfaction, investment depth]

### For Growth
[How hooks create organic growth — virality through social triggers, investment-driven retention]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote]"
   - **Now**: [what hook model says instead]

[For Major only:]
> **Recommended action**: Run `$reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

**Recommended:** `$metrics` — define engagement and retention metrics grounded in these hook loops

Other options:
- [conditional items from step 6]
```

### `research/hook-model-search-log.md` (or `research/{app}/hook-model-search-log.md`)
Raw research log — queries, findings, evidence for each hook design decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stays in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires journey map.** Hooks without journey context are disconnected from reality.
- **Evidence-grounded.** Triggers and rewards must connect to ICP data and journey insights — not wishful thinking.
- **Ethical awareness.** Flag potential dark patterns. Design for genuine value, not manipulation.
- **Do not force habit-loop thinking on products where usage is naturally infrequent or transactional.** The applicability check exists for a reason — respect it.
- **Present before writing.** Never write output files until the hook loops have been presented and validated.
- **Do not overwrite existing `research/hook-model.md`** without asking the user first.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/hook-model-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/hook-model-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/hook-model-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

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
