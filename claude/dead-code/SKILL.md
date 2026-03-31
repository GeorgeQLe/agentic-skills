---
name: dead-code
description: Scan for unused exports, unreachable code, orphaned files, and stale dependencies
type: analysis
version: 1.0.0
argument-hint: [optional: specific package or directory to scope the scan]
---

# Dead Code

Scan the codebase for unused code, orphaned files, and stale dependencies. Outputs a prioritized cleanup list.

## Process

1. **Determine scope:**
   - If `$ARGUMENTS` specifies a package or directory, scope the scan there.
   - Otherwise, scan the entire project (or all packages in a monorepo).
   - Read `CLAUDE.md` for project conventions.

2. **Scan for unused exports:**
   - For each file, identify exported functions, types, constants, and components.
   - Search the rest of the codebase for imports of each export.
   - Flag exports that are never imported anywhere (excluding entry points, API routes, and config files that are consumed externally).

3. **Scan for orphaned files:**
   - Identify files that are not imported by any other file.
   - Exclude entry points (pages, routes, API handlers, config files, scripts referenced in package.json).
   - Exclude test files, config files, and other files that are consumed by tools rather than imports.

4. **Scan for stale dependencies:**
   - Read `package.json` dependencies and devDependencies.
   - Search the codebase for actual usage of each dependency (imports, requires, CLI usage in scripts).
   - Flag dependencies that appear unused.
   - Note: some dependencies are used implicitly (PostCSS plugins, Babel presets, ESLint configs) — do not flag these.

5. **Scan for dead code patterns:**
   - Unreachable code after return/throw statements.
   - Commented-out code blocks (more than 3 lines).
   - Functions defined but never called (within a single file, non-exported).
   - Unused variables and parameters (if not caught by linting).
   - Feature flags or environment checks for conditions that are always true/false.

6. **Cross-reference with git:**
   - For flagged items, check `git log` to see when they were last meaningfully modified.
   - Items untouched for 6+ months get higher priority.

7. **Verify findings (false-positive filter):**
   - Before finalizing, re-read the actual source code for every flagged item. For each one, confirm:
     - The export/function is genuinely unused — re-check imports, re-exports through barrel files, and dynamic usage (`import()`, `require()`, string-based references).
     - The "orphaned" file isn't consumed by a tool, framework convention, or config (e.g., Next.js pages, migration files, seed scripts).
     - The "stale" dependency isn't used implicitly (PostCSS plugins, Babel presets, peer dependencies, CLI tools in npm scripts).
     - Commented-out code isn't an intentional reference or example kept for documentation purposes.
   - **Drop any finding you cannot re-confirm with a second read.** If uncertain, move it to "Needs Investigation" rather than "Safe to Remove."

## Output Format

### Unused Exports (high confidence)
| File | Export | Last Modified |
|------|--------|---------------|
| `path/to/file.ts` | `unusedHelper` | 4 months ago |

### Orphaned Files
- `path/to/orphan.ts` — not imported anywhere, last modified X ago

### Stale Dependencies
- `some-package` — no imports found in codebase
- `another-package` — only used in deleted file

### Dead Code Patterns
- `file.ts:42` — unreachable code after return
- `file.ts:100-115` — commented-out code block

### Safe to Remove (recommended)
Prioritized list of items safe to remove, grouped by package/directory.

### Needs Investigation
Items that might be unused but have ambiguous usage patterns (dynamic imports, reflection, external consumption).

## Constraints
- Use subagents to parallelize scanning across packages in a monorepo.
- Never automatically delete anything — only report findings.
- Be conservative with false positives — it's better to miss a dead export than to flag a used one.
- Exclude files matching common non-import patterns: `.config.`, `.d.ts`, migration files, seed files, scripts in `bin/`.
- If the codebase has a barrel file pattern (`index.ts` re-exports), trace through barrel files.
