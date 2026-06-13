# Ship Manifest - AFPS Prototype Route Evaluation And Sync

## User goal

Investigate whether the shipped product-design flow route is the best default for the AFPS prototype phase, fix stale route-owner surfaces found during the investigation, and wrap up the session cleanly.

## Changed files

- `apps/skills-showcase/public/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/canonical-workflow-report.md`
- `docs/pack-workflow-matrix.md`
- `docs/skill-next-step-contracts.md`
- `docs/skill-routing-map.html`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
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
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-12-afps-prototype-investigation-intake.md`

## Per-file purpose

- `apps/skills-showcase/public/assets/github-proof-data.js`: refreshed app-copy proof metadata after history updates.
- `apps/skills-showcase/public/assets/skills-data.js`: refreshed app-copy skill metadata after active skill version changes.
- `docs/canonical-workflow-report.md`: updates the canonical AFPS route summary to the flow-tree default.
- `docs/pack-workflow-matrix.md`: updates the business-product workflow matrix to the flow-tree default and bounded detour wording.
- `docs/skill-next-step-contracts.md`: updates next-step contract docs to the flow-tree default.
- `docs/skill-routing-map.html`: updates the AFPS chain order and routing graph edges.
- `docs/skills-showcase/assets/github-proof-data.js`: refreshed docs-copy proof metadata after history updates.
- `docs/skills-showcase/assets/skills-data.js`: refreshed docs-copy skill metadata after active skill version changes.
- `packs/agent-work-admin/**/roadmap/*`: updates mirrored roadmap design-gate routing, archives the prior contracts, and records changelog entries.
- `packs/repo-maintenance/**/bootstrap-repo/*`: updates mirrored fresh bootstrap routing, archives the prior contracts, and records changelog entries.
- `packs/teardown/**/desk-flip/*`: updates mirrored fresh-start routing, archives the prior contracts, and records changelog entries.
- `prompts/investigate/skill-prompt-20260612-210857-product-design-afps-prototype-workflow.md`: preserves the exact visible investigation request.
- `prompts/ship-end/skill-prompt-20260612-210932-ship-end.md`: preserves the exact visible shipping invocation and pasted skill context.
- `tasks/roadmap.md`: records the investigation goal, scope, plan, and acceptance criteria.
- `tasks/todo.md`: records completed investigation steps, findings, caveats, and verification status.
- `tasks/history.md`: records the route evaluation and sync.
- `tasks/ship-manifest-2026-06-12-afps-prototype-investigation-intake.md`: documents the shipping boundary and verification.

## User-goal mapping

The investigation confirmed the product-design contracts implement the requested flow-tree route and found stale route-owner surfaces still pointing at the old requirements/layout-mode default. The route-owner skills and workflow docs now match the evaluated default, while prompt/task/history artifacts preserve the reasoning and handoff.

## Tests run

- `git diff --check` - passed.
- `bash scripts/skill-archive-audit.sh --strict` - passed, 383 skills checked, 0 violations.
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing` - passed, all 462 skills have a version field.
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing` - passed, all 155 mutation-capable skills have next-step routing.
- `bash scripts/skill-mirror-parity-audit.sh` - passed, 155 mirrored pairs checked, 0 unapproved failures.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - regenerated stale assets after source/history updates; final rerun passed fresh.
- `pnpm --dir apps/skills-showcase build` - passed.

## Skipped tests

- Full layer1 and package suites are skipped because the source changes are routing-contract and documentation updates, not executable package/runtime behavior. The targeted skill archive/version/routing/mirror audits cover the changed skill contracts, and the Skills Showcase validator/build covers generated public assets.

## Adversarial review

- Changed-file self-review checked that Claude and Codex mirrors agree across `roadmap`, `desk-flip`, and `bootstrap-repo`; archives exist for every bumped active contract; changelogs document each new version; docs and route map use the new order; requirements-only/layout-mode remains an explicit bounded detour; and generated assets came from the validator.
- Investigation finding challenged the initial assumption by scanning for stale route-owner surfaces beyond product-design skills; stale surfaces were fixed instead of only recording a recommendation.

## Residual risk

The route is now documented as the AFPS prototype default, but the caveat remains: tiny or already-obvious changes should not be forced through needless variation work. The updated contracts preserve explicit detours for fixed-content layout comparisons and direct branch handling when warranted.

## Rollback note

Revert the shipping commit to remove the route sync, workflow-doc updates, archives, regenerated showcase assets, prompt-history artifacts, and task/history bookkeeping.

## Next command

`npx skillpacks install guided-walkthrough`
