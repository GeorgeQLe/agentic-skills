---
name: youtube-concept-research
description: Research a proposed YouTube video concept against successful direct and adjacent content, then extract evidence-backed lessons, concept variants, packaging directions, and differentiated execution guidance
type: research
version: 1.0.0
argument-hint: "\"<video concept>\" [--channel <slug>] [--comparables N] [--angle search|browse|packaging|retention|format|all]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Concept Research

Invoke as `/youtube-concept-research`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Research a proposed YouTube video concept before scripting or production. Start from the user's idea, find successful direct and adjacent videos, explain what likely worked from public evidence, and translate the lessons into differentiated concept directions. Use `/youtube-competitive-research` when the user already has specific reference videos and wants to know why they worked. Use `/youtube-search-positioning` when the task is only keyword/search opportunity research.

## Inputs

- Required: a video concept, rough title, thesis, audience question, or topic idea.
- Optional `--channel <slug>`: compare the concept against existing channel evidence under `research/youtube/data/<slug>/` and strategy artifacts such as channel audit, portfolio, peer benchmark, positioning, or programming.
- Optional `--comparables N`: target number of comparable videos to inspect. Default 8, max 20.
- Optional `--angle search|browse|packaging|retention|format|all`: default `all`.

## Workflow

1. Parse the concept into:
   - audience job: problem, desire, identity, fear, curiosity, or aspiration served.
   - content promise: what the viewer expects to learn, feel, decide, or see resolved.
   - likely discovery mode: search, browse/home, suggested, Shorts, or community/fandom.
   - adjacent spaces: same topic, same audience job, same format, and counter-positioned angles.
   - constraints: creator fit, product/brand fit, production feasibility, and claims needing external verification.
2. Build a query set. Include direct topic queries, problem/search-intent queries, browse-curiosity phrasings, adjacent-category analogs, and same-format/different-niche examples.
3. Find public comparable videos through YouTube search, available local tooling, or supplied URLs. Include:
   - direct comparables on the same topic.
   - audience-job comparables serving the same viewer need.
   - format comparables with a transferable structure.
   - counter-position comparables that prove a different angle can work.
4. Require `yt-dlp` for public metadata when video URLs are selected:

   ```bash
   command -v yt-dlp
   ```

5. Select a transcript Python interpreter. Prefer a workspace-local `.venv`; create it if missing. Install `youtube-transcript-api` into `.venv` only when the import check fails and network access is available.
6. Persist raw evidence under `research/youtube/data/<video-id>/`:
   - `metadata-YYYY-MM-DD.json`: raw `yt-dlp --dump-json "VIDEO_URL"` output.
   - `transcript/<video-id>.json`: raw transcript JSON when available.
   - `transcript/transcript-summary.json`: transcript text or failure reason.
   - `api/comment-threads-YYYY-MM-DD.json`: optional public comments when an already-authorized API path is available.
7. Score each comparable for usefulness, not just raw popularity:
   - views/day or recent momentum.
   - apparent outlier status relative to the channel when public channel evidence is available.
   - title/thumbnail promise clarity.
   - transcript/structure evidence availability.
   - audience overlap with the concept.
   - discovery-mode fit.
   - production feasibility for the user's channel.
8. Analyze market lessons:
   - Packaging: title pattern, thumbnail promise, specificity, stakes, novelty, expectation match, and avoidable clickbait.
   - Search/browse fit: whether the concept should lean toward query satisfaction, curiosity, identity, trend, story, or suggested-video adjacency.
   - Hook and retention: first 30-60 seconds, setup length, proof, tension loops, examples, pattern changes, payoff, and CTA.
   - Format: essay, tutorial, teardown, case study, build-in-public, experiment, challenge, reaction, documentary, interview, Shorts, or hybrid.
   - Audience signal: comment themes only when comments were captured; separate praise, objections, confusion, requests, and noise.
9. Produce 3-5 concept variants. At minimum include the best search-led, browse-led, and differentiated/counter-positioned variants when evidence supports them.
10. Recommend one primary direction and explain what to adapt, avoid, or counter-position. If the evidence is weak, recommend the minimum follow-up research rather than over-committing.

## Output

Write:

```text
research/youtube/concept-research-<slug>-YYYY-MM-DD.md
```

Use this structure:

```markdown
# YouTube Concept Research - [Concept]

> Concept: [user concept]
> Channel: [slug or not provided]
> Date captured: YYYY-MM-DD
> Evidence: [raw paths and search notes used]
> Angle: search / browse / packaging / retention / format / all

## Evidence Coverage

| Comparable | Type | Metadata | Transcript | Comments | Notes |
|---|---|---|---|---|---|
| [Title](URL) | Direct / audience-job / format / counter-position | Available / Missing | Available / Missing | Available / Missing / Not requested | ... |

## Concept Brief

[Audience job, promise, likely discovery mode, constraints, and claims needing verification.]

## Search And Discovery Map

| Query / surface | Intent | Evidence | Opportunity | Caveat |
|---|---|---|---|---|
| ... | Search / browse / suggested / Shorts / community | ... | ... | ... |

## Comparable Performance Snapshot

| Video | Published | Duration | Views | Likes | Comments | Views/day | Comparable value |
|---|---|---:|---:|---:|---:|---:|---|
| ... | ... | ... | ... | ... | ... | ... | Direct / audience-job / format / counter-position |

## Why These Videos Likely Worked

1. [Hypothesis] - [public evidence]
2. [Hypothesis] - [public evidence]
3. [Hypothesis] - [public evidence]

## Audience Jobs And Market Pattern

[What viewers repeatedly respond to, what category promises are common, and what gaps remain.]

## Packaging Lessons

- **Title patterns**: ...
- **Thumbnail promises**: ...
- **Specificity and stakes**: ...
- **Expectation match risks**: ...

## Hook, Structure, And Retention Lessons

- **Opening 30-60 seconds**: ...
- **Proof and examples**: ...
- **Tension / payoff**: ...
- **CTA / ending**: ...

## Concept Variants

| Variant | Discovery mode | Core promise | Evidence | Risk | Recommendation |
|---|---|---|---|---|---|
| ... | Search / browse / suggested / Shorts / community | ... | ... | ... | ... |

## Recommended Direction

[Primary concept direction, why it is strongest, what to adapt, what to avoid, and how to differentiate.]

## Title And Thumbnail Territories

| Territory | Example title pattern | Thumbnail direction | Evidence | Risk |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Draft Video Architecture

[High-level outline only: hook, setup, proof/examples, turn, payoff, CTA. Do not write a full script unless explicitly asked.]

## Risks Of Copying

[What would be derivative, off-brand, unsupported by evidence, or risky to imitate.]

## Open Questions And Evidence Gaps

[Missing transcript, missing comments, uncertain search demand, absent owner analytics, private metrics unavailable, or factual claims needing independent verification.]
```

## Constraints

- Separate observed public evidence from performance hypotheses and recommendations.
- Do not treat public views as proof of CTR, retention, satisfaction, revenue, subscriber conversion, or profitability.
- Do not infer private YouTube Studio metrics unless the user provides them.
- Do not optimize only for clicks; evaluate title/thumbnail promise against likely watch-time and expectation match.
- Do not invent metrics, transcripts, comments, thumbnail details, rankings, or distribution causes.
- Do not recommend copying another creator's title, thumbnail, hook, format identity, or brand. Translate lessons into differentiated execution.
- Date every search/ranking observation and state personalization, geography, and account caveats.
- When the concept relies on factual, legal, medical, financial, political, or current-event claims, recommend independent source verification outside YouTube.
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

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/youtube-search-positioning` when the selected direction is search-led; `/youtube-format-research` from the `remotion` pack when the winning lesson is structure, editing, pacing, or visual format; `/content-programming` when the concept changes channel strategy or topic pillars; `/video-script` when the concept direction is ready for scripting.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, recommend `/creator-positioning` when differentiation is unresolved, `/content-programming` when the issue is future topics, or `/youtube-competitive-research` when the user selected specific competitor videos for deeper analysis.
