## Current Implementation - npm Age-Gate Warning Cleanup

### Goal

Stop `update-packages` guidance and benchmark fixtures from recommending package-manager age-gate keys that npm 11 reports as unknown project config, while preserving the 8-day dependency safety policy.

### Scope

- `packs/code-maintenance/{codex,claude}/update-packages/SKILL.md`
- update-packages archives and changelogs
- focused layer1/layer4 benchmark setup expectations for age-gate wording
- task review notes and verification results

### Plan

1. Confirm the warning is not emitted by this repository's current npm project config.
2. Archive the active mirrored `update-packages` contracts before changing behavior.
3. Bump the mirrored skills from `v0.0` to `v0.1`.
4. Replace `.npmrc` age-gate instructions with npm-safe guidance: manual age verification for npm-only projects and persisted pnpm enforcement through project pnpm config such as `minimumReleaseAge: 11520`.
5. Update benchmark prompts, assertions, and retained examples so they no longer require `min-release-age=8` or `minimum-release-age=11520` in `.npmrc`.
6. Run focused layer1 coverage and repository hygiene checks.
7. Commit and push the verified cleanup.

### Acceptance Criteria

- `npm config list` from the repository root emits no unknown project config warning.
- Active `update-packages` skills do not tell agents to write `min-release-age` or `minimum-release-age` into `.npmrc`.
- The benchmark still requires an 8-day update policy and persisted pnpm age-gate coverage where supported.
- Reversed ownership assertions still fail.
- Skill archive/version hygiene passes.

## Current Implementation - Short npm CLI Rename

### Goal

Make `gskp` the short primary npm package and CLI command for G Skillpacks, while preserving `skillpacks` as a compatibility command/alias so existing users and docs do not break immediately.

### Scope

- `packages/skillpacks/package.json` package/bin metadata
- root npm workspace scripts that target the package by name
- package CLI help/error wording where user-facing command names appear
- package tests that assert public npm command examples and metadata
- high-visibility install docs: `README.md`, `docs/skillpacks-npm-distribution.md`, `docs/skills-reference.md`, and routing contract docs
- task review notes and verification results

### Plan

1. Verify the shortest viable npm name. `gsp`, `gsk`, and `skp` are taken; `gskp` returns npm E404 and is the shortest available brand-aligned candidate checked.
2. Rename the public package metadata to `gskp` and expose both `gskp` and `skillpacks` binaries from the same entry point.
3. Keep source directory names, manifest filenames, and compatibility documentation stable unless changing them is required by verification.
4. Update high-visibility docs and tests so `npx gskp ...` is the primary route and `npx skillpacks ...` is documented as compatibility.
5. Run focused package metadata/build/test verification.
6. Commit and push only the intended rename boundary.

### Acceptance Criteria

- `packages/skillpacks/package.json` publishes as `gskp`.
- The package exposes a primary `gskp` binary and a compatibility `skillpacks` binary.
- User-facing quickstart/install examples prefer `npx gskp`.
- Docs explicitly warn that `skillpack` singular is unrelated.
- Package build/check and focused package tests pass.

## Current Implementation - Product Design Flow Tree Artifact Boundaries

### Goal

Move pre-prototype product-design artifacts from `specs/` into a dedicated `design/` phase and add a machine-readable flow-tree manifest contract that tracks user-flow branches, UX variation branches, and UI branch decisions.

### Scope

- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- `packs/product-design/{codex,claude}/prototype/SKILL.md`
- `packs/product-design/{codex,claude}/consolidate-variations/SKILL.md`
- `packs/product-design/{codex,claude}/spec-interview/SKILL.md`
- Product-design changelogs and archives for versioned behavior changes
- New `design/flow-tree.schema.json`
- Focused layer1 tests for artifact boundaries, route parity, and manifest-state ownership
- Task review notes and verification results

### Plan

1. Inspect current product-design contracts, route docs, and layer1 coverage.
2. Record this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
3. Archive current mirrored product-design skill contracts before version bumps.
4. Add `design/flow-tree.schema.json` defining scoped flow-tree manifests.
5. Update `user-flow-map` to write `design/user-flow-*`, initialize `design/flow-tree-*`, and avoid pre-prototype `specs/` output.
6. Update `ux-variations` to read/write `design/ux-variations-*`, expand the flow-tree manifest, and avoid `research/.progress.yaml` for UX branch state.
7. Update `ui-interview` to read/write `design/ui-*`, record approve/reject/retry branch decisions in the design manifest, and preserve `specs/` only for requirements-only or finalized post-prototype specs where appropriate.
8. Keep `spec-interview` output in `specs/` and update upstream read guidance so it can consume `design/` evidence without becoming a design-phase writer.
9. Add layer1 tests for design/spec/research artifact boundaries and mirrored route parity.
10. Run required verification, fix any regressions, then commit and push the verified mutation set.

### Acceptance Criteria

- Pre-prototype `user-flow-map`, `ux-variations`, and default `ui-interview` deliverables write to `design/`, not `specs/`.
- `design/flow-tree.schema.json` defines product-path and flat manifest locations and branch decision state.
- `research/.progress.yaml` remains product-path/product-line tracking only, not UX branch state.
- `spec-interview` still writes finalized production implementation specs to `specs/`.
- Claude and Codex product-design mirrors preserve `user-flow-map -> ux-variations -> ui-interview -> prototype -> consolidate-variations -> spec-interview`.

## Current Investigation - Repository Boundary And Deploy Gating

### Goal

Keep this repository as one repo for now, but make its ownership zones and Vercel deploy boundary explicit enough that skill-source, package, prompt, task, alignment, and archive work do not accidentally imply a Skills Showcase deploy.

### Scope

- Repository boundary audit covering tracked path zones, recent churn, and deploy relevance.
- Skills Showcase deploy contract in `tasks/deploy.md`.
- Vercel ignored-build helper script and focused classifier tests.
- Prompt/task evidence for this `investigate` run.
- No repository split, no history rewrite, and no GitHub Actions changes.

### Plan

1. Capture the visible `investigate` prompt and record this execution plan.
2. Audit tracked files, recent Git churn, Vercel config, and showcase generation/deploy surfaces.
3. Document confirmed and unsupported claims in `tasks/repo-boundary-audit.md`.
4. Update `tasks/deploy.md` with the path-based deploy policy and Vercel ignored-build setup.
5. Add `scripts/vercel-ignore-build.sh` with a testable path classifier.
6. Add focused shell tests for skip/deploy cases.
7. Run classifier tests, whitespace checks, and any showcase checks made relevant by touched files.
8. Record review notes, commit, and push the intended boundary if verification passes.

### Acceptance Criteria

- `tasks/repo-boundary-audit.md` classifies repository zones and validates the user claims with Git/code evidence.
- `tasks/deploy.md` distinguishes source shipping, generated showcase refreshes, workflow evidence, and actual showcase deploys.
- The ignored-build helper skips skill-only, task-only, prompt-only, alignment-only, archive-only, and non-showcase package-only changes.
- The ignored-build helper allows showcase runtime/assets, root dependency manifests, deploy config, and showcase generation script changes.
- Focused tests exercise representative skip/deploy cases.
- No GitHub Actions workflows are created or modified.

## Current Investigation - AFPS Prototype Product Design Workflow

### Goal

Evaluate whether the shipped product-design route `user-flow-map -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation]` is the best default workflow for the AFPS prototype phase.

### Scope

- Active product-design skill contracts for `user-flow-map`, `ux-variations`, and `ui-interview`
- Recent shipped commit for the product-design flow tree routing update
- Existing AFPS workflow evidence in repo docs, task notes, progress manifests, and pack metadata
- Verification limited to read-only or non-mutating checks unless the investigation discovers a concrete source defect

### Plan

1. Capture the visible investigation prompt.
2. Inspect the shipped commit, active product-design contracts, and relevant prior route wording.
3. Inspect AFPS workflow context and prototype-phase assumptions from existing artifacts.
4. Evaluate the new route against prototype-phase goals: speed to visual alignment, branch exploration quality, evidence traceability, decision gates, and handoff readiness.
5. Run focused verification for stale route references and audit health.
6. Record findings and, if no source edits are needed, keep the outcome as an evaluation rather than implementation.

### Acceptance Criteria

- Confirm whether the shipped workflow matches the claimed route.
- Identify whether the route is better than the old requirements/layout-first default for AFPS prototypes.
- Name any conditions where the workflow should branch or be amended.
- Provide a concrete recommended default route for the AFPS prototype phase.

## Current Implementation - Product Design Flow Tree Routing

### Goal

Rework the product-design skill sequence so `$user-flow-map` starts a wireframe tree, `$ux-variations` expands a specific user flow into alternative progression paths, and `$ui-interview` investigates and approves or rejects a specific UX-variation branch through an HTML visual mockup loop.

### Scope

- `packs/product-design/codex/user-flow-map/SKILL.md` and Claude mirror
- `packs/product-design/codex/ux-variations/SKILL.md` and Claude mirror
- `packs/product-design/codex/ui-interview/SKILL.md` and Claude mirror
- Matching archives and changelog entries for substantive skill behavior changes
- Prompt history and task docs for the invoked skills
- Focused validation only; no generated local `.codex/skills/**` or `.claude/skills/**` source edits

### Plan

1. Capture visible prompt history for the invoked `user-flow-map`, `ux-variations`, and `ui-interview` skills.
2. Archive current active skill contracts before version bumps.
3. Update `user-flow-map` to describe the initial wireframe-tree root and route approved flows to UX variation exploration, not requirements-only UI interview.
4. Update `ux-variations` to expand one selected user flow into alternate progression branches and UI-experiment candidates, while preserving layout-mode only as a bounded mode when explicitly requested.
5. Update `ui-interview` to follow the four-step branch review loop: investigate cross-flow coordination, design/propose HTML visual mockup, interview for alignment/retry, then approve or reject the branch and route to the next variation or user flow.
6. Mirror Codex/Claude wording, bump versions, update changelogs, and verify archive/version/routing checks.
7. Commit and push the intended tracked changes after verification.

### Acceptance Criteria

- Product-design active skill contracts no longer define the default route as `user-flow-map -> ui-interview --requirements-only -> ux-variations --layout-mode`.
- `user-flow-map` explicitly positions itself as the root of the wireframe tree and routes to `ux-variations` per user flow.
- `ux-variations` explicitly explores alternate ways to progress through a chosen user flow.
- `ui-interview` explicitly implements the four-step UX-variation branch approval loop and HTML mockup feedback retry behavior.
- Version archives and changelog entries exist for every changed active `SKILL.md`.
- Focused validation passes or any pre-existing unrelated failure is clearly isolated.

## Current Implementation - skillpacks refresh rename reconciliation

### Goal

Make `npx skillpacks refresh` and `npx skillpacks doctor --fix` tolerate stale project config entries left behind by pack or skill renames, while preserving explicit hibernated-pack and unknown-pack failures.

### Scope

- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- Required prompt/task artifacts for the invoked `$investigate` workflow
- No new CLI command and no changes to install/remove argument semantics

### Plan

1. Re-read lifecycle, pack-normalization, project-config, and lifecycle test coverage to confirm current behavior.
2. Add stored-config reconciliation before refresh and doctor fix operations:
   - Rewrite single-target active pack aliases such as `business-discovery` to their canonical active pack.
   - De-duplicate canonical `enabled_packs` values while preserving first-seen order.
   - Rewrite `enabled_skills` pack values to the active pack that currently provides the skill.
   - Keep hibernated pack diagnostics unchanged.
   - Fail unknown stale pack entries with cleanup-oriented guidance.
3. Add regression tests for pack alias migration, duplicate alias de-duplication, enabled-skill pack migration, hibernated stale packs, and unknown stale packs.
4. Run the requested targeted tests and live CLI checks against this checkout.
5. Review the diff for minimality, then commit and push the intended tracked changes.

### Verification

- `node --test packages/skillpacks/test/pack-normalization.test.mjs packages/skillpacks/test/lifecycle.test.mjs`
- `npx skillpacks doctor`
- `npx skillpacks refresh`
- Repo-local fallback for this checkout if the npx binary is unavailable: `node packages/skillpacks/bin/skillpacks.mjs doctor` and `node packages/skillpacks/bin/skillpacks.mjs refresh`

## Current Hygiene - Generated Skill Root Shipping Blocker

### Goal

Restore `.codex/skills/**` and `.claude/skills/**` to generated local artifact status so `$ship-end` can proceed without tracked install-root mutations blocking the shipping contract.

### Scope

- `.gitignore` generated-root ignore rules.
- Git index tracking for `.codex/skills/skill-interview/SKILL.md` and `.claude/skills/skill-interview/SKILL.md`.
- Prompt capture and task/history/manifest bookkeeping for this narrow hygiene boundary.
- No source skill, generated alignment bundle, app, test, or broad validation-remediation changes.

### Plan

1. Confirm the only tracked generated-root files are the two `skill-interview/SKILL.md` install copies.
2. Remove those two files from Git tracking while preserving the local generated files.
3. Replace the broad `.codex` ignore rule with `.codex/skills/` and keep `.claude/skills/`.
4. Verify tracked-file removal, local-file presence, ignore behavior, and whitespace.
5. Commit and push the hygiene-only boundary, then rerun `$ship-end` for the broader dirty tree.

### Acceptance Criteria

- `git ls-files .codex/skills .claude/skills` returns no tracked generated-root files.
- `find .codex/skills .claude/skills -maxdepth 2 -name SKILL.md -print` still shows generated local install files.
- `git check-ignore -v` proves both local generated skill roots are ignored.
- `git diff --check` passes for the hygiene boundary.

## Current Ship-End - Validation Remediation And Shipping

### Goal

Wrap the current dirty working tree: complete validation, document the ship boundary, and commit/push now that the generated-root blocker is resolved.

### Scope

- Ship-end validation failures across layer1 tests, Skills Showcase generated data, skill audits, archive/version/dependency checks, routing checks, and mirror parity.
- Task/history/manifest documentation for the wrap-up.
- No deploy unless a successful commit/push creates a shipped boundary.
- No staging of generated local skill roots under `.codex/skills/**` or `.claude/skills/**`.

### Plan

1. Inspect the dirty tree, generated-root state, manual tasks, advisory task files, and existing unpushed commits.
2. Remediate validation failures that are necessary to make the current repo state provably green.
3. Prefer audit/parser fixes for false positives; archive/version/changelog any real active `SKILL.md` behavior changes.
4. Refresh generated Skills Showcase assets after active skill or validation metadata changes.
5. Run the full executable and documentation validation gate.
6. Update `tasks/todo.md`, `tasks/history.md`, and a ship manifest with results, skipped deploy rationale, residual risks, and next command.
7. Commit/push the ship boundary after confirming generated local roots are excluded.

### Acceptance Criteria

- Full layer1 and Skills Showcase checks pass.
- Active alignment pages and generated alignment bundles are exact.
- Skill archive/version/dependency/routing/mirror audits pass.
- The ship manifest states whether the commit boundary is safe.
- Final handoff names any deploy/manual follow-up and next command.

### Current Status

- Validation is green across the full ship-end gate after the generated-root hygiene commit.
- `git ls-files .codex/skills .claude/skills` returns no tracked generated local skill roots.
- The broad validation-remediation boundary is ready to commit and push.

## Current Implementation - Stage 2 Alignment Page Template

### Goal

Enhance the canonical alignment-page convention so Stage 1 scope-review pages preview the expected Stage 2 research/artifact-review shape before heavy research begins.

### Scope

- `docs/alignment-page-convention.md` inside the generated `alignment-convention` block.
- Generated `ALIGNMENT-PAGE.md` bundles refreshed only through `scripts/upgrade-alignment-page.mjs`.
- Focused layer1 coverage in `tests/layer1/alignment-gates.test.ts` and, if needed, `tests/layer1/research-approval-gate.test.ts`.
- Task tracking and review notes in `tasks/roadmap.md` and `tasks/todo.md`.

### Plan

1. Preserve the existing dirty worktree and inspect current convention/test wording before editing.
2. Add a Stage 2 review-page template section after the staged research workflow language, including required status, findings, evidence, packet-review, alternatives, source gaps, assumptions, file-change, format-preference, and final-artifact approval sections.
3. Require Stage 1 scope-review pages to include a Stage 2 preview / expected review format section before research starts.
4. Keep raw Markdown packet text supplemental only, with structured HTML as the primary review surface.
5. Regenerate generated alignment bundles via `node scripts/upgrade-alignment-page.mjs`.
6. Add focused tests for the Stage 2 template and Stage 1 preview expectation.
7. Run the requested generator, Vitest, and scoped whitespace verification, then record results and ship only if the dirty worktree can be safely isolated.

### Acceptance Criteria

- Canonical convention defines the Stage 2 review-page template and Stage 1 preview expectation.
- Generated bundles contain the new Stage 2 guidance after regeneration.
- Focused layer1 tests fail without the new text and pass with it.
- Verification results are documented before final handoff.
- No generated `ALIGNMENT-PAGE.md` files are hand-edited.

## Current Implementation - Framework-Specific Alignment Guidance

### Goal

Populate generated `ALIGNMENT-PAGE.md` guidance for delegated framework skills with framework-specific review instructions covering research focus, documentation/review format, and concrete user feedback prompts.

### Scope

- `scripts/upgrade-alignment-page.mjs`
- Generated bundled `ALIGNMENT-PAGE.md` files under active `global/**` and `packs/**` skill mirrors
- Focused layer1 alignment generator tests
- Targeted framework bundles:
  - Competitive frameworks: `porter-five-forces`, `swot`, `strategic-group-map`, `feature-pricing-matrix`
  - Customer discovery frameworks: `w3-hypothesis`, `five-rings`, `four-forces`, `jtbd-needs`, `pmf-engine`, `seven-dimensions`
  - Positioning frameworks: `category-design`, `jtbd-positioning`, `moore-positioning`, `obviously-awesome`, `strategic-canvas`
  - Generated customer-lifecycle journey-map frameworks if they receive generated alignment bundles

### Plan

1. Protect existing dirty worktree state and inspect current generator/test behavior before editing.
2. Extend framework-specific translation in `scripts/upgrade-alignment-page.mjs` so known delegated frameworks no longer fall through to generic research guidance.
3. Keep broad fallback guidance for unknown `invocation: sub-skill` frameworks.
4. Regenerate bundled `ALIGNMENT-PAGE.md` files via `node scripts/upgrade-alignment-page.mjs`.
5. Add or update focused layer1 tests to require framework-specific research focus, review/documentation format, and suggested user feedback language.
6. Verify generator drift, targeted bundle content, focused tests, package/build checks if needed, and `git diff --check`.
7. Record review notes, history, ship manifest, and commit/push only the intended boundary if it can be isolated from unrelated dirty work.

### Acceptance Criteria

- Known delegated framework bundles contain framework-specific guidance for research focus, documentation format, and user feedback.
- Unknown sub-skill framework fallback remains broad but useful.
- Generated bundles are exact after regeneration.
- Focused layer1 tests and targeted `rg` checks pass.
- No hand edits are made to generated `ALIGNMENT-PAGE.md` files.

### Current Status

- Implemented and verified. Known delegated framework bundles now receive exact framework-specific guidance through `scripts/upgrade-alignment-page.mjs`, and unknown framework subskills retain fallback guidance.
- Verification passed: generator syntax check, generator regeneration/check, targeted framework `rg` scan, focused layer1 Vitest suite, and scoped `git diff --check` over this task's intended boundary.
- Full-tree `git diff --check` is currently red on unrelated archive `SKILL.md` blank-line-at-EOF diagnostics from the pre-existing dirty tree.
- Shipping is blocked until the pre-existing dirty worktree is separated; shared generator, test, and generated bundle files contain unrelated user-owned changes that cannot be safely committed as this task's boundary.

---

## Current Implementation - Context Intake Metadata And Glossary Bootstrap

### Goal

Make `context_intake` the canonical skill frontmatter field for user/context intake, replacing `interview_depth`, and synchronize the docs, generator, catalog, showcase data, parity audit, tests, and glossary starter artifacts.

### Scope

- Active non-archived `SKILL.md` frontmatter under `global/`, `packs/`, and project-local `.codex/skills/`
- `docs/interview-convention.md`, `docs/skill-anatomy.md`, and narrow orchestrator wording if needed
- `scripts/upgrade-alignment-page.mjs`, `scripts/catalog/index.mjs`, and `scripts/skill-mirror-parity-audit.sh`
- Skills Showcase generated data and related catalog types
- `research/_working/preliminary-repo-glossary-research.md`, glossary review alignment page, and `research/glossary.md` if this handoff is treated as final approval
- Focused layer1 metadata/generator/catalog/parity verification

### Plan

1. Audit the existing dirty worktree and current metadata references without reverting unrelated work.
2. Convert active `interview_depth` declarations to `context_intake` values:
   - `full` -> `deep`
   - `light` -> `scoped`
   - `none` -> `artifact_only`
3. Update documentation and public wording to use "Deep interview", "Scoped intake", and "Artifact-driven" while preserving `type` as the broad workflow category.
4. Patch tooling and tests so `context_intake` and `visual_tier` are parsed, generated, mirrored, and exposed in catalog/showcase data.
5. Refresh glossary working/review artifacts with the new metadata terms and write the canonical starter glossary only if approval status is defensible from the handoff.
6. Regenerate derived bundles/data, run focused verification, record review notes, then stage/commit/push intended changes if they can be isolated from unrelated dirty work.

### Acceptance Criteria

- No active non-archived `SKILL.md` files use `interview_depth`.
- Active docs/scripts/apps/tests use `context_intake` except explicit historical migration notes if intentionally retained.
- Catalog output exposes `contextIntake`; Skills Showcase data carries it.
- Mirror parity includes `context_intake` and `visual_tier`.
- Glossary starter terms cover Frontmatter, Skill metadata, `type`, `context_intake`, `visual_tier`, Artifact-driven, Scoped intake, and Deep interview with sources.
- Focused checks and `git diff --check` pass or any pre-existing failures are clearly proven.

### Current Status

- Implemented through verification. Active skill metadata is migrated to `context_intake`, generated alignment guidance reads `context_intake` and `visual_tier`, catalog/showcase surfaces expose `contextIntake` and `visualTier`, and frontmatter tests guard the retired key.
- The glossary bootstrap is in review state: `research/_working/preliminary-repo-glossary-research.md` and `alignment/repo-glossary-skill-conventions.html` contain the starter terms and approval gates. `research/glossary.md` is intentionally not written until final compiled YAML approves the canonical glossary.
- Verification passed for static migration checks, alignment-page audit, generator drift, focused layer1 tests, Skills Showcase typecheck and catalog/smoke tests, and archive-excluded whitespace checks.
- Known blocked checks are due to pre-existing repo state: full-tree `git diff --check` fails only on unrelated archived snapshots, `skill-mirror-parity-audit.sh` still has 56 existing mirror drifts outside the new metadata keys, and showcase `validate:data` cannot pass until generated assets are committed.
- Shipping is blocked until the pre-existing dirty worktree is separated. A direct commit from this state would include unrelated staged and unstaged user-owned changes.

---

## Current Investigation - Delegated Skill Alignment Page Depth

### Goal

Investigate the claim that delegated/framework skills such as `w3-hypothesis` produce weaker, less informative alignment pages than non-delegated skills such as `idea-scope-brief` or `competitive-analysis`, then apply the smallest durable contract/test fix.

### Scope

- Delegated/framework skill contracts, starting with `w3-hypothesis` and adjacent customer-discovery frameworks.
- Non-delegated comparison contracts: `idea-scope-brief`, `competitive-analysis`, and the competitive-analysis framework route if relevant.
- Shared alignment-page convention and generation scripts only if they are the root cause.
- Focused tests or audits that can prevent thin delegated alignment-page instructions from returning.
- Prompt capture under `prompts/investigate/`.

### Plan

1. Validate the user claims against source and history.
   - Compare delegated and non-delegated `SKILL.md` / `ALIGNMENT-PAGE.md` contracts.
   - Check whether delegated skills explicitly instruct agents to render framework-specific findings, evidence, confidence, tradeoffs, and decision impact.
   - Inspect recent git history for when the delegated wording diverged or failed to inherit stronger guidance.
2. Trace the root cause.
   - Determine whether the issue is a framework-skill template gap, a shared alignment convention gap, or specific `w3-hypothesis` wording.
   - Identify the minimal set of active mirrors affected.
3. Patch the contract and coverage.
   - Prefer source skill/template wording over hand-editing generated pages.
   - Archive and version-bump any changed active `SKILL.md` files.
   - Add or update focused tests/audits so delegated framework skills require useful rendered review sections.
4. Verify and ship safely.
   - Run focused generation/check tests.
   - Record results in `tasks/todo.md`.
   - Stage only intended files, then commit/push if the existing dirty worktree can be cleanly isolated.

### Acceptance Criteria

- The claim is classified as confirmed, partially correct, or unsupported with file/history evidence.
- Delegated framework skills have explicit alignment-page substance requirements matching the quality bar of non-delegated skills.
- Verification proves the new guardrail is present.
- Existing unrelated dirty work is not reverted or accidentally absorbed.

---

## Current Implementation - Optional Alignment Pages For Operational Skills

### Goal

Change the selected operational, planning, reporting, and status skills so alignment pages are optional rather than automatic. Their default output should be inline conversation summary plus normal durable artifacts such as `tasks/*.md`, reports, queues, status docs, or benchmark notes. They should create `alignment/*.html` only when the user requests it or when the agent names a concrete clarification/review need.

### Scope

- `scripts/upgrade-alignment-page.mjs`
- `scripts/alignment-skip-list.txt`
- First-batch optional skills and their Claude/Codex mirrors where present:
  - `roadmap`, `research-roadmap`, `plan-phase`
  - `brainstorm`, `devtool-workflow`, `game-workflow`, `game-roadmap`, `experiment`, `mono-plan`, `vertical-slice-splitter`
  - `reconcile-dev-docs`, `analyze-sessions`, `prompt-history-backfill`, `benchmark-test-skill`, `benchmark-agent-review`
  - `afps-status`, `handoff`, `branch-lifecycle`, `release`, `product-line`, `skill-inventory`, `provision-agentic-config`
- Generated `ALIGNMENT-PAGE.md` bundles for affected skills
- Focused layer1 tests:
  - `tests/layer1/alignment-gates.test.ts`
  - `tests/layer1/afps-alignment-preview-gates.test.ts`
  - `tests/layer1/codex-interview-cadence.test.ts`
- Prompt capture under `prompts/create-agentic-skill/`

### Plan

1. Capture the prompt and protect the existing dirty worktree.
   - Read the repo-managed skill update instructions and relevant lessons.
   - Record this plan in `tasks/roadmap.md` and `tasks/todo.md`.
   - Inventory target skills and current generated alignment policy.
2. Patch the generator.
   - Add an `OPTIONAL_ALIGNMENT_SKILLS` first-batch set.
   - Generate optional `SKILL.md` alignment stubs for those skills: inline/task artifacts by default; alignment pages only on request or explicit clarification/review need.
   - Generate optional `ALIGNMENT-PAGE.md` introductions while keeping the existing page/YAML/gate contract for cases where a page is created.
   - Keep approval-gated research, product, and spec skills automatic.
3. Patch skill sources through archive-first versioning.
   - Run `scripts/skill-archive.sh <skill-dir>` before each changed active `SKILL.md`.
   - Bump each changed skill version by one decimal.
   - Add `CHANGELOG.md` entries dated `2026-06-12`.
   - Convert `roadmap` and `plan-phase` to optional policy; remove `roadmap` from no-contract skip semantics.
4. Update skip-list semantics and tests.
   - Clarify that `scripts/alignment-skip-list.txt` is for skills excluded from generated alignment policy entirely.
   - Update tests that currently require automatic roadmap/research-roadmap gates.
   - Assert optional skills contain inline/task-artifact defaults, conditional page creation, and no automatic `tasks/roadmap.md` blocker language.
5. Regenerate and verify.
   - Run `node scripts/upgrade-alignment-page.mjs`.
   - Run `node scripts/upgrade-alignment-page.mjs --check`.
   - Run the requested focused tests, then broader layer1 coverage if targeted tests pass.
   - Review diff scope, stage only intended changes, commit, and push to `master`.

### Acceptance Criteria

- First-batch operational skills no longer require automatic alignment pages.
- Optional alignment pages still use the standard generated page/YAML/gate contract when created.
- `roadmap` is no longer treated as a no-contract skip-list exception.
- Approval-gated research/spec/product skills continue to require automatic alignment review pages.
- Focused tests prove both optional and automatic paths.

---

## Current Investigation - Interview Skill Type Convention

### Goal

Determine whether interview-style skills should get a dedicated skill type/convention, and whether the convention should preserve the longstanding relentless interview behavior under a better name.

### Scope

- Active skill frontmatter and type taxonomy across repo-managed skills.
- Interview-related skill contracts, especially `ui-interview`, `skill-interview`, and local/product interview variants.
- Recent history around `ui-interview` behavior regressions and evidence-synthesis/requirements-only changes.
- Pack metadata, generated showcase/index code, and tests that may consume `type`.
- Recommendation only unless a follow-up implementation is requested.

### Plan

1. Capture and classify the user claims.
   - Confirm whether interview-style skills currently have an explicit type or are hidden under broader categories.
   - Confirm whether recent changes weakened live interview/interrogation behavior.
2. Audit current conventions.
   - Inventory active non-archive `type:` values.
   - Read interview-related active `SKILL.md` files and pack metadata.
   - Check scripts/tests that group or display skills by type.
3. Inspect recent history.
   - Use `git log`, `git diff`, and `git blame` around `ui-interview` and related interview skill changes.
   - Identify whether the regression is a taxonomy issue, a contract wording issue, or both.
4. Produce the report.
   - Recommend a convention name and type value.
   - Spell out migration scope, guardrails, tests, and what not to rename.

### Acceptance Criteria

- Report distinguishes confirmed evidence from inference.
- Recommendation names the convention/type and explains why.
- Report includes likely impacted files/tests and a migration plan without making broad source changes in this audit.

---

## Current Implementation - UI Interview Skipping And Context Routing

### Goal

Prevent `ui-interview --requirements-only` from treating upstream `user-flow-map` approval as its own interview, and make downstream research/planning handoffs offer an explicit context boundary instead of implying automatic execution.

### Scope

- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/CHANGELOG.md`
- `scripts/upgrade-alignment-page.mjs`
- Generated `ALIGNMENT-PAGE.md` bundles from the canonical alignment convention
- Focused layer1 tests and targeted regression searches
- Prompt capture under `prompts/targeted-skill-builder/` and `prompts/ui-interview/`

### Plan

1. Confirm current source state and protect existing dirty work.
   - Read active skill instructions, current pack mirrors, generator text, task docs, lessons, and relevant tests.
   - Treat the existing uncommitted `ui-interview` `v0.18` packet-rendering change as an in-progress release and extend that release rather than creating a conflicting `v0.19`.
2. Patch `ui-interview` requirements-only behavior.
   - State that upstream `user-flow-map` approval authorizes route selection only; it never counts as `ui-interview` interview completion.
   - Require the UI Assumptions Manifest and Content Requirements Manifest to be shown and confirmed inside `ui-interview --requirements-only` before any review page is built.
   - Add an explicit evidence-synthesis exception only when the current invocation asks to skip live questions or synthesize from evidence.
3. Patch downstream handoff routing.
   - Make `user-flow-map` present two choices after approval: stop so the user can clear context and run the next skill, or continue immediately in the same session.
   - State that continuing immediately still requires the next skill to run its own interaction gates.
   - Avoid auto-run or auto-invoke wording for downstream skills.
4. Patch generated alignment guidance and tests.
   - Add `Interview provenance` requirements to the `ui-interview` gate text.
   - Regenerate bundled `ALIGNMENT-PAGE.md` files.
   - Add focused tests for provenance, evidence-synthesis labeling, and handoff routing language.
5. Verify and ship.
   - Run the requested generator, layer1, diff, and targeted `rg` checks.
   - Record review notes in `tasks/todo.md`.
   - Commit and push intended changes where the existing dirty worktree allows clean staging.

### Acceptance Criteria

- `ui-interview --requirements-only` cannot skip its own UI/content confirmation gates based on upstream approval alone.
- Evidence-only output is explicitly labeled `evidence-synthesis review` and routes unresolved decisions back to a resumed `ui-interview`.
- Product-design handoffs present clear stop/clear-context and continue-now choices.
- Generated alignment guidance requires `Interview provenance` values: `live-ui-interview`, `evidence-synthesis-with-explicit-skip`, or `invalid-missing-ui-interview`.
- Focused tests and searches prove the new contract is present.

---

## Current Implementation - Repo-Wide Packet Dump Remediation

### Goal

Fix packet-dump wording as a repo-wide contract bug. Alignment review pages must preserve complete packet content by rendering it as readable HTML review UI, not by making "Full Preliminary Packet" or "Full Working Packet" raw Markdown dumps the primary review surface.

### User Claims Validated

- Confirmed: active pack `SKILL.md` files contain the risky packet-rendering wording in 144 files.
- Confirmed: active generated `ALIGNMENT-PAGE.md` bundles repeat the generated risky wording in 281 files.
- Confirmed: root cause spans the shared generated alignment convention and copied Stage 2 lifecycle prose. `docs/alignment-page-convention.md` contains "renders the full preliminary packet"; active Stage 2 skill prose contains "Update the `review` HTML alignment page with the full preliminary packet".
- Confirmed: `scripts/researchish-skill-lifecycle-audit.mjs` and `tests/layer1/alignment-gates.test.ts` currently enforce the old phrasing.
- Confirmed: `.codex` / `.claude` local install roots did not show active hits in the initial search, but they still need refresh after source updates so runtime copies cannot lag.

### Root Cause Notes

The risky contract entered the canonical alignment convention in commit `664de0b23` on 2026-06-11 as part of the staged research workflow. The intent was no context loss, but the wording says to render the "full preliminary packet" without explicitly requiring translation into purposeful HTML modules. Copied Stage 2 prose in research-ish skills is stronger and says to update the review HTML page "with the full preliminary packet", which encourages agents to paste dense Markdown packets into the page instead of rendering the same content as navigable review UI.

### Scope

- `docs/alignment-page-convention.md`
- `scripts/researchish-skill-lifecycle-audit.mjs`
- Focused layer tests that assert old packet wording
- 144 active non-archive pack `SKILL.md` files across 72 logical mirrored skills
- Generated active `ALIGNMENT-PAGE.md` bundles after convention regeneration
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/lessons.md`, and prompt capture
- Local ignored `.codex/skills` and `.claude/skills` refresh if available

### Affected Active SKILL.md Inventory

Counts by pack:

- `business-research`: 44 files, 22 mirrored skills
- `youtube-ops`: 26 files, 13 mirrored skills
- `creator-foundation`: 14 files, 7 mirrored skills
- `business-growth`: 12 files, 6 mirrored skills
- `customer-lifecycle`: 12 files, 6 mirrored skills
- `game`: 12 files, 6 mirrored skills
- `business-ops`: 8 files, 4 mirrored skills
- `devtool`: 8 files, 4 mirrored skills
- `ord`: 2 files, 1 mirrored skill
- `product-design`: 2 files, 1 mirrored skill
- `remotion`: 2 files, 1 mirrored skill
- `vard`: 2 files, 1 mirrored skill

Logical mirrored skill inventory:

- `business-research`: `customer-feedback`, `lean-canvas`, `enterprise-icp`, `competitive-analysis`, `competitive-analysis/frameworks/feature-pricing-matrix`, `competitive-analysis/frameworks/porter-five-forces`, `competitive-analysis/frameworks/strategic-group-map`, `competitive-analysis/frameworks/swot`, `positioning`, `positioning/frameworks/category-design`, `positioning/frameworks/jtbd-positioning`, `positioning/frameworks/moore-positioning`, `positioning/frameworks/obviously-awesome`, `positioning/frameworks/strategic-canvas`, `customer-discovery`, `customer-discovery/frameworks/five-rings`, `customer-discovery/frameworks/four-forces`, `customer-discovery/frameworks/jtbd-needs`, `customer-discovery/frameworks/pmf-engine`, `customer-discovery/frameworks/seven-dimensions`, `customer-discovery/frameworks/w3-hypothesis`, `value-prop-canvas`
- `devtool`: `devtool-adoption`, `devtool-monetization`, `devtool-positioning`, `devtool-user-map`
- `business-growth`: `growth-model`, `gtm`, `hook-model`, `landing-copy`, `monetization`, `pmf-assessment`
- `business-ops`: `mvp-gap`, `platform-strategy`, `reconcile-research`, `repo-glossary`
- `creator-foundation`: `content-programming`, `creator-evidence-schema`, `creator-metrics-review`, `creator-platform-capability-matrix`, `creator-positioning`, `creator-presence-dossier`, `product-led-media-map`
- `customer-lifecycle`: `journey-map`, `journey-map/frameworks/customer-journey-canvas`, `journey-map/frameworks/experience-map`, `journey-map/frameworks/jtbd-timeline`, `journey-map/frameworks/service-blueprint`, `journey-map/frameworks/user-story-map`
- `game`: `game-audience`, `game-comparables`, `game-fantasy`, `game-genre-map`, `game-launch`, `game-store-page-test`
- `youtube-ops`: `youtube-audit`, `youtube-cadence-diagnosis`, `youtube-channel-audit`, `youtube-competitive-research`, `youtube-concept-research`, `youtube-description-optimizer`, `youtube-peer-benchmark`, `youtube-portfolio`, `youtube-search-positioning`, `youtube-title-thumbnail-audit`, `youtube-vid-research`, `youtube-video-audit`, `youtube-video-prelaunch-audit`
- `ord`: `ord-scan`
- `vard`: `vard-scan`
- `remotion`: `youtube-format-research`
- `product-design`: `ui-interview`

Generated `ALIGNMENT-PAGE.md` hit counts by pack:

- `agent-bridge`: 1
- `agentic-skills-bench`: 4
- `alignment-loop`: 2
- `business-growth`: 16
- `business-ops`: 26
- `business-research`: 44
- `code-maintenance`: 2
- `code-quality`: 4
- `code-review`: 8
- `context-transfer`: 2
- `creator-foundation`: 18
- `customer-lifecycle`: 24
- `devtool`: 16
- `docs-health`: 2
- `game`: 22
- `guided-walkthrough`: 2
- `monorepo`: 2
- `ord`: 2
- `product-design`: 18
- `product-testing`: 4
- `project-fleet`: 6
- `release-ops`: 4
- `remotion`: 6
- `report-gen`: 2
- `research-admin`: 2
- `session-analytics`: 4
- `skill-dev`: 4
- `teardown`: 4
- `vard`: 2
- `website-polish`: 2
- `youtube-ops`: 26

### Plan

1. Record and validate the bug.
   - Capture the `$investigate` invocation under `prompts/investigate/`.
   - Produce the active non-archive inventory and classify hits as generated convention, shared Stage 2 prose, skill-specific wording, tests/audits, or local install state.
   - Check recent git history for where the risky generated wording entered.
2. Patch shared convention and gates.
   - Update `docs/alignment-page-convention.md` so no-context-loss requires clean rendered HTML sections, tables, matrices, gates, cards, and review modules.
   - Explicitly forbid primary "Full Working Packet" / "Full Preliminary Packet" Markdown dumps.
   - Allow raw Markdown only as a supplemental source view after the rendered review UI.
   - Update lifecycle audit and focused tests to assert structured rendering language instead of "full preliminary packet".
3. Patch active skill contracts.
   - Process packs in requested order: `business-research`, `devtool`, `business-growth`, `business-ops`, `creator-foundation`, `customer-lifecycle`, `game`, `youtube-ops`, then `ord`, `vard`, `remotion`, `product-design`.
   - For each logical skill, archive both active mirrors with `scripts/skill-archive.sh <skill-dir>`, bump decimal versions, replace Stage 2 wording with structured HTML rendering language, preserve skill-specific additions, and update `CHANGELOG.md`.
4. Regenerate and refresh.
   - Run `node scripts/upgrade-alignment-page.mjs`.
   - Refresh ignored local `.codex/skills` and `.claude/skills` installs from pack source where project tooling supports it.
5. Verify and ship.
   - Run the requested checks and regression searches.
   - Review diff scope for unrelated changes.
   - Add the correction lesson.
   - Commit and push intended tracked changes to `master`.

### Verification Gates

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/researchish-skill-lifecycle-audit.mjs`
- `npx vitest run tests/layer1/alignment-gates.test.ts`
- `npx vitest run tests/layer1/researchish-skill-lifecycle-audit.test.ts`
- `npx vitest run tests/layer1/upgrade-alignment-page-bespoke.test.ts`
- Regression search over active non-archive sources must show no primary-rendering instructions containing:
  - `full preliminary packet`
  - `full working packet`
  - `Full Preliminary Packet`
  - `Full Working Packet`
  - `Update the review HTML alignment page with the full preliminary packet`
- Remaining hits, if any, must be archive history, storage-path references, or explicit "do not use as primary rendering" guardrails.

### Acceptance Criteria

- Every active affected skill keeps the staged working-packet lifecycle but instructs agents to render packet substance as structured HTML review UI.
- Generated alignment bundles carry the new no-packet-dump convention.
- Tests and audits enforce the new wording.
- `tasks/lessons.md` records the correction pattern.
- Intended tracked changes are committed and pushed.

---

## Current Implementation - UI Interview Alignment Review Clarity

### Goal

Make the current `ui-interview` requirements review page and future `ui-interview` alignment pages clearer: the user should immediately understand whether they are reviewing a requirements-only draft or participating in the live interview, and Markdown tables should be rendered as readable HTML instead of a raw Markdown preview block.

### Scope

- Active review page: `alignment/ui-interview-skill-execution-handoff.html`.
- Active working packet: `research/skills-showcase/_working/preliminary-ui-interview-research.md`.
- `ui-interview` alignment-page generation contract through `scripts/upgrade-alignment-page.mjs`.
- Active `ui-interview` skill version/archive/changelog if the skill contract changes.
- Focused tests/audits covering the new contract and active alignment page validity.

### Out of Scope

- Changing the approved requirements substance.
- Writing canonical `specs/skills-showcase/ui-requirements-skill-execution-handoff*.md` before final compiled YAML approval.
- Redesigning the whole alignment-page convention across every skill.
- GitHub Actions.

### Plan

1. Confirm the failure mode.
   - [x] Read active `ui-interview` instructions and bundled alignment contract.
   - [x] Capture the visible prompt under `prompts/ui-interview/`.
   - [x] Inspect the current `ui-interview` review page and working packet.
2. Patch the contract.
   - [x] Add `ui-interview`-specific alignment guidance requiring a visible interview-stage explainer.
   - [x] Require structured HTML rendering of the working packet sections, especially Markdown tables.
   - [x] Preserve the no-context-loss requirement without using one raw `<pre><code>` Markdown dump as the primary review surface.
3. Patch the active review page.
   - [x] Archive the current active page before replacement.
   - [x] Convert the full working packet from raw Markdown preview into readable HTML sections and tables.
   - [x] Add a clear review-stage answer: `requirements-only` review now, full interview only when the skill is run interactively or rerun without `--requirements-only`.
   - [x] Keep canonical UI requirements files unwritten.
4. Verify and ship.
   - [x] Run generated-bundle drift checks.
   - [x] Run alignment-page audit.
   - [x] Run focused tests.
   - [x] Run `git diff --check`.
   - [x] Record review notes, commit, and push intended changes.

### Acceptance Criteria

- The active page no longer uses the full working packet raw Markdown block as the primary review surface.
- Markdown tables from the working packet render as HTML tables with horizontal overflow wrappers and TTS narratives.
- The page states the current `ui-interview` lifecycle stage in plain language.
- The page preserves approval gates and review-state behavior.
- Canonical UI requirements files remain absent until final compiled YAML approval.

---

## Current Implementation - Skillpacks Install Route And Agent Doc Migration

### Goal

Make `npx skillpacks install <pack-or-skill>` the standard active install recommendation, and add explicit, marker-bounded `doctor --fix --agent-docs` migration for generated `AGENTS.md` / `CLAUDE.md` blocks while keeping plain `doctor` read-only.

### Scope

- `packages/skillpacks` CLI lifecycle and tests for `doctor`, `doctor --fix`, `doctor --fix --agent-docs`, dry-run diffs, backups, and generated skill-root cleanup.
- Active generated root instructions and `global/{claude,codex}/provision-agentic-config`.
- Active install-route guidance in global and pack skills, with version/archive/changelog discipline for changed `SKILL.md` files.
- Canonical install-routing contract, package docs, routing audit script, and fixtures.
- Generated package staging/manifest artifacts only through the package build.

### Plan

1. Capture and orient.
   - [x] Read the active `pack` skill instructions.
   - [x] Capture the visible invocation under `prompts/pack/`.
   - [x] Inspect lifecycle CLI, provision templates, routing audit, docs, and existing task state.
2. Implement safe CLI migration behavior.
   - [x] Keep `npx skillpacks doctor` read-only.
   - [x] Add `doctor --fix` to clean generated skill-root drift without touching agent docs.
   - [x] Add `doctor --fix --agent-docs [--dry-run]` for marker-bounded generated block replacement only.
   - [x] Refuse missing, duplicate, malformed, or unknown provision markers safely.
   - [x] Print unified diffs before writes and create timestamped `.agents/backups/` copies before agent-doc mutation.
3. Migrate install-route wording.
   - [x] Update root generated blocks, provisioner templates, package docs, and routing contract to standardize on `npx skillpacks install <pack-or-skill>`.
   - [x] Update active `SKILL.md` install guidance; keep `/pack`, `$pack`, and `scripts/pack.sh` only as explicit legacy/source-checkout behavior.
   - [x] Archive and bump versions for every active skill whose behavior/output guidance changes, and update `CHANGELOG.md`.
4. Update tests and fixtures.
   - [x] Add lifecycle coverage for read-only doctor, fix-only cleanup, dry-run agent-doc diff, backup/write migration, text preservation, and refusal cases.
   - [x] Update routing audit so active `/pack install` and `$pack install` guidance fails unless allowlisted.
   - [x] Refresh fixtures to prove valid/invalid install route behavior.
5. Verify and ship.
   - [x] Run `scripts/skill-install-routing-audit.sh --active`.
   - [x] Run `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`.
   - [x] Run `npm --workspace skillpacks run test:node`.
   - [x] Run `npm --workspace skillpacks run build:check`.
   - [x] Run `npm --workspace skillpacks run verify:package`.
   - [x] Run `git diff --check`.
   - [x] Record review notes, commit, and push intended changes on the primary branch unless blocked.

### Acceptance Criteria

- `doctor` remains a read-only drift report.
- `doctor --fix` cleans only generated skill roots and preserves pinned symlinks plus unmanaged local skill directories.
- Agent-doc migration is opt-in, marker-bounded, diffed, backed up, dry-runnable, and refuses unsafe files.
- Active agent-facing install recommendations use `npx skillpacks install <pack-or-skill>`.
- Active routing audit fails unallowlisted `/pack install` / `$pack install` guidance.
- Required package and routing verification commands pass.

### Outcome

Completed. The npm CLI now owns the standard active install route, `doctor` remains read-only by default, `doctor --fix` is scoped to generated skill-root cleanup, and agent-doc migration is opt-in, previewable, marker-bounded, and backed up before writing.

---

## Current Validation - Pack Skill Sunset Readiness

### Goal

Validate whether active skills still depend on `$pack` / `scripts/pack.sh` to install packs or individual skills, and determine whether the `pack` skill can be archived and sunset.

### Scope

- Active skill contracts under `global/codex/`, `packs/*/codex/`, and visible project-local skill roots.
- Repo docs and package code that may still surface pack-install guidance.
- Archive snapshots are evidence of historical behavior but do not block active sunset unless they are copied into generated/runtime manifests.
- Out of scope: actually archiving/removing the `pack` skill in this pass, changing install behavior, or introducing GitHub Actions.

### Plan

1. Capture and orient.
   - [x] Load the `pack` skill instructions because the request names the skill.
   - [x] Capture the visible invocation under `prompts/pack/`.
   - [x] Record this validation plan before repo-wide scanning.
2. Audit active references.
   - [x] Search active skills for `$pack`, `pack install`, `scripts/pack.sh install`, `scripts/pack.sh refresh`, and missing-skill fallback references.
   - [x] Search docs/package sources for user-facing pack-install guidance.
   - [x] Separate active contracts from archives, generated data, and the `pack` skill implementation itself.
3. Evaluate sunset readiness.
   - [x] Identify any active skill that still requires `pack` to install packs or skills.
   - [x] Identify non-blocking legacy/fallback references that should be rewritten before archival.
   - [x] Recommend whether archiving/sunsetting is safe now or after specific follow-up edits.
4. Verify and record.
   - [x] Run focused search commands and `git diff --check`.
   - [x] Add review notes to `tasks/todo.md`.

### Acceptance Criteria

- Every remaining active `$pack` / `scripts/pack.sh` install reference is classified.
- The recommendation distinguishes runtime blockers from documentation cleanup.
- Validation commands are recorded before reporting the result.

### Outcome

Not ready to archive yet. Active skill contracts still preserve `/pack install` and `$pack install` as canonical in-agent install routes, and the active install-route contract explicitly tells remediation to keep those routes while adding `npx skillpacks install` alternatives. The npm CLI has moved direct `skillpacks install` pack/skill lifecycle to package-owned Node code, but `skillpacks install-deck` still shells out to packaged `scripts/pack.sh install`, and 42 active skills still fail the npm-alternative routing audit.

---

## Current Planning - Skills Showcase Skill Execution Handoff Flow

### Goal

Build the approval-gated review page for the Skills Showcase `skill-execution-handoff` flow: how a developer moves from a completed deck or workflow selection into an executable agent/terminal handoff, including mode choice, approval packet awareness, copy/download paths, validation states, and recovery paths.

### Scope

- Product path: `skills-showcase` (`research/skills-showcase/`, `specs/skills-showcase/`).
- Review deliverable in this pass:
  - `alignment/user-flow-map-skill-execution-handoff.html` in `review` state.
- Proposed canonical deliverables after final compiled YAML approval only:
  - `specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
- Source evidence:
  - `research/.progress.yaml`
  - `research/skills-showcase/idea-brief.md`
  - `specs/skills-showcase/user-flow-deck-creation.md`
  - `specs/skills-showcase/user-flow-deck-creation-interview.md`
  - `apps/skills-showcase/docs/deck-builder-ux.md`
  - `docs/decks.md`
  - `docs/operating-modes.md`
  - `apps/skills-showcase/src/showcase/tui/workflow-data.ts`
- Out of scope: polished UI, visual styling, implementation architecture, CLI behavior changes, GitHub Actions, and direct production code changes.

### Plan

1. Capture invocation and resolve scope.
   - [x] Capture visible `$user-flow-map skills-showcase skill-execution-handoff` prompt history.
   - [x] Read the active `user-flow-map` skill instructions.
   - [x] Resolve active product path to `skills-showcase`.
   - [x] Inspect relevant research, existing user-flow specs, UX decisions, app routes, and handoff/operating-mode docs.
2. Confirm flow assumptions with the user.
   - [x] Draft Flow Assumptions Checkpoint from evidence.
   - [x] Receive confirmation or corrections.
3. Map the flow after approval.
   - [x] Define persona, goal, success condition, and triggering context.
   - [x] Inventory entry points, preconditions, happy path, alternate paths, branch rules, screens/routes, failures, recovery, and handoffs.
   - [x] Preserve layout/styling and implementation as non-goals.
4. Confirm coverage before writing.
   - [x] Flow coverage was reviewed in the prior conversation context.
   - [x] Carry corrected persona wording into the proposed spec and interview log.
5. Build review page only.
   - [x] Render the full proposed spec inline in the review alignment page.
   - [x] Render the full proposed interview log inline in the review alignment page.
   - [x] Include approval gates for evidence coverage, assumptions, flow map, branch/state/handoff coverage, artifact destination, proposed file changes, and downstream route.
   - [x] Update `alignment/index.html` with the new review page entry.
6. Verify and ship the review artifact.
   - [x] Run `node scripts/audit-alignment-pages.mjs`.
   - [x] Run `git diff --check`.
   - [x] Verify the proposed canonical markdown files remain unwritten.
   - [x] Verify no `specs/skills-showcase/user-flow-deck-creation*` files are modified.
   - [x] Record review notes and ship only intended review-page changes.

### Acceptance Criteria

- The flow covers web-to-terminal, web-to-repo, and agent-mode handoff paths without inventing CLI behavior.
- Approval-packet, mode-selection, stale-state, clipboard/download, no-data, permission, and validation failures are explicit.
- The spec reuses the confirmed deck-creation flow as upstream context and does not overwrite it.
- The review page contains the complete proposed spec and interview log inline, not as an iframe/object/embed or link-only document.
- Canonical markdown deliverables are not written until final compiled YAML has `approval_status: ready-for-agent-review`.
- The downstream route after confirmation remains `$ui-interview --requirements-only skill-execution-handoff`.

### Review Notes

- Built `alignment/user-flow-map-skill-execution-handoff.html` in `review` state with the complete proposed spec, proposed interview log, evidence context, and approval gates rendered inline.
- Did not write `specs/skills-showcase/user-flow-skill-execution-handoff.md` or `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`; those remain proposed destinations pending final compiled YAML approval.
- Updated `alignment/index.html` with the new Product Design & Spec entry.
- Opened the review page via `node scripts/open-html-page.mjs alignment/user-flow-map-skill-execution-handoff.html --browser auto` after the first sandboxed open was blocked.
- Verification passed:
  - `node scripts/audit-alignment-pages.mjs`
  - `git diff --check`
  - `test ! -e specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `test ! -e specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
  - `git diff --name-only -- specs/skills-showcase/user-flow-deck-creation.md specs/skills-showcase/user-flow-deck-creation-interview.md` returned no files.

---

## Current Planning - Skills Showcase Skill Execution Handoff UI Requirements

### Goal

Consume the approved `alignment/user-flow-map-skill-execution-handoff.html` response, materialize the canonical user-flow handoff files, then run `$ui-interview --requirements-only skill-execution-handoff` into a review-state UI requirements packet and alignment page.

### Scope

- Product path: `skills-showcase` (`research/skills-showcase/`, `specs/skills-showcase/`).
- Approved user-flow confirmation:
  - Confirm `alignment/user-flow-map-skill-execution-handoff.html`.
  - Write `specs/skills-showcase/user-flow-skill-execution-handoff.md`.
  - Write `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`.
- UI requirements review outputs:
  - `research/skills-showcase/_working/preliminary-ui-interview-research.md`
  - `alignment/ui-interview-skill-execution-handoff.html` in `review` state.
- Proposed canonical UI requirements after future final compiled YAML approval only:
  - `specs/skills-showcase/ui-requirements-skill-execution-handoff.md`
  - `specs/skills-showcase/ui-requirements-skill-execution-handoff-interview.md`
- Out of scope: layout variants, polished visual design, production implementation, database/auth/payment/analytics/admin work, and GitHub Actions.

### Plan

1. Capture invocation and plan.
   - [x] Capture visible `$ui-interview --requirements-only skill-execution-handoff` handoff prompt history.
   - [x] Read the active `ui-interview` skill instructions and bundled alignment-page contract.
   - [x] Resolve active product path to `skills-showcase`.
   - [x] Record current handoff checklist in task docs.
2. Close the approved upstream flow.
   - [x] Verify final compiled YAML is complete and has no negative section feedback.
   - [x] Extract the approved proposed spec and interview log from `alignment/user-flow-map-skill-execution-handoff.html`.
   - [x] Write canonical user-flow spec and interview log under `specs/skills-showcase/`.
   - [x] Archive the prior review alignment page and convert the active page to `confirmed`.
   - [x] Update `alignment/index.html` metadata if confirmation state/date changes require it.
3. Build requirements-only UI review artifacts.
   - [x] Read source evidence from the confirmed flow spec, Skills Showcase idea brief, deck-creation flow, operating-mode/approval-packet docs, and relevant app route/component files.
   - [x] Draft the UI Assumptions Manifest, content requirements manifest, page/entity/action/state matrices, coverage checkpoint, and interview record.
   - [x] Write the draft only to `research/skills-showcase/_working/preliminary-ui-interview-research.md`.
   - [x] Build `alignment/ui-interview-skill-execution-handoff.html` in `review` state with the full working packet rendered inline and required gates.
   - [x] Open or attempt to open the alignment page in the browser.
4. Verify and ship.
   - [x] Run `node scripts/audit-alignment-pages.mjs`.
   - [x] Run `git diff --check`.
   - [x] Verify UI canonical files remain unwritten before final UI approval.
   - [x] Review the diff for unrelated changes and intended scope.
   - [x] Commit and push intended tracked changes if validation passes.

### Acceptance Criteria

- The upstream user-flow page is confirmed only after the provided complete approval YAML is honored.
- The UI requirements output stays requirements-only: data, actions, states, constraints, hierarchy, and relationships, with no locked layout/component/spatial decisions.
- The UI review page contains the full working packet inline, including source evidence, assumptions, content requirements, coverage, destinations, and approval gates.
- Canonical `specs/skills-showcase/ui-requirements-skill-execution-handoff*.md` files are not written until a later final compiled YAML approval for the UI page.
- The downstream route language is withheld while the UI page remains in `review`.

### Review Notes

- User-flow approval consumed: provided YAML was complete, had `approval_status: ready-for-agent-review`, and had `section_feedback: []`.
- Wrote canonical upstream files:
  - `specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
- Archived the prior review page at `docs/history/archive/2026-06-12/102540/alignment/user-flow-map-skill-execution-handoff.html` and converted `alignment/user-flow-map-skill-execution-handoff.html` to confirmed.
- Wrote requirements-only review artifacts:
  - `research/skills-showcase/_working/preliminary-ui-interview-research.md`
  - `alignment/ui-interview-skill-execution-handoff.html`
- Updated `alignment/index.html` with the new UI review page and confirmed upstream flow entry.
- Browser open: `node scripts/open-html-page.mjs alignment/ui-interview-skill-execution-handoff.html --browser auto` opened the page via macOS.
- Verification passed:
  - `node scripts/audit-alignment-pages.mjs` -> 50 active pages, TTS exact, metadata exact, viewport exact, embed prohibition exact, index integrity exact.
  - `git diff --check`
  - `node -e` inline-script syntax check for `alignment/ui-interview-skill-execution-handoff.html`
  - `test ! -e specs/skills-showcase/ui-requirements-skill-execution-handoff.md`
  - `test ! -e specs/skills-showcase/ui-requirements-skill-execution-handoff-interview.md`
- Shipped to `origin/master` in commit `5139bcbc` (`Add skill execution handoff UI requirements review`).

---

## Current Implementation - Skillpacks Init Global Alias

### Goal

Add a compatibility alias so `npx skillpacks init --global` performs the same user-home global core install path as `npx skillpacks init-global`, while preserving project-local behavior for `npx skillpacks init`.

### Scope

- Update `packages/skillpacks/src/cli/run-pack-script.mjs` to route `init --global` to the existing packaged global init implementation.
- Keep unsupported `init` arguments rejected.
- Update CLI help and public package docs for `init`, `init --global`, and `init-global`.
- Add lifecycle/CLI coverage for the new alias and unchanged behaviors.
- Refresh staged package artifacts if build validation requires it.
- Record prompt/task history and quality-gate shipping evidence.

### Plan

1. Capture and inspect.
   - [x] Capture the visible invocation under `prompts/exec/`.
   - [x] Read current init/init-global routing, docs/help, tests, and package scripts.
   - [x] Record this roadmap/todo plan before implementation.
2. Implement the alias.
   - [x] Route `skillpacks init --global` to packaged `init.sh` through the same global-core path as `init-global`.
   - [x] Preserve `skillpacks init` project-local install behavior.
   - [x] Preserve rejection for unsupported `init` arguments such as `--bad`.
   - [x] Update help/docs without changing global install semantics.
3. Validate and ship.
   - [x] Add targeted lifecycle/CLI regression tests.
   - [x] Run `npm --workspace skillpacks run test:node`.
   - [x] Run `npm --workspace skillpacks run build:check`.
   - [x] Run `git diff --check`.
   - [x] Record review notes, history, and quality-gate manifest.
   - [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- `skillpacks init --global --help` reaches packaged `init.sh --help`.
- `skillpacks init --bad` still errors.
- `skillpacks init` still installs project-local base skills.
- `skillpacks init-global` remains available for backward compatibility.
- Documentation clearly states that global init installs only global core skills from the package snapshot.

---

## Current Implementation - Skillpacks 0.1.1 Publish Readiness

### Goal

Prepare the repository and staged npm package artifacts for a later explicit `skillpacks@0.1.1` publish, without running a real publish in this pass.

### Scope

- Re-run the `skillpacks` package validation and build gates.
- Refresh stale generated package artifacts, especially `packages/skillpacks/build/` and `packages/skillpacks/dist/skillpacks-manifest.json`.
- Confirm the staged package reports `skillpacks@0.1.1`.
- Run npm registry/readiness checks using `/tmp/skillpacks-npm-cache`.
- Record readiness notes in task history and ship manifest artifacts.
- Out of scope: real `npm publish`, package access changes, npm dist-tag changes, GitHub Actions, or unrelated package behavior changes.

### Plan

1. Capture current state.
   - [x] Check git status and package metadata.
   - [x] Confirm the public registry does not already contain `skillpacks@0.1.1`.
2. Validate and regenerate package artifacts.
   - [x] Run `npm --workspace skillpacks run test:node`.
   - [x] Run `npm --workspace skillpacks run build`.
   - [x] Run `npm --workspace skillpacks run build:check`.
   - [x] Run `npm --workspace skillpacks run verify:package`.
   - [x] Confirm `packages/skillpacks/build/package.json` is `0.1.1`.
3. Exercise publish packaging without publishing.
   - [x] Run `npm publish --dry-run --json` from `packages/skillpacks/build`.
   - [x] Confirm the dry-run reports `skillpacks@0.1.1`.
   - [x] Run `git diff --check`.
   - [x] Run `npm whoami` against the npm registry and record whether auth is ready.
4. Ship readiness artifacts.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Add a dated history entry and ship manifest.
   - [x] Commit and push intended readiness artifacts on the primary branch if validation allows.

### Acceptance Criteria

- `packages/skillpacks/package.json` and `packages/skillpacks/build/package.json` both report `0.1.1`.
- Generated package checks pass with no stale generated files.
- The dry-run tarball reports `skillpacks@0.1.1`.
- The npm registry does not already contain `0.1.1`.
- The worktree is clean after committing readiness artifacts.
- Full external publish readiness is blocked if npm auth still fails.

### Review Notes

Local package readiness passed for `skillpacks@0.1.1`; the only remaining publish-readiness blocker is npm authentication. `npm whoami` reached `registry.npmjs.org` and returned `E401 Unauthorized`, so a real publish remains out of scope until the intended publisher account is logged in and the publish is explicitly requested.

Ship-end addendum: real publish attempts now run `packages/skillpacks/scripts/prepublish-auth-check.mjs` through `prepublishOnly` before npm upload. The guard skips dry-runs, verifies the expected publisher and maintainer state, and fails early if `skillpacks@0.1.1` already exists. Package staging includes the guard, and package validation passes with 55 Node tests plus `verify:package`.

---

## Current Implementation - Deck-Builder Animation Approval And Routing Spike

### Goal

Consume the approved `animation-design-planner` response for the deck-builder transitions, write the canonical animation plan, convert the alignment page to confirmed, then execute the first deck-builder implementation spike: prove whether shallow `window.history.pushState` keeps a shared client shell mounted while `usePathname` and `popstate` update correctly on Next 16.2.6.

### Scope

- Finalize approved animation artifacts: archive the review page/working packet, write `apps/skills-showcase/docs/animation-plan-deck-builder.md`, confirm `alignment/animation-design-planner-deck-builder-transitions.html`, and update `alignment/index.html`.
- Add prompt-history records for the current `/exec` and animation-plan approval handoff.
- Add only a minimal route spike and proof harness for shallow pushState behavior.
- Do not implement the full deck-builder, card-flight animation, pack-opening retrofit, homepage replacement, deploy flow, GitHub Actions, or unrelated install-routing debt.

### Plan

1. Capture and orient.
   - [x] Read `$exec`, `animation-design-planner` approval handling, task docs, app docs, and the approved alignment page.
   - [x] Capture the visible invocation under `prompts/exec/` and `prompts/animation-design-planner/`.
   - [x] Record this roadmap and active todo before implementation.
2. Finalize approved artifacts.
   - [x] Archive the current review page and non-canonical working packet under `docs/history/archive/2026-06-11/142531/`.
   - [x] Write `apps/skills-showcase/docs/animation-plan-deck-builder.md` from the approved page content and gate answers.
   - [x] Convert `alignment/animation-design-planner-deck-builder-transitions.html` to confirmed with read-only decision records and the approval YAML preserved.
   - [x] Update `alignment/index.html` to mark the entry confirmed.
3. Execute the first implementation spike.
   - [x] Add the smallest route spike that proves shallow `pushState`, `usePathname`, `popstate`, and `/deck/[slug]` hard-load behavior.
   - [x] Add Playwright as local implementation proof tooling if dependency installation succeeds.
   - [x] Add a Playwright spike test or document a dependency/install blocker before shipping.
4. Validate and ship.
   - [x] Run focused app validation, Playwright proof when available, the active alignment-page audit, and `git diff --check`.
   - [x] Record review notes, history, and a quality-gate ship manifest.
   - [x] Commit and push intended changes on the primary branch.

### Acceptance Criteria

- The approved animation plan is canonical in `apps/skills-showcase/docs/animation-plan-deck-builder.md`.
- The active alignment page is confirmed and preserves the exact final approval YAML.
- The non-canonical working packet no longer remains in active `research/skills-showcase/_working/`.
- The routing spike produces executable proof for the load-bearing Next 16.2.6 pushState assumption or records a concrete blocker/redesign trigger.
- No full deck-builder implementation or unrelated P2 install-routing work is included.

---

## Current Implementation - Idea-Scope-Brief Deck-Fit Routing

### Goal

Update `$idea-scope-brief` so completed idea briefs recommend the closest workflow deck, preferring repo-saved deck config when present and falling back to the canonical decks: `vard`, `ord`, `business-afps`, `devtool-afps`, and `game-afps`.

### Scope

- Active skill contract: `global/codex/idea-scope-brief/SKILL.md`.
- Skill archive/version/changelog for `v0.16`.
- Prompt history for this `$targeted-skill-builder` invocation.
- Generated Skills Showcase data because an active `SKILL.md` behavior changed.
- Out of scope: adding a new deck runtime primitive, reading browser localStorage, or changing pack/deck installer implementation.

### Plan

1. Capture and inspect.
   - [x] Read `$targeted-skill-builder`, active lessons, current `idea-scope-brief`, deck docs, repo config, and task docs.
   - [x] Capture the visible invocation under `prompts/targeted-skill-builder/`.
   - [x] Record this roadmap and active todo before implementation.
2. Update the skill contract.
   - [x] Archive `global/codex/idea-scope-brief/SKILL.md` with `scripts/skill-archive.sh`.
   - [x] Bump `version:` from `v0.15` to `v0.16`.
   - [x] Add a `Deck Fit Handoff` rule that reads canonical deck metadata and `.agents/project.json` `saved_decks` / `decks`.
   - [x] Rank deck candidates by domain, tempo, and concept signals.
   - [x] Make high-confidence deck fit the primary `## Next Steps` recommendation, with canonical deck installs using `npx skillpacks install-deck <deck>`.
   - [x] Keep downstream research routing as secondary context after deck selection.
   - [x] Update `CHANGELOG.md` for `v0.16`.
3. Validate and ship.
   - [x] Run focused route text checks and `./scripts/skill-install-routing-audit.sh`.
   - [x] Run standard skill validation and benchmark coverage.
   - [x] Regenerate and validate Skills Showcase data.
   - [x] Run `git diff --check`.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Commit and push intended changes on the primary branch.

### Acceptance Criteria

- A completed idea brief can recommend the best-fit deck as the primary next command when confidence is high.
- Saved repo deck candidates from `.agents/project.json` are considered before canonical fallback decks.
- Canonical deck recommendations use `npx skillpacks install-deck <deck>`.
- Customized saved deck recommendations give explicit pack install guidance unless they preserve a canonical slug.
- Game, lightweight OSS/devtool, deliberate devtool, rapid consumer/business, and deliberate business concepts have explicit default deck routing examples.

---

## Current Implementation - Ship-End Missing CLI Module And Alignment Artifact Cleanup

### Goal

Finish the `$ship-end` wrap-up by committing and pushing the current local artifacts on `master`, while fixing the clean-checkout CLI dependency gap and making previously untracked alignment pages pass the active-page audit.

### Scope

- Include the missing `packages/skillpacks/src/cli/update-check.mjs` module already imported by the tracked `packages/skillpacks/bin/skillpacks.mjs`.
- Finish and index the untracked active alignment pages:
  - `alignment/analyze-sessions-afps-workflow-patterns.html`
  - `alignment/uat-card-pack-migration.html`
- Include the related prompt-history artifacts under `prompts/`.
- Update task/history/manifest files for this shipping boundary.
- Out of scope: changing the published package version, altering the update-check behavior beyond adding the missing module, or deploying the Skills Showcase without an available deploy skill.

### Plan

1. Capture and inspect.
   - [x] Capture the visible `$ship-end` invocation under `prompts/ship-end/`.
   - [x] Inspect git status, unpushed commits, task docs, manual tasks, advisory tasks, and deploy contract.
   - [x] Identify that the tracked CLI entrypoint imports an untracked `update-check.mjs` module.
2. Repair active artifacts.
   - [x] Add alignment-page metadata, TTS includes, and index entries for the two untracked alignment pages.
   - [x] Verify the alignment-page audit passes for the active page set.
   - [x] Reconcile stale task bookkeeping for the already-shipped install-destination output correction.
3. Validate and ship.
   - [x] Run package syntax/package tests, alignment audit, whitespace checks, and ship-boundary review.
   - [x] Record history and the quality-gate manifest.
   - [x] Commit and push intended files on `master`.

### Acceptance Criteria

- A clean checkout has the `update-check.mjs` module required by `packages/skillpacks/bin/skillpacks.mjs`.
- `npm --workspace skillpacks run test:node` passes with the shipped source tree.
- The active alignment-page audit passes with the two new pages indexed.
- Prompt-history artifacts for the shipped skill invocations are tracked.
- No generated local skill roots under `.claude/skills/**` or `.codex/skills/**` are staged.

---

## Current Implementation - Strict Exact Skillpacks Install Resolution

### Goal

Fix `npx skillpacks install exec` so install resolution prefers the exact `exec` skill over the `exec-loop` pack alias, and make install resolution strict: exact active skill name, exact active pack name, or exact active pack title only.

### Scope

- Install/remove argument resolution in `packages/skillpacks/src/cli/pack-normalization.mjs`.
- Focused package tests in `packages/skillpacks/test/pack-normalization.test.mjs` and `packages/skillpacks/test/lifecycle.test.mjs`.
- Prompt/task history for this `$investigate` invocation.
- Out of scope: changing remove alias/fuzzy cleanup behavior, pack lifecycle install/link mechanics, or unrelated dirty worktree files.

### Plan

1. Capture and validate.
   - [x] Capture the visible `$investigate` invocation under `prompts/investigate/`.
   - [x] Read active lessons and task docs.
   - [x] Inspect install resolution code, tests, and recent history.
   - [x] Validate the `exec` alias/skill precedence claim against the current manifest.
2. Implement strict install resolution.
   - [x] Resolve install tokens by exact active skill name first.
   - [x] Resolve exact active pack slugs next.
   - [x] Resolve exact active pack titles using trimmed/collapsed whitespace title matching.
   - [x] Preserve hibernated pack/skill safety diagnostics before unknown-name failure.
   - [x] Leave remove behavior unchanged.
3. Cover regressions.
   - [x] Add unit coverage for `exec`, `exec-loop`, exact pack title, rejected aliases, rejected fuzzy names, and exact skill names.
   - [x] Add lifecycle coverage proving `skillpacks install exec` installs the individual `exec` skill and does not enable `exec-loop`.
4. Validate and ship.
   - [x] Run focused Node test files.
   - [x] Run the package test script if available.
   - [x] Run `git diff --check`.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Commit and push intended changes on the primary branch.

### Acceptance Criteria

- `install exec` resolves to `{ packs: [], skills: ['exec'] }`.
- `install exec-loop` resolves to `{ packs: ['exec-loop'], skills: [] }`.
- `install "Exec Loop Pack"` resolves to `{ packs: ['exec-loop'], skills: [] }`.
- Install aliases such as `quality` and fuzzy names such as `icp` fail with `Unknown pack or skill`.
- Exact skill names such as `enterprise-icp` still install.
- Remove keeps its existing alias/fuzzy cleanup behavior.

---

## Current Implementation - Skillpacks Project-Local Base Init

### Goal

Validate the pack-refresh/global-skill update gap and, if confirmed, add a project-local `npx skillpacks init` path that installs base skills into the target repository so package refreshes can update them without relying on user-home global skill installs.

### Scope

- npm CLI lifecycle code under `packages/skillpacks/src/cli/`.
- Focused package tests under `packages/skillpacks/test/`.
- npm distribution docs: `docs/QUICKSTART.md`, `docs/skillpacks-npm-distribution.md`, and `README.md`.
- Prompt/task history for this `$investigate` invocation.
- Out of scope: removing source-checkout `./init.sh`, renaming the authoring `global/` directory, or changing unrelated dirty worktree files.

### Plan

1. Capture and investigate.
   - [x] Capture the visible `$investigate` invocation under `prompts/investigate/`.
   - [x] Read active lessons and relevant task docs.
   - [x] Inspect current `skillpacks` CLI, pack lifecycle, init, docs, and git history.
   - [x] Validate whether `refresh` touches global/user-home skills.
2. Implement project-local base init.
   - [x] Add a Node-owned `skillpacks init` command that installs global-scope skills as project-local base skills under `.claude/skills` and `.codex/skills`.
   - [x] Track base installation in `.agents/project.json` so `skillpacks refresh` rebuilds base skills from the current package snapshot.
   - [x] Make `doctor` and `prune` account for project-local base skills without deleting unmanaged user content.
   - [x] Keep `init-global` as the explicit user-home global install path.
3. Document and cover.
   - [x] Add focused lifecycle tests for base init, refresh, and prune expectations.
   - [x] Update npm distribution docs and quickstart wording to explain base versus global install paths.
4. Validate and ship.
   - [x] Run focused package tests and package manifest/build checks.
   - [x] Run `git diff --check`.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- `npx skillpacks init` installs base/global-scope skills into the current project's local `.claude/skills` and `.codex/skills` roots.
- `.agents/project.json` records that base skills are enabled.
- `npx skillpacks refresh` refreshes enabled packs, individually enabled skills, and enabled base skills from the installed package snapshot.
- `npx skillpacks init-global` remains available for users who explicitly want user-home global installs.
- Tests prove the base install and refresh behavior without requiring bash or jq.

---

## Current Implementation - Alignment Compile Responses Convention

### Goal

Unify generated alignment-page response compilation so answered gate questions and selected section feedback compile through one bottom `Compile Responses` action, while local section feedback controls stay hidden until a section feedback choice is selected.

### Scope

- Canonical convention: `docs/alignment-page-convention.md` inside the `alignment-convention` block.
- Generated bundles: active generated `ALIGNMENT-PAGE.md` files refreshed only through `node scripts/upgrade-alignment-page.mjs`.
- Focused tests:
  - `tests/layer1/alignment-gates.test.ts`
  - `tests/layer1/upgrade-alignment-pages.test.ts`
- Prompt/task history for this `exec` invocation.

### Plan

1. Capture and plan.
   - [x] Read active repo instructions, lessons, task docs, and relevant alignment-page/test context.
   - [x] Capture the visible invocation under `prompts/exec/`.
   - [x] Record this active roadmap/todo plan before implementation.
2. Update the canonical convention.
   - [x] Replace the separate bottom `Compile Feedback YAML` and `Compile Answers` model with one bottom `Compile Responses` control.
   - [x] Define compiled responses as a mixed YAML payload containing answered gates, selected `section_feedback`, and unanswered required gate count/status for partial responses.
   - [x] Preserve partial response behavior when at least one gate answer or one section feedback item exists.
   - [x] Keep final approval limited to `approval_status: ready-for-agent-review` only when all required gates are answered and no unresolved negative or clarification feedback remains.
   - [x] Require local section feedback textarea, local compile/copy controls, and read-only YAML output to be hidden until emphasize, thumbs-down, or clarification is selected for that section.
   - [x] Require confirmed pages to remove the final `Compile Responses` button, response counters, input controls, and approval-blocking UI.
3. Regenerate and cover.
   - [x] Run `node scripts/upgrade-alignment-page.mjs`.
   - [x] Update focused layer1 assertions for unified response compilation, local feedback visibility, generated bundle wording, and upgrade-page feature wording.
4. Validate and ship.
   - [x] Run `node scripts/upgrade-alignment-page.mjs --check`.
   - [x] Run `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`.
   - [x] Run `pnpm --dir tests exec vitest run --project layer1 layer1/upgrade-alignment-pages.test.ts`.
   - [x] Run `git diff --check`.
   - [x] Record review notes, history, and ship manifest.
   - [x] Commit and push intended files on the primary branch.

### Acceptance Criteria

- Review pages describe one bottom `Compile Responses` control instead of separate bottom compile-feedback and compile-answer controls.
- Compiled response YAML may contain both gate answers and section feedback while preserving the existing gate-answer and `section_feedback` shapes.
- Users can compile partial responses before all required gates are answered when at least one gate answer or one section feedback choice exists.
- Final approval remains blocked unless every required gate is answered and there are no unresolved negative or clarification feedback items.
- Local section feedback UI is hidden until its section feedback button is selected and hides again when deselected.
- Confirmed pages preserve approval records but remove final response compilation controls and approval-blocking UI.
- Generated bundles are in sync with the canonical convention.

---

## Current Implementation - Alignment Browser-Open Fallback Contract

### Goal

Patch the shared generated alignment-page browser-open contract so skills do not fail or choose the wrong fallback when a target repository lacks `scripts/open-html-page.mjs`, especially under WSL where Windows browser bridging is available.

### Scope

- Canonical convention: `docs/alignment-page-convention.md`.
- Generated bundles: active generated `ALIGNMENT-PAGE.md` files under `global/` and `packs/` as produced by `scripts/upgrade-alignment-page.mjs`; installed copies are refreshed by runner install/pack-refresh flows.
- Regression coverage: focused layer1 coverage for the new Browser open wording.
- Evidence basis: current user-provided `$session-triage` report for `$youtube-channel-audit @georgele` browser-open failure and existing WSL lesson in `tasks/lessons.md`.

### Plan

1. Capture context and plan.
   - [x] Read the active `$targeted-skill-builder` and `$session-triage` contracts.
   - [x] Read relevant lessons and task state.
   - [x] Capture the visible invocation under `prompts/targeted-skill-builder/`.
   - [x] Record this plan and the active todo before implementation.
2. Patch the durable contract.
   - [x] Update the canonical Browser open paragraph in `docs/alignment-page-convention.md`.
   - [x] Make the fallback order explicit: helper script when present, WSL PowerShell `file://wsl.localhost/<distro>/...` bridge when available, `xdg-open` when available, then `failed` with absolute path.
   - [x] Preserve existing status reporting semantics: `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.
3. Regenerate and cover.
   - [x] Run `node scripts/upgrade-alignment-page.mjs` to refresh generated bundles.
   - [x] Add or update focused layer1 checks that pin the fallback contract.
4. Validate and ship.
   - [x] Run generated bundle drift checks, skill hygiene checks, focused tests, showcase refresh if needed, and whitespace checks.
   - [x] Record review notes in `tasks/todo.md`.
   - [ ] Commit and push intended files on `master`.

### Acceptance Criteria

- Generated `ALIGNMENT-PAGE.md` Browser open text no longer assumes `scripts/open-html-page.mjs` exists in every target repo.
- The contract requires WSL Windows-browser fallback before Linux `xdg-open`.
- The fallback uses a browser-friendly `file://wsl.localhost/<distro>/...` URI when possible and reports the final status/path.
- Focused tests prove the canonical and generated wording include the helper-existence gate and WSL fallback.
- Validation commands pass or any residual failure is clearly documented with evidence.

### Completion Notes

- Patched the canonical Browser open contract and regenerated 288 generated `ALIGNMENT-PAGE.md` bundles.
- Added layer1 assertions for the helper existence check, WSL PowerShell `file://wsl.localhost` fallback, xdg-open fallback order, and blocked/failed absolute-path reporting.
- Verified the WSL PowerShell fallback command against an existing alignment HTML page; the command exited 0.
- Did not refresh Skills Showcase data in this boundary because no intended `SKILL.md` or `PACK.md` metadata/content changed.

---

## Current Implementation - Research-ish Skill Lifecycle Audit

### Goal

Add a read-only audit for active research-ish skills, generate the inventory report, then remediate only confirmed lifecycle/type drift in focused batches.

### Scope

- Active skill files under `global/**/SKILL.md` and `packs/**/SKILL.md`, excluding `archive/**`.
- Research-ish inclusion signals:
  - `type: research`
  - alignment-page behavior
  - `research/` output language
  - `_working` packet language
  - canonical research/report artifact writes
- Out of scope for this pass:
  - Archived skill snapshots.
  - Broad all-skill remediation unless the research-ish heuristic misses obvious lifecycle violations.
  - P1/P2/P3 install-routing remediation already tracked separately.

### Plan

1. Build the audit inventory.
   - [x] Add `scripts/researchish-skill-lifecycle-audit.mjs`.
   - [x] Support default human summary mode without file writes.
   - [x] Support `--json` machine-readable output for tests.
   - [x] Classify each in-scope skill into exactly one category: `staged-research`, `alignment-document`, `direct-utility`, or `misclassified`.
2. Write the report.
   - [x] Generate `research/researchish-skill-lifecycle-audit.md` from audit output.
   - [x] Include counts by category.
   - [x] List every `misclassified` skill.
   - [x] List every non-research skill with `research/` output language.
   - [x] List every alignment-page skill that appears to belong in `scripts/alignment-skip-list.txt`.
   - [x] List every marker-compliant `type: research` skill that is semantically suspicious.
3. Add regression coverage.
   - [x] Add layer1 coverage for staged markers, skip-list bundles, non-research `_working` misuse, and stable JSON categories/counts.
   - [x] Keep the audit script read-only except when report generation is explicitly redirected by the agent.
4. Remediate after the report exists.
   - [x] For confirmed true research producers, keep the 4-step staged workflow and correct lifecycle metadata.
   - [x] For misclassified skills, change `type:` to the correct existing category while preserving intended behavior.
   - [x] Preserve the non-research `research/` and alignment skip-list candidate queues as report inventory for a later review batch instead of applying broad heuristic edits.
5. Validate and ship.
   - [x] Run generated alignment bundle, layer1, archive/version/dependency, showcase, and whitespace checks.
   - [x] Commit and push intended source, report, task, and generated-data changes on the primary branch.

### Acceptance Criteria

- The audit script can be run as `node scripts/researchish-skill-lifecycle-audit.mjs` and `node scripts/researchish-skill-lifecycle-audit.mjs --json`.
- The report at `research/researchish-skill-lifecycle-audit.md` is generated from current active skill data.
- Layer1 tests cover the audit's output shape and lifecycle invariants.
- Any active `SKILL.md` changes follow archive, version bump, changelog, and generated `ALIGNMENT-PAGE.md` rules.
- Required validation commands either pass or have clearly documented pre-existing/accepted residual risk.

### Completion Notes

- Implemented the read-only audit script and generated the pre-remediation inventory report.
- Reclassified only the four report-backed staged research producers from `analysis` to `research`: mirrored `repo-glossary` and `journey-map`.
- Live audit after remediation reports 142 active `type: research` skills and 0 misclassified skills.
- Broader direct-utility alignment-page candidates remain in the report as a review queue; they were not auto-remediated because the classifier marks candidates, not confirmed behavior changes.
- Validation passed for generated alignment bundles, focused layer1 tests, skill archives/versions/deps, Skills Showcase generated data, and whitespace.

---

## Current Implementation - VARD/ORD Scan Staged Research Contract

### Goal

Upgrade the active VARD and ORD scan skills so they follow the strict scope-first staged research lifecycle already required for business-discovery research skills.

### Scope

- Active skill targets:
  - `packs/vard/codex/vard-scan/SKILL.md`
  - `packs/vard/claude/vard-scan/SKILL.md`
  - `packs/ord/codex/ord-scan/SKILL.md`
  - `packs/ord/claude/ord-scan/SKILL.md`
- Required behavior:
  - Stage 1 performs only minimal scope discovery and creates a `review` alignment page.
  - Stage 2 writes a preliminary `_working` research packet only after scope approval.
  - Stage 3 archives the working packet, writes the approved canonical scan artifact, and confirms the page.
  - Product-path variants use `research/{slug}/_working/...` and `research/{slug}/...` paths.

### Plan

1. Record task/prompt history.
   - [x] Capture the visible user invocation under `prompts/create-agentic-skill/`.
   - [x] Add active roadmap and todo tracking before implementation.
2. Inspect and archive.
   - [x] Read the four active scan skills and the reference staged research pattern.
   - [x] Run `scripts/skill-archive.sh` for the four scan skill directories.
3. Implement the staged contract.
   - [x] Bump each active scan skill from `version: v0.0` to `version: v0.1`.
   - [x] Add `Report-First Approval Gate`, `Staged Research Workflow`, and `Evidence And Feedback Handling`.
   - [x] Preserve lightweight VARD/ORD scan criteria while moving candidate ranking into approved preliminary packets.
   - [x] Add the standard `## Alignment Page` stub.
   - [x] Add `CHANGELOG.md` entries for v0.1 in each skill directory.
4. Regenerate and verify.
   - [x] Run `node scripts/upgrade-alignment-page.mjs`.
   - [x] Refresh Skills Showcase generated data if active `SKILL.md` behavior/metadata changes require it.
   - [x] Run generated bundle drift, active `type: research` staged-workflow audit, targeted marker scans, archive/changelog checks, and whitespace checks.
5. Ship.
   - [x] Record review notes in `tasks/todo.md`.
   - [x] Stage only intended files.
   - [x] Commit and push on `master`.

### Acceptance Criteria

- All four active scan skills include the staged research markers and preliminary packet paths.
- The active `type: research` audit reports 138 active research skills and 0 non-compliant skills.
- Generated `ALIGNMENT-PAGE.md` files exist for all four scan skill directories and pass exact drift check.
- Archive snapshots and changelog entries exist for each bumped skill.
- Recommended next command remains `vard-align` or `ord-align`, but only after final approval and canonical artifact write.

### Completion Notes

- Completed in the VARD/ORD staged scan workflow boundary. Validation covered generated bundle drift, 138 active research skills with 0 staged-workflow non-compliance, target marker/path scans, skill version/archive/dependency/routing hygiene, Skills Showcase data validation, app build, focused alignment-gates layer1 tests, and whitespace.

---

## Current Implementation - Skillpacks CLI Routing Remediation

### Goal

Migrate active skill install-routing language so users see the published npm CLI paths alongside the existing in-agent and source-checkout routes:

- Pack or individual skill install from a project shell: `npx skillpacks install <pack-or-skill>`.
- Deck install from a project shell: `npx skillpacks install-deck <deck>`.

This roadmap schedules the remediation described in `research/skillpack-cli-routing-audit.md`; it does not perform the skill text migration itself.

### Scope

- Audit basis: `research/skillpack-cli-routing-audit.md`.
- Active skill files scanned by the audit: 383.
- Active skill files needing npm-aware install-routing wording: 220.
- P1 global routing/install files: 14 mirrored Claude/Codex skill contracts.
- Existing routes remain valid and must be preserved where relevant:
  - Claude in-agent route: `/pack install <pack-or-skill>`.
  - Codex in-agent route: `$pack install <pack-or-skill>`.
  - Source-checkout route: `scripts/pack.sh install <pack-or-skill>`.

### Remediation Phases

1. Canonical wording and validation design.
   - [x] Define runner-specific dual-route wording for Claude, Codex, individual skill installs, pack installs, source-checkout maintenance, and deck installs.
   - [x] Decide and implement the focused validation rule that prevents install-route text from omitting `npx skillpacks install` or `npx skillpacks install-deck` unless explicitly allowlisted.
   - [x] Keep `scripts/skill-pack-routing-audit.sh` focused on cross-pack availability guards unless extending it is cleaner than adding a dedicated npm-route check.
2. P1 global routing/install skills.
   - [x] Update the 14 global files listed in the audit: `pack`, `skills`, `init-agentic-skills`, `provision-agentic-config`, `afps-status`, `codebase-status`, and `idea-scope-brief` for both Claude and Codex where present.
   - [x] Preserve runner syntax exactly: Claude gets `/pack ...`; Codex gets `$pack ...`; shell guidance gets `npx skillpacks ...`.
   - [x] Preserve `scripts/pack.sh` where the text is explicitly about source-checkout maintenance.
3. P2 repeated `Pack Availability Guard` boilerplate.
   - [ ] Replace repeated pack-availability guard language across the pack-skill buckets listed in the audit.
   - [ ] Apply the canonical wording consistently across mirrored Claude/Codex pack skills.
   - [ ] Avoid one oversized commit by grouping related pack buckets into reviewable batches.
   - Progress shipped: `agent-work-admin`, top-level `business-discovery`, nested `business-discovery` framework, `business-growth`, `business-ops`, `creator-foundation`, `customer-lifecycle`, `devtool`, `exec-loop`, and compact small workflow (`game`, `guided-walkthrough`, `monorepo`, `ord`) buckets.
   - Next bucket: `product-design` pack bucket.
4. P3 bespoke high-traffic follow-up route sections.
   - [ ] Sweep high-traffic workflow skills with custom follow-up route language: `customer-discovery`, `competitive-analysis`, `journey-map`, `positioning`, `user-flow-map`, `ui-interview`, `ux-variations`, `roadmap`, `plan-phase`, `ship`, and `ship-end`.
   - [ ] Distinguish pack installs from deck installs; use `npx skillpacks install-deck <deck>` only when the desired install unit is a deck.
5. Final validation and shipping.
   - [ ] Run skill version, archive, dependency, routing, and whitespace checks.
   - [ ] Refresh Skills Showcase data if any `SKILL.md` metadata or content changes affect generated showcase surfaces.
   - [ ] Record review notes, task history, and shipping metadata.
   - [ ] Commit and push the intended remediation batches.

### Skill Versioning Requirement

Every remediation batch that changes an active `SKILL.md` must follow the repo skill-versioning rules before commit:

- Archive the current skill version with `scripts/skill-archive.sh <skill-dir>` before editing active content.
- Bump the active `SKILL.md` frontmatter `version` for substantive wording changes.
- Update that skill directory's `CHANGELOG.md` where applicable.
- Keep archive snapshots out of active-skill routing scans unless the validation intentionally audits historical files.

### Acceptance Criteria

- The remediation plan references `research/skillpack-cli-routing-audit.md` and covers all 220 flagged active skills, not only the P1 global files.
- P1, P2, and P3 remediation phases are sequenced, checkable, and small enough for reviewable commits.
- Future implementation preserves `/pack`, `$pack`, and `scripts/pack.sh` source-checkout routes while adding npm CLI alternatives.
- Future implementation distinguishes pack installs from deck installs.
- Focused validation prevents future install-route guidance from regressing to in-agent-only or source-checkout-only wording when the npm CLI route is relevant.

---

## Current Implementation - Skillpacks CLI Routing Audit

### Goal

Audit all active repo skills for install-routing text that needs to reflect the published `skillpacks` npm CLI install path.

### Plan

1. Inventory active skill files.
   - [x] Enumerate active `SKILL.md` files under `global/` and `packs/`, excluding `archive/**`.
   - [x] Identify install-routing, pack-availability guard, and missing-skill fallback references.
2. Cross-check current npm contract.
   - [x] Confirm current docs define `npx skillpacks install <pack-or-skill>` and `npx skillpacks install-deck <deck>` as the package install routes.
   - [x] Confirm existing source-checkout routes remain valid.
3. Produce audit inventory.
   - [x] Classify core routing skills separately from repeated pack-availability guard updates.
   - [x] Write the findings and remediation order to `research/skillpack-cli-routing-audit.md`.
4. Verify.
   - [x] Run targeted active-skill route scans.
   - [x] Run the existing cross-pack routing audit.

### Acceptance Criteria

- The audit distinguishes current npm CLI routing gaps from cross-pack recommendation gaps.
- The inventory includes active global and pack skills, excluding archived skill snapshots.
- Recommended remediation order identifies the highest-impact skills first.

---

## Current Implementation - Prompt History Artifact Reconciliation

### Goal

Confirm the pack routing-audit prompt-history artifact is already tracked, then capture the current `$ship` invocation so the repository has no orphaned prompt files.

### Plan

1. Inspect and classify the leftover artifact.
   - [x] Read `prompts/pack/skill-prompt-20260610-195858-skillpack-routing-audit.md`.
   - [x] Confirm it is prompt-history bookkeeping only and contains no obvious secret.
   - [x] Confirm it is already tracked in `7ac9ebc3 docs: audit skillpacks cli routing gaps`.
2. Record this `$ship` invocation.
   - [x] Create the `prompts/ship/` capture for `$ship`.
3. Ship the bookkeeping boundary.
   - [x] Update task/history notes and manifest.
   - [x] Commit and push only prompt/task/history/manifest files.

### Acceptance Criteria

- Prompt-history artifacts are tracked and pushed.
- No source, generated runtime, skill metadata, package, or deploy surface is included.
- Deploy is skipped unless the shipped boundary is deploy-relevant and explicitly authorized.

---

## Current Implementation - P1/P2 Verification Rerun

### Goal

Rerun the already-shipped P1 docs remediation and P2 Skills Showcase count reconciliation checks from 2026-06-10, fixing only confirmed drift if the rerun finds it.

### Plan

1. Re-verify P1 docs remediation.
   - [x] Capture the visible `$exec p1 and p2 again` invocation.
   - [x] Re-run scoped stale-route, install-wording, publication-wording, historical-label, wrapper, alignment-page, generated-bundle, focused layer1, and whitespace checks.
2. Re-verify P2 count reconciliation.
   - [x] Re-run skill-map generator syntax and regeneration.
   - [x] Re-run scoped stale-count and retired-route scans.
   - [x] Confirm generated count terms still match current generated data.
3. Record and ship.
   - [x] Record the clean rerun in task docs, history, and ship manifest.
   - [x] Leave P1/P2 remediation files unchanged when no drift is found.

### Acceptance Criteria

- P1/P2 rerun validations pass with no confirmed drift.
- Only prompt/task/history/manifest artifacts change for this verification-only rerun.
- Deploy decision is explicit and does not deploy production without confirmation.

---

## Current Implementation - P1 Docs Remediation Pass

### Goal

Fix the P1 public documentation issues reported by the 2026-06-10 repo documentation alignment audit: managed-copy install wording, the missing root init helper path, retired `icp` executable routes in current guidance, and the old npm strategy page being indexed like current usage guidance.

### Plan

1. Track the remediation request.
   - [x] Capture the visible `exec` invocation in `prompts/exec/`.
   - [x] Add active roadmap and todo entries before substantive edits.
2. Remediate P1 public-doc issues.
   - [x] Update setup/troubleshooting/script docs so track-latest installs are described as managed copies/directories and pinned archives are the symlink case.
   - [x] Add a root `scripts/init-agentic-skills.sh` wrapper that delegates to the bundled `init-agentic-skills` launcher.
   - [x] Replace retired executable `icp` route examples in current docs, specs, and indexed alignment pages with `customer-discovery`, while preserving `enterprise-icp` and `research/icp.md` artifact references.
   - [x] Mark the old npm distribution strategy page and index card as historical/superseded for package usage, with the current walkthrough as the usage reference.
3. Verify and ship.
   - [x] Run targeted drift scans for stale install wording, missing helper path, retired executable routes, and historical npm page labeling.
   - [x] Run alignment-page audit, root wrapper smoke checks, and whitespace checks.
   - [x] Record review notes, update history, commit, and push intended remediation artifacts only.

### Acceptance Criteria

- The documented root helper path exists and supports the documented subcommands.
- Current public docs no longer describe active track-latest installs as symlinks.
- Current route guidance points to `customer-discovery` instead of retired executable `icp`, except for intentional artifact references such as `research/icp.md` and separate skills such as `enterprise-icp`.
- The old npm strategy page is still preserved but clearly marked historical/superseded for package usage in both the page and index.
- Validation output is recorded with warnings fixed, explicitly accepted, or reported.

---

## Current Implementation - P2 Skills Showcase Count Reconciliation

### Goal

Resolve the remaining P2 documentation drift from the 2026-06-10 docs audit: Skills Showcase planning docs and alignment pages still mix old 157/156/38 display-card counts with current generated inventory counts.

### Plan

1. Reconcile remaining P2 Skills Showcase count docs.
   - [x] Define count terms from generated data: platform entries, unique mirrored skills, unique pack skills, unique global skills, active packs, and display cards.
   - [x] Update stale count references in current Skills Showcase docs and indexed alignment pages, including `tasks/pack-card-hierarchy.md`, `alignment/skillmap.html`, `apps/skills-showcase/docs/deck-builder-ux.md`, `research/skills-showcase/idea-brief.md`, `research/skills-showcase/idea-brief-interview.md`, and `alignment/idea-scope-brief-skills-showcase.html` as confirmed by fresh scans.
   - [x] Preserve historical counts only when explicitly labeled historical/prototype scope.
   - [x] Run generated-data parsing, alignment-page audit, targeted count scans, and whitespace checks.
   - [x] Record review notes, update history, commit, and push intended changes only.

### Acceptance Criteria

- Current count-bearing docs distinguish generated platform entries from unique mirrored skills, unique pack skills, unique global skills, packs, and any historical display-card scope.
- Targeted scans no longer find unlabeled stale `157`, `156 pack skills`, or `38 packs` claims in current Skills Showcase docs/pages.
- Alignment-page validation and whitespace checks pass.

---

## Current Implementation - Repo Documentation Alignment Audit

### Goal

Audit the repository's documentation surfaces for inconsistencies across workflow rules, skill packaging, npm usage, deck/pack naming, alignment-page conventions, generated artifacts, and project tracking docs.

### Plan

1. Track the audit request.
   - [x] Capture the visible `devtool-docs-audit` invocation in `prompts/devtool-docs-audit/`.
   - [x] Add active roadmap and todo entries before substantive audit work.
2. Inventory documentation surfaces.
   - [x] Enumerate Markdown, HTML alignment, package docs, skill docs, prompt/task docs, and generated docs that should be checked.
   - [x] Identify canonical sources versus generated or historical artifacts to avoid false positives.
3. Cross-check likely drift vectors.
   - [x] Compare CLI command names and npm/package usage across root docs, package docs, skill docs, and alignment pages.
   - [x] Compare deck/pack names and counts across docs, manifests, generated maps, and package tests.
   - [x] Compare alignment-page convention requirements across canonical docs, generated bundles, active HTML pages, and audit scripts.
   - [x] Compare workflow/git/shipping instructions across `AGENTS.md`, `CLAUDE.md`, and repo docs.
4. Produce audit artifacts.
   - [x] Write findings-first documentation audit output.
   - [x] Build a `review` alignment page with evidence matrix, assumptions, gaps, and approval/feedback controls.
   - [x] Update the central alignment index and task review notes.
5. Verify and ship intended work.
   - [x] Run relevant documentation and alignment validators.
   - [x] Run whitespace checks and review the diff.
   - [x] Commit and push intended audit artifacts without staging unrelated pre-existing work.

### Audit Summary

- Found no P0 documentation failure.
- P1 issues: active install docs still use symlink wording; `scripts/init-agentic-skills.sh` is documented but missing at the root; retired `icp` route references remain in current docs and indexed alignment pages; the older npm strategy page remains indexed like current guidance despite stale package examples.
- P2 issues: npm docs still include future/release-candidate wording after `skillpacks@0.1.0` publication; Skills Showcase count docs conflict with current generated data.
- Deliverables: `research/devtool-docs-audit.md`, `alignment/devtool-docs-audit-documentation-alignment.html`, and an updated `alignment/index.html` entry.
- Shipped in commit `73c828b6` on `master`; follow-up task-state cleanup recorded after push.

---

## Current Implementation - Skillpacks npm Package Walkthrough Alignment Page

### Goal

Create a current document-tier alignment page that explains how to use the published `skillpacks` npm package today, while leaving the existing npm distribution strategy page as historical strategy context.

### Plan

1. Track the active work.
   - [x] Add the active roadmap and todo entries before implementation.
2. Add the walkthrough page.
   - [x] Create `alignment/skillpacks-npm-package-walkthrough.html` with confirmed status, document-tier metadata, responsive viewport, TTS include, and current `skillpacks@0.1.0` / `latest` package status.
   - [x] Cover prerequisites, first-use flow, generated files, remove/update flow, versioning, published-package verification, and troubleshooting.
   - [x] Link to the current Markdown docs for deeper reference.
3. Update the central index.
   - [x] Add a dated Product Design & Spec card for the walkthrough page.
   - [x] Keep index counts and metadata consistent with the existing card format.
4. Verify and ship.
   - [x] Run `node scripts/audit-alignment-pages.mjs`.
   - [x] Run `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts`.
   - [x] Run `git diff --check`.
   - [x] Spot-check command examples and package-version wording.
   - [x] Record review notes, commit, and push intended changes.

---

## Current Implementation - Published Skillpacks npm Smoke Script

### Goal

Capture the manual `npx --package skillpacks@latest -- skillpacks ...` verification into a repeatable repo script that checks published-package install, remove, doctor, pin, and unpin behavior from isolated `/tmp` projects without using the local checkout as the CLI source.

### Plan

1. Add a package-owned smoke script.
   - [x] Create a reusable script under `packages/skillpacks/scripts/`.
   - [x] Resolve the published package through `npx --package skillpacks@latest`.
   - [x] Use `/tmp/skillpacks-npm-cache` by default and isolated `mktemp` project directories.
2. Cover the manual verification matrix.
   - [x] Assert npm metadata against the package name/version/license.
   - [x] Verify `list`, pack install, individual skill install, deck install, and `doctor`.
   - [x] Verify pack, individual skill, and deck-backed pack removal.
   - [x] Verify skill-level pin to `v0.0`, unpin back to latest, and unsupported direct `install name@version` syntax.
3. Wire and validate.
   - [x] Add npm script entry points for package and root invocation.
   - [x] Run the new script against the published npm package.
   - [x] Run focused package tests and whitespace checks.
   - [x] Commit and push intended changes.

### Acceptance Criteria

- The script fails on any missing generated `.agents/project.json`, `.claude/skills/*/SKILL.md`, `.codex/skills/*/SKILL.md`, expected metadata, removal cleanup, or pin/unpin regression.
- The script uses only `/tmp` temp projects and does not modify the local checkout except for tracked script/task/package metadata edits.
- Temp directories are kept by default and printed for inspection.

## Current Implementation - Alignment Diff Highlighting Convention

### Goal

Clarify the shared alignment-page convention so any update to an existing HTML alignment page visibly highlights the changed content in the rendered page, making it obvious that the page was amended from a prior version.

### Plan

1. Update the canonical convention.
   - [x] Revise `docs/alignment-page-convention.md` inside the `alignment-convention` markers.
   - [x] Make clear that change indicators must be visible in the HTML itself.
   - [x] Define acceptable treatments such as inline badges, highlighted blocks, or side-by-side before/after sections.
2. Regenerate bundled docs.
   - [x] Preview bundle changes with `node scripts/upgrade-alignment-page.mjs --dry-run`.
   - [x] Regenerate bundled `ALIGNMENT-PAGE.md` files from the canonical source.
   - [x] Confirm generated bundles are exact with `node scripts/upgrade-alignment-page.mjs --check`.
3. Verify and ship.
   - [x] Run whitespace/diff checks and focused convention verification.
   - [x] Review the diff for unintended generated drift.
   - [x] Commit and push the intended changes only.

---

## Current Implementation - Alignment Pages Game AFPS Refresh

### Goal

Archive stale active alignment pages that still frame the workflow model as the old four-pipeline/four-deck matrix, then replace the active pages with Game AFPS-aware versions while preserving stable links, page-specific gates, metadata, and TTS behavior.

### Plan

1. Preserve the old active artifacts.
   - [x] Archive `alignment/workflow-design-three-pipelines.html`.
   - [x] Archive `alignment/idea-scope-brief-npm-distribution.html`.
   - [x] Archive `alignment/idea-scope-brief-skills-showcase.html`.
2. Refresh active alignment pages.
   - [x] Update the workflow-design page to the five-deck model: VARD, ORD, Business AFPS, Devtool AFPS, and Game AFPS.
   - [x] Update the npm distribution page's deck-installation section and gate to include Game AFPS.
   - [x] Update the Skills Showcase deck-builder page to use five canonical decks.
   - [x] Add visible amendment notes to the three active pages.
3. Refresh index and task documentation.
   - [x] Update `alignment/index.html` title/search metadata for the amended pages.
   - [x] Record archive paths and replacement rationale in task history.
4. Verify and ship.
   - [x] Verify every active page has a matching archive copy.
   - [x] Scan changed pages for preserved titles/context, decisions, gates, assumptions, proposed file changes, and TTS script.
   - [x] Run stale deck wording scans and `git diff --check`.
   - [x] Commit and push intended changes only.

---

## Current Implementation - Game AFPS Deck Model

### Goal

Add `game-afps` as a first-class deliberate deck over the existing `game` pack, so docs, install-deck manifest metadata, and skill-map visuals no longer treat game work as a Business AFPS sub-row.

### Plan

1. Update canonical deck docs and workflow docs.
   - [x] Add Game AFPS to `docs/decks.md`.
   - [x] Add Game AFPS to `docs/skillpacks-npm-distribution.md`.
   - [x] Update live Skills Showcase research references from four decks to five decks.
2. Update package metadata.
   - [x] Add `game-afps` to `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.
   - [x] Add a package test that asserts Game AFPS resolves to the `game` pack and carries the right registry tags.
3. Regenerate derived artifacts.
   - [x] Regenerate `packages/skillpacks/dist/skillpacks-manifest.json`.
   - [x] Regenerate package build docs/manifest if `build:check` requires it.
   - [x] Regenerate skill-map artifacts after moving `game` into its own Game AFPS row.
4. Verify and ship.
   - [x] Run package tests and manifest/build checks.
   - [x] Run whitespace checks and review the diff.
   - [x] Commit and push the intended changes.

## Current Implementation - Skillpacks npm Distribution Phase 3

### Goal

Reduce the `skillpacks` npm package's dependency on bash/jq by porting deterministic project-config behavior to Node first, then keeping the remaining install/link/drift commands on the tested `pack.sh` fallback until parity is implemented in later steps.

### Phase 3 Plan

1. Node project config parity.
   - [x] Add package-owned Node helpers for `.agents/project.json` reads and writes.
   - [x] Route `list-packs`, `status`, `set-mode`, and `set-update-mode` through Node without requiring `bash` or `jq`.
   - [x] Preserve unrelated project config fields on writes.
   - [x] Add package-owned tests that run with `PATH` emptied to prove no shell/JQ dependency.
2. Pack normalization and alias parity.
   - [x] Port pack alias normalization and hibernated-pack diagnostics.
   - [x] Keep `pack.sh` and Node command output aligned for supported aliases.
3. Install/remove/refresh parity.
   - [x] Port pack and individual skill install/remove/refresh logic.
   - [x] Preserve `.agentic-skills-managed` marker creation and content hash behavior.
4. Locking and drift parity.
   - [x] Port `.agents/.pack.lock` handling.
   - [x] Port `doctor`, `pin`, `unpin`, and `prune`.
5. Compatibility closure.
   - [x] Keep `scripts/pack.sh` as a wrapper or tested fallback.
   - [x] Run temp-repo parity tests against Node and bash paths before removing any fallback dependency.

### Current Step

- [x] Step 3.1: Node Project Config Parity.
- [x] Step 3.2: Pack Normalization And Alias Parity.
- [x] Step 3.3: Install/Remove/Refresh Parity.
- [x] Step 3.4: Locking And Drift Parity.
- [x] Step 3.5: Compatibility Closure.

## Current Implementation - Skillpacks npm Distribution Phase 4

### Goal

Prepare the `skillpacks` npm package for a dry-run release by tightening package-included documentation and verification without publishing to npm or changing the existing git-checkout setup path.

### Phase 4 Plan

1. Documentation readiness.
   - [x] Update package-included docs with npm usage and git-checkout usage.
   - [x] Add migration guidance for users moving from a local clone to `npx skillpacks`.
   - [x] Add troubleshooting for npm package semver vs skill-level pinning.
   - [x] Preserve explicit "no real publish in Phase 4" language.
2. Documentation contracts.
   - [x] Add or extend package-owned tests that pin the release-readiness documentation language.
   - [x] Keep command ownership/dependency docs aligned with the CLI compatibility matrix.
3. Dry-run release checks.
   - [x] Run package staging and tarball dry-run inspection.
   - [x] Run `npm publish --dry-run` locally without publishing.
   - [x] Record dry-run output in the ship manifest.
4. Ship.
   - [x] Run package docs tests, package staging checks, dry-run release checks, and whitespace checks.
   - [x] Update review notes and history.
   - [x] Commit and push intended Phase 4 changes only.

### Current Step

- [x] Step 4.1: Documentation readiness.
- [x] Step 4.2: Documentation contracts.
- [x] Step 4.3: Dry-run release checks.
- [x] Step 4.4: Ship.

## Current Implementation - Skillpacks npm Distribution Phase 5

### Goal

Publish the first stable public `skillpacks` npm package after release validation, then verify the published package can be used from a fresh project without cloning this repository.

### Phase 5 Plan

1. Release preflight.
   - [x] Run package tests and package staging checks.
   - [x] Inspect the staged tarball boundary and denied paths.
   - [x] Re-check npm registry state for `skillpacks`.
   - [x] Run whitespace checks.
   - [x] Fix MIT license metadata, npm repository links, staged package metadata, and package metadata coverage.
2. External publish gate.
   - [x] Confirm the exact publish boundary: `skillpacks@0.1.0`, public access, MIT metadata, npm links, and `packages/skillpacks/build` as the publish root.
   - [x] Run `npm publish --access public` only after explicit confirmation.
3. Published-package verification.
   - [x] Verify `npx skillpacks@latest list` against npm.
   - [x] In a fresh temp project, install one pack, one individual skill, and one deck from the published package.
   - [x] Verify the git-checkout install path remains functional.
4. Ship.
   - [x] Record release evidence in a ship manifest.
   - [x] Update review notes and history.
   - [x] Commit and push intended Phase 5 changes only.

### Current Step

- [x] Step 5.1: Release preflight.
- [x] Step 5.1b: MIT metadata prepublish fix.
- [x] Step 5.2: External publish gate after metadata validation.
- [x] Step 5.3: Public npm publish.
- [x] Step 5.4: Published-package verification.
- [x] Step 5.5: Commit and push post-publish evidence.

---

## Current Implementation - Dated Alignment Index Entries

### Goal

Require central alignment index entries to carry dated metadata from each page's alignment review/confirmation date, then regenerate bundled per-skill alignment convention docs from the canonical source.

### Plan

1. Update the canonical convention.
   - [x] Revise `docs/alignment-page-convention.md` inside the `alignment-convention` markers.
   - [x] Require `YYYY-MM-DD` dates in muted meta spans after index links.
   - [x] Preserve existing entry dates and define how to fill missing dates.
   - [x] Clarify `new` marker behavior with dated meta text.
2. Regenerate and verify bundled docs.
   - [x] Preview bundle changes with `node scripts/upgrade-alignment-page.mjs --dry-run`.
   - [x] Regenerate bundled `ALIGNMENT-PAGE.md` files.
   - [x] Re-run dry-run and confirm no pending updates.
3. Ship.
   - [x] Review generated diff and run whitespace checks.
   - [x] Commit the convention and regenerated files together.

## Current Implementation - Research Scope Approval Before Alignment Research

### Goal

Ensure active research-producing skill flows do not synthesize research before the user approves the alignment page's research scope. The scope is active `global/` and `packs/` source skills only, excluding archive snapshots, generated installed copies, and hibernated packs.

### Plan

1. Preserve context and audit the affected surface.
   - [x] Capture prompt history for the active skill update.
   - [x] Confirm repository context and working-tree state.
   - [x] Re-read the shared alignment-page convention, existing tests, and active affected skill list.
2. Implement the contract change.
   - [x] Update `docs/alignment-page-convention.md` so Stage 1 is minimal scope discovery, not synthesized research.
   - [x] Regenerate bundled `ALIGNMENT-PAGE.md` files from the canonical convention.
   - [x] Patch active `SKILL.md` report-first and staged-research wording to require scope approval before synthesized research.
3. Preserve skill version history.
   - [x] Archive changed active `SKILL.md` files before version bumps.
   - [x] Bump changed skill versions and update each skill `CHANGELOG.md`.
   - [x] Add a lesson preventing research synthesis before alignment-scope approval.
4. Validate and ship.
   - [x] Update focused layer1 tests for scope-approval-before-research behavior.
   - [x] Refresh generated showcase data if required by skill metadata changes.
   - [x] Run the requested generator, test, version, archive, dependency, showcase, and diff checks.
   - [ ] Commit and push the intended changes only.

## Current Implementation - YouTube Prelaunch Audit Skill

### Goal

Create a mirrored `youtube-ops` pack skill for auditing unlisted pre-release YouTube videos before launch. The skill should decide whether a video needs further editing or polish and produce launch-readiness recommendations for title, thumbnail, description, chapters, social cross-sharing, and publish strategy.

### Plan

1. Preserve invocation context and inspect overlap.
   - [x] Capture prompt history for the active skill-building workflows.
   - [x] Locate the existing `youtube-video-audit` skill and confirm its post-release performance-audit scope.
   - [x] Compare related YouTube pack skills for routing and naming overlap.
2. Implement the pack skill.
   - [x] Create mirrored Codex and Claude `youtube-video-prelaunch-audit` skill directories in `packs/youtube-ops/`.
   - [x] Reuse the existing YouTube research-stage, feedback, alignment, handoff, and pack-availability conventions.
   - [x] Update `PACK.md`, the YouTube router if needed, and benchmark coverage fixtures.
3. Validate and ship.
   - [x] Run focused skill metadata and route checks.
   - [x] Run benchmark coverage validation and focused layer1 setup tests.
   - [x] Refresh Skills Showcase data if required by changed skill metadata.
   - [x] Update review notes, commit, and push intended changes only.

## Current Investigation - ALIGNMENT-PAGE Bundling Drift

### Goal

Investigate why per-skill `ALIGNMENT-PAGE.md` bundles drift from the shared alignment-page convention, determine whether bundling can be consolidated, and propose a fix plan without implementing source changes until approved.

### Findings

1. The canonical convention is `docs/alignment-page-convention.md` between the `alignment-convention` markers. `scripts/upgrade-alignment-page.mjs` renders that block into sibling `ALIGNMENT-PAGE.md` files for alignment-producing skills, substituting `{skill-name}` and injecting skill-specific gates, visual tier, and glossary gates.
2. The current generator is not a pure path-substitution renderer. After normalizing the output path/header slug, active `global/` and `packs/` bundles still produce 133 unique variants across 260 active `ALIGNMENT-PAGE.md` files because generated skill-specific gates are embedded in the files.
3. The generator dry-run reports no generated drift, but a direct path audit found one current stale bundle: `packs/business-discovery/codex/customer-discovery/ALIGNMENT-PAGE.md` still says `icp` and uses `alignment/icp-{topic}.html`, while the skill now outputs `alignment/customer-discovery-{topic}.html`.
4. That stale bundle is missed because `packs/business-discovery/codex/customer-discovery/SKILL.md` has a bespoke `## Alignment Page` paragraph. The generator only treats two exact section-opening patterns as ownable, so a sibling bundle can exist and remain stale while dry-run still passes.
5. The retrospective claim that positioning had a separate pre-standard local-compile template is not supported as stated by current git history. Positioning has generated positioning-specific gates, but local per-section compile controls appear to have landed with the shared convention change rather than in an independently maintained positioning template.
6. The "no skill invoked" gap is real. `upgrade-alignment-pages` can audit or upgrade existing HTML pages when explicitly invoked, but no hook or root instruction currently forces direct edits of `alignment/*.html` to consult the current convention.

### Recommendation

Keep per-skill bundles for the near-term because single-skill installs copy individual skill directories and need the load-on-demand convention to travel with the skill. Do not fully eliminate `ALIGNMENT-PAGE.md` copies until the installer/runtime has a shared-resource mechanism that also works for single-skill installs outside this repo.

Consolidate by making the repo source of truth stricter instead of relying on silent regenerated copies:

1. Treat generated `ALIGNMENT-PAGE.md` files as rendered artifacts owned by `scripts/upgrade-alignment-page.mjs`, and make drift checks fail when a sibling bundle is not generator-owned.
2. Move toward a thinner generated wrapper where possible: the shared convention stays in `docs/alignment-page-convention.md`, while skill-specific exceptions are centralized as generator metadata instead of hand-maintained text.
3. Convert or explicitly register bespoke alignment sections so they are either generated from the same convention or covered by dedicated tests.

### Implementation Plan

1. Fix the known stale bundle path by making the Codex `customer-discovery` alignment section generator-ownable and regenerating its `ALIGNMENT-PAGE.md`.
2. Harden `scripts/upgrade-alignment-page.mjs` so an active skill cannot have a sibling `ALIGNMENT-PAGE.md` while being silently classified as bespoke. The script should either own and refresh it or fail with a clear diagnostic.
3. Add a path-consistency validator: every active generated `ALIGNMENT-PAGE.md` must use the containing skill directory name in `alignment/{skill-name}-{topic}.html`.
4. Add a variant/drift validator that compares every generated bundle with the generator's expected render, after the allowed path/header substitution and centralized skill metadata.
5. Audit the 15 current bespoke `## Alignment Page` sections. Convert them to generated stubs where they are ordinary alignment producers; otherwise add an explicit allowlist plus tests for the local and bottom feedback controls.
6. Address direct-edit non-conformance by adding an HTML alignment-page audit command or extending `upgrade-alignment-pages` with a scriptable check mode, then reference that check from root instructions for direct `alignment/*.html` edits.

### Verification Plan

1. `node scripts/upgrade-alignment-page.mjs`
2. `node scripts/upgrade-alignment-page.mjs --dry-run`
3. New path/variant audit command added by the implementation.
4. Targeted layer1 tests for alignment gates, positioning alignment contract, and upgrade-alignment-pages behavior.
5. `git diff --check`

### Approval Gate

No source fix has been implemented yet. Proceed only after approval of this plan.

## Current Implementation - Separate Skills Showcase From Skillpacks Package

### Goal

Keep one git repository while separating the public Skills Showcase app from the publishable `skillpacks` npm package. `global/` and `packs/` remain the canonical skill sources, with a shared internal catalog layer used by both consumers.

### Execution Profile

- Parallel mode: serial
- Rationale: workspace metadata, package staging, generator paths, and verification boundaries all share repository-level paths and should be integrated in one lane.

### Plan

1. Workspace setup.
   - [x] Rewrite the root `package.json` as private workspace metadata for `agentic-skills`.
   - [x] Add workspace recognition for `apps/skills-showcase` and `packages/skillpacks`.
   - [x] Keep existing `pnpm --dir apps/skills-showcase ...` commands working during the transition.
2. Package relocation.
   - [x] Move the `skillpacks` CLI and source code under `packages/skillpacks/`.
   - [x] Add `packages/skillpacks/package.json` with the publishable package metadata.
   - [x] Add a package build script that stages only package-owned code, canonical skill sources, required install scripts, and selected docs into `packages/skillpacks/build/`.
   - [x] Make source-checkout CLI execution and staged package execution both resolve `pack.sh` and `init.sh` correctly.
3. Website relocation.
   - [x] Move Skills Showcase data generators and validator under `apps/skills-showcase/scripts/`.
   - [x] Keep generated outputs under `apps/skills-showcase/public/assets/`, the temporary `docs/skills-showcase/assets/` mirror, and the website-owned benchmark matrix.
   - [x] Update commands, comments, and documentation to identify these files as website-owned.
4. Shared catalog extraction.
   - [x] Add `scripts/catalog/*.mjs` helpers for frontmatter parsing, pack/skill scanning, archive discovery, benchmark report discovery, and content hashing.
   - [x] Update the website generators and package staging script to read through this internal catalog layer.
   - [x] Keep the catalog layer read-only.
5. Verification and shipping.
   - [ ] Add package boundary checks so package verification does not mutate website-owned generated assets.
   - [ ] Run package, website, repository integrity, boundary, and tarball exclusion checks.
   - [ ] Record review notes in `tasks/todo.md` and history, then commit and push intended changes.

## Current Implementation - Skillpacks npm Distribution Phase 2

### Goal

Add generated package metadata that makes deck installation COA B/C-shaped: a manifest with pack, skill, and deck metadata; a manifest validator; `skillpacks list --json`; and `skillpacks install-deck <deck>` materialized through the current monolith backend.

### Execution Profile

- Parallel mode: serial
- Rationale: manifest generation, CLI behavior, and package boundary validation share the same files and should be integrated in one lane.

### Plan

1. Manifest generator.
   - [x] Add `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.
   - [x] Generate `packages/skillpacks/dist/skillpacks-manifest.json` from `global/`, `packs/`, `PACK.md`, and `SKILL.md` frontmatter.
   - [x] Include pack names, skill names, tools, versions, content hashes, archive versions, source paths, and status.
   - [x] Include deck metadata for `vard`, `ord`, `business-afps`, and `devtool-afps` with package-list and registry-tag fields.
2. CLI integration.
   - [x] Include `packages/skillpacks/dist/skillpacks-manifest.json` in the package allowlist.
   - [x] Add `skillpacks list --json` using the manifest.
   - [x] Add `skillpacks install-deck <deck>` and `skillpacks install-deck business-afps --full`.
   - [x] Preserve `pack.sh` forwarding for all existing commands.
3. Validation.
   - [x] Add manifest `--check` validation for existing paths, version fields, deck pack references, package-list fields, and registry-tag fields.
   - [x] Add targeted executable checks for manifest generation and deck install resolution.
   - [x] Run package dry-run and temp consumer install checks.
   - [x] Avoid skill/pack catalog generated-data changes when tracked `SKILL.md` / `PACK.md` metadata does not change.

## Current Implementation - Skillpacks npm Distribution Phase 0/1

### Goal

Make the first npm distribution artifact real without publishing: add root package metadata, add a thin `skillpacks` CLI wrapper over existing install scripts, prove it works locally and in a temp consumer project, and verify the npm tarball boundary.

### Execution Profile

- Parallel mode: serial
- Rationale: package metadata, CLI wrapper, task docs, and verification all share the same shipping boundary; parallel write lanes would add coordination cost without reducing risk.

### Plan

1. Preserve invocation and active task state.
   - [x] Capture the visible `exec` invocation under `prompts/exec/`.
   - [x] Inspect the approved npm distribution design and existing script contracts.
   - [x] Record the active implementation phase in `tasks/todo.md`.
2. Phase 0 preflight.
   - [x] Re-check safe npm registry/account information for `skillpacks` without publishing.
   - [x] Confirm license/package metadata choice based on repository files.
   - [x] Document that real `npm publish` is out of scope for this pass.
3. Phase 1 implementation.
   - [x] Add root `package.json` for `skillpacks`.
   - [x] Add `bin/skillpacks.mjs`.
   - [x] Add `src/cli/run-pack-script.mjs` or equivalent dispatcher.
   - [x] Forward current `pack.sh` commands while preserving consumer project `cwd`.
   - [x] Implement `init-global` by invoking packaged `init.sh`.
   - [x] Add dependency checks for `bash` and write-command `jq`.
4. Verification and ship.
   - [x] Verify `node bin/skillpacks.mjs list`.
   - [x] Verify temp consumer repo install/status/doctor behavior.
   - [x] Run `npm pack --dry-run`.
   - [x] Run targeted existing repository checks appropriate for package metadata.
   - [x] Update review notes, history, commit, and push intended changes.

## Current Revision — Skillpacks Deck Metadata Approval

### Goal

Update the already-shipped `skillpacks` npm distribution design to honor the newer deck-installation approval: overall strategy still starts with COA A, but deck installation should be shaped by COA B/C package-list and registry-tag semantics.

### Plan

1. Preserve invocation context.
   - [x] Capture the visible `idea-scope-brief` approval YAML under `prompts/idea-scope-brief/`.
   - [x] Compare the new approval against the previously shipped roadmap prompt.
2. Revise the design artifact.
   - [x] Update `docs/skillpacks-npm-distribution.md` so deck installation is modeled as manifest metadata, not opaque monolith presets.
   - [x] Keep COA A as the first package transport while making `install-deck` a resolver over COA B/C-compatible metadata.
   - [x] Update the live deck documentation sentence that referenced npm install presets.
3. Track and verify.
   - [x] Record current-phase work in `tasks/todo.md`.
   - [x] Verify the design doc contains the revised deck approval, manifest resolver, package-list fields, and registry-tag fields.
   - [x] Run `git diff --check`.

## Current Revision — Skillpacks npm Distribution Design

### Goal

Turn the approved npm-distribution alignment decision into a detailed design doc and implementation roadmap for `skillpacks`, without starting package implementation in this pass.

### Plan

1. Preserve invocation context and approval inputs.
   - [x] Capture the visible `idea-scope-brief` approval YAML under `prompts/idea-scope-brief/`.
   - [x] Read the approved alignment page and gate answers.
   - [x] Inspect existing pack, deck, install, and versioning docs.
2. Produce the design artifact.
   - [x] Write `docs/skillpacks-npm-distribution.md`.
   - [x] Preserve approved decisions: `skillpacks`, hybrid COA A first, skill-level pinning, deck presets first.
   - [x] Add current npm registry preflight findings for `skillpacks` and `agentic-skills`.
3. Track the implementation route.
   - [x] Record current-phase work and review notes in `tasks/todo.md`.
   - [x] Verify the doc contains the approved decisions, phase roadmap, and no implementation drift.
4. Ship.
   - [x] Run targeted verification and `git diff --check`.
   - [x] Commit and push intended changes only, leaving unrelated worktree changes untouched.

## Current Revision — npm Distribution Deck Installation Gate

### Goal

Revise `alignment/idea-scope-brief-npm-distribution.html` so deck-based installation is part of the active review surface and has an explicit approval gate before final YAML compilation.

### Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `investigate` invocation under `prompts/investigate/`.
   - [x] Validate the user claim against the alignment page and recent deck documentation.
   - [x] Record validation and review results in `tasks/todo.md`.
2. Apply the minimal alignment-page fix.
   - [x] Move the deck-based installation section before the review gates so it is part of the reviewed body.
   - [x] Add a required deck-installation approval gate covering COA A/B/C behavior.
   - [x] Refresh page/index metadata only where needed.
   - [x] Add a lesson for future addenda that introduce new decisions.
3. Verify and ship.
   - [x] Run targeted string/structure checks and `git diff --check`.
   - [x] Confirm the compiled gate list includes the new deck-installation gate.
   - [x] Commit and push the intended tracked changes while leaving unrelated work untouched.

## Current Revision — Workflow Design Alignment Chart Clipping

### Goal

Revise `alignment/workflow-design-three-pipelines.html` so the rapid pipeline graduation routing chart in the Graduation Path section is fully visible and not cut off on the right side.

### Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `investigate` invocation under `prompts/investigate/`.
   - [x] Capture the visible Browser verification invocation under `prompts/browser/`.
   - [x] Capture the visible Computer Use verification invocation under `prompts/computer-use/`.
   - [x] Record the revision plan in `tasks/roadmap.md` and `tasks/todo.md`.
2. Investigate the layout bug.
   - [x] Inspect the Graduation Path chart markup and CSS.
   - [x] Reproduce or confirm the right-edge clipping at relevant viewport widths.
   - [x] Identify the root cause and affected layout rules.
3. Apply the minimal layout fix.
   - [x] Update only the alignment page styles/markup needed to keep the chart within the viewport.
   - [x] Add a lesson preventing future alignment-page chart clipping.
4. Verify and ship.
   - [x] Run targeted static checks and `git diff --check`.
   - [x] Verify the alignment page visually in the browser.
   - [x] Add review notes to `tasks/todo.md`.
   - [x] Commit and push the intended tracked changes.

## Current Audit — Documentation Freshness And Cleanup

### Goal

Audit repository documentation for freshness, duplicated or superseded guidance, archive candidates, and cleanup priorities. Produce a durable docs-audit report and alignment page before making any broad documentation changes.

### Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `devtool-docs-audit` invocation under `prompts/devtool-docs-audit/`.
   - [x] Record the audit plan in `tasks/roadmap.md` and `tasks/todo.md`.
2. Inventory documentation surfaces.
   - [x] List tracked Markdown/HTML/docs artifacts across root docs, research, specs, alignment, tasks, benchmark, and pack/global skill docs.
   - [x] Separate active operating docs from generated artifacts, prompt history, archives, and historical reports.
3. Validate freshness against current repo behavior.
   - [x] Check README/AGENTS/setup docs against current scripts, pack commands, init flow, and skill layout.
   - [x] Check canonical workflow/routing docs against active skill contracts and recent rename/routing work.
   - [x] Check docs that mention missing or moved paths, stale commands, retired skill names, or generated-file conventions.
4. Classify cleanup work.
   - [x] Mark docs as current, needs update, duplicate/superseded, generated/local-only, or archive candidate.
   - [x] Identify minimal high-confidence cleanup actions and larger follow-up remediation work.
5. Produce and verify deliverables.
   - [x] Write `research/devtool-docs-audit.md` findings-first.
   - [x] Build `alignment/devtool-docs-audit-docs-freshness.html`.
   - [x] Add review notes to `tasks/todo.md`.
   - [x] Run targeted verification commands and `git diff --check`.

## Current Implementation — Add Scriptability Findings To Alignment Pages

### Goal

Amend the existing alignment pages for pack install issues, downstream skill inventory, and plain-text skill opportunities with the 2026-06-07 scriptability follow-up findings. Preserve the original conclusions, archive every edited page first, refresh the local central alignment index, and verify the bundled alignment-page convention remains unchanged.

### Plan

1. Confirm the current repository state and relevant conventions.
   - [x] Check working tree cleanliness and tracked alignment pages.
   - [x] Inspect the three target alignment pages and `compile-central-alignment` contract.
   - [x] Confirm `alignment/index.html` is untracked and should remain a local convenience artifact.
2. Archive existing HTML pages.
   - [x] Copy each target page to `docs/history/archive/2026-06-07/180623/alignment/` before editing.
3. Amend existing alignment pages only.
   - [x] Add the pack-install script surface follow-up covering `pack.sh`, no-hot-reload/install visibility guidance, downstream/manual runnable readiness, and the `scripts/init-agentic-skills.sh` path mismatch.
   - [x] Add the downstream portability addendum covering macOS stock Bash compatibility and Bash 3.2 failures in inventory scripts.
   - [x] Add the plain-text clarification that deterministic repeatable primitives should become scripts or script-backed utilities, with `compile-central-alignment` as the primary extraction candidate.
   - [x] Leave `alignment/skills-inventory.html` untouched as a generated/static catalog.
4. Maintain alignment index locally.
   - [x] Regenerate or verify `alignment/index.html` locally and keep it untracked unless repo convention forces otherwise.
5. Verify and ship.
   - [x] Run `git diff --check`.
   - [x] Verify each edited page contains its dated addendum and required key findings.
   - [x] Run `node scripts/upgrade-alignment-page.mjs --dry-run`.
   - [x] Verify archive snapshots exist for all three edited pages.

## Current Investigation — Skills That Should Be Scripts

### Goal

Validate whether the "Skills That Should Be Scripts" research matches the repository evidence, classify which claims are confirmed versus overstated, and identify the root problem behind script-shaped skills.

### 2026-06-06 Follow-up Scope

Re-verify the script-shaped skill opportunity with current repo evidence, focusing on downstream/manual script readiness, alignment-page maintenance, and deterministic skill surfaces. Do not implement opportunities in this pass.

### Plan

1. Capture the visible `investigate` invocation and task checklist.
2. Inventory `scripts/` and validate the reported standalone-tool claims.
3. Inspect named skill contracts for pure delegation, static insertion, deterministic orchestration, or real LLM judgment.
4. Compare the `pack` skill and `pack.sh` specifically because it is the strongest example.
5. Report confirmed claims, corrections, portability risks, and the practical recommendation without changing skill behavior.

## Active Plan — Add `user-flow-map` And Refactor AFPS Routing

### Goal

Add a mirrored `product-design` planning skill named `user-flow-map` and make AFPS route from positioning into concrete user-flow structure before UI requirements, layout variants, prototypes, UAT, consolidation, production specs, and roadmap work.

### Execution Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `targeted-skill-builder` invocation under `prompts/targeted-skill-builder/`.
   - [x] Record implementation progress and validation results in `tasks/todo.md`.
2. Inspect current routing and overlap.
   - [x] Check whether any existing skill already owns user-flow mapping.
   - [x] Read product-design skill conventions, routing docs, research-roadmap rules, alignment generator, and benchmark coverage patterns.
3. Create the new skill mirrors.
   - [x] Add `packs/product-design/codex/user-flow-map/` and `packs/product-design/claude/user-flow-map/`.
   - [x] Include `SKILL.md`, `CHANGELOG.md`, `agents/openai.yaml`, and generated `ALIGNMENT-PAGE.md` for both mirrors.
   - [x] Ensure the skill outputs `specs/user-flow-[topic].md`, `user-flow-[topic]-interview.md`, and `alignment/user-flow-map-{topic}.html`.
4. Refactor AFPS routing and documentation.
   - [x] Update pack workflow docs, skill next-step contracts, skills reference, product-design `PACK.md`, and global skill browser mappings.
   - [x] Archive and bump existing skill mirrors before editing their `SKILL.md` contracts.
   - [x] Update positioning, UI interview, UX variations, prototype, spec interview, and research-roadmap routing.
5. Update generated assets and benchmark coverage.
   - [x] Add `user-flow-map` to the alignment generator and regenerate alignment-page stubs.
   - [x] Add benchmark coverage metadata or an explicit deferred coverage path.
   - [x] Regenerate showcase data and validate the public skill catalog artifacts.
6. Verify and ship.
   - [x] Run skill integrity checks, generated drift checks, benchmark coverage, tests, targeted `rg` route checks, and `git diff --check`.
   - [x] Record validation results in `tasks/todo.md`.
   - [x] Commit and push the intended changes.

### Design Constraints

- Keep `user-flow-map` as flow structure and low-fidelity wireframe guidance, not visual design or runnable prototype work.
- Preserve existing user changes and avoid staging generated local skill roots.
- Maintain the new AFPS route:

```text
icp -> competitive-analysis -> journey-map -> positioning
-> user-flow-map
-> ui-interview --requirements-only
-> ux-variations --layout-mode
-> prototype
-> uat --variant-evaluation
-> consolidate-variations
-> research-roadmap --post-prototype
-> spec-interview
-> research-roadmap --post-spec
-> roadmap
```

## Post-Phase Tail Work

- **2026-05-18 — Workflow demo user-goal and run excerpts:** Refine `/workflows` transcript turns so each scenario leads with the user's goal for using that workflow and benchmark-backed turns render retained prompt/output excerpts from persisted runs where available.
- **2026-05-14 — Skills Showcase Playful Lab sitewide refactor plan:** Evaluate whether to refactor the full Skills Showcase UI around the Playful Lab / playful blueprint direction rather than only the `/workflows` player. Scope includes replacing legacy card-heavy route, catalog, pack, proof, follow, and benchmark surfaces with lab-style ledgers, rails, lane maps, notebook panels, and inspection drawers before implementation.
- **2026-05-01 — Creator-media packaging/search/cadence skills:** Added focused YouTube strategy skills for title/thumbnail audit, search positioning, and cadence diagnosis so the pack can turn channel audit and peer benchmark evidence into packaging fixes and programming inputs.
- **2026-05-12 — YouTube concept research skill:** Add a concept-first YouTube research workflow to `youtube-ops` that starts from a proposed video concept, finds direct and adjacent successful comparables, separates public evidence from performance hypotheses, and produces differentiated execution lessons before scripting or production.
- **2026-05-13 — Benchmark `session-triage`:** Run `$benchmark-test-skill session-triage` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier1-workflows.setup.ts`.
- **2026-05-13 — Agent-review `session-triage` benchmark:** Run `$benchmark-agent-review session-triage` over the latest persisted Claude/Codex benchmark outputs, grade generated artifacts against the subjective review rubric, write `benchmark/review-session-triage-2026-05-13.md`, validate, commit, and push.
- **2026-05-13 — Tighten `session-triage` over-remediation rubric:** Update the custom benchmark quality rubric so one-off noncompliance with an adequate validation contract cannot keep an acceptable quality score when it routes to unconditional skill or contract edits.
- **2026-05-14 — Benchmark `content-programming` fresh full-contract run:** Run `$benchmark-test-skill content-programming` after the full-contract coverage and fixture-evidence rubric fixes, write the dated benchmark report, refresh generated showcase evidence, validate, commit, and push.
- **2026-05-14 — Agent-review `content-programming` fresh full-contract benchmark:** Review the latest Claude/Codex `content-programming` outputs after the full-contract benchmark run, refresh the dated review report, regenerate showcase data, validate, commit, and push. Result: six evaluated outputs reviewed, median subjective score 92.0, range 90-94, no remediation required. Recommended next command: `$ship`.
- **2026-05-14 — Benchmark `icon-handler` fresh rerun:** Run `$benchmark-test-skill icon-handler` after the valid-source-asset fixture fix, write the dated benchmark report, validate, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 2/3 hard assertions passing and no infrastructure blocks. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next command: `$session-triage icon-handler benchmark failure`.
- **2026-05-14 — Triage `icon-handler` benchmark failure:** Investigate the fresh failed Claude/Codex benchmark assertions, classify contract versus harness versus runner noncompliance, write a dated triage report, validate, commit, and push. Result: verified mixed failure; primary durable gap is benchmark route clarity, while Codex no-artifact run is runner noncompletion. Report: `benchmark/triage-icon-handler-2026-05-14.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark route clarity`.
- **2026-05-14 — Tighten `icon-handler` benchmark route clarity:** Update the custom benchmark prompt/rubric so build commands remain verification commands and the final next route must be `/icon-handler fix ...` for Claude or `$icon-handler fix ...` for Codex. Result: added final-route evaluator coverage, switched the source fixture to SVG to avoid Claude image ingestion, and passed Claude/Codex smoke benchmarks. Recommended next command: `$benchmark-test-skill icon-handler`.
- **2026-05-16 — Benchmark `ship`:** Run `$benchmark-test-skill ship` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 3/3 hard assertions passing and no infrastructure blocks, but both had deterministic quality critical failures on `evidence-linked`. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$session-triage ship benchmark failure`.
- **2026-05-17 — Benchmark `update-packages`:** Run `$benchmark-test-skill update-packages` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- **2026-05-17 — Triage `update-packages` benchmark failure:** Investigate the failed both-agent benchmark, classify contract versus harness versus runner causes, write a dated triage report, validate, commit, and push. Focus on `$exec` route failures, age-gate evidence, stale-run contract version, and fixture false positives around `package-lock.json`.
- **2026-05-18 — Benchmark `update-packages` fresh run:** Run `$benchmark-test-skill update-packages` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- **2026-05-18 — Benchmark `update-packages` fresh rerun:** Run `$benchmark-test-skill update-packages` again against the current repository state, write/update the dated deterministic both-agent benchmark report, refresh generated evidence if needed, validate, commit, and push.
- **2026-05-19 — Benchmark `update-packages` fresh rerun:** Run `$benchmark-test-skill update-packages` against the current repository state after the socket transport classification follow-up, write the dated deterministic both-agent benchmark report, refresh generated evidence if needed, validate, commit, and push.
- **2026-05-19 — Agent review `update-packages` fresh rerun:** Review the latest persisted Claude/Codex `update-packages` benchmark outputs, score retained artifacts for operator ergonomics, write the dated review report, refresh generated evidence, validate, commit, and push.
- **2026-05-19 — Targeted `update-packages` benchmark lockfile ordering fix:** Tighten the benchmark quality rubric so unsafe npm-to-pnpm lockfile deletion order is rejected, while preserving retained positive batch-actionability shapes.

## Deferred / Future Work
- **Remembered GitHub freshness preference (2026-05-27)** — teach `$sync` to ask once for GitHub freshness checks and remember the machine-wide preference, while keeping plain sync non-mutating and adding explicit `init-agentic-skills update/latest` refresh behavior.
- **Hard-rename initialization surface (2026-05-27)** — replace `install-agentic-skills` / `install.sh` with `init-agentic-skills` / `init.sh` as the first-time setup interface, without compatibility aliases.
- **Exclude archived skills from `$` preview (2026-05-27)** — active installed skill roots should be archive-free managed directories, while explicit pins continue to point at `archive/<version>`.
- **Skill structure best-practice audit (2026-05-27)** — preserve the current `global/{claude,codex}` and `packs/<pack>/{claude,codex}` model while tightening repo-local anatomy guidance, archive/changelog hygiene, and validation semantics so active-skill audits ignore historical archive noise.
- **Orchestrator refactor investigation: `growth-model` (2026-06-06)** — investigate decomposing into a Pattern A (Framework Decomposition + Synthesis) orchestrator with `frameworks/acquisition-loop`, `frameworks/retention-loop`, `frameworks/monetization-loop` subskills. Currently 356 lines with three distinct Reforge-style loop methodologies that produce independent analysis merged at synthesis. Strongest candidate.
- **Orchestrator refactor investigation: `platform-strategy` (2026-06-06)** — investigate decomposing into a Pattern A orchestrator with `frameworks/vertical-expansion` and `frameworks/horizontal-expansion` subskills, with scoring + portfolio sequencing handled by synthesis. Currently 461 lines with two genuinely different analytical lenses. Moderate candidate.
- **Orchestrator refactor investigation: `pmf-assessment` (2026-06-06)** — investigate decomposing into a Pattern A orchestrator with quantitative (Sean Ellis survey design) and qualitative (signal analysis) framework subskills. Currently 406 lines. Two frameworks is thin for an orchestrator; assess whether the split improves modularity enough to justify the overhead.
- ~~**Orchestrator convention: document Pattern B and C (2026-06-06)**~~ — done. Extended `docs/orchestrator-convention.md` with Pattern B (Intent Router + Play Composer), Pattern C (Detect-and-Route), Thin Workflow Router variant, pattern comparison table, and decision guide. Updated `skill-invocation-types.md` with youtube classification and `skill-anatomy.md` cross-reference.
- **Alignment YAML clipboard UX (2026-05-24)** — tighten every active HTML alignment-page contract so compiled YAML is copied automatically when possible and always has an explicit copy-to-clipboard control; validate with broad layer1 contract tests.
- **Kanban analytics** — cycle time, throughput, WIP limits via `/kanban-stats` skill (from original backlog)
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push (from original backlog)
- **Kanban card labels** — tags/labels field for filtering by type (deferred to after Phase 8)
- **Multi-project kanban dashboard** — cross-board view (larger initiative, deferred)
- **Add Codex poketo-kanban skill** — parity item, low priority
- **Cross-tool portability layer** — single-source skill generation (larger initiative)
- **Workflow orchestrator / meta-skill** — guided pipeline execution (larger initiative; partially addressed by Phase 26 monorepo pack)
- **Monorepo Pack V2** — planning skills (mono-roadmap, mono-plan-phase, mono-spec-interview), analysis skills (mono-affected, mono-debug, mono-trace, mono-investigate), and mono-migrate (single-app → monorepo migration with guided execution). Deferred until V1 is validated in real use.
- **Session continuity automation** — `/resume` skill for cold-start (medium effort)

## Cross-Phase Concerns
### Integration Tests
- All new tests must pass alongside existing 24 kanban.mjs tests
- Phase 6-7 tests should be runnable via `vitest` with existing config
### Non-Functional Requirements
- No credentials in test fixtures or tracked files
- Test suites must clean up after themselves (delete test boards/cards)

## Current Plan — Claude Last-24h Usage Feedback

1. Capture the `$analyze-sessions` invocation in prompt history.
2. Parse the full available Claude history for the last 24 hours and inspect adjacent Claude usage metadata for subagent, parallel-session, context, and skill signals.
3. Distinguish locally verified findings from dashboard-only claims that the available files do not expose.
4. Produce a durable alignment report with skill and workflow recommendations, including whether to improve existing skills or add new ones.
5. Verify generated artifacts and ship the intended tracked changes.

### Add-On Plan — Cost Translation

1. Check the same Claude log scope for direct cost fields before estimating.
2. Use only a freshly verified provider pricing table for token-to-cost math.
3. Keep the report explicit that local logs support an API-equivalent estimate, not actual dashboard billing.
4. Update the HTML with model, token-class, and top-project cost breakdowns, then validate the artifact.

## Current Plan — skillpacks refresh target version output

1. Trace `npx skillpacks refresh` through the package-owned Node CLI and confirm where package semver is available.
2. Add refresh output that states the bundled `skillpacks` package version applied to local skill roots.
3. Cover the output in the focused lifecycle refresh test.
4. Verify package tests and syntax checks, then record the install replacement behavior for the user.

## Current Plan — skillpacks install destination output

1. Remove transient package source paths from Node-owned install, refresh, pin, and unpin messages.
2. Keep output focused on `.claude/skills/<name>` and `.codex/skills/<name>` destinations, with pin/latest status where relevant.
3. Add lifecycle test assertions that normal install, pinned install, refresh, pin, and unpin output do not contain source arrows.
4. Run package syntax checks, node tests, build check, and whitespace validation before shipping.

## Current Investigation — Research Skills Alignment Convention Audit

1. Capture the `$investigate` invocation and preserve a narrow task trace.
2. Identify the canonical HTML alignment-page convention source and generated bundled files.
3. Define the active research-skill set from repo metadata and non-archive skill roots.
4. Audit each research skill for generated `ALIGNMENT-PAGE.md` presence, `SKILL.md` alignment-page handoff, staged research workflow language where applicable, category/tier/index/feedback/confirmation/TTS requirements, and drift from the canonical convention.
5. Run the available convention validation scripts/tests and report confirmed compliance, violations, and prevention checks.

## Current Plan — skillpacks alignment commands

1. Inspect the package-owned CLI dispatcher, package staging boundary, alignment scripts, and existing package tests before changing behavior.
2. Add an explicit `skillpacks alignment` command namespace for generated per-skill bundles, active rendered-page audits, TTS injection, and focused verification.
3. Package the alignment scripts, support assets, and canonical convention doc needed for npm consumers while preserving denied package paths such as `alignment/`, `tasks/`, and `prompts/`.
4. Make `scripts/inject-tts.mjs` accept `--root <path>` and keep the CLI from injecting a TTS tag without the packaged TTS asset available in the target repo.
5. Update source-checkout and npm-path docs for the new alignment commands.
6. Add focused CLI/package tests, run the planned Vitest alignment set plus `npm --workspace skillpacks run verify:package`, then ship only this task's intended files.
