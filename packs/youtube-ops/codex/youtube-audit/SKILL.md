---
name: youtube-audit
description: Analyze a YouTube channel with evidence-first metadata, transcripts, performance fields, portfolio shape, and repeated content-quality patterns
type: research
version: v0.0
argument-hint: "<channel URL or handle> [--count N]"
---

# YouTube Audit — Evidence-First Channel Analysis

Invoke as `$youtube-audit`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Fetch full video metadata and transcripts from a YouTube channel, persist raw evidence, then analyze both performance shape and content quality. The output identifies repeated strengths, repeated weaknesses, portfolio concentration, content roles, archetypes, and cleanup candidates with evidence cited from specific videos.

## Prerequisites

Two CLI tools are required. Neither needs API keys.

- **yt-dlp**: Lists channel videos as JSON. Install: `brew install yt-dlp` or `pip install yt-dlp`.
- **youtube-transcript-api**: Fetches transcripts via Python. If the active Python is externally managed, such as Homebrew Python on macOS under PEP 668, install this package in a project-local virtual environment instead of the system Python.

Check `yt-dlp` before proceeding. The transcript dependency should be handled through a project-local `.venv` when it is missing.

## Workflow

### 1. Parse Arguments

- `$ARGUMENTS` must contain a YouTube channel URL or handle (e.g. `@handle`).
- Optional `--count N` sets how many recent videos to fetch (default 20, max 50).
- If no channel is provided, ask the user for one and stop.
- Normalize handles to channel video URLs when needed: `@handle` -> `https://www.youtube.com/@handle/videos`.
- Validate that `yt-dlp` is available first:

```bash
command -v yt-dlp
```

- Select the Python interpreter for transcript fetching. Prefer a workspace-local virtual environment when present; if one is not present, create it before checking the transcript import:

```bash
if [ ! -x .venv/bin/python ]; then
  python3 -m venv .venv
fi
TRANSCRIPT_PYTHON=.venv/bin/python
"$TRANSCRIPT_PYTHON" -c "from youtube_transcript_api import YouTubeTranscriptApi; print('ok')"
```

- If the import check fails, install the missing package into the project-local virtual environment, then rerun the import check:

```bash
.venv/bin/python -m pip install youtube-transcript-api
"$TRANSCRIPT_PYTHON" -c "from youtube_transcript_api import YouTubeTranscriptApi; print('ok')"
```

- Store the selected interpreter path and use it for every transcript-fetching command in this audit.
- If package installation fails because network access is unavailable or denied, stop and report the exact safe install commands below:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install youtube-transcript-api
```

Do not recommend installing `youtube-transcript-api` into Homebrew/system Python with `python3 -m pip install ...`, and do not recommend `--break-system-packages`. The local-venv path avoids PEP 668 `externally-managed-environment` failures on Homebrew Python.

### 2. Archive Previous Audit

If `research/youtube/youtube-audit-*.md` or legacy `research/youtube-audit-*.md` already exists for the same channel (check the `> Channel:` header in existing files):

1. Copy the existing file to `docs/history/archive/YYYY-MM-DD/HHMMSS/research/youtube-audit-*.md`.
2. Preserve the archived snapshot exactly.
3. Then proceed to overwrite the canonical path.

New files do not need archive snapshots.

### 3. Fetch Video List

Create:

```text
research/youtube/data/<slug>/
```

Run full metadata export, not flat playlist metadata:

```bash
yt-dlp --dump-json --playlist-end N "CHANNEL_URL/videos"
```

Persist the raw newline-delimited response exactly to:

```text
research/youtube/data/<slug>/videos-YYYY-MM-DD.jsonl
```

Parse each JSON object for at least:

| Field | Notes |
| --- | --- |
| `id`, `webpage_url`, `title`, `description` | Identity and audit links |
| `channel`, `channel_id`, `uploader`, `uploader_id` | Channel identity |
| `upload_date`, `timestamp` | Used for recency and views/day |
| `duration` | Used for views/minute |
| `view_count`, `like_count`, `comment_count` | Performance |
| `tags`, `categories`, `chapters` | Positioning and packaging signals |
| `thumbnail`, `thumbnails` | Packaging review signal |

Build a video table sorted by upload date (newest first). Report total videos found.

### 4. Fetch Transcripts

Use the same Python interpreter that passed the import check. If `.venv/bin/python` exists and passed the import check, run transcript fetching with `.venv/bin/python`; otherwise use the Python executable that passed the import check. Fetch transcripts sequentially and persist raw transcript JSON:

```python
from youtube_transcript_api import YouTubeTranscriptApi
from pathlib import Path
import json, sys, time

video_ids = json.loads(sys.argv[1])
out_dir = Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)
results = {}
errors = []

for vid in video_ids:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(vid)
        (out_dir / f"{vid}.json").write_text(json.dumps(transcript, ensure_ascii=False, indent=2))
        results[vid] = " ".join(entry["text"] for entry in transcript)
    except Exception as e:
        errors.append({"id": vid, "reason": str(e)})
    time.sleep(1.5)

summary = {"transcripts": results, "errors": errors}
(out_dir / "transcripts-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2))
json.dump(summary, sys.stdout)
```

- Fetch sequentially with 1.5s delay to avoid rate limiting.
- Skip videos without transcripts and log the reason.
- If more than 80% lack transcripts, warn the user and ask whether to proceed.
- Do not fabricate transcript text; transcript gaps are evidence quality limits.

### 5. Prepare Analysis Context

Build structured records per video:

| Field | Computation |
| --- | --- |
| Title, date, URL, duration, views, likes, comments | Direct from metadata |
| Age in days | From upload date to current date |
| Views/day | `view_count / max(age_days, 1)` |
| Views/minute | `view_count / max(duration_minutes, 1)` |
| Like rate | `like_count / view_count` when both exist |
| Transcript coverage | `yes`, `no`, or `partial` |
| Archetype | Format pattern such as founder update, interview, tutorial, analysis, vlog, launch, reaction, teardown |
| Content role | Strategic role such as acquisition, trust-building, proof, education, launch support, community retention, cleanup candidate |

If total transcript text exceeds 80,000 words, truncate each transcript to preserve:
- First 500 words (hook and intro)
- Last 300 words (outro and CTA)
- Trim the middle proportionally across all videos to fit the budget

### 6. Analyze Content

Analyze performance and content in one pass.

### Performance And Portfolio Fields

Include:

- Total videos analyzed, transcript coverage, total views, median views, top video, bottom video.
- Views/day and views/minute leaders.
- Top-video concentration: top 1, top 3, and top 5 share of analyzed views.
- Portfolio distribution by archetype and content role.
- Packaging signals from titles, thumbnails, tags, descriptions, and chapters.
- Cleanup candidates: videos with poor fit, weak performance relative to channel median, stale positioning, or inconsistent audience promise. Mark as `keep`, `refresh`, `unlist/private candidate`, or `needs human review`; do not recommend deletion as an automated action.

### Content Quality Patterns

Split into positive patterns (double down) and critical patterns (fix).

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
| Portfolio fit | Does each video serve a clear role in the channel strategy? |
| Packaging | Do title, thumbnail, topic, and opening promise align? |

### 7. Write Report

Save to `research/youtube/youtube-audit-<slug>-YYYY-MM-DD.md`:

```markdown
# YouTube Audit — [Channel Name]

> Channel: [URL]
> Videos analyzed: N
> Transcripts available: N of M
> Date: YYYY-MM-DD
> Raw metadata: research/youtube/data/<slug>/videos-YYYY-MM-DD.jsonl
> Raw transcripts: research/youtube/data/<slug>/transcripts/

## Videos Analyzed

| # | Title | Date | Views | Likes | Views/day | Views/min | Duration | Archetype | Role | Transcript |
|---|-------|------|-------|-------|-----------|-----------|----------|-----------|------|------------|
| 1 | [Title](URL) | YYYY-MM-DD | N | N | N | N | Xm | [type] | [role] | Yes/No |
| ... | | | | | |

## Performance Snapshot

- **Total views analyzed**: N
- **Median views**: N
- **Top 1 concentration**: N%
- **Top 3 concentration**: N%
- **Views/day leader**: [video]
- **Views/minute leader**: [video]

## Portfolio Shape

| Archetype | Videos | View share | Notes |
|---|---:|---:|---|
| ... | | | |

| Content role | Videos | View share | Notes |
|---|---:|---:|---|
| ... | | | |

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

## Cleanup Candidates

| Video | Recommendation | Evidence | Human check |
|---|---|---|---|
| [Title](URL) | Keep / Refresh / Unlist-private candidate / Needs human review | [performance + fit evidence] | [what to inspect before action] |

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

Create the `research/youtube/` and `research/youtube/data/<slug>/` directories if they do not exist.

### 8. Summarize In Thread

After saving the report, output: top 3 strengths, top 3 weaknesses, performance/portfolio headline, strategic recommendation, report path, and raw data paths.

## Constraints

- **Pattern-only reporting**: Every finding must have evidence from 2+ videos. No single-video observations.
- **Sequential fetching**: Do not parallelize transcript fetches — use 1.5s delay to avoid IP rate limiting.
- **No API keys**: Both tools work unauthenticated against public data. Do not ask the user for API keys.
- **Smart truncation**: When truncating, always preserve hooks (first 500 words) and outros (last 300 words).
- **Honest coverage**: If transcripts are sparse, say so. Do not fabricate transcript content or hallucinate quotes.
- **Raw evidence first**: Always persist raw `yt-dlp` JSONL and transcript JSON before writing analysis.
- **No automated destructive content advice**: Cleanup candidates are review recommendations, not instructions to delete content.
- **Stay in analysis mode**: Do not propose video ideas, scripts, or content calendars. The job is to audit what exists.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/youtube-audit-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/youtube-audit-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Approved Artifact Handoff

After an approved synthesized write, explicit write/update mode, or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while approved artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.
- If stopping for approval before writing, the approval request remains the next action; do not include downstream routing.

## Intent-Aware Routing

Before applying the default `## Next-Skill Routing` sequence, classify the user's immediate intent and route to the missing action that best serves that intent:

- Strategy refresh: recommend the missing or stale positioning, programming, portfolio, metrics, or product-media artifact.
- Recording prep: recommend the missing series spec, script, build proof, walkthrough guide, or validation artifact needed before recording.
- Upload prep: recommend packaging, title/thumbnail, description, chapters, or final metadata work before broader strategy work.
- Performance review: recommend metrics, cadence, portfolio, peer benchmark, or owner-analytics export work before new content planning.
- Owner analytics or private/manual platform evidence: route to an explicit manual/guide handoff instead of inventing unavailable metrics.
- Dirty intended artifacts: route to shipping/commit/handoff first, not another creator strategy skill.

Use the default next-skill sequence only when no stronger user intent, missing artifact, manual blocker, or dirty-artifact handoff applies.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
