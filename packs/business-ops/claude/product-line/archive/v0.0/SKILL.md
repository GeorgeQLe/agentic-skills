---
name: product-line
description: Manage the portfolio of product paths — review, promote, prune, fork, and check revisit triggers across the product-path manifest
type: operations
version: v0.0
argument-hint: "review | promote <path-id> | prune <path-id> | fork <label> [--from <skill>] | triggers"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Product Line — Product Path Portfolio Management

Manage the portfolio of product paths tracked in `research/.progress.yaml`. This skill provides five modes for working with the product-path manifest: reviewing the portfolio, promoting deferred paths to active, pruning abandoned paths, forking new paths from mid-pipeline discoveries, and checking revisit triggers.

Product paths are research divergences — different ICPs, expansion candidates, pivots, competitive gaps — not git branches. Each path tracks its pipeline stage, evidence maturity, and revisit conditions.

## Prerequisites

`research/.progress.yaml` must exist for all modes except `fork` (which can create it). If missing, tell the user: "No product-path manifest found. Run `/idea-scope-brief` or `/icp` first — they create the manifest when multiple product directions emerge."

## Manifest Schema

The canonical manifest lives at `research/.progress.yaml`:

```yaml
active_paths:           # list of path IDs currently being researched
  - "path-id-1"
max_concurrent: 1       # max simultaneous active paths (default 1)
product_paths:
  - id: "path-id-1"
    label: "Human-readable name"
    source_skill: "icp"
    scope_path: "research/icp-smb.md"
    status: active       # active | deferred | revisit_candidate | promoted | abandoned
    reason: "Why this path exists"
    evidence_refs:
      - "research/icp.md"
    revisit_trigger: "Condition that should re-evaluate this path"
    next_skill: "/competitive-analysis"
    last_touched: "2026-05-27"
    pipeline_stage: "icp"  # last completed skill in the chain
```

### Backward Compatibility

When reading the manifest, handle the legacy singular `active_path` field:
- If `active_path` (string) exists and `active_paths` (list) does not, treat it as `active_paths: [<active_path value>]`.
- When writing, always use the plural `active_paths` form. Remove the singular `active_path` field on write to complete migration.

## Modes

### 1. `review` — Portfolio Dashboard

**Invocation**: `/product-line review`

Scan the manifest and present a dashboard comparing all paths:

| Path | Status | Pipeline Stage | Last Touched | Evidence Maturity | Revisit Trigger |
|------|--------|---------------|--------------|-------------------|-----------------|

**Evidence maturity** is derived from which research files exist under the path's `scope_path` or are listed in `evidence_refs`:
- **Early** — only concept brief or initial ICP
- **Developing** — ICP + competitive analysis or positioning
- **Mature** — journey map + metrics + GTM or monetization
- **Complete** — full pipeline through experiment or PMF assessment

**Pipeline stage** shows the last completed skill. Map common stages to a visual progress indicator:

```
idea-scope-brief → icp → competitive-analysis → positioning → journey-map → metrics → gtm → monetization → experiment
```

Group paths by status. For deferred and revisit_candidate paths, highlight the revisit trigger prominently.

When deferred paths accumulate (3+ deferred with no recent promotion), recommend: "Consider running `/product-line triggers` to check whether any deferred paths should be promoted."

Present using the AskUserQuestion tool with options:
- "Promote a deferred path" → ask which path
- "Prune a path" → ask which path
- "Fork a new path" → proceed to fork mode
- "Check triggers" → proceed to triggers mode
- "Done reviewing"

### 2. `promote <path-id>` — Activate a Deferred Path

**Invocation**: `/product-line promote <path-id>`

1. Validate the path exists and has status `deferred`, `revisit_candidate`, or `abandoned`.
2. Check `max_concurrent` against current `active_paths` count.
   - If at capacity, present the user with options: deactivate an existing active path first, or increase `max_concurrent`.
3. Scan existing research files to determine the path's current pipeline stage:
   - Check for `research/{scope}/concept-brief*.md`, `research/{scope}/icp.md`, `research/{scope}/competitive-analysis.md`, etc.
   - Set `pipeline_stage` to the furthest completed skill found.
4. Update the manifest:
   - Set `status: promoted` then `status: active`
   - Add the path ID to `active_paths`
   - Set `last_touched` to today
   - Set `pipeline_stage` from the scan
5. Present the promotion result and recommend the next skill based on where the path left off in the pipeline.

### 3. `prune <path-id>` — Abandon a Path

**Invocation**: `/product-line prune <path-id>`

1. Validate the path exists and is not already `abandoned`.
2. Ask the user for a rationale using AskUserQuestion:
   - "Why is this path being abandoned?"
   - Options: "Evidence disproved it", "Market shifted", "Resource constraints", "Superseded by another path", or free text
3. Update the manifest:
   - Set `status: abandoned`
   - Remove from `active_paths` if present
   - Append the rationale to `reason`
   - Set `last_touched` to today
4. Present confirmation with the documented rationale.

### 4. `fork <label> [--from <skill>]` — Create a New Path

**Invocation**: `/product-line fork "Enterprise vertical" --from competitive-analysis`

Create a new product path from a mid-pipeline discovery.

1. Generate a path ID from the label (lowercase, hyphenated slug).
2. Ask the user using AskUserQuestion:
   - "What evidence supports this new path?" (free text)
   - "What's the revisit trigger if we defer it?" (free text)
   - "Should this be active or deferred?" (options: Active, Deferred)
3. Determine `scope_path` — suggest `research/{slug}/` for a new research subdirectory.
4. Create the manifest entry:
   - `id`: generated slug
   - `label`: from argument
   - `source_skill`: from `--from` flag or the current skill context
   - `scope_path`: determined above
   - `status`: user's choice (active or deferred)
   - `reason`: user's evidence summary
   - `evidence_refs`: any files the user references
   - `revisit_trigger`: user's trigger (required for deferred)
   - `next_skill`: inferred from `source_skill` position in the pipeline
   - `last_touched`: today
   - `pipeline_stage`: the `--from` skill or `null` if new
5. If status is `active`, check `max_concurrent` capacity (same logic as promote).
6. Create the `research/.progress.yaml` file if it doesn't exist, or append to `product_paths` if it does.
7. Create the `research/{slug}/` directory if the path is active.

### 5. `triggers` — Check Revisit Conditions

**Invocation**: `/product-line triggers`

Scan all paths with `status: deferred` or `status: revisit_candidate` and evaluate their `revisit_trigger` conditions.

For each path:
1. Read the `revisit_trigger` text.
2. Check whether the trigger condition can be evaluated from current project state:
   - **File-based triggers** ("when competitive-analysis is complete") → check if the referenced file exists
   - **Evidence-based triggers** ("when SMB segment shows >10% growth") → check research files for relevant data
   - **Time-based triggers** ("revisit after Q3 2026") → compare against current date
   - **External triggers** ("when competitor launches X") → flag as requiring manual check
3. Classify each trigger: **fired** (condition met), **pending** (not yet), or **manual** (can't evaluate automatically).

Present results as a table:

| Path | Trigger | Status | Recommendation |
|------|---------|--------|---------------|

For fired triggers, recommend `/product-line promote <path-id>`.
For manual triggers, ask the user whether the condition has been met.

## Output

This skill modifies `research/.progress.yaml` only. It does not create research documents — those are created by the skills in the pipeline when the user runs them for a promoted path.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Manifest-only mutations.** This skill reads and writes `research/.progress.yaml`. It does not create, modify, or delete research documents.
- **No automatic pipeline execution.** After promoting a path, recommend the next skill but do not run it.
- **Backward compatible reads.** Always handle both `active_path` (singular legacy) and `active_paths` (plural current) when reading.
- **Forward-only writes.** Always write `active_paths` (plural). Remove `active_path` if present.
- **Prune rationale is required.** Never abandon a path without documented evidence and rationale.
- **Respect max_concurrent.** Do not exceed the configured limit without user approval.
- **Use product-path terminology.** Never use "branch" to mean a product path. Use "product path", "product line", "deferred path", "promoted path", etc.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/product-line-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
