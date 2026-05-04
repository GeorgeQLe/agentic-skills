---
name: video-build
description: Transform an approved video script into a Remotion build specification with scaffolded project directory, compositions, scene components, and render config
type: planning
version: 1.0.0
argument-hint: "<script-path-or-slug> [--style minimal|motion-heavy|kinetic-text] [--fps 30|60] [--resolution 1080p|4k]"
---

# Video Build

Invoke as `/video-build`.

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
2. Interview (AskUserQuestion): visual identity (colors, fonts, logo), asset sourcing per asset requirement, technical config (platform, fps, resolution, existing Remotion project?).
3. Design component tree: map script scenes to Remotion components with durations in frames, visual elements, animation timing, and audio references.
4. Present build specification: component tree diagram, per-scene build plan, asset manifest, render config. Validate with user.
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

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/creator-metrics-review`.

If the script is missing, recommend `/video-script`. If the user declined the build, do not recommend a follow-up.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/creator-presence-dossier` -> `/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-format-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/video-script` -> `/video-build` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Every scene component must match the approved script timing — do not add or remove scenes.
- Do not generate AI voiceover without explicit user approval.
- Do not embed copyrighted assets without the user confirming licensing.
- Asset manifest must clearly distinguish `available` vs `placeholder` vs `needs-creation`.
- Respect series visual identity when a series spec exists.
- Present the build specification before writing — never write until the user confirms.
- Keep components composable — series should reuse intro/outro/transition/lower-third across episodes.
- Do not expose secrets, private customer data, or unreleased commitments.
