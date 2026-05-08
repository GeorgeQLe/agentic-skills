# Skills Showcase Static Deploy Contract

## Scope

This contract covers manual launch deployment for the static Skills Showcase site in `docs/skills-showcase/`.

## Hosting Target

- Provider: Vercel static hosting.
- Project root / framework root: `docs/skills-showcase/`.
- Build command: none.
- Install command: none.
- Output directory: `.` from inside `docs/skills-showcase/`.
- Runtime API: none.
- Database: none.
- GitHub Actions: not used.

## Required Source State

Before configuring or deploying the Vercel project, run these local checks from the repository root:

```sh
scripts/validate-skills-showcase-data.sh
node --check docs/skills-showcase/app.js
```

Then serve `docs/skills-showcase/` as a static directory and verify direct route reloads for:

- `/`
- `/workflows/`
- `/packs/`
- `/catalog/`
- `/inspect/`
- `/follow/`

## Manual Vercel Setup

1. Create or select the Vercel project for the Skills Showcase.
2. Set the project root to `docs/skills-showcase/`.
3. Leave build and install commands empty.
4. Set the output directory to `.`.
5. Do not add GitHub Actions, serverless functions, a database, visitor analytics, or a runtime API for this MVP.
6. Deploy from the current `master` branch after local validation passes.
7. Verify deployed route reloads and links manually.

## Newsletter Provider

The `/follow/` newsletter form is static and defaults to a non-collecting fallback. To enable collection, configure the selected static form provider endpoint by setting `data-provider-endpoint` on the form in `docs/skills-showcase/follow/index.html`, then re-run validation before deployment.

Do not store submitted email addresses in this repository, generated assets, local logs, or a first-party database.

## Launch Checks

- Confirm generated data is fresh.
- Confirm `/follow/` shows provider-missing fallback if no endpoint is configured.
- Confirm `/inspect/` and `/follow/` do not claim live LexCorp metrics, visitor analytics, community counts, or newsletter performance.
- Confirm LexCorp, YouTube, X/Twitter, Discord, GitHub, catalog, inspect, and newsletter actions are visible.
- Confirm desktop and mobile layouts are readable.
