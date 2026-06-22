---
skill: exec
agent: codex
captured_at: 2026-06-21T23:20:39-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Stricter HTML-First Canonical Write Contract

## Summary
Tighten the product-design contract so `state-model` and `ux-variations` may use Markdown intermediates as chunk cursors, but cannot write or replace final canonical `design/**` Markdown/YAML or flow-tree updates until the HTML alignment page is reviewed and confirmed.

## Key Changes
- Update `docs/design-tree-loop-convention.md` to add a “HTML-first canonical write” rule:
  - `_working/` briefs and per-unit intermediates may be Markdown files before approval.
  - Final assembled deliverables must be treated as proposed review content until rendered in `alignment/{skill}-{topic}.html`.
  - Canonical `design/**/*.md`, `design/**/*.yaml`, flow-tree child growth, and archive-at-canonical-write actions happen only after confirmed alignment approval.
- Patch mirrored `state-model` skills:
  - Reword synthesis from “assemble into canonical doc/manifest” to “assemble a proposed domain model and manifest for the alignment page.”
  - Require the alignment page to be built from the proposed content first.
  - Keep `design/domain-model-{topic}.md`, `design/model-tree-{topic}.yaml`, flow-tree `model_tree_ref`, glossary writes, and archive cleanup inside the `On approval` block only.
- Patch mirrored `ux-variations` skills:
  - Reword chunked assemble from “assemble into canonical `design/{slug}/ux-variations-[topic].md`” to “assemble proposed whole-set review content.”
  - Require the alignment page to present the complete proposed variation plan before canonical writes.
  - Keep final variation plan, interview log, flow-tree `ux_variations[]` status/artifact updates, and archive cleanup inside the `On approval` path only.
- Archive and bump versions:
  - `state-model`: `v0.4 -> v0.5` for Codex and Claude.
  - `ux-variations`: `v0.24 -> v0.25` for Codex and Claude.
  - Update each `CHANGELOG.md`.
- Regenerate `DESIGN-TREE-LOOP.md` bundles with `node scripts/upgrade-design-tree-loop.mjs`.

## Tests
- Extend `tests/layer1/product-design-flow-tree.test.ts` to assert:
  - The convention contains the HTML-first canonical write rule.
  - Active `state-model` and `ux-variations` contracts distinguish proposed review content from canonical writes.
  - Canonical `design/**/*.md` / `design/**/*.yaml` writes appear in approval-gated wording, not pre-approval assemble wording.
- Run:
  - `node scripts/upgrade-design-tree-loop.mjs --check`
  - `node scripts/skill-convention-bundle-audit.mjs`
  - `pnpm --dir tests exec vitest run layer1/product-design-flow-tree.test.ts layer1/skill-alignment-routing-audit.test.ts layer1/frontmatter.test.ts`
  - `scripts/skill-archive-audit.sh --strict`
  - `scripts/skill-mirror-parity-audit.sh --verbose`
  - `npm run skillpacks:build`
  - `npm run skillpacks:verify`
  - `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
  - `git diff --check`

## Assumptions
- Scope is final canonical deliverables only. Per-framework and per-variation Markdown intermediates remain valid because they are the durable chunk cursor, not user-approved canonical artifacts.
- No new alignment gates are added. The stricter rule clarifies timing around the existing single final HTML alignment gate.
- The implementation should update task docs, ship manifest, generated showcase data, commit, and push according to the repo’s existing shipping contract.
