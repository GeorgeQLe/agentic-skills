# Skills Showcase Deploy Contract

## Scope

This contract covers deployment for the Skills Showcase. The primary surface is the Next.js app at `apps/skills-showcase/`.

Current status: the Skills Showcase is live and hosted via Vercel as of 2026-05-15. Remaining manual launch checks should focus on environment variables, `/follow`, `/admin/newsletter`, and route/UI verification rather than initial Vercel project setup.

This deploy contract documents the production surface. It does not mean every repository commit should deploy. Most skill source, package, prompt-history, task-doc, alignment, research, spec, and archive commits do not change the Skills Showcase runtime or generated public data.

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

### Path-Based Deploy Policy

Configure Vercel's Ignored Build Step to run:

```sh
scripts/vercel-ignore-build.sh
```

The helper follows Vercel ignored-build semantics:

- Exit `0`: skip the build.
- Exit `1`: continue with the build.

Deploy when at least one changed path affects the Skills Showcase deploy surface:

- `apps/skills-showcase/**`
- `docs/skills-showcase/**`
- `docs/benchmark-results-matrix.md`
- `package.json`
- root lockfiles such as `pnpm-lock.yaml`, `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, or `bun.lockb`
- `pnpm-workspace.yaml`
- `vercel.json` or `apps/skills-showcase/vercel.json`
- `scripts/vercel-ignore-build.sh` or its test harness

Skip deploys when the commit only touches non-showcase surfaces:

- Skill source under `packs/**` or `global/**`
- Skillpack package/CLI internals under `packages/skillpacks/**`
- Workflow evidence under `tasks/**`, `prompts/**`, `alignment/**`, `research/**`, or `specs/**`
- Archive or historical snapshots under `archive/**` or nested `**/archive/**`
- Generated local install roots such as `.codex/skills/**` and `.claude/skills/**`

Mixed commits deploy if any deploy-relevant path changed. For example, a skill-source commit plus regenerated `apps/skills-showcase/public/assets/skills-data.js` should deploy; a skill-source commit plus task notes only should not.

### Operating Model

- Ship source changes: commit and push the intended source/evidence boundary after local verification. This action does not automatically imply a production deploy.
- Refresh generated showcase data: run the showcase data generators when public catalog, benchmark, proof, or validation metadata changed, then commit the generated app/public and docs mirror assets with the source change.
- Deploy the showcase: let Vercel build only when path gating says the app runtime, generated public assets, dependency manifests, or deploy config changed.
- Record workflow evidence: keep required task, prompt, alignment, research, and spec artifacts tracked, but classify them as non-deploying evidence.

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
