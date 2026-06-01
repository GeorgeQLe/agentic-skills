# Animation Pack/Drawer Forensics - 2026-06-01

## Scope

This report traces the `/prototype` pack/drawer animation history from `d6e688cc` through `781d44c1`, focusing on:

- `apps/skills-showcase/app/prototype/page.tsx`
- `apps/skills-showcase/src/components/SealedPack.tsx`
- `apps/skills-showcase/src/components/PackOpener.tsx`
- `apps/skills-showcase/src/components/BottomSheet.tsx`
- `apps/skills-showcase/alignment/animation-audit-pack-drawer.html`
- `apps/skills-showcase/src/components/prototype-close-sequence.test.tsx`

No animation code was changed during this investigation.

## Executive Finding

The last known-good implementation for the intended current close sequence is `781d44c1` (`fix: restore prototype pack close sequencing`, 2026-06-01 10:09:21 -0400). It is the first commit in this cluster that keeps the pack identity alive through sheet exit: `openPack` remains set while `BottomSheet` exits, and `openPack` is cleared only from `BottomSheet.onExitComplete`.

The first behavior-changing commit for the close pipeline was `fcc302a5` (`fix: card z-index during close apex animation`, 2026-05-28 16:07:23 -0400). It introduced the reverse fan-in close and `isClosing`, but it still tied `BottomSheet.isOpen` to `!!openPack` and cleared `openPack` in `handleCollapseComplete`. That meant collapse completion also triggered sheet teardown and the `layoutId` transfer back to `SealedPack`.

The first explicit apex-travel regression was `558a9873` (`fix: eliminate card flash at apex during drawer close`, 2026-05-28 16:23:27 -0400). It set `cardSlideY` to `0` on drawer close, removing the intended apex descent path. Later history identifies this as a misdiagnosis: the visible flash was primarily the drawer card-collapse stage and state handoff, not the apex `cardSlideY` value alone.

The breakage was both code and harness mismatch, with code as the root cause:

- Code: the pre-`781d44c1` page cleared `openPack` too early, so sheet exit and shared-layout morph-out were coupled to the same state transition. `PackOpener` also lacked a one-shot collapse completion guard and direct completion path for one-card/no-container cases.
- Harness/docs: `4d076fff` and `3fe33813` documented a stepped sequence that included `collapse-complete -> drawer-teardown -> sheet-exit -> layout-morph-out -> drop-elevation`, but pre-`781d44c1` code did not actually keep `openPack` until sheet exit. The harness exposed the mismatch; it did not create the underlying state bug.

## Verification Counts

History extraction used a JSON parser over structured records, excluding system/developer text and arbitrary tool output. File-edit tool calls were retained only as file-edit evidence.

| Source | Files scanned | Records scanned | Matching records | Matching sessions |
| --- | ---: | ---: | ---: | ---: |
| Claude `~/.claude/history.jsonl` | 1 | 9,878 | 2 | 2 |
| Claude `~/.claude/projects/**` | 4,039 | 256,031 | 185 | 27 |
| Claude `~/.claude/sessions/**` | 5 | 5 | 0 | 0 |
| Codex `~/.codex/history.jsonl` | 1 | 6,435 | 2 | 2 |
| Codex `~/.codex/sessions/**` | 2,620 | 837,034 | 0 | 0 |

Git extraction found 19 commits in the target range that touched one or more scoped animation/audit files.

## Known-Good Implementation

`781d44c1` is known-good for the intended current code contract because:

- `page.tsx` splits drawer-closing state from sheet-mounted state: `isDrawerClosing`, `isSheetMounted`, and `isDrawerClosingRef` are introduced at lines 33-35.
- `handleClose()` only starts close: it marks `close-trigger` and sets `isDrawerClosing` without clearing `openPack` at lines 64-69.
- `handleCollapseComplete()` marks `drawer-teardown` and hides the sheet with `setIsSheetMounted(false)` at lines 71-74.
- `handleSheetExited()` is the only normal close path that clears `openPack`, at lines 76-80.
- `BottomSheet` gained `onExitComplete` and calls it after marking `sheet-exit` at `BottomSheet.tsx` lines 14-18 and 42-46.
- `PackOpener` gained `collapseCompleteFiredRef` and `completeCollapse()`, making `collapse-complete` a one-shot handoff at `PackOpener.tsx` lines 31-60.
- `PackOpener` directly completes one-card/no-container close paths at lines 88-102.
- `SealedPack` restores close apex travel by setting `cardSlideY` to `-180` on close at lines 176-184, then gates `layout-morph-out` and `drop-elevation` before dropping elevation and animating `cardSlideY` back to `0` at lines 334-353.
- `prototype-close-sequence.test.tsx` verifies the page handoff, debug close driver, close-apex gate ordering, and PackOpener one-shot completion.

## Timeline

| Commit | Date | Author | Touched scoped files | Intended behavior from commit/session | Observed code behavior | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| `d6e688cc` | 2026-05-25 20:51 -0400 | G | `page.tsx`, `BottomSheet.tsx`, `PackOpener.tsx` | Replace full-screen card replacement with bottom-sheet drawer; keep sealed packs visible behind scrim. | `handleClose()` immediately did `setOpenPack(null)` and `BottomSheet` used `isOpen={!!openPack}`. No reverse drawer-card collapse existed. | Partial: drawer introduction worked, but not the later intended close sequence. |
| `671f2505` | 2026-05-25 23:00 -0400 | G | `page.tsx`, `SealedPack.tsx` | Re-open opened packs by click or drag-up. | Added reopened-pack affordances; no material close-pipeline change. | Working for open/reopen scope. |
| `8f386368` | 2026-05-25 23:30 -0400 | G | `page.tsx`, `SealedPack.tsx` | Large pack refactor/reorganization. | Touched prototype consumers as part of pack movement; no durable close handoff fix identified. | Neutral/no close verdict. |
| `cd145b57` | 2026-05-26 00:02 -0400 | G | `SealedPack.tsx` | Increase card return height for visible overshoot on drawer close. | Tuned apex/descent travel, but close still depended on `openPack` teardown. | Partial repair. |
| `e34b54f9` | 2026-05-26 00:12 -0400 | G | `SealedPack.tsx` | Card should slide down from above on drawer close instead of growing. | Introduced separate `cardSlideY` vertical translation so the card keeps its size during descent. | Partial repair. |
| `ae1da4dc` | 2026-05-26 13:43 -0400 | G | `page.tsx`, `SealedPack.tsx` | Pack preview should match drawer card face. | Refactored card face visual parity; close sequencing unchanged. | Working visual refactor. |
| `c100ab18` | 2026-05-26 15:28 -0400 | G | `SealedPack.tsx` | Rework opened-pack card as full-height element and fix layout animation bounce on drawer close. | Full-height card plus combined drag/slide motion improved shared-layout behavior. | Partial repair. |
| `6bcb2076` | 2026-05-26 18:55 -0400 | G | `page.tsx`, `BottomSheet.tsx`, `PackOpener.tsx`, `SealedPack.tsx` | Improve card animations, z-index elevation state, spring return after drawer close. | Added `onTear`, elevation, and spring return pieces. Still no final sheet-exit handoff separation. | Partial repair. |
| `b9cc126a` | 2026-05-27 00:09 -0400 | G | `BottomSheet.tsx` | Add drag-to-close and block mobile pull-to-refresh. | Added drag dismiss and overscroll containment. | Working for sheet gesture scope. |
| `b5fe8554` | 2026-05-27 00:55 -0400 | G | `SealedPack.tsx` | Expand drag zone over full top flap. | Open/tear gesture improvement; no close sequence change. | Working for gesture scope. |
| `5736f3c0` | 2026-05-27 14:07 -0400 | George Le | `SealedPack.tsx` | Fix tear gesture not opening drawer. | Added pending-open/fallback handling around layout animation completion. | Repaired open path. |
| `6c89a792` | 2026-05-27 23:39 -0400 | G | `BottomSheet.tsx`, `SealedPack.tsx` | Resolve broader semantic/script issues. | Scoped files changed, but commit message has no animation-specific close intent. | Neutral/no close verdict. |
| `e6652913` | 2026-05-28 00:25 -0400 | G | `BottomSheet.tsx`, `SealedPack.tsx` | First drawer close should animate through apex; restore production timing after debug slow-mo. | Set close state/elevation and `cardSlideY` to an apex-ish value; fixed 3s durations back to 0.3s. No reverse fan-in yet. | Repaired apex/timing, partial close sequence. |
| `fcc302a5` | 2026-05-28 16:07 -0400 | George Le | `page.tsx`, `BottomSheet.tsx`, `PackOpener.tsx`, `SealedPack.tsx` | Add card z-index during close apex and reverse drawer-card collapse before close. | Introduced `isClosing`, `PackOpener.isClosing`, `onCollapseComplete`, visible top-left collapse target, and `dismissable={!isClosing}`. But `handleCollapseComplete` still did `setOpenPack(null)`, so sheet exit and `layoutId` morph-out were coupled. | First major behavior change; partial/regressed relative final sequence. |
| `558a9873` | 2026-05-28 16:23 -0400 | George Le | `SealedPack.tsx` | Eliminate card flash at apex. | Changed close setup from `cardSlideY.set(-180)` to `cardSlideY.set(0)` and removed descent spring. Later chat identified this as a misdiagnosis because it removed apex travel. | Regressed apex travel. |
| `4d076fff` | 2026-05-29 16:51 -0400 | G | `page.tsx`, `prototype.css`, `BottomSheet.tsx`, `PackOpener.tsx`, `SealedPack.tsx`, debug files | Add slow-mo/step-debug harness to make recurring apex card flash observable. | Added `gate()`/`mark()` and close steps, but retained `cardSlideY.set(0)` and retained `setOpenPack(null)` at collapse completion. `BottomSheet` marked `sheet-exit` but could not hand control back to page. | Partial: harness useful, but sequence mismatch remained. |
| `3fe33813` | 2026-05-29 16:52 -0400 | G | `animation-audit-pack-drawer.html` | Add audit document for open/close motion, apex/z-index bug, and timing. | Audit described the expected sequence and acknowledged recurring apex/flash risk; no code change. | Documentation partial; not a repair. |
| `3ed1e11a` | 2026-05-31 11:56 -0400 | G | `animation-audit-pack-drawer.html`, `page.tsx`, `SealedPack.tsx` | Tearing only unseals except first-tear auto-open; update audit doc. | Open behavior changed via `autoOpenOnTear`; close code still used `isOpen={!!openPack}` and cleared `openPack` in `handleCollapseComplete`. | Working for open model; close mismatch unchanged. |
| `781d44c1` | 2026-06-01 10:09 -0400 | George Le | `page.tsx`, `BottomSheet.tsx`, `PackOpener.tsx`, `SealedPack.tsx`, `prototype-close-sequence.test.tsx` | Restore close sequencing: drawer collapse, sheet exit, then pack morph/elevation gates. | Added `isSheetMounted`, `onExitComplete`, one-shot `PackOpener` completion, restored `cardSlideY.set(-180)`, and added focused tests. | Repaired / known-good for current intended behavior. |

## Chat-History Evidence

| Source | Date/session | Evidence | Inference |
| --- | --- | --- | --- |
| `/Users/georgele/.claude/history.jsonl:9827` and `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/3de3cc83-350d-466e-b8a0-7797fdce3b9a/subagents/agent-a3396c3fd9f1dda66.jsonl:57` | 2026-05-28, Claude session `3de3cc83-350d-466e-b8a0-7797fdce3b9a` | User reported that on drawer close "the card appears at the apex position and then disappears"; assistant traced the then-current flow to `handleClose()` clearing `openPack`, flipping `isDrawerOpen` false. | This is the pre-reverse-collapse apex symptom and confirms the original close was state-teardown driven. |
| `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/1a77d96d-c8a4-4c0d-8655-d87e714a1c67.jsonl:5` | 2026-05-28, Claude session `1a77d96d-c8a4-4c0d-8655-d87e714a1c67` | User plan said the desired behavior was: cards collapse back onto the visible top-left card, and only then should the drawer dismiss and preview card fly back via shared layout. | This is the canonical intent for `fcc302a5`: two-phase close begins here. |
| `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/1a77d96d-c8a4-4c0d-8655-d87e714a1c67.jsonl:38-40` | 2026-05-28, Claude session `1a77d96d-c8a4-4c0d-8655-d87e714a1c67` | File-edit evidence changed `handleClose()` to `setIsClosing(true)` and `handleCollapseComplete()` to `setIsClosing(false); setOpenPack(null);`, then passed `isClosing` and `onCollapseComplete` into `PackOpener`. | The intended two-phase close was implemented with one missing separation: the sheet mounted state still equaled `!!openPack`. |
| `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/60c84b04-1d0e-4431-9f4f-47fe827d2d69/subagents/agent-a2074e2e6277082ee.jsonl:1` | 2026-05-28, Claude session `60c84b04-1d0e-4431-9f4f-47fe827d2d69` | User described the visual contract: on open the card should rise to an apex before going over the drawer; on close it should go from drawer to apex, then down behind the pack body. | Confirms apex travel is intentional, so `558a9873` removing apex travel was not aligned with design intent. |
| `/Users/georgele/.claude/history.jsonl:9836` and `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/51d6f6c8-9452-4c38-abc1-101dc6b83541/subagents/agent-a4d006665c226ef34.jsonl:43` | 2026-05-28, Claude session `51d6f6c8-9452-4c38-abc1-101dc6b83541` | User diagnosed the flash as coming from "collapse cards into one card on drawer close"; the assistant localized the target calculation to `PackOpener.tsx` and the scroll container. | Confirms the flash family moved from apex-only theory to drawer-collapse behavior. |
| `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/51d6f6c8-9452-4c38-abc1-101dc6b83541/subagents/agent-af31e01d4df341f76.jsonl:1` | 2026-05-28, Claude session `51d6f6c8-9452-4c38-abc1-101dc6b83541` | User summarized current close flow as `handleClose()` -> `setIsClosing(true)`, collapse complete -> `setOpenPack(null)`, then BottomSheet exit and `layoutId` transfer. | This records the known problematic pre-`781d44c1` state model: one state drives both sheet exit and pack morph. |
| `/Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/3b8c9652-05be-4081-bf87-6ca30f07f086.jsonl:5` | 2026-06-01, Claude session `3b8c9652-05be-4081-bf87-6ca30f07f086` | Plan stated `558a9873` misidentified the root cause and broke apex travel; it also argued collapse was visible inside the open sheet. | Confirms the later diagnosis that both drawer-collapse visibility and apex travel needed reconciliation. No corresponding committed prototype repair appears before `781d44c1`. |
| `/Users/georgele/.codex/history.jsonl:6414` | 2026-06-01, Codex session `019e8374-430f-7e71-934e-e2473a7ce95f` | Codex plan explicitly required: `handleClose()` only sets closing, `PackOpener.onCollapseComplete` hides the sheet, and `openPack` clears only after `BottomSheet.onExitComplete`. | This is the exact design intent implemented by `781d44c1`. |
| `/Users/georgele/.codex/history.jsonl:6434` | 2026-06-01, Codex session `019e839b-6e3c-7751-9b8c-2808daf3f2bb` | Current forensics invocation requested this targeted history analysis over `d6e688cc` through `781d44c1`. | This records the analysis scope, not animation behavior intent. |

## Source Evidence Matrix

| Claim | Evidence | Inference | Confidence |
| --- | --- | --- | --- |
| `fcc302a5` introduced the first reverse-fan-in close behavior. | `git grep` at `fcc302a5` shows `isClosing`, `handleCollapseComplete`, `PackOpener.isClosing`, and `onCollapseComplete` in `page.tsx`; `PackOpener.tsx` gained collapse offsets and target-card logic. | Before this commit, `d6e688cc` closed by immediately clearing `openPack`; after it, cards could collapse before page teardown. | High |
| Pre-`781d44c1` code did not separate sheet lifetime from pack identity. | `fcc302a5`, `4d076fff`, and `3ed1e11a` all have `BottomSheet isOpen={!!openPack}` and `handleCollapseComplete` clearing `openPack`. | There was no state slot for "sheet is exiting while the pack still counts as drawer-open"; therefore sheet exit and pack morph-out were coupled. | High |
| `558a9873` broke apex travel while trying to fix flash. | `git grep` at `558a9873` shows `cardSlideY.set(0)` on close and immediate `setCardElevated(false)`; chat session `3b8c9652...` later states this was a misdiagnosis. | The card could no longer start close morph-back from the apex position before descending. | High |
| `4d076fff` made the mismatch observable but did not repair it. | Commit message says debug layer is opt-in/inert when off; source at `4d076fff` shows close gates but still `setOpenPack(null)` in `handleCollapseComplete`, and `BottomSheet` only marks `sheet-exit`. | Harness steps were useful forensic boundaries, but the code path still lacked an exit-complete callback to drive pack identity teardown. | High |
| `3ed1e11a` changed open semantics, not close sequencing. | Diff adds `autoOpenOnTear` and audit text for two-stage open; close grep remains unchanged from `4d076fff`. | Any remaining close issue after `3ed1e11a` was inherited, not newly introduced by the two-stage open change. | High |
| `781d44c1` repairs the intended sequence. | Current source has `isSheetMounted`, `onExitComplete`, one-shot collapse completion, restored `cardSlideY.set(-180)`, and focused tests. | The sequence now has explicit state boundaries: close trigger -> collapse -> sheet exit -> pack morph/elevation drop -> clear pack. | High |

## Root Cause

The root cause is a state-machine mismatch introduced with the first reverse-fan-in implementation:

1. `fcc302a5` correctly added a drawer-collapse phase, but kept `BottomSheet.isOpen` tied to `!!openPack`.
2. `handleCollapseComplete()` cleared `openPack`, which simultaneously made `BottomSheet` exit and made `SealedPack.isDrawerOpen` false.
3. The debug/audit model later expected a distinct `drawer-teardown` and `sheet-exit` boundary before `layout-morph-out`, but the code did not provide a callback to clear `openPack` after sheet exit.
4. `558a9873` addressed a symptom by removing the apex offset rather than fixing the drawer-collapse/sheet handoff, so it reduced the visible flash at the cost of the intended apex descent.
5. `781d44c1` fixed the state machine by adding the missing mounted-state layer and exit-complete handoff.

## Remaining Risks

- The current report relies on source diffs, blame, chat history, and focused tests. It does not add new visual/pixel runtime evidence.
- The collapse target still depends on visible-card measurement in `PackOpener.tsx` lines 107-145. Current tests verify sequencing, not scroll-dependent target geometry.
- `animation-audit-pack-drawer.html` is a historical audit page. It now matches the two-stage open model, but it should be re-audited if future animation code changes.

## Follow-Up Fix Plan

No immediate animation-code follow-up is required from this forensic pass. If the visual issue persists after `781d44c1`, use this plan:

1. Add a Playwright/browser regression for `/prototype` debug stepped close at 0.1x: open pack 0, trigger close, step through `collapse-complete`, `drawer-teardown`, `sheet-exit`, `layout-morph-out`, and `drop-elevation`.
2. Assert ordering from the debug panel or exposed test hook, and capture screenshots at `layout-morph-out` and after `drop-elevation`.
3. Add a scroll-position variant that scrolls the drawer content before close and verifies the collapse target remains the visible top-left card.
4. Only then change animation code if the runtime evidence contradicts the current source/test contract.

## Commands and Evidence Sources Used

- `git log --reverse d6e688cc^..781d44c1`
- `git log --reverse --date=iso-strict --pretty=... --name-only d6e688cc^..781d44c1 -- <scoped files>`
- `git show --stat --patch` for `d6e688cc`, `e6652913`, `fcc302a5`, `558a9873`, `4d076fff`, `3ed1e11a`, and `781d44c1`
- `git grep -n` at key commits for `handleClose`, `handleCollapseComplete`, `setOpenPack(null)`, `BottomSheet isOpen`, `cardSlideY.set`, `layout-morph-out`, `drop-elevation`, and `collapse-complete`
- `git blame` over current close-sequencing lines in `page.tsx`, `PackOpener.tsx`, `SealedPack.tsx`, and `BottomSheet.tsx`
- Filtered parser over Claude and Codex histories listed in the verification-count table
