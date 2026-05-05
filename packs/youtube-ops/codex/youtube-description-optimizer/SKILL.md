---
name: youtube-description-optimizer
description: Audit, draft, or template YouTube descriptions and metadata for promise-match, search clarity, CTA hierarchy, links, chapters, hashtags, and upload readiness
type: research
version: 1.0.0
argument-hint: "<video URL | video ID | script/outline path | channel slug> [--mode audit|draft|template] [--series <name>] [--compare-channel <slug>]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Description Optimizer

Invoke as `$youtube-description-optimizer`.

Optimize YouTube descriptions and adjacent metadata for existing videos, future uploads, and repeatable series templates. This is the description/metadata lane; use `$youtube-video-audit` for full single-video performance diagnosis and `$youtube-title-thumbnail-audit` for title/thumbnail packaging.

## Inputs

- Required target: video URL, video ID, script/outline path, channel slug, or existing creator-media artifact.
- Optional `--mode audit|draft|template`: default `audit` for video targets, `draft` for script/outline targets, and `template` for channel/series targets.
- Optional `--series <name>`: names the repeatable show or format for template work.
- Optional `--compare-channel <slug>`: reuse channel evidence under `research/youtube/data/<slug>/`.

## Workflow

1. Resolve the target and mode. If the target is ambiguous, infer from file existence and URL/video-ID shape before asking the user.
2. Prefer existing evidence:
   - `research/youtube/data/<video-id>/metadata-*.json`
   - `research/youtube/data/<slug>/videos-*.jsonl`
   - `research/youtube/video-audit-*.md`
   - `research/youtube/title-thumbnail-audit-*.md`
   - `research/youtube/channel-audit-*.md`
   - `specs/youtube/series-*.md`
   - script or outline files supplied by the user
3. For existing videos, use public metadata descriptions, tags, chapters, title, URL, upload date, and available transcript/opening evidence. If public metadata is missing and the target is a video URL or ID, fetch it through `yt-dlp --dump-json "VIDEO_URL"` and persist it under `research/youtube/data/<video-id>/metadata-YYYY-MM-DD.json`.
4. For future drafts, use the supplied script/outline plus any creator-positioning, content-programming, series, product-led media, and search-positioning artifacts that are current.
5. For templates, use channel/series evidence to define reusable blocks, required links, optional links, CTA hierarchy, chapter style, hashtag policy, sponsor/disclosure slots, and update rules.
6. Analyze:
   - First 2 lines and above-the-fold promise support.
   - Search/topic clarity, entity names, reusable keywords, and avoidable keyword stuffing.
   - Match between title, thumbnail promise, intro/hook, chapters, and description.
   - CTA hierarchy, link order, stale or missing links, sponsor/disclosure language, attribution/credits, pinned-comment fit, and hashtag discipline.
   - Whether the description supports acquisition, trust-building, proof, education, launch support, community, or conversion.
7. Produce practical edits: keep/change/add/remove notes, rewritten description blocks, pinned-comment recommendation when useful, and a future-video checklist.

## Output

Write exactly one artifact:

- Audit mode: `research/youtube/description-optimizer-<video-id>-YYYY-MM-DD.md`
- Draft mode: `research/youtube/description-draft-<slug>-YYYY-MM-DD.md`
- Template mode: `specs/youtube/description-template-<slug>.md`

Use this structure:

```markdown
# YouTube Description Optimizer - [Target]

> Mode: audit / draft / template
> Target: [URL, video ID, file path, channel slug, or series]
> Date: YYYY-MM-DD
> Evidence: [paths used]

## Evidence Coverage

| Evidence | Status | Path or gap |
|---|---|---|
| Public metadata | Available / Missing / Not applicable | ... |
| Transcript or opening | Available / Missing / Not applicable | ... |
| Channel evidence | Available / Missing / Not applicable | ... |
| Script or outline | Available / Missing / Not applicable | ... |
| Series template | Available / Missing / Not applicable | ... |

## Description Diagnosis

- **First 2 lines**: ...
- **Promise match**: ...
- **Search/topic clarity**: ...
- **CTA/link hierarchy**: ...
- **Chapters/hashtags/disclosures**: ...
- **Pinned-comment fit**: ...

## Recommended Description

[Upload-ready description or revised description block.]

## Metadata Notes

- **Tags/keywords**: ...
- **Chapters**: ...
- **Hashtags**: ...
- **Links and credits**: ...
- **Disclosure/sponsor slots**: ...

## Keep / Change / Add / Remove

| Action | Item | Why | Evidence |
|---|---|---|---|
| Keep / Change / Add / Remove | ... | ... | ... |

## Future Checklist

[Reusable checks for the next upload or this series.]
```

## Constraints

- Do not invent links, product URLs, sponsors, disclosures, chapters, transcript details, comments, or owner-only metrics.
- Mark missing evidence explicitly instead of filling gaps.
- Do not recommend deceptive metadata, keyword stuffing, tag spam, misleading hashtags, or CTAs that conflict with the video's promise.
- Keep description changes practical for the creator's apparent production capacity.
- Archive existing canonical artifacts before replacing them under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-portfolio` for existing-video cleanup, `$video-script` from the `remotion` pack for future-video draft work that exposes script gaps, and `$series-spec` for template work that exposes missing series rules.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on video cleanup vs future programming, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.
