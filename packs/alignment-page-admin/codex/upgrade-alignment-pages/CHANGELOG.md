# Changelog

## v0.2 - 2026-06-11

- Update required alignment-page feature wording from separate feedback-only/final-answer YAML paths to local section feedback YAML plus unified response YAML.

## v0.1 - 2026-05-31

- Add batch-mode handoff (step 4b): when 3+ pages need upgrade in apply mode, generate an exec-loop task plan in `tasks/todo.md` instead of rewriting all pages inline. Each page gets its own `$exec` iteration with a fresh context window.
- Inline apply (≤2 pages) continues as before.
- Updated shipping contract to document batch-mode behavior.

## v0.0 - 2026-05-30

- Initial alignment-page upgrade skill for dry-run drift audits and explicit apply-mode HTML upgrades with archive-before-replace safeguards.
