---
name: scale-audit
description: Evaluate codebase against enterprise ICP for production readiness, compliance, and multi-stakeholder journey coverage
type: analysis
version: 1.1.0
---

# Scale Audit — Enterprise Production Readiness

Invoke as `$scale-audit`.

Automated analysis that evaluates the codebase against `research/enterprise-icp.md`. Identifies gaps for enterprise deals — stakeholder journey coverage, compliance, infrastructure, and operations.

## Prerequisites

`research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) must exist. If not, tell the user to run `$enterprise-icp` first.

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

1. Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`), `research/icp.md` (or `research/{app}/icp.md`), `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`) (if they exist), codebase, and in-progress/advisory work from `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md` (if they exist).
2. Evaluate the codebase across:
   - **Per-Persona Journey Coverage** — Can each stakeholder complete their workflow?
   - **Onboarding Gaps** — Self-serve, team, SSO-provisioned, migration, training
   - **Compliance Readiness** — SOC 2, GDPR, HIPAA, encryption, secrets management
   - **Infrastructure Readiness** — Multi-tenancy, scaling, DR, observability, CI/CD
   - **Operational Readiness** — Incident response, SLA monitoring, support, customer success
   - **Escalated Startup Gaps** — Unresolved MVP gaps now critical at enterprise scale
3. Tag gaps: `hard-blocker`, `soft-blocker`, or `differentiator`. Estimate effort (S/M/L/XL).

## Deliverables

- `specs/scale-audit.md` (or `specs/{app}/scale-audit.md`) — Gap analysis with stakeholder coverage matrix, compliance matrix, priority tags, and `$spec-interview` prompts for each unspecced gap

The output file must end with a `## Next Steps` section containing a **Recommended** item and 2–4 other contextual options. Choose the recommendation by the first matching condition:

1. IF any `hard-blocker` lacks a full implementation spec: `$spec-interview [top blocker]` — spec the highest-priority enterprise hard-blocker from `specs/scale-audit.md`.
2. IF enterprise stakeholder journey context is missing: `$journey-map enterprise` — map enterprise stakeholder journeys before sequencing build work.
3. IF startup gaps escalated and `research/mvp-gap.md` is missing or stale: `$mvp-gap` — re-evaluate startup readiness first.
4. IF enterprise SLA or compliance gaps lack closure metrics: `$metrics` — define metrics covering enterprise SLAs.
5. OTHERWISE: `$roadmap` — sequence the already-specced enterprise work into implementation phases.

Only recommend `$roadmap` as the primary next step when every hard-blocker already has a full spec or is already tracked in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md`.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence.
- Distinguish "first enterprise deal" from "100th enterprise deal."
- Include `$spec-interview <topic>` prompts only for gaps lacking full specs.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other contextual options.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
