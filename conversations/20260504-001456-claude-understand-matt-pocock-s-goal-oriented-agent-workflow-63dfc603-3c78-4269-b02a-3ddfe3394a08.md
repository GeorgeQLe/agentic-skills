# Understand Matt Pocock's goal-oriented agent workflow

| Field | Value |
|-------|-------|
| **Date** | 2026-05-04 00:14:56 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `63dfc603-3c78-4269-b02a-3ddfe3394a08` |
| **Entrypoint** | cli |
| **Version** | 2.1.126 |

---

## User _00:14:56_

I'd like to run an experiment. I heard Matt Pocock say he wants to move away from PRD/Spec based workflows and toward goal-oriented loops with the user operator verifying that the agent has the
  same level of understanding of the user wants, the same taste as the user, and ability to interpret what the user intent is. Can you check out this video and its transcript to understand his p
  oint? https://youtu.be/-QFHIoCo-Ko?si=1aeqtkAVbx6A1B9G

## Assistant _00:15:00_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _00:15:05_

Let me fetch that video to understand Matt Pocock's points.

## Assistant _00:15:07_

<details><summary>Tool calls</summary>

- WebFetch: https://youtu.be/-QFHIoCo-Ko?si=1aeqtkAVbx6A1B9G

</details>

## User _00:16:13_

[Request interrupted by user]

## User _00:16:20_

I'd like to run an experiment. I heard Matt Pocock say he wants to move away from PRD/Spec based workflows and toward goal-oriented loops with the user operator verifying that the agent has the
  same level of understanding of the user wants, the same taste as the user, and ability to interpret what the user intent is. Can you check out this video and its transcript to understand his p
  oint? https://youtu.be/-QFHIoCo-Ko?si=1aeqtkAVbx6A1B9G /youtube-audit

## Assistant _00:16:25_

<details><summary>Tool calls</summary>

- Skill: /youtube-audit

</details>

## User _00:16:25_

Base directory for this skill: /Users/georgele/.claude/skills/youtube-audit

# YouTube Audit — Evidence-First Channel Analysis

Fetch full video metadata and transcripts from a YouTube channel, persist raw evidence, then analyze both performance shape and content quality. The output identifies repeated strengths, repeated weaknesses, portfolio concentration, content roles, archetypes, and cleanup candidates with evidence cited from specific videos.

## Prerequisites

Two CLI tools are required. Neither needs API keys.

- **yt-dlp**: Lists channel videos as JSON. Install: `brew install yt-dlp` or `pip install yt-dlp`.
- **youtube-transcript-api**: Fetches transcripts via Python. If the active Python is externally managed, such as Homebrew Python on macOS under PEP 668, install this package in a project-local virtual environment instead of the system Python.

Check `yt-dlp` before proceeding. The transcript dependency should be handled through a project-local `.venv` when it is missing.

## Process

### 1. Parse Arguments

- `https://youtu.be/-QFHIoCo-Ko?si=1aeqtkAVbx6A1B9G` must contain a YouTube channel URL (e.g. `https://www.youtube.com/@handle`) or handle (e.g. `@handle`).
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

Parse each JSON object for: `id`, `webpage_url`, `title`, `description`, `channel`, `channel_id`, `uploader`, `uploader_id`, `upload_date`, `timestamp`, `duration`, `view_count`, `like_count`, `comment_count`, `tags`, `categories`, `chapters`, `thumbnail`, and `thumbnails`.

Build a video table sorted by upload date (newest first). Report total videos found to the user.

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

- Fetch sequentially with 1.5s delay between requests to avoid rate limiting.
- Skip videos without transcripts and log the reason.
- If more than 80% of videos lack transcripts, warn the user that the audit will be limited and ask whether to proceed.
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

Split findings into:

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

## Cleanup Candidates

| Video | Recommendation | Evidence | Human check |
|---|---|---|---|
| [Title](URL) | Keep / Refresh / Unlist-private candidate / Needs human review | [performance + fit evidence] | [what to inspect before action] |

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

Create the `research/youtube/` and `research/youtube/data/<slug>/` directories if they do not exist.

### 8. Summarize In Thread

After saving the report, output to the user:

- Top 3 strengths (one line each)
- Top 3 weaknesses (one line each)
- Strategic recommendation
- Performance/portfolio headline
- Path to the full report
- Raw data paths

## Constraints

- **Pattern-only reporting**: Every finding must have evidence from 2+ videos. No single-video observations.
- **Sequential fetching**: Do not parallelize transcript fetches — use 1.5s delay to avoid IP rate limiting.
- **No API keys**: Both tools work unauthenticated against public data. Do not ask the user for API keys.
- **Smart truncation**: When truncating, always preserve hooks (first 500 words) and outros (last 300 words).
- **Honest coverage**: If transcripts are sparse, say so. Do not fabricate transcript content or hallucinate quotes.
- **Raw evidence first**: Always persist raw `yt-dlp` JSONL and transcript JSON before writing analysis.
- **No automated destructive content advice**: Cleanup candidates are review recommendations, not instructions to delete content.
- **Stay in analysis mode**: Do not propose video ideas, scripts, or content calendars. The job is to audit what exists.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Assistant _00:16:31_

I'll fetch the transcript of this specific Matt Pocock video to understand his point about goal-oriented loops vs PRD/spec workflows. Since this is a single video analysis (not a full channel audit), I'll adapt the skill to just extract and analyze the content.

## Assistant _00:16:32_

<details><summary>Tool calls</summary>

- Bash: Check yt-dlp availability

</details>

## Assistant _00:16:33_

<details><summary>Tool calls</summary>

- Bash: Ensure venv and transcript API available

</details>

## Assistant _00:16:46_

Good, tools are ready. Let me fetch the video metadata and transcript.

## Assistant _00:16:49_

<details><summary>Tool calls</summary>

- Bash: Fetch video metadata

</details>

## Assistant _00:16:51_

<details><summary>Tool calls</summary>

- Bash: Fetch video transcript

</details>

## Assistant _00:19:34_

API changed. Let me fix the transcript fetch.

## Assistant _00:19:36_

<details><summary>Tool calls</summary>

- Bash: Fetch transcript with updated API

</details>

## Assistant _00:19:41_

Got the full transcript (it's a ~2 hour workshop). Let me read the key sections to understand his thesis about goal-oriented loops vs PRD/spec workflows.

## Assistant _00:19:42_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/63dfc603-3c78-4269-b02a-3ddfe3394a08/tool-results/b5susi2w7.txt`

</details>

## Assistant _00:20:12_

I've read the full transcript of Matt Pocock's workshop "Full Walkthrough: Workflow for AI Coding" (AI Engineer conference, April 2026, ~97 min, 358K views). Here's his core thesis:

---

## Matt Pocock's Key Arguments

**Against "Specs to Code":** He explicitly argues against the workflow where you write a spec document and have AI turn it into code iteratively. He tried it and says "it sucks" because you lose touch with the code — your battleground.

**For: Goal-oriented alignment loops ("Grill Me"):** His alternative centers on reaching a **shared design concept** (he borrows the term from Frederick Brooks' *The Design of Design*) with the AI before any implementation. The key insight:

> "I didn't need an asset, I didn't need a plan — I needed to be on the same wavelength as the AI, as my agent."

His "Grill Me" skill is tiny: *"Interview me relentlessly about every aspect of this plan until we reach a shared understanding."* The AI asks 20-80+ questions one at a time, with its own recommended answer. The human validates/corrects each one. This is the **alignment phase** — always human-in-the-loop.

**The PRD is just a summary artifact, not the source of truth.** He doesn't even read it after generation because he trusts the shared understanding was built during grilling. He also warns about **doc rot** — old PRDs poisoning future agent sessions.

**His full flow:**
1. **Grill Me** → reach shared understanding (human-in-loop, not skippable)
2. **Write PRD** → summarize the destination (he doesn't review it)
3. **PRD → Kanban (vertical slices)** → independently-grabbable issues with blocking relationships, enabling parallelization
4. **Implementation (AFK)** → agents loop through the backlog using TDD, in Docker sandboxes
5. **QA/Code Review** → human imposes taste; generates new issues back into the Kanban

**Other important points:**
- **Smart zone vs dumb zone**: ~100K tokens is the effective smart zone regardless of context window size. Size tasks to stay in it. Prefer clearing context over compacting.
- **Deep modules > shallow modules** (Ousterhout): AI navigates and tests better against large modules with small interfaces. Bad codebases produce bad agent output.
- **Push vs Pull**: Push coding standards to the reviewer agent; let the implementer pull them as needed.
- **Vertical slices (tracer bullets)**: Force AI to cut across all layers in each slice so you get integrated feedback immediately, not after 3 horizontal phases.
- **Own your planning stack**: Don't over-rely on Spec Kit, Taskmaster, etc. — you need observability and control.

---

## Relevance to Your Experiment

His core claim that resonates with what you mentioned: **the alignment artifact isn't a document — it's the shared understanding itself.** The document is just a lossy snapshot. What matters is that the agent has the same taste, intent, and understanding as the user, verified through relentless Q&A.

This is fundamentally different from our current CLAUDE.md workflow of "plan first, write specs, execute." His approach front-loads the *dialogue* and treats the resulting docs as ephemeral byproducts.

Want me to prototype a "grill me" style skill for this repo, or would you rather discuss how to adapt his ideas to your existing workflow?

## User _00:23:31_

can you verify that those are the differences between our workflow and his? Also if we were to implement something like Matt Pocock's workflow, I'd make it another pack with attribution (inspired by Matt Pocock)

## Assistant _00:23:36_

Let me check our current workflow setup to do a proper comparison.

## Assistant _00:23:37_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/CLAUDE.md`

</details>

## Assistant _00:23:38_

<details><summary>Tool calls</summary>

- Bash: Find skills and pack files

</details>

## Assistant _00:23:43_

<details><summary>Tool calls</summary>

- Bash: Check for existing grill/alignment skills and list packs

</details>

## Assistant _00:23:44_

<details><summary>Tool calls</summary>

- Bash: Read packs documentation

</details>

## Assistant _00:23:48_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/spec-interview/SKILL.md`

</details>

## Assistant _00:23:52_

<details><summary>Tool calls</summary>

- Bash: Check kanban spec-interview skill

</details>

## Assistant _00:23:53_

<details><summary>Tool calls</summary>

- Bash: Find roadmap skills

</details>

## Assistant _00:23:57_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/roadmap/SKILL.md`

</details>

## Assistant _00:24:30_

Now I have a clear picture. Here's my comparison:

---

## Our Workflow vs Matt Pocock's: Honest Comparison

### Where we're actually similar (more than I initially implied)

| Aspect | Our workflow | Pocock's workflow |
|--------|-------------|-------------------|
| **Interview before spec** | `/spec-interview` — probes assumptions, asks focused questions, presents recommendations | "Grill Me" — relentless questions until shared understanding |
| **Spec as intermediate artifact** | `specs/[topic].md` written after interview | PRD written after grilling |
| **Vertical slices** | `/roadmap` produces phased plans with blocking relationships | PRD → Kanban with vertical slice rules |
| **Subagent delegation** | CLAUDE.md: "Use subagents liberally" | Explore subagents, sandboxed implementers |
| **Context window awareness** | Compacting, clear-context flows in CLAUDE.md | Smart zone / dumb zone thesis |
| **TDD** | Not explicitly in our workflow | Central to his AFK implementation |

### Real differences

| Dimension | Our workflow | Pocock's workflow |
|-----------|-------------|-------------------|
| **Source of truth** | The **spec document** is the artifact. Interview feeds into it. User reviews the spec. | The **shared understanding** is the artifact. The PRD is just a lossy summary he doesn't even read. |
| **Spec review** | We present assumptions manifest, get user confirmation on the doc | He skips reviewing the PRD entirely — trusts the grilling built alignment |
| **Plan mode** | Enter plan mode, write detailed plans upfront, get user approval on the plan | Explicitly argues against multi-phase plans. Prefers a Kanban of independently-grabbable issues with a simple loop. |
| **Doc persistence** | Specs live in `specs/`, archived when rewritten | Deletes PRDs after implementation — fears doc rot poisoning future agents |
| **Implementation loop** | Our `/ship` is step-by-step: implement one step → commit → plan next → stop → user approves | His "Ralph loop": agent picks from backlog, implements via TDD, commits, loops autonomously AFK |
| **Human involvement during implementation** | Human approves each step (plan mode accept flow) | Human leaves entirely. QA happens after, not during. |
| **Grilling depth** | `/spec-interview` asks 1-3 questions per turn, covers structured categories | "Grill Me" asks 20-100 questions, one at a time, purely conversational |
| **Module architecture** | Not explicitly in our planning skills | Deep modules (Ousterhout) as a first-class planning concern — shapes PRD and implementation |
| **Taste enforcement** | Via code review during implementation, lessons.md | Via QA phase after AFK implementation — QA creates new Kanban issues |

### The fundamental philosophical split

**Our workflow**: Spec-first. The document is the contract. Interview refines the document. Implementation follows the document. The agent is executing a spec.

**Pocock's workflow**: Alignment-first. The conversation IS the work. The document is a disposable byproduct. Implementation follows the shared understanding (which lives in the agent's context, not a file). The agent is a collaborator with taste.

He's explicitly arguing against what he calls "specs to code" — which is close to what we do. His argument: if you rely on the spec, you lose touch with the code. You need the grilling to build genuine shared understanding, and then the agent can make judgment calls during implementation because it internalized your intent, not just your instructions.

---

### If we build a pack inspired by this

The key new things we'd need that we don't have:

1. **A "Grill Me" skill** — lighter than `/spec-interview`, no structured output, just relentless 1-question-at-a-time alignment until shared understanding is reached
2. **A disposable PRD skill** — writes a summary that's explicitly marked ephemeral (not `specs/`)
3. **A vertical-slice Kanban splitter** — turns the PRD into independently-grabbable issues with blocking DAG
4. **A Ralph/AFK loop** — autonomous TDD-driven implementation that picks from the backlog without human approval per step
5. **An "improve architecture" skill** — scan for shallow modules, propose deepening

Want me to draft the pack structure, or do you want to discuss which pieces to adopt vs skip first?

## User _00:29:43_

Feel free to disagree with this, what do you think about this recommendation?

## Assistant _00:30:23_

Here's my honest take:

**Pocock is right about one thing that matters a lot:** the grilling session builds better alignment than our spec-interview. Our `/spec-interview` is structured, categorical, 1-3 questions per turn — it's efficient but it optimizes for *document completeness*, not *shared understanding*. His one-question-at-a-time, 40-80 question approach is slower but it forces the human to actually think through every assumption. The output is a better-calibrated agent, not a better-formatted document.

**But he contradicts himself on the PRD.** His own thesis is that LLMs are "the guy from Memento" — they forget everything on context clear. Then he says he doesn't read the PRD and treats it as disposable. But... the PRD exists *precisely because* the agent forgets. The shared understanding dies when you clear context. The PRD is the only thing that carries alignment into the next session. He gets away with not reading it because he's a solo dev working in a single long session with his own memory intact. We can't assume that.

**The Ralph loop is aspirational, not universal.** He's running it against a well-tested course platform he wrote — a codebase with tight service modules, good test boundaries, and a single developer's taste baked in. Fully AFK implementation breaks for: UI work (his own admission), novel architecture, multi-developer codebases with conflicting conventions, and anything where the "right" answer isn't deterministic. Our step-by-step approval is more conservative but catches more drift.

**What I'd actually recommend adopting:**

1. **A lightweight "Grill Me" skill** — yes, absolutely. Position it *before* `/spec-interview` as the alignment phase. It's cheap (just a tiny prompt), it's fast, and it solves the real problem: the agent and user being on different wavelengths before any planning artifact is produced. Our spec-interview could then be shorter because alignment is already established.

2. **The vertical-slice Kanban splitter** — better than sequential phase plans. We already have `/roadmap` but it produces ordered phases, not a DAG of independently-grabbable issues. A DAG enables parallelization and gives the agent freedom to pick the next best task.

3. **"Don't over-index on the spec" as a posture** — not "delete the PRD" but treat it as a serialization of alignment, not a contract. The grilling session is the real work; the spec just persists it across context boundaries.

**What I'd skip:**

- Fully autonomous AFK loops as default. Keep it opt-in for mature, well-tested codebases.
- Deleting specs post-implementation. Doc rot is real, but the fix is marking them stale or archiving, not deletion.
- The "improve code base architecture" skill. It's good general advice but it's a refactoring concern, not a planning workflow concern. We already have `/quality-sweep` for that.

**Net:** a small pack with 2-3 skills — a grill-me alignment phase and a vertical-slice issue splitter — attributed to Pocock, positioned as an alternative on-ramp to our existing spec-interview → roadmap pipeline. Not a replacement, a lighter-weight front door.

## User _00:37:32_

I mostly agree, with two adjustments.

  The strongest part of the feedback is this distinction:

  spec-interview optimizes for decision-complete documents.
  Pocock’s grilling optimizes for operator-agent calibration.

  Those are related, but not the same thing. Our current assumptions manifest is good, but it is still document-oriented: surface assumptions, resolve ambiguity, produce canonical sections. A
  grill loop should be allowed to be annoyingly Socratic and taste-seeking: “would you rather this feel like X or Y?”, “what would make this wrong even if it passes tests?”, “what kind of solution
  would annoy you?” That is a real gap.

  I also agree with the critique of his PRD posture. “LLMs forget” plus “the PRD is disposable” only works if the human carries the continuity and the session stays short enough. In our workflow,
  agents hand off across contexts, tools, commits, packs, and sometimes different projects. We need serialized alignment. The better framing is exactly what you wrote: the spec is not the
  contract; it is the checkpointed alignment state.

  Where I’d soften the feedback: I don’t think his “don’t read the PRD” is meant literally as a universal rule. I read it as “don’t worship the PRD once alignment exists.” For our purposes, we
  should preserve the destination doc, but teach downstream agents to read it as historical intent plus risks, then verify against code.

  I also agree the Ralph loop is not universal. Mature, tested, modular codebases can tolerate more AFK work. UI, product taste, ambiguous architecture, and multi-dev repos need tighter human
  review. Our conservative step gates are not just bureaucracy; they are drift control.

  For the pack, I’d make it a small alternative on-ramp, not a replacement:

  - grill-me or alignment-loop: one question at a time, recommended answer included, continue until shared understanding and taste are clear.
  - destination-doc: serialize the alignment into a concise intent/state document with explicit “not a contract; verify against code” language.
  - vertical-slice-splitter: turn the destination into independently grabbable issue cards/DAG slices with dependencies, QA gates, and AFK eligibility labels.

  I would skip deleting specs. Archive, mark stale, or close them. I’d also skip architecture-refactor as part of this pack; that belongs in quality/code-health workflows.

  Net: yes, this is the right direction. The pack should be “inspired by Matt Pocock,” but adapted to our core constraint: multi-session, multi-agent continuity requires durable alignment
  artifacts, even if we stop treating them as sacred specs. Feel free to disagree with this, what do you think about this recommendation?

## Assistant _00:37:41_

I agree with all of it. No disagreements.

The framing is precise: "checkpointed alignment state" is the right mental model for the destination doc, and "annoyingly Socratic and taste-seeking" is exactly the gap that a grill-me skill fills that spec-interview doesn't. The three-skill scope is tight and complementary without overlapping existing pack territory.

One small thing I'd add to the grill-me skill design: it should explicitly include "recommended answer" on every question (as Pocock does). This is what makes it fast for the human — you're confirming or correcting, not generating from scratch. It also reveals the agent's current calibration in real-time, so you can see drift as it happens.

Want me to build the pack now?

## User _00:38:17_

ok create a plan to create the new alternative on-ramp pack

## Assistant _00:38:22_

I'll explore the existing pack structure to understand conventions, then design the new pack.

## Assistant _00:38:29_

<details><summary>Tool calls</summary>

- Agent: Explore pack structure conventions

</details>

## Assistant _00:38:34_

<details><summary>Tool calls</summary>

- Agent: Explore spec-interview and grill patterns

</details>

## Assistant _00:40:01_

Good. Now I have a clear picture of conventions and the gap. Let me design the pack with a Plan agent.

## Assistant _00:40:30_

<details><summary>Tool calls</summary>

- Agent: Design alignment-loop pack

</details>

## Assistant _00:43:52_

I have all the design details. Let me verify one thing about the pack installer to make sure this pack will integrate cleanly.

## Assistant _00:43:54_

<details><summary>Tool calls</summary>

- Bash: Check if pack.sh needs awareness of new pack name

</details>

## Assistant _00:43:58_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/pack.sh`

</details>

## Assistant _00:44:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/pack.sh`

</details>

## Assistant _00:44:08_

Good — the `normalize_pack()` function has a wildcard fallback (`*) echo "$pack" ;;`) so `alignment-loop` will pass through without needing a special alias. And `project_type_for_pack()` returning failure (1) for unknown packs just means it won't force a project type — which is correct since this pack is project-type-agnostic.

Now I'll write the plan file.

## Assistant _00:44:39_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/fizzy-dazzling-hammock.md`

</details>

## Assistant _00:44:43_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _00:44:49_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _00:45:05_

[Request interrupted by user for tool use]
