---
skill: skill-creator
agent: codex
captured_at: 2026-06-27T17:29:07-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Implement “Apply Recommended” for Interrogation Open Questions

## Summary
Add a required **Apply recommended** button to each interrogation `data-open-question` block. The button uses the nearest `data-recommended-answer` text to populate the nearest `data-open-input` field, preserving user-entered text by filling automatically only when empty and asking for confirmation before replacing existing text.

## Key Changes
- Update the canonical interrogation convention so every open question must include a fifth marker: `data-apply-recommended`.
- Define required behavior:
  - Button label: `Apply recommended`.
  - On click, find the closest `data-open-question`, then its `data-recommended-answer` and `data-open-input`.
  - If the input is empty, set its value immediately.
  - If the input already has text, show `window.confirm(...)`; replace only when confirmed.
  - After setting the value, dispatch `input` and `change` events so compile/YAML logic observes the change.
  - Support `<textarea>` and text `<input>`; do not use clipboard APIs for this action.
- Update the active-page auditor to require one `data-apply-recommended` button per `data-open-question`, with diagnostics parallel to `data-clarify-copy`.
- Regenerate bundled `INTERROGATION-PAGE.md` files from `docs/interrogation-page-convention.md` using `node scripts/upgrade-interrogation-page.mjs`.
- Update the `upgrade-interrogation-pages` Claude/Codex skill docs to recognize the new fifth marker and upgrade behavior. Because this is a behavior change to `SKILL.md`, archive and bump both mirrored skills from `v0.0` to `v0.1` with `scripts/skill-archive.sh <skill-dir>`, then update each `CHANGELOG.md`.

## Implementation Notes
- Add a compact vanilla JS snippet to the convention that page authors can inline with existing interrogation-page scripts:
  - Use `textContent.trim()` from `data-recommended-answer`.
  - Set `input.value = recommended`.
  - For status feedback, prefer a nearby lightweight status span if present; otherwise the value change is sufficient.
- Update resume-time conformance wording so review pages missing `data-apply-recommended` are upgraded like pages missing existing open-question markers.
- Update the batch upgrade skill language from “four open-question markers” to “five open-question markers,” and include preservation of apply-recommended controls/scripts in content-preservation checks.
- If tracked build/dist mirrors are expected for skillpacks, run the project’s existing build/package command after source updates and include resulting tracked artifacts.

## Test Plan
- Update `tests/layer1/audit-interrogation-pages.test.ts` fixture helper to include `data-apply-recommended` by default.
- Add a failing fixture case for an open question missing the apply button; expect `Open question drift` and a clear missing-marker diagnostic.
- Keep existing clean-fixture, missing recommended answer, confidence, and clarify-copy tests passing.
- Run:
  - `node scripts/audit-interrogation-pages.mjs`
  - `node scripts/upgrade-interrogation-page.mjs --check`
  - `pnpm --dir tests test:layer1 -- audit-interrogation-pages interrogation-confidence-gate upgrade-interrogation-pages`
- Optional manual smoke: create a temporary fixture page, click `Apply recommended`, verify empty fields fill immediately and non-empty fields require confirmation.

## Assumptions
- The control is mandatory and audited.
- Existing typed text must not be silently overwritten.
- There are currently no active `interrogation/*.html` pages in this repo, so implementation does not need a live-page migration.
