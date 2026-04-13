# Post-Sync Actions

## Custom

Re-run the installer to update skill symlinks (picks up new, renamed, or removed skills).

```sh
bash install.sh
```

## Notifications

- `global/` — new or changed global skills may need symlink updates
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
- `install.sh` — installer script was modified
