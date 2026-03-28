---
name: affected
description: Analyze which monorepo packages and apps are affected by current changes
---

# Affected

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
