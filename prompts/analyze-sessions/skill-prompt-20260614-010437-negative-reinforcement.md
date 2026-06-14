---
skill: analyze-sessions
agent: codex
captured_at: 2026-06-14T01:04:37-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

# AGENTS.md instructions for /home/georgeqle/projects/tools/dev/agentic-skills

<INSTRUCTIONS>
<!-- provision-agentic-config v0.12 -->
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
- For any missing skill, run `scripts/pack.sh which <skill-name>` to locate the providing pack. If found in an uninstalled pack, recommend `npx skillpacks install <pack-or-skill>` from the project shell for either the skill or the full pack, and note the post-install reload path: Claude Code `/reload-skills` first, `/clear` can pick up the refreshed registry, restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible; Codex should start a fresh Codex CLI session if the `$` skill list remains stale. If found in an installed pack, suggest the same reload path. If not found in any pack, suggest `$skills` or `$skills search <keyword>`.

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

</INSTRUCTIONS><environment_context>
  <cwd>/home/georgeqle/projects/tools/dev/agentic-skills</cwd>
  <shell>bash</shell>
  <current_date>2026-06-14</current_date>
  <timezone>America/New_York</timezone>
  <filesystem><workspace_roots><root>/home/georgeqle/projects/tools/dev/agentic-skills</root></workspace_roots><permission_profile type="managed"><file_system type="restricted"><entry access="read"><special>:root</special></entry><entry access="write"><path>/home/georgeqle/projects/tools/dev/agentic-skills</path></entry><entry access="write"><special>:slash_tmp</special></entry><entry access="write"><special>:tmpdir</special></entry><entry access="read"><path>/home/georgeqle/projects/tools/dev/agentic-skills/.git</path></entry><entry access="read"><path>/home/georgeqle/projects/tools/dev/agentic-skills/.agents</path></entry><entry access="read"><path>/home/georgeqle/projects/tools/dev/agentic-skills/.codex</path></entry></file_system></permission_profile></filesystem>
</environment_context>

$analyze-sessions in one of our previous conversations in this directory, I identified that the agent was adding in extraneous negative reinforcing language into skills and documentation. I notice that it happens a lot when I as a user, provides feedback and the agent overadjusts by not removing what I ask or simply changing things, but changing/adding and then provide unnecessary emphasis on the negative. What is that called and how can we prevent that in the future? Especially in our research documents because that comes up a lot where I will request revisions and the agent doesn't just add or remove things, but actually emphasizes the negative which can cause confusion by bringing up something to future agents that shouldn't be there to begin with

<skill>
<name>analyze-sessions</name>
<path>/home/georgeqle/projects/tools/dev/agentic-skills/.codex/skills/analyze-sessions/SKILL.md</path>
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
