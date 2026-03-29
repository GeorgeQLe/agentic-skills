# Skills Reference

Complete reference for all 51 custom skills in this repository, available for both Claude Code and Codex.

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
Discover                      Ideate                       Specify                 Map              Strategize          Execute                    Ship                    Evaluate             Learn
─────────��──────────────      ─────────────────────────    ────────────────────    ──────────────   ──────────────      ───────────────────────    ──────────────────────   ──────────────       ──────────────
/icp                      →   /brainstorm              →   /plan-interview    →    /journey-map →   /roadmap       →    /run (single step)    →    /ship              →    /mvp-gap         →   /customer-feedback
/competitive-analysis         └→ /plan-interview-ideas                             /metrics         /gtm                /run --phase (full)        /ship-end               /scale-audit              ↓
/enterprise-icp                                                                                                                                                                            (back to Discover)

/workflow — runs at any point to check status and recommend next step
```

**New project flow**: `/icp` → `/competitive-analysis` → `/brainstorm` → `/plan-interview` → `/journey-map` → `/metrics` → `/roadmap` → `/gtm` → `/plan-phases` → `/run` → `/ship` → `/mvp-gap` → `/customer-feedback` → (iterate)
**Existing project flow**: `/icp` → `/competitive-analysis` → `/mvp-gap` → `/brainstorm` → `/plan-interview` → `/journey-map` → `/metrics` → `/roadmap` → ...
**Enterprise expansion**: `/enterprise-icp` → (build cycle) → `/scale-audit`
**At any point**: `/workflow` to check status, stale items, and recommended next step

Supporting skills plug in at any point: `/expert-review`, `/investigate`, `/affected`, `/regression-check`, etc.

---

## Discovery & Market Fit

### `/icp`
Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization.

- **Arguments**: `<spec file path or concept/idea>`
- **Outputs**: `research/icp.md` (structured discovery document), `research/icp-search-log.md` (raw research log)
- **Use when**: Starting a new product idea (before `/plan-interview`) or retrofitting ICP to an existing project.

### `/competitive-analysis`
Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps.

- **Arguments**: `[optional: product category or specific competitors to investigate]`
- **Prerequisites**: Best run after `/icp` so the competitive frame is grounded in your ICP.
- **Outputs**: `research/competitive-analysis.md` (landscape map, competitor profiles, positioning gaps)
- **Use when**: After `/icp`, before `/brainstorm` — understand the market before deciding what to build.

### `/mvp-gap`
Evaluate codebase against ICP to identify gaps blocking first sales and retention.

- **Arguments**: `[optional: path-to-icp-spec]`
- **Prerequisites**: `research/icp.md` must exist (run `/icp` first).
- **Outputs**: `specs/mvp-gap.md` (gap analysis with priority tags and `/plan-interview` prompts)
- **Use when**: After building, to check if the product meets the ICP's needs. Re-run as you build.

### `/enterprise-icp`
Enterprise multi-stakeholder discovery — map personas, deal-killers, and the evaluation-to-renewal lifecycle.

- **Arguments**: `[optional: target industry or market segment]`
- **Outputs**: `research/enterprise-icp.md` (stakeholder map, journeys, deal-killers), `research/enterprise-icp-interview.md`
- **Use when**: Pivoting to or expanding into enterprise sales.

### `/journey-map`
Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) through the product.

- **Arguments**: `[optional: specific use case or journey stage to focus on]`
- **Prerequisites**: `research/icp.md` and at least one `specs/*.md` must exist (run `/icp` then `/plan-interview` first).
- **Outputs**: `research/journey-map.md` (user task flows + customer funnel), `research/journey-map-interview.md` (interview log)
- **Use when**: After speccing the solution, before roadmap — maps the with-product experience to inform prioritization and gap analysis.

### `/scale-audit`
Evaluate codebase against enterprise ICP for production readiness, compliance, and multi-stakeholder journey coverage.

- **Arguments**: `[optional: path-to-enterprise-icp-spec]`
- **Prerequisites**: `research/enterprise-icp.md` must exist (run `/enterprise-icp` first).
- **Outputs**: `specs/scale-audit.md` (gap analysis with stakeholder/compliance matrices and `/plan-interview` prompts)
- **Use when**: Before pursuing enterprise deals, to understand production readiness gaps.

### `/customer-feedback`
Ingest and synthesize customer feedback — categorize findings against ICP and journey map, maintain a running log.

- **Arguments**: `[file path, pasted text, or empty to be prompted]`
- **Soft prerequisites**: `research/icp.md` and `research/journey-map.md` improve categorization but aren't required.
- **Outputs**: `research/customer-feedback.md` (running log with synthesis section, append-only per session)
- **Use when**: After getting customer feedback (interviews, support tickets, surveys, reviews). Each run appends a session. Triggers staleness alerts when 3+ findings contradict ICP or journey assumptions.

### `/metrics`
Define success metrics framework — activation, engagement, retention, growth, and business metrics tied to journey stages.

- **Arguments**: `[optional: focus area e.g. "activation", "retention"]`
- **Prerequisites**: `research/journey-map.md` must exist (run `/journey-map` first).
- **Outputs**: `research/metrics.md` (North Star metric, per-category metrics with instrumentation gaps), `research/metrics-interview.md`
- **Use when**: After mapping journeys, to define what success looks like and what needs instrumentation.

### `/gtm`
Go-to-market planning — channel strategy, messaging, pricing, launch plan, and early traction tactics.

- **Arguments**: `[optional: focus area e.g. "pricing", "launch plan"]`
- **Prerequisites**: `research/icp.md` must exist (run `/icp` first).
- **Outputs**: `research/gtm.md` (channels, messaging, pricing, launch plan, 30/60/90 tactics), `research/gtm-interview.md`
- **Use when**: After ICP discovery, to plan how to reach and convert customers.

### `/monetization`
Research-driven monetization strategy — revenue models, pricing architecture, unit economics, and packaging grounded in ICP and competitive data.

- **Arguments**: `[optional: focus area e.g. "pricing tiers", "usage-based", "freemium"]`
- **Prerequisites**: `research/icp.md` must exist (run `/icp` first).
- **Outputs**: `research/monetization.md` (revenue model, pricing tiers, unit economics, timing), `research/monetization-interview.md`
- **Use when**: After ICP discovery, to design how to make money — pricing model, tier structure, unit economics, and monetization timing.

### `/research-reconcile`
Cross-document consistency audit across research outputs — find contradictions, stale assumptions, and gaps.

- **Arguments**: `[audit|fix] [all|icp|pricing|journey|enterprise|feedback]`
- **Prerequisites**: At least 2 research documents must exist in `research/`.
- **Outputs**: Categorized findings (Errors/Warnings/Info). In `fix` mode, edits research docs and writes `research/reconciliation-report.md`.
- **Use when**: After running multiple research skills, to check that documents tell a consistent story. Especially useful after `/customer-feedback` invalidates earlier assumptions.

### `/workflow`
Read-only workflow status — shows completed steps, stale items, missing steps, and recommends the next action.

- **Arguments**: None
- **No prerequisites.** Runs at any point.
- **Outputs**: None (display only — no files written)
- **Use when**: At any point, to check what's been done, what's stale, and what to do next.

---

## Planning

### `/brainstorm`
Evaluate the codebase and suggest actionable ideas to explore with `/plan-interview`.

- **Arguments**: `[optional: focus area e.g. "performance", "new features", "DX"]`
- **Outputs**: Suggestions grouped by effort level (hours/days/weeks) with copy-paste `/plan-interview` prompts.
- **Use when**: Looking for what to work on next, or evaluating improvement opportunities.

### `/plan-interview`
Interview to validate and complete a specification.

- **Arguments**: `[optional-topic-override]`
- **Outputs**: `specs/[topic].md`, `[topic]-interview.md`
- **Use when**: Starting a new feature or initiative from a rough idea.

### `/plan-interview-ideas`
Run plan-interview sequentially for each idea in `tasks/ideas.md`.

- **Arguments**: `[optional: filter keyword to limit which ideas to interview]`
- **Outputs**: Writes `specs/[topic].md` per idea, plus `[topic]-interview.md` logs.
- **Use when**: You've run `/brainstorm` and want to spec out multiple ideas in one session.

### `/roadmap`
Build or update the project roadmap by interviewing across all specs, codebase state, and project history.

- **Arguments**: `[--existing] [path-to-spec]`
- **Outputs**: `tasks/roadmap.md` (phases, goals, scope, acceptance criteria), then invokes `/plan-phases` for phase 1 detail.
- **Use when**: Specs are finalized and you need to decide priority, sequencing, and phase structure across one or more specs. Also use for existing projects to build or revise a roadmap from current state.

### `/plan-phases`
Fill in TDD steps and file-level implementation detail for a roadmap phase.

- **Arguments**: `[phase-number]` or `[path-to-spec]` (if no roadmap exists)
- **Outputs**: Updates `tasks/roadmap.md` with steps, writes `tasks/todo.md` (current phase)
- **Use when**: A roadmap phase needs TDD step detail before execution. Called automatically by `/roadmap` for phase 1, or manually for subsequent phases.

---

## Execution

### `/run`
Plan the next incomplete step (or full phase with `--phase`), enter plan mode for approval, then execute.

- **Arguments**: `[--phase]`
- **Default**: Single-step execution with plan mode approval gate.
- **Use when**: Ready to implement the next piece of work.

---

## Shipping

### `/ship`
Ship current work (update docs, commit, push, deploy) and plan the next step.

- **Arguments**: `[--no-plan] [--no-deploy]`
- **Use when**: Work is done and ready to commit. Handles phase transitions with just-in-time `/plan-phases`.

### `/ship-end`
Wrap up the current session — update docs, commit, and push.

- **Arguments**: None
- **Outputs**: Updates `tasks/todo.md`, `tasks/history.md`
- **Use when**: Ending a work session.

---

## Code Quality

### `/expert-review`
Conduct a thorough project-wide code review as an expert panel, cross-referencing specs, changelogs, and design documents.

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

### `/hygiene`
Audit project structure for convention violations, missing files, template drift, and cross-platform sync gaps.

- **Arguments**: `[audit|fix] [skills|tasks|docs|codex|all]`
- **Outputs**: Categorized report (Errors/Warnings/Info). In `fix` mode, applies mechanical fixes.
- **Use when**: Periodic project structure check, after adding new skills, or before a release to ensure conventions are followed.

---

## Debugging

### `/investigate`
Validate user claims against codebase and git history, trace to root cause, and propose a fix.

- **Arguments**: `<error, bug description, user observations, or issue URL>`
- **Outputs**: Claim validation results, root cause analysis, fix, and prevention recommendation.
- **Use when**: You have a bug report, error, unexpected behavior, or observations/hypotheses you want validated against the code and git history.

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

### `/skills`
Browse and search all available skills, grouped by workflow stage.

- **Arguments**: `[list | search <keyword>]`
- **Use when**: Discovering available skills or finding a skill by keyword.

---

## Kanban Workflow

Parallel set of `-kanban` skills that manage kanban board state (via Poketo/Neon) alongside their normal operations. Board lists: Backlog → Todo → In Progress → Done → Punt.

### `/poketo-kanban`
Low-level board CRUD — list boards, view board, create/update/move cards, search.

- **Arguments**: Varies by subcommand (see `--help`)
- **Use when**: Direct board manipulation outside of workflow skills.

### `/brainstorm-kanban`
Brainstorm ideas and create kanban Backlog cards for each.

- **Arguments**: `[optional: focus area]`
- **Use when**: `/brainstorm` but with automatic kanban card creation.

### `/plan-interview-kanban`
Interview to validate a spec, then update the matching kanban card.

- **Arguments**: `[optional: topic]`
- **Use when**: `/plan-interview` but with kanban card sync.

### `/roadmap-kanban`
Build roadmap and sync phases/steps to kanban Todo cards.

- **Arguments**: `[--existing] [path-to-spec]`
- **Use when**: `/roadmap` but with kanban board sync.

### `/run-kanban`
Execute next step with kanban card tracking (Todo → In Progress, conflict detection).

- **Arguments**: `[--phase]`
- **Use when**: `/run` but with cross-device conflict detection and progress tracking.

### `/ship-kanban`
Ship work and move kanban card to Done or Punt.

- **Arguments**: `[--no-plan] [--no-deploy]`
- **Use when**: `/ship` but with kanban card movement.

### `/ship-end-kanban`
Wrap up session and move In Progress card to Done with commit refs.

- **Arguments**: None
- **Use when**: `/ship-end` but with kanban card movement.

### `/sync-roadmap-kanban`
Reconcile kanban board state with roadmap docs and codebase reality.

- **Arguments**: None
- **Use when**: Board and roadmap have drifted out of sync.

### `/kanban-archive`
Archive old Done/Punt cards from the kanban board.

- **Arguments**: `[--days <N>]` (default: 30)
- **Use when**: Board cleanup — archive cards that haven't been updated in N days.

---

## Quick Reference

| Skill | One-liner |
|-------|-----------|
| `/icp` | Customer discovery — map ICP, journeys, value prop |
| `/competitive-analysis` | Research competitors, map landscape and gaps |
| `/mvp-gap` | Evaluate codebase against ICP for MVP readiness |
| `/enterprise-icp` | Enterprise multi-stakeholder discovery |
| `/journey-map` | Map user task flows + customer journey funnel |
| `/scale-audit` | Enterprise production readiness audit |
| `/customer-feedback` | Ingest + synthesize customer feedback |
| `/metrics` | Success metrics tied to journey stages |
| `/monetization` | Revenue models, pricing, unit economics |
| `/research-reconcile` | Cross-document consistency audit for research outputs |
| `/gtm` | Go-to-market planning |
| `/workflow` | Check status, stale items, next action |
| `/brainstorm` | Evaluate codebase, suggest improvement ideas |
| `/plan-interview` | Rough idea → validated spec |
| `/plan-interview-ideas` | Spec each idea from ideas.md |
| `/roadmap` | Interview → phased roadmap across all specs |
| `/plan-phases` | Roadmap phase → TDD steps with file detail |
| `/run` | Execute next step (plan mode first) |
| `/run --phase` | Execute next full phase (plan mode first) |
| `/ship` | Commit, push, deploy, plan next step |
| `/ship-end` | Wrap up session |
| `/expert-review` | Expert code review |
| `/regression-check` | Full health check (types, lint, tests, build) |
| `/dead-code` | Find unused code and dependencies |
| `/hygiene` | Audit project structure and conventions |
| `/debug` | Investigate + changelog + non-duplicate fix |
| `/investigate` | Validate claims → root cause → fix |
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
| `/skills` | Browse and search all skills |
| `/poketo-kanban` | Low-level board CRUD |
| `/brainstorm-kanban` | Brainstorm + create kanban cards |
| `/plan-interview-kanban` | Spec interview + kanban card sync |
| `/roadmap-kanban` | Roadmap + kanban board sync |
| `/run-kanban` | Execute step with kanban tracking |
| `/ship-kanban` | Ship + move kanban card to Done/Punt |
| `/ship-end-kanban` | Wrap up session + kanban card Done |
| `/sync-roadmap-kanban` | Reconcile board with roadmap |
| `/kanban-archive` | Archive old Done/Punt cards |
