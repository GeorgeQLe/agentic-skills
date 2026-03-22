---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with /plan-interview
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/plan-interview` for deeper exploration and specification.

## Workflow

1. Read CLAUDE.md, README, package config, and key source files to understand the project.
2. Check `tasks/roadmap.md`, `tasks/todo.md`, and specs from `specs/` (or `spec.md`) if they exist — avoid suggesting things already planned.
3. Analyse the codebase across these dimensions:

   **Strategic / Product**
   - New features that would make the project significantly more useful or valuable
   - New workflows or end-to-end automation the project could enable
   - Product line expansion — adjacent use cases, new audiences, or complementary products the core could serve
   - Integration opportunities with external tools, platforms, or APIs that multiply value

   **Improvement**
   - Missing capabilities the architecture is set up for
   - Pain points, rough edges, or manual steps that could be automated
   - Performance bottlenecks or low-hanging optimisations
   - Developer experience friction

   **Hygiene**
   - Technical debt where code has outgrown its design
   - Testing gaps in critical paths
   - Security hardening opportunities

   **Market Fit** (only when `specs/icp.md` or `specs/mvp-gap.md` exist)
   - ICP alignment — features addressing ICP pain points that are missing or incomplete
   - Journey gaps — steps where the product loses the user or customer
   - Unaddressed MVP gaps from `specs/mvp-gap.md` not yet in roadmap
   - Competitive positioning weaknesses vs. the ICP's current alternatives
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
- Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.
