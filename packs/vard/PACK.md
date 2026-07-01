# VARD Pack

Viral App Rapid Distribution — rapid weekly shipping of viral apps, micro-tools, and business experiments. Part of the VARD deck.

Use this pack when you want to move from idea to shipped app in days, not weeks. VARD is the fast lane for testing viral concepts before committing to full AFPS depth.

Install in a project with:

```bash
scripts/pack.sh install vard
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Default Flow

```text
vard-scan -> vard-align -> vard-ship -> vard-traction
```

## Graduation

After 1-2 weeks live, run `vard-traction` to compare the shipped app's signals against the VARD graduation thresholds. It recommends iterate, graduate, or archive — you confirm. When it recommends graduating, enter the full Business AFPS pipeline with `npx skillpacks install business-research`, then `$idea-scope-brief` for raw/new product framing or `$customer-discovery` when the shipped app already has a clear concept and traction evidence. Link the VARD scan, align, ship-log, and traction-log entries as evidence.

## Skills

- `vard-scan`: Scan for viral app opportunities from trends, gaps, and user pain points.
- `vard-align`: Quick feasibility and novelty check — go/no-go decision for this week's build.
- `vard-ship`: Deploy the app, create landing page, set up analytics, and log the shipment.
- `vard-traction`: Check post-launch traction and recommend iterate, graduate to Business AFPS, or archive (semi-automatic graduation gate).
