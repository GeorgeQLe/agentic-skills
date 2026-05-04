---
name: content-programming
description: Design an evidence-backed channel programming plan across pillars, formats, cadence, roles, and measurement without writing scripts
type: research
version: 1.0.0
argument-hint: "[channel slug or positioning path]"
---

# Content Programming

Invoke as `$content-programming`.

Create a programming strategy for a creator-media channel. This is the channel architecture step, not a script-writing step.

## Inputs

- Prefer `research/creator-presence/<slug>.md` when present for cross-platform themes, signature formats, cadence constraints, and proof assets.
- `research/youtube/creator-positioning-<slug>.md`
- `research/youtube/portfolio-<slug>.md`
- Optional peer benchmark and product-led media map.

## Output

Write `research/youtube/content-programming-<slug>.md` with:

- Programming thesis: what the channel repeatedly earns attention for.
- Pillars: 3-5 durable topic lanes with audience jobs.
- Formats: recurring formats mapped to archetypes and roles.
- Cadence: publishing rhythm, minimum viable cadence, and seasonal constraints.
- Portfolio balance: acquisition vs trust vs proof vs education vs retention.
- Measurement plan: primary metrics, secondary metrics, and warning signs.
- Cleanup/refactor plan for existing videos.
- Next series candidates to specify with `$series-spec`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$series-spec`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$creator-presence-dossier` -> `$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Do not generate full scripts or a calendar unless explicitly asked.
- Every proposed pillar must connect to audit, positioning, product, or benchmark evidence.
- Use the dossier when present as preferred creator context, while preserving channel audit and portfolio evidence for YouTube-only programming.
- Keep programming realistic for the apparent production capacity.
