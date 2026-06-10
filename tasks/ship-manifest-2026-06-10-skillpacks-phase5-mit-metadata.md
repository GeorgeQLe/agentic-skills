# Ship Manifest — Skillpacks Phase 5 MIT Metadata

Date: 2026-06-10

## User Goal

Continue the Skillpacks Phase 5 npm publish plan by fixing package metadata before publishing `skillpacks@0.1.0`.

## Changed Files

- `LICENSE`
- `docs/skillpacks-npm-distribution.md`
- `packages/skillpacks/package.json`
- `packages/skillpacks/scripts/build-package.mjs`
- `packages/skillpacks/test/compatibility.test.mjs`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-phase5-preflight-blocked.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-phase5-mit-metadata.md`

## Per-File Purpose

- `LICENSE`: add the MIT license text for the repository and npm package.
- `packages/skillpacks/package.json`: publish `skillpacks@0.1.0` with MIT license metadata and npm links to the GitHub repository.
- `packages/skillpacks/scripts/build-package.mjs`: copy `LICENSE`, require it in the staged build, and preserve npm link metadata in staged `package.json`.
- `packages/skillpacks/test/compatibility.test.mjs`: pin the public npm metadata contract.
- `packages/skillpacks/dist/skillpacks-manifest.json`: refresh the package metadata source fingerprint.
- `docs/skillpacks-npm-distribution.md`: document the MIT package shape and Phase 5 metadata check.
- `tasks/*`: record the prepublish metadata fix and validation evidence.

## Tests Run

- `npm whoami --registry https://registry.npmjs.org/ --cache /tmp/skillpacks-npm-cache` — returned `glexcorp`.
- `npm --workspace skillpacks run test:node` — passed 38/38 package tests.
- `npm --workspace skillpacks run build:check` — passed; manifest exact; staged 373 skills and 41 packs; package staging boundary passed.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack ./build --dry-run --json --silent` from `packages/skillpacks/` — passed; `skillpacks@0.1.0`, 2,349 files, 5,272,075 bytes packed, 31,323,992 bytes unpacked, shasum `9ab8925b5f8d3dc39f1caa9c50609fb8df6df1f2`, integrity `sha512-TyZFnm9HjaV8E0yTN1EPRuh1BZDWt/Hcn316omlXvAVhLFpWkP191BaKzw/wmCjRkEm14RF2WkWJ6XSlusDKHg==`.
- Tarball denied-path audit — passed; zero entries under `alignment/`, `tasks/`, `prompts/`, `apps/`, `tests/`, or `docs/history/`; `LICENSE` present.
- `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache` — returned expected `E404`, confirming `skillpacks@*` is still unpublished from this registry view before publish.
- `git diff --check` — passed.

## Skipped Tests

- `npm publish --access public` was intentionally not run before this metadata commit; Phase 5 publishes from the committed staged build after this boundary lands on `master`.
- Published-package `npx` and fresh temp-project npm install checks remain pending until after publication.

## Adversarial Review

- Confirmed `build/package.json` contains `license: "MIT"`, `repository`, `bugs`, `homepage`, and `LICENSE` in `files`.
- Confirmed package staging, not only source metadata, carries the public npm metadata.
- Confirmed the tarball still excludes task, prompt, alignment, app, test, and docs-history artifacts.

## Residual Risk

The real npm publish and post-publish install verification can still fail despite the clean local tarball. Those checks remain Phase 5 work after this source commit is pushed.

## Next Command

Commit and push this metadata boundary, then publish `skillpacks@0.1.0` from `packages/skillpacks/build` and verify the published package.
