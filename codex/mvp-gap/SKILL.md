---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
---

# MVP Gap — Startup Readiness Audit

Automated analysis that evaluates the codebase against `specs/icp.md`. Identifies what's missing for winning first paying customers.

## Prerequisites

`specs/icp.md` must exist. If not, tell the user to run `/icp` first.

## Workflow

1. Read `specs/icp.md`, codebase, README, existing specs, and any in-progress work from `tasks/`.
2. Evaluate the codebase against the ICP across these dimensions:
   - **User Journey Coverage** — Can the product replace each step in the current-state journey?
   - **Customer Journey Coverage** — Discovery, evaluation, trial, purchase, provisioning, onboarding
   - **Table-Stakes Gaps** — Auth, error handling, data export, accessibility, docs, notifications
   - **Integration Gaps** — Required integrations from the ICP's current workflow
   - **Competitive Differentiation** — Does it deliver the claimed value prop?
3. Tag each gap: `blocks-first-sale`, `blocks-retention`, or `nice-to-have`. Estimate effort (S/M/L).
4. Provide a prioritised build sequence.

## Deliverables

- `specs/mvp-gap.md` — Gap analysis with priority tags, evidence, effort estimates, and `/plan-interview` prompts for each gap

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence from the codebase.
- Prioritise by market impact, not technical interest.
- Include `/plan-interview <topic>` prompts for each gap.
