# Skills Reference

Skills are split into global core skills and project-local packs.

## Global Install

```bash
./install.sh
```

Installs only:

- `global/claude/*`
- `global/codex/*`

It does not install domain packs globally.
It also removes repo-managed legacy links for retired flat-root skills and former migration stubs.

## Project Pack Commands

```bash
scripts/pack.sh list
scripts/pack.sh recommend
scripts/pack.sh install <pack>
scripts/pack.sh remove <pack>
scripts/pack.sh refresh
scripts/pack.sh status
```

Project designation is stored in `.agents/project.json`.

## Global Core Skills

Global skills are safe across business apps, games, devtools, libraries, services, and infrastructure:

| Skill | Purpose |
| --- | --- |
| `pack` | Manage project-local packs and `.agents/project.json` |
| `skills` | Browse global and enabled project-local skills |
| `workflow` | Read-only status and next-action recommendation |
| `plan-interview` | Turn rough ideas into implementation specs |
| `roadmap` | Build or update phased roadmaps |
| `plan-phases` | Convert roadmap phases into executable steps |
| `run` | Execute the next planned step |
| `ship` / `ship-end` | Package completed work and prepare handoff |
| `debug`, `investigate`, `trace` | Diagnose and fix problems |
| `expert-review`, `regression-check`, `dead-code`, `slim-audit`, `spec-drift` | Review, health checks, and quality analysis |
| `scaffold`, `migrate`, `decommission` | Structural project work |
| `deploy`, `release`, `sync`, `handoff` | Shipping and session operations |

## Business App Pack

Install in SaaS, marketplace, productivity, business workflow, and enterprise projects:

```bash
scripts/pack.sh install business-app
```

Skills:

```text
icp, enterprise-icp, competitive-analysis, customer-feedback,
journey-map, metrics, gtm, monetization, positioning, landing-copy,
mvp-gap, scale-audit, assumption-tracker, experiment, cohort-review,
retro, risk-register, burn-rate, runway-model, investor-update,
platform-strategy, reconcile-research
```

Default flow:

```text
icp -> competitive-analysis -> positioning -> journey-map -> metrics
-> gtm / monetization -> roadmap -> plan-phases -> run
```

## Game Pack

Install in video game and playable entertainment projects:

```bash
scripts/pack.sh install game
```

Skills:

```text
game-workflow, game-audience, game-fantasy, game-genre-map,
game-comparables, game-core-loop, game-prototype-test,
game-store-page-test, game-playtest-metrics, game-roadmap, game-launch
```

Default flow:

```text
game-audience -> game-fantasy -> game-genre-map -> game-comparables
-> game-core-loop -> game-prototype-test -> game-playtest-metrics
-> game-store-page-test -> game-launch -> game-roadmap
```

## Devtool Pack

Install in developer-facing tools, SDKs, CLIs, APIs, libraries, and infrastructure products:

```bash
scripts/pack.sh install devtool
```

Skills:

```text
devtool-workflow, devtool-user-map, devtool-integration-map,
devtool-dx-journey, devtool-adoption, devtool-positioning,
devtool-monetization, devtool-docs-audit
```

Default flow:

```text
devtool-user-map -> devtool-integration-map -> devtool-dx-journey
-> devtool-adoption -> devtool-positioning -> devtool-monetization
-> devtool-docs-audit
```

## Kanban Variant Packs

Install only in projects that intentionally use PoketoWork boards. Base domain packs do not install these automatically.

```bash
scripts/pack.sh install business-app-kanban
scripts/pack.sh install game-kanban
scripts/pack.sh install devtool-kanban
```

Skills:

```text
brainstorm-kanban, plan-interview-kanban, roadmap-kanban,
run-kanban, ship-kanban, ship-end-kanban
```

For direct board-management utilities, install:

```bash
scripts/pack.sh install poketowork-kanban
```

That pack contains `poketo-kanban` and `sync-roadmap-kanban`.

## Moved Skills

Former global business-app skills now live only in the `business-app` project pack.

Install them in the current project with:

```bash
scripts/pack.sh install business-app
```

Claude users can also run `/pack install business-app`; Codex users can run `$pack install business-app`.
