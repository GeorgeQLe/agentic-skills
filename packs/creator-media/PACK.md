# Creator Media Compatibility Pack

`creator-media` is now a compatibility alias, not a skill container. Its former skills were split into narrower packs to reduce loaded context:

```text
creator-foundation, youtube-ops
```

Use the narrowest pack for the current phase:

- `creator-foundation`: research directory setup, platform evidence schema, creator dossier, positioning, programming, series specs, product-led media mapping, and metrics review.
- `youtube-ops`: YouTube channel/video audits, external video context, competitive research, packaging, descriptions, portfolio, peer benchmarking, search positioning, and cadence diagnosis.

LinkedIn-first evidence work is part of `creator-foundation`, not a standalone scraper. Start with the matrix/schema/dossier flow:

```text
creator-platform-capability-matrix -> creator-evidence-schema -> creator-presence-dossier
```

Use owner exports, manual snapshots, public unauthenticated captures, and user-provided files as the baseline. Paid APIs, logged-in scraping, bot-protection bypass, private-data collection, private relationship graph extraction, paywall access, and access-control circumvention are out of scope.

For backwards compatibility, `scripts/pack.sh install creator-media` expands to `creator-foundation` and `youtube-ops`.

Remotion production work remains in the `remotion` pack.
