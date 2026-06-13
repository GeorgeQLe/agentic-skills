---
skill: investigate
agent: claude
captured_at: 2026-06-13T18:08:44
source: user-invocation
prompt_scope: visible-user-invocation
---

npx skillpacks does not work in this directory

---

Follow-up to commit `5a4aca8e` (which had both doctors print a static dual hint
`Fix: npx skillpacks refresh (or scripts/pack.sh refresh from a source checkout)`).

The user followed that recommendation inside the agentic-skills source checkout and it
failed:

```
$ npx skillpacks <…>
sh: 1: gskp: not found        # exit 127
```

Root cause: run from inside the agentic-skills monorepo, npm resolves the local workspace
`skillpacks` package (root `package.json` declares `workspaces: ["packages/skillpacks", …]`).
That workspace package declares two bins (`gskp` + `skillpacks`); `npm exec` picks `gskp`,
which is not linked onto PATH because the workspace isn't `npm install`-ed (no
`node_modules/.bin`), so it spawns `sh -c 'gskp …'` → `gskp: not found`. Published 0.1.1 has
only the `skillpacks` bin, confirming this is a workspace-resolution quirk, not a package-code
bug.

Fix applied: both doctors (`scripts/pack.sh` and `packages/skillpacks/src/cli/lifecycle.mjs`)
now emit a context-appropriate refresh command — the absolute
`<checkout>/scripts/pack.sh refresh` when running from a real checkout (`.git` present, works
from any cwd, never invokes npx), or `npx skillpacks refresh` only when running from the
published npx bundle.

Known issue (out of scope): `npx skillpacks` mis-resolves to the unbuilt workspace bin
(`gskp: not found`) only when cwd is inside the agentic-skills monorepo. This affects
maintainer dogfooding, not end users (who are never inside this repo). The correct in-repo
invocation is `scripts/pack.sh` or `node packages/skillpacks/bin/skillpacks.mjs`. Fixing the
npm workspace bin resolution itself (dropping the `gskp` alias, or requiring a root
`npm install` to link bins) is a separate product decision and is not done here.
