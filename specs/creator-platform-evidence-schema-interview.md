# Creator Platform Evidence Schema Interview

## Assumptions Manifest

### Source Context

- `[from spec]` The user wants more creator-media skills beyond YouTube.
- `[from codebase]` Current YouTube skills are evidence-first and write artifacts under `research/youtube/`, with raw metadata/transcripts stored before synthesis.
- `[from codebase]` Existing reusable creator strategy skills include `creator-positioning`, `content-programming`, `series-spec`, `product-led-media-map`, and `creator-metrics-review`.
- `[inferred]` The new work should expand the pack, not replace the YouTube workflow.

### Implementation Goal

- `[inferred]` Create a spec for multi-platform creator-media audit skills.
- `[inferred]` Prioritize skills that can run from durable evidence: official APIs, owner exports, RSS feeds, or explicitly user-provided analytics exports.

### Technical Foundation

- `[from codebase]` Skills are Markdown contracts mirrored under `packs/creator-media/{codex,claude}/.../SKILL.md`.
- `[from codebase]` Existing audit style favors local files, explicit evidence paths, no fabricated transcript/metric claims, and archive-first replacement for canonical research docs.
- `[inferred]` Avoid adding package dependencies unless a later implementation step proves a CLI/library is needed.

### Integration Risk

- `[from codebase]` Changes would coexist with existing YouTube skills and likely add new platform-specific evidence collectors plus a cross-platform portfolio/metrics layer.
- `[inferred]` Risk: if the pack overpromises YouTube-level metrics for platforms with limited APIs, the skills become unreliable or drift into scraping/ToS gray areas.

### Data Model

- `[inferred]` Store raw platform evidence under `research/<platform>/data/<slug>/` or a shared creator-platforms evidence directory.
- `[inferred]` Use common normalized fields where available: post ID, URL, title/text, publish date, media type, duration/word count, views/impressions where available, likes/reactions, comments/replies, reposts/shares, saves/bookmarks, clicks, transcript/body text, thumbnails/media references.
- `[inferred]` Missing metrics should be first-class evidence gaps, not silently omitted.

### API And Contract Surface

- `[from research]` TikTok, Instagram, Threads, X, LinkedIn, beehiiv, podcast, Bluesky, Mastodon, and newsletter ecosystems have very different free/manual/API access surfaces.
- `[from research]` LinkedIn personal export is viable for owner-provided personal evidence; LinkedIn organization analytics are admin/API-gated.
- `[inferred]` The skill contract should distinguish public-data audits from owner-authorized audits.

### Operational Requirements

- `[inferred]` No credential capture in specs or research artifacts; use env vars or user-provided exports.
- `[inferred]` No scraping-first workflows for platforms with fragile/closed access.
- `[inferred]` Rate limits, missing fields, private metrics, and API eligibility should be explicit report sections.

## Questions Asked

1. Should the first implementation target be skills for specific platforms first, or a platform capability matrix plus shared evidence schema first?
2. Which platforms matter most for the creator pack?
3. Are owner-authorized/manual export workflows acceptable where official APIs are limited?
4. Can agents do web scraping?
5. Should the work use only free/open-source/manual ways to get information?

## User Responses And Decisions

- The user approved the recommended matrix-first approach.
- The first implementation target should be a platform capability matrix plus shared evidence schema.
- LinkedIn is the first named priority platform.
- The user proposed a skill that tracks a content creator's career and presence as a whole in Markdown documentation held in a git repo.
- Web scraping is acceptable to consider, but the final direction is free, open-source, and manual information collection.

## Options Presented

### Platform-specific skills first

Pros: faster visible pack expansion for LinkedIn or another platform.

Cons: risks duplicating incompatible schemas and locking in platform-specific assumptions too early.

### Matrix and shared schema first

Pros: makes platform capabilities explicit, avoids overpromising, and gives future skills a shared contract.

Cons: delays platform-specific audit implementation.

Recommendation: matrix and schema first. The user accepted this.

### API-first evidence

Pros: repeatable and structured where access exists.

Cons: platform approval, auth, rate limits, paid tiers, and missing personal-account access can block usage.

### Free/manual/OSS evidence

Pros: works without paid dependencies, fits repo-based documentation, and keeps the pack usable immediately.

Cons: lower automation and weaker metrics coverage.

Recommendation: free/manual/OSS baseline, with APIs only as optional future lanes. The user accepted this.

## Research Notes

- LinkedIn account export supports owner-provided personal data downloads, making it a viable baseline for personal creator/career evidence.
- LinkedIn organization share statistics are available through official admin/API lanes, but this should be a later authorized workflow rather than a baseline.
- `trafilatura` is an open-source Python/CLI tool for extracting readable text and metadata from web pages and saved HTML.
- Playwright can capture full-page screenshots and HTML for public pages where visual evidence matters.
- Open-source tooling should be optional and never used to bypass access controls.

## Coverage Checkpoint

- Implementation goal covered: matrix/schema first, LinkedIn as first use case, creator presence dossier as strategic artifact.
- Architecture covered: new skills feeding existing creator-media strategy skills.
- Data model covered: shared evidence schema with capture methods, auth context, metrics object, and confidence fields.
- API/contracts covered: output paths, evidence directories, collection methods, and skill names.
- Edge cases covered: sensitive exports, blocked pages, missing metrics, missing body text, stale snapshots, identity aliases.
- Security/privacy covered: no private scraping, no credential capture, redact sensitive exports.
- Test strategy covered: metadata scans, targeted grep, schema fixture validation, diff checks.

## Significant Deviations From Initial Draft

- The initial draft considered multiple platform-specific audit skills. The final spec prioritizes a capability matrix and schema foundation before platform skills.
- API integrations were demoted from a possible baseline to optional future lanes.
- LinkedIn is treated as an owner-export/manual evidence lane first because personal LinkedIn scraping and API access are constrained.
- A new repo-based `creator-presence-dossier` artifact was added to track the creator's career and public/professional presence over time.
