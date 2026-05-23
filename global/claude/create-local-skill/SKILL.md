---
name: create-local-skill
description: Scaffold a new user-local skill in ~/.claude/skills (and optionally ~/.codex/skills), then offer to promote it to a personal fork of agentic-skills
type: execution
version: v0.0
argument-hint: <skill-name> [description]
---

# Create Local Skill

Scaffold a new **user-local** skill directly into `~/.claude/skills/<name>/` (and optionally `~/.codex/skills/<name>/`) so the user can experiment without touching the upstream agentic-skills repo. At the end, offer to **promote** the skill by copying it into their personal fork of agentic-skills.

This skill writes **real directories**, not symlinks back to the shared repo. `install.sh --uninstall` only removes symlinks whose target lives inside agentic-skills (see `install.sh` `remove_repo_link`), so user-authored skills are untouched by upstream sync.

## Process

1. **Parse `$ARGUMENTS`** for `<skill-name>` and optional description. If missing, ask the user for:
   - Skill name (kebab-case, e.g. `my-skill`)
   - One-line description (used in the frontmatter `description` field — it is how the assistant decides when to invoke the skill, so be specific)
   - Type (`execution`, `analysis`, `workflow`, etc. — default `execution`)
   - Whether to also create a Codex version in `~/.codex/skills/<name>/` (default yes)

2. **Validate the target path:**
   - Target is `$HOME/.claude/skills/<name>`.
   - If the path already exists:
     - If it is a **symlink** pointing into an agentic-skills repo (`readlink` contains `agentic-skills/global/` or `agentic-skills/packs/`), refuse — this would shadow a repo-managed skill. Tell the user to choose a different name.
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

5. **Report the result:** show the created paths and remind the user they may need to start a fresh Claude Code / Codex session for the new skill to appear in the skills list.

6. **Offer to promote.** Ask:

   > "Would you like to promote this skill to your personal fork of agentic-skills? (y/n)"

   If yes:
   - Ask for the path to their personal fork (e.g. `~/projects/tools/agentic-skills-personal`). If they don't have one, explain the options:
     - Fork `agentic-skills` on GitHub and `git clone` it.
     - Clone this repo and `git remote set-url origin <their-repo-url>` to repoint pushes.
   - Verify the path exists and is a git repo (`git -C <path> rev-parse --show-toplevel`).
   - Copy the scaffolded skill into:
     - `<fork>/global/claude/<name>/` (and `<fork>/global/codex/<name>/` if a Codex version was created), **or**
     - `<fork>/personal/claude/<name>/` if the user wants to keep personal skills segregated from upstream-syncable dirs. Ask which.
   - If the skill is promoted into a fork's `global/` or `packs/` tree, also update that fork's `tests/harness/bench-coverage.ts` and add either a deterministic custom setup under `tests/layer4/setups/` or an explicit blocked row with `blocked_reason` and `next_command`.
   - For promoted custom setups, include a deterministic quality rubric when practical, or record why quality scoring is blocked/deferred instead of adding a subjective rubric.
   - Recommend `pnpm --dir tests bench:coverage` before the promoted skill is committed.
   - Show the `git status` in the fork and suggest a commit message like `feat(skill): add <name>`. Do **not** commit or push automatically — leave that to the user.

7. **Safety note to surface:** pushing to the upstream agentic-skills repo requires write access. A plain clone without write access will be rejected at the remote; a fork pushes to the user's own repo. There is no path by which this skill can push a user's experimental skill to the shared upstream.

## Notes

- Never write into this repo's `global/` or `packs/` directories from this skill. Target paths are always under `$HOME/.claude/skills`, `$HOME/.codex/skills`, or an explicitly-supplied personal fork path.
- Do not create documentation files beyond `SKILL.md` unless the user asks.
- If the user wants version control for their personal skills without a full fork, suggest `git init` inside a sibling directory and symlinking from `~/.claude/skills/<name>` — but default to the simpler "real directory in `~/.claude/skills`" flow.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/create-local-skill-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/create-local-skill-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

