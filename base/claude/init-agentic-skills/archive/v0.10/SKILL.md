---
name: init-agentic-skills
description: Make the base agentic-skills available in a project by installing them project-local with npx skillpacks init, report and fix skill-install drift, clean up legacy user-home installs, and route domain packs to the pack skill. Use when Claude needs to enable base skills for a project, repair stale installs, confirm initialization status, remove old global installs, or explain how to enable packs.
type: ops
version: v0.10
argument-hint: "[init|status|doctor|refresh|uninstall-global]"
---

# Init Agentic Skills

Make the base agentic-skills available by installing them **project-local** into the current project's `.claude/skills` and `.codex/skills`. Installation is distributed through the npm `skillpacks` package — there is no user-home (global) install path. Active installs are repo-managed directories that expose the canonical `SKILL.md` and exclude `archive/`; pinned installs intentionally point at `archive/<version>`. Keep domain packs project-local too; use `/pack` from the target project or `npx skillpacks install <pack-or-skill>` when packs are needed.

## Process

1. Parse `$ARGUMENTS`:
   - No args, `init`, or `refresh`: run `npx skillpacks init` from the project root to install the base skills project-local (`.claude/skills` + `.codex/skills`) and enable `base_skills` in `.agents/project.json`. Use `npx skillpacks refresh` instead when the project is already initialized and you only need to recreate roots from `.agents/project.json`.
   - `status`: run `npx skillpacks status` to report the project designation, enabled packs, and installed skills.
   - `doctor`: run `npx skillpacks doctor` to report project skill-install drift (read-only). It compares installed `.claude/skills` and `.codex/skills` copies against their canonical sources via the `.agentic-skills-managed` marker's `source_sha`. Report `STALE` skills with the printed fix command, `unknown` skills as needing a refresh to enable tracking, `missing` skills whose source is gone, and `pinned` skills as frozen. Run `npx skillpacks doctor --fix` to clean generated skill-root drift.
   - `uninstall-global`: run `npx skillpacks uninstall-global` only after confirming the user wants legacy repo-managed base installs removed from `~/.claude/skills` and `~/.codex/skills`. This cleans up installs created by the retired user-home init path; it removes only skillpacks-owned installs and leaves unmanaged directories untouched.
   - `help`, `--help`, or `-h`: run `npx skillpacks --help`.
2. Report the command run, the project skill directories, installed counts, and any warnings about non-repo-managed collisions.
3. Explain pack access separately:
   - Do not install `packs/*` as base skills.
   - In the project that needs domain workflows, run `/pack` for guided setup, or `npx skillpacks install <pack-or-skill>` from the project shell for an explicit pack or individual pack skill.
   - If a project already has `.agents/project.json`, use `/pack refresh` (or `npx skillpacks refresh`) after this base initialization to recreate local pack skill roots.
4. If the active session still cannot see a newly installed or refreshed skill, report the skill-visibility reload path:
   - Claude Code: run `/reload-skills` first; `/clear` starts a new empty-context conversation and can pick up the refreshed registry; restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible.
   - Codex: start a fresh Codex CLI session if the `$` skill list remains stale.

## Constraints

- Drive installation through `npx skillpacks` (the npm `skillpacks` CLI); do not recreate install logic by hand or reintroduce a user-home/global install path.
- Base skills are project-local: they install into the current project's `.claude/skills` and `.codex/skills`, not into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files under `.claude/skills` or `.codex/skills` that are not repo-managed.
- Treat packs as project-local capabilities managed through `/pack` (`npx skillpacks` under the hood).
- Stop and report exact errors if `npx skillpacks` fails.
- Do not install `packs/*` as base skills in any mode.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
