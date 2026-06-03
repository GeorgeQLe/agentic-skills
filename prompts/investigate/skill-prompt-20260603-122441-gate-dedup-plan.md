---
skill: investigate
agent: codex
captured_at: 2026-06-03T12:24:41-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Alignment Gate De-Duplication Plan

## Summary
Update the alignment-page convention so `artifact destination` and `proposed file changes` remain separate gate concepts, but agents do not render duplicate path-only sections when the same question covers both. The visual UI may combine them; the compiled YAML should preserve separate gate semantics only when both decisions are actually present.

## Key Changes
- Update the canonical `CLAUDE.md` alignment convention block to define:
  - `artifact destination`: approves the durable/review artifact location.
  - `proposed file changes`: approves downstream mutation scope, timing, and allowed file set.
  - If both gates ask only the same path-destination question, render one combined section such as `Artifact Destination & Proposed File Changes`.
  - If the decisions differ, render separate gates.
- Run `node scripts/upgrade-alignment-page.mjs` to propagate the convention into generated `ALIGNMENT-PAGE.md` files.
- Update `scripts/upgrade-alignment-page.mjs` skill-specific gate text where it currently mechanically lists both gates, so phrasing allows “combined when identical, separate when distinct.”
- Add/adjust layer1 tests in `tests/layer1/alignment-gates.test.ts` to assert:
  - generated conventions include the semantic distinction;
  - duplicate path-only gates should be combined visually;
  - YAML must still preserve `gate_type` values for decisions that control file output.
- Because this is a skill invocation, capture the visible prompt under `prompts/investigate/skill-prompt-YYYYMMDD-HHMMSS-gate-dedup-plan.md` before implementation when execution begins.

## Test Plan
- Run `node scripts/upgrade-alignment-page.mjs --dry-run` before edits if needed to confirm current drift.
- After edits, run `node scripts/upgrade-alignment-page.mjs`.
- Run targeted tests from `tests/`:
  - `pnpm test -- layer1/alignment-gates.test.ts`
  - `pnpm test -- layer1/upgrade-alignment-pages.test.ts`
- Run broader layer1 verification:
  - `pnpm test:layer1`
- Inspect `git diff -- CLAUDE.md scripts/upgrade-alignment-page.mjs tests/layer1/alignment-gates.test.ts` and a sample generated `ALIGNMENT-PAGE.md` to confirm the wording propagated cleanly.

## Assumptions
- Keep the two gate types as durable approval concepts; only de-duplicate their visual presentation when the questions are identical.
- Do not rewrite existing historical `alignment/*.html` pages in this change; they are past artifacts and can be handled by a separate upgrade/alignment-page-admin pass.
- No GitHub Actions changes.
- If implementation mutates tracked files, finish by validating, committing, and pushing to the primary branch per repo policy.
