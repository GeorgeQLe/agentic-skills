# Ship Manifest — ux-variations assemble-stop review-gate carve-out

Date: 2026-07-04

## User goal
Ship the /exec-executed coupled unit (steps 1–6) plus the deferred publish steps (7–8) of the investigation fix: resolve the contract collision at the chunked assemble+approve stop where the alignment Pre-approval stop and the chunking Progress Handoff Block both mandated a same-`command` YAML.

## Changed files (shipping boundary)
Canonical sources:
- `docs/alignment-page-convention.md` — Pre-approval stop: *Precedence at chunked assemble stops* clause.
- `docs/design-tree-loop-convention.md` — §5 *Assemble-ready review-gate exception* + Optional Human Review anchor reconciliation.
- `packs/product-design/codex/ux-variations/SKILL.md` — §0c exception + step 8 carve-out; version v0.32→v0.33.
- `packs/product-design/claude/ux-variations/SKILL.md` — same carve-out (`/` syntax); version v0.31→v0.32.
- `packs/product-design/codex/ux-variations/CHANGELOG.md`, `packs/product-design/claude/ux-variations/CHANGELOG.md` — v0.33 / v0.32 entries.
- `packs/product-design/codex/ux-variations/archive/v0.32/SKILL.md`, `packs/product-design/claude/ux-variations/archive/v0.31/SKILL.md` — pristine pre-change snapshots.

Generated (index/convention-sourced):
- 22 `packs/product-design/**/DESIGN-TREE-LOOP.md` + `packs/product-testing/**/uat/DESIGN-TREE-LOOP.md` — regenerated with the assemble-ready exception.
- `exports/skills-catalog/v1/**` — regenerated public catalog export.
- `packages/skillpacks/dist/skillpacks-manifest.json` (+ build-package fingerprint) — index-generated manifest.

Task docs:
- `tasks/todo.md` (steps 1–7 checked), `tasks/history.md`, this manifest.

## Per-file purpose / user-goal mapping
Each canonical edit foregrounds "Review required" and a single compiled response YAML at the assemble stop, dropping repeat-command / second-`## Invoke With YAML` framing (reserved for setup/per-variation stops). Bundles + catalog + manifest propagate metadata (version) and the shared §5 rule to runtime consumers.

## Tests / verification run (executable)
- `node scripts/upgrade-design-tree-loop.mjs --check` → exit 0.
- `node scripts/upgrade-alignment-page.mjs --check` → exit 0.
- `node scripts/audit-alignment-pages.mjs` → exit 0.
- `git diff --check` → clean.
- Catalog: `node scripts/generate-skills-catalog-export.mjs` + `scripts/validate-skills-catalog-export.sh` → pass.
- Manifest: `npm run build:manifest` (index-sourced) + `build:check` → pass.
- `node scripts/audit-task-docs.mjs` → pass.

## Skipped tests
No layer1/package Node test suites — the change is convention/policy prose + regenerated markdown bundles + regenerated metadata artifacts; no executable product code path changed.

## Adversarial review
Fix originated from a /investigate-verified root cause. Adversarial equivalent: canonical-source acceptance replay (confirmed the assemble stop leads with review, presents only the compiled response YAML, drops repeat-command/second-YAML/`Exact next command`, retains progress fields) + contract grep proving assemble-ready decoupled from repeat-command framing while setup/per-variation stops retain it + step-7 sibling audit (state-model/ui-interview/user-flow-map need no equivalent edit).

## Residual risk
Low. Legacy sibling `ALIGNMENT-PAGE.md` bundles remain frozen (by design, not `--check`-validated in default mode); the alignment convention reaches runtime via the packaged resolver regenerated at build/publish, and the behavior-bearing `DESIGN-TREE-LOOP.md` bundle carries the exception. Version divergence between the two variants (codex ahead by one) predates this change.

## Rollback note
Revert the ship commit(s); archives + CHANGELOG entries make the prior v0.32/v0.31 SKILL.md content recoverable.

## Next command
/exec
