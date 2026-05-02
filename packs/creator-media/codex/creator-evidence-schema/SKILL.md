---
name: creator-evidence-schema
description: Define normalized creator evidence records, raw evidence paths, confidence fields, privacy notes, and collection constraints for multi-platform audits
type: research
version: 1.0.0
argument-hint: "[creator or project slug]"
---

# Creator Evidence Schema

Invoke as `$creator-evidence-schema`.

Define the shared evidence contract for non-YouTube or mixed-platform creator-media work before platform-specific audits or strategy synthesis.

## Workflow

1. Identify the creator, project, platforms, and evidence already present in repo context.
2. Read `research/creator-platforms/capability-matrix.md` if it exists. If it is missing, recommend `$creator-platform-capability-matrix` before collection.
3. Write `research/creator-platforms/evidence-schema.md`.
4. Define raw evidence folders under `research/creator-platforms/data/<platform>/<slug>/`.
5. Define normalized records that future audits can store as JSONL when machine-generated or Markdown tables when manually curated.
6. Record missing metrics, missing bodies, private fields, stale captures, and unavailable transcripts as explicit evidence gaps.

## Collection Methods

Every normalized record must declare exactly one `capture_method` from this vocabulary:

- `export`: owner-provided platform export, CSV, ZIP, or analytics download.
- `manual_snapshot`: user-saved page, screenshot, CSV, Markdown note, copied post text, or manually captured URL list.
- `rss_feed`: RSS, Atom, JSON feed, podcast feed, sitemap, or newsletter feed.
- `public_page_capture`: public unauthenticated page capture with polite retrieval.
- `open_source_tool`: OSS tooling such as feed parsers, Playwright screenshots, `trafilatura`, `yt-dlp`, or allowed public-media tools.
- `free_api`: official free API or public protocol with no paid dependency.

## Raw Evidence Layout

Use this root for source artifacts:

```text
research/creator-platforms/data/<platform>/<slug>/
```

Recommended subpaths:

- `raw/` for original exports, saved HTML, screenshots, copied text, feed payloads, and media metadata.
- `text/` for extracted body text, transcripts, descriptions, and manually cleaned readable content.
- `normalized/` for JSONL or Markdown evidence registers.
- `notes/` for collection notes, privacy redactions, and reviewer observations.

Raw files must be cited by local repo path. Do not summarize private or sensitive raw material into public-facing artifacts unless the user explicitly authorizes it.

## Normalized Record Fields

Each evidence record must define these fields or record why the field is unavailable:

- `evidence_id`: stable local ID.
- `platform`: source platform.
- `source_type`: post, article, video, podcast, talk, repo, profile, comment, newsletter, press, milestone, or other documented source type.
- `source_url`: canonical URL when available.
- `raw_path`: local raw evidence path.
- `captured_at`: capture date/time.
- `capture_method`: one collection method from this skill.
- `auth_context`: public, owner_export, admin_export, manual, or unknown.
- `terms_risk`: low, medium, or high.
- `title`: title or short label.
- `body_text_path`: path to extracted text if present.
- `published_at`: publication date when available.
- `creator_role`: author, speaker, host, guest, founder, maintainer, commenter, curator, or other documented role.
- `media_type`: text, image, video, audio, code, slide, mixed, or other documented media type.
- `topic_tags`: curated topic tags.
- `content_role`: acquisition, trust-building, proof, education, launch support, community, career signal, or other documented role.
- `metrics`: platform-specific metrics object.
- `metric_confidence`: observed, owner-provided, estimated, or unavailable.
- `evidence_confidence`: high, medium, or low.
- `privacy_notes`: redactions, sensitive fields excluded, private context boundaries, or sharing restrictions.
- `review_notes`: human review notes, conflicts, stale evidence, and quality caveats.

## Metrics Object

Metrics are optional and must not be invented. Include only metrics that are directly observed, owner-provided, or clearly marked as estimated.

Allowed metric keys include:

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

If metrics are unavailable, set `metric_confidence` to `unavailable` and record the gap. If metrics exist but body text is missing, do not infer content-quality causes from performance alone.

## Confidence Guidance

Use `evidence_confidence` consistently:

- `high`: owner export, public repo/API/protocol record, preserved raw artifact, or source URL plus captured raw copy.
- `medium`: manual snapshot, copied text, public page capture, feed item, or evidence with partial raw support.
- `low`: stale snapshot, missing source URL, incomplete raw evidence, conflicting platform fields, or unverifiable manual note.

Use `terms_risk` consistently:

- `low`: export, user-supplied file, RSS/feed, public protocol/API, or public repo evidence.
- `medium`: public page capture or OSS tooling where platform limits, robots rules, or stale snapshots need care.
- `high`: access-controlled, bot-protected, logged-in, paywalled, private, or ToS-sensitive surfaces.

High-risk evidence must recommend manual snapshots, owner exports, or stopping for user-provided files instead of automated capture.

## Output Requirements

`research/creator-platforms/evidence-schema.md` must contain:

- Scope and capture date.
- Source assumptions and exclusions.
- Raw evidence root and recommended subpaths.
- Collection method vocabulary.
- Normalized record schema.
- Metrics object schema.
- Metric confidence and evidence confidence rules.
- Privacy and redaction notes.
- Evidence gap rules for missing metrics, bodies, media, and transcripts.
- Recommended next skill.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default final-response line when no better route is available: `Recommended next skill: $creator-positioning`.

Routing rules:

- If a `$creator-presence-dossier` skill is present or available in the project, emit `Recommended next skill: $creator-presence-dossier` after schema creation for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.
- If `$creator-presence-dossier` is absent and strong platform-specific evidence is available, emit the best matching available platform-specific audit skill.
- Preserve the existing YouTube workflow: YouTube-only work with channel evidence may route to `$youtube-channel-audit` or the next YouTube audit; non-YouTube or mixed-platform work should use this foundation before platform-specific audits.
- If `$creator-presence-dossier` is absent and no platform-specific audit fits the available evidence, emit `Recommended next skill: $creator-positioning`.

## Constraints

- Do not mutate external accounts or collect private data.
- Do not bypass bot protections, rate limits, paywalls, login walls, or access controls.
- Do not require paid APIs, privileged platform programs, or logged-in scraping.
- Do not invent optional metrics, bodies, media assets, or transcripts.
- Do not treat missing metrics or missing bodies as failures; record them as evidence gaps.
- Ask the user to redact or exclude private contacts, private messages, sensitive account data, and unrelated personal data before analysis.
- Cite raw repo paths and source URLs when available.
