# Skills Reference

Skills are split into global core skills and project-local packs.

## Global Install

```bash
./init.sh
```

Installs only:

- `global/claude/*`
- `global/codex/*`

It does not install domain packs globally.

## Project Pack Commands

```bash
scripts/pack.sh list
scripts/pack.sh recommend
scripts/pack.sh install <pack-or-skill>
scripts/pack.sh remove <pack-or-skill>
scripts/pack.sh which <skill>
scripts/pack.sh refresh
scripts/pack.sh status
```

Project designation is stored in `.agents/project.json`.

`install <name>` accepts either a pack name or a skill name from any pack. Pack names install all skills in that pack; skill names install only that one local skill and store `{skill: pack}` provenance under `.agents/project.json` `enabled_skills`.

`scripts/pack.sh list-packs` is an internal subcommand used by Codex `$exec` routing (see `global/codex/exec/SKILL.md`). It prints enabled packs from `.agents/project.json` one per line with no decoration, distinct from the human-facing `list` which enumerates all available packs. Prefer `list` or `status` for interactive use.

`refresh` recreates project-local skill roots from `.agents/project.json`; it does not reload an active Claude Code or Codex process. Start a fresh CLI session after pack changes if the changed skills are not visible.

For workflow ordering, lead-in recommendations, and overlay dependencies, see [`docs/pack-workflow-matrix.md`](pack-workflow-matrix.md).

## Next-Step Validity

Recommended next steps are governed by `docs/skill-next-step-contracts.md`. A skill may recommend another skill only when the target skill exists in the active platform/pack context and the current end state satisfies that target's prerequisites. Multi-state skills must branch by end state, and a terminal "no useful follow-up" state should say `No follow-up skill recommended` rather than invent work.

## Skills Showcase Freshness

Generator scripts dual-write to both `docs/skills-showcase/assets/` and `apps/skills-showcase/public/assets/`. The Next.js app at `apps/skills-showcase/` is the sole showcase surface.

When a tracked `SKILL.md` or `PACK.md` is created, deleted, renamed, or changed in behavior or metadata, refresh and validate the showcase before shipping:

```bash
node scripts/generate-skills-showcase-data.mjs
node scripts/generate-skills-showcase-github-data.mjs
scripts/validate-skills-showcase-data.sh
```

The validator fingerprints all four generated assets across both output paths. Include changed generated assets in the same commit as the skill change. Also review curated website copy, catalog grouping, workflow animation text, and proof receipts when the skill change affects public-facing behavior. `docs/skills-showcase/assets/` is kept for dual-write; the static site HTML/CSS/JS files were removed in Step 37.6. This is a static-data contract only; it does not add a runtime API, database, GitHub Actions workflow, video/Remotion pipeline, analytics, or live product metrics.

## Benchmark Coverage Freshness

Every repository skill under `global/` or `packs/` must be represented in `tests/harness/bench-coverage.ts`. When a shared skill is created or materially updated, the same shipping boundary must add or update its benchmark coverage row:

- Use `coverage_status: "custom"` with a registered deterministic setup under `tests/layer4/setups/` when local fixtures can exercise the workflow safely.
- For custom setups, add a deterministic output-quality rubric when practical. Prefer local fixture facts, concrete file or command references, expected next-route handoffs, specificity checks, reference traits, and forbidden-fabrication checks over subjective prose scoring.
- If deterministic quality scoring is not reliable, record an explicit blocked/deferred quality note in the setup or coverage review so the gap is visible.
- Use `coverage_status: "blocked"` with `blocked_reason` and `next_command` when custom coverage depends on credentials, external services, paid actions, production deploys, real devices, or unsafe account state.
- Keep `coverage_status: "generic"` only as an explicit smoke fallback while custom coverage is still pending.

Validate the matrix with:

```bash
pnpm --dir tests bench:coverage
```

If a skill only has generic smoke coverage and needs domain-quality assertions, route to `targeted-skill-builder <skill> benchmark coverage`.

## Global Core Skills

Global skills are safe across business apps, games, devtools, libraries, services, and infrastructure:

| Skill | Purpose |
| --- | --- |
| `affected` | Analyze which monorepo packages and apps are affected by current changes |
| `analyze-sessions` | Analyze Claude/Codex session history trends and recommend automation |
| `bootstrap-repo` | Initialize repository README and agent workflow docs from a project brief |
| `brainstorm` | Evaluate the codebase and suggest ideas to explore with planning |
| `branch-lifecycle` | Evaluate feature branches for merge, salvage, keep-open, or delete decisions |
| `codebase-status` | Report repo state, related conversation history, and outstanding work |
| `commit-and-push-by-feature` | Commit and push changes grouped by logical feature buckets |
| `idea-scope-brief` | Shape a rough idea into a concept brief before ICP and market research |
| `dead-code` | Scan for unused exports, unreachable code, orphaned files, and stale dependencies |
| `debug` | Investigate a problem, log findings, and suggest a non-duplicate fix |
| `decommission` | Tear down and remove a service, package, or infrastructure component |
| `deploy` | Deploy the project to a target environment with deployment history tracking |
| `dogfood` | Create owner/operator scenarios for adopting the product into the builder's workflow |
| `expert-review` | Conduct a project-wide code review against specs, docs, and implementation |
| `guide` | Produce click-by-click instructions for manual blockers |
| `handoff` | Generate a project-level context snapshot for a fresh session |
| `hygiene` | Audit project structure, conventions, mirrors, and documentation references |
| `icon-handler` | Audit and apply project-root icon assets across favicon, app icon, Apple, and manifest surfaces |
| `init-agentic-skills` | Initialize global Claude and Codex managed skill installs from this checkout and route pack setup to the pack workflow |
| `provision-agentic-config` | Provision workflow orchestration and agent conventions into project agent docs |
| `investigate` | Validate claims against codebase and git history, then trace root cause |
| `migrate` | Guide a structural migration or dependency upgrade |
| `pack` | Manage project-local packs and `.agents/project.json` |
| `patch-exec-profile` | Audit and fill missing lane/branch metadata in agent-team/implementation-safe execution profiles |
| `feature-interview` | Interview a feature idea with evidence-backed alignment, then decide whether to update docs, specs, roadmap, or tasks |
| `spec-interview` | Interview to validate and complete an implementation specification |
| `ui-interview` | Interview page by page to define implementation-ready UI detail |
| `ux-variations` | Plan and compare onboarding, workflow, sharing, return-use, and UI variants before locking an experience |
| `consolidate-variations` | Converge evaluated UI variants into a final implementation-ready UI spec |
| `prototype` | Build tangible, runnable prototypes from UX variation and UI specs |
| `plan-phase` | Decompose a single roadmap phase into implementation steps, tests, and file-level detail |
| `reconcile-dev-docs` | Reconcile roadmap, todo, history, phase archives, specs, and git evidence |
| `regression-check` | Run a comprehensive health check after a phase or major change |
| `release` | Version bump, changelog, tag, and prepare a release |
| `roadmap` | Scan task pipeline health, build or update the project roadmap, and maintain a priority task queue |
| `run` | Execute the next incomplete step or phase, then ship the result |
| `scaffold` | Generate a new package or app using repo conventions |
| `session-triage` | Investigate one immediate session issue, correction, repo incident, or skill failure |
| `ship` | Ship already-finished work, optionally deploy it, and prepare the next step |
| `ship-end` | Wrap up the current session, update docs, commit, and push |
| `skills` | Browse global and enabled project-local skills |
| `slim-audit` | Audit for opportunities to reduce lines of code while preserving behavior |
| `spec-drift` | Audit specs against codebase reality |
| `sync` | Pull latest remote changes and report status |
| `targeted-skill-builder` | Build or update one specific skill from a concrete workflow gap or correction |
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

## Business Packs

Install the narrow business lane needed for the current phase:

```bash
scripts/pack.sh install business-discovery
scripts/pack.sh install customer-lifecycle
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
```

`business-app` remains a compatibility alias that installs all four.

Business discovery:

```text
icp, enterprise-icp, competitive-analysis, customer-feedback,
value-prop-canvas, lean-canvas, positioning
```

Customer lifecycle:

```text
journey-map, onboarding-map, conversion-map, transaction-map,
retention-map, expansion-map, lifecycle-metrics
```

Business growth:

```text
hook-model, growth-model, metrics, gtm, monetization,
landing-copy, pmf-assessment, experiment
```

Business ops:

```text
assumption-tracker, cohort-review, retro, risk-register, burn-rate,
runway-model, investor-update, reconcile-research, mvp-gap,
scale-audit, platform-strategy
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

## Agentic Skills Bench Pack

Install when working in this repository and measuring one skill with the local verify and benchmark harness:

```bash
scripts/pack.sh install agentic-skills-bench
```

Skills:

```text
benchmark-test-skill, benchmark-agent-review
```

Default flow:

```text
benchmark-test-skill <skill> -> benchmark-agent-review <skill> when subjective artifact quality needs review / targeted-skill-builder on generic or blocked coverage / session-triage on failure / ship on pass
```

## Monorepo Pack

Install in pnpm workspace monorepos that may use Turborepo and need package-aware planning, guarded execution, and scoped shipping:

```bash
scripts/pack.sh install monorepo
```

Skills:

```text
mono-detect, mono-exec, mono-guard, mono-ship
```

Default flow:

```text
mono-detect -> mono-exec -> mono-guard -> mono-ship
```

`mono-detect` writes `.agents/monorepo.json` with workspace packages, package paths, dependency graph, script inventory, and Turborepo awareness. `mono-exec` augments standard `run` with lane-spec generation, `mono-guard` pre-flight checks, serial cross-cutting work, package-scoped dispatch on separate GitHub branches, and consolidation/PR review before integration. `mono-guard` validates lane specs before dispatch and audits integrated diffs against declared boundaries and PR-review evidence. `mono-ship` augments standard `ship` with package-scoped test/lint/build and transitive-dependent validation before delegating to normal shipping.

The pack uses an augmentation injection pattern rather than a duplication pattern. The global `exec` and `ship` skills remain the source of truth for task selection, validation policy, history updates, commit/push, deploy handling, and final next-step routing. By contrast, `*-kanban` packs provide explicit workflow variants such as `exec-kanban`, `ship-kanban`, and `ship-end-kanban`.

Lane dispatch uses `.agents/lane-specs.json` as the machine-readable artifact and `tasks/lane-specs.md` as the committed Markdown mirror. Lifecycle values are `draft`, `approved`, `dispatched`, `integrated`, and `failed`; package lanes declare `packages`, `owns`, `must_not_edit`, `depends_on`, `mode`, and `branch`. For `agent-team` work, each write lane must push its non-primary GitHub branch and provide commit SHA, validation evidence, and PR URL before the consolidation/PR review gate approves integration.

Specs and roadmap phases may declare package scope with YAML frontmatter:

```yaml
---
packages: [api, web]
scope: cross-cutting
---
```

Use `scope: package-scoped` for work contained to declared packages, `scope: cross-cutting` for shared packages or multiple package boundaries, and `scope: root-only` for root config, scripts, docs, or repository-level policy.

## Creator Media Packs

Install the narrow creator-media lane needed for the current phase:

```bash
scripts/pack.sh install creator-foundation
scripts/pack.sh install youtube-ops
```

`creator-media` remains a compatibility alias that installs both.

Creator foundation:

```text
research-directory-conventions,
creator-platform-capability-matrix, creator-evidence-schema,
creator-presence-dossier, creator-positioning, content-programming,
series-spec, product-led-media-map, creator-metrics-review
```

LinkedIn-first evidence work uses the creator foundation path:

```text
creator-platform-capability-matrix -> creator-evidence-schema -> creator-presence-dossier
```

Use owner exports, manual snapshots, public unauthenticated captures, and user-provided files as the baseline. Paid APIs, logged-in scraping, bot-protection bypass, private-data collection, private relationship graph extraction, paywall access, and access-control circumvention are out of scope; analytics are unavailable unless owner-provided, admin-provided, or already authorized.

YouTube ops:

```text
youtube-audit, youtube-channel-audit, youtube-video-audit,
youtube-vid-research, youtube-competitive-research,
youtube-title-thumbnail-audit, youtube-description-optimizer,
youtube-portfolio, youtube-peer-benchmark, youtube-search-positioning,
youtube-cadence-diagnosis
```

Use `remotion` for format analysis, video scripting, and Remotion build planning.

## Project Fleet Pack

Install in control repositories that manage downstream repo portfolios or spin-offs:

```bash
scripts/pack.sh install project-fleet
```

Skills:

```text
clone-spec-store, project-fleet, spin-off
```

Default flow:

```text
clone-spec-store -> project-fleet -> spin-off
```

## Alignment Loop Pack

Install when a project needs lightweight operator-agent calibration before the full spec-interview pipeline:

```bash
scripts/pack.sh install alignment-loop
```

Skills:

```text
taste-calibration, destination-doc, vertical-slice-splitter
```

Default flow:

```text
taste-calibration -> destination-doc -> vertical-slice-splitter -> implementation
```

## Remotion Pack

Install in projects that need Remotion-oriented video production:

```bash
scripts/pack.sh install remotion
```

Skills:

```text
youtube-format-research, video-script, video-build
```

Default flow:

```text
youtube-format-research -> video-script -> video-build
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
brainstorm-kanban, spec-interview-kanban, roadmap-kanban,
exec-kanban, ship-kanban, ship-end-kanban
```

For direct board-management utilities, install:

```bash
scripts/pack.sh install poketowork-kanban
```

That pack contains `poketo-kanban` and `sync-roadmap-kanban`.

## Moved Skills

Former global business/product skills now live in narrower project packs. `business-app` remains a compatibility alias for all four business packs.

Prefer one of:

```bash
scripts/pack.sh install business-discovery
scripts/pack.sh install customer-lifecycle
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
```

Creator-media and YouTube work is similarly split between `creator-foundation`, `youtube-ops`, and `remotion`. Fleet/portfolio work moved from global core into `project-fleet`.
