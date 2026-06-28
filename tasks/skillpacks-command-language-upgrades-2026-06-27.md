# Skillpacks Command Language Upgrade Audit

Date: 2026-06-27

## Goal

Audit the public `npx skillpacks` command surface after the recent install no-op feedback change, recommend language upgrades across commands, and ensure this repository has Build-In-Public (BIP) mode enabled.

## Evidence

- Recent install-language change confirmed in commit `c12ebf7ef fix(skillpacks): clarify already-installed skill installs`.
- `packages/skillpacks/src/cli/lifecycle.mjs` now routes no-change installs through:
  - `Skill already installed!`
  - `Pack already installed!`
  - `Requested packs and skills already installed!`
- `tasks/ship-manifest-2026-06-27-skillpacks-install-idempotency.md` records the intended behavior: no reload/fresh-session guidance when install made no mutation.
- BIP was already present in `.agents/project.json` as `alignment.build_in_public: true`. Running the supported command `node packages/skillpacks/bin/skillpacks.mjs set-bip on` completed successfully and produced no `.agents/project.json` diff.

## Language Standard To Reuse

The install no-op change establishes the right pattern:

1. Say whether anything changed.
2. Do not print reload/fresh-session guidance when no files changed.
3. Use a short, action-shaped sentence for no-op states.
4. Reserve recommended next commands for cases where running them would actually change or fix something.

Recommended shared vocabulary:

- Changed: `Updated ...`, `Installed ...`, `Removed ...`, followed by reload guidance only if skill roots changed.
- No-op: `<thing> already <state>. No files changed.`, for example `BIP already on. No files changed.`
- Dry-run no-op: `No changes needed.`
- Unsafe dry-run: `Safe to run: no`, with failure details and no recommended mutation command.
- User action: `Recommended command: npx skillpacks ...` for npm-facing help. Mention `scripts/pack.sh ...` only as a source-checkout alternative.

## Command Matrix

| Command | Current behavior observed | Recommended language upgrade |
| --- | --- | --- |
| `help`, `--help` | Usage header says `gskp`, despite the npm path being `skillpacks`. | Make `skillpacks` primary: `Usage: skillpacks <command> [args...]`. Add `Alias: gskp` near the bottom. |
| `--version` | Prints version only. | Keep unchanged. |
| `list` | Prints pack names; update status goes to stderr and can appear before/after stdout in combined logs. | Add a header such as `Available packs:` for human mode. Keep `list --json` quiet and machine-stable. |
| `list --json` | Machine JSON. | Keep unchanged. |
| `list --skills` | Clear installable skill inventory. | Keep mostly unchanged; consider ending with `Install with: npx skillpacks install <skill>`. |
| `list --tree` | Clear pack hierarchy. | Keep mostly unchanged; consider ending with `Install a pack: npx skillpacks install <pack>`. |
| `list-packs` | Prints enabled pack names only; silent when none. | Add `Enabled packs:` header, and print `No packs enabled.` when empty. |
| `status` | Dumps raw `.agents/project.json`, absolute skill paths, and installed skills. | Add a concise summary first: project type, enabled packs count, individually installed skills count, BIP status, update mode. Move raw JSON/path dump behind `--verbose` later if compatibility allows. |
| `status --all` | Uses per-project sections and final summary. | Include per-project compact summary lines before verbose status blocks; keep failure summary. |
| `recommend` | For an already configured repo, prints `Project already declares: ...` and enabled packs. | Add an explicit outcome: `No recommendation needed; project is already configured as devtool.` |
| `install <name...>` | Strongest current pattern. New no-op output is clear and reload guidance is gated by real changes. | Keep this as the baseline. Consider changing punctuation to period if standardizing all CLI sentences, but do not regress brevity. |
| `install-deck <deck> [--full]` | Resolves deck then delegates to pack install. | Before delegation, print `Installing deck '<deck>' (<lane>): <packs>`. On no-op, ensure pack-level no-op language still appears. |
| `init` | Always prints initialized/update/reload language even if base skills were already current. | Add idempotency: `Base skills already initialized. No files changed.` Do not print reload guidance on no-op. |
| `uninstall-global [--dry-run]` | Clear removal count; says base skills now install project-local. | If removed count is 0, say `No legacy global skill installs found.` before the migration note. |
| `uninstall-global --reinstall-base --dry-run` | Good multi-project summary with failures repeated. | Keep. If totals are all zero, add `No project-local base skill changes needed.` |
| `remove <name...>` | Always prints reload guidance after command, even when no skill root or config changed. | Mirror install: `Skill was not installed. No files changed.`, `Pack was not installed. No files changed.`, and suppress reload guidance on no-op. |
| `refresh` | Prints `Refreshed project skills...` even when nothing changed; reload guidance is correctly gated. | Use `Project skills already current at <version>. No files changed.` when sync/prune counts are zero. |
| `refresh --all --dry-run` | Excellent unsafe reasons and affected-skill summaries. If safe but no changes, still prints `Recommended command: skillpacks refresh --all`. | Only print a recommended mutation command when totals are nonzero. Prefix with `npx`: `Recommended command: npx skillpacks refresh --all`. |
| `refresh --all` | Good per-project sections and final success/failure summary. | Include changed/no-change counts in the final summary, not only ok/flagged/failed. |
| `doctor` | Clear drift table and fix command. In source checkout it recommends the absolute `scripts/pack.sh refresh` path. | Add a final status line: `Drift found: 2 stale installs.` Prefer `Fix: npx skillpacks refresh` for npm context, with source-checkout alternative if detected. |
| `doctor --all` | Uses shared multi-project summary. | Add per-project drift counts where possible; keep failure summary. |
| `doctor --fix` | Clear cleanup header and changed item count. | If zero, current `No generated skill-root changes needed.` is good. Ensure reload guidance remains gated by real skill-root changes. |
| `doctor --fix --agent-docs [--dry-run]` | Agent-doc migration has clear refusal/diff language. | Add a final `Agent docs changed: no/yes` summary in dry-run and real modes. |
| `alignment help` | Header and usage say `gskp alignment`. | Same global fix: primary command should be `skillpacks alignment`; note `gskp` as alias. |
| `alignment bundles [--dry-run] [--check]` | Delegates to generator; parser errors are clear. | Standardize generated output endings: `Bundles already current. No files changed.` for no-op dry-run/check success. |
| `alignment pages audit` | Delegates to auditor. | Ensure failure output ends with `Fix diagnostics above, then rerun: npx skillpacks alignment pages audit`. |
| `alignment pages open ...` | Parser errors are clear and path-safe. | Keep. Help should show `npx skillpacks alignment pages open ...` examples. |
| `alignment pages serve [--port]` | Parser errors are clear. | Ensure runtime output prints the URL and stop instruction in one compact block. |
| `alignment pages inject-tts [--force] [--dry-run]` | Asset install message is clear. | Add no-op language when the TTS include is already present: `TTS already included. No files changed.` |
| `alignment verify` | Clear missing-test error for non-source repos. | Add the source-checkout command fallback after the error when applicable. |
| `prototype help` | Header and usage say `gskp prototype`. | Same global command-name fix. |
| `prototype bundles [--dry-run] [--check]` | Delegates to generator; parser errors are clear. | Match alignment bundle no-op wording. |
| `prune [--dry-run]` | `Nothing to prune.` is clear; found-orphans dry-run says `Run without --dry-run`. | Use a copyable command: `Recommended command: npx skillpacks prune`. |
| `set-update-mode <mode>` | Always prints `Set skill_updates.mode to <mode>`, including same-value writes. | Add idempotency: `Update mode already <mode>. No files changed.` For `unset`, say whether the field was removed or already absent. |
| `set-bip <mode> [--all] [--dry-run]` | Single-project command always prints `Set alignment.build_in_public to on`; all-project dry-run recommends running even when every project is already on. | Add idempotency: `BIP already on. No files changed.` In `--all --dry-run`, if all actions are `already on`, print `No changes needed.` and omit recommended command. |
| `set-bip-prompt <action>` | Prints `Set alignment.bip_prompt_dismissed to dismiss/reset`, even though reset removes the field. | Use domain language: `BIP suggestion prompt dismissed.` / `BIP suggestion prompt reset.` Add no-op variants. |
| `pin <skill> <version>` | Always prints `Pinned ...`, even when already pinned to same version. | Add no-op: `<skill> already pinned to <version>. No files changed.` |
| `unpin <skill>` | Prints `Unpinned ...` even if no pin existed. | Add no-op: `<skill> is not pinned. No files changed.` |
| `set-mode <mode>` | Always prints `Updated .agents/project.json`. | Print actual mode: `Set agent_mode to hybrid.` or `Removed agent_mode override.` Add no-op variants. |
| `which <skill>` | For not-installed skills, advice currently says `scripts/pack.sh install ...`. | For npm CLI, recommend `npx skillpacks install <pack>` and `npx skillpacks install <skill>`. If in source checkout, add `Source checkout alternative: scripts/pack.sh install ...`. |

## Priority Recommendations

1. **Normalize command identity.** Make `skillpacks` the primary command in help, examples, recommended commands, and `which` output. Keep `gskp` as an alias, not the headline.
2. **Apply install-style no-op handling to all mutating commands.** Highest impact: `remove`, `set-bip`, `set-update-mode`, `set-mode`, `set-bip-prompt`, `pin`, `unpin`, `init`, and `refresh`.
3. **Gate recommended commands on actual work.** `refresh --all --dry-run` and `set-bip --all --dry-run` should not recommend a mutation command when every project is already current.
4. **Make summaries scan-friendly.** Add final counts for changed/no-change/failure states to `doctor`, `refresh --all`, `status --all`, and agent-doc migration.
5. **Keep machine surfaces stable.** Do not add human prose to `list --json`; keep update status on stderr.

## Suggested Implementation Shape

- Add a small shared helper for project-config setters that returns `{ changed, before, after }`.
- Add a shared `printNoChange(message)` convention and tests asserting no reload guidance on no-op mutations.
- Add a command-name formatter that prefers `npx skillpacks ...` in package-facing messages and can append source-checkout alternatives where useful.
- Add regression tests for no-op paths:
  - `set-bip on` when already on
  - `set-update-mode warn` when already warn
  - `set-mode hybrid` when already hybrid
  - `remove <skill>` when not installed
  - `pin <skill> <version>` when already pinned
  - `unpin <skill>` when not pinned
  - `refresh --all --dry-run` with zero planned changes

## Verification Notes

Commands run during this audit:

- `node packages/skillpacks/bin/skillpacks.mjs --help`
- `node packages/skillpacks/bin/skillpacks.mjs status`
- `node packages/skillpacks/bin/skillpacks.mjs list-packs`
- `node packages/skillpacks/bin/skillpacks.mjs which investigate`
- `node packages/skillpacks/bin/skillpacks.mjs which logic-wiring`
- `node packages/skillpacks/bin/skillpacks.mjs set-bip on`
- `node packages/skillpacks/bin/skillpacks.mjs set-bip on --all --dry-run`
- `node packages/skillpacks/bin/skillpacks.mjs refresh --all --dry-run`
- `node packages/skillpacks/bin/skillpacks.mjs doctor`
- `node packages/skillpacks/bin/skillpacks.mjs prune --dry-run`
- `node packages/skillpacks/bin/skillpacks.mjs recommend`
- `node packages/skillpacks/bin/skillpacks.mjs alignment help`
- `node packages/skillpacks/bin/skillpacks.mjs prototype help`

`doctor` currently reports stale `user-flow-map` installs (`v1.7 -> v1.8`) because of unrelated in-progress design-tree work in the repo. This was not remediated as part of the language audit.
