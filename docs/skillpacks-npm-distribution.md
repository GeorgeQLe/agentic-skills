# Skillpacks npm Distribution Design

## Approval Summary

Source alignment page: `alignment/idea-scope-brief-npm-distribution.html` (historical strategy context). Current package usage reference: `alignment/gskp-npm-package-walkthrough.html`.

Approved decisions:

- Primary path: hybrid, starting with COA A and evolving toward COA B/C only when demand justifies it.
- Primary public npm package: `skillpacks`.
- Scoped alias npm package: `@glexcorp/gskp`.
- Version granularity: skill-level versioning remains authoritative for user pinning.
- Deck installation: COA B/C-shaped metadata first. Decks should be represented as curated package lists and registry tags; the initial COA A monolith may materialize those selections locally, but deck behavior should not be hard-coded as monolith-only presets.
- Artifact route: write the detailed design doc in `docs/` first, then use it as the implementation roadmap.

Current npm check on 2026-06-12:

- `npm view gsp --json` returned an existing external package at version `0.5.4`, so `gsp` should not be used.
- `npm view gsk --json` returned an existing external package at version `0.0.2`, so `gsk` should not be used.
- `npm view skp --json` returned an existing external package at version `1.0.0`, so `skp` should not be used.
- `npm view gskp --json` returned `E404`, so the unscoped package name appears unclaimed or inaccessible to this machine.
- `npm view agentic-skills --json` returned an existing external package at version `2.5.1`, so `agentic-skills` should not be used as this repo's public npm package name.
- `npm view skillpack --json` returned an existing unrelated package at version `0.1.3`; warn against the singular typo, but keep `skillpacks` as the primary route because it already exists and has users.

Publication status:

- `skillpacks@0.1.0` and `skillpacks@0.1.1` were published publicly on npm before the short-name change.
- Source package metadata is `skillpacks`.
- Each release also publishes `@glexcorp/gskp` as a scoped alias from the same built artifact and version.
- Both packages expose both binaries: `skillpacks` and `gskp`.
- The public verification targets are `npx skillpacks@latest list`, `npx @glexcorp/gskp@latest list`, temp-project `install code-quality`, temp-project `install quality-sweep`, temp-project `install-deck game-afps`, and the git-checkout `scripts/pack.sh list` path.

## Product Shape

`skillpacks` is the primary public installer and CLI package for this repository's markdown skill library. `@glexcorp/gskp` is a scoped alias package for users who prefer the `gskp` identity. The first npm release should not restructure the repository into many packages. It should package the current repository content needed to install skills and expose a Node entry point that can drive the existing install model.

The initial user experience should be:

```bash
npx skillpacks init
npx skillpacks install business-research
npx skillpacks install-deck vard
npx skillpacks status
npx skillpacks doctor
npx skillpacks refresh
```

`npx skillpacks init` installs the base skill surface into the current repository as local skill roots and records `base_skills: true` in `.agents/project.json`. This makes `npx skillpacks refresh` update base skills from the current package snapshot. Base skills are **project-local only** — there is no user-home (global) install path.

If a machine still has legacy user-home base installs from the retired init path, clean them up with:

```bash
npx skillpacks cleanup
```

This removes only skillpacks-owned installs under `~/.claude/skills` and `~/.codex/skills`, leaves unmanaged directories untouched, and removes deprecated Build-In-Public config keys (`alignment.build_in_public`, `alignment.bip_platforms`, and `alignment.bip_prompt_dismissed`) from discovered projects. Domain packs remain project-local only.
Use `npx skillpacks cleanup --dry-run` to preview the exact repo-managed installs and BIP config that would be removed without deleting anything.

Use the migration form when you want the same cleanup plus project-local base skills restored below the current directory:

```bash
npx skillpacks cleanup --reinstall-base
```

It removes the legacy user-home installs, discovers existing `.agents/project.json` roots under the current directory, sets `base_skills: true` while preserving other project config fields, and refreshes `.claude/skills` / `.codex/skills` in each project. If no project root is discovered, it initializes the current directory with base skills.
Add `--dry-run` to preview both the global cleanup and the project-local migration plan without removing global skills, writing `.agents/project.json`, installing skill roots, pruning roots, or initializing a project.

`npx skillpacks refresh --all` and `npx skillpacks refresh --all --dry-run` flag any remaining skillpacks-owned user-home installs, continue scanning project roots, suggest `npx skillpacks cleanup`, and exit nonzero until the legacy globals are cleaned up. `npx skillpacks uninstall-global` remains as a deprecated compatibility alias for existing automation.

Source-checkout users install base skills project-local the same way and keep using `scripts/pack.sh` for packs:

```bash
npx skillpacks init
scripts/pack.sh install business-research
scripts/pack.sh refresh
```

The npm path is now the standard agent-facing install route. The source-checkout commands remain supported for local repository development and compatibility.

Scoped alias examples are equivalent at the same package version:

```bash
npx @glexcorp/gskp init
npx @glexcorp/gskp install business-research
```

## Design Principles

1. Preserve `SKILL.md` as the source format.
2. Preserve `packs/base/{claude,codex}` and `packs/<pack>/{claude,codex}` as the authoring layout.
3. Preserve `.agents/project.json` as the project designation file.
4. Preserve `scripts/pack.sh` while the npm CLI reaches parity.
5. Keep the first npm release as one package.
6. Add a generated manifest early so later COA B/C migration does not require inventing metadata twice.
7. Model decks as package-list and registry-tag metadata from the start, even while the first package ships as a monolith.
8. Avoid GitHub Actions; publishing remains an explicit local or agent-run command unless separately requested.

## Package Architecture

### Package

The publishable npm package source is named `skillpacks` and lives under `packages/skillpacks/`. The repository root stays private workspace metadata for the monorepo. During release, `./publish.sh` stages two publish directories from `packages/skillpacks/build`: one with `package.json.name = "skillpacks"` and one with `package.json.name = "@glexcorp/gskp"`.

Current package `package.json` shape:

```json
{
  "name": "skillpacks",
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
    "CLAUDE.md"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=18"
  }
}
```

The root `package.json` is private and declares the `packages/skillpacks` workspace. The public package uses the repository root MIT license and npm metadata links back to `https://github.com/GeorgeQLe/agentic-skills`. The first release can keep runtime dependencies at zero. If argument parsing grows, add one small dependency later instead of pulling in a framework immediately.

Both published packages expose the same binaries:

```json
{
  "bin": {
    "gskp": "bin/skillpacks.mjs",
    "skillpacks": "bin/skillpacks.mjs"
  }
}
```

Do not use `skillpack` singular; that is an unrelated npm package with a different project format.

### CLI Entry Point

`packages/skillpacks/bin/skillpacks.mjs` resolves the installed package root with `import.meta.url`, then dispatches commands into either:

- a thin wrapper around included repository scripts, for immediate parity; or
- native Node modules under `src/cli/`, after the port is ready.

Phase 1 should wrap existing scripts because `scripts/pack.sh` already owns install, remove, refresh, doctor, pin, unpin, status, and project-lock behavior.

The wrapper must run `scripts/pack.sh` with the user's current working directory as the target project root. That preserves the current behavior where `.agents/project.json`, `.claude/skills`, and `.codex/skills` are written to the consumer project, not to the package install directory. Source-checkout execution may fall back to the repository root; staged package execution should use files inside the package root.

### Included Repository Content

The npm tarball must include:

- `packs/base/**` active core skills and their local archives.
- `packs/**` active pack skills and their local archives.
- `scripts/pack.sh` and script helpers it sources, especially `scripts/skill-links.sh`.
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

Skill-level archives inside `packs/base/**/archive/` and `packs/**/archive/` must remain included because pinning depends on them.

## CLI Surface

Phase 3 compatibility decision: keep `scripts/pack.sh` as the canonical git-checkout compatibility wrapper and as the packaged shell fallback for commands that are not yet worth porting. Do not turn `pack.sh` into a thin wrapper over the Node CLI in this phase; that would make the old checkout path depend on the npm package internals before all discovery and init surfaces are ported. Revisit the decision only after `recommend`, `which`, and `install-deck` are either Node-owned or intentionally documented as permanent shell surfaces. (Base init is fully Node-owned and project-local; the user-home global init path has been retired.)

<!-- gskp-compatibility-matrix:start -->
| Command | Owner | Backend | Requires bash | Requires jq | Notes |
| --- | --- | --- | --- | --- | --- |
| `help / --help / --version` | Node-owned | `packages/skillpacks/src/cli/run-pack-script.mjs` | No | No | CLI help and version output from package metadata. |
| `list --json` | Node-owned | Packaged manifest reader | No | No | Prints `dist/skillpacks-manifest.json`. |
| `list --skills` | Node-owned | Packaged manifest reader | No | No | Flat list of installable skills (base + packs) with platform and deprecation markers. |
| `list --tree` | Node-owned | Packaged manifest reader | No | No | Packs with nested skills, plus a base group, from `dist/skillpacks-manifest.json`. |
| `list-packs` | Node-owned | Project config reader | No | No | Reads `.agents/project.json` directly. |
| `status` | Node-owned | Project config/status reader | No | No | Reports project designation and local roots. |
| `set-mode <mode>` | Node-owned | Project config writer | No | No | Preserves unrelated fields and uses the Node lock helper. |
| `set-update-mode <mode>` | Node-owned | Project config writer | No | No | Preserves sibling `skill_updates` fields. |
| `set-bip <mode> [--all] [--dry-run]` | Node-owned | Project config writer | No | No | Sets `alignment.build_in_public` to `true`, `false`, or removes it while preserving sibling `alignment` fields. `--all --dry-run` previews discovered-project changes and parse/read issues without writing. |
| `set-bip-platforms <platform...>` | Node-owned | Project config writer | No | No | Sets `alignment.bip_platforms` to normalized priority platform slugs, or clears only that field with `unset`, while preserving sibling `alignment` fields. Enabled BIP output still covers every bundled channel. |
| `init` | Node-owned | Manifest plus lifecycle helpers | No | No | Installs base-scope manifest entries as project-local base skills and records `base_skills: true`. |
| `cleanup [--reinstall-base] [--dry-run]` | Node-owned | Managed marker ownership reader plus project-local config cleanup and optional base refresh | No | No | Removes deprecated skillpacks state: legacy skillpacks-owned base installs from `~/.claude/skills` and `~/.codex/skills`, plus BIP project config keys from discovered projects. With `--reinstall-base`, enables project-local base skills in discovered projects below the current directory, or initializes the current directory when none are found. With `--dry-run`, previews removals and migration actions without mutating global skills or project files. |
| `uninstall-global [--reinstall-base] [--dry-run]` | Node-owned compatibility alias | Same backend as `cleanup` | No | No | Deprecated alias retained for existing automation; prefer `cleanup`. |
| `install <name...>` | Node-owned | Manifest plus lifecycle helpers | No | No | Handles active packs, active skills, aliases, hibernated diagnostics, markers, hashes, and project config writes. |
| `remove <name...>` | Node-owned | Manifest plus lifecycle helpers | No | No | Handles active pack removal, individual skill removal, and hibernated stale cleanup. |
| `refresh` | Node-owned | Manifest plus lifecycle helpers | No | No | Recreates enabled base skills, packs, and individual skill roots from `.agents/project.json`. |
| `doctor` | Node-owned | Managed marker drift reader | No | No | Read-only drift report; exits non-zero for stale installs. |
| `doctor --fix` | Node-owned | Manifest plus lifecycle helpers | No | No | Cleans generated skill roots only: removes orphaned managed installs, converts unpinned legacy symlinks to managed package copies, preserves pinned symlinks, and preserves unmanaged local directories. |
| `doctor --fix --agent-docs [--dry-run]` | Node-owned | Marker-bounded agent-doc migrator | No | No | Replaces only recognized generated blocks in `AGENTS.md` and `CLAUDE.md`; dry-run prints a diff without writing, and non-dry-run writes timestamped backups under `.agents/backups/`. |
| `alignment bundles [--dry-run] [--check]` | Node-owned wrapper | Packaged `scripts/upgrade-alignment-page.mjs` | No | No | Source/package maintenance command. Runs generated per-skill `ALIGNMENT-PAGE.md` bundle generation/checking with `--root <cwd>` when the target contains `docs/` and `packs/`. |
| `prototype bundles [--dry-run] [--check]` | Node-owned wrapper | Packaged `scripts/upgrade-prototype-session-loop.mjs` | No | No | Source/package maintenance command. Runs generated per-skill `PROTOTYPE-SESSION-LOOP.md` bundle generation/checking with `--root <cwd>` while keeping top-level `docs/` outside runtime installs. |
| `alignment pages audit` | Node-owned wrapper | Packaged `scripts/audit-alignment-pages.mjs` | No | No | Audits active rendered `alignment/*.html` pages with `--root <cwd>`. |
| `alignment pages open <alignment/page.html> [--browser <browser>]` | Node-owned wrapper | Packaged `scripts/open-html-page.mjs` | No | No | Opens or focuses an active rendered alignment page with best-effort platform handling. Browser values: `auto`, `brave`, `chrome`, `safari`, `edge`, or `default`. |
| `alignment pages serve [--port <port>]` | Node-owned wrapper | Packaged `scripts/serve-alignment.mjs` | No | No | Serves the target repo over `http://localhost:<port>/` with the current working directory as the root; default port is `8907`. |
| `alignment pages inject-tts [--force] [alignment/<page>.html]` | Node-owned wrapper | Packaged `scripts/inject-tts.mjs` plus TTS asset | No | No | Ensures `scripts/alignment-tts-kokoro.js` exists in the target repo before injecting the TTS include. |
| `alignment pages scaffold <skill> <topic> --out alignment/<skill>-<topic>.html` | Node-owned writer | Packaged `assets/templates/alignment-page.html` | No | No | Writes a starter alignment HTML page and creates a minimal `alignment/index.html` when missing. Producing skills still own page content, gates, and approval semantics. |
| `interrogation pages scaffold <skill> <round> <branch> --out interrogation/<skill>-r<round>-<branch>.html` | Node-owned writer | Packaged `assets/templates/interrogation-page.html` | No | No | Writes a starter interrogation round HTML page. Parent skills still own assumptions, questions, confidence gates, and answer-sidecar semantics. |
| `alignment verify` | Node-owned wrapper | Target repo Vitest suite | No | No | Source/package maintenance command. Runs this repo's focused alignment Vitest set when the target repo contains those tests; exits clearly when unavailable. |
| `prune [--dry-run]` | Node-owned | Manifest plus lifecycle helpers | No | No | Removes only orphaned managed installs; keeps unmanaged directories. |
| `pin <skill> <version>` | Node-owned | Manifest plus lifecycle helpers | No | No | Validates archive versions, updates `pinned_versions`, and relinks installs. |
| `unpin <skill>` | Node-owned | Manifest plus lifecycle helpers | No | No | Clears the pin and relinks to latest packaged source. |
| `list` | Shell-backed | Packaged `scripts/pack.sh list` | Yes | No | Lists available active packs from the packaged repo content. |
| `recommend` | Shell-backed | Packaged `scripts/pack.sh recommend` | Yes | No | Uses existing repository-signal heuristics. |
| `which <skill>` | Shell-backed | Packaged `scripts/pack.sh which` | Yes | Optional | `jq` improves individually enabled skill status; pack-level status has a grep/sed fallback. |
| `install-deck <deck> [--full]` | Hybrid shell materialization | Node manifest resolver, then packaged `scripts/pack.sh install` | Yes | Yes | Deck metadata is Node-resolved, but installation still uses the compatibility install path. |
<!-- gskp-compatibility-matrix:end -->

The CLI should print the same reload notice as `pack.sh` after install, remove, refresh, pin, and unpin.

## Deck Installation

The approved deck answer points to COA B and COA C. That means decks should be modeled as installable package-list and registry-tag metadata, not as an implementation detail of the first monolith package.

Phase 1 can still run from the monolith package. The distinction is that `gskp install-deck <deck>` reads deck metadata from the manifest and then materializes that selection using the currently available backend. In the first release, that backend is the local monolith plus `scripts/pack.sh install`. Later, the same deck metadata can drive scoped package installs or registry tag resolution.

Supported deck metadata:

| Deck | CLI command | Package-list meaning | Registry tags |
| --- | --- | --- | --- |
| VARD | `skillpacks install-deck vard` | `vard` | `deck:vard` |
| ORD | `skillpacks install-deck ord` | `ord` | `deck:ord` |
| Business AFPS | `skillpacks install-deck business-afps` | `business-research` by default | `deck:business-afps`, `stage:discovery` |
| Business AFPS full | `skillpacks install-deck business-afps --full` | `business-research`, `customer-lifecycle`, `business-growth`, `business-ops` | `deck:business-afps`, `lane:full` |
| Devtool AFPS | `skillpacks install-deck devtool-afps` | `devtool` | `deck:devtool-afps` |
| Game AFPS | `skillpacks install-deck game-afps` | `game` | `deck:game-afps` |

Business AFPS defaults to the first deliberate pack because current docs recommend progressive installation. The `--full` flag can exist for users who intentionally want the whole deliberate lane.

Implementation rule:

- Do not hard-code deck pack lists only inside the CLI command handler.
- Generate deck metadata into `packages/skillpacks/dist/skillpacks-manifest.json`.
- Make `install-deck` a resolver over that manifest.
- In COA A, the resolver forwards selected packs to `scripts/pack.sh install`.
- In COA B, the resolver can install or recommend scoped package lists such as `@gskp/vard`.
- In COA C, the resolver can query skills by registry tags such as `deck:vard`.

The deck command stays `install-deck <deck>` in both published binaries (`skillpacks` and `gskp`) so users do not need to know whether a deck is backed by a monolith, scoped package list, or registry query.

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
      "name": "business-research",
      "path": "packs/business-research",
      "status": "active",
      "tools": ["claude", "codex"],
      "skills": ["customer-discovery", "competitive-analysis"]
    }
  ],
  "skills": [
    {
      "name": "customer-discovery",
      "pack": "business-research",
      "tool": "codex",
      "version": "v1.0",
      "path": "packs/business-research/codex/customer-discovery/SKILL.md",
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
      "default_packs": ["business-research"],
      "full_packs": ["business-research", "customer-lifecycle", "business-growth", "business-ops"]
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

The manifest is generated from the **git index**, not the working tree: discovery (`git ls-files`), per-skill `content_sha256`, `archive_versions`, and the global `source_fingerprint` all read staged blobs via a batched `git cat-file --batch`. This makes the committed manifest a pure function of what the committing session is staging, so a concurrent session's unstaged edits on a shared working tree never leak in. Stage your skill edits before running the build, then stage and commit the regenerated manifest alongside the source. `build:check` regenerates from the index and byte-compares against the committed manifest; on a clean checkout `index == HEAD`, so clean-checkout validation is unchanged. (`build-package.mjs` computes its source fingerprint from the index for the same reason; its public-export fingerprint guard ensures package staging does not mutate `exports/skills-catalog/v1/**`.)

Manifest consumers:

- `gskp list --json`
- `gskp search <query>` in a later phase
- package tarball validation
- migration to `@gskp/*` package metadata
- possible hosted registry later

## Versioning And Pinning

There are two version layers:

1. npm package semver, such as `skillpacks@0.1.0`.
2. skill frontmatter versions, such as `version: v0.4`.

The approved granularity is skill-level, so skill frontmatter remains the user-facing pinning level. npm package semver is the transport snapshot.

User examples:

```bash
npx skillpacks@0.1.0 install business-research
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

- `npx skillpacks init` installs project-local base skills for both checkout and npm users.
- `scripts/pack.sh` remains valid for local checkout users.
- `.agents/project.json` keeps `project_type`, `enabled_packs`, `enabled_skills`, `pinned_versions`, `skill_updates`, `project_scopes`, `notes`, and `agent_mode`.
- Generated `.claude/skills` and `.codex/skills` roots remain uncommitted consumer-project artifacts.
- Installed skill roots continue to use `.agentic-skills-managed` markers.

After the Phase 3 port, `scripts/pack.sh` remains a supported compatibility wrapper instead of becoming a thin wrapper over the Node CLI. This preserves the long-lived git-checkout path while the npm package owns deterministic project-local lifecycle behavior.

## Phase 4 Release-Readiness Notes

Phase 4 prepares the package for a dry-run release only. It does not publish packages, create npm tags, change package access, or replace the source-checkout setup path.

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
npx skillpacks install devtool
npx skillpacks install code-quality
npx skillpacks install-deck game-afps
npx skillpacks status
```

Both paths write the same project-local contract: `.agents/project.json`, `.claude/skills/*`, and `.codex/skills/*`. The CLI session reload requirements are unchanged: Claude Code needs `/reload-skills`, `/clear`, or a restart depending on when the local roots appeared; Codex needs a fresh session if the `$` skill list remains stale.

### Migration From Checkout To npm

An existing project can move from a local checkout workflow to the npm package by keeping `.agents/project.json` committed and running:

```bash
npx skillpacks refresh
npx skillpacks doctor
```

`refresh` recreates generated local skill roots from the package snapshot and the existing project designation. `doctor` then reports whether managed installs are current, stale, missing, unknown, or pinned.

Do not commit generated `.claude/skills/*` or `.codex/skills/*` roots during migration; they remain rebuildable consumer-project artifacts.

### Version And Pinning Troubleshooting

`skillpacks@<semver>` is the transport snapshot. It determines which active skill files and `archive/<version>/SKILL.md` snapshots are present in the installed package.

Skill pins still use skill frontmatter versions:

```bash
npx skillpacks pin quality-sweep v0.0
npx skillpacks unpin quality-sweep
```

If a pin fails because an archive version is unavailable, the installed npm package does not contain that archived skill snapshot. Upgrade to a package version that includes the archive, or use a source checkout at a commit that contains it.

Node-owned npm commands (`install`, `remove`, `refresh`, `doctor`, `prune`, `pin`, `unpin`, `status`, `list-packs`, `set-mode`, `set-update-mode`, `set-bip`, and `set-bip-platforms`) do not require `jq`. In the current `skillpacks@0.1.0` release, `install-deck` still materializes through the packaged shell backend and therefore requires both `bash` and `jq`.

### Alignment Convention Commands

Source-checkout users can keep using the direct script paths:

```bash
node scripts/upgrade-alignment-page.mjs --check
node scripts/audit-alignment-pages.mjs
node scripts/serve-alignment.mjs
node scripts/open-html-page.mjs alignment/example.html --browser auto
node scripts/inject-tts.mjs --force alignment/example.html
```

npm users can run consumer-safe page commands from the target repository:

```bash
npx skillpacks alignment pages audit
npx skillpacks alignment pages serve --port 8907
npx skillpacks alignment pages open alignment/example.html --browser auto
npx skillpacks alignment pages inject-tts --force alignment/example.html
npx skillpacks alignment pages scaffold investigate example --out alignment/investigate-example.html
npx skillpacks interrogation pages scaffold customer-discovery 1 acme --out interrogation/customer-discovery-r1-acme.html
```

Source/package maintenance commands require a checkout with this repository's `docs/`, `packs/`, and focused test files:

```bash
npx skillpacks alignment bundles --check
npx skillpacks alignment verify
```

The namespace keeps the two alignment workflows separate. `alignment pages audit` checks already-rendered active `alignment/*.html` pages. `alignment pages scaffold` writes a starter page from the packaged HTML template, but it does not make approval decisions or replace a producing skill's evidence, gates, compiler, or handoff. `alignment pages serve` runs the packaged static server against the current working directory so downstream repos can browse their own `alignment/` and `scripts/` folders over `http://localhost:8907/` by default, with `--port` available when that port is occupied. `alignment pages open` opens or focuses one active alignment page and reports `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`. `alignment pages inject-tts` copies the packaged `scripts/alignment-tts-kokoro.js` asset into the target repo when needed before adding the script tag. `interrogation pages scaffold` mirrors the starter-template pattern for stage-zero round pages. `alignment bundles` now validates shared resolver stubs that load `docs/alignment-page-convention.md` in source checkouts or `assets/alignment-page-convention.md` in packaged installs; `--legacy-bundles` regenerates sibling `ALIGNMENT-PAGE.md` fallback files only when needed for older installed skills. `alignment verify` is mainly for this source checkout and exits with a clear message when a consumer repo does not include the focused alignment Vitest files.

One-off `npx skillpacks ...` works when the network is available or the npm cache is warm. Target repos that need reliable repeat or offline alignment workflows should add `skillpacks` as a devDependency or use a pinned npm spec such as `npx skillpacks@<version> alignment pages audit`.

## Publishing

Maintainers should use the concise release procedure in [`docs/release-runbook.md`](release-runbook.md). This section documents the package architecture behind that runbook.

Do not publish manually from `packages/skillpacks/build`. That directory is an intermediate source-package build, not the dual-package release boundary.

Use the root release script:

```bash
./publish.sh patch
./publish.sh minor
./publish.sh 0.1.2
./publish.sh --dry-run patch
./publish.sh --current
```

Release rules:

- The npm publisher must be logged in with `npm login --registry https://registry.npmjs.org/` and verified with `npm whoami --registry https://registry.npmjs.org/`.
- The expected publisher is `glexcorp` unless `SKILLPACKS_NPM_PUBLISHER=<npm-username>` is intentionally set for another authorized account.
- The publishing account must have access to `skillpacks` and scoped-package publish rights for `@glexcorp/gskp`.
- The script requires a clean git working tree before it starts.
- It bumps `packages/skillpacks/package.json` with `npm --workspace packages/skillpacks version <target> --no-git-tag-version`.
- It runs `npm --workspace packages/skillpacks run test:node` and `npm run skillpacks:verify` before staging publish directories.
- It stages two packages under `/tmp`, both generated from `packages/skillpacks/build`.
- The staged `skillpacks` package and staged `@glexcorp/gskp` package must have identical versions and identical `bin` mappings.
- It runs `scripts/prepublish-auth-check.mjs` inside each staged package before a real publish.
- It publishes `skillpacks` first, then `@glexcorp/gskp --access public`.
- It verifies both published package specs after a real publish.

Every npm publish requires a new version. Same-version parity is a hard release gate: `skillpacks` and `@glexcorp/gskp` versions must stay identical, including recovery after a partial publish. If `skillpacks` publishes but `@glexcorp/gskp` fails, fix npm auth/access and rerun `./publish.sh --current`; do not manually publish only one package.

After a real publish, verify npm registry parity:

```bash
npm view skillpacks version
npm view @glexcorp/gskp version
```

After a real publish, verification can also be run directly:

```bash
SKILLPACKS_PACKAGE_NAME=skillpacks SKILLPACKS_NPM_SPEC=skillpacks@latest npm run skillpacks:verify-published
SKILLPACKS_PACKAGE_NAME=@glexcorp/gskp SKILLPACKS_NPM_SPEC=@glexcorp/gskp@latest npm run skillpacks:verify-published
```

## Implementation Roadmap

### Phase 0 - Reservation And Preflight

Goal: prove the public name and package boundary before code changes.

Tasks:

- Confirm npm account access for publishing `skillpacks` and `@glexcorp/gskp`.
- Reserve or create future pack scopes only if demand justifies package splitting.
- Decide whether the first release should be private dry-run only or public `0.1.0`.
- Confirm MIT license metadata and npm repository/bugs/homepage links.
- Confirm `jq` remains a documented dependency for write commands in phase 1.
- Run `npm pack packages/skillpacks/build --dry-run --json --silent` once package staging exists and verify the tarball excludes active-task artifacts.

Exit criteria:

- `skillpacks` and `@glexcorp/gskp` publish rights are confirmed.
- Package name collision risk is closed.
- Tarball content policy is documented and testable.

### Phase 1 - Monolith Package And Thin CLI

Goal: publishable monolith package that delegates to current scripts.

Tasks:

- Add `packages/skillpacks/package.json` for `skillpacks`.
- Add `packages/skillpacks/bin/skillpacks.mjs`.
- Add `packages/skillpacks/src/cli/run-pack-script.mjs` or equivalent script dispatcher.
- Implement command forwarding for existing `pack.sh` commands.
- Implement project-local base `init` as a Node lifecycle helper.
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
- `node packages/skillpacks/bin/skillpacks.mjs install-deck business-afps` installs only `business-research`.
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
- Run package tests, tarball validation, and package metadata checks.
- Follow [`docs/release-runbook.md`](release-runbook.md), including `npm login`, `npm whoami`, scoped-package access, and OTP readiness.
- Run `./publish.sh --dry-run patch`, then `./publish.sh patch` or another explicit version target.
- Treat same-version parity as a hard release gate: `skillpacks` and `@glexcorp/gskp` must publish at the same version, and partial-publish recovery must use `./publish.sh --current`.
- Verify `npx skillpacks@latest list` and `npx @glexcorp/gskp@latest list` against the published packages.
- Verify `npm view skillpacks version` and `npm view @glexcorp/gskp version` report the same version.
- Install into a fresh temp repo and verify one pack, one individual skill, and one deck.
- Commit and push release docs and any package version changes.

Exit criteria:

- `skillpacks` and `@glexcorp/gskp` are installable from npm at the same version.
- A fresh project can install packs without cloning this repository.
- Current git-checkout install path remains functional.

### Phase 6 - COA B/C Readiness

Goal: prepare evolution without doing the package split prematurely.

Tasks:

- Track install usage and maintenance pain from the monolith package.
- Identify "hot packs" that deserve scoped packages.
- Use manifest data to generate future scoped pack package metadata experimentally.
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
scripts/validate-skills-catalog-export.sh
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
| `@glexcorp/gskp` scoped alias cannot be claimed | Blocks the approved scoped alias | Keep `skillpacks` as the primary package and resolve scoped alias access before dual publish. |
| npm package accidentally includes task/history/prompt artifacts | Bloated or sensitive package | Use `files` whitelist plus `npm pack --dry-run` validation. |
| `pack.sh` assumes a git checkout | npm install breaks | Run it from the packaged script path and add temp-repo tests. |
| `jq` is missing | Shell-backed write paths fail | Node-owned `skillpacks` project commands no longer require `jq`; keep `jq` documented for git-checkout `scripts/pack.sh` write commands and shell-backed deck materialization. |
| Skill-level pinning needs archives omitted from tarball | Pins break | Include skill-local `archive/**` while excluding repo-wide docs history. |
| Existing git-checkout users regress | Adoption risk | Keep `pack.sh` unchanged until Node parity is proven; base init is Node-owned and project-local via `npx skillpacks init`. |
| CLI name conflicts with installed external `agentic-skills` package | User confusion | Use `skillpacks` as the primary npm package and keep `@glexcorp/gskp` as a scoped alias with the same binaries. |

## Open Questions

Historical planning questions from before the first publish:

- The current decision is `skillpacks` as the primary package with `@glexcorp/gskp` as a scoped alias.
- Should `install-deck` remain a hybrid shell materialization path for the first public package, or should deck installation move fully to Node before publish?
- Should hibernated packs be excluded from the npm tarball entirely or included only to preserve explicit error messages?
- Should package releases use `0.x` until several real consumer installs pass?

## Recommended Next Step

Historical phase-start recommendation from before the first publish:

1. Confirm publish rights for `skillpacks` and `@glexcorp/gskp`.
2. Add workspace package metadata and a thin CLI wrapper under `packages/skillpacks`.
3. Prove one temp-repo install from the wrapper.
4. Add deck metadata and the manifest resolver only after the wrapper is stable.

This keeps the first implementation small while preserving the approved route toward COA B/C deck semantics, skill-level pinning, and later package/registry evolution.
