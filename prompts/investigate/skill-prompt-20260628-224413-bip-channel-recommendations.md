---
skill: investigate
agent: codex
captured_at: 2026-06-28T22:44:19-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

## Visible User Message 1

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# BIP Channel Recommendations + Rankings

## Summary
Change the BIP target-channel gate from “all channels default to `not-now`” to “agent recommends and ranks relevant channels, with recommended channels preselected for user confirmation.” BIP remains an approval checkpoint: no channel-specific drafting happens until the user approves the channel-selection response.

## Key Changes
- Update `docs/alignment-page-convention.md` so BIP pages must:
  - Rank target channels by fit using evidence from the completed Stage 2 work.
  - Mark each channel with `recommended`, `optional`, or `not-now`.
  - Preselect `recommended` channels by default while allowing the user to override each channel.
  - Treat a submitted target-channel gate as channel-selection approval only, not final BIP approval.
  - Load social convention files only after the selected/recommended channel set is approved.
- Preserve safety boundaries:
  - No draft posts, video ideas, or channel-specific content before channel selection is approved.
  - Every recommendation must include source basis, fit rationale, claim risk, and reason for non-recommended channels.
- Regenerate bundled `ALIGNMENT-PAGE.md` files with `node scripts/upgrade-alignment-page.mjs` rather than hand-editing generated bundles.

## Tests
- Update `tests/layer1/alignment-gates.test.ts` to assert the canonical and generated bundle text includes:
  - Agent-ranked channel recommendations.
  - `recommended` / `optional` / `not-now` statuses.
  - Preselected recommended channels require user confirmation.
  - Channel-selection response is not final BIP approval.
- Run:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `npm run test -- tests/layer1/alignment-gates.test.ts`
  - `node scripts/audit-alignment-pages.mjs`
  - `node scripts/audit-task-docs.mjs`

## Task + Shipping Requirements
- In execution mode, first write the required `$investigate` prompt history file under `prompts/investigate/`.
- Update `tasks/roadmap.md` and `tasks/todo.md` before implementation, then add a review/results section after verification.
- Update `tasks/lessons.md` because this came from user correction of the prior conservative default.
- Commit and push the completed tracked changes on the primary branch, unless explicitly told not to.

## Assumptions
- “Agent recommendations plus rankings” means the agent may preselect recommended channels, but the user must still approve before drafts are generated.
- No SKILL.md version bump is needed unless implementation touches a skill’s behavior text directly; generated `ALIGNMENT-PAGE.md` bundles are convention artifacts.

## Visible User Message 2

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
