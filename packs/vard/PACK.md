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
vard-scan -> vard-align -> vard-ship
```

## Graduation

When a VARD experiment shows traction, graduate to the full Business AFPS pipeline: `scripts/pack.sh install business-discovery`.

## Skills

- `vard-scan`: Scan for viral app opportunities from trends, gaps, and user pain points.
- `vard-align`: Quick feasibility and novelty check — go/no-go decision for this week's build.
- `vard-ship`: Deploy the app, create landing page, set up analytics, and log the shipment.
