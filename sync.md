# Post-Sync Actions

## Custom

Refresh the project-local base skill installs to update managed skill roots (picks up new, renamed, or removed skills).

Inside this monorepo, invoke the workspace bin directly. Bare `npx skillpacks refresh` resolves the local workspace member `packages/skillpacks` and defaults to its first-declared bin (`gskp`), which is not linked onto PATH here, so it fails with `sh: gskp: command not found` (exit 127). The direct node invocation runs the same CLI from local source with no PATH/link dependency. (In consumer projects where `skillpacks` is an installed dependency, `npx skillpacks refresh` works as written.)

```sh
node packages/skillpacks/bin/skillpacks.mjs refresh
```

Alias `publish-skills` to this clone's release-steps script so it is runnable as
`! publish-skills` inside the Claude Code CLI. The alias lives in the user's `~/.zshrc`
(each `!` command runs in a shell initialized from that profile) and points at the absolute
path of `scripts/publish-steps.sh` in this checkout. Idempotent — the tagged line is rewritten,
not duplicated. Takes effect for new `!` commands / shells; reload with `source ~/.zshrc` to use
it immediately. (zsh-only; skip or adapt if the device uses a different shell.)

```sh
SCRIPT="$(pwd)/scripts/publish-steps.sh"
RC="$HOME/.zshrc"
TAG="# agentic-skills: publish-skills alias"
if [ -f "$SCRIPT" ]; then
  touch "$RC"
  tmp="$(mktemp)"
  grep -v -F "$TAG" "$RC" > "$tmp" || true
  printf 'alias publish-skills="%s" %s\n' "$SCRIPT" "$TAG" >> "$tmp"
  mv "$tmp" "$RC"
  echo "aliased publish-skills -> $SCRIPT in $RC (source ~/.zshrc or open a new shell to use it)"
else
  echo "skipped publish-skills alias: $SCRIPT not found"
fi
```

## Notifications

- `base/` — new or changed base skills may need the project-local skill roots refreshed via `npx skillpacks refresh`
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
