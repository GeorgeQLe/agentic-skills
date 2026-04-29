---
name: youtube-audit
description: Analyze a YouTube channel's content quality by fetching video metadata and transcripts, then producing a critical audit of repeated strengths and weaknesses
type: research
version: 1.0.0
argument-hint: "<channel URL or handle> [--count N]"
---

# YouTube Audit — Channel Content Quality Analysis

Fetch video metadata and transcripts from a YouTube channel, then analyze content quality across multiple dimensions. The output identifies repeated patterns — both strengths to double down on and weaknesses to fix — with evidence cited from specific videos.

## Prerequisites

Two CLI tools are required. Neither needs API keys.

- **yt-dlp**: Lists channel videos as JSON. Install: `brew install yt-dlp` or `pip install yt-dlp`.
- **youtube-transcript-api**: Fetches transcripts via Python. Install: `pip install youtube-transcript-api`.

Check both are installed before proceeding. If either is missing, tell the user exactly what to install and stop.

## Process

### 1. Parse Arguments

- `$ARGUMENTS` must contain a YouTube channel URL (e.g. `https://www.youtube.com/@handle`) or handle (e.g. `@handle`).
- Optional `--count N` sets how many recent videos to fetch (default 20, max 50).
- If no channel is provided, ask the user for one and stop.
- Validate that `yt-dlp` and `youtube-transcript-api` are available by running `which yt-dlp` and `python3 -c "import youtube_transcript_api"`.

### 2. Archive Previous Audit

If `research/youtube-audit-*.md` already exists for the same channel (check the `> Channel:` header in existing files):

1. Copy the existing file to `docs/history/archive/YYYY-MM-DD/HHMMSS/research/youtube-audit-*.md`.
2. Preserve the archived snapshot exactly.
3. Then proceed to overwrite the canonical path.

New files do not need archive snapshots.

### 3. Fetch Video List

Run:

```bash
yt-dlp --flat-playlist --dump-json --playlist-end N "CHANNEL_URL/videos"
```

Parse each JSON line for: `id`, `title`, `upload_date`, `url`, `duration`, `view_count`.

Build a video table sorted by upload date (newest first). Report total videos found to the user.

### 4. Fetch Transcripts

Use an inline Python script to batch-fetch transcripts:

```python
from youtube_transcript_api import YouTubeTranscriptApi
import json, sys, time

video_ids = json.loads(sys.argv[1])
results = {}
errors = []

for vid in video_ids:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(vid)
        results[vid] = " ".join(entry["text"] for entry in transcript)
    except Exception as e:
        errors.append({"id": vid, "reason": str(e)})
    time.sleep(1.5)

json.dump({"transcripts": results, "errors": errors}, sys.stdout)
```

- Fetch sequentially with 1.5s delay between requests to avoid rate limiting.
- Skip videos without transcripts and log the reason.
- If more than 80% of videos lack transcripts, warn the user that the audit will be limited and ask whether to proceed.

### 5. Prepare Analysis Context

Build structured records per video:

```
## [Title]
- Date: YYYY-MM-DD
- URL: https://youtube.com/watch?v=ID
- Duration: Xm Ys
- Views: N

[transcript text]
```

If total transcript text exceeds 80,000 words, truncate each transcript to preserve:
- First 500 words (hook and intro)
- Last 300 words (outro and CTA)
- Trim the middle proportionally across all videos to fit the budget

### 6. Analyze Content

Perform a single reasoning pass across all transcripts. Split findings into:

- **Positive patterns** (double down): Things the channel does well repeatedly
- **Critical patterns** (fix): Things the channel does poorly repeatedly

**Every finding must cite evidence from 2+ videos to qualify as a pattern.** Single-video observations are not patterns — discard them.

Analyze across these dimensions:

| Dimension | What to look for |
| --- | --- |
| Positioning | Who is this channel for? Is it consistent? Does the creator own a niche? |
| Hooks | First 30 seconds — do they create curiosity, state a problem, or waste time? |
| Interview style | If applicable — question quality, follow-ups, guest chemistry, interruptions |
| Credibility | Does the creator demonstrate expertise? Name-drop experiences? Show receipts? |
| Topic selection | Are topics timely, evergreen, niche, or scattered? Do they match the audience? |
| Pacing | Does the content drag or rush? Are there dead zones? |
| Editing signals | Verbal cues for cuts, chapters, graphics. Does the script feel edited or rambling? |
| Startup rigor | If startup/business content — are frameworks used? Is advice actionable or generic? |
| Audience trust | Does the creator build trust or erode it? Sponsorship handling, honesty, consistency |

### 7. Write Report

Save to `research/youtube-audit-YYYY-MM-DD.md`:

```markdown
# YouTube Audit — [Channel Name]

> Channel: [URL]
> Videos analyzed: N
> Transcripts available: N of M
> Date: YYYY-MM-DD

## Videos Analyzed

| # | Title | Date | Views | Duration | Transcript |
|---|-------|------|-------|----------|------------|
| 1 | [Title](URL) | YYYY-MM-DD | N | Xm | Yes/No |
| ... | | | | | |

## Positive Patterns (Double Down)

### [Pattern Title]
- **Frequency**: Found in N of M videos
- **Evidence**: [Video 1 title] — "[quote or description]"; [Video 2 title] — "[quote or description]"
- **Recommendation**: [What to keep doing or amplify]

### ...

## Critical Patterns (Fix)

### [Pattern Title]
- **Severity**: High / Medium / Low
- **Frequency**: Found in N of M videos
- **Evidence**: [Video 1 title] — "[quote or description]"; [Video 2 title] — "[quote or description]"
- **Impact**: [Why this hurts the channel]
- **Recommendation**: [Specific fix]

### ...

## Summary

### Top 3 Strengths
1. [Strength] — [one-line why]
2. [Strength] — [one-line why]
3. [Strength] — [one-line why]

### Top 3 Weaknesses
1. [Weakness] — [one-line why]
2. [Weakness] — [one-line why]
3. [Weakness] — [one-line why]

### Strategic Recommendation
[2-3 sentences: the single most impactful change the channel should make, grounded in the patterns found]
```

Create the `research/` directory if it doesn't exist.

### 8. Summarize In Thread

After saving the report, output to the user:

- Top 3 strengths (one line each)
- Top 3 weaknesses (one line each)
- Strategic recommendation
- Path to the full report

## Constraints

- **Pattern-only reporting**: Every finding must have evidence from 2+ videos. No single-video observations.
- **Sequential fetching**: Do not parallelize transcript fetches — use 1.5s delay to avoid IP rate limiting.
- **No API keys**: Both tools work unauthenticated against public data. Do not ask the user for API keys.
- **Smart truncation**: When truncating, always preserve hooks (first 500 words) and outros (last 300 words).
- **Honest coverage**: If transcripts are sparse, say so. Do not fabricate transcript content or hallucinate quotes.
- **Stay in analysis mode**: Do not propose video ideas, scripts, or content calendars. The job is to audit what exists.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
