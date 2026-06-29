---
name: create-local-skill
description: Scaffold a new user-local skill in ~/.claude/skills (and optionally ~/.codex/skills), then offer to promote it to a personal fork of agentic-skills
type: execution
version: v0.3
argument-hint: <skill-name> [description]
---

# Create Local Skill

Scaffold a new **user-local** skill directly into `~/.claude/skills/<name>/` (and optionally `~/.codex/skills/<name>/`) so the user can experiment without touching the upstream agentic-skills repo. At the end, offer to **promote** the skill by copying it into their personal fork of agentic-skills.

Write **real directories**, not managed roots back to the shared repo. `npx skillpacks uninstall-global` only removes skillpacks-owned skill installs whose source lives inside agentic-skills, so user-authored skills are untouched by upstream sync.

## Process

1. **Parse `$ARGUMENTS`** for `<skill-name>` and optional description. If missing, ask the user for:
   - Skill name (kebab-case, e.g. `my-skill`)
   - One-line description (used in the frontmatter `description` field — it is how the assistant decides when to invoke the skill, so be specific)
   - Type (`execution`, `analysis`, `workflow`, etc. — default `execution`)
   - Whether to also create a Codex version in `~/.codex/skills/<name>/` (default yes)

2. **Validate the target path:**
   - Target is `$HOME/.claude/skills/<name>`.
   - If the path already exists:
     - If it is a **symlink** pointing into an agentic-skills repo (`readlink` contains `agentic-skills/base/` or `agentic-skills/packs/`), refuse — this would shadow a repo-managed skill. Tell the user to choose a different name.
     - If it is a **real directory or a user-owned symlink**, ask before overwriting.

3. **Write the Claude SKILL.md** at `~/.claude/skills/<name>/SKILL.md`:

   ```markdown
   ---
   name: <name>
   description: <description>
   type: <type>
   version: v0.0
   ---

   # <Title>

   <1-2 sentence purpose statement.>

   ## When to use

   - <trigger 1>
   - <trigger 2>

   ## Process

   1. <step>
   2. <step>
   3. <step>

   ## Output

   <what the skill produces>
   ```

4. **Optionally mirror to Codex** at `~/.codex/skills/<name>/SKILL.md` with the Codex invocation convention (`Invoke as $<name>.`). Match the format of existing `~/.codex/skills/*/SKILL.md` files.

5. **Report the result:** show the created paths and remind the user of the runner-specific reload path. Claude Code should run `/reload-skills` first; `/clear` starts a new empty-context conversation and can pick up the refreshed registry; restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible. Codex should start a fresh Codex CLI session if the `$` skill list remains stale.

6. **Offer to promote.** Ask:

   > "Would you like to promote this skill to your personal fork of agentic-skills? (y/n)"

   If yes:
   - Ask for the path to their personal fork (e.g. `~/projects/tools/agentic-skills-personal`). If they don't have one, explain the options:
     - Fork `agentic-skills` on GitHub and `git clone` it.
     - Clone this repo and `git remote set-url origin <their-repo-url>` to repoint pushes.
   - Verify the path exists and is a git repo (`git -C <path> rev-parse --show-toplevel`).
   - Copy the scaffolded skill into:
     - `<fork>/base/claude/<name>/` (and `<fork>/base/codex/<name>/` if a Codex version was created), **or**
     - `<fork>/personal/claude/<name>/` if the user wants to keep personal skills segregated from upstream-syncable dirs. Ask which.
   - If the skill is promoted into a current `agentic-skills` fork's `base/` or `packs/` tree, refresh that fork's public skills catalog export by running node scripts/generate-skills-catalog-export.mjs and scripts/validate-skills-catalog-export.sh.
   - If the promoted skill needs benchmark coverage, update the separate `agentic-skills-benchmarks` fork/repo: import the fork's export, then add either a deterministic custom setup under `tests/layer4/setups/` or an explicit blocked row with `blocked_reason` and `next_command`.
   - For promoted custom setups, include a deterministic quality rubric when practical, or record why quality scoring is blocked/deferred instead of adding a subjective rubric.
   - Recommend `pnpm catalog:check` and `pnpm bench:coverage` from the benchmark repo before benchmark coverage changes are committed.
   - Show the `git status` in the fork and suggest a commit message like `feat(skill): add <name>`. Do **not** commit or push automatically — leave that to the user.

7. **Safety note to surface:** pushing to the upstream agentic-skills repo requires write access. A plain clone without write access will be rejected at the remote; a fork pushes to the user's own repo. There is no path by which this skill can push a user's experimental skill to the shared upstream.

## Notes

- Never write into this repo's `base/` or `packs/` directories from this skill. Target paths are always under `$HOME/.claude/skills`, `$HOME/.codex/skills`, or an explicitly-supplied personal fork path.
- Do not create documentation files beyond `SKILL.md` unless the user asks.
- If the user wants version control for their personal skills without a full fork, suggest `git init` inside a sibling directory and symlinking from `~/.claude/skills/<name>` — but default to the simpler "real directory in `~/.claude/skills`" flow.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
