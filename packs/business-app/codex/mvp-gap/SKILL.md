---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
type: analysis
version: 1.2.0
---

# MVP Gap — Startup Readiness Audit

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
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context & Evaluate

1. Read `research/icp.md` (or `research/{app}/icp.md`), `research/metrics.md` (or `research/{app}/metrics.md`) (if it exists — check if defined metrics can actually be measured), codebase, README, existing specs (from `specs/` or `specs/{app}/`), and any in-progress work from `tasks/` (`tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md` if they exist).
2. Evaluate the codebase against the ICP across these dimensions:
   - **User Journey Coverage** — Can the product replace each step in the current-state journey? If `research/journey-map.md` exists, map each gap to its journey stage.
   - **Customer Journey Coverage** — Discovery, evaluation, trial, purchase, provisioning, onboarding
   - **Table-Stakes Gaps** — Auth, error handling, data export, accessibility, docs, notifications
   - **Integration Gaps** — Required integrations from the ICP's current workflow
   - **Competitive Differentiation** — Does it deliver the claimed value prop?
   - **Spec Validation** — For each gap, check `specs/` for existing coverage: "Spec exists — ready to build", "Spec exists — needs expansion", or no spec (suggest `$plan-interview`).
   - **Metrics Tie-In** — If `research/metrics.md` exists, identify which metric(s) indicate each gap is closed. Flag gaps with no closure metric as instrumentation gaps.
3. Tag each gap: `blocks-first-sale`, `blocks-retention`, or `nice-to-have`. Estimate effort (S/M/L).
4. If `research/gtm.md` exists, cross-reference build sequence against GTM launch gates. Flag conflicts and gaps deferrable to post-launch.
5. Provide a prioritised build sequence.

## Deliverables

- `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`) — Gap analysis with priority tags, evidence, effort estimates, journey stage, closure metric, and spec status for each gap

Each gap in the output should include:
- _Journey stage:_ [stage from journey-map, or "N/A"]
- _Closure metric:_ [metric from metrics.md, or "⚠ No metric defined"]
- _Spec:_ [link to spec + status, or `$plan-interview [topic]`]

The output file must include a `## Downstream Impact` section (only if conflicts found) and end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `$roadmap`; conditionally suggest `$plan-interview [top gap]` (only if no spec exists), `$journey-map`, `$competitive-analysis`, `$brainstorm`, `$metrics` (if gaps lack closure metrics).

### Downstream Impact Check

After writing, scan existing downstream docs (`research/journey-map.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `tasks/roadmap.md`) for conflicts with what was just decided. Classify as None/Minor/Major. If Major (3+ conflicts or foundational gap changes build sequence), recommend `$reconcile-research`.

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence from the codebase.
- Prioritise by market impact, not technical interest.
- Include `$plan-interview <topic>` prompts only for gaps lacking specs.
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
