# Ship Manifest — 2026-06-10 — Root Instructions for Direct Alignment Edits (Drift Plan Phase 2 Step 7)

## User goal

Wire the Step 6 audit (`scripts/audit-alignment-pages.mjs`) into the root instruction surfaces so direct edits to active `alignment/*.html` pages made without invoking a skill must pass it before commit — the final ALIGNMENT-PAGE Bundling Drift Plan Phase 2 item — and pin the requirement language with a layer1 contract test.

## Changed files

Included in this shipping boundary:

- `CLAUDE.md`
- `AGENTS.md`
- `tests/layer1/audit-alignment-pages.test.ts`
- `tasks/todo.md`
- `tasks/history.md`
- `prompts/ship/skill-prompt-20260610-115700-root-instructions-direct-alignment-edits.md`
- `tasks/ship-manifest-2026-06-10-root-instructions-direct-alignment-edits.md`

Untouched pre-existing changes: none — `git status` showed only this boundary's files; the tree was clean at session start.

## Per-file purpose

- `CLAUDE.md` — new **Direct-edit audit.** paragraph in `### Alignment Page Template`: direct edits to active `alignment/*.html` pages made without invoking a skill must pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit; TTS-include diagnostics route to `node scripts/inject-tts.mjs`; archived pages under `docs/history/archive/` are out of scope.
- `AGENTS.md` — equivalent requirement as a new bullet at the end of `### Alignment Page Convention`, matching the file's bullet style.
- `tests/layer1/audit-alignment-pages.test.ts` — new `root instruction contract for direct alignment edits` describe block extracting each root file's alignment section and pinning `without invoking a skill`, the audit command, `(exit 0) before commit`, the inject-tts routing, and the archive exemption (file now 14 tests).
- `tasks/todo.md` — Step 7 section checked off with review notes; drift-plan checklist item 7 checked; Phase 2 marked complete with a Step 7 review-notes entry.
- `tasks/history.md` — session record appended.
- `prompts/ship/...` — prompt-history capture for this `/ship` invocation.
- This manifest — quality-gate record.

## User-goal mapping

- Root-instruction requirement → `CLAUDE.md` + `AGENTS.md` edits, both outside provisioned content (verified: the AGENTS section is hand-maintained and absent from the `provision-agentic-config` AGENTS block; the CLAUDE section sits below the line-118 provisioned marker).
- Pinned requirement language → new contract test in the audit's own layer1 test file (no pre-existing root-instruction contract test covered the alignment sections).
- Phase 2 completion bookkeeping → `tasks/todo.md` drift-plan checklist + review notes.

## Tests run (executable verification)

- Focused: `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` — 14/14 passed.
- Full: `pnpm --dir tests exec vitest run --project layer1` — 56 files / 2202 tests / 0 failed.
- `node scripts/audit-alignment-pages.mjs` — exit 0 (41 active pages, all five checks exact).
- `node scripts/upgrade-alignment-page.mjs --check` — exit 0 (284 ownable, exact; no bundle regeneration triggered by the root-file edits).
- `git diff --check` — clean.

## Skipped tests

- Layer2–4 suites: not run; the boundary touches root instruction docs and one layer1 test file only — no harness, script, or skill source changes.
- Skills Showcase regeneration/validation: not applicable — no SKILL.md/PACK.md changes.

## Adversarial review

Targeted self-review of the only source change (the contract test):

- Section extraction uses `content.indexOf(heading)`; verified each heading occurs exactly once per file (`grep -c` = 1 for both).
- The section-end regex `/^##/m` matches both `##` and `###` headings, correctly bounding the CLAUDE.md section at `### Excalidraw Convention` and the AGENTS.md section at `## Task Management`.
- Verified the requirement sentence appears exactly once per file, so the pinned phrases cannot be satisfied by stray text elsewhere in a different section.
- Considered failure mode: a future `provision-agentic-config` re-run replacing the AGENTS block. The hand-maintained section is outside the block text, and if it were ever clobbered the new contract test fails loudly — which is the intended enforcement.

No findings requiring source changes.

## Residual risk

- The requirement is instruction-level plus test-pinned; it does not technically block a commit (no git hook). Accepted: hooks are out of scope for the drift plan, and the layer1 gate catches drifted pages and removed instructions.
- The test pins exact phrases; future intentional rewording of the requirement must update the test in the same boundary (standard contract-test maintenance).

## Rollback note

Single-boundary revert: `git revert` the two commits (root-instruction/test commit and task-docs commit). No generated assets, no version bumps, no data migrations.

## Next command

/exec
