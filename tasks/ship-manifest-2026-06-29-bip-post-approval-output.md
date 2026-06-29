# Ship Manifest - 2026-06-29 - BIP Post-Approval Output

## User Goal

Refactor BIP from a pre-final Stage 2 alignment approval gate into a post-confirmation HTML artifact generated after approved canonical markdown is written.

## Changed Files

- Canonical conventions: `docs/alignment-page-convention.md`, `docs/social-post-convention.md`, `docs/social-video-content-convention.md`.
- Skill behavior: `base/{claude,codex}/idea-scope-brief/SKILL.md`, `packs/exec-loop/{claude,codex}/ship-end/SKILL.md`, plus changelogs and archived prior SKILL.md versions.
- Generated bundles: regenerated generator-owned `ALIGNMENT-PAGE.md` files across `base/**` and `packs/**`.
- Audit/tests: `scripts/audit-alignment-pages.mjs`, focused layer1 tests, and `packages/skillpacks/test/package-boundary.test.mjs`.
- Generated package/catalog data: `packages/skillpacks/dist/skillpacks-manifest.json`, `exports/skills-catalog/v1/*`.
- Session/task records: prompt log, `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and this manifest.

## User-Goal Mapping

- `alignment/bip-{skill-name}.html` is now the required BIP path after confirmed canonical artifact writes.
- BIP pages are review/help artifacts only and do not publish, write social-ledger records, mutate canonical artifacts, or add a separate approval gate.
- BIP candidates must cover every bundled text/community and video channel, with recommendation status, notes, source basis, claim-safety, risk, publish precheck, and loaded convention path.
- `alignment.bip_platforms` remains supported only as optional ranking/prioritization metadata.
- `idea-scope-brief` keeps the one-time prompt and schedules post-confirmation `alignment/bip-idea-scope-brief.html` output after canonical `idea-brief.md` writes.

## Verification

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `node --test packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/package-boundary.test.mjs`
- `npm --workspace skillpacks run test:node`
- `pnpm --dir tests test:layer1 -- audit-alignment-pages alignment-gates ship-end-bip social-ledger-convention`
- `npm --workspace skillpacks run build:check`
- `scripts/validate-skills-catalog-export.sh`
- `node packages/skillpacks/bin/skillpacks.mjs alignment verify`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-versions.sh --missing`
- `scripts/base-skill-version-parity-audit.sh`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Skipped Or Substituted Checks

- `npx skillpacks alignment verify` was attempted and failed in this checkout with `sh: gskp: command not found`; the local packaged CLI equivalent `node packages/skillpacks/bin/skillpacks.mjs alignment verify` passed.

## Adversarial Review

- Checked for stale old checkpoint language outside generated bundles and archives.
- Added regression coverage that accepts Stage 2 pages without pre-final BIP checkpoints and fails stale `data-bip-gates` / `data-bip-status` checkpoint pages.
- Sequentially reran package build, package tests, and catalog validation after a parallel verification race touched the ignored package build directory.

## Residual Risk

- Existing active alignment pages contain zero post-confirmation BIP pages, so the new BIP-page audit shape is exercised by fixtures rather than active production pages.

## Rollback Note

Revert this commit to restore the previous Stage 2 BIP checkpoint convention, older audit checks, generated bundles, skill versions, and package/catalog manifests.

## Next Command

`$brainstorm`
