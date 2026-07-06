---
name: onboarding-map
description: Plan signup, setup, activation, first success, onboarding drop-offs, and time-to-value for each lifecycle persona
type: analysis
version: v0.6
required_conventions: [alignment-page, briefing-slides]
argument-hint: "[optional: app, persona, or onboarding segment]"
context_intake: deep
visual_tier: visual
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill.

# Onboarding Map



Create the stage-level onboarding plan that expands `research/journey-map.md`.

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

1. Resolve product-path scope using the same `research/{slug}/` convention as `/journey-map`.
2. Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. Scope the onboarding map to the active product path by default.
3. Require `research/journey-map.md` or `research/{slug}/journey-map.md`; if missing, recommend `/journey-map`.
4. Load ICP, journey map, specs, customer feedback, metrics, and current product routes/components when present.
5. Interview and recommend around: signup entry points, account creation, required setup, imports/integrations, team invites, empty states, first-session guidance, first 5 minutes/hour/day, aha threshold, drop-offs, recovery, and support touchpoints.
6. Present the proposed onboarding model before writing.
7. Write `research/onboarding-map.md` and `research/onboarding-map-interview.md` in flat mode, or `research/{slug}/onboarding-map.md` and `research/{slug}/onboarding-map-interview.md` when product-path scope is active, after validation.

## Output Shape

```markdown
# Onboarding Map

> Based on: research/journey-map.md
> Date: YYYY-MM-DD

## Summary
## Personas And Entry Points
## Signup And Setup Flow
## Activation Path
## First Success
## Drop-Offs And Recovery
## Instrumentation Needs
## Product Gaps
## Next Steps
```

## Interview Protocol

**Step 1 — Gather context.** Read `.agents/project.json`, README, CLAUDE.md, existing research and specs, git history, and any argument-provided context. Build an internal evidence base before asking questions.

**Step 2 — Assumptions manifest.** Present 3–7 assumptions about the user's situation, goals, and constraints. Tag each with source (`[from prompt]`, `[from repo]`, `[from research]`, `[inferred]`). Ask the user to confirm, correct, or flag before proceeding.

**Step 3 — Focused interview.** Ask 1–3 questions per turn via `AskUserQuestion`. Research and recommend by default — present options with a recommended default. Continue until all areas are covered or the user signals enough.

**Step 4 — Coverage checkpoint.** Present a summary of everything established. Ask the user to confirm completeness before building the alignment page.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/onboarding-map-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/onboarding-map`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/onboarding-map-{topic}.html`.

## Constraints

- Stay stage-specific; do not rewrite the whole journey map.
- Make onboarding steps concrete enough to drive specs, UX variations, and instrumentation.
- End with `## Next Steps`, preferring `/conversion-map`, `/lifecycle-metrics`, `/ux-variations` as context dictates.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

