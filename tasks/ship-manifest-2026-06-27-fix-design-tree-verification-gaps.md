# Ship Manifest - Fix Remaining Design-Tree Verification Gaps

## User Goal

Implement the prior agent plan: fix the remaining active `user-flow-map` route wording that still pointed build-plan work at `prototype`, commit refreshed Skills Showcase GitHub proof data, verify, commit, and push to `origin/master`.

## Changed Files

- `packs/product-design/claude/user-flow-map/SKILL.md`
- `packs/product-design/codex/user-flow-map/SKILL.md`
- `apps/skills-showcase/public/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260627-232558-fix-design-tree-verification-gaps.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-27-fix-design-tree-verification-gaps.md`

## Per-File Purpose

- `packs/product-design/claude/user-flow-map/SKILL.md`: changes the two active build-plan command references from `/prototype` to `/logic-wiring`.
- `packs/product-design/codex/user-flow-map/SKILL.md`: changes the matching two Codex command references from `$prototype` to `$logic-wiring`.
- `apps/skills-showcase/public/assets/skills-data.js`: refreshed generated app-facing catalog fingerprint after the staged `SKILL.md` wording change.
- `apps/skills-showcase/public/assets/github-proof-data.js`: refreshed generated app-facing proof data.
- `docs/skills-showcase/assets/skills-data.js`: refreshed generated static-docs catalog fingerprint after the staged `SKILL.md` wording change.
- `docs/skills-showcase/assets/github-proof-data.js`: refreshed generated static-docs proof data mirror.
- `prompts/exec/skill-prompt-20260627-232558-fix-design-tree-verification-gaps.md`: records the visible `exec` invocation per project prompt-history policy.
- `tasks/history.md`: records the completed ship.
- `tasks/roadmap.md`: records the implementation plan and results as historical.
- `tasks/todo.md`: closes the active task and records verification results.
- `tasks/ship-manifest-2026-06-27-fix-design-tree-verification-gaps.md`: documents the shipping boundary and quality gate.

## User-Goal Mapping

- Stale route wording is fixed in both active skill mirrors.
- Generic prototype artifact terminology remains intact.
- No `user-flow-map` version bump, archive, or changelog entry was added.
- Generated catalog/proof data is included in the commit.
- Verification evidence is recorded before commit/push.

## Tests Run

Executable verification:

- Targeted exact-command stale-route scan: `rg -n '(^|[^[:alnum:]_-])(/prototype|\$prototype)([^[:alnum:]_-]|$)' packs/product-design/claude/user-flow-map/SKILL.md packs/product-design/codex/user-flow-map/SKILL.md`
- `npm run skillpacks:verify`
- `node scripts/skill-alignment-routing-audit.mjs --active`
- `scripts/skill-install-routing-audit.sh --active`
- `npm run skills-showcase:test`
- `npm run skills-showcase:validate-data`
- `npm run skills-showcase:build`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

Documentation/task checks:

- Active task docs were reconciled from current implementation to no-active-task closeout.
- Ship manifest created for the exact intended boundary.

## Skipped Tests

- Manual production deploy was not run because production deploy requires explicit confirmation. The deploy contract says generated `apps/skills-showcase/public/**` assets are deploy-relevant and Vercel path gating should build from `master` after push.

## Adversarial Review

- Broad active Product Design scan for `/prototype` / `$prototype` found legitimate remaining references in the `prototype` skill itself, `ux-variations --layout-mode`, `feature-interview` mini-prototype guidance, and explicit "do not route to prototype" guardrails.
- Focused exact-command scan over active `user-flow-map` mirrors returned no `/prototype` or `$prototype` command tokens.
- Diff inspection confirmed no `version:` field, archive, or changelog changes were introduced.

## Residual Risk

Low. This is a narrow wording correction plus generated proof data refresh. Remaining `prototype` command references outside `user-flow-map` are intentional legacy/layout-mode or guardrail references, not the stale build-plan route fixed here.

## Rollback Note

Revert the ship commit to restore the prior `user-flow-map` wording and generated proof-data fingerprint/history list.

## Next Command

`$brainstorm`
