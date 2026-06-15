# ORD Pack

OSS Rapid Distribution — rapid shipping of open-source developer tools, CLI utilities, and npm packages. Part of the ORD deck.

Use this pack when you want to move from developer pain point to published package in days. ORD is the fast lane for testing devtool concepts before committing to full Devtool AFPS depth.

Install in a project with:

```bash
scripts/pack.sh install ord
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Default Flow

```text
ord-scan -> ord-align -> ord-ship -> ord-traction
```

## Graduation

After 1-2 weeks live, run `ord-traction` to compare the published package's signals (stars, downloads, non-author issues, integration requests) against the ORD graduation thresholds. It recommends iterate, graduate, or archive — you confirm. When it recommends graduating, enter the full Devtool AFPS pipeline at `/devtool-user-map` (`scripts/pack.sh install devtool`), or `/idea-scope-brief` for the rare cross-domain Business AFPS case, with the ORD scan, align, and ship-log entries linked as evidence.

## Skills

- `ord-scan`: Scan for OSS tool opportunities from npm gaps, GitHub trends, and developer pain points.
- `ord-align`: Validate whether the tool is worth building — namespace check, existing solutions, effort estimate.
- `ord-ship`: Publish to npm, create README, set up repo, and log the shipment.
- `ord-traction`: Check post-launch adoption and recommend iterate, graduate to Devtool AFPS (or cross-domain Business AFPS), or archive (semi-automatic graduation gate).
