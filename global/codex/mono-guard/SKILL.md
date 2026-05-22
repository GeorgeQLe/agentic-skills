---
name: mono-guard
description: Pre-flight validation of execution profile lane boundaries against monorepo structure — prevents dispatch of unsafe parallel configurations
type: analysis
version: v0.0
---

# Mono Guard

Invoke as `$mono-guard`.

Use this skill to validate execution profile lane boundaries before `/run` dispatches parallel agents. Catches lockfile contention, root config conflicts, package boundary violations, and missing branch/PR isolation before they cause failures.

## Modes

- **Pre-flight (default):** Validate lane specs in `tasks/todo.md` before dispatch.
- **Post-integration (`--post-integration`):** Verify lockfiles and root configs were only modified by their designated owner after lanes complete.

## Pre-Flight Checks

1. **Lockfile Safety:** Every lockfile is in `Must not edit` for all write lanes, OR owned by exactly one serial deps lane that all others depend on. FAIL if violated.
2. **Root Config Safety:** Same ownership/exclusion rules for `tsconfig.base.json`, `turbo.json`, etc. WARN if violated.
3. **Package Boundary Isolation:** `Owns` paths are disjoint, within recognized package directories, no prefix overlaps. FAIL if violated.
4. **Dependency Ordering:** If package X depends on package Y and both are in write lanes, lane-X must depend on lane-Y. FAIL if missing.
5. **Serialization Check:** No write lane's Scope contains `pnpm install`, `npm install`, `yarn add`, etc. (except a dedicated deps lane). FAIL if found.
6. **Install Command Check:** Scan for natural-language install intent ("add dependency", "install package"). WARN if detected.
7. **DAG Validity:** No cycles in lane dependency graph, all `Depends on` references exist. FAIL if violated.
8. **Branch/PR Isolation:** For `agent-team` write lanes, every lane has a unique `Branch` that is not `main` or `master`, and the phase includes a consolidation/PR review gate. FAIL if missing.

## Post-Integration Checks

1. **Lockfile audit:** Verify lockfile was only touched by deps lane or main agent.
2. **Root config audit:** Same check for root configs.
3. **Boundary audit:** Verify each lane's changes fall within its `Owns` paths.
4. **PR review audit:** Verify branch, commit SHA, and PR URL evidence exists for every integrated `agent-team` write lane.

## Output Format

- **Mode, profiles checked, overall verdict** (PASS / WARN / FAIL)
- **Results table**: check name, verdict, details
- **Failures**: which check, which lanes, which files, recommended fix
- **Warnings**: advisory issues with recommendations

## Verdicts

- **PASS:** Safe to dispatch.
- **WARN:** Advisory issues — dispatch allowed but review first.
- **FAIL:** Dispatch blocked — resolve failures before `/run`.

## Constraints

- Do not modify task files — output is advisory only.
- Do not run package manager install/add commands.
- Do not fix issues automatically — report with specific fix recommendations.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/mono-guard-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/mono-guard-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/mono-guard-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
