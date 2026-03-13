---
name: dead-code
description: Scan the codebase for unused exports, orphaned files, stale dependencies, and unreachable code, outputting a prioritized cleanup list.
---

# Dead Code

Use this skill when the user wants to identify unused code, orphaned files, or stale dependencies for cleanup.

## Workflow

1. Determine scope (specific package or entire project).
2. Scan for unused exports by cross-referencing imports.
3. Scan for orphaned files not imported anywhere.
4. Scan for stale package.json dependencies.
5. Scan for dead code patterns (unreachable code, commented-out blocks).
6. Cross-reference with git history for staleness.

## Output Format

- **Unused Exports**: file, export name, last modified
- **Orphaned Files**: files not imported anywhere
- **Stale Dependencies**: unused packages
- **Dead Code Patterns**: unreachable code, commented blocks
- **Safe to Remove**: prioritized cleanup list

## Constraints

- Never automatically delete anything — only report.
- Be conservative with false positives.
- Exclude entry points, config files, and tool-consumed files.
