---
skill: investigate
agent: codex
captured_at: 2026-06-12T20:47:42-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix `skillpacks refresh` After Pack or Skill Renames

## Summary
- Strategy used: General investigation, no pivot.
- User claim validated: confirmed. `business-discovery` is a known alias for `business-research`, but `refreshProject()` reads stored `.agents/project.json` values directly and calls `installPack()` without normalizing or migrating stale names, so an old pack slug can abort refresh.
- Root cause: `packages/skillpacks/src/cli/lifecycle.mjs` `refreshProject()` loops over `enabled_packs` and `enabled_skills` as-is. Alias handling exists in `pack-normalization.mjs`, but only user-entered `install/remove` args use it.
- Recent history: `20a9ca32` added the `business-discovery -> business-research` alias; `ee4a4e94` introduced the Node refresh path that does not normalize stored config.

## Implementation Changes
- Add a lifecycle-level config reconciliation step for `refresh` and `doctor --fix` that:
  - Maps stale pack aliases in `enabled_packs` to active canonical pack names when the alias resolves to exactly one active pack.
  - Maps stale pack values in `enabled_skills` to the canonical active pack for that skill when the skill still exists.
  - De-duplicates canonical pack names while preserving order.
  - Writes `.agents/project.json` only when reconciliation changes config.
- Keep hibernated pack behavior unchanged: stale hibernated kanban packs should still produce the existing explicit safety diagnostic rather than silently migrate.
- Keep unknown, non-alias pack names explicit: if no active canonical target exists, fail with a clearer refresh/doctor message naming the stale config entry and suggesting `npx skillpacks remove <name>` or manual config cleanup.
- Ensure refresh then installs from the reconciled config, so it repairs missing-source skill roots caused by old canonical paths instead of failing before cleanup.
- During execution, also follow repo workflow artifacts:
  - Capture the visible `$investigate` prompt under `prompts/investigate/`.
  - Write the implementation plan to `tasks/roadmap.md` and current checklist to `tasks/todo.md`.

## Public Interfaces
- No new CLI command.
- `npx skillpacks refresh` gains backwards-compatible behavior for renamed pack/skill config entries.
- `.agents/project.json` may be updated during refresh to replace stale aliases such as `business-discovery` with canonical pack names such as `business-research`.
- Error text for refresh/doctor stale config should become more actionable, but existing successful install/remove semantics stay unchanged.

## Test Plan
- Add lifecycle tests covering:
  - `refresh` with `enabled_packs: ["business-discovery"]` rewrites config to `["business-research"]` and installs business-research skills.
  - `refresh` with both `business-discovery` and `business-research` de-duplicates to one canonical entry.
  - `refresh` with `enabled_skills` pointing at stale alias pack values rewrites those values when the skill exists in the canonical pack.
  - Hibernated pack refresh still fails with the existing PoketoWork safety message.
  - Unknown stale pack still fails with a cleanup-oriented diagnostic.
- Run:
  - `node --test packages/skillpacks/test/pack-normalization.test.mjs packages/skillpacks/test/lifecycle.test.mjs`
  - `npx skillpacks doctor`
  - `npx skillpacks refresh` against this checkout after applying the fix.

## Assumptions
- Canonical migration should be automatic only when the alias resolves to one active pack; ambiguous aliases must not silently expand into multiple packs during refresh.
- Refresh is allowed to mutate `.agents/project.json` because it already rewrites skill installs and project state.
- Prompt-history and task files are tracked repo artifacts per `AGENTS.md`, so they should be committed with the fix.

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
