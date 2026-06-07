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

- [ ] Update the skills showcase pack list with the correct number of skills per pack and ensure all packs are represented

### Next Step Plan — Skills Showcase Pack List Coverage
- Scope: audit the Skills Showcase pack list/count presentation so every active pack is represented and counts match generated source data after the new competitive-analysis framework subskills increased the catalog size.
- Files to inspect first: `apps/skills-showcase/app/packs`, `apps/skills-showcase/components`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, `scripts/generate-skills-showcase-data.mjs`, and any tests that reference pack counts or pack-card rendering.
- Approach: identify whether the incorrect counts are generated-data, UI grouping, static copy, or filtering issues; prefer deriving displayed counts directly from generated pack/skill data rather than maintaining parallel static numbers. Keep unrelated visual redesign backlog items out of scope.
- Validation: run the relevant Skills Showcase unit/route tests if present, `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, targeted `rg` checks for stale hard-coded pack counts, and `git diff --check`.

- [ ] On drawer close, collapse all cards onto the single visible top-left-most card (reverse of the fan-out animation on open) before animating the card back into the card pack. Use the visible top-left-most card rather than the absolute first card in the list because the user may have scrolled down before closing the drawer

## Code Review Fixes
> Generated by `/expert-review` on 2026-05-29. Critical and high-priority items resolved 2026-05-29–2026-05-30.

### High (open)
- [ ] [tests/layer4/helpers/disposable-repo.ts:107-126; git-fixture-sync.setup.ts:54-56] `cleanupRepo` runs `gh repo delete ${repoSlug} --yes` with `autoConfirm` hardwired to true and no validation of `repoSlug`; if `getGhUser()` falls back to `"unknown"` it targets `unknown/<name>`. Fix: assert `repoSlug` matches `^[\w.-]+/agentic-skills-bench-[\w.-]+$` and refuse when the user is `"unknown"`; switch to `execFileSync` (no shell).
- [ ] [tests/layer4/helpers/disposable-repo.ts:49-75, 82] `createDisposableRepo` (and the sync setup's `sync-upstream-` clone) create temp dirs via `mkdtempSync` that are never removed — `cleanup()` only deletes the GitHub repo. A 100-run benchmark leaks 100+ cloned repos to disk. Fix: have `cleanup()` also `rmSync` the mkdtemp parent and the upstream clone dir.
- [ ] [tests/harness/bench-persistence.ts:84-101] `findResumeableSession` sorts session dirs (`${skill}-${agent}-${randomUUID8}`) by the random id, not by time, so `--resume` can attach to an arbitrary older session and miscount cost/runs. Fix: sort by manifest `createdAt`/`updatedAt`, or timestamp-prefix the dir names.
