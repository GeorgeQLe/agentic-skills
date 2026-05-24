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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/codebase-status-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/codebase-status-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- This skill is normally read-only and should not create or modify tracked repository files.
- If the user explicitly asks this skill to create or modify tracked files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, production deploy confirmation, paid actions, or public visibility changes.
