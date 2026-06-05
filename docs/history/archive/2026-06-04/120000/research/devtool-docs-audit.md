# Devtool Docs Audit - agentic-skills (2026-06-02 Refresh)

Scope: this refresh audits developer-facing documentation for the `agentic-skills` shared skill library for Claude Code and OpenAI Codex. It is grounded in `README.md`, `docs/skills-reference.md`, `docs/packs.md`, `docs/codex-workflow.md`, `docs/operating-modes.md`, `docs/pack-workflow-matrix.md`, `docs/test-harness.md`, `init.sh`, `scripts/pack.sh`, `scripts/approved-plan.sh`, and the existing devtool research chain under `research/devtool-*.md`.

Continuity: this is a recurring documentation audit, not a rewrite plan. It updates the earlier docs audit, which had become partially stale after the global installer shifted from `install.sh` language to `init.sh` and after project-pack docs became more detailed.

## Executive Verdict

P0: none. The current docs are not missing the basic install, pack, restart, or mode concepts needed by an experienced shell user.

P1: the activation path is still too implicit. A reader can learn commands, but the docs still do not give a single first-success route from clone to visible proof.

P1: troubleshooting remains fragmented. Restart, refresh, mode, approval-packet, drift, and validation recovery are documented, but not in one symptom-led support path.

P1: proof/example artifacts are strong but under-used. `tasks/history.md`, benchmark outputs, Skills Showcase generated proof data, and devtool research artifacts demonstrate real usage, but README does not present them as the adoption proof path.

P2: script references are better than before, but still split across multiple docs. The most common commands are covered; exact "which script answers which question" guidance is still scattered.

P2: team rollout guidance is still research-only. Public docs cover `.agents/project.json` and refresh behavior, but not a concise team checklist for checkout path, generated roots, restart expectations, and direct-to-primary workflow policy.

P2: stale `install.sh` references remain in the devtool research chain. README and skills reference now correctly use `./init.sh`, but dogfood research artifacts still describe the old installer name and are likely to confuse readers if promoted as examples.

## Findings

### P1 - First-success route is still implicit

Claim: README and workflow docs explain the pieces, but they do not package a fastest proof path.

Evidence:
- `README.md` opens with `./init.sh`, then lists pack install commands and explains CLI reload/restart behavior.
- `docs/codex-workflow.md` explains `$exec` as the Codex execute-and-ship loop and names `tasks/todo.md` as the default execution queue.
- `rg "First successful|First successful cycle" README.md docs/*.md` returns no first-success section.
- `docs/skills-reference.md` explains showcase freshness and benchmark coverage, but those are maintenance references rather than an activation path.

Inference: a motivated developer can assemble the path, but the docs still require them to infer the sequence: initialize globals, install a pack in a project, restart or reload the CLI, verify pack status, create or inspect a task queue, run the execution loop, and confirm `tasks/history.md` or a commit changed.

Decision impact: add a README "First successful cycle" section before larger docs work. Keep it command-first and end in visible artifacts.

Recommended shape:

```text
1. Clone this repo and run ./init.sh.
2. In a target project, run scripts/pack.sh install <pack-or-skill>.
3. Restart Claude Code or start a fresh Codex session if the skill list is stale.
4. Run /pack or $pack, or scripts/pack.sh status, to confirm the project designation.
5. If tasks/todo.md is missing, run a planning skill first: /roadmap, $roadmap, /research-roadmap, or $research-roadmap as appropriate.
6. Run /exec or $exec and confirm a checked task, a tasks/history.md entry, and a commit/push.
```

### P1 - Troubleshooting is present as fragments, not a support path

Claim: the repo documents important recovery facts, but a user with a symptom still has to search across several files.

Evidence:
- `README.md` says `scripts/pack.sh refresh` does not force active CLI skill registries to reload and distinguishes Claude reload/clear/restart from Codex fresh sessions.
- `docs/packs.md` explains committed `.agents/project.json`, uncommitted generated roots, `doctor`, `refresh`, stale installs, pinned installs, and update mode.
- `docs/operating-modes.md` documents approval-packet lifecycle, mode resolution, `jq` failure handling, and hybrid degraded paths.
- `docs/skills-reference.md` lists skill metadata checks, benchmark coverage freshness, and showcase generation validation.
- No `docs/troubleshooting.md` exists, and `rg "Troubleshooting" README.md docs/*.md` does not find a central symptom table.

Inference: troubleshooting content exists, but it is organized by subsystem rather than by user failure. That is fine for maintainers and weak for first-time adopters.

Decision impact: add `docs/troubleshooting.md` or a README troubleshooting subsection. The highest-value format is a table: symptom, likely cause, command to run, expected result, and next fix.

Minimum rows:
- Skill installed but not visible -> restart/reload active CLI, then `scripts/pack.sh status`.
- Project-local roots stale or broken -> `scripts/pack.sh doctor`, then `scripts/pack.sh refresh`.
- Global skills stale -> `global/codex/init-agentic-skills/scripts/init-agentic-skills.sh doctor`, then `./init.sh` or the documented init skill mode.
- Skill references broken -> `./scripts/skill-deps.sh --broken`.
- Version metadata missing -> `./scripts/skill-versions.sh --missing`.
- Hybrid approved packet rejected -> `scripts/approved-plan.sh check`, inspect lifecycle, `git_head`, `todo_hash`, dirty paths, manual blockers, TTL, mode, and `jq`.
- Checkout moved -> rerun `scripts/pack.sh refresh` in consumer repos and start a fresh CLI session.

### P1 - Proof artifacts are strong but under-presented

Claim: the repo has credible dogfood proof, but the landing docs do not point readers to a short proof trail.

Evidence:
- `tasks/history.md` is a dense shipped-work log with dated entries, validation details, and commit-oriented outcomes.
- `research/devtool-*.md` shows the devtool pack used against this repo.
- `docs/benchmark-results-matrix.md` is generated on 2026-06-02 and records benchmark reports by skill.
- `docs/skills-showcase/assets/github-proof-data.js` includes proof entries that point at `tasks/history.md`.
- `README.md` does not have a "Proof", "Examples", or "Examples to inspect" section.

Inference: the repo has stronger proof than the docs advertise. A skeptical adopter has to know where to look.

Decision impact: add a README "Proof and examples" block linking to `tasks/history.md`, selected `research/devtool-*.md` artifacts, `docs/benchmark-results-matrix.md`, and the Skills Showcase asset/data contract. Keep the claim precise: self-dogfooded, local-first, inspectable, benchmarked in places, not universally behavior-proven.

### P2 - Script reference is scattered

Claim: common script commands are documented, but they are spread across README, pack docs, skills reference, operating modes, and test harness docs.

Evidence:
- `README.md` documents `./init.sh`, pack install/remove/status/which, version pinning, archive audit, validation, and live test commands.
- `docs/packs.md` documents pack command usage, drift tracking, pin/unpin, update mode, and session-start hook behavior.
- `docs/skills-reference.md` documents skill catalog, showcase freshness, benchmark coverage freshness, and global/pack skill lists.
- `docs/operating-modes.md` documents `scripts/agent-mode.sh` and approval-packet behavior.
- `docs/test-harness.md` documents `pnpm verify`, `pnpm bench`, and benchmark report locations.

Inference: maintainers can find the details, but new contributors lack a compact command index that answers "what command do I run for this state?"

Decision impact: add `docs/scripts-reference.md` or expand `docs/skills-reference.md` with a script reference table.

Suggested table groups:
- Install/global: `./init.sh`, `./init.sh --uninstall`, `./init.sh --pin`.
- Project packs: `scripts/pack.sh list|recommend|install|remove|refresh|status|doctor|which|pin|unpin|set-mode|set-update-mode|list-packs`.
- Mode and handoff: `scripts/agent-mode.sh`, `scripts/approved-plan.sh check|consume|mark-stale`.
- Skill hygiene: `scripts/skill-deps.sh --broken`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`.
- Showcase and benchmark: `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests test`.

### P2 - Team adoption checklist is still missing

Claim: team rollout concerns are known, but public docs stop short of a checklist.

Evidence:
- `docs/packs.md` tells users to commit `.agents/project.json` and not commit generated `.claude/skills` or `.codex/skills`.
- `docs/packs.md` explains that `refresh` recreates local roots and requires a fresh CLI session if skills are not visible.
- `research/devtool-dx-journey.md` and `research/devtool-monetization.md` identify checkout-path coupling, restart friction, direct-to-primary defaults, and generated-root discipline as team friction.
- No README or `docs/packs.md` section currently gives a "team adoption checklist".

Inference: the docs describe mechanics but do not package them into team onboarding guidance.

Decision impact: add a short `docs/packs.md` team checklist. It should stay practical:
- choose a stable `agentic-skills` checkout path or accept per-developer `refresh`;
- run `./init.sh` once per developer;
- commit `.agents/project.json`;
- never commit generated `.claude/skills` or `.codex/skills`;
- run `scripts/pack.sh refresh` after pulling pack designation changes;
- start a fresh CLI session after install/remove/refresh if skills are stale;
- decide whether the direct-to-primary shipping contract is acceptable or needs a local workflow fork.

### P2 - Existing devtool research has stale installer terminology

Claim: dogfood research artifacts still mention `install.sh`, but the current repo uses `init.sh`.

Evidence:
- `ls install.sh` returns no file.
- `README.md` and `docs/skills-reference.md` now use `./init.sh`.
- `rg "install.sh" research/devtool-*.md` still finds references in `research/devtool-user-map.md`, `research/devtool-positioning.md`, `research/devtool-monetization.md`, `research/devtool-integration-map.md`, `research/devtool-dx-journey.md`, and `research/devtool-adoption.md`.
- The prior `research/devtool-docs-audit.md` also said README used `./install.sh`; this refresh corrects that artifact.

Inference: stale research does not break setup, but it weakens the "examples to inspect" path if those artifacts are presented as current proof.

Decision impact: either update stale devtool research references to `init.sh` with a dated note, or add a README caveat that older research artifacts preserve historical installer names. The better fix is a small docs-reconciliation pass over active devtool research files.

## Coverage By Audit Area

### Quickstart Clarity

Strengths:
- README starts with the two-layer global-core/project-pack model.
- README uses the current `./init.sh` command and explains that packs are not installed globally.
- Pack install examples are copy-pasteable.
- CLI reload/restart guidance is now more nuanced than the older audit: Claude has `/reload-skills` and `/clear` options; Codex should use a fresh session if the `$` list is stale.

Gaps:
- No named first-success route.
- No "if `tasks/todo.md` is missing" branch in README.
- No short proof endpoint after install beyond status/skill roots.

### Examples

Strengths:
- `tasks/history.md` is a real execution log.
- `research/devtool-*.md` is a dogfood research chain.
- `docs/benchmark-results-matrix.md` and Skills Showcase generated assets provide benchmark/proof data.

Gaps:
- README does not call these "examples".
- Some devtool research examples have stale `install.sh` references.

### API And Script Reference

Strengths:
- Skill and pack catalogs are current and comprehensive.
- `docs/operating-modes.md` is strong for hybrid/approval-packet internals.
- `docs/test-harness.md` gives the benchmark harness command surface.

Gaps:
- No single script reference page.
- Common failure interpretation is split across subsystem docs.

### Troubleshooting

Strengths:
- Restart/refresh and drift mechanics are documented.
- Approval-packet failure checks are explicit.
- Validation commands exist for skill deps, versions, archive integrity, showcase assets, and benchmark coverage.

Gaps:
- No central symptom-led page.
- Windows/WSL and moved-checkout risks are not in a short public recovery path.

### Migration Paths

Strengths:
- Former-global domain skills are now mapped to project packs.
- `docs/operating-modes.md` explains migrating from parity mirrors to declared modes.
- `docs/packs.md` explains track-latest vs pinned installs.

Gaps:
- Team rollout guidance is not compressed into a checklist.
- Stale `install.sh` references in research examples create migration confusion.

### Proof Artifacts

Strengths:
- Dogfood history is unusually visible.
- Benchmark matrix and Skills Showcase data provide inspectable proof paths.
- The repo explicitly avoids hidden telemetry and GitHub Actions as a default.

Gaps:
- Proof is not surfaced in README.
- Docs should avoid overclaiming behavior coverage: many checks validate metadata, fixtures, or generated assets, not all live skill behavior.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Decision Impact |
| --- | --- | --- | --- | --- |
| No P0 docs blocker | README includes `./init.sh`, pack install, pack status/which, restart guidance; docs cover packs and modes | Experienced shell users can install and reason through setup | High | No emergency docs rewrite needed |
| First-success path is implicit | No first-success section in README/docs; workflow pieces live across README and `docs/codex-workflow.md` | Activation depends on user synthesis | High | Add README first-success route |
| Troubleshooting is fragmented | Recovery facts live in README, `docs/packs.md`, `docs/operating-modes.md`, `docs/skills-reference.md` | Symptom-led support is slower than it needs to be | High | Add troubleshooting table/page |
| Proof is under-presented | `tasks/history.md`, benchmark matrix, showcase proof data, and devtool research exist; README lacks proof/examples section | Existing proof can be converted to adoption value cheaply | High | Add proof/examples pointers |
| Script reference is scattered | Commands are covered in at least five docs | A command index would reduce support overhead | Medium-high | Add script reference |
| Team checklist missing | Mechanics documented; checklist absent; research names team friction | Team adoption still needs local tacit knowledge | Medium-high | Add team adoption checklist |
| Research examples have stale installer terms | `install.sh` absent; active docs use `init.sh`; devtool research still references `install.sh` | Example artifacts can confuse readers | High | Reconcile or caveat stale examples |

## Assumptions And Confidence

- High confidence: the current public docs use `./init.sh` for global initialization.
- High confidence: no central `docs/troubleshooting.md` or first-success README section exists.
- High confidence: the older audit was stale and needed refresh.
- Medium-high confidence: a script reference page is better than continuing to scatter command semantics. This is a docs-architecture judgment, not a hard correctness claim.
- Medium confidence: team adoption should standardize checkout path. The underlying absolute-path generated-root behavior is real, but teams may prefer different onboarding conventions.
- Medium confidence: stale devtool research should be reconciled rather than caveated. If the repo treats research artifacts as historical snapshots, a dated caveat may be enough.

## Alternatives Considered

1. Full documentation rewrite: rejected. The docs are mostly accurate; the highest value is navigation and activation packaging.
2. Only update stale `install.sh` references: rejected as too narrow. It fixes an accuracy issue but misses activation and support gaps.
3. Add a separate website-first onboarding page: deferred. README and docs pages are the current adoption surface; use them before creating a new surface.
4. Implement doc fixes immediately in this audit: rejected for this step. The task requested an audit refresh and alignment review before follow-up doc changes.

## Recommended Backlog

1. Add README "First successful cycle" and "Proof and examples" sections.
2. Add `docs/troubleshooting.md` with symptom-led recovery steps.
3. Add `docs/scripts-reference.md` or a compact script reference section in `docs/skills-reference.md`.
4. Add a team adoption checklist and moved-checkout recovery note to `docs/packs.md`.
5. Reconcile stale `install.sh` references across active `research/devtool-*.md` artifacts, or add dated historical-context notes before using those artifacts as examples.

## Suggested Next Work

Review `alignment/devtool-docs-audit-agentic-skills-2026-06-02.html`. If approved, the next implementation step should make the smallest docs pass that covers backlog items 1-4, then handle stale devtool research terminology as a follow-up reconciliation if the user wants research artifacts to remain current examples.
