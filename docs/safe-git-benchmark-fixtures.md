# Safe Disposable GitHub Test-Repository Fixtures

## Overview

Git-mutating skills (`commit-and-push-by-feature`, `sync`) require a live GitHub repository to benchmark against. This document defines the permission-gated, disposable repository workflow that allows safe benchmarking without risk to the primary `agentic-skills` repository or any user-owned repositories.

## Permission Gate

Every `gh` operation that creates, mutates, or deletes a GitHub repository **must** be gated behind explicit user confirmation. The fixture helper will:

1. Print the exact `gh` command it intends to run.
2. Wait for an explicit confirmation signal before executing.
3. Return an `infrastructure-blocked` status if confirmation is denied.

No `gh` mutation runs silently or automatically.

## Naming Convention

Disposable repositories follow the pattern:

```
agentic-skills-bench-<skill>-<timestamp>
```

Examples:
- `agentic-skills-bench-commit-and-push-by-feature-1747094400`
- `agentic-skills-bench-sync-1747094400`

The timestamp is Unix epoch seconds at creation time.

## Lifecycle

```
create → clone → seed → benchmark → evaluate → cleanup
```

1. **Create**: `gh repo create <name> --private --clone` with permission gate.
2. **Clone**: The repo is cloned to a temporary local directory under the benchmark work area.
3. **Seed**: Fixture files are written, committed, and pushed to establish the initial repository state needed by the benchmark scenario.
4. **Benchmark**: The skill under test runs against the seeded repository.
5. **Evaluate**: Hard assertions and quality checks run against the resulting repository state.
6. **Cleanup**: `gh repo delete <name> --yes` with permission gate. Cleanup failures do not fail the benchmark.

## Security Boundary

- All disposable repos are created as **private** repositories.
- They contain only synthetic fixture files — no secrets, credentials, tokens, or proprietary code.
- They are deleted immediately after the benchmark run completes.
- The fixture helper never reads from or writes to the primary `agentic-skills` repository during benchmark execution.
- No GitHub Actions, webhooks, or integrations are configured on disposable repos.

## Cleanup Handling

Cleanup failures are **infrastructure-blocked evidence**, not skill failures:

- If `gh repo delete` fails (network error, permission denied, rate limit), the benchmark result is tagged as `infrastructure-blocked` with the cleanup error.
- The skill's hard assertion results remain valid — cleanup is a post-evaluation step.
- Infrastructure-blocked results are reported separately from skill pass/fail in the benchmark report.
- Operators should manually delete orphaned repos matching the `agentic-skills-bench-*` naming pattern if cleanup fails.

## Fixture Helper API

The reusable helper lives at `tests/layer4/helpers/disposable-repo.ts` and exports:

| Function | Purpose |
|---|---|
| `createDisposableRepo(skillName)` | Creates a private GitHub repo with permission gate. Returns repo URL, local clone path, and a cleanup handle. |
| `seedRepo(localPath, files)` | Writes fixture files, commits, and pushes initial state. |
| `cleanupRepo(repoUrl)` | Deletes the GitHub repo with permission gate. Returns success or infrastructure-blocked status. |

All functions are async and designed to be called from benchmark setup files in `tests/layer4/setups/`.

## Confirmation Gate Contract

The confirmation gate is a callback function passed to `createDisposableRepo` and `cleanupRepo`:

```typescript
type ConfirmationGate = (action: string) => Promise<boolean>;
```

- `action` is a human-readable description of the `gh` command about to run.
- Returns `true` to proceed, `false` to block.
- Benchmark setups provide their own gate implementation (interactive prompt, environment variable check, or always-block for dry runs).

## Non-Goals

- No GitHub Actions are created on disposable repos.
- No org-level permissions or team access is configured.
- No long-lived test repositories — every benchmark run creates and destroys its own.
- No automatic retry of failed cleanup — orphan detection is a manual operator task.
