# Changelog

## v0.0 - 2026-06-26

- New skill. Thin Pattern A orchestrator that bridges `/brainstorm` and the `/feature-interview` prompts it proposes: consumes an existing brainstorm idea set, loops one `/feature-interview` per fresh-context session over the user-selected ideas, and consolidates survivors into a prioritized `/roadmap` handoff. Reuses the Research Session Loop convention (`docs/research-session-loop-convention.md`): run manifest at `tasks/_working/eval-ideas-run.yaml`, `pending = selected − ideas-with-a-written-interview-log/spec`, one heavy phase per invocation, self-re-invocation routing. Adds a warn-and-override entry **maturity soft gate** (spec exists / no open todos / evidence backing) on cold start. Does not generate ideas, change `/feature-interview` or `/brainstorm`, or write specs directly — it routes through `/feature-interview` (writer) and `/roadmap` (phaser).
