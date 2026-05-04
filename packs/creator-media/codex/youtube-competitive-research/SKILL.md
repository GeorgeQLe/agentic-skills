---
name: youtube-competitive-research
description: Analyze why an external YouTube video performed well and extract evidence-backed competitive lessons, positioning gaps, and adaptation opportunities
type: research
version: 1.0.0
argument-hint: "<video URL or ID...> [--primary-channel <slug>] [--comments N] [--angle packaging|topic|retention|positioning]"
---

# YouTube Competitive Research

Invoke as `$youtube-competitive-research`.

Study external YouTube videos as competitive or opposition research. The goal is to explain why a video likely worked, what audience job it served, what can be learned, and how to adapt the lesson without copying the competitor. Use `$youtube-vid-research` for neutral comprehension and `$youtube-peer-benchmark` for channel-level peer comparisons.

## Inputs

- Required: one or more YouTube video URLs or video IDs.
- Optional `--primary-channel <slug>`: compare the lessons against existing evidence for the user's channel under `research/youtube/data/<slug>/`.
- Optional `--comments N`: fetch up to N public top-level comments when public comment tooling/API access is available. Default 50, max 200.
- Optional `--angle packaging|topic|retention|positioning`: default is to cover all four.

## Workflow

1. Resolve every target into a video ID from watch URLs, Shorts URLs, youtu.be URLs, embed URLs, or raw 11-character IDs.
2. Require `yt-dlp` for public metadata:

   ```bash
   command -v yt-dlp
   ```

3. Select a transcript Python interpreter. Prefer a workspace-local `.venv`; create it if missing. Install `youtube-transcript-api` into `.venv` only when the import check fails and network access is available.
4. Persist raw evidence under `research/youtube/data/<video-id>/`:
   - `metadata-YYYY-MM-DD.json`: raw `yt-dlp --dump-json "VIDEO_URL"` output.
   - `transcript/<video-id>.json`: raw transcript JSON when available.
   - `transcript/transcript-summary.json`: transcript text or failure reason.
   - `api/comment-threads-YYYY-MM-DD.json`: optional public comments when an already-authorized API path is available.
5. Extract performance signals from public metadata when present: views, likes, comments, age, views/day, duration, views/minute, title, thumbnail URLs, description, tags, chapters, upload timing, and channel identity.
6. Analyze:
   - Performance hypothesis: why the video likely earned attention relative to public evidence.
   - Audience job: the problem, desire, identity, fear, or curiosity the video served.
   - Packaging: title, thumbnail, topic framing, specificity, novelty, and expectation match.
   - Content/retention drivers: hook, pacing, proof, examples, conflict, payoff, structure, and CTA.
   - Distribution context: timing, trend fit, search demand, collaboration, controversy, community, or platform format signals when evidence supports them.
   - Comment themes only when comments were captured; separate praise, objections, confusion, requests, and spam/noise.
   - Adaptation opportunities for the user's channel, product, or content strategy.
7. If a primary channel slug is supplied, compare against the user's existing raw channel evidence and state what the competitor proves that the primary channel does not yet prove.

## Output

Write:

```text
research/youtube/competitive-research-<video-id-or-slug>-YYYY-MM-DD.md
```

Use this structure:

```markdown
# YouTube Competitive Research - [Title or Video Set]

> Videos: [URLs]
> Primary channel: [slug or not provided]
> Date captured: YYYY-MM-DD
> Evidence: [raw paths used]
> Angle: packaging / topic / retention / positioning / all

## Evidence Coverage

| Video | Metadata | Transcript | Comments | Primary-channel comparison |
|---|---|---|---|---|
| [Title](URL) | Available / Missing | Available / Missing | Available / Missing / Not requested | Available / Not provided |

## Performance Snapshot

| Video | Published | Duration | Views | Likes | Comments | Views/day | Views/min |
|---|---|---:|---:|---:|---:|---:|---:|
| ... | ... | ... | ... | ... | ... | ... | ... |

## Why It Likely Worked

1. [Hypothesis] - [evidence]
2. [Hypothesis] - [evidence]
3. [Hypothesis] - [evidence]

## Audience Job And Positioning

[Audience need, competitor promise, category wedge, and emotional or practical trigger.]

## Packaging And Retention Lessons

- **Title / thumbnail promise**: ...
- **Topic timing / novelty**: ...
- **Hook and structure**: ...
- **Proof and payoff**: ...
- **Comments / audience signal**: ...

## Adaptation Opportunities

| Opportunity | Adapt, avoid, or counter-position | Evidence | Suggested next move |
|---|---|---|---|
| ... | ... | ... | ... |

## Risks Of Copying

[What would be derivative, off-brand, unsupported by evidence, or risky to imitate.]

## Open Questions And Evidence Gaps

[Missing transcript, unavailable comments, absent owner analytics, uncertain distribution cause, or claims needing independent verification.]
```

## Constraints

- Do not invent metrics, transcript quotes, comments, thumbnail details, or distribution causes.
- Separate observed public evidence from performance hypotheses.
- Do not recommend copying a competitor directly; translate evidence into differentiated positioning and execution.
- Do not treat public views as proof of profitability, subscriber conversion, retention, CTR, or revenue.
- Do not bypass login walls, bot protections, access controls, or private YouTube Studio data.
- Archive existing canonical artifacts before replacing them under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$content-programming` when the competitive lesson should shape what to make next; `$youtube-search-positioning` when the lesson is mainly search/topic demand; `$youtube-peer-benchmark` when the user needs channel-level comparison beyond one video.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, recommend `$creator-positioning` when the issue is differentiation or `$content-programming` when the issue is future topics, and explain the missing artifact.
