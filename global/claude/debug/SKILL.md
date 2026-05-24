---
name: debug
description: Investigate a problem, log it to the debug changelog, cross-check past issues, and suggest a non-duplicate fix
type: debugging
version: v0.0
argument-hint: <error message, bug description, or symptom>
---

# Debug

Investigate a reported problem, maintain a persistent debug changelog (`docs/debug-changelog.md`), and propose a fix that avoids repeating past solutions.

## Process

1. **Parse the input** from `$ARGUMENTS`:
   - Error message or stack trace → extract file paths, line numbers, error types.
   - Bug description → identify expected vs. actual behavior.
   - If no arguments provided, ask the user what to debug.

2. **Capture environment snapshot:**
   - Current git branch, last 5 commits (`git log --oneline -5`), and any uncommitted changes (`git status --short`).
   - Note the date and working directory.
   - Read `CLAUDE.md` for project conventions.

3. **Ensure the debug changelog exists:**
   - If `docs/` does not exist, create it.
   - If `docs/debug-changelog.md` does not exist, create it with this template:

   ```markdown
   # Debug Changelog

   Persistent log of investigated issues, root causes, and applied fixes.

   <!-- Entries are prepended below in reverse-chronological order -->
   ```

4. **Check for prior occurrences:**
   - Read `docs/debug-changelog.md` in full.
   - Search for entries matching the current symptom — look for similar error messages, affected files, root cause areas, or categories.
   - If a match is found:
     - Report what was tried before (the fix, whether it worked, any notes).
     - Flag if the recurrence suggests a **systemic issue** that needs deeper attention beyond a point fix.
   - If no match is found, note this is a new issue.

5. **Investigate the problem:**
   - Follow the execution path from the symptom to the source.
   - Read only the files in the chain — do not explore the full codebase.
   - Check for common causes: null/undefined, wrong types, missing env vars, stale imports, race conditions, schema mismatches, config drift.
   - Check `git log --oneline -20` for recent changes that may have introduced the issue.
   - If relevant tests exist, run them to confirm the current broken state.

6. **Propose a fix:**
   - Write the minimal code change that fixes the root cause.
   - **Cross-check the changelog**: if a similar fix was attempted before and failed or recurred, choose a different approach or escalate to a broader refactor.
   - If tests exist, update them. If not, write a test that would have caught this.
   - Run the relevant tests to confirm the fix works.

7. **Log the entry** by prepending a new entry to `docs/debug-changelog.md` immediately below the header comment:

   ```markdown
   ## [YYYY-MM-DD] Short title of the problem

   - **Symptom**: What was observed
   - **Category**: regression | logic | config | dependency | types | infra | performance
   - **Severity**: critical | high | medium | low
   - **Environment**: branch, relevant commit(s)
   - **Root Cause**: `file:line` — one-sentence explanation
   - **Fix Applied**: What was changed (files, approach)
   - **Tests**: Pass/fail status after fix
   - **Related Entries**: Links to prior changelog entries if applicable, or "None"
   - **Systemic?**: Yes/No — if yes, describe what recurring pattern this reveals
   - **Notes**: Anything else useful for future debugging
   ```

8. **Report to the user** using the output format below.

## Output Format

### Problem
- **Symptom**: What was reported
- **New or recurring**: First occurrence / Seen before on [date] — [what was tried]

### Investigation
- **Root Cause**: `file:line` — explanation
- **Introduced by**: commit hash or "pre-existing"

### Fix
- **Approach**: What was changed and why this approach (especially if a different approach was tried before)
- **Files modified**: List
- **Test results**: Pass/fail

### Changelog Updated
- Entry added to `docs/debug-changelog.md`
- Related entries: [any cross-references]

### Prevention
- What test, lint rule, or check would have caught this earlier
- If systemic: recommended follow-up action

## Constraints
- Always read the full debug changelog before proposing a fix — never skip the cross-check.
- Do not refactor unrelated code while fixing the bug.
- Do not guess — if you can't trace the root cause, say so and list what you've ruled out.
- Always run tests after applying the fix.
- Never duplicate a previously failed fix without a clear reason why it will work this time.
- If the fix requires changes outside the current project (infra, env vars, external service), document what's needed in the changelog entry instead of attempting it.
- Keep changelog entries concise but complete — they are the institutional memory for debugging.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/debug-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/debug-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
