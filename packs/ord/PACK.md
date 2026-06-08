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
ord-scan -> ord-align -> ord-ship
```

## Graduation

When an ORD package gains traction (stars, downloads, issues), graduate to the full Devtool AFPS pipeline: `scripts/pack.sh install devtool`.

## Skills

- `ord-scan`: Scan for OSS tool opportunities from npm gaps, GitHub trends, and developer pain points.
- `ord-align`: Validate whether the tool is worth building — namespace check, existing solutions, effort estimate.
- `ord-ship`: Publish to npm, create README, set up repo, and log the shipment.
