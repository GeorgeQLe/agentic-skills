# Post-Sync Actions

## Custom

Re-run the initializer to update managed skill installs (picks up new, renamed, or removed skills).

```sh
bash init.sh
```

## Notifications

- `global/` — new or changed global skills may need initialized skill roots updated
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
- `init.sh` — initializer script was modified
