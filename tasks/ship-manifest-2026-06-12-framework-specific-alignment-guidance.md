# Ship Manifest - Framework-Specific Alignment Guidance

## User Goal

Implement the inherited plan to populate generated delegated-framework `ALIGNMENT-PAGE.md` guidance with framework-specific research focus, review/documentation format, and suggested user feedback instructions, using the generator path instead of hand-editing generated bundles.

## Ship Status

Not shipped. Implementation and verification are complete, but no commit or push was made because this checkout contains a broad pre-existing dirty tree with unrelated user-owned work interleaved in generator, test, generated bundle, skill metadata, archive, prompt-history, and showcase files. The safe commit boundary cannot be proven from this working tree.

## Intended Changed Files

- `prompts/exec/skill-prompt-20260612-130708-framework-specific-alignment-guidance.md`
- `scripts/upgrade-alignment-page.mjs`
- `tests/layer1/alignment-gates.test.ts`
- `tests/layer1/positioning-alignment-contract.test.ts`
- `packs/business-research/claude/competitive-analysis/frameworks/feature-pricing-matrix/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/competitive-analysis/frameworks/porter-five-forces/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/competitive-analysis/frameworks/strategic-group-map/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/competitive-analysis/frameworks/swot/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/competitive-analysis/frameworks/feature-pricing-matrix/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/competitive-analysis/frameworks/porter-five-forces/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/competitive-analysis/frameworks/strategic-group-map/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/competitive-analysis/frameworks/swot/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/customer-discovery/frameworks/five-rings/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/customer-discovery/frameworks/four-forces/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/customer-discovery/frameworks/jtbd-needs/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/customer-discovery/frameworks/pmf-engine/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/customer-discovery/frameworks/seven-dimensions/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/customer-discovery/frameworks/w3-hypothesis/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/customer-discovery/frameworks/five-rings/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/customer-discovery/frameworks/four-forces/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/customer-discovery/frameworks/jtbd-needs/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/customer-discovery/frameworks/pmf-engine/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/customer-discovery/frameworks/seven-dimensions/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/customer-discovery/frameworks/w3-hypothesis/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/positioning/frameworks/category-design/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/positioning/frameworks/jtbd-positioning/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/positioning/frameworks/moore-positioning/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/positioning/frameworks/obviously-awesome/ALIGNMENT-PAGE.md`
- `packs/business-research/claude/positioning/frameworks/strategic-canvas/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/positioning/frameworks/category-design/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/positioning/frameworks/jtbd-positioning/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/positioning/frameworks/moore-positioning/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/positioning/frameworks/obviously-awesome/ALIGNMENT-PAGE.md`
- `packs/business-research/codex/positioning/frameworks/strategic-canvas/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/customer-journey-canvas/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/experience-map/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/jtbd-timeline/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/service-blueprint/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/user-story-map/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/customer-journey-canvas/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/experience-map/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/jtbd-timeline/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/service-blueprint/ALIGNMENT-PAGE.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/user-story-map/ALIGNMENT-PAGE.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-12-framework-specific-alignment-guidance.md`

## Per-File Purpose

- `prompts/exec/...`: captures the visible inherited-plan invocation required by the prompt-history convention.
- `scripts/upgrade-alignment-page.mjs`: adds exact framework-subskill translations, visual-tier treatment for known frameworks, and broader fallback translations for unknown framework subskills.
- `tests/layer1/alignment-gates.test.ts`: asserts all targeted delegated frameworks contain specific translation headings, research focus, review/documentation format, suggested feedback, framework-specific snippets, no generic fallback text, and visual-tier guidance.
- `tests/layer1/positioning-alignment-contract.test.ts`: updates stale `business-discovery` paths to `business-research` and accepts the current generated YAML-contract heading shape.
- Targeted `ALIGNMENT-PAGE.md` bundles: regenerated output proving known delegated frameworks receive specific review-page guidance from the generator.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, and this manifest: planning, review, and handoff records.

## User-Goal Mapping

- Generator changes satisfy the requirement to use the source generator path rather than hand-editing generated bundles.
- Exact framework guidance satisfies the requirement that each known framework cover research focus, documentation/review format, and suggested user feedback.
- Fallback translations preserve useful parent behavior for unknown `invocation: sub-skill` frameworks.
- Generated bundle refresh and tests prove the delegated pages no longer read like generic research guidance.

## Tests Run

- `node --check scripts/upgrade-alignment-page.mjs` - passed.
- `node scripts/upgrade-alignment-page.mjs` - passed; final output reported `Generated bundles: 294 ownable, exact`.
- `node scripts/upgrade-alignment-page.mjs --check` - passed; final output reported `Generated bundles: 294 ownable, exact`.
- Targeted `rg` scan across `packs/business-research/{claude,codex}/{competitive-analysis,customer-discovery,positioning}/frameworks` and `packs/customer-lifecycle/{claude,codex}/journey-map/frameworks` for `Research focus:`, `Review/documentation format:`, `Suggested user feedback:`, and `fallback translation` - passed; known framework bundles contained required guidance and no fallback translation lines.
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/upgrade-alignment-page-bespoke.test.ts layer1/positioning-alignment-contract.test.ts` - passed, 49 tests.
- `git diff --check -- scripts/upgrade-alignment-page.mjs tests/layer1/alignment-gates.test.ts tests/layer1/positioning-alignment-contract.test.ts tasks/roadmap.md tasks/todo.md tasks/history.md tasks/ship-manifest-2026-06-12-framework-specific-alignment-guidance.md prompts/exec/skill-prompt-20260612-130708-framework-specific-alignment-guidance.md packs/business-research packs/customer-lifecycle` - passed.

## Skipped Tests

- `npm run skillpacks:build` and package verification were skipped because package output is not part of the intended source-only framework guidance boundary. The current dirty tree already includes broad unrelated metadata, generated-data, archive, and skill changes; running package build from this state could incorporate unrelated work into package artifacts.
- Full layer1 test suite was not rerun in this wrap-up because focused generator/alignment tests covered the changed behavior. Earlier session notes record unrelated broader layer1 failures from stale expectations and unrelated generated-data drift.
- Full-tree `git diff --check` is not green in this checkout because unrelated archive `SKILL.md` files outside this task's boundary have blank-line-at-EOF diagnostics. Those files were not modified for this task.
- No deploy was run. This is a generator/source and generated-doc bundle change, not an application deployment change.

## Adversarial Review

Changed-file self-review plus targeted scans. Failure modes checked:

- Known frameworks accidentally falling through to generic fallback text.
- Missing one of the three required concerns: research focus, review/documentation format, suggested feedback.
- Generated bundle drift after regeneration.
- Stale positioning test paths masking framework coverage.
- Scope growth into package artifacts or deployment output.

Findings fixed: positioning contract tests still referenced `packs/business-discovery`; those assertions now point to `packs/business-research`. The YAML-contract assertion now accepts the current generated `Gate` or `Response` wording.

Accepted residual concern: `scripts/upgrade-alignment-page.mjs`, generated bundles, and layer1 tests contain pre-existing unrelated dirty edits, so a safe commit boundary is blocked until that prior work is separated or intentionally included.

## Residual Risk

- The implementation risk is mainly wording quality or omission in one framework-specific guidance block. The comprehensive framework test and targeted `rg` scan cover the presence of each required section and framework-specific anchor language, but they do not judge editorial quality.
- The shipping risk is high from this checkout because unrelated dirty changes are interleaved in shared files. Committing now would likely ship unrelated work.

## Rollback Note

Before shipping, isolate the intended boundary in a clean worktree or after the pre-existing changes are committed/stashed by their owner. To neutralize this task's source behavior, remove the framework-specific translation map and visual-tier additions from `scripts/upgrade-alignment-page.mjs`, regenerate bundles, and rerun the focused layer1 tests.

## Next Command

`$ship`
