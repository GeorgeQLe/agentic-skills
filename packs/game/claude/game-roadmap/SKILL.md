---
name: game-roadmap
description: Use only for video game projects; sequence prototype, vertical slice, demo, store page, festival, launch, and post-launch milestones
type: planning
version: v0.0
---

# Game Roadmap

Turn validated game research into production milestones.

## Output

Write or update `tasks/roadmap.md` with prototype, vertical slice, demo, store page, festival, launch, and post-launch phases.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/game-roadmap-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/game-roadmap-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual game-pack skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/roadmap or /run`.

If prototype, playtest, or market evidence invalidates an upstream assumption, route back to the earliest affected artifact (`/game-audience`, `/game-fantasy`, `/game-genre-map`, or `/game-comparables`) and explain the evidence. Otherwise, follow the default game sequence:

`/game-audience` -> `/game-fantasy` -> `/game-genre-map` -> `/game-comparables` -> `/game-core-loop` -> `/game-prototype-test` -> `/game-playtest-metrics` -> `/game-store-page-test` -> `/game-launch` -> `/game-roadmap`

If the next artifact already exists and is current, recommend `/game-workflow` to identify the first missing or stale game-pack artifact.
