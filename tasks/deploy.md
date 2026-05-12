# Skills Showcase Deploy Contract

## Scope

This contract covers deployment for the Skills Showcase. The primary surface is the Next.js app at `apps/skills-showcase/`.

## Next.js App (Primary)

### Hosting Target

- Provider: Vercel.
- Project root / framework root: `apps/skills-showcase/`.
- Framework preset: Next.js.
- Build command: `pnpm build`.
- Install command: `pnpm install`.
- Output directory: `.next` (Next.js default).
- Runtime API: none (static export with `output: "export"`).
- Database: none.
- GitHub Actions: not used.

### Required Source State

Before deploying, run these local checks from the repository root:

```sh
node scripts/generate-skills-showcase-data.mjs
node scripts/generate-skills-showcase-github-data.mjs
scripts/validate-skills-showcase-data.sh
pnpm --dir apps/skills-showcase build
```

The validator fingerprints all four generated assets across both `docs/skills-showcase/assets/` and `apps/skills-showcase/public/assets/`.

### Static Routes

The Next.js app produces 6 static routes. Verify after deploy:

- `/`
- `/workflows/`
- `/packs/`
- `/catalog/`
- `/inspect/`
- `/follow/`

### Manual Vercel Setup

1. Create or select the Vercel project for the Skills Showcase.
2. Set the project root to `apps/skills-showcase/`.
3. Select Next.js as the framework preset.
4. Build command: `pnpm build`. Install command: `pnpm install`.
5. Do not add GitHub Actions, serverless functions, a database, visitor analytics, or a runtime API.
6. Deploy from the current `master` branch after local validation passes.
7. Verify deployed route reloads and links manually.

## Newsletter Provider

The `/follow/` newsletter form is static and defaults to a non-collecting fallback. To enable collection, configure the selected static form provider endpoint, then re-run validation before deployment.

Do not store submitted email addresses in this repository, generated assets, local logs, or a first-party database.

## Launch Checks

- Confirm generated data is fresh across both output paths.
- Confirm `/follow/` shows provider-missing fallback if no endpoint is configured.
- Confirm `/inspect/` and `/follow/` do not claim live LexCorp metrics, visitor analytics, community counts, or newsletter performance.
- Confirm LexCorp, YouTube, X/Twitter, Discord, GitHub, catalog, inspect, and newsletter actions are visible.
- Confirm desktop and mobile layouts are readable.
