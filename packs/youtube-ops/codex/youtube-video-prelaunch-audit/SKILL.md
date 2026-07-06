---
name: youtube-video-prelaunch-audit
description: Audit unlisted or pre-release YouTube videos before public launch for edit readiness, polish, YouTube Test and Compare title/thumbnail launch sets, description, chapters, publish settings, launch timing, URL record capture, and social cross-sharing strategy
type: research
version: v0.5
required_conventions: [alignment-page, briefing-slides]
argument-hint: "<unlisted video URL or ID> [--script <path>] [--thumbnail <path-or-url>] [--launch-date YYYY-MM-DD] [--social <platforms>] [--compare-channel <slug>]"
context_intake: artifact_only
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# YouTube Video Prelaunch Audit

Invoke as `$youtube-video-prelaunch-audit`.

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Scope discovery and approval.** Inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions. Build the `review` HTML alignment page before synthesized research. The page must render the proposed scope, available source categories, known context, assumptions/confidence, proposed working-packet and canonical output paths, and research-scope approval gates. Stop for final compiled YAML approval of the research scope. Do not perform synthesized research, rank candidates, make recommendations, or write working packets, canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, perform the synthesized research, run required source/code checks, and write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet. Update the `review` HTML alignment page so it renders the complete working-packet substance as structured HTML review UI: purpose-built sections, tables, matrices, gates, cards, and tier-appropriate charts or diagrams that preserve every packet section, finding, caveat, and decision detail without summary loss. Raw Markdown packet text may appear only as a supplemental source view after the rendered review UI; do not make a `Full Preliminary Packet` or `Full Working Packet` raw Markdown dump, giant `<pre><code>` block, link-only view, or source-only view the primary review surface. Include the evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and artifact approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML for artifact approval only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Inputs

- Required: one unlisted or scheduled YouTube video URL or raw video ID.
- Optional `--script <path>`: local script, outline, shot list, or talking-points file.
- Optional `--thumbnail <path-or-url>`: thumbnail draft or current thumbnail URL.
- Optional `--launch-date YYYY-MM-DD`: planned public release date.
- Optional `--social <platforms>`: comma-separated social platforms to include in cross-sharing recommendations.
- Optional `--compare-channel <slug>`: reuse existing channel evidence under `research/youtube/data/<slug>/`.
- Optional owner-provided notes: draft title, description, chapters, pinned comment, target audience, sponsor/disclosure requirements, launch goals, and existing social copy.

## Process

### 1. Resolve Target and Access

1. Extract the video ID from a normal watch URL, Shorts URL, youtu.be URL, embed URL, or raw 11-character ID.
2. Derive known URL forms when possible: original URL, canonical watch URL, Shorts URL, embed URL, and youtu.be URL.
3. Before asking for channel, status, working-title, report-history, or prior-artifact context, check `research/youtube/data/video-url-index.jsonl` and `research/youtube/data/<video-id>/prelaunch/video-url-record.json`. Use existing values unless they are missing, stale, or conflicting.
4. Require `yt-dlp` for public or unlisted metadata:

   ```bash
   command -v yt-dlp
   ```

5. Fetch metadata with `yt-dlp --dump-json "VIDEO_URL"` when accessible. If the video requires login, private account access, or YouTube Studio access, stop and ask for a public/unlisted link, local video file, transcript, or manually exported metadata instead.
6. Check `availability`, `live_status`, upload date, scheduled time, and visibility cues. If the video is already public and the user asks why it performed a certain way, route to `$youtube-video-audit` instead.
7. Do not treat views, likes, or comments on an unlisted pre-release video as performance evidence; internal review traffic can distort them.

### 2. Maintain Video URL Record

Create or update these persistent URL ledger artifacts as soon as the video ID and original URL are known, then revise them after metadata, evidence, and report paths are known:

```text
research/youtube/data/<video-id>/prelaunch/video-url-record.json
research/youtube/data/video-url-index.jsonl
```

The per-video record and aggregate index line must include:

- `video_id`
- `original_url`
- `canonical_watch_url` using `https://www.youtube.com/watch?v=<video-id>`
- `url_forms`: known or derivable `watch`, `shorts`, `embed`, and `youtu_be` forms
- `channel`: known `id`, `url`, and `name`
- `status`: visibility, availability, live status, scheduled/public state, and launch date when known
- `working_title`
- `selected_or_preferred_launch_title` when known
- `report_path`
- `evidence_paths`
- `captured_at`
- `source_skill`: `youtube-video-prelaunch-audit`

Use `null` for unknown optional values instead of inventing them. Do not store credentials, cookies, private YouTube Studio-only fields, or unshared account details. For the JSONL index, update an existing line for the same `video_id` when practical; otherwise append a fresh valid JSON object for the capture. On future runs, read the index and per-video record before asking the user for context already captured, and ask only for missing or conflicting fields.

### 3. Persist Raw Evidence

Create:

```text
research/youtube/data/<video-id>/prelaunch/
```

Persist available evidence before analysis:

- `metadata-YYYY-MM-DD.json`: raw `yt-dlp --dump-json "VIDEO_URL"` output.
- `transcript/<video-id>.json`: raw transcript JSON when available.
- `transcript/transcript-summary.json`: transcript text or failure reason.
- `draft-inputs/`: copies or path references for script, outline, thumbnail, draft description, chapters, and social copy when the user supplies them.
- `media-review-notes-YYYY-MM-DD.md`: manual or tool-assisted media inspection notes when video, frame, audio, or screenshot review was possible.

Record evidence gaps explicitly. Missing transcript, thumbnail, frame review, audio review, current description, launch date, sponsor requirements, or target platforms are not failures, but they constrain confidence.

### 4. Inspect Content and Polish

Use the deepest available evidence:

- If transcript evidence exists, inspect the first 30-60 seconds, section transitions, examples, claims, CTA, and outro.
- If media inspection is available through a local file, accessible unlisted playback, screenshots, frame samples, or audio notes, review visual clarity, sound quality, editing continuity, on-screen text, pacing, dead air, b-roll, captions, end screen timing, and brand polish.
- If only metadata and transcript are available, limit edit/polish judgments to transcript-supported structure, hook, pacing inference, and missing media-evidence gaps.

Analyze:

- **Launch-readiness verdict**: publish now, publish after metadata polish, hold for targeted edit, or hold for significant edit.
- **Hook and expectation match**: whether the first minute pays off the title/thumbnail promise quickly.
- **Structure and pacing**: dead zones, redundant setup, missing chapter breaks, abrupt transitions, weak examples, or unclear payoff.
- **Production polish**: audio, visuals, captions, overlays, b-roll, continuity, end screen, cards, disclosure, and accessibility when evidence exists.
- **Risk and trust**: unsupported claims, stale references, missing source links, sponsor/disclosure gaps, privacy/confidentiality concerns, or accidental internal-only material.

### 5. Build the Launch Package

Audit and draft practical launch assets:

- Test And Compare Launch Set: exactly 3 simultaneous variants for YouTube Studio Test and Compare. Each variant must pair one upload-ready full title with one thumbnail concept or supplied-asset reference, plus a packaging hypothesis, intended audience signal, and what a win would imply. Frame them as a set to upload together, not as sequential manual swaps.
- Title: keep each title inside YouTube Studio's current title limit, using 100 characters as the upload-ready ceiling unless Studio shows a different limit. Avoid unsupported claims, bait-and-switch promises, and vague curiosity; preserve search/topic clarity and expectation match.
- Thumbnail: evaluate focal clarity, text density, promise match, visual differentiation, and required human review when no image evidence is available. If user-provided thumbnail assets exist, map them into the three variants; otherwise provide concrete thumbnail concepts or references only. Do not generate or claim final thumbnail files unless the user explicitly supplies or requests image assets.
- Test setup guidance: explain how to get the three variants online in YouTube Studio on desktop via the video's Details / Test and Compare flow, keeping variant labels and title/thumbnail pairing aligned with the report. If the account or video is ineligible for title/thumbnail combination testing, state the fallback: apply the preferred title, test the three thumbnail concepts/assets where eligible, and preserve the other title variants for manual follow-up.
- Description: first two lines, CTA hierarchy, link stack, credits, disclosures, hashtags, and pinned-comment fit.
- Chapters: proposed timestamped chapters from transcript or current metadata; if exact timestamps are unavailable, provide section labels and note the timestamp gap.
- Publish settings: scheduled time, premiere fit, playlist, cards, end screen, comments, captions, monetization, age/sponsor/disclosure checks, and whether to keep as unlisted for another review pass.
- Cross-sharing: platform-specific copy angles, cutdown/clip suggestions, launch-day sequence, first-24h comment plan, community post, newsletter/blog tie-in, and ethical limitations for Reddit/Hacker News or niche communities.

Do not invent links, sponsors, timestamp precision, platform accounts, or channel policies. Use placeholders where user-owned assets are missing.

### 6. Write Report

Create `research/youtube/`, the raw evidence directory, and the URL ledger paths if they do not exist.

Save the approved canonical artifact to:

```text
research/youtube/prelaunch-audit-<video-id>-YYYY-MM-DD.md
```

Use this structure:

```markdown
# YouTube Video Prelaunch Audit - [Working Title]

> Video: [URL]
> Video ID: [id]
> Channel: [channel]
> Visibility/status: unlisted / scheduled / unknown
> Planned launch: YYYY-MM-DD or not provided
> Date captured: YYYY-MM-DD
> URL record: research/youtube/data/<video-id>/prelaunch/video-url-record.json
> URL index: research/youtube/data/video-url-index.jsonl
> Public/unlisted metadata: research/youtube/data/<video-id>/prelaunch/metadata-YYYY-MM-DD.json
> Transcript: [path or unavailable reason]
> Media inspection: [path/notes or unavailable reason]

## Video URL Record

| Field | Value |
|---|---|
| Record path | research/youtube/data/<video-id>/prelaunch/video-url-record.json |
| Index path | research/youtube/data/video-url-index.jsonl |
| Original URL | ... |
| Canonical watch URL | https://www.youtube.com/watch?v=<video-id> |
| Known alternate forms | Shorts: ... / embed: ... / youtu.be: ... |
| Channel/status/title fields updated | ... |

## Evidence Coverage

| Evidence | Status | Path or gap |
|---|---|---|
| Metadata | Available / Missing | ... |
| Transcript | Available / Missing | ... |
| Media inspection | Available / Missing | ... |
| Thumbnail | Available / Missing | ... |
| Draft title/description/chapters | Available / Missing | ... |
| Launch date/social platforms | Available / Missing | ... |

## Launch Readiness Verdict

- **Verdict**: Publish now / metadata polish / targeted edit / significant edit
- **Confidence**: High / Medium / Low
- **Blocking issues**: ...
- **Minimum viable launch fix**: ...

## Edit And Polish Notes

- **Hook**: ...
- **Structure/pacing**: ...
- **Production polish**: ...
- **Trust/risk/accessibility**: ...
- **Keep**: ...
- **Change before launch**: ...

## Test And Compare Launch Set

Provide exactly three simultaneous variants for YouTube Studio Test and Compare:

| Variant | Full title | Thumbnail concept or supplied-asset reference | Packaging hypothesis | Intended audience signal | If this wins, it implies |
|---|---|---|---|---|---|
| A | ... | ... | ... | ... | ... |
| B | ... | ... | ... | ... | ... |
| C | ... | ... | ... | ... | ... |

### Studio Setup Guidance

- Upload or enter variants A, B, and C together in YouTube Studio Test and Compare where the video/account is eligible.
- Keep title and thumbnail pair labels aligned with the table above.
- If title/thumbnail combination testing is unavailable, use the preferred title, test the three thumbnail variants where eligible, and preserve the other titles as follow-up options.
- Do not claim the variants have been uploaded unless the user confirms YouTube Studio setup.

## Description And Pinned Comment

[Upload-ready description guidance, CTA hierarchy, links/disclosures, pinned comment.]

## Chapters

[Timestamped chapters or section labels with timestamp gaps.]

## Publish Settings Checklist

| Setting | Recommendation | Evidence / reason |
|---|---|---|
| Schedule | ... | ... |
| Playlist | ... | ... |
| End screen/cards | ... | ... |
| Captions | ... | ... |
| Comments/pinned comment | ... | ... |
| Disclosures/age/monetization | ... | ... |

## Cross-Sharing Launch Plan

| Channel | Timing | Copy angle | Asset needed | Notes |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Decision Checklist

- [ ] Blocking edits resolved or accepted
- [ ] Three Test and Compare variants ready for Studio setup
- [ ] Preferred fallback title/thumbnail selected if Test and Compare is unavailable
- [ ] Description/pinned comment ready
- [ ] Chapters ready
- [ ] Launch schedule selected
- [ ] Social assets prepared

## Follow-Up Work

[Route only after artifact approval and handoff checks.]
```

### 7. Summarize In Thread

After saving an approved report, output the verdict, top blocking edit if any, highest-leverage metadata fix, the three Test and Compare title/thumbnail pairs, launch timing recommendation, cross-sharing headline, evidence gaps, report path, URL record path, URL index path, and raw data paths.

## Constraints

- Do not bypass login walls, bot protections, access controls, or YouTube Studio UI restrictions.
- Do not invent transcript quotes, timestamps, video visuals, audio quality, thumbnail details, links, sponsor/disclosure details, or social accounts.
- Do not claim YouTube Studio or API automation; provide upload-ready setup guidance only unless the user separately authorizes and enables an automation path.
- Do not generate, name, or claim final thumbnail image files unless user-provided assets exist or the user explicitly requests image generation.
- Do not use unlisted pre-release view/like/comment counts as audience-performance evidence.
- Separate current evidence, inference, and subjective polish judgment.
- Keep launch recommendations practical for the creator's visible production capacity and available time before launch.
- Route post-publication performance questions to `$youtube-video-audit`.
- Route broad channel strategy, portfolio, cadence, or metrics questions to the relevant youtube-ops or creator-foundation skill after the approved artifact is shipped.

## Approved Artifact Handoff

After an approved synthesized write, explicit write/update mode, or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- Include the URL record path and the three Test and Compare title/thumbnail pairs in the final response after the approved artifact write.
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

## Next-Step Routing

After writing the approved artifact and completing the artifact handoff checks, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-description-optimizer` when the main remaining work is description, chapters, pinned comment, metadata, or launch copy; `$youtube-title-thumbnail-audit` when title/thumbnail packaging needs a deeper channel or peer comparison; `$youtube-format-research` from the `remotion` pack when the video should be re-edited for pacing, format, visual rhythm, or production grammar; otherwise `$youtube-video-audit` after the video is public and enough time has passed to evaluate performance.

Before recommending `$youtube-format-research`, verify the `remotion` pack is enabled in `.agents/project.json.enabled_packs`. If it is missing, recommend `npx skillpacks install remotion` first.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/youtube-video-prelaunch-audit-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `$youtube-video-prelaunch-audit`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/youtube-video-prelaunch-audit-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
