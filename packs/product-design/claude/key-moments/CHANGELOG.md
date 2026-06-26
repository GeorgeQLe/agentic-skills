# Changelog

## v0.0 - 2026-06-26

- Initial contract for the proof-priority ranking trunk skill that runs after `user-flow-map` and before `state-model`/`ux-variations`.
- Ranks user-flow branches by value × risk × frequency, orders branches, gates variation breadth, and promotes/prunes flows by writing existing flow-tree ordering fields (`journey_sequence`, `evaluation_priority`, `branch_order_override`, `priority_rationale`, branch `status`). No schema change; not a route position.
