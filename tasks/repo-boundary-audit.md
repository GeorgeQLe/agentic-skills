# Repository Boundary Audit

Date: 2026-06-12

## Executive Finding

Keep one repository for now. The evidence points to a deploy-boundary problem, not a repo-split requirement: most tracked files and recent churn are skill source or workflow evidence, while the Vercel-hosted Skills Showcase is a much smaller deploy surface under `apps/skills-showcase/` plus generated static mirrors under `docs/skills-showcase/`.

The immediate fix is path-based Vercel ignored-build gating. Repository splitting remains an escalation option only if deploy gating and commit-boundary discipline do not reduce operational pain.

## Tracked Ownership Zones

Counts from `git ls-files`:

| Zone | Tracked files | Paths |
|---|---:|---|
| Skill source | 2,984 | `packs/`, `global/` |
| Workflow evidence | 592 | `tasks/`, `prompts/`, `alignment/`, `research/`, `specs/` |
| Other repository docs/config/tests | 541 | root docs, scripts, tests, config, misc |
| Archive/hibernated work | 224 | any tracked `archive/` segment |
| Skills Showcase app/runtime | 106 | `apps/skills-showcase/` |
| Skillpack CLI/package | 19 | `packages/skillpacks/` |
| Showcase generated/static assets | 3 | `docs/skills-showcase/`, `docs/benchmark-results-matrix.md` |
| Total | 4,469 | all tracked files |

Notes:
- `apps/skills-showcase/public/assets/skills-data.js` and `apps/skills-showcase/public/assets/github-proof-data.js` are counted in the app/runtime zone because they live inside the app root, but they are generated deploy assets.
- `docs/skills-showcase/assets/` is a generated static mirror, not the primary app runtime.

## Recent Churn

Counts from `git log --since='14 days ago' --name-only` path mentions:

| Zone | Path mentions |
|---|---:|
| Skill source: `packs/` | 12,148 |
| Workflow evidence | 1,348 |
| Other repository docs/config/tests | 630 |
| Skill source: `global/` | 519 |
| Skills Showcase app/runtime | 274 |
| Archive/hibernated work | 199 |
| Showcase generated/static assets | 179 |
| Skillpack CLI/package | 84 |
| Total | 15,381 |

Most frequently changed paths in that window include:

| Path | Mentions |
|---|---:|
| `tasks/todo.md` | 210 |
| `tasks/roadmap.md` | 139 |
| `tasks/history.md` | 130 |
| `apps/skills-showcase/public/assets/github-proof-data.js` | 73 |
| `docs/skills-showcase/assets/github-proof-data.js` | 73 |
| `docs/skills-showcase/assets/skills-data.js` | 70 |
| `apps/skills-showcase/public/assets/skills-data.js` | 69 |
| `docs/benchmark-results-matrix.md` | 36 |

Interpretation: the repository has high activity because the skill catalog, generated alignment bundles, prompt history, task evidence, and showcase data all live together. That does not automatically require a split, but it does require a deploy gate that ignores non-showcase commits.

## Deploy Surface

Confirmed deploy-relevant paths:

- `apps/skills-showcase/**`: Next.js app, app-local generated assets, app docs, package scripts.
- `docs/skills-showcase/**`: generated static mirror assets consumed by showcase documentation.
- `docs/benchmark-results-matrix.md`: generated website-owned benchmark matrix.
- `package.json`, `pnpm-workspace.yaml`, root lockfiles if present: shared workspace dependency/build inputs.
- `vercel.json` or `apps/skills-showcase/vercel.json` if later added.
- `apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `scripts/vercel-ignore-build.sh` and its test harness, because they define the deploy decision.

Confirmed non-deploying paths by default:

- `packs/**` and `global/**` skill source changes, unless paired with regenerated showcase data.
- `packages/skillpacks/**` package/CLI changes, unless paired with showcase data or dependency-manifest changes.
- `tasks/**`, `prompts/**`, `alignment/**`, `research/**`, and `specs/**` workflow evidence.
- `archive/**` and nested skill `archive/**` snapshots.
- Generated local install roots such as `.codex/skills/**` and `.claude/skills/**`; these should remain untracked.

## Current Vercel Trigger Risk

Evidence:

- `tasks/deploy.md` defines the intended Vercel project root as `apps/skills-showcase/`.
- `find . -maxdepth 3 -name vercel.json -print` returned no repo-level Vercel config.
- `find .vercel -maxdepth 3 -type f -print` returned no local Vercel project metadata in this checkout.
- No `.github/` workflow files are present, and the project policy says GitHub Actions are not used.

Conclusion: deploy triggering is likely controlled by Vercel project settings and default Git integration behavior. A Vercel project root of `apps/skills-showcase/` controls build location; by itself it does not prove path-based commit filtering. Without an ignored-build command, commits that only touch skill source, prompts, task notes, alignment pages, or package code may still start Vercel builds.

## User Claims Validated

| Claim | Verdict | Evidence |
|---|---|---|
| The repo is a workspace with `apps/skills-showcase` and `packages/skillpacks`. | Confirmed | `package.json` and `pnpm-workspace.yaml` list both workspace paths; tracked files exist under both roots. |
| Recent churn is concentrated in `packs/`, with meaningful activity in `global/`, `tasks/`, `prompts/`, `alignment/`, and the showcase app. | Confirmed | 14-day path mentions: `packs/` 12,148; workflow evidence 1,348; `global/` 519; showcase app/runtime 274. |
| No repo-level `vercel.json` exists. | Confirmed | `find . -maxdepth 3 -name vercel.json -print` returned no paths. |
| `tasks/deploy.md` defines the intended Vercel project root as `apps/skills-showcase/`. | Confirmed | The deploy contract states “Project root / framework root: `apps/skills-showcase/`.” |
| The monorepo itself is the main pain. | Not supported yet | The evidence shows mixed concerns and deploy-trigger ambiguity, but not a structural failure requiring repo split. Try gating and artifact policy first. |
| Every source commit should deploy the Skills Showcase. | Not supported | Skill/package/evidence commits often do not affect app runtime or generated showcase data. Deploying them adds noise without changing production output. |

## Operating Model

- Ship source changes: commit and push the intended source/evidence boundary. This may be skill source, package code, docs, task records, or prompt history.
- Refresh generated showcase data: run the showcase generators when public skill catalog, benchmark, proof, or validation metadata changed; include generated assets in the same commit.
- Deploy the showcase: let Vercel build only when changed paths affect `apps/skills-showcase/`, `docs/skills-showcase/`, generated benchmark data, shared manifests, or deploy configuration.
- Record workflow evidence: keep required `tasks/`, `prompts/`, `alignment/`, `research/`, and `specs/` artifacts tracked when the workflow requires them, but treat them as non-deploying evidence.

## Cleanup And Commit Boundary Guidance

- Keep generated local install roots untracked: `.codex/skills/**` and `.claude/skills/**`.
- Do not mix unrelated skill-source, app-runtime, package, and workflow-evidence changes in one commit unless a ship manifest explicitly explains the boundary.
- If skill changes affect public showcase data, regenerate and commit the app/public and docs mirror assets together.
- If only task docs, prompt history, alignment pages, archives, or package internals changed, the Vercel ignored-build step should skip production builds.

## Escalation Options

Consider splitting only after the ignored-build gate has been installed in Vercel project settings and used for a few cycles:

- Split the Skills Showcase app if deploy gating still causes production noise or operational confusion.
- Split the Skillpacks CLI/package if package release cadence becomes independent enough that workspace coupling blocks shipping.
- Do not rewrite history for this cleanup; use forward-only boundary and deploy policy commits.
