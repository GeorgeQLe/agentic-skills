---
name: game-workflow
description: Use only for video game projects; route research, validation, roadmap, metrics, and launch work through the game pack
type: planning
version: v0.1
---

# Game Workflow

Invoke as `$game-workflow`.

Use this skill when a project is a video game or playable entertainment product.

## Workflow

1. Read `.agents/project.json` and confirm `project_type` is `game`.
2. If the game pack is not enabled, run `scripts/pack.sh install game`.
3. Route early research through `game-audience`, `game-fantasy`, `game-genre-map`, and `game-comparables`.
4. Route prototype work through `game-core-loop`, `game-prototype-test`, and `game-playtest-metrics`.
5. Route market validation and launch work through `game-store-page-test`, `game-launch`, and `game-roadmap`.

## Output

Recommend the next single game-pack skill to run and explain the missing artifact or decision that makes it next.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/game-workflow-{topic}.html`.

