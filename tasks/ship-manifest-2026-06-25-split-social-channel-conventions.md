# Ship Manifest - Split Social Channel Conventions

## Scope

Split the social channel conventions into focused per-channel documents under `docs/social/`, while keeping the top-level text and video convention docs as thin routers and shared contracts.

## Changes

- Added focused text/community convention docs under `docs/social/` for LinkedIn, X, Bluesky, Threads, Mastodon, Reddit, Hacker News, and YouTube Community.
- Added focused video/channel prompt convention docs under `docs/social/` for YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, LinkedIn video, and reusable founder/devtool video prompts.
- Replaced `docs/social-post-convention.md` with a thin router/shared contract that points agents at the selected `docs/social/` channel docs.
- Replaced `docs/social-video-content-convention.md` with a thin router/shared contract that points agents at the selected video channel or prompt-family docs.
- Updated BIP alignment guidance so agents load the top-level router first, then selected channel docs from `docs/social/` or packaged `assets/social/`, and record loaded convention paths in BIP output.
- Regenerated all 306 generated `ALIGNMENT-PAGE.md` bundles.
- Updated skillpacks package staging and npm package metadata to publish `docs/social/` as `assets/social/`.
- Extended package-boundary tests to assert child social convention assets are included in the packaged artifact and that top-level social docs remain routers.

## Verification

- `node scripts/upgrade-alignment-page.mjs` - pass, 306 bundles written.
- `node scripts/upgrade-alignment-page.mjs --check` - pass.
- `node scripts/skill-convention-bundle-audit.mjs` - pass.
- `npm --workspace packages/skillpacks run test:node` - pass, 130 tests.
- `npm --workspace packages/skillpacks run build` - pass.
- `npm --workspace packages/skillpacks run build:check` - pass.
- `node scripts/audit-task-docs.mjs` - pass.
- `git diff --check` - pass.

## Notes

- The registered convention IDs remain `social-post` and `social-video-content`; the per-channel docs are packaged child assets resolved through those routers.
- The split is intended to reduce context load for BIP agents and make future channel refreshes auditable in smaller files.
