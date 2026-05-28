---
name: migrate
description: Guide a structural migration or dependency upgrade with a step-by-step plan and verification
type: execution
version: v0.1
argument-hint: <description of migration, e.g. "move components into subdirectories" or "upgrade Next.js to 15">
---

# Migrate

Execute a structural migration, dependency upgrade, or large-scale codebase reorganization with a verified, step-by-step approach.

## Process

1. **Understand the migration** from `$ARGUMENTS`:
   - What is changing (dependency version, file structure, API pattern, etc.)
   - If unclear, ask the user for specifics before proceeding.

2. **Audit the current state:**
   - Read `CLAUDE.md` for project conventions.
   - Identify all files/patterns affected by the migration.
   - Use grep/glob to find every instance of the old pattern.
   - Count the total scope (e.g., "47 files use the old import path").

3. **Read the migration guide** (if applicable):
   - For dependency upgrades, check the changelog or migration docs.
   - For structural moves, understand the target layout.
   - Identify breaking changes, deprecated APIs, and required codemods.

4. **Build a migration plan:**
   - Enter plan mode using EnterPlanMode.
   - Present the plan to the user:
     - Total scope (how many files/patterns)
     - Step-by-step execution order
     - Breaking changes and how they'll be handled
     - Verification strategy (tests, type-checking, build)
   - Wait for user approval.

5. **Execute in batches after approval:**
   - If Claude Code already returned to normal mode after approval, do not call ExitPlanMode again; continue directly with migration. Only use the plan-mode exit tool when the session is still visibly in plan mode.
   - Process files in logical groups (by package, by directory, by pattern).
   - After each batch:
     - Run type-checking (`tsc --noEmit` or equivalent) to catch breakage early.
     - Run tests for the affected area.
     - Report progress.
   - If a batch fails, stop and report — do not continue blindly.

6. **Final verification:**
   - Run the full test suite.
   - Run the build.
   - Check for any remaining instances of the old pattern.
   - Report any manual follow-ups needed.

## Output Format

### Migration Summary
- **Scope**: X files across Y packages
- **Pattern**: old → new
- **Status**: complete / partial (with details)

### Changes Made
- Batch-by-batch summary

### Verification
- Type-check: pass/fail
- Tests: pass/fail (X passed, Y failed)
- Build: pass/fail
- Remaining old pattern instances: 0 or list

### Manual Follow-ups
- Any items that couldn't be automated

## Constraints
- Always enter plan mode and get approval before making changes.
- Do not call ExitPlanMode from normal mode. If Claude Code reports "You are not in plan mode" after approval, treat approval as complete and continue implementation.
- Process in verifiable batches — never change everything at once without checking.
- If the migration affects multiple monorepo packages, process one package at a time.
- Do not change behavior — migrations should be purely structural unless the upgrade requires API changes.
- Preserve git history readability — keep migration commits separate from feature work.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/migrate-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
