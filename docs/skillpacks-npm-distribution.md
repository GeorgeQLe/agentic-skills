# Skillpacks npm Distribution Design

## Approval Summary

Source alignment page: `alignment/idea-scope-brief-npm-distribution.html` (historical strategy context). Current package usage reference: `alignment/gskp-npm-package-walkthrough.html`.

Approved decisions:

- Primary path: hybrid, starting with COA A and evolving toward COA B/C only when demand justifies it.
- Public npm/CLI name: `gskp`.
- Version granularity: skill-level versioning remains authoritative for user pinning.
- Deck installation: COA B/C-shaped metadata first. Decks should be represented as curated package lists and registry tags; the initial COA A monolith may materialize those selections locally, but deck behavior should not be hard-coded as monolith-only presets.
- Artifact route: write the detailed design doc in `docs/` first, then use it as the implementation roadmap.

Current npm check on 2026-06-12:

- `npm view gsp --json` returned an existing external package at version `0.5.4`, so `gsp` should not be used.
- `npm view gsk --json` returned an existing external package at version `0.0.2`, so `gsk` should not be used.
- `npm view skp --json` returned an existing external package at version `1.0.0`, so `skp` should not be used.
- `npm view gskp --json` returned `E404`, so the unscoped package name appears unclaimed or inaccessible to this machine.
- `npm view agentic-skills --json` returned an existing external package at version `2.5.1`, so `agentic-skills` should not be used as this repo's public npm package name.
- `npm view skillpack --json` returned an existing unrelated package at version `0.1.3`, so the old `skillpacks` spelling is too typo-adjacent for the primary route.

Publication status before the `gskp` rename:

- `skillpacks@0.1.0` and `skillpacks@0.1.1` were published publicly on npm before the short-name change.
- The package now publishes as `gskp`, while retaining `skillpacks` as a compatibility binary in the package.
- The next public verification target is `npx @glexcorp/gskp@latest list`, temp-project `install code-quality`, temp-project `install quality-sweep`, temp-project `install-deck game-afps`, and the git-checkout `scripts/pack.sh list` path.

## Product Shape

`gskp` becomes the public installer and CLI for this repository's markdown skill library. The first npm release should not restructure the repository into many packages. It should package the current repository content needed to install skills and expose a Node entry point that can drive the existing install model.

The initial user experience should be:

```bash
npx @glexcorp/gskp init
npx @glexcorp/gskp install business-discovery
npx @glexcorp/gskp install-deck vard
npx @glexcorp/gskp status
npx @glexcorp/gskp doctor
npx @glexcorp/gskp refresh
```

`npx @glexcorp/gskp init` installs the base skill surface into the current repository as local skill roots and records `base_skills: true` in `.agents/project.json`. This makes `npx @glexcorp/gskp refresh` update base skills from the current package snapshot instead of depending on user-home global installs.

When a user explicitly wants user-home global core skills from the npm package snapshot, the compatibility path is:

```bash
npx @glexcorp/gskp init --global
# Backward-compatible spelling:
npx @glexcorp/gskp init-global
```

Both global init forms invoke the packaged `init.sh` and keep the global surface limited to core skills. Domain packs remain project-local only.

Source-checkout users can keep using:

```bash
./init.sh
scripts/pack.sh install business-discovery
scripts/pack.sh refresh
```

The npm path is now the standard agent-facing install route. The source-checkout commands remain supported for local repository development and compatibility.

## Design Principles

1. Preserve `SKILL.md` as the source format.
2. Preserve `global/{claude,codex}` and `packs/<pack>/{claude,codex}` as the authoring layout.
3. Preserve `.agents/project.json` as the project designation file.
4. Preserve `scripts/pack.sh` while the npm CLI reaches parity.
5. Keep the first npm release as one package.
6. Add a generated manifest early so later COA B/C migration does not require inventing metadata twice.
7. Model decks as package-list and registry-tag metadata from the start, even while the first package ships as a monolith.
8. Avoid GitHub Actions; publishing remains an explicit local or agent-run command unless separately requested.

## Package Architecture

### Package

The publishable npm package is named `gskp` and lives under `packages/skillpacks/`. The repository root stays private workspace metadata for the monorepo.

Current package `package.json` shape:

```json
{
  "name": "@glexcorp/gskp",
  "version": "0.1.0",
  "description": "CLI and packaged markdown skill library for Claude Code and OpenAI Codex.",
  "type": "module",
  "bin": {
    "gskp": "bin/skillpacks.mjs",
    "skillpacks": "bin/skillpacks.mjs"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GeorgeQLe/agentic-skills.git",
    "directory": "packages/skillpacks"
  },
  "bugs": {
    "url": "https://github.com/GeorgeQLe/agentic-skills/issues"
  },
  "homepage": "https://github.com/GeorgeQLe/agentic-skills#readme",
  "files": [
    "bin/",
    "src/",
    "dist/",
    "global/",
    "packs/",
    "scripts/pack.sh",
    "scripts/skill-links.sh",
    "docs/decks.md",
    "docs/packs.md",
    "docs/QUICKSTART.md",
    "docs/skillpacks-npm-distribution.md",
    "README.md",
    "LICENSE",
    "AGENTS.md",
    "CLAUDE.md",
    "init.sh"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=18"
  }
}
```

The root `package.json` is private and declares workspaces for `apps/skills-showcase` and `packages/skillpacks`. The public package uses the repository root MIT license and npm metadata links back to `https://github.com/GeorgeQLe/agentic-skills`. The first release can keep runtime dependencies at zero. If argument parsing grows, add one small dependency later instead of pulling in a framework immediately.

The `skillpacks` binary is retained as an in-package compatibility alias. It should no longer be the primary docs route because `skillpack` singular is an unrelated npm package that can catch common typos.

### CLI Entry Point

`packages/skillpacks/bin/skillpacks.mjs` resolves the installed package root with `import.meta.url`, then dispatches commands into either:

- a thin wrapper around included repository scripts, for immediate parity; or
- native Node modules under `src/cli/`, after the port is ready.

Phase 1 should wrap existing scripts because `scripts/pack.sh` already owns install, remove, refresh, doctor, pin, unpin, status, and project-lock behavior.

The wrapper must run `scripts/pack.sh` with the user's current working directory as the target project root. That preserves the current behavior where `.agents/project.json`, `.claude/skills`, and `.codex/skills` are written to the consumer project, not to the package install directory. Source-checkout execution may fall back to the repository root; staged package execution should use files inside the package root.

### Included Repository Content

The npm tarball must include:

- `global/**` active core skills and their local archives.
- `packs/**` active pack skills and their local archives.
- `scripts/pack.sh` and script helpers it sources, especially `scripts/skill-links.sh`.
- `init.sh` or an equivalent `init-global` implementation.
- deck and pack docs used for help output.

The package build script at `packages/skillpacks/scripts/build-package.mjs` stages these files into `packages/skillpacks/build/` before `npm pack`. The staging step must not generate or mutate Skills Showcase assets.

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

Phase 3 compatibility decision: keep `scripts/pack.sh` as the canonical git-checkout compatibility wrapper and as the packaged shell fallback for commands that are not yet worth porting. Do not turn `pack.sh` into a thin wrapper over the Node CLI in this phase; that would make the old checkout path depend on the npm package internals before all discovery and init surfaces are ported. Revisit the decision only after `recommend`, `which`, `install-deck`, and global init behavior are either Node-owned or intentionally documented as permanent shell surfaces.

<!-- gskp-compatibility-matrix:start -->
| Command | Owner | Backend | Requires bash | Requires jq | Notes |
| --- | --- | --- | --- | --- | --- |
| `help / --help / --version` | Node-owned | `packages/skillpacks/src/cli/run-pack-script.mjs` | No | No | CLI help and version output from package metadata. |
| `list --json` | Node-owned | Packaged manifest reader | No | No | Prints `dist/skillpacks-manifest.json`. |
| `list-packs` | Node-owned | Project config reader | No | No | Reads `.agents/project.json` directly. |
| `status` | Node-owned | Project config/status reader | No | No | Reports project designation and local roots. |
| `set-mode <mode>` | Node-owned | Project config writer | No | No | Preserves unrelated fields and uses the Node lock helper. |
| `set-update-mode <mode>` | Node-owned | Project config writer | No | No | Preserves sibling `skill_updates` fields. |
| `init` | Node-owned | Manifest plus lifecycle helpers | No | No | Installs global-scope manifest entries as project-local base skills and records `base_skills: true`. |
| `init --global [args...]` | External script-backed | Packaged `init.sh` | Yes | Optional | Installs user-home global core skills from the package snapshot; strips `--global` and forwards remaining args to `init.sh`. |
| `install <name...>` | Node-owned | Manifest plus lifecycle helpers | No | No | Handles active packs, active skills, aliases, hibernated diagnostics, markers, hashes, and project config writes. |
| `remove <name...>` | Node-owned | Manifest plus lifecycle helpers | No | No | Handles active pack removal, individual skill removal, and hibernated stale cleanup. |
| `refresh` | Node-owned | Manifest plus lifecycle helpers | No | No | Recreates enabled base skills, packs, and individual skill roots from `.agents/project.json`. |
| `doctor` | Node-owned | Managed marker drift reader | No | No | Read-only drift report; exits non-zero for stale installs. |
| `doctor --fix` | Node-owned | Manifest plus lifecycle helpers | No | No | Cleans generated skill roots only: removes orphaned managed installs, converts unpinned legacy symlinks to managed package copies, preserves pinned symlinks, and preserves unmanaged local directories. |
| `doctor --fix --agent-docs [--dry-run]` | Node-owned | Marker-bounded agent-doc migrator | No | No | Replaces only recognized generated blocks in `AGENTS.md` and `CLAUDE.md`; dry-run prints a diff without writing, and non-dry-run writes timestamped backups under `.agents/backups/`. |
| `alignment bundles [--dry-run] [--check]` | Node-owned wrapper | Packaged `scripts/upgrade-alignment-page.mjs` | No | No | Runs generated per-skill `ALIGNMENT-PAGE.md` bundle generation/checking with `--root <cwd>`. |
| `alignment pages audit` | Node-owned wrapper | Packaged `scripts/audit-alignment-pages.mjs` | No | No | Audits active rendered `alignment/*.html` pages with `--root <cwd>`. |
| `alignment pages inject-tts [--force] [alignment/<page>.html]` | Node-owned wrapper | Packaged `scripts/inject-tts.mjs` plus TTS asset | No | No | Ensures `scripts/alignment-tts-kokoro.js` exists in the target repo before injecting the TTS include. |
| `alignment verify` | Node-owned wrapper | Target repo Vitest suite | No | No | Runs this repo's focused alignment Vitest set when the target repo contains those tests; exits clearly when unavailable. |
| `prune [--dry-run]` | Node-owned | Manifest plus lifecycle helpers | No | No | Removes only orphaned managed installs; keeps unmanaged directories. |
| `pin <skill> <version>` | Node-owned | Manifest plus lifecycle helpers | No | No | Validates archive versions, updates `pinned_versions`, and relinks installs. |
| `unpin <skill>` | Node-owned | Manifest plus lifecycle helpers | No | No | Clears the pin and relinks to latest packaged source. |
| `list` | Shell-backed | Packaged `scripts/pack.sh list` | Yes | No | Lists available active packs from the packaged repo content. |
| `recommend` | Shell-backed | Packaged `scripts/pack.sh recommend` | Yes | No | Uses existing repository-signal heuristics. |
| `which <skill>` | Shell-backed | Packaged `scripts/pack.sh which` | Yes | Optional | `jq` improves individually enabled skill status; pack-level status has a grep/sed fallback. |
| `install-deck <deck> [--full]` | Hybrid shell materialization | Node manifest resolver, then packaged `scripts/pack.sh install` | Yes | Yes | Deck metadata is Node-resolved, but installation still uses the compatibility install path. |
| `init-global [args...]` | External script-backed | Packaged `init.sh` | Yes | Optional | Backward-compatible alias for `init --global`; `jq` preserves an existing global pin file when `--pin` updates it. |
<!-- gskp-compatibility-matrix:end -->

The CLI should print the same reload notice as `pack.sh` after install, remove, refresh, pin, and unpin.

## Deck Installation

The approved deck answer points to COA B and COA C. That means decks should be modeled as installable package-list and registry-tag metadata, not as an implementation detail of the first monolith package.

Phase 1 can still run from the monolith package. The distinction is that `gskp install-deck <deck>` reads deck metadata from the manifest and then materializes that selection using the currently available backend. In the first release, that backend is the local monolith plus `scripts/pack.sh install`. Later, the same deck metadata can drive scoped package installs or registry tag resolution.

Supported deck metadata:

| Deck | CLI command | Package-list meaning | Registry tags |
| --- | --- | --- | --- |
| VARD | `gskp install-deck vard` | `vard` | `deck:vard` |
| ORD | `gskp install-deck ord` | `ord` | `deck:ord` |
| Business AFPS | `gskp install-deck business-afps` | `business-discovery` by default | `deck:business-afps`, `stage:discovery` |
| Business AFPS full | `gskp install-deck business-afps --full` | `business-discovery`, `customer-lifecycle`, `business-growth`, `business-ops` | `deck:business-afps`, `lane:full` |
| Devtool AFPS | `gskp install-deck devtool-afps` | `devtool` | `deck:devtool-afps` |
| Game AFPS | `gskp install-deck game-afps` | `game` | `deck:game-afps` |

Business AFPS defaults to the first deliberate pack because current docs recommend progressive installation. The `--full` flag can exist for users who intentionally want the whole deliberate lane.

Implementation rule:

- Do not hard-code deck pack lists only inside the CLI command handler.
- Generate deck metadata into `packages/skillpacks/dist/skillpacks-manifest.json`.
- Make `install-deck` a resolver over that manifest.
- In COA A, the resolver forwards selected packs to `scripts/pack.sh install`.
- In COA B, the resolver can install or recommend scoped package lists such as `@gskp/vard`.
- In COA C, the resolver can query skills by registry tags such as `deck:vard`.

The CLI command stays `gskp install-deck <deck>` so users do not need to know whether a deck is backed by a monolith, scoped package list, or registry query.

## Manifest Design

Even though phase 1 starts as a monolith, it should generate a manifest before publish. The manifest gives the CLI and future package split one stable metadata source.

Proposed file:

```text
packages/skillpacks/dist/skillpacks-manifest.json
```

Proposed shape:

```json
{
  "schema_version": 1,
  "generated_at": "2026-06-08T00:00:00Z",
  "package": {
    "name": "@glexcorp/gskp",
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
    },
    {
      "name": "game-afps",
      "label": "Game AFPS",
      "tempo": "deliberate",
      "domain": "game",
      "default_packs": ["game"],
      "full_packs": ["game"]
    }
  ]
}
```

The manifest should be generated from repository files, not hand-maintained. Start with a package-owned script such as `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.

Manifest consumers:

- `gskp list --json`
- `gskp search <query>` in a later phase
- package tarball validation
- migration to `@gskp/*` package metadata
- possible hosted registry later

## Versioning And Pinning

There are two version layers:

1. npm package semver, such as `@glexcorp/gskp@0.1.0`.
2. skill frontmatter versions, such as `version: v0.4`.

The approved granularity is skill-level, so skill frontmatter remains the user-facing pinning level. npm package semver is the transport snapshot.

User examples:

```bash
npx @glexcorp/gskp@0.1.0 install business-discovery
npx @glexcorp/gskp pin devtool-adoption v0.0
npx @glexcorp/gskp doctor
```

Important consequences:

- `@glexcorp/gskp@0.1.0` determines which skill archive snapshots are available locally.
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

After the Phase 3 port, `scripts/pack.sh` remains a supported compatibility wrapper instead of becoming a thin wrapper over the Node CLI. This preserves the long-lived git-checkout path while the npm package owns deterministic project-local lifecycle behavior.

## Phase 4 Release-Readiness Notes

Phase 4 prepares the package for a dry-run release only. It does not publish `gskp`, create npm tags, change package access, or replace the source-checkout setup path.

### User Setup Paths

Source-checkout users continue to install from a local clone:

```bash
git clone <this-repo-url> ~/agentic-skills
cd ~/my-project
~/agentic-skills/scripts/pack.sh install devtool
~/agentic-skills/scripts/pack.sh status
```

With the published npm package, npm users can install from the target project directory:

```bash
cd ~/my-project
npx @glexcorp/gskp install devtool
npx @glexcorp/gskp install code-quality
npx @glexcorp/gskp install-deck game-afps
npx @glexcorp/gskp status
```

Both paths write the same project-local contract: `.agents/project.json`, `.claude/skills/*`, and `.codex/skills/*`. The CLI session reload requirements are unchanged: Claude Code needs `/reload-skills`, `/clear`, or a restart depending on when the local roots appeared; Codex needs a fresh session if the `$` skill list remains stale.

### Migration From Checkout To npm

An existing project can move from a local checkout workflow to the npm package by keeping `.agents/project.json` committed and running:

```bash
npx @glexcorp/gskp refresh
npx @glexcorp/gskp doctor
```

`refresh` recreates generated local skill roots from the package snapshot and the existing project designation. `doctor` then reports whether managed installs are current, stale, missing, unknown, or pinned.

Do not commit generated `.claude/skills/*` or `.codex/skills/*` roots during migration; they remain rebuildable consumer-project artifacts.

### Version And Pinning Troubleshooting

`@glexcorp/gskp@<semver>` is the transport snapshot. It determines which active skill files and `archive/<version>/SKILL.md` snapshots are present in the installed package.

Skill pins still use skill frontmatter versions:

```bash
npx @glexcorp/gskp pin quality-sweep v0.0
npx @glexcorp/gskp unpin quality-sweep
```

If a pin fails because an archive version is unavailable, the installed npm package does not contain that archived skill snapshot. Upgrade to a package version that includes the archive, or use a source checkout at a commit that contains it.

Node-owned npm commands (`install`, `remove`, `refresh`, `doctor`, `prune`, `pin`, `unpin`, `status`, `list-packs`, `set-mode`, and `set-update-mode`) do not require `jq`. In the current `@glexcorp/gskp@0.1.0` release, `install-deck` still materializes through the packaged shell backend and therefore requires both `bash` and `jq`.

### Alignment Convention Commands

Source-checkout users can keep using the direct script paths:

```bash
node scripts/upgrade-alignment-page.mjs --check
node scripts/audit-alignment-pages.mjs
node scripts/inject-tts.mjs --force alignment/example.html
```

npm users can run the equivalent wrapped commands from the target repository:

```bash
npx @glexcorp/gskp alignment bundles --check
npx @glexcorp/gskp alignment pages audit
npx @glexcorp/gskp alignment pages inject-tts --force alignment/example.html
npx @glexcorp/gskp alignment verify
```

The namespace keeps the two alignment workflows separate. `alignment bundles` generates or checks the bundled per-skill convention files (`ALIGNMENT-PAGE.md`) from `docs/alignment-page-convention.md`; `alignment pages audit` checks already-rendered active `alignment/*.html` pages. `alignment pages inject-tts` copies the packaged `scripts/alignment-tts-kokoro.js` asset into the target repo when needed before adding the script tag. `alignment verify` is mainly for this source checkout and exits with a clear message when a consumer repo does not include the focused alignment Vitest files.

## Implementation Roadmap

### Phase 0 - Reservation And Preflight

Goal: prove the public name and package boundary before code changes.

Tasks:

- Confirm npm account access for publishing `gskp`.
- Reserve or create the `@gskp` npm organization if future scoped packages are desired.
- Decide whether the first release should be private dry-run only or public `0.1.0`.
- Confirm MIT license metadata and npm repository/bugs/homepage links.
- Confirm `jq` remains a documented dependency for write commands in phase 1.
- Run `npm pack packages/skillpacks/build --dry-run --json --silent` once package staging exists and verify the tarball excludes active-task artifacts.

Exit criteria:

- `gskp` publish rights are confirmed.
- Package name collision risk is closed.
- Tarball content policy is documented and testable.

### Phase 1 - Monolith Package And Thin CLI

Goal: publishable monolith package that delegates to current scripts.

Tasks:

- Add `packages/skillpacks/package.json` for `gskp`.
- Add `packages/skillpacks/bin/skillpacks.mjs`.
- Add `packages/skillpacks/src/cli/run-pack-script.mjs` or equivalent script dispatcher.
- Implement command forwarding for existing `pack.sh` commands.
- Implement `init-global` by invoking included `init.sh` or a small Node equivalent.
- Preserve cwd as the consumer project root for all project-local writes.
- Add dependency checks for `bash` and `jq` with actionable messages.
- Add package staging and `npm pack packages/skillpacks/build --dry-run --json --silent` verification.

Exit criteria:

- `node packages/skillpacks/bin/skillpacks.mjs list` works from this repo.
- A tarball from `packages/skillpacks/build` can install `code-quality` in a temp consumer repo.
- `node packages/skillpacks/bin/skillpacks.mjs refresh`, `status`, `doctor`, `pin`, and `unpin` match `scripts/pack.sh` behavior.
- Existing `scripts/pack.sh` behavior is unchanged.

### Phase 2 - Deck Metadata And Manifest

Goal: make the approved COA B/C deck behavior real while the initial package still ships as a COA A monolith.

Tasks:

- Add a generated `packages/skillpacks/dist/skillpacks-manifest.json` inside the package staging boundary.
- Add `packages/skillpacks/scripts/build-skillpacks-manifest.mjs` or extend package build to emit the manifest.
- Add deck metadata for `vard`, `ord`, `business-afps`, `devtool-afps`, and `game-afps`.
- Include package-list fields for COA B and registry-tag fields for COA C.
- Implement `gskp install-deck <deck>` as a manifest resolver.
- Implement `gskp install-deck business-afps --full` from manifest metadata.
- Add `gskp list --json` using the manifest.
- Add validation that every deck references existing packs.
- Add validation that deck package-list and registry-tag fields are present.
- Add validation that every manifest skill path exists and has `version:`.

Exit criteria:

- `node packages/skillpacks/bin/skillpacks.mjs install-deck vard` installs the `vard` pack in a temp repo.
- `node packages/skillpacks/bin/skillpacks.mjs install-deck business-afps` installs only `business-discovery`.
- `node packages/skillpacks/bin/skillpacks.mjs install-deck business-afps --full` installs the full deliberate lane.
- `node packages/skillpacks/bin/skillpacks.mjs install-deck game-afps` installs the `game` pack.
- `packages/skillpacks/dist/skillpacks-manifest.json` exposes deck package-list and registry-tag metadata.
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

- Update `README.md` with `npx @glexcorp/gskp` usage.
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
- Run package tests, tarball validation, and package metadata checks.
- Run `npm publish --access public`.
- Verify `npx @glexcorp/gskp@latest list` against the published package.
- Install into a fresh temp repo and verify one pack, one individual skill, and one deck.
- Commit and push release docs and any package version changes.

Exit criteria:

- `gskp` is installable from npm.
- A fresh project can install packs without cloning this repository.
- Current git-checkout install path remains functional.

### Phase 6 - COA B/C Readiness

Goal: prepare evolution without doing the package split prematurely.

Tasks:

- Track install usage and maintenance pain from the monolith package.
- Identify "hot packs" that deserve scoped packages.
- Use manifest data to generate `@gskp/<pack>` package metadata experimentally.
- Use deck package-list metadata to generate scoped package recommendations.
- Use registry-style deck tags to support per-skill and category resolution.
- Consider `@gskp/sdk` only after the manifest is stable and used by the CLI.

Exit criteria:

- A scoped-package proof can be generated from the manifest without changing `SKILL.md` sources.
- CLI commands remain stable across backend changes.

## Verification Plan

Static checks:

```bash
git diff --check
node packages/skillpacks/scripts/build-package.mjs --check
npm pack packages/skillpacks/build --dry-run --json --silent
```

Existing repository checks:

```bash
scripts/skill-versions.sh --missing
scripts/skill-deps.sh --broken
scripts/skill-pack-routing-audit.sh
apps/skills-showcase/scripts/validate-skills-showcase-data.sh
pnpm --dir tests bench:coverage
```

CLI temp-repo checks:

```bash
TMPDIR=$(mktemp -d)
cd "$TMPDIR"
node /path/to/agentic-skills/packages/skillpacks/bin/skillpacks.mjs install code-quality
node /path/to/agentic-skills/packages/skillpacks/bin/skillpacks.mjs status
node /path/to/agentic-skills/packages/skillpacks/bin/skillpacks.mjs doctor
node /path/to/agentic-skills/packages/skillpacks/bin/skillpacks.mjs install-deck vard
node /path/to/agentic-skills/packages/skillpacks/bin/skillpacks.mjs pin quality-sweep v0.0
```

Published-package checks:

```bash
npx @glexcorp/gskp@latest list
npx @glexcorp/gskp@latest install-deck ord
npx @glexcorp/gskp@latest doctor
```

## Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `gskp` package or scope cannot be claimed | Blocks approved public name | Resolve in phase 0 before implementation. |
| npm package accidentally includes task/history/prompt artifacts | Bloated or sensitive package | Use `files` whitelist plus `npm pack --dry-run` validation. |
| `pack.sh` assumes a git checkout | npm install breaks | Run it from the packaged script path and add temp-repo tests. |
| `jq` is missing | Shell-backed write paths fail | Node-owned `gskp` project commands no longer require `jq`; keep `jq` documented for git-checkout `scripts/pack.sh` write commands and `gskp install-deck` materialization. |
| Skill-level pinning needs archives omitted from tarball | Pins break | Include skill-local `archive/**` while excluding global docs history. |
| Existing git-checkout users regress | Adoption risk | Keep `init.sh` and `pack.sh` unchanged until Node parity is proven. |
| CLI name conflicts with installed external `agentic-skills` package | User confusion | Use `gskp` as the only npm package and bin name. |

## Open Questions

These should be answered before first publish, not before starting phase 1:

- Is `gskp` the final npm package owner identity, or should the public package be `@gskp/cli` after an organization is created?
- Should `install-deck` remain a hybrid shell materialization path for the first public package, or should deck installation move fully to Node before publish?
- Should `init-global` install only global core skills, or should it also offer an optional deck picker?
- Should hibernated packs be excluded from the npm tarball entirely or included only to preserve explicit error messages?
- Should package releases use `0.x` until several real consumer installs pass?

## Recommended Next Step

Start with Phase 0 and Phase 1 in one implementation pass:

1. Confirm publish rights for `gskp`.
2. Add workspace package metadata and a thin CLI wrapper under `packages/skillpacks`.
3. Prove one temp-repo install from the wrapper.
4. Add deck metadata and the manifest resolver only after the wrapper is stable.

This keeps the first implementation small while preserving the approved route toward COA B/C deck semantics, skill-level pinning, and later package/registry evolution.
