---
name: migrate
description: Guide a structural migration or dependency upgrade with a step-by-step plan and verification
type: execution
version: v0.0
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/migrate-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/migrate-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
