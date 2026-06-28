# Ship Manifest - Design-Tree Surface Terminology

Date: 2026-06-27

## Scope

- Reframed `user-flow-map` from UI-only screen/route inventory to surface/channel flow mapping.
- Aligned `ui-interview` to consume upstream surfaces/channels while owning only human-visible UI candidates.
- Preserved the existing design-tree branch model: only named user-flow branches become `branches[]`.
- Refreshed project-local installed skills and repaired an unrelated archive-audit blocker exposed by verification.

## Files Changed

- `packs/product-design/claude/user-flow-map/SKILL.md`
- `packs/product-design/codex/user-flow-map/SKILL.md`
- `packs/product-design/claude/user-flow-map/CHANGELOG.md`
- `packs/product-design/codex/user-flow-map/CHANGELOG.md`
- `packs/product-design/claude/user-flow-map/agents/openai.yaml`
- `packs/product-design/codex/user-flow-map/agents/openai.yaml`
- `packs/product-design/claude/ui-interview/SKILL.md`
- `packs/product-design/codex/ui-interview/SKILL.md`
- `packs/product-design/claude/ui-interview/CHANGELOG.md`
- `packs/product-design/codex/ui-interview/CHANGELOG.md`
- `packs/product-design/**/archive/` version snapshots for `user-flow-map` v1.6 and `ui-interview` v0.28
- `base/codex/fork-idea-branch/archive/v0.0/SKILL.md`
- `prompts/skill-creator/skill-prompt-20260627-214621-design-tree-surface-terminology.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/lessons.md`

## Verification

- `rg` stale-term check on active `user-flow-map` / `ui-interview` source and `user-flow-map` metadata
- `rg` surface/channel contract check
- archive path existence check for affected product-design mirrors
- `scripts/pack.sh refresh`
- `scripts/pack.sh doctor`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/skill-archive-audit.sh`
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Notes

- The first `scripts/skill-archive-audit.sh` run exposed a pre-existing missing `base/codex/fork-idea-branch/archive/v0.0/SKILL.md`; that gap was repaired and the audit then passed.
- `scripts/pack.sh refresh` updated project-local skill installs, but no tracked `.claude/skills` or `.codex/skills` diff was produced.
