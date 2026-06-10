# Ship Manifest — Pack Install Brainstorm

## User Goal

Execute `$pack install brainstorm`.

## Changed Files

- `.agents/project.json`
- `prompts/pack/skill-prompt-20260610-100129-install-brainstorm.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-pack-install-brainstorm.md`

## Per-File Purpose

- `.agents/project.json`: records `brainstorm` as an individually enabled skill from `product-design`.
- `prompts/pack/skill-prompt-20260610-100129-install-brainstorm.md`: records the visible skill invocation and pasted skill context as required by prompt-history policy.
- `tasks/history.md`: records the installed project-local skill and generated-root boundary.
- `tasks/ship-manifest-2026-06-10-pack-install-brainstorm.md`: records this quality gate and shipping boundary.

## User-Goal Mapping

- The requested `brainstorm` skill was installed without enabling the full `product-design` pack.
- The committed project designation now lets future `$pack`/`scripts/pack.sh refresh` runs recreate the local roots.
- Generated `.claude/skills/**` and `.codex/skills/**` roots remain unstaged.

## Tests Run

- `scripts/pack.sh install brainstorm` — passed; installed Claude and Codex roots and updated `.agents/project.json`.
- `scripts/pack.sh status` — passed; reports `brainstorm (from pack: product-design)` under individually installed skills.
- `scripts/pack.sh which brainstorm` — passed; reports `brainstorm is individually installed from pack 'product-design'`.

## Skipped Tests

- Full package and repository test suites were not run because this is a project-pack configuration change, not source-code behavior.
- Skills Showcase generation/validation was not run because no tracked `SKILL.md` or `PACK.md` metadata changed.

## Adversarial Review

- Method: inspected `scripts/pack.sh` output, `scripts/pack.sh status`, `scripts/pack.sh which brainstorm`, generated root paths, and `git status --short`.
- Finding: local skill roots were generated under `.claude/skills/brainstorm` and `.codex/skills/brainstorm`; they are intentionally not staged or committed.

## Residual Risk

- The active Codex session may not show `$brainstorm` until a fresh Codex CLI session starts. Claude Code users may need `/reload-skills`, `/clear`, or restart depending on session state.

## Rollback Note

Run `scripts/pack.sh remove brainstorm`, commit the resulting `.agents/project.json` change, and leave generated local roots unstaged.

## Next Command

`$brainstorm`
