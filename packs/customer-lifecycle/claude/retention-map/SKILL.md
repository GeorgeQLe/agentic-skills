---
name: retention-map
description: Plan repeat-use loops, lifecycle triggers, churn risks, recovery paths, and retention signals
type: analysis
version: v0.5
argument-hint: "[optional: app, persona, or retention stage]"
context_intake: deep
visual_tier: visual
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill.

# Retention Map



Map why customers return, what predicts churn, and how the product recovers at-risk users.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

1. Resolve product-path scope using `research/{slug}/` when applicable.
2. Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. Scope the retention map to the active product path by default.
3. Require `research/journey-map.md`; if missing, recommend `/journey-map`.
4. Load journey, onboarding, conversion, transaction, metrics, customer feedback, specs, and product evidence when present.
5. Interview and recommend around: repeat-use job, natural frequency, core habit/workflow loop, lifecycle messages, saved state, collaboration, renewal moments, churn triggers, downgrade/cancel paths, winback, support recovery, and leading indicators.
6. Present the retention model and risk assumptions before writing.
7. Write `research/retention-map.md` and `research/retention-map-interview.md` in flat mode, or `research/{slug}/retention-map.md` and `research/{slug}/retention-map-interview.md` when product-path scope is active, after validation.

## Output Shape

```markdown
# Retention Map

> Based on: research/journey-map.md
> Date: YYYY-MM-DD

## Summary
## Repeat-Use Loop
## Lifecycle Triggers
## Healthy Usage Signals
## Churn Triggers
## Recovery And Winback
## Product Gaps
## Next Steps
```

## Interview Protocol

**Step 1 — Gather context.** Read `.agents/project.json`, README, CLAUDE.md, existing research and specs, git history, and any argument-provided context. Build an internal evidence base before asking questions.

**Step 2 — Assumptions manifest.** Present 3–7 assumptions about the user's situation, goals, and constraints. Tag each with source (`[from prompt]`, `[from repo]`, `[from research]`, `[inferred]`). Ask the user to confirm, correct, or flag before proceeding.

**Step 3 — Focused interview.** Ask 1–3 questions per turn via `AskUserQuestion`. Research and recommend by default — present options with a recommended default. Continue until all areas are covered or the user signals enough.

**Step 4 — Coverage checkpoint.** Present a summary of everything established. Ask the user to confirm completeness before building the alignment page.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/retention-map-{topic}.html`.

## Constraints

- Do not force habit-loop language onto naturally infrequent or transactional products; document the natural return trigger instead.
- End with `## Next Steps`, preferring `/expansion-map`, `/lifecycle-metrics`, `/hook-model`, `/customer-feedback`, or `/cohort-review` as context dictates.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

