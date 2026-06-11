---
skill: investigate
agent: codex
captured_at: 2026-06-11T13:05:32-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Strict Exact Skillpacks Install Resolution

## Summary
- Fix `npx skillpacks install exec` so it installs the exact `exec` skill, not the `exec-loop` pack.
- Change install resolution to strict exact matching only: exact skill name, exact pack name, or exact pack title.
- Remove install-time alias and fuzzy fallback behavior; keep remove behavior unchanged unless tests show it shares install-only code paths that must be split.

## Root Cause
- In `packages/skillpacks/src/cli/pack-normalization.mjs`, `resolveInstallToken()` currently checks `normalizePack(token)` before exact skill names.
- `normalizePack('exec')` maps through `PACK_ALIAS_GROUPS` to `['exec-loop']`, so the pack wins before the exact `exec` skill can be considered.
- Focused test suite currently passes, confirming there is no regression guard for this case.

## Key Changes
- Update install resolution order and policy in `pack-normalization.mjs`:
  - Exact active skill name -> `skills`.
  - Exact active pack name -> `packs`.
  - Exact active pack title -> `packs`.
  - Hibernated pack/skill safety checks remain before unknown-name failure.
  - No alias or fuzzy skill resolution for `install`.
- Add pack-title lookup from `manifest.packs[].title`.
  - Pack names match exact slug values like `exec-loop`.
  - Pack titles match exact title text after trimming and collapsing whitespace; case-insensitive is acceptable for title ergonomics, but partial matches are not.
  - `exec`, `exec-loop`, and `Exec Loop Pack` resolve differently: `exec` -> skill, `exec-loop` -> pack, `Exec Loop Pack` -> pack.
- Preserve `remove` behavior unless strict install changes require a helper split. Do not change lifecycle install/link behavior.

## Tests
- Add focused tests in `packages/skillpacks/test/pack-normalization.test.mjs`:
  - `install exec` resolves `{ packs: [], skills: ['exec'] }`.
  - `install exec-loop` resolves `{ packs: ['exec-loop'], skills: [] }`.
  - `install "Exec Loop Pack"` resolves `{ packs: ['exec-loop'], skills: [] }`.
  - install aliases such as `quality` and fuzzy names such as `icp` are rejected with `Unknown pack or skill`.
  - exact skill names such as `enterprise-icp` still install.
- Add a lifecycle-level CLI regression in `packages/skillpacks/test/lifecycle.test.mjs` or the existing Node resolution block proving `runSkillpacksCli(['install', 'exec'])` creates `.claude/.codex` `exec` skill installs and does not enable `exec-loop` in `.agents/project.json`.
- Run:
  - `node --test packages/skillpacks/test/pack-normalization.test.mjs`
  - `node --test packages/skillpacks/test/lifecycle.test.mjs`
  - `pnpm --dir packages/skillpacks test` if available.

## Assumptions
- “Strict Exact Only” applies to `install`; `remove` can continue accepting aliases/fuzzy matches for cleanup unless the implementation reveals shared logic that makes this unsafe.
- Pack title support means exact manifest `title` matching, not substring matching.
- During execution, also capture the visible `$investigate` prompt under `prompts/investigate/`, update `tasks/roadmap.md` and `tasks/todo.md`, then commit and push intended tracked changes per repo instructions.

<skill>
<name>investigate</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/investigate/SKILL.md</path>
---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
type: debugging
version: v0.1
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
