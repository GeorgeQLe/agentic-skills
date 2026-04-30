---
name: youtube-portfolio
description: Map a YouTube channel's video portfolio by archetype, strategic role, performance concentration, and cleanup or refresh opportunities
type: research
version: 1.0.0
argument-hint: "[channel slug or audit path]"
---

# YouTube Portfolio

Invoke as `$youtube-portfolio`.

Turn channel-audit evidence into a portfolio view: what the channel has published, what roles those videos serve, where performance concentrates, and what should be kept, refreshed, or reviewed.

## Inputs

- Prefer `research/youtube/channel-audit-<slug>.md`.
- Also read `research/youtube/youtube-audit-<slug>-*.md` and `research/youtube/data/<slug>/videos-*.jsonl` when present.
- If no evidence exists, run `$youtube-channel-audit <channel>` first.

## Output

Write `research/youtube/portfolio-<slug>.md` with:

- Portfolio summary for `@GeorgeLe`, `WeeklyG`, `WeeklySOTA`, or the supplied channel.
- Archetype matrix: founder update, interview, tutorial, analysis, vlog, launch, reaction, teardown, other.
- Content-role matrix: acquisition, trust-building, proof, education, launch support, community retention, cleanup candidate.
- Concentration analysis: top 1, top 3, top 5 view share and whether the portfolio is over-dependent on outliers.
- Cadence and recency: gaps, stale clusters, and durable series.
- Cleanup register: `keep`, `refresh`, `unlist/private candidate`, `needs human review`.
- Portfolio recommendation: where the next planning work should focus.

## Constraints

- Use observed metadata and transcript evidence; do not make channel-management claims from memory.
- Cleanup recommendations are review flags, not destructive instructions.
- If portfolio evidence is thin, state the gap and route to `$youtube-channel-audit`.
