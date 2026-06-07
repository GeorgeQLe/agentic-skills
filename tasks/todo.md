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

- [ ] Update business-discovery pack skills (competitive-analysis, customer-feedback, enterprise-icp, lean-canvas, value-prop-canvas, positioning + 5 frameworks)

#### Next Step Plan — Phase 4.4 Business-Discovery Pack Routing
- Scope: update active business-discovery pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `enterprise-icp` as a separate skill and preserve `research/icp.md` only as the customer-discovery output artifact.
- Files to inspect/edit first: `packs/business-discovery/{codex,claude}/competitive-analysis/SKILL.md`, `customer-feedback/SKILL.md`, `enterprise-icp/SKILL.md`, `lean-canvas/SKILL.md`, `value-prop-canvas/SKILL.md`, `positioning/SKILL.md`, and positioning framework subskills under `packs/business-discovery/{codex,claude}/positioning/frameworks/*/SKILL.md`.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update the skill's `CHANGELOG.md`. If a framework subskill lacks a changelog, add one only if the local pattern for that framework directory expects it.
- Approach: replace command examples and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` using the correct runner syntax. Keep conceptual customer/profile language clear and avoid broad renames of the `research/icp.md` artifact until a separate artifact-rename decision exists.
- Validation: run targeted active-file scans over the edited business-discovery pack roots for `/icp`, `$icp`, `icp-needed`, and standalone `icp`; allow only intentional `enterprise-icp` and `research/icp.md` artifact references. Then run skill integrity checks (`scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`), refresh and validate Skills Showcase data, run relevant layer1 routing tests (`competitive-analysis-routing.test.ts`, `routing-graph.test.ts`, and any business-discovery-specific tests found by `rg`), and finish with `git diff --check`.

- [ ] Update customer-lifecycle pack skills (journey-map orchestrator + 5 frameworks)
- [ ] Update business-growth pack skills (experiment, gtm, hook-model, landing-copy, metrics, monetization, pmf-assessment)
- [ ] Update business-ops pack skills (assumption-tracker, burn-rate, cohort-review, mvp-gap, platform-strategy, product-line, reconcile-research, retro, risk-register, scale-audit)
- [ ] Update product-design pack skills (brainstorm, prototype, spec-interview)
- [ ] Update product-testing pack skills (dogfood, uat)
- [ ] Update research-admin, repo-maintenance, docs-health, teardown, monorepo pack skills
- [x] Rename afps-status stage `icp-needed` → `discovery-needed`

## Future Work

- [ ] Refactor competitive-analysis to orchestrator pattern (Porter's Five Forces, SWOT, etc. as framework subskills)

## Backlog

- [ ] Update the skills showcase pack list with the correct number of skills per pack and ensure all packs are represented
- [ ] On drawer close, collapse all cards onto the single visible top-left-most card (reverse of the fan-out animation on open) before animating the card back into the card pack. Use the visible top-left-most card rather than the absolute first card in the list because the user may have scrolled down before closing the drawer

## Code Review Fixes
> Generated by `/expert-review` on 2026-05-29. Critical and high-priority items resolved 2026-05-29–2026-05-30.

### High (open)
- [ ] [tests/layer4/helpers/disposable-repo.ts:107-126; git-fixture-sync.setup.ts:54-56] `cleanupRepo` runs `gh repo delete ${repoSlug} --yes` with `autoConfirm` hardwired to true and no validation of `repoSlug`; if `getGhUser()` falls back to `"unknown"` it targets `unknown/<name>`. Fix: assert `repoSlug` matches `^[\w.-]+/agentic-skills-bench-[\w.-]+$` and refuse when the user is `"unknown"`; switch to `execFileSync` (no shell).
- [ ] [tests/layer4/helpers/disposable-repo.ts:49-75, 82] `createDisposableRepo` (and the sync setup's `sync-upstream-` clone) create temp dirs via `mkdtempSync` that are never removed — `cleanup()` only deletes the GitHub repo. A 100-run benchmark leaks 100+ cloned repos to disk. Fix: have `cleanup()` also `rmSync` the mkdtemp parent and the upstream clone dir.
- [ ] [tests/harness/bench-persistence.ts:84-101] `findResumeableSession` sorts session dirs (`${skill}-${agent}-${randomUUID8}`) by the random id, not by time, so `--resume` can attach to an arbitrary older session and miscount cost/runs. Fix: sort by manifest `createdAt`/`updatedAt`, or timestamp-prefix the dir names.
