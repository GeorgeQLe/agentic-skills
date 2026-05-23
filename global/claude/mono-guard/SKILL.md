---
name: mono-guard
description: Pre-flight validation of execution profile lane boundaries against monorepo structure — prevents dispatch of unsafe parallel configurations
type: analysis
version: v0.0
argument-hint: "[--post-integration] [optional: path to todo.md]"
---

# Mono Guard

Pre-flight validation of execution profile lane boundaries against the actual monorepo structure. Run this **before** `/run` dispatches `agent-team` or `implementation-safe` lanes to catch unsafe configurations that would cause lockfile contention, root config conflicts, package boundary violations, or missing branch/PR isolation.

## Modes

- **Pre-flight (default):** Validate lane specs in `tasks/todo.md` before dispatch.
- **Post-integration (`--post-integration`):** Defense-in-depth check after `/run` integrates lane results — verify that lockfiles and root configs were only modified by their designated owner.

## Prerequisites

- `tasks/todo.md` must exist with at least one `### Execution Profile` block containing `agent-team` or `implementation-safe` parallel mode.
- For post-integration mode: the integration must have already occurred (lanes completed, changes merged).

## Pre-Flight Checks

Run all checks against every `agent-team` or `implementation-safe` profile in `tasks/todo.md` (or the path from `$ARGUMENTS`).

### Check 1: Lockfile Safety

- Identify all lockfiles in the repo root: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`.
- For each lockfile, verify ONE of:
  - It appears in `Must not edit` for **every** write lane (no lane touches it), OR
  - It is in `Owns` for **exactly one** serial lane, AND that lane appears in `Depends on` for all other write lanes.
- **FAIL** if a lockfile is missing from both `Owns` and `Must not edit` for any write lane.
- **FAIL** if a lockfile is in `Owns` for more than one lane.

### Check 2: Root Config Safety

- Identify root configs: `tsconfig.base.json`, `tsconfig.json` (root), `turbo.json`, `tailwind.config.*`, `jest.config.*`, `vitest.config.*`, `eslint.config.*`, `.eslintrc.*`, `.prettierrc*`, `postcss.config.*`.
- Apply the same ownership/exclusion rules as Check 1: each root config must be either universally excluded or owned by exactly one lane with all others depending on it.
- **WARN** (not FAIL) for root configs — they are less likely to cause hard conflicts than lockfiles, but still risky.

### Check 3: Package Boundary Isolation

- For each write lane, verify `Owns` paths:
  - Are within recognized package/app directories (match workspace config).
  - Are disjoint — no lane's `Owns` is a prefix of another lane's `Owns`.
  - Do not overlap with any other lane's `Owns`.
- **FAIL** if `Owns` paths overlap between any two write lanes.
- **FAIL** if a write lane's `Owns` path is not within a recognized package or app directory (unless it is the deps lane owning root files).

### Check 4: Dependency Ordering

- Read the monorepo's internal dependency graph (from `package.json` files).
- If package X depends on package Y, and both are in separate write lanes, verify that lane-X has `Depends on: lane-Y` (directly or transitively).
- **FAIL** if a dependency edge is missing — parallel execution of dependent packages can produce broken builds.

### Check 5: Serialization Check

- Scan every write lane's `Scope` text for dependency-installation signals: `pnpm add`, `pnpm install`, `npm install`, `npm ci`, `yarn add`, `yarn install`, `bun add`, `bun install`.
- If found in ANY non-deps lane: **FAIL** — install commands must only appear in a dedicated serial deps lane.
- If install signals exist but no deps lane exists: **FAIL** — create a deps lane first.

### Check 6: Install Command Check

- Verify no write lane's `Scope` text contains install/add commands (redundant with Check 5 but catches different phrasings).
- Also scan for: "add dependency", "install package", "add to package.json", "update dependencies".
- **WARN** if natural-language install intent is detected — recommend moving to a deps lane.

### Check 7: DAG Validity

- Build the lane dependency graph from all `Depends on` fields.
- Verify no cycles exist.
- Verify all `Depends on` references name existing lanes in the same phase.
- **FAIL** on cycles or dangling references.

### Check 8: Branch/PR Isolation

- For every `agent-team` write lane, verify there is a unique `Branch:` field.
- The branch must not be `main` or `master`.
- Verify the phase includes a consolidation/PR review step after write lanes and before final validation or shipping.
- **FAIL** if any branch is missing, duplicated, primary-branch named, or the consolidation/PR review gate is absent.

## Post-Integration Checks

When invoked with `--post-integration`:

1. **Lockfile audit:** Run `git diff --name-only` on the integration result. If a lockfile was modified, verify it was only touched by the designated deps lane (or the main integrating agent). If multiple lanes touched it: **FAIL**.
2. **Root config audit:** Same check for root configs. Multiple-lane modifications: **WARN**.
3. **Boundary audit:** Verify each lane's committed changes fall within its `Owns` paths. Files outside `Owns`: **WARN** per file.
4. **PR review audit:** Verify branch, commit SHA, and PR URL evidence exists for every integrated `agent-team` write lane. Missing PR evidence is **FAIL**.

## Output Format

```markdown
### Mono Guard Report

**Mode:** pre-flight | post-integration
**Profiles checked:** N
**Verdict:** PASS | WARN | FAIL

#### Results

| # | Check | Verdict | Details |
|---|-------|---------|---------|
| 1 | Lockfile Safety | PASS | pnpm-lock.yaml excluded from all 5 write lanes |
| 2 | Root Config Safety | WARN | tsconfig.base.json not in Must-not-edit for lane "bar" |
| 3 | Package Boundary Isolation | PASS | All Owns paths disjoint |
| 4 | Dependency Ordering | FAIL | lane "web" missing Depends on "foo" (apps/web depends on packages/foo) |
| 5 | Serialization Check | PASS | No install commands in write lanes |
| 6 | Install Command Check | PASS | No install intent detected |
| 7 | DAG Validity | PASS | No cycles, all references valid |
| 8 | Branch/PR Isolation | PASS | All agent-team write lanes have non-primary branches and PR review gate |

#### Failures (action required)

**Check 4 — Dependency Ordering**
- Lane `web` owns `apps/web/` which depends on `packages/foo` (owned by lane `foo`)
- Lane `web` has `Depends on: deps` but is missing `foo`
- **Fix:** Add `foo` to lane `web`'s `Depends on` field

#### Warnings (advisory)

**Check 2 — Root Config Safety**
- `tsconfig.base.json` is not in `Must not edit` for lane `bar`
- **Recommendation:** Add `tsconfig.base.json` to lane `bar`'s `Must not edit`

#### Overall Verdict: FAIL
Dispatch blocked — resolve 1 failure before running `/run`.
```

## Verdicts

- **PASS:** All checks passed. Safe to dispatch with `/run`.
- **WARN:** Advisory issues found. Dispatch is allowed but review warnings first.
- **FAIL:** Critical issues found. Do NOT dispatch — resolve failures first.

The overall verdict is the worst of any individual check (FAIL > WARN > PASS).

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/mono-guard-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/mono-guard-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not modify `tasks/todo.md`, `tasks/roadmap.md`, or any task file — output is advisory only.
- Do not run `pnpm install`, `npm install`, `yarn add`, or any package manager command.
- Do not fix issues automatically — report them with specific fix recommendations.
- For post-integration mode, do not revert or undo changes — only report violations.

## Next-Step Routing

- **On PASS:** `/run` — dispatch the validated lanes.
- **On WARN:** Review warnings, then `/run` if acceptable.
- **On FAIL:** Fix the execution profile (manually or via `/patch-exec-profile`), then re-run `/mono-guard`.
