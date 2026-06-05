# Quickstart

Get from clone to a working skill in under 5 minutes.

## Prerequisites

- **bash** shell (macOS, Linux, or WSL on Windows)
- **jq** for pack installation: `brew install jq` (macOS) or `apt install jq` (Debian/Ubuntu)
- **Claude Code** or **OpenAI Codex** installed on your machine
- **pnpm** (optional, for running tests): `npm install -g pnpm`

## 1. Clone and Initialize

```bash
git clone <this-repo-url> ~/agentic-skills
cd ~/agentic-skills
./init.sh
```

`init.sh` symlinks the global core skills into `~/.claude/skills/` and `~/.codex/skills/`. Domain packs are not installed globally — that is intentional context hygiene.

## 2. Install a Pack in Your Project

Navigate to any project repository and install the pack that matches your domain:

```bash
cd ~/my-project
~/agentic-skills/scripts/pack.sh install devtool    # for developer tools
~/agentic-skills/scripts/pack.sh install game        # for games
~/agentic-skills/scripts/pack.sh install business-discovery  # for SaaS/business apps
```

This creates `.agents/project.json` and project-local skill roots in `.claude/skills/` and `.codex/skills/`.

## 3. Reload Skills in Your CLI

Skills are not hot-reloaded. After installing:

- **Claude Code:** run `/reload-skills`, then `/clear` or restart the session. If `.claude/skills/` did not exist when the session started, restart Claude Code entirely.
- **Codex:** start a fresh Codex CLI session.

## 4. Verify the Installation

```bash
~/agentic-skills/scripts/pack.sh status
```

Or from within Claude Code: run `/pack` with no arguments. From Codex: run `$pack`.

## 5. Run Your First Skill

The AFPS (Alignment First, Prototype Second) workflow is the default product workflow. A typical first cycle:

**Claude Code:**
```
/codebase-status          # see what you're working with
/idea-scope-brief         # shape a rough idea into a scoped brief
```

**Codex:**
```
$codebase-status
$idea-scope-brief
```

For projects with an existing `tasks/todo.md`:
```
/exec                     # execute the next planned step
```

## 6. Confirm It Worked

After running a skill, look for these artifacts:

- `tasks/todo.md` — updated task list
- `tasks/history.md` — shipped work log entry
- A git commit with the skill's output
- An alignment page in `alignment/` (for research skills)

## What's Next

- Run `/skills` or `$skills` to browse all available skills
- See [pack-workflow-matrix.md](pack-workflow-matrix.md) for workflow ordering and dependencies
- See [skill-anatomy.md](skill-anatomy.md) to understand or create skills
- See [troubleshooting.md](troubleshooting.md) if something goes wrong
