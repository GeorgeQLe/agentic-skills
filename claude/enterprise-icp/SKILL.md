---
name: enterprise-icp
description: Enterprise multi-stakeholder discovery — map personas, deal-killers, and the evaluation-to-renewal lifecycle
argument-hint: [optional: target industry or market segment]
---

# Enterprise ICP — Multi-Stakeholder Discovery Interview

Interview the founder to map the enterprise problem space. Enterprise sales involve multiple stakeholders, each with their own journey and their own "no" that kills the deal. This skill maps all of them and the lifecycle from evaluation through renewal.

## Context Loading

Read `specs/icp.md` if it exists — the startup ICP is a starting point but does not constrain the enterprise analysis. Enterprise is not "startup but bigger." Explicitly explore what changes at enterprise scale.

Also read the codebase, README, and existing specs if a product exists, to ground the interview.

## Process

### 1. Orient

If `specs/icp.md` exists, summarise the startup ICP and ask: "How does the enterprise buyer and user differ from what we mapped here?" If it doesn't exist, start from scratch.

If a codebase exists, summarise what's built and note it as context.

### 2. Interview

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn. Present options with pros/cons when genuine alternatives exist.

Cover these areas:

#### A. Stakeholder Map
Determine which personas are relevant for this product's enterprise market. For each, identify their role in the buying/adoption process:

- **End users** — Daily users of the product. May have tiers (power user, casual user, read-only viewer).
- **Team/workspace admin** — Configures the product, manages seats, sets permissions, handles team onboarding.
- **IT / Security** — Evaluates compliance posture, SSO/SAML requirements, data residency, audit logging, network security.
- **Procurement / Legal** — Contract terms, volume pricing, legal review, DPA/BAA requirements.
- **Internal champion** — The person inside the customer org who advocates for adoption and drives the deal forward.
- **Executive sponsor** — Budget authority, signs off on spend, cares about ROI and strategic alignment.

Not all personas apply to every product. Identify which are relevant and which can be skipped.

#### B. Per-Persona Journeys
For each relevant stakeholder:
- What do they need to see, do, or approve?
- What information do they need and in what format?
- What's their "no" — the thing that kills the deal if missing?
- What does success look like for them specifically?

#### C. Evaluation → Pilot → Rollout → Renewal Lifecycle
- **Evaluation**: How do enterprises discover and assess this product? RFP? POC? Free trial? Vendor demo?
- **Pilot**: What does a pilot look like? Team size, duration, success criteria?
- **Rollout**: How does adoption expand from pilot to org-wide? What's needed for IT to deploy at scale?
- **Renewal**: What drives renewal vs. churn? Usage metrics, ROI proof, executive review?

#### D. Enterprise Deal-Killers
Determine which are mandatory for the target market:
- SSO / SAML / SCIM
- SOC 2 Type II
- GDPR compliance
- HIPAA / BAA (healthcare)
- Audit logging
- Data residency / sovereignty
- Role-based access control (RBAC) granularity
- SLA / uptime guarantees
- Data encryption at rest and in transit
- Vendor security questionnaire readiness

#### E. Onboarding Complexity
- Self-serve onboarding (individual user signs up)
- Team onboarding (admin invites team, configures workspace)
- SSO-provisioned onboarding (users auto-created via IdP)
- Migration from competitor (data import, workflow mapping)
- Training and enablement needs

#### F. Enterprise Value Prop
- How does the value proposition shift from startup to enterprise?
- What additional value justifies enterprise pricing?
- What's the ROI story for the executive sponsor?
- What makes this a "platform" vs. a "tool"?

### 3. Conclude

Confirm all areas are covered. Summarise the stakeholder map, critical deal-killers, and the most important insight from the interview.

## Output

### `specs/enterprise-icp.md`
Structured enterprise discovery document:
1. **Stakeholder Map** — which personas are involved, their role in buying/adoption
2. **Per-Persona Journeys** — what each stakeholder needs, their deal-killer "no"
3. **Enterprise Lifecycle** — evaluation → pilot → rollout → renewal, with requirements at each stage
4. **Deal-Killer Requirements** — mandatory compliance, security, and infrastructure requirements
5. **Onboarding Matrix** — onboarding paths and their requirements
6. **Enterprise Value Proposition** — shifted value prop, ROI story, platform positioning

### `specs/enterprise-icp-interview.md`
Raw interview log — questions, options, responses, and a closing summary of key insights.

Create the `specs/` directory if it doesn't exist.

## Constraints

- **Stay in problem space.** Do not prescribe architecture, features, or solutions — that's for `/plan-interview` and `/scale-audit`.
- **Do not assume enterprise ICP is startup ICP scaled up.** Explicitly challenge: "What changes when you sell to a 500-person company vs. a 10-person team?"
- **Interview style matches `/plan-interview`** — 1–3 focused questions per turn, options with pros/cons, recommendations with reasoning.
- **Continue until all 6 areas are covered.** Confirm with the user before concluding.
- **Do not overwrite existing `specs/enterprise-icp.md`** without asking the user first.
