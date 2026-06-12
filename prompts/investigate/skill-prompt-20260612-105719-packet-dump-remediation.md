---
skill: investigate
agent: codex
captured_at: 2026-06-12T10:57:19-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

# Repo-Wide Packet Dump Remediation

  ## Summary

  - Investigate the packet-dump behavior as a repo-wide contract bug, not a w3/ui-interview one-off.
  - Current read-only scan found the risky wording in 144 active pack SKILL.md files and 281 active generated ALIGNMENT-PAGE.md bundles across Codex and Claude mirrors.
  - Root cause to validate during execution: shared generated alignment guidance and copied Stage 2 lifecycle prose say “full preliminary/working packet,” which encourages agents to paste dense
    markdown instead of rendering the same content as readable HTML review UI.

  - Execution will populate tasks/roadmap.md and tasks/todo.md with the full inventory, then fix skills pack-by-pack and skill-by-skill until the risky wording is gone from active sources.

  ## Key Changes

  - Start by capturing the $investigate prompt under prompts/investigate/, then write:
      - tasks/roadmap.md: full remediation plan, root-cause notes, affected pack inventory, verification gates.
      - tasks/todo.md: checkable per-pack/per-skill queue, updated one item at a time during execution.

  - Update the canonical alignment convention and generator-owned text so alignment pages must:
      - preserve complete content without summary loss;
      - translate packet content into purposeful HTML sections, tables, matrices, gates, cards, and review modules;
      - forbid primary “Full Working Packet” / “Full Preliminary Packet” markdown dumps;
      - allow raw markdown only as a supplemental source view after the rendered review UI.

  - Update every active non-archive SKILL.md that carries the old Stage 2 sentence, one skill at a time:
      - replace “Update the review HTML alignment page with the full preliminary packet…” style wording with structured HTML rendering language;
      - keep working packet files as non-canonical staging artifacts;
      - preserve existing skill-specific additions such as lightweight packets for ord-scan / vard-scan.

  - Follow versioning rules for each touched skill:
      - run scripts/skill-archive.sh <skill-dir> before changing active SKILL.md;
      - bump the decimal version;
      - update that skill’s CHANGELOG.md.

  - Regenerate generated bundles with node scripts/upgrade-alignment-page.mjs.
  - Refresh ignored local installs (.codex/skills, .claude/skills) from the pack source so the active session skill copies no longer lag tracked skill definitions.
  - Add a tasks/lessons.md correction entry covering this pattern: no-context-loss means rendered HTML review UI, not markdown packet mirroring.

  ## Work Queue

  - Phase 1: Inventory and root-cause proof.
      - Produce a deduped affected-skill list from active non-archive files.
      - Classify hits into generated convention, shared lifecycle prose, skill-specific wording, and stale local installs.

  - Phase 2: Shared convention and tests.
      - Update docs/alignment-page-convention.md, scripts/upgrade-alignment-page.mjs if needed, and layer tests/audits that currently assert “full preliminary packet.”

  - Phase 3: Skill-by-skill remediation.
      - Work through affected packs in this order: business-research, devtool, business-growth, business-ops, creator-foundation, customer-lifecycle, game, youtube-ops, then smaller packs (ord,
        vard, remotion, product-design).

      - For each pack, update Claude/Codex mirrors together for the same skill, archive, bump, changelog, then mark that skill done in tasks/todo.md.

  - Phase 4: Regenerate and refresh.
      - Regenerate ALIGNMENT-PAGE.md bundles.
      - Refresh local ignored .codex / .claude skill installs.

  - Phase 5: Ship.
      - Verify, review the diff for unrelated changes, commit intended tracked changes, and push to master.

  ## Test Plan

  - node scripts/upgrade-alignment-page.mjs --check
  - node scripts/researchish-skill-lifecycle-audit.mjs
  - Focused layer tests:
      - npx vitest run tests/layer1/alignment-gates.test.ts
      - npx vitest run tests/layer1/researchish-skill-lifecycle-audit.test.ts
      - npx vitest run tests/layer1/upgrade-alignment-page-bespoke.test.ts

  - Regression search must show no active non-archive primary-rendering instructions containing:
      - full preliminary packet
      - full working packet
      - Full Preliminary Packet
      - Full Working Packet
      - old “Update the review HTML alignment page with the full preliminary packet” sentence

  - Any remaining hits must be archive history, storage-path references, or explicit “do not use as primary rendering” guardrails.

  ## Assumptions

  - Working packet files remain part of the staged approval lifecycle; only their HTML presentation is changing.
  - Generated ALIGNMENT-PAGE.md churn is expected after the canonical convention update.
  - Existing unrelated dirty files stay untouched unless they are part of this remediation.
  - Because this is a user correction, tasks/lessons.md must be updated before shipping.

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
