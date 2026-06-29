---
skill: investigate
agent: codex
captured_at: 2026-06-28T23:47:04-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Investigate And Fix BIP Drafting-Mode Gate Leakage

## Summary
Investigate the BIP page generation failure where a drafting-mode question was shown during channel-selection approval, then implement the fix in the shared convention/audit layer and, if write access is available, amend the active Alignmeant BIP page. Treat this as a confirmed bug unless investigation finds the page was already in the post-channel-selection state.

## Key Changes
- In `agentic-skills`, tighten the alignment-page convention so the initial BIP channel-selection page may only require target-channel selection. It must not require drafting mode, content angles, sample drafts/video ideas, tone, claim safety, or publish readiness until channel-selection YAML has been approved and consumed.
- Extend `scripts/audit-alignment-pages.mjs` with BIP gate-sequencing diagnostics:
  - Fail a channel-selection-only BIP page if it contains required `drafting-mode`, `content-angles`, `sample-drafts`, `tone`, `claim-safety`, or `publish-readiness` gates.
  - Fail any BIP page containing the stale question pattern “Which drafting mode should apply if channels are later selected?”
  - Fail selected-channel draft pages if the drafting-mode gate still offers “No drafting mode needed; all channels remain not-now.”
- Add focused layer1 audit fixtures proving:
  - Initial BIP channel-selection page with only target-channel gate passes.
  - Initial BIP page with drafting-mode/future-channel gate fails.
  - Selected-channel BIP draft page with `platform_aligned` / `creator_inspired` choices passes.
  - Selected-channel BIP draft page with the stale “all channels remain not-now” drafting option fails.
- Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention with `node scripts/upgrade-alignment-page.mjs`.

## Alignmeant Page Handling
- Run the updated audit against `/Users/georgele/projects/tools/dev/alignmeant` using `node scripts/audit-alignment-pages.mjs --root /Users/georgele/projects/tools/dev/alignmeant`.
- If the active page still fails only on the stale selected-channel drafting option, amend `/Users/georgele/projects/tools/dev/alignmeant/alignment/user-flow-map-alignment-page-review-bip.html` by removing that option from the drafting-mode gate.
- Do not edit archived pages under `docs/history/archive/`; use them only as regression evidence.
- If filesystem permissions block direct Alignmeant edits, stop after the shared repo fix and report the exact manual page edit needed.

## Test Plan
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-alignment-pages.mjs --root /Users/georgele/projects/tools/dev/alignmeant`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

## Assumptions
- The archived Alignmeant page proves the original bug: drafting mode was required before channel selection.
- The active Alignmeant page is now post-channel-selection, so drafting mode itself is valid there, but the “all channels remain not-now” option is stale and should be removed.
- No `SKILL.md` version bump is required unless investigation discovers skill behavior text outside generated `ALIGNMENT-PAGE.md` bundles must change.
- Prompt history and task docs should be updated if implementation proceeds under the repo’s normal tracked-change workflow.
