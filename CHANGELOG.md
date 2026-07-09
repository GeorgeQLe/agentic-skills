# Changelog

Public package-level changelog for the `skillpacks` npm package and its scoped alias package `@glexcorp/gskp`.

This file tracks npm package releases: CLI behavior, package contents, bundled skill snapshots, and release-process changes. Individual skills keep their own `CHANGELOG.md` files next to each `SKILL.md`; those files remain the source of truth for skill-specific behavior changes.

Keep this file updated before every npm package publish.

## [Unreleased]

### Changed

- Added `skillpacks cleanup` as the preferred command for deprecated skillpacks state cleanup; `uninstall-global` remains as a compatibility alias.
- Extended cleanup to remove Build-In-Public project config keys (`alignment.build_in_public`, `alignment.bip_platforms`, and `alignment.bip_prompt_dismissed`) from discovered projects while preserving unrelated alignment settings.
- Added a canary npm release lane to `publish.sh` with explicit `--tag` and `--preid` options, prerelease/latest guardrails, tag-aware `--current` recovery, and tag-aware published-package verification for both `skillpacks` and `@glexcorp/gskp`.
- Documented experimental package usage through `skillpacks@experimental` and `@glexcorp/gskp@experimental`, plus dist-tag parity validation.
- Added a `publish-canary` post-sync command helper that prints the experimental canary release checklist.

### Fixed

- Fixed published-package verification for non-`latest` dist-tags by resolving metadata from `package@dist-tag` and checking the dist-tag pointer separately.
- Fixed `doctor` so an empty project config left after removing all managed installs does not report missing convention docs as drift.

## [0.1.20] - 2026-07-02

Prepared for the next publish attempt for both `skillpacks` and `@glexcorp/gskp`.

Release-state note: npm currently reports both package names at `0.1.19`. Source `packages/skillpacks/package.json` remains at `0.1.19`; the intended real release command is a later `./publish.sh patch`, which will bump the package artifact to `0.1.20` before staging and publishing both npm package names.

### Added

- Added the `research-amend` base skill for bounded, alignment-gated amendments to approved canonical research artifacts.
- Added managed shared convention resolver docs and generated short `ALIGNMENT-PAGE.md` resolver stubs across active skills so package installs resolve current conventions from bundled shared assets instead of carrying duplicated long-form convention text.
- Added Pattern A research-loop self-routing coverage for compiled YAML handoffs where the YAML itself carries the parent command and `agent_routing.command`.
- Added full-history skill-usage audit evidence and session-triage handoff contract documentation for follow-up session analysis work.

### Changed

- Moved canonical base skills under `packs/base/{claude,codex}` while preserving base-skill install/runtime semantics, base scope metadata, and legacy marker cleanup compatibility.
- Updated Pattern A research orchestrators and framework subskills so pending review gates end with `## Next Work` only; users review the page, clear context, and paste the compiled YAML into a fresh session rather than copying a duplicate terminal command block.
- Normalized Codex shipping/planning next-step routing so imported Claude slash routes resolve to Codex `$...` commands unless the next action is explicitly a cross-agent handoff.
- Tightened interrogation-page depth ownership: agents own follow-up depth, route unknowns correctly, and cannot pass the confidence gate on shallow "covered or waived" alignment.
- Hardened post-UAT product-design routing so one approved prototype no longer implies consolidation while approved variants remain unbuilt or UAT evidence is missing.
- Made alignment gate metadata explicit in generated alignment bundles so approval cannot pass without an explicit gate outcome.
- Updated this source repository's agent instructions to forbid `skillpacks install` / `init` / `which` commands here; skills must be used from in-tree sources or refreshed runtime copies in this repo.
- Reclassified `research-amend` as an analysis skill and tightened `youtube-meta-research` staged-research lifecycle wording so active skill metadata matches lifecycle audits.
- Updated publish-blocking audit scripts to recognize intentional platform version drift, normalize platform-specific refresh guidance, and assert the current `ship-end` routing contract.
- Refreshed generated package manifest and public skills-catalog export metadata against the current source tree.

### Fixed

- Fixed YAML-only design handoffs so chunked design-tree progress uses compiled YAML as the single copy/paste routing artifact.
- Fixed Build-In-Public guidance so prompting is non-blocking, post-approval output is standardized, and UAT pack availability is checked before recommending UAT routes.
- Reconciled task routing docs and active task state after the shared-convention and research-amend work.
- Fixed session-triage evidence path handling so handoffs target canonical skill sources, resolve cross-directory files, and keep evidence paths locatable.
- Fixed `ux-variations` assemble-stop routing so assemble/approval flows do not collide with alignment-page `Pre-approval stop` gates.
- Fixed generated compiled YAML for overall-history alignment output so embedded newlines are real YAML newlines.
- Fixed focused product-design flow-tree regression coverage to read base skills from `packs/base/{claude,codex}`.

### Verification

- Registry readiness confirmed both package names still report latest `0.1.19`: `npm view skillpacks version` and `npm view @glexcorp/gskp version`.
- Package Node tests passed: `npm --workspace packages/skillpacks run test:node` (178/178).
- Package verification passed: `npm run skillpacks:verify` (411 active skills, 42 packs, 383 tracked convention bundles, manifest check, package staging boundary check, and `npm pack ./build --dry-run`).
- Skills catalog export verification passed after regenerating export metadata: `npm run exports:check`.
- Pattern A handoff audit passed: `bash scripts/skill-research-loop-handoff-audit.sh`.
- Mirror parity audit passed after documenting intentional platform version drift and normalizing refresh guidance: `bash scripts/skill-mirror-parity-audit.sh --verbose`.
- Research-ish lifecycle audit passed after the `research-amend` and `youtube-meta-research` fixes: `node scripts/researchish-skill-lifecycle-audit.mjs`.
- Focused layer1 regression coverage passed: `pnpm --dir tests exec vitest run --project layer1 frontmatter install routing-graph pack-skill-mirror-parity skill-install-routing-audit skill-alignment-routing-audit researchish-skill-lifecycle-audit alignment-gates interrogation-confidence-gate product-design-flow-tree post-uat-consolidation-routing` (1730/1730).
- Skill archive audit passed: `bash scripts/skill-archive-audit.sh --strict` (411 skills checked, 0 violations).
- Task-doc audit passed after converting publish-readiness checklist items to review evidence: `node scripts/audit-task-docs.mjs`.
- Diff hygiene passed: `git diff --check`.

## [0.1.19] - 2026-07-02

Prepared for the next publish attempt for both `skillpacks` and `@glexcorp/gskp`.

Release-state note: source `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` remain at `0.1.18`; the intended real release command is a later `./publish.sh patch`, which will bump the package artifact to `0.1.19` before staging and publishing both npm package names.

### Added

- Added mirrored `youtube-meta-research` skills for Claude and Codex, plus `$youtube --meta <channel>` routing for current public YouTube meta, breakout, and opportunity research.

### Changed

- Reconciled rapid deck graduation routes so VARD and ORD ship through their traction phases before graduating into Business AFPS or Devtool AFPS.
- Added the product-design Platform Fit Workshop and flow-tree schema support for platform ranking plus thin platform probes before production platform lock.
- Tightened design-tree clean-context handoff wording so optional `## Invoke With YAML` blocks are pasted only into a fresh/clean context alongside the repeated command.
- Refreshed generated package manifest and public skills-catalog export metadata against the current source tree.

### Fixed

- Updated package/catalog fingerprints, generated source commit metadata, skill versions, content hashes, and archive-version lists after the post-`0.1.18` skill changes.

### Verification

- Package Node tests passed: `npm --workspace packages/skillpacks run test:node` (176/176).
- Package verification passed: `npm run skillpacks:verify` (413 active skills, 42 packs, manifest check, package staging boundary check, and `npm pack ./build --dry-run`).
- Skills catalog export verification passed: `npm run exports:check`.
- Design-tree bundle check passed: `node scripts/upgrade-design-tree-loop.mjs --check` (22 skills checked, 0 writes).
- Skill archive audit passed: `bash scripts/skill-archive-audit.sh --strict` (413 skills checked, 0 violations).
- Diff hygiene passed: `git diff --check`.
- Source package version remained `0.1.18`; `./publish.sh --dry-run patch` was not run in this release-prep pass because npm auth and publish-state checks are intentionally out of scope.

## [0.1.14] - 2026-06-28

Prepared for publish for both `skillpacks` and `@glexcorp/gskp`.

Release-state note: `0.1.14` was published for both package names on 2026-06-28. Source `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` are committed at `0.1.14`; release-process fixes made after npm publication are tracked in `[Unreleased]`.

### Added

- Added the product-design `eval-ideas` orchestrator, bridging `brainstorm` output into ranked feature candidates and concrete `feature-interview` / `roadmap` handoffs.
- Added Codex base-skill mirrors for `fork-idea-branch`, `autoresearch`, and `autoresearch-prep`, with package metadata and Skills Showcase data refreshed so Codex installs see the new base coverage.
- Added fleet-mode Build-In-Public configuration commands: `skillpacks set-bip <on|off|unset> --all` plus `--all --dry-run` to preview planned `.agents/project.json` changes and unsafe project-config issues before mutation.
- Added an alignment/interrogation YAML routing benchmark scenario for fresh-session handoffs, including scenario listing, run-context plumbing, hard assertions, and runner infrastructure classification.
- Added required `Apply recommended` controls to interrogation open-question blocks and updated the interrogation-page admin skill/auditor to preserve and enforce the new marker.

### Changed

- Product-design flow contracts now use surface/channel terminology across the design tree: `user-flow-map` maps surfaces instead of UI-only screens/routes, `ui-interview` consumes those surfaces while owning only human-visible UI candidates, and downstream `logic-wiring` / `spec-interview` contracts consume route/screen realizations and non-visual channel behavior.
- Flow-tree and product-design handoffs now route build work through `logic-wiring` consistently: active `user-flow-map` guidance initializes schema `v0.4`, keeps `prototype_build_plan` as artifact vocabulary, and no longer emits stale `/prototype` or `$prototype` build-plan commands.
- Design-tree loop bundles now append an optional terminal-only human-review recap prompt after chunked `## Invoke With YAML` handoffs.
- Alignment and interrogation YAML snippets now begin with `# Invoke with: <resolved command>` while preserving the root `command` key as the authoritative machine-readable route.
- The mirror parity audit now covers base Claude/Codex skills in addition to pack skills, with narrow allowances for known intentional drift.
- The one-time BIP suggestion gate now appears in `idea-scope-brief` and `ship-end`, with supporting `scripts/pack.sh set-bip-prompt` controls.

### Fixed

- `skillpacks install <skill>` now treats already-current individual skill installs as a no-op: it prints `Skill already installed!`, skips reload/fresh-session guidance, and leaves project-local config and skill roots unchanged.
- Published-package verification cleanup now handles an empty temp-directory list under `set -u`, fixing the stale-metadata retry smoke path on macOS Bash.
- `publish.sh` now restores source package metadata when a real publish run fails before the first `npm publish` starts, so npm auth preflight failures no longer leave a retry-blocking `0.1.14` bump in the tracked tree.
- Refreshed the package manifest source fingerprint and active `user-flow-map` content hashes after the latest `logic-wiring` route-proof wording changes.
- Corrected the package changelog's stale `0.1.13` heading/release-state/verification wording so the prior release matches the actually published npm version.

### Verification

- Post-publish registry check confirmed `skillpacks@0.1.14` and `@glexcorp/gskp@0.1.14` both resolve on npm.
- Pre-publish registry readiness check confirmed `skillpacks` and `@glexcorp/gskp` both reported latest `0.1.13`, and `0.1.14` was not present for either package name.
- Package Node tests passed: `npm --workspace packages/skillpacks run test:node` (150/150) after the verifier cleanup fix.
- Publish recovery regression passed: `node --test packages/skillpacks/test/publish-recovery.test.mjs` (4/4), including real-run auth preflight failure rollback before the first publish command.
- Package verification passed: `npm run skillpacks:verify` (401 active skills, 42 packs, manifest check, package staging boundary check, and `npm pack ./build --dry-run`).
- Clean-tree `./publish.sh --dry-run patch` reached npm auth preflight after bumping/building/verifying/staging `0.1.14`, then stopped with npm E401 because this shell is not logged into npm as `glexcorp`; the dry-run cleanup restored source package metadata to `0.1.13`.

## [0.1.13] - 2026-06-26

Prepared for publish for both `skillpacks` and `@glexcorp/gskp`.

Release-state note: source `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` intentionally remained at the last published version, `0.1.13`, after this release was published.

### Added

- Added the product-design `key-moments` skill — a proof-priority ranking trunk that orders flows, gates variation breadth, and promotes/prunes branches by writing the existing flow-tree ordering fields.
- Added the product-design `build-ui-screens` skill — a visual UI screen builder that runs an ordered element-batch loop with a per-batch visual checkpoint, honors a minimum-UI stop, and records each batch to `build_ledger[]`.
- Added the product-design `logic-wiring` skill — wires the built screens to be clickable and state-backed.
- Extended the flow-tree schema to v0.4: `build_ledger[]` (plus `build_ledger_status`), `cherry_pick_candidate`, per-screen `model_ref`, and the `parked` status.
- Added deprecated compatibility aliases `prototype` → `logic-wiring` and `create-ui-experiment` → `build-ui-screens`. They remain installable for one transition period and are now marked in `dist/skillpacks-manifest.json` with `deprecated` / `replaced_by` metadata (every manifest skill entry now carries uniform `deprecated`/`replaced_by` fields, `false`/`null` for live skills).
- Added the social-ledger / public-archive system and social channel conventions, bundled as new published `assets/`.
- Added deterministic design-tree branch-order metadata, sample coverage, and flow-tree contract tests for user-flow and UX-variation branch selection.
- Added published-package stale-metadata retry coverage so release verification proves bounded npm registry propagation handling.
- Added `skillpacks list --skills` (flat installable-skill listing) and `skillpacks list --tree` (packs with nested skills, plus a base group), both manifest-backed and annotating deprecated aliases with their `replaced_by` target.
- Added the `/upgrade-interrogation-pages` batch admin skill (new `interrogation-page-admin` pack, claude + codex mirrors) — a sibling of `/upgrade-alignment-pages` that audits generated `interrogation/*.html` round pages against the current interrogation-page standard and, on explicit `--apply`, archives and rewrites stale pages while preserving page-specific content (authoring the now-required `data-recommended-answer` / `data-agent-confidence` helpers), with a `tasks/todo.md` batch handoff when more than two pages need upgrade.

### Changed

- Re-cut the product-design build leaf into `build-ui-screens` → `logic-wiring`, and routed the step-4 design-tree token `prototype` → `logic-wiring` while keeping the fixed 6-step tuple. ("prototype" is retained as artifact/phase vocabulary.) Related skill bumps: `state-model` v0.9 (JIT-per-promoted-flow model build plus fast-pass fold), `ui-interview` v0.28 (authors a per-screen batch plan), and `consolidate-prototypes` v0.18 (two-stage stitch and converge).
- Removed the agent-facing `pack` skill (its guided-setup behavior migrated into `init-agentic-skills`).
- Added a task-doc routing audit system: new `scripts/audit-task-docs.mjs` plus tightened `ship` (v0.8), `ship-end` (v0.6), and `reconcile-dev-docs` (v0.3) contracts — current-task-only next-work routing, an explicit pack-install artifact boundary (`.agents/project.json` is tracked repo config while generated `.claude`/`.codex` skill roots are never committed), and a gate that blocks next-work routing until the task-doc audit passes.
- Added a final-handoff verification guard: `create-alignment-page` v0.2 only authorizes writing canonical artifacts from a `approval_status: ready-for-agent-review` YAML payload with no unresolved negative/clarification feedback (a ready-for-agent-review payload also resumes the loop), with new final-handoff fixture coverage in `scripts/skill-alignment-routing-audit.mjs`.
- `brainstorm` now defaults to an HTML interrogation→alignment idea-hub (with a `--quick` legacy path); interrogation pages gained recommended-answer and agent-confidence markers; added a build-in-public alignment mode.
- Product-design bundled skills route UI work through a clearer tree: `user-flow-map` orders branches by journey, `ux-variations` resolves child branches deterministically, and `ui-interview` remains non-buildout by default.
- Design-tree loop bundles now make clear-and-continue session handoffs actionable and include a one-time single-session tradeoff note.
- Alignment-page bundles now explicitly route review, section feedback YAML, and final approval YAML back to the producing skill context.
- Interrogation-page bundles now clarify when open-answer claims are validated during compiled-answer consumption versus deferred to downstream research.
- The interrogation-page convention gained a resume-time conformance upgrade clause: when a producing skill resumes at an existing unconsumed `review` round page that predates the open-question marker standard, it archives and rewrites that current-step page to the current standard in-flow (preserving page-specific content), and the Archiving rule now covers a convention/standard change. Regenerated all 20 participating `INTERROGATION-PAGE.md` bundles.
- `afps-status`, `brainstorm`, `session-triage`, and exec-loop routing contracts now include the latest downstream-skill availability gates and product-design pack routing guards.

### Fixed

- Published-package verification now polls npm metadata with `--prefer-online` before failing, so `./publish.sh patch` can tolerate bounded registry propagation lag after a successful publish without weakening version, dist-tag, license, or versions-list checks.
- `skillpacks refresh --all --dry-run` now prints final unsafe reasons when its summary says `Safe to run: no`, including legacy user-home installs and dry-run planning failures.
- `skillpacks uninstall-global --dry-run` now previews legacy global cleanup, and `skillpacks uninstall-global --reinstall-base --dry-run` previews project-local base-skill migration without mutating global skills or project files.
- Product-design `state-model` contracts now use the correct `model_tree_ref` / `state_tree_path` references consistently.
- `skillpacks install` / `remove` now append a `Did you mean: …?` suggestion to the unknown pack/skill error, ranking the closest pack and installable-skill names by substring match and a small edit-distance pass so single-character typos and transpositions are caught. Install stays suggest-only (never auto-installs a guess); remove keeps its existing single-match auto-resolve.

### Verification

- Publish-prep verification passed in source from a clean tree: `build:check` (396 skills, 42 packs, manifest byte-in-sync, staging boundary OK), `test:node` 142/142 including the new manifest deprecation-metadata test, the install/remove `Did you mean` suggestion tests, the `list --skills`/`list --tree` formatter tests, and the published-package stale-metadata retry tests. Full `tests/layer1` stayed green (2430 tests across 65 files), including the new `upgrade-interrogation-pages` mirrored-contract test and the regenerated interrogation-bundle drift gate.
- This `[0.1.13]` section reconciles the full post-`v0.1.11` net end-state, including the flow-walk UI refactor (`build-ui-screens` / `logic-wiring` / `key-moments`, flow-tree schema v0.4), the social-ledger / public-archive system, the task-doc routing audit system, and the final-handoff verification guard.
- The release line skipped the blocked `0.1.12` publication and published `0.1.13` for both package names.

## [0.1.11] - 2026-06-23

Prepared for publish for both `skillpacks` and `@glexcorp/gskp`.

Release-state note: source `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` intentionally remain at the last published version, `0.1.10`, so the real `./publish.sh patch` command can bump and publish `0.1.11` from a clean tree.

### Changed

- `skillpacks install` and install-argument resolution now defensively ignore any manifest skill entry whose path is under `archive/**`, preventing stale or malformed manifests from installing archived framework/orchestrator subskills as top-level project skills.
- `skillpacks refresh --all` and `skillpacks refresh --all --dry-run` now flag legacy skillpacks-owned user-home installs under `~/.claude/skills` and `~/.codex/skills`, continue scanning project roots, and exit nonzero with cleanup guidance.
- `skillpacks uninstall-global --reinstall-base` now removes legacy skillpacks-owned user-home installs, then enables and refreshes project-local base skills for discovered `.agents/project.json` roots below the current directory; when none are found, it initializes the current directory.
- `skillpacks uninstall-global` now removes legacy skillpacks-owned user-home installs whose managed markers point at retired `global/claude`, `global/codex`, or pack-era `global` source paths, while still leaving markerless user skills and foreign managed directories untouched.
- `skillpacks refresh` now prints session reload guidance only when project-local skill roots are installed, updated, or removed, and avoids no-op `.agents/project.json` update noise.
- `skillpacks refresh --all` now repeats failed project paths and emitted error messages in the final summary.
- `skillpacks refresh --all --dry-run` now uses a refresh-specific planner with per-project proposed install/update/remove counts, affected skill targets, failures, skipped unmanaged roots, and an aggregate `Safe to run` verdict.

### Verification

- Registry state before release prep confirmed both package names remain published at `0.1.10`.
- Release-prep verification passed in source: package tests, package verification, clean-tree dry-run patch publish, and diff hygiene.
- The intended real release command is `./publish.sh patch`, which will bump the package artifact from `0.1.10` to `0.1.11` before staging and publishing both npm package names.

## [0.1.10] - 2026-06-22

Prepared for publish for both `skillpacks` and `@glexcorp/gskp`.

### Fixed

- Corrected the active `consolidate-prototypes` Claude and Codex contracts so they actually write the AFPS graduation document required by the v0.16 rename/graduation release notes.
- Corrected the active `spec-interview` Claude and Codex prototype gates so production spec work requires the consolidated prototype, AFPS graduation readiness, and no blocking post-prototype cleanup items.

### Changed

- Refreshed the bundled package snapshot and Skills Showcase generated data after the product-design graduation contract correction.

### Verification

- Publish-prep verification passed in source: package tests, package verification, archive/version audits, mirror/base parity audits, generated-data validation, convention bundle audit, and `./publish.sh --dry-run patch`.
- The intended release command is `./publish.sh patch`, which will bump the package artifact from `0.1.9` to `0.1.10` before staging and publishing both npm package names.
- Dry-run note: npm CLI emitted `Cannot read properties of null (reading 'matches')` during `npm version`, but `publish.sh` detected that `0.1.10` was written, continued with verified manifest/package staging, and completed the dry run successfully.

## [0.1.9] - 2026-06-22

Published for both `skillpacks` and `@glexcorp/gskp`.

### Added

- Added product-design convention updates for design-tree HTML-first canonical writes and state-model/UX-variation flow state, including refreshed bundled `DESIGN-TREE-LOOP.md` snapshots.
- Added the interrogation-page convention bundle path, generator, active-skill bundles, and package audit coverage.
- Added the convention-bundle registry and package-gated audit coverage so declared skill convention bundles are checked across source, generated bundles, and npm staging.

### Changed

- Refreshed the bundled skill snapshot after Pattern A research-loop handoff wording, benchmark/self-improvement updates, design-tree/state-model work, interrogation-page convention work, and convention-bundle packaging.
- Hardened publish recovery and dry-run behavior so `./publish.sh --current` supports partial-publish recovery and dry runs prove npm auth/access before a real publish.
- Updated Pattern A review-pending handoffs so `## Next Work` owns review/compile/paste instructions and the command section only names the parent invocation for compiled YAML.

### Verification

- Release gates passed before publish: `npm --workspace packages/skillpacks run test:node`, `npm run skillpacks:verify`, `node scripts/skill-convention-bundle-audit.mjs`, `node scripts/audit-alignment-pages.mjs`, and `node scripts/audit-interrogation-pages.mjs`.
- npm registry checks showed both package `latest` dist-tags still at `0.1.8`, and `skillpacks@0.1.9` / `@glexcorp/gskp@0.1.9` unavailable before publish.
- Post-publish npm metadata confirms both `skillpacks` and `@glexcorp/gskp` latest versions are `0.1.9`.
- Published-package smoke checks passed for `@glexcorp/gskp@0.1.9` via `npx @glexcorp/gskp@0.1.9 list` and for `skillpacks@0.1.9` via clean temp install and `./node_modules/.bin/skillpacks list`.

## [0.1.8] - 2026-06-18

Published for both `skillpacks` and `@glexcorp/gskp`.

### Fixed

- `refresh --all` (and `status --all` / `doctor --all`) now reach projects nested under a scan root that is itself a project. `discoverProjectRoots` previously returned immediately when the scan root contained a `.agents/project.json`, pruning the entire subtree and reporting "1 project(s)". The root is still recorded, but discovery now keeps descending from depth 0; discovered *child* projects (depth > 0) still absorb their own nested directories.

### Changed

- Refreshed the bundled package snapshot. `user-flow-map` (v0.9 → v1.0, claude + codex) makes its post-approval downstream handoff fresh-session aware: when the compiled approval YAML is consumed in an already-fresh session (the page-building conversation is no longer in context), the skill no longer prompts another context clear — it defaults to continue-now and enters the next skill's own required gates. This is driven by a new **Fresh-session handoff** rule in the shared alignment-page convention, which is bundled into every skill's `ALIGNMENT-PAGE.md` snapshot.

## [0.1.7] - 2026-06-18

Published for both `skillpacks` and `@glexcorp/gskp`.

### Changed

- Refreshed the bundled package snapshot. Pattern A research orchestrators (`competitive-analysis`, `customer-discovery`, `positioning`, `journey-map`) and their framework subskills now use a `## Continue In A Fresh Session` review-step handoff in place of `## Recommended Next Command After Compiling YAML`: review pages instruct the user to compile the bottom YAML and paste it into a fresh session, which then emits the real `## Recommended Next Command` after writing the artifact.

### Verification

- npm metadata confirms `skillpacks@0.1.7` and `@glexcorp/gskp@0.1.7` are both published with latest dist-tag `0.1.7`. The release run's `verify:published` reported a transient registry-propagation lag for the scoped alias immediately after publish; a re-check shows both packages at version parity.

## [0.1.6] - 2026-06-17

Published for both `skillpacks` and `@glexcorp/gskp`.

### Changed

- Refreshed the bundled package snapshot after release-process, prompt-history, skill parity, and routing-contract updates.
- Restored same-version npm release parity for the canonical package and scoped alias.

### Verification

- Published-package verification passed for `skillpacks@0.1.6` and `@glexcorp/gskp@0.1.6`, including metadata, install, remove, pin/unpin, deck install, and unsupported direct version syntax smoke checks.

## [0.1.5] - 2026-06-16

Published for `skillpacks`. No matching `@glexcorp/gskp@0.1.5` publication is present in npm metadata as of 2026-06-17; the scoped alias latest remains `0.1.4`.

### Fixed

- Prevented `skillpacks refresh` and pack installs from creating top-level duplicate roots for nested framework skills. Nested framework skills remain available inside their parent orchestrator directories, while only installable parent skills become top-level managed roots.
- Added refresh pruning for old repo-managed duplicate framework roots created by earlier package versions, while preserving unmanaged local directories.

### Changed

- Tightened npm package boundaries so the tarball includes runtime files, base skills, packs, alignment runtime assets, README, and license, but excludes repository docs, task files, prompts, app sources, tests, `AGENTS.md`, and `CLAUDE.md`.
- Moved the packaged alignment-page convention fallback to `assets/alignment-page-convention.md` while preserving source-checkout behavior that reads `docs/alignment-page-convention.md`.

### Verification

- Published-package verification confirmed `skillpacks@0.1.5` as npm latest, passed package smoke tests, and reproduced the duplicate-framework bug on `0.1.4` before confirming it was fixed on `0.1.5`.
- First git release tag created: `v0.1.5`.

## [0.1.4] - 2026-06-16

Published for both `skillpacks` and `@glexcorp/gskp`.

### Added

- Added version-aware CLI status output for human-facing commands, including latest-version availability.
- Added install/update/no-op lifecycle messages that distinguish fresh installs, updates, and unchanged managed roots.
- Added tests for update-check formatting, lifecycle output, and current-version publish flow.

### Changed

- Added `publish.sh --current` support so release publishing can preserve an already-committed package/manifest version instead of always running a new version bump.

## [0.1.3] - 2026-06-15

Published for both `skillpacks` and `@glexcorp/gskp`.

### Changed

- Refreshed the bundled skill and documentation snapshot after several workflow-contract updates.
- Included package-visible documentation updates such as the prototype session loop convention in the release snapshot.
- Continued the dual-package release line for `skillpacks` and `@glexcorp/gskp`.

### Notes

- Registry metadata for this release points at commit `dbcb3204`, which is a documentation-only commit. No distinct package-specific CLI source change was identified for this version beyond the bundled snapshot update.

## [0.1.2] - 2026-06-13

Published for both `skillpacks` and `@glexcorp/gskp`.

### Added

- Added dual npm publish automation so `skillpacks` and `@glexcorp/gskp` can be staged and published from the same built artifact at the same version.
- Added `gskp` as a supported binary alias alongside `skillpacks`.

### Changed

- Rebranded user-facing package docs around `gSkillPacks` / `gskp` while keeping `skillpacks` as the primary npm package.
- Renamed packaged `global/` skill roots to `base/` and continued the move from user-home global installs toward project-local base skills.
- Shipped Node-doctor parity and related package metadata refreshes to npm users.

## [0.1.1] - 2026-06-12

Published for `skillpacks`. `@glexcorp/gskp@0.1.1` was published on 2026-06-13 when the scoped alias line was introduced.

### Added

- Added project-local base initialization through the npm CLI.
- Added exact skill resolution for installs.
- Added published-package verification tooling.
- Added npm prepublish auth/version guard wiring for future real publishes.

### Fixed

- Included required CLI module and alignment-page runtime files in the package boundary after validation found missing release contents.
- Refreshed package manifest artifacts for the `0.1.1` release snapshot.

## [0.1.0] - 2026-06-10

Published for `skillpacks` only. The scoped alias package did not exist yet.

### Added

- Initial public npm package release.
- Packaged the markdown skill library, base install support, project-local pack installation, individual skill installation, deck installation, refresh, doctor, and status workflows.
- Published MIT package metadata, GitHub repository links, README, license, package manifest, base skills, packs, and runtime scripts.
- Added post-publish smoke verification for fresh temp-project installs from npm.

### Notes

- `skillpack` singular is unrelated; this project uses `skillpacks` plural and the later scoped alias `@glexcorp/gskp`.
