---
name: youtube-peer-benchmark
description: Compare a channel against peer channels using evidence-backed portfolio, positioning, packaging, and performance benchmarks
type: research
version: 1.0.0
argument-hint: "<primary channel> <peer channel...> [--count N]"
---

# YouTube Peer Benchmark

Invoke as `$youtube-peer-benchmark`.

Benchmark one primary channel against comparable channels. Use this for creator channels, founder-led shows, and topic publications such as `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.

## Workflow

1. Require one primary channel and at least one peer channel.
2. For each channel, ensure a current `$youtube-channel-audit` exists or run one with the same `--count`.
3. Read raw metadata from `research/youtube/data/<slug>/videos-*.jsonl` when available.
4. Write `research/youtube/peer-benchmark-<primary-slug>.md`.

## Report Sections

- Peer set rationale and caveats.
- Channel comparison table: videos analyzed, median views, views/day median, top-video concentration, transcript coverage.
- Positioning comparison: audience promise, topical wedge, category clarity.
- Portfolio comparison: archetypes, content roles, cadence, series usage.
- Packaging comparison: title patterns, thumbnail clarity, description/chapter quality.
- Opportunity gaps: formats or promises peers prove but the primary channel does not yet own.
- Strategic benchmark recommendation.

## Constraints

- Do not compare channels without comparable evidence windows.
- Mark subscriber counts or external metrics as unavailable unless present in fetched metadata.
- Do not recommend copying peers; translate benchmark evidence into differentiated positioning.
