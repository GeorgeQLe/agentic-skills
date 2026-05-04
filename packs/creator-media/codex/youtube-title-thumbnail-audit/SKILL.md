---
name: youtube-title-thumbnail-audit
description: Audit YouTube titles and thumbnails against channel performance and peer packaging patterns
type: research
version: 1.0.0
argument-hint: "<channel slug or handle> [--peer <channel>...] [--count N]"
---

# YouTube Title Thumbnail Audit

Invoke as `$youtube-title-thumbnail-audit`.

Turn channel and peer evidence into a packaging diagnosis for existing videos and reusable title/thumbnail templates.

## Inputs

- `research/youtube/channel-audit-<slug>.md`
- `research/youtube/data/<slug>/videos-*.jsonl`
- Optional `research/youtube/peer-benchmark-<slug>.md`
- Optional peer raw metadata under `research/youtube/data/<peer-slug>/`

## Workflow

1. Require a channel slug, handle, or channel audit path.
2. Ensure current channel evidence exists. If not, run `$youtube-channel-audit <channel> [--count N]`.
3. When peers are provided, ensure comparable peer benchmark or raw peer metadata exists.
4. Pull thumbnail URLs or local thumbnail files from raw `yt-dlp` metadata when available. If thumbnails are missing, fetch them through the existing `$youtube-audit` evidence path rather than inventing visual details.
5. Score each title for length, keyword clarity, specificity, curiosity pattern, series fit, and avoidable redundancy.
6. Classify thumbnail patterns: text density, face presence, product screenshot presence, logo count, background style, contrast, focal clarity, and channel-template consistency.
7. Correlate packaging features with views, views/day, upload age, and content role.
8. Write `research/youtube/title-thumbnail-audit-<slug>.md`.

## Report Sections

- Evidence coverage: videos scored, thumbnail availability, peer coverage, and missing fields.
- Packaging performance table: title, views, views/day, title pattern, thumbnail pattern, and recommendation.
- Title diagnosis: recurring strengths, overlong patterns, keyword loading, unclear promises, and examples to keep.
- Thumbnail diagnosis: visual templates, consistency gaps, high-performing motifs, low-performing motifs, and peer contrasts.
- Channel identity impact: whether packaging creates a coherent channel signal.
- Existing-video fixes: prioritized title and thumbnail refresh candidates with expected rationale.
- Future templates: 3-5 repeatable title/thumbnail patterns mapped to content roles.
- Strategic packaging recommendation.

## Constraints

- Cite source metadata paths and video IDs.
- Do not claim visual features unless thumbnail evidence was inspected or unavailable status is explicit.
- Do not recommend copying peer faces, branding, or trade dress; translate peer evidence into differentiated templates.
- Keep recommendations practical for the creator's apparent production capacity.
- Route follow-up cleanup decisions to `$youtube-portfolio` and future-topic decisions to `$youtube-search-positioning` or `$content-programming`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-description-optimizer`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-format-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$video-script` -> `$video-build` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
