---
name: youtube-title-thumbnail-audit
description: Audit YouTube titles and thumbnails against channel performance and peer packaging patterns
type: research
version: v0.0
argument-hint: "<channel slug or handle> [--peer <channel>...] [--count N]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Title Thumbnail Audit

Invoke as `$youtube-title-thumbnail-audit`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Turn channel and peer evidence into a packaging diagnosis for existing videos and reusable title/thumbnail templates.

## Inputs

- `research/youtube/channel-audit-<slug>.md`
- `research/youtube/data/<slug>/videos-*.jsonl`
- Optional `research/youtube/peer-benchmark-<slug>.md`
- Optional peer raw metadata under `research/youtube/data/<peer-slug>/`

## Workflow

1. Require a channel slug, handle, or channel audit path.
2. Ensure current channel evidence exists. If not, run `$youtube-channel-audit <channel> [--count N]`.
3. When peers are provided, ensure comparable peer benchmark or raw peer metadata exists.
4. Pull thumbnail URLs or local thumbnail files from raw `yt-dlp` metadata when available. If thumbnails are missing, fetch them through the existing `$youtube-audit` evidence path rather than inventing visual details.
5. Score each title for length, keyword clarity, specificity, curiosity pattern, series fit, and avoidable redundancy.
6. Classify thumbnail patterns: text density, face presence, product screenshot presence, logo count, background style, contrast, focal clarity, and channel-template consistency.
7. Correlate packaging features with views, views/day, upload age, and content role.
8. Produce exactly 3 title+thumbnail combinations for YouTube's **Test and Compare** feature. Each combination is a paired title and thumbnail concept designed to run simultaneously — YouTube rotates all 3 across real viewers and measures watch-time-per-impression over up to 2 weeks to surface a winner. Do not frame these as "pick one and swap later"; all 3 upload at the same time. Each combo should test a distinct packaging hypothesis (e.g., search-led vs. curiosity-hook vs. feature-led) while staying within the channel's visual identity.
9. Write `research/youtube/title-thumbnail-audit-<slug>.md`.

## Report Sections

- Evidence coverage: videos scored, thumbnail availability, peer coverage, and missing fields.
- Packaging performance table: title, views, views/day, title pattern, thumbnail pattern, and recommendation.
- Title diagnosis: recurring strengths, overlong patterns, keyword loading, unclear promises, and examples to keep.
- Thumbnail diagnosis: visual templates, consistency gaps, high-performing motifs, low-performing motifs, and peer contrasts.
- Channel identity impact: whether packaging creates a coherent channel signal.
- Existing-video fixes: prioritized title and thumbnail refresh candidates with expected rationale.
- Future templates: 3-5 repeatable title/thumbnail patterns mapped to content roles.
- Test and Compare combos: exactly 3 title+thumbnail combinations ready for YouTube's native A/B testing. Each combo includes a full title, thumbnail concept description, packaging hypothesis, and what signal a win for that variant would confirm about the channel's audience. Present these as simultaneous uploads, not sequential swaps.
- Strategic packaging recommendation: which combo to watch most closely and what to do after Test and Compare declares a winner.

## Constraints

- Cite source metadata paths and video IDs.
- Do not claim visual features unless thumbnail evidence was inspected or unavailable status is explicit.
- Do not recommend copying peer faces, branding, or trade dress; translate peer evidence into differentiated templates.
- Keep recommendations practical for the creator's apparent production capacity.
- Route follow-up cleanup decisions to `$youtube-portfolio` and future-topic decisions to `$youtube-search-positioning` or `$content-programming`.

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

Default recommendation: `$youtube-description-optimizer`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-concept-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/youtube-title-thumbnail-audit-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/youtube-title-thumbnail-audit-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

Before replacing an existing canonical research document, archive it under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
