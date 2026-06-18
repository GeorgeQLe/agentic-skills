# Post-Sync Actions

## Custom

Refresh the project-local base skill installs to update managed skill roots (picks up new, renamed, or removed skills).

Inside this monorepo, invoke the workspace bin directly. Bare `npx skillpacks refresh` resolves the local workspace member `packages/skillpacks` and defaults to its first-declared bin (`gskp`), which is not linked onto PATH here, so it fails with `sh: gskp: command not found` (exit 127). The direct node invocation runs the same CLI from local source with no PATH/link dependency. (In consumer projects where `skillpacks` is an installed dependency, `npx skillpacks refresh` works as written.)

```sh
node packages/skillpacks/bin/skillpacks.mjs refresh
```

Make `publish-skills` runnable as `! publish-skills` inside the Claude Code CLI. The CLI's
`!` runs a shell that does **not** source the user's shell startup files (`~/.zshrc`/`~/.zshenv`),
so a shell alias or function is never seen — the only thing it resolves is an executable on the
inherited `PATH`. So install a small wrapper named `publish-skills` (it `exec`s this clone's
`scripts/publish-steps.sh` by absolute path — a symlink would break the script's own
path-resolution) into `~/.local/bin`, which is the conventional user bin on `PATH`. Idempotent
(rewritten each sync). If `~/.local/bin` is not on `PATH`, it warns so the user can add it.

```sh
SCRIPT="$(pwd)/scripts/publish-steps.sh"
BIN_DIR="$HOME/.local/bin"
BIN="$BIN_DIR/publish-skills"
if [ -f "$SCRIPT" ]; then
  mkdir -p "$BIN_DIR"
  printf '#!/usr/bin/env bash\n# agentic-skills: publish-skills -> release steps (managed by sync.md)\nexec "%s" "$@"\n' "$SCRIPT" > "$BIN"
  chmod +x "$BIN"
  echo "installed publish-skills -> $SCRIPT at $BIN"
  case ":$PATH:" in
    *":$BIN_DIR:"*) : ;;
    *) echo "WARNING: $BIN_DIR is not on PATH — add it (e.g. in ~/.zshenv) so '! publish-skills' resolves" ;;
  esac
else
  echo "skipped publish-skills install: $SCRIPT not found"
fi
```

## Notifications

- `base/` — new or changed base skills may need the project-local skill roots refreshed via `npx skillpacks refresh`
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
