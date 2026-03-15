---
description: Evaluate the codebase and suggest ideas to explore with /plan-interview
argument-hint: [optional: focus area e.g. "performance", "new features", "DX"]
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/plan-interview` for deeper exploration and specification.

## Process

1. **Understand the project**: Read CLAUDE.md, README, package config, and key source files to understand what the project does, its architecture, tech stack, and current state.
2. **Check existing plans**: Read `tasks/todo.md` and `spec.md` if they exist to understand work already planned or in progress — avoid suggesting things already covered.
3. **Analyse the codebase** across these dimensions:
   - **Missing capabilities**: Features the project's architecture is set up for but doesn't yet offer
   - **Pain points**: Rough edges, inconsistencies, or manual steps that could be automated
   - **Technical debt**: Areas where the code has outgrown its original design
   - **Testing gaps**: Untested critical paths or missing test infrastructure
   - **Developer experience**: Build times, debugging ergonomics, onboarding friction
   - **Performance opportunities**: Obvious bottlenecks or low-hanging optimisations
   - **Security hardening**: Areas where security posture could be improved
   - **Integration opportunities**: External tools, services, or APIs that would complement the project
4. **Scope**: If `$ARGUMENTS` is provided, focus the analysis on that area. Otherwise, cover all dimensions.

## Output Format

Present suggestions grouped by effort level, with each suggestion framed as a topic ready to hand to `/plan-interview`:

### Quick wins (hours)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview <topic>`

### Medium efforts (days)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview <topic>`

### Larger initiatives (weeks)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview <topic>`

## Constraints
- Each suggestion must be specific and actionable — not vague aspirations like "improve testing."
- Include the concrete signal from the codebase that motivates each suggestion (file, pattern, or metric).
- Provide the `/plan-interview <topic>` prompt the user can copy-paste to kick off planning.
- Limit to 3–5 suggestions per effort level to avoid overwhelming the user.
- Do not suggest changes that conflict with patterns established in CLAUDE.md.
- Do not repeat work already tracked in `tasks/todo.md` or `spec.md`.
