# YouTube Owner Analytics Platform Architecture Brief

Date: 2026-07-01
Status: investigation only; no OAuth credentials, scripts, schedulers, or skill contracts were created or changed.

## Executive Summary

Build a small local-first CLI wrapper, but do it in two layers:

1. **MVP: YouTube Analytics API targeted pulls + YouTube Data API enrichment.** This satisfies current `youtube-video-audit --owner-analytics <path>` usage for views, watch time, average view duration, average view percentage, traffic source, device, geography, subscribers gained/lost, and audience-retention curves where the Analytics API exposes them.
2. **Optional scheduled add-on: YouTube Reporting API jobs.** Add this only after the MVP works, primarily for daily bulk history and thumbnail reach metrics (`video_thumbnail_impressions`, `video_thumbnail_impressions_ctr`) that are documented in Reporting API channel reach reports but not exposed in the currently documented YouTube Analytics API channel reports.

The wrapper should not try to mirror YouTube Studio wholesale. It should produce auditable local files with raw API evidence, normalized summaries, field provenance, and explicit `gaps[]` entries. Existing agents can then consume the per-video normalized JSON via `--owner-analytics <path>` without needing screenshots or immediate skill rewrites.

## Current Repo And Skill Data Needs

### Verified Current Contracts

The active canonical YouTube pack is `packs/youtube-ops/{codex,claude}`; there is no active installed `.codex/skills/youtube*` copy in this checkout. The relevant contracts are:

- `packs/youtube-ops/codex/youtube-video-audit/SKILL.md`
  - Accepts `--owner-analytics <path>` as a user-provided CSV/JSON export or OAuth/API output.
  - Persists owner files under `research/youtube/data/<video-id>/owner-analytics/`.
  - Parses only available fields: views, watch time, average view duration, average view percentage, impressions, CTR, traffic source, playback location, device type, geography, audience retention, relative retention, intro retention, end-screen metrics, likes/dislikes, comments, shares, subscribers gained/lost, and daily/hourly time series.
  - Explicitly treats missing transcript, comments, likes, retention, CTR, impressions, traffic sources, or daily history as evidence gaps rather than failures.
- `packs/youtube-ops/codex/youtube-audit/SKILL.md`
  - Writes public channel evidence to `research/youtube/data/<slug>/videos-YYYY-MM-DD.jsonl`.
  - Parses public metadata fields such as `id`, URL, title, description, channel identity, upload date, duration, public views, likes, comments, tags, categories, chapters, and thumbnails.
  - Derives views/day, views/minute, like rate, transcript coverage, archetype, and content role.
- `packs/creator-foundation/codex/creator-metrics-review/SKILL.md`
  - Reads raw YouTube evidence under `research/youtube/data/<slug>/`.
  - Produces KPI tables with videos published, views, median views, views/day, views/minute, likes, comments, top-video concentration, and transcript coverage.
  - Requires metric gaps to be stated explicitly and forbids external account actions.

### Implication

The wrapper should output both:

- **Per-video owner analytics files** shaped so `youtube-video-audit` can consume them directly with `--owner-analytics research/youtube/data/<video-id>/owner-analytics/summary-YYYY-MM-DD.json`.
- **Channel/date-range rollups** under `research/youtube/data/<channel-slug>/owner-analytics/` for future `creator-metrics-review` and channel-level strategy work.

The normalized JSON should include top-level friendly field names, not only a deeply nested schema, because the current audit skill promises flexible CSV/JSON parsing rather than a formal contract.

## API Capability Matrix

| Need | Best API | Fit | Notes |
| --- | --- | --- | --- |
| Public video metadata | YouTube Data API v3 `videos.list` | Strong | `videos.list` returns requested parts such as `snippet`, `contentDetails`, `statistics`, `status`, `topicDetails`, and `liveStreamingDetails`; cost is 1 quota unit per call. |
| Public comments | YouTube Data API v3 `commentThreads.list` | Strong, when comments are enabled | Returns comment threads by `videoId` or channel; max page size is 100; cost is 1 quota unit per call; disabled/private comments must become gaps. |
| Owner core metrics | YouTube Analytics API `reports.query` | Strong | Supports authorized channel reports with `ids=channel==MINE` or owned channel ID, start/end dates, metrics, dimensions, filters, and sorting. |
| Views, watch time, average view duration, average view percentage | YouTube Analytics API | Strong | Official metric definitions include `views`, `estimatedMinutesWatched`, `averageViewDuration`, and `averageViewPercentage`. |
| Subscribers gained/lost | YouTube Analytics API | Strong | `subscribersGained` and `subscribersLost` are core metrics; video-filtered reports only include subscriptions/unsubscriptions from the specified video's watch page. |
| Traffic source | YouTube Analytics API; Reporting API for bulk | Strong, with privacy thresholds | Analytics API supports traffic source reports; specific traffic details can be omitted when thresholds are not met. |
| Device and OS | YouTube Analytics API; Reporting API for bulk | Strong | Both targeted and bulk reports support device/OS breakdowns for views and watch time. |
| Geography | YouTube Analytics API; Reporting API for bulk | Strong, with privacy thresholds | Country/province dimensions may be limited or anonymized when thresholds are not met. |
| Audience retention | YouTube Analytics API | Strong for targeted video pulls | Audience retention reports use `elapsedVideoTimeRatio` with `audienceWatchRatio` and `relativeRetentionPerformance`. |
| Thumbnail impressions and CTR | YouTube Reporting API channel reach reports; manual Studio export fallback | Partial | Reporting API documents channel reach reports with `video_thumbnail_impressions` and `video_thumbnail_impressions_ctr`. The currently documented Analytics API metric list does not show general thumbnail impression/CTR metrics. |
| End screens/cards | Analytics API and Reporting API | Partial | Cards/end screens have API metrics, but they are not substitutes for all Studio UI detail. |
| Revenue/ad metrics | Analytics or Reporting API monetary scopes | Out of MVP | Requires `yt-analytics-monetary.readonly`; avoid unless explicitly needed. |
| Bulk daily snapshots | YouTube Reporting API | Strong after setup | Reports are versioned CSV files, updated daily, one 24-hour period per report, available 60 days after generation; historical reports for a new job cover only the prior 30 days and are available for 30 days. |
| Real-time or newest-day accuracy | Neither API is instant | Partial | Analytics API responses include data only through the last day for which all requested metrics are available. Reporting API starts producing reports within 48 hours after job creation. |

## Official API Findings

### OAuth And Scopes

Use OAuth 2.0, not service accounts. YouTube Data API documentation states that service accounts are not supported for YouTube accounts and will fail with `NoLinkedYouTubeAccount`.

Minimum scopes for the local wrapper:

- `https://www.googleapis.com/auth/yt-analytics.readonly` for owner Analytics/Reporting user activity reports.
- `https://www.googleapis.com/auth/youtube.readonly` because the current `reports.query` reference says requests now require that scope, and it also covers read-only YouTube account access.
- Add Data API access through the same `youtube.readonly` scope when pulling owner/private metadata, or use an API key only for public metadata/comments when already available.

Avoid these scopes in MVP:

- `https://www.googleapis.com/auth/youtube` because it is account-management breadth, not needed for read-only analytics.
- `https://www.googleapis.com/auth/yt-analytics-monetary.readonly` unless revenue/ad metrics become an explicit requirement.
- Upload/write scopes.

Google OAuth refresh tokens can stop working when users revoke access, tokens are unused for six months, account/token limits are exceeded, time-based access expires, admin policies apply, or the OAuth consent screen is external/testing. External/testing projects issue refresh tokens that expire in seven days unless only basic profile/email scopes are requested.

Public apps using sensitive or restricted Google user-data scopes may need Google verification before production release, but Google documents development/testing/staging projects as an exception to submission. For a single owner using a local-only tool, keep the OAuth app in testing and expect periodic reauth, or publish/verify only if the tool is shared beyond the owner.

### Quotas And Cost

- YouTube Data API v3: every request costs at least one quota point. Default quota is 10,000 units/day for most endpoints, with separate default buckets for `search.list` and `videos.insert`; `videos.list` and `commentThreads.list` cost 1 unit each.
- YouTube Analytics API: each API request counts as one unit of Analytics API quota; limits are visible in the Google API Console.
- YouTube Reporting API docs reviewed here do not publish a simple per-method cost table; treat it as Cloud-console-governed quota and build retry/backoff around 403 quota failures.

For a single channel, quota risk is low if the CLI batches video filters where possible and avoids repeated Data API searches. The higher risk is a poorly designed historical backfill that issues one query per video per metric family instead of using multi-value video filters or Analytics groups where the selected report supports them.

### Data Delay, Retention, And Privacy Limits

- Analytics API `endDate` is not a promise that all requested days are present. The response includes data only through the last date for which all requested metrics are available.
- Some Analytics data is limited when metrics do not meet thresholds. Country, traffic source details, search terms, external URLs, demographics, and similar dimensions can be omitted, collapsed, or differ from totals.
- Reporting API CSV reports cover one 24-hour Pacific-time period, update daily, and are available for 60 days after generation. Historical reports created for a new job cover only the prior 30 days and are available for 30 days.
- Reporting API backfill can replace previously delivered data, so the wrapper must treat later `createTime` reports for the same period as authoritative and re-normalize.
- Deleted videos can create mismatches: aggregate reports may include deleted-item metrics while per-video reports omit deleted resources.

## Recommended Local-First Architecture

### Components

```text
yt-owner CLI
  auth module
    browser OAuth flow for one channel owner
    token refresh and revoke handling
  collectors
    data-api collector: videos.list, commentThreads.list
    analytics collector: reports.query targeted pulls
    reporting collector: optional jobs/reports/download CSV
  normalizer
    maps API names to current skill-friendly field aliases
    writes provenance and gaps
  local store
    secrets outside repo or in gitignored local paths
    raw API responses separated from normalized summaries
    agent-readable summaries under research/youtube/data/
```

### Preferred Flow

1. Owner runs `yt-owner auth login --channel <slug>` manually. Browser opens for OAuth consent; no agent sees the authorization code or token.
2. CLI stores refresh/access token material outside the repo by default, with file permissions `0600` and optional macOS Keychain support.
3. Owner or scheduler runs a pull command.
4. Collector writes raw API evidence separately from normalized agent summaries.
5. Normalizer writes per-video JSON that can be passed directly to `youtube-video-audit --owner-analytics <path>`.
6. Agents read only normalized paths and raw evidence paths, never token/client-secret paths.

### Why This Shape

- It honors the existing YouTube pack's public-first contract and optional private-evidence lane.
- It avoids logged-in Studio scraping and screenshots.
- It supports manual one-off audit pulls without waiting for Reporting API jobs.
- It can add scheduled Reporting API jobs later for reach/CTR and long-running daily snapshots.

## Proposed CLI Surface

These are proposed command shapes, not implemented commands.

```bash
# One-time owner bootstrap.
yt-owner auth login --channel weeklysota --scopes analytics-readonly,youtube-readonly
yt-owner auth status --channel weeklysota
yt-owner auth revoke --channel weeklysota

# Pull one video for an audit date range and print the owner-analytics path.
yt-owner pull video VIDEO_ID \
  --channel weeklysota \
  --start 2026-06-01 \
  --end 2026-06-30 \
  --include core,traffic,device,geo,retention,reach \
  --emit owner-analytics

# Pull channel-level rollups for metrics review.
yt-owner pull channel weeklysota \
  --start 2026-06-01 \
  --end 2026-06-30 \
  --dimensions day,video \
  --include core,traffic,device,geo

# Refresh recent windows before an audit.
yt-owner refresh latest --channel weeklysota --days 30
yt-owner refresh recent-videos --channel weeklysota --published-after 2026-06-01 --days-since-publish 14

# Optional Reporting API setup and harvest.
yt-owner reporting list-types --channel weeklysota
yt-owner reporting ensure-jobs --channel weeklysota --reports channel_basic_a3,channel_traffic_source_a3,channel_device_os_a3,channel_reach_basic_a1
yt-owner reporting harvest --channel weeklysota --created-after last-success

# Diagnostics for agent-safe use.
yt-owner doctor --channel weeklysota
yt-owner paths --channel weeklysota --video VIDEO_ID
```

Failure behavior should be deterministic:

- Expired/revoked token: return `auth_required`, do not delete old normalized files, and print `yt-owner auth login --channel <slug>`.
- Quota exceeded: return `quota_exceeded`, write a failed-run manifest, and leave previous successful snapshots marked stale but usable.
- Metric unavailable: write `gaps[]` with source, requested field, reason, and fallback.
- Private/deleted/unlisted mismatch: write a gap with the target ID, API status, and whether public metadata still exists.
- Agent requests token path: refuse and print the normalized artifact path instead.

## Proposed File And Data Layout

Keep credentials out of the repo:

```text
~/.config/youtube-owner-analytics/
  clients/<channel-slug>.json
  config.yaml

~/.local/state/youtube-owner-analytics/
  tokens/<channel-slug>.json
  runs/<run-id>.json
```

Use repo artifacts only for evidence and summaries:

```text
research/youtube/data/
  _owner-private/
    <channel-slug>/
      raw/
        analytics/reports-query/<run-id>/*.json
        reporting/<job-id>/<report-id>.csv
        data-api/<run-id>/*.json
      manifests/
        pull-<run-id>.json
  <channel-slug>/
    owner-analytics/
      channel-summary-YYYY-MM-DD.json
      channel-timeseries-YYYY-MM-DD.jsonl
      videos-YYYY-MM-DD.jsonl
      gaps-YYYY-MM-DD.json
  <video-id>/
    owner-analytics/
      summary-YYYY-MM-DD.json
      timeseries-YYYY-MM-DD.jsonl
      retention-YYYY-MM-DD.json
      traffic-sources-YYYY-MM-DD.jsonl
      device-YYYY-MM-DD.jsonl
      geography-YYYY-MM-DD.jsonl
      source-manifest-YYYY-MM-DD.json
```

Recommended implementation guard: before writing `_owner-private/`, the CLI should verify it is gitignored or require `--allow-tracked-private-raw`. The normalized summaries can be committed only if the owner chooses to treat those metrics as project evidence. The default posture should be local/private because owner analytics are not public YouTube data.

## Normalized Evidence Contract

### Per-Video Summary JSON

The file passed to `youtube-video-audit --owner-analytics` should be a JSON object with both direct aliases and structured provenance:

```json
{
  "schema_version": "youtube-owner-analytics.normalized.v0",
  "artifact_type": "video_owner_analytics_summary",
  "generated_at": "2026-07-01T13:00:00Z",
  "channel_slug": "weeklysota",
  "channel_id": "UC...",
  "video_id": "VIDEO_ID",
  "date_range": {
    "start": "2026-06-01",
    "end": "2026-06-30",
    "timezone": "America/Los_Angeles"
  },
  "views": 1234,
  "estimatedMinutesWatched": 4567,
  "watch_time_minutes": 4567,
  "averageViewDuration": 222,
  "averageViewPercentage": 41.2,
  "subscribersGained": 12,
  "subscribersLost": 1,
  "video_thumbnail_impressions": null,
  "video_thumbnail_impressions_ctr": null,
  "trafficSource": [
    {"type": "YT_SEARCH", "views": 400, "estimatedMinutesWatched": 1200}
  ],
  "deviceType": [
    {"deviceType": "MOBILE", "views": 800, "estimatedMinutesWatched": 2500}
  ],
  "geography": [
    {"country": "US", "views": 700, "estimatedMinutesWatched": 2100}
  ],
  "audienceRetention": [
    {"elapsedVideoTimeRatio": 0.0, "audienceWatchRatio": 1.0, "relativeRetentionPerformance": 0.52}
  ],
  "timeSeries": [
    {"date": "2026-06-01", "views": 100, "estimatedMinutesWatched": 300}
  ],
  "provenance": {
    "views": {
      "api": "youtubeAnalytics.reports.query",
      "metric": "views",
      "raw_path": "research/youtube/data/_owner-private/weeklysota/raw/analytics/reports-query/<run-id>/core.json"
    },
    "video_thumbnail_impressions": {
      "api": "youtubeReporting.jobs.reports.download",
      "metric": "video_thumbnail_impressions",
      "raw_path": null
    }
  },
  "gaps": [
    {
      "field": "video_thumbnail_impressions",
      "status": "unavailable",
      "reason": "Reporting API reach job not configured and Analytics API targeted reports reviewed here do not document general thumbnail impression metrics.",
      "fallback": "manual Studio export or enable Reporting API channel_reach_basic_a1 going forward"
    }
  ]
}
```

### Field Mapping

| Audit field | Analytics API | Reporting API | Normalized aliases | Gap behavior |
| --- | --- | --- | --- | --- |
| Views | `views` | `views` | `views` | Gap only if API returns no rows. |
| Watch time | `estimatedMinutesWatched` | `watch_time_minutes` | `estimatedMinutesWatched`, `watch_time_minutes` | Preserve unit in minutes. |
| Average view duration | `averageViewDuration` | `average_view_duration_seconds` | `averageViewDuration`, `average_view_duration_seconds` | Preserve unit in seconds. |
| Average view percentage | `averageViewPercentage` | `average_view_duration_percentage` | `averageViewPercentage`, `average_view_duration_percentage` | Mark limited if incompatible dimensions omit it. |
| Subscribers gained/lost | `subscribersGained`, `subscribersLost` | `subscribers_gained`, `subscribers_lost` | both camelCase and snake_case | For video-filtered data, note it reflects video watch-page activity only. |
| Traffic source | `insightTrafficSourceType`, `insightTrafficSourceDetail` | `traffic_source_type`, `traffic_source_detail` | `trafficSource[]` | Threshold-limited rows become `NULL`/gap entries. |
| Device | `deviceType`, `operatingSystem` | `device_type`, `operating_system` | `deviceType[]`, `operatingSystem[]` | Gap if dimension not requested or row suppressed. |
| Geography | `country`, `province` | `country_code`, `province_code` | `geography[]` | Mark anonymized/suppressed when thresholds apply. |
| Retention | `elapsedVideoTimeRatio`, `audienceWatchRatio`, `relativeRetentionPerformance` | Not in basic Reporting API channel reports reviewed | `audienceRetention[]` | Gap if too new, too small, not exposed, or request fails. |
| Thumbnail impressions/CTR | Not documented in Analytics API channel reports reviewed | `channel_reach_basic_a1`: `video_thumbnail_impressions`, `video_thumbnail_impressions_ctr` | `video_thumbnail_impressions`, `video_thumbnail_impressions_ctr`, `impressions`, `clickThroughRate` | Gap until Reporting API reach job exists or manual export supplied. |

### Evidence Rules

- Every normalized value must cite a source API, metric/dimension names, date range, and raw path.
- Raw API responses stay separate from normalized summaries.
- Normalized summaries must not contain OAuth access tokens, refresh tokens, client secrets, cookies, auth headers, or browser session data.
- Missing or threshold-suppressed values must appear in `gaps[]`, not be silently omitted.
- If totals disagree between aggregate and per-video reports, preserve both values and state the likely cause: deleted videos, thresholding, different dimensions, or data availability.

## Scheduling Strategy

### Manual One-Off Pull Before An Audit

Use Analytics API targeted pulls:

```bash
yt-owner pull video VIDEO_ID --channel weeklysota --start 2026-06-01 --end 2026-06-30 --emit owner-analytics
```

This is the default path for `youtube-video-audit`. It avoids waiting 48 hours for Reporting API job output and can backfill historical ranges if the Analytics API returns data for the requested dates.

### Daily Channel Refresh

Use local scheduling, not GitHub Actions:

- macOS: `launchd` user agent.
- Linux: cron or systemd user timer.
- Cross-platform fallback: manual `yt-owner refresh latest --days 30` before reviews.

Recommended daily job:

```bash
yt-owner refresh latest --channel weeklysota --days 45
```

The refresh window should overlap prior runs because YouTube data can update after first availability. The normalizer should replace same-date normalized rows when a newer raw response/report supersedes an older one.

### Recent Upload Refresh

For newly published videos:

- Pull core metrics daily for the first 14 days.
- Pull retention once available, then refresh at day 7 and day 14.
- Pull traffic/device/geography after enough traffic accrues; otherwise expect threshold gaps.
- If Reporting API reach is enabled, harvest daily reach reports and normalize per-video impressions/CTR.

### Reporting API Schedule

Reporting API is worth enabling only after one of these is true:

- Thumbnail impressions/CTR are consistently needed without Studio exports.
- Channel daily bulk history becomes easier than targeted query orchestration.
- The owner wants a standing local analytics warehouse.

If enabled, create jobs once for:

- `channel_basic_a3`
- `channel_traffic_source_a3`
- `channel_device_os_a3`
- `channel_reach_basic_a1`
- Optional: `channel_reach_combined_a1`

Then harvest new reports daily using `createdAfter`, track `report_id`, `startTime`, `endTime`, and `createTime`, and re-import backfills when a newer report replaces a previous period.

## Security Model

### Secrets

- Store OAuth client files and tokens outside the repo by default.
- If repo-local storage is ever supported, require a gitignored path such as `.local/youtube-owner-analytics/` and file mode `0600`.
- Never write access tokens, refresh tokens, client secrets, cookies, auth headers, or OAuth authorization codes into `research/`, `tasks/`, prompts, alignment pages, or logs.
- Agents should only receive normalized output paths and raw evidence paths, never credential paths.

### User Consent And Verification

- For one owner/channel, keep the OAuth app local/testing and accept periodic reauth if the external testing refresh token expires after seven days.
- If the tool is shared outside the owner account, prepare for Google verification: narrow scopes, accurate consent screen, privacy policy, domain ownership, scope justification, and demo video.
- Use read-only scopes by default. Escalate to monetary or write scopes only with explicit separate approval.

### Revocation And Recovery

- `yt-owner auth status` should test token refresh and a lightweight read query.
- `invalid_grant`, revoked token, seven-day testing expiry, or admin policy errors should stop collection and emit an `auth_required` manifest.
- Old normalized artifacts remain readable but must be marked stale by `yt-owner doctor`.

## Failure Scenarios

| Scenario | Expected behavior |
| --- | --- |
| Expired/revoked token | Stop before collection, write failed-run manifest, return `auth_required`, point to `yt-owner auth login --channel <slug>`. |
| API quota exceeded | Stop current run, preserve previous artifacts, mark refresh incomplete, retry only with bounded backoff. |
| Metric unavailable | Add `gaps[]` entry with requested metric, API, dimensions, date range, and fallback. |
| Threshold-suppressed breakdown | Preserve available aggregate totals; mark dimension breakdown as limited/anonymized. |
| Private/deleted/unlisted mismatch | Record Data API/Analytics status separately. Avoid treating missing public metadata as missing owner analytics. |
| Reporting API job too new | State first report is expected within 48 hours; use Analytics API targeted pull meanwhile. |
| Backfilled report replaces old report | Re-import newer `createTime`, archive superseded normalized manifest, and update provenance. |
| Agent attempts to read secrets | Refuse and print normalized summary/raw evidence artifact paths only. |

## Validation Against Current `youtube-video-audit`

The proposed per-video summary satisfies the existing skill without changes because:

- It is a local JSON file passed via `--owner-analytics <path>`.
- It includes the exact field families named by the skill: views, watch time, average view duration, average view percentage, traffic source, device type, geography, retention, subscribers gained/lost, and daily time series.
- It keeps raw/cited evidence separate and includes path provenance.
- It represents missing impressions/CTR, retention, comments, and private metrics as explicit gaps, which the skill already accepts as non-failures.

Example invocation after a pull:

```bash
$youtube-video-audit https://youtu.be/VIDEO_ID \
  --owner-analytics research/youtube/data/VIDEO_ID/owner-analytics/summary-2026-07-01.json \
  --compare-channel weeklysota
```

## Build / No-Build Recommendation

**Build the local wrapper, but keep the MVP small.**

Recommended MVP:

- OAuth installed-app/browser bootstrap for one owner channel.
- Analytics API `reports.query` pulls for core, time series, traffic, device, geography, subscribers, and retention.
- Data API `videos.list` and optional `commentThreads.list` enrichment for public metadata/comments where useful.
- Normalized per-video and channel outputs under `research/youtube/data/`.
- Raw response retention with field provenance and explicit gaps.
- Manual and local scheduler-friendly commands.
- No hosted service, no database, no GitHub Actions, no Studio scraping, no screenshots, no write scopes.

Defer:

- Reporting API until the owner specifically needs reach/CTR or durable daily bulk snapshots.
- Monetary/revenue scopes.
- Multi-channel/multi-user support.
- Skill rewrites.
- Hosted dashboards or SaaS behavior.

Reasoning: current repo skills already accept owner analytics as flexible CSV/JSON and tolerate missing private metrics. The highest-value gap is repeatable local normalized evidence, not full Studio parity. Reporting API adds setup delay, bulk CSV import logic, report retention/backfill complexity, and job state management; it is justified only for scheduled accumulation and reach metrics.

## Open Questions

- Which owner channel slug should be canonical for paths: `@GeorgeLe`, `WeeklyG`, `WeeklySOTA`, or a normalized internal alias?
- Should normalized owner analytics be committed to this repo, kept local and gitignored, or copied into a separate private evidence repo?
- Are thumbnail impressions/CTR mandatory for near-term audits, or acceptable as `gaps[]` until Reporting API reach jobs accrue data?
- How far back does the owner need historical analytics, and does the Analytics API return that full period for this channel?
- Should token storage use macOS Keychain, plain `0600` JSON, or both?
- Should comments continue to use the current public evidence path, or should authenticated owner comment moderation state ever be included?

## Sources

Official documentation reviewed:

- YouTube Data API OAuth: https://developers.google.com/youtube/v3/guides/authentication
- YouTube Data API quota costs: https://developers.google.com/youtube/v3/determine_quota_cost
- YouTube Data API `videos.list`: https://developers.google.com/youtube/v3/docs/videos/list
- YouTube Data API `commentThreads.list`: https://developers.google.com/youtube/v3/docs/commentThreads/list
- YouTube Analytics API overview: https://developers.google.com/youtube/analytics
- YouTube Analytics API data model: https://developers.google.com/youtube/analytics/data_model
- YouTube Analytics API `reports.query`: https://developers.google.com/youtube/analytics/reference/reports/query
- YouTube Analytics API channel reports: https://developers.google.com/youtube/analytics/channel_reports
- YouTube Analytics API metrics: https://developers.google.com/youtube/analytics/metrics
- YouTube Reporting API bulk reports: https://developers.google.com/youtube/reporting/v1/reports
- YouTube Reporting API channel reports: https://developers.google.com/youtube/reporting/v1/reports/channel_reports
- Google OAuth overview and refresh token behavior: https://developers.google.com/identity/protocols/oauth2
- Google OAuth scopes list: https://developers.google.com/identity/protocols/oauth2/scopes
- Google sensitive scope verification: https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification
