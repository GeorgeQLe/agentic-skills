# Monorepo Execution Controller

## Overview

A new `monorepo` pack for the agentic-skills library that makes the full skill pipeline monorepo-aware. Instead of duplicating skills (like the `-kanban` variants), the pack uses an **augmentation injection pattern** — monorepo pack skills add pre/post steps to existing global skill contracts, injecting workspace detection, lane-spec generation, boundary guarding, and scoped shipping into the standard plan → execute → ship lifecycle.

The pack targets **pnpm workspaces + Turborepo** as the first-class monorepo stack, with detection via `pnpm-workspace.yaml` and `turbo.json`. When Turborepo is present, skills defer to `turbo run` for build/test/lint tasks to leverage its caching and dependency-aware ordering.

V1 ships four skills: `mono-detect`, `mono-run`, `mono-ship`, and `mono-guard`. V2 expands to planning, analysis, and migration skills.

## Goals

- Make the skill library monorepo-aware without duplicating every global skill.
- Provide automated lane dispatch for parallel agent-team execution across packages, with structured lane-spec artifacts and boundary enforcement.
- Keep specs, research, tasks, and roadmap at the root level with package-scope tags — no per-package directory sprawl.
- Handle cross-cutting work (shared packages, root config) safely by enforcing serial execution for cross-cutting steps.
- Stop-all-lanes failure semantics: any lane failure halts remaining lanes and preserves worktree state for inspection.
- Support step-at-a-time execution by default, with `--phase` and `--pipeline` flags for broader execution.

## Non-Goals

- Supporting non-pnpm workspace managers (npm, yarn, Lerna, Nx) in v1. Detection stubs may exist but behavior is pnpm + Turbo only.
- Multi-repo → monorepo migration. Only single-app → monorepo is planned (v2).
- Per-package task files (`packages/api/tasks/todo.md`). All task management stays root-level.
- Replacing `/mono-plan` or `/mono-guard` globally — these existing global skills remain available; the pack skills (`mono-run`, `mono-ship`) call them internally.
- GitHub Actions or CI integration.

## Detailed Design

### Pack Structure

```
packs/monorepo/
├── PACK.md                          # Pack description, install instructions, skill list
├── claude/
│   ├── mono-detect/SKILL.md         # Workspace detection and package graph
│   ├── mono-run/SKILL.md            # Augmented /run with lane dispatch
│   ├── mono-ship/SKILL.md           # Scoped shipping with per-package validation
│   └── mono-guard/SKILL.md          # Pack-local reference to boundary enforcement
├── codex/
│   ├── mono-detect/SKILL.md
│   ├── mono-run/SKILL.md
│   ├── mono-ship/SKILL.md
│   └── mono-guard/SKILL.md
└── scripts/
    ├── mono-detect.sh               # Detect workspace manager, enumerate packages, build dep graph
    ├── lane-spec-validate.sh        # Validate lane-spec JSON against schema
    └── monorepo-validate.sh         # Pack-level validation (contracts, tags, detection)
```

### Monorepo Detection (`mono-detect`)

`mono-detect` is the foundation skill. It detects the workspace structure and outputs a package graph that other skills consume.

**Detection order:**
1. Check for `pnpm-workspace.yaml` → pnpm workspaces
2. Check for `turbo.json` → Turborepo overlay
3. If neither found, exit with "not a detected monorepo" and suggest `/mono-migrate` (v2)

**Output:** `.agents/monorepo.json`

```json
{
  "workspace_manager": "pnpm",
  "build_orchestrator": "turborepo",
  "root": "/absolute/path",
  "packages": [
    {
      "name": "@scope/api",
      "path": "packages/api",
      "dependencies": ["@scope/shared-lib"],
      "devDependencies": ["@scope/test-utils"],
      "scripts": {
        "build": "tsc",
        "test": "vitest",
        "lint": "eslint ."
      }
    }
  ],
  "dependency_graph": {
    "@scope/api": ["@scope/shared-lib"],
    "@scope/web": ["@scope/shared-lib", "@scope/api"],
    "@scope/shared-lib": []
  },
  "turbo_pipelines": ["build", "test", "lint"],
  "detected_at": "2026-05-03T10:00:00Z"
}
```

**Staleness:** `mono-detect` re-runs if `pnpm-workspace.yaml`, `turbo.json`, or any `package.json` has a newer mtime than `.agents/monorepo.json`.

### Structured Lane-Spec Artifact

Following the approval-packet pattern, lane specs use a JSON + committed Markdown mirror:

**Machine-readable:** `.agents/lane-specs.json`

```json
{
  "phase": "Phase 22: API Auth Refactor",
  "source_roadmap_hash": "abc123",
  "lifecycle": "draft",
  "created_at": "2026-05-03T10:00:00Z",
  "cross_cutting_steps": [
    {
      "step": "22.1",
      "description": "Update shared auth types",
      "packages": ["shared-lib"],
      "scope": "cross-cutting",
      "mode": "serial"
    }
  ],
  "lanes": [
    {
      "id": "api-auth",
      "step": "22.2",
      "description": "Refactor API auth middleware",
      "packages": ["api"],
      "owns": ["packages/api/src/auth/"],
      "must_not_edit": ["pnpm-lock.yaml", "turbo.json", "packages/web/", "packages/shared-lib/"],
      "depends_on": ["22.1"],
      "mode": "parallel"
    },
    {
      "id": "web-auth-ui",
      "step": "22.3",
      "description": "Update web auth components",
      "packages": ["web"],
      "owns": ["packages/web/src/auth/"],
      "must_not_edit": ["pnpm-lock.yaml", "turbo.json", "packages/api/", "packages/shared-lib/"],
      "depends_on": ["22.1"],
      "mode": "parallel"
    }
  ]
}
```

**Lifecycle:** `draft → approved → dispatched → integrated | failed`

- `draft`: Generated by `mono-run` from roadmap execution profile.
- `approved`: User reviews and approves in plan mode.
- `dispatched`: Parallel agents are launched.
- `integrated`: All lanes completed successfully, `/mono-guard` post-integration passed.
- `failed`: A lane failed; all lanes halted. Worktree state preserved.

**Human-readable mirror:** `tasks/lane-specs.md` (committed)

### Package-Scope Tags

Specs and roadmap phases use YAML frontmatter to declare package scope:

```yaml
---
packages: [api, web]
scope: cross-cutting
---
```

Valid `scope` values:
- `cross-cutting` — touches shared packages or root config; forces serial execution
- `package-scoped` — touches only the listed packages; eligible for parallel dispatch
- `root-only` — touches only root-level config/scripts; forces serial execution

When `scope` is omitted, it defaults to `package-scoped` if `packages` has exactly one entry, or `cross-cutting` if it has multiple.

### Augmented Execution: `mono-run`

`mono-run` augments `/run` with monorepo-aware dispatch. It does not replace `/run` — it wraps it with pre/post steps.

**Pre-execution injection:**
1. Run `mono-detect` if `.agents/monorepo.json` is stale or missing.
2. Read the current phase's execution profile from `tasks/roadmap.md`.
3. If the phase mode is `agent-team` and the project is a detected monorepo:
   a. Parse lane definitions from the execution profile.
   b. Generate `.agents/lane-specs.json` and `tasks/lane-specs.md`.
   c. Run `/mono-guard` pre-flight validation on the lane specs.
   d. Enter plan mode with the lane specs for user approval.
4. If the phase mode is `serial` or the project is not a monorepo, delegate directly to `/run`.

**Dispatch (after approval):**
1. Execute cross-cutting steps serially in the main agent first.
2. For each parallel wave (lanes with satisfied `depends_on`):
   a. Launch worktree-isolated agents, one per lane.
   b. Each agent receives its `owns`, `must_not_edit`, and step instructions.
   c. If Turborepo is available, agents use `turbo run <task> --filter=<package>` for build/test/lint.
   d. Monitor all agents. On any failure: halt remaining agents, preserve all worktree state, update lane-spec lifecycle to `failed`, report which lane failed and why.
3. After all parallel lanes complete successfully:
   a. Run `/mono-guard` post-integration to verify no boundary violations.
   b. Update lane-spec lifecycle to `integrated`.
   c. Hand off to `/mono-ship` or continue to next step.

**Flags:**
- (default): Execute the next incomplete step.
- `--phase`: Execute all steps in the current phase (cross-cutting serial, then parallel waves, then integration).
- `--pipeline`: Plan → execute → ship the current phase in sequence.

### Augmented Shipping: `mono-ship`

`mono-ship` augments `/ship` with package-scoped validation and shipping.

**Pre-ship injection:**
1. Run `mono-detect` if stale.
2. Read `.agents/lane-specs.json` to understand which packages were modified.
3. For each modified package:
   a. Run package-scoped tests: `turbo run test --filter=<package>` (or `pnpm --filter <package> run test`).
   b. Run package-scoped lint: `turbo run lint --filter=<package>`.
   c. Run package-scoped build: `turbo run build --filter=<package>`.
4. Run transitive dependent tests: use the dependency graph from `.agents/monorepo.json` to test packages that depend on modified packages.
5. If any validation fails, stop and report. Do not proceed to shipping.

**Ship:**
1. Delegate to `/ship` for the actual commit/push/deploy cycle.
2. Update `tasks/lane-specs.md` with shipping status.
3. If `--pipeline` was used, plan the next phase via `/roadmap`.

### Boundary Enforcement: `mono-guard`

The existing global `/mono-guard` skill handles lane boundary validation. The pack's `mono-guard` is a thin reference that ensures:
- Pre-flight: Lane specs are valid, `owns` paths are disjoint, `must_not_edit` includes lockfiles and root config, dependency ordering is a valid DAG.
- Post-integration: Actual file changes match declared `owns` paths, no lane wrote outside its boundary, no lockfile modifications from parallel agents.

### Cross-Cutting Execution Safety

Steps tagged `scope: cross-cutting` or touching packages listed in multiple lanes:
1. Always execute serially in the main agent (never dispatched to parallel worktrees).
2. Must complete before any parallel lanes that `depends_on` them.
3. May modify shared packages, root config, and lockfiles (the main agent is the only context where lockfile writes are permitted).
4. After completion, parallel lanes see the updated state via worktree creation from the post-cross-cutting commit.

## Data Model

### `.agents/monorepo.json`
- Workspace detection output. Regenerated when workspace config files change.
- Contains package list, dependency graph, Turbo pipeline awareness.
- Read by all monorepo pack skills.

### `.agents/lane-specs.json`
- Per-phase lane dispatch plan. Lifecycle: `draft → approved → dispatched → integrated | failed`.
- Contains cross-cutting steps, parallel lanes with `owns`/`must_not_edit`/`depends_on`.
- Consumed by `mono-run` for dispatch, `mono-guard` for validation, `mono-ship` for scoped testing.

### `tasks/lane-specs.md`
- Committed Markdown mirror of `.agents/lane-specs.json`.
- Human-reviewable record of lane decisions and outcomes.

### Package-scope tags in existing files
- `tasks/roadmap.md` phases: `packages:` frontmatter field on execution profile sections.
- `specs/*.md`: `packages:` frontmatter field indicating which packages the spec applies to.
- `research/*.md`: `packages:` frontmatter field when research is package-specific (most research stays unscoped).

## Edge Cases

- **Single-package monorepo:** A workspace with only one package. `mono-run` detects this and falls back to standard `/run` (no lane dispatch needed). Logged as advisory.
- **Circular dependencies in package graph:** `mono-detect` validates the dependency graph is a DAG. If cycles are found, it errors with the cycle path and suggests fixing `package.json` dependencies.
- **Lane spec drift:** If `tasks/roadmap.md` is modified after lane specs are approved but before dispatch, `mono-run` detects the hash mismatch (`source_roadmap_hash`) and requires re-approval.
- **Worktree cleanup on failure:** Failed lanes leave worktrees intact for inspection. `mono-run --cleanup` removes stale worktrees from previous failed runs.
- **No Turborepo:** If `turbo.json` is absent, skills fall back to `pnpm --filter <package> run <script>`. Build/test ordering follows the dependency graph from `.agents/monorepo.json` instead of Turbo's pipeline.
- **New package added mid-phase:** If a lane creates a new package (e.g., `packages/new-service/`), it must declare the path in `owns`. `mono-guard` post-integration allows new directories within declared `owns` paths.
- **Root-only changes:** Phases that only touch root config (e.g., updating `turbo.json` pipeline config) use `scope: root-only` and run serially without lane dispatch.
- **Mixed pack project:** If `.agents/project.json` has `project_scopes` with path-based domain designations, `mono-detect` includes these scope annotations in the package graph so domain-aware skills can route correctly.

## Test Plan

Script-based validation matching the existing repo validation pattern:

### `scripts/monorepo-validate.sh`
- **Contract compliance:** All monorepo pack skills reference the augmentation injection pattern (pre/post steps, not full copies).
- **Lane-spec schema:** `.agents/lane-specs.json` fixtures pass schema validation (required fields: phase, lifecycle, lanes with owns/must_not_edit/depends_on).
- **Detection correctness:** `mono-detect.sh` correctly identifies pnpm-workspace.yaml and turbo.json presence/absence against fixture directories.
- **Package-scope tags:** Scan `tasks/roadmap.md` and `specs/*.md` for `packages:` frontmatter when monorepo pack is enabled.
- **Disjointness check:** Verify that `owns` paths across lanes in a fixture lane-spec are disjoint.
- **Must-not-edit baseline:** Verify that every lane's `must_not_edit` includes `pnpm-lock.yaml` and root config files.

### Fixtures
- `tests/fixtures/monorepo/pnpm-turbo/` — minimal pnpm workspace with Turborepo (2 packages + 1 shared lib).
- `tests/fixtures/monorepo/pnpm-only/` — pnpm workspace without Turborepo.
- `tests/fixtures/monorepo/not-monorepo/` — single-app project (detection should return "not a monorepo").
- `tests/fixtures/monorepo/lane-specs-valid.json` — complete lane-spec fixture.
- `tests/fixtures/monorepo/lane-specs-invalid.json` — lane-spec with overlapping `owns` paths (should fail validation).

## Acceptance Criteria

- [ ] `mono-detect` correctly identifies pnpm workspaces and Turborepo, outputs `.agents/monorepo.json` with package list and dependency graph.
- [ ] `mono-run` generates lane specs from roadmap execution profiles, runs `/mono-guard` pre-flight, dispatches parallel worktree agents for package-scoped steps, and runs cross-cutting steps serially.
- [ ] `mono-run` stops all lanes on any lane failure and preserves worktree state.
- [ ] `mono-ship` runs package-scoped and transitive-dependent tests/lint/build before delegating to `/ship`.
- [ ] `mono-guard` validates lane-spec disjointness pre-flight and boundary compliance post-integration.
- [ ] Lane-spec artifact follows JSON + Markdown mirror pattern with lifecycle tracking.
- [ ] Package-scope tags work in `tasks/roadmap.md` and `specs/*.md` via YAML frontmatter.
- [ ] Cross-cutting steps always run serially and complete before dependent parallel lanes.
- [ ] Skills defer to `turbo run` when `turbo.json` is present, fall back to `pnpm --filter` otherwise.
- [ ] `--phase` and `--pipeline` flags work for broader execution beyond step-at-a-time default.
- [ ] Mirrored Claude/Codex skill contracts exist for all v1 skills.
- [ ] Script-based validation passes for contracts, lane-spec schema, detection, and boundary checks.

## Open Questions

- **Turbo cache sharing across worktrees:** Do worktree-isolated agents share Turbo's cache, or does each worktree rebuild from scratch? If cache is per-worktree, parallel execution may be slower than expected. Needs empirical testing.
- **Lane-spec approval UX in Codex:** Codex lacks plan-mode entry from skills. The lane-spec approval step may need a Codex-native pattern (e.g., `$mono-run` presents lane specs and requires explicit `approve` in the next message).
- **`mono-guard` global vs pack:** The existing global `/mono-guard` and the pack's `mono-guard` overlap. Should the global skill be deprecated in favor of the pack version, or kept as a standalone pre-flight tool?
- **Lockfile mutation exception:** Cross-cutting serial steps allow lockfile writes. Should there be an explicit approval gate before any lockfile mutation, even in serial mode?

## V2 Roadmap

Skills planned for v2 (not in scope for this spec's implementation):

| Skill | Augments | Purpose |
|-------|----------|---------|
| `mono-roadmap` | `/roadmap` | Auto-tag phases with package scope from code analysis |
| `mono-plan-phase` | `/plan-phase` | Generate lane specs during phase decomposition |
| `mono-spec-interview` | `/spec-interview` | Scope-aware spec writing with package boundary prompts |
| `mono-affected` | `/affected` | Transitive impact analysis with lane-spec integration |
| `mono-debug` | `/debug` | Package-scoped debugging with cross-package trace |
| `mono-trace` | `/trace` | Request tracing across package boundaries |
| `mono-investigate` | `/investigate` | Scoped investigation with package-aware code search |
| `mono-migrate` | (new) | Single-app → monorepo migration with guided execution |

## Assumptions & Risks

| Assumption | Source | Downstream Risk if Wrong |
|------------|--------|------------------------|
| pnpm workspaces + Turborepo is sufficient for v1 | `[from interview]` Confirmed by user | Projects using npm/yarn/Nx/Lerna cannot use the pack until support is added |
| Root-level specs/research/tasks with package tags is sufficient | `[from interview]` Confirmed by user | If package isolation is needed later, migrating from root-level tags to per-package directories is a structural change |
| Augmentation injection pattern works without modifying global skills | `[inferred]` Not yet validated | If global skills don't have clean pre/post hook points, augmentation may require global skill changes |
| Worktree-isolated agents can share Turbo cache | `[inferred]` Needs empirical testing | If cache is per-worktree, parallel execution loses Turbo's main benefit (caching) |
| Lane-spec JSON + Markdown mirror is worth the complexity | `[from interview]` User chose this pattern | Maintaining two representations adds sync risk, though the approval-packet precedent suggests it works |
| Stop-all-lanes failure semantics are always correct | `[from interview]` Confirmed by user | For independent packages, continuing other lanes might be more productive; strict stop may slow development |
| Single-app → monorepo migration is the only migration path needed | `[from interview]` Confirmed by user | Multi-repo → monorepo and monorepo restructuring are common; deferring may block users with those needs |
| Cross-cutting steps can always be identified by package-scope tags | `[inferred]` Not yet validated | Some cross-cutting changes (e.g., shared type updates that affect all packages) may not be obvious from tags alone |
| `mono-detect.sh` can reliably build the dependency graph from `package.json` files | `[inferred]` Standard approach | Workspace protocol aliases, `file:` dependencies, and conditional dependencies may produce incorrect graphs |
