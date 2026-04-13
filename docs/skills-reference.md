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
| `affected` | Analyze which monorepo packages and apps are affected by current changes |
| `analyze-sessions` | Analyze Claude Code session history and recommend automation |
| `brainstorm` | Evaluate the codebase and suggest ideas to explore with planning |
| `branch-lifecycle` | Evaluate feature branches for merge, salvage, keep-open, or delete decisions |
| `commit-and-push-by-feature` | Commit and push changes grouped by logical feature buckets |
| `dead-code` | Scan for unused exports, unreachable code, orphaned files, and stale dependencies |
| `debug` | Investigate a problem, log findings, and suggest a non-duplicate fix |
| `decommission` | Tear down and remove a service, package, or infrastructure component |
| `deploy` | Deploy the project to a target environment with deployment history tracking |
| `expert-review` | Conduct a project-wide code review against specs, docs, and implementation |
| `guide` | Produce click-by-click instructions for manual blockers |
| `handoff` | Generate a project-level context snapshot for a fresh session |
| `hygiene` | Audit project structure, conventions, mirrors, and documentation references |
| `install-workflow-orchestration` | Install workflow orchestration instructions into project agent docs |
| `investigate` | Validate claims against codebase and git history, then trace root cause |
| `migrate` | Guide a structural migration or dependency upgrade |
| `pack` | Manage project-local packs and `.agents/project.json` |
| `plan-interview` | Interview to validate and complete an implementation specification |
| `plan-phases` | Break a finalized spec into phases, steps, milestones, and tests |
| `reconcile-dev-docs` | Reconcile roadmap, todo, history, phase archives, specs, and git evidence |
| `regression-check` | Run a comprehensive health check after a phase or major change |
| `release` | Version bump, changelog, tag, and prepare a release |
| `roadmap` | Build or update phased roadmaps from specs, docs, and project history |
| `run` | Execute the next incomplete step or phase, then ship the result |
| `scaffold` | Generate a new package or app using repo conventions |
| `ship` | Ship already-finished work, optionally deploy it, and prepare the next step |
| `ship-end` | Wrap up the current session, update docs, commit, and push |
| `skills` | Browse global and enabled project-local skills |
| `slim-audit` | Audit for opportunities to reduce lines of code while preserving behavior |
| `spec-drift` | Audit specs against codebase reality |
| `sync` | Pull latest remote changes and report status |
| `trace` | Follow a request end-to-end through the stack |
| `workflow` | Read-only workflow status and next-action recommendation |

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
