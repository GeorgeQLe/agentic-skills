---
name: youtube-cadence-diagnosis
description: Diagnose YouTube publishing cadence, gaps, streaks, and post-gap performance effects against channel and peer evidence
type: research
version: 1.0.0
argument-hint: "<channel slug or handle> [--peer <channel>...] [--count N]"
---

# YouTube Cadence Diagnosis

Invoke as `/youtube-cadence-diagnosis`.

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

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
