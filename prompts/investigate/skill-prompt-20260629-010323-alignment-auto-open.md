---
skill: investigate
agent: codex
captured_at: 2026-06-29T05:03:23Z
source: user-invocation
prompt_scope: visible-user-invocation
---

## Visible User Invocation

```text
A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Investigate Alignment Auto-Open Omission

## Summary

- Treat the issue as verified agent noncompliance, not a skill-contract gap.
- Evidence now includes the target repo page at `/Users/georgele/projects/web/dev/new-ship-city/alignment/w3-hypothesis-new-ship-city.html` and Claude session logs showing:
  - Initial W3 handoff at `04:15:54` told the user to open the page manually without the required open-status.
  - User then said `open it`; the agent ran bare `open ...` at `04:18:20`.
  - Revision triage later confirmed the same omission and only then ran `npx skillpacks alignment pages open ...`, which returned `opened`.
- Leave customer-discovery and w3-hypothesis contracts unchanged; `ALIGNMENT-PAGE.md:118` already requires the right behavior.

## Key Changes

- Add a prompt-history file under `prompts/investigate/` containing the exact visible `$investigate ...` invocation and pasted context.
- Add a `tasks/lessons.md` entry: after any alignment/interrogation page write or revision, run the required browser-open helper immediately and report one of `focused`, `opened`, `fallback-opened`, `blocked`, or `failed` before handoff.
- Do not modify `ALIGNMENT-PAGE.md`, `SKILL.md`, generated convention files, or the unrelated dirty package files in this repo.

## Verification

- Cite the controlling contract at `packs/business-research/codex/customer-discovery/frameworks/w3-hypothesis/ALIGNMENT-PAGE.md:118`.
- Cite session evidence from:
  - `/Users/georgele/.claude/projects/-Users-georgele-projects-web-dev-new-ship-city/1c846e91-048d-4161-9431-c493e3c411b6.jsonl`
  - `/Users/georgele/.claude/projects/-Users-georgele-projects-web-dev-new-ship-city/c07737a6-470d-432e-99a2-96ec6e3747ab.jsonl`
- Confirm current helper feasibility with `node scripts/open-html-page.mjs /Users/georgele/projects/web/dev/new-ship-city/alignment/w3-hypothesis-new-ship-city.html --browser auto --dry-run --json`, which reports `status: "opened"` on Darwin.
- Confirm intended repo changes are limited to `prompts/investigate/...` and `tasks/lessons.md`.

## Assumptions

- No skill-contract change is warranted because the contract is explicit and the tool path worked in the target repo.
- The durable fix is lesson capture plus future behavioral compliance.
- The target page has already been opened successfully after the correction, so execution should not re-open it unless explicitly asked.
```

## Visible Skill Context

```text
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
```

## Visible Follow-Up Before Implementation

```text
should we not tighten things to ensure there is no non-compliance?
```

## Visible Scope Follow-Up During Implementation

```text
should the language tightening be around specific skills or across the board?
```
