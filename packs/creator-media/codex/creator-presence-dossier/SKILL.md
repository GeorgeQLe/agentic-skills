---
name: creator-presence-dossier
description: Build a repo-backed Markdown dossier of a creator's public professional presence, career arc, proof assets, platform roles, and next strategy route
type: research
version: 1.0.0
argument-hint: "[creator or project slug]"
---

# Creator Presence Dossier

Invoke as `$creator-presence-dossier`.

Build or update a durable Markdown dossier for a creator's public and professional footprint before platform-specific audits or strategy synthesis.

## Workflow

1. Identify the creator, project slug, platforms, and existing evidence paths from the user request and repo context.
2. Read `research/creator-platforms/capability-matrix.md` if it exists. If it is missing, recommend `$creator-platform-capability-matrix` before synthesis.
3. Read `research/creator-platforms/evidence-schema.md` if it exists. If it is missing, recommend `$creator-evidence-schema` before synthesis.
4. Inspect available normalized and raw creator evidence under `research/creator-platforms/data/<platform>/<slug>/` and any user-specified evidence paths.
5. Cite the normalized evidence paths, raw evidence paths, source URLs, and capture dates used before making claims.
6. Write or update `research/creator-presence/<slug>.md`.
7. Separate public/professional evidence from private repo planning context. Exclude private planning context unless the user explicitly asks to preserve it as internal notes.
8. End with a next-skill recommendation based on the dossier findings.

## Evidence Boundaries

The dossier is for public and professional presence: profiles, posts, articles, talks, podcasts, newsletters, repos, product docs, public company pages, and owner-provided exports the user chooses to include.

Do not include private repo planning context, private messages, private contacts, unpublished strategy notes, credentials, sensitive account data, or unrelated personal information in the public dossier. If the user explicitly wants internal planning context captured, place it in a clearly labeled internal notes section and mark the source boundary.

When evidence contains sensitive or mixed public/private material, ask the user to redact or exclude the private material before analysis. Do not infer private facts from public artifacts.

## Source Types

Support these source families when evidence is present:

- LinkedIn personal profiles, company pages, exports, posts, articles, recommendations, and manual/public snapshots.
- Personal websites, blogs, portfolios, public bios, RSS feeds, and sitemaps.
- GitHub profiles, public repos, contribution evidence, READMEs, releases, and product proof.
- Podcasts, interviews, guest appearances, show pages, feeds, and transcripts when available.
- Talks, slide decks, event pages, conference bios, and video descriptions.
- Newsletters, public archives, owner exports, and subscriber or performance notes when owner-provided.
- Product docs, launch notes, case studies, changelogs, public company pages, and customer-facing proof assets.

## Output Requirements

`research/creator-presence/<slug>.md` must contain:

- Scope, capture date, and source assumptions.
- Identity and current public promise.
- Career timeline and platform map.
- Core themes, expertise claims, proof assets, and product/company links.
- Signature formats and recurring content patterns.
- Audience/community signals when evidence supports them.
- Evidence gaps, stale captures, contradictions, and confidence limits.
- Evidence register with source paths or URLs, capture dates, confidence levels, public/private boundary, and gaps.
- Next collection tasks.
- Recommended next skills.

Do not invent missing metrics, private context, career milestones, content bodies, transcripts, or audience signals. Record missing fields as evidence gaps.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media strategy skill in the final response as `Recommended next skill: <command>`.

Default final-response line when no stronger route is available: `Recommended next skill: $creator-positioning`.

Routing rules:

- If positioning, promise, audience, credibility, or category ambiguity is the main finding, emit `Recommended next skill: $creator-positioning`.
- If the dossier surfaces repeatable topics, series ideas, publishing cadence, or format opportunities, emit `Recommended next skill: $content-programming`.
- If product/company proof, launch support, founder-led media, or product narrative is the main finding, emit `Recommended next skill: $product-led-media-map`.
- If available evidence includes enough cross-platform metrics or performance records to review, emit `Recommended next skill: $creator-metrics-review`.
- If YouTube-specific evidence dominates and a platform-specific audit is the next best step, preserve the existing YouTube workflow by recommending the matching YouTube audit skill.
- If evidence is too thin for strategy synthesis, recommend the next collection or foundation skill instead of forcing a strategy route.

## Constraints

- Do not mutate external accounts or publish content.
- Do not bypass bot protections, rate limits, paywalls, login walls, or access controls.
- Do not require paid APIs, privileged platform programs, or logged-in scraping.
- Do not treat missing metrics, missing bodies, or unavailable transcripts as failures; record them as evidence gaps.
- Cite source paths, source URLs, capture dates, and confidence levels for substantive claims.
