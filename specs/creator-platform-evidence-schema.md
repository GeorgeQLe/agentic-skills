# Creator Platform Evidence Schema

## Overview

The creator-media pack currently has strong YouTube evidence workflows and platform-neutral strategy skills. The next expansion should start with a platform capability matrix and shared evidence schema before adding more platform-specific audit skills.

The first practical use case is LinkedIn plus a repo-maintained creator presence dossier: a Markdown record of a creator's public professional footprint, career arc, proof assets, platform roles, and content opportunities. The collection model must use free, open-source, and manual evidence paths by default. Paid APIs, privileged platform programs, and logged-in scraping are out of scope for the baseline.

## Goals

- Define a platform capability matrix that tells future skills what can be collected, how reliable it is, and what audit depth it supports.
- Define a shared creator evidence schema that can normalize posts, videos, newsletters, podcasts, talks, repos, product proof, and career milestones.
- Establish free/manual collection methods: owner exports, RSS/feeds, public page capture, manual snapshots, open-source extraction tools, and user-provided files.
- Make LinkedIn the first supported non-YouTube evidence lane using owner export and public/manual capture.
- Specify a `creator-presence-dossier` artifact that can live in a git repo and evolve over time.
- Preserve the current evidence-first standard: cite raw paths, source URLs, capture time, metric gaps, and confidence limits.

## Non-Goals

- Do not build paid API integrations as the default path.
- Do not require platform developer approval before a creator can use the pack.
- Do not scrape logged-in, paywalled, private, or access-controlled surfaces.
- Do not bypass bot protections, rate limits, or platform access controls.
- Do not promise YouTube-equivalent transcripts, thumbnails, or performance metrics for every platform.
- Do not mutate external accounts, publish content, delete content, or change creator profiles.

## Detailed Design

### Skill Set

Add these skills before adding more platform-specific audits:

| Skill | Purpose | Output |
| --- | --- | --- |
| `creator-platform-capability-matrix` | Map each platform to available free/manual evidence sources, fields, risks, and audit depth. | `research/creator-platforms/capability-matrix.md` |
| `creator-evidence-schema` | Normalize evidence fields and define raw evidence folders for future audits. | `research/creator-platforms/evidence-schema.md` |
| `creator-presence-dossier` | Maintain a repo-based Markdown dossier of the creator's career, public presence, platform roles, proof assets, and strategy implications. | `research/creator-presence/<slug>.md` |

The existing platform-neutral skills should continue to consume these artifacts:

- `creator-positioning`
- `content-programming`
- `series-spec`
- `product-led-media-map`
- `creator-metrics-review`

### Collection Methods

Each evidence item must declare one collection method:

| Method | Description | Baseline status |
| --- | --- | --- |
| `export` | Owner-provided platform export, CSV, ZIP, or analytics download. | Preferred for LinkedIn and private metrics |
| `manual_snapshot` | User saves a page, screenshot, CSV, Markdown note, or copied post text. | Preferred when platform access is restricted |
| `rss_feed` | RSS, Atom, JSON feed, podcast feed, sitemap, or newsletter feed. | Preferred where available |
| `public_page_capture` | Public unauthenticated page capture with polite retrieval. | Allowed for public pages |
| `open_source_tool` | OSS tooling such as `trafilatura`, Playwright screenshots, `yt-dlp`, or feed parsers. | Allowed when ToS/access constraints are respected |
| `free_api` | Official free API or public protocol with no paid dependency. | Allowed, not required |

### Open-Source Tooling

The baseline should not install dependencies automatically. Skills may recommend optional tools and stop if missing:

- `trafilatura` for extracting readable article/page text and metadata from public or locally saved HTML.
- Playwright for public screenshots and HTML capture when a visual record matters.
- Feed parsers for RSS/Atom/JSON feeds.
- `yt-dlp` only for YouTube or other supported public media where the existing project policy permits it.
- `gallery-dl` only for media/archive use cases where the platform and creator rights make that appropriate.

### Platform Capability Matrix

The matrix should classify each platform by:

- Platform and content types.
- Evidence sources: export, manual snapshot, RSS/feed, public page capture, OSS tool, free API.
- Fields likely available.
- Fields likely unavailable.
- Whether metrics are public, owner-only, or unavailable.
- Whether content body is collectible.
- Whether media assets are collectible.
- Whether transcripts are available.
- Whether peer benchmarking is practical.
- Operational risk: low, medium, high.
- Recommended first skill, if any.

Initial platform rows:

| Platform | Baseline lane | Audit depth |
| --- | --- | --- |
| LinkedIn personal profile | Owner export plus manual/public snapshots | Presence, career arc, post history, topic patterns; limited performance metrics |
| LinkedIn company page | Manual/admin export first; free API later only if already authorized | Page content and organization-level analytics when available |
| Personal website/blog | RSS/sitemap/public capture | High-quality body text, metadata, content themes |
| Newsletter | Export/RSS/public archive | Posts, cadence, themes, subscriber metrics only if owner-provided |
| Podcast | RSS/public show pages/manual transcripts | Episodes, guests, titles, cadence, descriptions, transcripts only if available |
| GitHub | Public API/manual repo evidence | Projects, proof assets, contribution narrative |
| X/Threads/Instagram/TikTok | Manual snapshots/exports first | Presence and packaging; metrics only if owner-provided |
| Bluesky/Mastodon | Public protocol/API where available | Public posts, engagement counters, topic patterns |

### Shared Evidence Schema

Raw evidence should live under:

```text
research/creator-platforms/data/<platform>/<slug>/
```

Normalized evidence records should use JSONL when machine-generated and Markdown tables when manually curated.

Core fields:

| Field | Meaning |
| --- | --- |
| `evidence_id` | Stable local ID |
| `platform` | Source platform |
| `source_type` | post, article, video, podcast, talk, repo, profile, comment, newsletter, press, milestone |
| `source_url` | Canonical URL when available |
| `raw_path` | Local raw evidence path |
| `captured_at` | Capture date/time |
| `capture_method` | One of the collection methods above |
| `auth_context` | public, owner_export, admin_export, manual, unknown |
| `terms_risk` | low, medium, high |
| `title` | Title or short label |
| `body_text_path` | Path to extracted text if present |
| `published_at` | Publication date |
| `creator_role` | author, speaker, host, guest, founder, maintainer, commenter, curator |
| `media_type` | text, image, video, audio, code, slide, mixed |
| `topic_tags` | Curated tags |
| `content_role` | acquisition, trust-building, proof, education, launch support, community, career signal |
| `metrics` | Platform-specific metrics object |
| `metric_confidence` | observed, owner-provided, estimated, unavailable |
| `evidence_confidence` | high, medium, low |
| `notes` | Human review notes |

Metrics object fields are optional and must not be invented:

- views
- impressions
- reads
- listens
- likes
- reactions
- comments
- replies
- reposts
- shares
- saves
- clicks
- subscribers
- followers
- engagement_rate

### Creator Presence Dossier

The dossier should synthesize evidence into a durable Markdown artifact:

```text
research/creator-presence/<slug>.md
```

Required sections:

- Identity and current public promise.
- Career timeline.
- Platform map.
- Core themes and expertise claims.
- Proof assets.
- Signature formats and recurring content patterns.
- Audience and community signals.
- Product/company connections.
- Gaps, contradictions, and stale positioning.
- Evidence register.
- Next collection tasks.
- Recommended next skills.

LinkedIn should be a first-class source in the dossier, but not the only source. The dossier should also ingest personal websites, GitHub, podcasts, talks, newsletters, and product docs when present.

### LinkedIn Baseline

LinkedIn personal evidence should start from owner-provided exports and manual snapshots:

- Profile data export.
- Articles, shares/posts, comments, reactions, rich media, recommendations, skills, positions, education, and connections where the user chooses to provide them.
- Public profile page snapshots only when accessible without login or when saved manually by the user.
- Post screenshots or copied post URLs/text supplied by the user.

LinkedIn analytics should be treated as unavailable unless owner-provided. Company/page analytics and official APIs may be documented as a later authorized lane, not a baseline dependency.

## Edge Cases

- A platform export contains private contacts or sensitive messages. The skill must ask the user to redact or exclude those files before analysis.
- A public page blocks automated capture. The skill must stop and request a manual snapshot rather than trying to bypass access controls.
- A source has content but no metrics. The audit should proceed with a metric-gap warning.
- A source has metrics but no content body. The audit should classify performance without claiming content-quality causes.
- A creator has multiple names, handles, companies, or career eras. The dossier should preserve aliases and timeline boundaries.
- A manual snapshot is stale. The evidence register must show capture date and confidence.
- Evidence from different platforms conflicts. The dossier should flag the conflict rather than forcing one narrative.

## Test Plan

- Validate new skill files exist in mirrored Claude/Codex pack directories.
- Run skill metadata scans for version fields and broken skill references.
- Run targeted `rg` checks for collection methods, output paths, and LinkedIn baseline language.
- Create a small fixture set under `/tmp` or documented sample paths representing manual LinkedIn export rows, public page captures, and RSS items; verify the schema can represent all records without platform-specific hacks.
- Check `git diff --check`.

## Acceptance Criteria

- The creator-media pack documents a matrix-first expansion path beyond YouTube.
- The shared evidence schema supports LinkedIn, websites/blogs, newsletters, podcasts, GitHub, and social platforms without requiring paid APIs.
- The LinkedIn baseline uses owner export and manual/public snapshots, not logged-in scraping.
- The creator presence dossier can be maintained entirely in Markdown in a git repo.
- Future platform-specific skills can declare which matrix rows and schema fields they support.
- Missing metrics and missing bodies are explicit evidence gaps.

## Open Questions

- Which LinkedIn export fields should be included by default versus redacted by default?
- Should the first implementation include parser scripts for LinkedIn exports, or only skill contracts and manual templates?
- Should the creator presence dossier be one artifact per creator or one directory per creator with separate evidence registers?
- Should public web capture be implemented with Playwright, `trafilatura`, or both in the first execution phase?

## Assumptions & Risks

- `[from spec]` The work expands the creator-media pack beyond YouTube. Risk: if the goal changes to only LinkedIn, the matrix may be broader than needed.
- `[from codebase]` Existing skills are Markdown contracts mirrored for Claude and Codex. Risk: implementation must preserve mirror parity.
- `[from codebase]` Existing YouTube workflows store raw evidence before synthesis. Risk: skipping raw evidence would weaken audit quality.
- `[confirmed]` The first implementation target is a platform capability matrix plus shared evidence schema. Risk: downstream platform skills should wait until this foundation exists.
- `[confirmed]` LinkedIn is the first priority platform. Risk: LinkedIn's restricted platform access makes owner export/manual capture essential.
- `[confirmed]` Free, open-source, and manual evidence collection should be the default. Risk: some metrics and automation will remain unavailable.
- `[confirmed]` Web scraping may be used only for safe public evidence capture, not as the foundation. Risk: overusing scraping could create brittle or noncompliant workflows.
- `[inferred]` A repo-backed creator presence dossier should include public/professional evidence and optionally repo context when relevant. Risk: private planning context may leak into a public-facing dossier if scopes are not marked clearly.
