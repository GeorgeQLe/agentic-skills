# Current Implementation - Clarify Chunked Skill Progress

## Goal

Make product-design chunked self-routing stops visibly explain progress and continuation, while fixing the active Codex `state-model` path contract to match the canonical pack source layout.

## Plan

- [x] Update the canonical design-tree loop convention with a required Progress Handoff Block for chunked setup, per-unit, and assemble stops.
- [x] Regenerate `DESIGN-TREE-LOOP.md` bundles from the convention.
- [x] Archive and bump mirrored `state-model` skills from `v0.3` to `v0.4`; fix Codex malformed paths and add explicit progress-handoff requirements.
- [x] Archive and bump mirrored `ux-variations` skills from `v0.23` to `v0.24`; add explicit progress-handoff requirements.
- [x] Add focused Layer 1 coverage for malformed Codex `state-model` paths and missing chunked progress copy.
- [x] Run malformed-path, progress-handoff, convention, and focused test checks; fix any failures.
- [x] Record review notes, commit, and push intended changes on `master`.

## Acceptance Criteria

- Active Codex and Claude pack skills require a user-facing Progress Handoff Block at every chunked stop.
- The handoff copy explains completed count, durable cursor, completed/current phase, next phase, why the same command is repeated, fresh-session guidance, and exact next command.
- Codex `state-model` active paths use `design/{slug}/_working/state-model-{topic}-brief.md`, `design/{slug}/state-model-{topic}/{framework}.md`, and `alignment/state-model-{topic}.html`.
- Generated `DESIGN-TREE-LOOP.md` bundles are in sync with `docs/design-tree-loop-convention.md`.
- Regression coverage fails on the malformed `$state-model` paths and missing progress-handoff language.

## Review

- Added a required Progress Handoff Block to `docs/design-tree-loop-convention.md`; regenerated all `DESIGN-TREE-LOOP.md` bundles so every design-tree skill receives the convention update.
- Archived and bumped mirrored `state-model` skills to `v0.4`; Codex path literals now use slash-delimited active paths for the context brief, framework intermediates, and alignment page.
- Archived and bumped mirrored `ux-variations` skills to `v0.24`; chunked setup, variation, and assemble stops now require the explicit progress block and repeated-command explanation.
- Added Layer 1 regression coverage in `tests/layer1/product-design-flow-tree.test.ts` for active `state-model` paths and progress handoff copy.
- Regenerated Skills Showcase generated data and package staging metadata required by the skill version changes.
- Verification passed: active malformed-path guard with archive exclusion; progress-handoff guard; `node scripts/upgrade-design-tree-loop.mjs --check`; `node scripts/skill-convention-bundle-audit.mjs`; corrected focused Vitest command (`pnpm --dir tests exec vitest run layer1/product-design-flow-tree.test.ts layer1/skill-alignment-routing-audit.test.ts layer1/frontmatter.test.ts`) with 1105 passing tests; `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`; `npm run skillpacks:build`; `npm run skillpacks:verify`; `git diff --check`; `scripts/skill-archive-audit.sh --strict`; `scripts/skill-mirror-parity-audit.sh --verbose`; `scripts/base-skill-version-parity-audit.sh`.
- The original malformed-path guard over all `packs/product-design` still reports historical archive hits, including the newly archived Codex `state-model` v0.3 snapshot. Active-source validation uses `--glob '!**/archive/**'`, matching the archive-retention assumption.

# Latest Implementation - Skills Library + Browse Revamp Complete

## Status

Shipped 2026-06-21 (commits `a793c76c`, `8aad0695`, `200eba13`). No active phase selected.

## Review

- Replaced the weak Stage-1 `.select-secondary` deck-pill list with a two-audience
  browse surface: a dedicated SSG `/library` route (Skills + Decks tabs, live
  search/Type/Platform/Pack filtering, card-grid tiles → `/card/[id]` modal, deck
  cards → `/deck/<slug>` builder hard-load) and an inline `BrowseSection` on `/`
  (shared `DeckCard`s + "Browse the full library →"). `Library` added to nav.
- Contract preserved: deck mount-once morph, 5 legacy 308 redirects, and the
  staged-journey controller/`BuildStage`/`__landing` bridge are untouched.
- Verified: `tsc` clean, Vitest 159/159, `next build` OK (`/library` prerendered
  static, 196 crawlable `/card` anchors), Playwright 33/33 on the new + locked
  specs; deck-table-shell 18/18 real tests green (2 dev-only debug-driver tests
  can't run under a prod build). See `tasks/history.md` for the full record.

## Next Work

Discover the next concrete product, workflow, documentation, or package-maintenance phase, or explicitly park the project.

**Recommended next command:** `$brainstorm`

# Prior Research - Managed Skill Library SaaS Prompt

## Status

Research and prompt drafting complete.

## Plan

- [x] Capture prompt history and local package context.
- [x] Research current competitor and adjacent product surfaces.
- [x] Draft the separate-repo `$idea-scope-brief` prompt.
- [x] Verify source links and diff hygiene.
- [x] Record review notes, commit, and push intended artifacts.

## Review

- Read the active `idea-scope-brief` skill contract and used it as the target prompt format, while keeping the actual deliverable separate from a canonical idea-brief run.
- Confirmed local `skillpacks` context from `README.md`, `packages/skillpacks/package.json`, and `docs/skillpacks-npm-distribution.md`.
- Researched skills.sh public positioning, docs, CLI, API, audit page, and official-skills directory.
- Researched adjacent Claude Skills, Agent Skills standard, OpenAI GPT/agent surfaces, and recent agent-skill ecosystem/security papers.
- Wrote the reusable prompt at `research/managed-skill-library-saas-prompt.md`.
- Verified the prompt distinguishes sourced facts from hypotheses and preserves the core gap question: managed/private/white-label SaaS versus public directory/CLI package.

## Next Work

No immediate implementation work remains for this prompt-preparation task.

# Previous Implementation - Landing Redesign Complete

## Status

No active implementation phase is currently selected.

## Review

- Landing redesign (staged journey Select → Open → Build + light/dark theme) for
  `apps/skills-showcase` was implemented across 6 phases and shipped on 2026-06-21
  (commits `07ee9941`..`ebca5806`). See `tasks/history.md` for the full record.
- The deck-routing morph/mount-id contract is preserved — full
  `e2e/deck-table-shell.spec.ts` suite passes via the new `revealTable()` helper.
- Verified: `tsc` clean, Vitest 133/133, Playwright 45/45, `next build` OK, plus
  light/dark screenshot QA.
- Unified Experience Phases 1–7 remain complete (archived under `tasks/phases/`).
- `tasks/manual-todo.md` contains only deferred production newsletter setup tasks
  from Phase 38; they do not block current development.
- `tasks/recurring-todo.md` has 2 advisory items, but advisory queues are not
  selected by `$exec`.

## Next Work

Discover the next concrete product, workflow, documentation, or package-maintenance phase, or explicitly park the project.

**Recommended next command:** `$brainstorm`
