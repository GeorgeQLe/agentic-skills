---
name: create-agentic-skill
description: Create or update a repo-managed skill inside this agentic-skills checkout under global/claude and optionally global/codex, then validate, commit, and push it
type: execution
version: v0.0
argument-hint: <skill-name> [description] [--claude-only|--codex-only|--mirror]
---

# Create Agentic Skill

Use this skill when the user wants to add or update a skill in the `agentic-skills` repository itself. This is the repo-managed counterpart to `create-local-skill`, which writes experimental user-local skills under `~/.claude/skills` or `~/.codex/skills`.

## Process

1. **Confirm repository context.**
   - Verify the current repo is `agentic-skills` by checking for `install.sh`, `global/claude/`, and `global/codex/`.
   - If the current repo is not `agentic-skills`, stop and ask for the checkout path.
   - Inspect `git status --short` and identify unrelated dirty files before editing.

2. **Resolve skill identity.**
   - Parse `<skill-name>` as kebab-case.
   - Parse the description when provided; otherwise ask for a one-line description.
   - Default to creating both `global/claude/<skill-name>/SKILL.md` and `global/codex/<skill-name>/SKILL.md` when the skill should exist for both agents.
   - Honor `--claude-only`, `--codex-only`, or `--mirror`.
   - If a local-only workflow is requested, route to `create-local-skill` instead.

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
   - For Claude skills, use `## Process` when that matches existing Claude conventions.
   - For mirrored Codex skills, include `Invoke as \`$<skill-name>\`.` after the title.
   - Include clear workflow/process, output, and constraints sections.
   - Prefer durable procedure over one-off project notes.

5. **Apply correction lessons when relevant.**
   - If the skill is being created because of a user correction, update `tasks/lessons.md` with the mistake pattern and prevention rule.
   - Keep the lesson specific enough to prevent recurrence.

6. **Handle benchmark coverage.**
   - For every new shared skill or material behavior update, update `tests/harness/bench-coverage.ts` in the same shipping boundary.
   - Add or register a deterministic custom setup under `tests/layer4/setups/` when local fixtures can exercise the skill without credentials, external services, paid actions, production deploys, or unsafe account state.
   - When adding or materially updating a custom setup, include a deterministic quality rubric when practical. Score local fixture facts, concrete file/command references, expected next-route handoffs, specificity, and forbidden fabrications as appropriate for the skill.
   - If output quality cannot be scored reliably from local fixtures, record an explicit blocked/deferred quality note in the setup or coverage review instead of adding a weak subjective rubric.
   - If deterministic local coverage is not safe yet, record an explicit `blocked` row with `blocked_reason` and `next_command`.
   - Use `/targeted-skill-builder <skill-name> benchmark coverage` when the coverage work needs a focused follow-up before the skill can ship.
   - Run `pnpm --dir tests bench:coverage` after updating the matrix.

7. **Validate.**
   - Read back the new or updated `SKILL.md` files.
   - Run search checks for old skill names, missing `version:`, missing Codex invocation lines in Codex skills, and accidental writes under `~/.claude/skills` or `~/.codex/skills`.
   - Run `pnpm --dir tests bench:coverage` and any focused setup tests changed for the new benchmark row.
   - If any tracked `SKILL.md` or `PACK.md` was created, deleted, renamed, or changed in behavior or metadata, refresh the Skills Showcase data before shipping:
     - `node scripts/generate-skills-showcase-data.mjs`
     - `node scripts/generate-skills-showcase-github-data.mjs`
     - `scripts/validate-skills-showcase-data.sh`
   - Review curated showcase copy, catalog grouping, workflow animation text, and proof receipts when the skill change could affect the public website. Update the relevant site files or explicitly record why no curated website copy changed.
   - Confirm unrelated dirty files remain unstaged.

8. **Commit and push.**
   - Stage only intended repo-managed skill files, generated showcase assets, and directly related docs or lesson updates.
   - Commit on the repository primary branch (`main` when present, otherwise `master`) with a concise conventional commit message.
   - Push the branch.
   - Do not stage unrelated user changes.

## Output

- **Skill**: name and target paths created or updated
- **Mode**: Claude, Codex, or mirrored
- **Validation**: checks run and result
- **Git**: commit hash and pushed branch
- **Next Work**: exact follow-up, or `none` only when there is no useful follow-up

## Constraints

- Do not write to `~/.claude/skills` or `~/.codex/skills`; that is `create-local-skill`.
- Do not update README or generated references when they already have unrelated unstaged edits unless the user explicitly asks to include them.
- Do not create pack-local skills unless the user asks for a pack path.
- Do not leave repo-managed skill changes uncommitted or unpushed unless the user explicitly says not to ship.
