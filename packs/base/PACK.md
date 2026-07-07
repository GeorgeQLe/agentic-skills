---
name: Base
description: Domain-neutral skills installed by `skillpacks init` and tracked through `.agents/project.json` `base_skills`.
---

# Base

Base skills live under `packs/base/{claude,codex}` so their source layout matches other skill packs, but they keep base-skill semantics:

- manifest skills use `scope: "base"` and `pack: null`;
- `skillpacks init` installs all base skills and records `base_skills: true`;
- exact base-skill installs record `enabled_skills[skill] = "base"`;
- `packs/base` is not enabled through `enabled_packs`.

## Skills

- `create-briefing-slides`: Create slide-first HTML briefing decks for alignment/interrogation review material while keeping dense artifacts as linked references.
- `workflow-backfill`: Scan and approval-gate safe canary artifact backfill after a skillpacks canary refresh.
