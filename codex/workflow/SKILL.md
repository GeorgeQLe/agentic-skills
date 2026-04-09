---
name: workflow
description: Read-only workflow status — shows completed steps, stale items, missing steps, and recommends the next action
type: analysis
version: 1.2.0
argument-hint:
---

# Workflow — Status & Next Step

Read-only skill that scans project state and recommends what to do next. No interview, no output files — purely diagnostic.

## Process

### 0. Resolve Workflow Roots

Resolve the project's workflow roots before doing any status analysis. Treat top-level `research/`, `specs/`, and `tasks/` as the canonical contract. Only broaden the search when that contract is missing.

#### Tier 1: Fast Canonical Probe

1. Check whether top-level `research/`, `specs/`, and `tasks/` exist.
2. If a canonical root exists, use it directly and do not search for alternates for that category.
3. If `research/` exists, check only its immediate subdirectories (excluding files) to detect monorepo mode.
4. If the needed roots are resolved in this tier, continue straight to scanning.

#### Tier 2: Bounded Alias Probe

Run this tier only for categories whose canonical root is missing.

1. Search shallowly near the repo root for likely alias directories such as `docs/`, `planning/`, `notes/`, or `work/`.
2. Match likely workflow files by exact filename before using broader heuristics:
   - research: `icp.md`, `competitive-analysis.md`, `journey-map.md`, `customer-feedback.md`, `gtm.md`, `metrics.md`, `monetization.md`
   - tasks: `roadmap.md`, `todo.md`, `history.md`, `ideas.md`, `manual-todo.md`
   - specs: `mvp-gap.md`, `scale-audit.md`, other `*.md` spec files
3. Prefer candidates that are close to the repo root and contain multiple expected files, not one-off matches.
4. If a credible alias root is found, mark that category as `fallback` and continue without escalating to a full repo search.

#### Tier 3: Exhaustive Fallback

Run this tier only for categories still unresolved after the bounded alias probe.

1. Perform a full repo file search for the expected workflow filenames.
2. Score candidates by:
   - exact filename match over fuzzy naming
   - root proximity over deeply nested locations
   - directory clusters containing several expected workflow files over isolated files
3. Infer at most one root per category (`research`, `specs`, `tasks`).
4. If no credible root is found for a category, treat it as missing rather than guessing.

Record the resolved root for each category and whether it came from `canonical` or `fallback` discovery.

### 1. Scan Project Files

After roots are resolved, inspect only the files inside those resolved roots. Do not keep searching once a root has been selected.

Use Glob and Bash (`stat` / `ls -la`) to check for existence and modification dates of:

- `[research root]/icp.md`
- `[research root]/competitive-analysis.md`
- `[research root]/enterprise-icp.md`
- `[research root]/journey-map.md`
- `[research root]/customer-feedback.md`
- `[research root]/gtm.md`
- `[research root]/metrics.md`
- `[research root]/monetization.md`
- `[research root]/positioning.md`
- `[research root]/assumption-tracker.md`
- `[research root]/runway-model.md`
- `[research root]/cohort-review-*.md` (all dated cohort reviews)
- `[research root]/experiments/*.md` (all experiment plans)
- `[research root]/retro-*.md` (all dated retros)
- `[research root]/investor-update-*.md` (all dated updates)
- `[research root]/risk-register.md`
- `[specs root]/*.md` (all spec files)
- `[specs root]/mvp-gap.md`
- `[specs root]/scale-audit.md`
- `[tasks root]/roadmap.md`
- `[tasks root]/todo.md`
- `[tasks root]/history.md`
- `[tasks root]/ideas.md`
- `[tasks root]/manual-todo.md`

When monorepo mode is detected inside the resolved research root, also scan per-app:
- `[research root]/{app}/icp.md`, `[research root]/{app}/competitive-analysis.md`, etc. for each app subdirectory
- `[specs root]/{app}/*.md` for each app subdirectory when those directories exist

Record each file's existence and last-modified timestamp.

### 2. Detect Project Phase

Based on which files exist in the resolved roots, classify the project:

| Phase | Condition |
|-------|-----------|
| **Concept** | No `[research root]/icp.md` AND no meaningful codebase (no README, no source files, no package config) |
| **Pre-launch** | No `[research root]/customer-feedback.md` |
| **Building** | Has `[tasks root]/roadmap.md` but no customer feedback |
| **Post-launch** | Has `[research root]/customer-feedback.md` |
| **Enterprise** | Has `[research root]/enterprise-icp.md` |

A project can be in multiple phases (e.g., Post-launch + Enterprise).

### 3. Check Staleness

Compare modification timestamps inside the resolved roots. Flag items as stale when newer upstream data exists:

| If this is newer... | ...then this is stale | Severity |
|----------------------|-----------------------|----------|
| `[research root]/customer-feedback.md` | `[research root]/icp.md` | **Stale** — customer feedback may invalidate ICP assumptions |
| `[research root]/customer-feedback.md` | `[research root]/journey-map.md` | **Stale** — real user behavior may differ from mapped journeys |
| Any `[specs root]/*.md` | `[research root]/journey-map.md` | **May be stale** — new specs may introduce unmapped journeys |
| `[research root]/icp.md` | `[research root]/competitive-analysis.md` | **May be stale** — ICP changes may shift competitive frame |
| `[research root]/journey-map.md` | `[research root]/metrics.md` | **Stale** — metrics should track current journey stages |
| `[research root]/icp.md` + `[research root]/competitive-analysis.md` + `[research root]/journey-map.md` | `[research root]/gtm.md` | **Stale** — upstream research changed since GTM was written |
| `[research root]/icp.md` + `[research root]/competitive-analysis.md` | `[research root]/monetization.md` | **Stale** — ICP or competitive pricing data changed since monetization was written |
| `[research root]/customer-feedback.md` | `[research root]/monetization.md` | **May be stale** — customer feedback may contain new willingness-to-pay signals |
| `[research root]/cohort-review-*.md` (latest) | `[research root]/metrics.md` | **May be stale** — real performance data may require target adjustments. _Fix:_ `$metrics` |
| `[research root]/cohort-review-*.md` (latest) | `[research root]/gtm.md` | **May be stale** — actual channel performance may invalidate GTM strategy. _Fix:_ `$gtm` |
| `[research root]/experiments/*.md` (any with Results) | `[research root]/assumption-tracker.md` | **Stale** — experiment results should update assumption validation status. _Fix:_ `$assumption-tracker` |
| `[research root]/positioning.md` | `[research root]/gtm.md` | **Stale** — GTM messaging should flow from positioning. _Fix:_ `$gtm` |
| `[research root]/runway-model.md` | `[tasks root]/roadmap.md` | **May be stale** — runway constraints may affect roadmap ambition. _Fix:_ `$roadmap` |
| Recent `src/` commits (`git log`) | `[specs root]/*.md` that describe the changed areas | **May be stale** — code may have evolved past spec. _Fix:_ `$spec-drift` |

Note: The last rule compares git commit timestamps against spec file timestamps. Use `git log --since="<spec last-modified date>" -- <source directories>` to find commits touching source code after the spec was last modified. If relevant source files changed after the spec, flag the spec as potentially stale.

### 4. Identify Missing Steps

Using the dependency graph, identify what's available but not yet done:

```
$competitive-analysis concept (no ICP, no codebase)
  -> $icp (if gap validated)
    -> $competitive-analysis (re-run with ICP, standard mode)
    -> ... (standard graph below)

$icp (foundational)
  -> $competitive-analysis
  -> $mvp-gap (requires icp)
  -> $journey-map (requires icp + specs)
    -> $metrics (requires journey-map)
  -> $icp + $competitive-analysis -> $positioning -> $gtm (positioning is upstream of messaging)
  -> $gtm (requires icp, optionally competitive-analysis + journey-map + positioning)
  -> $monetization (requires icp, optionally competitive-analysis + journey-map + metrics + gtm)
3+ research docs -> $assumption-tracker -> $experiment -> $customer-feedback (results)
$monetization + launch -> $runway-model -> $roadmap (runway constraints)
$metrics + launch data -> $cohort-review -> triggers updates to $gtm, $monetization, $assumption-tracker
Quarterly -> $retro -> triggers re-runs of stale research
$enterprise-icp -> $scale-audit
$plan-interview -> specs/*.md
$spec-drift (requires specs/*.md + codebase)
$roadmap (reads all research + specs)
$customer-feedback -> can make icp, journey-map stale
```

A step is "available" when its prerequisites exist. A step is "missing" when it's available but its output doesn't exist.

**Concept-phase logic:**
- If no `[research root]/icp.md` AND no meaningful codebase AND no `[research root]/competitive-analysis.md`: recommend `$competitive-analysis concept`
- If `[research root]/competitive-analysis.md` exists with a `## Gap Assessment` section whose Verdict is "Proceed to ICP" and no `[research root]/icp.md`: recommend `$icp`

### 5. Recommend Next Action

Pick the single highest-priority action:

1. **Fix stale items first** — if something is stale, recommend re-running it (highest priority: items marked **Stale** over **May be stale**)
2. **Fill missing foundational steps** — no ICP + no codebase → `$competitive-analysis concept`; no ICP + codebase → `$icp`; concept-validated competitive analysis with "Proceed" verdict → `$icp`; no specs → `$plan-interview`
3. **Fill missing downstream steps** — in dependency order
4. **Advance the build** — if everything is fresh, recommend `$run` by default, and only recommend `$ship` when work is already finished in the tree but not yet packaged

## Output Format

Display directly to the user (no files written). If any resolved root came from fallback discovery, add a short note before the phase line:

```
Fallback discovery mode: using inferred research root `docs/research/` and task root `planning/`.
```

Then render the normal status output:

```
## Project Phase: [phase(s)]

## Completed Steps
| Step | File | Last Modified |
|------|------|---------------|
| ICP Discovery | research/icp.md | 2026-03-15 |
| ...  | ...  | ...           |

## Stale Items
- **research/journey-map.md** — stale because research/customer-feedback.md is newer (feedback: Mar 25, journey-map: Mar 10). _Fix:_ `$journey-map`

## Missing Steps
- **$metrics** — available (journey-map exists), not yet run. _Run:_ `$metrics`
- **$gtm** — available (icp exists), not yet run. _Run:_ `$gtm`

## Recommended Next Action
> `$journey-map` — your journey map is stale because customer feedback was updated after it was written. Re-running will incorporate real user behavior into the mapped journeys.
```

**Monorepo output** — when the resolved research root contains app subdirectories, show a per-app status table:

```
## Per-App Status

| App | ICP | Competitive | Journey | Metrics | GTM | Monetization | Feedback | Enterprise |
|-----|-----|-------------|---------|---------|-----|--------------|----------|------------|
| web | ✓   | ✓           | ✓       | -       | -   | -            | -        | -          |
| api | ✓   | -           | -       | -       | -   | -            | -        | -          |

## Stale Items (per app)
...

## Recommended Next Action
> `$journey-map api` — the api app has an ICP but no journey map yet.
```

Note: recommendations should specify which app needs attention (e.g., `$journey-map api`).

If everything is complete and fresh:

```
## Pending Manual Tasks
- [X unchecked manual tasks in `tasks/manual-todo.md`]
- [List any that block upcoming automated steps]

## Recommended Next Action
> All research and strategy steps are current. Continue building with `$run` by default, or use `$ship` only if work is already finished and needs packaging.
```

## Constraints

- **Read-only.** Do not create, modify, or delete any files.
- **No interview.** Do not use `request_user_input`. This is a diagnostic tool.
- **Show evidence.** Every staleness claim must include the actual timestamps.
- **One recommendation.** The "Recommended Next Action" section must contain exactly one action, not a list.
- **Be specific.** Include the exact `$skill` command to run, not vague advice.
- **Prefer the contract.** Canonical top-level `research/`, `specs/`, and `tasks/` win over any alias or inferred location.
- **Be explicit about fallbacks.** If fallback discovery was used, say so plainly so the user can normalize the repo structure later.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
