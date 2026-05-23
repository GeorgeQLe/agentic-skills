---
name: sync
description: Pull latest changes from remote and report status
type: shipping
version: v0.0
argument-hint:
---

# Sync

Pull the latest changes from the remote repository and report status.

## Process

1. **Check current state:**
   - Run `git status` to check for uncommitted changes.
   - If there are uncommitted changes, stash them first (`git stash`), pull, then pop the stash. Warn the user about the stash.

2. **Pull from remote:**
   - Run `git pull --rebase origin <current-branch>`.
   - If rebase conflicts occur, abort the rebase (`git rebase --abort`), try `git pull --no-rebase` instead, and report any merge conflicts for the user to resolve.

3. **Check for outstanding work:**
   - Check if `tasks/roadmap.md` exists for the full plan, and `tasks/todo.md` for the current phase.
   - If `tasks/todo.md` exists, read it and look for unchecked items (`- [ ]`).
   - If there are incomplete items, summarise: which phase is current, what the next step is, and how many steps/phases remain.
   - If `tasks/manual-todo.md` exists, count unchecked manual tasks and include in the summary.
   - If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items and include those counts separately. Do not treat them as active plan steps.
   - If all items are checked, report that the plan is complete.
   - If neither file exists, note that there is no active plan.

4. **Report status:**
   - Branch name
   - Commits pulled (if any) — show short log of new commits
   - Whether stashed changes were re-applied
   - Any conflicts that need manual resolution
   - Current `git status`
   - **Outstanding work** — summary from step 3 (next step, current phase, remaining work, pending manual tasks) or "No active plan"
   - **Advisory tasks** — pending record/recurring counts, if those files exist

5. **Post-sync actions:**

   a) Check if `sync.md` exists at the project root.

   b) **If `sync.md` exists** — parse and execute it:
      - Read `sync.md` and identify sections by H2 headings.
      - **Dependencies** (aliases: "Deps", "Dependency Management"):
        Execute shell commands found in fenced code blocks (e.g., `npm install`). Report output briefly.
      - **Conflict Resolution** (aliases: "Conflicts"):
        If the pull introduced merge conflicts (from step 2), apply the guidance in this section. For example, if it says "accept theirs for lockfiles", run the appropriate `git checkout --theirs` command. If no conflicts exist, skip silently.
      - **Custom** (aliases: "Project-Specific", "Scripts", "Setup"):
        Execute shell commands found in fenced code blocks in order. Report output briefly.
      - **Notifications** (aliases: "Awareness", "Alerts", "Watch"):
        For each bullet point, check if the mentioned file or directory was modified in the pulled commits (use `git diff --name-only` against the pre-pull HEAD). If any match, print a prominent alert with the bullet's description.
      - Sections with unrecognised headings: skip with a note ("Skipped unknown sync.md section: <heading>").
      - Report a summary of all post-sync actions taken.

   c) **If `sync.md` does not exist** — suggest creating one:
      - Analyse the project to detect:
        - Package manager (look for `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Pipfile.lock`, `requirements.txt`, `go.sum`, `Cargo.lock`, `Gemfile.lock`, `composer.lock`)
        - Common scripts (check `package.json` scripts, `Makefile`, `Justfile` for build/codegen/migrate targets)
        - Config templates (`.env.example`, `docker-compose.yml`, `config/`)
      - Present a suggested `sync.md` to the user with detected actions pre-filled, following the format in the **sync.md format** section below.
      - Ask: "Would you like me to create this `sync.md`? You can customise it anytime."
      - **Only create the file if the user approves.**

## sync.md format

The `sync.md` file lives at the project root. It uses H2 sections as categories. Shell commands go in fenced code blocks; prose guidance goes in bullet points.

```markdown
# Post-Sync Actions

## Dependencies

Commands to run after pulling to keep local dependencies up to date.

```sh
npm install
```

## Conflict Resolution

Project-specific guidance for handling merge conflicts.

- Always accept theirs for `package-lock.json` — regenerate via install command above
- For `generated/` files, regenerate with `npm run codegen` instead of resolving manually

## Custom

Project-specific scripts or commands to run after sync.

```sh
npm run codegen
```

## Notifications

Files and patterns to check for changes after a pull. Alert the user if any were modified.

- `.env.example` — check for new environment variables you may need to add to `.env`
- `CLAUDE.md` — review if project conventions were updated
- `config/` — warn about config schema changes
```

## Constraints
- Do not force-push or rewrite history.
- Do not auto-resolve merge conflicts — report them and let the user decide. However, if `sync.md` has a **Conflict Resolution** section, follow its guidance for the specific files/patterns it covers.
- If stash pop fails due to conflicts, leave the stash intact and report it.
- Post-sync commands from `sync.md` run in the project root directory.
- If any post-sync command fails, report the error and continue with remaining actions (do not abort).
- Never auto-create `sync.md` without explicit user approval.
- Do not execute commands from `sync.md` sections that are commented out with HTML comments (`<!-- ... -->`).


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/sync-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/sync-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
