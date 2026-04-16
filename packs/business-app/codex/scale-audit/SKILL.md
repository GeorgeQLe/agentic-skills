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

1. Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`), `research/icp.md` (or `research/{app}/icp.md`), `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`) (if they exist), codebase, and in-progress work from `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/manual-todo.md` (if it exists).
2. Evaluate the codebase across:
   - **Per-Persona Journey Coverage** — Can each stakeholder complete their workflow?
   - **Onboarding Gaps** — Self-serve, team, SSO-provisioned, migration, training
   - **Compliance Readiness** — SOC 2, GDPR, HIPAA, encryption, secrets management
   - **Infrastructure Readiness** — Multi-tenancy, scaling, DR, observability, CI/CD
   - **Operational Readiness** — Incident response, SLA monitoring, support, customer success
   - **Escalated Startup Gaps** — Unresolved MVP gaps now critical at enterprise scale
3. Tag gaps: `hard-blocker`, `soft-blocker`, or `differentiator`. Estimate effort (S/M/L/XL).

## Deliverables

- `specs/scale-audit.md` (or `specs/{app}/scale-audit.md`) — Gap analysis with stakeholder coverage matrix, compliance matrix, priority tags, and `$plan-interview` prompts for each gap

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `$roadmap`; conditionally suggest `$plan-interview [top blocker]`, `$journey-map enterprise`, `$mvp-gap`, `$metrics` based on hard-blockers needing specs, `research/journey-map.md`, `specs/mvp-gap.md` staleness, and `research/metrics.md`.

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence.
- Distinguish "first enterprise deal" from "100th enterprise deal."
- Include `$plan-interview <topic>` prompts for each gap.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.

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
