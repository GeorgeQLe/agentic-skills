# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: YouTube Prelaunch A/B Test And URL Ledger.
Last closeout: YouTube prelaunch Test and Compare launch set plus URL ledger.

## Plan

- [x] Capture the visible skill-update invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current Codex/Claude `youtube-video-prelaunch-audit` skill files, changelogs, archives, and relevant audit scripts.
- [x] Archive current `v0.3` skill files with `scripts/skill-archive.sh`, bump both active mirrors to `v0.4`, and update matching changelogs.
- [x] Require a `Test And Compare Launch Set` containing exactly three simultaneous title/thumbnail pairs, each with full title, thumbnail concept, packaging hypothesis, intended audience signal, and win implication.
- [x] Add URL ledger behavior for per-video `research/youtube/data/<video-id>/prelaunch/video-url-record.json` records and aggregate `research/youtube/data/video-url-index.jsonl`.
- [x] Update report template and final response requirements to include the URL record path and the three Test and Compare pairs.
- [x] Run focused static audits, perform manual mirror/version behavior checks, document results, commit, and push on the primary branch.

## Acceptance Criteria

- Both active skill mirrors are versioned `v0.4`, have archived `v0.3` copies, and have matching changelog entries.
- The skill contract requires exactly three Test and Compare-ready title/thumbnail variants for simultaneous YouTube Studio upload.
- The skill records or updates per-video and aggregate URL ledger artifacts before asking for already-captured context in future runs.
- Report template and final response instructions mention the URL record and the three paired launch variants.
- Focused audits and diff hygiene checks pass, with any blocker documented here.

## Verification Plan

- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `scripts/skill-next-step-routing.sh --missing`
- `git diff --check`
- Manual read of both active skill files for mirror parity, `v0.4`, exact three-pair requirement, URL record/index behavior, and matching changelog/archive state.

## Review - YouTube Prelaunch A/B Test And URL Ledger

### Results

- Updated mirrored Codex and Claude `youtube-video-prelaunch-audit` skills to `v0.4`.
- Archived both prior `v0.3` skill files under each skill's `archive/v0.3/SKILL.md`.
- Added matching `v0.4` changelog entries for the URL ledger and Test and Compare launch-set behavior.
- Added required URL ledger behavior for `research/youtube/data/<video-id>/prelaunch/video-url-record.json` and `research/youtube/data/video-url-index.jsonl`.
- Replaced loose title/thumbnail recommendations with a required `## Test And Compare Launch Set` containing exactly three simultaneous title/thumbnail variants.
- Updated the report template and approved-artifact handoff so final responses include the URL record path and the three Test and Compare pairs.
- Refreshed Skills Showcase generated data/proof assets after validation detected stale source fingerprints.
- Captured the visible skill-update prompt in `prompts/skill-creator/skill-prompt-20260628-185137-youtube-prelaunch-url-ledger.md`.

### Verification

Passed:

- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `scripts/skill-next-step-routing.sh --missing`
- `npm run skillpacks:verify`
- `npm run skills-showcase:validate-data` after regenerating stale showcase data
- `git diff --check`
- Manual normalized diff of active Codex/Claude mirrors after `$youtube` to `/youtube` transform.
- Manual normalized diff of archived `v0.3` Codex/Claude mirrors after `$youtube` to `/youtube` transform.
- `cmp -s` on the mirrored changelogs.
- `rg` readback confirming both active skills are `v0.4`, archives are `v0.3`, both require exactly three variants, both define URL record/index behavior, and old loose packaging language is absent.

Final staged diff, commit, and push verification are part of closeout.
