# Ship Manifest - Ship-End Research/Design Route Precedence

## User Goal

Patch `ship-end` so research/design/alignment/prototype/copy review work remains directly routable through the owning skill, user review, or compiled-YAML contract instead of falling through to `$exec` or `/exec`.

## Changed Files

| File | Purpose |
| --- | --- |
| `packs/exec-loop/codex/ship-end/SKILL.md` | Bump to `v0.5` and add owning-route precedence before Codex `$exec` fallback routing. |
| `packs/exec-loop/claude/ship-end/SKILL.md` | Bump to `v0.5` and add the mirrored Claude `/exec` precedence behavior. |
| `packs/exec-loop/{codex,claude}/ship-end/archive/v0.4/SKILL.md` | Archive prior `v0.4` contracts before the behavior update. |
| `packs/exec-loop/{codex,claude}/ship-end/CHANGELOG.md` | Record the `v0.5` routing contract change. |
| `scripts/skill-ship-end-routing-audit.sh` | Add focused regression coverage for the route-precedence contract in both mirrors. |
| `tasks/lessons.md` | Record the correction pattern so future handoffs do not wrap review routes in exec-loop defaults. |
| `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md` | Record plan, progress, verification evidence, and session history. |
| `prompts/skill-creator/skill-prompt-20260617-101925-ship-end-routing.md` | Capture the exact visible user invocation and pasted context for this skill edit. |
| `packages/skillpacks/dist/skillpacks-manifest.json` | Refresh package manifest metadata for the `ship-end` version/content change. |
| `docs/skills-showcase/assets/*`, `apps/skills-showcase/public/assets/*`, `docs/benchmark-results-matrix.md` | Refresh Skills Showcase generated data for changed skill metadata/version. |

## User-Goal Mapping

- The new `ship-end` route rule directly addresses the reported bad handoff: review pages and research/design artifacts now take precedence over runner-default `$exec` or `/exec` routing.
- The focused audit prevents the rule from drifting out of either Codex or Claude mirror.
- Local generated installs were refreshed and verified, but generated `.codex/skills/**` and `.claude/skills/**` roots remain uncommitted per project policy.

## Tests Run

- `bash scripts/skill-ship-end-routing-audit.sh`
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-mirror-parity-audit.sh`
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing`
- `bash scripts/skill-install-routing-audit.sh --active`
- `bash scripts/skill-pack-routing-audit.sh`
- `node scripts/skill-alignment-routing-audit.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `npm --workspace packages/skillpacks run test:node` (92 tests)
- `scripts/pack.sh refresh`
- ``rg -n 'version: v0.5|Prefer an owning workflow/domain route|Use `\\$exec` only|Use `/exec` only|research, alignment, design, UI, UX' .codex/skills/ship-end/SKILL.md .claude/skills/ship-end/SKILL.md packs/exec-loop/codex/ship-end/SKILL.md packs/exec-loop/claude/ship-end/SKILL.md``
- `git diff --check`

## Skipped Tests

- Full application/UI test suites were not run because this change updates skill routing contracts, package metadata, and generated showcase data only. Focused route, archive/version, package, and showcase validation cover the changed surfaces.

## Adversarial Review

The focused audit checks the exact failure mode: both mirrors must include owning-route precedence, the research/design review artifact list, the narrower-owner fallback limit, and the `$exec`/`/exec` fallback wording. Mirror parity, alignment routing, install routing, pack routing, and package tests provide broader regression coverage against common routing-contract drift.

## Residual Risk

The contract now requires agents to identify the owning skill or review contract. If an artifact's owner is not visible from task docs or the review page itself, `ship-end` may still need to recommend user review/compiled YAML rather than a named domain skill.

## Rollback Note

Revert the `ship-end` `v0.5` commits, restore the active `SKILL.md` files from `archive/v0.4/SKILL.md`, rerun the package/showcase generators, and rerun the routing and version/archive audits.

## Next Command

`none`
