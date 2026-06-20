# Pattern A Routing Wording Investigation - 2026-06-20

## Goal

Remove redundant "Continue In A Fresh Session" wording from Pattern A review-pending handoffs while preserving parent-owned YAML routing.

## Plan

- [x] Capture prompt history and validate the active source of the wording.
- [x] Update the Pattern A routing convention and audit to use a YAML-invocation section instead of fresh-session wording.
- [x] Update active Codex and Claude Pattern A parent/framework skills consistently, including version archives/changelogs.
- [x] Run focused routing audits and diff hygiene.
- [x] Record results, commit, and push.

## Review

- User claim validated: active Pattern A parent/framework contracts used `## Continue In A Fresh Session` while `## Next Work` already carried the review/compile/paste instruction, and the next parent invocation owns post-write routing.
- Applied fix: replaced the review-pending section with `## Invoke With YAML`, kept post-write routing under `## Recommended Next Command`, updated source conventions, active skill contracts, changelogs, archives, audit, prompt/task tracking, lessons, and regenerated the skillpacks package snapshot.
- Verification passed: `scripts/skill-research-loop-handoff-audit.sh`; `npm --workspace packages/skillpacks run build`; `npm --workspace packages/skillpacks run build:check`; `git diff --check`.
