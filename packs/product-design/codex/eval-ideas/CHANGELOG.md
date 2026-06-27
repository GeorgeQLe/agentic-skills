# Changelog

## v0.1 - 2026-06-26

- Aligned the **Product-Path Scope Resolution** section to the canonical research-skill contract (`tests/layer1/product-path-manifest.test.ts`): write back `active_paths` on manifest updates, recognize legacy `status: abandoned` archived paths and refuse to write scoped outputs there, exclude the full `archived`/`abandoned`/`deferred`/`revisit_candidate`/`promoted` set plus any `scope_path` under `research/_archive/`, and name flat `research/` single-product mode explicitly. Behavior-only fix to return layer1 to green; no change to the loop, gate, or consolidation flow.

## v0.0 - 2026-06-26

- New skill. Thin Pattern A orchestrator that bridges `$brainstorm` and the `$feature-interview` prompts it proposes: consumes an existing brainstorm idea set, loops one `$feature-interview` per fresh-context session over the user-selected ideas, and consolidates survivors into a prioritized `$roadmap` handoff. Reuses the Research Session Loop convention (`docs/research-session-loop-convention.md`): run manifest at `tasks/_working/eval-ideas-run.yaml`, `pending = selected − ideas-with-a-written-interview-log/spec`, one heavy phase per invocation, self-re-invocation routing. Adds a warn-and-override entry **maturity soft gate** (spec exists / no open todos / evidence backing) on cold start. Does not generate ideas, change `$feature-interview` or `$brainstorm`, or write specs directly — it routes through `$feature-interview` (writer) and `$roadmap` (phaser).
