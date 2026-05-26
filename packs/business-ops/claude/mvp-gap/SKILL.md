---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
type: research
version: v0.1
argument-hint: "[optional: path-to-icp-spec]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# MVP Gap — Startup Readiness Audit

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Automated analysis that evaluates the current codebase against the customer discovery in `research/icp.md`. Identifies what's missing, incomplete, or misaligned for winning the first paying customers. No interview — this is the agent doing the work.

## Prerequisites

`research/icp.md` (or `research/{app}/icp.md`) must exist. If it doesn't, tell the user to run `/icp` first and stop.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read existing specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

- Read `research/icp.md` (or `research/{app}/icp.md`) — customer profile, user profile(s), current-state journey, pain map, current alternatives, stated value drivers
- Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) if it exists (for awareness, not primary evaluation)
- Read `research/metrics.md` (or `research/{app}/metrics.md`) if it exists — check if defined metrics can actually be measured (instrumentation gaps are MVP gaps)
- Read CLAUDE.md, README, package config for project conventions
- Read existing specs from `specs/` (or `specs/{app}/`) for planned but unbuilt features
- Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md` if they exist for work in progress or advisory records

### 2. Analyse the Codebase

Read source files, routes, components, data models, auth setup, config, dependencies, and infrastructure files. Build a picture of what the product actually does today.

### 3. Evaluate Against ICP

#### User Journey Coverage
For each step in the current-state journey from `research/icp.md`:
- Can the product replace or improve this step?
- Where does the UX break down, require workarounds, or not exist?
- Does the interaction model match the user's technical sophistication?

If `research/journey-map.md` (or `research/{app}/journey-map.md`) exists, map each gap to its **journey stage** (e.g., Discovery, Onboarding, Aha Moment, Habit Loop, Expansion). This enables downstream skills to understand *where* in the experience each gap bites.

#### Customer Journey Coverage
- **Discovery**: Is there a landing page, marketing site, or clear product description?
- **Evaluation**: Can someone try the product? Free tier, trial, demo?
- **Purchase**: Is there billing, pricing, a checkout flow?
- **Provisioning**: Can the customer set up the product for their users? Invite flow, admin panel?
- **Onboarding**: Does a new user have a clear path to the "aha moment" from the ICP?

#### Table-Stakes Gaps
- Authentication and authorization
- Error handling and user-facing error messages
- Data export and portability
- Responsive design and accessibility basics
- Help, documentation, or in-app guidance
- Email notifications or transactional messaging
- Settings and user preferences

#### Integration Gaps
- Does the ICP's current-state journey reveal tools they already use?
- Which integrations are required vs. nice-to-have for replacing the current workflow?

#### Competitive Differentiation
- Does the product deliver the stated value drivers from `research/icp.md`?
- Where does it fall short of the claimed wedge?
- Would the ICP actually switch from their current alternative to this?

#### Spec Validation
For each gap identified above, check if a spec already exists in `specs/` (or `specs/{app}/`):
- If a spec covers the gap **fully**, mark the gap as "Spec exists — ready to build" and link the spec file instead of suggesting `/spec-interview`.
- If a spec covers the gap **partially**, mark it as "Spec exists — needs expansion" and suggest `/spec-interview [topic]` to fill the remaining holes.
- If no spec exists, suggest `/spec-interview [topic]` as before.

#### Metrics Tie-In
If `research/metrics.md` (or `research/{app}/metrics.md`) exists, identify for each gap:
- Which metric(s) will indicate this gap is closed (e.g., activation rate, retention at day-7)
- If no metric exists to measure gap closure, flag it as an **instrumentation gap** — this becomes an additional item under the gap.

### 4. Prioritise

Tag each gap with one of:
- **`blocks-first-sale`** — Without this, no rational customer would pay. Deal-killer.
- **`blocks-retention`** — Customer might try it, but won't stay without this.
- **`nice-to-have`** — Adds value but not a deciding factor for early customers.

Order gaps within each priority tier by estimated effort (S/M/L).

#### GTM Alignment
If `research/gtm.md` (or `research/{app}/gtm.md`) exists:
- Cross-reference the build sequence against GTM launch gates and timeline
- Flag conflicts where a high-effort gap blocks a near-term GTM milestone
- Surface gaps that can be deferred to post-launch without losing the GTM window

### 5. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include a **Recommended** item and 2–4 other applicable options. Choose the recommendation by the first matching condition:

- IF downstream impact is **Major**: `/reconcile-research` — audit and fix affected downstream research documents.
- IF a `blocks-first-sale` gap lacks a full spec: `/spec-interview [top gap]` — turn the highest-priority gap from `research/mvp-gap.md` into an implementation spec.
- IF any other gap lacks a full spec: `/spec-interview [top gap]` — turn the highest-priority unspecced gap from `research/mvp-gap.md` into an implementation spec.
- IF required context is missing: the corresponding research skill (`/journey-map`, `/competitive-analysis`, `/metrics`, or `/brainstorm` when creative alternatives could reduce high-effort gaps).
- OTHERWISE: `/roadmap` — sequence the existing specs into implementation phases.

Only recommend `/roadmap` as the primary next step when the MVP gap analysis found no unspecced priority gaps.
If downstream impact has not been classified yet, run the downstream impact check before finalizing `## Next Steps`.

### 6. Downstream Impact Check

Before finalizing the output, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/journey-map.md`
- `research/metrics.md`
- `research/gtm.md`
- `research/monetization.md`
- `tasks/roadmap.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Journey stages that assume features exist which are now identified as gaps
   - Metric targets anchored to capabilities the product doesn't have yet
   - GTM launch plan that depends on features flagged as missing
   - Monetization pricing tied to features identified as gaps
   - Roadmap phases that don't account for newly identified first-sale blockers
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational gap was identified that changes the build sequence — e.g., a new first-sale blocker, a key assumption invalidated): Display conflicts and strongly recommend `/reconcile-research`.

Display to the user with the written file confirmation.

## Output

### `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`)

```markdown
# MVP Gap Analysis

> Evaluated against: research/icp.md (or research/{app}/icp.md)
> Date: [current date]
> Codebase state: [brief summary of what exists]

## Summary
[2-3 sentences: overall readiness assessment and the most critical gaps]

## Blocks First Sale
- **[Gap title]** — [What's missing and why it matters to the ICP]. Effort: S/M/L
  _Journey stage:_ [stage from journey-map, or "N/A" if no journey-map exists]
  _Closure metric:_ [metric from metrics.md, or "⚠ No metric defined" if none]
  _Spec:_ [link to spec if exists + status, or `/spec-interview [topic]` if no spec]
- ...

## Blocks Retention
- **[Gap title]** — [What's missing and why it matters]. Effort: S/M/L
  _Journey stage:_ [stage]
  _Closure metric:_ [metric or "⚠ No metric defined"]
  _Spec:_ [spec link/status or `/spec-interview [topic]`]
- ...

## Nice to Have
- **[Gap title]** — [What's missing and why it matters]. Effort: S/M/L
  _Journey stage:_ [stage]
  _Closure metric:_ [metric or "⚠ No metric defined"]
  _Spec:_ [spec link/status or `/spec-interview [topic]`]
- ...

## Recommended Build Sequence
[Ordered list of gaps to address, combining priority and dependency logic.
 First sale blockers first, then retention blockers, then nice-to-haves.
 Within each tier, order by dependency — what must exist before other things can be built.
 If GTM exists: note conflicts between build order and GTM launch gates.]

## Downstream Impact
[Only if conflicts found in step 6 — list each conflict with file, section, stale claim, and correction needed. If Major, recommend `/reconcile-research`.]

## Next Steps

**Recommended:** [first matching command from step 5] — [reason grounded in this analysis]

Other options:
- [conditional items from step 5 — only include items whose conditions are met]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Do not make code changes.** Analysis only.
- **Every gap must cite evidence** — a missing route, missing component, absent dependency, no billing integration, etc. No vague claims.
- **Prioritise by market impact**, not technical interest. Things that block the first sale come before things that block the 10th.
- **If no code exists yet**, report that clearly and suggest running `/spec-interview` to design the solution first. Do not fabricate gaps for a nonexistent codebase.
- **Include `/spec-interview` prompts** only for gaps lacking full specs so the user can immediately start speccing a fix.
- **Do not duplicate work already tracked** in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md` — note it as "in progress" or "advisory" instead.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/mvp-gap-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
