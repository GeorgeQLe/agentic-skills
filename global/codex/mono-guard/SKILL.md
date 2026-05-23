---
name: mono-guard
description: Pre-flight validation of execution profile lane boundaries against monorepo structure — prevents dispatch of unsafe parallel configurations
type: analysis
version: v0.0
---

# Mono Guard

Invoke as `$mono-guard`.

Use this skill to validate execution profile lane boundaries before `/run` dispatches parallel agents. Catches lockfile contention, root config conflicts, package boundary violations, and missing branch/PR isolation before they cause failures.

## Modes

- **Pre-flight (default):** Validate lane specs in `tasks/todo.md` before dispatch.
- **Post-integration (`--post-integration`):** Verify lockfiles and root configs were only modified by their designated owner after lanes complete.

## Pre-Flight Checks

1. **Lockfile Safety:** Every lockfile is in `Must not edit` for all write lanes, OR owned by exactly one serial deps lane that all others depend on. FAIL if violated.
2. **Root Config Safety:** Same ownership/exclusion rules for `tsconfig.base.json`, `turbo.json`, etc. WARN if violated.
3. **Package Boundary Isolation:** `Owns` paths are disjoint, within recognized package directories, no prefix overlaps. FAIL if violated.
4. **Dependency Ordering:** If package X depends on package Y and both are in write lanes, lane-X must depend on lane-Y. FAIL if missing.
5. **Serialization Check:** No write lane's Scope contains `pnpm install`, `npm install`, `yarn add`, etc. (except a dedicated deps lane). FAIL if found.
6. **Install Command Check:** Scan for natural-language install intent ("add dependency", "install package"). WARN if detected.
7. **DAG Validity:** No cycles in lane dependency graph, all `Depends on` references exist. FAIL if violated.
8. **Branch/PR Isolation:** For `agent-team` write lanes, every lane has a unique `Branch` that is not `main` or `master`, and the phase includes a consolidation/PR review gate. FAIL if missing.

## Post-Integration Checks

1. **Lockfile audit:** Verify lockfile was only touched by deps lane or main agent.
2. **Root config audit:** Same check for root configs.
3. **Boundary audit:** Verify each lane's changes fall within its `Owns` paths.
4. **PR review audit:** Verify branch, commit SHA, and PR URL evidence exists for every integrated `agent-team` write lane.

## Output Format

- **Mode, profiles checked, overall verdict** (PASS / WARN / FAIL)
- **Results table**: check name, verdict, details
- **Failures**: which check, which lanes, which files, recommended fix
- **Warnings**: advisory issues with recommendations

## Verdicts

- **PASS:** Safe to dispatch.
- **WARN:** Advisory issues — dispatch allowed but review first.
- **FAIL:** Dispatch blocked — resolve failures before `/run`.

## Constraints

- Do not modify task files — output is advisory only.
- Do not run package manager install/add commands.
- Do not fix issues automatically — report with specific fix recommendations.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/mono-guard-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/mono-guard-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
