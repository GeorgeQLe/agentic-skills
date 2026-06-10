# Ship Manifest — Skillpacks Phase 5 Publish

Date: 2026-06-10

## User Goal

Publish `skillpacks@0.1.0` to npm and verify the published package works from fresh projects without cloning this repository.

## Changed Files

- `docs/skillpacks-npm-distribution.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-phase5-publish.md`

## Per-File Purpose

- `docs/skillpacks-npm-distribution.md`: record the public npm publication status, metadata, tarball evidence, and verification summary.
- `tasks/todo.md`: close Phase 5 publish and verification steps with command evidence.
- `tasks/roadmap.md`: mark Phase 5 publish and published-package verification complete.
- `tasks/history.md`: add the durable Phase 5 publish history entry.
- `tasks/ship-manifest-2026-06-10-skillpacks-phase5-publish.md`: capture final release evidence and residual risk.

## Tests Run

- `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache` — returned `"0.1.0"`.
- `npm view skillpacks license repository.url repository.directory bugs.url homepage dist-tags.latest --json --cache /tmp/skillpacks-npm-cache` — returned MIT metadata, GitHub repository links, and `latest: 0.1.0`.
- `npm view skillpacks dist --json --cache /tmp/skillpacks-npm-cache` — returned integrity `sha512-TyZFnm9HjaV8E0yTN1EPRuh1BZDWt/Hcn316omlXvAVhLFpWkP191BaKzw/wmCjRkEm14RF2WkWJ6XSlusDKHg==`, shasum `9ab8925b5f8d3dc39f1caa9c50609fb8df6df1f2`, tarball `https://registry.npmjs.org/skillpacks/-/skillpacks-0.1.0.tgz`, file count 2,349, and unpacked size 31,323,992.
- `npx -y --package skillpacks@latest -- skillpacks list` from `/tmp` — passed and printed the active pack list.
- Fresh temp project `/tmp/skillpacks-verify-pack-Y3Hhzb`: `npx -y --package skillpacks@latest -- skillpacks install code-quality` — passed; `.agents/project.json` has `enabled_packs: ["code-quality"]`; Claude/Codex skill roots exist.
- Fresh temp project `/tmp/skillpacks-verify-skill-I5h6h3`: `npx -y --package skillpacks@latest -- skillpacks install quality-sweep` — passed; `.agents/project.json` has `enabled_skills: {"quality-sweep":"code-quality"}`; Claude/Codex `quality-sweep` roots exist.
- Fresh temp project `/tmp/skillpacks-verify-deck-02dJkx`: `npx -y --package skillpacks@latest -- skillpacks install-deck game-afps` — passed; `.agents/project.json` has `enabled_packs: ["game"]`; 11 Codex game skills installed, including `game-workflow` and `game-audience`.
- `npx -y --package skillpacks@latest -- skillpacks doctor` in the code-quality temp project — passed; four managed installs reported `ok`.
- `scripts/pack.sh list` from the git checkout — passed and printed the active pack list.
- `npm --workspace skillpacks run test:node` — passed 38/38 package tests after evidence docs were updated.
- `npm --workspace skillpacks run build:check` — passed; manifest exact; staged 373 skills and 41 packs.
- `git diff --check` — passed.

## Publish Notes

- Prepublish source commit `d53c3d2e` was pushed to `origin/master` before publication.
- Agent-run publish from `packages/skillpacks/build` reached npm but returned `EOTP`; the operation required a one-time password.
- A root-cwd retry produced npm's `Cannot read properties of null (reading 'prerelease')` bug because the repository root package is private workspace metadata and not the package publish root.
- The final OTP-backed publish completed from the staged build root, and registry checks confirm `skillpacks@0.1.0` is public.

## Skipped Tests

- No Skills Showcase build/deploy checks were run because this boundary changes npm release documentation only after the package was already published.
- No production deploy is applicable; this was an npm package release.

## Adversarial Review

- Confirmed registry metadata matches the intended MIT release boundary.
- Confirmed the registry tarball shasum and integrity match the prepublish dry-run evidence.
- Confirmed fresh project installs write project-local files from the npm package path, not from the repository checkout.
- Confirmed the legacy git-checkout path still lists active packs.
- Kept unrelated local work (`apps/skills-showcase/next-env.d.ts` and `prompts/user-flow-map/`) outside the evidence commit.

## Residual Risk

The public package is immutable at `0.1.0`; any packaging defect discovered later will require a new version. The verified install paths cover one pack, one skill, and one deck, not every pack.

## Next Command

Proceed to Phase 6 COA B/C readiness only after real usage or a concrete package-split requirement appears.
