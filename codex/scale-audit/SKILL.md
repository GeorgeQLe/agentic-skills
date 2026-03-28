---
name: scale-audit
description: Evaluate codebase against enterprise ICP for production readiness and compliance
---

# Scale Audit — Enterprise Production Readiness

Automated analysis that evaluates the codebase against `research/enterprise-icp.md`. Identifies gaps for enterprise deals — stakeholder journey coverage, compliance, infrastructure, and operations.

## Prerequisites

`research/enterprise-icp.md` must exist. If not, tell the user to run `/enterprise-icp` first.

## Workflow

1. Read `research/enterprise-icp.md`, `research/icp.md`, `specs/mvp-gap.md` (if they exist), codebase, and in-progress work.
2. Evaluate the codebase across:
   - **Per-Persona Journey Coverage** — Can each stakeholder complete their workflow?
   - **Onboarding Gaps** — Self-serve, team, SSO-provisioned, migration, training
   - **Compliance Readiness** — SOC 2, GDPR, HIPAA, encryption, secrets management
   - **Infrastructure Readiness** — Multi-tenancy, scaling, DR, observability, CI/CD
   - **Operational Readiness** — Incident response, SLA monitoring, support, customer success
   - **Escalated Startup Gaps** — Unresolved MVP gaps now critical at enterprise scale
3. Tag gaps: `hard-blocker`, `soft-blocker`, or `differentiator`. Estimate effort (S/M/L/XL).

## Deliverables

- `specs/scale-audit.md` — Gap analysis with stakeholder coverage matrix, compliance matrix, priority tags, and `/plan-interview` prompts for each gap

## Constraints

- Analysis only — do not make code changes.
- Every gap must cite specific evidence.
- Distinguish "first enterprise deal" from "100th enterprise deal."
- Include `/plan-interview <topic>` prompts for each gap.
