---
name: quality-sweep
description: Audit and implement behavior-preserving cleanup across types, dead code, dependencies, errors, and comments
type: execution
version: v0.0
argument-hint: "[audit|fix|full] [optional: package, app, directory, or domain]"
---

# Quality Sweep

Invoke as `$quality-sweep`.

Use this skill when a project needs a behavior-preserving code quality cleanup campaign across duplication, type hygiene, dead code, dependency boundaries, defensive error handling, legacy paths, and comments. This skill orchestrates cleanup work; use narrower skills like `extract-shared-types`, `dead-code`, `slim-audit`, `hygiene`, `spec-drift`, and `regression-check` when the user asks for only one of those concerns.

## Process

1. **Select mode and scope.**
   - Parse `$ARGUMENTS` for mode: `audit`, `fix`, or `full`.
   - Default to `audit` when no mode is provided.
   - Treat remaining arguments as the target scope: package, app, directory, or domain.
   - If no scope is provided, inspect the repository and choose the smallest coherent scope before broadening.

2. **Establish baseline and context.**
   - Read project instructions, manifests, package configs, path aliases, lint/typecheck/test/build scripts, and relevant docs.
   - Read specs, roadmap/todo/history, changelogs, ADRs, or design notes when present.
   - In `fix` or `full`, run or record the narrowest relevant baseline checks available before edits.
   - Respect documented trade-offs and intentional architecture. Do not report documented decisions as cleanup targets.

3. **Run audit lanes.**
   - **Duplication:** find duplicate or near-duplicate code where consolidation reduces coupling, maintenance cost, or complexity.
   - **Shared types:** find type definitions that should move to a shared boundary; follow `extract-shared-types` rules for any implementation.
   - **Unused code:** use code search and available tools such as `knip` to find unused exports, orphaned files, stale dependencies, and unreachable branches.
   - **Circular dependencies:** use code search and available tools such as `madge` to identify dependency cycles and import-boundary issues.
   - **Weak types:** find unsafe `any` and unjustified weak typing. Preserve `unknown` at trust boundaries unless a stronger validated type exists.
   - **Error handling:** audit `try`/`catch` and defensive patterns. Preserve boundary handling, parsing, cleanup, rollback, external-service handling, and error translation.
   - **Legacy paths:** find deprecated, migration, compatibility, fallback, and alternate code paths that may now be obsolete.
   - **Comments and stubs:** remove or rewrite AI slop, stale comments, in-motion notes, stubs, larp, and comments that describe previous work instead of current behavior.

4. **Triage every finding.**
   - `Safe to Fix`: behavior-preserving, statically supported, verified by code search, not public-API-sensitive, and independently revertible.
   - `Needs Investigation`: plausible but ambiguous, migration-sensitive, weakly covered, or dependent on product intent.
   - `Do Not Change`: documented decision, necessary fallback, valid boundary handling, or readability-preserving duplication.
   - Re-read the relevant source before finalizing a finding. Drop findings that cannot be reconfirmed.

5. **Use subagents only for audit-first lanes.**
   - If the user explicitly requests subagents, or the mode is `full` and the active environment permits subagents, assign lanes as research tasks first.
   - Subagents should report findings and recommendations before edits.
   - The main agent owns final triage, integration, edits, and verification.
   - Direct subagent edits are allowed only when the main agent assigns disjoint file or path ownership.

6. **Implement only approved safe cleanup in `fix` or `full`.**
   - Do not modify files in `audit` mode.
   - Batch changes by lane or subsystem.
   - Avoid broad abstractions unless they reduce real complexity or coupling.
   - Do not remove public import paths, compatibility shims, migrations, or fallbacks unless evidence shows they are obsolete.
   - Do not replace `unknown` with weaker or speculative types.
   - Do not remove error handling that defines a clear boundary, adds actionable context, performs cleanup, or preserves system integrity.
   - Re-run the narrowest relevant validation after each meaningful batch.

7. **Verify and report.**
   - Run relevant typecheck, lint, tests, build, dead-code checks, and circular-dependency checks when available.
   - Distinguish new failures from pre-existing baseline failures.
   - If validation fails in `fix` or `full`, fix the regression or stop and report the blocker.

## Output Format

- **Summary:** mode, scope, tools/checks used, and overall cleanup potential.
- **Safe to Fix:** concrete items with file references, evidence, proposed change, and validation path.
- **Implemented:** for `fix` or `full` only; grouped by batch with files changed.
- **Needs Investigation:** skipped items and why they need more evidence or product input.
- **Do Not Change:** suspicious-looking patterns intentionally preserved.
- **Verification:** commands run, pass/fail status, and pre-existing failures if any.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/quality-sweep-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/quality-sweep-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/quality-sweep-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

In the final response, include `Recommended next skill: <command>` using these rules:

- Audit-only results with type/module coupling as the top finding: recommend `$extract-shared-types`.
- Audit-only results with safe mechanical cleanup available: recommend `$quality-sweep fix`.
- Any mutation or broad refactor completion: recommend `$regression-check`.
- Validation complete with changes ready to ship: recommend `$ship`.

Default recommendation: `$extract-shared-types when type/module coupling is the top finding, $quality-sweep fix when safe fixes are identified, or $regression-check after mutation`.

## Constraints

- Audit-only by default. Never edit files unless mode is `fix` or `full`.
- Behavior preservation is the default. Treat public APIs, package exports, migrations, database/data compatibility, and external contracts as high risk.
- Prefer repository-native tooling and existing dependencies. Do not add cleanup tools unless the user explicitly approves.
- Be conservative with deletion. Static analysis findings must be verified with code search and source inspection.
- Do not use DRY as a blanket rule. Consolidate only when it reduces real maintenance burden without hiding distinct reasons to change.
- Keep comments only when they explain intent, constraints, invariants, or non-obvious behavior for a future maintainer.
