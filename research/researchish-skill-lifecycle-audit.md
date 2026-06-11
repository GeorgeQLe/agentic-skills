# Research-ish Skill Lifecycle Audit

Generated from active `global/**/SKILL.md` and `packs/**/SKILL.md` files, excluding `archive/**`.
Command: `node scripts/researchish-skill-lifecycle-audit.mjs`.

## Summary

| Metric | Count |
| --- | ---: |
| Active skills scanned | 383 |
| Research-ish in-scope skills | 315 |
| Active `type: research` skills | 138 |
| Skills with alignment-page behavior | 301 |
| Skills with bundled `ALIGNMENT-PAGE.md` | 288 |
| Non-research skills mentioning `research/` paths | 111 |

## Category Counts

| Category | Count |
| --- | ---: |
| `staged-research` | 138 |
| `alignment-document` | 127 |
| `direct-utility` | 46 |
| `misclassified` | 4 |

## Misclassified Skills

| Path | Name | Type | Issue |
| --- | --- | --- | --- |
| packs/business-ops/claude/repo-glossary/SKILL.md | repo-glossary | analysis | staged research workflow exists but frontmatter type is not research |
| packs/business-ops/codex/repo-glossary/SKILL.md | repo-glossary | analysis | staged research workflow exists but frontmatter type is not research |
| packs/customer-lifecycle/claude/journey-map/SKILL.md | journey-map | analysis | staged research workflow exists but frontmatter type is not research |
| packs/customer-lifecycle/codex/journey-map/SKILL.md | journey-map | analysis | staged research workflow exists but frontmatter type is not research |

## Non-research Skills With `research/` Output Language

| Path | Type | Category | First `research/` evidence |
| --- | --- | --- | --- |
| global/claude/afps-status/SKILL.md | analysis | alignment-document | L13: Use this skill when the user asks where a product project is in the AFPS workflow, what research/planning/implementation artifact is missing next, whether ta... |
| global/claude/codebase-status/SKILL.md | analysis | alignment-document | L27: - `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, `tasks/lessons.md`, `ta... |
| global/claude/fork-idea-branch/SKILL.md | planning | alignment-document | L21: Read `research/.progress.yaml` (normalize legacy fields: treat `active_path` as `active_paths`, `abandoned` as `archived`). If no active research exists (no ... |
| global/claude/idea-scope-brief/SKILL.md | planning | alignment-document | L20: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| global/claude/pack/SKILL.md | ops | direct-utility | L23: - Check top-level files and directories, package manifests, app/framework configs, source layout, docs, existing `research/`, `specs/`, and `tasks/` files. |
| global/codex/afps-status/SKILL.md | analysis | alignment-document | L13: Use this skill when the user asks where a product project is in the AFPS workflow, what research/planning/implementation artifact is missing next, whether ta... |
| global/codex/codebase-status/SKILL.md | analysis | alignment-document | L27: - `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, `tasks/lessons.md`, `ta... |
| global/codex/idea-scope-brief/SKILL.md | planning | alignment-document | L22: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| global/codex/pack/SKILL.md | ops | direct-utility | L25: - Check top-level files and directories, package manifests, app/framework configs, source layout, docs, existing `research/`, `specs/`, and `tasks/` files. |
| packs/agent-work-admin/claude/roadmap/SKILL.md | planning | direct-utility | L52: - `research/journey-map.md` — user/customer journey context for user-facing work |
| packs/agent-work-admin/claude/spec-drift/SKILL.md | analysis | alignment-document | L152: \| `research/journey-map.md` \| Journey stages referenced by changed spec sections \| Journey map may describe flows that no longer match \| |
| packs/agent-work-admin/codex/roadmap/SKILL.md | planning | direct-utility | L54: - `research/journey-map.md` — user/customer journey context for user-facing work |
| packs/agent-work-admin/codex/spec-drift/SKILL.md | analysis | alignment-document | L63: 4. Check downstream impact on `research/journey-map.md`, `research/metrics.md`, `tasks/roadmap.md`. If major, recommend `$reconcile-research`. |
| packs/alignment-loop/claude/destination-doc/SKILL.md | planning | direct-utility | L17: 3. **Archive existing file** if `research/destination-[topic].md` already exists (Archive-First policy). |
| packs/alignment-loop/claude/taste-calibration/SKILL.md | planning | direct-utility | L15: 1. **Gather context silently.** Read `.agents/project.json`, `README.md`, `CLAUDE.md`, and any existing `research/` or `specs/` files relevant to the topic. |
| packs/alignment-loop/codex/destination-doc/SKILL.md | planning | direct-utility | L17: 3. **Archive existing file** if `research/destination-[topic].md` already exists (Archive-First policy). |
| packs/alignment-loop/codex/taste-calibration/SKILL.md | planning | direct-utility | L17: 1. **Gather context silently.** Read `.agents/project.json`, `README.md`, `AGENTS.md`, `CLAUDE.md`, and any existing `research/` or `specs/` files relevant t... |
| packs/business-growth/claude/experiment/SKILL.md | planning | alignment-document | L20: - Read `research/assumption-tracker.md` if it exists — pulls the highest-priority unvalidated assumption |
| packs/business-growth/claude/metrics/SKILL.md | analysis | alignment-document | L21: - **Hard**: `research/journey-map.md` (or `research/{slug}/journey-map.md` in product-path mode) must exist. If not, tell the user to run `/journey-map` firs... |
| packs/business-growth/codex/experiment/SKILL.md | planning | alignment-document | L20: - Read `research/assumption-tracker.md` if it exists — pulls the highest-priority unvalidated assumption |
| packs/business-growth/codex/metrics/SKILL.md | analysis | alignment-document | L23: - **Hard**: `research/journey-map.md` (or `research/{slug}/journey-map.md` in product-path mode) must exist. If not, tell the user to run `$journey-map` firs... |
| packs/business-ops/claude/assumption-tracker/SKILL.md | analysis | alignment-document | L13: Scans all `research/*.md` files, extracts implicit and explicit assumptions, ranks by risk (catastrophic if wrong) × uncertainty (how little evidence), and p... |
| packs/business-ops/claude/burn-rate/SKILL.md | analysis | alignment-document | L19: - `research/monetization.md` (or `research/{slug}/monetization.md`) — pricing tiers, unit economics, revenue model |
| packs/business-ops/claude/cohort-review/SKILL.md | analysis | alignment-document | L21: - **Hard**: `research/metrics.md` (or `research/{slug}/metrics.md`) must exist. If not, tell the user to run `/metrics` first and stop. |
| packs/business-ops/claude/investor-update/SKILL.md | analysis | alignment-document | L21: - Read all that exist: `research/metrics.md`, `research/cohort-review-*.md`, `research/runway-model.md`, `research/customer-feedback.md`, `research/gtm.md`, ... |
| packs/business-ops/claude/product-line/SKILL.md | ops | direct-utility | L17: Manage product paths tracked in `research/.progress.yaml`. Product paths are research divergences — different products, apps, ICPs, expansion candidates, piv... |
| packs/business-ops/claude/repo-glossary/SKILL.md | analysis | misclassified | L11: Scans all research documents, CLAUDE.md, and docs for domain-specific terminology, then audits the shared glossary for accuracy, conflicts, staleness, shadow... |
| packs/business-ops/claude/retro/SKILL.md | analysis | alignment-document | L20: - **Hard**: At least 2 research docs must exist, AND at least one source of outcome data must exist (`research/customer-feedback.md`, `research/cohort-review... |
| packs/business-ops/claude/risk-register/SKILL.md | analysis | alignment-document | L21: - Read all that exist: `research/icp.md`, `research/competitive-analysis.md`, `research/gtm.md`, `research/monetization.md`, `research/runway-model.md`, `res... |
| packs/business-ops/claude/runway-model/SKILL.md | analysis | alignment-document | L21: - Read `research/monetization.md` if it exists — theoretical unit economics and pricing to compare against actuals |
| packs/business-ops/claude/scale-audit/SKILL.md | analysis | alignment-document | L17: Automated analysis that evaluates the current codebase against the enterprise discovery in `research/enterprise-icp.md`. Identifies what's missing for enterp... |
| packs/business-ops/codex/assumption-tracker/SKILL.md | analysis | alignment-document | L15: Scans all `research/*.md` files, extracts implicit and explicit assumptions, ranks by risk (catastrophic if wrong) × uncertainty (how little evidence), and p... |
| packs/business-ops/codex/burn-rate/SKILL.md | analysis | alignment-document | L21: - **Soft**: Read if they exist — `research/monetization.md`, `research/metrics.md`, `research/gtm.md`, `research/icp.md`, `CLAUDE.md`, `README`. |
| packs/business-ops/codex/cohort-review/SKILL.md | analysis | alignment-document | L23: - **Hard**: `research/metrics.md` (or `research/{slug}/metrics.md`) must exist. If not, tell the user to run `$metrics` first and stop. |
| packs/business-ops/codex/investor-update/SKILL.md | analysis | alignment-document | L23: - Read all that exist: `research/metrics.md`, `research/cohort-review-*.md`, `research/runway-model.md`, `research/customer-feedback.md`, `research/gtm.md`, ... |
| packs/business-ops/codex/product-line/SKILL.md | ops | direct-utility | L19: Manage product paths tracked in `research/.progress.yaml`. Product paths are research divergences — different products, apps, ICPs, expansion candidates, piv... |
| packs/business-ops/codex/repo-glossary/SKILL.md | analysis | misclassified | L13: Scans all research documents, CLAUDE.md, and docs for domain-specific terminology, then audits the shared glossary for accuracy, conflicts, staleness, shadow... |
| packs/business-ops/codex/retro/SKILL.md | analysis | alignment-document | L22: - **Hard**: At least 2 research docs must exist, AND at least one source of outcome data must exist (`research/customer-feedback.md`, `research/cohort-review... |
| packs/business-ops/codex/risk-register/SKILL.md | analysis | alignment-document | L23: - Read all that exist: `research/icp.md`, `research/competitive-analysis.md`, `research/gtm.md`, `research/monetization.md`, `research/runway-model.md`, `res... |
| packs/business-ops/codex/runway-model/SKILL.md | analysis | alignment-document | L23: - Read `research/monetization.md` if it exists — theoretical unit economics and pricing to compare against actuals |
| packs/business-ops/codex/scale-audit/SKILL.md | analysis | alignment-document | L18: Automated analysis that evaluates the codebase against `research/enterprise-icp.md`. Identifies gaps for enterprise deals — stakeholder journey coverage, com... |
| packs/creator-foundation/claude/research-directory-conventions/SKILL.md | analysis | alignment-document | L23: research/ |
| packs/creator-foundation/claude/series-spec/SKILL.md | planning | alignment-document | L19: - Prefer `research/youtube/content-programming-<slug>.md` and `creator-positioning-<slug>.md`. |
| packs/creator-foundation/codex/research-directory-conventions/SKILL.md | analysis | alignment-document | L19: research/ |
| packs/creator-foundation/codex/series-spec/SKILL.md | planning | alignment-document | L19: - Prefer `research/youtube/content-programming-<slug>.md` and `creator-positioning-<slug>.md`. |
| packs/customer-lifecycle/claude/conversion-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/claude/expansion-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/claude/journey-map/SKILL.md | analysis | misclassified | L33: 2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, ... |
| packs/customer-lifecycle/claude/lifecycle-metrics/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/claude/onboarding-map/SKILL.md | analysis | alignment-document | L19: Create the stage-level onboarding plan that expands `research/journey-map.md`. |
| packs/customer-lifecycle/claude/retention-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/claude/transaction-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/codex/conversion-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/codex/expansion-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/codex/journey-map/SKILL.md | analysis | misclassified | L33: 2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, ... |
| packs/customer-lifecycle/codex/lifecycle-metrics/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/codex/onboarding-map/SKILL.md | analysis | alignment-document | L19: Create the stage-level onboarding plan that expands `research/journey-map.md`. |
| packs/customer-lifecycle/codex/retention-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/customer-lifecycle/codex/transaction-map/SKILL.md | analysis | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/devtool/claude/devtool-docs-audit/SKILL.md | review | alignment-document | L15: Write or update `research/devtool-docs-audit.md` with a findings-first docs audit covering quickstart clarity, examples, API reference, troubleshooting, migr... |
| packs/devtool/claude/devtool-dx-journey/SKILL.md | analysis | direct-utility | L16: Write or update `research/devtool-dx-journey.md` with install, quickstart, first success, error recovery, production adoption, team rollout, and retention jo... |
| packs/devtool/claude/devtool-integration-map/SKILL.md | analysis | alignment-document | L16: Write or update `research/devtool-integration-map.md` with required integrations, ecosystem assumptions, setup path, compatibility constraints, and migration... |
| packs/devtool/codex/devtool-docs-audit/SKILL.md | review | alignment-document | L17: Write or update `research/devtool-docs-audit.md` with a findings-first docs audit covering quickstart clarity, examples, API reference, troubleshooting, migr... |
| packs/devtool/codex/devtool-dx-journey/SKILL.md | analysis | direct-utility | L18: Write or update `research/devtool-dx-journey.md` with install, quickstart, first success, error recovery, production adoption, team rollout, and retention jo... |
| packs/devtool/codex/devtool-integration-map/SKILL.md | analysis | alignment-document | L18: Write or update `research/devtool-integration-map.md` with required integrations, ecosystem assumptions, setup path, compatibility constraints, and migration... |
| packs/docs-health/claude/hygiene/SKILL.md | analysis | direct-utility | L87: - `research/` for research docs, interview logs, search logs, experiments, and reconciliation reports |
| packs/docs-health/codex/hygiene/SKILL.md | analysis | direct-utility | L88: - `research/` for research docs, interview logs, search logs, experiments, and reconciliation reports |
| packs/game/claude/game-core-loop/SKILL.md | analysis | alignment-document | L16: Write or update `research/game-core-loop.md` with the 10-second interaction loop, 1-minute action loop, 5-minute session loop, 30-minute progression loop, mu... |
| packs/game/claude/game-playtest-metrics/SKILL.md | analysis | alignment-document | L16: Write or update `research/game-playtest-metrics.md` with first-session completion, time-to-fun, replay rate, confusion points, quit points, clip/share moment... |
| packs/game/claude/game-prototype-test/SKILL.md | planning | alignment-document | L16: Write or update `research/game-prototype-test.md` with prototype scope, test questions, playtest script, observation checklist, success criteria, and cut/kee... |
| packs/game/codex/game-core-loop/SKILL.md | analysis | alignment-document | L18: Write or update `research/game-core-loop.md` with the 10-second interaction loop, 1-minute action loop, 5-minute session loop, 30-minute progression loop, mu... |
| packs/game/codex/game-playtest-metrics/SKILL.md | analysis | alignment-document | L18: Write or update `research/game-playtest-metrics.md` with first-session completion, time-to-fun, replay rate, confusion points, quit points, clip/share moment... |
| packs/game/codex/game-prototype-test/SKILL.md | planning | alignment-document | L18: Write or update `research/game-prototype-test.md` with prototype scope, test questions, playtest script, observation checklist, success criteria, and cut/kee... |
| packs/guided-walkthrough/claude/uat-guide/SKILL.md | analysis | alignment-document | L18: Expand a single UAT journey from `research/uat-plan.md` into detailed, step-by-step tester instructions. UAT planning (`/uat`) produces high-level task seque... |
| packs/guided-walkthrough/codex/uat-guide/SKILL.md | analysis | alignment-document | L18: Expand a single UAT journey from `research/uat-plan.md` into detailed, step-by-step tester instructions. UAT planning (`$uat`) produces high-level task seque... |
| packs/ord/claude/ord-ship/SKILL.md | ops | direct-utility | L36: 5. **Ship log:** Append entry to `research/ord-ship-log.md`: |
| packs/ord/codex/ord-ship/SKILL.md | ops | direct-utility | L36: 5. **Ship log:** Append entry to `research/ord-ship-log.md`: |
| packs/product-design/claude/brainstorm/SKILL.md | planning | alignment-document | L21: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/consolidate-variations/SKILL.md | planning | alignment-document | L24: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/feature-interview/SKILL.md | planning | alignment-document | L28: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/prototype/SKILL.md | execution | alignment-document | L39: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/spec-interview/SKILL.md | planning | alignment-document | L33: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/ui-interview/SKILL.md | planning | alignment-document | L29: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/user-flow-map/SKILL.md | planning | alignment-document | L29: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/claude/ux-variations/SKILL.md | planning | alignment-document | L28: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/brainstorm/SKILL.md | planning | alignment-document | L23: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/consolidate-variations/SKILL.md | planning | alignment-document | L24: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/feature-interview/SKILL.md | planning | alignment-document | L30: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/prototype/SKILL.md | execution | alignment-document | L39: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/spec-interview/SKILL.md | planning | alignment-document | L35: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/ui-interview/SKILL.md | planning | alignment-document | L29: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/user-flow-map/SKILL.md | planning | alignment-document | L29: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-design/codex/ux-variations/SKILL.md | planning | alignment-document | L28: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-testing/claude/dogfood/SKILL.md | analysis | alignment-document | L30: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-testing/claude/uat/SKILL.md | analysis | alignment-document | L32: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-testing/codex/dogfood/SKILL.md | analysis | alignment-document | L30: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/product-testing/codex/uat/SKILL.md | analysis | alignment-document | L32: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/remotion/claude/video-build/SKILL.md | planning | alignment-document | L28: - `research/youtube/product-led-media-map-<slug>.md` (proof assets) |
| packs/remotion/claude/video-script/SKILL.md | planning | alignment-document | L23: - `research/youtube/product-led-media-map-<slug>.md` |
| packs/remotion/codex/video-build/SKILL.md | planning | alignment-document | L28: - `research/youtube/product-led-media-map-<slug>.md` (proof assets) |
| packs/remotion/codex/video-script/SKILL.md | planning | alignment-document | L23: - `research/youtube/product-led-media-map-<slug>.md` |
| packs/repo-maintenance/claude/bootstrap-repo/SKILL.md | execution | direct-utility | L28: - Archive old docs by default, including `docs/`, `alignment/`, `research/`, `specs/`, `tasks/`, planning reports, implementation notes, design docs, old REA... |
| packs/repo-maintenance/codex/bootstrap-repo/SKILL.md | execution | direct-utility | L30: - Archive old docs by default, including `docs/`, `alignment/`, `research/`, `specs/`, `tasks/`, planning reports, implementation notes, design docs, old REA... |
| packs/report-gen/claude/report-website/SKILL.md | execution | alignment-document | L24: - Read the requested Markdown report path, directory, or `--all-output-docs` mode. If no path was provided, locate likely report files under `reports/`, `doc... |
| packs/report-gen/codex/report-website/SKILL.md | execution | alignment-document | L24: - Read the requested Markdown report path, directory, or `--all-output-docs` mode. If no path was provided, locate likely report files under `reports/`, `doc... |
| packs/research-admin/claude/research-roadmap/SKILL.md | planning | alignment-document | L27: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/research-admin/codex/research-roadmap/SKILL.md | planning | alignment-document | L29: 1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as t... |
| packs/vard/claude/vard-ship/SKILL.md | ops | direct-utility | L32: 5. **Ship log:** Append entry to `research/vard-ship-log.md`: |
| packs/vard/codex/vard-ship/SKILL.md | ops | direct-utility | L32: 5. **Ship log:** Append entry to `research/vard-ship-log.md`: |
| packs/youtube-ops/claude/youtube/SKILL.md | router | direct-utility | L83: Read-only scan of `research/youtube/` artifacts. Report: |
| packs/youtube-ops/codex/youtube/SKILL.md | router | direct-utility | L83: Read-only scan of `research/youtube/` artifacts. Report: |

## Alignment Skip-list Candidates

These direct-utility classifications still show alignment-page behavior and should either lose that behavior or be deliberately documented as exceptions.

| Path | Type | Skip-listed | Alignment evidence |
| --- | --- | --- | --- |
| global/claude/autoresearch-prep/SKILL.md | planning | no |  |
| packs/agent-bridge/claude/delegate/SKILL.md | shipping | no | L76: ## Alignment Page |
| packs/agent-work-admin/claude/roadmap/SKILL.md | planning | yes | L431: ## Alignment Page |
| packs/agent-work-admin/codex/roadmap/SKILL.md | planning | yes | L378: ## Alignment Page |
| packs/alignment-loop/claude/destination-doc/SKILL.md | planning | yes | L19: 5. **Write an alignment review page** at `alignment/destination-doc-[topic].html`. If that file already exists, archive it first to `docs/history/archive/YYY... |
| packs/alignment-loop/codex/destination-doc/SKILL.md | planning | yes | L19: 5. **Write an alignment review page** at `alignment/destination-doc-[topic].html`. If that file already exists, archive it first to `docs/history/archive/YYY... |
| packs/alignment-page-admin/claude/compile-central-alignment/SKILL.md | ops | yes | L3: description: Generate a central alignment/index.html table of contents for all alignment pages in the current repo |
| packs/alignment-page-admin/claude/upgrade-alignment-pages/SKILL.md | ops | yes | L3: description: Audit and explicitly upgrade generated alignment/*.html review pages to the current local alignment-page standard while preserving page-specific... |
| packs/alignment-page-admin/codex/compile-central-alignment/SKILL.md | ops | yes | L3: description: Generate a central alignment/index.html table of contents for all alignment pages in the current repo |
| packs/alignment-page-admin/codex/upgrade-alignment-pages/SKILL.md | ops | yes | L3: description: Audit and explicitly upgrade generated alignment/*.html review pages to the current local alignment-page standard while preserving page-specific... |
| packs/business-ops/claude/product-line/SKILL.md | ops | no | L187: ## Alignment Page |
| packs/business-ops/codex/product-line/SKILL.md | ops | no | L179: ## Alignment Page |
| packs/code-quality/claude/quality-sweep/SKILL.md | execution | no | L72: ## Alignment Page |
| packs/code-quality/codex/quality-sweep/SKILL.md | execution | no | L74: ## Alignment Page |
| packs/context-transfer/claude/handoff/SKILL.md | shipping | no | L107: ## Alignment Page |
| packs/context-transfer/codex/handoff/SKILL.md | shipping | no | L42: ## Alignment Page |
| packs/devtool/claude/devtool-dx-journey/SKILL.md | analysis | no | L36: ## Alignment Page |
| packs/devtool/codex/devtool-dx-journey/SKILL.md | analysis | no | L38: ## Alignment Page |
| packs/docs-health/claude/hygiene/SKILL.md | analysis | yes | L89: - `alignment/*.html` for generated browser-review alignment artifacts from planning and prototype workflows |
| packs/docs-health/codex/hygiene/SKILL.md | analysis | yes | L90: - `alignment/*.html` for generated browser-review alignment artifacts from planning and prototype workflows |
| packs/game/claude/game-workflow/SKILL.md | planning | no | L26: ## Alignment Page |
| packs/game/codex/game-workflow/SKILL.md | planning | no | L28: ## Alignment Page |
| packs/project-fleet/claude/clone-spec-store/SKILL.md | planning | no | L238: ## Alignment Page |
| packs/project-fleet/claude/skill-inventory/SKILL.md | ops | no | L23: - Only write control-repo artifacts: `tasks/skill-inventory.md`, `alignment/skill-inventory-{topic}.html`, task notes, prompt history, and normal shipping docs. |
| packs/project-fleet/codex/clone-spec-store/SKILL.md | planning | no | L252: ## Alignment Page |
| packs/project-fleet/codex/skill-inventory/SKILL.md | ops | no | L23: - Only write control-repo artifacts: `tasks/skill-inventory.md`, `alignment/skill-inventory-{topic}.html`, task notes, prompt history, and normal shipping docs. |
| packs/release-ops/claude/branch-lifecycle/SKILL.md | ops | no | L152: ## Alignment Page |
| packs/release-ops/claude/release/SKILL.md | shipping | no | L89: ## Alignment Page |
| packs/release-ops/codex/branch-lifecycle/SKILL.md | ops | no | L154: ## Alignment Page |
| packs/release-ops/codex/release/SKILL.md | shipping | no | L43: ## Alignment Page |
| packs/skill-dev/claude/targeted-skill-builder/SKILL.md | execution | no | L110: ## Alignment Page |
| packs/skill-dev/codex/targeted-skill-builder/SKILL.md | execution | no | L112: ## Alignment Page |
| packs/teardown/claude/desk-flip/SKILL.md | execution | no | L95: ## Alignment Page |
| packs/teardown/codex/desk-flip/SKILL.md | execution | no | L95: ## Alignment Page |
| packs/youtube-ops/claude/youtube/SKILL.md | router | no |  |
| packs/youtube-ops/codex/youtube/SKILL.md | router | no |  |

## Skip-list Bundle Violations

Skills listed in `scripts/alignment-skip-list.txt` should not have sibling `ALIGNMENT-PAGE.md` bundles.

_None._

## Marker-compliant Research Skills Needing Semantic Review

| Path | Name | Reasons |
| --- | --- | --- |
| packs/business-discovery/codex/competitive-analysis/SKILL.md | competitive-analysis | no-explicit-output-section |
| packs/business-discovery/codex/enterprise-icp/SKILL.md | enterprise-icp | no-explicit-output-section |
| packs/business-ops/codex/mvp-gap/SKILL.md | mvp-gap | no-explicit-output-section |
| packs/business-ops/codex/platform-strategy/SKILL.md | platform-strategy | no-explicit-output-section |
| packs/business-ops/codex/reconcile-research/SKILL.md | reconcile-research | no-explicit-output-section |
| packs/creator-foundation/claude/creator-evidence-schema/SKILL.md | creator-evidence-schema | name-suggests-validation-planning-or-utility-review-needed, no-explicit-output-section |
| packs/creator-foundation/claude/creator-metrics-review/SKILL.md | creator-metrics-review | name-suggests-validation-planning-or-utility-review-needed |
| packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md | creator-platform-capability-matrix | no-explicit-output-section |
| packs/creator-foundation/claude/creator-presence-dossier/SKILL.md | creator-presence-dossier | description-or-body-says-router-or-no-research-artifacts, no-explicit-output-section |
| packs/creator-foundation/codex/creator-evidence-schema/SKILL.md | creator-evidence-schema | name-suggests-validation-planning-or-utility-review-needed, no-explicit-output-section |
| packs/creator-foundation/codex/creator-metrics-review/SKILL.md | creator-metrics-review | name-suggests-validation-planning-or-utility-review-needed |
| packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md | creator-platform-capability-matrix | no-explicit-output-section |
| packs/creator-foundation/codex/creator-presence-dossier/SKILL.md | creator-presence-dossier | description-or-body-says-router-or-no-research-artifacts, no-explicit-output-section |
| packs/game/claude/game-launch/SKILL.md | game-launch | name-suggests-validation-planning-or-utility-review-needed |
| packs/game/claude/game-store-page-test/SKILL.md | game-store-page-test | name-suggests-validation-planning-or-utility-review-needed |
| packs/game/codex/game-launch/SKILL.md | game-launch | name-suggests-validation-planning-or-utility-review-needed |
| packs/game/codex/game-store-page-test/SKILL.md | game-store-page-test | name-suggests-validation-planning-or-utility-review-needed |
| packs/youtube-ops/claude/youtube-audit/SKILL.md | youtube-audit | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-cadence-diagnosis/SKILL.md | youtube-cadence-diagnosis | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-channel-audit/SKILL.md | youtube-channel-audit | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-description-optimizer/SKILL.md | youtube-description-optimizer | name-suggests-validation-planning-or-utility-review-needed |
| packs/youtube-ops/claude/youtube-peer-benchmark/SKILL.md | youtube-peer-benchmark | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-portfolio/SKILL.md | youtube-portfolio | name-suggests-validation-planning-or-utility-review-needed |
| packs/youtube-ops/claude/youtube-search-positioning/SKILL.md | youtube-search-positioning | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-title-thumbnail-audit/SKILL.md | youtube-title-thumbnail-audit | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-video-audit/SKILL.md | youtube-video-audit | no-explicit-output-section |
| packs/youtube-ops/claude/youtube-video-prelaunch-audit/SKILL.md | youtube-video-prelaunch-audit | name-suggests-validation-planning-or-utility-review-needed, no-explicit-output-section |
| packs/youtube-ops/codex/youtube-audit/SKILL.md | youtube-audit | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-cadence-diagnosis/SKILL.md | youtube-cadence-diagnosis | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-channel-audit/SKILL.md | youtube-channel-audit | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-description-optimizer/SKILL.md | youtube-description-optimizer | name-suggests-validation-planning-or-utility-review-needed |
| packs/youtube-ops/codex/youtube-peer-benchmark/SKILL.md | youtube-peer-benchmark | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-portfolio/SKILL.md | youtube-portfolio | name-suggests-validation-planning-or-utility-review-needed |
| packs/youtube-ops/codex/youtube-search-positioning/SKILL.md | youtube-search-positioning | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-title-thumbnail-audit/SKILL.md | youtube-title-thumbnail-audit | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-video-audit/SKILL.md | youtube-video-audit | no-explicit-output-section |
| packs/youtube-ops/codex/youtube-video-prelaunch-audit/SKILL.md | youtube-video-prelaunch-audit | name-suggests-validation-planning-or-utility-review-needed, no-explicit-output-section |

## Staged-research Marker Issues

_None._

## Non-research Generic Working-packet Misuse

| Path | Type | Category | Working evidence |
| --- | --- | --- | --- |
| packs/business-ops/claude/repo-glossary/SKILL.md | analysis | misclassified | L210: 2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, ... |
| packs/business-ops/codex/repo-glossary/SKILL.md | analysis | misclassified | L212: 2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, ... |
| packs/customer-lifecycle/claude/journey-map/SKILL.md | analysis | misclassified | L33: 2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, ... |
| packs/customer-lifecycle/codex/journey-map/SKILL.md | analysis | misclassified | L33: 2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, ... |

## In-scope Inventory

### staged-research

| Path | Type | Signals | Issues |
| --- | --- | --- | --- |
| packs/business-discovery/claude/competitive-analysis/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/competitive-analysis/frameworks/feature-pricing-matrix/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/competitive-analysis/frameworks/porter-five-forces/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/competitive-analysis/frameworks/strategic-group-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/competitive-analysis/frameworks/swot/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-discovery/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-discovery/frameworks/five-rings/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-discovery/frameworks/four-forces/SKILL.md | research | type:research, alignment, research/, _working, staged, utility |  |
| packs/business-discovery/claude/customer-discovery/frameworks/jtbd-needs/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-discovery/frameworks/pmf-engine/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-discovery/frameworks/seven-dimensions/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-discovery/frameworks/w3-hypothesis/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/customer-feedback/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/enterprise-icp/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/lean-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/positioning/frameworks/category-design/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/positioning/frameworks/jtbd-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/positioning/frameworks/moore-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/positioning/frameworks/obviously-awesome/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/positioning/frameworks/strategic-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/claude/value-prop-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/competitive-analysis/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/competitive-analysis/frameworks/feature-pricing-matrix/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/competitive-analysis/frameworks/porter-five-forces/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/competitive-analysis/frameworks/strategic-group-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/competitive-analysis/frameworks/swot/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-discovery/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-discovery/frameworks/five-rings/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-discovery/frameworks/four-forces/SKILL.md | research | type:research, alignment, research/, _working, staged, utility |  |
| packs/business-discovery/codex/customer-discovery/frameworks/jtbd-needs/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-discovery/frameworks/pmf-engine/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-discovery/frameworks/seven-dimensions/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-discovery/frameworks/w3-hypothesis/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/customer-feedback/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/enterprise-icp/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/lean-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/positioning/frameworks/category-design/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/positioning/frameworks/jtbd-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/positioning/frameworks/moore-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/positioning/frameworks/obviously-awesome/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/positioning/frameworks/strategic-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-discovery/codex/value-prop-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/claude/growth-model/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/claude/gtm/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/claude/hook-model/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/claude/landing-copy/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/claude/monetization/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/claude/pmf-assessment/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/codex/growth-model/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/codex/gtm/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/codex/hook-model/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/codex/landing-copy/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/codex/monetization/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-growth/codex/pmf-assessment/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-ops/claude/mvp-gap/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-ops/claude/platform-strategy/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-ops/claude/reconcile-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-ops/codex/mvp-gap/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-ops/codex/platform-strategy/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/business-ops/codex/reconcile-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/claude/content-programming/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/claude/creator-evidence-schema/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/claude/creator-metrics-review/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/claude/creator-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/claude/creator-presence-dossier/SKILL.md | research | type:research, alignment, research/, _working, staged, utility |  |
| packs/creator-foundation/claude/product-led-media-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/codex/content-programming/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/codex/creator-evidence-schema/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/codex/creator-metrics-review/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/codex/creator-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/creator-foundation/codex/creator-presence-dossier/SKILL.md | research | type:research, alignment, research/, _working, staged, utility |  |
| packs/creator-foundation/codex/product-led-media-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/claude/journey-map/frameworks/customer-journey-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/claude/journey-map/frameworks/experience-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/claude/journey-map/frameworks/jtbd-timeline/SKILL.md | research | type:research, alignment, research/, _working, staged, utility |  |
| packs/customer-lifecycle/claude/journey-map/frameworks/service-blueprint/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/claude/journey-map/frameworks/user-story-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/codex/journey-map/frameworks/customer-journey-canvas/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/codex/journey-map/frameworks/experience-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/codex/journey-map/frameworks/jtbd-timeline/SKILL.md | research | type:research, alignment, research/, _working, staged, utility |  |
| packs/customer-lifecycle/codex/journey-map/frameworks/service-blueprint/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/customer-lifecycle/codex/journey-map/frameworks/user-story-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/claude/devtool-adoption/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/claude/devtool-monetization/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/claude/devtool-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/claude/devtool-user-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/codex/devtool-adoption/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/codex/devtool-monetization/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/codex/devtool-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/devtool/codex/devtool-user-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/claude/game-audience/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/claude/game-comparables/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/claude/game-fantasy/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/claude/game-genre-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/claude/game-launch/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/claude/game-store-page-test/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/codex/game-audience/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/codex/game-comparables/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/codex/game-fantasy/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/codex/game-genre-map/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/codex/game-launch/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/game/codex/game-store-page-test/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/ord/claude/ord-scan/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/ord/codex/ord-scan/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/remotion/claude/youtube-format-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/remotion/codex/youtube-format-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/vard/claude/vard-scan/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/vard/codex/vard-scan/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-cadence-diagnosis/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-channel-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-competitive-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-concept-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-description-optimizer/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-peer-benchmark/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-portfolio/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-search-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-title-thumbnail-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-vid-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-video-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/claude/youtube-video-prelaunch-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-cadence-diagnosis/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-channel-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-competitive-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-concept-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-description-optimizer/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-peer-benchmark/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-portfolio/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-search-positioning/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-title-thumbnail-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-vid-research/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-video-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |
| packs/youtube-ops/codex/youtube-video-prelaunch-audit/SKILL.md | research | type:research, alignment, research/, _working, staged |  |

### alignment-document

| Path | Type | Signals | Issues |
| --- | --- | --- | --- |
| global/claude/afps-status/SKILL.md | analysis | alignment, research/ |  |
| global/claude/animation-design-planner/SKILL.md | planning | alignment |  |
| global/claude/codebase-status/SKILL.md | analysis | research/ |  |
| global/claude/fork-idea-branch/SKILL.md | planning | alignment, research/, _working |  |
| global/claude/idea-scope-brief/SKILL.md | planning | alignment, research/ |  |
| global/codex/afps-status/SKILL.md | analysis | alignment, research/ |  |
| global/codex/animation-design-planner/SKILL.md | planning | alignment |  |
| global/codex/codebase-status/SKILL.md | analysis | research/ |  |
| global/codex/idea-scope-brief/SKILL.md | planning | alignment, research/ |  |
| packs/agent-work-admin/claude/spec-drift/SKILL.md | analysis | research/ |  |
| packs/agent-work-admin/codex/spec-drift/SKILL.md | analysis | research/ |  |
| packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md | analysis | alignment |  |
| packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md | execution | alignment |  |
| packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md | analysis | alignment |  |
| packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md | execution | alignment |  |
| packs/alignment-loop/claude/vertical-slice-splitter/SKILL.md | planning | alignment |  |
| packs/alignment-loop/codex/vertical-slice-splitter/SKILL.md | planning | alignment |  |
| packs/business-growth/claude/experiment/SKILL.md | planning | alignment, research/ |  |
| packs/business-growth/claude/metrics/SKILL.md | analysis | alignment, research/ |  |
| packs/business-growth/codex/experiment/SKILL.md | planning | alignment, research/ |  |
| packs/business-growth/codex/metrics/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/assumption-tracker/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/burn-rate/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/cohort-review/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/investor-update/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/retro/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/risk-register/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/runway-model/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/claude/scale-audit/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/assumption-tracker/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/burn-rate/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/cohort-review/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/investor-update/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/retro/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/risk-register/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/runway-model/SKILL.md | analysis | alignment, research/ |  |
| packs/business-ops/codex/scale-audit/SKILL.md | analysis | alignment, research/ |  |
| packs/code-maintenance/claude/migrate/SKILL.md | execution | alignment |  |
| packs/code-maintenance/codex/migrate/SKILL.md | execution | alignment |  |
| packs/code-quality/claude/extract-shared-types/SKILL.md | execution | alignment |  |
| packs/code-quality/codex/extract-shared-types/SKILL.md | execution | alignment |  |
| packs/code-review/claude/dead-code/SKILL.md | analysis | alignment |  |
| packs/code-review/claude/expert-review/SKILL.md | review | alignment |  |
| packs/code-review/claude/regression-check/SKILL.md | review | alignment |  |
| packs/code-review/claude/slim-audit/SKILL.md | analysis | alignment |  |
| packs/code-review/codex/dead-code/SKILL.md | analysis | alignment |  |
| packs/code-review/codex/expert-review/SKILL.md | review | alignment |  |
| packs/code-review/codex/regression-check/SKILL.md | review | alignment |  |
| packs/code-review/codex/slim-audit/SKILL.md | analysis | alignment |  |
| packs/creator-foundation/claude/research-directory-conventions/SKILL.md | analysis | alignment, research/ |  |
| packs/creator-foundation/claude/series-spec/SKILL.md | planning | alignment, research/ |  |
| packs/creator-foundation/codex/research-directory-conventions/SKILL.md | analysis | alignment, research/ |  |
| packs/creator-foundation/codex/series-spec/SKILL.md | planning | alignment, research/ |  |
| packs/customer-lifecycle/claude/conversion-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/claude/expansion-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/claude/lifecycle-metrics/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/claude/onboarding-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/claude/retention-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/claude/transaction-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/codex/conversion-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/codex/expansion-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/codex/lifecycle-metrics/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/codex/onboarding-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/codex/retention-map/SKILL.md | analysis | alignment, research/ |  |
| packs/customer-lifecycle/codex/transaction-map/SKILL.md | analysis | alignment, research/ |  |
| packs/devtool/claude/devtool-docs-audit/SKILL.md | review | alignment, research/ |  |
| packs/devtool/claude/devtool-integration-map/SKILL.md | analysis | alignment, research/ |  |
| packs/devtool/claude/devtool-workflow/SKILL.md | planning | alignment |  |
| packs/devtool/codex/devtool-docs-audit/SKILL.md | review | alignment, research/ |  |
| packs/devtool/codex/devtool-integration-map/SKILL.md | analysis | alignment, research/ |  |
| packs/devtool/codex/devtool-workflow/SKILL.md | planning | alignment |  |
| packs/docs-health/claude/reconcile-dev-docs/SKILL.md | analysis | alignment |  |
| packs/docs-health/codex/reconcile-dev-docs/SKILL.md | analysis | alignment |  |
| packs/game/claude/game-core-loop/SKILL.md | analysis | alignment, research/ |  |
| packs/game/claude/game-playtest-metrics/SKILL.md | analysis | alignment, research/ |  |
| packs/game/claude/game-prototype-test/SKILL.md | planning | alignment, research/ |  |
| packs/game/claude/game-roadmap/SKILL.md | planning | alignment |  |
| packs/game/codex/game-core-loop/SKILL.md | analysis | alignment, research/ |  |
| packs/game/codex/game-playtest-metrics/SKILL.md | analysis | alignment, research/ |  |
| packs/game/codex/game-prototype-test/SKILL.md | planning | alignment, research/ |  |
| packs/game/codex/game-roadmap/SKILL.md | planning | alignment |  |
| packs/guided-walkthrough/claude/uat-guide/SKILL.md | analysis | alignment, research/ |  |
| packs/guided-walkthrough/codex/uat-guide/SKILL.md | analysis | alignment, research/ |  |
| packs/monorepo/claude/mono-plan/SKILL.md | planning | alignment |  |
| packs/monorepo/codex/mono-plan/SKILL.md | planning | alignment |  |
| packs/product-design/claude/brainstorm/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/claude/consolidate-variations/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/claude/design-system/SKILL.md | planning | alignment |  |
| packs/product-design/claude/feature-interview/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/claude/prototype/SKILL.md | execution | alignment, research/ |  |
| packs/product-design/claude/spec-interview/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/claude/ui-interview/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/claude/user-flow-map/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/claude/ux-variations/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/brainstorm/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/consolidate-variations/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/design-system/SKILL.md | planning | alignment |  |
| packs/product-design/codex/feature-interview/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/prototype/SKILL.md | execution | alignment, research/ |  |
| packs/product-design/codex/spec-interview/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/ui-interview/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/user-flow-map/SKILL.md | planning | alignment, research/ |  |
| packs/product-design/codex/ux-variations/SKILL.md | planning | alignment, research/ |  |
| packs/product-testing/claude/dogfood/SKILL.md | analysis | alignment, research/ |  |
| packs/product-testing/claude/uat/SKILL.md | analysis | alignment, research/ |  |
| packs/product-testing/codex/dogfood/SKILL.md | analysis | alignment, research/ |  |
| packs/product-testing/codex/uat/SKILL.md | analysis | alignment, research/ |  |
| packs/project-fleet/codex/project-fleet/SKILL.md | orchestration | alignment |  |
| packs/project-fleet/codex/spin-off/SKILL.md | execution | alignment |  |
| packs/remotion/claude/video-build/SKILL.md | planning | alignment, research/ |  |
| packs/remotion/claude/video-script/SKILL.md | planning | alignment, research/ |  |
| packs/remotion/codex/video-build/SKILL.md | planning | alignment, research/ |  |
| packs/remotion/codex/video-script/SKILL.md | planning | alignment, research/ |  |
| packs/report-gen/claude/report-website/SKILL.md | execution | alignment, research/ |  |
| packs/report-gen/codex/report-website/SKILL.md | execution | alignment, research/ |  |
| packs/research-admin/claude/research-roadmap/SKILL.md | planning | alignment, research/ |  |
| packs/research-admin/codex/research-roadmap/SKILL.md | planning | alignment, research/ |  |
| packs/session-analytics/claude/analyze-sessions/SKILL.md | analysis | alignment |  |
| packs/session-analytics/claude/prompt-history-backfill/SKILL.md | analysis | alignment |  |
| packs/session-analytics/codex/analyze-sessions/SKILL.md | analysis | alignment |  |
| packs/session-analytics/codex/prompt-history-backfill/SKILL.md | analysis | alignment |  |
| packs/skill-dev/claude/skill-interview/SKILL.md | planning | alignment |  |
| packs/skill-dev/codex/skill-interview/SKILL.md | planning | alignment |  |
| packs/teardown/claude/decommission/SKILL.md | execution | alignment |  |
| packs/teardown/codex/decommission/SKILL.md | execution | alignment |  |
| packs/website-polish/claude/icon-handler/SKILL.md | execution | alignment |  |
| packs/website-polish/codex/icon-handler/SKILL.md | execution | alignment |  |

### direct-utility

| Path | Type | Signals | Issues |
| --- | --- | --- | --- |
| global/claude/autoresearch-prep/SKILL.md | planning | alignment, utility | direct utility has alignment-page behavior |
| global/claude/pack/SKILL.md | ops | research/, utility |  |
| global/codex/pack/SKILL.md | ops | research/, utility |  |
| packs/agent-bridge/claude/delegate/SKILL.md | shipping | alignment, utility | direct utility has alignment-page behavior |
| packs/agent-work-admin/claude/roadmap/SKILL.md | planning | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/agent-work-admin/codex/roadmap/SKILL.md | planning | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/alignment-loop/claude/destination-doc/SKILL.md | planning | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/alignment-loop/claude/taste-calibration/SKILL.md | planning | research/, utility |  |
| packs/alignment-loop/codex/destination-doc/SKILL.md | planning | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/alignment-loop/codex/taste-calibration/SKILL.md | planning | research/, utility |  |
| packs/alignment-page-admin/claude/compile-central-alignment/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/alignment-page-admin/claude/upgrade-alignment-pages/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/alignment-page-admin/codex/compile-central-alignment/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/alignment-page-admin/codex/upgrade-alignment-pages/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/business-ops/claude/product-line/SKILL.md | ops | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/business-ops/codex/product-line/SKILL.md | ops | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/code-quality/claude/quality-sweep/SKILL.md | execution | alignment, utility | direct utility has alignment-page behavior |
| packs/code-quality/codex/quality-sweep/SKILL.md | execution | alignment, utility | direct utility has alignment-page behavior |
| packs/context-transfer/claude/handoff/SKILL.md | shipping | alignment, utility | direct utility has alignment-page behavior |
| packs/context-transfer/codex/handoff/SKILL.md | shipping | alignment, utility | direct utility has alignment-page behavior |
| packs/devtool/claude/devtool-dx-journey/SKILL.md | analysis | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/devtool/codex/devtool-dx-journey/SKILL.md | analysis | alignment, research/, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/docs-health/claude/hygiene/SKILL.md | analysis | alignment, research/, utility | direct utility has alignment-page behavior |
| packs/docs-health/codex/hygiene/SKILL.md | analysis | alignment, research/, utility | direct utility has alignment-page behavior |
| packs/game/claude/game-workflow/SKILL.md | planning | alignment, utility | direct utility has alignment-page behavior |
| packs/game/codex/game-workflow/SKILL.md | planning | alignment, utility | direct utility has alignment-page behavior |
| packs/ord/claude/ord-ship/SKILL.md | ops | research/, utility | direct utility mentions research working/canonical outputs |
| packs/ord/codex/ord-ship/SKILL.md | ops | research/, utility | direct utility mentions research working/canonical outputs |
| packs/project-fleet/claude/clone-spec-store/SKILL.md | planning | alignment, utility | direct utility has alignment-page behavior |
| packs/project-fleet/claude/skill-inventory/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/project-fleet/codex/clone-spec-store/SKILL.md | planning | alignment, utility | direct utility has alignment-page behavior |
| packs/project-fleet/codex/skill-inventory/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/release-ops/claude/branch-lifecycle/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/release-ops/claude/release/SKILL.md | shipping | alignment, utility | direct utility has alignment-page behavior |
| packs/release-ops/codex/branch-lifecycle/SKILL.md | ops | alignment, utility | direct utility has alignment-page behavior |
| packs/release-ops/codex/release/SKILL.md | shipping | alignment, utility | direct utility has alignment-page behavior |
| packs/repo-maintenance/claude/bootstrap-repo/SKILL.md | execution | research/, utility | direct utility mentions research working/canonical outputs |
| packs/repo-maintenance/codex/bootstrap-repo/SKILL.md | execution | research/, utility | direct utility mentions research working/canonical outputs |
| packs/skill-dev/claude/targeted-skill-builder/SKILL.md | execution | alignment, utility | direct utility has alignment-page behavior |
| packs/skill-dev/codex/targeted-skill-builder/SKILL.md | execution | alignment, utility | direct utility has alignment-page behavior |
| packs/teardown/claude/desk-flip/SKILL.md | execution | alignment, utility | direct utility has alignment-page behavior |
| packs/teardown/codex/desk-flip/SKILL.md | execution | alignment, utility | direct utility has alignment-page behavior |
| packs/vard/claude/vard-ship/SKILL.md | ops | research/, utility | direct utility mentions research working/canonical outputs |
| packs/vard/codex/vard-ship/SKILL.md | ops | research/, utility | direct utility mentions research working/canonical outputs |
| packs/youtube-ops/claude/youtube/SKILL.md | router | alignment, research/, _working, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |
| packs/youtube-ops/codex/youtube/SKILL.md | router | alignment, research/, _working, utility | direct utility has alignment-page behavior; direct utility mentions research working/canonical outputs |

### misclassified

| Path | Type | Signals | Issues |
| --- | --- | --- | --- |
| packs/business-ops/claude/repo-glossary/SKILL.md | analysis | alignment, research/, _working, staged | staged research workflow exists but frontmatter type is not research |
| packs/business-ops/codex/repo-glossary/SKILL.md | analysis | alignment, research/, _working, staged | staged research workflow exists but frontmatter type is not research |
| packs/customer-lifecycle/claude/journey-map/SKILL.md | analysis | alignment, research/, _working, staged | staged research workflow exists but frontmatter type is not research |
| packs/customer-lifecycle/codex/journey-map/SKILL.md | analysis | alignment, research/, _working, staged | staged research workflow exists but frontmatter type is not research |
