---
skill: investigate
agent: codex
captured_at: 2026-06-02T00:00:00-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

# AGENTS.md instructions for /home/georgeqle/projects/tools/dev/agentic-skills

<INSTRUCTIONS>
<!-- provision-agentic-config v0.5 -->
## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Verification is mandatory, but routine no-op verification runs inside the active execution/shipping step. Enter plan mode for non-trivial remediation or new work discovered by verification, not for validation that already has clear commands and no expected source changes.
- Write detailed specs upfront to reduce ambiguity
- In Codex: use `update_plan` in Default mode and `request_user_input` only when already in Plan mode
- Do not assume a Claude-style clear-context-on-accept flow or related JSON setting exists

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
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing tests without being told how

### Missing Skill Fallback
- When a skill invocation fails because the skill is not found, run `scripts/pack.sh which <skill-name>` to check if the skill exists in an available pack.
- If found in an uninstalled pack, recommend `$pack install <skill>` for just that skill or `$pack install <pack>` for the full pack, and note the post-install reload path: Claude Code `/reload-skills` first, `/clear` can pick up the refreshed registry, restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible; Codex should start a fresh Codex CLI session if the `$` skill list remains stale.
- If found in an installed pack, suggest the same reload path to pick up the local skill roots.
- If not found in any pack, suggest `$skills` or `$skills search <keyword>`.

### Project Pack Command Resolution
- If a user invokes a command-like skill such as `$benchmark-test-skill design-system` and the leading command is not in the injected session skill list, search project-local packs before falling back to the trailing argument as the active skill.
- Check `packs/*/codex/<command>/SKILL.md` and pack metadata such as `packs/*/PACK.md`; project-local pack skills may exist in this repository even when they are not visible in the active session list.
- In this repository, `$benchmark-test-skill` lives under `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`, and `design-system` is its target skill argument.

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
- It is authored canonically in `CLAUDE.md` (the `### Alignment Page Template` block, between the `alignment-convention` markers) and propagated by `scripts/upgrade-alignment-page.mjs`. Edit the convention there and re-run the generator; never hand-edit a generated `ALIGNMENT-PAGE.md`.
- A skill's `## Alignment Page` section is a short stub that points at the sibling `ALIGNMENT-PAGE.md`; codex bundled files use the same content as claude.

## Task Management

1. **Plan First**: Write plan to `tasks/roadmap.md` (full plan) and `tasks/todo.md` (current phase) with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Direct-To-Primary Git Flow**: Default to committing and pushing sequential work on the repository primary branch (`main` when present, otherwise `master`). Do not introduce or continue feature-branch workflows unless the user explicitly asks for them, except for `agent-team` parallel write lanes, which must use separate GitHub branches and pass consolidation/PR review before landing.
- **Always Ship Mutations**: If a task creates or modifies tracked files, finish by committing and pushing all intended changes before stopping unless the user explicitly says not to. Codex `$exec` ships by default (validates, commits, pushes, plans next) — use `$ship` only to package existing work or unpushed commits.
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
  <current_date>2026-06-01</current_date>
  <timezone>America/New_York</timezone>
</environment_context>

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Anti-Sycophancy Clause For Research Skills

## Summary
Amend all active `type: research` skills for both Codex and Claude pack sources so research agents treat user feedback differently based on evidence:
- Push back when the user is factually wrong, misunderstanding evidence, or contradicting verified source material.
- Defer more heavily to the user on taste, positioning preference, strategic appetite, brand voice, or other subjective calls.
- Preserve evidence-first behavior without becoming argumentative.

This will target active `SKILL.md` files only, excluding every `archive/` copy.

## Key Changes
- Add a standard section, likely after `## Report-First Approval Gate`, named `## Evidence And Feedback Handling`.
- Use this shared clause:

```markdown
## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.
```

- Apply to all active research skill files in:
  - `packs/*/codex/**/SKILL.md`
  - `packs/*/claude/**/SKILL.md`
  - Installed `.codex/skills/*/SKILL.md` only through managed refresh where the installed copy comes from an updated pack source.
- Do not edit archived skills.

## Versioning And Changelog
- Before changing each affected skill directory, run `scripts/skill-archive.sh <skill-dir>`.
- Bump each changed skill’s `version:` by one decimal, for example `v0.7` to `v0.8`.
- Add a `CHANGELOG.md` entry dated `2026-06-02` for each affected skill:
  - “Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.”
- Do not refresh unrelated stale/missing skill installs as part of this task. If installed devtool research skills become stale after canonical pack edits, refresh only the relevant managed installs or reinstall the `devtool` pack copies.

## Implementation Notes
- First write the invocation prompt log required by repo policy under `prompts/investigate/`.
- Update `tasks/roadmap.md` and `tasks/todo.md` with the approved plan and current checklist before implementation.
- Use a generated active-file list from `find ... -path '*/archive/*' -prune ... | rg '^type: research$'` to prevent archive edits.
- Use a mechanical edit for the repeated clause and version bumps, then review diffs for representative Codex/Claude pairs and nested framework skills.
- Keep existing agent-specific command style intact: Codex skills keep `$skill`; Claude skills keep `/skill`.

## Test Plan
- Verify every active research skill has the new section exactly once.
- Verify no archived `SKILL.md` contains the newly added clause unless it was already there.
- Verify every changed active skill has:
  - incremented `version:`
  - matching `archive/<old-version>/SKILL.md`
  - a new changelog entry
- Run:
  - `scripts/pack.sh doctor`
  - `rg -n "Evidence And Feedback Handling|Treat user feedback as input" ...`
  - `git diff --check`
- Review `git diff --stat` and representative diffs from business, creator, game, devtool, remotion, and youtube packs.

## Assumptions
- “Research skills” means active skills with `type: research` in both Codex and Claude pack sources.
- Historical archives are immutable and should not be edited.
- Installed `.codex/skills` copies should follow canonical pack sources instead of being hand-edited.
- This is a substantive behavior change, so version bumps and archives are required.

continue
