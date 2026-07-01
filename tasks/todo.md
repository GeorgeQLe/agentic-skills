# Current Task State

## Current Implementation - State-Model Clean-Context Handoff Wording

**Status:** In progress - tightening `Invoke With YAML` clean-context guidance for chunked state-model handoffs.

Project: `agentic-skills`.

### Goal

Make the design-tree-loop handoff convention and mirrored state-model contracts explicitly say that the optional `## Invoke With YAML` block belongs in a fresh/cleared agent context alongside the exact repeated command, not as extra material appended to an already crowded session.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for task docs, canonical convention text, regenerated bundles, and mirrored state-model contract wording.
- Reason: this changes shared generated design-tree-loop bundles plus state-model-specific handoff requirements.
- Safety boundary: preserve unrelated paused YouTube task state, do not alter GitHub Actions, and keep behavior scoped to clean-context handoff wording.

### Plan

- [x] Locate canonical design-tree-loop source and active state-model mirrors.
- [x] Update active task docs with this implementation contract.
- [x] Update canonical `docs/design-tree-loop-convention.md` handoff wording.
- [x] Regenerate design-tree-loop bundles.
- [x] Update mirrored state-model `SKILL.md` handoff wording if regeneration does not cover it.
- [x] Run targeted verification and diff checks.
- [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- [x] `## Invoke With YAML` is described as optional clean-context routing metadata for the next invocation.
- [x] Progress handoff session guidance says to paste the YAML only into the fresh/clean context alongside the exact command.
- [x] `Staying in this session is allowed` is removed or made explicitly exceptional in generated design-tree-loop bundles.
- [x] Codex and Claude state-model `SKILL.md` mirrors carry the same fresh/clean-context cue.
- [x] Verification commands show the new wording and no generator drift.

### Test Plan

- `rg -n "Invoke With YAML.*fresh|clean context|not consumed state|durable cursor" packs/product-design docs`
- `rg -n "Staying in this session is allowed" packs/product-design/*/state-model/DESIGN-TREE-LOOP.md`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `rg -n "Invoke With YAML.*fresh|clean context|not consumed state|durable cursor" packs/product-design docs` found the new clean-context, not-consumed-state, and durable-cursor wording in the canonical convention, generated bundles, and state-model mirrors.
- `rg -n "Staying in this session is allowed" packs/product-design/*/state-model/DESIGN-TREE-LOOP.md packs/product-design/*/state-model/SKILL.md` returned no active state-model matches.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed with 22 skills checked and 0 bundle writes.
- `git diff --check` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed with 413 skills checked and 0 violations.

## Paused Implementation - Create YouTube Meta Research Skill

This section is preserved from the pre-existing task state and is intentionally not part of the clean-context handoff wording implementation.
