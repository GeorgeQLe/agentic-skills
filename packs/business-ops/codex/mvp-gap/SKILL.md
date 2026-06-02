---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
type: research
version: v0.4
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# MVP Gap — Startup Readiness Audit

Invoke as `$mvp-gap`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Research and clarify.** Perform the research, run required source/code checks, and ask any needed clarification questions. Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Do not create or update canonical research, spec, or task files in Stage 1. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

Automated analysis that evaluates the codebase against `research/icp.md`. Identifies what's missing for winning first paying customers.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

`research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first.

## Workflow

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

### 1. Load Context & Evaluate

1. Read `research/icp.md` (or `research/{slug}/icp.md`), `research/metrics.md` (or `research/{slug}/metrics.md`) (if it exists — check if defined metrics can actually be measured), codebase, README, existing specs (from `specs/` or `specs/{slug}/`), and any in-progress or advisory work from `tasks/` (`tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` if they exist).
2. Evaluate the codebase against the ICP across these dimensions:
   - **User Journey Coverage** — Can the product replace each step in the current-state journey? If `research/journey-map.md` exists, map each gap to its journey stage.
   - **Customer Journey Coverage** — Discovery, evaluation, trial, purchase, provisioning, onboarding
   - **Table-Stakes Gaps** — Auth, error handling, data export, accessibility, docs, notifications
   - **Integration Gaps** — Required integrations from the ICP's current workflow
   - **Competitive Differentiation** — Does it deliver the stated value drivers?
   - **Spec Validation** — For each gap, check `specs/` for existing coverage: "Spec exists — ready to build", "Spec exists — needs expansion", or no spec (suggest `$ux-variations`).
   - **Metrics Tie-In** — If `research/metrics.md` exists, identify which metric(s) indicate each gap is closed. Flag gaps with no closure metric as instrumentation gaps.
3. Tag each gap: `blocks-first-sale`, `blocks-retention`, or `nice-to-have`. Estimate effort (S/M/L).
4. If `research/gtm.md` exists, cross-reference build sequence against GTM launch gates. Flag conflicts and gaps deferrable to post-launch.
5. Provide a prioritised build sequence.

## Deliverables

- `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) — Gap analysis with priority tags, evidence, effort estimates, journey stage, closure metric, and spec status for each gap

Each gap in the output should include:
- _Journey stage:_ [stage from journey-map, or "N/A"]
- _Closure metric:_ [metric from metrics.md, or "⚠ No metric defined"]
- _Spec:_ [link to spec + status, or `$ux-variations [topic]`]

The output file must include a `## Downstream Impact` section (only if conflicts found) and end with a `## Next Steps` section with a **Recommended** item and 2–4 other contextual options. Choose the recommendation by the first matching condition:

1. IF downstream impact is **Major**: `$reconcile-research` — audit and fix affected downstream research documents.
2. IF a `blocks-first-sale` gap lacks a full spec: `$ux-variations [top gap]` — explore solution directions for the highest-priority gap from `research/mvp-gap.md`.
3. IF any other gap lacks a full spec: `$ux-variations [top gap]` — explore solution directions for the highest-priority unspecced gap from `research/mvp-gap.md`.
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
- Include `$ux-variations <topic>` prompts only for gaps lacking specs.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other contextual options.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/mvp-gap-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
