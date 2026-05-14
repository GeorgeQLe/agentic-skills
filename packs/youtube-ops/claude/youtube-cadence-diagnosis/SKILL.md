---
name: youtube-cadence-diagnosis
description: Diagnose YouTube publishing cadence, gaps, streaks, and post-gap performance effects against channel and peer evidence
type: research
version: 1.0.0
argument-hint: "<channel slug or handle> [--peer <channel>...] [--count N]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Cadence Diagnosis

Invoke as `/youtube-cadence-diagnosis`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Quantify publishing consistency, gap costs, and realistic cadence choices before turning strategy into a programming plan.

## Inputs

- `research/youtube/channel-audit-<slug>.md`
- `research/youtube/data/<slug>/videos-*.jsonl`
- Optional `research/youtube/peer-benchmark-<slug>.md`
- Optional peer raw metadata under `research/youtube/data/<peer-slug>/`

## Workflow

1. Require a channel slug, handle, or channel audit path.
2. Ensure raw upload metadata exists. If not, run `/youtube-channel-audit <channel> [--count N]`.
3. Parse publish dates, views, views/day, content roles, and video archetypes from raw metadata.
4. Compute upload intervals, streaks, longest gaps, rolling 30/60/90-day publish counts, and current streak status.
5. Compare pre-gap and post-gap performance while controlling for topic, video age, and outlier videos where the evidence allows it.
6. Compare cadence against stage-matched peers when peer metadata exists.
7. Decide whether the data points to frequency, topic selection, packaging, or production quality as the more likely bottleneck.
8. Write `research/youtube/cadence-diagnosis-<slug>.md`.

## Report Sections

- Evidence coverage: videos analyzed, date range, peer coverage, and missing fields.
- Upload timeline: chronological table with intervals, gaps, topics, roles, and views/day.
- Cadence metrics: median interval, longest gaps, streaks, rolling publish counts, and current streak.
- Gap analysis: pre-gap baseline, post-gap performance, outlier handling, and confidence level.
- Peer cadence benchmark: publish frequency and consistency compared with comparable channels.
- Bottleneck diagnosis: cadence vs topic vs packaging vs production constraints.
- Practical cadence recommendation: minimum viable cadence, stretch cadence, batching options, and warning signs.
- Strategic programming implication.

## Constraints

- Do not claim causation when the evidence only supports correlation.
- Always name confounders such as topic mix, video age, search seasonality, and packaging changes.
- Use exact dates and intervals.
- Keep recommendations realistic for solo or small-team production unless evidence shows otherwise.
- Route the resulting rhythm into `/content-programming`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/creator-positioning`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
