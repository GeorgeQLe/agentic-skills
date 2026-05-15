# Manual Tasks

> No active phase manual tasks. All roadmap phases are complete.

## Deferred from Phase 38 — First-Party Newsletter Capture And Admin

> Phase 38 code was shipped without production database or admin secret provisioning.
> These tasks are deferred until the newsletter feature needs to go live in production.
> Deferred on 2026-05-15 during dev-docs reconciliation.

- [ ] Create a Neon project and database for the Skills Showcase, and provide the `DATABASE_URL` connection string for `.env.local`. _(was: blocks Step 38.2 runtime testing)_
- [ ] Choose and set the `NEWSLETTER_ADMIN_SECRET` value for local dev in `.env.local`. _(was: blocks Step 38.6 admin auth testing)_
- [ ] Set `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` environment variables in the Vercel project. _(was: after Step 38.7)_
- [ ] Verify `/follow` submission and `/admin/newsletter` access on the live Vercel URL. _(was: after Step 38.9)_

## Completed

- [x] Configure the Vercel project for the Skills Showcase and verify deployed route reloads. _(Phase 37 → Phase 38)_ — User confirmed on 2026-05-15.
