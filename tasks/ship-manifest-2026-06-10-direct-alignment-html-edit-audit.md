# Ship Manifest — Direct Alignment HTML Edit Audit (Drift Plan Phase 2 Step 6) — 2026-06-10

## User goal

Add a scriptable, read-only audit for active `alignment/*.html` pages so direct edits made without invoking a skill can be checked against the alignment-page convention, with layer1 enforcement, convention-doc documentation, and any current-page violations fixed in the same boundary (ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 6; Step 7 — root-instruction wiring — explicitly out of scope).

## Changed files

| File | Purpose | User-goal mapping |
|---|---|---|
| `scripts/audit-alignment-pages.mjs` (new) | Read-only audit: TTS include, category/tier data attributes, viewport meta, embed prohibition, index integrity; named per-page diagnostics, `exact\|DRIFT` summaries, shared exit 1, `--root` fixture support | The audit itself |
| `tests/layer1/audit-alignment-pages.test.ts` (new) | Repo-state exit-0 run + 12 `--root` fixture tests (one per diagnostic class, clean tree, empty tree) | Layer1 enforcement |
| `docs/alignment-page-convention.md` | New **Active-page audit** paragraph outside the generated-marker block | Documentation requirement |
| `alignment/analyze-sessions-skill-gaps-manual-asks.html` | TTS include injected via `node scripts/inject-tts.mjs`; tier attribute added | In-boundary violation fix |
| 36 `alignment/*.html` pages | Added `data-alignment-category` + `data-visual-tier="document"` per the convention's prefix rule (17 ops-analysis, 9 utility, 6 qa-meta, 2 research, 2 product-design; no page has charts, so all document tier) | In-boundary violation fix |
| `alignment/analyze-sessions-claude-usage-feedback.html` | Added missing `data-visual-tier="document"` (category already present) | In-boundary violation fix |
| `alignment/index.html` | Added the 2 unindexed pages (`skillmap.html` product-design 2026-06-10; `devtool-docs-audit-docs-freshness.html` qa-meta 2026-06-08, dates from page-internal/git dates); corrected header/section counts 38→41 | In-boundary violation fix |
| `tasks/todo.md` | Step 6 checkboxes/review notes/acceptance criteria; drift-plan checklist item checked; Step 6 phase review note; next-step plan (Step 7) | Task tracking + handoff |
| `tasks/history.md` | Session record | Task tracking |
| `tasks/ship-manifest-2026-06-10-direct-alignment-html-edit-audit.md` (new) | This manifest | Quality gate |
| `prompts/ship/skill-prompt-20260610-113858-direct-alignment-html-edit-audit.md` (new) | Prompt history capture for the `/ship` invocation | Prompt-history convention |

## Tests run (executable verification)

- `node --check scripts/audit-alignment-pages.mjs` — pass.
- `node scripts/audit-alignment-pages.mjs` — exit 0 on the repo: 41 active pages; `TTS include: 41 pages, exact`, `Page metadata: 41 pages, exact`, `Viewport meta: 42 pages, exact`, `Embed prohibition: 42 pages, exact`, `Index integrity: 41 entries, exact`. Re-run after the adversarial-review cleanup.
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` — 13/13 pass (re-run after cleanup).
- Full `pnpm --dir tests exec vitest run --project layer1` — 56 files / 2201 tests / 0 failed (up from 55/2188 by exactly the new file).
- `node scripts/upgrade-alignment-page.mjs --check` — exit 0 (`Bespoke allowlist: 0 skills, exact`, `Output paths: 284 bundles, exact`, `Generated bundles: 284 ownable, exact`); `--dry-run` exit 0 — the convention-doc edit (outside markers) triggered no bundle regeneration.
- `git diff --check` — clean.

## Skipped tests

- Workspace suites (`skillpacks`, `skills-showcase`) — boundary touches no workspace files, no `SKILL.md`/`PACK.md`, no showcase data; Skills Showcase regeneration not required.

## Adversarial review

Targeted changed-file self-review of the new audit script and tests (quality-sweep equivalent for this small, self-contained diagnostic script):

- Found and fixed one issue: `checkAttribute` took an unused `html` parameter — removed; focused tests re-run green.
- Verified edge handling: undated-entry segment is capped at the entry's closing `</article>` (card layout) or the next anchor, so a neighboring entry's date cannot mask an undated entry (pinned by the undated-entry fixture test with a dated neighbor); duplicate entries are deduped in the undated pass; external (`scheme:`) hrefs and index self-links are excluded from entry counting; multi-line `<html ...>` tags match (`[^>]*` spans newlines); empty/missing alignment dir exits 0 while a missing index with active pages present is drift.
- Page fixes verified mechanically: every active page's `<html>` tag now carries both attributes with valid slugs (loop check), categories match the convention prefix lists and the index's existing groupings (`workflow-design-three-pipelines` has no prefix match → Research, consistent with its current index section).

## Residual risk

- The audit validates the scriptable subset only; deeper convention rules (gate YAML shape, section feedback controls, dark-mode palette) remain judgment-based and unenforced until Step 7 wires the audit into root instructions for direct edits.
- All 39 fixed pages received `data-visual-tier="document"` because none contain canvas/SVG charts today; a future page that adds charts must update its own tier (audit checks enum validity, not tier accuracy).
- Index entry/date parsing is regex-based, not DOM-based; a radically different future index layout could need parser updates (fixture tests pin both list and card layouts' date semantics).

## Rollback note

Revert the commits of this boundary; no generated state, migrations, or external services involved. The audit script and test file are additive; page-attribute and index changes are plain HTML edits.

## Boundary

Working tree contained only this step's changes (39 alignment pages, convention doc, new script, new test, task docs, prompt capture) — no unrelated tracked changes present at ship time. `.claude/skills/**`/`.codex/skills/**` generated roots untouched. No user corrections occurred during this work, so no `tasks/lessons.md` update is required.

## Next command

`/exec` — Drift Plan Phase 2 Step 7 (require the audit/convention check in root alignment-page instructions for direct HTML edits) is planned in `tasks/todo.md`.
