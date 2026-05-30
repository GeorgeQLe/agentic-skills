## Current Targeted Update: Product-Path Research Scoping 2026-05-30

**Goal:** Make research-path-aware skills resolve `research/{product-slug}/` product paths before code/app structure exists, exclude archived paths from active targeting, and clarify product-line archive/restore/activate/promote operations.

**Acceptance Criteria:**
- [x] Codex and Claude business-discovery and customer-lifecycle skills use product-path scope resolution instead of app-scope/monorepo-gated research path selection.
- [x] Downstream business-growth, business-ops, product-design, product-testing, and research-admin readers filter `research/_archive/`, legacy `abandoned`, and inactive product-path statuses out of active target selection.
- [x] `research/.progress.yaml` manifest schema supports `archived`, `promoted_at`, `archived_at`, `archive_reason`, `active_paths`, and backward-compatible `active_path`/`abandoned` reads.
- [x] `product-line` distinguishes `activate`, `archive`, `restore`, and `promote` to app graduation.
- [x] Focused static and layer1 fixture checks cover empty, single, multiple, active manifest, archived-only, legacy `abandoned`, migration guidance, and product-line operations.

**Result:** Product-path research scoping now resolves active non-archived `research/{slug}/` paths before code/app hints, preserves flat single-product compatibility, and documents archive/restore/activate/promote product-line operations with focused regression coverage.

## Current Targeted Update: Plain-Text Skill Opportunity Analysis 2026-05-29

**Goal:** Analyze full local Claude and Codex user history for recurring plain-text requests or commands that should become reusable skills, then map each candidate to the most appropriate pack.

**Acceptance Criteria:**
- [x] Full available Claude and Codex user histories are parsed, including compact prompt history and rich Codex session metadata where available.
- [x] Repeated plain-text workflow patterns are grouped with counts and representative examples, excluding system/developer/tool output text.
- [x] Each high-value pattern is mapped to a proposed skill name, recommendation rationale, and likely pack ownership.
- [x] `alignment/analyze-sessions-plain-text-skill-opportunities.html` renders the full report with evidence matrix, confidence register, and review gates.
- [x] Verification passes or blockers are documented, and unrelated dirty worktree files are preserved.

**Result:** Parsed 11,709 local compact user-history records across 3,538 Claude/Codex sessions, enriched with 663 Codex rich session metadata files. The highest-confidence plain-text skill opportunities are `plain-text-ship`, `plan-implementation-runner`, `staging-deploy-smoke`, `what-now`, `agent-instructions-update`, `test-failure-fixer`, `review-fix-runner`, `visual-polish-pass`, `task-doc-sync`, and `skill-visibility-repair`, with pack ownership proposed in the alignment page.

## Current Targeted Update: Codebase Status AFPS Routing 2026-05-29

**Goal:** Update mirrored `codebase-status` skills so status-route recommendations use canonical AFPS routing evidence, respect pack availability, and distinguish research/prototype gaps from executable work, shipping work, and completed queues.

**Acceptance Criteria:**
- [x] Mirrored Codex and Claude `codebase-status` skills are archived, bumped to v0.2, and changelogs record the routing update.
- [x] `codebase-status` requires reading `docs/pack-workflow-matrix.md` and `docs/skill-next-step-contracts.md` when product/research/spec artifacts exist.
- [x] Before recommending another AFPS research/product skill, `codebase-status` consults the last completed relevant skill's `## Next Steps` contract and checks pack availability.
- [x] Phase-aware routing is explicit: missing research/prototype artifacts use canonical AFPS order; actionable task work routes to exec; dirty/unpushed/unvalidated completion routes to ship; exhausted work routes to brainstorm.
- [x] Focused layer1 tests and required validation pass or blockers are documented, and intended changes are committed and pushed on `master`.

## Current Targeted Update: Pack Install Issue Session Analysis 2026-05-29

**Goal:** Use full available Claude and Codex conversation history plus repository pack-install evidence to explain recurring `pack install` friction and distinguish current fixed issues from remaining workflow risks.

**Acceptance Criteria:**
- [x] Full available Claude and Codex user histories are parsed for pack install, pack refresh, skill visibility, and missing-skill patterns.
- [x] Findings distinguish explicit conversation evidence from inference and current repository state.
- [x] Root causes are grouped by runner impact: Claude, Codex, and shared pack workflow.
- [x] `alignment/analyze-sessions-pack-install-issues.html` renders the report, evidence matrix, assumptions, and review gates.
- [x] Verification passes or blockers are documented, and unrelated dirty worktree files are preserved.

**Result:** The analysis points to a compound failure mode: successful filesystem installs do not hot-reload into running sessions, natural-language install phrases are still brittle, older Codex symlink-style installs broke `$` skill discovery until the managed real-file repair, and Codex pack-install runs repeatedly encountered launcher/CWD/sandbox/filesystem blockers.

## Current Targeted Update: Idea Scope Brief Documentation Refresh 2026-05-28

**Goal:** Update active non-archive documentation and showcase fixtures so `idea-scope-brief` is the current global skill name and stale legacy naming is not user-facing.

**Acceptance Criteria:**
- [x] Active non-archive docs, task notes, and showcase workflow tests use `idea-scope-brief` / idea scope brief terminology.
- [x] Historical rename notes preserve meaning without advertising the old command as active.
- [x] Targeted stale-reference search excluding archives returns no matches.
- [x] Showcase tests, generated showcase data checks, skill/doc sanity checks, and whitespace checks pass.
- [x] Intended documentation/test/generated-data changes are committed and pushed on `master`; unrelated untracked `ALIGNMENT-PAGE.md` files are left untouched.

## Current Targeted Update: Codex Dollar Skill Discovery Repair 2026-05-28

**Goal:** Fix Codex `$` skill discovery so user-installed and project-enabled agentic-skills commands are visible, while unrelated external/plugin skills do not mask the intended command surface.

**Follow-up 2026-05-28:** The prior managed-directory refresh still left `SKILL.md` entries as symlinks, which current Codex discovery can miss when it enumerates real files only.

**Follow-up Acceptance Criteria:**
- [x] Installed global and project-local skill directories are inspected against real-file discovery.
- [x] Active managed installs copy skill contents into managed directories, excluding `archive/`.
- [x] Pinned archive installs keep the existing symlink behavior.
- [x] Global and project-local installs are refreshed locally and real-file discovery sees the expected Codex skills.
- [x] Focused validation passes, review notes are recorded, and intended tracked changes are committed and pushed on `master`.

**Acceptance Criteria:**
- [x] Current installed/user skill roots and project-local skill roots are inspected without overwriting unrelated user changes.
- [x] The discovery mismatch is reproduced or ruled out with repository scripts and filesystem evidence.
- [x] The root cause is fixed at the smallest responsible install/pack/discovery surface.
- [x] Focused validation proves expected skills are discoverable and unrelated archive/random entries are excluded or de-prioritized.
- [x] Review notes are recorded, intended tracked changes are committed, and pushed on `master`.

# Roadmap: Claude Skills

> Generated from: tasks/roadmap.md (existing), specs/board-flag-kanban-search.md, tasks/ideas.md, tasks/history.md
> Date: 2026-03-27 (last updated 2026-05-17)
> Total Phases: 43 (40 complete, 3 planned)

## Summary

Phases 1-11 complete: kanban skill suite, board intelligence, templates, archive automation, expert review fixes, test hardening (83 tests), kanban DX, skill infrastructure, the shared Poketo headless API migration for both Claude and Codex, and the three-mode operating model (`claude-only` / `codex-only` / `hybrid`) with shared approval-packet contract and next-step routing.

Phases 12-31 complete. Phase 14 added the LinkedIn evidence lane to the creator foundation workflow with owner exports, manual snapshots, public unauthenticated captures, redaction gates, shared evidence-schema/dossier routing, and deterministic layer1 contract coverage. Phase 16 hardened mutation-capable skill contracts with final next-step routing language and an audit that catches future omissions. Phase 17 added mixed-monorepo pack routing so one repository can carry devtool, business-app, game, or other domain scopes without forcing one global designation. Phase 18 hardened pack lock recovery after a `pitwall-monorepo` refresh timeout. Phase 19 added a YouTube description and metadata optimization lane to the creator-media pack. Phase 20 added external YouTube video research lanes for comprehension, format/Remotion-style analysis, and competitive learning. Phase 21 hardened default mutation/shipping quality gates from the session workflow audit. Phase 22 added feature-interview as the triage step between brainstorm ideas and full specifications. Phase 23 added targeted-skill-builder for focused skill creation or updates from concrete workflow gaps without defaulting to broad session-history analysis. Phase 24 added install-agentic-skills for refreshing global skill links and routing pack access through the existing project-local workflow. Phase 25 added codebase-status for read-only repo status reports with local history evidence. Phase 26 added the monorepo pack V1. Phase 27 added targeted skill retrospectives to analyze-sessions; Phase 28 split that focused behavior into session-triage. Phase 29 added opt-in live-agent behavior tests. Phase 30 deepened feature-interview into evidence-backed feature intake. Phase 31 hardened parallel agent-team branch/PR isolation.

Phases 32-36 complete. Phase 35 added repository-wide Codex benchmark coverage metadata, custom or explicitly blocked coverage for every current skill, and future skill creation/update workflows require benchmark coverage handling. Phase 36 added rubric-based output-quality evaluation on top of the contract/assertion benchmark checks.

Phase 37 complete: preserved and migrated the static Skills Showcase into a minimal Next.js app at `apps/skills-showcase/` with 6 public routes, generated data pipeline, 54 regression tests, and updated deploy contract. Phase 38 complete: added Neon-backed first-party newsletter capture with tRPC contracts, TanStack Query mutation/admin state, admin export page, 74 regression tests, and privacy posture enforcement. Phase 39 complete: added benchmark results visibility and permission-gated safe Git integration fixtures for benchmarkable git-mutating skills. Phase 40 complete: added the `/workflows` hybrid replay pilot so benchmark evidence becomes primary step-by-step proof before the pattern is expanded to other showcase surfaces. Phase 42 complete: refined `/workflows` into a persistent ChatGPT/Claude-style transcript with validated desktop/mobile layout. Phase 41 remains deferred and builds out persisted benchmark result coverage for the remaining tracked skills in controlled batches.

Current brand decision: the public site brand is **G Skillpacks** and the production domain is `gskillpacks.com`. Future site work should keep public UI, metadata, docs, and information architecture aligned around skill packs language while reserving `agentic-skills` for the underlying open-source library/repository.

## Current Targeted Update: Remove Stale Research Bootstrap Benchmark Rows 2026-05-27

**Goal:** Remove active benchmark coverage/setup references to the deleted `research-bootstrap` skill while preserving historical benchmark artifacts and task notes.

**Acceptance Criteria:**
- [x] `research-bootstrap` is removed from active benchmark coverage registries.
- [x] `research-bootstrap` is removed from active pack workflow benchmark fixture setup rows.
- [x] Active test/registry paths no longer reference `research-bootstrap`, excluding historical benchmark run artifacts.
- [x] Benchmark coverage, focused layer1 coverage guard, whitespace checks, and intended commit/push complete on `master`.

## Current Targeted Update: Sync Canonical Agent Config Check 2026-05-27

**Goal:** Update mirrored `sync` skills so sync checks root `CLAUDE.md` and `AGENTS.md` against the canonical provisioned blocks embedded in the installed `provision-agentic-config` skill, not just the provision version comment.

**Acceptance Criteria:**
- [x] Mirrored Claude and Codex `sync` skills are archived, bumped, and changeloged.
- [x] Sync still reports stale/missing `<!-- provision-agentic-config vX.Y -->` comments.
- [x] Sync extracts the canonical Required Claude Block and Required AGENTS Block from the installed or repo-local `provision-agentic-config` skill and compares normalized content against root `CLAUDE.md`/`AGENTS.md`.
- [x] Drift warnings name the affected file and recommend re-running the appropriate provision command.
- [x] Focused validation passes, review notes are recorded, and intended changes are committed and pushed on `master`.

## Current Targeted Update: Product Path Manifest for Research Workflows 2026-05-27

**Goal:** Update existing research/planning skill contracts so multiple product lines, ICPs, app paths, pivots, route experiments, and expansion candidates are tracked as product paths in `research/.progress.yaml`, while keeping downstream work scoped to the active path by default.

**Acceptance Criteria:**
- [x] `idea-scope-brief`, `icp`, `competitive-analysis`, `platform-strategy`, `feature-interview`, `ux-variations`, and `research-roadmap` define or consume the product-path manifest where appropriate.
- [x] The manifest schema uses `active_path` and `product_paths[]` entries with `id`, `label`, `source_skill`, `scope_path`, `status`, `reason`, `evidence_refs`, `revisit_trigger`, `next_skill`, and `last_touched`.
- [x] Skill contracts consistently use product-path/product-line/app-scope terminology for research divergence and avoid confusing this with git branch or parallel implementation branch workflows.
- [x] Deferred paths do not force full competitive analysis, positioning, journey mapping, UX, or spec work unless promoted.
- [x] Active changed `SKILL.md` files are archived, version-bumped, and changelogs updated.
- [x] Focused layer1 tests, skill metadata validation, showcase generation/validation, whitespace checks, and install validation pass or blockers are documented.
- [x] Review notes are recorded and intended changes are committed and pushed on `master`.

## Current Targeted Update: AFPS Alignment Preview Gate Audit 2026-05-27

**Goal:** Investigate whether later AFPS workflow skills can plausibly skip, delay, or weaken the required HTML alignment preview because their local contracts only inherit the shared Alignment Page convention, place the Alignment Page section after write instructions, or lack an Alignment Page section entirely.

**Acceptance Criteria:**
- [ ] Active Codex and Claude AFPS skill contracts are audited across the default sequence: `icp -> competitive-analysis -> journey-map -> positioning -> ux-variations -> ui-interview -> prototype -> uat -> consolidate-variations -> research-roadmap -> spec-interview -> roadmap`.
- [ ] Skills are classified by preview-gate strength: explicit report-first gate, shared-convention-only gate, ambiguous/write-first ordering, conditional approval, or missing Alignment Page section.
- [ ] The audit determines whether `ux-variations`, `ui-interview`, `uat`, `consolidate-variations`, `research-roadmap`, `spec-interview`, `prototype`, and `roadmap` need local report-first approval language, mode-specific overrides, or exemption language.
- [ ] Any confirmed gaps are fixed minimally with mirrored Claude/Codex updates, archive/version/changelog handling where `SKILL.md` files change, and focused regression coverage.
- [ ] Verification passes or blockers are documented, unrelated dirty worktree files are preserved, and intended changes are committed and pushed on `master`.

## Current Targeted Update: Exec Loop Run Rename 2026-05-26

## Current Targeted Update: Journey Map Alignment Page and AFPS Clunkiness Investigation 2026-05-27

**Goal:** Confirm whether `$journey-map` sometimes lacks a clear requirement to create an HTML alignment preview before approval, and compare related conversation evidence for `$journey-map`/`$positioning` friction against the first AFPS research skills.

**Acceptance Criteria:**
- [x] Active journey-map and positioning contracts are compared against ICP, competitive-analysis, and upstream AFPS workflow expectations.
- [x] Related local conversation/session history is searched for evidence of alignment-page friction, route friction, and clunkiness around journey-map/positioning.
- [x] User claims are classified as confirmed, partially correct, or unsupported with file/history evidence.
- [x] Any confirmed contract gap is fixed minimally with archive/version/changelog handling and focused regression coverage.
- [x] Verification passes or blockers are documented, and intended changes are committed and pushed on `master` unless no repository mutation is needed.

**Result:** Updated on 2026-05-27. Confirmed that `journey-map` was weaker than the first AFPS research skills and `positioning`: it lacked the explicit report-first alignment-preview gate, so agents could plausibly stop at a chat lifecycle summary instead of creating the HTML approval page. Mirrored journey-map skills were archived and bumped to v0.4 with report-first alignment preview requirements and journey-specific translation guidance. Focused regression coverage and generated showcase validation passed.

**Goal:** Rename the exec-loop `run` skill to `exec` for Claude and Codex so the project-local command does not collide with Claude's default `/run` surface.

**Acceptance Criteria:**
- [x] User claim is validated against active exec-loop skill locations and references.
- [x] Active Claude and Codex exec-loop skills move from `run` to `exec`, with frontmatter, invocation text, and command references updated.
- [x] Prior v0.0 skill contracts are archived before the active skills are bumped to v0.1, with changelogs added.
- [x] Pack metadata, workflow docs, tests, and generated showcase data no longer advertise `$run` or `/run` as the exec-loop command where `exec` is intended.
- [x] Focused validation passes, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-26. The exec-loop execution command is now `/exec` for Claude and `$exec` for Codex. Previous v0.0 `run` contracts are archived, active skills are bumped to v0.1 with changelogs, routing/docs/benchmark coverage references are updated, and generated Skills Showcase metadata was refreshed. Focused validation passed; the broader benchmark setup suite still has unrelated legacy `$run`/`global/...` expectations to clean up separately.

## Current Targeted Update: Rename Old Run References To Exec 2026-05-26

**Goal:** Finish the command-surface migration by replacing active execution-skill references to `/run`, `$run`, `run-kanban`, and `mono-run` with `/exec`, `$exec`, `exec-kanban`, and `mono-exec`, while preserving ordinary verb usage and historical benchmark run artifacts.

**Acceptance Criteria:**
- [x] Active `SKILL.md` files no longer contain old execution command tokens outside archives.
- [x] Kanban wrapper skills are renamed from `run-kanban` to `exec-kanban`, archived, version-bumped, and given changelogs.
- [x] Monorepo wrapper skills are renamed from `mono-run` to `mono-exec`, archived, version-bumped, and given changelogs.
- [x] Pack metadata, docs, benchmark coverage/setup surfaces, manifests, and generated showcase data use the renamed command surfaces.
- [x] Validation passes or unrelated pre-existing failures are documented.

**Result:** Updated on 2026-05-26. Active execution-wrapper commands now use `exec-kanban` and `mono-exec`, with previous v0.0 contracts archived and active wrappers bumped to v0.1. Command references, metadata, benchmark coverage/setup fixtures, and generated Skills Showcase assets were refreshed. Focused validation passed; the next-step routing script still reports unrelated existing missing routing contracts.

## Current Targeted Update: ICP Willingness-to-Pay Signals 2026-05-25

**Goal:** Incorporate willingness-to-pay (WTP) evidence into the mirrored ICP skills as a bounded discovery signal, without turning ICP research into pricing strategy or monetization design.

**Acceptance Criteria:**
- [x] Mirrored Codex and Claude `icp` skills gather WTP evidence during broad and candidate-specific research.
- [x] ICP outputs include WTP signal strength, budget owner/context, paid alternatives, switching-cost evidence, and pricing sensitivity cues as problem-space evidence.
- [x] Value scoring uses WTP quality and economic urgency, not only generic budget signals.
- [x] WTP observations are routed to monetization as raw downstream signals, while pricing recommendations remain out of ICP scope.
- [x] Skills are archived, version-bumped, changelogs updated, focused validation passes, and intended changes are committed and pushed on `master`.

## Current Targeted Update: Benchmark HTML Alignment Page Evaluation 2026-05-25

## Current Targeted Update: Cross-Skill Output Understanding Audit 2026-05-25

**Goal:** Use `$analyze-sessions` to scrutinize whether outputs across all skills improve user-agent understanding, with particular attention to HTML alignment pages, final handoffs, route-command clarity, and recurring user corrections.

**Acceptance Criteria:**
- [x] Full available Claude and Codex user history is parsed for cross-skill patterns, not just one named skill.
- [x] The audit distinguishes evidence-backed findings from inference and assumptions.
- [x] Output quality patterns cover alignment pages, final handoffs, approval gates, routing commands, task-doc updates, and skill-specific misunderstandings where history supports them.
- [x] `alignment/analyze-sessions-cross-skill-output-understanding-audit.html` renders the full report with evidence matrix, confidence/assumption register, and required review gates.
- [x] The HTML review page is verified, browser open is attempted, and downstream routing is withheld until compiled YAML approval.

**Result:** Updated on 2026-05-25. Parsed 11,386 local user-history records across Claude and Codex and built the cross-skill review page at `alignment/analyze-sessions-cross-skill-output-understanding-audit.html`. The audit finds alignment pages are improving understanding when they preserve full decision context and inline decision gates, but cross-skill output quality still needs tighter scope control, research freshness/date context, route handoff validation, and operational-loop approval exemptions. Browser open was attempted but blocked by missing local browser handlers and the WSL bridge.

## Current Targeted Update: Split-Path Product Research Workflow Analysis 2026-05-25

**Goal:** Investigate previous Claude and Codex conversations for recurring cases where research surfaces multiple plausible ICP, product-line, pivot, or problem-focus branches, then recommend how workflow skills should handle branches without bogging down in full-depth evaluation of every variation.

**Acceptance Criteria:**
- [x] Full available Claude and Codex user history is parsed for split-path workflow evidence, not only the current repo task logs.
- [x] Findings separate observed evidence from inference and include real examples from prior conversations.
- [x] Recommendation covers when to keep, prune, park, merge, compare, or split branches across existing product-discovery skills.
- [x] The report identifies the likely owner surface for any durable workflow change and the expected validation shape.
- [x] `alignment/analyze-sessions-split-path-product-research-workflow.html` renders the full report with evidence matrix, assumptions/confidence, recommended path, proposed file changes, and approval gates.
- [x] The HTML review page is verified, browser open is attempted, and downstream routing is withheld until compiled YAML approval.

**Result:** Updated on 2026-05-25. Parsed 11,407 local Claude/Codex user-history records and built the split-path workflow review page at `alignment/analyze-sessions-split-path-product-research-workflow.html`. The audit finds branch discovery is valuable but branch commitment needs a shared governor: screen all plausible branches at triage depth, deepen one primary branch by default, allow a second branch only for true separate product-line or materially distinct ICP/problem cases, and park/merge/kill/route the rest through explicit branch verdicts. Browser open was attempted but blocked by missing local browser handlers and the WSL bridge.

## Current Targeted Update: Provision Agentic Config WSL Browser Open Fallback 2026-05-25

**Goal:** Ensure newly provisioned `CLAUDE.md` and `AGENTS.md` files include the verified PowerShell `file://wsl.localhost` browser-opening fallback for WSL HTML files, and bring this repository's root `CLAUDE.md` into parity with `AGENTS.md`.

**Acceptance Criteria:**
- [x] Mirrored `provision-agentic-config` skills are archived, version-bumped, and changelogs updated.
- [x] The generated Claude and AGENTS blocks include Windows/WSL file opening guidance with the PowerShell `file://wsl.localhost/<distro>/...` fallback.
- [x] Root `CLAUDE.md` includes the same browser-opening fallback already present in root `AGENTS.md`.
- [x] Focused validation passes, including version, routing, content, and whitespace checks.
- [x] Intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-25. Mirrored `provision-agentic-config` skills now generate both `CLAUDE.md` and `AGENTS.md` with Windows/WSL browser-opening guidance, including the PowerShell `file://wsl.localhost/<distro>/...` fallback for HTML files when UNC launch fails. Root `CLAUDE.md` was brought into parity with root `AGENTS.md`. Focused version, routing, provision benchmark setup, content, generated-data, and whitespace checks passed.

**Goal:** Make benchmark tests actually evaluate generated HTML alignment pages instead of only the primary Markdown/text artifact.

**Acceptance Criteria:**
- [x] Investigation validates whether current benchmark quality evaluation includes generated HTML alignment pages.
- [x] The runner can persist and quality-evaluate multiple configured artifacts for one run.
- [x] Default artifact retention includes `.html` files for later review.
- [x] The `investigate` benchmark fixture requires an alignment HTML page and checks gate controls, standing radio options, dark-mode styling, report content, Compile Answers, and YAML gate fields.
- [x] Focused layer1 verification, benchmark coverage validation, and whitespace checks pass.
- [x] Intended changes are committed and pushed on `master` without touching unrelated Skills Showcase edits.

**Result:** Updated on 2026-05-25. The claim was confirmed: existing benchmark setup quality evaluation could miss generated alignment pages. The harness now supports `qualityOutputPaths`, combines configured Markdown and HTML artifacts for scoring, retains `.html` artifacts by default, and the `investigate` fixture now requires and evaluates `alignment/investigate-benchmark-html-evaluation.html`. Focused layer1 verification, benchmark coverage validation, and whitespace checks passed.

## Current Targeted Update: Benchmark Failure Investigation 2026-05-24

**Goal:** Fix benchmark/showcase validation failures surfaced after the AFPS (alignment-first, prototype-second) workflow refactor without weakening the new alignment gates.

**Acceptance Criteria:**
- [x] User hypothesis is validated against focused alignment tests, benchmark/showcase tests, and current generated data.
- [x] Frontmatter checks accept the repository's documented `v0.x` skill version format.
- [x] Pack output-path checks ignore archived skill versions so retained history is not treated as active skill behavior.
- [x] Showcase benchmark demo parsing supports current `## Raw Sessions` list sections.
- [x] Generated showcase data and benchmark results matrix are refreshed.
- [x] Broader validation passes or sandbox-only blockers are documented, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-24. The alignment/refactor-specific tests passed, but surrounding benchmark/showcase checks had stale assumptions about versioning, archives, raw-session report shape, and current retained benchmark rows. The harness now accepts `v0.x` skill versions, ignores archived skill copies for active output-path conflicts, parses current raw-session sections for showcase demos, and generated benchmark/showcase data is refreshed. Full layer1 tests and benchmark coverage passed; existing skill-dependency audit noise remains unrelated.

## Current Targeted Update: Canonical Workflow Report Refresh 2026-05-24

**Goal:** Audit and refresh the canonical workflow report against current skill contracts, then provide a full-depth interactive alignment review page.

**Acceptance Criteria:**
- [x] `docs/canonical-workflow-report.md` reflects current business pack lanes, not stale broad `business-app` primary-pack guidance.
- [x] The early product sequence reflects idea scope brief, pack selection, ICP, competitive analysis, journey mapping, value/positioning/growth work, UX/UI planning, prototype, UAT, consolidation, post-prototype research refresh, spec interview, post-spec research refresh, roadmap, and execution.
- [x] Roadmap no-spec routing prefers `$feature-interview` for unresolved ideas/gaps and reserves `$spec-interview` for confirmed full-spec creation.
- [x] Product spec work reflects the consolidated prototype gate before production spec creation.
- [x] Post-spec additions route through `$feature-interview` for existing-spec updates or smaller add-on specs.
- [x] The report documents current skill-contract ambiguities as findings without patching skill files.
- [x] `alignment/canonical-workflow-report.html` renders the complete updated report with review gates and compile-answer YAML behavior.
- [x] Targeted stale-claim checks and low-cost sanity checks pass, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-24. The canonical workflow report now reflects current pack lanes and AFPS routing, including prototype-gated production spec work, `$feature-interview` as the unresolved/post-spec addition route, and `$spec-interview` only for confirmed full production spec work. Added the full-depth alignment review page at `alignment/canonical-workflow-report.html`. Showcase generated proof-data fingerprints were refreshed because validation required them. Browser open was attempted but blocked by the WSL bridge.

## Current Targeted Update: Approval-Gated Research Alignment Previews 2026-05-22

**Goal:** Make approval-gated research, planning, spec, report, and document skills build a user-consumable alignment HTML preview before asking the user to approve canonical artifact writes.

**Acceptance Criteria:**
- [x] Correction and investigation evidence are captured in `tasks/lessons.md` and `tasks/todo.md`.
- [x] Approval-gated skills treat `alignment/{skill}-{topic}.html` as a pre-approval preview artifact, not a canonical synthesized deliverable.
- [x] Approval requests point users to the alignment page, summarize recommended output/file changes, ask for questions or requested adjustments, and only approve/write canonical files after the user confirms.
- [x] Non-approval skills keep the existing durable-output alignment-page behavior.
- [x] Validation passes, generated metadata is refreshed if needed, and intended changes are committed and pushed on `master` without mixing unrelated dirty work.

**Result:** Updated on 2026-05-22. Approval-gated durable-output skills now build an `alignment/{skill}-{topic}.html` preview before asking for canonical artifact approval, ask the user to review, question, or request adjustments, and suppress downstream routing until approved files are written. Non-approval durable-output runs keep the existing alignment-page behavior. Generated Skills Showcase metadata was refreshed; focused validation and post-commit showcase validation passed.

## Current Targeted Update: Competitive Analysis Journey-First Routing 2026-05-22

**Goal:** Align business-discovery routing with the current AFPS product workflow by sending standard competitive-analysis output to journey mapping before value-prop-canvas when both are missing.

**Acceptance Criteria:**
- [x] User claim is validated against mirrored skill contracts, route-contract docs, canonical workflow docs, and recent git history.
- [x] Mirrored competitive-analysis contracts recommend `$journey-map` or `/journey-map` before value-prop-canvas in standard mode when journey context is missing.
- [x] Canonical workflow docs and business-discovery pack flow no longer place value-prop-canvas before journey-map in the main product discovery sequence.
- [x] Focused route tests cover the competitive-analysis standard-mode ordering.
- [ ] Generated Skills Showcase metadata is refreshed if needed, validation passes, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-22. The user's hypothesis was confirmed: standard competitive-analysis still routed to value-prop-canvas before journey-map in mirrored contracts and canonical docs. The route now prefers journey mapping before value-prop work when journey context is missing, and the canonical business workflow now follows concept -> ICP -> competitive analysis -> journey map -> value-prop-canvas -> positioning -> lean canvas -> prototype path. Focused validation passed; final clean-tree validation will run after commit.

## Current Targeted Update: AFPS Routing Cleanup 2026-05-25

**Goal:** Update the default business-product route to `icp -> competitive-analysis -> journey-map -> positioning -> ux-variations -> ui-interview -> prototype -> uat -> consolidate-variations -> research-roadmap -> spec-interview -> roadmap`.

**Acceptance Criteria:**
- [x] Mirrored business-discovery contracts make `value-prop-canvas` and `lean-canvas` optional detours, not default blockers.
- [x] Mirrored `positioning` contracts prefer ICP + competitive analysis + journey evidence and route to `ux-variations` by default.
- [x] Mirrored `journey-map` contracts route to `positioning` before UX work when positioning is missing.
- [x] Mirrored `research-roadmap` contracts order business-app documentation through journey, positioning, UX/UI, prototype, UAT, consolidation, post-prototype research refresh, spec interview, then roadmap.
- [x] Canonical workflow docs and pack docs reflect the same route and keep the customer-lifecycle pack install guard before `journey-map`.
- [x] Focused layer1 tests assert the required ordering and optional-detour behavior.
- [x] Validation passes and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-25. AFPS business-product routing now defaults to ICP -> competitive analysis -> journey map -> positioning -> UX variations -> UI interview -> prototype -> UAT -> consolidation -> post-prototype research refresh -> spec interview -> roadmap. Mirrored skills were archived and version-bumped; value-prop-canvas and lean-canvas remain available as optional risk-driven detours. Focused routing tests and required skill validation passed.

## Current Targeted Update: Research Quality Alignment Contract 2026-05-25

**Goal:** Make research-producing alignment pages preserve research quality and decision context, not only polished HTML presentation.

**Acceptance Criteria:**
- [x] Shared alignment-page language requires claims, evidence, inference, assumptions, and decision impact before HTML translation.
- [x] HTML pages for research outputs include an evidence matrix, confidence/assumption register, alternatives considered, lower-confidence or rejected findings, source coverage gaps, and downstream implications.
- [x] The full-content rule is tightened into a no-context-loss rule covering facts, sources, caveats, and decision rationale from proposed deliverables and search/interview logs.
- [x] Research completeness gates ask inline questions about evidence sufficiency, claims needing more support, and missing context that could change the recommendation.
- [x] Web-research skills require source coverage by category; repo/codebase research skills require file/path evidence and observed-fact versus inference separation.
- [x] Active changed skills are archived, version-bumped, and changelogs updated; archived skill versions are not mutated.
- [x] Layer1 tests and focused skill verification pass.

**Result:** Updated on 2026-05-25. Alignment-page contracts now require research outputs to preserve claims, evidence, inference, assumptions, confidence, rejected findings, source gaps, and decision impact in the HTML review page. Active alignment-producing skills were archived and version-bumped; focused alignment validation, skill version audit, routing audit, and whitespace checks passed. Broader test wrappers remain blocked by an unrelated benchmark-results matrix fixture mismatch.

## Current Targeted Update: Provision Agentic Config Benchmark Fixture False Negative 2026-05-22

**Goal:** Ship the benchmark fixture remediation for `provision-agentic-config` so retained outputs with substantive policy sections are scored correctly.

**Acceptance Criteria:**
- [x] Uncommitted fixture edits are validated against `benchmark/triage-provision-agentic-config-2026-05-22.md`.
- [x] Benchmark setup checks substantive policy sections and evidence instead of shorthand prompt echoes.
- [x] Fixture includes a monorepo signal so monorepo safety is legitimately expected.
- [x] Layer1 coverage proves canonical policy headings pass, shorthand-only outputs fail, and the fixture creates the monorepo signal.
- [x] Focused verification, benchmark coverage, and whitespace checks pass; results are recorded; intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-22. The `provision-agentic-config` benchmark fixture now evaluates substantive policy sections instead of brittle shorthand prompt phrases, creates `pnpm-workspace.yaml` so monorepo safety is in scope, allows the canonical shared-lockfile wording, and accepts the provisioning skill's next-command handoff from stdout. Focused layer1 coverage locks canonical-pass, shorthand-only-fail, monorepo-signal, and stdout-handoff behavior. Latest persisted rerun evidence: Codex 3/3 at 95.3% output quality; Claude 3/3 at 93.4% output quality.

## Current Targeted Update: Provision Agentic Config Benchmark Agent Review 2026-05-22

**Goal:** Review the latest retained `provision-agentic-config` benchmark outputs for subjective ergonomic quality after deterministic pass evidence exists.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run reports are resolved from persisted benchmark evidence.
- [x] Retained generated `AGENTS.md` artifacts are reviewed separately from deterministic pass/fail scoring.
- [x] Agent-review scores, common findings, remediation handoff, and definitive next route are written to a dated benchmark review report.
- [x] Alignment preview is verified, task notes are updated, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-22. The review finds the retained outputs good but not excellent: policy content and `$exec` routing are strong, while artifact-reference ergonomics need tightening so final handoffs use repo-relative artifact paths and avoid benchmark temp paths. Wrote the dated review report and alignment preview; validation passed.

## Current Targeted Update: Provision Agentic Config Repo-Relative Handoff 2026-05-22

**Goal:** Implement the benchmark-review remediation for `provision-agentic-config` by making final artifact handoffs repo-relative and preventing benchmark temp paths from being surfaced as user-facing artifact locations.

**Acceptance Criteria:**
- [x] Mirrored `provision-agentic-config` contracts require `./CLAUDE.md` and `./AGENTS.md` in final output and prohibit temp harness paths.
- [x] Newly created or previously provision-noted target files include a concise repo-relative source/verification note.
- [x] Benchmark setup rejects stdout handoffs containing `/tmp`, `/private/var`, or `/var/folders` artifact links.
- [x] Focused layer1 tests cover accepted repo-relative references and rejected temp-path references.
- [x] Validation passes, generated showcase data is refreshed, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-22. The focused contract/rubric patch is implemented: final handoffs must use repo-relative paths, newly created target files get source/verification notes, and the benchmark rejects temp-path artifact handoffs. Focused setup tests and skill verification pass; generated showcase data was refreshed.

## Current Targeted Update: Alignment HTML Output Root 2026-05-21

**Goal:** Move AFPS review HTML artifacts to root `alignment/`, archive replaced pages under `docs/history/archive/`, restore Codex `$prototype` parity, and make browser-opening best-effort but explicit.

**Acceptance Criteria:**
- [x] Mirrored alignment/prototype skills write review pages to `alignment/{skill}-{topic}.html` and archive replaced pages to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/...`.
- [x] Codex has `global/codex/prototype/SKILL.md` matching the Claude prototype contract translated to `$prototype`.
- [x] Hygiene and bootstrap reset contracts recognize root `alignment/` as the canonical generated browser-review artifact root.
- [x] Targeted text checks and repository tests pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-21. Alignment-page contracts now use root `alignment/` review HTML with archive-first replacement into `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/...`, and skills report best-effort browser-open status. Codex `$prototype` parity was restored, including an OpenAI manifest, and the alignment-loop `destination-doc` durable output now has a Codex mirror plus HTML review page output. Hygiene and bootstrap reset now recognize `alignment/` as a generated browser-review artifact root. Focused validation passed before commit; showcase validation will be rerun after commit once generated assets are no longer dirty.

## Current Targeted Update: Repository-Wide Alignment Page Contract 2026-05-21

**Goal:** Extend the root `alignment/` HTML review-page contract to every skill that writes durable planning, research, spec, task, prototype, report, or document outputs, including early research-pack skills such as `$icp`.

**Acceptance Criteria:**
- [x] Correction captured in `tasks/lessons.md`.
- [x] Repository-wide audit finds output-writing skills without `alignment/*.html` contracts.
- [x] Missing contracts are added across global and pack-local Claude/Codex skills, while no-file skills such as `taste-calibration` remain exempt.
- [x] Validation passes and generated metadata is refreshed if needed.
- [x] Intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-21 after user correction. The alignment-page contract now covers every global and pack-local skill except the explicit no-file `taste-calibration` skill. The contract is conditional on writing durable deliverables and requires root `alignment/{skill}-{topic}.html`, archive-first replacement under `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/...`, browser-open attempts, and reporting whether the open succeeded or was blocked. Focused validation passed before commit; showcase validation will be rerun after commit once generated assets are no longer dirty.

## Current Targeted Update: Run Ship Alignment Exemption 2026-05-21

**Goal:** Remove alignment-page requirements from run/ship loop skills while preserving the contract for planning, research, spec, interview, prototype, and decision skills.

**Acceptance Criteria:**
- [x] Correction captured in `tasks/lessons.md`.
- [x] Global run/ship/ship-end, kanban run/ship/ship-end, and monorepo mono-exec/mono-ship skills no longer mention `alignment/*.html`.
- [x] Repository-wide alignment coverage check treats run/ship loops plus explicit no-file `taste-calibration` as exceptions.
- [x] Validation passes and generated metadata is refreshed if needed.
- [x] Intended changes are committed and pushed on `master`.

## Current Targeted Update: Concept Bootstrap Gate and Scaffold Placement 2026-05-21

**Goal:** Make `idea-scope-brief` route to `bootstrap-repo` only before repository readiness, and clarify `scaffold` as a post-roadmap/plan-phase implementation structure step for normal product work.

**Acceptance Criteria:**
- [x] Mirrored `idea-scope-brief` contracts detect whether a repo is bootstrapped by meaningful README plus agent workflow docs.
- [x] Unbootstrapped concepts route to `$bootstrap-repo` or `/bootstrap-repo` before ICP.
- [x] Bootstrapped concepts continue to route to ICP or pack-install prerequisites.
- [x] Mirrored `scaffold` contracts place scaffolding after research, prototype consolidation, production spec, roadmap, and plan-phase unless the user explicitly asks for an early minimal shell.
- [ ] Tier 2/3 fixture expectations and validation pass, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated mirrored `idea-scope-brief` and `scaffold` contracts on 2026-05-21. Idea scope brief now routes ready but unbootstrapped ideas to bootstrap first, then routes bootstrapped repos to ICP or pack prerequisites. Scaffold now sits after research/prototype/spec/roadmap/plan-phase for normal product work, with an explicit early-shell exception only when the user asks for it. Tier 2/3 fixtures now expect `$icp` for a bootstrapped concept and scaffold placement language. Focused validation passed.

## Current Targeted Update: Bootstrap Product Reset Research-First Routing 2026-05-21

**Goal:** Route product/app reset bootstraps from the high-level concept through market and lifecycle alignment before UX/UI/prototype work.

**Acceptance Criteria:**
- [x] Mirrored `bootstrap-repo` contracts recommend `$icp`/`/icp` first for product/app resets when required packs are available.
- [x] If `business-discovery` or `customer-lifecycle` packs are not enabled, bootstrap recommends installing/enabling those packs before the research sequence.
- [x] Mirrored `desk-flip` contracts describe the research-first sequence from high-level concept: ICP -> competitive analysis -> journey map -> UX variations -> UI interview -> prototype.
- [x] Tier 2/3 fixture expectations validate research-first routing rather than direct UI requirements routing.
- [ ] Validation passes, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated mirrored `bootstrap-repo` and `desk-flip` contracts on 2026-05-21 so product/app resets route from high-level concept into research-first alignment: ICP, competitive analysis, journey map, UX variations, UI interview, prototype/variant build, UAT, consolidation, and post-prototype planning. Added pack-install fallback language for `business-discovery` and `customer-lifecycle`. Tier 2/3 fixtures now expect `$icp` routing and ICP/competitive/journey language instead of direct UI requirements routing. Focused validation passed.

## Current Targeted Update: Bootstrap Reset Archives Docs and Preserves Concept Only 2026-05-21

**Goal:** Tighten `bootstrap-repo --reset-existing` so stale docs/research/specs are archived with old code, leaving only the high-level concept as the active seed for fresh alignment and research.

**Acceptance Criteria:**
- [x] Mirrored `bootstrap-repo` contracts require reset mode to archive docs, research, specs, tasks, implementation notes, design docs, and other stale planning artifacts.
- [x] Reset mode preserves only a concise high-level concept artifact in the active root, derived from the bootstrap brief or `desk-flip-report.md`.
- [x] Desk-flip handoff makes clear that old docs are historical/archive evidence, not active source-of-truth inputs.
- [x] Benchmark coverage expects concept-only reset language and AFPS routing.
- [ ] Validation passes, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated mirrored `bootstrap-repo` and `desk-flip` contracts on 2026-05-21. Reset mode now archives old docs/research/specs/tasks and stale planning artifacts with the implementation, keeps only one high-level concept seed active, and routes alignment/research from that concept rather than old source-of-truth docs. Tier 2/3 benchmark fixtures now require high-level concept language for `bootstrap-repo` and `desk-flip`. Focused validation passed for both skills, benchmark coverage, generated data freshness, and skill dependency/version/routing audits.

## Current Targeted Update: Desk-Flip Reset/Archive and Alignment-First Routing 2026-05-21

**Goal:** Fix stale-project restart routing so `desk-flip` can hand off to an in-place reset/bootstrap path that archives old implementation files, then routes to AFPS workflow steps.

**Acceptance Criteria:**
- [x] Mirrored `desk-flip` contracts no longer imply that a new repo is the only fresh-start path.
- [x] `desk-flip` final handoff distinguishes new-repo bootstrap from in-place reset/bootstrap and includes the active runner's command syntax.
- [x] `bootstrap-repo` has an explicit reset mode for non-empty stale repos that archives old implementation files under `archive/` before writing fresh bootstrap docs.
- [x] `bootstrap-repo` reset mode preserves source-of-truth artifacts such as `desk-flip-report.md`, salvageable specs/docs/assets, `.git`, agent config inputs, and archive manifests.
- [x] Post-bootstrap routing sends product/app restarts into AFPS work (`$ui-interview --requirements-only` or runner equivalent), then UX variations/prototype flow, instead of straight implementation planning.
- [ ] Focused benchmark coverage and validation pass, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated mirrored `desk-flip` and `bootstrap-repo` contracts on 2026-05-21. `desk-flip` now routes same-repo restarts to reset/archive bootstrap (`$bootstrap-repo --reset-existing` for Codex and `/bootstrap-repo --reset-existing` for Claude) while keeping new-repo bootstrap available when explicitly preferred. `bootstrap-repo` reset mode archives stale implementation files under `archive/YYYY-MM-DD-HHMMSS/`, writes `MANIFEST.md`, preserves git metadata, agent config, desk-flip report, and valid salvage artifacts, then routes product/app restarts to AFPS requirements work before UX variations, prototypes, UAT, consolidation, and production spec/roadmap. Focused validation passed for `desk-flip` and `bootstrap-repo`, benchmark coverage, generated showcase freshness, and skill dependency/version/routing audits.

## Current Targeted Update: Idea Scope Brief Slugged Briefs 2026-05-21

**Goal:** Update mirrored `idea-scope-brief` skills so concept briefs use normalized concept slugs whenever a concept identity is known or emerges, avoiding ambiguous `research/concept-brief.md` overwrites across related concepts.

**Acceptance Criteria:**
- [x] `global/codex/idea-scope-brief/SKILL.md` resolves concept identity and slug during context resolution and coverage checkpoint.
- [x] `global/claude/idea-scope-brief/SKILL.md` mirrors the slugged output, pivot, and archive behavior with Claude route syntax.
- [x] Generic `research/concept-brief.md` is reserved for a single unambiguous project-level concept; related or potentially multiple concepts use `concept-brief-{slug}.md` and `concept-brief-{slug}-interview.md`.
- [x] Pivoted concepts write to their own slugged brief while preserving the original prompt concept as a separate future or related concept.
- [x] Benchmark coverage/setup validates slugged concept output behavior, including a Poketo Work to Poketo Core pivot fixture.
- [x] Required validation passes, review notes are recorded, and intended changes are committed and pushed on `master`.

**Result:** Updated mirrored `idea-scope-brief` contracts on 2026-05-21. The skill now resolves concept identity and a normalized slug, reserves generic concept brief filenames for a single unambiguous project-level concept, writes slugged paths for known identities, multi-concept repos, and pivots, and preserves the initial concept as a related or future concept when the interview pivots. The Tier 2/3 benchmark fixture now exercises the Poketo Work to Poketo Core pivot and requires `research/concept-brief-poketo-core.md` plus the matching interview log. Validation passed: install, modern-Bash skill audits, benchmark coverage, focused `idea-scope-brief` verify, generated Skills Showcase refresh/validation, targeted `rg`, and `git diff --check`.

## Current Targeted Update: Codex Desk-Flip Parity 2026-05-21

**Goal:** Add the missing Codex mirror for the existing Claude `desk-flip` skill and make route expectations agent-specific.

**Acceptance Criteria:**
- [x] `global/codex/desk-flip/SKILL.md` exists with the same desk-flip workflow as `global/claude/desk-flip/SKILL.md`, adjusted only for Codex invocation and `$bootstrap-repo` handoff syntax.
- [x] Existing Claude `desk-flip` behavior remains unchanged except for any parity-safe wording if needed.
- [x] Benchmark setup for `desk-flip` accepts Claude `/bootstrap-repo` and Codex `$bootstrap-repo` handoffs.
- [x] Skill discovery, benchmark coverage, showcase data validation, and whitespace checks pass.
- [x] Intended changes are committed and pushed on the repository primary branch.

**Result:** Codex `desk-flip` parity was added on 2026-05-21. The new Codex contract mirrors the Claude autopsy/report workflow, reads Codex-relevant `AGENTS.md` when present, writes only `desk-flip-report.md`, and routes final handoff to `$bootstrap-repo`. The deterministic Tier 2/3 benchmark fixture now expects `/bootstrap-repo` for Claude and `$bootstrap-repo` for Codex. Validation passed: `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill desk-flip` (layer1 PASS, layer2 SKIP due no target-specific layer2), generated Skills Showcase refresh/validation, Homebrew Bash skill dependency/version/routing audits, `./install.sh`, targeted route checks, and `git diff --check`.

## Current Targeted Update: Benchmark Workflow Layer2 Fixture Coverage 2026-05-19

**Goal:** Add target-specific layer2 fixture coverage for benchmark workflow skills so `verify --skill benchmark-test-skill` and `verify --skill session-triage` no longer skip layer2.

**Acceptance Criteria:**
- [x] `tests/layer2/` includes deterministic coverage for `benchmark-test-skill` command/report routing behavior.
- [x] `tests/layer2/` includes deterministic coverage for `session-triage` benchmark false-negative generalization behavior.
- [x] `pnpm --dir tests verify --skill benchmark-test-skill` and `pnpm --dir tests verify --skill session-triage` pass with layer2 PASS.
- [x] Task review notes record validation and intended changes are committed and pushed on `master`.

**Result:** Added `tests/layer2/benchmark-test-skill-session-triage.test.ts` with deterministic fixture coverage for both benchmark workflow skills. The benchmark-test-skill fixture proves repeated same-family benchmark false negatives route to generalized remediation while ordinary benchmark failures still route to session-triage. The session-triage fixture proves recurrence evidence triggers family-level remediation and absent recurrence stays on the ordinary benchmark-failure path. Target verifies now pass layer2 for both skills. Validation passed: focused layer2 filters, target verifies, install, skill dependency/version/routing audits, benchmark coverage, targeted search, and `git diff --check`.

## Current Targeted Update: Benchmark Repeated False-Negative Generalization Gate 2026-05-19

**Goal:** Add a durable benchmark workflow gate that prevents repeated same-family benchmark false negatives from being patched one wording variant at a time.

**Acceptance Criteria:**
- [x] Mirrored `session-triage` contracts require checking recent same-skill benchmark triage reports for repeated same-family false negatives before recommending another narrow tolerance patch.
- [x] Mirrored `benchmark-test-skill` contracts route repeated false-negative families toward generalized rubric/harness remediation instead of blind reruns.
- [x] Layer1 contract coverage proves the new generalization gate is present in both Claude and Codex benchmark workflow contracts.
- [x] Task review notes record validation and intended changes are committed and pushed on `master`.

**Result:** Added a repeated false-negative generalization gate to mirrored `session-triage` and `benchmark-test-skill` contracts. Benchmark triage now checks recent same-skill triage reports and routes two-or-more same-family benchmark false negatives to a family-level rubric, semantic evaluator, fixture-family, or infrastructure-classifier fix. Benchmark-test-skill now avoids blind reruns once that pattern is visible and routes to targeted generalization work instead. Layer1 contract coverage guards both behavior surfaces. Validation passed: install, skill dependency/version/routing audits, focused layer1 contract tests, benchmark coverage, target verifies for `benchmark-test-skill` and `session-triage`, generated Skills Showcase data validation, targeted search, and `git diff --check`.

## Current Skill Creation: skill-interview 2026-05-18

**Goal:** Add a mirrored `skill-interview` planning skill that interrogates the user about the characteristics of a desired skill before skill creation.

**Acceptance Criteria:**
- [x] `global/codex/skill-interview/SKILL.md` defines a Codex planning workflow with assumptions checkpoint, one-question interview cadence, coverage checkpoint, deliverables, constraints, and next-step routing.
- [x] `global/claude/skill-interview/SKILL.md` mirrors the same workflow with Claude command syntax and AskUserQuestion expectations.
- [x] `tests/harness/bench-coverage.ts`, `tests/harness/bench-setups.ts`, and `tests/layer4/setups/tier1-workflows.setup.ts` register deterministic benchmark coverage for `skill-interview`.
- [x] Skills Showcase generated data is refreshed because tracked `SKILL.md` files were added.
- [x] Validation passes and intended changes are committed and pushed on the repository primary branch.

**Result:** Added mirrored `skill-interview` planning contracts for Codex and Claude. The skill interviews the user on skill characteristics, checks overlapping skills and lessons before probing, writes a creation-ready skill brief plus interview log, and routes to `$create-agentic-skill`, `$create-local-skill`, `$targeted-skill-builder`, or pack-local creation as appropriate. Benchmark coverage is registered through the Tier 1 workflow setup with a deterministic skill-brief fixture. Validation passed: generated Skills Showcase data refresh and validation, `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill skill-interview`, skill dependency/version/routing audits under Homebrew Bash, targeted `rg`, and `git diff --check`.

## Current Benchmark: update-packages Fresh Rerun After Actionability Threshold 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state and publish deterministic both-agent benchmark evidence after the benchmark actionability threshold update.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports its coverage status.
- [x] `pnpm verify --skill update-packages` passes before any benchmark run starts.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun after the actionability threshold update completed on 2026-05-18. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and the target verify gate passed with layer1 PASS plus layer2 SKIP because no target-specific layer2 tests matched. The setup was raised to the standard `$1.00` per-run budget to eliminate the prior Claude budget block, and retained-evidence matchers were broadened for `## Full Verification Checklist` and `npm-view-times.json` publish-time proof list shapes. Final Claude session `update-packages-claude-391a34fd` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 93.9% output quality, two critical quality failures, p50 latency 54.1s, and $3.00 total estimated cost. Final Codex session `update-packages-codex-3784a689` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 100.0% output quality, no critical failures, p50 latency 84.1s, and $3.00 total estimated cost. Report: `benchmark/test-update-packages-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next command: `$session-triage update-packages benchmark failure`.

## Current Benchmark: update-packages Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state and publish deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- [x] `pnpm verify --skill update-packages` passed with layer1 PASS in 4.9s and layer2 SKIP because no target-specific layer2 tests matched.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` ran only after verify passed.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with evaluated passing evidence for both runners and one Claude infrastructure block. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 4.9s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-a767ae3e` completed two evaluated runs with 2/2 hard assertion pass rate, one agent-runner budget block, 95.2% output quality, no threshold or critical failures, p50 latency 54.5s, and $0.75 total estimated cost. Codex session `update-packages-codex-337a5d5e` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 100.0% output quality, no threshold or critical failures, p50 latency 76.6s, and $0.75 total estimated cost. Report: `benchmark/test-update-packages-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$benchmark-agent-review update-packages`.

## Current Review: update-packages Fresh Benchmark Agent Review 2026-05-18

**Goal:** Review the latest persisted `update-packages` benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-update-packages-2026-05-18.md`.
- [x] Infrastructure-blocked runs are excluded from scoring.
- [x] Retained Claude and Codex `package-update-plan.md` artifacts are reviewed against the agent-review rubric.
- [x] `benchmark/review-update-packages-2026-05-18.md` records source evidence, scores, strengths, weaknesses, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-18. Claude session `update-packages-claude-a767ae3e` had two evaluated retained `package-update-plan.md` artifacts and one infrastructure block, which was excluded from subjective scoring. Codex session `update-packages-codex-337a5d5e` had three evaluated retained `package-update-plan.md` artifacts. Subjective verdict: usable to excellent, median 88/100 with score range 76-95. All evaluated outputs preserved the fixture constraints, selected/skipped age-gated versions, pnpm migration safety, major-upgrade risk handling, and runner-native next routing. Remaining gap: Claude evaluated outputs lack explicit per-batch expected proof/artifact and target-specific migration routes while deterministic quality still reports 95.2% despite `workflow-actionability` scoring 0.0%. Report: `benchmark/review-update-packages-2026-05-18.md`. Recommended next command: `$targeted-skill-builder update-packages benchmark actionability threshold`.

## Current Targeted Update: update-packages Benchmark Actionability Threshold 2026-05-18

**Goal:** Tighten the `update-packages` benchmark quality rubric so missing batch actionability and generic migrate routes materially lower output-quality results.

**Acceptance Criteria:**
- [x] Relevant lessons, benchmark-agent review evidence, current mirrored `update-packages` contract, custom benchmark setup, and focused layer1 coverage are reviewed.
- [x] `tests/layer4/setups/tier23-global-workflows.setup.ts` makes `workflow-actionability` critical for `update-packages`.
- [x] `tests/layer4/setups/tier23-global-workflows.setup.ts` adds target-specific migrate-route quality scoring for `update-packages`.
- [x] Focused layer1 coverage accepts strong batch checklist shapes and rejects retained weak actionability/generic migrate route shapes.
- [x] Required validation passes, results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. The custom `update-packages` benchmark quality evaluator now treats missing batch actionability as a critical quality failure and separately scores target-specific migrate routes, so a plan with bare `/migrate` or `$migrate` does not receive full quality credit when a target package/tool is known. Focused layer1 coverage proves strong retained checklist plans still pass while weak Claude-style lettered batches and generic migrate routes lose quality. Validation passed: install, skill dependency/version/routing audits, focused layer1 setup tests, benchmark coverage, target verify, targeted search, and whitespace validation. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Benchmark: feature-interview Fresh Rerun After Prototype Wording Tolerance 2026-05-18

**Goal:** Run `$benchmark-test-skill feature-interview` against the current repository state and publish fresh deterministic both-agent benchmark evidence after the prototype phase wording tolerance update.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `feature-interview` is known and reports custom coverage via `tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] `pnpm verify --skill feature-interview` passed with layer1 PASS in 3.7s and layer2 SKIP because no target-specific layer2 tests matched.
- [x] `pnpm bench --skill feature-interview --agent both --runs 3 --chunk-size 3 --pause 0` ran only after verify passed.
- [x] `benchmark/test-feature-interview-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with evaluated passing Codex evidence and a fully infrastructure-blocked Claude lane. `feature-interview` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 3.7s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `feature-interview-claude-bd781522` had 0 evaluated runs and 3 agent-runner budget blocks, so that lane is inconclusive infrastructure blockage rather than a skill failure. Codex session `feature-interview-codex-59a38b3c` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 100.0% output quality, p50 latency 87.1s, and $0.75 total estimated cost. Report: `benchmark/test-feature-interview-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$benchmark-agent-review feature-interview`.

## Current Review: feature-interview Fresh Benchmark Agent Review 2026-05-18

**Goal:** Review the latest persisted `feature-interview` benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-feature-interview-2026-05-18.md`.
- [x] Infrastructure-blocked Claude runs are excluded from scoring.
- [x] Retained Codex `specs/benchmark-reporting-feature-interview.md` artifacts are reviewed against the agent-review rubric.
- [x] `benchmark/review-feature-interview-2026-05-18.md` records source evidence, scores, strengths, weaknesses, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed, then intended changes are committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-18. Claude session `feature-interview-claude-bd781522` had no evaluated outputs because all three runs were infrastructure-blocked by agent runner budget, so it was excluded from subjective scoring. Codex session `feature-interview-codex-59a38b3c` had three evaluated retained `specs/benchmark-reporting-feature-interview.md` artifacts. Subjective verdict: excellent, median 94/100 with score range 93-95. The outputs preserved the fixture constraints, grounded claims in sparse evidence, defined prototype-first route experiments, deferred SaaS infrastructure, and routed correctly to `$roadmap`. No material evaluated-output remediation remains. Report: `benchmark/review-feature-interview-2026-05-18.md`. Recommended next command: `$ship`.

## Current Targeted Update: update-packages pnpm Latest Reject-Warning Tolerance 2026-05-18

**Goal:** Fix the custom `update-packages` benchmark setup so valid retained rejection language for unqualified `pnpm@latest` passes while actual unqualified usage still fails.

**Acceptance Criteria:**
- [x] Relevant lessons, latest triage report, current Tier 2/3 evaluator, and focused layer1 coverage are reviewed.
- [x] `tests/layer4/setups/tier23-global-workflows.setup.ts` accepts explicit `reject` wording in `lineOnlyWarnsAgainstPnpmLatest`.
- [x] Focused layer1 regression coverage covers the retained failed shape `Reject \`pnpm@latest\` — unqualified, unverifiable at lock time.`
- [x] Focused layer1 tests, benchmark coverage, target verify, targeted search, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `lineOnlyWarnsAgainstPnpmLatest` now treats explicit `reject` wording as safe warning/rejection language for lines containing `pnpm@latest`, so the retained failed shape `Reject \`pnpm@latest\` — unqualified, unverifiable at lock time.` passes. Negative coverage still rejects actual unqualified usage such as `migrate to pnpm using pnpm@latest`, `corepack prepare pnpm@latest --activate`, and `packageManager: "pnpm@latest"`. Validation passed: focused layer1 setup tests, benchmark coverage, target verify, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Targeted Update: feature-interview Prototype-First Phase Wording Tolerance 2026-05-18

**Goal:** Fix the `feature-interview` benchmark quality evaluator so valid retained prototype-first phase wording passes while shallow prototype/defer statements still fail.

**Acceptance Criteria:**
- [x] Relevant lessons, latest triage report, current Tier 1 evaluator, and focused layer1 coverage are reviewed.
- [x] `tests/layer4/setups/tier1-workflows.setup.ts` accepts semantically valid prototype phase and nested experiment route wording.
- [x] Focused layer1 regression coverage covers retained Codex-style `prototype-first phase` and nested `/experiments/benchmark-reporting/...` route shapes.
- [x] Focused layer1 tests, benchmark coverage, target verify, skill audits, install, targeted search, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `prototypeFirstProductGateCriterion` now accepts `prototype-first phase`, short prototype phase variants, and nested experiment paths such as `/experiments/benchmark-reporting/table-first`, while the negative shallow prototype/defer case still fails. Focused layer1 regression coverage now includes retained valid Codex-style wording from the latest triage. Validation passed: focused layer1 setup tests, benchmark coverage, target verify, skill dependency/version/routing audits, install, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill feature-interview`.

## Current Targeted Update: investigate Clean Shipped Routing 2026-05-18

**Goal:** Prevent `$investigate` from recommending `$ship-end` after it has already fixed, validated, committed, pushed, and confirmed a clean tree with no unpushed commits.

**Acceptance Criteria:**
- [x] The Codex `$investigate` Default Shipping Contract defines clean already-pushed investigation terminal routing as `Next work: none` and `Recommended next command: none`.
- [x] The contract only permits `$ship-end` when pending docs, uncommitted changes, unpushed commits, deploy follow-up, unresolved wrap-up work, or an explicit task source points to ship-end.
- [x] Tier 1 benchmark quality coverage rejects `$ship-end` for a clean already-pushed investigation fixture.
- [x] Required skill validation, generated data refresh, and whitespace checks pass.

**Result:** Updated on 2026-05-18. The Codex `$investigate` Default Shipping Contract now treats a fixed, validated, committed, pushed, clean tree with no unpushed commits as terminal and requires `Next work: none` plus `Recommended next command: none`. `$ship-end` is only allowed when there is concrete pending wrap-up work. Tier 1 benchmark quality coverage now rejects mechanical `$ship-end` routing for the clean already-pushed investigation fixture. Validation passed: install, skill dependency/version/routing audits, focused layer1 setup tests, benchmark coverage, target verify for `investigate`, generated data refresh, targeted search, and `git diff --check`. Recommended next command: none.

## Current Triage: update-packages Reject pnpm Latest Warning Failure 2026-05-18

**Goal:** Investigate the latest `$benchmark-test-skill update-packages` Claude failure and classify whether the `Output avoids unqualified pnpm@latest` failure is a skill-contract gap, benchmark harness defect, generated-output noncompliance, or infrastructure-only block.

**Acceptance Criteria:**
- [x] Latest curated benchmark report and raw failed Claude run artifact are inspected.
- [x] Mirrored `update-packages` contracts are compared with the benchmark prompt, assertion helper, focused layer1 coverage, and relevant lessons.
- [x] `benchmark/triage-update-packages-2026-05-18-pnpm-latest-reject-warning.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the latest `update-packages` benchmark failure as a benchmark harness false negative, not a mirrored skill-contract failure. Claude session `update-packages-claude-dbd3972f` completed three evaluated runs with 2/3 hard assertion pass rate, no infrastructure blocks, and one failed `Output avoids unqualified pnpm@latest` assertion. The failed artifact selected pinned `pnpm@10.11.0`, retained `npm view pnpm@10.11.0 time.version` evidence, documented publish time `2026-05-01T12:00:00.000Z`, and mentioned `pnpm@latest` only in explicit rejection language: `Reject \`pnpm@latest\` — unqualified, unverifiable at lock time.` Root cause: `lineOnlyWarnsAgainstPnpmLatest` accepts several warning forms but does not accept `reject` as safe rejection language. Report: `benchmark/triage-update-packages-2026-05-18-pnpm-latest-reject-warning.md`. Validation passed: required report field scan and `git diff --check`. Recommended next skill: `$targeted-skill-builder update-packages benchmark pnpm latest reject-warning tolerance`.

## Current Triage: feature-interview Latest Route and Prototype Gate Failure 2026-05-18

**Goal:** Investigate the latest `$benchmark-test-skill feature-interview` failure and classify whether the Claude `/roadmap` assertion failure and both-agent `prototype-first-product-gate` quality failures are skill-contract gaps, benchmark harness defects, generated-output noncompliance, or infrastructure-only blocks.

**Acceptance Criteria:**
- [x] Latest curated benchmark report and raw Claude/Codex report JSON are inspected.
- [x] Retained Claude and Codex run artifacts are inspected for the failed route assertion and quality criterion.
- [x] Mirrored `feature-interview` contracts are compared with the benchmark setup, quality rubric, focused layer1 coverage, and relevant lessons.
- [x] `benchmark/triage-feature-interview-2026-05-18-latest-route-and-gate.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified a split failure. Claude session `feature-interview-claude-3efd3354` had one evaluated run, two infrastructure blocks, and a valid hard assertion failure because it ended with `/exec` despite confirmed roadmap sequencing. Codex session `feature-interview-codex-bcc5f678` passed all hard assertions and semantically preserved route experiments, deferred infrastructure, fixture-backed prototype data, and promotion evidence. The Codex `prototype-first-product-gate` failures are best classified as a benchmark quality-evaluator false negative or over-narrow wording tolerance because the detector rejects valid `prototype-first phase` wording. Report: `benchmark/triage-feature-interview-2026-05-18-latest-route-and-gate.md`. Validation passed: required report field scan and `git diff --check`. Recommended next skill: `$targeted-skill-builder feature-interview benchmark prototype-first phase wording tolerance`.

## Current Benchmark: update-packages Fresh Rerun After pnpm Latest Tolerance 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state and publish deterministic both-agent benchmark evidence after the latest pnpm-related benchmark tolerance work.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- [x] `pnpm verify --skill update-packages` passed with layer1 PASS in 3.7s and layer2 SKIP because no target-specific layer2 tests matched.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` ran only after verify passed.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with a deterministic Claude failure and passing Codex evidence. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.7s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-dbd3972f` completed three evaluated runs with 2/3 hard assertion pass rate, no infrastructure blocks, one failed `Output avoids unqualified pnpm@latest` assertion, 96.8% output quality, one critical failure, p50 latency 56.7s, and $0.75 total estimated cost. Codex session `update-packages-codex-49aec343` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 100.0% output quality, p50 latency 84.5s, and $0.75 total estimated cost. Report: `benchmark/test-update-packages-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Benchmark: feature-interview Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill feature-interview` against the current repository state and publish deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `feature-interview` is known and reports custom coverage via `tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] `pnpm verify --skill feature-interview` passed with layer1 PASS in 3.6s and layer2 SKIP because no target-specific layer2 tests matched.
- [x] `pnpm bench --skill feature-interview --agent both --runs 3 --chunk-size 3 --pause 0` ran only after verify passed.
- [x] `benchmark/test-feature-interview-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with mixed deterministic evidence and output-quality failures. `feature-interview` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 3.6s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `feature-interview-claude-3efd3354` completed one evaluated run with 0/1 hard assertion pass rate, two agent-runner budget blocks, 72.2% output quality, one threshold failure, one critical failure, p50 latency 48.6s, and $0.75 total estimated cost. Claude failed `Output recommends /roadmap`. Codex session `feature-interview-codex-bcc5f678` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 77.8% output quality, three threshold failures, three critical failures on `prototype-first-product-gate`, p50 latency 80.2s, and $0.75 total estimated cost. Report: `benchmark/test-feature-interview-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$session-triage feature-interview benchmark failure`.

## Current Triage: feature-interview Fresh Claude Prototype Gate Failure 2026-05-18

**Goal:** Investigate the fresh `$benchmark-test-skill feature-interview` failure and classify whether the Claude `prototype-first-product-gate` quality failure is a skill-contract gap, benchmark harness defect, generated-output noncompliance, or infrastructure-only block.

**Acceptance Criteria:**
- [x] Fresh curated benchmark report and raw Claude/Codex report JSON are inspected.
- [x] Retained Claude evaluated run artifact is inspected for the failed `prototype-first-product-gate` quality criterion.
- [x] Mirrored `feature-interview` contracts are compared with benchmark setup and focused layer1 coverage.
- [x] `benchmark/triage-feature-interview-2026-05-18-fresh-claude-prototype-gate.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the fresh `feature-interview` benchmark failure as generated-output noncompliance plus partial infrastructure blocking, not a mirrored skill-contract gap and not a benchmark false negative. Claude session `feature-interview-claude-e499a20d` had one evaluated hard-assertion pass, two agent-runner budget blocks, and one critical `prototype-first-product-gate` quality failure. The retained Claude artifact included a prototype gate, fake/static data boundary, deferred infrastructure, and promotion criteria, but collapsed the fixture's requested table-first, board-first, and command-first route experiments into a single dashboard route. Codex session `feature-interview-codex-e6208aac` passed 3/3 hard assertions and 100.0% output quality. Report: `benchmark/triage-feature-interview-2026-05-18-fresh-claude-prototype-gate.md`. Recommended next command: `$benchmark-test-skill feature-interview`.

## Current Targeted Update: Prototype Phase and Route Experiment Workflow Tightening 2026-05-18

**Goal:** Tighten prototype-first product and feature planning so the first milestone is a separate prototype/experiment phase, with multiple clickable route-based experiments when there is meaningful UX/workflow uncertainty, before any production infrastructure is promoted.

**Acceptance Criteria:**
- [x] Relevant prototype-first skill wording and benchmark coverage are reviewed.
- [x] `tasks/lessons.md` captures the correction about separate prototype phases and multi-route experiments.
- [x] Mirrored roadmap, feature-interview, spec-interview, ui-interview, ux-variation, plan-phase, and run contracts distinguish prototype exploration from production implementation.
- [x] Benchmark fixture quality coverage requires separate prototype/experiment phase evidence and route-based experiment evidence.
- [x] Focused layer1, benchmark coverage, target verifies, and whitespace validation pass.

**Result:** Updated on 2026-05-18. Product and substantial feature workflows now prefer a separate prototype/experiment phase before production implementation, with multiple clickable experiment routes such as `/experiments/<variant>` when workflow, layout, density, copy, navigation, or interaction assumptions are uncertain. Durable database/storage, auth, payments, analytics, deployment, admin tooling, multi-tenancy, and production observability remain deferred until explicit approval or calibration evidence justifies promotion. Validation passed: focused layer1 bench setup tests, benchmark coverage, target verifies for roadmap/plan-phase/feature-interview/spec-interview/ui-interview/ux-variation/exec, and `git diff --check`. Recommended next command: `$benchmark-test-skill roadmap`.

## Current Benchmark: feature-interview Fresh Rerun After Prototype Gate Tolerance 2026-05-18

**Goal:** Run `$benchmark-test-skill feature-interview` against the current repository state and publish deterministic both-agent benchmark evidence after the prototype-gate tolerance fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `feature-interview` is known and reports custom coverage via `tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] `pnpm verify --skill feature-interview` passed with layer1 PASS in 3.5s and layer2 SKIP because no target-specific layer2 tests matched.
- [x] `pnpm bench --skill feature-interview --agent both --runs 3 --chunk-size 3 --pause 0` ran only after verify passed.
- [x] `benchmark/test-feature-interview-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with mixed deterministic evidence. `feature-interview` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 3.5s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `feature-interview-claude-e499a20d` completed one evaluated run with 1/1 hard assertion pass rate, two agent-runner budget blocks, 77.8% output quality, one threshold failure, one critical failure on `prototype-first-product-gate`, p50 latency 41.8s, and $0.75 total estimated cost. Codex session `feature-interview-codex-e6208aac` completed three evaluated runs with 3/3 hard assertion pass rate, no infrastructure blocks, 100.0% output quality, p50 latency 85.2s, and $0.75 total estimated cost. Report: `benchmark/test-feature-interview-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$session-triage feature-interview benchmark failure`.

## Current Targeted Update: update-packages Benchmark Artifact Reference and Actionability Tolerance 2026-05-18

**Goal:** Tighten the `update-packages` benchmark quality rubric so retained valid `package-update-plan.md` artifact-reference and verification/actionability shapes receive deterministic quality credit while missing artifact/actionability evidence still fails.

**Acceptance Criteria:**
- [x] Relevant lessons, the fresh benchmark-agent review, current update-packages benchmark setup, and focused layer1 coverage are reviewed.
- [x] `tests/layer4/setups/tier23-global-workflows.setup.ts` supports scoped artifact-reference and actionability quality patterns for `update-packages`.
- [x] Focused layer1 coverage accepts retained `# Package Update Plan`, `# package-update-plan.md`, verification-command, focused-smoke, stop-condition, and major-upgrade-risk shapes.
- [x] Focused layer1 coverage rejects output with neither artifact naming nor actionable validation/risk evidence.
- [x] Focused validation, benchmark coverage, target verify, required skill audits, targeted search, install, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `tests/layer4/setups/tier23-global-workflows.setup.ts` now supports optional per-workflow `artifactReferencePattern` and `actionabilityPatterns` quality overrides, scoped to `update-packages` so the generic rubric is not weakened. The update-packages quality rubric credits retained headings such as `# Package Update Plan` or `# package-update-plan.md`, explicit `package-update-plan.md` mentions, verification-command sections, focused smoke checks, stop conditions, and major-upgrade risk handling. Focused layer1 coverage proves the accepted retained shapes and keeps missing artifact/actionability evidence failing. Validation passed: focused layer1 setup/quality tests, benchmark coverage, target verify, install and skill scripts, targeted `rg`, and `git diff --check`. Generated Skills Showcase data was not refreshed because no tracked skill metadata/behavior or curated benchmark/review report changed. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Targeted Update: update-packages Benchmark pnpm latest Parenthetical Negation Tolerance 2026-05-18

**Goal:** Fix the custom `update-packages` benchmark setup so valid parenthetical, backticked, and heading warnings about not using unqualified `pnpm@latest` pass while actual `pnpm@latest` recommendations still fail.

**Acceptance Criteria:**
- [x] Relevant lessons, the pnpm latest parenthetical triage report, current detector, and focused layer1 coverage are reviewed.
- [x] `tests/layer4/setups/tier23-global-workflows.setup.ts` classifies each `pnpm@latest` line instead of relying on a brittle negative-lookahead regex.
- [x] Focused layer1 coverage accepts the failed retained parenthetical/heading warning shape and still rejects actual `pnpm@latest` recommendations.
- [x] Focused layer1 tests, benchmark coverage, target verify, required skill audits, targeted search, smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. The custom `update-packages` benchmark setup now uses `avoidsUnqualifiedPnpmLatest` to evaluate every line containing `pnpm@latest`, accepting negated/contextual forms such as `(not pnpm@latest)`, `(not `pnpm@latest`)`, and `no unqualified pnpm@latest` while preserving failures for real recommendations like `migrate to pnpm using pnpm@latest`, `corepack prepare pnpm@latest --activate`, and `packageManager: "pnpm@latest"`. Focused layer1 coverage includes the failed retained Claude shape and the new parenthetical/heading accepted forms. Validation passed: focused layer1 setup tests, benchmark coverage, target verify, install and skill scripts, targeted `rg`, `git diff --check`, and Codex smoke benchmark `update-packages-codex-49c65aa9` with 1/1 hard assertions. Generated Skills Showcase data was not refreshed because no tracked skill metadata/behavior or curated benchmark/review report changed. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Targeted Update: feature-interview Benchmark Prototype Gate Quality Tolerance 2026-05-18

**Goal:** Fix the `feature-interview` benchmark quality evaluator so retained prototype-first outputs pass when they preserve the current fixture semantically and name valid promotion evidence, while shallow prototype deferrals still fail.

**Acceptance Criteria:**
- [x] `feature-interview` evidence quality accepts semantic benchmark/coverage dashboard evidence from the current fixture without requiring stale exact `Benchmark reports`.
- [x] Prototype gate quality accepts retained promotion-evidence headings and per-item deferred-infrastructure promotion conditions.
- [x] Missing evidence and shallow prototype deferrals still fail focused layer1 coverage.
- [x] Focused layer1 tests, benchmark coverage, target verify, required skill audits, Codex smoke benchmark, targeted search, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `tests/layer4/setups/tier1-workflows.setup.ts` now uses `featureInterviewEvidenceCriterion` for semantic fixture evidence: `custom`, `generic`, `blocked`, benchmark/coverage dashboard wording, and fake/fixture data evidence. `prototypeFirstProductGateCriterion` now accepts retained promotion-evidence headings and per-item deferred-infrastructure promotion conditions while still rejecting shallow "defer later" gates. Focused layer1 coverage in `tests/layer1/bench-setups.test.ts` proves the newly accepted shapes and retained negatives. Validation passed: focused layer1 setup/quality tests, benchmark coverage, target verify, install and skill scripts, targeted `rg`, `git diff --check`, and Codex smoke benchmark `feature-interview-codex-66967a50` with 1/1 hard assertions and 100.0% output quality. Recommended next command: `$benchmark-test-skill feature-interview`.

## Current Triage: feature-interview Prototype Gate Benchmark Quality Failure 2026-05-18

**Goal:** Investigate the fresh `$benchmark-test-skill feature-interview` quality failure and classify whether it is a skill-contract gap, benchmark harness defect, generated-output noncompliance, or infrastructure-only block.

**Acceptance Criteria:**
- [x] Curated benchmark report and raw Claude/Codex report JSON are inspected.
- [x] Retained Codex run artifacts are inspected for failed `evidence-linked` and `prototype-first-product-gate` quality criteria.
- [x] Mirrored `feature-interview` contracts are compared with benchmark setup and quality rubric.
- [x] `benchmark/triage-feature-interview-2026-05-18-prototype-gate-quality.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the fresh `feature-interview` benchmark failure as a benchmark quality-evaluator false negative with a separate fully blocked Claude lane, not a mirrored skill-contract failure. Claude session `feature-interview-claude-02d30038` had 0 evaluated runs and 3 infrastructure blocks from agent runner budget exceeded. Codex session `feature-interview-codex-ed08cfc2` passed 3/3 hard assertions but recorded quality failures on `evidence-linked` and `prototype-first-product-gate`. Root cause: `tests/layer4/setups/tier1-workflows.setup.ts` still requires the stale exact phrase `Benchmark reports`, and the prototype gate regex misses valid promotion-evidence wording such as "Evidence that would justify promoting a deferred item into a later phase." Report: `benchmark/triage-feature-interview-2026-05-18-prototype-gate-quality.md`. Recommended next skill: `$targeted-skill-builder feature-interview benchmark prototype gate quality tolerance`.

## Current Triage: update-packages pnpm latest Parenthetical Negation Failure 2026-05-18

**Goal:** Investigate the latest `$benchmark-test-skill update-packages` Claude failure and classify whether the `Output avoids unqualified pnpm@latest` failure is a skill-contract gap, benchmark harness defect, generated-output noncompliance, or infrastructure-only block.

**Acceptance Criteria:**
- [x] Fresh curated benchmark report and raw failed Claude run artifact are inspected.
- [x] Mirrored `update-packages` contracts are compared with benchmark prompt, assertion pattern, and focused layer1 coverage.
- [x] `benchmark/triage-update-packages-2026-05-18-pnpm-latest-parenthetical.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the latest `update-packages` benchmark failure as a benchmark harness false negative, not a mirrored skill-contract failure. Claude session `update-packages-claude-c663452c` had one infrastructure block, one passing evaluated run, and one evaluated failure on `Output avoids unqualified pnpm@latest`; Codex session `update-packages-codex-ebca44af` passed 3/3. The failed Claude artifact selected age-proven `pnpm@10.11.0`, cited `npm view pnpm@10.11.0 time.version` evidence from 2026-05-01, skipped `pnpm@10.22.0` as too new, and mentioned `pnpm@latest` only in negated/contextual forms such as `(not pnpm@latest)` and `no unqualified pnpm@latest`. Root cause: `UPDATE_PACKAGES_NO_UNQUALIFIED_PNPM_LATEST_PATTERN` accepts some warning language but misses valid parenthetical, backticked, and heading forms. Report: `benchmark/triage-update-packages-2026-05-18-pnpm-latest-parenthetical.md`. Recommended next skill: `$targeted-skill-builder update-packages benchmark pnpm latest parenthetical-negation tolerance`.

## Current Targeted Update: Prototype-First Product Workflow Gate 2026-05-18

**Goal:** Add a prototype-first gate to product intake, specification, UI, planning, and execution skills so new SaaS/product work defaults to a clickable local/static prototype before database, auth, payments, analytics, deployment, admin, multi-tenant, or observability infrastructure.

**Acceptance Criteria:**
- [x] Relevant lessons and `tasks/prototype-first-saas-workflow-report.md` are reviewed.
- [x] Existing-skill overlap is checked before creating any new skill.
- [x] Mirrored `feature-interview`, `spec-interview`, `ui-interview`, `plan-phase`, and `run` contracts require a clickable prototype/default deferral gate for new product work.
- [x] Benchmark fixtures assert prototype-first defaults, fake/fixture data boundaries, deferred infrastructure, and evidence needed before promotion.
- [x] Focused layer1 tests, benchmark coverage, target verifies, required skill audits, generated showcase refresh, targeted searches, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. Product intake, specification, UI, phase planning, and run execution contracts now default new SaaS/product work to a clickable local/static prototype with fake, fixture, or in-memory data unless infrastructure is explicitly approved or required to test the core interaction. Benchmark coverage now asserts prototype-first defaults, deferred production infrastructure, and evidence before infrastructure promotion. Generated Skills Showcase assets and the benchmark results matrix were refreshed. Validation passed: focused layer1 setup/quality tests, benchmark coverage, target verifies for all five updated skills, install and skill audits, showcase data validation, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill feature-interview`.

## Current Targeted Update: update-packages pnpm Fixture Evidence Tolerance 2026-05-18

**Goal:** Fix the custom `update-packages` benchmark setup so fixture-based retained publish-time proof for the selected pnpm package-manager version passes without allowing mismatched or unverified pnpm versions.

**Acceptance Criteria:**
- [x] Relevant lessons, the pnpm fixture evidence triage report, current benchmark proof detector, and focused layer1 coverage are reviewed.
- [x] `tests/layer4/setups/tier23-global-workflows.setup.ts` detects selected-version fixture proof from `npm-view-times.json`.
- [x] Focused layer1 coverage proves the failed Codex run #2 shape passes and a mismatched-version fixture proof still fails.
- [x] Focused layer1 tests, benchmark coverage, target verify, required skill audits, targeted search, smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. The custom `update-packages` benchmark setup now supports predicate-based expected evidence for cases where regex alone is too loose or too brittle. `provesSelectedPnpmToolchainAgeEligibility` preserves existing accepted proof forms and also accepts retained `npm-view-times.json` fixture evidence only when the selected `packageManager` pnpm version matches the timestamp key. Focused layer1 coverage proves the failed Codex run #2 shape and rejects a mismatched fixture proof where `packageManager` selects `pnpm@10.22.0` but the retained timestamp is for `10.11.0`. Validation passed: focused layer1 setup/quality tests, benchmark coverage, target verify, install and skill scripts, targeted `rg`, `git diff --check`, and Codex smoke benchmark `update-packages-codex-120085b6` with 1/1 hard assertions. Generated Skills Showcase data was not refreshed because no tracked skill metadata/behavior or curated benchmark/review report changed. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Analysis: Prototype-First vs Complete SaaS Workflow Drag 2026-05-18

**Goal:** Analyze local Claude and Codex session history for evidence that attempts to build complete SaaS products too early introduce database, payments, analytics, deployment, and production-hardening work before clickable prototypes have calibrated taste and feel.

**Acceptance Criteria:**
- [x] Full available Claude and Codex user-message history is parsed or unreadable sources are reported.
- [x] The report includes exact counts, date ranges, top projects, pattern examples, and a recommendation table.
- [x] Recommended skill/workflow amendments identify owner surfaces and validation expectations.
- [x] Results are recorded in `tasks/todo.md` with validation evidence.

**Result:** Analysis completed on 2026-05-18. Local Claude and Codex history contained 14,977 user messages across 5,654 sessions from 2025-12-10 through 2026-05-18. The report found 612 complete-SaaS/production messages versus 230 prototype-first messages, 432 infrastructure-only sessions versus 105 prototype-only sessions, and mixed-session ordering that more often introduced infrastructure before prototype language than the reverse. Report: `tasks/prototype-first-saas-workflow-report.md`. Recommended next command: `$targeted-skill-builder product workflow prototype-first gate before SaaS infrastructure`.

## Current Triage: update-packages pnpm Proof Fixture Evidence Failure 2026-05-18

**Goal:** Investigate the latest `$benchmark-test-skill update-packages` Codex failure and classify whether the failed pnpm toolchain-proof assertion is a skill-contract gap, benchmark harness defect, generated-output noncompliance, or infrastructure-only block.

**Acceptance Criteria:**
- [x] Latest curated benchmark report and raw Claude/Codex report JSON are inspected.
- [x] Retained Codex run #2 `package-update-plan.md` evidence is inspected for the failed pnpm proof assertion.
- [x] Mirrored `update-packages` contracts are compared with the benchmark prompt, current proof pattern, and focused layer1 coverage.
- [x] `benchmark/triage-update-packages-2026-05-18-pnpm-proof-fixture-evidence.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the latest `update-packages` benchmark failure as a benchmark harness false negative with a separate fully blocked Claude lane, not a mirrored skill-contract failure. Claude session `update-packages-claude-29df606d` had no evaluated runs and three agent-runner budget blocks. Codex session `update-packages-codex-870b131b` completed three evaluated runs; run #2 failed only `Output proves selected pnpm toolchain age eligibility`. The retained artifact selected `pnpm@10.11.0`, cited fixture evidence from `npm-view-times.json` for `"10.11.0": "2026-05-01T12:00:00.000Z"`, stated the version is older than 8 days, and skipped `pnpm@10.22.0` as too new. Root cause: `UPDATE_PACKAGES_PNPM_TOOLCHAIN_PROOF_PATTERN` misses valid fixture evidence keyed by selected version when the selected package name and timestamp are not repeated in the currently expected adjacency shape. Report: `benchmark/triage-update-packages-2026-05-18-pnpm-proof-fixture-evidence.md`. Validation passed: required report field scan and `git diff --check`. Recommended next skill: `$targeted-skill-builder update-packages benchmark pnpm fixture evidence tolerance`.

## Current Benchmark: update-packages Fresh Rerun After Age-Gate Tolerance 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` after the benchmark pnpm proof and age-gate semantics tolerance fix and publish deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with all evaluated hard assertions passing and one Claude infrastructure block. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.5s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-bdc852e4` completed two evaluated runs with 2/2 hard assertion pass rate, one agent-runner budget block, 94.0% output quality, p50 latency 57.3s, and $0.75 total estimated cost. Codex session `update-packages-codex-443aab01` completed three evaluated runs with 3/3 hard assertion pass rate, 99.6% output quality, p50 latency 73.2s, and $0.75 total estimated cost. Failed assertions: none. Report: `benchmark/test-update-packages-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$benchmark-agent-review update-packages`.

## Current Targeted Update: update-packages Benchmark pnpm Proof and Age-Gate Semantics Tolerance 2026-05-18

**Goal:** Fix the custom `update-packages` benchmark setup so valid retained Markdown shapes for pnpm package-manager proof and npm/pnpm age-gate ownership pass, while missing proof and reversed ownership still fail.

**Acceptance Criteria:**
- [x] Valid retained Claude/Codex artifact shapes for pnpm publish-time proof and `packageManager` recommendation pass benchmark assertions.
- [x] Valid Markdown bullet/list/config forms for npm `min-release-age=8` and pnpm `minimum-release-age=11520` / `minimumReleaseAge: 11520` ownership pass benchmark assertions.
- [x] Missing pnpm proof and reversed age-gate ownership examples still fail.
- [x] Focused layer1 coverage, benchmark coverage, target verify, required skill audits, Codex smoke benchmark, targeted search, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. The custom `update-packages` benchmark setup now accepts valid retained Markdown shapes where pnpm publish-time proof and `packageManager` recommendation appear in either order, and accepts common bullet/list/config forms for npm `min-release-age=8` and pnpm `minimum-release-age=11520` / `minimumReleaseAge: 11520` ownership. Negative coverage still rejects missing pnpm proof and explicit reversed ownership. Focused layer1 coverage now includes the failed Claude and Codex retained shapes from the triage. Validation passed: focused layer1 setup/quality tests, benchmark coverage, target verify, install and skill scripts, targeted `rg`, `git diff --check`, and Codex smoke benchmark `update-packages-codex-30ca6459` with 1/1 hard assertions, 98.8% output quality, and no threshold or critical failures. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Triage: update-packages Age-Gate Semantics Benchmark Failure 2026-05-18

**Goal:** Investigate the fresh `$benchmark-test-skill update-packages` failure and classify whether the pnpm toolchain-proof and age-gate semantics failures are skill-contract gaps, benchmark harness defects, generated-output noncompliance, or infrastructure-only blocks.

**Acceptance Criteria:**
- [x] Latest curated benchmark report and raw Claude/Codex report JSON are inspected.
- [x] Retained failed `package-update-plan.md` artifacts are inspected for the failed assertions.
- [x] Mirrored `update-packages` contracts are compared with benchmark prompt, assertions, and quality criteria.
- [x] `benchmark/triage-update-packages-2026-05-18-age-gate-semantics.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the fresh `update-packages` benchmark failure as a benchmark harness false negative with partial infrastructure blocks, not a mirrored skill-contract failure. Claude session `update-packages-claude-225f6efc` had one evaluated failed run and two agent-runner budget blocks; Codex session `update-packages-codex-fd2c4602` had three evaluated failed runs, all on age-gate semantics. Retained artifacts contained the intended pnpm publish-time proof, avoided unqualified `pnpm@latest`, and preserved the age-gate ownership semantics that `min-release-age=8` is npm while `minimum-release-age=11520` / `minimumReleaseAge: 11520` are pnpm coverage. Root cause: `UPDATE_PACKAGES_PNPM_TOOLCHAIN_PROOF_PATTERN` and `UPDATE_PACKAGES_AGE_GATE_SEMANTICS_PATTERN` in `tests/layer4/setups/tier23-global-workflows.setup.ts` are too syntax- and order-sensitive for valid Markdown artifact shapes. Report: `benchmark/triage-update-packages-2026-05-18-age-gate-semantics.md`. Validation passed: required report field scan and `git diff --check`. Recommended next skill: `$targeted-skill-builder update-packages benchmark pnpm proof and age-gate semantics tolerance`.

## Current Benchmark: update-packages Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state and publish deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports its coverage status.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failures, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with a deterministic both-agent failure and partial Claude infrastructure blocks. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.3s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-225f6efc` completed one evaluated run and had two agent-runner budget blocks, with 0/1 hard assertion pass rate, 75.0% output quality, p50 latency 57.1s, and $0.75 total estimated cost. Codex session `update-packages-codex-fd2c4602` completed three evaluated runs with 0/3 hard assertion pass rate, 89.7% output quality, p50 latency 68.0s, and $0.75 total estimated cost. Failed assertions covered pnpm toolchain proof and age-gate semantics for Claude, and age-gate semantics for all Codex runs. Report: `benchmark/test-update-packages-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Targeted Update: benchmark-agent-review Owner Table Label Tolerance 2026-05-18

**Goal:** Fix the `benchmark-agent-review` benchmark quality evaluator so remediation table headers such as `Owner target / owner file` and `Exact owner target / files` pass when exact owner paths and validation checks are present, while broad owner targets still fail.

**Acceptance Criteria:**
- [x] Owner-label detection accepts slash-composed remediation table headers for owner target/file/surface combinations.
- [x] The evaluator still requires exact known owner paths or scoped owner-plus-lookup evidence for owner-target credit.
- [x] Broad owner targets and broad-only remediation remain failing cases.
- [x] Focused layer1 coverage proves the newly accepted table-header forms and retained rejection cases.
- [x] Focused validation, benchmark coverage, target verify, required skill audits, targeted search, Codex smoke benchmark, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `tests/layer4/setups/packs/pack-workflows.setup.ts` now accepts remediation table headers with slash-composed owner columns such as `Owner target / owner file` and `Exact owner target / files` while still requiring exact known owner paths or scoped owner-plus-lookup evidence. Focused layer1 coverage in `tests/layer1/bench-setups.test.ts` proves the newly accepted forms and keeps broad-owner/broad-only remediation failures intact. Validation passed: focused layer1 setup/quality tests, benchmark coverage, `pnpm --dir tests verify --skill benchmark-agent-review`, install and skill scripts, targeted `rg`, `git diff --check`, and Codex smoke benchmark `benchmark-agent-review-codex-176e11dd` with 1/1 hard assertions, 98.3% output quality, and no threshold or critical failures. Recommended next command: `$benchmark-test-skill benchmark-agent-review`.

## Current Triage: benchmark-agent-review Codex Owner Table Labels 2026-05-18

**Goal:** Investigate why the fresh `$benchmark-test-skill benchmark-agent-review` rerun produced Codex output-quality threshold and critical failures on owner-target and validation-specificity criteria.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted Codex run artifacts are inspected.
- [x] Mirrored `benchmark-agent-review` contracts are compared with benchmark setup and quality-rubric expectations.
- [x] Failure is classified as skill-contract gap, benchmark rubric/setup defect, generated-output noncompliance, infrastructure block, or one-off variance.
- [x] `benchmark/triage-benchmark-agent-review-2026-05-18-codex-owner-table-labels.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the fresh Codex quality failure as a benchmark quality-evaluator false negative, with a minor non-critical retained output weakness in run 2 for missing the `rubric` reference trait. Codex runs 1 and 2 named exact owner files and concrete validation checks in remediation tables, but the quality evaluator did not recognize table headers such as `Owner target / owner file` and `Exact owner target / files`. The validation-specificity failures are derivative because that criterion requires the same owner-label helper. Responsible gap: `tests/layer4/setups/packs/pack-workflows.setup.ts` plus focused layer1 coverage in `tests/layer1/bench-setups.test.ts`. Report: `benchmark/triage-benchmark-agent-review-2026-05-18-codex-owner-table-labels.md`. Recommended next skill: `$targeted-skill-builder benchmark-agent-review benchmark owner-table-label tolerance`.

## Current Benchmark: benchmark-agent-review Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill benchmark-agent-review` against the current repository state and publish fresh deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-agent-review` is known and reports custom coverage.
- [x] `pnpm verify --skill benchmark-agent-review` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-agent-review --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-agent-review-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, infrastructure blocks, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18. `benchmark-agent-review` is known with custom benchmark coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`, and verify passed with layer1 PASS in 3.4s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `benchmark-agent-review-claude-a06b0e93` completed two evaluated runs with 2/2 hard assertion pass rate, one infrastructure block for agent runner budget, 100.0% output quality, p50 latency 44.6s, and $0.75 total estimated cost. Codex session `benchmark-agent-review-codex-9c6219ef` completed three evaluated runs with 3/3 hard assertion pass rate, 81.1% output quality, p50 latency 69.2s, and $0.75 total estimated cost. No hard assertions failed, but Codex reported 2 output-quality threshold failures and 2 critical failures for remediation owner-target and validation-specificity criteria. Report: `benchmark/test-benchmark-agent-review-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed after the curated benchmark report changed. Recommended next skill: `$session-triage benchmark-agent-review benchmark failure`.

## Current Targeted Update: benchmark-agent-review Owner Label Tolerance 2026-05-18

**Goal:** Fix the `benchmark-agent-review` benchmark quality evaluator so remediation-ready Markdown owner labels pass while broad owner targets still fail.

**Acceptance Criteria:**
- [x] Owner-target and validation-specificity criteria share owner-label detection.
- [x] The evaluator accepts `Owner target / file:`, `Owner files:`, and `Exact owner files.` when exact known owner paths or scoped owner-plus-lookup evidence is present.
- [x] Broad owner targets and broad-only remediation remain failing cases.
- [x] Focused layer1 coverage proves the newly accepted Markdown label forms and retained rejection cases.
- [x] Focused validation, benchmark coverage, target verify, required skill audits, targeted search, Claude smoke benchmark, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `tests/layer4/setups/packs/pack-workflows.setup.ts` now uses shared owner-label detection for `benchmark-agent-review` owner-target and validation-specificity quality criteria, accepting remediation-ready Markdown labels such as `Owner target / file:` and `Exact owner files.` while still requiring exact known owner paths or scoped owner-plus-lookup evidence. Focused layer1 coverage in `tests/layer1/bench-setups.test.ts` proves the newly accepted forms and keeps broad-owner/broad-only remediation failures intact. Validation passed: focused layer1 setup/quality tests, benchmark coverage, `pnpm --dir tests verify --skill benchmark-agent-review`, install and skill scripts, targeted `rg`, `git diff --check`, and Claude smoke benchmark `benchmark-agent-review-claude-2be30316` with 1/1 hard assertions, 98.3% output quality, and no threshold or critical failures. Recommended next command: `$benchmark-test-skill benchmark-agent-review`.

## Current Targeted Update: update-packages pnpm Latest Markdown-Negation Tolerance 2026-05-18

**Goal:** Fix the `update-packages` benchmark setup so markdown-emphasized and concise negated `pnpm@latest` warnings pass while actual unqualified `pnpm@latest` recommendations still fail.

**Acceptance Criteria:**
- [x] The `update-packages` benchmark assertion accepts markdown-emphasized and concise warning language around `pnpm@latest`.
- [x] The setup still rejects actual unqualified `pnpm@latest` recommendations and package-manager commands.
- [x] Focused layer1 coverage proves both newly accepted warning forms and existing rejected cases.
- [x] Focused validation, benchmark coverage, verify, Claude smoke benchmark, targeted searches, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `UPDATE_PACKAGES_NO_UNQUALIFIED_PNPM_LATEST_PATTERN` now accepts markdown-emphasized warning language such as `do **not** use unqualified pnpm@latest` and concise `not pnpm@latest` warnings, while retaining failures for affirmative recommendations like `migrate to pnpm using pnpm@latest`, `corepack prepare pnpm@latest --activate`, and `packageManager: "pnpm@latest"`. Focused layer1 coverage proves the new accepted forms. Validation passed: focused layer1 setup/quality tests, benchmark coverage, `pnpm --dir tests verify --skill update-packages`, targeted `rg`, and `git diff --check`. Claude smoke benchmark `update-packages-claude-4cc7c2b0` passed 1/1 with 91.2% quality. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Benchmark: update-packages Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state after the pnpm latest markdown-negation benchmark-tolerance fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with a deterministic both-agent pass. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.5s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-fa542bcd` completed three evaluated runs with 3/3 hard assertion pass rate, 91.2% output quality, p50 latency 58.4s, and $0.75 total estimated cost. Codex session `update-packages-codex-03d220e0` completed three evaluated runs with 3/3 hard assertion pass rate, 98.5% output quality, p50 latency 85.7s, and $0.75 total estimated cost. No runs were infrastructure-blocked, and there were no failed hard assertions, threshold failures, or critical failures. Report: `benchmark/test-update-packages-2026-05-18.md`. Recommended next skill: `$benchmark-agent-review update-packages`.

## Current Agent Review: update-packages 2026-05-18

**Goal:** Review the latest persisted `update-packages` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-update-packages-2026-05-18.md`.
- [x] Evaluated generated `package-update-plan.md` artifacts are inspected and infrastructure-blocked runs are excluded.
- [x] `benchmark/review-update-packages-2026-05-18.md` records source reports, run directories, score table, strengths, weaknesses, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed if review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Reviewed five evaluated `package-update-plan.md` artifacts from `update-packages-claude-bdc852e4` and `update-packages-codex-443aab01`; Claude run #1 was excluded because it was infrastructure-blocked by agent runner budget exhaustion. Subjective verdict: excellent overall, with median score 92/100 and range 88-94. The artifacts are operator-ready and correctly handle eligible/skipped versions, persistent age-gate config, retained pnpm publish-time proof, React/Vitest major-upgrade batches, focused smoke checks, migration stop routes, and runner-native handoffs. Main remediation: tighten the deterministic benchmark rubric so valid retained `package-update-plan.md` artifact-reference and verification/actionability evidence is credited consistently. Report: `benchmark/review-update-packages-2026-05-18.md`. Recommended next command: `$targeted-skill-builder update-packages benchmark artifact-reference actionability tolerance`.

## Current Targeted Update: update-packages pnpm Toolchain Proof and Age-Gate Semantics 2026-05-18

**Goal:** Tighten `update-packages` so pnpm package-manager recommendations are backed by retained age-eligibility proof and age-gate key semantics cannot drift.

**Acceptance Criteria:**
- [x] Mirrored `update-packages` contracts require retained project-pin or registry publish-time proof before recommending a new `packageManager: "pnpm@..."` value.
- [x] Mirrored contracts clarify that `min-release-age=8` is npm's relative age guard and `minimum-release-age=11520`/`minimumReleaseAge: 11520` are pnpm coverage where supported.
- [x] The custom benchmark prompt and quality checks require pnpm toolchain proof and correct age-gate semantics.
- [x] Focused layer1 coverage proves passing proof, missing-proof failure, and reversed-semantics failure.
- [x] Validation passes, generated assets are refreshed, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `update-packages` now requires retained project-pin or registry publish-time proof before recommending a new `packageManager: "pnpm@..."` value as final, and clarifies age-gate setting ownership across npm and pnpm config surfaces. The custom benchmark setup now prompts for pnpm publish-time proof, includes pnpm fixture publish times, and checks both pnpm toolchain proof and age-gate key semantics as hard assertions and output-quality criteria. Focused layer1 coverage proves passing proof, missing-proof failure, and reversed-semantics failure. Validation passed: focused layer1 setup/quality tests, benchmark coverage, `pnpm --dir tests verify --skill update-packages`, install and skill scripts, Codex smoke benchmark `update-packages-codex-afdc4a08` (1/1 hard assertions, 98.8% quality), benchmark-results matrix tests, targeted `rg`, and `git diff --check`. Generated Skills Showcase data and benchmark matrix were refreshed after tracked skill behavior changed. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Benchmark: update-packages After pnpm Proof 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` after the pnpm toolchain-proof and age-gate semantics update and publish fresh deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with deterministic evaluated failures and partial Claude infrastructure blocks. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.5s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-5c4392a3` had one evaluated run, which failed both `Output proves selected pnpm toolchain age eligibility` and `Output preserves age-gate key semantics`, while two Claude runs were infrastructure-blocked by agent runner budget. Codex session `update-packages-codex-31ad8c8d` completed three evaluated runs with 1/3 hard assertion pass rate; runs #0 and #1 failed `Output preserves age-gate key semantics`. Report: `benchmark/test-update-packages-2026-05-18.md`. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Targeted Update: benchmark-agent-review Benchmark Quality Owner Specificity Tolerance 2026-05-18

**Goal:** Align the `benchmark-agent-review` pack benchmark prompt and quality rubric so owner-specific remediation is tested without brittle literal-token false positives.

**Acceptance Criteria:**
- [x] The `benchmark-agent-review` pack setup prompts exact owner files when known and scopes deterministic quality evaluation to `pack-benchmark-output.md`.
- [x] Owner-target and validation-specificity quality checks accept exact file owners, scoped owner-plus-lookup notes, Markdown remediation tables, and benign `update existing skill` labels when concrete validation exists.
- [x] Focused layer1 coverage proves exact owner paths pass, scoped owner lookup passes, broad owner targets lose credit, and broad-only remediation still fails.
- [x] Focused validation, target verify, skill scripts, generated-data refresh, and Codex smoke benchmark pass or have documented caveats.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. `tests/layer4/setups/packs/pack-workflows.setup.ts` now asks the `benchmark-agent-review` pack benchmark to name exact owner files when known, evaluates quality from `pack-benchmark-output.md` instead of runner logs, accepts Markdown remediation-table owner headers, and uses contextual owner-target/validation-specificity criteria instead of brittle literal `SKILL.md` and broad forbidden-phrase checks. Focused layer1 coverage in `tests/layer1/bench-setups.test.ts` proves exact owner files, scoped owner-plus-lookup, broad owner failure, and benign `update existing skill` tolerance. Validation passed: focused layer1 tests, benchmark coverage, `pnpm --dir tests verify --skill benchmark-agent-review`, install and skill scripts, targeted `rg`, and `git diff --check`. Codex smoke benchmark `benchmark-agent-review-codex-24dddd8f` passed 1/1 with 100.0% output quality and no threshold or critical failures. Generated Skills Showcase data and benchmark matrix were refreshed; GitHub proof assets were left unstaged because an unrelated dirty `tests/layer4/setups/tier23-global-workflows.setup.ts` change would alter their fingerprint. Recommended next command: `$benchmark-test-skill benchmark-agent-review`.

## Current Triage: update-packages Benchmark Failure 2026-05-18

**Goal:** Investigate the fresh `$benchmark-test-skill update-packages` Claude hard-assertion failures and identify the smallest verified fix.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `update-packages` contracts are compared with benchmark setup and quality-rubric expectations.
- [x] Failure is classified as skill-contract failure, harness/rubric defect, generated-output noncompliance, infrastructure block, or one-off variance.
- [x] `benchmark/triage-update-packages-2026-05-18-benchmark-failure.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the fresh benchmark failure as a benchmark harness false negative. Claude session `update-packages-claude-12d8fabf` failed two runs on `Output avoids unqualified pnpm@latest`, but the retained artifacts selected pinned pnpm versions and mentioned `pnpm@latest` only in negated warning language. The current regex accepts some warning forms but misses markdown-emphasized and concise negation such as `do **not** use unqualified pnpm@latest` and `not pnpm@latest`. Responsible gap: `tests/layer4/setups/tier23-global-workflows.setup.ts` and focused layer1 coverage in `tests/layer1/bench-setups.test.ts`. Report: `benchmark/triage-update-packages-2026-05-18-benchmark-failure.md`. Validation passed: required report field scan and `git diff --check`. Recommended next skill: `$targeted-skill-builder update-packages benchmark pnpm latest markdown-negation tolerance`.

## Current Benchmark: update-packages Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` after the pnpm latest benchmark-tolerance fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-18.md` records verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18 with a deterministic both-agent failure. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.3s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-12d8fabf` completed three evaluated runs with 1/3 hard assertion pass rate, 82.8% output quality, p50 latency 64.1s, and $0.75 total estimated cost. Codex session `update-packages-codex-d7c07a6a` completed three evaluated runs with 3/3 hard assertion pass rate, 98.0% output quality, p50 latency 68.4s, and $0.75 total estimated cost. No runs were infrastructure-blocked. The failed assertion was `Output avoids unqualified pnpm@latest` in Claude runs #0 and #1. Report: `benchmark/test-update-packages-2026-05-18.md`. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Triage: benchmark-agent-review Quality Failure 2026-05-18

**Goal:** Investigate the fresh `$benchmark-test-skill benchmark-agent-review` Codex output-quality threshold and critical failures and identify the smallest verified fix.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted Codex run evidence are inspected.
- [x] Mirrored `benchmark-agent-review` contracts are compared with benchmark setup and quality rubric expectations.
- [x] Failure is classified as skill-contract failure, harness/rubric defect, generated-output noncompliance, infrastructure block, or one-off variance.
- [x] `benchmark/triage-benchmark-agent-review-2026-05-18.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified a real deterministic output-quality gate failure but not a pure skill-contract failure. Both agents passed hard assertions 3/3, and Codex had 1 threshold failure plus 1 critical failure. The generated outputs cited retained `ship-manifest.md` evidence and included owner targets, behavior changes, validation checks, and the correct route, but owner targets were broad rather than exact files. Root cause is a benchmark setup/rubric calibration gap with a secondary output-specificity weakness: the prompt asks for owner targets while the quality criterion requires literal `SKILL.md`, and the validation-specificity check treats benign `update existing skill` wording as critical even when concrete validation checks exist. Report: `benchmark/triage-benchmark-agent-review-2026-05-18.md`. Validation passed: required report field scan and `git diff --check`. Recommended next skill: `$targeted-skill-builder benchmark-agent-review benchmark quality owner specificity tolerance`.

## Current Benchmark: benchmark-agent-review Fresh Rerun 2026-05-18

**Goal:** Run `$benchmark-test-skill benchmark-agent-review` against the current repository state and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-agent-review` is known and reports custom coverage.
- [x] `pnpm verify --skill benchmark-agent-review` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-agent-review --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-agent-review-2026-05-18.md` records fresh verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-18. `benchmark-agent-review` is known with custom benchmark coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`, and verify passed with layer1 PASS in 3.7s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `benchmark-agent-review-claude-f72e03c7` completed three evaluated runs with 3/3 hard assertion pass rate, 81.7% output quality, p50 latency 45.4s, and $0.75 total estimated cost. Codex session `benchmark-agent-review-codex-089d4f4f` completed three evaluated runs with 3/3 hard assertion pass rate, 98.9% output quality, p50 latency 59.1s, and $0.75 total estimated cost. No runs were infrastructure-blocked, and there were no failed hard assertions, but Claude reported 2 output-quality threshold failures and 2 critical failures for remediation owner-target and validation-specificity criteria. Report: `benchmark/test-benchmark-agent-review-2026-05-18.md`. Generated Skills Showcase data and benchmark results matrix were refreshed after the curated benchmark report changed. The validation script regenerated expected assets and reported them stale pending commit. Recommended next skill: `$session-triage benchmark-agent-review benchmark failure`.

## Current Targeted Update: update-packages Major-Upgrade Risk Handling 2026-05-17

**Goal:** Tighten `update-packages` so major/framework/build-tool updates require explicit compatibility checks, batch boundaries, focused smoke tests, and migration stop routes.

**Acceptance Criteria:**
- [x] Mirrored `update-packages` contracts require package-manager version selection that avoids unqualified `pnpm@latest`.
- [x] Mirrored contracts require major/framework/build-tool risk sections with batch order, peer/config compatibility checks, focused smoke checks, and stop routes.
- [x] The `update-packages` benchmark prompt and quality checks require major-upgrade compatibility evidence and reject unqualified `pnpm@latest`.
- [x] Focused layer1 coverage proves passing risk-handling evidence, missing-risk failure, and unqualified-`pnpm@latest` failure.
- [x] Validation passes, generated assets are refreshed, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-17. `update-packages` now requires major/framework/build-tool updates to include batch order, peer/config compatibility checks, focused smoke checks, and a `$migrate`/`/migrate` stop route when compatibility work exceeds dependency-update scope. The contracts also forbid unqualified `pnpm@latest` defaults in favor of existing/toolchain or age-eligible pnpm versions. The custom benchmark setup now asks for this evidence and quality-checks it. Codex smoke benchmark `update-packages-codex-8d320ac5` passed 1/1 after the fix. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Benchmark: benchmark-agent-review Retained Artifact Evidence Rerun 2026-05-17

**Goal:** Run `$benchmark-test-skill benchmark-agent-review` after the retained-artifact evidence fixture update and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-agent-review` is known and reports custom coverage.
- [x] `pnpm verify --skill benchmark-agent-review` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-agent-review --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-agent-review-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-17 after the retained-artifact fixture update. `benchmark-agent-review` is known with custom benchmark coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`, and verify passed with layer1 PASS in 3.2s plus layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed without infrastructure blocks: Claude session `benchmark-agent-review-claude-3378af86` passed 3/3 hard assertions with 99.2% output quality, p50 latency 48.2s, and $0.75 total estimated cost; Codex session `benchmark-agent-review-codex-0ceac781` passed 3/3 hard assertions with 99.2% output quality, p50 latency 56.1s, and $0.75 total estimated cost. Report: `benchmark/test-benchmark-agent-review-2026-05-17.md`. Generated Skills Showcase data and the benchmark results matrix were refreshed after curated benchmark evidence changed. Recommended next skill: `$benchmark-agent-review benchmark-agent-review`.

## Current Agent Review: update-packages 2026-05-17

**Goal:** Review the latest persisted `update-packages` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-update-packages-2026-05-17.md`.
- [x] Evaluated generated `package-update-plan.md` artifacts are inspected and infrastructure-blocked runs are excluded.
- [x] `benchmark/review-update-packages-2026-05-17.md` records source reports, run directories, score table, strengths, weaknesses, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed if review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Reviewed six retained `package-update-plan.md` artifacts from `update-packages-claude-2611723c` and `update-packages-codex-2216d07d`. No runs were infrastructure-blocked. Subjective verdict: good overall, with median score 87/100 and range 80-90. The artifacts are operator-usable and correctly handle eligibility, skipped versions, age-gate config, verification commands, and runner-native routes. The main remediation is to strengthen major-upgrade risk handling for React/Vitest with concrete compatibility checks, batch boundaries, and stop-route guidance. Report: `benchmark/review-update-packages-2026-05-17.md`. Recommended next command: `$targeted-skill-builder update-packages major-upgrade risk handling`.

## Current Benchmark: update-packages Fresh Pass 2026-05-17

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state and publish fresh deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-17 with a deterministic both-agent pass. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.3s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-2611723c` completed three evaluated runs with 3/3 hard assertion pass rate, 86.5% output quality, p50 latency 34.0s, and $0.75 total estimated cost. Codex session `update-packages-codex-2216d07d` completed three evaluated runs with 3/3 hard assertion pass rate, 94.2% output quality, p50 latency 60.1s, and $0.75 total estimated cost. No runs were infrastructure-blocked. Report: `benchmark/test-update-packages-2026-05-17.md`. Recommended next skill: `$benchmark-agent-review update-packages`.

## Current Benchmark: update-packages After Risk Handling 2026-05-17

**Goal:** Run `$benchmark-test-skill update-packages` after the major-upgrade risk-handling update and publish fresh deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-17 with a deterministic both-agent failure. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.3s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-e7c523af` completed three evaluated runs with 1/3 hard assertion pass rate, 83.3% output quality, p50 latency 49.3s, and $0.75 total estimated cost. Codex session `update-packages-codex-c8dbd66e` completed three evaluated runs with 2/3 hard assertion pass rate, 93.6% output quality, p50 latency 90.2s, and $0.75 total estimated cost. No runs were infrastructure-blocked. The failed assertion was `Output avoids unqualified pnpm@latest`. Report: `benchmark/test-update-packages-2026-05-17.md`. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Triage: update-packages Benchmark pnpm Latest Failure 2026-05-18

**Goal:** Investigate why the fresh `$benchmark-test-skill update-packages` rerun failed `Output avoids unqualified pnpm@latest` and identify the smallest verified fix.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted failed run artifacts are inspected.
- [x] Mirrored `update-packages` contracts are compared with the benchmark setup expectation.
- [x] Failure is classified as skill-contract failure, harness false negative, infrastructure block, or agent noncompliance.
- [x] `benchmark/triage-update-packages-2026-05-18-pnpm-latest.md` records verdict, root cause, responsible gap, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Triage verified the deterministic hard-assertion failure as a benchmark harness/setup false negative. The failed artifacts selected pinned pnpm versions such as `pnpm@9.12.0`, `pnpm@9.15.4`, and `pnpm@10.22.0`, while warning not to use unqualified `pnpm@latest`. The setup's negative-lookahead regex failed valid warning language unless a narrow allowed phrase appeared after `pnpm@latest`, and it failed Codex even when `existing local toolchain` appeared before the warning. Responsible gap: `tests/layer4/setups/tier23-global-workflows.setup.ts` and focused layer1 coverage. Report: `benchmark/triage-update-packages-2026-05-18-pnpm-latest.md`. Recommended next skill: `$targeted-skill-builder update-packages benchmark pnpm latest negation tolerance`.

## Current Targeted Update: update-packages pnpm Latest Benchmark Tolerance 2026-05-18

**Goal:** Fix the `update-packages` benchmark setup so negated `pnpm@latest` warnings pass while actual unqualified `pnpm@latest` recommendations still fail.

**Acceptance Criteria:**
- [x] The `update-packages` benchmark assertion accepts explicit warning/avoidance language around `pnpm@latest`.
- [x] The setup still rejects actual unqualified `pnpm@latest` recommendations and package-manager commands.
- [x] Focused layer1 coverage proves both accepted and rejected cases.
- [x] Focused validation, benchmark coverage, verify, skill checks, Codex smoke benchmark, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-18. The `update-packages` benchmark assertion now tolerates explicit warning language such as `do not use unqualified pnpm@latest`, `rather than pnpm@latest`, and `never default to pnpm@latest`, while retaining failures for affirmative recommendations like `migrate to pnpm using pnpm@latest`, `corepack prepare pnpm@latest --activate`, and `packageManager: "pnpm@latest"`. Codex smoke benchmark `update-packages-codex-3a7b1c07` passed 1/1 with 97.1% quality. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Agent Review: benchmark-agent-review Retained Artifact Evidence 2026-05-17

**Goal:** Review the latest persisted `benchmark-agent-review` Claude and Codex benchmark outputs for subjective operator quality after retained `ship-manifest.md` evidence was added to the fixture.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-benchmark-agent-review-2026-05-17.md`.
- [x] Evaluated generated artifacts are inspected and infrastructure-blocked runs are excluded.
- [x] `benchmark/review-benchmark-agent-review-2026-05-17.md` records source reports, run directories, score table, strengths, weaknesses, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed if review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Reviewed Claude session `benchmark-agent-review-claude-3378af86` and Codex session `benchmark-agent-review-codex-0ceac781`, covering six evaluated `pack-benchmark-output.md` artifacts and excluding no infrastructure-blocked runs. Subjective quality was usable to excellent: every output inspected retained `ship-manifest.md` artifact text directly, identified placeholder residual-risk and monitoring sections, avoided benchmark-laxness framing, and routed to targeted remediation. Median subjective score was 86/100 with range 78-94. Main remediation: strengthen `benchmark-agent-review` remediation expectations and the benchmark rubric so reviews must name owner targets and validation checks when retained artifacts contain placeholder risk/monitoring text. Report: `benchmark/review-benchmark-agent-review-2026-05-17.md`. Generated Skills Showcase data was refreshed after curated review evidence changed. Recommended next command: `$targeted-skill-builder benchmark-agent-review remediation-owner validation specificity`.

## Current Targeted Update: benchmark-agent-review Remediation Owner Validation Specificity 2026-05-17

**Goal:** Tighten `benchmark-agent-review` so retained-artifact reviews turn output-quality weaknesses into owner-specific, validation-ready remediation.

**Acceptance Criteria:**
- [x] Mirrored `benchmark-agent-review` contracts require owner targets, proposed behavior changes, and concrete validation checks when material weaknesses are found.
- [x] The benchmark prompt/rubric requires remediation owner-target and validation-check specificity for the retained `ship-manifest.md` fixture.
- [x] Focused layer1 coverage proves strong remediation passes and broad "update the skill / rerun fixture" remediation loses top-band quality credit.
- [ ] Validation passes, generated assets are refreshed if needed, and intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-17. Mirrored `benchmark-agent-review` contracts now require implementation-ready remediation rows with owner target, behavior change, and validation proof, especially when retained artifacts contain placeholder risk/monitoring text. The pack benchmark prompt and quality rubric now require owner-target and validation-check specificity for the retained `ship-manifest.md` fixture, with focused layer1 coverage proving strong remediation passes and broad "update the skill / rerun fixture" remediation fails the new critical validation-specificity criterion. Codex smoke benchmark `benchmark-agent-review-codex-1c0359b3` passed 1/1 with 100.0% quality. Recommended next command: `$benchmark-test-skill benchmark-agent-review`.

## Current Targeted Update: benchmark-agent-review Route Prompt Alignment 2026-05-17

**Goal:** Align the `benchmark-agent-review` pack benchmark setup with runner-specific targeted-skill-builder routes and prompt the expected remediation handoff explicitly.

**Acceptance Criteria:**
- [x] The pack setup uses `/targeted-skill-builder ...` for Claude and `$targeted-skill-builder ...` for Codex.
- [x] The benchmark prompt explicitly asks for a remediation-ready targeted-skill-builder handoff for the residual-risk gap.
- [x] Focused layer1 coverage proves Claude/Codex route acceptance and rejects generic or non-remediation routes.
- [x] Focused validation, benchmark coverage, install/skill checks, targeted searches, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Updated on 2026-05-17. `benchmark-agent-review` pack benchmark coverage now prompts a remediation-ready residual-risk-awareness handoff and asserts runner-specific targeted-skill-builder routes: `/targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap` for Claude and `$targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap` for Codex. Focused layer1 coverage proves exact route acceptance and rejects generic/non-remediation routes. Codex smoke benchmark `benchmark-agent-review-codex-384f7822` passed 1/1 after the fix. Recommended next command: `$benchmark-test-skill benchmark-agent-review`.

## Current Benchmark: benchmark-agent-review Fresh Rerun 2026-05-17

**Goal:** Run `$benchmark-test-skill benchmark-agent-review` after the route prompt alignment fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-agent-review` is known and reports custom coverage.
- [x] `pnpm verify --skill benchmark-agent-review` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-agent-review --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-agent-review-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-17. `benchmark-agent-review` is known with custom benchmark coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`, and verify passed with layer1 PASS in 3.3s plus layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed without infrastructure blocks: Claude session `benchmark-agent-review-claude-10351b11` passed 3/3 hard assertions with 100.0% output quality, p50 latency 41.1s, and $0.75 total estimated cost; Codex session `benchmark-agent-review-codex-558b7ba6` passed 3/3 hard assertions with 98.3% output quality, p50 latency 45.6s, and $0.75 total estimated cost. Report: `benchmark/test-benchmark-agent-review-2026-05-17.md`. Generated Skills Showcase data and the benchmark results matrix were refreshed and validated. Recommended next skill: `$benchmark-agent-review benchmark-agent-review`.

## Current Agent Review: benchmark-agent-review 2026-05-17

**Goal:** Review the latest persisted `benchmark-agent-review` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from the curated benchmark report.
- [x] Evaluated generated artifacts are inspected and infrastructure-blocked runs are excluded.
- [x] `benchmark/review-benchmark-agent-review-2026-05-17.md` records source reports, run directories, score table, strengths, weaknesses, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed if review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. Reviewed Claude session `benchmark-agent-review-claude-10351b11` and Codex session `benchmark-agent-review-codex-558b7ba6`, covering six evaluated `pack-benchmark-output.md` artifacts and excluding no infrastructure-blocked runs. Subjective quality was good to excellent: all outputs used local fixture evidence, focused on the generated artifact's residual-risk-awareness gap rather than benchmark laxness, and routed to targeted remediation. Median subjective score was 89.5/100 with range 82-95. Main caveat: the fixture summarizes `ship-manifest.md` but does not retain the full artifact text. Report: `benchmark/review-benchmark-agent-review-2026-05-17.md`. Recommended next command: `$targeted-skill-builder benchmark-agent-review retained-artifact evidence gap`.

## Current Targeted Update: benchmark-agent-review Retained Artifact Evidence 2026-05-17

**Goal:** Update the `benchmark-agent-review` benchmark fixture so generated reviews can inspect retained `ship-manifest.md` artifact text, not only the fixture summary.

**Acceptance Criteria:**
- [x] The pack setup creates a retained `ship-manifest.md` fixture for `benchmark-agent-review`.
- [x] The benchmark prompt tells agents to inspect `ship-manifest.md` directly.
- [x] Hard assertions require generated output to cite concrete retained artifact evidence, not only `pack-input.md`.
- [x] Focused layer1 coverage proves fixture creation, prompt requirements, and artifact-evidence scoring.
- [x] Validation passes and results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so the `benchmark-agent-review` fixture retains `ship-manifest.md`, prompts direct artifact inspection, and requires generated outputs to cite concrete retained artifact evidence. Added layer1 coverage for fixture creation, prompt requirements, passing artifact-specific evidence, and rejected summary-only evidence. Codex smoke benchmark `benchmark-agent-review-codex-dd1c3ebb` passed 1/1 with 97.5% quality. Recommended next command: `$benchmark-test-skill benchmark-agent-review`.

## Current Triage: update-packages Fresh Benchmark Failure 2026-05-17

**Goal:** Verify the latest `$benchmark-test-skill update-packages` failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] `update-packages` skill contracts and the custom benchmark setup expectations are compared.
- [x] Failure is classified as skill contract gap, benchmark harness defect, generated-data issue, infrastructure block, or agent noncompliance.
- [x] `benchmark/triage-update-packages-2026-05-17-fresh.md` records verdict, root cause, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Verified benchmark setup false negative on 2026-05-17. Claude session `update-packages-claude-c99f0776` passed 2/3 hard assertion runs; the failed run wrote `package-update-plan.md` with a `## Verification` section and command blocks, but missed the setup's exact `verification commands` phrase. Codex session `update-packages-codex-e51e553b` passed 3/3. The current mirrored `update-packages` contracts require verification behavior but not that literal phrase. Report: `benchmark/triage-update-packages-2026-05-17-fresh.md`. Recommended next skill: `$targeted-skill-builder update-packages benchmark verification phrase tolerance`.

## Current Triage: benchmark-agent-review Benchmark Failure 2026-05-17

**Goal:** Investigate why `$benchmark-test-skill benchmark-agent-review` failed the `$targeted-skill-builder` recommendation assertion and identify the smallest verified fix.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `benchmark-agent-review` skill contracts and the custom pack benchmark setup are compared.
- [x] Failure is classified as skill contract gap, benchmark harness defect, generated-data issue, infrastructure block, or agent noncompliance.
- [x] `benchmark/triage-benchmark-agent-review-2026-05-17.md` records verdict, root cause, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Verified benchmark setup defect on 2026-05-17. The failed benchmark had no infrastructure blocks: Claude failed 3/3 and Codex failed 1/3 on `Output recommends $targeted-skill-builder`. The custom pack setup uses a single Codex-style `nextRoute: "$targeted-skill-builder"` and only exposes `nextRoutes` values in the prompt, so the benchmark both underprompts the expected route and fails Claude against the wrong runner convention. The mirrored `benchmark-agent-review` contracts already include remediation-ready targeted-skill-builder handoffs. Report: `benchmark/triage-benchmark-agent-review-2026-05-17.md`. Recommended next skill: `$targeted-skill-builder benchmark-agent-review benchmark runner route and prompt alignment`.

## Current Benchmark: benchmark-agent-review 2026-05-17

**Goal:** Run `$benchmark-test-skill benchmark-agent-review` against the current repository state and publish deterministic both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-agent-review` is known and reports custom coverage.
- [x] `pnpm verify --skill benchmark-agent-review` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-agent-review --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-agent-review-2026-05-17.md` records verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Deterministic benchmark failure on 2026-05-17. `benchmark-agent-review` is known with custom benchmark coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`, and verify passed with layer1 PASS in 3.4s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `benchmark-agent-review-claude-a4f7218d` completed three evaluated runs with 0/3 hard assertion pass rate, 89.2% output quality, p50 latency 33.4s, and $0.75 total estimated cost. Codex session `benchmark-agent-review-codex-f6a6014a` completed three evaluated runs with 2/3 hard assertion pass rate, 100.0% output quality, p50 latency 76.5s, and $0.75 total estimated cost. No runs were infrastructure-blocked. Report: `benchmark/test-benchmark-agent-review-2026-05-17.md`. Recommended next skill: `$session-triage benchmark-agent-review benchmark failure`.

## Current Benchmark Rerun: update-packages 2026-05-17

**Goal:** Rerun `$benchmark-test-skill update-packages` after the route and fixture-rubric alignment and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-17 with a mixed deterministic result. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.3s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-c99f0776` completed three evaluated runs with 2/3 hard assertion pass rate, 75.0% output quality, p50 latency 34.7s, and $0.75 total estimated cost. Codex session `update-packages-codex-e51e553b` completed three evaluated runs with 3/3 hard assertion pass rate, 93.2% output quality, p50 latency 53.7s, and $0.75 total estimated cost. No runs were infrastructure-blocked. Report: `benchmark/test-update-packages-2026-05-17.md`. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Targeted Update: update-packages Benchmark Route And Fixture Rubric 2026-05-17

**Goal:** Fix the `update-packages` benchmark setup so it tests runner-native final handoffs and does not penalize fixture-backed `package-lock.json` evidence.

**Acceptance Criteria:**
- [x] `update-packages` benchmark prompt requires package-manager shell commands inside `package-update-plan.md`, not as the final handoff.
- [x] The setup expects `/exec` for Claude and `$exec` for Codex.
- [x] `package-lock.json` is allowed only when the setup fixture explicitly provides it.
- [x] Focused layer1 tests cover accepted runner routes, rejected shell-command handoff, age-gate facts, and fixture-backed `package-lock.json`.
- [x] Validation passes and results are recorded in `tasks/todo.md`; intended changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-17. `update-packages` benchmark coverage now requires runner-native final handoffs while keeping package-manager commands inside the generated plan artifact, and it allows the fixture-backed `package-lock.json` term without weakening the generic fabrication guard for other workflows. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Benchmark: update-packages 2026-05-17

**Goal:** Run `$benchmark-test-skill update-packages` after the installer age-gate contract update and publish deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `update-packages` is known and reports custom coverage.
- [x] `pnpm verify --skill update-packages` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-update-packages-2026-05-17.md` records verify, benchmark, latency, cost, consistency, failed assertions, raw session evidence, and recommended next route.
- [x] Results are recorded in `tasks/todo.md`, generated evidence is refreshed if needed, then intended changes are committed and pushed on `master`.

**Result:** Deterministic benchmark failure on 2026-05-17. `update-packages` is known with custom benchmark coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`, and verify passed with layer1 PASS in 3.4s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `update-packages-claude-573c54a8` completed three evaluated runs with 0/3 hard assertion pass rate, 21.2% output quality, p50 latency 42.7s, and $0.75 total estimated cost. Codex session `update-packages-codex-51516b57` completed three evaluated runs with 0/3 hard assertion pass rate, 47.7% output quality, p50 latency 57.1s, and $0.75 total estimated cost. No runs were infrastructure-blocked. Report: `benchmark/test-update-packages-2026-05-17.md`. Recommended next skill: `$session-triage update-packages benchmark failure`.

## Current Skill Update: update-packages Install Age Gate 2026-05-17

**Goal:** Require `update-packages` runs to add project package-manager configuration that blocks npm and pnpm from installing package versions published within the last 8 days.

**Acceptance Criteria:**
- [x] Mirrored `global/codex/update-packages` and `global/claude/update-packages` contracts require a project `.npmrc` with npm's `min-release-age=8`.
- [x] The contracts require pnpm's equivalent 8-day gate using `minimum-release-age=11520` where supported and `pnpm-workspace.yaml` `minimumReleaseAge: 11520` when modern pnpm configuration requires it.
- [x] Benchmark fixture expectations cover `.npmrc` and package-manager age-gate behavior.
- [x] Generated Skills Showcase data is refreshed and validation passes.
- [x] Results are recorded in `tasks/todo.md`, then changes are committed and pushed on `master`.

**Result:** Updated on 2026-05-17. `update-packages` now requires mutation runs to persist installer-level age gates: `.npmrc` with `min-release-age=8`, pnpm's `minimum-release-age=11520` where `.npmrc` is honored, and `minimumReleaseAge: 11520` in `pnpm-workspace.yaml` or project pnpm config when the active pnpm version requires non-auth settings there. The benchmark fixture now requires `.npmrc`/age-gate evidence. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Maintenance: Active Project Package Updates 2026-05-17

**Goal:** Update direct dependencies in active pnpm-managed JavaScript projects to the newest registry versions published more than 8 full days ago.

**Acceptance Criteria:**
- [x] Active package surfaces are scoped to `apps/skills-showcase` and `tests`; archived npm snapshots and package-manager fixtures are left unchanged.
- [x] Every selected package version has an npm publish timestamp older than 8 full days as of 2026-05-17.
- [x] Manifests and pnpm lockfiles are updated through pnpm, not by hand.
- [x] Install/update, app tests, app typecheck, app build, test harness validation, benchmark coverage, and whitespace checks pass or any blocker is documented.
- [x] Updated and skipped packages plus verification results are recorded in `tasks/todo.md`, then intended changes are committed and pushed on `master`.

**Result:** Dependency update completed on 2026-05-17. Active pnpm projects were updated with versions older than the `2026-05-09T21:06:51Z` safety cutoff, including app updates for Neon, TanStack Query, Zod, React type packages, Node types, and Vitest, plus test harness updates for Glob, TSX, TypeScript, and Vitest. Too-new registry versions were skipped for TanStack Query, Node types, Vite React plugin, Vitest, and TSX. Validation passed across frozen installs, app tests/typecheck/build, layer1 tests, benchmark coverage, generated showcase validation, and whitespace checks. Recommended next command: `$benchmark-test-skill update-packages`.

## Current Skill Creation: report-website 2026-05-17

**Goal:** Create a mirrored global skill that converts a Markdown report into clean JSX and builds a frontend website for reading it.

**Acceptance Criteria:**
- [x] Mirrored `report-website` skill contracts are created under `global/codex/` and `global/claude/`.
- [x] The skill defines source resolution, Markdown-to-structured-content conversion, JSX implementation, responsive reading UI, visual QA, and shipping expectations.
- [x] Benchmark coverage is registered in `tests/harness/bench-coverage.ts`.
- [x] Required skill and showcase validation passes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Implementation complete on 2026-05-17. Added mirrored `report-website` skill contracts and registered the new global skill in benchmark coverage with the Tier 2/3 global workflow fixture. Generated Skills Showcase data was refreshed and validated. Recommended next command: `$report-website <report.md>`.

## Current Skill Update: report-website Route-Based Batch Mode 2026-05-17

**Goal:** Update `report-website` so it can convert all documented Markdown outputs into a route-based frontend site.

**Acceptance Criteria:**
- [x] Mirrored contracts support `--all-output-docs` discovery.
- [x] Multi-document output is split by routes with an index route plus one route per Markdown document.
- [x] The skill defines slug stability, collision handling, route metadata, internal Markdown link conversion, and batch verification.
- [x] Generated Skills Showcase data is refreshed because skill metadata changed.
- [x] Validation passes and changes are committed/pushed on `master`.

**Result:** Updated on 2026-05-17. `report-website` now supports single-report, directory, and `--all-output-docs` modes. Multi-document output must be route-based, with a collection index plus one route per Markdown file, stable path-derived slugs, deterministic collision handling, route metadata, converted internal links, and batch parity checks. Recommended next command: `$report-website --all-output-docs /reports`.

## Current Skill Update: report-website Frontend Target Selection 2026-05-17

**Goal:** Make `report-website` decide whether to integrate into an existing frontend site or create a standalone site without asking unnecessarily.

**Acceptance Criteria:**
- [x] Mirrored contracts prefer integrating into an obvious public/docs/showcase frontend app.
- [x] Standalone site creation is limited to explicit, evidence-backed conditions.
- [x] The skill asks only when frontend ownership, route conflicts, audience, or deployment consequences are ambiguous.
- [x] Generated showcase data is refreshed, validation passes, and changes are committed/pushed on `master`.

**Result:** Updated on 2026-05-17. `report-website` now integrates into an obvious existing documentation/public frontend by default, creates a standalone site only under explicit evidence-backed conditions, and asks a narrow question only for multiple plausible targets, route conflicts, unclear audience/access, or non-obvious deployment/navigation consequences. Recommended next command: `$report-website --all-output-docs /reports`.

## Current Skill Creation: update-packages 2026-05-17

**Goal:** Create a mirrored global skill that updates package dependencies to the latest published version that is more than 8 days old, while preferring pnpm over npm.

**Acceptance Criteria:**
- [x] Mirrored `update-packages` skill contracts are created under `global/codex/` and `global/claude/`.
- [x] The skill defines package-manager detection, npm-to-pnpm migration preference, dependency age gating, batch update strategy, and verification expectations.
- [x] Benchmark coverage is registered in `tests/harness/bench-coverage.ts`.
- [x] Required skill and showcase validation passes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Implementation complete on 2026-05-17. Added mirrored `update-packages` skill contracts, registered benchmark coverage with a deterministic package-age fixture, refreshed Skills Showcase data, and installed the new global skill links. Recommended next command: `$update-packages --all`.

## Current Benchmark: feature-interview Fresh Rerun 2026-05-17

**Goal:** Run `$benchmark-test-skill feature-interview` after the route-alignment remediation and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `feature-interview` is known and reports custom coverage.
- [x] `pnpm verify --skill feature-interview` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill feature-interview --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-feature-interview-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark infrastructure-blocked for the Claude lane on 2026-05-17. `feature-interview` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 4.2s plus layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark ran. Claude session `feature-interview-claude-9139ad15` was fully infrastructure-blocked by `agent runner budget exceeded` (3 blocked runs, 0 evaluated, $0.75). Codex session `feature-interview-codex-ab46e0d0` completed three evaluated runs with 3/3 hard assertion pass rate, 100.0% output quality, p50 latency 58.9s, and $0.75 total estimated cost. Report: `benchmark/test-feature-interview-2026-05-17.md`. Generated Skills Showcase data and the benchmark results matrix were refreshed and validated. Recommended next skill: `$benchmark-agent-review feature-interview`.

## Current Benchmark: roadmap Fresh Rerun 2026-05-17

**Goal:** Run `$benchmark-test-skill roadmap` after the evidence-rubric remediation and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `roadmap` is known and reports custom coverage.
- [x] `pnpm verify --skill roadmap` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill roadmap --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-roadmap-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh rerun completed on 2026-05-17. `roadmap` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 3.8s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `roadmap-claude-8c1ee4a6` was fully infrastructure-blocked by `agent runner budget exceeded` (3 blocked runs, 0 evaluated, $0.75). Codex session `roadmap-codex-94365e0f` completed three evaluated runs with 3/3 hard assertion pass rate, 100.0% output quality, p50 latency 46.1s, and $0.75 total estimated cost. Report: `benchmark/test-roadmap-2026-05-17.md`. Recommended next skill: `$benchmark-agent-review roadmap`.

## Current Triage: roadmap Fresh Benchmark Quality Failure 2026-05-17

**Goal:** Verify the latest `$benchmark-test-skill roadmap` quality failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Latest benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] `roadmap` skill contracts and the custom benchmark setup expectations are compared.
- [x] Failure is classified as skill contract gap, benchmark harness defect, generated-data issue, infrastructure block, or agent noncompliance.
- [x] `benchmark/triage-roadmap-2026-05-17-fresh-quality.md` records verdict, root cause, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Verified benchmark harness false negative on 2026-05-17, not a `roadmap` skill behavior failure. Claude session `roadmap-claude-511af1ee` was fully infrastructure-blocked by runner budget. Codex session `roadmap-codex-3f01cb21` passed 3/3 hard assertions, but `run-000.json` failed the critical `evidence-linked` quality criterion because the rubric required exact phrase `CLI status output`. The generated roadmap preserved the CLI/status-output concept with `Add a CLI command that reads benchmark coverage data and prints status output`, but not the exact contiguous phrase. Report: `benchmark/triage-roadmap-2026-05-17-fresh-quality.md`. Recommended next skill: `$targeted-skill-builder roadmap benchmark CLI evidence rubric`.

## Current Targeted Update: roadmap Benchmark CLI Evidence Rubric 2026-05-17

**Goal:** Relax the roadmap benchmark `evidence-linked` rubric so it recognizes CLI/status-output concept preservation without requiring the exact contiguous phrase `CLI status output`.

**Acceptance Criteria:**
- [x] Relevant lessons and the fresh roadmap benchmark quality triage report are reviewed.
- [x] The change is scoped to the benchmark harness, not mirrored `roadmap` skill contracts or a new skill.
- [x] The Tier 1 roadmap setup uses a concept-aware evidence criterion for benchmark coverage and CLI/status output.
- [x] Focused layer1 coverage proves the failing Codex wording passes and generic status wording still fails.
- [x] Focused validation, `roadmap` verify, Codex smoke benchmark, benchmark coverage, skill audits, install check, targeted search, and whitespace checks pass.

**Result:** Completed on 2026-05-17. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the roadmap quality rubric still requires benchmark coverage and CLI/status-output evidence, but no longer requires the exact contiguous phrase `CLI status output`. Added focused layer1 coverage in `tests/layer1/bench-setups.test.ts` for the failing Codex wording from `roadmap-codex-3f01cb21` run 0. Validation passed, including Codex smoke `roadmap-codex-a17e155f` with 1/1 hard assertions, 100.0% output quality, and no critical failures. Recommended next skill: `$benchmark-test-skill roadmap`.

## Current Benchmark: roadmap Post-Evidence-Rubric-Triage 2026-05-17

**Goal:** Run `$benchmark-test-skill roadmap` against the current repository state and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `roadmap` is known and reports its coverage status.
- [x] `pnpm verify --skill roadmap` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill roadmap --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-roadmap-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark quality failure on 2026-05-17. `roadmap` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 8.8s plus layer2 SKIP because no target-specific layer2 tests matched. Claude session `roadmap-claude-511af1ee` was fully infrastructure-blocked by `agent runner budget exceeded` (3 blocked runs, 0 evaluated, $0.75). Codex session `roadmap-codex-3f01cb21` completed three evaluated runs with 3/3 hard assertions, 92.9% output quality, p50 latency 63.1s, and $0.75 total estimated cost, but still recorded one critical `evidence-linked` quality failure. Report: `benchmark/test-roadmap-2026-05-17.md`. Recommended next skill: `$session-triage roadmap benchmark failure`.

## Current Agent Review: feature-interview Post-Route-Fix Benchmark 2026-05-17

**Goal:** Review the latest persisted `feature-interview` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from the fresh `feature-interview` benchmark report.
- [x] Evaluated retained `specs/benchmark-reporting-feature-interview.md` artifacts are inspected, excluding infrastructure-blocked runs.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-feature-interview-2026-05-17.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. Reviewed Claude session `feature-interview-claude-e5b18930` and Codex session `feature-interview-codex-1ff31029`, covering four evaluated artifacts and excluding two Claude infrastructure-blocked runs. Subjective quality was strong overall: Codex artifacts were excellent, while Claude's evaluated artifact was good with a retained-file traceability gap and one unsupported installed-skill-list context claim. Median subjective score was 92.5/100 with range 84-96. Generated benchmark matrix/showcase data was refreshed and validated. Report: `benchmark/review-feature-interview-2026-05-17.md`. Recommended next skill: `$targeted-skill-builder feature-interview benchmark artifact path evidence`.

## Current Targeted Update: feature-interview Benchmark Artifact Path Evidence 2026-05-17

**Goal:** Close the retained-artifact traceability gap from the `feature-interview` agent review by requiring interview logs to cite their own artifact path.

**Acceptance Criteria:**
- [x] The gap is classified as an existing `feature-interview` update, not a new skill.
- [x] Mirrored Claude and Codex `feature-interview` contracts require an explicit artifact path in the interview log.
- [x] The Tier 1 benchmark prompt asks for the artifact path line.
- [x] Focused layer1 benchmark setup coverage proves the contract, prompt, route, and `file-reference` quality behavior.
- [x] Target verify, one-run Codex smoke benchmark, benchmark coverage, generated-data validation, and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. Updated mirrored `feature-interview` contracts to require `Artifact path: the exact path of this interview log.`, tightened the Tier 1 fixture prompt, and added layer1 coverage for artifact-path traceability. A one-run Codex smoke benchmark passed 1/1 hard assertions with 100.0% quality including `file-reference`; the temporary ignored smoke run was removed before regenerating public matrix data so the curated 3-run benchmark remains the public result. Generated benchmark matrix/showcase data now links the `feature-interview` subjective review. Recommended next skill: `$benchmark-test-skill feature-interview`.

## Current Triage: roadmap Benchmark Failure Fresh Rerun 2026-05-17

**Goal:** Investigate the fresh `$benchmark-test-skill roadmap` failure and recommend the smallest verified fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] `roadmap` skill contracts and the custom benchmark setup expectations are compared.
- [x] Failure is classified as skill contract gap, benchmark harness defect, generated-data issue, infrastructure block, or agent noncompliance.
- [x] `benchmark/triage-roadmap-2026-05-17-fresh.md` records verdict, root cause, recommended fix, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Verified benchmark harness setup defect on 2026-05-17, not a `roadmap` skill behavior failure. Claude was fully infrastructure-blocked by runner budget. Codex generated roadmap artifacts that route to `$plan-phase 1`, matching the new-roadmap seeding contract, but `tests/layer4/setups/tier1-workflows.setup.ts` expects `$exec` while using a roadmap-only prompt and only asserting `tasks/roadmap.md`. Report: `benchmark/triage-roadmap-2026-05-17-fresh.md`. Recommended next skill: `$targeted-skill-builder roadmap benchmark route alignment`.

## Phase 41: Remaining Skill Benchmark Result Coverage

**Goal:** Convert the existing benchmark coverage registry into persisted evaluated benchmark results for the remaining tracked skills, without overloading the runner or treating infrastructure blocks as skill failures.

**Current Batch 2026-05-17:** `$benchmark-test-skill analyze-sessions` resolved from the user phrase `analyze sessions`. The skill is listed by `pnpm bench --list-skills` with custom coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`.

**Source:** `docs/benchmark-results-matrix.md`, `tests/harness/bench-coverage.ts`, `benchmark/test-*.md`, and the 2026-05-11 benchmark lessons distinguishing setup coverage from persisted evaluated results.

**Current Baseline:**
- Benchmark coverage registry validates 152 tracked skills.
- Persisted evaluated benchmark results currently cover 14 unique skill names.
- Remaining without evaluated benchmark result rows: 138.
- Remaining runnable, non-blocked skills: 132.
- Coverage-blocked skills requiring fixture or policy work before execution: `delegate`, `deploy`, `install-agentic-skills`, `patch-exec-profile`, `release`, `uat-guide`.
- Incomplete-only result needing retry: `affected` has a zero-evaluated-run persisted report and should not count as benchmarked until rerun successfully.

**Scope:**
- Run `$benchmark-test-skill <skill>` for remaining runnable skills in small batches.
- Prefer batch order by priority tier and dependency value: Tier 1 workflow gaps, incomplete reports, Tier 2 global skills, git-fixture skills with explicit permission gates, then pack-local skills.
- For each skill, preserve the existing `$benchmark-test-skill` contract: list coverage, verify first, benchmark only after verify passes, write `benchmark/test-<skill>-<date>.md`, refresh generated Skills Showcase data when curated benchmark evidence changes, and record results in task docs.
- Do not run permission-gated GitHub disposable-repo fixtures (`commit-and-push-by-feature`, `sync`) until explicit permission and safety boundaries are confirmed.
- Do not attempt blocked skills as live benchmarks until their next-command remediation creates a safe fixture or Codex-runnable contract.

**Acceptance Criteria:**
- [ ] A generated or scripted queue identifies remaining skills from `tests/harness/bench-coverage.ts` minus evaluated rows in `docs/benchmark-results-matrix.md`.
- [ ] Tier 1 remaining skills are benchmarked or explicitly triaged: `feature-interview`, `roadmap`, `ship-end`, `targeted-skill-builder`.
- [ ] `affected` is rerun because its only persisted report is blocked/incomplete.
- [ ] Each completed benchmark has a curated report under `benchmark/test-<skill>-<YYYY-MM-DD>.md` and raw paths under `tests/benchmarks/runs/`.
- [ ] Any failed benchmark is triaged before continuing broad execution if it indicates harness drift, shared setup drift, or skill-contract ambiguity.
- [ ] `docs/benchmark-results-matrix.md` and Skills Showcase generated data are refreshed after each committed batch.
- [ ] `pnpm --dir tests bench:coverage`, benchmark-results matrix validation, generated showcase validation, and `git diff --check` pass before shipping each batch.
- [ ] Coverage-blocked skills have documented next remediation commands, not attempted live-run failures.

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** benchmark cost, runner capacity, GitHub fixture permission, generated-data freshness

**Subagent lanes:** none

### Batch Plan
- [ ] Batch 41.1: Create/verify the remaining-results queue and run the first small batch: `feature-interview`, `ship-end`, `targeted-skill-builder`, and `affected`.
- [ ] Batch 41.2: Resolve or triage `roadmap`, which currently has evaluated Codex failures and Claude infrastructure blocks from `benchmark/test-roadmap-2026-05-17.md`.
- [ ] Batch 41.3: Run Tier 2 global skills in groups of 5-10, pausing after any shared harness failure pattern.
- [ ] Batch 41.4: Run git-fixture skills `commit-and-push-by-feature` and `sync` only after explicit permission for disposable GitHub fixture operations.
- [ ] Batch 41.5: Run pack-local skills by pack family, starting with packs that feed public showcase/workflow proof.
- [ ] Batch 41.6: Address blocked skills through their remediation routes, then benchmark only after safe fixtures exist.

## Phase 42: Workflow Persistent Transcript Refinement

**Goal:** Refine the `/workflows` hybrid replay pilot so each selected workflow behaves like one persistent ChatGPT/Claude-style terminal session instead of a card carousel.

**Source:** `specs/workflow-persistent-transcript-feature-interview.md`, `specs/ui-skills-showcase-website.md`, Phase 40 implementation evidence, and the user-confirmed design decisions from 2026-05-18.

**Scope:**
- Keep `/workflows` as the pilot surface; do not expand the pattern to homepage, catalog, or inspect routes in this phase.
- Render a selected workflow as a persistent transcript where each skill invocation is a new turn.
- Keep step controls at the top and treat them as jump controls into existing transcript turns.
- Reveal turns in the confirmed order: user command appears immediately, agent response fake-types in a ChatGPT/Claude style, then terminal/proof/artifact/receipt blocks reveal.
- Keep completed turns fully expanded while auto-scrolling the active turn into view during playback.
- Reset the transcript when changing workflows, but do not delete later turns when clicking an earlier step inside the current workflow.
- Preserve benchmark receipts and curated no-receipt states as primary proof blocks inside transcript turns.
- Preserve reduced-motion behavior by showing complete turn content without fake typing or animated scroll.

**Acceptance Criteria:**
- [x] `/workflows` no longer remounts the active replay as a blinking step card when advancing through steps.
- [x] Playback reveals each new workflow turn with the confirmed ChatGPT/Claude-style cadence.
- [x] Completed turns stay fully expanded, and the active turn is followed by viewport scroll during playback.
- [x] Step controls jump to existing turns without destructive rewind or hiding later turns.
- [x] Workflow switching starts a fresh transcript session.
- [x] Benchmark receipt rendering remains available for benchmarked steps, and non-benchmarked steps show clear curated/no-receipt states.
- [x] Reduced-motion users receive complete content without fake typing or animated scroll.
- [x] Desktop and mobile visual checks confirm no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.
- [x] Existing Skills Showcase tests, typecheck/build, generated-data validation when needed, and whitespace checks pass.

**Parallelization:** serial

**Coordination Notes:** The likely edits concentrate in `TuiWorkflow.tsx`, `workflow.css`, and the workflow player/typewriter helpers, with shared layout and timing behavior. Keep implementation serial to avoid conflicting state/rendering changes; use review-only validation after the build if needed.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, performance, UX

**Subagent lanes:** none

### Implementation
- Step 42.1: Replace the single active replay card with a persistent transcript model for the selected workflow.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
  - Notes: Render revealed workflow steps as transcript turns; keep completed turns fully expanded; remove the remounting active-step card key that causes the blinking carousel feel.
- Step 42.2: Update workflow player state so step controls jump within an existing transcript session while workflow changes reset the session.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
  - Notes: Track revealed transcript depth separately from active step focus; keep later revealed turns available when jumping to an earlier step; reset revealed depth when selecting another workflow or restarting.
- Step 42.3: Coordinate fake typing, proof-block reveal, and reduced-motion behavior for active turns.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`, modify `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
  - Notes: Show user command immediately; fake-type the agent response; reveal terminal, artifact, and receipt blocks after the agent response; bypass typing and animated scroll for reduced-motion users.
- Step 42.4: Add transcript auto-scroll and stable benchmark/no-receipt proof rendering.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Notes: Scroll the active transcript turn into view during playback; keep benchmark receipt metadata available for benchmarked steps; preserve curated/no-receipt states for non-benchmarked steps.
- Step 42.5: Restyle `/workflows` for persistent transcript layout across desktop and mobile.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Notes: Keep workflow selectors and step controls visible above the transcript; prevent horizontal overflow, clipped proof blocks, and control/transcript overlap at mobile and desktop widths.

### Green
- Step 42.6: Write regression tests covering the persistent transcript behavior.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/workflows.test.tsx`
  - Test cases: completed turns remain expanded after advancing; clicking an earlier step jumps to an existing turn without hiding later turns; workflow switching resets the transcript; benchmark receipts and curated no-receipt states render inside turns; reduced-motion shows complete content without typing delay.
- [x] Step 42.7: Run validation and perform only concrete cleanup found by validation.
  - Classification: automated
  - Files: no planned source edits beyond fixes required by failed validation
  - Commands: `pnpm --dir apps/skills-showcase test`, `pnpm --dir apps/skills-showcase build`, `scripts/validate-skills-showcase-data.sh` if generated data changes, `git diff --check`
  - Visual checks: verify `/workflows` at desktop and mobile widths for no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.

### Milestone: Phase 42 Workflow Persistent Transcript Refinement
**Acceptance Criteria:**
- [x] `/workflows` no longer remounts the active replay as a blinking step card when advancing through steps.
- [x] Playback reveals each new workflow turn with the confirmed ChatGPT/Claude-style cadence.
- [x] Completed turns stay fully expanded, and the active turn is followed by viewport scroll during playback.
- [x] Step controls jump to existing turns without destructive rewind or hiding later turns.
- [x] Workflow switching starts a fresh transcript session.
- [x] Benchmark receipt rendering remains available for benchmarked steps, and non-benchmarked steps show clear curated/no-receipt states.
- [x] Reduced-motion users receive complete content without fake typing or animated scroll.
- [x] Desktop and mobile visual checks confirm no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.
- [x] Existing Skills Showcase tests, typecheck/build, generated-data validation when needed, and whitespace checks pass.
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion**
- Deviations from plan: Generated proof/matrix assets were stale and were refreshed during validation. Safari visual checks were used because no project Playwright/browser automation setup is configured, and Safari JavaScript-from-Apple-Events is disabled for direct DOM width assertions.
- Tech debt / follow-ups: Phase 41 benchmark result coverage remains deferred and should resume with Batch 41.1.
- Ready for next phase: yes

## Current Benchmark: roadmap Fresh Rerun 2026-05-17

**Goal:** Rerun `$benchmark-test-skill roadmap` after the benchmark-results matrix assertion fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `roadmap` is known and reports its coverage status.
- [x] `pnpm verify --skill roadmap` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill roadmap --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-roadmap-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark failure on 2026-05-17. `roadmap` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 3.6s plus layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark ran. Claude session `roadmap-claude-ceadee35` was fully infrastructure-blocked by `agent runner budget exceeded` (3 blocked runs, 0 evaluated, $0.75). Codex session `roadmap-codex-43f41fa9` completed three evaluated runs with 0/3 hard assertion pass rate, 78.6% output quality, p50 latency 44.3s, and $0.75 total estimated cost; every run failed `Output recommends $exec`. Report: `benchmark/test-roadmap-2026-05-17.md`. Recommended next skill: `$session-triage roadmap benchmark failure`.

## Current Agent Review: ship Fresh Benchmark 2026-05-16

**Goal:** Review the latest persisted `ship` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from the fresh `ship` benchmark report.
- [x] Retained generated `ship-manifest.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-ship-2026-05-16.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. Reviewed latest `ship` Claude session `920245e6` and Codex session `898663d6`, covering six retained `ship-manifest.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: both agents passed 3/3 hard assertions with 100.0% output-quality scores. Subjective verdict was excellent overall with median score 91.5 and range 90-96. No material remediation remains; generated Skills Showcase data was refreshed and validated. Report: `benchmark/review-ship-2026-05-16.md`. Recommended next command: `$ship`.

## Current Benchmark: roadmap 2026-05-17

**Goal:** Run `$benchmark-test-skill roadmap` against the current repository harness and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `roadmap` is known and reports its coverage status.
- [x] `pnpm verify --skill roadmap` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill roadmap --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-roadmap-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Verification-blocked on 2026-05-17. `roadmap` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, but `pnpm verify --skill roadmap` failed at layer1 in 3.9s. The failure is `layer1/benchmark-results-matrix.test.ts` expecting the stale `ship-codex-a2685d9f` raw report row while the current generated matrix points at `ship-codex-898663d6`. The benchmark step was not run. Report: `benchmark/test-roadmap-2026-05-17.md`. Recommended next skill: `$session-triage roadmap benchmark failure`.

## Current Triage: roadmap Benchmark Failure 2026-05-17

**Goal:** Verify why `$benchmark-test-skill roadmap` failed and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Failed benchmark report and verify output are inspected.
- [x] Failing layer1 test, generated matrix, and matrix generator are compared.
- [x] Failure is classified as a `roadmap` skill defect, benchmark harness defect, generated-data defect, or agent noncompliance.
- [x] `benchmark/triage-roadmap-2026-05-17.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. The verify failure is real, but the responsible gap is the benchmark harness regression test, not the `roadmap` skill. `tests/layer1/benchmark-results-matrix.test.ts` hard-codes the older `ship-codex-a2685d9f` latest-run path while the generated matrix correctly points at the fresher reviewed `ship-codex-898663d6` run. Report: `benchmark/triage-roadmap-2026-05-17.md`. Recommended next skill: `$targeted-skill-builder benchmark-results-matrix stale latest-run assertion`.

## Current Targeted Update: Benchmark Results Matrix Latest-Run Assertion 2026-05-17

**Goal:** Fix the benchmark-results matrix layer1 test so fresh benchmark runs do not stale the assertion for generated latest-run report paths.

**Acceptance Criteria:**
- [x] Relevant lessons and `roadmap` benchmark triage evidence are reviewed.
- [x] The change is scoped to existing harness test coverage, not a new skill or `roadmap` contract update.
- [x] `tests/layer1/benchmark-results-matrix.test.ts` matches the durable `ship` Codex row shape without pinning a superseded session id.
- [x] Focused layer1 validation and `roadmap` verify pass.
- [x] Generated-data validation and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. Updated `tests/layer1/benchmark-results-matrix.test.ts` so the `ship` Codex row assertion accepts any `ship-codex-*` latest report while preserving the durable metrics, subjective review path, and graded status. Refreshed generated Skills Showcase data after the recent benchmark evidence changes. Validation passed with focused layer1, `roadmap` verify, install/skill audits, benchmark coverage, generated-data validation, and whitespace checks. Recommended next skill: `$benchmark-test-skill roadmap`.

## Current Benchmark: ship Fresh Run 2026-05-16

**Goal:** Run `$benchmark-test-skill ship` against the current repository harness and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-16.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. `ship` remained known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 PASS in 4.4s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `920245e6` passed 3/3 hard assertions with 100.0% output quality, and Codex session `898663d6` passed 3/3 hard assertions with 100.0% output quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$benchmark-agent-review ship`.

## Current Targeted Update: ship Benchmark Goal Field Extraction 2026-05-16

**Goal:** Fix the `ship` benchmark quality rubric so `ship-goal-specificity` accepts valid field-style ship manifest `User goal` entries while still rejecting meta manifest-writing goals.

**Acceptance Criteria:**
- [x] Use the fresh triage report and relevant lessons as scoped evidence.
- [x] Confirm this is an existing benchmark-rubric update, not a mirrored `ship` skill contract change or new skill.
- [x] Broaden `shipGoalSpecificityCriterion` to extract heading-style and field-style `User goal` content.
- [x] Add focused layer1 regression coverage for the failing Claude bullet manifest shape and the existing meta-goal rejection.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

**Result:** Completed on 2026-05-16. Updated the existing `ship` benchmark setup rather than mirrored skill contracts. `ship-goal-specificity` now extracts both heading-style and field-style `User goal` content, and focused layer1 coverage accepts the failing Claude bullet manifest shape while preserving the meta manifest-goal rejection. Verification also exposed a stale benchmark matrix assertion and an over-broad `production deploy` false positive for skipped deploy wording; both were fixed with focused coverage. Validation passed with focused layer1, install, skill audits, benchmark coverage, `ship` verify, Claude smoke `ship-claude-5517074a` with 1/1 hard assertions and 100.0% quality, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill ship`.

## Current Triage: ship Benchmark Failure 2026-05-16

**Goal:** Verify the fresh `ship` benchmark quality failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude run evidence are inspected.
- [x] Mirrored `ship` skill contracts are compared against benchmark setup and quality expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] `benchmark/triage-ship-2026-05-16.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. The fresh `ship` quality failure is verified, but the responsible gap is the benchmark harness rather than mirrored `ship` contracts. Claude run `ship-claude-d6121a8f` run 2 emitted a valid bullet-style `User goal` manifest field, while `ship-goal-specificity` only extracts heading-style sections and therefore reported `missing User goal section text`. Report: `benchmark/triage-ship-2026-05-16.md`. Recommended next skill: `$targeted-skill-builder ship benchmark goal field extraction`.

## Current Benchmark: ship Post-Rubric Fix 2026-05-16

**Goal:** Run `$benchmark-test-skill ship` against the current repository harness after the benchmark rubric fixes and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-16.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. `ship` remained known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 PASS in 3.8s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `d6121a8f` passed 3/3 hard assertions with 94.7% output quality and 1 critical `ship-goal-specificity` failure; Codex session `a2685d9f` passed 3/3 hard assertions with 100.0% output quality. Report validation passed, and generated Skills Showcase data was refreshed. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$session-triage ship benchmark failure`.

## Current UI Pass: Workflows Mobile Playful Lab Responsiveness 2026-05-15

**Goal:** Make the `/workflows` Playful Lab interface work cleanly on mobile while preserving the newer lab-themed surface that will replace the older workflow presentation.

**Acceptance Criteria:**
- [x] Validate whether `/workflows` still renders a legacy workflow block above the Playful Lab demo.
- [x] Keep the fix scoped to the workflows route and Playful Lab/TUI styling unless evidence shows shared CSS is the root cause.
- [x] Mobile widths avoid horizontal page overflow from chips, commands, benchmark/demo pre blocks, controls, or notebook panels.
- [x] The lab layout stacks predictably below tablet widths and remains usable at phone widths.
- [x] Focused tests/build checks pass, and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. `/workflows` already renders only the `TuiWorkflow` Playful Lab component; the legacy DOM-driven workflow selector remains only for the home-page preview support path. The mobile pass tightened the Playful Lab/TUI styles for constrained widths, horizontal chip navigation, stacked controls, long commands, benchmark/demo blocks, and notebook width containment. Focused Vitest smoke/workflow coverage, typecheck, production build, `git diff --check`, and Safari mobile-width visual verification passed.

## Current Agent Review: analyze-sessions Quality-Rubric Matching Benchmark 2026-05-15

**Goal:** Review the latest persisted `analyze-sessions` Claude and Codex benchmark outputs for subjective operator quality after the quality-rubric matching rerun.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-analyze-sessions-2026-05-15.md`.
- [x] Retained generated `session-analysis.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-analyze-sessions-2026-05-15.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Reviewed fresh evaluated runs `analyze-sessions-claude-fa3b696a` and `analyze-sessions-codex-e68803b1`, covering all 6 retained `session-analysis.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: both agents passed 3/3 hard assertions with 92.3% quality. Subjective verdict was excellent overall with median score 91.5 and range 90-94. No material generated-output remediation remains; exact runner-native final routes are now clean. Skills Showcase data was regenerated. Report: `benchmark/review-analyze-sessions-2026-05-15.md`. Recommended next command: `$ship`.

## Current Benchmark: analyze-sessions Quality-Rubric Matching Rerun 2026-05-15

**Goal:** Run `$benchmark-test-skill analyze-sessions` against the current repository harness after the quality-rubric matching fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 4.4s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `fa3b696a` passed 3/3 hard assertions with 92.3% output quality, and Codex session `e68803b1` passed 3/3 hard assertions with 92.3% output quality. Report validation passed, and generated Skills Showcase data was refreshed. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$benchmark-agent-review analyze-sessions`.

## Current Targeted Update: analyze-sessions Benchmark Final-Route Exactness

**Goal:** Tighten the `analyze-sessions` benchmark setup so runner-native final commands are unambiguous and exact, preventing suffixes like `for Codex` from passing.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `analyze-sessions` skill contracts.
- [x] The benchmark prompt tells runners the literal command must not include runner-label suffixes.
- [x] Hard assertions fail suffixed final commands such as `$targeted-skill-builder run post-doc-edit validation and lessons capture gate for Codex`.
- [x] The deterministic quality route criterion fails the same suffixed final command.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. Updated the benchmark harness rather than mirrored `analyze-sessions` skill contracts. Added exact final next-route matching in routing and quality helpers, opted the `analyze-sessions` setup into exact matching, and reworded its prompt so runner labels are explanatory instead of part of the literal command. Focused layer1 proves suffixed Codex commands fail both hard assertions and the quality route criterion. Validation passed with focused layer1, install, skill audits, benchmark coverage, `analyze-sessions` verify, and Codex smoke `analyze-sessions-codex-a042d8d1` with the exact final command assertion passing. Recommended next command: `$benchmark-test-skill analyze-sessions`.

## Current Agent Review: analyze-sessions Fresh Benchmark 2026-05-15

**Goal:** Review the latest persisted `analyze-sessions` Claude and Codex benchmark outputs for subjective operator quality after the fresh deterministic rerun.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-analyze-sessions-2026-05-15.md`.
- [x] Retained generated `session-analysis.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-analyze-sessions-2026-05-15.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Reviewed fresh evaluated runs `analyze-sessions-claude-b5357730` and `analyze-sessions-codex-8f7e860a`, covering all 6 retained `session-analysis.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: both agents passed 3/3 hard assertions with 92.3% quality. Subjective verdict was good to excellent overall with median score 90.0 and range 88-94. The remaining weakness is final-route exactness: all three Codex artifacts append `for Codex` to the intended command. Skills Showcase data was regenerated and validated. Report: `benchmark/review-analyze-sessions-2026-05-15.md`. Recommended next command: `$targeted-skill-builder analyze-sessions benchmark final-route exactness`.

## Current Benchmark: analyze-sessions Fresh Rerun 2026-05-15

**Goal:** Run `$benchmark-test-skill analyze-sessions` against the current repository harness and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 4.0s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `b5357730` passed 3/3 hard assertions with 92.3% output quality, and Codex session `8f7e860a` passed 3/3 hard assertions with 92.3% output quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$benchmark-agent-review analyze-sessions`.

## Current Targeted Update: analyze-sessions Remediation-Ready Handoff

**Goal:** Tighten `analyze-sessions` so broad verified workflow gaps route to a remediation-ready `targeted-skill-builder` handoff instead of a generic or dual-mode route.

**Acceptance Criteria:**
- [x] The fix is scoped to mirrored `analyze-sessions` contracts and benchmark coverage, not a new meta-skill.
- [x] Broad verified workflow gaps require one runner-native final `targeted-skill-builder` command with a concrete gap phrase.
- [x] Reports distinguish explicit source evidence from inferred source labels and avoid unsupported runner ownership.
- [x] The handoff names likely owner surface and validation expectation when recommending a skill update.
- [x] Layer1 regression coverage protects the contract and benchmark rubric behavior.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. Updated mirrored `analyze-sessions` contracts to version 1.4.0 with remediation-ready targeted-skill-builder handoff guidance: one runner-native final command, concrete gap phrase, likely owner surface, validation expectation, no dual final route, and explicit-vs-inferred attribution. Updated the `analyze-sessions` benchmark fixture and quality rubric to require runner-specific `run post-doc-edit validation and lessons capture gate` routes plus owner/validation/attribution evidence. Added layer1 coverage for contract language, generic-route rejection, and the new quality criterion. Validation passed with install, skill audits, benchmark coverage, focused layer1, `analyze-sessions` verify, both-agent one-run smoke (`analyze-sessions-claude-b957fee9`, `analyze-sessions-codex-59d4510e`, both 1/1 hard assertions and 92.3% quality), showcase generation/validation, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill analyze-sessions`.

## Current Agent Review: analyze-sessions Benchmark 2026-05-15

**Goal:** Review the latest persisted `analyze-sessions` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/analyze-sessions-*`.
- [x] Retained generated `session-analysis.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-analyze-sessions-2026-05-15.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Reviewed `analyze-sessions-claude-bc867ac4` and `analyze-sessions-codex-f4218901`, covering 6 retained `session-analysis.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: Claude passed 3/3 hard assertions with 89.4% quality, and Codex passed 3/3 hard assertions with 90.9% quality. Subjective verdict was good overall with median score 87.5 and range 84-91. The artifacts identify the recurring validation and lessons-capture misses, but several final handoffs are too broad or dual-mode instead of giving one remediation-ready targeted-skill-builder command. Skills Showcase data was regenerated and validated. Report: `benchmark/review-analyze-sessions-2026-05-15.md`. Recommended next command: `$targeted-skill-builder analyze-sessions remediation-ready targeted-skill-builder handoff`.

## Current Benchmark: analyze-sessions Post-Fixture Routing 2026-05-15

**Goal:** Rerun `$benchmark-test-skill analyze-sessions` after the benchmark fixture-routing fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 4.0s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `bc867ac4` passed 3/3 hard assertions with 89.4% output quality, and Codex session `f4218901` passed 3/3 hard assertions with 90.9% output quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$benchmark-agent-review analyze-sessions`.

## Current Targeted Update: analyze-sessions Benchmark Fixture Routing

**Goal:** Fix `analyze-sessions` benchmark coverage so fixture scope, route labels, and runner-specific next routes match the mirrored skill contracts.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage and route parsing, not mirrored `analyze-sessions` skill contracts.
- [x] Bold Markdown next-route labels accepted by the default shipping contract pass route detection.
- [x] The `analyze-sessions` fixture provides broad repeated-history evidence when expecting `targeted-skill-builder`.
- [x] Claude and Codex expected routes use their native conventions: `/targeted-skill-builder` and `$targeted-skill-builder`.
- [x] Layer1 regression coverage protects the route parser and `analyze-sessions` fixture behavior.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. Updated the benchmark harness rather than mirrored `analyze-sessions` contracts. Route detection now accepts bold Markdown next-route labels, and the `analyze-sessions` fixture now uses repeated dated session logs with runner-specific `/targeted-skill-builder` and `$targeted-skill-builder` expectations plus a standard benchmark budget. Added focused layer1 coverage. Validation passed with focused layer1, benchmark coverage, `analyze-sessions` verify, both-agent one-run smoke (`analyze-sessions-claude-59469ff4`, `analyze-sessions-codex-73090527`, both 1/1 hard assertions and no blocked runs), targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill analyze-sessions`.

## Current Triage: analyze-sessions Benchmark Failure 2026-05-15

**Goal:** Verify the fresh `analyze-sessions` deterministic benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `analyze-sessions` contracts are compared against benchmark setup and quality expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] `benchmark/triage-analyze-sessions-2026-05-15.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. The fresh benchmark failure is verified, but the responsible gap is benchmark harness coverage rather than mirrored `analyze-sessions` contracts. The fixture is a single concrete incident note while the setup hard-requires `$targeted-skill-builder`; the skill contracts say concrete incidents should route to `session-triage`, and broad verified workflow gaps can route to `targeted-skill-builder`. The setup also needs runner-specific routes and route-helper support for bold next-route labels permitted by the shipping contract. Codex run #1 was a no-artifact agent/runner no-op, but adjacent Codex runs passed. Report: `benchmark/triage-analyze-sessions-2026-05-15.md`. Recommended next skill: `$targeted-skill-builder analyze-sessions benchmark fixture routing`.

## Current Benchmark: analyze-sessions 2026-05-15

**Goal:** Run `$benchmark-test-skill analyze-sessions` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 3.8s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs, but deterministic benchmark results failed: Claude session `6b8dbd1e` passed 0/3 hard assertion runs with 71.2% quality, and Codex session `afaf2f22` passed 2/3 hard assertion runs with 80.3% quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$session-triage analyze-sessions benchmark failure`.

## Current Targeted Update: Codex Interview Question Cadence

**Goal:** Update Codex interview-style skills so they ask one primary question per turn by default, while preserving Claude's grouped AskUserQuestion cadence for Claude skills.

**Acceptance Criteria:**
- [x] Full available Claude/Codex prompt history and rich Codex sessions are scanned for interview-question cadence evidence.
- [x] Codex skills with explicit grouped-question or Claude-only AskUserQuestion language are updated to one-primary-question-per-turn guidance.
- [x] Plan-mode `request_user_input` guidance remains allowed only for one material decision with 2-3 concrete options, not for batching unrelated questions.
- [x] Regression coverage protects the Codex cadence language.
- [x] Verification passes, results are recorded in `tasks/todo.md`, and changes are committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Full history scan found 14,370 compact Claude/Codex messages from 2025-12-10 through 2026-05-15, with 498 interview-related messages and recent direct Codex corrections asking to discuss `$spec-interview` questions one by one. Updated targeted Codex interview-style contracts to use one primary decision question per turn and preserve `request_user_input` only for one Plan-mode decision with concrete options. Added layer1 regression coverage and refreshed Skills Showcase generated data. Validation passed through targeted cadence tests, skill integrity checks, install, routing/frontmatter tests, generated data validation, full layer1, targeted `rg`, and `git diff --check`. Shipped on `master`.

## Current Targeted Update: Skills Showcase Icon Refresh

**Goal:** Replace stale Skills Showcase app icon surfaces with `apps/skills-showcase/new-app-icon.png`.

**Acceptance Criteria:**
- [x] The app framework, source icon dimensions, and existing icon surfaces are audited before replacement.
- [x] Next App Router icon surfaces use the new source asset.
- [x] Conventional public install/touch icon surfaces are present for static and app-install references.
- [x] A conventional `favicon.ico` route is generated from the source asset.
- [x] Verification confirms asset formats, production build icon route output, and generated HTML references.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Replaced stale Skills Showcase app icons with `apps/skills-showcase/new-app-icon.png`, added conventional public install/touch icon assets, generated a valid RGBA-backed `app/favicon.ico`, and wired explicit metadata plus `public/manifest.webmanifest`. Verification passed with format/dimension checks, app typecheck, production build, built metadata route artifact checks, generated HTML search, manifest JSON parse, and `git diff --check`. Shipped on `master` in commit `e4644e0`.

## Current Analysis: Red/Green Testing Workflow

**Goal:** Use local Claude/Codex session evidence to evaluate whether the repository's red/green testing workflow should be kept, reformed, or replaced.

**Acceptance Criteria:**
- [x] Full available Claude/Codex prompt history and rich Codex sessions are scanned for repository-scoped red/green, benchmark, verify, false-positive, and missed-test signals.
- [x] The report separates missed issues, false positives, legitimate detections, and infrastructure/tooling blockers instead of treating all failures as equal.
- [x] Real examples from history are cited with counts and clear limitations.
- [x] The recommendation explicitly chooses keep, reform, or try something else and explains why.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Report drafted at `tasks/red-green-testing-workflow-report.md`. The scan found 122 repository-relevant testing prompts and 26 red/green evidence reports. Incident-level findings were 8 legitimate detections, 7 false-positive or harness-noise incidents, 5 missed issues/coverage gaps, and 4 infrastructure/tooling blockers. Recommendation: keep red/green as the backbone, but reform benchmark oracle classification, prompt/assertion/rubric alignment, artifact retention, generated-surface freshness checks, and subjective-review-to-coverage-debt routing. Verification passed with cited-file existence checks, report reference checks, and `git diff --check`.

## Current Targeted Update: content-programming Full-Contract Benchmark Coverage

**Goal:** Upgrade `content-programming` benchmark coverage from a generic calendar smoke path to full programming-strategy contract coverage.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `content-programming` skill contracts.
- [x] The benchmark prompt asks for pillars, formats, cadence constraints, portfolio balance, measurement, cleanup/refactor, and next series candidates.
- [x] Hard assertions reject calendar-only output for the full-contract fixture.
- [x] Deterministic quality scoring distinguishes full strategy output from calendar-only output.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so the `content-programming` pack benchmark uses a full programming-strategy fixture with pillars, formats, portfolio balance, measurement, cleanup/refactor, and next series candidates while preserving runner-specific `/series-spec` and `$series-spec` routing. Added layer1 coverage in `tests/layer1/bench-setups.test.ts` proving full-contract prompt requirements, hard assertion rejection of calendar-only output, and quality scoring differences. Validation passed with focused layer1 tests, install, skill integrity/routing checks, benchmark coverage, `content-programming` verify, and both-agent one-run smoke (`content-programming-claude-089cd18e` 1/1 hard assertions and 96.2% quality; `content-programming-codex-1be45ef5` 1/1 hard assertions and 100.0% quality). Recommended next command: `$benchmark-test-skill content-programming`.

## Current Agent Review: content-programming Benchmark 2026-05-14

**Goal:** Review the latest persisted `content-programming` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/content-programming-*`.
- [x] Retained generated `pack-benchmark-output.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-content-programming-2026-05-14.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changed.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Reviewed `content-programming-claude-9f0c62c8` and `content-programming-codex-ff03c35c`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic context was clean: Claude passed 3/3 hard assertions with 96.7% quality, and Codex passed 3/3 hard assertions with 97.5% quality. Full `pack-benchmark-output.md` artifacts were retained for both runners. Subjective verdict was good overall with median score 87.5 and range 84-90. The outputs are useful smoke-test artifacts, but the benchmark prompt only exercises a calendar path and does not prove the full `content-programming` contract for pillars, formats, portfolio balance, measurement, cleanup/refactor, and next series candidates. Skills Showcase data was regenerated and validated. Report: `benchmark/review-content-programming-2026-05-14.md`. Recommended next command: `$targeted-skill-builder content-programming full-contract benchmark coverage`.

## Current Benchmark: content-programming Post-Rubric Fix 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence after the fixture-evidence rubric fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `content-programming` is known and reports its coverage status.
- [x] `pnpm verify --skill content-programming` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-content-programming-2026-05-14.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated because curated benchmark evidence changed.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. `content-programming` is known with `coverage=custom` using `tests/layer4/setups/packs/pack-workflows.setup.ts`. Verify passed with layer1 PASS in 3.7s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs. Claude session `9f0c62c8` passed hard assertions at 3/3 with output quality 96.7%, p50 latency 25.7s, total cost $0.75, and 0 critical failures. Codex session `ff03c35c` passed hard assertions at 3/3 with output quality 97.5%, p50 latency 49.0s, total cost $0.75, and 0 critical failures. Report validation passed for required benchmark fields. Skills Showcase generated data was refreshed and validated, including the benchmark results matrix. Report: `benchmark/test-content-programming-2026-05-14.md`. Recommended next skill: `$benchmark-agent-review content-programming`.

## Current Targeted Update: content-programming Benchmark Next-Route Coverage

**Goal:** Fix the `content-programming` pack benchmark setup so it tests the actual accepted handoff labels and runner-specific `series-spec` successor instead of generic `$exec` routing.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `content-programming` skill contracts.
- [x] Pack workflow prompts require literal accepted next-route labels.
- [x] `content-programming` hard assertions and quality scoring accept Claude `/series-spec` and Codex `$series-spec`.
- [x] Layer1 regression coverage protects the prompt, hard assertion, and quality behavior.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Updated the pack benchmark harness instead of mirrored `content-programming` contracts. Pack prompts now require accepted handoff labels, route quality no longer defaults unknown pack skills to `$exec`, and `content-programming` has runner-specific `series-spec` expectations for Claude and Codex. Added layer1 regression coverage for prompt wording, route assertions, and quality scoring. Validation passed with install/skill integrity/routing checks, benchmark coverage, focused layer1, `content-programming` verify, both-agent one-run benchmark smoke, targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill content-programming`.

## Current Benchmark: content-programming Fresh Rerun 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence after the benchmark next-route coverage fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `content-programming` is known and reports its coverage status.
- [x] `pnpm verify --skill content-programming` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-content-programming-2026-05-14.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. `content-programming` is known with `coverage=custom` using `tests/layer4/setups/packs/pack-workflows.setup.ts`. Verify passed with layer1 PASS in 3.9s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs. Claude session `d041146e` passed hard assertions at 3/3 with output quality 89.2%, p50 latency 29.0s, total cost $0.75, and 1 output-quality critical failure. Codex session `f56f9728` passed hard assertions at 3/3 with output quality 98.3%, p50 latency 68.0s, and total cost $0.75. Report validation passed for required benchmark fields. Report: `benchmark/test-content-programming-2026-05-14.md`. Recommended next skill: `$session-triage content-programming benchmark failure`.

## Current Triage: content-programming Benchmark Quality Failure 2026-05-14

**Goal:** Verify the fresh `content-programming` benchmark quality critical failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `content-programming` contracts are compared against benchmark setup and quality expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] `benchmark/triage-content-programming-2026-05-14-quality.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. The fresh quality failure is verified. Both agents passed 3/3 hard assertions and no runs were infrastructure-blocked, but Claude run 002 recorded a critical `pack-fixture-evidence` quality failure. The retained artifact cited `fixtures/local-evidence.md`, `pack-input.md`, the practical build notes audience input, weekly cadence input, and local-only fixture constraints; it failed because the rubric required the exact token `local-fixture`. Responsible gap is benchmark quality-rubric brittleness in `tests/layer4/setups/packs/pack-workflows.setup.ts`, not mirrored `content-programming` contract drift or runner infrastructure. Report: `benchmark/triage-content-programming-2026-05-14-quality.md`. Recommended next skill: `$targeted-skill-builder content-programming benchmark fixture-evidence rubric`.

## Current Targeted Update: content-programming Benchmark Fixture-Evidence Rubric

**Goal:** Fix the pack benchmark quality rubric so valid concrete fixture citations pass without requiring the exact token `local-fixture`.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `content-programming` skill contracts.
- [x] `pack-fixture-evidence` requires concrete fixture paths and input facts.
- [x] Layer1 regression coverage proves concrete fixture references pass and generic evidence prose still fails.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so pack prompts ask for concrete local fixture evidence from `pack-input.md` or `fixtures/local-evidence.md`, and the critical `pack-fixture-evidence` quality criterion requires those fixture paths plus the first two fixture input facts instead of the exact token `local-fixture`. Added layer1 coverage in `tests/layer1/bench-setups.test.ts` proving the `content-programming` concrete fixture citation path passes and generic evidence prose still fails. Validation passed with focused layer1 tests, install, skill integrity/routing checks, benchmark coverage, `content-programming` verify, both-agent one-run smoke (`content-programming-claude-8abf7ae4`, `content-programming-codex-b1c858d6`, both 1/1 hard assertions and 0 quality critical failures), targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill content-programming`.

## Current Targeted Update: Creator Pack Artifact Handoff And Routing Ergonomics

**Goal:** Tighten creator-media pack skills so approved research writes include a concrete artifact handoff and next routing follows the user’s current content-production intent instead of only the default workflow sequence.

**Acceptance Criteria:**
- [x] Existing creator-media skills are updated rather than adding a duplicate meta-skill.
- [x] Approved synthesized writes require a created/updated file list, verification/readback note, git status or dirty-artifact handoff, and explicit next action.
- [x] Next-skill routing gives priority to immediate user intent such as strategy refresh, recording prep, upload prep, performance review, or owner-analytics/manual blocker work.
- [x] Deterministic layer1 coverage protects the creator-media contract language.
- [x] Generated showcase data is refreshed, validation passes, and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Added `Approved Artifact Handoff` and `Intent-Aware Routing` contracts across mirrored creator-foundation, youtube-ops, and remotion creator-media skills. Updated creator pack docs and added `tests/layer1/creator-media-handoff-routing.test.ts` to protect the handoff/routing behavior. Refreshed generated Skills Showcase data; no curated website copy changed beyond generated fingerprints/proof data. Validation passed with install, skill integrity, routing, benchmark coverage, focused layer1 tests, showcase generation/validation, targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill content-programming`.

## Current Benchmark: content-programming 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `content-programming` is known and reports its coverage status.
- [x] `pnpm verify --skill content-programming` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-content-programming-2026-05-14.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Verify passed with layer1 PASS in 4.5s and layer2 SKIP because no target-specific layer2 tests matched. The benchmark completed with no infrastructure-blocked runs. Claude session `20ea1edd` failed hard assertions at 0/3 because every run missed `Output includes next command handoff`; output quality was 85.8%, p50 latency 29.9s, and total cost $0.75. Codex session `cb044e72` passed hard assertions at 3/3; output quality was 86.7%, p50 latency 51.2s, and total cost $0.75. Report validation passed for required benchmark fields and `git diff --check` passed. Report: `benchmark/test-content-programming-2026-05-14.md`. Recommended next skill: `$session-triage content-programming benchmark failure`.

## Current Triage: content-programming Benchmark Failure 2026-05-14

**Goal:** Verify the fresh `content-programming` benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `content-programming` contracts are compared against benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] `benchmark/triage-content-programming-2026-05-14.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. The benchmark failure is verified. Claude session `20ea1edd` failed 0/3 only on `Output includes next command handoff`; all content, artifact, pack, skill, and workflow assertions passed. Codex session `cb044e72` passed 3/3. The responsible gap is the benchmark harness: the generic pack prompt asks for "a Next command line" while the hard assertion requires a stricter accepted label, and the quality evaluator defaults the expected pack route to `$exec` even though mirrored `content-programming` contracts route to `/series-spec` or `$series-spec` after writing. Report validation passed and `git diff --check` passed. Report: `benchmark/triage-content-programming-2026-05-14.md`. Recommended next skill: `$targeted-skill-builder content-programming benchmark next-route coverage`.

## Current Fix: Showcase Data For `icon-handler` Benchmark Evidence

**Goal:** Ensure the frontend Skills Showcase reflects the latest `icon-handler` benchmark and review evidence.

**Acceptance Criteria:**
- [x] The current generated site payload is checked for `icon-handler` benchmark evidence.
- [x] The generator selects `benchmark/test-icon-handler-2026-05-14.md` instead of the stale 2026-05-13 report.
- [x] The benchmark results matrix references `benchmark/review-icon-handler-2026-05-14.md`.
- [x] Layer1 regression coverage protects title-case agent rows in benchmark reports.
- [x] Generated assets are validated, then committed and pushed on `master`.

**Result:** In progress. The site data already listed `icon-handler`, but its benchmark evidence was stale. Updated `scripts/generate-skills-showcase-data.mjs` to parse benchmark tables by header name, normalize agent labels, and support current benchmark summary/output-quality columns. Regenerated the dual showcase payloads, GitHub proof payloads, and benchmark results matrix. Added layer1 coverage that checks `icon-handler` publishes `benchmark/test-icon-handler-2026-05-14.md` with both agent rows.

## Current Agent Review: icon-handler Benchmark 2026-05-14

**Goal:** Review the latest persisted `icon-handler` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/icon-handler-*`.
- [x] Retained generated `icon-audit.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-icon-handler-2026-05-14.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-14. Reviewed `icon-handler-claude-bccbdf8a` and `icon-handler-codex-68b180e6`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context was clean: Claude passed 3/3 hard assertions with 84.1% quality, and Codex passed 3/3 hard assertions with 84.8% quality. Full `icon-audit.md` artifacts were retained for both runners. Subjective verdict was good overall with median score 89.0 and range 84-93. The main output-quality gap is precision: manifest destination varies across outputs, exact generated icon sizes/formats are not always named, and some outputs omit public install/touch surfaces. Report: `benchmark/review-icon-handler-2026-05-14.md`. Recommended next command: `$targeted-skill-builder icon-handler Next App Router manifest path specificity`.

## Current Targeted Update: icon-handler Benchmark Image-Error Classification

**Goal:** Classify Claude runner image-processing API errors as benchmark infrastructure blocks instead of evaluated `icon-handler` skill failures.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark runner classification and layer1 regression coverage, not mirrored `icon-handler` skill contracts.
- [x] Non-zero runner output containing `Could not process image` is marked infrastructure-blocked with a clear reason.
- [x] Layer1 proves assertions are skipped for this image-processing API error.
- [x] Targeted and required validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Updated `tests/harness/bench-runner.ts` so non-zero runner output containing `Could not process image` is classified as `agent runner image processing error` and therefore infrastructure-blocked. Added `tests/layer1/runner.test.ts` coverage proving assertions are skipped and the run is not marked passed. Validation passed with focused runner tests, install/skill checks, benchmark coverage, `pnpm --dir tests verify --skill icon-handler`, a Claude smoke benchmark `icon-handler-claude-04ff1a83` with 1/1 hard assertions, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill icon-handler`.

## Current Benchmark: icon-handler After Image-Error Classification 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after image-processing runner errors were reclassified as infrastructure blocks.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `icon-handler` is known and reports its coverage status.
- [x] `pnpm verify --skill icon-handler` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-icon-handler-2026-05-14.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-14. `icon-handler` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 in 8.9s across 1,447 tests; layer2 was skipped because no target-specific layer2 tests matched `icon-handler`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 84.1% output quality, p50 latency 37.1s, and $3.00 total cost. Codex passed 3/3 evaluated hard assertions with 84.8% output quality, p50 latency 61.5s, and $3.00 total cost. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next skill: `$benchmark-agent-review icon-handler`.

## Current Triage: icon-handler Benchmark Image Failure 2026-05-14

**Goal:** Verify the latest Claude `icon-handler` benchmark image-processing failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted failed-run evidence are inspected.
- [x] Mirrored `icon-handler` contracts are compared against the Tier 2/3 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] `benchmark/triage-icon-handler-2026-05-14-image.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-14. The latest Claude failure is verified: `icon-handler-claude-86ed23d1` run #2 exited with `API Error: 400 Could not process image` before creating `icon-audit.md`. Codex passed 3/3 hard assertions and adjacent Claude run #0 completed normally, so the mirrored skill contracts and current route-clarified fixture are not the responsible gap. Root cause is benchmark harness classification: this runner/API image-processing failure should be infrastructure-blocked rather than counted as an evaluated skill failure. Report: `benchmark/triage-icon-handler-2026-05-14-image.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark image-error classification`.

## Current Benchmark: icon-handler Rerun 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after the benchmark route-clarity fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `icon-handler` is known and reports its coverage status.
- [x] `pnpm verify --skill icon-handler` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-icon-handler-2026-05-14.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark rerun completed on 2026-05-14. `icon-handler` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 in 12.3s across 1,446 tests; layer2 was skipped because no target-specific layer2 tests matched `icon-handler`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 2/3 evaluated hard assertions with 62.1% output quality, p50 latency 38.5s, and $3.00 total cost; Claude run #2 hit `API Error: 400 Could not process image` and did not create `icon-audit.md`. Codex passed 3/3 evaluated hard assertions with 84.1% output quality, p50 latency 73.0s, and $3.00 total cost. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next command: `$session-triage icon-handler benchmark failure`.

## Current Investigation: Research Skill Approval Reports

**Goal:** Update research-oriented skills so they can present findings for user approval before writing canonical research files, instead of always writing directly to disk.

**Acceptance Criteria:**
- [x] Research skills with direct-write contracts are identified.
- [x] A consistent report-first approval rule is added where appropriate.
- [x] Existing explicit write/update modes remain available after approval.
- [x] Targeted validation confirms the updated contracts.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Added a shared `## Report-First Approval Gate` to all 92 exact `type: research` skills across mirrored Claude and Codex packs. Added focused layer1 coverage in `tests/layer1/research-approval-gate.test.ts` to keep future research skills report-first by default. Validation passed with focused approval-gate tests, direct contract scan, skill dependency/version/routing checks, benchmark coverage, Skills Showcase data validation, and whitespace validation. Recommended next command: `$ship`.

## Current Targeted Skill Build: icon-handler

**Goal:** Add a shared Claude/Codex skill for auditing and applying a project-root desired icon across favicon, app icon, Apple touch icon, and manifest surfaces with a hygiene-style audit-first approval gate.

**Acceptance Criteria:**
- [x] Existing overlap is checked; `$hygiene` covers structural audits but not icon conversion/metadata correction.
- [x] Mirrored `global/claude/icon-handler` and `global/codex/icon-handler` skill contracts exist.
- [x] Codex `agents/openai.yaml` manifest exists.
- [x] Benchmark coverage and a deterministic Next App Router icon audit fixture are registered.
- [x] Discovery docs and generated Skills Showcase assets are refreshed.
- [x] Install, skill integrity, coverage, showcase, target verify, targeted `rg`, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Created mirrored `global/claude/icon-handler` and `global/codex/icon-handler` skill contracts plus the Codex `agents/openai.yaml` manifest. The skill is audit-first by default, requires explicit `fix` approval before modifications, covers Next App Router favicon/app/Apple icon conventions, warns that `favicon.ico` is the conventional browser-probed file rather than `icon.ico`, and requires generated asset plus metadata/build-output verification. Added `icon-handler` to `docs/skills-reference.md`, `tests/harness/bench-coverage.ts`, and the Tier 2/3 global benchmark setup fixture. Refreshed Skills Showcase generated assets. Validation passed with `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, focused layer1 benchmark setup/quality files, `pnpm --dir tests verify --skill icon-handler`, showcase generation/validation, targeted `rg`, and `git diff --check`. Recommended next command: `$icon-handler audit <asset>`.

## Current Benchmark: icon-handler 2026-05-13

**Goal:** Run `$benchmark-test-skill icon-handler` with repository harness eligibility, verify, and both-agent benchmark evidence after the runner-specific route convention fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `icon-handler` is known and reports its coverage status.
- [x] `pnpm verify --skill icon-handler` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-icon-handler-2026-05-13.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-13. `icon-handler` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 in 8.8s across 1,352 tests; layer2 was skipped because no target-specific layer2 tests matched `icon-handler`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 1/3 evaluated hard assertions with 40.2% output quality, p50 latency 21.6s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 84.1% output quality, p50 latency 65.8s, and $0.75 total cost. Report: `benchmark/test-icon-handler-2026-05-13.md`. Committed and pushed on `master`. Recommended next command: `$session-triage icon-handler benchmark failure`.

## Current Triage: icon-handler Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `icon-handler` benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `icon-handler` contracts are compared against the Tier 2/3 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] `benchmark/triage-icon-handler-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The benchmark failure is verified. Claude runs #0 and #1 in `icon-handler-claude-7d05699b` exited with `API Error: 400 Could not process image` before creating `icon-audit.md`; Claude run #2 and all Codex runs completed successfully. The responsible gap is the benchmark fixture, not the mirrored `icon-handler` skill contracts: the fixture writes ASCII text to `calc-mascot-icon.png`, which can trigger runner/image transport handling before local file audit. Report: `benchmark/triage-icon-handler-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark valid source asset`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13 Latest

**Goal:** Run `$benchmark-test-skill session-triage` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13 at 13:06 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 11.8s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 37.1s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 37.4s, and $0.75 total cost. Report validation passed with target, agent rows, pass-rate, latency, cost, consistency, raw session paths, and next-route evidence. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Current Agent Review: session-triage Fresh Rerun 2026-05-13 Latest

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/session-triage-*`.
- [x] Retained generated triage artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-session-triage-2026-05-13.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-13. Reviewed `session-triage-claude-69ca7dea` and `session-triage-codex-33b0cc9d`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context was clean: both runners passed 3/3 hard assertions with 100.0% output quality. Subjective median score was 89.5 with range 86-94. Codex outputs were excellent and evidence-bound; Claude outputs appeared good from retained summaries, but full generated report text was not persisted for Claude. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder benchmark-agent-review retained artifact evidence`.

## Current Targeted Update: Benchmark Review Retained Artifact Evidence

**Goal:** Persist generated benchmark artifacts in raw run results so `$benchmark-agent-review` can review Claude and Codex outputs with the same fidelity.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness persistence, not the `benchmark-agent-review` skill contract.
- [x] `run-*.json` can include bounded generated artifact content when a benchmark setup declares `qualityOutputPath`.
- [x] Focused layer1 coverage proves generated artifact content is persisted for later review.
- [x] Focused layer1 tests, install, skill dependency/version/routing checks, targeted retained-artifact checks, and whitespace validation pass; benchmark coverage blocker is recorded.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Updated `tests/harness/bench-types.ts` and `tests/harness/bench-runner.ts` so each benchmark run can persist an optional `artifacts` map with bounded generated artifact content. Setups with `qualityOutputPath` now retain that artifact content in `run-*.json`, which directly addresses the review fidelity gap for Claude outputs that do not echo full file diffs. Updated `tests/layer1/runner.test.ts` with focused coverage for persisted artifact evidence. Validation passed with `pnpm --dir tests test:layer1 -- runner`, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, targeted `rg` checks, and `git diff --check`. `pnpm --dir tests bench:coverage` is blocked by unrelated untracked `global/claude/icon-handler/` and `global/codex/icon-handler/` skill directories missing benchmark coverage; those files were not part of this retained-artifact fix and were left unmodified. Recommended next command: `$targeted-skill-builder icon-handler benchmark coverage`.

## Current Targeted Update: session-triage Benchmark Artifact Verification

**Goal:** Harden the `session-triage` benchmark fixture so runs verify the required root report exists after writing it.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture and layer1 setup tests, not the mirrored `session-triage` skill contracts.
- [x] The fixture prompt requires verifying `session-triage-report.md` exists in the project root after writing and creating it before response if missing.
- [x] Layer1 regression coverage asserts the post-write existence check and preserves the no-skill-change branch.
- [x] Focused layer1, required skill checks, benchmark coverage, target verify, Codex smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` fixture now requires a post-write existence check for `session-triage-report.md` and instructs the runner to create it before responding if it is missing. Extended `tests/layer1/bench-setups.test.ts` coverage for the new prompt requirement while preserving the no-skill-change branch. Validation passed with focused layer1, required skill checks, benchmark coverage, install, target verify, Codex smoke `session-triage-codex-9ee8c354` with 1/1 hard assertions and 100.0% quality, and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Triage: session-triage Benchmark Failure 2026-05-13 12:07

**Goal:** Verify the fresh `session-triage` benchmark failure from Codex session `d417810e` and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted failed-run evidence are inspected.
- [x] Mirrored `session-triage` contracts are compared against benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark fixture gap, or runner noncompliance.
- [x] `benchmark/triage-session-triage-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The fresh benchmark failure is verified: Codex session `d417810e` run #1 exited successfully after reading the right evidence but did not create `session-triage-report.md`, causing the hard assertion failure. Claude session `865e8407` passed 3/3 with 100.0% output quality, and adjacent Codex runs #0 and #2 passed, so the issue is not mirrored `session-triage` contract drift. Root cause is Codex runner noncompliance with an adequate fixture instruction, with a narrow benchmark fixture robustness opportunity: require a post-write existence check for `session-triage-report.md`. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark artifact verification`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13 12:07

**Goal:** Run `$benchmark-test-skill session-triage` with fresh harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13 at 12:07 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.9s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 29.7s, and $0.75 total cost. Codex passed 2/3 evaluated hard assertions with 82.5% output quality, p50 latency 278.3s, and $0.75 total cost; Codex run #1 failed `session-triage-report.md created in project root`. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Current Fix: session-triage Benchmark Fixture Robustness

**Goal:** Harden the `session-triage` benchmark fixture so runs write the root report before optional exploration and the rubric accepts explicit no-skill-change outputs.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture/rubric and layer1 setup tests, not the mirrored `session-triage` skill contracts.
- [x] The fixture prompt requires reading `session-log.md` and `tasks/lessons.md`, writing `session-triage-report.md` in the project root before optional exploration, and preserving the no-skill-change branch for one-off noncompliance with an adequate validation rule.
- [x] Layer1 covers the root artifact requirement, required report sections, no-skill-change branch, and explicit "task checklist, not skill contract" language.
- [x] Focused layer1 setup/quality tests, required skill checks, benchmark coverage, target verify, Codex smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` and `tests/layer1/bench-setups.test.ts` so the `session-triage` benchmark fixture is more robust and no longer false-fails explicit no-skill-change reports. Validation passed, including Codex smoke `session-triage-codex-48488be1` with 1/1 hard assertions, 100.0% quality, and no blocked runs. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Triage: session-triage Benchmark Failure Current 2026-05-13

**Goal:** Triage the current `session-triage` benchmark failure from `session-triage-codex-fbec4404` and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Current benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `session-triage` contracts are compared against the tier1 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] `benchmark/triage-session-triage-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The current benchmark failure is verified. Codex run #0 exited without creating `session-triage-report.md` in the project root, causing a hard assertion failure; Claude passed hard assertions but had low output-quality scores from over-remediation. The responsible gap is the benchmark fixture prompt and layer1 regression coverage, not the mirrored `session-triage` skill contracts. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark fixture robustness`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13 Current

**Goal:** Run `$benchmark-test-skill session-triage` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Current benchmark rerun completed on 2026-05-13 at 11:36 ET. Verify passed with layer1 in 8.4s across 1,350 tests and layer2 skipped because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 hard assertions with 68.4% output quality, p50 latency 41.1s, and $0.75 total cost. Codex passed 2/3 hard assertions with 73.7% output quality, p50 latency 54.3s, and $0.75 total cost; Codex run #0 failed `session-triage-report.md created in project root`. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Current Fix: session-triage Benchmark Over-Remediation Rubric

**Goal:** Tighten the `session-triage` benchmark rubric so reports that identify adequate existing contracts do not get full credit for unconditional `$targeted-skill-builder` remediation.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture/rubric and layer1 setup tests, not the `session-triage` skill contract.
- [x] A deterministic quality criterion penalizes unconditional skill-builder routing when a report says the existing contract is adequate or the issue is one-off agent noncompliance.
- [x] Layer1 regression coverage accepts no-skill-change routing and rejects over-remediation routing.
- [x] Focused layer1 setup/quality tests, benchmark coverage, target verify, install/skill contract checks, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` quality rubric includes a critical `no-over-remediation-route` criterion. It penalizes reports that recommend `$targeted-skill-builder` unconditionally while also framing the incident as one-off agent noncompliance or an adequate existing contract. Updated `tests/layer1/bench-setups.test.ts` to prove `Recommended next skill: none` passes this branch and unconditional `$targeted-skill-builder run` fails it. Validation passed with focused layer1 tests, benchmark coverage, install, skill dependency/version/routing checks, target verify, and whitespace validation. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Agent Review: session-triage Fresh Benchmark 2026-05-13

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/session-triage-*`.
- [x] Retained generated triage artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-session-triage-2026-05-13.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-13. Reviewed `session-triage-claude-4cfa1e99` and `session-triage-codex-f8e827fb`, covering 6 evaluated outputs. Deterministic benchmark context was clean: both runners passed 3/3 hard assertions with 100.0% quality and no infrastructure blocks. Subjective median score was 82.5 with range 80-94. Outputs were generally good, with strong evidence-bounded incident triage, but several over-routed to `$targeted-skill-builder` despite identifying an adequate existing `$exec` contract and likely one-off agent noncompliance. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder session-triage benchmark over-remediation rubric`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13

**Goal:** Run `$benchmark-test-skill session-triage` with fresh repository harness eligibility, verify, and both-agent benchmark evidence after the benchmark fixture routing fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.8s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 45.9s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 55.5s, and $0.75 total cost. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Current Benchmark: session-triage 2026-05-13

**Goal:** Run `$benchmark-test-skill session-triage` with repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-13. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.0s across 1,349 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with one Claude infrastructure-blocked run. Claude passed 0/2 evaluated hard assertions, with 92.9% output quality, p50 latency 42.8s, and $0.75 total cost. Codex passed 2/3 evaluated hard assertions, with 97.6% output quality, p50 latency 55.5s, and $0.75 total cost. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Current Triage: session-triage Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `session-triage` benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `session-triage` contracts are compared against the tier1 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] `benchmark/triage-session-triage-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The benchmark failure is verified, but the responsible gap is the benchmark setup, not the `session-triage` skill contract. The fixture describes one-off agent noncompliance with an adequate validation contract and existing lesson, while `session-triage` explicitly says not to recommend a skill change in that situation. The fixture still hard-requires `$targeted-skill-builder`; latest Codex evidence passes that assertion, but Claude still fails because the setup expects only the Codex dollar route instead of `/targeted-skill-builder`. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark fixture routing`.

## Current Targeted Skill Update: session-triage Benchmark Fixture Routing

**Goal:** Align the `session-triage` tier1 benchmark fixture with the skill contract's no-skill-change branch for one-off agent noncompliance.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture and layer1 setup tests, not the `session-triage` skill contract.
- [x] The hard-coded `$targeted-skill-builder` route requirement is removed from the current one-off noncompliance fixture.
- [x] Layer1 regression coverage accepts `Recommended next skill: none` and rejects reintroducing the hard-coded route assertion.
- [x] Focused layer1, benchmark coverage, target verify, smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Targeted fixture update completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` fixture still requires report evidence, specificity, validation planning, and an explicit next-command handoff, but no longer hard-requires `$targeted-skill-builder` for a one-off noncompliance case where the existing contract is adequate. Added `tests/layer1/bench-setups.test.ts` coverage proving a `Recommended next skill: none` report passes route scoring and that the setup no longer emits `Output recommends $targeted-skill-builder`. Validation passed with focused layer1 tests, benchmark coverage, target verify, Codex smoke `session-triage-codex-14d81596`, and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Benchmark Rerun: benchmark-test-skill Self Benchmark Fresh 2026-05-13

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-13.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark completed on 2026-05-13. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.5s across 1,312 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 17.8s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 30.5s, and $0.75 total cost. Report: `benchmark/test-benchmark-test-skill-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

## Current Agent Review: benchmark-test-skill Fresh Benchmark 2026-05-13

**Goal:** Review the latest persisted `benchmark-test-skill` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/benchmark-test-skill-*`.
- [x] Retained generated report artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-benchmark-test-skill-2026-05-13.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-13. Reviewed latest persisted runs `benchmark-test-skill-claude-46f32ef6` and `benchmark-test-skill-codex-e4c6aef6`. Both runners had 3/3 hard assertion pass rates and 100.0% deterministic output-quality scores. Subjective agent-review scores were excellent: Claude retained evidence scored 92/100 for each run, with the caveat that full generated report text was not retained; Codex scored 96/100, 96/100, and 95/100 with fully retained generated report diffs. Median subjective score was 93.5 with range 92-96. No target-skill remediation is needed. Report: `benchmark/review-benchmark-test-skill-2026-05-13.md`. Recommended next command: `$ship`.

## Current Benchmark Rerun: benchmark-test-skill Self Benchmark 2026-05-13

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-13.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark completed on 2026-05-13. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.2s across 1,312 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 evaluated hard assertions, all on `Output matches workflow expectation`; its output-quality average was 80.0% with 3 threshold failures and 3 critical failures, driven by `metrics-table-structure`. Codex passed 3/3 evaluated hard assertions with 100.0% output quality. Report: `benchmark/test-benchmark-test-skill-2026-05-13.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Current Triage: benchmark-test-skill Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `benchmark-test-skill` Claude benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] The 2026-05-13 benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `benchmark-test-skill` contracts and the tier1 benchmark setup expectations are compared.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] `benchmark/triage-benchmark-test-skill-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The benchmark failure is verified and narrow: Claude completed all three runs, created the expected report, included broad required facts and `/ship`, but failed the hard workflow expectation because `p50=1200` and `totalCost=0.42` were not detected as rows inside the `## Benchmark Metrics` table. Codex passed with the intended table shape. The mirrored `benchmark-test-skill` contracts are aligned; the responsible gap is the custom tier1 fixture prompt in `tests/layer4/setups/tier1-workflows.setup.ts`, which should explicitly require separate metric-table rows containing `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, and `run-agent-abc`. Report: `benchmark/triage-benchmark-test-skill-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Current Fix: benchmark-test-skill Fixture Prompt

**Goal:** Make the `benchmark-test-skill` custom benchmark fixture prompt explicit about the metric-table row structure required by its hard assertion and quality rubric.

**Acceptance Criteria:**
- [x] `tests/layer4/setups/tier1-workflows.setup.ts` requires separate `## Benchmark Metrics` rows for pass rate, p50 latency, total cost, and raw session path with the exact evidence tokens.
- [x] Focused layer1 benchmark setup/quality tests pass.
- [x] Required skill-builder validation and one-run Claude benchmark smoke pass or are recorded with a clear infrastructure block.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated the `benchmark-test-skill` tier1 fixture prompt to explicitly require `## Benchmark Metrics` table rows for pass rate, p50 latency, total cost, and raw session path with exact evidence tokens. Validation passed: `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, static skill checks, benchmark coverage, install, `pnpm --dir tests verify --skill benchmark-test-skill`, one-run Claude benchmark smoke (`benchmark-test-skill-claude-58480bc9`, 1/1 hard assertions, 100.0% quality, no blocked runs), and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Benchmark Rerun: benchmark-test-skill Fresh Self Benchmark

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark completed on 2026-05-12. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.1s across 1,304 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 92.4% output quality, p50 latency 26.3s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 92.4% output quality, p50 latency 67.5s, and $0.75 total cost. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

## Current Refactor: Benchmark-Backed Skill Demos

**Goal:** Replace or augment curated/demo-only skill examples on the G Skillpacks brand site with evidence-backed benchmark prompts and outputs from persisted benchmark runs.

**Acceptance Criteria:**
- [ ] The showcase data generator derives a compact demo payload from benchmark run artifacts when a skill has persisted benchmark evidence.
- [ ] Demo payloads include the exact benchmark prompt source and representative output excerpt/path without exposing unrelated temp paths or excessive transcript noise.
- [ ] The brand site renders benchmark-backed prompt/output demos for relevant pack/skill pages while preserving existing summary metrics.
- [ ] Layer1 or generator tests cover the new data shape and fallback behavior when raw run artifacts are absent.
- [ ] Showcase data is regenerated and validated.

## Current Fix: benchmark-test-skill Benchmark Failure Rubric Alignment

**Goal:** Align the `benchmark-test-skill` tier1 benchmark quality rubric with the hard structural report assertion after the 2026-05-13 self-benchmark found Claude runs that preserved facts but failed report structure.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark harness/setup, not a new skill.
- [x] The output-quality rubric fails reports that preserve facts but place benchmark metrics outside the `## Benchmark Metrics` table.
- [x] Layer1 regression coverage rejects malformed metric-table reports while preserving the existing structured passing fixture.
- [x] Targeted and required validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. The `benchmark-test-skill` hard assertion and output-quality rubric now agree on the structured metrics-table requirement: pass rate, p50 latency, and total cost must appear as rows inside the `## Benchmark Metrics` table. A new layer1 regression rejects reports that keep the facts but move those metrics into prose. Validation passed with focused layer1 tests, benchmark coverage, install/link checks, verify, and whitespace validation. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Benchmark Rerun: session-triage Fresh Rerun 2026-05-13 10:40

**Goal:** Run `$benchmark-test-skill session-triage` with fresh repository harness eligibility, verify, and both-agent benchmark evidence after the latest benchmark fixture routing fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13 at 10:40 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.6s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 93.8% output quality, 1 critical quality failure, p50 latency 44.1s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 95.8% output quality, 1 critical quality failure, p50 latency 64.1s, and $0.75 total cost. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Current Agent Review: session-triage Fresh Rerun 2026-05-13 10:40

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality after the fresh 10:40 benchmark rerun.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/session-triage-*`.
- [x] Retained generated triage artifacts and benchmark context are extracted for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric without merging subjective scores into deterministic benchmark metrics.
- [x] `benchmark/review-session-triage-2026-05-13.md` records source reports, run indexes, scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Reviewed `session-triage-claude-e5f0772b` and `session-triage-codex-374ad6f0`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context remained clean on hard assertions: both runners passed 3/3. Subjective median score was 78 with range 74-94. The best outputs were evidence-bound and routed to operational validation, but several over-remediated by recommending `$targeted-skill-builder` or `$exec` contract edits even after identifying an adequate existing `$exec` contract and likely one-off noncompliance. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder session-triage benchmark over-remediation rubric`.

## Current Fix: session-triage Evidence-Gate Over-Remediation Rubric

**Goal:** Tighten the `session-triage` benchmark rubric so reports that identify adequate existing contracts do not get full credit for re-labeling one-off noncompliance as a new `$exec` evidence-gate or contract-change task.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture/rubric and layer1 setup tests, not the `session-triage` skill contract.
- [x] The `no-over-remediation-route` quality criterion penalizes evidence-gate or contract-change recommendations when the output also says the existing rule is adequate.
- [x] Layer1 regression coverage rejects `$exec` evidence-gate over-remediation while preserving accepted operational `$exec` routing.
- [x] Targeted and required validation pass, including showcase data refresh/validation.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so `no-over-remediation-route` fails outputs that call for skill or contract changes, including `$exec` evidence-gate changes, after framing the incident as one-off noncompliance or an adequate existing contract. Updated `tests/layer1/bench-setups.test.ts` with regression cases proving evidence-gate over-remediation fails while operational `$exec` routing passes. Regenerated Skills Showcase data and benchmark matrix artifacts. Validation passed with focused layer1 setup/quality tests, install/link checks, benchmark coverage, target verify, showcase generation/validation, targeted `rg`, and whitespace validation. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Benchmark Rerun: benchmark-test-skill Self Benchmark

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark rerun completed on 2026-05-12. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.2s across 1,303 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with one Claude infrastructure-blocked run due to agent runner budget. Evaluated hard assertions passed for both agents: Claude 2/2 evaluated runs, Codex 3/3 evaluated runs. Claude output quality averaged 72.9% with 2 threshold failures and 2 critical failures; Codex output quality averaged 85.7% with 0 threshold failures and 2 critical failures. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

**Agent Review Result:** Completed on 2026-05-12. Reviewed the latest Claude and Codex persisted outputs, excluding one Claude infrastructure-blocked run. Median subjective score was 80 with range 70-92. The outputs are usable-to-good but need tighter exact evidence reporting: several reports summarize `layer1 PASS` as generic `PASS` or broad "verify status". Report: `benchmark/review-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill exact benchmark evidence reporting`.

**Targeted Fix Result:** Completed on 2026-05-12. The `benchmark-test-skill` tier1 fixture now requires exact report evidence in both the prompt and hard assertions: `layer1 PASS`, `layer2 SKIPPED`, `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, `run-agent-abc`, source files, and literal report path `benchmark/test-run-2026-05-11.md`. Layer1 regression coverage rejects a broad keyword-only report. Validation passed with focused layer1 tests, coverage, install/dependency/version/routing checks, verify, Codex smoke `benchmark-test-skill-codex-2527788d`, and whitespace validation. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Fix: benchmark-test-skill Structured Fixture Report Ergonomics

**Goal:** Tighten the `benchmark-test-skill` tier1 benchmark fixture so generated benchmark reports are exact and easy for the next operator to scan.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark fixture/setup, not a new skill.
- [x] The fixture prompt requires stable report sections/tables for verification, benchmark metrics, raw evidence, and next route.
- [x] Hard assertions require structured report headings in addition to exact fixture evidence.
- [x] The output-quality rubric rewards report ergonomics and rejects unstructured evidence dumps.
- [x] Focused layer1 tests, benchmark coverage, required skill validation, and whitespace validation pass.

**Result:** Completed on 2026-05-12. The `benchmark-test-skill` tier1 fixture now requires a structured fixture report with verification, benchmark metrics, raw evidence, and next-route sections, plus Markdown tables and exact fixture facts. Layer1 coverage accepts the structured report and rejects exact-but-unstructured evidence dumps. Final Codex smoke `benchmark-test-skill-codex-39561c73` passed 1/1 hard assertions with 100.0% quality. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Fix: benchmark-test-skill Neutral Benchmark Fixture

**Goal:** Remove misleading Codex-specific fixture evidence from the `benchmark-test-skill` tier1 benchmark while preserving runner-specific `/ship` and `$ship` route assertions.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark harness/setup, not a new skill.
- [x] The fixture raw session path is neutral and no longer nudges Claude toward `$ship`.
- [x] The fixture prompt says runner route convention is authoritative regardless of fixture filenames or raw session paths.
- [x] Layer1 coverage guards against reintroducing the misleading `run-codex-abc` fixture.
- [x] Focused layer1 tests, benchmark coverage, verify, smoke benchmarks, and whitespace validation pass.

**Result:** Completed on 2026-05-12. The `benchmark-test-skill` tier1 fixture now uses neutral `run-agent-abc` benchmark evidence, explicitly tells runners that their command convention overrides fixture filenames/raw session text, preserves runner-specific `/ship` and `$ship` assertions, and uses a focused timeout for this slower fixture. Layer1 coverage guards against reintroducing `run-codex-abc`. Validation passed with focused layer1 tests, benchmark coverage, verify, Claude smoke `benchmark-test-skill-claude-a04dd30c` (1/1 hard pass), Codex smoke `benchmark-test-skill-codex-103b0680` (1/1 hard pass), install/link checks, routing checks, and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Triage: benchmark-test-skill Fresh Benchmark Failure

**Goal:** Triage the fresh `$benchmark-test-skill benchmark-test-skill` benchmark failure after the latest targeted fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run artifacts are inspected.
- [x] Mirrored benchmark-test-skill contracts are compared for drift.
- [x] The tier1 fixture prompt, route assertions, and quality scoring expectations are checked.
- [x] Existing lessons are checked for runner-route and benchmark workflow patterns.
- [x] Triage report records verdict, root cause, responsible gap, validation plan, and next route.

**Result:** Fresh triage completed on 2026-05-12. The failure is verified. The primary durable issue is fixture ambiguity: the tier1 benchmark asks Claude to emit `/ship` but the fixture raw path still says `run-codex-abc`, which caused two Claude runs to infer `$ship`. The secondary Codex failure is an artifact-missing runner/write anomaly in one run, not yet a skill-contract defect. Report: `benchmark/triage-benchmark-test-skill-fresh-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Current Benchmark Rerun: benchmark-test-skill Fresh Validation

**Goal:** Rerun `$benchmark-test-skill benchmark-test-skill` after the latest targeted fix, using fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Fresh benchmark validation completed on 2026-05-12. Verify passed with layer1 in 9.1s across 1,302 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 1/3 hard assertions and failed two runs because the output recommended `/ship`; Claude output quality averaged 80.0%, with 2 threshold failures and 2 critical failures. Codex passed 2/3 hard assertions and failed one run because it created `benchmark/test-run-2026-05-11.md` instead of the expected benchmark-test-skill report path; Codex output quality averaged 85.7%, with 1 threshold failure and 1 critical failure. See `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Previous Benchmark Rerun: benchmark-test-skill

**Goal:** Rerun `$benchmark-test-skill benchmark-test-skill` after the benchmark harness routing fix, using fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [ ] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Benchmark rerun completed on 2026-05-12. Verify passed with layer1 in 8.5s across 1,256 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 hard assertions because all three runs omitted the required next-command handoff, and run #1 also exited with code 143; Claude output quality averaged 89.8%, with no threshold or critical failures. Codex passed 3/3 hard assertions; Codex output quality averaged 85.8%, with 1 threshold failure and 2 critical failures. See `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Current Benchmark: benchmark-test-skill

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-12. `benchmark-test-skill` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.4s across 1,256 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 hard assertions because every run omitted the required next-command handoff; Claude output quality averaged 63.1%, with 3 threshold failures and 6 critical failures. Codex passed 3/3 hard assertions; Codex output quality averaged 85.8%, with 1 threshold failure and 4 critical failures. See `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Current Triage: benchmark-test-skill Benchmark Failure

**Goal:** Triage the failed `benchmark-test-skill` benchmark and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] The benchmark report and persisted run evidence are inspected.
- [x] Mirrored Claude/Codex `benchmark-test-skill` contracts are compared.
- [x] The tier1 benchmark setup, hard route assertion, and quality scoring path are inspected.
- [x] Existing lessons are checked for relevant routing/rubric patterns.
- [x] The triage report records verdict, root cause, responsible gap, validation plan, and next route.

**Result:** Triage completed on 2026-05-12. The benchmark failure is verified, but the responsible gap is in the benchmark harness/rubric, not the mirrored `benchmark-test-skill` contracts. The hard route assertion recognizes `Next command` but not all contract-valid route shapes, and the quality rubric appears to penalize final runner summaries or generated reports for not repeating fixture file names. See `benchmark/triage-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Current Fix: benchmark-test-skill Benchmark Harness Routing

**Goal:** Fix the `benchmark-test-skill` tier1 benchmark harness so contract-valid next-route labels and report evidence formats pass deterministic assertions and quality scoring.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark harness/setup, not a new skill.
- [x] Route assertions accept `Next command`, `Recommended next command`, `Recommended next skill`, and `Next work` plus `Recommended next command`.
- [x] The `benchmark-test-skill` fixture requires source file names and report path in generated reports.
- [x] The output-quality rubric accepts semantic latency/cost evidence rather than one exact serialized key format.
- [x] Focused layer1 tests, benchmark coverage, verify, and one-run Codex benchmark smoke pass.

**Result:** Completed on 2026-05-12. Updated routing and quality helper coverage plus the `benchmark-test-skill` tier1 fixture. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill benchmark-test-skill`, and `pnpm --dir tests bench --skill benchmark-test-skill --agent codex --runs 1 --chunk-size 1 --pause 0` (`benchmark-test-skill-codex-8a56e0ed`, 1/1 hard assertions, 100.0% quality, no blocked runs). Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Benchmark: spec-interview

**Goal:** Run `$benchmark-test-skill spec-interview` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `spec-interview` is known and reports its coverage status.
- [x] `pnpm verify --skill spec-interview` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill spec-interview --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-spec-interview-2026-05-12.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-12. `spec-interview` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 7.9s across 1,255 tests; layer2 was skipped because no target-specific layer2 tests matched `spec-interview`. Claude had 3/3 infrastructure-blocked runs due to agent runner budget exceeded. Codex completed 3 evaluated runs and failed 0/3 hard assertions because every run omitted the expected `$plan-phase` recommendation. Codex output quality averaged 85.7%, with no threshold failures and 3 critical failures. See `benchmark/test-spec-interview-2026-05-12.md`. Recommended next command: `$session-triage spec-interview benchmark failure`.

## Current Benchmark: ship

**Goal:** Run `$benchmark-test-skill ship` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-11.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-11. `ship` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.2s across 1,253 tests; layer2 was skipped because no target-specific layer2 tests matched `ship`. The both-agent benchmark completed with no infrastructure-blocked runs: Claude failed 0/3 hard assertions because every run omitted the expected actionable `$exec` handoff, while Codex passed 3/3. Output-quality scores were 71.4% for Claude and 78.6% for Codex. See `benchmark/test-ship-2026-05-11.md`. Recommended next command: `$session-triage ship benchmark failure`.

## Current Triage: benchmark-agent-review Remediation Handoff

**Goal:** Verify whether `$benchmark-agent-review` has a contract gap that prevents it from giving definitive next steps to remediate issues it identifies.

**Acceptance Criteria:**
- [x] The current `benchmark-agent-review` contract is inspected.
- [x] The latest `ship` review output is compared against the desired remediation handoff behavior.
- [x] Mirrored Claude/Codex skill presence and relevant lessons are checked.
- [x] The triage report names the responsible contract gap, exact recommended wording, validation checks, and next skill route.
- [x] Results are recorded in `tasks/todo.md`; if tracked files change, commit and push on `master`.

**Result:** Triage completed on 2026-05-11 and the targeted skill update was implemented. Mirrored `benchmark-agent-review` now requires remediation-ready mapping from each material finding to owner, exact contract/rubric target, validation check, and route. Mirrored `benchmark-test-skill` now hands off deterministic benchmark reports to `benchmark-agent-review` as a separate subjective review/remediation step when needed. Recommended next command: `$ship`.

## Current Benchmark: run Codex

**Goal:** Run `$benchmark-test-skill run --codex` through the repository harness with fresh verify and Codex-only benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm verify --skill run` is attempted from `tests/`.
- [x] Benchmark execution is skipped if verify fails.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Blocked at verify on 2026-05-11. Layer1 passed in 7.1s with 1,188 tests, but layer2 failed in 286ms because no layer2 test files matched the `run` skill filter. No Codex benchmark was run and no benchmark report was written.

**Triage Result:** Verified benchmark eligibility gap. `run` is a repository skill, but the current benchmark harness only registers `design-system` and `design-system-draftstonk` layer4 setups, so `$benchmark-test-skill run --codex` should fail earlier with an unsupported-target message rather than presenting the failure as a `run` verify problem.

## Current Benchmark: ship Codex

**Goal:** Run `$benchmark-test-skill ship --codex` through the repository harness with fresh eligibility, verify, and Codex-only benchmark evidence on 2026-05-11.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent codex --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`.

**Result:** Benchmark completed on 2026-05-11. `ship` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 12.1s across 1,245 tests; layer2 was skipped because no target-specific layer2 tests matched `ship`. Codex benchmark failed 0/3 hard assertions with no infrastructure-blocked runs. Each failed run created the manifest but recommended `$ship` or `$ship --no-deploy` as the next command, which failed the actionable next-route assertion. Output quality averaged 71.4%, below the 78.0% threshold, with evidence-linked and actionable-next-route at 0.0%. See `benchmark/test-ship-2026-05-11.md`. Recommended next command: `$session-triage ship benchmark failure`.

## Current Skill Update: Ship Benchmark Self-Route Fix

**Goal:** Update the existing `ship` skill contracts so `$ship` completion never routes back to `$ship` as routine next work and instead hands off to the next executable project step.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in `ship`, not a new skill.
- [x] Codex and Claude `ship` contracts forbid routine self-routing after ship completion.
- [x] Deterministic layer1 coverage catches future loss of the self-route guard.
- [x] Standard skill validation, showcase data refresh, targeted checks, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-11. The mirrored `ship` contracts now forbid routine self-routing after successful shipping and route completed ship runs to `$exec`/`/exec` or another concrete next route, with retry exceptions only for incomplete shipping. Layer1 contract lint coverage was added, and the focused Codex `ship` benchmark passed 3/3 with no infrastructure-blocked runs.

## Current Skill Update: Benchmark Contract Lint and Routing

**Goal:** Harden `$benchmark-test-skill` so future benchmark requests resolve the benchmark pack command, preflight target eligibility, preserve both-agent default routing, and verify report/next-route output before completion.

**Source:** 2026-05-11 targeted-skill-builder request for a "skill contract lint and benchmark routing hardening" workflow, plus lessons on benchmark command ambiguity, pack-local command resolution, rate-limit classification, and next-step routing validation.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the benchmark pack skill owns this behavior; no duplicate broad lint skill is added.
- [x] Mirrored Claude/Codex `benchmark-test-skill` contracts explicitly require command resolution, eligibility preflight, report verification, infrastructure-blocked classification, and final next-step routing.
- [x] Deterministic layer1 contract tests lint the mirrored skill text for these requirements.
- [x] Benchmark coverage metadata remains valid for the material skill behavior update.
- [x] Standard skill validation, showcase data refresh, targeted behavior checks, and `git diff --check` pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-11. Updated existing `benchmark-test-skill` with mirrored command-resolution guards, report verification, and final-route requirements. Added layer1 contract lint coverage. Validation passed per `tasks/todo.md` Review.

## Current Benchmark: run

**Goal:** Run `$benchmark-test-skill run` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-11.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `run` is known and reports its coverage status.
- [x] `pnpm verify --skill run` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill run --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-run-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-11. Claude passed 1/3 with two command-exit failures; Codex passed 3/3. No infrastructure-blocked runs occurred. Route the failure to `$session-triage run benchmark failure`.

## Current Fix: Benchmark Target Eligibility Preflight

**Goal:** Make `$benchmark-test-skill <skill>` fail unsupported benchmark targets before verify with a clear supported-target list.

**Acceptance Criteria:**
- [x] Supported benchmark targets are available from the harness without reading source.
- [x] Unsupported targets such as `run` fail before any agent benchmark work with a clear unsupported-target message.
- [x] Mirrored benchmark-test-skill contracts require the eligibility preflight before verify.
- [x] Supported target verification still works for `design-system`.
- [x] Skills Showcase generated data is refreshed and results are recorded in `tasks/todo.md`.

## Current Fix: Generic Skill Benchmarks

**Goal:** Make `$benchmark-test-skill <skill>` work for every repository skill while preserving richer custom layer4 setups for skills with domain-specific assertions.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` lists repository skills, not only custom layer4 targets.
- [x] Skills with custom setups still use their custom fixtures and assertions.
- [x] Skills without custom setups use a generic smoke benchmark.
- [x] `pnpm verify --skill run` passes with layer2 skipped when no target-specific layer2 test exists.
- [x] `pnpm bench --skill run --agent codex --runs 1 --chunk-size 1 --pause 0` completes through the generic benchmark path.
- [x] Mirrored benchmark-test-skill contracts explain the distinction between generic smoke evidence and deep domain-quality evidence.

## Planned Benchmark Work: Codex Custom Coverage *(superseded by Phase 35)*

> This pre-phase planning section is superseded by Phase 35: Repository-Wide Custom Benchmark Coverage ✓, which delivered all of these goals with full acceptance criteria checked.

**Goal:** Use the current Codex token headroom to move beyond generic smoke benchmarks and build custom Codex benchmark coverage for repository skills.

**Source:** `specs/benchmark-custom-coverage.md`, `specs/benchmark-custom-coverage-feature-interview.md`, and 2026-05-11 user clarification that every current and future skill should have a custom benchmark test setup.

## Current Benchmark: design-system

**Goal:** Run `$benchmark-test-skill design-system` through the repository harness with fresh verify and benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm verify --skill design-system` passes from `tests/`.
- [x] `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-design-system-2026-05-10.md` reflects the latest `report.json` metrics, failures, latency, cost, consistency, and raw session path.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

## Current Skill Update: design-system Prose Headings

**Goal:** Tighten the mirrored `design-system` skill contract so generated `DESIGN.md` prose sections use parseable Markdown headings instead of bold paragraph labels.

**Acceptance Criteria:**
- [x] Update both `global/claude/design-system/SKILL.md` and `global/codex/design-system/SKILL.md` with the same Markdown-heading requirement.
- [x] Confirm no existing skill already owns this narrower behavior.
- [x] Refresh Skills Showcase generated data if tracked skill behavior changes.
- [x] Run standard skill validation, targeted heading checks, and whitespace validation.
- [x] Record results in `tasks/todo.md`, then commit and push on `master`.

## Current Fix: Both-Agent Benchmark Semantics

**Goal:** Make `$benchmark-test-skill <skill>` benchmark Claude and Codex by default while classifying runner rate limits as infrastructure-blocked instead of skill failures.

**Acceptance Criteria:**
- [x] `pnpm bench` accepts `--agent claude`, `--agent codex`, and `--agent both`, defaulting to both.
- [x] Claude and Codex benchmark sessions persist under separate raw run directories.
- [x] Rate limit and quota outputs are reported as infrastructure-blocked runs outside the evaluated skill pass rate.
- [x] Targeted report and type validation passes, then changes are committed and pushed on `master`.

## Current Documentation Sweep: Skills Showcase Design System

**Goal:** Capture the implemented Skills Showcase visual system in a root `DESIGN.md` so future site changes preserve the Swiss grid/blueprint motif, token names, accessibility constraints, and component styling rules.

**Acceptance Criteria:**
- [x] Scan the current static site CSS, UI spec, and product spec for concrete design tokens.
- [x] Record extracted token decisions and accessibility findings in `design-system-interview.md`.
- [x] Write `DESIGN.md` in the Google Labs Stitch-style format with machine-readable YAML frontmatter and prose guardrails.
- [x] Verify Markdown/frontmatter structure, contrast findings, and diff scope before shipping.

## Current Product: Skills Showcase Website MVP *(superseded by Phases 32-34)*

> This pre-phase planning section is superseded by Phases 32 (Product Foundation ✓), 33 (Workflow Experience ✓), and 34 (Distribution Launch ✓), which delivered all MVP goals. Manual launch tasks (newsletter provider, Vercel deploy) remain in `tasks/manual-todo.md`.

**Goal:** Build the showcase as a real top-of-funnel product for `agentic-skills`, G's agentic engineering brand, LexCorp distribution, and the Discord/community funnel.

## Current Hotfix: Skills Showcase Hero Overlap

**Goal:** Fix the homepage hero so the headline and supporting text never collide with the right-side workflow blueprint across desktop, tablet, and mobile widths.

**Acceptance Criteria:**
- [x] The reported text/diagram collision is validated against current code and visual behavior.
- [x] The fix is scoped to the responsive hero layout and does not refactor unrelated site sections.
- [x] Static checks and browser visual verification pass after the change.

## Current Analysis: Mobile Ideas Return Assessment

**Goal:** Evaluate the local Claude/Codex effort spent in `/Users/georgele/projects/mobile/dev/mobile-ideas`, estimate return from generated artifacts and project progress, and identify workflow changes that would improve future ROI.

**Acceptance Criteria:**
- [x] Full available Claude/Codex history is parsed for `mobile-ideas` activity.
- [x] Repository artifacts, commits, and planning outputs are inventoried.
- [x] Repeated prompts and multi-step workflow patterns are grouped with counts and examples.
- [x] Recommendations distinguish skills, agents, plugins/integrations, and standing instructions.
- [x] Final report includes highest-impact automations and a concrete next route.

**Result:** See `tasks/mobile-ideas-return-assessment.md`. Recommended next skill: `$project-fleet --plan`.

## Current Change: Remotion Pack Split

**Goal:** Move Remotion-oriented format, script, and build skills out of `creator-media` into a dedicated `remotion` pack.

**Acceptance Criteria:**
- [x] `packs/remotion` exists with mirrored Claude/Codex `youtube-format-research`, `video-script`, and `video-build` skill contracts.
- [x] `creator-media` no longer installs those Remotion production skills by default.
- [x] Creator-media handoffs point to the `remotion` pack when Remotion implementation is the next step.
- [x] Pack docs, skill references, pack normalization, and relevant tests know about `remotion`.
- [x] Focused validation passes.

**Completed:** 2026-05-04. Moved `youtube-format-research`, `video-script`, and `video-build` into the new `remotion` pack; updated creator-media docs and routing to treat them as Remotion-pack handoffs; updated public pack references, pack normalization, and layer2 video test pack names. Focused validation passed with pack list/install checks, skill version/dependency/routing audits, configured layer1 tests, targeted source scans, and `git diff --check`.

## Phase Overview

| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1 | Kanban Skill Suite | — | 6 kanban workflow skills | L |
| 2 | Proactive Board Intelligence | — | Board overview, next work suggestion, progress tracking | M |
| 3 | Board Templates | — | `--template standard` flag | S |
| 4 | Archive Automation | — | `archive-card` command + `poketo-kanban --archive` mode | M |
| 5 | Expert Review Fixes | — | 7 security/quality fixes | M |
| 6 | Testing Hardening I | tasks/ideas.md | Edge case + command test expansion (~20 new tests) | M |
| 7 | Testing Hardening II ✓ | tasks/ideas.md | Bootstrap tests, install.sh bats, DB error paths | M |
| 8 | Kanban DX ✓ | specs/board-flag-kanban-search.md, tasks/ideas.md | `--board` flag, dry-run mode, env path unification | M |
| 9 | Skill Infrastructure ✓ | tasks/ideas.md | Skill discovery, dependency graph, versioning | L |
| 10 | Headless API Migration ✓ | — | Shared Poketo app-layer kanban integration for Claude + Codex | L |
| 11 | Three-Mode Operating Model ✓ | tasks/todo.md | `claude-only`/`codex-only`/`hybrid` modes, approval packet, `/delegate`, next-step routing | XL |
| 12 | Creator Platform Evidence Foundation ✓ | specs/creator-platform-evidence-schema.md | Capability matrix + shared evidence schema skills | M |
| 13 | Creator Presence Dossier ✓ | specs/creator-platform-evidence-schema.md | Repo-backed creator career/presence dossier skill | M |
| 14 | LinkedIn Evidence Lane ✓ | specs/creator-platform-evidence-schema.md | LinkedIn export/manual evidence templates and guidance | M |
| 15 | YouTube Video Audit ✓ | user request, YouTube API/docs research | Single-video public-first audit with optional owner analytics | M |
| 16 | Mutation Contract Routing Audit ✓ | user request, tasks/lessons.md | Mutation-capable skills emit next-step routes; audit catches gaps | S |
| 17 | Mixed Monorepo Pack Routing ✓ | user request | `.agents/project.json.project_scopes` schema + pack writer preservation | S |
| 18 | Pack Lock Stale Recovery ✓ | user report | Lock owner metadata and stale-lock cleanup for pack writes | S |
| 19 | YouTube Description Optimizer ✓ | user request | Existing-video description audits, future upload drafts, and reusable metadata templates | S |
| 20 | YouTube External Video Research Skills ✓ | user request | External video context, format/Remotion-style, and competitive research skills | S |
| 21 | Quality Gate Hardening ✓ | tasks/session-workflow-quality-audit.md | Default anti-slop ship manifest, adversarial review, and validation script | M |
| 22 | Feature Interview Routing ✓ | user request, session history | Feature triage skill plus brainstorm/roadmap routing into specs or roadmap | S |
| 23 | Targeted Skill Builder ✓ | user request, tasks/lessons.md | Focused skill creation/update workflow for concrete correction patterns and capability gaps | S |
| 24 | Installer Skill ✓ | user request | Mirrored global installer skill with root install launcher and pack access guidance | S |
| 25 | Codebase Status ✓ | user request, session history | Read-only repo status reports with related conversation-history evidence | S |
| 26 | Monorepo Pack V1 ✓ | specs/monorepo-execution-controller.md | New monorepo pack with detect, run, ship, guard skills + lane-spec artifact | L |
| 27 | Analyze-Sessions Targeted Skill Retrospectives ✓ | user request | Targeted skill-performance retrospectives inside analyze-sessions | S |
| 28 | Session Triage Split ✓ | user request, Phase 27 feedback | Dedicated session-triage skill plus broad-only analyze-sessions | S |
| 29 | Live Skill Harness ✓ | user request | Opt-in live Claude/Codex behavior tests for skills | M |
| 30 | Feature Interview Evidence Intake ✓ | user request, existing feature-interview gap review | Evidence-backed feature intake with technical gotchas, journey placement, doc updates, and user priority decision | S |
| 31 | Parallel Agent Branch/PR Guard ✓ | user correction, existing agent-team workflow contracts | Agent-team lanes use separate GitHub branches and plans include consolidation/PR review | S |
| 32 | Skills Showcase Product Foundation ✓ | specs/skills-showcase-website.md, specs/ui-skills-showcase-website.md | Multi-page static shell, generated skill/GitHub proof data, stale-data validation, and skill-change freshness prompts | L |
| 33 | Skills Showcase Workflow Experience ✓ | specs/skills-showcase-website.md, specs/ui-skills-showcase-website.md | Workflow Lab animations, pack map, generated catalog, and responsive blueprint UI | L |
| 34 | Skills Showcase Distribution Launch ✓ | specs/skills-showcase-website.md, specs/ui-skills-showcase-website.md | Proof telemetry UI, newsletter capture, follow/community funnel, and Vercel launch readiness | M |
| 35 | Repository-Wide Custom Benchmark Coverage ✓ | specs/benchmark-custom-coverage.md | Custom Codex benchmark setups for all skills plus future-skill coverage enforcement | XL |
| 36 | Benchmark Output Quality Evaluation ✓ | user request | Rubric-based output-quality scoring for benchmarked skills | XL |
| 37 | Skills Showcase Next.js Preservation Refactor | specs/first-party-skills-showcase-newsletter-capture.md | Existing showcase routes/design/data ported into a minimal Next.js app | L |
| 38 | First-Party Newsletter Capture And Admin | specs/first-party-skills-showcase-newsletter-capture.md | Neon subscriber persistence, tRPC/TanStack Query capture flow, and admin export page | L |
| 39 | Benchmark Results Visibility And Safe Git Fixtures | docs/benchmark-results-matrix.md, user request | Public benchmark-results matrix plus permission-gated test-repo fixtures for `commit-and-push-by-feature` and `sync` | M |

---

## Phase 35: Repository-Wide Custom Benchmark Coverage ✓

**Goal:** Build custom Codex benchmark test setups for every repository skill and enforce benchmark setup handling for every future skill.

**Source:** `specs/benchmark-custom-coverage.md`, `specs/benchmark-custom-coverage-feature-interview.md`, and user clarification on 2026-05-11.

**Scope:**
- Add a durable benchmark coverage matrix that lists every skill under `global/` and `packs/`.
- Validate that every repository skill appears in the matrix and that custom/blocked statuses are well-formed.
- Update benchmark reporting so `$benchmark-test-skill <skill>` distinguishes custom, generic, and blocked coverage.
- Add reusable custom setup helpers for fixtures, Markdown/frontmatter assertions, routing assertions, budget tiers, and report expectations.
- Implement Codex custom benchmark setups in priority tiers, starting with high-use global execution/planning/debug skills.
- Update future skill creation/update workflows so new skills must add a benchmark setup or record an explicit blocked coverage status.
- Keep generic smoke fallback active until each skill has custom coverage.
- Defer Claude parity until the Codex-first pattern is proven.

**Acceptance Criteria:**
- [x] A committed coverage matrix lists every repository skill.
- [x] Validation fails when a repository skill is missing from the coverage matrix.
- [x] Validation fails when a `custom` coverage row points to a missing setup.
- [x] Validation fails when a `blocked` row lacks a reason and next command.
- [x] `$benchmark-test-skill <skill>` reports custom/generic/blocked coverage status.
- [x] Future skill creation/update workflows require benchmark coverage handling.
- [x] Tier 1 skills have custom Codex benchmark setups.
- [x] Tier 2 and Tier 3 skills have custom Codex benchmark setups or explicit blocked statuses.
- [x] Pack skills are covered by custom Codex benchmark setups or explicit blocked statuses.
- [x] Generic fallback remains available until all skills have custom coverage.
- [x] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for registry/harness contract, then agent-team eligible by pack or tier once the coverage matrix and file ownership boundaries are established.
**Coordination Notes:** Initial registry and validation work touches shared harness files and must be serial. Later setup implementation can split by non-overlapping setup files and fixture directories, but shared registry updates must be consolidated carefully.

> Test strategy: tests-after with focused layer1 validation plus one-run Codex benchmarks for representative setups in each tier.

### Execution Profile
**Parallel mode:** review-only
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, docs/API conformance, budget safety, no-GitHub-Actions constraint

**Subagent lanes:**
- Lane: coverage-contract-review
  - Agent: explorer
  - Role: reviewer
  - Mode: review
  - Scope: Review the planned coverage matrix, harness reporting contract, and future skill-creation contract for missing acceptance-criteria coverage after the main implementation lands.
  - Depends on: Step 35.6
  - Deliverable: Review report with blocker/advisory findings and any missing validation commands.

### Implementation
- Step 35.1: Add the committed benchmark coverage matrix and validation CLI.
  - Classification: automated
  - Files: create `tests/harness/bench-coverage.ts`, create `tests/fixtures/bench-coverage/README.md` if fixture notes are needed, modify `tests/package.json`, modify `tests/layer1/bench-setups.test.ts`
  - Define one machine-readable row per repository skill name with `skill`, `source_paths`, `coverage_status`, `setup_path`, `priority_tier`, `agent_scope`, `fixture_type`, `blocked_reason`, `next_command`, and `last_verified`.
  - Add validation that fails when a repository skill is missing from the matrix, a `custom` row points to a missing setup, a `blocked` row lacks `blocked_reason`, or a `blocked` row lacks `next_command`.
  - Keep existing repository skill discovery as the source of truth for completeness checks.
- Step 35.2: Wire coverage status into benchmark setup resolution and CLI reporting.
  - Classification: automated
  - Files: modify `tests/harness/bench-setups.ts`, modify `tests/harness/bench-types.ts`, modify `tests/bench.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Preserve generic fallback for repository skills without custom setups.
  - Make `pnpm bench --list-skills` show enough status information to distinguish `custom`, `generic`, and `blocked` coverage.
  - Make `pnpm bench --skill <skill>` print the resolved coverage status before agent execution and stop clearly for blocked coverage rows.
- Step 35.3: Add reusable custom setup helpers and fixture conventions.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/artifacts.ts`, create `tests/layer4/setup-helpers/markdown.ts`, create `tests/layer4/setup-helpers/routing.ts`, create `tests/layer4/setup-helpers/budgets.ts`, create `tests/layer4/setup-helpers/reports.ts`, modify existing `tests/layer4/setups/design-system.setup.ts`, modify existing `tests/layer4/setups/design-system-draftstonk.setup.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Provide helpers for file existence/content assertions, Markdown heading/frontmatter assertions, next-command/routing assertions, budget tiers, timeout tiers, and benchmark report expectations.
  - Refactor existing custom setups only enough to prove the helpers are usable without changing their benchmark behavior.
- Step 35.4: Add Tier 1 Codex custom benchmark setups.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/` for `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Use deterministic temp-project fixtures and assert the observable artifact, routing, or report shape for each skill without requiring real remote pushes, external accounts, or user approval.
  - Set Tier 1 rows to `custom` with `agent_scope: codex` when setup files exist.
- Step 35.5: Add Tier 2 and Tier 3 custom setups or explicit blocked statuses.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/` for Tier 2 and Tier 3 skills where deterministic local coverage is practical; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Mark any unsafe or externally blocked setup as `blocked` with a concrete `blocked_reason` and `next_command`.
  - Keep generic fallback available only for rows that are not yet custom and not blocked.
- Step 35.6: Add pack skill coverage rows and pack-level setup coverage.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/packs/`; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Cover pack skills with custom Codex setups when deterministic local fixtures exist.
  - Record explicit blocked statuses for pack skills that depend on external credentials, real browser/device state, paid services, or unsafe access patterns.
- Step 35.7: Update skill creation and update workflows to require benchmark coverage handling.
  - Classification: automated
  - Files: modify `global/codex/create-agentic-skill/SKILL.md`, `global/claude/create-agentic-skill/SKILL.md`, `global/codex/create-local-skill/SKILL.md`, `global/claude/create-local-skill/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, `global/claude/targeted-skill-builder/SKILL.md`, `global/codex/plugin-creator/SKILL.md`, `global/claude/plugin-creator/SKILL.md`, `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`, `packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md`, `docs/skills-reference.md`
  - Require new or materially updated skills to add a coverage matrix row and either a custom setup or explicit blocked status.
  - Make benchmark-test-skill reports route missing custom coverage to `$targeted-skill-builder <skill> benchmark coverage`.
- Step 35.8: Run validation and review the phase.
  - Classification: automated
  - Files: modify `tasks/todo.md`, modify `tasks/history.md`
  - Run focused layer1 tests for benchmark coverage, setup registry, report handling, and runner behavior.
  - Run coverage validation, `pnpm bench --list-skills`, and representative one-run Codex benchmarks for `run`, `plan-phase`, `benchmark-test-skill`, and one pack skill that has custom coverage.
  - Run standard skill validation scripts and `git diff --check`.
  - Use the review-only lane findings to fix concrete blockers before final validation.

### Green
- Step 35.9: Write regression tests and final validation evidence for the coverage contract.
  - Classification: automated
  - Files: modify `tests/layer1/bench-setups.test.ts`, add or modify `tests/layer1/bench-coverage.test.ts`, modify `tasks/todo.md`
  - Cover missing matrix row, missing custom setup path, blocked row without reason, blocked row without next command, custom/generic/blocked reporting, and generic fallback retention.
  - Run all phase validation commands and record exact results in the review section.

### Milestone: Phase 35 Repository-Wide Custom Benchmark Coverage
**Acceptance Criteria:**
- [x] A committed coverage matrix lists every repository skill.
- [x] Validation fails when a repository skill is missing from the coverage matrix.
- [x] Validation fails when a `custom` coverage row points to a missing setup.
- [x] Validation fails when a `blocked` row lacks a reason and next command.
- [x] `$benchmark-test-skill <skill>` reports custom/generic/blocked coverage status.
- [x] Future skill creation/update workflows require benchmark coverage handling.
- [x] Tier 1 skills have custom Codex benchmark setups.
- [x] Tier 2 and Tier 3 skills have custom Codex benchmark setups or explicit blocked statuses.
- [x] Pack skills are covered by custom Codex benchmark setups or explicit blocked statuses.
- [x] Generic fallback remains available until all skills have custom coverage.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion** (fill in when phase is done):
- Deviations from plan: Review-only subagent lane was replaced with local adversarial review because active Codex subagent instructions require explicit user authorization for subagents. Validation also refreshed stale generated Skills Showcase proof data found by the freshness check.
- Tech debt / follow-ups: Claude parity remains intentionally deferred. Blocked benchmark rows still need deterministic dry-run fixture design before they can move to custom coverage.
- Ready for next phase: Yes. Phase 35 is complete and archived to `tasks/phases/phase-35.md`.

---

## Phase 36: Benchmark Output Quality Evaluation ✓

**Goal:** Add output-quality evaluation to the benchmark harness so skill benchmarks measure not only contract compliance and artifact shape, but also whether generated outputs are specific, evidence-linked, useful, and free of hallucinated or generic content.

**Source:** User request on 2026-05-11 after reviewing benchmark setup coverage and identifying that current checks are mostly deterministic contract assertions rather than semantic quality evaluation.

**Scope:**
- Extend benchmark result types, reports, and persistence to include optional quality scores alongside existing pass/fail assertions.
- Add reusable quality-evaluation primitives: rubric criteria, weighted scoring, critical-failure handling, fixture fact coverage, reference-trait comparison, and hallucination/overreach checks.
- Define baseline quality rubrics for Tier 1 workflow skills first, then work through Tier 2/Tier 3 global skills and pack skills by priority.
- Keep hard contract assertions as mandatory gates; quality scoring must augment them, not replace them.
- Add evaluator tests using both high-quality and intentionally degraded outputs so the quality layer proves it can reject vague, generic, or fabricated answers.
- Update `$benchmark-test-skill` reporting language to distinguish hard assertion pass rate from output-quality score.
- Update future skill creation/update workflows so new or materially changed benchmark setups include a quality rubric when deterministic quality signals are practical, or record why quality scoring is blocked.

**Non-Goals:**
- Do not make LLM-as-judge mandatory for every skill in the first pass.
- Do not require exact golden-output matching where multiple good answers are valid.
- Do not create, modify, or suggest GitHub Actions.
- Do not remove existing custom setup assertions or blocked coverage semantics.

**Acceptance Criteria:**
- [x] Benchmark reports include quality score summaries when a setup defines a quality evaluator.
- [x] The harness supports weighted rubric criteria, critical criteria, evaluator notes, and minimum score thresholds.
- [x] Quality evaluator tests prove that strong fixture outputs pass and degraded/generic/hallucinated outputs fail.
- [x] Tier 1 workflow skills have quality rubrics and evaluator coverage.
- [x] Tier 2/Tier 3 global skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] Pack skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] `$benchmark-test-skill <skill>` reports hard pass rate separately from quality score.
- [x] Future skill creation/update workflows require benchmark quality-rubric handling where practical.
- [x] Representative one-run Codex benchmarks produce quality-scored reports for at least `run`, `investigate`, `design-system`, and one pack skill.
- [x] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for harness schema/report changes, then agent-team eligible by setup family or pack once evaluator interfaces are stable.
**Coordination Notes:** Shared harness files and report schemas must land before per-skill rubrics. Per-skill rubric work can split by non-overlapping setup files, but registry/report integration needs one consolidation pass.

> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high for harness/report files; medium for setup-only rubric work
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Tests First
- Step 36.1: Write failing quality-evaluator and report tests for this phase's acceptance criteria.
  - Classification: automated
  - Files: create `tests/layer1/bench-quality.test.ts`, modify `tests/layer1/bench-report.test.ts`, modify `tests/layer1/bench-setups.test.ts`, add fixtures under `tests/fixtures/bench-quality/`
  - Add red tests for weighted rubric aggregation, minimum thresholds, critical criterion failure, evaluator notes, strong fixture output passing, generic/degraded fixture output failing, hallucinated fixture output failing, report summaries separating hard assertion pass rate from quality score, and setup registry behavior for skills with and without evaluators.
  - Tests must prove backward compatibility for setups that only define hard assertions and must keep infrastructure-blocked runs out of quality statistics.

### Implementation
- Step 36.2: Add benchmark quality types and scoring primitives.
  - Classification: automated
  - Files: modify `tests/harness/bench-types.ts`, create `tests/harness/bench-quality.ts`, modify `tests/harness/bench-setups.ts` if setup metadata needs evaluator discovery
  - Define rubric criteria with `id`, `description`, `weight`, optional `critical`, per-criterion score, evaluator notes, minimum score thresholds, and result summaries.
  - Add helper APIs for weighted scoring, critical-failure handling, threshold evaluation, required fact coverage, forbidden fabrication checks, concrete file/command reference checks, specificity checks, and reference-trait comparison.
- Step 36.3: Persist and report quality results.
  - Classification: automated
  - Files: modify `tests/harness/bench-runner.ts`, modify `tests/harness/bench-report.ts`, modify `tests/harness/bench-persistence.ts` if needed, modify `tests/layer1/bench-report.test.ts`
  - Record quality evaluations per run and summarize average score, threshold failures, critical failures, and lowest-scoring criteria in `report.json` and `report.md`.
  - Preserve existing hard assertion pass/fail behavior and label quality scoring as an additional output-quality signal.
  - Keep infrastructure-blocked runs out of evaluated quality statistics.
- Step 36.4: Add reusable setup-facing quality helpers and degraded-output fixtures.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/quality.ts`, create fixtures under `tests/fixtures/bench-quality/`, modify focused layer1 tests
  - Add helpers for required fact coverage, forbidden fabrication, concrete file/command references, specificity checks, reference-trait checks, and rubric aggregation.
  - Include intentionally vague, generic, and hallucinated outputs that must fail quality thresholds.
- Step 36.5: Add Tier 1 workflow quality rubrics.
  - Classification: automated
  - Files: modify `tests/layer4/setups/tier1-workflows.setup.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Cover `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`.
  - Assert skill-specific quality such as evidence linkage, concrete next action, scope control, validation specificity, root-cause specificity, and no fabricated fixture facts.
- Step 36.6: Add quality rubrics for high-signal global and design-system setups.
  - Classification: automated
  - Files: modify `tests/layer4/setups/design-system.setup.ts`, modify `tests/layer4/setups/design-system-draftstonk.setup.ts`, modify `tests/layer4/setups/tier23-global-workflows.setup.ts`, modify focused layer1 tests
  - Prioritize deterministic signals for planning, debugging, audit, research, and design-token outputs.
  - Record deferred notes for skills whose quality cannot be scored reliably without external state or human judgment.
- Step 36.7: Add pack-skill quality rubrics by family.
  - Classification: automated
  - Files: modify `tests/layer4/setups/packs/pack-workflows.setup.ts`, modify focused layer1 tests
  - Group rubrics by pack family where possible: creator-media, business-ops, game, devtool, monorepo, kanban, project-fleet, remotion.
  - Test that pack outputs include pack/skill context, fixture evidence, practical risks, and non-generic next routes.
- Step 36.8: Update skill workflows and benchmark command docs.
  - Classification: automated
  - Files: modify mirrored skill creation/update workflows, modify `packs/agentic-skills-bench/*/benchmark-test-skill/SKILL.md`, modify `docs/skills-reference.md` if needed
  - Require future benchmark setup work to consider quality rubrics, not only hard assertions.
  - Teach benchmark reports to explain hard pass rate versus quality score without overstating statistical certainty.

### Green
- Step 36.9: Run tests, representative benchmarks, and phase review.
  - Classification: automated
  - Files: modify `tasks/todo.md`, modify `tasks/history.md`
  - Run focused quality/evaluator tests, setup registry tests, report tests, benchmark coverage validation, `pnpm bench --list-skills`, representative one-run Codex benchmarks with quality scoring, standard skill audits, and `git diff --check`.
  - Representative one-run Codex benchmarks must include at least `run`, `investigate`, `design-system`, and one pack skill.
  - Perform only concrete cleanup found by validation.

### Milestone: Phase 36 Benchmark Output Quality Evaluation
**Acceptance Criteria:**
- [x] Benchmark reports include quality score summaries when a setup defines a quality evaluator.
- [x] The harness supports weighted rubric criteria, critical criteria, evaluator notes, and minimum score thresholds.
- [x] Quality evaluator tests prove that strong fixture outputs pass and degraded/generic/hallucinated outputs fail.
- [x] Tier 1 workflow skills have quality rubrics and evaluator coverage.
- [x] Tier 2/Tier 3 global skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] Pack skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] `$benchmark-test-skill <skill>` reports hard pass rate separately from quality score.
- [x] Future skill creation/update workflows require benchmark quality-rubric handling where practical.
- [x] Representative one-run Codex benchmarks produce quality-scored reports for at least `run`, `investigate`, `design-system`, and one pack skill.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: Validation exposed one over-specific `investigate` benchmark assertion that required the literal `$exec` route even though the fixture asks for a diagnostic report and concrete next command without source edits. The setup now requires an actionable next-command handoff but does not force `$exec` for this diagnostic-only fixture.
- Tech debt / follow-ups: None for Phase 36. Representative one-run samples passed with quality scores for `run`, `investigate`, `design-system`, and `exec-kanban`; broader multi-run statistical confidence remains outside this phase's scope.
- Ready for next phase: Yes. The current roadmap queue is complete; route next work through discovery.

---

## Phase 37: Skills Showcase Next.js Preservation Refactor ✓

**Goal:** Preserve the existing Skills Showcase website while migrating it from static HTML/CSS/JS under `docs/skills-showcase/` into a minimal Next.js app that can support first-party newsletter capture in the following phase.

**Source:** `specs/first-party-skills-showcase-newsletter-capture.md` and user clarification on 2026-05-11 to split the work into a Next.js refactor phase followed by the Neon capture/admin phase.

**Result:** Completed on 2026-05-12. All 8 steps executed (37.1–37.8). Next.js app at `apps/skills-showcase/` renders 6 public routes with preserved Swiss grid/blueprint visual system, generated data pipeline, and 54 regression tests. Old static site files retired. Deploy contract updated for Next.js. Phase archived to `tasks/phases/phase-37.md`.

---

## Phase 38: First-Party Newsletter Capture And Admin ✓

**Goal:** Add first-party newsletter capture to the app-enabled Skills Showcase using Neon persistence, tRPC contracts, TanStack Query client state, and a protected admin export page.

**Source:** `specs/first-party-skills-showcase-newsletter-capture.md` and `specs/first-party-skills-showcase-newsletter-capture-interview.md`.

**Scope:**
- Add Neon schema and database access for newsletter subscribers.
- Add tRPC contracts for subscribing, admin login/session validation, subscriber listing, and subscriber export.
- Use TanStack Query for public subscribe mutation state and admin list/export state.
- Update `/follow` so the newsletter form submits to first-party capture instead of static/provider-backed capture.
- Add `/admin/newsletter` protected by a Vercel-configured shared admin secret.
- Support subscriber search, copy-all active emails, and CSV download for use in an external newsletter app or email client.
- Preserve privacy posture by storing email, status, source page, consent text version, and timestamps only.

**Non-Goals:**
- Do not implement newsletter sending.
- Do not add a full auth provider or user accounts.
- Do not store raw IP addresses, raw user-agent strings, or visitor-tracking analytics.
- Do not add admin edit/delete/status-management unless a narrow implementation need appears.
- Do not create or modify GitHub Actions.

**Acceptance Criteria:**
- [ ] `/follow` submits valid email addresses through a first-party tRPC mutation.
- [ ] Neon stores subscriber records with `email`, `status`, `source_page`, `consent_text_version`, `created_at`, and `updated_at`.
- [ ] Duplicate signup behavior is idempotent.
- [ ] Invalid emails and database failures produce appropriate public UI states without leaking internals.
- [ ] `/admin/newsletter` requires the configured admin secret.
- [ ] Admin can list, search, copy active emails, and download CSV.
- [ ] Subscriber data is never exposed in generated public assets or committed files.
- [ ] Local app validation, database-contract checks, admin access checks, and whitespace checks pass.
- [ ] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial
**Coordination Notes:** This phase crosses database schema, API contracts, client mutation state, admin access, and privacy behavior. Keep serial until the app/data contract is stable; review security/privacy before shipping.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, security, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 38.1: Add Phase 38 dependencies and configure environment
  - Files: modify `apps/skills-showcase/package.json`, create `apps/skills-showcase/.env.example`, modify `apps/skills-showcase/next.config.mjs`
  - Add `@trpc/server`, `@trpc/client`, `@trpc/react-query` (11.17.0), `@tanstack/react-query` (5.x), `@neondatabase/serverless` (1.x), `zod` (4.x). Update `next.config.mjs` to remove any static export assumption. Create `.env.example` with `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` placeholders.
- Step 38.2: Create database schema, connection module, and migration SQL
  - Files: create `apps/skills-showcase/src/db/index.ts`, create `apps/skills-showcase/src/db/schema.ts`, create `apps/skills-showcase/src/db/migrate.sql`
  - Use `@neondatabase/serverless` with `DATABASE_URL` from env. Define `newsletter_subscribers` table with `id` (serial PK), `email` (unique, not null), `status` (default `active`), `source_page`, `consent_text_version`, `created_at`, `updated_at`. Create idempotent migration SQL. Export typed query helpers.
- Step 38.3: Set up tRPC server with newsletter router
  - Files: create `apps/skills-showcase/src/trpc/init.ts`, create `apps/skills-showcase/src/trpc/router.ts`, create `apps/skills-showcase/src/trpc/newsletter.ts`, create `apps/skills-showcase/app/api/trpc/[trpc]/route.ts`
  - Create tRPC context (with admin secret check), base router, and newsletter sub-router. Procedures: `subscribe` (public mutation — validate email with Zod, upsert into Neon, idempotent), `adminLogin` (mutation — verify secret, set session cookie), `adminList` (protected query — list/search subscribers), `adminExport` (protected query — CSV-formatted subscriber dump). Wire to Next.js App Router catch-all API route.
- Step 38.4: Set up tRPC client, TanStack Query provider, and layout integration
  - Files: create `apps/skills-showcase/src/trpc/client.ts`, create `apps/skills-showcase/src/trpc/provider.tsx`, modify `apps/skills-showcase/app/layout.tsx`
  - Create tRPC-React client binding with TanStack Query. Create a `"use client"` provider component wrapping `QueryClientProvider` and `trpc.Provider`. Add to root layout around `{children}`.
- Step 38.5: Refactor newsletter form to use tRPC subscribe mutation
  - Files: modify `apps/skills-showcase/src/showcase/newsletter-form.tsx`, modify `apps/skills-showcase/app/follow/page.tsx`
  - Replace the imperative `fetch` + `data-provider-endpoint` logic with a tRPC `newsletter.subscribe` mutation via TanStack Query. Preserve the state machine (ready, invalid-email, pending, success, error), ARIA attributes, and visual states. Remove the `provider-missing` state since the endpoint is now first-party. Remove the `data-provider-endpoint` attribute and related HTML notes from the follow page. Add `source_page` and `consent_text_version` to the mutation payload.
- Step 38.6: Create admin newsletter page with secret-based auth gate
  - Files: create `apps/skills-showcase/app/admin/newsletter/page.tsx`, create `apps/skills-showcase/src/showcase/admin-newsletter.tsx`
  - Build `/admin/newsletter` with a login gate (prompt for admin secret, call `adminLogin` mutation). After auth: subscriber list table with search input, copy-all-active-emails button, CSV download button. Use tRPC `adminList` and `adminExport` queries. Style consistently with the showcase blueprint system.
- Step 38.7: Update deploy contract, routes, and documentation
  - Files: modify `tasks/deploy.md`, modify `apps/skills-showcase/src/showcase/routes.ts`, modify `apps/skills-showcase/README.md`
  - Update deploy contract: remove "static export" / "no runtime API" / "no database" language, add Neon `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` env var requirements, note server-side deployment. Add `/admin/newsletter` to routes.ts. Update README with new local dev setup (env vars, database).

### Green
- Step 38.8: Write regression tests covering newsletter capture and admin behavior
  - Files: create or modify test files under `apps/skills-showcase/src/`
  - Cover: subscribe mutation validation (valid email, invalid email, idempotent duplicate), newsletter form UI states (ready, invalid-email, pending, success, error — no more provider-missing), admin auth gate (reject without secret, accept with correct secret), admin list/search/export rendering, privacy (no subscriber data in generated assets).
- Step 38.9: Run local app validation, database-contract checks, and whitespace checks; fix only concrete issues found by validation
  - Files: modify only files implicated by failing validation
  - Run typecheck, build, tests, showcase data validation, `git diff --check`.

### Milestone: Phase 38 First-Party Newsletter Capture And Admin ✓
**Acceptance Criteria:**
- [x] `/follow` submits valid email addresses through a first-party tRPC mutation.
- [x] Neon stores subscriber records with `email`, `status`, `source_page`, `consent_text_version`, `created_at`, and `updated_at`.
- [x] Duplicate signup behavior is idempotent.
- [x] Invalid emails and database failures produce appropriate public UI states without leaking internals.
- [x] `/admin/newsletter` requires the configured admin secret.
- [x] Admin can list, search, copy active emails, and download CSV.
- [x] Subscriber data is never exposed in generated public assets or committed files.
- [x] Local app validation, database-contract checks, admin access checks, and whitespace checks pass.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: DB uses uuid for id instead of serial; 74 tests total. No other deviations.
- Tech debt / follow-ups: Vercel deploy not yet configured (manual). Admin does not support edit/delete/status-management per non-goals.
- Ready for next phase: yes

---

## Phase 39: Benchmark Results Visibility And Safe Git Fixtures ✓

**Goal:** Make already-benchmarked skills visible as a durable results matrix and unblock safe integration benchmark setups for git-mutating workflows that can run against disposable test repositories.

**Source:** User request on 2026-05-11 and `docs/benchmark-results-matrix.md`.

**Scope:**
- Promote `docs/benchmark-results-matrix.md` into a generated or validated source of truth for persisted benchmark run data and grades.
- Add a Skills Showcase surface for benchmark results that distinguishes setup coverage from completed benchmark evidence and grades.
- Design permission-gated, disposable GitHub test-repository fixtures for `commit-and-push-by-feature` and `sync`.
- Require explicit user approval before any `gh` operation that creates, mutates, or deletes a live GitHub test repository.
- Treat test-repo cleanup failures as infrastructure-blocked evidence, not skill failures.

**Non-Goals:**
- Do not run live GitHub repository creation without explicit user permission.
- Do not run git-mutating benchmarks against the primary `agentic-skills` repository.
- Do not create, modify, or recommend GitHub Actions.

**Acceptance Criteria:**
- [x] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [x] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [x] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [x] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [x] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for live-GitHub fixture design and validation.
**Coordination Notes:** Keep this work serial because it touches benchmark evidence semantics, website presentation, and live external repository safety. Treat any `gh`-backed execution as an explicit operator-approved integration test.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, data contract, security

**Subagent lanes:** none

### Implementation
- Step 39.1: Validate and promote `docs/benchmark-results-matrix.md` as a generated source of truth.
  - Classification: automated
  - Files: modify `scripts/generate-skills-showcase-data.mjs` (add matrix generation/validation logic), modify `docs/benchmark-results-matrix.md` (regenerate from persisted benchmark reports), modify `scripts/validate-skills-showcase-data.sh` (add matrix freshness check)
  - Parse persisted `benchmark/test-*.md` reports to extract skill name, date, agent, hard pass rate, quality score, subjective review grade (when present), and raw report path.
  - Generate a clean Markdown matrix table in `docs/benchmark-results-matrix.md` from the parsed data, replacing the hand-maintained content with generated output.
  - Add a freshness validation step to `scripts/validate-skills-showcase-data.sh` that fails when the matrix is stale relative to benchmark reports.
- Step 39.2: Add benchmark results surface to Skills Showcase UI.
  - Classification: automated
  - Files: modify `apps/skills-showcase/app/catalog/page.tsx` or add `apps/skills-showcase/app/benchmarks/page.tsx` (benchmark results display), modify `apps/skills-showcase/src/showcase/catalog.tsx` (add benchmark evidence rendering to skill rows if using catalog), modify `apps/skills-showcase/public/assets/skills-data.js` (regenerated)
  - Render benchmark evidence data already attached to skills in `skills-data.js` (the `benchmarkEvidence` field on 6+ skills).
  - Distinguish "has benchmark coverage setup" from "has completed graded benchmark results" in the UI.
  - Show per-agent pass rates, quality scores, and link to raw report paths.
  - Regenerate showcase data and validate.
- Step 39.3: Design safe disposable GitHub test-repository fixture infrastructure.
  - Classification: automated
  - Files: create `docs/safe-git-benchmark-fixtures.md` (design doc), create `tests/layer4/helpers/disposable-repo.ts` (fixture helper)
  - Document the permission-gated disposable repository workflow: explicit user approval before `gh repo create`, `gh repo delete`, or any mutation of a live GitHub test repository.
  - Document cleanup handling: cleanup failures are infrastructure-blocked evidence, not skill failures.
  - Implement a reusable fixture helper that creates a temporary GitHub repo via `gh`, clones it locally, and provides cleanup — all gated behind explicit confirmation.
- Step 39.4: Add `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-commit-and-push.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo, stage mixed changes across multiple files, run `commit-and-push-by-feature`, verify commits are grouped by feature with conventional messages.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.
- Step 39.5: Add `sync` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-sync.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo with upstream changes, run `sync`, verify pull/rebase behavior and stash handling.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.

### Green
- Step 39.6: Write regression tests covering acceptance criteria.
  - Classification: automated
  - Files: create or modify `tests/layer1/benchmark-results-matrix.test.ts` (matrix generation/validation tests), modify existing layer1 test files as needed
  - Test matrix generation from fixture benchmark reports.
  - Test freshness validation catches stale matrix.
  - Test that showcase data includes `benchmarkEvidence` for graded skills.
  - Test that coverage registry entries for `commit-and-push-by-feature` and `sync` reflect custom coverage.
- Step 39.7: Run all tests, verify they pass, and validate the phase.
  - Classification: automated
  - Files: modify `tasks/todo.md` (review section)
  - Run `pnpm --dir tests test` for layer1 regression.
  - Run `scripts/validate-skills-showcase-data.sh` for showcase freshness.
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Verify all acceptance criteria.

### Milestone: Phase 39 Benchmark Results Visibility And Safe Git Fixtures
**Acceptance Criteria:**
- [x] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [x] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [x] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [x] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

---

## Phase 32: Skills Showcase Product Foundation ✓

**Goal:** Establish the static product foundation for the showcase: multi-page routing, shared blueprint visual system, generated source data, generated GitHub/open-source proof data, and the freshness contract that makes future skill changes update the website when relevant.

**Source:** `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, and 2026-05-07 roadmap clarification that the MVP should be a multi-phase product with static routes, GitHub/open-source proof telemetry, newsletter/email capture, and no live LexCorp metrics.

**Scope:**
- Scaffold `docs/skills-showcase/` as a multi-page static website with direct-reloadable routes for home, workflows, packs, catalog, inspect, and follow.
- Add shared HTML/CSS/JS foundations for the Swiss grid and blueprint motif without introducing a runtime framework or root dependency requirement.
- Add generated skill catalog data from every tracked `SKILL.md` under `global/` and `packs/`.
- Add generated GitHub/open-source proof data from public GitHub/local git evidence with deterministic fallback behavior.
- Add validation that fails when generated showcase data is stale after source changes.
- Update skill-changing workflow contracts so agents regenerate the site data and review curated showcase copy/animations when skill behavior changes.

**Acceptance Criteria:**
- [x] Static route entrypoints exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- [x] Shared styles and scripts provide the responsive Swiss grid/blueprint foundation without one-off page styling.
- [x] `scripts/generate-skills-showcase-data.mjs` writes committed generated data covering every tracked source skill.
- [x] `scripts/generate-skills-showcase-github-data.mjs` writes committed proof data or an honest fallback without requiring secrets.
- [x] `scripts/validate-skills-showcase-data.sh` fails when generated showcase data is stale.
- [x] Skill-changing contracts prompt regeneration and curated website review when `SKILL.md` behavior or metadata changes.
- [x] Focused validation passes without adding a database, video, Remotion, runtime API, GitHub Actions, or unnecessary root dependencies.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this phase edits shared static site foundations, generated data contracts, validation scripts, and skill mutation contracts that must agree on one freshness model.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** data contract, static-route behavior, skill-contract consistency, validation freshness

**Subagent lanes:** none

### Implementation
- Step 32.1: Scaffold the multi-page static shell and shared blueprint foundation.
  - Files: add `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`
- Step 32.2: Add generated skill catalog data.
  - Files: add `scripts/generate-skills-showcase-data.mjs`, add generated `docs/skills-showcase/assets/skills-data.js`
- Step 32.3: Add generated GitHub/open-source proof data.
  - Files: add `scripts/generate-skills-showcase-github-data.mjs`, add generated `docs/skills-showcase/assets/github-proof-data.js`
- Step 32.4: Add stale-data validation and tests.
  - Files: add `scripts/validate-skills-showcase-data.sh`, add `tests/layer1/skills-showcase-data.test.ts` if script-level coverage is needed
- Step 32.5: Update skill mutation contracts to maintain the website after skill changes.
  - Files: modify `global/codex/create-agentic-skill/SKILL.md`, `global/claude/create-agentic-skill/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, `global/claude/targeted-skill-builder/SKILL.md`, `global/codex/exec/SKILL.md`, `global/claude/exec/SKILL.md`, `global/codex/ship/SKILL.md`, `global/claude/ship/SKILL.md`, `docs/skills-reference.md`
- Step 32.6: Validate and record the phase.
  - Files: modify `tasks/todo.md`, `tasks/history.md`

### Milestone: Phase 32 Product Foundation
**Acceptance Criteria:**
- [x] Static route entrypoints exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- [x] Shared styles and scripts provide the responsive Swiss grid/blueprint foundation without one-off page styling.
- [x] `scripts/generate-skills-showcase-data.mjs` writes committed generated data covering every tracked source skill.
- [x] `scripts/generate-skills-showcase-github-data.mjs` writes committed proof data or an honest fallback without requiring secrets.
- [x] `scripts/validate-skills-showcase-data.sh` fails when generated showcase data is stale.
- [x] Skill-changing contracts prompt regeneration and curated website review when `SKILL.md` behavior or metadata changes.
- [x] Focused validation passes without adding a database, video, Remotion, runtime API, GitHub Actions, or unnecessary root dependencies.

**On Completion**
- Deviations from plan: Added deterministic generated-data freshness behavior and a dedicated `scripts/validate-skills-showcase-data.sh` gate so generated assets do not drift after shipping commits. Did not add a Vitest fixture for the validator because direct shell stale/fresh validation covered the contract more directly.
- Tech debt / follow-ups: Phase 33 should avoid treating `generatedAt` as a wall-clock timestamp and should run browser responsive/screenshot checks for generated catalog, workflow, pack, and proof UI. Curated website copy review remains operator-driven until Phase 33 structures more of the public-facing data.
- Ready for next phase: yes

## Phase 33: Skills Showcase Workflow Experience ✓

**Goal:** Build the user-facing product experience on top of the foundation: animated workflow explanations, pack map, generated catalog interactions, and accessible responsive page behavior.

**Source:** `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`.

**Scope:**
- Implement the homepage previews and full workflow, pack, catalog, and inspect route experiences.
- Build browser-native animations for the eight curated workflows: first successful cycle, pack selection, plan -> run -> ship, spec -> roadmap -> implementation, research chains, hybrid handoff, skill authoring, and validation/troubleshooting.
- Implement the pack map, project-type highlighter, generated catalog search/filter/expand controls, and proof receipt links.
- Honor reduced-motion, keyboard, focus, and mobile layout requirements.
- Keep all factual counts and skill claims tied to generated data or clearly marked static receipts.

**Acceptance Criteria:**
- [x] Every curated workflow has selectable text, steps, artifacts, and a non-video browser-native animation or static reduced-motion fallback.
- [x] Pack map distinguishes global core, packs, overlays, and compatibility aliases with usable mobile behavior.
- [x] Catalog search, filtering, result counts, asymmetry labels, and expandable rows work against generated skill data.
- [x] Inspect/proof UI links to public GitHub receipts and validation artifacts.
- [x] Desktop, tablet, and mobile layouts avoid overlap and meet the UI spec's accessibility states.
- [x] Focused frontend and data validation passes.

**Parallelization:** serial
**Coordination Notes:** Keep serial unless Phase 32 later creates stable file boundaries for independent UI lanes. The interaction model, shared CSS, data contracts, and responsive states are coupled enough for one integration owner in V1.

> Test strategy: tests-after

**On Completion**
- Deviations from plan: Kept the implementation static and dependency-free; catalog pack links remain navigable anchors rather than hash-driven filters because generated search/filter/count/expand behavior satisfied the Phase 33 acceptance criteria.
- Tech debt / follow-ups: Phase 34 should add launch/follow conversion behavior, newsletter/provider fallback states, Vercel deployment guidance, and final deployed-route checks. A future catalog improvement can read `#pack-*` hashes into filters.
- Ready for next phase: yes

## Phase 34: Skills Showcase Distribution Launch ✓

**Goal:** Finish the top-of-funnel launch surface: G/LexCorp/community conversion paths, newsletter/email capture, GitHub/open-source proof telemetry presentation, deployment guidance, and final launch validation.

**Source:** `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, and the user's 2026-05-07 launch-scope clarification.

**Scope:**
- Build the follow/about route with G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter/email capture CTAs.
- Integrate provider-backed static newsletter/email capture with provider-missing, pending, success, error, and invalid-email states.
- Present generated GitHub/open-source proof data honestly without implying live LexCorp metrics.
- Add deployment notes for Vercel static hosting and manual launch checks.
- Run final local/browser/static validation and document launch readiness.

**Acceptance Criteria:**
- [x] Follow/about route converts proof interest into G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter actions.
- [x] Newsletter/email capture works with a configured provider endpoint or clearly degrades to a non-collecting fallback.
- [x] GitHub/open-source proof telemetry is visible and does not claim live LexCorp product metrics.
- [x] Vercel static deployment instructions and manual launch tasks are current.
- [x] Final validation covers generated data freshness, responsive UI, accessibility/reduced-motion behavior, links, and static-route reloads.

**Parallelization:** serial
**Coordination Notes:** Keep serial because final launch readiness crosses copy, proof claims, email capture behavior, deployment instructions, and QA evidence.

**Manual Tasks:**
- Configure the static newsletter/email provider endpoint for the launch form after the source form contract exists.
- Configure the Vercel project to deploy `docs/skills-showcase/` and verify the deployed static routes after local validation passes.

> Test strategy: tests-after

## Phase 31: Parallel Agent Branch/PR Guard ✓

**Goal:** Make the branch policy explicit across parallel agent-team skills: sequential work still lands directly on `main`/`master`, but parallel agent-team write lanes must work on separate GitHub branches and pass a consolidation/PR review gate before final integration.

**Source:** User correction on 2026-05-07 that agent teams working in parallel need branch isolation and that planning must include consolidation/PR review.

**Scope:**
- Update root guidance in `AGENTS.md` and `CLAUDE.md` to add a narrow branch exception for agent-team parallel write lanes.
- Update mirrored `plan-phase` contracts so `agent-team` execution profiles include branch names and an explicit consolidation/PR review step.
- Update `run` and monorepo parallel skills so write lanes create/use separate GitHub branches, return commit/PR evidence, and stop when PR review cannot happen.
- Update monorepo docs and lessons so the branch/PR lifecycle is discoverable and repeatable.

**Acceptance Criteria:**
- [x] Sequential/direct work still defaults to committing and pushing on `main` or `master`.
- [x] Agent-team write lanes require separate GitHub branches with deterministic names.
- [x] Agent-team lane deliverables include branch, commit SHA, validation evidence, and PR URL or an explicit blocker.
- [x] Agent-team planning includes a consolidation/PR review step after parallel lanes and before final validation/shipping.
- [x] Monorepo lane-spec guidance carries the same branch/PR requirements.
- [x] Validation passes with targeted scans, skill metadata/routing checks, tests, and whitespace checks.

**Parallelization:** serial
**Coordination Notes:** Keep this update serial because it edits shared workflow contracts and task docs. Do not create a feature branch for this sequential repository update; the branch exception being added applies to future parallel agent-team lanes.

> Test strategy: none

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** docs/API conformance, workflow-policy consistency

**Subagent lanes:** none

### Implementation
- Step 31.1: Update task planning and lessons for the branch/PR correction.
  - Files: modify `tasks/roadmap.md`, `tasks/todo.md`, `tasks/lessons.md`
- Step 31.2: Update root agent guidance and mirrored planning contracts.
  - Files: modify `AGENTS.md`, `CLAUDE.md`, `global/codex/plan-phase/SKILL.md`, `global/claude/plan-phase/SKILL.md`
- Step 31.3: Update execution and monorepo parallel contracts.
  - Files: modify `global/codex/exec/SKILL.md`, `global/claude/exec/SKILL.md`, `global/codex/mono-plan/SKILL.md`, `global/claude/mono-plan/SKILL.md`, `packs/monorepo/codex/mono-exec/SKILL.md`, `packs/monorepo/claude/mono-exec/SKILL.md`, `docs/skills-reference.md`
- Step 31.4: Validate focused behavior and ship.
  - Files: modify `tasks/todo.md`, `tasks/history.md`

### Milestone: Phase 31 Branch/PR Guard
**Acceptance Criteria:**
- [x] Sequential/direct work still defaults to committing and pushing on `main` or `master`.
- [x] Agent-team write lanes require separate GitHub branches with deterministic names.
- [x] Agent-team lane deliverables include branch, commit SHA, validation evidence, and PR URL or an explicit blocker.
- [x] Agent-team planning includes a consolidation/PR review step after parallel lanes and before final validation/shipping.
- [x] Monorepo lane-spec guidance carries the same branch/PR requirements.
- [x] Validation passes with targeted scans, skill metadata/routing checks, tests, and whitespace checks.

**On Completion** (fill in when phase is done):
- Deviations from plan: Updated `provision-agentic-config`, branch-lifecycle, mono-guard, mono-ship, README, and quality docs in addition to the initial file list so generated guidance and downstream validation would not drift.
- Tech debt / follow-ups: none
- Ready for next phase: yes

---

## Phase 30: Feature Interview Evidence Intake ✓

**Goal:** Enhance the existing mirrored `feature-interview` skill so impromptu feature ideas receive a deep evidence pass, technical gotcha analysis, user-story/journey placement, durable documentation updates, and a user-confirmed prioritization decision before they enter the roadmap or active todo queue.

**Source:** User request on 2026-05-06 after evaluating the desired "impromptu feature creation" workflow against the existing `feature-interview`, `spec-interview`, `investigate`, and `roadmap` skill contracts.

**Scope:**
- Preserve `feature-interview` as the existing intake command rather than adding a duplicate feature-creation skill.
- Add an investigate-style evidence pass that validates user claims and feature assumptions against code, docs, task state, research artifacts, and git history where relevant.
- Require a technical gotchas report covering architecture, data model, API/contracts, migrations, security/privacy, performance, observability, tests, rollout, and external dependency risk.
- Require explicit placement in the user story, journey map, or developer workflow; update or queue updates to journey/research docs when the feature changes the known journey.
- Clarify documentation destinations: new spec, existing spec patch, research/journey patch, roadmap/task-only update, interview log only, or no action.
- Add a user-confirmed prioritization gate before updating `tasks/roadmap.md`, `tasks/todo.md`, `tasks/record-todo.md`, or `tasks/manual-todo.md`.
- Mirror the updated behavior for Claude and Codex while preserving command-prefix differences.

**Acceptance Criteria:**
- [x] `global/codex/feature-interview/SKILL.md` requires evidence-backed claim validation and technical gotcha discovery before deep user interrogation.
- [x] `global/claude/feature-interview/SKILL.md` mirrors the same workflow with Claude command prefixes.
- [x] Both skills require a journey/user-story placement decision and document when research or journey artifacts need updates.
- [x] Both skills require user-confirmed prioritization before roadmap or todo mutation.
- [x] Deliverables include a durable leave-behind with evidence, gotchas, journey placement, documentation changes, priority decision, and exact next command.
- [x] Validation passes with mirrored contract scans, dependency/version/routing checks, layer1 tests, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches mirrored global planning contracts and task docs. Do not create a new skill name unless the user explicitly changes the direction.

**Completed:** 2026-05-06. Updated mirrored Claude/Codex `feature-interview` contracts to require an evidence-backed intake pass, claim validation, technical gotcha discovery, journey/workflow placement, documentation destination selection, and user-confirmed prioritization before roadmap or task mutation. Refreshed Codex metadata and discovery descriptions. Validation passed with stale-text scans, dependency/version/routing audits, pack-routing audit, layer1 tests, and `git diff --check`.

---

## Phase 25: Codebase Status ✓

**Goal:** Add a read-only status skill for "what is this repo/app, where did we leave it, and what work is outstanding?" requests.

**Source:** User request to create a skill that explores a codebase, finds conversation history related to the directory/repo, and reports application status and outstanding work; full-history scan found 181 authored roadmap mentions and 111 roadmap/repo status-audit prompts after filtering injected skill/instruction payloads.

**Scope:**
- Add mirrored Claude/Codex `codebase-status` skills.
- Add Codex OpenAI agent metadata.
- Distinguish `codebase-status` from `roadmap`: status synthesis and conversation-history evidence versus task pipeline queue maintenance.
- Update discovery docs and skill catalog mappings.

**Acceptance Criteria:**
- [x] `global/codex/codebase-status/SKILL.md` and `global/claude/codebase-status/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/codebase-status/agents/openai.yaml`.
- [x] Skill workflow reads repo orientation, task docs, git evidence, code health signals, and full local Claude/Codex prompt history filtered to the target repo.
- [x] Output requires overview, history signal, recent work, current status, outstanding work, risks/drift, and a concrete next command.
- [x] Discovery docs include `codebase-status`.
- [x] Validation passes with dependency/version/routing audits, targeted text scans, install refresh, and `git diff --check`.

**Completed:** 2026-05-04. Added mirrored Claude/Codex `codebase-status` skills, Codex OpenAI metadata, discovery references, and read-only status-reporting guidance. Evidence came from full authored Claude/Codex history filtering, which showed repeated status/outstanding-work prompts distinct from roadmap queue maintenance. Validation passed with install refresh, dependency/version/routing audits, targeted behavior scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches global skill discovery and mirrored skill definitions.

## Phase 24: Installer Skill ✓

**Goal:** Add a skill-creator-style global skill that lets any assistant instance with access to this `agentic-skills` checkout refresh global Claude/Codex skill links and keep pack installation discoverable.

**Source:** User request to create a skill that runs the install script so all local instances can use the skills and access pack installs when needed.

**Scope:**
- Add mirrored Claude/Codex `install-agentic-skills` skills.
- Add a bundled launcher that resolves the repository root from the installed skill symlink and delegates to root `install.sh`.
- Add Codex OpenAI agent metadata.
- Keep pack installation project-local through the existing `$pack` / `/pack` workflow.

**Acceptance Criteria:**
- [x] `global/codex/install-agentic-skills/SKILL.md` and `global/claude/install-agentic-skills/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/install-agentic-skills/agents/openai.yaml`.
- [x] The launcher runs the root `install.sh` and supports `--uninstall`.
- [x] The skill explains that domain packs are not globally installed and routes users to `pack` for project-local access.
- [x] Validation passes with install dry checks, skill dependency/version/routing audits, targeted text scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches global install/discovery behavior.

**Completed:** 2026-05-04. Added mirrored Claude/Codex `install-agentic-skills` skills, Codex OpenAI metadata, root install launchers, discovery references, and pack-routing guidance. Validation passed with launcher help/install checks, root install refresh, dependency/version/routing audits, targeted behavior scans, Vitest layer1, and `git diff --check`.

---

## Phase 23: Targeted Skill Builder ✓

**Goal:** Add a focused skill-building workflow that turns a concrete correction, bad recommendation pattern, repeated workflow problem, or narrow capability gap into the smallest durable fix: a new skill, an existing-skill update, or a reusable prompt/template.

**Source:** User request after providing the current `analyze-sessions` contract and explicitly rejecting broad session-history analysis as the default path for targeted skill work.

**Scope:**
- Add mirrored Claude/Codex `targeted-skill-builder` skills.
- Keep `tasks/lessons.md` as the first evidence source.
- Require a destination checkpoint: new skill, update existing skill, reusable prompt only, or unsure/recommend.
- Search existing skills for overlap before creating a duplicate.
- Inspect only user-provided files, a named skill, current conversation context, or a tightly scoped history query unless the user explicitly requests full history analysis.
- Default new shared skills to this `agentic-skills` repo, while providing a prompt for the user to run in this repo when an external project session needs an existing shared skill amended.
- Require Codex global skills to include `agents/openai.yaml`.
- Run `./install.sh` after skill mutations so Claude/Codex symlinks are current, and tell the user to start a fresh CLI/session if the new skill is not visible yet.

**Acceptance Criteria:**
- [x] `global/codex/targeted-skill-builder/SKILL.md` and `global/claude/targeted-skill-builder/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/targeted-skill-builder/agents/openai.yaml`.
- [x] Skill discovery docs include targeted-skill-builder.
- [x] The workflow explicitly avoids default broad `$analyze-sessions` behavior.
- [x] Validation passes with dependency/version/routing audits, targeted text scans, install refresh, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this adds a global skill pair plus discovery and routing documentation.

**Completed:** 2026-05-04. Added mirrored Claude/Codex `targeted-skill-builder`, Codex OpenAI metadata, discovery references, and validation notes. Validation passed with dependency/version/routing audits, targeted behavior scans, install refresh, and `git diff --check`.

---

## Phase 22: Feature Interview Routing ✓

**Goal:** Add a planning interface between raw brainstorm ideas and full specs so ideas receive human/agent alignment, feature-specific questioning, and a decision on whether to create a new spec, update an existing spec, or route into roadmap/task work.

**Source:** User request after reviewing recent brainstorm runs and session history showing brainstorm's direct handoff to spec-interview.

**Scope:**
- Add mirrored Claude/Codex `feature-interview` skills.
- Update brainstorm so generated ideas route to feature-interview instead of assuming every idea needs a full spec.
- Update roadmap/research routing so unspecced ideas use feature-interview unless full-spec creation is already confirmed.
- Make spec-interview's post-spec route explicitly default to roadmap unless missing journey/UX/UI gates take priority.
- Expose feature-interview in skill discovery and routing documentation.

**Acceptance Criteria:**
- [x] `global/codex/feature-interview/SKILL.md` and `global/claude/feature-interview/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/feature-interview/agents/openai.yaml`.
- [x] Brainstorm output prompts use `$feature-interview` / `/feature-interview`.
- [x] Roadmap unspecced-idea handling prefers feature-interview triage and keeps spec-interview for confirmed full-spec work.
- [x] Spec-interview explicitly recommends roadmap after completed/updated specs when no higher-priority design gate is missing.
- [x] Skill discovery docs include feature-interview.
- [x] Validation passes with dependency/version/routing audits, targeted text scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared planning skill contracts and routing documentation in both Claude and Codex mirrors.

**Completed:** 2026-05-04. Added feature-interview and redirected brainstorm/roadmap/research-routing language so brainstorm ideas no longer assume full spec creation. Validation passed with dependency/version/routing audits, targeted text scans, and `git diff --check`.

---

## Phase 21: Quality Gate Hardening ✓

**Goal:** Make anti-slop quality controls a default part of non-trivial mutation and shipping workflows so code cannot be committed by procedural compliance alone.

**Source Spec:** `tasks/session-workflow-quality-audit.md`

**Scope:**
- Add a shared quality-gate contract for mutation/shipping skills that requires changed files, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- Harden `$exec`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` so non-trivial source mutations require a diff-aware ship manifest and cannot rely on doc-only verification.
- Promote targeted `quality-sweep audit` or equivalent adversarial review into the default pre-ship path for non-trivial code changes.
- Add a lightweight local validation script that can check generated ship manifests or final-response drafts for required quality-gate fields.
- Document how user corrections flow from `tasks/lessons.md` into relevant skill/test updates when a correction exposes a repeatable workflow failure.
- Preserve existing direct-to-primary shipping and next-step routing contracts.

**Acceptance Criteria:**
- [x] A reusable quality-gate contract exists and is referenced by the global mutation/shipping skills.
- [x] `$exec`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` require a ship manifest for non-trivial source changes.
- [x] The ship manifest requires changed files, per-file purpose, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- [x] Non-trivial source changes require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review before commit/push.
- [x] A validation script detects missing required ship-manifest fields and passes on a complete fixture.
- [x] User-correction handling requires updating `tasks/lessons.md` and, when applicable, the relevant skill or validation check.
- [x] Validation passes with targeted contract scans, script fixture checks, skill dependency/version/routing audits, and `git diff --check`.

**Completed:** 2026-05-04. Added the reusable `docs/quality-gate-contract.md`, the dependency-light `scripts/ship-quality-gate.sh` validator with complete and incomplete fixtures, and hardened `$exec`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` so non-trivial source mutations require a diff-aware ship manifest, adversarial review, executable-verification distinction, and correction-enforcement evidence. Validation passed with focused fixture checks, targeted contract scans, skill dependency/version/routing audits, and `git diff --check`.

**Parallelization:** review-only
**Coordination Notes:** Keep implementation serial because the phase touches shared global workflow skills and validation scripts. Use review-only lanes for adversarial contract review after the main edits are drafted.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** review-only
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, docs/API conformance, workflow safety

**Subagent lanes:**
- Lane: quality-contract-review
  - Agent: explorer
  - Role: reviewer
  - Mode: review
  - Scope: Review the proposed quality-gate contract and skill-routing changes for loopholes that would still allow source changes to ship without diff-aware evidence.
  - Depends on: Step 21.4
  - Deliverable: Review report listing blockers, recommended wording changes, and validation gaps.

### Implementation
- Step 21.1: Add reusable quality-gate contract documentation.
  - Classification: automated
  - Files: create `docs/quality-gate-contract.md`
  - Define non-trivial mutation, ship manifest fields, skipped-test rationale, residual-risk language, adversarial review expectations, and direct-to-primary compatibility.
  - Include the recommended policy from `tasks/session-workflow-quality-audit.md`: Plan, Implement, Self-review, Quality sweep, Verification, Ship manifest.
- Step 21.2: Add ship-manifest validation script and fixtures.
  - Classification: automated
  - Files: create `scripts/ship-quality-gate.sh`, create `tests/fixtures/ship-quality-gate/complete.md`, create `tests/fixtures/ship-quality-gate/missing-fields.md`
  - Script should fail on missing required fields and pass on a complete manifest fixture.
  - Keep it dependency-light and shell-compatible with existing repository scripts.
- Step 21.3: Harden global execution and shipping skill contracts.
  - Classification: automated
  - Files: modify `global/codex/exec/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`
  - Require ship manifest generation for non-trivial source mutations before commit/push.
  - Require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review for non-trivial code changes.
  - Require final responses to distinguish executable verification from doc-only/task-only checks.
- Step 21.4: Add user-correction enforcement guidance.
  - Classification: automated
  - Files: modify `global/codex/exec/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`, modify `docs/quality-gate-contract.md`
  - Require corrections to update `tasks/lessons.md`.
  - Require a relevant skill or validation script update when the correction exposes a repeatable workflow failure.
  - Require explicit "not applicable" rationale when no skill/test update is made.

### Green
- Step 21.5: Write and run focused validation for the quality gate.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/complete.md` and confirm it passes.
  - Run `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/missing-fields.md` and confirm it fails for the expected missing fields.
  - Run targeted `rg` scans confirming `docs/quality-gate-contract.md` references and required manifest fields in all touched global skills.
- Step 21.6: Run repository validation and review gate.
  - Classification: automated
  - Files: no source changes expected beyond review-driven fixes and task review notes
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, and `git diff --check`.
  - Apply concrete review findings from the `quality-contract-review` lane before marking the phase complete.

### Milestone: Quality Gate Hardening
**Acceptance Criteria:**
- [x] A reusable quality-gate contract exists and is referenced by the global mutation/shipping skills.
- [x] `$exec`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` require a ship manifest for non-trivial source changes.
- [x] The ship manifest requires changed files, per-file purpose, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- [x] Non-trivial source changes require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review before commit/push.
- [x] A validation script detects missing required ship-manifest fields and passes on a complete fixture.
- [x] User-correction handling requires updating `tasks/lessons.md` and, when applicable, the relevant skill or validation check.
- [x] Validation passes with targeted contract scans, script fixture checks, skill dependency/version/routing audits, and `git diff --check`.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: none recorded.
- Tech debt / follow-ups: none recorded.
- Ready for next phase: yes.

---

## Phase 20: YouTube External Video Research Skills ✓

**Goal:** Add focused external YouTube video research skills for context comprehension, format/Remotion-style analysis, and competitive performance learning.

**Scope:**
- Add mirrored Claude/Codex `youtube-vid-research`, `youtube-format-research`, and `youtube-competitive-research` skills to the creator-media pack.
- Reuse the existing YouTube public-evidence contract: `yt-dlp`, local transcript venv, raw evidence under `research/youtube/data/`, explicit evidence gaps, and no fabricated transcripts/comments/metrics/visual claims.
- Wire creator-media docs and next-skill routing so external reference-video work sits between single-video audit and packaging/strategy work.
- Keep Remotion implementation owned by `video-build`; `youtube-format-research` only emits a format and Remotion handoff spec.

**Acceptance Criteria:**
- [x] Mirrored Claude/Codex `youtube-vid-research` skill contracts exist.
- [x] Mirrored Claude/Codex `youtube-format-research` skill contracts exist.
- [x] Mirrored Claude/Codex `youtube-competitive-research` skill contracts exist.
- [x] The three skills require persisted evidence, explicit evidence coverage, anti-fabrication constraints, output paths, archive-first replacement, and next-skill routing.
- [x] Creator-media docs/reference lists include the three new skills in discovery and default flow.
- [x] Existing creator-media routing orders include the three new external-video research lanes.
- [x] Validation passes with mirrored-contract scans, docs/routing scans, dependency/version/routing audits, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches mirrored creator-media skills, shared pack docs, and routing lists. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-04. Mirrored Claude/Codex `youtube-vid-research`, `youtube-format-research`, and `youtube-competitive-research` skills were added to the creator-media pack, documentation references now expose external video context, format/Remotion-style analysis, and competitive lessons, and validation passed with mirrored contract scans, docs/routing scans, dependency/version/routing audits, and `git diff --check`.

## Phase 19: YouTube Description Optimizer ✓

**Goal:** Add a focused YouTube description and metadata optimization skill for existing videos, future uploads, and reusable series templates.

**Scope:**
- Add mirrored Claude/Codex `youtube-description-optimizer` skill definitions to the creator-media pack.
- Support audit, draft, and template modes for video metadata, scripts/outlines, channel evidence, and series evidence.
- Cover first-two-lines promise support, search clarity, CTA/link hierarchy, chapters, hashtags, disclosures, pinned-comment fit, and practical rewritten description blocks.
- Wire creator-media docs and routing so description optimization sits between title/thumbnail audit and portfolio decisions.

**Acceptance Criteria:**
- [x] `youtube-description-optimizer` exists for both Claude and Codex.
- [x] The skill supports `audit`, `draft`, and `template` modes with explicit output paths.
- [x] The skill requires evidence coverage and forbids invented links, sponsors, disclosures, chapters, transcript details, comments, and owner-only metrics.
- [x] Creator-media docs/reference lists include `youtube-description-optimizer` in the packaging flow.
- [x] Creator-media next-skill routing includes `youtube-description-optimizer` between title/thumbnail audit and portfolio.
- [x] Validation passes with skill dependency/version checks, next-step routing audit, targeted mirrored-contract scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep this serial because it touches mirrored skills, shared creator-media routing, and public pack docs. Preserve any in-progress creator-media video-script/video-build routing work.

**Completed:** 2026-05-03. Mirrored Claude/Codex `youtube-description-optimizer` skills were added to the creator-media pack, documentation references now expose the description/metadata lane between title/thumbnail audit and portfolio, and validation passed with dependency/version checks, next-step routing audit, mirrored contract scan, docs/routing scans, and `git diff --check`.

## Phase 18: Pack Lock Stale Recovery ✓

**Goal:** Make pack lock failures diagnosable and recover automatically when a previous pack process left a stale lock behind.

**Scope:**
- Add owner metadata to `.agents/.pack.lock`.
- Remove stale locks automatically when the recorded owner PID is no longer running.
- Include lock owner details in timeout errors.
- Document the lock behavior in pack docs.

**Acceptance Criteria:**
- [x] `scripts/pack.sh` writes lock owner metadata and removes stale dead-PID locks.
- [x] Timeout errors report lock owner metadata.
- [x] Pack docs describe stale-lock behavior.
- [x] Focused smoke tests cover live-lock waiting and stale-lock recovery.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this is shared pack write coordination.

## Phase 17: Mixed Monorepo Pack Routing ✓

**Goal:** Allow a repository to declare a default project designation plus path-scoped domain designations for mixed monorepos.

**Scope:**
- Document `project_scopes` in the pack skill and public pack docs.
- Keep `enabled_packs` as the repository-wide union of available local packs.
- Preserve existing `project_scopes` and `notes` fields when pack commands rewrite `.agents/project.json`.

**Acceptance Criteria:**
- [x] `global/claude/pack` and `global/codex/pack` describe mixed-monorepo routing.
- [x] `README.md` and `docs/packs.md` show a mixed devtool/business-app example.
- [x] `scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` do not drop existing `project_scopes` or `notes` when `jq` is available.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared pack schema and writer behavior.

## Phase 16: Mutation Contract Routing Audit ✓

**Goal:** Ensure every mutation-capable skill contract emits explicit next-step routing in its final response, and add a repeatable audit that fails when future mutation-capable skills omit that routing.

**Scope:**
- Patch mutation-capable skill contracts whose output section or routing section does not require a final next-step handoff.
- Add a script-level audit for mutation-capable `SKILL.md` files missing `Recommended next skill`, `Recommended next command`, or the `Next work`/`Recommended next command` pair.
- Document the audit in task review output and run it with the existing skill dependency/version checks.

**Acceptance Criteria:**
- [x] Mutation-capable skills patched by this phase explicitly require next-step routing in their final response.
- [x] The repository has a repeatable audit command for missing next-step routing in mutation-capable skill contracts.
- [x] The audit passes along with `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared skill contract text and validation scripts.

## Phase 11: Three-Mode Operating Model ✓

**Goal:** Evolve `agentic-skills` from parity-mirrored Claude/Codex skills into a plural-by-default operating model with three first-class modes (`claude-only`, `codex-only`, `hybrid`), a shared approval/delegation packet contract, and next-step routing across every planning/execution skill.

**Completed:** 2026-04-19. Shipped across 11 implementation steps + an empirical Verify micro-step. Full per-step detail lives in `tasks/todo.md` § "Phase 11" and `tasks/history.md`. Authoritative operating-model reference: `docs/operating-modes.md`.

### Highlights

- **Mode signal + resolver.** `scripts/agent-mode.sh` resolves the effective mode via precedence `SKILLS_AGENT_MODE` env > `.agents/project.json.agent_mode` > unset. Writer: `scripts/pack.sh set-mode`.
- **Approval packet.** `specs/approved-plan.schema.json` defines the shared cross-CLI contract. `scripts/approved-plan.sh` implements the full lifecycle (`draft → approved → consumed | stale | superseded | uncertain`) with atomic transitions and six freshness checks (`consume` at the Codex boundary via `$exec --execute-approved`).
- **In-session delegation.** `/delegate` (Claude) provides the hybrid-only bridge: drafts + approves a packet and invokes `codex exec "<target> --execute-approved"` with explicit pre-start / success / ambiguous safe-fallback branches and a `mark-uncertain` escape hatch. Never blind-retries cross-CLI. `/handoff --target=codex` covers the async case.
- **Next-step routing.** 12 planning/execution skills (6 Claude + 6 Codex) carry a shared "Next-Step Routing" block that emits Next work plus Recommended next command. `hybrid` on Claude recommends `/delegate`; `hybrid` on Codex recommends returning to Claude (Claude orchestrates).
- **Pack emphasis.** `docs/operating-modes.md` § "Pack emphasis" tags every global skill and pack with a primary role (`Claude-orchestration` / `Codex-execution` / `Both`). Codex `$exec` uses pack-aware routing to substitute `-kanban` variants when an enabled pack ships them.
- **Degraded-path audit.** 19-row table in `docs/operating-modes.md` § "Degraded-path audit" covers every cross-CLI touchpoint with an explicit fallback or mode constraint.
- **Authoritative reference.** `docs/operating-modes.md` (~280 lines) is the single source of truth: mode-signal resolution, approval packet (fields / lifecycle / safety / freshness), degraded-path audit, pack emphasis, and a migration guide from the parity-mirror model.

### Verify (empirical acceptance)

Completed 2026-04-19. Ran each of the three modes through the mode-resolution + approval-packet machinery; confirmed `claude-only` and `codex-only` never write a packet while `hybrid` drives the full `draft → approved → consumed` lifecycle. Spot-checked `/delegate` mode-mismatch under `claude-only` (contract) and TTL-triggered `approved → stale` transition (live). Evidence: `tasks/verify-phase-11.md`. Two non-blocking gaps logged for a future follow-up (source-state guard parity between `mark-stale` and `mark-uncertain`; hybrid-cycle mirror-commit UX nuance).

**Step 12 (tail, 2026-04-19):** Both Verify gaps closed. `scripts/approved-plan.sh mark-stale` now rejects every non-`approved` source state with a consistent single-line reason (parity with `mark-uncertain`). `docs/operating-modes.md` § "Degraded-path audit" + `global/claude/delegate/SKILL.md` step 2 document the hybrid back-to-back mirror-commit prerequisite. No mechanism redesign, no schema change.

**Step 13 (tail, 2026-04-19):** Both Step 8 `jq`-dependency gaps closed. `global/claude/handoff/SKILL.md` step 5 preamble and `global/codex/exec/SKILL.md` step 6c both now declare `jq` a hard dependency and cite the exact `require_jq_write` failure text from `scripts/approved-plan.sh:21`. `docs/operating-modes.md` audit table's two `⚠ gap — follow-up` cells updated to cite the new declarations; § "Gaps surfaced by Step 8" preserved as audit trail with a dated resolution line. Doc-only.

---

## Phase 1: Kanban Skill Suite ✓

**Goal:** Create a parallel set of `-kanban` workflow skills that manage kanban board state alongside their normal operations. Board lists: Backlog → Todo → In Progress → Done → Punt.

### Prerequisites (done)
- `/poketo-kanban` skill — low-level board CRUD
- `/sync-roadmap-kanban` skill — standalone reconciliation with board auto-detection via `tasks/.kanban-board`

### Steps

1. **`brainstorm-kanban`** (Claude + Codex)
   - Full copy of `/brainstorm` with kanban ops added
   - After generating ideas, create one card per idea in the Backlog list
   - Card name: idea title. Card description: idea details, effort estimate, category

2. **`spec-interview-kanban`** (Claude + Codex)
   - Full copy of `/spec-interview` with kanban ops added
   - After validating/speccing an idea, find the matching Backlog card and update it with spec details
   - If no matching card exists, create one in Backlog with the spec summary

3. **`roadmap-kanban`** (Claude + Codex)
   - Full copy of `/roadmap` with kanban ops added
   - After building the phased plan, move specced Backlog cards to the Todo list
   - Create Todo cards for any roadmap phases/steps that don't have cards yet

4. **`exec-kanban`** (Claude + Codex)
   - Full copy of `/exec` with kanban ops added
   - At session start, move the current step's card from Todo to In Progress
   - Cross-device conflict detection: scan In Progress for cards from other hostnames, warn on overlap
   - After step completion, update the card (mark progress, add notes)

5. **`ship-kanban`** (Claude + Codex)
   - Full copy of `/ship` with kanban ops added
   - After shipping, move the step's card to Done
   - If work is deferred/blocked, move to Punt with a reason in the description
   - When planning next step, ensure the next card is in Todo

6. **`ship-end-kanban`** (Claude + Codex)
   - Full copy of `/ship-end` with kanban ops added
   - After wrapping up, move the session's In Progress card to Done with commit refs

### Milestone
- [x] Full kanban lifecycle works: brainstorm creates Backlog cards → spec-interview specs them → roadmap moves to Todo → run moves to In Progress (with conflict warnings) → ship/ship-end moves to Done or Punt

---

## Phase 2: Proactive Board Intelligence ✓

**Goal:** Agents use board state to make smarter decisions about what to work on.

### Steps

1. **Session start board check**
   - Kanban skills read the board at session start to understand project priorities
   - Surface overdue cards, blocked items, and high-priority backlog

2. **Auto-suggest next work**
   - After `/ship-end-kanban`, read the board and suggest the highest-priority unstarted card
   - Factor in due dates, starred status, and dependency order

3. **Progress tracking**
   - Update card `progress` field as agents complete sub-tasks within a step
   - `/exec-kanban` updates progress percentage based on step completion within the phase

### Milestone
- [x] Agent recommends next task based on board state and project priorities

---

## Phase 3: Board Templates ✓

**Goal:** One-command board creation with the standard 5-list layout, reducing setup friction for new projects.

### Steps

1. **Add `--template standard` flag to kanban.mjs**
   - When `create-board` is called with `--template standard`, create board with the 5 lists: Backlog, Todo, In Progress, Done:done, Punt:punt
   - Keep existing `--lists` flag for custom layouts
   - `--template` and `--lists` are mutually exclusive

2. **Update -kanban skills' Board Resolution protocol**
   - When no board exists and user confirms creation, use `--template standard` instead of the long `--lists "Backlog,Todo,In Progress,Done:done,Punt:punt"` string
   - Update all 12 -kanban SKILL.md files (6 Claude + 6 Codex)

### Milestone
- [x] `create-board --template standard` creates a board with all 5 required lists in correct types

---

## Phase 4: Archive Automation ✓

**Goal:** Keep boards clean by archiving old Done/Punt cards automatically.

### Steps

1. **Add `archive-card` command to kanban.mjs**
   - New command: `archive-card --id <card-id>` — moves card to the board's archive
   - Uses the existing `archiveListId` field in the board schema
   - If no archive list exists, create one automatically

2. **Add `--archive` mode to `poketo-kanban` (Claude + Codex)**
   - Archive mode on the `poketo-kanban` skill archives Done/Punt cards older than N days (default 30)
   - Shows which cards will be archived, asks for confirmation before proceeding
   - Supports `--days <N>` to override the default threshold
   - Reports: how many cards archived, from which lists
   - (Originally shipped as a standalone `/kanban-archive` skill; later merged into `poketo-kanban --archive` — see `tasks/history.md`.)

### Milestone
- [x] `poketo-kanban --archive` cleans up Done/Punt cards older than 30 days with user confirmation

---

## Phase 5: Expert Review Fixes (2026-03-26) ✓

**Goal:** Resolve findings from `/expert-review` — credential leak, null dereference bug, stale docs, and missing codex manifest.

### Steps

1. **Remove leaked database credential from tracked file**
2. **Fix null dereference in `cmdArchiveCard`**
3. **Escape LIKE metacharacters in search**
4. **Batch list creation in `cmdCreateBoard`**
5. **Add missing `codex/spec-interview-ideas/agents/openai.yaml`**
6. **Fix stale output paths in `docs/skills-reference.md`**
7. **Add try/catch for malformed config JSON**

### Milestone
- [x] No credentials in tracked files, Neon password rotated
- [x] `cmdArchiveCard` handles orphaned list/board references gracefully
- [x] All codex skills have `agents/openai.yaml`
- [x] `docs/skills-reference.md` output paths match actual skill behavior

---

## Phase 6: Testing Hardening I ✓

**Goal:** Expand kanban.mjs test coverage with edge case and command-level tests to catch regressions like the Phase 5 LIKE injection and null dereference bugs.

**Acceptance Criteria:**
- [x] Edge case tests added: unicode card names, LIKE metacharacter queries (%, _, backslash as todo), moving card to same list, archiving already-archived card
- [x] create-list command has dedicated test coverage
- [x] update-card --progress, --description, --due flags each have at least one test
- [x] search with special characters has regression tests
- [x] All new + existing tests pass (53 passed, 1 todo — target was 40+)

**On Completion:**
- Deviations: `--description ""` no-op (falsy guard), no `--type` flag on create-list, move-card/board omit card `order`
- Tech debt: backslash search escape, empty description clearing, expose card `order` in responses
- Ready for next phase: yes

---

## Phase 7: Testing Hardening II ✓

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling.

**Acceptance Criteria:**
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [x] install.sh has vitest test suite covering happy path + error cases (8 tests)
- [x] At least 5 database error path tests (insert failure, FK violation, connection error)
- [x] Backslash LIKE escape bug fixed with regression test
- [x] All tests pass across all suites (77 tests)

**On Completion:**
- Deviations from plan: install.sh tests used vitest instead of bats-core (no new deps needed)
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes

---

## Phase 8: Kanban DX ✓

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

**Scope**:
- Add `--board` flag to kanban search (spec: `specs/board-flag-kanban-search.md`)
- Dry-run mode for kanban skills (`--dry-run` shows intended ops without executing)
- Unify env path lists in bootstrap-session.mjs and kanban.mjs

**Acceptance Criteria:**
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [x] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [x] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests added (83 total)

**On Completion:**
- Deviations from plan: none
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes

---

## Phase 9: Skill Infrastructure ✓

**Goal:** Improve skill discoverability, validate cross-references, and track changes.

**Scope**:
- Skill discovery command (`/skills` with search and workflow-stage grouping)
- Skill dependency graph and validation (parse SKILL.md cross-references, detect broken refs)
- Skill versioning and changelog (semver in frontmatter, changelog tracking)

**Acceptance Criteria:**
- [x] `/skills` command lists skills grouped by workflow stage with keyword search
- [x] Dependency graph script detects broken cross-references between skills
- [x] At least one iteration of versioning scheme documented and applied to 3+ skills
- [x] No broken skill cross-references in the repo

**On Completion**:
- Deviations from plan: Versioning applied to all 43 skills (not just 3+). Skipped per-skill changelogs — git history suffices.
- Tech debt / follow-ups: Codex skill versioning deferred.
- Ready for next phase: Yes

---

## Phase 10: Headless API Migration ✓

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Why this phase exists:**
- Current kanban skills write through `kanban.mjs`, which talks directly to Neon using local DB credentials
- Codex skill variants currently depend on Claude install paths such as `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- The canonical Poketo business logic already lives in app-layer tRPC routers and gateway-adjacent adapters, but the headless work-tool surface is only partially wired
- Keeping separate write paths for Claude and Codex will continue to drift on auth, permissions, and board action semantics

### Steps

1. **Establish agent-friendly headless auth**
   - Define the supported auth path for automation agents (API key or equivalent durable headless auth)
   - Ensure local agent workflows do not require raw DB credentials for normal board operations
   - Document the migration and fallback expectations for existing `~/.poketo/config.json` session-based setups

2. **Finish wiring the Poketo Work headless tool layer**
   - Replace stubbed Work primitives/adapters with real tRPC-backed implementations for board/card/list operations
   - Ensure the shared surface exposes the kanban operations the skills need: board discovery, board details, board activity, board creation, list creation/update, card create/update/move/search, archive/restore
   - Reuse the app-layer routers so permission checks and `board_actions` logging come from the canonical Poketo boundary

3. **Expose the shared API/gateway path for agent use**
   - Make the headless Work operations available through the existing gateway/CLI surface used by agents
   - Verify tool discovery and execution work without depending on direct DB access
   - Ensure the response shapes are good enough to support existing kanban skill workflows without fragile parsing

4. **Migrate Claude kanban skills** ✅
   - Update Claude kanban skills to use the shared headless path instead of direct DB writes through `kanban.mjs`
   - Preserve current workflow behavior where possible: board resolution, list validation, conflict checks, progress updates, archive flow
   - Keep `kanban.mjs` only as a temporary fallback/admin tool during rollout

5. **Migrate Codex kanban skills** ✅
   - Remove Codex dependence on Claude-specific install paths
   - Point Codex kanban skills at the same shared headless path Claude uses
   - Update docs and assumptions so Codex is no longer described as operating through the Claude-side kanban script

6. **Deprecate the standalone DB-write path** ✅
   - Mark `kanban.mjs` direct-write mode as fallback-only once both toolchains are migrated
   - Remove it from the default documented workflow after shared headless usage is verified
   - Keep only the minimum rescue/admin functionality if there is still an operational need

### Acceptance Criteria

- [x] Claude and Codex kanban skills use the same app-layer write path for normal board operations
- [x] No kanban skill requires `POKETOWORK_DATABASE_URL` for standard usage
- [x] Codex kanban skills no longer reference `~/.claude/skills/...` paths
- [x] Shared headless operations cover the current kanban workflow needs: board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore
- [x] Board permissions and `board_actions` logging come from the canonical Poketo app layer rather than the standalone script
- [x] `kanban.mjs` is documented as fallback/admin-only or removed from the default workflow

### Notes / Risks

- Auth is the main dependency. If the gateway/API-key flow is not usable for agents, the migration will stall.
- The Work tool layer and gateway surface must be completed before migrating the skill docs, otherwise the skills will lose functionality.
- Claude and Codex should migrate to the same target surface in close succession to avoid long-lived behavioral drift.

---

## Phase 12: Creator Platform Evidence Foundation ✓

**Goal:** Add the shared creator-media foundation for non-YouTube platforms: a platform capability matrix and normalized evidence schema that future platform-specific skills can consume.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-platform-capability-matrix` skill definitions.
- Add mirrored Claude/Codex `creator-evidence-schema` skill definitions.
- Define output artifacts under `research/creator-platforms/`.
- Document supported baseline collection methods: `export`, `manual_snapshot`, `rss_feed`, `public_page_capture`, `open_source_tool`, and `free_api`.
- Update creator-media pack docs and global skill references so the new foundation appears before platform-specific audits.
- Validate mirrored skill metadata, references, and required output-path language.

**Acceptance Criteria:**
- [x] `creator-platform-capability-matrix` exists for both Claude and Codex.
- [x] `creator-evidence-schema` exists for both Claude and Codex.
- [x] The capability matrix skill records platform evidence sources, fields, missing fields, metric availability, audit depth, operational risk, and recommended next skill.
- [x] The schema skill defines normalized evidence records, metric confidence, evidence confidence, capture method, auth context, raw evidence paths, and privacy notes.
- [x] Pack docs route non-YouTube creator-media work through the foundation before platform-specific skills.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.

**Parallelization:** serial
**Coordination Notes:** This phase changes shared pack contracts and docs, so keep it integrated. Later platform-specific work should depend on this schema instead of creating incompatible evidence fields.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 12.1: Create mirrored `creator-platform-capability-matrix` skill contracts.
  - Files: create `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, create `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`
  - Include platform rows for LinkedIn personal profile, LinkedIn company page, personal website/blog, newsletter, podcast, GitHub, X/Threads/Instagram/TikTok, and Bluesky/Mastodon.
  - Require output at `research/creator-platforms/capability-matrix.md`.
  - Require columns for evidence sources, likely fields, missing fields, metric availability, body/media/transcript availability, peer benchmarking practicality, operational risk, audit depth, and recommended next skill.
  - Classify collection methods as `export`, `manual_snapshot`, `rss_feed`, `public_page_capture`, `open_source_tool`, or `free_api`.
- Step 12.2: Create mirrored `creator-evidence-schema` skill contracts.
  - Files: create `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, create `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`
  - Require output at `research/creator-platforms/evidence-schema.md`.
  - Define raw evidence root `research/creator-platforms/data/<platform>/<slug>/`.
  - Define normalized record fields for `evidence_id`, `platform`, `source_type`, `source_url`, `raw_path`, `captured_at`, `capture_method`, `auth_context`, `terms_risk`, `title`, `body_text_path`, `published_at`, `creator_role`, `media_type`, `topic_tags`, `content_role`, `metrics`, `metric_confidence`, `evidence_confidence`, privacy notes, and review notes.
  - State that optional metrics must not be invented and missing metrics/bodies must be recorded as evidence gaps.
- Step 12.3: Wire the foundation into creator-media pack docs and discovery references.
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-platform-capability-matrix` and `creator-evidence-schema` before platform-specific audits in the creator-media skill list and default flow.
  - Document that YouTube-specific work may still start at `youtube-channel-audit`, while non-YouTube or mixed-platform work starts with the foundation.
- Step 12.4: Align creator-media next-skill routing with the new foundation.
  - Files: modify `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`, inspect existing `packs/creator-foundation/{claude,codex}/*/SKILL.md` and `packs/youtube-ops/{claude,codex}/*/SKILL.md`
  - Ensure the new skills emit `Recommended next skill: <command>` in the final response.
  - Route matrix to schema by default; route schema to the future creator presence dossier when present, otherwise to platform-specific audits or `creator-positioning` based on available evidence.
  - Preserve existing YouTube workflow routing unless a non-YouTube evidence foundation is missing.

### Green
- Step 12.5: Write regression validation coverage for Phase 12 acceptance criteria.
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored new skill files, frontmatter names, output paths, collection method language, normalized schema fields, LinkedIn baseline language, and pack-doc routing.
- Step 12.6: Run repository validation.
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, `git diff --check`, and perform only concrete cleanup found by validation.

### Milestone: Creator Platform Evidence Foundation
**Acceptance Criteria:**
- [x] `creator-platform-capability-matrix` exists for both Claude and Codex.
- [x] `creator-evidence-schema` exists for both Claude and Codex.
- [x] The capability matrix skill records platform evidence sources, fields, missing fields, metric availability, audit depth, operational risk, and recommended next skill.
- [x] The schema skill defines normalized evidence records, metric confidence, evidence confidence, capture method, auth context, raw evidence paths, and privacy notes.
- [x] Pack docs route non-YouTube creator-media work through the foundation before platform-specific skills.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: none.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

## Phase 13: Creator Presence Dossier ✓

**Goal:** Add a repo-backed Markdown dossier skill that tracks a creator's public professional presence, career arc, platform roles, proof assets, and content opportunities over time.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-presence-dossier` skill definitions.
- Make the dossier consume `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available creator evidence.
- Define output under `research/creator-presence/<slug>.md`.
- Include sections for identity, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company links, evidence register, gaps, and next collection tasks.
- Update pack docs and references so the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.

**Acceptance Criteria:**
- [x] `creator-presence-dossier` exists for both Claude and Codex.
- [x] The skill distinguishes public/professional evidence from private repo planning context.
- [x] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [x] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [x] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.

**Parallelization:** serial
**Coordination Notes:** The dossier depends on the Phase 12 matrix/schema contract. Keep implementation serial because it touches pack routing and cross-skill handoffs.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 13.1: Create mirrored `creator-presence-dossier` skill contracts.
  - Classification: automated
  - Files: create `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, create `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Require output at `research/creator-presence/<slug>.md`.
  - Require reading `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available normalized/raw creator evidence before synthesis.
  - Require public/professional evidence boundaries so private repo planning context is excluded unless explicitly marked as internal notes.
  - Include final-response next-skill routing as `Recommended next skill: <command>`.
- Step 13.2: Define the dossier Markdown contract and evidence register requirements.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Require sections for identity, current public promise, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company connections, gaps/contradictions/stale positioning, evidence register, next collection tasks, and recommended next skills.
  - Require evidence rows to include source path or URL, capture date, confidence level, public/private boundary, and evidence gaps.
  - Require support for LinkedIn, personal websites/blogs, GitHub, podcasts, talks, newsletters, and product docs when evidence is present.
- Step 13.3: Wire `creator-presence-dossier` into creator-media pack docs and discovery references.
  - Classification: automated
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-presence-dossier` after `creator-evidence-schema` and before platform-specific audits or strategy synthesis in creator-media skill lists and default flows.
  - Document that the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.
- Step 13.4: Align downstream creator-media routing with the dossier.
  - Classification: automated
  - Files: inspect and modify only as needed in `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`, `packs/creator-foundation/claude/creator-positioning/SKILL.md`, `packs/creator-foundation/codex/creator-positioning/SKILL.md`, `packs/creator-foundation/claude/content-programming/SKILL.md`, `packs/creator-foundation/codex/content-programming/SKILL.md`, `packs/creator-foundation/claude/product-led-media-map/SKILL.md`, `packs/creator-foundation/codex/product-led-media-map/SKILL.md`, `packs/creator-foundation/claude/creator-metrics-review/SKILL.md`, `packs/creator-foundation/codex/creator-metrics-review/SKILL.md`
  - Ensure schema routing can recommend the now-present dossier for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.
  - Ensure strategy skills mention the dossier as a preferred creator context source without breaking the existing YouTube evidence flow.

### Green
- Step 13.5: Write regression validation coverage for Phase 13 acceptance criteria.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored dossier skill files, frontmatter names, output path, required sections, public/private evidence boundaries, confidence/capture/source fields, supported source types, pack-doc routing, and final-response next-skill language.
- Step 13.6: Run repository validation.
  - Classification: automated
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, `git diff --check`, and perform only concrete cleanup found by validation.

### Milestone: Creator Presence Dossier
**Acceptance Criteria:**
- [x] `creator-presence-dossier` exists for both Claude and Codex.
- [x] The skill distinguishes public/professional evidence from private repo planning context.
- [x] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [x] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [x] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: Folded the conditional no-op wording cleanup into the validation gate to avoid a separate plan-mode handoff after clean checks.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

## Phase 14: LinkedIn Evidence Lane ✓

**Goal:** Add LinkedIn-first free/manual evidence support that uses owner exports, manual snapshots, and public page captures without paid APIs, logged-in scraping, or access-control bypassing.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add LinkedIn-specific collection guidance to the creator-media pack.
- Provide templates or skill guidance for owner-provided LinkedIn exports, profile snapshots, article/post snapshots, rich media evidence, recommendations, skills, and career timeline records.
- Define redaction guidance for sensitive export fields such as private contacts, messages, or relationship data.
- Add optional parsing/template support only where it can operate on local user-provided files.
- Route LinkedIn evidence into `creator-evidence-schema` and `creator-presence-dossier`.
- Document analytics as unavailable unless owner-provided; official company/page APIs are a later authorized lane, not a baseline dependency.

**Acceptance Criteria:**
- [x] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [x] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [x] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [x] Redaction and privacy handling are documented before analysis.
- [x] LinkedIn records normalize into the shared evidence schema and dossier.
- [x] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.

**Completed:** 2026-05-04. Hardened mirrored creator foundation skills for LinkedIn owner exports, manual snapshots, public unauthenticated captures, user-provided files, privacy redaction, unavailable analytics/API fields, forbidden scraping/API/private collection patterns, and dossier evidence classification. Updated creator-foundation, creator-media compatibility, README, and skills reference docs. Added deterministic layer1 coverage in `tests/layer1/creator-media-linkedin.test.ts`. Final validation passed with targeted scans, full layer1 tests, skill dependency/version/routing audits, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** LinkedIn access constraints are the highest-risk part of the expansion. Implement after the shared foundation and dossier exist so LinkedIn remains one evidence lane, not a special-case schema.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, security, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 14.1: Harden the LinkedIn baseline in the platform foundation skills.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`
  - Make owner exports, manual snapshots, public unauthenticated page captures, and user-provided files the default LinkedIn collection lane.
  - Treat LinkedIn personal analytics, company/page analytics, and API fields as unavailable unless owner-provided or already authorized.
  - Require redaction/exclusion guidance for private contacts, messages, relationship data, sensitive account data, and unrelated personal information before analysis.
  - Require high-risk LinkedIn surfaces to stop for user-provided evidence instead of attempting logged-in scraping, bot-protection bypass, paywall access, or access-control circumvention.
- Step 14.2: Make the creator presence dossier explicitly consume LinkedIn evidence without leaking private material.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Add LinkedIn evidence-register requirements for profile exports, profile snapshots, posts/shares, articles, rich media, recommendations, skills, positions, education, company pages, and manual/public snapshots when provided.
  - Require the dossier to classify LinkedIn evidence as public, owner-provided, admin-provided, internal notes, or mixed/redaction needed.
  - Route private or mixed LinkedIn material to redaction/exclusion before synthesis.
- Step 14.3: Update creator-media pack and discovery docs for the LinkedIn lane.
  - Classification: automated
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Document the LinkedIn-first lane as part of the existing matrix/schema/dossier workflow rather than a standalone scraper.
  - State that LinkedIn collection starts from owner exports, manual snapshots, public unauthenticated captures, and user-provided files.
  - State that paid APIs, logged-in scraping, bot-protection bypass, private-data collection, and access-control circumvention are out of scope.
- Step 14.4: Add focused validation coverage for LinkedIn lane contracts.
  - Classification: automated
  - Files: modify `tests/layer1/routing-graph.test.ts` or create `tests/layer1/creator-media-linkedin.test.ts`
  - Add layer1 checks that mirrored Claude/Codex creator-media contracts include LinkedIn baseline language, redaction/privacy language, normalized evidence routing, and forbidden access patterns.
  - Keep checks structural and deterministic; do not require network, LinkedIn credentials, or external exports.

### Green
- Step 14.5: Run focused validation for the LinkedIn evidence lane.
  - Classification: automated
  - Files: modify `tasks/todo.md`
  - Run targeted `rg` checks over creator-foundation pack skills and creator-media compatibility docs for owner export/manual snapshot/public capture baseline, redaction language, normalized schema/dossier routing, and forbidden scraping/API-first language.
  - Run `pnpm --dir tests test`.
  - Run `./scripts/skill-deps.sh --broken`.
  - Run `./scripts/skill-versions.sh --missing`.
  - Run `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Record exact command results in the `tasks/todo.md` review section and perform only concrete cleanup found by validation.

### Milestone: Phase 14 LinkedIn Evidence Lane
**Acceptance Criteria:**
- [x] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [x] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [x] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [x] Redaction and privacy handling are documented before analysis.
- [x] LinkedIn records normalize into the shared evidence schema and dossier.
- [x] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: Step 14.4 validation found two documentation wording gaps, which were fixed before the final validation gate.
- Tech debt / follow-ups: none.
- Ready for next phase: no; Phases 15-26 are already complete, so future work should come from discovery or a new roadmap phase.

## Phase 15: YouTube Video Audit ✓

**Goal:** Add an evidence-first single-video YouTube audit skill that analyzes public metadata, transcript/content, packaging, release timing, comments, and optional owner analytics for one video.

**Source Spec:** User request and YouTube API/docs research on 2026-05-03.

**Scope:**
- Add mirrored Claude/Codex `youtube-video-audit` skill definitions to the creator-media pack.
- Default to public evidence through `yt-dlp`, public transcript tooling, and optional YouTube Data API enrichment when `YOUTUBE_API_KEY` is already available.
- Support optional owner-provided analytics exports or OAuth/API output for retention, impressions/CTR, traffic sources, watch time, average view duration, subscriber change, shares, and time-series performance.
- Persist raw evidence under `research/youtube/data/<video-id>/` and write `research/youtube/video-audit-<video-id>-YYYY-MM-DD.md`.
- Wire pack docs and discovery references so single-video work routes to `youtube-video-audit` without replacing channel-level `youtube-channel-audit`.

**Acceptance Criteria:**
- [x] `youtube-video-audit` exists for both Claude and Codex.
- [x] The skill has a public-first evidence path and optional owner-analytics path.
- [x] The skill distinguishes public evidence from owner-provided/private analytics and records evidence gaps.
- [x] The report contract covers release timing, performance snapshot, packaging, hook/content structure, transcript evidence, comments/audience response, and prioritized fixes.
- [x] Creator-media docs/reference lists include `youtube-video-audit` and preserve the existing channel audit flow.
- [x] Validation passes with skill dependency/version checks and targeted routing scans.

**Parallelization:** serial
**Coordination Notes:** Keep this serial because it touches mirrored skills, pack routing, and docs. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-03. Mirrored Claude/Codex `youtube-video-audit` skills were added to the creator-media pack, documentation references now expose the single-video lane beside channel audits, and validation passed with dependency/version checks, targeted evidence-boundary scans, docs routing scans, and `git diff --check`.

## Phase 26: Monorepo Pack V1 ✓

**Goal:** Create a new `monorepo` pack that makes the skill library monorepo-aware using an augmentation injection pattern. V1 ships four skills (mono-detect, mono-exec, mono-ship, mono-guard) targeting pnpm workspaces + Turborepo, with a structured lane-spec artifact for parallel agent-team dispatch.

**Source Spec:** `specs/monorepo-execution-controller.md`

**Scope:**
- Create the `packs/monorepo/` pack structure with mirrored Claude/Codex skills.
- `mono-detect`: Workspace detection via `pnpm-workspace.yaml` and `turbo.json`, package graph output to `.agents/monorepo.json`.
- `mono-exec`: Augmented `/exec` with lane-spec generation, `/mono-guard` pre-flight, parallel worktree dispatch for package-scoped steps, serial execution for cross-cutting steps, stop-all-lanes failure semantics.
- `mono-ship`: Augmented `/ship` with package-scoped and transitive-dependent test/lint/build validation before shipping.
- `mono-guard`: Pack-local boundary enforcement consuming the lane-spec artifact for pre-flight and post-integration validation.
- Structured lane-spec artifact: `.agents/lane-specs.json` (machine-readable) + `tasks/lane-specs.md` (committed Markdown mirror) with lifecycle `draft → approved → dispatched → integrated | failed`.
- Detection script `scripts/mono-detect.sh` and validation script `scripts/lane-spec-validate.sh`.
- Script-based validation `scripts/monorepo-validate.sh` for contract compliance, lane-spec schema, and detection correctness.
- Test fixtures for monorepo detection and lane-spec validation.
- Pack docs (`PACK.md`), README registration, `docs/skills-reference.md` updates, and `docs/packs.md` updates.

**Acceptance Criteria:**
- [x] `mono-detect` correctly identifies pnpm workspaces and Turborepo, outputs `.agents/monorepo.json` with package list and dependency graph.
- [x] `mono-exec` generates lane specs from roadmap execution profiles, runs `/mono-guard` pre-flight, dispatches parallel worktree agents for package-scoped steps, and runs cross-cutting steps serially.
- [x] `mono-exec` stops all lanes on any lane failure and preserves worktree state.
- [x] `mono-ship` runs package-scoped and transitive-dependent tests/lint/build before delegating to `/ship`.
- [x] `mono-guard` validates lane-spec disjointness pre-flight and boundary compliance post-integration.
- [x] Lane-spec artifact follows JSON + Markdown mirror pattern with lifecycle tracking.
- [x] Skills defer to `turbo run` when `turbo.json` is present, fall back to `pnpm --filter` otherwise.
- [x] Mirrored Claude/Codex skill contracts exist for all v1 skills.
- [x] Pack structure registered in README, `docs/skills-reference.md`, and `docs/packs.md`.
- [x] Script-based validation passes for contracts, lane-spec schema, detection, and boundary checks.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**Completed:** 2026-05-04. Added the monorepo pack V1 with mirrored Claude/Codex `mono-detect`, `mono-exec`, `mono-ship`, and `mono-guard` skills, Codex metadata, detection and lane-spec validation scripts, pack validation script, committed fixtures, and discovery docs. Final focused validation passed with fixture-backed `monorepo-validate.sh`, direct lane-spec positive/negative checks, direct `mono-detect.sh` fixture runs, targeted contract scans, layer1 tests, skill dependency/version/routing audits, `git diff --check`, and the ship quality gate.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this creates a new pack with interdependent skills (detect → guard → run → ship). The lane-spec artifact design must be settled before run/guard can reference it. The pack also touches shared docs (README, skills-reference, packs.md).

**On Completion:**
- Deviations from plan: none.
- Tech debt / follow-ups: Monorepo Pack V2 remains deferred until V1 is validated in real use.
- Ready for next phase: yes.

## Phase 27: Analyze-Sessions Targeted Skill Retrospectives ✓

**Goal:** Extend the existing mirrored `analyze-sessions` skill so it can audit a particular skill's performance in a repository or active agent session, verify a user-identified mistake against session/code evidence, and recommend concrete skill-contract fixes that prevent the mistake from recurring.

**Source:** User request on 2026-05-05 asking for an analyze-sessions workflow that can evaluate a skill from `agentic-skills` or the invoking agent's repo/session directory and produce feedback after agent verification.

**Scope:**
- Preserve the current broad usage-history analysis behavior.
- Add a targeted skill-retrospective mode triggered by a named skill, skill path, repository path, session path, or mistake description.
- Teach the workflow to resolve skill definitions from `agentic-skills`, pack-local/project-local skill locations, and the invoking repo/session metadata.
- Require evidence-backed verification of the mistake before recommending fixes.
- Produce specific `SKILL.md` changes, validation checks, and lesson-capture recommendations without pretending unverifiable claims are proven.
- Mirror the updated contract for Claude and Codex.

**Acceptance Criteria:**
- [x] `global/codex/analyze-sessions/SKILL.md` documents targeted skill-performance retrospectives.
- [x] `global/claude/analyze-sessions/SKILL.md` documents the same targeted retrospective workflow.
- [x] The workflow distinguishes user-identified mistakes from agent-verified mistakes.
- [x] The workflow can scope evidence to the current repo/session directory before broad history scanning.
- [x] The output contract includes root cause, skill-contract fixes, validation checks, and confidence/evidence gaps.
- [x] Validation passes with mirrored contract checks, version checks, targeted text scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this updates mirrored global skills and shared task docs. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-05. Updated mirrored Claude/Codex `analyze-sessions` contracts to add targeted skill retrospectives while preserving broad history analysis. The new mode resolves skills from shared, pack-local, project-local, installed, and session-derived scopes; requires evidence before calling a user-reported mistake agent-verified; and outputs concrete skill fixes plus validation plans. Validation passed with install, targeted mirrored scans, skill dependency/version/routing audits, layer1 tests, and `git diff --check`.

## Phase 28: Session Triage Split ✓

**Goal:** Split the focused one-issue/session investigation behavior out of `analyze-sessions` into a distinct mirrored `session-triage` skill so broad trend analysis and immediate incident triage cannot be confused.

**Source:** User request on 2026-05-05 after Phase 27, noting that singular/plural command names like `analyze-session` and `analyze-sessions` could be mistaken for each other.

**Scope:**
- Restore `analyze-sessions` to broad cross-session trend, pattern, frustration, automation, and skill-performance-over-time analysis.
- Add mirrored Claude/Codex `session-triage` skills for one immediate issue, correction, repo/session incident, or skill failure.
- Route single-session or one-mistake requests from `analyze-sessions` to `session-triage` instead of handling them directly.
- Add Codex `agents/openai.yaml` metadata for `session-triage`.
- Update discovery docs, skill listing guidance, next-step contracts, and `targeted-skill-builder` references.
- Record the naming lesson so future split workflows avoid near-identical singular/plural command pairs.

**Acceptance Criteria:**
- [x] `analyze-sessions` no longer owns targeted skill retrospective or single-incident triage behavior.
- [x] `session-triage` exists for Claude and Codex with verification verdict, timeline, root cause, skill fix, validation plan, confidence, and evidence-gap outputs.
- [x] No `analyze-session` skill or alias is created.
- [x] Discovery docs and `skills` grouping include `session-triage`.
- [x] `targeted-skill-builder` distinguishes `$session-triage` for immediate incidents from `$analyze-sessions` for broad history analysis.
- [x] Validation passes with install, skill dependency/version/routing checks, layer1 tests, targeted scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches mirrored global skills and shared docs. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-05. Split immediate issue/session/correction investigations into mirrored `session-triage` skills, restored `analyze-sessions` to broad cross-session trend analysis, added Codex agent metadata, updated discovery and routing references, and recorded the naming lesson. Validation passed with install, skill dependency/version/routing checks, layer1 tests, targeted `rg`/directory scans, and `git diff --check`.

## Phase 29: Live Skill Harness ✓

**Goal:** Add an opt-in live-agent test harness that invokes Claude and Codex headlessly in controlled temporary repos, validates structured outputs, and catches skill-behavior regressions that structural tests cannot see.

**Source:** User request on 2026-05-06 asking for thorough live skill testing through Claude `-p` and Codex headless execution.

**Scope:**
- Add a layer3 Vitest project for live agent behavior tests.
- Keep live tests opt-in with an environment flag so routine `pnpm test` remains fast and does not spend model budget.
- Add reusable harness helpers for temp git fixtures, JSON schemas, Claude `-p`, and `codex exec`.
- Add session-analysis behavior scenarios covering broad trend routing, single-incident triage, required triage report fields, and the forbidden `analyze-session` alias.
- Add package scripts and docs describing how to run the live tests.

**Acceptance Criteria:**
- [x] `pnpm --dir tests test` still runs only fast layer1 tests by default.
- [x] `pnpm --dir tests test:live` runs the live layer3 suite when `LIVE_AGENT_TESTS=1` is set.
- [x] Live tests can target Claude, Codex, or both through documented environment flags.
- [x] Live tests use temporary repos and do not mutate tracked repo files.
- [x] Session-analysis live tests assert structured outputs for `analyze-sessions` and `session-triage`.
- [x] Validation passes with layer1 tests, skipped live-test dry run, live Claude/Codex runs, and skill contract scripts.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared test infrastructure and package scripts. Do not add dependencies unless strictly necessary.

**Completed:** 2026-05-06. Added opt-in layer3 live-agent tests with reusable Claude/Codex headless runners, temp repo fixtures, structured JSON schemas, and session-analysis behavior assertions. Added scripts for all live tests and Claude/Codex-only targets, documented usage in README, and kept default tests on layer1 only. Validation passed with layer3 skipped dry run, live Claude and Codex runs, layer1 tests, skill contract scripts, and `git diff --check`. `tsc --noEmit` remains outside the validation gate because the existing tests package lacks Node type definitions.

---

## Phase 40: Workflow Hybrid Replay Pilot

**Goal:** Turn the `/workflows` Playful Lab into a hybrid chat-and-terminal replay pilot where step circles drive a compelling, benchmark-grounded recreation of successful skill runs.

**Source:** `specs/workflow-hybrid-replay-feature-interview.md` and the updated `/workflows` section of `specs/ui-skills-showcase-website.md` from 2026-05-17.

**Scope:**
- Replace the current primary step-card presentation in `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx` with a hybrid replay panel for the `/workflows` route.
- Keep `/workflows` as the pilot surface only; do not update homepage preview, catalog, or benchmark matrix visuals in this phase.
- Model workflow steps as structured replay states instead of expanding the positional `WorkflowStep` tuple.
- Render chat-style user and agent messages with embedded terminal, validation, artifact, and benchmark-proof blocks.
- Promote benchmark evidence from collapsed details into visible receipt blocks when persisted evidence exists.
- Preserve graceful non-benchmarked step states, reduced-motion behavior, keyboard-accessible step controls, and mobile overflow safety.

**Non-Goals:**
- Do not redesign homepage, catalog, packs, follow, inspect, or `/benchmarks` route surfaces.
- Do not change benchmark harness semantics or generate new benchmark reports.
- Do not add runtime dependencies or modify shared lockfiles.
- Do not create, modify, or recommend GitHub Actions.

**Acceptance Criteria:**
- [x] `/workflows` renders a hybrid replay panel as the primary selected-step surface.
- [x] Step circles change the active replay state and expose user prompt/command, agent response, artifact/result, and proof content for each step.
- [x] Benchmarked steps show visible pass-rate, quality, agent/exec metadata, and report/exec artifact paths without requiring a collapsed details panel.
- [x] Non-benchmarked steps render curated scenario transcript content and a clear no-receipt state.
- [x] The implementation uses structured replay data rather than adding more positional fields to `WorkflowStep`.
- [x] Mobile layouts constrain chat, command, report path, and benchmark output blocks without horizontal page overflow.
- [x] Focused component/data tests, typecheck, build, and whitespace validation pass.

**Parallelization:** serial
**Coordination Notes:** Keep serial because the work is a visual/data-model pilot in one tightly coupled component family: `TuiWorkflow.tsx`, `workflow-data.ts`, `workflow.css`, shared showcase types, and focused tests. The design needs one integration owner to preserve the pilot's visual coherence.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** UX, tests, data contract, accessibility

**Subagent lanes:** none

### Implementation
- [x] Step 40.1: Define structured replay data for workflow steps.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/workflow-data.ts`, modify `apps/skills-showcase/src/showcase/types.ts` if shared replay or receipt types are needed
  - Add a replay-oriented data shape with user message, agent message, terminal/proof block, artifact/result block, and optional benchmark receipt state.
  - Keep existing workflow metadata available for notebook context and homepage preview support.
  - Avoid adding more positional tuple fields to `WorkflowStep`.
- [x] Step 40.2: Replace the active step card with the hybrid replay panel.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
  - Render chat-style user/agent messages as the primary active-step content.
  - Embed terminal/proof and artifact/result blocks inside the replay.
  - Keep step circles, play/pause, previous/next, restart, reduced-motion behavior, and notebook context working.
- [x] Step 40.3: Promote benchmark receipts into the visible replay.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Use existing `workflowBenchmarks` data to show pass rate, quality, agent, run index, report path, and run artifact path when available.
  - Remove or demote the collapsed `View benchmark execution` details panel from the primary benchmarked-step experience.
  - Ensure no-receipt states are explicit for non-benchmarked steps.
- [x] Step 40.4: Style and harden the `/workflows` replay pilot.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Style chat messages, terminal/proof blocks, artifact/result blocks, and benchmark receipts within the existing playful blueprint theme.
  - Preserve mobile stacking and prevent horizontal overflow from long commands, report paths, and benchmark excerpts.
  - Preserve accessible focus states and readable contrast.

### Green
- [x] Step 40.5: Write focused regression coverage for the replay pilot.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/workflows.test.tsx`, modify `tests/layer1/skills-showcase-benchmark-demo.test.ts` if generated data contract assertions need updates
  - Cover replay data presence, active-step rendering, step-circle navigation, benchmark receipt rendering, and non-benchmarked receipt state.
- [x] Step 40.6: Run app validation and visual sanity checks.
  - Classification: automated
  - Files: modify `tasks/todo.md` with review results
  - Run `pnpm --dir apps/skills-showcase test`.
  - Run `pnpm --dir apps/skills-showcase typecheck`.
  - Run `pnpm --dir apps/skills-showcase build`.
  - Run `scripts/validate-skills-showcase-data.sh` if generated data or showcase assets change.
  - Run `git diff --check`.
  - Start the local app if needed and verify `/workflows` at desktop and mobile widths before shipping.

### Milestone: Phase 40 Workflow Hybrid Replay Pilot
**Acceptance Criteria:**
- [x] `/workflows` renders a hybrid replay panel as the primary selected-step surface.
- [x] Step circles change the active replay state and expose user prompt/command, agent response, artifact/result, and proof content for each step.
- [x] Benchmarked steps show visible pass-rate, quality, agent/exec metadata, and report/exec artifact paths without requiring a collapsed details panel.
- [x] Non-benchmarked steps render curated scenario transcript content and a clear no-receipt state.
- [x] The implementation uses structured replay data rather than adding more positional fields to `WorkflowStep`.
- [x] Mobile layouts constrain chat, command, report path, and benchmark output blocks without horizontal page overflow.
- [x] Focused component/data tests, typecheck, build, and whitespace validation pass.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**Completed:** 2026-05-17. `/workflows` now uses structured replay data, chat-style user/agent messages, embedded terminal/result blocks, visible benchmark receipts, and curated no-receipt states. Step-circle navigation, app tests, typecheck, production build, whitespace validation, and Safari desktop/mobile visual sanity checks passed. Next phase: Phase 41 remaining benchmark result coverage.

---

## Post-Phase Tail Work

- **2026-05-18 — Workflow demo user-goal and run excerpts:** Refine `/workflows` transcript turns so each scenario leads with the user's goal for using that workflow and benchmark-backed turns render retained prompt/output excerpts from persisted runs where available.
- **2026-05-14 — Skills Showcase Playful Lab sitewide refactor plan:** Evaluate whether to refactor the full Skills Showcase UI around the Playful Lab / playful blueprint direction rather than only the `/workflows` player. Scope includes replacing legacy card-heavy route, catalog, pack, proof, follow, and benchmark surfaces with lab-style ledgers, rails, lane maps, notebook panels, and inspection drawers before implementation.
- **2026-05-01 — Creator-media packaging/search/cadence skills:** Added focused YouTube strategy skills for title/thumbnail audit, search positioning, and cadence diagnosis so the pack can turn channel audit and peer benchmark evidence into packaging fixes and programming inputs.
- **2026-05-12 — YouTube concept research skill:** Add a concept-first YouTube research workflow to `youtube-ops` that starts from a proposed video concept, finds direct and adjacent successful comparables, separates public evidence from performance hypotheses, and produces differentiated execution lessons before scripting or production.
- **2026-05-13 — Benchmark `session-triage`:** Run `$benchmark-test-skill session-triage` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier1-workflows.setup.ts`.
- **2026-05-13 — Agent-review `session-triage` benchmark:** Run `$benchmark-agent-review session-triage` over the latest persisted Claude/Codex benchmark outputs, grade generated artifacts against the subjective review rubric, write `benchmark/review-session-triage-2026-05-13.md`, validate, commit, and push.
- **2026-05-13 — Tighten `session-triage` over-remediation rubric:** Update the custom benchmark quality rubric so one-off noncompliance with an adequate validation contract cannot keep an acceptable quality score when it routes to unconditional skill or contract edits.
- **2026-05-14 — Benchmark `content-programming` fresh full-contract run:** Run `$benchmark-test-skill content-programming` after the full-contract coverage and fixture-evidence rubric fixes, write the dated benchmark report, refresh generated showcase evidence, validate, commit, and push.
- **2026-05-14 — Agent-review `content-programming` fresh full-contract benchmark:** Review the latest Claude/Codex `content-programming` outputs after the full-contract benchmark run, refresh the dated review report, regenerate showcase data, validate, commit, and push. Result: six evaluated outputs reviewed, median subjective score 92.0, range 90-94, no remediation required. Recommended next command: `$ship`.
- **2026-05-14 — Benchmark `icon-handler` fresh rerun:** Run `$benchmark-test-skill icon-handler` after the valid-source-asset fixture fix, write the dated benchmark report, validate, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 2/3 hard assertions passing and no infrastructure blocks. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next command: `$session-triage icon-handler benchmark failure`.
- **2026-05-14 — Triage `icon-handler` benchmark failure:** Investigate the fresh failed Claude/Codex benchmark assertions, classify contract versus harness versus runner noncompliance, write a dated triage report, validate, commit, and push. Result: verified mixed failure; primary durable gap is benchmark route clarity, while Codex no-artifact run is runner noncompletion. Report: `benchmark/triage-icon-handler-2026-05-14.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark route clarity`.
- **2026-05-14 — Tighten `icon-handler` benchmark route clarity:** Update the custom benchmark prompt/rubric so build commands remain verification commands and the final next route must be `/icon-handler fix ...` for Claude or `$icon-handler fix ...` for Codex. Result: added final-route evaluator coverage, switched the source fixture to SVG to avoid Claude image ingestion, and passed Claude/Codex smoke benchmarks. Recommended next command: `$benchmark-test-skill icon-handler`.
- **2026-05-16 — Benchmark `ship`:** Run `$benchmark-test-skill ship` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 3/3 hard assertions passing and no infrastructure blocks, but both had deterministic quality critical failures on `evidence-linked`. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$session-triage ship benchmark failure`.
- **2026-05-17 — Benchmark `update-packages`:** Run `$benchmark-test-skill update-packages` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- **2026-05-17 — Triage `update-packages` benchmark failure:** Investigate the failed both-agent benchmark, classify contract versus harness versus runner causes, write a dated triage report, validate, commit, and push. Focus on `$exec` route failures, age-gate evidence, stale-run contract version, and fixture false positives around `package-lock.json`.
- **2026-05-18 — Benchmark `update-packages` fresh run:** Run `$benchmark-test-skill update-packages` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- **2026-05-18 — Benchmark `update-packages` fresh rerun:** Run `$benchmark-test-skill update-packages` again against the current repository state, write/update the dated deterministic both-agent benchmark report, refresh generated evidence if needed, validate, commit, and push.
- **2026-05-19 — Benchmark `update-packages` fresh rerun:** Run `$benchmark-test-skill update-packages` against the current repository state after the socket transport classification follow-up, write the dated deterministic both-agent benchmark report, refresh generated evidence if needed, validate, commit, and push.
- **2026-05-19 — Agent review `update-packages` fresh rerun:** Review the latest persisted Claude/Codex `update-packages` benchmark outputs, score retained artifacts for operator ergonomics, write the dated review report, refresh generated evidence, validate, commit, and push.
- **2026-05-19 — Targeted `update-packages` benchmark lockfile ordering fix:** Tighten the benchmark quality rubric so unsafe npm-to-pnpm lockfile deletion order is rejected, while preserving retained positive batch-actionability shapes.

## Phase 43: Benchmark Fixture Remediation — Route Assertions & Domain Criteria ✓

**Goal:** Fix the two systemic benchmark failure patterns discovered during Batches 41.3 and 41.5 so passing skills actually pass and quality scores reflect real agent capability rather than fixture/rubric gaps.

**Source:** Benchmark results from Batches 41.3 Groups 1-3 (33 Tier 2 global skills, Claude 0% pass rate) and Batch 41.5 Group 1 (10 pack-local skills, 100% pass rate but domain criteria scoring 0%).

**Problem Statement:**
1. **Route assertion failures (high impact):** Tier 2 global skills have near-universal `Output recommends $exec` assertion failures because fixture prompts lack explicit route guidance. This is the single root cause behind Claude's 0% pass rate across 33 global skills. Codex passes on a few skills where it happens to produce the expected route.
2. **Domain-specific quality criteria (medium impact):** Pack-local skills score 0% on domain criteria like `business-ops-context`, `customer-lifecycle-context`, `creator-media-context`, and `business-discovery-context`. The fixture prompts don't provide enough domain context for agents to satisfy these criteria, or the rubric expectations are too narrow.

**Scope:**
- Update fixture prompts in `tests/layer4/setups/tier23-global-workflows.setup.ts` to include explicit next-step route expectations so agents know to recommend `$exec`.
- Update fixture prompts in `tests/layer4/setups/packs/pack-workflows.setup.ts` to include domain context or loosen domain-specific quality rubric criteria to match what agents can reasonably produce from the fixture alone.
- Re-benchmark a representative sample of affected skills after each fix category to validate improvement.
- Do not change skill contracts (SKILL.md files) — this is a test fixture/rubric issue, not a skill behavior issue.

**Non-Goals:**
- Do not re-benchmark all 158 skills — pick a representative sample per fix category.
- Do not change the benchmark harness infrastructure or evaluator logic.
- Do not fix individual skill-specific assertion failures that aren't part of the two systemic patterns.

**Acceptance Criteria:**
- [x] Route assertion fix: fixture prompts in `tier23-global-workflows.setup.ts` include explicit route guidance.
- [x] Route assertion validation: a representative sample of previously-failing Tier 2 global skills now pass hard assertions for both agents.
- [x] Domain criteria fix: fixture prompts in `pack-workflows.setup.ts` include domain context, or domain rubric criteria are loosened to match fixture capabilities.
- [x] Domain criteria validation: a representative sample of pack-local skills score >0% on previously-failing domain criteria.
- [x] Generated data refreshed and all validation passes after fixes.

**Parallelization:** serial (fixture changes affect shared setup files; re-benchmarks must run after fixes)

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high (shared setup files used by all benchmarks)
**Review gates:** fixture audit, re-benchmark validation

### Implementation
- [x] Step 43.1: Audit route assertion failures across Tier 2 global skill fixtures.
  - Classification: automated
  - Files: read `tests/layer4/setups/tier23-global-workflows.setup.ts`
  - Catalog which fixture prompts lack route guidance and what the expected route should be per skill.
- [x] Step 43.2: Add explicit route guidance to Tier 2 global skill fixture prompts.
  - Classification: automated
  - Files: modify `tests/layer4/setups/tier23-global-workflows.setup.ts`
  - Add clear next-step route expectations to each fixture prompt so agents produce `$exec` or the skill-specific route.
- [x] Step 43.3: Re-benchmark a representative sample of Tier 2 global skills.
  - Classification: automated
  - Pick ~5 previously-failing skills and run `pnpm bench --skill <skill> --agent both --runs 3 --chunk-size 3 --pause 0`.
  - Write updated benchmark reports.
- [x] Step 43.4: Audit domain-specific quality criteria across pack-local skill fixtures.
  - Classification: automated
  - Files: read `tests/layer4/setups/packs/pack-workflows.setup.ts`
  - Catalog which domain criteria score 0% and whether the fix is fixture enrichment or rubric loosening.
- [x] Step 43.5: Fix domain-specific quality criteria in pack-local skill fixtures.
  - Classification: automated
  - Files: modify `tests/layer4/setups/packs/pack-workflows.setup.ts`
  - Enrich fixture prompts with domain context or adjust rubric criteria thresholds.
- [x] Step 43.6: Re-benchmark a representative sample of pack-local skills.
  - Classification: automated
  - Pick ~5 previously-low-scoring skills and re-benchmark.
  - Write updated benchmark reports.
- [x] Step 43.7: Refresh generated data and validate.
  - Classification: automated
  - Files: regenerate `docs/benchmark-results-matrix.md`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`
  - Run `scripts/validate-skills-showcase-data.sh`, `pnpm --dir tests bench:coverage`, `git diff --check`.

### Milestone: Phase 43 Benchmark Fixture Remediation
**Acceptance Criteria:**
- [x] Route assertion fix applied and validated with representative re-benchmarks.
- [x] Domain criteria fix applied and validated with representative re-benchmarks.
- [x] Generated data refreshed and all validation passes.
- [x] No regressions in previously-passing skills.

---

## Deferred / Future Work
- **Remembered GitHub freshness preference (2026-05-27)** — teach `$sync` to ask once for GitHub freshness checks and remember the machine-wide preference, while keeping plain sync non-mutating and adding explicit `init-agentic-skills update/latest` refresh behavior.
- **Hard-rename initialization surface (2026-05-27)** — replace `install-agentic-skills` / `install.sh` with `init-agentic-skills` / `init.sh` as the first-time setup interface, without compatibility aliases.
- **Exclude archived skills from `$` preview (2026-05-27)** — active installed skill roots should be archive-free managed directories, while explicit pins continue to point at `archive/<version>`.
- **Skill structure best-practice audit (2026-05-27)** — preserve the current `global/{claude,codex}` and `packs/<pack>/{claude,codex}` model while tightening repo-local anatomy guidance, archive/changelog hygiene, and validation semantics so active-skill audits ignore historical archive noise.
- **Alignment YAML clipboard UX (2026-05-24)** — tighten every active HTML alignment-page contract so compiled YAML is copied automatically when possible and always has an explicit copy-to-clipboard control; validate with broad layer1 contract tests.
- **Kanban analytics** — cycle time, throughput, WIP limits via `/kanban-stats` skill (from original backlog)
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push (from original backlog)
- **Kanban card labels** — tags/labels field for filtering by type (deferred to after Phase 8)
- **Multi-project kanban dashboard** — cross-board view (larger initiative, deferred)
- **Add Codex poketo-kanban skill** — parity item, low priority
- **Cross-tool portability layer** — single-source skill generation (larger initiative)
- **Workflow orchestrator / meta-skill** — guided pipeline execution (larger initiative; partially addressed by Phase 26 monorepo pack)
- **Monorepo Pack V2** — planning skills (mono-roadmap, mono-plan-phase, mono-spec-interview), analysis skills (mono-affected, mono-debug, mono-trace, mono-investigate), and mono-migrate (single-app → monorepo migration with guided execution). Deferred until V1 is validated in real use.
- **Session continuity automation** — `/resume` skill for cold-start (medium effort)

## Cross-Phase Concerns
### Integration Tests
- All new tests must pass alongside existing 24 kanban.mjs tests
- Phase 6-7 tests should be runnable via `vitest` with existing config
### Non-Functional Requirements
- No credentials in test fixtures or tracked files
- Test suites must clean up after themselves (delete test boards/cards)

## Immediate Task - Global Launcher Repo-Root Resolution 2026-05-29

**Objective:** Fix copied global launcher installs so they resolve the real repository checkout through managed-install provenance instead of deriving `$HOME` from the copied skill path.

**Implementation Plan:**
- [x] Confirm current launcher behavior and existing tests for `pack` and `init-agentic-skills`.
- [x] Add inline repo-root resolvers to:
  - `global/claude/pack/scripts/pack.sh`
  - `global/codex/pack/scripts/pack.sh`
  - `global/claude/init-agentic-skills/scripts/init-agentic-skills.sh`
  - `global/codex/init-agentic-skills/scripts/init-agentic-skills.sh`
- [x] Resolve source-tree roots first using `SKILL_DIR/../../..`; if invalid, read `source=` from `$SKILL_DIR/.agentic-skills-managed` and resolve that source path back to the checkout root.
- [x] Validate the resolved root contains `scripts/pack.sh` for pack launchers and `init.sh` for init launchers before delegation.
- [x] Emit a clear non-zero error before `exec` when neither source-tree nor provenance resolution is valid.
- [x] Archive and bump mirrored skill contracts: `pack` v0.1 to v0.2 and `init-agentic-skills` v0.3 to v0.4, with changelog entries.
- [x] Add layer1 regression coverage for copied managed launcher installs across Claude and Codex.
- [x] Refresh global installs with `bash init.sh` and run focused validation plus whitespace checks.

**Acceptance Criteria:**
- [x] Copied `~/.claude/skills/pack` and `~/.codex/skills/pack` launchers can run `status` from the managed install.
- [x] Copied `~/.claude/skills/init-agentic-skills` and `~/.codex/skills/init-agentic-skills` launchers report the real checkout path, not `$HOME`.
- [x] Existing source-tree launcher execution still works.
