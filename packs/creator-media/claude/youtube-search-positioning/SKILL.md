---
name: youtube-search-positioning
description: Find YouTube search opportunities by comparing channel topics against query demand, ranking competition, and underserved results
type: research
version: 1.0.0
argument-hint: "<channel slug or handle> [--keywords <kw1,kw2,...>] [--count N]"
---

# YouTube Search Positioning

Invoke as `/youtube-search-positioning`.

Identify the next search-led topic opportunities by connecting channel evidence, peer coverage, and YouTube query result competition.

## Inputs

- `research/youtube/channel-audit-<slug>.md`
- `research/youtube/peer-benchmark-<slug>.md`
- `research/youtube/data/<slug>/videos-*.jsonl`
- Optional seed keywords from the user, titles, transcripts, descriptions, or peer top videos.

## Workflow

1. Require a channel slug, handle, or channel audit path.
2. Ensure channel audit and peer benchmark evidence exists when peers are part of the strategy question.
3. Build a seed keyword set from top-performing titles, recurring transcript topics, channel positioning, peer breakout videos, and explicit user keywords.
4. For each keyword/query, search YouTube manually or through available local tooling. Record query text, retrieval date, top result titles, channels, upload dates, view counts when visible, and whether the target channel appears.
5. Classify each query by demand signal, competition strength, recency window, creator fit, and production feasibility.
6. Identify underserved queries where demand is visible but top results are stale, shallow, off-position, or weakly packaged.
7. Write `research/youtube/search-positioning-<slug>.md`.

## Report Sections

- Evidence coverage: query count, search date, geography/account caveats, and unavailable metrics.
- Current search footprint: queries the channel already ranks for or plausibly owns.
- Keyword opportunity table: query, demand signal, competition level, top-result quality, fit, and priority.
- Closing windows: topics where larger peers have entered or ranking opportunity is likely declining.
- Underserved opportunities: demand-backed topics with few strong results.
- Topic recommendations: next videos or series candidates, each tied to search evidence and channel fit.
- Risks and caveats: personalization, regional variance, stale result pages, and metric availability.
- Strategic search-positioning recommendation.

## Constraints

- Use exact query strings and cite evidence paths or search notes.
- Do not present YouTube search rank as stable; date every ranking observation.
- Do not infer demand from intuition alone. Mark weak signals as weak.
- Prefer differentiated topic angles over direct imitation of peer winners.
- Route prioritized topics into `/content-programming` or `/series-spec`.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
