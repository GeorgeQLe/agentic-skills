---
name: mvp-gap
description: Evaluate codebase against ICP to identify gaps blocking first sales and retention
type: research
version: v0.0
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
   - **Competitive Differentiation** — Does it deliver the claimed value prop?
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/mvp-gap-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/mvp-gap-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
