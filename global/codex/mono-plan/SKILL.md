---
name: mono-plan
description: Detect monorepo structure, identify shared chokepoints, and generate safe parallel lane specs aligned to package boundaries
type: planning
version: 1.0.0
---

# Mono Plan

Invoke as `$mono-plan`.

Use this skill when the user needs to plan safe parallel work across a monorepo. Generates lane specs aligned to package boundaries with lockfile and root config safety built in.

Run after `/roadmap` sets `agent-team` or `implementation-safe` on a phase, before `/plan-phase` decomposes it.

## Workflow

1. Detect monorepo structure (`pnpm-workspace.yaml`, `turbo.json`, `lerna.json`, `package.json` workspaces). Stop if not a monorepo.
2. Enumerate packages, read each `package.json`, build internal dependency graph.
3. Identify shared chokepoints: lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`), root configs (`tsconfig.base.json`, `turbo.json`, etc.), high-fan-out shared packages (3+ dependents).
4. Read the target phase from `tasks/roadmap.md`, map scope to specific packages.
5. Classify packages: independent, dependent, or shared.
6. Recommend strategy: `agent-team` (independent packages with branch-backed lanes), `serial` (linear chain), or mixed with dependency edges.
7. Generate lane specs in execution profile format:
   - **Lane 0 (deps):** serial lane owning lockfiles if any lane needs dependency installs. All write lanes depend on it.
   - **Package lanes:** one per package, `Owns` scoped to package dir, `Must not edit` includes all lockfiles + root configs + other lanes' paths, and `Branch` uses `agent-team/phase-N-<package-or-lane>`. Scope text includes "Do NOT run pnpm install or any lockfile-modifying command."
   - **Consolidation/PR review:** add a final review lane or implementation step that reviews every package lane branch/PR before integration.
8. Validate: disjoint Owns, all lockfiles excluded from write lanes, valid DAG, unique non-primary branches, and a consolidation/PR review gate.

## Output Format

- **Monorepo tool and package count**
- **Shared Chokepoints**: lockfiles, root configs, high-fan-out packages
- **Package Dependency Graph**: in-scope packages with dependency edges
- **Recommended Strategy**: parallel mode and rationale
- **Lane Specifications**: in execution profile format (Agent, Role, Mode, Scope, Owns, Must not edit, Branch, Depends on, Deliverable)
- **Consolidation/PR Review**: required final gate for `agent-team` package lanes, including branch/PR review and boundary checks before integration

## Constraints

- Do not modify task files — output is advisory only.
- Do not run package manager install/add commands.
- Maximum 12 parallel write lanes — group if more packages are in scope.
- Do not recommend `agent-team` if the project cannot push lane branches to GitHub and review PRs; use `implementation-safe`, `research-only`, or `serial` instead.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
