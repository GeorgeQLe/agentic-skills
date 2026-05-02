# Creator Media Pack

Project-local workflows for YouTube channels, non-YouTube creator platforms, founder-led media, product-led content, creator portfolios, and repeatable programming strategy.

Install this pack when a project needs platform capability mapping, evidence normalization, channel audits, packaging audits, portfolio strategy, peer benchmarking, search positioning, cadence diagnosis, creator positioning, programming plans, series specs, product-to-media mapping, or recurring metrics reviews.

Default flow:

```text
creator-platform-capability-matrix -> creator-evidence-schema
-> youtube-channel-audit / platform-specific audit / creator-positioning
-> youtube-title-thumbnail-audit -> youtube-portfolio
-> youtube-peer-benchmark -> youtube-search-positioning / youtube-cadence-diagnosis
-> creator-positioning -> content-programming -> series-spec
-> product-led-media-map -> creator-metrics-review
```

YouTube-specific work may still start directly at `youtube-channel-audit`. Non-YouTube or mixed-platform creator-media work starts with `creator-platform-capability-matrix`, then `creator-evidence-schema`, so downstream audits share one evidence contract.

Validation targets for this pack include `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA` style use cases: personal creator channel, recurring founder/media show, and topic-led publication.

**Primary role:** Both — Claude-orchestration for strategy and critique; Codex-execution for evidence capture, artifact updates, validation, and shipping.
