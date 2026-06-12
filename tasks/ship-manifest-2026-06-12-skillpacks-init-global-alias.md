# Ship Manifest - Skillpacks Init Global Alias

## User Goal

Add an npm CLI compatibility alias so `npx skillpacks init --global` performs the same user-home global core install as `npx skillpacks init-global`, while preserving current project-local `npx skillpacks init` behavior.

## Changed Files

- `README.md`
- `docs/QUICKSTART.md`
- `docs/skills-reference.md`
- `docs/skillpacks-npm-distribution.md`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/compatibility.test.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `prompts/exec/skill-prompt-20260612-085707-skillpacks-init-global-alias.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-12-skillpacks-init-global-alias.md`

Ignored/generated package staging under `packages/skillpacks/build/` was refreshed by validation and contains the new alias behavior, but it is gitignored and has no tracked diff.

Unrelated local changes observed and excluded from this shipping boundary:

- The `Current Planning - Skills Showcase Skill Execution Handoff Flow` sections already present at the top of `tasks/roadmap.md` and `tasks/todo.md`.
- `prompts/user-flow-map/skill-prompt-20260612-090206-skill-execution-handoff.md`.

## Per-File Purpose

- `packages/skillpacks/src/cli/run-pack-script.mjs`: add the shared global init shell helper, route `init --global` through it, keep `init-global`, and update CLI help.
- `packages/skillpacks/test/lifecycle.test.mjs`: prove `init --global --help` forwards to `init.sh --help`, `init --bad` rejects, and existing plain `init` project-local behavior remains covered.
- `packages/skillpacks/test/compatibility.test.mjs`: keep the compatibility matrix and CLI help surface aligned with the new alias.
- `README.md`, `docs/QUICKSTART.md`, `docs/skills-reference.md`, `docs/skillpacks-npm-distribution.md`: document the distinction between project-local init and user-home global-core init.
- `prompts/exec/...`: capture the visible user handoff for this `exec` invocation.
- `tasks/roadmap.md`, `tasks/todo.md`: record and close the scoped implementation plan and review notes.
- `tasks/history.md`: add a durable completion record.
- `tasks/ship-manifest-2026-06-12-skillpacks-init-global-alias.md`: record quality-gate evidence for the shipping boundary.

## User-Goal Mapping

- The alias itself is implemented in `run-pack-script.mjs`.
- Backward compatibility is preserved because `init-global` now calls the same helper and remains listed in help/docs.
- Project-local `init` behavior is preserved by leaving the Node-owned `initProject()` path unchanged unless the first argument is exactly `--global`.
- Unsupported init arguments remain rejected by the `init --bad` regression test.
- Global install semantics remain unchanged because the alias only invokes the existing packaged `init.sh`; no domain-pack global install logic was added.

## Tests Run

- `npm --workspace skillpacks run test:node` — passed, 57 tests.
- `npm --workspace skillpacks run build:check` — passed; manifest check and package staging boundary check passed.
- `node -e "import('./packages/skillpacks/src/cli/run-pack-script.mjs').then(async ({ runSkillpacksCli }) => { process.exitCode = await runSkillpacksCli(['init', '--global', '--help']); })"` — passed and printed `init.sh --help` usage.
- `npm --workspace skillpacks run verify:package` — passed; dry-run tarball reported `skillpacks@0.1.1`, `skillpacks-0.1.1.tgz`, shasum `650d5ccfaf579a3f9a5bea083103c02b917dc2e4`, integrity `sha512-xmB6CwThLl48ykuZIurqaI12Pib1HI8koKrhrybQ5Yus12XSND23UyXSgyvP4Bv1XhT44EnR7SFMl3aEuyxPaQ==`, and 2,570 entries.
- `git diff --check` — passed.

## Skipped Tests

- A real `skillpacks init --global` install without `--help` was not run because it mutates user-home global skill roots under `~/.claude/skills` and `~/.codex/skills`. The changed CLI routing is covered by a fake-`bash` lifecycle test, a real `init.sh --help` route check, and the unchanged `init.sh` backend already used by `init-global`.
- No Skills Showcase deploy was run. `tasks/deploy.md` targets the Next.js Skills Showcase app, while this change only affects the npm CLI package and docs.

## Adversarial Review

Method: changed-file self-review plus targeted source/doc scans, backed by lifecycle and compatibility tests.

Findings checked:

- `init --global --help` must not pass `--global` through to `init.sh`; the lifecycle test asserts the fake `bash` receives only `init.sh` and `--help`.
- `init --bad` must not fall through to a shell-backed path; the lifecycle test asserts it errors and creates no project config.
- `init` must keep project-local base-skill behavior; the existing lifecycle test still passes and verifies local skill roots plus `base_skills: true`.
- CLI help and compatibility docs must stay aligned; the compatibility test reads the docs matrix and CLI usage block.

No unresolved review findings remain.

## Residual Risk

The only meaningful residual risk is in a real mutating user-home global install on a consumer machine. That path is intentionally unchanged and remains the same `init.sh` invocation used by `init-global`; current verification covers argument routing, help execution, package staging, and project-local non-regression without writing to the operator's home directory.

## Rollback Note

Revert the shipping commit to remove the alias, tests, and documentation updates. Existing `skillpacks init-global` behavior would remain available from the prior code path.

## Next Command

`npm login --registry https://registry.npmjs.org/ --cache /tmp/skillpacks-npm-cache` before any later explicit `skillpacks@0.1.1` publish attempt.
