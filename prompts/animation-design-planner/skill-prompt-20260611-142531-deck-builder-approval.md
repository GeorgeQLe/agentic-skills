---
skill: animation-design-planner
agent: codex
captured_at: 2026-06-11T14:25:31-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

alignment_page: alignment/animation-design-planner-deck-builder-transitions.html
approval_status: ready-for-agent-review
gate_answers:
  - section: "Motion Contract A — blueprint-morph"
    gate_type: "motion-contract"
    status: answered
    answer: "Accept as specified"
  - section: "Motion Contract B — card-flight"
    gate_type: "motion-contract"
    status: answered
    answer: "Accept as specified"
  - section: "Lifecycle Ownership Map"
    gate_type: "lifecycle-ownership"
    status: answered
    answer: "Approve — shell ownership + pushState routing, spike first"
  - section: "Lifecycle Ownership Map"
    gate_type: "interruption-semantics"
    status: answered
    answer: "Approve both"
  - section: "Implementation Guardrails"
    gate_type: "scope/non-goals"
    status: answered
    answer: "Confirmed — retrofit stays out of scope"
  - section: "Proof Gate"
    gate_type: "proof-tooling"
    status: answered
    answer: "Confirmed — add Playwright at implementation time"
  - section: "Artifact Destination & Proposed File Changes"
    gate_type: "artifact destination"
    status: answered
    answer: "Approve destination"
    target_path: "apps/skills-showcase/docs/animation-plan-deck-builder.md"
  - section: "Artifact Destination & Proposed File Changes"
    gate_type: "proposed file changes"
    status: answered
    answer: "Approve scope and timing as listed"
  - section: "Post-Approval Route"
    gate_type: "post-approval route"
    status: answered
    answer: "Hand off to /exec for deck-builder implementation (spike first)"
section_feedback: []
