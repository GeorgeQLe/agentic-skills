# Skill Invocation Types

> Audit date: 2026-06-01
> Scope: all active `SKILL.md` files under `global/` and `packs/` (excluding `archive/` and codex mirrors)
> Purpose: classify every skill by invocation type so tools, browsers, and conventions can distinguish user entry points from agent-delegated sub-steps.

## Taxonomy

| Type | Code | Description | Implicit default? |
|------|------|-------------|-------------------|
| **Primary** | `primary` | User invokes directly as a workflow entry point or deliberate action | Yes — assumed when `invocation:` is absent |
| **Chained** | `chained` | User invokes, but typically only after another skill recommends it | No |
| **Sub-skill** | `sub-skill` | Agent invokes automatically or via parent router; user rarely invokes directly | No |
| **Orchestrator** | `orchestrator` | Coordinates execution of other skills; user invokes to drive work forward | No |

## Classification by Location

### Global Skills (`global/claude/`)

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `codebase-status` | primary | user | Any time — status check |
| `idea-scope-brief` | primary | user | New project/concept needs scoping |
| `init-agentic-skills` | primary | user | First-time machine setup |
| `pack` | primary | user | Pack management needed |
| `provision-agentic-config` | primary | user | Project needs CLAUDE.md/AGENTS.md |
| `skills` | primary | user | Discover available skills |

### Pack: agent-bridge

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `delegate` | primary | user | Cross-agent delegation needed |

### Pack: agent-work-admin

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `plan-phase` | sub-skill | `/exec`, `/ship`, `/roadmap` | Phase needs implementation detail; auto-invoked by exec-loop |
| `roadmap` | primary | user | Specs exist, need phased roadmap |
| `spec-drift` | chained | user or review skill | Specs may have drifted from implementation |

### Pack: agentic-skills-bench

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `benchmark-test-skill` | primary | user | Skill needs quality/perf benchmarking |
| `benchmark-agent-review` | chained | user after benchmark run | Benchmark outputs need subjective grading |

### Pack: alignment-loop

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `destination-doc` | primary | user | Need to define project destination |
| `taste-calibration` | primary | user | Need to calibrate design taste |
| `vertical-slice-splitter` | primary | user | Need to split work into vertical slices |

### Pack: alignment-page-admin

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `compile-central-alignment` | primary | user | Alignment pages need central compilation |
| `upgrade-alignment-pages` | primary | user | Alignment pages need convention upgrade |

### Pack: business-app-kanban

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `brainstorm-kanban` | primary | user | Brainstorm with kanban card creation |
| `exec-kanban` | orchestrator | user | Execute kanban-tracked work |
| `roadmap-kanban` | primary | user | Build kanban-tracked roadmap |
| `ship-end-kanban` | chained | `/ship-kanban` | Session wrap-up for kanban projects |
| `ship-kanban` | orchestrator | user | Ship kanban-tracked work |
| `spec-interview-kanban` | primary | user | Spec interview with kanban tracking |

### Pack: business-discovery

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `competitive-analysis` | primary | user | Market/competitor research needed |
| `customer-feedback` | chained | user after research | Customer language/feedback synthesis |
| `enterprise-icp` | primary | user | Enterprise multi-stakeholder ICP needed |
| `icp` | primary | user | Customer discovery entry point |
| `lean-canvas` | chained | `/journey-map` trigger | Business model risk needs Lean Canvas |
| `positioning` | orchestrator | user | Positioning framework selection + synthesis |
| `value-prop-canvas` | chained | `/journey-map` trigger | Contested solution-fit needs VPC |
| **Positioning Frameworks** | | | |
| `category-design` | sub-skill | `/positioning` router | Play Bigger framework selected |
| `jtbd-positioning` | sub-skill | `/positioning` router | JTBD framework selected |
| `moore-positioning` | sub-skill | `/positioning` router | Geoffrey Moore framework selected |
| `obviously-awesome` | sub-skill | `/positioning` router | Obviously Awesome framework selected |
| `strategic-canvas` | sub-skill | `/positioning` router | Strategic Canvas framework selected |

### Pack: business-growth

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `experiment` | primary | user | Need to design/track experiment |
| `growth-model` | chained | after positioning/metrics | Growth mechanism analysis needed |
| `gtm` | chained | after positioning | Go-to-market strategy needed |
| `hook-model` | chained | `/journey-map` trigger | Repeat-use product needs habit design |
| `landing-copy` | chained | after positioning/gtm | Landing page copy needed |
| `metrics` | chained | after gtm/growth-model | Success metrics framework needed |
| `monetization` | chained | after positioning | Pricing/packaging strategy needed |
| `pmf-assessment` | primary | user | Product-market fit assessment |

### Pack: business-ops

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `assumption-tracker` | chained | after experiments | Assumptions need tracking/updating |
| `burn-rate` | primary | user | Financial burn analysis needed |
| `cohort-review` | chained | after metrics/launch | Cohort data needs review |
| `investor-update` | primary | user | Investor communication needed |
| `mvp-gap` | chained | after competitive-analysis | MVP gap analysis needed |
| `platform-strategy` | chained | after growth-model | Platform expansion analysis |
| `product-line` | primary | user | Product line strategy needed |
| `reconcile-research` | chained | after research changes | Research documents have conflicts |
| `retro` | primary | user | Retrospective needed |
| `risk-register` | primary | user | Risk tracking needed |
| `runway-model` | chained | after burn-rate/monetization | Financial runway modeling |
| `scale-audit` | chained | after mvp-gap | Scale/enterprise readiness audit |

### Pack: code-debug

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `debug` | primary | user | Bug needs investigation |
| `investigate` | primary | user | Claim needs codebase validation |
| `trace` | primary | user | Request needs end-to-end tracing |

### Pack: code-maintenance

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `migrate` | primary | user | Code migration needed |
| `update-packages` | primary | user | Dependencies need updating |

### Pack: code-quality

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `extract-shared-types` | primary | user | Shared types need extraction |
| `quality-sweep` | primary | user | Code quality sweep needed |

### Pack: code-review

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `dead-code` | primary | user | Dead code detection needed |
| `expert-review` | primary | user | Expert-level code review needed |
| `regression-check` | chained | after refactoring | Regression check needed |
| `slim-audit` | primary | user | Quick code audit needed |

### Pack: context-transfer

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `handoff` | primary | user | Context transfer between sessions/agents |

### Pack: creator-foundation

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `content-programming` | primary | user | Content strategy planning |
| `creator-evidence-schema` | chained | after creator research | Evidence schema needed |
| `creator-metrics-review` | chained | after video-build | Creator metrics review |
| `creator-platform-capability-matrix` | primary | user | Platform capability analysis |
| `creator-positioning` | primary | user | Creator positioning strategy |
| `creator-presence-dossier` | primary | user | Creator presence audit |
| `product-led-media-map` | primary | user | Media map for product-led content |
| `research-directory-conventions` | sub-skill | creator-foundation skills | Research directory setup convention |
| `series-spec` | primary | user | Video series specification |

### Pack: customer-lifecycle

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `conversion-map` | chained | `/journey-map` trigger | Conversion stage needs detail |
| `expansion-map` | chained | `/journey-map` trigger | Expansion stage needs detail |
| `journey-map` | primary | user | Customer journey mapping needed |
| `lifecycle-metrics` | chained | `/journey-map` trigger | Lifecycle measurement needed |
| `onboarding-map` | chained | `/journey-map` trigger | Onboarding stage needs detail |
| `retention-map` | chained | `/journey-map` trigger | Retention stage needs detail |
| `transaction-map` | chained | `/journey-map` trigger | Transaction stage needs detail |

### Pack: devtool

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `devtool-adoption` | primary | user | Devtool adoption strategy |
| `devtool-docs-audit` | primary | user | Developer docs audit |
| `devtool-dx-journey` | primary | user | Developer experience analysis |
| `devtool-integration-map` | primary | user | Integration ecosystem mapping |
| `devtool-monetization` | primary | user | Devtool pricing strategy |
| `devtool-positioning` | primary | user | Devtool competitive positioning |
| `devtool-user-map` | primary | user | Devtool stakeholder mapping |
| `devtool-workflow` | orchestrator | user | Devtool workflow entry point |

### Pack: devtool-kanban (same structure as business-app-kanban)

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `brainstorm-kanban` | primary | user | Brainstorm with kanban |
| `exec-kanban` | orchestrator | user | Execute kanban work |
| `roadmap-kanban` | primary | user | Kanban roadmap |
| `ship-end-kanban` | chained | `/ship-kanban` | Session wrap-up |
| `ship-kanban` | orchestrator | user | Ship kanban work |
| `spec-interview-kanban` | primary | user | Spec with kanban |

### Pack: docs-health

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `hygiene` | primary | user | Documentation hygiene check |
| `reconcile-dev-docs` | chained | after code changes | Dev docs may be stale |

### Pack: exec-loop

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `exec` | orchestrator | user | Execute next plan step |
| `ship` | orchestrator | user | Ship current work + plan next |
| `ship-end` | chained | `/ship` or user | Session wrap-up |

### Pack: exec-profile

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `patch-exec-profile` | sub-skill | `/exec` auto-invocation | Agent-team phase has incomplete lane metadata |

### Pack: game

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `game-audience` | primary | user | Game audience research |
| `game-comparables` | primary | user | Game comparable analysis |
| `game-core-loop` | primary | user | Core loop design |
| `game-fantasy` | primary | user | Player fantasy exploration |
| `game-genre-map` | primary | user | Genre landscape mapping |
| `game-launch` | chained | after game development | Launch planning |
| `game-playtest-metrics` | chained | after prototype | Playtest metrics analysis |
| `game-prototype-test` | chained | after core-loop | Prototype testing plan |
| `game-roadmap` | primary | user | Game development roadmap |
| `game-store-page-test` | chained | after game concept | Store page validation |
| `game-workflow` | orchestrator | user | Game development workflow entry |

### Pack: game-kanban (same structure as business-app-kanban)

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `brainstorm-kanban` | primary | user | Brainstorm with kanban |
| `exec-kanban` | orchestrator | user | Execute kanban work |
| `roadmap-kanban` | primary | user | Kanban roadmap |
| `ship-end-kanban` | chained | `/ship-kanban` | Session wrap-up |
| `ship-kanban` | orchestrator | user | Ship kanban work |
| `spec-interview-kanban` | primary | user | Spec with kanban |

### Pack: gitops

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `commit-and-push-by-feature` | primary | user | Feature-grouped commits needed |
| `sync` | primary | user | Pull latest + status |

### Pack: guided-walkthrough

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `guide` | primary | user | Interactive walkthrough needed |
| `uat-guide` | chained | after prototype/uat | UAT walkthrough needed |

### Pack: knowledge-check

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `quiz-me` | primary | user | Knowledge quiz requested |

### Pack: monorepo

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `affected` | primary | user | Find affected packages |
| `mono-detect` | sub-skill | monorepo skills | Detect monorepo structure |
| `mono-exec` | orchestrator | user | Execute across monorepo |
| `mono-guard` | chained | after mono changes | Cross-package guard check |
| `mono-plan` | primary | user | Plan monorepo-scoped work |
| `mono-ship` | orchestrator | user | Ship monorepo changes |
| `scaffold` | primary | user | Scaffold new package |

### Pack: poketowork-kanban

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `brainstorm-kanban` | primary | user | Brainstorm with kanban |
| `exec-kanban` | orchestrator | user | Execute kanban work |
| `poketo-kanban` | primary | user | Poketo-specific kanban ops |
| `roadmap-kanban` | primary | user | Kanban roadmap |
| `ship-end-kanban` | chained | `/ship-kanban` | Session wrap-up |
| `ship-kanban` | orchestrator | user | Ship kanban work |
| `spec-interview-kanban` | primary | user | Spec with kanban |
| `sync-roadmap-kanban` | chained | after roadmap changes | Sync roadmap to kanban |

### Pack: product-design

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `brainstorm` | primary | user | Idea generation needed |
| `consolidate-variations` | chained | after ux-variations + evaluation | Variations need convergence |
| `design-system` | primary | user | Design system needed |
| `feature-interview` | primary | user | Feature requirements interview |
| `prototype` | chained | after ui-interview | Prototype build needed |
| `spec-interview` | primary | user | Spec elicitation interview |
| `ui-interview` | chained | after ux-variations | UI detail interview |
| `ux-variations` | chained | after positioning | UX variation exploration |

### Pack: product-testing

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `dogfood` | primary | user | Dogfooding session needed |
| `uat` | chained | after prototype | User acceptance testing |

### Pack: project-fleet

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `clone-spec-store` | primary | user | Clone specs across projects |
| `skill-inventory` | primary | user | Inventory skills across fleet |

### Pack: release-ops

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `branch-lifecycle` | primary | user | Branch management needed |
| `deploy` | chained | after ship/release | Deployment needed |
| `release` | primary | user | Release cut needed |

### Pack: remotion

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `video-build` | chained | after video-script | Video build from approved script |
| `video-script` | primary | user | Video script writing |
| `youtube-format-research` | primary | user | YouTube format research |

### Pack: repo-maintenance

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `bootstrap-repo` | primary | user | New repo setup |

### Pack: report-gen

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `report-website` | primary | user | Report needs HTML website |

### Pack: research-admin

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `research-roadmap` | orchestrator | user | Research prioritization + planning |

### Pack: session-analytics

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `analyze-sessions` | primary | user | Cross-session analysis needed |
| `prompt-history-backfill` | primary | user | Backfill missing prompt logs |
| `session-triage` | primary | user | Single session investigation |

### Pack: skill-dev

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `create-agentic-skill` | primary | user | Create repo-managed skill |
| `create-local-skill` | primary | user | Create user-local skill |
| `skill-interview` | primary | user | Skill requirements interview |
| `targeted-skill-builder` | primary | user | Build skill from specific target |

### Pack: teardown

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `decommission` | primary | user | Project/feature decommission |
| `desk-flip` | primary | user | Full project teardown |

### Pack: website-polish

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `icon-handler` | primary | user | Icon management needed |

### Pack: youtube-ops

| Skill | Type | Typical invoker | Entry condition |
|-------|------|-----------------|-----------------|
| `youtube-audit` | primary | user | YouTube channel audit |
| `youtube-cadence-diagnosis` | primary | user | Upload cadence analysis |
| `youtube-channel-audit` | primary | user | Full channel audit |
| `youtube-competitive-research` | primary | user | Competitor channel research |
| `youtube-concept-research` | primary | user | Video concept research |
| `youtube-description-optimizer` | chained | after video publish | Description optimization |
| `youtube-peer-benchmark` | primary | user | Peer benchmarking |
| `youtube-portfolio` | primary | user | Video portfolio analysis |
| `youtube-search-positioning` | primary | user | Search positioning analysis |
| `youtube-title-thumbnail-audit` | chained | after video publish | Title/thumbnail audit |
| `youtube-vid-research` | primary | user | Individual video research |
| `youtube-video-audit` | chained | after video publish | Published video audit |

## Summary Statistics

| Type | Count | Percentage |
|------|-------|------------|
| Primary | 120 | 69% |
| Chained | 38 | 22% |
| Sub-skill | 8 | 5% |
| Orchestrator | 14 | 8% |

**Sub-skills identified:**

1. `plan-phase` — auto-invoked by `/exec` and `/ship`
2. `patch-exec-profile` — auto-invoked by `/exec` for agent-team phases
3. `category-design` — positioning framework, invoked by `/positioning` router
4. `jtbd-positioning` — positioning framework, invoked by `/positioning` router
5. `moore-positioning` — positioning framework, invoked by `/positioning` router
6. `obviously-awesome` — positioning framework, invoked by `/positioning` router
7. `strategic-canvas` — positioning framework, invoked by `/positioning` router
8. `mono-detect` — monorepo structure detection, invoked by other monorepo skills
9. `research-directory-conventions` — directory setup, invoked by creator-foundation skills

**Orchestrators identified:**

1. `exec` / `exec-kanban` / `mono-exec` — execute plan steps
2. `ship` / `ship-kanban` / `mono-ship` — ship + plan next
3. `positioning` — framework selection router + synthesis
4. `devtool-workflow` — devtool development workflow
5. `game-workflow` — game development workflow
6. `research-roadmap` — research prioritization orchestrator

## Validation

Run these to verify classification consistency:

```bash
# Check that all skills have an entry
bash scripts/skill-deps.sh --broken

# Count unique skills in this doc vs repo
grep -c '| `[a-z]' docs/skill-invocation-types.md
find . -name "SKILL.md" -not -path "*/archive/*" -not -path "*/codex/*" | wc -l
```
