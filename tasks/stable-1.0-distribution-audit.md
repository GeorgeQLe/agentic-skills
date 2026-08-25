# Stable 1.0 Distribution Boundary Audit

Date: 2026-08-24

Issue: [#25](https://github.com/GeorgeQLe/agentic-skills/issues/25)

Pull request: [#26](https://github.com/GeorgeQLe/agentic-skills/pull/26)

## Decision

The stable package boundary is already mechanically sound: a stable build contains 413 mirrored agent skills across 40 packs and excludes the two canary-only `create-briefing-slides` mirrors plus the canary-only `briefing-slides` managed convention. The canary build contains 415 skills. Stable generation rejects a stable skill that depends on a canary convention.

Stable 1.0 should therefore proceed by removing mixed defaults at public and workflow boundaries rather than deleting operational tools wholesale. The first bounded cleanup slice is to add explicit release-lane identity to each public catalog skill entry and verify stable/canary projections from that identity. No publish, tag, dist-tag, deployment, installed-consumer mutation, or destructive cleanup belongs in this workstream without separate authorization.

## Evidence Summary

| Surface | Evidence | Result | Disposition |
| --- | --- | --- | --- |
| Package lane selection | `packages/skillpacks/scripts/release-lane.mjs`, `build-skillpacks-manifest.mjs`, `build-package.mjs` | `SKILLPACKS_PACKAGE_LANE` defaults to stable; stable admits only stable content; canary admits both lanes | Keep |
| Stable manifest projection | `env SKILLPACKS_PACKAGE_LANE=stable node packages/skillpacks/scripts/build-skillpacks-manifest.mjs --print` | 413 skills, 40 packs, zero canary skills | Keep and regression-test |
| Canary manifest projection | same command with `SKILLPACKS_PACKAGE_LANE=canary` | 415 skills, 40 packs; only two canary skill mirrors | Keep and regression-test |
| Managed conventions | `scripts/skill-convention-registry.mjs` | Eight conventions; only `briefing-slides` is canary | Keep |
| Package staging | `packages/skillpacks/test/package-boundary.test.mjs` | Stable staging removes denied skill roots, canary convention assets, and leaked metadata | Keep |
| Public catalog | `exports/skills-catalog/v1/catalog.json`, `scripts/catalog/index.mjs` | All 415 skills are listed, but skill records lack release-lane identity | Migrate first |
| Runtime refresh/install | `packages/skillpacks/src/cli/lifecycle.mjs` and packaged manifest consumption | Managed installs are driven by the selected packaged manifest and cannot install omitted stable content | Keep |
| Release docs | `packages/skillpacks/README.md`, `packages/skillpacks/docs/release-runbook.md` | Stable is built independently for `latest`; canary tarballs are not promoted to stable | Keep |
| `ship-end` | `packs/exec-loop/{claude,codex}/ship-end/SKILL.md` | Daily delivery primitive with explicit PR/deploy permission boundaries and no implicit page gate | Keep stable |
| `sync` | `packs/gitops/{claude,codex}/sync/SKILL.md` | Useful reporting/config-drift primitive, but it implicitly stashes and uses pull-with-rebase | Migrate in stable |

The committed package manifest is intentionally the current canary release (`0.1.22-experimental.6`, 415 skills). That committed artifact is not evidence that a generated stable projection leaks canary content; both generated projections and staging tests pass.

## Canary-Only Boundary

The complete canary-only active boundary is:

- `packs/base/claude/create-briefing-slides/SKILL.md`
- `packs/base/codex/create-briefing-slides/SKILL.md`
- `assets/briefing-slides-convention.md`, exposed through the `briefing-slides` entry in `scripts/skill-convention-registry.mjs`

No stable skill depends on the canary convention. Stable manifest generation fails if such a dependency is introduced.

## Legacy Ordinary-Workflow Coupling

The stable projection contains 413 mirrored agent surfaces. A deterministic source scan found:

- 309 stable-distributed agent surfaces requiring the `alignment-page` and/or `interrogation-page` convention.
- 295 active source surfaces with an `## Alignment Page` section.
- 48 active source surfaces with an `## Interrogation Page` section.
- 152 active source surfaces with an exact `## Report-First Approval Gate` and the `Default to scope-first approval` contract.
- 183 active source surfaces containing legacy approval vocabulary such as compiled approval YAML, pre-approval, or an approval gate.
- Eight active agent surfaces explicitly requiring AFPS 2.0; only the two `provision-agentic-config` mirrors overlap the page-convention population. The other six are the migrated YouTube launch trio mirrors.

These counts identify the migration boundary, not a deletion list. Explicit page builders, diagnostic/admin tools, and archived historical files remain valid even when ordinary product/research workflows stop producing approval pages implicitly.

### Complete grouped stable inventory

Paths follow `packs/<pack>/{claude,codex}/<skill>/SKILL.md` unless a pack contains a documented nested framework path. Each listed name represents every stable-distributed agent mirror for that skill. Counts are `agent surfaces / unique skill names`.

| Pack | Count | Skills |
| --- | ---: | --- |
| agent-bridge | 1 / 1 | delegate |
| agent-work-admin | 4 / 2 | plan-phase, roadmap |
| agentic-skills-bench | 4 / 2 | benchmark-agent-review, benchmark-test-skill |
| alignment-loop | 2 / 1 | vertical-slice-splitter |
| base | 14 / 7 | afps-status, animation-design-planner, create-alignment-page, fork-idea-branch, idea-scope-brief, provision-agentic-config, research-amend |
| business-growth | 16 / 8 | experiment, growth-model, gtm, hook-model, landing-copy, metrics, monetization, pmf-assessment |
| business-ops | 26 / 13 | assumption-tracker, burn-rate, cohort-review, investor-update, mvp-gap, platform-strategy, product-line, reconcile-research, repo-glossary, retro, risk-register, runway-model, scale-audit |
| business-research | 44 / 22 | category-design, competitive-analysis, customer-discovery, customer-feedback, enterprise-icp, feature-pricing-matrix, five-rings, four-forces, jtbd-needs, jtbd-positioning, lean-canvas, moore-positioning, obviously-awesome, pmf-engine, porter-five-forces, positioning, seven-dimensions, strategic-canvas, strategic-group-map, swot, value-prop-canvas, w3-hypothesis |
| code-maintenance | 2 / 1 | migrate |
| code-quality | 4 / 2 | extract-shared-types, quality-sweep |
| code-review | 8 / 4 | dead-code, expert-review, regression-check, slim-audit |
| context-transfer | 2 / 1 | handoff |
| creator-foundation | 18 / 9 | content-programming, creator-evidence-schema, creator-metrics-review, creator-platform-capability-matrix, creator-positioning, creator-presence-dossier, product-led-media-map, research-directory-conventions, series-spec |
| customer-lifecycle | 24 / 12 | conversion-map, customer-journey-canvas, expansion-map, experience-map, journey-map, jtbd-timeline, lifecycle-metrics, onboarding-map, retention-map, service-blueprint, transaction-map, user-story-map |
| devtool | 16 / 8 | devtool-adoption, devtool-docs-audit, devtool-dx-journey, devtool-integration-map, devtool-monetization, devtool-positioning, devtool-user-map, devtool-workflow |
| docs-health | 2 / 1 | reconcile-dev-docs |
| game | 22 / 11 | game-audience, game-comparables, game-core-loop, game-fantasy, game-genre-map, game-launch, game-playtest-metrics, game-prototype-test, game-roadmap, game-store-page-test, game-workflow |
| guided-walkthrough | 2 / 1 | uat-guide |
| monorepo | 2 / 1 | mono-plan |
| ord | 4 / 2 | ord-align, ord-scan |
| product-design | 30 / 15 | brainstorm, brainstorm-inspirations, build-ui-screens, consolidate-prototypes, design-system, eval-ideas, feature-interview, key-moments, logic-wiring, spec-interview, state-model, take-inspiration, ui-interview, user-flow-map, ux-variations |
| product-testing | 4 / 2 | dogfood, uat |
| project-fleet | 6 / 4 | clone-spec-store, project-fleet, skill-inventory, spin-off |
| release-ops | 4 / 2 | branch-lifecycle, release |
| remotion | 6 / 3 | video-build, video-script, youtube-format-research |
| report-gen | 2 / 1 | report-website |
| research-admin | 2 / 1 | research-roadmap |
| session-analytics | 4 / 2 | analyze-sessions, prompt-history-backfill |
| skill-dev | 2 / 1 | skill-interview |
| teardown | 4 / 2 | decommission, desk-flip |
| vard | 2 / 1 | vard-scan |
| website-polish | 2 / 1 | icon-handler |
| youtube-ops | 24 / 12 | youtube-audit, youtube-cadence-diagnosis, youtube-channel-audit, youtube-competitive-research, youtube-concept-research, youtube-derivative-cuts, youtube-meta-research, youtube-peer-benchmark, youtube-portfolio, youtube-search-positioning, youtube-vid-research, youtube-video-audit |

This grouped list is the complete 309-surface page-convention dependency set. The narrower 152-surface report-first subset is concentrated in the business, creator, customer-lifecycle, devtool, game, ORD, product-design, Remotion, VARD, and YouTube workflow families. Migration should be performed by coherent pack/workflow family with archive/version/test discipline, not by a repository-wide textual deletion.

## Classification Rules

| Class | Meaning | Treatment |
| --- | --- | --- |
| Ordinary-workflow coupling | A routine workflow requires a page, compiled approval YAML, or approval stop before reversible work | Migrate to AFPS 2.0 in bounded workflow families |
| Explicit review/admin tooling | The user directly invokes a page builder, audit, planning, review, or lifecycle control | Keep when the tool itself is the requested outcome |
| Historical support | Archived skills, completed task evidence, changelogs, or compatibility documentation | Preserve; exclude from active-default scans |
| Required operational behavior | Git synchronization, delivery, recovery, packaging, or permission enforcement | Keep or migrate semantics without removing capability |

## `ship-end` and `sync` Dispositions

### `ship-end`: keep stable

`ship-end` provides daily closeout value: verification, task/history reconciliation, commit/push, PR update, deployment detection, and explicit permission stops. It does not require an implicit alignment/interrogation artifact. Removing or moving it to canary would weaken the normal safe-delivery path without reducing ordinary-workflow approval coupling.

### `sync`: migrate in stable

`sync` should remain a stable operational capability, but its implicit `git stash` and `git pull --rebase` path conflicts with current branch-ownership and history-safety rules. A future bounded migration should:

- stop and report when the working tree is dirty or ownership is ambiguous;
- fetch and use fast-forward-only integration where safe;
- never create an implicit stash or rewrite published history;
- preserve config-drift detection and clear status reporting;
- archive/version both agent mirrors and add focused dirty-tree, divergence, and fast-forward tests.

This is a behavior migration, not the first cleanup slice, because it has a distinct rollback and regression boundary.

## Phase 2: Public Catalog Release-Lane Identity

### Why this is first

The package manifest is the installation source of truth, but the public catalog is a discovery interface. Listing canary-only skills without item-level lane identity can create a mixed-default impression even though stable packaging is correct. Adding identity is additive and reversible, affects a small generator/schema boundary, and gives downstream consumers enough information to filter or badge experimental skills.

### Bounded changes

- Add `release_lane` to each generated catalog skill record, sourced from parsed skill frontmatter with the same stable default used by package generation.
- Add deterministic stable/canary counts to catalog metadata or proof so omissions and leaks are reviewable.
- Regenerate `exports/skills-catalog/v1/{catalog,manifest,proof}.json`.
- Add focused assertions that the stable projection excludes both `create-briefing-slides` mirrors, the canary projection includes them, and every catalog skill has a valid lane.
- Update schema/readme documentation if those files define the public record shape.

### Compatibility and rollback

The field is additive; existing consumers that ignore unknown properties continue to work. The package manifest remains the install authority. Rollback is a source/test/generated-export revert with no consumer mutation. No skill changes lane and no package is published.

### Verification commands

```sh
node --test packages/skillpacks/test/manifest.test.mjs packages/skillpacks/test/package-boundary.test.mjs
npx vitest run tests/layer1/skills-catalog-release-lane.test.ts
scripts/validate-skills-catalog-export.sh
env SKILLPACKS_PACKAGE_LANE=stable node packages/skillpacks/scripts/build-package.mjs --check
env SKILLPACKS_PACKAGE_LANE=canary npm --prefix packages/skillpacks run build:check
node scripts/audit-task-docs.mjs
git diff --check
```

## Deferred Follow-ups

1. Migrate `sync` safety semantics as its own stable phase.
2. Migrate the 152 report-first ordinary-workflow surfaces by coherent pack families, beginning with a representative workflow slice and deterministic stop/page-count assertions.
3. Reclassify page conventions or explicit page-builder skills only when an actual stable consumer boundary requires it; do not infer removal from their continued presence.
4. Publish stable 1.0 only through the release runbook and a separate, explicit release authorization after every selected migration phase passes.

## Audit Result

All five Phase 1 acceptance criteria are satisfied. The distribution boundary is decision-complete, the immediate Phase 2 slice is bounded, and no externally consequential release or consumer action occurred.
