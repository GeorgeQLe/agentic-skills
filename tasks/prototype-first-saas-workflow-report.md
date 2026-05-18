# Prototype-First vs Complete SaaS Workflow Drag Report

> Date: 2026-05-18
> Skill: `$analyze-sessions`
> Scope: local Claude and Codex user-message history

## Executive Summary

The session history supports the concern. Complete-SaaS and production-infrastructure language appears substantially more often than prototype/taste-calibration language, and mixed sessions more often introduce infrastructure before prototype language than the other way around.

This does not prove every database, payment, analytics, or deployment step was premature. Some were clearly deliberate, such as the first-party newsletter capture decision for the Skills Showcase. But the aggregate pattern shows a recurring workflow bias: product work tends to become full-stack/productized before there is enough clickable surface area to calibrate taste, feel, workflow density, and interaction ergonomics.

The highest-leverage change is not a new SaaS-building skill. It is a prototype-first gate across intake and planning skills: when a user asks for a new product, dashboard, SaaS app, marketplace, internal tool, or landing/product experience, the default first phase should be a clickable local/static prototype with fake or fixture data unless the user explicitly opts into durable storage, payments, analytics, auth, or deployment.

## Data Sources

| Source | Messages | Sessions | Date range |
| --- | ---: | ---: | --- |
| Claude history | 9,199 | 3,458 | 2025-12-10 to 2026-05-18 |
| Codex compact history, enriched from rich sessions | 5,778 | 2,196 | 2026-01-20 to 2026-05-18 |
| Total | 14,977 | 5,654 | 2025-12-10 to 2026-05-18 |

Notes:
- Claude source: `~/.claude/history.jsonl`.
- Codex source: `~/.codex/history.jsonl`, enriched with `cwd` from `~/.codex/sessions/**/*.jsonl`.
- Counts are based on user-message text only. Codex rich session developer/system/base instruction records were not included in prompt-pattern counts.
- Keyword counts are evidence of recurring themes, not a perfect semantic classifier. Terms like "database" can be correct for database-specific projects.

## Top Projects By Message Volume

| Project | Messages |
| --- | ---: |
| `bismarck-v0.4` | 1,438 |
| `monorepo` | 1,244 |
| `metternich-engine` | 1,084 |
| `lexcorp-war-room` | 1,071 |
| `loadoutworks.com` | 1,036 |
| `bismarck-v0.3` | 929 |
| `agentic-skills` | 735 |
| `mobile-ideas` | 437 |
| `lexcorp-sdk` | 416 |
| `lexcorp-landing` | 353 |

## Pattern Counts

| Pattern | Message count | Session count |
| --- | ---: | ---: |
| Complete-SaaS / production surface terms | 612 | 425 |
| Prototype-first terms | 230 | 188 |
| Payments / pricing / subscriptions | 100 | 77 |
| Database / storage / persistence | 193 | 147 |
| Analytics / telemetry / tracking | 109 | 87 |
| Deployment / production / hosting | 523 | 332 |
| Taste / feel / calibration terms | 58 | 51 |
| Full product / full-stack / MVP terms | 63 | 71 |

Mixed-session ordering:

| Session class | Count |
| --- | ---: |
| Sessions with infrastructure but no prototype terms | 432 |
| Sessions with prototype terms but no infrastructure terms | 105 |
| Sessions with both prototype and infrastructure terms | 84 |
| Mixed sessions where prototype appears before infrastructure | 16 |
| Mixed sessions where infrastructure appears before prototype | 23 |

The imbalance matters. Infrastructure-only sessions are about 4.1x as common as prototype-only sessions. In mixed sessions, the first mention tilts toward infrastructure-before-prototype.

## Real Examples From History

The examples below are trimmed user-message excerpts. They are not tool outputs or system/developer instructions.

### Early Full-Product Framing

- 2025-12-10, `loadoutworks.com`: "This PRD covers the full project vision, not just the MVP."
- 2026-01-21, `bismarck-v0.3`: "Implement the following plan: # Organization System - Implementation Plan ... team collaboration with role-based access, separate billing per org, and enterprise SSO support."
- 2026-03-05, `script-vis`: "TECHNICAL SPECIFICATION Script-to-Site Web Application Stack: Next.js + tRPC + NeonDB + Drizzle + Better Auth + TanStack Query..."

These are explicit full-stack/productized requests. The risk is not that they are invalid; the risk is that planning skills accept this shape as the default build path instead of asking whether a clickable prototype should come first.

### Prototype/Taste Signals

- 2025-12-11, `loadoutworks.com`: "perhaps we can create a mini demo with our seed data for the landing page, it is not a full demo, but gives the user a taste..."
- 2025-12-11, `loadoutworks.com`: "show not tell, but if they want to save or when we implement it, buy then they need an account"
- 2026-05-04, `metternich-engine`: "I want to prioritize the v0 initial prompt to first game experience... build out their prototype into a full game."
- 2026-05-18, `content`: "$spec-interview can you create a basic kanban board ... hardcoded..."

These show the user's desired direction clearly: use small, tangible interaction loops to calibrate product feel before committing to durable systems.

### Infrastructure Friction And Blockers

- 2026-04-17, `calcllm`: "asset inventory db is also blocked by posthog, you missed that!"
- 2026-04-22, `lexcorp-war-room`: "asset inventory db ... convention: analytics-sdk-installed convention: posthog-shared-project..."
- 2026-04-27, `lexcorp-war-room`: "npm test failed ... larger blocker is new DB-backed failures caused by the missing launch_readiness.env_contract column..."
- 2026-04-23, `bismarck-v0.4`: staging request failed with `401 (Unauthorized)` from a production-like API.

These are the concrete cost centers: auth, analytics, database migrations, env contracts, and staging/prod wiring can block progress before the product shape is validated.

## Monthly Trend

| Month | Source | Messages | Infrastructure | Prototype | Both | Infra/proto blocker |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 2025-12 | Claude | 190 | 23 | 9 | 3 | 2 |
| 2026-01 | Claude | 1,309 | 107 | 73 | 22 | 5 |
| 2026-01 | Codex | 89 | 2 | 6 | 0 | 0 |
| 2026-02 | Claude | 1,786 | 135 | 17 | 3 | 1 |
| 2026-03 | Claude | 2,544 | 126 | 15 | 2 | 0 |
| 2026-03 | Codex | 176 | 3 | 2 | 0 | 0 |
| 2026-04 | Claude | 2,468 | 162 | 20 | 2 | 2 |
| 2026-04 | Codex | 3,851 | 166 | 19 | 6 | 27 |
| 2026-05 | Claude | 902 | 22 | 15 | 2 | 1 |
| 2026-05 | Codex | 1,663 | 58 | 17 | 6 | 2 |

April Codex has a spike in blocker language because multiple prompts included copied summaries of blocked DB/analytics/deploy work. Even treating copied summaries conservatively, this still supports the operational point: production dependencies are where progress often stalls.

## Project Hotspots

Infrastructure-heavy projects:

| Project | Infrastructure messages |
| --- | ---: |
| `bismarck-v0.3` | 165 |
| `bismarck-v0.4` | 144 |
| `lexcorp-war-room` | 96 |
| `loadoutworks.com` | 68 |
| `lexcorp-landing` | 49 |
| `agentic-skills` | 31 |
| `monorepo` | 29 |
| `calcllm` | 27 |

Prototype-heavy projects:

| Project | Prototype messages |
| --- | ---: |
| `metternich-engine` | 55 |
| `bismarck-v0.3` | 27 |
| `bismarck-v0.4` | 24 |
| `agentic-skills` | 18 |
| `lexcorp-war-room` | 13 |
| `loadoutworks.com` | 9 |

Interpretation: the prototype-first behavior exists, especially in game/editor/product-experience work, but it is not the default across business-app/SaaS workflows.

## Skill And Workflow Diagnosis

### What Is Working

- `ux-variation` already asks about prototype budget and explicitly includes clickable prototypes.
- Existing frontend guidance in system instructions favors building actual usable experiences instead of landing-page-only marketing.
- Some specs already contain explicit "no database / no analytics / no runtime API" boundaries, such as the original Skills Showcase website spec.

### What Is Missing

- `feature-interview`, `spec-interview`, `ui-interview`, `roadmap`, and `plan-phase` do not appear to share a hard prototype-first gate for new product surfaces.
- "Business-app" and SaaS pack routing classify the domain but do not force a staged path of prototype -> calibration -> infrastructure decision.
- Implementation planning can jump from product idea to full stack choices such as Neon, auth, payments, analytics, admin, deployment, or tenant models.
- Verification tends to prove implementation correctness after infrastructure exists, not whether the prototype has calibrated taste and feel before infrastructure is added.

## Recommended Workflow Amendments

| Rank | Pattern | Evidence | Recommendation type | Owner surface | Validation expectation |
| ---: | --- | --- | --- | --- | --- |
| 1 | Infrastructure before prototype | 432 infra-only sessions; only 105 prototype-only sessions | Standing instruction + skill update | `global/codex/spec-interview`, `global/codex/feature-interview`, Claude mirrors | Layer1 contract test: new product specs default to "Prototype Phase 0" with fake/fixture data unless user opts into infra |
| 2 | Full-stack PRDs accepted as first build plan | Examples from `loadoutworks.com`, `bismarck-v0.3`, `script-vis` | Skill update | `global/codex/plan-phase`, `global/codex/roadmap` | Contract test: plan-phase separates "vision backlog" from "clickable prototype first slice" |
| 3 | Payments/pricing introduces premature productization | 100 payment/pricing messages across 77 sessions | Pack convention | `packs/business-growth/*`, business-app pack docs | Validation: monetization work produces strategy or mocked pricing UI before Stripe/billing implementation |
| 4 | Analytics blocks product attempts | 109 analytics messages across 87 sessions; explicit PostHog blocker | Standing instruction + pack convention | `packs/business-ops/*`, product intake skills | Validation: analytics defaults to manual observation/checklist until prototype has stable events |
| 5 | DB/storage expands scope early | 193 DB/storage messages across 147 sessions; DB-backed failures and migration blockers | Skill update | `spec-interview`, `plan-phase`, `trace` only after infra opt-in | Validation: specs mark persistence as deferred unless save/share/history is essential to the prototype test |

## Proposed Default Product-Build Policy

For user-facing SaaS, marketplace, internal tool, dashboard, or product-experience work:

1. Default first milestone: clickable prototype using static, local, fake, fixture, or in-memory data.
2. Explicitly defer durable database/storage, auth, payments, analytics, deployment, admin tooling, multi-tenancy, and production observability unless the user asks for them or the prototype cannot test the core interaction without them.
3. Require a taste-calibration checkpoint before infrastructure:
   - What did the user see or click?
   - What felt wrong, slow, generic, too dense, too sparse, or off-brand?
   - Which workflow assumption changed after trying it?
   - What is the smallest infrastructure decision now justified by the prototype?
4. Treat pricing and analytics as design/research surfaces first:
   - Pricing page or mocked plan states before Stripe.
   - Manual observation and acceptance notes before PostHog/Mixpanel.
5. Promote to production infrastructure only after the prototype has one accepted journey and one explicit data lifecycle need.

## Highest-Impact Automations

1. **Prototype-first intake gate**
   - Avoids repeated manual corrections like "basic", "hardcoded", "taste", "show not tell", and "not a full demo".
   - Best form: update `spec-interview` and `feature-interview`.

2. **Plan-phase infrastructure deferral**
   - Stops full PRDs from becoming immediate full-stack execution plans.
   - Best form: update `plan-phase` to split "vision backlog" from "first clickable slice".

3. **Business-app prototype pack convention**
   - Keeps SaaS/business routing without defaulting to SaaS infrastructure.
   - Best form: update pack docs and business-app/global README language.

4. **Analytics/payment/database opt-in checklist**
   - Prevents PostHog, Stripe, Neon, auth, and admin systems from appearing before a prototype proves they are needed.
   - Best form: checklist shared by `spec-interview`, `roadmap`, and `run`.

5. **Prototype validation benchmark**
   - Measures whether generated plans create a clickable experience first and defer infra.
   - Best form: targeted layer1 tests plus a benchmark fixture for a SaaS/dashboard idea.

## Specific Amendments To Make

### `spec-interview`

Add a rule:

> For new user-facing product work, establish a "Prototype Phase 0" before production architecture. Default to fixture/static/in-memory data and no auth, payments, analytics, persistent database, admin tooling, deployment, or multi-tenancy unless the user explicitly opts in or the core prototype cannot be tested without it.

### `feature-interview`

Add an intake decision:

> Is the next artifact a clickable prototype, production implementation, or research/spec only? If the user has not validated taste/feel, recommend clickable prototype first.

### `ui-interview`

Add required calibration questions:

> What should the user be able to click through in the first prototype? What data can be fake? Which infrastructure must be visibly represented but not implemented?

### `plan-phase`

Add a split:

> Keep "eventual production infrastructure" in later phases unless the accepted current phase is explicitly production hardening or the user has already approved infrastructure.

### `run`

Add a guard:

> If a task starts adding database, auth, payments, analytics, or deployment to a product prototype without an explicit plan item or user instruction, stop and re-plan around the clickable prototype.

## Conclusion

The history shows a durable bias toward complete product implementation: 612 complete-SaaS/production messages versus 230 prototype-first messages, 432 infrastructure-only sessions versus 105 prototype-only sessions, and more mixed sessions where infrastructure appears before prototype language than the reverse.

The right workflow amendment is a prototype-first gate across product intake and planning skills. It should make the first useful output a clickable artifact that calibrates taste and feel, while pushing storage, payments, analytics, auth, admin, deployment, and production hardening behind explicit evidence or explicit user choice.

**Next work:** add prototype-first gates to `spec-interview`, `feature-interview`, `ui-interview`, `plan-phase`, and `run`, plus focused tests proving infrastructure is deferred by default.
**Recommended next command:** `$targeted-skill-builder product workflow prototype-first gate before SaaS infrastructure`
