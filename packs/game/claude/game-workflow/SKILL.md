---
name: game-workflow
description: Use only for video game projects; route research, validation, roadmap, metrics, and launch work through the game pack
type: planning
version: 1.0.0
---

# Game Workflow

Use this skill when a project is a video game or playable entertainment product.

## Workflow

1. Read `.agents/project.json` and confirm `project_type` is `game`.
2. If the game pack is not enabled, run `scripts/pack.sh install game`.
3. Route early research through `game-audience`, `game-fantasy`, `game-genre-map`, and `game-comparables`.
4. Route prototype work through `game-core-loop`, `game-prototype-test`, and `game-playtest-metrics`.
5. Route market validation and launch work through `game-store-page-test`, `game-launch`, and `game-roadmap`.

## Output

Recommend the next single game-pack skill to run and explain the missing artifact or decision that makes it next.
## Next-Skill Routing

Recommend the first missing or stale game-pack artifact in this order:

`/game-audience` -> `/game-fantasy` -> `/game-genre-map` -> `/game-comparables` -> `/game-core-loop` -> `/game-prototype-test` -> `/game-playtest-metrics` -> `/game-store-page-test` -> `/game-launch` -> `/game-roadmap`

In the final response, include `Recommended next skill: <command>` and one sentence explaining the missing artifact or stale decision that makes it next.
