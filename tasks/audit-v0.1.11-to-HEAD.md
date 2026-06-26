# Audit: `v0.1.11..HEAD` — bugs, footguns & quality

**Snapshot (pinned):** HEAD=`4c3163c4`, baseline tag `v0.1.11`=`87f16a5e` · 52 commits · 623 files changed.
**Mode:** read-only audit. No source edits applied — fixes await your approval.
**Method:** Tier 0 (all automated gates) + Tier 1 (6 parallel review lanes A–F) + Tier 2 (adversarial verification). Every High/Medium finding below was independently re-checked for false positives and framing; corrections from that pass are folded in. Coverage of substantive changed files is total (see Appendix B).

## TL;DR

- **No Critical bugs.** The risky executable surface (skillpacks CLI dry-runs, metadata-retry loop, publish boundary) is **clean and well-tested**. The 0.1.12 release state is intentional, not a footgun.
- **One genuine content defect:** `ux-variations` orders a `user_flow_branch` by fields that only exist on `ux_variation_branch` (schema-illegal under `additionalProperties:false`). Verified real — but the illegal keys degrade to no-ops at runtime, so the practical severity is **Medium**, not High (the effective order still matches intent).
- **`master` is red on three gates** — but every red is mechanical, not a product-behavior break:
  - `cd tests && npm test`: **all 10** new in-range failures are **stale tests** (the `pack`-skill removal + one Session-guidance text rewrite + version-number pins). Verified the migrated content was *not* dropped, and none protects a live contract that's now violated. The suite was *already* red at v0.1.11 (4 pre-existing benchmark failures), so this is accumulating test-maintenance debt, not a clean regression.
  - `skill-mirror-parity-audit.sh` (2): both are audit-tooling gaps (allowlist + normalizer); mirror *content* is correct.
  - `validate:data` (1): one stale generated asset (`github-proof-data.js`) — HEAD committed `tasks/todo.md` without regenerating it.
- **Correction from the double-check:** the two benchmark tests I first attributed to a "create-ui-experiment coverage gap" actually fail because they're **stale `pack`-removal tests**. The `create-ui-experiment` coverage gap is real but separate — it rides inside the *pre-existing* (out-of-range) benchmark failures and didn't flip any test red.

---

## HIGH

### H2 — `master` test suite is red: 10 new in-range failures in `cd tests && npm test`
- **What:** At HEAD, `npm test` fails **14 / 2387**. Baseline v0.1.11 already failed **4** (pre-existing benchmark-coverage; out of range — see Appendix A). The **10 new in-range failures** are committed red on `master`.
- **Why it's High:** a green layer1 run is a basic quality gate and it's broken on the primary branch. **But the risk is contained:** the double-check confirmed **all 10** are stale tests — none protects a live product contract that is now violated. The suite was already red at v0.1.11 (4 failures), so red commits have been landing regardless; this is accumulating **test-maintenance debt**, not a behavioral regression. Migrated content was verified *present* (reload guidance + shipping/commit boundary in `init-agentic-skills` v0.12, both mirrors), and the rename-routing assertions inside `global-customer-discovery-routing` *pass* — those tests only throw `ENOENT` on the deleted `pack` file.

| Failing test | Verdict | Fix |
|---|---|---|
| `skill-install-routing-audit.test.ts:26` | **stale test** — asserts `14/14`; `scripts/skill-install-routing-audit.sh:19` correctly reports `12/12` after pack removal (script is right; `--active` passes) | change `14/14`→`12/12` |
| `global-customer-discovery-routing.test.ts` (2) | **stale test** — both fail on `ENOENT base/*/pack/SKILL.md`; the customer-discovery rename assertions themselves pass | drop pack paths (`:16-17`) + pack assertions (`:53-58`) |
| `global-launcher-root.test.ts` | **stale test** — copies deleted `base/*/pack/scripts/pack.sh` | repoint to root `scripts/pack.sh` or delete |
| `pack-reload-contract.test.ts:12-13` | **stale test** — content migrated to `init-agentic-skills` (verified present) | repoint `skillPaths` → `base/*/init-agentic-skills/SKILL.md` |
| `pack-shipping-boundary.test.ts:24-25` | **stale test** — boundary migrated (verified present) | repoint `packSkillPaths` → init paths |
| `init-agentic-skills-contract.test.ts:14/20/58` | **stale test** — pins `v0.11` (skill legitimately bumped to `v0.12`); asserts codex `$pack` (removed) | bump to `v0.12`; drop/replace `$pack` assertion |
| `product-design-flow-tree.test.ts:395` | **stale test** — asserts literal `"fresh session recommended"`; commit `2cfc8480e` rewrote to "continue in a fresh session" | update substring |
| `benchmark-results-matrix.test.ts` | **stale test** — expects a `` \| `pack` \| Codex \| `` row for the removed skill | drop the `pack` expectation |
| `skills-showcase-benchmark-demo.test.ts:79-87` | **stale test** — looks up the removed `pack` skill in generated showcase data; `packSkill` is now `undefined`, so `.benchmarkEvidence.demo` assertion (`:83`) fails | drop/repoint the `pack`-demo case |

> **Corrected from the first draft:** the last two rows were originally mis-attributed to the `create-ui-experiment` coverage gap. They actually fail on `pack` removal (stale). The coverage gap is separate — see M3.

> Severity call: tracked as High because the primary-branch gate is red, but if you weigh it by *risk* (100% stale-test debt, suite already red pre-range) it is arguably Medium. Your call on how to log it.

---

## MEDIUM

### M0 — `ux-variations` branch-selection order names schema-illegal fields (verified real; runtime impact limited)
- **Where:** `packs/product-design/claude/ux-variations/SKILL.md:38` **and** `packs/product-design/codex/ux-variations/SKILL.md:38` (byte-identical, both mirrors). Introduced by commit `8693298dc`.
- **What:** The step "resolves the next eligible modelled **user-flow branch** lacking `ux_variations`" but sets `Branch selection order: explicit user override, journey_sequence, activation_fit, first_value_fit, evaluation_priority, status, then stable array order`.
- **Why it's a defect:** `design/flow-tree.schema.json` defines `$defs.user_flow_branch` with `additionalProperties: false` (line 263); its only ordering-relevant key is `journey_sequence`. `activation_fit`, `first_value_fit`, `evaluation_priority` are **required properties of `ux_variation_branch`** (schema lines 338-340) — the *child* nodes ux-variations grows, not the node it selects. So 3 of 6 named tiebreakers reference fields that cannot exist on the selected node. `flow-tree-sample.yaml` confirms the placement (those three appear only under `ux_variations:` children, lines 41-43/65-67). The sibling `ui-interview/SKILL.md:38` uses these fields *correctly* because it selects a `ux_variation`.
- **Verified:** independent refutation agent + schema + sample-YAML. **Confirmed real.**
- **Why Medium, not High (framing correction):** this is a *selection/read* ordering instruction, not a *write*, so no agent would write illegal fields onto a node, and a strict validator never sees them. An agent following the instruction simply finds the three absent keys are no-ops and falls through to `status` then array order — i.e. the *effective* order already collapses to the correct `journey_sequence, status, array order`. So it's a spec-correctness defect (confusing, technically illegal) with limited behavioral impact.
- **Fix:** restrict the order to `user_flow_branch` fields, both mirrors:
  `Branch selection order: explicit user override, journey_sequence, status, then stable array order.`
  Optionally add a layer1 test asserting ux-variations' selection keys ⊆ `$defs.user_flow_branch.properties`.

### M1 — `skill-mirror-parity-audit.sh` fails (2); content is correct, audit tooling has gaps
- **`exec-loop/ship` version mismatch** (Claude=v0.8, Codex=v0.9). Verified the full history: at v0.1.11 **both** were v0.7 and the audit passed. Commit `a439b3751` bumped **codex/ship** v0.8→v0.9 to *gate an already-existing* `$brainstorm` route behind a `product-design` pack-availability check; **claude/ship** has no brainstorm route to gate, so it correctly stayed v0.8. The version drift is the only **new-in-range** parity break and is intentional but **not allowlisted**.
  - **Fix:** add `["exec-loop/ship::version", "Codex gates the $brainstorm route; Claude ship has no brainstorm route."]` to the approved-version-drift map (`scripts/skill-mirror-parity-audit.sh:55-83`).
  - **Framing note (not a regression):** the deeper asymmetry — codex/ship carries a `$brainstorm` new-phase-discovery route and claude/ship does not (and brainstorm lives in the `product-design` pack, available to both platforms) — is **pre-existing** (present at v0.1.11) and already tolerated by the audit's content comparison. Whether claude/ship *should* gain a parallel `/brainstorm` route is a standing design question, out of this range. Flag for the maintainer; do not "fix" it as part of this audit.
- **`session-analytics/session-triage` "Pack Availability Guard" drift.** Both mirrors were updated symmetrically (commit `9b7f9c388`, v0.5→v0.6, content semantically identical); the `normalizePlatformSyntax` normalizer (`:243-254`) only rewrites `After install, tell Claude/Codex users…`, not the `Tell (Claude|Codex) users to…` reload phrasing session-triage uses, so it false-flags legitimate platform lines.
  - **Fix:** extend `normalizePlatformSyntax` to also collapse `Tell (Claude|Codex) users to …` reload sentences (and sort path lists), **or** add `session-analytics/session-triage` to an approved-section-drift allowlist.

### M2 — `validate:data` red: `github-proof-data.js` has a stale `sourceFingerprint`
- **Where:** `docs/skills-showcase/assets/github-proof-data.js:4` + `apps/skills-showcase/public/assets/github-proof-data.js:4` — committed `baed7147…` vs index-regenerated `45712876…`.
- **Why:** the fingerprint covers tracked inputs incl. `tasks/todo.md` (`generate-skills-showcase-github-data.mjs:205-210`). Last regenerated in `a0296031d`; HEAD `4c3163c4` then modified `tasks/todo.md` **without** re-running the showcase generator — exactly the "stage-before-build" footgun CLAUDE.md warns about. Tree is clean (index==HEAD), so the mismatch is a genuine stale-committed-asset.
- **Fix:** run `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, then `git add` both copies and commit. (The benchmark-matrix portion of the same `validate:data` failure is benign churn — see L7.)

### M3 — New skill `create-ui-experiment` missing from benchmark coverage registry (corrected)
- **Where:** `tests/harness/bench-coverage.ts` (coverage registry). New skill from commits `ba6b408ad`/`487bfc605`.
- **What:** the new in-range skill `create-ui-experiment` is not registered, so `bench-coverage`/`bench-setups` emit `Repository skill "create-ui-experiment" is missing from benchmark coverage matrix.`
- **Correction / sharper framing:** this does **not** flip any test red. Those `bench-coverage`/`bench-setups` tests were **already failing at v0.1.11** for a *different* pre-existing skill (`consolidate-variations`, also unregistered). `create-ui-experiment` simply adds a second name to an already-red test's diff. So this is a genuine in-range omission (a new skill that should have been registered) of **Low practical impact** — it neither caused nor can independently fix those failures (`consolidate-variations` must be addressed too).
- **Fix:** register `create-ui-experiment` (and, to actually green those tests, `consolidate-variations`) in the coverage registry as custom/generic/blocked; regenerate the matrix. Note: fully greening `bench-*` is **out of audit range** since the root failure predates v0.1.11 — flag for a separate cleanup.

---

## LOW / NITS

- **L1 — `scripts/detect-secrets.sh` is non-functional on macOS/darwin** (the stated platform): aborts with "grep with -P (PCRE) support is required." The secrets gate can't run locally. *(Pre-existing; not in-range. Manual diff scan over `v0.1.11..HEAD` found no secrets.)* Fix: fall back to `ripgrep`/`grep -E` or `perl` when GNU `grep -P` is absent.
- **L2 — `verify-published-package.sh:139`** cosmetic: when `npm view version` succeeds but `npm view versions` fails, the failure message interpolates the *successful* `metadata_json` as if it were error context. Retry/exit logic unaffected. Fix: only include `metadata_json` when it represents the failing call.
- **L3 — `scripts/skill-alignment-routing-audit.mjs:260-262`** the next-work pairing filter `entry.line <= route.line || route.label === "command"` short-circuits on `command`, accepting `Next work` lines positioned *after* the route. No false negative today (fixtures don't invert order) but loosens an ordering invariant. Fix: drop the `|| route.label === "command"` clause.
- **L4 — `skill-alignment-routing-audit.mjs` `--report` exit semantics differ** from the sibling shell `skill-install-routing-audit.sh --report` (the .mjs exits 1 on findings; the shell does not). Not a bug; add a comment so nobody "fixes" one to match the other.
- **L5 — brainstorm SKILL.md nits** (both mirrors): a leftover generic "## Alignment Page" conditional trigger mildly contradicts the now always-on Process step, and a stale "stage one (framework/scope)" cross-reference. Tidy-up only.
- **L6 — `README.md:138`** references `base/codex/exec/SKILL.md`; canonical `exec` lives at `packs/exec-loop/codex/exec/SKILL.md`. *(Pre-existing — byte-identical at v0.1.11; out of range, noted for a future pass.)*
- **L7 — `docs/benchmark-results-matrix.md` regeneration churn is non-deterministic** (date stamp via `new Date()`; one `exec-codex-*` run hash from gitignored `tests/benchmarks/runs/**`). No action; it rides along when M2 is regenerated.

---

## Verified CLEAN (high-confidence, for the record)

- **skillpacks CLI** — uninstall-global dry-run (`3034cbd20`) is provably side-effect-free; "unsafe refresh dry runs" explanation (`198050e2c`) adds reporting only; **metadata-retry loop** (`6cb8d04c5`) is bounded (no infinite loop / off-by-one), uses `--prefer-online` to defeat stale-cache, exits 1 on exhaustion — all directly tested.
- **0.1.12 release state** — `package.json`/`dist manifest` deliberately held at `0.1.11` so `./publish.sh patch` cuts `0.1.12` from a clean tree; documented in `CHANGELOG.md:15`, same pattern as 0.1.10/0.1.11. **Not a footgun.** Counts reconcile (388 skills / 41 packs across manifest + skills-data + validator); CHANGELOG "390" is a pre-removal historical stamp.
- **`pack`-skill removal** (`a0296031d`) — fully purged; **zero dangling `/pack` or `$pack` command refs** in the active tree (surviving "pack" hits are `scripts/pack.sh`, the "skill pack" noun, or intentional legacy-wording prohibitions). Guided setup migrated into `init-agentic-skills` (both mirrors, v0.12; reload guidance + shipping boundary verified present).
- **state-model `model_ref` vs `model_tree_ref`** (`47959e716`) — contradiction resolved across both mirrors + `docs/skill-next-step-contracts.md` + `design-tree-loop-convention.md`; no remaining ambiguity.
- **Convention bundles regenerated** — all three `upgrade-*.mjs --check` gates exit 0 (interrogation 20, alignment 306, design-tree 20 bundles byte-exact); new markers (recommended-answer/agent-confidence/clarify-copy, build-in-public, self-contained YAML) propagated.
- **Social split** (`41e257d60`/`52c222686`/`c3aec25ee`) — content preserved verbatim, all router↔channel links resolve, ledger archive page passes `audit-alignment-pages.mjs`.
- **Version-bump hygiene** across behaviorally-changed skills (brainstorm v0.3→v0.6, codex/exec v0.3→v0.4, init v0.11→v0.12, etc.) — bumped + archived + CHANGELOG, both mirrors.

---

## Appendix A — Tier 0 gate results (exit codes)

| Gate | Exit | Notes |
|---|---|---|
| `skillpacks run test:node` | 0 | pass |
| `skillpacks run build:check` | 0 | pass |
| `cd tests && npm test` | **1** | 14 fail (4 pre-existing @ v0.1.11, **10 new in-range, all stale tests** → H2). `create-ui-experiment` gap (M3) rides inside the 4 pre-existing, not the 10. |
| `validate:data` | **1** | stale `github-proof-data.js` → M2 (+ benign matrix churn L7) |
| `skills-showcase test` | 0 | pass |
| `skill-install-routing-audit.sh --active` | 0 | pass (test stale, not script) |
| `skill-mirror-parity-audit.sh` | **1** | 2 fail → M1 |
| `base-skill-version-parity-audit.sh` | 0 | pass |
| `skill-alignment-routing-audit.mjs` (+ `--final-handoff-fixtures`) | 0 | pass (7 fixtures, 4 expected diagnostics, 0 unexpected) |
| `audit-alignment-pages.mjs` | 0 | pass |
| `audit-interrogation-pages.mjs` | 0 | pass |
| `audit-task-docs.mjs` | 0 | pass |
| `skill-convention-bundle-audit.mjs` | 0 | pass |
| `git diff v0.1.11..HEAD --check` | 0 | no whitespace/conflict markers |
| `detect-secrets.sh` | n/a | broken on darwin (L1); manual diff scan clean |

**Pre-existing baseline failures @ v0.1.11 (out of audit range):** `bench-coverage`, `bench-setups` (×2 — analyze-sessions, spec-interview), `bench coverage matrix lists every skill`. These fail identically at the tag; not introduced by this range.

## Appendix B — Coverage

`git diff --name-only v0.1.11..HEAD` (623 files) reconciled against lane citations. Substantive files (excluding generated assets, archives, CHANGELOGs, prompts/conversations/tasks snapshots, regenerated `*-PAGE.md` bundles, `.html`): all categories triaged — skillpacks src/scripts/tests (A), audit/upgrade scripts + final-handoff guard + fixtures (B), conventions/schemas incl. `flow-tree.schema.json` + sample YAML (C), 38 changed SKILL.md + PACK.md + mirror parity + deleted pack.sh (D), docs + social (E), generated assets + release state (F). Zero unreviewed substantive files.
