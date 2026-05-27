# Project-Local Skill Packs

Project-local packs keep domain-specific workflows out of global assistant context.

## Design

- Global skills live in `global/{claude,codex}`.
- Domain packs live in `packs/<pack>/{claude,codex}`.
- Project designation lives in `.agents/project.json`.
- Mixed monorepos can declare scoped domain routing in `.agents/project.json.project_scopes`.

Example:

```json
{
  "project_type": "game",
  "enabled_packs": ["game"],
  "skill_pack_version": 1
}
```

Mixed monorepo example:

```json
{
  "project_type": "devtool",
  "enabled_packs": ["devtool", "business-discovery", "business-growth"],
  "skill_pack_version": 1,
  "project_scopes": [
    {
      "path": "apps/pitwall-local",
      "project_type": "devtool",
      "packs": ["devtool"],
      "purpose": "Pitwall Local / OSS developer utility work."
    },
    {
      "path": "apps/pitwall-calcllm",
      "project_type": "business-app",
      "packs": ["business-discovery", "business-growth"],
      "purpose": "CalcLLM-powered connected edition research, GTM, monetization, and SaaS product work."
    },
    {
      "path": "packages/calcllm-sync",
      "project_type": "business-app",
      "packs": ["business-discovery", "business-growth"],
      "purpose": "Connected-edition sync and SaaS integration work."
    }
  ]
}
```

In this model, `project_type` is the default designation for uncategorized work, `enabled_packs` is the union of local skills available in the repo, and each `project_scopes[]` entry tells agents which pack family to apply for a path or glob.

## Commands

```bash
scripts/pack.sh list
scripts/pack.sh recommend
scripts/pack.sh install game
scripts/pack.sh install business-discovery
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
scripts/pack.sh install devtool
scripts/pack.sh install creator-foundation
scripts/pack.sh install youtube-ops
scripts/pack.sh install code-quality
scripts/pack.sh install agentic-skills-bench
scripts/pack.sh install monorepo
scripts/pack.sh install remotion
scripts/pack.sh install project-fleet
scripts/pack.sh install alignment-loop
scripts/pack.sh install game-kanban
scripts/pack.sh remove game
scripts/pack.sh refresh
scripts/pack.sh status
```

Assistant-native usage also supports guided setup:

- Claude: run `/pack` with no arguments.
- Codex: run `$pack` with no arguments.

If `.agents/project.json` already exists, bare `pack` refreshes local skill roots from the committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing. Claude uses AskUserQuestion for that checkpoint; Codex uses a text-based Pack Decision Checkpoint that waits for an explicit reply before writing `.agents/project.json`.

The `refresh` command recreates `.claude/skills` and `.codex/skills` managed skill roots from `.agents/project.json`; it is not an in-session Claude Code or Codex skill reload. After `install`, `remove`, or `refresh`, start a fresh CLI session if the changed skills are not visible.

## Local Skill Roots

Pack install creates repo-managed skill roots in the current project:

```text
.claude/skills/<skill>/SKILL.md
.codex/skills/<skill>/SKILL.md
```

The skill source stays centralized in this repository. Projects opt into packs without copying skill bodies, and active installed roots exclude archived `SKILL.md` snapshots.

## Pack Selection

- Use `business-discovery` for ICP, market/customer discovery, value proposition, positioning, lean canvas, and journeys.
- Use `business-growth` for GTM, growth, metrics, monetization, landing copy, experiments, and PMF.
- Use `business-ops` for assumptions, feedback/cohorts/retros, risks, runway, stakeholder updates, platform strategy, and research reconciliation.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `agentic-skills-bench` when working in this repository and needing to verify or benchmark-test one skill with the local harness.
- Use `game` for video games, prototypes, playable entertainment, and store-page/wishlist validation.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, and developer-facing platforms.
- Use `creator-foundation` for creator-media evidence foundations, dossiers, positioning, programming, series, product-led media mapping, and metrics review.
- Use `youtube-ops` for YouTube channel/video audits, external-video context, competitive research, packaging, metadata, portfolio, benchmarking, search, and cadence.
- Use `monorepo` for pnpm workspace monorepos, with optional Turborepo, that need package-aware lane specs, guardrails, and scoped shipping.
- Use `remotion` for Remotion-oriented format research, scene-by-scene video scripting, and build/scaffold planning.
- Use `project-fleet` for control repos that manage many downstream repos, clone/spec-store portfolios, or spin-offs.
- Use `alignment-loop` for lightweight operator-agent calibration before committing to a full spec-interview pipeline.
- Use `business-app-kanban`, `game-kanban`, or `devtool-kanban` only when the project intentionally uses PoketoWork boards.

Kanban packs are never installed automatically by the base domain packs. Install the base domain pack and the matching kanban variant as separate, explicit choices:

```bash
scripts/pack.sh install business-discovery
scripts/pack.sh install business-app-kanban
```

`business-app` is a compatibility alias that expands to `business-discovery`, `business-growth`, and `business-ops`. `creator-media` is a compatibility alias that expands to `creator-foundation` and `youtube-ops`.

For the full workflow/dependency matrix, see [`docs/pack-workflow-matrix.md`](pack-workflow-matrix.md).

The generic `poketowork-kanban` pack contains direct board-management utilities, including `poketo-kanban` and `sync-roadmap-kanban`.

## Monorepo Pack

The `monorepo` pack is an execution overlay for pnpm workspace repositories. It targets repositories with `pnpm-workspace.yaml` and optionally `turbo.json`.

```bash
scripts/pack.sh install monorepo
```

Skills:

```text
mono-detect, mono-exec, mono-guard, mono-ship
```

The pack uses an augmentation injection pattern. Its skills add pre/post behavior around the global `exec` and `ship` contracts instead of replacing them:

- `mono-detect` writes `.agents/monorepo.json` with workspace packages, package paths, package scripts, dependency graph, and Turborepo awareness.
- `mono-exec` injects monorepo detection, lane-spec generation, guard pre-flight checks, serial cross-cutting work, and package-scoped dispatch around standard `run`.
- `mono-guard` validates lane specs before dispatch and checks integrated diffs against declared ownership after dispatch.
- `mono-ship` injects package-scoped test/lint/build and transitive-dependent validation before delegating to standard `ship`.

This differs from the `*-kanban` duplication pattern. Kanban packs intentionally provide alternate command variants such as `exec-kanban`, `ship-kanban`, and `ship-end-kanban`; the monorepo pack keeps the global lifecycle skills authoritative and makes them workspace-aware through pre/post steps.

Lane dispatch uses two artifacts:

```text
.agents/lane-specs.json
tasks/lane-specs.md
```

`.agents/lane-specs.json` is the machine-readable lane plan. `tasks/lane-specs.md` is the committed human-readable mirror. Lane lifecycle values are `draft`, `approved`, `dispatched`, `integrated`, and `failed`; package lanes declare `packages`, `owns`, `must_not_edit`, `depends_on`, and `mode`.

Specs and roadmap phases may declare package scope with YAML frontmatter:

```yaml
---
packages: [api, web]
scope: cross-cutting
---
```

Use `scope: package-scoped` when work is contained to declared package paths, `scope: cross-cutting` when work touches shared packages or multiple package boundaries, and `scope: root-only` for root config, scripts, docs, or repository policy. If `scope` is omitted, agents infer `package-scoped` for one package and `cross-cutting` for multiple packages.

## Remotion Pack

The `remotion` pack contains the production path that turns reference-video research and creator-media strategy into Remotion-ready artifacts.

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

Install it alongside `creator-foundation` and, when YouTube evidence is needed, `youtube-ops` for the full path from channel evidence, positioning, programming, or product-led media strategy into production:

```bash
scripts/pack.sh install creator-foundation youtube-ops remotion
```

## Alignment Loop Pack

The `alignment-loop` pack is a lightweight planning on-ramp for projects that need shared taste and intent before a full specification cycle.

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

## Compatibility

If a tool does not discover project-local `.claude/skills` or `.codex/skills`, use the global `pack` and `research-roadmap` skills as launchers. They should read `.agents/project.json` and the local pack files directly.

Do not install `packs/*` globally as a fallback; that recreates the context pollution this design avoids.

Commit `.agents/project.json` with the project. Do not commit generated local skill roots under `.claude/skills` or `.codex/skills`; recreate them with `/pack`, `$pack`, or `scripts/pack.sh refresh`.

`scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` preserve existing `project_scopes` and `notes` fields when `jq` is available.

Pack writes use `.agents/.pack.lock` with owner metadata (`pid`, `started_at`, `command`). If a previous pack command exits without releasing the lock and its recorded process is no longer running, the next pack command removes the stale lock automatically. If a live process still owns the lock, timeout errors include the owner metadata.

## Former Global Domain Skills

Business/product workflows that used to be globally installed now live in narrow business packs. Prefer the current lane:

```bash
scripts/pack.sh install business-discovery
scripts/pack.sh install customer-lifecycle
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
```

`business-app` remains a compatibility alias that installs all four. Creator-media and YouTube work is split between `creator-foundation`, `youtube-ops`, and `remotion`; fleet/portfolio work lives in `project-fleet`.
