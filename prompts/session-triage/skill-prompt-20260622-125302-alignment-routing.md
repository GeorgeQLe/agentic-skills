---
skill: session-triage
agent: codex
captured_at: 2026-06-22T12:53:02-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Target
  Session triage for alignment-page-review routing and the post-$ui-interview prototype step.

  Verification Verdict: verified

  The route should not have gone straight from UX variations to built prototypes/UAT in the normal default flow.

  Evidence:

  - The flow tree declares the intended route as user-flow-map -> ux-variations -> ui-interview -> prototype: design/alignmeant/flow-tree-alignment-page-review.yaml:5.
  - $ux-variations says the normal route is to $ui-interview [specific-ux-variation]: .codex/skills/ux-variations/SKILL.md:18.
  - $prototype has a hard gate requiring design/ui-*.md: .codex/skills/prototype/SKILL.md:25.
  - No design/alignmeant/ui-*.md exists for this topic. The current artifacts only include UX variation docs and a prototype build plan.
  - The canonical UX variation output instead routed to “Build the five route experiments first, then run $uat --variant-evaluation”: design/alignmeant/ux-variations-alignment-page-review.md:455.
  - The prototype build plan then marked all five as built and routed to UAT: design/alignmeant/prototype-build-plan-alignment-page-review.md:30.

  Root Cause

  Two things combined:

  1. Agent noncompliance with an adequate gate: $prototype should have halted because the required design/ui-*.md UI branch packet was missing.
  2. Contract ambiguity in $ux-variations: it correctly says default routing should go to $ui-interview, but it also contains route-experiment language that can be misread as permission to build
     variants before UI interview. That ambiguity appears to have been encoded into the generated UX variation artifact and alignment page.

  The immediate reason the current approval response did not route to $ui-interview is also mechanical: your pasted response is partial, not-approved, and chose Hold before UAT. A not-approved
  prototype gate should not trigger downstream routing. The correct action is to treat the prototype preview as blocked and restart at $ui-interview.

  Post-UI Prototype Step

  Yes. The narrow prototype/experiment step after $ui-interview is:

  $user-flow-map --prototype-build-plan alignment-page-review
  $prototype alignment-page-review --variant N

  $ui-interview produces the approved UI branch packet and visual mockup. It does not create the runnable experiment as its final artifact. The build-plan mode creates one lightweight prototype
  build item per approved UI review, and $prototype --variant N builds or rebuilds the narrowly scoped experiment.

  For this repo, the clean path is:

  $ui-interview uxv-alignment-page-review-trust-first-review-page

  Then, after UI approval:

  $user-flow-map --prototype-build-plan alignment-page-review
  $prototype alignment-page-review --variant 1

  Recommended Fix

  Tighten .codex/skills/ux-variations/SKILL.md so default progression-mode cannot route to prototype before UI interview. Suggested rule:

  In default progression-mode, route experiments named during ux-variations are proposed validation targets only. Do not write or recommend prototype buildout until an approved ui-interview branch
  exists and user-flow-map --prototype-build-plan has created build items from approved UI reviews. Building before ui-interview is allowed only in layout-mode or when the user explicitly requests
  an ad hoc bypass; record that bypass as a user override.

  Also add a validation check to $prototype: fail if build-plan items lack ui_review_id unless an explicit bypass is recorded.

  Recommended next skill for fixing the skill contract: npx skillpacks install skill-dev, then $targeted-skill-builder ux-variations. investigate, report back, and do not implement

Visible pasted context also included full `<skill>` blocks for:

- `ui-interview` at `/Users/georgele/projects/tools/agentic-skills/.codex/skills/ui-interview/SKILL.md`
- `user-flow-map` at `/Users/georgele/projects/tools/agentic-skills/.codex/skills/user-flow-map/SKILL.md`
- `ux-variations` at `/Users/georgele/projects/tools/agentic-skills/.codex/skills/ux-variations/SKILL.md`

The pasted skill blocks matched the referenced local skill files used as evidence for this triage run.
