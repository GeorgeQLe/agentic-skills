---
name: codebase-status
description: Report what a repository is, what recent conversation history says about it, current application status, and outstanding work
type: analysis
version: v0.0
argument-hint: "[optional repo path, focus, or --no-history]"
---

# Codebase Status

Invoke as `/codebase-status`.

Use this skill when the user asks what a repo or application is, where work was left, what is outstanding, whether it is ready/stable, or wants a detailed status report that combines codebase evidence with local Claude/Codex conversation history.

This is read-only status synthesis. It does not replace `/roadmap`: `roadmap` maintains the task pipeline and priority queue; `codebase-status` explains the actual current state of the repo and relevant prior conversations.

## Workflow

1. Resolve target repo:
   - Default to the current working directory.
   - If the user provides a path, use that repo.
   - Confirm it is a git worktree when possible; if not, continue with filesystem evidence and report that git evidence is unavailable.
2. Read project orientation:
   - `README.md`, `AGENTS.md`, `CLAUDE.md`, `.agents/project.json`, package/workspace files, app entrypoints, and high-signal docs.
   - Identify project type, main apps/packages, runtime, tests, and likely user-facing or developer-facing purpose.
3. Read planning and status docs when present:
   - `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, `tasks/lessons.md`, `tasks/phases/`, `specs/`, `spec.md`, and `research/`.
   - Distinguish checked-off work, active work, manual blockers, advisory work, stale docs, and missing docs.
4. Inspect git evidence:
   - `git status --short`
   - current branch and upstream status
   - last 20 commits
   - unpushed commits when an upstream exists
   - changed files in the working tree
5. Inspect codebase health signals:
   - Project structure and primary modules.
   - Test/build/lint scripts from package manifests or equivalent tool files.
   - Obvious TODO/FIXME markers, failing-test notes, disabled tests, and local quality scripts.
   - Do not run expensive commands by default. Run cheap read-only inspections freely; ask or state assumptions before long builds, network installs, destructive commands, or mutation.
6. Find related conversation history unless `--no-history` is passed:
   - Read full available local prompt history, not a sample:
     - `~/.claude/history.jsonl`
     - `~/.codex/history.jsonl`
     - `~/.codex/sessions/**/*.jsonl` for Codex session metadata only when needed to map session IDs to cwd.
   - Filter to records whose project/cwd matches the target repo or whose text mentions the absolute path, repo directory name, package/app name, or repository URL.
   - Exclude system, developer, tool output, injected skill payloads, and base instruction text from examples.
   - Use line-by-line parsing for scale and deduplicate Codex prompt records when compact and rich histories overlap.
   - Extract recent user goals, repeated requests, unresolved questions, blockers, and prior recommendations.
7. Synthesize status:
   - What this repo/app is.
   - What has happened recently.
   - Current implementation status by major area.
   - Outstanding work, grouped as blocking, next execution, advisory, manual/human-only, and uncertain.
   - Mismatches between conversation history, task docs, git history, and code reality.
   - Confidence level for each major conclusion: high, medium, or low, with evidence.
8. Recommend next route:
   - `/run` when the next task is already clear and executable.
   - `/roadmap` when specs exist but sequencing or task queue health needs updating.
   - `/feature-interview` when the next idea/direction is not yet represented in specs or tasks.
   - `/reconcile-dev-docs audit` or `/reconcile-dev-docs fix tasks` when task docs contradict git/code reality.
   - `/spec-drift` when specs and code appear out of sync.
   - `/guide` only for human-only external blockers.
   - `/brainstorm` when the repo is complete/current and the next step is discovering a new phase.

## Output

Produce a structured report with:

- **Overview:** repo path, project purpose, project type, primary apps/packages, branch, dirty/unpushed status.
- **History Signal:** number of Claude/Codex prompt records scanned, number matched to this repo, date range, and 3-8 concise real examples.
- **Recent Work:** last commits and task/history evidence.
- **Current Status:** major areas and whether each appears complete, in progress, blocked, stale, or unknown.
- **Outstanding Work:** prioritized list with evidence and recommended owner/skill.
- **Risks And Drift:** contradictions, stale docs, missing tests, manual blockers, or uncertain claims.
- **Recommended Next Step:** one concrete next work item and one command.

End with exactly:

```md
**Next work:** <specific task, blocker, discovery task, or "none">
**Recommended next command:** <one command or route>
```

## Constraints

- Read-only by default. Do not modify files, create commits, run installs, or execute long test suites unless the user explicitly asks.
- Do not include private conversation history unrelated to the target repo.
- Quote only short prompt excerpts. Prefer paraphrase plus timestamp/source/project.
- Do not treat `tasks/record-todo.md` or `tasks/recurring-todo.md` as execution queues unless an item has clearly become concrete work.
- Do not put agent-executable work in `tasks/manual-todo.md` or route it to `/guide`.
- Do not recommend `/roadmap` if the finding is only "tell me the status"; use `/roadmap` only when the task pipeline itself needs queue maintenance or roadmap extension.
- Do not create or modify GitHub Actions workflows.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/codebase-status-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/codebase-status-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/codebase-status-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- This skill is normally read-only and should not create or modify tracked repository files.
- If the user explicitly asks this skill to create or modify tracked files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, production deploy confirmation, paid actions, or public visibility changes.
