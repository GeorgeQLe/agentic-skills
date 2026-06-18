# Post-Sync Actions

## Custom

Refresh the project-local base skill installs to update managed skill roots (picks up new, renamed, or removed skills).

Inside this monorepo, invoke the workspace bin directly. Bare `npx skillpacks refresh` resolves the local workspace member `packages/skillpacks` and defaults to its first-declared bin (`gskp`), which is not linked onto PATH here, so it fails with `sh: gskp: command not found` (exit 127). The direct node invocation runs the same CLI from local source with no PATH/link dependency. (In consumer projects where `skillpacks` is an installed dependency, `npx skillpacks refresh` works as written.)

```sh
node packages/skillpacks/bin/skillpacks.mjs refresh
```

Install repo-maintainer commands from `dev/skills/` into the local agent skill roots. These
are sourced outside `base/` and `packs/` so they are not published to npm consumers, but
every clone of this repo should have them available locally. The skill roots (`.claude/skills`,
`.codex/skills`) are gitignored, so a fresh clone needs this copy step to get the commands.
Idempotent; runs after the refresh above so it is not clobbered.

```sh
for skill in dev/skills/*/; do
  name="$(basename "$skill")"
  [ -f "$skill/SKILL.md" ] || continue
  for root in .claude/skills .codex/skills; do
    mkdir -p "$root/$name"
    cp "$skill/SKILL.md" "$root/$name/SKILL.md"
  done
  echo "installed dev skill: $name"
done
```

## Notifications

- `base/` — new or changed base skills may need the project-local skill roots refreshed via `npx skillpacks refresh`
- `packs/` — project-local packs may need `scripts/pack.sh refresh` inside affected projects
- `dev/skills/` — repo-maintainer commands (e.g. `publish-steps`); the Custom section above reinstalls them into the local agent skill roots on every sync
