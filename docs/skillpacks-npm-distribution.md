# Skillpacks npm Distribution Design

## Approval Summary

Source alignment page: `alignment/idea-scope-brief-npm-distribution.html`

Approved decisions:

- Primary path: hybrid, starting with COA A and evolving toward COA B/C only when demand justifies it.
- Public npm/CLI name: `skillpacks`.
- Version granularity: skill-level versioning remains authoritative for user pinning.
- Deck installation: monolith presets first, with a migration path to package lists or registry tags.
- Artifact route: write the detailed design doc in `docs/` first, then use it as the implementation roadmap.

Current npm check on 2026-06-08:

- `npm view skillpacks --json` returned `E404`, so the unscoped package name appears unclaimed or inaccessible to this machine.
- `npm view @skillpacks/cli --json` and `npm view @skillpacks/core --json` returned `E404`; that does not prove npm organization availability, but no packages under those names are visible.
- `npm view agentic-skills --json` returned an existing external package at version `2.5.1`, so `agentic-skills` should not be used as this repo's public npm package name.

## Product Shape

`skillpacks` becomes the public installer and CLI for this repository's markdown skill library. The first npm release should not restructure the repository into many packages. It should package the current repository content needed to install skills and expose a Node entry point that can drive the existing install model.

The initial user experience should be:

```bash
npx skillpacks install business-discovery
npx skillpacks install-deck vard
npx skillpacks status
npx skillpacks doctor
npx skillpacks refresh
```

Existing users keep using:

```bash
./init.sh
scripts/pack.sh install business-discovery
scripts/pack.sh refresh
```

The npm path is additive until it proves stable.

## Design Principles

1. Preserve `SKILL.md` as the source format.
2. Preserve `global/{claude,codex}` and `packs/<pack>/{claude,codex}` as the authoring layout.
3. Preserve `.agents/project.json` as the project designation file.
4. Preserve `scripts/pack.sh` while the npm CLI reaches parity.
5. Keep the first npm release as one package.
6. Add a generated manifest early so later COA B/C migration does not require inventing metadata twice.
7. Avoid GitHub Actions; publishing remains an explicit local or agent-run command unless separately requested.

## Package Architecture

### Package

The root npm package should be named `skillpacks`.

Proposed root `package.json` shape:

```json
{
  "name": "skillpacks",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "skillpacks": "bin/skillpacks.mjs"
  },
  "files": [
    "bin/",
    "src/",
    "global/",
    "packs/",
    "scripts/",
    "docs/decks.md",
    "docs/packs.md",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=18"
  }
}
```

The first release can keep runtime dependencies at zero. If argument parsing grows, add one small dependency later instead of pulling in a framework immediately.

### CLI Entry Point

`bin/skillpacks.mjs` should resolve the installed package root with `import.meta.url`, then dispatch commands into either:

- a thin wrapper around included repository scripts, for immediate parity; or
- native Node modules under `src/cli/`, after the port is ready.

Phase 1 should wrap existing scripts because `scripts/pack.sh` already owns install, remove, refresh, doctor, pin, unpin, status, and project-lock behavior.

The wrapper must run `scripts/pack.sh` with the user's current working directory as the target project root. That preserves the current behavior where `.agents/project.json`, `.claude/skills`, and `.codex/skills` are written to the consumer project, not to the package install directory.

### Included Repository Content

The npm tarball must include:

- `global/**` active core skills and their local archives.
- `packs/**` active pack skills and their local archives.
- `scripts/pack.sh` and script helpers it sources, especially `scripts/skill-links.sh`.
- `init.sh` or an equivalent `init-global` implementation.
- deck and pack docs used for help output.

The tarball should exclude:

- `alignment/**`
- `prompts/**`
- `tasks/**`
- `docs/history/**`
- `apps/**`
- `tests/**`
- generated local roots under `.claude/skills` and `.codex/skills`
- unrelated benchmark output and session artifacts

Skill-level archives inside `global/**/archive/` and `packs/**/archive/` must remain included because pinning depends on them.

## CLI Surface

Initial command map:

| npm CLI | Current source of truth | Notes |
| --- | --- | --- |
| `skillpacks list` | `scripts/pack.sh list` | Lists available packs. |
| `skillpacks recommend` | `scripts/pack.sh recommend` | Uses current repository signals. |
| `skillpacks install <name...>` | `scripts/pack.sh install <name...>` | Accepts pack names and individual skill names. |
| `skillpacks remove <name...>` | `scripts/pack.sh remove <name...>` | Preserves current lock and project file behavior. |
| `skillpacks refresh` | `scripts/pack.sh refresh` | Recreates local roots from `.agents/project.json`. |
| `skillpacks status` | `scripts/pack.sh status` | Shows project designation and local installs. |
| `skillpacks doctor` | `scripts/pack.sh doctor` | Read-only drift report. |
| `skillpacks pin <skill> <version>` | `scripts/pack.sh pin <skill> <version>` | Keeps current skill-level pin semantics. |
| `skillpacks unpin <skill>` | `scripts/pack.sh unpin <skill>` | Returns skill to latest source in the installed package. |
| `skillpacks which <skill>` | `scripts/pack.sh which <skill>` | Finds provider pack and install status. |
| `skillpacks set-update-mode <mode>` | `scripts/pack.sh set-update-mode <mode>` | Keeps `warn`, `auto`, and `unset`. |
| `skillpacks set-mode <mode>` | `scripts/pack.sh set-mode <mode>` | Keeps agent mode designation. |
| `skillpacks init-global` | `init.sh` or Node equivalent | Installs global core skills to user-level roots. |
| `skillpacks install-deck <deck>` | new resolver over `scripts/pack.sh install` | Installs deck presets. |

The CLI should print the same reload notice as `pack.sh` after install, remove, refresh, pin, and unpin.

## Deck Installation

Decks are not a new runtime primitive in phase 1. They are named presets that resolve to current pack installs.

Supported deck names:

| Deck | Phase 1 command | Underlying install |
| --- | --- | --- |
| VARD | `skillpacks install-deck vard` | `skillpacks install vard` |
| ORD | `skillpacks install-deck ord` | `skillpacks install ord` |
| Business AFPS | `skillpacks install-deck business-afps` | `skillpacks install business-discovery` |
| Business AFPS full | `skillpacks install-deck business-afps --full` | `skillpacks install business-discovery customer-lifecycle business-growth business-ops` |
| Devtool AFPS | `skillpacks install-deck devtool-afps` | `skillpacks install devtool` |

Business AFPS defaults to the first deliberate pack because current docs recommend progressive installation. The `--full` flag can exist for users who intentionally want the whole deliberate lane.

Future migration path:

- COA B can turn rapid decks into packages such as `@skillpacks/vard` and `@skillpacks/ord`, while deliberate decks remain curated package lists.
- COA C can map decks to manifest tags such as `deck:vard`, `deck:ord`, `deck:business-afps`, and `deck:devtool-afps`.
- The CLI command stays `skillpacks install-deck <deck>` so users do not need to know whether a deck is backed by a monolith, scoped package list, or registry query.

## Manifest Design

Even though phase 1 starts as a monolith, it should generate a manifest before publish. The manifest gives the CLI and future package split one stable metadata source.

Proposed file:

```text
dist/skillpacks-manifest.json
```

Proposed shape:

```json
{
  "schema_version": 1,
  "generated_at": "2026-06-08T00:00:00Z",
  "package": {
    "name": "skillpacks",
    "version": "0.1.0"
  },
  "packs": [
    {
      "name": "business-discovery",
      "path": "packs/business-discovery",
      "status": "active",
      "tools": ["claude", "codex"],
      "skills": ["customer-discovery", "competitive-analysis"]
    }
  ],
  "skills": [
    {
      "name": "customer-discovery",
      "pack": "business-discovery",
      "tool": "codex",
      "version": "v1.0",
      "path": "packs/business-discovery/codex/customer-discovery/SKILL.md",
      "content_sha": "<sha256>",
      "archive_versions": ["v0.11"],
      "decks": ["business-afps"]
    }
  ],
  "decks": [
    {
      "name": "business-afps",
      "label": "Business AFPS",
      "tempo": "deliberate",
      "domain": "business",
      "default_packs": ["business-discovery"],
      "full_packs": ["business-discovery", "customer-lifecycle", "business-growth", "business-ops"]
    }
  ]
}
```

The manifest should be generated from repository files, not hand-maintained. Start with a script such as `scripts/build-skillpacks-manifest.mjs`.

Manifest consumers:

- `skillpacks list --json`
- `skillpacks search <query>` in a later phase
- package tarball validation
- migration to `@skillpacks/*` package metadata
- possible hosted registry later

## Versioning And Pinning

There are two version layers:

1. npm package semver, such as `skillpacks@0.1.0`.
2. skill frontmatter versions, such as `version: v0.4`.

The approved granularity is skill-level, so skill frontmatter remains the user-facing pinning level. npm package semver is the transport snapshot.

User examples:

```bash
npx skillpacks@0.1.0 install business-discovery
npx skillpacks pin devtool-adoption v0.0
npx skillpacks doctor
```

Important consequences:

- `skillpacks@0.1.0` determines which skill archive snapshots are available locally.
- `pinned_versions` in `.agents/project.json` continues to select `archive/<version>/SKILL.md` inside the installed package.
- A user who needs a skill archive not present in their installed npm package must upgrade the npm package or use the git checkout model.
- Package releases should be cut after one or more skill changes are complete and verified; they should not require every edited skill to share a new npm version internally.

## Backward Compatibility

Phase 1 must not change these contracts:

- `./init.sh` remains valid for local checkout users.
- `scripts/pack.sh` remains valid for local checkout users.
- `.agents/project.json` keeps `project_type`, `enabled_packs`, `enabled_skills`, `pinned_versions`, `skill_updates`, `project_scopes`, `notes`, and `agent_mode`.
- Generated `.claude/skills` and `.codex/skills` roots remain uncommitted consumer-project artifacts.
- Installed skill roots continue to use `.agentic-skills-managed` markers.

After the Node CLI reaches parity, `scripts/pack.sh` can become a compatibility shim, but that is not necessary for the first npm release.

## Implementation Roadmap

### Phase 0 - Reservation And Preflight

Goal: prove the public name and package boundary before code changes.

Tasks:

- Confirm npm account access for publishing `skillpacks`.
- Reserve or create the `@skillpacks` npm organization if future scoped packages are desired.
- Decide whether the first release should be private dry-run only or public `0.1.0`.
- Confirm license metadata for npm.
- Confirm `jq` remains a documented dependency for write commands in phase 1.
- Run `npm pack --dry-run` once the package file exists and verify the tarball excludes active-task artifacts.

Exit criteria:

- `skillpacks` publish rights are confirmed.
- Package name collision risk is closed.
- Tarball content policy is documented and testable.

### Phase 1 - Monolith Package And Thin CLI

Goal: publishable monolith package that delegates to current scripts.

Tasks:

- Add root `package.json` for `skillpacks`.
- Add `bin/skillpacks.mjs`.
- Add `src/cli/run-pack-script.mjs` or equivalent script dispatcher.
- Implement command forwarding for existing `pack.sh` commands.
- Implement `init-global` by invoking included `init.sh` or a small Node equivalent.
- Preserve cwd as the consumer project root for all project-local writes.
- Add dependency checks for `bash` and `jq` with actionable messages.
- Add `npm pack --dry-run` verification.

Exit criteria:

- `node bin/skillpacks.mjs list` works from this repo.
- `node bin/skillpacks.mjs install code-quality` works in a temp consumer repo.
- `node bin/skillpacks.mjs refresh`, `status`, `doctor`, `pin`, and `unpin` match `scripts/pack.sh` behavior.
- Existing `scripts/pack.sh` behavior is unchanged.

### Phase 2 - Deck Presets And Manifest

Goal: make the approved deck behavior real while preparing the migration path.

Tasks:

- Add a generated `dist/skillpacks-manifest.json`.
- Add `scripts/build-skillpacks-manifest.mjs`.
- Add deck metadata for `vard`, `ord`, `business-afps`, and `devtool-afps`.
- Implement `skillpacks install-deck <deck>`.
- Implement `skillpacks install-deck business-afps --full`.
- Add `skillpacks list --json` using the manifest.
- Add validation that every deck references existing packs.
- Add validation that every manifest skill path exists and has `version:`.

Exit criteria:

- `node bin/skillpacks.mjs install-deck vard` installs the `vard` pack in a temp repo.
- `node bin/skillpacks.mjs install-deck business-afps` installs only `business-discovery`.
- `node bin/skillpacks.mjs install-deck business-afps --full` installs the full deliberate lane.
- Manifest validation passes from a clean checkout.

### Phase 3 - Node Port Parity

Goal: reduce the bash dependency by porting deterministic install logic to Node while keeping `pack.sh` as a wrapper or fallback.

Tasks:

- Port project-file reads and writes to Node with JSON parsing instead of shell/JQ.
- Port pack normalization and aliases.
- Port pack and individual skill install/remove logic.
- Port `.agentic-skills-managed` marker creation and content hashing.
- Port lock handling for `.agents/.pack.lock`.
- Port drift `doctor`, `pin`, `unpin`, and `prune`.
- Keep `scripts/pack.sh` available as a fallback until parity tests pass.

Exit criteria:

- Node CLI passes the same temp-repo install/remove/refresh/pin/doctor tests as `pack.sh`.
- `scripts/pack.sh` can either delegate to Node or remain as a tested compatibility path.
- No existing README or docs command becomes false.

### Phase 4 - Documentation And Dry Run Release

Goal: prepare users for npm install without changing the old setup path.

Tasks:

- Update `README.md` with `npx skillpacks` usage.
- Update `docs/QUICKSTART.md`, `docs/packs.md`, and `docs/decks.md`.
- Add a migration note for users moving from git checkout to npm.
- Add troubleshooting for npm package version vs skill-level pinning.
- Add tarball inspection output to a ship manifest.
- Run `npm publish --dry-run` locally.

Exit criteria:

- Docs show both npm and git-checkout installation paths.
- Dry-run publish succeeds.
- No GitHub Actions workflow is introduced.

### Phase 5 - First Publish

Goal: publish the first stable public package.

Tasks:

- Verify working tree is clean except intended release changes.
- Run package tests and tarball validation.
- Run `npm publish --access public`.
- Verify `npx skillpacks@latest list` against the published package.
- Install into a fresh temp repo and verify one pack, one individual skill, and one deck.
- Commit and push release docs and any package version changes.

Exit criteria:

- `skillpacks` is installable from npm.
- A fresh project can install packs without cloning this repository.
- Current git-checkout install path remains functional.

### Phase 6 - COA B/C Readiness

Goal: prepare evolution without doing the package split prematurely.

Tasks:

- Track install usage and maintenance pain from the monolith package.
- Identify "hot packs" that deserve scoped packages.
- Use manifest data to generate `@skillpacks/<pack>` package metadata experimentally.
- Add registry-style tags for decks and skill categories.
- Consider `@skillpacks/sdk` only after the manifest is stable and used by the CLI.

Exit criteria:

- A scoped-package proof can be generated from the manifest without changing `SKILL.md` sources.
- CLI commands remain stable across backend changes.

## Verification Plan

Static checks:

```bash
git diff --check
node scripts/build-skillpacks-manifest.mjs --check
npm pack --dry-run
```

Existing repository checks:

```bash
scripts/skill-versions.sh --missing
scripts/skill-deps.sh --broken
scripts/skill-pack-routing-audit.sh
scripts/validate-skills-showcase-data.sh
pnpm --dir tests bench:coverage
```

CLI temp-repo checks:

```bash
TMPDIR=$(mktemp -d)
cd "$TMPDIR"
node /path/to/agentic-skills/bin/skillpacks.mjs install code-quality
node /path/to/agentic-skills/bin/skillpacks.mjs status
node /path/to/agentic-skills/bin/skillpacks.mjs doctor
node /path/to/agentic-skills/bin/skillpacks.mjs install-deck vard
node /path/to/agentic-skills/bin/skillpacks.mjs pin quality-sweep v0.0
```

Published-package checks:

```bash
npx skillpacks@latest list
npx skillpacks@latest install-deck ord
npx skillpacks@latest doctor
```

## Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `skillpacks` package or scope cannot be claimed | Blocks approved public name | Resolve in phase 0 before implementation. |
| npm package accidentally includes task/history/prompt artifacts | Bloated or sensitive package | Use `files` whitelist plus `npm pack --dry-run` validation. |
| `pack.sh` assumes a git checkout | npm install breaks | Run it from the packaged script path and add temp-repo tests. |
| `jq` is missing | Write commands fail | Keep current fail-fast behavior and document dependency in phase 1; remove in phase 3 Node port. |
| Skill-level pinning needs archives omitted from tarball | Pins break | Include skill-local `archive/**` while excluding global docs history. |
| Existing git-checkout users regress | Adoption risk | Keep `init.sh` and `pack.sh` unchanged until Node parity is proven. |
| CLI name conflicts with installed external `agentic-skills` package | User confusion | Use `skillpacks` as the only npm package and bin name. |

## Open Questions

These should be answered before first publish, not before starting phase 1:

- Is `skillpacks` the final npm package owner identity, or should the public package be `@skillpacks/cli` after an organization is created?
- Should phase 1 require `jq`, or should the Node port of project-file writes happen before public publish?
- Should `init-global` install only global core skills, or should it also offer an optional deck picker?
- Should hibernated packs be excluded from the npm tarball entirely or included only to preserve explicit error messages?
- Should package releases use `0.x` until several real consumer installs pass?

## Recommended Next Step

Start with Phase 0 and Phase 1 in one implementation pass:

1. Confirm publish rights for `skillpacks`.
2. Add root package metadata and a thin CLI wrapper.
3. Prove one temp-repo install from the wrapper.
4. Add deck presets and manifest only after the wrapper is stable.

This keeps the first implementation small while preserving the approved route toward deck presets, skill-level pinning, and later package/registry evolution.
