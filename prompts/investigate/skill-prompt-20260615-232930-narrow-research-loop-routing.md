---
skill: investigate
agent: codex
captured_at: 2026-06-15T23:29:30-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Narrow Research Loop Routing Guardrails

## Summary
Replace the broad “Do not include `Recommended next command`” rule with a precise approval-boundary rule: research orchestrators must not route to downstream or cross-skill work while an approval gate is pending, but they must explicitly tell the user the same-orchestrator command that continues the current Research Session Loop after YAML review.

## Key Changes
- Update the Research Session Loop convention to distinguish:
  - `Recommended next command after compiling YAML:` for pending review pages.
  - `Recommended next command:` for confirmed parent-loop continuation after approved artifacts are written.
- Update the Codex Pattern A orchestrators:
  - `competitive-analysis`
  - `customer-discovery`
  - `positioning`
  - `journey-map`
- Revise their report-first approval language so it bans only downstream/cross-skill routing before approval, not same-skill loop continuation.
- Ensure framework subskills remain route-free; the parent orchestrator remains the only user-facing continuation command during framework loops.

## Versioning And Repo Hygiene
- Capture this `$investigate` prompt under `prompts/investigate/`.
- Archive each changed skill with `scripts/skill-archive.sh` before bumping versions.
- Bump skill versions and update changelogs:
  - `competitive-analysis v0.22 -> v0.23`
  - `customer-discovery v1.10 -> v1.11`
  - `positioning v0.20 -> v0.21`
  - `journey-map v0.19 -> v0.20`
- Write implementation tracking to `tasks/roadmap.md` and `tasks/todo.md`, then add verification results to `tasks/todo.md`.
- Leave unrelated untracked files, including `prompts/expert-review/`, untouched.

## Test Plan
- Run targeted `rg` checks confirming the broad ban is gone or narrowed in each orchestrator.
- Confirm each parent-loop skill names its own explicit recommended continuation command.
- Run `bash scripts/skill-versions.sh --missing`.
- Run any available routing audit, especially `node scripts/skill-alignment-routing-audit.mjs` if present.
- Run `git diff --check`.

## Assumptions
- This is a behavior/documentation change to the skill contracts, so each affected skill needs a version bump and archive.
- No framework subskill changes are needed unless verification reveals conflicting route guidance.
- Downstream next-step recommendations remain allowed only after final synthesized artifacts are approved and written.

<skill>
<name>investigate</name>
<path>/home/georgeqle/projects/tools/dev/agentic-skills/.codex/skills/investigate/SKILL.md</path>
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
