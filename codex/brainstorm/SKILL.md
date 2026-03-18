---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with /plan-interview
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/plan-interview` for deeper exploration and specification.

## Workflow

1. Read CLAUDE.md, README, package config, and key source files to understand the project.
2. Check `tasks/roadmap.md` and `tasks/todo.md` and `spec.md` if they exist — avoid suggesting things already planned.
3. Analyse the codebase across these dimensions:
   - Missing capabilities the architecture is set up for
   - Pain points, rough edges, or manual steps that could be automated
   - Technical debt where code has outgrown its design
   - Testing gaps in critical paths
   - Developer experience friction
   - Performance bottlenecks or low-hanging optimisations
   - Security hardening opportunities
   - Integration opportunities with external tools or APIs
4. If the user provides a focus area, scope the analysis there. Otherwise cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user.

Group suggestions by effort level (hours / days / weeks). Each suggestion should include:
- A specific, actionable title
- A one-line description with the concrete codebase signal that motivates it
- A `/plan-interview <topic>` prompt the user can copy-paste

## Constraints

- Be specific and actionable — no vague aspirations.
- Limit to 3–5 suggestions per effort level.
- Do not suggest changes that conflict with CLAUDE.md conventions.
- Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, or `spec.md`.
