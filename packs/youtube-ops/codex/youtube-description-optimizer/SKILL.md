---
name: youtube-description-optimizer
description: Audit, draft, or template YouTube descriptions and metadata for promise-match, search clarity, CTA hierarchy, links, chapters, hashtags, and upload readiness
type: research
version: v0.7
required_conventions: [afps-2.0]
argument-hint: "<video URL | video ID | script/outline path | channel slug> [--mode audit|draft|template] [--series <name>] [--compare-channel <slug>]"
context_intake: artifact_only
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# YouTube Description Optimizer

Invoke as `$youtube-description-optimizer`.

## AFPS 2.0 Description Slice

Follow `docs/afps-2.0-convention.md` in source checkouts or `.agents/skillpacks/docs/afps-2.0-convention.md` in installed projects. Resolve the target and mode, reuse available launch evidence, draft or audit the description, and write the reversible canonical artifact without a scope gate, working packet, review page, or final-artifact gate.

Make the promise-match hypothesis, upload-ready text, evidence-based evaluation, recommendation, confidence, and next safe move inspectable in the artifact and handoff. Consume any packaging choice already recorded by `$youtube-video-prelaunch-audit`; description work does not add another launch checkpoint. Missing links, disclosure facts, transcript evidence, or a resolvable target are explicit input gaps, not reasons to ask for routine approval.

Changing YouTube Studio metadata, uploading text, selecting public visibility, scheduling, or making any account-authenticated change is a permission stop. This skill produces local upload-ready content only unless the user separately authorizes an enabled external-action path.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Inputs

- Required target: video URL, video ID, script/outline path, channel slug, or existing creator-media artifact.
- Optional `--mode audit|draft|template`: default `audit` for video targets, `draft` for script/outline targets, and `template` for channel/series targets.
- Optional `--series <name>`: names the repeatable show or format for template work.
- Optional `--compare-channel <slug>`: reuse channel evidence under `research/youtube/data/<slug>/`.

## Process

1. Resolve the target and mode. If the target is ambiguous, infer from file existence and URL/video-ID shape before asking the user.
2. Prefer existing evidence:
   - `research/youtube/data/<video-id>/metadata-*.json`
   - `research/youtube/data/<slug>/videos-*.jsonl`
   - `research/youtube/video-audit-*.md`
   - `research/youtube/title-thumbnail-audit-*.md`
   - `research/youtube/channel-audit-*.md`
   - `specs/youtube/series-*.md`
   - script or outline files supplied by the user
3. For existing videos, use public metadata descriptions, tags, chapters, title, URL, upload date, and available transcript/opening evidence. If public metadata is missing and the target is a video URL or ID, fetch it through `yt-dlp --dump-json "VIDEO_URL"` and persist it under `research/youtube/data/<video-id>/metadata-YYYY-MM-DD.json`.
4. For future drafts, use the supplied script/outline plus any creator-positioning, content-programming, series, product-led media, and search-positioning artifacts that are current.
5. For templates, use channel/series evidence to define reusable blocks, required links, optional links, CTA hierarchy, chapter style, hashtag policy, sponsor/disclosure slots, and update rules.
6. Analyze:
   - First 2 lines and above-the-fold promise support.
   - Search/topic clarity, entity names, reusable keywords, and avoidable keyword stuffing.
   - Match between title, thumbnail promise, intro/hook, chapters, and description.
   - CTA hierarchy, link order, stale or missing links, sponsor/disclosure language, attribution/credits, pinned-comment fit, and hashtag discipline.
   - Whether the description supports acquisition, trust-building, proof, education, launch support, community, or conversion.
7. Produce practical edits: keep/change/add/remove notes, rewritten description blocks, pinned-comment recommendation when useful, and a future-video checklist.

## Output

Create the `research/youtube/`, `research/youtube/data/<video-id>/`, and `specs/youtube/` directories if they do not exist.

Write exactly one artifact:

- Audit mode: `research/youtube/description-optimizer-<video-id>-YYYY-MM-DD.md`
- Draft mode: `research/youtube/description-draft-<slug>-YYYY-MM-DD.md`
- Template mode: `specs/youtube/description-template-<slug>.md`

Use this structure:

```markdown
# YouTube Description Optimizer - [Target]

> Mode: audit / draft / template
> Target: [URL, video ID, file path, channel slug, or series]
> Date: YYYY-MM-DD
> Evidence: [paths used]

## Evidence Coverage

| Evidence | Status | Path or gap |
|---|---|---|
| Public metadata | Available / Missing / Not applicable | ... |
| Transcript or opening | Available / Missing / Not applicable | ... |
| Channel evidence | Available / Missing / Not applicable | ... |
| Script or outline | Available / Missing / Not applicable | ... |
| Series template | Available / Missing / Not applicable | ... |

## Description Diagnosis

- **First 2 lines**: ...
- **Promise match**: ...
- **Search/topic clarity**: ...
- **CTA/link hierarchy**: ...
- **Chapters/hashtags/disclosures**: ...
- **Pinned-comment fit**: ...

## Recommended Description

[Upload-ready description or revised description block.]

## Metadata Notes

- **Tags/keywords**: ...
- **Chapters**: ...
- **Hashtags**: ...
- **Links and credits**: ...
- **Disclosure/sponsor slots**: ...

## Keep / Change / Add / Remove

| Action | Item | Why | Evidence |
|---|---|---|---|
| Keep / Change / Add / Remove | ... | ... | ... |

## Future Checklist

[Reusable checks for the next upload or this series.]
```

## Constraints

- Do not invent links, product URLs, sponsors, disclosures, chapters, transcript details, comments, or owner-only metrics.
- Mark missing evidence explicitly instead of filling gaps.
- Do not recommend deceptive metadata, keyword stuffing, tag spam, misleading hashtags, or CTAs that conflict with the video's promise.
- Keep description changes practical for the creator's apparent production capacity.
- Archive existing canonical artifacts before replacing them under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Artifact Handoff

After a synthesized write or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while intended artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.

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

Follow the shared shipping contract convention in CLAUDE.md.
