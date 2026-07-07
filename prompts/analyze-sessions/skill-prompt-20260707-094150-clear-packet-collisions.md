---
skill: analyze-sessions
agent: codex
captured_at: 2026-07-07T09:41:50-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

$analyze-sessions Session Triage — /clear + attached build-ui-screens packet

Target (scope & evidence)
- Scope: the current conversation (the /clear turn immediately before this) + repo /Users/georgele/projects/apps/draft-stonk-mk3.
- Evidence:
  - alignment/build-ui-screens-search-to-pick-sprint.html — exists, 49 KB, dated Jul 7 01:00 (the completed run's alignment page).
  - design/flow-tree-draft-stonk.yaml — exists (the packet's approved target_path).
  - Git: 0428c67 Build Search-To-Pick Sprint visual screens (S1-S4) on fixtures and 1a20c90 …write canonical packet — the build run is already committed.
  - .claude/skills/build-ui-screens/SKILL.md:63,68,76 — default terminal route is /user-flow-map --prototype-build-plan [topic] when no valid prototype build plan exists (matches the packet's destination).
  - # Invoke with: header origin: authored by the shared ALIGNMENT-PAGE.md convention (present in ~dozens of skills) — it is a provenance header, not a command directive.

User-identified issue
Agents "overreact" to context clearing (blank, generic "ready" reply) while "ignoring the yaml command invocation" attached to the /clear.

Verification verdict: partially verified.
The phenomenon is real and precisely explicable — but the specific instance was contract-correct, not a defect. The /clear turn carried a local-command-caveat: "DO NOT respond to these messages or otherwise consider them in your response unless the user explicitly asks." So taking no action on the YAML was mandated. There is no verified skill/contract bug here.

What actually happened
1. /build-ui-screens search-to-pick-sprint ran to completion (screens S1–S4 built, committed in 0428c67, alignment page written).
2. Its terminal artifact is a gate/response packet from the alignment-page convention: response_status: complete, approval_status: ready-for-agent-review, all four gates answered, and an approved destination routing onward to /user-flow-map --prototype-build-plan draft-stonk (writing design/flow-tree-draft-stonk.yaml).
3. You ran /clear. That packet surfaced in the injected content, appended after the empty <local-command-stdout>, wrapped by the do-not-act caveat.
4. My reply — "Context cleared. Ready for your next task." — honored the caveat.

Why the dual failure pattern happens (the actual answer to your question)

Two signals collide on a /clear turn, and mis-calibrated agents resolve the collision by picking one pole instead of parsing the packet:

- The over-reacting pole over-weights /clear. It reads the command as an intent wipe ("blank slate, nothing to see") rather than what it mechanically is — a context-window reset. It emits a content-free "ready for anything" and mentally discards the packet. The cost shows up later: when you do ask "what happened here," it has thrown away the thread and can't reconstruct that a run just completed with an approved next step.
- The mirror (eager) pole over-weights the YAML's lead line # Invoke with: /build-ui-screens search-to-pick-sprint. That reads like an imperative, so the agent tries to re-run the command — even though the work is already done (0428c67; the 49 KB alignment page exists). That's a wasteful re-execution.

Neither pole reads the packet's real semantics. It is not a command — it's a completion+routing handoff. # Invoke with: is a provenance label (which command produced this artifact), authored by the shared ALIGNMENT-PAGE.md convention; response_status: complete says the work is finished; the destination gate says the approved next move is /user-flow-map, not a re-invoke.

Correct calibration: treat /clear as a window reset, honor the caveat (take no action unprompted), but still parse and retain the packet — so the moment you ask, the answer is ready: "that's your finished build-ui-screens run; the approved next step is /user-flow-map --prototype-build-plan draft-stonk."

Root cause: agent-side signal-calibration, not a contract gap. The /clear + caveat behavior is harness-level; the build-ui-screens contract and the packet format are working as designed.

Responsible contract gap: none. Defect location: neither managing-layer nor invoking-directory — no locatable canonical target to patch, because nothing is broken.

Recommended fix: none. Per this skill's constraints, I don't recommend a skill/convention change when the contract is already clear and the behavior was correct. One thing I deliberately rejected: renaming the # Invoke with: provenance header across the alignment-page convention to reduce its imperative smell — it's used across ~dozens of skills, the ambiguity only bites in the rare /clear-collision, and the fix belongs in agent reasoning, not a cross-cutting convention rewrite.

Where you actually are (the useful part): the Search-To-Pick Sprint UI branch is built and approved. The approved next command is:
/user-flow-map --prototype-build-plan draft-stonk

Confidence & gaps: High on the completion state and routing (files + commits + SKILL contract all agree). The one thing I can't see directly is the harness mechanic that appended the packet to the /clear injection — I'm inferring it's residual prior-command output surfaced into the cleared window; that inference doesn't change the verdict. Are there other sessions that hit this clear issue? Is there anyway we can avoid this? Or is it better to completely close and restart claude instead of clearing context?
