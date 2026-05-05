---
name: journey-map
description: Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) through the product
type: analysis
version: 1.2.0
argument-hint: "[optional: specific use case or journey stage to focus on]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Journey Map — User & Customer Journey Mapping

Interview the user to map how people will flow through the product (user journey) and through the business relationship (customer journey). Requires an ICP (`research/icp.md`); solution specs are useful supporting context when present, but this skill should normally run before `/spec-interview` so the spec is grounded in discovery, evaluation, onboarding, aha, conversion, retention, and advocacy.

## Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist. If not, tell the user to run `/icp` first and stop.
- Specs in `specs/*.md` (or `specs/{app}/*.md`) are optional supporting context. If no specs exist, map the intended journey from ICP, competitive research, and codebase/product evidence, then route top journey gaps to `/spec-interview`.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

- Read `research/icp.md` (or `research/{app}/icp.md`) — customer profile, user profiles, trigger events, current-state journey, pain map, value prop
- Read `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) if it exists — competitor UX patterns and gaps
- Read all spec files in `specs/` (or `specs/{app}/`) if they exist — existing solution decisions that the journeys should respect
- Read CLAUDE.md, README, and key source files if a codebase exists — ground journeys in what's actually built
- Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) if it exists — enterprise stakeholder journeys may differ significantly

### 2. Interview — User Journeys

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn.

**Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge they haven't shared (internal constraints, personal preferences, strategic bets).

For each **user profile** identified in the ICP, map their primary use cases and task flows through the product:

#### A. Identify Use Cases
- What are the 3–5 core things this user type does with the product?
- Which use case is the entry point (first thing they do)?
- Which use case delivers the most value (the reason they keep coming back)?
- Are there different frequency patterns (daily vs. weekly vs. occasional)?

#### B. Map Task Flows Per Use Case
For each use case:
- **Entry point** — How does the user start this task? (notification, scheduled, ad-hoc, triggered by external event)
- **Steps** — What does the user do, step by step? (actions, decisions, inputs, outputs)
- **Decision points** — Where does the user make choices? What information do they need?
- **Happy path** — What does success look like?
- **Failure modes** — Where can this go wrong? What does recovery look like?
- **Output/outcome** — What does the user have at the end that they didn't before?

#### C. Cross-Reference with Current State
For each mapped task flow, compare against the ICP's "Current State Journey":
- Which current-state steps does this replace or improve?
- Where is the delta greatest (biggest improvement over status quo)?
- Where is the delta smallest (barely better than what they do today)?

### 3. Interview — Customer Journey

Map the full business lifecycle from trigger to retention:

#### A. Trigger → Discovery
- What trigger events (from `research/icp.md`) cause someone to start looking?
- How do they discover the product? (search, referral, content, community, ads, word-of-mouth)
- What's their first impression? What do they see before signing up?
- What's the "hook" that makes them try it vs. the next search result?

#### B. Evaluation → Trial
- What does the evaluation look like? (free trial, freemium, demo, POC)
- What do they need to see to decide it's worth their time?
- How long is the evaluation period?
- What are the deal-killers at this stage? (pricing, missing feature, complexity, trust)

#### C. Onboarding → Aha Moment
- What are the first 5 minutes like? First hour? First day?
- What is the "aha moment" — the specific action or outcome where they realize the product's value?
- How many steps between sign-up and aha moment? (fewer = better)
- What are the drop-off points during onboarding?
- Does onboarding differ by user profile? (power user vs. casual)

#### D. Conversion
- What triggers the decision to pay? (trial expiring, hitting limits, team adoption)
- Who makes the buying decision? (user, manager, team lead)
- What pricing/packaging objections exist?
- What's the conversion timeline from aha moment to payment?

#### E. Retention & Expansion
- What keeps them coming back daily/weekly? (the core habit loop)
- What would cause them to churn? (broken workflow, competitor, outgrown the product)
- How does usage expand? (more users, more use cases, deeper integration)
- What are the leading indicators of churn vs. expansion?

#### F. Advocacy
- What would make someone recommend this product?
- Where do they share? (team, social, community, review sites)
- Is there a built-in viral loop? (collaboration, sharing, invites)

### 4. Present Findings & Validate

**Present the complete journey maps to the user before writing.** Summarise:
1. User journey overview — use cases per profile, key task flows, biggest deltas from current state
2. Customer journey overview — full funnel from trigger to advocacy
3. Critical moments — the aha moment, top drop-off points, churn triggers, citing the ICP data, competitive analysis, or spec evidence that supports each critical moment
4. Journey gaps — stages where the product or business model has no clear answer, citing the ICP data, competitive analysis, or spec evidence that reveals each gap

Use the AskUserQuestion tool to ask:
- "Does this capture the experience you want to build? Any missing use cases or stages?"
- If any journey stages are vague, ask targeted follow-ups to nail them down

Continue until the user confirms the journeys are complete. Only then proceed to writing.

### 5. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- IF consumer or PLG product AND no `research/hook-model.md`: `/hook-model` — Design habit loops grounded in the journey before defining metrics
- ALWAYS (fallback when hook-model skipped or exists): `/metrics` — Define success metrics tied to the journey stages and critical moments
- IF no `specs/` exist or journey gaps require product decisions: `/spec-interview [top journey opportunity or gap]` — turn the journey into a buildable product spec
- IF `specs/` exist and no UX variation exists: `/ux-variation` — explore experience alternatives for onboarding, workflow, sharing, retention, and conversion before UI lock-in
- IF UX variation exists and no UI spec exists: `/ui-interview` — lock the selected experience into buildable screen detail
- IF specs plus UX/UI planning exist and no `tasks/roadmap.md`: `/roadmap` — Plan the build with journey coverage in mind
- IF no `research/gtm.md`: `/gtm` — Build a GTM plan grounded in the customer journey
- IF journey gaps identified above: `/spec-interview [top gap]` — Spec the most critical journey gap
- IF `tasks/roadmap.md` exists: `/run` — Continue building with journey context

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

### 6. Write Output

Only after the user has validated the findings, write the output files.

### 7. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/metrics.md`
- `research/gtm.md`
- `research/monetization.md`
- `research/customer-feedback.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Metric definitions tied to journey stages or aha moments that have shifted
   - GTM funnel assumptions built on journey stages that changed
   - Monetization conversion triggers referencing journey moments that were redefined
   - Customer feedback categorization against journey stages that no longer exist
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., aha moment redefined, journey stages restructured, churn triggers changed significantly): Display conflicts and strongly recommend `/reconcile-research`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/journey-map.md` (or `research/{app}/journey-map.md`)

```markdown
# Journey Map

> Based on: research/icp.md (or research/{app}/icp.md)[, specs/[topic].md if present]
> Date: [current date]

## Summary
[2-3 sentences: primary user's core journey, the aha moment, and the biggest opportunity/risk in the funnel]

## User Journeys

### [User Profile 1 Name]

#### Use Case Overview
| Use Case | Frequency | Entry Point | Value Delivered |
|----------|-----------|-------------|-----------------|
| ...      | Daily     | ...         | ...             |

#### [Use Case 1]: [Name]
**Entry point**: [How they start]
**Steps**:
1. [Step] — [what happens, what the user sees/does]
2. [Step] — ...

**Happy path outcome**: [What success looks like]
**Failure modes**: [What can go wrong and recovery path]
**Delta from current state**: [How much better this is vs. what they do today]

#### [Use Case 2]: [Name]
...

### [User Profile 2 Name]
...

## Customer Journey

### Trigger → Discovery
[Trigger events that start the search, discovery channels, first impression, the hook]

### Evaluation → Trial
[What evaluation looks like, what they need to see, deal-killers, timeline]

### Onboarding → Aha Moment
[First 5 min / first hour / first day experience.
 The aha moment: [specific action/outcome].
 Steps from sign-up to aha: [count].
 Drop-off points: [where and why]]

### Conversion
[What triggers payment, who decides, objections, timeline from aha to pay]

### Retention & Expansion
[Core habit loop, churn triggers, expansion paths, leading indicators]

### Advocacy
[What drives recommendations, sharing channels, viral loops]

## Critical Moments
[The 3-5 make-or-break moments in the combined journey — the points where you win or lose the customer. Each with: what it is, why it matters, and what success looks like.]

## Journey Gaps
[Stages where the product, specs, or business model have no clear answer yet. Each gap should include a _Start with:_ `/spec-interview [topic]` prompt.]

<!-- Include this section only when downstream impact is Minor or Major. Omit entirely for None. -->
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
- [conditional items from step 5 — only include items whose conditions are met]
```

### `research/journey-map-interview.md` (or `research/{app}/journey-map-interview.md`)
Raw interview log — questions, options, responses, and a closing summary of key insights.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires ICP; specs are optional.** When specs are missing, map the intended lifecycle from ICP, competitive research, codebase/product evidence, and user corrections, then route product decisions to `/spec-interview`.
- **Stay concrete.** Every journey step should describe a specific action, screen, or decision — not abstract concepts like "user engages with product."
- **Ground in the ICP.** The user profiles, trigger events, and pain map from the ICP should directly inform journey mapping. If a journey step doesn't connect to a real user need, flag it.
- **Cross-reference specs when present.** If a journey step requires functionality not in any spec, flag it as a journey gap with a `/spec-interview` prompt.
- **Do not prescribe UI or architecture.** Describe what the user experiences, not how to implement it. That's `/spec-interview`'s job.
- **Present before writing.** Never write output files until findings have been presented to the user and validated. The user must see and approve the journeys before anything is written to disk.
- **Do not overwrite existing `research/journey-map.md`** (or `research/{app}/journey-map.md`) without asking the user first.

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
