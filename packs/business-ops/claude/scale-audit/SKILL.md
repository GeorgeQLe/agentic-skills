---
name: scale-audit
description: Evaluate codebase against enterprise ICP for production readiness, compliance, and multi-stakeholder journey coverage
type: analysis
version: v0.5
required_conventions: [alignment-page]
argument-hint: "[optional: path-to-enterprise-icp-spec]"
context_intake: artifact_only
visual_tier: visual
---

## Pack Availability Guard

When recommending a skill from another pack, verify the target pack is installed via `.agents/project.json` `enabled_packs`. If it is not enabled, recommend `npx skillpacks install <pack>` from the project shell. After install, tell Claude users to run `/reload-skills`, then `/clear` or restart if the skill remains invisible. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# Scale Audit — Enterprise Production Readiness

Automated analysis that evaluates the current codebase against the enterprise discovery in `research/enterprise-icp.md`. Identifies what's missing for enterprise deals — per-stakeholder journey coverage, compliance, infrastructure, and operational readiness. No interview — this is the agent doing the work.

## Prerequisites

`research/enterprise-icp.md` (or `research/{slug}/enterprise-icp.md`) must exist. If it doesn't, tell the user to run `/enterprise-icp` first and stop.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

### 1. Load Context

- Read `research/enterprise-icp.md` (or `research/{slug}/enterprise-icp.md`) — stakeholder map, per-persona journeys, deal-killers, lifecycle, onboarding matrix
- Read `research/icp.md` (or `research/{slug}/icp.md`) if it exists — carry forward startup context
- Read `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) if it exists — note unresolved startup gaps that become more critical at enterprise scale
- Read CLAUDE.md, README, package config, existing specs
- Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md` (if they exist) for work in progress or advisory records

### 2. Analyse the Codebase

Read source files thoroughly — auth system, data layer, API design, infrastructure config (Docker, k8s, terraform, CI/CD), monitoring/logging setup, environment configuration, security implementation. Build a complete picture of production readiness.

### 3. Evaluate Against Enterprise ICP

#### Per-Persona Journey Coverage
For each stakeholder identified in `research/enterprise-icp.md`:
- **End users**: Can they complete their core workflows? Does the UX scale to enterprise complexity?
- **Team admin**: Is there an admin panel? Seat management? Permission configuration? Usage analytics?
- **IT / Security**: Can they complete a security review? Are audit logs available? Is SSO configurable? Can they answer a vendor security questionnaire?
- **Procurement**: Is there an enterprise pricing page? Contract-friendly terms? Volume licensing?
- **Executive sponsor**: Is there ROI reporting? Usage dashboards? Success metrics?

#### Onboarding Gap Analysis
For each onboarding path from `research/enterprise-icp.md`:
- Self-serve: Does it exist? Is it frictionless?
- Team: Can an admin onboard a team? Bulk invite? Role assignment?
- SSO-provisioned: Is SCIM supported? JIT provisioning? Auto-deprovisioning?
- Migration: Data import tools? Competitor mapping? Migration guides?
- Training: In-app guidance? Documentation? API reference?

#### Compliance Readiness
- **SOC 2**: Audit logging, access controls, change management, incident response procedures
- **GDPR**: Data deletion/export, consent management, data processing records, DPA template
- **HIPAA** (if applicable): BAA template, PHI handling, encryption, access audit trail
- **General security**: Encryption at rest and in transit, secrets management, vulnerability scanning, dependency auditing

#### Infrastructure Readiness
- **Multi-tenancy**: Data isolation model (shared DB with tenant ID? Separate schemas? Separate DBs?)
- **Horizontal scaling**: Can the system scale to enterprise load? Connection pooling? Queue-based processing?
- **Disaster recovery**: Backup strategy, recovery time objectives, failover capability
- **Observability**: Structured logging, metrics collection, distributed tracing, alerting
- **CI/CD maturity**: Automated testing, staging environment, deployment rollback, feature flags
- **Environment parity**: Dev/staging/production consistency

#### Operational Readiness
- **Incident response**: Runbooks, on-call setup, status page, incident communication
- **SLA monitoring**: Uptime tracking, latency monitoring, error rate dashboards
- **Support workflow**: Ticketing, escalation paths, customer communication channels
- **Customer success**: Health scoring, usage analytics, renewal tracking

#### Unresolved Startup Gaps
If `research/mvp-gap.md` exists, check each unresolved gap:
- Is it still unresolved?
- Does it become more critical at enterprise scale?
- Flag any startup gaps that are now enterprise deal-killers.

### 4. Prioritise

Tag each gap with:
- **`hard-blocker`** — No enterprise deal closes without this. Non-negotiable.
- **`soft-blocker`** — Most enterprise deals will require this. Can sometimes be worked around in early deals.
- **`differentiator`** — Not required but gives competitive advantage in enterprise sales.

Estimate effort for each: S / M / L / XL.

### 5. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include a **Recommended** item and 2–4 other applicable options. Choose the recommendation by the first matching condition:

1. IF any `hard-blocker` lacks flow/design shape or a full implementation spec: `/user-flow-map [top blocker]` — map the highest-priority enterprise blocker into concrete screen flow, decisions, branches, states, and recovery paths before UI/layout planning.
2. IF enterprise stakeholder journey context is missing: `/journey-map enterprise` — map enterprise stakeholder journeys before sequencing build work.
3. IF startup gaps escalated and `research/mvp-gap.md` is missing or stale: `/mvp-gap` — re-evaluate startup readiness first.
4. IF enterprise SLA or compliance gaps lack closure metrics: `/metrics` — define metrics covering enterprise SLAs.
5. OTHERWISE: `/roadmap` — sequence the already-specced enterprise work into implementation phases.

Only recommend `/roadmap` as the primary next step when every hard-blocker already has a full spec or is already tracked in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md`.

## Output

### `specs/scale-audit.md` (or `specs/{slug}/scale-audit.md`)

```markdown
# Enterprise Scale Audit

> Evaluated against: research/enterprise-icp.md (or research/{slug}/enterprise-icp.md)
> Date: [current date]
> Codebase state: [brief summary of what exists]

## Summary
[2-3 sentences: overall enterprise readiness and most critical gaps]

## Hard Blockers
- **[Gap title]** — [What's missing, which stakeholder it blocks, and why]. Effort: S/M/L/XL
  _Start with:_ `/user-flow-map [topic]`
- ...

## Soft Blockers
- **[Gap title]** — [What's missing and impact]. Effort: S/M/L/XL
  _Start with:_ `/user-flow-map [topic]`
- ...

## Differentiators
- **[Gap title]** — [What's missing and competitive advantage]. Effort: S/M/L/XL
  _Start with:_ `/user-flow-map [topic]`
- ...

## Stakeholder Coverage Matrix
| Stakeholder | Journey Covered? | Key Gaps |
|-------------|-----------------|----------|
| End users   | Partial/Yes/No  | ...      |
| Team admin  | Partial/Yes/No  | ...      |
| IT/Security | Partial/Yes/No  | ...      |
| Procurement | Partial/Yes/No  | ...      |
| Exec sponsor| Partial/Yes/No  | ...      |

## Compliance Matrix
| Standard | Status | Key Gaps |
|----------|--------|----------|
| SOC 2    | Not started/Partial/Ready | ... |
| GDPR     | Not started/Partial/Ready | ... |
| HIPAA    | N/A/Not started/Partial/Ready | ... |

## Recommended Build Sequence
[Ordered list: hard blockers first, then soft blockers, then differentiators.
 Within each tier, order by: most deals unblocked per unit of effort.
 Note dependencies — what must exist before other things can be built.]

## Unresolved Startup Gaps (Escalated)
[Gaps from research/mvp-gap.md that are now more critical at enterprise scale]

## Next Steps

**Recommended:** [first matching command from step 5] — [reason grounded in this audit]

Other options:
- [conditional items from step 5 — only include items whose conditions are met]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Do not make code changes.** Analysis only.
- **Every gap must cite evidence** — missing middleware, absent SCIM endpoint, no audit log table, etc.
- **Distinguish "first enterprise deal" from "100th enterprise deal."** Early enterprise sales can tolerate workarounds; at scale they can't. Be clear about which gaps matter when.
- **Include `/user-flow-map` prompts** for each gap that lacks flow/design shape or a full spec. Use `/ux-variations --layout-mode` only when flow and UI requirements already exist but layout alternatives are missing.
- **Do not duplicate work already tracked** in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md`.
- **If the codebase is minimal**, be honest about it — don't fabricate detailed infrastructure gaps for a prototype.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/scale-audit-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
