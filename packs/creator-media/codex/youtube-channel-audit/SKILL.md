---
name: youtube-channel-audit
description: Run an evidence-first YouTube channel audit that captures raw metadata/transcripts, performance fields, portfolio roles, and repeated content patterns
type: research
version: 1.0.0
argument-hint: "<channel URL or handle> [--count N]"
---

# YouTube Channel Audit

Invoke as `$youtube-channel-audit`.

Use the global `$youtube-audit` workflow as the evidence-capture engine, then synthesize a creator-media channel audit.

## Workflow

1. Require a channel URL or handle. Good target shapes include `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.
2. Run `$youtube-audit <channel> [--count N]` or follow its contract directly when the global skill is unavailable.
3. Confirm raw evidence exists under `research/youtube/data/<slug>/`:
   - `videos-YYYY-MM-DD.jsonl`
   - `transcripts/*.json`
   - `transcripts/transcripts-summary.json`
4. Write `research/youtube/channel-audit-<slug>.md`.

## Report Sections

- Channel identity and audience promise.
- Evidence coverage: videos analyzed, transcript coverage, metadata completeness.
- Performance snapshot: total views, median views, views/day leaders, views/minute leaders, top-video concentration.
- Portfolio map: archetypes, content roles, view share, channel balance.
- Repeated strengths and weaknesses, each backed by 2+ videos.
- Packaging review: titles, thumbnails, descriptions, chapters, and expectation match.
- Cleanup candidates with `keep`, `refresh`, `unlist/private candidate`, or `needs human review`.
- Strategic recommendation: the single most important channel-level change.

## Constraints

- Cite raw evidence paths and specific videos.
- Do not invent transcript quotes.
- Do not recommend deleting videos automatically.
- Route follow-up strategy to `$youtube-portfolio`, `$creator-positioning`, or `$content-programming`.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
