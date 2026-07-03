---
skill: ui-interview
agent: codex
captured_at: 2026-07-03T16:09:37-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Explicit Alignment Gate Outcome Contract

## Summary

Update the canonical `agentic-skills` alignment-page convention so review-page readiness is computed from machine-readable gate outcome metadata, never visible answer text. Apply the focused `ui-interview` instruction, version/archive the skill mirrors, regenerate bundled convention artifacts, and verify against the `gblock-party-redux` incident pattern.

## Key Changes

- Edit `docs/alignment-page-convention.md` only for the shared alignment contract:
  - Required radio options must carry explicit outcome metadata: `data-approval-effect="approve" | "block" | "clarify" | "other"`.
  - Compilers must compute `approval_status` from metadata plus unresolved section feedback, not regex or substring matches over labels, values, or prose.
  - Positive copy may contain words like “missing”, “reject”, “retry”, or “revision” when negated; those words must not affect readiness without blocking metadata.

- Add page-generation validation requirements to the shared convention:
  - All-approve path must compile to `response_status: complete`, `required_gate_status: complete`, `unanswered_required_questions: []`, and `approval_status: ready-for-agent-review`.
  - One blocking option must compile to `not-approved`.
  - One clarification path or unresolved section feedback path must compile to `not-approved`.

- Update both `packs/product-design/codex/ui-interview/SKILL.md` and `packs/product-design/claude/ui-interview/SKILL.md`:
  - Archive current `v0.29` with `scripts/skill-archive.sh`.
  - Bump to `v0.30`.
  - Add step-9 guidance: UI review pages with wording around missing coverage, rejected branches, retry, or revision must use explicit outcome metadata and verify the all-approve compile path before handoff.
  - Update both changelogs with the behavior change.

- Regenerate convention artifacts:
  - Run `node scripts/upgrade-alignment-page.mjs --legacy-bundles`.
  - Ensure generated `ALIGNMENT-PAGE.md` legacy bundles and shared resolver stubs are in sync.
  - Do not hand-edit generated `ALIGNMENT-PAGE.md` files.

- Target repo propagation:
  - Treat `/Users/georgele/projects/web/dev/gblock-party-redux/.codex/skills/ui-interview` as a managed installed copy, not the source of truth.
  - After source changes are verified and shipped, refresh the target repo’s managed skills from the updated pack rather than editing `.codex/skills/ui-interview` directly.

## Test Plan

- Add focused layer-1 regression coverage, likely in `tests/layer1/alignment-gates.test.ts`, asserting:
  - The shared convention requires `data-approval-effect` or equivalent explicit gate outcome metadata.
  - The convention forbids readiness classification by substring or regex over visible answer text.
  - The positive fixture `No decision-critical coverage is missing.` is explicitly documented as an approving path.
  - Blocking and clarification fixtures remain `not-approved`.

- Run:
  - `node scripts/upgrade-alignment-page.mjs --legacy-bundles --check`
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`
  - `bash scripts/skill-archive-audit.sh --strict`
  - `git diff --check`

- Spot-check target incident:
  - Confirm the archived bad regex remains only in history.
  - Confirm current/future review-page guidance prevents `No decision-critical coverage is missing.` from compiling as `not-approved`.

## Assumptions

- The durable fix belongs in `/Users/georgele/projects/tools/agentic-skills`, because `gblock-party-redux/.codex/skills/ui-interview` is a managed pack copy.
- No existing active generated page needs another manual edit; commit `a3af85c` already fixed the immediate `gblock-party-redux` page.
- This is a substantive `ui-interview` behavior update, so `v0.29 -> v0.30` is required for both Codex and Claude mirrors.
