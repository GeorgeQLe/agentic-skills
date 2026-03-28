---
name: scale-audit
description: Evaluate codebase against enterprise ICP for production readiness, compliance, and multi-stakeholder journey coverage
version: 1.0.0
argument-hint: [optional: path-to-enterprise-icp-spec]
---

# Scale Audit — Enterprise Production Readiness

Automated analysis that evaluates the current codebase against the enterprise discovery in `specs/enterprise-icp.md`. Identifies what's missing for enterprise deals — per-stakeholder journey coverage, compliance, infrastructure, and operational readiness. No interview — this is the agent doing the work.

## Prerequisites

`specs/enterprise-icp.md` must exist. If it doesn't, tell the user to run `/enterprise-icp` first and stop.

## Process

### 1. Load Context

- Read `specs/enterprise-icp.md` — stakeholder map, per-persona journeys, deal-killers, lifecycle, onboarding matrix
- Read `specs/icp.md` if it exists — carry forward startup context
- Read `specs/mvp-gap.md` if it exists — note unresolved startup gaps that become more critical at enterprise scale
- Read CLAUDE.md, README, package config, existing specs
- Read `tasks/roadmap.md` and `tasks/todo.md` for work in progress

### 2. Analyse the Codebase

Read source files thoroughly — auth system, data layer, API design, infrastructure config (Docker, k8s, terraform, CI/CD), monitoring/logging setup, environment configuration, security implementation. Build a complete picture of production readiness.

### 3. Evaluate Against Enterprise ICP

#### Per-Persona Journey Coverage
For each stakeholder identified in `specs/enterprise-icp.md`:
- **End users**: Can they complete their core workflows? Does the UX scale to enterprise complexity?
- **Team admin**: Is there an admin panel? Seat management? Permission configuration? Usage analytics?
- **IT / Security**: Can they complete a security review? Are audit logs available? Is SSO configurable? Can they answer a vendor security questionnaire?
- **Procurement**: Is there an enterprise pricing page? Contract-friendly terms? Volume licensing?
- **Executive sponsor**: Is there ROI reporting? Usage dashboards? Success metrics?

#### Onboarding Gap Analysis
For each onboarding path from `specs/enterprise-icp.md`:
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
If `specs/mvp-gap.md` exists, check each unresolved gap:
- Is it still unresolved?
- Does it become more critical at enterprise scale?
- Flag any startup gaps that are now enterprise deal-killers.

### 4. Prioritise

Tag each gap with:
- **`hard-blocker`** — No enterprise deal closes without this. Non-negotiable.
- **`soft-blocker`** — Most enterprise deals will require this. Can sometimes be worked around in early deals.
- **`differentiator`** — Not required but gives competitive advantage in enterprise sales.

Estimate effort for each: S / M / L / XL.

## Output

### `specs/scale-audit.md`

```markdown
# Enterprise Scale Audit

> Evaluated against: specs/enterprise-icp.md
> Date: [current date]
> Codebase state: [brief summary of what exists]

## Summary
[2-3 sentences: overall enterprise readiness and most critical gaps]

## Hard Blockers
- **[Gap title]** — [What's missing, which stakeholder it blocks, and why]. Effort: S/M/L/XL
  _Start with:_ `/plan-interview [topic]`
- ...

## Soft Blockers
- **[Gap title]** — [What's missing and impact]. Effort: S/M/L/XL
  _Start with:_ `/plan-interview [topic]`
- ...

## Differentiators
- **[Gap title]** — [What's missing and competitive advantage]. Effort: S/M/L/XL
  _Start with:_ `/plan-interview [topic]`
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
[Gaps from specs/mvp-gap.md that are now more critical at enterprise scale]
```

## Constraints

- **Do not make code changes.** Analysis only.
- **Every gap must cite evidence** — missing middleware, absent SCIM endpoint, no audit log table, etc.
- **Distinguish "first enterprise deal" from "100th enterprise deal."** Early enterprise sales can tolerate workarounds; at scale they can't. Be clear about which gaps matter when.
- **Include `/plan-interview` prompts** for each gap for immediate action.
- **Do not duplicate work already tracked** in `tasks/roadmap.md` or `tasks/todo.md`.
- **If the codebase is minimal**, be honest about it — don't fabricate detailed infrastructure gaps for a prototype.
