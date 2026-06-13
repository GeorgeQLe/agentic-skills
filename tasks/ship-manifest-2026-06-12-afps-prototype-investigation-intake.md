# Ship Manifest - AFPS Prototype Workflow Route Evaluation

## User goal

Investigate whether the shipped product-design flow-tree route is the best default way to accomplish the AFPS prototype phase.

## Changed files

- `apps/skills-showcase/public/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/canonical-workflow-report.md`
- `docs/pack-workflow-matrix.md`
- `docs/skill-next-step-contracts.md`
- `docs/skill-routing-map.html`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `global/claude/codebase-status/CHANGELOG.md`
- `global/claude/codebase-status/SKILL.md`
- `global/claude/codebase-status/archive/v0.8/SKILL.md`
- `global/codex/codebase-status/CHANGELOG.md`
- `global/codex/codebase-status/SKILL.md`
- `global/codex/codebase-status/archive/v0.8/SKILL.md`
- `packs/agent-work-admin/claude/roadmap/CHANGELOG.md`
- `packs/agent-work-admin/claude/roadmap/SKILL.md`
- `packs/agent-work-admin/claude/roadmap/archive/v0.11/SKILL.md`
- `packs/agent-work-admin/codex/roadmap/CHANGELOG.md`
- `packs/agent-work-admin/codex/roadmap/SKILL.md`
- `packs/agent-work-admin/codex/roadmap/archive/v0.11/SKILL.md`
- `packs/repo-maintenance/claude/bootstrap-repo/CHANGELOG.md`
- `packs/repo-maintenance/claude/bootstrap-repo/SKILL.md`
- `packs/repo-maintenance/claude/bootstrap-repo/archive/v0.4/SKILL.md`
- `packs/repo-maintenance/codex/bootstrap-repo/CHANGELOG.md`
- `packs/repo-maintenance/codex/bootstrap-repo/SKILL.md`
- `packs/repo-maintenance/codex/bootstrap-repo/archive/v0.4/SKILL.md`
- `packs/teardown/claude/desk-flip/CHANGELOG.md`
- `packs/teardown/claude/desk-flip/SKILL.md`
- `packs/teardown/claude/desk-flip/archive/v0.4/SKILL.md`
- `packs/teardown/codex/desk-flip/CHANGELOG.md`
- `packs/teardown/codex/desk-flip/SKILL.md`
- `packs/teardown/codex/desk-flip/archive/v0.4/SKILL.md`
- `prompts/investigate/skill-prompt-20260612-210857-product-design-afps-prototype-workflow.md`
- `prompts/ship-end/skill-prompt-20260612-210932-ship-end.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-12-afps-prototype-investigation-intake.md`

## Per-file purpose

- Workflow docs and routing map: replace the old default AFPS prototype sequence with `user-flow-map -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation]`.
- `roadmap`, `bootstrap-repo`, `desk-flip`, and `codebase-status` mirrored skill contracts: align active routing owners with the flow-tree default and preserve requirements-only/layout-mode as explicit bounded detours.
- Archive and changelog files: preserve prior active contracts and record version bumps for substantive routing behavior changes.
- Generated Skills Showcase assets: refresh public metadata for changed active skill versions and history.
- Prompt/task/history/manifest files: preserve the visible investigation prompt, visible ship-end prompt capture, plan, review notes, verification, and shipping boundary.

## User-goal mapping

The evaluation confirmed the new route is the better AFPS prototype default because it keeps `user-flow-map` as structural root evidence, explores progression branches before UI detail hardens, requires branch-specific HTML mockup review before approval, and preserves explicit approve/reject/retry routing before implementation. The source changes make that conclusion operational by removing stale active routes that would still send users through the old requirements/layout-first path.

## Tests run

- Stale default-route scans for the old active chain - initially found one remaining active `codebase-status` route owner, which was fixed; final scan passed with remaining hits limited to history/task/changelog mentions.
- `git diff --check` - passed.
- `bash scripts/skill-archive-audit.sh --strict` - passed, 383 skills checked, 0 violations.
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing` - passed, all 462 skills have a version field.
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing` - passed, all 155 mutation-capable skills have next-step routing.
- `bash scripts/skill-mirror-parity-audit.sh` - passed, 155 mirrored pairs checked, 0 unapproved failures.
- `/opt/homebrew/bin/bash scripts/skill-deps.sh --broken` - passed, no broken references found.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - first pass regenerated assets; second pass passed fresh.
- `pnpm --dir apps/skills-showcase build` - passed.

## Skipped tests

- Full layer1 suite skipped because this boundary changes routing contracts, docs, archives, changelogs, task artifacts, and generated showcase metadata, not parser/runtime behavior. The archive/version/routing/mirror/dependency audits cover the changed skill contracts, and the showcase validation/build covers generated website assets.

## Adversarial review

- The new route is better for AFPS prototypes when the goal is learning through visible branch evidence, not producing a premature implementation spec.
- The old requirements/layout-first route over-optimized for content contract stability before the user had seen plausible progression branches; that delayed visual alignment and made one path feel canonical too early.
- The flow-tree route has a real risk of extra ceremony for tiny or already-obvious work. The active contracts mitigate that by allowing explicit bypass to `ui-interview` for a named flow and preserving requirements-only/layout-mode as bounded modes.
- Updated route owners were limited to active docs and active skills that can misdirect future work; historical specs, changelogs, benchmark examples, and task records were not rewritten as current truth.

## Residual risk

Some historical task/history/changelog/spec entries still mention the old sequence because they describe prior shipped states or old artifacts. They are not active route owners. If a future audit wants no historical mentions, that should be a separate docs-history normalization task.

## Rollback note

Revert the shipping commit to restore the previous route wording, skill versions, archives, task artifacts, and generated showcase metadata.

## Next command

`none`
