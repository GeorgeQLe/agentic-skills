# Current Task State

## Current Implementation - Materialize Agentic Skills Three-Repo Split

Project: `agentic-skills`.

### Execution Profile

- Parallel mode: serial repo mutation, parallel read-only inspection where useful.
- Reason: this task moves repository boundaries and remotes; mutations must be staged, verified, and reversible.
- Safety boundary: do not create or modify GitHub Actions; do not discard current `agentic-skills` history; do not overwrite existing sibling directories; ask before creating GitHub repositories or moving the current checkout path.

### Proposed Local Layout

Recommended final layout:

```text
/Users/georgele/projects/tools/agentic-skills/
  skills/      -> https://github.com/GeorgeQLe/agentic-skills.git
  showcase/    -> https://github.com/GeorgeQLe/agentic-skills-showcase.git
  benchmarks/  -> https://github.com/GeorgeQLe/agentic-skills-benchmarks.git
```

Current reality:

- The existing checkout is `/Users/georgele/projects/tools/agentic-skills` and already points to `https://github.com/GeorgeQLe/agentic-skills.git`.
- The commit `ef4151b65` removed the Showcase app and benchmark harness/results from this repo.
- The removed source trees can be recovered from parent commit `b7c0775bc`.
- The sibling/local repos `agentic-skills-showcase` and `agentic-skills-benchmarks` are not present under `/Users/georgele/projects/tools`.

### Plan

- [x] Inspect current tree, docs, git status, and split commit history.
- [x] Capture this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [ ] Confirm the desired local directory layout and whether missing GitHub repos should be created if they do not already exist.
- [ ] Stage a temporary extraction from `b7c0775bc` for:
  - Showcase repo: `apps/skills-showcase/**` as repo root, plus relevant `docs/skills-showcase/**`, Showcase specs, and generated/static assets.
  - Benchmarks repo: `benchmark/**`, `tests/harness/**`, `tests/layer4/**`, benchmark-focused layer1/layer2 tests and docs/specs removed by `ef4151b65`.
- [ ] Create the local repo layout without overwriting existing work:
  - Move or clone current skills checkout into the approved `skills` path.
  - Initialize `showcase` and `benchmarks` from the extracted trees.
  - Configure `origin` remotes for all three repos.
- [ ] Normalize repo roots after extraction:
  - Showcase `package.json`/lockfile at repo root instead of `apps/skills-showcase/package.json`.
  - Benchmark tests/docs at repo root with package scripts that match the extracted harness.
  - README notes in each repo documenting the split boundary and how it consumes `agentic-skills` exports.
- [ ] Verify each repo:
  - `git status --short --branch`
  - `git remote -v`
  - `git ls-files` sanity checks for expected/forbidden path classes.
  - Lightweight package/test command only where dependencies are already available or installation is explicitly approved.
- [ ] Commit and push intended changes in each repo after verification, then update this repo's task docs with results.

### Acceptance Criteria

- Three independent local git repositories exist for `skills`, `showcase`, and `benchmarks`.
- The skills repo preserves the current `agentic-skills` history and remote.
- The Showcase repo contains the recovered app at its repo root and points to `GeorgeQLe/agentic-skills-showcase`.
- The benchmark repo contains the recovered benchmark harness/results at its repo root and points to `GeorgeQLe/agentic-skills-benchmarks`.
- No nested git repos are accidentally tracked by another repo.
- No unrelated files are removed from the current checkout.
- Each repo has a clean intended status or documented initial commit ready to push.

### Test Plan

- `git -C <repo> status --short --branch`
- `git -C <repo> remote -v`
- `git -C <repo> fsck --no-reflogs` after initializing/copying history when practical.
- `git -C <repo> ls-files | rg '<expected boundary checks>'`
- Showcase: `pnpm install --frozen-lockfile` and existing `pnpm test` / `pnpm build` only if dependency install is already available or explicitly approved.
- Benchmarks: package/harness focused tests after dependency state is established.
- Skills: existing catalog/export validation is not expected to change unless task-doc metadata is committed here.
