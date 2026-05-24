---
name: update-packages
description: Update project dependencies to the latest version that is more than 8 days old, preferring pnpm over npm and enforcing installer age gates
type: execution
version: v0.0
argument-hint: "[package names, workspace scope, or --all]"
---

# Update Packages

Use this skill when a project needs dependency updates but should avoid newly published versions that may still be unstable or compromised. The default target is the newest package version whose publish timestamp is more than 8 days old. When the project uses npm, try to migrate it to pnpm first unless project constraints make that unsafe. Every mutation run must also leave behind package-manager configuration that enforces the same age gate for future installs.

## Workflow

1. **Plan and scope the update.**
   - Inspect repository instructions, `package.json` files, workspace config, and lockfiles.
   - Enter plan mode for non-trivial updates, especially monorepos, package-manager migration, or updates spanning multiple apps/packages.
   - Treat explicit package names or workspace filters from the user as the scope. If no scope is provided, default to all direct dependencies and devDependencies in the active project or workspace.
   - Check for existing dirty files before editing and avoid staging unrelated work.

2. **Resolve package manager strategy.**
   - Prefer pnpm when the project is JavaScript/TypeScript and does not already have a stronger package-manager requirement.
   - If `pnpm-lock.yaml` or `packageManager: "pnpm@..."` exists, use pnpm.
   - If only npm is present (`package-lock.json`, npm scripts, or `packageManager: "npm@..."`), migrate to pnpm when practical:
     - Add or update `packageManager` to a stable pnpm version already used by the repo/toolchain when discoverable.
     - Do not default to `pnpm@latest`; use an existing repo-pinned pnpm version or an explicitly age-eligible pnpm version, and document the proof.
     - Before recommending a new `packageManager: "pnpm@..."` value, prove the chosen pnpm version is older than 8 full days by using retained project evidence, an existing project pin, or registry publish-time evidence such as `npm view pnpm@<version> time.version`. If you only know a local/toolchain pnpm version but have not verified its publish time, mark it provisional and make the registry check a blocker before mutation instead of presenting it as final.
     - Generate `pnpm-lock.yaml` using pnpm.
     - Remove npm lockfile only after pnpm install/update succeeds and the repo does not explicitly require npm.
   - If npm must remain, record the reason and continue with npm commands without inventing a pnpm migration.
   - In monorepo parallel-agent contexts, do not run commands that mutate shared lockfiles. Stop and route dependency changes to a single serial session.

3. **Add the installer age gate.**
   - Create or update the project-root `.npmrc` before dependency updates, preserving existing registry/auth settings.
   - Add npm's relative age gate: `min-release-age=8`.
   - Add pnpm's 8-day equivalent in minutes for pnpm versions/configurations that read `.npmrc`: `minimum-release-age=11520`.
   - If the active pnpm version uses `pnpm-workspace.yaml` or `pnpm config` for non-auth settings, also add or update `minimumReleaseAge: 11520` in the project `pnpm-workspace.yaml` or documented pnpm project config. Do this in addition to `.npmrc`, not instead of it, so npm and pnpm installs are both covered.
   - When documenting the settings, keep their ownership clear: `min-release-age=8` is the npm relative-age guard, while `minimum-release-age=11520` and `minimumReleaseAge: 11520` are pnpm coverage for the same 8-day policy where supported.
   - Avoid overwriting private registry tokens, scoped registry lines, or unrelated project config.
   - If an existing config deliberately excludes packages from the age gate, keep only exclusions that are documented and necessary; otherwise remove or narrow exclusions before updating.

4. **Discover eligible versions.**
   - For each target package, query the registry for version metadata and publish times.
   - Select the highest semver version whose published timestamp is strictly older than 8 full days from the current date/time.
   - Include stable releases by default. Include prerelease/dist-tag targets only when the existing dependency already tracks that prerelease channel or the user explicitly requests it.
   - Skip packages when no eligible version is older than 8 days, when the package is pinned for a documented reason, or when peer constraints make the update unsafe.
   - Record the current version, selected version, publish date, and reason for skips.

5. **Apply updates in safe batches.**
   - Update manifests through package-manager commands where practical (`pnpm up`, `pnpm add -D`, workspace filters) so manifests and lockfiles stay consistent.
   - Prefer small batches for major upgrades, framework packages, build tooling, and peer-sensitive groups such as React, Next.js, ESLint, TypeScript, Vite, Vitest, Playwright, Prisma, database clients, and SDKs.
   - For every major, framework, build-tool, or peer-sensitive update, write an explicit risk section before applying it:
     - batch order and whether the package should move alone or with a peer group;
     - peer/config compatibility checks, such as React renderer/framework compatibility, Vitest/Vite/TypeScript config compatibility, ESLint/parser compatibility, Prisma/database client generation, or SDK API changes;
     - focused smoke checks tied to the package's runtime surface, not only generic install/test/build commands;
     - stop conditions that route broad compatibility work to `/migrate <package or framework>` instead of hiding it inside the package update.
   - For npm-to-pnpm migration, first establish a clean pnpm install, then perform dependency upgrades.
   - For non-trivial or plan-first dependency updates, write a batch execution checklist before mutating files. Each batch must include:
     - exact mutation command(s) or file edits for that batch;
     - exact verification command(s) to run before moving on;
     - expected proof or artifact, such as `packageManager`, `.npmrc`, lockfile creation, selected package version, or smoke-test output;
     - a "do not proceed on red" gate and a stop condition that routes broad compatibility work to `/migrate <package or framework>`.
   - For npm-to-pnpm migrations, make the package-manager migration Batch 0, then put low-risk minors/patches before framework, runtime, test-runner, or build-tool majors unless peer constraints require a different order.
   - For Vitest and other test-runner migrations, prefer the project script (`pnpm test`, `pnpm run test`, or the discovered package-manager equivalent) plus a discovered single-file or config smoke check. Do not recommend Jest-only or version-uncertain flags unless you have verified that the selected runner version supports them.
   - Do not edit lockfiles by hand.

6. **Verify after updates.**
   - Confirm `.npmrc` contains `min-release-age=8` and, for pnpm coverage, `minimum-release-age=11520` unless the project has a documented reason to store pnpm settings only in `pnpm-workspace.yaml` or pnpm config.
   - For pnpm projects, confirm `minimumReleaseAge: 11520` is present in `pnpm-workspace.yaml` or equivalent project pnpm config when required by the active pnpm version.
   - Run the repo's install/update command, typecheck, tests, lint, build, and any focused smoke checks implied by changed packages.
   - For major/framework/build-tool updates, run or document package-specific compatibility checks and smoke tests before calling the update complete.
   - If verification fails, diagnose the root cause. Apply the smallest durable fix when it is clearly inside the dependency update scope.
   - If a failure requires broad migration work, stop, report the blocker, and route to `/migrate <package or framework>`.
   - Re-run verification after fixes.

7. **Document and ship.**
   - Summarize packages updated, versions selected, publish dates, packages skipped, package-manager changes, and verification.
   - Include the age-gate config files changed and the exact setting values.
   - Update task docs or changelogs when the repository workflow requires it.
   - If tracked files changed, commit and push on the repository primary branch unless the user explicitly says not to.

## Output

- **Package manager:** before and after, including any npm-to-pnpm migration result.
- **Age gate:** `.npmrc` and pnpm config files changed, including `min-release-age=8` and `minimum-release-age`/`minimumReleaseAge` values.
- **Updated packages:** package, old version, new version, selected publish date, and batch.
- **Skipped packages:** package and reason.
- **Major-upgrade risk handling:** affected packages, batch order, compatibility checks, focused smoke checks, and any stop route to `/migrate <target>`.
- **Batch execution checklist:** for each batch, list the mutation command or edit, verification command, expected proof/artifact, and stop gate before proceeding.
- **Verification:** install/update, typecheck, tests, lint, build, and smoke checks with pass/fail.
- **Next work:** `none`, `/migrate <target>`, or another exact follow-up command.

## Constraints

- Never select a package version published within the last 8 days unless the user explicitly overrides the safety gate.
- Do not finish a mutation run without adding or verifying the package-manager age gate, unless the user explicitly declines it or the package manager cannot support it; document either exception.
- Do not run package-manager commands that mutate a shared lockfile while acting as one of multiple parallel agents.
- Do not hand-edit generated lockfiles.
- Do not remove npm support when scripts, deployment docs, CI, or hosting constraints explicitly require npm.
- Do not create or modify GitHub Actions workflows.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
