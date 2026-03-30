---
name: customer-feedback
description: Ingest and synthesize customer feedback — categorize findings against ICP and journey map, maintain a running log
version: 1.1.0
---

# Customer Feedback — Ingest & Synthesize

Append-only skill that ingests customer feedback, categorizes findings against ICP and journey map, and maintains a running synthesis.

## Soft Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) — grounds categorization in ICP segments (not required).
- `research/journey-map.md` (or `research/{app}/journey-map.md` in monorepo mode) — tags findings to journey stages (not required).

## Workflow

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

1. **Load context**: Read `research/icp.md` (or `research/{app}/icp.md`), `research/journey-map.md` (or `research/{app}/journey-map.md`), and existing `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if they exist.
2. **Ingest**: Accept feedback from `$ARGUMENTS` (file path or text) or ask the user. Accept any format: interview notes, support tickets, surveys, reviews.
3. **Categorize** each finding:
   - **Classification**: Confirmed (validates ICP/journey), Wrong (contradicts), or New (not captured)
   - **ICP Tag**: Which ICP section it relates to (when icp.md exists)
   - **Journey Stage**: Which stage it touches (when journey-map.md exists)
   - **Severity**: High / Medium / Low
   - **Evidence**: Specific quote or observation
4. **Present & validate**: Show categorized findings, ask user to confirm before writing.
5. **Check staleness triggers**: If 3+ Wrong/New findings accumulated across all sessions, recommend re-running `/icp` or `/journey-map`.
6. **Write**: Append new `## Feedback Session: [date]` section, regenerate `## Synthesis` at top.

## Deliverables

- `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) — Running log with synthesis section (regenerated each run) and per-session findings (append-only)

The Synthesis section must include a `### Next Steps` subsection (3–5 contextual items, "Pick one:" framing, regenerated each run) based on staleness alerts and finding counts: conditionally suggest `/icp`, `/journey-map`, `/brainstorm`, `/plan-interview [topic]`, `/workflow` based on staleness triggers and New finding counts.

## Constraints

- Append-only — never delete previous sessions in `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`). Only regenerate the Synthesis section.
- Present before writing — validate categorization with user first.
- Staleness triggers are cumulative across all sessions.
- `### Next Steps` must appear in the Synthesis section (after Staleness Alerts, before session dividers), with 3–5 contextual items and "Pick one:" framing.
