# Ship Manifest - Finalized Artifact Routing Lesson

## User Goal

Wrap up the session after clarifying that finalized JTBD positioning output was missing explicit next-step routing and after identifying the npm publish blocker caused by a dirty tracked task file.

## Changed Files

- `tasks/lessons.md`
- `prompts/investigate/skill-prompt-20260617-102230-codex-claude-version-gaps.md`
- `prompts/ship-end/skill-prompt-20260617-122807-ship-end.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-17-finalized-artifact-routing-lesson.md`

## Per-file Purpose

- `tasks/lessons.md`: records the correction that finalized research/alignment artifacts still need explicit terminal routing.
- `prompts/investigate/...`: commits the previously untracked visible invocation log for the earlier `investigate` skill run.
- `prompts/ship-end/...`: records the visible `ship-end` invocation and pasted skill context.
- Task/history/manifest files: document the shipping boundary, validation, residual risk, and next route.

## User-goal Mapping

The shipped boundary removes the tracked dirty-file blocker that prevented `./publish.sh --dry-run 0.1.6`, preserves the required correction lesson, and keeps prompt-history artifacts tracked by default.

## Tests Run

- `git diff --check`
- `git status --short --branch`
- `node -e "...docs sanity ok"` over the lesson, ship manifest, and ship-end prompt log

## Skipped Tests

- Package tests/builds were not rerun for this wrap-up because the shipped changes are documentation, task, and prompt-history only. Earlier in the session, the user ran `npm --workspace packages/skillpacks run test:node` and `npm run skillpacks:verify`; the failing command was the publish dry-run's clean-tree guard, not a package test failure.
- Deploy skipped because `tasks/deploy.md` classifies `tasks/**` and `prompts/**` as non-deploying evidence when no Skills Showcase runtime, generated public data, dependency, or deploy-config path changed.

## Adversarial Review

Checked the diff boundary for source/package changes, generated skill-root changes, and unrelated tracked edits. The boundary is documentation/task/prompt-history only.

## Residual Risk

The lesson improves future behavior but does not by itself enforce terminal routing in code. Correction enforcement: not applicable in this ship boundary because current `positioning` and Pattern A contracts already contain terminal handoff requirements; the observed issue was agent noncompliance with existing instructions. The concrete follow-up is the pending npm `0.1.6` publish after this clean-tree commit lands.

## Rollback Note

Revert this commit to remove the lesson, prompt-history additions, and task/history wrap-up notes.

## Next Command

`./publish.sh --dry-run 0.1.6`
