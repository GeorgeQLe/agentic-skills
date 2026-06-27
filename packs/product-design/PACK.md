# Product Design Pack

Product design skills for flow mapping, UX exploration, prototyping, specification, design systems, and feature interviews. Covers the full design workflow from initial brainstorming through pre-UI flow structure, variation exploration, consolidation, and final specification.

Install this pack when doing product design, UX research, prototyping, or UI specification work.

Install in a project with:

```bash
scripts/pack.sh install product-design
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `brainstorm`: Generate and explore ideas for a product or feature direction.
- `feature-interview`: Conduct a structured interview to define feature requirements and constraints.
- `eval-ideas`: Loop `feature-interview` over a brainstorm idea set (one interview per fresh-context session, tracked by a run manifest) and consolidate the survivors into a prioritized `roadmap` handoff. Bridges `brainstorm` → `feature-interview` → `roadmap`.
- `design-inspirations`: Gather UI/UX inspiration once via web research — named patterns, conventions, component-library references, and annotated links — into a durable cited brief that feeds `ui-interview` and `ux-variations`.
- `user-flow-map`: Map positioned product goals into the root of a wireframe tree with user-flow branches, decisions, states, handoffs, and low-fidelity wireframe notes.
- `key-moments`: Rank the user-flow branches by proof priority (value × risk × frequency) after `user-flow-map`, ordering branches, gating variation breadth, and promoting or pruning flows so the tree grows in proof order. Writes existing flow-tree ordering fields only.
- `ui-interview`: Investigate a specific UX variation branch, propose an HTML visual mockup, interview for alignment, and approve/reject/retry the branch before routing onward.
- `build-ui-screens`: Build the visual UI screens for an approved UI branch as an ordered element-batch loop with a per-batch visual checkpoint and a minimum-UI stop, writing the per-screen build ledger before wiring.
- `spec-interview`: Conduct a structured interview to produce a detailed product specification.
- `ux-variations`: Expand a selected user flow into alternate progression branches users can compare before one branch moves into UI proposal work.
- `consolidate-prototypes`: Converge evaluated prototype branches into an approved MVP, write AFPS graduation, and hand off to post-prototype cleanup.
- `logic-wiring`: Wire the visual screens from `build-ui-screens` into a clickable, state-backed prototype (plus runnable CLI/API/infra logic) so each variation's flow can be walked end-to-end before consolidation.
- `design-system`: Define or extend a design system with tokens, components, and usage guidelines.
