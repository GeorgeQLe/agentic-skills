---
name: affected
description: Analyze which monorepo packages and apps are affected by current changes
type: analysis
version: 1.0.0
---

# Affected

Invoke as `$affected`.

Use this skill when the user wants to understand the blast radius of their current changes in a monorepo.

## Workflow

1. Determine the change set from git diff or a specified commit range.
2. Read the monorepo config to understand the package graph.
3. Map changed files to their packages.
4. Compute transitive dependents.
5. Check for cross-cutting changes (root configs, shared packages).
6. Recommend test commands for affected packages.

## Output Format

- **Directly Changed**: packages with file changes
- **Transitively Affected**: downstream dependents
- **Cross-Cutting**: root config changes affecting all packages
- **Recommended Test Commands**: specific commands to run

## Constraints

- Do not run tests — only analyze and recommend.
- Prefer Turbo-native filtering for Turborepo projects.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
