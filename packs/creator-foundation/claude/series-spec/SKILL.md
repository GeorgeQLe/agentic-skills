---
name: series-spec
description: Specify a repeatable YouTube series format with audience job, episode shape, evidence requirements, packaging rules, and success metrics
type: planning
version: 1.0.0
argument-hint: "<series idea or programming path>"
---

# Series Spec

Invoke as `/series-spec`.

Define a repeatable series format that can be produced consistently. Use this for founder updates, interviews, teardown series, recurring shows such as WeeklyG or WeeklySOTA, and product-led education series.

## Inputs

- Prefer `research/youtube/content-programming-<slug>.md` and `creator-positioning-<slug>.md`.
- Read relevant audit, portfolio, peer benchmark, and product-led media map artifacts.

## Output

Write `specs/youtube/series-<slug>.md` with:

- Series promise and target viewer.
- Viewer job and expected transformation.
- Episode format: opening, proof, body segments, CTA, and outro.
- Packaging rules: title patterns, thumbnail promise, description structure, chapter style.
- Evidence requirements: sources, demos, product artifacts, examples, or guest proof.
- Production constraints: length range, cadence, preparation burden, editing complexity.
- Metrics: leading indicators, lagging indicators, and stop/iterate thresholds.
- Example episode briefs, not full scripts.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/product-led-media-map`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Do not write scripts unless explicitly asked.
- Keep the series format reusable; one-off video ideas do not qualify.
- If the series depends on a product, tie claims to actual product evidence.
