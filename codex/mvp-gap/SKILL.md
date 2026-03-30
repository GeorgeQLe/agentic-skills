---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
version: 1.1.0
---

# MVP Gap — Startup Readiness Audit

Automated analysis that evaluates the codebase against `research/icp.md`. Identifies what's missing for winning first paying customers.

## Prerequisites

`research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `/icp` first.

## Workflow

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context & Evaluate

1. Read `research/icp.md` (or `research/{app}/icp.md`), `research/metrics.md` (or `research/{app}/metrics.md`) (if it exists — check if defined metrics can actually be measured), codebase, README, existing specs (from `specs/` or `specs/{app}/`), and any in-progress work from `tasks/`.
2. Evaluate the codebase against the ICP across these dimensions:
   - **User Journey Coverage** — Can the product replace each step in the current-state journey?
   - **Customer Journey Coverage** — Discovery, evaluation, trial, purchase, provisioning, onboarding
   - **Table-Stakes Gaps** — Auth, error handling, data export, accessibility, docs, notifications
   - **Integration Gaps** — Required integrations from the ICP's current workflow
   - **Competitive Differentiation** — Does it deliver the claimed value prop?
3. Tag each gap: `blocks-first-sale`, `blocks-retention`, or `nice-to-have`. Estimate effort (S/M/L).
4. Provide a prioritised build sequence.

## Deliverables

- `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`) — Gap analysis with priority tags, evidence, effort estimates, and `/plan-interview` prompts for each gap

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `/roadmap`; conditionally suggest `/plan-interview [top gap]`, `/journey-map`, `/competitive-analysis`, `/brainstorm` based on first-sale blockers needing specs, `research/journey-map.md`, `research/competitive-analysis.md`, and high-effort gaps.

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence from the codebase.
- Prioritise by market impact, not technical interest.
- Include `/plan-interview <topic>` prompts for each gap.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
