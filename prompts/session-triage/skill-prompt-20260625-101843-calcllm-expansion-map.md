---
skill: session-triage
agent: codex
captured_at: 2026-06-25 10:18:43 America/New_York
source: user-invocation
prompt_scope: visible-user-invocation
---

Session Triage

  Target: current session, calcllm, expansion-map Stage 3 handoff.

  User-identified issue: after confirming Crew expansion-map artifacts, my completion response did not include next-step routing.

  Verification verdict: verified.

  Evidence:

  - expansion-map alignment contract says that after final approval and confirmed artifacts, the handoff should route directly into the next skill’s gates in fresh-session mode.
  - The confirmed canonical artifact itself names the route: $lifecycle-metrics research/crew.
  - I verified availability: npx skillpacks which lifecycle-metrics reports customer-lifecycle, and .agents/project.json has customer-lifecycle enabled.
  - My final Stage 3 handoff listed files, verification, commit, and push status, but omitted the route until you asked “what’s next?”

  Root Cause

  Agent noncompliance with an adequate contract. The expansion-map contract had enough instruction; I focused the final response on shipping status and missed the post-confirmation routing
  requirement.

  Responsible Contract Gap

  None. This was not a skill-contract gap. It was a final-handoff self-check failure.

  Correct Route

  $lifecycle-metrics research/crew

  Fix Applied

  I recorded the correction pattern in tasks/lessons.md: confirmed alignment handoffs must include a Recommended next skill or Recommended next command when the skill contract or canonical artifact
  identifies one, after verifying pack availability.

  Also captured the prompt and task review artifacts.

  Committed and pushed:
  de10d56 Record next-step routing triage

  Recommended next skill for this triage fix: none. No skill edit is justified from the evidence. do not implement a fix, investigate and report back
