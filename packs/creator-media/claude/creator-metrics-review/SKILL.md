---
name: creator-metrics-review
description: Review creator-media performance over time using raw YouTube evidence, portfolio metrics, programming goals, and explicit follow-up decisions
type: research
version: 1.0.0
argument-hint: "[channel slug] [--period monthly|quarterly]"
---

# Creator Metrics Review

Invoke as `/creator-metrics-review`.

Review channel performance against the strategy and decide what to continue, change, or investigate next.

## Inputs

- Raw metadata under `research/youtube/data/<slug>/`.
- Channel audit, portfolio, positioning, programming, series specs, and product-led media map when present.
- Optional prior metrics reviews.

## Output

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

## Constraints

- Do not treat one video as a trend.
- State metric gaps explicitly.
- Do not perform external account actions or channel changes.
