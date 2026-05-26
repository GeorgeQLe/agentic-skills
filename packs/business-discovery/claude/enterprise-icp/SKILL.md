---
name: enterprise-icp
description: Enterprise multi-stakeholder discovery — map personas, deal-killers, and the evaluation-to-renewal lifecycle
type: research
version: v0.2
argument-hint: "[optional: target industry or market segment]"
---

# Enterprise ICP — Multi-Stakeholder Discovery Interview

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Interview the founder to map the enterprise problem space. Enterprise sales involve multiple stakeholders, each with their own journey and their own "no" that kills the deal. This skill maps all of them and the lifecycle from evaluation through renewal.

## Context Loading

Read `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) if it exists — the startup ICP is a starting point but does not constrain the enterprise analysis. Enterprise is not "startup but bigger." Explicitly explore what changes at enterprise scale.

Also read the codebase, README, and existing specs/research if a product exists, to ground the interview.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Orient

If `research/icp.md` (or `research/{app}/icp.md`) exists, summarise the startup ICP. Before asking the user, use WebSearch to research enterprise buying patterns in this product category (e.g., "[category] enterprise buying process", "[category] enterprise vs SMB", "[category] enterprise procurement requirements"). Present the startup ICP summary alongside your enterprise research findings, then ask: "How does the enterprise buyer and user differ from what we mapped here? Here's what I found about enterprise buying patterns in this space — does this match your experience?" If no ICP exists, start from scratch but still run the enterprise buying pattern research first.

If a codebase exists, summarise what's built and note it as context.

### 2. Interview

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn.

**Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge they haven't shared (internal constraints, personal preferences, strategic bets).

Cover these areas:

#### A. Stakeholder Map
Determine which personas are relevant for this product's enterprise market. For each, identify their role in the buying/adoption process:

- **End users** — Daily users of the product. May have tiers (power user, casual user, read-only viewer).
- **Team/workspace admin** — Configures the product, manages seats, sets permissions, handles team onboarding.
- **IT / Security** — Evaluates compliance posture, SSO/SAML requirements, data residency, audit logging, network security.
- **Procurement / Legal** — Contract terms, volume pricing, legal review, DPA/BAA requirements.
- **Internal champion** — The person inside the customer org who advocates for adoption and drives the deal forward. See section 7 (Champion Enablement & Risk) for deep analysis of identification, enablement, risk, and multi-champion strategy.
- **Executive sponsor** — Budget authority, signs off on spend, cares about ROI and strategic alignment.

Not all personas apply to every product. Identify which are relevant and which can be skipped.

#### B. Per-Persona Journeys
For each relevant stakeholder:
- What do they need to see, do, or approve?
- What information do they need and in what format?
- What's their "no" — the thing that kills the deal if missing?
- What does success look like for them specifically?

#### C. Enterprise Buying Stages
- **Evaluation**: How do enterprises discover and assess this product? RFP? POC? Free trial? Vendor demo? What evaluation criteria matter most?
- **Pilot**: What does a pilot look like? Team size, duration, success criteria, who owns the pilot?
- **Rollout**: What's needed for IT to deploy at scale? What are the rollout blockers?
- Lifecycle mapping (expansion, renewal, retention loops) belongs in `/journey-map` — capture lifecycle signals in the appendix below.

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

#### F. Enterprise Requirements Delta
- What do enterprise buyers specifically need to hear vs. startup ICP?
- What enterprise-specific requirements exist that the startup ICP doesn't cover?
- What's the ROI story for the executive sponsor?
- Strategic value framing and positioning belong in `/positioning` — capture value language signals in the appendix below.

#### G. Champion Enablement & Risk
- **Champion identification** — how to find/recognize, typical role, motivations (career, productivity, innovation mandate)
- **Champion enablement toolkit** — ROI calculator, case studies, exec summary deck, security whitepaper, competitive comparison; format preferences
- **Champion risk assessment** — single-champion dependency, role change, political capital loss, mitigation
- **Multi-champion strategy** — second/third champions across departments and levels
- **Champion-to-executive bridge** — how champion gets exec sponsor buy-in, what they need from you
- **Post-sale champion** — do they become admin, evangelist, renewal driver?

#### H. Procurement Reality
- **Budget cycle timing** — annual planning, quarterly review, deal timing impact
- **Budget source** — IT, departmental, innovation, executive discretionary
- **Procurement path** — vendor registration, RFP, security questionnaire, legal review, MSA; duration per step
- **Approval chain** — who signs, what thresholds trigger additional approvals, fiscal year timing
- Pricing justification, custom pricing models, and competitive displacement analysis belong in `/monetization` — capture budget signals in the appendix below.

#### I. Land-and-Expand Patterns (Observed)
- **Initial landing zone** — smallest deployable unit (team, department, use case)
- **Expansion triggers** — usage metrics, user requests, exec visibility (observed patterns, not strategy recommendations)
- **Expansion blockers** — budget, IT resistance, competing priorities, integration requirements
- GTM strategy recommendations and account growth projections belong in `/gtm` — capture expansion signals in the appendix below.

#### J. Enterprise Segmentation
- **Segment definitions** — mid-market (100–1000), large enterprise (1000–10000), strategic/Global 2000
- **Segment differences** — buying process, stakeholders, deal size, requirements
- **Target segment** — which to target first and why
- **Segment-specific deal-killers** — what's mandatory at each tier

> Areas G–J often surface together in conversation. Group related questions across areas when the user's answers naturally span them.

### 3. Present Findings & Validate

After covering all areas, **present the complete findings to the user before writing**. Summarise with evidence:
1. The stakeholder map and which personas matter most — cite interview responses and research data that identified each persona
2. The critical deal-killers (the "must-haves" vs. "nice-to-haves") — cite competitor requirements, industry standards, or research findings that validate each
3. The enterprise lifecycle and where the biggest friction points are — cite specific examples or research findings for each friction point
4. The enterprise value prop and how it differs from startup
5. The most important insight from the interview

Use the AskUserQuestion tool to ask:
- "Does this capture everything? Any gaps or corrections before I write this up?"
- If anything is ambiguous or under-specified, ask targeted follow-up questions to nail it down

Continue until the user confirms the findings are complete and accurate. Only then proceed to writing.

### 4. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- IF codebase exists: `/scale-audit` — Evaluate enterprise readiness against stakeholder map and deal-killers
- IF no enterprise feature specs in `specs/`: `/spec-interview enterprise [feature]` — Spec the top deal-killer that needs a spec
- IF `research/journey-map.md` exists but doesn't cover enterprise: `/journey-map enterprise` — Map enterprise stakeholder journeys
- IF no `research/journey-map.md`: `/journey-map` — Map user and customer journeys first
- IF `research/icp.md` exists but no `research/competitive-analysis.md`: `/competitive-analysis` — Research how competitors serve enterprise

### 5. Write Output

Only after the user has validated the findings, write the output files.

## Output

### `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`)
Structured enterprise discovery document:
1. **Stakeholder Map** — which personas are involved, their role in buying/adoption
2. **Per-Persona Journeys** — what each stakeholder needs, their deal-killer "no"
3. **Enterprise Buying Stages** — evaluation → pilot → rollout, with requirements and blockers at each stage
4. **Deal-Killer Requirements** — mandatory compliance, security, and infrastructure requirements
5. **Onboarding Matrix** — onboarding paths and their requirements
6. **Enterprise Requirements Delta** — enterprise-specific requirements vs. startup ICP, ROI story
7. **Champion Enablement & Risk** — identification, enablement toolkit, risk assessment, multi-champion strategy, champion-to-executive bridge, post-sale champion role
8. **Procurement Reality** — budget cycle timing, budget source, procurement path, approval chain
9. **Land-and-Expand Patterns** — initial landing zone, observed expansion triggers, expansion blockers
10. **Enterprise Segmentation** — (conditional — include only if product serves multiple enterprise tiers) segment definitions, segment differences, target segment, segment-specific deal-killers
11. **Next Steps** — contextual next actions (populated from step 4)
12. **Signals for Downstream Research** — unvalidated observations routed to downstream skills

The Signals appendix uses this structure:
```
## Signals for Downstream Research

> Raw signals captured during research. These are unvalidated observations —
> use the linked skill to verify, validate, and explore alternatives.

### → /journey-map
- [signal]: lifecycle stages observed during enterprise interviews
- [signal]: renewal triggers or churn signals mentioned
- [signal]: post-rollout adoption patterns described

### → /monetization
- [signal]: budget ranges or thresholds mentioned
- [signal]: procurement constraints that affect pricing
- [signal]: expansion revenue triggers observed

### → /gtm
- [signal]: land-and-expand patterns described by interviewees
- [signal]: champion enablement signals for GTM planning
- [signal]: account growth trajectory observations

### → /competitive-analysis
- [signal]: enterprise competitor names mentioned
- [signal]: incumbent displacement patterns described
- [signal]: enterprise-specific competitive dynamics observed
```

### `research/enterprise-icp-interview.md` (or `research/{app}/enterprise-icp-interview.md`)
Raw interview log — questions, options, responses, and a closing summary of key insights.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Stay in problem space.** Do not prescribe architecture, features, or solutions — that's for `/spec-interview` and `/scale-audit`.
- **Do not assume enterprise ICP is startup ICP scaled up.** Explicitly challenge: "What changes when you sell to a 500-person company vs. a 10-person team?"
- **Interview style matches `/spec-interview`** — 1–3 focused questions per turn, options with pros/cons, recommendations with reasoning.
- **Continue until all 10 areas are covered.** Confirm with the user before concluding.
- **Do not overwrite existing `research/enterprise-icp.md`** (or `research/{app}/enterprise-icp.md`) without asking the user first.
- **Present before writing.** Never write output files until findings have been presented to the user and validated. The user must see and approve the analysis before anything is written to disk.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/enterprise-icp-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
