---
name: workflow
description: Read-only workflow status — shows completed steps, stale items, missing steps, and recommends the next action
version: 1.0.0
argument-hint:
---

# Workflow — Status & Next Step

Read-only skill that scans project state and recommends what to do next. No interview, no output files — purely diagnostic.

## Process

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
- `specs/*.md` (all spec files)
- `specs/mvp-gap.md`
- `specs/scale-audit.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ideas.md`

Record each file's existence and last-modified timestamp.

### 2. Detect Project Phase

Based on which files exist, classify the project:

| Phase | Condition |
|-------|-----------|
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

### 4. Identify Missing Steps

Using the dependency graph, identify what's available but not yet done:

```
/icp (foundational)
  -> /competitive-analysis
  -> /mvp-gap (requires icp)
  -> /journey-map (requires icp + specs)
    -> /metrics (requires journey-map)
  -> /gtm (requires icp, optionally competitive-analysis + journey-map)
  -> /monetization (requires icp, optionally competitive-analysis + journey-map + metrics + gtm)
/enterprise-icp -> /scale-audit
/plan-interview -> specs/*.md
/roadmap (reads all research + specs)
/customer-feedback -> can make icp, journey-map stale
```

A step is "available" when its prerequisites exist. A step is "missing" when it's available but its output doesn't exist.

### 5. Recommend Next Action

Pick the single highest-priority action:

1. **Fix stale items first** — if something is stale, recommend re-running it (highest priority: items marked **Stale** over **May be stale**)
2. **Fill missing foundational steps** — `/icp` if no ICP, `/plan-interview` if no specs
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

If everything is complete and fresh:

```
## Recommended Next Action
> All research and strategy steps are current. Continue building with `/run` or ship with `/ship`.
```

## Constraints

- **Read-only.** Do not create, modify, or delete any files.
- **No interview.** Do not use AskUserQuestion. This is a diagnostic tool.
- **Show evidence.** Every staleness claim must include the actual timestamps.
- **One recommendation.** The "Recommended Next Action" section must contain exactly one action, not a list.
- **Be specific.** Include the exact slash command to run, not vague advice.
