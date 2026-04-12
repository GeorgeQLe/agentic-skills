---
name: enterprise-icp
description: Enterprise multi-stakeholder discovery — map personas, deal-killers, and the evaluation-to-renewal lifecycle
version: 2.3.0
argument-hint: "[optional: target industry or market segment]"
---

# Enterprise ICP — Multi-Stakeholder Discovery Interview

Research-first mapping of the enterprise problem space. Enterprise sales involve multiple stakeholders, each with their own journey and deal-killing "no."

## Workflow

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

1. Read `research/icp.md` (or `research/{app}/icp.md`) if it exists as a starting point. Read the codebase if one exists. Before asking the user how enterprise differs, use WebSearch to research enterprise buying patterns in this product category (e.g., "[category] enterprise buying process", "[category] enterprise vs SMB"). Present the startup ICP summary alongside enterprise research findings, then ask how enterprise differs.
2. Interview the user (1–3 questions per turn, research and recommend by default — assume the user has no insider knowledge unless they explicitly provide it; present findings with data, define relevant terms, state a recommendation, and ask for hard constraints, proprietary facts, or corrections; only ask without a recommendation when evidence cannot resolve the choice) covering:
   - **Stakeholder Map** — Which personas matter? End users, team admin, IT/Security, procurement, champion (see Champion Enablement & Risk for deep analysis), exec sponsor
   - **Per-Persona Journeys** — What each stakeholder needs to see/do/approve; their deal-killing "no"
   - **Enterprise Lifecycle** — Evaluation → pilot → rollout → expansion → renewal requirements
   - **Deal-Killer Requirements** — SSO/SAML, SOC 2, GDPR, HIPAA, audit logs, data residency, RBAC, SLAs
   - **Onboarding Complexity** — Self-serve, team, SSO-provisioned, migration, training needs
   - **Enterprise Value Prop** — How value shifts from startup, ROI story, platform positioning
   - **Champion Enablement & Risk** — Champion identification (role, motivations), enablement toolkit (ROI calculator, case studies, exec summary deck), risk assessment (single-champion dependency, mitigation), multi-champion strategy, champion-to-executive bridge, post-sale champion role
   - **Budget Cycle & Procurement** — Budget cycle timing, budget source (IT/departmental/innovation/exec), procurement path (vendor registration, RFP, security questionnaire, legal, MSA), pricing expectations, competitive displacement
   - **Land-and-Expand Strategy** — Initial landing zone (smallest deployable unit), expansion triggers, expansion mechanics, expansion blockers, account growth trajectory (Year 1 → Year 2 → Year 3)
   - **Enterprise Segmentation** — Segment definitions (mid-market, large enterprise, strategic/Global 2000), segment differences (buying process, stakeholders, deal size), target segment priority, segment-specific deal-killers. Conditional — include only if product serves multiple enterprise tiers.
   > Areas G–J (Champion, Budget, Land-and-Expand, Segmentation) often surface together in conversation. Group related questions across areas when answers naturally span them.
3. **Present findings before writing.** Summarise with evidence: stakeholder map (citing interview responses and research data), critical deal-killers (citing competitor requirements, industry standards, or research findings), lifecycle friction points (citing specific examples or research findings), and key insights. Ask: "Which enterprise constraints, missing stakeholders, or weak assumptions should change this analysis?" Continue with follow-up questions until all non-trivial details are nailed down.
4. Only after user confirms, write the output files.

## Deliverables

- `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) — Stakeholder map, per-persona journeys, enterprise lifecycle (with expansion stage), deal-killers, onboarding matrix, enterprise value prop, champion enablement & risk, budget cycle & procurement, land-and-expand strategy, enterprise segmentation (conditional), next steps
- `research/enterprise-icp-interview.md` (or `research/{app}/enterprise-icp-interview.md`) — Raw interview log

The output file must end with a `## Next Steps` section with a **Recommended** item and **Other options** (2–4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** [recommended skill] — [one-line reason why this is the highest-impact next action given current state]

Other options:
- `$skill` — [description]
- ...

**Recommendation priority** (first applicable becomes the recommendation):
1. IF codebase exists: recommend `$scale-audit` — evaluate whether the codebase meets enterprise deal-killer requirements
2. Otherwise: recommend `$journey-map enterprise` — map the multi-stakeholder journey before building

**Other options** (include all applicable items not chosen as recommended, based on which files exist):
- IF codebase exists: `$scale-audit` — Evaluate codebase against enterprise requirements
- `$plan-interview enterprise [feature]` — Validate the riskiest enterprise assumption (if enterprise specs exist)
- `$journey-map enterprise` — Map enterprise stakeholder journeys (if no `research/journey-map.md`)
- `$journey-map` — Map general user journeys (if no `research/journey-map.md` and `research/icp.md` exists)
- `$competitive-analysis` — Research enterprise competitive landscape (if no `research/competitive-analysis.md`)

## Constraints

- Stay in problem space — do not prescribe solutions.
- Do not assume enterprise ICP is startup ICP scaled up — explicitly explore what changes.
- Continue until all 10 areas are covered.
- Do not overwrite existing `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) without asking the user first.
- Present before writing — never write until findings are validated.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other options.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
