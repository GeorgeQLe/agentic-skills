---
name: creator-positioning
description: Define a creator or founder-media channel's audience promise, category, differentiated wedge, proof, and anti-positioning
type: research
version: 1.0.0
argument-hint: "[channel slug or audit path]"
---

# Creator Positioning

Invoke as `$creator-positioning`.

Turn audit, portfolio, and benchmark evidence into a clear creator positioning brief.

## Inputs

- Prefer `research/creator-presence/<slug>.md` when present for cross-platform career, public promise, proof asset, and owned-presence context.
- Prefer `research/youtube/channel-audit-<slug>.md`, `portfolio-<slug>.md`, and `peer-benchmark-<slug>.md`.
- Read product/company context when present: `README.md`, `research/**`, `specs/**`, and product docs.
- If no channel evidence or dossier exists, run `$youtube-channel-audit` for YouTube-only work or `$creator-presence-dossier` for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.

## Output

Write `research/youtube/creator-positioning-<slug>.md` with:

- Current audience promise.
- Best-fit viewer segment and non-viewer.
- Category or subcategory the channel should be understood within.
- Differentiated wedge and why it is credible.
- Proof assets: videos, founder experience, product evidence, community evidence.
- Anti-positioning: topics, formats, and promises to avoid.
- One-sentence positioning statement.
- Implications for `$content-programming` and `$series-spec`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$content-programming`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$creator-presence-dossier` -> `$youtube-channel-audit` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$video-script` -> `$video-build` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Position from evidence; do not invent credentials or audience demand.
- Treat the dossier as an optional preferred creator context source, not a replacement for YouTube audit evidence when the work is channel-only.
- Prefer a narrow owned wedge over a broad generic creator promise.
- If the evidence supports multiple incompatible positions, present the trade-off and recommend one.
