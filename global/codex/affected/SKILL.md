---
name: affected
description: Analyze which monorepo packages and apps are affected by current changes
type: analysis
version: v0.0
---

# Affected

Invoke as `$affected`.

Use this skill when the user wants to understand the blast radius of their current changes in a monorepo.

## Workflow

1. Determine the change set from git diff or a specified commit range.
2. Read the monorepo config to understand the package graph.
3. Map changed files to their packages.
4. Compute transitive dependents.
5. Check for cross-cutting changes (root configs, shared packages).
6. Recommend test commands for affected packages.

## Output Format

- **Directly Changed**: packages with file changes
- **Transitively Affected**: downstream dependents
- **Cross-Cutting**: root config changes affecting all packages
- **Recommended Test Commands**: specific commands to run

## Constraints

- Do not run tests — only analyze and recommend.
- Prefer Turbo-native filtering for Turborepo projects.


## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/affected-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/affected-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/affected-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
