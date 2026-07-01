# Changelog

## v0.4 - 2026-07-01

- Added the `--meta <channel>` route and current-meta intent mapping to recommend or explicitly queue `/youtube-meta-research` workflows.
- Updated the router inventory from 14 to 15 standalone youtube-ops skills.

## v0.3 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.


# youtube Changelog

## v0.2 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.1 - 2026-06-09

- Added routing for the new `/youtube-video-prelaunch-audit` skill.
- Updated the `--launch` play to start with prelaunch readiness review for unlisted or scheduled videos instead of post-release performance audit.
- Added shared creator-media artifact handoff and intent-aware routing sections for router play writes.

## v0.0

- Initial release: intent-based router and play composer for youtube-ops pack
- Mode A: natural language intent detection routing to 13 skills
- Mode B: channel health 5-step play (`--health`)
- Mode C: pre-production concept validation play (`--concept`)
- Mode D: video launch prep play (`--launch`)
- Mode E: competitive intel play (`--intel`)
- Mode F: read-only status scan (`--status`)
- Play approval gate with existing-work protection
- Cross-pack routing for remotion `youtube-format-research`
