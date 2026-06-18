# state-model changelog (codex)

## v0.1 - 2026-06-18

- Setup-session and framework spec-session STOPs now emit the **Terminal handoff format** from `docs/prototype-session-loop-convention.md`: the intermediate just written, the next pending framework named in **plain English** by what it models (never only its internal `{framework-slug}`), and the **exact** resolved next command with `{topic}` filled in (e.g. `$state-model alignment-page-review`). When no frameworks remain, the handoff routes to the synthesis session. Strengthens the prior bare `$state-model [topic]` handoff so the user always sees what the next unit is, not just the command.

## v0.0 - 2026-06-18

- New orchestrator skill: authors the flow-anchored **logical** domain/state/logic model (entities, value objects, aggregates, state machines, events, commands, read models, policies, logical command/query contracts, ubiquitous-language glossary) from an approved user-flow map.
- Placed **after `$user-flow-map`, before `$ux-variations`** as an **orthogonal sibling** to the flow tree: the flow-tree `route` array is untouched; the skill owns `design/model-tree-{topic}.yaml` and writes only an optional top-level `model_tree_ref` back-pointer into the flow tree. Flow bindings are authoritative in the model-tree only.
- Runs the full six-framework set — `event-modeling`, `event-storming`, `domain-model` (DDD), `state-machine` (statecharts), `data-model` (logical ERD), `contract-map` (logical I/O) — one framework per session, with skill-detected run order/subset per engagement.
- Follows `docs/prototype-session-loop-convention.md`: live cursor is per-framework intermediate-file existence; `design/{slug}/_working/state-model-{topic}-brief.md` is the pure-context shared brief; `model-tree-{topic}.yaml` is the post-approval synthesized manifest (not a live run-manifest); exactly one binding alignment gate at synthesis. Folds to a single session for fewer-than-3-framework domains or `--no-chunk`.
- Logical-only: storage, real endpoints, auth, migrations, and indexes are explicitly deferred to `$spec-interview`.
- Frontmatter: `type: research` (auto-injects the glossary gate), `visual_tier: visual` (ERD/statechart diagrams), `invocation: orchestrator`, `context_intake: scoped`.
