# Quickstart

Get from clone to a working skill in under 5 minutes.

## Prerequisites

- **Node.js 18+** for the `gskp` npm CLI and package build
- **bash** shell (macOS, Linux, or WSL on Windows) for clone-based `./init.sh`, `scripts/pack.sh`, and remaining shell-backed `gskp` commands
- **jq** for git-checkout `scripts/pack.sh` write commands and `gskp install-deck` materialization: `brew install jq` (macOS) or `apt install jq` (Debian/Ubuntu). Node-owned `gskp install`, `remove`, `refresh`, `doctor`, `prune`, `pin`, `unpin`, `status`, `list-packs`, `set-mode`, and `set-update-mode` do not require `jq`
- **Claude Code** or **OpenAI Codex** installed on your machine
- **pnpm** (optional, for running tests): `npm install -g pnpm`

## 1. Choose an Install Path

### Source checkout

Use the source checkout when you are developing this repository or want global core skills installed directly from a local clone:

```bash
git clone <this-repo-url> ~/agentic-skills
cd ~/agentic-skills
./init.sh
```

`init.sh` installs repo-managed global core skill directories into `~/.claude/skills/` and `~/.codex/skills/`. Track-latest installs are managed copies with drift metadata; pinned archived skills are the symlink case. Domain packs are not installed globally — that is intentional context hygiene.

### npm CLI

With the published npm package, use `npx @glexcorp/gskp` from the project that should receive local skills:

```bash
cd ~/my-project
npx @glexcorp/gskp --version
npx @glexcorp/gskp init
npx @glexcorp/gskp list
```

The npm CLI does not install user-home global skills by default. `npx @glexcorp/gskp init` installs base skills into the current repository's local `.claude/skills/` and `.codex/skills/` roots and records `base_skills: true` in `.agents/project.json`. Later `npx @glexcorp/gskp refresh` updates those base skills from the package snapshot being run. If you explicitly want user-home global core skills from npm, run `npx @glexcorp/gskp init --global` (or the backward-compatible `npx @glexcorp/gskp init-global`). Domain packs are never installed globally.

## 2. Install a Pack in Your Project

Navigate to any project repository and install the pack that matches your domain:

```bash
cd ~/my-project
npx @glexcorp/gskp init
npx @glexcorp/gskp install devtool    # for developer tools
npx @glexcorp/gskp install game        # for games
npx @glexcorp/gskp install business-discovery  # for SaaS/business apps
```

From a source checkout, the equivalent compatibility route is:

```bash
~/agentic-skills/scripts/pack.sh install devtool
```

This creates `.agents/project.json` and project-local skill roots in `.claude/skills/` and `.codex/skills/`. `init` is the base-skill step; `install` is the domain-pack or individual-pack-skill step.

The npm CLI can also install a canonical deck from manifest metadata:

```bash
npx @glexcorp/gskp install-deck business-afps
npx @glexcorp/gskp install-deck devtool-afps
npx @glexcorp/gskp install-deck game-afps
```

## 3. Reload Skills in Your CLI

Skills are not hot-reloaded. After installing:

- **Claude Code:** run `/reload-skills`, then `/clear` or restart the session. If `.claude/skills/` did not exist when the session started, restart Claude Code entirely.
- **Codex:** start a fresh Codex CLI session.

## 4. Verify the Installation

Source checkout:

```bash
~/agentic-skills/scripts/pack.sh status
```

npm:

```bash
npx @glexcorp/gskp status
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

Alignment maintenance from npm is available through:

```bash
npx @glexcorp/gskp alignment bundles --check
npx @glexcorp/gskp alignment pages audit
npx @glexcorp/gskp alignment pages inject-tts --force alignment/example.html
```

From a source checkout, the direct script paths remain canonical: `node scripts/upgrade-alignment-page.mjs`, `node scripts/audit-alignment-pages.mjs`, and `node scripts/inject-tts.mjs`.

## Migration Notes

Moving from a source checkout to npm does not change the project-local files. From the target project directory, run the npm command that matches your existing pack designation:

```bash
npx @glexcorp/gskp refresh
npx @glexcorp/gskp doctor
```

`@glexcorp/gskp@<semver>` selects the package snapshot. Skill pins remain skill-level pins, for example `npx @glexcorp/gskp pin quality-sweep v0.0`. If a pinned archive version is not present in the installed npm package, upgrade the npm package or use a source checkout that contains that archive.

## What's Next

- Run `/skills` or `$skills` to browse all available skills
- See [pack-workflow-matrix.md](pack-workflow-matrix.md) for workflow ordering and dependencies
- See [skill-anatomy.md](skill-anatomy.md) to understand or create skills
- See [troubleshooting.md](troubleshooting.md) if something goes wrong
