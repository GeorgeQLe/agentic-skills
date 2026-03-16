# Skills Reference

Complete reference for all 25 custom skills in this repository, available for both Claude Code and Codex.

## Installation

```bash
./install.sh            # Symlink skills into ~/.claude/skills/ and ~/.codex/skills/
./install.sh --uninstall  # Remove only symlinks from this repo
```

## Repository Structure

```
claude-skills/
├── claude/<name>/SKILL.md          # Claude Code skill definitions
├── codex/<name>/SKILL.md           # Codex skill documentation
├── codex/<name>/agents/openai.yaml # Codex agent manifests
├── install.sh                      # Symlink installer
└── docs/skills-reference.md        # This file
```

- **Claude Code** skills are symlinked to `~/.claude/skills/<name>/`
- **Codex** skills are symlinked to `~/.codex/skills/<name>/`
- Each tool only sees its own skills — no cross-contamination.

## Workflow Overview

These skills form a structured development workflow:

```
Plan                    Execute                    Ship
────────────────────    ───────────────────────    ──────────────────────
/plan-interview    →    /run (single step)    →    /ship
/plan-phases       →    /run --phase (full)   →    /ship-then-plan
                        /run-step             →    /ship-end
                        /run-phases
```

Supporting skills plug in at any point: `/review`, `/investigate`, `/affected`, `/regression-check`, etc.

---

## Planning

### `/plan-interview`
Interview to validate and complete a specification.

- **Arguments**: `[optional-topic-override]`
- **Outputs**: `spec.md`, `interview-log.md`
- **Use when**: Starting a new feature or initiative from a rough idea.

### `/plan-phases`
Break a finalized spec into phases, steps, milestones, and TDD test plans.

- **Arguments**: `[path-to-spec]` (defaults to `spec.md`)
- **Outputs**: `tasks/todo.md` (working), `docs/plan.md` (historical)
- **Use when**: A spec is finalized and ready for implementation planning.

---

## Execution

### `/run`
Plan the next incomplete step (or full phase with `--phase`), enter plan mode for approval, then execute.

- **Arguments**: `[--phase]`
- **Default**: Single-step execution with plan mode approval gate.
- **Use when**: Ready to implement the next piece of work.

### `/run-step`
Execute only the next single incomplete step from the current phase.

- **Arguments**: None
- **Use when**: You want to execute one step without the plan mode ceremony.

### `/run-phases`
Execute the next incomplete phase from a phased plan.

- **Arguments**: None
- **Use when**: You want to execute an entire phase in one go.

---

## Shipping

### `/ship`
Ship current work (update docs, commit, push) and optionally plan the next step.

- **Arguments**: `[--no-plan]`
- **Use when**: Work is done and ready to commit.

### `/ship-then-plan`
Ship current work, plan next step, then enter plan mode for clear-and-implement.

- **Arguments**: None
- **Use when**: Shipping and immediately setting up a fresh context for the next step.

### `/ship-end`
Wrap up the current session — update docs, commit, and push.

- **Arguments**: None
- **Outputs**: Updates `tasks/todo.md`, `tasks/history.md`
- **Use when**: Ending a work session.

---

## Code Quality

### `/review`
Conduct a thorough project-wide code review as an expert panel.

- **Arguments**: `[optional: specific directory or file path]`
- **Dimensions**: Correctness, security, performance, architecture, error handling, code quality, testing, dependencies.
- **Use when**: Before shipping, after a major change, or periodic health checks.

### `/regression-check`
Run a comprehensive health check across the project after a major change.

- **Arguments**: `[optional: specific package or directory]`
- **Checks**: Type-check, lint, tests, build, imports, env vars.
- **Use when**: After completing a phase, before a release, or when something feels off.

### `/dead-code`
Scan for unused exports, orphaned files, stale dependencies, and unreachable code.

- **Arguments**: `[optional: specific package or directory]`
- **Outputs**: Prioritized cleanup list (does not auto-delete).
- **Use when**: Periodic codebase hygiene or before a major refactor.

---

## Debugging

### `/investigate`
Autonomously trace a bug from error message to root cause and proposed fix.

- **Arguments**: `<error message, bug description, or issue URL>`
- **Outputs**: Root cause analysis, fix, and prevention recommendation.
- **Use when**: You have a bug report, error, or unexpected behavior.

### `/debug`
Investigate a problem, log it to the debug changelog, cross-check past issues, and suggest a non-duplicate fix.

- **Arguments**: `<error message, bug description, or symptom>`
- **Outputs**: Root cause analysis, fix, updated `docs/debug-changelog.md`.
- **Use when**: Debugging a problem and want to build institutional memory — especially for recurring issues.

### `/trace`
Follow a request end-to-end through the stack from route to database.

- **Arguments**: `<route, endpoint, or feature>` (e.g., `/api/products`, `user login flow`)
- **Outputs**: Layer-by-layer trace with file references, data flow map, and concerns.
- **Use when**: Understanding how a feature works, debugging data flow, or onboarding to unfamiliar code.

---

## Refactoring & Migration

### `/migrate`
Guide a structural migration or dependency upgrade with step-by-step plan and verification.

- **Arguments**: `<description>` (e.g., `move components into subdirectories`, `upgrade Next.js to 15`)
- **Process**: Audit → plan mode → batch execution → verification.
- **Use when**: Dependency upgrades, file restructuring, API pattern changes.

### `/decommission`
Systematically tear down and remove a service, package, or infrastructure component.

- **Arguments**: `<what to decommission>` (e.g., `bismarck-v0.3`, `packages/old-auth`)
- **Process**: Dependency audit → plan mode → removal → verification.
- **Use when**: Removing old services, deprecated packages, or dead infrastructure.

### `/scaffold`
Generate a new package or app in the monorepo following established project conventions.

- **Arguments**: `<type> <name>` (e.g., `package utils`, `app admin-dashboard`)
- **Process**: Learn conventions → find template → plan mode → generate → verify.
- **Use when**: Adding a new package or app to a monorepo.

---

## Monorepo

### `/affected`
Analyze which monorepo packages and apps are affected by current changes.

- **Arguments**: `[optional: commit range or branch]`
- **Outputs**: Directly changed, transitively affected, cross-cutting changes, test commands.
- **Use when**: Before committing, testing, or deploying to understand blast radius.

---

## Release & Deploy

### `/release`
Version bump, generate changelog, tag, and prepare a release.

- **Arguments**: `[patch|minor|major]` or `[specific version]`
- **Process**: Pre-flight checks → changelog from conventional commits → bump → tag → confirm push.
- **Use when**: Cutting a release.

### `/deploy`
Deploy the project to a target environment.

- **Arguments**: `[staging|production]` (defaults to staging)
- **Use when**: Deploying after a release or for testing.

---

## Context & Session Management

### `/handoff`
Generate a project-level context snapshot for resuming work in a fresh session.

- **Arguments**: `[optional: focus area to emphasize]`
- **Outputs**: `tasks/handoff.md` — self-contained document for cold starts.
- **Use when**: Ending a session and want a future session to pick up immediately.

### `/sync`
Pull latest changes from remote and report status.

- **Arguments**: None
- **Use when**: Starting a session or before beginning new work.

---

## Utility

### `/commit-and-push-by-feature`
Commit and push all changes to GitHub grouped by feature/function.

- **Arguments**: None
- **Use when**: You have multiple unrelated changes to commit in logical groups.

### `/analyze-sessions`
Analyze all Claude Code session history and produce a usage breakdown.

- **Arguments**: None
- **Use when**: Understanding your Claude Code usage patterns.

### `/install-workflow-orchestration`
Create or update the current repository's `CLAUDE.md` with workflow conventions.

- **Arguments**: None
- **Use when**: Setting up the workflow in a new repository.

---

## Quick Reference

| Skill | One-liner |
|-------|-----------|
| `/plan-interview` | Rough idea → validated spec |
| `/plan-phases` | Spec → phased plan with TDD |
| `/run` | Execute next step (plan mode first) |
| `/run --phase` | Execute next full phase (plan mode first) |
| `/run-step` | Execute one step (no plan mode) |
| `/run-phases` | Execute one full phase |
| `/ship` | Commit, push, optionally plan next |
| `/ship-then-plan` | Commit, push, plan next in fresh context |
| `/ship-end` | Wrap up session |
| `/review` | Expert code review |
| `/regression-check` | Full health check (types, lint, tests, build) |
| `/dead-code` | Find unused code and dependencies |
| `/debug` | Investigate + changelog + non-duplicate fix |
| `/investigate` | Bug → root cause → fix |
| `/trace` | Map request flow through the stack |
| `/migrate` | Guided migration with verification |
| `/decommission` | Systematic service/package removal |
| `/scaffold` | Generate new monorepo package/app |
| `/affected` | Monorepo blast radius analysis |
| `/release` | Version bump + changelog + tag |
| `/deploy` | Deploy to staging/production |
| `/handoff` | Context snapshot for session continuity |
| `/sync` | Pull latest from remote |
| `/commit-and-push-by-feature` | Group commits by feature |
| `/analyze-sessions` | Usage analytics |
| `/install-workflow-orchestration` | Bootstrap CLAUDE.md |
