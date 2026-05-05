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
| Business/product discovery | `business-discovery` | `business-growth` when ICP, positioning, or journey evidence is ready | `business-ops` after launch or active operation | `scripts/pack.sh install business-discovery` |
| Business GTM/growth | `business-growth` | `business-discovery` if ICP, positioning, or journey evidence is missing | `business-ops` for metrics review, risk, runway, and stakeholder reporting | `scripts/pack.sh install business-growth` |
| Business operations | `business-ops` | `business-discovery` for upstream customer/market evidence; `business-growth` for GTM, metrics, experiments, and PMF | ongoing operating review | `scripts/pack.sh install business-ops` |
| Full business app compatibility | `business-app` | expands to all business packs | discovery -> growth -> ops | `scripts/pack.sh install business-app` |
| Creator strategy | `creator-foundation` | `youtube-ops` for YouTube-specific channel/video work | `remotion` for production planning and build handoff | `scripts/pack.sh install creator-foundation` |
| YouTube operations | `youtube-ops` | `creator-foundation` if positioning, programming, series, or cross-platform evidence is missing | `remotion` when work becomes scripting or production planning | `scripts/pack.sh install youtube-ops` |
| Remotion production | `remotion` | `creator-foundation` for strategy; `youtube-ops` for YouTube evidence/reference analysis | script -> build spec/scaffold | `scripts/pack.sh install remotion` |
| Full creator-to-video path | `creator-foundation` | `youtube-ops`, `remotion` | research -> YouTube ops -> Remotion production | `scripts/pack.sh install creator-foundation youtube-ops remotion` |
| Creator media compatibility | `creator-media` | expands to `creator-foundation` + `youtube-ops` | add `remotion` separately for production work | `scripts/pack.sh install creator-media` |
| Developer tool strategy | `devtool` | `code-quality` for implementation cleanup; `monorepo` for workspace-aware execution | global spec/roadmap/run/ship flow | `scripts/pack.sh install devtool` |
| Game product workflow | `game` | `code-quality` for implementation cleanup; `game-kanban` only for board users | audience -> fantasy -> loop -> prototype -> launch | `scripts/pack.sh install game` |
| Monorepo execution overlay | `monorepo` | any domain pack that describes the product work | wraps `run` and `ship` with detection, lane specs, guards, and scoped validation | `scripts/pack.sh install monorepo` |
| Code quality overlay | `code-quality` | any domain pack | behavior-preserving refactor and quality campaigns | `scripts/pack.sh install code-quality` |
| Project fleet/control repo | `project-fleet` | `monorepo` only if the control repo itself is a pnpm workspace | clone/spec-store -> fleet batches -> spin-off | `scripts/pack.sh install project-fleet` |
| Alignment-first planning | `alignment-loop` | a domain pack once the project type is clear | grill -> destination doc -> vertical slice -> implementation | `scripts/pack.sh install alignment-loop` |
| Business kanban flow | `business-app-kanban` | a narrow business pack, usually `business-discovery`, `business-growth`, or `business-ops` | board-aware brainstorm/spec/roadmap/run/ship | `scripts/pack.sh install business-discovery business-app-kanban` |
| Devtool kanban flow | `devtool-kanban` | `devtool` | board-aware brainstorm/spec/roadmap/run/ship | `scripts/pack.sh install devtool devtool-kanban` |
| Game kanban flow | `game-kanban` | `game` | board-aware brainstorm/spec/roadmap/run/ship | `scripts/pack.sh install game game-kanban` |
| Generic PoketoWork boards | `poketowork-kanban` | optional with any domain pack | board utilities independent of a domain pack | `scripts/pack.sh install poketowork-kanban` |

## Canonical Chains

Business app:

```text
business-discovery -> business-growth -> business-ops
```

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
grill-me -> destination-doc -> vertical-slice-splitter -> implementation
```

Monorepo and code-quality are overlays. Kanban packs are workflow variants. They should usually be installed alongside a domain pack, not used as the domain pack themselves.
