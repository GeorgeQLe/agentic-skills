# Ship Manifest - Interrogation Open-Question Markers (Recommended Answer + Agent Confidence + Clarify-Copy)

Date: 2026-06-24
Branch: `master`

## Scope

- Extended the interrogation-page convention so every open-answer question (free-text and recommend-and-override) lives in a `data-open-question` block carrying four markers: `data-open-input`, a `data-recommended-answer` example answer, a `data-agent-confidence="high|medium|low"` badge, and a `data-clarify-copy` button.
- Added a "Need clarification (copy)" mechanism: the `data-clarify-copy` button copies a fixed `Question: "<text>"` + "I need clarification…" payload to the clipboard (Clipboard API with textarea-selection fallback, mirroring the alignment "Copy YAML" `copyText` idiom), with a visible copy-status line. Clipboard-only — not captured in the sidecar.
- Extended the sidecar schema note so each `open_answers` entry also records the agent-authored `recommended_answer` and `agent_confidence` for the round-by-round audit trail (small optional addition).
- Regenerated all 18 participating bundles (9 skills × claude/codex) via `scripts/upgrade-interrogation-page.mjs`; synced installed `.claude/.codex` copies (`pack.sh install ui-interview user-flow-map ux-variations` — the only participating skills installed) and the gitignored `packages/skillpacks/build/**` mirror.
- Added mechanical enforcement in `scripts/audit-interrogation-pages.mjs` (new "Open question" check) and a layer1 test.

## Versioning

- No skill version bumps. No `create-interrogation-page` owner skill exists and the generator does not version/archive bundles; this is convention infrastructure (consistent with prior interrogation-convention edits).

## Changes

- `docs/interrogation-page-convention.md` — the only authored edit (inside the `interrogation-convention` block, plus the non-bundled "Active-page audit" description).
- `scripts/audit-interrogation-pages.mjs` — counts `data-open-question` blocks (≥1 per round) and requires `data-recommended-answer`, `data-agent-confidence` (value in `{high, medium, low}`), and `data-clarify-copy` to each occur at least as many times (count-based association; no DOM parser).
- `tests/layer1/audit-interrogation-pages.test.ts` — passing fixture now emits the markers; added failing cases for missing open-question block, missing recommended answer, missing/invalid confidence, and missing clarify-copy button.
- Regenerated 18 `INTERROGATION-PAGE.md` bundles under `base/**` and `packs/**`.

## Validation

- Passed: `node scripts/upgrade-interrogation-page.mjs --check` (exit 0 — 18 ownable bundles byte-in-sync).
- Passed: `node scripts/audit-interrogation-pages.mjs` (0 active pages, all checks exact).
- Passed: `pnpm --dir tests exec vitest run --project layer1 layer1/audit-interrogation-pages.test.ts layer1/interrogation-confidence-gate.test.ts` (2 files, 33 tests).
- Passed: `scripts/skill-archive-audit.sh --strict` (400 skills, 0 violations).
- Passed: `node scripts/audit-task-docs.mjs` (0 failures).
- Passed: `npm --workspace packages/skillpacks run build:check` (390 skills, 41 packs; manifest byte-in-sync; staging boundary OK). Manifest content unchanged (bundles are not part of its fingerprint).
- Passed: `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` (showcase data unchanged; bundles are not showcase inputs).
- Passed: `npm run skillpacks:verify`.
- Passed: `git diff --check --cached`.

## Diagnostic Note

- `scripts/pack.sh doctor` continues to report unrelated pre-existing stale installed copies (`analyze-sessions`, `expert-review`, `reconcile-dev-docs`, `repo-glossary`, and a `ux-variations` v0.26→v0.27 source bump from concurrent work). Not modified for this task.

## Rollback

Revert the commit containing this manifest. That restores the prior interrogation convention/bundles, the previous audit script, and the previous test fixtures.
