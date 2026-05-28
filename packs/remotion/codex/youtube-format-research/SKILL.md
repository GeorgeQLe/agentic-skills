---
name: youtube-format-research
description: Break down a YouTube video's format, visual system, pacing, editing grammar, motion, audio, and Remotion-ready production patterns
type: research
version: v0.1
argument-hint: "<video URL or ID> [--target remotion|script|style-guide] [--compare <video URL or ID...>]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Format Research

Invoke as `$youtube-format-research`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Analyze how a reference YouTube video is constructed so its format, design language, pacing, and production grammar can be adapted. This is the production-pattern lane; use `$youtube-vid-research` for general comprehension, `$youtube-competitive-research` for performance lessons, and `$video-build` when an approved script is ready for Remotion implementation.

## Inputs

- Required: one YouTube video URL or video ID.
- Optional `--target remotion|script|style-guide`: default `remotion`.
- Optional `--compare <video URL or ID...>`: additional references to distinguish repeatable format rules from one-off choices.

## Workflow

1. Resolve all video targets into video IDs from watch URLs, Shorts URLs, youtu.be URLs, embed URLs, or raw 11-character IDs.
2. Require `yt-dlp` for public metadata:

   ```bash
   command -v yt-dlp
   ```

3. Select a transcript Python interpreter. Prefer a workspace-local `.venv`; create it if missing. Install `youtube-transcript-api` into `.venv` only when the import check fails and network access is available.
4. Persist raw evidence under `research/youtube/data/<video-id>/`:
   - `metadata-YYYY-MM-DD.json`: raw `yt-dlp --dump-json "VIDEO_URL"` output.
   - `transcript/<video-id>.json`: raw transcript JSON when available.
   - `transcript/transcript-summary.json`: transcript text or failure reason.
5. Inspect available metadata, transcript, chapters, thumbnail URLs, description, and any user-provided screenshots or notes. If visual details cannot be verified from available evidence, mark them as gaps instead of guessing.
6. Analyze:
   - Scene grammar: opener, recurring segments, transitions, title cards, examples, proof moments, CTA, outro.
   - Timing and pacing: section durations, speaking density, cut rhythm, beats, visual resets, and retention support.
   - Visual system: typography, color, layout, framing, captions, lower thirds, callouts, charts, browser frames, code blocks, or product shots.
   - Motion language: camera moves, zooms, wipes, kinetic text, object movement, reveal timing, and transition rules.
   - Audio language: music bed, silence, sound effects, emphasis beats, voiceover style, and mix notes when evidence supports them.
   - Production assets: required footage, screenshots, diagrams, logos, fonts, icons, stock, B-roll, music, SFX, and licensing checks.
7. Translate the reference into reusable format rules without copying copyrighted assets or pretending the exact source project is available.

## Output

Create the `research/youtube/` directory if it does not exist.

Write:

```text
research/youtube/format-research-<video-id>-YYYY-MM-DD.md
```

Use this structure:

```markdown
# YouTube Format Research - [Title]

> Video: [URL]
> Target: remotion / script / style-guide
> Date captured: YYYY-MM-DD
> Evidence: [raw paths used]

## Evidence Coverage

| Evidence | Status | Path or gap |
|---|---|---|
| Public metadata | Available / Missing | ... |
| Transcript | Available / Missing | ... |
| Chapters | Available / Missing | ... |
| Visual references | Available / Missing | ... |
| Audio references | Available / Missing | ... |

## Format Summary

[The repeatable format in one concise brief.]

## Scene And Timing Map

| Segment | Approx time | Purpose | Visual treatment | Audio / motion notes |
|---|---:|---|---|---|
| ... | ... | ... | ... | ... |

## Visual And Motion System

- **Typography**: ...
- **Color and layout**: ...
- **Captions / callouts**: ...
- **Transitions**: ...
- **Recurring components**: ...

## Production Grammar

[Rules for pacing, proof, examples, visual resets, CTA placement, and when to change scenes.]

## Remotion Handoff

| Component / asset | Role | Inputs | Notes |
|---|---|---|---|
| ... | ... | ... | ... |

## Adaptation Guidance

[What to copy as a pattern, what to avoid copying directly, and what to change for the user's brand or series.]

## Evidence Gaps And Human Checks

[Missing screenshots, unavailable fonts, uncertain audio details, licensing checks, or manual review needs.]
```

## Constraints

- Do not copy or embed copyrighted assets, music, fonts, footage, or thumbnails unless the user confirms licensing.
- Do not invent visual details that are not evident from metadata, transcript, screenshots, or user-provided notes.
- Distinguish repeatable format rules from one-off creative choices.
- Keep Remotion handoff at the component/spec level; actual scaffold and render planning belongs to `$video-build`.
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/youtube-format-research-{topic}.html`.

