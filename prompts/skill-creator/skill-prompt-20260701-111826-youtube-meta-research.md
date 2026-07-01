---
skill: skill-creator
agent: codex
captured_at: 2026-07-01T11:18:26-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Create `youtube-meta-research` Skill

## Summary
Add a new `youtube-meta-research` research skill to `youtube-ops` for “current YouTube meta around `@channel`” work. It will accept a channel handle/URL, discover the relevant peer and search surfaces, detect breakout/outlier videos, extract topic/packaging/format patterns, and produce an evidence-backed opportunity map with `exploit / avoid / counter-position` recommendations. Also update the `$youtube` router with a `--meta <channel>` route/play.

## Key Changes
- Create mirrored skill directories under `packs/youtube-ops/codex/youtube-meta-research/` and `packs/youtube-ops/claude/youtube-meta-research/`.
- New `SKILL.md` frontmatter:
  - `name: youtube-meta-research`
  - `type: research`
  - `version: v0.0`
  - `required_conventions: [alignment-page]`
  - `argument-hint: "<channel URL or @handle> [--count N] [--peer-limit N] [--query-limit N] [--window 30|90|180|365]"`
  - `context_intake: artifact_only`
  - `visual_tier: visual`
- Skill workflow:
  - Use the existing YouTube report-first approval gate and staged research workflow.
  - Stage 1 proposes scope, source plan, output paths, peer/search discovery limits, assumptions, and approval questions.
  - Stage 2 performs approved public research using available repo evidence, `yt-dlp` public metadata, transcript availability via local `.venv`/`youtube-transcript-api` when needed, dated YouTube search observations, and user-supplied owner analytics only when explicitly provided.
  - Stage 3 writes approved canonical output to `research/youtube/meta-research-<slug>-YYYY-MM-DD.md`.
- Output sections:
  - Evidence coverage and capture limits
  - Channel baseline
  - Peer and adjacent surface map
  - Search/query observation log
  - Breakout/outlier video table
  - Current meta patterns: topics, packaging, formats, cadence, discovery mode
  - Opportunity map: exploit / avoid / counter-position
  - Recommended next content moves
  - Evidence gaps and private-data boundaries
- Constraints:
  - Do not infer private Studio metrics, CTR, retention, revenue, subscriber conversion, or profitability from public evidence.
  - Do not bypass login walls, bot protections, access controls, or private YouTube Studio data.
  - Date every search/ranking observation and state personalization/geography/account caveats.
  - Translate patterns into differentiated recommendations; do not recommend copying creators.

## Router And Pack Updates
- Update mirrored `$youtube` router skills:
  - Archive current `youtube/SKILL.md` with `scripts/skill-archive.sh` for both Codex and Claude.
  - Bump router version from `v0.3` to `v0.4`.
  - Add a “Meta research” intent row for prompts like “current meta,” “what is working now,” “find opportunities for @channel,” “breakout patterns,” and “what should this channel exploit/avoid.”
  - Add Mode G: `--meta <channel>`, recommending or queueing `$youtube-meta-research <channel>`.
  - Update router copy from “14 standalone youtube-ops skills” to “15 standalone youtube-ops skills.”
- Update `packs/youtube-ops/PACK.md` default flow and skill list to include `youtube-meta-research` between peer/search intelligence and downstream programming.
- Add `CHANGELOG.md` for the new skill in both mirrors.
- Update router `CHANGELOG.md` files with the `v0.4` route addition.
- Generate alignment bundles by running `node scripts/upgrade-alignment-page.mjs` after the new skill exists.
- Refresh generated catalog/package/showcase artifacts only where repo validation or existing generation scripts require it.

## Implementation Sequence
- First mutation: capture the visible user invocation prompt under `prompts/skill-creator/` because this is a skill-creation invocation.
- Update `tasks/roadmap.md` with the full implementation plan and `tasks/todo.md` with the current phase checklist before editing skill files.
- Scaffold the new mirrored skill directories manually from the nearest YouTube research skill pattern; do not use `init_skill.py` because this repo does not contain that script and the local pack pattern does not use `agents/openai.yaml`.
- Write the Codex skill first, then produce the Claude mirror with platform command syntax adjusted (`$skill` vs `/skill`) while keeping shared sections equivalent.
- Run the alignment generator and inspect only expected new/updated alignment files.
- Update router, pack docs, changelogs, and any generated catalog assets required by validation.
- Add a review/results section to `tasks/todo.md`.
- Commit and push all intended tracked changes on `master`.

## Test Plan
- Static and convention checks:
  - `git diff --check`
  - `scripts/skill-archive-audit.sh --strict`
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `./scripts/skill-mirror-parity-audit.sh`
  - `node scripts/researchish-skill-lifecycle-audit.mjs`
  - `scripts/skill-install-routing-audit.sh --active`
  - `npm run skillpacks:verify`
- Spot checks:
  - Confirm `rg "youtube-meta-research" packs/youtube-ops docs packages` shows the new skill in expected pack/router/catalog surfaces.
  - Confirm `scripts/pack.sh which youtube-meta-research` locates the new skill.
  - Read both new `SKILL.md` files and verify output paths, staged approval gates, evidence boundaries, and next-step routing are internally consistent.
  - Confirm final `git status --short` is clean after commit and push.

## Assumptions
- New skill version starts at `v0.0`; no archive is needed for the new skill.
- Router behavior change is substantive, so both router mirrors require archive, version bump, and changelog update.
- The new skill belongs in `packs/youtube-ops`, not `creator-foundation` or `remotion`.
- No reusable script is created in v0 unless implementation reveals repeated deterministic metadata/search-log handling that is safer as code than prose.
- The skill remains a standalone research skill, not a Pattern A self-advancing framework orchestrator.
