---
skill: exec
agent: codex
captured_at: 2026-06-13T22:12:00-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Alignment-YAML Routing Convention Remediation

## Summary

Update active non-exec skills so research/artifact continuation is driven by alignment pages and compiled YAML, not `$exec` or `/exec` handoffs. Keep `exec-loop` skills themselves as the only direct exec-routing exception. Isolate this work from the current dirty product-design tree by using a clean temporary worktree from `master`, then land the finished boundary on `origin/master`.

## Key Changes

- Add a canonical contract, likely `docs/alignment-yaml-routing-contract.md`, defining:
  - Alignment pages are the durable cross-session review artifact for research/spec/report/prototype outputs.
  - While an alignment page is in `review`, the only next action is section-feedback YAML or bottom compiled response YAML.
  - Downstream routing appears only after final compiled YAML approval and approved canonical artifacts are written.
  - Non-exec skills must not recommend `$exec` or `/exec`; if they need multi-step work, they write or propose YAML/task artifacts and let the user/agent route from the approved artifact.
- Add or extend a validation script, likely `scripts/skill-alignment-routing-audit.mjs`, to scan active `SKILL.md` files excluding archives and generated local install roots.
  - Fail active non-exec skills containing final handoffs to `$exec` or `/exec`.
  - Allow only `packs/exec-loop/**`, `global/*/exec/**` if present, and explanatory docs/tests where the file is not an active non-exec skill.
  - Flag research/artifact-producing skills that lack the pre-approval stop language or alignment-page YAML approval contract.
- Update active game pack skills first in both Claude and Codex mirrors:
  - Ensure `game-audience`, `game-fantasy`, `game-genre-map`, `game-comparables`, `game-core-loop`, `game-prototype-test`, `game-store-page-test`, `game-playtest-metrics`, `game-launch`, and `game-roadmap` follow the alignment-page/YAML routing convention.
  - Remove `game-roadmap` direct `$exec`/`/exec` recommendations; route via approved roadmap/task artifacts and YAML-controlled next work instead.
  - Preserve the game sequence as post-approval routing only, not as pre-approval command handoff.
- Audit and remediate all other active non-exec skills with direct exec routing, including current hits in admin/orchestrator/business/product/docs packs.
  - For orchestrators that currently queue framework steps into `tasks/todo.md`, replace “run exec” with “approve/consume the generated YAML/task artifact; the approved artifact records the next executable step.”
  - Do not edit archive copies except when archiving current `SKILL.md` versions for required version bumps.
- For every active `SKILL.md` behavior change:
  - Run `scripts/skill-archive.sh <skill-dir>` before editing.
  - Bump `version:` by one decimal.
  - Update the skill `CHANGELOG.md`.
  - Update Claude/Codex mirrors consistently.

## Test Plan

- `node scripts/skill-alignment-routing-audit.mjs`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `pnpm --dir apps/skills-showcase typecheck`
- `pnpm --dir apps/skills-showcase test`
- `git diff --check`
- `bash scripts/skill-archive-audit.sh --strict`
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing`
- `/opt/homebrew/bin/bash scripts/skill-deps.sh --broken`
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing`
