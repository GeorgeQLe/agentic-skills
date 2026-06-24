# state-model changelog (codex)

## v0.7 - 2026-06-24

- Rewrote the Progress Handoff Block `Session guidance` field from a passive recommendation into an action directive: clear context (`/clear`) and run the exact next command in a fresh session, where the skill cold-starts and reads the durable cursor. Clarified that the `## Invoke With YAML` block is optional routing context, not consumed state.
- Added a one-time single-session tradeoff note at the setup (Domain Modeling Scope Checkpoint) stop only: the loop can run in one session or with `--no-chunk`, but later phases risk poorer quality and higher token cost from context bloat.

## v0.6 - 2026-06-22

- Updated design-tree route references to use `$consolidate-prototypes` as the primary consolidation skill.

## v0.5 - 2026-06-22

- Enforced HTML-first canonical writes: synthesis now assembles proposed domain-model and manifest content for `alignment/state-model-{topic}.html` before any canonical `design/**/*.md` or `design/**/*.yaml` write.
- Kept canonical domain-model docs, model-tree manifests, branch `model_ref`, top-level `model_tree_ref`, glossary write-forward, and archive cleanup inside the approval-gated path.

## v0.4 - 2026-06-22

- Added the required chunked Progress Handoff Block for setup, per-framework, and synthesis-ready stops so repeated `$state-model` invocations visibly explain completed framework count, durable cursor, current phase, next phase, fresh-session guidance, and the exact command.
- Fixed malformed Codex path literals to match the canonical design-tree contract: `design/{slug}/_working/state-model-{topic}-brief.md`, `design/{slug}/state-model-{topic}/{framework}.md`, and `alignment/state-model-{topic}.html`.

## v0.3 - 2026-06-21

- Reframed the body to the unified 5-stage design-tree flow (`interrogation -> research -> design -> plan -> implement(scoped)`) from `DESIGN-TREE-LOOP.md`: added the `## Design-Tree Flow` stage map, the per-branch iteration contract, and modify-back handling, plus explicit `## Next Work` / `## Invoke With YAML` self-routing handoff sections.
- Removed the incorrect `invocation: orchestrator` — it is a per-branch pipeline skill (per-user-flow-branch `model_ref` attachment), not the root orchestrator.
- Joined the stage-zero interrogation set (`## Interrogation Page` / `INTERROGATION-PAGE.md`).

## v0.2 - 2026-06-18

- Reclassified `type: research` → `type: planning` to match its product-design pipeline siblings (`user-flow-map`, `ux-variations`, `ui-interview`). state-model is a logical-domain-modeling orchestrator anchored to a local approved flow map; it performs no synthesized/web research and writes no `research/_working` packets, so the staged-research lifecycle contract does not apply. (Benchmark coverage registers it as a blocked pack skill pending a deterministic multi-artifact fixture.)
- Completed the Product-Path Scope Resolution flat-mode literal ("use flat `research/` single-product mode") so the skill satisfies the product-path-manifest scope-resolution contract.

## v0.1 - 2026-06-18

- Setup-session and framework spec-session STOPs now emit the **Terminal handoff format** from `docs/prototype-session-loop-convention.md`: the intermediate just written, the next pending framework named in **plain English** by what it models (never only its internal `{framework-slug}`), and the **exact** resolved next command with `{topic}` filled in (e.g. `$state-model alignment-page-review`). When no frameworks remain, the handoff routes to the synthesis session. Strengthens the prior bare `$state-model [topic]` handoff so the user always sees what the next unit is, not just the command.

## v0.0 - 2026-06-18

- New orchestrator skill: authors the flow-anchored **logical** domain/state/logic model (entities, value objects, aggregates, state machines, events, commands, read models, policies, logical command/query contracts, ubiquitous-language glossary) from an approved user-flow map.
- Placed **after `$user-flow-map`, before `$ux-variations`** as an **orthogonal sibling** to the flow tree: the flow-tree `route` array is untouched; the skill owns `design/model-tree-{topic}.yaml` and writes only an optional top-level `model_tree_ref` back-pointer into the flow tree. Flow bindings are authoritative in the model-tree only.
- Runs the full six-framework set — `event-modeling`, `event-storming`, `domain-model` (DDD), `state-machine` (statecharts), `data-model` (logical ERD), `contract-map` (logical I/O) — one framework per session, with skill-detected run order/subset per engagement.
- Follows `docs/prototype-session-loop-convention.md`: live cursor is per-framework intermediate-file existence; `design/{slug}/_working/state-model-{topic}-brief.md` is the pure-context shared brief; `model-tree-{topic}.yaml` is the post-approval synthesized manifest (not a live run-manifest); exactly one binding alignment gate at synthesis. Folds to a single session for fewer-than-3-framework domains or `--no-chunk`.
- Logical-only: storage, real endpoints, auth, migrations, and indexes are explicitly deferred to `$spec-interview`.
- Frontmatter: `type: research` (auto-injects the glossary gate), `visual_tier: visual` (ERD/statechart diagrams), `invocation: orchestrator`, `context_intake: scoped`.
