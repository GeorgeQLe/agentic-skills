---
name: trace
description: Follow a request end-to-end through the stack from route to database
type: review
version: 1.0.0
---

# Trace

Invoke as `$trace`.

Use this skill when the user wants to understand how a specific route, endpoint, or feature flows through the application stack.

## Workflow

1. Identify the entry point from the user's description.
2. Read CLAUDE.md for architecture context.
3. Trace forward through each layer: entry point → middleware → business logic → data access → response.
4. Map the data flow and types at each boundary.
5. Identify concerns: N+1 queries, auth gaps, type mismatches, performance issues.

## Output Format

- **Visual trace**: entry → middleware → handler → service → DB → response with file:line refs
- **Layer-by-layer detail**: file, inputs, outputs, what it does
- **Data flow**: how data transforms through the stack
- **Concerns found**: issues identified during the trace

## Constraints

- Follow actual code paths — do not guess from naming.
- Read each file in the chain.
- Do not modify any code — read-only analysis.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
