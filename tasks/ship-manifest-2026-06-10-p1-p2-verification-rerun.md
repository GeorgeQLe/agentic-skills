# Ship Manifest - P1/P2 Verification Rerun

## User Goal

Run `$exec p1 and p2 again`: rerun the shipped P1 docs remediation and P2 Skills Showcase count reconciliation checks, fixing only confirmed drift.

## Changed Files

- `prompts/exec/skill-prompt-20260610-195448-p1-p2-again.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-p1-p2-verification-rerun.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260610-195448-p1-p2-again.md`: captures the visible `$exec p1 and p2 again` invocation and visible skill context.
- `tasks/todo.md`: records the completed verification-only rerun, results, and deploy decision.
- `tasks/roadmap.md`: records the rerun plan and acceptance criteria.
- `tasks/history.md`: adds a durable summary of the clean P1/P2 rerun.
- `tasks/ship-manifest-2026-06-10-p1-p2-verification-rerun.md`: records the exact shipping boundary and verification evidence.

## User-Goal Mapping

- P1 was rerun by rechecking the root wrapper, scoped route replacements, managed-copy install wording, publication wording, historical npm page labeling, alignment-page integrity, generated bundle drift, focused layer1 coverage, and whitespace.
- P2 was rerun by rechecking the skill-map generator, regenerated count output, scoped stale-count scan, scoped retired-route scan, alignment-page integrity, generated bundle drift, focused layer1 coverage, and whitespace.
- No P1/P2 remediation source or documentation drift was found, so no remediation files changed.

## Tests Run

- `bash -n scripts/init-agentic-skills.sh` - passed.
- `scripts/init-agentic-skills.sh status` - passed and resolved the checkout.
- `HOME=/tmp/agentic-skills-init-smoke-rerun-p1 scripts/init-agentic-skills.sh doctor` - passed with no managed global skill installs found.
- `node --check scripts/generate-skillmap-excalidraw.mjs` - passed.
- `node scripts/generate-skillmap-excalidraw.mjs` - passed; reported 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, 41 active packs, 157 Claude pack roots, and 11 global Claude roots; left no skill-map artifact diff.
- `rg -n --pcre2 '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|next_skill: /icp|icp ->|icp -&gt;|business-discovery: icp|Proceed to ICP|icp-needed' README.md docs/codex-workflow.md docs/pack-workflow-matrix.md research/skills-showcase/idea-brief.md specs/skills-showcase/user-flow-deck-creation.md alignment/canonical-workflow-report.html alignment/user-flow-map-deck-creation.html` - exit 1, expected empty result.
- `rg -n 're-symlink|re-symlinks|symlinks the global|global core skills.*symlink|global skills.*symlink' docs/QUICKSTART.md docs/troubleshooting.md docs/scripts-reference.md README.md` - exit 1, expected empty result.
- `rg -n 'after publication|After the first public package|before the public npm package|release candidate' docs/QUICKSTART.md README.md docs/decks.md docs/skillpacks-npm-distribution.md` - exit 1, expected empty result.
- `rg -n 'historical / superseded|Current usage reference|Historical npm Distribution Strategy|superseded for package usage|Skillpacks npm Package Walkthrough' alignment/idea-scope-brief-npm-distribution.html alignment/index.html docs/skillpacks-npm-distribution.md` - found expected historical/current-reference labels.
- `rg -n '156 pack skills|157 skills|157 unique|38 packs|38 pack|Skill cards across all sets|across 7 sets' tasks/pack-card-hierarchy.md alignment/skillmap.html apps/skills-showcase/docs/deck-builder-ux.md research/skills-showcase/idea-brief.md research/skills-showcase/idea-brief-interview.md alignment/idea-scope-brief-skills-showcase.html` - exit 1, expected empty result.
- `rg -n '(/|\\$)icp\\b|then /icp|run <code>/icp' alignment/idea-scope-brief-skills-showcase.html research/skills-showcase/idea-brief-interview.md research/skills-showcase/idea-brief.md apps/skills-showcase/docs/deck-builder-ux.md tasks/pack-card-hierarchy.md` - exit 1, expected empty result.
- `node scripts/audit-alignment-pages.mjs` - passed: 45 active pages, exact TTS include, metadata, viewport, embed, and index integrity.
- `node scripts/upgrade-alignment-page.mjs --check` - passed: 284 ownable generated bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` - passed 14/14.
- `git diff --check` - passed.

## Skipped Tests

- Full layer1 suite was skipped because this rerun made no source or behavior changes and the focused alignment-page test covers the changed validation surface from P1/P2.
- Skills Showcase app build was skipped because no app runtime code, generated app data, package metadata, or deploy behavior changed.
- Published npm smoke was skipped because no npm package implementation, packaging, or published-package behavior changed.
- Production deploy was skipped because `tasks/deploy.md` targets the Skills Showcase app, while this rerun changed only prompt/task verification artifacts; production deploys require explicit confirmation.

## Adversarial Review

- Checked the original P1 and P2 ship manifests to rerun the same scoped scans instead of relying on noisy broad searches that include historical audit artifacts, lessons, and task history.
- Confirmed the broad `/icp` and symlink scans still contain intentional historical/evidence references, so the scoped no-match scans are the authoritative P1/P2 regression checks.
- Confirmed the skill-map generator rerun did not leave a diff in `docs/skillmap.excalidraw` or `alignment/skillmap.html`.
- Confirmed no P1/P2 remediation source or documentation file needed changes.

## Residual Risk

The rerun is scoped to P1/P2 checks from the shipped manifests. Historical pages, lessons, task history, and audit artifacts still contain old `/icp`, `$icp`, and symlink terminology as context; this is intentional and outside the P1/P2 current-doc remediation boundary.

## Rollback Note

Revert this shipping commit to remove only the rerun prompt/task/history/manifest artifacts. The original P1 and P2 remediation commits are not part of this rollback boundary.

## Next Command

`$brainstorm`
