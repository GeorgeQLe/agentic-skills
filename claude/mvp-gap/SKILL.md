---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
version: 1.0.0
argument-hint: [optional: path-to-icp-spec]
---

# MVP Gap — Startup Readiness Audit

Automated analysis that evaluates the current codebase against the customer discovery in `specs/icp.md`. Identifies what's missing, incomplete, or misaligned for winning the first paying customers. No interview — this is the agent doing the work.

## Prerequisites

`specs/icp.md` must exist. If it doesn't, tell the user to run `/icp` first and stop.

## Process

### 1. Load Context

- Read `specs/icp.md` — customer profile, user profile(s), current-state journey, pain map, market landscape, value prop
- Read `specs/enterprise-icp.md` if it exists (for awareness, not primary evaluation)
- Read CLAUDE.md, README, package config for project conventions
- Read existing specs from `specs/` for planned but unbuilt features
- Read `tasks/roadmap.md` and `tasks/todo.md` if they exist for work in progress

### 2. Analyse the Codebase

Read source files, routes, components, data models, auth setup, config, dependencies, and infrastructure files. Build a picture of what the product actually does today.

### 3. Evaluate Against ICP

#### User Journey Coverage
For each step in the current-state journey from `specs/icp.md`:
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
- Does the product deliver the value prop from `specs/icp.md`?
- Where does it fall short of the claimed wedge?
- Would the ICP actually switch from their current alternative to this?

### 4. Prioritise

Tag each gap with one of:
- **`blocks-first-sale`** — Without this, no rational customer would pay. Deal-killer.
- **`blocks-retention`** — Customer might try it, but won't stay without this.
- **`nice-to-have`** — Adds value but not a deciding factor for early customers.

Order gaps within each priority tier by estimated effort (S/M/L).

## Output

### `specs/mvp-gap.md`

```markdown
# MVP Gap Analysis

> Evaluated against: specs/icp.md
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
```

## Constraints

- **Do not make code changes.** Analysis only.
- **Every gap must cite evidence** — a missing route, missing component, absent dependency, no billing integration, etc. No vague claims.
- **Prioritise by market impact**, not technical interest. Things that block the first sale come before things that block the 10th.
- **If no code exists yet**, report that clearly and suggest running `/plan-interview` to design the solution first. Do not fabricate gaps for a nonexistent codebase.
- **Include `/plan-interview` prompts** for each gap so the user can immediately start speccing a fix.
- **Do not duplicate work already tracked** in `tasks/roadmap.md` or `tasks/todo.md` — note it as "in progress" instead.
