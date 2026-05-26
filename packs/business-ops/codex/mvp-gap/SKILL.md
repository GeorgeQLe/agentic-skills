---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
type: research
version: v0.1
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# MVP Gap — Startup Readiness Audit

Invoke as `$mvp-gap`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Automated analysis that evaluates the codebase against `research/icp.md`. Identifies what's missing for winning first paying customers.

## Prerequisites

`research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `$icp` first.

## Workflow

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read existing specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context & Evaluate

1. Read `research/icp.md` (or `research/{app}/icp.md`), `research/metrics.md` (or `research/{app}/metrics.md`) (if it exists — check if defined metrics can actually be measured), codebase, README, existing specs (from `specs/` or `specs/{app}/`), and any in-progress or advisory work from `tasks/` (`tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` if they exist).
2. Evaluate the codebase against the ICP across these dimensions:
   - **User Journey Coverage** — Can the product replace each step in the current-state journey? If `research/journey-map.md` exists, map each gap to its journey stage.
   - **Customer Journey Coverage** — Discovery, evaluation, trial, purchase, provisioning, onboarding
   - **Table-Stakes Gaps** — Auth, error handling, data export, accessibility, docs, notifications
   - **Integration Gaps** — Required integrations from the ICP's current workflow
   - **Competitive Differentiation** — Does it deliver the stated value drivers?
   - **Spec Validation** — For each gap, check `specs/` for existing coverage: "Spec exists — ready to build", "Spec exists — needs expansion", or no spec (suggest `$spec-interview`).
   - **Metrics Tie-In** — If `research/metrics.md` exists, identify which metric(s) indicate each gap is closed. Flag gaps with no closure metric as instrumentation gaps.
3. Tag each gap: `blocks-first-sale`, `blocks-retention`, or `nice-to-have`. Estimate effort (S/M/L).
4. If `research/gtm.md` exists, cross-reference build sequence against GTM launch gates. Flag conflicts and gaps deferrable to post-launch.
5. Provide a prioritised build sequence.

## Deliverables

- `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`) — Gap analysis with priority tags, evidence, effort estimates, journey stage, closure metric, and spec status for each gap

Each gap in the output should include:
- _Journey stage:_ [stage from journey-map, or "N/A"]
- _Closure metric:_ [metric from metrics.md, or "⚠ No metric defined"]
- _Spec:_ [link to spec + status, or `$spec-interview [topic]`]

The output file must include a `## Downstream Impact` section (only if conflicts found) and end with a `## Next Steps` section with a **Recommended** item and 2–4 other contextual options. Choose the recommendation by the first matching condition:

1. IF downstream impact is **Major**: `$reconcile-research` — audit and fix affected downstream research documents.
2. IF a `blocks-first-sale` gap lacks a full spec: `$spec-interview [top gap]` — turn the highest-priority gap from `research/mvp-gap.md` into an implementation spec.
3. IF any other gap lacks a full spec: `$spec-interview [top gap]` — turn the highest-priority unspecced gap from `research/mvp-gap.md` into an implementation spec.
4. IF required context is missing: the corresponding research skill (`$journey-map`, `$competitive-analysis`, `$metrics`, or `$brainstorm` when creative alternatives could reduce high-effort gaps).
5. OTHERWISE: `$roadmap` — sequence the existing specs into implementation phases.

Only recommend `$roadmap` as the primary next step when the MVP gap analysis found no unspecced priority gaps.
If downstream impact has not been classified yet, run the downstream impact check before finalizing `## Next Steps`.

### Downstream Impact Check

Before finalizing the output, scan existing downstream docs (`research/journey-map.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `tasks/roadmap.md`) for conflicts with what was just decided. Classify as None/Minor/Major. If Major (3+ conflicts or foundational gap changes build sequence), recommend `$reconcile-research`.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence from the codebase.
- Prioritise by market impact, not technical interest.
- Include `$spec-interview <topic>` prompts only for gaps lacking specs.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other contextual options.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/mvp-gap-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
