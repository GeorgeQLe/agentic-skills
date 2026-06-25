# Final-Handoff Verification Audit

Date: 2026-06-25
Command: `$session-triage final-handoff verification audit`
Approved alignment page: `alignment/final-handoff-verification-audit.html`

## Target

Scope: confirmed-artifact final handoff routing only.

Evidence sources:

- `alignment/final-handoff-verification-audit.html` and the pasted final approval YAML.
- `docs/alignment-yaml-routing-contract.md`.
- `docs/alignment-page-convention.md`.
- `CLAUDE.md` / `AGENTS.md` shared shipping and task-management contracts.
- `.codex/skills/session-triage/SKILL.md` plus mirrored session-triage pack sources.
- `scripts/skill-alignment-routing-audit.mjs` and `tests/layer1/skill-alignment-routing-audit.test.ts`.
- `tests/layer4/setup-helpers/routing.ts`.
- Recent narrow examples: `prompts/session-triage/skill-prompt-20260625-101843-calcllm-expansion-map.md`, `alignment/workflow-design-three-pipelines.html`, `alignment/skillpacks-npm-package-walkthrough.html`, `benchmark/test-session-triage-2026-05-13.md`, and `benchmark/triage-session-triage-2026-05-13.md`.

## User-Identified Issue

The approved audit asks whether final handoffs after confirmed artifacts reliably give the user a concrete next step, or whether a run can finish the artifact and still omit actionable continuation routing.

## Verification Verdict

Partially verified.

Verified:

- A same-day prior triage prompt records a concrete confirmed-artifact handoff failure: after Crew expansion-map artifacts were confirmed, the completion response listed files, verification, commit, and push status but omitted the next route until the user asked what was next. The prompt records the correct route as `$lifecycle-metrics research/crew` and classifies the incident as agent noncompliance with an adequate contract.
- The shared shipping contract requires final completion output to include either `Recommended next skill: <command>` or the pair `Next work` plus `Recommended next command`.
- The alignment routing contract correctly blocks downstream routing while pages are in `review` and allows routing only after approved artifacts are written or updated.
- The current `skill-alignment-routing-audit` checks active skill contracts for pre-approval routing problems and non-exec `$exec`/`/exec` handoffs, but it does not verify terminal final responses after confirmed artifacts.
- Benchmark route helpers and benchmark reports already exercise route-label presence in generated benchmark artifacts, but that coverage is not a focused replay of a normal approved alignment-page completion handoff.

Not fully verified:

- This audit did not perform a broad `$analyze-sessions` recurrence study across local session history.
- Terminal final responses are not consistently persisted as repo artifacts, so the sample set can prove one omission and one coverage gap, not a repo-wide failure rate.

## Timeline

1. A prior confirmed-artifact handoff for Crew expansion-map completed artifacts but omitted the next route in the completion response.
2. The omission was triaged in prompt history as verified agent noncompliance; the correct route was `$lifecycle-metrics research/crew`.
3. `tasks/lessons.md` already contains adjacent routing lessons: finalized artifacts need explicit next-step routing, pre-approval pages must not emit downstream routes, and final handoffs must normalize to the active CLI.
4. The current approved audit page authorized a report-only inspection of shared conventions, checks, session-triage routing, and a small example set.
5. This audit found high-level route contracts are present, but the final terminal handoff boundary is not mechanically checked.

## Root Cause

Primary cause: missing final-handoff validation coverage.

The shared contracts are directionally adequate, but the enforcement surfaces emphasize two adjacent boundaries:

- pre-approval alignment YAML stops and no downstream routing during `review`;
- route labels inside benchmark-generated report artifacts.

They do not currently provide a focused self-check or fixture that replays the exact confirmed-artifact completion path: consume final approved YAML, write/confirm artifacts, then require the terminal completion response to render `Next work` plus `Recommended next command` or `Recommended next skill`.

Secondary cause: final terminal responses are often outside durable repo artifacts, so ordinary file audits can miss omissions unless a prompt log, lesson, or benchmark run captures the final text.

## Responsible Contract Gap

Responsible gap: check/benchmark coverage, with a small shared-convention wording gap.

Not responsible:

- `session-triage` output shape. It already requires target, issue, verdict, timeline, root cause, responsible gap, recommended fix, validation plan, confidence, and recommended next skill.
- A broad skill-local rewrite. The verified prior incident points to agent noncompliance with an adequate specific contract, not a missing route in only one skill.

## Recommended Fix

Do not patch individual skill wording first. Add one shared final-handoff self-check and one mechanical guard.

1. Add a short terminal-handoff sentence to `docs/alignment-page-convention.md`, probably under `**After approval handling.**` or immediately after `**Confirmed page contract.**`:

```markdown
**Confirmed-artifact terminal handoff.** After final approved YAML is consumed, approved artifacts are written or updated, and the alignment page is converted to `confirmed`, the agent's terminal completion response must include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>`. If the confirmed artifact or skill contract names a next route, verify that route's skill or provider pack is available before recommending it; if no automated next route remains, say `none` and name the manual or decision state.
```

2. Add a focused validation guard rather than another warning paragraph:

- Preferred owner: extend `scripts/skill-alignment-routing-audit.mjs` and `tests/layer1/skill-alignment-routing-audit.test.ts`, or add a small sibling `scripts/final-handoff-routing-audit.mjs` if the behavior is cleaner as its own check.
- Positive fixture shape: a confirmed-artifact completion response includes changed artifacts, verification status, and either `Recommended next skill: $route` or the `Next work` / `Recommended next command` pair.
- Negative fixture shapes:
  - completion lists files, tests, commit, and push, but no next route;
  - route appears only inside the canonical artifact, not in the terminal handoff;
  - handoff uses the wrong active CLI convention, such as `/skill` in a Codex final response when `$skill` is required;
  - handoff says `none` even though the confirmed artifact or skill contract names an available next route.

3. If the benchmark harness is used for this guard, reuse `tests/layer4/setup-helpers/routing.ts` instead of inventing a second route-label parser. Add a fixture family that simulates the approved-alignment completion path and asserts the runner's final output, not only the generated report file.

## Validation Plan

For the shared convention/check change:

- `node scripts/skill-alignment-routing-audit.mjs --fixtures tests/fixtures/skill-alignment-routing`
- `node scripts/skill-alignment-routing-audit.mjs --report`
- `pnpm --dir tests test:layer1 -- skill-alignment-routing-audit`
- If adding benchmark fixture coverage: `pnpm --dir tests verify --skill session-triage` plus a focused benchmark setup test that exercises the final-handoff fixture.
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

For route availability in any later remediation output:

- Check `.agents/project.json.enabled_skills`.
- Check `.agents/project.json.enabled_packs`.
- Use `scripts/pack.sh which <skill-name>` for provider lookup when the target is not directly enabled.
- For this repo today, `targeted-skill-builder` is provided by `skill-dev` and is not installed; `benchmark-test-skill` is provided by `agentic-skills-bench` and is not installed.

## Confidence And Evidence Gaps

Confidence: medium-high.

High confidence:

- One prior confirmed-artifact omission is documented in prompt history with a clear correct route.
- Current shared audits do not check terminal final responses after confirmation.
- Route-label helper coverage exists for benchmark artifacts and can be reused.

Medium confidence:

- A broad recurrence rate is unknown because this audit intentionally stayed narrow and did not run `$analyze-sessions`.
- The exact implementation owner may be either the alignment-routing audit or a new focused final-handoff audit, depending on how much terminal-output fixture text the maintainers want to encode in a static script.

## Recommended Next Skill

Recommended next skill: `$targeted-skill-builder confirmed-artifact final handoff routing check`.

Availability guard: `targeted-skill-builder` is not enabled in `.agents/project.json`; `scripts/pack.sh which targeted-skill-builder` reports provider pack `skill-dev` as not installed. In this repo, run `scripts/pack.sh install skill-dev` first, then start a fresh Codex session if the `$targeted-skill-builder` command remains stale. If the remediation also adds benchmark harness coverage, install `agentic-skills-bench` before relying on `$benchmark-test-skill`.

**Next work:** add the shared final-handoff self-check and focused validation guard described above.
**Recommended next command:** `scripts/pack.sh install skill-dev`
