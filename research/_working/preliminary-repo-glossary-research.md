# Preliminary Repo Glossary Research

> Stage: review packet only | Mode: flat `research/` bootstrap | Date: 2026-06-05 | Sources scanned: 63 docs | Proposed terms: 36 | Proposed acronyms: 14

## Status

This is the non-canonical Stage 1 packet for `$repo-glossary`. It does not create or modify `research/glossary.md`. The repo is in bootstrap mode because no existing parent glossary was found.

## Scope Resolution

- `research/.progress.yaml`: absent.
- Product-path directories under `research/`: none.
- Active scope: flat `research/` single-product mode.
- Hard prerequisite: passed; `research/` contains 8 markdown files.
- Existing glossary: absent; all accepted glossary terms would be new additions after final compiled YAML approval.
- Scoped glossary hierarchy: not applicable.

## Source Inventory

| Source class | Count | Files |
| --- | ---: | --- |
| Research markdown | 8 | research/agent-config-cleanup-audit.md, research/devtool-adoption.md, research/devtool-docs-audit.md, research/devtool-dx-journey.md, research/devtool-integration-map.md, research/devtool-monetization.md, research/devtool-positioning.md, research/devtool-user-map.md |
| Root agent docs | 2 | CLAUDE.md, AGENTS.md |
| `docs/*.md` | 16 | docs/alignment-page-convention.md, docs/benchmark-results-matrix.md, docs/canonical-workflow-report.md, docs/codex-workflow.md, docs/kanban-test-results.md, docs/operating-modes.md, docs/pack-workflow-matrix.md, docs/packs.md, docs/quality-gate-contract.md, docs/safe-git-benchmark-fixtures.md, docs/skill-anatomy.md, docs/skill-invocation-types.md, docs/skill-next-step-contracts.md, docs/skill-versioning.md, docs/skills-reference.md, docs/test-harness.md |
| `packs/*/PACK.md` | 37 | packs/agent-bridge/PACK.md, packs/agent-work-admin/PACK.md, packs/agentic-skills-bench/PACK.md, packs/alignment-loop/PACK.md, packs/alignment-page-admin/PACK.md, packs/business-app/PACK.md, packs/business-discovery/PACK.md, packs/business-growth/PACK.md, packs/business-ops/PACK.md, packs/code-debug/PACK.md, packs/code-maintenance/PACK.md, packs/code-quality/PACK.md, packs/code-review/PACK.md, packs/context-transfer/PACK.md, packs/creator-foundation/PACK.md, packs/creator-media/PACK.md, packs/customer-lifecycle/PACK.md, packs/docs-health/PACK.md, packs/exec-loop/PACK.md, packs/exec-profile/PACK.md, packs/gitops/PACK.md, packs/guided-walkthrough/PACK.md, packs/knowledge-check/PACK.md, packs/monorepo/PACK.md, packs/product-design/PACK.md, packs/product-testing/PACK.md, packs/project-fleet/PACK.md, packs/release-ops/PACK.md, packs/remotion/PACK.md, packs/repo-maintenance/PACK.md, packs/report-gen/PACK.md, packs/research-admin/PACK.md, packs/session-analytics/PACK.md, packs/skill-dev/PACK.md, packs/teardown/PACK.md, packs/website-polish/PACK.md, packs/youtube-ops/PACK.md |

## Existing Terms

No existing Terms table was available because `research/glossary.md` does not exist. Existing-term accuracy checks are therefore empty for this run.

## Missing Terms

The following terms are used across research/docs/root workflow conventions but are absent from a shared glossary because the glossary has not been bootstrapped.

| Term | Proposed definition | Category | Source evidence | Confidence |
| --- | --- | --- | --- | --- |
| `agentic-skills` | The local-first shared skill library in this repository for Claude Code and OpenAI Codex, distributed through a checkout plus global and project-local skill roots. | tooling | research/devtool-docs-audit.md, research/devtool-dx-journey.md, docs/operating-modes.md, docs/skills-reference.md | High |
| `Skill` | A Markdown workflow instruction bundle, normally rooted at `SKILL.md`, that a supported agent can invoke as a command or load as an operating contract. | workflow | docs/skill-anatomy.md, docs/skill-invocation-types.md, docs/skills-reference.md, research/devtool-integration-map.md | High |
| `SKILL.md` | The canonical file for an individual skill, with YAML frontmatter such as `name`, `description`, `type`, `version`, and optional `argument-hint`, followed by the skill contract. | technical | docs/skill-anatomy.md, docs/skill-versioning.md, research/devtool-adoption.md, research/devtool-integration-map.md | High |
| `Pack` | A project-local collection of related skills enabled through `scripts/pack.sh`, used to add domain or workflow assumptions without installing every skill globally. | workflow | docs/packs.md, docs/pack-workflow-matrix.md, docs/skills-reference.md, packs/business-app/PACK.md | High |
| `Project-local pack` | A pack enabled inside a consumer repository, recorded in `.agents/project.json`, and materialized as local `.claude/skills` or `.codex/skills` roots for that project. | workflow | docs/packs.md, docs/codex-workflow.md, research/devtool-dx-journey.md | High |
| `Domain pack` | A pack organized around the type of product or work, such as devtool, business-discovery, customer-lifecycle, game, creator-media, or code-quality. | workflow | docs/pack-workflow-matrix.md, research/devtool-dx-journey.md, research/devtool-positioning.md | High |
| `Global core skills` | Domain-neutral skills initialized once per machine by `./init.sh` or the init-agentic-skills flow, intentionally kept smaller than the project-local pack surface. | workflow | docs/skills-reference.md, docs/operating-modes.md, docs/skill-versioning.md | High |
| `Project designation file` | The committed `.agents/project.json` file that records project type, enabled packs or skills, skill pack version, and optional agent mode for project-local operation. | technical | docs/packs.md, docs/codex-workflow.md, research/devtool-integration-map.md, research/devtool-adoption.md | High |
| `Managed skill root` | A generated or refreshed local skill directory under `.claude/skills`, `.codex/skills`, `~/.claude/skills`, or `~/.codex/skills` that points to or copies canonical skill sources. | technical | docs/packs.md, docs/codex-workflow.md, docs/skills-reference.md | High |
| `.agentic-skills-managed` | The marker file stamped into managed skill-root copies, recording source version and source hash so stale installs can be detected. | technical | docs/packs.md, docs/operating-modes.md | High |
| `Operating mode` | The resolved agent mode that determines whether Claude, Codex, or both participate in planning and execution; valid values are `claude-only`, `codex-only`, `hybrid`, or unset. | workflow | docs/operating-modes.md, research/devtool-integration-map.md, research/devtool-user-map.md | High |
| `claude-only` | Operating mode where Claude both plans and executes the workflow because Codex is unavailable or not selected. | workflow | docs/operating-modes.md, research/devtool-integration-map.md | High |
| `codex-only` | Operating mode where Codex both plans and executes the workflow because Claude is unavailable or not selected. | workflow | docs/operating-modes.md, research/devtool-integration-map.md | High |
| `hybrid` | Operating mode where Claude primarily orchestrates interviews and planning while Codex executes via approved delegation or handoff paths. | workflow | docs/operating-modes.md, research/devtool-user-map.md, research/devtool-positioning.md | High |
| `Approval packet` | The shared cross-agent execution contract, represented by `.agents/approved-plan.json` plus sanitized `tasks/approved-plan.md`, with lifecycle and freshness checks before execution. | workflow | docs/operating-modes.md, docs/skills-reference.md, research/devtool-positioning.md, research/devtool-user-map.md | High |
| `Prompt history` | The tracked prompt-log requirement for skill invocations, stored under `prompts/<skill-slug>/` with visible user invocation content and metadata before substantive work. | workflow | AGENTS.md, CLAUDE.md, research/agent-config-cleanup-audit.md | High |
| `Alignment page` | A durable HTML review artifact for research, specs, plans, reports, prototypes, or document outputs, containing full deliverable content, evidence, gates, feedback YAML, and final approval YAML controls. | workflow | docs/alignment-page-convention.md, CLAUDE.md, AGENTS.md | High |
| `Alignment Page Convention` | The canonical authoring contract for alignment pages, currently sourced from `docs/alignment-page-convention.md` and propagated into per-skill `ALIGNMENT-PAGE.md` bundles by `scripts/upgrade-alignment-page.mjs`. | workflow | docs/alignment-page-convention.md, CLAUDE.md, AGENTS.md, research/agent-config-cleanup-audit.md | High |
| `Write-forward glossary` | The convention that research skills propose new domain terms in alignment-page glossary gates and append only user-approved terms to the appropriate glossary during confirmation. | workflow | CLAUDE.md, AGENTS.md, .codex/skills/repo-glossary/SKILL.md | High |
| `Report-first approval gate` | A workflow pattern where synthesized findings are presented for review before canonical source artifacts are created or modified. | workflow | .codex/skills/repo-glossary/SKILL.md, docs/alignment-page-convention.md, research/devtool-docs-audit.md | High |
| `Staged research workflow` | The three-stage approval flow: scan into a working packet, render a review alignment page, then apply approved canonical edits only after final compiled YAML. | workflow | .codex/skills/repo-glossary/SKILL.md, docs/alignment-page-convention.md | High |
| `Ship-one-step` | The operating cadence where one approved step is implemented, validated, documented, committed, pushed, and handed off before moving to the next step. | workflow | research/devtool-dx-journey.md, research/devtool-integration-map.md, research/devtool-positioning.md | High |
| `Direct-to-primary git flow` | The default repository mutation policy that sequential work lands directly on `master` or `main`, except explicitly requested branch work or agent-team parallel write lanes. | workflow | AGENTS.md, CLAUDE.md, research/devtool-integration-map.md | High |
| `Archive-first policy` | The research/spec discipline of archiving prior canonical artifacts under `docs/history/archive/YYYY-MM-DD/HHMMSS/` before substantive replacement. | workflow | research/devtool-adoption.md, research/devtool-dx-journey.md, research/devtool-integration-map.md | High |
| `Skill versioning` | The per-skill versioning convention requiring `version:` frontmatter, decimal bumps for behavior changes, archived old `SKILL.md` snapshots, and a `CHANGELOG.md`. | workflow | docs/skill-versioning.md, AGENTS.md, CLAUDE.md, research/agent-config-cleanup-audit.md | High |
| `Mirror parity audit` | The validation pass that compares Claude/Codex mirror skills for missing files, frontmatter drift, shared-section drift, and command-syntax-normalized heading drift. | technical | docs/skill-versioning.md, tasks/todo.md | Medium-high |
| `Pack refresh` | The `scripts/pack.sh refresh` operation that recreates project-local skill roots from `.agents/project.json` without hot-reloading an already-running CLI process. | technical | docs/packs.md, docs/codex-workflow.md, research/devtool-dx-journey.md | High |
| `CLI restart requirement` | The recurring rule that after installing, removing, or refreshing skills, active Claude Code or Codex sessions may need reload, clear, restart, or a fresh session to see changed skills. | workflow | docs/packs.md, docs/codex-workflow.md, research/devtool-dx-journey.md, research/devtool-user-map.md | High |
| `Skills Showcase` | The generated public/catalog surface for skill and proof metadata, refreshed by showcase generator scripts when tracked skill or pack metadata changes. | tooling | docs/skills-reference.md, research/devtool-docs-audit.md, docs/benchmark-results-matrix.md | High |
| `Benchmark coverage freshness` | The maintenance requirement to update benchmark fixture coverage and generated matrix data when skill changes affect benchmarked behavior or metadata. | technical | docs/skills-reference.md, docs/benchmark-results-matrix.md, docs/test-harness.md | High |
| `Hibernated Kanban Packs` | PoketoWork/Poketo.work kanban pack variants that are preserved in an archive but removed from active discovery, installation, recommendations, and generated catalogs during a rebuild. | workflow | docs/skills-reference.md, docs/pack-workflow-matrix.md, docs/operating-modes.md | High |
| `Pack emphasis` | The role tagging in operating-mode docs that identifies whether each global skill or pack is primarily Claude-orchestration, Codex-execution, or both. | workflow | docs/operating-modes.md, docs/pack-workflow-matrix.md | High |
| `Skill invocation type` | A taxonomy classifying skills as primary, chained, sub-skill, or orchestrator so tools and agents can distinguish user entry points from delegated steps. | workflow | docs/skill-invocation-types.md, docs/skill-next-step-contracts.md | High |
| `Sub-skill` | A skill invoked automatically or through a parent router rather than usually being invoked directly by a user. | workflow | docs/skill-invocation-types.md, docs/skill-anatomy.md | High |
| `Orchestrator skill` | A skill that coordinates other skills or execution steps as its main workflow role, such as `exec`, `ship`, `positioning`, or `research-roadmap`. | workflow | docs/skill-invocation-types.md, docs/operating-modes.md | High |
| `Agent-team lane` | A parallel write lane for subagent execution that must use a separate GitHub branch and pass consolidation or PR review before final integration. | workflow | AGENTS.md, CLAUDE.md, docs/packs.md | High |

## Conflicting Terms

### Global initialization command

| Definition/use | Meaning | Sources |
| --- | --- | --- |
| Current docs | `./init.sh` initializes global Claude/Codex managed skill installs. | docs/skills-reference.md, research/devtool-docs-audit.md |
| Older devtool research | `install.sh` is described as the global installer and try-it surface. | research/devtool-adoption.md, research/devtool-dx-journey.md, research/devtool-integration-map.md |

Proposed canonical treatment: Use `./init.sh` as the canonical global initialization command. Treat `install.sh` references in active devtool research as stale historical terminology that should be reconciled or caveated outside the glossary approval.

### Alignment Page Convention source

| Definition/use | Meaning | Sources |
| --- | --- | --- |
| Current convention | `docs/alignment-page-convention.md` is the single authoring source and generator input. | docs/alignment-page-convention.md, AGENTS.md, CLAUDE.md |
| Older cleanup audit | `CLAUDE.md` was described as holding the full canonical block and generator source. | research/agent-config-cleanup-audit.md |

Proposed canonical treatment: Use `docs/alignment-page-convention.md` as canonical. Preserve `research/agent-config-cleanup-audit.md` as historical evidence of prior drift.

### Execution-loop entry point

| Definition/use | Meaning | Sources |
| --- | --- | --- |
| Current active/project-local surface | `exec` is the active orchestrator in the installed Codex skill set and exec-loop pack. | .codex/skills/exec/SKILL.md, packs/exec-loop/codex/exec/SKILL.md, docs/skill-invocation-types.md |
| Older or mixed docs | `run` is still described as a core or first-success execution loop in several devtool research documents and one operating-mode row. | research/devtool-adoption.md, research/devtool-dx-journey.md, docs/operating-modes.md |

Proposed canonical treatment: Define `exec` as the current execution-loop skill. Treat `run` as legacy or stale unless the repo intentionally restores a `run` skill.


## Stale Terms

No stale glossary terms can be identified because there is no existing glossary. Stale source-language candidates are handled above as conflicts rather than stale glossary entries.

## Shadowed Terms

None. There is no parent/scoped glossary hierarchy and no scoped product path.

## Cross-Path Divergences

None. There are no active sibling product paths under `research/`.

## Inheritance Gaps

None. There is no parent/scoped glossary hierarchy to audit.

## Acronym Candidates

| Acronym | Expansion | Source evidence |
| --- | --- | --- |
| `CLI` | Command-line interface | research/devtool-docs-audit.md, docs/operating-modes.md |
| `DX` | Developer experience | research/devtool-dx-journey.md, research/devtool-docs-audit.md |
| `ICP` | Ideal customer profile | research/devtool-user-map.md, docs/pack-workflow-matrix.md |
| `GTM` | Go-to-market | docs/pack-workflow-matrix.md, docs/skill-invocation-types.md |
| `PMF` | Product-market fit | docs/operating-modes.md, docs/skill-invocation-types.md |
| `UAT` | User acceptance testing | docs/skill-invocation-types.md, packs/product-testing/PACK.md |
| `WSL` | Windows Subsystem for Linux | AGENTS.md, CLAUDE.md, research/agent-config-cleanup-audit.md |
| `PR` | Pull request | research/devtool-adoption.md, research/devtool-dx-journey.md |
| `CI` | Continuous integration | research/devtool-adoption.md, research/devtool-integration-map.md |
| `API` | Application programming interface | research/devtool-monetization.md, docs/kanban-test-results.md |
| `JSON` | JavaScript Object Notation | docs/operating-modes.md, research/devtool-positioning.md |
| `YAML` | YAML Ain't Markup Language / structured frontmatter format | docs/alignment-page-convention.md, research/devtool-integration-map.md |
| `SHA` | Secure Hash Algorithm digest, commonly used here for git or content hashes | docs/operating-modes.md, docs/packs.md |
| `TTL` | Time to live for approval-packet freshness | docs/operating-modes.md, research/devtool-docs-audit.md |

## Evidence Matrix

| Proposed change | Evidence | Inference | Confidence | Decision impact |
| --- | --- | --- | --- | --- |
| Bootstrap `research/glossary.md` only after approval | No `research/glossary.md` exists; 8 research files exist | The repo meets the hard prerequisite and is in bootstrap mode | High | Approval can create the flat glossary; no Scope column is needed |
| Add missing term set | Repeated terminology appears across research, docs, root agent files, and pack manifests | Without a glossary, new readers must infer project language from scattered docs | High | Approving terms creates shared vocabulary for future research and docs |
| Resolve installer terminology | Current docs use `./init.sh`; active devtool research still says `install.sh` | Stale installer naming is a real reader-confusion risk | High | Canonical glossary should prefer `init.sh`; docs reconciliation can be follow-up |
| Resolve alignment convention source | Current root files and `docs/alignment-page-convention.md` name docs file as canonical; older cleanup audit names `CLAUDE.md` | The term changed as the convention was migrated | High | Canonical glossary should reflect current source and treat older audit as historical |
| Resolve run/exec entry point | Installed/project-local Codex root has `exec`; no active `run/SKILL.md` was found; docs/research still mention `run` | `run` appears to be legacy or stale in current checkout | Medium-high | Canonical glossary should define `exec` as current and flag `run` for docs reconciliation |

## Assumptions And Confidence

- Flat mode is correct because `research/.progress.yaml` is absent and no non-archived `research/{slug}/` product directories exist.
- The audit scanned the skill-specified source families plus the active `repo-glossary` skill contract where the term exists only in the invoked skill instructions.
- No parent/scoped glossary hierarchy exists yet, so shadowed terms, cross-path divergences, and inheritance gaps are empty classifications rather than resolved findings.
- Frequency alone was not treated as glossary-worthiness; generic terms such as API, JSON, or CLI were included only when they have project-specific operational meaning or appear in acronym use.

## Proposed File Changes After Approval

- Create `research/glossary.md` in the standard flat glossary format, with no Scope column.
- Add approved missing terms to the Terms table with `Status` set to `confirmed`.
- Add approved acronyms to the Acronyms table.
- Add approved terms to Recently Added with Source Skill `$repo-glossary` and Approved In `alignment/repo-glossary-flat-research.html`.
- Preserve this working packet until final approval; Stage 3 should archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/research/_working/preliminary-repo-glossary-research.md` and remove the active packet.

## Next Steps

- Pick one: provide final compiled YAML from `alignment/repo-glossary-flat-research.html` to create/update `research/glossary.md` with approved terms.
- Pick one: provide feedback-only YAML from the page if any definition, conflict classification, or source-evidence mapping should be revised first.
- Pick one: after approved glossary writes, run `$reconcile-research` to check cross-document consistency now that terms are aligned.
- Pick one: run `$research-roadmap` to check overall project research status.
