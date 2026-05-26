---
name: enterprise-icp
description: Enterprise multi-stakeholder discovery — map personas, deal-killers, and the evaluation-to-renewal lifecycle
type: research
version: v0.2
argument-hint: "[optional: target industry or market segment]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Enterprise ICP — Multi-Stakeholder Discovery Interview

Invoke as `$enterprise-icp`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

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
2. Interview the user one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same enterprise ICP decision, not to batch unrelated questions. Research and recommend by default: assume the user has no insider knowledge unless they explicitly provide it; present findings with data, define relevant terms, state a recommendation, and ask for hard constraints, proprietary facts, or corrections; only ask without a recommendation when evidence cannot resolve the choice. Cover:
   - **Stakeholder Map** — Which personas matter? End users, team admin, IT/Security, procurement, champion (see Champion Enablement & Risk for deep analysis), exec sponsor
   - **Per-Persona Journeys** — What each stakeholder needs to see/do/approve; their deal-killing "no"
   - **Enterprise Buying Stages** — Evaluation → pilot → rollout requirements and blockers. Lifecycle mapping (expansion, renewal) belongs in `$journey-map`
   - **Deal-Killer Requirements** — SSO/SAML, SOC 2, GDPR, HIPAA, audit logs, data residency, RBAC, SLAs
   - **Onboarding Complexity** — Self-serve, team, SSO-provisioned, migration, training needs
   - **Enterprise Requirements Delta** — What enterprise buyers specifically need vs. startup ICP, ROI story. Strategic positioning belongs in `$positioning`
   - **Champion Enablement & Risk** — Champion identification (role, motivations), enablement toolkit (ROI calculator, case studies, exec summary deck), risk assessment (single-champion dependency, mitigation), multi-champion strategy, champion-to-executive bridge, post-sale champion role
   - **Procurement Reality** — Budget cycle timing, budget source (IT/departmental/innovation/exec), procurement path (vendor registration, RFP, security questionnaire, legal, MSA), approval chain. Pricing justification and competitive displacement belong in `$monetization`
   - **Land-and-Expand Patterns (Observed)** — Initial landing zone (smallest deployable unit), observed expansion triggers, expansion blockers. GTM strategy recommendations and account growth projections belong in `$gtm`
   - **Enterprise Segmentation** — Segment definitions (mid-market, large enterprise, strategic/Global 2000), segment differences (buying process, stakeholders, deal size), target segment priority, segment-specific deal-killers. Conditional — include only if product serves multiple enterprise tiers.
   > Areas G-J (Champion, Budget, Land-and-Expand, Segmentation) often surface together in conversation. Let answers inform nearby areas, but keep Codex follow-up questions one primary decision at a time.
3. **Present findings before writing.** Summarise with evidence: stakeholder map (citing interview responses and research data), critical deal-killers (citing competitor requirements, industry standards, or research findings), lifecycle friction points (citing specific examples or research findings), and key insights. Ask: "Which enterprise constraints, missing stakeholders, or weak assumptions should change this analysis?" Continue with follow-up questions until all non-trivial details are nailed down.
4. Only after user confirms, write the output files.

## Deliverables

- `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) — Stakeholder map, per-persona journeys, enterprise buying stages, deal-killers, onboarding matrix, enterprise requirements delta, champion enablement & risk, procurement reality, land-and-expand patterns, enterprise segmentation (conditional), signals for downstream research, next steps
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
- `$spec-interview enterprise [feature]` — Validate the riskiest enterprise assumption (if enterprise specs exist)
- `$journey-map enterprise` — Map enterprise stakeholder journeys (if no `research/journey-map.md`)
- `$journey-map` — Map general user journeys (if no `research/journey-map.md` and `research/icp.md` exists)
- `$competitive-analysis` — Research enterprise competitive landscape (if no `research/competitive-analysis.md`)

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Stay in problem space — do not prescribe solutions.
- Do not assume enterprise ICP is startup ICP scaled up — explicitly explore what changes.
- Continue until all 10 areas are covered.
- Do not overwrite existing `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) without asking the user first.
- Present before writing — never write until findings are validated.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other options.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/enterprise-icp-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
