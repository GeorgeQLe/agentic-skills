---
name: youtube-competitive-research
description: Analyze why an external YouTube video performed well and extract evidence-backed competitive lessons, positioning gaps, and adaptation opportunities
type: research
version: v0.0
argument-hint: "<video URL or ID...> [--primary-channel <slug>] [--comments N] [--angle packaging|topic|retention|positioning]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Competitive Research

Invoke as `$youtube-competitive-research`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

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

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/youtube-competitive-research-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/youtube-competitive-research-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$content-programming` when the competitive lesson should shape what to make next; `$youtube-search-positioning` when the lesson is mainly search/topic demand; `$youtube-peer-benchmark` when the user needs channel-level comparison beyond one video.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-concept-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, recommend `$creator-positioning` when the issue is differentiation or `$content-programming` when the issue is future topics, and explain the missing artifact.
