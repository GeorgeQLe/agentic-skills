---
name: game-workflow
description: Use only for video game projects; route research, validation, roadmap, metrics, and launch work through the game pack
type: planning
version: v0.3
invocation: orchestrator
interview_depth: none
---

# Game Workflow

Invoke as `$game-workflow`.

Use this skill when a project is a video game or playable entertainment product.

## Process

1. Read `.agents/project.json` and confirm `project_type` is `game`.
2. If the game pack is not enabled, run `scripts/pack.sh install game` from this source checkout, or `npx skillpacks install game` from the target project shell when using the published package.
3. Route early research through `game-audience`, `game-fantasy`, `game-genre-map`, and `game-comparables`.
4. Route prototype work through `game-core-loop`, `game-prototype-test`, and `game-playtest-metrics`.
5. Route market validation and launch work through `game-store-page-test`, `game-launch`, and `game-roadmap`.

## Output

Recommend the next single game-pack skill to run and explain the missing artifact or decision that makes it next.

## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/game-workflow-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
