---
name: mono-detect
description: Detect pnpm workspace structure, optional Turborepo overlay, package metadata, and internal dependency graph for monorepo-aware skills
type: analysis
version: v0.0
argument-hint: "[optional: repository root]"
---

# Mono Detect

Use this skill to detect a pnpm workspace monorepo and generate the `.agents/monorepo.json` artifact consumed by the monorepo pack.

`mono-detect` is the foundation skill for `mono-run`, `mono-ship`, and `mono-guard`. Those skills use its output to inject monorepo-aware pre/post steps into the standard `/run` and `/ship` contracts without duplicating the global workflow.

## Augmentation Injection Pattern

`mono-detect` is the pack's detection foundation for the augmentation injection pattern. It does not replace `/run`, `/ship`, or global monorepo planning skills; it supplies `.agents/monorepo.json` so `mono-run`, `mono-ship`, and `mono-guard` can inject monorepo-aware pre-flight and post-integration checks around those existing workflows.

## Workflow

1. Resolve the target repository root.
   - Use `$ARGUMENTS` as the root when provided.
   - Otherwise use the current working directory.
2. Locate the pack script relative to this skill: `../../scripts/mono-detect.sh` from the monorepo pack root.
3. Check whether `.agents/monorepo.json` is fresh:
   - Run `packs/monorepo/scripts/mono-detect.sh <root> --check-stale`.
   - If it prints `fresh: .agents/monorepo.json`, keep the existing artifact.
   - If the file is missing, stale, or the check does not report fresh, run `packs/monorepo/scripts/mono-detect.sh <root>` to regenerate it.
4. If detection fails because `pnpm-workspace.yaml` is missing:
   - Report that the project is not a detected pnpm monorepo.
   - Suggest `/mono-migrate` as a future V2 migration route when the user wants to convert a single-app project.
   - Do not create `.agents/monorepo.json` by hand.
5. Read `.agents/monorepo.json` and summarize:
   - Workspace manager.
   - Build orchestrator (`turborepo` when `turbo.json` is present, otherwise none).
   - Package count and package paths.
   - Internal dependency graph edges.
   - Turborepo pipeline names.
6. Report staleness behavior:
   - Mention that the artifact is regenerated when `pnpm-workspace.yaml`, `turbo.json`, or workspace `package.json` files are newer than `.agents/monorepo.json`.
7. Route the next step:
   - If detection passed and the user is preparing execution, recommend `/mono-run`.
   - If detection passed and the user is checking lane safety, recommend `/mono-guard`.
   - If detection failed because this is not a pnpm monorepo, recommend `/mono-migrate` as the V2 advisory route.

## Output Format

- **Detection:** detected, fresh, regenerated, or not detected.
- **Workspace:** manager, build orchestrator, root path.
- **Packages:** count plus package name/path list.
- **Dependency graph:** internal dependency edges; say `none` when no internal edges exist.
- **Turbo pipelines:** pipeline names when present; say `none` when Turborepo is absent.
- **Artifact:** `.agents/monorepo.json` path and whether it was reused or regenerated.
- **Next work:** concrete follow-up.
- **Recommended next command:** one command.

## Constraints

- Do not edit task files.
- Do not run package manager install/add commands.
- Do not infer non-pnpm workspace managers in V1.
- Do not modify `.agents/monorepo.json` manually; use `mono-detect.sh`.
- Treat `mono-detect` as an augmentation foundation for `mono-run`, `mono-ship`, and `mono-guard`, not as a replacement for `/run`, `/ship`, or global monorepo planning skills.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/mono-detect-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/mono-detect-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/mono-detect-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include the two-line pair `**Next work:** <specific task, blocker, or follow-up>` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
