---
name: creator-metrics-review
description: Review creator-media performance over time using raw YouTube evidence, portfolio metrics, programming goals, and explicit follow-up decisions
type: research
version: 1.0.0
argument-hint: "[channel slug] [--period monthly|quarterly]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Creator Metrics Review

Invoke as `$creator-metrics-review`.

Review channel performance against the strategy and decide what to continue, change, or investigate next.

## Inputs

- Preferred creator context when present: `research/creator-presence/<slug>.md`, especially for cross-platform performance, audience/community signals, and stale-positioning checks.
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

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-channel-audit or $content-programming`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$creator-presence-dossier` -> `$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Do not treat one video as a trend.
- State metric gaps explicitly.
- Use the dossier when present as preferred creator context for cross-platform signals; preserve raw YouTube evidence as the source of YouTube performance claims.
- Do not perform external account actions or channel changes.
