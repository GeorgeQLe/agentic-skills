# Ship Manifest - P1 Docs Remediation Pass

## User Goal

Run `$exec remediation pass for the P1 docs issues` from the 2026-06-10 repository documentation alignment audit.

## Changed Files

- `prompts/exec/skill-prompt-20260610-193906-remediation-p1-docs.md`
- `scripts/init-agentic-skills.sh`
- `README.md`
- `docs/QUICKSTART.md`
- `docs/troubleshooting.md`
- `docs/scripts-reference.md`
- `docs/codex-workflow.md`
- `docs/pack-workflow-matrix.md`
- `docs/decks.md`
- `docs/skillpacks-npm-distribution.md`
- `research/skills-showcase/idea-brief.md`
- `specs/skills-showcase/user-flow-deck-creation.md`
- `alignment/canonical-workflow-report.html`
- `alignment/user-flow-map-deck-creation.html`
- `alignment/idea-scope-brief-npm-distribution.html`
- `alignment/index.html`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-p1-docs-remediation.md`

## Per-File Purpose

- `prompts/exec/...`: captured the visible skill invocation and pasted skill context required by repo prompt-history rules.
- `scripts/init-agentic-skills.sh`: adds the documented root helper path by delegating to the bundled init-agentic-skills launcher.
- `README.md`, `docs/QUICKSTART.md`, `docs/troubleshooting.md`, `docs/scripts-reference.md`: fix public setup wording so track-latest installs are managed copies/directories and pinned archive installs are the symlink case.
- `docs/codex-workflow.md`, `docs/pack-workflow-matrix.md`, `research/skills-showcase/idea-brief.md`, `specs/skills-showcase/user-flow-deck-creation.md`: replace retired executable `icp` route handoffs with `customer-discovery`.
- `docs/decks.md`, `docs/skillpacks-npm-distribution.md`: remove adjacent post-publication/release-candidate wording while the current npm docs were in scope.
- `alignment/canonical-workflow-report.html`, `alignment/user-flow-map-deck-creation.html`: update indexed route examples and visibly mark the 2026-06-10 amendments at the changed content.
- `alignment/idea-scope-brief-npm-distribution.html`, `alignment/index.html`: label the old npm strategy page as historical/superseded for package usage and route current usage to the walkthrough.
- `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, this manifest: record execution, validation, and next-step state.

## User-Goal Mapping

- Managed-copy wording P1: fixed in Quickstart, troubleshooting, scripts reference, and README-adjacent setup surfaces.
- Missing root init helper P1: fixed by adding `scripts/init-agentic-skills.sh` and smoke-testing `status`/`doctor`.
- Retired `icp` route P1: fixed in scoped current docs/specs/indexed pages named by the audit.
- Old npm strategy page P1: fixed by adding page-level and index-level historical/superseded labels pointing to the current walkthrough.

## Tests Run

- `rg -n --pcre2 '(^|[^A-Za-z0-9_.-])(\\$icp|/icp)(?![A-Za-z0-9_.-])|next_skill: /icp|icp ->|icp -&gt;|business-discovery: icp|Proceed to ICP|icp-needed' README.md docs/codex-workflow.md docs/pack-workflow-matrix.md research/skills-showcase/idea-brief.md specs/skills-showcase/user-flow-deck-creation.md alignment/canonical-workflow-report.html alignment/user-flow-map-deck-creation.html` — exit 1, expected empty result.
- `rg -n 're-symlink|re-symlinks|symlinks the global|global core skills.*symlink|global skills.*symlink' docs/QUICKSTART.md docs/troubleshooting.md docs/scripts-reference.md README.md` — exit 1, expected empty result.
- `rg -n 'after publication|After the first public package|before the public npm package|release candidate' docs/QUICKSTART.md README.md docs/decks.md docs/skillpacks-npm-distribution.md` — exit 1, expected empty result.
- `rg -n 'historical / superseded|Current usage reference|Historical npm Distribution Strategy|superseded for package usage|Skillpacks npm Package Walkthrough' alignment/idea-scope-brief-npm-distribution.html alignment/index.html docs/skillpacks-npm-distribution.md` — found expected page/index/current-reference labels.
- `bash -n scripts/init-agentic-skills.sh` — passed.
- `scripts/init-agentic-skills.sh status` — passed and resolved the checkout.
- `scripts/init-agentic-skills.sh doctor` — resolved the new root wrapper and reported pre-existing stale global installs, exiting 1 as expected for this machine state.
- `HOME=/tmp/agentic-skills-init-smoke scripts/init-agentic-skills.sh doctor` — passed, proving the wrapper exits cleanly when no stale installs exist.
- `node scripts/audit-alignment-pages.mjs` — passed: 45 active pages, exact TTS, metadata, viewport, embed, and index integrity.
- `node scripts/upgrade-alignment-page.mjs --check` — passed: 284 ownable bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` — passed 14/14 tests.
- `git diff --check` — passed.

## Skipped Tests

- Full layer1 suite was skipped because this pass changed documentation, indexed alignment pages, and one thin launcher wrapper. The focused alignment-page test plus wrapper syntax/smoke checks cover the changed executable and rendered-doc surfaces without spending a full-suite run on unrelated contracts.
- Published npm smoke was skipped because no npm package implementation or generated package artifact changed.
- Browser-open visual smoke was skipped because alignment-page structural validation is the required repo gate for direct HTML edits; no layout-specific visual design was introduced.

## Adversarial Review

Method: changed-file self-review plus targeted scans, justified because the active multi-agent tool contract only allows spawning subagents when the user explicitly requests sub-agents, and no `quality-sweep` skill is available in this session. Review questions:

- Could the new wrapper resolve the wrong root? It delegates to the bundled launcher, which resolves the repo root and was proven by `status` plus isolated `doctor`.
- Could `doctor` failure mean the wrapper is broken? No; real-home output shows existing stale global installs after successful resolution, and isolated-home `doctor` exits 0.
- Could route replacement over-edit artifact references? The edits target executable route examples; `enterprise-icp` and `research/icp.md` artifact references remain intact.
- Could the old npm page still look current? The page status, top callout, and index card now all say historical/superseded and point to the current walkthrough.
- Could direct HTML edits violate alignment-page rules? Active-page audit and focused layer1 alignment tests pass, and visible amendment markers were added near changed page content.

Findings fixed during review: added visible amendment markers to edited alignment-page sections; added the isolated-home `doctor` smoke after the real-home command exposed unrelated drift; folded adjacent npm publication wording that was still stale in the same public-doc surfaces.

## Residual Risk

Remaining risk is limited to docs not in the P1 shipping boundary that still contain historical `icp` or symlink terminology. The targeted scans intentionally scoped to current public docs/pages named by the audit, not archives, changelogs, old task manifests, or artifact-path references. The next queued step covers the remaining P2 count drift, not further P1 route/setup fixes.

## Rollback Note

Revert the shipping commit to restore the previous docs and remove the root wrapper. If only the wrapper causes trouble, remove `scripts/init-agentic-skills.sh` and update docs to prefer the bundled helper path instead.

## Next Command

`$exec`
