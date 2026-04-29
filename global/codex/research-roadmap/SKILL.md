---
name: research-roadmap
description: Scan research and documentation health, then maintain a priority documentation queue
type: planning
version: 2.0.0
---

# Research Roadmap - Documentation Queue Manager

Invoke as `$research-roadmap`.

Use this skill to make the project documentation contract complete before build work continues. It scans research, specs, and task docs, then updates `tasks/todo.md` with immediately actionable documentation work and uses `tasks/record-todo.md` or `tasks/recurring-todo.md` for non-blocking future documentation records.

Do not run the queued research skills from this skill. The job here is to maintain the documentation queue so the user can complete research and planning artifacts in the right order.

## Process

### 1. Resolve Project Pack

1. Read `.agents/project.json` if it exists.
2. Use `project_type` and `enabled_packs` to decide which project-pack research skills apply.
3. If `.agents/project.json` is missing, infer the project type from repository signals:
   - game: game engine files, Steam/store assets, playable prototypes, or game-specific README/spec language
   - devtool: SDK, CLI, API, library, infra, docs, examples, or package-first developer workflow
   - business-app: SaaS, marketplace, productivity, workflow, enterprise, or user-facing app
4. If the project type cannot be inferred, default to `business-app`.
5. If an expected pack is not installed, add a priority todo for `$pack install <pack>` before pack-specific research todos.

### 2. Resolve Documentation Roots

Treat top-level `research/`, `specs/`, and `tasks/` as canonical.

1. If a canonical root exists, use it directly.
2. If a canonical root is missing, search shallowly near the repo root for likely aliases such as `docs/`, `planning/`, `notes/`, or `work/`.
3. Prefer roots that contain multiple expected documentation files over isolated matches.
4. If no credible task root exists, create/update top-level `tasks/todo.md`; create `tasks/record-todo.md` or `tasks/recurring-todo.md` only when advisory items exist.
5. If a fallback root is used for research or specs, mention it in the generated todo item reasons.

For writing the priority queue, prefer `tasks/todo.md`. Use a fallback task root only when the project already has a clear existing task contract and no top-level `tasks/` directory. Do not put condition-gated records or recurring obligations into `tasks/todo.md` unless they are immediately actionable execution work.

### 3. Discover Research-Producing Skills

Build the research queue from enabled project packs. Include every enabled research-producing skill whose output is missing or stale, even if its prerequisites are not yet present. When prerequisites are missing, keep the item in the queue but note that it is blocked by earlier documentation items.

Prefer dynamic discovery when skill files are available:

1. Inspect enabled pack skill files under `.codex/skills/*/SKILL.md` or `packs/<pack>/codex/*/SKILL.md`.
2. Include skills with `type: research`.
3. Also include skills whose `## Output` section writes `research/*.md`, `research/{app}/*.md`, `research/experiments/*.md`, or dated research files.

If dynamic discovery is unavailable, use these fallback maps.

Business-app research outputs:

| Skill | Output |
| --- | --- |
| `$icp` | `research/icp.md` |
| `$competitive-analysis` | `research/competitive-analysis.md` |
| `$positioning` | `research/positioning.md` |
| `$journey-map` | `research/journey-map.md` |
| `$metrics` | `research/metrics.md` |
| `$gtm` | `research/gtm.md` |
| `$monetization` | `research/monetization.md` |
| `$landing-copy` | `research/landing-copy.md` |
| `$customer-feedback` | `research/customer-feedback.md` |
| `$assumption-tracker` | `research/assumption-tracker.md` |
| `$experiment` | `research/experiments/<experiment>.md` |
| `$enterprise-icp` | `research/enterprise-icp.md` |
| `$risk-register` | `research/risk-register.md` |
| `$burn-rate` | `research/burn-rate.md` |
| `$runway-model` | `research/runway-model.md` |
| `$cohort-review` | `research/cohort-review-YYYY-MM-DD.md` |
| `$retro` | `research/retro-YYYY-MM-DD.md` |
| `$investor-update` | `research/investor-update-YYYY-MM.md` |
| `$platform-strategy` | `research/platform-strategy.md` |
| `$mvp-gap` | `research/mvp-gap.md` |

Game research outputs:

| Skill | Output |
| --- | --- |
| `$game-audience` | `research/game-audience.md` |
| `$game-fantasy` | `research/game-fantasy.md` |
| `$game-genre-map` | `research/game-genre-map.md` |
| `$game-comparables` | `research/game-comparables.md` |
| `$game-core-loop` | `research/game-core-loop.md` |
| `$game-prototype-test` | `research/game-prototype-test.md` |
| `$game-playtest-metrics` | `research/game-playtest-metrics.md` |
| `$game-store-page-test` | `research/game-store-page-test.md` |
| `$game-launch` | `research/game-launch.md` |

Devtool research outputs:

| Skill | Output |
| --- | --- |
| `$devtool-user-map` | `research/devtool-user-map.md` |
| `$devtool-integration-map` | `research/devtool-integration-map.md` |
| `$devtool-dx-journey` | `research/devtool-dx-journey.md` |
| `$devtool-adoption` | `research/devtool-adoption.md` |
| `$devtool-positioning` | `research/devtool-positioning.md` |
| `$devtool-monetization` | `research/devtool-monetization.md` |

Also include documentation-producing non-research skills when their outputs are missing or stale:

| Skill | Output |
| --- | --- |
| `$concept-exploration` | `research/concept-brief.md` or `research/{app}/concept-brief.md` |
| `$spec-interview` | `specs/*.md` |
| `$ux-variation` | `specs/ux-variations-*.md` |
| `$ui-interview` | `specs/ui-*.md` |
| `$scale-audit` | `specs/scale-audit.md` |
| `$roadmap` | `tasks/roadmap.md`, `tasks/todo.md` |
| `$game-roadmap` | `tasks/roadmap.md`, `tasks/todo.md` |
| `$reconcile-research fix all` | `research/reconciliation-report.md` |
| `$reconcile-dev-docs fix all` | reconciled `tasks/`, `specs/`, and phase archives |

### 4. Scan Documentation State

Record existence and last-modified timestamps for:

- all discovered research outputs
- `research/concept-brief.md` and app-scoped `research/{app}/concept-brief.md` when present
- `research/*-search-log.md` and `research/*-interview.md` only as supporting context, not primary completion artifacts
- `specs/*.md` and app-scoped `specs/{app}/*.md`
- `specs/ux-variations-*.md` and app-scoped `specs/{app}/ux-variations-*.md`
- `specs/ui-*.md` and app-scoped `specs/{app}/ui-*.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ideas.md`
- `tasks/manual-todo.md`
- `tasks/record-todo.md`
- `tasks/recurring-todo.md`

When `research/` contains app subdirectories, treat it as monorepo mode. Build a separate documentation queue per app and include app arguments in commands, such as `$icp web`.

### 5. Classify Missing And Stale Items

An item is missing when its expected output file does not exist.

An item is stale when a newer upstream document should invalidate or refresh it. Include the exact timestamps in the todo reason. Use these default rules:

| Newer input | Stale target |
| --- | --- |
| `research/concept-brief.md` or `research/{app}/concept-brief.md` | matching `research/icp.md` or `research/{app}/icp.md` |
| `research/customer-feedback.md` | `research/icp.md`, `research/journey-map.md`, `research/monetization.md`, `research/landing-copy.md` |
| `research/icp.md` | `research/competitive-analysis.md`, `research/positioning.md`, `research/gtm.md`, `research/monetization.md`, `research/landing-copy.md` |
| `research/competitive-analysis.md` | `research/positioning.md`, `research/gtm.md`, `research/monetization.md`, `research/landing-copy.md` |
| `research/positioning.md` | `research/gtm.md`, `research/landing-copy.md` |
| `research/journey-map.md` | `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/landing-copy.md` |
| `research/metrics.md` | `research/cohort-review-*.md`, `research/runway-model.md`, `research/investor-update-*.md` |
| `research/gtm.md` | `research/monetization.md`, `research/runway-model.md`, `research/investor-update-*.md` |
| `research/monetization.md` | `research/burn-rate.md`, `research/runway-model.md`, `research/investor-update-*.md` |
| `research/experiments/*.md` with results | `research/assumption-tracker.md` |
| `research/cohort-review-*.md` latest | `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/investor-update-*.md` |
| `research/enterprise-icp.md` | `specs/scale-audit.md` |
| `research/journey-map.md` | `specs/*.md`, `specs/ux-variations-*.md`, `specs/ui-*.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/landing-copy.md` |
| any non-UX/UI `specs/*.md` | `specs/ux-variations-*.md`, `specs/ui-*.md`, `tasks/roadmap.md` |
| `specs/ux-variations-*.md` | `specs/ui-*.md`, `tasks/roadmap.md` |
| `specs/ui-*.md` | `tasks/roadmap.md` |
| `research/runway-model.md` | `tasks/roadmap.md` |

Also flag potentially stale specs when source code has commits newer than the spec files. Add `$spec-drift fix all` as a priority documentation item when specs are probably behind implementation.

Do not queue a missing `$concept-exploration` item for established projects that already have `research/icp.md`, `research/competitive-analysis.md`, `research/journey-map.md`, or `specs/`. Queue it only for idea-only projects where no concept brief or downstream research/spec artifact exists.

### 6. Order The Priority Queue

Order immediately actionable todo items so the user can complete documentation without guessing:

1. Pack installation needed for the selected project type.
2. Stale foundational research.
3. Missing foundational research.
4. Stale downstream research.
5. Missing downstream research.
6. Missing or stale specs.
7. Missing or stale UX/UI planning artifacts for user-facing work.
8. Missing or stale roadmap/task docs.
9. Reconciliation items when conflicting docs are detected.

Within research items, use this dependency order when relevant:

```
$concept-exploration
  -> $icp
  -> $competitive-analysis
  -> $positioning
  -> $journey-map
    -> $spec-interview
      -> $ux-variation
        -> $ui-interview
          -> $roadmap
    -> $metrics
  -> $gtm
  -> $monetization
  -> $landing-copy
3+ research docs -> $assumption-tracker -> $experiment -> $customer-feedback
$enterprise-icp -> $scale-audit
$metrics + launch data -> $cohort-review
$monetization -> $burn-rate -> $runway-model
quarterly/outcome data -> $retro
stakeholder reporting -> $investor-update
multi-product expansion -> $platform-strategy
```

For game and devtool projects, follow the default pack flow from `docs/skills-reference.md` when available. Add review or planning skills such as `$devtool-docs-audit` and `$game-roadmap` only when their documented output is missing from the documentation contract.

### 6b. Classify Advisory Documentation Work

Before writing any queue, choose the correct task surface:

- `tasks/todo.md`: missing/stale documentation work that can be performed now with available repo context and normal skill inputs.
- `tasks/record-todo.md`: one-time documentation records or measurements that are blocked on future conditions, production aggregate access, external reports, user-provided data, or launch data, and are not launch gates.
- `tasks/recurring-todo.md`: cohort reviews, retros, investor updates, playtest/adoption checks, docs-health checks, or other documentation jobs that recur on a cadence.

Record items must include task, source, condition, non-blocking reason, required data/access, measurement/query, target/acceptance note, revisit cadence/date, completion evidence, and promotion rule. Recurring items must include task, cadence, owner/agent, scope, trigger, last run, next due, command/skill, evidence/output path, and escalation conditions.

### 7. Update `tasks/todo.md`

Write a single top-level section named exactly:

```md
## Priority Documentation Todo
```

Rules:

1. If `tasks/todo.md` does not exist, create it.
2. If a previous `## Priority Documentation Todo` section exists, replace only that section.
3. Put the section before existing implementation work. If the file starts with a title or status block, keep that orientation text at the top and insert the priority section immediately after it.
4. Preserve all other todo content exactly unless it is inside the old priority section.
5. Do not mark existing implementation tasks complete.
6. Do not remove unrelated todo sections.
7. Use unchecked boxes only for missing/stale documentation work that is immediately actionable.
8. Use checked boxes only when an item is already current.

Todo item format:

```md
- [ ] `$skill [optional-app-or-argument]` - create/update `path/to/output.md` because [missing/stale reason with evidence].
```

If prerequisites are missing:

```md
- [ ] `$metrics` - create/update `research/metrics.md` after `$journey-map`; currently blocked because `research/journey-map.md` is missing.
```

Do not write unavailable-data or cadence-gated items here. Write those to `tasks/record-todo.md` or `tasks/recurring-todo.md` instead.

### 7b. Update `tasks/record-todo.md`

When non-blocking condition-gated documentation records exist, append or replace a `## Documentation Records` section in `tasks/record-todo.md`. Preserve all other sections exactly.

Use this item format:

```md
- [ ] [record task]
  - Source: [skill/spec/phase/criterion]
  - Condition: [future condition or required access]
  - Non-blocking reason: [why this does not block launch or current execution]
  - Required data/access: [data, aggregate, portal, credential, or user-provided output]
  - Measurement/query: [how to produce the record]
  - Target/acceptance note: [threshold or expected note]
  - Revisit: [date or cadence]
  - Completion evidence: [research path, history entry, or report path]
  - Promotion rule: [when to move into `tasks/todo.md`]
```

### 7c. Update `tasks/recurring-todo.md`

When recurring documentation work exists, append or replace a `## Documentation Recurring Work` section in `tasks/recurring-todo.md`. Preserve all other sections exactly.

Use this item format:

```md
- [ ] [recurring task]
  - Cadence: [daily/weekly/monthly/quarterly/on release/etc.]
  - Owner/agent: [$skill or responsible role]
  - Scope: [project/app/area]
  - Trigger: [time, release, data threshold, user request]
  - Last run: [date or never]
  - Next due: [date or rule]
  - Command/skill: [$skill args]
  - Evidence/output path: [research/report path]
  - Escalation conditions: [when this becomes executable or blocking]
```

If all documentation is current:

```md
- [x] Documentation is current; no missing or stale research, spec, roadmap, or task artifacts found.
```

### 8. Output To User

After editing, summarize:

```
## Research Roadmap Updated

- Wrote/updated `tasks/todo.md` and any needed advisory task files
- Priority documentation items: N
- Stale items: N
- Missing items: N
- Blocked-by-prerequisite items: N
- Record items: N
- Recurring items: N

Next: start at the first unchecked item in `tasks/todo.md`; review advisory task files separately.
```

If fallback discovery was used, include a short note naming the inferred roots.

## Constraints

- This skill updates `tasks/todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md`; it must not run the queued skills.
- Preserve user-authored todo content outside `## Priority Documentation Todo`.
- Preserve user-authored record/recurring content outside `## Documentation Records` and `## Documentation Recurring Work`.
- Every stale item must include timestamp evidence.
- Every enabled research-producing skill must be represented unless its output is present and fresh.
- Prefer canonical `research/`, `specs/`, and `tasks/` paths over aliases.
- In monorepo mode, include app-scoped commands and output paths.
- Do not put condition-gated measurements, future validation records, or cadence-based research jobs into `tasks/todo.md` unless they are immediately executable.
- Do not create or modify source code.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
