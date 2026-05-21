---
name: game-workflow
description: Use only for video game projects; route research, validation, roadmap, metrics, and launch work through the game pack
type: planning
version: 1.0.0
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

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/game-workflow-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/game-workflow-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

Recommend the first missing or stale game-pack artifact in this order:

`$game-audience` -> `$game-fantasy` -> `$game-genre-map` -> `$game-comparables` -> `$game-core-loop` -> `$game-prototype-test` -> `$game-playtest-metrics` -> `$game-store-page-test` -> `$game-launch` -> `$game-roadmap`

In the final response, include `Recommended next skill: <command>` and one sentence explaining the missing artifact or stale decision that makes it next.
