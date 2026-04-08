---
name: spec-drift
description: "Audit specs against codebase — find unimplemented features, diverged implementations, and undocumented code"
---

# Spec Drift — Spec-to-Code Conformance Audit

Checks that specs and codebase tell the same story. Extracts verifiable claims from spec documents, checks each against the actual implementation, and flags divergence. Complementary to `$research-reconcile` (doc-to-doc) and `$expert-review` (broad code review).

## Prerequisites

At least one spec file must exist in `specs/` (or `specs/{app}/`, `docs/specifications/`). If no specs exist, tell the user to run `$plan-interview` first.

## Workflow

### 0. App Scope Resolution (Monorepo Support)

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `specs/`, use it.
2. If `specs/` contains subdirectories, list them and ask the user which app to target. If only one, use it automatically.
3. If no subdirectories exist, check `docs/specifications/` as alternative. Otherwise proceed with flat structure.

### 1. Determine Mode & Inventory Specs

Parse `$ARGUMENTS` for mode (`audit` default, or `fix`) and scope (specific file or `all`). Scan spec directories for `.md` files, skipping non-spec files (README, index, changelog, mvp-gap, scale-audit, `*-interview.md`).

### 2. Pre-Scan & Extract Claims

1. Build a codebase summary: tech stack, key directories, routes, data models.
2. For each spec, extract verifiable claims across: routes/endpoints, data models, feature behaviors, config/env vars, UI flows, commands, pricing/limits, integration points.
3. Each claim records: source spec, section heading, direct quote, claim type.

### 3. Verify Claims & Detect Undocumented Code

For each claim, search the codebase and classify:
- **Verified** — code matches spec (cite file:line)
- **Diverged** — code exists but differs (spec quote + code quote)
- **Unimplemented** — spec describes it, code doesn't have it
- **Removed** — evidence of intentional removal

Then scan for significant undocumented code: routes, models, feature flags, and public APIs with no spec coverage. Only flag user-facing or public items.

### 4. Report Findings

Group by severity:
- **Error** — Diverged claims (spec contradicts code)
- **Warning** — Unimplemented or removed claims
- **Info** — Undocumented code that should have spec coverage

### 5. Fix Mode (if specified)

1. Present Errors with side-by-side spec vs code quotes. Ask: code right or spec right?
   - Code right → update spec. Spec right → add to `tasks/todo.md`.
2. Present Warnings — update spec or add to todo.
3. Write `specs/drift-report.md` (or `specs/{app}/drift-report.md`) as audit trail.
4. Check downstream impact on `research/journey-map.md`, `research/metrics.md`, `tasks/roadmap.md`. If major, recommend `$research-reconcile`.

## Deliverables

- **Audit mode**: Summary displayed directly — errors, warnings, info, verified count, and totals
- **Fix mode**: Same report plus `specs/drift-report.md` with resolved/deferred/remaining sections

## Constraints

- Read-only by default. Only modify files in `fix` mode.
- Never auto-resolve Errors — always require user input.
- Every finding must cite spec quote + code reference.
- If uncertain, classify as Info, not Error.
- Respect monorepo structure with app-scoped paths.
- Do not make code changes — only update specs and `tasks/todo.md`.
