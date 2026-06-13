---
skill: investigate
agent: codex
captured_at: 2026-06-12T21:29:35-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Skillpack Repository Organization And Deploy Gating Plan

## Summary

Evaluate and improve the current single-repository setup by adding clear ownership zones, deploy gating, and artifact hygiene before considering a repo split. The working hypothesis is that the main pain is not the monorepo itself, but unclear boundaries between skill source work, generated workflow artifacts, CLI/package work, and the Vercel-hosted Skills Showcase.

Validated starting facts:
- The repo is a workspace with `apps/skills-showcase` and `packages/skillpacks`.
- Recent churn is concentrated in `packs/`, with meaningful activity also in `global/`, `tasks/`, `prompts/`, `alignment/`, and the showcase app.
- No repo-level `vercel.json` exists, so Vercel auto-deploy behavior is likely controlled by Vercel project settings or default Git integration behavior.
- `tasks/deploy.md` already defines the intended Vercel project root as `apps/skills-showcase/`.

## Key Changes

- Create a repo boundary audit that classifies tracked paths into:
  - Skill source: `packs/`, `global/`
  - Skillpack CLI/package: `packages/skillpacks/`
  - Showcase app/runtime: `apps/skills-showcase/`
  - Showcase generated/static assets: `docs/skills-showcase/`, app public generated assets
  - Workflow evidence: `tasks/`, `prompts/`, `alignment/`, `research/`, `specs/`
  - Archive/hibernated work: `archive/`
- Define a Vercel deploy trigger policy:
  - Deploy only when showcase runtime, showcase generated assets, shared dependency manifests, or deploy config changes.
  - Do not deploy for skill-only, prompt-history-only, task-doc-only, alignment-only, archive-only, or package-only changes unless they affect generated showcase data.
- Add an ignored-build gate for Vercel, preferably as a script committed in the repo and configured in Vercel project settings.
  - The script should compare the deploy commit range and exit in the Vercel-compatible “skip build” mode when only non-showcase paths changed.
  - The path allowlist should include `apps/skills-showcase/**`, `docs/skills-showcase/**`, root package/workspace lockfiles, and any scripts that generate showcase data.
- Update documentation so agents know the difference between:
  - “ship source changes”
  - “refresh generated showcase data”
  - “deploy the showcase”
  - “record workflow evidence”
- Add a cleanup recommendation for history pollution:
  - Keep generated local install roots untracked.
  - Keep prompt/task/alignment artifacts tracked when required by workflow, but classify them as non-deploying evidence.
  - Avoid mixing unrelated skill, app, and evidence changes in one commit unless a ship manifest explicitly justifies the boundary.

## Implementation Steps

1. Audit current repository zones and produce `tasks/repo-boundary-audit.md`.
   - Include file counts, recent churn by zone, and which zones can trigger Vercel today.
   - Validate user claims as confirmed, partially confirmed, or unsupported with concrete git/history evidence.

2. Add deploy-gating design documentation.
   - Update `tasks/deploy.md` with the path-based deploy policy.
   - Add a clear note that a deploy contract existing does not mean every commit should deploy.

3. Implement a Vercel ignored-build helper script.
   - Add a script under `scripts/`, for example `scripts/vercel-ignore-build.sh`.
   - It should skip builds for commits that only touch workflow evidence, skill source, archives, prompts, or non-showcase package work.
   - It should allow builds for showcase app/assets, relevant root manifests, and showcase data generation scripts.

4. Add focused verification.
   - Add lightweight tests or shell checks for the ignored-build path classifier.
   - Include representative cases:
     - `packs/**` only skips deploy.
     - `tasks/**` and `prompts/**` only skip deploy.
     - `apps/skills-showcase/**` deploys.
     - `docs/skills-showcase/**` deploys.
     - root package/workspace manifest changes deploy.
     - mixed skill plus showcase changes deploy.

5. Record the operating model.
   - Update task docs with the final boundary, review notes, and remaining migration options.
   - Keep “split showcase repo” and “split core packages” as escalation options only if deploy gating and artifact policy fail to reduce operational pain.

## Test Plan

- Run the ignored-build classifier against synthetic changed-file lists.
- Run `git diff --check`.
- Run any added unit/shell tests for the deploy gate.
- Run `scripts/validate-skills-showcase-data.sh` if generated showcase data paths are touched.
- Run `pnpm --dir apps/skills-showcase build` only if showcase runtime or generated assets are changed.
- Confirm the final Vercel project setting should point to the new ignored-build script.

## Assumptions

- Keep one Git repository for now.
- Optimize first for preventing unintended Vercel deploys and making commit boundaries understandable.
- Do not rewrite Git history.
- Do not split repositories during this phase.
- Do not create or modify GitHub Actions.
- Prompt-history capture for this `$investigate` invocation should be handled during execution, not during this planning-only turn.

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
