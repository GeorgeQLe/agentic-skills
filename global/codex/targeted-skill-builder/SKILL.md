---
name: targeted-skill-builder
description: Build or update one specific skill from a concrete workflow gap, correction, or repeated bad recommendation
type: execution
version: 1.0.0
argument-hint: "[workflow gap, correction, skill name, or capability request]"
---

# Targeted Skill Builder

Invoke as `$targeted-skill-builder`.

Use this skill when the user wants a narrow, durable workflow improvement from the current prompt or conversation: a concrete problem, user correction, repeated bad recommendation, or capability gap that may deserve a new skill, an existing-skill update, or a reusable prompt/template.

This is intentionally narrower than `$analyze-sessions`. Do not scan all Claude/Codex history by default. Treat broad session analysis as optional evidence only when the user explicitly asks for it. Use `$session-triage` first when one immediate issue, correction, repo incident, or suspected skill failure still needs verification before a skill change is designed.

## Workflow

1. Read `tasks/lessons.md` first when it exists. Extract only correction patterns relevant to the user's current request.
2. Identify the narrow workflow gap:
   - Problem or correction.
   - Triggering context from the current prompt/conversation.
   - Bad recommendation or missing capability to prevent.
   - Desired future behavior.
3. Ask for the intended output unless the user already made it explicit:
   - New skill.
   - Update existing skill.
   - Reusable prompt/template only.
   - Unsure, recommend.
4. Gather only targeted evidence:
   - Use the current prompt and conversation context first.
   - Read a named skill file when provided.
   - Inspect user-provided files or paths when provided.
   - Route to `$session-triage` when the user wants investigation of one immediate issue or the available evidence is not enough to verify the correction.
   - If examples are needed, ask for them or run a tightly scoped history query limited by path, skill name, date range, or exact phrase.
   - Do not scan all session history unless explicitly requested.
5. Search existing skills for overlap before creating anything:
   - Search `global/claude`, `global/codex`, `packs`, and project-local `.claude/skills` or `.codex/skills` when present.
   - Compare name, description, workflow, and next-step routing behavior.
   - If an existing skill substantially covers the job, recommend updating that skill instead of adding a duplicate.
6. Decide the smallest durable fix:
   - New skill: choose this only when no existing skill owns the workflow and the behavior is repeatable.
   - Existing skill update: choose this when the fix is a missing branch, constraint, evidence gate, or routing correction inside an existing workflow.
   - Reusable prompt/template: choose this when the behavior is too situational or not stable enough for a skill.
   - No repository change: choose this when the request is already covered and only needs a usage note.
7. Resolve the destination:
   - Default new shared Claude/Codex skills to this repository: `/Users/georgele/projects/tools/agentic-skills/global/claude/<name>/SKILL.md` and `/Users/georgele/projects/tools/agentic-skills/global/codex/<name>/SKILL.md`.
   - If the current session is not in the agentic-skills repository and the user wants to audit or amend an existing shared skill, do not edit a local copy. Provide a concise prompt for the user to run from `/Users/georgele/projects/tools/agentic-skills` with the target skill path and requested adjustment.
   - Use user-local `~/.claude/skills` or `~/.codex/skills` only when the user explicitly asks for a personal/local skill.
8. If creating or updating a repository skill:
   - Follow existing frontmatter conventions: `name`, specific `description`, `type`, `version`, and `argument-hint` when useful.
   - Keep `SKILL.md` concise and operational.
   - Include clear trigger conditions, workflow steps, outputs, constraints, and next-step routing for mutation-capable skills.
   - For Codex global skills, add `agents/openai.yaml` with display name, short description, default prompt, and implicit-invocation policy.
   - Update skill discovery docs and routing docs only when the new or changed skill must be discoverable or routed by other skills.
9. If writing a reusable prompt/template only:
   - Store it only when the user asks for a file or the current repo has an obvious prompt/template location.
   - Otherwise output the reusable prompt directly.
10. Run validation after repository skill changes:
    - `./install.sh`
    - `./scripts/skill-deps.sh --broken`
    - `./scripts/skill-versions.sh --missing`
    - `./scripts/skill-next-step-routing.sh --missing`
    - Targeted `rg` checks for the behavior being changed.
    - `git diff --check`
11. Update `tasks/todo.md` review notes with validation results.
12. Commit and push per the repository contract when tracked files changed.

## Output

Produce a concise report with:

- Decision: new skill, existing-skill update, reusable prompt/template, or no repository change.
- Evidence used and evidence intentionally skipped.
- Existing-skill overlap findings.
- Files created or changed, if any.
- Validation results.
- Reload note: after `./install.sh`, tell the user to start a fresh Claude Code or Codex CLI/session if the new or changed skill is not visible yet. Codex desktop sessions may list newly created skills only after the active skill registry refreshes; starting a fresh session is the reliable fallback.

When an external project session needs an existing shared skill amended, output a prompt like:

```text
From /Users/georgele/projects/tools/agentic-skills, run targeted-skill-builder for:
- Target skill: <path or skill name>
- Problem: <concrete correction or workflow gap>
- Desired change: <specific behavior>
- Evidence: <small scoped files/examples>
- Preferred output: update existing skill
```

## Constraints

- Prefer the smallest durable workflow fix.
- Do not create a broad meta-skill when a precise skill, existing-skill update, or reusable prompt solves the problem.
- Do not route every idea to `$spec-interview`; use `$feature-interview` when the planning destination is uncertain.
- Treat broad `$analyze-sessions` work as optional evidence for recurrence and trend analysis, not the default workflow.
- Use `$session-triage` for one immediate issue, correction, repo incident, or suspected skill failure that needs verification before building or updating a skill.
- Do not read unrelated history, projects, or private files for examples without user direction.
- Do not create or modify GitHub Actions workflows.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
