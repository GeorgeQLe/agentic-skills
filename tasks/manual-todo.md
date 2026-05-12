# Manual Tasks

## Skills Showcase Distribution Launch

- [ ] Choose the static newsletter/email provider, configure the provider endpoint on the `/follow/` form, and re-run local validation before launch. _(after: Phase 34 Step 34.4)_ — Note: Phase 38 replaces this with first-party Neon capture; this task may become obsolete once Phase 38 ships.
- [ ] Configure the Vercel project for the Skills Showcase and verify deployed route reloads. _(after: Phase 37 completion)_ — Note: Phase 37 complete; `apps/skills-showcase/` is a Next.js app. Vercel config (root, build command, output) must target the app deployment model. See `tasks/deploy.md`.
