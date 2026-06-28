# Ship Manifest - Close Design-Tree Surface Terminology Gaps

## User Goal

Implement the follow-up plan to close generated-artifact and downstream-contract gaps from commit `00503b7e0`, so package metadata, flow-tree schema guidance, and downstream product-design consumers agree on surface/channel terminology and the `logic-wiring` route step.

## Changed Files

- `packs/product-design/claude/user-flow-map/SKILL.md`
- `packs/product-design/codex/user-flow-map/SKILL.md`
- `packs/product-design/claude/user-flow-map/CHANGELOG.md`
- `packs/product-design/codex/user-flow-map/CHANGELOG.md`
- `packs/product-design/claude/user-flow-map/archive/v1.7/SKILL.md`
- `packs/product-design/codex/user-flow-map/archive/v1.7/SKILL.md`
- `packs/product-design/claude/state-model/SKILL.md`
- `packs/product-design/codex/state-model/SKILL.md`
- `packs/product-design/claude/state-model/CHANGELOG.md`
- `packs/product-design/codex/state-model/CHANGELOG.md`
- `packs/product-design/claude/state-model/archive/v0.9/SKILL.md`
- `packs/product-design/codex/state-model/archive/v0.9/SKILL.md`
- `packs/product-design/claude/logic-wiring/SKILL.md`
- `packs/product-design/codex/logic-wiring/SKILL.md`
- `packs/product-design/claude/logic-wiring/CHANGELOG.md`
- `packs/product-design/codex/logic-wiring/CHANGELOG.md`
- `packs/product-design/claude/logic-wiring/archive/v0.20/SKILL.md`
- `packs/product-design/codex/logic-wiring/archive/v0.20/SKILL.md`
- `packs/product-design/claude/spec-interview/SKILL.md`
- `packs/product-design/codex/spec-interview/SKILL.md`
- `packs/product-design/claude/spec-interview/CHANGELOG.md`
- `packs/product-design/codex/spec-interview/CHANGELOG.md`
- `packs/product-design/claude/spec-interview/archive/v0.17/SKILL.md`
- `packs/product-design/codex/spec-interview/archive/v0.17/SKILL.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `prompts/exec/skill-prompt-20260627-221412-close-design-tree-surface-terminology.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-27-close-design-tree-surface-terminology-gaps.md`

## Per-File Purpose

- `user-flow-map` mirrors: bump to v1.8, initialize `schema_version: v0.4`, route the flow-tree tuple and build-plan handoffs through `logic-wiring`, and preserve `prototype_build_plan` as artifact/schema vocabulary.
- `state-model` mirrors: bump to v0.10 and update the documented locked route tuple to use `logic-wiring` as step 4 while keeping `state-model` off-route.
- `logic-wiring` mirrors: bump to v0.21 and consume upstream surface inventories, channels, visual UI candidates, route/screen realizations, and non-visual channel behavior.
- `spec-interview` mirrors: bump to v0.18 and consume surface/channel and route/screen realization evidence in post-prototype spec work.
- Archive/changelog files: preserve prior active contracts and document behavior changes.
- Manifest/showcase generated assets: refresh index-generated package and Skills Showcase metadata after active `SKILL.md` changes.
- Prompt/task/history/manifest files: record invocation, execution plan, review evidence, and shipping boundary.

## User-Goal Mapping

- Package metadata now reports current product-design versions and archives, including `user-flow-map` v1.8, `ui-interview` v0.29, `state-model` v0.10, `logic-wiring` v0.21, and `spec-interview` v0.18.
- New `flow-tree` guidance matches `design/flow-tree.schema.json` v0.4: route step 4 is `logic-wiring`, not deprecated `prototype`.
- Downstream design-tree consumers now read upstream surfaces/channels and route/screen realizations instead of reducing flow shape to screen order.

## Tests Run

- `npm --workspace packages/skillpacks run build` — regenerated manifest and package staging boundary.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` — regenerated skills data and benchmark matrix.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` — regenerated proof data.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` — passed; generated website-owned data is fresh.
- `npm --workspace packages/skillpacks run build:check` — passed; convention bundle audit, manifest check, and package staging boundary check clean.
- `scripts/skill-mirror-parity-audit.sh --verbose` — passed; no unapproved parity failures.
- `scripts/skill-archive-audit.sh` — passed; 411 skills checked, 0 violations.
- `scripts/pack.sh refresh` — refreshed local installs after `user-flow-map` v1.8 drift.
- `scripts/pack.sh doctor` — passed; installed project-local skills current.
- `pnpm --dir apps/skills-showcase build` — passed; Next.js production build compiled, typechecked, and generated 214 static pages.
- `node scripts/audit-task-docs.mjs` — passed with advisory manual/recurring info only.
- Targeted stale active-route scan with archives excluded for `schema_version: v0.3`, `prototype, consolidate-prototypes`, and old route tuples — no matches.
- Targeted screen-only upstream-consumer scan with archives excluded — no matches.
- Manifest version/archive spot check — confirmed expected current versions and archive lists.
- `git diff --check` — passed.
- `git diff --cached --check` — passed.

## Skipped Tests

- Full package Node test suite was not run because no package CLI/runtime code changed; `build:check`, manifest regeneration, archive/parity audits, and targeted contract scans cover the changed skill metadata and generated package boundary.
- Full layer1 suite was not run because no tests, scripts, schemas, app components, or runtime logic changed; the local Skills Showcase production build covers generated data consumption.

## Adversarial Review

Method: staged diff review plus broad active-contract stale scans.

Finding fixed during review: the broad stale-route scan found `state-model` still documenting the active route tuple with `prototype` as step 4. Fixed by archiving v0.9, bumping both mirrors to v0.10, and updating the tuple to `logic-wiring`.

Post-fix review: no active non-archive stale route/schema strings or screen-only upstream-consumer phrases remain. The final staged boundary contains only intended source, generated metadata, prompt/task/history, and manifest files.

Unrelated worktree boundary: `alignment/index.html` and `alignment/skillpacks-command-language-upgrades.html` appeared as unstaged/untracked alignment work during closeout. They are not part of this user goal, are not staged, and are left untouched for their owner.

## Residual Risk

Residual risk is limited to prose interpretation in future skill runs: agents may still encounter historical archive wording that says `prototype`, but active contracts and generated metadata now agree on `logic-wiring`. Archive paths were intentionally excluded from stale-term remediation because they preserve historical behavior.

## Deploy

Manual deploy not run. `tasks/deploy.md` classifies Skills Showcase generated public data as deploy-relevant, and the local production build passed. A production deploy requires explicit user confirmation; this session only commits and pushes the verified source/generated boundary.

## Rollback Note

Revert the shipping commit to restore the previous skill contracts and generated metadata. The archived prior versions remain in-repo, so a targeted rollback can also restore the affected active `SKILL.md` files from their new archive directories and regenerate the manifest/showcase assets.

## Next Command

`$brainstorm`
