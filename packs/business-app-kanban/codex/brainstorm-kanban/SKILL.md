---
name: brainstorm-kanban
description: PoketoWork kanban variant of brainstorm — generate ideas and create Backlog cards
type: planning
version: v0.0
argument-hint: "[optional focus area]"
allowed-tools: Bash(poketo *)
---

# Brainstorm Kanban

Invoke as `$brainstorm-kanban`.

Use this skill only in projects that have opted into a PoketoWork kanban pack.

## Process

1. Follow the base `$brainstorm` workflow exactly, passing through `$ARGUMENTS` as the focus area.
2. Resolve the project board:
   - Check `tasks/.kanban-board` for a stored board ID and validate it with `poketo kanban board <id>`.
   - If missing or stale, run `poketo kanban boards` and match board names against `basename $(pwd)`.
   - If there is no clear match, ask the user which board to use. If no boards exist, offer to create one with `poketo kanban create-board --name "$(basename $(pwd))" --template standard`.
3. Validate required lists: Backlog, Todo, In Progress, Done, Punt. Create missing lists with `poketo kanban create-list`.
4. Fetch the board and show a brief overview: list counts, overdue cards, starred cards, and blocked cards.
5. After the base brainstorm writes `tasks/ideas.md`, create one Backlog card per new idea:
   - Search for an existing card with the idea title first.
   - If found, skip it.
   - If not found, create a Backlog card with the idea title, description, effort category, and source reference.
6. Report cards created, skipped, and any kanban failures.

If `poketo` is unavailable or a kanban command fails, warn and continue with the base brainstorm output. Kanban is additive; it must not block `tasks/ideas.md`.

## Next-Step Routing

In the final response, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>`. Route to the matching kanban workflow when board state can advance; otherwise route to the documented non-kanban fallback or say `No follow-up skill recommended` with the reason.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/brainstorm-kanban-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/brainstorm-kanban-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

