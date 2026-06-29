# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: Separate Visible And Agent Recommended Answers.
Last closeout: interrogation pages now keep visible recommendation guidance separate from hidden agent answer payloads used by Apply recommended and compiled YAML.

## Recent Completion - Separate Visible And Agent Recommended Answers

### Execution Profile

- Parallel mode: serial
- Rationale: canonical convention, generated bundles, audit behavior, fixtures, and upgrade-skill versioning all share the same interrogation-page contract and should be changed in one lane.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current interrogation convention, generated `INTERROGATION-PAGE.md` bundles, audit script, layer1 tests, and upgrade skill mirrors.
- [x] Update the canonical convention so visible `data-recommended-answer` text is separate from hidden `data-agent-recommended-answer` payload text.
- [x] Update canonical JavaScript/YAML guidance to apply and compile the hidden agent payload while retaining backward-compatible fallback behavior.
- [x] Regenerate generated interrogation-page bundles from the canonical convention.
- [x] Extend active-page audit behavior and layer1 fixtures/tests to require a hidden agent answer per open question.
- [x] Archive and bump mirrored `upgrade-interrogation-pages` skills to `v0.2`, preserving/creating hidden agent payloads during upgrades.
- [x] Run required validation, inspect generated text, document results, commit, and push on the primary branch.

### Acceptance Criteria

- Every canonical `data-open-question` example includes visible `data-recommended-answer`, hidden `data-agent-recommended-answer`, existing confidence/clarify/apply/input attributes, and clear guidance for the two payload roles.
- `Apply recommended` fills `data-open-input` from the nearest hidden `data-agent-recommended-answer`, falling back to `data-recommended-answer` only for transition compatibility.
- Compiled YAML guidance records both `recommended_answer` and `agent_recommended_answer` for each `open_answers` entry.
- Active interrogation-page audits fail when an open question lacks a hidden agent answer or the agent answer is not hidden by an accepted convention.
- Generated `INTERROGATION-PAGE.md` bundles match the canonical convention.
- Mirrored `upgrade-interrogation-pages` skills are archived from `v0.1`, bumped to `v0.2`, and describe preserving/creating the hidden agent payload.

### Verification

Passed:

- `node scripts/upgrade-interrogation-page.mjs --check`
- `node scripts/audit-interrogation-pages.mjs`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-interrogation-pages.test.ts layer1/upgrade-interrogation-pages.test.ts`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `node scripts/audit-task-docs.mjs`
- `node scripts/skill-convention-bundle-audit.mjs`
- `git diff --check`
- Manual inspection of generated convention text for visible recommendation guidance and hidden agent answer-shaped payload guidance.

Review/results:

- The plan's root cause was confirmed: `data-recommended-answer` served both as visible user guidance and the value copied into open-answer textareas/YAML.
- The canonical convention now requires visible `data-recommended-answer` plus hidden `data-agent-recommended-answer` in every `data-open-question` block.
- The Apply recommended handler now reads hidden `data-agent-recommended-answer` first, including hidden input `value` payloads, and falls back to `data-recommended-answer` only during transition.
- Compiled YAML guidance now records `recommended_answer`, `agent_recommended_answer`, and `agent_confidence` per open answer.
- `scripts/audit-interrogation-pages.mjs` now fails missing or visible `data-agent-recommended-answer` payloads, accepts the documented hidden conventions, and counts open-question/recommended markers by opening tag to avoid selector-string false positives.
- Layer1 coverage proves missing hidden payload failure, visible payload failure, accepted hidden conventions, and script-selector non-counting.
- Mirrored `upgrade-interrogation-pages` skills were archived at `v0.1`, bumped to `v0.2`, and updated to preserve/create hidden agent payloads.
- Advisory task status from `node scripts/audit-task-docs.mjs`: `tasks/manual-todo.md` has 4 unchecked manual advisory items and `tasks/recurring-todo.md` has 2 unchecked recurring advisory items; none are promoted into active work.
