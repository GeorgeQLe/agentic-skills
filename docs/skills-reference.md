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

Global skills are domain-neutral and installed by `./init.sh` for every project. The global surface is intentionally small — six skills under `global/claude/` (mirrored under `global/codex/`), plus one Codex-only skill:

| Skill | Purpose |
| --- | --- |
| `codebase-status` | Report repo state, related conversation history, and outstanding work |
| `idea-scope-brief` | Shape a rough idea into a concept brief before ICP and market research |
| `init-agentic-skills` | Initialize global Claude and Codex managed skill installs from this checkout and route pack setup to the pack workflow |
| `pack` | Manage project-local packs and `.agents/project.json` |
| `provision-agentic-config` | Provision workflow orchestration and agent conventions into project agent docs |
| `skills` | Browse global and enabled project-local skills |

> `afps-status` ships **Codex-only** under `global/codex/` (no `global/claude/` mirror). Invoke it as `$afps-status` to summarize AFPS product-workflow progress and recommend the next concrete skill command.

All other formerly-global skills now live in domain packs — see [Moved Skills](#moved-skills) and the per-pack sections below.

### `delegate` (moved to the `agent-bridge` pack)

`delegate` is **no longer a global skill** — it now lives in `packs/agent-bridge/claude/delegate`. It remains **Claude-only** with no Codex mirror, so `$delegate` does not exist in Codex; install it with `scripts/pack.sh install agent-bridge` (or `scripts/pack.sh install delegate`).

`/delegate` is the synchronous sibling of `/handoff --target=codex`: it drafts and approves a packet using the shared `scripts/approved-plan.sh` helpers, then invokes `codex exec "<target-skill> --execute-approved"` inside the current Claude session instead of handing off for the user to resume later. It is hybrid-only by design and falls cleanly into the pre-start-failure branch of the fallback matrix if the `codex` binary is missing. See `packs/agent-bridge/claude/delegate/SKILL.md` for the full contract and `docs/operating-modes.md` § "Approval packet" for the lifecycle states.

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
customer-discovery, enterprise-icp, competitive-analysis, customer-feedback,
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

`hook-model` is an optional pre-UX/product-loop detour when journey evidence shows repeat use or habit formation is central to value. It is not mandatory for every business app; enterprise, infrastructure, transactional, or naturally infrequent products should usually use lifecycle or success measurement instead.

Business ops:

```text
assumption-tracker, cohort-review, retro, risk-register, burn-rate,
runway-model, investor-update, reconcile-research, mvp-gap,
scale-audit, platform-strategy, product-line
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

The pack uses an augmentation injection pattern rather than a duplication pattern. The global `exec` and `ship` skills remain the source of truth for task selection, validation policy, history updates, commit/push, deploy handling, and final next-step routing. The former `*-kanban` workflow-variant packs are hibernated while Poketo.work is being rebuilt.

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

## Hibernated Kanban Packs

PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt. They are preserved under `archive/hibernated-packs/2026-06-poketowork-rebuild/`, but are not active install or recommendation targets.

Hibernated packs:

```text
business-app-kanban, devtool-kanban, game-kanban, poketowork-kanban
```

Hibernated skill surfaces include `brainstorm-kanban`, `spec-interview-kanban`, `roadmap-kanban`, `exec-kanban`, `ship-kanban`, `ship-end-kanban`, `poketo-kanban`, and `sync-roadmap-kanban`.

## Engineering & Workflow Packs

The pack reorg moved the engineering, git, release, and plan-tracking skills out of global core into narrow packs. Each `Skills:` list is the authoritative on-disk skill set for that pack.

```bash
scripts/pack.sh install code-debug        # debug, investigate, trace
scripts/pack.sh install code-review        # dead-code, expert-review, regression-check, slim-audit
scripts/pack.sh install exec-loop          # exec, ship, ship-end
scripts/pack.sh install gitops             # commit-and-push-by-feature, sync
scripts/pack.sh install release-ops        # branch-lifecycle, deploy, release
scripts/pack.sh install agent-work-admin   # plan-phase, roadmap, spec-drift
scripts/pack.sh install code-maintenance   # migrate, update-packages
scripts/pack.sh install docs-health        # hygiene, reconcile-dev-docs
scripts/pack.sh install repo-maintenance   # bootstrap-repo
```

Two engineering packs are **Claude-only** (no Codex mirror):

- `agent-bridge` — `delegate` (live Claude→Codex delegation; see the [`delegate`](#delegate-moved-to-the-agent-bridge-pack) note above).
- `exec-profile` — `patch-exec-profile` (audit and fill missing lane/branch metadata in agent-team / implementation-safe execution profiles).

## Product, Design & Walkthrough Packs

```bash
scripts/pack.sh install product-design       # brainstorm, consolidate-variations, design-system,
                                              #   feature-interview, prototype, spec-interview,
                                              #   ui-interview, user-flow-map, ux-variations
scripts/pack.sh install product-testing      # dogfood, uat
scripts/pack.sh install guided-walkthrough   # guide, uat-guide
scripts/pack.sh install website-polish       # icon-handler
scripts/pack.sh install knowledge-check      # quiz-me
```

## Research, Sessions, Context & Skill-Dev Packs

```bash
scripts/pack.sh install research-admin        # research-roadmap
scripts/pack.sh install session-analytics     # analyze-sessions, session-triage
scripts/pack.sh install skill-dev             # create-agentic-skill, create-local-skill,
                                              #   skill-interview, targeted-skill-builder
scripts/pack.sh install context-transfer      # handoff
scripts/pack.sh install teardown              # decommission, desk-flip
scripts/pack.sh install report-gen            # report-website
scripts/pack.sh install alignment-page-admin  # compile-central-alignment
```

## Moved Skills

Former global business/product skills now live in narrower project packs. `business-app` remains a compatibility alias for all four business packs.

Prefer one of:

```bash
scripts/pack.sh install business-discovery
scripts/pack.sh install customer-lifecycle
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
```

The 53-skill global catalog was split into 22 narrower packs in the pack reorg. The engineering and workflow skills that used to be global now live in the packs above — `code-debug`, `code-review`, `exec-loop`, `gitops`, `release-ops`, `agent-bridge`, `agent-work-admin`, `code-maintenance`, `docs-health`, and `repo-maintenance` — and `affected`/`scaffold` moved into `monorepo`. Creator-media and YouTube work is similarly split between `creator-foundation`, `youtube-ops`, and `remotion`. Fleet/portfolio work moved from global core into `project-fleet`.
