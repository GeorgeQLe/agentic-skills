---
name: scaffold
description: Generate a new package or app in the monorepo following established project conventions
type: execution
version: v0.0
argument-hint: <type> <name> (e.g. "package utils" or "app admin-dashboard")
---

# Scaffold

Generate a new package or app in the monorepo that follows the project's established conventions and patterns.

For product/app workflows, `/scaffold` is normally downstream of research, prototype consolidation, production specification, roadmap, and phase planning. Use it when `/roadmap` or `/plan-phase` identifies that the next implementation step needs a new app/package root. Do not route from `/concept-exploration`, `/bootstrap-repo`, `/icp`, `/competitive-analysis`, `/journey-map`, `/ux-variations`, or `/ui-interview` directly to `/scaffold` unless the user explicitly asks to create a minimal shell first.

## Process

1. **Parse the input** from `$ARGUMENTS`:
   - Extract the type (`package` or `app`) and the name.
   - If not provided or unclear, ask the user.

2. **Learn the project's conventions:**
   - Read `.agents/project.json` when present. If it is missing, run or recommend `/pack recommend` and include the likely project type in the scaffold plan.
   - If this scaffold creates a new project root, include `.agents/project.json` and install the matching local pack with `scripts/pack.sh install <pack>` after the root exists.
   - Read `CLAUDE.md` and `AGENTS.md` for project structure and conventions.
   - Read the monorepo config (`turbo.json`, `pnpm-workspace.yaml`, or equivalent).
   - Identify the directory pattern:
     - Where do packages live? (`packages/`, `libs/`, etc.)
     - Where do apps live? (`apps/`, `services/`, etc.)

3. **Find a reference to copy from:**
   - List existing packages/apps of the same type.
   - Read the most recently created one (by git log) as the template.
   - Identify the standard files:
     - `package.json` (scripts, dependencies, exports)
     - `tsconfig.json` (extends pattern)
     - Source structure (`src/`, `index.ts`, etc.)
     - Test setup (if present)
     - Any other config files (`.eslintrc`, `tailwind.config.*`, etc.)

4. **Enter plan mode:**
   - Enter plan mode using EnterPlanMode.
   - Present the scaffold plan:
     - Directory: where it will be created
     - Files to generate (with brief content description)
     - Dependencies to include
     - Reference package used as template
   - Wait for user approval.

5. **Generate the scaffold after approval:**
   - If Claude Code already returned to normal mode after approval, do not call ExitPlanMode again; continue directly with generation. Only use the plan-mode exit tool when the session is still visibly in plan mode.
   - Create the directory structure.
   - Generate each file, adapting the template:
     - Update `name` in `package.json` to match the new package name.
     - Update paths and references.
     - Create minimal placeholder source files (`src/index.ts` with a basic export).
     - Include the standard test setup if the project uses tests.
   - Run `pnpm install` (or equivalent) to link the new package.
   - Run type-checking to verify the scaffold compiles.

## Output Format

### Scaffolded
- **Type**: package/app
- **Name**: `@scope/name`
- **Location**: `packages/name/`

### Files Created
- `packages/name/package.json`
- `packages/name/tsconfig.json`
- `packages/name/src/index.ts`
- ...

### Next Steps
- What the user should do next (add dependencies, implement features, wire up routes, etc.)

## Next-Step Routing

- If the scaffold was created as part of an active roadmap/phase, recommend `/run` to continue the current implementation step.
- If the user explicitly requested an early shell before research, keep the next route on the research-first product workflow: `/icp` when the concept is ready and business-discovery is enabled, otherwise `/pack install business-discovery`.
- If the scaffold is for a non-product package with no pending roadmap item, recommend `/roadmap` or `/plan-phase` only when implementation sequencing is missing.

## Constraints
- Always use an existing package/app as the reference template — do not invent conventions.
- Do not install domain packs globally; use project-local pack symlinks.
- Always enter plan mode before creating files.
- Do not call ExitPlanMode from normal mode. If Claude Code reports "You are not in plan mode" after approval, treat approval as complete and continue implementation.
- Do not add unnecessary boilerplate — keep the scaffold minimal and consistent with existing packages.
- If the project does not appear to be a monorepo, inform the user and ask how to proceed.
- Do not install external dependencies beyond what the template uses.
- Do not treat scaffolding as product validation. It creates structure only; ICP, market, journey, UX, UI, and prototype decisions belong to their upstream skills.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/scaffold-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/scaffold-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
