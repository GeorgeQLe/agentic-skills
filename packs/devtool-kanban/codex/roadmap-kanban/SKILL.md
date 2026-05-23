---
name: roadmap-kanban
description: PoketoWork kanban variant of roadmap — sync roadmap phases and current steps to cards
type: planning
version: v0.0
argument-hint: "[--existing] [path-to-spec]"
allowed-tools: Bash(poketo *)
---

# Roadmap Kanban

Invoke as `$roadmap-kanban`.

Use this skill only in projects that have opted into a PoketoWork kanban pack.

## Process

1. Follow the base `$roadmap` workflow exactly, passing through `$ARGUMENTS`.
2. Resolve and validate the project board using `tasks/.kanban-board`, `poketo kanban boards`, and the standard lists: Backlog, Todo, In Progress, Done, Punt.
3. Fetch the board and show a brief overview before roadmap work.
4. After the base roadmap writes or updates `tasks/roadmap.md` and `tasks/todo.md`, sync cards:
   - For each unchecked current step in `tasks/todo.md`, search for a matching card. Move it from Backlog to Todo, leave it alone if already Todo or later, or create it in Todo with phase context.
   - For each future roadmap phase, search for a matching phase card. Create a Backlog summary card when missing.
   - Do not create ordinary Todo cards from `tasks/record-todo.md` or `tasks/recurring-todo.md`. Report advisory counts separately unless an item has been promoted into `tasks/todo.md`.
5. Report cards created, moved, skipped, and any failures.

Only move cards from Backlog to Todo. Never move cards backward. If kanban fails, warn and keep the roadmap output.

## Next-Step Routing

In the final response, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>`. Route to the matching kanban workflow when board state can advance; otherwise route to the documented non-kanban fallback or say `No follow-up skill recommended` with the reason.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/roadmap-kanban-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/roadmap-kanban-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

