# Alignment Gate Reactivity Analysis

Date: 2026-06-15
Skill: `$analyze-sessions`

## Overview

Scanned local Claude and Codex user-message history plus Codex rich session metadata for recurring alignment-page gate, feedback, and compiled-YAML issues.

Corpus:

| Metric | Count |
| --- | ---: |
| User-message records scanned | 27,519 |
| Claude records | 10,602 |
| Codex records | 16,917 |
| Claude sessions | 4,042 |
| Codex sessions | 3,113 |
| Date range | 2025-12-10 to 2026-06-15 |
| Narrow alignment/gate/feedback/reactivity records | 592 |
| Specific gate-reactivity/problem matches | 11 |

Top project in scope was this repository, `/Users/georgele/projects/tools/agentic-skills`, with 2,730 user records. Codex token usage is available for 2,962 rich sessions: 11,102,486,178 total tokens, including 11,055,122,043 input, 10,507,755,264 cached input, 47,364,135 output, and 10,994,325 reasoning output tokens. Cost is unavailable: no run-local explicit cost field or current provider pricing table was used.

## Evidence

Confirmed recurring user-facing pattern:

- 2026-05-27, `agentic-skills`: "it created a really shallow and poor quality html alignment page, it also didn't provide any clarifying questions nor wait until I answered those gated questions in order to generate the research files."
- 2026-05-27, `afps-tracker`: "are we not adding gate questions to the html alignment page for the me to answer?"
- 2026-06-11 to 2026-06-12, `alignmeant`: user supplied compiled/feedback YAML for `idea-scope-brief-alignmeant.html`, including a `needs-clarification` gate about canonical repo/cloud storage and later clarification: "Yes and compiling feedback and gate questions answers which we can copy paste to the agents."
- 2026-06-15, `alignmeant`: "We had an issue when I gave the agent feedback and it updated the research, but did not update teh gate question and blocking progress until my manual intervention."
- 2026-06-15, `agentic-skills`: current `$analyze-sessions` request: "gate questions in alignment pages were not reactive or updated based on previous answers or feedback."

Repository evidence:

- `docs/alignment-page-convention.md` already requires gates, partial responses, section feedback, revision handling, final YAML inspection, and confirmation reconciliation.
- The convention says unresolved feedback returns the page to `review`, and final approval with edits should update the page, research, and proposed artifacts before confirmation.
- It does not explicitly say that after a revision the review page must regenerate or retire gate questions whose premise changed, recompute blocking status from the revised gate set, and ensure required questions match the updated artifact state before asking again.
- `scripts/audit-alignment-pages.mjs` checks TTS, metadata, viewport, embed prohibition, and index integrity only. It does not inspect active gate controls, stale `requiredGateNames`, confirmed pages retaining compile controls, or mismatch between displayed gate text and revised content.
- Active-page scan found two confirmed-like pages in this repo. One, `alignment/ui-interview-skill-execution-handoff.html`, still contains compile controls and says "The gates and compile controls below are retained as the historical approval record," which conflicts with the current confirmed-page contract.
- In the external Alignmeant repo, current `alignment/customer-discovery-alignmeant.html` is described as approved/finalized and contains a ready-for-agent-review approval record, but it still has active `.question-block` gates, section feedback controls, `requiredGateNames`, and compile logic. This is concrete evidence of the stale active-control class of failure.

## Diagnosis

The owner surface is the shared alignment-page convention plus its layer1 contract tests, not one isolated skill.

The current contract handles two adjacent ideas:

1. Feedback can be submitted before all gates are answered.
2. Final confirmation must reconcile displayed gate decisions against final YAML.

The missing contract is the middle state: after feedback or partial compiled YAML causes a page revision, the page must be reauthored as a fresh review state whose gates are derived from the revised artifact, not carried forward mechanically from the prior version. Stale gate text, stale selected defaults, stale `requiredGateNames`, and stale blockers can otherwise survive even when the research prose was corrected.

## Recommended Updates

| Rank | Surface | Update | Validation expectation |
| ---: | --- | --- | --- |
| 1 | `docs/alignment-page-convention.md` | Add a "Gate reactivity after revisions" rule: after any feedback, partial YAML, or approval-with-edits revision, regenerate the affected gate questions/options/defaults/blocking set from the revised artifact; remove or rewrite gates whose premise was superseded; recompute `unanswered_required_questions` and `requiredGateNames`; and visibly mark updated gates. | Layer1 assertion in `tests/layer1/alignment-gates.test.ts` for exact convention language across generated bundles. |
| 2 | `docs/alignment-page-convention.md` | Strengthen confirmed-page handling: confirmed pages must render gate answers as read-only records only; active gate inputs, compile buttons, `requiredGateNames`, and blocking scripts are prohibited even as "historical record." | Extend active-page audit or layer1 fixtures to fail confirmed pages with active gate controls/compile controls. |
| 3 | `scripts/audit-alignment-pages.mjs` | Add optional/static checks for active pages: if page is confirmed-like, fail on `.question-block`, compile controls, `requiredGateNames`, feedback inputs, or "retained controls" wording. For review pages, warn/fail when gate blocks lack stable `data-question-id`/`data-question` and when compile logic hard-codes a required gate list that does not match DOM gates. | Add fixture coverage in `tests/layer1/audit-alignment-pages.test.ts`. |
| 4 | Generated bundles via `scripts/upgrade-alignment-page.mjs` | Regenerate all `ALIGNMENT-PAGE.md` bundles after the convention change. | `node scripts/upgrade-alignment-page.mjs --check`. |
| 5 | Alignment-producing skills | No broad skill-by-skill behavior rewrite first. After the shared convention/test change, only patch bespoke alignment sections or custom page generators that bypass the bundle. | `rg` for bespoke/custom generators plus existing mirror/archive checks. |

## Highest Impact

1. Add explicit revision-cycle gate reactivity language. This prevents the exact "research updated, gate still blocks/wrong" failure.
2. Make active-page audit catch confirmed pages with active controls. This catches the observed stale-control drift that current audit misses.
3. Require updated gates to be visibly marked after revision. This helps the reviewer see what changed instead of re-reading stale-looking pages.
4. Require compile logic to derive required gates from DOM metadata or a single declared gate registry, not an independently hard-coded list that can drift.
5. Treat `other` and `needs-clarification` feedback as premise-changing inputs: after applying them, the replacement gate must ask for the new decision state, not keep the rejected generated option as the blocking question.

## Recommended Next Skill

Recommended next command: `$targeted-skill-builder alignment page revision gate reactivity contract`

Likely owner surface: `docs/alignment-page-convention.md`, `scripts/audit-alignment-pages.mjs`, `tests/layer1/alignment-gates.test.ts`, and `tests/layer1/audit-alignment-pages.test.ts`.
