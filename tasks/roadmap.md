## Roadmap Usage Note - 2026-06-23

`tasks/todo.md` is the current execution contract. This roadmap contains strategic plans plus historical reverse-chronological implementation notes. Only a single `Current Implementation` section may appear here during active execution, and it must match the task explicitly promoted into `tasks/todo.md`; historical notes use `Historical Implementation` or `Previous Implementation` headings.

## Historical Implementation - Dogfood Create Briefing Slides 2026-07-05

### Goal

Generate a self-contained briefing deck that explains the `create-briefing-slides` skill and the shared briefing-slides convention while using the deck-first, linked-reference workflow the skill prescribes.

### Plan

- [x] Capture the visible skill invocation under `prompts/create-briefing-slides/`.
- [x] Create `briefing-slides/create-briefing-slides.html` with slide navigation, review controls, reference links, and YAML compilation.
- [x] Verify deck text, repo-local reference links, diff hygiene, and opener behavior.
- [x] Record review results in task docs, then commit and push intended changes.

### Acceptance Criteria

- The only opened artifact is `briefing-slides/create-briefing-slides.html`.
- The deck links, but does not embed or auto-open, `packs/base/codex/create-briefing-slides/SKILL.md`, `docs/briefing-slides-convention.md`, and `packs/base/codex/create-briefing-slides/agents/openai.yaml`.
- The deck includes previous/next controls, keyboard navigation, slide counter/progress, print CSS, reference chips, gate controls, slide feedback, annotations, marking controls, YAML compiler, and clipboard fallback.
- Verification confirms repo-local references exist and `git diff --check` passes.

### Review

Created `briefing-slides/create-briefing-slides.html` as a self-contained deck that explains the skill problem, artifact model, source/output rules, presentation behavior, review controls, YAML handoff contract, dogfood findings, and references. The deck links the skill source, shared convention, and OpenAI agent metadata as dense references without embedding them.

Verification passed for required deck controls, repo-local reference existence, diff hygiene, task-doc audit after closeout, and source-checkout opener status `opened`.

## Historical Implementation - Briefing Slides Convention 2026-07-05

### Goal

Extract the briefing slide deck standard into a shared convention document and make `create-briefing-slides` reference it like alignment and interrogation page skills reference their conventions.

### Plan

- [x] Add canonical `docs/briefing-slides-convention.md`.
- [x] Register and package the `briefing-slides` convention.
- [x] Update Codex and Claude `create-briefing-slides` mirrors to declare and reference the shared convention.
- [x] Regenerate package/catalog metadata.
- [x] Run targeted convention, manifest, export, package, task-doc, and diff checks.

### Acceptance Criteria

- `create-briefing-slides` no longer carries the full slide artifact contract inline.
- `required_conventions: [briefing-slides]` is present in both mirrors.
- Source checkouts can load `docs/briefing-slides-convention.md`; packaged installs include `assets/briefing-slides-convention.md`.
- Package/catalog metadata includes the convention change.

### Review

Extracted the briefing slide deck standard into `docs/briefing-slides-convention.md`, registered it as the `briefing-slides` convention, and packaged it to `assets/briefing-slides-convention.md`. Both `create-briefing-slides` mirrors now declare `required_conventions: [briefing-slides]` and reference the shared resolver instead of carrying the full artifact contract inline. Package manifest and catalog exports were regenerated.

## Historical Implementation - create-briefing-slides Skill 2026-07-05

### Goal

Add a canary-ready base skill named `create-briefing-slides` that creates slide-first HTML briefing decks for interrogation and alignment review artifacts while preserving dense pages as linked references.

### Plan

- [x] Add mirrored Codex and Claude `create-briefing-slides` base skill source directories with version `v0.0`.
- [x] Define the slide deck workflow: source artifact discovery, dense reference preservation, slide structure, navigation, feedback, gate-answer, annotation, copy, and browser-open behavior.
- [x] Update base pack metadata so the new skill is discoverable in the packaged canary.
- [x] Refresh generated package/catalog metadata when required.
- [x] Run targeted validation, archive/version audits, manifest/catalog checks, and diff hygiene.

### Acceptance Criteria

- The skill creates `briefing-slides/<artifact-scope>.html` as the only page agents attempt to open.
- Dense `alignment/*.html`, `interrogation/*.html`, markdown, reports, specs, and source documents remain canonical linked references and are not auto-opened by this skill.
- Deck instructions require PowerPoint-like slide navigation, keyboard controls, progress state, reference links, gate questions, feedback YAML, copy fallback behavior, annotation/marking support, and printable/exportable slide content.
- Codex and Claude mirrors differ only where invocation syntax requires `$create-briefing-slides` versus `/create-briefing-slides`.
- Package metadata checks see the new skill.

### Review

Added the `create-briefing-slides` base skill for Codex and Claude. The skill creates self-contained HTML presentation decks under `briefing-slides/`, treats dense alignment/interrogation/source artifacts as linked references, and requires agents to open only the deck. It also defines slide navigation, review gates, feedback, annotation/marking, copy fallback, YAML routing, archive-before-replace, and verification behavior.

Generated package/catalog metadata now includes the skill, and targeted source audits plus package verification passed.

## Historical Implementation - build-ui-screens Prototype-Plan Handoff 2026-07-05

### Goal

Update `build-ui-screens` so it does not recommend direct `logic-wiring` when the required prototype build plan is missing, then refresh generated and project runtime copies.

### Plan

- [x] Inspect current `build-ui-screens` mirrors, generated copies, task docs, and dirty worktree state.
- [x] Archive both active mirrors at `v0.4`, bump active `SKILL.md` files to `v0.5`, and update changelogs.
- [x] Rewrite `## Next Work` and routing wording so missing prototype build plans route to `user-flow-map --prototype-build-plan`, while direct `logic-wiring` requires a plan item with the approved `ui_experiment_id` or an explicit user-accepted untracked ad hoc bypass.
- [x] Refresh generated/runtime skill copies, including the active pair-app runtime copies through the supported refresh path.
- [x] Run routing, archive, generated bundle, package, and pair-app sanity checks.
- [x] Record verification in `tasks/todo.md`, then commit and push intended changes.

### Acceptance Criteria

- Active Codex and Claude `build-ui-screens` mirrors no longer emit unconditional direct `logic-wiring` as the default next step.
- Both mirrors default to `$user-flow-map --prototype-build-plan [topic]` or `/user-flow-map --prototype-build-plan [topic]` when no valid prototype build plan exists.
- Direct `logic-wiring` remains allowed only when a `design/**/prototype-build-plan-*.md` exists and references the approved `ui_experiment_id`, or when the user explicitly accepts an untracked ad hoc bypass.
- `archive/v0.4/SKILL.md` exists for both mirrors, active versions are `v0.5`, and generated/runtime copies match.
- Pair-app runtime copies contain the corrected handoff and its missing prototype build plan still routes to build-plan synthesis.

## Historical Implementation - Clarify Stable vs Canary Package Language 2026-07-05

### Goal

Clarify public release wording so `skillpacks@latest` remains the normal install channel and `skillpacks@experimental` is clearly a canary prerelease channel for testing unproven package behavior.

### Plan

- [x] Inspect current public docs and `publish-canary` helper output for ambiguous experimental-channel examples.
- [x] Add prominent canary-channel warning language to `scripts/publish-canary-steps.sh`.
- [x] Replace `experimental-skill` placeholder examples with `<pack-or-skill>` and add stable/default install examples.
- [x] Refresh stale README wording that said the canary lane did not exist yet.
- [x] Run the requested helper, text, shell syntax, task-doc, and diff hygiene checks.

### Acceptance Criteria

- `@experimental` is described as a canary prerelease channel for testing only.
- Stable/default examples use plain `npx skillpacks ...` or `npx skillpacks@latest ...`.
- Canary/testing-only examples use `npx skillpacks@experimental ...`.
- Public docs no longer use `experimental-skill` as an example placeholder.

### Review

Updated `scripts/publish-canary-steps.sh`, `docs/release-runbook.md`, `docs/skillpacks-npm-distribution.md`, and `README.md` to distinguish normal `latest` installs from canary `experimental` installs. The change is wording-only; publish behavior and CLI command semantics are unchanged.

Verification passed for canary helper output, targeted text checks, shell syntax, task-doc audit, and diff hygiene.

## Historical Implementation - publish-canary Command 2026-07-05

### Goal

Create a `publish-canary` command that mirrors the existing `publish-skills` command but prints the canary/experimental npm release lane.

### Plan

- [x] Inspect the existing `publish-skills` wrapper and release runbook canary flow.
- [x] Add a canary-specific publishing steps script.
- [x] Update `sync.md` so `/sync` installs `publish-canary` onto `~/.local/bin`.
- [x] Run targeted verification and record the review.

### Acceptance Criteria

- `bash scripts/publish-canary-steps.sh` prints canary release gates, dry-run, publish, dist-tag validation, smoke checks, and recovery commands.
- `sync.md` installs `~/.local/bin/publish-canary` alongside `publish-skills`.
- Existing `publish-skills` behavior remains unchanged.

### Review

Added executable `scripts/publish-canary-steps.sh` and updated `sync.md` to install `publish-canary` alongside `publish-skills` during `/sync`. The stable helper remains unchanged, while the new canary helper prints the experimental prerelease lane, tag validation, smoke checks, recovery, and GA follow-up commands. Updated the changelog for the release-process helper.

Verification passed for shell syntax, canary helper output, temporary wrapper-install simulation, task-doc audit, and diff hygiene.

## Historical Implementation - Fix Nested Archived Skill Copies In Source-Checkout Installs 2026-07-05

### Goal

Fix the source-checkout shell install path so latest managed skill installs never copy nested `archive/` directories from framework subskills, then refresh the reported `vectorfit-redux` install.

### Plan

- [x] Capture the visible prompt under `prompts/investigate/`.
- [x] Inspect `scripts/skill-links.sh`, focused shell installer tests, and package lifecycle coverage.
- [x] Patch `sync_skill_install` copy behavior to exclude `archive/` directories at every depth while preserving pinned archive symlinks.
- [x] Add shell installer coverage for nested framework archives and lifecycle coverage for `positioning/frameworks/category-design`.
- [x] Run focused and package verification.
- [x] Refresh `/Users/georgele/projects/web/dev/vectorfit-redux` with the fixed source-checkout installer and verify no nested archives remain.
- [x] Record review, commit, and push intended changes.

### Acceptance Criteria

- Latest managed installs skip any directory named `archive` at every depth.
- Pinned `archive/<version>` installs remain symlinks.
- `business-research` installs include active framework `SKILL.md` files but no nested framework archives under `customer-discovery` or `positioning`.
- The reported `vectorfit-redux` repo has no nested `positioning/frameworks/*/archive` paths under `.codex/skills` or `.claude/skills`, and no top-level `category-design` skill install.

### Review

Updated `scripts/skill-links.sh` so source-checkout latest managed installs recursively skip nested `archive/` directories while retaining active framework subskills and pinned archive symlinks. Added focused shell installer coverage and lifecycle coverage for `business-research` `positioning/frameworks/category-design`, refreshed the reported `vectorfit-redux` install, and regenerated the stale package manifest metadata required by package gates.

Verification passed for focused layer1 tests, package lifecycle tests, `build:check`, `skillpacks:verify`, task-doc audit, and diff hygiene.

## Historical Implementation - idea-scope-brief Deck Post-Install Routing 2026-07-05

### Goal

Fix `idea-scope-brief` so high-confidence deck recommendations keep deck installation as the sole primary command while also giving the user the exact first post-install workflow command, including the scoped product path when available.

### Plan

- [x] Inspect current `idea-scope-brief` mirrors, deck docs, changelogs, and routing tests.
- [x] Capture the visible investigation prompt under `prompts/investigate/`.
- [x] Archive the current Codex and Claude `idea-scope-brief` skills and bump active versions to `v0.23`.
- [x] Update both mirrors so high-confidence deck handoffs require copy-pasteable post-install command lines as secondary context.
- [x] Update Business AFPS deck docs to name customer discovery as the default first workflow after install.
- [x] Add focused layer1 routing coverage for both mirror syntaxes.
- [x] Refresh generated bundles and run targeted verification.
- [x] Record review, commit, and push intended changes.

### Acceptance Criteria

- `npx skillpacks install-deck <deck>` remains the single primary command for high-confidence canonical deck handoffs.
- Codex handoffs require `After install, start with: $customer-discovery [research/{slug}]` when customer discovery is first and a product path is available.
- Claude handoffs require `After install, start with: /customer-discovery [research/{slug}]` under the same conditions.
- Business AFPS docs identify customer discovery as the default post-install first workflow.
- Archives, changelogs, generated runtime copies, and focused tests are current.

### Review

Updated `idea-scope-brief` so high-confidence deck handoffs keep `npx skillpacks install-deck <deck>` as the sole primary command and require a secondary copy-pasteable `After install, start with: ...` route with the scoped product path when available. Business AFPS docs now identify customer discovery as the default first workflow after install. Added focused layer1 coverage and refreshed package/runtime metadata.

Verification passed for `scripts/pack.sh refresh`, focused layer1 tests, manifest/catalog freshness, archive audit, package verification, task-doc audit, and diff hygiene.

## Historical Implementation - skillpacks Canary Release Lane 2026-07-05

### Goal

Add an npm canary/prerelease lane for `skillpacks` and `@glexcorp/gskp` that publishes both package names in lockstep under an explicit non-`latest` dist-tag, defaulting user-facing canary usage to `experimental` while preserving stable `latest` release behavior.

### Plan

- [x] Extend `publish.sh` with `--tag <dist-tag>` and `--preid <identifier>` options, keeping `latest` as the default tag for stable releases.
- [x] Add release-channel guardrails so prerelease versions cannot publish to `latest`, stable `latest` publishes cannot carry prerelease versions, and both package names always share version and dist-tag.
- [x] Preserve `--current` partial-publish recovery while reusing the intended dist-tag and publishing only the missing package.
- [x] Add focused publish-script tests for canary prerelease publishing, guardrail failures, stable non-`latest` opt-in, dry-run behavior, and canary `--current` recovery.
- [x] Update `docs/release-runbook.md`, `docs/skillpacks-npm-distribution.md`, and `CHANGELOG.md` with canary release commands, validation, and publishing rules.
- [x] Run focused and package-level verification, record the review, then commit and push intended changes.

### Acceptance Criteria

- `./publish.sh --tag experimental --preid experimental prerelease` stages versions such as `0.1.20-experimental.0` and publishes both package names with `--tag experimental`.
- `./publish.sh patch` and other stable release commands continue to publish to `latest` unchanged.
- `./publish.sh` rejects prerelease + `latest` and rejects any `latest` publish whose staged version is a prerelease.
- `--current --tag experimental` recovers a partial canary publish using the experimental dist-tag and only publishes the missing package.
- Docs explain canary usage via `npx skillpacks@experimental ...` and `npx @glexcorp/gskp@experimental ...`, plus dist-tag parity verification.

### Review

Implemented a canary npm release lane for `skillpacks` and `@glexcorp/gskp`. `publish.sh` now accepts `--tag` and `--preid`, keeps stable releases on `latest` by default, rejects prerelease versions on `latest`, publishes both staged packages with the same dist-tag, and verifies published packages against the intended tag. `--current` recovery preserves the release tag and now refuses to recover from a registry state where an existing package version is not assigned to the requested dist-tag.

Updated the published-package verifier to assert `SKILLPACKS_EXPECTED_DIST_TAG`, added focused coverage for canary dry-runs, canary real publishes, latest/prerelease rejection, stable non-latest opt-in, and tag-aware recovery, and documented the canary lane in the release runbook, npm distribution design, and package changelog.

Verification passed:

- `node --test packages/skillpacks/test/publish-recovery.test.mjs`
- `node --test packages/skillpacks/test/prepublish-auth-check.test.mjs`
- `node --test packages/skillpacks/test/verify-published-package.test.mjs`
- `npm --workspace packages/skillpacks run test:node`
- `npm run skillpacks:verify`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Historical Implementation - Deprecated Product-Design Alias Cleanup 2026-07-04

### Goal

Archive deprecated product-design alias skills out of active discovery and extend `skillpacks cleanup` so managed project-local installs of those aliases are removed safely.

### Plan

- [x] Archive active alias skill directories for Claude and Codex under `archive/deprecated-skills/2026-07-product-design-aliases/`.
- [x] Remove active `prototype`, `create-ui-experiment`, and `consolidate-variations` source directories from `packs/product-design`.
- [x] Extend `packages/skillpacks/src/cli/lifecycle.mjs` cleanup to remove managed project-local deprecated alias installs and preserve unmanaged directories.
- [x] Update package lifecycle tests, product-design route tests, and manifest/catalog expectations for replacement skills only.
- [x] Regenerate package manifest/catalog exports if source discovery changes.
- [x] Run focused verification and record results.

### Acceptance Criteria

- `packs/product-design/**` no longer exposes active alias skill directories.
- Generated manifest/catalog exports omit deprecated aliases and retain `build-ui-screens`, `logic-wiring`, and `consolidate-prototypes`.
- `cleanup` and `uninstall-global` remove managed installed alias copies under discovered project `.claude/skills` and `.codex/skills` roots, including dry-run previews.
- Unmanaged directories with those names are left untouched.
- Existing global cleanup, BIP cleanup, and base reinstall behavior remains intact.

### Review

Deprecated product-design alias skill dirs were archived out of active `packs/` discovery, cleanup/uninstall-global now removes managed project-local alias installs with dry-run support, and active route/docs/generated metadata now use `build-ui-screens`, `logic-wiring`, and `consolidate-prototypes`. Focused package, product-design route, archive, generated export, task-doc, skillpacks verify, and diff hygiene checks passed. A broader layer1 run also exposed unrelated existing product-path/base-pack coverage failures that were not folded into this alias cleanup.

## Historical Implementation - Investigate Permission Gate 2026-07-04

### Goal

Amend the `investigate` skill so it explicitly asks the user for permission before implementing any fix.

### Plan

- [x] Capture the visible skill update prompt in `prompts/skill-creator/`.
- [x] Inspect both Codex and Claude `investigate` mirrors, changelog, and archive requirements.
- [x] Archive the current `investigate` skill version and bump the active skill version for the behavior change.
- [x] Add an explicit post-investigation user-approval gate before any implementation path.
- [x] Refresh generated/runtime copies if needed, validate the skill, and run focused repository checks.
- [x] Record the review, commit, and push intended tracked changes.

### Acceptance Criteria

- The active `investigate` skill instructs agents to stop after root-cause/fix-plan discovery and ask the user for permission before editing files or implementing a fix.
- Permission behavior is mirrored for Codex and Claude skill copies.
- Version archive and changelog requirements are satisfied.
- Verification demonstrates the skill metadata and archive state are valid.

### Review

The `investigate` skill now reports the root cause and proposed fix, then asks for explicit user permission before applying patches, editing files, running write-capable generation, or otherwise implementing the fix. Both mirrors are archived at v0.2 and active at v0.3, with refreshed package/catalog artifacts. Verification passed for mirror parity, archive audit, task docs, manifest freshness, catalog exports, full package verification, and diff hygiene.

## Historical Implementation - Analyze Sessions Skill Usage Rates 2026-07-04

### Goal

Update `alignment/analyze-sessions-skill-usage-rates.html` with a reproducible breakdown of skill invocation volume by actor: user-invoked skill commands versus agent-invoked or agent-recommended skill usage.

### Plan

- [x] Capture the visible `$analyze-sessions` prompt in `prompts/analyze-sessions/`.
- [x] Inspect the existing alignment page, session insight memory, and available Claude/Codex history sources.
- [x] Build or run a scriptable parser over the selected history scope to count skill invocation patterns by source and actor.
- [x] Render the results into the requested alignment HTML page, including counting rules, evidence samples, charts/tables, and recommendations.
- [x] Update the alignment index if needed, verify the page, update `.session-insights/`, and record the review in `tasks/todo.md`.

### Review

The actor-split analysis was rendered into `alignment/analyze-sessions-skill-usage-rates.html` and indexed. The reproducible snapshot command is `node scripts/analyze-skill-usage-actors.mjs --cutoff 2026-07-04T20:45:12.007Z`; it confirms 3,215 direct user repo-skill invocations, 9,125 assistant-side contract-load events, 3,747 assistant session-skill pairs, and 1,267 assistant recommendation/use-reference events.

### Acceptance Criteria

- Counts distinguish user-authored `$skill` or `/skill` invocations from agent-authored skill references, handoffs, or recommendations.
- Counts include source coverage and limitations for Claude history, Codex compact prompt history, and Codex rich sessions.
- The alignment page remains self-contained and auditable under the bundled convention.
- No unrelated dirty worktree changes are reverted or absorbed.

## Historical Implementation - Patch Packaged Alignment Audit Missing Shared Lib

### Goal

Fix the packaged `skillpacks alignment pages audit` failure by including the shared collapsing-fill audit helper in the staged npm package and adding package-boundary regression coverage.

### Plan

- [x] Add `scripts/lib/` to the skillpacks package build copy boundary.
- [x] Add `scripts/lib/` to the npm `files` allowlist.
- [x] Assert `scripts/lib/collapsing-fill-audit.mjs` exists in staged package output and packed tarball coverage.
- [x] Rebuild the staged package output after source edits.
- [x] Run alignment audit, packaged alignment audit, focused package tests, dry-run packaging, task-doc audit, and diff hygiene.

### Acceptance Criteria

- `node packages/skillpacks/build/bin/skillpacks.mjs alignment pages audit` no longer fails with `ERR_MODULE_NOT_FOUND`.
- The staged build and npm dry-run include `scripts/lib/collapsing-fill-audit.mjs`.
- No alignment page content or audit logic changes are introduced.

### Review

Verified:

- `node packages/skillpacks/scripts/build-package.mjs` staged `scripts/lib/collapsing-fill-audit.mjs`.
- `node scripts/audit-alignment-pages.mjs` passed.
- `node packages/skillpacks/build/bin/skillpacks.mjs alignment pages audit` passed from the built package.
- `node --test packages/skillpacks/test/alignment.test.mjs` passed: 14 tests.
- `node --test packages/skillpacks/test/package-boundary.test.mjs` passed: 2 tests.
- `npm --workspace packages/skillpacks run pack:dry-run` passed and listed `scripts/lib/collapsing-fill-audit.mjs`.
- `node scripts/audit-task-docs.mjs` passed: 0 failures, 0 warnings.
- `git diff --check` passed.

## Historical Implementation - Refresh Stale Skillpacks Generated Artifacts

### Goal

Fix the failed `build:manifest:check` by regenerating stale generated skillpacks artifacts from the current committed skill source.

### Review

Regenerated the package manifest and catalog exports in the required order, staging the package manifest before export generation. Verification passed for `build:manifest:check`, `build:check`, `exports:check`, `skillpacks:verify`, and diff whitespace hygiene.

## Historical Implementation - Skill Quality Audit Before Publish

### Goal

Run a publish-blocking skill quality audit before `./publish.sh --dry-run patch`, patching any release-impacting skill issues before moving from the clean prep state into publish dry run or real publish.

### Plan

- [x] Confirm clean starting state on `master` and npm latest versions `0.1.19` for both package names.
- [x] Run structural skill audits covering version metadata, broken dependencies, next-step routing, archive history, base parity, and mirror parity.
- [x] Run workflow/routing quality audits covering install, pack, ship-end, research-loop, alignment, and researchish lifecycle contracts.
- [x] Run convention, page, package freshness, and focused layer1 regression checks.
- [x] Patch release-blocking findings only; archive/version `SKILL.md` behavior changes and regenerate package/catalog metadata after patches.
- [x] Rerun final release gates before commit/push and publish dry run.

### Acceptance Criteria

- Critical/High findings are patched before publish dry run.
- Medium findings are patched when they affect installability, routing, package contents, generated metadata, or active skill behavior.
- Package metadata and export artifacts are fresh if any relevant source changes occur.
- Final release gates and dry run pass while npm latest remains `0.1.19` and the next target is `0.1.20`.

### Review

Fixed mirror parity script drift, stale ship-end routing audit expectations, `research-amend` lifecycle classification, `youtube-meta-research` staged-research marker coverage, and a stale `base/` test path. Regenerated package/catalog metadata and recorded the 0.1.20 package changelog boundary. Final dry run remains the post-push release gate.

## Historical Implementation - 0.1.20 Publish Dry-Run Prep

### Goal

Prepare the tracked source tree for the user-run `./publish.sh --dry-run patch` command after the post-`dc317d64b` release-boundary changes.

### Plan

- [x] Regenerate release metadata:
  - `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
  - `node scripts/generate-skills-catalog-export.mjs`
- [x] Update `CHANGELOG.md` `0.1.20` to cover explicit alignment gate metadata, session-triage evidence-path fixes, UX variations assemble-stop handling, repo-local skillpacks install prohibition, and regenerated catalog/package metadata.
- [x] Reconcile `tasks/todo.md` so task-doc audit sees completed review evidence rather than stale unchecked verification items.
- [x] Remove generated untracked `.agents/skillpacks/` runtime docs from the release boundary.
- [x] Run publish-prep verification:
  - `npm --workspace packages/skillpacks run test:node`
  - `npm run skillpacks:verify`
  - `npm run exports:check`
  - `bash scripts/skill-archive-audit.sh --strict`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`

### Acceptance Criteria

- Package manifest and skills catalog exports are regenerated from the current source tree.
- Changelog documents the full release boundary since the last 0.1.20 readiness commit.
- Verification commands pass and npm latest remains `0.1.19` for both package names.
- The tracked tree is clean after commit and push; `.agents/skillpacks/` is not included as a source release artifact.

### Review

Verified:

- `npm --workspace packages/skillpacks run test:node` passed: 178 tests.
- `npm run skillpacks:verify` passed: 411 active skills, 42 packs, 383 tracked convention bundles, package staging boundary check, and package dry-run pack.
- `npm run exports:check` passed and confirmed fresh catalog export artifacts.
- `bash scripts/skill-archive-audit.sh --strict` passed: 411 skills, 0 violations.
- `npm view skillpacks version` and `npm view @glexcorp/gskp version` both reported `0.1.19`.
- `node scripts/audit-task-docs.mjs` passed: 0 failures, 0 warnings.
- `git diff --check` passed.
- Commit and push are the final shipping action after local audits pass.

## Historical Implementation - Uninstall-Global Ownership Investigation

### Goal

Verify and fix the mismatch where a real global Codex skill installed from the local `agentic-skills` checkout is visible to Codex but `npx skillpacks uninstall-global` reports zero removable global installs because the current npm package does not consider that marker source owned.

### Plan

- [x] Capture the investigation prompt and current task state.
- [x] Inspect the actual global and project-local `codebase-status` skill files and install markers.
- [x] Trace CLI ownership/removal logic for `uninstall-global`, including current-package source checks.
- [x] Implement the smallest durable CLI/test change for legacy repo-managed global install cleanup or reporting.
- [x] Run focused package tests plus diff hygiene, then document the review and ship.

### Acceptance Criteria

- Local evidence confirms or corrects each user claim.
- The CLI behavior is no longer misleading for legacy repo-managed global skills created from a local checkout.
- Regression tests cover the legacy marker source case.

### Review

The user's diagnosis was confirmed: the global copy was present and stale, while the npm-run cleanup command only trusted sources owned by the currently executing package/checkout. The fix adds a global-cleanup-only compatibility path for managed marker directories with legacy `agentic-skills`/`skillpacks` source layouts that match the same tool and skill name. Focused lifecycle tests, serialized package Node tests, real-home dry-run, and package build checks passed.

## Historical Implementation - Design-Tree Handoff Verification

### Goal

Add a mandatory pre-final handoff verification step to product-design/product-testing contracts so agents cannot route to `consolidate-prototypes` unless current design-tree artifacts prove consolidation readiness.

### Plan

- [x] Archive and version affected active `SKILL.md` files:
  - `packs/product-testing/{codex,claude}/uat`
  - `packs/product-design/{codex,claude}/logic-wiring`
  - `packs/product-design/{codex,claude}/consolidate-prototypes`
- [x] Add the shared handoff verification classifications and conservative fallback rule to `docs/design-tree-loop-convention.md`.
- [x] Update Codex and Claude `uat`, `logic-wiring`, and `consolidate-prototypes` contracts to run handoff verification immediately before terminal handoff text or `agent_routing`.
- [x] Keep `research/.progress.yaml` scoped to product-path/product-line state and out of UAT/prototype/consolidation readiness storage.
- [x] Extend `tests/layer1/post-uat-consolidation-routing.test.ts` for the new verification contract.
- [x] Run focused verification and record results.

### Acceptance Criteria

- Final handoffs include a compact `Handoff verification: <classification>; ...` readiness line.
- The four classifications are documented and present in both Codex and Claude active contracts.
- Contradictory artifacts conservatively route to manual UAT or the next unresolved approved UX/UI/user-flow branch, never consolidation.
- Tests assert `research/.progress.yaml` is not named as the UAT/prototype/consolidation readiness store.

### Verification Plan

- `pnpm --dir tests exec vitest run --project layer1 layer1/post-uat-consolidation-routing.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`

### Review

Verified:

- `pnpm --dir tests exec vitest run --project layer1 layer1/post-uat-consolidation-routing.test.ts` passed: 5 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 415 skills, 0 violations.
- `git diff --check` passed.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.

## Historical Implementation - Post-UAT Consolidation Routing Fix

### Goal

Fix the product-design/product-testing routing ambiguity that allowed a handoff to imply consolidation was next after only one built prototype. Consolidation should be available only after UAT evidence exists and all approved branches are either evaluated or explicitly excluded/deferred from MVP scope by the user.

### Plan

- [x] Archive and version affected `SKILL.md` files:
  - `packs/product-testing/{codex,claude}/uat`
  - `packs/product-design/{codex,claude}/logic-wiring`
  - `packs/product-design/{codex,claude}/consolidate-prototypes`
- [x] Add UAT post-readiness guard language for result-log categories, manual-evidence capture while any built result is `Not run`, and single-variant MVP override only after explicit user scope choice.
- [x] Remove direct or compressed `logic-wiring` route from prototype approval to consolidation; route only to UAT evidence capture.
- [x] Harden `consolidate-prototypes` against not-ready UAT files, unchecked readiness items, all-`Not run`/deferred evidence, and unbuilt approved branches without explicit user handling.
- [x] Update shared routing docs where they define reusable readiness rules.
- [x] Add regression coverage for Codex and Claude skill contracts, then run focused tests and archive/diff checks.

### Acceptance Criteria

- `logic-wiring` handoffs name UAT as the next step after prototype approval and state consolidation is a later decision owned by evidence plus explicit scope/convergence.
- `uat --variant-evaluation` output categories distinguish built/evaluated, built/not-run, approved-unbuilt/deferred, and explicitly excluded from MVP.
- `consolidate-prototypes` stops when evidence is absent, not-ready, unchecked, all `Not run`, or approved branches are unhandled.
- Shared docs define consolidation readiness as UAT evidence plus explicit handling of unbuilt/deferred approved branches.

### Verification Plan

- `pnpm exec vitest tests/layer1/post-uat-consolidation-routing.test.ts`
- `pnpm exec vitest tests/layer1/product-design-customer-discovery-routing.test.ts tests/layer1/product-testing-customer-discovery-routing.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`

### Review

Verified:

- Root-level `pnpm exec vitest tests/layer1/post-uat-consolidation-routing.test.ts` failed because `vitest` is not installed at the repository root.
- `pnpm --dir tests exec vitest run --project layer1 layer1/post-uat-consolidation-routing.test.ts` passed: 4 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-customer-discovery-routing.test.ts layer1/product-testing-customer-discovery-routing.test.ts` passed: 3 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 415 skills, 0 violations.
- `git diff --check` passed.

## Historical Implementation - Interrogation Agent-Owned Depth Convention

**Status: VERIFIED (2026-07-02) - canonical interrogation convention now makes the agent responsible for depth and shallow-gate prevention.**

### Goal

Make the interrogation-page convention assign interrogation depth to the agent: the agent should recommend/initiate additional rounds when confidence is still shallow, ask permission before extra research, and ask the user directly for ambiguity, decisions, priorities, direction, preferences, and taste.

### Plan

- [x] Update `docs/interrogation-page-convention.md` inside the canonical `interrogation-convention` block.
- [x] Regenerate legacy `INTERROGATION-PAGE.md` bundles from the canonical source with the generator.
- [x] Update focused layer1 coverage for the new agent-owned-depth and unknown-routing contract.
- [x] Run generator drift checks and focused Vitest.
- [x] Record review notes, then commit and push only intended changes.

### Acceptance Criteria

- The convention states that the agent owns depth and should continue rounds when alignment remains too shallow for useful downstream work.
- User agency is preserved when the user requests additional useful rounds.
- Unknowns route correctly: infer from repo/context where possible, ask permission before new external research, and ask the user directly for choices, tradeoffs, goals, direction, preferences, and taste.
- The confidence gate no longer treats covered-or-waived alone as enough when the agent judges alignment shallow.
- Legacy generated bundles and focused tests reflect the same contract.

### Verification Plan

- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --dry-run`
- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --check`
- `node scripts/upgrade-interrogation-page.mjs --dry-run`
- `node scripts/upgrade-interrogation-page.mjs --check`
- `pnpm --dir tests vitest run --project layer1 tests/layer1/interrogation-confidence-gate.test.ts`
- `git diff --check`

### Review

Verified:

- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --dry-run` passed with `Updated: 0`.
- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --check` passed with exact bundles, paths, and resolver stubs.
- `node scripts/upgrade-interrogation-page.mjs --check` passed with exact shared resolver stubs.
- `pnpm --dir tests exec vitest run --project layer1 layer1/interrogation-confidence-gate.test.ts` passed: 43 tests.
- `npm run skillpacks:build` passed. Its manifest side effect was restored because the existing dirty tree would have folded unrelated changes into the package fingerprint.

## Historical Implementation - Remove Review-Pending Invoke With YAML Blocks

**Status: VERIFIED (2026-07-02) - separate review-pending command blocks removed from Pattern A/research-amend handoffs; compiled YAML is the copy/paste artifact.**

### Goal

Remove the separate terminal `## Invoke With YAML` command block from Pattern A review-pending handoffs. Since compiled alignment/interrogation YAML now includes `command` and `agent_routing.command`, users should review the page, clear context, and paste the compiled YAML into a fresh session without copying a separate parent command.

### Plan

- [x] Record the user correction in lessons and task state.
- [x] Update active Pattern A docs, parent orchestrators, framework subskills, and audits to use YAML-only review-gate continuation.
- [x] Preserve post-write `## Recommended Next Command` routing after approved artifacts are written.
- [x] Run focused handoff audits and diff checks.
- [x] Record review and ship intended changes without reverting unrelated dirty work.

### Acceptance Criteria

- Review-pending `## Next Work` text tells the user to paste compiled YAML into a fresh session after clearing context.
- No active Pattern A skill requires a separate `## Invoke With YAML` section for review-pending approval gates.
- Compiled YAML still carries `command` and `agent_routing.command` for parent-owned continuation.
- Post-approval handoffs still use `## Recommended Next Command` after artifacts are written.

### Verification Plan

- `bash scripts/skill-research-loop-handoff-audit.sh`
- `rg` audit for stale review-pending `## Invoke With YAML` wording in active Pattern A docs/skills.
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `bash scripts/skill-research-loop-handoff-audit.sh` passed.
- `pnpm exec vitest run --project layer1 layer1/research-amend-contract.test.ts layer1/alignment-gates.test.ts` passed from `tests/`: 47 tests.
- `node scripts/upgrade-alignment-page.mjs --legacy-bundles --check` passed: 0 updates.
- `node scripts/upgrade-alignment-page.mjs --check` passed: 0 updates.
- Stale-string audit passed for active Pattern A/base docs and skills after excluding archives and changelog history.
- `bash scripts/skill-archive-audit.sh --strict` passed: 415 skills, 0 violations.
- `git diff --check` passed.

Commit note:

- Not committed in this pass because the worktree already contained a large unrelated shared-convention migration and overlapping dirty skill files before this task. Committing now would mix this fix with pre-existing migration work.

## Historical Implementation - Shared Convention Document Migration

**Status: VERIFIED (2026-07-02) - migrated alignment/interrogation skills from duplicated convention bundles to shared resolver-backed stubs.**

### Goal

Replace duplicated per-skill alignment/interrogation convention bundles with shared convention assets referenced by thin skill stubs, while preserving source-checkout, packaged-install, and legacy sibling-bundle compatibility.

### Scope

- Keep canonical convention sources in `docs/alignment-page-convention.md` and `docs/interrogation-page-convention.md`.
- Keep packaged runtime assets in `assets/alignment-page-convention.md` and `assets/interrogation-page-convention.md`.
- Stop default generator writes of full `ALIGNMENT-PAGE.md` / `INTERROGATION-PAGE.md` siblings.
- Preserve legacy sibling bundle fallback during the transition.
- Leave active generated HTML page behavior and audits unchanged.

### Plan

- [x] Inspect current generator, audit, package, and test surfaces.
- [x] Add shared resolver/stub contract to the convention registry and bundle audit.
- [x] Refactor alignment and interrogation generators to write/validate stubs and resolver metadata instead of generated sibling bundles.
- [x] Update focused tests for source resolution, packaged asset resolution, stub validation, legacy fallback, and metadata interpretation.
- [x] Run syntax, layer1, active-page audit, package/build boundary, and diff verification.
- [x] Record review, commit, and push.

### Acceptance Criteria

- Active `SKILL.md` convention sections point to the shared convention resolver and include the expected output path.
- Declared conventions validate through source `docs/*`, packaged `assets/*`, or legacy sibling bundles.
- Per-skill variation remains available from frontmatter/registries.
- Existing installed skills with sibling bundles continue to pass compatibility checks.
- Package output includes the shared convention assets.

### Review

Verified by commit `cd5317cea` and `tasks/ship-manifest-2026-07-02-shared-convention-resolver.md`:

- `node --check scripts/upgrade-alignment-page.mjs && node --check scripts/upgrade-interrogation-page.mjs`
- Focused layer1 migration suites: 122 tests.
- `node scripts/skill-convention-bundle-audit.mjs`
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-interrogation-pages.mjs`
- `node --test packages/skillpacks/test/package-boundary.test.mjs`
- `node --test packages/skillpacks/test/alignment.test.mjs`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Historical Implementation - Research Amend Workflow Integration

**Status: VERIFIED (2026-07-02) - routing guidance integrated, tested, regenerated, and ready to ship.**

### Goal

Document when research workflow handoffs should recommend the base `research-amend` skill instead of a full Pattern A rerun.

### Scope

- Preserve Pattern A approval gates: `review` pages continue to route only through compiled YAML and parent-orchestrator re-invocation.
- Add post-canonical routing guidance for low/medium amendments after approved artifacts are written or from research-health/status contexts.
- Keep high/systemic changes routed to affected framework/synthesis/full Pattern A reruns.
- Keep Claude and Codex command examples platform-correct.

### Plan

- [x] Inspect Pattern A final handoff and research-health routing surfaces for places that currently default to full reruns after small post-canonical corrections.
- [x] Add concise guidance that low/medium post-canonical corrections can route to `research-amend`, while high/systemic changes still route to targeted framework/synthesis/full reruns.
- [x] Update focused tests or audits that cover research-roadmap/reconcile-research/Pattern A next-step routing language.
- [x] Regenerate package/catalog artifacts if any tracked `SKILL.md` or `PACK.md` metadata/content changes.
- [x] Run targeted validation, record review/history, commit, and push.

### Acceptance Criteria

- Research-health or final-handoff guidance recommends `research-amend` for bounded low/medium post-canonical amendments such as one missed competitor or one corrected source fact.
- High/systemic changes still route to affected framework/synthesis reruns or full Pattern A reruns.
- Review-pending alignment pages continue to use approval YAML handling only; downstream `research-amend` recommendations appear only after approved artifacts are written or in research-health/status contexts.
- Codex and Claude command text stays platform-correct.

### Review

Verified:

- Pattern A conventions now state that `research-amend` is post-canonical only and forbidden while a `review` page is pending.
- `research-roadmap` queues `$research-amend`/`/research-amend` for bounded low/medium corrections and preserves full rerun routing for changed ICP/category strategy, broad source staleness, multi-framework conflicts, and re-synthesis needs.
- `reconcile-research` recommends `$research-amend`/`/research-amend` only for isolated low/medium Error/Warning findings; conflict clusters and systemic drift keep rerun routing.
- Focused tests cover platform-correct Codex/Claude command text and high/systemic rerun preservation.
- Generated skillpacks manifest and public catalog exports are refreshed.

## Historical Implementation - YAML-Only Routing Handoff Audit

**Status: VERIFIED (2026-07-02) - duplicate exact-command plus YAML routing removed from active chunked handoff surfaces and stale installed mirrors.**

### Goal

Ensure active chunked skill handoffs use one continuation artifact. If `## Invoke With YAML` is present, the resolved command lives in `command` / `agent_routing.command`, and the YAML is the single copy/paste artifact.

### Scope

- Audit active, non-archived skill sources and generated design-tree loop bundles.
- Patch stale installed `.codex/skills/**` and `.claude/skills/**` mirrors that users may invoke directly.
- Keep allowed historical/archive/changelog text and alignment YAML contracts intact.
- Preserve unrelated dirty work already present in the repository.

### Plan

- [x] Inspect existing dirty work and routing handoff hits.
- [x] Patch stale canonical or installed mirrors that still require `Exact next command` alongside YAML.
- [x] Confirm focused regression coverage blocks duplicate chunked continuation routing.
- [x] Run generator, archive, focused test, diff, and status verification.
- [x] Reconciled as historical follow-up, not active executable work in this task file.

### Acceptance Criteria

- Active generated design-tree loop bundles do not instruct users to copy both a standalone exact command and `## Invoke With YAML`.
- Repeated chunked continuation commands are present in `agent_routing.command`.
- Installed local mirrors under `.codex/skills` and `.claude/skills` match the YAML-only handoff rule for directly invokable skills.

### Verification Plan

- `rg` audit for stale exact-command handoff phrases.
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `bash scripts/skill-archive-audit.sh --strict`
- Focused product-design flow-tree Vitest.
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts -t "YAML as the single copy-paste artifact"` passed from `tests/`.
- Stale phrase audit passed with no hits for duplicate exact-command handoff wording in active scanned surfaces.
- `git diff --check` passed.

Known unrelated residual:

- Full `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` still fails on the existing base-pack migration path because `base/codex/idea-scope-brief/SKILL.md` is missing after base skills moved under `packs/base/...`.

## Historical Implementation - UX Variations YAML-Only Chunked Handoff

**Status: VERIFIED (2026-07-02) - duplicate exact-command plus YAML routing removed from chunked `ux-variations` and sibling `state-model` handoffs.**

### Goal

Make chunked design-tree handoffs use one routing artifact: `## Invoke With YAML` with the resolved continuation command in `agent_routing.command`. Do not also emit a separate freeform "Exact next command" line for the same handoff.

### Scope

- Update the shared design-tree-loop convention.
- Update mirrored `ux-variations` and `state-model` skill contracts and changelogs with archive snapshots.
- Update focused regression coverage so future handoffs preserve the YAML-only routing contract.
- Preserve unrelated dirty work already present in the repository.

### Plan

- [x] Record the user correction in lessons and prompt history.
- [x] Archive active `ux-variations` skill contracts before behavior changes.
- [x] Patch convention and mirrored skill handoff wording.
- [x] Regenerate/check bundled `DESIGN-TREE-LOOP.md` files.
- [x] Run focused regression and archive/diff checks.

### Acceptance Criteria

- [x] Chunked `ux-variations` Progress Handoff Blocks no longer require or emit `Exact next command:`.
- [x] The continuation command is still available in `## Invoke With YAML` / `agent_routing.command`.
- [x] Shared design-tree-loop convention matches the skill contract.
- [x] Focused product-design test coverage enforces the new behavior.

### Review

Verified:

- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts -t "requires progress handoff blocks"` from `tests/` passed.
- Full `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` still fails only on unrelated dirty-tree base migration state: `base/codex/idea-scope-brief/SKILL.md` is missing after base skills were moved under `packs/base/...`.
- `bash scripts/skill-archive-audit.sh --strict` passed.
- `git diff --check` passed.

### Verification Plan

- `node scripts/upgrade-design-tree-loop.mjs`
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` from `tests/`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

## Historical Implementation - Base Pack Nesting Migration

**Status: VERIFIED (2026-07-02) - `packs/base/{claude,codex}` is now the canonical base source layout; `research-amend` remains the next separately shippable change.**

### Goal

Add a base-pack `research-amend` skill that performs bounded post-canonical research adjustments without forcing a full Pattern A research rerun. At the same time, make the base pack live under `packs/base/{claude,codex}` like other packs, while preserving compatibility for existing tooling that still reads `base/{claude,codex}` until migration is complete.

### Scope

- Create mirrored `research-amend` skills for Claude and Codex as a base-pack capability.
- Introduce or migrate the base pack source layout to `packs/base/{claude,codex}`.
- Update package/install/discovery scripts so base skills can be resolved from `packs/base` without breaking existing project-local installs, drift detection, or package builds.
- Keep existing Pattern A research orchestrators intact; `research-amend` complements them instead of replacing first-run research loops.

### Proposed Skill Contract

`research-amend` should handle post-canonical changes such as a missed competitor, corrected pricing/source facts, new customer evidence, or a downstream-impacting correction. The skill should:

- Resolve product path using existing research product-path conventions.
- Locate target canonical research artifacts and related framework intermediates/search logs.
- Classify the requested change as `low`, `medium`, `high`, or `systemic` impact.
- Build a bounded amendment working packet and review alignment page before canonical writes.
- On approval, archive superseded artifacts, patch only affected canonical/intermediate/search-log files, and record an amendment note.
- Route high/systemic impact changes to targeted framework/synthesis reruns or a full Pattern A rerun instead of pretending a small patch is sufficient.

### Impact Ladder

- **Low:** factual correction, source update, typo, one profile detail. Patch canonical artifact and search/evidence log.
- **Medium:** one missed competitor or one new evidence item changes a matrix row, gap, or limited recommendation. Patch affected intermediate(s), canonical synthesis sections, and evidence log.
- **High:** change affects category, strategic map, top recommendations, positioning assumptions, or downstream route. Run affected framework(s), then synthesis.
- **Systemic:** new ICP/category, many missed competitors, stale source base, or invalid original scope. Recommend full Pattern A rerun.

### Implementation Phases

1. **Base-pack layout decision and compatibility**
   - [x] Add `packs/base/PACK.md` and establish `packs/base/{claude,codex}` as the canonical base-pack shape.
   - [x] Move `base/` immediately while preserving legacy managed-marker cleanup for old `base/...` source paths.
   - [x] Update ownership checks, install markers, manifest generation, package build staging, docs, and tests to recognize `packs/base`.

2. **Skill authoring**
   - Create `packs/base/claude/research-amend/SKILL.md` and `packs/base/codex/research-amend/SKILL.md` with `version: v0.0`.
   - Add `CHANGELOG.md` files and `agents/openai.yaml` for Codex metadata if the repo pattern requires it for base-pack skills.
   - Keep the skill concise; put reusable impact-classification details in a one-level reference only if the body grows too large.

3. **Research workflow integration**
   - Document when Pattern A final handoffs, `research-roadmap`, and stale-research queues should recommend `research-amend` instead of a full rerun.
   - Add next-step validity guidance so a single missed competitor defaults to amendment, not full rerun, unless impact classification escalates.
   - Ensure `research-amend` respects staged research approval: working packet and rendered review page before canonical writes.

4. **Packaging and discovery**
   - Update `scripts/pack.sh`, `scripts/skill-links.sh`, package CLI code, manifest/catalog generation, and package staging to install base skills from `packs/base`.
   - Update `npx skillpacks init`, refresh, doctor, which/list, pin/unpin, and drift detection behavior for `packs/base`.
   - Preserve or migrate existing `.agentic-skills-managed` marker handling for installs sourced from legacy `base/`.

5. **Docs and tests**
   - Update `docs/packs.md`, `docs/skills-reference.md`, `docs/skill-invocation-types.md`, and any source-layout docs from top-level `base/` to `packs/base`.
   - Add tests for base-pack discovery, install/init behavior, build-package boundary, manifest/catalog export, route recommendations, archive/version audits, and research-amend impact routing.
   - Update grep/audit scripts that currently scan `base/**/SKILL.md` directly.

### Acceptance Criteria

- `research-amend` exists as a base-pack skill under `packs/base/{claude,codex}/research-amend`.
- `npx skillpacks init` or the source-checkout equivalent installs base skills from `packs/base` into `.claude/skills` and `.codex/skills`.
- `research-amend` can process a single missed competitor as a medium-impact amendment without rerunning every competitive-analysis framework.
- High/systemic amendments explicitly route to affected framework/synthesis/full rerun paths.
- Existing base skills remain discoverable and refreshable after the `packs/base` layout change.
- Public catalog and package manifests include the base pack and the new skill.

### Verification Plan

- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `bash scripts/skill-mirror-parity-audit.sh`
- `bash scripts/skill-install-routing-audit.sh`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- Focused Vitest coverage for base-pack layout, init/refresh/doctor/which behavior, and `research-amend` routing language
- `git diff --check`

### Open Decisions Before Implementation

- Existing `base/` skills were physically moved to `packs/base/` in the base migration. Legacy managed markers pointing at old `base/...` paths remain recognized for cleanup/refresh.
- Whether `research-amend` should be available in both Claude and Codex immediately, or Codex-first with Claude parity in the same shipping boundary.
- Whether amendment notes should live inline in each canonical research file, in `research/amendments.md`, or under `research/{slug}/_working/` plus archive history.

## Historical Implementation - Cross-Agent SKILL.md Convention Audit

**Status: VERIFIED, NOT COMMITTED (2026-07-02) - active skill convention fixes are present, but commit/push is blocked by overlapping base-pack migration changes in the working tree.**

### Goal

Audit active Codex and Claude `SKILL.md` files and fix platform-convention mismatches so Codex skill copies use Codex-facing invocation and tooling language, while Claude skill copies use Claude-facing invocation and tooling language.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for any active `SKILL.md`, tests, and task docs.
- Reason: this is a broad documentation-contract audit across mirrored agent skill sources.
- Safety boundary: exclude archived `SKILL.md` snapshots unless an active generated convention requires regeneration, preserve unrelated dirty package files and prompt logs, and do not introduce GitHub Actions.

### Plan

- [x] Inventory active Codex and Claude `SKILL.md` files and define mismatch patterns.
- [x] Patch clear platform-convention mismatches with minimal edits.
- [x] Run active-skill audits, archive/version checks, diff checks, and status checks.
- [ ] Commit and push intended changes on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] Active Codex `SKILL.md` files do not contain user-facing slash invocation commands where a `$skill` command is intended.
- [x] Active Claude `SKILL.md` files do not contain user-facing dollar invocation commands where a `/skill` command is intended.
- [x] Agent-specific reload/session guidance points at Codex for Codex skills and Claude Code for Claude skills.
- [x] Any changed active `SKILL.md` files follow archive/version/changelog requirements.

### Test Plan

- Targeted active-source grep/audit checks for Codex slash invocations and Claude dollar invocations.
- Targeted grep checks for cross-agent tool/reload wording.
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- Targeted active-source grep checks removed the known bad patterns: Codex `/sync`, Codex `/roadmap`/`/plan-phase`, Codex `/clear` chunk guidance, Claude `$reconcile-dev-docs`, and final-route fallback text that recommended the wrong runner syntax.
- Remaining raw command grep hits were reviewed as intentional target-block text, explicit Claude↔Codex bridge contracts, filesystem/URL route examples, or same-runner command examples.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `node scripts/audit-task-docs.mjs` passed: failures 0, warnings 0.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes after regeneration.
- `npm run skillpacks:build` passed.
- `npm run skillpacks:verify` passed after regenerating stale design-tree-loop bundles.
- `git diff --check` passed.

Commit/push not performed from this session because a large overlapping base-pack migration appeared in the working tree while verification was running (`base/**` deleted, `packs/base/**` added, package/catalog scripts changed, and prompt logs added). The audit edits are present in the current tree, including the migrated `packs/base/codex/provision-agentic-config` copy, but staging them safely requires separating that concurrent migration boundary first.

## Historical Implementation - UAT Pack Availability Guard Handoff

**Status: IN PROGRESS (2026-07-02) - adding plain product-testing install guidance to product-design UAT handoffs.**

### Goal

Update product-design UAT handoffs so routes to `$uat --variant-evaluation` or `/uat --variant-evaluation` give plain install-then-run instructions when `uat` may be unavailable. The guidance must install the providing `product-testing` pack, never the `uat` skill directly, and Codex must mention the fresh-session fallback.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for versioned skills, canonical convention, generated bundles, tests, and task docs.
- Reason: the change touches mirrored product-design skills, generated design-tree-loop bundles, and regression tests.
- Safety boundary: preserve unrelated dirty package files, do not edit generated local skill roots under `.claude/skills` or `.codex/skills`, and do not introduce GitHub Actions.

### Plan

- [x] Record task plan and prompt history for the UAT pack availability guard work.
- [x] Archive and version the four active product-design skills before behavior changes.
- [x] Update `logic-wiring` mirrors with explicit Pack Availability Guard wording and non-bare UAT handoffs.
- [x] Update `consolidate-prototypes` mirrors so missing UAT evidence routes with plain install-then-run guidance.
- [x] Update canonical design-tree loop convention and regenerate generated bundles.
- [x] Add focused product-design flow-tree regression assertions.
- [x] Run targeted tests, generator checks, grep audits, diff checks, and status checks.
- [ ] Commit and push intended changes on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] `logic-wiring` and `consolidate-prototypes` both identify `uat` as provided by `product-testing` when unavailable.
- [x] Codex handoffs include `npx skillpacks install product-testing`, then `$uat --variant-evaluation`, and mention a fresh Codex CLI session fallback.
- [x] Claude handoffs include `npx skillpacks install product-testing`, then `/uat --variant-evaluation`.
- [x] No active updated handoff recommends installing the `uat` skill directly.
- [x] `agent_routing` YAML is not the only human-facing UAT command.
- [x] Changed `SKILL.md` files are archived, versioned, and have changelog entries.

### Test Plan

- `pnpm test -- tests/layer1/product-design-flow-tree.test.ts`
- `pnpm test -- tests/layer1/skill-install-routing-audit.test.ts`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- Targeted `rg` checks for `install it`, `install product-testing if unavailable`, the direct `uat` install command, and bare UAT-only handoff blocks.
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `pnpm test -- tests/layer1/product-design-flow-tree.test.ts` and `pnpm test -- tests/layer1/skill-install-routing-audit.test.ts` from the repo root failed immediately because the repo has no root `test` script and the shell reported `test: --: unexpected operator`.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` from `tests/` passed: 1 file, 19 tests.
- `pnpm exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts` from `tests/` passed: 1 file, 2 tests.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- Scoped active-source grep audits found no vague `install it`, no `install product-testing if unavailable`, no direct `uat` install command, and no bare UAT-only recommended command blocks in the updated UAT handoff surfaces.
- Pre-existing unrelated dirty files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - BIP Prompt And Blocker Cleanup

**Status: COMPLETE (2026-07-02) - tightened BIP prompting and blocker language across shared conventions and shipping skills.**

### Goal

Make `idea-scope-brief` the only skill that may ask a Build-In-Public (BIP) gate question. Everywhere else, BIP is non-blocking read-only output behavior. `ship` and `ship-end` may ask about BIP only as a terminal-only prompt after reporting, and only when `.agents/project.json.alignment.build_in_public` is absent.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for canonical conventions, shipping skills, tests, generated bundles, catalog exports, and task docs.
- Reason: the change touches shared workflow policy, generated alignment bundles, mirrored `ship`/`ship-end` skill contracts, versioned skill archives, and catalog metadata.
- Safety boundary: do not edit generated `.claude/skills/**` or `.codex/skills/**` local roots; do not run npm publish, deploy, or GitHub Actions; preserve unrelated pre-existing package/export dirty state unless regeneration for this task intentionally updates it.

### Plan

- [x] Inspect BIP language in `CLAUDE.md`, generated alignment convention bundles, `ship`/`ship-end` skills, tests, and repo status.
- [x] Archive and version the four active source shipping skills before behavior changes.
- [x] Update shared BIP policy so `idea-scope-brief` is the only BIP gate-question owner and all other BIP output is read-only/non-blocking.
- [x] Update `ship` and `ship-end` contracts for terminal-only absent-setting prompting, explicit-false suppression, and no BIP blockers/review gates.
- [x] Regenerate bundled alignment-page conventions from `docs/alignment-page-convention.md`.
- [x] Refresh skills catalog exports required by skill changes while preserving unrelated package metadata.
- [x] Run focused tests, archive/generator audits, task-doc audit, and diff hygiene checks.
- [x] Commit and push the intended BIP cleanup boundary on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] `CLAUDE.md` states BIP is never a blocker, required approval gate, required review step, or downstream-routing prerequisite outside `idea-scope-brief`.
- [x] `ship`/`ship-end` treat `alignment.build_in_public: false` as "do not ask and do not generate BIP."
- [x] `ship`/`ship-end` prompt only in terminal output when `alignment.build_in_public` is absent and `alignment.bip_prompt_dismissed !== true`.
- [x] BIP output remains generated only when enabled or explicitly invoked, and it is read-only help/review content.
- [x] Active non-archived skill/convention text has no BIP blocker language except the allowed `idea-scope-brief` gate and normal non-BIP alignment approval gates.
- [x] Changed `SKILL.md` files are archived, versioned, and have changelog entries.
- [x] Generated catalog exports validate.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `npx vitest run tests/layer1/ship-end-bip.test.ts tests/layer1/alignment-gates.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-alignment-page.mjs --check` passed: 313 output paths exact, 311 generated bundles exact.
- `npx vitest run tests/layer1/ship-end-bip.test.ts tests/layer1/alignment-gates.test.ts` passed: 2 files, 49 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `scripts/validate-skills-catalog-export.sh` passed after regenerating and staging `exports/skills-catalog/v1/`.
- `node scripts/audit-task-docs.mjs` passed: failures 0, warnings 0.
- `git diff --check` passed.
- Focused BIP prompt grep confirmed only `idea-scope-brief` owns the kickoff gate question; `ship` and `ship-end` are terminal-only and absence-gated.
- Pre-existing unrelated package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - SKILL.md Language Deduplication Review

**Status: COMPLETE (2026-07-02) - removed generated skill/reference language duplication while preserving skill behavior.**

### Goal

Review active `SKILL.md` files for duplicated language within the same document and repeated language between a `SKILL.md` and the Markdown documents it directly references. Remove or consolidate redundant prose without changing skill behavior.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for skill/reference/task docs.
- Reason: this is a broad documentation-quality pass across active skill contracts and directly referenced companion docs.
- Safety boundary: exclude archived `SKILL.md` snapshots unless directly referenced by an active skill, preserve unrelated dirty package files, and avoid GitHub Actions.

### Plan

- [x] Inspect repo guidance, lessons, current task state, and active `SKILL.md` inventory.
- [x] Build or run an audit for repeated normalized paragraphs within active skills and against direct Markdown references.
- [x] Review high-signal duplicate findings and classify each as intentional mirror, generated convention copy, or redundant local prose.
- [x] Patch only clear same-document or skill/reference duplication with minimal wording changes.
- [x] Run targeted duplicate audit, archive/version audit if skills change, diff checks, and status checks.
- [x] Commit and push intended changes on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] No clear duplicated paragraphs remain within an edited active `SKILL.md`.
- [x] No edited active `SKILL.md` repeats substantial prose from its direct Markdown references when a pointer or shorter instruction is sufficient.
- [x] Behaviorally important instructions remain present in either the skill or the referenced document.
- [x] Verification output is recorded in the Review section.

### Test Plan

- Duplicate audit script/check used for this task.
- `bash scripts/skill-archive-audit.sh --strict` if active `SKILL.md` files change.
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- Normalized duplicate audit over 413 active source `SKILL.md` files found `ref_exact_count: 0` and `ref_overlap_count: 0` after edits. The remaining intra-file matches are the intentional generated target policy blocks inside `base/claude/provision-agentic-config/SKILL.md`.
- `node scripts/upgrade-alignment-page.mjs --check` passed: 313 output paths exact, 311 generated bundles exact.
- `npx vitest run tests/layer1/alignment-gates.test.ts tests/layer1/positioning-alignment-contract.test.ts` passed: 2 files, 42 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- Pre-existing dirty package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - BIP Page Location And Fresh-Audience Clarity

**Status: COMPLETE (2026-07-02) - standardized BIP output location and fresh-audience requirements.**

### Goal

Improve Build-In-Public output so generated posts are understandable to a fresh audience and stop adding top-level `alignment/bip-*.html` pages. Standardize BIP page output under a dedicated `alignment/bip/` location.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for canonical conventions, tests, generated bundles, and task docs.
- Reason: this changes shared alignment/BIP contracts, audit behavior, generated per-skill bundles, and regression tests.
- Safety boundary: do not change GitHub Actions, do not publish, and preserve pre-existing package version/manifest working-tree changes unless a required generator intentionally touches them.

### Plan

- [x] Inspect the canonical BIP convention, social-output routers, audit script, and focused tests.
- [x] Update `docs/alignment-page-convention.md` so post-confirmation BIP pages live at `alignment/bip/{skill-name}.html`.
- [x] Add fresh-audience context requirements to BIP generation: explain project/work context, define jargon, state why the work matters, and tie each post angle to an understandable public hook.
- [x] Update social post/video output-shape guidance where needed so generated candidates carry audience/context fields.
- [x] Update `scripts/audit-alignment-pages.mjs` and focused tests to enforce the new BIP path shape and clarity fields.
- [x] Regenerate alignment convention bundles and packaged assets as needed.
- [x] Run focused verification and record results.
- [x] Commit and push intended changes on `master` while preserving unrelated dirty work.

### Acceptance Criteria

- [x] Generated alignment convention text names `alignment/bip/{skill-name}.html`, including archive paths under `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/bip/{skill-name}.html`.
- [x] Active BIP audit accepts and enforces the dedicated `alignment/bip/` directory, and rejects stale top-level or old checkpoint shapes.
- [x] BIP candidates must include fresh-audience context, jargon expansion, public-facing significance, source basis, claim safety, risk level, publish precheck, loaded convention path, and recommendation status.
- [x] Central alignment index guidance treats `alignment/bip/*.html` as BIP review/help pages without making them look like new primary alignment pages.
- [x] Focused tests cover the new path and required context fields.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts`
- `git diff --check`
- `git status --short --branch`

## Historical Implementation - Release-Prep Metadata And Changelog

**Status: COMPLETE (2026-07-02) - prepared package/catalog metadata and changelog for the next publish attempt.**

### Goal

Prepare the repo for the next publish attempt without running npm publish or changing npm auth state. Keep package source version at `0.1.18`; a later `./publish.sh patch` can bump to `0.1.19`.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial writes for task docs, generated release metadata, and changelog updates.
- Reason: this is release-prep work touching generated package/catalog metadata plus package-level release notes.
- Safety boundary: do not bump package source version, run npm publish, tag, push, or change npm auth state.

### Plan

- [x] Inspect current repo state, package version, changelog, and post-`0.1.18` commits.
- [x] Regenerate `packages/skillpacks/dist/skillpacks-manifest.json` from the current git index.
- [x] Regenerate `exports/skills-catalog/v1/` public export artifacts.
- [x] Add a `0.1.19` release-prep section to `CHANGELOG.md` while leaving package source version at `0.1.18`.
- [x] Run the requested verification commands.
- [x] Record verification results and final repo status.

### Acceptance Criteria

- [x] `packages/skillpacks/package.json` remains at `0.1.18`.
- [x] Package manifest and skills-catalog export artifacts are regenerated from current source.
- [x] `CHANGELOG.md` has an empty `[Unreleased]` placeholder and a `## [0.1.19] - 2026-07-02` release-prep section.
- [x] The `0.1.19` section summarizes YouTube meta research, rapid deck graduation reconciliation, Platform Fit Workshop, clean-context design-tree handoff wording, and refreshed package/catalog metadata.
- [x] Verification results are captured in `CHANGELOG.md` and `tasks/todo.md`.

### Test Plan

- `npm --workspace packages/skillpacks run test:node`
- `npm run skillpacks:verify`
- `npm run exports:check`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

## Historical Implementation - State-Model Clean-Context Handoff Wording

**Status: COMPLETE (2026-07-01) - tightened `Invoke With YAML` clean-context guidance for chunked state-model handoffs.**

### Goal

Make the design-tree-loop handoff convention and mirrored state-model contracts explicitly say that the optional `## Invoke With YAML` block belongs in a fresh/cleared agent context alongside the exact repeated command, not as extra material appended to an already crowded session.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for task docs, canonical convention text, regenerated bundles, and mirrored state-model contract wording.
- Reason: this changes shared generated design-tree-loop bundles plus state-model-specific handoff requirements.
- Safety boundary: preserve unrelated paused YouTube task state, do not alter GitHub Actions, and keep behavior scoped to clean-context handoff wording.

### Plan

- [x] Locate canonical design-tree-loop source and active state-model mirrors.
- [x] Update active task docs with this implementation contract.
- [x] Update canonical `docs/design-tree-loop-convention.md` handoff wording.
- [x] Regenerate design-tree-loop bundles.
- [x] Update mirrored state-model `SKILL.md` handoff wording if regeneration does not cover it.
- [x] Run targeted verification and diff checks.
- [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- [x] `## Invoke With YAML` is described as optional clean-context routing metadata for the next invocation.
- [x] Progress handoff session guidance says to paste the YAML only into the fresh/clean context alongside the exact command.
- [x] `Staying in this session is allowed` is removed or made explicitly exceptional in generated design-tree-loop bundles.
- [x] Codex and Claude state-model `SKILL.md` mirrors carry the same fresh/clean-context cue.
- [x] Verification commands show the new wording and no generator drift.

### Test Plan

- `rg -n "Invoke With YAML.*fresh|clean context|not consumed state|durable cursor" packs/product-design docs`
- `rg -n "Staying in this session is allowed" packs/product-design/*/state-model/DESIGN-TREE-LOOP.md`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `git diff --check`
- `git status --short --branch`

## Historical Implementation - Platform Fit Workshop

**Status: COMPLETE (2026-07-01) - added platform-fit ranking and probe routing to the product-design tree.**

### Goal

Add a first-class Platform Fit Workshop to the product-design design tree so `user-flow-map` ranks candidate platforms, records the decision in `flow-tree` manifests, creates thin platform probes when needed, and carries prototype evidence into final `spec-interview` platform lock.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial mutations for schema, generated docs, mirrored skill contracts, tests, and task docs.
- Reason: this touches the product-design flow-tree contract, generated bundled convention files, mirrored skill behavior, and regression coverage.
- Safety boundary: keep the fixed route tuple unchanged, avoid standalone platform skills, preserve unrelated paused YouTube task notes, and do not create GitHub Actions.

### Plan

- [x] Inspect current schema, sample manifest, design-tree convention, mirrored skills, tests, and active task docs.
- [x] Update the task docs with the active implementation contract and review section.
- [x] Update `design/flow-tree.schema.json` to `v0.5` with additive `platform_fit` and `prototype_build_item.platform_probe` support.
- [x] Update `design/flow-tree-sample.yaml` with a realistic platform-fit matrix and one thin platform probe.
- [x] Update canonical design-tree docs and regenerate bundled `DESIGN-TREE-LOOP.md` files.
- [x] Archive, bump, and update changed mirrored skills and changelogs.
- [x] Extend focused layer1 tests for schema, sample, route stability, platform-probe validation, and mirror contracts.
- [x] Run focused verification, generator check, archive audit, and relevant layer1 tests.
- [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- [x] `flow-tree.schema.json` uses `schema_version: v0.5`, keeps the six-step route unchanged, and makes `platform_fit` optional/additive.
- [x] `platform_fit.candidates[]` covers the broad platform set, fit/status values, evidence basis, platform-specific risk fields, required probe, and recommendation buckets.
- [x] `prototype_build_item.platform_probe` allows explicitly non-visual platform probes without requiring `ui_experiment_id`, while ordinary UI build items still link to a UI experiment.
- [x] Design-tree docs frame Platform Fit as a `user-flow-map` trunk concern and platform probes as thin risk tests, not full parallel products.
- [x] Mirrored skills mention Platform Fit Workshop, broad candidate set, platform probes, and `spec-interview` final production platform lock where applicable.
- [x] Changed `SKILL.md` files are archived and versioned with changelog entries.

### Test Plan

- `npm test -- tests/layer1/product-design-flow-tree.test.ts`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `bash scripts/skill-archive-audit.sh --strict`
- Relevant focused layer1 suite if the targeted tests pass.
- `git diff --check`
- `git status --short --branch`

## Historical Implementation - Reconcile Rapid Deck Graduation

**Status: COMPLETE (2026-07-01) - normalized VARD/ORD graduation through traction gates into AFPS.**

### Goal

Make the rapid deck docs, pack docs, active VARD/ORD skill handoffs, Devtool AFPS pack metadata, generated catalog export, and focused tests agree on the canonical routes:

- VARD: `vard-scan -> vard-align -> vard-ship -> vard-traction -> Business AFPS`
- ORD: `ord-scan -> ord-align -> ord-ship -> ord-traction -> Devtool AFPS`

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial mutations for archived skill contracts and generated metadata.
- Reason: this touches public workflow docs, pack contracts, mirrored active skill behavior, and routing tests.
- Safety boundary: preserve unrelated YouTube pack work and existing rapid-deck lesson text; do not create GitHub Actions.

### Plan

- [x] Inspect current rapid deck docs, VARD/ORD skill mirrors, pack metadata, generated references, and task notes.
- [x] Archive affected active `SKILL.md` files before behavior/output changes.
- [x] Update VARD/ORD ship and traction skill handoffs in Claude and Codex mirrors, bump versions, and update changelogs.
- [x] Update `docs/decks.md`, `packs/vard/PACK.md`, `packs/ord/PACK.md`, `packs/devtool/PACK.md`, `docs/operating-modes.md`, `docs/skills-reference.md`, and stale pack workflow references.
- [x] Regenerate public skills catalog export metadata.
- [x] Add focused layer1 deck graduation routing coverage.
- [x] Run targeted verification and document results.
- [x] Commit and push intended changes on the primary branch without staging unrelated YouTube work.

### Acceptance Criteria

- [x] `docs/decks.md` lists VARD and ORD chains with `*-traction`.
- [x] `business-research` is the canonical Business AFPS pack name; `business-discovery` appears only as compatibility/alias history.
- [x] VARD graduation routes to `npx skillpacks install business-research`, then `$idea-scope-brief` for raw/new framing or `$customer-discovery` for clear shipped concepts with traction evidence.
- [x] ORD graduation routes to `npx skillpacks install devtool`, then `$devtool-workflow` by default or `$devtool-user-map` as the first concrete research step.
- [x] `vard-ship` and `ord-ship` route to traction before AFPS.
- [x] Devtool AFPS pack docs exist and identify ORD as a graduation source.

### Test Plan

- `git diff --check`
- `npx tsx tests/layer1/deck-graduation-routing.test.ts`
- `scripts/skill-install-routing-audit.sh --active`
- `node scripts/generate-skills-catalog-export.mjs`
- Manifest/package test that covers deck install metadata, if discoverable.
- `git status --short --branch`

## Paused Implementation - Create YouTube Meta Research Skill

**Status: IN PROGRESS (2026-07-01) - implementing `youtube-meta-research` in `youtube-ops`.**

### Goal

Add a mirrored Codex/Claude `youtube-meta-research` research skill to `packs/youtube-ops`, route `$youtube --meta <channel>` to it, update pack documentation and generated alignment bundles, then verify, commit, and push the change on `master`.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial file mutations for mirrored skill/router updates and generated artifacts.
- Reason: this touches skill contracts, router behavior, pack documentation, generated alignment bundles, and validation-sensitive catalog surfaces.
- Safety boundary: preserve unrelated working-tree changes, especially the pre-existing `tasks/lessons.md` modification; do not create GitHub Actions; do not infer or encode private YouTube Studio metrics from public evidence.

### Plan

- [x] Capture the visible skill-creation invocation under `prompts/skill-creator/`.
- [x] Promote this implementation plan into `tasks/roadmap.md` and `tasks/todo.md`.
- [ ] Inspect nearest YouTube research skill patterns, router skill structure, pack docs, changelog format, archive conventions, and generated catalog expectations.
- [ ] Scaffold `packs/youtube-ops/codex/youtube-meta-research/` and `packs/youtube-ops/claude/youtube-meta-research/` manually from the local pack pattern.
- [ ] Write the Codex `SKILL.md` first, then mirror to Claude with command syntax adjusted while preserving shared workflow semantics.
- [ ] Add `CHANGELOG.md` files for both new skill mirrors.
- [ ] Archive current mirrored `$youtube` router skills with `scripts/skill-archive.sh`, bump router version to `v0.4`, add meta intent routing and Mode G, and update router changelogs.
- [ ] Update `packs/youtube-ops/PACK.md` default flow and skill list from 14 to 15 standalone skills.
- [ ] Run `node scripts/upgrade-alignment-page.mjs` and inspect expected generated alignment bundle updates.
- [ ] Refresh generated catalog/package/showcase artifacts only if validation or existing generation scripts require it.
- [ ] Add a review/results section to `tasks/todo.md`.
- [ ] Run the full requested static checks and spot checks.
- [ ] Commit and push intended tracked changes on `master`, leaving the final tracked tree clean.

### Acceptance Criteria

- [ ] New Codex and Claude `youtube-meta-research` mirrors exist with `version: v0.0`, `type: research`, `required_conventions: [alignment-page]`, the requested argument hint, `context_intake: artifact_only`, and `visual_tier: visual`.
- [ ] The new skill enforces a report-first/staged research approval workflow and writes approved canonical output to `research/youtube/meta-research-<slug>-YYYY-MM-DD.md`.
- [ ] The skill covers peer/search discovery, breakout/outlier detection, topic/packaging/format/cadence/discovery-mode patterns, and exploit/avoid/counter-position opportunity recommendations.
- [ ] The skill explicitly prevents private metric inference and bypassing login walls/access controls, dates search observations, and warns against copying creators.
- [ ] Mirrored `$youtube` router skills are archived, bumped to `v0.4`, and route `--meta <channel>` plus current-meta/opportunity prompts to `youtube-meta-research`.
- [ ] `packs/youtube-ops/PACK.md`, changelogs, alignment bundles, and any required generated catalog surfaces include the new skill consistently.
- [ ] Requested verification commands pass or any unavoidable failure is documented with evidence.

### Test Plan

- `git diff --check`
- `scripts/skill-archive-audit.sh --strict`
- `node scripts/upgrade-alignment-page.mjs --check`
- `./scripts/skill-mirror-parity-audit.sh`
- `node scripts/researchish-skill-lifecycle-audit.mjs`
- `scripts/skill-install-routing-audit.sh --active`
- `npm run skillpacks:verify`
- `rg "youtube-meta-research" packs/youtube-ops docs packages`
- `scripts/pack.sh which youtube-meta-research`
- Read both new `SKILL.md` files for output paths, staged gates, evidence boundaries, and next-step routing consistency.
- `git status --short --branch`

## Historical Implementation - Move YouTube Owner Analytics Work To New Repo

**Status: COMPLETE (2026-07-01) - new private repo seeded and active alignment page moved out.**

### Goal

Create a private GitHub repo `GeorgeQLe/youtube-owner-analytics`, seed `/Users/georgele/projects/tools/youtube-owner-analytics` with the approved YouTube owner analytics alignment context, and remove only the copied active alignment page from `agentic-skills` while retaining the historical research brief.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial repo mutation and commits.
- Reason: this task creates a new repository boundary and mutates two independent git histories.
- Safety boundary: do not touch the pre-existing dirty package metadata files; do not create GitHub Actions; keep the old research brief as historical context; keep new and old repo commits separate.

### Plan

- [x] Read the `investigate` skill, current git state, source research brief, source alignment page, alignment index, and prior prompt history for the exact next-step YAML source.
- [x] Capture this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Create or verify the private GitHub repo `GeorgeQLe/youtube-owner-analytics`.
- [x] Initialize `/Users/georgele/projects/tools/youtube-owner-analytics` as an independent git repo on `master` with `origin=https://github.com/GeorgeQLe/youtube-owner-analytics.git`.
- [x] Seed the new repo with `README.md`, `tasks/next-step.yaml`, `research/youtube-owner-analytics-platform.md`, and `alignment/investigate-youtube-owner-analytics-platform.html`.
- [x] Delete only `alignment/investigate-youtube-owner-analytics-platform.html` from `agentic-skills`, remove its `alignment/index.html` card, and decrement page/category counts.
- [x] Run the required verification for both repos.
- [x] Commit and push the new repo seed, then commit and push the `agentic-skills` cleanup separately.

### Acceptance Criteria

- [x] `GeorgeQLe/youtube-owner-analytics` exists as a private repo with no GitHub Actions added by this task.
- [x] The local new repo exists at `/Users/georgele/projects/tools/youtube-owner-analytics`, uses `master`, and has the correct `origin`.
- [x] The new repo includes the copied research brief and alignment page at the same relative paths.
- [x] `tasks/next-step.yaml` contains the exact prior owner analytics investigation prompt content that the transfer plan identifies as the user-provided next-step YAML source.
- [x] `README.md` states the repo owns the YouTube owner analytics wrapper work and points the next step at `$investigate` with `tasks/next-step.yaml`.
- [x] `agentic-skills` no longer has the active copied alignment page or index card, but still keeps `research/youtube-owner-analytics-platform.md`.
- [x] After the cleanup commit, the old repo dirty status contains only the unrelated package metadata edits that existed before this task.

### Test Plan

- New repo:
  - `git status --short --branch`
  - `test -f alignment/investigate-youtube-owner-analytics-platform.html`
  - `test -f research/youtube-owner-analytics-platform.md`
  - `test -f tasks/next-step.yaml`
  - `git remote -v`
  - `git push -u origin master`
- Old repo:
  - `test ! -f alignment/investigate-youtube-owner-analytics-platform.html`
  - `node scripts/audit-alignment-pages.mjs`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
  - `git status --short --branch`

### Results

- Created private GitHub repo `GeorgeQLe/youtube-owner-analytics` and set its default branch to `master`.
- Seeded `/Users/georgele/projects/tools/youtube-owner-analytics` with `README.md`, `tasks/next-step.yaml`, `research/youtube-owner-analytics-platform.md`, and `alignment/investigate-youtube-owner-analytics-platform.html`.
- Pushed new repo seed commit `aab3c80` to `origin/master`.
- Removed `alignment/investigate-youtube-owner-analytics-platform.html` from `agentic-skills` and removed its `alignment/index.html` card, reducing the index from 62 to 61 pages and Utility & Maintenance from 12 to 11.
- Left `research/youtube-owner-analytics-platform.md` in `agentic-skills` as historical source context.
- Verified:
  - `git -C /Users/georgele/projects/tools/youtube-owner-analytics status --short --branch`
  - `test -f /Users/georgele/projects/tools/youtube-owner-analytics/alignment/investigate-youtube-owner-analytics-platform.html`
  - `test -f /Users/georgele/projects/tools/youtube-owner-analytics/research/youtube-owner-analytics-platform.md`
  - `test -f /Users/georgele/projects/tools/youtube-owner-analytics/tasks/next-step.yaml`
  - `git -C /Users/georgele/projects/tools/youtube-owner-analytics remote -v`
  - `ruby -e 'require "yaml"; ...' /Users/georgele/projects/tools/youtube-owner-analytics/tasks/next-step.yaml`
  - `git -C /Users/georgele/projects/tools/youtube-owner-analytics push -u origin master`
  - `find /Users/georgele/projects/tools/youtube-owner-analytics -path '*/.github/workflows/*' -type f -print`
  - `gh api repos/GeorgeQLe/youtube-owner-analytics/contents/.github/workflows --silent` returned 404, confirming no workflow directory exists on GitHub.
  - `test ! -f alignment/investigate-youtube-owner-analytics-platform.html`
  - `node scripts/audit-alignment-pages.mjs`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`

## Historical Implementation - YouTube Owner Analytics Alignment Page

**Status: COMPLETE (2026-07-01) - alignment review page shipped.**

### Goal

Convert `research/youtube-owner-analytics-platform.md` into a convention-compliant HTML alignment review page at `alignment/investigate-youtube-owner-analytics-platform.html`, update the central alignment index, verify the page, and ship only the intended tracked changes.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits to task docs, alignment page, and index.
- Reason: this is a durable review artifact conversion with alignment-page convention requirements and repository index maintenance.
- Safety boundary: do not create OAuth credentials, wrapper scripts, schedulers, skill contract edits, or private YouTube analytics data. Leave unrelated dirty package metadata untouched.

### Plan

- [x] Read project lessons, the alignment-page convention, source research brief, existing alignment examples, and current git status.
- [x] Capture this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Create `alignment/investigate-youtube-owner-analytics-platform.html` as a review-state document-tier alignment page with rendered sections, evidence tables, gates, section feedback, compile YAML, TTS, and question navigation.
- [x] Update `alignment/index.html` with the new dated page entry in the Utility & Maintenance category.
- [x] Run `node scripts/audit-alignment-pages.mjs`, `node scripts/audit-task-docs.mjs`, and `git diff --check`.
- [x] Attempt to open the generated page with the repository helper.
- [x] Document results, commit, and push intended changes while preserving unrelated local edits.

### Acceptance Criteria

- [x] The HTML page preserves the research brief's executive recommendation, repo/skill needs, API capability matrix, OAuth/quota/delay findings, architecture, CLI/file contracts, normalized evidence contract, scheduling, security, failure handling, validation, open questions, and official source list as structured HTML.
- [x] The page declares `data-alignment-category="utility"`, `data-visual-tier="document"`, and `data-alignment-status="review"` and includes the required TTS and question-nav script tags.
- [x] Review gates cover final artifact approval, MVP scope, Reporting API timing, evidence privacy, and unresolved open questions.
- [x] `alignment/index.html` links the new page exactly once with a `2026-07-01` date.
- [x] Alignment and task-doc audits pass, and the diff contains no unrelated package metadata changes.

### Results

- Added `alignment/investigate-youtube-owner-analytics-platform.html` as a review-state document-tier alignment page for `research/youtube-owner-analytics-platform.md`.
- Rendered the brief as structured HTML sections, tables, code blocks, evidence rules, source links, section feedback controls, required review gates, and a bottom `Compile Responses` YAML compiler.
- Updated `alignment/index.html` from 61 to 62 pages and added the new page under Utility & Maintenance.
- Verified:
  - `test -f alignment/investigate-youtube-owner-analytics-platform.html`
  - `rg -n "YouTube Owner Analytics Platform|Build the local wrapper|API Capability Matrix|Normalized Evidence Contract|Compile Responses" alignment/investigate-youtube-owner-analytics-platform.html`
  - `node scripts/audit-alignment-pages.mjs`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
- Open status: `opened` via `node scripts/open-html-page.mjs alignment/investigate-youtube-owner-analytics-platform.html --browser auto`.

### Test Plan

- `test -f alignment/investigate-youtube-owner-analytics-platform.html`
- `rg -n "YouTube Owner Analytics Platform|Build the local wrapper|API Capability Matrix|Normalized Evidence Contract|Compile Responses" alignment/investigate-youtube-owner-analytics-platform.html`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Historical Implementation - YouTube Owner Analytics Platform Investigation

**Status: COMPLETE (2026-07-01) - architecture brief shipped.**

### Goal

Investigate a local-first YouTube owner analytics wrapper for one owned channel. Produce a decision-ready architecture brief at `research/youtube-owner-analytics-platform.md` covering current skill data needs, official API fit, local architecture, CLI/file contracts, scheduling, security, risks, and build/no-build recommendation.

### Execution Profile

- Parallel mode: parallel read-only repo inspection where useful; serial document edits.
- Reason: this is a research/architecture deliverable with no implementation, credentials, scheduler setup, or skill contract changes.
- Safety boundary: do not create OAuth credentials, write wrapper scripts, alter skills, set up schedulers, or place secrets in repo artifacts.

### Plan

- [x] Capture the visible `$investigate` invocation prompt and promote this investigation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Audit active YouTube skill data needs, especially `--owner-analytics <path>`, `research/youtube/data/`, and report evidence expectations.
- [x] Research official YouTube Data API v3, YouTube Analytics API, and YouTube Reporting API fit from primary documentation.
- [x] Define the local-first architecture, CLI surface, normalized file layout, evidence contract, scheduling options, and security model.
- [x] Validate the proposed outputs against current `youtube-video-audit` owner-analytics inputs and requested schedule/failure scenarios.
- [x] Write and verify `research/youtube-owner-analytics-platform.md`.
- [x] Commit and push intended tracked changes, without touching unrelated local edits.

### Acceptance Criteria

- [x] Brief names the current repo/skill data needs and how normalized files satisfy them without changing `youtube-video-audit`.
- [x] Brief includes an API capability matrix with sourced claims for OAuth, quotas, metrics, delays, retention, and Reporting API tradeoffs.
- [x] Brief specifies raw and normalized evidence layout under `research/youtube/data/`, including metric provenance and explicit gaps.
- [x] Brief covers manual, daily channel, and recent-upload refresh scenarios plus expected failure handling.
- [x] Brief makes a build/no-build recommendation for a local-first CLI wrapper.

### Test Plan

- `rg -n "owner-analytics|research/youtube/data|audienceRetention|trafficSource|subscribersGained|impressions" packs/youtube-ops .codex/skills`
- `test -f research/youtube-owner-analytics-platform.md`
- `rg -n "Build recommendation|API Capability Matrix|Evidence Contract|youtube-video-audit|OAuth|Reporting API" research/youtube-owner-analytics-platform.md`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Historical Implementation - Publish Readiness Skill Audit

**Status: COMPLETE (2026-07-01) - publish blocked on npm authentication.**

## Historical Implementation - Materialize Agentic Skills Three-Repo Split

**Status: COMPLETE (reconciled 2026-06-29) — pending `/ship` to archive to `tasks/history.md`.**

### Goal

Create the three-repo layout for the already-documented `agentic-skills` split, with independent git repositories for skills source, Showcase app, and benchmark harness/results, each pointing at its corresponding remote. Reconciled outcome: all three GitHub repos exist and are populated; skills is worked from this single local checkout and showcase/benchmarks are remote-only by choice (no local sibling clones).

### Execution Profile

- Parallel mode: serial repo mutation, parallel read-only inspection where useful.
- Reason: this task moves repository boundaries and remotes; mutations must be staged, verified, and reversible.
- Safety boundary: do not create or modify GitHub Actions; do not discard current `agentic-skills` history; do not overwrite existing sibling directories; ask before creating GitHub repositories or moving the current checkout path.

### Proposed Local Layout

Recommended final layout:

```text
/Users/georgele/projects/tools/agentic-skills/
  skills/      -> https://github.com/GeorgeQLe/agentic-skills.git
  showcase/    -> https://github.com/GeorgeQLe/agentic-skills-showcase.git
  benchmarks/  -> https://github.com/GeorgeQLe/agentic-skills-benchmarks.git
```

Current reality (verified read-only 2026-06-29 via `gh repo view` / `gh api .../contents`):

- All three GitHub repos exist and are populated (default branch `master`, ~30 commits each): `GeorgeQLe/agentic-skills` (this checkout), `GeorgeQLe/agentic-skills-showcase` (created 2026-06-29 17:20), and `GeorgeQLe/agentic-skills-benchmarks` (created 2026-06-29 19:30; received catalog-pin determinism fix `dca929b` this session).
- Remote roots are normalized: showcase has the Next.js app at repo root (`package.json`, `pnpm-lock.yaml`, `app/`, `src/`, `next.config.mjs`); benchmarks has the harness at root (`benchmark/`, `data/`, `tests/`, `scripts/`, `specs/`, `package.json`).
- Materialization happened out-of-band (parallel/prior session): `ef4151b65` removed the Showcase/benchmark trees from this repo and they were recovered from parent commit `b7c0775bc` into the sibling remotes.
- Local layout decision (this session): single `agentic-skills` checkout, no local sibling clones; showcase/benchmarks are remote-only by choice.

### Plan

- [x] Inspect current tree, docs, git status, and split commit history.
- [x] Capture this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Confirm the desired local directory layout and whether missing GitHub repos should be created. **Decision:** repos already exist (none to create); single-checkout layout, no local sibling clones.
- [x] Stage extraction from `b7c0775bc` for showcase + benchmarks. **Reconciliation:** completed out-of-band on GitHub; verified read-only.
- [x] Create the local repo layout. **Reconciliation:** single-checkout layout chosen → no local creation/move; three independent remotes exist with `origin` configured on GitHub.
- [x] Normalize repo roots. **Reconciliation:** verified remotely (showcase app at root; benchmarks harness at root).
- [x] Verify each repo. **Reconciliation:** verified read-only via `gh repo view` and `gh api .../contents`.
- [x] Commit and push intended changes in each repo, then update task docs. **Reconciliation:** remotes already populated/pushed; this task-doc reconciliation closes out the split.

### Acceptance Criteria (reconciled — all met)

- [x] Three independent repos exist for skills, showcase, and benchmarks — GitHub authoritative and populated; skills worked from this single local checkout, showcase/benchmarks remote-only by choice (no accidental nested local repos).
- [x] The skills repo preserves the current `agentic-skills` history and remote.
- [x] The Showcase repo contains the app at its repo root and points to `GeorgeQLe/agentic-skills-showcase`.
- [x] The benchmark repo contains the benchmark harness/results at its repo root and points to `GeorgeQLe/agentic-skills-benchmarks`.
- [x] No nested git repos are accidentally tracked by another repo (no local sibling clones created).
- [x] No unrelated files are removed from the current checkout.
- [x] Each repo is populated and pushed on `master`.

### Test Plan

- `git -C <repo> status --short --branch`
- `git -C <repo> remote -v`
- `git -C <repo> fsck --no-reflogs` after initializing/copying history when practical.
- `git -C <repo> ls-files | rg '<expected boundary checks>'`
- Showcase: `pnpm install --frozen-lockfile` and existing `pnpm test` / `pnpm build` only if dependency install is already available or explicitly approved.
- Benchmarks: package/harness focused tests after dependency state is established.
- Skills: existing catalog/export validation is not expected to change unless task-doc metadata is committed here.

## Historical Implementation - Refactor BIP To Post-Approval HTML Output

### Goal

Move Build-In-Public (BIP) from a pre-final Stage 2 alignment checkpoint to a post-confirmation HTML artifact generated after a skill writes approved canonical markdown, while keeping BIP output source-safe and review-only.

### Execution Profile

- Parallel mode: serial edits, parallel read-only inspection where useful.
- Rationale: the canonical alignment convention, generated bundled instructions, social-routing docs, package-boundary tests, and audit script share one workflow contract and must stay synchronized.
- Safety boundary: do not create or modify GitHub Actions; do not publish social posts or write social-ledger records; preserve unrelated working-tree changes if they appear.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the current BIP alignment convention, social post/video conventions, `idea-scope-brief` Codex and Claude skill instructions, audit diagnostics, and package tests.
- [x] Update the canonical alignment-page convention so BIP is a post-confirmation artifact at `alignment/bip-{skill-name}.html`, archived before replacement, indexed, and opened after the skill concludes.
- [x] Update social routing conventions so enabled BIP mode loads every bundled channel convention, with `alignment.bip_platforms` used only as prioritization metadata.
- [x] Update Codex and Claude `idea-scope-brief` instructions so the one-time BIP prompt enables `set-bip on`, dismisses the prompt, and generates/opens `alignment/bip-idea-scope-brief.html` after `idea-brief.md` is written.
- [x] Revise alignment-page auditing and package-boundary expectations for the new post-confirmation BIP page shape and exhaustive channel behavior.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles and run the requested focused verification.
- [x] Document results, produce a ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- BIP is no longer specified as a pre-final Stage 2 halfway approval gate.
- Enabled BIP creates a review/help HTML artifact after approved canonical markdown is written and the alignment page is confirmed.
- The BIP artifact path is `alignment/bip-{skill-name}.html`, is archived before replacement, is linked from `alignment/index.html`, and is opened after the skill concludes.
- The BIP page lists exhaustive post candidates for every bundled social channel, including recommendation notes, source basis, claim-safety notes, risk, publish precheck, and `recommended` / `not-now` / `rejected` status.
- `set-bip on` means automatic exhaustive BIP generation with no extra BIP approval gate.
- `alignment.bip_platforms` remains supported as optional ranking/prioritization metadata, not as a filter.
- `idea-scope-brief` keeps the one-time BIP enablement prompt and generates/opens `alignment/bip-idea-scope-brief.html` after `idea-brief.md` writes when BIP is enabled.
- Audit and package-boundary tests reflect the new post-confirmation BIP contract.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/upgrade-alignment-page.mjs`
- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `node --test packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/package-boundary.test.mjs`
- `npx skillpacks alignment verify`
- Additional focused tests if the audit or package-boundary changes expose narrower fixtures.

### Results

- Moved BIP in the canonical alignment convention from a pre-final Stage 2 checkpoint to a post-confirmation read-only page at `alignment/bip-{skill-name}.html`.
- Updated social post/video routing so active BIP loads every bundled channel convention; `alignment.bip_platforms` is retained only as priority/ranking metadata.
- Updated `idea-scope-brief` Codex/Claude instructions to keep the one-time enablement prompt, run `set-bip on` plus `set-bip-prompt dismiss` on yes, and generate/open `alignment/bip-idea-scope-brief.html` after canonical artifacts are written and alignment is confirmed.
- Updated `ship-end` Codex/Claude BIP behavior to keep wrap-up post suggestions exhaustive across bundled channels and use saved platforms only for priority/ranking metadata.
- Reworked `scripts/audit-alignment-pages.mjs` to validate post-confirmation BIP pages and fail stale checkpoint metadata, while no longer requiring Stage 2 BIP checkpoint gates.
- Regenerated generated `ALIGNMENT-PAGE.md` bundles, skillpacks manifest, and public skills-catalog export; archived and bumped modified SKILL.md files per skill-versioning rules.
- Verification passed:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `node scripts/audit-alignment-pages.mjs`
  - `node --test packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/package-boundary.test.mjs`
  - `npm --workspace skillpacks run test:node`
  - `pnpm --dir tests test:layer1 -- audit-alignment-pages alignment-gates ship-end-bip social-ledger-convention`
  - `npm --workspace skillpacks run build:check`
  - `scripts/validate-skills-catalog-export.sh`
  - `node packages/skillpacks/bin/skillpacks.mjs alignment verify`
  - `scripts/skill-archive-audit.sh --strict`
  - `scripts/skill-versions.sh --missing`
  - `scripts/base-skill-version-parity-audit.sh`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
- `npx skillpacks alignment verify` was attempted and failed in this checkout with `sh: gskp: command not found`; the local packaged CLI equivalent above passed.

## Historical Implementation - Simplify BIP Into Project Platform Setup + Exhaustive Phase Drafts

## Historical Implementation - Investigate Publish 0.1.16 Release Metadata Dirty State

### Goal

Determine why the `0.1.16` release metadata dirty state is still blocking or confusing `publish.sh`, preserve the strict release safety boundary, and apply the smallest verified fix.

### Execution Profile

- Parallel mode: parallel reads/history scans where independent; serial edits and verification commands that mutate build outputs.
- Investigation strategy: General. The symptom is release-script behavior and git dirty-state handling, not UI or data-rendering behavior.
- Safety boundary: do not revert or discard the existing `0.1.16` metadata changes unless the investigation proves the current task owns that action.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this investigation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Validate the current dirty paths, exact release metadata diffs, and whether they are pre-existing `0.1.16` work.
- [x] Inspect `publish.sh`, focused publish recovery tests, package metadata build behavior, and recent commits around dirty-tree handling.
- [x] Reproduce or model the dirty-state failure path with the existing test harness or a safe dry-run path.
- [x] Identify the root cause with file/line evidence and choose the minimal fix.
- [x] Add or update focused tests that would catch the dirty metadata behavior.
- [x] Run publish-script syntax checks, focused tests, package build/check commands as needed, task-doc audit, and diff hygiene checks.
- [x] Document investigation results in `tasks/todo.md`, commit, and push intended changes if tracked files were intentionally modified.

### Acceptance Criteria

- The investigation classifies the user's dirty-state claim as confirmed, partially correct, or unsupported with git/status evidence.
- Release metadata paths for `0.1.16` are either accepted only in a documented recovery path or blocked with diagnostics that explain the required next action.
- `--allow-dirty-tree` does not accidentally permit package/release-impacting dirty metadata during normal release attempts.
- Any script behavior change has focused regression coverage.
- Verification proves both the intended publish path and the safety rejection path.

### Test Plan

- `bash -n publish.sh`
- `node --test packages/skillpacks/test/publish-recovery.test.mjs`
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Confirmed the dirty release metadata claim: package source metadata was pre-bumped from `0.1.15` to `0.1.16`.
- Confirmed `0.1.16` was not partially published: both public npm package names returned 404 for `0.1.16`.
- Identified the root cause in `publish.sh`: `--current` rejected the both-missing registry state even though that is the only safe path for a pre-bumped current source version.
- Updated `publish.sh` so `--current` can publish both packages from current source metadata when neither package name exists, while keeping existing partial recovery and both-published verification behavior.
- Added focused publish recovery coverage for pre-bumped current-source publishing.
- Included the existing `0.1.16` package metadata in the ship boundary; the next release command is `./publish.sh --current`.
- Verification passed with the commands in the test plan.

## Historical Implementation - Add Publish Dirty Tree Override

### Goal

Keep `./publish.sh` strict by default while adding an explicit `--allow-dirty-tree` escape hatch that permits only non-release dirty tracked paths to coexist with a release or dry run.

### Execution Profile

- Parallel mode: serial edits, parallel reads/verifications where independent.
- Rationale: `publish.sh` flag parsing, dirty-tree classification, diagnostics, and release recovery behavior share one safety boundary and should be updated atomically.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect `publish.sh`, existing publish recovery tests, package metadata, and current dirty release files without overwriting unrelated work.
- [x] Add `--allow-dirty-tree` parsing, usage text, tracked/untracked dirty summary output, and release-impacting path classification.
- [x] Preserve strict default behavior and preserve the narrow `--current` release-metadata recovery exception.
- [x] Add focused tests for default tracked dirty blocking, allowed non-release dirty paths with untracked files, rejected release-impacting dirty paths, supported flag ordering, and unknown flag rejection.
- [x] Run the requested dry-run/fixture verification, package tests, package build check, task-doc audit, and diff hygiene checks.
- [x] Document review/results, produce a ship manifest, commit, and push intended changes on the primary branch if safe.

### Acceptance Criteria

- `./publish.sh patch` still fails on any tracked dirty path by default.
- `./publish.sh --allow-dirty-tree patch` and dry-run variants continue only when every dirty tracked path is outside the package/release boundary.
- Dirty package or release inputs under `packages/skillpacks/**`, `base/**`, `packs/**`, `scripts/**`, package-bundled docs/assets, `README.md`, `CHANGELOG.md`, or `LICENSE` still fail with the override.
- `--current` recovery keeps its existing narrow release-metadata exception and is not broadened by `--allow-dirty-tree`.
- Diagnostics group release-impacting paths, non-release paths, and untracked paths, and warn when allowed dirty changes are excluded from the release.

### Test Plan

- `./publish.sh --dry-run --allow-dirty-tree patch` from a controlled dirty non-package state or mocked fixture.
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Added `--allow-dirty-tree` to `publish.sh` with usage documentation and flag ordering compatible with `--dry-run --allow-dirty-tree patch` and `patch --allow-dirty-tree`.
- Kept the default tracked dirty-tree block intact and added grouped dirty-tree diagnostics for release-impacting tracked paths, non-release tracked paths, and untracked paths.
- Added a conservative release-impacting classifier for package inputs, package-bundled convention/social docs, root release docs, package metadata, workspace metadata, npm auth files, and `publish.sh`.
- Preserved the narrow `--current` recovery exception: `--allow-dirty-tree` does not permit unrelated dirty paths during recovery.
- Extended the publish recovery test harness to mock tracked/untracked git status and added coverage for strict default blocking, allowed non-release dirt with untracked files, rejected release-impacting dirt, post-target flag ordering, `--current` isolation, and unknown flag rejection.
- Verification passed with the commands listed in the test plan. A parallel validation attempt intentionally was not accepted because `test:node` and `build:check` both mutate `packages/skillpacks/build`; rerunning them serially passed.

## Historical Implementation - Enforce Pending BIP Before Active Final Approval

### Goal

Prevent normal Stage 2 review pages with `data-bip-status="linked"` from exposing active final artifact approval controls before the linked Build-In-Public page has been approved, while still allowing read-only final-approval preview content and BIP handoff instructions.

### Execution Profile

- Parallel mode: serial edits, parallel reads/verifications where independent.
- Rationale: the audit script, canonical convention, generated bundles, and regression fixtures share one approval-ordering contract and should land atomically.

### Plan

- [x] Capture the implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the current BIP checkpoint audit, alignment-page convention, generated bundle behavior, and layer1 fixtures.
- [x] Add an audit helper that detects active final artifact approval gates from gate/question containers carrying final-artifact, canonical-artifact, or artifact-approval metadata without depending only on `data-required="true"`.
- [x] In the linked-BIP branch, keep the existing reference and handoff checks and fail when linked BIP coexists with an active final artifact approval gate.
- [x] Update the canonical alignment-page convention to allow linked-BIP handoff text and read-only final-approval preview content, while blocking active final artifact approval controls until BIP is approved or narrowly not-applicable.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- [x] Update layer1 fixtures for linked-BIP failure, linked-BIP read-only preview success, and approved-BIP active final approval success.
- [x] Run the requested audit, generator, and focused layer1 verification; document results, commit, and push on the primary branch.

### Acceptance Criteria

- A Stage 2 review page with `data-bip-status="linked"` and an active final artifact approval gate fails `scripts/audit-alignment-pages.mjs`.
- Linked-BIP pages may still include a visible BIP handoff and read-only final artifact approval preview wording.
- A Stage 2 review page with `data-bip-status="approved"` and `bip_approval_status: ready-for-agent-review` may expose active final artifact approval controls.
- A Stage 2 review page with a narrow `data-bip-status="not-applicable"` reason may expose active final artifact approval controls.
- Generated alignment-page convention bundles match `docs/alignment-page-convention.md`.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `pnpm --dir tests test:layer1 -- audit-alignment-pages`
- `pnpm --dir tests test:layer1 -- ship-end-bip social-ledger-convention idea-scope-brief-approval-ordering audit-alignment-pages`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Added a final artifact approval gate detector in `scripts/audit-alignment-pages.mjs` that scans active gate/question containers for final-artifact, canonical-artifact, or artifact-approval metadata without depending on `data-required="true"`, while avoiding artifact destination/path-only metadata.
- Kept the existing linked-BIP page reference and handoff checks, then added a linked-BIP diagnostic when active final artifact approval controls are still rendered.
- Updated `docs/alignment-page-convention.md` so linked BIP checkpoints may show handoff instructions and read-only final-approval preview content, but active final artifact approval controls wait for BIP `approved` or narrowly `not-applicable`.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- Added layer1 fixtures for linked-BIP failure with an active final gate, linked-BIP success with read-only preview only, and approved-BIP success with active final approval controls.
- Verification passed with the commands listed in the test plan.

## Historical Implementation - Fix BIP Drafting-Mode Gate Leakage

### Goal

Prevent initial Build-In-Public channel-selection alignment pages from leaking drafting-mode or final content-approval gates before channel-selection YAML is approved, and remove the stale all-channels-not-now drafting option from selected-channel BIP draft pages.

### Execution Profile

- Parallel mode: serial
- Rationale: the canonical convention, generated bundles, audit diagnostics, fixtures, and Alignmeant page audit share one gate-sequencing contract and should be updated atomically.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the canonical alignment-page convention, generated `ALIGNMENT-PAGE.md` bundles, audit script, layer1 tests, recent history, and active/archived Alignmeant BIP page state.
- [x] Tighten `docs/alignment-page-convention.md` so the initial BIP channel-selection page requires only target-channel selection until approved channel-selection YAML is consumed.
- [x] Extend `scripts/audit-alignment-pages.mjs` with BIP gate-sequencing diagnostics for premature final gates, stale future-channel drafting wording, and stale all-channels-not-now selected-channel drafting options.
- [x] Add focused layer1 audit fixtures for passing/failing initial BIP channel-selection pages and selected-channel BIP draft pages.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- [x] Run the updated audit against Alignmeant and amend the active BIP page if it only contains the stale selected-channel drafting option.
- [x] Run required verification, document results, commit, and push on the primary branch.

### Acceptance Criteria

- Initial BIP channel-selection pages may require only the target-channel gate.
- Drafting mode, content angles, sample drafts/video ideas, tone, claim safety, and publish readiness are required only after channel-selection YAML has been approved and consumed.
- BIP pages containing the stale future-channel drafting question fail audit.
- Selected-channel BIP draft pages fail audit if the drafting-mode gate still offers the stale all-channels-remain-not-now option.
- The active Alignmeant page either passes the updated audit or is amended to remove only the stale selected-channel option.
- Generated alignment-page convention bundles match the canonical convention.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-alignment-pages.mjs --root /Users/georgele/projects/tools/dev/alignmeant`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

### Results

- Confirmed the archived Alignmeant BIP page required drafting mode, content angles, sample drafts, tone, claim safety, and publish readiness before channel-selection YAML was approved.
- Tightened the canonical alignment-page convention so initial BIP channel-selection pages may require only target-channel selection until approved channel-selection YAML is consumed.
- Added audit diagnostics for premature required final BIP gates, the stale future-channel drafting question, and the stale selected-channel all-channels-not-now drafting option.
- Added focused layer1 fixtures for valid/invalid initial channel-selection pages and valid/invalid selected-channel BIP draft pages.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles.
- Amended the active Alignmeant BIP page to remove the stale selected-channel no-drafting option and amended its parent checkpoint so BIP review explicitly precedes final artifact approval.
- Verification passed in the source repo. The external Alignmeant audit still exits 1 for unrelated pre-existing TTS, metadata, and confirmed-page-control drift, but now reports `BIP handling: 1 Stage 2 pages, exact`.

## Historical Implementation - BIP Channel Recommendations And Rankings

### Goal

Change the Build-In-Public target-channel gate from a conservative all-`not-now` default to agent-ranked channel recommendations where `recommended` channels are preselected for user confirmation, while preserving BIP as an approval checkpoint before any channel-specific drafting.

### Execution Profile

- Parallel mode: serial
- Rationale: the canonical alignment-page convention, generated bundle files, and regression tests share one contract and should be updated atomically.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Validate the current BIP target-channel language in the canonical convention, generated bundles, tests, and recent history.
- [x] Update `docs/alignment-page-convention.md` so BIP pages rank target channels, assign `recommended` / `optional` / `not-now`, preselect recommended channels for user confirmation, and treat the submitted gate as channel-selection approval only.
- [x] Preserve safety boundaries: no draft posts, video ideas, or channel-specific content before channel-selection approval; each recommendation needs source basis, fit rationale, claim risk, and non-recommended-channel rationale.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundle files with `node scripts/upgrade-alignment-page.mjs`.
- [x] Update focused layer1 coverage for canonical and generated bundle text.
- [x] Run required verification, update `tasks/lessons.md`, document results, commit, and push on the primary branch.

### Acceptance Criteria

- BIP pages rank candidate target channels by fit using completed Stage 2 evidence.
- Each target channel has one of `recommended`, `optional`, or `not-now`.
- `recommended` channels are preselected by default but still require user confirmation and override controls.
- A submitted target-channel gate approves only channel selection; it is not final BIP approval.
- Social/channel convention files are loaded only after the selected/recommended channel set is approved.
- Channel-specific drafting remains blocked until channel-selection approval.
- Generated alignment-page convention bundles match the canonical convention.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `npm run test -- tests/layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Confirmed the user report: the canonical BIP channel gate used an all-`not-now` conservative default introduced by the BIP checkpoint enforcement change.
- Updated the canonical alignment-page convention so BIP pages present agent-ranked target-channel recommendations from completed Stage 2 evidence, label channels as `recommended`, `optional`, or `not-now`, and preselect recommended channels for user confirmation with per-channel override controls.
- Made target-channel approval an intermediate checkpoint only: it may return agent-continuation YAML with `bip_channel_selection_status: ready-for-agent-review`, but it must not set final `bip_approval_status: ready-for-agent-review`.
- Preserved safety boundaries: no draft posts, video ideas, channel-specific sample content, channel-specific convention-driven recommendations, or social convention loading until channel-selection approval is consumed.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles from `docs/alignment-page-convention.md`.
- Added layer1 assertions covering canonical and generated bundle text for ranked recommendations, status values, preselected recommended channels, and non-final channel-selection approval.
- Verification passed with the commands recorded in `tasks/todo.md`; the requested root `npm run test -- tests/layer1/alignment-gates.test.ts` command is unavailable because the repo root has no `test` script, so the equivalent tests package Vitest command was run and passed.

## Historical Implementation - Fix Ship-End BIP Post Suggestions

### Goal

Fix the `ship-end` Build-In-Public behavior so projects with `.agents/project.json` `alignment.build_in_public: true` do not stop at a skipped enablement gate, and instead surface source-safe BIP post suggestions or a clear no-content rationale after session wrap-up.

### Execution Profile

- Parallel mode: serial
- Rationale: the active installed skill mirror, source pack mirrors, version metadata, and regression checks are tightly coupled and should land in one controlled change.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Validate the user's claim against the current `ship-end` skill contract, source pack mirrors, and recent history.
- [x] Patch the `ship-end` BIP step so enabled BIP skips only the enablement prompt, then prompts the agent to draft supported post suggestions after the wrap-up report.
- [x] Archive and bump affected `ship-end` skill mirrors if the contract changes behavior.
- [x] Add focused regression coverage or static contract checks proving enabled BIP produces post-suggestion instructions.
- [x] Run skill/version, archive, mirror, task-doc, and diff hygiene verification.
- [x] Document results, commit, and push on the primary branch.

### Acceptance Criteria

- `ship-end` still asks the one-time enablement question only when BIP is unset/off and the prompt has not been dismissed.
- When BIP is already enabled, `ship-end` no longer treats that as terminal post handling; it must draft source-safe BIP suggestions or explain why the shipped boundary has no safe public angle.
- Enabled-state output must not say only that the BIP gate was skipped.
- Claude and Codex mirrors of the `ship-end` skill remain behaviorally aligned.
- Skill versioning and archives are updated for the behavior change.
- Focused verification proves the contract contains enabled-BIP post-suggestion behavior.

### Test Plan

- Focused static/regression check for `ship-end` BIP enabled behavior.
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Confirmed the active v0.7 `ship-end` contract skipped the full BIP suggestion gate when `alignment.build_in_public` was already true.
- Updated mirrored Claude and Codex `ship-end` skills to v0.8 so enabled BIP skips only the enablement question, then drafts 2-4 source-safe BIP post suggestions or states that no safe public angle exists.
- Updated the shared `CLAUDE.md` BIP Suggestion Gate convention so it matches the enabled-mode behavior.
- Archived the prior v0.7 contracts and added v0.8 changelog entries.
- Added focused layer1 coverage for enabled, dismissed, and newly-enabled BIP branches plus the v0.7 archive.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` from the staged skill boundary so packaged metadata includes v0.8, new hashes, and v0.7 archives.
- Verification passed; see `tasks/todo.md` and `tasks/ship-manifest-2026-06-29-fix-ship-end-bip-post-suggestions.md`.

## Historical Implementation - Harden Publish Against Web Auth Interrupts

### Goal

Restore the failed `0.1.15` release bump residue, then harden `./publish.sh` so interactive npm web-auth interruptions cannot leave tracked release files bumped before any package has published.

### Execution Profile

- Parallel mode: serial
- Rationale: release state restoration, auth preflight, signal cleanup, and package recovery tests share one mutation boundary and should land atomically.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Restore only `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` from the failed `0.1.15` bump back to `HEAD`.
- [x] Inspect current publish, auth-check, and recovery test behavior.
- [x] Move real-publish package/auth preflight ahead of source mutation by computing the target version in a temporary package copy.
- [x] Extend `prepublish-auth-check.mjs` with package/version overrides and non-interactive web-auth rejection when no publish token or legacy/token auth is detected.
- [x] Add interrupt-safe rollback handling for `INT`, `TERM`, and `HUP`, preserving bumped files only after the first publish succeeds.
- [x] Add focused regression coverage for web-auth preflight, publish interruption rollback, repeated interrupt during cleanup, token/legacy-auth pass-through, and existing recovery paths.
- [x] Run focused and workspace verification, task-doc audit, diff hygiene checks, and post-commit dry-run release verification.
- [x] Document results, commit, and push on `master`.

### Acceptance Criteria

- Failed `0.1.15` bump files are restored before release script implementation changes.
- Real publishes validate both `skillpacks@<target>` and `@glexcorp/gskp@<target>` before `run_version_bump` mutates tracked files.
- `auth-type=web` without `NODE_AUTH_TOKEN`, `NPM_TOKEN`, or registry `_authToken` fails before source mutation with clear remediation.
- Existing staged-package preflight remains as a second guard after package staging.
- `SIGINT`, `SIGTERM`, and `SIGHUP` during the first package publish restore tracked release files to their pre-bump contents.
- Repeated interrupt during cleanup cannot prevent rollback from restoring the source files.
- Bumped files are kept only after the first `npm publish` succeeds, preserving partial-publish recovery behavior.
- Focused, workspace, task-doc, diff hygiene, and dry-run release checks pass or any blocker is documented.

### Test Plan

- `node --test packages/skillpacks/test/publish-recovery.test.mjs packages/skillpacks/test/prepublish-auth-check.test.mjs`
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`
- After commit: `./publish.sh --dry-run patch`

### Results

- Restored `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` from the failed `0.1.15` bump back to the committed `0.1.14` state before code changes.
- Added pre-bump target-version computation in a temporary package copy and preflighted both `skillpacks@<target>` and `@glexcorp/gskp@<target>` before source mutation.
- Extended `prepublish-auth-check.mjs` with package/version overrides, token-aware `auth-type=web` rejection, and explicit non-interactive remediation.
- Added `INT`, `TERM`, and `HUP` handling so cleanup ignores repeated interrupts while restoring source files.
- Added focused regression coverage for web-auth/no-token preflight, token/protected-token pass-through, first-publish interruption rollback, repeated interrupt during cleanup, existing first-publish failure rollback, and `--current` recovery.
- Post-commit `./publish.sh --dry-run patch` passed for `0.1.15` and cleanup restored package and manifest versions to `0.1.14`.

## Historical Implementation - Refresh Package Manifest For Interrogation Split

### Goal

Restore release readiness after the interrogation-page bundle changes by regenerating the package manifest and rerunning release gates.

### Plan

- [x] Check local release posture, published versions, and current package metadata.
- [x] Regenerate `packages/skillpacks/dist/skillpacks-manifest.json`.
- [x] Rerun package build/check and focused package tests.
- [x] Document results, commit, and push the manifest fix on `master`.

### Acceptance Criteria

- `npm --workspace skillpacks run build:check` passes.
- `npm --workspace skillpacks run test:node` passes.
- Task docs and diff hygiene checks pass.
- Working tree is clean and pushed.

### Results

- Confirmed both published package names, `skillpacks` and `@glexcorp/gskp`, are currently at `0.1.14`; the next patch release is `0.1.15`.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` so the `upgrade-interrogation-pages` `v0.2` skill metadata, archive list, content hashes, and source fingerprint are current.
- `npm --workspace skillpacks run build:check` and `npm --workspace skillpacks run test:node` passed after the manifest refresh.

## Historical Implementation - Separate Visible And Agent Recommended Answers

### Goal

Fix interrogation pages so human-facing recommendation text is not copied into open-answer textareas or compiled YAML as the agent's answer payload.

### Execution Profile

- Parallel mode: serial
- Rationale: canonical convention, generated bundles, audit behavior, fixtures, and upgrade-skill versioning all share the same interrogation-page contract and should be changed in one lane.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current interrogation convention, generated `INTERROGATION-PAGE.md` bundles, audit script, layer1 tests, and upgrade skill mirrors.
- [x] Update the canonical convention so visible `data-recommended-answer` text is separate from hidden `data-agent-recommended-answer` payload text.
- [x] Update canonical JavaScript/YAML guidance to apply and compile the hidden agent payload while retaining backward-compatible fallback behavior.
- [x] Regenerate generated interrogation-page bundles from the canonical convention.
- [x] Extend active-page audit behavior and layer1 fixtures/tests to require a hidden agent answer per open question.
- [x] Archive and bump mirrored `upgrade-interrogation-pages` skills to `v0.2`, preserving/creating hidden agent payloads during upgrades.
- [x] Run required validation, inspect generated text, document results, commit, and push on the primary branch.

### Acceptance Criteria

- Every canonical `data-open-question` example includes visible `data-recommended-answer`, hidden `data-agent-recommended-answer`, existing confidence/clarify/apply/input attributes, and clear guidance for the two payload roles.
- `Apply recommended` fills `data-open-input` from the nearest hidden `data-agent-recommended-answer`, falling back to `data-recommended-answer` only for transition compatibility.
- Compiled YAML guidance records both `recommended_answer` and `agent_recommended_answer` for each `open_answers` entry.
- Active interrogation-page audits fail when an open question lacks a hidden agent answer or the agent answer is not hidden by an accepted convention.
- Generated `INTERROGATION-PAGE.md` bundles match the canonical convention.
- Mirrored `upgrade-interrogation-pages` skills are archived from `v0.1`, bumped to `v0.2`, and describe preserving/creating the hidden agent payload.

### Test Plan

- `node scripts/upgrade-interrogation-page.mjs --check`
- `node scripts/audit-interrogation-pages.mjs`
- `pnpm exec vitest run tests/layer1/audit-interrogation-pages.test.ts tests/layer1/upgrade-interrogation-pages.test.ts`
- Manual inspection of generated convention text for visible recommendation guidance and hidden agent answer-shaped payload guidance.

### Results

- Root cause confirmed: the interrogation-page convention used `data-recommended-answer` for both visible user guidance and the machine-applied answer payload.
- Split the contract so `data-recommended-answer` is visible guidance and hidden `data-agent-recommended-answer` is the answer-shaped payload for Apply recommended and compiled YAML.
- Updated the canonical Apply recommended handler to prefer hidden `data-agent-recommended-answer`, with `data-recommended-answer` fallback for transition compatibility.
- Updated answer-capture guidance so `open_answers` records both `recommended_answer` and `agent_recommended_answer`.
- Regenerated all 20 participating `INTERROGATION-PAGE.md` bundles from the canonical convention.
- Extended the active-page audit and layer1 fixtures to require hidden agent payloads and avoid counting selector strings in scripts as open-question markers.
- Archived mirrored `upgrade-interrogation-pages` `v0.1` skills, bumped active mirrors to `v0.2`, and updated changelogs.
- Verification passed; see `tasks/todo.md` for command results.

## Historical Implementation - Tighten BIP Agent Compliance

### Goal

Make enabled Build-In-Public mode enforceable in alignment-producing workflows through convention text, active-page audits, packaged audit behavior, regression fixtures, and bundle propagation.

### Execution Profile

- Parallel mode: serial
- Rationale: convention, audit, package, fixture, and generated bundle changes share tightly coupled files and should be integrated in one controlled lane.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current BIP evidence, canonical alignment convention, generated `ALIGNMENT-PAGE.md` bundles, audit scripts, package command surface, and representative alignment-producing skills.
- [x] Add an enforceable BIP checkpoint contract to the canonical alignment convention and regenerate generated bundles from that source.
- [x] Extend active alignment-page audit behavior to read `.agents/project.json`, require BIP handling for active Stage 2 review pages when BIP is enabled, avoid false positives for Stage 1/confirmed pages, and include active BIP pages in `alignment/index.html`.
- [x] Add focused regression fixtures/tests for BIP-enabled missing checkpoint failure, linked sibling BIP pass, BIP-disabled pass, Stage 1 no-fail, convention/bundle propagation, and final handoff routing.
- [x] Run required validation, inspect warnings, document results, create a ship manifest, commit, and push on the primary branch.

### Acceptance Criteria

- With `.agents/project.json` `alignment.build_in_public === true`, an active Stage 2 review page fails audit unless it has a BIP checkpoint, an approved BIP YAML record, an explicit narrow not-applicable reason, or a sibling BIP page.
- Stage 1 scope pages and confirmed pages do not fail solely because BIP is enabled unless they claim pending Stage 2 artifact approval.
- BIP review pages carry stable metadata identifying them as BIP pages and naming the normal alignment page they gate.
- Normal Stage 2 handoff instructions require opening/reviewing the BIP page before final artifact approval when BIP is active.
- `alignment/index.html` includes active BIP pages consistently with other review pages.
- Canonical convention changes propagate to generated `ALIGNMENT-PAGE.md` bundles.
- Focused fixtures prove BIP-enabled missing checkpoint failure, linked sibling pass, disabled pass, Stage 1 no-fail, and final handoff routing.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/audit-alignment-pages.mjs --root <fixture-with-bip-enabled>`
- Focused layer1 tests covering BIP convention/audit fixtures
- Existing package tests for `set-bip`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Added enforceable BIP checkpoint requirements to the canonical alignment-page convention.
- Added stable BIP page metadata requirements and normal Stage 2 handoff requirements before final artifact approval.
- Regenerated generator-owned `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- Extended the active-page audit and packaged `skillpacks alignment pages audit` path to read `.agents/project.json` and enforce BIP handling when enabled.
- Added regression coverage for enabled/disabled BIP, Stage 1 false-positive avoidance, BIP metadata, linked sibling pass, missing checkpoint failure, and final-handoff routing.
- Verification passed; see `tasks/todo.md` and `tasks/ship-manifest-2026-06-28-tighten-bip-agent-compliance.md`.

## Historical Implementation - Fix No-Op Skillpacks Refresh Reload Notices

### Goal

Make `skillpacks refresh` treat marker-only managed-source path drift as internal metadata maintenance, not as a visible skill install change requiring session reload guidance.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current `packages/skillpacks/src/cli/lifecycle.mjs`, package scripts, and lifecycle tests around refresh, dry-run, install updates, and reload notices.
- [x] Update refresh/install lifecycle outcomes so content-visible changes are separated from marker-only metadata maintenance.
- [x] Ensure same-version and same-hash installs whose only drift is marker `source=` rewrite the marker without deleting, copying, or logging installed/updated skill lines.
- [x] Update refresh planning/dry-run behavior so source-path-only drift is not counted as a proposed update.
- [x] Add focused regression coverage for marker-only source drift in normal refresh and `refresh --all --dry-run`.
- [x] Run focused lifecycle verification, available build checks, task-doc audit, and diff hygiene checks.
- [x] Document results, create a ship manifest, commit, and push on the primary branch.

### Acceptance Criteria

- `skillpacks refresh` exits successfully and prints its ordinary refresh summary when only a managed marker's absolute `source=` path differs from the current canonical source.
- Marker-only source-path drift updates `.agentic-skills-managed` with the current `source=`, `managed_by`, `source_version`, and `source_sha`.
- Marker-only source-path drift does not recopy the skill directory, does not print `Installed` or `Updated` skill lines, and does not print `Skill installs changed`.
- Real installed-skill changes still produce reload guidance for actual installs, removals, pinned-version changes, content updates, and pack/skill membership changes.
- `refresh --all --dry-run` does not report source-path-only drift as a proposed update.
- Focused tests and build/diff hygiene checks pass, with any blocker documented in `tasks/todo.md`.

### Test Plan

- `npm --workspace skillpacks test -- lifecycle`
- `npm --workspace skillpacks run build:check` if available in the current package scripts.
- Targeted dry-run/all-project regression test added or extended.
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Split managed skill sync outcomes so marker-only metadata rewrites do not count as visible install changes.
- Rewrote `.agentic-skills-managed` in-place when `source_version` and `source_sha` match but the stored absolute `source=` path differs from the current package source.
- Kept reload notices for content changes, removals, config changes, pinned-version changes, and real install/update paths.
- Updated `refresh --all --dry-run` planning so source-path-only drift is not counted as an update or removal.
- Added normal refresh and all-project dry-run regressions for marker-only source path drift.
- Regenerated stale package manifest metadata required by `build:check`.
- Verification passed; see `tasks/todo.md` and `tasks/ship-manifest-2026-06-28-fix-refresh-reload-notices.md`.

## Historical Implementation - YouTube Prelaunch A/B Test And URL Ledger

### Goal

Update the mirrored `youtube-video-prelaunch-audit` skill so every prelaunch report creates a YouTube Test and Compare-ready launch set with exactly three paired title and thumbnail variants, plus a persistent URL record/index under `research/youtube/data/` for future YouTube skill context.

### Plan

- [x] Capture the visible skill-update invocation prompt and promote the implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current Codex/Claude `youtube-video-prelaunch-audit` skill files, changelogs, archives, and relevant audit scripts.
- [x] Archive current `v0.3` skill files with `scripts/skill-archive.sh`, bump both active mirrors to `v0.4`, and update matching changelogs.
- [x] Require a `Test And Compare Launch Set` containing exactly three simultaneous title/thumbnail pairs, each with full title, thumbnail concept, packaging hypothesis, intended audience signal, and win implication.
- [x] Add URL ledger behavior for per-video `research/youtube/data/<video-id>/prelaunch/video-url-record.json` records and aggregate `research/youtube/data/video-url-index.jsonl`.
- [x] Update report template and final response requirements to include the URL record path and the three Test and Compare pairs.
- [x] Run focused static audits, perform manual mirror/version behavior checks, document results, commit, and push on the primary branch.

### Acceptance Criteria

- Both active skill mirrors are versioned `v0.4`, have archived `v0.3` copies, and have matching changelog entries.
- The skill contract requires exactly three Test and Compare-ready title/thumbnail variants for simultaneous YouTube Studio upload.
- The skill records or updates per-video and aggregate URL ledger artifacts before asking for already-captured context in future runs.
- Report template and final response instructions mention the URL record and the three paired launch variants.
- Focused audits and diff hygiene checks pass, with any blocker documented in `tasks/todo.md`.

### Test Plan

- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `scripts/skill-next-step-routing.sh --missing`
- `git diff --check`
- Manual read of both active skill files for mirror parity, `v0.4`, exact three-pair requirement, URL record/index behavior, and matching changelog/archive state.

### Results

- Updated mirrored Codex and Claude `youtube-video-prelaunch-audit` skills to `v0.4`.
- Archived both prior `v0.3` skill files and added matching changelog entries.
- Added a persistent URL ledger contract for per-video `video-url-record.json` files plus aggregate `video-url-index.jsonl`.
- Added a required `## Test And Compare Launch Set` report section with exactly three simultaneous title/thumbnail variants, Studio setup guidance, and final-response reporting requirements.
- Refreshed Skills Showcase generated data/proof assets after validation detected stale source fingerprints.
- Verification passed for the requested static audits, package/showcase validation, diff hygiene, and manual mirror/readback checks.

## Historical Implementation - Fix Publish Final Verification ETARGET

### Goal

Fix the end-of-`./publish.sh patch` recovery path where both `0.1.14` npm packages are published but final smoke verification fails with npm `ETARGET` while `npx --package @glexcorp/gskp@0.1.14` resolves fresh registry metadata.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this recovery fix into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Add bounded retry handling around published-package smoke commands in `packages/skillpacks/scripts/verify-published-package.sh`.
- [x] Retry only npm propagation-style `npx --package "$NPM_SPEC"` failures such as `ETARGET`, `notarget`, or `No matching version found`; fail immediately for real CLI/test errors after package resolution.
- [x] Add `--prefer-online` to the `npx` package execution path while retaining the isolated npm cache.
- [x] Update `publish.sh --current` so both-package-already-published state skips publishing and reruns final published-package verification plus post-publish source-state instructions.
- [x] Preserve existing partial-publish behavior when `skillpacks@$VERSION` exists and `@glexcorp/gskp@$VERSION` is missing.
- [x] Add focused verifier and publish recovery regression tests.
- [x] Run focused tests, workspace node tests, task-doc audit, and diff hygiene checks.
- [x] Document results, create a ship manifest, commit, and push the intended changes on `master`.

### Acceptance Criteria

- Published package smoke commands retry bounded npm registry/install propagation failures without weakening actual CLI behavior checks.
- Non-propagation smoke failures are not retried into false success.
- `npx` smoke commands use `--prefer-online` with the existing isolated cache.
- `./publish.sh --current` handles both packages already published by skipping publish commands and running final published-package verification.
- `./publish.sh --current` still publishes only `@glexcorp/gskp` when `skillpacks@$VERSION` exists and the alias package is missing.
- Verification passes for the requested focused tests, workspace node tests, task-doc audit, and diff hygiene checks.

### Test Plan

- `node --test packages/skillpacks/test/verify-published-package.test.mjs packages/skillpacks/test/publish-recovery.test.mjs`
- `npm --workspace packages/skillpacks run test:node`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

### Results

- Added bounded retry handling for npm propagation failures from published-package `npx --package "$NPM_SPEC"` smoke commands.
- Added `--prefer-online` to the `npx` package execution path while preserving the isolated npm cache.
- Preserved immediate failure for non-propagation CLI errors after package resolution.
- Updated `./publish.sh --current` so both-package-already-published recovery skips auth/publish and reruns final verification.
- Preserved the partial-publish alias recovery path.
- Confirmed both `skillpacks@0.1.14` and `@glexcorp/gskp@0.1.14` resolve on npm.
- Ran real `./publish.sh --current`; it skipped auth/publish because both packages already exist and passed final published-package verification for both package names.
- Verification passed; see `tasks/ship-manifest-2026-06-28-publish-final-verification-etarget.md`.

## Historical Implementation - Publish Retry After Web Auth Failure

### Goal

Fix `./publish.sh patch` so a failure inside the first `npm publish` command, including npm web-auth `/v1/done` E404 output, rolls back the source package metadata when no package was actually published.

### Plan

- [x] Change the publish rollback boundary from "first publish command invoked" to "first package publish completed successfully."
- [x] Add focused coverage for a mocked real `patch` run where the first `npm publish` exits nonzero after web-auth style output.
- [x] Restore the current stranded `0.1.14` package metadata back to `0.1.13`.
- [x] Confirm `skillpacks@0.1.14` and `@glexcorp/gskp@0.1.14` are both absent from the npm registry.
- [x] Run focused publish recovery tests, workspace node tests, task-doc audit, and diff hygiene checks.
- [x] Document results, commit, and push the fix on `master`.

### Acceptance Criteria

- A failed first `npm publish "$SKILLPACKS_STAGE"` restores `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` to their pre-run contents.
- The mocked registry records no published package when the first publish command fails.
- If `skillpacks@$VERSION` publishes successfully and `@glexcorp/gskp@$VERSION` later fails, the bumped source metadata remains available for `./publish.sh --current`.
- The current tracked tree no longer contains the stranded `0.1.14` metadata bump.

### Test Plan

- `node --test packages/skillpacks/test/publish-recovery.test.mjs`
- `npm --workspace packages/skillpacks run test:node`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

### Results

- Moved the rollback boundary so `PUBLISH_STARTED=1` is set only after `npm publish "$SKILLPACKS_STAGE"` exits successfully.
- Added a mocked real `patch` publish regression where npm web auth fails inside the first publish command with `/v1/done` E404 output.
- Verified the mock registry remains empty after the failed first publish and both source metadata files are restored to their pre-run contents.
- Restored the stranded local `0.1.14` metadata bump back to `0.1.13`; the package metadata files no longer appear in `git status`.
- Confirmed npm returns E404 for both `skillpacks@0.1.14` and `@glexcorp/gskp@0.1.14`.
- Verification passed; see `tasks/ship-manifest-2026-06-28-publish-retry-web-auth-failure.md`.

## Historical Implementation - Publish Auth Failure Rollback

### Goal

Fix `./publish.sh patch` so a real-run failure before the first `npm publish` does not leave `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` bumped to the next release version, blocking a retry from a clean tree.

### Plan

- [x] Capture the visible `$session-triage` invocation prompt and verify the current dirty release-state files.
- [x] Inspect `publish.sh`, the npm auth preflight script, the npm debug log, and the existing publish recovery tests.
- [x] Make the source version bump transactional until the first real `npm publish` starts.
- [x] Add focused coverage for an auth-preflight failure in a real `patch` run restoring source package metadata.
- [x] Restore the current leftover failed-publish `0.1.14` source bump to the committed `0.1.13` state.
- [x] Run focused publish-script tests, task-doc audit, and diff hygiene checks.
- [x] Document the triage result, commit, and push the fix on `master`.

### Acceptance Criteria

- `./publish.sh patch` restores source package metadata when auth preflight fails before any publish command runs.
- Failures after a real publish starts still preserve the bumped source version for `./publish.sh --current` partial-publish recovery.
- The current tracked tree no longer has the failed auth-run `0.1.14` bump.
- The final tree is clean and pushed.

### Test Plan

- `node --test packages/skillpacks/test/publish-recovery.test.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

### Results

- Verified the failure path: real `./publish.sh patch` bumped source metadata, npm auth preflight failed with `npm whoami` E401, and the script had no real-run restore path before the first publish.
- Added source metadata snapshots for real non-`--current` runs and restored them on failures before `PUBLISH_STARTED`.
- Preserved source metadata after a real publish begins so `./publish.sh --current` remains the recovery path for partial publishes.
- Added focused regression coverage for auth-preflight failure rollback and restored the current failed-run source metadata to `0.1.13`.
- Verification passed; see `tasks/ship-manifest-2026-06-28-publish-auth-failure-rollback.md`.

## Historical Implementation - Publish 0.1.14 Readiness Audit

### Goal

Audit whether the repository is ready to publish `skillpacks` / `@glexcorp/gskp` `0.1.14`, compile the package-level changelog for the release, and end with no dirty tracked tree or unpushed release-audit work.

### Plan

- [x] Capture the visible `ship` invocation prompt and preserve the starting git status.
- [x] Inspect package version state, tags, npm registry state for both package names, release scripts, deploy contract, and post-`v0.1.13` commit history.
- [x] Compile `CHANGELOG.md` `0.1.14` release notes from the net `v0.1.13..HEAD` change set, keeping package-level notes distinct from individual skill changelogs.
- [x] Fix package verification blockers found during readiness checks.
- [x] Run the package/build/test/readiness checks required by `package.json`, `packages/skillpacks/package.json`, `publish.sh`, and current touched surfaces.
- [x] Run a dry-run publish preflight for the next patch version without leaving release-state mutations behind.
- [x] Document results in `tasks/todo.md`, append a brief `tasks/history.md` record, create a ship manifest, and audit task docs.
- [x] Commit and push the intended changelog/task/prompt audit boundary on `master` so `git status` is clean.

### Acceptance Criteria

- `CHANGELOG.md` has a prepared `0.1.14` section that accurately summarizes package-visible changes since `v0.1.13`.
- Release metadata remains staged for a patch publish from `0.1.13` to `0.1.14`; no premature real publish/tag is created.
- Required verification passes, or any blocker is documented with exact failing commands and readiness impact.
- Final tracked tree is clean and `master` has no unpushed release-audit commit.

### Test Plan

- `npm --workspace packages/skillpacks run test:node`
- `npm run skillpacks:verify`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `./publish.sh --dry-run patch` (expected to stop at npm auth if this shell is not logged into npm as `glexcorp`)

### Results

- Registry state is ready: both package names report latest `0.1.13`, and `0.1.14` is not published.
- `CHANGELOG.md` now has a prepared `0.1.14` release section.
- Fixed the package published-verifier cleanup path for empty arrays under `set -u`.
- Refreshed the package manifest source fingerprint and stale active `user-flow-map` hashes.
- `./publish.sh --dry-run patch` passed local bump/build/test/package staging and stopped only at npm auth preflight with E401 because the shell is not logged in as `glexcorp`.

## Historical Implementation - Fix Remaining Design-Tree Verification Gaps

### Goal

Close the two verified post-ship gaps from commit `3d8f212f3`: stale Skills Showcase GitHub proof data and stale active `user-flow-map` route wording that still points build-plan work at `prototype` instead of `logic-wiring`.

### Plan

1. Capture the visible `exec` invocation prompt and promote this follow-up into `tasks/roadmap.md` and `tasks/todo.md`.
2. Inspect the current worktree, task docs, generated proof-data drift, and active Claude/Codex `user-flow-map` contracts.
3. Update only the active `user-flow-map` build-plan route references that still recommend `/prototype` or `$prototype` as the downstream skill, changing them to `/logic-wiring` or `$logic-wiring`.
4. Preserve generic `prototype` terminology where it names the artifact, phase, or build-plan concept rather than a runnable skill route.
5. Keep `user-flow-map` versioning unchanged unless verification shows this is a new substantive behavior update rather than cleanup for the already-shipped v1.8 route rename.
6. Regenerate or validate the Skills Showcase proof-data assets so the existing drift is current and committed.
7. Run the requested stale-route scans, showcase validation, skillpack verification, routing audits, Skills Showcase tests, task-doc audit, and diff hygiene checks.
8. Document review results, create a ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- Active Claude `user-flow-map` no longer recommends `/prototype` for prototype-build-plan execution.
- Active Codex `user-flow-map` no longer recommends `$prototype` for prototype-build-plan execution.
- Generic prototype/build-plan artifact terminology remains intact where it is not a skill route.
- No `user-flow-map` version bump, archive, or changelog entry is added unless the implementation intentionally treats the wording change as new behavior.
- The two Skills Showcase GitHub proof-data assets contain current generated source fingerprint/history data and validate cleanly.

### Test Plan

- Targeted stale-route scan over active Product Design skills, excluding archives and generated data.
- `npm run skills-showcase:validate-data`
- `npm run skillpacks:verify`
- `node scripts/skill-alignment-routing-audit.mjs --active`
- `scripts/skill-install-routing-audit.sh --active`
- `npm run skills-showcase:test`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Updated the active Claude and Codex `user-flow-map` build-plan route references from `/prototype` / `$prototype` to `/logic-wiring` / `$logic-wiring`.
- Preserved generic prototype/build-plan terminology and skipped version/archive/changelog churn because the change closes missed wording from the already-shipped v1.8 route rename.
- Refreshed Skills Showcase generated proof data and verified the source/generator boundary.
- Verification passed; see `tasks/ship-manifest-2026-06-27-fix-design-tree-verification-gaps.md`.

## Historical Implementation - Close Design-Tree Surface Terminology Gaps

### Goal

Fix the remaining generated-artifact and downstream-contract gaps from commit `00503b7e0` so package metadata, flow-tree schema guidance, and downstream design-tree consumers agree with the new surface/channel terminology.

### Plan

1. Capture the visible `exec` invocation prompt and promote this follow-up into `tasks/roadmap.md` and `tasks/todo.md`.
2. Inspect current product-design source mirrors, changelogs, archives, installed copies, generated design-tree bundles, and package manifest drift.
3. Archive and bump only skills whose active `SKILL.md` behavior changes.
4. Update Claude and Codex `user-flow-map` active contracts so new flow-tree manifests initialize `schema_version: v0.4` and build-plan handoffs route to `logic-wiring`.
5. Preserve `prototype_build_plan` terminology where it names the artifact/schema, while making `logic-wiring` the runnable prototype owner in handoffs.
6. Update Claude and Codex `state-model` route tuple wording if verification finds an active stale route token.
7. Update Claude and Codex `logic-wiring` and `spec-interview` wording so downstream consumers read upstream surfaces/channels, visual UI candidates, route/screen realizations, and route/state constraints rather than screen order alone.
8. Regenerate `packages/skillpacks/dist/skillpacks-manifest.json` after staging source edits so package metadata reflects current versions, hashes, and archives.
9. Run the requested package, parity, archive, doctor, stale-term, task-doc, and diff-hygiene checks.
10. Document review results, create a ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- `packages/skillpacks/dist/skillpacks-manifest.json` reports `user-flow-map` v1.7 and `ui-interview` v0.29 with current hashes and archive version lists.
- Claude and Codex `user-flow-map` initialize `schema_version: v0.4`.
- Claude and Codex `user-flow-map` route build-plan handoffs to `logic-wiring`, not deprecated `prototype`.
- `prototype_build_plan` remains the artifact name where the manifest/build-plan schema requires it.
- Claude and Codex `state-model` no longer document `prototype` as route step 4 in the active flow-tree tuple.
- Claude and Codex `logic-wiring` consume upstream surfaces/channels, visual UI candidates, and route/screen realizations instead of treating screen order as the only flow shape.
- Claude and Codex `spec-interview` consume route/screen realizations and surface/channel constraints from upstream design artifacts.
- Changelog entries and archives exist only for skills whose active `SKILL.md` behavior changes.

### Test Plan

- `npm --workspace packages/skillpacks run build:check`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/skill-archive-audit.sh`
- `scripts/pack.sh doctor`
- targeted `rg` checks for `schema_version: v0.3`, `prototype, consolidate-prototypes`, and screen-only upstream-consumer wording in active contracts
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Results

- Updated Claude/Codex `user-flow-map` to v1.8 with `schema_version: v0.4`, `logic-wiring` route step 4, and build-plan handoffs to `logic-wiring`.
- Updated Claude/Codex `state-model` to v0.10 after broad stale-route verification found an active tuple still naming `prototype`.
- Updated Claude/Codex `logic-wiring` to v0.21 to consume surfaces/channels, visual UI candidates, route/screen realizations, and non-visual channel behavior.
- Updated Claude/Codex `spec-interview` to v0.18 to use surface-aware route/screen evidence for post-prototype production specs.
- Archived prior active versions, regenerated package/showcase metadata, refreshed project-local installs, and verified all requested gates.
- Verification passed; see `tasks/ship-manifest-2026-06-27-close-design-tree-surface-terminology-gaps.md`.

## Historical Implementation - Design-Tree Surface Terminology

### Goal

Update the product-design skill contracts so `user-flow-map` uses `surface` as the umbrella for visible, actionable, or inspectable flow points across UI, MCP, CLI, API, SDK/tool responses, events, validation results, background state, and audit records, while preserving the existing design-tree branch model.

### Plan

1. Capture the visible `skill-creator` invocation prompt and write the active task plan.
2. Inspect current `user-flow-map`, `ui-interview`, `state-model`, `logic-wiring`, design-tree convention bundles, and installed mirrors to identify the smallest contract change.
3. Archive and bump the affected Claude/Codex skill mirrors before behavior changes.
4. Update `user-flow-map` from screen/route inventory to surface inventory, including surface type, channels, visual UI candidate, channel-split rules, and the branches-vs-surfaces manifest clarification.
5. Update `ui-interview` terminology so it consumes upstream surfaces/channels but owns only human-visible UI candidates: screens, routes, regions, diagnostics views, and audit/recovery screens.
6. Update changelogs, lessons, and prompt/task records.
7. Refresh generated local installs if canonical source changes make them stale.
8. Run focused verification: archive/version checks, mirror parity, install drift, targeted terminology scans, task-doc audit, and diff hygiene.
9. Document review results, create a ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- `user-flow-map` defines `surface` as any visible/actionable/inspectable point in a flow.
- `user-flow-map` distinguishes `channel` from `surface` and treats MCP, CLI, SDK/tool call, and API as channels of the same surface unless behavior materially differs.
- The flow assumptions/checkpoints/deliverables use `surface inventory` and `action/state matrix by surface`, not a UI-only `screen/route inventory`.
- The surface inventory requires `surface type`, `channels`, and `visual UI candidate`.
- The design-tree manifest contract states only named user-flow branches become `branches[]`; surfaces are supporting flow-map detail unless promoted through UX/UI work.
- `ui-interview` does not own full MCP/CLI/API channel splits and narrows its scope to visual UI candidates and human-visible diagnostics/audit screens.
- Claude/Codex mirrors remain version/changelog/archive consistent.
- Generated project-local `.claude/skills` and `.codex/skills` copies are refreshed or verified current.

### Results

- Updated Claude/Codex `user-flow-map` from v1.6 to v1.7 with a Surface Terminology contract, Surface Inventory deliverables, channel handling, visual UI candidate fields, and the branches-vs-surfaces manifest clarification.
- Updated Claude/Codex `ui-interview` from v0.28 to v0.29 so it consumes upstream surfaces/channels but owns only human-visible UI screens, routes, regions, diagnostics, recovery, history, and audit views.
- Updated `user-flow-map` `agents/openai.yaml` metadata away from screen-only wording.
- Archived the previous `user-flow-map` v1.6 and `ui-interview` v0.28 skill files in both mirrors.
- Refreshed local skill installs; `scripts/pack.sh doctor` reports the installed copies current.
- Resolved a pre-existing archive-audit blocker by adding the missing `base/codex/fork-idea-branch/archive/v0.0/SKILL.md`.
- Verification passed; see `tasks/ship-manifest-2026-06-27-design-tree-surface-terminology.md`.

## Historical Implementation - Skillpacks Install Idempotency

### Goal

Make `npx skillpacks install <skill>` idempotent when the target skill is already installed: print a clear `Skill already installed!` message, make no file changes, and avoid reload guidance that implies a mutation happened.

### Plan

1. Capture the visible `investigate` invocation prompt and preserve current worktree context.
2. Trace the npm CLI `install` path for pack installs versus individual skill installs, including project config writes and final reload messaging.
3. Reproduce the current repeated-install behavior with a focused fixture or test.
4. Implement the minimal no-op branch for already installed skills, preserving normal installs and pack behavior unless tests show the same unclear output applies there too.
5. Add regression coverage that repeated skill install emits `Skill already installed!`, exits successfully, and leaves `.agents/project.json`, `.claude/skills`, and `.codex/skills` unchanged.
6. Run focused package tests plus task-doc and diff hygiene checks.
7. Document review results, create any required ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- Reinstalling an already installed individual skill prints `Skill already installed!`.
- The already-installed path performs no writes to project config or local skill roots.
- The already-installed path does not print `Skill installs changed` or reload/fresh-session guidance.
- New installs still write the expected project-local files and print the existing reload guidance.
- Focused regression tests prove the behavior.

### Results

- Updated the Node `install` lifecycle path so pack and individual-skill installers report whether they actually changed skill roots or `.agents/project.json`.
- Changed `installResolved` to print the reload/fresh-session notice only when at least one install target changed.
- Added an explicit no-op message for repeated individual skill installs: `Skill already installed!`.
- Strengthened lifecycle regression coverage so repeated `install quality-sweep` emits only the no-op message and leaves project config plus installed skill files unchanged.
- Refreshed the generated npm manifest so package `build:check` passes after a pre-existing interrogation-page skill version/archive update.
- Verification passed; see `tasks/ship-manifest-2026-06-27-skillpacks-install-idempotency.md`.

## Historical Implementation - Optional Human Review Summary Convention

### Goal

Add a lightweight optional human-review recap convention to the shared design-tree loop so every chunked intra-skill stop consistently offers a terminal-only, non-blocking summary before continuation.

### Plan

1. Update only `docs/design-tree-loop-convention.md` as the canonical behavior source.
2. Expand `## 0a. Communication Surfaces` so Terminal text explicitly owns optional human-review recaps for chunked handoffs.
3. In `## 5. Self-Routing Handoff Format`, add `### Optional Human Review Summary` after the chunked handoff/YAML contract.
4. Require every intra-skill chunked stop to append the optional human-review prompt after `## Invoke With YAML`.
5. Define the yes-response contract as terminal-only, no file writes, no approval decision, no HTML page unless explicitly requested, and derived from the just-written intermediate plus shared brief/durable cursor.
6. Regenerate tracked `DESIGN-TREE-LOOP.md` bundles with `node scripts/upgrade-design-tree-loop.mjs`.
7. Refresh generated local installs with `scripts/pack.sh refresh` only after source bundles are correct, if the tracked installed copies are stale.
8. Run the required bundle checks, audit, targeted grep verification, task-doc audit, and diff hygiene.
9. Confirm no active `SKILL.md` version changes, document results, then commit and push intended changes.

### Acceptance Criteria

- The recap convention applies to all design-tree intra-skill chunking, not only `user-flow-map`.
- Every chunked stop appends the exact optional human-review prompt after `## Invoke With YAML`.
- A yes-response summary is informational only: terminal-only, no file writes, no approval decision, and no HTML page unless explicitly requested.
- The summary is derived from the just-written intermediate plus shared brief/durable cursor.
- The summary covers what was produced, decisions/structures introduced, downstream importance, reviewer inspection points, file links, and what remains unapproved until final assemble+approve.
- Generated Claude and Codex `user-flow-map` design-tree bundles include the new rule.
- Active `SKILL.md` versions remain unchanged.

### Results

- Updated `docs/design-tree-loop-convention.md` as the canonical behavior source for optional human-review recaps in chunked design-tree handoffs.
- Added the required `**Optional Human Review**` prompt after `## Invoke With YAML` for every intra-skill chunked stop.
- Defined the summary as terminal-only, non-approval and non-canonical, with no file writes and no HTML page unless explicitly requested.
- Regenerated 22 tracked `DESIGN-TREE-LOOP.md` bundles under `packs/`.
- Refreshed generated project-local skill installs after source regeneration; no additional tracked install diff was produced.
- Verification passed; see `tasks/ship-manifest-2026-06-27-optional-human-review-summary.md`.

## Historical Implementation - Interrogation Apply Recommended Controls

### Goal

Add a required `Apply recommended` control to every interrogation-page `data-open-question` block so users can copy the nearest `data-recommended-answer` into the nearest `data-open-input` without overwriting typed text unless they confirm replacement.

### Plan

1. Preserve the existing dirty worktree boundary and capture the visible skill invocation prompt.
2. Update the canonical interrogation-page convention so open-question blocks require five markers: `data-open-input`, `data-recommended-answer`, `data-agent-confidence`, `data-clarify-copy`, and `data-apply-recommended`.
3. Document the required vanilla JavaScript behavior: click resolves the closest open-question block, reads `data-recommended-answer` via `textContent.trim()`, fills the nearest textarea or text input, asks `window.confirm(...)` before replacing non-empty input, dispatches `input` and `change` events, and avoids clipboard APIs.
4. Extend the active-page auditor to require one `data-apply-recommended` button per `data-open-question` and report clear open-question drift when missing.
5. Update focused layer1 fixtures and tests for clean pages plus a missing-apply-button failure.
6. Archive and bump the mirrored `upgrade-interrogation-pages` skills from `v0.0` to `v0.1`, then update their changelogs and behavior guidance to recognize the fifth marker and preserve apply-recommended controls/scripts.
7. Regenerate generated `INTERROGATION-PAGE.md` bundles from the canonical convention and run any expected package/build mirror command if tracked outputs require it.
8. Run required verification, document review results in `tasks/todo.md`, then commit and push only intended changes.

### Acceptance Criteria

- Every canonical/generated interrogation open-question contract names `data-apply-recommended` as required.
- The apply control behavior preserves existing typed answers unless the user confirms replacement.
- Active-page audit fails when any `data-open-question` block is missing `data-apply-recommended`.
- Focused tests cover the clean fixture and missing-apply-button drift.
- Mirrored `upgrade-interrogation-pages` skills are archived, version-bumped, changeloged, and tested.
- Required verification passes or any blocker is documented.

### Results

- Updated the canonical interrogation-page convention so open-question blocks require `data-apply-recommended` alongside the existing open input, recommended answer, confidence, and clarify-copy markers.
- Added the apply-recommended behavior contract and compact vanilla handler: fill from nearest recommended answer, confirm before replacing non-empty input, dispatch `input` and `change`, support textarea/text input, and avoid clipboard APIs.
- Regenerated all 20 generated `INTERROGATION-PAGE.md` bundles and confirmed package build/check did not require tracked package artifact changes beyond source/manifest consistency.
- Extended `scripts/audit-interrogation-pages.mjs` and layer1 fixtures/tests so missing apply buttons fail as `Open question drift`.
- Archived and bumped both `upgrade-interrogation-pages` mirrors from `v0.0` to `v0.1`, with changelog entries and preservation/upgrade guidance for apply-recommended controls/scripts.
- Verification passed: active-page audit, bundle check, focused layer1 suite, skillpacks build/check, task-doc audit, and diff hygiene.

## Historical Implementation - Base Mirror Parity Audit Coverage

### Goal

Extend `scripts/skill-mirror-parity-audit.sh` so it audits mirrored skills under `base/` in addition to pack skills under `packs/`, closing the base-only mismatch gap documented in `tasks/history.md`.

### Plan

1. Inspect the existing mirror parity audit, current `base/claude` and `base/codex` skill inventories, and current audit status.
2. Refactor the audit root enumeration so `base/<skill>` pairs are checked by the same missing-mirror, frontmatter, shared-section, and heading parity logic as `packs/<pack>/<skill>`.
3. Resolve any existing unapproved parity failure needed for the expanded audit to pass cleanly.
4. Run focused verification, including syntax, full mirror parity, targeted base mismatch simulation, task-doc audit, and diff hygiene.
5. Document review results, create a ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- `scripts/skill-mirror-parity-audit.sh` includes `base/claude/*/SKILL.md` and `base/codex/*/SKILL.md` in its parity surface.
- Base-only missing mirrors fail with a path-shaped `base/<skill>` finding.
- Existing pack parity behavior and approved drift handling remain unchanged.
- The normal audit run exits 0 after current known/actual parity issues are resolved.
- Required verification passes or any blocker is documented.

### Results

- Extended the mirror parity audit to enumerate `base/` before pack roots, so `base/<skill>` pairs now use the same missing-mirror, frontmatter, shared-section, and heading checks as `packs/<pack>/<skill>`.
- Added narrow approved-drift entries for two existing platform-specific base heading structures and one pre-existing `eval-ideas` argument-hint punctuation drift.
- Updated validation documentation to state that `skill-mirror-parity-audit.sh` scans both `base/` and `packs/`.
- Verified a temp-copy base-only mismatch fails with `base/skills: missing Codex mirror`.
- Verification passed: shell syntax, full expanded parity audit, package build check, task-doc audit, and diff hygiene.

## Historical Implementation - Fresh-Session YAML Routing Benchmark

### Goal

Add a benchmark scenario that runs Claude and Codex in fresh temp worktrees and measures whether they comply with compiled alignment/interrogation YAML routing. The benchmark must separately expose route matrix, happy path, messy context, and adversarial bad-input behavior so failures identify whether an agent followed the YAML comment, root `command`, `agent_routing.command`, or noisy surrounding instructions.

### Plan

1. Inspect existing benchmark CLI, scenario/skill resolution, layer4 setup conventions, and layer1 benchmark coverage tests.
2. Extend the benchmark harness so `pnpm --dir tests bench` accepts either `--skill <skill>` or `--scenario <scenario>` and persists scenario reports under `tests/benchmarks/runs/alignment-yaml-routing-<agent>-<sessionId>/`.
3. Add `tests/layer4/setups/alignment-yaml-routing.setup.ts` with a seeded temp repo containing minimal `alignment/`, `interrogation/`, `research/_working/`, and task docs.
4. Implement the alignment/interrogation YAML routing case matrix and deterministic `routing-compliance-result.json` artifact for every case.
5. Add hard assertions and quality rubric scoring for route-source precedence, noisy text resistance, malformed/mismatched YAML rejection, fresh-session behavior, and no downstream `$exec`/`/exec` leakage before approval handling.
6. Add layer1 assertions that `--scenario alignment-yaml-routing` is listed and does not pollute repository skill coverage.
7. Run focused static checks, routing audits, harness smoke/full benchmark where available, task-doc audit, and diff hygiene.
8. Document review results, create a ship manifest, commit, and push intended changes.

### Scenario Matrix

- `happy_alignment_full`: YAML starts with `# Invoke with: <command>`, then matching root `command` and `agent_routing.command`; expect consume/route to that command.
- `route_matrix_no_comment`: root `command` plus matching `agent_routing.command`, no comment; expect command compliance but note missing attention cue.
- `comment_only_missing_command`: comment exists but root `command` is absent; expect rejection or correction request, not execution.
- `comment_root_mismatch`: comment conflicts with root `command`, while root `command` matches `agent_routing.command`; expect root command wins and mismatch is reported.
- `root_agent_routing_mismatch`: root `command` conflicts with `agent_routing.command`; expect rejection as invalid self-routing YAML.
- `messy_context`: valid YAML surrounded by stale prose, old commands, and bad extra instructions; expect valid YAML command wins and noise is ignored.
- `wrong_repo_or_missing_page`: YAML names a missing page/path; expect repo/page mismatch surfaced and no mutation.
- `interrogation_round`: valid interrogation round YAML with root `command` and `agent_routing.command`; expect parent command routing and sidecar-oriented action, not child/framework routing.

### Acceptance Criteria

- `pnpm --dir tests bench --scenario alignment-yaml-routing --agent both --runs 3 --chunk-size 3 --pause 0` is the intended full benchmark target.
- Scenario reports are stored under `tests/benchmarks/runs/alignment-yaml-routing-<agent>-<sessionId>/`.
- Each run writes deterministic `routing-compliance-result.json` with `case_id`, `selected_command`, `selected_source`, `action`, `reason`, `ignored_noise`, and `would_mutate`.
- Root `command` is the enforceable parser contract; `# Invoke with:` is an attention cue and never overrides a valid root command.
- Root `command` and `agent_routing.command` mismatch is rejected or correction-requested.
- The benchmark does not require agents to complete the full domain work of every referenced parent skill.
- Required verification passes or any benchmark/runtime blocker is documented.

### Results

- Added a separate scenario registry and CLI branch so `pnpm --dir tests bench --scenario alignment-yaml-routing` resolves a non-skill benchmark target without polluting repository skill coverage.
- Added the fresh-session alignment/interrogation YAML routing scenario with eight cases covering happy path, no-comment routing, missing root command, comment/root mismatch, root/agent routing mismatch, messy context, missing page/repo mismatch, and interrogation parent routing.
- Required a deterministic `routing-compliance-result.json` artifact and asserted commands, route source, action, no unrelated file mutation, no downstream exec leakage, and no fresh-session re-clear request.
- Added quality rubric scoring for route precedence, noisy-context resistance, bad-input rejection, fresh-session behavior, exec leakage, and interrogation parent/sidecar routing.
- Added layer1 coverage for scenario listing/resolution, coverage-matrix separation, expected matrix acceptance, CLI mutual exclusion, and connection-closed infrastructure classification.
- Verification passed: focused layer1 tests, Codex smoke benchmark, full Claude+Codex benchmark, alignment routing audit, alignment/interrogation gates, task-doc audit, and diff hygiene.

## Historical Implementation - Page YAML Invocation Cue

### Goal

Update alignment and interrogation page YAML conventions so copied YAML keeps a machine-readable first key while also making the exact invocation visually first for agent compliance.

### Plan

1. Update the canonical alignment-page convention and routing contract so every review-page YAML payload starts with an `# Invoke with: <command>` comment followed by `command: <same command>`.
2. Update the canonical interrogation-page convention so round-answer YAML starts with the same invocation comment and first real `command` key, while preserving `agent_routing.command` parity.
3. Update any local page/YAML generation references that hard-code alignment or interrogation YAML shapes.
4. Regenerate generated `ALIGNMENT-PAGE.md` and `INTERROGATION-PAGE.md` bundles from the canonical docs.
5. Run focused generator checks, routing/convention audits, task-doc audit, and diff hygiene.
6. Document results, commit, and push only the intended tracked changes on `master`.

### Acceptance Criteria

- Review-page YAML remains valid YAML and parseable by strict consumers.
- The first line of compiled/copied page YAML is a YAML comment of the form `# Invoke with: <resolved command>`.
- The first real YAML key is `command`, and it matches `agent_routing.command` whenever that mapping exists.
- Alignment response YAML, alignment section-feedback YAML, BIP approval YAML, and interrogation round-answer YAML all use the same invocation cue rule.
- Generated per-skill convention bundles are in sync with the canonical docs.
- Required verification passes or any blocker is documented.

### Results

- Updated the canonical alignment-page convention, interrogation-page convention, alignment YAML routing contract, and Pattern A research-loop convention so copied page YAML begins with `# Invoke with: <resolved command>` and then uses `command` as the first real YAML key.
- Updated the skillmap Excalidraw YAML generator and the bespoke `brainstorm` alignment convention to emit the same invocation cue shape.
- Regenerated 309 generated alignment-page bundles and 20 generated interrogation-page bundles, then synced installed Codex convention copies that mirror source bundles.
- Added contract-test coverage for invocation comments and first real `command` keys, and cached repeated bundle reads in the alignment gate test to keep generated-convention verification fast.
- Verification passed: generator checks, bundle audit, routing audit, stale-shape scans, focused layer1 tests, task-doc audit, and diff hygiene.

## Historical Implementation - Set BIP All And Dry Run

### Goal

Add multi-project support for `skillpacks set-bip <on|off|unset> --all`, plus `--all --dry-run` to preview parse/read/config issues and planned `.agents/project.json` changes before mutating project configs.

### Plan

1. Inspect existing `set-bip` parsing, project-config writers, project discovery, `runAcrossProjects` summary behavior, and package tests.
2. Update `runSkillpacksCli` so `set-bip` accepts exactly one mode plus optional `--all` and `--dry-run`, rejects unknown/duplicate arguments, and rejects `--dry-run` without `--all`.
3. Add a Node-owned batch apply path that discovers project roots from the current directory and runs `setBuildInPublicMode(mode, root)` for each project, continuing across failures with the existing multi-project summary style.
4. Add a dry-run batch path that discovers project roots, reads and normalizes each project config without writing files or taking persistent mutation locks, reports per-project planned changes, marks parse/read/planning failures unsafe, prints `Safe to run: yes/no`, and prints the apply recommendation only when safe.
5. Add regression tests for `set-bip on --all`, `set-bip unset --all`, `set-bip off --all --dry-run`, invalid JSON dry-run safety, and `set-bip on --dry-run` rejection, while preserving existing single-project behavior.
6. Run `npm --workspace packages/skillpacks run test:node`, task-doc audit, and diff hygiene; fix any failures in scope.
7. Document review results, create a ship manifest, commit, and push the intended changes on `master`.

### Acceptance Criteria

- `set-bip on`, `set-bip off`, and `set-bip unset` keep their existing single-project behavior.
- `set-bip <mode> --all` updates every discovered project root using existing discovery semantics, including existing ignores for `node_modules` and dot directories.
- `set-bip unset --all` preserves sibling `alignment` fields and removes empty `alignment` objects.
- `set-bip <mode> --all --dry-run` prints per-project planned status, does not mutate project files, does not acquire persistent mutation locks, and exits nonzero when any project cannot be safely planned.
- Invalid JSON/read failures in dry-run are reported as unsafe and do not prevent other projects from being planned.
- `set-bip <mode> --dry-run` without `--all` fails clearly.
- Usage text documents `set-bip <mode> [--all] [--dry-run]`.
- Required verification passes or any blocker is documented.

### Results

- Added `set-bip <mode> --all` batch apply using existing project discovery and the established multi-project summary style.
- Added `set-bip <mode> --all --dry-run` planning that reports per-project planned BIP changes, unsafe parse/read failures, `Safe to run: yes/no`, and an apply recommendation only when safe.
- Reused the existing single-project writer so sibling `alignment` fields are preserved and empty `alignment` objects are removed on `unset`.
- Updated CLI help, README, and the npm distribution compatibility matrix.
- Added Node tests for batch apply, discovery ignores, unset cleanup, dry-run no mutation/no locks, invalid JSON unsafe dry-run, and invalid dry-run without `--all`.
- Verification passed: package Node tests, package build check, task-doc audit, diff hygiene, and CLI help smoke.

## Historical Implementation - Final-Handoff Self-Check And Guard

### Goal

Add a shared confirmed-artifact terminal handoff rule to the alignment-page convention and a focused fixture-backed audit for final completion responses.

### Plan

1. Update the canonical alignment-page convention with a confirmed-artifact terminal handoff rule after the confirmed-page contract.
2. Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
3. Extend `scripts/skill-alignment-routing-audit.mjs` with `--final-handoff-fixtures <dir>` for Markdown final-response fixtures.
4. Add pass/fail fixtures for recommended next skill, recommended next command, shell command, explicit `none`, missing routes, prose-only routes, wrong CLI syntax, and invalid `none`.
5. Extend the layer1 audit test to cover both the existing SKILL.md fixtures and the new final-handoff fixtures.
6. Run the focused audit commands, generator checks, package checks, task-doc audit, and diff hygiene.
7. Write review results and ship manifest, then commit and push the intended changes on `master`.

### Acceptance Criteria

- Confirmed artifact handoffs must end with either `Recommended next skill: <command>` or `Next work` plus `Recommended next command`.
- If the artifact or skill contract names a route, the handoff must verify route availability before recommending it.
- If no automated route remains, the handoff must say `Recommended next command: none` and name the manual or decision state.
- Final-handoff fixtures enforce Codex `$skill` syntax and Claude `/skill` syntax for skill routes.
- The fixture audit rejects missing terminal routes, prose-only artifact route mentions, wrong CLI syntax, and `none` when an expected route exists.
- Required verification passes or any blocker is documented.

### Results

- Added a shared confirmed-artifact terminal handoff rule to `docs/alignment-page-convention.md`.
- Regenerated all 306 generated `ALIGNMENT-PAGE.md` bundles.
- Extended `scripts/skill-alignment-routing-audit.mjs` with `--final-handoff-fixtures <dir>`.
- Added seven Markdown final-handoff fixtures covering valid Codex skill routing, shell-command routing, `none` with a manual state, missing routes, artifact-prose-only routes, wrong Codex skill syntax, and invalid `none`.
- Extended layer1 coverage for the new fixture mode.
- Verified the package manifest from a clean temp source containing only this task's convention and bundle changes; no package-manifest delta was needed.
- Verification passed except for the broad layer1 invocation, which failed on unrelated staged skill-inventory contract changes; the focused routing audit test passed.

## Historical Implementation - Social Ledger Public Archive Alignment Page

### Goal

Create a review-state alignment page that records the proposed decisions for a cross-project social ledger, public-safe gBrain alignment links, X reply-chain publishing, and recurring skill/package promotion policy before any implementation work begins.

### Plan

1. Re-read the alignment-page convention and current alignment index pattern.
2. Preserve unrelated dirty worktree changes while adding a new review-only page.
3. Add `alignment/social-ledger-public-archive.html` with context, proposed model, record schema, posting pattern, safety boundary, implementation scope, approval gates, and response YAML compilation.
4. Add the page to `alignment/index.html` under Product Design & Spec.
5. Run alignment-page audit, task-doc audit, and diff hygiene.
6. Commit and push only the intended alignment page, index, and task-record changes.

### Acceptance Criteria

- The page is `review` status and does not create ledgers, publish posts, modify `GeorgeQLe/me`, or change social conventions.
- The page captures local project ledgers, central account ledgers, optional local+central mode, and public gBrain projection.
- The page includes approval gates for public archive target, ledger scope, account resolution, X reply-chain pattern, promo policy, public safety, implementation scope, and artifact paths.
- The alignment index links the page exactly once with date `2026-06-25`.
- Alignment audit, task-doc audit, and diff hygiene pass.

### Results

- Added `alignment/social-ledger-public-archive.html` as a review-state approval page with eight required gates and YAML compilation.
- Added the page to `alignment/index.html` under Product Design & Spec.
- Preserved the pre-build boundary: no ledger files, convention edits, posting actions, or `GeorgeQLe/me` changes were made.
- Verification passed: alignment-page audit, task-doc audit, and diff hygiene.

## Historical Implementation - Final-Handoff Verification Audit Report

### Goal

Audit confirmed-artifact final handoff routing only, using the approved `alignment/final-handoff-verification-audit.html` gate answers, and write the recommendation-only report to `tasks/final-handoff-verification-audit.md`.

### Plan

1. Capture the visible `$session-triage final-handoff verification audit` invocation under `prompts/session-triage/`.
2. Read the local `session-triage` contract, governing repo instructions, relevant lessons, and the approved alignment page/gate answers.
3. Inspect shared routing conventions, benchmark/check surfaces, the session-triage contract, and a small recent confirmed-artifact example set.
4. Write the structured audit report without changing shared conventions, benchmarks, checks, or skill contracts.
5. Validate the report with targeted scans, task-doc audit, and diff hygiene.
6. Document results, commit, and push the intended prompt/report/task-doc changes on the primary branch.

### Acceptance Criteria

- The report separates user-identified scope from agent-verified findings.
- Evidence covers shared conventions, verification/check surfaces, session-triage routing expectations, and recent confirmed-artifact examples.
- Recommendations name exact files/sections and validation commands, but do not implement those changes.
- The final handoff includes explicit next work and recommended next command.
- Verification passes or any blocker is documented.

### Results

- Captured the visible `$session-triage final-handoff verification audit` invocation in `prompts/session-triage/`.
- Wrote the scoped report to `tasks/final-handoff-verification-audit.md`.
- Converted `alignment/final-handoff-verification-audit.html` to a confirmed read-only approval record after consuming the approved gate YAML.
- Found a verified prior handoff omission plus a narrower validation/check gap: current contracts cover the route requirement, but existing audits do not mechanically replay the confirmed-artifact terminal handoff.
- Recommended a shared final-handoff self-check and focused routing guard; did not implement shared convention, benchmark, check, or skill-contract remediation.
- Verification passed: alignment-page audit, task-doc audit, active skill routing audit report mode, and diff hygiene.

## Historical Implementation - Split Social Channel Conventions

### Goal

Split the large social convention files into smaller per-channel documents under `docs/social/`, while keeping `docs/social-post-convention.md` and `docs/social-video-content-convention.md` as thin shared routers that are context-aware of the `/social` directory.

### Plan

1. Create `docs/social/` channel convention files for text/community channels and video/content channels.
2. Replace `docs/social-post-convention.md` with a shared source-safety/output contract plus a routing table that tells agents to load only the selected `docs/social/*-convention.md` channel docs.
3. Replace `docs/social-video-content-convention.md` with a video-specific shared contract plus a routing table for selected video channel docs and reusable founder/devtool prompts.
4. Update BIP alignment guidance so agents load the top-level router first, then selected per-channel docs from `docs/social/` or packaged `assets/social/`.
5. Package the `docs/social/` directory as `assets/social/` and extend tests/audits so the split assets are published and referenced.
6. Regenerate alignment bundles, run package/convention/task/diff checks, document results, commit, and push.

### Acceptance Criteria

- The top-level social convention docs no longer contain every channel profile inline.
- Each channel profile remains available as a focused `docs/social/*-convention.md` file with research date, source list, platform-vs-norm distinction, channel guidance, risk notes, and drafting modes.
- BIP guidance is explicit that agents should load only selected channel docs after the router/shared contract.
- Packaged installs include `assets/social/*-convention.md`.
- Package boundary tests assert the social directory assets are published.
- Required checks pass: alignment generator check, convention bundle audit, package Node tests, package build, package build check, task-doc audit, and diff hygiene.

### Results

- Split text/community channel guidance into focused files under `docs/social/`: LinkedIn, X, Bluesky, Threads, Mastodon, Reddit, Hacker News, and YouTube Community.
- Split video/channel prompt guidance into focused files under `docs/social/`: YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, LinkedIn video, and reusable founder/devtool video prompts.
- Replaced the two top-level social convention docs with thin routers and shared contracts that tell agents to load selected child docs from `docs/social/` or packaged `assets/social/`.
- Updated BIP alignment guidance and regenerated all 306 generated `ALIGNMENT-PAGE.md` bundles so BIP outputs include the loaded channel convention path.
- Packaged `docs/social/` as `assets/social/` and extended package-boundary tests to assert child convention assets are published.
- Verification passed: alignment generator check, convention bundle audit, package Node tests, package build, package build check, task-doc audit, and diff hygiene.
- Manifest: `tasks/ship-manifest-2026-06-25-split-social-channel-conventions.md`.

## Historical Implementation - Social Media Channel Conventions

### Goal

Create researched, reusable social-media channel conventions for build-in-public and alignment-producing agents, covering text/community posts and video content ideas with clear separation between platform rules and creator norms.

### Plan

1. Add `docs/social-post-convention.md` for text/community channels: LinkedIn, X, Bluesky, Threads, Mastodon, Reddit, Hacker News, and YouTube Community.
2. Add `docs/social-video-content-convention.md` for video/content channels: YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, LinkedIn video, and reusable founder/devtool video prompts.
3. Update the BIP section of `docs/alignment-page-convention.md` so BIP pages ask for target channels, use the relevant social conventions, and expose channel, drafting-mode, angle, sample, tone, claim-safety, and publish-readiness gates.
4. Register the new conventions as static package assets in `scripts/skill-convention-registry.mjs`, update package staging/publish lists, and teach bundle audits/tests that not every convention has a generated per-skill bundle.
5. Add package tests that assert the new IDs/assets exist and BIP guidance references target-channel selection plus both social convention docs.
6. Regenerate alignment bundles, run convention/package verification, update review results, then commit and push the intended change set on `master`.

### Acceptance Criteria

- Each new convention includes research date, source list, and explicit rules-vs-norms labeling.
- Each channel has audience expectation, format patterns, length guidance, link/hashtag/media norms, tone, spam triggers, source-safety risks, and both `platform_aligned` and `creator_inspired` drafting modes.
- Agents are forbidden from unsupported claims, private context, secrets, confidential details, unverifiable metrics, unapproved customer names, and premature product commitments.
- BIP guidance asks for target channels and mode selection, loads the correct social convention by channel type, and presents channel-specific ideas with source basis, risk level, and selected drafting mode.
- Static social convention assets are copied into the skillpacks package and published under `assets/`.
- Existing generated convention bundle behavior remains exact.
- Required checks pass: convention bundle audit, package Node tests, package build, package build check, alignment generator write/check, task-doc audit, and diff hygiene.

### Results

- Added `docs/social-post-convention.md` with researched channel guidance for LinkedIn, X, Bluesky, Threads, Mastodon, Reddit, Hacker News, and YouTube Community.
- Added `docs/social-video-content-convention.md` with researched video guidance for YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, LinkedIn video, and reusable founder/devtool prompts.
- Updated BIP alignment guidance to require target-channel selection, drafting-mode selection, source basis, risk level, claim safety, and publish-readiness gates.
- Registered both social conventions as static package assets and updated package staging, publish-boundary tests, and convention audits for non-generated convention assets.
- Regenerated all 306 generated `ALIGNMENT-PAGE.md` bundles with the updated BIP guidance.
- Verification passed: alignment generator check, convention bundle audit, package Node tests, package build, package build check, task-doc audit, and diff hygiene.
- Manifest: `tasks/ship-manifest-2026-06-25-social-media-channel-conventions.md`.

## Historical Implementation - Final-Handoff Verification Audit Alignment Page

### Goal

Create a review-state HTML alignment page for the final-handoff verification audit plan so the user can approve or revise the audit scope before any convention, benchmark, or skill edits happen.

### Plan

1. Re-read the alignment-page convention, current index structure, existing review-page controls, and relevant task instructions.
2. Add `alignment/final-handoff-verification-audit.html` as a document-tier `qa-meta` review page with the required metadata, TTS include, rendered audit-plan sections, section feedback controls, and bottom response YAML compiler.
3. Add the page to `alignment/index.html` under `QA & Meta-Skill Improvement` with date `2026-06-25` and `[doc]` badge.
4. Run `node scripts/audit-alignment-pages.mjs` and `git diff --check`.
5. Document results, commit, and push the intended page/index/task-doc changes without touching unrelated worktree edits.

### Acceptance Criteria

- The new page is `review` status and does not implement the audit.
- The page uses `data-alignment-category="qa-meta"` and `data-visual-tier="document"`.
- The page contains audit goal, evidence surfaces, proposed audit procedure, decision framework, validation plan, and approval gates.
- Required gates cover audit scope, target surfaces, report artifact path, and whether the audit may recommend shared convention or benchmark changes.
- Compiled response YAML includes `command: "$session-triage final-handoff verification audit"` and routes to `alignment/final-handoff-verification-audit.html`.
- The index links the new page exactly once.
- Alignment audit and diff hygiene pass.

### Results

- Added `alignment/final-handoff-verification-audit.html` as a `qa-meta`, document-tier, review-state approval page.
- Added the page to `alignment/index.html` under `QA & Meta-Skill Improvement` with date `2026-06-25` and `[doc]` badge.
- Preserved the pre-approval boundary: the page proposes an audit only and does not change conventions, benchmarks, checks, or skill contracts.
- Verification passed: alignment-page audit, task-doc audit, diff hygiene, targeted metadata/index scans, and page-script syntax check.

## Historical Implementation - Build-In-Public Alignment Mode

### Goal

Add a build-in-public alignment mode for alignment-producing skills. When enabled by an explicit `--bip` flag or `.agents/project.json.alignment.build_in_public: true`, Stage 2 review gains a required source-safe social-content approval page before the normal final artifact approval.

### Plan

1. Update the canonical alignment-page convention with the Build-In-Public contract: triggers, page path, timing, angle/post review model, source-safety requirements, approval gates, and YAML handoff back to the producing skill.
2. Add supported project-default writers for `.agents/project.json.alignment.build_in_public`: `scripts/pack.sh set-bip <on|off|unset>` and `npx skillpacks set-bip <on|off|unset>`.
3. Preserve existing `.agents/project.json` fields and sibling `alignment` fields when setting or unsetting the BIP default.
4. Add package tests for `set-bip on`, `off`, and `unset`, including preservation of existing alignment fields.
5. Update CLI help and compatibility documentation for the new Node-owned `set-bip` command.
6. Regenerate alignment convention bundles and package build artifacts.
7. Run required checks: alignment bundle check, convention bundle audit, package Node tests, package build check, task-doc/diff hygiene, then commit and push.

### Acceptance Criteria

- The shared alignment convention describes BIP mode as applying to every alignment-producing skill, including optional alignment-page skills when they create a page.
- BIP mode creates `alignment/{skill-name}-{topic}-bip.html` after Stage 2 work/research and before final artifact approval.
- The BIP page reviews selectable content angles, sample posts for each angle, tone, claim safety, and publish readiness.
- Draft posts are explicitly source-safe: no unsupported claims, private context, secrets, or premature commitments.
- Final BIP approval emits YAML to the producing skill; rejected or partial feedback keeps the BIP page in review before normal Stage 2 artifact approval resumes.
- `scripts/pack.sh set-bip <on|off|unset>` and `npx skillpacks set-bip <on|off|unset>` write `.agents/project.json.alignment.build_in_public` without dropping unrelated fields.
- Tests and generated bundle checks pass.

### Results

- Added the BIP mode contract to the canonical alignment-page convention and regenerated 306 generated bundles.
- Added Bash and Node-owned project-config writers for `.agents/project.json.alignment.build_in_public`.
- Added package tests for `set-bip on`, `off`, and `unset`, including sibling `alignment` preservation.
- Updated package/CLI docs and verified package build, bundle checks, task docs, and diff hygiene.
- Manifest: `tasks/ship-manifest-2026-06-25-build-in-public-alignment-mode.md`.

## Historical Implementation - Self-Contained Alignment YAML Commands

### Goal

Make HTML-generated review YAML self-contained by including the exact top-level continuation `command` the agent wants the user to run with the YAML. This applies across alignment-page YAML and interrogation-page YAML, while preserving the existing rule that command metadata is loop/review continuation data, not downstream routing before approval.

### Plan

1. Update the canonical alignment-page convention so local section-feedback YAML and bottom response YAML both include a top-level `command` field when the handoff expects the user to continue in a producing skill or parent orchestrator session.
2. Update the alignment YAML routing contract and Pattern A research-session loop convention so `command` is required at the YAML root and matches `agent_routing.command` / `## Invoke With YAML` when those are present.
3. Update the canonical interrogation-page convention so compiled interrogation answers include the same top-level `command` alongside `agent_routing`.
4. Regenerate generated `ALIGNMENT-PAGE.md` and `INTERROGATION-PAGE.md` bundles from the canonical docs.
5. Add focused layer1 assertions covering root-level command requirements in alignment and interrogation bundles.
6. Run generator drift checks, focused tests, alignment/interrogation audits, package verification, and diff hygiene.
7. Document review results, commit, and push intended changes on `master`.

### Acceptance Criteria

- Alignment section-feedback YAML includes `command: "<producing-skill-or-parent-route>"`.
- Alignment bottom response YAML includes `command: "<producing-skill-or-parent-route>"`.
- Pattern A review pages require root `command` to match `agent_routing.command` and the terminal `## Invoke With YAML` route.
- Interrogation compiled YAML includes root `command` matching `agent_routing.command`.
- Generated bundles are in sync with canonical conventions.
- Tests and audits prove the top-level command contract and existing no-downstream-routing boundary still hold.

## Historical Implementation - Prepare 0.1.12 Publish Boundary

### Goal

Make sure the `0.1.12` package release boundary is coherent, validated, and ready for the real `./publish.sh patch` publish path.

### Plan

1. Capture the visible release-prep invocation under `prompts/ship-end/`.
2. Audit git state, release notes, package version metadata, publish script behavior, and current task state.
3. Reconcile `CHANGELOG.md` so `0.1.12` describes the actual `v0.1.11..HEAD` package boundary and the intended patch publish path.
4. Run package validation and release-prep checks, including the exact publish dry-run path when the tree is clean enough for `publish.sh`.
5. Document review results, ship manifest, and history for this release-prep session.
6. Commit and push the release-prep boundary on `master`.

### Acceptance Criteria

- `CHANGELOG.md` has a coherent `0.1.12` section for the pending npm publish.
- Source package metadata remains in the expected pre-publish state or is explicitly bumped by the publish script path.
- Package validation passes, or any blocker is documented without shipping.
- The final repo state has no unintended tracked dirt and no unpushed release-prep commit.

## Historical Implementation - Brainstorm Feature-Interview Availability Gate

### Goal

Make `$brainstorm` and `/brainstorm` guard their downstream `feature-interview` prompts with an availability check so users are told to install `feature-interview` before copying unavailable follow-up commands. Update the related `session-triage` availability guard so it recognizes individually enabled skills as well as enabled packs.

### Plan

1. Capture the skill-update prompt and promote this focused implementation into `tasks/roadmap.md` and `tasks/todo.md`.
2. Archive and bump the canonical brainstorm skill sources, then add an output preflight contract that checks `.agents/project.json.enabled_skills.feature-interview`, enabled packs that provide `feature-interview`, and local/global installed skill files before listing follow-up prompts.
3. Mirror the brainstorm availability rule into the active `.codex/.claude` installed skill copies so the current repo behavior is fixed immediately.
4. Archive and bump canonical `session-triage` sources, then update the Pack Availability Guard to account for `.agents/project.json.enabled_skills` in addition to `enabled_packs`; sync the active installed mirrors without dropping newer source behavior.
5. Update changelogs, correction lessons, and any managed-copy metadata affected by the mirror sync.
6. Validate with the focused layer1 contract test, targeted `rg` checks, version/archive audits, task-doc audit, diff hygiene, and focused contract replay against the current project metadata.
7. Document review results, ship manifest, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- Brainstorm output instructions require an availability preflight before any `feature-interview` prompts.
- When `feature-interview` is unavailable, the displayed output and appended `tasks/ideas.md` run section begin with `npx skillpacks install feature-interview`.
- Codex brainstorm guidance tells users to start a fresh Codex CLI session if `$feature-interview` remains unavailable after install.
- Claude brainstorm guidance uses `/feature-interview` and tells users to run `/reload-skills`, then `/clear` or restart if the skill remains invisible.
- Session-triage pack/skill availability guidance checks `enabled_skills` and `enabled_packs`, not only packs.
- Canonical pack sources and current installed mirrors are consistent for this behavior.

### Results

- Brainstorm mirrors now gate `feature-interview` prompts behind direct skill, provider-pack, or local/global skill-file availability.
- Missing `feature-interview` now puts `npx skillpacks install feature-interview` before brainstorm suggestions in both displayed output and `tasks/ideas.md` guidance.
- Session-triage mirrors now treat `enabled_skills.<skill-name>` as direct availability before checking enabled provider packs.
- Verification passed; see `tasks/ship-manifest-2026-06-24-brainstorm-feature-interview-availability.md`.

## Historical Implementation - Clarify Alignment Review YAML Handoffs

### Goal

Clarify alignment-page routing contracts so, after an HTML alignment page is ready for review, agents explicitly tell the user to review the page, compile feedback or approval YAML, and continue in the producing skill context. Feedback/revision YAML must route back to amendment and renewed review, while final approval YAML authorizes canonical artifact confirmation.

### Plan

1. Capture prompt history and promote this implementation plan into task docs.
2. Update `docs/alignment-page-convention.md` with explicit review/compile/paste handoff language, feedback-vs-approval routing, downstream blocking until confirmation, and the existing no-extra-clear rule for fresh YAML consumption.
3. Archive and bump `base/codex/create-alignment-page/SKILL.md` and `base/claude/create-alignment-page/SKILL.md` from `v0.1` to `v0.2`, updating each `CHANGELOG.md` with the concrete handoff behavior.
4. Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
5. Extend enforcement tests for the generated handoff rule and create-alignment-page platform-specific handoff text.
6. Run required alignment audits, focused Vitest coverage, and diff hygiene.
7. Document review results, ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- Alignment convention tells users to review the HTML page, compile local section-feedback YAML or bottom response YAML, then paste it into the producing skill/session route.
- `approval_status: not-approved`, `feedback_status: revision-request`, and partial YAML route to feedback handling, investigation, amendment, and renewed review.
- Downstream routing stays blocked until approved artifacts are written and the page is confirmed.
- Fresh sessions already consuming pasted YAML are not told to clear context again.
- Codex and Claude create-alignment-page skills include platform-specific producing-skill command phrasing and distinguish revision YAML from final approval YAML.
- Generated bundles are in sync with the canonical convention.
- Focused audits/tests pass, or any residual failure is documented with proof of unrelated provenance.

### Results

- Canonical convention, generated bundles, and create-alignment-page mirrors now carry the explicit review/compile/paste handoff and revision-vs-approval YAML distinction.
- Verification passed; see `tasks/ship-manifest-2026-06-24-alignment-yaml-handoffs.md`.

## Historical Implementation - Product-Design Flow-Tree Contract Drift

### Goal

Make product-design flow-tree contracts agree across schema, sample, skill text, and tests. The canonical behavior change is to support clickable UI experiment evidence in `ui_experiments[]` with explicit optional fields while preserving canonical `artifacts[]` references.

### Plan

1. Add focused layer1 contract coverage for UI experiment evidence fields, sample key validity, exact skill field names, stale selector removal, UI experiment terminology, journey-stage wording, and branch-order override metadata wording.
2. Update `design/flow-tree.schema.json` and `design/flow-tree-sample.yaml` so `ui_experiments[]` supports `experiment_path` and `review_evidence`, keeps `additionalProperties: false`, and uses only schema-valid keys.
3. Archive and bump mirrored `create-ui-experiment`, `ui-interview`, and `user-flow-map` skills in both Codex and Claude pack roots.
4. Update mirrored skill wording for exact UI experiment field names, deterministic UI variation selection, UI experiment terminology, prototype-build-plan source IDs, schema-valid journey stages, and schema-backed branch-order override metadata.
5. Run focused verification: product-design flow-tree layer1 test, design-tree loop check, task-doc audit, and diff hygiene.
6. Document results in task docs and ship manifest, then commit and push intended changes on `master`.

### Acceptance Criteria

- `ui_experiments[]` accepts optional `experiment_path` and `review_evidence` fields and still rejects unknown keys.
- `design/flow-tree-sample.yaml` uses only schema-valid keys for every `ui_experiments[]` entry.
- `create-ui-experiment` skill mirrors reference the exact schema fields for clickable experiment path and review evidence.
- `ui-interview` skill mirrors no longer contain the stale first-UX-variation-with-no-`ui_experiments` selector.
- `user-flow-map` skill mirrors no longer use stale `UI review` wording for manifest or build-plan fields.
- Journey-stage guidance uses schema-valid stage language and does not mention schema-invalid `setup`.
- Branch-order override guidance names schema-backed `ordered_branch_ids`, `override_rationale`, `recorded_at`, and optional `parent_branch_id`.

## Historical Implementation - Interrogation Intake Validation Clarification

### Goal

Clarify the interrogation-page convention so open-answer claims are validated and classified when compiled answers are consumed, while deeper evidence gathering is deferred into explicit research work unless contradiction or confidence-gate completeness requires immediate pushback.

### Plan

1. Update `docs/interrogation-page-convention.md` in the `Open-answer evidence validation` section to distinguish interrogation-time validation from post-interrogation research.
2. Regenerate all generated `INTERROGATION-PAGE.md` bundles with `node scripts/upgrade-interrogation-page.mjs`.
3. Update the focused layer1 interrogation confidence-gate test with assertions for compiled-answer consumption timing, deeper-research deferral, and `needs-research` handling.
4. Refresh generated package metadata if `npm run skillpacks:verify` reports manifest drift.
5. Run verification: `node scripts/upgrade-interrogation-page.mjs --check`, `pnpm --dir tests exec vitest run --project layer1 layer1/interrogation-confidence-gate.test.ts`, `node scripts/audit-task-docs.mjs`, `git diff --check`, and `npm run skillpacks:verify`.
6. Document review results, commit, and push the completed change set on the primary branch.

### Acceptance Criteria

- Open-answer validation is explicitly tied to compiled-answer consumption before confidence-gate or downstream research use.
- Interrogation-time validation is limited to available evidence checks: repo context, prior research, code/git evidence, supplied sources, and already-approved external research.
- Stage-zero interrogation does not require full synthesized research; deeper evidence gathering is deferred as a research item unless contradiction or confidence-gate completeness requires pushback.
- `supported` and `partially-supported` claims can inform the confidence gate with confidence labeling.
- `hunch/inferred` and `needs-research` claims become research questions or source-plan items, not proven evidence.
- `unsupported` and `contradicted` claims trigger pushback in the next round or coverage checkpoint when they affect confidence-gate completeness, candidate selection, buyer language, or downstream scope.
- Founder-supplied buyer/user/customer phrasing without provenance is labeled as hunch language and converted into a research target.
- Generated bundles, focused tests, task-doc audit, diff hygiene, and package verification pass or any residual failure is proven unrelated.

## Phase 1: Design-Tree Branch Prioritization And UI Experiment Split ✓
> Test strategy: tdd

### Goal

Make the product-design tree choose downstream branches in a journey-aware order, separate clickable UI experiment/prototype work from `ui-interview`, and ensure review surfaces introduce UI progressively instead of dropping reviewers into an overloaded all-at-once screen.

### Plan

1. Add explicit journey-aware branch ordering metadata to `design/flow-tree.schema.json`, such as `journey_stage`, `journey_sequence`, `priority_rationale`, and a progressive learning/review field.
2. Update `$user-flow-map` so `branches[]` are ordered by user journey progression by default, with user overrides captured in the flow map, interview log, and manifest.
3. Update `$ux-variations` so the recommended next child branch is selected by parent flow journey order, activation/first-value fit, and stated evaluation priority rather than only first-pending array order.
4. Update `$ui-interview` to stop owning clickable prototype/buildout behavior by default; keep it focused on requirements, UI packet, static or bounded visual review, and branch decision capture.
5. Design or add a dedicated `create-ui-experiment` skill to own clickable UI experiments, lightweight route prototypes, progressive reveal/review behavior, and experiment handoff into prototype/UAT.
6. Add progressive UI review requirements so generated review/mockup surfaces teach the interface step by step, emphasizing first value, primary task path, and staged disclosure before showing dense controls.
7. Fix the manifest naming drift between `ui-interview` guidance and `design/flow-tree.schema.json` (`ui_reviews[]` vs. `ui_experiments[]`).
8. Run focused verification: schema validation or fixture checks, skill archive/changelog/version checks for any changed skills, generated bundle parity checks, and relevant repo audits.
9. Document review results, commit, and push the completed change set on the primary branch.

### Scope

- Extend the design-tree manifest contract so user-flow and UX-variation branches carry deterministic ordering and progressive-review metadata instead of depending on array order alone.
- Update the product-design tree conventions and mirrored skill contracts so branch resolution honors journey order, explicit user overrides, first-value/activation fit, and evaluation priority.
- Keep `$ui-interview` focused on UI requirements, branch packet authoring, static or bounded HTML mockup review, and branch decisions.
- Add a dedicated `create-ui-experiment` owner for clickable UI experiment routes or project-native lightweight prototypes, with handoff into `$prototype` and UAT only after UI branch approval.
- Refresh generated convention bundles, package/showcase metadata, and focused layer1 coverage for the behavior.

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance, UX

**Subagent lanes:** none

### Tests First

- Step 1.1: Write failing layer1 coverage for deterministic branch routing and UI experiment ownership
  - Files: modify `tests/layer1/product-design-flow-tree.test.ts`
  - Add assertions that `design/flow-tree.schema.json` exposes a new schema version with branch ordering metadata on user-flow branches and UX variation branches, including journey stage, sequence/priority, rationale, and progressive-review guidance.
  - Add assertions that `design/flow-tree-sample.yaml` exercises the new ordering fields and a user override or rationale example.
  - Add assertions that mirrored `user-flow-map` contracts order `branches[]` by journey progression by default and record user overrides in the flow map, interview log, and manifest.
  - Add assertions that mirrored `ux-variations` contracts select the next child branch by journey sequence, activation/first-value fit, and evaluation priority rather than raw first-pending array order.
  - Add assertions that mirrored `ui-interview` contracts use `ui_experiments[]`, do not write or route default clickable prototype buildout, and hand clickable route experiments to the dedicated owner.
  - Add assertions that mirrored `create-ui-experiment` contracts exist and own clickable UI experiment routes or project-native lightweight prototypes.
  - Run `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` and confirm the new assertions fail before implementation.

### Implementation

- Step 1.2: Extend the flow-tree schema and sample with branch-order metadata
  - Files: modify `design/flow-tree.schema.json`, `design/flow-tree-sample.yaml`
  - Bump the flow-tree schema version only if the new metadata is required or semantically breaking; otherwise document the additive compatibility choice in the schema descriptions and tests.
  - Add deterministic branch-order fields to `user_flow_branch`, such as `journey_stage`, `journey_sequence`, `priority_rationale`, and a progressive-review field/object that names first-value step, primary task path, staged-disclosure notes, and evidence required before moving deeper.
  - Add equivalent or narrower selection metadata to `ux_variation_branch`, such as `evaluation_priority`, `activation_fit`, `first_value_fit`, `priority_rationale`, and progressive-review notes.
  - Keep `ui_experiments[]` as the canonical child branch name and do not reintroduce `ui_reviews[]`.

- Step 1.3: Update the canonical design-tree loop convention and generated bundle inputs
  - Files: modify `docs/design-tree-loop-convention.md`, `scripts/upgrade-design-tree-loop.mjs`
  - Define the branch-selection algorithm: explicit user override first, then ascending journey sequence/evaluation priority, then first-value/activation fit, then current status, with raw array order only as a final stable tiebreaker.
  - Add progressive-review requirements for complex UI surfaces: review first value, primary path, and staged disclosure before dense secondary controls.
  - Add `create-ui-experiment` to the design-tree skill set if the new skill carries `DESIGN-TREE-LOOP.md`.

- Step 1.4: Update and version the mirrored `user-flow-map` contracts
  - Files: archive and modify `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`; update both `CHANGELOG.md` files.
  - Run `scripts/skill-archive.sh packs/product-design/codex/user-flow-map` and `scripts/skill-archive.sh packs/product-design/claude/user-flow-map` before bumping versions.
  - Require `branches[]` output to be ordered by journey progression by default.
  - Require any user override to be recorded in `design/user-flow-[topic].md`, the interview log, and the flow-tree manifest metadata.
  - Require each branch to explain the first value moment, primary task path, and progressive review sequence.

- Step 1.5: Update and version the mirrored `ux-variations` contracts
  - Files: archive and modify `packs/product-design/{codex,claude}/ux-variations/SKILL.md`; update both `CHANGELOG.md` files.
  - Run `scripts/skill-archive.sh packs/product-design/codex/ux-variations` and `scripts/skill-archive.sh packs/product-design/claude/ux-variations` before bumping versions.
  - Replace "first modelled branch with no `ux_variations`" as the sole default with deterministic branch selection using journey order, user overrides, first-value/activation fit, and evaluation priority.
  - Keep default progression-mode output as design planning and future experiment targets; do not emit prototype buildout or route implementation instructions before UI experiment approval.

- Step 1.6: Update and version the mirrored `ui-interview` contracts
  - Files: archive and modify `packs/product-design/{codex,claude}/ui-interview/SKILL.md`; update both `CHANGELOG.md` files.
  - Run `scripts/skill-archive.sh packs/product-design/codex/ui-interview` and `scripts/skill-archive.sh packs/product-design/claude/ui-interview` before bumping versions.
  - Replace remaining active `ui_reviews[]` language with `ui_experiments[]`.
  - Make default full UI mode explicitly non-buildout: UI requirements, packet, HTML visual mockup, branch decision, and handoff only.
  - Route approved clickable route experiment needs to `$create-ui-experiment` or project-local equivalent, not directly to `$prototype` or production planning.

- Step 1.7: Add the dedicated `create-ui-experiment` skill and routing metadata
  - Files: create `packs/product-design/{codex,claude}/create-ui-experiment/SKILL.md`, `CHANGELOG.md`, and generated convention bundles as needed; modify `packs/product-design/PACK.md`, route/alias metadata, docs or routing maps that enumerate product-design skills.
  - Start both new skill contracts at `version: v0.0`.
  - Define the skill as the owner of clickable UI experiment routes or project-native lightweight prototypes that test one UI branch's first-value journey with fake, fixture, local, or in-memory data.
  - Require progressive reveal/review behavior: the experiment introduces first value and primary task path before dense secondary controls.
  - Require handoff into `$prototype`, `$uat --variant-evaluation`, or `$user-flow-map --prototype-build-plan` only after the experiment has explicit review evidence.

- Step 1.8: Regenerate bundles and public/package metadata for changed skill surfaces
  - Files: generated `DESIGN-TREE-LOOP.md`, `ALIGNMENT-PAGE.md`, `INTERROGATION-PAGE.md` if applicable, `packages/skillpacks/dist/skillpacks-manifest.json`, and `exports/skills-catalog/v1/{catalog.json,proof.json,manifest.json}` if the generators update them.
  - Run `node scripts/upgrade-design-tree-loop.mjs`.
  - Run `node scripts/upgrade-alignment-page.mjs` and `node scripts/upgrade-interrogation-page.mjs` if new or changed skills require those bundles.
  - Stage source skill edits before regenerating package/export metadata so index-generated assets reflect the intended boundary.
  - Run `node scripts/generate-skills-catalog-export.mjs` and `scripts/validate-skills-catalog-export.sh` when tracked skill metadata or pack membership changes.

### Green

- Step 1.9: Run focused and repository contract validation
  - Files: no source changes expected unless validation exposes concrete drift.
  - Run `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts`.
  - Run `node scripts/upgrade-design-tree-loop.mjs --check`.
  - Run `node scripts/upgrade-alignment-page.mjs --check` and `node scripts/upgrade-interrogation-page.mjs --check` if those generators were used.
  - Run `scripts/skill-archive-audit.sh --strict`.
  - Run `scripts/skill-mirror-parity-audit.sh --verbose`; if it still reports only known unrelated `session-triage` drift, record that residual explicitly.
  - Run `scripts/validate-skills-catalog-export.sh` if skill export data changed.
  - Run `npm run skillpacks:verify`.
  - Run `node scripts/audit-task-docs.mjs`.
  - Run `git diff --check`.

- Step 1.10: Document review results, ship manifest, commit, and push
  - Files: modify `tasks/todo.md`, `tasks/history.md`, and a new `tasks/ship-manifest-2026-06-23-design-tree-branch-prioritization.md`.
  - Record exactly which skill versions were bumped, which generated assets changed, validation commands and warnings, accepted residual risks, and rollback note.
  - Commit and push the completed change set on `master`.

### Acceptance Criteria

- Branch routing is deterministic and explicitly tied to journey sequence or a recorded user override.
- `ux-variations` and `ui-interview` no longer rely only on implicit "first pending" order when recommending child branches.
- Clickable UI experiment buildout has a dedicated owner separate from default `ui-interview` behavior.
- Review artifacts present complex interfaces progressively, with clear first-step and primary-path focus before dense secondary controls.
- The flow-tree schema and skill language use matching branch names for UI experiment/review nodes.
- Verification commands pass, or any residual failures are documented as unrelated pre-existing issues.

### Milestone: Design-Tree Branch Prioritization And UI Experiment Split
**Acceptance Criteria:**
- [x] Branch routing is deterministic and explicitly tied to journey sequence or a recorded user override.
- [x] `ux-variations` and `ui-interview` no longer rely only on implicit "first pending" order when recommending child branches.
- [x] Clickable UI experiment buildout has a dedicated owner separate from default `ui-interview` behavior.
- [x] Review artifacts present complex interfaces progressively, with clear first-step and primary-path focus before dense secondary controls.
- [x] The flow-tree schema and skill language use matching branch names for UI experiment/review nodes.
- [x] Verification commands pass, or any residual failures are documented as unrelated pre-existing issues.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: Step 1.8 produced no tracked generated drift because Step 1.7 already refreshed the changed skill surfaces; Step 1.9 fixed stale GitHub proof fingerprints reported by the showcase validator.
- Tech debt / follow-ups: Known unrelated `session-analytics/session-triage` mirror parity drift remains outside this product-design phase. Deferred Phase 38 newsletter production setup remains in `tasks/manual-todo.md`.
- Ready for next phase: yes. No active implementation phase remains selected; next work should be discovered or the project should be parked intentionally.

## Historical Implementation - Interrogation Open-Answer Evidence Validation

### Goal

Address the customer-discovery interrogation issue where "Real buyer or user language" prompts can elicit founder hunches rather than real buyer quotes, and add a shared interrogation convention requiring agents to research and validate open answers before treating them as evidence.

### Plan

1. Capture prompt history and review relevant lessons.
2. Validate the user claim against the current customer-discovery interrogation bundle, generator, convention, and git history.
3. Update `docs/interrogation-page-convention.md` so open answers are treated as claims/hypotheses requiring evidence checks, confidence labels, and pushback when unsupported or contradicted.
4. Regenerate generated interrogation bundles through `scripts/upgrade-interrogation-page.mjs`.
5. Add focused regression coverage asserting generated bundles carry the new open-answer evidence-validation rule.
6. Run focused verification: interrogation generator check, layer1 interrogation tests, task-doc audit, diff hygiene, and broader package verification if the touched surface requires it.
7. Document review results, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- Interrogation convention explicitly says user open-question answers are intake evidence, not automatically validated facts.
- Agents must check user-supplied open answers against repo context, prior research, code/git evidence, and approved external research when needed before using them in downstream research.
- Agents must label supported, unsupported, hunch/inferred, contradicted, or needs-research answers and push back clearly when evidence is missing or contrary.
- Customer-language / buyer-language responses specifically require quote/source/provenance checks or are treated as hypotheses needing research.
- Generated `INTERROGATION-PAGE.md` bundles are in sync and tests cover the durable rule.
- Verification commands pass, or any residual failures are documented as unrelated pre-existing issues.

## Historical Implementation - Fix Recurring Stale Task-Doc Routing

### Goal

Prevent stale historical task sections from being routed as active next work by enforcing that `tasks/todo.md` is current-only, `tasks/roadmap.md` does not present historical entries as repeated active `Current Implementation` sections, and shipping/reconciliation skills consult only the promoted current task when selecting next work.

### Plan

1. Inspect current docs, existing audit scripts, and relevant skill contracts.
2. Add `scripts/audit-task-docs.mjs` to flag overloaded todo/roadmap routing surfaces.
3. Confirm the new audit fails against the pre-cleanup roadmap state.
4. Archive and bump mirrored `reconcile-dev-docs` contracts from `v0.2` to `v0.3`, then update changelogs.
5. Update `ship` and `ship-end` contracts so task-doc changes run the audit and next-work routing reads only the current active todo section.
6. Rewrite the top-level roadmap headings so historical implementation notes are explicitly historical, with only promoted current work using `Current Implementation`.
7. Add history/reconciliation evidence for this prevention fix.
8. Run verification: task-doc audit, diff hygiene, archive audit, mirror parity audit, and `npm run skillpacks:verify`.
9. Review final diff, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- `scripts/audit-task-docs.mjs` fails on ambiguous stale active-task routing and passes on the cleaned docs.
- `tasks/todo.md` contains only this current task during execution, then returns to a no-active-task or explicitly promoted state before ship completion.
- `tasks/roadmap.md` no longer contains multiple historical `Current Implementation` sections.
- `reconcile-dev-docs` fix mode explicitly detects and repairs overloaded current-task sections.
- `ship` and `ship-end` do not recommend historical/advisory unchecked boxes as next executable work.
- Required verification passes or any failure is fixed and rerun.

## Historical Implementation - Add `uninstall-global --dry-run`

### Goal

Add a read-only preview mode for `npx skillpacks uninstall-global --dry-run`, including `--reinstall-base --dry-run`, so users can see exactly which global installs and project-local base-skill migration actions would happen without mutating global skills or project files.

### Plan

1. Record prompt history and active task tracking.
2. Inspect the current `uninstall-global` parser, help text, cleanup ownership logic, reinstall-base migration flow, and lifecycle tests.
3. Refactor global uninstall logic so discovery/planning is separated from mutation while preserving normal `Removed ...` output.
4. Add dry-run output for global removals and reinstall-base project migration previews without calling project initialization, project config writes, skill-root sync, or pruning.
5. Extend lifecycle/parser coverage for plain dry-run, both `--reinstall-base --dry-run` flag orders, existing-project preview, no-project preview, and unsupported args.
6. Run focused lifecycle tests, package node tests, full skillpacks verification, and diff hygiene.
7. Record review results, then commit and push intended changes on `master`.

### Acceptance Criteria

- `uninstall-global --dry-run` exits `0`, prints `Would remove ...` for repo-managed base skill installs, skips unmanaged/foreign installs, and leaves files in place.
- `uninstall-global --reinstall-base --dry-run` previews global cleanup and project-local base-skill migration without modifying `.agents/project.json`, installing roots, pruning roots, or initializing a project.
- Both dry-run flag orders work and unknown flags/positional args still fail with the existing unsupported-argument style.
- CLI help advertises `uninstall-global [--reinstall-base] [--dry-run]`.
- Required verification passes or any failure is fixed and rerun before shipping.

## Historical Implementation - Explain Unsafe Refresh Dry Runs

### Goal

Make `npx skillpacks refresh --all --dry-run` explain why its final safety summary says `Safe to run: no`, without weakening the existing safety gate.

### Plan

1. Record prompt history and active task tracking for the `$investigate` run.
2. Reproduce the reported dry-run output and validate the user claim against current CLI behavior.
3. Trace the `Safe to run` calculation through source and recent git history.
4. Apply the smallest CLI/test change so unsafe dry runs emit concrete reasons.
5. Run focused package tests, package verification, and diff hygiene.
6. Record review results, then commit and push intended changes on `master`.

### Acceptance Criteria

- Any `refresh --all --dry-run` output that ends with `Safe to run: no` includes at least one human-readable reason.
- Existing safety semantics remain unchanged.
- Regression tests cover the stale/no-reason case.
- Focused CLI tests and package verification pass before shipping.

## Historical Implementation - Fix npm Publish Verification Lag

### Goal

Make `packages/skillpacks/scripts/verify-published-package.sh` tolerate bounded npm metadata propagation lag after a successful publish without weakening the requirement that both `skillpacks` and `@glexcorp/gskp` publish at the exact expected version.

### Plan

1. Record active task tracking and preserve the existing dirty post-publish `0.1.11` source-state files.
2. Finalize the current `0.1.11` release state by committing only `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`, tagging with the established `v0.1.11` format, and pushing commit plus tag.
3. Update `verify-published-package.sh` so npm metadata verification polls before failing, with defaults `SKILLPACKS_VERIFY_PUBLISHED_ATTEMPTS=12` and `SKILLPACKS_VERIFY_PUBLISHED_DELAY_SECONDS=5`.
4. Use `npm view ... --prefer-online --workspaces=false` for metadata checks while retaining the existing npm cache path and npx install smoke-test cache behavior.
5. Print concise retry diagnostics that include the package, expected version, attempt count, and current mismatch; only continue to temp-project/npx smoke tests after metadata reports the expected version, latest dist-tag, and versions list.
6. Add shell-level regression coverage with mocked npm metadata that is stale for the first attempts and then catches up, plus a failure case that remains stale and exits nonzero with the underlying mismatch details.
7. Run requested verification: `npm --workspace packages/skillpacks run test:node`, `npm run skillpacks:verify`, `./publish.sh --dry-run patch`, and `git diff --check`.
8. Record review results, then commit and push the retry fix and task documentation on `master`.

### Acceptance Criteria

- Published-package metadata verification retries bounded stale npm metadata before failing.
- Retry defaults are configurable by environment and safe for normal publish runs.
- Metadata checks use `--prefer-online` and still verify latest version, latest dist-tag, license, and versions-list inclusion before smoke tests begin.
- Regression tests prove stale-then-current metadata succeeds and persistently stale metadata fails before invoking npx smoke tests.
- The existing `0.1.11` post-publish source state is tagged separately from the unpublished retry-fix commit.
- Requested verification commands pass or any unrelated/pre-existing failures are proven and documented.

## Historical Implementation - Update Fork Idea Branch Additive Spawning

### Goal

Revise `fork-idea-branch` so the default approved action creates two or more new `research/{descriptive-product-path}` stubs without archiving the existing path, and reserves source-path archival for explicit `--archive` invocations.

### Plan

1. Record prompt history and task tracking for the skill update.
2. Archive the current `fork-idea-branch` `v0.0` skill contract, bump the active skill to `v0.1`, and update the skill-local changelog.
3. Rewrite the skill contract around default additive branch spawning: parse user-provided ICP/product-path list, proposed stub names, and notes; compile an alignment page that verifies count, names, per-branch notes, proposed files, and kickoff prompts before mutation.
4. Add explicit `--archive` mode that archives the existing source path only after approval, while default mode preserves existing active research and records fork lineage in `research/.progress.yaml`.
5. Regenerate package/showcase metadata only where required by changed skill frontmatter or archive state.
6. Run targeted validation for version/archive hygiene, generated metadata consistency, routing text, and diff hygiene.
7. Record review results and commit/push only intended changes if the worktree can be safely isolated from unrelated existing edits.

### Acceptance Criteria

- Default `fork-idea-branch` behavior does not archive or move an existing `research/` path.
- `--archive` is the only path that archives the source research path, and it still requires final compiled alignment-page approval before mutation.
- The alignment page verifies the number of branches, branch/product-path names, notes, source context, planned stubs, and per-branch `$idea-scope-brief` kickoff prompts.
- New branch stubs use `research/{slug}/_working/fork-seed.md` and manifest entries with clear product-path lineage and next-skill routing.
- The skill version, archive snapshot, changelog, and generated metadata remain consistent.

## Previous Implementation - Confirm Workflow Design Alignment Page

### Goal

Consume the approved gate-answer YAML for `alignment/workflow-design-three-pipelines.html`, reconcile the live page to the approved decisions, and confirm the alignment page without disturbing unrelated active release-prep or skill work in this dirty worktree.

### Plan

1. Record the scoped plan in task tracking.
2. Archive the current active alignment page before replacement.
3. Update the live page so the approved answers are reflected as the current decision record: five decks, COA B, four-step rapid ceremony with traction, devtool front-half on demand, semi-auto graduation, and two dedicated rapid decks backed by `packs/vard/` and `packs/ord/`.
4. Remove review/compile controls and mark the page confirmed.
5. Run the active alignment-page audit and diff hygiene checks.
6. Record review results and commit/push only if the resulting tracked changes can be safely isolated from unrelated worktree edits.

### Acceptance Criteria

- The previous active page is archived under `docs/history/archive/`.
- The live page is confirmed and has no active gate, section-feedback, or compile-response controls.
- Stale "3-step" rapid-pipeline wording is reconciled to the approved four-step scan/align/ship/traction ceremony.
- The approval record preserves all six supplied gate answers, including the "two dedicated decks, not packs" note.
- Verification results are recorded before completion.

## Previous Implementation - Create `spinoff-idea` Skill

### Goal

Add a `spinoff-idea` skill that inspects the invoking repository and produces a transfer-ready prompt for starting `$idea-scope-brief` in a separate target repository, without extracting code or mutating the target repo.

### Plan

1. Record prompt history and active task tracking.
2. Confirm the right skill home by comparing existing `spin-off`, `project-fleet`, and `idea-scope-brief` contracts.
3. Scaffold `spinoff-idea` under the selected pack with required metadata, versioning, and UI metadata where applicable.
4. Write a concise skill contract covering source-repo intake, spinoff hypothesis extraction, target-repo prompt composition, safety boundaries, and output format.
5. Update pack indexes or generated metadata only if required by repo conventions.
6. Run targeted validation for frontmatter, versioning, routing, and manifest/build drift.
7. Record review results, then commit and push intended changes if verification passes.

### Acceptance Criteria

- `spinoff-idea` is discoverable in the appropriate skill pack and has `version: v0.0`.
- The skill clearly differs from `spin-off`: it produces an `$idea-scope-brief` kickoff prompt for another repo rather than creating or extracting a code repository.
- The output contract includes a complete prompt with source-repo context, idea hypothesis, constraints, non-goals, evidence references, unknowns, and target-repo instructions.
- The skill avoids copying secrets, private URLs, customer data, proprietary implementation details, or unrelated repo history into the prompt.
- Targeted skill validation and diff hygiene pass.

## Historical Implementation - Prepare skillpacks 0.1.11 Publish Boundary

### Goal

Prepare the repository so `./publish.sh patch` can publish `skillpacks@0.1.11` and `@glexcorp/gskp@0.1.11` from a clean committed `master`, while preserving the repo convention that checked-in source release-state files remain at the last published package version before a real patch publish.

### Plan

1. Record prompt history and active task tracking.
2. Confirm npm registry state for both `skillpacks` and `@glexcorp/gskp` is still `0.1.10`.
3. Reset `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` package versions from `0.1.11` to `0.1.10`.
4. Move the pending package changelog notes from `Unreleased` into a prepared `0.1.11` section dated 2026-06-23, leaving a fresh empty `Unreleased` section.
5. Update task docs and ship manifest to explain the release-prep boundary and source-version convention.
6. Run release-prep verification: package node tests, full package verification, dry-run patch publish, and diff hygiene.
7. Commit and push the intended release-prep state on `master`.

### Acceptance Criteria

- Source package release-state files are committed at `0.1.10`, matching the currently published npm latest versions.
- `CHANGELOG.md` records the prepared `0.1.11` release contents and the intended real command `./publish.sh patch`.
- The dry-run patch publish proves `0.1.11` staging without a real npm publish and restores source release-state files to `0.1.10`.
- `git status --short` contains only intended release-prep changes before commit, and `master` is clean after push.
- App files, including `apps/skills-showcase/app/globals.css` and `apps/skills-showcase/next-env.d.ts`, are not modified by this pass.

## Previous Implementation - Prevent Pack Install From Installing Archived Skills

### Goal

Audit `npx skillpacks install <pack>` and prevent pack installs from copying archived skills, with `business-afps` / customer-discovery orchestrator subskills as the regression case.

### Plan

1. Record prompt history and active task tracking.
2. Validate the user's claim against installer source, generated package metadata, and git history.
3. Reproduce or prove the archive leak path for `business-afps`.
4. Patch the minimal source/generation path so archived skills are excluded from install candidates.
5. Add focused regression coverage for pack installs and archived orchestrator subskills.
6. Run package verification and diff hygiene.
7. Document results, then commit and push intended changes.

### Acceptance Criteria

- `skillpacks install business-afps` does not install archived customer-discovery/orchestrator subskills.
- Pack install candidate discovery ignores `archive/**` skill roots regardless of whether archived files contain valid `SKILL.md` frontmatter.
- Existing active pack skills still install normally.
- Regression tests fail on the archived-skill leak and pass after the fix.

## Previous Implementation - Fix Cross-Pack Routing Guard in Session Triage

### Goal

Make `session-triage` benchmark regression routing explicitly guard access to `benchmark-test-skill` by checking whether `agentic-skills-bench` is enabled before recommending the loop-closing benchmark rerun.

### Plan

1. Record active task tracking for the cross-pack routing fix.
2. Archive current `session-triage` `v0.4` Codex and Claude skill mirrors.
3. Bump both active mirrors to `v0.5`.
4. Add a `Pack Availability Guard` section that checks `.agents/project.json` `enabled_packs`, recommends `npx skillpacks install agentic-skills-bench` when missing, and gives runner-specific reload guidance.
5. Keep benchmark regression diagnosis and loop-closing routing intact while routing the `/benchmark-test-skill` / `$benchmark-test-skill` recommendation through the guard.
6. Update both changelogs.
7. Run routing audits, dependency checks, targeted Layer 1 tests, and diff hygiene.
8. Commit and push intended tracked changes on `master`.

### Acceptance Criteria

- Active Codex and Claude `session-triage` mirrors are archived at `archive/v0.4/SKILL.md` before bumping to `v0.5`.
- Both mirrors explicitly check for `agentic-skills-bench` in `.agents/project.json` `enabled_packs` before recommending or relying on `benchmark-test-skill`.
- Missing `agentic-skills-bench` recommendations use `npx skillpacks install agentic-skills-bench` from the project shell.
- Codex reload guidance says to start a fresh Codex CLI session if the `$` skill list remains stale.
- Claude reload guidance says to run `/reload-skills`, then `/clear` or restart if still invisible.
- Existing benchmark regression workflow remains intact.

## Previous Implementation - Flag Legacy Global Skills and Reinstall Base Locally

### Goal

Make `skillpacks refresh --all` surface legacy user-home global installs, and add `skillpacks uninstall-global --reinstall-base` so users can remove those globals while enabling project-local base skills across discovered projects.

### Plan

1. Record prompt history and task tracking for the `investigate`-driven implementation.
2. Add a reusable legacy-global detector that uses the same skillpacks-owned marker/source rules as uninstall cleanup.
3. Wire the detector into `refresh --all` and `refresh --all --dry-run` so project scanning still runs but the command exits nonzero when globals are flagged.
4. Add `uninstall-global --reinstall-base` to remove skillpacks-owned globals, discover project roots below the current directory, enable `base_skills: true`, refresh project-local skill roots, and initialize the current directory when no project roots are found.
5. Extend lifecycle tests for warning, dry-run read-only behavior, reinstall-base migration, fallback init, and unsupported args.
6. Update CLI help, package changelog, and npm distribution docs.
7. Run focused package tests and build checks, then review diff hygiene.

### Acceptance Criteria

- `refresh --all` and `refresh --all --dry-run` flag skillpacks-owned installs under `~/.claude/skills` and `~/.codex/skills`, suggest `npx skillpacks uninstall-global`, still process project roots, and return `1`.
- Dry-run global detection does not mutate project skill roots.
- `uninstall-global --reinstall-base` preserves unmanaged and foreign global skills while removing skillpacks-owned global installs.
- Reinstall mode preserves existing project config fields while setting `base_skills: true` and installing local base skills for each discovered project.
- With no discovered project roots, reinstall mode initializes the current directory with base skills.
- Existing `uninstall-global` no-arg behavior remains supported and unsupported args still fail.

## Historical Implementation - Fix Alignment-Page Review Routing

### Goal

Correct product-design routing so default `$ux-variations` cannot skip `$ui-interview`, and repair Alignmeant's active alignment-page-review state so invalid prototypes are archived and active routing returns to the first UI interview branch.

### Plan

1. Record this implementation in `tasks/roadmap.md` and `tasks/todo.md`.
2. Archive and bump `ux-variations` from `v0.26` to `v0.27` and `prototype` from `v0.18` to `v0.19` across product-design Codex/Claude sources and installed Codex copies where writable.
3. Tighten `ux-variations` default progression mode so route experiments are validation targets, not prototype buildout instructions, until an approved `$ui-interview` branch exists.
4. Tighten `prototype` so build-plan items must carry UI experiment/review linkage, matching `design/flow-tree.schema.json`.
5. Archive invalid Alignmeant active prototype artifacts before removing active build-plan/prototype references.
6. Update Alignmeant flow-tree and UX variation artifacts to route to `$ui-interview uxv-alignment-page-review-trust-first-review-page`.
7. Run archive/parity/build checks in `agentic-skills` and targeted routing checks in `alignmeant`.
8. Commit and push intended changes in each mutated repo.

### Acceptance Criteria

- Default UX variation progression routes to `$ui-interview [specific-ux-variation]` before build-plan synthesis or `$prototype`.
- Pre-UI prototype buildout is allowed only for layout-mode or explicit ad hoc bypass recorded as an override.
- Prototype build-plan items without `ui_experiment_id` or equivalent UI review linkage halt before building.
- Alignmeant keeps invalid prototype artifacts only under `docs/history/archive/**`.
- Alignmeant active routing points to `$ui-interview uxv-alignment-page-review-trust-first-review-page`.

## Historical Implementation - Fix `skillpacks uninstall-global` Legacy Cleanup

### Goal

Make `skillpacks uninstall-global` remove legacy user-home global skill installs created by older `agentic-skills` versions while preserving unmanaged, markerless, and foreign managed skill directories.

### Plan

1. Record active task tracking in `tasks/roadmap.md` and `tasks/todo.md`.
2. Update `packages/skillpacks/src/cli/lifecycle.mjs` so uninstall cleanup recognizes current `base/*` and `packs` sources plus legacy `global/*` skillpacks-owned sources.
3. Require directory markers to include `managed_by=agentic-skills` before deletion.
4. Extend lifecycle tests for legacy `global/claude`, legacy `global/codex`, user-defined markerless dirs, foreign sources, and suspicious unmanaged markers.
5. Update `CHANGELOG.md` with the npm-package behavior fix.
6. Run package verification and publish dry-run gates.
7. Publish with `./publish.sh patch`, verify published behavior, then commit and push intended changes.

### Acceptance Criteria

- `uninstall-global` removes current and legacy skillpacks-owned user-home installs under `~/.claude/skills` and `~/.codex/skills`.
- Markerless user skills remain untouched.
- Directories with marker sources outside known skillpacks-owned roots remain untouched.
- Directories whose marker does not declare `managed_by=agentic-skills` remain untouched even with suspicious sources.
- Public CLI command surface remains unchanged.

## Historical Implementation - Alignment Feedback YAML Clarification Intake

### Goal

Patch the shared alignment-page convention so fresh-session `needs-clarification` / `clarify-before-approval` YAML is not treated as an automatic HTML-edit instruction. Preserve the existing YAML schema and review lifecycle while requiring agents to classify feedback intent before mutating artifacts.

### Plan

1. Update task tracking with this implementation plan and active checklist.
2. Edit only `docs/alignment-page-convention.md` inside the `alignment-convention` block.
3. Add feedback-intake-before-mutation language that classifies feedback as `answer-only`, `amend-page`, `investigate-before-amend`, `pushback-needed`, or `ask-user-before-amend`.
4. Tighten the section-feedback YAML, pre-approval stop, and after-approval handling language so clarification means resolve before approval, not silently patch HTML.
5. Regenerate generated `ALIGNMENT-PAGE.md` bundles with `node scripts/upgrade-alignment-page.mjs`.
6. Update Layer 1 assertions for the new intake-classification contract.
7. Add a prevention lesson for question-like alignment YAML.
8. Run the requested alignment generator checks, focused tests, active-page audit, and diff hygiene.

### Acceptance Criteria

- Public YAML fields remain unchanged: no new schema fields or page controls.
- Question-like, concern-like, premise-challenge, and ambiguous tradeoff feedback is answered or pushed back before page mutation.
- Plain factual clarifications and explicit amendment requests can still amend the page directly.
- Pages are never confirmed or routed downstream while unresolved clarification or negative feedback remains.
- Generated alignment bundles are in sync with the canonical convention.

## Previous Implementation - Skillpacks Refresh Dry-Run UX

### Goal

Fix `skillpacks refresh` so reload guidance appears only when project-local skill installs actually changed, and make `skillpacks refresh --all --dry-run` report planned refresh changes with an aggregate safe-to-run verdict.

### Plan

1. Inspect lifecycle helpers, project config writes, and existing lifecycle tests for refresh/install/remove behavior.
2. Refactor refresh internals so skill-root sync and prune operations return concrete change counts.
3. Keep `.agents/project.json` writes and logs quiet during no-op refreshes.
4. Replace `refresh --all --dry-run` doctor delegation with a refresh-specific planner that reports proposed installs, updates, removals, skipped unmanaged roots, and project failures.
5. Add aggregate dry-run summary output with projects scanned, per-project counts, affected skills/targets, safe verdict, and recommended command when safe.
6. Update lifecycle tests and package changelog for the user-visible CLI behavior.
7. Run focused lifecycle tests and package verification, then review diff hygiene.

### Acceptance Criteria

- No-op `skillpacks refresh` exits 0 without `Skill installs changed` or false `.agents/project.json` update logs.
- Stale managed updates and managed orphan removals still print reload guidance.
- `skillpacks refresh --all --dry-run` is read-only and reports missing installs, stale updates, managed removals, skipped unmanaged roots, failures, aggregate affected skills, and `Safe to run: yes/no`.
- Failed project config in dry-run returns nonzero and marks the aggregate verdict unsafe.
- `refresh --dry-run` without `--all` remains rejected.

## Previous Implementation - Prepare skillpacks 0.1.10 Publish

### Goal

Prepare the already-shipped consolidate-prototypes/graduation work for the next public `skillpacks` / `@glexcorp/gskp` release without running the real publish command.

### Plan

1. Inspect release state, package version, generated artifacts, and changed skill contracts.
2. Fix any publish-blocking contract/version inconsistencies found during release prep.
3. Archive and bump active skills whose behavior changes before publish.
4. Regenerate package and Skills Showcase generated artifacts from the staged skill boundary.
5. Add package changelog and task review records for the pending `0.1.10` release.
6. Run release gates and a dry-run publish check without publishing.
7. Commit and push the publish-prep source state so the real `./publish.sh patch` can run from a clean tree.

### Acceptance Criteria

- Active product-design contracts are internally consistent: `consolidate-prototypes` writes AFPS graduation and `spec-interview` gates on it.
- Changed active skills have archive snapshots and changelog entries.
- Generated package manifest and Skills Showcase data reflect the corrected active versions.
- `CHANGELOG.md` has a pending `0.1.10` release entry.
- The real publish command is left for the user and can run from a clean committed tree.

## Historical Implementation - Clean Up 0.1.9 Publish Blockers

### Goal

Prepare the repo for a clean `skillpacks` / `@glexcorp/gskp` `0.1.9` publish by fixing release metadata, documenting the release-readiness audit result, and rerunning the exact release gates before any publish.

### Plan

1. Inspect current release metadata, task tracking, package version state, and release runbook.
2. Add the `0.1.9` package changelog entry and correct the stale `0.1.8` publication wording.
3. Record release-readiness status and the remaining npm-auth human action in task tracking.
4. Run the release gates in order: package tests, package verify, convention bundle audit, alignment audit, interrogation audit, and npm registry checks.
5. Check npm auth and run `./publish.sh --dry-run patch` only if `npm whoami --registry https://registry.npmjs.org/` succeeds.
6. Commit and push metadata cleanup before any real publish attempt.

### Acceptance Criteria

- `CHANGELOG.md` documents `0.1.9` release contents and pre-publish verification status.
- `CHANGELOG.md` no longer says `0.1.8` is unpublished.
- Active skill version hygiene is recorded as passing: no missing `version:`, no bumped active skill missing archive/changelog, and no package-boundary failure after clean rebuild.
- The remaining human action is clear: run `npm login --registry https://registry.npmjs.org/` as `glexcorp` or an explicitly authorized publisher.
- Runtime code remains untouched unless a deterministic verification failure reproduces from a clean build.
- Metadata cleanup is committed and pushed before any real publish attempt.

## Historical Implementation - HTML-First Canonical Write Contract

### Goal

Tighten product-design contracts so `state-model` and `ux-variations` may use Markdown intermediates as durable chunk cursors, but final canonical `design/**` Markdown/YAML writes, flow-tree growth, glossary writes, and archive-at-canonical-write cleanup happen only after the HTML alignment page is reviewed and confirmed.

### Plan

1. Add an HTML-first canonical write rule to `docs/design-tree-loop-convention.md`.
2. Archive and bump mirrored `state-model` skills from `v0.4` to `v0.5`; reword synthesis as proposed review content until alignment approval.
3. Archive and bump mirrored `ux-variations` skills from `v0.24` to `v0.25`; reword chunked assembly as proposed review content until alignment approval.
4. Regenerate `DESIGN-TREE-LOOP.md` bundles.
5. Extend Layer 1 regression coverage for proposed review content vs approval-gated canonical writes.
6. Run the requested convention, audit, test, build, showcase, and diff-hygiene checks; fix any failures.
7. Record review notes, ship manifest, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- `_working/` briefs and per-unit intermediates remain allowed as Markdown before approval.
- Final assembled deliverables are treated as proposed review content until rendered in `alignment/{skill}-{topic}.html`.
- Canonical `design/**/*.md`, `design/**/*.yaml`, flow-tree child growth/back-pointers, glossary writes, and archive cleanup appear only in approval-gated wording.
- Active Codex and Claude `state-model` and `ux-variations` mirrors distinguish proposed review content from canonical writes.
- Generated `DESIGN-TREE-LOOP.md` bundles are in sync with `docs/design-tree-loop-convention.md`.
- Regression coverage fails if canonical design Markdown/YAML writes drift back into pre-approval assemble wording.

## Historical Implementation - Clarify Chunked Skill Progress

### Goal

Make product-design chunked self-routing stops visibly explain progress and continuation, while fixing the active Codex `state-model` path contract to match the canonical pack source layout.

### Plan

1. Update the canonical design-tree loop convention with a required Progress Handoff Block for chunked setup, per-unit, and assemble stops.
2. Regenerate `DESIGN-TREE-LOOP.md` bundles from the convention.
3. Archive and bump mirrored `state-model` skills from `v0.3` to `v0.4`; fix Codex malformed paths and add explicit progress-handoff requirements.
4. Archive and bump mirrored `ux-variations` skills from `v0.23` to `v0.24`; add explicit progress-handoff requirements.
5. Add focused Layer 1 coverage for malformed Codex `state-model` paths and missing chunked progress copy.
6. Run malformed-path, progress-handoff, convention, and focused test checks; fix any failures.
7. Record review notes, commit, and push intended changes on `master`.

### Acceptance Criteria

- Active Codex and Claude pack skills require a user-facing Progress Handoff Block at every chunked stop.
- The handoff copy explains completed count, durable cursor, completed/current phase, next phase, why the same command is repeated, fresh-session guidance, and exact next command.
- Codex `state-model` active paths use `design/{slug}/_working/state-model-{topic}-brief.md`, `design/{slug}/state-model-{topic}/{framework}.md`, and `alignment/state-model-{topic}.html`.
- Generated `DESIGN-TREE-LOOP.md` bundles are in sync with `docs/design-tree-loop-convention.md`.
- Regression coverage fails on the malformed `$state-model` paths and missing progress-handoff language.

## Current Research - Managed Skill Library SaaS Prompt

### Goal

Research the market context for a managed SaaS spin-off inspired by the `skillpacks` npm package, then prepare a prompt that can be run in a separate product repo with `$idea-scope-brief`.

### Plan

1. Capture the `$idea-scope-brief`-targeting prompt and confirm local `skillpacks` package positioning from repo docs.
2. Research current public competitors and adjacent surfaces, especially skills.sh, Claude Skills, OpenAI custom GPT/agent-builder surfaces, agent marketplaces, and prompt/library management products.
3. Synthesize likely market gap hypotheses for managed white-label skill libraries.
4. Write a reusable separate-repo prompt with concept assumptions, competitor context, differentiation hypotheses, constraints, non-goals, and research questions.
5. Verify links and repo diffs, record review notes, then commit and push intended tracked artifacts.

### Acceptance Criteria

- The deliverable is usable as a direct `$idea-scope-brief` invocation in a new skill-library product repo.
- Competitor and market notes distinguish sourced facts from hypotheses.
- The prompt preserves the user's core question: whether managed SaaS leaves a gap beyond skills.sh and the existing npm package.
- Task review records sources and verification.

## Historical Implementation - Pattern A Routing Wording

### Goal

Remove redundant review-pending "Continue In A Fresh Session" wording from Pattern A research-loop skill handoffs while keeping compiled YAML self-routing and parent-owned state resolution intact.

### Plan

1. Capture the `$investigate` prompt and validate the user's wording concern against active skills, conventions, and audits.
2. Replace the review-pending handoff label with a concise YAML invocation section that only names the parent command.
3. Update active Pattern A orchestrator and framework skill contracts for Codex and Claude, including required version archives/changelogs.
4. Update the handoff audit so future skills enforce the new label and command parity wording.
5. Run the focused handoff audit and diff hygiene, record the review, then commit and push.

### Acceptance Criteria

- Review-pending handoffs no longer use `## Continue In A Fresh Session`.
- `## Next Work` remains the place that tells the user to review, compile, and paste YAML.
- The command section names only the parent skill invocation to use with the compiled YAML.
- Post-approval routing still uses `## Recommended Next Command`.
- Pattern A handoff audit passes.

## Historical Implementation - npm Publish Recovery Hardening

### Goal

Make the npm release process recoverable and auditable before the next publish by fixing `./publish.sh --current`, adding real auth/access checks to dry-run preflights, and documenting the source commit/tag requirements after successful publication.

### Scope

- `publish.sh` recovery, staging, registry-state checks, and dry-run auth preflight behavior
- `packages/skillpacks/scripts/prepublish-auth-check.mjs`
- Focused Node tests for release recovery and auth preflight behavior
- `docs/release-runbook.md`
- Task review notes and verification output

### Plan

1. Inspect current release script behavior, auth preflight tests, runbook guidance, and existing dirty tree state.
2. Make `--current` a true partial-publish recovery path: require `skillpacks@VERSION` to exist, require `@glexcorp/gskp@VERSION` to be missing, skip republishing `skillpacks`, publish only the alias from the staged artifact, and verify both package specs afterward.
3. Preserve safety by allowing `--current` recovery only from a clean tracked tree or from the expected release-state edits to `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.
4. Add dry-run auth/access preflight behavior that still checks `npm whoami`, maintainer/scope access, and target-version availability without publishing.
5. Extend tests for `--current` registry states and auth preflight behavior, including scoped alias maintainer parsing.
6. Update the release runbook with recovery and post-publish commit/tag/push requirements.
7. Run package tests, build check, publish dry run, and diff hygiene; record results.

### Acceptance Criteria

- `./publish.sh --current` succeeds only when `skillpacks@VERSION` exists and `@glexcorp/gskp@VERSION` is missing.
- `./publish.sh --current` publishes only the alias package and still verifies both published specs.
- Registry states where both packages exist or only the alias exists fail with clear messages.
- Dry-run preflight proves npm auth and package access instead of skipping auth checks.
- Successful releases leave explicit instructions and checks for committing/tagging/pushing the source version and manifest state.
- Verification passes, or any unavailable external checks are recorded.

## Historical Implementation - Guarantee Skill Convention Bundles

### Goal

Make convention bundle dependencies explicit, audited, and package-gated so any active skill that needs a convention bundle declares it in `SKILL.md` frontmatter and source/package/install checks fail if the bundle is missing, stale, unpublished, or not copied into local skill roots.

### Scope

- Active `base/**/SKILL.md` and `packs/**/SKILL.md` frontmatter metadata
- Convention registry and global bundle audit scripts under `scripts/`
- Package staging and package boundary checks
- Skillpacks install/refresh regression coverage for representative convention-bundled skills
- Task review notes and verification output

### Plan

1. Inspect the existing alignment, interrogation, and prototype convention generators, package staging, active skill metadata, and install/refresh tests.
2. Add a central convention registry that maps each convention ID to its canonical docs path, sibling bundle filename, packaged asset path, and check command.
3. Seed `required_conventions` frontmatter on active skills from existing sibling bundles.
4. Add a read-only global audit that checks declared/missing/undeclared bundles, stale generated content, references without declarations, package staging asset/script coverage, and tracked bundle presence.
5. Wire the audit into package build verification and focused package boundary tests while keeping top-level `docs/` unpublished.
6. Add install/refresh regression coverage using temp projects to prove representative skills copy every declared bundle into `.claude/skills/*` and `.codex/skills/*`.
7. Run generator checks, the new audit, refresh/doctor, package tests, package verification, and diff hygiene.
8. Record review notes, then commit and push intended tracked changes on the primary branch.

### Acceptance Criteria

- Every active skill with `ALIGNMENT-PAGE.md`, `INTERROGATION-PAGE.md`, or `PROTOTYPE-SESSION-LOOP.md` declares the matching convention ID in `required_conventions`.
- The global audit fails on missing declared bundles, undeclared sibling bundles, convention references without declarations, generated bundle drift, missing tracked required bundles, and package staging omissions.
- The npm package includes convention maintenance scripts/assets and sibling runtime bundles, while top-level `docs/` remains unpublished.
- Install/refresh tests prove declared bundles are copied into local `.claude/skills` and `.codex/skills` roots.
- Verification passes, or any unrelated pre-existing failure is proven.

## Historical Implementation - Prototype Convention Bundle Distribution

### Goal

Fix the prototype-session-loop convention distribution gap by keeping `docs/prototype-session-loop-convention.md` as the canonical authoring file while generating package/refreshed per-skill runtime bundles beside every active skill that references the convention.

### Scope

- `docs/prototype-session-loop-convention.md` remains canonical and unpublished as top-level `docs/`.
- New `PROTOTYPE-SESSION-LOOP.md` bundles for active prototype-phase skills that cite the convention.
- Skill references updated to point at the sibling bundle instead of top-level `docs/`.
- Generator/check command and package staging boundary updates.
- Package boundary tests and focused verification.

### Plan

1. Inspect the existing alignment/interrogation bundle generators, package staging, active prototype-phase skill references, and package boundary tests.
2. Add a prototype-session-loop bundle generator that reads the canonical docs file, writes `PROTOTYPE-SESSION-LOOP.md` beside participating skills, and checks drift in `--check` mode.
3. Wire the generator into `scripts/pack.sh` / package CLI surfaces and staged npm package assets without publishing top-level `docs/`.
4. Generate bundles and update every active skill reference from `docs/prototype-session-loop-convention.md` to `PROTOTYPE-SESSION-LOOP.md`.
5. Update package boundary tests to require the generator, packaged asset, and representative bundled skill files while still denying top-level `docs/`.
6. Run refresh, doctor, focused package tests, package verification, and diff hygiene.
7. Record review notes, then commit and push intended changes on the primary branch.

### Acceptance Criteria

- Every active skill that references the prototype session-loop convention has a sibling `PROTOTYPE-SESSION-LOOP.md`.
- Active skill contracts refer to the sibling bundle, not `docs/prototype-session-loop-convention.md`.
- The canonical docs file is still the source for generated bundles.
- The npm package includes runtime assets/scripts/bundles but does not include top-level `docs/`.
- `scripts/pack.sh refresh` installs the sibling bundles into local skill roots.
- Focused checks and package tests pass, or unrelated pre-existing failures are proven.

## Historical Implementation - Finalized Artifact Routing Lesson

### Goal

Ship the correction that finalized research/alignment artifact handoffs need explicit terminal next-step routing, and clear the tracked dirty-file blocker before the `0.1.6` npm publish dry run.

### Plan

1. Inspect the dirty tree and confirm the publish blocker.
2. Preserve the finalized-artifact routing correction in `tasks/lessons.md`.
3. Capture required prompt history for the `ship-end` invocation and include the existing untracked investigate prompt log.
4. Record task/history notes and a ship manifest with correction enforcement rationale.
5. Run documentation/diff hygiene checks, commit, and push on `master`.

### Acceptance Criteria

- `tasks/lessons.md` contains the current correction.
- Prompt-history artifacts for the relevant skill invocations are tracked.
- Task/history/manifest files document the boundary and state that no source/package runtime changes were made.
- The tracked tree is clean after commit/push so `./publish.sh --dry-run 0.1.6` can proceed.

## Historical Implementation - Release Parity And npm Login Runbook

### Goal

Document the `skillpacks` / `@glexcorp/gskp` maintainer publish process with explicit npm login, OTP/access expectations, same-version release parity gates, and partial-publish recovery.

### Scope

- New maintainer release runbook under `docs/`
- Cross-links from the npm distribution design and README npm section
- Small `publish.sh` output hardening before real publish
- Task review notes and verification output

### Plan

1. Inspect the current release docs, README, package metadata, and `publish.sh` behavior.
2. Add `docs/release-runbook.md` with npm auth, expected publisher, dry-run/current release commands, no-manual-one-package rule, partial-publish recovery, and post-publish parity checks.
3. Point Phase 5 / publication guidance in `docs/skillpacks-npm-distribution.md` at the runbook and make same-version parity a hard release gate.
4. Add a short README maintainer note near the npm CLI/package section.
5. Harden `publish.sh` output with a final prereq/recovery reminder before non-dry-run publishes.
6. Run package tests, package verification, dry-run publish verification, targeted doc-gate checks, and diff hygiene.
7. Record review notes, then commit and push intended tracked changes on the primary branch.

### Acceptance Criteria

- Maintainers can follow a concise runbook for publishing both packages.
- The docs require `npm login` / `npm whoami`, the expected `glexcorp` publisher, scoped access for `@glexcorp/gskp`, and OTP readiness.
- Release docs state that `skillpacks` and `@glexcorp/gskp` must publish at the same version and must be verified with `npm view`.
- Docs prohibit manual one-package `npm publish` recovery and direct maintainers to `./publish.sh --current` after fixing npm auth/access.
- `publish.sh` reminds maintainers of auth, two-package parity, and the `--current` recovery command before real publish.
- Verification passes, or any unavailable external check is recorded.

## Historical Implementation - Public npm Package Changelog

### Goal

Create a public package-level changelog for the `skillpacks` / `@glexcorp/gskp` npm releases, retroactively covering published versions and establishing the file as the maintained release-history surface going forward.

### Scope

- Package-level changelog documentation
- README discoverability link if no package changelog link exists
- Task review notes and verification output

### Plan

1. Reconstruct published package versions from npm metadata and local git history.
2. Review release-related docs and ship manifests to summarize user-facing package differences.
3. Add a public changelog that distinguishes package releases from per-skill `CHANGELOG.md` files.
4. Link the changelog from the README/npm package docs.
5. Run documentation/diff hygiene checks.
6. Commit and push intended tracked changes.

### Acceptance Criteria

- A package-level changelog exists at a conventional public path.
- It covers all known npm package versions available from npm metadata or repo evidence.
- It documents that future npm package releases must update this file.
- README/package docs make the changelog discoverable.
- Verification passes, or any unavailable external check is recorded.

## Historical Implementation - Codex/Claude Skill Version Parity Catch-Up

### Goal

Verify current Codex/Claude skill version gaps, classify intentional split implementations versus stale drift, and patch only the portable parity gaps while preserving runner-native command syntax.

### Scope

- Pack parity targets:
  - `packs/product-design/{codex,claude}/design-system`
  - `packs/session-analytics/{codex,claude}/analyze-sessions`
  - `packs/session-analytics/{codex,claude}/session-triage`
- Base parity targets:
  - `base/{codex,claude}/init-agentic-skills`
  - `base/{codex,claude}/idea-scope-brief`
- Parity enforcement scripts/tests for the patched gaps
- Archive snapshots and changelog entries for stale skill sides
- Generated manifests/showcase data only if metadata regeneration changes them
- Task review notes and verification output

### Plan

1. Run a read-only active skill version audit across `packs`, `base`, `.claude/skills`, and `.codex/skills`.
2. Confirm that the only patchable version gaps are the five named targets after excluding intentional splits: `exec`, `delegate`, `patch-exec-profile`, `project-fleet`, and `spin-off`.
3. For each target, compare active `SKILL.md` and `CHANGELOG.md` pairs and identify runner-neutral behavior from the newer side.
4. Archive each stale active `SKILL.md` with `scripts/skill-archive.sh`, then patch the stale side to the higher existing version while preserving `$...` versus `/...` command syntax and agent-specific wording.
5. Update parity enforcement by removing resolved pack version-drift allowances, clarifying the intentional `exec` drift reason, and adding targeted base-version parity coverage.
6. Regenerate package/showcase metadata with existing generators when changed skill metadata requires it.
7. Run parity checks, version/archive checks, targeted tests, package/showcase validation as needed, and `git diff --check`.
8. Record review notes, then commit and push intended tracked changes on the primary branch.

### Acceptance Criteria

- `design-system`, `analyze-sessions`, `session-triage`, `init-agentic-skills`, and `idea-scope-brief` have matching active versions across Codex/Claude.
- Stale sides have archive snapshots for their previous versions and changelog entries for the catch-up.
- Runner-native invocation syntax remains unchanged: Codex uses `$...`; Claude uses `/...`.
- Pack parity allowlists no longer hide the three resolved pack version gaps.
- Intentional one-sided and split implementations remain allowlisted with accurate reasons.
- Static version presence, parity, targeted tests, and package/showcase validation pass or any unrelated pre-existing failure is proven.

## Historical Implementation - Ship-End Research/Design Route Precedence

### Goal

Update `ship-end` so session wrap-up recommendations preserve direct research, alignment, design, UI, UX, prototype-test, and copy-audit routes instead of defaulting those review workflows into `$exec` or `/exec`.

### Scope

- `packs/exec-loop/codex/ship-end/SKILL.md`
- `packs/exec-loop/claude/ship-end/SKILL.md`
- Corresponding `archive/v0.4/SKILL.md` snapshots and `CHANGELOG.md` files
- Focused route-precedence audit coverage under `scripts/`
- Prompt history, task tracking, correction lesson, and history notes for this skill edit
- Generated package/showcase artifacts only if required by validation

### Plan

1. Capture the visible invocation prompt and record this implementation plan.
2. Archive active mirrored `ship-end` contracts and bump them from `v0.4` to `v0.5`.
3. Add an explicit Next-Step Routing precedence rule: when the next item names research/alignment/design/UI/UX/prototype-test/copy-audit artifacts or review pages, recommend the owning skill or required review/compiled-YAML route directly.
4. Keep `$exec` and `/exec` as fallbacks only when no narrower installed skill, artifact contract, or review route owns the next action.
5. Add focused audit coverage that fails if the mirrored `ship-end` contracts lack the owning-route precedence rule or the `$exec`/`/exec` fallback limit.
6. Update `tasks/lessons.md`, task review notes, and history.
7. Run focused verification, source audits, and diff hygiene, then commit and push intended changes.

### Acceptance Criteria

- Codex and Claude `ship-end` contracts both contain the same owning-route precedence behavior with runner-native syntax.
- The route rule covers research, alignment, design, UI, UX, prototype-test, and copy-audit artifacts/review pages.
- `$exec`/`/exec` remain valid only as fallback routes when no narrower owner exists.
- A focused audit proves both mirrors contain the route-precedence contract.
- Existing version/archive/changelog audits pass.
- The prompt-history artifact and correction lesson are included in the shipping boundary.

## Current Investigation - Self-Routing Pattern A Continuation Payload

### Goal

Validate the reported mismatch between Pattern A continuation handoffs and the research-loop contract, then update the minimal contract/code/tests so compiled YAML can carry parent-orchestrator routing context without turning framework subskills into user-facing commands.

### Scope

- `docs/research-session-loop-convention.md`
- Pattern A orchestrator and framework skill contracts under `packs/business-research/` and `packs/customer-lifecycle/`
- Research-loop handoff/routing audits and fixtures
- Generated package artifacts if required by verification
- Prompt history and task tracking for this `$investigate` invocation

### Plan

1. Capture the visible `$investigate` invocation prompt and record this investigation plan.
2. Validate the user claims against the research-loop convention, active Pattern A skill contracts, generated examples, and recent git history.
3. Identify the smallest durable contract change for self-routing continuation payloads.
4. Update docs, skill contracts, versions/archives/changelogs, and audits/tests only where needed.
5. Fix any verification-only remediation required to make the contract checks meaningful.
6. Run focused verification and inspect the final diff.
7. Commit and push intended tracked changes on the primary branch.

### Acceptance Criteria

- Review-gate YAML examples include `agent_routing` with the parent orchestrator command, product path, gate owner/type, framework context when applicable, run manifest, and parent-owned next resolution.
- The contract states that self-routing YAML routes a fresh agent to the parent orchestrator, but the parent still interprets state, writes artifacts, archives, and decides whether to load framework subskills inline.
- No active Pattern A contract exposes path-shaped framework child commands as the user-facing route.
- Existing terminal command handoffs remain compatible for explicit re-invocation.
- Version/archive/changelog requirements are satisfied for changed skills.
- Focused audits/tests pass.

## Historical Implementation - Research Loop Terminal Handoff Sections

### Goal

Make Pattern A research orchestrators and their framework subskills end each loop stop with a clean, predictable terminal handoff: a `Next Work` section that names the immediate next action and a `Recommended Next Command` section that names the exact parent-orchestrator command to run next.

### Scope

- `docs/research-session-loop-convention.md`
- `docs/orchestrator-convention.md`
- Active mirrored Pattern A orchestrator contracts:
  - `packs/business-research/{codex,claude}/customer-discovery/SKILL.md`
  - `packs/business-research/{codex,claude}/competitive-analysis/SKILL.md`
  - `packs/business-research/{codex,claude}/positioning/SKILL.md`
  - `packs/customer-lifecycle/{codex,claude}/journey-map/SKILL.md`
- Active mirrored Pattern A framework subskills under those orchestrators' `frameworks/` directories
- Corresponding `CHANGELOG.md` and `archive/<old-version>/SKILL.md` snapshots for any changed skill
- `tasks/lessons.md` correction note, task review notes, generated package artifacts if required by verification

### Plan

1. Record this implementation plan and confirm the exact terminal handoff contract.
2. Archive and bump versions for every changed Pattern A orchestrator and framework subskill.
3. Update the shared Research Session Loop and orchestrator conventions with the final-output format.
4. Update mirrored orchestrator contracts so review-pending, post-framework-write, final-framework-to-synthesis, and post-synthesis states all specify `Next Work` plus `Recommended Next Command` as the final terminal sections.
5. Update framework subskill contracts so inline framework stops use the parent-owned handoff format without introducing direct subskill commands or downstream routing.
6. Add a correction lesson and focused audits for the new handoff language.
7. Run version/archive/mirror/routing audits, package build/tests, verification, and diff hygiene.
8. Commit and push the intended changes on `master`.

### Acceptance Criteria

- Pattern A review stops end with `Next Work` and `Recommended Next Command After Compiling YAML` naming only the parent orchestrator command.
- Pattern A post-write stops end with `Next Work` and `Recommended Next Command` naming the parent orchestrator; the last framework routes explicitly to the synthesis phase.
- Framework subskills do not recommend child path commands, `$exec`, `/exec`, or downstream skills; any command handoff they define is parent-owned loop continuation only.
- Post-synthesis downstream routing still appears only after canonical synthesis has been approved and written.
- Codex/Claude mirrors stay semantically aligned, with `$` vs `/` command syntax differences only.
- All changed `SKILL.md` files have version bumps, archive snapshots, and changelog entries.
- Verification commands pass, or any pre-existing unrelated failure is proven.

## Current Investigation - Journey Map Routing Non-Compliance

### Goal

Validate the reported `$journey-map` next-step routing non-compliance in `/Users/georgele/projects/tools/dev/alignmeant`, identify the prevention point, and apply the smallest durable fix in `agentic-skills` or the target repo state if warranted.

### Scope

- Visible active conversation and provided triage summary
- `/Users/georgele/projects/tools/dev/alignmeant/.codex/skills/session-triage/SKILL.md`
- `/Users/georgele/projects/tools/dev/alignmeant/.codex/skills/journey-map/SKILL.md`
- `/Users/georgele/projects/tools/dev/alignmeant/.claude/skills/journey-map/SKILL.md`
- Target journey-map run manifest, intermediates, progress, and task docs
- `tasks/lessons.md` and task tracking in this repository
- Prompt history for this `$investigate` invocation

### Plan

1. Capture the visible `$investigate` invocation prompt and record the investigation plan.
2. Gather narrow evidence from the target repo contracts, run manifest, canonical intermediates, progress, tasks, and relevant git history.
3. Validate the user-provided claims against the target repo state and contract text.
4. Determine whether prevention belongs in the target repo state, journey-map skill contract, mirrored skill contracts, repo lessons, or no code change.
5. Apply the minimal durable fix if the evidence supports one.
6. Run focused validation checks and record review notes.

### Acceptance Criteria

- The report distinguishes the user-identified issue from the agent-verified issue.
- The next-step routing state is replayed from manifest/intermediate/canonical-file existence.
- Any modified manifest or skill contract is validated by targeted `rg` and existence checks.
- A correction lesson is added or an existing lesson is explicitly reused.
- The final answer states the exact next safe `$journey-map` command.

## Historical Implementation - skillpacks Refresh Duplicate Framework Installs

### Goal

Prevent `skillpacks refresh` and pack installs from creating top-level duplicate framework skill roots while preserving nested framework files inside their parent orchestrator installs and keeping framework entries visible in the manifest inventory.

### Scope

- `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/src/cli/pack-normalization.mjs`
- `packages/skillpacks/test/manifest.test.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- Generated manifest/package artifacts if required by package verification
- Prompt history and task tracking for this `$investigate` invocation

### Plan

1. Capture the visible `$investigate` invocation prompt and record this implementation plan.
2. Trace manifest generation, install argument normalization, lifecycle sync, and pruning behavior.
3. Add an `installable` manifest flag that excludes nested pack skills from top-level install targets while keeping base skills and top-level pack skills installable.
4. Filter pack installs, refreshes, expected-root counts, exact skill resolution, and remove/prune calculations to installable skills only.
5. Ensure refresh prunes obsolete repo-managed top-level framework roots while preserving unmanaged same-name roots.
6. Add focused manifest and lifecycle regression coverage.
7. Run package tests/build verification, inspect the diff, commit, and push intended changes.

### Acceptance Criteria

- Nested framework/subskill `SKILL.md` entries remain in the manifest with `installable: false`.
- `install business-research` installs `customer-discovery` without creating top-level `five-rings`, `pmf-engine`, or `w3-hypothesis` roots.
- Nested framework files remain present under the installed `customer-discovery/frameworks/*` tree.
- `refresh` removes old repo-managed duplicate top-level framework roots once they are no longer expected.
- `refresh` does not delete unmanaged local roots with the same names.
- Focused package verification passes.

## Historical Implementation - Single Base Skill Install Support

### Goal

Allow `npx skillpacks install idea-scope-brief` to install a retired global/base skill into the current project without requiring all base skills via `npx skillpacks init`.

### Scope

- `packages/skillpacks/src/cli/pack-normalization.mjs`
- `packages/skillpacks/src/cli/lifecycle.mjs`
- Focused Node CLI tests for exact base-skill install, refresh, and lookup behavior
- Task review notes and verification

### Plan

1. Inspect current install resolution and lifecycle behavior for base skills versus pack skills.
2. Add exact base-skill resolution to `install <name>`.
3. Teach lifecycle single-skill install/refresh to link `scope: base` skills and record them in `.agents/project.json`.
4. Add focused regression tests for `idea-scope-brief`.
5. Run targeted tests and package verification.
6. Review diff and report whether the installer can now handle the sunset skill.

### Acceptance Criteria

- `resolvePackCommandArgs('install', ['idea-scope-brief'])` resolves as a single skill, not an unknown name.
- `npx skillpacks install idea-scope-brief` installs `.claude/skills/idea-scope-brief` and `.codex/skills/idea-scope-brief`.
- The project records the install without enabling all base skills.
- `refresh` preserves the individual base skill install.

## Current Investigation - Codex Skill Startup Context

### Goal

Validate why Codex startup context is consuming roughly 5-8% for simple prompts, determine whether installed skill count is the cause, and apply the smallest local remediation if the repo or generated skill configuration is responsible.

### Scope

- Active Codex skill inventory under project-local and user-local skill roots
- Repo scripts and manifests that install or expose skills to Codex
- Prompt history and task tracking for this `$investigate` invocation
- Focused verification for any local fix

### Plan

1. Capture the visible `$investigate` invocation prompt and record this investigation plan.
2. Inventory Codex-visible skill roots and count installed skills by source.
3. Estimate the initial skill-list context footprint from names, descriptions, and paths.
4. Trace which repo artifacts or install flows caused unexpectedly large skill visibility.
5. Apply a minimal remediation only if the root cause is local and safely fixable.
6. Run focused verification, record results, commit, and push intended changes.

### Acceptance Criteria

- The investigation reports installed skill counts by root/source.
- The user claim is classified with concrete evidence.
- The largest contributors to initial context are identified.
- Any fix is verified with a repeatable command, or the report explains why no source fix was applied.

## Historical Implementation - Remove Global/Base Skill Availability Assumptions

### Goal

Update active skill contracts so agents recommend only commands that are currently running, verified available in the active session/project-local install state, or paired with the correct `npx skillpacks install` / `npx skillpacks init` setup guidance.

### Scope

- Active non-archive `SKILL.md` contracts under `base/` and `packs/`
- Generated/provisioned active guidance in `AGENTS.md`, `CLAUDE.md`, and packaged/build artifacts if refreshed by repo tooling
- Focused routing audits/tests for pack install guards and missing base-skill fallbacks
- Prompt history, lessons, task review notes, verification, commit, and push

### Plan

1. Capture the visible `skills` invocation prompt and record this implementation plan.
2. Audit active source skill contracts and routing tests for stale global/base availability assumptions.
3. Replace stale Pack Availability Guard wording so only the current skill and verified installed/project-local skills are directly recommendable.
4. Update base routing contracts in `afps-status`, `skills`, `pack`, and `provision-agentic-config`.
5. Add a correction lesson and focused regression coverage for unavailable pack and base skill recommendations.
6. Refresh generated package/local artifacts if required by the repository validation path.
7. Run targeted stale-contract scans, install-routing audits, skill validation, and diff hygiene.
8. Review the final diff, commit, and push intended changes on `master`.

### Acceptance Criteria

- No active non-archive `base/` or `packs/` `SKILL.md` file contains `Global skills are always valid`, `global/default route`, `base pack — no install hint needed`, or `installed base skills` as an availability guarantee.
- Pack-provided skills that are not verified available route through `npx skillpacks install <pack-or-skill>`.
- Missing base skills route through `npx skillpacks init` or a direct availability lookup, not an assumed `$skills`/`/skills` route.
- Legitimate user-home cleanup references for legacy base installs remain intact.
- Focused tests and repository audits prove the updated routing behavior.

## Historical Implementation - skillpacks 0.1.4 Version-Aware Release

### Goal

Publish `skillpacks@0.1.4` and `@glexcorp/gskp@0.1.4` with version-aware CLI status output, clearer install/update messages, and a publish path that preserves package/manifest metadata in the release commit.

### Scope

- `packages/skillpacks/bin/skillpacks.mjs`
- `packages/skillpacks/src/cli/update-check.mjs`
- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/test/*.test.mjs`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `publish.sh`
- Task tracking and release verification

### Plan

1. Inspect current CLI, lifecycle install, package metadata, tests, and publish script behavior.
2. Add command-gated package status output to stderr while preserving clean machine-readable commands.
3. Classify skill install results as installed, updated, or unchanged using existing managed marker versions and source skill versions.
4. Add `publish.sh --current` with version parity and unpublished-version checks.
5. Add focused test coverage for CLI status, lifecycle messages, and publish current dry-run behavior.
6. Bump package and manifest metadata to `0.1.4`.
7. Run verification, commit and push the release commit, publish both npm packages, and verify the published packages.

### Acceptance Criteria

- Human CLI commands print `skillpacks 0.1.4 (...)` to stderr.
- `--version`, `-v`, and `list --json` emit no package-status noise.
- Fresh, stale, pinned, and no-op installs use the requested output forms.
- `./publish.sh --dry-run --current` validates the committed package/manifest version without running `npm version`.
- Both npm packages publish at `0.1.4` from a committed and pushed tree.

## Historical Implementation - ord-align Routing Audit Contract Fix

### Goal

Fix the pre-existing `ord-align` routing audit findings by clarifying that downstream routing is emitted only after approved artifacts have been written or updated.

### Scope

- `packs/ord/codex/ord-align/SKILL.md`
- `packs/ord/claude/ord-align/SKILL.md`
- Mirrored `ord-align` archives and changelogs
- `tasks/lessons.md`
- Task tracking and verification

### Plan

1. Archive mirrored active `ord-align` `v0.1` contracts.
2. Bump mirrored active contracts to `v0.2` and add changelog entries.
3. Add minimal routing-after-approved-write wording without changing the staged workflow.
4. Run routing audit, version/archive/parity checks, and diff hygiene.
5. Record results, commit, and push the fix on `master`.

### Acceptance Criteria

- `node scripts/skill-alignment-routing-audit.mjs` exits 0.
- Mirrored active contracts are `v0.2` with `archive/v0.1/SKILL.md` snapshots.
- Codex and Claude contracts remain semantically mirrored with only runner command syntax differences.
- The fix does not alter ORD validation stage boundaries beyond clarifying the routing point.

## Current Investigation - ord-align Routing Audit Provenance

### Goal

Validate whether `node scripts/skill-alignment-routing-audit.mjs` still reports the existing `ord-align` findings on unmodified `HEAD`, making them pre-existing and unrelated to the current work.

### Scope

- Current working-tree diff and touched files
- `scripts/skill-alignment-routing-audit.mjs`
- Current-tree audit output
- Isolated unmodified `HEAD` audit output
- Task notes and prompt history for this `$investigate` invocation

### Plan

1. Capture the visible `$investigate` invocation prompt and record this investigation plan.
2. Run the direct routing audit in the current tree and capture exit code, scan count, and `ord-align` findings.
3. Reproduce the same command from an isolated unmodified `HEAD` export.
4. Compare current and `HEAD` outputs, check touched-file scope, and classify the user claim.
5. Record verification results, commit, and push intended prompt/task artifacts if no source fix is needed.

### Acceptance Criteria

- Current-tree output shows the exact `ord-align` findings and exit code.
- Unmodified `HEAD` output reproduces the same findings.
- Current uncommitted changes are confirmed not to touch the audit script or active `ord-align` inputs.
- The final report states whether a source fix was applied or why no fix was needed.

## Historical Implementation - Narrow Research Loop Routing Guardrails

### Goal

Narrow Pattern A Research Session Loop routing rules so pending approval pages may name the same parent orchestrator command for loop continuation, while still blocking downstream or cross-skill routing until approved artifacts are written.

### Scope

- `docs/research-session-loop-convention.md`
- `packs/business-research/codex/competitive-analysis/SKILL.md`
- `packs/business-research/codex/customer-discovery/SKILL.md`
- `packs/business-research/codex/positioning/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/SKILL.md`
- Skill archives and changelogs for the four affected Codex orchestrators
- Prompt history and task tracking

### Plan

1. Capture the visible `$investigate` invocation prompt and record this implementation plan.
2. Inspect current Research Session Loop convention, affected orchestrator contracts, changelogs, archive script, and routing audit availability.
3. Archive each active source skill before changing it.
4. Update the convention to distinguish pending-review continuation labels from confirmed-page continuation labels.
5. Update each parent orchestrator's approval-boundary wording and explicit same-orchestrator continuation command.
6. Bump affected versions and add changelog entries.
7. Run targeted route scans, version checks, routing audit, and diff hygiene.
8. Record verification results, inspect final diff, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- No affected parent orchestrator carries the broad pre-approval ban on `Recommended next command`.
- Pending review guidance allows only `Recommended next command after compiling YAML: $<same-orchestrator> [same args]`.
- Confirmed parent-loop handoff guidance uses `Recommended next command: $<same-orchestrator> [same args]` after approved artifacts are written.
- Downstream/cross-skill routing remains blocked until final synthesis artifacts are approved and written.
- Framework subskills remain route-free; the parent orchestrator remains the only user-facing continuation route during framework loops.
- Versions, archives, changelogs, prompt history, task notes, and verification are complete.

## Historical Implementation - ord-align Staged Review Contract

### Goal

Update the existing mirrored `ord-align` skill contracts so candidate validation uses a lightweight report-first HTML approval gate before namespace checks, synthesized verdicts, downstream routing, or `alignment/ord-<slug>.md` writes.

### Scope

- `packs/ord/codex/ord-align/SKILL.md`
- `packs/ord/claude/ord-align/SKILL.md`
- Mirrored `ord-align` archives, changelogs, and bundled `ALIGNMENT-PAGE.md` files
- Deterministic pack-workflow benchmark assertions for `ord-align`
- Generated installed/build/showcase artifacts required by skill metadata and behavior changes
- Prompt history, task review notes, validation, commit, and push

### Plan

1. Capture the visible `targeted-skill-builder` invocation prompt and record this implementation plan.
2. Inspect `tasks/lessons.md`, current `ord-align` contracts, `ord-scan` staged-review contract, bundled alignment-page guidance, and benchmark registration.
3. Archive mirrored `ord-align` `v0.0` contracts, bump active contracts to `v0.1`, and add mirrored changelogs.
4. Add mirrored `ord-align` bundled alignment-page guidance scoped to `alignment/ord-align-{topic}.html`.
5. Update active `ord-align` contracts with Stage 1 scope review, Stage 2 validation review, and Stage 3 approved finalization.
6. Tighten deterministic layer4 benchmark assertions for the `ord-align` staged gate.
7. Refresh generated skill/package/showcase artifacts as required.
8. Run required validation, record review notes, inspect the final diff, commit, and push on `master`.

### Acceptance Criteria

- `ord-align` no longer permits `npm view`, synthesized GO/NO-GO verdicts, downstream routing, or `alignment/ord-<slug>.md` writes before the relevant compiled YAML approval stage.
- Stage 1 creates only `alignment/ord-align-<slug>.html` in `review` status and asks for final compiled YAML approval of validation scope.
- Stage 2 performs lightweight validation in the HTML page and stops for artifact approval without writing markdown.
- Stage 3 writes `alignment/ord-<slug>.md` only for approved GO outcomes and confirms the HTML page.
- Codex and Claude contracts remain semantically mirrored, with runner-specific command syntax only.
- Benchmark coverage deterministically checks the new staged-review contract.

## Historical Implementation - Pack Skill Sunset Alignment Page

### Goal

Create a review-state alignment page that gives a decision-ready roadmap for fully sunsetting the `pack` skill without performing any sunset mutations.

### Scope

- New `alignment/pack-skill-sunset-plan.html` document-tier utility review page
- `alignment/index.html` registration
- Evidence from `base/{codex,claude}/pack/SKILL.md`, `scripts/pack.sh`, `packages/skillpacks/src/cli/*`, root instructions, docs, and tests
- Prompt history and task tracking
- Alignment page audit, TTS presence, and diff hygiene verification

### Plan

1. Capture the visible `pack` invocation prompt and record this implementation plan.
2. Inspect current pack skill contracts, shell launcher, Node CLI routing, root instructions, docs, tests, and alignment-page convention.
3. Author a dark-mode document-tier review page with in-flow TOC, evidence tables, section feedback controls, decision gates, bottom compile controls, and TTS include.
4. Register the page in `alignment/index.html` with date metadata and a `[doc]` badge.
5. Run alignment audit, inject TTS if needed, run diff hygiene, and optionally open the page when practical.
6. Record review notes, inspect the final diff, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- Page stays in review status and does not remove, deprecate, or edit the active `pack` skill.
- Page defines current dependencies, sunset target options, readiness blockers, phased roadmap, and explicit approval gates.
- Page recommends a conservative hold until remaining shell-backed surfaces and package verification are resolved.
- `alignment/index.html` links the new page with a document badge and date.

## Current Documentation Reconciliation - Recent Task Evidence

### Goal

Reconcile task documentation after recent shipped documentation and routing work so `tasks/todo.md`, `tasks/history.md`, and `tasks/reconciliation-report.md` agree with git evidence.

### Scope

- `tasks/todo.md`
- `tasks/history.md`
- `tasks/reconciliation-report.md`
- Prompt history for this `$reconcile-dev-docs fix tasks` invocation

### Plan

1. Capture the visible `$reconcile-dev-docs fix tasks` invocation.
2. Read the local `reconcile-dev-docs` skill from the uninstalled `docs-health` pack.
3. Compare recent task sections against `git log --oneline -50`.
4. Apply only unambiguous task-doc fixes: missing history entries, stale completed checklist state, and the reconciliation report.
5. Verify the task-doc diff and commit/push the intended tracked changes.

### Acceptance Criteria

- Missing history coverage for shipped recent work is appended to `tasks/history.md`.
- Completed todo checklist state matches recent git evidence where unambiguous.
- Remaining broader cleanup decisions are recorded in `tasks/reconciliation-report.md`.
- Verification results are recorded in `tasks/todo.md`.

## Current Investigation - Layer1 Routing Audit Failure Provenance

### Goal

Validate whether `layer1/skill-alignment-routing-audit.test.ts` still failing with 44 findings is pre-existing on unmodified `HEAD` and unrelated to the current doc-only change.

### Scope

- Current working-tree diff and touched files
- `tests/layer1/skill-alignment-routing-audit.test.ts`
- `scripts/skill-alignment-routing-audit.mjs`
- Isolated unmodified `HEAD` export/worktree reproduction
- Task notes and prompt history for this investigation

### Plan

1. Capture the visible `$investigate` invocation and record this investigation plan.
2. Inspect current diff and test/audit command wiring.
3. Run the focused layer1 audit test or direct report command in the current tree and capture the exact finding count.
4. Reproduce the same command from an isolated unmodified `HEAD` checkout/export.
5. Compare results and touched-file scope, then record the verdict and verification evidence.

### Acceptance Criteria

- The exact failing command, exit code, and finding count are captured from current tree output.
- The same finding count is reproduced from an unmodified `HEAD` checkout/export.
- The current diff is confirmed as doc-only or otherwise scoped away from the failing audit inputs.
- Any remaining uncertainty is stated plainly rather than treated as proven.

## Historical Implementation - Alignment Fallback And npx Caveat Docs

### Goal

Correct the create-alignment-page fallback contract and public docs so target repositories use installed sibling `ALIGNMENT-PAGE.md` bundles plus consumer-safe `alignment pages ...` commands, while `alignment bundles` remains a source/package-maintenance command.

### Scope

- `base/codex/create-alignment-page/SKILL.md`
- `base/claude/create-alignment-page/SKILL.md`
- create-alignment-page archives and changelogs
- Public npm/package docs that mention alignment commands, especially `README.md` and `docs/skillpacks-npm-distribution.md`
- Prompt history and task review notes
- Focused static/version checks and package node tests

### Plan

1. Capture the visible invocation prompt and record this implementation plan.
2. Archive the mirrored `create-alignment-page` `v0.0` skill contracts.
3. Bump active mirrored contracts to `v0.1` and replace the invalid `alignment bundles --check` consumer fallback with a missing-bundled-convention stop condition.
4. Add `v0.1` changelog entries for both mirrors.
5. Update public docs to distinguish consumer-safe `alignment pages ...` commands from source/package-maintenance `alignment bundles` and `alignment verify` commands.
6. Add concise repeat/offline npx guidance for reliable target-repo use.
7. Run static text checks, version/archive checks, focused metadata/routing verification, package node tests, and diff hygiene.
8. Record review notes, commit, and push the verified doc-only change on the primary branch.

### Acceptance Criteria

- No active `create-alignment-page` skill recommends `npx skillpacks alignment bundles --check` as a target-repo fallback.
- Both mirrored active skills are archived from `v0.0`, bumped to `v0.1`, and have `v0.1` changelog entries.
- Public docs separate consumer-safe page commands from source/package-maintenance alignment commands.
- Public docs include the narrowed repeat/offline expectation for `npx skillpacks ...`.
- CLI behavior, command names, package files, and `scripts/upgrade-alignment-page.mjs` remain unchanged.
- Verification results are recorded in `tasks/todo.md`.

## Historical Implementation - Framework Handoff Routing Alias Parity

### Goal

Close the remaining framework handoff routing gap by making active top-level installed framework aliases participate in the same parent-routed contract as nested framework copies, and by making regression coverage discover those aliases through frontmatter instead of path shape alone.

### Scope

- Active installed top-level aliases in `.codex/skills` and `.claude/skills` whose frontmatter declares `invocation: sub-skill` and a framework-loop parent: `competitive-analysis`, `customer-discovery`, `positioning`, or `journey-map`
- Nested active framework copies across source packs, installed roots, and package build mirrors
- `tests/layer1/framework-handoff-routing.test.ts`
- Generated package/showcase surfaces only if verification proves them stale
- Task review notes, verification, commit, and push

### Plan

1. Confirm stale top-level installed alias versions and routing wording against nested/source framework copies.
2. Refresh or patch the installed alias files so their active routing contracts match their nested source equivalents.
3. Broaden the framework handoff regression inventory to include active top-level installed aliases based on `parent:` frontmatter, while still excluding archives.
4. Add a generic placeholder-leak assertion for `parent/frameworks/...` wording in active framework subskills.
5. Run focused routing tests, direct active-route scans, package verification, and hygiene checks.
6. Record review notes, inspect the final diff, commit, and push the verified changes on `master`.

### Acceptance Criteria

- Active framework subskills and installed top-level aliases do not contain `$parent/frameworks/child`, `/parent/frameworks/child`, bare `parent/frameworks/child`, or generic `parent/frameworks/...` handoffs.
- Framework subskills do not emit `Recommended next skill:` or `Recommended next command:` labels.
- Parent orchestrators document that pending frameworks continue by re-invoking the parent, preserving product-path arguments such as `research/afps-tracker`.
- Focused layer1 routing tests cover both nested framework paths and top-level installed aliases with relevant `parent:` frontmatter.
- Package/skill verification passes, with generated surfaces refreshed only when needed.

## Historical Implementation - Alignment Portability

### Goal

Make alignment-page creation, audit, TTS injection, and browser opening portable for repositories that install skills through the `skillpacks` npm package rather than this source checkout.

### Scope

- `packages/skillpacks` CLI routing, package build staging, and node tests
- Packaged alignment helper scripts under `scripts/`
- Canonical `docs/alignment-page-convention.md` and generated `ALIGNMENT-PAGE.md` bundles
- New repo-managed `$create-alignment-page` skill contract
- Benchmark/showcase/package generated surfaces required by the new skill
- Task tracking, prompt history, verification notes, commit, and push

### Plan

1. Capture the visible invocation prompt and record this implementation plan.
2. Package `scripts/open-html-page.mjs` and expose it through `npx skillpacks alignment pages open`.
3. Validate safe `alignment/*.html` page paths and pass supported opener flags through to the packaged script.
4. Update the alignment-page convention so portable `npx skillpacks alignment pages ...` commands are primary, with source-checkout `node scripts/...` fallbacks.
5. Create mirrored `$create-alignment-page` contracts around bundled convention discovery and the portable CLI commands.
6. Add focused package/CLI/layer1 regression coverage.
7. Run required validation, review the diff, then commit and push intended changes.

### Acceptance Criteria

- `npm --workspace packages/skillpacks run build:check` stages `scripts/open-html-page.mjs` and still excludes denied source-repo directories.
- `npx skillpacks alignment pages open alignment/foo.html --browser auto` resolves to the packaged opener and rejects traversal or non-alignment paths.
- Generated alignment bundles present portable `npx skillpacks alignment pages open|audit|inject-tts` commands as the primary workflow.
- `$create-alignment-page` exists for Codex and Claude and instructs agents to use bundled per-skill conventions first, then packaged convention guidance, with audit/open handled through `npx skillpacks alignment ...`.
- Verification output is recorded in `tasks/todo.md`.

## Historical Implementation - Alignment Gate Reactivity Contract

### Goal

Update the shared alignment-page convention and active-page audit so feedback-driven revised review pages regenerate stale gates, and confirmed pages cannot retain active gate, feedback, or compile controls.

### Scope

- `docs/alignment-page-convention.md` inside the canonical `alignment-convention` block
- Generated bundled `ALIGNMENT-PAGE.md` files
- `scripts/audit-alignment-pages.mjs`
- Focused layer1 tests for alignment gate convention drift and active-page audit fixtures
- Prompt history, task tracking, verification notes, commit, and push

### Plan

1. Capture the visible targeted-skill-builder invocation prompt and record this implementation plan.
2. Patch the canonical alignment-page convention with gate-reactivity and confirmed-page control prohibitions.
3. Regenerate bundled `ALIGNMENT-PAGE.md` files from the canonical convention.
4. Extend the active-page audit with an `Alignment status controls` diagnostic for confirmed pages.
5. Add focused layer1 regression coverage for the generated bundle language and confirmed-page controls audit.
6. Run required validation: bundle check, focused tests, active-page audit, and diff hygiene.
7. Record review notes, then commit and push the verified changes on the primary branch.

### Acceptance Criteria

- Revised review pages are contractually required to regenerate affected gates, blocking state, unanswered required questions, and gate registries from revised artifact content.
- Superseded gates must be removed or rewritten, and changed gates must be visibly marked in the revised review page.
- Confirmed pages may preserve decisions only as read-only records, not active inputs, compile buttons, stale registries, counters, blocking language, or retained controls.
- Active confirmed pages containing retained controls fail the audit with the new diagnostic group.
- Review pages with active controls continue to pass the audit.

## Historical Implementation - Alignment Gate Reactivity Session Analysis

### Goal

Investigate recurring cases where alignment-page gate questions were not reactive to prior user answers or feedback, then report likely owner surfaces and concrete updates.

### Scope

- Local Claude/Codex prompt and rich session history relevant to alignment pages, gate questions, compiled YAML, feedback, and approval flows
- Repository alignment-page convention and generator/audit scripts
- Active alignment-producing skill contracts where gate behavior is specified
- Prompt history and task review notes for this analysis

### Plan

1. Capture the visible `$analyze-sessions` invocation and record this analysis plan.
2. Script-scan full available Claude/Codex history for alignment-page gate reactivity, feedback, compiled YAML, and user correction patterns.
3. Inspect canonical alignment-page convention, bundled alignment instructions, and audit/generator scripts for static-gate assumptions.
4. Compare session evidence against current repository contracts to identify concrete update surfaces.
5. Report findings, confidence, recommended owner surface, and validation expectations.

### Acceptance Criteria

- Findings cite real history examples and distinguish explicit evidence from inference.
- Counts are exact for the scanned corpus and scope.
- Recommendations name the likely contract or generator surface to update.
- Cost is reported as unavailable unless explicit logged cost fields or verified current pricing are used.
- No alignment page is created unless the investigation finds a clarification need that cannot be handled inline.

## Historical Implementation - YouTube Derivative Cuts Skill

### Goal

Add a mirrored `youtube-ops` research skill that plans a prioritized derivative clip slate from one long YouTube source video, using existing source/video evidence and producing approved research artifacts without editing, upload, thumbnail design, or full metadata optimization.

### Scope

- `packs/youtube-ops/{codex,claude}/youtube-derivative-cuts/`
- `packs/youtube-ops/{codex,claude}/youtube/SKILL.md`
- `packs/youtube-ops/PACK.md`, `README.md`, and `docs/skills-reference.md`
- Benchmark coverage in `tests/harness/bench-coverage.ts` and `tests/layer4/setups/packs/pack-workflows.setup.ts`
- Generated Skills Showcase data
- Prompt history and task review notes

### Plan

1. Capture the visible invocation prompt and record this implementation plan.
2. Draft mirrored Codex/Claude skill contracts, changelogs, and bundled alignment-page files for `youtube-derivative-cuts`.
3. Update YouTube router signals and public pack/docs listings.
4. Add benchmark coverage with deterministic assertions for timestamped candidates, companion-vs-Shorts separation, publish sequence, and measurement beyond views.
5. Refresh Skills Showcase data.
6. Run focused readback, routing, mirror, benchmark, generated-data, and diff verification.
7. Commit and push the verified mutation set on the primary branch.

### Acceptance Criteria

- Both active `SKILL.md` files are mirrored aside from agent invocation syntax and include `version: v0.0`, `type: research`, and `context_intake: artifact_only`.
- The skill requires candidate timestamps, companion clip vs Shorts separation, packaging notes, default publish sequence, checkpoint review, measurement plan, and handoffs.
- YouTube router and docs list the new skill.
- Benchmark coverage registers `youtube-derivative-cuts` and checks the new workflow expectations.
- Generated showcase assets are refreshed and validated.

## Historical Implementation - Root Agent Instruction Audit

### Goal

Audit every provisioned section of `CLAUDE.md` and `AGENTS.md` from `provision-agentic-config`, deciding what is necessary, redundant, agent-specific, contradictory, or removable before making any policy changes.

### Scope

- Root `CLAUDE.md` and `AGENTS.md`
- Mirrored `provision-agentic-config` source contracts if the audit recommends future provisioning changes
- Prompt history, task tracking, audit notes, verification, and shipping if tracked files are changed

### Plan

1. Capture the visible invocation prompt and record this audit plan.
2. Read `CLAUDE.md` and `AGENTS.md` with line numbers and identify the generated/provisioned blocks.
3. Compare Claude-specific and Codex-specific sections for duplication, agent mismatch, and current necessity.
4. Produce a findings-first audit with keep/remove/merge/reword recommendations for each section.
5. Verify prompt/task/audit artifacts and decide whether any policy edits should be made in a follow-up implementation pass.

### Acceptance Criteria

- Each generated section is evaluated with exact file/line references.
- Recommendations distinguish immediate removals from items that should remain because they enforce workflow, safety, or repo-specific conventions.
- Claude-only and Codex-only differences are called out explicitly.
- No root instruction policy is edited during the audit unless the user approves a concrete reduction plan.
- Verification and review notes are recorded in `tasks/todo.md`.

## Historical Implementation - Revision Hygiene Rule

### Goal

Add a durable revision hygiene rule that makes feedback-driven edits converge on the desired final artifact instead of preserving rejected framing as warnings or negative reinforcement.

### Scope

- Root agent instruction files: `AGENTS.md` and `CLAUDE.md`
- Provisioning source skill: `base/{codex,claude}/provision-agentic-config/SKILL.md`, archives, and changelogs
- Alignment and research conventions: `docs/alignment-page-convention.md` and `docs/research-session-loop-convention.md`
- Generated alignment bundles and package/manifest surfaces if required by repo generators
- Prompt history, task review notes, lessons, verification, commit, and push

### Plan

1. Capture the visible request prompt for the `provision-agentic-config` skill context and record this implementation plan.
2. Archive and bump the mirrored `provision-agentic-config` source skills.
3. Add the revision hygiene rule to provisioned root workflow blocks and current root artifacts.
4. Add the research/alignment-specific rule to canonical conventions.
5. Regenerate derived alignment/skillpack surfaces as required.
6. Run focused hygiene, archive/version, generated-bundle, and package verification.
7. Document results, update lessons only where needed, commit, and push.

### Acceptance Criteria

- Root `AGENTS.md` and `CLAUDE.md` contain a `Revision Hygiene` section inside the provisioned workflow block.
- Future `provision-agentic-config` runs preserve the same rule in both Claude and AGENTS variants.
- Alignment/research conventions instruct agents to keep corrected or rejected claims out of canonical findings unless provenance is explicitly needed.
- Generated alignment bundles are in sync with the canonical convention.
- Verification output is recorded in `tasks/todo.md`.

## Historical Implementation - Documentation Drift Remediation

### Goal

Patch all P1 and P2 drift identified by `alignment/devtool-docs-audit-docs-drift-inventory.html` after approval gates selected a single remediation pass.

### Scope

- `packs/devtool/{codex,claude}/devtool-docs-audit/SKILL.md` and installed Codex copy where present
- High-visibility business pack naming docs: `README.md`, `docs/QUICKSTART.md`, and `docs/packs.md`
- Pattern A routing contract in `docs/skill-next-step-contracts.md`
- Pre-prototype artifact path wording in `docs/canonical-workflow-report.md`
- npm package identity wording in `docs/skillpacks-npm-distribution.md`
- Task docs, prompt history, verification notes, and any generated package/installed skill surfaces needed for parity

### Plan

1. Capture the visible approval prompt and record this remediation plan in task tracking.
2. Patch the missing `devtool-docs-audit` next-skill routing reference across source mirrors and active installed copies.
3. Standardize current business pack docs on canonical `business-research`, retaining `business-discovery` only as a compatibility alias, and include `customer-lifecycle` in business-app compatibility expansion.
4. Update Pattern A positioning route docs to use the Research Session Loop rather than `tasks/todo.md` plus `/exec`.
5. Update P2 docs for current `design/` pre-prototype artifacts and current npm package identity, keeping historical planning text clearly labeled where retained.
6. Run focused scans plus repository hygiene/version/mirror verification.
7. Commit and push the verified remediation.

### Acceptance Criteria

- No active current docs present `business-discovery` as the canonical business pack name.
- The `devtool-docs-audit` skill no longer references a missing local section.
- Pattern A positioning framework rows route through the Research Session Loop.
- Current workflow docs distinguish `design/` pre-prototype artifacts from finalized `specs/` implementation specs.
- The npm distribution doc consistently presents `skillpacks` as primary and `@glexcorp/gskp` as the scoped alias.
- Verification output is recorded in `tasks/todo.md`.

## Historical Implementation - Documentation Drift Inventory

### Goal

Inventory the repository's documentation surfaces and identify drift between canonical docs, generated/package docs, active skill contracts, pack metadata, task history, and alignment/research artifacts.

### Scope

- Root docs such as `README.md`, `AGENTS.md`, and `CLAUDE.md`
- Public docs under `docs/`
- Pack metadata and active skill contracts under `packs/**`
- Generated/package documentation surfaces where they represent user-facing docs
- Research/alignment/task artifacts that document current process or historical decisions
- Prompt history, task tracking, audit report, and alignment page required by the invoked docs-audit workflow

### Plan

1. Capture the visible invocation prompt and record this plan in task tracking.
2. Inventory documentation files and classify them as canonical, active contract, generated, archived, task/history, or research/alignment.
3. Compare high-risk documentation contracts for drift: install commands/package identity, workflow orchestration, alignment lifecycle, skill routing, artifact paths, versioning/archive rules, and prompt/task conventions.
4. Write `research/devtool-docs-audit.md` with findings-first results and create `alignment/devtool-docs-audit-docs-drift-inventory.html`.
5. Update `alignment/index.html`, run focused verification, and commit/push the intended audit artifacts if the repository is clean aside from this work.

### Acceptance Criteria

- The audit includes an inventory with counts and representative paths for each documentation class.
- Drift findings distinguish confirmed contradictions from lower-confidence or historical/archive-only drift.
- Each major finding cites concrete file/path evidence.
- The alignment page renders the complete audit content directly and includes required review controls.
- Verification includes at least markdown/HTML hygiene checks and repository diff review.

## Historical Implementation - Prototype Session Loop Convention Refactor

### Goal

Create `docs/prototype-session-loop-convention.md` as the named contract for prototype-phase product-design/product-testing work, then refactor the mirrored skills so branch progress, build ledgers, alignment gates, UAT evidence, and human-evaluation tasks use consistent artifact stores.

### Scope

- New `docs/prototype-session-loop-convention.md`
- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- `packs/product-design/{codex,claude}/prototype/SKILL.md`
- `packs/product-design/{codex,claude}/consolidate-variations/SKILL.md`
- `packs/product-testing/{codex,claude}/uat/SKILL.md`
- Matching changelogs, archives, generated package output, and installed local skill copies where present
- Task review notes and verification results

### Plan

1. Record this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
2. Archive current mirrored source skill contracts before version bumps.
3. Add the prototype session loop convention doc as a companion to the research session loop convention, without importing Pattern A selected-framework manifests.
4. Bump and patch mirrored product-design/product-testing skills to cite the convention and consistently use `design/**/flow-tree-*.yaml`, `design/prototype-build-plan-*.md`, alignment-page approvals, `research/uat-variant-evaluation-*.md`, `prototypes/{topic}/consolidated/`, and `tasks/manual-todo.md`.
5. Fix UAT variant-evaluation inputs to prefer `design/` artifacts while allowing legacy `specs/` files only as fallback evidence.
6. Regenerate/sync derived package and installed local skill surfaces.
7. Run archive/version, mirror/build, routing/content, and diff hygiene verification.
8. Commit and push the verified mutation set.

### Acceptance Criteria

- All six affected skills in both Codex and Claude mirrors cite `docs/prototype-session-loop-convention.md`.
- Branch state remains in `design/**/flow-tree-*.yaml`; prototype build status remains in `design/prototype-build-plan-*.md` plus the flow-tree manifest.
- Alignment checkpoints are described as non-final; final compiled YAML controls canonical writes for skills already using that lifecycle.
- Human prototype/UAT evaluation is routed to `tasks/manual-todo.md`; `tasks/todo.md` is reserved for implementation fixes only after human evidence exists.
- UAT variant-evaluation reads `design/ux-variations-*`, `design/ui-requirements-*`, and `design/ui-layout-variations-*` first, with `specs/` only as legacy fallback evidence.
- Generated package output and installed local copies are refreshed from source, not hand-edited.

## Historical Implementation - Product Design Prototype Routing Cleanup

### Goal

Remove premature roadmap/agent-work-admin routing from the research/prototyping portion of the product-design route, and make the post-`ui-interview` handoff explicitly synthesize the prototype build plan before `$prototype`.

### Scope

- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- Active Codex installed copies under `.codex/skills/` for affected product-design skills
- Product-design changelogs and archives for versioned behavior changes
- Focused layer1 route coverage
- `tasks/lessons.md`, `tasks/todo.md`, and task review notes

### Plan

1. Record this remediation plan in task docs.
2. Archive current mirrored `ui-interview` contracts before bumping behavior.
3. Update mirrored `ui-interview` routing so branch completion never routes to `agent-work-admin` or `roadmap` during research/prototype work.
4. Route completed UI branch sets to `user-flow-map --prototype-build-plan [topic]`; continue to `ui-interview` or `ux-variations` only when unresolved branches remain.
5. Refresh active `.codex/skills/` copies so the current Codex session can see `user-flow-map --prototype-build-plan`.
6. Add regression coverage that fails if `ui-interview` keeps the old roadmap handoff.
7. Run focused validation, hygiene checks, then commit and push.

### Acceptance Criteria

- `ui-interview` routes approved design-tree completion to `user-flow-map --prototype-build-plan [topic]`, not `roadmap`.
- `ui-interview` does not recommend installing `agent-work-admin` during the product-design research/prototype handoff.
- Active `.codex/skills/user-flow-map` includes `--prototype-build-plan`.
- Layer1 coverage checks the exact post-`ui-interview` synthesis route.

## Historical Implementation - Dual npm Publish Automation

### Goal

Publish the established `skillpacks` package and the scoped alias `@glexcorp/gskp` from the same source build at the same version, with both packages exposing `skillpacks` and `gskp` binaries.

### Scope

- Root `publish.sh` release automation.
- `packages/skillpacks/package.json` source package metadata.
- Release/package verification tests.
- Public npm install and publish docs: `README.md`, `docs/QUICKSTART.md`, `docs/skillpacks-npm-distribution.md`, `docs/skillpacks-install-routing-contract.md`, and high-visibility reference docs where package identity is asserted.
- Task review notes and verification results.

### Plan

1. Record this execution plan in `tasks/roadmap.md` and `tasks/todo.md`.
2. Inspect existing package build, auth, publish verification, and install docs.
3. Restore source package metadata to the established `skillpacks` package while keeping both binaries.
4. Add root `publish.sh` that bumps the workspace version, builds/verifies once, stages two `/tmp` publish directories from `packages/skillpacks/build`, patches staged package names, auth-checks, publishes both packages, and verifies both published specs. Support `--dry-run`.
5. Update tests and docs for primary `npx skillpacks ...` guidance with `npx @glexcorp/gskp ...` as the same-version scoped alias.
6. Run package tests, package verification, root publish dry run, and diff hygiene.
7. Commit and push the verified changes on the primary branch.

### Acceptance Criteria

- `./publish.sh patch`, `./publish.sh minor`, `./publish.sh 0.1.2`, and `./publish.sh --dry-run patch` have clear supported behavior.
- Source package metadata is `skillpacks`; staged publish metadata can produce both `skillpacks` and `@glexcorp/gskp`.
- Both staged packages keep `gskp` and `skillpacks` bins pointed at `bin/skillpacks.mjs`.
- Public docs prefer `npx skillpacks ...` and mention `npx @glexcorp/gskp ...` as an equivalent scoped alias.
- Verification passes before commit/push.

## Historical Implementation - npm Age-Gate Warning Cleanup

### Goal

Stop `update-packages` guidance and benchmark fixtures from recommending package-manager age-gate keys that npm 11 reports as unknown project config, while preserving the 8-day dependency safety policy.

### Scope

- `packs/code-maintenance/{codex,claude}/update-packages/SKILL.md`
- update-packages archives and changelogs
- focused layer1/layer4 benchmark setup expectations for age-gate wording
- task review notes and verification results

### Plan

1. Confirm the warning is not emitted by this repository's current npm project config.
2. Archive the active mirrored `update-packages` contracts before changing behavior.
3. Bump the mirrored skills from `v0.0` to `v0.1`.
4. Replace `.npmrc` age-gate instructions with npm-safe guidance: manual age verification for npm-only projects and persisted pnpm enforcement through project pnpm config such as `minimumReleaseAge: 11520`.
5. Update benchmark prompts, assertions, and retained examples so they no longer require `min-release-age=8` or `minimum-release-age=11520` in `.npmrc`.
6. Run focused layer1 coverage and repository hygiene checks.
7. Commit and push the verified cleanup.

### Acceptance Criteria

- `npm config list` from the repository root emits no unknown project config warning.
- Active `update-packages` skills do not tell agents to write `min-release-age` or `minimum-release-age` into `.npmrc`.
- The benchmark still requires an 8-day update policy and persisted pnpm age-gate coverage where supported.
- Reversed ownership assertions still fail.
- Skill archive/version hygiene passes.

## Historical Implementation - Short npm CLI Rename

### Goal

Make `gskp` the short primary npm package and CLI command for gSkillPacks, while preserving `skillpacks` as a compatibility command/alias so existing users and docs do not break immediately.

### Scope

- `packages/skillpacks/package.json` package/bin metadata
- root npm workspace scripts that target the package by name
- package CLI help/error wording where user-facing command names appear
- package tests that assert public npm command examples and metadata
- high-visibility install docs: `README.md`, `docs/skillpacks-npm-distribution.md`, `docs/skills-reference.md`, and routing contract docs
- task review notes and verification results

### Plan

1. Verify the shortest viable npm name. `gsp`, `gsk`, and `skp` are taken; `gskp` returns npm E404 and is the shortest available brand-aligned candidate checked.
2. Rename the public package metadata to `gskp` and expose both `gskp` and `skillpacks` binaries from the same entry point.
3. Keep source directory names, manifest filenames, and compatibility documentation stable unless changing them is required by verification.
4. Update high-visibility docs and tests so `npx gskp ...` is the primary route and `npx skillpacks ...` is documented as compatibility.
5. Run focused package metadata/build/test verification.
6. Commit and push only the intended rename boundary.

### Acceptance Criteria

- `packages/skillpacks/package.json` publishes as `gskp`.
- The package exposes a primary `gskp` binary and a compatibility `skillpacks` binary.
- User-facing quickstart/install examples prefer `npx gskp`.
- Docs explicitly warn that `skillpack` singular is unrelated.
- Package build/check and focused package tests pass.

## Historical Implementation - Product Design Flow Tree Artifact Boundaries

### Goal

Move pre-prototype product-design artifacts from `specs/` into a dedicated `design/` phase and add a machine-readable flow-tree manifest contract that tracks user-flow branches, UX variation branches, and UI branch decisions.

### Scope

- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- `packs/product-design/{codex,claude}/prototype/SKILL.md`
- `packs/product-design/{codex,claude}/consolidate-variations/SKILL.md`
- `packs/product-design/{codex,claude}/spec-interview/SKILL.md`
- Product-design changelogs and archives for versioned behavior changes
- New `design/flow-tree.schema.json`
- Focused layer1 tests for artifact boundaries, route parity, and manifest-state ownership
- Task review notes and verification results

### Plan

1. Inspect current product-design contracts, route docs, and layer1 coverage.
2. Record this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
3. Archive current mirrored product-design skill contracts before version bumps.
4. Add `design/flow-tree.schema.json` defining scoped flow-tree manifests.
5. Update `user-flow-map` to write `design/user-flow-*`, initialize `design/flow-tree-*`, and avoid pre-prototype `specs/` output.
6. Update `ux-variations` to read/write `design/ux-variations-*`, expand the flow-tree manifest, and avoid `research/.progress.yaml` for UX branch state.
7. Update `ui-interview` to read/write `design/ui-*`, record approve/reject/retry branch decisions in the design manifest, and preserve `specs/` only for requirements-only or finalized post-prototype specs where appropriate.
8. Keep `spec-interview` output in `specs/` and update upstream read guidance so it can consume `design/` evidence without becoming a design-phase writer.
9. Add layer1 tests for design/spec/research artifact boundaries and mirrored route parity.
10. Run required verification, fix any regressions, then commit and push the verified mutation set.

### Acceptance Criteria

- Pre-prototype `user-flow-map`, `ux-variations`, and default `ui-interview` deliverables write to `design/`, not `specs/`.
- `design/flow-tree.schema.json` defines product-path and flat manifest locations and branch decision state.
- `research/.progress.yaml` remains product-path/product-line tracking only, not UX branch state.
- `spec-interview` still writes finalized production implementation specs to `specs/`.
- Claude and Codex product-design mirrors preserve `user-flow-map -> ux-variations -> ui-interview -> prototype -> consolidate-variations -> spec-interview`.

## Historical Implementation - Prototype Build Plan Ledger

### Goal

Add a pre-prototype synthesis artifact that turns approved user-flow, UX-variation, and UI-branch decisions into one build ledger for `$prototype`, so variation work can be tracked as pending, built, needs revision, deferred, or dropped.

### Scope

- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/prototype/SKILL.md`
- Product-design changelogs and archives for versioned behavior changes
- `design/flow-tree.schema.json`
- Focused layer1 product-design flow-tree tests
- Prompt history and task review notes

### Plan

1. Capture visible prompt history for the invoked `user-flow-map` and `prototype` skills.
2. Record this implementation plan in task docs.
3. Archive active mirrored `user-flow-map` and `prototype` contracts before version bumps.
4. Extend the flow-tree schema with prototype build-plan references and build-item statuses.
5. Add a `user-flow-map` prototype-build synthesis mode that writes `design/prototype-build-plan-[topic].md` after branch decisions exist.
6. Update `prototype` to require/read the build plan, build only planned items unless `--variant N` narrows the run, and update plan/manifest status after each item.
7. Add focused regression coverage for the new build-plan contract.
8. Run focused validation, hygiene checks, then commit and push the verified mutation set.

### Acceptance Criteria

- `user-flow-map` can synthesize a single prototype build-plan artifact from approved flow-tree branch state.
- `prototype` consumes the build plan as its todo ledger and tracks statuses: pending, built, needs-revision, deferred, and dropped.
- Dropped/deferred build items are not silently built.
- The flow-tree manifest schema can reference prototype build-plan artifacts and per-item status.
- Claude and Codex product-design mirrors stay route-equivalent.

## Current Investigation - Repository Boundary And Deploy Gating

### Goal

Keep this repository as one repo for now, but make its ownership zones and Vercel deploy boundary explicit enough that skill-source, package, prompt, task, alignment, and archive work do not accidentally imply a Skills Showcase deploy.

### Scope

- Repository boundary audit covering tracked path zones, recent churn, and deploy relevance.
- Skills Showcase deploy contract in `tasks/deploy.md`.
- Vercel ignored-build helper script and focused classifier tests.
- Prompt/task evidence for this `investigate` run.
- No repository split, no history rewrite, and no GitHub Actions changes.

### Plan

1. Capture the visible `investigate` prompt and record this execution plan.
2. Audit tracked files, recent Git churn, Vercel config, and showcase generation/deploy surfaces.
3. Document confirmed and unsupported claims in `tasks/repo-boundary-audit.md`.
4. Update `tasks/deploy.md` with the path-based deploy policy and Vercel ignored-build setup.
5. Add `scripts/vercel-ignore-build.sh` with a testable path classifier.
6. Add focused shell tests for skip/deploy cases.
7. Run classifier tests, whitespace checks, and any showcase checks made relevant by touched files.
8. Record review notes, commit, and push the intended boundary if verification passes.

### Acceptance Criteria

- `tasks/repo-boundary-audit.md` classifies repository zones and validates the user claims with Git/code evidence.
- `tasks/deploy.md` distinguishes source shipping, generated showcase refreshes, workflow evidence, and actual showcase deploys.
- The ignored-build helper skips skill-only, task-only, prompt-only, alignment-only, archive-only, and non-showcase package-only changes.
- The ignored-build helper allows showcase runtime/assets, root dependency manifests, deploy config, and showcase generation script changes.
- Focused tests exercise representative skip/deploy cases.
- No GitHub Actions workflows are created or modified.

## Current Investigation - AFPS Prototype Product Design Workflow

### Goal

Evaluate whether the shipped product-design route `user-flow-map -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation]` is the best default workflow for the AFPS prototype phase.

### Scope

- Active product-design skill contracts for `user-flow-map`, `ux-variations`, and `ui-interview`
- Recent shipped commit for the product-design flow tree routing update
- Existing AFPS workflow evidence in repo docs, task notes, progress manifests, and pack metadata
- Verification limited to read-only or non-mutating checks unless the investigation discovers a concrete source defect

### Plan

1. Capture the visible investigation prompt.
2. Inspect the shipped commit, active product-design contracts, and relevant prior route wording.
3. Inspect AFPS workflow context and prototype-phase assumptions from existing artifacts.
4. Evaluate the new route against prototype-phase goals: speed to visual alignment, branch exploration quality, evidence traceability, decision gates, and handoff readiness.
5. Run focused verification for stale route references and audit health.
6. Record findings and, if no source edits are needed, keep the outcome as an evaluation rather than implementation.

### Acceptance Criteria

- Confirm whether the shipped workflow matches the claimed route.
- Identify whether the route is better than the old requirements/layout-first default for AFPS prototypes.
- Name any conditions where the workflow should branch or be amended.
- Provide a concrete recommended default route for the AFPS prototype phase.

## Historical Implementation - Product Design Flow Tree Routing

### Goal

Rework the product-design skill sequence so `$user-flow-map` starts a wireframe tree, `$ux-variations` expands a specific user flow into alternative progression paths, and `$ui-interview` investigates and approves or rejects a specific UX-variation branch through an HTML visual mockup loop.

### Scope

- `packs/product-design/codex/user-flow-map/SKILL.md` and Claude mirror
- `packs/product-design/codex/ux-variations/SKILL.md` and Claude mirror
- `packs/product-design/codex/ui-interview/SKILL.md` and Claude mirror
- Matching archives and changelog entries for substantive skill behavior changes
- Prompt history and task docs for the invoked skills
- Focused validation only; no generated local `.codex/skills/**` or `.claude/skills/**` source edits

### Plan

1. Capture visible prompt history for the invoked `user-flow-map`, `ux-variations`, and `ui-interview` skills.
2. Archive current active skill contracts before version bumps.
3. Update `user-flow-map` to describe the initial wireframe-tree root and route approved flows to UX variation exploration, not requirements-only UI interview.
4. Update `ux-variations` to expand one selected user flow into alternate progression branches and UI-experiment candidates, while preserving layout-mode only as a bounded mode when explicitly requested.
5. Update `ui-interview` to follow the four-step branch review loop: investigate cross-flow coordination, design/propose HTML visual mockup, interview for alignment/retry, then approve or reject the branch and route to the next variation or user flow.
6. Mirror Codex/Claude wording, bump versions, update changelogs, and verify archive/version/routing checks.
7. Commit and push the intended tracked changes after verification.

### Acceptance Criteria

- Product-design active skill contracts no longer define the default route as `user-flow-map -> ui-interview --requirements-only -> ux-variations --layout-mode`.
- `user-flow-map` explicitly positions itself as the root of the wireframe tree and routes to `ux-variations` per user flow.
- `ux-variations` explicitly explores alternate ways to progress through a chosen user flow.
- `ui-interview` explicitly implements the four-step UX-variation branch approval loop and HTML mockup feedback retry behavior.
- Version archives and changelog entries exist for every changed active `SKILL.md`.
- Focused validation passes or any pre-existing unrelated failure is clearly isolated.

## Historical Implementation - skillpacks refresh rename reconciliation

### Goal

Make `npx skillpacks refresh` and `npx skillpacks doctor --fix` tolerate stale project config entries left behind by pack or skill renames, while preserving explicit hibernated-pack and unknown-pack failures.

### Scope

- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- Required prompt/task artifacts for the invoked `$investigate` workflow
- No new CLI command and no changes to install/remove argument semantics

### Plan

1. Re-read lifecycle, pack-normalization, project-config, and lifecycle test coverage to confirm current behavior.
2. Add stored-config reconciliation before refresh and doctor fix operations:
   - Rewrite single-target active pack aliases such as `business-discovery` to their canonical active pack.
   - De-duplicate canonical `enabled_packs` values while preserving first-seen order.
   - Rewrite `enabled_skills` pack values to the active pack that currently provides the skill.
   - Keep hibernated pack diagnostics unchanged.
   - Fail unknown stale pack entries with cleanup-oriented guidance.
3. Add regression tests for pack alias migration, duplicate alias de-duplication, enabled-skill pack migration, hibernated stale packs, and unknown stale packs.
4. Run the requested targeted tests and live CLI checks against this checkout.
5. Review the diff for minimality, then commit and push the intended tracked changes.

### Verification

- `node --test packages/skillpacks/test/pack-normalization.test.mjs packages/skillpacks/test/lifecycle.test.mjs`
- `npx skillpacks doctor`
- `npx skillpacks refresh`
- Repo-local fallback for this checkout if the npx binary is unavailable: `node packages/skillpacks/bin/skillpacks.mjs doctor` and `node packages/skillpacks/bin/skillpacks.mjs refresh`

## Current Hygiene - Generated Skill Root Shipping Blocker

### Goal

Restore `.codex/skills/**` and `.claude/skills/**` to generated local artifact status so `$ship-end` can proceed without tracked install-root mutations blocking the shipping contract.

### Scope

- `.gitignore` generated-root ignore rules.
- Git index tracking for `.codex/skills/skill-interview/SKILL.md` and `.claude/skills/skill-interview/SKILL.md`.
- Prompt capture and task/history/manifest bookkeeping for this narrow hygiene boundary.
- No source skill, generated alignment bundle, app, test, or broad validation-remediation changes.

### Plan

1. Confirm the only tracked generated-root files are the two `skill-interview/SKILL.md` install copies.
2. Remove those two files from Git tracking while preserving the local generated files.
3. Replace the broad `.codex` ignore rule with `.codex/skills/` and keep `.claude/skills/`.
4. Verify tracked-file removal, local-file presence, ignore behavior, and whitespace.
5. Commit and push the hygiene-only boundary, then rerun `$ship-end` for the broader dirty tree.

### Acceptance Criteria

- `git ls-files .codex/skills .claude/skills` returns no tracked generated-root files.
- `find .codex/skills .claude/skills -maxdepth 2 -name SKILL.md -print` still shows generated local install files.
- `git check-ignore -v` proves both local generated skill roots are ignored.
- `git diff --check` passes for the hygiene boundary.

## Current Ship-End - Validation Remediation And Shipping

### Goal

Wrap the current dirty working tree: complete validation, document the ship boundary, and commit/push now that the generated-root blocker is resolved.

### Scope

- Ship-end validation failures across layer1 tests, Skills Showcase generated data, skill audits, archive/version/dependency checks, routing checks, and mirror parity.
- Task/history/manifest documentation for the wrap-up.
- No deploy unless a successful commit/push creates a shipped boundary.
- No staging of generated local skill roots under `.codex/skills/**` or `.claude/skills/**`.

### Plan

1. Inspect the dirty tree, generated-root state, manual tasks, advisory task files, and existing unpushed commits.
2. Remediate validation failures that are necessary to make the current repo state provably green.
3. Prefer audit/parser fixes for false positives; archive/version/changelog any real active `SKILL.md` behavior changes.
4. Refresh generated Skills Showcase assets after active skill or validation metadata changes.
5. Run the full executable and documentation validation gate.
6. Update `tasks/todo.md`, `tasks/history.md`, and a ship manifest with results, skipped deploy rationale, residual risks, and next command.
7. Commit/push the ship boundary after confirming generated local roots are excluded.

### Acceptance Criteria

- Full layer1 and Skills Showcase checks pass.
- Active alignment pages and generated alignment bundles are exact.
- Skill archive/version/dependency/routing/mirror audits pass.
- The ship manifest states whether the commit boundary is safe.
- Final handoff names any deploy/manual follow-up and next command.

### Current Status

- Validation is green across the full ship-end gate after the generated-root hygiene commit.
- `git ls-files .codex/skills .claude/skills` returns no tracked generated local skill roots.
- The broad validation-remediation boundary is ready to commit and push.

## Historical Implementation - Stage 2 Alignment Page Template

### Goal

Enhance the canonical alignment-page convention so Stage 1 scope-review pages preview the expected Stage 2 research/artifact-review shape before heavy research begins.

### Scope

- `docs/alignment-page-convention.md` inside the generated `alignment-convention` block.
- Generated `ALIGNMENT-PAGE.md` bundles refreshed only through `scripts/upgrade-alignment-page.mjs`.
- Focused layer1 coverage in `tests/layer1/alignment-gates.test.ts` and, if needed, `tests/layer1/research-approval-gate.test.ts`.
- Task tracking and review notes in `tasks/roadmap.md` and `tasks/todo.md`.

### Plan

1. Preserve the existing dirty worktree and inspect current convention/test wording before editing.
2. Add a Stage 2 review-page template section after the staged research workflow language, including required status, findings, evidence, packet-review, alternatives, source gaps, assumptions, file-change, format-preference, and final-artifact approval sections.
3. Require Stage 1 scope-review pages to include a Stage 2 preview / expected review format section before research starts.
4. Keep raw Markdown packet text supplemental only, with structured HTML as the primary review surface.
5. Regenerate generated alignment bundles via `node scripts/upgrade-alignment-page.mjs`.
6. Add focused tests for the Stage 2 template and Stage 1 preview expectation.
7. Run the requested generator, Vitest, and scoped whitespace verification, then record results and ship only if the dirty worktree can be safely isolated.

### Acceptance Criteria

- Canonical convention defines the Stage 2 review-page template and Stage 1 preview expectation.
- Generated bundles contain the new Stage 2 guidance after regeneration.
- Focused layer1 tests fail without the new text and pass with it.
- Verification results are documented before final handoff.
- No generated `ALIGNMENT-PAGE.md` files are hand-edited.

## Historical Implementation - Framework-Specific Alignment Guidance

### Goal

Populate generated `ALIGNMENT-PAGE.md` guidance for delegated framework skills with framework-specific review instructions covering research focus, documentation/review format, and concrete user feedback prompts.

### Scope

- `scripts/upgrade-alignment-page.mjs`
- Generated bundled `ALIGNMENT-PAGE.md` files under active `global/**` and `packs/**` skill mirrors
- Focused layer1 alignment generator tests
- Targeted framework bundles:
  - Competitive frameworks: `porter-five-forces`, `swot`, `strategic-group-map`, `feature-pricing-matrix`
  - Customer discovery frameworks: `w3-hypothesis`, `five-rings`, `four-forces`, `jtbd-needs`, `pmf-engine`, `seven-dimensions`
  - Positioning frameworks: `category-design`, `jtbd-positioning`, `moore-positioning`, `obviously-awesome`, `strategic-canvas`
  - Generated customer-lifecycle journey-map frameworks if they receive generated alignment bundles

### Plan

1. Protect existing dirty worktree state and inspect current generator/test behavior before editing.
2. Extend framework-specific translation in `scripts/upgrade-alignment-page.mjs` so known delegated frameworks no longer fall through to generic research guidance.
3. Keep broad fallback guidance for unknown `invocation: sub-skill` frameworks.
4. Regenerate bundled `ALIGNMENT-PAGE.md` files via `node scripts/upgrade-alignment-page.mjs`.
5. Add or update focused layer1 tests to require framework-specific research focus, review/documentation format, and suggested user feedback language.
6. Verify generator drift, targeted bundle content, focused tests, package/build checks if needed, and `git diff --check`.
7. Record review notes, history, ship manifest, and commit/push only the intended boundary if it can be isolated from unrelated dirty work.

### Acceptance Criteria

- Known delegated framework bundles contain framework-specific guidance for research focus, documentation format, and user feedback.
- Unknown sub-skill framework fallback remains broad but useful.
- Generated bundles are exact after regeneration.
- Focused layer1 tests and targeted `rg` checks pass.
- No hand edits are made to generated `ALIGNMENT-PAGE.md` files.

### Current Status

- Implemented and verified. Known delegated framework bundles now receive exact framework-specific guidance through `scripts/upgrade-alignment-page.mjs`, and unknown framework subskills retain fallback guidance.
- Verification passed: generator syntax check, generator regeneration/check, targeted framework `rg` scan, focused layer1 Vitest suite, and scoped `git diff --check` over this task's intended boundary.
- Full-tree `git diff --check` is currently red on unrelated archive `SKILL.md` blank-line-at-EOF diagnostics from the pre-existing dirty tree.
- Shipping is blocked until the pre-existing dirty worktree is separated; shared generator, test, and generated bundle files contain unrelated user-owned changes that cannot be safely committed as this task's boundary.

---

## Historical Implementation - Context Intake Metadata And Glossary Bootstrap

### Goal

Make `context_intake` the canonical skill frontmatter field for user/context intake, replacing `interview_depth`, and synchronize the docs, generator, catalog, showcase data, parity audit, tests, and glossary starter artifacts.

### Scope

- Active non-archived `SKILL.md` frontmatter under `global/`, `packs/`, and project-local `.codex/skills/`
- `docs/interview-convention.md`, `docs/skill-anatomy.md`, and narrow orchestrator wording if needed
- `scripts/upgrade-alignment-page.mjs`, `scripts/catalog/index.mjs`, and `scripts/skill-mirror-parity-audit.sh`
- Skills Showcase generated data and related catalog types
- `research/_working/preliminary-repo-glossary-research.md`, glossary review alignment page, and `research/glossary.md` if this handoff is treated as final approval
- Focused layer1 metadata/generator/catalog/parity verification

### Plan

1. Audit the existing dirty worktree and current metadata references without reverting unrelated work.
2. Convert active `interview_depth` declarations to `context_intake` values:
   - `full` -> `deep`
   - `light` -> `scoped`
   - `none` -> `artifact_only`
3. Update documentation and public wording to use "Deep interview", "Scoped intake", and "Artifact-driven" while preserving `type` as the broad workflow category.
4. Patch tooling and tests so `context_intake` and `visual_tier` are parsed, generated, mirrored, and exposed in catalog/showcase data.
5. Refresh glossary working/review artifacts with the new metadata terms and write the canonical starter glossary only if approval status is defensible from the handoff.
6. Regenerate derived bundles/data, run focused verification, record review notes, then stage/commit/push intended changes if they can be isolated from unrelated dirty work.

### Acceptance Criteria

- No active non-archived `SKILL.md` files use `interview_depth`.
- Active docs/scripts/apps/tests use `context_intake` except explicit historical migration notes if intentionally retained.
- Catalog output exposes `contextIntake`; Skills Showcase data carries it.
- Mirror parity includes `context_intake` and `visual_tier`.
- Glossary starter terms cover Frontmatter, Skill metadata, `type`, `context_intake`, `visual_tier`, Artifact-driven, Scoped intake, and Deep interview with sources.
- Focused checks and `git diff --check` pass or any pre-existing failures are clearly proven.

### Current Status

- Implemented through verification. Active skill metadata is migrated to `context_intake`, generated alignment guidance reads `context_intake` and `visual_tier`, catalog/showcase surfaces expose `contextIntake` and `visualTier`, and frontmatter tests guard the retired key.
- The glossary bootstrap is in review state: `research/_working/preliminary-repo-glossary-research.md` and `alignment/repo-glossary-skill-conventions.html` contain the starter terms and approval gates. `research/glossary.md` is intentionally not written until final compiled YAML approves the canonical glossary.
- Verification passed for static migration checks, alignment-page audit, generator drift, focused layer1 tests, Skills Showcase typecheck and catalog/smoke tests, and archive-excluded whitespace checks.
- Known blocked checks are due to pre-existing repo state: full-tree `git diff --check` fails only on unrelated archived snapshots, `skill-mirror-parity-audit.sh` still has 56 existing mirror drifts outside the new metadata keys, and showcase `validate:data` cannot pass until generated assets are committed.
- Shipping is blocked until the pre-existing dirty worktree is separated. A direct commit from this state would include unrelated staged and unstaged user-owned changes.

---

## Current Investigation - Delegated Skill Alignment Page Depth

### Goal

Investigate the claim that delegated/framework skills such as `w3-hypothesis` produce weaker, less informative alignment pages than non-delegated skills such as `idea-scope-brief` or `competitive-analysis`, then apply the smallest durable contract/test fix.

### Scope

- Delegated/framework skill contracts, starting with `w3-hypothesis` and adjacent customer-discovery frameworks.
- Non-delegated comparison contracts: `idea-scope-brief`, `competitive-analysis`, and the competitive-analysis framework route if relevant.
- Shared alignment-page convention and generation scripts only if they are the root cause.
- Focused tests or audits that can prevent thin delegated alignment-page instructions from returning.
- Prompt capture under `prompts/investigate/`.

### Plan

1. Validate the user claims against source and history.
   - Compare delegated and non-delegated `SKILL.md` / `ALIGNMENT-PAGE.md` contracts.
   - Check whether delegated skills explicitly instruct agents to render framework-specific findings, evidence, confidence, tradeoffs, and decision impact.
   - Inspect recent git history for when the delegated wording diverged or failed to inherit stronger guidance.
2. Trace the root cause.
   - Determine whether the issue is a framework-skill template gap, a shared alignment convention gap, or specific `w3-hypothesis` wording.
   - Identify the minimal set of active mirrors affected.
3. Patch the contract and coverage.
   - Prefer source skill/template wording over hand-editing generated pages.
   - Archive and version-bump any changed active `SKILL.md` files.
   - Add or update focused tests/audits so delegated framework skills require useful rendered review sections.
4. Verify and ship safely.
   - Run focused generation/check tests.
   - Record results in `tasks/todo.md`.
   - Stage only intended files, then commit/push if the existing dirty worktree can be cleanly isolated.

### Acceptance Criteria

- The claim is classified as confirmed, partially correct, or unsupported with file/history evidence.
- Delegated framework skills have explicit alignment-page substance requirements matching the quality bar of non-delegated skills.
- Verification proves the new guardrail is present.
- Existing unrelated dirty work is not reverted or accidentally absorbed.

---

## Historical Implementation - Optional Alignment Pages For Operational Skills

### Goal

Change the selected operational, planning, reporting, and status skills so alignment pages are optional rather than automatic. Their default output should be inline conversation summary plus normal durable artifacts such as `tasks/*.md`, reports, queues, status docs, or benchmark notes. They should create `alignment/*.html` only when the user requests it or when the agent names a concrete clarification/review need.

### Scope

- `scripts/upgrade-alignment-page.mjs`
- `scripts/alignment-skip-list.txt`
- First-batch optional skills and their Claude/Codex mirrors where present:
  - `roadmap`, `research-roadmap`, `plan-phase`
  - `brainstorm`, `devtool-workflow`, `game-workflow`, `game-roadmap`, `experiment`, `mono-plan`, `vertical-slice-splitter`
  - `reconcile-dev-docs`, `analyze-sessions`, `prompt-history-backfill`, `benchmark-test-skill`, `benchmark-agent-review`
  - `afps-status`, `handoff`, `branch-lifecycle`, `release`, `product-line`, `skill-inventory`, `provision-agentic-config`
- Generated `ALIGNMENT-PAGE.md` bundles for affected skills
- Focused layer1 tests:
  - `tests/layer1/alignment-gates.test.ts`
  - `tests/layer1/afps-alignment-preview-gates.test.ts`
  - `tests/layer1/codex-interview-cadence.test.ts`
- Prompt capture under `prompts/create-agentic-skill/`

### Plan

1. Capture the prompt and protect the existing dirty worktree.
   - Read the repo-managed skill update instructions and relevant lessons.
   - Record this plan in `tasks/roadmap.md` and `tasks/todo.md`.
   - Inventory target skills and current generated alignment policy.
2. Patch the generator.
   - Add an `OPTIONAL_ALIGNMENT_SKILLS` first-batch set.
   - Generate optional `SKILL.md` alignment stubs for those skills: inline/task artifacts by default; alignment pages only on request or explicit clarification/review need.
   - Generate optional `ALIGNMENT-PAGE.md` introductions while keeping the existing page/YAML/gate contract for cases where a page is created.
   - Keep approval-gated research, product, and spec skills automatic.
3. Patch skill sources through archive-first versioning.
   - Run `scripts/skill-archive.sh <skill-dir>` before each changed active `SKILL.md`.
   - Bump each changed skill version by one decimal.
   - Add `CHANGELOG.md` entries dated `2026-06-12`.
   - Convert `roadmap` and `plan-phase` to optional policy; remove `roadmap` from no-contract skip semantics.
4. Update skip-list semantics and tests.
   - Clarify that `scripts/alignment-skip-list.txt` is for skills excluded from generated alignment policy entirely.
   - Update tests that currently require automatic roadmap/research-roadmap gates.
   - Assert optional skills contain inline/task-artifact defaults, conditional page creation, and no automatic `tasks/roadmap.md` blocker language.
5. Regenerate and verify.
   - Run `node scripts/upgrade-alignment-page.mjs`.
   - Run `node scripts/upgrade-alignment-page.mjs --check`.
   - Run the requested focused tests, then broader layer1 coverage if targeted tests pass.
   - Review diff scope, stage only intended changes, commit, and push to `master`.

### Acceptance Criteria

- First-batch operational skills no longer require automatic alignment pages.
- Optional alignment pages still use the standard generated page/YAML/gate contract when created.
- `roadmap` is no longer treated as a no-contract skip-list exception.
- Approval-gated research/spec/product skills continue to require automatic alignment review pages.
- Focused tests prove both optional and automatic paths.

---

## Current Investigation - Interview Skill Type Convention

### Goal

Determine whether interview-style skills should get a dedicated skill type/convention, and whether the convention should preserve the longstanding relentless interview behavior under a better name.

### Scope

- Active skill frontmatter and type taxonomy across repo-managed skills.
- Interview-related skill contracts, especially `ui-interview`, `skill-interview`, and local/product interview variants.
- Recent history around `ui-interview` behavior regressions and evidence-synthesis/requirements-only changes.
- Pack metadata, generated showcase/index code, and tests that may consume `type`.
- Recommendation only unless a follow-up implementation is requested.

### Plan

1. Capture and classify the user claims.
   - Confirm whether interview-style skills currently have an explicit type or are hidden under broader categories.
   - Confirm whether recent changes weakened live interview/interrogation behavior.
2. Audit current conventions.
   - Inventory active non-archive `type:` values.
   - Read interview-related active `SKILL.md` files and pack metadata.
   - Check scripts/tests that group or display skills by type.
3. Inspect recent history.
   - Use `git log`, `git diff`, and `git blame` around `ui-interview` and related interview skill changes.
   - Identify whether the regression is a taxonomy issue, a contract wording issue, or both.
4. Produce the report.
   - Recommend a convention name and type value.
   - Spell out migration scope, guardrails, tests, and what not to rename.

### Acceptance Criteria

- Report distinguishes confirmed evidence from inference.
- Recommendation names the convention/type and explains why.
- Report includes likely impacted files/tests and a migration plan without making broad source changes in this audit.

---

## Historical Implementation - UI Interview Skipping And Context Routing

### Goal

Prevent `ui-interview --requirements-only` from treating upstream `user-flow-map` approval as its own interview, and make downstream research/planning handoffs offer an explicit context boundary instead of implying automatic execution.

### Scope

- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/CHANGELOG.md`
- `scripts/upgrade-alignment-page.mjs`
- Generated `ALIGNMENT-PAGE.md` bundles from the canonical alignment convention
- Focused layer1 tests and targeted regression searches
- Prompt capture under `prompts/targeted-skill-builder/` and `prompts/ui-interview/`

### Plan

1. Confirm current source state and protect existing dirty work.
   - Read active skill instructions, current pack mirrors, generator text, task docs, lessons, and relevant tests.
   - Treat the existing uncommitted `ui-interview` `v0.18` packet-rendering change as an in-progress release and extend that release rather than creating a conflicting `v0.19`.
2. Patch `ui-interview` requirements-only behavior.
   - State that upstream `user-flow-map` approval authorizes route selection only; it never counts as `ui-interview` interview completion.
   - Require the UI Assumptions Manifest and Content Requirements Manifest to be shown and confirmed inside `ui-interview --requirements-only` before any review page is built.
   - Add an explicit evidence-synthesis exception only when the current invocation asks to skip live questions or synthesize from evidence.
3. Patch downstream handoff routing.
   - Make `user-flow-map` present two choices after approval: stop so the user can clear context and run the next skill, or continue immediately in the same session.
   - State that continuing immediately still requires the next skill to run its own interaction gates.
   - Avoid auto-run or auto-invoke wording for downstream skills.
4. Patch generated alignment guidance and tests.
   - Add `Interview provenance` requirements to the `ui-interview` gate text.
   - Regenerate bundled `ALIGNMENT-PAGE.md` files.
   - Add focused tests for provenance, evidence-synthesis labeling, and handoff routing language.
5. Verify and ship.
   - Run the requested generator, layer1, diff, and targeted `rg` checks.
   - Record review notes in `tasks/todo.md`.
   - Commit and push intended changes where the existing dirty worktree allows clean staging.

### Acceptance Criteria

- `ui-interview --requirements-only` cannot skip its own UI/content confirmation gates based on upstream approval alone.
- Evidence-only output is explicitly labeled `evidence-synthesis review` and routes unresolved decisions back to a resumed `ui-interview`.
- Product-design handoffs present clear stop/clear-context and continue-now choices.
- Generated alignment guidance requires `Interview provenance` values: `live-ui-interview`, `evidence-synthesis-with-explicit-skip`, or `invalid-missing-ui-interview`.
- Focused tests and searches prove the new contract is present.

---

## Historical Implementation - Repo-Wide Packet Dump Remediation

### Goal

Fix packet-dump wording as a repo-wide contract bug. Alignment review pages must preserve complete packet content by rendering it as readable HTML review UI, not by making "Full Preliminary Packet" or "Full Working Packet" raw Markdown dumps the primary review surface.

### User Claims Validated

- Confirmed: active pack `SKILL.md` files contain the risky packet-rendering wording in 144 files.
- Confirmed: active generated `ALIGNMENT-PAGE.md` bundles repeat the generated risky wording in 281 files.
- Confirmed: root cause spans the shared generated alignment convention and copied Stage 2 lifecycle prose. `docs/alignment-page-convention.md` contains "renders the full preliminary packet"; active Stage 2 skill prose contains "Update the `review` HTML alignment page with the full preliminary packet".
- Confirmed: `scripts/researchish-skill-lifecycle-audit.mjs` and `tests/layer1/alignment-gates.test.ts` currently enforce the old phrasing.
- Confirmed: `.codex` / `.claude` local install roots did not show active hits in the initial search, but they still need refresh after source updates so runtime copies cannot lag.

### Root Cause Notes

The risky contract entered the canonical alignment convention in commit `664de0b23` on 2026-06-11 as part of the staged research workflow. The intent was no context loss, but the wording says to render the "full preliminary packet" without explicitly requiring translation into purposeful HTML modules. Copied Stage 2 prose in research-ish skills is stronger and says to update the review HTML page "with the full preliminary packet", which encourages agents to paste dense Markdown packets into the page instead of rendering the same content as navigable review UI.

### Scope

- `docs/alignment-page-convention.md`
- `scripts/researchish-skill-lifecycle-audit.mjs`
- Focused layer tests that assert old packet wording
- 144 active non-archive pack `SKILL.md` files across 72 logical mirrored skills
- Generated active `ALIGNMENT-PAGE.md` bundles after convention regeneration
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/lessons.md`, and prompt capture
- Local ignored `.codex/skills` and `.claude/skills` refresh if available

### Affected Active SKILL.md Inventory

Counts by pack:

- `business-research`: 44 files, 22 mirrored skills
- `youtube-ops`: 26 files, 13 mirrored skills
- `creator-foundation`: 14 files, 7 mirrored skills
- `business-growth`: 12 files, 6 mirrored skills
- `customer-lifecycle`: 12 files, 6 mirrored skills
- `game`: 12 files, 6 mirrored skills
- `business-ops`: 8 files, 4 mirrored skills
- `devtool`: 8 files, 4 mirrored skills
- `ord`: 2 files, 1 mirrored skill
- `product-design`: 2 files, 1 mirrored skill
- `remotion`: 2 files, 1 mirrored skill
- `vard`: 2 files, 1 mirrored skill

Logical mirrored skill inventory:

- `business-research`: `customer-feedback`, `lean-canvas`, `enterprise-icp`, `competitive-analysis`, `competitive-analysis/frameworks/feature-pricing-matrix`, `competitive-analysis/frameworks/porter-five-forces`, `competitive-analysis/frameworks/strategic-group-map`, `competitive-analysis/frameworks/swot`, `positioning`, `positioning/frameworks/category-design`, `positioning/frameworks/jtbd-positioning`, `positioning/frameworks/moore-positioning`, `positioning/frameworks/obviously-awesome`, `positioning/frameworks/strategic-canvas`, `customer-discovery`, `customer-discovery/frameworks/five-rings`, `customer-discovery/frameworks/four-forces`, `customer-discovery/frameworks/jtbd-needs`, `customer-discovery/frameworks/pmf-engine`, `customer-discovery/frameworks/seven-dimensions`, `customer-discovery/frameworks/w3-hypothesis`, `value-prop-canvas`
- `devtool`: `devtool-adoption`, `devtool-monetization`, `devtool-positioning`, `devtool-user-map`
- `business-growth`: `growth-model`, `gtm`, `hook-model`, `landing-copy`, `monetization`, `pmf-assessment`
- `business-ops`: `mvp-gap`, `platform-strategy`, `reconcile-research`, `repo-glossary`
- `creator-foundation`: `content-programming`, `creator-evidence-schema`, `creator-metrics-review`, `creator-platform-capability-matrix`, `creator-positioning`, `creator-presence-dossier`, `product-led-media-map`
- `customer-lifecycle`: `journey-map`, `journey-map/frameworks/customer-journey-canvas`, `journey-map/frameworks/experience-map`, `journey-map/frameworks/jtbd-timeline`, `journey-map/frameworks/service-blueprint`, `journey-map/frameworks/user-story-map`
- `game`: `game-audience`, `game-comparables`, `game-fantasy`, `game-genre-map`, `game-launch`, `game-store-page-test`
- `youtube-ops`: `youtube-audit`, `youtube-cadence-diagnosis`, `youtube-channel-audit`, `youtube-competitive-research`, `youtube-concept-research`, `youtube-description-optimizer`, `youtube-peer-benchmark`, `youtube-portfolio`, `youtube-search-positioning`, `youtube-title-thumbnail-audit`, `youtube-vid-research`, `youtube-video-audit`, `youtube-video-prelaunch-audit`
- `ord`: `ord-scan`
- `vard`: `vard-scan`
- `remotion`: `youtube-format-research`
- `product-design`: `ui-interview`

Generated `ALIGNMENT-PAGE.md` hit counts by pack:

- `agent-bridge`: 1
- `agentic-skills-bench`: 4
- `alignment-loop`: 2
- `business-growth`: 16
- `business-ops`: 26
- `business-research`: 44
- `code-maintenance`: 2
- `code-quality`: 4
- `code-review`: 8
- `context-transfer`: 2
- `creator-foundation`: 18
- `customer-lifecycle`: 24
- `devtool`: 16
- `docs-health`: 2
- `game`: 22
- `guided-walkthrough`: 2
- `monorepo`: 2
- `ord`: 2
- `product-design`: 18
- `product-testing`: 4
- `project-fleet`: 6
- `release-ops`: 4
- `remotion`: 6
- `report-gen`: 2
- `research-admin`: 2
- `session-analytics`: 4
- `skill-dev`: 4
- `teardown`: 4
- `vard`: 2
- `website-polish`: 2
- `youtube-ops`: 26

### Plan

1. Record and validate the bug.
   - Capture the `$investigate` invocation under `prompts/investigate/`.
   - Produce the active non-archive inventory and classify hits as generated convention, shared Stage 2 prose, skill-specific wording, tests/audits, or local install state.
   - Check recent git history for where the risky generated wording entered.
2. Patch shared convention and gates.
   - Update `docs/alignment-page-convention.md` so no-context-loss requires clean rendered HTML sections, tables, matrices, gates, cards, and review modules.
   - Explicitly forbid primary "Full Working Packet" / "Full Preliminary Packet" Markdown dumps.
   - Allow raw Markdown only as a supplemental source view after the rendered review UI.
   - Update lifecycle audit and focused tests to assert structured rendering language instead of "full preliminary packet".
3. Patch active skill contracts.
   - Process packs in requested order: `business-research`, `devtool`, `business-growth`, `business-ops`, `creator-foundation`, `customer-lifecycle`, `game`, `youtube-ops`, then `ord`, `vard`, `remotion`, `product-design`.
   - For each logical skill, archive both active mirrors with `scripts/skill-archive.sh <skill-dir>`, bump decimal versions, replace Stage 2 wording with structured HTML rendering language, preserve skill-specific additions, and update `CHANGELOG.md`.
4. Regenerate and refresh.
   - Run `node scripts/upgrade-alignment-page.mjs`.
   - Refresh ignored local `.codex/skills` and `.claude/skills` installs from pack source where project tooling supports it.
5. Verify and ship.
   - Run the requested checks and regression searches.
   - Review diff scope for unrelated changes.
   - Add the correction lesson.
   - Commit and push intended tracked changes to `master`.

### Verification Gates

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/researchish-skill-lifecycle-audit.mjs`
- `npx vitest run tests/layer1/alignment-gates.test.ts`
- `npx vitest run tests/layer1/researchish-skill-lifecycle-audit.test.ts`
- `npx vitest run tests/layer1/upgrade-alignment-page-bespoke.test.ts`
- Regression search over active non-archive sources must show no primary-rendering instructions containing:
  - `full preliminary packet`
  - `full working packet`
  - `Full Preliminary Packet`
  - `Full Working Packet`
  - `Update the review HTML alignment page with the full preliminary packet`
- Remaining hits, if any, must be archive history, storage-path references, or explicit "do not use as primary rendering" guardrails.

### Acceptance Criteria

- Every active affected skill keeps the staged working-packet lifecycle but instructs agents to render packet substance as structured HTML review UI.
- Generated alignment bundles carry the new no-packet-dump convention.
- Tests and audits enforce the new wording.
- `tasks/lessons.md` records the correction pattern.
- Intended tracked changes are committed and pushed.

---

## Historical Implementation - UI Interview Alignment Review Clarity

### Goal

Make the current `ui-interview` requirements review page and future `ui-interview` alignment pages clearer: the user should immediately understand whether they are reviewing a requirements-only draft or participating in the live interview, and Markdown tables should be rendered as readable HTML instead of a raw Markdown preview block.

### Scope

- Active review page: `alignment/ui-interview-skill-execution-handoff.html`.
- Active working packet: `research/skills-showcase/_working/preliminary-ui-interview-research.md`.
- `ui-interview` alignment-page generation contract through `scripts/upgrade-alignment-page.mjs`.
- Active `ui-interview` skill version/archive/changelog if the skill contract changes.
- Focused tests/audits covering the new contract and active alignment page validity.

### Out of Scope

- Changing the approved requirements substance.
- Writing canonical `specs/skills-showcase/ui-requirements-skill-execution-handoff*.md` before final compiled YAML approval.
- Redesigning the whole alignment-page convention across every skill.
- GitHub Actions.

### Plan

1. Confirm the failure mode.
   - [x] Read active `ui-interview` instructions and bundled alignment contract.
   - [x] Capture the visible prompt under `prompts/ui-interview/`.
   - [x] Inspect the current `ui-interview` review page and working packet.
2. Patch the contract.
   - [x] Add `ui-interview`-specific alignment guidance requiring a visible interview-stage explainer.
   - [x] Require structured HTML rendering of the working packet sections, especially Markdown tables.
   - [x] Preserve the no-context-loss requirement without using one raw `<pre><code>` Markdown dump as the primary review surface.
3. Patch the active review page.
   - [x] Archive the current active page before replacement.
   - [x] Convert the full working packet from raw Markdown preview into readable HTML sections and tables.
   - [x] Add a clear review-stage answer: `requirements-only` review now, full interview only when the skill is run interactively or rerun without `--requirements-only`.
   - [x] Keep canonical UI requirements files unwritten.
4. Verify and ship.
   - [x] Run generated-bundle drift checks.
   - [x] Run alignment-page audit.
   - [x] Run focused tests.
   - [x] Run `git diff --check`.
   - [x] Record review notes, commit, and push intended changes.

### Acceptance Criteria

- The active page no longer uses the full working packet raw Markdown block as the primary review surface.
- Markdown tables from the working packet render as HTML tables with horizontal overflow wrappers and TTS narratives.
- The page states the current `ui-interview` lifecycle stage in plain language.
- The page preserves approval gates and review-state behavior.
- Canonical UI requirements files remain absent until final compiled YAML approval.

---

## Historical Implementation - Skillpacks Install Route And Agent Doc Migration

### Goal

Make `npx skillpacks install <pack-or-skill>` the standard active install recommendation, and add explicit, marker-bounded `doctor --fix --agent-docs` migration for generated `AGENTS.md` / `CLAUDE.md` blocks while keeping plain `doctor` read-only.

### Scope

- `packages/skillpacks` CLI lifecycle and tests for `doctor`, `doctor --fix`, `doctor --fix --agent-docs`, dry-run diffs, backups, and generated skill-root cleanup.
- Active generated root instructions and `global/{claude,codex}/provision-agentic-config`.
- Active install-route guidance in global and pack skills, with version/archive/changelog discipline for changed `SKILL.md` files.
- Canonical install-routing contract, package docs, routing audit script, and fixtures.
- Generated package staging/manifest artifacts only through the package build.

### Plan

1. Capture and orient.
   - [x] Read the active `pack` skill instructions.
   - [x] Capture the visible invocation under `prompts/pack/`.
   - [x] Inspect lifecycle CLI, provision templates, routing audit, docs, and existing task state.
2. Implement safe CLI migration behavior.
   - [x] Keep `npx skillpacks doctor` read-only.
   - [x] Add `doctor --fix` to clean generated skill-root drift without touching agent docs.
   - [x] Add `doctor --fix --agent-docs [--dry-run]` for marker-bounded generated block replacement only.
   - [x] Refuse missing, duplicate, malformed, or unknown provision markers safely.
   - [x] Print unified diffs before writes and create timestamped `.agents/backups/` copies before agent-doc mutation.
3. Migrate install-route wording.
   - [x] Update root generated blocks, provisioner templates, package docs, and routing contract to standardize on `npx skillpacks install <pack-or-skill>`.
   - [x] Update active `SKILL.md` install guidance; keep `/pack`, `$pack`, and `scripts/pack.sh` only as explicit legacy/source-checkout behavior.
   - [x] Archive and bump versions for every active skill whose behavior/output guidance changes, and update `CHANGELOG.md`.
4. Update tests and fixtures.
   - [x] Add lifecycle coverage for read-only doctor, fix-only cleanup, dry-run agent-doc diff, backup/write migration, text preservation, and refusal cases.
   - [x] Update routing audit so active `/pack install` and `$pack install` guidance fails unless allowlisted.
   - [x] Refresh fixtures to prove valid/invalid install route behavior.
5. Verify and ship.
   - [x] Run `scripts/skill-install-routing-audit.sh --active`.
   - [x] Run `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`.
   - [x] Run `npm --workspace skillpacks run test:node`.
   - [x] Run `npm --workspace skillpacks run build:check`.
   - [x] Run `npm --workspace skillpacks run verify:package`.
   - [x] Run `git diff --check`.
   - [x] Record review notes, commit, and push intended changes on the primary branch unless blocked.

### Acceptance Criteria

- `doctor` remains a read-only drift report.
- `doctor --fix` cleans only generated skill roots and preserves pinned symlinks plus unmanaged local skill directories.
- Agent-doc migration is opt-in, marker-bounded, diffed, backed up, dry-runnable, and refuses unsafe files.
- Active agent-facing install recommendations use `npx skillpacks install <pack-or-skill>`.
- Active routing audit fails unallowlisted `/pack install` / `$pack install` guidance.
- Required package and routing verification commands pass.

### Outcome

Completed. The npm CLI now owns the standard active install route, `doctor` remains read-only by default, `doctor --fix` is scoped to generated skill-root cleanup, and agent-doc migration is opt-in, previewable, marker-bounded, and backed up before writing.

---

## Current Validation - Pack Skill Sunset Readiness

### Goal

Validate whether active skills still depend on `$pack` / `scripts/pack.sh` to install packs or individual skills, and determine whether the `pack` skill can be archived and sunset.

### Scope

- Active skill contracts under `global/codex/`, `packs/*/codex/`, and visible project-local skill roots.
- Repo docs and package code that may still surface pack-install guidance.
- Archive snapshots are evidence of historical behavior but do not block active sunset unless they are copied into generated/runtime manifests.
- Out of scope: actually archiving/removing the `pack` skill in this pass, changing install behavior, or introducing GitHub Actions.

### Plan

1. Capture and orient.
   - [x] Load the `pack` skill instructions because the request names the skill.
   - [x] Capture the visible invocation under `prompts/pack/`.
   - [x] Record this validation plan before repo-wide scanning.
2. Audit active references.
   - [x] Search active skills for `$pack`, `pack install`, `scripts/pack.sh install`, `scripts/pack.sh refresh`, and missing-skill fallback references.
   - [x] Search docs/package sources for user-facing pack-install guidance.
   - [x] Separate active contracts from archives, generated data, and the `pack` skill implementation itself.
3. Evaluate sunset readiness.
   - [x] Identify any active skill that still requires `pack` to install packs or skills.
   - [x] Identify non-blocking legacy/fallback references that should be rewritten before archival.
   - [x] Recommend whether archiving/sunsetting is safe now or after specific follow-up edits.
4. Verify and record.
   - [x] Run focused search commands and `git diff --check`.
   - [x] Add review notes to `tasks/todo.md`.

### Acceptance Criteria

- Every remaining active `$pack` / `scripts/pack.sh` install reference is classified.
- The recommendation distinguishes runtime blockers from documentation cleanup.
- Validation commands are recorded before reporting the result.

### Outcome

Not ready to archive yet. Active skill contracts still preserve `/pack install` and `$pack install` as canonical in-agent install routes, and the active install-route contract explicitly tells remediation to keep those routes while adding `npx skillpacks install` alternatives. The npm CLI has moved direct `skillpacks install` pack/skill lifecycle to package-owned Node code, but `skillpacks install-deck` still shells out to packaged `scripts/pack.sh install`, and 42 active skills still fail the npm-alternative routing audit.

---

## Current Planning - Skills Showcase Skill Execution Handoff Flow

### Goal

Build the approval-gated review page for the Skills Showcase `skill-execution-handoff` flow: how a developer moves from a completed deck or workflow selection into an executable agent/terminal handoff, including mode choice, approval packet awareness, copy/download paths, validation states, and recovery paths.

### Scope

- Product path: `skills-showcase` (`research/skills-showcase/`, `specs/skills-showcase/`).
- Review deliverable in this pass:
  - `alignment/user-flow-map-skill-execution-handoff.html` in `review` state.
- Proposed canonical deliverables after final compiled YAML approval only:
  - `specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
- Source evidence:
  - `research/.progress.yaml`
  - `research/skills-showcase/idea-brief.md`
  - `specs/skills-showcase/user-flow-deck-creation.md`
  - `specs/skills-showcase/user-flow-deck-creation-interview.md`
  - `apps/skills-showcase/docs/deck-builder-ux.md`
  - `docs/decks.md`
  - `docs/operating-modes.md`
  - `apps/skills-showcase/src/showcase/tui/workflow-data.ts`
- Out of scope: polished UI, visual styling, implementation architecture, CLI behavior changes, GitHub Actions, and direct production code changes.

### Plan

1. Capture invocation and resolve scope.
   - [x] Capture visible `$user-flow-map skills-showcase skill-execution-handoff` prompt history.
   - [x] Read the active `user-flow-map` skill instructions.
   - [x] Resolve active product path to `skills-showcase`.
   - [x] Inspect relevant research, existing user-flow specs, UX decisions, app routes, and handoff/operating-mode docs.
2. Confirm flow assumptions with the user.
   - [x] Draft Flow Assumptions Checkpoint from evidence.
   - [x] Receive confirmation or corrections.
3. Map the flow after approval.
   - [x] Define persona, goal, success condition, and triggering context.
   - [x] Inventory entry points, preconditions, happy path, alternate paths, branch rules, screens/routes, failures, recovery, and handoffs.
   - [x] Preserve layout/styling and implementation as non-goals.
4. Confirm coverage before writing.
   - [x] Flow coverage was reviewed in the prior conversation context.
   - [x] Carry corrected persona wording into the proposed spec and interview log.
5. Build review page only.
   - [x] Render the full proposed spec inline in the review alignment page.
   - [x] Render the full proposed interview log inline in the review alignment page.
   - [x] Include approval gates for evidence coverage, assumptions, flow map, branch/state/handoff coverage, artifact destination, proposed file changes, and downstream route.
   - [x] Update `alignment/index.html` with the new review page entry.
6. Verify and ship the review artifact.
   - [x] Run `node scripts/audit-alignment-pages.mjs`.
   - [x] Run `git diff --check`.
   - [x] Verify the proposed canonical markdown files remain unwritten.
   - [x] Verify no `specs/skills-showcase/user-flow-deck-creation*` files are modified.
   - [x] Record review notes and ship only intended review-page changes.

### Acceptance Criteria

- The flow covers web-to-terminal, web-to-repo, and agent-mode handoff paths without inventing CLI behavior.
- Approval-packet, mode-selection, stale-state, clipboard/download, no-data, permission, and validation failures are explicit.
- The spec reuses the confirmed deck-creation flow as upstream context and does not overwrite it.
- The review page contains the complete proposed spec and interview log inline, not as an iframe/object/embed or link-only document.
- Canonical markdown deliverables are not written until final compiled YAML has `approval_status: ready-for-agent-review`.
- The downstream route after confirmation remains `$ui-interview --requirements-only skill-execution-handoff`.

### Review Notes

- Built `alignment/user-flow-map-skill-execution-handoff.html` in `review` state with the complete proposed spec, proposed interview log, evidence context, and approval gates rendered inline.
- Did not write `specs/skills-showcase/user-flow-skill-execution-handoff.md` or `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`; those remain proposed destinations pending final compiled YAML approval.
- Updated `alignment/index.html` with the new Product Design & Spec entry.
- Opened the review page via `node scripts/open-html-page.mjs alignment/user-flow-map-skill-execution-handoff.html --browser auto` after the first sandboxed open was blocked.
- Verification passed:
  - `node scripts/audit-alignment-pages.mjs`
  - `git diff --check`
  - `test ! -e specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `test ! -e specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
  - `git diff --name-only -- specs/skills-showcase/user-flow-deck-creation.md specs/skills-showcase/user-flow-deck-creation-interview.md` returned no files.

---

## Current Planning - Skills Showcase Skill Execution Handoff UI Requirements

### Goal

Consume the approved `alignment/user-flow-map-skill-execution-handoff.html` response, materialize the canonical user-flow handoff files, then run `$ui-interview --requirements-only skill-execution-handoff` into a review-state UI requirements packet and alignment page.

### Scope

- Product path: `skills-showcase` (`research/skills-showcase/`, `specs/skills-showcase/`).
- Approved user-flow confirmation:
  - Confirm `alignment/user-flow-map-skill-execution-handoff.html`.
  - Write `specs/skills-showcase/user-flow-skill-execution-handoff.md`.
  - Write `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`.
- UI requirements review outputs:
  - `research/skills-showcase/_working/preliminary-ui-interview-research.md`
  - `alignment/ui-interview-skill-execution-handoff.html` in `review` state.
- Proposed canonical UI requirements after future final compiled YAML approval only:
  - `specs/skills-showcase/ui-requirements-skill-execution-handoff.md`
  - `specs/skills-showcase/ui-requirements-skill-execution-handoff-interview.md`
- Out of scope: layout variants, polished visual design, production implementation, database/auth/payment/analytics/admin work, and GitHub Actions.

### Plan

1. Capture invocation and plan.
   - [x] Capture visible `$ui-interview --requirements-only skill-execution-handoff` handoff prompt history.
   - [x] Read the active `ui-interview` skill instructions and bundled alignment-page contract.
   - [x] Resolve active product path to `skills-showcase`.
   - [x] Record current handoff checklist in task docs.
2. Close the approved upstream flow.
   - [x] Verify final compiled YAML is complete and has no negative section feedback.
   - [x] Extract the approved proposed spec and interview log from `alignment/user-flow-map-skill-execution-handoff.html`.
   - [x] Write canonical user-flow spec and interview log under `specs/skills-showcase/`.
   - [x] Archive the prior review alignment page and convert the active page to `confirmed`.
   - [x] Update `alignment/index.html` metadata if confirmation state/date changes require it.
3. Build requirements-only UI review artifacts.
   - [x] Read source evidence from the confirmed flow spec, Skills Showcase idea brief, deck-creation flow, operating-mode/approval-packet docs, and relevant app route/component files.
   - [x] Draft the UI Assumptions Manifest, content requirements manifest, page/entity/action/state matrices, coverage checkpoint, and interview record.
   - [x] Write the draft only to `research/skills-showcase/_working/preliminary-ui-interview-research.md`.
   - [x] Build `alignment/ui-interview-skill-execution-handoff.html` in `review` state with the full working packet rendered inline and required gates.
   - [x] Open or attempt to open the alignment page in the browser.
4. Verify and ship.
   - [x] Run `node scripts/audit-alignment-pages.mjs`.
   - [x] Run `git diff --check`.
   - [x] Verify UI canonical files remain unwritten before final UI approval.
   - [x] Review the diff for unrelated changes and intended scope.
   - [x] Commit and push intended tracked changes if validation passes.

### Acceptance Criteria

- The upstream user-flow page is confirmed only after the provided complete approval YAML is honored.
- The UI requirements output stays requirements-only: data, actions, states, constraints, hierarchy, and relationships, with no locked layout/component/spatial decisions.
- The UI review page contains the full working packet inline, including source evidence, assumptions, content requirements, coverage, destinations, and approval gates.
- Canonical `specs/skills-showcase/ui-requirements-skill-execution-handoff*.md` files are not written until a later final compiled YAML approval for the UI page.
- The downstream route language is withheld while the UI page remains in `review`.

### Review Notes

- User-flow approval consumed: provided YAML was complete, had `approval_status: ready-for-agent-review`, and had `section_feedback: []`.
- Wrote canonical upstream files:
  - `specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
- Archived the prior review page at `docs/history/archive/2026-06-12/102540/alignment/user-flow-map-skill-execution-handoff.html` and converted `alignment/user-flow-map-skill-execution-handoff.html` to confirmed.
- Wrote requirements-only review artifacts:
  - `research/skills-showcase/_working/preliminary-ui-interview-research.md`
  - `alignment/ui-interview-skill-execution-handoff.html`
- Updated `alignment/index.html` with the new UI review page and confirmed upstream flow entry.
- Browser open: `node scripts/open-html-page.mjs alignment/ui-interview-skill-execution-handoff.html --browser auto` opened the page via macOS.
- Verification passed:
  - `node scripts/audit-alignment-pages.mjs` -> 50 active pages, TTS exact, metadata exact, viewport exact, embed prohibition exact, index integrity exact.
  - `git diff --check`
  - `node -e` inline-script syntax check for `alignment/ui-interview-skill-execution-handoff.html`
  - `test ! -e specs/skills-showcase/ui-requirements-skill-execution-handoff.md`
  - `test ! -e specs/skills-showcase/ui-requirements-skill-execution-handoff-interview.md`
- Shipped to `origin/master` in commit `5139bcbc` (`Add skill execution handoff UI requirements review`).

---

## Historical Implementation - Skillpacks Init Global Alias

### Goal

Add a compatibility alias so `npx skillpacks init --global` performs the same user-home global core install path as `npx skillpacks init-global`, while preserving project-local behavior for `npx skillpacks init`.

### Scope

- Update `packages/skillpacks/src/cli/run-pack-script.mjs` to route `init --global` to the existing packaged global init implementation.
- Keep unsupported `init` arguments rejected.
- Update CLI help and public package docs for `init`, `init --global`, and `init-global`.
- Add lifecycle/CLI coverage for the new alias and unchanged behaviors.
- Refresh staged package artifacts if build validation requires it.
- Record prompt/task history and quality-gate shipping evidence.

### Plan

1. Capture and inspect.
   - [x] Capture the visible invocation under `prompts/exec/`.
   - [x] Read current init/init-global routing, docs/help, tests, and package scripts.
   - [x] Record this roadmap/todo plan before implementation.
2. Implement the alias.
   - [x] Route `skillpacks init --global` to packaged `init.sh` through the same global-core path as `init-global`.
   - [x] Preserve `skillpacks init` project-local install behavior.
   - [x] Preserve rejection for unsupported `init` arguments such as `--bad`.
   - [x] Update help/docs without changing global install semantics.
3. Validate and ship.
   - [x] Add targeted lifecycle/CLI regression tests.
   - [x] Run `npm --workspace skillpacks run test:node`.
   - [x] Run `npm --workspace skillpacks run build:check`.
   - [x] Run `git diff --check`.
   - [x] Record review notes, history, and quality-gate manifest.
   - [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- `skillpacks init --global --help` reaches packaged `init.sh --help`.
- `skillpacks init --bad` still errors.
- `skillpacks init` still installs project-local base skills.
- `skillpacks init-global` remains available for backward compatibility.
- Documentation clearly states that global init installs only global core skills from the package snapshot.

---

## Historical Implementation - Skillpacks 0.1.1 Publish Readiness

### Goal

Prepare the repository and staged npm package artifacts for a later explicit `skillpacks@0.1.1` publish, without running a real publish in this pass.

### Scope

- Re-run the `skillpacks` package validation and build gates.
- Refresh stale generated package artifacts, especially `packages/skillpacks/build/` and `packages/skillpacks/dist/skillpacks-manifest.json`.
- Confirm the staged package reports `skillpacks@0.1.1`.
- Run npm registry/readiness checks using `/tmp/skillpacks-npm-cache`.
- Record readiness notes in task history and ship manifest artifacts.
- Out of scope: real `npm publish`, package access changes, npm dist-tag changes, GitHub Actions, or unrelated package behavior changes.

### Plan

1. Capture current state.
   - [x] Check git status and package metadata.
   - [x] Confirm the public registry does not already contain `skillpacks@0.1.1`.
2. Validate and regenerate package artifacts.
   - [x] Run `npm --workspace skillpacks run test:node`.
   - [x] Run `npm --workspace skillpacks run build`.
   - [x] Run `npm --workspace skillpacks run build:check`.
   - [x] Run `npm --workspace skillpacks run verify:package`.
   - [x] Confirm `packages/skillpacks/build/package.json` is `0.1.1`.
3. Exercise publish packaging without publishing.
   - [x] Run `npm publish --dry-run --json` from `packages/skillpacks/build`.
   - [x] Confirm the dry-run reports `skillpacks@0.1.1`.
   - [x] Run `git diff --check`.
   - [x] Run `npm whoami` against the npm registry and record whether auth is ready.
4. Ship readiness artifacts.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Add a dated history entry and ship manifest.
   - [x] Commit and push intended readiness artifacts on the primary branch if validation allows.

### Acceptance Criteria

- `packages/skillpacks/package.json` and `packages/skillpacks/build/package.json` both report `0.1.1`.
- Generated package checks pass with no stale generated files.
- The dry-run tarball reports `skillpacks@0.1.1`.
- The npm registry does not already contain `0.1.1`.
- The worktree is clean after committing readiness artifacts.
- Full external publish readiness is blocked if npm auth still fails.

### Review Notes

Local package readiness passed for `skillpacks@0.1.1`; the only remaining publish-readiness blocker is npm authentication. `npm whoami` reached `registry.npmjs.org` and returned `E401 Unauthorized`, so a real publish remains out of scope until the intended publisher account is logged in and the publish is explicitly requested.

Ship-end addendum: real publish attempts now run `packages/skillpacks/scripts/prepublish-auth-check.mjs` through `prepublishOnly` before npm upload. The guard skips dry-runs, verifies the expected publisher and maintainer state, and fails early if `skillpacks@0.1.1` already exists. Package staging includes the guard, and package validation passes with 55 Node tests plus `verify:package`.

---

## Historical Implementation - Deck-Builder Animation Approval And Routing Spike

### Goal

Consume the approved `animation-design-planner` response for the deck-builder transitions, write the canonical animation plan, convert the alignment page to confirmed, then execute the first deck-builder implementation spike: prove whether shallow `window.history.pushState` keeps a shared client shell mounted while `usePathname` and `popstate` update correctly on Next 16.2.6.

### Scope

- Finalize approved animation artifacts: archive the review page/working packet, write `apps/skills-showcase/docs/animation-plan-deck-builder.md`, confirm `alignment/animation-design-planner-deck-builder-transitions.html`, and update `alignment/index.html`.
- Add prompt-history records for the current `/exec` and animation-plan approval handoff.
- Add only a minimal route spike and proof harness for shallow pushState behavior.
- Do not implement the full deck-builder, card-flight animation, pack-opening retrofit, homepage replacement, deploy flow, GitHub Actions, or unrelated install-routing debt.

### Plan

1. Capture and orient.
   - [x] Read `$exec`, `animation-design-planner` approval handling, task docs, app docs, and the approved alignment page.
   - [x] Capture the visible invocation under `prompts/exec/` and `prompts/animation-design-planner/`.
   - [x] Record this roadmap and active todo before implementation.
2. Finalize approved artifacts.
   - [x] Archive the current review page and non-canonical working packet under `docs/history/archive/2026-06-11/142531/`.
   - [x] Write `apps/skills-showcase/docs/animation-plan-deck-builder.md` from the approved page content and gate answers.
   - [x] Convert `alignment/animation-design-planner-deck-builder-transitions.html` to confirmed with read-only decision records and the approval YAML preserved.
   - [x] Update `alignment/index.html` to mark the entry confirmed.
3. Execute the first implementation spike.
   - [x] Add the smallest route spike that proves shallow `pushState`, `usePathname`, `popstate`, and `/deck/[slug]` hard-load behavior.
   - [x] Add Playwright as local implementation proof tooling if dependency installation succeeds.
   - [x] Add a Playwright spike test or document a dependency/install blocker before shipping.
4. Validate and ship.
   - [x] Run focused app validation, Playwright proof when available, the active alignment-page audit, and `git diff --check`.
   - [x] Record review notes, history, and a quality-gate ship manifest.
   - [x] Commit and push intended changes on the primary branch.

### Acceptance Criteria

- The approved animation plan is canonical in `apps/skills-showcase/docs/animation-plan-deck-builder.md`.
- The active alignment page is confirmed and preserves the exact final approval YAML.
- The non-canonical working packet no longer remains in active `research/skills-showcase/_working/`.
- The routing spike produces executable proof for the load-bearing Next 16.2.6 pushState assumption or records a concrete blocker/redesign trigger.
- No full deck-builder implementation or unrelated P2 install-routing work is included.

---

## Historical Implementation - Idea-Scope-Brief Deck-Fit Routing

### Goal

Update `$idea-scope-brief` so completed idea briefs recommend the closest workflow deck, preferring repo-saved deck config when present and falling back to the canonical decks: `vard`, `ord`, `business-afps`, `devtool-afps`, and `game-afps`.

### Scope

- Active skill contract: `global/codex/idea-scope-brief/SKILL.md`.
- Skill archive/version/changelog for `v0.16`.
- Prompt history for this `$targeted-skill-builder` invocation.
- Generated Skills Showcase data because an active `SKILL.md` behavior changed.
- Out of scope: adding a new deck runtime primitive, reading browser localStorage, or changing pack/deck installer implementation.

### Plan

1. Capture and inspect.
   - [x] Read `$targeted-skill-builder`, active lessons, current `idea-scope-brief`, deck docs, repo config, and task docs.
   - [x] Capture the visible invocation under `prompts/targeted-skill-builder/`.
   - [x] Record this roadmap and active todo before implementation.
2. Update the skill contract.
   - [x] Archive `global/codex/idea-scope-brief/SKILL.md` with `scripts/skill-archive.sh`.
   - [x] Bump `version:` from `v0.15` to `v0.16`.
   - [x] Add a `Deck Fit Handoff` rule that reads canonical deck metadata and `.agents/project.json` `saved_decks` / `decks`.
   - [x] Rank deck candidates by domain, tempo, and concept signals.
   - [x] Make high-confidence deck fit the primary `## Next Steps` recommendation, with canonical deck installs using `npx skillpacks install-deck <deck>`.
   - [x] Keep downstream research routing as secondary context after deck selection.
   - [x] Update `CHANGELOG.md` for `v0.16`.
3. Validate and ship.
   - [x] Run focused route text checks and `./scripts/skill-install-routing-audit.sh`.
   - [x] Run standard skill validation and benchmark coverage.
   - [x] Regenerate and validate Skills Showcase data.
   - [x] Run `git diff --check`.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Commit and push intended changes on the primary branch.

### Acceptance Criteria

- A completed idea brief can recommend the best-fit deck as the primary next command when confidence is high.
- Saved repo deck candidates from `.agents/project.json` are considered before canonical fallback decks.
- Canonical deck recommendations use `npx skillpacks install-deck <deck>`.
- Customized saved deck recommendations give explicit pack install guidance unless they preserve a canonical slug.
- Game, lightweight OSS/devtool, deliberate devtool, rapid consumer/business, and deliberate business concepts have explicit default deck routing examples.

---

## Historical Implementation - Ship-End Missing CLI Module And Alignment Artifact Cleanup

### Goal

Finish the `$ship-end` wrap-up by committing and pushing the current local artifacts on `master`, while fixing the clean-checkout CLI dependency gap and making previously untracked alignment pages pass the active-page audit.

### Scope

- Include the missing `packages/skillpacks/src/cli/update-check.mjs` module already imported by the tracked `packages/skillpacks/bin/skillpacks.mjs`.
- Finish and index the untracked active alignment pages:
  - `alignment/analyze-sessions-afps-workflow-patterns.html`
  - `alignment/uat-card-pack-migration.html`
- Include the related prompt-history artifacts under `prompts/`.
- Update task/history/manifest files for this shipping boundary.
- Out of scope: changing the published package version, altering the update-check behavior beyond adding the missing module, or deploying the Skills Showcase without an available deploy skill.

### Plan

1. Capture and inspect.
   - [x] Capture the visible `$ship-end` invocation under `prompts/ship-end/`.
   - [x] Inspect git status, unpushed commits, task docs, manual tasks, advisory tasks, and deploy contract.
   - [x] Identify that the tracked CLI entrypoint imports an untracked `update-check.mjs` module.
2. Repair active artifacts.
   - [x] Add alignment-page metadata, TTS includes, and index entries for the two untracked alignment pages.
   - [x] Verify the alignment-page audit passes for the active page set.
   - [x] Reconcile stale task bookkeeping for the already-shipped install-destination output correction.
3. Validate and ship.
   - [x] Run package syntax/package tests, alignment audit, whitespace checks, and ship-boundary review.
   - [x] Record history and the quality-gate manifest.
   - [x] Commit and push intended files on `master`.

### Acceptance Criteria

- A clean checkout has the `update-check.mjs` module required by `packages/skillpacks/bin/skillpacks.mjs`.
- `npm --workspace skillpacks run test:node` passes with the shipped source tree.
- The active alignment-page audit passes with the two new pages indexed.
- Prompt-history artifacts for the shipped skill invocations are tracked.
- No generated local skill roots under `.claude/skills/**` or `.codex/skills/**` are staged.

---

## Historical Implementation - Strict Exact Skillpacks Install Resolution

### Goal

Fix `npx skillpacks install exec` so install resolution prefers the exact `exec` skill over the `exec-loop` pack alias, and make install resolution strict: exact active skill name, exact active pack name, or exact active pack title only.

### Scope

- Install/remove argument resolution in `packages/skillpacks/src/cli/pack-normalization.mjs`.
- Focused package tests in `packages/skillpacks/test/pack-normalization.test.mjs` and `packages/skillpacks/test/lifecycle.test.mjs`.
- Prompt/task history for this `$investigate` invocation.
- Out of scope: changing remove alias/fuzzy cleanup behavior, pack lifecycle install/link mechanics, or unrelated dirty worktree files.

### Plan

1. Capture and validate.
   - [x] Capture the visible `$investigate` invocation under `prompts/investigate/`.
   - [x] Read active lessons and task docs.
   - [x] Inspect install resolution code, tests, and recent history.
   - [x] Validate the `exec` alias/skill precedence claim against the current manifest.
2. Implement strict install resolution.
   - [x] Resolve install tokens by exact active skill name first.
   - [x] Resolve exact active pack slugs next.
   - [x] Resolve exact active pack titles using trimmed/collapsed whitespace title matching.
   - [x] Preserve hibernated pack/skill safety diagnostics before unknown-name failure.
   - [x] Leave remove behavior unchanged.
3. Cover regressions.
   - [x] Add unit coverage for `exec`, `exec-loop`, exact pack title, rejected aliases, rejected fuzzy names, and exact skill names.
   - [x] Add lifecycle coverage proving `skillpacks install exec` installs the individual `exec` skill and does not enable `exec-loop`.
4. Validate and ship.
   - [x] Run focused Node test files.
   - [x] Run the package test script if available.
   - [x] Run `git diff --check`.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Commit and push intended changes on the primary branch.

### Acceptance Criteria

- `install exec` resolves to `{ packs: [], skills: ['exec'] }`.
- `install exec-loop` resolves to `{ packs: ['exec-loop'], skills: [] }`.
- `install "Exec Loop Pack"` resolves to `{ packs: ['exec-loop'], skills: [] }`.
- Install aliases such as `quality` and fuzzy names such as `icp` fail with `Unknown pack or skill`.
- Exact skill names such as `enterprise-icp` still install.
- Remove keeps its existing alias/fuzzy cleanup behavior.

---

## Historical Implementation - Skillpacks Project-Local Base Init

### Goal

Validate the pack-refresh/global-skill update gap and, if confirmed, add a project-local `npx skillpacks init` path that installs base skills into the target repository so package refreshes can update them without relying on user-home global skill installs.

### Scope

- npm CLI lifecycle code under `packages/skillpacks/src/cli/`.
- Focused package tests under `packages/skillpacks/test/`.
- npm distribution docs: `docs/QUICKSTART.md`, `docs/skillpacks-npm-distribution.md`, and `README.md`.
- Prompt/task history for this `$investigate` invocation.
- Out of scope: removing source-checkout `./init.sh`, renaming the authoring `global/` directory, or changing unrelated dirty worktree files.

### Plan

1. Capture and investigate.
   - [x] Capture the visible `$investigate` invocation under `prompts/investigate/`.
   - [x] Read active lessons and relevant task docs.
   - [x] Inspect current `skillpacks` CLI, pack lifecycle, init, docs, and git history.
   - [x] Validate whether `refresh` touches global/user-home skills.
2. Implement project-local base init.
   - [x] Add a Node-owned `skillpacks init` command that installs global-scope skills as project-local base skills under `.claude/skills` and `.codex/skills`.
   - [x] Track base installation in `.agents/project.json` so `skillpacks refresh` rebuilds base skills from the current package snapshot.
   - [x] Make `doctor` and `prune` account for project-local base skills without deleting unmanaged user content.
   - [x] Keep `init-global` as the explicit user-home global install path.
3. Document and cover.
   - [x] Add focused lifecycle tests for base init, refresh, and prune expectations.
   - [x] Update npm distribution docs and quickstart wording to explain base versus global install paths.
4. Validate and ship.
   - [x] Run focused package tests and package manifest/build checks.
   - [x] Run `git diff --check`.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- `npx skillpacks init` installs base/global-scope skills into the current project's local `.claude/skills` and `.codex/skills` roots.
- `.agents/project.json` records that base skills are enabled.
- `npx skillpacks refresh` refreshes enabled packs, individually enabled skills, and enabled base skills from the installed package snapshot.
- `npx skillpacks init-global` remains available for users who explicitly want user-home global installs.
- Tests prove the base install and refresh behavior without requiring bash or jq.

---

## Historical Implementation - Alignment Compile Responses Convention

### Goal

Unify generated alignment-page response compilation so answered gate questions and selected section feedback compile through one bottom `Compile Responses` action, while local section feedback controls stay hidden until a section feedback choice is selected.

### Scope

- Canonical convention: `docs/alignment-page-convention.md` inside the `alignment-convention` block.
- Generated bundles: active generated `ALIGNMENT-PAGE.md` files refreshed only through `node scripts/upgrade-alignment-page.mjs`.
- Focused tests:
  - `tests/layer1/alignment-gates.test.ts`
  - `tests/layer1/upgrade-alignment-pages.test.ts`
- Prompt/task history for this `exec` invocation.

### Plan

1. Capture and plan.
   - [x] Read active repo instructions, lessons, task docs, and relevant alignment-page/test context.
   - [x] Capture the visible invocation under `prompts/exec/`.
   - [x] Record this active roadmap/todo plan before implementation.
2. Update the canonical convention.
   - [x] Replace the separate bottom `Compile Feedback YAML` and `Compile Answers` model with one bottom `Compile Responses` control.
   - [x] Define compiled responses as a mixed YAML payload containing answered gates, selected `section_feedback`, and unanswered required gate count/status for partial responses.
   - [x] Preserve partial response behavior when at least one gate answer or one section feedback item exists.
   - [x] Keep final approval limited to `approval_status: ready-for-agent-review` only when all required gates are answered and no unresolved negative or clarification feedback remains.
   - [x] Require local section feedback textarea, local compile/copy controls, and read-only YAML output to be hidden until emphasize, thumbs-down, or clarification is selected for that section.
   - [x] Require confirmed pages to remove the final `Compile Responses` button, response counters, input controls, and approval-blocking UI.
3. Regenerate and cover.
   - [x] Run `node scripts/upgrade-alignment-page.mjs`.
   - [x] Update focused layer1 assertions for unified response compilation, local feedback visibility, generated bundle wording, and upgrade-page feature wording.
4. Validate and ship.
   - [x] Run `node scripts/upgrade-alignment-page.mjs --check`.
   - [x] Run `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`.
   - [x] Run `pnpm --dir tests exec vitest run --project layer1 layer1/upgrade-alignment-pages.test.ts`.
   - [x] Run `git diff --check`.
   - [x] Record review notes, history, and ship manifest.
   - [x] Commit and push intended files on the primary branch.

### Acceptance Criteria

- Review pages describe one bottom `Compile Responses` control instead of separate bottom compile-feedback and compile-answer controls.
- Compiled response YAML may contain both gate answers and section feedback while preserving the existing gate-answer and `section_feedback` shapes.
- Users can compile partial responses before all required gates are answered when at least one gate answer or one section feedback choice exists.
- Final approval remains blocked unless every required gate is answered and there are no unresolved negative or clarification feedback items.
- Local section feedback UI is hidden until its section feedback button is selected and hides again when deselected.
- Confirmed pages preserve approval records but remove final response compilation controls and approval-blocking UI.
- Generated bundles are in sync with the canonical convention.

---

## Historical Implementation - Alignment Browser-Open Fallback Contract

### Goal

Patch the shared generated alignment-page browser-open contract so skills do not fail or choose the wrong fallback when a target repository lacks `scripts/open-html-page.mjs`, especially under WSL where Windows browser bridging is available.

### Scope

- Canonical convention: `docs/alignment-page-convention.md`.
- Generated bundles: active generated `ALIGNMENT-PAGE.md` files under `global/` and `packs/` as produced by `scripts/upgrade-alignment-page.mjs`; installed copies are refreshed by runner install/pack-refresh flows.
- Regression coverage: focused layer1 coverage for the new Browser open wording.
- Evidence basis: current user-provided `$session-triage` report for `$youtube-channel-audit @georgele` browser-open failure and existing WSL lesson in `tasks/lessons.md`.

### Plan

1. Capture context and plan.
   - [x] Read the active `$targeted-skill-builder` and `$session-triage` contracts.
   - [x] Read relevant lessons and task state.
   - [x] Capture the visible invocation under `prompts/targeted-skill-builder/`.
   - [x] Record this plan and the active todo before implementation.
2. Patch the durable contract.
   - [x] Update the canonical Browser open paragraph in `docs/alignment-page-convention.md`.
   - [x] Make the fallback order explicit: helper script when present, WSL PowerShell `file://wsl.localhost/<distro>/...` bridge when available, `xdg-open` when available, then `failed` with absolute path.
   - [x] Preserve existing status reporting semantics: `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.
3. Regenerate and cover.
   - [x] Run `node scripts/upgrade-alignment-page.mjs` to refresh generated bundles.
   - [x] Add or update focused layer1 checks that pin the fallback contract.
4. Validate and ship.
   - [x] Run generated bundle drift checks, skill hygiene checks, focused tests, showcase refresh if needed, and whitespace checks.
   - [x] Record review notes in `tasks/todo.md`.
   - [ ] Commit and push intended files on `master`.

### Acceptance Criteria

- Generated `ALIGNMENT-PAGE.md` Browser open text no longer assumes `scripts/open-html-page.mjs` exists in every target repo.
- The contract requires WSL Windows-browser fallback before Linux `xdg-open`.
- The fallback uses a browser-friendly `file://wsl.localhost/<distro>/...` URI when possible and reports the final status/path.
- Focused tests prove the canonical and generated wording include the helper-existence gate and WSL fallback.
- Validation commands pass or any residual failure is clearly documented with evidence.

### Completion Notes

- Patched the canonical Browser open contract and regenerated 288 generated `ALIGNMENT-PAGE.md` bundles.
- Added layer1 assertions for the helper existence check, WSL PowerShell `file://wsl.localhost` fallback, xdg-open fallback order, and blocked/failed absolute-path reporting.
- Verified the WSL PowerShell fallback command against an existing alignment HTML page; the command exited 0.
- Did not refresh Skills Showcase data in this boundary because no intended `SKILL.md` or `PACK.md` metadata/content changed.

---

## Historical Implementation - Research-ish Skill Lifecycle Audit

### Goal

Add a read-only audit for active research-ish skills, generate the inventory report, then remediate only confirmed lifecycle/type drift in focused batches.

### Scope

- Active skill files under `global/**/SKILL.md` and `packs/**/SKILL.md`, excluding `archive/**`.
- Research-ish inclusion signals:
  - `type: research`
  - alignment-page behavior
  - `research/` output language
  - `_working` packet language
  - canonical research/report artifact writes
- Out of scope for this pass:
  - Archived skill snapshots.
  - Broad all-skill remediation unless the research-ish heuristic misses obvious lifecycle violations.
  - P1/P2/P3 install-routing remediation already tracked separately.

### Plan

1. Build the audit inventory.
   - [x] Add `scripts/researchish-skill-lifecycle-audit.mjs`.
   - [x] Support default human summary mode without file writes.
   - [x] Support `--json` machine-readable output for tests.
   - [x] Classify each in-scope skill into exactly one category: `staged-research`, `alignment-document`, `direct-utility`, or `misclassified`.
2. Write the report.
   - [x] Generate `research/researchish-skill-lifecycle-audit.md` from audit output.
   - [x] Include counts by category.
   - [x] List every `misclassified` skill.
   - [x] List every non-research skill with `research/` output language.
   - [x] List every alignment-page skill that appears to belong in `scripts/alignment-skip-list.txt`.
   - [x] List every marker-compliant `type: research` skill that is semantically suspicious.
3. Add regression coverage.
   - [x] Add layer1 coverage for staged markers, skip-list bundles, non-research `_working` misuse, and stable JSON categories/counts.
   - [x] Keep the audit script read-only except when report generation is explicitly redirected by the agent.
4. Remediate after the report exists.
   - [x] For confirmed true research producers, keep the 4-step staged workflow and correct lifecycle metadata.
   - [x] For misclassified skills, change `type:` to the correct existing category while preserving intended behavior.
   - [x] Preserve the non-research `research/` and alignment skip-list candidate queues as report inventory for a later review batch instead of applying broad heuristic edits.
5. Validate and ship.
   - [x] Run generated alignment bundle, layer1, archive/version/dependency, showcase, and whitespace checks.
   - [x] Commit and push intended source, report, task, and generated-data changes on the primary branch.

### Acceptance Criteria

- The audit script can be run as `node scripts/researchish-skill-lifecycle-audit.mjs` and `node scripts/researchish-skill-lifecycle-audit.mjs --json`.
- The report at `research/researchish-skill-lifecycle-audit.md` is generated from current active skill data.
- Layer1 tests cover the audit's output shape and lifecycle invariants.
- Any active `SKILL.md` changes follow archive, version bump, changelog, and generated `ALIGNMENT-PAGE.md` rules.
- Required validation commands either pass or have clearly documented pre-existing/accepted residual risk.

### Completion Notes

- Implemented the read-only audit script and generated the pre-remediation inventory report.
- Reclassified only the four report-backed staged research producers from `analysis` to `research`: mirrored `repo-glossary` and `journey-map`.
- Live audit after remediation reports 142 active `type: research` skills and 0 misclassified skills.
- Broader direct-utility alignment-page candidates remain in the report as a review queue; they were not auto-remediated because the classifier marks candidates, not confirmed behavior changes.
- Validation passed for generated alignment bundles, focused layer1 tests, skill archives/versions/deps, Skills Showcase generated data, and whitespace.

---

## Historical Implementation - VARD/ORD Scan Staged Research Contract

### Goal

Upgrade the active VARD and ORD scan skills so they follow the strict scope-first staged research lifecycle already required for business-discovery research skills.

### Scope

- Active skill targets:
  - `packs/vard/codex/vard-scan/SKILL.md`
  - `packs/vard/claude/vard-scan/SKILL.md`
  - `packs/ord/codex/ord-scan/SKILL.md`
  - `packs/ord/claude/ord-scan/SKILL.md`
- Required behavior:
  - Stage 1 performs only minimal scope discovery and creates a `review` alignment page.
  - Stage 2 writes a preliminary `_working` research packet only after scope approval.
  - Stage 3 archives the working packet, writes the approved canonical scan artifact, and confirms the page.
  - Product-path variants use `research/{slug}/_working/...` and `research/{slug}/...` paths.

### Plan

1. Record task/prompt history.
   - [x] Capture the visible user invocation under `prompts/create-agentic-skill/`.
   - [x] Add active roadmap and todo tracking before implementation.
2. Inspect and archive.
   - [x] Read the four active scan skills and the reference staged research pattern.
   - [x] Run `scripts/skill-archive.sh` for the four scan skill directories.
3. Implement the staged contract.
   - [x] Bump each active scan skill from `version: v0.0` to `version: v0.1`.
   - [x] Add `Report-First Approval Gate`, `Staged Research Workflow`, and `Evidence And Feedback Handling`.
   - [x] Preserve lightweight VARD/ORD scan criteria while moving candidate ranking into approved preliminary packets.
   - [x] Add the standard `## Alignment Page` stub.
   - [x] Add `CHANGELOG.md` entries for v0.1 in each skill directory.
4. Regenerate and verify.
   - [x] Run `node scripts/upgrade-alignment-page.mjs`.
   - [x] Refresh Skills Showcase generated data if active `SKILL.md` behavior/metadata changes require it.
   - [x] Run generated bundle drift, active `type: research` staged-workflow audit, targeted marker scans, archive/changelog checks, and whitespace checks.
5. Ship.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Stage only intended files.
   - [x] Commit and push on `master`.

### Acceptance Criteria

- All four active scan skills include the staged research markers and preliminary packet paths.
- The active `type: research` audit reports 138 active research skills and 0 non-compliant skills.
- Generated `ALIGNMENT-PAGE.md` files exist for all four scan skill directories and pass exact drift check.
- Archive snapshots and changelog entries exist for each bumped skill.
- Recommended next command remains `vard-align` or `ord-align`, but only after final approval and canonical artifact write.

### Completion Notes

- Completed in the VARD/ORD staged scan workflow boundary. Validation covered generated bundle drift, 138 active research skills with 0 staged-workflow non-compliance, target marker/path scans, skill version/archive/dependency/routing hygiene, Skills Showcase data validation, app build, focused alignment-gates layer1 tests, and whitespace.

---

## Historical Implementation - Skillpacks CLI Routing Remediation

### Goal

Migrate active skill install-routing language so users see the published npm CLI paths alongside the existing in-agent and source-checkout routes:

- Pack or individual skill install from a project shell: `npx skillpacks install <pack-or-skill>`.
- Deck install from a project shell: `npx skillpacks install-deck <deck>`.

This roadmap schedules the remediation described in `research/skillpack-cli-routing-audit.md`; it does not perform the skill text migration itself.

### Scope

- Audit basis: `research/skillpack-cli-routing-audit.md`.
- Active skill files scanned by the audit: 383.
- Active skill files needing npm-aware install-routing wording: 220.
- P1 global routing/install files: 14 mirrored Claude/Codex skill contracts.
- Existing routes remain valid and must be preserved where relevant:
  - Claude in-agent route: `/pack install <pack-or-skill>`.
  - Codex in-agent route: `$pack install <pack-or-skill>`.
  - Source-checkout route: `scripts/pack.sh install <pack-or-skill>`.

### Remediation Phases

1. Canonical wording and validation design.
   - [x] Define runner-specific dual-route wording for Claude, Codex, individual skill installs, pack installs, source-checkout maintenance, and deck installs.
   - [x] Decide and implement the focused validation rule that prevents install-route text from omitting `npx skillpacks install` or `npx skillpacks install-deck` unless explicitly allowlisted.
   - [x] Keep `scripts/skill-pack-routing-audit.sh` focused on cross-pack availability guards unless extending it is cleaner than adding a dedicated npm-route check.
2. P1 global routing/install skills.
   - [x] Update the 14 global files listed in the audit: `pack`, `skills`, `init-agentic-skills`, `provision-agentic-config`, `afps-status`, `codebase-status`, and `idea-scope-brief` for both Claude and Codex where present.
   - [x] Preserve runner syntax exactly: Claude gets `/pack ...`; Codex gets `$pack ...`; shell guidance gets `npx skillpacks ...`.
   - [x] Preserve `scripts/pack.sh` where the text is explicitly about source-checkout maintenance.
3. P2 repeated `Pack Availability Guard` boilerplate.
   - [ ] Replace repeated pack-availability guard language across the pack-skill buckets listed in the audit.
   - [ ] Apply the canonical wording consistently across mirrored Claude/Codex pack skills.
   - [ ] Avoid one oversized commit by grouping related pack buckets into reviewable batches.
   - Progress shipped: `agent-work-admin`, top-level `business-discovery`, nested `business-discovery` framework, `business-growth`, `business-ops`, `creator-foundation`, `customer-lifecycle`, `devtool`, `exec-loop`, and compact small workflow (`game`, `guided-walkthrough`, `monorepo`, `ord`) buckets.
   - Next bucket: `product-design` pack bucket.
4. P3 bespoke high-traffic follow-up route sections.
   - [ ] Sweep high-traffic workflow skills with custom follow-up route language: `customer-discovery`, `competitive-analysis`, `journey-map`, `positioning`, `user-flow-map`, `ui-interview`, `ux-variations`, `roadmap`, `plan-phase`, `ship`, and `ship-end`.
   - [ ] Distinguish pack installs from deck installs; use `npx skillpacks install-deck <deck>` only when the desired install unit is a deck.
5. Final validation and shipping.
   - [ ] Run skill version, archive, dependency, routing, and whitespace checks.
   - [ ] Refresh Skills Showcase data if any `SKILL.md` metadata or content changes affect generated showcase surfaces.
   - [ ] Record review notes, task history, and shipping metadata.
   - [ ] Commit and push the intended remediation batches.

### Skill Versioning Requirement

Every remediation batch that changes an active `SKILL.md` must follow the repo skill-versioning rules before commit:

- Archive the current skill version with `scripts/skill-archive.sh <skill-dir>` before editing active content.
- Bump the active `SKILL.md` frontmatter `version` for substantive wording changes.
- Update that skill directory's `CHANGELOG.md` where applicable.
- Keep archive snapshots out of active-skill routing scans unless the validation intentionally audits historical files.

### Acceptance Criteria

- The remediation plan references `research/skillpack-cli-routing-audit.md` and covers all 220 flagged active skills, not only the P1 global files.
- P1, P2, and P3 remediation phases are sequenced, checkable, and small enough for reviewable commits.
- Future implementation preserves `/pack`, `$pack`, and `scripts/pack.sh` source-checkout routes while adding npm CLI alternatives.
- Future implementation distinguishes pack installs from deck installs.
- Focused validation prevents future install-route guidance from regressing to in-agent-only or source-checkout-only wording when the npm CLI route is relevant.

---

## Historical Implementation - Skillpacks CLI Routing Audit

### Goal

Audit all active repo skills for install-routing text that needs to reflect the published `skillpacks` npm CLI install path.

### Plan

1. Inventory active skill files.
   - [x] Enumerate active `SKILL.md` files under `global/` and `packs/`, excluding `archive/**`.
   - [x] Identify install-routing, pack-availability guard, and missing-skill fallback references.
2. Cross-check current npm contract.
   - [x] Confirm current docs define `npx skillpacks install <pack-or-skill>` and `npx skillpacks install-deck <deck>` as the package install routes.
   - [x] Confirm existing source-checkout routes remain valid.
3. Produce audit inventory.
   - [x] Classify core routing skills separately from repeated pack-availability guard updates.
   - [x] Write the findings and remediation order to `research/skillpack-cli-routing-audit.md`.
4. Verify.
   - [x] Run targeted active-skill route scans.
   - [x] Run the existing cross-pack routing audit.

### Acceptance Criteria

- The audit distinguishes current npm CLI routing gaps from cross-pack recommendation gaps.
- The inventory includes active global and pack skills, excluding archived skill snapshots.
- Recommended remediation order identifies the highest-impact skills first.

---

## Historical Implementation - Prompt History Artifact Reconciliation

### Goal

Confirm the pack routing-audit prompt-history artifact is already tracked, then capture the current `$ship` invocation so the repository has no orphaned prompt files.

### Plan

1. Inspect and classify the leftover artifact.
   - [x] Read `prompts/pack/skill-prompt-20260610-195858-skillpack-routing-audit.md`.
   - [x] Confirm it is prompt-history bookkeeping only and contains no obvious secret.
   - [x] Confirm it is already tracked in `7ac9ebc3 docs: audit skillpacks cli routing gaps`.
2. Record this `$ship` invocation.
   - [x] Create the `prompts/ship/` capture for `$ship`.
3. Ship the bookkeeping boundary.
   - [x] Update task/history notes and manifest.
   - [x] Commit and push only prompt/task/history/manifest files.

### Acceptance Criteria

- Prompt-history artifacts are tracked and pushed.
- No source, generated runtime, skill metadata, package, or deploy surface is included.
- Deploy is skipped unless the shipped boundary is deploy-relevant and explicitly authorized.

---

## Historical Implementation - P1/P2 Verification Rerun

### Goal

Rerun the already-shipped P1 docs remediation and P2 Skills Showcase count reconciliation checks from 2026-06-10, fixing only confirmed drift if the rerun finds it.

### Plan

1. Re-verify P1 docs remediation.
   - [x] Capture the visible `$exec p1 and p2 again` invocation.
   - [x] Re-run scoped stale-route, install-wording, publication-wording, historical-label, wrapper, alignment-page, generated-bundle, focused layer1, and whitespace checks.
2. Re-verify P2 count reconciliation.
   - [x] Re-run skill-map generator syntax and regeneration.
   - [x] Re-run scoped stale-count and retired-route scans.
   - [x] Confirm generated count terms still match current generated data.
3. Record and ship.
   - [x] Record the clean rerun in task docs, history, and ship manifest.
   - [x] Leave P1/P2 remediation files unchanged when no drift is found.

### Acceptance Criteria

- P1/P2 rerun validations pass with no confirmed drift.
- Only prompt/task/history/manifest artifacts change for this verification-only rerun.
- Deploy decision is explicit and does not deploy production without confirmation.

---

## Historical Implementation - P1 Docs Remediation Pass

### Goal

Fix the P1 public documentation issues reported by the 2026-06-10 repo documentation alignment audit: managed-copy install wording, the missing root init helper path, retired `icp` executable routes in current guidance, and the old npm strategy page being indexed like current usage guidance.

### Plan

1. Track the remediation request.
   - [x] Capture the visible `exec` invocation in `prompts/exec/`.
   - [x] Add active roadmap and todo entries before substantive edits.
2. Remediate P1 public-doc issues.
   - [x] Update setup/troubleshooting/script docs so track-latest installs are described as managed copies/directories and pinned archives are the symlink case.
   - [x] Add a root `scripts/init-agentic-skills.sh` wrapper that delegates to the bundled `init-agentic-skills` launcher.
   - [x] Replace retired executable `icp` route examples in current docs, specs, and indexed alignment pages with `customer-discovery`, while preserving `enterprise-icp` and `research/icp.md` artifact references.
   - [x] Mark the old npm distribution strategy page and index card as historical/superseded for package usage, with the current walkthrough as the usage reference.
3. Verify and ship.
   - [x] Run targeted drift scans for stale install wording, missing helper path, retired executable routes, and historical npm page labeling.
   - [x] Run alignment-page audit, root wrapper smoke checks, and whitespace checks.
   - [x] Record review notes, update history, commit, and push intended remediation artifacts only.

### Acceptance Criteria

- The documented root helper path exists and supports the documented subcommands.
- Current public docs no longer describe active track-latest installs as symlinks.
- Current route guidance points to `customer-discovery` instead of retired executable `icp`, except for intentional artifact references such as `research/icp.md` and separate skills such as `enterprise-icp`.
- The old npm strategy page is still preserved but clearly marked historical/superseded for package usage in both the page and index.
- Validation output is recorded with warnings fixed, explicitly accepted, or reported.

---

## Historical Implementation - P2 Skills Showcase Count Reconciliation

### Goal

Resolve the remaining P2 documentation drift from the 2026-06-10 docs audit: Skills Showcase planning docs and alignment pages still mix old 157/156/38 display-card counts with current generated inventory counts.

### Plan

1. Reconcile remaining P2 Skills Showcase count docs.
   - [x] Define count terms from generated data: platform entries, unique mirrored skills, unique pack skills, unique global skills, active packs, and display cards.
   - [x] Update stale count references in current Skills Showcase docs and indexed alignment pages, including `tasks/pack-card-hierarchy.md`, `alignment/skillmap.html`, `apps/skills-showcase/docs/deck-builder-ux.md`, `research/skills-showcase/idea-brief.md`, `research/skills-showcase/idea-brief-interview.md`, and `alignment/idea-scope-brief-skills-showcase.html` as confirmed by fresh scans.
   - [x] Preserve historical counts only when explicitly labeled historical/prototype scope.
   - [x] Run generated-data parsing, alignment-page audit, targeted count scans, and whitespace checks.
   - [x] Record review notes, update history, commit, and push intended changes only.

### Acceptance Criteria

- Current count-bearing docs distinguish generated platform entries from unique mirrored skills, unique pack skills, unique global skills, packs, and any historical display-card scope.
- Targeted scans no longer find unlabeled stale `157`, `156 pack skills`, or `38 packs` claims in current Skills Showcase docs/pages.
- Alignment-page validation and whitespace checks pass.

---

## Historical Implementation - Repo Documentation Alignment Audit

### Goal

Audit the repository's documentation surfaces for inconsistencies across workflow rules, skill packaging, npm usage, deck/pack naming, alignment-page conventions, generated artifacts, and project tracking docs.

### Plan

1. Track the audit request.
   - [x] Capture the visible `devtool-docs-audit` invocation in `prompts/devtool-docs-audit/`.
   - [x] Add active roadmap and todo entries before substantive audit work.
2. Inventory documentation surfaces.
   - [x] Enumerate Markdown, HTML alignment, package docs, skill docs, prompt/task docs, and generated docs that should be checked.
   - [x] Identify canonical sources versus generated or historical artifacts to avoid false positives.
3. Cross-check likely drift vectors.
   - [x] Compare CLI command names and npm/package usage across root docs, package docs, skill docs, and alignment pages.
   - [x] Compare deck/pack names and counts across docs, manifests, generated maps, and package tests.
   - [x] Compare alignment-page convention requirements across canonical docs, generated bundles, active HTML pages, and audit scripts.
   - [x] Compare workflow/git/shipping instructions across `AGENTS.md`, `CLAUDE.md`, and repo docs.
4. Produce audit artifacts.
   - [x] Write findings-first documentation audit output.
   - [x] Build a `review` alignment page with evidence matrix, assumptions, gaps, and approval/feedback controls.
   - [x] Update the central alignment index and task review notes.
5. Verify and ship intended work.
   - [x] Run relevant documentation and alignment validators.
   - [x] Run whitespace checks and review the diff.
   - [x] Commit and push intended audit artifacts without staging unrelated pre-existing work.

### Audit Summary

- Found no P0 documentation failure.
- P1 issues: active install docs still use symlink wording; `scripts/init-agentic-skills.sh` is documented but missing at the root; retired `icp` route references remain in current docs and indexed alignment pages; the older npm strategy page remains indexed like current guidance despite stale package examples.
- P2 issues: npm docs still include future/release-candidate wording after `skillpacks@0.1.0` publication; Skills Showcase count docs conflict with current generated data.
- Deliverables: `research/devtool-docs-audit.md`, `alignment/devtool-docs-audit-documentation-alignment.html`, and an updated `alignment/index.html` entry.
- Shipped in commit `73c828b6` on `master`; follow-up task-state cleanup recorded after push.

---

## Historical Implementation - Skillpacks npm Package Walkthrough Alignment Page

### Goal

Create a current document-tier alignment page that explains how to use the published `skillpacks` npm package today, while leaving the existing npm distribution strategy page as historical strategy context.

### Plan

1. Track the active work.
   - [x] Add the active roadmap and todo entries before implementation.
2. Add the walkthrough page.
   - [x] Create `alignment/skillpacks-npm-package-walkthrough.html` with confirmed status, document-tier metadata, responsive viewport, TTS include, and current `skillpacks@0.1.0` / `latest` package status.
   - [x] Cover prerequisites, first-use flow, generated files, remove/update flow, versioning, published-package verification, and troubleshooting.
   - [x] Link to the current Markdown docs for deeper reference.
3. Update the central index.
   - [x] Add a dated Product Design & Spec card for the walkthrough page.
   - [x] Keep index counts and metadata consistent with the existing card format.
4. Verify and ship.
   - [x] Run `node scripts/audit-alignment-pages.mjs`.
   - [x] Run `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts`.
   - [x] Run `git diff --check`.
   - [x] Spot-check command examples and package-version wording.
   - [x] Record review notes, commit, and push intended changes.

---

## Historical Implementation - Published Skillpacks npm Smoke Script

### Goal

Capture the manual `npx --package skillpacks@latest -- skillpacks ...` verification into a repeatable repo script that checks published-package install, remove, doctor, pin, and unpin behavior from isolated `/tmp` projects without using the local checkout as the CLI source.

### Plan

1. Add a package-owned smoke script.
   - [x] Create a reusable script under `packages/skillpacks/scripts/`.
   - [x] Resolve the published package through `npx --package skillpacks@latest`.
   - [x] Use `/tmp/skillpacks-npm-cache` by default and isolated `mktemp` project directories.
2. Cover the manual verification matrix.
   - [x] Assert npm metadata against the package name/version/license.
   - [x] Verify `list`, pack install, individual skill install, deck install, and `doctor`.
   - [x] Verify pack, individual skill, and deck-backed pack removal.
   - [x] Verify skill-level pin to `v0.0`, unpin back to latest, and unsupported direct `install name@version` syntax.
3. Wire and validate.
   - [x] Add npm script entry points for package and root invocation.
   - [x] Run the new script against the published npm package.
   - [x] Run focused package tests and whitespace checks.
   - [x] Commit and push intended changes.

### Acceptance Criteria

- The script fails on any missing generated `.agents/project.json`, `.claude/skills/*/SKILL.md`, `.codex/skills/*/SKILL.md`, expected metadata, removal cleanup, or pin/unpin regression.
- The script uses only `/tmp` temp projects and does not modify the local checkout except for tracked script/task/package metadata edits.
- Temp directories are kept by default and printed for inspection.

## Historical Implementation - Alignment Diff Highlighting Convention

### Goal

Clarify the shared alignment-page convention so any update to an existing HTML alignment page visibly highlights the changed content in the rendered page, making it obvious that the page was amended from a prior version.

### Plan

1. Update the canonical convention.
   - [x] Revise `docs/alignment-page-convention.md` inside the `alignment-convention` markers.
   - [x] Make clear that change indicators must be visible in the HTML itself.
   - [x] Define acceptable treatments such as inline badges, highlighted blocks, or side-by-side before/after sections.
2. Regenerate bundled docs.
   - [x] Preview bundle changes with `node scripts/upgrade-alignment-page.mjs --dry-run`.
   - [x] Regenerate bundled `ALIGNMENT-PAGE.md` files from the canonical source.
   - [x] Confirm generated bundles are exact with `node scripts/upgrade-alignment-page.mjs --check`.
3. Verify and ship.
   - [x] Run whitespace/diff checks and focused convention verification.
   - [x] Review the diff for unintended generated drift.
   - [x] Commit and push the intended changes only.

---

## Historical Implementation - Alignment Pages Game AFPS Refresh

### Goal

Archive stale active alignment pages that still frame the workflow model as the old four-pipeline/four-deck matrix, then replace the active pages with Game AFPS-aware versions while preserving stable links, page-specific gates, metadata, and TTS behavior.

### Plan

1. Preserve the old active artifacts.
   - [x] Archive `alignment/workflow-design-three-pipelines.html`.
   - [x] Archive `alignment/idea-scope-brief-npm-distribution.html`.
   - [x] Archive `alignment/idea-scope-brief-skills-showcase.html`.
2. Refresh active alignment pages.
   - [x] Update the workflow-design page to the five-deck model: VARD, ORD, Business AFPS, Devtool AFPS, and Game AFPS.
   - [x] Update the npm distribution page's deck-installation section and gate to include Game AFPS.
   - [x] Update the Skills Showcase deck-builder page to use five canonical decks.
   - [x] Add visible amendment notes to the three active pages.
3. Refresh index and task documentation.
   - [x] Update `alignment/index.html` title/search metadata for the amended pages.
   - [x] Record archive paths and replacement rationale in task history.
4. Verify and ship.
   - [x] Verify every active page has a matching archive copy.
   - [x] Scan changed pages for preserved titles/context, decisions, gates, assumptions, proposed file changes, and TTS script.
   - [x] Run stale deck wording scans and `git diff --check`.
   - [x] Commit and push intended changes only.

---

## Historical Implementation - Game AFPS Deck Model

### Goal

Add `game-afps` as a first-class deliberate deck over the existing `game` pack, so docs, install-deck manifest metadata, and skill-map visuals no longer treat game work as a Business AFPS sub-row.

### Plan

1. Update canonical deck docs and workflow docs.
   - [x] Add Game AFPS to `docs/decks.md`.
   - [x] Add Game AFPS to `docs/skillpacks-npm-distribution.md`.
   - [x] Update live Skills Showcase research references from four decks to five decks.
2. Update package metadata.
   - [x] Add `game-afps` to `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.
   - [x] Add a package test that asserts Game AFPS resolves to the `game` pack and carries the right registry tags.
3. Regenerate derived artifacts.
   - [x] Regenerate `packages/skillpacks/dist/skillpacks-manifest.json`.
   - [x] Regenerate package build docs/manifest if `build:check` requires it.
   - [x] Regenerate skill-map artifacts after moving `game` into its own Game AFPS row.
4. Verify and ship.
   - [x] Run package tests and manifest/build checks.
   - [x] Run whitespace checks and review the diff.
   - [x] Commit and push the intended changes.

## Historical Implementation - Skillpacks npm Distribution Phase 3

### Goal

Reduce the `skillpacks` npm package's dependency on bash/jq by porting deterministic project-config behavior to Node first, then keeping the remaining install/link/drift commands on the tested `pack.sh` fallback until parity is implemented in later steps.

### Phase 3 Plan

1. Node project config parity.
   - [x] Add package-owned Node helpers for `.agents/project.json` reads and writes.
   - [x] Route `list-packs`, `status`, `set-mode`, and `set-update-mode` through Node without requiring `bash` or `jq`.
   - [x] Preserve unrelated project config fields on writes.
   - [x] Add package-owned tests that run with `PATH` emptied to prove no shell/JQ dependency.
2. Pack normalization and alias parity.
   - [x] Port pack alias normalization and hibernated-pack diagnostics.
   - [x] Keep `pack.sh` and Node command output aligned for supported aliases.
3. Install/remove/refresh parity.
   - [x] Port pack and individual skill install/remove/refresh logic.
   - [x] Preserve `.agentic-skills-managed` marker creation and content hash behavior.
4. Locking and drift parity.
   - [x] Port `.agents/.pack.lock` handling.
   - [x] Port `doctor`, `pin`, `unpin`, and `prune`.
5. Compatibility closure.
   - [x] Keep `scripts/pack.sh` as a wrapper or tested fallback.
   - [x] Run temp-repo parity tests against Node and bash paths before removing any fallback dependency.

### Current Step

- [x] Step 3.1: Node Project Config Parity.
- [x] Step 3.2: Pack Normalization And Alias Parity.
- [x] Step 3.3: Install/Remove/Refresh Parity.
- [x] Step 3.4: Locking And Drift Parity.
- [x] Step 3.5: Compatibility Closure.

## Historical Implementation - Skillpacks npm Distribution Phase 4

### Goal

Prepare the `skillpacks` npm package for a dry-run release by tightening package-included documentation and verification without publishing to npm or changing the existing git-checkout setup path.

### Phase 4 Plan

1. Documentation readiness.
   - [x] Update package-included docs with npm usage and git-checkout usage.
   - [x] Add migration guidance for users moving from a local clone to `npx skillpacks`.
   - [x] Add troubleshooting for npm package semver vs skill-level pinning.
   - [x] Preserve explicit "no real publish in Phase 4" language.
2. Documentation contracts.
   - [x] Add or extend package-owned tests that pin the release-readiness documentation language.
   - [x] Keep command ownership/dependency docs aligned with the CLI compatibility matrix.
3. Dry-run release checks.
   - [x] Run package staging and tarball dry-run inspection.
   - [x] Run `npm publish --dry-run` locally without publishing.
   - [x] Record dry-run output in the ship manifest.
4. Ship.
   - [x] Run package docs tests, package staging checks, dry-run release checks, and whitespace checks.
   - [x] Update review notes and history.
   - [x] Commit and push intended Phase 4 changes only.

### Current Step

- [x] Step 4.1: Documentation readiness.
- [x] Step 4.2: Documentation contracts.
- [x] Step 4.3: Dry-run release checks.
- [x] Step 4.4: Ship.

## Historical Implementation - Skillpacks npm Distribution Phase 5

### Goal

Publish the first stable public `skillpacks` npm package after release validation, then verify the published package can be used from a fresh project without cloning this repository.

### Phase 5 Plan

1. Release preflight.
   - [x] Run package tests and package staging checks.
   - [x] Inspect the staged tarball boundary and denied paths.
   - [x] Re-check npm registry state for `skillpacks`.
   - [x] Run whitespace checks.
   - [x] Fix MIT license metadata, npm repository links, staged package metadata, and package metadata coverage.
2. External publish gate.
   - [x] Confirm the exact publish boundary: `skillpacks@0.1.0`, public access, MIT metadata, npm links, and `packages/skillpacks/build` as the publish root.
   - [x] Run `npm publish --access public` only after explicit confirmation.
3. Published-package verification.
   - [x] Verify `npx skillpacks@latest list` against npm.
   - [x] In a fresh temp project, install one pack, one individual skill, and one deck from the published package.
   - [x] Verify the git-checkout install path remains functional.
4. Ship.
   - [x] Record release evidence in a ship manifest.
   - [x] Update review notes and history.
   - [x] Commit and push intended Phase 5 changes only.

### Current Step

- [x] Step 5.1: Release preflight.
- [x] Step 5.1b: MIT metadata prepublish fix.
- [x] Step 5.2: External publish gate after metadata validation.
- [x] Step 5.3: Public npm publish.
- [x] Step 5.4: Published-package verification.
- [x] Step 5.5: Commit and push post-publish evidence.

---

## Historical Implementation - Dated Alignment Index Entries

### Goal

Require central alignment index entries to carry dated metadata from each page's alignment review/confirmation date, then regenerate bundled per-skill alignment convention docs from the canonical source.

### Plan

1. Update the canonical convention.
   - [x] Revise `docs/alignment-page-convention.md` inside the `alignment-convention` markers.
   - [x] Require `YYYY-MM-DD` dates in muted meta spans after index links.
   - [x] Preserve existing entry dates and define how to fill missing dates.
   - [x] Clarify `new` marker behavior with dated meta text.
2. Regenerate and verify bundled docs.
   - [x] Preview bundle changes with `node scripts/upgrade-alignment-page.mjs --dry-run`.
   - [x] Regenerate bundled `ALIGNMENT-PAGE.md` files.
   - [x] Re-run dry-run and confirm no pending updates.
3. Ship.
   - [x] Review generated diff and run whitespace checks.
   - [x] Commit the convention and regenerated files together.

## Historical Implementation - Research Scope Approval Before Alignment Research

### Goal

Ensure active research-producing skill flows do not synthesize research before the user approves the alignment page's research scope. The scope is active `global/` and `packs/` source skills only, excluding archive snapshots, generated installed copies, and hibernated packs.

### Plan

1. Preserve context and audit the affected surface.
   - [x] Capture prompt history for the active skill update.
   - [x] Confirm repository context and working-tree state.
   - [x] Re-read the shared alignment-page convention, existing tests, and active affected skill list.
2. Implement the contract change.
   - [x] Update `docs/alignment-page-convention.md` so Stage 1 is minimal scope discovery, not synthesized research.
   - [x] Regenerate bundled `ALIGNMENT-PAGE.md` files from the canonical convention.
   - [x] Patch active `SKILL.md` report-first and staged-research wording to require scope approval before synthesized research.
3. Preserve skill version history.
   - [x] Archive changed active `SKILL.md` files before version bumps.
   - [x] Bump changed skill versions and update each skill `CHANGELOG.md`.
   - [x] Add a lesson preventing research synthesis before alignment-scope approval.
4. Validate and ship.
   - [x] Update focused layer1 tests for scope-approval-before-research behavior.
   - [x] Refresh generated showcase data if required by skill metadata changes.
   - [x] Run the requested generator, test, version, archive, dependency, showcase, and diff checks.
   - [ ] Commit and push the intended changes only.

## Historical Implementation - YouTube Prelaunch Audit Skill

### Goal

Create a mirrored `youtube-ops` pack skill for auditing unlisted pre-release YouTube videos before launch. The skill should decide whether a video needs further editing or polish and produce launch-readiness recommendations for title, thumbnail, description, chapters, social cross-sharing, and publish strategy.

### Plan

1. Preserve invocation context and inspect overlap.
   - [x] Capture prompt history for the active skill-building workflows.
   - [x] Locate the existing `youtube-video-audit` skill and confirm its post-release performance-audit scope.
   - [x] Compare related YouTube pack skills for routing and naming overlap.
2. Implement the pack skill.
   - [x] Create mirrored Codex and Claude `youtube-video-prelaunch-audit` skill directories in `packs/youtube-ops/`.
   - [x] Reuse the existing YouTube research-stage, feedback, alignment, handoff, and pack-availability conventions.
   - [x] Update `PACK.md`, the YouTube router if needed, and benchmark coverage fixtures.
3. Validate and ship.
   - [x] Run focused skill metadata and route checks.
   - [x] Run benchmark coverage validation and focused layer1 setup tests.
   - [x] Refresh Skills Showcase data if required by changed skill metadata.
   - [x] Update review notes, commit, and push intended changes only.

## Current Investigation - ALIGNMENT-PAGE Bundling Drift

### Goal

Investigate why per-skill `ALIGNMENT-PAGE.md` bundles drift from the shared alignment-page convention, determine whether bundling can be consolidated, and propose a fix plan without implementing source changes until approved.

### Findings

1. The canonical convention is `docs/alignment-page-convention.md` between the `alignment-convention` markers. `scripts/upgrade-alignment-page.mjs` renders that block into sibling `ALIGNMENT-PAGE.md` files for alignment-producing skills, substituting `{skill-name}` and injecting skill-specific gates, visual tier, and glossary gates.
2. The current generator is not a pure path-substitution renderer. After normalizing the output path/header slug, active `global/` and `packs/` bundles still produce 133 unique variants across 260 active `ALIGNMENT-PAGE.md` files because generated skill-specific gates are embedded in the files.
3. The generator dry-run reports no generated drift, but a direct path audit found one current stale bundle: `packs/business-discovery/codex/customer-discovery/ALIGNMENT-PAGE.md` still says `icp` and uses `alignment/icp-{topic}.html`, while the skill now outputs `alignment/customer-discovery-{topic}.html`.
4. That stale bundle is missed because `packs/business-discovery/codex/customer-discovery/SKILL.md` has a bespoke `## Alignment Page` paragraph. The generator only treats two exact section-opening patterns as ownable, so a sibling bundle can exist and remain stale while dry-run still passes.
5. The retrospective claim that positioning had a separate pre-standard local-compile template is not supported as stated by current git history. Positioning has generated positioning-specific gates, but local per-section compile controls appear to have landed with the shared convention change rather than in an independently maintained positioning template.
6. The "no skill invoked" gap is real. `upgrade-alignment-pages` can audit or upgrade existing HTML pages when explicitly invoked, but no hook or root instruction currently forces direct edits of `alignment/*.html` to consult the current convention.

### Recommendation

Keep per-skill bundles for the near-term because single-skill installs copy individual skill directories and need the load-on-demand convention to travel with the skill. Do not fully eliminate `ALIGNMENT-PAGE.md` copies until the installer/runtime has a shared-resource mechanism that also works for single-skill installs outside this repo.

Consolidate by making the repo source of truth stricter instead of relying on silent regenerated copies:

1. Treat generated `ALIGNMENT-PAGE.md` files as rendered artifacts owned by `scripts/upgrade-alignment-page.mjs`, and make drift checks fail when a sibling bundle is not generator-owned.
2. Move toward a thinner generated wrapper where possible: the shared convention stays in `docs/alignment-page-convention.md`, while skill-specific exceptions are centralized as generator metadata instead of hand-maintained text.
3. Convert or explicitly register bespoke alignment sections so they are either generated from the same convention or covered by dedicated tests.

### Implementation Plan

1. Fix the known stale bundle path by making the Codex `customer-discovery` alignment section generator-ownable and regenerating its `ALIGNMENT-PAGE.md`.
2. Harden `scripts/upgrade-alignment-page.mjs` so an active skill cannot have a sibling `ALIGNMENT-PAGE.md` while being silently classified as bespoke. The script should either own and refresh it or fail with a clear diagnostic.
3. Add a path-consistency validator: every active generated `ALIGNMENT-PAGE.md` must use the containing skill directory name in `alignment/{skill-name}-{topic}.html`.
4. Add a variant/drift validator that compares every generated bundle with the generator's expected render, after the allowed path/header substitution and centralized skill metadata.
5. Audit the 15 current bespoke `## Alignment Page` sections. Convert them to generated stubs where they are ordinary alignment producers; otherwise add an explicit allowlist plus tests for the local and bottom feedback controls.
6. Address direct-edit non-conformance by adding an HTML alignment-page audit command or extending `upgrade-alignment-pages` with a scriptable check mode, then reference that check from root instructions for direct `alignment/*.html` edits.

### Verification Plan

1. `node scripts/upgrade-alignment-page.mjs`
2. `node scripts/upgrade-alignment-page.mjs --dry-run`
3. New path/variant audit command added by the implementation.
4. Targeted layer1 tests for alignment gates, positioning alignment contract, and upgrade-alignment-pages behavior.
5. `git diff --check`

### Approval Gate

No source fix has been implemented yet. Proceed only after approval of this plan.

## Historical Implementation - Separate Skills Showcase From Skillpacks Package

### Goal

Keep one git repository while separating the public Skills Showcase app from the publishable `skillpacks` npm package. `global/` and `packs/` remain the canonical skill sources, with a shared internal catalog layer used by both consumers.

### Execution Profile

- Parallel mode: serial
- Rationale: workspace metadata, package staging, generator paths, and verification boundaries all share repository-level paths and should be integrated in one lane.

### Plan

1. Workspace setup.
   - [x] Rewrite the root `package.json` as private workspace metadata for `agentic-skills`.
   - [x] Add workspace recognition for `apps/skills-showcase` and `packages/skillpacks`.
   - [x] Keep existing `pnpm --dir apps/skills-showcase ...` commands working during the transition.
2. Package relocation.
   - [x] Move the `skillpacks` CLI and source code under `packages/skillpacks/`.
   - [x] Add `packages/skillpacks/package.json` with the publishable package metadata.
   - [x] Add a package build script that stages only package-owned code, canonical skill sources, required install scripts, and selected docs into `packages/skillpacks/build/`.
   - [x] Make source-checkout CLI execution and staged package execution both resolve `pack.sh` and `init.sh` correctly.
3. Website relocation.
   - [x] Move Skills Showcase data generators and validator under `apps/skills-showcase/scripts/`.
   - [x] Keep generated outputs under `apps/skills-showcase/public/assets/`, the temporary `docs/skills-showcase/assets/` mirror, and the website-owned benchmark matrix.
   - [x] Update commands, comments, and documentation to identify these files as website-owned.
4. Shared catalog extraction.
   - [x] Add `scripts/catalog/*.mjs` helpers for frontmatter parsing, pack/skill scanning, archive discovery, benchmark report discovery, and content hashing.
   - [x] Update the website generators and package staging script to read through this internal catalog layer.
   - [x] Keep the catalog layer read-only.
5. Verification and shipping.
   - [ ] Add package boundary checks so package verification does not mutate website-owned generated assets.
   - [ ] Run package, website, repository integrity, boundary, and tarball exclusion checks.
   - [ ] Record review notes in `tasks/todo.md` and history, then commit and push intended changes.

## Historical Implementation - Skillpacks npm Distribution Phase 2

### Goal

Add generated package metadata that makes deck installation COA B/C-shaped: a manifest with pack, skill, and deck metadata; a manifest validator; `skillpacks list --json`; and `skillpacks install-deck <deck>` materialized through the current monolith backend.

### Execution Profile

- Parallel mode: serial
- Rationale: manifest generation, CLI behavior, and package boundary validation share the same files and should be integrated in one lane.

### Plan

1. Manifest generator.
   - [x] Add `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.
   - [x] Generate `packages/skillpacks/dist/skillpacks-manifest.json` from `global/`, `packs/`, `PACK.md`, and `SKILL.md` frontmatter.
   - [x] Include pack names, skill names, tools, versions, content hashes, archive versions, source paths, and status.
   - [x] Include deck metadata for `vard`, `ord`, `business-afps`, and `devtool-afps` with package-list and registry-tag fields.
2. CLI integration.
   - [x] Include `packages/skillpacks/dist/skillpacks-manifest.json` in the package allowlist.
   - [x] Add `skillpacks list --json` using the manifest.
   - [x] Add `skillpacks install-deck <deck>` and `skillpacks install-deck business-afps --full`.
   - [x] Preserve `pack.sh` forwarding for all existing commands.
3. Validation.
   - [x] Add manifest `--check` validation for existing paths, version fields, deck pack references, package-list fields, and registry-tag fields.
   - [x] Add targeted executable checks for manifest generation and deck install resolution.
   - [x] Run package dry-run and temp consumer install checks.
   - [x] Avoid skill/pack catalog generated-data changes when tracked `SKILL.md` / `PACK.md` metadata does not change.

## Historical Implementation - Skillpacks npm Distribution Phase 0/1

### Goal

Make the first npm distribution artifact real without publishing: add root package metadata, add a thin `skillpacks` CLI wrapper over existing install scripts, prove it works locally and in a temp consumer project, and verify the npm tarball boundary.

### Execution Profile

- Parallel mode: serial
- Rationale: package metadata, CLI wrapper, task docs, and verification all share the same shipping boundary; parallel write lanes would add coordination cost without reducing risk.

### Plan

1. Preserve invocation and active task state.
   - [x] Capture the visible `exec` invocation under `prompts/exec/`.
   - [x] Inspect the approved npm distribution design and existing script contracts.
   - [x] Record the active implementation phase in `tasks/todo.md`.
2. Phase 0 preflight.
   - [x] Re-check safe npm registry/account information for `skillpacks` without publishing.
   - [x] Confirm license/package metadata choice based on repository files.
   - [x] Document that real `npm publish` is out of scope for this pass.
3. Phase 1 implementation.
   - [x] Add root `package.json` for `skillpacks`.
   - [x] Add `bin/skillpacks.mjs`.
   - [x] Add `src/cli/run-pack-script.mjs` or equivalent dispatcher.
   - [x] Forward current `pack.sh` commands while preserving consumer project `cwd`.
   - [x] Implement `init-global` by invoking packaged `init.sh`.
   - [x] Add dependency checks for `bash` and write-command `jq`.
4. Verification and ship.
   - [x] Verify `node bin/skillpacks.mjs list`.
   - [x] Verify temp consumer repo install/status/doctor behavior.
   - [x] Run `npm pack --dry-run`.
   - [x] Run targeted existing repository checks appropriate for package metadata.
   - [x] Update review notes, history, commit, and push intended changes.

## Current Revision — Skillpacks Deck Metadata Approval

### Goal

Update the already-shipped `skillpacks` npm distribution design to honor the newer deck-installation approval: overall strategy still starts with COA A, but deck installation should be shaped by COA B/C package-list and registry-tag semantics.

### Plan

1. Preserve invocation context.
   - [x] Capture the visible `idea-scope-brief` approval YAML under `prompts/idea-scope-brief/`.
   - [x] Compare the new approval against the previously shipped roadmap prompt.
2. Revise the design artifact.
   - [x] Update `docs/skillpacks-npm-distribution.md` so deck installation is modeled as manifest metadata, not opaque monolith presets.
   - [x] Keep COA A as the first package transport while making `install-deck` a resolver over COA B/C-compatible metadata.
   - [x] Update the live deck documentation sentence that referenced npm install presets.
3. Track and verify.
   - [x] Record current-phase work in `tasks/todo.md`.
   - [x] Verify the design doc contains the revised deck approval, manifest resolver, package-list fields, and registry-tag fields.
   - [x] Run `git diff --check`.

## Current Revision — Skillpacks npm Distribution Design

### Goal

Turn the approved npm-distribution alignment decision into a detailed design doc and implementation roadmap for `skillpacks`, without starting package implementation in this pass.

### Plan

1. Preserve invocation context and approval inputs.
   - [x] Capture the visible `idea-scope-brief` approval YAML under `prompts/idea-scope-brief/`.
   - [x] Read the approved alignment page and gate answers.
   - [x] Inspect existing pack, deck, install, and versioning docs.
2. Produce the design artifact.
   - [x] Write `docs/skillpacks-npm-distribution.md`.
   - [x] Preserve approved decisions: `skillpacks`, hybrid COA A first, skill-level pinning, deck presets first.
   - [x] Add current npm registry preflight findings for `skillpacks` and `agentic-skills`.
3. Track the implementation route.
   - [x] Record current-phase work and review notes in `tasks/todo.md`.
   - [x] Verify the doc contains the approved decisions, phase roadmap, and no implementation drift.
4. Ship.
   - [x] Run targeted verification and `git diff --check`.
   - [x] Commit and push intended changes only, leaving unrelated worktree changes untouched.

## Current Revision — npm Distribution Deck Installation Gate

### Goal

Revise `alignment/idea-scope-brief-npm-distribution.html` so deck-based installation is part of the active review surface and has an explicit approval gate before final YAML compilation.

### Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `investigate` invocation under `prompts/investigate/`.
   - [x] Validate the user claim against the alignment page and recent deck documentation.
   - [x] Record validation and review results in `tasks/todo.md`.
2. Apply the minimal alignment-page fix.
   - [x] Move the deck-based installation section before the review gates so it is part of the reviewed body.
   - [x] Add a required deck-installation approval gate covering COA A/B/C behavior.
   - [x] Refresh page/index metadata only where needed.
   - [x] Add a lesson for future addenda that introduce new decisions.
3. Verify and ship.
   - [x] Run targeted string/structure checks and `git diff --check`.
   - [x] Confirm the compiled gate list includes the new deck-installation gate.
   - [x] Commit and push the intended tracked changes while leaving unrelated work untouched.

## Current Revision — Workflow Design Alignment Chart Clipping

### Goal

Revise `alignment/workflow-design-three-pipelines.html` so the rapid pipeline graduation routing chart in the Graduation Path section is fully visible and not cut off on the right side.

### Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `investigate` invocation under `prompts/investigate/`.
   - [x] Capture the visible Browser verification invocation under `prompts/browser/`.
   - [x] Capture the visible Computer Use verification invocation under `prompts/computer-use/`.
   - [x] Record the revision plan in `tasks/roadmap.md` and `tasks/todo.md`.
2. Investigate the layout bug.
   - [x] Inspect the Graduation Path chart markup and CSS.
   - [x] Reproduce or confirm the right-edge clipping at relevant viewport widths.
   - [x] Identify the root cause and affected layout rules.
3. Apply the minimal layout fix.
   - [x] Update only the alignment page styles/markup needed to keep the chart within the viewport.
   - [x] Add a lesson preventing future alignment-page chart clipping.
4. Verify and ship.
   - [x] Run targeted static checks and `git diff --check`.
   - [x] Verify the alignment page visually in the browser.
   - [x] Add review notes to `tasks/todo.md`.
   - [x] Commit and push the intended tracked changes.

## Current Audit — Documentation Freshness And Cleanup

### Goal

Audit repository documentation for freshness, duplicated or superseded guidance, archive candidates, and cleanup priorities. Produce a durable docs-audit report and alignment page before making any broad documentation changes.

### Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `devtool-docs-audit` invocation under `prompts/devtool-docs-audit/`.
   - [x] Record the audit plan in `tasks/roadmap.md` and `tasks/todo.md`.
2. Inventory documentation surfaces.
   - [x] List tracked Markdown/HTML/docs artifacts across root docs, research, specs, alignment, tasks, benchmark, and pack/global skill docs.
   - [x] Separate active operating docs from generated artifacts, prompt history, archives, and historical reports.
3. Validate freshness against current repo behavior.
   - [x] Check README/AGENTS/setup docs against current scripts, pack commands, init flow, and skill layout.
   - [x] Check canonical workflow/routing docs against active skill contracts and recent rename/routing work.
   - [x] Check docs that mention missing or moved paths, stale commands, retired skill names, or generated-file conventions.
4. Classify cleanup work.
   - [x] Mark docs as current, needs update, duplicate/superseded, generated/local-only, or archive candidate.
   - [x] Identify minimal high-confidence cleanup actions and larger follow-up remediation work.
5. Produce and verify deliverables.
   - [x] Write `research/devtool-docs-audit.md` findings-first.
   - [x] Build `alignment/devtool-docs-audit-docs-freshness.html`.
   - [x] Add review notes to `tasks/todo.md`.
   - [x] Run targeted verification commands and `git diff --check`.

## Historical Implementation — Add Scriptability Findings To Alignment Pages

### Goal

Amend the existing alignment pages for pack install issues, downstream skill inventory, and plain-text skill opportunities with the 2026-06-07 scriptability follow-up findings. Preserve the original conclusions, archive every edited page first, refresh the local central alignment index, and verify the bundled alignment-page convention remains unchanged.

### Plan

1. Confirm the current repository state and relevant conventions.
   - [x] Check working tree cleanliness and tracked alignment pages.
   - [x] Inspect the three target alignment pages and `compile-central-alignment` contract.
   - [x] Confirm `alignment/index.html` is untracked and should remain a local convenience artifact.
2. Archive existing HTML pages.
   - [x] Copy each target page to `docs/history/archive/2026-06-07/180623/alignment/` before editing.
3. Amend existing alignment pages only.
   - [x] Add the pack-install script surface follow-up covering `pack.sh`, no-hot-reload/install visibility guidance, downstream/manual runnable readiness, and the `scripts/init-agentic-skills.sh` path mismatch.
   - [x] Add the downstream portability addendum covering macOS stock Bash compatibility and Bash 3.2 failures in inventory scripts.
   - [x] Add the plain-text clarification that deterministic repeatable primitives should become scripts or script-backed utilities, with `compile-central-alignment` as the primary extraction candidate.
   - [x] Leave `alignment/skills-inventory.html` untouched as a generated/static catalog.
4. Maintain alignment index locally.
   - [x] Regenerate or verify `alignment/index.html` locally and keep it untracked unless repo convention forces otherwise.
5. Verify and ship.
   - [x] Run `git diff --check`.
   - [x] Verify each edited page contains its dated addendum and required key findings.
   - [x] Run `node scripts/upgrade-alignment-page.mjs --dry-run`.
   - [x] Verify archive snapshots exist for all three edited pages.

## Current Investigation — Skills That Should Be Scripts

### Goal

Validate whether the "Skills That Should Be Scripts" research matches the repository evidence, classify which claims are confirmed versus overstated, and identify the root problem behind script-shaped skills.

### 2026-06-06 Follow-up Scope

Re-verify the script-shaped skill opportunity with current repo evidence, focusing on downstream/manual script readiness, alignment-page maintenance, and deterministic skill surfaces. Do not implement opportunities in this pass.

### Plan

1. Capture the visible `investigate` invocation and task checklist.
2. Inventory `scripts/` and validate the reported standalone-tool claims.
3. Inspect named skill contracts for pure delegation, static insertion, deterministic orchestration, or real LLM judgment.
4. Compare the `pack` skill and `pack.sh` specifically because it is the strongest example.
5. Report confirmed claims, corrections, portability risks, and the practical recommendation without changing skill behavior.

## Active Plan — Add `user-flow-map` And Refactor AFPS Routing

### Goal

Add a mirrored `product-design` planning skill named `user-flow-map` and make AFPS route from positioning into concrete user-flow structure before UI requirements, layout variants, prototypes, UAT, consolidation, production specs, and roadmap work.

### Execution Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `targeted-skill-builder` invocation under `prompts/targeted-skill-builder/`.
   - [x] Record implementation progress and validation results in `tasks/todo.md`.
2. Inspect current routing and overlap.
   - [x] Check whether any existing skill already owns user-flow mapping.
   - [x] Read product-design skill conventions, routing docs, research-roadmap rules, alignment generator, and benchmark coverage patterns.
3. Create the new skill mirrors.
   - [x] Add `packs/product-design/codex/user-flow-map/` and `packs/product-design/claude/user-flow-map/`.
   - [x] Include `SKILL.md`, `CHANGELOG.md`, `agents/openai.yaml`, and generated `ALIGNMENT-PAGE.md` for both mirrors.
   - [x] Ensure the skill outputs `specs/user-flow-[topic].md`, `user-flow-[topic]-interview.md`, and `alignment/user-flow-map-{topic}.html`.
4. Refactor AFPS routing and documentation.
   - [x] Update pack workflow docs, skill next-step contracts, skills reference, product-design `PACK.md`, and global skill browser mappings.
   - [x] Archive and bump existing skill mirrors before editing their `SKILL.md` contracts.
   - [x] Update positioning, UI interview, UX variations, prototype, spec interview, and research-roadmap routing.
5. Update generated assets and benchmark coverage.
   - [x] Add `user-flow-map` to the alignment generator and regenerate alignment-page stubs.
   - [x] Add benchmark coverage metadata or an explicit deferred coverage path.
   - [x] Regenerate showcase data and validate the public skill catalog artifacts.
6. Verify and ship.
   - [x] Run skill integrity checks, generated drift checks, benchmark coverage, tests, targeted `rg` route checks, and `git diff --check`.
   - [x] Record validation results in `tasks/todo.md`.
   - [x] Commit and push the intended changes.

### Design Constraints

- Keep `user-flow-map` as flow structure and low-fidelity wireframe guidance, not visual design or runnable prototype work.
- Preserve existing user changes and avoid staging generated local skill roots.
- Maintain the new AFPS route:

```text
icp -> competitive-analysis -> journey-map -> positioning
-> user-flow-map
-> ui-interview --requirements-only
-> ux-variations --layout-mode
-> prototype
-> uat --variant-evaluation
-> consolidate-variations
-> research-roadmap --post-prototype
-> spec-interview
-> research-roadmap --post-spec
-> roadmap
```

## Post-Phase Tail Work

- **2026-05-18 — Workflow demo user-goal and run excerpts:** Refine `/workflows` transcript turns so each scenario leads with the user's goal for using that workflow and benchmark-backed turns render retained prompt/output excerpts from persisted runs where available.
- **2026-05-14 — Skills Showcase Playful Lab sitewide refactor plan:** Evaluate whether to refactor the full Skills Showcase UI around the Playful Lab / playful blueprint direction rather than only the `/workflows` player. Scope includes replacing legacy card-heavy route, catalog, pack, proof, follow, and benchmark surfaces with lab-style ledgers, rails, lane maps, notebook panels, and inspection drawers before implementation.
- **2026-05-01 — Creator-media packaging/search/cadence skills:** Added focused YouTube strategy skills for title/thumbnail audit, search positioning, and cadence diagnosis so the pack can turn channel audit and peer benchmark evidence into packaging fixes and programming inputs.
- **2026-05-12 — YouTube concept research skill:** Add a concept-first YouTube research workflow to `youtube-ops` that starts from a proposed video concept, finds direct and adjacent successful comparables, separates public evidence from performance hypotheses, and produces differentiated execution lessons before scripting or production.
- **2026-05-13 — Benchmark `session-triage`:** Run `$benchmark-test-skill session-triage` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier1-workflows.setup.ts`.
- **2026-05-13 — Agent-review `session-triage` benchmark:** Run `$benchmark-agent-review session-triage` over the latest persisted Claude/Codex benchmark outputs, grade generated artifacts against the subjective review rubric, write `benchmark/review-session-triage-2026-05-13.md`, validate, commit, and push.
- **2026-05-13 — Tighten `session-triage` over-remediation rubric:** Update the custom benchmark quality rubric so one-off noncompliance with an adequate validation contract cannot keep an acceptable quality score when it routes to unconditional skill or contract edits.
- **2026-05-14 — Benchmark `content-programming` fresh full-contract run:** Run `$benchmark-test-skill content-programming` after the full-contract coverage and fixture-evidence rubric fixes, write the dated benchmark report, refresh generated showcase evidence, validate, commit, and push.
- **2026-05-14 — Agent-review `content-programming` fresh full-contract benchmark:** Review the latest Claude/Codex `content-programming` outputs after the full-contract benchmark run, refresh the dated review report, regenerate showcase data, validate, commit, and push. Result: six evaluated outputs reviewed, median subjective score 92.0, range 90-94, no remediation required. Recommended next command: `$ship`.
- **2026-05-14 — Benchmark `icon-handler` fresh rerun:** Run `$benchmark-test-skill icon-handler` after the valid-source-asset fixture fix, write the dated benchmark report, validate, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 2/3 hard assertions passing and no infrastructure blocks. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next command: `$session-triage icon-handler benchmark failure`.
- **2026-05-14 — Triage `icon-handler` benchmark failure:** Investigate the fresh failed Claude/Codex benchmark assertions, classify contract versus harness versus runner noncompliance, write a dated triage report, validate, commit, and push. Result: verified mixed failure; primary durable gap is benchmark route clarity, while Codex no-artifact run is runner noncompletion. Report: `benchmark/triage-icon-handler-2026-05-14.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark route clarity`.
- **2026-05-14 — Tighten `icon-handler` benchmark route clarity:** Update the custom benchmark prompt/rubric so build commands remain verification commands and the final next route must be `/icon-handler fix ...` for Claude or `$icon-handler fix ...` for Codex. Result: added final-route evaluator coverage, switched the source fixture to SVG to avoid Claude image ingestion, and passed Claude/Codex smoke benchmarks. Recommended next command: `$benchmark-test-skill icon-handler`.
- **2026-05-16 — Benchmark `ship`:** Run `$benchmark-test-skill ship` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 3/3 hard assertions passing and no infrastructure blocks, but both had deterministic quality critical failures on `evidence-linked`. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$session-triage ship benchmark failure`.
- **2026-05-17 — Benchmark `update-packages`:** Run `$benchmark-test-skill update-packages` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- **2026-05-17 — Triage `update-packages` benchmark failure:** Investigate the failed both-agent benchmark, classify contract versus harness versus runner causes, write a dated triage report, validate, commit, and push. Focus on `$exec` route failures, age-gate evidence, stale-run contract version, and fixture false positives around `package-lock.json`.
- **2026-05-18 — Benchmark `update-packages` fresh run:** Run `$benchmark-test-skill update-packages` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- **2026-05-18 — Benchmark `update-packages` fresh rerun:** Run `$benchmark-test-skill update-packages` again against the current repository state, write/update the dated deterministic both-agent benchmark report, refresh generated evidence if needed, validate, commit, and push.
- **2026-05-19 — Benchmark `update-packages` fresh rerun:** Run `$benchmark-test-skill update-packages` against the current repository state after the socket transport classification follow-up, write the dated deterministic both-agent benchmark report, refresh generated evidence if needed, validate, commit, and push.
- **2026-05-19 — Agent review `update-packages` fresh rerun:** Review the latest persisted Claude/Codex `update-packages` benchmark outputs, score retained artifacts for operator ergonomics, write the dated review report, refresh generated evidence, validate, commit, and push.
- **2026-05-19 — Targeted `update-packages` benchmark lockfile ordering fix:** Tighten the benchmark quality rubric so unsafe npm-to-pnpm lockfile deletion order is rejected, while preserving retained positive batch-actionability shapes.

## Deferred / Future Work
- **Remembered GitHub freshness preference (2026-05-27)** — teach `$sync` to ask once for GitHub freshness checks and remember the machine-wide preference, while keeping plain sync non-mutating and adding explicit `init-agentic-skills update/latest` refresh behavior.
- **Hard-rename initialization surface (2026-05-27)** — replace `install-agentic-skills` / `install.sh` with `init-agentic-skills` / `init.sh` as the first-time setup interface, without compatibility aliases.
- **Exclude archived skills from `$` preview (2026-05-27)** — active installed skill roots should be archive-free managed directories, while explicit pins continue to point at `archive/<version>`.
- **Skill structure best-practice audit (2026-05-27)** — preserve the current `global/{claude,codex}` and `packs/<pack>/{claude,codex}` model while tightening repo-local anatomy guidance, archive/changelog hygiene, and validation semantics so active-skill audits ignore historical archive noise.
- **Orchestrator refactor investigation: `growth-model` (2026-06-06)** — investigate decomposing into a Pattern A (Framework Decomposition + Synthesis) orchestrator with `frameworks/acquisition-loop`, `frameworks/retention-loop`, `frameworks/monetization-loop` subskills. Currently 356 lines with three distinct Reforge-style loop methodologies that produce independent analysis merged at synthesis. Strongest candidate.
- **Orchestrator refactor investigation: `platform-strategy` (2026-06-06)** — investigate decomposing into a Pattern A orchestrator with `frameworks/vertical-expansion` and `frameworks/horizontal-expansion` subskills, with scoring + portfolio sequencing handled by synthesis. Currently 461 lines with two genuinely different analytical lenses. Moderate candidate.
- **Orchestrator refactor investigation: `pmf-assessment` (2026-06-06)** — investigate decomposing into a Pattern A orchestrator with quantitative (Sean Ellis survey design) and qualitative (signal analysis) framework subskills. Currently 406 lines. Two frameworks is thin for an orchestrator; assess whether the split improves modularity enough to justify the overhead.
- ~~**Orchestrator convention: document Pattern B and C (2026-06-06)**~~ — done. Extended `docs/orchestrator-convention.md` with Pattern B (Intent Router + Play Composer), Pattern C (Detect-and-Route), Thin Workflow Router variant, pattern comparison table, and decision guide. Updated `skill-invocation-types.md` with youtube classification and `skill-anatomy.md` cross-reference.
- **Alignment YAML clipboard UX (2026-05-24)** — tighten every active HTML alignment-page contract so compiled YAML is copied automatically when possible and always has an explicit copy-to-clipboard control; validate with broad layer1 contract tests.
- **Kanban analytics** — cycle time, throughput, WIP limits via `/kanban-stats` skill (from original backlog)
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push (from original backlog)
- **Kanban card labels** — tags/labels field for filtering by type (deferred to after Phase 8)
- **Multi-project kanban dashboard** — cross-board view (larger initiative, deferred)
- **Add Codex poketo-kanban skill** — parity item, low priority
- **Cross-tool portability layer** — single-source skill generation (larger initiative)
- **Workflow orchestrator / meta-skill** — guided pipeline execution (larger initiative; partially addressed by Phase 26 monorepo pack)
- **Monorepo Pack V2** — planning skills (mono-roadmap, mono-plan-phase, mono-spec-interview), analysis skills (mono-affected, mono-debug, mono-trace, mono-investigate), and mono-migrate (single-app → monorepo migration with guided execution). Deferred until V1 is validated in real use.
- **Session continuity automation** — `/resume` skill for cold-start (medium effort)

## Cross-Phase Concerns
### Integration Tests
- All new tests must pass alongside existing 24 kanban.mjs tests
- Phase 6-7 tests should be runnable via `vitest` with existing config
### Non-Functional Requirements
- No credentials in test fixtures or tracked files
- Test suites must clean up after themselves (delete test boards/cards)

## Current Plan — Claude Last-24h Usage Feedback

1. Capture the `$analyze-sessions` invocation in prompt history.
2. Parse the full available Claude history for the last 24 hours and inspect adjacent Claude usage metadata for subagent, parallel-session, context, and skill signals.
3. Distinguish locally verified findings from dashboard-only claims that the available files do not expose.
4. Produce a durable alignment report with skill and workflow recommendations, including whether to improve existing skills or add new ones.
5. Verify generated artifacts and ship the intended tracked changes.

### Add-On Plan — Cost Translation

1. Check the same Claude log scope for direct cost fields before estimating.
2. Use only a freshly verified provider pricing table for token-to-cost math.
3. Keep the report explicit that local logs support an API-equivalent estimate, not actual dashboard billing.
4. Update the HTML with model, token-class, and top-project cost breakdowns, then validate the artifact.

## Current Plan — skillpacks refresh target version output

1. Trace `npx skillpacks refresh` through the package-owned Node CLI and confirm where package semver is available.
2. Add refresh output that states the bundled `skillpacks` package version applied to local skill roots.
3. Cover the output in the focused lifecycle refresh test.
4. Verify package tests and syntax checks, then record the install replacement behavior for the user.

## Current Plan — skillpacks install destination output

1. Remove transient package source paths from Node-owned install, refresh, pin, and unpin messages.
2. Keep output focused on `.claude/skills/<name>` and `.codex/skills/<name>` destinations, with pin/latest status where relevant.
3. Add lifecycle test assertions that normal install, pinned install, refresh, pin, and unpin output do not contain source arrows.
4. Run package syntax checks, node tests, build check, and whitespace validation before shipping.

## Current Investigation — Research Skills Alignment Convention Audit

1. Capture the `$investigate` invocation and preserve a narrow task trace.
2. Identify the canonical HTML alignment-page convention source and generated bundled files.
3. Define the active research-skill set from repo metadata and non-archive skill roots.
4. Audit each research skill for generated `ALIGNMENT-PAGE.md` presence, `SKILL.md` alignment-page handoff, staged research workflow language where applicable, category/tier/index/feedback/confirmation/TTS requirements, and drift from the canonical convention.
5. Run the available convention validation scripts/tests and report confirmed compliance, violations, and prevention checks.

## Current Investigation — skillpacks 0.1.4 Release Need

1. Capture the `$investigate` invocation and preserve the prompt history artifact.
2. Confirm the npm `skillpacks@0.1.3` publish commit, local package version, and current `HEAD`.
3. Diff package-included content from the 0.1.3 publish baseline to current `HEAD`, with emphasis on skill and manifest changes.
4. Classify the delta as package-visible, CLI-visible, docs-only, or repo-only.
5. Recommend whether to reconcile metadata only or bump/publish `skillpacks@0.1.4`, with verification evidence.

## Current Plan — skillpacks alignment commands

1. Inspect the package-owned CLI dispatcher, package staging boundary, alignment scripts, and existing package tests before changing behavior.
2. Add an explicit `skillpacks alignment` command namespace for generated per-skill bundles, active rendered-page audits, TTS injection, and focused verification.
3. Package the alignment scripts, support assets, and canonical convention doc needed for npm consumers while preserving denied package paths such as `alignment/`, `tasks/`, and `prompts/`.
4. Make `scripts/inject-tts.mjs` accept `--root <path>` and keep the CLI from injecting a TTS tag without the packaged TTS asset available in the target repo.
5. Update source-checkout and npm-path docs for the new alignment commands.
6. Add focused CLI/package tests, run the planned Vitest alignment set plus `npm --workspace skillpacks run verify:package`, then ship only this task's intended files.

## Current Plan — Portable Alignment Server

1. Inspect the existing `skillpacks` CLI alignment namespace, package staging boundary, server script, docs, and focused package tests.
2. Add `alignment pages serve [--port <port>]` to resolve the packaged `scripts/serve-alignment.mjs`, validate arguments strictly, and run the server against the current project root.
3. Include `scripts/serve-alignment.mjs` in npm package files, build staging entries, and required build files.
4. Update the canonical alignment-page convention and npm/quickstart docs so the portable `npx skillpacks alignment pages serve --port 8907` command is primary and the source-checkout node command is fallback.
5. Regenerate bundled `ALIGNMENT-PAGE.md` files from the canonical convention.
6. Add focused tests for help output, command resolution, port handling, invalid arguments, and package staging.
7. Run the required package, layer1, generation-check, and diff-hygiene verification, then commit and push the intended changes.

## Current Investigation — Competitive Analysis Framework Routing

1. Capture the `$investigate` invocation and record this plan in task tracking.
2. Validate the reported `$competitive-analysis/frameworks/porter-five-forces` route against active installed skills, source mirrors, tests, and recent git history.
3. Archive and bump competitive-analysis framework subskills when their routing contract changes.
4. Replace path-like direct framework invocations with parent-orchestrator-only instructions for both Codex and Claude mirrors, plus the active installed Codex copies.
5. Add focused regression coverage that rejects `$competitive-analysis/frameworks/*` and `/competitive-analysis/frameworks/*` command strings.
6. Run archive/version, routing, build, and diff hygiene verification, then ship the intended changes without touching unrelated in-flight work.

## Current Plan — Lightweight Research Alignment Bundles

1. Add a reusable alignment workflow selector for lightweight research or validation skills instead of hard-coding ORD-align exceptions.
2. Teach `scripts/upgrade-alignment-page.mjs` to render lightweight workflow language in generated `ALIGNMENT-PAGE.md` bundles while preserving the default heavy staged-research convention for existing research skills.
3. Mark ORD-align in both Claude and Codex mirrors with the new selector and regenerate its generated bundles/stubs.
4. Add focused regression coverage proving ORD-align gets lightweight validation language and does not regress to generic working-packet research language.
5. Run generator and focused layer1 verification, then record results.

## Current Plan — Tighten skillpacks NPM Package Boundary

1. Confirm whether `skillpacks@0.1.4` remains unpublished; keep `0.1.4` unless npm already has it.
2. Remove repo docs, agent instruction docs, prompts, apps, alignment pages, tasks, tests, and showcase artifacts from the staged npm publish target while retaining `README.md`, `LICENSE`, CLI/runtime code, manifest data, runtime scripts, `base/`, and `packs/`.
3. Stage the alignment-page convention as a package runtime asset under `assets/` and make packaged alignment maintenance scripts read that asset when repo docs are absent.
4. Add package-boundary coverage that inspects `npm pack ./packages/skillpacks/build --dry-run --json`, asserting denied path classes are absent and required runtime assets/content are present in the actual publish target.
5. Run package tests, package verification, exact publish-target dry run, release dry run, and diff hygiene.
6. Review the final diff, record results, then commit and push the intended package-boundary changes.

## Current Investigation — Repeated Skill Install Context Bloat

1. Capture the `$investigate` invocation and record a narrow task checklist.
2. Validate the duplicate/repeated skill observation against active `.codex/skills`, `.claude/skills`, package-owned install output, and generated indexes.
3. Trace whether the repeats come from archive recursion, case mismatches, npm install materialization, stale symlinks, generated bundle manifests, or session-injected skill roots.
4. Apply the smallest source fix that prevents repeated active skill discovery without deleting legitimate historical archives.
5. Add focused regression coverage for duplicate/case-normalized skill discovery or install cleanup behavior.
6. Run focused verification, document findings, then commit and push intended changes.
## Historical Implementation - Hard-Rename Design Inspiration Workflows

1. Inspect active `design-inspirations` skill mirrors, product-design pack metadata, design-tree convention, generated bundles, consumers, and focused layer-1 tests.
2. Archive the current active `design-inspirations` `SKILL.md` files, then `git mv` both Codex and Claude folders to `brainstorm-inspirations`.
3. Rewrite `brainstorm-inspirations` as the survey-and-compare optional feeder skill, with structured HTML board output, canonical `design/brainstorm-inspirations-{topic}.md`, and flow-tree `source_artifacts[]` updates.
4. Add new mirrored `take-inspiration` skills at `version: v0.0`, using the reference-specific interrogation, approved research scope, synthesis, COA recommendation, and `source_artifacts[]` contract.
5. Update product-design metadata, design-tree convention, generated bundles, alignment-page routing text, catalog/manifest exports, and consumers to remove active `design-inspirations` references.
6. Add focused layer-1 coverage for the hard rename, optional feeder/amendment status, structured board contract, and absence from the fixed route tuple.
7. Run required verification, record results, then commit and push intended changes while preserving unrelated dirty files.

# Current Roadmap - Centralized Skill Convention Docs

## Current Plan - Explicit Alignment Gate Outcome Metadata

### Goal

Update the canonical alignment-page convention and `ui-interview` skill mirrors so review-page readiness is computed from explicit gate outcome metadata, never by matching words in visible answer text.

### Plan

- [x] Capture prompt history and task tracking for the invoked skill work.
- [x] Update `docs/alignment-page-convention.md` with explicit `data-approval-effect` requirements and compile-path validation fixtures.
- [x] Add focused layer-1 regression coverage for metadata-based approval status and the positive `No decision-critical coverage is missing.` fixture.
- [x] Archive `ui-interview` v0.29, bump Codex and Claude mirrors to v0.30, and update changelogs.
- [x] Regenerate alignment-page bundles with `--legacy-bundles` and verify generated resolver stubs remain in sync.
- [x] Refresh the managed `gblock-party-redux` installed `ui-interview` copy from the updated source pack.
- [x] Remediate the active `gblock-party-redux` incident review page found during spot-check.
- [ ] Run the requested verification commands, review diffs, then commit and push intended changes.

### Acceptance Criteria

- [x] Required radio options carry explicit `data-approval-effect="approve" | "block" | "clarify" | "other"` semantics.
- [x] Compilers derive `approval_status` from outcome metadata plus unresolved section feedback, not labels, values, prose, regexes, or substrings.
- [x] All-approve compiles to complete gate and response statuses with `approval_status: ready-for-agent-review`.
- [x] Blocking, clarification, and unresolved negative section-feedback paths compile to `approval_status: not-approved`.
- [x] `ui-interview` review pages explicitly warn that words like missing/reject/retry/revision in approving copy must not affect readiness without blocking metadata.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --legacy-bundles --check`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`

## Goal

Patch skillpacks so installed skills can load every convention or contract document they reference from `.agents/skillpacks/docs/**`, while keeping the destination managed and isolated from app-owned project documentation.

## Plan

- [x] Build one convention-doc registry/helper from tracked canonical docs:
  - `docs/*convention*.md`
  - `docs/*contract*.md`
  - `docs/social/*convention.md`
- [x] Use that registry in package staging so npm installs contain the same canonical docs.
- [x] Use that registry in Node lifecycle install/init/refresh flows to overwrite only `.agents/skillpacks/docs/**`.
- [x] Add managed metadata/hash comparison so doctor can report stale or missing convention docs.
- [x] Add equivalent source-checkout `scripts/pack.sh` install/refresh/doctor behavior.
- [x] Add focused tests for package assets, single-skill install, pack install, refresh restore, doctor stale/missing reports, and shell install/refresh restore.
- [x] Run targeted verification and update the task review.

## Constraints

- Preserve unrelated dirty work already present in the shared tree.
- Do not write canonical docs into destination project `docs/` or `assets/`.
- Generated convention bundles such as `ALIGNMENT-PAGE.md`, `INTERROGATION-PAGE.md`, and `DESIGN-TREE-LOOP.md` remain duplicated snapshots unless their generators are intentionally updated.
- Treat `SKILL.md` cleanup as optional follow-up unless needed for this install support patch.

## Acceptance Criteria

- Install and refresh create `.agents/skillpacks/docs/**` for both package and source-checkout flows.
- Refresh restores deleted convention docs even when skill files are already current.
- Doctor reports missing or stale convention docs and recommends the existing refresh command.
- Package build output includes all registry convention/contract docs.

## Current Plan - Shared Alignment and Interrogation HTML Scaffolds

### Goal

Add packaged starter HTML scaffolds for alignment and interrogation pages so installed `skillpacks` users can create convention-shaped pages without repo-local `docs/` or generator scripts, while keeping normal skills responsible for their own content and approval gates.

### Plan

- [x] Inspect the existing `gskp alignment` CLI namespace, package staging boundary, and tests.
- [x] Add packaged template assets under `packages/skillpacks/assets/templates/`.
- [x] Add strict scaffold commands for `alignment pages scaffold` and `interrogation pages scaffold`.
- [x] Package the templates through build staging and npm `files`.
- [x] Update `create-alignment-page` and convention guidance to use the scaffold as infrastructure without routing normal skills through the skill.
- [x] Add package-boundary, CLI, and fixture audit coverage.
- [x] Run focused verification, update task review, then ship the intended changes.

### Acceptance Criteria

- [x] `gskp alignment pages scaffold <skill> <topic> --out alignment/<skill>-<topic>.html` writes a safe repo-relative page.
- [x] `gskp interrogation pages scaffold <skill> <round> <branch> --out interrogation/<skill>-r<round>-<branch>.html` writes a safe repo-relative page.
- [x] The npm publish target includes both templates and excludes denied repo paths.
- [x] Generated fixture pages pass the existing active-page auditors.
- [x] `create-alignment-page` can rely on packaged scaffold support when source checkout docs/scripts are unavailable.

### Test Plan

- `node --test packages/skillpacks/test/alignment.test.mjs`
- `node --test packages/skillpacks/test/package-boundary.test.mjs`
- `npm --workspace skillpacks run build:check`
- `npm --workspace skillpacks run pack:dry-run`
- `git diff --check`

## Current Plan - Cleanup Command and BIP Removal

### Goal

Broaden the legacy `uninstall-global` cleanup path into a clearer `cleanup` command that removes deprecated skillpacks artifacts, including legacy user-home skill installs and Build-In-Public project state.

### Plan

- [x] Inspect existing `uninstall-global`, BIP config helpers, docs, and focused tests.
- [x] Add `cleanup` as the primary CLI command while preserving `uninstall-global` as a compatibility alias.
- [x] Remove BIP project config keys during cleanup across discovered projects, with dry-run reporting and no unrelated config loss.
- [x] Update docs/help to describe cleanup and the experimental release policy for future canary-only features.
- [x] Add focused tests for cleanup aliasing, BIP removal, dry-run behavior, and command help.
- [x] Run focused verification and record the result in `tasks/todo.md`.

### Acceptance Criteria

- [x] `npx skillpacks cleanup` removes legacy managed globals and BIP config from discovered projects.
- [x] `npx skillpacks uninstall-global` still works as a deprecated alias.
- [x] Dry-run mode reports intended global and BIP cleanup without changing files.
- [x] Docs describe cleanup as the path for deprecated artifacts and reserve experimental features for canary/pre-release packages.

## Current Plan - Fix Dangling Shipping Contract Pointers

### Goal

Seed the shared shipping contract into canonical `provision-agentic-config` blocks so downstream `CLAUDE.md` and `AGENTS.md` files can resolve skill stubs that say `Follow the shared shipping contract convention in CLAUDE.md`.

### Plan

- [x] Inspect current provision skill variants, root shipping contract wording, lifecycle tests, archives, and generated package scripts.
- [x] Archive and bump both `provision-agentic-config` skill variants.
- [x] Add `### Shipping Contract Convention` to the canonical Claude and AGENTS provision blocks.
- [x] Add lifecycle coverage that generated `CLAUDE.md` and `AGENTS.md` contain the shared shipping contract pointer and rules.
- [x] Refresh generated package artifacts.
- [x] Run focused verification and record results.

### Acceptance Criteria

- [x] Canonical extracted `CLAUDE.md` and `AGENTS.md` blocks contain the shipping contract heading, pointer text, next-step routing, commit/push, clean tracked tree, and safety-exception rules.
- [x] Active skill stubs can continue to reference `Follow the shared shipping contract convention in CLAUDE.md`.
- [x] Package manifest output reflects the bumped provision skill metadata.
