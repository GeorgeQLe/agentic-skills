# Production Ready Approval Contract

Production Ready Approval is the AFPS gate that confirms a concept, prototype, or specification is approved to become a real production product build. It means the operator has approved moving from prototype/specification work into production implementation; it does not mean the product is already shipped to users.

This is an artifact convention, not a lifecycle database, state file, or replacement for `research/.progress.yaml`. Do not add a new YAML registry or competing lifecycle schema for this gate.

## Artifact Shape

The approval record lives in the same alignment-page lifecycle used by the producing skill:

- `review` page: asks the production-readiness questions before implementation handoff.
- `confirmed` page: preserves the user's approval record after final compiled YAML is accepted.
- Optional `amended` page: revises a confirmed approval if later evidence changes the premise.

Default output path: `alignment/spec-interview-{topic}.html`. If a separate page is explicitly needed, use `alignment/production-ready-{topic}.html` and link it from the spec-interview page.

## Required Gates

A Production Ready Approval page or section must make these decisions explicit:

- Approved concept or prototype scope: what product, audience, and MVP boundary is approved for production.
- Evidence basis: consolidated prototype, post-prototype research, spec decisions, and known gaps.
- Production blockers: unresolved data, auth, infrastructure, compliance, business-model, or launch constraints.
- Implementation handoff: whether the next route is roadmap/execution, upstream redesign/research, or no-go.
- Approval meaning: approved to begin production build, not asserted as shipped, validated, or launched.

## Ownership

`consolidate-prototypes` (formerly `consolidate-variations`) does not own this gate. After consolidated MVP approval it routes to post-prototype research and then `spec-interview`. `spec-interview` owns the Production Ready Approval because it is the point where prototype assumptions become a production implementation specification.

`afps-status` may report whether the approval artifact exists and whether it is confirmed, but it must not treat the artifact as a new source-of-truth lifecycle store.
