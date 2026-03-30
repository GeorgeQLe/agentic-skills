---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
version: 1.1.0
argument-hint: [optional: path-to-icp-spec]
---

# MVP Gap — Startup Readiness Audit

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
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

- Read `research/icp.md` (or `research/{app}/icp.md`) — customer profile, user profile(s), current-state journey, pain map, market landscape, value prop
- Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) if it exists (for awareness, not primary evaluation)
- Read `research/metrics.md` (or `research/{app}/metrics.md`) if it exists — check if defined metrics can actually be measured (instrumentation gaps are MVP gaps)
- Read CLAUDE.md, README, package config for project conventions
- Read existing specs from `specs/` (or `specs/{app}/`) for planned but unbuilt features
- Read `tasks/roadmap.md` and `tasks/todo.md` if they exist for work in progress

### 2. Analyse the Codebase

Read source files, routes, components, data models, auth setup, config, dependencies, and infrastructure files. Build a picture of what the product actually does today.

### 3. Evaluate Against ICP

#### User Journey Coverage
For each step in the current-state journey from `research/icp.md`:
- Can the product replace or improve this step?
- Where does the UX break down, require workarounds, or not exist?
- Does the interaction model match the user's technical sophistication?

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
- Does the product deliver the value prop from `research/icp.md`?
- Where does it fall short of the claimed wedge?
- Would the ICP actually switch from their current alternative to this?

### 4. Prioritise

Tag each gap with one of:
- **`blocks-first-sale`** — Without this, no rational customer would pay. Deal-killer.
- **`blocks-retention`** — Customer might try it, but won't stay without this.
- **`nice-to-have`** — Adds value but not a deciding factor for early customers.

Order gaps within each priority tier by estimated effort (S/M/L).

### 5. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- ALWAYS: `/roadmap` — Turn the build sequence above into a phased roadmap
- IF first-sale blockers need specs: `/plan-interview [top gap]` — Spec the most critical first-sale blocker
- IF no `research/journey-map.md` and `specs/` exist: `/journey-map` — Map how the ICP experiences the product
- IF no `research/competitive-analysis.md`: `/competitive-analysis` — Validate gap priorities against competitors
- IF creative solutions could reduce effort for high-effort gaps: `/brainstorm` — Generate alternatives for high-effort gaps

## Output

### `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`)

```markdown
# MVP Gap Analysis

> Evaluated against: research/icp.md (or research/{app}/icp.md)
> Date: [current date]
> Codebase state: [brief summary of what exists]

## Summary
[2-3 sentences: overall readiness assessment and the most critical gaps]

## Blocks First Sale
- **[Gap title]** — [What's missing and why it matters to the ICP]. Effort: S/M/L
  _Start with:_ `/plan-interview [topic]`
- ...

## Blocks Retention
- **[Gap title]** — [What's missing and why it matters]. Effort: S/M/L
  _Start with:_ `/plan-interview [topic]`
- ...

## Nice to Have
- **[Gap title]** — [What's missing and why it matters]. Effort: S/M/L
  _Start with:_ `/plan-interview [topic]`
- ...

## Recommended Build Sequence
[Ordered list of gaps to address, combining priority and dependency logic.
 First sale blockers first, then retention blockers, then nice-to-haves.
 Within each tier, order by dependency — what must exist before other things can be built.]

## Next Steps

Pick one:
- [conditional items from step 5 — only include items whose conditions are met]
```

## Constraints

- **Do not make code changes.** Analysis only.
- **Every gap must cite evidence** — a missing route, missing component, absent dependency, no billing integration, etc. No vague claims.
- **Prioritise by market impact**, not technical interest. Things that block the first sale come before things that block the 10th.
- **If no code exists yet**, report that clearly and suggest running `/plan-interview` to design the solution first. Do not fabricate gaps for a nonexistent codebase.
- **Include `/plan-interview` prompts** for each gap so the user can immediately start speccing a fix.
- **Do not duplicate work already tracked** in `tasks/roadmap.md` or `tasks/todo.md` — note it as "in progress" instead.
