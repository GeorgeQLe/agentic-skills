---
name: risk-register
description: Broad risk assessment — key-person, technical, regulatory, competitive, financial, and execution risks beyond product/market
type: analysis
version: 1.0.0
argument-hint: "[optional: focus area e.g. \"technical\", \"regulatory\", \"financial\"]"
---

# Risk Register — Systematic Risk Assessment

Invoke as `$risk-register`.

Identifies and tracks risks beyond product/market: key-person, technical, regulatory, competitive, financial, and execution risks. Complements `$assumption-tracker` (which focuses on product/market assumptions) with broader organizational and environmental risks.

## Soft Prerequisites

- Read all that exist: `research/icp.md`, `research/competitive-analysis.md`, `research/gtm.md`, `research/monetization.md`, `research/runway-model.md`, `research/assumption-tracker.md`, CLAUDE.md, README
- The more context exists, the more thorough the risk identification.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before loading, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read research from `research/{app}/` instead of `research/`

### 1. Load Context

Read all available research docs and codebase files. Extract signals relevant to risk:
- **Financial**: runway, burn rate, revenue concentration
- **Technical**: tech debt, single points of failure, scaling concerns
- **Market**: competitive threats, market shifts, regulatory changes
- **Team**: key-person dependencies, skill gaps, hiring needs
- **Execution**: timeline risks, scope creep, dependency chains

### 2. Identify Risks

Use WebSearch with **3-5 targeted queries** for domain-specific risks:
1. "[industry/category] startup risks"
2. "[category] regulatory requirements"
3. "[technology stack] scaling risks"
4. "[category] common failure modes"

Systematically identify risks in each category:

#### A. Key-Person Risk
- Single points of failure in the team
- Critical knowledge held by one person
- Founder dependency

#### B. Technical Risk
- Architecture limitations, scaling bottlenecks
- Security vulnerabilities, data privacy
- Dependency on third-party services
- Technical debt accumulation

#### C. Regulatory & Legal Risk
- Compliance requirements (GDPR, SOC2, industry-specific)
- IP risks, patent exposure
- Terms of service dependencies on platforms

#### D. Competitive Risk
- Well-funded competitor entering the space
- Platform risk (building on someone else's platform)
- Open-source alternatives emerging

#### E. Financial Risk
- Revenue concentration (one big customer)
- Runway constraints
- Pricing pressure from competitors
- Cost structure changes (API pricing, infrastructure)

#### F. Execution Risk
- Scope creep, feature bloat
- Hiring challenges
- Timeline slippage
- Integration complexity

### 3. Score Each Risk

| Dimension | Scale |
|-----------|-------|
| **Likelihood** | 1 (unlikely) → 5 (near certain) |
| **Impact** | 1 (minor setback) → 5 (existential threat) |
| **Priority** | Likelihood × Impact (max 25) |

### 4. Define Mitigations

For each high-priority risk (score ≥ 12):
- **Accept**: Acknowledge and monitor
- **Mitigate**: Actions to reduce likelihood or impact
- **Transfer**: Insurance, contracts, or partnerships
- **Avoid**: Change plans to eliminate the risk

### 5. Present & Validate

Present the top risks to the user. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "Here are the highest-priority risks I've identified. Any I'm missing or scoring wrong?"
- "Are there any risks you're already mitigating that I should note?"

Incorporate feedback before proceeding.

### 6. Write Output

Only after confirmation, write the output file.

## Output

### `research/risk-register.md` (or `research/{app}/risk-register.md`)

```markdown
# Risk Register

> Last updated: [current date]
> Sources: [research docs reviewed]
> Total risks: [count] | High priority: [count]

## Summary
[2-3 sentences: the top risks and overall risk posture]

## Top Risks

| # | Risk | Category | Likelihood | Impact | Priority | Mitigation |
|---|------|----------|-----------|--------|----------|------------|
| 1 | [risk] | [category] | [1-5] | [1-5] | [L×I] | [strategy] |
| ... | | | | | | |

## Key-Person Risks
| Risk | Likelihood | Impact | Priority | Mitigation |
|------|-----------|--------|----------|------------|
| [risk] | [1-5] | [1-5] | [L×I] | [action] |

## Technical Risks
[Same table format]

## Regulatory & Legal Risks
[Same table format]

## Competitive Risks
[Same table format]

## Financial Risks
[Same table format]

## Execution Risks
[Same table format]

## Mitigation Plan

### Immediate Actions (This Month)
1. [Action] — mitigates [risk #]
2. ...

### Ongoing Monitoring
| Risk | Trigger Signal | Check Frequency |
|------|---------------|-----------------|
| [risk] | [what to watch for] | [weekly/monthly/quarterly] |

## Next Steps

Pick one:
- `$assumption-tracker` — Cross-reference product/market assumptions with these broader risks
- `$research-roadmap` — Check overall project status
```

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Complement, don't duplicate.** Product/market assumptions belong in `$assumption-tracker`. This skill covers organizational, technical, regulatory, competitive, financial, and execution risks.
- **Be specific.** "Competition" is not a risk. "Well-funded competitor X launching a free tier in Q3" is.
- **Present before writing.** Never write until the user validates the assessment.
- **Score honestly.** Don't inflate risks to seem thorough. Low-probability risks should be scored low.
- **Update, don't duplicate.** If `research/risk-register.md` exists, ask whether to update or overwrite.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
