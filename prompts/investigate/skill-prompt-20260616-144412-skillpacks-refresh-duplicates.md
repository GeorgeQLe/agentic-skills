---
skill: investigate
agent: codex
captured_at: 2026-06-16T14:44:12-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix `skillpacks refresh` Duplicate Framework Skill Installs

## Summary
- Confirmed the user’s claim: `business-research` installs top-level framework skills like `five-rings`, `pmf-engine`, and `w3-hypothesis`, while `customer-discovery` also contains those same framework skills under `customer-discovery/frameworks/*`.
- Root cause: the manifest treats every non-archived `packs/*/{claude,codex}/**/SKILL.md` as an installable skill, and `refresh` reinstalls every manifest skill for enabled packs.
- Work with existing dirty `packages/skillpacks` changes; do not revert them.

## Key Changes
- Add an `installable` boolean to generated manifest skill entries:
  - `true` for top-level pack skills: `packs/<pack>/<agent>/<skill>/SKILL.md`.
  - `true` for base skills.
  - `false` for nested framework/subskill entries such as `packs/business-research/codex/customer-discovery/frameworks/pmf-engine/SKILL.md`.
- Update CLI lifecycle and pack normalization to use only installable skills for:
  - pack installs and refreshes,
  - exact individual skill install resolution,
  - pack skill counts used for expected installed roots,
  - remove/prune expected-skill calculations.
- Keep nested framework files copied inside their parent skills, excluding `archive/`, so `customer-discovery/frameworks/*/SKILL.md` remains available inside the parent install.
- Make `refresh` prune repo-managed installed roots that are no longer expected after syncing. This removes previously generated top-level duplicate roots like `.codex/skills/pmf-engine` while leaving unmanaged local skill directories untouched.
- During implementation, first capture the `$investigate` prompt log and task files required by repo workflow instructions.

## Test Plan
- Add manifest tests proving framework/subskill entries remain in the manifest but have `installable: false`.
- Add lifecycle tests:
  - `install business-research` installs `customer-discovery` but does not create top-level `five-rings`, `pmf-engine`, or `w3-hypothesis`.
  - nested framework files still exist inside `.codex/skills/customer-discovery/frameworks/*`.
  - `refresh` removes old repo-managed top-level framework duplicate roots after the manifest marks them non-installable.
  - unmanaged same-name local roots are not deleted.
- Run focused checks:
  - `pnpm --dir packages/skillpacks test`
  - manifest build/check command used by the package, if available in `package.json`.

## Assumptions
- Framework skills under `frameworks/` are child implementation assets, not standalone install targets.
- Existing framework inventory visibility should be preserved through the manifest, so the fix should filter install behavior rather than deleting framework entries outright.
- The current unrelated dirty app/debug files and existing base-skill install changes are user work and must be preserved.

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
