---
name: game-roadmap
description: Use only for video game projects; sequence prototype, vertical slice, demo, store page, festival, launch, and post-launch milestones
type: planning
version: 1.0.0
---

# Game Roadmap

Turn validated game research into production milestones.

## Output

Write or update `tasks/roadmap.md` with prototype, vertical slice, demo, store page, festival, launch, and post-launch phases.

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/game-roadmap-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/game-roadmap-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual game-pack skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/roadmap or /run`.

If prototype, playtest, or market evidence invalidates an upstream assumption, route back to the earliest affected artifact (`/game-audience`, `/game-fantasy`, `/game-genre-map`, or `/game-comparables`) and explain the evidence. Otherwise, follow the default game sequence:

`/game-audience` -> `/game-fantasy` -> `/game-genre-map` -> `/game-comparables` -> `/game-core-loop` -> `/game-prototype-test` -> `/game-playtest-metrics` -> `/game-store-page-test` -> `/game-launch` -> `/game-roadmap`

If the next artifact already exists and is current, recommend `/game-workflow` to identify the first missing or stale game-pack artifact.
