# Manual Tasks

> No active phase manual tasks. All roadmap phases are complete.

## Migrated to `agentic-skills-showcase` repo — Phase 38 Newsletter Capture And Admin

> Reconciled 2026-06-29 (`/reconcile-dev-docs fix tasks`). The Skills Showcase Next.js app
> split out of this repo into the separate `GeorgeQLe/agentic-skills-showcase` repo during the
> three-repo split. The four deferred Phase 38 newsletter production-setup tasks below were
> orphaned here — they target the Showcase app/deployment, not `agentic-skills` — so ownership
> moves with the code. Track and complete them in `agentic-skills-showcase` (e.g. its own
> `tasks/manual-todo.md`); they are recorded here only as a migration pointer, not active work.
>
> Migrated items (now owned by `agentic-skills-showcase`):
> - Create a Neon project/database for the Showcase; provide `DATABASE_URL` for `.env.local`.
> - Choose and set `NEWSLETTER_ADMIN_SECRET` for local dev in `.env.local`.
> - Set `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` env vars in the Vercel project.
> - Verify `/follow` submission and `/admin/newsletter` on the live Vercel URL.

## Completed

- [x] Configure the Vercel project for the Skills Showcase and verify deployed route reloads. _(Phase 37 → Phase 38)_ — User confirmed on 2026-05-15.
