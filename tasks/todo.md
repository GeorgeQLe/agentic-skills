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
- [ ] Commit and push intended changes.

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
