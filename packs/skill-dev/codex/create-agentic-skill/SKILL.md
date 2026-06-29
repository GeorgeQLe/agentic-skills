---
name: create-agentic-skill
description: Create or update a repo-managed skill inside this agentic-skills checkout under base/codex and optionally base/claude, then validate, commit, and push it
type: execution
version: v0.4
argument-hint: "<skill-name> [description] [--codex-only|--claude-only|--mirror]"
---

# Create Agentic Skill

Invoke as `$create-agentic-skill`.

Use this skill when the user wants to add or update a skill in the `agentic-skills` repository itself. This is the repo-managed counterpart to `$create-local-skill`, which writes experimental user-local skills under `~/.codex/skills` or `~/.claude/skills`.

## Process

1. **Confirm repository context.**
   - Verify the current repo is `agentic-skills` by checking for `base/codex/`, `base/claude/`, and `packages/skillpacks/`.
   - If the current repo is not `agentic-skills`, stop and ask for the checkout path.
   - Inspect `git status --short` and identify unrelated dirty files before editing.

2. **Resolve skill identity.**
   - Parse `<skill-name>` as kebab-case.
   - Parse the description when provided; otherwise ask for a one-line description.
   - Default to creating both `base/codex/<skill-name>/SKILL.md` and `base/claude/<skill-name>/SKILL.md` when the skill should exist for both agents.
   - Honor `--codex-only`, `--claude-only`, or `--mirror`.
   - If a local-only workflow is requested, route to `$create-local-skill` instead.

3. **Check for conflicts.**
   - Refuse to overwrite an existing unrelated skill without explicit user approval.
   - If updating an existing skill, read the current `SKILL.md` and preserve its purpose unless the user asked for a rewrite.
   - Check for stale old names when the task is a rename, and move directories rather than duplicating the skill.

4. **Draft the skill.**
   - Follow repo frontmatter conventions:
     - `name`
     - `description`
     - `type`
     - `version`
     - optional `argument-hint`
   - For Codex skills, include `Invoke as \`$<skill-name>\`.` after the title.
   - For Claude skills, omit the Codex invocation line unless existing local convention requires it.
   - Include clear `## Workflow`, `## Output`, and `## Constraints` sections.
   - Prefer durable procedure over one-off project notes.

5. **Apply correction lessons when relevant.**
   - If the skill is being created because of a user correction, update `tasks/lessons.md` with the mistake pattern and prevention rule.
   - Keep the lesson specific enough to prevent recurrence.

6. **Handle benchmark coverage.**
   - Benchmark coverage is owned by the separate `agentic-skills-benchmarks` repository. Do not edit `tests/harness/**` or `tests/layer4/**` in this repo.
   - For every new shared skill or material behavior update, decide whether the benchmark repo needs a matching coverage row, custom setup, blocked row, or smoke-only follow-up after the public export is refreshed.
   - In `agentic-skills-benchmarks`, add or register a deterministic custom setup under `tests/layer4/setups/` when local fixtures can exercise the skill without credentials, external services, paid actions, production deploys, or unsafe account state.
   - When adding or materially updating a custom setup, include a deterministic quality rubric when practical. Score local fixture facts, concrete file/command references, expected next-route handoffs, specificity, and forbidden fabrications as appropriate for the skill.
   - If output quality cannot be scored reliably from local fixtures, record an explicit blocked/deferred quality note in the setup or coverage review instead of adding a weak subjective rubric.
   - If deterministic local coverage is not safe yet, record an explicit `blocked` row with `blocked_reason` and `next_command`.
   - Use `$targeted-skill-builder <skill-name> benchmark coverage` when the benchmark-repo coverage work needs a focused follow-up.
   - Run the benchmark repo checks (`pnpm catalog:check`, `pnpm bench:coverage`, and focused tests) from `agentic-skills-benchmarks` after updating coverage there.

7. **Validate.**
   - Read back the new or updated `SKILL.md` files.
   - Run `rg` checks for old skill names, missing `version:`, missing `Invoke as` in Codex skills, and accidental writes under `~/.codex/skills` or `~/.claude/skills`.
   - If any tracked `SKILL.md` or `PACK.md` was created, deleted, renamed, or changed in behavior or metadata, refresh the public skills catalog export before shipping:
     - `node scripts/generate-skills-catalog-export.mjs`
     - `scripts/validate-skills-catalog-export.sh`
   - Include changed `exports/skills-catalog/v1/**` artifacts in the shipping boundary. The Skills Showcase lives in `agentic-skills-showcase`; if the skill change needs curated website copy, record the follow-up for that repo instead of editing app files here.
   - When benchmark coverage was updated in `agentic-skills-benchmarks`, import this repo's export there using a pinned ref or local `SKILLS_REPO_REF=WORKTREE`, then run its coverage checks.
   - Confirm unrelated dirty files remain unstaged.

8. **Commit and push.**
   - Stage only intended repo-managed skill files, public export artifacts, and directly related docs or lesson updates.
   - Commit on the repository primary branch (`main` when present, otherwise `master`) with a concise conventional commit message.
   - Push the branch.
   - Do not stage unrelated user changes.

## Output

- **Skill**: name and target paths created or updated
- **Mode**: Codex, Claude, or mirrored
- **Validation**: checks run and result
- **Git**: commit hash and pushed branch
- **Next Work**: exact follow-up, or `none` only when there is no useful follow-up

## Constraints

- Do not write to `~/.codex/skills` or `~/.claude/skills`; that is `$create-local-skill`.
- Do not update README or generated references when they already have unrelated unstaged edits unless the user explicitly asks to include them.
- Do not create pack-local skills unless the user asks for a pack path.
- Do not leave repo-managed skill changes uncommitted or unpushed unless the user explicitly says not to ship.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
