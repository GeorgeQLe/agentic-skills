# AFPS YAML, Orchestrator, And Design-Tree Example

This example is linked from `briefing-slides/afps-skill-overviews.html` as a dense reference. It is not a live approval packet.

## YAML Handoff Shape

```yaml
# Invoke with: $ux-variations
command: "$ux-variations first-value-onboarding"
briefing_slides: briefing-slides/afps-skill-overviews.html
reference_pages:
  - alignment/user-flow-map-first-value.html
  - design/flow-tree-onboarding.yaml
source_artifacts:
  - research/positioning.md
  - research/journey-map.md
  - design/user-flow-onboarding.md
gate_answers:
  - slide: slide-4
    question: "coverage approval"
    answer: "approved"
slide_feedback: []
annotations: []
marked_slides:
  - slide: slide-4
    status: "important"
unanswered_required_questions: []
approval_status: ready-for-agent-review
```

## Orchestrator Skill Pattern

Orchestrator skills own a multi-session path. They usually:

- Resolve product-path scope before writing.
- Read upstream artifacts before asking questions.
- Select or run one framework, branch, or heavy phase per invocation.
- Store progress in manifests, canonical intermediates, or approved artifacts.
- Stop with a precise next command instead of improvising a new route.

AFPS examples include `customer-discovery`, `competitive-analysis`, `journey-map`, `positioning`, `user-flow-map`, `state-model`, and `research-roadmap`.

## Design-Tree Shape

```text
user-flow-map
  -> user-flow branch
      -> state-model attachment (optional)
      -> ux-variation branches
          -> ui-interview experiments
              -> build-ui-screens / logic-wiring build items
                  -> uat evidence
                      -> consolidate-prototypes
                          -> spec-interview
```

The design tree is the pre-production product-design lineage. It keeps branches, decisions, stale states, modify-back targets, and prototype build items tied to the approved flow instead of scattering status across unrelated task files.
