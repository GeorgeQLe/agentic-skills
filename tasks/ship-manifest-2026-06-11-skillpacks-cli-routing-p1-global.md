# Ship Manifest — Skillpacks CLI Routing P1 Global Remediation

## User Goal

Execute the next `$exec` step: remediate the 14 P1 global skill install-routing findings so core status, installer, discovery, browsing, and provisioning skills mention the published `npx skillpacks install` route alongside valid in-agent and source-checkout routes.

## Changed Files

- `global/claude/{afps-status,codebase-status,idea-scope-brief,init-agentic-skills,pack,provision-agentic-config,skills}/SKILL.md`
- `global/codex/{afps-status,codebase-status,idea-scope-brief,init-agentic-skills,pack,provision-agentic-config,skills}/SKILL.md`
- Matching `CHANGELOG.md` files for all 14 target skills.
- New archive snapshots under the matching `archive/<old-version>/SKILL.md` directories.
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260610-210336-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p1-global.md`

## Per-File Purpose

- Active P1 `SKILL.md` files: preserve runner-specific `/pack` or `$pack` routes and add package-consumer `npx skillpacks install <pack-or-skill>` alternatives.
- Changelogs and archive snapshots: satisfy skill versioning for every active skill behavior/content change.
- Skills Showcase generated assets: publish the new versions and source fingerprints for the changed active skills.
- Prompt/history/todo/manifest files: record the invocation, review notes, validation, and next P2 batch plan.

## User-Goal Mapping

The 14 P1 paths no longer appear in `scripts/skill-install-routing-audit.sh --report`. The remaining install-routing findings are non-P1 debt intentionally deferred to the P2/P3 remediation sequence.

## Tests Run

- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- `rg 'global/(claude|codex)/(afps-status|codebase-status|idea-scope-brief|init-agentic-skills|pack|provision-agentic-config|skills)/SKILL.md' /tmp/skill-install-routing-report.txt` returned no matches.
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
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 206 non-P1 findings)
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

Full layer1 was not rerun because the changed behavior is limited to active skill install-routing text plus generated showcase metadata; the focused scanner layer1 test, active report gate, archive/version/dependency audits, generated-data validation, and production build cover the affected contracts.

## Adversarial Review

- Confirmed the targeted report grep returns no P1 global paths.
- Reviewed generated Skills Showcase diffs: only expected versions and fingerprints changed for the 14 P1 global skills.
- Scanned curated Skills Showcase source/docs for affected hardcoded skill versions or route wording; no manual copy, catalog grouping, workflow animation text, or proof receipt updates were needed.
- Removed an unrelated `apps/skills-showcase/next-env.d.ts` build-mode side effect from the diff before shipping.

## Residual Risk

`scripts/skill-install-routing-audit.sh --active` remains intentionally red with 206 non-P1 findings across P2/P3 skill buckets. The next planned batch handles the first P2 bucket under `packs/agent-work-admin`.

## Rollback Note

Revert the shipping commit to restore the prior P1 active skill text, generated showcase fingerprints, task docs, and prompt/history artifacts. Archive snapshots can remain harmless, but a full rollback should also remove the new archive directories if the active version bumps are reverted.

## Next Command

`$exec`
