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

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/release-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
