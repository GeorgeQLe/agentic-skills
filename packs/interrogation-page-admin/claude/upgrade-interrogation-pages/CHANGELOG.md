# Changelog

## v0.2 - 2026-06-28

- Split visible `data-recommended-answer` guidance from hidden `data-agent-recommended-answer` payloads during interrogation-page upgrades, preserving or creating answer-shaped hidden payloads for Apply recommended and compiled YAML while keeping visible guidance user-facing.

## v0.1 - 2026-06-27

- Added the required `data-apply-recommended` open-question marker and upgrade behavior: preserve/apply controls and scripts, label buttons `Apply recommended`, fill from `data-recommended-answer`, confirm before replacing non-empty answers, dispatch `input`/`change`, and avoid clipboard APIs.

## v0.0 - 2026-06-26

- Initial interrogation-page upgrade skill for dry-run drift audits and explicit apply-mode HTML upgrades of stage-zero `interrogation/*.html` round pages, with archive-before-replace safeguards, content-loss stop, and a batch-mode `tasks/todo.md` handoff when more than two pages need upgrade.
