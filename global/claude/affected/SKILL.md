---
name: affected
description: Analyze which monorepo packages and apps are affected by current changes
type: analysis
version: v0.0
argument-hint: "[optional: specific commit range or branch to analyze]"
---

# Affected

Determine which packages and apps in the monorepo are affected by current changes. Useful before committing, testing, or deploying to know the blast radius.

## Process

1. **Determine the change set:**
   - If `$ARGUMENTS` specifies a commit range or branch, use `git diff` for that range.
   - Otherwise, use `git diff HEAD` (staged + unstaged changes).
   - If no changes exist, check for unpushed commits with `git log @{u}..HEAD`.

2. **Read the monorepo structure:**
   - Check for `turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, or `package.json` workspaces to understand the package graph.
   - List all packages/apps and their locations.

3. **Map changes to packages:**
   - For each changed file, determine which package it belongs to.
   - List directly changed packages.

4. **Compute transitive dependents:**
   - Read `package.json` of each directly changed package to find its `name`.
   - Search other packages' `package.json` files for dependencies on the changed packages.
   - Build the full dependency chain (direct → transitive).

5. **Check for cross-cutting changes:**
   - Root config changes (`tsconfig.json`, `turbo.json`, `.env*`, `tailwind.config.*`) affect all packages.
   - Shared package changes (e.g., `packages/ui`, `packages/config`) cascade to consumers.

6. **Identify what to test:**
   - If Turborepo: suggest `turbo run test --filter=...[HEAD~1]` or equivalent.
   - Otherwise: list the test commands for each affected package.

## Output Format

### Directly Changed
- `packages/foo` — 3 files changed (briefly what)
- `apps/bar` — 1 file changed (briefly what)

### Transitively Affected
- `apps/web` — depends on `packages/foo`
- `apps/admin` — depends on `packages/foo` via `packages/shared`

### Cross-Cutting
- `tsconfig.base.json` changed — affects all TypeScript packages

### Recommended Test Commands
```bash
# commands to test affected packages
```

## Constraints
- Do not run tests — only analyze and recommend.
- If the monorepo tool is Turborepo, prefer Turbo-native filtering where possible.
- Keep the output concise — list packages, not individual files (unless scoped to a single package).


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/affected-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/affected-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
