---
name: mono-plan
description: Detect monorepo structure, identify shared chokepoints, and generate safe parallel lane specs aligned to package boundaries
type: planning
version: v0.0
argument-hint: "<phase-number> [optional: path to roadmap if not tasks/roadmap.md]"
---

# Mono Plan

Generate monorepo-safe parallelization lane specs for a roadmap phase. Detects package boundaries, shared chokepoints (lockfiles, root configs), and internal dependency ordering to produce lane specifications in the exact format that `/plan-phase` expects for execution profiles.

Run this **after** `/roadmap` sets `agent-team` or `implementation-safe` on a phase and **before** `/plan-phase` decomposes it.

## Prerequisites

- `tasks/roadmap.md` must exist with at least one phase.
- The project must be a monorepo (detected in step 1).

## Process

1. **Detect monorepo structure:**
   - Check for `pnpm-workspace.yaml`, `turbo.json`, `lerna.json`, or `package.json` `workspaces` field.
   - If none found, report "not a monorepo" and stop — this skill does not apply.
   - Record the monorepo tool (pnpm workspaces, Turborepo, Lerna, npm workspaces).

2. **Enumerate packages:**
   - Parse the workspace config to list all packages and apps with their paths.
   - Read each package's `package.json` to collect `name`, `dependencies`, and `devDependencies`.

3. **Build internal dependency graph:**
   - For each package, identify which other workspace packages it depends on.
   - Compute a topological ordering. Flag cycles as errors.

4. **Identify shared chokepoints:**
   - **Lockfiles:** `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb` — any that exist in the repo root.
   - **Root configs:** `tsconfig.base.json`, `tsconfig.json` (root), `turbo.json`, `tailwind.config.*`, `.env*`, `jest.config.*`, `vitest.config.*`, `eslint.config.*`, `.eslintrc.*` — any root-level config that packages inherit.
   - **High-fan-out shared packages:** workspace packages depended on by 3+ other packages.

5. **Read the target phase:**
   - Parse `tasks/roadmap.md` (or the path from `$ARGUMENTS`) for phase `$ARGUMENTS[0]`.
   - Extract the phase's Scope, Acceptance Criteria, and any existing parallelization hints.

6. **Map phase scope to packages:**
   - Match the phase's scope description to specific packages.
   - Classify each relevant package as:
     - **Independent:** no internal dependencies on other in-scope packages.
     - **Dependent:** depends on another in-scope package (must wait for it).
     - **Shared:** a high-fan-out package that multiple lanes would need — requires careful ownership.

7. **Recommend parallelization strategy:**
   - If all packages are independent and GitHub branch/PR review is available → `agent-team` with one branch-backed lane per package.
   - If linear dependency chain → `serial` or `implementation-safe` with ordered lanes.
   - If mixed and GitHub branch/PR review is available → `agent-team` with dependency edges between branch-backed lanes.
   - If scope touches only root configs or shared packages → downgrade to `serial`.
   - If branch push or PR review is unavailable → downgrade to `implementation-safe`, `research-only`, or `serial`.

8. **Generate lane specs:**
   - **Lane 0 — deps (serial, conditional):** If ANY lane's scope requires adding dependencies (`pnpm add`, `npm install`, etc.), generate a serial deps lane that:
     - `Owns:` all lockfiles and root `package.json`
     - `Mode: write`
     - `Depends on: none`
     - `Scope:` "Install all dependencies needed by subsequent lanes. Do NOT implement features."
   - **Package lanes (one per independent package or group):**
     - `Owns: packages/<name>/` (or `apps/<name>/`)
     - `Must not edit:` all lockfiles, all root configs, all paths owned by other lanes
     - `Branch:` `agent-team/phase-N-<package-or-lane>`; never `main` or `master`
     - `Mode: write`
     - `Depends on:` Lane 0 (if it exists) + lanes for upstream internal dependencies
     - `Scope:` the phase work scoped to this package. Append: "Do NOT run pnpm install, npm install, yarn add, or any command that modifies the lockfile. Commit to your assigned branch, push it, and open or update a draft PR before returning."
   - **Consolidation/PR review lane (required for `agent-team`):** Add a `Mode: review` lane depending on all write lanes. Its scope must inspect every branch/PR, validate changed paths against `Owns` and `Must not edit`, record blocker/advisory findings, and approve only lanes safe to integrate.

9. **Validate lane specs:**
   - Every lockfile appears in `Must not edit` for ALL write lanes except the deps lane.
   - `Owns` paths are disjoint across all lanes — no prefix overlaps.
   - `Depends on` references are valid lane names with no cycles.
   - No lane's `Scope` contains install/add commands (except the deps lane).

## Output Format

```markdown
### Mono Plan: Phase N

**Monorepo tool:** pnpm workspaces / Turborepo / etc.
**Packages in scope:** N of M total

#### Shared Chokepoints
- `pnpm-lock.yaml` — lockfile (root)
- `tsconfig.base.json` — shared TypeScript config
- `packages/ui` — depended on by 5 packages

#### Package Dependency Graph (in-scope)
- `packages/foo` → independent
- `packages/bar` → depends on `packages/foo`
- `apps/web` → depends on `packages/foo`, `packages/bar`

#### Recommended Strategy
**Parallel mode:** agent-team
**Rationale:** [why this mode fits]

#### Lane Specifications

- Lane: deps
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: Install all dependencies needed by subsequent lanes. Do NOT implement features.
  - Owns: `pnpm-lock.yaml`, `package.json` (root)
  - Must not edit: `packages/*/`, `apps/*/`
  - Depends on: none
  - Deliverable: lockfile and root package.json updated

- Lane: foo
  - Agent: general-purpose
  - Role: implementer
  - Mode: write
  - Scope: [phase work for foo]. Do NOT run pnpm install or any lockfile-modifying command.
  - Owns: `packages/foo/`
  - Must not edit: `pnpm-lock.yaml`, `tsconfig.base.json`, `packages/bar/`, `apps/web/`
  - Branch: `agent-team/phase-N-foo`
  - Depends on: deps
  - Deliverable: branch name, commit SHA, validation evidence, PR URL, and changed paths

- Lane: consolidation-pr-review
  - Agent: general-purpose
  - Role: reviewer
  - Mode: review
  - Scope: Review every lane branch/PR, verify path boundaries, classify findings as blocker/advisory, and approve only safe lanes for integration.
  - Depends on: foo, [all other write lanes]
  - Deliverable: PR review summary, blocker/advisory findings, approved branches, and integration order

[...more lanes...]
```

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/mono-plan-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/mono-plan-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not modify `tasks/roadmap.md`, `tasks/todo.md`, or any task file — output is advisory only.
- Do not run `pnpm install`, `npm install`, `yarn add`, or any package manager command.
- Do not create lanes for packages outside the phase's scope.
- If the phase scope is ambiguous (can't map to specific packages), enter plan mode and ask the user via `AskUserQuestion`.
- Maximum 12 parallel write lanes — if more packages are in scope, group related packages into combined lanes.
- Do not recommend `agent-team` if the project cannot push lane branches to GitHub and review PRs; use `implementation-safe`, `research-only`, or `serial` instead.

## Next-Step Routing

- **Next command:** `/plan-phase N` — incorporate the lane specs into the execution profile.
- **Before dispatch:** `/mono-guard` — validate the final execution profile.
