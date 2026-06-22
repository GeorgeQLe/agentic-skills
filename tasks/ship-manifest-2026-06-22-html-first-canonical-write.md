# Ship Manifest - HTML-First Canonical Write Contract

## User Goal

Tighten `state-model` and `ux-variations` so Markdown intermediates remain allowed as chunk cursors, but canonical `design/**` Markdown/YAML writes, flow-tree updates, glossary writes, and archive cleanup happen only after the HTML alignment page is reviewed and confirmed.

## Changed Files

- `docs/design-tree-loop-convention.md`: adds the HTML-first canonical write rule.
- `docs/design-loop-intra-skill-audit.md`: aligns older explanatory audit wording with the stricter rule.
- `packs/product-design/**/DESIGN-TREE-LOOP.md` and `packs/product-testing/**/DESIGN-TREE-LOOP.md`: regenerated bundles from the canonical convention.
- `packs/product-design/{codex,claude}/state-model/SKILL.md`: bumped to `v0.5`; synthesis now assembles proposed review content before approval.
- `packs/product-design/{codex,claude}/state-model/archive/v0.4/SKILL.md`: archived prior active contracts.
- `packs/product-design/{codex,claude}/state-model/CHANGELOG.md`: documents `v0.5`.
- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`: bumped to `v0.25`; chunked assembly now assembles proposed review content before approval.
- `packs/product-design/{codex,claude}/ux-variations/archive/v0.24/SKILL.md`: archived prior active contracts.
- `packs/product-design/{codex,claude}/ux-variations/CHANGELOG.md`: documents `v0.25`.
- `tests/layer1/product-design-flow-tree.test.ts`: adds regression coverage for HTML-first proposed content and approval-gated canonical writes.
- `docs/skills-showcase/assets/*`, `apps/skills-showcase/public/assets/*`, `docs/benchmark-results-matrix.md`: regenerated showcase data.
- `packages/skillpacks/dist/skillpacks-manifest.json`: regenerated package manifest.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`: task tracking and review record.
- `prompts/exec/skill-prompt-20260621-232039-html-first-canonical-write.md`: prompt history for the `exec` skill invocation.

## Per-File Purpose

- Convention and generated bundles make HTML-first canonical writes part of the distributable design-tree contract.
- Active skill contracts apply the rule to the concrete `state-model` and `ux-variations` assemble/approval paths.
- Archives and changelogs satisfy skill versioning.
- Tests prevent future wording drift that writes canonical docs/YAML or flow-tree entries before approval.
- Generated assets keep website/package metadata in sync with active skill versions.

## User-Goal Mapping

- `_working/` and per-unit intermediates remain pre-approval cursors.
- Final assembled deliverables are explicitly proposed review content until rendered in alignment HTML.
- `state-model` canonical doc/YAML, `model_ref`, `model_tree_ref`, glossary writes, and cleanup are approval-gated.
- `ux-variations` final plan, interview log, flow-tree `ux_variations[]`, and cleanup are approval-gated.

## Tests Run

- `node scripts/upgrade-design-tree-loop.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `pnpm --dir tests exec vitest run layer1/product-design-flow-tree.test.ts layer1/skill-alignment-routing-audit.test.ts layer1/frontmatter.test.ts` — 1106 passing tests.
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `git diff --check`

## Skipped Tests

- No full repository Vitest/build suite was run; the change is skill-contract/documentation/package metadata scoped, and the requested focused Layer 1 tests plus package/showcase audits cover the affected behavior.

## Adversarial Review

- Checked for stale active wording that still says `state-model` writes canonical docs before approval or `ux-variations` initializes flow-tree entries during setup; active-source scan is clean except negative test assertions.
- Found and fixed stale non-contract audit wording that still said chunked UX assembly writes a single canonical doc and initializes flow-tree entries.
- Caught an index-generation risk: showcase/package generators read staged index content. Regenerated again after staging intended sources, then verified metadata reports `state-model v0.5` and `ux-variations v0.25`.

## Residual Risk

- The stricter contract is wording/test enforced, not schema enforced. That is appropriate because the request clarifies timing around existing gates without adding a new schema or alignment gate.

## Rollback Note

Revert this commit to restore the previous design-tree convention, active skill contracts, generated bundles/data, and tests. The archived `v0.4` and `v0.24` snapshots provide direct comparison points for the two changed skills.

## Next Command

`$brainstorm`
