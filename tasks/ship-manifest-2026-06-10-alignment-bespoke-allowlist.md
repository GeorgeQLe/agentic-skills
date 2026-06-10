# Ship Manifest — 2026-06-10 — Alignment Bespoke Allowlist Hardening

## User goal

Execute ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Steps 1-2 from the approved `/exec` plan: reconcile the already-satisfied Step 1 (Codex `customer-discovery` generator-ownable) and harden `scripts/upgrade-alignment-page.mjs` so sibling bundles cannot be skipped as bespoke without a failing diagnostic or explicit allowlist, then `/ship` the boundary.

## Changed files

- `scripts/upgrade-alignment-page.mjs` (modified)
- `scripts/alignment-bespoke-list.txt` (new)
- `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (new)
- `docs/alignment-page-convention.md` (modified, outside the `alignment-convention:start/end` marker block)
- `tasks/todo.md` (modified)
- `tasks/history.md` (modified)
- `tasks/ship-manifest-2026-06-10-alignment-bespoke-allowlist.md` (new)
- `prompts/exec/skill-prompt-20260610-012123-next-step.md` (new, from the `/exec` session)
- `prompts/ship/skill-prompt-20260610-014403-alignment-bespoke-allowlist.md` (new)

## Per-file purpose and user-goal mapping

- `scripts/upgrade-alignment-page.mjs` — per-skill bespoke/generated classification tracking across mirrors, exact-allowlist validation, three failing diagnostics (unlisted bespoke, mixed siblings even when allowlisted, stale allowlist entry), `Bespoke allowlist: N skills, exact|DRIFT` summary line, and a `--root <path>` flag for fixture testing. This is Step 2's core: the `customer-discovery` silent-skip failure mode now exits 1.
- `scripts/alignment-bespoke-list.txt` — the exact allowlist seeded with the 7 currently-bespoke skills (`consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations`, `uat`, `research-roadmap`), all hand-authored symmetrically in both mirrors.
- `tests/layer1/upgrade-alignment-page-bespoke.test.ts` — repo-state assertions (allowlist matches the bespoke set computed independently from active `SKILL.md` files; every entry bespoke in both mirrors) plus 5 behavioral fixture tests via `--root` covering all three failure modes and both pass cases.
- `docs/alignment-page-convention.md` — documents the bespoke allowlist and failing diagnostics near the generator description; no generated-marker-block change, so no bundle regeneration.
- `tasks/todo.md` — Phase 2 Steps 1-2 checked off with review notes; next-step plan added (layer1 contract test reconciliation).
- `tasks/history.md` — session record.
- Prompt history files — required by the repo's Prompt History convention for the `/exec` and `/ship` invocations.

## Tests run (executable verification)

- `node --check scripts/upgrade-alignment-page.mjs` — pass.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — exit 0; `Updated: 0`, `Bundled files written: 0`, `Preserved bespoke sections: 14`, `Bespoke allowlist: 7 skills, exact`.
- `node scripts/upgrade-alignment-page.mjs` (write mode) — exit 0; no tracked diff produced.
- `pnpm --dir tests exec vitest run --project layer1 layer1/upgrade-alignment-page-bespoke.test.ts layer1/upgrade-alignment-pages.test.ts` — 2 files, 13 tests, all pass.
- `pnpm --dir tests exec vitest run --project layer1` (full suite) — 2147 passed, 18 failed in 11 files. **All 18 failures reproduce identically at clean HEAD `ea2e3291` (verified by stashing the boundary and re-running the same files: 18 failed / 36 passed both times).** The failure set is byte-for-byte pre-existing and unaffected by this boundary.
- `git diff --check` — clean.

## Skipped tests

- Layer2-4 vitest projects — LLM-driven benchmark layers; not relevant to a deterministic generator/script change with dedicated layer1 coverage.
- Skills Showcase regeneration/validation — no `SKILL.md` or `PACK.md` changed in this boundary, so the showcase freshness trigger does not apply.

## Adversarial review

Method (explicitly justified equivalent): fixture-based behavioral tests written to attack each diagnostic (unlisted bespoke, mixed pair under allowlist, stale entry, plus both pass cases), an independent re-implementation of the classification logic in the test file checked against the allowlist and repo state, a clean-tree failure-set comparison to prove boundary isolation, and a line-level self-review of the diff. Findings reviewed and accepted:

- Missing allowlist file degrades to an empty set — correct for fixture repos; the repo-state test pins the file's existence in this repo.
- Classification keys on the skill directory basename, so a hypothetical same-named skill in two different packs would share one classification entry. Accepted: claude/codex mirrors share basenames by design and pack-skill-mirror parity is enforced elsewhere.
- Diagnostics run after write-mode writes — intentional; the writes are the sync being validated, and dry-run offers a no-write preview.

## Residual risk

- 18 pre-existing layer1 contract test failures (stale version pins and stale/divergent wording assertions) remain on `master`; they pre-date this boundary and are planned as the immediate next work item in `tasks/todo.md`.
- The allowlist is name-based; a future bespoke conversion must remove the entry in the same commit or the stale-entry diagnostic will fail the generator (by design).

## Rollback note

Revert the two commits of this boundary. The hardening is additive: without it the generator returns to its previous silent-skip behavior; no generated bundle content changed.

## Boundary separation

A concurrent agent session ("Alignment Pages Game AFPS Refresh", a live Codex session) was actively working in this repo during shipping. Its in-flight, uncommitted files — `alignment/workflow-design-three-pipelines.html`, `alignment/idea-scope-brief-npm-distribution.html`, `alignment/idea-scope-brief-skills-showcase.html`, `alignment/index.html`, `tasks/roadmap.md`, `docs/history/archive/2026-06-10/`, and its own plan section at the top of `tasks/todo.md` — are excluded from this boundary and left for that session to ship. `tasks/todo.md` was staged partially (this boundary's sections only, via index-level staging) so the concurrent session's uncommitted plan section is not committed here. `tasks/history.md` contained only this session's append at staging time. All other files in this boundary are uncontended.

The 18 failing layer1 tests are tracked files untouched by this boundary, with clean-tree reproduction as proof (same 18 failures at HEAD `ea2e3291` with the boundary stashed).

## Next command

`/exec`
