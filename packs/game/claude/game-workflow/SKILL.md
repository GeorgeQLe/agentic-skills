---
name: game-workflow
description: Use only for video game projects; route research, validation, roadmap, metrics, and launch work through the game pack
type: planning
version: v0.4
release_lane: canary
required_conventions: [alignment-page, briefing-slides]
invocation: orchestrator
context_intake: artifact_only
---

# Game Workflow

Use this skill when a project is a video game or playable entertainment product.

## Process

1. Read `.agents/project.json` and confirm `project_type` is `game`.
2. If the game pack is not enabled, run `scripts/pack.sh install game` from this source checkout, or `npx skillpacks install game` from the target project shell when using the published package.
3. Route early research through `game-audience`, `game-fantasy`, `game-genre-map`, and `game-comparables`.
4. Route prototype work through `game-core-loop`, `game-prototype-test`, and `game-playtest-metrics`.
5. Route market validation and launch work through `game-store-page-test`, `game-launch`, and `game-roadmap`.

## Output

Recommend the next single game-pack skill to run and explain the missing artifact or decision that makes it next.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/game-workflow-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/game-workflow`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/game-workflow-{topic}.html`. By default, report results inline and write only this skill's normal durable artifacts; create an alignment page only when explicitly requested or when a concrete clarification/review need cannot be handled cleanly inline.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
