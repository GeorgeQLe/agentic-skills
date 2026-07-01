---
skill: investigate
agent: codex
captured_at: 2026-07-01T09:45:58-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Move YouTube Owner Analytics Work To New Repo

## Summary
Create a new private GitHub repo `GeorgeQLe/youtube-owner-analytics`, attach it to a local checkout at `/Users/georgele/projects/tools/youtube-owner-analytics`, seed it with the approved alignment context, then remove only the copied alignment page from `agentic-skills`.

## Key Changes
- New repo setup:
  - Create GitHub repo via `gh api user/repos` with `name=youtube-owner-analytics`, `private=true`, and no GitHub Actions.
  - Initialize local repo at `/Users/georgele/projects/tools/youtube-owner-analytics`.
  - Add remote `origin=https://github.com/GeorgeQLe/youtube-owner-analytics.git`.
  - Use `master` as the primary branch to match current repo convention.

- New repo seed content:
  - Copy `research/youtube-owner-analytics-platform.md` to `research/youtube-owner-analytics-platform.md`.
  - Copy `alignment/investigate-youtube-owner-analytics-platform.html` to the same path in the new repo.
  - Add `tasks/next-step.yaml` containing the exact YAML from the user prompt.
  - Add a concise `README.md` stating this repo owns the YouTube owner analytics wrapper work and that the next step is to run `$investigate` with `tasks/next-step.yaml`.

- Cleanup in `agentic-skills`:
  - Delete `alignment/investigate-youtube-owner-analytics-platform.html`.
  - Remove its card from `alignment/index.html` and decrement the page/category counts.
  - Leave `research/youtube-owner-analytics-platform.md` in place as historical source context.
  - Do not touch the pre-existing dirty package metadata files.

- Shipping:
  - Commit and push the new repo seed.
  - Commit and push the `agentic-skills` cleanup separately.
  - Keep the two repo histories independent.

## Test Plan
- New repo:
  - `git status --short --branch`
  - `test -f alignment/investigate-youtube-owner-analytics-platform.html`
  - `test -f research/youtube-owner-analytics-platform.md`
  - `test -f tasks/next-step.yaml`
  - `git remote -v`
  - `git push -u origin master`

- Old repo:
  - `test ! -f alignment/investigate-youtube-owner-analytics-platform.html`
  - `node scripts/audit-alignment-pages.mjs`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
  - `git status --short --branch` to confirm only unrelated package metadata edits remain after commit.

## Assumptions
- The new repo should be private.
- The new local path should be `/Users/georgele/projects/tools/youtube-owner-analytics`.
- The old repo keeps the research brief but removes the active alignment page.
- Executing this will require filesystem approval for the new directory because it is outside the current writable root.

<skill>
<name>investigate</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/investigate/SKILL.md</path>
---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
type: debugging
version: v0.2
---

# Investigate

Invoke as `$investigate`.

Use this skill when the user reports a bug, error, unexpected behavior, or provides observations/hypotheses about what they think is wrong. Validates claims against the codebase and git history before tracing to root cause.

## Process

1. Parse the error message, stack trace, bug description, or user observations/claims.
2. **Select investigation strategy** from flags or auto-detection:
   - `--ui`: Visual/layout bugs — start from component tree, styles, animations, transitions, spacing, theming, skeleton/loading states, positioning. Signal words: skeleton, animation, spacing, popover, transition, theme, truncated, glitch, dead space, detached, pop-in, flickering, layout, z-index, overflow.
   - `--data`: Data/state bugs — start from data pipeline, state management, timers, counters, sync logic. Signal words: countdown, percentage, usage, sync, stale, timer, refresh, reset, missing data, wrong number, out of sync, not updating, mismatch.
   - General (default): Errors, crashes, behavioral bugs, and anything ambiguous — start from symptom/stack trace.
   - If input has signals from both UI and data, prefer data strategy — wrong data commonly manifests as a visual symptom.
3. If the user provides claims or hypotheses, validate each one against the codebase and git history (`git log`, `git diff`, `git blame`). Classify each as confirmed, partially correct, or not supported by evidence. Report findings before proceeding.
4. Trace using the selected strategy:
   - **UI**: component tree → styles → layout → animation/transition → render lifecycle. Check CSS conflicts, missing keys, layout thrashing, transition timing.
   - **Data**: data source → transform → store → subscription → render. Check stale closures, missing dependency arrays, incorrect comparisons, cache invalidation, timer drift.
   - **General**: execution path from symptom to source — null/undefined, wrong types, missing env vars, stale imports, race conditions, schema mismatches.
   - If the initial strategy hits a dead end, pivot to the other — a UI bug may have a data root cause, and vice versa.
5. Check recent git history for changes that may have introduced the issue.
6. Identify the root cause with file and line reference.
7. Apply a minimal fix and write or update tests.
8. Run tests to verify the fix and check for regressions.

## Output

- **Strategy Used**: UI / Data / General (auto-detected or flag-forced), whether a pivot occurred
- **User Claims Validated**: For each claim — verdict (confirmed/partially correct/not supported) and evidence. Skip if input was a plain error message.
- **Root Cause**: file:line, what's wrong, when introduced, relationship to user's theory
- **Fix Applied**: files modified, test results
- **Prevention**: what check would have caught this earlier

## Constraints

- Do not refactor unrelated code.
- Validate user claims before assuming they're correct — observations are a starting point, not ground truth.
- If the root cause can't be determined, report what was ruled out.
- Always run tests after applying the fix.


## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
