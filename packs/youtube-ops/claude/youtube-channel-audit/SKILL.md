---
name: youtube-channel-audit
description: Run an evidence-first YouTube channel audit that captures raw metadata/transcripts, performance fields, portfolio roles, and repeated content patterns
type: research
version: 1.0.0
argument-hint: "<channel URL or handle> [--count N]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Channel Audit

Invoke as `/youtube-channel-audit`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

Use the local `/youtube-audit` workflow as the evidence-capture engine, then synthesize a creator-media channel audit.

## Workflow

1. Require a channel URL or handle. Good target shapes include `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.
2. Run `/youtube-audit <channel> [--count N]` or follow its contract directly when the skill link is unavailable.
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
- Route follow-up strategy to `/youtube-portfolio`, `/creator-positioning`, or `/content-programming`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/youtube-title-thumbnail-audit`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
