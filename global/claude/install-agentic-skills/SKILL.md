---
name: install-agentic-skills
description: Refresh this agentic-skills checkout into local Claude and Codex skill directories by running the repository install script, verify global skill links, uninstall repo-managed links when requested, and route project-local pack setup to the pack skill. Use when Claude needs to make all global agentic-skills skills available on the current machine, repair stale symlinks, confirm installation status, or explain how to install packs for a project.
type: ops
version: v0.0
argument-hint: "[install|status|--uninstall]"
---

# Install Agentic Skills

Refresh global skill symlinks for both Claude and Codex from this `agentic-skills` checkout. Keep domain packs project-local; use `/pack` from the target project when packs are needed.

## Workflow

1. Parse `$ARGUMENTS`:
   - No args, `install`, `refresh`, or `sync`: run `scripts/install-agentic-skills.sh`.
   - `status`: run `scripts/install-agentic-skills.sh`, then inspect `~/.claude/skills`, `~/.codex/skills`, and the root installer summary.
   - `--uninstall`, `uninstall`, or `remove`: run `scripts/install-agentic-skills.sh --uninstall` only after confirming the user wants repo-managed global symlinks removed.
   - `help`, `--help`, or `-h`: run `scripts/install-agentic-skills.sh --help`.
2. Report the installer command, the Claude and Codex skill directories, installed/skipped counts, and warnings about non-symlink collisions.
3. Explain pack access separately:
   - Do not install `packs/*` globally.
   - In the project that needs domain workflows, run `/pack` for guided setup or `/pack install <pack>` for an explicit pack.
   - If a project already has `.agents/project.json`, use `/pack refresh` after this global install to recreate local pack links.
4. If the active session still cannot see a newly installed skill, tell the user to start a fresh Claude Code or Codex session.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/install-agentic-skills-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/install-agentic-skills-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Delegate global installation to `scripts/install-agentic-skills.sh`; do not recreate symlink logic by hand.
- Do not overwrite real directories or files under `~/.claude/skills`, `~/.codex/skills`, `.claude/skills`, or `.codex/skills`.
- Treat packs as project-local capabilities managed by `scripts/pack.sh` through `/pack`.
- Stop and report exact errors if the launcher cannot resolve the repository root or if root `install.sh` fails.
