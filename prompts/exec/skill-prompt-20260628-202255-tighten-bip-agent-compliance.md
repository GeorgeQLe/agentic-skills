---
skill: exec
agent: codex
captured_at: 2026-06-28T20:23:05-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Tighten BIP Agent Compliance

## Summary

Investigate why enabled Build-In-Public mode is being ignored in alignment-producing flows, then harden compliance with enforceable convention changes, active-page audits, and regression fixtures. Default course: **audit + fixtures**, not docs-only and not a full runtime orchestrator.

## Key Changes

- Validate the current failure path:
  - Reproduce from recent evidence: `.agents/project.json.alignment.build_in_public: true`, normal alignment pages opened, no `alignment/*-bip.html`.
  - Inspect the canonical BIP contract in `docs/alignment-page-convention.md`, generated `ALIGNMENT-PAGE.md` bundles, alignment audit scripts, and representative research/product-design skills.
  - Classify root cause as convention-only guidance, missing BIP state marker, missing audit coverage, missing fixture coverage, or skill-specific bypass.

- Add an enforceable BIP checkpoint to the alignment convention:
  - Stage 2 review pages must declare BIP handling when BIP is active: either link to the required sibling `alignment/{skill}-{topic}-bip.html`, record approved BIP YAML, or explicitly mark BIP not applicable with a narrow reason.
  - BIP review pages must carry stable metadata identifying them as BIP pages and the normal alignment page they gate.
  - Normal Stage 2 handoff text must open/review the BIP page before final artifact approval when BIP is active.

- Extend audits and package surface:
  - Update `scripts/audit-alignment-pages.mjs` and packaged `skillpacks alignment pages audit` behavior to read `.agents/project.json`.
  - When `alignment.build_in_public === true`, flag Stage 2 review pages that have no BIP checkpoint and no sibling BIP page.
  - Keep Stage 1 scope pages and confirmed pages from false-failing unless they claim pending Stage 2 artifact approval.
  - Ensure `alignment/index.html` includes active BIP pages like other review pages.

- Add regression coverage:
  - Layer1 tests for canonical convention text, generated bundle propagation, and audit behavior.
  - Fixture cases for: BIP enabled + Stage 2 page missing checkpoint fails; BIP enabled + linked sibling BIP page passes; BIP disabled passes; Stage 1 scope page does not false-fail.
  - Add at least one final-handoff fixture showing an agent must route to BIP review before normal artifact approval.

- Ship hygiene:
  - Record the implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
  - Capture the visible prompt if an implementation skill is invoked.
  - Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention only.
  - Commit and push the completed tracked changes.

## Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/audit-alignment-pages.mjs --root <fixture-with-bip-enabled>`
- Focused layer1 tests covering BIP convention/audit fixtures
- Existing package tests for `set-bip` remain green
- `git diff --check`

## Assumptions

- BIP should remain an approval artifact workflow, not auto-publishing.
- The fix should make misses visible as audit/test failures, not rely on agents rereading prose.
- Full runtime orchestration is out of scope unless audits and fixtures still prove insufficient.
