---
skill: investigate
agent: claude
captured_at: 2026-06-13T15:01:51
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Fix: `/sync` doctor recommends an unresolvable `scripts/pack.sh refresh`

## Context

A `/sync` run (inside a **Nix-flake project**, not the agentic-skills checkout) reported
stale skill installs and recommended the fix `scripts/pack.sh refresh`. Running it failed:

```
! scripts/pack.sh refresh
  → /bin/bash: line 1: scripts/pack.sh: No such file or directory
```

The user flagged the routing as "stale or wrong."

**Root cause (validated, not the user's exact theory):** the `refresh` subcommand is
real and valid (`scripts/pack.sh:1133`, `:851`). The defect is the **path the fix is
printed as**. There are two doctor implementations that disagree:

- **Bash doctor** — `scripts/pack.sh:926` (the `doctor()` function) hardcodes
  `echo "Fix: scripts/pack.sh refresh"`, a bare **repo-root-relative** path.
- **Node doctor** — `packages/skillpacks/build/src/cli/lifecycle.mjs:857` already prints the
  correct context-aware hint: `Fix: npx skillpacks refresh (or scripts/pack.sh refresh from a source checkout)`.

The `sync` skill (`.claude/skills/sync/SKILL.md:54-56,92`) calls the **bash** doctor,
locating `pack.sh` inside the **npx skillpacks package**
(`~/.npm/_npx/<hash>/node_modules/skillpacks`, no `.git`). It then surfaces the bash
doctor's relative path verbatim. From the user's actual cwd (a different project) that path
resolves to nothing — exactly the failure observed. The bash doctor and the `sync` skill
are the wrong/stale side; the Node CLI already gets it right.

**Immediate workaround for the user (no code change):** from the Nix-flake project root run
`npx skillpacks refresh` — installs there are managed by the npx package, and `refresh`
operates on `process.cwd()`.

**Intended outcome:** the bash doctor and the `sync` skill emit a refresh command that
resolves from any project directory, matching the Node doctor's already-correct phrasing.

## Approach (Full fix)

Fix the one true source of the bad string, harden the skill that repeats it, then propagate
to the generated copies and version the skill.

### 1. Fix the bash doctor's Fix string — `scripts/pack.sh`

- Line **926**: replace
  `echo "Fix: scripts/pack.sh refresh"`
  with the context-aware dual hint that already exists in the Node doctor:
  `echo "Fix: npx skillpacks refresh (or scripts/pack.sh refresh from a source checkout)"`
  (keep verbatim parity with `lifecycle.mjs:857`).
- Line **914** (`unknown` hint): for consistency, change
  `run refresh to enable drift tracking` →
  `run \`npx skillpacks refresh\` (or scripts/pack.sh refresh) to enable drift tracking`.
- `scripts/pack.sh` is a script, **not** a skill — no version bump applies to it.

### 2. Stop the `sync` skill hardcoding the relative path — sync `SKILL.md`

Canonical pack source is `packs/gitops/{claude,codex}/sync/SKILL.md` (the `.claude/skills/`
and `.codex/skills/` copies are byte-identical dogfood installs; the
`packages/skillpacks/build/packs/gitops/...` copy is build output).

Edit the **canonical** `packs/gitops/claude/sync/SKILL.md` and
`packs/gitops/codex/sync/SKILL.md`:

- **Line 55**: instead of "with the fix command `scripts/pack.sh refresh`", instruct the
  skill to **surface the refresh command the doctor itself reported** (now the dual hint),
  and to prefer `npx skillpacks refresh` when the resolved managing source is the published
  npx skillpacks package (no `.git`), or `scripts/pack.sh refresh` run from the resolved
  **source checkout root** otherwise. The `unknown`-skills sentence gets the same treatment.
- **Line 56**: change "Direct the user to `scripts/pack.sh refresh`" → direct the user to the
  doctor-reported refresh command (`npx skillpacks refresh` for npx-package-managed installs,
  or `scripts/pack.sh refresh` from the source checkout).
- **Line 92** (Report status): change "the `scripts/pack.sh refresh` fix command" → "the
  doctor-reported refresh command (`npx skillpacks refresh`, or `scripts/pack.sh refresh`
  from a source checkout)".

### 3. Version + archive the sync skill (CLAUDE.md skill-versioning rule)

This is a behavioral update, so bump per CLAUDE.md:

- Run `scripts/skill-archive.sh` for each canonical sync dir to snapshot the current
  `v0.4` SKILL.md into `archive/v0.4/SKILL.md`, then bump frontmatter `version: v0.4 → v0.5`.
- Add a `v0.5` entry to each sync `CHANGELOG.md` describing the fix-routing change.
- Apply the bump across all four synchronized copies (`packs/gitops/{claude,codex}` +
  `.claude/skills/sync` + `.codex/skills/sync`).

### 4. Propagate to generated/bundled copies

- Regenerate the published package copy (this is the copy the user's npx run executed):
  `cd packages/skillpacks && npm run build` — `build-package.mjs` re-copies root
  `scripts/pack.sh` to `build/scripts/pack.sh` and rebuilds `build/packs/gitops/...`.
- Re-sync the in-repo installed skill copies (`.claude/skills/sync`, `.codex/skills/sync`)
  to match the canonical pack source (these are plain copies, not symlinks).
- **Verify** `base/claude/pack/scripts/pack.sh` and `base/codex/pack/scripts/pack.sh`:
  these are a separate, older bundle that currently lacks the doctor `Fix:` string. Confirm
  with grep whether they ship the `doctor()` function; only patch them if they do (do not
  introduce drift into an unrelated bundle).

### 5. Capture prompt history (CLAUDE.md)

Write the visible `/investigate` invocation to
`prompts/investigate/skill-prompt-<ts>-pack-refresh-routing.md` with the required
frontmatter (`skill`, `agent: claude`, `captured_at`, `source: user-invocation`,
`prompt_scope: visible-user-invocation`).

## Files to modify

- `scripts/pack.sh` — lines 926 (and 914) — canonical bash doctor Fix string
- `packs/gitops/claude/sync/SKILL.md`, `packs/gitops/codex/sync/SKILL.md` — sync routing +
  version bump (canonical)
- `.claude/skills/sync/SKILL.md`, `.codex/skills/sync/SKILL.md` — synchronized copies
- `packs/gitops/{claude,codex}/sync/CHANGELOG.md` (+ `.claude`/`.codex` copies) — v0.5 entry
- `packs/gitops/{claude,codex}/sync/archive/v0.4/SKILL.md` — archived snapshot
- Regenerated by build: `packages/skillpacks/build/scripts/pack.sh`,
  `packages/skillpacks/build/packs/gitops/...`

## Verification

1. **Unit (string parity):**
   `diff <(grep -n 'Fix:.*refresh' scripts/pack.sh) ...` and confirm
   `grep -n "npx skillpacks refresh" scripts/pack.sh packages/skillpacks/build/src/cli/lifecycle.mjs`
   both show the same dual-hint wording.
2. **Behavioral (bash doctor):** from a fixture project with a stale managed install, run
   `bash scripts/pack.sh doctor`; confirm it now prints
   `Fix: npx skillpacks refresh (or scripts/pack.sh refresh from a source checkout)` and still
   exits non-zero on stale.
3. **CLI parity:** `node packages/skillpacks/build/bin/skillpacks.mjs doctor` and the rebuilt
   `build/scripts/pack.sh` doctor agree on the Fix line.
4. **Mirror parity:** `bash scripts/skill-mirror-parity-audit.sh` (exit 0) — sync copies agree.
5. **Versioning:** confirm `version: v0.5` in all four sync SKILL.md copies and a matching
   `archive/v0.4/SKILL.md` + CHANGELOG entry exist.
6. **End-to-end sanity:** re-read the new `sync/SKILL.md` step 5 and confirm a `/sync` run in a
   non-checkout project would now recommend `npx skillpacks refresh`.

## Ship

Per the shared shipping contract + Direct-To-Primary git flow: commit and push to `master`
(includes regenerated build copies and prompt-history file). No GitHub Actions.
