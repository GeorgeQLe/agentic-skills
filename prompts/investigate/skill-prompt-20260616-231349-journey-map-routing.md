---
skill: investigate
agent: codex
captured_at: 2026-06-16T23:13:49-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

$investigate Can you review this and the conversation history in the relevant repo to determine how to prevent the non-compliance related to routing? Target

  Current session, repo /Users/georgele/projects/tools/dev/alignmeant, focused on $journey-map next-step routing after approving alignment/journey-map-alignmeant.html.

  Evidence sources:

  - Active conversation.
  - .codex/skills/session-triage/SKILL.md
  - .codex/skills/journey-map/SKILL.md
  - .claude/skills/journey-map/SKILL.md
  - research/alignmeant/_working/journey-map-run.yaml
  - research/alignmeant/journey-map-jtbd-timeline.md
  - research/alignmeant/journey-map-experience-map.md
  - research/.progress.yaml
  - tasks/todo.md, tasks/history.md

  User-Identified Issue

  You flagged that “there is no journey-map next step routing,” correcting my previous “what’s next” answer.

  Verification Verdict: Partially Verified

  Not verified as stated: the $journey-map skill does have explicit next-step routing for this exact state.

  Verified related issue: my prior state update introduced non-contract fields into research/alignmeant/_working/journey-map-run.yaml. The journey-map contract says the run manifest stores selected
  frameworks and intermediate paths only; progress is resolved from canonical intermediate existence, not status or approval fields.

  Relevant contract evidence:

  - State B triggers when “run manifest exists, all selected intermediates exist, no canonical journey-map.md.”
  - Current repo has:
      - research/alignmeant/_working/journey-map-run.yaml
      - research/alignmeant/journey-map-jtbd-timeline.md
      - research/alignmeant/journey-map-experience-map.md
      - no research/alignmeant/journey-map.md

  - Therefore the correct next heavy phase is State B synthesis.
  - The contract also allows $journey-map --synthesize to force State B.

  Timeline

  1. You pasted final approval YAML for alignment/journey-map-alignmeant.html.
  2. I canonicalized research/alignmeant/journey-map-experience-map.md and archived the working packet.
  3. You asked “what’s next?”
  4. I answered: run $journey-map alignmeant.
  5. You corrected: $session-triage there is no journey-map next step routing.
  6. Triage found the skill does route to State B synthesis, but my manifest edit added fields outside the manifest contract.

  Root Cause

  Two issues:

  1. Agent noncompliance with manifest contract.
     I updated the run manifest with status and approval fields. The skill says the manifest stores selection only, and done/pending state comes from canonical intermediate existence.

  2. Imprecise next-step wording.
     The safest next command is $journey-map --synthesize or $journey-map research/alignmeant, because the next phase is specifically State B synthesis. My $journey-map alignmeant answer is
     probably resolvable through product-path ID, but it is less explicit than the contract’s path/force-synthesis route.

  Responsible Contract Gap

  None in $journey-map: the State B routing is present and clear.

  The gap is in my execution: I didn’t follow the run-manifest contract exactly after canonicalizing the framework intermediate.

  Recommended Fix

  Do not change the skill contract. Fix the repo state narrowly:

  File: research/alignmeant/_working/journey-map-run.yaml

  Recommended shape:

  orchestrator: journey-map
  slug: alignmeant
  selected_frameworks:
    - slug: jtbd-timeline
      intermediate: research/alignmeant/journey-map-jtbd-timeline.md
    - slug: experience-map
      intermediate: research/alignmeant/journey-map-experience-map.md

  Then the next command should be:

  $journey-map --synthesize

  or:

  $journey-map research/alignmeant

  Expected next output is not the canonical journey-map.md immediately; it should first produce the synthesis review page for approval.

  Validation Plan

  Run:

  rg -n "status:|approval:|blocking_feedback|needs_revision" research/alignmeant/_working/journey-map-run.yaml
  test -f research/alignmeant/journey-map-jtbd-timeline.md
  test -f research/alignmeant/journey-map-experience-map.md
  test ! -f research/alignmeant/journey-map.md

  Then replay the skill resolver:

  - manifest exists
  - all selected intermediates exist
  - canonical journey-map.md missing
  - therefore State B synthesis.

  Confidence And Gaps

  Confidence: high on the routing diagnosis, because the skill contract and filesystem state line up cleanly.

  Evidence gap: I did not run $journey-map --synthesize; this triage only verified the next route.

  Recommended Next Skill

  None. This is a one-file repo-state correction, not a skill-contract change.

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

<skill>
<name>session-triage</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/session-triage/SKILL.md</path>
---
name: session-triage
description: Investigate one immediate session, correction, repo incident, or skill failure and recommend a verified fix
type: analysis
version: v0.1
argument-hint: "[session id/file, repo path, skill name/path, correction text, or issue description]"
---

# Session Triage

Invoke as `$session-triage`.

Use this skill when the user wants a focused investigation of one immediate issue: a current conversation problem, one correction, one session, one repo incident, one failed run, or one suspected skill failure. This skill verifies what happened before recommending a durable fix.

Use `$analyze-sessions` instead when the user wants broad cross-session trends, recurring frustration analysis, performance evaluation over time, repeated prompt patterns, or automation opportunities.

## Inputs

- Active conversation context.
- Optional session ID, session file, or exported log.
- Optional repository path or current working directory.
- Optional skill name or `SKILL.md` path.
- Optional user correction text, error output, test failure, log excerpt, file path, commit, or issue description.

## Process

1. Define the investigation scope:
   - Treat the current conversation and current working directory as the default scope.
   - Prefer user-provided session IDs, files, repo paths, skill names, exact correction phrases, errors, logs, and test failures over broad history searches.
   - Resolve named skills from `base/codex`, `base/claude`, `packs`, project-local `.agents`, `.codex`, `.claude`, and installed `~/.codex/skills` or `~/.claude/skills` as read-only fallback evidence.
   - Do not create an `$analyze-session` alias or route; use this distinct command name to avoid singular/plural confusion.

2. Gather narrow evidence first:
   - Read the target skill contract when a skill is named.
   - Read directly relevant project instructions such as `AGENTS.md`, `CLAUDE.md`, task docs, pack docs, logs, or test output.
   - Search only the scoped repo/session/history for the issue text, skill name, invocation command, relevant file paths, user correction, and nearby agent actions.
   - Include the active conversation as evidence when the correction is happening now.
   - Broaden to `$analyze-sessions` only when recurrence, frequency, or trend evidence is needed.

3. Verify the issue before diagnosing:
   - Separate the **user-identified issue** from the **agent-verified issue**.
   - Classify the verification verdict as `verified`, `partially verified`, `not verified`, or `inconclusive`.
   - A verified issue requires evidence for what the agent did, what the skill/repo/user contract required, and why the outcome was wrong or risky.
   - If evidence shows the skill contract was adequate and the agent ignored it, say that directly.

4. Build a concise timeline:
   - User request or trigger.
   - Skill or instruction that should have applied.
   - Agent action or omission.
   - Failure, correction, or observed impact.
   - Relevant repo/session state.

5. Diagnose root cause:
   - Identify whether the cause is a missing trigger, ambiguous trigger, missing evidence gate, insufficient scope resolution, weak output contract, bad next-step routing, missing validation, missing safety constraint, stale mirrored contract, repo instruction conflict, or agent noncompliance with an adequate contract.
   - Compare Claude and Codex skill versions when both exist and flag mirrored drift.
   - Check `tasks/lessons.md` when working in `agentic-skills`; reuse existing lessons or recommend a new lesson when the pattern is novel.
   - For benchmark failures, check recent same-skill `benchmark/triage-<skill>-*.md` reports and `tasks/lessons.md` before recommending a narrow tolerance patch. If two or more recent reports classify the same family of valid outputs as benchmark false negatives, stop patching individual phrasings and route to a generalized rubric, semantic evaluator, fixture-family, or infrastructure-classifier fix that covers the family.

6. Recommend the smallest durable fix:
   - Name exact skill file(s), instruction file(s), or docs to change.
   - Provide concrete rule text or workflow-step wording when a skill-contract change is justified.
   - Include validation checks that prove the revised behavior prevents the issue, such as targeted `rg` checks, mirrored contract checks, version checks, replay of the decision path, or the failing test/log command.
   - For repeated benchmark false-negative families, the recommended fix must name the owning harness or setup file, the family-level behavior to recognize or reject, positive and negative fixture shapes to add, and a validation command such as focused layer1 setup tests plus `pnpm --dir tests verify --skill <skill>`.
   - Route verified skill changes to `$targeted-skill-builder` for a narrow update or `$create-agentic-skill` for a new repo-managed skill.

## Output

Produce a structured report with:

- Target: session/repo/skill scope and evidence sources.
- User-identified issue: the user's claim in concise terms.
- Verification verdict: `verified`, `partially verified`, `not verified`, or `inconclusive`, with supporting evidence.
- Timeline: short sequence from trigger to correction or impact.
- Root cause: the specific contract gap, repo conflict, or agent noncompliance pattern.
- Responsible contract gap: skill, project instruction, task doc, or none.
- Recommended fix: exact file(s), section(s), and proposed wording or behavior change.
- Validation plan: commands or checks to prove the fix.
- Confidence and evidence gaps: what is known, what could not be verified, and whether `$analyze-sessions` is needed for recurrence analysis.
- Recommended next skill: `$targeted-skill-builder`, `$create-agentic-skill`, `$analyze-sessions`, or `none` when no follow-up is justified.

## Constraints

- Start narrow and evidence-bound; do not scan all local history by default.
- Do not claim a user-identified issue is agent-verified without independent evidence.
- Do not modify the target skill during analysis unless the user also asked for implementation and the active workflow permits edits.
- Do not recommend a skill change when the evidence points only to one-off agent noncompliance and the contract is already clear.
- Do not create or suggest `$analyze-session`; use `$session-triage`.
- Do not create or modify GitHub Actions workflows.
- If a source is missing or unreadable, report that clearly and continue with available evidence instead of guessing.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
