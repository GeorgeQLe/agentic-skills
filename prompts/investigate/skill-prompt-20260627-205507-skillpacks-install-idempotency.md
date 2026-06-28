---
skill: investigate
agent: codex
captured_at: 2026-06-27 20:55:07 America/New_York
source: user-invocation
prompt_scope: visible-user-invocation
---

when a user attempts to run an npx skillpacks install for a skill that is already installed it should say skill already installed! and make no changes. Right now, this is what appears and it's not clear what is going on? It just looks like command non-compliance: You ran npx skillpacks install fork-idea-branch
  └
    Skill installs changed. Claude Code and Codex may keep the skill list loaded when the current session started.
    Claude Code: use /reload-skills to rescan skills. /clear starts a new empty-context conversation and can also pick up the refreshed registry. Restart Claude Code if .claude/skills did not
    exist when the session started or the skill is still invisible.
    Codex: start a fresh Codex CLI session if the $ skill list does not show newly installed or removed project-local skills.
    skillpacks 0.1.13 (latest)
