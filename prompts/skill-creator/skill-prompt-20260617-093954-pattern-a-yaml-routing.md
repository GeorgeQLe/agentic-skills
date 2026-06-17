---
skill: skill-creator
agent: codex
captured_at: 2026-06-17T09:39:54-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Findings

  Your recollection is correct.

  Across the scanned history, Pattern A research-orchestrator usage is now mostly happening as bare compiled YAML continuations, not as explicit skill re-invocations with YAML attached.

  Scope scanned:

  - 18,098 user prompt records
  - 7,102 sessions
  - Date range: 2025-12-10 to 2026-06-17
  - Sources: 7,449 Codex prompts, 10,649 Claude prompts
  - Focused Pattern A set: customer-discovery, competitive-analysis, positioning, journey-map

  Expected Pattern

  Current docs and active Codex skill files say Pattern A research orchestrators should advance like this:

  $competitive-analysis
  # review page
  $competitive-analysis + pasted compiled YAML
  # one heavy phase
  # review page
  $competitive-analysis + pasted compiled YAML

  The important rule: the compiled YAML is data. The orchestrator skill owns the interpretation, state resolution, artifact writing, archiving, and next framework selection. A bare YAML blob does
  not reliably trigger the right skill.

  Observed Pattern

  For Pattern A research-orchestrator prompts, I found:

   Behavior                                           Count
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━
   Relevant Pattern A prompts                            89
  ─────────────────────────────────────────────────  ───────
   Bare Pattern A compiled YAML, no parent command       53
  ─────────────────────────────────────────────────  ───────
   Explicit parent command with Pattern A YAML            0
  ─────────────────────────────────────────────────  ───────
   Parent command without YAML                           36
  ─────────────────────────────────────────────────  ───────
   Direct child/framework command                         4

  By owner inferred from alignment page or framework slug:

   Owner                   Bare YAML Count
  ━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━
   customer-discovery                   27
  ──────────────────────  ─────────────────
   competitive-analysis                 21
  ──────────────────────  ─────────────────
   journey-map                           5
  ──────────────────────  ─────────────────
   positioning                           0

  By source:

  - Bare Pattern A YAML: 52 Codex, 1 Claude
  - Parent command prompts without YAML: 10 Codex, 26 Claude

  Recent examples include:

  - Bare YAML for alignment/journey-map-alignmeant.html
  - Bare YAML for alignment/swot-formforge.html
  - Bare YAML for alignment/feature-pricing-matrix-afps-tracker.html
  - Bare YAML for alignment/porter-five-forces-alignmeant.html
  - Bare YAML for alignment/customer-discovery-alignmeant.html

  I also found direct framework invocations that current rules say should not be user-facing:

  - $competitive-analysis /frameworks/strategic-group-map research/afps-tracker
  - $competitive-analysis /frameworks/swot
  - $competitive-analysis /frameworks/porter-five-forces
  - $customer-discovery/frameworks/w3-hypothesis for research/chat/

  Trend

  This appears to be a June behavior shift.

  Monthly pattern:

  - 2026-03: 5 parent commands, no bare YAML
  - 2026-04: 11 parent commands, no bare YAML
  - 2026-05: 10 parent commands, no bare YAML
  - 2026-06: 53 bare YAML, 6 parent commands, 4 direct framework commands

  So the mismatch is recent and concentrated in Codex.

  Interpretation

  You are using the alignment page as the re-entry surface, then pasting the compiled YAML into a fresh session for the agent to infer the right skill. That often works only because the YAML
  includes clues like alignment_page: alignment/swot-afps-tracker.html, but it bypasses the robust contract.

  The intended pattern is:

  $competitive-analysis research/afps-tracker

  <paste compiled YAML>

  or:

  $journey-map

  <paste compiled YAML>

  That gives the agent both:

  - the parent orchestrator instructions
  - the YAML approval payload

  Risk

  The main failure mode is incorrect continuation routing:

  - Codex may treat the YAML as generic alignment feedback instead of Pattern A state input.
  - It may run a framework directly rather than through the parent.
  - It may update page/artifact state without the orchestrator’s manifest/file-existence rules.
  - It may miss the “one heavy phase per fresh session” contract.
  - It may route downstream before synthesis approval is actually written.

  Token/Cost Check

  Codex rich session logs had token snapshots for 3,079 sessions:

  - Total tokens: 11,336,627,977
  - Input tokens: 11,287,812,839
  - Cached input tokens: 10,718,788,096
  - Output tokens: 48,815,138
  - Reasoning output tokens: 11,217,137

  Cost is unavailable from reliable logged cost fields in this run, and I did not estimate pricing because you did not ask for current provider pricing verification.

  Recommendation

  For your own usage, the durable correction is simple:

  $<parent-orchestrator> [same scope/path args if any]

  <paste compiled YAML>

  Examples:

  $competitive-analysis research/afps-tracker

  alignment_page: ...
  approval_status: ready-for-agent-review
  ...

  $journey-map

  alignment_page: ...
  approval_status: not-approved
  ...

  Do not invoke framework paths manually unless you are intentionally testing a framework skill outside the Pattern A loop. From the previous text, I don't know if I like how we modeled this with A. I think that we should include enough context within the compiled yaml to properly route the agent, then from a clean fresh session, we can paste in the yaml and the agent should know the parent skill and the subskill as needed
