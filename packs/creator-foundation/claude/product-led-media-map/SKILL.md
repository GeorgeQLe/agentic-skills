---
name: product-led-media-map
description: Map a product or company into founder-led YouTube media themes, proof assets, demos, trust moments, and content roles
type: research
version: 1.0.0
argument-hint: "[product or channel slug]"
---

# Product-Led Media Map

Invoke as `/product-led-media-map`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

Connect a product, company, or founder project to a credible creator-media strategy. This is for product-led media, not generic content marketing.

## Inputs

- Product context: `README.md`, `specs/**`, `research/**`, docs, changelogs, demos, launch notes.
- Preferred creator context when present: `research/creator-presence/<slug>.md`.
- Creator context: `research/youtube/creator-positioning-<slug>.md`, channel audit, portfolio, and programming docs when present.

## Output

Write `research/youtube/product-led-media-map-<slug>.md` with:

- Product truth: what can be shown, proven, or taught.
- Audience overlap: product users, buyers, community, and broader media audience.
- Proof assets: demos, workflows, customer language, benchmarks, build logs, failures, behind-the-scenes evidence.
- Media themes: education, build-in-public, market analysis, case studies, product demos, founder judgment.
- Trust risks: overpromising, thin proof, sensitive customer data, sponsor conflicts, product-market mismatch.
- Content-role mapping: acquisition, trust-building, proof, education, launch support, retention.
- Recommended links to `/content-programming` and `/series-spec`.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/creator-metrics-review`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/creator-presence-dossier` -> `/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Do not create product claims the repo cannot support.
- Do not expose secrets, private customer data, or unreleased commitments.
- Use the dossier when present to connect product proof to the creator's public roles and proof assets; do not require it for YouTube-only product-led channel work.
- Keep product-led media distinct from ad copy; show evidence and judgment.
