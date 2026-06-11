# Skillpacks CLI Routing Audit

Date: 2026-06-10

## Scope

Audit active `SKILL.md` files under `global/` and `packs/`, excluding `archive/**`, for install-routing text that still only points users to `/pack install`, `$pack install`, `pack install`, or `scripts/pack.sh install` after the public npm CLI path shipped.

Canonical current install routes from the repo docs:

- Source checkout or in-agent route: `/pack install <pack-or-skill>` for Claude, `$pack install <pack-or-skill>` for Codex, or `scripts/pack.sh install <pack-or-skill>` from a checkout.
- Published npm route from the target project: `npx skillpacks install <pack-or-skill>`.
- Published deck route: `npx skillpacks install-deck <deck>`.
- After install, Claude should run `/reload-skills`, then `/clear` or restart if needed; Codex should start a fresh Codex CLI session.

## Findings

- Active skill files scanned: 383.
- Active skill files with install-route or pack-availability guard language: 258.
- Active skill files already mentioning `npx skillpacks` or `skillpacks install`: 0.
- Active skill files needing npm install-routing upgrade under this audit criterion: 220.
- Existing `scripts/skill-pack-routing-audit.sh` still passes. That script checks cross-pack availability guards, not whether the guards mention the npm CLI route.

## Upgrade Pattern

Use a dual-route wording rather than replacing existing in-agent routes:

- For Claude-facing skills: "If the target pack is not enabled, recommend `/pack install <pack>` inside Claude Code, or `npx skillpacks install <pack>` from the project shell."
- For Codex-facing skills: "If the target pack is not enabled, recommend `$pack install <pack>` inside Codex, or `npx skillpacks install <pack>` from the project shell."
- For missing individual skills: include `/pack install <skill>` or `$pack install <skill>` and `npx skillpacks install <skill>`.
- For source-checkout scripts: keep `scripts/pack.sh` as the checkout path and add `npx skillpacks ...` as the package path.
- For deck recommendations: use `npx skillpacks install-deck <deck>` when the desired install unit is a deck rather than an individual pack.

## Priority Inventory

### P1 - Core Routing And Installer Skills

These should be upgraded first because they teach users and provisioned repos how to find or install skills:

- `global/claude/afps-status/SKILL.md`
- `global/claude/codebase-status/SKILL.md`
- `global/claude/idea-scope-brief/SKILL.md`
- `global/claude/init-agentic-skills/SKILL.md`
- `global/claude/pack/SKILL.md`
- `global/claude/provision-agentic-config/SKILL.md`
- `global/claude/skills/SKILL.md`
- `global/codex/afps-status/SKILL.md`
- `global/codex/codebase-status/SKILL.md`
- `global/codex/idea-scope-brief/SKILL.md`
- `global/codex/init-agentic-skills/SKILL.md`
- `global/codex/pack/SKILL.md`
- `global/codex/provision-agentic-config/SKILL.md`
- `global/codex/skills/SKILL.md`

### P2 - Repeated Pack Availability Guard And Follow-Up Route Text

These files contain direct install routing or boilerplate guards that should be updated after the P1 wording is settled.

| Bucket | Count | Skills |
| --- | ---: | --- |
| `packs/agent-work-admin/claude` | 3 | `plan-phase`, `roadmap`, `spec-drift` |
| `packs/agent-work-admin/codex` | 3 | `plan-phase`, `roadmap`, `spec-drift` |
| `packs/business-discovery/claude` | 22 | `competitive-analysis`, `competitive-analysis/frameworks/feature-pricing-matrix`, `competitive-analysis/frameworks/porter-five-forces`, `competitive-analysis/frameworks/strategic-group-map`, `competitive-analysis/frameworks/swot`, `customer-discovery`, `customer-discovery/frameworks/five-rings`, `customer-discovery/frameworks/four-forces`, `customer-discovery/frameworks/jtbd-needs`, `customer-discovery/frameworks/pmf-engine`, `customer-discovery/frameworks/seven-dimensions`, `customer-discovery/frameworks/w3-hypothesis`, `customer-feedback`, `enterprise-icp`, `lean-canvas`, `positioning`, `positioning/frameworks/category-design`, `positioning/frameworks/jtbd-positioning`, `positioning/frameworks/moore-positioning`, `positioning/frameworks/obviously-awesome`, `positioning/frameworks/strategic-canvas`, `value-prop-canvas` |
| `packs/business-discovery/codex` | 22 | `competitive-analysis`, `competitive-analysis/frameworks/feature-pricing-matrix`, `competitive-analysis/frameworks/porter-five-forces`, `competitive-analysis/frameworks/strategic-group-map`, `competitive-analysis/frameworks/swot`, `customer-discovery`, `customer-discovery/frameworks/five-rings`, `customer-discovery/frameworks/four-forces`, `customer-discovery/frameworks/jtbd-needs`, `customer-discovery/frameworks/pmf-engine`, `customer-discovery/frameworks/seven-dimensions`, `customer-discovery/frameworks/w3-hypothesis`, `customer-feedback`, `enterprise-icp`, `lean-canvas`, `positioning`, `positioning/frameworks/category-design`, `positioning/frameworks/jtbd-positioning`, `positioning/frameworks/moore-positioning`, `positioning/frameworks/obviously-awesome`, `positioning/frameworks/strategic-canvas`, `value-prop-canvas` |
| `packs/business-growth/claude` | 8 | `experiment`, `growth-model`, `gtm`, `hook-model`, `landing-copy`, `metrics`, `monetization`, `pmf-assessment` |
| `packs/business-growth/codex` | 8 | `experiment`, `growth-model`, `gtm`, `hook-model`, `landing-copy`, `metrics`, `monetization`, `pmf-assessment` |
| `packs/business-ops/claude` | 11 | `burn-rate`, `cohort-review`, `investor-update`, `mvp-gap`, `platform-strategy`, `product-line`, `reconcile-research`, `retro`, `risk-register`, `runway-model`, `scale-audit` |
| `packs/business-ops/codex` | 11 | `burn-rate`, `cohort-review`, `investor-update`, `mvp-gap`, `platform-strategy`, `product-line`, `reconcile-research`, `retro`, `risk-register`, `runway-model`, `scale-audit` |
| `packs/creator-foundation/claude` | 4 | `creator-evidence-schema`, `creator-metrics-review`, `creator-platform-capability-matrix`, `creator-positioning` |
| `packs/creator-foundation/codex` | 4 | `creator-evidence-schema`, `creator-metrics-review`, `creator-platform-capability-matrix`, `creator-positioning` |
| `packs/customer-lifecycle/claude` | 12 | `conversion-map`, `expansion-map`, `journey-map`, `journey-map/frameworks/customer-journey-canvas`, `journey-map/frameworks/experience-map`, `journey-map/frameworks/jtbd-timeline`, `journey-map/frameworks/service-blueprint`, `journey-map/frameworks/user-story-map`, `lifecycle-metrics`, `onboarding-map`, `retention-map`, `transaction-map` |
| `packs/customer-lifecycle/codex` | 12 | `conversion-map`, `expansion-map`, `journey-map`, `journey-map/frameworks/customer-journey-canvas`, `journey-map/frameworks/experience-map`, `journey-map/frameworks/jtbd-timeline`, `journey-map/frameworks/service-blueprint`, `journey-map/frameworks/user-story-map`, `lifecycle-metrics`, `onboarding-map`, `retention-map`, `transaction-map` |
| `packs/devtool/claude` | 7 | `devtool-adoption`, `devtool-dx-journey`, `devtool-integration-map`, `devtool-monetization`, `devtool-positioning`, `devtool-user-map`, `devtool-workflow` |
| `packs/devtool/codex` | 7 | `devtool-adoption`, `devtool-dx-journey`, `devtool-integration-map`, `devtool-monetization`, `devtool-positioning`, `devtool-user-map`, `devtool-workflow` |
| `packs/exec-loop/claude` | 3 | `exec`, `ship`, `ship-end` |
| `packs/exec-loop/codex` | 2 | `ship`, `ship-end` |
| `packs/game/claude` | 1 | `game-workflow` |
| `packs/game/codex` | 1 | `game-workflow` |
| `packs/guided-walkthrough/claude` | 1 | `uat-guide` |
| `packs/guided-walkthrough/codex` | 1 | `uat-guide` |
| `packs/monorepo/claude` | 1 | `scaffold` |
| `packs/monorepo/codex` | 1 | `scaffold` |
| `packs/ord/claude` | 1 | `ord-ship` |
| `packs/ord/codex` | 1 | `ord-ship` |
| `packs/product-design/claude` | 8 | `consolidate-variations`, `design-system`, `feature-interview`, `prototype`, `spec-interview`, `ui-interview`, `user-flow-map`, `ux-variations` |
| `packs/product-design/codex` | 7 | `consolidate-variations`, `feature-interview`, `prototype`, `spec-interview`, `ui-interview`, `user-flow-map`, `ux-variations` |
| `packs/product-testing/claude` | 2 | `dogfood`, `uat` |
| `packs/product-testing/codex` | 2 | `dogfood`, `uat` |
| `packs/remotion/claude` | 3 | `video-build`, `video-script`, `youtube-format-research` |
| `packs/remotion/codex` | 3 | `video-build`, `video-script`, `youtube-format-research` |
| `packs/repo-maintenance/claude` | 1 | `bootstrap-repo` |
| `packs/repo-maintenance/codex` | 1 | `bootstrap-repo` |
| `packs/research-admin/claude` | 1 | `research-roadmap` |
| `packs/research-admin/codex` | 1 | `research-roadmap` |
| `packs/session-analytics/claude` | 2 | `analyze-sessions`, `session-triage` |
| `packs/teardown/claude` | 1 | `desk-flip` |
| `packs/teardown/codex` | 1 | `desk-flip` |
| `packs/youtube-ops/claude` | 13 | `youtube`, `youtube-cadence-diagnosis`, `youtube-channel-audit`, `youtube-competitive-research`, `youtube-concept-research`, `youtube-description-optimizer`, `youtube-peer-benchmark`, `youtube-portfolio`, `youtube-search-positioning`, `youtube-title-thumbnail-audit`, `youtube-vid-research`, `youtube-video-audit`, `youtube-video-prelaunch-audit` |
| `packs/youtube-ops/codex` | 13 | `youtube`, `youtube-cadence-diagnosis`, `youtube-channel-audit`, `youtube-competitive-research`, `youtube-concept-research`, `youtube-description-optimizer`, `youtube-peer-benchmark`, `youtube-portfolio`, `youtube-search-positioning`, `youtube-title-thumbnail-audit`, `youtube-vid-research`, `youtube-video-audit`, `youtube-video-prelaunch-audit` |

## Not Flagged

The remaining active skills either do not contain install-routing text, only reference unrelated package-manager commands, or only mention non-install pack maintenance in a way that is not part of the npm install-routing migration. They can stay out of the first remediation pass unless the routing wording is broadened to cover `refresh`, `status`, `doctor`, `pin`, and `unpin`.

## Recommended Remediation Order

1. Update `global/*/{pack,skills,init-agentic-skills,provision-agentic-config}` first. These are the canonical user-facing install/discovery surfaces and the provisioned workflow text source.
2. Update global status/router skills: `afps-status`, `codebase-status`, and `idea-scope-brief`.
3. Replace the repeated `Pack Availability Guard` boilerplate across mirrored pack skills with runner-specific plus shell `npx skillpacks install <pack>` wording.
4. Sweep bespoke follow-up route sections in high-traffic AFPS skills: `customer-discovery`, `competitive-analysis`, `journey-map`, `positioning`, `user-flow-map`, `ui-interview`, `ux-variations`, `roadmap`, `plan-phase`, `ship`, and `ship-end`.
5. Add or extend a validation script so future active `SKILL.md` install-route text either mentions `npx skillpacks` or is explicitly allowlisted as source-checkout-only/internal.

## Verification

Commands run during audit:

```bash
rg --files -g 'SKILL.md' -g '!**/archive/**'
rg -n --glob 'SKILL.md' --glob '!**/archive/**' 'pack install|scripts/pack\.sh|install-deck|skillpacks|npm|reload-skills|fresh Codex|Pack Availability Guard|Missing Skill' global packs
rg -n --glob 'SKILL.md' --glob '!**/archive/**' 'npx skillpacks|skillpacks install|skillpacks install-deck' global packs
bash scripts/skill-pack-routing-audit.sh
```

Result: the custom scan found 220 upgrade candidates and zero existing active-skill npm CLI install references; the existing cross-pack guard audit passed with `No cross-pack recommendation gaps found.`
