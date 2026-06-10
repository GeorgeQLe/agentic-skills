# Ship Manifest - P2 Skills Showcase Count Reconciliation

## User Goal

Run `$exec` for the next incomplete task: reconcile remaining P2 Skills Showcase count documentation drift from the 2026-06-10 repo documentation alignment audit.

## Changed Files

- `prompts/exec/skill-prompt-20260610-194752-exec.md`
- `scripts/generate-skillmap-excalidraw.mjs`
- `docs/skillmap.excalidraw`
- `alignment/skillmap.html`
- `tasks/pack-card-hierarchy.md`
- `apps/skills-showcase/docs/deck-builder-ux.md`
- `research/skills-showcase/idea-brief.md`
- `research/skills-showcase/idea-brief-interview.md`
- `alignment/idea-scope-brief-skills-showcase.html`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skills-showcase-count-reconciliation.md`

Excluded dirty worktree paths present before shipping this boundary:

- `.claude/skills/skill-interview/SKILL.md`
- `.codex/skills/skill-interview/SKILL.md`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/benchmark-results-matrix.md`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `packs/product-design/claude/ui-interview/CHANGELOG.md`
- `packs/product-design/claude/ui-interview/SKILL.md`
- `packs/product-design/codex/ui-interview/CHANGELOG.md`
- `packs/product-design/codex/ui-interview/SKILL.md`
- `packs/product-design/claude/ui-interview/archive/v0.12/`
- `packs/product-design/codex/ui-interview/archive/v0.12/`
- `prompts/session-triage/skill-prompt-20260610-194335-ui-interview-manifest-visibility.md`
- `prompts/targeted-skill-builder/skill-prompt-20260610-ui-interview-manifest-visibility-gate.md`
- `prompts/ui-interview/`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260610-194752-exec.md`: visible prompt capture for the `$exec` invocation.
- `scripts/generate-skillmap-excalidraw.mjs`: computes current generated Skills Showcase inventory counts from `apps/skills-showcase/public/assets/skills-data.js` and labels the structural map scope separately.
- `docs/skillmap.excalidraw`: regenerated skill-map source with current count labels.
- `alignment/skillmap.html`: regenerated indexed alignment page with current generated count summaries and explicit map-scope wording.
- `tasks/pack-card-hierarchy.md`: labels the old seven-set/157-card map as historical prototype scope and records current generated inventory counts.
- `apps/skills-showcase/docs/deck-builder-ux.md`: updates SEO/count wording to the current 373 platform entries and 190 unique mirrored skill cards.
- `research/skills-showcase/idea-brief.md`: separates current generated inventory counts from historical prototype assumptions.
- `research/skills-showcase/idea-brief-interview.md`: updates source context and replaces the stale `/icp` handoff with `/customer-discovery`.
- `alignment/idea-scope-brief-skills-showcase.html`: mirrors the current count terms and retired-route correction in the indexed idea brief page.
- `tasks/todo.md`: marks the P2 step and acceptance criteria complete with validation notes.
- `tasks/roadmap.md`: marks the P2 roadmap checklist complete.
- `tasks/history.md`: records the shipped P2 reconciliation.
- `tasks/ship-manifest-2026-06-10-skills-showcase-count-reconciliation.md`: quality-gate evidence for this exact boundary.

## User-Goal Mapping

- Count drift is resolved by making generated inventory counts the current source of truth across scoped docs and pages.
- Historical 157/38/seven-set references remain only where labeled as prototype display-card scope.
- Generated skill-map artifacts now explain the distinction between generated platform inventory and the structural Claude-root map.
- The visible `$exec` invocation, task closure, history, and manifest satisfy the project shipping workflow for this mutation.

## Tests Run

- `node --check scripts/generate-skillmap-excalidraw.mjs` - passed.
- `node scripts/generate-skillmap-excalidraw.mjs` - passed; regenerated `docs/skillmap.excalidraw` and `alignment/skillmap.html`; reported 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, and 41 active packs.
- `rg -n "156 pack skills|157 skills|157 unique|38 packs|38 pack|Skill cards across all sets|across 7 sets" tasks/pack-card-hierarchy.md alignment/skillmap.html apps/skills-showcase/docs/deck-builder-ux.md research/skills-showcase/idea-brief.md research/skills-showcase/idea-brief-interview.md alignment/idea-scope-brief-skills-showcase.html` - clean after edits.
- `rg -n "(/|\\$)icp\\b|then /icp|run <code>/icp" alignment/idea-scope-brief-skills-showcase.html research/skills-showcase/idea-brief-interview.md research/skills-showcase/idea-brief.md apps/skills-showcase/docs/deck-builder-ux.md tasks/pack-card-hierarchy.md` - clean.
- `node scripts/audit-alignment-pages.mjs` - passed; 45 active pages, exact TTS include, page metadata, viewport meta, embed prohibition, and index integrity.
- `node scripts/upgrade-alignment-page.mjs --check` - passed; 284 generated bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` - passed; 14/14 tests.
- `git diff --check` - passed.

## Skipped Tests

- Full Skills Showcase app build was not run because this boundary did not change app runtime code, app generated data assets, package metadata, or route behavior; it changed documentation, alignment HTML, an Excalidraw map artifact, and the skill-map generator. Dirty generated data assets currently in the worktree belong to the excluded `ui-interview` version-bump work and are not part of this shipping boundary.
- Full layer1 suite was not rerun because the touched executable surface is the skill-map generator and the directly relevant alignment-page gate passed through the focused layer1 test.
- Production deploy was not run. `tasks/deploy.md` targets the live Vercel Skills Showcase and production deploys require explicit user confirmation; this `$exec` scope shipped documentation/generator reconciliation only.

## Adversarial Review

- Reviewed changed count-bearing files against generated data terms to ensure current inventory counts are not mixed with historical prototype display-card counts.
- The first regeneration attempt exposed a stale `totalPacks` reference in the generator; fixed it and reran syntax, regeneration, scans, and alignment validation.
- A lingering unlabeled historical count phrase in `tasks/pack-card-hierarchy.md` was reworded before the final stale-count scan.
- Targeted route scan caught the same scoped files for retired `/icp` handoffs; the stale idea-brief handoff now points to `/customer-discovery`.
- No unresolved review findings remain for this boundary.

## Residual Risk

- `scripts/generate-skillmap-excalidraw.mjs` now parses `apps/skills-showcase/public/assets/skills-data.js` assuming the current `window.SKILLS_SHOWCASE_DATA = ...;` assignment shape. The generator was exercised against the current file, but future data-file schema changes may require a generator update.
- Existing unrelated dirty worktree changes remain outside this commit boundary and may need separate review before they can be shipped.

## Rollback Note

Revert the shipping commit for this manifest. If only the generated map artifacts need rollback, restore `scripts/generate-skillmap-excalidraw.mjs`, then rerun `node scripts/generate-skillmap-excalidraw.mjs` from the restored version to regenerate `docs/skillmap.excalidraw` and `alignment/skillmap.html`.

## Next Command

`$brainstorm`
