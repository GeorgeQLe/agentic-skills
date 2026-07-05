# Post-Sync Actions

## Custom

Refresh the project-local base skill installs to update managed skill roots (picks up new, renamed, or removed skills).

Inside this monorepo, invoke the workspace bin directly. Bare `npx skillpacks refresh` resolves the local workspace member `packages/skillpacks` and defaults to its first-declared bin (`gskp`), which is not linked onto PATH here, so it fails with `sh: gskp: command not found` (exit 127). The direct node invocation runs the same CLI from local source with no PATH/link dependency. (In consumer projects where `skillpacks` is an installed dependency, `npx skillpacks refresh` works as written.)

```sh
node packages/skillpacks/bin/skillpacks.mjs refresh
```

Make `publish-skills` and `publish-canary` runnable as `! publish-skills` / `! publish-canary` inside the Claude Code CLI. The CLI's
`!` runs a shell that does **not** source the user's shell startup files (`~/.zshrc`/`~/.zshenv`),
so a shell alias or function is never seen — the only thing it resolves is an executable on the
inherited `PATH`. So install small wrappers (each `exec`s this clone's script by absolute path
— a symlink would break the scripts' own path-resolution) into `~/.local/bin`, which is the
conventional user bin on `PATH`. Idempotent (rewritten each sync). If `~/.local/bin` is not on
`PATH`, it warns so the user can add it.

```sh
BIN_DIR="$HOME/.local/bin"
for entry in \
  "publish-skills|scripts/publish-steps.sh|release steps" \
  "publish-canary|scripts/publish-canary-steps.sh|canary release steps"
do
  COMMAND_NAME="${entry%%|*}"
  rest="${entry#*|}"
  SCRIPT="$(pwd)/${rest%%|*}"
  DESCRIPTION="${rest#*|}"
  BIN="$BIN_DIR/$COMMAND_NAME"
  if [ -f "$SCRIPT" ]; then
    mkdir -p "$BIN_DIR"
    printf '#!/usr/bin/env bash\n# agentic-skills: %s -> %s (managed by sync.md)\nexec "%s" "$@"\n' "$COMMAND_NAME" "$DESCRIPTION" "$SCRIPT" > "$BIN"
    chmod +x "$BIN"
    echo "installed $COMMAND_NAME -> $SCRIPT at $BIN"
  else
    echo "skipped $COMMAND_NAME install: $SCRIPT not found"
  fi
done
case ":$PATH:" in
  *":$BIN_DIR:"*) : ;;
  *) echo "WARNING: $BIN_DIR is not on PATH — add it (e.g. in ~/.zshenv) so '! publish-skills' and '! publish-canary' resolve" ;;
esac
```

## Notifications

- `base/` — new or changed base skills may need the project-local skill roots refreshed via `npx skillpacks refresh`
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
