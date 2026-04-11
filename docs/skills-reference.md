# Skills Reference

Complete reference for all 55 custom skills in this repository, available for both Claude Code and Codex.

## Tool Compatibility

The repository contains both Claude Code and Codex skill variants, but the full workflow is not currently equivalent across the two tools.

- **Claude Code**: supports the plan-mode-first workflow described in `CLAUDE.md`, including skill flows that rely on entering plan mode before execution.
- **Codex**: supports the skill documents and `$skill` invocation structure, but does **not** currently provide a skill-level equivalent of Claude Code's "enter plan mode, then clear context and implement" loop. In Codex, `request_user_input` is only available when the session is already in Plan mode, and Codex skills cannot force that mode from a normal session.

Practical consequence:

- The research and documentation skills port well to Codex.
- The execution workflow as documented here (`/run` in Claude Code, `$run` in Codex, plus ship/kanban variants) is fully usable in Claude Code.
- Codex currently needs a different workflow design for execution and approval handling. The existing Codex skill docs now describe the current fallback behavior, but that is not true parity with Claude Code.

See [Codex Workflow](./codex-workflow.md) for the current skill-to-skill translation and the manual gaps that still need to be handled operationally.

## Invocation Syntax

- **Claude Code** examples use `/skill-name`
- **Codex** examples use `$skill-name`
- When a section below names a skill without spelling out both forms, translate the prefix for the tool you are using

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

These skills form a structured development workflow in **Claude Code**:

```
Discover                      Ideate                       Specify                 Map              Strategize          Execute                    Ship                    Evaluate             Learn
─────────��──────────────      ─────────────────────────    ────────────────────    ──────────────   ──────────────      ───────────────────────    ──────────────────────   ──────────────       ──────────────
/icp                      →   /brainstorm              →   /plan-interview    →    /journey-map →   /roadmap       →    /run (single step)    →    /ship              →    /mvp-gap         →   /customer-feedback
/competitive-analysis         └→ /plan-interview --ideas                             /metrics         /gtm                /run --phase (full)        /ship-end               /scale-audit              ↓
/enterprise-icp                                                                                                                                                                            (back to Discover)

/workflow — runs at any point to check status and recommend next step
```

**Gap-first flow (concept, no product)**: `/competitive-analysis concept` → (if gap validated) → `/icp` → `/competitive-analysis` → `/brainstorm` → ...
**New project flow**: `/icp` → `/competitive-analysis` → `/brainstorm` → `/plan-interview` → `/journey-map` → `/metrics` → `/roadmap` → `/gtm` → `/plan-phases` → `/run` → `/ship` → `/mvp-gap` → `/customer-feedback` → (iterate)
**Existing project flow**: `/icp` → `/competitive-analysis` → `/mvp-gap` → `/brainstorm` → `/plan-interview` → `/journey-map` → `/metrics` → `/roadmap` → ...
**Enterprise expansion**: `/enterprise-icp` → (build cycle) → `/scale-audit`
**Platform expansion**: `/icp` → `/competitive-analysis` → `/platform-strategy` → `/experiment` → `/plan-interview` → `/roadmap` → ...
**At any point**: `/workflow` to check status, stale items, and recommended next step

For **Codex**, the same flow is invoked with `$skill-name` rather than `/skill-name`, and it remains an approximate map of the intended workflow rather than a guarantee that every approval or plan-mode transition works the same way.

Supporting skills plug in at any point: `/expert-review`, `/spec-drift`, `/branch-lifecycle`, `/investigate`, `/affected`, `/regression-check`, etc.

## Activity Types

Each skill has a `type` field in its frontmatter that describes *what kind of work* it does (orthogonal to workflow stage, which describes *when* you'd use it). Use `/skills types` in Claude Code or `$skills types` in Codex to browse skills grouped by type.

| Type | What it does | Output | Skills |
|------|-------------|--------|--------|
| **research** | Web search + analysis | Documents, market insights | `icp`, `enterprise-icp`, `competitive-analysis`, `platform-strategy`, `gtm`, `landing-copy`, `monetization`, `customer-feedback`, `research-reconcile` |
| **analysis** | Reads codebase/docs | Assessments, gap reports | `mvp-gap`, `scale-audit`, `journey-map`, `metrics`, `burn-rate`, `workflow`, `spec-drift`, `affected`, `dead-code`, `hygiene`, `slim-audit`, `analyze-sessions` |
| **planning** | Interactive interviews | Specs, roadmaps, phases | `brainstorm`, `plan-interview`, `plan-interview --ideas`, `roadmap`, `plan-phases`, `brainstorm --kanban`, `plan-interview --kanban`, `roadmap --kanban` |
| **execution** | Writes/modifies code | Code changes | `run`, `scaffold`, `migrate`, `decommission`, `run --kanban` |
| **review** | Reads code, reports issues | Review reports (no changes) | `expert-review`, `regression-check`, `trace` |
| **debugging** | Investigates + fixes | Root cause + fix | `investigate`, `debug` |
| **shipping** | Commits, deploys, wraps up | Commits, releases, handoffs | `ship`, `ship-end`, `release`, `deploy`, `commit-and-push-by-feature`, `handoff`, `sync`, `ship --kanban`, `ship-end --kanban` |
| **ops** | Manages boards, branches, tooling | Board/branch state changes | `poketo-kanban`, `poketo-kanban --archive`, `branch-lifecycle`, `sync-roadmap-kanban`, `skills`, `install-workflow-orchestration` |

---

## Discovery & Market Fit

### `/icp`
Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization.

- **Arguments**: `<spec file path or concept/idea>`
- **Outputs**: `research/icp.md` (structured discovery document), `research/icp-search-log.md` (raw research log)
- **Use when**: Starting a new product idea (before `/plan-interview`) or retrofitting ICP to an existing project.

### `/competitive-analysis`
Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps. Supports concept-validation mode for pre-ICP market gap analysis.

- **Arguments**: `[concept | optional: product category or specific competitors to investigate]`
- **Prerequisites**: Best run after `/icp` so the competitive frame is grounded in your ICP. In concept-validation mode (no ICP, no codebase, or `concept` argument), no prerequisites — asks user to describe the concept instead.
- **Outputs**: `research/competitive-analysis.md` (landscape map, competitor profiles, positioning gaps). In concept-validation mode, includes Gap Assessment (Market State, Incumbent Quality, Gap Quality, Verdict).
- **Use when**: After `/icp`, before `/brainstorm` — understand the market before deciding what to build. OR before `/icp` when you have a concept but no product and want to validate the market gap first.

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

### `/platform-strategy`
Expand from a single product into a multi-product platform — map vertical and horizontal growth vectors, score candidates, design validation experiments, and sequence the portfolio.

- **Arguments**: `[optional: expansion direction e.g. "vertical", "horizontal", or specific adjacent market]`
- **Prerequisites**: `research/icp.md` must exist or a working codebase (run `/icp` first). Enriched by `/competitive-analysis`, `/journey-map`, `/metrics`, `/monetization`, `/positioning`, `/customer-feedback`, `/enterprise-icp`.
- **Outputs**: `research/platform-strategy.md` (core health, expansion vector map, scoring matrix, validation experiments, portfolio sequence, shared platform considerations), `research/platform-strategy-search-log.md`
- **Use when**: Your core product has PMF and you're ready to expand — either deeper into the same customer base (vertical) or into adjacent products for new audiences (horizontal).

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

### `/landing-copy`
Generate or audit landing page copy grounded in upstream research, including hero, benefits, social proof, pricing, FAQ, and CTAs.

- **Arguments**: `[generate|audit] [optional: focus section e.g. "hero", "pricing", "FAQ"]`
- **Outputs**: Generated or audited landing page copy with source-grounded claims and suggested follow-up fixes where needed.
- **Use when**: After ICP and market research, when you need messaging and conversion copy that stays aligned with the actual product and research.

### `/monetization`
Research-driven monetization strategy — revenue models, pricing architecture, unit economics, and packaging grounded in ICP and competitive data.

- **Arguments**: `[optional: focus area e.g. "pricing tiers", "usage-based", "freemium"]`
- **Prerequisites**: `research/icp.md` must exist (run `/icp` first).
- **Outputs**: `research/monetization.md` (revenue model, pricing tiers, unit economics, timing), `research/monetization-interview.md`
- **Use when**: After ICP discovery, to design how to make money — pricing model, tier structure, unit economics, and monetization timing.

### `/burn-rate`
Estimate monthly burn rate from infrastructure signals and calculate payback period against revenue projections.

- **Arguments**: `[optional: focus area e.g. "infrastructure only", "team costs", "runway"]`
- **Prerequisites**: None (soft: `research/monetization.md`, `research/metrics.md`, `research/gtm.md` for revenue context).
- **Outputs**: `research/burn-rate.md` (infrastructure costs, team costs, total burn, payback period, runway, optimization opportunities), `research/burn-rate-interview.md`
- **Use when**: After building infrastructure, to get a concrete dollar estimate of monthly costs and calculate when you'll break even.

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

### `/spec-drift`
Audit specs against codebase — find unimplemented features, diverged implementations, and undocumented code.

- **Arguments**: `[audit|fix] [spec-file|all]`
- **Prerequisites**: At least one spec file in `specs/` (or `specs/{app}/`, `docs/specifications/`).
- **Outputs**: Categorized findings (Errors/Warnings/Info). In `fix` mode, updates specs and writes `specs/drift-report.md`.
- **Use when**: After building or shipping, to verify specs still match the implementation. Especially useful after `/run` or `/ship` to catch drift before it accumulates.

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

### `/plan-interview --ideas`
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
Plan the next incomplete step (or full phase with `--phase`), execute it, ship it, and prepare the next step.

- **Arguments**: `[--phase]`
- **Claude Code**: Single-step execution with a plan-mode approval gate.
- **Codex**: Presents the plan, asks for approval in plain chat, executes the work, commits/pushes it, applies the deploy contract if present, and refreshes `tasks/todo.md` for the next step.
- **Use when**: Ready to implement and ship the next piece of work.

### `/guide`
Click-by-click instructions for manual blockers — DNS, OAuth, signups, and other GUI-dependent tasks.

- **Arguments**: `[optional: task description or manual-todo item text]`
- **Use when**: A manual task blocks progress and you need step-by-step instructions for a third-party dashboard or service portal.
- **Behavior**: Reads `tasks/manual-todo.md` to auto-detect the blocker (or accepts freeform text), web-searches for current instructions, and produces project-tailored click-by-click steps with exact values and output destinations.

---

## Shipping

### `/ship`
Ship already-finished work (update docs, commit, push, deploy) and plan the next step.

- **Arguments**: `[--no-plan] [--no-deploy]`
- **Deploy behavior**: Runs a manual deploy only when `deploy.md` or `tasks/deploy.md` exists; otherwise skips deploy by design.
- **Claude Code**: Supports the repository's intended "ship, then plan next step" workflow directly.
- **Codex**: Compatibility/manual cleanup wrapper. Use it when finished work is already present in the tree or there are unpushed commits to package without running a new step.
- **Use when**: Codex work is already complete and only needs packaging, deploy handling, or next-step planning.

### `/ship-end`
Wrap up the current session — update docs, commit, and push.

- **Arguments**: `[--no-deploy]`
- **Deploy behavior**: Runs a manual deploy only when `deploy.md` or `tasks/deploy.md` exists; otherwise skips deploy by design.
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

### `/slim-audit`
Audit codebase for opportunities to reduce lines of code while preserving functionality, performance, and quality.

- **Arguments**: `[optional: specific package, directory, or file]`
- **Outputs**: Prioritized reduction plan with estimated LOC savings, risk levels, and concrete proposed approaches (does not auto-modify).
- **Use when**: Codebase feels bloated, before a major refactor, or periodic complexity audit. Complements `/dead-code` (which finds unused code) by finding *used but reducible* code.

---

## Debugging

### `/investigate`
Validate user claims against codebase and git history, trace to root cause, and propose a fix.

- **Arguments**: `<error, bug description, user observations, or issue URL> [--plan]`
- **Outputs**: Claim validation results, root cause analysis, fix, and prevention recommendation. With `--plan` or 3+ fix steps, writes fix plan to `tasks/todo.md` instead of applying inline.
- **Use when**: You have a bug report, error, unexpected behavior, or observations/hypotheses you want validated against the code and git history. Use `--plan` when you want a step-by-step fix plan instead of immediate changes.

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
- **Claude Code process**: Audit → plan mode → batch execution → verification.
- **Codex process**: Audit → present plan → approval via normal chat unless already in Plan mode → batch execution → verification.
- **Use when**: Dependency upgrades, file restructuring, API pattern changes.

### `/decommission`
Systematically tear down and remove a service, package, or infrastructure component.

- **Arguments**: `<what to decommission>` (e.g., `bismarck-v0.3`, `packages/old-auth`)
- **Claude Code process**: Dependency audit → plan mode → removal → verification.
- **Codex process**: Dependency audit → present plan → approval via normal chat unless already in Plan mode → removal → verification.
- **Use when**: Removing old services, deprecated packages, or dead infrastructure.

### `/scaffold`
Generate a new package or app in the monorepo following established project conventions.

- **Arguments**: `<type> <name>` (e.g., `package utils`, `app admin-dashboard`)
- **Claude Code process**: Learn conventions → find template → plan mode → generate → verify.
- **Codex process**: Learn conventions → find template → present plan → approval via normal chat unless already in Plan mode → generate → verify.
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
Deploy the project to a target environment with deployment history tracking and staleness detection.

- **Arguments**: `[staging|production] [--status]` (defaults to staging; `--status` shows staleness without deploying)
- **Outputs**: Deploy result + staleness report. Maintains `tasks/deploys.md` ledger with commit ranges per deploy.
- **Use when**: Deploying after a release or for testing. Use `--status` to check which environments are stale.

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

## Git Workflow

### `/branch-lifecycle`
Evaluate feature branches after review and drive one of four outcomes: merge, salvage by cherry-picking selected commits, keep open, or delete.

This is an exception workflow. The default solo-dev path in this library is to land work directly on the repository primary branch (`main` when present, otherwise `master`) and push there.

- **Arguments**: `[--force] [list | pr [branch...] | review <branch-or-pr> | merge <branch-or-pr> | salvage <branch-or-pr> [--onto <base>] [--commits <sha,...>] | cleanup]`
- **Strict merge gate**: focused scope, passing CI/tests, no conflicts, approval requirements satisfied, no unresolved high-severity review findings.
- **Stale default**: no open PR and last commit older than 30 days.
- **Salvage behavior**: shows branch-only commits, preserves only explicitly selected commits, creates a fresh target branch, stops on conflicts, never deletes the source branch automatically.
- **Delete behavior**: merged branches can be removed after confirmation; unmerged branches always require explicit confirmation, even when stale.
- **Use when**: After analysis or review, when you need an explicit branch decision workflow instead of the lighter-weight `/sync` status and PR management flow.

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

Parallel set of `-kanban` skills that manage kanban board state through the shared `poketo kanban` CLI gateway alongside their normal operations. Board lists: Backlog → Todo → In Progress → Done → Punt. The legacy `claude/poketo-kanban/scripts/kanban.mjs` script is fallback/admin-only during rollout.

### `/poketo-kanban`
Low-level board CRUD — list boards, view board, create/update/move cards, search.

- **Arguments**: Varies by subcommand (see `--help`)
- **Use when**: Direct board manipulation outside of workflow skills.

### `/brainstorm --kanban`
Brainstorm ideas and create kanban Backlog cards for each.

- **Arguments**: `[optional: focus area]`
- **Use when**: `/brainstorm` but with automatic kanban card creation.

### `/plan-interview --kanban`
Interview to validate a spec, then update the matching kanban card.

- **Arguments**: `[optional: topic]`
- **Use when**: `/plan-interview` but with kanban card sync.

### `/roadmap --kanban`
Build roadmap and sync phases/steps to kanban Todo cards.

- **Arguments**: `[--existing] [path-to-spec]`
- **Use when**: `/roadmap` but with kanban board sync.

### `/run --kanban`
Execute next step with kanban card tracking and ship it (Todo → In Progress → Done, next card to Todo).

- **Arguments**: `[--phase]`
- **Use when**: `/run` but with cross-device conflict detection, card finalization, and next-card placement.

### `/ship --kanban`
Ship already-finished work and reconcile kanban card state.

- **Arguments**: `[--no-plan] [--no-deploy]`
- **Deploy behavior**: Runs a manual deploy only when `deploy.md` or `tasks/deploy.md` exists; otherwise skips deploy by design.
- **Use when**: `/ship` but with kanban cleanup for already-finished work.

### `/ship-end --kanban`
Wrap up session and move In Progress card to Done with commit refs.

- **Arguments**: `[--no-deploy]`
- **Deploy behavior**: Runs a manual deploy only when `deploy.md` or `tasks/deploy.md` exists; otherwise skips deploy by design.
- **Use when**: `/ship-end` but with kanban card movement.

### `/sync-roadmap-kanban`
Reconcile kanban board state with roadmap docs and codebase reality.

- **Arguments**: None
- **Use when**: Board and roadmap have drifted out of sync.

### `/poketo-kanban --archive`
Archive old Done/Punt cards from the kanban board.

- **Arguments**: `[--days <N>]` (default: 30)
- **Use when**: Board cleanup — archive cards that haven't been updated in N days.

---

## Quick Reference

| Skill | One-liner | Type |
|-------|-----------|------|
| `/icp` | Customer discovery — map ICP, journeys, value prop | research |
| `/competitive-analysis` | Research competitors, map landscape and gaps (supports concept-validation mode) | research |
| `/enterprise-icp` | Enterprise multi-stakeholder discovery | research |
| `/platform-strategy` | Multi-product expansion — vertical/horizontal vectors, scoring, portfolio sequencing | research |
| `/gtm` | Go-to-market planning | research |
| `/landing-copy` | Generate or audit research-grounded landing page copy | research |
| `/monetization` | Revenue models, pricing, unit economics | research |
| `/burn-rate` | Monthly burn rate, payback period, runway from infra signals | analysis |
| `/customer-feedback` | Ingest + synthesize customer feedback | research |
| `/research-reconcile` | Cross-document consistency audit for research outputs | research |
| `/mvp-gap` | Evaluate codebase against ICP for MVP readiness | analysis |
| `/scale-audit` | Enterprise production readiness audit | analysis |
| `/journey-map` | Map user task flows + customer journey funnel | analysis |
| `/metrics` | Success metrics tied to journey stages | analysis |
| `/workflow` | Check status, stale items, next action | analysis |
| `/affected` | Monorepo blast radius analysis | analysis |
| `/dead-code` | Find unused code and dependencies | analysis |
| `/hygiene` | Audit project structure and conventions | analysis |
| `/slim-audit` | Find code reduction opportunities | analysis |
| `/spec-drift` | Audit specs against codebase for drift | analysis |
| `/analyze-sessions` | Usage analytics | analysis |
| `/brainstorm` | Evaluate codebase, suggest improvement ideas | planning |
| `/plan-interview` | Rough idea → validated spec | planning |
| `/plan-interview --ideas` | Spec each idea from ideas.md | planning |
| `/roadmap` | Interview → phased roadmap across all specs | planning |
| `/plan-phases` | Roadmap phase → TDD steps with file detail | planning |
| `/run` | Execute next step and ship it (Claude: plan mode first; Codex: present plan first) | execution |
| `/run --phase` | Execute next full phase and ship it (Claude: plan mode first; Codex: present plan first) | execution |
| `/guide` | Click-by-click instructions for manual blockers | analysis |
| `/scaffold` | Generate new monorepo package/app | execution |
| `/migrate` | Guided migration with verification | execution |
| `/decommission` | Systematic service/package removal | execution |
| `/expert-review` | Expert code review | review |
| `/regression-check` | Full health check (types, lint, tests, build) | review |
| `/trace` | Map request flow through the stack | review |
| `/investigate` | Validate claims → root cause → fix (supports `--plan`) | debugging |
| `/debug` | Investigate + changelog + non-duplicate fix | debugging |
| `/ship` | Package already-finished work, deploy, plan next step | shipping |
| `/ship-end` | Wrap up session | shipping |
| `/release` | Version bump + changelog + tag | shipping |
| `/deploy` | Deploy to staging/production with history tracking | shipping |
| `/commit-and-push-by-feature` | Group commits by feature | shipping |
| `/handoff` | Context snapshot for session continuity | shipping |
| `/sync` | Pull latest from remote | shipping |
| `/branch-lifecycle` | Triage branches into merge, salvage, keep-open, or delete | ops |
| `/poketo-kanban` | Low-level board CRUD | ops |
| `/skills` | Browse and search all skills | ops |
| `/install-workflow-orchestration` | Bootstrap CLAUDE.md | ops |
| `/brainstorm --kanban` | Brainstorm + create kanban cards | planning |
| `/plan-interview --kanban` | Spec interview + kanban card sync | planning |
| `/roadmap --kanban` | Roadmap + kanban board sync | planning |
| `/run --kanban` | Execute step, ship it, and advance kanban state | execution |
| `/ship --kanban` | Package finished work + reconcile kanban card state | shipping |
| `/ship-end --kanban` | Wrap up session + kanban card Done | shipping |
| `/sync-roadmap-kanban` | Reconcile board with roadmap | ops |
| `/poketo-kanban --archive` | Archive old Done/Punt cards | ops |
