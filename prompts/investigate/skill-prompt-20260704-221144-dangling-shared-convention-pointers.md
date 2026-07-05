---
skill: investigate
agent: codex
captured_at: 2026-07-04T22:11:44-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

$investigate Dangling shared-convention pointers downstream
GAP
~12 base skills carry Follow the shared shipping contract convention in CLAUDE.md, but the whole ## Shared Skill Conventions block has no seeding path and is absent from AGENTS.md entirely — so those pointers resolve only in the dev repo and dangle in every consumer repo. Fix: seed the block via provision-agentic-config, inline it per skill, or ship it through the doc-registry like alignment-page. The confirmed provision-agentic-config AGENTS-vs-CLAUDE ### Alignment Page Convention asymmetry is the same failure in miniature.

<skill>
<name>investigate</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/investigate/SKILL.md</path>
---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
type: debugging
version: v0.3
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
7. Propose the minimal implementation plan, including files to change and tests to run.
8. **Permission Gate**: Ask the user for explicit permission before editing files, applying patches, running write-capable generation commands, or otherwise implementing the fix. Do not implement from this skill until the user approves.
9. After approval, apply the minimal fix and write or update tests.
10. Run tests to verify the fix and check for regressions.

## Output

- **Strategy Used**: UI / Data / General (auto-detected or flag-forced), whether a pivot occurred
- **User Claims Validated**: For each claim — verdict (confirmed/partially correct/not supported) and evidence. Skip if input was a plain error message.
- **Root Cause**: file:line, what's wrong, when introduced, relationship to user's theory
- **Proposed Fix**: files to modify, implementation outline, tests to run, and the explicit permission question
- **Fix Applied**: files modified, test results. Include only after the user has approved implementation.
- **Prevention**: what check would have caught this earlier

## Constraints

- Do not refactor unrelated code.
- Validate user claims before assuming they're correct — observations are a starting point, not ground truth.
- If the root cause can't be determined, report what was ruled out.
- Do not implement fixes without explicit user permission after reporting the investigation findings and proposed fix.
- Always run tests after applying an approved fix.


## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
