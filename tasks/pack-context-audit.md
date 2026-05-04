# Pack Context Audit

Date: 2026-05-04

## Goal

Identify additional skill-pack reorganizations that would aggressively reduce default context size by avoiding broad lifecycle packs when an agent only needs a narrow work lane.

## Current Size Signals

Pack skill bodies by installed pack:

| Pack | Skill files | Lines |
| --- | ---: | ---: |
| business-app | 54 | 14,387 |
| creator-media | 40 | 3,863 |
| game | 22 | 940 |
| monorepo | 8 | 858 |
| poketowork-kanban | 16 | 780 |
| remotion | 6 | 638 |
| devtool | 16 | 604 |
| code-quality | 4 | 330 |
| alignment-loop | 4 | 241 |

Global skill bodies:

| Platform | Skill files | Lines |
| --- | ---: | ---: |
| Claude | 53 | 7,339 |
| Codex | 51 | 6,073 |

## Findings

### 1. `business-app` Is The Biggest Context Problem

`business-app` is 14,387 lines across Claude/Codex, larger than the entire global Codex skill set. It mixes discovery, validation, GTM, monetization, analytics, finance, stakeholder reporting, and post-launch operations. Most sessions need only one slice.

Recommended split:

| New pack | Skills | Lines |
| --- | --- | ---: |
| `business-discovery` | `icp`, `enterprise-icp`, `competitive-analysis`, `customer-feedback`, `value-prop-canvas`, `lean-canvas`, `positioning`, `journey-map` | 4,097 |
| `business-growth` | `hook-model`, `growth-model`, `metrics`, `gtm`, `monetization`, `landing-copy`, `pmf-assessment`, `experiment` | 5,262 |
| `business-ops` | `assumption-tracker`, `cohort-review`, `retro`, `risk-register`, `burn-rate`, `runway-model`, `investor-update`, `reconcile-research`, `mvp-gap`, `scale-audit`, `platform-strategy` | 5,028 |

Keep `business-app` as either:
- a compatibility alias that installs the three packs only when explicitly requested; or
- a thin meta-pack with no direct skills and guidance to install one lane.

Impact: installing `business-discovery` instead of all `business-app` cuts about 10,290 lines from that project-local context.

### 2. `creator-media` Should Split Foundation From YouTube Operations

The Remotion split removed the production lane, but `creator-media` still mixes general creator strategy with YouTube-specific audit and optimization work.

Recommended split:

| New pack | Skills | Lines |
| --- | --- | ---: |
| `creator-foundation` | `research-bootstrap`, `research-directory-conventions`, `creator-platform-capability-matrix`, `creator-evidence-schema`, `creator-presence-dossier`, `creator-positioning`, `content-programming`, `series-spec`, `product-led-media-map`, `creator-metrics-review` | 1,708 |
| `youtube-ops` | `youtube-channel-audit`, `youtube-video-audit`, `youtube-vid-research`, `youtube-competitive-research`, `youtube-title-thumbnail-audit`, `youtube-description-optimizer`, `youtube-portfolio`, `youtube-peer-benchmark`, `youtube-search-positioning`, `youtube-cadence-diagnosis` | 2,155 |

Keep `creator-media` as a compatibility alias or thin meta-pack. Install `creator-foundation` for creator strategy, `youtube-ops` only when actively auditing YouTube, and `remotion` only for format/script/build.

Impact: creator strategy sessions avoid about 2,155 YouTube-specific lines; YouTube audit sessions avoid about 1,708 general strategy lines when they only need video/channel operations.

### 3. `youtube-audit` Does Not Belong In Global Core

Global `youtube-audit` is 624 lines across Claude/Codex. It is domain-specific and now overlaps with creator/youtube pack work.

Recommendation: move `youtube-audit` into `youtube-ops`, with a tiny global launcher only if backwards compatibility is required. The launcher should say: install/enable `youtube-ops`, then run the pack-local skill.

Impact: cuts 624 lines from every globally installed skill set.

### 4. Fleet/Portfolio Skills Should Be Optional

`clone-spec-store`, `project-fleet`, and `spin-off` are specialized multi-repo/fleet operations, not general core repo work.

Current global footprint: 820 lines across available mirrors.

Recommendation: create a `project-fleet` or `portfolio-ops` pack containing:

```text
clone-spec-store, project-fleet, spin-off
```

Keep `roadmap`, `run`, `ship`, and `pack` global. The fleet pack should be installed only in control repos or sessions that explicitly manage many downstream repos.

### 5. Product Planning And UAT Are Broadly Useful But Not Core

The following global group is 1,922 lines:

```text
concept-exploration, feature-interview, spec-interview,
ux-variation, ui-interview, uat, dogfood
```

These are common for product work, but not needed in infrastructure, library maintenance, pure bug fixing, code-quality passes, release work, or monorepo execution.

Recommendation: create a `product-planning` pack. Keep only a small `spec-interview` or `feature-interview` launcher global if needed for discoverability. For aggressive context reduction, move the whole set and teach `roadmap`/`brainstorm` to recommend installing `product-planning` when an idea needs interview/spec/design/UAT gates.

Risk: this is a bigger behavior change because current workflows assume these planning skills are globally available.

### 6. Ops/Lifecycle Skills Could Become A Release-Ops Pack

The following global group is 946 lines:

```text
deploy, release, decommission, branch-lifecycle, commit-and-push-by-feature
```

They are useful across repositories, but only in specific lifecycle moments.

Recommendation: create `release-ops` for these skills after the business/creator/global-media splits. Keep `ship`, `ship-end`, and `sync` global because they are daily workflow primitives.

### 7. Kanban Variant Packs Duplicate The Same Workflow Per Domain

`business-app-kanban`, `devtool-kanban`, and `game-kanban` each carry the same six variant skills, plus `poketowork-kanban` carries a fuller generic set. The three domain-specific kanban packs total 1,182 lines.

Recommendation: collapse domain-specific kanban packs into `poketowork-kanban` plus domain pack metadata. Do not keep three copies of `run-kanban`, `ship-kanban`, `ship-end-kanban`, `roadmap-kanban`, `brainstorm-kanban`, and `spec-interview-kanban` unless their bodies meaningfully diverge.

Risk: existing projects may reference the old pack names. Preserve aliases in `scripts/pack.sh normalize_pack` and document the migration.

## Priority Order

1. Split `business-app` into `business-discovery`, `business-growth`, and `business-ops`.
2. Split `creator-media` into `creator-foundation` and `youtube-ops`; move global `youtube-audit` into `youtube-ops`.
3. Move fleet/portfolio skills into a `project-fleet` or `portfolio-ops` pack.
4. Collapse domain-specific kanban packs into the generic `poketowork-kanban` pack.
5. Consider a `product-planning` pack for interview/design/UAT skills after checking how often global sessions rely on them.
6. Consider `release-ops` after the bigger context wins are shipped.

## Implementation Notes

- Prefer compatibility aliases over breaking removals. `scripts/pack.sh install business-app` can either install all three new business packs or print a recommendation checkpoint.
- Keep direct skill names stable where possible. Moving a skill directory from one pack to another is cheap if the user installs the right pack.
- Update next-step routing text whenever a skill recommends a moved skill: the recommendation must mention the owning pack when it may not be installed.
- Validate every split with `scripts/pack.sh list`, temporary pack install symlink checks, `./scripts/skill-versions.sh --missing`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-next-step-routing.sh --missing`, targeted `rg` scans, and `git diff --check`.

