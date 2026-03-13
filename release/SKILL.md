---
name: release
description: Manage the release ceremony — version bump, changelog generation from conventional commits, git tag, and optional GitHub release and deploy trigger.
---

# Release

Use this skill when the user wants to cut a release for the project.

## Workflow

1. Determine version bump from arguments or analyze commits to suggest one.
2. Run pre-release checks (clean tree, tests pass).
3. Generate changelog from conventional commits since last tag.
4. Bump version in package.json and other version files.
5. Commit and create annotated git tag.
6. Ask about push, GitHub release, and deploy.

## Output Format

- **Changelog**: features, fixes, breaking changes
- **Files Updated**: version files and changelog
- **Tag**: version tag created
- **Next Steps**: awaiting confirmation for push/release/deploy

## Constraints

- Always confirm version with user before changes.
- Never push or create GitHub releases without explicit confirmation.
- Stop if tests fail — do not release broken code.
