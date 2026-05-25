---
name: video-build
description: Transform an approved video script into a Remotion build specification with scaffolded project directory, compositions, scene components, and render config
type: planning
version: v0.0
argument-hint: "<script-path-or-slug> [--style minimal|motion-heavy|kinetic-text] [--fps 30|60] [--resolution 1080p|4k]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Video Build

Invoke as `$video-build`.

Take an approved video script and produce a build specification document and a scaffolded Remotion project directory with compositions, scene components, asset manifest, and render config.

## Prerequisites

- `specs/youtube/video-script-<slug>.md` must exist.
- Remotion availability is checked (`npx remotion --help`). If not installed, produce the spec and scaffold but defer render commands to `tasks/manual-todo.md`.

## Inputs

- `specs/youtube/video-script-<slug>.md`
- `specs/youtube/series-<slug>.md` (visual identity)
- `research/youtube/product-led-media-map-<slug>.md` (proof assets)
- Codebase scan for design tokens, logos, and fonts.

## Process

0. Resolve arguments: script path or slug, style (`minimal`, `motion-heavy`, `kinetic-text`), fps (`30`, `60`), resolution (`1080p`, `4k`).
1. Load script, series spec (visual identity), product-led-media-map (proof assets), and scan codebase for design tokens, logos, and fonts.
2. Text-based checkpoint: confirm visual identity (colors, fonts, logo), asset sourcing per asset requirement, technical config (platform, fps, resolution, existing Remotion project?) with the user before proceeding.
3. Design component tree: map script scenes to Remotion components with durations in frames, visual elements, animation timing, and audio references.
4. Text-based checkpoint: present build specification — component tree diagram, per-scene build plan, asset manifest, render config. Validate with user.
5. Write output only after user confirmation.

## Output

Write `specs/youtube/video-build-<slug>.md` with:

- **Build Brief:** script reference, style, fps, resolution, target platform.
- **Component Tree:** diagram and component descriptions.
- **Scene-by-Scene Build Plan:** table — component, duration (frames/seconds), visual elements, animation type, assets.
- **Asset Manifest:** table — name, type, status (`available`/`placeholder`/`needs-creation`), path, notes.
- **Audio Plan:** narration, music, SFX, sync points.
- **Render Configuration:** composition ID, fps, width, height, codec, output format.
- **Typography & Color Tokens:** fonts, sizes, colors from brand/series.
- **Transition Library:** which transitions between which scenes.
- **Next Steps.**

Write `specs/youtube/video-build-<slug>-interview.md` with the interview log.

Scaffold `src/videos/<slug>/`:

```
composition.tsx        // Root composition with Sequence timing
scenes/               // One component per script scene
transitions/          // Reusable transition components
components/           // Shared UI (LowerThird, BrowserFrame, etc.)
assets/
  manifest.json       // Asset paths and statuses
config/
  render.ts           // Render configuration
  theme.ts            // Colors, fonts, spacing tokens
```

### Task Classification

After writing output:

- `tasks/todo.md`: render commands, asset sourcing automation, subtitle generation.
- `tasks/manual-todo.md`: record footage, source music, record voiceover, YouTube upload, metadata, thumbnail, scheduling.
- `tasks/recurring-todo.md`: review performance at 7-day and 30-day marks.

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/video-build-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/video-build-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual Remotion or creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$creator-metrics-review`.

If the script is missing, recommend `$video-script`. If the user declined the build, do not recommend a follow-up.

If the default successor already exists and is current, recommend the first missing or stale downstream Remotion or creator-media artifact in this order:

`$creator-presence-dossier` -> `$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-format-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$video-script` -> `$video-build` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Every scene component must match the approved script timing — do not add or remove scenes.
- Do not generate AI voiceover without explicit user approval.
- Do not embed copyrighted assets without the user confirming licensing.
- Asset manifest must clearly distinguish `available` vs `placeholder` vs `needs-creation`.
- Respect series visual identity when a series spec exists.
- Present the build specification before writing — never write until the user confirms.
- Keep components composable — series should reuse intro/outro/transition/lower-third across episodes.
- Do not expose secrets, private customer data, or unreleased commitments.
