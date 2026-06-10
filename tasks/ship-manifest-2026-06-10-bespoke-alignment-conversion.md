# Ship Manifest — 2026-06-10 — Bespoke Alignment Section Conversion (Drift Plan Phase 2 Step 5)

## User goal

Resolve the 7 allowlisted bespoke alignment skills: convert each to the generated stub + bundled `ALIGNMENT-PAGE.md` where the bespoke section is subsumed by the generated render, or keep it bespoke with contract tests where genuinely custom. Validate (`--check` exit 0 with reduced allowlist, full layer1 0 failed, `git diff --check` clean) and ship.

## Changed files and per-file purpose

- `packs/product-design/{claude,codex}/{consolidate-variations,prototype,spec-interview,ui-interview,ux-variations}/SKILL.md`, `packs/product-testing/{claude,codex}/uat/SKILL.md`, `packs/research-admin/{claude,codex}/research-roadmap/SKILL.md` (14 modified) — bespoke `Alignment Page` section replaced with the generator-owned stub (prototype additionally keeps its custom prototype-first timing paragraph as hybrid bespoke prose); version decimal bumped.
- Matching 14 `CHANGELOG.md` files — new version entry describing the conversion (uat notes the new glossary gate; prototype notes the retained timing rule).
- 14 new `archive/<old-version>/SKILL.md` files — pre-bump archives via `scripts/skill-archive.sh`.
- 14 new `ALIGNMENT-PAGE.md` bundles — emitted by `node scripts/upgrade-alignment-page.mjs` write mode in the same boundary as the allowlist removal.
- `scripts/alignment-bespoke-list.txt` — all 7 entries removed (same commit as the conversions, per allowlist policy); explanatory comment added; mechanism unchanged.
- `tests/layer1/afps-alignment-preview-gates.test.ts` — locally-gated and prototype tests now assert the stub in SKILL.md and read the gate contract (plus each skill's named skill-specific gate-map heading) from the bundled `ALIGNMENT-PAGE.md`; prototype timing rule stays pinned in both SKILL.md mirrors.
- `tests/layer1/alignment-gates.test.ts` — one stale assertion updated from the bespoke phrase "recommended path" to the convention's canonical "recommended output path".
- `docs/skills-showcase/assets/{skills-data.js,github-proof-data.js}`, `apps/skills-showcase/public/assets/{skills-data.js,github-proof-data.js}`, `docs/benchmark-results-matrix.md` — regenerated showcase data after SKILL.md version/metadata changes (benchmark matrix line is benign machine-local run-id churn from the generator).
- `tasks/todo.md` — Step 5 checked off with verdicts/review notes; drift-plan Phase 2 checklist updated; next-step plan (Step 6) added.
- `tasks/history.md`, `tasks/ship-manifest-2026-06-10-bespoke-alignment-conversion.md`, `prompts/ship/skill-prompt-20260610-111900-bespoke-section-conversion.md` — session record, this manifest, prompt history.

## User-goal mapping

- "Diff bespoke vs generated render, record verdicts" → verdicts in `tasks/todo.md` review notes: convert all 7 (sections were stale condensed convention copies + gate-map-subsumed lists); prototype hybrid for its custom timing rule.
- "Convert where subsumed, same-commit allowlist policy" → 14 stub conversions + allowlist emptied + 14 bundles in one commit.
- "Keep where custom + contract tests" → keep set empty; the one custom behavior (prototype timing) retained as hybrid prose and pinned by layer1 in both mirrors.
- "Validate" → see Tests run.

## Tests run (executable verification)

- `node scripts/upgrade-alignment-page.mjs --check` → exit 0 (`Bespoke allowlist: 0 skills, exact`, `Output paths: 284 bundles, exact`, `Generated bundles: 284 ownable, exact`).
- `node scripts/upgrade-alignment-page.mjs --dry-run` → exit 0, `Updated: 0`.
- Focused layer1: `afps-alignment-preview-gates`, `alignment-gates`, `upgrade-alignment-page-bespoke`, `upgrade-alignment-pages` → 53/53.
- Full layer1 → 55 files / 2188 tests / 0 failed (re-run after showcase regeneration).
- `scripts/skill-versions.sh --missing` → all 423 versioned; `scripts/skill-archive-audit.sh --strict` → 0 violations.
- Skills Showcase: both generators re-run; `validate-skills-showcase-data.sh` → fresh.
- `git diff --check` → clean.

## Skipped tests

- Benchmarks and non-layer1 suites (out of scope for this boundary; layer1 is the contract suite for skill content).
- `pnpm --dir apps/skills-showcase build` not run this boundary: showcase changes are data-only regenerations validated by the fingerprint validator; Vercel builds on push.

## Adversarial review

Changed-file self-review of the exact diff: every SKILL.md diff is scoped to the version line + alignment section (verified by filtered diff inspection on representative claude/codex mirrors); archives byte-match pre-edit HEAD (strict archive audit); bundles byte-match expected renderer output (`--check`); showcase diff inspected — version-driven churn plus one benign machine-local benchmark run-id line. One stale assertion found and fixed during review (`alignment-gates` "recommended path"). No further findings.

## Residual risk

- The converted skills' alignment contract now includes the full convention (TTS, central index, lifecycle, staged research workflow; uat gains the glossary gate). This is a deliberate behavior extension, recorded per skill in CHANGELOG entries; downstream consumers reading the old condensed sections will now follow the bundle instead.
- `docs/benchmark-results-matrix.md` run-id churn reflects machine-local benchmark state; harmless but regenerates differently per machine.

## Rollback note

Revert the conversion commit(s); the archives under `archive/<old-version>/` preserve the pre-conversion SKILL.md content independently. No data migrations.

## Next command

`/exec`
