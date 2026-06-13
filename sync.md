# Post-Sync Actions

## Custom

Refresh the project-local base skill installs to update managed skill roots (picks up new, renamed, or removed skills).

```sh
npx skillpacks refresh
```

## Notifications

- `base/` — new or changed base skills may need the project-local skill roots refreshed via `npx skillpacks refresh`
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
