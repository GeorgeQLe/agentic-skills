---
skill: investigate
agent: codex
captured_at: 2026-05-31T00:00:01-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix idea-scope-brief Alignment Approval Ordering

## Summary

Fix the verified contract defect in `idea-scope-brief`: after the coverage checkpoint, the skill must build the HTML alignment page and wait for compiled YAML approval before writing canonical `research/**/idea-brief.md`, interview logs, or `research/.progress.yaml`.

The current repo is dirty and `idea-scope-brief` already has uncommitted v0.7 rename work, so the implementation must layer on top of those changes without reverting or absorbing unrelated work.

## Key Changes

- Capture this `$investigate` invocation in `prompts/investigate/` before source edits, per repo prompt-history rules.
- Update `tasks/roadmap.md` and `tasks/todo.md` with a focused plan/checklist for this fix, then add a review/results section after validation.
- Archive current v0.7 skill contracts using `scripts/skill-archive.sh` if `archive/v0.7/SKILL.md` does not already exist.
- Bump both mirrored skills from `v0.7` to `v0.8`:
  - `global/claude/idea-scope-brief/SKILL.md`
  - `global/codex/idea-scope-brief/SKILL.md`
- Insert a new workflow step after the coverage checkpoint and before `## Output`:
  - Build `alignment/idea-scope-brief-{topic}.html` first.
  - Render the Idea/Concept Assumptions Manifest, artifact destinations, proposed file changes, coverage checkpoint, and approval gates.
  - Attempt to open the page and point the user at it.
  - Treat coverage-checkpoint confirmation as non-final; only compiled YAML approval authorizes canonical writes.
- Add a guard at the top of `## Output`:
  - Do not write canonical idea briefs, interview logs, or `research/.progress.yaml` until the alignment page has compiled YAML approval.
- Update both `CHANGELOG.md` files with `v0.8 - 2026-05-31`, referencing `tasks/lessons.md`’s existing “approval-gated research needs alignment preview before approval” lesson.
- Preserve Claude/Codex differences already present: `/command` syntax for Claude, `$command` syntax and Codex interview cadence for Codex.

## Tests And Validation

- Add/extend a layer1 contract test so mirrored `idea-scope-brief` skills are explicitly checked for:
  - alignment preview before canonical writes,
  - compiled YAML approval requirement,
  - coverage checkpoint not being final approval,
  - no downstream routing before approved artifacts are written.
- Run targeted validation:
  - `pnpm --dir tests test:layer1`
  - `pnpm --dir tests verify --skill idea-scope-brief`
  - `bash scripts/skill-versions.sh --missing`
  - `bash scripts/skill-archive-audit.sh --strict`
  - `git diff --check`
- Run `bash init.sh` after source updates to refresh managed global installs and update `.agentic-skills-managed` `source_version`/`source_sha` markers. If sandbox blocks writing to global skill dirs, request escalation for that command.
- Confirm mirror parity for the inserted approval-gate text while allowing intentional Claude/Codex command syntax differences.

## Shipping

- Stage only intended files for this fix: prompt history, task docs for this fix, mirrored `idea-scope-brief` skills/changelogs/archives, and the focused test update.
- Do not stage unrelated existing dirty-tree changes.
- Commit on `master` with a focused message, then push to `origin/master`.
- If preexisting unrelated changes prevent a clean targeted commit or push, stop and report the exact blocker instead of reverting user work.

## Assumptions

- The current artifact names are `idea-brief`, not the older `concept-brief` names from the report; the fix should use current v0.7/v0.8 terminology.
- No new lesson is needed because `tasks/lessons.md` already records this exact approval-preview pattern.
- The fix is scoped to `idea-scope-brief`; a cross-skill approval-ordering audit is separate work.

<skill>
<name>investigate</name>
<path>/home/georgeqle/projects/tools/dev/agentic-skills/.codex/skills/investigate/SKILL.md</path>
---
name: investigate
description: Validate user claims against codebase and git history, trace to root cause, and propose a fix
type: debugging
version: v0.1
---

# Investigate

Invoke as `$investigate`.

Use this skill when the user reports a bug, error, unexpected behavior, or provides observations/hypotheses about what they think is wrong. Validates claims against the codebase and git history before tracing to root cause.

## Workflow

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

## Output Format

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


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/investigate-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
