---
skill: investigate
agent: codex
captured_at: 2026-07-01T09:26:03-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Owner Analytics Platform Investigation Plan

## Summary

Investigate a **local-first YouTube owner analytics wrapper** for **your own channel** that can authenticate with OAuth, pull owner-only YouTube Analytics/Reporting data on a schedule, and expose normalized files/commands for agent CLI workflows. The deliverable is a decision-ready architecture brief, not an implementation.

## Key Investigation Work

- Audit current YouTube skill needs: map every owner-analytics field requested by active YouTube audit skills to source types already accepted today, especially `--owner-analytics <path>`, `research/youtube/data/`, and report evidence expectations.
- Research official API fit:
  - YouTube Data API v3 for public metadata and comments.
  - YouTube Analytics API `reports.query` for targeted owner metrics.
  - YouTube Reporting API for bulk scheduled-style reports.
  - OAuth scopes, consent flow, token refresh behavior, quotas, metric availability, data delay, and retention limits.
  - Primary docs: https://developers.google.com/youtube/v3/guides/authentication, https://developers.google.com/youtube/analytics/reference/reports/query, https://developers.google.com/youtube/reporting/v1/reports.
- Define the local-first platform architecture:
  - OAuth bootstrap flow for one channel owner.
  - Local credential/token storage model with gitignored paths and no agent-readable secrets in reports.
  - Scheduled pull mechanism options: cron/launchd/GitHub-free local scheduler/manual CLI.
  - Normalized output layout under `research/youtube/data/` that existing agents can consume without Studio screenshots.
  - CLI command shape for agents, e.g. “pull channel/video analytics for date range” and “refresh latest scheduled snapshot.”
- Specify the evidence contract:
  - Raw API responses retained separately from normalized summaries.
  - Per-video, per-channel, and time-series outputs.
  - Field provenance for every metric used by audits.
  - Gaps explicitly represented when YouTube does not expose a Studio metric through API.
- Evaluate risks and tradeoffs:
  - OAuth verification/compliance burden for local-only versus hosted.
  - Token security and revocation.
  - API quota and backfill cost.
  - Data freshness and missing/changed metrics.
  - Whether YouTube Reporting API is worth using for a single-channel workflow versus Analytics API queries.

## Deliverable

- Write one architecture brief at `research/youtube-owner-analytics-platform.md`.
- Include:
  - Current repo/skill data needs.
  - API capability matrix.
  - Recommended local-first architecture.
  - Proposed CLI command surface.
  - Proposed file/data layout.
  - Scheduling strategy.
  - Security model.
  - Open questions and build/no-build recommendation.
- Do not create OAuth credentials, write scripts, alter skills, set up schedulers, or implement the wrapper during this investigation.

## Test And Validation Scenarios

- Verify that the proposed normalized outputs can satisfy current `youtube-video-audit` owner analytics inputs without changing the audit skill.
- Check example metric mappings for one video: views, watch time, average view duration, impressions/CTR where available, traffic source, device, geography, subscribers gained/lost, and retention-related availability.
- Validate schedule scenarios:
  - Manual one-off pull before an audit.
  - Daily channel refresh.
  - Per-video refresh for recent uploads.
- Validate failure scenarios:
  - Expired/revoked OAuth token.
  - API quota exceeded.
  - Metric unavailable for a video/date range.
  - Private/deleted/unlisted video mismatch.
  - Agent attempts to read secrets instead of output artifacts.

## Assumptions

- Default architecture: local-first CLI, not hosted SaaS.
- First user: one owner channel controlled by you.
- Deliverable: architecture brief only.
- Existing YouTube skills should consume generated files through their current owner-analytics path rather than requiring immediate skill rewrites.
- Secrets must remain local, ignored, and never copied into research artifacts.
