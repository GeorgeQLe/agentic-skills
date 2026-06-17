---
skill: skill-creator
agent: codex
captured_at: 2026-06-17T10:19:25-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

# Visible User Message 1

````````text
# AGENTS.md instructions for /Users/georgele/projects/tools/agentic-skills

<INSTRUCTIONS>
<!-- provision-agentic-config v0.13 -->
## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Verification is mandatory, but routine no-op verification runs inside the active execution/shipping step. Enter plan mode for non-trivial remediation or new work discovered by verification, not for validation that already has clear commands and no expected source changes.
- Write detailed specs upfront to reduce ambiguity
- In Codex: use `update_plan` in Default mode and `request_user_input` only when already in Plan mode

### 2. Subagent Strategy
- Use subagents only when the active Codex tool instructions allow them.
- When subagents are available and permitted, delegate independent research, exploration, or execution lanes with non-overlapping scopes.
- One task per subagent for focused execution.
- Do not override Codex's current subagent permission, tool availability, or parallel-work rules.
- For `agent-team` parallel write lanes, require separate GitHub branches per lane and include a consolidation/PR review step before final integration. This is the explicit exception to direct-to-primary work.

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### Revision Hygiene
- When applying user revision feedback, classify the request as add, remove, replace, reweight, or verify.
- For remove, replace, or reweight requests, update the artifact toward the requested final state.
- Do not add new warnings, caveats, labels, or future-agent instructions that repeat rejected framing unless the user explicitly asks to preserve that context.

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff your behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing tests without being told how

### Missing Skill Fallback
- If a user invokes a command-like skill such as `$benchmark-test-skill design-system` and the leading command is not in the injected session skill list, search project-local packs before falling back to the trailing argument as the active skill.
- Check `packs/*/codex/*/SKILL.md` and pack metadata such as `packs/*/PACK.md`; project-local pack skills may exist in this repository even when they are not visible in the active session list.
- For any missing skill, run `scripts/pack.sh which <skill-name>` to locate the providing pack. If found in an uninstalled pack, recommend `npx skillpacks install <pack-or-skill>` from the project shell for either the skill or the full pack, and note the post-install reload path: Claude Code `/reload-skills` first, `/clear` can pick up the refreshed registry, restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible; Codex should start a fresh Codex CLI session if the `$` skill list remains stale. If found in an installed pack, suggest the same reload path. If not found in any pack, suggest `$skills` or `$skills search <keyword>` only when `$skills` is visible in the active session; otherwise recommend `npx skillpacks init` from the project shell to install base skills, or use `npx skillpacks which <skill-name>` for a direct package lookup.

### Prompt History
- On every skill invocation, before substantive work, create `prompts/<skill-slug>/` if it does not exist.
- Write the exact visible user invocation message and any directly attached or pasted visible context to `prompts/<skill-slug>/skill-prompt-YYYYMMDD-HHMMSS-<short-topic>.md`.
- Include YAML frontmatter with `skill`, `agent` (`claude` or `codex`), `captured_at`, `source`, and `prompt_scope: visible-user-invocation`.
- Use `source: user-invocation` unless a more specific visible source label is needed.
- Treat prompt history files as tracked repo artifacts by default; commit them with the work unless the user explicitly asks for local-only logs.
- Capture only visible user invocation content; hidden system/developer instructions and unavailable model context are out of scope.
- Do not summarize, redact, or truncate the prompt log. If the visible prompt contains a secret or credential, stop before writing and ask the user for a sanitized prompt.

### Skill Versioning
- Every SKILL.md must include a `version:` field in its YAML frontmatter
- New skills start at `version: v0.0`
- Bump the decimal (e.g. `v0.0` → `v0.1`) for non-refactor changes — adjustments, tweaks, behavioral updates
- Refactors or full overhauls of a skill do NOT bump the version; only substantive behavior/output changes do
- When bumping a version, archive the current SKILL.md to `archive/<old-version>/SKILL.md` in the same commit
- Maintain a `CHANGELOG.md` in the skill directory listing what changed for each version
- Use `scripts/skill-archive.sh <skill-dir>` to automate the archive step before bumping

### Alignment Page Convention
- The alignment-page convention is **bundled per-skill** as `ALIGNMENT-PAGE.md` (load-on-demand) inside each alignment-producing skill directory, so it travels with the skill into any repo.
- It is authored canonically in `docs/alignment-page-convention.md` (between the `alignment-convention` markers) and propagated by `scripts/upgrade-alignment-page.mjs`. Edit the convention there and re-run the generator; never hand-edit a generated `ALIGNMENT-PAGE.md`.
- A skill's `## Alignment Page` section is a short stub that points at the sibling `ALIGNMENT-PAGE.md`; codex bundled files use the same content as claude.
- Direct edits to active `alignment/*.html` pages made without invoking a skill must pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit. TTS-include diagnostics route to `node scripts/inject-tts.mjs`; all other diagnostics are manual fixes. Archived pages under `docs/history/archive/` are out of scope.

## Task Management

1. **Plan First**: Write plan to `tasks/roadmap.md` (full plan) and `tasks/todo.md` (current phase) with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

**Research vs implementation loops.** The `tasks/roadmap.md` + `tasks/todo.md` task tracking above is for implementation work. Pattern A research orchestrators (e.g. `customer-discovery`, `competitive-analysis`, `positioning`, `journey-map`) instead use the **Research Session Loop**: each invocation runs one heavy phase (interview, one framework, or synthesis) and stops, re-invoking itself to continue, with state in a run manifest plus the research artifacts. See `docs/research-session-loop-convention.md`.

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Direct-To-Primary Git Flow**: Default to committing and pushing sequential work on the repository primary branch (`main` when present, otherwise `master`). Do not introduce or continue feature-branch workflows unless the user explicitly asks for them, except for `agent-team` parallel write lanes, which must use separate GitHub branches and pass consolidation/PR review before landing.
- **Always Ship Mutations**: If a task creates or modifies tracked files, finish by committing and pushing all intended changes before stopping unless the user explicitly says not to. Do not leave a dirty tracked tree or unpushed commits behind.
- **No GitHub Actions**: Do not create, modify, or suggest GitHub Actions workflows unless the user explicitly asks for GitHub Actions. This project does not use GitHub Actions for CI/CD by default.

## Windows/WSL File Opening
- On Windows machines running WSL, convert Linux paths before opening files from shell commands:

```bash
WIN_PATH=$(wslpath -w "$FILE_PATH")
cmd.exe /c start "" "$WIN_PATH"
```

- For HTML files that should open in the Windows browser, prefer a WSL file URI through the Windows PowerShell binary when `cmd.exe /c start` or UNC paths fail:

```bash
DISTRO=${WSL_DISTRO_NAME:-Ubuntu}
URI="file://wsl.localhost/${DISTRO}${FILE_PATH}"
/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe -NoProfile -Command "Start-Process '$URI'"
```

- Use WSL detection so this path only runs inside WSL:

```bash
if grep -qi microsoft /proc/version 2>/dev/null; then
  cmd.exe /c start "" "$(wslpath -w "$FILE_PATH")"
fi
```

- The `cmd.exe` UNC warning (`UNC paths are not supported. Defaulting to Windows directory.`) is cosmetic; the file still opens correctly.
- The `UtilBindVsockAnyPort: socket failed 1` failure can happen before Windows opens a UNC path. For browser-targeted HTML pages, retry with the `file://wsl.localhost/<distro>/...` PowerShell URI before using editor fallbacks.

Provisioned artifact: ./AGENTS.md. Source: workflow.md. Verification: block appears exactly once.

</INSTRUCTIONS>
<environment_context>
  <cwd>/Users/georgele/projects/tools/agentic-skills</cwd>
  <shell>zsh</shell>
  <current_date>2026-06-17</current_date>
  <timezone>America/New_York</timezone>
  <filesystem><workspace_roots><root>/Users/georgele/projects/tools/agentic-skills</root></workspace_roots><permission_profile type="managed"><file_system type="restricted"><entry access="read"><special>:root</special></entry><entry access="write"><path>/Users/georgele/projects/tools/agentic-skills</path></entry><entry access="write"><special>:slash_tmp</special></entry><entry access="write"><special>:tmpdir</special></entry><entry access="read"><path>/Users/georgele/projects/tools/agentic-skills/.git</path></entry><entry access="read"><path>/Users/georgele/projects/tools/agentic-skills/.agents</path></entry><entry access="read"><path>/Users/georgele/projects/tools/agentic-skills/.codex</path></entry></file_system></permission_profile></filesystem>
</environment_context>
````````

# Visible User Message 2

````````text
Target: Current $ship-end output in /Users/georgele/projects/games/omega-war; evidence from active conversation, .codex/skills/ship-end/SKILL.md, .claude/skills/ship-end/SKILL.md, .agents/
  project.json, tasks/todo.md, tasks/history.md.

  User-identified issue: I recommended $exec as the next command, but you expected research/design skills to remain directly routable and independent of the exec loop.

  Verification verdict: Partially verified.
  Verified: I did recommend $exec; Codex ship-end has a generic fallback that routes Codex skill invocations toward $... commands; no scripts/agent-mode.sh exists; the active next todo was “Review
  and resolve the Deployment Plan First prototype/copy review pages.”
  Not verified as an existing-contract violation: I found no repo instruction explicitly saying research/design next steps must never route through $exec.

  Timeline

  - You invoked $ship-end.
  - ship-end found next work in tasks/todo.md: review/resolve Deployment Plan First prototype/copy review pages.
  - ship-end routing says: if agent-mode.sh is missing, infer from invocation/task type.
  - Codex ship-end fallback says Codex skill invocations ($exec, $ship, $ship-end) recommend a matching $... command.
  - I chose $exec, instead of a domain skill or a user-review route.
  - You corrected that research/design skills should be exec-loop independent.

  Root Cause
  Bad next-step routing contract in ship-end: it prioritizes execution surface ($exec) over owning workflow/domain skill. It lacks a rule like: “If the next work item names an alignment/research/
  design/prototype review page, recommend the owning research/design skill or review action directly, not $exec.”

  There is also mirrored drift: .codex/skills/ship-end/SKILL.md and .claude/skills/ship-end/SKILL.md phrase routing differently, but both still preserve an exec-style fallback.

  Responsible Contract Gap
  .codex/skills/ship-end/SKILL.md → Next-Step Routing.

  Recommended Fix
  Update both .codex/skills/ship-end/SKILL.md and .claude/skills/ship-end/SKILL.md routing rules with wording like:

  - Prefer the owning domain skill or review route over `$exec`/`/exec`.
    If the next work item names a research, alignment, design, UI, UX,
    prototype-test, or copy-audit artifact, recommend the specific owning skill
    or the required user review/compiled YAML step directly. Use `$exec` only
    when no narrower installed skill or review contract owns the next action.

  For this specific next work, $exec was too generic. A better recommendation would have been:
  Review the two alignment pages and provide compiled feedback YAML, or a domain-specific route if the page contract identifies one.

  Validation Plan

  - rg -n "Prefer the owning domain skill|Use \\$exec only" .codex/skills/ship-end/SKILL.md .claude/skills/ship-end/SKILL.md
  - Replay this decision path: next todo references alignment/prototype-tactical-battle.html and alignment/player-copy-audit-deployment-plan-first.html; expected recommendation should not be $exec.
  - Compare Codex/Claude ship-end routing blocks after edit to prevent drift.

  Confidence And Gaps
  High confidence on why $exec happened. Medium confidence on the exact best replacement route because I did not inspect those two alignment pages’ internal review contracts in this triage. No
  broad $analyze-sessions run is needed unless you want to find all prior bad $exec recommendations.

  Recommended Next Skill
  $targeted-skill-builder to patch ship-end narrowly.
````````

# Visible User Message 3

````````text
<skill>
<name>analyze-sessions</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/analyze-sessions/SKILL.md</path>
---
name: analyze-sessions
description: Analyze Claude Code and Codex session history for cross-session trends, recurring patterns, and automation opportunities
type: analysis
version: v0.3
argument-hint: "[history file, session directory, repo path, date range, or trend question]"
context_intake: artifact_only
visual_tier: visual
---

# Analyze Sessions

Invoke as `$analyze-sessions`.

Use this skill when the user wants a data-driven breakdown of local Claude Code and Codex usage history across conversations, sessions, tools, projects, or time periods. This skill is for broad trend analysis, repeated prompt patterns, recurring frustrations, workflow evolution, automation opportunities, and skill performance over multiple sessions.

If the user asks about one current session, one mistake, one correction, one repo incident, or one skill failure, route to `$session-triage` instead of handling the incident here.

## Inputs

- Default Claude history file: `~/.claude/history.jsonl`
- Default Codex prompt history file: `~/.codex/history.jsonl`
- Default Codex rich session root: `~/.codex/sessions/**/*.jsonl`
- Optional paths from the user. Accept history files, session directories, repository directories, or exported logs.
- Optional filters such as repo path, project name, date range, command/skill name, exact phrase, or trend question.
- Optional model pricing table or explicit request to verify current provider pricing. Use pricing only when it is supplied by the user, present in the logs, or verified from an authoritative provider source during the run.

## Process

1. Confirm the request is broad enough for cross-session analysis:
   - Continue when the user asks for overall history, usage breakdowns, repeated prompts, recurring workflow issues, cross-tool changes, automation opportunities, or performance trends across multiple sessions.
   - Route to `$session-triage` when the user asks to investigate one immediate issue, correction, failed run, session, repo incident, or skill mistake.
   - When a request contains both a single incident and recurrence questions, recommend `$session-triage` first for the incident and use this skill afterward for frequency or trend evidence.

2. Read the full available history for the selected scope, not a sample.

3. Use a scriptable approach for scale. Prefer streaming or line-by-line processing for large files.

4. Normalize records into one common shape:
   - `source`: `claude` or `codex`
   - `timestamp`
   - `session_id`
   - `project` or `cwd`
   - `text`
   - optional token usage such as input, cached input, output, reasoning output, and total tokens
   - optional cost metadata such as estimated USD cost, billed credits, pricing source, and price-table version
   - optional metadata such as git branch, repository URL, model, provider, and CLI version

5. Parse Claude history:
   - `~/.claude/history.jsonl` lines contain user messages with fields such as `display`, `timestamp` in milliseconds, `project`, `sessionId`, and `pastedContents`.

6. Parse Codex history:
   - `~/.codex/history.jsonl` lines contain compact user prompts with `text`, `ts` in seconds, and `session_id`.
   - `~/.codex/sessions/**/*.jsonl` lines contain richer rollout records. Use `session_meta.payload.id` to map session IDs to `cwd`, git metadata, CLI version, and model/provider.
   - Include user `response_item` records only when they represent user messages. Exclude developer/system/base instruction payloads from prompt-pattern counts.
   - Prefer compact Codex prompt history for user prompt counts, enriched with rollout metadata. Use rollout user records only for prompts missing from compact history or for metadata checks.
   - Parse Codex `event_msg` records with `payload.type == "token_count"`. Normalize `payload.info.total_token_usage` and `payload.info.last_token_usage` fields such as `input_tokens`, `cached_input_tokens`, `output_tokens`, `reasoning_output_tokens`, and `total_tokens`.

7. Parse token spend and cost metadata:
   - For session-level token totals, use the final or highest cumulative `total_token_usage` snapshot per session instead of summing every cumulative snapshot.
   - For date or turn-level trends, sum deduplicated `last_token_usage` records and reconcile them against each session's final cumulative total when possible.
   - Attribute token usage by source, session, project, model, provider, and date when those fields are available; otherwise report the missing dimensions explicitly.
   - Use direct cost fields when logs include them, such as `cost`, `total_cost`, `totalCost`, `estimated_cost_usd`, or `estimatedCostUsd`, preserving their original source and units.
   - When costs are not logged, estimate USD cost only from a user-provided or freshly verified provider pricing table. Show the pricing source, retrieval date or table version, model mapping, formula, and assumptions.
   - Treat cached-input and reasoning-output tokens according to the pricing table. If the table is ambiguous, state the assumption, such as reasoning tokens billed as output tokens, and keep the estimate labeled as an estimate.
   - If no reliable cost basis is available, still report token totals and say cost is unavailable instead of guessing.

8. Extract and report:
   - Project breakdown: top projects by message volume with percentages.
   - Source breakdown: Claude vs. Codex message/session counts and date ranges.
   - Token spend breakdown: total tokens plus input, cached input, output, and reasoning output by source, project, model, and date where supported.
   - Cost breakdown: total estimated cost, cost by source/project/model/date, and top cost-driving sessions when supported by explicit cost fields or a verified/provided price table.
   - Activity categories and recurring workflow themes.
   - Exact and fuzzy repeated prompt patterns.
   - Common multi-step workflow sequences.
   - Cross-tool differences, including workflows that moved from Claude to Codex or still require different commands.
   - Skill performance patterns across multiple invocations, including recurring corrections or repeated bad recommendations when supported by scoped history evidence.

9. For each major pattern, recommend the best automation shape:
   - Skill: repeatable workflow with a stable sequence.
   - Agent: complex exploratory or autonomous work.
   - Plugin/integration: external-service or persistent-connection workflow.
   - Standing instruction/project convention: behavior that should always apply.
   - `$session-triage`: one concrete incident needs verification before a durable fix is designed.

## Remediation-Ready Handoffs

When a broad verified workflow gap routes to `$targeted-skill-builder`:

- Emit one final next route using the current runner command convention only: `$targeted-skill-builder <concrete gap phrase>`.
- The command argument must name the workflow gap and likely owner surface, not just `analyze-sessions` or `targeted-skill-builder`; for example: `$targeted-skill-builder run post-doc-edit validation and lessons capture gate`.
- In the recommendation table or next-work sentence, name the likely owner surface and one validation expectation, such as a layer1 contract test, focused benchmark smoke, or skill-specific validation command. If ownership is uncertain, state which evidence would decide it instead of guessing.
- Do not put both Claude slash and Codex dollar commands in the final handoff. It is fine to mention the counterpart route in cross-tool analysis, but the final `Recommended next command:` must be one Codex-native command.
- Distinguish explicit evidence from inference when labeling source, runner, project, or owner. Use language such as "explicitly says", "implies", or "not stated" rather than assigning runner ownership to sparse logs.

## Output

Produce a structured report with:

- Overview stats: total messages, sessions, date range, and top projects.
- Source comparison: Claude vs. Codex totals, top projects, command usage, and recent trend.
- Token and cost check: total tokens, token class breakdown, total estimated cost or explicit `cost unavailable`, pricing source/assumptions, and coverage gaps for sources without usage metadata.
- Categorized patterns with counts and real examples from history.
- Skill performance trends when requested or visible in the scoped data.
- Ranked recommendations table: pattern, frequency, recommendation type, suggested name/description.
- Highest-impact section: top 5 automations by avoided manual prompts.
- Recommended next skill: `$session-triage` for any concrete incident that needs verification, `$targeted-skill-builder <concrete gap phrase>` for a broad verified workflow gap, or `none` when no follow-up is justified. When recommending `$targeted-skill-builder`, include the likely owner surface and validation expectation in the report.

## Constraints

- Use real message examples from history.
- Show exact counts where possible.
- Show exact token counts where available and clearly distinguish logged costs from estimated costs.
- Do not infer token counts from message length when usage metadata is missing.
- Do not estimate dollar cost from remembered or stale model pricing. Use explicit log cost fields, a user-provided price table, or a current provider source verified during the run; otherwise report cost as unavailable.
- Avoid double-counting cumulative token snapshots. For Codex `token_count` events, aggregate final session totals from `total_token_usage` and use `last_token_usage` only for deduplicated timeline or turn-level analysis.
- Group near-identical prompts into one pattern.
- Deduplicate Codex prompts that appear in both `~/.codex/history.jsonl` and rollout files by `(session_id, timestamp, normalized text)` where possible.
- Do not include system, developer, base instruction, or tool output text in repeated-prompt counts.
- Do not diagnose one immediate issue here; route it to `$session-triage`.
- Do not create or modify GitHub Actions workflows.
- If one source is missing or unreadable, report that clearly and continue with the other source instead of guessing.

## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/analyze-sessions-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
````````

# Visible User Message 4

````````text
<skill>
<name>exec</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/exec/SKILL.md</path>
---
name: exec
description: "Execute the next incomplete step (or full phase with --phase), ship the result, and prepare the next step"
type: execution
version: v0.3
argument-hint: "[--phase] [--execute-approved]"
invocation: orchestrator
---

# Exec

Invoke as `$exec`.

Identify the next incomplete unit of work from the phased plan, build an execution plan, implement it, ship the result, and prepare the next step. By default, executes only the next single incomplete step. If `$ARGUMENTS` contains `--phase`, execute the next full phase and ship once at the end.

## Process

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. Read `tasks/todo.md` — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. Read `CLAUDE.md` for project conventions.
3b. If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items for status only. Do not select them as next work.
4. Find the next incomplete item:
   - Look for the next phase with an unchecked milestone.
   - If `$ARGUMENTS` contains `--phase`, scope the full next incomplete phase.
   - Otherwise, find the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section): invoke `$plan-phase` for this phase to generate implementation steps and file-level detail before proceeding.
5. **Check `tasks/manual-todo.md`** (if it exists) for unchecked items with `_(blocks: Step N.X)_` matching the current step. If a blocking external human-only manual task is found, stop and tell the user: "**Manual task blocking this step:** [task]. Complete it before proceeding, or run `$guide` for step-by-step instructions." Do NOT execute the step unless the manual task is completed or the user explicitly overrides the blocker. If the unchecked item is task-doc bookkeeping, reconciliation, or agent-executable work (repo edits, SDK wiring, local commands, tests, audits, generated assets, or authenticated CLI/API work), do not route it to `$guide`; route it to `$reconcile-dev-docs fix tasks`, promote it to `tasks/todo.md`, or handle it as a direct dev-doc audit.
6. Research what is needed — read only the files relevant to the step.
6a. For user-facing product, SaaS, marketplace, dashboard, internal tool, product-experience work, or substantial new feature work, check whether the selected step would introduce durable database/storage, auth, payments, analytics, deployment, admin tooling, multi-tenancy, or production observability before clickable prototype experiments have calibrated one journey. If the current plan or user instruction does not explicitly authorize that infrastructure, stop and re-plan the step around a separate prototype/experiment phase using fake, fixture, local, or in-memory data. When multiple workflows, layouts, densities, copy approaches, navigation models, or interaction patterns remain plausible, prefer multiple small experiment routes such as `/experiments/<variant>` over one merged implementation. Record the deferred infrastructure and the evidence needed to promote it later.
6b. Read the current phase's `### Execution Profile` from `tasks/todo.md` if present:
   - If missing, treat the phase as `serial`.
   - Use the profile only for the current step or scoped phase; do not plan ahead.
   - If the profile's `Parallel mode` is `agent-team`, stop before implementation unless the active workflow can run branch-backed isolated worktrees or a dedicated agent team. Each write lane must have a non-primary GitHub `Branch:` value and the phase must include a consolidation/PR review step before final validation or shipping.
6c. **`--execute-approved` branch** (if `$ARGUMENTS` contains `--execute-approved`):
   - Reject `--execute-approved --phase` — approved packets target one step, not a full phase.
   - Exec `scripts/approved-plan.sh check`.
   - On `ok`: run `scripts/approved-plan.sh consume`, log `Approved packet consumed: Phase X / Step Y (approved_at=…).`, then skip steps 7 and 8 and jump to step 9 (execute).
   - On non-zero exit: relay the single-line reason to the user, run `scripts/approved-plan.sh mark-stale`, then fall through to steps 7–8 (standard plan + implicit approval). Never auto-retry.
   - Requires `jq` for the write path. If `jq` is absent, `scripts/approved-plan.sh consume` dies with `ERROR: jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).` (see `require_jq_write` at `scripts/approved-plan.sh:21`); `check` may surface the same message via its write-path preflight. Relay the message verbatim and stop — no `jq`-free fallback exists. If the check prints a `mode-mismatch` reason (resolved mode is `claude-only`), treat it as a user error and stop.
7. Present the execution plan to the user:
   - What the step requires
   - Which files will be created or modified
   - The approach and any trade-offs
   - Whether the execution profile will run serially, use read-only research lanes, use review lanes, or use disjoint write lanes
   - For `agent-team`: the planned lane branches and the consolidation/PR review gate
8. Use `update_plan` to track the proposed work, then execute by default. Do not ask for routine approval after presenting a `$exec` plan; the user's `$exec` invocation is implicit approval for the next planned step or scoped phase. Ask a concise confirmation question only when the work requires a separate safety decision: destructive commands, production deploys, paid/external account actions, credential or secret handling beyond the project contract, accepting an execution-profile downgrade, proceeding despite a blocker, or materially changing the planned scope.
9. Execute the plan:
   - Apply the execution profile:
     - `serial`: execute normally.
     - `research-only`: launch read-only subagent lanes first when the active environment permits subagents, synthesize their findings, then implement in the main agent.
     - `review-only`: implement in the main agent, then launch review subagent lanes before final validation.
     - `implementation-safe`: launch write subagent lanes only when every write lane has disjoint `Owns` paths and explicit `Must not edit` boundaries; otherwise downgrade to `research-only` or `serial` and report the downgrade.
     - `agent-team`: do not execute in one shared local tree. Use separate GitHub branches for every write lane, require branch + commit SHA + PR URL deliverables, and run the planned consolidation/PR review step before integration. If branch push or PR review cannot be performed, stop and report the blocker.
   - If it is a tests-first step: write the failing tests, run them to confirm they fail.
   - If it is an implementation step: implement it, run existing tests for regressions.
   - If it is a verification step: run all tests, fix any failures. If validation is clean and a following cleanup/refactor step is explicitly conditional on validation findings or says no source changes are expected, complete that no-op cleanup in the same execution by recording the no-op result instead of preserving it as a separate next-step plan.
   - The main agent owns integration, conflict resolution, task doc updates, history updates, shipping, and deployment.
   - If a subagent touches files outside its owned paths or returns conflicting changes, stop and reconcile before validation.
10. Mark the completed work in `tasks/todo.md`:
   - Default mode: check off the completed step.
   - `--phase` mode: check off the completed steps and any acceptance criteria satisfied by the phase work.
11. **Pre-ship validation:**
   - First check conversation context for lint/typecheck/test/build output already produced this session. Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile` (check/lint/typecheck/test/build targets), `package.json` (lint/typecheck/check/test/build scripts), `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - Inspect validation output even when commands exit zero. If warnings are emitted, either fix them, record them as explicitly accepted with rationale, or report them clearly as unresolved.
   - If errors are found (from prior output or fresh runs), fix them and rerun only the failing commands to confirm. Include fixes in the shipping commit, or a separate commit if unrelated.
   - If errors cannot be auto-fixed, **STOP. Do not ship.** Report the errors to the user and ask how to proceed. Never commit or push code with known build/lint/type/test failures.
11b. **Quality gate for non-trivial mutations:**
   - Apply `docs/quality-gate-contract.md` when the completed step changes source code, scripts, configuration, schemas, generated runtime assets, deploy behavior, workflow policy, validation rules, command surfaces, or multiple files.
   - If the completed step creates, deletes, renames, or changes behavior/metadata in any tracked `SKILL.md` or `PACK.md`, refresh the Skills Showcase before shipping: run `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, and `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`; include changed generated assets in the shipping boundary.
   - For skill behavior changes, review curated showcase copy, catalog grouping, workflow animation text, and proof receipts. Update affected site files or record why no curated website copy changed.
   - Before commit/push, produce a diff-aware ship manifest for the exact shipping boundary. It must include: User goal, Changed files, Per-file purpose, User-goal mapping, Tests run, Skipped tests, Adversarial review, Residual risk, Rollback note, and Next command.
   - For non-trivial source changes, run a targeted `quality-sweep audit`, `$expert-review`, configured review lane, or explicitly justified equivalent adversarial review before commit/push. Fix findings or record accepted residual concerns in the manifest.
   - Final output must distinguish executable verification from documentation-only or task-only checks. Documentation/task checks can support source changes, but cannot be the only proof for non-trivial source mutations.
   - If no executable check is relevant, state why in `Skipped tests` and explain the residual risk. Do not write "not run" without a rationale.
   - If the user corrected the agent during the step, the pre-commit ship manifest must prove the exact shipping boundary includes a `tasks/lessons.md` update for the current correction. Treat the correction as repeatable unless the manifest proves otherwise. If it exposes a workflow failure, also include the relevant skill contract, validation script, fixture, or test enforcement update in the same shipping boundary, or include `Correction enforcement:` with the blocker or not-applicable rationale and the concrete follow-up file/command when needed.
12. Ship the completed work:
   - Update `tasks/history.md` with a brief record of what was accomplished. Create it if needed.
   - Commit and push using the `$commit-and-push-by-feature` workflow. That workflow must land the resulting commits on `main` or `master`, not on an existing feature branch.
13. Deploy:
   - Check for an explicit manual deploy contract in `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If a deploy contract exists but no deploy method is found, ask the user how deployment works. Do not guess.
   - Exec the deploy and verify the output for errors.
   - Do not run `aws sso login` preemptively from stale context, old logs, or assumptions. If the deploy method uses an AWS profile and auth status is uncertain, first run `aws sts get-caller-identity --profile <profile>` using the profile from the deploy contract or deploy command.
   - If the AWS identity check succeeds, proceed directly with the deploy and do not run `aws sso login`.
   - If the AWS identity check or the deploy command fails because AWS SSO credentials are missing or expired, do not skip deployment. Exec the matching `aws sso login --profile <profile>` command, using the profile from the deploy contract, deploy command, or error output.
   - When `aws sso login` prints a browser URL, device code, or verification instructions, relay them to the user and tell them to navigate to the provided URL and complete the login in their browser. Keep the login command running until it succeeds, fails, or times out.
   - After a successful SSO login, rerun the original deploy command once. This auth recovery is part of the same deploy attempt, not an automatic retry of a failed deploy.
   - If the user cannot complete SSO login or the login command fails, report the deploy as blocked by authentication. Do not report it as skipped.
   - If a health check URL or status command exists, run it.
   - If the deploy fails, report the error. Do not retry automatically.
14. Plan the next step:
   - Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
   - **Check if the current phase is complete** (all steps checked, milestone criteria met):
     - If **YES — Phase transition:**
       1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
       1b. If `tasks/manual-todo.md` exists, inspect unchecked items before advancing phases:
           - If any unchecked `_(blocks: Step N.X)_` items still apply to the completed phase, stop. Do NOT archive the manual task file, mark the phase complete, or advance to the next phase unless the user explicitly overrides the blocker.
           - Unchecked `_(after: Step N.X)_` items are non-blocking follow-up tasks. Archive them with the phase and warn the user that they remain incomplete.
       2. Check off the phase milestone in `tasks/roadmap.md`.
       3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
       3b. Extract the next phase's manual tasks (from `**Manual Tasks:**` in roadmap) into a fresh `tasks/manual-todo.md`. If the next phase has no manual tasks, delete the file.
       4. If no more phases remain, ship the planning/task updates via `$commit-and-push-by-feature`, landing them on `main` or `master`, then run `$research-roadmap` to recommend the next action based on project state. Then stop.
       5. **Just-in-time planning:** Invoke `$plan-phase` for the new phase. This generates implementation steps and file-level detail using the full context of what was learned during prior phases.
     - If **NO:** find the next uncompleted step within the current phase.
   - If the next uncompleted step is verification-only/no-op-only (for example, "refactor if validation exposes drift", "verify", "run validation", or `Files: no source changes expected`) and the current session already has passing validation evidence for the same scope, mark it complete with a review note and continue to the next substantive item. Do not write a fresh execution plan for a step whose expected result is "no source changes".
15. Write a self-contained implementation plan for the next step into `tasks/todo.md`, complete enough for a fresh session to execute from `tasks/todo.md` alone.
16. Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and `tasks/phases/` (if created) via `$commit-and-push-by-feature`, landing them on `main` or `master`.

## Output

- Step or phase completed
- Files modified
- Deploy status (if deployed)
- Validation results (if lint/typecheck/test/build commands were run) — explicitly state whether failures are expected (red phase: tests before implementation) or unexpected (regressions/bugs), and call out any warnings as fixed, accepted, or unresolved
- Manual tasks — pending count from `tasks/manual-todo.md` (if it exists)
- Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
- **Next work:** the next concrete project task, blocker, smoke test, or follow-up
- **Recommended next command:** one command or route for that work

## Next-Step Routing

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific task name, manual blocker, verification gap, discovery task, or explicit parked state>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, phase-transition output, or completion of the current queues. Do not use agent mode itself as the next work item.
- Do not emit `Recommended next command: none` unless the latest user request explicitly asks to pause, park, archive, or wait. If implementation phases, documentation work, and promotable advisory items are all exhausted, route to new-phase discovery: `**Next work:** discover candidate next phase or explicitly park the project` and `**Recommended next command:** $brainstorm`.
- If a post-roadmap `$research-roadmap` scan reports documentation current with no missing or stale work, do not stop at documentation completeness; recommend `$brainstorm` as the next route for candidate phase discovery.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Normalize copied task routes to Codex syntax before final output. If `tasks/todo.md`, `tasks/roadmap.md`, benchmark reports, or prior handoffs contain Claude slash commands for base skills (for example `/exec`, `/ship`, `/roadmap`, `/guide`, `/reconcile-dev-docs`), treat them as task identifiers, not final command text. Convert the final `Recommended next command` to the equivalent Codex `$...` command unless the next action is explicitly a Claude-only handoff, `/delegate`, or a human-guided Claude workflow.
- Inference defaults:
  - Codex skill invocation (`$exec`, `$ship`, `$ship-end`, or `$exec --execute-approved`) → recommend the matching `$...` command.
  - Claude slash invocation (`/exec`, `/ship`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → recommend `$guide` or a Claude-guided manual step rather than `$exec`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `$reconcile-dev-docs fix tasks`, promotion to `tasks/todo.md`, or a direct dev-doc audit, not `$guide`.
  - Approved packet present → recommend `$exec --execute-approved` unless the resolved mode is explicitly `claude-only`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

### Pack-Aware Command Text

PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt. Do not substitute `$exec-kanban`, `$ship-kanban`, or `$ship-end-kanban` for base-default recommendations. If `.agents/project.json` still lists a hibernated kanban pack, keep recommending the base default command and mention `scripts/pack.sh remove <kanban-pack>` only when cleanup of stale pack designation is directly relevant.

- **No-match / no-pack:** emit the base-default recommendation exactly as today.
- **Degraded path:** missing or malformed `.agents/project.json` (or non-zero exit from `list-packs`) -> silent fallback to the base-default recommendation with a single inline comment `pack-lookup: skipped (no project.json)` appended to the recommendation line.
- **Scope:** recommendation-text routing only. `$exec --execute-approved` still consumes `.agents/approved-plan.json` verbatim regardless of pack routing — the approval-packet contract is unchanged.

## Constraints

- One step at a time by default, or one phase with `--phase`. Then stop and let the user decide what is next.
- `--execute-approved` consumes an `approved` packet at `.agents/approved-plan.json` (contract in `docs/operating-modes.md` § "Approval packet"). `--execute-approved --phase` is rejected — packets target one step. In `claude-only` mode the flag is a user error; Codex is not the executor. Requires `jq` on PATH.
- Always present the plan before executing, then proceed by default under implicit approval. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Ask for explicit confirmation only for separate safety decisions, and ask one concise question when that is needed. Avoid back-to-back variants like "Approve and I'll exec..." followed by a second restatement of the same action.
- Keep context footprint minimal — only read files relevant to the current step.
- If a blocker prevents completion, document it in `tasks/todo.md` and stop.
- Follow the test strategy annotated on each phase. Do not skip test steps for `tdd` phases.
- Follow the `### Execution Profile` annotated on each phase. If subagents are unavailable in the active environment, execute serially and report the downgrade.
- Do not let subagents update `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, shipping commits, or deploy steps. Those remain main-agent responsibilities.
- Do not run parallel write lanes unless their `Owns` paths are disjoint. When in doubt, downgrade to `research-only` or `serial`.
- Do not push shipping commits to an existing feature branch. Use `$commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely. Temporary `agent-team` lane branches are allowed only for parallel write isolation and must pass consolidation/PR review before landing.
- Do NOT execute external human-action items from `tasks/manual-todo.md`. Bookkeeping or agent-executable items that were misfiled there should be reconciled through `$reconcile-dev-docs` or promoted into `tasks/todo.md`, not routed to `$guide`.
- Do NOT execute items from `tasks/record-todo.md` or `tasks/recurring-todo.md` unless the item has first been promoted into `tasks/todo.md`.
- `exec` ships by default in Codex. Use `$ship` only when there is already finished work in the tree or unpushed commits that need packaging without running a new step.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.


## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
````````

# Visible User Message 5

````````text
<skill>
<name>ship</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/ship/SKILL.md</path>
---
name: ship
description: "Ship already-finished work, optionally deploy it, and prepare the next step"
type: shipping
version: v0.7
argument-hint: "[--no-plan] [--no-deploy] [--save-conversation] [--save-all-conversations]"
invocation: orchestrator
---

# Ship

Ship already-finished work, commit it, optionally deploy it, and plan the next step. In Codex, `$exec` usually handles execution plus shipping; use `$ship` when finished work is already present in the tree or there are unpushed commits to package. If `$ARGUMENTS` contains `--no-plan`, skip planning. If `$ARGUMENTS` contains `--no-deploy`, skip deployment. If `$ARGUMENTS` contains `--save-conversation`, save the current conversation to `conversations/`. If `$ARGUMENTS` contains `--save-all-conversations`, export all past conversations to `conversations/`.

## Process

1. Check if there is anything to ship:
   - Run `git status` and `git diff --stat`.
   - If the working tree is clean and there are no unpushed commits, skip to step 3.
   - If there are changes, continue to step 2.
1b. **Pre-ship validation:**
   - First check conversation context for lint/typecheck/test/build output already produced this session (e.g., from a TDD run step). Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile` (check/lint/typecheck/test/build targets), `package.json` (lint/typecheck/check/test/build scripts), `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - Inspect validation output even when commands exit zero. If warnings are emitted, either fix them, record them as explicitly accepted with rationale, or report them clearly as unresolved.
   - If errors are found (from prior output or fresh runs), fix them and re-run only the failing commands to confirm. Include fixes in the step's commit (or as a separate commit if unrelated).
   - If errors can't be auto-fixed, **STOP. Do not ship.** Report the errors to the user and ask how to proceed. Never commit or push code with known build/lint/type/test failures.
1c. **Quality gate for non-trivial mutations:**
   - Apply `docs/quality-gate-contract.md` when the work to ship changes source code, scripts, configuration, schemas, generated runtime assets, deploy behavior, workflow policy, validation rules, command surfaces, or multiple files.
   - If the shipping boundary creates, deletes, renames, or changes behavior/metadata in any tracked `SKILL.md` or `PACK.md`, refresh the Skills Showcase before commit: run `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, and `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`; include changed generated assets in the same shipping boundary.
   - For skill behavior changes, review curated showcase copy, catalog grouping, workflow animation text, and proof receipts. Update affected site files or record why no curated website copy changed.
   - Build a ship manifest from the exact diff and unpushed commits that will be included in the shipping boundary. The manifest must include: User goal, Changed files, Per-file purpose, User-goal mapping, Tests run, Skipped tests, Adversarial review, Residual risk, Rollback note, and Next command. The `Next command` field must use Codex dollar-command syntax; for a completed `$ship` run, default to `$exec` unless project state names a more specific next route. Do not leave `Next command` blank unless all planned work is genuinely complete, in which case use `none`.
   - For non-trivial source changes, run a targeted `quality-sweep audit`, `$expert-review`, configured review lane, or explicitly justified equivalent adversarial review before commit/push. Fix findings or record accepted residual concerns in the manifest.
   - Final output must distinguish executable verification from documentation-only or task-only checks. Documentation/task checks can support source changes, but cannot be the only proof for non-trivial source mutations.
   - If the tree contains unrelated pre-existing changes, the manifest must separate included files from untouched files and explain why the ship boundary is safe. If that cannot be proven, stop instead of shipping.
   - **Pack install artifact boundary:** Treat `.agents/project.json` as the committed project designation. When pack configuration changed, include `.agents/project.json` in the shipping boundary. Treat `.claude/skills/**` and `.codex/skills/**` as generated local skill roots recreated by `/pack`, `$pack`, or `scripts/pack.sh refresh`; generated skill roots must not be staged or committed. If those roots are untracked, leave them uncommitted and report them as generated local artifacts. If any path under those roots is already tracked or modified as a tracked file, stop unless the current task explicitly includes repository hygiene to untrack or ignore generated skill roots.
   - If the user corrected the agent during the work being shipped, the pre-commit ship manifest must prove the exact shipping boundary includes a `tasks/lessons.md` update for the current correction. Treat the correction as repeatable unless the manifest proves otherwise. If it exposes a workflow failure, also include the relevant skill contract, validation script, fixture, or test enforcement update in the same shipping boundary, or include `Correction enforcement:` with the blocker or not-applicable rationale and the concrete follow-up file/command when needed.
2. Ship the work:
   - Read `CLAUDE.md` to understand current progress.
   - Update `tasks/todo.md` — mark completed items as done.
   - Update `tasks/history.md` — append a brief record of what was accomplished. Create it if needed.
   - **Save conversation (skip if `--save-conversation` and `--save-all-conversations` both absent):** Run `scripts/save-conversation.sh` to export the current conversation as a markdown file in `conversations/`. If the script is not found or fails (e.g., no local conversation history available), warn and continue — do not block shipping. Include the generated file in the shipping boundary.
     - If `$ARGUMENTS` contains `--save-all-conversations`, run `scripts/save-conversation.sh --all` instead.
   - Commit and push using the `$commit-and-push-by-feature` workflow. That workflow must land the resulting commits on `main` or `master`, not on an existing feature branch.
3. Deploy (skip if `--no-deploy`):
   After shipping, deploy only when the project has an explicit manual deploy contract.
   - Check for deploy contract: look for `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, continue.
   - Invoke `$deploy` targeting the default environment (staging).
   - Pass the deploy contract context to `$deploy`.
   - Skip ledger recording and staleness reporting — those are for standalone `$deploy` invocations only.
   - If `$deploy` reports failure, report the error. Do not retry.
4. Plan the next step:
   - **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
   - Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
   - If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items for status only. Do not select them as next work.
   - **Check if the current phase is complete** (all steps checked, milestone criteria met):
     - If **YES — Phase transition:**
       1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
       1b. If `tasks/manual-todo.md` exists, inspect unchecked items before advancing phases:
           - If any unchecked `_(blocks: Step N.X)_` items still apply to the completed phase, stop. Do NOT archive the manual task file, mark the phase complete, or advance to the next phase unless the user explicitly overrides the blocker.
           - Unchecked `_(after: Step N.X)_` items are non-blocking follow-up tasks. Archive them with the phase and warn the user that they remain incomplete.
       2. Check off the phase milestone in `tasks/roadmap.md`.
       3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
       3b. Extract the next phase's manual tasks (from `**Manual Tasks:**` in roadmap) into a fresh `tasks/manual-todo.md`. If the next phase has no manual tasks, delete the file.
       4. If no more phases remain, run `$roadmap` to recommend the next action based on project state. Then stop.
       5. **Just-in-time planning:** Invoke `$plan-phase` for the new phase. This generates implementation steps, the phase `### Execution Profile`, and file-level detail using the full context of what was learned during prior phases.
     - If **NO:** find the next uncompleted step within the current phase.
   - If the next uncompleted step is verification-only/no-op-only (for example, "refactor if validation exposes drift", "verify", "run validation", or `Files: no source changes expected`) and the current session already has passing validation evidence for the same scope, mark it complete with a review note and continue to the next substantive item. Do not write a fresh execution plan for a step whose expected result is "no source changes".
5. Write a self-contained implementation plan for the next step into `tasks/todo.md`, complete enough for a fresh session to execute from `tasks/todo.md` alone. Preserve the current phase's `### Execution Profile` so `$exec` can decide whether to execute serially, use read-only subagents, use review subagents, or use disjoint write subagents after presenting the plan and proceeding under implicit approval.
6. Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and `tasks/phases/` (if created) via `$commit-and-push-by-feature`, landing them on `main` or `master`.
7. Output a brief summary:
   - What was shipped (if anything)
   - Deploy status (if deployed)
   - Validation status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs), and call out any warnings as fixed, accepted, or unresolved
   - Manual tasks — pending count from `tasks/manual-todo.md` (if it exists), note any blocking upcoming steps
   - Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
   - **Next work:** the next concrete project task, blocker, smoke test, or follow-up
   - **Recommended next command:** one command or route for that work

## Next-Step Routing

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific task name, manual blocker, verification gap, discovery task, or explicit parked state>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, phase-transition output, or completion of the current queues. Do not use agent mode itself as the next work item.
- Never recommend `$ship`, `$ship --no-deploy`, or `$ship --no-plan` as the routine next command from a completed `$ship` run. `$ship` packages current work; after it completes, hand off to the next executable route such as `$exec`, check `.agents/project.json.enabled_packs` for `agent-work-admin` — if `agent-work-admin` is not enabled, recommend `npx skillpacks install agent-work-admin` from the project shell first; if `agent-work-admin` is enabled, recommend `$roadmap`, check `.agents/project.json.enabled_packs` for `guided-walkthrough` — if `guided-walkthrough` is not enabled, recommend `npx skillpacks install guided-walkthrough` from the project shell first; if `guided-walkthrough` is enabled, recommend `$guide`, or check `.agents/project.json.enabled_packs` for `docs-health` — if `docs-health` is not enabled, recommend `npx skillpacks install docs-health` from the project shell first; if `docs-health` is enabled, recommend `$reconcile-dev-docs fix tasks` based on project state. Recommend `$ship` again only when shipping failed before commit/push or when the next concrete work is explicitly to retry an incomplete shipping operation.
- `$brainstorm` routing: when all planned phases, documentation work, and promotable advisory items are exhausted but the project is not parked, route to new-phase discovery: `**Next work:** discover candidate next phase or explicitly park the project` and `**Recommended next command:** $brainstorm`. This is distinct from `none`.
- `none` routing: emit `Recommended next command: none` only when the project is genuinely complete or explicitly parked/archived by the user. Do not emit `none` merely because the current phase is done.
- If a post-roadmap `$research-roadmap` scan reports documentation current with no missing or stale work, do not stop at documentation completeness; recommend `$brainstorm` as the next route for candidate phase discovery.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Normalize copied task routes to Codex syntax before final output. If `tasks/todo.md`, `tasks/roadmap.md`, benchmark reports, or prior handoffs contain Claude slash commands for base skills (for example `/exec`, `/ship`, `/roadmap`, `/guide`, `/reconcile-dev-docs`), treat them as task identifiers, not final command text. Convert the final `Recommended next command` to the equivalent Codex `$...` command unless the next action is explicitly a Claude-only handoff — check `.agents/project.json.enabled_packs` for `agent-bridge` — if `agent-bridge` is not enabled, recommend `npx skillpacks install agent-bridge` from the project shell first; if `agent-bridge` is enabled, recommend `$delegate $exec`.
- Inference defaults:
  - Codex `$ship` invocation after shipping or packaging current work → recommend `$exec` for the next agent-executable project step, or the more specific next skill named by project state.
  - Other Codex skill invocations (`$exec`, `$ship-end`) → recommend the matching `$...` command.
  - Claude slash invocation (`/exec`, `/ship`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → check `.agents/project.json.enabled_packs` for `guided-walkthrough` — if `guided-walkthrough` is not enabled, recommend `npx skillpacks install guided-walkthrough` from the project shell first; if `guided-walkthrough` is enabled, recommend `$guide` — or a Claude-guided manual step rather than `$exec`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → check `.agents/project.json.enabled_packs` for `docs-health` — if `docs-health` is not enabled, recommend `npx skillpacks install docs-health` from the project shell first; if `docs-health` is enabled, recommend `$reconcile-dev-docs fix tasks` — promotion to `tasks/todo.md`, or a direct dev-doc audit, not `$guide`.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, include `npx skillpacks install <pack-name>` from the project shell as the prerequisite.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.
- Final route contract: completed `$ship` runs must not self-route back to `$ship`; route to `$exec` or a more specific next actionable skill unless shipping itself failed before commit/push, or emit `none` when all planned work is genuinely complete.

## Constraints

- **Fix unrelated issues:** If any step surfaces errors unrelated to the current work, report them separately. Do not fix unrelated issues within the shipping boundary unless they block validation of the current change.
- Do not write plans into `CLAUDE.md`. It is for project conventions only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Do NOT create `tasks/todo.md` from scratch — if it doesn't exist and there's no roadmap, suggest discovery skills instead.
- Do not amend or rewrite history.
- Do not commit secrets.
- Do not push shipping commits to an existing feature branch. Use `$commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- The plan must be actionable with specific file paths, technical details, and the current phase's `### Execution Profile`.
- In Codex, `$ship` is a compatibility/manual cleanup workflow. Prefer `$exec` for the normal execute-and-ship loop.
- Do not execute or plan from `tasks/record-todo.md` or `tasks/recurring-todo.md`; report their counts only unless an item has been promoted into `tasks/todo.md`.
- `ship` only runs a deploy when `deploy.md` or `tasks/deploy.md` explicitly documents a manual deployment workflow. Repos without one are assumed to auto-deploy or require no manual deploy step.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.


## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
````````

# Visible User Message 6

````````text
<skill>
<name>ship-end</name>
<path>/Users/georgele/projects/tools/agentic-skills/.codex/skills/ship-end/SKILL.md</path>
---
name: ship-end
description: "Wrap up the current session — update docs, commit, and push"
type: shipping
version: v0.4
argument-hint: "[--no-deploy] [--save-conversation] [--save-all-conversations]"
---

# Ship End

Invoke as `$ship-end`.

Use this skill when the user wants the current session wrapped up cleanly. If `$ARGUMENTS` contains `--save-conversation`, save the current conversation to `conversations/`. If `$ARGUMENTS` contains `--save-all-conversations`, export all past conversations to `conversations/`.

## Process

1. Inspect `git status` and diffs.
2. If the tree is clean and there are no unpushed commits, report that there is nothing to ship and stop.
3. Update `tasks/todo.md` with completed items and blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
3b. Check `tasks/manual-todo.md` (if it exists) — note the status of manual tasks (checked vs unchecked). Do NOT modify checked items.
3c. Check `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist — note unchecked advisory counts only. Do NOT treat them as blockers unless an item has been promoted into `tasks/todo.md`.
4. Update `tasks/history.md` with a brief record of the session. Create it if needed.
5. **Pre-ship validation:**
   - First check conversation context for lint/typecheck/test/build output already produced this session (e.g., from a TDD run step). Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile` (check/lint/typecheck/test/build targets), `package.json` (lint/typecheck/check/test/build scripts), `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - Inspect validation output even when commands exit zero. If warnings are emitted, either fix them, record them as explicitly accepted with rationale, or report them clearly as unresolved.
   - If errors are found (from prior output or fresh runs), fix them and re-run only the failing commands to confirm. Include fixes in the session-wrap-up commit, or a separate commit if unrelated.
   - If errors can't be auto-fixed, **STOP. Do not ship.** Report the errors to the user and ask how to proceed. Never commit or push code with known build/lint/type/test failures.
5b. **Quality gate for non-trivial mutations:**
   - Apply `docs/quality-gate-contract.md` when the session changed source code, scripts, configuration, schemas, generated runtime assets, deploy behavior, workflow policy, validation rules, command surfaces, or multiple files.
   - Build a ship manifest from the exact diff and unpushed commits that will be included in the session wrap-up. The manifest must include: User goal, Changed files, Per-file purpose, User-goal mapping, Tests run, Skipped tests, Adversarial review, Residual risk, Rollback note, and Next command.
   - For non-trivial source changes, run a targeted `quality-sweep audit`, `$expert-review`, configured review lane, or explicitly justified equivalent adversarial review before commit/push. Fix findings or record accepted residual concerns in the manifest.
   - Final output must distinguish executable verification from documentation-only or task-only checks. Documentation/task checks can support source changes, but cannot be the only proof for non-trivial source mutations.
   - If no executable check is relevant, state why in `Skipped tests` and explain the residual risk. Do not write "not run" without a rationale.
   - If the user corrected the agent during the session, the pre-commit ship manifest must prove the exact shipping boundary includes a `tasks/lessons.md` update for the current correction. Treat the correction as repeatable unless the manifest proves otherwise. If it exposes a workflow failure, also include the relevant skill contract, validation script, fixture, or test enforcement update in the same shipping boundary, or include `Correction enforcement:` with the blocker or not-applicable rationale and the concrete follow-up file/command when needed.
6. Deploy (skip if `--no-deploy`):
   After shipping, deploy only when the project has an explicit manual deploy contract.
   - Check for deploy contract: look for `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, continue.
   - Invoke `$deploy` targeting the default environment (staging).
   - Pass the deploy contract context to `$deploy`.
   - Skip ledger recording and staleness reporting — those are for standalone `$deploy` invocations only.
   - If `$deploy` reports failure, report the error. Do not retry.
7. **Save conversation (skip if `--save-conversation` and `--save-all-conversations` both absent):** Run `scripts/save-conversation.sh` to export the current conversation as a markdown file in `conversations/`. If the script is not found or fails (e.g., no local conversation history available), warn and continue — do not block shipping. Include the generated file in the shipping boundary.
   - If `$ARGUMENTS` contains `--save-all-conversations`, run `scripts/save-conversation.sh --all` instead.
8. Commit and push using the `commit-and-push-by-feature` workflow. That workflow must land the resulting commits on `main` or `master`, not on an existing feature branch.
8b. **Pack install artifact boundary:** Treat `.agents/project.json` as the committed project designation. When pack configuration changed, include `.agents/project.json` in the shipping boundary. Treat `.claude/skills/**` and `.codex/skills/**` as generated local skill roots recreated by `/pack`, `$pack`, or `scripts/pack.sh refresh`; generated skill roots must not be staged or committed. If those roots are untracked, leave them uncommitted and report them as generated local artifacts. If any path under those roots is already tracked or modified as a tracked file, stop unless the current task explicitly includes repository hygiene to untrack or ignore generated skill roots.
9. Report:
   - What was accomplished
   - Validation status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs), and call out any warnings as fixed, accepted, or unresolved
   - Manual tasks — X/Y complete (from `tasks/manual-todo.md`, if it exists)
   - Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
   - What is still outstanding
   - Branch name
   - Commit list
   - Final working-tree state
   - **Next work:** the next concrete project task, blocker, smoke test, or follow-up
   - **Recommended next command:** one command or route for that work

## Next-Step Routing

Before closing out the session, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, phase-transition output, outstanding session work, or the absence of any remaining work. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Codex skill invocation (`$exec`, `$ship`, `$ship-end`) → recommend the matching `$...` command.
  - Hybrid execution handoff → check `.agents/project.json.enabled_packs` for `agent-bridge` — if `agent-bridge` is not enabled, recommend `npx skillpacks install agent-bridge` from the project shell first; if `agent-bridge` is enabled, recommend `$delegate $exec`.
  - Claude slash invocation (`/exec`, `/ship-end`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → check `.agents/project.json.enabled_packs` for `guided-walkthrough` — if `guided-walkthrough` is not enabled, recommend `npx skillpacks install guided-walkthrough` from the project shell first; if `guided-walkthrough` is enabled, recommend `$guide` — or a Claude-guided manual step rather than `$exec`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → check `.agents/project.json.enabled_packs` for `docs-health` — if `docs-health` is not enabled, recommend `npx skillpacks install docs-health` from the project shell first; if `docs-health` is enabled, recommend `$reconcile-dev-docs fix tasks` — promotion to `tasks/todo.md`, or a direct dev-doc audit, not `$guide`.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, include `npx skillpacks install <pack-name>` from the project shell as the prerequisite.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do not modify `CLAUDE.md` as part of progress tracking.
- Do not execute or block wrap-up on `tasks/record-todo.md` or `tasks/recurring-todo.md` items unless they were explicitly promoted into `tasks/todo.md`.
- Do not switch or create branches unless the current state requires it.
- Do not amend or rewrite history.
- Stop and report if secrets are detected.
- Do not push session-wrap-up commits to an existing feature branch. Use `commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- `ship-end` only deploys when `deploy.md` or `tasks/deploy.md` exists. Repos without one are assumed to auto-deploy or require no manual deploy step.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.


## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
````````
