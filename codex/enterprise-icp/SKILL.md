---
name: enterprise-icp
description: Enterprise multi-stakeholder discovery — map personas, deal-killers, and lifecycle
---

# Enterprise ICP — Multi-Stakeholder Discovery Interview

Interview the founder to map the enterprise problem space. Enterprise sales involve multiple stakeholders, each with their own journey and deal-killing "no."

## Workflow

1. Read `specs/icp.md` if it exists as a starting point. Read the codebase if one exists.
2. Interview the user (1–3 questions per turn) covering:
   - **Stakeholder Map** — Which personas matter? End users, team admin, IT/Security, procurement, champion, exec sponsor
   - **Per-Persona Journeys** — What each stakeholder needs to see/do/approve; their deal-killing "no"
   - **Enterprise Lifecycle** — Evaluation → pilot → rollout → renewal requirements
   - **Deal-Killer Requirements** — SSO/SAML, SOC 2, GDPR, HIPAA, audit logs, data residency, RBAC, SLAs
   - **Onboarding Complexity** — Self-serve, team, SSO-provisioned, migration, training needs
   - **Enterprise Value Prop** — How value shifts from startup, ROI story, platform positioning
3. Confirm all areas are covered before concluding.

## Deliverables

- `specs/enterprise-icp.md` — Stakeholder map, per-persona journeys, deal-killers, lifecycle, value prop
- `specs/enterprise-icp-interview.md` — Raw interview log

## Constraints

- Stay in problem space — do not prescribe solutions.
- Do not assume enterprise ICP is startup ICP scaled up — explicitly explore what changes.
- Continue until all 6 areas are covered.
