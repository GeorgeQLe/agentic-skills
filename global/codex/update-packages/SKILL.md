---
name: update-packages
description: Update project dependencies to the latest version that is more than 8 days old, preferring pnpm over npm
type: execution
version: 0.1.0
argument-hint: "[package names, workspace scope, or --all]"
---

# Update Packages

Invoke as `$update-packages`.

Use this skill when a project needs dependency updates but should avoid newly published versions that may still be unstable or compromised. The default target is the newest package version whose publish timestamp is more than 8 days old. When the project uses npm, try to migrate it to pnpm first unless project constraints make that unsafe.

## Workflow

1. **Plan and scope the update.**
   - Inspect repository instructions, `package.json` files, workspace config, and lockfiles.
   - Use `update_plan` for non-trivial updates, especially monorepos, package-manager migration, or updates spanning multiple apps/packages.
   - Treat explicit package names or workspace filters from the user as the scope. If no scope is provided, default to all direct dependencies and devDependencies in the active project or workspace.
   - Check for existing dirty files before editing and avoid staging unrelated work.

2. **Resolve package manager strategy.**
   - Prefer pnpm when the project is JavaScript/TypeScript and does not already have a stronger package-manager requirement.
   - If `pnpm-lock.yaml` or `packageManager: "pnpm@..."` exists, use pnpm.
   - If only npm is present (`package-lock.json`, npm scripts, or `packageManager: "npm@..."`), migrate to pnpm when practical:
     - Add or update `packageManager` to a stable pnpm version already used by the repo/toolchain when discoverable.
     - Generate `pnpm-lock.yaml` using pnpm.
     - Remove npm lockfile only after pnpm install/update succeeds and the repo does not explicitly require npm.
   - If npm must remain, record the reason and continue with npm commands without inventing a pnpm migration.
   - In monorepo parallel-agent contexts, do not run commands that mutate shared lockfiles. Stop and route dependency changes to a single serial session.

3. **Discover eligible versions.**
   - For each target package, query the registry for version metadata and publish times.
   - Select the highest semver version whose published timestamp is strictly older than 8 full days from the current date/time.
   - Include stable releases by default. Include prerelease/dist-tag targets only when the existing dependency already tracks that prerelease channel or the user explicitly requests it.
   - Skip packages when no eligible version is older than 8 days, when the package is pinned for a documented reason, or when peer constraints make the update unsafe.
   - Record the current version, selected version, publish date, and reason for skips.

4. **Apply updates in safe batches.**
   - Update manifests through package-manager commands where practical (`pnpm up`, `pnpm add -D`, workspace filters) so manifests and lockfiles stay consistent.
   - Prefer small batches for major upgrades, framework packages, build tooling, and peer-sensitive groups such as React, Next.js, ESLint, TypeScript, Vite, Vitest, Playwright, Prisma, database clients, and SDKs.
   - For npm-to-pnpm migration, first establish a clean pnpm install, then perform dependency upgrades.
   - Do not edit lockfiles by hand.

5. **Verify after updates.**
   - Run the repo's install/update command, typecheck, tests, lint, build, and any focused smoke checks implied by changed packages.
   - If verification fails, diagnose the root cause. Apply the smallest durable fix when it is clearly inside the dependency update scope.
   - If a failure requires broad migration work, stop, report the blocker, and route to `$migrate <package or framework>`.
   - Re-run verification after fixes.

6. **Document and ship.**
   - Summarize packages updated, versions selected, publish dates, packages skipped, package-manager changes, and verification.
   - Update task docs or changelogs when the repository workflow requires it.
   - If tracked files changed, commit and push on the repository primary branch unless the user explicitly says not to.

## Output

- **Package manager:** before and after, including any npm-to-pnpm migration result.
- **Updated packages:** package, old version, new version, selected publish date, and batch.
- **Skipped packages:** package and reason.
- **Verification:** install/update, typecheck, tests, lint, build, and smoke checks with pass/fail.
- **Next work:** `none`, `$migrate <target>`, or another exact follow-up command.

## Constraints

- Never select a package version published within the last 8 days unless the user explicitly overrides the safety gate.
- Do not run package-manager commands that mutate a shared lockfile while acting as one of multiple parallel agents.
- Do not hand-edit generated lockfiles.
- Do not remove npm support when scripts, deployment docs, CI, or hosting constraints explicitly require npm.
- Do not create or modify GitHub Actions workflows.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
