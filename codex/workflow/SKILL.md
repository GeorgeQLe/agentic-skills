---
name: workflow
description: Read-only workflow status — shows completed steps, stale items, missing steps, and recommends the next action
version: 1.1.0
---

# Workflow — Status & Next Step

Read-only diagnostic that scans project state and recommends what to do next. No interview, no output files.

## Workflow

0. **App scope resolution (monorepo support)**: Check if `research/` contains subdirectories (excluding files). If subdirectories exist, this is a monorepo — scan each `research/{app}/` independently and produce per-app status. If no subdirectories exist, proceed with flat structure (single-product mode).
1. **Scan project files**: Check existence and modification dates of `research/*.md`, `specs/*.md`, `tasks/*.md` via Glob and `stat`. When monorepo detected, also scan per-app: `research/{app}/icp.md`, `research/{app}/competitive-analysis.md`, etc. and `specs/{app}/*.md` for each app subdirectory.
2. **Detect phase**: Pre-launch (no customer feedback), Building (has roadmap), Post-launch (has customer feedback), Enterprise (has enterprise-icp).
3. **Check staleness** by comparing timestamps:
   - customer-feedback newer than icp → icp stale
   - customer-feedback newer than journey-map → journey-map stale
   - any spec newer than journey-map → journey-map may be stale
   - icp newer than competitive-analysis → competitive-analysis may be stale
   - journey-map newer than metrics → metrics stale
   - icp + competitive-analysis + journey-map newer than gtm → gtm stale
4. **Identify missing steps** using the dependency graph:
   - `/icp` → `/competitive-analysis`, `/mvp-gap`, `/journey-map` → `/metrics`
   - `/icp` → `/gtm`
   - `/enterprise-icp` → `/scale-audit`
   - `/plan-interview` → `specs/*.md`
   - `/roadmap` reads all research + specs
   - `/customer-feedback` → can make icp, journey-map stale
5. **Recommend one next action** — prioritize stale items, then missing foundational steps, then downstream steps, then build advancement.

## Output

Display directly (no files written): project phase, completed steps with dates, stale items with evidence, missing steps, and one recommended next action with the exact slash command.

**Monorepo output** — when `research/` contains app subdirectories, show a per-app status table (App | ICP | Competitive | Journey | Metrics | GTM | Monetization | Feedback | Enterprise), stale items per app, and recommended next action specifying which app needs attention (e.g., `/journey-map api`).

## Constraints

- Read-only — do not create, modify, or delete any files.
- No interview — do not ask questions.
- Show timestamps as evidence for staleness claims.
- Exactly one recommended next action.
