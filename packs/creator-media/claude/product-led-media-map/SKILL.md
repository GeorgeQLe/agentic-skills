---
name: product-led-media-map
description: Map a product or company into founder-led YouTube media themes, proof assets, demos, trust moments, and content roles
type: research
version: 1.0.0
argument-hint: "[product or channel slug]"
---

# Product-Led Media Map

Invoke as `/product-led-media-map`.

Connect a product, company, or founder project to a credible creator-media strategy. This is for product-led media, not generic content marketing.

## Inputs

- Product context: `README.md`, `specs/**`, `research/**`, docs, changelogs, demos, launch notes.
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

## Constraints

- Do not create product claims the repo cannot support.
- Do not expose secrets, private customer data, or unreleased commitments.
- Keep product-led media distinct from ad copy; show evidence and judgment.
