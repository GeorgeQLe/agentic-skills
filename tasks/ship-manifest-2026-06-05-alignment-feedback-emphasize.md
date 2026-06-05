# Ship Manifest - Alignment Feedback Emphasize

## User Goal

Change HTML alignment-page section feedback so the positive feedback option is `emphasize`, meaning the user wants the agent to add weight, prominence, evidence, detail, or recommendation emphasis to the section or named point. It must not mean "approved" or "accept as-is".

This wraps the visible `$investigate` request and the later `$ship-end` session close-out.

## Changed Files

Included in the main ship boundary:

- `docs/alignment-page-convention.md`
- Owned generated `ALIGNMENT-PAGE.md` bundles under `global/**` and `packs/**`, produced from the canonical convention by `scripts/upgrade-alignment-page.mjs`
- New generated bundle `packs/business-ops/codex/product-line/ALIGNMENT-PAGE.md`
- Bespoke inline alignment skills with version bumps, changelogs, and archives:
  - `packs/agent-work-admin/{claude,codex}/roadmap/`
  - `packs/product-design/{claude,codex}/{consolidate-variations,prototype,spec-interview,ui-interview,ux-variations}/`
  - `packs/product-testing/{claude,codex}/uat/`
  - `packs/research-admin/{claude,codex}/research-roadmap/`
- Skills Showcase generated data:
  - `docs/skills-showcase/assets/skills-data.js`
  - `apps/skills-showcase/public/assets/skills-data.js`
  - `docs/benchmark-results-matrix.md`
- `tests/layer1/alignment-gates.test.ts`
- Prompt/task/history/manifest records:
  - `prompts/investigate/skill-prompt-20260605-002257-alignment-feedback-emphasize.md`
  - `prompts/ship-end/skill-prompt-20260605-002349-ship-end.md`
  - `tasks/roadmap.md`
  - `tasks/todo.md`
  - `tasks/history.md`
  - `tasks/ship-manifest-2026-06-05-alignment-feedback-emphasize.md`

Separated from the main ship boundary:

- `tests/layer1/upgrade-alignment-pages.test.ts` was committed separately as `b07f1d2c` because validation surfaced a stale unrelated expectation (`type: utility` vs the current `type: ops`).
- `prompts/sync/skill-prompt-20260605-001258-sync.md` is a pre-existing unrelated untracked prompt-history file and is intentionally left unstaged.

## Per-File Purpose

- Canonical convention: changes the shared alignment-page contract from `up` / `accept-as-is` semantics to `emphasize` / `add-weight-to-section` semantics.
- Generated bundles: propagate the canonical convention to every generator-owned alignment-producing skill.
- Bespoke skills, changelogs, and archives: update inline alignment contracts that the generator preserves, while satisfying skill versioning rules for active `SKILL.md` behavior changes.
- Generated Skills Showcase assets: keep public catalog fingerprints and displayed versions fresh after active skill metadata changed.
- Alignment-gates test: enforces the new feedback vocabulary and blocks reintroducing `up` / `accept-as-is`.
- Prompt/task/history/manifest files: preserve invocation history, completion state, validation evidence, and quality-gate record.

## User-Goal Mapping

- The canonical convention and all owned bundles ensure newly created alignment pages ask for emphasis requests rather than approvals when the user wants more weight.
- The bespoke skill updates cover alignment producers that do not consume the generated bundle.
- The regression test maps directly to the requested behavior: `feedback: emphasize`, `requested_agent_action: add-weight-to-section`, and no stale approval-as-is positive option.
- Generated catalog refresh prevents the changed skill versions and source fingerprints from leaving stale public data.

## Tests Run

- `node scripts/upgrade-alignment-page.mjs --dry-run` - passed; `Updated: 0`, `Bundled files written: 0`.
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/upgrade-alignment-pages.test.ts` - passed; 2 files, 29 tests.
- `bash scripts/validate-skills-showcase-data.sh` - passed; generated data fresh.
- `bash scripts/skill-archive-audit.sh --strict` - passed; 320 skills checked, 0 violations.
- `bash scripts/skill-mirror-parity-audit.sh` - passed; 145 mirrored pairs checked, 0 failures.
- `bash scripts/skill-pack-routing-audit.sh` - passed; no cross-pack recommendation gaps.
- `bash scripts/skill-versions.sh --missing` - passed; all 376 skills have a version field.
- `pnpm --dir tests bench:coverage` - passed; benchmark coverage matrix valid for 162 skills.
- `git diff --check` - passed.

Previously in the same session, the repo glossary packet was also validated with HTML parser readback, embedded JavaScript syntax, required gate/content checks, `research/glossary.md` absence, and whitespace before commit `6824ddc8`.

## Skipped Tests

- Full app build/test was skipped because this boundary changes alignment skill contracts, generated markdown bundles, task/prompt docs, and generated catalog data, not executable app runtime code. The catalog freshness validator covered the generated app/public asset copies.
- Browser visual checks were skipped because no generated `alignment/*.html` review page was rewritten in this boundary; this changes the convention used by future pages and bundled skill instructions.
- Full benchmark runs were skipped because the risk is contract text/regression coverage, not live-agent benchmark behavior. Focused layer1 tests and skill audits cover the changed surface.

## Adversarial Review

Review method: changed-file self-review, targeted stale-token scans, generator dry-run, focused layer1 regression tests, archive/mirror/routing audits, and generated-data validation.

Findings and outcomes:

- Partial propagation risk: fixed by regenerating bundles and confirming `node scripts/upgrade-alignment-page.mjs --dry-run` reports 0 pending writes.
- Bespoke skill drift risk: fixed by updating inline alignment sections, archiving old versions, bumping versions, and running the strict archive audit plus mirror parity audit.
- Stale catalog risk: fixed by regenerating Skills Showcase data and passing the freshness validator.
- Regression test gap: fixed by adding assertions for `emphasize`, `add-weight-to-section`, revision semantics, and stale `up` / `accept-as-is` removal.
- Unrelated validation failure: fixed separately in `b07f1d2c` so the main boundary does not hide a stale test expectation.

## Residual Risk

Existing historical `alignment/*.html` review pages are not rewritten by this change, so older pages may still display their original feedback controls. That is intentional: the goal is the creation contract for new/updated pages. Existing pages should be upgraded with the alignment-page upgrade workflow only when requested or when a specific page is being revised.

## Rollback Note

Revert the main alignment-feedback commit, then rerun:

```sh
node scripts/generate-skills-showcase-data.mjs
node scripts/generate-skills-showcase-github-data.mjs
bash scripts/validate-skills-showcase-data.sh
```

If the separate stale-test commit is not wanted, revert `b07f1d2c` separately.

## Next Command

Next work is user review of `alignment/repo-glossary-flat-research.html` and feedback-only or final compiled YAML. Recommended route: `$guide` if the user wants a guided manual review flow; otherwise no repository command is needed until YAML is provided.
