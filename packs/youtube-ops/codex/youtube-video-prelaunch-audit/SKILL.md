---
name: youtube-video-prelaunch-audit
description: Audit unlisted or pre-release YouTube videos before public launch for edit readiness, polish, generation of three upload-ready YouTube Test and Compare title/thumbnail pairs, description, chapters, publish settings, launch timing, URL record capture, and social cross-sharing strategy
type: research
version: v0.6
required_conventions: [afps-2.0]
argument-hint: "<unlisted video URL or ID> [--script <path>] [--thumbnail <path-or-url>] [--thumbnail-asset <path-or-url>]... [--launch-date YYYY-MM-DD] [--social <platforms>] [--compare-channel <slug>]"
context_intake: artifact_only
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# YouTube Video Prelaunch Audit

Invoke as `$youtube-video-prelaunch-audit`.

## AFPS 2.0 Launch Slice

Follow `docs/afps-2.0-convention.md` in source checkouts or `.agents/skillpacks/docs/afps-2.0-convention.md` in installed projects. Resolve the target, collect available evidence, write reversible canonical records, inspect the video, draft the launch package, and generate all three real thumbnail variants without a scope gate or review page.

Make the slice inspectable through `hypothesis`, `artifact_or_behavior`, `visible_result`, `assertion_or_evaluation`, `recommendation`, `confidence`, and `next_safe_move`. Write the canonical report with the evidence-backed recommended variant before asking the user to choose.

Use one chat-first material checkpoint, `launch-packaging-selection`, only after all three title/thumbnail pairs exist and pass image/manifest validation. Show the three real pairs, evidence, recommendation, confidence, and at most three material decisions. A response may revise the canonical report or trigger a new immutable generation. Do not create an alignment/interrogation page or approval sidecar for this checkpoint.

The checkpoint does not authorize YouTube Studio upload, public visibility, scheduling, account-authenticated changes, or any other external action. Treat each as a permission stop with the exact action, target, and consequence. Treat a missing target, inaccessible required asset, login-only evidence, or unavailable image capability as an input/capability blocker.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Inputs

- Required: one unlisted or scheduled YouTube video URL or raw video ID.
- Optional `--script <path>`: local script, outline, shot list, or talking-points file.
- Optional repeatable `--thumbnail-asset <path-or-url>`: source image, existing thumbnail, brand asset, frame, screenshot, or directory whose contents may be used to generate the variants.
- Optional `--thumbnail <path-or-url>`: backward-compatible alias for one `--thumbnail-asset`.
- Optional explicitly identified attachments or natural-language references to specific local files, URLs, or directories: treat each as a pointed thumbnail-asset location.
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
- `draft-inputs/`: copies or path references for script, outline, thumbnail assets, draft description, chapters, and social copy when the user supplies them.
- `thumbnail-asset-accounting.json`: one record for every candidate discovered within a user-pointed asset location, including original pointer, resolved path or URL, inspection method, accessibility, media type/dimensions when known, `used` or `rejected` status, allocated variants when used, and a rejection reason when rejected.
- `media-review-notes-YYYY-MM-DD.md`: manual or tool-assisted media inspection notes when video, frame, audio, or screenshot review was possible.

For thumbnail assets, limit discovery to the exact files, URLs, attachments, and directories the user points to. Inspect every candidate in those locations; do not crawl parent directories, adjacent folders, unrelated repository assets, or linked websites. Incorporate every relevant usable candidate somewhere across the three variants. Record inaccessible, irrelevant, duplicate, unsafe, or unusable candidates as rejected with a concrete reason in the canonical report. A missing required asset is an input blocker, not a reason to silently omit it.

Record evidence gaps explicitly. Missing transcript, thumbnail assets, frame review, audio review, current description, launch date, sponsor requirements, or target platforms constrain confidence. Thumbnail assets may be absent when concepts are proposed, but the completed slice still requires actual image generation and three verified output files.

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

### 5. Build and Generate the Launch Package

Audit and draft practical launch assets:

- Test And Compare Launch Set: develop exactly 3 simultaneous variants for YouTube Studio Test and Compare. Each variant must pair one distinct upload-ready full title with one distinct thumbnail concept and explicit source-asset allocation, plus a packaging hypothesis, intended audience signal, and what a win would imply. Generate each concept as a real file while preserving the pairing and hypothesis.
- Title: keep each title inside YouTube Studio's current title limit, using 100 characters as the upload-ready ceiling unless Studio shows a different limit. Avoid unsupported claims, bait-and-switch promises, and vague curiosity; preserve search/topic clarity and expectation match.
- Thumbnail: evaluate focal clarity, text density, promise match, visual differentiation, and title/thumbnail expectation match. Use the source-asset allocations and an image-generation/editing capability to create exactly three real 1280x720 outputs. Do not complete successfully with concepts, source references, unreadable or disguised files, unsupported formats, files larger than the desktop Studio limit, or otherwise unverified files.
- Generation execution: create exactly three upload-ready 1280x720 thumbnail files. If no image-capable tool is available, a required asset cannot be accessed, or the capability cannot save and verify all three outputs, stop and request an image-capable session or corrected asset access. Do not substitute prose concepts, mock paths, or supplied source files for generated outputs. Save every attempt under a new immutable `research/youtube/data/<video-id>/prelaunch/test-and-compare/<generation-id>/` directory and write `variant-a`, `variant-b`, and `variant-c` image files plus `manifest.json`. Before the checkpoint, validate that exactly three variant image files exist, each decodes as 1280x720, each actual format detected from its contents or file signature is JPEG, PNG, or GIF, and each is no larger than `50_000_000` bytes. Do not trust the filename extension; reject unreadable files, extension/content mismatches, unsupported formats, and oversized outputs.
- Generation manifest: write `manifest.json` with `video_id`, `generation_id`, `created_at`, `status`, and exactly three `variants`. For each variant record `id`, full `title`, `image_path`, `source_assets`, `packaging_hypothesis`, `intended_audience_signal`, `win_implication`, numeric `dimensions` (`width: 1280`, `height: 720`), detected `format` normalized to `jpg`, `png`, or `gif`, and numeric `byte_size`. Include the complete source-asset accounting ledger or its path and generation provenance: capability/tool, model or engine when exposed, generation/edit mode, prompt or edit-instruction reference, relevant settings, and verification method. Mark `status` complete only after content-based image readback proves all three files, dimensions, supported formats, and `byte_size <= 50_000_000`; write the detected format and byte size to the manifest before changing the status to complete or presenting the checkpoint.
- Generation identity: use a collision-resistant timestamp or equivalent unique `<generation-id>`. Never overwrite, rename away, or delete a prior generation when revising candidates.
- Candidate comparison: expose each actual image through a resolvable repository-relative path with meaningful alternative text. Show each image with its full paired title, variant ID, source assets, hypothesis, and openable path. Treat broken images, missing fields, or a concept-only entry as incomplete output.
- Test setup guidance: explain how to get the three variants online in YouTube Studio on desktop via the video's Details / Test and Compare flow, keeping variant labels and title/thumbnail pairing aligned with the report. If the account or video is ineligible for title/thumbnail combination testing, state the fallback: apply the preferred title, test the three generated thumbnail files where eligible, and preserve the other title variants for manual follow-up.
- Description: first two lines, CTA hierarchy, link stack, credits, disclosures, hashtags, and pinned-comment fit.
- Chapters: proposed timestamped chapters from transcript or current metadata; if exact timestamps are unavailable, provide section labels and note the timestamp gap.
- Publish settings: scheduled time, premiere fit, playlist, cards, end screen, comments, captions, monetization, age/sponsor/disclosure checks, and whether to keep as unlisted for another review pass.
- Cross-sharing: platform-specific copy angles, cutdown/clip suggestions, launch-day sequence, first-24h comment plan, community post, newsletter/blog tie-in, and ethical limitations for Reddit/Hacker News or niche communities.

Do not invent links, sponsors, timestamp precision, platform accounts, or channel policies. Use placeholders where user-owned assets are missing.

### 6. Write Report

Create `research/youtube/`, the raw evidence directory, and the URL ledger paths if they do not exist.

Save the reversible canonical artifact to:

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
> Generation: research/youtube/data/<video-id>/prelaunch/test-and-compare/<generation-id>/manifest.json

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
| Thumbnail source assets | Available / Missing | thumbnail-asset-accounting.json or gap |
| Generated Test and Compare set | Available | test-and-compare/<generation-id>/manifest.json |
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

| Variant | Full title | Generated thumbnail file | Source assets | Packaging hypothesis | Intended audience signal | If this wins, it implies |
|---|---|---|---|---|---|---|
| A | ... | test-and-compare/<generation-id>/variant-a.<ext> | ... | ... | ... | ... |
| B | ... | test-and-compare/<generation-id>/variant-b.<ext> | ... | ... | ... | ... |
| C | ... | test-and-compare/<generation-id>/variant-c.<ext> | ... | ... | ... | ... |

Generation manifest: `research/youtube/data/<video-id>/prelaunch/test-and-compare/<generation-id>/manifest.json`

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
- [ ] Exactly three generated thumbnail files decode as 1280x720 JPG/PNG/GIF images no larger than 50 MB each
- [ ] Material packaging checkpoint response recorded, or explicitly still pending
- [ ] Generation manifest and source-asset accounting are complete
- [ ] Preferred fallback title/thumbnail selected if Test and Compare is unavailable
- [ ] Description/pinned comment ready
- [ ] Chapters ready
- [ ] Launch schedule selected
- [ ] Social assets prepared

## Follow-Up Work

[Route from the current goal, evidence gaps, and permission boundaries.]
```

### 7. Summarize In Thread

After saving the report, output the verdict, top blocking edit if any, highest-leverage metadata fix, the three Test and Compare title/thumbnail pairs with their real image paths, the generation manifest path, launch timing recommendation, cross-sharing headline, evidence gaps, report path, URL record path, URL index path, and raw data paths.

## Constraints

- Do not bypass login walls, bot protections, access controls, or YouTube Studio UI restrictions.
- Do not invent transcript quotes, timestamps, video visuals, audio quality, thumbnail details, links, sponsor/disclosure details, or social accounts.
- Generate the three thumbnail files during the launch slice; image generation is mandatory even when no source assets were supplied. Never fabricate image paths, dimensions, asset use, or generation provenance.
- Treat `50_000_000` bytes as the maximum per-file size for this manual desktop YouTube Studio workflow. Do not substitute the separate mobile/API limit, infer format from an extension, or mark a generation complete without manifest-backed format and byte-size readback.
- Do not claim YouTube Studio or API upload/configuration automation. The skill produces upload-ready files and manual setup guidance only unless the user separately authorizes and enables an automation path.
- Do not broaden asset discovery beyond user-pointed locations or omit a pointed candidate from the used/rejected accounting ledger.
- Do not ask the material packaging question until the actual three image/title pairs pass validation.
- Do not use unlisted pre-release view/like/comment counts as audience-performance evidence.
- Separate current evidence, inference, and subjective polish judgment.
- Keep launch recommendations practical for the creator's visible production capacity and available time before launch.
- Route post-publication performance questions to `$youtube-video-audit`.
- Route broad channel strategy, portfolio, cadence, or metrics questions to the relevant youtube-ops or creator-foundation skill after the artifact is shipped.

## Artifact Handoff

After a synthesized write or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- Include the URL record path, generation manifest path, and all three Test and Compare title/thumbnail pairs with real thumbnail file paths in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while intended artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.
- If stopped at the packaging checkpoint, keep the checkpoint response as the next action and do not imply that an external Studio action is authorized.

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

After writing the artifact and completing the handoff checks, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$youtube-description-optimizer` when the main remaining work is description, chapters, pinned comment, metadata, or launch copy; `$youtube-title-thumbnail-audit` when title/thumbnail packaging needs a deeper channel or peer comparison; `$youtube-format-research` from the `remotion` pack when the video should be re-edited for pacing, format, visual rhythm, or production grammar; otherwise `$youtube-video-audit` after the video is public and enough time has passed to evaluate performance.

Before recommending `$youtube-format-research`, verify the `remotion` pack is enabled in `.agents/project.json.enabled_packs`. If it is missing, recommend `npx skillpacks install remotion` first.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
