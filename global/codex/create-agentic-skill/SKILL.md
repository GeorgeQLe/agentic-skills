---
name: create-agentic-skill
description: Create or update a repo-managed skill inside this agentic-skills checkout under global/codex and optionally global/claude, then validate, commit, and push it
type: execution
version: 0.1.0
argument-hint: "<skill-name> [description] [--codex-only|--claude-only|--mirror]"
---

# Create Agentic Skill

Invoke as `$create-agentic-skill`.

Use this skill when the user wants to add or update a skill in the `agentic-skills` repository itself. This is the repo-managed counterpart to `$create-local-skill`, which writes experimental user-local skills under `~/.codex/skills` or `~/.claude/skills`.

## Workflow

1. **Confirm repository context.**
   - Verify the current repo is `agentic-skills` by checking for `install.sh`, `global/codex/`, and `global/claude/`.
   - If the current repo is not `agentic-skills`, stop and ask for the checkout path.
   - Inspect `git status --short` and identify unrelated dirty files before editing.

2. **Resolve skill identity.**
   - Parse `<skill-name>` as kebab-case.
   - Parse the description when provided; otherwise ask for a one-line description.
   - Default to creating both `global/codex/<skill-name>/SKILL.md` and `global/claude/<skill-name>/SKILL.md` when the skill should exist for both agents.
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

6. **Validate.**
   - Read back the new or updated `SKILL.md` files.
   - Run `rg` checks for old skill names, missing `version:`, missing `Invoke as` in Codex skills, and accidental writes under `~/.codex/skills` or `~/.claude/skills`.
   - Confirm unrelated dirty files remain unstaged.

7. **Commit and push.**
   - Stage only intended repo-managed skill files and directly related docs or lesson updates.
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
