---
skill: investigate
agent: claude
captured_at: 2026-06-24T11:20:22
source: user-invocation
prompt_scope: visible-user-invocation
---

investigate and report back, do not implement: Target: Current $exec handoff in /Users/georgele/projects/libs/riverhawk-library; evidence from active conversation, .agents/project.json, installed .codex/.claude skill roots, and npx skillpacks
  which/status.

  User-Identified Issue: I recommended $brainstorm, but brainstorm was not installed and I did not include the npx skillpacks install ... prerequisite.

  Verification Verdict: Verified.

  Evidence:

  - My final handoff said: Recommended next command: $brainstorm.
  - npx skillpacks which brainstorm reports: brainstorm is provided by pack 'product-design' (not installed).
  - npx skillpacks status shows installed local skills are only exec, ship, ship-end, and session-triage.
  - .agents/project.json has enabled_packs: ["exec-loop"]; no product-design.
  - The $exec routing contract hardcodes $brainstorm when planned phases are exhausted, without tying that branch to the pack availability guard.

  Timeline: $exec completed Phase 6, saw no more planned phases, routed to discovery, emitted $brainstorm, then you corrected that the skill was unavailable and no installer command was given.

  Root Cause: Bad next-step routing contract: the $brainstorm fallback is treated like a base/default skill, but it is actually owned by the product-design pack. The exec-loop contract needs a
  specific availability check for this branch.

  Responsible Contract Gap: exec-loop skill routing, especially Codex $exec and likely $ship because both contain the same $brainstorm fallback. Durable fix belongs in the source pack, not just
  generated .codex/skills/** copies.

  Recommended Fix: Update the brainstorm routing rule to say:

  When routing to `$brainstorm`, first check `.agents/project.json` for
  `enabled_packs` containing `product-design` or `enabled_skills.brainstorm`.
  If absent, recommend `npx skillpacks install product-design` from the project
  shell first, then tell Codex users to start a fresh Codex CLI session if
  `$brainstorm` remains unavailable after install.

  Correct immediate recommendation here would have been:

  npx skillpacks install product-design

  Then run $brainstorm after the skill is visible.

  Validation Plan: Run:

  - npx skillpacks which brainstorm
  - npx skillpacks list-packs
  - targeted rg "brainstorm|product-design|skillpacks install product-design" across exec-loop skill sources
  - replay the exhausted-roadmap routing path and verify it emits the installer prerequisite when product-design is absent.

  Confidence And Gaps: High confidence. I did not inspect the upstream agentic-skills source tree in this repo because this checkout only has generated project-local skill roots.

  Recommended Next Skill: npx skillpacks install skill-dev, then $targeted-skill-builder exec-loop brainstorm pack availability

---

Follow-up: hand it to the relevant skill
