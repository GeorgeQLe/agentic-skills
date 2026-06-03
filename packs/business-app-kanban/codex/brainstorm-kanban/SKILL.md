---
name: brainstorm-kanban
description: PoketoWork kanban variant of brainstorm — generate ideas and create Backlog cards
type: planning
version: v0.1
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/brainstorm-kanban-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

