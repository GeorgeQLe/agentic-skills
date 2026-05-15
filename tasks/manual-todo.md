# Manual Tasks

> Phase: 38 — First-Party Newsletter Capture And Admin
> These tasks require human-only external action. Do not put repo edits, local commands, CLI/API work, tests, audits, or implementation follow-ups here.
> Check them off as you complete them.

## Pre-Phase / Setup
- [ ] Create a Neon project and database for the Skills Showcase, and provide the `DATABASE_URL` connection string for `.env.local`. _(blocks: Step 38.2 runtime testing)_
- [ ] Choose and set the `NEWSLETTER_ADMIN_SECRET` value for local dev in `.env.local`. _(blocks: Step 38.6 admin auth testing)_

## During Phase
- [x] Configure the Vercel project for the Skills Showcase and verify deployed route reloads. _(after: Phase 37 completion)_ — User confirmed on 2026-05-15 that the Skills Showcase is live and hosted via Vercel.

## Post-Phase / Verification
- [ ] Set `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` environment variables in the Vercel project. _(after: Step 38.7)_
- [ ] Verify `/follow` submission and `/admin/newsletter` access on the live Vercel URL. _(after: Step 38.9)_ — Live Vercel hosting is confirmed; form/admin verification remains open until checked directly.
