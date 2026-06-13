---
skill: targeted-skill-builder
agent: codex
captured_at: 2026-06-12T11:08:17-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix `ui-interview` Interview Skipping And Context Routing

## Summary

Triage verdict: **verified**. The `ui-interview --requirements-only` run created a review page from upstream approval and repo evidence, but did not actually run the `ui-interview` assumption/content confirmation with the user.

The fix has two parts: prevent `ui-interview` from treating upstream approval as its own interview, and change routing language so research/planning skills do not auto-invoke downstream skills. They should present a clear handoff choice instead.

## Key Changes

- Update `packs/product-design/{codex,claude}/ui-interview/SKILL.md` from `v0.17` to `v0.18`, archiving `v0.17` first and updating both CHANGELOGs.
- Add a strict requirements-only rule:
  - Upstream `user-flow-map` approval may authorize the next route, but does not count as `ui-interview` interview completion.
  - `ui-interview --requirements-only` must present and confirm its own UI Assumptions Manifest, then its own Content Requirements Manifest, before building the alignment page.
- Add an evidence-only exception:
  - Only allowed when the current user invocation explicitly asks to skip live interview questions or synthesize from evidence.
  - Output must be labeled `evidence-synthesis review`, not completed interview.
  - The page must route unresolved decisions to a resumed `ui-interview`, not imply interview completion.
- Change downstream routing language across affected product-design/research handoffs:
  - Do not auto-run or auto-invoke the next skill.
  - Present two user choices: stop here so the user can clear context and run the next skill, or continue immediately in the same session.
  - If continuing immediately, the next skill must still execute its own required interaction gates.
- Update the alignment-page generator’s `ui-interview` gate text to require `Interview provenance`:
  - `live-ui-interview`
  - `evidence-synthesis-with-explicit-skip`
  - `invalid-missing-ui-interview`

## Test Plan

- `node scripts/upgrade-alignment-page.mjs`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/codex-interview-cadence.test.ts`
- `git diff --check`
- Targeted `rg` checks for:
  - upstream approval not counting as interview completion
  - stop/clear-context versus continue-now routing language
  - `Interview provenance`
  - `evidence-synthesis`

## Assumptions

- The fix belongs primarily in `ui-interview` plus shared routing language, not `session-triage`.
- Research/planning skills may recommend a next skill, but must not silently perform that next skill’s work.
- No GitHub Actions changes are in scope.
