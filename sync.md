# Post-Sync Actions

## Custom

Refresh the project-local base skill installs to update managed skill roots (picks up new, renamed, or removed skills).

Inside this monorepo, invoke the workspace bin directly. Bare `npx skillpacks refresh` resolves the local workspace member `packages/skillpacks` and defaults to its first-declared bin (`gskp`), which is not linked onto PATH here, so it fails with `sh: gskp: command not found` (exit 127). The direct node invocation runs the same CLI from local source with no PATH/link dependency. (In consumer projects where `skillpacks` is an installed dependency, `npx skillpacks refresh` works as written.)

```sh
node packages/skillpacks/bin/skillpacks.mjs refresh
```

## Notifications

- `base/` — new or changed base skills may need the project-local skill roots refreshed via `npx skillpacks refresh`
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
