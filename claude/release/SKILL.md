---
name: release
description: Version bump, generate changelog, tag, and prepare a release
version: 1.0.0
argument-hint: [patch|minor|major] or [specific version like 1.2.3]
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
   - Ensure the current branch is up to date with remote.
   - Run tests to verify everything passes.
   - Check for any TODO or FIXME items in `tasks/roadmap.md` and `tasks/todo.md` that should block the release.

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
- If tests fail during pre-release checks, stop and report — do not release broken code.
- For monorepos, ask the user whether this is a root release or a package-specific release.
- Do not modify code as part of the release — only version files, changelogs, and tags.
