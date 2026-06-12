# Ship Manifest - Generated Skill Root Hygiene

## User Goal

Unblock `$ship-end` by treating `.codex/skills/**` and `.claude/skills/**` as generated local skill install artifacts, removing the two tracked generated-root files while keeping local files on disk.

## Changed Files

- `.gitignore`
- `.codex/skills/skill-interview/SKILL.md` (removed from Git index only)
- `.claude/skills/skill-interview/SKILL.md` (removed from Git index only)
- `prompts/ship-end/skill-prompt-20260612-160019-generated-root-shipping-blocker.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-12-generated-skill-root-hygiene.md`

## Per-File Purpose

- `.gitignore`: replace broad `.codex` ignore with root and recursive `.codex/skills/` and `.claude/skills/` generated-root patterns so generated skill roots are ignored without hiding unrelated future `.codex` project config.
- `.codex/skills/skill-interview/SKILL.md`: stop tracking the generated Codex local install copy.
- `.claude/skills/skill-interview/SKILL.md`: stop tracking the generated Claude local install copy.
- `prompts/ship-end/...`: capture the visible `$ship-end` invocation and provided plan for prompt-history compliance.
- `tasks/roadmap.md`: record the narrow hygiene plan and acceptance criteria.
- `tasks/todo.md`: record completed hygiene work and distinguish the resolved generated-root blocker from the still-separate broader dirty tree.
- `tasks/history.md`: record the session outcome.
- `tasks/ship-manifest-2026-06-12-generated-skill-root-hygiene.md`: document the shipping boundary and evidence.

## User-Goal Mapping

- Removing the two generated-root files from the index directly satisfies the plan's `git rm --cached` requirement.
- Narrow root and recursive generated-skill ignore rules keep future generated local skill refreshes out of commits while avoiding an over-broad `.codex` ignore.
- Task docs and this manifest make the hygiene commit auditable and separate from the larger dirty validation-remediation tree.

## Tests Run

- `git ls-files .codex/skills .claude/skills` (passed; no tracked generated-root files remain)
- `find .codex/skills .claude/skills -maxdepth 2 -name SKILL.md -print` (passed; local generated skill files still exist)
- `git check-ignore -v .codex/skills/skill-interview/SKILL.md .claude/skills/skill-interview/SKILL.md` (passed; both paths are ignored by `.gitignore`)
- `git diff --check` (passed)

## Skipped Tests

- Full source/test/build suites are skipped for this hygiene boundary because no executable source code, generated runtime asset, package artifact, app behavior, or validation script changed. The relevant proof is Git index state, ignore behavior, local generated-file presence, and whitespace validation.
- Deploy is skipped because this is a repository hygiene commit and no `deploy.md` or `tasks/deploy.md` contract applies to the change.

## Adversarial Review

- Changed-file self-review plus targeted Git state checks. Failure modes considered:
  - Accidentally deleting local generated install files instead of untracking them.
  - Leaving any generated-root file tracked after the hygiene commit.
  - Continuing to ignore all of `.codex`, which could hide future project config.
  - Accidentally staging the broad pre-existing dirty tree.
- Accepted residual concern: the broader dirty worktree remains unshipped and must be handled by a fresh `$ship-end` pass after this hygiene commit.

## Residual Risk

The primary remaining risk is shipping confusion from the large pre-existing dirty tree. This commit only resolves the generated-root blocker; it does not prove or ship the validation-remediation boundary. The next operator should rerun `$ship-end` and build a separate manifest from the then-current dirty tree.

## Rollback Note

To roll this back, re-add the two generated files to tracking and restore the broad `.codex` ignore rule from the previous commit. Prefer not to roll back unless generated local install roots become canonical source, which contradicts the current ship/pack contracts.

## Next Command

`$ship-end`
