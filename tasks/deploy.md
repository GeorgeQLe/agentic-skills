# Skills Showcase Deploy Contract

## Scope

This contract covers deployment for the Skills Showcase. The primary surface is the Next.js app at `apps/skills-showcase/`.

Current status: the Skills Showcase is live and hosted via Vercel as of 2026-05-15. Remaining manual launch checks should focus on environment variables, `/follow`, `/admin/newsletter`, and route/UI verification rather than initial Vercel project setup.

## Next.js App (Primary)

### Hosting Target

- Provider: Vercel.
- Project root / framework root: `apps/skills-showcase/`.
- Framework preset: Next.js.
- Build command: `pnpm build`.
- Install command: `pnpm install`.
- Output directory: `.next` (Next.js default).
- Runtime: server-side (Node.js).
- Database: Neon PostgreSQL.
- GitHub Actions: not used.

### Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string. |
| `NEWSLETTER_ADMIN_SECRET` | Shared secret for `/admin/newsletter` auth gate. |

### Required Source State

Before deploying, run these local checks from the repository root:

```sh
node scripts/generate-skills-showcase-data.mjs
node scripts/generate-skills-showcase-github-data.mjs
scripts/validate-skills-showcase-data.sh
pnpm --dir apps/skills-showcase build
```

The validator fingerprints all four generated assets across both `docs/skills-showcase/assets/` and `apps/skills-showcase/public/assets/`.

### Routes

The Next.js app produces 8 routes (7 static + 1 dynamic API). Verify after deploy:

- `/`
- `/workflows/`
- `/packs/`
- `/catalog/`
- `/inspect/`
- `/follow/`
- `/admin/newsletter`
- `/api/trpc/*` (dynamic)

### Manual Vercel Setup

1. Create or select the Vercel project for the Skills Showcase.
2. Set the project root to `apps/skills-showcase/`.
3. Select Next.js as the framework preset.
4. Build command: `pnpm build`. Install command: `pnpm install`.
5. Set environment variables: `DATABASE_URL`, `NEWSLETTER_ADMIN_SECRET`.
6. Deploy from the current `master` branch after local validation passes.
7. Verify deployed route reloads and links manually.

## Launch Checks

- Confirm generated data is fresh across both output paths.
- Confirm `DATABASE_URL` is set and the Neon database is reachable.
- Confirm `NEWSLETTER_ADMIN_SECRET` is set and `/admin/newsletter` auth gate works.
- Confirm `/inspect/` and `/follow/` do not claim live LexCorp metrics, visitor analytics, community counts, or newsletter performance.
- Confirm LexCorp, YouTube, X/Twitter, Discord, GitHub, catalog, inspect, and newsletter actions are visible.
- Confirm desktop and mobile layouts are readable.
