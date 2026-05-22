---
name: spec-interview-kanban
description: PoketoWork kanban variant of spec-interview — write a spec and update or create the matching card
type: planning
version: 1.0.0
argument-hint: "[topic or draft spec]"
allowed-tools: Bash(poketo *)
---

# Spec Interview Kanban

Use this skill only in projects that have opted into a PoketoWork kanban pack.

## Process

1. Follow the base `/spec-interview` workflow exactly, passing through `$ARGUMENTS` as the topic, draft, or spec path.
2. Resolve and validate the project board:
   - Check `tasks/.kanban-board`, then validate with `poketo kanban board <id>`.
   - If missing or stale, match `poketo kanban boards` against `basename $(pwd)`.
   - If no board is clear, ask the user. If no boards exist, offer `poketo kanban create-board --name "$(basename $(pwd))" --template standard`.
   - Ensure Backlog, Todo, In Progress, Done, and Punt lists exist.
3. Fetch the board and show a brief overview before the interview.
4. After the base interview writes the spec and interview log:
   - Extract two or three distinctive keywords from the topic or spec title.
   - Search all lists for matching cards.
   - If one card matches, update that card description with the spec summary and file path. Do not move it.
   - If multiple cards match, ask the user which card to update.
   - If no card matches, create a Backlog card with the spec summary and file path.
5. Report the card updated or created.

Never move cards backward from Done or Punt. If kanban fails, warn and keep the completed spec as the source of truth.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/spec-interview-kanban-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/spec-interview-kanban-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/spec-interview-kanban-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Next-Step Routing

In the final response, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>`. Route to the matching kanban workflow when board state can advance; otherwise route to the documented non-kanban fallback or say `No follow-up skill recommended` with the reason.
