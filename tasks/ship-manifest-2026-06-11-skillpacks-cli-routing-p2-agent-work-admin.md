# Ship Manifest — Skillpacks CLI Routing P2 Agent-Work-Admin Remediation

## User Goal

Execute the next `$exec` step: remediate the first P2 `agent-work-admin` skill install-routing bucket so `plan-phase`, `roadmap`, and `spec-drift` mention the published `npx skillpacks install` route alongside valid runner-local routes.

## Changed Files

- `packs/agent-work-admin/claude/{plan-phase,roadmap,spec-drift}/SKILL.md`
- `packs/agent-work-admin/codex/{plan-phase,roadmap,spec-drift}/SKILL.md`
- Matching `CHANGELOG.md` files for all six target skills.
- New archive snapshots under the matching `archive/<old-version>/SKILL.md` directories.
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260610-212655-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-agent-work-admin.md`

## Per-File Purpose

- Active P2 `SKILL.md` files: preserve runner-specific `/pack` or `$pack` routes and add package-consumer `npx skillpacks install <pack-or-skill>` alternatives.
- Changelogs and archive snapshots: satisfy skill versioning for every active skill behavior/content change.
- Skills Showcase generated assets: publish the new versions and source fingerprints for the changed active skills.
- Prompt/history/todo/manifest files: record the invocation, review notes, validation, and next P2 slice plan.

## User-Goal Mapping

The six `agent-work-admin` paths no longer appear in `scripts/skill-install-routing-audit.sh --report`. The remaining install-routing findings are later P2/P3 debt intentionally deferred to the next remediation slices.

## Tests Run

- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- `rg 'packs/agent-work-admin/(claude|codex)/(plan-phase|roadmap|spec-drift)/SKILL.md' /tmp/skill-install-routing-report.txt` returned no matches.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `bash -n scripts/skill-install-routing-audit.sh`
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
- `bash scripts/skill-pack-routing-audit.sh`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 200 remaining non-agent-work-admin findings)
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

Full layer1 was not rerun because the changed behavior is limited to active skill install-routing text plus generated showcase metadata; the focused scanner layer1 test, active report gate, archive/version/dependency audits, generated-data validation, generated-bundle drift check, and production build cover the affected contracts.

## Adversarial Review

- Confirmed the targeted report grep returns no `agent-work-admin` target paths.
- Reviewed active skill diffs to verify the changes are limited to version bumps and npm-aware install-route wording.
- Reviewed generated Skills Showcase diffs: only expected versions and fingerprints changed for the six target skills.
- Scanned non-generated Skills Showcase source/docs for hardcoded `plan-phase`, `roadmap`, `spec-drift`, or affected version copy; no curated manual copy, catalog grouping, workflow animation text, or proof receipt updates were needed.
- Removed an unrelated `apps/skills-showcase/next-env.d.ts` build-mode side effect from the diff before shipping.

## Residual Risk

`scripts/skill-install-routing-audit.sh --active` remains intentionally red with 200 findings across later P2/P3 skill buckets. The next planned slice handles top-level `business-discovery` skills before nested framework skills.

## Rollback Note

Revert the shipping commit to restore the prior P2 active skill text, generated showcase fingerprints, task docs, and prompt/history artifacts. Archive snapshots can remain harmless, but a full rollback should also remove the new archive directories if the active version bumps are reverted.

## Next Command

`$exec`
