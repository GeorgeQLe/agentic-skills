---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
type: debugging
version: v0.1
argument-hint: <error, bug description, user observations, or issue URL> [--ui] [--data] [--plan]
---

# Investigate

Given a bug report, error message, unexpected behavior, or user observations about what they think is wrong, validate claims against the codebase and git history, trace to root cause, and propose a fix.

## Process

1. **Parse the input** from `$ARGUMENTS`:
   - Error message or stack trace → extract file paths, line numbers, error types
   - Bug description → identify the expected vs. actual behavior
   - User claims/observations → extract each specific claim to validate (e.g., "I think the auth middleware is stripping the header," "this worked before the last deploy," "the database query is returning stale data")
   - Issue URL → fetch the issue details via `gh`
   - Check for `--plan` flag → if present, force plan output mode (write fix steps to `tasks/todo.md` instead of applying inline)
   - Check for `--ui` or `--data` flag → if present, skip auto-detection and use that investigation strategy (see step 1b)
   - If no arguments provided, ask the user what to investigate.

1b. **Select investigation strategy:**

   If `--ui` or `--data` flag is set, use that strategy directly. Otherwise, auto-detect from the input:

   - **UI strategy** (`--ui`): Use when the problem is visual — layout, spacing, animation, transitions, skeleton/loading states, theming, colors, popovers, positioning, truncation, responsive behavior, CSS.
     - Signal words: skeleton, animation, spacing, popover, transition, theme, truncated, glitch, dead space, detached, pop-in, flickering, layout, positioning, z-index, overflow.
   - **Data strategy** (`--data`): Use when the problem is wrong values, stale state, sync mismatches, timers, counters, missing data, or data pipeline issues.
     - Signal words: countdown, percentage, usage, sync, stale, timer, refresh, reset, missing data, wrong number, out of sync, not updating, mismatch.
   - **General strategy** (default): Use for errors/crashes (stack traces, console errors, server errors), behavioral bugs (wrong flow, missing options, incorrect form behavior), and anything ambiguous.

   If the input contains signals from multiple strategies (e.g., "the countdown shows wrong AND the animation glitches"), start with the data strategy — wrong data is more commonly the root cause that manifests as a visual symptom.

2. **Gather context** (varies by strategy):

   All strategies:
   - Read `CLAUDE.md` for project conventions.
   - Check `git log --oneline -20` for recent changes that may have introduced the issue.
   - If the user references specific files, commits, or timeframes, read those directly.

   **UI strategy** — start from the component tree:
   - Identify the component(s) rendering the affected area.
   - Read the component file(s) and their styles (CSS modules, Tailwind classes, styled-components).
   - Trace the render path: parent → child → conditional renders → animation/transition logic.
   - Check for CSS specificity conflicts, z-index stacking, overflow rules, and layout model issues (flex/grid).
   - If the component uses loading/skeleton states, trace the state transition that swaps skeleton → content.

   **Data strategy** — start from the data pipeline:
   - Identify the data source (API, store, local state, timer, computed value).
   - Trace the data flow: source → transformations → state management → component prop.
   - Check for stale caches, missing refresh triggers, incorrect timer intervals, timezone/epoch issues.
   - Compare the expected value computation against the actual one — read the business logic, not just the display.
   - If multiple components show the same data differently, find where they diverge in the pipeline.

   **General strategy** — start from the symptom:
   - If a stack trace is available, start from the crash site and read those files.
   - If behavioral, identify the relevant feature area and read entry points.

3. **Validate user claims** (when the user provides observations or hypotheses):
   - Extract each distinct claim the user has made.
   - For each claim, verify it against the codebase and git history:
     - Read the files the user references — does the code behave as they describe?
     - Check `git log`, `git diff`, and `git blame` on relevant files — does the history support their timeline?
     - If the user says "this used to work" or "this changed recently," use `git log --all -- <file>` and `git diff <commit range>` to verify.
   - Classify each claim as: **confirmed**, **partially correct** (right intuition, wrong detail), or **not supported by evidence**.
   - Report findings before proceeding to trace — the user's mental model may be off, and correcting it early saves time.

4. **Trace the issue:**
   - Follow the execution path from the symptom to the source.
   - Read only the files in the chain — do not explore the full codebase.
   - **UI strategy**: trace component tree → styles → layout → animation/transition → render lifecycle. Check for CSS conflicts, missing keys, layout thrashing, and transition timing.
   - **Data strategy**: trace data source → transform → store → subscription → render. Check for stale closures, missing dependency arrays, incorrect comparisons, cache invalidation, and timer drift.
   - **General strategy**: check for null/undefined, wrong types, missing env vars, stale imports, race conditions, schema mismatches, config drift.
   - If the initial strategy hits a dead end, pivot to the other strategy — a "UI bug" may have a data root cause, and vice versa.
   - If the issue was introduced by a recent commit, identify which one with `git log` or `git bisect` logic.
   - If user claims were partially correct or unsupported, trace from the actual evidence rather than the user's hypothesis.

5. **Verify the hypothesis:**
   - Look for test coverage of the affected code path.
   - Check if the bug is reproducible from the code alone (no need to run the app unless necessary).
   - If there are related tests, run them to confirm the current state.

6. **Apply or plan the fix:**
   - **Determine fix mode:**
     - If `--plan` flag is set → **plan mode** (always write to `tasks/todo.md`)
     - If fix requires 3+ discrete steps across multiple files → **plan mode**
     - Otherwise → **inline mode** (apply fix directly)
   - **Inline mode** (default for single contained fixes):
     - Write the minimal code change that fixes the root cause.
     - If tests exist, update them. If not, write a test that would have caught this.
     - Run the relevant tests to confirm the fix works and no regressions.
   - **Plan mode** (multi-step fixes or `--plan` flag):
     - Do NOT apply code changes. Proceed to step 7.

7. **Write fix steps to `tasks/todo.md`** (plan mode only):
   - Read existing `tasks/todo.md` if present — do NOT overwrite existing content.
   - Append a new section:
     ```
     ## Investigation Fix: [concise title of the issue]

     - [ ] Step description — `file/path.ext` — why this change is needed
     - [ ] Step description — `file/path.ext` — why this change is needed
     ...
     - [ ] Verify: run [specific test command or acceptance criterion]
     ```
   - Each item must specify: what to change, which file, and why.
   - Final item must be an acceptance criterion (run tests, verify behavior).
   - Order steps by dependency — changes that other steps depend on come first.

## Output Format

### Strategy Used
- **Mode**: UI / Data / General (and whether auto-detected or flag-forced)
- **Pivoted**: Yes/No — if the initial strategy didn't find the root cause and a different layer was the actual source

### User Claims Validated
For each claim the user made:
- **Claim**: What the user said
- **Verdict**: Confirmed / Partially correct / Not supported
- **Evidence**: What the code or git history actually shows

_(Skip this section if the input was a plain error message or stack trace with no user hypotheses.)_

### Root Cause
- **Location**: `file:line`
- **What's wrong**: One-sentence explanation
- **Introduced by**: commit hash or "pre-existing" if not recent
- **Relationship to user's theory**: How this connects to (or diverges from) what the user suspected

### Fix Applied
_(Shown in inline mode)_
- Files modified and what changed
- Test results

### Fix Steps Written
_(Shown in plan mode — replaces "Fix Applied")_
- Written to `tasks/todo.md` under `## Investigation Fix: [title]`
- Number of steps and summary
- Run `/run` to execute the fix steps sequentially

### Prevention
- What test or check would have caught this earlier

## Constraints
- Do not refactor unrelated code while fixing the bug.
- Do not guess — if you can't trace the root cause, say so and list what you've ruled out.
- Always validate user claims before assuming they're correct — the user's observations are a starting point, not ground truth.
- Always run tests after applying the fix (inline mode).
- If the fix requires changes outside the current project (infra, env vars, external service), document what's needed instead of attempting it.
- Do not write to `docs/debug-changelog.md` — that is `/debug`'s domain.
- Do not write to `tasks/todo.md` for single-step fixes unless `--plan` is explicitly set.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/investigate-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/investigate-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
