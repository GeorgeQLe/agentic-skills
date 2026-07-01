# Devtool Pack

Deliberate AFPS workflow for developer tools, CLIs, libraries, SDKs, and OSS products that have enough evidence to justify deeper positioning, adoption, documentation, DX, and monetization work.

Use this pack when ORD traction, existing user signals, or a mature devtool concept needs the full Devtool AFPS route instead of another rapid shipping loop.

Install in a project with:

```bash
npx skillpacks install devtool
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Default Flow

Start with the router:

```text
devtool-workflow
```

The default deliberate route is:

```text
devtool-positioning -> devtool-adoption -> devtool-dx-journey -> devtool-docs-audit -> devtool-monetization
```

Use `devtool-user-map` as the direct first concrete research step when the user wants to begin with stakeholder/user mapping.

## ORD Graduation

ORD graduates here after `ord-traction` recommends Devtool AFPS. Carry forward the ORD scan, align, ship-log, and traction-log entries as evidence. The default next command after installing this pack is `$devtool-workflow`; `$devtool-user-map` is the direct first-step option.

## Skills

- `devtool-workflow`: Thin orchestrator that routes deliberate devtool work to the next appropriate skill.
- `devtool-positioning`: Position the devtool against alternatives and buyer/user context.
- `devtool-adoption`: Investigate and improve developer adoption paths.
- `devtool-user-map`: Map developer users, stakeholders, and jobs.
- `devtool-integration-map`: Map integration surfaces and adoption paths.
- `devtool-dx-journey`: Audit and improve the developer experience journey.
- `devtool-docs-audit`: Audit documentation against user tasks and adoption needs.
- `devtool-monetization`: Explore monetization, packaging, and commercial strategy.
