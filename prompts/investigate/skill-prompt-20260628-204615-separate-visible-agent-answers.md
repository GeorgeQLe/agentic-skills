---
skill: investigate
agent: codex
captured_at: 2026-06-28T20:46:15-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

```text
A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Separate Visible and Agent Recommended Answers

## Summary
Fix the interrogation-page bug where `Apply recommended` copies human-facing instructions into open-answer textareas and YAML. The root cause is that `data-recommended-answer` currently serves two roles: visible explanation for the user and machine-applied answer payload. Split those roles.

## Key Changes
- Update `docs/interrogation-page-convention.md` so every `data-open-question` has:
  - `data-recommended-answer`: visible user-facing guidance/example.
  - `data-agent-recommended-answer hidden`: hidden agent-facing answer text, with no user instructions like “override if…” or “if you have none…”.
  - Existing `data-agent-confidence`, `data-clarify-copy`, `data-apply-recommended`, and `data-open-input`.
- Change the canonical apply handler to fill `data-open-input` from nearest `data-agent-recommended-answer`, falling back to `data-recommended-answer` only for backward compatibility during transition.
- Change compiled YAML guidance so each `open_answers` entry records both:
  - `recommended_answer`: visible user-facing recommendation shown on the page.
  - `agent_recommended_answer`: hidden agent-facing payload intended for the textarea/YAML.
- Regenerate all generated `INTERROGATION-PAGE.md` bundles with `node scripts/upgrade-interrogation-page.mjs`.
- Update `scripts/audit-interrogation-pages.mjs` to require at least one `data-agent-recommended-answer` per `data-open-question` and validate it is hidden via `hidden`, `type="hidden"`, `aria-hidden="true"`, or inline/class-hidden convention.
- Update `tests/layer1/audit-interrogation-pages.test.ts` fixtures and add failing coverage for missing hidden agent answer.
- Update `packs/interrogation-page-admin/{codex,claude}/upgrade-interrogation-pages/SKILL.md` to preserve/create the new hidden agent payload when upgrading pages, archive current `v0.1` to `archive/v0.1/SKILL.md`, bump to `v0.2`, and update both changelogs.
- Create the required prompt-history file under `prompts/investigate/` and task tracking in `tasks/roadmap.md` and `tasks/todo.md` during implementation, then commit and push per repo workflow.

## Test Plan
- Run `node scripts/upgrade-interrogation-page.mjs --check`.
- Run `node scripts/audit-interrogation-pages.mjs`.
- Run `pnpm exec vitest run tests/layer1/audit-interrogation-pages.test.ts tests/layer1/upgrade-interrogation-pages.test.ts`.
- Inspect generated convention text to confirm examples state:
  - visible recommendation may include user guidance;
  - hidden agent recommendation must be answer-shaped, agent-facing, and free of instructions to the user.

## Assumptions
- No existing active `interrogation/*.html` pages need migration in this checkout.
- The hidden attribute name will be `data-agent-recommended-answer`.
- Backward-compatible fallback to `data-recommended-answer` is acceptable in the JS handler, but new pages and audits require the hidden field.
```
