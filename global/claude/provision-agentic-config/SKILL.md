---
name: provision-agentic-config
description: Provision workflow orchestration and agent conventions into project CLAUDE.md and AGENTS.md
type: ops
version: 1.0.0
argument-hint:
---

# Install Workflow Orchestration

Create or update the current repository's `CLAUDE.md` and `AGENTS.md` with workflow orchestration conventions.

## Process

1. **Check target files:**
   - Ensure `./CLAUDE.md` exists. If not, create it.
   - Ensure `./AGENTS.md` exists. If not, create it.

2. **Insert the orchestration blocks:**
   - Insert the Claude block below verbatim into `./CLAUDE.md`.
   - Insert the AGENTS block below verbatim into `./AGENTS.md`.
   - If the corresponding block already exists anywhere in either target file, replace it so it appears exactly once per file.
   - Preserve any other existing content in `./CLAUDE.md` and `./AGENTS.md`.

   The Claude block to insert into `./CLAUDE.md`:

   ```markdown
   ## Workflow Orchestration

   ### 1. Plan Mode Default
   - Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
   - If something goes sideways, STOP and re-plan immediately — don't keep pushing
   - Verification is mandatory, but routine no-op verification runs inside the active execution/shipping step. Enter plan mode for non-trivial remediation or new work discovered by verification, not for validation that already has clear commands and no expected source changes.
   - Write detailed specs upfront to reduce ambiguity
   - In Codex: use `update_plan` in Default mode and `request_user_input` only when already in Plan mode
   - Do not assume a Claude-style clear-context-on-accept flow or related JSON setting exists

   ### 2. Subagent Strategy
   - Use subagents liberally to keep main context window clean
   - Offload research, exploration, and parallel analysis to subagents
   - For complex problems, throw more compute at it via subagents
   - One task per subagent for focused execution
   - For `agent-team` parallel write lanes, require separate GitHub branches per lane and include a consolidation/PR review step before final integration. This is the explicit exception to direct-to-primary work.

   ### 3. Self-Improvement Loop
   - After ANY correction from the user: update `tasks/lessons.md` with the pattern
   - Write rules for yourself that prevent the same mistake
   - Ruthlessly iterate on these lessons until mistake rate drops
   - Review lessons at session start for relevant project

   ### 4. Verification Before Done
   - Never mark a task complete without proving it works
   - Diff your behavior between main and your changes when relevant
   - Ask yourself: "Would a staff engineer approve this?"
   - Run tests, check logs, demonstrate correctness

   ### 5. Demand Elegance (Balanced)
   - For non-trivial changes: pause and ask "is there a more elegant way?"
   - If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
   - Skip this for simple, obvious fixes — don't over-engineer
   - Challenge your own work before presenting it

   ### 6. Autonomous Bug Fixing
   - When given a bug report: just fix it. Don't ask for hand-holding
   - Point at logs, errors, failing tests — then resolve them
   - Zero context switching required from the user
   - Go fix failing tests without being told how

   ## Task Management

   1. **Plan First**: Write plan to `tasks/roadmap.md` (full plan) and `tasks/todo.md` (current phase) with checkable items
   2. **Verify Plan**: Check in before starting implementation
   3. **Track Progress**: Mark items complete as you go
   4. **Explain Changes**: High-level summary at each step
   5. **Document Results**: Add review section to `tasks/todo.md`
   6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

   ## Core Principles
   - **Simplicity First**: Make every change as simple as possible. Impact minimal code.
   - **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
   - **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
   - **Direct-To-Primary Git Flow**: Default to committing and pushing sequential work on the repository primary branch (`main` when present, otherwise `master`). Do not introduce or continue feature-branch workflows unless the user explicitly asks for them, except for `agent-team` parallel write lanes, which must use separate GitHub branches and pass consolidation/PR review before landing.
   - **Always Ship Mutations**: If a task creates or modifies tracked files, finish by committing and pushing all intended changes before stopping unless the user explicitly says not to. Exception: direct Claude `/run` is execution-only and hands a dirty tracked tree to `/ship`. After shipping, if `tasks/todo.md` has remaining steps, run `/ship` to handle planning and the approval cycle.
   - **No GitHub Actions**: Do not create, modify, or suggest GitHub Actions workflows unless the user explicitly asks for GitHub Actions. This project does not use GitHub Actions for CI/CD by default.
   ```

   The AGENTS block to insert into `./AGENTS.md`:

   ```markdown
   ## Workflow Orchestration

   ### 1. Plan Mode Default
   - Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
   - If something goes sideways, STOP and re-plan immediately — don't keep pushing
   - Verification is mandatory, but routine no-op verification runs inside the active execution/shipping step. Enter plan mode for non-trivial remediation or new work discovered by verification, not for validation that already has clear commands and no expected source changes.
   - Write detailed specs upfront to reduce ambiguity
   - In Codex: use `update_plan` in Default mode and `request_user_input` only when already in Plan mode
   - Do not assume a Claude-style clear-context-on-accept flow or related JSON setting exists

   ### 2. Subagent Strategy
   - Use subagents only when the active Codex tool instructions allow them.
   - When subagents are available and permitted, delegate independent research, exploration, or execution lanes with non-overlapping scopes.
   - One task per subagent for focused execution.
   - Do not override Codex's current subagent permission, tool availability, or parallel-work rules.
   - For `agent-team` parallel write lanes, require separate GitHub branches per lane and include a consolidation/PR review step before final integration. This is the explicit exception to direct-to-primary work.

   ### 3. Self-Improvement Loop
   - After ANY correction from the user: update `tasks/lessons.md` with the pattern
   - Write rules for yourself that prevent the same mistake
   - Ruthlessly iterate on these lessons until mistake rate drops
   - Review lessons at session start for relevant project

   ### 4. Verification Before Done
   - Never mark a task complete without proving it works
   - Diff your behavior between main and your changes when relevant
   - Ask yourself: "Would a staff engineer approve this?"
   - Run tests, check logs, demonstrate correctness

   ### 5. Demand Elegance (Balanced)
   - For non-trivial changes: pause and ask "is there a more elegant way?"
   - If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
   - Skip this for simple, obvious fixes — don't over-engineer
   - Challenge your own work before presenting it

   ### 6. Autonomous Bug Fixing
   - When given a bug report: just fix it. Don't ask for hand-holding
   - Point at logs, errors, failing tests — then resolve them
   - Zero context switching required from the user
   - Go fix failing tests without being told how

   ## Task Management

   1. **Plan First**: Write plan to `tasks/roadmap.md` (full plan) and `tasks/todo.md` (current phase) with checkable items
   2. **Verify Plan**: Check in before starting implementation
   3. **Track Progress**: Mark items complete as you go
   4. **Explain Changes**: High-level summary at each step
   5. **Document Results**: Add review section to `tasks/todo.md`
   6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

   ## Core Principles
   - **Simplicity First**: Make every change as simple as possible. Impact minimal code.
   - **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
   - **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
   - **Direct-To-Primary Git Flow**: Default to committing and pushing sequential work on the repository primary branch (`main` when present, otherwise `master`). Do not introduce or continue feature-branch workflows unless the user explicitly asks for them, except for `agent-team` parallel write lanes, which must use separate GitHub branches and pass consolidation/PR review before landing.
   - **Always Ship Mutations**: If a task creates or modifies tracked files, finish by committing and pushing all intended changes before stopping unless the user explicitly says not to. Codex `$run` ships by default (validates, commits, pushes, plans next) — use `$ship` only to package existing work or unpushed commits.
   - **No GitHub Actions**: Do not create, modify, or suggest GitHub Actions workflows unless the user explicitly asks for GitHub Actions. This project does not use GitHub Actions for CI/CD by default.
   ```

3. **Conditionally add Monorepo Parallel-Work Safety:**

   Detect whether the target repo is a monorepo by checking these heuristics (any match = monorepo):
   1. `pnpm-workspace.yaml` exists at repo root
   2. `package.json` at repo root has a `workspaces` field
   3. `lerna.json` exists at repo root
   4. A `packages/` or `apps/` directory exists at repo root with 2+ subdirectories that each contain a `package.json`

   **If monorepo detected:** append the following section after `### 6. Autonomous Bug Fixing` and before `## Task Management` in both target files:

   ```markdown
   ### 7. Monorepo Parallel-Work Safety
   - NEVER run `pnpm install`, `pnpm add`, `npm install`, `yarn add`, or any command that modifies a shared lockfile (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`) when running as one of multiple parallel agents in a monorepo
   - All dependency changes must be pre-staged in a single serial session before parallel work begins
   - Parallel agents must only write files within their own package directory (e.g. `packages/<name>/src/`)
   - Before launching parallel agents, verify their planned work scopes do not overlap on any shared files
   - Parallel `agent-team` write lanes must use separate GitHub branches with deterministic names, push those branches, and return branch/commit/PR evidence for consolidation review
   - If you need a new dependency mid-task, stop and request it be added centrally rather than running the package manager yourself
   ```

   **If not a monorepo:** ensure that `### 7. Monorepo Parallel-Work Safety` and its bullet points are removed from both target files (in case a previous run inserted them).

4. **Report result:**
   - Print whether each target file was created or modified.
   - Print where the block was inserted in each file (top/bottom/after which heading).
   - Print whether the monorepo block was included or skipped (and which heuristic matched, if any).
   - Confirm that the final block appears exactly once in each target file.

## Output Format

Display confirmation directly to the user (the block itself is written to `./CLAUDE.md` and `./AGENTS.md`):

```
Installed workflow orchestration into ./CLAUDE.md and ./AGENTS.md
- ./CLAUDE.md: [created | updated], [top | bottom | after "<heading>"], block appears once
- ./AGENTS.md: [created | updated], [top | bottom | after "<heading>"], block appears once
- Monorepo safety block: [included (matched: <heuristic>) | skipped (not a monorepo)]
```

## Constraints

- Insert the block exactly once per target file — if it already exists, replace rather than duplicate.
- Preserve all other existing content in `./CLAUDE.md` and `./AGENTS.md`.
- Do not modify any file other than `./CLAUDE.md` and `./AGENTS.md`.


## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/provision-agentic-config-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/provision-agentic-config-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/provision-agentic-config-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
