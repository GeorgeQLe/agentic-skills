# Session History

## 2026-05-01 — Research roadmap finds post-drift source change

- Ran `$research-roadmap` after the post-audit refresh and re-scanned the devtool documentation queue.
- Confirmed the devtool research chain is complete and no missing devtool research artifact remains.
- Found one strict freshness trigger: source commit `3e3bbf6` (`fix(skills): use local venv for youtube transcripts`, 2026-05-01 10:19:30 -0400) is newer than `specs/drift-report.md` (2026-04-30 14:02:55 -0400).
- Promoted `$spec-drift fix all` into `tasks/todo.md` as the next priority documentation item.

## 2026-05-01 — Post-audit research roadmap refresh

- Re-ran the `$research-roadmap` decision path after `research/devtool-docs-audit.md` completed the devtool default-flow research chain.
- Confirmed the current devtool documentation set is complete: user map, integration map, DX journey, adoption, positioning, monetization, and docs audit all exist.
- Confirmed the 2026-04-30 creator-media pack work is already shipped and recorded, and no additional priority documentation item needs promotion into `tasks/todo.md`.
- Marked the post-audit refresh acceptance criteria complete in `tasks/todo.md`; the Priority Documentation Todo queue is now explicitly empty.

## 2026-04-30 — Devtool docs audit research

- Created `research/devtool-docs-audit.md` as the final default-flow devtool research artifact for `agentic-skills`.
- Audited `README.md`, `docs/skills-reference.md`, `docs/packs.md`, `docs/operating-modes.md`, and the completed devtool research chain for quickstart clarity, examples, API/script reference, troubleshooting, migration paths, and proof artifacts.
- Found no P0 documentation blocker for a shell-comfortable user. Logged the highest-leverage improvements as README first-success quickstart, curated dogfood examples, central troubleshooting, compact script reference, team rollout checklist, and better surfacing of proof artifacts.
- Checked off `$devtool-docs-audit` in `tasks/todo.md`; the active Priority Documentation Todo queue is now complete, and the next planned step is a post-audit `$research-roadmap` refresh.

## 2026-04-30 — Devtool positioning research

- Created `research/devtool-positioning.md` for the `agentic-skills` devtool research chain.
- Positioned the repo against raw Claude/Codex usage, personal dotfiles, vendor-native instructions, prompt libraries, task runners, hosted agent platforms, and internal prompt frameworks.
- Captured workflow advantages, ecosystem fit, evidence-backed trust claims, switching costs, concise positioning, homepage-style copy, differentiated claims, taglines, and avoided positioning.
- Checked off `$devtool-positioning` in `tasks/todo.md`; `$devtool-monetization` is now unblocked.

## 2026-04-30 — Add creator-media YouTube strategy pack

- Upgraded global `youtube-audit` for both Claude and Codex from a transcript-only content critique into an evidence-first channel audit contract. It now requires full `yt-dlp` metadata, a venv-aware `youtube-transcript-api` import check, raw metadata/transcript persistence under `research/youtube/data/<slug>/`, and portfolio/performance fields: views, likes, comments, views/day, views/minute, top-video concentration, archetype, content role, packaging signals, and cleanup candidates.
- Added `packs/creator-media/` with `PACK.md` plus mirrored Claude/Codex skills: `youtube-channel-audit`, `youtube-portfolio`, `youtube-peer-benchmark`, `creator-positioning`, `content-programming`, `series-spec`, `product-led-media-map`, and `creator-metrics-review`.
- Registered `creator-media` in `scripts/pack.sh` aliases/project type handling, `README.md`, and `docs/skills-reference.md`. The docs name the intended validation target shapes: `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.
- Validation: `./scripts/skill-deps.sh --broken` passed; `./scripts/skill-versions.sh --missing` passed with 255 versioned skills; `bash -n scripts/pack.sh` passed; grep checks confirmed target use cases, raw-data paths, and performance fields are present.

## 2026-04-30 — Refresh documentation priority roadmap

- Ran `$research-roadmap` after Phase 11 closure. Classified this repository as a devtool-style skills/tooling project with canonical `research/`, `specs/`, and `tasks/` roots.
- Added `tasks/todo.md` § "Priority Documentation Todo" with three immediately actionable documentation items: missing `research/devtool-positioning.md`, blocked missing `research/devtool-monetization.md`, and `$spec-drift fix all` because implementation/docs changed on 2026-04-30 while canonical specs last changed on 2026-04-22.
- Marked the `/research-roadmap` queue item complete and preserved the user-authored `creator-media research pack` task as the next product workstream.

## 2026-04-30 — Make Codex `$run` approval implicit by default

- Updated `global/codex/run/SKILL.md` so `$run` presents the execution plan, updates `update_plan`, then proceeds by default. A `$run` invocation is now treated as implicit approval for the next planned step or scoped phase.
- Preserved explicit confirmation for separate safety decisions: destructive commands, production deploys, paid/external account actions, credential/secret handling beyond the project contract, execution-profile downgrades, blockers, and material scope changes.
- Updated Codex workflow documentation plus `$ship` and `$plan-phase` references so they no longer describe a normal `$run` approval gate.
- Added a lesson from session-history analysis: routine `$run` approval prompts are friction and should not be reintroduced.

## 2026-04-29 — Ship pre-spec planning skills and concept-brief integration

- Added 3 new global skills (concept-exploration, ui-interview, ux-variation) for both Claude and Codex, covering the pre-spec planning workflow: concept → ICP → journey → UX variation → UI spec → spec-interview → roadmap.
- Updated roadmap and research-roadmap skills (both CLIs) to add journey/UX/UI planning gates — user-facing specs now require journey-map, ux-variation, and ui-interview artifacts before entering the roadmap pipeline.
- Updated business-app pack skills (icp, competitive-analysis, journey-map) to integrate concept-brief as input source and prefer `research/{app}/concept-brief.md` when present.
- Updated canonical-workflow-report and codex-workflow docs to reflect the expanded entry path through concept-exploration and research skills.
- Fixed spec-interview heading format: added canonical section heading template (Overview, Goals, Non-Goals, etc.) to prevent numbered headings; renamed install-workflow-orchestration → provision-agentic-config across all references.
- Minor linter tweaks to spec-interview wording ("chosen experience plan").

## 2026-04-25 — Add Assumptions Manifest to spec-interview skill

- Analyzed full Claude/Codex session history (~8,120 + 3,401 records) to find cases where agent assumptions during plan-interview and spec-interview sessions caused downstream refactors or project restarts.
- Identified 5 recurring patterns: unprobed product-identity assumptions (bismarck v0.4 tool-vs-game → sunset), feature integration risk not surfaced (loadoutworks 3D breaking 2D builder → full rebuild), deployment readiness assumed (bismarck v0.4 deployment day disaster), data model assumptions causing phase rewrites (poke monorepo phase 4), and UX direction inferred from technical descriptions (sidebar nav, loading skeletons).
- Root cause: spec-interview skill lacked a structured step to surface and validate the agent's own assumptions before probing. The agent's mental model was invisible to the user.
- Added new **Step 2: Assumptions Manifest** to both Claude and Codex spec-interview skills. The agent must now compile a tagged assumption list (`[from spec]`, `[from codebase]`, `[from research]`, `[inferred]`) covering 6 mandatory categories (product identity, core experience, technical foundation, integration risk, UX direction, data model) and block the interview until the user reviews it.
- Spec output now includes an **Assumptions & Risks** appendix. Interview logs record the full manifest with user corrections.
- Updated all 4 skill files (2 repo canonical + 2 user-local via hardlinks). Validated with `skill-deps.sh --broken` and `skill-versions.sh --missing`.

## 2026-04-23 - Add global dogfood skill

- Added mirrored global `dogfood` skills for Codex and Claude. The skill derives operator-run product scenarios from specs, journey maps, user stories, task docs, and pack-specific research, then writes UAT-style instructions for a human operator rather than running the product itself.
- The workflow resolves project type from `.agents/project.json` or repo signals, loads business-app/devtool/game/generic evidence, infers active-use cadence, generates 3-7 concrete scenarios, and routes operator execution to `tasks/manual-todo.md` under `## Dogfood Operator Scenarios`.
- Added `research/dogfood-audit.md` as the canonical audit output with scenario matrix, evidence checklist, and operator result logs. Recurring dogfood obligations are routed to `tasks/recurring-todo.md` only when a cadence is useful.
- Registered `dogfood` in the global core README list and in both Claude/Codex `$skills` / `/skills` Evaluate mappings.
- Verified with `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, and an ASCII scan of both new skill files.

## 2026-04-22 — Create `research/devtool-adoption.md`

- The devtool research chain's adoption step (`tasks/todo.md:1020`) was the next unchecked item after `$devtool-dx-journey` shipped earlier today. `research/devtool-adoption.md` did not exist.
- Ran `$devtool-adoption` per `packs/devtool/claude/devtool-adoption/SKILL.md`. Produced `research/devtool-adoption.md` with the six required sections — adoption loops, examples, templates, community channels, proof artifacts, activation metrics — each anchored to concrete repo paths and cross-linked to the prior three research docs for continuity.
- Grounded honest-state findings: absence of `.github/`, `CONTRIBUTING.md`, and `CHANGELOG.md` confirmed by filesystem check; `tasks/history.md` functions as the de facto changelog (1,083 lines, near-daily cadence); no telemetry or community channels instrumented. Proposed three free/local activation signals (ship-cycles/week, user-authored-skill ratio, `tasks/lessons.md` growth) as honest metrics a maintainer could extract without adding network telemetry.
- Ticked `tasks/todo.md:1020` (`$devtool-adoption`). No code, script, or spec edits. Archive-first not required (new file). Next unblocked chain step: `$devtool-positioning` at `tasks/todo.md:1021`.

## 2026-04-22 — Create `research/devtool-dx-journey.md`

- The devtool research chain's dx-journey step (`tasks/todo.md:1019`) was the next unchecked item after `$devtool-integration-map` shipped earlier today. `research/devtool-dx-journey.md` did not exist.
- Created `research/devtool-dx-journey.md` grounded in this repo's actual developer experience rather than generic DX boilerplate: install from `install.sh` (two-layer global + project, intentional no-pack-global decision, symmetrical `--uninstall`, absent CLI-presence check); quickstart from `/pack` / `$pack` guided setup plus the explicit CLI-restart round-trip called out in `README.md:51` and `docs/packs.md:43`; first success as a `/run` or `$run` cycle that exercises plan-mode-first, ship-one-step, and `commit-and-push-by-feature` together; error recovery via `scripts/skill-deps.sh --broken`, `scripts/skill-versions.sh --missing`, `pack.sh refresh` + CLI restart, `$spec-drift`, `$reconcile-dev-docs`, plus the honest gaps (no rollback, no skill-behavior harness, no hot reload); production adoption as the ship-one-step loop on `master` with dated `tasks/history.md` entries as the live changelog and archive-first as manual discipline; team rollout covering the commit-`.agents/project.json`-and-regenerate contract, shared checkout-path standardization, per-developer mode override, 2x mirror tax, restart chore compounding, and the fork-as-registry pattern; retention via plan-mode-first muscle memory, ship-one-step as the unit of progress, tasks-as-docs, the `tasks/lessons.md` self-improvement loop, gradual hybrid adoption, and `create-skill` + `pack promote` turning the library into a personal dotfile — plus honest anti-retention signals (restart chore, silent mirror rot, terminology cliff, long operating-modes doc, no version pin).
- All seven required sections present per `packs/devtool/claude/devtool-dx-journey/SKILL.md`: Install, Quickstart, First success, Error recovery, Production adoption, Team rollout, Retention.
- Cross-linked continuity with `research/devtool-user-map.md` (audience) and `research/devtool-integration-map.md` (setup mechanics and migration risks), reusing their anchors instead of re-deriving friction points.
- Archive-first not required — new file, no existing canonical doc replaced.
- Marked `$devtool-dx-journey` complete in `tasks/todo.md:1019`. Unblocks `$devtool-adoption` at `tasks/todo.md:1020`.

## 2026-04-22 — Create `research/devtool-integration-map.md`

- The devtool research chain's integration-map step (`tasks/todo.md:1018`) was the next unchecked item after `$devtool-user-map` shipped earlier today. `research/devtool-integration-map.md` did not exist.
- Created `research/devtool-integration-map.md` grounded in this repo's observable integration surface rather than generic devtool boilerplate: required integrations from `install.sh`, `scripts/pack.sh`, and `scripts/agent-mode.sh` (bash, git, symlinks, Claude Code and/or Codex CLI, writable `$HOME`, `.agents/project.json`); ecosystem assumptions from the two-CLI-only install path, local-first execution, `main`/`master` default, and the explicit `No GitHub Actions` rule in `CLAUDE.md`; setup path as clone → `./install.sh` → `scripts/pack.sh install <pack>` → optional `set-mode` → CLI restart; compatibility constraints naming WSL requirement, synced-filesystem fragility, checkout-path coupling, dual-CLI parity by convention only, and Claude-only `/delegate`; migration risks covering vendor concentration, 2x mirror maintenance tax, no rollback tooling, manual archive-first discipline, approval-packet schema drift, and absent skill-behavior test harness.
- All five required sections present per `packs/devtool/claude/devtool-integration-map/SKILL.md`: Required integrations, Ecosystem assumptions, Setup path, Compatibility constraints, Migration risks.
- Cross-linked continuity with `research/devtool-user-map.md` for audience framing and reused its "Adoption blockers" entries as migration-risk evidence rather than re-deriving them.
- Archive-first not required — new file, no existing canonical doc replaced.
- Marked `$devtool-integration-map` complete in `tasks/todo.md:1018`. Unblocks `$devtool-dx-journey` at `tasks/todo.md:1019`.

## 2026-04-22 — Create `research/devtool-user-map.md`

- The devtool research chain (`tasks/todo.md:1017–1023`) was blocked because the canonical `research/devtool-user-map.md` did not exist. `research/` directory was also absent on disk.
- Created `research/devtool-user-map.md` grounded in this repo's own observable signals rather than generic devtool boilerplate: audience from `README.md` (solo builders, embedded contributors, hybrid-mode orchestrators), economic buyers from upstream CLI dependencies (Claude Max / Codex subscriptions), maintainers from `CLAUDE.md` + `tasks/history.md` cadence, operators from `scripts/pack.sh` surfaces, and adoption blockers from real friction (dual Claude/Codex maintenance tax, symlink install + CLI restart requirement, long `docs/operating-modes.md`, absent `CONTRIBUTING.md`, asymmetric `/delegate`, no skill-contract test harness under the explicit `No GitHub Actions` rule).
- All seven required sections present per `packs/devtool/claude/devtool-user-map/SKILL.md`: Developer users, Economic buyers, Champions, Maintainers, Operators, Use cases, Adoption blockers.
- Archive-first not required — new file, no existing canonical doc replaced.
- Marked `$devtool-user-map` complete in `tasks/todo.md:1017`. Unblocks `$devtool-integration-map` at `tasks/todo.md:1018`.

## 2026-04-22 — Document `pack.sh list-packs` as internal Codex `$run` subcommand

- `scripts/pack.sh list-packs` is advertised in the script's own `--help` (`scripts/pack.sh:19`) and dispatched at `scripts/pack.sh:358`, but neither `README.md` nor `docs/skills-reference.md` mentioned it. The only external consumer is `global/codex/run/SKILL.md`. Users reading the reference docs could not distinguish it from the human-facing `list`.
- Added a short annotation paragraph after the pack-commands block in `docs/skills-reference.md` § "Project Pack Commands" describing `list-packs` as an internal subcommand used by Codex `$run` routing: prints enabled packs from `.agents/project.json` one per line with no decoration, distinct from `list`. Points interactive users to `list` or `status`.
- Mirrored the annotation in `README.md` § "Project Packs" directly below the pack-commands block, pointing `$run`-internal readers at `global/codex/run/SKILL.md`.
- Did not add `list-packs` to the bash code blocks themselves; those continue to advertise only the human-facing subcommands.
- Marked `$reconcile-dev-docs fix pack-command docs` complete in `tasks/todo.md:1016`.

## 2026-04-22 — Document Claude-only `delegate` in skills reference

- `global/claude/delegate/SKILL.md` exists and is central to live Claude→Codex hybrid-mode delegation, but neither `README.md` nor `docs/skills-reference.md` mentioned it. `grep -in delegate` on both files returned nothing, so a Codex user scanning the reference docs could reasonably expect a symmetric `$delegate` that does not exist (no `global/codex/delegate/` directory).
- Added a "Claude-only Global Skills" subsection to `docs/skills-reference.md` under the global-core table, with a single-row table marking `delegate` as Claude-only and a short blurb positioning it as the synchronous sibling of `/handoff --target=codex` (hybrid-only, falls cleanly into pre-start-failure if `codex` is missing). Cross-linked `global/claude/delegate/SKILL.md` and `docs/operating-modes.md`.
- Mirrored the asymmetry in `README.md` § "Global Core" with a "Claude-only global skills" subsection that names `delegate`, explains the hybrid-only invariant, and redirects Codex users to `/handoff --target=codex` for the async variant.
- Kept the existing bilateral global-skill listings untouched so the rest of the reference still describes only symmetric skills.
- Marked `$reconcile-dev-docs fix skills-reference` complete in `tasks/todo.md:1015`.

## 2026-04-22 — Banner legacy `kanban.mjs` specs

- Five `specs/kanban-*.md` files (`board-flag-kanban-search.md`, `kanban-multi-user.md`, `kanban-production-test-plan.md`, `kanban-command-test-coverage.md`, `kanban-offline-queue-soft-delete.md`) still described `kanban.mjs` as the primary kanban entry point. Active path is `poketo kanban` (headless HTTP); `kanban.mjs` is fallback/admin-only per `specs/poketo-headless-auth-migration.md:164,306`.
- Added a 3-line `> Status:` blockquote banner directly under each spec's H1, identifying it as targeting the legacy `kanban.mjs` fallback path and pointing readers to `specs/poketo-headless-auth-migration.md` for the active path. Technical bodies left untouched (still valid for the fallback path and historical reference).
- `specs/poketo-headless-auth-migration.md` already declared the legacy/active split; no edit needed.
- Marked `$spec-drift fix kanban legacy specs` complete in `tasks/todo.md:1014`.

## 2026-04-22 — Refresh stale canonical workflow report

- `docs/canonical-workflow-report.md` (dated 2026-04-19) still said Phase 11 Steps 7–11 were "planned but not fully wired" and listed Phase 11 Step 7 as "active planning work", but Phase 11 completed 2026-04-19 per `tasks/roadmap.md:25,33`.
- Chose in-place refresh over demote-and-snapshot: the drift was localized to the scope line and the "Current Gaps And Active Work" section, so a light edit was sufficient and preserved the document's otherwise-still-accurate body.
- Updated `docs/canonical-workflow-report.md:3–4` to reflect Phase 11 completion and point readers at `docs/operating-modes.md` as the authoritative operating-model reference. Added a "(refreshed 2026-04-22)" date annotation.
- Rewrote `docs/canonical-workflow-report.md:484–494` to list Steps 7–11 as shipped and redirect remaining drift/follow-up questions to `tasks/todo.md` + `tasks/history.md`. Dropped the stale "`docs/operating-modes.md` still says no skill consumes the mode signal" note, which Step 11 has since resolved.
- Marked `$spec-drift fix docs/canonical-workflow-report.md` complete in `tasks/todo.md:1013`. `grep -n "Phase 11 Step 7\|not fully wired\|active planning work" docs/canonical-workflow-report.md` now returns nothing.

## 2026-04-22 — Tighten guide routing for task-doc reconciliation

- Root cause: roadmap and ship next-step routing treated any "manual" or `tasks/manual-todo.md` cleanup as `/guide`-eligible. That introduced a bad downstream handoff in `lexcorp-war-room` (`$guide reconcile manual-todo`) even though the guide skill correctly targets GUI/service-console work.
- Updated Claude and Codex `roadmap`, `ship`, `ship-end`, `plan-phase`, and `run` skills to distinguish external manual work (DNS/OAuth/service dashboards/auth/production smoke checks) from task-doc bookkeeping.
- Added explicit routing for stale `tasks/manual-todo.md` cleanup and task ledger reconciliation to `/reconcile-dev-docs fix tasks` / `$reconcile-dev-docs fix tasks` or a direct dev-doc audit.
- Hardened Claude and Codex `guide` skills to reject requests like "reconcile manual-todo", "audit stale manual tasks", and "check off completed todo items" instead of producing a guide.
- Decision: no new skill needed; `reconcile-dev-docs` already owns the gap. The fix was routing language and a clearer guide non-goal.

## 2026-04-22 — Reconcile kanban-archive docs with `poketo-kanban --archive`

- `tasks/roadmap.md` (Phase 4 overview row, step 2 heading, milestone bullet) and `specs/poketo-headless-auth-migration.md:66` still described `/kanban-archive` as a standalone skill; the standalone skill was merged into `poketo-kanban --archive` (see `tasks/history.md` Phase 4 entry; ground truth in `packs/poketowork-kanban/{claude,codex}/poketo-kanban/SKILL.md:103`).
- Rewrote `tasks/roadmap.md:18` (overview row) and `tasks/roadmap.md:155–162` (step 2 heading + milestone) to describe archive mode on `poketo-kanban`, preserving the `[x]` complete state and adding a brief note about the standalone→merged history.
- Annotated `specs/poketo-headless-auth-migration.md:66` with `(merged into `poketo-kanban --archive`; path no longer present)` rather than removing the archival migration row.
- Left archival files (`tasks/history.md` prior entries, `docs/phases/phase-4.md`, `docs/phases/kanban-validation.md`) frozen per the same archive-first principle used in the previous two drift fixes.
- Marked `$spec-drift fix kanban archive docs` complete in `tasks/todo.md`. `grep -rn "kanban-archive" tasks/roadmap.md specs/poketo-headless-auth-migration.md` now shows only annotated historical references, no prose implying a standalone skill.

## 2026-04-22 — Reconcile `code-quality` pack docs with shipped skills

- `README.md` and `specs/code-quality-skill-pack.md` still described `code-quality` as a single-skill pack (only `extract-shared-types`); the pack has also shipped `quality-sweep` since commit `975c823` (2026-04-16).
- Updated `README.md:149` to list both skills and summarize `quality-sweep`. Rewrote `specs/code-quality-skill-pack.md` summary, folder layout, naming, skill specifications (adding a `quality-sweep` subsection mirroring `packs/code-quality/{claude,codex}/quality-sweep/SKILL.md`), implementation notes, and acceptance criteria to cover both skills.
- Mirrored behavior from the shipped `SKILL.md` files rather than inventing it: audit/fix/full modes, eight audit lanes, triage buckets, subagent policy, non-goals around behavior/public-API/error-handling preservation.
- Marked `$spec-drift fix code-quality docs` complete in `tasks/todo.md`. Archival references in `tasks/history.md`, `tasks/todo.md` historical notes, and `specs/drift-report.md` are intentionally left as-is.

## 2026-04-22 — Fix approval-packet section anchors

- Phase 11 renamed the operating-modes doc heading from `## Approval / Delegation Packet` to `## Approval packet`; three in-repo references still pointed at the old anchor.
- Updated `tasks/approved-plan.md:3`, `scripts/approved-plan.sh:213` (heredoc template for generated mirrors), and `global/codex/run/SKILL.md:144` to the new anchor.
- Marked `$spec-drift fix approval-packet references` complete in `tasks/todo.md`. Remaining `Approval / Delegation Packet` hits in `tasks/todo.md`, `tasks/history.md`, and `specs/drift-report.md` are archival/historical and intentionally preserved.

## 2026-04-22 — Harden `/run` agent-team dispatch against stale step prose

- Fixed a real blocker hit in a downstream repo (Pitwall) where `/run` correctly identified an `agent-team` profile but stopped because the Step 5.1 body still contained legacy advisory text (*"do not implement… through a single /run"*, *"use /delegate"*) from before the auto-dispatch feature (commit `de3d506`) shipped.
- Updated `global/claude/run/SKILL.md` § "Execution Profile Handling": the `agent-team` bullet now explicitly says do **not** stop for legacy advisory prose in the phase/step body — trust the `### Execution Profile` metadata (post-`/patch-exec-profile`) and only stop if lane specs cannot be resolved. Added a Next-Step Routing rule: don't recommend `/delegate` as a workaround for agent-team.
- Captured the pattern in `tasks/lessons.md` (2026-04-22 entry) so a future `/run` in a repo with stale step prose won't repeat the mistake.

## 2026-04-20 — Add `create-skill` global skill

- Added `create-skill` to `global/claude` and `global/codex` as a meta-skill that scaffolds new **user-local** skills directly into `~/.claude/skills/<name>/` and `~/.codex/skills/<name>/` as real directories (never inside the agentic-skills repo).
- The skill refuses to shadow repo-managed symlinks, mirrors to both assistants on request, and closes by offering to **promote** the scaffolded skill into a user's personal fork of agentic-skills (copy only — commit/push left to the user).
- Documented the upstream-safety model: plain clones cannot push to the shared repo, forks push only to the user's own remote, and the skill never writes into this repo's `global/` or `packs/` trees.
- Registered `create-skill` in the README global-core list and installed symlinks via `install.sh`.

## 2026-04-20 - Fix scale-audit next-step drift

- Aligned Claude and Codex `packs/business-app/*/scale-audit` guidance with `docs/skill-next-step-contracts.md`.
- Replaced unconditional roadmap-first next steps with state-based recommendations: `spec-interview [top blocker]` when enterprise hard blockers lack full specs, missing context skills when required inputs are absent, and `roadmap` only when blockers are already specced or tracked.
- Added `specs/drift-report.md` for the fix-mode audit trail and marked the `$spec-drift fix packs/business-app/*/scale-audit` priority item complete in `tasks/todo.md`.

## 2026-04-20 - Reconcile Phase 11 task docs

- Resolved the Phase 11 task-doc contradiction where `tasks/todo.md` still contained unchecked archived acceptance criteria even though `tasks/roadmap.md`, `tasks/history.md`, and `tasks/verify-phase-11.md` all recorded Phase 11 as complete.
- Checked the Phase 11 top-level acceptance criteria and archived Step 4 through Step 11 / Verify acceptance checklists in `tasks/todo.md`, leaving the active Priority Documentation Todo queue as the only unchecked task surface.
- Added `tasks/reconciliation-report.md` with resolved, deferred, and remaining findings, and marked `$reconcile-dev-docs fix tasks` complete in the queue.

## 2026-04-20 — Move `mvp-gap` to research outputs

- Reclassified Claude and Codex `mvp-gap` as a research skill and changed its canonical output from `specs/mvp-gap.md` to `research/mvp-gap.md` (app-scoped: `research/{app}/mvp-gap.md`).
- Updated `mvp-gap` next-step guidance so the primary follow-up is `spec-interview [top gap]` whenever the audit finds an unspecced priority gap; `roadmap` is primary only after priority gaps already have specs.
- Updated dependent readers (`brainstorm`, `competitive-analysis`, `scale-audit`, and `research-roadmap`) to look for `research/mvp-gap.md` instead of treating the audit as an implementation spec.

## 2026-04-20 — Audit skill next-step contracts

- Audited all 205 `SKILL.md` files under `global/` and `packs/` for command-style next-step references and semantic next-step validity across expected end states.
- Added `docs/skill-next-step-contracts.md` as the canonical contract for valid recommendations, covering universal rules, expected end-state families, and multi-state rules for research and planning skills.
- Fixed concept-validation `competitive-analysis` next steps so `Proceed to ICP`, `Pivot concept`, and `Abandon` each have a valid recommendation path.
- Fixed `experiment` next-step guidance so a newly designed experiment recommends running the experiment, while validated/invalidated/inconclusive outcomes live under `## Decision Rules`.
- Fixed `reconcile-research` next-step logic for fully resolved and no-work end states.
- Added guardrail wording to downstream-impact-aware skills so `reconcile-research` and stale annotations are selected only after the proposed output has an actual `None`/`Minor`/`Major` impact classification.
- Updated `docs/skills-reference.md` to point readers to the next-step contract.

## 2026-04-19 — Phase 11 Step 13 — Close the two `jq`-dependency gaps

- Closed the two non-blocking `jq`-dependency gaps logged in `docs/operating-modes.md` § "Gaps surfaced by Step 8". Both were documentary — runtime behavior already clean via `scripts/approved-plan.sh:21` `require_jq_write`, which dies with `ERROR: jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).` on every write subcommand.
- **Gap 1 — `handoff --target=codex`.** Added a `jq`-required note to step 5's preamble in `global/claude/handoff/SKILL.md`. Covers 5.4 (`draft`) and 5.5 (pretty-print) — `draft` dies first via `require_jq_write`, so users never reach 5.5 when `jq` is absent.
- **Gap 2 — `codex/run --execute-approved`.** Strengthened step 6c of `global/codex/run/SKILL.md` to spell out the exact `require_jq_write` error text users see. § "Constraints" byte-preserved.
- **Audit cleanup.** Both `⚠ gap — follow-up` cells in `docs/operating-modes.md`'s audit table updated to cite the new skill-side declarations (zero cells remain). Open gap bullets replaced with a dated resolution line + strikethrough of the originals, preserving the audit trail.
- Decision: declare, don't fallback. `jq` is trivially installable; a `jq`-free parser would duplicate 30+ lines of JSON handling for no benefit.
- Contract untouched: no edits to `scripts/approved-plan.sh`, `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/pack.sh`, `CLAUDE.md`, any other `SKILL.md`, or any pack file.
- Verified: zero `⚠ gap — follow-up` cells in the audit table; new `jq`-required sentences present in both SKILL.md files; `bash -n scripts/approved-plan.sh` still parses.
- Checked off Step 13 in `tasks/todo.md`, appended a Step 13 Summary, and updated `tasks/roadmap.md` Phase 11 section with a Step 13 tail addendum (phase retains ✓).

## 2026-04-19 — Phase 11 Step 12 — Gap fixes from Verify

- Closed the two non-blocking gaps Phase 11 Verify surfaced (`tasks/verify-phase-11.md` § "Gaps surfaced by Verify"). Tail micro-step of Phase 11; no mechanism redesign, just guard parity + doc clarification.
- **Gap 1 — source-state guard on `mark-stale`.** Added a guard block to `scripts/approved-plan.sh cmd_mark_stale` mirroring the proven `cmd_mark_uncertain` pattern. Only `approved` now transitions to `stale`; `draft`, `consumed`, `stale`, `superseded`, and `uncertain` each exit non-zero with `cannot mark-stale: lifecycle=<state> (only 'approved' may transition to 'stale')`. Retroactive rewrites of terminal history (e.g. `consumed → stale`, which Verify authoring hit by accident) are no longer possible. Uses `fail` (not `die`) for consistency with the sibling `mark-uncertain` rejection phrasing.
- **Gap 2 — hybrid back-to-back mirror-commit prerequisite.** Added one row to `docs/operating-modes.md` § "Degraded-path audit" documenting that after a `consume` rewrites `tasks/approved-plan.md`, the next `draft` fails with `dirty path outside allowlist: tasks/approved-plan.md` unless the mirror is committed or `--allow-dirty tasks/approved-plan.md` is passed. Added a one-line in-context note to `global/claude/delegate/SKILL.md` step 2's `--allow-dirty` discussion so `/delegate` invokers see it without opening the audit.
- Contract untouched: no edits to `specs/approved-plan.schema.json` (enum already had all five states — this is a pure runtime guard), `scripts/agent-mode.sh`, `scripts/pack.sh`, `CLAUDE.md`, any other `SKILL.md`, or any pack file. Codex side (`global/codex/**`) untouched — `mark-stale` is Claude-side tooling per Step 6 design.
- Verified with fixture packets under `/tmp/apkstale12/`, mirroring Step 6's approach (`tasks/history.md:73`, `/tmp/apktest6/`). Six cases: happy path (`approved → stale`, `ok` exit 0, atomic flip) + rejection for each of `draft`, `consumed`, `stale`, `superseded`, `uncertain` (exit 1, expected reason, packet unchanged). Doc edits verified by grep of the new audit row + the new `--allow-dirty` sentence.
- Checked off Step 12 in `tasks/todo.md`, appended a Step 12 Summary + archived Active Step Plan, and updated `tasks/roadmap.md` Phase 11 section with a Step 12 tail addendum (phase retains ✓).

## 2026-04-19 — Phase 11 Verify — Three-mode sample-workflow walkthrough

- Exercised every Phase 11 mode + packet mechanism end-to-end under each of the three operating modes (`claude-only`, `codex-only`, `hybrid`) plus two degraded-path spot checks. Created `tasks/verify-phase-11.md` (committed) with live shell output for every `scripts/agent-mode.sh` and `scripts/approved-plan.sh` invocation, quoted recommendation copy from the Step 7 `global/{claude,codex}/run/SKILL.md` "Mode-aware next-step recommendation" blocks, and anchor-level cross-references to `docs/operating-modes.md` §§ "Mode-signal resolution", "Approval packet — Lifecycle / Safety classification / Freshness checks", and "Degraded-path audit".
- `claude-only` + `codex-only`: resolver emits the correct mode; `.agents/` directory never materializes; no packet written across either run. Each mode's terminal skill emits exactly one in-mode recommendation line (never crosses to the unavailable CLI).
- `hybrid`: drove the full `draft → approved → consumed` packet lifecycle via `scripts/approved-plan.sh draft → approve → check → consume`. Captured `status` at every transition. The regenerated `tasks/approved-plan.md` mirror correctly excludes JSON-only fields (`allowed_dirty_paths`, `notes`) per the Step 3 safety classification.
- Spot check (a): `/delegate` mode-mismatch contract verified by quoting three independent declarations in `global/claude/delegate/SKILL.md` (lines 17, 25, 70) — non-zero exit with `mode-mismatch:` reason, no packet mutation. Consistent with the observed absence of `.agents/` under the `claude-only` resolver run.
- Spot check (b): drafted a packet with `--ttl 1`, approved, slept 3s; `check` returned non-zero with `stale: TTL expired (age=3s, ttl=1s)` and `mark-stale` flipped the lifecycle atomically — confirming the TTL freshness check from Step 4.
- Commit policy decision: no "fake work" commits on `master`. The walkthrough exercised the machinery directly; no external task existed for skills to mutate. Only bookkeeping commits land (evidence file + task doc updates).
- Gaps surfaced (non-blocking, logged under `### Gaps surfaced by Verify` in `tasks/verify-phase-11.md`): (1) `mark-stale` accepted a `consumed` source state during spot-check authoring, unlike `mark-uncertain` which explicitly rejects all non-`approved` sources — a follow-up should align the source-state guard; (2) back-to-back hybrid cycles require committing `tasks/approved-plan.md` between runs (otherwise the next `draft` sees a dirty tree) — expected UX, but not documented as a hybrid-flow prerequisite in the degraded-path audit.
- Contract untouched: no edits to any `SKILL.md`, `scripts/*.sh`, `specs/approved-plan.schema.json`, `docs/operating-modes.md`, `CLAUDE.md`, or any pack file. Verify is empirical per plan; findings get logged, not fixed in this micro-step.
- Checked off the final Phase 11 Verify item in `tasks/todo.md`, appended a Verify Summary, archived the Active Step Plan, and added a Phase 11 ✓ section to `tasks/roadmap.md` (previously absent — Phase 11 lived only in `todo.md`/`history.md`). **Phase 11 is complete: all 11 steps + Verify shipped.**

## 2026-04-19 — Phase 11 Step 11 — `docs/operating-modes.md` as authoritative reference

- Expanded `docs/operating-modes.md` from a 200-line thin doc + appended audit tables into a ~280-line authoritative reference. Added `## Mode-signal resolution` (env > `.agents/project.json` > unset precedence truth table, writer citation at `pack.sh set-mode`, unset semantics, and the "do not restate precedence in skill copy" invariant). Reorganized `## Approval packet` into four subsections — Fields (citing `specs/approved-plan.schema.json` as the authoritative contract rather than duplicating it), Lifecycle (ASCII diagram + transitions-to-writers table mapping `draft`/`approve`/`consume`/`mark-stale`/`supersede`/`mark-uncertain` to their lifecycle edges), Safety classification (`.md`-safe vs JSON-only, projection enforced by `consume`), and Freshness checks (the six `check` tests in cheapest-first order).
- Preserved Step 8 (`## Degraded-path audit`, 19 rows + Gaps subsection), Step 9 (`## Pack emphasis`, 34 global skill rows + 8 pack rows), and Step 10 (`### Codex $run routing`) tables byte-identically. Verified by diffing the section from `HEAD:docs/operating-modes.md` — only the trailing status line differed (by design, see below).
- Added `## Migrating from the parity-mirror model` — ~25 lines of pointer-level orientation covering `pack.sh set-mode` for declaring mode, the pack emphasis tables for role-based pack selection, `/delegate` as the in-session hybrid execution path replacing manual CLI switching, `/handoff --target=codex` for async handoffs, and the deliberate "unset is a mode too" semantics that leaves skills presenting all three options. No tutorial depth — skills already document their own workflows, this section just names the entry points.
- Replaced the trailing `Status: Phase 11 Step 1 — thin doc … Step 10 …` incremental line with a single `Phase 11 Steps 1–11 complete: authoritative operating-model reference.` Opened `## Gaps surfaced by Step 11` and explicitly closed it with "None" — no new spec-level gaps found during the docs pass.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `scripts/pack.sh`, any `SKILL.md` (global or pack), any pack wrapper, `CLAUDE.md`, or `tasks/roadmap.md`. Only `docs/operating-modes.md`, `tasks/todo.md`, and `tasks/history.md` touched — matches Step 11's docs-only scope.
- Verification: `git diff HEAD docs/operating-modes.md` shows tables under `## Degraded-path audit` and `## Pack emphasis` are byte-identical in content; the new `## Mode-signal resolution` precedence matches `scripts/agent-mode.sh` behavior (env > file > unset, invalid value in either source exits non-zero); every lifecycle-diagram edge maps to a real `approved-plan.sh` subcommand and every subcommand appears in the diagram; migration guide cites `pack.sh set-mode`, `/delegate`, `/handoff --target=codex`, `$run --execute-approved` by name without re-describing their internals.
- Checked off Step 11 in `tasks/todo.md`, added a Step 11 Summary, and archived the Step 11 Active Step Plan in place. The Phase 11 final **Verify** acceptance item (three-mode sample-workflow walkthrough) rolled to its own deferred micro-step — it requires a real workflow run, not a docs task.

## 2026-04-19 — Phase 11 Step 10 — Pack-aware `$run` routing on Codex

- Extended `global/codex/run/SKILL.md` § "Mode-aware next-step recommendation" with a new `### Pack-aware routing` subsection. Resolver order: (a) resolve agent mode via `./scripts/agent-mode.sh` (Step 7, unchanged), (b) resolve enabled packs via `./scripts/pack.sh list-packs`, (c) when the recommendation would emit `$run` / `$ship` / `$ship-end`, check whether any enabled pack ships a matching `-kanban` variant under `packs/<pack>/codex/` and emit the kanban invocation if so; otherwise emit the global default. Candidate packs cited inline: `business-app-kanban`, `devtool-kanban`, `game-kanban`, `poketowork-kanban` — all tagged `Both` in Step 9's Packs table, the load-bearing citation.
- Added `list-packs` subcommand to `scripts/pack.sh` (one newline-separated enabled-pack name per line, no decoration) that reuses the existing `read_enabled_packs` function — no duplicated JSON parsing. Silent on missing or malformed `.agents/project.json` (exit 0, empty output), matching the plan's degraded-path contract. Usage help updated.
- Documented the degraded path explicitly in the SKILL.md subsection: missing or malformed `.agents/project.json` (or non-zero exit from `list-packs`) → silent fallback to the global-default recommendation with a single inline comment `pack-lookup: skipped (no project.json)` appended to the recommendation line. Ambiguity (two enabled packs ship the same `-kanban` variant) → recommend the first in `enabled_packs` order and note the tie inline, never prompt. Scope fenced: recommendation-text routing only — `$run --execute-approved` still consumes `.agents/approved-plan.json` verbatim regardless of pack routing.
- Added a short `### Codex `$run` routing` subsection under `## Pack emphasis` in `docs/operating-modes.md` (above the closing `---` status line) that names the resolver and points at `global/codex/run/SKILL.md` § "Pack-aware routing" for the full behavior. Status line updated to mention Step 10.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `global/claude/run/SKILL.md` (Claude-side pack routing deferred to Step 11+), any other skill's workflow, any pack skill, or the Step 8 degraded-path audit / Step 9 pack emphasis tables.
- Verified `list-packs` against three cases: no `.agents/project.json` → empty output, exit 0; `enabled_packs: ["business-app-kanban"]` → emits `business-app-kanban`; malformed JSON → empty output, exit 0 (silent degraded path, consistent with SKILL.md subsection's documented fallback).
- Checked off Step 10 in `tasks/todo.md`, appended a Step 10 Summary, and rolled the Active Step Plan to Step 11 (authoritative `docs/operating-modes.md` expansion — sketch). Step 10's prior Active Step Plan is archived in place for reference.

## 2026-04-19 — Phase 11 Step 9 — Pack emphasis split by CLI role

- Appended `## Pack emphasis` to `docs/operating-modes.md` with two authoritative tables. **Global skills** (34 rows — one per unique skill name across `global/claude/` + `global/codex/`) tags every skill with a single primary role: `Claude-orchestration` (framing, interviews, strategy, research synthesis), `Codex-execution` (implementation, reconciliation, validation, shipping), or `Both` (genuinely spans). **Packs** (8 rows — one per directory under `packs/`) tags each pack with the same three-value role, noting inheritance where kanban variants inherit from a base pack.
- Every skill row verified against the skill's `SKILL.md` `description` frontmatter field. Starting hypothesis from the plan was re-checked, not rubber-stamped. "Both" rows (`branch-lifecycle`, `handoff`, `hygiene`, `migrate`, `pack`, `run`) each carry an inline rationale — no default-assignments.
- Pack distribution: base packs (`business-app`, `devtool`, `game`) are all Claude-orchestration (strategy/framing/research skills); `code-quality` is Codex-execution (behavior-preserving refactor mutation); kanban variants (`business-app-kanban`, `devtool-kanban`, `game-kanban`) are Both (inherit base pack orchestration + add kanban run/ship execution variants); `poketowork-kanban` is Both natively (no base pack to inherit from, mixes orchestration and execution skills directly).
- Added a single-line role tag + pointer back at `docs/operating-modes.md` § "Pack emphasis" to the four existing `PACK.md` files: `packs/business-app-kanban/PACK.md`, `packs/code-quality/PACK.md`, `packs/devtool-kanban/PACK.md`, `packs/game-kanban/PACK.md`. Packs without a pack-level doc (`business-app`, `devtool`, `game`, `poketowork-kanban`) were deliberately not given new files — creating pack-level docs was out of scope per plan.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, or any `SKILL.md` workflow. Step 8's `## Degraded-path audit` section remains byte-identical — only the closing status line changed to mention Step 9.
- Verification: `ls global/claude global/codex | sort -u` → 34 unique skill names, matching 34 rows in the Global skills table; 8 pack directories match 8 rows in the Packs table; `grep -oE '(Claude-orchestration|Codex-execution|Both)'` on the new section returns only those three role values (no free-form strings).
- Checked off Step 9 in `tasks/todo.md`, appended a Step 9 Summary, and rolled the Active Step Plan to Step 10 (pack-aware `$run` routing on Codex — sketch). Step 9's prior Active Step Plan is archived in place for reference.

## 2026-04-19 — Phase 11 Step 8 — Degraded-path audit

- Appended `## Degraded-path audit` to `docs/operating-modes.md` with a 19-row Markdown table covering every cross-tool touchpoint that ships today: `global/claude/delegate/SKILL.md` (3 rows — hybrid-only requirement, `codex` binary on PATH, ambiguous transport outcome), `global/claude/handoff/SKILL.md` (2 rows — `--target=codex` mode rejection + `jq` pretty-print dependency), `global/codex/run/SKILL.md --execute-approved` (2 rows — non-`claude-only` constraint + `jq` write path), and the 12 Step-7 planning/execution skills' unset-mode recommendation branches. Every row names one of `claude-only`/`codex-only`/`hybrid`/`any` in **Assumes** and cites a specific SKILL.md section in **Degraded path** — no empty cells.
- Surfaced two concrete gaps under `### Gaps surfaced by Step 8`: (a) `handoff --target=codex` uses `jq` at step 5.5 for pretty-print but ships no degraded path when `jq` is absent; (b) `codex/run --execute-approved` declares `jq` as a hard dependency in § "Constraints" but documents no user-facing failure path. Both are logged for a follow-up step — Step 8 did not fix them, per plan.
- Pack wrappers are explicitly out-of-audit in a trailing paragraph: exploration confirmed they contain no cross-CLI branching, only intra-pack syntax (`$skill` vs `/skill`) routed by the pack loader. Pack emphasis by CLI role lands in Step 9.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, or any `SKILL.md` workflow. Documentation-only step, per plan.
- Verification: `grep -c "^| \`global/" docs/operating-modes.md` = 19 (≥14 required); `grep "| *|$"` returned zero empty cells; three rows spot-checked against source (`delegate` § "Mode requirement" line 17; `handoff` § "Process" step 5.1 line 40; `codex/run` § "Process" step 6c line 37).
- Checked off Step 8 in `tasks/todo.md`, appended a Step 8 Summary, and rolled the Active Step Plan to Step 9 (pack emphasis split by CLI role — sketch).

## 2026-04-19 — Phase 11 Step 7 — Mode-aware terminal recommendations

- Added a shared **Mode-aware next-step recommendation** section to the six Claude planning/execution skills (`plan-interview`, `roadmap`, `plan-phase`, `run`, `ship`, `ship-end`) and the six Codex equivalents (`plan-interview`, `roadmap`, `plan-phase`, `run`, `ship`, `ship-end`). Each block resolves the effective agent mode via `./scripts/agent-mode.sh` and emits exactly one recommendation line matching the resolved mode, with a distinctive phrase ("resolved agent mode via scripts/agent-mode.sh") that makes the block grep-auditable.
- Claude-side branches: `hybrid` → delegate with `/delegate <target>` (Claude orchestrates, Codex executes); `claude-only` → run the Claude skill directly; `codex-only` → run the Codex `$skill` equivalent; unset → present all three options and point at `docs/operating-modes.md` for mode-signal resolution rules. Targets vary per skill context (`/roadmap` after plan-interview, `/plan-phase`/`/run` after roadmap, `/delegate $run` after plan-phase, `/delegate $ship` after `/run`, `/delegate $run` after `/ship` and `/ship-end`).
- Codex-side inversion for `hybrid`: recommendation says "return to Claude for the next orchestration step" rather than "delegate further" — because in hybrid Claude is the orchestrator and Codex only executes. `codex-only` stays in Codex; `claude-only` tells the user to switch to Claude.
- No-recurse invariant preserved: `global/claude/delegate/SKILL.md` and `global/claude/handoff/SKILL.md` do NOT carry the block (they are themselves the mechanisms). Grep of the distinctive phrase across `global/**/SKILL.md` returns exactly 12 files — the expected Claude+Codex targeted set.
- Contract untouched: no edits to `docs/operating-modes.md`, `specs/approved-plan.schema.json`, or `scripts/agent-mode.sh`. Pure consumer of the mode resolver; no new lifecycle states, env vars, or precedence rules.
- Checked off Step 7 in `tasks/todo.md` and rolled the Active Step Plan to Step 8 (degraded-path audit in `docs/operating-modes.md`).

## 2026-04-19 — Phase 11 Step 6 — `/delegate` (Claude)

- Extended `scripts/approved-plan.sh` with `mark-uncertain`: atomic `approved → uncertain` transition (`<file>.tmp` + `mv`, same pattern as `mark-stale`). Rejects `draft`, `consumed`, `stale`, `superseded`, and `uncertain` as source states with a single-line reason + non-zero exit. Usage help + top-level dispatch case updated. `uncertain` was already in the schema enum from Step 3; Step 6 is the first legitimate writer — no schema or FSM edits.
- Shipped `global/claude/delegate/SKILL.md`: a hybrid-only Claude skill that produces an approved packet via the Step 5 producer path (`draft` + one-question approval + `approve`), then invokes Codex synchronously via `codex exec "<target-skill> --execute-approved"` with a start-marker timestamp captured before the call. Argument-hint `"[target-skill] [--allow-dirty <glob>] [--inline-fallback]"`; target skill defaults to `$run`. Derives `phase`/`step`/`title` from the first unchecked `- [ ]` under `### Active Step Plan` (fallback: current `## Phase N` header) using the same parsing rules as `/handoff --target=codex`.
- Three-branch safe-fallback matrix wired end-to-end, **never blind-retries cross-CLI**:
  - **Pre-start failure** (no `codex` binary, auth failure, start marker never printed) → packet stays at `approved`; prompt offers inline-in-Claude vs keep-for-later manual `$run --execute-approved`. `--inline-fallback` auto-selects inline. `agent-team` profile requires explicit confirmation for the inline downgrade.
  - **Success** (exit 0 + `Approved packet consumed: …` log + `tasks/approved-plan.md` shows `lifecycle: consumed`) → report success; Step 4's `consume` already flipped the lifecycle.
  - **Ambiguous** (non-zero exit or timeout after the start marker printed) → call `mark-uncertain`, then prompt inspect / discard (`supersede`) / continue-inline. Never retries the same packet.
- Mode gating: `claude-only` and `codex-only` exit non-zero with `mode-mismatch:` before any packet operation. Only `hybrid` proceeds — `claude-only` has no executor and `codex-only` plans in Codex directly.
- Contract untouched: no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`. Codex side remains consumer-only. Step 6 is pure transport + failure-mode wiring on top of Steps 3–5.
- Verified `mark-uncertain` via fixture packets in `/tmp/apktest6/`: happy path (`approved → uncertain`, atomic, no `.tmp` leftovers); `draft` and `uncertain` source states both rejected non-zero with clear reasons (same rejection logic applies uniformly to `consumed`, `stale`, `superseded`).
- Checked off Step 6 in `tasks/todo.md`, appended a Step 6 Summary, and rolled the Active Step Plan to Step 7 (mode-aware terminal recommendations — sketch).

## 2026-04-19 — Phase 11 Step 5 — `/handoff --target=codex` (Claude)

- Extended `scripts/approved-plan.sh` with producer-side subcommands: `draft`, `approve`, `supersede`, `status`. Reused the existing `die` / `fail` / `require_jq_write` / `todo_hash_of` helpers and the `<file>.tmp` + `mv` atomic-write pattern so the consumer and producer share one FSM implementation. `draft` refuses to overwrite a live `approved` packet (explicit `supersede` required); `approve` is the atomic `draft → approved` transition and re-verifies `git_head` + `todo_hash` still match the draft's snapshot, failing loudly on drift. `approve` refreshes `approved_at` to "now" so TTL starts counting at approval, not drafting. `supersede` is `* → superseded` for any non-terminal prior packet. `status` prints a one-line lifecycle summary for preflight use. Producer never runs the six consumer freshness checks — that surface stays in `check`.
- Wired the `--target=codex` branch into `global/claude/handoff/SKILL.md` as step 5 (before the handoff-doc write): mode-resolve via `scripts/agent-mode.sh` and abort on `codex-only`; require a clean tree OR matching `--allow-dirty <glob>` flags (same shell-glob semantics as `check`); derive `phase` / `step` / `title` from the first unchecked `- [ ]` under `### Active Step Plan`, falling back to the current `## Phase N` section; call `approved-plan.sh draft …`; pretty-print the packet and ask one concise approval question before calling `approve`; add a "Cross-CLI handoff" section to `tasks/handoff.md` naming the packet file, the committable mirror, and the Codex resume command `$run --execute-approved`. Updated `argument-hint` to `"[focus area] [--target=codex]"`. Default (no `--target`) flow untouched.
- Verified with `/tmp/apktest5` fixtures: `draft` happy path yields `lifecycle=draft` with correct `git_head`, `todo_hash`, fresh `approved_at`, and `blocking_manual_tasks=[]`; dirty tree with matching `--allow-dirty` succeeds, without matching fails with a clear reason; `draft` refuses to clobber an `approved` packet and succeeds after `supersede`; `approve` happy path flips to `approved` and refreshes the timestamp; editing `tasks/todo.md` between `draft` and `approve` trips the drift guard; full round-trip `draft → approve → check → consume` leaves the `.md` mirror at `lifecycle: consumed`; every lifecycle snapshot validates against `specs/approved-plan.schema.json` via `jsonschema` in a venv.
- Contract untouched: no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`. Step 5 only adds the producer side; the consumer (Step 4) and the schema (Step 3) remain frozen.
- Checked off Step 5 in `tasks/todo.md`, appended a Step 5 Summary, and rolled the Active Step Plan sketch to Step 6 (`/delegate`).

## 2026-04-19 — Phase 11 Step 4 — `$run --execute-approved` (Codex)

- Added `scripts/approved-plan.sh` (Bash 3.2, style-matched to `scripts/agent-mode.sh`) with `check`, `consume`, `mark-stale` subcommands. `check` runs the six freshness checks from the Step 3 contract in cheapest-first order (lifecycle → TTL → git HEAD → `todo_hash` → dirty-path scan → manual-todo scan); each failure emits a single-line reason. `consume` transitions `approved → consumed` atomically (`<file>.tmp` + `mv`) and writes the sanitized `tasks/approved-plan.md` mirror projecting only `.md`-safe fields (omits `allowed_dirty_paths`, `notes`). `mark-stale` does the same atomic move to `stale`. Hidden `--packet <path>` override on every subcommand for fixture tests.
- Wired the `--execute-approved` branch into `global/codex/run/SKILL.md` as step 6c: on `check=ok` it runs `consume`, logs `Approved packet consumed: …`, and skips directly to the execute step, bypassing the plan-present + approval gate; on failure it relays the reason, runs `mark-stale`, and falls through to the normal approval flow (never auto-retry). `--execute-approved --phase` is rejected. Flag documented in the header `argument-hint` and a new Constraints bullet. Mode-mismatch guard: `claude-only` makes the flag a user error; helper exits non-zero with `mode-mismatch:` before touching the packet.
- Verified with `/tmp/apktest/` fixtures: happy path returns `ok` exit 0; each failure mode (lifecycle=draft, expired TTL, mismatched git_head, mismatched todo_hash, unexpected dirty path, mode-mismatch) prints its specific reason and exits non-zero; `consume` flips lifecycle and writes the mirror; re-`consume` on an already-consumed packet is idempotent; pre- and post-consume packets both validate against `specs/approved-plan.schema.json` via `jsonschema` in a venv.
- Contract untouched — no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`, matching the Step 3 intent that the schema stay frozen for the first consumer.
- Checked off Step 4 in `tasks/todo.md`, appended a Step 4 Summary, rolled the Active Step Plan to Step 5 (sketch).

## 2026-04-19 — Phase 11 Step 3 — Shared approval/delegation packet contract

- Expanded `docs/operating-modes.md` § "Approval / Delegation Packet" (now 108 lines, kept in place — no extraction needed) with the full field schema, the `draft → approved → (consumed | stale | superseded | uncertain)` lifecycle state machine, the `.md`-safe vs JSON-only safety classification, and the six freshness checks (named here, implementation owned by Step 4).
- Defined `todo_hash` normalization once and for all: strip UTF-8 BOM, normalize CRLF → LF, sha256 the bytes.
- Shipped `specs/approved-plan.schema.json` (draft-07). Validated a well-formed example via `jsonschema` in a venv; confirmed it rejects bad-lifecycle (`frozen`) and missing-`git_head` packets.
- Seeded `tasks/approved-plan.md` with an empty-state notice ("no packet currently approved") and a worked example of the sanitized mirror format. Only projects `.md`-safe fields.
- Added `.agents/approved-plan.json` to `.gitignore` (path-prefixed). `git check-ignore .agents/approved-plan.json` returns the path, exit 0.
- No executable code introduced — deliberately contract-only to prevent schema/consumer drift. Step 4 (`$run --execute-approved`) is the first legitimate consumer; grep confirms no SKILL.md or script references the packet yet.
- Checked off Step 3 in `tasks/todo.md`; rolled the Active Step Plan block to Step 4 (sketch only — detailed plan will land when Step 4 starts).

## 2026-04-19 — Clarify Claude run/ship boundaries from session history

- Parsed recent Claude history/transcripts for `/run`, `/ship`, commits, pushes, and plan-mode entries.
- Found `/run` push behavior only in older sessions (2026-03-26, 2026-03-31, 2026-04-02); since 2026-04-10, `/run` entered plan mode but did not push. The remaining risk was an instruction conflict between `/run` and the default shipping contract.
- Follow-up analysis found the main no-op `/ship` source: accepted `/ship` plans launch as plain "Implement the following plan" sessions. Since 2026-04-10, 219 of 236 such sessions committed and 218 pushed before the next `/ship`.
- Updated Claude `/run` to be explicitly execution-only: no `/commit-and-push-by-feature`, no `git commit`, no `git push`; successful runs hand off to `/ship`.
- Updated Claude `/ship` so no explicit deploy contract means deploy skipped, writing/finding a next-step plan is not complete until EnterPlanMode succeeds, and the clear-context implementation plan explicitly uses a ship-one-step handoff: implement the approved step, validate, commit/push, deploy only with an explicit manual deploy contract, write the following plan, enter plan mode, and stop before implementation.

## 2026-04-19 — Phase 11 Step 1 — thin `docs/operating-modes.md`

- Added `docs/operating-modes.md` naming the three-mode (`claude-only`, `codex-only`, `hybrid`) operating model with a per-mode paragraph, a forward-reference to the mode signal and approval packet, and an explicit "expansions coming in later steps" framing.
- Checked off Phase 11 Step 1 in `tasks/todo.md` and wrote the self-contained plan for Step 2 (mode resolution: `.agents/project.json.agent_mode`, `SKILLS_AGENT_MODE`, `scripts/agent-mode.sh`).
- No skill, schema, or code behavior changed yet; Step 2 wires the signal without consumers.

## 2026-04-17 — Add execution profiles and guard Claude plan-mode exits

- Added strategic `Parallelization` and `Coordination Notes` fields to roadmap generation for Claude and Codex skills
- Added `### Execution Profile` planning guidance to `plan-phase`, including serial, research-only, review-only, implementation-safe, and agent-team modes with subagent lane ownership rules
- Updated `run` and `ship` skills to preserve and apply the current phase execution profile while keeping task docs, history, shipping, and deploy ownership with the main agent
- Guarded Claude `ExitPlanMode` usage in `run`, `scaffold`, `migrate`, and `decommission` so an already-normal post-approval session continues instead of failing with "You are not in plan mode"
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-17 — Unify plan-interview → roadmap → plan-phase flow

- Renamed `plan-phases` → `plan-phase` (singular) across Claude and Codex global skill trees, including the Codex `agents/openai.yaml` side-file
- Dropped Mode B from the skill: `plan-phase` now requires `tasks/roadmap.md` and only decomposes one phase per invocation, preserving Goal/Scope/Acceptance Criteria from the roadmap
- `/roadmap` State B now auto-invokes `/plan-phase 1` (section 4d) so users land on an actionable `tasks/todo.md` after roadmap creation instead of an undecomposed plan
- `/plan-interview` now tells the user to run `/roadmap` next rather than leaving the handoff ambiguous
- Updated all callers (`ship`, `run`, `reconcile-dev-docs`, `skills`) and docs (`README.md`, `docs/skills-reference.md`, `docs/codex-workflow.md`) to reference `plan-phase`
- Refreshed symlinks via `./install.sh`; stale `plan-phases` links removed, new `plan-phase` links in both `~/.claude/skills` and `~/.codex/skills`
- Deploy skipped: no manual deploy contract for this repo

## 2026-04-17 — Require live AWS auth check before SSO login

- Tightened Codex and Claude deploy/ship instructions so agents must not run `aws sso login` from stale context, old logs, or assumptions
- Required `aws sts get-caller-identity --profile <profile>` when AWS auth status is uncertain, and explicitly skips SSO login when that identity check succeeds
- Preserved the SSO recovery path for actual missing or expired credentials after a live identity check or deploy-command failure
- Added `tasks/lessons.md` entry for checking live AWS auth before prompting for SSO login
- Validation: `git diff --check`, `scripts/skill-versions.sh --missing`, `scripts/detect-secrets.sh`
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-16 — Clarify skill invocation and AWS SSO deploy recovery

- Added explicit `Invoke as $...` guidance across Codex global and pack skill docs so each skill documents its Codex invocation form
- Updated Codex and Claude deploy/ship workflows so expired or missing AWS SSO credentials trigger `aws sso login --profile <profile>` and user browser-login instructions instead of a skipped deploy
- Defined failed SSO completion as an authentication blocker, not a skipped deploy, and reruns the original deploy command once after successful login
- Validation: `git diff --check`, `scripts/skill-versions.sh --missing`, `scripts/detect-secrets.sh`, and `scripts/pack.sh list`
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-16 — Add code-quality cleanup orchestrator

- Added mirrored Claude and Codex `quality-sweep` skills to the `code-quality` pack
- Defined audit-only default behavior plus explicit `fix` and `full` modes for behavior-preserving cleanup campaigns
- Documented the eight audit lanes: duplication, shared types, unused code, circular dependencies, weak types, error handling, legacy paths, and comments/stubs
- Added Codex agent metadata and updated the Code Quality Pack docs/reference flow to include `quality-sweep audit -> extract-shared-types / quality-sweep fix -> regression-check`
- Validation: YAML/frontmatter parsing for new skill files, `scripts/pack.sh list`, Claude/Codex skill mirror diff, and `git diff --check`
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-15 — Clarify pack skill reload behavior

- Updated `scripts/pack.sh` so `install`, `remove`, and `refresh` print a fresh-session notice after changing project-local skill links
- Documented that pack `refresh` recreates `.claude/skills` and `.codex/skills` symlinks but does not reload an already-running Claude Code or Codex process
- Bumped `/pack` and `$pack` skill versions to 1.1.1
- Added regression coverage for install/remove/refresh fresh-session notices
- Validation: `npm test -- pack.test.mjs`, `scripts/skill-versions.sh --missing`, and `git diff --check`
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-15 — Rename workflow to research-roadmap

- Renamed the global Claude and Codex `workflow` skill directories to `research-roadmap`
- Updated the skill metadata, title, Codex agent manifest, roadmap handoff, skills grouping, README, packs docs, and business-app research recommendations to use `/research-roadmap` or `$research-roadmap`
- Reframed the skill as the research/documentation counterpart to `roadmap`, while leaving the future workflow-orchestrator idea available as a distinct follow-up
- Queued `$research-roadmap` as the next task after the completed roadmap
- Validation: active-reference search for old `/workflow`, `$workflow`, and `name: workflow`

## 2026-04-14 — Require archive-first research/spec doc replacements

- Added a shared Archive-First Replacement Policy to 92 Claude/Codex skill docs that write or wrap canonical research/spec documentation
- Updated `$spec-drift` so code-right resolutions archive the existing spec before updating the canonical spec
- Updated `$reconcile-research` so fix-mode research resolutions archive existing documents before applying approved canonical changes
- Updated `$reconcile-dev-docs` so spec and `docs/specifications/` replacements archive first while task/history append behavior remains unchanged
- Extended the policy to kanban plan-interview wrappers so spec-writing entrypoints preserve prior versions before replacement
- Validation: `git diff --check`
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-13 — Add code-quality pack and documentation-first workflow

- Added guided no-argument setup to `/pack` and `$pack`, with committed project-designation refresh when `.agents/project.json` exists and recommendation/confirmation flow when it is missing
- Extended `scripts/pack.sh` with multi-pack install/remove, pack-name aliases, lock protection, portable pack listing, and skill-local launcher scripts under both pack skill mirrors
- Added the project-local `code-quality` pack with mirrored `extract-shared-types` skills and Codex agent metadata
- Updated README and pack docs for `code-quality`, guided setup, and committed `.agents/project.json` expectations
- Refactored `/workflow` and `$workflow` from read-only `--catchup` status reporters into documentation front-loaders that maintain `## Priority Documentation Todo` in `tasks/todo.md`

## 2026-04-12 — Clarify reconciliation skill names

- Renamed `/research-reconcile` to `/reconcile-research` across Claude and Codex skill directories and active references
- Added `/reconcile-dev-docs` for auditing or fixing drift across `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, phase archives, specs, git history, and code reality
- Added Codex `agents/openai.yaml` manifests for `/reconcile-research` and `/reconcile-dev-docs`
- Updated README, skills reference, and `/skills` stage mapping to distinguish research reconciliation from development-doc reconciliation

## 2026-04-11 — Extend ICP skills with business model, champions, funnel, and expansion

- Extended `/icp` (v3.4.0 → v3.5.0) with business model classification, new section 10 (`## Acquisition & Conversion Model`) covering funnel shape, motion type & cycle length, DMU, champion & advocate dynamics, expansion & retention dynamics, and budget & procurement. Canonical 9-section structure preserved for downstream compatibility.
- Extended `/enterprise-icp` (v2.1.0/v2.2.0 → v2.3.0) with four new interview areas: champion enablement & risk, budget cycle & procurement, land-and-expand strategy, and enterprise segmentation. Output sections grew from 7 to 11. Lifecycle gained an Expansion stage.
- Updated both Claude and Codex mirrors for each skill (4 files total)
- Ran `install.sh` to update symlinks

## 2026-04-08 — Tighten research skills to assume no insider knowledge

- Updated 11 Codex skill prompts so research-oriented workflows default to deep, self-sufficient analysis instead of asking whether findings match the user's intuition
- Added explicit "default stance" guidance in core research skills (`competitive-analysis`, `icp`, `positioning`, `burn-rate`) to explain terms from first principles and ask for constraints or factual corrections only when needed
- Reworded validation checkpoints across GTM, metrics, monetization, journey-map, enterprise-icp, cohort-review, and plan-interview to request missing facts, weak assumptions, or product constraints rather than insider confirmation
- Verified with ripgrep that the edited Codex skill set no longer contains the prior "match your intuition" / "does this feel right" checkpoint language
- No deploy step — repo has no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`)

## 2026-04-07 — Fix skill frontmatter YAML parsing

- Normalized `argument-hint` frontmatter across 55 Claude/Codex skill files from unquoted bracket syntax to quoted YAML scalars
- Fixed the immediate loader failure in `codex/landing-copy/SKILL.md` and proactively cleaned the same pattern in related skills
- Verified no remaining `argument-hint: [...]` frontmatter values via ripgrep
- Parsed representative edited frontmatters with Ruby `YAML.safe_load` to confirm the loader-facing syntax is valid

## 2026-04-07 — Phase 10 Step 6: Deprecate standalone kanban DB-write path (complete)

- Updated `claude/poketo-kanban/scripts/kanban.mjs` help output so the default workflow is explicitly `poketo kanban`, with the direct-DB script labeled fallback/admin-only
- Updated `claude/poketo-kanban/scripts/bootstrap-session.mjs` and `claude/poketo-kanban/scripts/setup.sh` so adjacent helper messaging no longer presents `node kanban.mjs ...` as the standard verification path
- Verified active Claude and Codex skill/docs paths still contain no standard-use dependency on `POKETOWORK_DATABASE_URL` or `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- Archived the completed final phase to `tasks/phases/phase-10.md`, marked Phase 10 complete in `tasks/roadmap.md`, and converted `tasks/todo.md` into a roadmap-complete status file
- Targeted validation: `npx vitest run bootstrap-session.test.mjs install.test.mjs` and `node kanban.mjs --help`

## 2026-04-06 — Phase 10 Step 5: Migrate Codex kanban skills to poketo CLI (complete)

- Updated `codex/poketo-kanban/SKILL.md` — standard usage now runs through `poketo kanban`, version bumped to 1.1.0, and `POKETOWORK_DATABASE_URL` was removed from the default prerequisites
- Updated `codex/sync-roadmap-kanban/SKILL.md` — board resolution and active kanban mutations now use `poketo kanban`, with `allowed-tools` documenting `Bash(poketo *), Bash(git *)`
- Updated 6 Codex consumer skills (`run`, `ship`, `ship-end`, `brainstorm`, `roadmap`, `plan-interview`) — kanban setup now uses `poketo kanban` and no longer references `~/.claude/skills/.../kanban.mjs`
- Verified: no remaining `POKETOWORK_DATABASE_URL` or `~/.claude/skills/poketo-kanban/scripts/kanban.mjs` references in active Codex skill files
- Advanced `tasks/todo.md` to Phase 10 Step 6 with a focused deprecation plan for the remaining fallback-only `kanban.mjs` path

## 2026-04-06 — Phase 10 Step 4: Migrate Claude kanban skills to poketo CLI (complete)

- Added `--description` flag to `poketo kanban create-card` and `--template standard` flag to `poketo kanban create-board` in poke CLI (`packages/cli/src/commands/kanban.ts`)
- Updated `claude/poketo-kanban/SKILL.md` — all commands now use `poketo kanban`, prerequisites updated (no more `POKETOWORK_DATABASE_URL`), version bumped to 1.1.0
- Updated `claude/poketo-kanban/KANBAN-SETUP.md` — board resolution and graceful degradation now check for `poketo` CLI on PATH
- Updated `claude/sync-roadmap-kanban/SKILL.md` — all 4 `kanban.mjs` invocations replaced with `poketo kanban`, version bumped to 1.1.0
- Updated 6 consumer skills (`run`, `ship`, `ship-end`, `brainstorm`, `roadmap`, `plan-interview`) — `allowed-tools: Bash(node *)` → `Bash(poketo *)`
- Added deprecation header to `claude/poketo-kanban/scripts/kanban.mjs`
- Verified: no remaining `kanban.mjs` references in any Claude skill file, no remaining `Bash(node *)` in allowed-tools
- CLI compiles and builds cleanly with the new flags

## 2026-04-06 — Rename repo to agentic-skills and refresh installed skills

- Renamed the local checkout from `/Users/georgele/projects/tools/claude-skills` to `/Users/georgele/projects/tools/agentic-skills`
- Renamed the GitHub repo from `GeorgeQLe/claude-skills` to `GeorgeQLe/agentic-skills` and updated `origin`
- Re-ran `bash install.sh` to refresh global Claude and Codex skill symlinks for the new repo path
- Removed 24 stale legacy symlinks that still pointed at deleted `claude-skills` skill paths after the installer run
- Updated `tasks/todo.md` references so the active Phase 10 plan points at `agentic-skills`

## 2026-04-04 — Add /platform-strategy skill

- Created `claude/platform-strategy/SKILL.md` v1.0.0 — research-driven multi-product expansion planning skill
- Covers: core product health assessment, vertical/horizontal expansion vector mapping, 5-dimension scoring matrix, lightweight validation experiment design, portfolio sequencing (Now/Next/Later/Watch), shared platform considerations
- Prerequisites: `research/icp.md` or working codebase; enriched by competitive-analysis, journey-map, metrics, monetization, positioning, customer-feedback, enterprise-icp
- Output: `research/platform-strategy.md` + `research/platform-strategy-search-log.md`
- Created `codex/platform-strategy/SKILL.md` v1.0.0 — condensed Codex variant
- Updated `docs/skills-reference.md` with the new skill and platform-expansion workflow note
- No deploy step — repo is a tools directory

## 2026-04-04 — Add comprehensive README

- Created `README.md` documenting the full skill library for both Claude Code and Codex
- Covers: installation, repository structure, platform differences (Claude Code vs Codex), workflow overview with ASCII pipeline diagram, 6 named workflow flows, all 60 skills organized into 12 categories with descriptions/arguments/outputs, activity types taxonomy, kanban integration architecture, file contracts, skill dependency chains, and versioning scheme
- No deploy step — repo is a tools directory, not a production product

## 2026-04-06 — Phase 10 Step 2: Wire Poketo Work headless tool layer

- Created 3 new primitive tools in Poketo monorepo: `create-board.ts`, `search-cards.ts`, `restore-card.ts`
- Fixed `delete-card.ts` description from "permanently" to archive semantics
- Extended `adapted-tools.ts` with 4 new adapt functions (getMyBoards, createBoard, searchCards, restoreCard) — 15 total adapted tools
- Removed `getMyBoardsTool` from `tools/index.ts` barrel (now in adapted pipeline only)
- Updated all 3 test files for new tool counts and mock callers — 116 tests pass
- Advanced `tasks/todo.md` to Phase 10 Step 3

## 2026-04-06 — Skills audit: consolidate kanban variants into base skills

- Merged 7 `-kanban` variant skills into their base skills with a `--kanban` flag: plan-interview, roadmap, ship, ship-end, run, brainstorm, poketo-kanban
- Merged `plan-interview-ideas` into `plan-interview` with `--ideas` flag
- Merged `kanban-archive` into `poketo-kanban` with `--archive` flag
- Removed 16 variant directories (8 from claude/, 8 from codex/)
- Updated cross-references in skills/SKILL.md, docs/codex-workflow.md, docs/skills-reference.md, docs/kanban-test-results.md
- Result: 52 claude skills (was 60), 49 codex skills (was 57)

## 2026-04-03 — Headless auth migration brief for Phase 10

- Audited the current Claude and Codex kanban assumptions around `POKETOWORK_DATABASE_URL`, `~/.poketo/config.json`, and Codex's hardcoded `~/.claude/skills/.../kanban.mjs` path
- Wrote `/Users/georgele/projects/tools/claude-skills/specs/poketo-headless-auth-migration.md` to define the recommended target auth path: scoped `pk_...` API keys through the agent gateway, with the standalone DB script retained only as transitional fallback
- Captured the canonical Poketo monorepo files for the intended headless path: gateway auth, session-backed agent caller, Work adapter, and board/card/list tRPC routers
- Documented the current migration blockers in the Work tool layer: `get-my-boards` stubbed, primitive tools still placeholders, and missing board discovery/create-board/search/archive-restore coverage
- Advanced `tasks/todo.md` to Phase 10 Step 2 and replaced the next-step implementation plan with a concrete Work tool wiring plan

## 2026-04-03 — Refactor Codex workflow so run ships by default

- Updated `codex/run` and `codex/run-kanban` to make the Codex execution loop explicit: plan, approve, implement, validate, commit/push, optional deploy, and next-step preparation all happen inside `run`
- Repositioned `codex/ship` and `codex/ship-kanban` as compatibility/manual cleanup workflows for already-finished work instead of the default next step after `run`
- Updated Codex-facing docs and metadata (`docs/codex-workflow.md`, `docs/skills-reference.md`, run/ship agent prompts, `codex/workflow`) to describe the new execute-and-ship-by-default model
- Pre-ship validation: `npm test` in `claude/poketo-kanban/scripts` still fails with pre-existing kanban regressions and Neon connectivity errors; not fixed in this shipping step

## 2026-04-02 — Make Codex ship deploy opt-in via explicit contract

- Updated `codex/ship`, `codex/ship-kanban`, `codex/ship-end`, and `codex/ship-end-kanban` so manual deploy only runs when `deploy.md` or `tasks/deploy.md` exists; added `--no-deploy` support across the Codex ship family
- Updated Codex ship agent metadata and `docs/skills-reference.md` to describe the deploy-contract behavior and new ship-end arguments
- Fixed YAML frontmatter quoting in the edited Codex ship-family skill files so skill loading works again
- Transitioned `tasks/todo.md` from a completed snapshot to Phase 10: Headless API Migration, with a concrete Step 1 plan for establishing agent-friendly headless auth
- Pre-ship validation: `npm test` in `claude/poketo-kanban/scripts` failed with pre-existing kanban regressions and Neon connectivity errors; not fixed in this shipping step

## 2026-04-02 — Normalize Codex skill references to `$skill`

- Updated Codex-facing docs to use native `$skill` invocation syntax in [docs/codex-workflow.md] and clarified dual syntax guidance in [docs/skills-reference.md]
- Updated Codex skill docs so next-step recommendations, prerequisite guidance, and example output use `$skill` instead of Claude-style `/skill`
- Updated `scripts/skill-deps.sh` to scan both `claude/` and `codex/` skills and recognize both `/skill-name` and `$skill-name` references
- Verified no remaining slash-prefixed skill references across `codex/*/SKILL.md`
- No deploy step for this repository; repo treated as a tools directory rather than a production product

## 2026-04-02 — Enhance skill follow-through and close dead-end workflows

- Enhanced `mvp-gap` (v1.1.0→v1.2.0): added downstream impact check (scans journey-map, metrics, gtm, monetization, roadmap for conflicts), spec validation (checks existing specs before suggesting /plan-interview), journey stage mapping per gap, metrics tie-in (closure metrics + instrumentation gap flagging), GTM alignment (cross-references build sequence against launch gates), enriched output format with _Journey stage:_, _Closure metric:_, _Spec:_ per gap
- Enhanced `dead-code` (v1.0.0→v1.1.0): added Follow-Through section — writes "Safe to Remove" items as checkboxes to `tasks/todo.md` under `## Dead Code Cleanup`, suggests `/run` to execute
- Enhanced `expert-review` (v1.0.0→v1.1.0): added Follow-Through section — writes Critical/High findings as checkboxes to `tasks/todo.md` under `## Code Review Fixes`, suggests `/run` or `/investigate`
- Enhanced `regression-check` (v1.0.0→v1.1.0): added Follow-Through section — writes new failures (not pre-existing) as checkboxes to `tasks/todo.md` under `## Regression Fixes`, only when verdict is "Issues found"
- Synced all changes to codex/ variants (mvp-gap, dead-code, expert-review, regression-check)

## 2026-04-01 — Update /deploy skill with deployment history tracking

- Updated `claude/deploy/SKILL.md` v1.0.0→v2.0.0 — added deployment ledger (`tasks/deploys.md`), pre-deploy diff, staleness detection, `--status` flag
- New step 4: compare against last deployment — shows commits about to ship and time since last deploy
- New step 7: record each deploy (success/failed) to ledger with UTC timestamp, branch, commit range, commit count
- New step 8: staleness report across all tracked environments — flags 7+ days old or 20+ commits behind
- Failed deploys recorded but don't reset staleness clock
- Added Ledger Format section documenting `tasks/deploys.md` structure
- Updated `codex/deploy/SKILL.md` and `docs/skills-reference.md` to match

## 2026-04-01 — Add /slim-audit skill

- Created `claude/slim-audit/SKILL.md` — analysis skill to audit codebases for LOC reduction opportunities
- 6 audit categories: duplication, over-abstraction, verbose patterns, redundant logic, hand-rolled replacements, structural bloat
- Preserves functionality as top priority — behavior changes get separate risk classification
- Cross-references specs/docs to respect intentional design decisions; false-positive filter on all findings
- Created `codex/slim-audit/SKILL.md` and `codex/slim-audit/agents/openai.yaml`
- Updated `docs/skills-reference.md`: Code Quality section entry, activity types, quick reference, count 54→55

## 2026-04-01 — Add /spec-drift skill + workflow integration

- Created `claude/spec-drift/SKILL.md` — new analysis skill that extracts verifiable claims from specs and checks them against the codebase
- Supports audit (read-only) and fix (interactive resolution) modes with monorepo support
- 8 claim types: routes, data models, feature behaviors, config/env, UI flows, CLI, pricing/limits, integration points
- Claims classified as Verified/Diverged/Unimplemented/Removed; also detects undocumented code
- Fix mode includes downstream impact check (journey-map, metrics, roadmap)
- Updated `claude/workflow/SKILL.md`: added git-log-vs-spec staleness rule + dependency graph entry
- Updated `docs/skills-reference.md`: added entry in Evaluate section, Quick Reference table, activity types, skill count 52→53

## 2026-04-01 — Add downstream impact check to 6 research skills

- Added post-write "Downstream Impact Check" step to icp, competitive-analysis, journey-map, metrics, gtm, and customer-feedback skills
- Each skill now scans its downstream dependents for conflicts after writing, classifies impact (None/Minor/Major), and recommends `/research-reconcile` for Major
- Added `## Downstream Impact` section to each skill's output template (before `## Next Steps`)
- Added impact-aware Next Steps logic (Major prepends reconcile, Minor annotates stale items)
- Leaf nodes (monetization, enterprise-icp) left unmodified — nothing reads their output downstream
- Version bumps: icp 3.3.0→3.4.0, competitive-analysis 2.2.0→2.3.0, journey-map/metrics/gtm/customer-feedback 1.1.0→1.2.0

## 2026-03-31 — Add `tasks/manual-todo.md` support across 13 skills

- Added manual task classification and `manual-todo.md` output to `plan-phases` (claude + codex)
- Added "Manual tasks" interview topic and `**Manual Tasks:**` phase format to `roadmap` and `roadmap-kanban` (claude + codex)
- Added blocking task check (step 5), manual task reporting, and "Do NOT execute" constraint to `run` and `run-kanban` (claude + codex)
- Added phase transition archival (`phase-N-manual.md`), next-phase extraction, commit inclusion, and status reporting to `ship` and `ship-kanban` (claude + codex)
- Added manual task status checking and output line to `ship-end` and `ship-end-kanban` (claude + codex)
- Added `manual-todo.md` to scan/read lists and output for `workflow`, `handoff`, `sync`, `sync-roadmap-kanban` (claude + codex)
- Resolved pre-existing merge conflict in `claude/research-reconcile/SKILL.md`
- 26 SKILL.md files modified (13 skills × 2 platforms)

## 2026-03-31 — Implement multi-user kanban (all 4 phases)

- Implemented all 4 phases in `kanban.mjs`: updatedAt responses, audit logging, optimistic locking, activity command
- Phase 1: cmdDone/cmdMoveCard/cmdArchiveCard now return full card objects with updatedAt
- Phase 2: Added board_actions schema, logAction helper, agentSessionId; wired into 8 commands
- Phase 3: --expect-updated-at flag with conflict detection on update/move/done/archive
- Phase 4: New `activity` command with --card/--board/--limit flags
- Fixed timestamp precision issue (Postgres NOW() microseconds vs JS Date milliseconds) by using explicit `new Date()` in create-card
- All 92 tests green (22 previously red tests now passing)

## 2026-03-31 — TDD tests for multi-user kanban features

- Added 28 tests across 4 new describe blocks to `kanban.test.mjs` (64→92 total)
- Test DB helper: direct Drizzle/Neon connection to query `board_actions` table for audit log verification
- Card updatedAt block (5 tests): 2 pass (create/update), 3 red (move/done/archive omit updatedAt)
- Audit logging block (10 tests): all red — kanban.mjs doesn't write to board_actions yet
- Optimistic locking block (8 tests): 2 pass (correct timestamp/omitted flag), 6 red (conflict detection not implemented)
- Activity command block (5 tests): 1 pass (missing args error), 4 red (command doesn't exist)
- Created `tasks/todo.md` with 4-phase implementation plan for turning tests green
- All 64 existing tests still pass; 22 new tests in expected TDD red state

## 2026-03-30 — Add --plan flag to /investigate + new /branch-lifecycle skill (51→52)

- Enhanced `/investigate` (v1.0.0→v1.1.0): added `--plan` flag for multi-step fix planning
  - Step 6 split: inline mode (single fix, default) vs plan mode (`--plan` or 3+ discrete steps)
  - New step 7: writes `## Investigation Fix: [title]` with checkable items to `tasks/todo.md` (appends, never overwrites)
  - Added "Fix Steps Written" output section (shown instead of "Fix Applied" in plan mode)
  - New constraints: no `docs/debug-changelog.md` writes, no todo.md for single-step fixes unless `--plan` explicit
- Created `/branch-lifecycle` skill (v1.0.0) with 5 actions: list, pr, review, merge, cleanup
  - `list`: inventory unmerged branches with PR status, age, ahead/behind
  - `pr`: create PRs for branches without one
  - `review`: evaluate PR for correctness, tests, conflicts, scope
  - `merge`: squash merge approved PRs (respects CLAUDE.md overrides)
  - `cleanup`: delete merged branches, prompt for stale ones (never auto-deletes)
- Updated `/skills` stage mapping: added "Git Workflow" stage with `branch-lifecycle`
- Updated `docs/skills-reference.md`: count 51→52, new Git Workflow section, updated `/investigate` entry, quick reference rows
- Symlink installed via `install.sh`

## 2026-03-30 — Strengthen evidence requirements at checkpoint instructions

- Audited all AskUserQuestion checkpoints across 9 research/strategy skills — found 10 of 22 presenting bare conclusions without evidence
- Added evidence-citing requirements to 11 checkpoints across 9 skills (x2 for codex copies = 22 file edits)
- Skills updated: icp (CP1, CP3), competitive-analysis (CP1), gtm (validation), monetization (CP2), journey-map (validation), metrics (validation), enterprise-icp (orient + validation), plan-interview/kanban/ideas (coverage checkpoint), research-reconcile (fix mode)
- Key patterns added: cite pain evidence + search sources (icp), cite ICP behavior data + competitor benchmarks (gtm), cite competitor pricing + willingness-to-pay signals (monetization), cite ICP/competitive/spec evidence (journey-map), structured coverage summary with decisions and reasoning (plan-interview variants), side-by-side conflicting claims with direct quotes (research-reconcile)
- Enterprise-icp orient step now includes WebSearch for enterprise buying patterns before asking user

## 2026-03-30 — Add multi-app monorepo & multi-ICP support to 13 skills

- Added directory-based namespacing: `research/{app}/` and `specs/{app}/` instead of flat files with app suffixes
- Updated /icp: monorepo output changed from `icp-{app}.md` to `{app}/icp.md`, added migration for old convention
- Added Step 0 (App Scope Resolution) to all 13 research/strategy skills — auto-detects monorepo via subdirectories
- Updated /research-reconcile: per-app reconciliation + cross-app checks, scans `research/{app}/` subdirectories
- Updated /workflow: per-app status table, app-specific recommendations
- Zero impact on single-product repos — step 0 only activates when `research/` contains subdirectories
- All changes applied to both claude/ and codex/ (26 files total)
- Version bumps: icp 3.3.0, competitive-analysis 2.2.0, enterprise-icp 2.1.0, all others 1.1.0

## 2026-03-30 — Add "research and recommend" default to interview-driven skills

- Updated 6 interview-driven skills to default to "research and recommend" pattern instead of "pick from options"
- Skills updated: /gtm, /metrics, /journey-map, /enterprise-icp, /monetization (checkpoint 1), /plan-interview
- New default: research first (web search, upstream docs, codebase), present findings with data, state recommendation, user approves/adjusts/overrides
- Only asks user to choose without recommendation when insider knowledge is genuinely required
- Applied to both claude and codex SKILL.md files (12 files total)

## 2026-03-30 — Add concept-validation mode to /competitive-analysis (v2.0.0→v2.1.0)

- Added concept-validation mode: activates when no ICP and no meaningful codebase (or `concept` argument)
- New Step 4a: Gap Assessment with Market State, Incumbent Quality, Gap Quality, Verdict + user checkpoint
- Concept mode frames positioning as hypothetical, always recommends `/icp` as first next step
- Updated `/workflow` skill: added "Concept" phase, concept-validation fork in dependency graph, updated recommendation rules
- Updated `docs/skills-reference.md`: new gap-first flow, updated `/competitive-analysis` entry and quick reference
- Applied to both claude and codex SKILL.md files

## 2026-03-29 — Add /research-reconcile skill + fix phase archive paths (50→51)

- Created `/research-reconcile` skill (claude + codex) — cross-document consistency audit for research outputs
- 5 scope groups (icp, pricing, journey, enterprise, feedback) with 39 pairwise checks + 3 monorepo checks
- Audit mode (read-only, default) and fix mode (user-approved edits + reconciliation-report.md)
- Severity classification: Error (active contradiction), Warning (stale/gap), Info (suggestion)
- Dependency direction informs recommendations; customer feedback treated as ground truth
- Updated docs/skills-reference.md: count 50→51, new entry in Discovery & Market Fit, quick reference row
- Pre-existing fixes also included:
  - Fixed `docs/phases/` → `tasks/phases/` path in ship, ship-kanban, codex/ship (3 files)
  - Added phase archive check to hygiene + codex/hygiene (2 files)
  - Removed stale `docs/skills-reference.md` and `docs/skill-versioning.md` required-doc checks from hygiene

## 2026-03-28 — Enhance /icp skill: monorepo, geography, named accounts (v3.1→v3.2)

- Added monorepo detection to Step 1 — checks for turbo.json, pnpm-workspace.yaml, lerna.json, nx.json, package.json workspaces; produces per-app `research/icp-{app-name}.md` when multiple distinct user-facing products exist
- Added 2 new search strategies (#11 geographic/regulatory, #12 named account searches) to Step 2
- Expanded Customer Profile in Step 4 with two conditional sub-sections: Geographic Focus (regulatory/language/market constraints) and Named Accounts (B2B: 5-10 real companies)
- Updated output template with `### Geographic Focus` and `### Named Accounts` under `## Customer Profile`
- Added Monorepo Output Convention section to output spec
- Canonical 9 `##` sections preserved for downstream compatibility
- Applied to both claude/icp and codex/icp SKILL.md files

## 2026-03-28 — Add /monetization skill (49→50)

- Created `/monetization` skill (claude + codex) — research-driven monetization strategy with 3 validation checkpoints
- Covers: revenue model selection, value metric design, tier structure, price point anchoring, unit economics (CAC/LTV/payback), monetization timing, revenue diversification
- Reads upstream: icp, competitive-analysis, journey-map, metrics, gtm, customer-feedback, specs
- Outputs: research/monetization.md + research/monetization-interview.md
- Integrated into `/workflow`: staleness rules (stale when ICP or competitive data changes) + dependency graph
- Added to `/skills` stage mapping under Strategize
- Updated docs/skills-reference.md: count 49→50, new entry + quick reference row

## 2026-03-28 — Ship/ship-kanban: delegate to /workflow when no plan exists

- Replaced static suggestion list in `/ship` and `/ship-kanban` with `/workflow` delegation
- Both "no active plan" and "all phases complete" cases now run `/workflow` for context-aware next-step recommendation
- Updated claude/ship, claude/ship-kanban, codex/ship (3 files)

## 2026-03-28 — Add /hygiene skill and fix project-wide conventions (48→49)

- Created `/hygiene` skill (claude + codex) — audits project structure for convention violations with optional auto-fix mode
- Scopes: skills (frontmatter, sections), tasks (expected files), docs (reference sync), codex (mirror parity)
- Ran initial audit and fixed all errors/warnings:
  - Added missing `argument-hint` fields to 6 skills
  - Restructured 5 flat-format skills to use `## Process`/`## Output Format`/`## Constraints` headings (analyze-sessions, commit-and-push-by-feature, provision-agentic-config, plan-interview, ship-end)
  - Created 2 missing codex mirrors (poketo-kanban, skills)
  - Added `/competitive-analysis` to Quick Reference table
  - Synced 29 codex skill descriptions to match claude source of truth
- Updated docs/skills-reference.md: count 48→49, new `/hygiene` entry

## 2026-03-28 — Add contextual Next Steps to all 9 research skills

- Added `## Next Steps` section to all 9 research skill output templates (icp, competitive-analysis, enterprise-icp, journey-map, customer-feedback, gtm, metrics, mvp-gap, scale-audit)
- Claude skills (9): added "Populate Next Steps" process step with conditional logic (file existence checks) + `## Next Steps` in output template
- Codex skills (9): added Next Steps requirements to Deliverables + constraint enforcing format
- Each skill's suggestions are context-aware (3–5 items, "Pick one:" framing) — only includes commands whose prerequisites are met
- Replaced competitive-analysis's old `## Recommended Next Steps` (only suggested `/plan-interview`) with expanded contextual version
- 18 files modified, 165 lines added

## 2026-03-28 — Add 4 new skills: workflow, customer-feedback, gtm, metrics (44→48)

- Created `/workflow` skill — read-only diagnostic that scans project state, detects phase, checks staleness via timestamp comparison, and recommends next action
- Created `/customer-feedback` skill — append-only feedback ingestion with Confirmed/Wrong/New categorization against ICP and journey map, cumulative synthesis, staleness triggers at 3+ invalidated findings
- Created `/gtm` skill — interview-driven go-to-market planning (channel strategy, messaging, pricing, launch plan, 30/60/90 early traction tactics)
- Created `/metrics` skill — interview-driven success metrics framework (activation, engagement, retention, growth, business) tied to journey map stages with instrumentation gap tracking
- All 4 skills: Claude SKILL.md + Codex SKILL.md + Codex agents/openai.yaml (12 new files)
- Updated downstream skills to read new research outputs:
  - `/brainstorm` now reads customer-feedback.md (Wrong/New findings) and metrics.md (instrumentation gaps)
  - `/roadmap` now reads gtm.md (launch milestones) and metrics.md (instrumentation phases)
  - `/mvp-gap` now reads metrics.md (check if metrics are measurable)
- Updated `/skills` stage mapping: added Mapping, Evaluate, Workflow groups
- Updated docs/skills-reference.md: count 44→48, workflow diagram with Learn stage + feedback loop, 5 new entries, quick reference table
- install.sh: 4 new Claude + 4 new Codex symlinks installed

## 2026-03-28 — Research skills revamp + journey-map skill

- Revamped 3 research skills (icp, competitive-analysis, enterprise-icp) with present→validate→write pattern
  - All now report findings and validate with user via AskUserQuestion checkpoints before writing output
  - Output moved from `specs/` to `research/` directory (icp.md, competitive-analysis.md, enterprise-icp.md)
  - ICP: 3 checkpoints (candidates, scoring, cross-ICP); Competitive: 2 checkpoints (competitor list, full analysis); Enterprise: explicit present-findings step
- Added 2 new sections to /icp (v3.1.0): Trigger Events (ranked by frequency/urgency) and Market Sizing (TAM/SAM/SOM with confidence levels)
- Canonical ICP format expanded from 7 to 9 sections
- Created `/journey-map` skill (v1.0.0) — maps user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention)
  - Prerequisites: research/icp.md + specs/*.md
  - Outputs: research/journey-map.md + research/journey-map-interview.md
  - Same present→validate→write pattern as other research skills
- Updated ~20 downstream skills referencing old specs/ paths to use research/
- Updated docs/skills-reference.md: 43→44 skills, workflow diagrams, quick reference table
- Consolidated run-step, run-phases, ship-then-plan into run and ship (JIT /plan-phases invocation)

## 2026-03-27 — Kanban production hardening specs

- Assessed kanban test results (61 tests, 3 layers all passing) for production readiness
- Identified 4 caveats: multi-user concurrency, load/stress testing, rollback/undo safety, Neon outage resilience
- Ran 7-turn /plan-interview to spec out test plans and new features
- Created `specs/kanban-production-test-plan.md` — 10 Claude-to-Claude race scenarios, 4 Claude + Web App races, progressive load profiling (50→500 cards, p50/p95/p99), 8 safety gate tests
- Created `specs/kanban-offline-queue-soft-delete.md` — offline write queue (better-sqlite3, 100-op limit, FIFO sync with conflict detection), soft-delete with 30-day TTL, restore/purge commands, ~40 new test cases
- Created `specs/kanban-production-hardening-interview.md` — full interview log with decisions and deviations

## 2026-03-27 — Revamp /icp skill: interview → research-driven

- Rewrote `claude/icp/SKILL.md` and `codex/icp/SKILL.md` from v1.0.0 to v2.0.0
- Replaced 7-area founder interview with automated web search + codebase analysis
- Now identifies 2-5 ICP candidates, scores on Value x Accessibility, selects primary
- Output: primary ICP in canonical 7 `##` sections (downstream-compatible) + Additional ICPs + Cross-ICP Analysis
- Research log in `research/icp-search-log.md` replaces `specs/icp-interview.md`
- Brief 1-2 question validation replaces full interview

## 2026-03-27 — Phase 9 Step 3: Skill versioning

- Added `version: 1.0.0` to all 43 `claude/*/SKILL.md` frontmatter files
- Created `scripts/skill-versions.sh` — version audit script with `--json` and `--missing` modes
- Created `docs/skill-versioning.md` — semver rules, bump guidelines, audit usage
- Phase 9 complete: skill discovery, dependency graph, and versioning all shipped

## 2026-03-27 — Phase 9 Step 2: Skill dependency graph

- Created `scripts/skill-deps.sh` — PCRE-based dependency graph and validation script
- 4 output modes: default (graph), `--broken` (broken refs only), `--dot` (Graphviz), `--json` (programmatic)
- Regex with negative lookbehind/lookahead prevents false positives on path fragments (`tasks/todo.md`, `/home/user`)
- Scanned 43 skills, found 22 with dependencies, 0 broken refs
- Exit code 0 if clean, 1 if broken refs found

## 2026-03-27 — Phase 9 Step 1: Skill discovery command

- Created `claude/skills/SKILL.md` — prompt-only skill that discovers all skills via Glob + Read
- Groups skills into 13 workflow stages using static mapping matching `docs/skills-reference.md` sections
- Supports two modes: `list` (default, all skills) and `search <keyword>` (filter by name/description)
- Updated `docs/skills-reference.md` — added `/skills` entry to Utility section and quick reference table, bumped count 42→43

## 2026-03-27 — Phase 8 Step 3: Env path unification

- Created `claude/poketo-kanban/scripts/env-paths.mjs` — shared `ENV_SEARCH_PATHS` array (4 paths)
- Updated `kanban.mjs` to import and use `ENV_SEARCH_PATHS` instead of inline `pokePaths` array
- Updated `bootstrap-session.mjs` to import and use `ENV_SEARCH_PATHS` instead of inline 2-path fallback (was missing monorepo variants)
- Added test in `bootstrap-session.test.mjs` verifying array length and absolute paths
- All 83 tests pass (82 existing + 1 new). Phase 8 complete.

## 2026-03-27 — Phase 8 Step 2: Dry-run mode for kanban write commands

- Added `hasBoolFlag` utility and `--dry-run` checks to all 8 write commands in `kanban.mjs`
- Each dry-run outputs `{ dryRun: true, command, wouldDo }` with planned operation details, returns before any DB write
- Updated help text with `[--dry-run]` on all write commands
- Added 3 tests: create-card, move-card, delete-board — verify preview output and no DB side effects
- All 82 tests pass (79 existing + 3 new)

## 2026-03-27 — Phase 8 Step 1: Add `--board` flag to kanban search

- Added `getAllArgs` utility to `kanban.mjs` for collecting repeated flag values
- Modified `cmdSearch` to accept `--board <id>` (repeatable) — validates board belongs to org, scopes search to specified boards; falls back to all-org-boards when omitted
- Updated help text for search command
- Added 2 new tests: scoped search returns only matching board's cards, invalid board ID returns error
- All 79 tests pass (77 existing + 2 new)

## 2026-03-27 — Phase 7 Step 4: Fix backslash LIKE escape

- Fixed `kanban.mjs` line 462: added `.replace(/\\/g, '\\\\')` before `%` and `_` escapes
- Converted `it.todo` in `kanban.test.mjs` to real test — creates card with backslash in name, verifies search finds it
- All 77 tests pass (76 existing + 1 new). Phase 7 complete.

## 2026-03-27 — Phase 7 Step 3: Database error path tests

- Added 5 tests in new `describe("Database error paths")` block to `kanban.test.mjs`
- Malformed UUID rejection, FK violation on create-card, FK violation on move-card, extremely long board name, concurrent duplicate board names
- All tests hit real Postgres errors (no mocks) — verifies `main().catch()` handler works
- All 76 tests pass (71 existing + 5 new)

## 2026-03-27 — Phase 7 Step 2: install.sh tests

- Created `claude/poketo-kanban/scripts/install.test.mjs` with 8 tests using vitest + child_process
- Used vitest (existing) instead of bats-core (plan suggested) — no new dependencies needed
- Tests isolate via temp dirs with `HOME` override: symlink creation (claude/codex), idempotency, warning on non-symlink targets, symlink update, uninstall (selective removal + count), directory creation
- All 71 tests pass (53 kanban + 10 bootstrap + 8 install)

## 2026-03-27 — Phase 7 Step 1: bootstrap session tests

- Refactored `bootstrap-session.mjs` for testability: exported `loadEnv(searchPaths?)`, extracted `buildConfig(user, org)`, guarded auto-run with `import.meta.url` check
- Created `bootstrap-session.test.mjs` with 10 tests across 2 describe blocks
- `loadEnv` tests (6): KEY=value parsing, double/single quotes, comments/blanks, missing files, file merge order
- `buildConfig` tests (4): all fields present, userId/orgId match, valid ISO timestamp
- All 63 tests pass (53 existing + 10 new). CLI still works as direct-run script.

## 2026-03-27 — Phase 6 Step 2: create-list, update-card flags, error paths, card ordering

- Added 19 new tests across 4 describe blocks to `kanban.test.mjs`
- create-list: name, auto-increment order, missing --name error, missing --board error
- update-card flags: --progress (set/reset), --description (set + falsy-guard on empty), --due, combined --due+--progress
- Additional error paths: invalid board/card IDs for create-card/create-list/archive-card/move-card, missing --list
- Card ordering: first card order 0, second card order 1, moved card appends, board insertion order
- Discovered: `--description ""` is no-op (falsy guard line 243), move-card/board responses omit card `order`
- All 53 tests pass (1 todo). Phase 6 complete.

## 2026-03-27 — Phase 6 Step 1: kanban edge case tests

- Added 11 edge case tests (10 runnable + 1 `it.todo`) to `kanban.test.mjs`
- Search: `%` escape, `_` escape, unicode/emoji search, backslash (todo — known bug deferred to Phase 7)
- Move: same-list move, invalid list ID error
- Archive: archive card, double-archive idempotency
- Create: empty name validation, 500-char long name
- Done: idempotent double-done
- All 34 tests pass (24 existing + 10 new), 1 todo. Total: 35 test entries.

## 2026-03-27 — Layer 3 e2e testing: skills 7-8 (complete)

- `/sync-roadmap-kanban` (skill 7) — PASS: board resolved from `.kanban-board`, all 9 roadmap phases compared with board, Phases 1-5 deliverables verified in codebase, 5 reconciliation rules applied (1 orphan flagged, 1 expected discrepancy flagged), sync report generated
- `/kanban-archive` (skill 8) — PASS: board validated, Done/Punt lists scanned, 30-day threshold applied, no cards old enough to archive (board created 2026-03-26), correctly reported nothing to archive
- **Layer 3 complete: 8/8 skills PASS. All 3 testing layers fully pass (Layer 1: 24 tests, Layer 2: 9 skills, Layer 3: 8 skills).**

## 2026-03-27 — Layer 3 e2e testing: skills 3-6

- `/roadmap-kanban` (skill 3) — PASS: existing roadmap detected, 4 new phases added, 2 cards moved Backlog→Todo, 3 future phase cards created in Backlog
- `/run-kanban` (skill 4) — PASS: card created In Progress with hostname/branch metadata, conflict check passed, plan mode entered, progress set to 0%
- `/ship-kanban` (skill 5) — PASS: 2 logical commits shipped, card stays In Progress (step not complete), commit SHAs added to description
- `/ship-end-kanban` (skill 6) — session wrap-up: uncommitted test results shipped, card `31e37110` moved In Progress → Done, commit refs added

## 2026-03-27 — Roadmap updated: Phases 6-9 added

- Roadmap revised from 5 completed phases to 9 total (4 new planned)
- Phase 6: Testing Hardening I (edge cases + command test expansion)
- Phase 7: Testing Hardening II (bootstrap, install.sh, DB error paths, backslash fix)
- Phase 8: Kanban DX (--board flag, dry-run mode, env unification)
- Phase 9: Skill Infrastructure (discovery, dependency graph, versioning)
- Small phases (2-3 items each) for incremental shipping
- todo.md preserved for ongoing Layer 3 validation work

## 2026-03-27 — Kanban Skill Validation complete: all 9 skills pass

- Manually tested all 9 kanban skills in workflow order against real Neon DB
- Fixed `--progress` flag silently ignored in `kanban.mjs` `cmdUpdateCard`
- Added `showClearContextOnPlanAccept` setting to ship/ship-kanban/ship-then-plan plan mode steps
- Full lifecycle verified: Backlog → Todo → In Progress → Done → Archive
- Updated `docs/kanban-test-results.md` with all results
- Generated `tasks/ideas.md` with brainstormed improvements (quick wins, medium efforts, larger initiatives)

## 2026-03-27 — Phase 5 complete: try/catch for malformed config JSON

- Wrapped `JSON.parse` in `loadConfig()` with try/catch, returns `null` with stderr warning
- All 24 kanban tests pass, all Phase 5 milestone criteria met
- Phase 5 complete — all 7 expert review fixes shipped

## 2026-03-26 — Phase 5 step 6: fix stale output paths in skills-reference

- Fixed `/plan-interview` output paths: `spec.md` → `specs/[topic].md`, `interview-log.md` → `[topic]-interview.md`
- Fixed `/plan-interview-ideas` output paths: "appends to spec.md" → "writes specs/[topic].md per idea"
- Phase 5 steps 1–6 complete, step 7 remains (config JSON try/catch)

## 2026-03-26 — Phase 5 step 5: add missing codex agent manifest

- Created `codex/plan-interview-ideas/agents/openai.yaml` — the only codex skill (1 of 41) missing an agent manifest
- All 41 codex skills now have `agents/openai.yaml`
- Phase 5 steps 1–5 complete, steps 6–7 remain (stale docs paths, config JSON try/catch)

## 2026-03-26 — Expert review + Phase 5 roadmap

- Ran `/expert-review` on full project — 7 confirmed findings after false-positive verification
- Critical: database credential in tracked `docs/kanban-test-results.md`, null dereference in `cmdArchiveCard`
- High: LIKE metachar injection in search, sequential list inserts in `cmdCreateBoard`
- Medium: missing codex `plan-interview-ideas` agent manifest, stale output paths in skills-reference
- Added Phase 5 to `tasks/roadmap.md` with 7 steps to resolve all findings

## 2026-03-26 — Phase 4 complete + kanban integration tests

- Phase 3 (Board Templates) archived from remote
- Added `archive-card` command to kanban.mjs (Phase 4 Step 1)
- Created `/kanban-archive` skill (Claude + Codex) — Phase 4 Step 2
- Updated `docs/skills-reference.md` with all 9 kanban skills (33 → 42 skills)
- **Phase 4 Archive Automation complete** — all roadmap phases (1-4) done
- Ran `/analyze-sessions` on 5,332 messages across 1,912 sessions:
  - `/ship` is dominant (537 invocations + 215 manual equivalents)
  - Kanban skills never used yet — testing needed before adoption
- Added `delete-board` command to kanban.mjs for test cleanup
- Created `kanban.test.mjs` — 24 integration tests against real Neon DB, all passing
  - Board lifecycle, card CRUD, card movement, search, error handling, cleanup
- Set up `~/.poketo/config.json` on this machine for kanban DB access
- Installed vitest as dev dependency for poketo-kanban scripts

## 2026-03-26 — Phase 4 Step 1: archive-card command (superseded by entry above)

- Phase 3 (Board Templates) completed on remote — archived to `docs/phases/phase-3.md`
- Added `archive-card --id <card-id>` command to kanban.mjs
  - Looks up card → list → board chain, moves card to board's archive list
  - Auto-creates "Archive" list and sets `archiveListId` on board if none exists
  - Follows existing patterns (cmdMoveCard, cmdCreateList)
- Created `/kanban-archive` skill (Claude + Codex) — bulk-archives Done/Punt cards older than N days
- Updated `docs/skills-reference.md` — added all 9 kanban skills section + quick reference entries (33 → 42 skills)

## 2026-03-25 — Kanban skill suite, board intelligence, board templates

### Phase 3: Board Templates (in progress)
- Added `--template standard` flag to kanban.mjs — creates board with 5 lists (Backlog, Todo, In Progress, Done:done, Punt:punt) in one command
  - `--template` and `--lists` are mutually exclusive; unknown templates error with available list
  - Updated help text
- Updated Board Resolution protocol in all 12 -kanban SKILL.md files to use `--template standard` instead of verbose `--lists` string
- **Phase 3 Board Templates complete** — both steps done, milestone verified (0 old `--lists` matches, 12 `--template standard` matches)

### Earlier this session (pulled from remote)
Phases 1-2 completed, roadmap expanded with Phases 3-4.

### Original session

- Built and tested kanban-lite (SQLite) skill, then archived it after analysis showed Neon free tier costs ~$0 at our usage volume (~456 ops/month across all devices)
- Decision: stick with poketo-kanban + Neon for kanban — SQLite advantage is latency/simplicity, not cost
- Created `tasks/roadmap.md` with 3 phases: kanban-roadmap sync, cross-device agent awareness, proactive board intelligence
- Created `/sync-roadmap-kanban` skill (Claude + Codex) — Phase 1 Step 1 complete
  - Prompt-only skill that orchestrates poketo-kanban scripts, git commands, and file edits
  - 7-step process: sync → read kanban → read roadmap → check codebase → reconcile → apply → report
  - 5 reconciliation rules: done-on-kanban→roadmap, done-in-roadmap→kanban, new-items→cards, orphaned-cards→flag, false-done→flag
  - Set up `tasks/todo.md` for Phase 1 tracking
- Added board-project auto-detection — Phase 1 Step 2 complete
  - Auto-matches board name to repo directory name (case-insensitive substring)
  - Persists board ID in `tasks/.kanban-board` (committed to git for cross-device sharing)
  - Falls back to user prompt only when no match or ambiguous
- Added `--sync-kanban` opt-in flag to all workflow skills — Phase 1 Step 3 complete
  - 12 SKILL.md files updated (run, run-step, run-phases, ship, ship-end, ship-then-plan × Claude + Codex)
  - Flag triggers `/sync-roadmap-kanban` at session start; discrepancies shown but don't block
  - Phase 1 milestone complete: kanban-roadmap sync infrastructure in place
- **Phase 1 archived** to `docs/phases/phase-1.md`, transitioned to Phase 2
- Added session activity cards — Phase 2 Step 1 (later reverted)
- Reverted all kanban integration from workflow skills — decided to build separate `-kanban` skill suite instead
- Redesigned roadmap: 6 standalone `-kanban` skills (brainstorm, plan-interview, roadmap, run, ship, ship-end) with board ops baked in
- Fixed kanban.mjs `--lists` flag to support `name:type` annotations (e.g., `Done:done`, `Punt:punt`)
- Created `brainstorm-kanban` skill (Claude + Codex) — first of 6 kanban skill suite
  - Full copy of brainstorm + Board Resolution/Validation/Graceful Degradation protocols
  - Creates one Backlog card per idea (idempotent: skips existing cards)
- Created `plan-interview-kanban` skill (Claude + Codex) — 2nd of 6
  - Full copy of plan-interview + kanban sync: finds matching card by keyword search, updates with spec details
  - Searches all lists (not just Backlog), updates in place, never moves backward from Done/Punt
- Created `roadmap-kanban` skill (Claude + Codex) — 3rd of 6
  - Full copy of roadmap + kanban sync: current phase steps → Todo cards, future phases → Backlog summary cards
  - Moves matching Backlog cards to Todo, idempotent (skips existing)
- Created `run-kanban` skill (Claude + Codex) — 4th of 6 (most complex)
  - Full copy of run + session card (Todo → In Progress), cross-device conflict detection, stale session cleanup
  - Hostname/branch/time stored in card description; post-execution card update
- Created `ship-kanban` skill (Claude + Codex) — 5th of 6
  - Full copy of ship + Done/Punt card movement after shipping, next card ensured in Todo when planning
- Created `ship-end-kanban` skill (Claude + Codex) — 6th of 6, phase complete
  - Full copy of ship-end + moves In Progress card to Done with commit refs
- **Phase 1 Kanban Skill Suite complete** — all 6 skills built (18 files), kanban.mjs fixed, milestone verified
- Added Board Overview to 4 session-start kanban skills — Phase 2 Step 1
  - Surfaces overdue, starred, blocked cards + WIP/Backlog/Todo counts at session start
  - 8 SKILL.md files updated (run, brainstorm, roadmap, plan-interview × Claude + Codex)
- Added Next Work Suggestion to ship-end-kanban and ship-kanban — Phase 2 Step 2
  - After shipping, suggests top Todo card ranked by overdue > starred > list order
  - Falls back to Backlog if Todo empty, or "Board is clear" if nothing pending
- Added progress tracking to run-kanban — Phase 2 Step 3
  - Post-execution card update now includes `Progress: X/Y (Z%)` based on todo.md step counts
- **Phase 2 Proactive Board Intelligence complete** — board overview, next work suggestion, progress tracking all shipped
- Roadmap updated: added Phase 3 (board templates) and Phase 4 (archive automation) from backlog. Kanban analytics and Neon UI sync remain in backlog.

## 2026-03-24 — kanban-lite: local SQLite kanban skill

- Created new `/kanban-lite` skill — lightweight kanban boards stored in a local SQLite file, synced across machines via git commits
- Single dependency (`better-sqlite3`) with raw SQL — no ORM, no external DB, no auth
- Same CLI interface as `/poketo-kanban`: boards, board, create-card, update-card, done, move-card, create-board, create-list, search
- Added `sync` command for git pull/commit/push workflow to share board state across bismarck, desktop, and laptop
- WAL checkpoint on exit prevents `-wal`/`-shm` files from leaking into git
- Added `*.db-wal` and `*.db-shm` to `.gitignore`

## 2026-03-15 — Expert review fixes

Resolved all 10 findings from `/expert-review`:
- Fixed stale `/review` → `/expert-review` references in skills-reference.md
- Added missing `agents/openai.yaml` for brainstorm and debug codex skills
- Fixed unsafe `rm -rf` in install.sh codex path (now warns and skips like claude side)
- Deleted orphaned root `brainstorm.md`
- Added deploy step to `ship-then-plan` and `ship-end` (both claude and codex)
- Aligned deploy search order across `deploy` and `ship` skills
- Added `/brainstorm` entry to skills-reference.md, fixed skill count to 26
- Removed inconsistent `allowed-tools` from `ship` and `ship-then-plan`
- Rewrote "CI tests" → "tests" in provision-agentic-config
- Removed stale `docs/` plan reference from `ship-end`

## 2026-03-18 — Brainstorm output & plan-interview-ideas skill

- Updated `/brainstorm` (Claude + Codex) to append suggestions to `tasks/ideas.md`
- Created new `/plan-interview-ideas` skill (Claude + Codex) that reads `tasks/ideas.md` and runs a plan-interview for each idea sequentially
- Expanded brainstorm dimensions: added Strategic/Product tier (new features, new workflows, product line expansion) and reorganized into Strategic → Improvement → Hygiene

## 2026-03-20 — Spec-per-file, ship error fixing, project sync.md

- Moved spec output from single `spec.md` to individual `specs/[topic].md` files across `plan-interview` and `plan-interview-ideas` (Claude + Codex)
- Updated all downstream spec consumers (`roadmap`, `plan-phases`, `brainstorm`, `expert-review`) to check `specs/` directory with `spec.md` fallback
- Added "fix unrelated issues" constraint to all ship skills (`ship`, `ship-end`, `ship-then-plan` — Claude + Codex)
- Created project-level `sync.md` to run `install.sh` after pulls for symlink updates

## 2026-03-23 — False-positive verification & TDD test status clarity

- Added false-positive verification steps to `/expert-review` (step 6) and `/dead-code` (step 7) — both Claude + Codex
- Added explicit TDD test status reporting to summaries of `/run`, `/run-step`, `/ship`, `/ship-end`, `/ship-then-plan` (all Claude + Codex) — must state whether failing tests are expected (red phase) or unexpected (regressions)

## 2026-03-23 — Expert-review false-positive filter (superseded by entry above)

- Added step 6 "Verify findings" to `/expert-review` (Claude + Codex) — re-reads source code for every finding before reporting, drops unconfirmed findings, downgrades uncertain ones to Low

## 2026-03-20 — Sync skill: project-level sync.md support

- Added Step 5 (post-sync actions) to `/sync` skill (Claude + Codex)
- If `sync.md` exists at project root: parses and executes Dependencies, Conflict Resolution, Custom, and Notifications sections
- If `sync.md` doesn't exist: analyzes project, suggests a pre-filled `sync.md`, creates only with user approval
- Updated constraints for command failure handling, commented-out section skipping, and conflict resolution guidance

## 2026-04-02 — Roadmap: add Headless API Migration phase

- Audited Codex kanban skills against the local skill repo and Poketo monorepo headless surfaces
- Identified the main architectural gap: kanban skills still rely on direct Neon DB writes via `kanban.mjs`, and Codex variants depend on Claude-side install paths
- Added Phase 10 to `tasks/roadmap.md` to migrate Claude and Codex kanban workflows onto a shared Poketo headless API path
- Captured the concrete migration scope in the roadmap: agent-friendly auth, real Work tool wiring, shared gateway/API operations, Claude migration, Codex migration, and deprecation of the standalone DB-write path

## 2026-04-06 — Phase 10 Step 3: CLI kanban subcommand + key management (Gateway Phase 5)

- Implemented `poketo kanban` command with 12 subcommands mapping to gateway actions (board.getAll, board.getById, board.create, board.delete, list.create, card.create, card.update, card.move, card.markDone, card.archive, card.search, boardAction.list)
- Added `poketo auth create-key/list-keys/revoke-key/rotate-key` subcommands using session token auth
- Created table formatter (`format.ts`) for `--format table` output
- Fixed pre-existing tsconfig type errors by adding `types: ["node"]`
- All 37/37 CLI tests pass, typecheck clean
- Gateway Phase 5 milestone complete in Poketo monorepo

## 2026-04-07 — Skill shipping docs: align feature-branch push guard wording

- Verified that all repo-managed Claude and Codex skills are correctly symlinked into `~/.claude/skills` and `~/.codex/skills`
- Updated Codex shipping docs (`run`, `ship`, `ship-end`) to explicitly defer push behavior to `commit-and-push-by-feature`
- Updated Claude shipping docs (`ship`, `ship-end`) to remove unconditional "push current branch" wording and clarify that existing feature branches are commit-only

## 2026-04-08 — Shipping skills: require main/master landing + push

- Updated `commit-and-push-by-feature` in both Codex and Claude to resolve a primary branch (`main`, fallback `master`), move work there safely, and push there on success
- Updated `run`, `ship`, and `ship-end` in both Codex and Claude to treat `commit-and-push-by-feature` as an actual commit-and-push workflow targeting `main`/`master`
- Reflected the new shipping policy in `tasks/todo.md` current-state notes now that roadmap execution is complete
# 2026-04-13 — Refactor skills into global core and project-local packs

- Reorganized skill sources from flat `claude/` and `codex/` roots into `global/` and `packs/`.
- Added project-local pack management with `scripts/pack.sh` and global `/pack` / `$pack` skills.
- Moved business/product research workflows into the `business-app` pack; added initial `game` and `devtool` packs.
- Updated `install.sh` so global install includes only neutral core skills and cleans up old flat-root/stub links.
- Updated skill audit/version scripts, installer tests, pack tests, and docs for the new layout.

# 2026-04-13 — Split PoketoWork kanban into explicit opt-in packs

- Removed PoketoWork-specific `--kanban` modes and `poketo` tool permissions from global workflow skills.
- Added explicit `business-app-kanban`, `game-kanban`, and `devtool-kanban` packs containing only the six kanban workflow variants.
- Moved direct PoketoWork board utilities into the separate `poketowork-kanban` pack.
- Updated pack documentation and `scripts/pack.sh` so kanban variants are never installed implicitly by base domain packs.
- Verified skill dependency/version audits, pack install smoke tests, and the moved Poketo kanban test suite.

## 2026-04-14 — install.sh macOS Bash compatibility

- Fixed `install.sh` to avoid Bash nameref variables (`local -n`), which are unavailable in the macOS default Bash 3.2.
- Replaced nameref return values with a validated `printf -v` helper while preserving existing installer behavior and output.
- Fixed `scripts/pack.sh` empty-array writes under `set -u`, which surfaced as stderr during the pack removal test.
- Upgraded the Poketo kanban script package to `drizzle-orm` 0.45.2 to resolve the high-severity SQL identifier escaping advisory reported by `npm audit`.
- Verified `bash install.sh` succeeds on macOS Bash 3.2 and the Poketo kanban script test suite passes.

## 2026-04-16 — Research roadmap documentation queue

- Ran the queued `$research-roadmap` step after all implementation roadmap phases were complete.
- Inferred this repository as a devtool project from its skill-pack and CLI/documentation structure.
- Added a priority documentation queue to `tasks/todo.md` covering missing devtool research artifacts, missing docs-audit output, spec drift, and the follow-up roadmap refresh.
- Marked the prior `$research-roadmap` priority task complete and set the next action to `$devtool-user-map`.

## 2026-04-19 — Phase 11 Step 2: mode resolution

- Added optional `agent_mode` field to `.agents/project.json` schema (`claude-only | codex-only | hybrid`).
- Extended `scripts/pack.sh` with a `set-mode <mode|unset>` subcommand and made `install`/`remove`/`refresh` preserve an existing `agent_mode` value across rewrites.
- Added `scripts/agent-mode.sh` resolver: precedence `SKILLS_AGENT_MODE` env > `.agents/project.json` > empty string; invalid values hard-fail from both the setter and the resolver.
- Updated `docs/operating-modes.md` "Mode Signal" section to present-tense usage and mentioned the surface in `README.md`.
- Verified end-to-end on stock macOS Bash 3.2 in a scratch tmpdir: write/preserve across install/refresh, env override, `unset` clearing, and hard-fail on bogus values. No SKILL.md files consume the signal yet — that is Phase 11 Step 7.

## 2026-04-22 — Agent-team auto-dispatch for `/run` + `patch-exec-profile`

- Added `global/claude/patch-exec-profile/SKILL.md`: audits `agent-team` / `implementation-safe` execution profiles in `tasks/todo.md`, infers obvious `Mode` / `Depends on` values, flags ambiguous write lanes via `AskUserQuestion`, and validates disjoint `Owns` and acyclic lane DAGs.
- Updated `global/claude/run/SKILL.md` step 6b to auto-invoke `/patch-exec-profile` when an `agent-team` profile has missing or placeholder lane metadata, then build a lane DAG and topological waves for the plan-mode presentation. Added an `#### Agent-Team Dispatch` section specifying worktree-isolated `Agent` dispatch per write lane, write-boundary validation via `git diff --name-only`, integration via `git restore --source` (captures deletions, unlike `git checkout -- <paths>`), worktree/branch cleanup, and a blocker/advisory review-findings contract.
- Strengthened `global/claude/plan-phase/SKILL.md` guidance: `agent-team` profiles must fill concrete `Mode` / `Depends on` / `Owns` / `Must not edit` on every lane, with downgrade paths to `implementation-safe`, `research-only`, or `serial` otherwise.
- Registered `patch-exec-profile` in `README.md` global-core list and `docs/skills-reference.md` skills table. Ran `./install.sh` to symlink the new skill.
- Codex `/run` left unchanged — agent-team auto-dispatch is a Claude-side capability (requires `Agent` tool with `isolation: "worktree"`).

## 2026-04-22 — `$spec-drift` fix: approval-packet handoff wording

- Corrected `docs/operating-modes.md` § "Approval packet" (line 51) to stop claiming that `codex-only` cross-session handoff uses the shared approval packet. Packet-producing handoff is Claude-side only (`/handoff --target=codex`).
- Expanded the handoff row in the skills matrix (line 192) to disambiguate Claude `/handoff --target=codex` (produces packet) from Codex `$handoff` (writes prose only to `tasks/handoff.md`, no packet).
- Added a disambiguation note under `global/codex/handoff/SKILL.md` § "Constraints": `$handoff` does not write `.agents/approved-plan.json` or `tasks/approved-plan.md`; for packet-gated resume, use Claude-side `/handoff --target=codex` + `$run --execute-approved`.
- Recorded the fix in `specs/drift-report.md` and checked off the queue item in `tasks/todo.md` § "Priority Documentation Todo". Doc-only change; no skill, schema, or script behavior touched.

## 2026-04-29 — Add first-class UAT skill and clarify dogfood scope

- Added mirrored `uat` skills for Claude and Codex focused on target-user acceptance journeys, role-based criteria, and evidence capture.
- Updated `dogfood` in both platforms to remove the former UAT-proxy framing and define dogfood as owner/operator adoption into the builder's workflow.
- Registered `uat` in the global skill docs and added a `dogfood` reference entry to `docs/skills-reference.md`.
- Verified skill metadata and dependency references with `./scripts/skill-deps.sh --broken` and `./scripts/skill-versions.sh --missing`.

## 2026-04-30 — Devtool monetization research artifact

- Created `research/devtool-monetization.md` from the completed devtool research chain, especially `research/devtool-positioning.md`.
- Recommended preserving the free/local-first core and monetizing team enablement, private pack design, maintained pack subscriptions, advisory implementation, and a future optional managed layer only after repeated demand.
- Covered free/open-source boundaries, packaging, usage limits, team conversion, enterprise triggers, unit economics, pricing anchors, and monetization risks.
- Marked `$devtool-monetization` complete in `tasks/todo.md` and planned the next queue item, `$spec-drift fix all`.

## 2026-04-30 — Spec drift refresh after project fleet orchestration

- Archived the previous drift report to `docs/history/archive/2026-04-30/180205/specs/drift-report.md`.
- Replaced `specs/drift-report.md` with a fresh `$spec-drift fix all` audit covering the current spec inventory and recent 2026-04-30 changes.
- Verified active specs against implementation/docs: approval-packet schema, code-quality pack layout and aliases, Poketo headless migration status, and legacy kanban fallback banners.
- Found no Error or Warning drift requiring user arbitration or implementation work.
- Recorded one Info finding: `$project-fleet` is a public Codex skill documented in README and linked from `clone-spec-store`, but it has no dedicated canonical spec yet. Deferred optional `specs/project-fleet.md` until the workflow needs durable spec coverage.
- Marked `$spec-drift fix all` complete in `tasks/todo.md` and planned a `$research-roadmap` refresh as next work.

## 2026-04-30 — Bootstrap repo skill

- Added mirrored `bootstrap-repo` skills under `global/claude/` and `global/codex/`.
- The new skill writes or preserves `README.md` from a user-supplied project brief, prompts when the brief is missing, and delegates agent workflow doc setup to `provision-agentic-config`.
- Added Codex UI metadata in `global/codex/bootstrap-repo/agents/openai.yaml`.
- Registered the skill in the global core lists in `README.md` and `docs/skills-reference.md`.

## 2026-04-30 — Research roadmap refresh after documentation queue completion

- Re-ran `$research-roadmap` after completing devtool positioning, monetization, and spec-drift refresh work.
- Inferred the repository as a devtool project from repo signals and `packs/devtool` because `.agents/project.json` is absent.
- Confirmed canonical documentation roots are top-level `research/`, `specs/`, and `tasks/`.
- Confirmed the six fallback devtool research outputs are present and current: `research/devtool-user-map.md`, `research/devtool-integration-map.md`, `research/devtool-dx-journey.md`, `research/devtool-adoption.md`, `research/devtool-positioning.md`, and `research/devtool-monetization.md`.
- Promoted the one remaining default-flow devtool documentation item: `$devtool-docs-audit` to create `research/devtool-docs-audit.md`.
- No record or recurring documentation advisory tasks were needed.

## 2026-05-01 — Devtool contextual next-skill routing

- Confirmed the reported gap: `$research-roadmap` referenced the devtool default flow, but its fallback devtool map omitted `$devtool-docs-audit`, and the individual devtool pack skills did not emit contextual next-skill guidance.
- Added `## Next-Skill Routing` to all mirrored devtool pack skills for Claude and Codex.
- Updated `devtool-docs-audit` so it writes `research/devtool-docs-audit.md`, allowing research-roadmap to track the artifact.
- Added docs audit to both research-roadmap fallback maps and documented the full devtool order through the final research-roadmap confirmation pass.
- Verified with targeted grep checks, `/opt/homebrew/bin/bash ./scripts/skill-deps.sh --broken`, and `/opt/homebrew/bin/bash ./scripts/skill-versions.sh --missing`. Direct script invocation still uses macOS Bash 3.2 in this shell and fails on the scripts' existing associative arrays.
