# Ship Manifest - Social Media Channel Conventions

## Scope

Create reusable social-media channel conventions for build-in-public and alignment-producing agents, then wire those conventions into BIP alignment guidance and the skillpacks package boundary.

## Changes

- Added `docs/social-post-convention.md`:
  - researched guidance for LinkedIn, X, Bluesky, Threads, Mastodon, Reddit, Hacker News, and YouTube Community
  - `platform_aligned` and `creator_inspired` drafting modes
  - source-safety rules, per-channel profiles, spam triggers, claim risks, and compact source lists
- Added `docs/social-video-content-convention.md`:
  - researched guidance for YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, LinkedIn video, and reusable founder/devtool video prompts
  - video-specific asset safety, redaction, AI/synthetic media, copyright, and publish-precheck rules
- Updated `docs/alignment-page-convention.md` so BIP pages select target channels and drafting mode before presenting channel-specific post or video ideas.
- Regenerated all 306 generated `ALIGNMENT-PAGE.md` bundles.
- Registered `social-post` and `social-video-content` in `scripts/skill-convention-registry.mjs` as static package assets.
- Updated `scripts/skill-convention-bundle-audit.mjs` and lifecycle/package-boundary tests so generated bundles remain mandatory only for conventions that declare a `bundleFile`.
- Updated skillpacks package staging and package metadata to publish the social convention assets under `assets/`.

## Verification

- `node scripts/upgrade-alignment-page.mjs --check` - pass.
- `node scripts/skill-convention-bundle-audit.mjs` - pass.
- `npm --workspace packages/skillpacks run test:node` - pass, 130 tests.
- `npm --workspace packages/skillpacks run build` - pass.
- `npm --workspace packages/skillpacks run build:check` - pass.
- `node scripts/audit-task-docs.mjs` - pass.
- `git diff --check` - pass.

## Notes

- The social conventions are packaged as static runtime assets, not per-skill generated bundles.
- The conventions distinguish platform-official guidance from creator/practitioner norms and require source basis, risk level, claim-safety notes, and publish prechecks for generated BIP content.
- BIP approval still records content decisions only; it does not publish externally.
