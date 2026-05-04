---
name: youtube-vid-research
description: Research one or more external YouTube videos for context, claims, structure, examples, terminology, and transferable takeaways
type: research
version: 1.0.0
argument-hint: "<video URL or ID...> [--focus context|claims|summary|references] [--compare-channel <slug>]"
---

# YouTube Video Research

Invoke as `$youtube-vid-research`.

Research external YouTube videos so the agent can understand what the user is referring to and reuse that context in specs, strategy, writing, product work, or implementation. This is the general comprehension lane; use `$youtube-video-audit` for performance diagnosis, `$youtube-format-research` for production/style breakdowns, and `$youtube-competitive-research` for why a competitor video worked.

## Inputs

- Required: one or more YouTube video URLs or video IDs.
- Optional `--focus context|claims|summary|references`: default `context`.
- Optional `--compare-channel <slug>`: reuse channel evidence under `research/youtube/data/<slug>/` when the user asks how the reference relates to a known channel.

## Workflow

1. Resolve every target into a video ID from watch URLs, Shorts URLs, youtu.be URLs, embed URLs, or raw 11-character IDs.
2. Require `yt-dlp` for public metadata:

   ```bash
   command -v yt-dlp
   ```

3. Select a transcript Python interpreter. Prefer a workspace-local `.venv`; create it if missing. Install `youtube-transcript-api` into `.venv` only when the import check fails and network access is available.
4. Persist raw evidence before analysis under `research/youtube/data/<video-id>/`:
   - `metadata-YYYY-MM-DD.json`: raw `yt-dlp --dump-json "VIDEO_URL"` output.
   - `transcript/<video-id>.json`: raw transcript JSON when available.
   - `transcript/transcript-summary.json`: transcript text or failure reason.
5. Extract public metadata fields when present: title, URL, channel, upload date, duration, description, chapters, tags, categories, thumbnails, view count, like count, and comment count.
6. Analyze the video for:
   - Main thesis, audience, context, and assumed prior knowledge.
   - Key claims, examples, frameworks, named entities, tools, sources, and references.
   - Narrative structure: hook, setup, sections, payoff, and CTA.
   - User-relevant takeaways: what matters for the current project, idea, spec, or decision.
   - Uncertainties and evidence gaps.
7. If multiple videos were supplied, synthesize common themes, contradictions, and how each video contributes distinct context.

## Output

Write:

```text
research/youtube/video-research-<video-id-or-slug>-YYYY-MM-DD.md
```

Use this structure:

```markdown
# YouTube Video Research - [Title or Video Set]

> Videos: [URLs]
> Date captured: YYYY-MM-DD
> Evidence: [raw paths used]
> Focus: context / claims / summary / references

## Evidence Coverage

| Video | Public metadata | Transcript | Notes |
|---|---|---|---|
| [Title](URL) | Available / Missing | Available / Missing | ... |

## Context Brief

[What this video is about, who it is for, and why it matters to the user's request.]

## Key Claims And Examples

| Claim / Idea | Evidence | Confidence | Relevance |
|---|---|---|---|
| ... | metadata/transcript/chapter reference | High / Medium / Low | ... |

## Structure Notes

- **Hook**: ...
- **Sections**: ...
- **Payoff**: ...
- **CTA / next action**: ...

## Terms, References, And Source Leads

[Named people, companies, tools, papers, links, topics, or source leads surfaced by the video.]

## Transferable Takeaways

[What the user or downstream agent should carry forward.]

## Open Questions And Evidence Gaps

[Missing transcript, unclear claims, unavailable references, or claims needing independent verification.]
```

## Constraints

- Do not invent transcript quotes, links, references, comments, metrics, or visual details.
- Mark missing transcript or metadata explicitly.
- Do not treat a single external video as proof of a market, trend, or channel pattern.
- When a claim affects factual, legal, medical, financial, or current-event accuracy, recommend independent source verification instead of relying only on the video.
- Do not bypass login walls, bot protections, access controls, or private YouTube Studio data.
- Archive existing canonical artifacts before replacing them under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-format-research` when the user wants to reuse the video's structure, style, edit, or design; `$youtube-competitive-research` when the user asks why the video performed well or what can be learned from a competitor; otherwise `$content-programming` when the research should inform future topics.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-format-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$video-script` -> `$video-build` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on research vs production strategy, recommend `$content-programming` and explain the missing artifact.
