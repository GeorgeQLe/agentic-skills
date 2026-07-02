# Current Task State

## Current Implementation - Research Amend Workflow Integration

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Goal

Document when research workflow handoffs should recommend the new base `research-amend` skill instead of a full Pattern A rerun.

### Execution Profile

- Parallel mode: serial.
- Reason: this touches research routing contracts and possibly mirrored skill/docs text that should remain coherent across Claude and Codex surfaces.
- Safety boundary: preserve unrelated dirty work already present in the shared worktree; do not weaken Pattern A approval gates or route review-pending pages to downstream commands.

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

### Verification Plan

- Focused routing tests for changed research-health or Pattern A surfaces.
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `node scripts/skill-alignment-routing-audit.mjs`
- `bash scripts/skill-install-routing-audit.sh --active`
- `npm run skillpacks:build` if any active `SKILL.md` changes
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/generate-skills-catalog-export.mjs` and `scripts/validate-skills-catalog-export.sh` if any active `SKILL.md` changes
- `git diff --check`
- `git status --short --branch`

### Implementation Notes For Next Step

Inspection completed 2026-07-02. `research-amend` already exists as a base skill under `packs/base/{claude,codex}/research-amend/` and has focused contract coverage in `tests/layer1/research-amend-contract.test.ts`; the next work is integration guidance, not new skill authoring.

Patch targets:

- `docs/research-session-loop-convention.md`: add post-canonical amendment routing guidance after final synthesis / approved artifact state. Preserve the current rule that `review` gates route only through `## Invoke With YAML`; `research-amend` is valid only after canonical artifacts are approved and written or from health/status scans.
- `docs/orchestrator-convention.md`: summarize the same post-canonical rule in Pattern A terminal handoff responsibilities.
- `packs/research-admin/{claude,codex}/research-roadmap/SKILL.md`: teach stale/missing queue logic that bounded low/medium corrections to existing canonical research, such as one missed competitor or one corrected source fact, should queue `{agent}research-amend` before full reruns; high/systemic drift still queues targeted framework/synthesis/full Pattern A reruns.
- `packs/business-ops/{claude,codex}/reconcile-research/SKILL.md`: update `## Next Steps` recommendation logic so isolated Error/Warning findings that map to a bounded low/medium amendment can recommend `{agent}research-amend`, while conflict clusters, upstream category/ICP/strategy changes, or broad source staleness keep recommending reruns.
- `tests/layer1/research-roadmap-routing.test.ts` and/or `tests/layer1/research-amend-contract.test.ts`: add assertions for `research-amend` routing, high/systemic rerun preservation, no downstream routing while review pages are pending, and platform-correct `$...` vs `/...` command text.

Versioning likely required: active `SKILL.md` edits to `research-roadmap` and `reconcile-research` must archive current versions with `scripts/skill-archive.sh <skill-dir>`, bump decimal versions, and update changelogs before editing. If only docs/tests change, no skill archive/version bump is needed.

### Review

Step 1 complete:

- Located existing `research-amend` skill and its focused test.
- Identified four integration surfaces: Pattern A loop convention, orchestrator convention, `research-roadmap`, and `reconcile-research`.
- Confirmed current Pattern A YAML contracts already block downstream routing while alignment pages are in `review`; next edits must preserve that boundary.
- Confirmed `research-roadmap` currently treats missing/stale items as direct skill reruns, and `reconcile-research` currently recommends the conflict-bearing skill rerun by count.

Step 2-5 complete:

- Added post-canonical amendment routing to the Pattern A loop and orchestrator conventions.
- Updated `research-roadmap` and `reconcile-research` Claude/Codex mirrors so bounded low/medium corrections can recommend `research-amend` and high/systemic drift keeps rerun routing.
- Archived and bumped changed skill contracts: `research-roadmap` v0.19 -> v0.20 and `reconcile-research` v0.10 -> v0.11.
- Added focused layer1 coverage for research-roadmap, reconcile-research, Pattern A docs, and existing research-amend contract behavior.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` and `exports/skills-catalog/v1/**`.
- Verification passed: focused Vitest routing suite, version audit, strict archive audit, alignment routing audit, install routing audit, skillpacks build/check, catalog export validation, and diff hygiene.
- Adversarial review: the new amendment route is limited to post-canonical/health contexts, review-pending Pattern A pages still route through YAML only, and high/systemic examples remain explicitly routed to framework/synthesis/full reruns.

## Historical Implementation - YAML-Only Routing Handoff Audit

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Goal

Remove duplicate continuation routing from active chunked skill handoffs: when a handoff includes `## Invoke With YAML`, the resolved continuation command lives in YAML (`command` / `agent_routing.command`) and the YAML is the single copy/paste artifact.

### Plan

- [x] Inspect existing dirty work and routing handoff hits without reverting unrelated changes.
- [x] Patch stale canonical or installed skill mirrors that still require an `Exact next command` alongside YAML.
- [x] Ensure focused regression coverage catches active chunked skills that combine `Exact next command:` with `## Invoke With YAML`.
- [x] Run generator checks, archive audits, focused tests, whitespace checks, and status checks.
- [x] Reconciled as historical follow-up, not active executable work in this task file.

### Acceptance Criteria

- Active generated design-tree loop bundles do not tell users to copy both an exact command line and `## Invoke With YAML` for the same chunked continuation.
- Chunked skill instructions route repeated commands through `agent_routing.command`.
- Local installed `.codex/skills` and `.claude/skills` mirrors that users may invoke directly no longer repeat the stale duplicate-command wording.
- Historical archives, changelogs, alignment-page YAML contracts, Pattern A review-loop command YAML, and post-write `Recommended Next Command` sections remain unchanged unless directly implicated.

### Verification Plan

- `rg` audit for `Exact next command`, `run the Exact next command`, `alongside the command`, and `give the exact resolved next`.
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `bash scripts/skill-archive-audit.sh --strict`
- Focused Vitest for product-design routing handoffs.
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

Project: `agentic-skills`.

### Goal

Remove duplicate chunked-handoff routing in `ux-variations` so the resolved continuation command appears in `## Invoke With YAML` / `agent_routing.command` instead of both YAML and a separate "Exact next command" line.

### Plan

- [x] Record the user correction in `tasks/lessons.md`.
- [x] Archive and version active `ux-variations` skill contracts before behavior edits.
- [x] Update the design-tree convention and mirrored `ux-variations` handoff wording.
- [x] Regenerate/check bundled design-tree convention files.
- [x] Run focused tests and archive/diff verification.

### Review

Verified:

- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts -t "requires progress handoff blocks"` from `tests/` passed: 1 test, 18 skipped.
- Full `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` still fails only on a pre-existing dirty-tree base-pack migration path: `base/codex/idea-scope-brief/SKILL.md` is missing because the tree has moved base skills under `packs/base/...`.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.

## Historical Implementation - Base Pack Nesting Migration

Project: `agentic-skills`.

### Goal

Move the canonical base skill source from top-level `base/{claude,codex}` to `packs/base/{claude,codex}` while preserving base-skill install/runtime semantics.

### Execution Profile

- Parallel mode: serial.
- Reason: the change renames a source root and touches package discovery, generated manifests, tests, docs, and task records.
- Safety boundary: preserve unrelated dirty work already present in the shared worktree; keep legacy `base/...` managed marker ownership valid for cleanup/refresh; do not add the base pack to `enabled_packs`; do not implement `research-amend` in this shipping boundary.

### Plan

- [x] Move tracked base skill sources and archives to `packs/base/{claude,codex}` and add `packs/base/PACK.md`.
- [x] Update catalog, package, lifecycle, ownership, audit, generator, and docs code so `packs/base` remains `scope: "base"` with `pack: null`.
- [x] Update focused manifest/lifecycle/package-boundary/layer1 tests for the new canonical paths and legacy marker compatibility.
- [x] Regenerate package manifest/catalog exports from staged source and run focused verification.
- [x] Record review, ship manifest, and history for this base migration before starting `research-amend`.

### Acceptance Criteria

- Base skills are sourced from `packs/base/{claude,codex}`.
- Base skills still report `scope: "base"` and `pack: null` in install/runtime manifests.
- `npx skillpacks init` still installs all base skills and records `base_skills: true`.
- `npx skillpacks install idea-scope-brief` still records `enabled_skills["idea-scope-brief"] = "base"`.
- Refresh/uninstall cleanup still recognizes existing managed markers pointing at old `base/...` paths.
- `packs/base` is not treated as an `enabled_packs` domain pack.
- `research-amend` remains the next separately shippable change.

### Test Plan

- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `bash scripts/skill-mirror-parity-audit.sh`
- `bash scripts/skill-install-routing-audit.sh`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- Focused Node/Vitest tests for `packs/base` layout, init/refresh/install lifecycle behavior, package boundary, and routing/audit path updates
- `git diff --check`

### Review

Verified:

- `npm run skillpacks:build` passed after staging the migrated base source.
- `npm run skillpacks:verify` passed; `node bin/skillpacks.mjs list` no longer lists `base` as a normal pack.
- Manifest semantic check passed: `packs/base/codex/skills/SKILL.md` is installable with `scope: "base"`, `pack: null`, and `packs[].name !== "base"`.
- `npm --workspace packages/skillpacks run test:node` passed: 176 tests.
- `npm --workspace packages/skillpacks run build:check` passed.
- `scripts/validate-skills-catalog-export.sh` passed and confirmed export artifacts are fresh.
- `bash scripts/skill-versions.sh --missing` passed: all 363 skills have a version field.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `bash scripts/skill-deps.sh --broken` passed.
- `bash scripts/skill-install-routing-audit.sh --active` passed: 413 active `SKILL.md` files scanned, P1 coverage 12/12, findings 0.
- `node scripts/upgrade-alignment-page.mjs --check`, `node scripts/upgrade-interrogation-page.mjs --check`, and `node scripts/upgrade-design-tree-loop.mjs --check` passed.
- `bash scripts/base-skill-version-parity-audit.sh` and `bash scripts/skill-pack-routing-audit.sh` passed.
- Focused layer1 suite passed from `tests/`: 7 files, 393 tests.

Known residual outside this shipping boundary:

- Broad mirror/layer1 validations in this dirty worktree still include unrelated pre-existing convention/version work in `packs/agent-work-admin`, `packs/exec-loop`, `packs/product-design`, `packs/docs-health`, `packs/monorepo`, and `youtube-meta-research`. These were not changed or corrected in the base nesting migration.
- `bash scripts/skill-mirror-parity-audit.sh` still fails on 10 dirty-tree parity issues: `agent-work-admin/plan-phase`, `base/provision-agentic-config`, `docs-health/hygiene`, `exec-loop/ship-end`, `monorepo/mono-plan`, `product-design/consolidate-prototypes`, `product-design/logic-wiring`, `product-design/state-model`, `product-design/ux-variations`, and `vard/vard-align`.
- A parallel package build/check attempt raced on `packages/skillpacks/build` and produced a transient `ENOENT`; the same commands passed when rerun serially.

## Historical Implementation - Cross-Agent SKILL.md Convention Audit

Project: `agentic-skills`.

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
- Commit and push intended changes on the primary branch while preserving unrelated dirty work. This was left as prior-session follow-up, not active executable work in this task file.

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

Project: `agentic-skills`.

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
- Commit and push intended changes on the primary branch while preserving unrelated dirty work. This was left as prior-session follow-up, not active executable work in this task file.

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

Project: `agentic-skills`.

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

Project: `agentic-skills`.

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

Project: `agentic-skills`.

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

### Review

Verified:

- `node scripts/upgrade-alignment-page.mjs --check` passed: 311 generated bundles exact, 313 output paths exact.
- `node scripts/audit-alignment-pages.mjs` passed: 61 active pages exact, 1 post-confirmation BIP page exact, 61 index entries exact.
- `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts` could not run because the repo has no root `test` script.
- `npx vitest run tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts` passed: 3 files, 75 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- BIP implementation committed and pushed on `master`: `2d6548b17 fix: standardize bip page output`.
- Pre-existing dirty package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Paused Implementation - Create YouTube Meta Research Skill

This section is preserved from the pre-existing task state and is intentionally not part of release-prep metadata and changelog work.
