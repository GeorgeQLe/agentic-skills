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
   - Resolve named skills from `global/codex`, `global/claude`, `packs`, project-local `.agents`, `.codex`, `.claude`, and installed `~/.codex/skills` or `~/.claude/skills` as read-only fallback evidence.
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
