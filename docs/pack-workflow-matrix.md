# Pack Workflow Matrix

Project-local packs reduce global context by separating **domain workflows** from **execution overlays** and **compatibility aliases**.

Use the narrowest pack that matches the current phase. Add overlays only when the repository needs that execution behavior.

## Mental Model

```text
domain pack = what kind of work this repo does
overlay pack = how execution should be adapted
compatibility alias = old broad name kept for existing commands
```

## Workflow Matrix

| Workflow | Start with | Then add | Leads into | Command |
| --- | --- | --- | --- | --- |
| Business/product discovery | `business-research` | `customer-lifecycle` after ICP and competitive analysis so journey evidence can precede positioning | `business-growth`, then `business-ops` | `npx skillpacks install business-research` |
| Customer lifecycle planning | `customer-lifecycle` | `business-research` if ICP or market evidence is missing; `business-growth` when lifecycle evidence is ready for GTM/pricing/experiments | `business-growth`, then `business-ops` | `npx skillpacks install customer-lifecycle` |
| Business GTM/growth | `business-growth` | `business-research` if ICP/positioning evidence is missing; `customer-lifecycle` if journey/onboarding/conversion evidence is missing | `business-ops` for metrics review, risk, runway, and stakeholder reporting | `npx skillpacks install business-growth` |
| Business operations | `business-ops` | `business-research` for upstream customer/market evidence; `customer-lifecycle` for journey evidence; `business-growth` for GTM, metrics, experiments, and PMF | ongoing operating review | `npx skillpacks install business-ops` |
| Full business app compatibility | `business-app` | expands to all business packs | discovery -> lifecycle -> growth -> ops | `npx skillpacks install business-app` |
| Creator strategy | `creator-foundation` | `youtube-ops` for YouTube-specific channel/video work | `remotion` for production planning and build handoff | `npx skillpacks install creator-foundation` |
| YouTube operations | `youtube-ops` | `creator-foundation` if positioning, programming, series, or cross-platform evidence is missing | `remotion` when work becomes scripting or production planning | `npx skillpacks install youtube-ops` |
| Remotion production | `remotion` | `creator-foundation` for strategy; `youtube-ops` for YouTube evidence/reference analysis | script -> build spec/scaffold | `npx skillpacks install remotion` |
| Full creator-to-video path | `creator-foundation` | `youtube-ops`, `remotion` | research -> YouTube ops -> Remotion production | `npx skillpacks install creator-foundation youtube-ops remotion` |
| Creator media compatibility | `creator-media` | expands to `creator-foundation` + `youtube-ops` | add `remotion` separately for production work | `npx skillpacks install creator-media` |
| Viral app rapid distribution | `vard` | none — self-contained rapid pipeline | graduates to `business-research` on traction | `npx skillpacks install vard` |
| OSS rapid distribution | `ord` | none — self-contained rapid pipeline | graduates to `devtool` on traction | `npx skillpacks install ord` |
| Developer tool strategy | `devtool` | `code-quality` for implementation cleanup; `monorepo` for workspace-aware execution | global spec/roadmap/exec/ship flow | `npx skillpacks install devtool` |
| Game AFPS product workflow | `game` | `code-quality` for implementation cleanup | audience -> fantasy -> genre -> comparables -> loop -> prototype -> playtest -> store page -> launch -> roadmap | `npx skillpacks install game` |
| Monorepo execution overlay | `monorepo` | any domain pack that describes the product work | wraps `run` and `ship` with detection, branch-backed lane specs, guards, PR review, and scoped validation | `npx skillpacks install monorepo` |
| Code quality overlay | `code-quality` | any domain pack | behavior-preserving refactor and quality campaigns | `npx skillpacks install code-quality` |
| Project fleet/control repo | `project-fleet` | `monorepo` only if the control repo itself is a pnpm workspace | clone/spec-store -> fleet batches -> spin-off | `npx skillpacks install project-fleet` |
| Alignment-first planning | `alignment-loop` | a domain pack once the project type is clear | grill -> destination doc -> vertical slice -> implementation | `npx skillpacks install alignment-loop` |
| PoketoWork kanban flows | hibernated | wait for Poketo.work rebuild | archived board-aware workflows | not installable |

## Canonical Chains

Business app:

```text
business-research -> customer-lifecycle -> business-growth -> business-ops
```

Default business-product route: `customer-discovery -> competitive-analysis -> journey-map -> positioning -> user-flow-map -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation] -> prototype -> uat --variant-evaluation -> consolidate-variations -> research-roadmap --post-prototype -> spec-interview -> research-roadmap --post-spec -> roadmap`.

Use `ui-interview --requirements-only` and `ux-variations --layout-mode` only as explicit bounded detours when a fixed content/data/action contract and layout-only alternatives are needed.

Optional research/framework detours sit after the evidence that exposes their trigger and before the downstream choice they would change. After `journey-map`, use `hook-model` only when repeat use, habit formation, engagement loops, retention triggers, saved state, social rewards, or investment compounding are central to product value; if `business-growth` is not enabled, route to `npx skillpacks install business-growth` first. For enterprise, infrastructure, transactional, or naturally infrequent products, skip `hook-model` and prefer lifecycle or success measurement (`lifecycle-metrics` or `metrics`). `value-prop-canvas`, `lean-canvas`, lifecycle stage maps, `monetization`, and `gtm` remain optional trigger-driven detours, not required chain links.

Creator/media:

```text
creator-foundation -> youtube-ops -> remotion
```

Remotion:

```text
youtube-format-research -> video-script -> video-build
```

Project fleet:

```text
clone-spec-store -> project-fleet -> spin-off
```

Alignment loop:

```text
taste-calibration -> destination-doc -> vertical-slice-splitter -> implementation
```

VARD (rapid business):

```text
vard-scan -> vard-align -> vard-ship
```

ORD (rapid OSS):

```text
ord-scan -> ord-align -> ord-ship
```

Game AFPS:

```text
game-audience -> game-fantasy -> game-genre-map -> game-comparables
-> game-core-loop -> game-prototype-test -> game-playtest-metrics
-> game-store-page-test -> game-launch -> game-roadmap
```

Monorepo and code-quality are overlays. VARD and ORD are rapid pipelines — see `docs/decks.md` for the deck model and graduation paths. PoketoWork kanban workflow variants are hibernated during the Poketo.work rebuild and should not be recommended as active install targets.
