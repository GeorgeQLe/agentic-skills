# Creator Media Compatibility Pack

`creator-media` is now a compatibility alias, not a skill container. Its former skills were split into narrower packs to reduce loaded context:

```text
creator-foundation, youtube-ops
```

Use the narrowest pack for the current phase:

- `creator-foundation`: research directory setup, platform evidence schema, creator dossier, positioning, programming, series specs, product-led media mapping, and metrics review.
- `youtube-ops`: YouTube channel/video audits, external video context, competitive research, packaging, descriptions, portfolio, peer benchmarking, search positioning, and cadence diagnosis.

For backwards compatibility, `scripts/pack.sh install creator-media` expands to `creator-foundation` and `youtube-ops`.

Remotion production work remains in the `remotion` pack.
