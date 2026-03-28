---
name: enterprise-icp
description: Enterprise multi-stakeholder discovery — map personas, deal-killers, and the evaluation-to-renewal lifecycle
version: 2.0.0
argument-hint: [optional: target industry or market segment]
---

# Enterprise ICP — Multi-Stakeholder Discovery Interview

Interview the founder to map the enterprise problem space. Enterprise sales involve multiple stakeholders, each with their own journey and deal-killing "no."

## Workflow

1. Read `research/icp.md` if it exists as a starting point. Read the codebase if one exists.
2. Interview the user (1–3 questions per turn) covering:
   - **Stakeholder Map** — Which personas matter? End users, team admin, IT/Security, procurement, champion, exec sponsor
   - **Per-Persona Journeys** — What each stakeholder needs to see/do/approve; their deal-killing "no"
   - **Enterprise Lifecycle** — Evaluation → pilot → rollout → renewal requirements
   - **Deal-Killer Requirements** — SSO/SAML, SOC 2, GDPR, HIPAA, audit logs, data residency, RBAC, SLAs
   - **Onboarding Complexity** — Self-serve, team, SSO-provisioned, migration, training needs
   - **Enterprise Value Prop** — How value shifts from startup, ROI story, platform positioning
3. **Present findings before writing.** Summarise stakeholder map, critical deal-killers, lifecycle friction points, and key insights. Ask: "Does this capture everything? Any gaps or corrections?" Continue with follow-up questions until all non-trivial details are nailed down.
4. Only after user confirms, write the output files.

## Deliverables

- `research/enterprise-icp.md` — Stakeholder map, per-persona journeys, deal-killers, lifecycle, value prop
- `research/enterprise-icp-interview.md` — Raw interview log

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: conditionally suggest `/scale-audit`, `/plan-interview enterprise [feature]`, `/journey-map enterprise`, `/journey-map`, `/competitive-analysis` based on codebase existence, enterprise specs, `research/journey-map.md`, `research/icp.md`, and `research/competitive-analysis.md`.

## Constraints

- Stay in problem space — do not prescribe solutions.
- Do not assume enterprise ICP is startup ICP scaled up — explicitly explore what changes.
- Continue until all 6 areas are covered.
- Present before writing — never write until findings are validated.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
