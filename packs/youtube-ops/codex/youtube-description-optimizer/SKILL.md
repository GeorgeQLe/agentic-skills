---
name: youtube-description-optimizer
description: Audit, draft, or template YouTube descriptions and metadata for promise-match, search clarity, CTA hierarchy, links, chapters, hashtags, and upload readiness
type: research
version: v0.0
argument-hint: "<video URL | video ID | script/outline path | channel slug> [--mode audit|draft|template] [--series <name>] [--compare-channel <slug>]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Description Optimizer

Invoke as `$youtube-description-optimizer`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Optimize YouTube descriptions and adjacent metadata for existing videos, future uploads, and repeatable series templates. This is the description/metadata lane; use `$youtube-video-audit` for full single-video performance diagnosis and `$youtube-title-thumbnail-audit` for title/thumbnail packaging.

## Inputs

- Required target: video URL, video ID, script/outline path, channel slug, or existing creator-media artifact.
- Optional `--mode audit|draft|template`: default `audit` for video targets, `draft` for script/outline targets, and `template` for channel/series targets.
- Optional `--series <name>`: names the repeatable show or format for template work.
- Optional `--compare-channel <slug>`: reuse channel evidence under `research/youtube/data/<slug>/`.

## Workflow

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/youtube-description-optimizer-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/youtube-description-optimizer-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-portfolio` for existing-video cleanup, `$video-script` from the `remotion` pack for future-video draft work that exposes script gaps, and `$series-spec` for template work that exposes missing series rules.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-concept-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on video cleanup vs future programming, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.
