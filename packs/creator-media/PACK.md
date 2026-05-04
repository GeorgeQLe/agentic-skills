# Creator Media Pack

Project-local workflows for YouTube channels, non-YouTube creator platforms, founder-led media, product-led content, creator portfolios, and repeatable programming strategy.

Install this pack when a project needs research directory bootstrapping, directory convention enforcement, platform capability mapping, evidence normalization, channel audits, external video research, competitive research, packaging audits, description optimization, portfolio strategy, peer benchmarking, search positioning, cadence diagnosis, creator positioning, programming plans, series specs, product-to-media mapping, or recurring metrics reviews.

Default flow:

```text
research-bootstrap -> research-directory-conventions (reference)
-> creator-platform-capability-matrix -> creator-evidence-schema
-> creator-presence-dossier -> creator-positioning / content-programming / product-led-media-map / creator-metrics-review
-> youtube-channel-audit / youtube-video-audit / youtube-vid-research / platform-specific audit
-> youtube-competitive-research
-> youtube-title-thumbnail-audit -> youtube-description-optimizer -> youtube-portfolio
-> youtube-peer-benchmark -> youtube-search-positioning / youtube-cadence-diagnosis
-> creator-positioning -> content-programming -> series-spec
-> product-led-media-map -> creator-metrics-review
```

New projects should start with `research-bootstrap` to scaffold the directory structure, then proceed into the platform-specific workflow. `research-directory-conventions` is a passive reference skill — it does not produce artifacts but defines the layout all other skills follow.

YouTube-specific work may still start directly at `youtube-channel-audit` for channel-level patterns, `youtube-video-audit` for one video's performance, or `youtube-vid-research` / `youtube-competitive-research` for external reference videos. Creator/persona research across public platforms starts with `creator-presence-dossier`, which feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`. Non-YouTube or mixed-platform creator-media work starts with `creator-platform-capability-matrix`, then `creator-evidence-schema`, so downstream audits share one evidence contract.

Remotion-oriented production work lives in the `remotion` pack. Install `creator-media` and `remotion` together when the project needs `youtube-format-research`, `video-script`, or `video-build`.

Validation targets for this pack include `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA` style use cases: personal creator channel, recurring founder/media show, and topic-led publication.

**Primary role:** Both — Claude-orchestration for strategy and critique; Codex-execution for evidence capture, artifact updates, validation, and shipping.
