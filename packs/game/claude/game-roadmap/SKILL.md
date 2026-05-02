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
## Next-Skill Routing

After writing the artifact, recommend the next contextual game-pack skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/roadmap or /run`.

If prototype, playtest, or market evidence invalidates an upstream assumption, route back to the earliest affected artifact (`/game-audience`, `/game-fantasy`, `/game-genre-map`, or `/game-comparables`) and explain the evidence. Otherwise, follow the default game sequence:

`/game-audience` -> `/game-fantasy` -> `/game-genre-map` -> `/game-comparables` -> `/game-core-loop` -> `/game-prototype-test` -> `/game-playtest-metrics` -> `/game-store-page-test` -> `/game-launch` -> `/game-roadmap`

If the next artifact already exists and is current, recommend `/game-workflow` to identify the first missing or stale game-pack artifact.
