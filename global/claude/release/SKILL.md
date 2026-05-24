---
name: release
description: Version bump, generate changelog, tag, and prepare a release
type: shipping
version: v0.0
argument-hint: "[patch|minor|major] or [specific version like 1.2.3]"
---

# Release

Manage the release ceremony: version bump, changelog generation, git tag, and optional deploy trigger.

## Process

1. **Determine the version bump** from `$ARGUMENTS`:
   - `patch`, `minor`, or `major` → compute the next version from the current one.
   - Specific version (e.g., `1.2.3`) → use it directly.
   - If no argument, analyze commits since the last tag to suggest a version:
     - Any `feat:` commits → suggest `minor`
     - Only `fix:` / `chore:` / `docs:` → suggest `patch`
     - Any `BREAKING CHANGE` or `!:` → suggest `major`
   - Confirm the version with the user before proceeding.

2. **Pre-release checks:**
   - Ensure the working tree is clean.
   - Resolve the primary branch: prefer `main`; if it does not exist, use `master`. If neither exists, stop and explain the blocker.
   - Ensure the current branch is the primary branch. If not, stop and tell the user to cut releases only from `main`/`master`.
   - Ensure the primary branch is up to date with remote.
   - Run tests to verify everything passes.
   - Check for any TODO or FIXME items in `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/manual-todo.md` (if it exists) that should block the release. Count `tasks/record-todo.md` and `tasks/recurring-todo.md` as advisory only unless an item explicitly says it blocks release.

3. **Generate the changelog:**
   - Find the last git tag (or first commit if no tags exist).
   - Collect all commits since the last tag.
   - Group by conventional commit type:
     - **Features** (`feat:`)
     - **Bug Fixes** (`fix:`)
     - **Breaking Changes** (`BREAKING CHANGE` or `!:`)
     - **Other** (`refactor:`, `chore:`, `docs:`, `test:`, `perf:`)
   - Format as a markdown changelog entry with the version and date.

4. **Apply the version bump:**
   - Update `package.json` version (root and/or workspace packages as appropriate).
   - If a `CHANGELOG.md` exists, prepend the new entry. If not, create one.
   - If the project uses other version files (e.g., `version.ts`, `__version__.py`), update those too.

5. **Commit and tag:**
   - Stage the changed files.
   - Commit with message: `release: vX.Y.Z`
   - Create an annotated git tag: `vX.Y.Z` with the changelog entry as the tag message.

6. **Ask about next steps:**
   - Push the commit and tag? (ask for confirmation)
   - Create a GitHub release? (ask for confirmation)
   - Trigger a deploy? (ask for confirmation)

## Output Format

### Release vX.Y.Z

**Changelog:**

#### Features
- commit summary (hash)

#### Bug Fixes
- commit summary (hash)

#### Breaking Changes
- commit summary (hash)

**Files Updated:**
- `package.json` — version bumped
- `CHANGELOG.md` — entry added

**Tag:** `vX.Y.Z`

**Next steps:** push / GitHub release / deploy (awaiting confirmation)

## Constraints
- Always confirm the version with the user before making changes.
- Never push or create a GitHub release without explicit user confirmation.
- **Do not push to an existing feature branch.** Releases should only be cut from `main`/`master`. If on a feature branch, stop and ask the user.
- If tests fail during pre-release checks, stop and report — do not release broken code.
- For monorepos, ask the user whether this is a root release or a package-specific release.
- Do not modify code as part of the release — only version files, changelogs, and tags.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/release-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/release-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
