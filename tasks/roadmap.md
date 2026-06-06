## Current Investigation — Skills That Should Be Scripts

### Goal

Validate whether the "Skills That Should Be Scripts" research matches the repository evidence, classify which claims are confirmed versus overstated, and identify the root problem behind script-shaped skills.

### 2026-06-06 Follow-up Scope

Re-verify the script-shaped skill opportunity with current repo evidence, focusing on downstream/manual script readiness, alignment-page maintenance, and deterministic skill surfaces. Do not implement opportunities in this pass.

### Plan

1. Capture the visible `investigate` invocation and task checklist.
2. Inventory `scripts/` and validate the reported standalone-tool claims.
3. Inspect named skill contracts for pure delegation, static insertion, deterministic orchestration, or real LLM judgment.
4. Compare the `pack` skill and `pack.sh` specifically because it is the strongest example.
5. Report confirmed claims, corrections, portability risks, and the practical recommendation without changing skill behavior.

## Active Plan — Add `user-flow-map` And Refactor AFPS Routing

### Goal

Add a mirrored `product-design` planning skill named `user-flow-map` and make AFPS route from positioning into concrete user-flow structure before UI requirements, layout variants, prototypes, UAT, consolidation, production specs, and roadmap work.

### Execution Plan

1. Preserve invocation context and task tracking.
   - [x] Capture the visible `targeted-skill-builder` invocation under `prompts/targeted-skill-builder/`.
   - [x] Record implementation progress and validation results in `tasks/todo.md`.
2. Inspect current routing and overlap.
   - [x] Check whether any existing skill already owns user-flow mapping.
   - [x] Read product-design skill conventions, routing docs, research-roadmap rules, alignment generator, and benchmark coverage patterns.
3. Create the new skill mirrors.
   - [x] Add `packs/product-design/codex/user-flow-map/` and `packs/product-design/claude/user-flow-map/`.
   - [x] Include `SKILL.md`, `CHANGELOG.md`, `agents/openai.yaml`, and generated `ALIGNMENT-PAGE.md` for both mirrors.
   - [x] Ensure the skill outputs `specs/user-flow-[topic].md`, `user-flow-[topic]-interview.md`, and `alignment/user-flow-map-{topic}.html`.
4. Refactor AFPS routing and documentation.
   - [x] Update pack workflow docs, skill next-step contracts, skills reference, product-design `PACK.md`, and global skill browser mappings.
   - [x] Archive and bump existing skill mirrors before editing their `SKILL.md` contracts.
   - [x] Update positioning, UI interview, UX variations, prototype, spec interview, and research-roadmap routing.
5. Update generated assets and benchmark coverage.
   - [x] Add `user-flow-map` to the alignment generator and regenerate alignment-page stubs.
   - [x] Add benchmark coverage metadata or an explicit deferred coverage path.
   - [x] Regenerate showcase data and validate the public skill catalog artifacts.
6. Verify and ship.
   - [x] Run skill integrity checks, generated drift checks, benchmark coverage, tests, targeted `rg` route checks, and `git diff --check`.
   - [x] Record validation results in `tasks/todo.md`.
   - [x] Commit and push the intended changes.

### Design Constraints

- Keep `user-flow-map` as flow structure and low-fidelity wireframe guidance, not visual design or runnable prototype work.
- Preserve existing user changes and avoid staging generated local skill roots.
- Maintain the new AFPS route:

```text
icp -> competitive-analysis -> journey-map -> positioning
-> user-flow-map
-> ui-interview --requirements-only
-> ux-variations --layout-mode
-> prototype
-> uat --variant-evaluation
-> consolidate-variations
-> research-roadmap --post-prototype
-> spec-interview
-> research-roadmap --post-spec
-> roadmap
```

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

## Deferred / Future Work
- **Remembered GitHub freshness preference (2026-05-27)** — teach `$sync` to ask once for GitHub freshness checks and remember the machine-wide preference, while keeping plain sync non-mutating and adding explicit `init-agentic-skills update/latest` refresh behavior.
- **Hard-rename initialization surface (2026-05-27)** — replace `install-agentic-skills` / `install.sh` with `init-agentic-skills` / `init.sh` as the first-time setup interface, without compatibility aliases.
- **Exclude archived skills from `$` preview (2026-05-27)** — active installed skill roots should be archive-free managed directories, while explicit pins continue to point at `archive/<version>`.
- **Skill structure best-practice audit (2026-05-27)** — preserve the current `global/{claude,codex}` and `packs/<pack>/{claude,codex}` model while tightening repo-local anatomy guidance, archive/changelog hygiene, and validation semantics so active-skill audits ignore historical archive noise.
- **Orchestrator refactor investigation: `growth-model` (2026-06-06)** — investigate decomposing into a Pattern A (Framework Decomposition + Synthesis) orchestrator with `frameworks/acquisition-loop`, `frameworks/retention-loop`, `frameworks/monetization-loop` subskills. Currently 356 lines with three distinct Reforge-style loop methodologies that produce independent analysis merged at synthesis. Strongest candidate.
- **Orchestrator refactor investigation: `platform-strategy` (2026-06-06)** — investigate decomposing into a Pattern A orchestrator with `frameworks/vertical-expansion` and `frameworks/horizontal-expansion` subskills, with scoring + portfolio sequencing handled by synthesis. Currently 461 lines with two genuinely different analytical lenses. Moderate candidate.
- **Orchestrator refactor investigation: `pmf-assessment` (2026-06-06)** — investigate decomposing into a Pattern A orchestrator with quantitative (Sean Ellis survey design) and qualitative (signal analysis) framework subskills. Currently 406 lines. Two frameworks is thin for an orchestrator; assess whether the split improves modularity enough to justify the overhead.
- ~~**Orchestrator convention: document Pattern B and C (2026-06-06)**~~ — done. Extended `docs/orchestrator-convention.md` with Pattern B (Intent Router + Play Composer), Pattern C (Detect-and-Route), Thin Workflow Router variant, pattern comparison table, and decision guide. Updated `skill-invocation-types.md` with youtube classification and `skill-anatomy.md` cross-reference.
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
