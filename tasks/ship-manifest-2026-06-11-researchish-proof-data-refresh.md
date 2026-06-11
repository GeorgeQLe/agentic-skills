# Ship Manifest - Research-ish Validation Record And Proof Data Refresh

## User goal

Complete the `$exec` shipping boundary for the research-ish skill lifecycle audit without leaving generated Skills Showcase proof data stale, and correct the task validation record to include the successful Skills Showcase production build.

## Changed files

- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `tasks/history.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-11-researchish-proof-data-refresh.md`

## Per-file purpose

- `apps/skills-showcase/public/assets/github-proof-data.js`: refreshes the app copy of generated GitHub proof data so its recent history list includes the shipped research-ish lifecycle audit entry.
- `docs/skills-showcase/assets/github-proof-data.js`: refreshes the static docs copy of the same generated proof data.
- `tasks/history.md`: records that the full audit boundary also passed the Skills Showcase production build.
- `tasks/todo.md`: corrects the ship manifest from "app build skipped" to the build actually run after the Vercel deploy-contract check.
- `tasks/ship-manifest-2026-06-11-researchish-proof-data-refresh.md`: records this generated-data and validation-record cleanup boundary separately from the main audit commit.

## User-goal mapping

The main audit implementation was shipped in `629bb9af feat: audit research-ish skill lifecycles`. The deploy-contract check then required a local Skills Showcase production build, and regenerating proof data after the history entry landed picked up the new audit entry. This follow-up ships only the generated proof-data refresh and the corrected validation record.

## Tests run

- `pnpm --dir apps/skills-showcase build` passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` passed and rewrote both proof-data copies.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` passed and reported website-owned generated data is fresh.
- `git diff --check` passed before this manifest was updated; rerun before commit.

## Skipped tests

- Full layer1 was not rerun for this follow-up because this cleanup changes only task records and generated proof data; the main audit boundary already ran the targeted layer1 suites.

## Adversarial review

Diff review confirmed the generated proof-data changes are limited to the deterministic source fingerprint and recent history list. Task-doc changes only correct validation evidence. An unrelated `apps/skills-showcase/next-env.d.ts` typegen flip appeared during validation and was restored before this manifest was finalized.

## Residual risk

Proof-data fingerprints depend on selected repo evidence, including recent history. The proof generator was rerun after the task-history correction so the generated assets match this final follow-up boundary.

## Rollback note

Revert the follow-up proof-data refresh commit to restore the previous generated proof-data fingerprint and recent history list. The main audit implementation commit can be reverted independently if the lifecycle audit itself needs rollback.

## Next command

`$exec`
