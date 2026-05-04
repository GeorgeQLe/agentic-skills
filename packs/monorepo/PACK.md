# Monorepo Pack

Project-local workflows for pnpm workspace monorepos that need package-aware planning, execution, guardrails, and shipping.

Install this pack when a project uses `pnpm-workspace.yaml` and may use Turborepo via `turbo.json`, especially when roadmap phases need to split serial cross-cutting work from package-scoped parallel lanes. V1 focuses on pnpm workspaces plus Turborepo because those files provide stable detection, package graph, and build/test/lint orchestration signals.

Default flow:

```text
mono-detect -> mono-run -> mono-guard -> mono-ship
```

Install in a project with:

```bash
scripts/pack.sh install monorepo
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `mono-detect`: detects pnpm workspace structure, optional Turborepo overlay, package metadata, internal dependency graph, and writes `.agents/monorepo.json`.
- `mono-run`: augments the standard `/run` or `$run` lifecycle with monorepo detection, lane-spec generation, pre-flight guard checks, cross-cutting serial work, and package-scoped worktree dispatch when a phase is explicitly eligible.
- `mono-guard`: validates lane-spec artifacts before dispatch and verifies actual changed files stay inside declared lane ownership after integration.
- `mono-ship`: augments the standard `/ship` or `$ship` lifecycle with package-scoped validation and transitive-dependent validation before delegating to normal shipping.

## Augmentation Injection Pattern

This pack does not duplicate the global execution and shipping skills. It injects monorepo-aware pre/post steps around the existing contracts:

- Pre-execution: run `mono-detect`, read the phase execution profile, generate lane specs when appropriate, and run `mono-guard` pre-flight.
- Execution: keep root-only and cross-cutting steps serial in the main agent; dispatch only approved package-scoped lanes with disjoint `owns` paths.
- Post-integration: run `mono-guard` against the actual diff before package-scoped shipping.
- Pre-ship: use `.agents/monorepo.json` and lane specs to run package and transitive-dependent validation before delegating to `/ship` or `$ship`.

This differs from `*-kanban` packs, which intentionally provide workflow variants. The monorepo pack is an overlay that makes the normal skill pipeline workspace-aware while preserving the global skill contracts as the source of truth.

## Package-Scope Tags

Specs and roadmap phases may declare package scope with YAML frontmatter:

```yaml
---
packages: [api, web]
scope: cross-cutting
---
```

Valid `scope` values:

- `cross-cutting`: shared packages, multiple package boundaries, root coordination, or lockfile-affecting work; always serial.
- `package-scoped`: work contained to declared package paths; eligible for parallel lanes only after guard validation and user approval.
- `root-only`: root config, scripts, docs, or repository-level policy; always serial.

When `scope` is omitted, agents infer `package-scoped` for one declared package and `cross-cutting` for multiple declared packages.

## Turborepo Awareness

When `turbo.json` exists, monorepo pack skills defer build, test, and lint commands to `turbo run` so Turborepo can apply cache-aware, dependency-aware ordering. Without Turborepo, the pack falls back to `pnpm --filter` and the dependency graph in `.agents/monorepo.json`.

## V1 Scope

V1 includes:

- pnpm workspace detection from `pnpm-workspace.yaml`.
- Turborepo detection from `turbo.json`.
- `.agents/monorepo.json` as the package graph artifact.
- `.agents/lane-specs.json` plus `tasks/lane-specs.md` as the lane dispatch artifact.
- Guardrails for disjoint lane ownership, lockfile/root-config protection, dependency ordering, and post-integration boundary checks.
- Stop-all-lanes failure semantics that preserve failed worktree state for inspection.

V1 does not include:

- npm, Yarn, Lerna, or Nx support.
- Multi-repository to monorepo migration.
- Per-package task files.
- GitHub Actions or CI integration.
- Replacing the existing global `/mono-plan` or `/mono-guard` skills.

## Relationship To Global Monorepo Skills

The global `/mono-plan` skill remains the planning authority for safe lane decomposition across monorepo packages. The pack-local `mono-run` consumes those execution-profile concepts and materializes lane specs for a project-local run.

The global `/mono-guard` skill remains the behavioral compatibility reference for lane safety. The pack-local `mono-guard` provides project-local contracts and scripts for validating `.agents/lane-specs.json`, `.agents/monorepo.json`, and the integrated diff.

**Primary role:** Both - Claude-orchestration for lane review and approval; Codex-execution for detection scripts, artifacts, validation, and shipping.
