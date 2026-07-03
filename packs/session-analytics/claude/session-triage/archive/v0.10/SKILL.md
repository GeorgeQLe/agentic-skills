---
name: session-triage
description: Investigate one immediate session, correction, repo incident, or skill failure and recommend a verified fix
type: analysis
version: v0.10
argument-hint: "[session id/file, repo path, skill name/path, correction text, or issue description]"
---

# Session Triage

Use this skill when the user wants a focused investigation of one immediate issue: a current conversation problem, one correction, one session, one repo incident, one failed run, or one suspected skill failure. This skill verifies what happened before recommending a durable fix.

Use `/analyze-sessions` instead for informational history questions — single or trend — such as broad cross-session breakdowns, recurring frustration analysis, performance over time, repeated prompt patterns, automation opportunities, finding a past conversation, or checking one run's token spend. This skill owns live incidents that need a verified fix.

## Inputs

- Active conversation context.
- Optional session ID, session file, or exported log.
- Optional repository path or current working directory.
- Optional skill name or `SKILL.md` path.
- Optional user correction text, error output, test failure, log excerpt, file path, commit, or issue description.
- Optional `benchmark regression` mode: invoked as `/session-triage <skill> benchmark regression` by `/benchmark-test-skill` when `agentic-skills-benchmarks/scripts/benchmark-regression-check.mjs` reports a `regression` verdict. The prior-vs-new delta block (passRate, Wilson lower bound, output-quality, status badge, prior and new grade dates) is carried in as evidence; the appended grade rows live in `agentic-skills-benchmarks/benchmark/grade-history.json`.

## Process

1. Define the investigation scope:
   - Treat the current conversation and current working directory as the default scope.
   - Prefer user-provided session IDs, files, repo paths, skill names, exact correction phrases, errors, logs, and test failures over broad history searches.
   - Resolve named skills from `base/codex`, `base/claude`, `packs`, project-local `.agents`, `.codex`, `.claude`, and installed `~/.codex/skills` or `~/.claude/skills` as read-only fallback evidence.
   - Do not create an `/analyze-session` alias or route; use this distinct command name to avoid singular/plural confusion.

2. Gather narrow evidence first:
   - Read the target skill contract when a skill is named.
   - Read directly relevant project instructions such as `AGENTS.md`, `CLAUDE.md`, task docs, pack docs, logs, or test output.
   - Search only the scoped repo/session/history for the issue text, skill name, invocation command, relevant file paths, user correction, and nearby agent actions.
   - Include the active conversation as evidence when the correction is happening now.
   - Broaden to `/analyze-sessions` only when recurrence, frequency, or trend evidence is needed.

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
   - For benchmark failures, check recent same-skill `agentic-skills-benchmarks/benchmark/triage-<skill>-*.md` reports and `tasks/lessons.md` before recommending a narrow tolerance patch. If two or more recent reports classify the same family of valid outputs as benchmark false negatives, stop patching individual phrasings and route to a generalized rubric, semantic evaluator, fixture-family, or infrastructure-classifier fix that covers the family.
   - For a `benchmark regression` invocation, the absolute thresholds may still pass — the issue is a *drop relative to the prior grade*. Use the carried delta and `agentic-skills-benchmarks/benchmark/grade-history.json` to confirm the regression is real (not a one-run sampling artifact: small evaluated-run counts and wide Wilson intervals can move >=10pp by chance — say so and recommend a confirming re-run when the sample is thin). Then classify the cause:
     - **Real behavioral regression** — the skill contract or a dependency changed and the agent now produces worse output. This is a managing-layer skill defect: emit the managing-layer handoff payload (step 6) naming the contract section that drifted. To confirm the loop closes, apply the Pack Availability Guard first; if `agentic-skills-bench` is unavailable, recommend `npx skillpacks install agentic-skills-bench` before re-running `/benchmark-test-skill <skill>` to verify the grade recovers in `grade-history.json`.
     - **Harness / rubric drift** — the skill behavior is unchanged but a setup, fixture, evaluator, or pricing/threshold change moved the score. Reuse the false-negative-family logic above (steps 5-6): name the owning harness/setup file and the family-level behavior to recognize, rather than patching one phrasing.

6. Recommend the smallest durable fix. First classify **where the defect lives** — this decides the handoff:

   - **Managing-layer defect** — the fault is in a shared **skill** contract, a **convention page** (`docs/*-convention.md`, `CLAUDE.md`, shared process/routing docs), or **workflow routing/process**. The fix belongs in the managing `agentic-skills` repo and must reach every install. Produce a **managing-layer handoff payload** (YAML, below) for an agent running *in the agentic-skills directory* to implement, publish, and refresh. There is no separate skill-builder skill to route to.
   - **Invoking-directory defect** (rare) — the fault is in the current/consuming project itself (its own code, local config, or project instructions), not in a shared skill/convention/process. The fix belongs in that directory. Produce a plain **in-place patch report**: exact files in the current directory, the concrete change, and local verification. Do not route to the managing repo or emit the YAML payload.

   For either branch:
   - Name exact file(s), section(s), and proposed wording or behavior change.
   - Provide concrete rule text or workflow-step wording when a contract change is justified.
   - Include validation checks that prove the revised behavior prevents the issue, such as targeted `rg` checks, mirrored contract checks, version checks, replay of the decision path, or the failing test/log command.
   - For repeated benchmark false-negative families, the recommended fix must name the owning harness or setup file, the family-level behavior to recognize or reject, positive and negative fixture shapes to add, and a validation command such as focused layer1 setup tests plus `pnpm --dir tests verify --skill <skill>`.

   **Canonical Fix Target (managing-layer branch — mandatory):**
   - The fix **target** is the canonical source-of-truth in the managing `agentic-skills` repo. For a skill: `packs/<pack>/{claude,codex}/<skill>/SKILL.md` (resolve `<pack>` with `scripts/pack.sh which <skill>`; fall back to legacy `base/{claude,codex}/<skill>` only if the skill has not migrated to `packs/`). For a convention or process rule: the authoring source under `docs/` (e.g. `docs/*-convention.md`) or `CLAUDE.md`, **never** a generated per-skill convention bundle.
   - Update **both** the claude and codex canonical variants together when both exist (same mirrored-drift rule as step 5 — a fix landing on only one variant leaves the mirror stale).
   - **Never** name a managed mirror or installed copy as the fix target: `.claude/skills/…`, `.codex/skills/…`, `~/.claude/skills/…`, `~/.codex/skills/…`, `~/.npm/**/skillpacks/…`, `packages/skillpacks/build/…`, or a consuming repo's local `.claude/skills`. These are read-only *evidence* only (see step 1). A patch that lands on one of these is a non-fix: it does not propagate to the shared skill or any other install.
   - **Cross-directory rule:** when this skill runs from a consuming or other directory (cwd is not the managing `agentic-skills` repo), the managing-layer fix still routes back to the managing repo's canonical source via the payload. Do **not** edit the local installed copy in the current directory as the fix. If the managing repo is not checked out locally, say so and stop rather than patching a mirror.

   **Managing-layer handoff payload (the fix routes to an agent, not a builder skill):**
   - Emit a self-contained YAML payload that any agent running in the agentic-skills repo can execute directly, following `docs/session-triage-handoff-contract.md`. Shape:

     ```yaml
     # Invoke with: run this in the agentic-skills repo to implement + publish the fix
     command: "implement-skill-fix"        # descriptive; not a skill command
     defect_class: skill | convention | routing-process
     target:                               # canonical source-of-truth only
       - packs/<pack>/claude/<skill>/SKILL.md
       - packs/<pack>/codex/<skill>/SKILL.md
     fix: |
       <exact rule text / section change>
     publish_refresh:
       - scripts/skill-archive.sh <skill-dir>; bump version; update CHANGELOG
       - git add <edits>; npm run skillpacks:build; git add manifest; commit together; push
       - scripts/pack.sh refresh
     verify:
       - <rg checks / mirror version check / failing test or log cmd>
     ```
   - The payload must carry the canonical target path(s), the exact fix, the full **publish + refresh loop** (archive/version bump → update both variants + CHANGELOG → `git add` edits → `npm run skillpacks:build` → `git add` regenerated manifest → commit source+manifest **together** → push → `scripts/pack.sh refresh`; consumers run `npx skillpacks install/refresh` + `/reload-skills`, `/clear` or restart if still invisible), and the verification checks. A managing-layer fix is not complete until published and refreshed. The managed mirrors are gitignored and regenerated by refresh — never hand-edit them.

7. Optionally enrich the persistent insights memory (secondary writer):
   - When the triaged incident is a verified, generalizable pattern (not a pure one-off), append it to the machine-local `.session-insights/insights.md` store that `/analyze-sessions` accumulates, so live incidents and cross-session trends share one memory.
   - The store is gitignored and may not exist yet; create it with the standard keyed table header (`| Insight | Category | First Seen | Last Seen | Occurrences | Status |`) if absent. If a semantically matching row already exists, increment its Occurrences and advance Last Seen instead of adding a duplicate; otherwise add a row with Occurrences `1` and Status `confirmed` (triage incidents are verified).
   - This is additive memory only — `tasks/lessons.md` remains the authoritative correction log; do not move lessons content into the insights store.

## Pack Availability Guard

Before recommending another skill, verify the target skill itself is available before relying on pack availability:

- Treat `.agents/project.json` `enabled_skills.<skill-name>` as direct availability, even when the provider pack is not listed in `enabled_packs`.
- Treat `.agents/project.json` `enabled_packs` as availability only when the enabled pack provides the target skill; use `scripts/pack.sh which <skill-name>` when available to identify the provider.
- Treat local or global skill files as direct availability evidence, including `.claude/skills/<skill-name>/SKILL.md`, `.codex/skills/<skill-name>/SKILL.md`, `~/.claude/skills/<skill-name>/SKILL.md`, and `~/.codex/skills/<skill-name>/SKILL.md`.

If the target skill is unavailable, recommend `npx skillpacks install <pack-or-skill>` from the project shell before the skill invocation. Prefer the provider pack when it is known; otherwise recommend installing the target skill by name. Tell Claude users to run `/reload-skills`, then `/clear` or restart if the skill remains invisible after install.

For benchmark regression loop-closing, treat `/benchmark-test-skill` as owned by `agentic-skills-bench`: check whether `.agents/project.json` `enabled_packs` includes `agentic-skills-bench` before recommending or relying on `/benchmark-test-skill <skill>`. If `agentic-skills-bench` is not enabled, recommend `npx skillpacks install agentic-skills-bench` from the project shell first, then tell Claude users to run `/reload-skills`, then `/clear` or restart if the skill remains invisible after install.

## Output

Produce a structured report with:

- Target: session/repo/skill scope and evidence sources.
- User-identified issue: the user's claim in concise terms.
- Verification verdict: `verified`, `partially verified`, `not verified`, or `inconclusive`, with supporting evidence.
- Timeline: short sequence from trigger to correction or impact.
- Root cause: the specific contract gap, repo conflict, or agent noncompliance pattern.
- Responsible contract gap: skill, project instruction, task doc, or none.
- Defect location: `managing-layer` (skill / convention / routing-process) or `invoking-directory`.
- Recommended fix:
  - **Managing-layer:** the managing-layer handoff payload (YAML per `docs/session-triage-handoff-contract.md`) with canonical `packs/<pack>/{claude,codex}/<skill>/SKILL.md` (both variants when both exist) or `docs/*-convention.md`/`CLAUDE.md` target(s) — never a managed mirror or installed copy — the exact change, the publish/refresh loop, and verification.
  - **Invoking-directory:** exact file(s) in the current directory, the concrete change, and local verification. No YAML payload, no managing-repo route.
- Validation plan: commands or checks to prove the fix. For a managing-layer fix, include the publish step (`git add` edits → `npm run skillpacks:build` → `git add` and commit the regenerated manifest with the source) and the refresh step (`scripts/pack.sh refresh` in-repo, or consumer `npx skillpacks refresh` + `/reload-skills`), plus a check that the refreshed mirror shows the new version.
- Confidence and evidence gaps: what is known, what could not be verified, and whether `/analyze-sessions` is needed for recurrence analysis.
- Recommended next skill: `/analyze-sessions` for recurrence analysis, or `none` when no follow-up is justified. A managing-layer fix does not route to a skill — its next action is the handoff payload run in the agentic-skills repo. For a confirmed real `benchmark regression`, emit the managing-layer payload naming the drifted contract section, and, after applying the Pack Availability Guard for `agentic-skills-bench`, name `npx skillpacks install agentic-skills-bench` first when unavailable, then re-running `/benchmark-test-skill <skill>` as the loop-closing verification (see `docs/benchmark-improvement-loop.md`).

## Constraints

- Start narrow and evidence-bound; do not scan all local history by default.
- Do not claim a user-identified issue is agent-verified without independent evidence.
- Do not modify the target skill during analysis unless the user also asked for implementation and the active workflow permits edits.
- Do not recommend a skill change when the evidence points only to one-off agent noncompliance and the contract is already clear.
- Do not create or suggest `/analyze-session`; use `/session-triage`.
- Classify every recommended fix as `managing-layer` (shared skill, convention page, or workflow routing/process) or `invoking-directory` before writing the handoff. A managing-layer fix targets the canonical source in the managing repo (`packs/<pack>/{claude,codex}/<skill>/SKILL.md` or `docs/*-convention.md`/`CLAUDE.md`), never a managed mirror or installed copy, and is emitted as the YAML handoff payload; a patch to a mirror/installed copy is not a durable fix. When invoked outside the managing repo, route a managing-layer fix back to it via the payload rather than editing the local copy. Only an invoking-directory defect is patched in the current directory.
- Do not route a verified fix to a skill-builder skill. `targeted-skill-builder` and `create-agentic-skill` are archived; the managing-layer handoff payload is the implementation route.
- Do not create or modify GitHub Actions workflows.
- If a source is missing or unreadable, report that clearly and continue with available evidence instead of guessing.
- When recommending another skill, apply the Pack Availability Guard: check `enabled_skills`, enabled provider packs, and local/global skill files before recommending the skill directly; if unavailable, prepend `npx skillpacks install <pack-or-skill>` to the recommendation.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
