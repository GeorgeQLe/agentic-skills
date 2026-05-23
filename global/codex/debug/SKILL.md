---
name: debug
description: Investigate a problem, log it to the debug changelog, cross-check past issues, and suggest a non-duplicate fix.
type: debugging
version: v0.0
---

# Debug

Invoke as `$debug`.

Investigate a reported problem, maintain a persistent debug changelog (`docs/debug-changelog.md`), and propose a fix that avoids repeating past solutions.

## Workflow

1. Parse the error message, stack trace, or bug description.
2. Capture environment context: current branch, recent commits, uncommitted changes.
3. Ensure `docs/debug-changelog.md` exists (create `docs/` directory and file if missing).
4. Read the full debug changelog and search for prior entries matching the current symptom.
5. If a match is found, report what was tried before and whether the recurrence is systemic.
6. Trace the execution path from the symptom to the root cause, reading only files in the chain.
7. Check recent git history for changes that may have introduced the issue.
8. Propose a minimal fix, cross-checking the changelog to avoid repeating a previously failed approach.
9. Apply the fix, write or update tests, and run them to verify.
10. Prepend a structured entry to `docs/debug-changelog.md` with: date, symptom, category, severity, root cause, fix, test results, related entries, and systemic flag.

## Output Format

- **Problem**: Symptom, new or recurring
- **Root Cause**: file:line, what's wrong, when introduced
- **Fix Applied**: approach, files modified, test results
- **Changelog Updated**: entry added, any cross-references
- **Prevention**: what check would have caught this earlier; systemic follow-up if applicable

## Constraints

- Always read the full debug changelog before proposing a fix.
- Do not refactor unrelated code.
- Never duplicate a previously failed fix without justification.
- If the root cause can't be determined, report what was ruled out.
- Always run tests after applying the fix.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/debug-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/debug-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
