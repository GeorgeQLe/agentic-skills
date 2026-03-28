---
name: customer-feedback
description: Ingest and synthesize customer feedback — categorize findings against ICP and journey map, maintain a running log
version: 1.0.0
---

# Customer Feedback — Ingest & Synthesize

Append-only skill that ingests customer feedback, categorizes findings against ICP and journey map, and maintains a running synthesis.

## Soft Prerequisites

- `research/icp.md` — grounds categorization in ICP segments (not required).
- `research/journey-map.md` — tags findings to journey stages (not required).

## Workflow

1. **Load context**: Read `research/icp.md`, `research/journey-map.md`, and existing `research/customer-feedback.md` if they exist.
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

- `research/customer-feedback.md` — Running log with synthesis section (regenerated each run) and per-session findings (append-only)

## Constraints

- Append-only — never delete previous sessions. Only regenerate the Synthesis section.
- Present before writing — validate categorization with user first.
- Staleness triggers are cumulative across all sessions.
