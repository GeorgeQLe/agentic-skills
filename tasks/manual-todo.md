# Manual Tasks

## Skills Showcase Distribution Launch

- [ ] Choose the static newsletter/email provider, configure the provider endpoint on the `/follow/` form, and re-run local validation before launch. _(after: Phase 34 Step 34.4)_ — Note: Phase 37 migrates to Next.js at `apps/skills-showcase/`; provider endpoint configuration should target the new app surface once Phase 37 ships.
- [ ] Configure the Vercel project for the Skills Showcase and verify deployed route reloads. _(after: Phase 37 completion)_ — Note: originally targeted `docs/skills-showcase/` as a static site; Phase 37 moves to `apps/skills-showcase/` as a Next.js app, so Vercel config (root, build command, output) must be updated to match the app deployment model.
