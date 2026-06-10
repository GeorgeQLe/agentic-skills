# Ship Manifest: Alignment Pages Game AFPS Refresh

Date: 2026-06-10

## Scope

- Archived stale active alignment pages under `docs/history/archive/2026-06-10/014646/alignment/`.
- Replaced active alignment pages at their existing paths so stable links continue to work:
  - `alignment/workflow-design-three-pipelines.html`
  - `alignment/idea-scope-brief-npm-distribution.html`
  - `alignment/idea-scope-brief-skills-showcase.html`
- Updated `alignment/index.html` metadata for the amended active pages.
- Recorded rationale and verification in `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/history.md`.

## Verification

- Archive hashes match the original tracked versions for all three pages.
- Changed-page content checks passed for titles/context, Game AFPS content, required gates, proposed file changes where present, alignment page constants, and TTS includes.
- Exact stale wording scan passed for the requested old deck-model phrases across active docs/research/scripts/package metadata/app/alignment surfaces, excluding historical archives.
- `git diff --check` passed.

## Notes

- The broader repo had unrelated dirty work before this cleanup. This ship boundary should stage and commit only the alignment refresh files, archive copies, and task notes listed above.
