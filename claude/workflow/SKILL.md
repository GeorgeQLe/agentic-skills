---
name: workflow
description: Read-only workflow status — shows completed steps, stale items, missing steps, and recommends the next action
type: analysis
version: 1.1.0
argument-hint:
---

# Workflow — Status & Next Step

Read-only skill that scans project state and recommends what to do next. No interview, no output files — purely diagnostic.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before scanning, detect the app structure:

1. Check if `research/` contains subdirectories (excluding files).
2. If subdirectories exist, this is a monorepo — scan each `research/{app}/` independently and produce per-app status.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

### 1. Scan Project Files

Use Glob and Bash (`stat` / `ls -la`) to check for existence and modification dates of:

- `research/icp.md`
- `research/competitive-analysis.md`
- `research/enterprise-icp.md`
- `research/journey-map.md`
- `research/customer-feedback.md`
- `research/gtm.md`
- `research/metrics.md`
- `research/monetization.md`
- `research/positioning.md`
- `research/assumption-tracker.md`
- `research/runway-model.md`
- `research/cohort-review-*.md` (all dated cohort reviews)
- `research/experiments/*.md` (all experiment plans)
- `research/retro-*.md` (all dated retros)
- `research/investor-update-*.md` (all dated updates)
- `research/risk-register.md`
- `specs/*.md` (all spec files)
- `specs/mvp-gap.md`
- `specs/scale-audit.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ideas.md`
- `tasks/manual-todo.md`

When monorepo detected, also scan per-app:
- `research/{app}/icp.md`, `research/{app}/competitive-analysis.md`, etc. for each app subdirectory
- `specs/{app}/*.md` for each app subdirectory

Record each file's existence and last-modified timestamp.

### 2. Detect Project Phase

Based on which files exist, classify the project:

| Phase | Condition |
|-------|-----------|
| **Concept** | No `research/icp.md` AND no meaningful codebase (no README, no source files, no package config) |
| **Pre-launch** | No `research/customer-feedback.md` |
| **Building** | Has `tasks/roadmap.md` but no customer feedback |
| **Post-launch** | Has `research/customer-feedback.md` |
| **Enterprise** | Has `research/enterprise-icp.md` |

A project can be in multiple phases (e.g., Post-launch + Enterprise).

### 3. Check Staleness

Compare modification timestamps. Flag items as stale when newer upstream data exists:

| If this is newer... | ...then this is stale | Severity |
|----------------------|-----------------------|----------|
| `research/customer-feedback.md` | `research/icp.md` | **Stale** — customer feedback may invalidate ICP assumptions |
| `research/customer-feedback.md` | `research/journey-map.md` | **Stale** — real user behavior may differ from mapped journeys |
| Any `specs/*.md` | `research/journey-map.md` | **May be stale** — new specs may introduce unmapped journeys |
| `research/icp.md` | `research/competitive-analysis.md` | **May be stale** — ICP changes may shift competitive frame |
| `research/journey-map.md` | `research/metrics.md` | **Stale** — metrics should track current journey stages |
| `research/icp.md` + `research/competitive-analysis.md` + `research/journey-map.md` | `research/gtm.md` | **Stale** — upstream research changed since GTM was written |
| `research/icp.md` + `research/competitive-analysis.md` | `research/monetization.md` | **Stale** — ICP or competitive pricing data changed since monetization was written |
| `research/customer-feedback.md` | `research/monetization.md` | **May be stale** — customer feedback may contain new willingness-to-pay signals |
| `research/cohort-review-*.md` (latest) | `research/metrics.md` | **May be stale** — real performance data may require target adjustments. _Fix:_ `/metrics` |
| `research/cohort-review-*.md` (latest) | `research/gtm.md` | **May be stale** — actual channel performance may invalidate GTM strategy. _Fix:_ `/gtm` |
| `research/experiments/*.md` (any with Results) | `research/assumption-tracker.md` | **Stale** — experiment results should update assumption validation status. _Fix:_ `/assumption-tracker` |
| `research/positioning.md` | `research/gtm.md` | **Stale** — GTM messaging should flow from positioning. _Fix:_ `/gtm` |
| `research/runway-model.md` | `tasks/roadmap.md` | **May be stale** — runway constraints may affect roadmap ambition. _Fix:_ `/roadmap` |
| Recent `src/` commits (`git log`) | `specs/*.md` that describe the changed areas | **May be stale** — code may have evolved past spec. _Fix:_ `/spec-drift` |

Note: The last rule compares git commit timestamps against spec file timestamps. Use `git log --since="<spec last-modified date>" -- <source directories>` to find commits touching source code after the spec was last modified. If relevant source files changed after the spec, flag the spec as potentially stale.

### 4. Identify Missing Steps

Using the dependency graph, identify what's available but not yet done:

```
/competitive-analysis concept (no ICP, no codebase)
  -> /icp (if gap validated)
    -> /competitive-analysis (re-run with ICP, standard mode)
    -> ... (standard graph below)

/icp (foundational)
  -> /competitive-analysis
  -> /mvp-gap (requires icp)
  -> /journey-map (requires icp + specs)
    -> /metrics (requires journey-map)
  -> /icp + /competitive-analysis -> /positioning -> /gtm (positioning is upstream of messaging)
  -> /gtm (requires icp, optionally competitive-analysis + journey-map + positioning)
  -> /monetization (requires icp, optionally competitive-analysis + journey-map + metrics + gtm)
3+ research docs -> /assumption-tracker -> /experiment -> /customer-feedback (results)
/monetization + launch -> /runway-model -> /roadmap (runway constraints)
/metrics + launch data -> /cohort-review -> triggers updates to /gtm, /monetization, /assumption-tracker
Quarterly -> /retro -> triggers re-runs of stale research
/enterprise-icp -> /scale-audit
/plan-interview -> specs/*.md
/spec-drift (requires specs/*.md + codebase)
/roadmap (reads all research + specs)
/customer-feedback -> can make icp, journey-map stale
```

A step is "available" when its prerequisites exist. A step is "missing" when it's available but its output doesn't exist.

**Concept-phase logic:**
- If no `research/icp.md` AND no meaningful codebase AND no `research/competitive-analysis.md`: recommend `/competitive-analysis concept`
- If `research/competitive-analysis.md` exists with a `## Gap Assessment` section whose Verdict is "Proceed to ICP" and no `research/icp.md`: recommend `/icp`

### 5. Recommend Next Action

Pick the single highest-priority action:

1. **Fix stale items first** — if something is stale, recommend re-running it (highest priority: items marked **Stale** over **May be stale**)
2. **Fill missing foundational steps** — no ICP + no codebase → `/competitive-analysis concept`; no ICP + codebase → `/icp`; concept-validated competitive analysis with "Proceed" verdict → `/icp`; no specs → `/plan-interview`
3. **Fill missing downstream steps** — in dependency order
4. **Advance the build** — if everything is fresh, recommend `/run` or `/ship` based on `tasks/todo.md` state

## Output Format

Display directly to the user (no files written):

```
## Project Phase: [phase(s)]

## Completed Steps
| Step | File | Last Modified |
|------|------|---------------|
| ICP Discovery | research/icp.md | 2026-03-15 |
| ...  | ...  | ...           |

## Stale Items
- **research/journey-map.md** — stale because research/customer-feedback.md is newer (feedback: Mar 25, journey-map: Mar 10). _Fix:_ `/journey-map`

## Missing Steps
- **/metrics** — available (journey-map exists), not yet run. _Run:_ `/metrics`
- **/gtm** — available (icp exists), not yet run. _Run:_ `/gtm`

## Recommended Next Action
> `/journey-map` — your journey map is stale because customer feedback was updated after it was written. Re-running will incorporate real user behavior into the mapped journeys.
```

**Monorepo output** — when `research/` contains app subdirectories, show a per-app status table:

```
## Per-App Status

| App | ICP | Competitive | Journey | Metrics | GTM | Monetization | Feedback | Enterprise |
|-----|-----|-------------|---------|---------|-----|--------------|----------|------------|
| web | ✓   | ✓           | ✓       | -       | -   | -            | -        | -          |
| api | ✓   | -           | -       | -       | -   | -            | -        | -          |

## Stale Items (per app)
...

## Recommended Next Action
> `/journey-map api` — the api app has an ICP but no journey map yet.
```

Note: recommendations should specify which app needs attention (e.g., `/journey-map api`).

If everything is complete and fresh:

```
## Pending Manual Tasks
- [X unchecked manual tasks in `tasks/manual-todo.md`]
- [List any that block upcoming automated steps]

## Recommended Next Action
> All research and strategy steps are current. Continue building with `/run` or ship with `/ship`.
```

## Constraints

- **Read-only.** Do not create, modify, or delete any files.
- **No interview.** Do not use AskUserQuestion. This is a diagnostic tool.
- **Show evidence.** Every staleness claim must include the actual timestamps.
- **One recommendation.** The "Recommended Next Action" section must contain exactly one action, not a list.
- **Be specific.** Include the exact slash command to run, not vague advice.
