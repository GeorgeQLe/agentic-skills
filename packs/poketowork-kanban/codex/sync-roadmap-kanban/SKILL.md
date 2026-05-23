---
name: sync-roadmap-kanban
description: Reconcile kanban board state with roadmap docs and codebase reality — sync cards, steps, and git history so they agree.
type: ops
version: v0.0
allowed-tools: Bash(poketo *), Bash(git *)
---

# Sync Roadmap ↔ Kanban

Invoke as `$sync-roadmap-kanban`.

Reconcile the kanban board, roadmap docs, and codebase state so all three reflect the same reality.

## Workflow

1. **Pull latest** — run the sync skill first. Stop on merge conflicts.

2. **Read kanban state** — run `poketo kanban boards` to list all boards. Auto-detect the project board:
   - If `tasks/.kanban-board` exists and contains a valid board ID, use it after verifying via `poketo kanban board <id>`.
   - Otherwise, match board names against `basename $(pwd)` (case-insensitive substring). If exactly one match, use it and save the ID to `tasks/.kanban-board`.
   - If zero or multiple matches, list boards, ask the user to pick, and save their choice to `tasks/.kanban-board`. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`.
   - Run `poketo kanban board <id>` to get the full board state.

3. **Read roadmap docs** — read `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/manual-todo.md` (if it exists). Read `tasks/record-todo.md` and `tasks/recurring-todo.md` only for advisory counts. List execution/manual items with checked/unchecked status.

4. **Read codebase reality** — `git log --oneline -30`. For items claimed done, verify deliverables exist (file checks, grep for key identifiers). Flag ambiguous cases.

5. **Reconcile** using these rules:
   - **Done on kanban + code confirms** → check off in roadmap
   - **Done in roadmap + code confirms** → move kanban card to Done
   - **New roadmap items, no card** → create kanban cards (backlog or in-progress)
   - **Record/recurring task items** → report counts only; do not create ordinary Todo cards unless the item has already been promoted into `tasks/todo.md`
   - **Orphaned cards** → flag (do NOT delete)
   - **Claimed done, code doesn't support** → flag as discrepancy (do NOT uncheck)

6. **Apply changes** — create/move cards via `poketo kanban`, edit roadmap docs. Re-fetch board to confirm.

7. **Report** — synced items, discrepancies needing human judgment, updated board state, roadmap progress, manual task status (from `tasks/manual-todo.md` if it exists), and advisory record/recurring counts if those files exist.

## Constraints

- Do not auto-resolve discrepancies — report and let the user decide.
- Do not delete kanban cards.
- Do not modify code — sync metadata only.
- Do not proceed on a dirty tree with merge conflicts.
- Match cards to roadmap items by name similarity; ask when ambiguous.
- If the poketo CLI is unavailable or the gateway fails, report the error and stop.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/sync-roadmap-kanban-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/sync-roadmap-kanban-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
