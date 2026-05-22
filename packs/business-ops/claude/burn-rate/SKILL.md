---
name: burn-rate
description: Estimate monthly burn rate from infrastructure signals and calculate payback period against revenue projections
type: analysis
version: 1.0.0
argument-hint: "[optional: focus area e.g. \"infrastructure only\", \"team costs\", \"runway\"]"
---

# Burn Rate — Infrastructure-Grounded Cost & Runway Analysis

Analyzes a project's infrastructure, third-party services, and team costs to estimate monthly burn rate, then calculates payback period and break-even against revenue projections. Bridges the gap between `/monetization` (abstract unit economics) and `/scale-audit` (infrastructure readiness) with concrete, dollar-denominated cost projections.

## Prerequisites

- **Hard**: None — can run on any codebase.
- **Soft**: Read these if they exist — each adds revenue/cost context:
  - `research/monetization.md` (or `research/{app}/monetization.md`) — pricing tiers, unit economics, revenue model
  - `research/metrics.md` (or `research/{app}/metrics.md`) — business metrics, customer counts
  - `research/gtm.md` (or `research/{app}/gtm.md`) — revenue projections, channel costs
  - `research/icp.md` (or `research/{app}/icp.md`) — market context, buyer budget
  - `CLAUDE.md`, `README` — product context

## Process

### 0. App Scope Resolution (Monorepo Support)

Before starting, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Also read `research/monetization.md` (cross-app overview) for broader context

### 1. Load Context

a) Read infrastructure files — check for existence of each and read those found:
   - **Container/orchestration**: `Dockerfile`, `docker-compose.yml`, `docker-compose.*.yml`
   - **IaC**: `terraform/`, `pulumi/`, `cdk/`, `cloudformation/`
   - **Kubernetes**: `k8s/`, `kubernetes/`, `*.yaml` in deploy directories, Helm charts
   - **CI/CD**: `.github/workflows/`, `.circleci/`, `.gitlab-ci.yml`, `Jenkinsfile`
   - **Serverless**: `serverless.yml`, `serverless.ts`, `sam-template.yaml`
   - **PaaS**: `fly.toml`, `render.yaml`, `vercel.json`, `netlify.toml`, `railway.json`, `Procfile`, `app.yaml`, `heroku.yml`
   - **Cloud config**: AWS (`samconfig.toml`, `cdk.json`), GCP (`app.yaml`, `.gcloudignore`), Azure (`azure-pipelines.yml`, `host.json`)

b) Read dependency files for third-party service SDKs:
   - `package.json`, `yarn.lock`, `pnpm-lock.yaml`
   - `requirements.txt`, `Pipfile`, `pyproject.toml`
   - `Cargo.toml`, `go.mod`, `Gemfile`, `build.gradle`, `pom.xml`
   - Look for: Stripe, Twilio, SendGrid, Resend, AWS SDK, GCP SDK, Azure SDK, OpenAI, Anthropic, Auth0, Clerk, Datadog, Sentry, New Relic, Algolia, Typesense, Supabase, PlanetScale, Neon, etc.

c) Read environment templates for service API keys:
   - `.env.example`, `.env.template`, `.env.sample`, `.env.development`
   - Look for: API keys, service URLs, database connection strings that imply paid services

d) Read existing research documents (soft prerequisites listed above) — extract:
   - Revenue projections, pricing tiers, MRR/ARR estimates
   - Unit economics (CAC, LTV, margins)
   - Customer counts or projections
   - Business metrics

e) Read `CLAUDE.md` and `README` for product context.

### 2. Infrastructure Cost Detection

Scan codebase and build a cost inventory across these categories:

| Category | What to detect |
|----------|---------------|
| **Compute** | Cloud provider configs (AWS/GCP/Azure), container orchestration (ECS, k8s, Cloud Run), serverless (Lambda, Cloud Functions), PaaS (Heroku, Fly, Railway, Render, Vercel, Netlify) |
| **Database** | Database connection strings/configs — Postgres, MySQL, MongoDB, Redis, DynamoDB, Firestore, Supabase, PlanetScale, Neon, CockroachDB |
| **Storage** | S3/GCS/Azure Blob configs, CDN configs (CloudFront, Cloudflare), file upload services |
| **Third-party services** | SDK imports and API key references — email (SendGrid, SES, Resend, Postmark), payments (Stripe), auth (Auth0, Clerk, Supabase Auth), monitoring (Datadog, Sentry, New Relic, Grafana Cloud), search (Algolia, Typesense, Meilisearch), AI/ML (OpenAI, Anthropic, Replicate, Hugging Face) |
| **CI/CD** | GitHub Actions minutes, CircleCI, GitLab CI — from workflow configs |
| **DNS/Domain** | Domain configs if detectable (Cloudflare, Route53) |

For each detected service:
a) Use WebSearch (at least 4-6 queries) to find current pricing for the detected services. Prioritize the most expensive categories.
b) Estimate monthly cost using reasonable defaults for a startup-stage project.
c) Note all assumptions (instance size, tier, usage level).
d) Assign confidence: **High** (pricing page with clear tiers), **Medium** (usage-dependent, estimated from codebase signals), **Low** (detected but usage unknown).

### 3. Interview — Fill Cost Gaps

Use AskUserQuestion (2-3 focused questions):

a) Present detected infrastructure with estimated costs in a table. Ask:
   - "Here's what I found in the codebase. Are these estimates roughly right? Any services I missed or got wrong?"

b) Ask about team and operational costs:
   - "What's your team size and approximate fully-loaded cost per person per month? (Or total monthly team cost if easier)"
   - "Any major non-infra costs I can't see in code? (marketing spend, tools/subscriptions, office, legal, etc.)"

c) If revenue data wasn't found in research docs, ask:
   - "What's your current or projected monthly revenue? (MRR if live, projected if pre-revenue)"

### 4. Revenue Projections

a) Load revenue data from existing research docs:
   - `monetization.md` — pricing tiers, revenue model
   - `gtm.md` — revenue projections, traction targets
   - `metrics.md` — business metrics, customer counts

b) Present what was found as defaults. Use AskUserQuestion:
   - "I found these revenue figures in your research docs: [summary]. Are these current? Please confirm or override with actual numbers."
   - Ask for: current MRR/ARR (or projected if pre-revenue), monthly growth rate assumption, customer count (current or projected)
   - Ask for cash on hand (for runway calculation) — this is optional

### 5. Calculate & Present

Compute the following (with all assumptions visible):

a) **Monthly Burn Rate** = infrastructure + team + other costs
   - Break down by category with percentages

b) **Runway** = cash on hand / monthly burn rate
   - Only if cash position was provided
   - Show in months

c) **Payback Period** = total investment to date / monthly net revenue
   - Net revenue = gross revenue - infrastructure costs
   - If pre-revenue, note as "N/A — pre-revenue"

d) **Break-even Point** = month when cumulative revenue exceeds cumulative costs
   - Model three scenarios: conservative (50% of base growth), base, optimistic (150% of base growth)
   - If pre-revenue with no projections, skip

e) **Cost per Customer** = infrastructure costs / customer count
   - Only if customer count is known or estimable

f) **Cost Optimization Opportunities** — identify quick wins:
   - Over-provisioned resources
   - Services with cheaper alternatives
   - Free tier headroom not being used
   - Reserved instance / committed use discounts

Present the full analysis to the user. Use AskUserQuestion:
- "Here's the complete burn rate analysis. Ready to write to `research/burn-rate.md`? Anything to adjust?"

### 6. Downstream Impact Check

After writing, check for downstream research documents that may be affected. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference cost assumptions, unit economics, or margins
2. Identify **specific conflicts**: claims, assumptions, or references that contradict the burn rate analysis. Examples:
   - Gross margin estimates that don't account for actual infrastructure costs
   - Unit economics assumptions that use different cost figures
   - Payback period estimates that diverge from the infrastructure-grounded calculation
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1-2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., burn rate is 2x+ what monetization assumed): Display conflicts and strongly recommend `/reconcile-research`.

### 7. Populate Next Steps

Check which files exist to populate the `## Next Steps` section contextually. Include 3-5 applicable items with "Pick one:" framing:

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

Conditional items:
- IF no `research/monetization.md`: `/monetization` — Build pricing strategy informed by actual infrastructure costs
- IF `research/monetization.md` exists but unit economics differ: `/monetization` — Update unit economics with infrastructure-grounded costs
- IF no `research/gtm.md`: `/gtm` — Build go-to-market plan with cost-aware pricing
- IF no `research/metrics.md`: `/metrics` — Define metrics to track burn rate health (cost per customer, infrastructure efficiency)
- IF no `research/scale-audit.md` and infrastructure is complex: `/scale-audit` — Evaluate infrastructure readiness before scaling costs
- IF codebase exists and optimization opportunities found: `/brainstorm` — Explore cost optimization as a feature priority

### 8. Write Output

Only after the user has validated the findings, write the output file.

## Output

### `research/burn-rate.md` (or `research/{app}/burn-rate.md`)

```markdown
# Burn Rate Analysis

> Based on: codebase infrastructure analysis[, research/monetization.md, research/metrics.md, research/gtm.md]
> Date: [current date]

## Summary
[2-3 sentences: total monthly burn rate, largest cost drivers, and runway/payback headline]

## Infrastructure Cost Breakdown

| Service | Category | Monthly Estimate | Assumption | Confidence |
|---------|----------|-----------------|------------|------------|
| [e.g. AWS EC2] | Compute | $X | [e.g. t3.medium, on-demand] | High/Medium/Low |
| [e.g. Supabase] | Database | $X | [e.g. Pro plan] | High/Medium/Low |
| ... | ... | ... | ... | ... |
| **Infrastructure Total** | | **$X** | | |

## Team & Operational Costs

| Category | Monthly Cost | Notes |
|----------|-------------|-------|
| Team (N people) | $X | [fully-loaded cost per person] |
| Marketing | $X | [if provided] |
| Tools & Subscriptions | $X | [if provided] |
| Other | $X | [if provided] |
| **Operational Total** | | **$X** |

## Total Monthly Burn Rate

| Category | Monthly Cost | % of Total |
|----------|-------------|-----------|
| Infrastructure | $X | X% |
| Team | $X | X% |
| Other Operational | $X | X% |
| **Total** | **$X** | **100%** |

## Revenue Projections

| Metric | Value | Source |
|--------|-------|--------|
| Current MRR | $X | [user-provided / monetization.md] |
| Growth Rate | X%/mo | [assumption] |
| Customer Count | N | [user-provided / metrics.md] |
| Projected MRR (6 mo) | $X | [calculated] |
| Projected MRR (12 mo) | $X | [calculated] |

## Payback Period Analysis

| Scenario | Monthly Growth | Break-even Month | Payback Period |
|----------|---------------|-----------------|----------------|
| Conservative | X%/mo | Month N | N months |
| Base | X%/mo | Month N | N months |
| Optimistic | X%/mo | Month N | N months |

### Assumptions
[List key assumptions behind each scenario]

## Runway

| Metric | Value |
|--------|-------|
| Cash on Hand | $X |
| Monthly Burn | $X |
| Runway | N months |
| Runway at 50% Burn | N months |

[Omit this section if cash position was not provided]

## Cost per Customer

| Metric | Value |
|--------|-------|
| Infrastructure Cost / Customer | $X |
| Total Cost / Customer | $X |
| Revenue / Customer (ARPU) | $X |
| Gross Margin per Customer | X% |

[Omit this section if customer count is unknown]

## Cost Optimization Opportunities

1. **[Opportunity]** — [description, estimated savings]
2. **[Opportunity]** — [description, estimated savings]
3. ...

## Assumptions & Data Gaps
[List all assumptions made, data that would improve accuracy, and recommended next steps for better estimates]

<!-- Only include this section when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 7 — only include items whose conditions are met]
```

### `research/burn-rate-interview.md` (or `research/{app}/burn-rate-interview.md`)
Raw interview log — questions asked, infrastructure detected, user responses, cost validations, and a closing summary of key figures and assumptions.

Create the `research/` (or `research/{app}/`) directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Evidence-based costs.** Every cost estimate must trace to a detected service in the codebase or a user-provided figure. Do not invent costs.
- **Present before writing.** Never write output files until the full analysis has been presented and validated by the user.
- **State assumptions.** Every cost estimate must include the assumption behind it (tier, instance size, usage level) and a confidence level. Never present estimates as facts.
- **Don't prescribe architecture changes.** If infrastructure is over-provisioned or poorly structured, note it as a cost optimization opportunity — architecture decisions belong in `/scale-audit` or `/brainstorm`.
- **Don't duplicate monetization.** If `research/monetization.md` already has unit economics, compare and reconcile rather than contradict. Note any differences and ask the user to resolve.
- **Do not overwrite existing `research/burn-rate.md`** (or `research/{app}/burn-rate.md`) without asking the user first.
- **Minimum research depth**: at least 4 WebSearch queries for pricing data before presenting cost estimates.
- **Use current pricing.** Always search for current pricing — cached or memorized pricing may be outdated.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/burn-rate-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/burn-rate-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/burn-rate-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
