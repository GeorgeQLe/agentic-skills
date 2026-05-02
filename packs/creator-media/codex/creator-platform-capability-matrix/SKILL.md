---
name: creator-platform-capability-matrix
description: Map creator platforms to free/manual evidence sources, available fields, audit depth, operational risk, and recommended next skill
type: research
version: 1.0.0
argument-hint: "[creator or project slug]"
---

# Creator Platform Capability Matrix

Invoke as `$creator-platform-capability-matrix`.

Build the platform evidence foundation for non-YouTube or mixed-platform creator-media work before platform-specific audits.

## Workflow

1. Identify the creator, project, and platforms in scope from the user request and repo context.
2. Prefer free, open-source, owner-provided, and manual evidence paths. Do not require paid APIs, privileged platform programs, logged-in scraping, or access-control bypasses.
3. Write `research/creator-platforms/capability-matrix.md`.
4. Include a row for every platform in the baseline matrix, even when no evidence is currently available.
5. Add extra platform rows only when the repo or user request gives a concrete reason.

## Baseline Platforms

Include these rows:

- LinkedIn personal profile
- LinkedIn company page
- Personal website/blog
- Newsletter
- Podcast
- GitHub
- X/Threads/Instagram/TikTok
- Bluesky/Mastodon

## Collection Methods

Classify every evidence source with one or more of these collection methods:

- `export`: owner-provided platform export, CSV, ZIP, or analytics download.
- `manual_snapshot`: user-saved page, screenshot, CSV, Markdown note, copied post text, or manually captured URL list.
- `rss_feed`: RSS, Atom, JSON feed, podcast feed, sitemap, or newsletter feed.
- `public_page_capture`: public unauthenticated page capture with polite retrieval.
- `open_source_tool`: OSS tooling such as feed parsers, Playwright screenshots, `trafilatura`, or allowed public-media tools.
- `free_api`: official free API or public protocol with no paid dependency.

## Matrix Columns

The matrix must include these columns:

- Platform
- Content types
- Evidence sources
- Collection methods
- Likely fields
- Missing fields
- Metric availability
- Body availability
- Media availability
- Transcript availability
- Peer benchmarking practicality
- Operational risk
- Audit depth
- Recommended next skill

## Platform Guidance

- LinkedIn personal profile: start with owner export plus manual/public snapshots. Treat analytics as unavailable unless owner-provided.
- LinkedIn company page: start with manual/admin export. Treat free API use as a later authorized lane only when already available.
- Personal website/blog: prefer RSS, sitemap, and public page capture for body text and metadata.
- Newsletter: prefer export, RSS, and public archives. Treat subscribers and private analytics as owner-only.
- Podcast: prefer RSS, public show pages, and manual transcripts. Do not invent transcripts.
- GitHub: use public API, public repo evidence, and manual repo notes for projects and proof assets.
- X/Threads/Instagram/TikTok: prefer manual snapshots and exports. Treat metrics as owner-only unless public counters are visible.
- Bluesky/Mastodon: use public protocol/API where available and respect instance or service limits.

## Operational Risk

Classify each row as:

- `low`: export, user-supplied files, RSS/feed, public protocol/API, or public repo evidence.
- `medium`: public page capture or OSS tooling where platform limits, robots rules, or stale snapshots need care.
- `high`: access-controlled, bot-protected, logged-in, paywalled, private, or ToS-sensitive surfaces.

High-risk rows must recommend manual snapshots, owner exports, or stopping for user-provided evidence instead of automated capture.

## Output Requirements

`research/creator-platforms/capability-matrix.md` must contain:

- Scope and capture date.
- Source assumptions and exclusions.
- The full capability matrix.
- Evidence gaps by platform.
- Recommended collection order.
- Recommended next skill.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$creator-evidence-schema`.

If `research/creator-platforms/evidence-schema.md` already exists and is current, recommend the best platform-specific audit or strategy skill based on available evidence. Use YouTube-specific skills only for YouTube-first work; otherwise prefer `$creator-positioning` until a platform-specific non-YouTube skill exists.

## Constraints

- Do not mutate external accounts or collect private data.
- Do not bypass bot protections, rate limits, paywalls, login walls, or access controls.
- Do not imply YouTube-equivalent metrics, transcripts, thumbnails, or benchmarking are available for every platform.
- Record missing metrics, missing bodies, and missing transcripts as evidence gaps.
- Cite repo paths and source URLs when available.
