---
name: lifecycle-metrics
description: Define stage metrics, instrumentation needs, and evidence gaps across onboarding, conversion, transaction, retention, and expansion
type: analysis
version: v0.6
release_lane: canary
required_conventions: [alignment-page, briefing-slides]
argument-hint: "[optional: app or lifecycle stage]"
context_intake: deep
visual_tier: visual
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill.

# Lifecycle Metrics



Define measurable signals for each lifecycle stage. This complements `/metrics`: use this skill for stage instrumentation and handoff clarity, then use `/metrics` for the broader success framework, targets, and business metrics.

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
2. Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. Scope lifecycle metrics to the active product path by default.
3. Require `research/journey-map.md`; load any focused lifecycle maps that exist.
4. Load ICP, customer feedback, existing metrics, specs, README, and current analytics/instrumentation code when present.
5. Interview and recommend around: stage entry/exit events, activation, conversion, payment success/failure, retention health, churn risk, expansion readiness, evidence quality, measurement owner, and instrumentation gaps.
6. Present the lifecycle measurement model before writing.
7. Write `research/lifecycle-metrics.md` and `research/lifecycle-metrics-interview.md` in flat mode, or `research/{slug}/lifecycle-metrics.md` and `research/{slug}/lifecycle-metrics-interview.md` when product-path scope is active, after validation.

## Output Shape

```markdown
# Lifecycle Metrics

> Based on: research/journey-map.md[, lifecycle stage maps]
> Date: YYYY-MM-DD

## Summary
## Stage Metrics
## Event And Property Inventory
## Instrumentation Gaps
## Baselines And Targets To Define In Metrics
## Record-Todo Candidates
## Next Steps
```

## Interview Protocol

**Step 1 — Gather context.** Read `.agents/project.json`, README, CLAUDE.md, existing research and specs, git history, and any argument-provided context. Build an internal evidence base before asking questions.

**Step 2 — Assumptions manifest.** Present 3–7 assumptions about the user's situation, goals, and constraints. Tag each with source (`[from prompt]`, `[from repo]`, `[from research]`, `[inferred]`). Ask the user to confirm, correct, or flag before proceeding.

**Step 3 — Focused interview.** Ask 1–3 questions per turn via `AskUserQuestion`. Research and recommend by default — present options with a recommended default. Continue until all areas are covered or the user signals enough.

**Step 4 — Coverage checkpoint.** Present a summary of everything established. Ask the user to confirm completeness before building the alignment page.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/lifecycle-metrics-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/lifecycle-metrics`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/lifecycle-metrics-{topic}.html`.

## Constraints

- Do not duplicate the full `/metrics` framework; link unresolved targets to `/metrics`.
- Put future, non-blocking measurements in `tasks/record-todo.md` when the skill is executed.
- End with `## Next Steps`, preferring `/metrics`, `/roadmap`, `/exec`, or `/cohort-review` as context dictates.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

