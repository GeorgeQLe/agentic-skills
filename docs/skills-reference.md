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

`scripts/pack.sh list-packs` is an internal subcommand used by Codex `$run` routing (see `global/codex/run/SKILL.md`). It prints enabled packs from `.agents/project.json` one per line with no decoration, distinct from the human-facing `list` which enumerates all available packs. Prefer `list` or `status` for interactive use.

`refresh` recreates project-local symlinks from `.agents/project.json`; it does not reload an active Claude Code or Codex process. Start a fresh CLI session after pack changes if the changed skills are not visible.

## Next-Step Validity

Recommended next steps are governed by `docs/skill-next-step-contracts.md`. A skill may recommend another skill only when the target skill exists in the active platform/pack context and the current end state satisfies that target's prerequisites. Multi-state skills must branch by end state, and a terminal "no useful follow-up" state should say `No follow-up skill recommended` rather than invent work.

## Global Core Skills

Global skills are safe across business apps, games, devtools, libraries, services, and infrastructure:

| Skill | Purpose |
| --- | --- |
| `affected` | Analyze which monorepo packages and apps are affected by current changes |
| `analyze-sessions` | Analyze Claude Code session history and recommend automation |
| `bootstrap-repo` | Initialize repository README and agent workflow docs from a project brief |
| `brainstorm` | Evaluate the codebase and suggest ideas to explore with planning |
| `branch-lifecycle` | Evaluate feature branches for merge, salvage, keep-open, or delete decisions |
| `clone-spec-store` | Build lawful functional-parity spec stores and private downstream clone repos |
| `commit-and-push-by-feature` | Commit and push changes grouped by logical feature buckets |
| `concept-exploration` | Shape a rough idea into a concept brief before ICP and market research |
| `dead-code` | Scan for unused exports, unreachable code, orphaned files, and stale dependencies |
| `debug` | Investigate a problem, log findings, and suggest a non-duplicate fix |
| `decommission` | Tear down and remove a service, package, or infrastructure component |
| `deploy` | Deploy the project to a target environment with deployment history tracking |
| `dogfood` | Create owner/operator scenarios for adopting the product into the builder's workflow |
| `expert-review` | Conduct a project-wide code review against specs, docs, and implementation |
| `guide` | Produce click-by-click instructions for manual blockers |
| `handoff` | Generate a project-level context snapshot for a fresh session |
| `hygiene` | Audit project structure, conventions, mirrors, and documentation references |
| `provision-agentic-config` | Provision workflow orchestration and agent conventions into project agent docs |
| `investigate` | Validate claims against codebase and git history, then trace root cause |
| `migrate` | Guide a structural migration or dependency upgrade |
| `pack` | Manage project-local packs and `.agents/project.json` |
| `patch-exec-profile` | Audit and fill missing lane metadata in agent-team/implementation-safe execution profiles |
| `spec-interview` | Interview to validate and complete an implementation specification |
| `ui-interview` | Interview page by page to define implementation-ready UI detail |
| `ux-variation` | Plan and compare onboarding, workflow, sharing, return-use, and UI variants before locking an experience |
| `plan-phase` | Decompose a single roadmap phase into implementation steps, tests, and file-level detail |
| `reconcile-dev-docs` | Reconcile roadmap, todo, history, phase archives, specs, and git evidence |
| `regression-check` | Run a comprehensive health check after a phase or major change |
| `release` | Version bump, changelog, tag, and prepare a release |
| `roadmap` | Scan task pipeline health, build or update the project roadmap, and maintain a priority task queue |
| `run` | Execute the next incomplete step or phase, then ship the result |
| `scaffold` | Generate a new package or app using repo conventions |
| `ship` | Ship already-finished work, optionally deploy it, and prepare the next step |
| `ship-end` | Wrap up the current session, update docs, commit, and push |
| `skills` | Browse global and enabled project-local skills |
| `slim-audit` | Audit for opportunities to reduce lines of code while preserving behavior |
| `spec-drift` | Audit specs against codebase reality |
| `sync` | Pull latest remote changes and report status |
| `trace` | Follow a request end-to-end through the stack |
| `research-roadmap` | Scan research and documentation health, then maintain a priority documentation queue |
| `uat` | Create target-user acceptance journeys with role-based criteria and evidence capture |
| `uat-guide` | Expand a UAT journey into click-by-click tester instructions and update result logs |

### Claude-only Global Skills

The following global skill ships only under `global/claude/`. It has **no Codex mirror**, so `$delegate` does not exist in Codex — do not expect a symmetric invocation.

| Skill | Platform | Purpose |
| --- | --- | --- |
| `delegate` | Claude-only | Live in-session delegation from Claude to Codex via the approval/delegation packet contract (`hybrid`-only). |

`/delegate` is the synchronous sibling of `/handoff --target=codex`: it drafts and approves a packet using the shared `scripts/approved-plan.sh` helpers, then invokes `codex exec "<target-skill> --execute-approved"` inside the current Claude session instead of handing off for the user to resume later. It is hybrid-only by design and falls cleanly into the pre-start-failure branch of the fallback matrix if the `codex` binary is missing. See `global/claude/delegate/SKILL.md` for the full contract and `docs/operating-modes.md` § "Approval packet" for the lifecycle states.

## Business App Pack

Install in SaaS, marketplace, productivity, business workflow, and enterprise projects:

```bash
scripts/pack.sh install business-app
```

Skills:

```text
icp, enterprise-icp, competitive-analysis, customer-feedback,
value-prop-canvas, lean-canvas, hook-model, growth-model, pmf-assessment,
journey-map, metrics, gtm, monetization, positioning, landing-copy,
mvp-gap, scale-audit, assumption-tracker, experiment, cohort-review,
retro, risk-register, burn-rate, runway-model, investor-update,
platform-strategy, reconcile-research
```

Default flow (18-step):

```text
DISCOVER:
 1. concept-exploration        shape the idea
 2. icp                        discover target customers
 3. competitive-analysis       map the market

VALIDATE FIT:
 4. value-prop-canvas          does solution match customer?
 5. positioning                frame against alternatives
 6. lean-canvas                synthesize 1-page business model

DESIGN THE EXPERIENCE:
 7. journey-map                map discovery → advocacy path
 8. hook-model                 design habit loops (skip for B2B)

DESIGN THE BUSINESS:
 9. metrics                    define success targets
10. monetization               design pricing & revenue
11. gtm                        plan go-to-market
12. growth-model               design compounding loops

SPEC & BUILD:
13. spec-interview             turn research into specs
14. ux-variation               explore experience alternatives
15. ui-interview               lock interface detail
16. roadmap                    sequence into phases
17. plan-phase → run → ship

VALIDATE PMF:
18. pmf-assessment             measure product-market fit
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

## Code Quality Pack

Install alongside a domain pack when a project needs behavior-preserving code health refactors:

```bash
scripts/pack.sh install code-quality
```

Skills:

```text
quality-sweep, extract-shared-types
```

Default flow:

```text
quality-sweep audit -> extract-shared-types / quality-sweep fix -> regression-check
```

## Creator Media Pack

Install in YouTube, founder-media, creator-portfolio, and product-led media projects:

```bash
scripts/pack.sh install creator-media
```

Skills:

```text
creator-platform-capability-matrix, creator-evidence-schema,
creator-presence-dossier, youtube-channel-audit, youtube-video-audit,
youtube-title-thumbnail-audit, youtube-portfolio, youtube-peer-benchmark, youtube-search-positioning,
youtube-cadence-diagnosis, creator-positioning, content-programming,
series-spec, product-led-media-map, creator-metrics-review
```

Default flow:

```text
creator-platform-capability-matrix -> creator-evidence-schema
-> creator-presence-dossier -> creator-positioning / content-programming / product-led-media-map / creator-metrics-review
-> youtube-channel-audit / youtube-video-audit / platform-specific audit
-> youtube-title-thumbnail-audit -> youtube-portfolio
-> youtube-peer-benchmark -> youtube-search-positioning / youtube-cadence-diagnosis
-> creator-positioning -> content-programming -> series-spec
-> product-led-media-map -> creator-metrics-review
```

The pack is evidence-first: non-YouTube or mixed-platform work starts with `creator-platform-capability-matrix` and `creator-evidence-schema`, which define `research/creator-platforms/` artifacts before platform-specific audits. Creator/persona research starts with `creator-presence-dossier`, which feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`. YouTube-specific work may still start at `youtube-channel-audit` for channel-level patterns or `youtube-video-audit` for one video's performance, release timing, packaging, comments, transcript/content, and optional owner analytics; both persist raw evidence under `research/youtube/data/`. Downstream skills then reuse available evidence for packaging, portfolio, benchmark, search-positioning, cadence, positioning, programming, series, product-led media, and metrics-review work. Validation target shapes include `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.

## Kanban Variant Packs

Install only in projects that intentionally use PoketoWork boards. Base domain packs do not install these automatically.

```bash
scripts/pack.sh install business-app-kanban
scripts/pack.sh install game-kanban
scripts/pack.sh install devtool-kanban
```

Skills:

```text
brainstorm-kanban, spec-interview-kanban, roadmap-kanban,
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
