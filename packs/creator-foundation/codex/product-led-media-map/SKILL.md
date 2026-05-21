---
name: product-led-media-map
description: Map a product or company into founder-led YouTube media themes, proof assets, demos, trust moments, and content roles
type: research
version: 1.0.0
argument-hint: "[product or channel slug]"
---

# Product-Led Media Map

Invoke as `$product-led-media-map`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

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
- Recommended links to `$content-programming` and `$series-spec`.

## Approved Artifact Handoff

After an approved synthesized write, explicit write/update mode, or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while approved artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.
- If stopping for approval before writing, the approval request remains the next action; do not include downstream routing.

## Intent-Aware Routing

Before applying the default `## Next-Skill Routing` sequence, classify the user's immediate intent and route to the missing action that best serves that intent:

- Strategy refresh: recommend the missing or stale positioning, programming, portfolio, metrics, or product-media artifact.
- Recording prep: recommend the missing series spec, script, build proof, walkthrough guide, or validation artifact needed before recording.
- Upload prep: recommend packaging, title/thumbnail, description, chapters, or final metadata work before broader strategy work.
- Performance review: recommend metrics, cadence, portfolio, peer benchmark, or owner-analytics export work before new content planning.
- Owner analytics or private/manual platform evidence: route to an explicit manual/guide handoff instead of inventing unavailable metrics.
- Dirty intended artifacts: route to shipping/commit/handoff first, not another creator strategy skill.

Use the default next-skill sequence only when no stronger user intent, missing artifact, manual blocker, or dirty-artifact handoff applies.

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/product-led-media-map-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/product-led-media-map-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$creator-metrics-review`.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`$creator-presence-dossier` -> `$youtube-channel-audit` -> `$youtube-video-audit` -> `$youtube-vid-research` -> `$youtube-concept-research` -> `$youtube-competitive-research` -> `$youtube-title-thumbnail-audit` -> `$youtube-description-optimizer` -> `$youtube-portfolio` -> `$youtube-peer-benchmark` -> `$youtube-search-positioning` -> `$youtube-cadence-diagnosis` -> `$creator-positioning` -> `$content-programming` -> `$series-spec` -> `$product-led-media-map` -> `$creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `$creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Do not create product claims the repo cannot support.
- Do not expose secrets, private customer data, or unreleased commitments.
- Use the dossier when present to connect product proof to the creator's public roles and proof assets; do not require it for YouTube-only product-led channel work.
- Keep product-led media distinct from ad copy; show evidence and judgment.
