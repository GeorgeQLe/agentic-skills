---
name: debug
description: Investigate a problem, log it to the debug changelog, cross-check past issues, and suggest a non-duplicate fix.
type: debugging
version: 1.0.0
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

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/debug-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/debug-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/debug-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
