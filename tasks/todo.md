## Current Implementation - Bespoke Alignment Section Conversion/Testing (Drift Plan Phase 2 Step 5)

### Goal

Resolve the remaining hand-authored `## Alignment Page` sections: for each of the 7 allowlisted bespoke skills, either convert both mirrors to the generated stub + bundled `ALIGNMENT-PAGE.md`, or keep them bespoke with explicit layer1 contract tests that pin their required convention invariants. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 5 (the checklist item's "15 bespoke alignment sections" count is stale — current state is 7 skills / 14 mirror sections after the Step 1 `customer-discovery` conversion).

### Execution Profile

- Parallel mode: serial
- Rationale: per-skill convert/keep decisions share `scripts/alignment-bespoke-list.txt`, the generator, and the Step 2-4 test conventions in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`.

### Context

- The 7 bespoke skills (from `scripts/alignment-bespoke-list.txt`): `consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations` (product-design pack), `uat` (product-testing), `research-roadmap` (research-admin). Each is bespoke in both claude and codex mirrors.
- None of the 7 has any `ALIGNMENT-PAGE.md` bundle today — their alignment behavior lives entirely in the SKILL.md sections. All 7 already have skill-specific gate entries in the generator's gate map (`skillSpecificGates` in `scripts/upgrade-alignment-page.mjs`), so a generated render would carry their custom gates; conversion may be near content-equivalent. Compare each bespoke section against `bundledContentFor(name, file)` output before deciding.
- Decision rule per skill: **convert** when the bespoke section's content is subsumed by the generated stub + gate-map render (replace the section body's prose with the stub paragraph in BOTH mirrors, remove the allowlist entry, run the generator in write mode to emit bundles — all in the same commit, per the allowlist policy in `docs/alignment-page-convention.md`); **keep bespoke** when the section encodes genuinely custom behavior (condensed gates, custom timing) the gate map cannot express — then add a layer1 contract test pinning its invariants (own output path, gate/approval language, both-mirror symmetry).
- Check the Step 1 `customer-discovery` conversion (commit `8c655082`) for the conversion mechanics and whether a skill version bump + archive applied (CLAUDE.md skill-versioning rules: behavioral changes bump the decimal and archive via `scripts/skill-archive.sh`; pure section-to-stub conversion that preserves behavior may not). Decide and apply consistently.
- After any conversion, the Step 4 `--check` gate and the repo-state allowlist tests auto-adapt (they re-derive bespoke classification from the repo); `node scripts/upgrade-alignment-page.mjs --check` must stay exit 0 and `Bespoke allowlist: N skills, exact` must reflect the reduced list.
- If SKILL.md behavior/metadata changes, the Skills Showcase freshness rule applies at ship time (regenerate showcase data); pure stub swaps still change tracked SKILL.md files, so expect the showcase generators to run during `/ship`.
- Boundary hygiene: a concurrent session shipped commits during the Step 4 session (see `tasks/ship-manifest-2026-06-10-generated-bundle-drift-check.md`, "Boundary anomaly"). Start by confirming `git status` is clean and `git log -3 --oneline` matches expectations before editing.

### Steps

- [ ] For each of the 7 bespoke skills, diff the bespoke `## Alignment Page` section (both mirrors) against the generated render (`bundledContentFor`) and record a convert/keep verdict with rationale.
- [ ] Convert the "convert" set: stub paragraph in both mirrors, allowlist entries removed, generator write-mode run emitting bundles, version/archive handling per the `customer-discovery` precedent — one commit per the allowlist same-commit policy.
- [ ] For the "keep" set: add layer1 contract tests pinning each bespoke section's invariants (own `alignment/{skill-name}-{topic}.html` path, gate language, mirror symmetry) in `tests/layer1/upgrade-alignment-page-bespoke.test.ts` or a sibling test file.
- [ ] Run the generator (`--check`, `--dry-run`) and the full layer1 suite; update `docs/alignment-page-convention.md` only if the bespoke policy wording changes.
- [ ] Check off Phase 2 Step 5 in the ALIGNMENT-PAGE Bundling Drift Plan section and record review notes.

### Acceptance Criteria

- Every remaining allowlist entry has a recorded keep rationale and explicit test coverage; every converted skill has generated bundles in both mirrors and no allowlist entry.
- `node scripts/upgrade-alignment-page.mjs --check` exits 0 (`Bespoke allowlist: N skills, exact`, `Generated bundles: M ownable, exact`).
- Full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed; `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 6 (scriptable audit for direct `alignment/*.html` edits) is queued after this step.

---

## Current Implementation - Generated-Bundle Drift Validation (Drift Plan Phase 2 Step 4)

### Goal

Add generated-bundle drift validation to `scripts/upgrade-alignment-page.mjs` so a generator-owned (ownable) skill's on-disk `ALIGNMENT-PAGE.md` that does not byte-equal the renderer's expected output (`bundledContentFor(skillName, skillPath)`) can fail loudly, instead of only appearing as a pending `Updated`/`Bundled files written` count that exits 0. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 4.

### Execution Profile

- Parallel mode: serial
- Rationale: generator flag/diagnostics, fixture tests, and docs share `scripts/upgrade-alignment-page.mjs` and the Step 2/3 test conventions in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`.

### Context

- Today, a hand-edited or stale generated bundle shows up only as `bundleChanged` (a dry-run "write …" line and nonzero `Updated`/`Bundled files written` counts) and dry-run still exits 0; write mode silently overwrites it. Nothing fails on a committed stale bundle. `tests/layer1/upgrade-alignment-pages.test.ts` covers the `upgrade-alignment-pages` *skill* contract, not a repo-state regeneration gate — no existing test asserts `Updated: 0`.
- Key design constraint: the legitimate workflow is edit `docs/alignment-page-convention.md` → `--dry-run` to preview the fan-out → write mode. Plain `--dry-run` previewing pending updates must keep exiting 0, or the preview step breaks. Recommended shape: add a `--check` flag (dry-run semantics, no writes) that exits 1 with a named diagnostic when any ownable skill's bundle differs from expected renderer output (or its SKILL.md stub needs replacing), plus a summary line mirroring Step 2/3 (e.g. `Generated bundles: N stale of M, exact|DRIFT`). The repo-state drift gate then lives in layer1 by running `--check` against the repo, exactly like the Step 3 path-consistency repo-state test.
- Step 3 (this session) added the output-path validation pass and `Output paths: N bundles, exact|DRIFT`; Step 2 added the bespoke allowlist diagnostics and `--root <path>` for fixture trees. Follow the same pattern: collect diagnostics, print a failing block to stderr, share the single exit-1 at the end.
- Fixture conventions to reuse (module-scope helpers in `tests/layer1/upgrade-alignment-page-bespoke.test.ts` after Step 3): `makeFixtureRoot`, `writeSkill`, `writeBundle`, `stubBody`, `writeAllowlist`, `runScript(root, mode)` — extend `runScript` for `--check` or add a variant.
- Variant-count reduction is NOT in scope: the 133 normalized variants observed in Phase 1 are expected under per-skill gates/tiers/glossary tokens. The gate validates each generated bundle against its own expected render; bespoke bundles (allowlisted, no expected render) are exempt from this check.
- Bundles for skip-listed or out-of-scope skills have no expected render either; decide explicitly (and document) whether `--check` ignores them or reports them — recommendation: ignore, since Step 3 already validates their path consistency and Step 6 (direct-edit audit) covers unmanaged drift.

### Steps

- [x] Add a `--check` mode (or equivalent explicit flag) to `scripts/upgrade-alignment-page.mjs`: no writes; exit 1 with a named per-skill diagnostic when an ownable skill's `ALIGNMENT-PAGE.md` differs from `bundledContentFor(...)` or its SKILL.md stub paragraph needs replacing; plain `--dry-run` behavior unchanged (preview, exit 0 on pending updates).
- [x] Add a summary line for generated-bundle drift mirroring the Step 2/3 `exact|DRIFT` pattern.
- [x] Extend layer1 coverage in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`: repo-state `--check` run against the repo (exit 0), fixture tests for a hand-edited generated bundle (`--check` exit 1, named diagnostic), a missing bundle for an ownable skill (`--check` exit 1), and a clean generated tree (`--check` exit 0); confirm plain `--dry-run` still exits 0 on a stale fixture bundle.
- [x] Document `--check` and the drift gate in `docs/alignment-page-convention.md` outside the generated-marker block.
- [x] Check off Phase 2 Step 4 in the ALIGNMENT-PAGE Bundling Drift Plan section and record review notes.

### Review Notes

- Added `--check` to `scripts/upgrade-alignment-page.mjs`: no writes (shares the `noWrites` path with `--dry-run`, preview lines prefixed `[check]`), and a generated-bundle drift pass that runs after the write loop over all ownable skills. Three named per-skill diagnostics: `Stale generated bundle` (on-disk `ALIGNMENT-PAGE.md` differs from `bundledContentFor(...)`), `Missing generated bundle` (no bundle file for an ownable skill), and `Stale SKILL.md stub` (`replaceOrInsert(...)` would change the file, i.e. a pointer/old-stub paragraph needs replacing).
- Bespoke (allowlisted) skills are exempt — no expected render; mixed sibling pairs already fail via the Step 2 diagnostics, so the drift pass skips any skill with a bespoke mirror. Skip-listed and out-of-scope skills are ignored as decided in the plan: Step 3 already validates their bundles' path consistency and Step 6 (direct-edit audit) covers unmanaged drift.
- Summary line `Generated bundles: N ownable, exact|DRIFT` prints in every mode and reflects on-disk state after any writes (write mode is therefore always `exact` post-write). Only `--check` escalates drift to stderr diagnostics and exit 1; plain `--dry-run` keeps exit 0 so the edit-convention → preview → write workflow is preserved.
- Layer1 coverage added in `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (6 new tests, 17 total in file): repo-state `--check` exit 0; hand-edited bundle → `--check` exit 1 with named diagnostic; missing bundle → exit 1 (both mirrors named); stale pointer paragraph → exit 1 (`Stale SKILL.md stub`); clean generated tree with an exempt bespoke pair → exit 0; stale fixture under plain `--dry-run` → exit 0 with preview line and `DRIFT` summary.
- Documented the drift check in `docs/alignment-page-convention.md` outside the generated-marker block; the dry-run after the doc edit confirmed no bundle regeneration was triggered.
- Validation: `node --check scripts/upgrade-alignment-page.mjs`; `node scripts/upgrade-alignment-page.mjs --check` exit 0 on the repo (`Generated bundles: 270 ownable, exact`); `--dry-run` unchanged (exit 0); focused vitest 17/17; full layer1 suite 0 failed; `git diff --check` clean.

### Acceptance Criteria

- `node --check scripts/upgrade-alignment-page.mjs` passes.
- `node scripts/upgrade-alignment-page.mjs --check` exits 0 on the current repo; `--dry-run` behavior is unchanged (exit 0 with pending-update preview on stale fixtures).
- Focused layer1 vitest run for the alignment-page test files passes; full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed.
- `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 5 (convert or explicitly test the bespoke alignment sections) is queued after this step.

---

## Current Implementation - Alignment Pages Game AFPS Refresh

### Goal

Replace active alignment pages that still present the old four-pipeline/four-deck model with Game AFPS-aware pages, while preserving stable links, review gates, metadata, and TTS behavior.

### Current Phase

- [x] Inspect current active pages, index metadata, and task context.
- [x] Archive original active pages to `docs/history/archive/2026-06-10/014646/alignment/`.
- [x] Amend `alignment/workflow-design-three-pipelines.html` to the five-deck model.
- [x] Amend `alignment/idea-scope-brief-npm-distribution.html` deck-installation content and gate for Game AFPS.
- [x] Amend `alignment/idea-scope-brief-skills-showcase.html` deck-builder assumptions for five canonical decks.
- [x] Refresh `alignment/index.html` metadata for the amended active pages.
- [x] Add review notes and verify the replacement boundary.
- [x] Commit and push intended changes only.

### Verification Plan

- [x] Confirm each changed active page has an archived original under `docs/history/archive/2026-06-10/014646/alignment/`.
- [x] Confirm changed pages preserve core context, decisions, gates, assumptions, proposed file changes, and the TTS script include.
- [x] Run stale wording scans for old four-deck/four-pipeline model text across active docs/research/scripts/package metadata/alignment pages.
- [x] Run `git diff --check`.

### Review Notes

- Archived the three stale active pages before replacement at `docs/history/archive/2026-06-10/014646/alignment/`.
- Updated the workflow-design active page from the obsolete matrix framing to the five-deck model: VARD, ORD, Business AFPS, Devtool AFPS, and Game AFPS. The page preserves the original VARD/ORD/devtool COAs, gates, assumptions, and TTS include while adding a Game AFPS deck section and amendment note.
- Updated the npm-distribution active page's deck-installation section and approval gate so monolith presets, package-list examples, and registry-tag examples all include `game-afps`.
- Updated the Skills Showcase active page's deck-builder assumptions from the old deck count to five canonical decks and added Game AFPS to the visible deck cards.
- Refreshed `alignment/index.html` so the workflow page appears as "Five-Deck Workflow Model" and the amended Skills Showcase page is linked from Product Design.
- Verification passed: archive hashes match the original tracked files; changed-page content checks found required titles/context, Game AFPS content, gates, proposed file changes where present, alignmentPage constants, and TTS includes; exact stale wording scan passed for the requested old deck-model phrases; `git diff --check` passed.

---

## Current Implementation - Alignment Bundle Path-Consistency Validation (Drift Plan Phase 2 Step 3)

### Goal

Add path-consistency validation to `scripts/upgrade-alignment-page.mjs` so every generated `ALIGNMENT-PAGE.md` bundle references only its owning skill's output path `alignment/{skill-name}-{topic}.html`, with failing diagnostics in both dry-run and write mode. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 3 (see that section's Phase 2 checklist below).

### Execution Profile

- Parallel mode: serial
- Rationale: generator changes, diagnostics, fixture tests, and docs share `scripts/upgrade-alignment-page.mjs` and the Step 2 test/allowlist conventions.

### Context

- The renderer substitutes `{skill-name}` into the bundled convention body (`scripts/upgrade-alignment-page.mjs` line ~74 `.replaceAll("{skill-name}", skillName)`) and into the SKILL.md stub Output line (`alignment/${skillName}-{topic}.html`). A generated bundle whose body mentions a different skill's `alignment/<other>-{topic}.html` path indicates a stale, hand-edited, or mis-rendered bundle.
- Step 2 (shipped `120c731c`) established the diagnostic pattern to follow: collect violations, print failing diagnostics, exit 1 in both dry-run and write mode, and a summary line; plus `--root <path>` so layer1 tests can run the script against fixture trees.
- Existing tests to extend, not duplicate: `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (behavioral fixture tests via `--root`) and `tests/layer1/upgrade-alignment-pages.test.ts`. Bespoke-allowlisted skills (7, in `scripts/alignment-bespoke-list.txt`) own bespoke `ALIGNMENT-PAGE.md` files — decide explicitly whether path validation applies to bespoke bundles too (they still name their own skill's output path) or only generator-owned bundles; default recommendation: validate every active `ALIGNMENT-PAGE.md`'s `alignment/...-{topic}.html` references against the owning skill directory name, bespoke included, since the path contract is universal.
- Known benign variation to handle: pages also reference archive paths like `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/{skill-name}-{topic}.html` — the validation should check the `{skill-name}` segment of `alignment/<name>-{topic}.html` occurrences (including inside archive paths), not require a fixed prefix.
- Validation must compare against the skill directory name (the `name:` in SKILL.md frontmatter equals the directory name for active skills).

### Steps

- [x] Add path-consistency validation to `scripts/upgrade-alignment-page.mjs`: scan each active `ALIGNMENT-PAGE.md` for `alignment/<name>-{topic}.html` occurrences and fail (exit 1, named diagnostic) when `<name>` does not match the owning skill, in dry-run and write mode.
- [x] Add a summary line reporting path-consistency status (mirroring the `Bespoke allowlist: N skills, exact|DRIFT` pattern).
- [x] Extend layer1 coverage: repo-state assertion (all active bundles consistent) plus `--root` fixture tests for a mismatched bundle (exit 1) and a clean tree (exit 0); decide placement in `upgrade-alignment-page-bespoke.test.ts` or a sibling test file.
- [x] Document the validation in `docs/alignment-page-convention.md` outside the generated-marker block.
- [x] Check off Phase 2 Step 3 in the ALIGNMENT-PAGE Bundling Drift Plan section and record review notes.

### Acceptance Criteria

- [x] `node --check scripts/upgrade-alignment-page.mjs` passes.
- [x] `node scripts/upgrade-alignment-page.mjs --dry-run` exits 0 on the current repo (or surfaced violations are fixed/explained in the same boundary).
- [x] Focused layer1 vitest run for the alignment-page test files passes; full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed.
- [x] `git diff --check` clean.

### Review Notes (2026-06-10)

- Added an output-path validation pass to `scripts/upgrade-alignment-page.mjs` that runs after the write loop (so write mode validates final on-disk state): every `ALIGNMENT-PAGE.md` beside an active claude/codex `SKILL.md` is scanned for `alignment/<name>-{topic}.html` occurrences, and any `<name>` not equal to the owning skill directory name produces a `Foreign output path in <bundle>` diagnostic and exit 1 in both dry-run and write mode. Bespoke and skip-listed skills' bundles are validated too — the path contract is universal, per the plan's default recommendation. Archive-path references match the same trailing segment, so no fixed prefix is required.
- Summary output gained an `Output paths: N bundles, exact|DRIFT` line mirroring the Step 2 `Bespoke allowlist` pattern; both diagnostic blocks now print before a single shared exit-1.
- Extended `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (no sibling file needed): hoisted the Step 2 fixture helpers to module scope, added a repo-state assertion (every active bundle references only its own output path, 270 bundles), and three `--root` fixture tests — foreign-path bundle in dry-run → exit 1 with named diagnostic and `DRIFT` summary; bespoke allowlisted bundle with a foreign path in write mode → exit 1 (write mode cannot regenerate bespoke bundles, so the diagnostic is the only guard); clean tree → write mode exit 0 (`Output paths: 2 bundles, exact`, validating self-written bundles) then dry-run exit 0. The fixture convention body now carries an `Output: alignment/{skill-name}-{topic}.html` line so generated fixture bundles exercise the check.
- Documented the rule as an **Output path consistency** paragraph in `docs/alignment-page-convention.md`, beside the bespoke-allowlist paragraph and outside the generated-marker block; no bundle regeneration triggered.
- Validation passed: `node --check scripts/upgrade-alignment-page.mjs`; `node scripts/upgrade-alignment-page.mjs --dry-run` exit 0 (`Output paths: 270 bundles, exact`); focused alignment-page vitest run (17 tests across both files); full layer1 suite 0 failed; `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 4 (generated-bundle variant/drift validation against expected renderer output) is queued after this step.

---

## Current Implementation - Layer1 Contract Test Reconciliation

### Goal

Reconcile the 18 pre-existing failing layer1 contract tests (11 files) against current repo reality so the full layer1 suite passes again. Surfaced by the 2026-06-10 alignment-bespoke-allowlist ship; all 18 reproduce at clean HEAD `ea2e3291` (verified via stash comparison), so they pre-date that boundary.

### Execution Profile

- Parallel mode: serial
- Rationale: per-test verdicts about stale pins vs regressed skill contracts share the same skill files and the versioning/archive/changelog convention.

### Context

- Reproduce with: `pnpm --dir tests exec vitest run --project layer1` → 18 failed / 2147 passed.
- Failing files (all under `tests/layer1/`): `afps-alignment-preview-gates` (1), `benchmark-results-matrix` (1), `compile-central-alignment` (1), `marketplace-side-handoff` (3), `pack-reload-contract` (1), `pack-shipping-boundary` (1), `pack-skill-mirror-parity` (1), `product-path-manifest` (5), `prompt-history-backfill` (2), `skill-reload-language` (1), `skills-showcase-benchmark-demo` (1).
- Two failure classes observed:
  1. **Stale version pins** — tests assert exact old `version:` values: `pack` pinned v0.4 vs current v0.6, `uat-guide` v0.2 vs v0.3, `prompt-history-backfill` v0.0 vs v0.1, `compile-central-alignment` v0.1 vs current, `targeted-skill-builder` v0.2 vs current. Mechanical fix: update the pin, or relax to `/^version: v0\.\d+$/m` where the exact pin adds no contract value (`upgrade-alignment-pages.test.ts` already uses the relaxed pattern).
  2. **Content assertions** — e.g. `idea-scope-brief` missing 'hypotheses, not validated ICPs'; `feature-pricing-matrix` missing product-path manifest scope language; `prompt-history-backfill` missing the `--apply` path-constraint sentence; `benchmark-results-matrix` expecting a `Generated by scripts/generate-skills…` header (generators moved to `apps/skills-showcase/scripts/` in the workspace split, so that test is likely stale); `skills-showcase-benchmark-demo` hitting an undefined data shape. Each needs a verdict: stale test (update the assertion) vs regressed skill contract (restore the language to the skill with archive + version bump + changelog per CLAUDE.md Skill Versioning).
- Decision rule: git-blame the assertion and the corresponding skill text. If the skill text changed in a deliberately shipped session (review notes in `tasks/todo.md`/`tasks/history.md` reference the change), the test is stale — update it. If the language vanished in a refactor or regeneration with no review-note trail, treat it as a regressed contract — restore it in the skill.
- Skill edits (if any) trigger the versioning convention: archive via `scripts/skill-archive.sh <skill-dir>`, bump the decimal, update the skill `CHANGELOG.md`, mirror claude/codex, and refresh Skills Showcase generated data (`apps/skills-showcase/scripts/` generators + validator).

### Steps

- [x] Categorize each of the 18 failures as stale-pin, stale-assertion, or regressed-skill using git history and session review notes.
- [x] Fix stale version pins (prefer the relaxed `v0\.\d+` pattern where exactness adds no contract value).
- [x] Update stale wording/path assertions to current repo reality (e.g. `apps/skills-showcase/scripts/` generator paths).
- [x] Restore any genuinely regressed skill contract language with archive + version bump + changelog, mirrored in both tools. (Not needed — zero regressed contracts found.)
- [x] Run the full layer1 suite to zero failures and record per-test verdicts in review notes.

### Acceptance Criteria

- [x] `pnpm --dir tests exec vitest run --project layer1` → 0 failed (54 files, 2166 tests; one new sub-skill contract test added).
- [x] Any skill edits pass `scripts/skill-versions.sh --missing` and `scripts/skill-archive-audit.sh --strict`; Skills Showcase data revalidated if SKILL.md files changed. (No skill files edited, so these were not required.)
- [x] `git diff --check` clean.

### Review Notes (2026-06-10)

All 18 failures were stale tests; none were regressed skill contracts, so no skill edits, archives, version bumps, or Skills Showcase data refreshes were needed. Boundary: the 11 `tests/layer1/*.test.ts` files only. Per-test verdicts:

- **Stale version pins (relaxed to version-format/bumped-version patterns):** `pack-reload-contract` and `pack-shipping-boundary` pinned `pack` v0.4 (now v0.6 via deliberate changelog'd bumps); `pack-skill-mirror-parity` pinned `uat-guide` v0.2 (now v0.3 with archives v0.0–v0.2) — rewritten to assert both mirrors share one well-formed version instead of exact pins; `skill-reload-language` pinned `targeted-skill-builder` v0.2 (now v0.3); `prompt-history-backfill` pinned v0.0 (now v0.1, deliberate 2026-06-04 legacy-routing changelog) and its `--apply` path-constraint assertions updated to the current legacy-aware sentences; `compile-central-alignment` pinned v0.1 (now v0.2, deliberate 2026-06-06 category-grouping changelog) — v0.0 archive and v0.1 changelog assertions kept.
- **Stale paths from the `icp` → `customer-discovery` rename (`ed1eba82`/`ebfc6438`, deliberate v1.0 orchestrator rewrite with archives + changelogs):** `afps-alignment-preview-gates`, `marketplace-side-handoff` (3 tests), and `product-path-manifest` ENOENT'd on `packs/business-discovery/*/icp/SKILL.md` — repointed to `customer-discovery` paths and `/customer-discovery`/`$customer-discovery` commands. The "hypotheses, not validated ICPs" wording became "hypotheses, not validated customer segments" in the same ship.
- **Stale gate content from the 2026-06-09 scope-first approval rewrite (`8c655082`):** `afps-alignment-preview-gates` report-first assertions updated from the old preview-page gate ("build and attempt to open the alignment preview page first", "evidence coverage", "proposed file changes") to the current scope-first contract ("Default to scope-first approval", "final compiled YAML approves the research scope", "Stage 1 - Scope discovery and approval", "proposed canonical file changes"), verified present in all 8 mirrored skills.
- **Stale mirror byte-equality:** the customer-discovery Codex mirror is a deliberately condensed orchestrator (v1.0 rewrite), so `marketplace-side-handoff` no longer asserts byte-equal preflight sections; it asserts the shared preflight core phrases in both mirrors plus byte-equality for the still-identical idea-scope-brief handoff section.
- **Stale sweep contract vs the sub-skill pattern (`c691484b` orchestrator refactor):** `product-path-manifest` sweeps now exclude `invocation: sub-skill` framework files (competitive-analysis/customer-discovery/journey-map frameworks defer full scope resolution to their orchestrator parent) and a new test asserts every research sub-skill still carries a `Product-Path Scope Resolution` section. The monorepo-secondary assertion uses the common "Detect monorepo/app/package structure only as a secondary hint" phrasing (the Codex orchestrator condensed the longer clause). The schema-fields contract dropped customer-discovery (the orchestrator no longer enumerates the full manifest schema; the contract lives in the remaining pairs), and the flat-to-product-path icp migration test was rewritten to the current output contract (`research/{slug}/icp.md`, `research/icp.md`, `research/icp-search-log.md`, `research/.progress.yaml`). The git-branch disambiguation heuristic now exempts the screen-flow phrase "screen flow, decisions, branches, states" from the deliberate user-flow-map routing language in `ux-variations`.
- **Stale generator path:** `benchmark-results-matrix` expected `Generated by `scripts/generate-skills-showcase-data.mjs``; the workspace split moved the generator to `apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`.
- **Stale demo example:** `skills-showcase-benchmark-demo` pinned the `pack` Codex demo, but benchmark run dirs are gitignored/machine-local and the `pack-codex-*` runs no longer exist locally, so regenerated committed showcase data has no pack demo. Repointed to the `skills` Codex demo, which exists in committed data and has local run artifacts.

Validation: full layer1 run 54 files / 2166 tests / 0 failed; `git diff --check` clean. An untracked `prompts/analyze-sessions/` file from a concurrent session was left outside this boundary.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. The ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 3 (path-consistency validation for `alignment/{skill-name}-{topic}.html` inside generated bundles) is queued immediately after this reconciliation.

---

## Current Implementation - Game AFPS Deck Model

### Goal

Add `game-afps` as a first-class deliberate deck backed by the existing `game` pack.

### Current Phase

- [x] Update `docs/decks.md`, `docs/skillpacks-npm-distribution.md`, and live Skills Showcase research references.
- [x] Add `game-afps` to the skillpacks manifest generator and cover it with a package test.
- [x] Split the skill-map generator so `game` appears under Game AFPS instead of Business AFPS.
- [x] Regenerate package manifest/build and skill-map artifacts.
- [x] Run verification and record review notes.

### Verification Plan

- [x] `npm --workspace skillpacks run test:node`
- [x] `npm --workspace skillpacks run build:check`
- [x] `node scripts/generate-skillmap-excalidraw.mjs`
- [x] `npm --workspace skillpacks run pack:dry-run`
- [x] Temp-project smoke: `skillpacks install-deck game-afps` then `skillpacks list-packs`
- [x] Stale deck-model scan for old four-deck wording
- [x] `git diff --check`

### Review Notes

- Added `game-afps` as a deliberate game deck backed by the existing `game` pack.
- Updated package-included docs and current Skills Showcase research references from four canonical decks to five.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json`; all `game` pack skills now carry `deck_memberships: ["game-afps"]`.
- Regenerated `docs/skillmap.excalidraw` and `alignment/skillmap.html`; `game` now appears under its own Game AFPS row instead of Business AFPS.
- Added `packages/skillpacks/test/manifest.test.mjs` to assert Game AFPS deck metadata and membership.
- Validation passed: package node tests, manifest/build check, tarball dry-run, temp `install-deck game-afps` smoke, stale wording scan, and whitespace check.

---

## Current Implementation - Skillpacks npm Distribution Phase 3

### Goal

Start the Phase 3 Node Port Parity work by moving deterministic `.agents/project.json` reads and simple writes into the package-owned Node CLI while preserving `scripts/pack.sh` as the fallback for install/link/drift operations.

### Execution Profile

- Parallel mode: serial
- Rationale: CLI routing, project config writes, tests, package staging, and task docs share one package boundary and should be integrated in one lane.

### Step 3.1: Node Project Config Parity

- [x] Add a package-owned Node project-config helper for reading, validating, writing, and formatting `.agents/project.json`.
- [x] Route `skillpacks list-packs`, `skillpacks status`, `skillpacks set-mode`, and `skillpacks set-update-mode` through Node without requiring `bash` or `jq`.
- [x] Preserve existing project config fields when Node writes `agent_mode` or `skill_updates.mode`.
- [x] Keep install/remove/refresh/pin/unpin/prune/doctor on the existing `pack.sh` compatibility path for this step.
- [x] Add package-owned executable tests proving the Node-owned commands work without `bash` or `jq` on `PATH`.

### Verification

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run the package-owned Node tests.
- [x] Run a focused existing `pack.sh` install regression to prove compatibility path behavior is unchanged.
- [x] Run package build/check and npm dry-run boundary checks.
- [x] Run `git diff --check`.

### Review Notes

- Added `packages/skillpacks/src/cli/project-config.mjs` with JSON parsing, atomic writes, Node-owned lock handling for the newly ported write commands, project-type inference for new `set-mode` files, and status/list output parity for simple project-config reads.
- Routed `list-packs`, `status`, `set-mode`, and `set-update-mode` through Node before the bash dependency check. Install/remove/refresh/pin/unpin/prune/doctor and `install-deck` still use the tested `pack.sh` backend.
- Added package-owned Node tests that temporarily empty `PATH` and prove the Node-owned commands do not require `bash` or `jq`. The tests cover enabled-pack listing, status output, agent-mode writes, new-file `set-mode`, `skill_updates.mode` writes, field preservation, and lock cleanup.
- Validation caught an existing package dry-run bug: `npm pack build` resolved the registry package named `build`. Updated package scripts to use `npm pack ./build`, then verified the dry-run package is `skillpacks@0.1.0`.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` because `build:check` required the manifest to match current package metadata and current repo skill metadata.
- Validation passed: `node --check packages/skillpacks/src/cli/project-config.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `node --check packages/skillpacks/test/project-config.test.mjs`; `npm --workspace skillpacks run test:node` (6 tests); `pnpm --dir tests exec vitest run --project layer1 layer1/install.test.ts` (5 tests); `node packages/skillpacks/bin/skillpacks.mjs list`; `npm --workspace skillpacks run build:check`; `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` plus parsed boundary assertion; and `git diff --check`.
- Unrelated local modifications in `scripts/alignment-tts-kokoro.js` and `tests/layer1/alignment-tts-kokoro.test.ts` were left outside this ship boundary.

### Step 3.2: Pack Normalization And Alias Parity

- [x] Port pack alias normalization from `scripts/pack.sh` into package-owned Node code.
- [x] Include hibernated PoketoWork kanban pack and skill diagnostics with the same user-facing safety language.
- [x] Add CLI resolution coverage for direct pack names, aliases, comma-separated arguments, `pack:` prefixes, empty `pack`/`packs` tokens, unknown names, and hibernated aliases.
- [x] Keep lifecycle mutations on `pack.sh` after Node resolves and validates names unless the install/remove port is explicitly in scope for the next step.
- [x] Compare representative Node and `pack.sh` resolution behavior before changing install/remove execution.

#### Step 3.2 Verification Plan

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run package-owned normalization tests.
- [x] Run representative `skillpacks install`/unknown-name smoke checks against temp projects if CLI routing changes.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.2 Review Notes

- Added `packages/skillpacks/src/cli/pack-normalization.mjs` with the `pack.sh` pack alias table, command-token splitting, active pack/skill lookup from the packaged manifest, enabled-skill lookup for `remove`, and PoketoWork kanban hibernation diagnostics.
- Routed `skillpacks install` and `skillpacks remove` through Node normalization before requiring `bash`/`jq`, then continued to execute lifecycle mutations through `scripts/pack.sh` with canonical pack/skill arguments.
- Preserved the command-specific hibernation behavior: `install` blocks hibernated pack/skill names with safety language, while `remove` resolves hibernated names for stale project cleanup.
- Added package-owned Node tests covering direct names, aliases, comma-separated arguments, `pack:` prefixes, empty `pack`/`packs` tokens, active skill fallback, unknown names, hibernated pack aliases, hibernated skill aliases, and early CLI diagnostics without `bash`/`jq` on `PATH`.
- Baseline and smoke behavior matched the representative `pack.sh` cases checked before the route change: `business` expands to the four business packs; `pack:code-quality,docs` installs `code-quality` and `docs-health`; unknown names report available packs; hibernated aliases report the PoketoWork rebuild safety language; and normalized `remove quality` cleaned up `code-quality` while preserving `docs-health`.
- Validation passed: `node --check packages/skillpacks/src/cli/pack-normalization.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `node --check packages/skillpacks/test/pack-normalization.test.mjs`; `npm --workspace skillpacks run test:node` (18 tests); temp-project CLI smokes for `install pack:code-quality,docs`, `install business`, unknown install, hibernated install, `remove quality`, and project-config inspection; `npm --workspace skillpacks run build:check`; `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` plus parsed boundary assertion; and `git diff --check`.
- Adversarial review checked command ordering, manifest dependence, hibernated cleanup parity, unknown-name output, token splitting, skill-vs-pack fallback order, and install/remove mutation boundaries. No source changes were needed after review.

### Step 3.3: Install/Remove/Refresh Parity

- [x] Port package-owned Node install logic for active packs while preserving `.claude/skills`, `.codex/skills`, `.agentic-skills-managed`, and content hash behavior from `scripts/pack.sh`.
- [x] Port package-owned Node install logic for individual skills, including active skill lookup, pinned-version source selection, and `enabled_skills` project-config updates.
- [x] Port package-owned Node remove logic for active packs, hibernated stale pack cleanup, and individual skills without removing unmanaged local skill directories.
- [x] Port package-owned Node refresh logic from `.agents/project.json`, including enabled packs and individually enabled skills.
- [x] Keep `pin`, `unpin`, `prune`, `doctor`, and any unresolved drift/lock commands on `pack.sh` unless this step's implementation proves the required helper can be safely shared.
- [x] Preserve `pack.sh` as a fallback or comparison oracle while implementing Node parity; do not remove the backend in this step.

#### Step 3.3 Implementation Plan

- Files expected: modify `packages/skillpacks/src/cli/run-pack-script.mjs`; add or modify package-owned install/link helpers under `packages/skillpacks/src/cli/`; add package-owned tests under `packages/skillpacks/test/`; update `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and a ship manifest.
- Start by reading `scripts/pack.sh` helpers for `sync_skill_install`, managed marker files, content hashing, pinned archive resolution, `install_pack`, `install_single_skill`, `remove_pack`, `remove_single_skill`, and `refresh`.
- Build the Node helper around structured filesystem operations and the existing project-config helper rather than shelling out from helper internals.
- Compare Node behavior against `pack.sh` in temp projects for one pack install, one individual skill install, one pack remove, one individual skill remove, one hibernated stale remove, and refresh from a project config before switching the CLI route.
- Route only the commands implemented by this step through Node; keep unported lifecycle/drift commands on `pack.sh`.

#### Step 3.3 Verification Plan

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run package-owned Node tests.
- [x] Run temp-project parity checks comparing Node and `pack.sh` behavior for install/remove/refresh surfaces.
- [x] Run a focused existing `pack.sh` install/remove regression if fallback behavior remains in the command path.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.3 Review Notes

- Added `packages/skillpacks/src/cli/lifecycle.mjs` with package-owned Node install/remove/refresh operations for active packs and individual skills. It resolves sources from the packaged manifest, works from both source checkout and staged package roots, copies latest skills into `.claude/skills` and `.codex/skills`, symlinks pinned archive versions, writes `.agentic-skills-managed`, and preserves the `scripts/skill-links.sh` content-hash contract.
- Routed `skillpacks install`, `remove`, and `refresh` through Node after the existing normalization step. `pin`, `unpin`, `prune`, `doctor`, `recommend`, `which`, and `install-deck` remain on the `pack.sh` compatibility path.
- Reused the existing Node project lock/write helpers from `project-config.mjs`; install/remove/refresh now run without requiring `bash` or `jq`, while unported commands still enforce their existing dependencies.
- Added package-owned lifecycle tests with `PATH` emptied. Coverage includes active pack install, individual pinned skill install, unmanaged local directory preservation on remove, individual skill removal, hibernated stale pack cleanup, refresh from `.agents/project.json`, and hibernated refresh diagnostics.
- Temp-project parity checks passed for six Node-vs-`pack.sh` surfaces: pack install, individual pinned install, pack remove, individual remove, hibernated stale remove, and refresh. The comparison verifies parsed project config, installed file trees, symlinks, and marker hashes.
- Adversarial review used changed-file self-review plus direct oracle parity against `pack.sh`, which is the targeted quality-sweep equivalent for this command-porting step. It found and fixed two issues before shipping: Node content hashing initially sorted paths with locale-sensitive ordering instead of the `LC_ALL=C sort` behavior from `skill-links.sh`; and `refresh` with a hibernated enabled pack initially had weaker diagnostics than `pack.sh`.
- Validation passed: `node --check` for `lifecycle.mjs`, `run-pack-script.mjs`, `project-config.mjs`, `pack-normalization.mjs`, and `lifecycle.test.mjs`; `npm --workspace skillpacks run test:node` (25 tests); temp-project parity checks for the six install/remove/refresh surfaces; direct `pack.sh` install/remove coverage inside those parity checks; `npm --workspace skillpacks run build:check`; streaming npm dry-run boundary assertion with `/tmp/skillpacks-npm-cache` (2315 files, denied repo paths absent); and `git diff --check`.
- The first npm dry-run parser attempt used a wrapper that could not handle the large npm JSON payload; validation was rerun through a streaming pipe and passed. No source change was needed for that harness issue.

### Step 3.4: Locking And Drift Parity

- [x] Confirm the Node project lock behavior now used by install/remove/refresh covers stale lock cleanup, lock release on errors, and command labeling for lifecycle mutations.
- [x] Port `skillpacks doctor` drift reporting to Node using the managed marker `source`, `source_version`, `source_sha`, pinned symlink behavior, and missing-source states from `scripts/skill-links.sh`.
- [x] Port `skillpacks pin` and `skillpacks unpin` to Node, preserving archive-version validation, `pinned_versions` project-config updates, relinking behavior, and existing error messages where practical.
- [x] Port `skillpacks prune` to Node, preserving `--dry-run`, orphan detection, unmanaged-directory safety, enabled-pack and individually enabled-skill awareness, and project-config cleanup behavior.
- [x] Keep `pack.sh` as the comparison oracle and fallback for any unported or ambiguous drift/lock behavior during this step.

#### Step 3.4 Implementation Plan

- Files expected: modify `packages/skillpacks/src/cli/lifecycle.mjs`, `packages/skillpacks/src/cli/run-pack-script.mjs`, and package-owned tests under `packages/skillpacks/test/`; update task docs, history, and a ship manifest.
- Start by reading `scripts/pack.sh` sections for `doctor`, `prune`, `pin_skill`, `unpin_skill`, and `skill_install_status` in `scripts/skill-links.sh`. Reuse the Node content-hash and managed-install helpers from Step 3.3 rather than duplicating behavior.
- Add tests with `PATH` emptied for Node-owned `doctor`, `pin`, `unpin`, and `prune`, plus temp-project parity checks against direct `pack.sh` for ok/stale/unknown/missing-source/pinned states and prune dry-run vs mutation paths.
- Keep `recommend`, `which`, `install-deck`, and any behavior not explicitly ported in Step 3.4 on the existing compatibility path.

#### Step 3.4 Verification Plan

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run package-owned Node tests.
- [x] Run temp-project parity checks comparing Node and `pack.sh` behavior for doctor, pin, unpin, and prune surfaces.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.4 Review Notes

- Added Node-owned drift reporting, pin, unpin, and prune logic to `packages/skillpacks/src/cli/lifecycle.mjs`, reusing the Step 3.3 managed-install helpers for content hashes, archive symlinks, marker ownership, and unmanaged-directory safety.
- Routed `skillpacks doctor`, `pin`, `unpin`, and `prune` through Node in `run-pack-script.mjs`; `recommend`, `which`, and `install-deck` remain on the `pack.sh` compatibility path.
- Preserved shell-visible behavior for drift states: `ok`, `STALE`, `unknown`, `missing`, and `pinned`, including `doctor` returning non-zero only for stale installs and printing the existing `scripts/pack.sh refresh` fix hint.
- Added package-owned tests that run with `PATH` emptied for stale lock cleanup, lock command labels, lock release on errors, doctor drift states, pin/unpin config preservation and relinking, prune dry-run/mutation behavior, unmanaged directory safety, and pack.sh-compatible ignored extra args for `doctor`/`pin`/`unpin`.
- Temp-project oracle parity passed for direct Node CLI vs direct `scripts/pack.sh` on `doctor`, `pin`, `unpin`, `prune --dry-run`, and `prune`, including JSON config comparison and normalized doctor drift output.
- Adversarial review found one compatibility drift: the first Node route rejected extra args for `doctor`, `pin`, and `unpin` while `pack.sh` ignored them. The route was patched back to shell-compatible behavior and covered by a regression test.
- Validation passed: `node --check packages/skillpacks/src/cli/lifecycle.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `node --check packages/skillpacks/test/lifecycle.test.mjs`; `npm --workspace skillpacks run test:node` (31 tests); temp-project Node-vs-`pack.sh` parity harness; `npm --workspace skillpacks run build:check`; streaming npm dry-run boundary assertion with `/tmp/skillpacks-npm-cache` (2315 files, denied repo paths absent); and `git diff --check`.

### Step 3.5: Compatibility Closure

- [x] Decide whether `scripts/pack.sh` should remain the canonical compatibility wrapper indefinitely or become a thin wrapper over the Node CLI for ported commands.
- [x] Route or document any remaining `pack.sh`-only commands: `recommend`, `which`, `install-deck`, and global init behavior.
- [x] Add a package-level compatibility matrix that states which commands are Node-owned, which are shell-backed, and which dependencies each path requires.
- [x] Run staged-package CLI parity from `packages/skillpacks/build` as well as source-checkout CLI parity before considering fallback dependency removal.
- [x] Keep real npm publish out of scope unless the user explicitly approves publication and npm auth is configured.

#### Step 3.5 Implementation Plan

- Files expected: modify `packages/skillpacks/src/cli/run-pack-script.mjs` only if command routing changes; otherwise update package docs such as `packages/skillpacks/README.md`, `packages/skillpacks/docs/QUICKSTART.md`, or the relevant package docs included in `packages/skillpacks/package.json`; add focused tests under `packages/skillpacks/test/` only for new routing or matrix-generation behavior; update task docs, history, and ship manifest.
- Start by listing all current `skillpacks` commands from `run-pack-script.mjs` and classifying each as Node-owned, shell-backed, or external script-backed.
- Compare that classification against `scripts/pack.sh` usage text and package docs so user-facing dependency claims are accurate.
- If retaining shell fallback, make that explicit as a supported compatibility mode and avoid removing packaged `scripts/pack.sh` or `scripts/skill-links.sh`.
- If routing additional commands through Node, add PATH-empty tests and direct shell oracle parity before switching the route.

#### Step 3.5 Verification Plan

- [x] Run Node syntax checks for changed package CLI/test files.
- [x] Run package-owned Node tests.
- [x] Run source-checkout command classification/parity checks for all documented commands.
- [x] Run staged-package command checks from `packages/skillpacks/build`.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.5 Review Notes

- Chose to keep `scripts/pack.sh` as the canonical git-checkout compatibility wrapper and as the packaged shell fallback instead of turning it into a thin wrapper over the Node CLI. This preserves the long-lived checkout path while the npm package owns deterministic project-local lifecycle behavior.
- Added a package-included compatibility matrix to `docs/skillpacks-npm-distribution.md` that classifies every `skillpacks` command as Node-owned, shell-backed, hybrid shell materialization, or external script-backed, with explicit `bash` and `jq` requirements.
- Documented the remaining shell surfaces: `list`, `recommend`, and `which` still use packaged `scripts/pack.sh`; `install-deck` resolves deck metadata in Node but materializes through `pack.sh install`; `init-global` invokes packaged `init.sh`.
- Updated package-included user docs (`README.md`, `docs/QUICKSTART.md`, `docs/packs.md`) so npm users see that Node-owned project commands no longer require `jq`, while git-checkout `pack.sh` write commands and `install-deck` materialization still do.
- Added `packages/skillpacks/test/compatibility.test.mjs` to parse the compatibility matrix and compare command ownership/dependencies against the CLI help and route structure.
- Source-checkout and staged-package command smokes passed for documented Node-owned commands under an empty `PATH`, shell-backed `list`/`recommend`/`which`, hybrid `install-deck vard`, and `init-global --help`.
- Adversarial review found one incomplete package-included dependency claim in `docs/packs.md`; it was patched to mention the npm Node-owned no-`jq` path. No CLI routing changes were needed.
- Validation passed: `node --check packages/skillpacks/test/compatibility.test.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `npm --workspace skillpacks run test:node` (33 tests); final source/staged compatibility smoke harness; `npm --workspace skillpacks run build:check`; npm dry-run boundary assertion with `/tmp/skillpacks-npm-cache` (2315 files, denied repo paths absent); targeted stale dependency scan over package-included docs; and `git diff --check`.
- Real `npm publish` was not run because publication remains out of scope without explicit user approval and npm auth confirmation.

#### Next Work

- Phase 3 is complete. The next npm-distribution work should either scope Phase 4 documentation/dry-run release prep from `docs/skillpacks-npm-distribution.md` or explicitly park the npm release track until publication is approved.

---

## Dated Alignment Index Entries

### Phase 1: Convention Update
- [x] Update the central alignment-index paragraph in `docs/alignment-page-convention.md`.
- [x] Require dated index entries with `<span class="meta">YYYY-MM-DD</span>`.
- [x] Document date sourcing, preservation, missing-date derivation, and `new · YYYY-MM-DD` marker behavior.

### Phase 2: Regeneration And Shipping
- [x] Run `node scripts/upgrade-alignment-page.mjs --dry-run`.
- [x] Run `node scripts/upgrade-alignment-page.mjs`.
- [x] Re-run `node scripts/upgrade-alignment-page.mjs --dry-run` and confirm zero pending updates.
- [x] Run `git diff --check`.
- [x] Commit the doc and regenerated files together.

### Review Notes
- Updated the central alignment-index convention so entries require `YYYY-MM-DD` meta spans after links, preserve existing dates, derive missing dates from page internals or file history, and combine active `new` markers as `new · YYYY-MM-DD`.
- Regenerated bundled `ALIGNMENT-PAGE.md` files from the canonical convention after previewing the 270-file fan-out.
- Final generator verification passed: `node scripts/upgrade-alignment-page.mjs --dry-run` reported `Updated: 0` and `Bundled files written: 0`.
- Whitespace verification passed with `git diff --check`.

---

## Research Scope Approval Before Alignment Research

### Phase 1: Audit And Contract Update
- [x] Capture prompt history for `create-agentic-skill`.
- [x] Confirm repo context and preserve unrelated dirty files.
- [x] Audit active `global/` and `packs/` source counts and old research-before-alignment wording.
- [x] Rewrite the shared staged research workflow so minimal discovery produces the review alignment page before synthesized research.
- [x] Regenerate bundled `ALIGNMENT-PAGE.md` files.
- [x] Patch active `SKILL.md` report-first and staged workflow sections.

### Phase 2: Versioning, Tests, And Shipping
- [x] Archive and bump changed active skill versions.
- [x] Update skill changelogs.
- [x] Add the correction lesson.
- [x] Update focused layer1 tests for the new approval gate.
- [x] Refresh Skills Showcase generated data if required.
- [x] Run required verification.
- [x] Add review notes, commit, and push intended changes only.

### Review Notes
- Updated the canonical alignment-page convention and regenerated 270 bundled `ALIGNMENT-PAGE.md` files so Stage 1 is minimal scope discovery only, followed by final compiled YAML approval of research scope before synthesized findings or working packets.
- Archived, bumped, and added changelog entries for active research-producing skills with hard-coded report-first/staged workflow text, including the bespoke `research-roadmap` inline contract.
- Added the correction lesson in `tasks/lessons.md` and tightened layer1 coverage for scope approval before synthesis, old research-first wording, journey-map behavior, and unresolved generated-convention tokens.
- Validation passed: `node scripts/upgrade-alignment-page.mjs --dry-run`, focused layer1 Vitest run (3 files / 304 tests), `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, active old-phrase audit, and `git diff --check`.

---

## YouTube Prelaunch Audit Skill

### Phase 1: Scope And Implementation
- [x] Capture prompt history for `targeted-skill-builder`, `create-agentic-skill`, and `skill-creator`.
- [x] Confirm `$youtube-video-audit` belongs to the uninstalled `youtube-ops` pack.
- [x] Read the current mirrored post-release `youtube-video-audit` contract.
- [x] Inspect nearby YouTube pack routing and benchmark fixtures for minimal integration points.
- [x] Add mirrored `youtube-video-prelaunch-audit` skill contracts.
- [x] Update pack docs/router/coverage fixtures as needed.

### Phase 2: Validation And Shipping
- [x] Run focused metadata/version/invocation checks.
- [x] Run `pnpm --dir tests bench:coverage`.
- [x] Run focused layer1 benchmark setup tests if fixture definitions change.
- [x] Refresh and validate Skills Showcase data for skill metadata changes.
- [x] Run `git diff --check`.
- [x] Add review notes, commit, and push intended changes only.

### Review Notes
- Added mirrored Codex and Claude `youtube-video-prelaunch-audit` skills under `packs/youtube-ops/` for unlisted/scheduled video readiness review.
- Updated the `youtube` router `--launch` mode to prefer prelaunch review before public performance audit, with archive/changelog coverage for the v0.1 router behavior change.
- Refreshed pack docs, skill references, generated Skills Showcase/catalog data, and benchmark coverage fixtures.
- Validation passed: manifest check, benchmark coverage, focused layer1 benchmark setup tests, Skills Showcase data validation, version-field audit, and `git diff --check`.
- Repo-wide dependency/routing audits still report pre-existing broad stale references outside this change; the new YouTube router no longer contributes the previous `youtube -> skill-name` false dependency.

---

## ALIGNMENT-PAGE Bundling Drift Plan

### Phase 1: Investigation
- [x] Capture prompt history for the `investigate` invocation.
- [x] Map the shared convention source and generation/sync tooling.
- [x] Audit current generated bundle drift and unique variants.
- [x] Check positioning-specific template history and current divergence.
- [x] Assess the direct-edit/no-skill enforcement gap.
- [x] Record the approval-ready plan before source implementation.

### Phase 2: Fix Implementation - In Progress
- [x] Make `packs/business-discovery/codex/customer-discovery/SKILL.md` generator-ownable and regenerate its stale `ALIGNMENT-PAGE.md`.
- [x] Harden `scripts/upgrade-alignment-page.mjs` so sibling bundles cannot be skipped as bespoke without a failing diagnostic or explicit allowlist.
- [x] Add path consistency validation for `alignment/{skill-name}-{topic}.html` inside generated bundles.
- [x] Add generated-bundle variant/drift validation against expected renderer output.
- [ ] Convert or explicitly test the remaining bespoke alignment sections (7 skills / 14 mirrors after the Step 1 `customer-discovery` conversion).
- [ ] Add or expose a scriptable audit for direct `alignment/*.html` edits where no skill is invoked.
- [ ] Update root alignment-page instructions to require the audit/convention check for direct HTML edits.

### Review Notes
- Source of truth: `docs/alignment-page-convention.md`; renderer/sync tool: `scripts/upgrade-alignment-page.mjs`.
- Current dry-run reports `Updated: 0` and `Bundled files written: 0`, but it misses one stale bundle because the Codex `customer-discovery` section is classified as bespoke.
- Active bundle audit found 260 active `ALIGNMENT-PAGE.md` files and 133 normalized variants. The variant count is expected under today's generated skill-specific gates, but it contradicts the target model where only path substitution differs.
- Current local feedback control phrases are present across active bundles, so the remaining drift is structural and enforcement-related rather than a broad missing-phrase recurrence.
- Positioning currently has generated skill-specific gates; repo history did not confirm a separate pre-standard positioning template for local compile controls.
- `upgrade-alignment-pages` is useful when invoked, but no current hook enforces the convention for direct manual edits of `alignment/*.html`.

### Phase 2 Review Notes (Steps 1-2, 2026-06-10)
- Step 1 was completed incidentally by commit `8c655082` (2026-06-09 research scope approval session): the Codex `customer-discovery` alignment section now starts with the generator-owned stub paragraph, its `ALIGNMENT-PAGE.md` is byte-identical to the Claude sibling, and `node scripts/upgrade-alignment-page.mjs --dry-run` reports `Updated: 0` / `Bundled files written: 0` with bespoke count down from 15 to 14. Checked off as a stale checkbox, not new work.
- Step 2 hardened `scripts/upgrade-alignment-page.mjs`: bespoke classification is now tracked per skill name across mirrors and validated against a new exact allowlist, `scripts/alignment-bespoke-list.txt` (seeded with the 7 currently-bespoke skills: `consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations`, `uat`, `research-roadmap`).
- Failing diagnostics (exit 1 in both dry-run and write mode): unlisted bespoke section (the exact `customer-discovery` failure mode), mixed generated/bespoke sibling pair even when allowlisted, and stale allowlist entry with no bespoke section remaining. Summary output gained a `Bespoke allowlist: N skills, exact|DRIFT` line.
- Added `--root <path>` so tests can run the script against fixture trees; only `repoRoot` derivation changes.
- Added `tests/layer1/upgrade-alignment-page-bespoke.test.ts`: repo-state assertions (allowlist exists, matches bespoke set computed directly from active `SKILL.md` files, every entry bespoke in both mirrors) plus five behavioral fixture tests via `--root` (unlisted bespoke → exit 1, mixed pair → exit 1, allowlisted symmetric pair → exit 0, stale entry → exit 1, clean stub-only repo → exit 0).
- Documented the bespoke allowlist and diagnostics in `docs/alignment-page-convention.md` outside the generated-marker block; no bundle regeneration triggered.
- Validation passed: `node --check scripts/upgrade-alignment-page.mjs`; `node scripts/upgrade-alignment-page.mjs --dry-run` (exit 0, `Bespoke allowlist: 7 skills, exact`); write-mode run with no tracked diff; focused layer1 vitest (13 tests across the new and existing alignment-page test files); `git diff --check`.

### Phase 2 Review Notes (Step 3, 2026-06-10)

- Step 3 shipped: `scripts/upgrade-alignment-page.mjs` now validates that every active `ALIGNMENT-PAGE.md` (generated, bespoke, and skip-listed alike) references only its owning skill's `alignment/{skill-name}-{topic}.html` output path, exiting 1 with `Foreign output path` diagnostics in both dry-run and write mode, plus an `Output paths: N bundles, exact|DRIFT` summary line. Coverage and full details in the "Alignment Bundle Path-Consistency Validation (Drift Plan Phase 2 Step 3)" section above. Current repo: 270 bundles, exact.

### Phase 2 Review Notes (Step 4, 2026-06-10)

- Step 4 shipped: `scripts/upgrade-alignment-page.mjs --check` is the no-write repo-state gate for generated-bundle drift — exit 1 with named per-skill diagnostics (`Stale generated bundle`, `Missing generated bundle`, `Stale SKILL.md stub`) when an ownable skill's on-disk `ALIGNMENT-PAGE.md` differs from `bundledContentFor(...)` or its stub paragraph needs replacing, plus a `Generated bundles: N ownable, exact|DRIFT` summary line in every mode. Plain `--dry-run` still exits 0 on pending updates (preview workflow preserved); bespoke and skip-listed skills are exempt. Layer1 enforces the gate via a repo-state `--check` run and five `--root` fixture tests. Full details in the "Generated-Bundle Drift Validation (Drift Plan Phase 2 Step 4)" section above. Current repo: 270 ownable, exact.

---

## Separate Skills Showcase From Skillpacks Package

### Execution Profile
- Parallel mode: serial
- Rationale: workspace metadata, package relocation, generator paths, and boundary validation share repository-level files and generated outputs.

### Phase 1: Workspace And Package Boundary
- [x] Rewrite root `package.json` as private `agentic-skills` workspace metadata.
- [x] Add workspace recognition for `apps/skills-showcase` and `packages/skillpacks`.
- [x] Move `bin/skillpacks.mjs` and `src/cli/run-pack-script.mjs` into `packages/skillpacks/`.
- [x] Add `packages/skillpacks/package.json`.
- [x] Add `packages/skillpacks/scripts/build-package.mjs`.
- [x] Ensure package staging excludes `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/`.

### Phase 2: Website Generators And Shared Catalog
- [x] Move Skills Showcase generator and validator scripts into `apps/skills-showcase/scripts/`.
- [x] Add a read-only shared catalog layer under `scripts/catalog/`.
- [x] Update generators to read catalog helpers and continue writing website-owned generated outputs.
- [x] Update docs and app copy to point at the app-owned generator commands.

### Verification And Shipping
- [x] Run `node packages/skillpacks/bin/skillpacks.mjs --version`.
- [x] Run `node packages/skillpacks/bin/skillpacks.mjs list`.
- [x] Run `node packages/skillpacks/scripts/build-package.mjs --check`.
- [x] Run `npm pack packages/skillpacks/build --dry-run --json --silent`.
- [x] Install the staged tarball in a temp consumer and run `skillpacks install quality-sweep` plus `skillpacks doctor`.
- [x] Run `pnpm --dir apps/skills-showcase test`.
- [x] Run `pnpm --dir apps/skills-showcase build`.
- [x] Run `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`.
- [x] Run `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, and `git diff --check`.
- [x] Verify package checks leave `apps/skills-showcase/`, `docs/skills-showcase/`, and `docs/benchmark-results-matrix.md` unchanged.
- [x] Verify website validation leaves package staging and metadata unchanged.
- [x] Confirm npm dry-run excludes `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/`.
- [x] Update review notes, history, ship manifest, commit, and push intended changes.

### Review Notes
- Implementation started from the approved separation plan: one repo, independent monorepo consumers, shared internal catalog, and no npm publish.
- `node packages/skillpacks/bin/skillpacks.mjs --version`, `node packages/skillpacks/bin/skillpacks.mjs list`, and `node packages/skillpacks/scripts/build-package.mjs --check` passed during implementation.
- Package staging uses tracked `global/` and `packs/` files only, selected repo install scripts/docs, and package-owned `bin/` and `src/`.
- `npm pack packages/skillpacks/build --dry-run --json --silent` passed and reported no `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, or `docs/history/` entries.
- Temp consumer package install passed from `/tmp`: installed `quality-sweep` from the staged `skillpacks-0.1.0.tgz`, and `doctor` reported `.claude/skills/quality-sweep` and `.codex/skills/quality-sweep` as `ok`.
- `pnpm --dir apps/skills-showcase build` passed. The first app test run found a stale generated `apps/skills-showcase/alignment/animation-state-machine.html`; regenerated it with `pnpm --dir apps/skills-showcase exec jiti scripts/render-animation-state-machine-page.ts`, then `pnpm --dir apps/skills-showcase test` passed 12 files / 132 tests.
- Made the GitHub proof generator deterministic by default: committed proof data uses local git evidence unless `SKILLS_SHOWCASE_REFRESH_GITHUB=1` is set for an ad hoc refresh. This fixed validator flakiness caused by public GitHub metadata availability changing between runs.
- `pnpm --dir apps/skills-showcase validate:data` and root `npm run skills-showcase:validate-data` both passed with fresh generated data.
- Boundary checks passed: package verification left website-owned generated assets unchanged, and website validation left package staging/metadata unchanged.
- Integrity checks passed: `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, script `node --check` commands, and `git diff --check`.
- A CLI smoke run rewrote `.agents/project.json`; that project-designation churn was restored because it is not part of this migration.
- Unrelated pre-existing local changes remain in `alignment/skillmap.html`, `docs/skillmap.excalidraw`, and `scripts/generate-skillmap-excalidraw.mjs`; do not touch them unless the user redirects.

---

## Skillpacks npm Distribution Phase 2

### Execution Profile
- Parallel mode: serial
- Rationale: manifest generation, CLI behavior, and package boundary validation share the same files and should be integrated in one lane.

### Phase 2: Deck Metadata And Manifest
- [x] Add `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.
- [x] Generate `packages/skillpacks/dist/skillpacks-manifest.json` from repository skill and pack sources.
- [x] Include pack names, skill names, tools, versions, content hashes, archive versions, source paths, and status.
- [x] Include deck metadata for `vard`, `ord`, `business-afps`, and `devtool-afps`.
- [x] Include COA B package-list fields and COA C registry-tag fields for every deck.
- [x] Include `packages/skillpacks/dist/skillpacks-manifest.json` in the npm package allowlist.
- [x] Add `skillpacks list --json` using the manifest.
- [x] Add `skillpacks install-deck <deck>` and `skillpacks install-deck business-afps --full`.
- [x] Preserve `pack.sh` forwarding for all existing commands.

### Verification And Shipping
- [x] Run `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs --check`.
- [x] Verify `node packages/skillpacks/bin/skillpacks.mjs list --json`.
- [x] Verify temp consumer repo `install-deck vard`.
- [x] Verify temp consumer repo `install-deck business-afps` and `install-deck business-afps --full`.
- [x] Run `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` and confirm manifest inclusion plus task/prompt/alignment/test exclusions.
- [x] Run targeted package, routing, and generated-data checks as required by changed files.
- [x] Update review notes, history, and ship manifest.
- [x] Commit and push intended changes.

### Review Notes
- Prepared after Phase 0/1 shipped in `b9b78312`.
- Real `npm publish` remains out of scope for this phase unless the user explicitly changes the scope and confirms the external publish action.
- 2026-06-09 split re-audit corrected stale Phase 2 manifest paths to the package workspace (`packages/skillpacks/scripts/` and `packages/skillpacks/dist/`); manifest/deck implementation remains unstarted.
- 2026-06-09 split re-audit found active `exec`, `ship`, `create-agentic-skill`, and `targeted-skill-builder` contracts still referenced removed root Skills Showcase scripts; archived/bumped those skill mirrors and rewrote refresh commands to `apps/skills-showcase/scripts/...`.
- Implemented package-owned manifest generation at `packages/skillpacks/scripts/build-skillpacks-manifest.mjs` and generated `packages/skillpacks/dist/skillpacks-manifest.json` with 41 packs, 367 active skill records, and 4 deck records.
- Manifest validation covers missing active skill paths, missing active skill versions, deck references to missing active pack directories, and missing package-list / registry-tag metadata. `devtool` and `game` are represented as active pack directories with null `PACK.md` metadata.
- Added `skillpacks list --json` as a manifest read path while keeping `skillpacks list` forwarded to `pack.sh list`.
- Added `skillpacks install-deck <deck> [--full]` as a manifest resolver over `bash scripts/pack.sh install ...`; `business-afps --full` selects `business-discovery`, `customer-lifecycle`, `business-growth`, and `business-ops`.
- Temp consumer checks passed from `/tmp`: `install-deck vard`, `install-deck business-afps`, `install-deck business-afps --full`, and `doctor` after each install. Negative checks for unknown deck and unsupported flag returned clear errors.
- Package checks passed: `npm --workspace skillpacks run build:check`; parsed `npm pack packages/skillpacks/build --dry-run --json --silent` confirmed `dist/skillpacks-manifest.json` is included and `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/` are excluded.
- Repository integrity passed: manifest shape assertion, `node --check` for changed package/catalog scripts, `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, and `git diff --check`.
- Skills Showcase validation refreshed GitHub proof data because `tasks/history.md` is one of its source inputs. Skill/pack catalog generated data and the benchmark matrix were rewritten by the validator but ended with no tracked diff.
- Unrelated pre-existing local changes remain in `alignment/skillmap.html`, `docs/skillmap.excalidraw`, and `scripts/generate-skillmap-excalidraw.mjs`; do not touch them unless the user redirects.

---

## Skillpacks npm Distribution Phase 0/1

### Execution Profile
- Parallel mode: serial
- Rationale: package metadata, CLI wrapper, task docs, and verification all share the same shipping boundary.

### Phase 0: Reservation And Preflight
- [x] Capture prompt history for the `exec` invocation.
- [x] Inspect approved npm distribution design and existing script contracts.
- [x] Re-check safe npm registry/account information for `skillpacks` without publishing.
- [x] Confirm package license metadata from current repository files.
- [x] Document that real `npm publish` is out of scope for this pass.

### Phase 1: Monolith Package And Thin CLI
- [x] Add root `package.json` for `skillpacks`.
- [x] Add `bin/skillpacks.mjs`.
- [x] Add `src/cli/run-pack-script.mjs` or equivalent dispatcher.
- [x] Forward current `pack.sh` commands while preserving consumer project `cwd`.
- [x] Implement `init-global` by invoking packaged `init.sh`.
- [x] Add dependency checks for `bash` and write-command `jq`.

### Verification And Shipping
- [x] Verify `node bin/skillpacks.mjs list`.
- [x] Verify temp consumer repo install/status/doctor behavior.
- [x] Run `npm pack --dry-run`.
- [x] Run targeted existing repository checks appropriate for package metadata.
- [x] Update review notes, history, commit, and push intended changes.

### Review Notes
- Added a root `skillpacks@0.1.0` npm package boundary with `bin/skillpacks.mjs`, `src/cli/run-pack-script.mjs`, and a narrow `files` allowlist.
- The CLI delegates existing project-local commands to packaged `scripts/pack.sh` while preserving the consumer project's current working directory. `init-global` delegates to packaged `init.sh`.
- Package metadata uses `license: UNLICENSED` because no repository `LICENSE` file exists. Real `npm publish` is intentionally out of scope until explicit publish approval, account readiness, and final package metadata are confirmed.
- Safe npm preflight: `npm view skillpacks`, `npm view @skillpacks/cli`, and `npm view @skillpacks/core` returned `E404`; `npm whoami` returned `ENEEDAUTH`.
- Local npm cache note: default `npm pack` hit root-owned files in `~/.npm`; validation used `npm_config_cache=/tmp/skillpacks-npm-cache` without changing home-directory ownership.
- Package dry-run: 5,508 files, 9.24 MB package size, 53.33 MB unpacked size, zero denied files from `alignment/`, `prompts/`, `tasks/`, `apps/`, `tests/`, or `docs/history/`.
- Packaged tarball install passed from `/tmp`: installed `quality-sweep` from `node_modules/skillpacks`, and `doctor` reported the installed Claude/Codex skill roots as `ok`.
- Validation exposed and fixed packaged content gaps: `ord-ship` now recommends installing the `devtool` pack before graduating to `devtool-adoption`; ORD/VARD rapid deck skills now have benchmark coverage metadata.
- Verification passed: CLI smoke, tarball install, `npm pack --dry-run`, Node syntax checks, routing audit, skill version audit, archive audit, dependency audit, benchmark coverage, focused `bench-coverage` layer1 tests, generated showcase validation, and `git diff --check`.
- Unrelated pre-existing local changes are present in `alignment/skillmap.html`, `docs/skillmap.excalidraw`, and `scripts/generate-skillmap-excalidraw.mjs`; this phase will not touch them.

---

## Skillpacks Deck Metadata Approval Revision

### Phase 1: Design Revision
- [x] Capture prompt history for the revised `idea-scope-brief` approval YAML.
- [x] Compare the revised deck gate against the previously shipped npm roadmap.
- [x] Update `docs/skillpacks-npm-distribution.md` so deck installation uses COA B/C-shaped package-list and registry-tag metadata.
- [x] Update `docs/decks.md` so npm deck distribution no longer says decks simply map to install presets.

### Phase 2: Verification And Shipping
- [x] Verify revised deck wording and roadmap phase names with targeted searches.
- [x] Run `git diff --check`.
- [x] Commit and push intended changes.

### Review Notes
- New approval differs from the previously shipped roadmap: the overall route still starts with COA A, but the deck-installation gate now says `Other / None of the above` with notes `COA B and C`.
- Updated `docs/skillpacks-npm-distribution.md` so deck installation is modeled as COA B/C-shaped package-list and registry-tag metadata that the first monolith CLI materializes through a manifest resolver.
- Updated `docs/decks.md` so npm deck distribution no longer describes decks as simple install presets.
- Scope control: no package implementation, no root `package.json`, no CLI code, and no GitHub Actions were added.
- Verification passed: targeted `rg` scan for revised deck terms, roadmap phase naming, stale preset wording, and `git diff --check`.

---

## Skillpacks npm Distribution Design

### Phase 1: Approved Design Handoff
- [x] Capture prompt history for the `idea-scope-brief` approval YAML.
- [x] Read `alignment/idea-scope-brief-npm-distribution.html` and approved gate answers.
- [x] Inspect existing deck, pack, install, and versioning docs.
- [x] Check current npm registry status for `skillpacks`, `@skillpacks/cli`, `@skillpacks/core`, and `agentic-skills`.
- [x] Write `docs/skillpacks-npm-distribution.md`.

### Phase 2: Verification And Shipping
- [x] Verify the design doc preserves the approved decisions and includes a detailed implementation roadmap.
- [x] Run `git diff --check`.
- [x] Commit and push intended changes.

### Review Notes
- Approved path at original shipment: use `skillpacks` as the public npm/CLI name, start with one monolith package, keep skill-level pinning, and preserve a migration path toward scoped packages or registry tags. Revised by the later deck metadata approval above: deck installation should now be modeled as COA B/C package-list and registry-tag metadata that the monolith CLI materializes.
- Current registry preflight: `npm view skillpacks`, `npm view @skillpacks/cli`, and `npm view @skillpacks/core` returned `E404`; `npm view agentic-skills` returned an existing external package at `2.5.1`, so the old repo name should not be the npm package name.
- Design artifact: `docs/skillpacks-npm-distribution.md`.
- Scope control: no package implementation, no root `package.json`, no CLI code, and no GitHub Actions were added in this pass.
- Verification passed: targeted key-string scan for approved decisions and all roadmap phases; ASCII scan confirmed the new design doc is ASCII-only; `git diff --check` passed.
- Unrelated worktree item left untouched: `apps/skills-showcase/next-env.d.ts`.

---

## npm Distribution Deck Installation Gate

### Phase 1: Investigation And Fix
- [x] Capture prompt history for the `investigate` invocation.
- [x] Confirm the npm distribution alignment page has deck-installation content but no corresponding review gate.
- [x] Move deck-based installation above the review gates.
- [x] Add a required deck-installation gate.
- [x] Update correction lesson.

### Phase 2: Verification And Shipping
- [x] Run targeted page/gate checks and `git diff --check`.
- [x] Add review notes with root cause, fix, and verification results.
- [x] Commit and push the intended changes.

### Review Notes
- User claim validated: confirmed. `alignment/idea-scope-brief-npm-distribution.html` had deck-based installation content, but it was appended after the review gates and compile controls, so final YAML could omit the deck-install decision entirely.
- Root cause: the 2026-06-07 deck addendum added substantive COA-specific installation behavior without adding a matching `.gate` question block or moving the section into the pre-gate review body.
- Fix: moved `Deck-Based Installation` before `Review Gates`, added it to the TOC, added local section feedback controls, and added a required `Deck-Based Installation` gate with COA A/B/C/hybrid/other/clarification choices.
- Archive: saved the pre-revision page at `docs/history/archive/2026-06-08/145626/alignment/idea-scope-brief-npm-distribution.html`.
- Prevention: added a lesson requiring substantive alignment-page addenda to include matching gates before compile controls.
- Verification passed: structure/order check (`deck-based-installation` before `review-gates` before `compile`), single deck heading check, TOC/feedback/gate presence check, inline JavaScript syntax check, extracted gate list containing `deck-based-installation`, archive existence check, targeted string scan, and `git diff --check`.
- Unrelated worktree item left untouched: `apps/skills-showcase/next-env.d.ts`.

---

## Workflow Design Alignment Chart Clipping

### Phase 1: Investigation And Fix
- [x] Capture prompt history for `investigate`, Browser verification, and Computer Use verification.
- [x] Record the plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the Graduation Path routing chart markup and styles.
- [x] Reproduce or confirm the right-edge clipping.
- [x] Patch the layout so the rapid pipeline chart remains fully visible.
- [x] Update `tasks/lessons.md` with the correction pattern.

### Phase 2: Verification And Shipping
- [x] Run static validation and `git diff --check`.
- [x] Verify the fixed page visually in the browser.
- [x] Add review notes with root cause, fix, and verification results.
- [x] Commit and push the intended changes.

### Review Notes
- User claim validated: confirmed. The previous Graduation Path flow chart placed every node label to the right of its node, so final-layer destination labels extended beyond the SVG viewBox and were clipped on the right edge.
- Root cause: `alignChart.flow()` did not account for edge-layer label placement. The current `HEAD` alignment page now anchors final-layer labels inward with `text-anchor="end"` and includes a visible revision note in the Graduation Path section.
- Archive: saved the pre-revision page state to `docs/history/archive/2026-06-08/105036/alignment/workflow-design-three-pipelines.html`; that snapshot shows the old outward-label flow helper and `alignment_status: approved`.
- Index maintenance: updated tracked `alignment/index.html` so the entry matches the revised Four-Pipeline page title and 2026-06-08 refresh date.
- Verification passed: `git diff --check`; targeted status/helper/index string scans; archive existence check; focused node-position calculation showing all Graduation Routing labels inside bounds; Quick Look render; and Safari visual inspection of the Graduation Path section showing the right-side Business AFPS and Devtool AFPS labels visible.
- Tooling note: Browser plugin control was unavailable because the required Node REPL browser tool was not exposed in this session, so the visual check used Safari through Computer Use. `node scripts/upgrade-alignment-page.mjs --dry-run` exited successfully but reports broader pre-existing generated `ALIGNMENT-PAGE.md` drift outside this page revision; those 267 generated writes were not applied.

---

## Documentation Freshness And Cleanup Audit

### Phase 1: Plan And Inventory
- [x] Capture prompt history for the `devtool-docs-audit` invocation.
- [x] Record full plan in `tasks/roadmap.md`.
- [x] Inventory tracked documentation surfaces and classify active vs generated vs historical docs.

### Phase 2: Freshness Checks
- [x] Compare top-level/setup docs against current scripts and repository layout.
- [x] Compare workflow/routing docs against active skill contracts.
- [x] Scan docs for stale command names, moved paths, missing scripts, and archive-worthy historical artifacts.

### Phase 3: Report And Verify
- [x] Write `research/devtool-docs-audit.md`.
- [x] Build `alignment/devtool-docs-audit-docs-freshness.html`.
- [x] Add review notes with cleanup/archive recommendations.
- [x] Run targeted verification and `git diff --check`.

### Review Notes
- Current docs audit report: `research/devtool-docs-audit.md`.
- Alignment review page: `alignment/devtool-docs-audit-docs-freshness.html`; browser open fallback via `open` succeeded.
- Previous live docs-audit report archived to `docs/history/archive/2026-06-08/040539/research/devtool-docs-audit.md`.
- Highest-priority fixes: correct managed-copy vs symlink wording, repair missing `scripts/init-agentic-skills.sh` references, replace retired `icp` command routes with `customer-discovery`, and archive or relabel historical docs in active-looking locations.
- Cleanup candidates: `docs/workflow-refactor-proposal.html`, `docs/kanban-test-results.md`, `docs/phases/*`, root session artifacts, older dated devtool audit research, and stale `specs/drift-report.md`.
- Pack-doc gaps: add `PACK.md` for active `devtool` and `game` packs; remove ignored local `packs/poketowork-kanban/` residue only after explicit cleanup approval.
- Validation passed: `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `node scripts/upgrade-alignment-page.mjs --dry-run`, `pnpm --dir tests bench:coverage`, `scripts/validate-skills-showcase-data.sh`, key-string scans, and `git diff --check`.

---

## Add Scriptability Findings To Alignment Pages

### Phase 1: Plan And Archive
- [x] Inspect current target alignment pages and task notes.
- [x] Confirm `alignment/index.html` is untracked.
- [x] Archive target HTML pages to `docs/history/archive/2026-06-07/180623/alignment/`.

### Phase 2: Amend Existing Pages
- [x] Update `alignment/analyze-sessions-pack-install-issues.html` with the dated script surface follow-up.
- [x] Update `alignment/analyze-sessions-downstream-skill-inventory.html` with the dated portability addendum.
- [x] Update `alignment/analyze-sessions-plain-text-skill-opportunities.html` with the dated script extraction clarification.
- [x] Keep `alignment/skills-inventory.html` unchanged because it is a generated/static catalog.

### Phase 3: Verification
- [x] Refresh or verify local `alignment/index.html`.
- [x] Run `git diff --check`.
- [x] Verify required key strings and archive snapshots.
- [x] Run `node scripts/upgrade-alignment-page.mjs --dry-run`.

### Review Notes
- Scope is amendment-only: no new alignment page, no script extraction implementation, and no generated `ALIGNMENT-PAGE.md` hand edits.
- `alignment/index.html` is not tracked by `git ls-files`; treat central index maintenance as local verification unless later evidence shows it should be committed.
- Local central index was regenerated with 36 pages and includes the three amended alignment pages; it remains untracked by design.
- Verification passed: `git diff --check`; key-string scan for dated addenda, `pack.sh`, `Bash 3.2`, `compile-central-alignment`, and `scripts/init-agentic-skills.sh`; archive snapshot listing; and `node scripts/upgrade-alignment-page.mjs --dry-run` with `Updated: 0` and `Bundled files written: 0`.

---

## Skills That Should Be Scripts Research Validation

### Phase 1: Evidence Capture
- [x] Capture prompt history for the `investigate` invocation.
- [x] Inventory repository scripts and validate reported script counts/line counts.
- [x] Inspect named skills and classify the LLM role.
- [x] Validate the `pack` skill/pass-through claim in detail.
- [x] Record review results and final recommendation.

### Review Notes
- `scripts/` contains 22 files, or 21 code/script files excluding `alignment-skip-list.txt`; 16 files currently have executable bits.
- Confirmed: `scripts/pack.sh` is a 1164-line full pack lifecycle CLI, and explicit `$pack` subcommands are mostly delegation plus reporting/reload guidance.
- Confirmed with caveats: `mono-detect` and `skill-inventory` are script-fronted workflows, but their skills still own summary/routing/report/alignment behavior.
- Confirmed: `provision-agentic-config` is static block insertion/replacement with collision/version handling.
- Not supported: `upgrade-alignment-pages` does not delegate to `scripts/upgrade-alignment-page.mjs`; that script regenerates bundled `ALIGNMENT-PAGE.md` files from the canonical convention.
- Not supported: `compile-central-alignment` does not delegate index generation to `scripts/open-html-page.mjs`; the script is only the browser opener after index generation.
- Overstated: `sync`, `release`, `deploy`, `update-packages`, and `create-local-skill` have deterministic substeps, but the current contracts encode safety policy, confirmation gates, compatibility judgment, or report/alignment obligations that should not be collapsed blindly into shell scripts.
- Active catalog count: 357 active `SKILL.md` files across mirrors and 181 unique active skill names; the broad "vast majority are LLM-dependent" conclusion remains directionally correct.
- Recommendation: extract deterministic primitives into scripts, but keep skills as policy/judgment orchestrators unless the skill is true pass-through.

### 2026-06-06 Follow-up Verification Notes
- Prompt history captured for the Codex `investigate` invocation at `prompts/investigate/skill-prompt-20260606-183821-scriptable-skills.md`.
- Reconfirmed source catalog counts: 357 active source `SKILL.md` files under `global/` and `packs/`, 181 unique active skill names, and 22 files under root `scripts/`.
- Reconfirmed `pack.sh` is the strongest script-first precedent: it owns pack/skill install, remove, refresh, doctor, prune, pin/unpin, project-mode writes, locking, drift markers, and reload notice behavior.
- New finding: downstream/manual script readiness needs a portability standard. On this macOS host, `bash --version` is GNU Bash 3.2.57; `skill-inventory.sh`, `skill-deps.sh`, `skill-versions.sh`, and `skill-next-step-routing.sh` fail with Bash 4-only constructs such as `declare -A` or `mapfile`.
- New finding: `docs/scripts-reference.md` and `docs/packs.md` reference `scripts/init-agentic-skills.sh`, but no root `scripts/init-agentic-skills.sh` exists; the actual launchers live under `global/{claude,codex}/init-agentic-skills/scripts/`.
- New finding: `compile-central-alignment` is the best near-term extraction candidate because the index-generation algorithm is fully specified in the skill and only the opener is scripted today.
- Verification: `node scripts/upgrade-alignment-page.mjs --dry-run` passed with `Updated: 0` and `Bundled files written: 0`.
- Verification: `bash scripts/pack.sh which compile-central-alignment` and `bash scripts/pack.sh which skill-inventory` correctly locate the providing packs and install commands.
- Verification: targeted layer1 Vitest run passed 24/27 assertions; failures were existing script/contract issues relevant to this investigation: stale `compile-central-alignment` test expectation (`v0.1` expected, active contract is `v0.2`) and Bash 3.2 failures in `skill-inventory.sh`.

---

## Current State

- Tree is clean after ship-end wrap-up, master — `user-flow-map` product-design skill and AFPS routing refactor shipped in commit `276f595f`.
- Preserved existing customer-discovery orchestrator notes below; do not overwrite unrelated in-progress items.

---

## user-flow-map Skill And AFPS Routing Refactor (shipped)

### Phase 1: Inspect And Plan
- [x] Capture prompt history for the targeted skill invocation.
- [x] Read relevant lessons for routing and validation pitfalls.
- [x] Search for existing user-flow mapping ownership and routing references.
- [x] Read product-design skill conventions and affected skill contracts.

### Phase 2: Create New Skill
- [x] Add Codex `packs/product-design/codex/user-flow-map/`.
- [x] Add Claude `packs/product-design/claude/user-flow-map/`.
- [x] Add `SKILL.md`, `CHANGELOG.md`, and `agents/openai.yaml` mirrors.
- [x] Generate `ALIGNMENT-PAGE.md` mirrors through `scripts/upgrade-alignment-page.mjs`.

### Phase 3: Refactor Routing
- [x] Archive and bump existing `SKILL.md` mirrors before edits.
- [x] Update `positioning` to route completed product synthesis to `user-flow-map`.
- [x] Update `ui-interview`, `ux-variations`, `prototype`, and `spec-interview` contracts.
- [x] Update `research-roadmap` stale rules, artifact tracking, priority order, and dependency tree.
- [x] Update AFPS docs and global skill browser references.

### Phase 4: Generated Assets And Coverage
- [x] Update alignment generator gates for `user-flow-map`.
- [x] Refresh Skills Showcase data and validate it.
- [x] Update benchmark coverage for `user-flow-map`.

### Phase 5: Verification And Shipping
- [x] `scripts/skill-versions.sh --missing`
- [x] `scripts/skill-archive-audit.sh --strict`
- [x] `scripts/skill-deps.sh --broken`
- [x] `scripts/skill-pack-routing-audit.sh`
- [x] `node scripts/upgrade-alignment-page.mjs --dry-run`
- [x] `scripts/validate-skills-showcase-data.sh`
- [x] `pnpm --dir tests bench:coverage`
- [x] Targeted route tests: `competitive-analysis-routing.test.ts` and `journey-map-routing.test.ts`
- [x] Targeted route `rg` spot checks.
- [x] `git diff --check`
- [ ] `pnpm --dir tests test` — ran; still fails on existing unrelated layer1 repo issues listed below.
- [x] Commit and push intended changes.

### Review Notes
- Skill integrity checks passed: version fields, archive audit, dependency scan, and pack routing audit.
- Generated alignment dry-run reported no drift; Skills Showcase generated data is fresh.
- Benchmark coverage matrix is valid at 180 skills; `user-flow-map` has custom pack workflow coverage.
- Targeted AFPS route tests pass for competitive-analysis and journey-map.
- Full `pnpm --dir tests test` still fails with 46 layer1 failures unrelated to the new flow route: stale `icp` test paths after the customer-discovery rename, staged-research contract gaps for customer-discovery/journey framework skills, unrelated YouTube handoff tests, existing alignment/index wording drift, a stale `poketowork-kanban` symlink under `node_modules`, and pre-existing benchmark/demo contract drift.
- Ship-end prompt/history wrap-up only changed documentation artifacts; no app deploy was run.

---

## Current State

- customer-discovery orchestrator refactor in progress on master.
- Recent work: icp → customer-discovery rename + orchestrator refactor (Phase 1-2 complete), all six Phase 3 framework subskills now have mirrored contracts.
- Active: Phase 4 documentation updates for the icp → customer-discovery rename.

---

## customer-discovery Orchestrator Refactor (in progress)

### Completed
- [x] Archive icp v0.11 (claude + codex)
- [x] Rename icp/ → customer-discovery/ (claude + codex)
- [x] Create framework scaffold directories (w3-hypothesis, jtbd-needs, four-forces, five-rings, seven-dimensions, pmf-engine)
- [x] Write orchestrator SKILL.md v1.0 (claude)
- [x] Write orchestrator SKILL.md v1.0 (codex)
- [x] Update CHANGELOGs
- [x] Update orchestrator-convention.md reference implementations

### Phase 3: Write subskill SKILL.md files
- [x] `w3-hypothesis` — Schwartzfarb W3 (WHO/WHAT/WHY) hypothesis generation + disproval
- [x] `jtbd-needs` — Ulwick/Christensen JTBD needs-based segmentation
- [x] `four-forces` — Moesta Four Forces (Push/Pull/Anxiety/Habit) switching analysis
- [x] `five-rings` — Revella Five Rings of Buying Insight (decision psychology)
- [x] `seven-dimensions` — Lincoln Murphy 7 Dimensions ICP scoring
- [x] `pmf-engine` — Vohra/Supan PMF Engine + High-Expectation Customer
- Each needs: SKILL.md, CHANGELOG.md, ALIGNMENT-PAGE.md (claude first, then codex mirror)

### Phase 3 Review Notes
- Added Claude and Codex `pmf-engine` framework mirrors with `SKILL.md`, `CHANGELOG.md`, and generated `ALIGNMENT-PAGE.md`.
- PMF Engine is constrained to product-exists contexts with real user/customer evidence, Sean Ellis PMF signal handling, very-disappointed segmentation, behavioral evidence checks, and High-Expectation Customer synthesis.
- Added `pmf-engine` to the benchmark coverage registry as blocked because it requires real product/user evidence and lacks a deterministic pack workflow fixture.
- Validation completed: skill versions, dependency scan, pack routing audit, alignment dry-run, Skills Showcase freshness, benchmark coverage, staged-research string check, targeted mirror scans, and `git diff --check`.
- Broad `pnpm --dir tests verify` still fails on 46 known layer1 failures unrelated to `pmf-engine` (stale `icp` paths, existing alignment wording drift, mirror parity drift, and benchmark/demo contract drift); final failure summary does not list `pmf-engine`.

### Phase 4: Documentation Updates (icp → customer-discovery rename)
- [x] Update AFPS flow docs (canonical-workflow-report.md, skill-next-step-contracts.md, skills-reference.md, skill-anatomy.md, skill-invocation-types.md)

#### Phase 4 Review Notes
- Phase 4.1 updated the canonical AFPS docs to use `customer-discovery` for executable discovery routes and skill classification.
- Preserved `enterprise-icp` as a separate skill and `research/icp.md` as the canonical customer-discovery output artifact because the active `customer-discovery` contract still writes it.
- Also aligned the canonical product path to the current post-positioning sequence: `user-flow-map` → `ui-interview --requirements-only` → `ux-variations --layout-mode`.
- Validation completed: targeted `rg -n "icp|/icp|\\$icp|icp-needed"` over the five edited docs reported only intentional `enterprise-icp` and `research/icp.md` references; `git diff --check` passed; `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/journey-map-routing.test.ts layer1/codebase-status-routing.test.ts` passed with 3 files and 14 tests.

- [x] Update PACK.md for business-discovery

#### Phase 4.2 Review Notes
- Updated `packs/business-discovery/PACK.md` to describe `customer-discovery` as the default discovery skill while preserving `enterprise-icp` as a separate skill.
- Confirmed both pack mirrors have `customer-discovery` roots and no active `icp` roots: `packs/business-discovery/{codex,claude}/customer-discovery`.
- Targeted legacy scan over `PACK.md` now reports only the intentional `enterprise-icp` skill-list entry.
- Refreshed Skills Showcase data because a tracked `PACK.md` changed.
- Validation passed: targeted `rg -n "icp|/icp|\\$icp|icp-needed" packs/business-discovery/PACK.md`, `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Production deploy not run because it requires explicit confirmation; local build and deploy-contract prechecks passed.

- [x] Update global skills that route to /icp (idea-scope-brief, afps-status, codebase-status, skills, pack)

#### Phase 4.3 Review Notes
- Updated mirrored global contracts for `idea-scope-brief`, `afps-status`, `codebase-status`, `skills`, and `pack` so executable discovery routes now point to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Renamed the `afps-status` workflow stage from `icp-needed` to `discovery-needed`; active global files now retain `icp` only in intentional `enterprise-icp` skill names or `research/icp.md` artifact references.
- Archived and bumped all affected mirrored global `SKILL.md` files: `idea-scope-brief` v0.12, `afps-status` v0.1, `codebase-status` v0.5, `skills` v0.5, and `pack` v0.6.
- Added `tests/layer1/global-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, or `icp-needed` in active global routing contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed.
- Validation passed: targeted legacy-route scan over the edited active global `SKILL.md` files, `pnpm --dir tests exec vitest run --project layer1 layer1/global-customer-discovery-routing.test.ts layer1/afps-status-global-mirror.test.ts layer1/codebase-status-routing.test.ts layer1/idea-scope-brief-approval-ordering.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted route/mirror scans found no current-diff issue. `scripts/skill-mirror-parity-audit.sh` still fails on known pack-level heading drift outside this global-skill boundary; no failures referenced the edited global skill files.

#### Completed Plan — Phase 4.3 Global Skill Routing
- Scope: update global skills that still route users to the legacy executable `icp` command so they route to `customer-discovery` instead, and rename the AFPS status stage `icp-needed` to `discovery-needed`.
- Files to inspect/edit first: `global/{codex,claude}/idea-scope-brief/SKILL.md`, `global/{codex,claude}/afps-status/SKILL.md`, `global/{codex,claude}/codebase-status/SKILL.md`, `global/{codex,claude}/skills/SKILL.md`, and `global/{codex,claude}/pack/SKILL.md`.
- Versioning: before changing any active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>` for each affected Codex and Claude skill directory, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace route examples and recommendations from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` using the correct agent syntax; preserve `enterprise-icp` as a distinct skill and preserve `research/icp.md` only when referring to the canonical customer-discovery output artifact.
- Validation: run targeted active-file scans over the edited global skill roots for `/icp`, `$icp`, `icp-needed`, and standalone `icp`; allow only intentional `enterprise-icp` and `research/icp.md` artifact references. Then run skill integrity checks (`scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`), refresh Skills Showcase data, run `scripts/validate-skills-showcase-data.sh`, run relevant targeted layer1 routing tests if present, and finish with `git diff --check`.

- [x] Update business-discovery pack skills (competitive-analysis, customer-feedback, enterprise-icp, lean-canvas, value-prop-canvas, positioning + 5 frameworks)

#### Phase 4.4 Review Notes
- Updated active business-discovery pack contracts so retired executable discovery routes now point to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed route-bearing mirrors for `competitive-analysis`, `customer-feedback`, `lean-canvas`, `value-prop-canvas`, `positioning`, and the five positioning framework subskills. `enterprise-icp` was inspected and left unchanged because its active references are intentional skill/artifact names, not retired executable routes.
- Preserved `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` as intentional artifacts/skill names.
- Archived and bumped affected mirrored active `SKILL.md` files: `competitive-analysis` v0.14, `customer-feedback` v0.5, `lean-canvas` v0.7, `value-prop-canvas` v0.7, `positioning` v0.12, and positioning framework subskills v0.4.
- Added `tests/layer1/business-discovery-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active business-discovery routing contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The first validation pass exposed generator ordering sensitivity because the two showcase generators both touch shared generated assets; rerunning them sequentially made `scripts/validate-skills-showcase-data.sh` pass.
- Validation passed: `pnpm --dir tests exec vitest run --project layer1 layer1/business-discovery-customer-discovery-routing.test.ts`, `pnpm --dir tests exec vitest run --project layer1 layer1/business-discovery-customer-discovery-routing.test.ts layer1/competitive-analysis-routing.test.ts layer1/routing-graph.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential `node scripts/generate-skills-showcase-data.mjs` then `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, targeted active-file scan for retired executable routes, and `git diff --check`.
- Adversarial review: changed-file diff scan verified route changes stayed limited to command handoffs and version/changelog updates; no diff renamed the `research/icp.md` artifact or `enterprise-icp` skill.

#### Completed Plan — Phase 4.4 Business-Discovery Pack Routing
- Scope: update active business-discovery pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `enterprise-icp` as a separate skill and preserve `research/icp.md` only as the customer-discovery output artifact.
- Files to inspect/edit first: `packs/business-discovery/{codex,claude}/competitive-analysis/SKILL.md`, `customer-feedback/SKILL.md`, `enterprise-icp/SKILL.md`, `lean-canvas/SKILL.md`, `value-prop-canvas/SKILL.md`, `positioning/SKILL.md`, and positioning framework subskills under `packs/business-discovery/{codex,claude}/positioning/frameworks/*/SKILL.md`.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update the skill's `CHANGELOG.md`. If a framework subskill lacks a changelog, add one only if the local pattern for that framework directory expects it.
- Approach: replace command examples and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` using the correct runner syntax. Keep conceptual customer/profile language clear and avoid broad renames of the `research/icp.md` artifact until a separate artifact-rename decision exists.
- Validation: run targeted active-file scans over the edited business-discovery pack roots for `/icp`, `$icp`, `icp-needed`, and standalone `icp`; allow only intentional `enterprise-icp` and `research/icp.md` artifact references. Then run skill integrity checks (`scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`), refresh and validate Skills Showcase data, run relevant layer1 routing tests (`competitive-analysis-routing.test.ts`, `routing-graph.test.ts`, and any business-discovery-specific tests found by `rg`), and finish with `git diff --check`.

- [x] Update customer-lifecycle pack skills (journey-map orchestrator + 5 frameworks)

#### Phase 4.5 Review Notes
- Updated active customer-lifecycle `journey-map` contracts so missing customer-discovery prerequisites now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed the mirrored `journey-map` orchestrator and five journey-map framework subskills: `experience-map`, `jtbd-timeline`, `service-blueprint`, `user-story-map`, and `customer-journey-canvas`.
- Preserved `research/icp.md` and `research/{slug}/icp.md` as evidence artifact names; no artifact rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `journey-map` v0.10 and all five framework subskills v0.1.
- Added `tests/layer1/customer-lifecycle-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active journey-map contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The GitHub proof generator refreshed public repository metadata from fallback to current public metadata.
- Validation passed: `pnpm --dir tests exec vitest run --project layer1 layer1/customer-lifecycle-customer-discovery-routing.test.ts layer1/journey-map-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential `node scripts/generate-skills-showcase-data.mjs` then `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, corrected `rg --pcre2` active-file scan for retired executable routes, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts.

#### Completed Plan — Phase 4.5 Customer-Lifecycle Journey-Map Routing
- Scope: update active customer-lifecycle journey-map contracts that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` as the customer-discovery output artifacts.
- Files to inspect/edit first: `packs/customer-lifecycle/{codex,claude}/journey-map/SKILL.md` plus framework subskills under `packs/customer-lifecycle/{codex,claude}/journey-map/frameworks/{experience-map,jtbd-timeline,service-blueprint,user-story-map,customer-journey-canvas}/SKILL.md`.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace missing-discovery command examples and prerequisite routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology when it names the evidence artifact or customer-profile concept rather than the executable command.
- Validation: run targeted active-file scans over edited customer-lifecycle roots for backticked `$icp`, backticked `/icp`, `icp-needed`, and `Proceed to ICP`; allow only `research/icp.md` and `research/{slug}/icp.md` artifact references. Then run skill integrity checks, refresh and validate Skills Showcase data, run targeted layer1 journey/customer-discovery routing tests (`journey-map-routing.test.ts`, the business-discovery routing test if shared route text is touched, and any customer-lifecycle-specific tests found by `rg`), run `pnpm --dir apps/skills-showcase build`, and finish with `git diff --check`.
- [x] Update business-growth pack skills (experiment, gtm, hook-model, landing-copy, metrics, monetization, pmf-assessment)

#### Next Step Plan — Phase 4.6 Business-Growth Pack Routing
- Scope: update active business-growth pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/business-growth/{codex,claude}/experiment/SKILL.md`, `gtm/SKILL.md`, `hook-model/SKILL.md`, `landing-copy/SKILL.md`, `metrics/SKILL.md`, `monetization/SKILL.md`, and `pmf-assessment/SKILL.md`; if targeted scans find framework subskills under those roots with retired executable routes, include those subskills in the same routing pass.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited business-growth roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for business-growth customer-discovery routing, then run relevant existing business-growth/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.6 Review Notes
- Updated active business-growth route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `experiment`, `gtm`, `monetization`, and `pmf-assessment` active `SKILL.md` files. Inspected `hook-model`, `landing-copy`, and `metrics`; their active `icp` references are evidence-artifact or concept references, not retired executable route handoffs.
- Preserved `research/icp.md` and `research/{slug}/icp.md` as evidence artifact names; no artifact rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `experiment` v0.4, `gtm` v0.8, `monetization` v0.8, and `pmf-assessment` v0.6.
- Added `tests/layer1/business-growth-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active business-growth contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed.
- Validation passed: targeted `rg --pcre2` active-file scan for retired executable routes, `pnpm --dir tests exec vitest run --project layer1 layer1/business-growth-customer-discovery-routing.test.ts layer1/journey-map-routing.test.ts layer1/codex-interview-cadence.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build` after sandbox escalation, and `git diff --check`.
- Accepted pre-existing validation gap: an attempted broader targeted run including `layer1/product-path-manifest.test.ts` failed on already stale customer-discovery rename drift (`packs/business-discovery/{codex,claude}/icp/SKILL.md` paths are absent at `HEAD`, and `five-rings` lacks the product-path wording expected by that test). No current diff file is in that failing test's ownership path.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts or changed non-route business-growth behavior.

- [x] Update business-ops pack skills (assumption-tracker, burn-rate, cohort-review, mvp-gap, platform-strategy, product-line, reconcile-research, retro, risk-register, scale-audit)

#### Next Step Plan — Phase 4.7 Business-Ops Pack Routing
- Scope: update active business-ops pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/business-ops/{codex,claude}/assumption-tracker/SKILL.md`, `burn-rate/SKILL.md`, `cohort-review/SKILL.md`, `mvp-gap/SKILL.md`, `platform-strategy/SKILL.md`, `product-line/SKILL.md`, `reconcile-research/SKILL.md`, `retro/SKILL.md`, `risk-register/SKILL.md`, and `scale-audit/SKILL.md`; if targeted scans find framework subskills under those roots with retired executable routes, include those subskills in the same routing pass.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, verdict labels, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited business-ops roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for business-ops customer-discovery routing, then run relevant existing business-ops/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.7 Review Notes
- Updated active business-ops route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `mvp-gap`, `platform-strategy`, `product-line`, and `retro` active `SKILL.md` files. Inspected `assumption-tracker`, `burn-rate`, `cohort-review`, `reconcile-research`, `risk-register`, and `scale-audit`; their active `icp` references are evidence-artifact, enterprise-ICP, or concept references, not retired executable route handoffs.
- Preserved `research/icp.md`, `research/{slug}/icp.md`, `enterprise-icp`, and ICP concept language; no artifact rename or manifest schema rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `mvp-gap` v0.6, `platform-strategy` v0.7, `product-line` v0.3, and `retro` v0.3.
- Added `tests/layer1/business-ops-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active business-ops contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The GitHub proof generator refreshed public repository metadata from fallback to current public metadata.
- Validation passed: targeted `rg --pcre2` active-file scan for retired executable routes, `pnpm --dir tests exec vitest run --project layer1 layer1/business-ops-customer-discovery-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Accepted pre-existing validation gap: `tests/layer1/product-path-manifest.test.ts` also references business-ops `platform-strategy` and `product-line`, but current task notes already document that broader test as failing on stale customer-discovery rename drift outside this step. No current diff file is in the known absent `packs/business-discovery/{codex,claude}/icp/SKILL.md` ownership path.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts or changed non-route business-ops behavior.
- [x] Update product-design pack skills (brainstorm, prototype, spec-interview)

#### Next Step Plan — Phase 4.8 Product-Design Pack Routing
- Scope: update active product-design pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/product-design/{codex,claude}/brainstorm/SKILL.md`, `prototype/SKILL.md`, and `spec-interview/SKILL.md`; if targeted scans find framework subskills or adjacent product-design skills with retired executable routes, include only those route-bearing active `SKILL.md` files in the same pass.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, verdict labels, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited product-design roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for product-design customer-discovery routing, then run relevant existing product-design/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.8 Review Notes
- Inspected active product-design `brainstorm`, `prototype`, and `spec-interview` mirrors plus adjacent active product-design skills; no active `SKILL.md` recommended the retired `$icp` or `/icp` executable, used `icp-needed`, or kept `Proceed to ICP`.
- Left active product-design `SKILL.md` files unchanged because their remaining ICP references are evidence-artifact or customer-profile concept references such as `research/icp.md`.
- Added `tests/layer1/product-design-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active product-design contracts.
- Refreshed Skills Showcase GitHub proof data after validation detected stale generated fingerprints.
- Validation passed: targeted active-file retired-route scan returned no matches, `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-customer-discovery-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff adds coverage and generated proof freshness only; no diff changed product-design runtime behavior, renamed ICP artifacts, or touched active skill metadata.
- [x] Update product-testing pack skills (dogfood, uat)

#### Next Step Plan — Phase 4.9 Product-Testing Pack Routing
- Scope: update active product-testing pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/product-testing/{codex,claude}/dogfood/SKILL.md` and `uat/SKILL.md`. Current scan shows retired executable handoffs in both dogfood and UAT mirrors, including follow-up routing lists and no-credible-user-journey prerequisite guidance.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace route examples and prerequisite recommendations from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep `research/icp.md` as an evidence artifact and keep ICP concept language only when it is not an executable route. Preserve existing `$journey-map`/`/journey-map`, `$guide`/`/guide`, and pack availability guard behavior.
- Validation: run targeted active-file scans over edited product-testing roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and customer-profile concept references. Add or update a layer1 routing regression test for product-testing customer-discovery routing, then run relevant existing product-testing/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.9 Review Notes
- Updated active product-testing route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `dogfood` and `uat` active `SKILL.md` files. Preserved `research/icp.md` as an evidence artifact and did not rename ICP concept language.
- Archived and bumped affected mirrored active `SKILL.md` files: `dogfood` v0.3 and `uat` v0.9.
- Added `tests/layer1/product-testing-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active product-testing contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed.
- Validation passed: boundary-aware active-file retired-route scan, `pnpm --dir tests exec vitest run --project layer1 layer1/product-testing-customer-discovery-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Accepted pre-existing validation gap: a broader targeted run including `layer1/afps-alignment-preview-gates.test.ts` and `layer1/alignment-gates.test.ts` failed on stale customer-discovery rename drift (`packs/business-discovery/claude/icp/SKILL.md` absent at `HEAD`) and global `afps-status` alignment wording drift. No current diff file is in those failure ownership paths.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts or changed non-route product-testing behavior.
- [x] Update research-admin, repo-maintenance, docs-health, teardown, monorepo pack skills

#### Next Step Plan — Phase 4.10 Remaining Pack Routing
- Scope: update active research-admin, repo-maintenance, docs-health, teardown, and monorepo pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect first: active `SKILL.md` files under `packs/research-admin/{codex,claude}/`, `packs/repo-maintenance/{codex,claude}/`, `packs/docs-health/{codex,claude}/`, `packs/teardown/{codex,claude}/`, and `packs/monorepo/{codex,claude}/`. Use targeted scans to identify only route-bearing contracts before editing.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, verdict labels, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for the remaining packs, then run relevant existing routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.10 Review Notes
- Updated active remaining-pack route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `research-roadmap`, `bootstrap-repo`, `desk-flip`, and `scaffold` active `SKILL.md` files. Inspected `docs-health` active skill files; their remaining `icp` references are evidence-artifact references such as `research/icp.md`, not retired executable handoffs.
- Preserved `research/icp.md`, `research/{slug}/icp.md`, and ICP concept language; no artifact rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `research-roadmap` v0.14, `bootstrap-repo` v0.2, `desk-flip` v0.3, and `scaffold` v0.1.
- Added `tests/layer1/remaining-packs-customer-discovery-routing.test.ts` and updated `tests/layer1/research-roadmap-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active remaining-pack contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The successful Next.js build updated `apps/skills-showcase/next-env.d.ts` from dev route types to build route types.
- Validation passed: boundary-aware active-file retired-route scan, `pnpm --dir tests exec vitest run --project layer1 layer1/remaining-packs-customer-discovery-routing.test.ts layer1/research-roadmap-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, build-generated type metadata, prompt history, task tracking, and regression tests; no diff renamed ICP artifacts or changed non-route remaining-pack behavior.
- [x] Rename afps-status stage `icp-needed` → `discovery-needed`

## Future Work

- [x] Refactor competitive-analysis to orchestrator pattern (Porter's Five Forces, SWOT, etc. as framework subskills)

### Completed Plan — Competitive-Analysis Orchestrator Refactor
- Scope: convert mirrored `competitive-analysis` from a single primary research skill into a Pattern A framework-decomposition orchestrator while preserving the canonical output paths `research/competitive-analysis.md`, `research/{slug}/competitive-analysis.md`, and the existing staged research/report-first approval contract.
- Files to inspect/edit first: `packs/business-discovery/{codex,claude}/competitive-analysis/SKILL.md`, `CHANGELOG.md`, `ALIGNMENT-PAGE.md`, related archives, `docs/orchestrator-convention.md`, `docs/skill-invocation-types.md`, `docs/skills-reference.md`, `tests/layer1/competitive-analysis-routing.test.ts`, `tests/layer1/business-discovery-customer-discovery-routing.test.ts`, and benchmark coverage fixtures that mention `competitive-analysis`.
- Candidate framework subskills: create mirrored `frameworks/porter-five-forces`, `frameworks/swot`, `frameworks/strategic-group-map`, and `frameworks/feature-pricing-matrix` unless a tighter scan finds an existing local taxonomy that should be reused. New framework subskills start at `version: v0.0`, use `invocation: sub-skill`, declare `parent: competitive-analysis`, and write intermediate artifacts such as `research/competitive-analysis-porter-five-forces.md` or product-path equivalents.
- Parent contract changes: archive and bump active `competitive-analysis` mirrors; add `invocation: orchestrator`; define framework-selection mode, synthesis mode (`--synthesize`), any shortcut modes, framework queue writing to `tasks/todo.md`, synthesis requirements, and no-next-step-routing behavior before approval. Preserve web-search/source-citation requirements and the current concept-validation gap-assessment behavior.
- Tests first: add or update layer1 tests proving the parent is an orchestrator, framework subskills exist in both mirrors, subskills avoid downstream routing, canonical output paths remain stable, and current customer-discovery/AFPS routing still passes.
- Validation: run targeted competitive-analysis tests, related business-discovery/customer-discovery routing tests, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, Skills Showcase data refresh/validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase Review Notes
- Converted active Codex and Claude `competitive-analysis` parents to `invocation: orchestrator` at v0.15, with Mode A framework selection and Mode B `--synthesize` while preserving canonical `research/competitive-analysis.md`, `research/{slug}/competitive-analysis.md`, search-log paths, staged research, report-first approval, and post-synthesis AFPS routing.
- Added mirrored framework subskills for `porter-five-forces`, `swot`, `strategic-group-map`, and `feature-pricing-matrix`; each starts at v0.0, declares `parent: competitive-analysis`, writes an intermediate `research/competitive-analysis-*.md` artifact, has generated `ALIGNMENT-PAGE.md`, and explicitly avoids downstream routing.
- Updated invocation taxonomy, orchestrator convention docs, benchmark coverage metadata, and layer1 routing coverage for the new orchestrator/subskill contract.
- Refreshed Skills Showcase generated data for 315 skills and 37 packs. No curated website copy changed because the public catalog is generated from skill metadata and the existing copy surfaces do not have bespoke `competitive-analysis` framework descriptions.
- Validation passed: `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/business-discovery-customer-discovery-routing.test.ts`; `pnpm --dir tests exec vitest run --project layer1 layer1/bench-coverage.test.ts layer1/bench-setups.test.ts`; `scripts/skill-versions.sh --missing`; `scripts/skill-archive-audit.sh --strict`; `scripts/skill-deps.sh --broken`; `scripts/skill-pack-routing-audit.sh`; `node scripts/upgrade-alignment-page.mjs --dry-run`; sequential Skills Showcase generation plus `scripts/validate-skills-showcase-data.sh`; `pnpm --dir tests bench:coverage`; active-file retired-route scan; `pnpm --dir apps/skills-showcase build`; and `git diff --check`.
- Benchmark harness cleanup: the broader benchmark layer1 run initially exposed stale harness issues in `benchmark-test-skill` deterministic wording and missing `repo-glossary` setup registration. Both were fixed in the same boundary, and the rerun passed 92/92 tests.
- Adversarial review: changed-file self-review plus targeted scans verified the parent owns synthesis/routing, subskills are route-free, active files do not reintroduce `$icp`/`/icp`/`icp-needed`/`Proceed to ICP`, and generated assets only reflect the new skill metadata.

## Backlog

- [x] Update the skills showcase pack list with the correct number of skills per pack and ensure all packs are represented

### Next Step Plan — Skills Showcase Pack List Coverage
- Scope: audit the Skills Showcase pack list/count presentation so every active pack is represented and counts match generated source data after the new competitive-analysis framework subskills increased the catalog size.
- Files to inspect first: `apps/skills-showcase/app/packs`, `apps/skills-showcase/components`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, `apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, and any tests that reference pack counts or pack-card rendering.
- Approach: identify whether the incorrect counts are generated-data, UI grouping, static copy, or filtering issues; prefer deriving displayed counts directly from generated pack/skill data rather than maintaining parallel static numbers. Keep unrelated visual redesign backlog items out of scope.
- Validation: run the relevant Skills Showcase unit/route tests if present, `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, targeted `rg` checks for stale hard-coded pack counts, and `git diff --check`.

#### Review Notes — Skills Showcase Pack List Coverage
- Updated `scripts/generate-skills-showcase-data.mjs` so active nested pack skills such as framework subskills are included while archive snapshots remain excluded.
- Generated pack rows now include every active `PACK.md` metadata row plus compatibility aliases with active skill roots. Current generated data reports 355 skill rows and 39 pack rows.
- The `/packs` UI now renders generated skill counts on pack nodes and detail panels, and labels `business-app` and `creator-media` as compatibility aliases with zero direct skills.
- Added `tests/layer1/skills-showcase-pack-coverage.test.ts` to guard active pack metadata coverage and nested framework skill counts.
- Updated the stale benchmark-demo fixture in `tests/layer1/skills-showcase-benchmark-demo.test.ts` to target the demo-backed Codex `pack` benchmark row.
- Validation passed: focused pack coverage layer1 test, focused catalog UI test, combined generated-data layer1 tests, sequential Skills Showcase data/proof generation, generated-data freshness validation, local `/packs` HTTP 200 check, production app build, adversarial invariant scans, and `git diff --check`.
- Quality-gate manifest: `tasks/ship-manifest-2026-06-08-skills-showcase-pack-counts.md`.

- [ ] On drawer close, collapse all cards onto the single visible top-left-most card (reverse of the fan-out animation on open) before animating the card back into the card pack. Use the visible top-left-most card rather than the absolute first card in the list because the user may have scrolled down before closing the drawer

### Next Step Plan — Drawer Close Visible Top-Left Collapse
- Scope: verify and reconcile the drawer-close backlog item for the prototype pack animation. Current code already contains visible top-left target selection logic in `apps/skills-showcase/src/components/PackOpener.tsx`; the next pass should determine whether the backlog item is stale, partially implemented, or still missing proof.
- Files to inspect first: `apps/skills-showcase/src/components/PackOpener.tsx`, `apps/skills-showcase/src/components/SealedPack.tsx`, `apps/skills-showcase/app/prototype/page.tsx`, `apps/skills-showcase/src/components/prototype-close-sequence.test.tsx`, and any debug/alignment artifacts under `apps/skills-showcase/alignment/` that describe the close sequence.
- Approach: read the existing close phase chain (`closing-collapse` → `closing-apex` → `sheet-exiting` → `card-settling`), verify whether `PackOpener` already collapses to the visible top-left card after scroll, and add or update focused tests only if proof is missing. Keep the scope to close-collapse behavior; do not redesign the full pack drawer.
- Validation: run focused prototype close-sequence tests, app typecheck/build if source changes, a local `/prototype` route check, and `git diff --check`. If the item is already implemented with sufficient tests, mark it complete with review notes instead of changing source.

## Code Review Fixes
> Generated by `/expert-review` on 2026-05-29. Critical and high-priority items resolved 2026-05-29–2026-05-30.

### High (open)
- [ ] [tests/layer4/helpers/disposable-repo.ts:107-126; git-fixture-sync.setup.ts:54-56] `cleanupRepo` runs `gh repo delete ${repoSlug} --yes` with `autoConfirm` hardwired to true and no validation of `repoSlug`; if `getGhUser()` falls back to `"unknown"` it targets `unknown/<name>`. Fix: assert `repoSlug` matches `^[\w.-]+/agentic-skills-bench-[\w.-]+$` and refuse when the user is `"unknown"`; switch to `execFileSync` (no shell).
- [ ] [tests/layer4/helpers/disposable-repo.ts:49-75, 82] `createDisposableRepo` (and the sync setup's `sync-upstream-` clone) create temp dirs via `mkdtempSync` that are never removed — `cleanup()` only deletes the GitHub repo. A 100-run benchmark leaks 100+ cloned repos to disk. Fix: have `cleanup()` also `rmSync` the mkdtemp parent and the upstream clone dir.
- [ ] [tests/harness/bench-persistence.ts:84-101] `findResumeableSession` sorts session dirs (`${skill}-${agent}-${randomUUID8}`) by the random id, not by time, so `--resume` can attach to an arbitrary older session and miscount cost/runs. Fix: sort by manifest `createdAt`/`updatedAt`, or timestamp-prefix the dir names.

## Active — Claude Last-24h Usage Feedback

- [x] Capture `$analyze-sessions` invocation prompt history.
- [x] Parse full available Claude history for the last 24 hours.
- [x] Inspect available Claude metadata for subagent, parallel-session, context, skill, and usage signals.
- [x] Produce `alignment/analyze-sessions-claude-usage-feedback.html`.
- [x] Record validation and final recommendation notes.

### Add-On Plan — Claude Usage Cost Translation

- [x] Verify whether local Claude logs expose direct billed or estimated cost fields for the report window.
- [x] Verify a current provider pricing table before estimating cost from tokens.
- [x] Update `alignment/analyze-sessions-claude-usage-feedback.html` with actual-cost availability, estimated API-equivalent cost, formula assumptions, and cost breakdowns.
- [x] Validate the edited HTML and record review notes.

#### Review Notes — Claude Usage Cost Translation

- Local Claude logs for the report window reproduced the original report totals exactly: 4,490 usage records and 206,983,852 raw transcript tokens.
- No direct local invoice, subscription, credit, CCU, or dashboard dollar fields were found for the report window, so the HTML now labels actual billed cost as unavailable.
- Added an estimated API-equivalent cost of $517.90 using Anthropic Claude API pricing verified on 2026-06-10: $477.21 for `claude-fable-5` and $40.68 for `claude-opus-4-6`.
- Added model, token-class, and top-project cost breakdowns, plus caveats excluding managed-agent runtime, subscription-plan effects, private discounts, dashboard weighting, and provider-side adjustments.
- Validation passed: structural HTML smoke for required cost text, feedback controls, review gates, compile section, table count, and no embeds; targeted `rg` checks for cost/source language; and `git diff --check` on the touched files.

### Review Notes — Claude Last-24h Usage Feedback
- Confirmed the pasted Claude usage panel directionally from local logs, with an explicit caveat that provider-side dashboard weighting is not available locally.
- Parsed `~/.claude/history.jsonl`, `~/.claude/projects/**/*.jsonl`, `~/.claude/projects/**/subagents/**/*.meta.json`, workflow journals, and `~/.claude/sessions/*.json`.
- Key local findings: sessions with any subagent account for 67.6% raw token volume and 75.0% with a 0.1 cache-read weight; workflow-subagent is 14.3% raw; `Explore` is 4.4%, `general-purpose` 2.8%, and `Plan` 1.9%; high-context usage is 35.7% raw and 22.7% with a 0.1 cache-read weight.
- Highest-impact recommendation: tighten workflow/deep-research fan-out with explicit depth modes, source/extractor/verifier caps, and a preview before spawning broad subagent sets.
- Best new-skill candidate: a personal `project-portfolio-status` / GitHub portfolio status skill, kept out of general shared skills because the last-24h prompt explicitly framed it as personal to this user.
- Produced and indexed the review page at `alignment/analyze-sessions-claude-usage-feedback.html`.
- Validation passed: HTML parser smoke for the new page and `alignment/index.html`; targeted `rg` checks for category, alignment status, compile controls, and index link; structural count check for gates/feedback/tables/no embeds/viewport; `git diff --check`.
- Browser open status: `node scripts/open-html-page.mjs alignment/analyze-sessions-claude-usage-feedback.html --browser auto` returned `blocked`; artifact verification still passed.
