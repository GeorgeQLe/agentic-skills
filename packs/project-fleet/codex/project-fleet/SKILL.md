---
name: project-fleet
description: Orchestrate a central control repository that plans, provisions, tracks, and advances many related downstream repositories or work items with guarded batches, blocker handling, and productive fallback work.
type: orchestration
version: v0.1
argument-hint: "[--status] [--plan] [--execute]"
---

# Project Fleet

Invoke as `$project-fleet`.

Use this skill when a project is no longer a single repo or task list, but a fleet: one control repository coordinates many downstream repositories, implementation targets, specs, clients, migrations, content items, experiments, or generated artifacts.

Examples: seeding many private repos from a spec store, migrating many packages, generating plans for many apps, rolling out the same change across customer repos, or advancing a queue while rate limits or external windows control provisioning.

## Core Model

A fleet has:

- **Control repo:** canonical state, conventions, queue, scripts, logs, and status.
- **Fleet items:** downstream repos or work units, each with an ID, target, source, state, and blocker field.
- **Provisioning lane:** creates or updates external targets under strict guards.
- **Work lane:** advances already-provisioned targets while provisioning is blocked or waiting.
- **Blocker ledger:** records stop conditions and retry rules.
- **Status dashboard:** summarizes next action without re-reading the whole project.

## State Machine

Use project-specific names when needed, but preserve these semantics:

```text
candidate
ready-to-provision
provisioning-blocked
provisioned
planning-needed
plan-ready
work-in-progress
verification-needed
done
blocked
```

Never collapse "provisioned" into "done." A created repo, generated scaffold, or reserved artifact is only an available target until planning, work, and verification finish.

For broad solution-space exploration, spec-clone stores, generated app fleets, or other candidate-heavy projects, prefer this portfolio funnel:

```text
candidate -> shortlisted -> spec-ready -> seeded -> active-build -> shipped | archived | blocked
```

Preserve these meanings:

- **candidate:** cheap broad idea or rough spec; not approved for repo creation or implementation.
- **shortlisted:** scored and intentionally kept for deeper work.
- **spec-ready:** implementation-ready source/spec exists with required evidence, constraints, and blockers.
- **seeded:** downstream repo, scaffold, or external target exists; still not implementation-complete.
- **active-build:** selected for runnable milestone work under the active fleet cap.
- **shipped:** verified output reached the project's done definition.
- **archived:** intentionally removed from active consideration.
- **blocked:** cannot advance until the recorded blocker clears.

Use `scaffold-only` as an explicit item tag, not a state, when a project intentionally creates downstream scaffolds before `spec-ready`. A `scaffold-only` item may be seeded for inventory purposes, but it cannot enter `active-build` until it becomes `spec-ready`.

## Portfolio Policy

When a fleet contains many candidate apps, specs, repos, experiments, content items, or implementation targets, optimize for return on effort instead of breadth alone:

- Track portfolio fields per item: ID, name, target, source/reference, state, score, score rationale, readiness state, downstream repo or artifact, active-build eligibility, last verified state, blocker, and next milestone.
- Score candidates before deep specification or provisioning. Use project-specific criteria when present; otherwise score implementation leverage, demo value, legal/provider risk, reusable components, data/API availability, user or market signal, and build cost.
- Default active-build cap is 5 when the project has no explicit cap. Do not add more `active-build` items until an active item ships, blocks, or is archived.
- Default downstream provisioning gate is `spec-ready`. Only seed earlier when the item is explicitly marked `scaffold-only` and project rules allow scaffold inventory.
- Prefer runnable milestone progress over more broad expansion once any `active-build` item exists.
- Do not let candidate count, scaffold count, or repo count stand in for shipped or runnable progress.

## Workflow

1. **Read conventions first.** Load `AGENTS.md`, `CLAUDE.md`, or equivalent control-repo instructions. Treat project-specific safety rules as higher priority than this generic skill.
2. **Find fleet state.** Look for `tasks/`, `docs/`, `scripts/`, manifest tables, status files, queue files, or project-local conventions. If no state exists, propose a minimal one before executing.
3. **Normalize the queue.** Ensure each item has: ID, name, target, source/reference, state, last action, blocker, and next action. For candidate-heavy fleets, also normalize score, score rationale, readiness state, downstream repo/artifact, active-build eligibility, last verified state, and next milestone.
4. **Run preflight guards.** Check auth, rate limits, dirty worktrees, target visibility/safety, required scripts, and project-specific stop conditions before external writes.
5. **Choose exactly one lane:**
   - **Provisioning lane** when guards pass and the next target is eligible.
   - **Work lane** when provisioning is blocked by time, rate limits, or an external dependency but existing targets can advance.
   - **Repair lane** when a blocker is actionable and safe to fix.
   - **Planning lane** when the queue lacks enough detail for execution.
   - **Portfolio lane** when candidate scoring, culling, active-cap enforcement, or `scaffold-only`/`spec-ready` classification is needed before safe provisioning or implementation.
6. **Execute in bounded batches.** Follow project batch size, serial/parallel limits, and external-service rules. If no policy exists, default to one item.
7. **Verify before state changes.** Do not mark an item advanced until evidence exists: target exists, expected files or outputs exist, tests/checks pass, visibility is correct, or the planned artifact is committed.
8. **Update central state.** Record completed work, blocker evidence, next eligible time, next target, and any skipped items.
9. **Ship changes.** If tracked files changed, follow the repository shipping convention: validate, commit, and push unless the project explicitly says not to.
10. **Report the next action.** End with the next concrete fleet item and the recommended command or lane.

## Control-Repo Files

Prefer existing files. If the project lacks a structure, create or recommend:

```text
tasks/fleet-status.md       # generated or hand-maintained dashboard
tasks/fleet-queue.md        # manifest of items and states
tasks/fleet-blockers.md     # blocker ledger if not embedded in queue
tasks/history.md            # shipped work log
scripts/fleet-status.*      # optional deterministic status generator
scripts/fleet-next.*        # optional next-item selector
scripts/fleet-provision.*   # optional guarded provisioning script
```

For domain-specific projects, use clearer names like `tasks/repo-seeding.md`, `tasks/migration-queue.md`, or `tasks/customer-rollout.md`. Generic file names are a fallback, not a requirement.

## Guarded Provisioning

Provisioning means any operation that creates, publishes, mutates, or schedules many external targets. Examples: `gh repo create`, remote pushes, deployments, package publishing, account/API provisioning, bulk imports, or paid-service operations.

Before provisioning:

- Confirm explicit user/project approval exists for the operation class.
- Confirm target visibility and privacy defaults.
- Confirm the target satisfies the project's readiness gate. For candidate-heavy fleets, the default gate is `spec-ready`; earlier provisioning requires an explicit `scaffold-only` tag.
- Check service limits and local rolling caps.
- Use project scripts when they exist.
- Keep operations serial unless the project explicitly permits parallelism.
- Stop on auth failures, rate limits, permission errors, target conflicts, visibility mismatches, partial propagation, template validation failures, or unexpected paid/irreversible actions.

On a rate limit, obey `retry-after` or reset headers when available. Otherwise record a conservative next eligible time and switch to work lane if safe.

## Productive Fallback Work

When provisioning is waiting or blocked, advance existing fleet items without violating the provisioning guard:

- Generate or refine per-item roadmaps.
- Expand implementation plans from source specs.
- Score and cull candidates, promote promising candidates to `shortlisted`, or archive low-return candidates.
- Run local validation or hygiene checks.
- Fix documented blockers that do not require the blocked external operation.
- Prepare templates, scripts, or status reports.
- Verify already-created targets.

Do not use fallback work to bypass a guard. If the blocked operation is required for an item, pick a different eligible item.

## Blocker Ledger

Each blocker entry should include:

```text
timestamp
item ID / target
lane
blocker type
evidence
attempted fix
retry rule or owner
next eligible action
```

Common blocker types:

```text
auth-permission
rate-limit
target-conflict
propagation-delay
visibility-safety
template-validation
dirty-worktree
missing-source
verification-failure
legal-or-policy-risk
manual-human-action
```

## Output

Report:

- Current fleet count by state.
- Portfolio summary when relevant: active-build count/cap, top scored candidates, `scaffold-only` count, `spec-ready` count, and archived/blocked count.
- Lane selected and why.
- Items advanced.
- Guards checked.
- Blockers created or cleared.
- Validation evidence.
- Files changed and shipped status.
- **Next work:** the next concrete item or blocker.
- **Recommended next command:** `$project-fleet --execute`, `$project-fleet --status`, another project-specific skill, or the exact project script.

## Constraints

- Do not invent permission to create, publish, deploy, spend money, or make public resources.
- Do not continue provisioning after a stop-condition failure.
- Do not parallelize externally fragile operations unless the project explicitly allows it.
- Do not mark planning/scaffold targets as implementation-complete.
- Do not move `candidate`, `shortlisted`, or `scaffold-only` items into `active-build` without `spec-ready` evidence.
- Do not exceed the active-build cap unless the project explicitly changes the cap.
- Do not let downstream repos become the source of truth for fleet-wide state unless the project explicitly chooses a distributed model.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/project-fleet-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/project-fleet-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, production deploy confirmation, paid actions, or public visibility changes.
