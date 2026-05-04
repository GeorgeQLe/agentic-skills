---
name: journey-map
description: Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) through the product
type: analysis
version: 1.2.0
argument-hint: "[optional: specific use case or journey stage to focus on]"
---

# Journey Map — User & Customer Journey Mapping

Invoke as `$journey-map`.

Research-first journey mapping for how people will flow through the product (user journey) and through the business relationship (customer journey). Requires `research/icp.md`; specs are useful supporting context when they exist, but this skill should normally run before `$spec-interview` so the spec is grounded in discovery, evaluation, onboarding, aha, conversion, retention, and advocacy.

## Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist — run `$icp` first.
- Specs in `specs/*.md` (or `specs/{app}/*.md`) are optional supporting context. If no specs exist, map the intended journey from ICP, competitive research, and codebase/product evidence, then route top journey gaps to `$spec-interview`.

## Workflow

0. **App Scope Resolution (Monorepo Support)**: Before checking prerequisites, determine the app scope: (1) If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it. (2) If `research/` contains subdirectories (excluding files), list them and ask the user which app to target; if the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`, otherwise ask in plain text; if only one subdirectory exists, use it automatically. (3) If no subdirectories exist, proceed with flat structure (single-product mode). When app scope `{app}` is active: read/write research from `research/{app}/` instead of `research/`, read/write specs from `specs/{app}/` instead of `specs/`, also read `research/icp.md` (cross-app overview) for broader context.
1. **Load context**: Read `research/icp.md` (or `research/{app}/icp.md`), `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`), `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`), all spec files in `specs/` (or `specs/{app}/`) if they exist, codebase if it exists.
2. **Interview — User Journeys** (1–3 questions per turn, research and recommend by default — assume the user has no insider knowledge unless they explicitly provide it; present findings with data, define relevant terms, state a recommendation, and ask for hard constraints, proprietary facts, or corrections; only ask without a recommendation when evidence cannot resolve the choice):
   - **Identify use cases** per user profile — 3–5 core tasks, entry point, highest-value use case, frequency patterns
   - **Map task flows** per use case — entry point, steps, decision points, happy path, failure modes, output
   - **Cross-reference current state** — which ICP current-state steps does each flow replace? Where is the delta greatest/smallest?
3. **Interview — Customer Journey** (1–3 questions per turn):
   - **Trigger → Discovery** — trigger events, discovery channels, first impression, the hook
   - **Evaluation → Trial** — what evaluation looks like, what they need to see, deal-killers
   - **Onboarding → Aha Moment** — first 5 min/hour/day, the specific aha moment, steps to aha, drop-off points
   - **Conversion** — what triggers payment, who decides, objections, timeline
   - **Retention & Expansion** — core habit loop, churn triggers, expansion paths, leading indicators
   - **Advocacy** — what drives recommendations, sharing channels, viral loops
4. **Present findings before writing.** Summarise user journey overview, customer journey overview, critical moments (citing ICP data, competitive analysis, or spec evidence for each), and journey gaps (citing the evidence that reveals each gap). Ask: "Which stages, use cases, or assumptions need correction, stronger evidence, or product-specific context?" Continue until validated.
5. Only after user confirms, write the output files.

## Deliverables

- `research/journey-map.md` (or `research/{app}/journey-map.md`) — User journeys (use case overview + task flows per profile), customer journey (full funnel), critical moments, journey gaps with `$spec-interview` prompts
- `research/journey-map-interview.md` (or `research/{app}/journey-map-interview.md`) — Raw interview log

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist. Recommended order: `$spec-interview [top journey opportunity or gap]` when specs are missing or journey gaps need product decisions; `$hook-model` for consumer/PLG products to design habit loops grounded in the journey (skip for B2B/enterprise); `$metrics` to define success metrics tied to journey stages; `$ux-variation` when specs exist and experience alternatives need exploration; `$gtm` when no GTM plan exists; `$roadmap` only when specs plus UX/UI planning artifacts are complete enough for implementation sequencing.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Requires ICP; specs are optional supporting context.
- Stay concrete — specific actions, screens, decisions, not abstract concepts.
- Ground in ICP — every journey step should connect to a real user need.
- Cross-reference specs when present; otherwise convert journey gaps and opportunities into `$spec-interview` prompts.
- Do not prescribe UI or architecture.
- Present before writing — never write until validated.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.

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
