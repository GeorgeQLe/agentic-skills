---
name: creator-metrics-review
description: Review creator-media performance over time using raw YouTube evidence, portfolio metrics, programming goals, and explicit follow-up decisions
type: research
version: v0.1
argument-hint: "[channel slug] [--period monthly|quarterly]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Creator Metrics Review

Invoke as `$creator-metrics-review`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Review channel performance against the strategy and decide what to continue, change, or investigate next.

## Inputs

- Preferred creator context when present: `research/creator-presence/<slug>.md`, especially for cross-platform performance, audience/community signals, and stale-positioning checks.
- Raw metadata under `research/youtube/data/<slug>/`.
- Channel audit, portfolio, positioning, programming, series specs, and product-led media map when present.
- Optional prior metrics reviews.

## Output

Create the `research/youtube/` directory if it does not exist.

Write `research/youtube/metrics-review-<slug>-YYYY-MM-DD.md` with:

- Period covered and evidence paths.
- KPI table: videos published, views, median views, views/day, views/minute, likes, comments, top-video concentration, transcript coverage.
- Series and pillar performance.
- Portfolio drift: whether videos still match the intended roles.
- Wins, misses, and ambiguous signals.
- Decisions: keep, stop, refresh, investigate, or specify.
- Follow-up tasks routed by execution semantics:
  - Strategy/research -> creator-media skills.
  - Implementation or repo docs -> `tasks/todo.md`.
  - Human-only platform actions -> `tasks/manual-todo.md`.
  - Recurring review cadence -> `tasks/recurring-todo.md`.

## Approved Artifact Handoff

After an approved synthesized write, explicit write/update mode, or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while approved artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.
- If stopping for approval before writing, the approval request remains the next action; do not include downstream routing.

## Intent-Aware Routing

Before applying the default `## Next-Skill Routing` sequence, classify the user's immediate intent and route to the missing action that best serves that intent:

- Strategy refresh: recommend the missing or stale positioning, programming, portfolio, metrics, or product-media artifact.
- Recording prep: recommend the missing series spec, script, build proof, walkthrough guide, or validation artifact needed before recording.
- Upload prep: recommend packaging, title/thumbnail, description, chapters, or final metadata work before broader strategy work.
- Performance review: recommend metrics, cadence, portfolio, peer benchmark, or owner-analytics export work before new content planning.
- Owner analytics or private/manual platform evidence: route to an explicit manual/guide handoff instead of inventing unavailable metrics.
- Dirty intended artifacts: route to shipping/commit/handoff first, not another creator strategy skill.

Use the default next-skill sequence only when no stronger user intent, missing artifact, manual blocker, or dirty-artifact handoff applies.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/creator-metrics-review-{topic}.html`.

## Constraints

- Do not treat one video as a trend.
- State metric gaps explicitly.
- Use the dossier when present as preferred creator context for cross-platform signals; preserve raw YouTube evidence as the source of YouTube performance claims.
- Do not perform external account actions or channel changes.
