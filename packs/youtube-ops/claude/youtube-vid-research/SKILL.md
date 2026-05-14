---
name: youtube-vid-research
description: Research one or more external YouTube videos for context, claims, structure, examples, terminology, and transferable takeaways
type: research
version: 1.0.0
argument-hint: "<video URL or ID...> [--focus context|claims|summary|references] [--compare-channel <slug>]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Video Research

Invoke as `/youtube-vid-research`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Research external YouTube videos so the agent can understand what the user is referring to and reuse that context in specs, strategy, writing, product work, or implementation. This is the general comprehension lane; use `/youtube-video-audit` for performance diagnosis, `/youtube-competitive-research` for why a competitor video worked, and the `remotion` pack's `/youtube-format-research` for production/style breakdowns.

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

Default recommendation: `/youtube-format-research` from the `remotion` pack when the user wants to reuse the video's structure, style, edit, or design; `/youtube-competitive-research` when the user asks why the video performed well or what can be learned from a specific competitor; `/youtube-concept-research` when the reference should inform a proposed new video concept; otherwise `/content-programming` when the research should inform future topics.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on research vs production strategy, recommend `/content-programming` and explain the missing artifact.
