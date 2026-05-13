# Business App Compatibility Pack

`business-app` is now a compatibility alias, not a skill container. Its former skills were split into narrower packs to reduce loaded context:

```text
business-discovery, customer-lifecycle, business-growth, business-ops
```

Use the narrowest pack for the current phase:

- `business-discovery`: ICP, customer/market research, value proposition, positioning, and lean canvas.
- `customer-lifecycle`: journey mapping, onboarding, conversion, transaction, retention, expansion, and lifecycle metrics.
- `business-growth`: engagement loops, metrics, monetization, GTM, landing copy, experiments, growth, and PMF.
- `business-ops`: assumptions, feedback/retro/cohorts, risks, runway, investor updates, scale/mvp gaps, platform strategy, and research reconciliation.

For backwards compatibility, `scripts/pack.sh install business-app` expands to all four packs. Prefer installing only the lane needed for the current work.

Use `business-app-kanban` only when the project intentionally uses PoketoWork boards.
