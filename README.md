# Claude Skills

A shared skill library for **Claude Code** and **OpenAI Codex** that provides 60 structured workflows spanning the full product lifecycle — from customer discovery through shipping, deployment, and post-launch analysis.

Skills are markdown-defined prompts that extend AI coding assistants with opinionated, multi-step workflows. Each skill lives in its own directory as a `SKILL.md` file and is installed via symlinks into each tool's global skills directory.

## Table of Contents

- [Installation](#installation)
- [Repository Structure](#repository-structure)
- [Platform Differences: Claude Code vs Codex](#platform-differences-claude-code-vs-codex)
- [Workflow Overview](#workflow-overview)
- [Workflow Flows](#workflow-flows)
- [Skills Reference](#skills-reference)
  - [Discovery & Market Fit](#discovery--market-fit)
  - [Planning & Specification](#planning--specification)
  - [Strategy & Analysis](#strategy--analysis)
  - [Execution](#execution)
  - [Code Quality & Review](#code-quality--review)
  - [Debugging](#debugging)
  - [Refactoring & Migration](#refactoring--migration)
  - [Shipping & Deployment](#shipping--deployment)
  - [Git & Branch Management](#git--branch-management)
  - [Context & Session Management](#context--session-management)
  - [Kanban Workflow](#kanban-workflow)
  - [Ops & Utility](#ops--utility)
- [Activity Types](#activity-types)
- [Kanban Integration](#kanban-integration)
- [File Contracts](#file-contracts)
- [Skill Dependencies](#skill-dependencies)
- [Versioning](#versioning)

---

## Installation

```bash
# Install — symlinks skills into ~/.claude/skills/ and ~/.codex/skills/
./install.sh

# Uninstall — removes only symlinks pointing back to this repo
./install.sh --uninstall
```

The installer creates symlinks from each tool's global skills directory to the corresponding source directory in this repo:

- Claude Code: `~/.claude/skills/<name>/` → `claude/<name>/`
- Codex: `~/.codex/skills/<name>/` → `codex/<name>/`

Each tool only sees its own skills. Existing symlinks that point elsewhere are updated; non-symlink files at the target path are skipped with a warning.

## Repository Structure

```
claude-skills/
├── claude/<name>/SKILL.md              # Claude Code skill definitions (60 skills)
├── codex/<name>/SKILL.md               # Codex skill definitions (57 skills)
│         └── agents/openai.yaml        # Codex agent manifests
├── install.sh                          # Symlink installer for both platforms
├── sync.md                             # Post-sync actions (run by /sync skill)
├── scripts/
│   ├── skill-deps.sh                   # Dependency graph validator
│   └── skill-versions.sh              # Semantic versioning auditor
├── docs/
│   ├── skills-reference.md            # Detailed skill catalog
│   ├── codex-workflow.md              # Codex workflow translation guide
│   └── skill-versioning.md           # SemVer rules and audit scripts
└── tasks/
    ├── roadmap.md                     # Phased project plan
    ├── todo.md                        # Current phase execution contract
    ├── history.md                     # Append-only execution log
    ├── ideas.md                       # Future skill ideas
    └── manual-todo.md                 # Human-only tasks (when present)
```

## Platform Differences: Claude Code vs Codex

Both platforms share the same skill library but differ in how they handle workflow transitions:

| Capability | Claude Code | Codex |
|-----------|-------------|-------|
| Invocation syntax | `/skill-name` | `$skill-name` |
| Plan mode from skills | Yes — skills can enter plan mode | No — only available when session is already in Plan mode |
| Structured approval gates | Yes — multiple-choice approval in plan mode | No — plain-text approval in normal chat |
| Clear-context transition | Yes — tool-managed fresh implementation context | No — manual thread restart required |
| Workflow state | Split between tool state and repo files | Repo files only (`tasks/todo.md` is the primary contract) |

### What this means in practice

- **Research and documentation skills** (icp, competitive-analysis, journey-map, etc.) port well to both platforms with no workflow gaps.
- **Planning skills** (plan-interview, roadmap, plan-phases) work on both but Codex uses plain-text questions instead of structured multiple-choice.
- **Execution skills** (run, ship, migrate) work fully in Claude Code. In Codex, the recommended pattern is: plan in one thread → stop → execute in a fresh thread from `tasks/todo.md`.

### Codex Workflow Cycle

For non-trivial work in Codex, the recommended cycle is:

1. **Planning thread** — run `$plan-interview`, `$roadmap`, `$plan-phases`, or `$run` to prepare the plan
2. **Approval** — review and approve in normal chat
3. **Stop** — end the thread (manual context shedding)
4. **Fresh execution thread** — execute from `tasks/todo.md`, reading only necessary files
5. **Ship** — run `$ship` to compress state for the next thread
6. **Repeat** — start a new planning or execution thread

See [docs/codex-workflow.md](docs/codex-workflow.md) for the full translation guide.

### Skills only available in Claude Code

Three skills currently exist only in the Claude Code variant:

| Skill | Reason |
|-------|--------|
| `/branch-lifecycle` | Relies on interactive approval gates for merge/cleanup |
| `/burn-rate` | Not yet ported |
| `/spec-drift` | Not yet ported |

Default git policy for this library: solo-dev work should land directly on the repository primary branch (`main` when present, otherwise `master`). Shipping, release, and deploy skills should move work onto the primary branch and push there; feature-branch workflows are exception-only.

---

## Workflow Overview

Skills form a structured pipeline across the product lifecycle:

```
Discover          Ideate              Specify             Map            Strategize        Execute              Ship               Evaluate          Learn
───────────       ──────────────      ─────────────       ──────────     ──────────        ───────────────      ──────────────      ──────────        ────────────
/icp          →   /brainstorm     →   /plan-interview →   /journey-map → /roadmap     →    /run            →   /ship          →   /mvp-gap      →   /customer-feedback
/competitive-     └→ /plan-            /plan-phases        /metrics       /gtm              /run --phase         /ship-end          /scale-audit          ↓
  analysis           interview-                                           /monetization                          /deploy            /expert-review   (back to Discover)
/enterprise-icp      ideas                                                /positioning                           /release           /regression-check
                                                                                                                                    /spec-drift
```

**At any point**: `/workflow` checks status, stale items, and recommends the next step.

**Supporting skills** plug in wherever needed: `/expert-review`, `/investigate`, `/debug`, `/trace`, `/affected`, `/dead-code`, `/slim-audit`, `/hygiene`, `/research-reconcile`.

## Workflow Flows

### New Product (concept → shipped product)

```
/icp → /competitive-analysis → /brainstorm → /plan-interview → /journey-map → /metrics
→ /roadmap → /gtm → /plan-phases → /run → /ship → /mvp-gap → /customer-feedback → (iterate)
```

### Gap-First (concept, no product yet)

```
/competitive-analysis concept → (if gap validated) → /icp → /competitive-analysis
→ /brainstorm → /plan-interview → ...
```

### Existing Project

```
/icp → /competitive-analysis → /mvp-gap → /brainstorm → /plan-interview
→ /journey-map → /metrics → /roadmap → /plan-phases → /run → /ship → ...
```

### Enterprise Expansion

```
/enterprise-icp → (build cycle) → /scale-audit
```

### Post-Launch Analysis

```
/metrics → /cohort-review → /retro → /assumption-tracker → /experiment
→ /customer-feedback → (iterate)
```

### Financial Planning

```
/burn-rate → /runway-model → /monetization → /investor-update
```

---

## Skills Reference

### Discovery & Market Fit

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/icp` | Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization | `<spec file or concept>` | `research/icp.md`, `research/icp-search-log.md` |
| `/competitive-analysis` | Research competitors via web search — landscape map, GTM strategies, strengths, weaknesses, market gaps. Supports concept-validation mode for pre-ICP gap analysis | `[concept \| product category \| competitors]` | `research/competitive-analysis.md` |
| `/enterprise-icp` | Enterprise multi-stakeholder discovery — personas, deal-killers, evaluation-to-renewal lifecycle | `[target industry or segment]` | `research/enterprise-icp.md` |
| `/journey-map` | Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) | `[use case or stage]` | `research/journey-map.md` |
| `/customer-feedback` | Ingest and synthesize customer feedback — categorize against ICP and journey map, maintain running log with staleness alerts | `[file path or pasted text]` | `research/customer-feedback.md` (append-only) |
| `/mvp-gap` | Evaluate codebase against ICP to identify gaps blocking first sales and retention | `[path-to-icp-spec]` | `specs/mvp-gap.md` |
| `/scale-audit` | Evaluate codebase against enterprise ICP for production readiness, compliance, and multi-stakeholder coverage | `[path-to-enterprise-icp]` | `specs/scale-audit.md` |
| `/metrics` | Define success metrics framework — activation, engagement, retention, growth, business metrics tied to journey stages | `[focus area]` | `research/metrics.md` |
| `/positioning` | Strategic positioning (April Dunford methodology) — competitive alternatives, unique attributes, value, target segment, market category | `[focus area]` | `research/positioning.md` |
| `/gtm` | Go-to-market planning — channel strategy, messaging, pricing, launch plan, 30/60/90 day traction tactics | `[focus area]` | `research/gtm.md` |
| `/monetization` | Revenue models, pricing architecture, unit economics, and packaging grounded in ICP and competitive data | `[focus area]` | `research/monetization.md` |
| `/burn-rate` | Estimate monthly burn rate from infrastructure signals and calculate payback period against revenue projections | `[focus area]` | `research/burn-rate.md` |
| `/runway-model` | Financial runway and unit economics tracker — burn rate, revenue trajectory, runway in months, scenario modeling | `[focus area]` | `research/runway-model.md` (append-only snapshots) |
| `/assumption-tracker` | Extract and risk-rank assumptions from research docs — living register of what to validate first | none | `research/assumption-tracker.md` |
| `/risk-register` | Systematic risk assessment — key-person, technical, regulatory, competitive, financial, execution risks with mitigations | none | `research/risk-register.md` |
| `/experiment` | Design lean validation experiments — hypothesis, method, success criteria, sample size, timeline, decision rules | `[assumption or hypothesis]` | `research/experiments/<name>.md` |
| `/cohort-review` | Post-launch metrics and funnel analysis — cohort retention, channel performance, progress against targets | none | `research/cohort-review-<date>.md` |
| `/retro` | Strategic decision retrospective — review research decisions against outcomes, update confidence levels, extract patterns | none | `research/retro-<date>.md` |
| `/investor-update` | Generate structured monthly stakeholder update from research state, metrics, roadmap, and feedback | none | `research/investor-update-<YYYY-MM>.md` |
| `/research-reconcile` | Cross-document consistency audit — find contradictions, stale assumptions, and gaps across research outputs | `[audit\|fix] [all\|icp\|pricing\|journey\|enterprise\|feedback]` | Findings report; in fix mode: `research/reconciliation-report.md` |

### Planning & Specification

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/brainstorm` | Evaluate codebase and suggest actionable ideas grouped by effort level (hours/days/weeks) with `/plan-interview` prompts | `[focus area]` | Appends to `tasks/ideas.md` |
| `/plan-interview` | Interview to validate and complete a specification from a rough idea — covers goals, user stories, architecture, APIs, UX, edge cases, security, scope | `[topic]` | `specs/<topic>.md`, `<topic>-interview.md` |
| `/plan-interview-ideas` | Run `/plan-interview` sequentially for each idea in `tasks/ideas.md` | `[filter keyword]` | Multiple `specs/<topic>.md` files |
| `/roadmap` | Build or update phased roadmap by interviewing across all specs, codebase state, and project history. Auto-invokes `/plan-phases` for phase 1 | `[--existing] [path-to-spec]` | `tasks/roadmap.md` |
| `/plan-phases` | Break a roadmap phase into TDD steps with file-level implementation detail. Called automatically by `/roadmap` for phase 1, or manually for later phases | `[phase-number]` or `[path-to-spec]` | `tasks/roadmap.md` (updated), `tasks/todo.md` (current phase) |

### Strategy & Analysis

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/workflow` | Read-only status — completed steps, stale items, missing steps, single recommended next action | none | Display only (no files written) |
| `/spec-drift` | Audit specs against codebase — unimplemented features, diverged implementations, undocumented code | `[audit\|fix] [spec-file\|all]` | Findings; in fix mode: `specs/drift-report.md` |
| `/affected` | Analyze which monorepo packages/apps are affected by current changes — blast radius analysis | `[commit range or branch]` | Display only |
| `/analyze-sessions` | Analyze Claude Code session history — usage breakdown with automation recommendations | none | Structured report |

### Execution

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/run` | Plan the next incomplete step from the phased plan, present for approval, then execute. In Claude Code: plan-mode gate. In Codex: plain-text approval | `[--phase]` | Code changes + `tasks/todo.md` marked complete |
| `/scaffold` | Generate a new package or app in the monorepo following established project conventions | `<type> <name>` | New package directory |
| `/migrate` | Guide a structural migration or dependency upgrade with step-by-step plan and verification | `<description>` | Migrated codebase |
| `/decommission` | Systematically tear down and remove a service, package, or infrastructure component | `<target>` | Removal + verification |

### Code Quality & Review

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/expert-review` | Thorough project-wide code review as an expert panel across correctness, security, performance, architecture, testing, dependencies | `[directory or file]` | Report + Critical/High items written to `tasks/todo.md` |
| `/regression-check` | Comprehensive health check — type-check, lint, tests, build, imports, env vars. Distinguishes new failures from pre-existing | `[package or directory]` | Report + new failures written to `tasks/todo.md` |
| `/dead-code` | Scan for unused exports, unreachable code, orphaned files, and stale dependencies with false-positive filtering | `[package or directory]` | Report + "Safe to Remove" items written to `tasks/todo.md` |
| `/slim-audit` | Audit codebase for LOC reduction opportunities — duplicate code, over-abstraction, verbose patterns, redundant logic | `[package or directory]` | Prioritized reduction plan |
| `/hygiene` | Audit project structure for convention violations, missing files, template drift, and cross-platform sync gaps | `[audit\|fix] [skills\|tasks\|docs\|codex\|all]` | Report; in fix mode: applies mechanical fixes |

### Debugging

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/investigate` | Validate user claims against codebase and git history, trace to root cause, propose minimal fix | `<bug description or issue URL> [--plan]` | Fix + prevention recommendation; with `--plan`: writes to `tasks/todo.md` |
| `/debug` | Investigate a problem, log to debug changelog, cross-check past issues, suggest non-duplicate fix | `<error or symptom>` | Fix + `docs/debug-changelog.md` entry |
| `/trace` | Follow a request end-to-end through the stack from route to database — layer-by-layer with data flow and concerns | `<route or feature>` | Display only |

### Refactoring & Migration

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/migrate` | Guided migration with audit → plan → batch execution → verification | `<description>` | Migrated codebase |
| `/decommission` | Systematic service/package teardown with dependency audit and consumer migration | `<target>` | Clean removal |
| `/scaffold` | Generate new monorepo package/app from conventions and templates | `<type> <name>` | Scaffolded package |

### Shipping & Deployment

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/ship` | Ship current work — update docs, commit, push, deploy, plan next step. Handles phase transitions with just-in-time `/plan-phases` | `[--no-plan] [--no-deploy]` | Commits + deployment + updated `tasks/todo.md` |
| `/ship-end` | Wrap up current session — update docs, commit, push (no next-step planning) | none | Commits + updated `tasks/history.md` |
| `/deploy` | Deploy to staging or production with deployment history tracking and staleness detection | `[staging\|production] [--status]` | Deploy result + `tasks/deploys.md` ledger entry |
| `/release` | Version bump, generate changelog from conventional commits, create annotated tag | `[patch\|minor\|major\|version]` | Version files + changelog + git tag |
| `/commit-and-push-by-feature` | Commit and push all changes grouped by logical feature/function buckets with conventional commit messages | none | Feature-grouped commits |
| `/handoff` | Generate a project-level context snapshot for resuming work in a fresh session | `[focus area]` | `tasks/handoff.md` |

### Git & Branch Management

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/branch-lifecycle` | Exception workflow for legacy/imported branches: inventory, review, merge, salvage, or clean them up | `[list\|pr\|review\|merge\|cleanup]` | Branch/PR operations |
| `/sync` | Pull latest changes from remote, report status, run post-sync actions from `sync.md` | none | Updated repo + status report |

### Context & Session Management

| Skill | Description | Arguments | Key Outputs |
|-------|-------------|-----------|-------------|
| `/handoff` | Self-contained context snapshot for cold-starting a new session | `[focus area]` | `tasks/handoff.md` |
| `/workflow` | Read-only status check — what's done, what's stale, what to do next | none | Display only |
| `/install-workflow-orchestration` | Bootstrap the workflow conventions into a repository's `CLAUDE.md` | none | Updated `CLAUDE.md` |

### Kanban Workflow

A parallel set of `-kanban` skills that manage board state (via Poketo/Neon Postgres) alongside their normal operations. Board lists follow the lifecycle: **Backlog → Todo → In Progress → Done → Punt**.

| Skill | Description | Base Skill |
|-------|-------------|------------|
| `/brainstorm-kanban` | Brainstorm ideas and create Backlog cards for each | `/brainstorm` |
| `/plan-interview-kanban` | Interview to spec, then update matching kanban card with spec summary | `/plan-interview` |
| `/roadmap-kanban` | Build roadmap, sync phases to Todo cards and future work to Backlog | `/roadmap` |
| `/run-kanban` | Execute next step with card tracking (Todo → In Progress) and cross-device conflict detection | `/run` |
| `/ship-kanban` | Ship work, move card to Done or Punt, ensure next card in Todo | `/ship` |
| `/ship-end-kanban` | Wrap session, move In Progress card to Done with commit refs | `/ship-end` |
| `/sync-roadmap-kanban` | Reconcile board state with roadmap docs and codebase reality (non-destructive) | — |
| `/kanban-archive` | Archive old Done/Punt cards (default: 30+ days) | — |
| `/poketo-kanban` | Low-level board CRUD — list boards, view state, create/update/move cards, search | — |

### Ops & Utility

| Skill | Description | Arguments |
|-------|-------------|-----------|
| `/skills` | Browse and search all available skills grouped by workflow stage or activity type | `[list\|types\|search <keyword>]` |
| `/install-workflow-orchestration` | Install workflow orchestration instructions into a repository's `CLAUDE.md` | none |

---

## Activity Types

Each skill has a `type` in its frontmatter describing the kind of work it does (orthogonal to workflow stage):

| Type | What it does | Output | Skills |
|------|-------------|--------|--------|
| **research** | Web search + analysis | Documents, market insights | `icp`, `enterprise-icp`, `competitive-analysis`, `gtm`, `monetization`, `positioning`, `customer-feedback`, `research-reconcile` |
| **analysis** | Reads codebase/docs | Assessments, gap reports | `mvp-gap`, `scale-audit`, `journey-map`, `metrics`, `burn-rate`, `runway-model`, `workflow`, `spec-drift`, `affected`, `dead-code`, `hygiene`, `slim-audit`, `analyze-sessions`, `assumption-tracker`, `cohort-review`, `retro`, `risk-register`, `investor-update`, `experiment` |
| **planning** | Interactive interviews | Specs, roadmaps, phases | `brainstorm`, `plan-interview`, `plan-interview-ideas`, `roadmap`, `plan-phases`, and their `-kanban` variants |
| **execution** | Writes/modifies code | Code changes | `run`, `scaffold`, `migrate`, `decommission`, and `run-kanban` |
| **review** | Reads code, reports issues | Review reports (no changes) | `expert-review`, `regression-check`, `trace` |
| **debugging** | Investigates + fixes | Root cause + fix | `investigate`, `debug` |
| **shipping** | Commits, deploys, wraps up | Commits, releases, handoffs | `ship`, `ship-end`, `release`, `deploy`, `commit-and-push-by-feature`, `handoff`, `sync`, and their `-kanban` variants |
| **ops** | Manages boards, branches, tooling | Board/branch state changes | `poketo-kanban`, `kanban-archive`, `branch-lifecycle`, `sync-roadmap-kanban`, `skills`, `install-workflow-orchestration` |

---

## Kanban Integration

The kanban system uses **Poketo** backed by **Neon Postgres** with **Drizzle ORM** for type-safe SQL.

### Architecture

- **Board discovery**: `tasks/.kanban-board` file stores the board ID, auto-detected by kanban skills
- **CLI**: `kanban.mjs` provides 11 commands for board operations
- **Multi-user coordination**: optimistic locking, audit logging (agentSessionId, hostname, timestamp), cross-device conflict detection (scans In Progress for other hostnames)
- **Test coverage**: 83 tests via vitest

### Card Lifecycle

```
/brainstorm-kanban → creates Backlog cards
/plan-interview-kanban → specs the card (updates description)
/roadmap-kanban → moves current phase to Todo, future to Backlog
/run-kanban → moves to In Progress (warns on conflicts)
/ship-kanban → moves to Done or Punt
/kanban-archive → archives old Done/Punt cards
```

---

## File Contracts

These repo files are the shared workflow surface, especially important for Codex where repo files replace tool-level workflow state:

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `tasks/roadmap.md` | Long-range phased plan with acceptance criteria | Created by `/roadmap`, updated by `/plan-phases` and `/ship` |
| `tasks/todo.md` | Current phase execution contract (the primary handoff artifact) | Created by `/plan-phases`, marked up by `/run` and `/ship` |
| `tasks/manual-todo.md` | Human-only tasks linked to automated steps via `_(blocks: ...)_` and `_(after: ...)_` annotations | Created by `/plan-phases`; checked by `/run`; unchecked `_(blocks: ...)_` items can block phase transition in `/ship` |
| `tasks/history.md` | Append-only execution log | Updated by `/ship` and `/ship-end` |
| `tasks/handoff.md` | Optional session summary for cold starts | Created by `/handoff` |
| `tasks/deploys.md` | Deployment history ledger with commit ranges | Created/updated by `/deploy` |
| `tasks/ideas.md` | Future skill and feature ideas | Updated by `/brainstorm` |
| `tasks/.kanban-board` | Board ID for kanban skills | Auto-created on first kanban skill use |
| `specs/*.md` | Validated specifications | Created by `/plan-interview` |
| `research/*.md` | Research documents (ICP, competitive, journey, etc.) | Created by research skills |
| `docs/debug-changelog.md` | Debug history for recurring issues | Updated by `/debug` |

---

## Skill Dependencies

Skills communicate through repo state files, not through tool-specific messaging. Key dependency chains:

### Research Chain
```
/icp (foundational)
 ├── /competitive-analysis (requires ICP for competitive frame)
 ├── /journey-map (requires ICP + specs)
 │    └── /metrics (requires journey-map)
 ├── /gtm (requires ICP)
 ├── /monetization (requires ICP)
 ├── /mvp-gap (requires ICP)
 └── /customer-feedback (enriched by ICP + journey-map)
```

### Execution Chain
```
/plan-interview → /roadmap → /plan-phases → /run → /ship
                                                     └── (phase transition) → /plan-phases → /run → ...
```

### Cross-Cutting
- `/research-reconcile` audits consistency across all research docs
- `/workflow` detects staleness by comparing git history with research doc dates
- `/spec-drift` verifies specs match implementation after any execution
- Research skills now include **downstream impact checking** — after writing their document, they scan dependent docs for conflicts and recommend `/research-reconcile` if major impacts are found

### Validation Script

```bash
# Check for broken cross-references between skills
bash scripts/skill-deps.sh

# Output formats
bash scripts/skill-deps.sh --broken    # Only broken references
bash scripts/skill-deps.sh --dot       # Graphviz DOT format
bash scripts/skill-deps.sh --json      # JSON output
```

---

## Versioning

All skills use [Semantic Versioning](https://semver.org/) in their `SKILL.md` frontmatter:

```yaml
---
name: my-skill
version: 1.2.0
---
```

| Bump | When |
|------|------|
| **Major** (2.0.0) | Breaking changes — removed flags, renamed arguments, changed output format |
| **Minor** (1.1.0) | New capability without breaking existing behavior |
| **Patch** (1.0.1) | Bug fixes without interface changes |

### Audit

```bash
bash scripts/skill-versions.sh              # Table of all skills with versions
bash scripts/skill-versions.sh --json       # JSON output
bash scripts/skill-versions.sh --missing    # Only skills missing versions
```
