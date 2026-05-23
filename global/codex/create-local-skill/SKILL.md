---
name: create-local-skill
description: Scaffold a new user-local skill in ~/.codex/skills (and optionally ~/.claude/skills), then offer to promote it to a personal fork of agentic-skills
type: execution
version: v0.0
---

# Create Local Skill

Invoke as `$create-local-skill`.

Scaffold a new **user-local** skill directly into `~/.codex/skills/<name>/` (and optionally `~/.claude/skills/<name>/`) as a real directory. The upstream agentic-skills repo is not touched. At the end, offer to **promote** the skill by copying it into the user's personal fork.

`install.sh --uninstall` only removes symlinks whose target is inside the agentic-skills repo, so user-authored real directories are safe from upstream sync.

## Workflow

1. Parse `<skill-name>` and optional description from arguments. If missing, ask for:
   - Skill name (kebab-case)
   - One-line description
   - Type (default `execution`)
   - Whether to also create a Claude version in `~/.claude/skills/<name>/`

2. Validate `$HOME/.codex/skills/<name>`:
   - If it is a symlink into `agentic-skills/global/` or `agentic-skills/packs/`, refuse — it would shadow a repo-managed skill.
   - If it is a real dir or user-owned symlink, confirm before overwriting.

3. Write `~/.codex/skills/<name>/SKILL.md`:

   ```markdown
   ---
   name: <name>
   description: <description>
   type: <type>
   version: v0.0
   ---

   # <Title>

   Invoke as `$<name>`.

   <1-2 sentence purpose statement.>

   ## Workflow

   1. <step>
   2. <step>
   3. <step>

   ## Output

   <what the skill produces>
   ```

4. Optionally mirror to `~/.claude/skills/<name>/SKILL.md` (Claude frontmatter convention — no `Invoke as` line; add `argument-hint` if relevant).

5. Report created paths. Remind the user that Codex / Claude Code may need a fresh session to see the new skill.

6. Ask: "Would you like to promote this skill to your personal fork of agentic-skills?"

   If yes:
   - Ask for the path to their fork. If they don't have one, explain: fork on GitHub and clone, or `git remote set-url origin <their-repo>` to repoint an existing clone.
   - Verify with `git -C <path> rev-parse --show-toplevel`.
   - Copy the skill into `<fork>/global/codex/<name>/` (and `<fork>/global/claude/<name>/` if applicable), or into a `<fork>/personal/...` subtree if the user prefers to segregate personal skills.
   - If the skill is promoted into a fork's `global/` or `packs/` tree, also update that fork's `tests/harness/bench-coverage.ts` and add either a deterministic custom setup under `tests/layer4/setups/` or an explicit blocked row with `blocked_reason` and `next_command`.
   - For promoted custom setups, include a deterministic quality rubric when practical, or record why quality scoring is blocked/deferred instead of adding a subjective rubric.
   - Recommend `pnpm --dir tests bench:coverage` before the promoted skill is committed.
   - Run `git status` in the fork and suggest a commit message. Do not commit or push — leave that to the user.

7. Safety note: pushing to the upstream agentic-skills repo requires write access. Plain clones without access are rejected at the remote; forks push to the user's own repo. This skill cannot route a user's experimental skill into the shared upstream.

## Notes

- Never write into this repo's `global/` or `packs/` directories. Target paths are always under `$HOME/.codex/skills`, `$HOME/.claude/skills`, or an explicitly-supplied personal fork path.
- Do not create extra docs beyond `SKILL.md` unless asked.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/create-local-skill-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/create-local-skill-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

