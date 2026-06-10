# Skillpacks npm Distribution Design

## Approval Summary

Source alignment page: `alignment/idea-scope-brief-npm-distribution.html`

Approved decisions:

- Primary path: hybrid, starting with COA A and evolving toward COA B/C only when demand justifies it.
- Public npm/CLI name: `skillpacks`.
- Version granularity: skill-level versioning remains authoritative for user pinning.
- Deck installation: COA B/C-shaped metadata first. Decks should be represented as curated package lists and registry tags; the initial COA A monolith may materialize those selections locally, but deck behavior should not be hard-coded as monolith-only presets.
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
7. Model decks as package-list and registry-tag metadata from the start, even while the first package ships as a monolith.
8. Avoid GitHub Actions; publishing remains an explicit local or agent-run command unless separately requested.

## Package Architecture

### Package

The publishable npm package is named `skillpacks` and lives under `packages/skillpacks/`. The repository root stays private workspace metadata for the monorepo.

Current package `package.json` shape:

```json
{
  "name": "skillpacks",
  "version": "0.1.0",
  "description": "CLI and packaged markdown skill library for Claude Code and OpenAI Codex.",
  "type": "module",
  "bin": {
    "skillpacks": "bin/skillpacks.mjs"
  },
  "files": [
    "bin/",
    "src/",
    "global/",
    "packs/",
    "scripts/pack.sh",
    "scripts/skill-links.sh",
    "docs/decks.md",
    "docs/packs.md",
    "docs/QUICKSTART.md",
    "docs/skillpacks-npm-distribution.md",
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "init.sh"
  ],
  "license": "UNLICENSED",
  "engines": {
    "node": ">=18"
  }
}
```

The root `package.json` is private and declares workspaces for `apps/skills-showcase` and `packages/skillpacks`. The first release can keep runtime dependencies at zero. If argument parsing grows, add one small dependency later instead of pulling in a framework immediately.

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

<!-- skillpacks-compatibility-matrix:start -->
| Command | Owner | Backend | Requires bash | Requires jq | Notes |
| --- | --- | --- | --- | --- | --- |
| `help / --help / --version` | Node-owned | `packages/skillpacks/src/cli/run-pack-script.mjs` | No | No | CLI help and version output from package metadata. |
| `list --json` | Node-owned | Packaged manifest reader | No | No | Prints `dist/skillpacks-manifest.json`. |
| `list-packs` | Node-owned | Project config reader | No | No | Reads `.agents/project.json` directly. |
| `status` | Node-owned | Project config/status reader | No | No | Reports project designation and local roots. |
| `set-mode <mode>` | Node-owned | Project config writer | No | No | Preserves unrelated fields and uses the Node lock helper. |
| `set-update-mode <mode>` | Node-owned | Project config writer | No | No | Preserves sibling `skill_updates` fields. |
| `install <name...>` | Node-owned | Manifest plus lifecycle helpers | No | No | Handles active packs, active skills, aliases, hibernated diagnostics, markers, hashes, and project config writes. |
| `remove <name...>` | Node-owned | Manifest plus lifecycle helpers | No | No | Handles active pack removal, individual skill removal, and hibernated stale cleanup. |
| `refresh` | Node-owned | Manifest plus lifecycle helpers | No | No | Recreates local skill roots from `.agents/project.json`. |
| `doctor` | Node-owned | Managed marker drift reader | No | No | Read-only drift report; exits non-zero for stale installs. |
| `prune [--dry-run]` | Node-owned | Manifest plus lifecycle helpers | No | No | Removes only orphaned managed installs; keeps unmanaged directories. |
| `pin <skill> <version>` | Node-owned | Manifest plus lifecycle helpers | No | No | Validates archive versions, updates `pinned_versions`, and relinks installs. |
| `unpin <skill>` | Node-owned | Manifest plus lifecycle helpers | No | No | Clears the pin and relinks to latest packaged source. |
| `list` | Shell-backed | Packaged `scripts/pack.sh list` | Yes | No | Lists available active packs from the packaged repo content. |
| `recommend` | Shell-backed | Packaged `scripts/pack.sh recommend` | Yes | No | Uses existing repository-signal heuristics. |
| `which <skill>` | Shell-backed | Packaged `scripts/pack.sh which` | Yes | Optional | `jq` improves individually enabled skill status; pack-level status has a grep/sed fallback. |
| `install-deck <deck> [--full]` | Hybrid shell materialization | Node manifest resolver, then packaged `scripts/pack.sh install` | Yes | Yes | Deck metadata is Node-resolved, but installation still uses the compatibility install path. |
| `init-global [args...]` | External script-backed | Packaged `init.sh` | Yes | Optional | Installs global core skills; `jq` preserves an existing global pin file when `--pin` updates it. |
<!-- skillpacks-compatibility-matrix:end -->

The CLI should print the same reload notice as `pack.sh` after install, remove, refresh, pin, and unpin.

## Deck Installation

The approved deck answer points to COA B and COA C. That means decks should be modeled as installable package-list and registry-tag metadata, not as an implementation detail of the first monolith package.

Phase 1 can still run from the monolith package. The distinction is that `skillpacks install-deck <deck>` reads deck metadata from the manifest and then materializes that selection using the currently available backend. In the first release, that backend is the local monolith plus `scripts/pack.sh install`. Later, the same deck metadata can drive scoped package installs or registry tag resolution.

Supported deck metadata:

| Deck | CLI command | Package-list meaning | Registry tags |
| --- | --- | --- | --- |
| VARD | `skillpacks install-deck vard` | `vard` | `deck:vard` |
| ORD | `skillpacks install-deck ord` | `ord` | `deck:ord` |
| Business AFPS | `skillpacks install-deck business-afps` | `business-discovery` by default | `deck:business-afps`, `stage:discovery` |
| Business AFPS full | `skillpacks install-deck business-afps --full` | `business-discovery`, `customer-lifecycle`, `business-growth`, `business-ops` | `deck:business-afps`, `lane:full` |
| Devtool AFPS | `skillpacks install-deck devtool-afps` | `devtool` | `deck:devtool-afps` |

Business AFPS defaults to the first deliberate pack because current docs recommend progressive installation. The `--full` flag can exist for users who intentionally want the whole deliberate lane.

Implementation rule:

- Do not hard-code deck pack lists only inside the CLI command handler.
- Generate deck metadata into `packages/skillpacks/dist/skillpacks-manifest.json`.
- Make `install-deck` a resolver over that manifest.
- In COA A, the resolver forwards selected packs to `scripts/pack.sh install`.
- In COA B, the resolver can install or recommend scoped package lists such as `@skillpacks/vard`.
- In COA C, the resolver can query skills by registry tags such as `deck:vard`.

The CLI command stays `skillpacks install-deck <deck>` so users do not need to know whether a deck is backed by a monolith, scoped package list, or registry query.

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

The manifest should be generated from repository files, not hand-maintained. Start with a package-owned script such as `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.

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

After the Phase 3 port, `scripts/pack.sh` remains a supported compatibility wrapper instead of becoming a thin wrapper over the Node CLI. This preserves the long-lived git-checkout path while the npm package owns deterministic project-local lifecycle behavior.

## Implementation Roadmap

### Phase 0 - Reservation And Preflight

Goal: prove the public name and package boundary before code changes.

Tasks:

- Confirm npm account access for publishing `skillpacks`.
- Reserve or create the `@skillpacks` npm organization if future scoped packages are desired.
- Decide whether the first release should be private dry-run only or public `0.1.0`.
- Confirm license metadata for npm.
- Confirm `jq` remains a documented dependency for write commands in phase 1.
- Run `npm pack packages/skillpacks/build --dry-run --json --silent` once package staging exists and verify the tarball excludes active-task artifacts.

Exit criteria:

- `skillpacks` publish rights are confirmed.
- Package name collision risk is closed.
- Tarball content policy is documented and testable.

### Phase 1 - Monolith Package And Thin CLI

Goal: publishable monolith package that delegates to current scripts.

Tasks:

- Add `packages/skillpacks/package.json` for `skillpacks`.
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
- Add deck metadata for `vard`, `ord`, `business-afps`, and `devtool-afps`.
- Include package-list fields for COA B and registry-tag fields for COA C.
- Implement `skillpacks install-deck <deck>` as a manifest resolver.
- Implement `skillpacks install-deck business-afps --full` from manifest metadata.
- Add `skillpacks list --json` using the manifest.
- Add validation that every deck references existing packs.
- Add validation that deck package-list and registry-tag fields are present.
- Add validation that every manifest skill path exists and has `version:`.

Exit criteria:

- `node packages/skillpacks/bin/skillpacks.mjs install-deck vard` installs the `vard` pack in a temp repo.
- `node packages/skillpacks/bin/skillpacks.mjs install-deck business-afps` installs only `business-discovery`.
- `node packages/skillpacks/bin/skillpacks.mjs install-deck business-afps --full` installs the full deliberate lane.
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
- Use deck package-list metadata to generate scoped package recommendations.
- Use registry-style deck tags to support per-skill and category resolution.
- Consider `@skillpacks/sdk` only after the manifest is stable and used by the CLI.

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
| `jq` is missing | Shell-backed write paths fail | Node-owned `skillpacks` project commands no longer require `jq`; keep `jq` documented for git-checkout `scripts/pack.sh` write commands and `skillpacks install-deck` materialization. |
| Skill-level pinning needs archives omitted from tarball | Pins break | Include skill-local `archive/**` while excluding global docs history. |
| Existing git-checkout users regress | Adoption risk | Keep `init.sh` and `pack.sh` unchanged until Node parity is proven. |
| CLI name conflicts with installed external `agentic-skills` package | User confusion | Use `skillpacks` as the only npm package and bin name. |

## Open Questions

These should be answered before first publish, not before starting phase 1:

- Is `skillpacks` the final npm package owner identity, or should the public package be `@skillpacks/cli` after an organization is created?
- Should `install-deck` remain a hybrid shell materialization path for the first public package, or should deck installation move fully to Node before publish?
- Should `init-global` install only global core skills, or should it also offer an optional deck picker?
- Should hibernated packs be excluded from the npm tarball entirely or included only to preserve explicit error messages?
- Should package releases use `0.x` until several real consumer installs pass?

## Recommended Next Step

Start with Phase 0 and Phase 1 in one implementation pass:

1. Confirm publish rights for `skillpacks`.
2. Add workspace package metadata and a thin CLI wrapper under `packages/skillpacks`.
3. Prove one temp-repo install from the wrapper.
4. Add deck metadata and the manifest resolver only after the wrapper is stable.

This keeps the first implementation small while preserving the approved route toward COA B/C deck semantics, skill-level pinning, and later package/registry evolution.
