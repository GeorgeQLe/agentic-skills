# Current Task State

No active implementation task is currently promoted.

## Review - 0.1.20 Publish Readiness 2026-07-02

Project: `agentic-skills`.

### Goal

Prepare the repository for the next package publish after npm `0.1.19`: document the full changelog, package existing skill/doc changes, verify generated artifacts, and leave no dirty tracked tree.

### Review

Verified:

- Npm latest is `0.1.19` for both `skillpacks` and `@glexcorp/gskp`; the next prepared release is `0.1.20`.
- Package changelog and ship manifest document the full post-`0.1.19` release boundary.
- Generated design-tree loop bundles were stale during the first package verification run; regenerated 22 bundles and reran package verification successfully.
- Catalog export metadata was stale during the first export check; regenerated and reran export verification successfully.
- Package Node tests passed: 178 tests.
- Package verification passed: 415 active skills, 42 packs, 385 tracked convention bundles, manifest check, package staging boundary check, and `npm pack ./build --dry-run`.
- Skill archive audit passed: 415 skills, 0 violations.
- Pattern A handoff audit passed.
- Task-doc audit passed after converting review checklist items to evidence text.
- Diff hygiene passed.

## Review - Post-UAT Consolidation Routing Fix 2026-07-02

Project: `agentic-skills`.

### Goal

Prevent product-design handoffs from implying `$consolidate-prototypes` or `/consolidate-prototypes` is next after only one built prototype when other approved UX variants remain unbuilt or UAT evidence is not recorded.

### Plan

- [x] Archive and version the active Codex/Claude `uat`, `logic-wiring`, and `consolidate-prototypes` skill contracts.
- [x] Tighten UAT variant-evaluation readiness language to distinguish built/evaluated, built/not-run, approved-unbuilt/deferred, and explicitly MVP-excluded variants.
- [x] Tighten `logic-wiring` routing so prototype approval routes only to UAT; consolidation remains a later evidence/scope decision.
- [x] Harden `consolidate-prototypes` evidence gates for not-ready UAT files, unchecked readiness items, all-`Not run` logs, and unbuilt approved branches.
- [x] Update shared reusable routing docs for UAT-evidence plus explicit unbuilt/deferred-branch handling.
- [x] Add focused layer-1 contract coverage and run the requested tests/audits.

### Acceptance Criteria

- Active Codex and Claude skill mirrors do not route directly from one built prototype to consolidation.
- Consolidation readiness requires UAT evidence and explicit handling of unbuilt/deferred approved branches.
- Single-variant MVP convergence is allowed only when the user explicitly chooses that scope.
- Conservative fallback routes back to the next approved unbuilt UX/UI branch instead of consolidating by default.

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

## Review - Interrogation Agent-Owned Depth Convention 2026-07-02

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Goal

Update the interrogation-page convention so agents own interrogation depth, route unknowns correctly, and keep the confidence gate from passing on shallow "covered or waived" alignment.

### Plan

- [x] Update the canonical interrogation convention.
- [x] Regenerate legacy `INTERROGATION-PAGE.md` bundles from the canonical convention.
- [x] Update focused layer1 assertions for the new contract.
- [x] Run generator and focused test verification.
- [x] Record review notes and ship intended changes.

### Review

Verified:

- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --dry-run` passed with `Updated: 0`.
- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --check` passed with exact bundles, paths, and resolver stubs.
- `node scripts/upgrade-interrogation-page.mjs --check` passed with exact shared resolver stubs.
- `pnpm --dir tests exec vitest run --project layer1 layer1/interrogation-confidence-gate.test.ts` passed: 43 tests.
- `npm run skillpacks:build` passed; the unrelated manifest fingerprint side effect was restored.

Recent completed work has been reconciled into `tasks/history.md`, `tasks/roadmap.md`, task ship manifests, and `tasks/reconciliation-report.md`. Advisory recurring work remains in `tasks/recurring-todo.md` until explicitly promoted.

## Review - Development Docs Reconciliation 2026-07-02

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Plan

- [x] Capture the `$reconcile-dev-docs fix tasks` invocation prompt.
- [x] Audit `tasks/roadmap.md`, `tasks/todo.md`, advisory task files, recent git history, and the task-doc audit.
- [x] Mark completed current-task headings as historical/no-active state.
- [x] Add factual reconciliation evidence to history and reconciliation report.
- [x] Run task-doc audit and diff checks.

### Review

Verified:

- `node scripts/audit-task-docs.mjs` passed after the current-task cleanup.
- `git diff --check` passed for whitespace hygiene.
- `tasks/roadmap.md` has no promoted `Current Implementation` heading after this reconciliation.
- `tasks/todo.md` has no active implementation task and no stale unchecked executable items.
- The two unchecked recurring items remain advisory in `tasks/recurring-todo.md`.

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
