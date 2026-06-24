# Proposal: State-Model-First Prototype Pipeline

> **Status:** proposed — no canon edited yet.
> **Authored by:** companion to `alignment/investigate-prototype-design-tree-flow.html` (§2).
> **Scope of this doc:** spell out every convention / skill / schema / sample / test edit an
> executor would apply to promote `state-model` and `create-ui-experiment` from off-route
> attachments into first-class inline route steps. This is a plan, not the change.

## 1. Summary & rationale

### Target sequence

```
journey-map ▶ user-flow-map ▶ state-model ▶ ux-variations ▶ ui-interview
  ▶ create-ui-experiment ▶ user-flow-map --prototype-build-plan
  ▶ prototype ⇄ uat ▶ consolidate-prototypes ▶ research-roadmap --post-prototype ▶ spec-interview
```

`user-flow-map` translates the journey map into design language (screen flow, entry points,
decisions/actions/states). `state-model` then **codifies the data architecture before the
UX/UI passes** — the domain/state/logic model is a property of the *flow*, not of any one UI
presentation, so authoring it once gives `ux-variations` / `ui-interview` a real substrate to
re-skin instead of re-inventing per variation.

Two promotions:

1. **`state-model` → mandatory inline route step** (was: orthogonal, skippable per-branch
   sibling). It owns a **hierarchical** model attachment — **app-whole** (tree root),
   **per-flow** (today's `model_ref`), and **per-screen** (as needed). For CRUD-trivial
   domains it carries a **fast-pass fold**: a quick confirm of the obvious data shape instead
   of a full multi-framework modeling pass.
2. **`create-ui-experiment` → mandatory inline route step** between `ui-interview` and
   `user-flow-map --prototype-build-plan` (was: per-branch experiment owner, "not a
   replacement top-level route position"). It is **batchable/deferrable**: the user may finish
   *all* `ui-interview` experiments first, then knock out all clickable experiments in one
   pass, so later interviews can adjust earlier experiment specs.

### Why data-first is safe

The existing convention already enforces *model-before-presentation*: `ux-variations` "requires
the branch's `model_ref` confirmed; do not grow UX branches first"
(`docs/design-tree-loop-convention.md` L360, L131–132). So the dependency is real today — it is
just enforced by next-step recommendation rather than drawn in the `route` tuple. This proposal
makes the existing dependency **honest** rather than inventing a new one.

Data-first does not lose UX-driven discovery, because the **`modify` / `needs-revalidation`
loop** catches model errors found during prototyping. A `modify` decision names `targets[]`
(an upstream `user-flow` branch or a `model_ref` node), returns each target to pending, and
marks descendants stale for re-validation (`docs/design-tree-loop-convention.md` §4 L297–308;
`design/flow-tree.schema.json` decision `$defs` L442–452). So if a UX/UI/prototype pass exposes
a modeling gap, the loop re-opens `state-model` — UX-first ordering is not needed to surface
model problems.

## 2. Blast radius — exact edits with file:line anchors

> Line numbers are anchors against the working tree at authoring time; an executor should
> re-grep the quoted wording before editing.

### 2.1 `docs/design-tree-loop-convention.md`

- **§6 route tuple & "not a route position"** — L372–377:

  > "The top-level `route` tuple stays the **6-skill sequence** (`user-flow-map → ux-variations →
  > ui-interview → prototype → consolidate-prototypes → spec-interview`) … `state-model` is a
  > **per-branch attachment** (`model_ref`), not a route position — keeping the route stable
  > while the model rides each branch."

  **Edit:** expand the tuple to the 8-step proposed sequence with `state-model` after
  `user-flow-map` and `create-ui-experiment` after `ui-interview`; replace "not a route
  position" with "a mandatory route step that attaches the hierarchical model
  (app/flow/screen)."

- **`create-ui-experiment` "not a replacement top-level route position"** — L366–369:

  > "Route approved clickable route experiment needs to `create-ui-experiment` before prototype
  > buildout. `create-ui-experiment` is a branch experiment owner, not a replacement top-level
  > route position; the canonical route still reaches build sequencing through
  > `user-flow-map --prototype-build-plan` and `prototype`."

  **Edit:** reposition as an inline, mandatory route step after `ui-interview`; add the
  batchable/deferred semantics (all interviews may complete first, then all experiments in one
  pass, allowing earlier-spec adjustment).

- **§1 node hierarchy** — L101–132 (node-types block L101–108, node table L110–120, the
  per-branch-model-attachment prose L122–132). Today only **per-flow** model attachment exists
  (`branches[].model_ref`, L104, L114, L127–129).

  **Edit:** add two node types — **root-level (app) model attachment** (a tree-root model the
  first `state-model` session authors before per-flow iteration) and **per-screen model
  attachment** (attached as needed, recommended on the `ui_experiment` node). Update the node
  table and the "Per-user-flow-branch model attachment" prose to describe the
  **app/flow/screen** hierarchy.

- **§3 role table** — L222–224 (the `state-model … create-ui-experiment …` pipeline-role row at
  L223). **Edit:** keep them in the pipeline role but reflect that both are now route positions,
  not off-route attachments.

- **§2 stage-4 deliverable table** — `state-model` row L183, `create-ui-experiment` row L186.
  **Edit:** `state-model` deliverable to name app/flow/screen scopes + the fast-pass fold;
  `create-ui-experiment` deliverable to note its inline, mandatory, batchable position.

### 2.2 `docs/skill-next-step-contracts.md` §8

- **Route string at L28** — the "Default AFPS business-product route" already lists
  `state-model [topic] (optional sibling)` inline but immediately negates it:

  > "`state-model` is an orthogonal sibling … it writes only an optional `model_tree_ref`
  > pointer into the flow tree and never alters the flow-tree `route` array, so it is
  > recommended-but-skippable, not a route enum member."

  **Edit:** drop "(optional sibling)" / "orthogonal sibling" / "recommended-but-skippable, not
  a route enum member"; state it is a mandatory route step (app/flow/screen, fast-pass fold)
  and that `create-ui-experiment` is a mandatory-but-batchable step after `ui-interview`. Note
  the route string here already lists `create-ui-experiment`'s downstream
  (`user-flow-map --prototype-build-plan`) but not `create-ui-experiment` itself — insert it.

- **Route string at L53** (the "Base planning/execution" Expected-End-States row): same edit —
  the mirrored canonical pipeline `user-flow-map -> state-model [topic] (optional logical-model
  sibling) -> ux-variations …`. Drop the "(optional … sibling)" qualifier and insert
  `create-ui-experiment` between `ui-interview` and `user-flow-map --prototype-build-plan`.

### 2.3 `packs/product-design/claude/state-model/SKILL.md` (+ codex mirror)

Mirror: `packs/product-design/codex/state-model/SKILL.md` (layer1 parity test enforces both).

**The model_ref-vs-model_tree_ref contradiction is already resolved** (state-model **v0.8**,
2026-06-24, COA 1): the Architecture section and the Constraints "flow-tree write" line now both
state `branches[].model_ref` is the primary flow-tree write and the top-level `model_tree_ref` is
optional back-compat — matching §4 and the design-tree-loop convention. The remaining promotion
work below is the *route-position* change only (orthogonal-sibling → first-class route step),
which v0.8 intentionally did **not** make.

The still-off-route framing the executor must flip:

- `## Architecture — Orthogonal Sibling To The Flow Tree` heading and its first bullet
  ("The flow-tree `route` array stays a locked six-step sequence… does **not** appear in or
  modify that array. Ordering is enforced by next-step recommendations, not the route enum.");
  Constraints "never modify the flow-tree `route` array."

**Edit toward a first-class route step** that owns **app/flow/screen** model attachments:

- Rewrite `## Architecture` (L28–35) from "orthogonal sibling, route array locked" to
  "first-class route step; owns the hierarchical model (app-root, per-flow, per-screen)."
- Routing lines to revise: L20 ("It sits **after `/user-flow-map`, before `/ux-variations`**" —
  keep, now as a route position not a sibling), L213/L244/L248 (next-command routing to
  `/ux-variations`, unchanged target but reframed as on-route).
- Add the **fast-pass fold** for CRUD-trivial domains — *distinct* from the existing
  framework-count fold at L85 ("Chunk only when the planned framework count is ≥ 3"). Fast-pass
  is a content judgment (obvious CRUD shape → quick confirm), not a session-count judgment.
- Add app-level and per-screen attachment to the `model-tree-{topic}.yaml` shape section
  (L225–234) and the Output section (L219–223).
- Bump the version one decimal from the then-current `state-model` version (as of 2026-06-24 the
  source is **v0.8** at `packs/product-design/claude/state-model/SKILL.md`, so the promotion bump
  is **v0.8 → v0.9**). Archive prior SKILL.md and update CHANGELOG (see §3).

### 2.4 `packs/product-design/claude/create-ui-experiment/SKILL.md` (+ codex mirror)

Mirror: `packs/product-design/codex/create-ui-experiment/SKILL.md`.

- Reposition from "experiment owner, not a default buildout path" (L16, L18) to an **inline
  mandatory** route step after `ui-interview`.
- Add a **`--batch` / deferred mode**: process all approved UI branches in one pass after all
  interviews complete, explicitly allowing adjustment of an earlier experiment spec in light of
  a later interview. Today the skill builds **one** branch per run (Constraints L68, "Build one
  approved UI experiment branch per run") — the batch mode is the additive exception.
- Update `## Next Work` (L55–63) so the primary route is
  `/user-flow-map --prototype-build-plan [topic]` as the mandatory next step (the three current
  bullets stay as decision-rule branches).
- Bump `version: v0.1 → v0.2` (frontmatter L5). Archive + CHANGELOG.

### 2.5 `packs/product-design/claude/ui-interview/SKILL.md` (+ codex mirror)

> Source-of-truth note: `ui-interview`, `ux-variations`, and `user-flow-map` are authored under
> `packs/product-design/claude/` (and `…/codex/`) — that is what the skillpacks manifest bundles.
> The `.claude/skills/<skill>/SKILL.md` copies are **gitignored generated install roots** and can
> lag the source; do not edit them. Re-derive the line anchors below against the `packs/` source.

- Recommended-next-command lines (route to `/user-flow-map --prototype-build-plan [topic]`).
  **Edit:** route to
  `/create-ui-experiment [specific-ux-variation]` as the mandatory next step, with the build
  plan as the step after.
- Reconcile the standing tension: the layer1 test asserts ui-interview must contain "Do not
  write or route default clickable prototype buildout from `ui-interview`"
  (`tests/layer1/product-design-flow-tree.test.ts` L246) **and** "Route approved clickable
  route experiment needs to `create-ui-experiment …`" (L245). Under this proposal the routing
  to `create-ui-experiment` becomes the default — so the "do not route default clickable
  buildout" assertion must be reworded (ui-interview still does not *build* the clickable
  prototype; it now *routes* to the skill that does).
- Bump one decimal from the current source version (as of 2026-06-24, `ui-interview` is **v0.27**
  at `packs/product-design/claude/ui-interview/SKILL.md`, so **v0.27 → v0.28**) in both mirrors.
  Archive + CHANGELOG.

### 2.6 `packs/product-design/claude/ux-variations/SKILL.md` (+ codex mirror)

- Next-command stays `/ui-interview [specific-ux-variation]`. Keep its `model_ref`-confirmed
  prerequisite — now **upstream-guaranteed** by the mandatory `state-model` step. Likely **no
  version bump** unless wording changes (source is **v0.28** as of 2026-06-24). `user-flow-map`
  source is **v1.6**.

### 2.7 `design/flow-tree.schema.json`

- Bump `schema_version` const **`v0.3 → v0.4`** (L19) and the `description` (L5).
- Expand the `route` tuple from the closed 6-item enum/prefixItems (L36–55) to include
  `state-model` (after `user-flow-map`) and `create-ui-experiment` (after `ui-interview`):
  add both to the `items.enum` (L37–44), insert the two `prefixItems` consts (L46–53), and
  update `minItems`/`maxItems` from `6` to `8` (L54–55).
- Add an **app/root model attachment** key at the manifest top level — e.g.
  `app_model_ref` (repo-relative path to the app-whole model-tree), distinct from the
  **deprecated** top-level `model_tree_ref` (L87–91) and the per-flow `user_flow_branch.model_ref`
  (L312–316).
- Add a **per-screen `model_ref`** on the `ui_experiment` `$defs` (L395–428) — today the only
  model linkages are `user_flow_branch.model_ref` (L312) and the deprecated top-level
  `model_tree_ref` (L87).

### 2.8 `design/model-tree.schema.json`

- Consider a `scope: app | flow | screen` field on the model-tree manifest (header at L1–20;
  `schema_version` const `v0.2` at L18) so a model-tree declares which hierarchy level it
  models. Bump its `schema_version` if the field lands.

### 2.9 `design/flow-tree-sample.yaml`

- Bump `schema_version` (L1, currently `v0.3`).
- Add the two new `route` entries (`state-model` after `user-flow-map`; `create-ui-experiment`
  after `ui-interview`) to the route list (L3–10).
- Demonstrate an **app-level model attachment** (the new top-level key) and one **per-screen
  `model_ref`** on a `ui_experiment` node, alongside the existing per-branch `model_ref` on
  `submit-and-approve`.

### 2.10 `tests/layer1/product-design-flow-tree.test.ts`

- `schema_version` const assertion — L62, L64 (`expect(schema.properties.schema_version.const)
  .toBe("v0.3")`).
- Route `prefixItems` assertion — L65–72 (the 6-const array) → 8 consts in the new order.
- `create-ui-experiment` routing assertions — L245–246 (the `Route approved clickable route
  experiment …` and `Do not write or route default clickable prototype buildout …` strings).
- `state-model` wording assertions — L437–439 (`Attach the branch-scoped model via
  branches[].model_ref` / `Write the optional top-level model_tree_ref pointer`); add coverage
  for app/screen scopes.
- Mirrored AFPS route string — L484–486 (`user-flow-map -> state-model [topic] (optional
  sibling) -> ux-variations …`) → drop "(optional sibling)", insert `create-ui-experiment`.
- Add new coverage for the app-level / per-screen model scopes and the fast-pass fold.

## 3. Versioning & mirrors checklist

Per `CLAUDE.md` Skill Versioning:

- [ ] Bump each from its **current source** version (verify with `grep '^version:'` against the
      `packs/product-design/{claude,codex}/<skill>/SKILL.md` source, not the gitignored
      `.claude/skills` copies). As of 2026-06-24: `state-model` **v0.8 → v0.9**,
      `create-ui-experiment` **v0.1 → v0.2**, `ui-interview` **v0.27 → v0.28`. (Decimal bump =
      non-refactor behavioral change.)
- [ ] Archive each prior SKILL.md via `scripts/skill-archive.sh <skill-dir>` **before** bumping,
      to `archive/<old-version>/SKILL.md`.
- [ ] Update each skill's `CHANGELOG.md` with what changed for the new version.
- [ ] Update **both** Claude and codex mirrors for every skill — the layer1 parity test enforces
      Claude/codex SKILL.md parity.
- [ ] `git add` the skill/schema/sample source edits **before** running `npm run build` (or
      `build-skillpacks-manifest.mjs`) — the manifest is generated from the **git index**, not
      the working tree. Then `git add` the regenerated
      `packages/skillpacks/dist/skillpacks-manifest.json` and commit source + manifest together
      in one atomic commit. `build:check` validates the committed manifest against the index.
- [ ] Re-run `tests/layer1/product-design-flow-tree.test.ts` and the full layer1 parity suite.

## 4. Open design questions (resolve before applying canon)

1. **Per-screen model home** — attach the per-screen `model_ref` to the existing
   `ui_experiment` node (recommended — minimal schema surface), or introduce a dedicated screen
   node type? Recommendation: the `ui_experiment` node.
2. **Does `route` literally enumerate the two new steps?** An 8-item tuple makes the order
   machine-checkable, but must be reconciled with "fast-pass" — fast-pass means
   *always present, foldable*, not *sometimes absent*. So `state-model` stays in the tuple even
   for trivial domains; the fold only collapses its session count, not its route membership.
3. **App-level model timing** — is the app-whole model one root attachment authored in the
   **first** `state-model` session (before per-flow iteration begins), then refined per flow?
   Recommendation: yes — author the app-root model first so per-flow models inherit shared
   entities/vocabulary.

## 5. Verification (for the executor who applies this)

- Schema: a flow tree with the 8-step route, an app-level model attachment, and a per-screen
  `model_ref` validates; a 6-step route fails `minItems`.
- Tests: `tests/layer1/product-design-flow-tree.test.ts` green with the updated assertions.
- Mirrors: Claude/codex parity test green for all three bumped skills.
- Manifest: `npm run build:check` passes against a clean index.
- Conventions: no remaining "orthogonal sibling" / "not a route position" /
  "recommended-but-skippable" wording for `state-model`, and no "not a replacement top-level
  route position" for `create-ui-experiment`.
