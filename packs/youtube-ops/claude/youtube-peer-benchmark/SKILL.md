---
name: youtube-peer-benchmark
description: Benchmark a YouTube channel against peers — discover comparable creators, pull real metrics via yt-dlp, compare performance at equivalent stages, and diagnose whether the gap is quality, volume, format, or conversion
type: research
version: 2.0.0
argument-hint: "<channel URL or handle> [--niche 'keyword phrase'] [--peers @handle1,@handle2] [--count N]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Peer Benchmark

Invoke as `/youtube-peer-benchmark`.

Given a target YouTube channel, discover comparable creators in the same niche, pull real performance data from yt-dlp, and produce a structured competitive analysis. The output answers: how does this channel compare to peers, where is it ahead, where is it behind, and what specifically explains the gap?

Use this for creator channels, founder-led shows, and topic publications such as `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.

## Prerequisites

- **yt-dlp**: Required. Install: `brew install yt-dlp` or `pip install yt-dlp`.
- **Python 3**: Required for data analysis. No special packages needed beyond stdlib.
- **Browser cookies** (optional): If yt-dlp returns incomplete data (NA values for views/likes), retry with `--cookies-from-browser brave` (or chrome/firefox/safari). Mention this to the user if needed.

Check `command -v yt-dlp` before proceeding. If missing, tell the user what to install and stop.

## Workflow

### 1. Parse Arguments

- `$ARGUMENTS` must contain a YouTube channel URL or handle.
- Optional `--niche 'keyword phrase'` overrides automatic niche detection (e.g. `--niche 'nextjs tutorial'`).
- Optional `--peers @handle1,@handle2,...` specifies known competitors to include (in addition to discovered ones).
- Optional `--count N` limits the target channel to the N most recent videos (default: all).
- Normalize handles: `@handle` → `https://www.youtube.com/@handle/videos`.

### 2. Gather Target Channel Baseline

If a current `/youtube-channel-audit` exists for the target channel, read raw metadata from `research/youtube/data/<slug>/videos-*.jsonl`. Otherwise, fetch directly.

Pull full metadata for the target channel:

```bash
yt-dlp --cookies-from-browser brave --skip-download \
  --print "%(id)s|%(title)s|%(upload_date)s|%(view_count)s|%(like_count)s|%(comment_count)s|%(duration)s|%(channel_follower_count)s" \
  "CHANNEL_URL/videos"
```

If `--count N` is specified, add `--playlist-end N`.

From this, compute the target channel profile:

| Metric | How |
|--------|-----|
| Subscriber count | From `channel_follower_count` |
| Total videos | Count of results |
| Total views | Sum of `view_count` |
| Channel age | First upload date to today |
| Publishing cadence | Videos per month (total videos / months active) |
| Avg views/video | Total views / total videos |
| Median views | Sorted middle value |
| Top video | Highest view count |
| Floor video | Lowest view count |
| Videos under 100 views | Count |
| Videos over 1K views | Count |
| Like rate | Total likes / total views |
| View-to-sub ratio | Total views / subscribers |
| Sub-per-view | Subscribers / total views (conversion efficiency) |
| Publishing gaps | All gaps > 14 days between consecutive uploads |
| Content categories | Classify each video by format: tutorial, commentary, vod, interview, meta, shorts, etc. |

Also compute:
- Performance by category: views, likes, comments, count, avg views per category
- Performance by time period (quarterly): videos published, total views, avg views per quarter

### 3. Discover Peer Channels

#### Automatic Discovery

Determine the target channel's niche from its top-performing video titles and tags. Use the 3-5 most distinctive keywords (not generic terms like "tutorial" or "how to").

Search YouTube for creators making similar content:

```bash
yt-dlp --cookies-from-browser brave --skip-download \
  --print "%(channel)s|%(channel_id)s|%(channel_follower_count)s|%(view_count)s|%(upload_date)s|%(title).80s" \
  "ytsearch20:KEYWORD1 KEYWORD2 KEYWORD3 2025"
```

Run 3-5 searches with different keyword combinations from the target's niche to build a broad candidate list.

#### Filter and Tier Candidates

From search results, extract unique channels. Discard:
- The target channel itself
- Channels with no videos in the last 6 months (inactive)
- Channels that only appeared once across all searches (likely tangential)

Sort remaining channels into tiers:

| Tier | Criteria | Purpose |
|------|----------|---------|
| **Actual peers** | Similar subscriber count (0.25x–4x of target) | Direct comparison |
| **Aspirational peers** | 5x–25x subscribers, same niche | Growth trajectory reference |
| **Category leaders** | 50x+ subscribers, same niche | Ceiling benchmark (not for direct comparison) |

Include any channels specified via `--peers` in addition to discovered ones, placed in the appropriate tier.

Select up to 3 actual peers, 3 aspirational peers, and 2 category leaders for analysis. Prefer channels with the most keyword overlap with the target.

### 4. Fetch Peer Channel Data

For each selected peer channel, pull metadata:

```bash
yt-dlp --cookies-from-browser brave --skip-download \
  --print "%(id)s|%(title)s|%(upload_date)s|%(view_count)s|%(like_count)s|%(comment_count)s|%(duration)s|%(channel_follower_count)s" \
  "https://www.youtube.com/@HANDLE/videos"
```

For channels with 50+ videos, fetch the full catalog to enable stage-matched comparison. Use `--playlist-end` only if the channel has 200+ videos, in which case fetch the most recent 100 plus the earliest 50 (to capture both current performance and early-stage trajectory).

Compute the same baseline metrics as step 2 for each peer.

### 5. Stage-Matched Comparison

This is the most important analysis. Do not just compare current stats — compare channels at equivalent stages.

For each aspirational/leader peer, isolate their **first N videos** where N = the target channel's total video count. This answers: "when this peer had the same number of videos, how were they doing?"

Compute for the stage-matched slice:

| Metric | Target | Peer (at same video count) |
|--------|--------|---------------------------|
| Total views | | |
| Avg views/video | | |
| Median views | | |
| Best single video | | |
| Videos under 100 views | | |
| Videos over 1K views | | |
| Time span to reach N videos | | |
| Avg days between videos | | |
| Format consistency (category count) | | |

### 6. Diagnose the Gap

For each peer comparison, categorize the gap across five dimensions:

#### Volume Gap
- How many more videos has the peer published in the same calendar time?
- What is the peer's publishing cadence vs. the target's?
- How many publishing gaps >14 days does each have?

#### Consistency Gap
- Does the peer have fewer format categories (more focused)?
- Does the peer have a higher floor (fewer low-performing videos)?
- Does the peer maintain cadence without multi-week breaks?

#### Quality Gap (or lack thereof)
- Compare ceiling: target's best video vs. peer's best at same stage
- Compare like rates on comparable videos
- Compare comment engagement

#### Conversion Gap
- Views-to-subscriber ratio: how efficiently does each channel convert viewers to subscribers?
- If the target has worse conversion, hypothesize why (format scatter, unclear channel promise, etc.)

#### Format Gap
- What content types does the peer make vs. the target?
- Which formats drive the most views for each?
- Does the target make content types that consistently underperform?

### 7. Write Report

Save to `research/youtube/peer-benchmark-<primary-slug>-YYYY-MM-DD.md`:

```markdown
# YouTube Peer Benchmark — [Channel Name]

> Channel: [URL]
> Subscribers: N
> Total videos: N
> Date: YYYY-MM-DD
> Niche: [detected or specified niche keywords]

## Target Channel Baseline

### Overall Stats
- Subscribers: N
- Total videos: N
- Total views: N
- Channel age: N months
- Publishing cadence: N videos/month
- Avg views/video: N
- Median views: N
- Top video: N views — [title]
- Floor: N videos under 100 views

### Performance by Category

| Category | Videos | Total Views | Avg Views | Like Rate | Notes |
|----------|-------:|------------|----------:|----------:|-------|
| ... | | | | | |

### Performance by Quarter

| Quarter | Videos | Total Views | Avg Views |
|---------|-------:|------------|----------:|
| ... | | | |

### Publishing Gaps (>14 days)

| Gap | From | To |
|----:|------|------|
| ... | | |

## Peer Channels

### Tier: Actual Peers (similar size)

| Channel | Subs | Videos | Since | Cadence | View Range |
|---------|-----:|-------:|-------|---------|------------|
| ... | | | | | |

### Tier: Aspirational Peers (5-25x)

| Channel | Subs | Videos | Since | Cadence | View Range |
|---------|-----:|-------:|-------|---------|------------|
| ... | | | | | |

### Tier: Category Leaders (50x+)

| Channel | Subs | Videos | Since | Cadence | View Range |
|---------|-----:|-------:|-------|---------|------------|
| ... | | | | | |

## Stage-Matched Comparisons

### [Peer Name] at [N] videos vs. [Target Name] at [N] videos

| Metric | [Target] | [Peer] (first N) |
|--------|----------|-------------------|
| Total views | | |
| Avg views/video | | |
| Median views | | |
| Best single video | | |
| Videos under 100 views | | |
| Videos over 1K views | | |
| Time to publish N videos | | |
| Avg days between videos | | |

### ...

## Gap Diagnosis

### Volume
[Is the target underproducing relative to peers? By how much? What does peer cadence look like?]

### Consistency
[Does the target have more format scatter, more gaps, a lower floor?]

### Quality
[Is the target's ceiling competitive? Are like rates comparable?]

### Conversion
[Views-to-sub efficiency compared to peers. Why the difference?]

### Format
[What content types work for peers that the target isn't making? What is the target making that peers avoid?]

## Verdict

### Where [Channel] is ahead
1. [Specific advantage with evidence]
2. ...

### Where [Channel] is behind
1. [Specific gap with evidence]
2. ...

### What explains the gap
[2-3 sentences: is this a quality problem, a volume problem, a format problem, or a conversion problem? Be specific.]

### The single most impactful change
[One concrete action, grounded in the peer data, that would close the biggest gap]
```

### 8. Summarize In Thread

After saving the report, output to the user:

- Subscriber count vs. peer range
- The stage-matched headline (e.g. "Your best video outperforms OrcDev's at the same stage, but you publish 4x less often")
- Top 2 advantages
- Top 2 gaps
- The single most impactful change
- Path to the full report

## Constraints

- **Real data only**: Every number must come from yt-dlp output. Never estimate, interpolate, or fabricate metrics.
- **Stage-matched comparisons are mandatory**: Never compare a 34-video channel's total stats against a 245-video channel's total stats as if that's meaningful. Always isolate the peer's equivalent stage.
- **Tier honestly**: Don't call a 200K-subscriber channel a "peer" to a 1K-subscriber channel. Tier them correctly and label the comparison as aspirational or ceiling benchmark.
- **Diagnose, don't prescribe content**: The output is a competitive diagnosis, not a content calendar. Say "you publish 4x less often" not "you should make 8 videos per month."
- **Do not compare channels without comparable evidence windows**: Mark subscriber counts or external metrics as unavailable unless present in fetched metadata.
- **Do not recommend copying peers**: Translate benchmark evidence into differentiated positioning.
- **Browser cookies**: Try without cookies first. If yt-dlp returns NA for view counts or subscriber counts, retry with `--cookies-from-browser brave` (or whichever browser the user has). Tell the user which browser you're using.
- **Rate limiting**: If YouTube returns 429 errors, wait 30 seconds and retry once. If it persists, work with whatever data was successfully fetched and note the gaps.
- **No API keys required**: yt-dlp works against public data. Do not ask for YouTube Data API keys.
- **Flat playlist for discovery, full metadata for analysis**: Use `--flat-playlist` when you only need video IDs/titles for discovery. Use full `--skip-download` metadata fetch when you need view counts, likes, dates.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/youtube-search-positioning`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
