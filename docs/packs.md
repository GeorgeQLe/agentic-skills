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
  "enabled_packs": ["devtool", "business-app"],
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
      "packs": ["business-app"],
      "purpose": "CalcLLM-powered connected edition research, GTM, monetization, and SaaS product work."
    },
    {
      "path": "packages/calcllm-sync",
      "project_type": "business-app",
      "packs": ["business-app"],
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
scripts/pack.sh install business-app
scripts/pack.sh install devtool
scripts/pack.sh install code-quality
scripts/pack.sh install monorepo
scripts/pack.sh install remotion
scripts/pack.sh install game-kanban
scripts/pack.sh remove game
scripts/pack.sh refresh
scripts/pack.sh status
```

Assistant-native usage also supports guided setup:

- Claude: run `/pack` with no arguments.
- Codex: run `$pack` with no arguments.

If `.agents/project.json` already exists, bare `pack` refreshes local links from the committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing. Claude uses AskUserQuestion for that checkpoint; Codex uses a text-based Pack Decision Checkpoint that waits for an explicit reply before writing `.agents/project.json`.

The `refresh` command recreates `.claude/skills` and `.codex/skills` symlinks from `.agents/project.json`; it is not an in-session Claude Code or Codex skill reload. After `install`, `remove`, or `refresh`, start a fresh CLI session if the changed skills are not visible.

## Local Symlinks

Pack install creates symlinks in the current project:

```text
.claude/skills/<skill> -> <skill-library>/packs/<pack>/claude/<skill>
.codex/skills/<skill> -> <skill-library>/packs/<pack>/codex/<skill>
```

The skill source stays centralized in this repository. Projects opt into packs without copying skill bodies.

## Pack Selection

- Use `business-app` for SaaS, marketplaces, productivity apps, business workflows, and enterprise applications.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `game` for video games, prototypes, playable entertainment, and store-page/wishlist validation.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, and developer-facing platforms.
- Use `monorepo` for pnpm workspace monorepos, with optional Turborepo, that need package-aware lane specs, guardrails, and scoped shipping.
- Use `remotion` for Remotion-oriented format research, scene-by-scene video scripting, and build/scaffold planning.
- Use `business-app-kanban`, `game-kanban`, or `devtool-kanban` only when the project intentionally uses PoketoWork boards.

Kanban packs are never installed automatically by the base domain packs. Install the base domain pack and the matching kanban variant as separate, explicit choices:

```bash
scripts/pack.sh install business-app
scripts/pack.sh install business-app-kanban
```

The generic `poketowork-kanban` pack contains direct board-management utilities, including `poketo-kanban` and `sync-roadmap-kanban`.

## Monorepo Pack

The `monorepo` pack is an execution overlay for pnpm workspace repositories. It targets repositories with `pnpm-workspace.yaml` and optionally `turbo.json`.

```bash
scripts/pack.sh install monorepo
```

Skills:

```text
mono-detect, mono-run, mono-guard, mono-ship
```

The pack uses an augmentation injection pattern. Its skills add pre/post behavior around the global `run` and `ship` contracts instead of replacing them:

- `mono-detect` writes `.agents/monorepo.json` with workspace packages, package paths, package scripts, dependency graph, and Turborepo awareness.
- `mono-run` injects monorepo detection, lane-spec generation, guard pre-flight checks, serial cross-cutting work, and package-scoped dispatch around standard `run`.
- `mono-guard` validates lane specs before dispatch and checks integrated diffs against declared ownership after dispatch.
- `mono-ship` injects package-scoped test/lint/build and transitive-dependent validation before delegating to standard `ship`.

This differs from the `*-kanban` duplication pattern. Kanban packs intentionally provide alternate command variants such as `run-kanban`, `ship-kanban`, and `ship-end-kanban`; the monorepo pack keeps the global lifecycle skills authoritative and makes them workspace-aware through pre/post steps.

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

Install it alongside `creator-media` when a project needs the full path from channel evidence, positioning, programming, or product-led media strategy into production:

```bash
scripts/pack.sh install creator-media remotion
```

## Compatibility

If a tool does not discover project-local `.claude/skills` or `.codex/skills`, use the global `pack` and `research-roadmap` skills as launchers. They should read `.agents/project.json` and the local pack files directly.

Do not install `packs/*` globally as a fallback; that recreates the context pollution this design avoids.

Commit `.agents/project.json` with the project. Do not commit generated local skill links under `.claude/skills` or `.codex/skills`; recreate them with `/pack`, `$pack`, or `scripts/pack.sh refresh`.

`scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` preserve existing `project_scopes` and `notes` fields when `jq` is available.

Pack writes use `.agents/.pack.lock` with owner metadata (`pid`, `started_at`, `command`). If a previous pack command exits without releasing the lock and its recorded process is no longer running, the next pack command removes the stale lock automatically. If a live process still owns the lock, timeout errors include the owner metadata.

## Former Global Domain Skills

Business/product workflows that used to be globally installed now live only in the `business-app` pack. Restore them in a project with:

```bash
scripts/pack.sh install business-app
```

For assistant-native invocation, use `/pack install business-app` in Claude or `$pack install business-app` in Codex.
